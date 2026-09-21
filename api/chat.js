// Vercel serverless function.
// Forwards to Anthropic; supports streaming when `stream: true` is set.
// The API key stays on the server (env var ANTHROPIC_API_KEY).

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' });
    return;
  }

  try {
    const {
      system,
      messages,
      model = 'claude-sonnet-4-20250514',
      max_tokens = 1000,
      stream = false,
    } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Missing messages array' });
      return;
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model, max_tokens, system, messages, stream }),
    });

    if (!anthropicRes.ok) {
      const errorText = await anthropicRes.text();
      let errorData;
      try { errorData = JSON.parse(errorText); } catch { errorData = { error: errorText }; }
      res.status(anthropicRes.status).json(errorData);
      return;
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      const reader = anthropicRes.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      } finally {
        res.end();
      }
      return;
    }

    const data = await anthropicRes.json();
    res.status(200).json(data);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: String(err?.message || err) });
    } else {
      try { res.end(); } catch {}
    }
  }
}
