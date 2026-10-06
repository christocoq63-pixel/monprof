// api/tts.js — Vercel serverless proxy pour ElevenLabs Text-to-Speech
//
// Reçoit : { text, voice_id, model_id?, language_code?, voice_settings? }
// Retourne : flux audio MP3 (Content-Type: audio/mpeg) ou JSON erreur.
//
// La clé ElevenLabs reste côté serveur — jamais exposée au client.
//
// ─── Déploiement ─────────────────────────────────────────────────────────────
// 1. Place ce fichier dans ton projet Vercel sous `/api/tts.js`
// 2. Dans Vercel → Project Settings → Environment Variables, ajoute :
//      ELEVENLABS_API_KEY = sk_… (ta clé perso ElevenLabs)
// 3. Redéploie (ou attends le prochain push)
//
// ─── Où trouver ta clé ───────────────────────────────────────────────────────
// https://elevenlabs.io → login → ton avatar en haut à droite →
// « Profile + API key » → copie la clé qui commence par « sk_ »
//
// ─── Modèle recommandé ───────────────────────────────────────────────────────
// `eleven_multilingual_v2`  : meilleure qualité multilingue (défaut ici)
// `eleven_turbo_v2_5`       : plus rapide, légèrement moins qualitatif, 50% moins cher
//
// ─── Coûts (plan Starter, octobre 2026) ──────────────────────────────────────
// ~0,30 € / 1000 caractères avec multilingual_v2
// Une phrase de prof moyenne = ~150 caractères = ~0,05 €
// Le cache côté client (dans l'app) évite les rappels pour les phrases répétées.

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ELEVENLABS_API_KEY not configured on server' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const {
    text,
    voice_id,
    model_id = 'eleven_multilingual_v2',
    language_code = 'fr',
    voice_settings = {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true,
    },
  } = body;

  if (!text || !voice_id) {
    return new Response(
      JSON.stringify({ error: 'text and voice_id are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Garde-fou : texte trop long = facture trop lourde + risque d'abus
  if (text.length > 1500) {
    return new Response(
      JSON.stringify({ error: 'text too long (max 1500 chars per call)' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice_id)}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id,
          voice_settings,
          // Le code langue aide ElevenLabs à mieux prononcer. 'fr' marche bien
          // pour le kreol mauricien (lexifié sur le français).
          ...(language_code ? { language_code } : {}),
        }),
      }
    );

    if (!upstream.ok) {
      const txt = await upstream.text().catch(() => '');
      return new Response(
        JSON.stringify({
          error: `ElevenLabs API error: ${upstream.status}`,
          details: txt.slice(0, 500),
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Streaming direct du flux audio vers le client
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        // Permet au navigateur de mettre en cache l'audio pendant 1h
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
