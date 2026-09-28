import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Send, ArrowLeft, Loader2, BookOpen, RefreshCw, Mic, MicOff, BookText, X, MessageCircle, LogOut, Mail, Lock, User, UserCircle, Calendar, MapPin, Phone, Globe2, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ─── COUNTRY DIAL CODES ───────────────────────────────────────────────────────

const COUNTRIES = [
  { code: 'FR', dial: '+33',  name: 'France',        flag: '🇫🇷' },
  { code: 'BE', dial: '+32',  name: 'Belgique',      flag: '🇧🇪' },
  { code: 'CH', dial: '+41',  name: 'Suisse',        flag: '🇨🇭' },
  { code: 'CA', dial: '+1',   name: 'Canada',        flag: '🇨🇦' },
  { code: 'LU', dial: '+352', name: 'Luxembourg',    flag: '🇱🇺' },
  { code: 'MC', dial: '+377', name: 'Monaco',        flag: '🇲🇨' },
  { code: 'US', dial: '+1',   name: 'États-Unis',    flag: '🇺🇸' },
  { code: 'GB', dial: '+44',  name: 'Royaume-Uni',   flag: '🇬🇧' },
  { code: 'IE', dial: '+353', name: 'Irlande',       flag: '🇮🇪' },
  { code: 'ES', dial: '+34',  name: 'Espagne',       flag: '🇪🇸' },
  { code: 'PT', dial: '+351', name: 'Portugal',      flag: '🇵🇹' },
  { code: 'IT', dial: '+39',  name: 'Italie',        flag: '🇮🇹' },
  { code: 'DE', dial: '+49',  name: 'Allemagne',     flag: '🇩🇪' },
  { code: 'AT', dial: '+43',  name: 'Autriche',      flag: '🇦🇹' },
  { code: 'NL', dial: '+31',  name: 'Pays-Bas',      flag: '🇳🇱' },
  { code: 'DK', dial: '+45',  name: 'Danemark',      flag: '🇩🇰' },
  { code: 'SE', dial: '+46',  name: 'Suède',         flag: '🇸🇪' },
  { code: 'NO', dial: '+47',  name: 'Norvège',       flag: '🇳🇴' },
  { code: 'FI', dial: '+358', name: 'Finlande',      flag: '🇫🇮' },
  { code: 'PL', dial: '+48',  name: 'Pologne',       flag: '🇵🇱' },
  { code: 'CZ', dial: '+420', name: 'Tchéquie',      flag: '🇨🇿' },
  { code: 'GR', dial: '+30',  name: 'Grèce',         flag: '🇬🇷' },
  { code: 'TR', dial: '+90',  name: 'Turquie',       flag: '🇹🇷' },
  { code: 'RU', dial: '+7',   name: 'Russie',        flag: '🇷🇺' },
  { code: 'JP', dial: '+81',  name: 'Japon',         flag: '🇯🇵' },
  { code: 'CN', dial: '+86',  name: 'Chine',         flag: '🇨🇳' },
  { code: 'KR', dial: '+82',  name: 'Corée du Sud',  flag: '🇰🇷' },
  { code: 'IN', dial: '+91',  name: 'Inde',          flag: '🇮🇳' },
  { code: 'AU', dial: '+61',  name: 'Australie',     flag: '🇦🇺' },
  { code: 'NZ', dial: '+64',  name: 'Nouvelle-Zélande', flag: '🇳🇿' },
  { code: 'BR', dial: '+55',  name: 'Brésil',        flag: '🇧🇷' },
  { code: 'MX', dial: '+52',  name: 'Mexique',       flag: '🇲🇽' },
  { code: 'AR', dial: '+54',  name: 'Argentine',     flag: '🇦🇷' },
  { code: 'MA', dial: '+212', name: 'Maroc',         flag: '🇲🇦' },
  { code: 'DZ', dial: '+213', name: 'Algérie',       flag: '🇩🇿' },
  { code: 'TN', dial: '+216', name: 'Tunisie',       flag: '🇹🇳' },
  { code: 'SN', dial: '+221', name: 'Sénégal',       flag: '🇸🇳' },
  { code: 'CI', dial: '+225', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'CM', dial: '+237', name: 'Cameroun',      flag: '🇨🇲' },
  { code: 'MU', dial: '+230', name: 'Maurice',       flag: '🇲🇺' },
  { code: 'RE', dial: '+262', name: 'La Réunion',    flag: '🇷🇪' },
  { code: 'ZA', dial: '+27',  name: 'Afrique du Sud',flag: '🇿🇦' },
  { code: 'AE', dial: '+971', name: 'Émirats',       flag: '🇦🇪' },
  { code: 'SA', dial: '+966', name: 'Arabie Saoudite', flag: '🇸🇦' },
  { code: 'IL', dial: '+972', name: 'Israël',        flag: '🇮🇱' },
];

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// Supports both the new PUBLISHABLE_KEY name (2025+) and the legacy ANON_KEY
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// ─── LANGUAGES & AVATARS ──────────────────────────────────────────────────────

const LANGUAGES = {
  en: {
    code: 'en', name: 'Anglais', nativeName: 'English', glyph: 'EN',
    ttsLocale: 'en-US', srLocale: 'en-US', srSupported: true,
    accent: '#B85B3F',
    avatars: [
      { id:'emma', gender:'female', name:'Emma', age:28, location:'Manchester, UK', role:'Amie de café',
        tagline:'Détendue, vie quotidienne, séries, week-end',
        persona:'casual, warm British English, uses colloquial expressions',
        color:'#B85B3F', soft:'#F6E2D4', pattern:'circles',
        voiceHint:['samantha','kate','serena','female','martha','amelie'],
        greetings:[{t:"Hey! How's it going today?", fr:"Salut ! Comment ça va aujourd'hui ?"},
                   {t:"Hi there! What've you been up to?", fr:"Coucou ! Qu'est-ce que tu as fait de beau ?"}]},
      { id:'marcus', gender:'male', name:'Marcus', age:35, location:'San Francisco, USA', role:'Ingénieur logiciel',
        tagline:'Tech, boulot, projets, idées',
        persona:'direct, professional American English, brings up technical topics naturally',
        color:'#2D5F8A', soft:'#D5E2EF', pattern:'grid',
        voiceHint:['daniel','alex','fred','tom','aaron','male'],
        greetings:[{t:"Hey, nice to meet you. What kind of work do you do?", fr:"Hé, ravi de te rencontrer. Tu fais quoi comme boulot ?"},
                   {t:"Hi! Working on anything fun lately?", fr:"Salut ! Tu bosses sur des trucs sympas ?"}]},
      { id:'hannah', gender:'female', name:'Hannah', age:32, location:'Dublin, Ireland', role:"Professeure d'anglais",
        tagline:'Patiente, claire, parle doucement',
        persona:'gentle, clear, slightly slower English, very reassuring',
        color:'#3F6B4E', soft:'#DCE8DF', pattern:'lines',
        voiceHint:['fiona','moira','karen','tessa','female'],
        greetings:[{t:"Hello! Take your time. What would you like to chat about?", fr:"Bonjour ! Prends ton temps. De quoi veux-tu parler ?"},
                   {t:"Hi! Tell me a bit about yourself.", fr:"Salut ! Parle-moi un peu de toi."}]},
      { id:'oliver', gender:'male', name:'Oliver', age:47, location:'Oxford, UK', role:'Universitaire',
        tagline:'Cultivé, humour pince-sans-rire, sujets de fond',
        persona:'formal, witty, intellectual British English, dry humor',
        color:'#7A4A2F', soft:'#EBD7C5', pattern:'dots',
        voiceHint:['daniel','oliver','arthur','gordon','male'],
        greetings:[{t:"Good day. What's been on your mind recently?", fr:"Bonjour. Qu'est-ce qui vous occupe l'esprit ces temps-ci ?"},
                   {t:"Hello there. Care for an interesting conversation?", fr:"Bonjour. Envie d'une discussion intéressante ?"}]},
      { id:'priya', gender:'female', name:'Priya', age:31, location:'Bangalore, India', role:'Développeuse logicielle',
        tagline:'Anglais indien, tech, voyages, cuisine',
        persona:'Indian English (educated Bangalore accent), warm and articulate. Occasionally uses Hinglish expressions like "yaar", "actually", or sentence-final "no?" naturally. Brings up tech and travel topics.',
        color:'#A16207', soft:'#EFE0C7', pattern:'dots',
        voiceHint:['veena','rishi','raveena','lekha','heera','female'],
        greetings:[{t:"Hi! Nice to meet you. So tell me, what do you do?", fr:"Salut ! Ravi de te rencontrer. Dis-moi, tu fais quoi ?"},
                   {t:"Hello, how is your day going? Working on something interesting?", fr:"Bonjour, comment se passe ta journée ? Tu travailles sur quelque chose d'intéressant ?"}]},
      { id:'karim', gender:'male', name:'Karim', age:41, location:'Dubaï, EAU', role:'Ingénieur',
        tagline:'Anglais arabe, business, ingénierie',
        persona:'Gulf-Arab-accented professional English, warm and polite. Occasionally uses Arabic expressions like "Inshallah" or "Mashallah" naturally. Focus on engineering, business and culture.',
        color:'#1E3A5F', soft:'#D0DAE5', pattern:'grid',
        voiceHint:['majed','tarik','daniel','male'],
        greetings:[{t:"Hello, pleased to meet you. What field do you work in?", fr:"Bonjour, ravi de vous rencontrer. Vous travaillez dans quel domaine ?"},
                   {t:"Hi there. How is your day going so far?", fr:"Bonjour. Comment se passe votre journée jusqu'ici ?"}]},
    ],
  },
  es: {
    code: 'es', name: 'Espagnol', nativeName: 'Español', glyph: 'ES',
    ttsLocale: 'es-ES', srLocale: 'es-ES', srSupported: true,
    accent: '#C2410C',
    avatars: [
      { id:'lucia', gender:'female', name:'Lucía', age:27, location:'Madrid, España', role:'Amie de café',
        tagline:'Castillan moderne, sorties, ciné, food',
        persona:'casual Castilian Spanish from Madrid, friendly and energetic',
        color:'#C2410C', soft:'#FBE4D2', pattern:'circles',
        voiceHint:['monica','marisol','paulina','female'],
        greetings:[{t:"¡Hola! ¿Qué tal te va el día?", fr:"Salut ! Comment se passe ta journée ?"},
                   {t:"¿Qué tal? Cuéntame algo.", fr:"Ça va ? Raconte-moi quelque chose."}]},
      { id:'diego', gender:'male', name:'Diego', age:34, location:'Buenos Aires, Argentina', role:'Designer',
        tagline:'Espagnol argentin, créativité, voyages',
        persona:'Argentine Spanish (rioplatense), uses "vos" and "che", warm and chatty',
        color:'#6B4D9B', soft:'#E1D8EE', pattern:'lines',
        voiceHint:['jorge','diego','juan','carlos','male'],
        greetings:[{t:"¡Che, qué bueno conocerte! ¿De dónde sos?", fr:"Hé, content de te connaître ! D'où tu viens ?"},
                   {t:"Hola, ¿qué onda? ¿Cómo estás?", fr:"Salut, ça roule ? Comment ça va ?"}]},
      { id:'carmen', gender:'female', name:'Carmen', age:42, location:'Ciudad de México', role:"Professeure d'espagnol",
        tagline:'Espagnol mexicain, claire et patiente',
        persona:'Mexican Spanish, very patient teacher, speaks clearly and slowly',
        color:'#4A7C59', soft:'#DCE8DF', pattern:'dots',
        voiceHint:['paulina','esperanza','female'],
        greetings:[{t:"Hola, mucho gusto. ¿Cómo te llamas?", fr:"Bonjour, enchantée. Comment tu t'appelles ?"},
                   {t:"Bienvenido. ¿De qué te gustaría hablar?", fr:"Bienvenue. De quoi aimerais-tu parler ?"}]},
    ],
  },
  de: {
    code: 'de', name: 'Allemand', nativeName: 'Deutsch', glyph: 'DE',
    ttsLocale: 'de-DE', srLocale: 'de-DE', srSupported: true,
    accent: '#374151',
    avatars: [
      { id:'lena', gender:'female', name:'Lena', age:26, location:'Berlin, Deutschland', role:'Amie créative',
        tagline:'Berlinois moderne, culture, sorties',
        persona:'casual Berliner German, hip and modern',
        color:'#5B6CB8', soft:'#DDE2F0', pattern:'lines',
        voiceHint:['anna','helena','steffi','female'],
        greetings:[{t:"Hi! Wie läuft's bei dir?", fr:"Salut ! Comment ça se passe pour toi ?"},
                   {t:"Hallo! Was machst du so?", fr:"Salut ! Tu fais quoi de beau ?"}]},
      { id:'klaus', gender:'male', name:'Klaus', age:48, location:'München, Deutschland', role:'Ingénieur',
        tagline:'Précis, technique, sujets de fond',
        persona:'precise, structured German, professional',
        color:'#374151', soft:'#D6DAE0', pattern:'grid',
        voiceHint:['markus','stefan','yannick','male'],
        greetings:[{t:"Guten Tag. Womit beschäftigen Sie sich beruflich?", fr:"Bonjour. Que faites-vous comme métier ?"},
                   {t:"Hallo. Worüber möchten Sie sprechen?", fr:"Bonjour. De quoi souhaitez-vous parler ?"}]},
      { id:'anja', gender:'female', name:'Anja', age:38, location:'Wien, Österreich', role:"Professeure d'allemand",
        tagline:'Autrichienne, douce, parle clairement',
        persona:'Austrian German (softer accent), patient and clear',
        color:'#6B7A3F', soft:'#E2E6D3', pattern:'dots',
        voiceHint:['petra','greta','female'],
        greetings:[{t:"Grüß Sie! Wie geht es Ihnen?", fr:"Bonjour ! Comment allez-vous ?"},
                   {t:"Hallo. Lassen Sie uns ein bisschen plaudern.", fr:"Bonjour. Bavardons un peu."}]},
    ],
  },
  it: {
    code: 'it', name: 'Italien', nativeName: 'Italiano', glyph: 'IT',
    ttsLocale: 'it-IT', srLocale: 'it-IT', srSupported: true,
    accent: '#9A3412',
    avatars: [
      { id:'giulia', gender:'female', name:'Giulia', age:30, location:'Roma, Italia', role:'Amie de café',
        tagline:'Romaine, expressive, food et dolce vita',
        persona:'expressive Roman Italian, warm and lively',
        color:'#B85B3F', soft:'#F6E2D4', pattern:'circles',
        voiceHint:['alice','silvia','federica','female'],
        greetings:[{t:"Ciao! Come va oggi?", fr:"Salut ! Comment ça va aujourd'hui ?"},
                   {t:"Ehi, ciao! Raccontami qualcosa di te.", fr:"Hé, salut ! Raconte-moi quelque chose sur toi."}]},
      { id:'marco', gender:'male', name:'Marco', age:42, location:'Milano, Italia', role:'Designer',
        tagline:'Italien du Nord, raffiné, design',
        persona:'refined Northern Italian (Milanese), elegant and professional',
        color:'#1E3A5F', soft:'#D0DAE5', pattern:'grid',
        voiceHint:['luca','paolo','marco','male'],
        greetings:[{t:"Buongiorno. Di cosa ti occupi?", fr:"Bonjour. De quoi t'occupes-tu ?"},
                   {t:"Ciao, piacere. Cosa ti porta qui?", fr:"Salut, enchanté. Qu'est-ce qui t'amène ?"}]},
      { id:'sofia', gender:'female', name:'Sofia', age:55, location:'Firenze, Italia', role:"Professeure d'italien",
        tagline:'Toscane, claire, patiente, classique',
        persona:'classic Tuscan Italian, very clear and patient teacher',
        color:'#7A4A2F', soft:'#EBD7C5', pattern:'dots',
        voiceHint:['alice','federica','silvia','female'],
        greetings:[{t:"Salve! Da dove viene?", fr:"Bonjour ! D'où venez-vous ?"},
                   {t:"Ciao. Come ti chiami?", fr:"Salut. Comment tu t'appelles ?"}]},
    ],
  },
  pt: {
    code: 'pt', name: 'Portugais', nativeName: 'Português', glyph: 'PT',
    ttsLocale: 'pt-BR', srLocale: 'pt-BR', srSupported: true,
    accent: '#15803D',
    avatars: [
      { id:'rafael', gender:'male', name:'Rafael', age:32, location:'Rio de Janeiro, Brasil', role:'Ami carioca',
        tagline:'Portugais brésilien, plage, musique, foot',
        persona:'casual Brazilian Portuguese (carioca), relaxed and warm',
        color:'#15803D', soft:'#D5E8D9', pattern:'circles',
        voiceHint:['felipe','luciana','male'],
        greetings:[{t:"E aí, beleza? Tudo bem com você?", fr:"Salut, ça va ? Tout va bien ?"},
                   {t:"Oi! O que você anda fazendo?", fr:"Salut ! Qu'est-ce que tu fais en ce moment ?"}]},
      { id:'beatriz', gender:'female', name:'Beatriz', age:34, location:'Lisboa, Portugal', role:'Amie lisboète',
        tagline:'Portugais européen, calme, culture',
        persona:'European Portuguese (Lisbon), elegant and clear pronunciation',
        color:'#2D5F8A', soft:'#D5E2EF', pattern:'lines',
        voiceHint:['joana','catarina','female'],
        greetings:[{t:"Olá, tudo bem? Como tem passado?", fr:"Bonjour, ça va ? Comment vous portez-vous ?"},
                   {t:"Boa tarde. De onde é?", fr:"Bonjour. D'où venez-vous ?"}]},
      { id:'joao', gender:'male', name:'João', age:45, location:'São Paulo, Brasil', role:"Professeur de portugais",
        tagline:'Patient, clair, brésilien standard',
        persona:'standard Brazilian Portuguese, patient teacher',
        color:'#6B4D9B', soft:'#E1D8EE', pattern:'dots',
        voiceHint:['felipe','daniel','ricardo','male'],
        greetings:[{t:"Olá! Como você se chama?", fr:"Salut ! Comment tu t'appelles ?"},
                   {t:"Oi, prazer. Sobre o que quer conversar?", fr:"Bonjour, enchanté. De quoi veux-tu parler ?"}]},
    ],
  },
  ja: {
    code: 'ja', name: 'Japonais', nativeName: '日本語', glyph: 'JA',
    ttsLocale: 'ja-JP', srLocale: 'ja-JP', srSupported: true,
    accent: '#9D174D',
    avatars: [
      { id:'yuki', gender:'female', name:'Yuki', age:26, location:'東京 (Tokyo)', role:'Amie tokyoïte',
        tagline:'Décontractée, pop culture, café',
        persona:'casual modern Tokyo Japanese, friendly and conversational',
        color:'#9D174D', soft:'#F0D5DE', pattern:'circles',
        voiceHint:['kyoko','haruka','female'],
        greetings:[{t:"こんにちは！元気ですか？", fr:"Bonjour ! Comment vas-tu ?"},
                   {t:"やあ、最近どうしてた？", fr:"Hé, qu'est-ce que tu deviens ?"}]},
      { id:'takeshi', gender:'male', name:'Takeshi', age:54, location:'京都 (Kyoto)', role:'Professeur',
        tagline:'Japonais soutenu, patient',
        persona:'polite, classical Kyoto Japanese, very patient with learners',
        color:'#3F2A1F', soft:'#E5DBD0', pattern:'dots',
        voiceHint:['otoya','hattori','male'],
        greetings:[{t:"こんにちは。お名前は何ですか？", fr:"Bonjour. Comment vous appelez-vous ?"},
                   {t:"はじめまして。何について話したいですか？", fr:"Enchanté. De quoi voulez-vous parler ?"}]},
      { id:'aiko', gender:'female', name:'Aiko', age:33, location:'大阪 (Osaka)', role:"Professeure de japonais",
        tagline:'Kansai, chaleureuse, claire',
        persona:'Kansai (Osaka) Japanese, warm and friendly teacher',
        color:'#5B6CB8', soft:'#DDE2F0', pattern:'lines',
        voiceHint:['kyoko','sayaka','female'],
        greetings:[{t:"こんにちは！日本語を勉強していますか？", fr:"Bonjour ! Tu étudies le japonais ?"},
                   {t:"はじめまして！ゆっくり話しましょうね。", fr:"Enchantée ! Parlons doucement, d'accord ?"}]},
    ],
  },
  zh: {
    code: 'zh', name: 'Mandarin', nativeName: '中文', glyph: '中',
    ttsLocale: 'zh-CN', srLocale: 'zh-CN', srSupported: true,
    accent: '#B91C1C',
    avatars: [
      { id:'mei', gender:'female', name:'Mei', age:28, location:'上海 (Shanghai)', role:'Amie',
        tagline:'Mandarin moderne, vie urbaine',
        persona:'modern Mandarin from Shanghai, casual and friendly',
        color:'#B91C1C', soft:'#F4D5D5', pattern:'circles',
        voiceHint:['tingting','meijia','female'],
        greetings:[{t:"你好！今天怎么样？", fr:"Salut ! Comment ça va aujourd'hui ?"},
                   {t:"嗨，最近忙吗？", fr:"Coucou, occupé ces temps-ci ?"}]},
      { id:'wei', gender:'male', name:'Wei', age:45, location:'北京 (Beijing)', role:'Professeur de mandarin',
        tagline:'Mandarin standard, patient, clair',
        persona:'standard Beijing Mandarin, patient teacher with clear pronunciation',
        color:'#A16207', soft:'#EFE0C7', pattern:'dots',
        voiceHint:['tian-tian','male'],
        greetings:[{t:"你好。你叫什么名字？", fr:"Bonjour. Comment vous appelez-vous ?"},
                   {t:"欢迎！你想聊什么？", fr:"Bienvenue ! De quoi voulez-vous parler ?"}]},
      { id:'lin', gender:'female', name:'Lin', age:31, location:'台北 (Taipei)', role:'Designer',
        tagline:'Mandarin taïwanais, créative',
        persona:'Taiwanese Mandarin, soft-spoken and creative',
        color:'#4D7C0F', soft:'#DEEAC8', pattern:'lines',
        voiceHint:['sin-ji','meijia','female'],
        greetings:[{t:"嗨，你好！你住在哪裡？", fr:"Salut ! Tu habites où ?"},
                   {t:"哈囉，最近做什麼？", fr:"Coucou, qu'est-ce que tu fais en ce moment ?"}]},
    ],
  },
  ar: {
    code: 'ar', name: 'Arabe', nativeName: 'العربية', glyph: 'AR',
    ttsLocale: 'ar-SA', srLocale: 'ar-SA', srSupported: true, rtl: true,
    accent: '#1E40AF',
    avatars: [
      { id:'layla', gender:'female', name:'Layla', age:32, location:'Beyrouth, Liban', role:'Journaliste',
        tagline:'Arabe levantin, culture, actualité',
        persona:'Levantine Arabic (Lebanese), educated and culturally engaged',
        color:'#1E40AF', soft:'#D6DEF2', pattern:'circles',
        voiceHint:['laila','majed','female'],
        greetings:[{t:"مرحبا! كيف حالك اليوم؟", fr:"Bonjour ! Comment vas-tu aujourd'hui ?"},
                   {t:"أهلا. عن أي موضوع تحب أن نتكلم؟", fr:"Salut. De quel sujet aimerais-tu qu'on parle ?"}]},
      { id:'omar', gender:'male', name:'Omar', age:44, location:'القاهرة (Le Caire)', role:'Professeur',
        tagline:'Arabe standard moderne, patient',
        persona:'Modern Standard Arabic (MSA), patient Egyptian teacher',
        color:'#A16207', soft:'#EFE0C7', pattern:'dots',
        voiceHint:['majed','tarik','male'],
        greetings:[{t:"السلام عليكم. ما اسمك؟", fr:"Salam aleykoum. Comment t'appelles-tu ?"},
                   {t:"مرحبا. هل تتعلم العربية؟", fr:"Bonjour. Apprends-tu l'arabe ?"}]},
    ],
  },
  mfe: {
    code: 'mfe', name: 'Créole mauricien', nativeName: 'Kreol Morisien', glyph: 'MU',
    ttsLocale: 'fr-FR', srLocale: 'fr-FR', srSupported: false,
    accent: '#0F766E',
    avatars: [
      { id:'anais', gender:'female', name:'Anaïs', age:30, location:'Port-Louis, Maurice', role:'Amie',
        tagline:'Décontractée, plage, lagon, séga',
        persona:`casual Mauritian Creole, warm and lively.
- Use authentic Mauritian expressions constantly: "Ki manyer", "Bonzour", "Korek", "Zenfan", "Mo bro", "Mo ser", "Ala", "Samem sa", "Ayo", "Mo bon", "Bonpe", "Ti-mama", "Ki nouvel", "Kot to ete", "Pa gagn traka", "Kontan trouv twa".
- Use "mo/to" (I/you), "pe" for progressive tense, "ti" for past tense.
- Talk about lagoon, beach, gato-pima, dholl-puri, séga music, weekends in Blue Bay or Trou aux Biches, family Sundays.
- Mix in a French or English word sometimes as Mauritians naturally do.
- Never use standard French — always Creole spelling (e.g. "azordi" not "aujourd'hui", "koz" not "parler", "bien" stays "bien", "kot" not "où").`,
        color:'#0F766E', soft:'#CDE8E5', pattern:'circles',
        // Google FR is warmer than Windows Hortense; French Canadian is more melodious.
        voiceHint:['google français','google french','amélie','audrey','virginie','marie','female'],
        rate: 0.82, pitch: 1.05,
        greetings:[{t:"Bonzour mo ser ! Ki manyer azordi, korek ?", fr:"Bonjour ma sœur ! Comment ça va aujourd'hui, tout va bien ?"},
                   {t:"Eh salu ! Ki to pe fer ? Mo kontan trouv twa.", fr:"Hé salut ! Qu'est-ce que tu fais ? Je suis contente de te voir."}]},
      { id:'ravi', gender:'male', name:'Ravi', age:42, location:'Curepipe, Maurice', role:'Ingénieur',
        tagline:'Pragmatique, parle boulot, projets',
        persona:`professional Mauritian Creole.
- Mixes Creole with French and English words as is natural for Mauritian professionals (e.g. "mo pe travay lor enn projet interesan").
- Use "mo bro", "ki manyer", "korek sa", "azordi", "demen".
- Discusses work, engineering, tech, cyclones, elections, family. Direct but warm.
- Never respond in standard French — always Creole.`,
        color:'#7C2D12', soft:'#EFD8C9', pattern:'grid',
        voiceHint:['google français','google french','thomas','nicolas','daniel','male'],
        rate: 0.85, pitch: 0.95,
        greetings:[{t:"Bonzour mo bro. Ki manyer ? To travay dan ki domenn ?", fr:"Bonjour mon ami. Comment ça va ? Tu travailles dans quel domaine ?"},
                   {t:"Salam, ki nouvel ? Ki to pe fer sa lasemenn la ?", fr:"Salut, quelles nouvelles ? Qu'est-ce que tu fais cette semaine ?"}]},
      { id:'marie', gender:'female', name:'Marie', age:48, location:'Beau Bassin, Maurice', role:'Professeure',
        tagline:'Patiente, explique tout, créole standard',
        persona:`standard Mauritian Creole teacher, patient and clear.
- Speaks slowly and repeats important words.
- Uses classic teacher expressions: "mo zanfan", "gete bien", "konpran ?", "pran twa letan", "byen tranquil", "pa gagn traka".
- Explains vocabulary when the learner seems lost. Never switches to French.
- Warm, motherly tone. Uses "to" (informal you) affectionately.`,
        color:'#5B21B6', soft:'#DDD3F0', pattern:'dots',
        voiceHint:['google français','google french','audrey','marie','virginie','female'],
        rate: 0.78, pitch: 1.0,
        greetings:[{t:"Bonzour mo zanfan. Kouma to apele, di mwa ?", fr:"Bonjour mon enfant. Comment tu t'appelles, dis-moi ?"},
                   {t:"Bonzour ! Pran twa letan. Ki to anvi koz lor li azordi ?", fr:"Bonjour ! Prends ton temps. De quoi as-tu envie de parler aujourd'hui ?"}]},
    ],
  },
  fr: {
    code: 'fr', name: 'Français', nativeName: 'Français', glyph: 'FR',
    ttsLocale: 'fr-FR', srLocale: 'fr-FR', srSupported: true,
    accent: '#2E5C8A',
    avatars: [
      { id:'lea', gender:'female', name:'Léa', age:28, location:'Paris, France', role:'Amie de café',
        tagline:'Parisienne, détendue, tendance',
        persona:`casual modern Parisian French, warm and lively.
- Use natural Parisian expressions: "du coup", "en fait", "carrément", "grave", "c'est ouf", "trop bien", "je te jure".
- Talk about cafés, weekends, séries, sorties, culture, food, actualité.
- Uses "tu" naturally, contractions ("j'sais pas", "chuis"), fluid speech.
- Warm, friendly, uses subtle humor.`,
        color:'#2E5C8A', soft:'#D5E2EF', pattern:'circles',
        voiceHint:['google français','google french','amélie','audrey','virginie','marie','female'],
        rate: 0.92, pitch: 1.0,
        greetings:[{t:"Salut ! Ça va aujourd'hui ?", fr:"Hi! How are you today?"},
                   {t:"Coucou ! Alors, quoi de neuf ?", fr:"Hey! So, what's new?"}]},
      { id:'antoine', gender:'male', name:'Antoine', age:42, location:'Lyon, France', role:'Ingénieur',
        tagline:'Pragmatique, boulot, projets tech',
        persona:`professional French from Lyon, precise and technical.
- Uses proper business French but stays warm.
- Discusses engineering, tech, work, family, culture.
- Balanced formal/informal, uses "vous" at first then may switch to "tu".`,
        color:'#7C2D12', soft:'#EFD8C9', pattern:'grid',
        voiceHint:['google français','google french','thomas','nicolas','daniel','male'],
        rate: 0.9, pitch: 0.95,
        greetings:[{t:"Bonjour ! Enchanté. Vous travaillez dans quel domaine ?", fr:"Hello! Nice to meet you. What field do you work in?"},
                   {t:"Bonjour, comment allez-vous aujourd'hui ?", fr:"Hello, how are you today?"}]},
      { id:'fatou', gender:'female', name:'Fatou', age:35, location:'Dakar, Sénégal', role:'Journaliste',
        tagline:'Français africain, culture, actualité',
        persona:`Senegalese French journalist, warm and articulate.
- Uses standard French with occasional West-African expressions ("dis donc", "ah bon !", "c'est parti").
- Discusses culture, actualité, voyages, cuisine.
- Very expressive and encouraging.`,
        color:'#0F766E', soft:'#CDE8E5', pattern:'lines',
        voiceHint:['google français','google french','audrey','amélie','female'],
        rate: 0.9, pitch: 1.02,
        greetings:[{t:"Bonjour ! Ravie de te rencontrer. D'où viens-tu ?", fr:"Hello! Nice to meet you. Where are you from?"},
                   {t:"Salut ! Comment tu vas ? Raconte-moi un peu.", fr:"Hi! How are you? Tell me a bit about yourself."}]},
      { id:'marie_fr', gender:'female', name:'Marie', age:48, location:'Aix-en-Provence, France', role:"Professeure de français",
        tagline:'Patiente, claire, français standard',
        persona:`standard French teacher from Provence, very patient.
- Speaks slowly and clearly, repeats important words.
- Uses simple vocabulary at first, gradually introduces more complex terms.
- Explains grammar naturally when useful. Very warm and encouraging.`,
        color:'#5B21B6', soft:'#DDD3F0', pattern:'dots',
        voiceHint:['google français','google french','marie','audrey','virginie','female'],
        rate: 0.82, pitch: 1.0,
        greetings:[{t:"Bonjour ! Prenez votre temps. Comment vous appelez-vous ?", fr:"Hello! Take your time. What's your name?"},
                   {t:"Bienvenue ! De quoi aimeriez-vous parler aujourd'hui ?", fr:"Welcome! What would you like to talk about today?"}]},
    ],
  },
};

// Face features per avatar — gives each character a distinct look
const FACES = {
  emma:    { eyes:'lashes', mouth:'wide-smile', accessory:null,            blush:true },
  marcus:  { eyes:'round',  mouth:'neutral',    accessory:'glasses-square' },
  hannah:  { eyes:'round',  mouth:'wide-smile', accessory:null,            freckles:true },
  oliver:  { eyes:'round',  mouth:'smirk',      accessory:'glasses-round', moustache:true },
  priya:   { eyes:'lashes', mouth:'smile',      accessory:'bindi' },
  karim:   { eyes:'round',  mouth:'neutral',    accessory:'beard' },
  lucia:   { eyes:'lashes', mouth:'wide-smile', accessory:'lipstick' },
  diego:   { eyes:'round',  mouth:'smile',      accessory:'beard' },
  carmen:  { eyes:'round',  mouth:'wide-smile', accessory:null },
  lena:    { eyes:'round',  mouth:'smile',      accessory:null },
  klaus:   { eyes:'round',  mouth:'neutral',    accessory:'glasses-square' },
  anja:    { eyes:'round',  mouth:'wide-smile', accessory:null },
  giulia:  { eyes:'lashes', mouth:'wide-smile', accessory:'lipstick' },
  marco:   { eyes:'round',  mouth:'smirk',      accessory:null },
  sofia:   { eyes:'round',  mouth:'wide-smile', accessory:null },
  rafael:  { eyes:'round',  mouth:'wide-smile', accessory:'beard' },
  beatriz: { eyes:'lashes', mouth:'smile',      accessory:null },
  joao:    { eyes:'round',  mouth:'smile',      accessory:'glasses-round' },
  yuki:    { eyes:'oval',   mouth:'smile',      accessory:null,            blush:true },
  takeshi: { eyes:'oval',   mouth:'neutral',    accessory:null },
  aiko:    { eyes:'oval',   mouth:'wide-smile', accessory:null },
  mei:     { eyes:'oval',   mouth:'smile',      accessory:null },
  wei:     { eyes:'oval',   mouth:'neutral',    accessory:'glasses-square' },
  lin:     { eyes:'oval',   mouth:'smile',      accessory:null },
  layla:   { eyes:'lashes', mouth:'smile',      accessory:null },
  omar:    { eyes:'round',  mouth:'neutral',    accessory:'beard' },
  anais:   { eyes:'lashes', mouth:'wide-smile', accessory:'lipstick' },
  ravi:    { eyes:'round',  mouth:'smile',      accessory:null },
  marie:   { eyes:'round',  mouth:'wide-smile', accessory:null },
  lea:     { eyes:'lashes', mouth:'wide-smile', accessory:'lipstick' },
  antoine: { eyes:'round',  mouth:'smile',      accessory:'glasses-square' },
  fatou:   { eyes:'lashes', mouth:'wide-smile', accessory:null },
  marie_fr:{ eyes:'round',  mouth:'wide-smile', accessory:null },
};

const LEVELS = {
  beginner: {
    id:'beginner', label:'Débutant', sublabel:'A1 – A2',
    description:'Mots simples, phrases courtes, on parle doucement et on répète',
    icon:'•',
    prompt:'beginner level (A1-A2). Use only very simple vocabulary and short sentences (5-10 words). Use mostly present tense. Repeat important words. Speak slowly. Be extremely patient and encouraging.',
  },
  intermediate: {
    id:'intermediate', label:'Intermédiaire', sublabel:'B1 – B2',
    description:'Conversation fluide, sujets variés, expressions courantes',
    icon:'••',
    prompt:'intermediate level (B1-B2). Use natural vocabulary and varied tenses. Use idiomatic expressions when they fit.',
  },
  advanced: {
    id:'advanced', label:'Avancé', sublabel:'C1 – C2',
    description:'Style natif, vocabulaire riche, nuances et humour',
    icon:'•••',
    prompt:'advanced level (C1-C2). Speak as you would with a native speaker. Use sophisticated vocabulary, complex sentences, cultural references, humor and nuances.',
  },
};

// ─── PATTERNS ─────────────────────────────────────────────────────────────────

const PATTERN_BG = (pattern) => {
  switch (pattern) {
    case 'circles':
      return { backgroundImage:'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35) 0%, transparent 35%), radial-gradient(circle at 75% 80%, rgba(0,0,0,0.12) 0%, transparent 30%)' };
    case 'grid':
      return { backgroundImage:'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 14px), repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 14px)' };
    case 'lines':
      return { backgroundImage:'repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0 2px, transparent 2px 11px)' };
    case 'dots':
      return { backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.35) 1.4px, transparent 1.6px)', backgroundSize:'10px 10px' };
    default: return {};
  }
};

// ─── PERSISTENCE (localStorage-based) ────────────────────────────────────────

const storageKey = (lang, level, avatar) => `chat:${lang.code}:${level.id}:${avatar.id}`;
const statsKey   = (lang, level, avatar) => `stats:${lang.code}:${level.id}:${avatar.id}`;
const META_KEY   = 'meta:lastSession';

const storage = {
  get(k)   { try { return localStorage.getItem(k); } catch { return null; } },
  set(k,v) { try { localStorage.setItem(k, v); } catch {} },
  del(k)   { try { localStorage.removeItem(k); } catch {} },
  keys()   { try { return Object.keys(localStorage); } catch { return []; } },
};

async function loadConversation(lang, level, avatar) {
  const raw = storage.get(storageKey(lang, level, avatar));
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

async function saveConversation(lang, level, avatar, messages) {
  storage.set(storageKey(lang, level, avatar), JSON.stringify(messages));
  storage.set(META_KEY, JSON.stringify({
    langCode: lang.code, levelId: level.id, avatarId: avatar.id, lastUpdated: Date.now(),
  }));
  let stats = { firstVisit: Date.now(), days: [] };
  const rawStats = storage.get(statsKey(lang, level, avatar));
  if (rawStats) { try { stats = JSON.parse(rawStats); } catch {} }
  stats.lastVisit = Date.now();
  stats.messageCount = messages.length;
  const today = new Date().toISOString().slice(0, 10);
  if (!stats.days.includes(today)) stats.days.push(today);
  storage.set(statsKey(lang, level, avatar), JSON.stringify(stats));
}

async function clearConversation(lang, level, avatar) {
  storage.del(storageKey(lang, level, avatar));
}

async function loadStats(lang, level, avatar) {
  const raw = storage.get(statsKey(lang, level, avatar));
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

async function loadLastSession() {
  const raw = storage.get(META_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

const voiceKey = (avatar) => `voice:${avatar.id}`;

async function loadVoicePref(avatar) {
  return storage.get(voiceKey(avatar));
}
async function saveVoicePref(avatar, voiceURI) {
  if (voiceURI) storage.set(voiceKey(avatar), voiceURI);
  else storage.del(voiceKey(avatar));
}

async function listAvatarsWithHistory(lang, level) {
  const prefix = `chat:${lang.code}:${level.id}:`;
  const ids = storage.keys()
    .filter(k => k.startsWith(prefix))
    .map(k => k.replace(prefix, ''));
  return new Set(ids);
}

// ─── LEVEL TESTS (persisted in Supabase + localStorage cache) ────────────────

async function saveLevelTestResult(result) {
  // Local cache (always works, even offline / without Supabase)
  const cacheKey = 'level_tests_cache';
  const now = Date.now();
  const entry = { ...result, taken_at: new Date().toISOString(), _local_id: `local-${now}` };
  try {
    const raw = storage.get(cacheKey);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(entry);
    storage.set(cacheKey, JSON.stringify(arr.slice(0, 50)));
  } catch (e) { /* ignore */ }

  // Supabase persistence
  if (!supabase) return;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;
  const { error } = await supabase.from('level_tests').insert({
    user_id: userData.user.id,
    language_code: result.language_code,
    language_name: result.language_name,
    cefr: result.cefr,
    score: result.score,
    level_id: result.level_id,
    strengths_fr: result.strengths_fr,
    weaknesses_fr: result.weaknesses_fr,
    advice_fr: result.advice_fr,
    transcript: result.transcript,
    exchanges: result.exchanges,
    duration_seconds: result.duration_seconds,
  });
  if (error) throw error;
}

// ─── ERROR LOG (for grammar exercises) ────────────────────────────────────────

// Store every correction to build a "weak points" ledger per lang+level.
function logError(lang, level, correction) {
  if (!correction || !correction.original) return;
  try {
    const key = `errors:${lang.code}:${level.id}`;
    const raw = storage.get(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({
      ...correction,
      logged_at: Date.now(),
    });
    // Keep max 100 recent errors
    storage.set(key, JSON.stringify(arr.slice(0, 100)));
  } catch (e) { /* ignore */ }
}

function loadRecentErrors(lang, level, limit = 30) {
  try {
    const key = `errors:${lang.code}:${level.id}`;
    const raw = storage.get(key);
    const arr = raw ? JSON.parse(raw) : [];
    return arr.slice(0, limit);
  } catch { return []; }
}

// Group errors by category to detect patterns
function summarizeErrors(errors) {
  const by = {};
  errors.forEach(e => {
    const cat = e.category || 'other';
    if (!by[cat]) by[cat] = { count: 0, samples: [] };
    by[cat].count += 1;
    if (by[cat].samples.length < 4) {
      by[cat].samples.push({ original: e.original, corrected: e.corrected, explanation_fr: e.explanation_fr });
    }
  });
  return Object.entries(by)
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.count - a.count);
}

const CATEGORY_LABELS_FR = {
  past_tense: 'Passé',
  present_perfect: 'Present perfect',
  future: 'Futur',
  conditional: 'Conditionnel',
  subjunctive: 'Subjonctif',
  articles: 'Articles',
  prepositions: 'Prépositions',
  pronouns: 'Pronoms',
  gender: 'Genre',
  plural: 'Pluriel',
  word_order: 'Ordre des mots',
  agreement: 'Accord',
  phrasal_verb: 'Phrasal verbs',
  false_friend: 'Faux amis',
  vocabulary: 'Vocabulaire',
  spelling: 'Orthographe',
  punctuation: 'Ponctuation',
  other: 'Divers',
};

async function loadLevelTests(userId) {
  // Try Supabase first
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('level_tests')
        .select('*')
        .eq('user_id', userId)
        .order('taken_at', { ascending: false })
        .limit(50);
      if (!error && data) return data;
    } catch (e) { /* fall through */ }
  }
  // Fallback: local cache
  try {
    const raw = storage.get('level_tests_cache');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function timeSince(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days >= 7) {
    const d = new Date(ts);
    return `le ${d.getDate()}/${d.getMonth()+1}`;
  }
  if (days >= 1) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (hours >= 1) return `il y a ${hours} h`;
  if (mins >= 5) return `il y a ${mins} min`;
  return "à l'instant";
}

// ─── PLATFORM DETECTION ───────────────────────────────────────────────────────

const detectPlatform = () => {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Macintosh/i.test(ua)) return 'mac';
  if (/Windows/i.test(ua)) return 'windows';
  return 'other';
};
const AUTO_PLATFORM = detectPlatform();

// User's chosen device (persists across sessions). Falls back to auto-detection.
const DEVICE_KEY = 'device_choice';
const getUserDevice = () => {
  try { return storage.get(DEVICE_KEY) || AUTO_PLATFORM; } catch { return AUTO_PLATFORM; }
};
const setUserDevice = (device) => {
  try { storage.set(DEVICE_KEY, device); } catch {}
};
let PLATFORM = AUTO_PLATFORM;
try { PLATFORM = storage.get(DEVICE_KEY) || AUTO_PLATFORM; } catch {}

const PLATFORM_HINTS = {
  android: { label: 'micro du clavier', detail: 'sur le clavier Gboard, touchez le 🎤 en haut à droite' },
  ios:     { label: 'dictée du clavier', detail: 'sur le clavier, touchez le 🎤 à côté de la barre espace' },
  mac:     { label: 'dictée macOS', detail: 'appuyez deux fois sur Fn pour dicter' },
  windows: { label: 'Win + H', detail: 'appuyez sur Win+H pour dicter' },
  other:   { label: 'dictée clavier', detail: 'utilisez le micro de votre système' },
};

// Device presentation info for the chooser
const DEVICES = [
  {
    id: 'ios',
    name: 'iPhone / iPad',
    emoji: '📱',
    color: '#0A84FF',
    tip: 'Reconnaissance vocale par touches courtes. Meilleure expérience : installer en PWA depuis Safari (Partager → Sur l\'écran d\'accueil).',
  },
  {
    id: 'android',
    name: 'Android',
    emoji: '🤖',
    color: '#3DDC84',
    tip: 'Excellent support du micro et de la voix. Installe l\'app via le menu Chrome → Ajouter à l\'écran d\'accueil.',
  },
  {
    id: 'mac',
    name: 'Mac',
    emoji: '💻',
    color: '#A855F7',
    tip: 'Utilise Chrome ou Safari. Le micro et les voix macOS marchent parfaitement.',
  },
  {
    id: 'windows',
    name: 'Windows',
    emoji: '🖥️',
    color: '#FF385C',
    tip: 'Chrome ou Edge recommandés. Utilise Win+H pour la dictée système en complément.',
  },
];

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

// Strict level-specific constraints — used both by chat and reader
const LEVEL_CONSTRAINTS = {
  beginner: `LEVEL — BEGINNER (CEFR A1–A2). STRICT:
- Vocabulary: only the 1000 most common everyday words. NEVER use rare or literary words.
- Grammar: present tense, simple past ("was", "went"), simple future ("will"). Avoid conditionals, subjunctive, complex passives.
- Sentence length: 5–10 words maximum, one clause each.
- Repeat key words. Speak slowly (short sentences).
- No idioms, no cultural references without context, no humor that hinges on wordplay.
- Always finish with a very simple, open question the learner can answer in one short sentence.`,

  intermediate: `LEVEL — INTERMEDIATE (CEFR B1–B2). STRICT:
- Vocabulary: everyday + common professional/topical words. Avoid literary/technical jargon.
- Grammar: all common tenses, conditionals, reported speech, common phrasal verbs.
- Sentence length: 8–18 words, up to two clauses.
- You may use common idioms if the meaning is transparent from context.
- Natural, friendly pace.`,

  advanced: `LEVEL — ADVANCED (CEFR C1–C2). STRICT:
- Vocabulary: rich, precise, native-like including idioms, cultural references, humor, sarcasm.
- Grammar: full range including subjunctive, inversion, complex subordination.
- Sentence length: unrestricted, but keep replies conversational (1–4 sentences).
- Nuance and register matter — challenge the learner.`,
};

const buildSystemPrompt = (lang, level, avatar) => `You are ${avatar.name}, a ${avatar.age}-year-old ${avatar.role.toLowerCase()} from ${avatar.location}.

You are having a casual conversation with a French speaker who is learning ${lang.nativeName} (${lang.name} in French).

${LEVEL_CONSTRAINTS[level.id] || level.prompt}

Persona: ${avatar.persona}

Your role:
- Always reply in ${lang.nativeName}. ${lang.code === 'mfe' ? 'IMPORTANT: respond strictly in Kreol Morisien using authentic Mauritian spelling and expressions. Do NOT respond in French.' : ''}
- Stay in character. Be natural and engaging.
- Keep replies short: 1–3 sentences. End with a question or remark that invites continuing.
- Match your vocabulary and complexity STRICTLY to the level constraints above — never exceed them.
- If the user writes mainly in French, gently respond in ${lang.nativeName}, encourage them, and provide one short model sentence they could try.

ERROR CORRECTION (mandatory — this is your teacher role):
- Detect ANY real error in the user's ${lang.nativeName}: grammar, conjugation, gender, word order, vocabulary, prepositions, tense, articles, false friends, spelling.
- Do NOT flag minor stylistic preferences — only what a teacher would correct.
- Give a brief, friendly French explanation with the underlying rule.
- Also produce a natural spoken echo: how a native would rephrase the learner's whole sentence correctly, staying in ${lang.nativeName}. This is what the tutor's voice will read aloud so the learner hears the correct form.

CRITICAL OUTPUT FORMAT: Respond ONLY with one valid JSON object, no markdown, no code fences, no preamble. Schema:

{
  "reply": "<your in-character response in ${lang.nativeName}>",
  "fr_translation": "<a natural French translation of your reply>",
  "corrections": [
    {
      "original": "<user's incorrect phrase, as they wrote it>",
      "corrected": "<the same phrase rewritten correctly in ${lang.nativeName}>",
      "spoken_echo": "<a short natural sentence in ${lang.nativeName} the tutor would say aloud to model the correct form, e.g. 'Actually, we say ...' or the equivalent in ${lang.nativeName}>",
      "explanation_fr": "<short explanation in French with the rule>",
      "category": "<one of: past_tense | present_perfect | future | conditional | subjunctive | articles | prepositions | pronouns | gender | plural | word_order | agreement | phrasal_verb | false_friend | vocabulary | spelling | punctuation | other>"
    }
  ]
}

If no errors, return "corrections": []. Never wrap the JSON in backticks. Never add text outside the JSON.`;

// ─── HOOKS ────────────────────────────────────────────────────────────────────

// Heuristic: guess a voice's gender from its name.
// Returns 'female', 'male', or null (unknown).
function guessVoiceGender(voiceName) {
  const n = voiceName.toLowerCase();
  // Explicit markers
  if (/\bfemale\b|femme|frau|donna|mujer|mulher|女性|امرأة/.test(n)) return 'female';
  if (/\bmale\b|homme|mann|uomo|hombre|homem|男性|رجل/.test(n)) return 'male';
  // Common female voice names across systems
  const femaleNames = [
    // Windows / Azure
    'zira','hazel','susan','heera','catherine','linda','jenny','aria','ana','emma','michelle','clara','nanami','ayumi','xiaoxiao','xiaoyou','hortense','julie','denise','katja','elsa','isabella','francisca','helena','sabina','alicja','joanna','maja',
    // Apple
    'samantha','victoria','allison','ava','kate','serena','fiona','moira','tessa','karen','veena','rishi','martha','amelie','audrey','virginie','marie','anna','helena','alice','silvia','federica','joana','catarina','luciana','paulina','esperanza','monica','marisol','laila','kyoko','haruka','sayaka','tingting','meijia','sin-ji',
    // Google
    'wavenet-a','wavenet-c','wavenet-e','wavenet-f','wavenet-h',
    // Miscellaneous common female French names used in TTS
    'petra','greta','laura','nadia','sarah','sophia','olivia'
  ];
  const maleNames = [
    'david','mark','richard','george','james','guy','ryan','tony','christopher','william','brandon','eric','jacob','matthew','antonio','marco','luca','felipe','ricardo','daniel','thomas','nicolas','markus','stefan','yannick','jorge','diego','juan','carlos','majed','tarik','otoya','hattori','alex','fred','tom','aaron','arthur','gordon','oliver','bruce','henri','jean','pierre','paul','claude','sean','declan','angus'
  ];
  if (femaleNames.some(name => n.includes(name))) return 'female';
  if (maleNames.some(name => n.includes(name))) return 'male';
  return null;
}

function useSpeech() {
  const [voices, setVoices] = useState([]);
  const [speakingText, setSpeakingText] = useState(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  const speak = (text, avatar, lang, preferredVoiceURI) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang?.ttsLocale || 'en-US';
    // Per-avatar rate/pitch override if defined
    u.rate = avatar?.rate ?? 0.9;
    u.pitch = avatar?.pitch ?? 1;
    u.onstart = () => setSpeakingText(text);
    u.onend = () => setSpeakingText(null);
    u.onerror = () => setSpeakingText(null);
    if (voices.length) {
      let chosen = null;
      if (preferredVoiceURI) {
        chosen = voices.find(v => v.voiceURI === preferredVoiceURI);
      }
      if (!chosen) {
        const base = (lang?.ttsLocale || 'en-US').split('-')[0];
        const langPool = voices.filter(v => v.lang.startsWith(base));
        const exactPool = langPool.filter(v => v.lang === (lang?.ttsLocale || 'en-US'));
        const pool = exactPool.length ? exactPool : langPool;

        // Determine target gender from avatar
        const targetGender = avatar?.gender || null;

        const scored = pool.map(v => {
          let score = 0;
          const n = v.name.toLowerCase();
          if (/natural|premium|enhanced|neural|wavenet|studio/.test(n)) score += 100;
          if (/google/.test(n)) score += 60;
          if (/microsoft/.test(n) && /online|natural/.test(n)) score += 40;
          if (avatar && avatar.voiceHint.some(h => n.includes(h))) score += 80;
          if (v.localService === false) score += 5;

          // Gender matching: HUGE boost when it matches, big penalty otherwise
          if (targetGender) {
            const voiceGender = guessVoiceGender(v.name);
            if (voiceGender === targetGender) score += 500;
            else if (voiceGender && voiceGender !== targetGender) score -= 300;
          }
          return { v, score };
        });
        scored.sort((a, b) => b.score - a.score);
        chosen = scored[0]?.v || pool[0];

        // Fallback: if the chosen voice's gender doesn't match, modulate pitch
        // to make male vs female audibly distinct even with the same underlying voice.
        if (targetGender && chosen) {
          const chosenGender = guessVoiceGender(chosen.name);
          if (chosenGender !== targetGender) {
            // No matching gender available → shift pitch to fake it
            if (targetGender === 'male' && (chosenGender === 'female' || chosenGender === null)) {
              u.pitch = Math.max(0.5, (avatar?.pitch ?? 1) - 0.35);
            } else if (targetGender === 'female' && (chosenGender === 'male' || chosenGender === null)) {
              u.pitch = Math.min(2.0, (avatar?.pitch ?? 1) + 0.35);
            }
          }
        }
      }
      if (chosen) u.voice = chosen;
    }
    window.speechSynthesis.speak(u);
  };

  // Speak several pieces one after the other, with an optional pause between them.
  // Usage: speakSequence([{text: "Hello."}, {text: "How are you?", pauseBefore: 700}], avatar, lang, uri)
  const speakSequence = (items, avatar, lang, preferredVoiceURI) => {
    if (!('speechSynthesis' in window) || !items?.length) return;
    window.speechSynthesis.cancel();
    let cancelled = false;
    let idx = 0;

    const speakNext = () => {
      if (cancelled || idx >= items.length) { setSpeakingText(null); return; }
      const item = items[idx++];
      const delay = item.pauseBefore || 0;
      setTimeout(() => {
        if (cancelled) return;
        const u = new SpeechSynthesisUtterance(item.text);
        u.lang = lang?.ttsLocale || 'en-US';
        u.rate = item.rate ?? avatar?.rate ?? 0.9;
        u.pitch = item.pitch ?? avatar?.pitch ?? 1;
        u.onstart = () => setSpeakingText(item.text);
        u.onend = () => { if (!cancelled) speakNext(); };
        u.onerror = () => { setSpeakingText(null); };
        // Reuse the same voice-picking logic by delegating
        if (voices.length) {
          let chosen = null;
          if (preferredVoiceURI) chosen = voices.find(v => v.voiceURI === preferredVoiceURI);
          if (!chosen) {
            const base = (lang?.ttsLocale || 'en-US').split('-')[0];
            const langPool = voices.filter(v => v.lang.startsWith(base));
            const exactPool = langPool.filter(v => v.lang === (lang?.ttsLocale || 'en-US'));
            const pool = exactPool.length ? exactPool : langPool;
            chosen = pool[0];
          }
          if (chosen) u.voice = chosen;
        }
        window.speechSynthesis.speak(u);
      }, delay);
    };
    speakNext();
    // Return a canceller
    return () => { cancelled = true; window.speechSynthesis.cancel(); setSpeakingText(null); };
  };

  const stop = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingText(null);
  };
  return { speak, speakSequence, stop, speakingText, voices };
}

function useRecognition(srLocale) {
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.lang = srLocale || 'en-US';
      r.interimResults = true;
      // Continuous mode: keeps listening across pauses within a single sentence.
      // Our own silence timer (2.5s) decides when the user has really finished.
      r.continuous = true;
      recRef.current = r;
      setSupported(true);
    } else {
      setSupported(false);
    }
  }, [srLocale]);

  const listen = ({ onInterim, onFinal, onEnd, onError }) => {
    const r = recRef.current;
    if (!r) return;
    let finalText = '';
    r.onresult = (e) => {
      let interim = '';
      let newFinal = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) newFinal += t;
        else interim += t;
      }
      if (newFinal) {
        finalText += newFinal;
        onFinal?.(newFinal, finalText); // pass chunk and cumulative
      }
      if (interim) onInterim?.(interim);
    };
    r.onerror = (e) => onError?.(e);
    r.onend = () => onEnd?.(finalText);
    try { r.start(); } catch (e) { /* already started */ }
  };

  const stop = () => { try { recRef.current?.stop(); } catch (e) {} };
  const abort = () => { try { recRef.current?.abort(); } catch (e) {} };

  return { supported, listen, stop, abort };
}

// ─── ANIMATED AVATAR ──────────────────────────────────────────────────────────

function Eye({ cx, style, blink }) {
  if (blink) {
    return <line x1={cx-5} y1={42} x2={cx+5} y2={42} stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />;
  }
  switch (style) {
    case 'oval':
      return <ellipse cx={cx} cy={42} rx={5} ry={3.5} fill="#1a1a1a" />;
    case 'lashes':
      return (
        <g>
          <ellipse cx={cx} cy={42} rx={3.8} ry={4.5} fill="#1a1a1a" />
          <line x1={cx-6} y1={35} x2={cx-3} y2={38.5} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx} y1={33} x2={cx} y2={37.5} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx+6} y1={35} x2={cx+3} y2={38.5} stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    default:
      return <circle cx={cx} cy={42} r={4} fill="#1a1a1a" />;
  }
}

function Accessory({ kind }) {
  switch (kind) {
    case 'glasses-round':
      return (
        <g stroke="#1a1a1a" strokeWidth="2" fill="rgba(255,255,255,0.18)">
          <circle cx={34} cy={42} r={11} />
          <circle cx={66} cy={42} r={11} />
          <line x1={45} y1={42} x2={55} y2={42} strokeWidth="2.5" />
        </g>
      );
    case 'glasses-square':
      return (
        <g stroke="#1a1a1a" strokeWidth="2" fill="rgba(255,255,255,0.18)">
          <rect x={23} y={34} width={22} height={16} rx={2} />
          <rect x={55} y={34} width={22} height={16} rx={2} />
          <line x1={45} y1={42} x2={55} y2={42} strokeWidth="2.5" />
        </g>
      );
    case 'bindi':
      return <circle cx={50} cy={27} r={3} fill="#B91C1C" />;
    case 'beard':
      return (
        <path d="M 28 66 Q 28 82 50 86 Q 72 82 72 66 L 67 72 Q 58 80 50 81 Q 42 80 33 72 Z"
              fill="#1a1a1a" opacity={0.88} />
      );
    default:
      return null;
  }
}

function Mouth({ style, speaking, color }) {
  if (speaking) {
    return (
      <ellipse cx={50} cy={68} rx={6} ry={3} fill={color}>
        <animate attributeName="ry" values="1.5;5.5;2.5;6;1.5" dur="0.45s" repeatCount="indefinite" />
        <animate attributeName="rx" values="6;4.5;6;5;6" dur="0.45s" repeatCount="indefinite" />
      </ellipse>
    );
  }
  switch (style) {
    case 'wide-smile':
      return <path d="M 38 63 Q 50 75 62 63" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    case 'smirk':
      return <path d="M 42 68 Q 50 71 58 64" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    case 'neutral':
      return <line x1={43} y1={68} x2={57} y2={68} stroke={color} strokeWidth="2.5" strokeLinecap="round" />;
    case 'smile':
    default:
      return <path d="M 42 65 Q 50 71 58 65" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  }
}

function AnimatedAvatar({ avatar, size='md', speaking=false }) {
  const sizes = { xs:'w-8 h-8', sm:'w-12 h-12', md:'w-16 h-16', lg:'w-24 h-24', xl:'w-32 h-32' };
  const face = FACES[avatar.id] || { eyes:'round', mouth:'smile', accessory:null };
  const mouthColor = face.accessory === 'lipstick' ? '#9F1239' : '#1a1a1a';
  const [blink, setBlink] = useState(false);
  const [look, setLook] = useState({ x: 0, y: 0 });  // pupil offset for eye-tracking
  const [wave, setWave] = useState(false);            // occasional greeting wave
  const [smileFlash, setSmileFlash] = useState(false); // occasional smile flash

  useEffect(() => {
    let alive = true;
    // Blink
    const blinkTick = () => {
      if (!alive) return;
      if (Math.random() < 0.5) {
        setBlink(true);
        setTimeout(() => alive && setBlink(false), 130);
      }
    };
    const blinkId = setInterval(blinkTick, 2400);

    // Eye movement (looking around)
    const lookTick = () => {
      if (!alive) return;
      const positions = [
        { x: 0, y: 0 },   { x: 0, y: 0 },
        { x: -1.5, y: 0 },{ x: 1.5, y: 0 },
        { x: 0, y: -1 },  { x: 0, y: 1 },
        { x: 1, y: -0.5 },{ x: -1, y: -0.5 },
      ];
      const pick = positions[Math.floor(Math.random() * positions.length)];
      setLook(pick);
    };
    const lookId = setInterval(lookTick, 1800);

    // Occasional wave
    const waveTick = () => {
      if (!alive) return;
      if (Math.random() < 0.35) {
        setWave(true);
        setTimeout(() => alive && setWave(false), 1300);
      }
    };
    const waveId = setInterval(waveTick, 5500);

    // Occasional smile flash
    const smileTick = () => {
      if (!alive) return;
      if (Math.random() < 0.4) {
        setSmileFlash(true);
        setTimeout(() => alive && setSmileFlash(false), 900);
      }
    };
    const smileId = setInterval(smileTick, 4200);

    return () => {
      alive = false;
      clearInterval(blinkId); clearInterval(lookId);
      clearInterval(waveId); clearInterval(smileId);
    };
  }, []);

  return (
    <div className={`${sizes[size]} relative shrink-0`}>
      {speaking && (
        <span className="absolute inset-0 pointer-events-none rounded-full" style={{
          backgroundColor: avatar.color,
          opacity: 0.4,
          animation: 'avatar-ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
        }} />
      )}
      <div
        className="relative w-full h-full grid place-items-center overflow-hidden rounded-full"
        style={{
          backgroundColor: avatar.color,
          ...PATTERN_BG(avatar.pattern),
          border: '2px solid rgba(255,255,255,0.6)',
          boxShadow: `0 4px 14px ${avatar.color}55, inset 0 -8px 20px rgba(0,0,0,0.08)`,
          animation: speaking
            ? 'avatar-bounce 0.55s ease-in-out infinite'
            : 'avatar-breathe 4.5s ease-in-out infinite',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Blush */}
          {face.blush && !speaking && (
            <g opacity={0.35} fill="#E11D48">
              <ellipse cx={22} cy={56} rx={6} ry={3} />
              <ellipse cx={78} cy={56} rx={6} ry={3} />
            </g>
          )}
          {/* Freckles */}
          {face.freckles && (
            <g fill="#7C2D12" opacity={0.5}>
              <circle cx={38} cy={56} r={0.8} />
              <circle cx={42} cy={58} r={0.8} />
              <circle cx={58} cy={58} r={0.8} />
              <circle cx={62} cy={56} r={0.8} />
              <circle cx={50} cy={54} r={0.8} />
            </g>
          )}
          {/* Eyes (pupils track `look`) */}
          <g style={{ transform: `translate(${look.x}px, ${look.y}px)`, transition: 'transform 0.5s ease-out' }}>
            <Eye cx={34} style={face.eyes} blink={blink} />
            <Eye cx={66} style={face.eyes} blink={blink} />
          </g>
          {/* Moustache (Oliver) */}
          {face.moustache && (
            <path d="M 38 60 Q 50 64 62 60 Q 58 63 50 63 Q 42 63 38 60 Z" fill="#1a1a1a" opacity={0.85} />
          )}
          {/* Accessory */}
          <Accessory kind={face.accessory} />
          {/* Mouth (smile-flash if idle) */}
          <Mouth style={smileFlash && !speaking ? 'smile' : face.mouth} speaking={speaking} color={mouthColor} />
          {/* Little waving hand (idle greeting) */}
          {wave && !speaking && (
            <g style={{ transformOrigin: '82px 78px', animation: 'avatar-wave 1.3s ease-in-out' }}>
              <circle cx={82} cy={78} r={5} fill="#FFC194" stroke="#8B5A3C" strokeWidth={0.8} />
              <path d="M 79 74 L 79 68 M 81 74 L 81 66 M 83 74 L 83 66 M 85 74 L 85 68" stroke="#8B5A3C" strokeWidth={1} strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// ─── LANGUAGE BADGE ───────────────────────────────────────────────────────────

function LanguageBadge({ lang, size='md' }) {
  const sizes = { sm:'w-12 h-12 text-base', md:'w-16 h-16 text-xl', lg:'w-20 h-20 text-2xl' };
  return (
    <div className={`${sizes[size]} grid place-items-center text-stone-50 shrink-0 relative overflow-hidden`}
         style={{ backgroundColor: lang.accent, fontFamily:'Fraunces, Georgia, serif', fontWeight: 500 }}>
      <span>{lang.glyph}</span>
    </div>
  );
}

// ─── STEP HEADER ──────────────────────────────────────────────────────────────

function StepHeader({ step, total, label, onBack }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {onBack && (
        <button onClick={onBack} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:var(--ink)] hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
          étape {step} / {total} · {label}
        </div>
        <div className="flex gap-1 mt-1.5">
          {Array.from({length: total}).map((_,i) => (
            <div key={i} className={`h-0.5 flex-1 ${i < step ? 'bg-[color:var(--ink)]' : 'bg-[color:rgba(90,78,69,0.2)]'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 1: LANGUAGE ─────────────────────────────────────────────────────────

function LanguagePicker({ onSelect, onResumeLast, profile, signOut, onOpenProfile }) {
  const [lastSession, setLastSession] = useState(null);

  useEffect(() => {
    loadLastSession().then(s => {
      if (!s) return;
      const lang = LANGUAGES[s.langCode];
      const level = LEVELS[s.levelId];
      const avatar = lang?.avatars.find(a => a.id === s.avatarId);
      if (lang && level && avatar) {
        setLastSession({ lang, level, avatar, lastUpdated: s.lastUpdated });
      }
    });
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'transparent' }}>
      <div className="max-w-3xl mx-auto">
        {/* Top user bar */}
        {profile && (
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <button onClick={onOpenProfile}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity group">
              <div className="rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                   style={{ width: 32, height: 32, background: "linear-gradient(135deg, #FF385C, #E31C5F)", boxShadow: "0 2px 6px rgba(255,56,92,0.25)" }}>
                <span style={{ fontSize: 14, color: 'white', fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
                  {(profile.first_name?.[0] || '?').toUpperCase()}
                </span>
              </div>
              <span className="text-[15px] italic" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--corail-2)' }}>
                bonjour, {profile.first_name}
              </span>
            </button>
            <div className="flex items-center gap-4">
              <button onClick={onOpenProfile}
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                <UserCircle size={12} /> mon compte
              </button>
              <button onClick={signOut}
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                <LogOut size={11} /> déconnexion
              </button>
            </div>
          </div>
        )}
        <StepHeader step={1} total={4} label="langue" />
        <span className="text-[22px] mb-1">bonjour !</span>
        <h1 className="text-3xl sm:text-[46px] font-medium tracking-tight leading-none mt-1" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          Quelle <span >langue</span> voulez-vous apprendre ?
        </h1>
        <p className="mt-4 text-[17px] max-w-lg italic" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--gris)' }}>
          Chaque langue est une invitation au voyage. Choisissez celle qui vous fait rêver aujourd'hui.
        </p>

        {lastSession && (
          <button onClick={() => onResumeLast(lastSession)}
            className="mt-6 w-full hover:-translate-y-0.5 transition-all p-4 flex items-center gap-3 text-left"
            style={{
              backgroundColor: 'white',
              border: '1px solid rgba(90, 78, 69, 0.15)',
              boxShadow: '2px 3px 0 rgba(90, 78, 69, 0.1)',
              borderRadius: '999px',
              paddingLeft: '1rem',
              paddingRight: '1.25rem',
            }}>
            <AnimatedAvatar avatar={lastSession.avatar} size="md" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider">
                📖 reprendre votre conversation
              </div>
              <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-xl font-medium leading-tight mt-0.5">
                {lastSession.avatar.name} · <span className="italic font-normal">{lastSession.lang.name}</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-wider mt-0.5 truncate" style={{ textTransform: 'none', letterSpacing: '0.05em' }}>
                niveau {lastSession.level.label.toLowerCase()} · {timeSince(lastSession.lastUpdated)}
              </div>
            </div>
            <span className="shrink-0 text-xl" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--corail)' }}>→</span>
          </button>
        )}

        <div className="mt-8">
          <div className="text-xs font-bold uppercase tracking-wider text-center mb-6">
            {lastSession ? '· ou commencer une nouvelle ·' : '· choisissez ·'}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-5 sm:gap-6 px-2">
          {Object.values(LANGUAGES).map(lang => (
            <button key={lang.code} onClick={() => onSelect(lang)}
              className="lang-bubble group relative flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              style={{
                width: '132px',
                height: '132px',
                borderRadius: '50%',
                border: `1.5px solid ${lang.accent}55`,
                // Teinte pastel de la couleur de la langue (par défaut)
                background: `radial-gradient(circle at 30% 30%, ${lang.accent}25, ${lang.accent}18)`,
                boxShadow: `0 3px 10px ${lang.accent}20`,
              }}>
              {/* Overlay : couleur pleine au hover */}
              <span
                className="absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${lang.accent}, ${lang.accent}DD)`,
                  boxShadow: `0 10px 28px ${lang.accent}66`,
                }}
              />
              <div className="relative z-10 flex flex-col items-center justify-center px-3 text-center">
                <span className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-110">{lang.glyph}</span>
                <span
                  className="text-[15px] sm:text-base font-semibold leading-tight transition-colors duration-300 group-hover:text-white"
                  style={{ fontFamily:'Fraunces, Georgia, serif', color: lang.accent }}>
                  {lang.name}
                </span>
                <span
                  className="mt-0.5 transition-colors duration-300 group-hover:text-white/85"
                  style={{ fontFamily:'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.06em', color: `${lang.accent}CC` }}>
                  {lang.nativeName}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: LEVEL ────────────────────────────────────────────────────────────

function LevelPicker({ language, onSelect, onStartTest, onBack }) {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'transparent' }}>
      <div className="max-w-3xl mx-auto">
        <StepHeader step={2} total={4} label="niveau" onBack={onBack} />
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-none" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
            Votre <em>niveau</em> en
          </h1>
          <span className="text-2xl sm:text-4xl px-4 py-1 text-stone-50 rounded-full" style={{ fontFamily:'Fraunces, Georgia, serif', backgroundColor: language.accent }}>
            {language.name}
          </span>
        </div>
        <p className="mt-3 text-[color:var(--gris)] max-w-xl" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          Soyez honnête — c'est mieux de commencer un peu en dessous et de progresser.
        </p>

        {/* CTA — test de niveau */}
        <button onClick={onStartTest}
          className="mt-6 w-full text-left hover:-translate-y-0.5 transition-all p-4 sm:p-5 flex items-center gap-4 group"
          style={{
            borderRadius: '9999px',
            background: `linear-gradient(135deg, ${language.accent}, ${language.accent}CC)`,
            border: 'none',
            boxShadow: `0 6px 20px ${language.accent}55`,
          }}>
          <div className="w-14 h-14 rounded-full grid place-items-center shrink-0 bg-white/25 backdrop-blur"
               style={{ fontFamily:'Fraunces, Georgia, serif' }}>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex-1 min-w-0 text-white">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-xl sm:text-2xl font-medium">Évaluer mon niveau</span>
              <span className="text-[10px] uppercase tracking-widest opacity-80" style={{ fontFamily:'DM Sans, sans-serif' }}>3–4 min</span>
            </div>
            <p className="text-sm opacity-90 mt-1" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
              Une petite discussion pour déterminer votre niveau automatiquement
            </p>
          </div>
          <span className="text-white text-2xl group-hover:translate-x-1 transition-transform" style={{ fontFamily:'Fraunces, Georgia, serif' }}>→</span>
        </button>

        <div className="mt-8 text-xs font-bold uppercase tracking-wider text-center mb-4" style={{ color: 'var(--gris)' }}>
          · ou choisir directement ·
        </div>

        <div className="mt-2 space-y-3">
          {Object.values(LEVELS).map(lv => (
            <button key={lv.id} onClick={() => onSelect(lv)}
              className="w-full text-left hover:-translate-y-0.5 transition-all p-4 sm:p-5 flex items-center gap-4"
              style={{
                borderRadius: '9999px',
                background: 'white',
                border: `1.5px solid ${language.accent}44`,
                boxShadow: `0 2px 8px ${language.accent}12`,
              }}>
              <div className="w-14 h-14 rounded-full grid place-items-center text-stone-50 shrink-0" style={{ backgroundColor: language.accent, fontFamily:'Fraunces, Georgia, serif' }}>
                <span className="text-2xl">{lv.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-xl sm:text-2xl font-medium">{lv.label}</span>
                  <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily:'DM Sans, sans-serif', color: language.accent, fontWeight: 700 }}>{lv.sublabel}</span>
                </div>
                <p className="text-sm text-[color:var(--gris)] mt-1" style={{ fontFamily:'Fraunces, Georgia, serif' }}>{lv.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2b: TEST DE NIVEAU ─────────────────────────────────────────────────

function LevelTestScreen({ language, onLevelDetermined, onBack }) {
  const TEST_DURATION_S = 210; // 3 min 30 s
  const MAX_EXCHANGES = 10;

  const [messages, setMessages] = useState([]); // { role: 'assistant'|'user', text }
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [assessment, setAssessment] = useState(null); // { cefr, level, feedback_fr }
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const exchangesCount = messages.filter(m => m.role === 'user').length;
  const timeUp = elapsed >= TEST_DURATION_S;
  const enoughExchanges = exchangesCount >= MAX_EXCHANGES;
  const canFinish = exchangesCount >= 4; // au moins 4 échanges avant de pouvoir clore
  const shouldAutoFinish = (timeUp || enoughExchanges) && !assessment && !assessing;

  // Timer
  useEffect(() => {
    if (assessment) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [assessment]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Opening question
  useEffect(() => {
    (async () => {
      setLoading(true);
      const opening = `Start the level test. Ask a very simple opening question in ${language.nativeName} to greet the learner and get them talking. Only one short question (max 12 words). No preamble.`;
      try {
        const data = await chatWithFallback({
          system: buildTestSystem(language),
          messages: [{ role: 'user', content: opening }],
          maxTokens: 120,
        });
        const text = data?.content?.[0]?.text?.trim() || `Hello! How are you today?`;
        setMessages([{ role: 'assistant', text }]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Auto trigger assessment when time up or enough exchanges
  useEffect(() => {
    if (shouldAutoFinish) finishTest();
  }, [shouldAutoFinish]);

  const send = async () => {
    if (!input.trim() || loading || assessing) return;
    const userMsg = { role: 'user', text: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const data = await chatWithFallback({
        system: buildTestSystem(language),
        messages: next.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.text,
        })),
        maxTokens: 150,
      });
      const text = data?.content?.[0]?.text?.trim() || '...';
      setMessages(m => [...m, { role: 'assistant', text }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const finishTest = async () => {
    if (assessing) return;
    setAssessing(true); setError(null);
    try {
      const transcript = messages.map(m =>
        `${m.role === 'assistant' ? 'Tuteur' : 'Apprenant'}: ${m.text}`
      ).join('\n');

      const systemAssess = `You are a certified CEFR language examiner assessing spoken/written ${language.name} proficiency.
Analyze ONLY the "Apprenant" (learner) turns in the transcript.
Return ONLY a JSON object, no code fence:
{
  "cefr": "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
  "score": <integer 0-100>,
  "strengths_fr": "<1-2 short sentences in French about what the learner did well>",
  "weaknesses_fr": "<1-2 short sentences in French about weak points>",
  "advice_fr": "<1 short sentence in French with the recommended focus>"
}`;

      const data = await chatWithFallback({
        system: systemAssess,
        messages: [{ role: 'user', content: transcript }],
        maxTokens: 400,
      });
      const raw = data?.content?.[0]?.text || '{}';
      const cleaned = raw.replace(/```json\s*|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Map CEFR → LEVELS
      const cefr = parsed.cefr || 'A2';
      const lvl = ['A1','A2'].includes(cefr) ? LEVELS.beginner
        : ['B1','B2'].includes(cefr) ? LEVELS.intermediate
        : LEVELS.advanced;

      const result = { ...parsed, level: lvl };
      setAssessment(result);

      // Persist the test result to Supabase (fire-and-forget)
      saveLevelTestResult({
        language_code: language.code,
        language_name: language.name,
        cefr,
        score: parsed.score ?? null,
        level_id: lvl.id,
        strengths_fr: parsed.strengths_fr || '',
        weaknesses_fr: parsed.weaknesses_fr || '',
        advice_fr: parsed.advice_fr || '',
        transcript,
        exchanges: exchangesCount,
        duration_seconds: elapsed,
      }).catch(err => console.warn('Failed to save test result:', err));
    } catch (e) {
      setError(e.message);
      setAssessment({ cefr: 'A2', level: LEVELS.beginner, strengths_fr: '', weaknesses_fr: '', advice_fr: '' });
    } finally {
      setAssessing(false);
    }
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  const progress = Math.min(100, (elapsed / TEST_DURATION_S) * 100);

  // === Écran de résultat ===
  if (assessment) {
    const cefrColor = { A1:'#78716C', A2:'#A78BFA', B1:'#FF385C', B2:'#E88865', C1:'#FCD34D', C2:'#22C55E' }[assessment.cefr] || 'var(--corail)';
    return (
      <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--gris)' }}>
            évaluation terminée
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium leading-none" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
            Votre niveau en <em>{language.name}</em>
          </h1>

          <div className="mt-8 mx-auto rounded-full flex items-center justify-center relative"
               style={{
                 width: 180, height: 180,
                 background: `radial-gradient(circle at 30% 30%, ${cefrColor}, ${cefrColor}CC)`,
                 boxShadow: `0 12px 40px ${cefrColor}66`,
               }}>
            <div className="text-white text-center">
              <div className="text-[11px] font-bold uppercase tracking-widest opacity-90" style={{ fontFamily:'DM Sans, sans-serif' }}>CECRL</div>
              <div className="text-6xl leading-none font-bold" style={{ fontFamily:'Fraunces, Georgia, serif' }}>{assessment.cefr}</div>
              <div className="text-xs mt-1 opacity-90" style={{ fontFamily:'DM Sans, sans-serif' }}>{assessment.score || '—'}/100</div>
            </div>
          </div>

          <div className="mt-6 inline-block px-6 py-2 rounded-full" style={{ background: `${cefrColor}22`, color: cefrColor }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily:'DM Sans, sans-serif' }}>
              → mode {assessment.level.label.toLowerCase()} ({assessment.level.sublabel})
            </span>
          </div>

          <div className="mt-6 wl-card p-5 text-left" style={{ borderRadius: '24px' }}>
            {assessment.strengths_fr && (
              <div className="mb-3">
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#22C55E' }}>✓ points forts</div>
                <p className="text-[15px]" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }}>{assessment.strengths_fr}</p>
              </div>
            )}
            {assessment.weaknesses_fr && (
              <div className="mb-3">
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--corail-2)' }}>→ à travailler</div>
                <p className="text-[15px]" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }}>{assessment.weaknesses_fr}</p>
              </div>
            )}
            {assessment.advice_fr && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--corail)' }}>💡 conseil</div>
                <p className="text-[15px]" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }}>{assessment.advice_fr}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={() => { setAssessment(null); setMessages([]); setElapsed(0); }}
              className="wl-chip px-6 py-3 flex items-center justify-center gap-2"
              style={{ fontFamily: 'DM Sans', fontWeight: 700, color: 'var(--ink)' }}>
              <RefreshCw size={14} /> refaire le test
            </button>
            <button onClick={() => onLevelDetermined(assessment.level)}
              className="wl-btn-primary flex-1 flex items-center justify-center gap-2">
              Continuer avec le niveau {assessment.level.label.toLowerCase()} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === Écran de test en cours ===
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'transparent' }}>
      {/* Header avec timer + progression */}
      <div className="sticky top-0 z-10 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(90,78,69,0.12)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full grid place-items-center hover:bg-black/5 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              <span>test de niveau · {language.name}</span>
              <span style={{ color: elapsed > TEST_DURATION_S * 0.9 ? 'var(--corail)' : 'var(--gris)' }}>
                {mm}:{ss}
              </span>
            </div>
            <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(90,78,69,0.15)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                   style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${language.accent}, ${language.accent}AA)` }} />
            </div>
          </div>
          {canFinish && !assessing && (
            <button onClick={finishTest}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'DM Sans', color: 'white', background: language.accent }}>
              terminer
            </button>
          )}
        </div>
      </div>

      {/* Zone de conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-3">
          {messages.length === 0 && loading && (
            <div className="text-center py-10 text-[color:var(--gris)]" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
              <Loader2 size={20} className="animate-spin inline mr-2" />
              Le tuteur prépare sa première question…
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 ${m.role === 'user' ? 'text-white' : ''}`}
                   style={{
                     borderRadius: m.role === 'user' ? '22px 22px 6px 22px' : '22px 22px 22px 6px',
                     background: m.role === 'user'
                       ? `linear-gradient(135deg, ${language.accent}, ${language.accent}DD)`
                       : 'white',
                     border: m.role === 'user' ? 'none' : '1px solid rgba(90,78,69,0.12)',
                     fontFamily: 'Fraunces, Georgia, serif',
                     boxShadow: m.role === 'user' ? `0 3px 10px ${language.accent}44` : '0 2px 6px rgba(0,0,0,0.03)',
                   }}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-3xl flex items-center gap-2"
                   style={{ background: 'white', border: '1px solid rgba(90,78,69,0.12)' }}>
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: language.accent, animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: language.accent, animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: language.accent, animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {assessing && (
            <div className="text-center py-6" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
              <Loader2 size={22} className="animate-spin inline mr-2" style={{ color: language.accent }} />
              Analyse de votre niveau…
            </div>
          )}

          {error && (
            <div className="wl-card px-4 py-3 text-sm text-center"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      {/* Zone de saisie */}
      {!assessing && (
        <div className="sticky bottom-0 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.9)', borderTop: '1px solid rgba(90,78,69,0.12)' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder={`Répondez en ${language.name.toLowerCase()}…`}
              disabled={loading}
              className="flex-1 bg-white px-5 py-3 rounded-full focus:outline-none disabled:opacity-60"
              style={{ fontFamily: 'DM Sans', border: '1px solid rgba(90,78,69,0.2)', fontSize: 15 }}
            />
            <button onClick={send} disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-full grid place-items-center text-white transition-all hover:scale-105 disabled:opacity-40 disabled:scale-100"
              style={{ background: `linear-gradient(135deg, ${language.accent}, ${language.accent}DD)`, boxShadow: `0 3px 10px ${language.accent}55` }}>
              <Send size={16} />
            </button>
          </div>
          <div className="text-center pb-2 text-[10px] uppercase tracking-widest" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            {exchangesCount} / {MAX_EXCHANGES} échanges
          </div>
        </div>
      )}
    </div>
  );
}

// Prompt système pour le testeur — progression naturelle de difficulté
function buildTestSystem(language) {
  return `You are a friendly, calm CEFR examiner assessing a learner's ${language.name} proficiency in a short natural conversation.

RULES:
- Speak ONLY in ${language.nativeName} (never in French).
- Keep every reply short: 1-2 sentences max, always ending with ONE simple question.
- Start VERY easy (A1: name, age, hobbies), then gradually raise difficulty every 2 exchanges: A2 (daily routine, past tense), B1 (opinions, plans, hypothesis), B2 (abstract topics, nuances), C1+ (idioms, cultural references, complex arguments).
- If the learner struggles, ease off; if they answer fluently, push harder.
- Never correct, never translate, never comment on their level.
- Never say "let's move on" or announce the difficulty. Just chat naturally.
- Avoid yes/no questions — use open questions that reveal grammar and vocabulary.
- Do NOT end the conversation on your own; the system does it after ~10 exchanges.`;
}

// ─── DEVICE CHOOSER ──────────────────────────────────────────────────────────

function DeviceChooserScreen({ onSaved, onSkip, currentDevice, forceShow = false }) {
  const [selected, setSelected] = useState(currentDevice || AUTO_PLATFORM);
  const detected = DEVICES.find(d => d.id === AUTO_PLATFORM);

  const save = () => {
    setUserDevice(selected);
    PLATFORM = selected;
    onSaved?.(selected);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        {onSkip && (
          <button onClick={onSkip}
            className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
            style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            <ArrowLeft size={14} /> retour
          </button>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-full mb-3"
               style={{ width: 68, height: 68, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 6px 18px rgba(255,56,92,0.3)' }}>
            <span style={{ fontSize: 32 }}>📱</span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none mt-2"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
            Sur quel <em style={{ color: 'var(--corail)' }}>appareil</em> ?
          </h1>
          <p className="mt-3 text-[15px] max-w-md mx-auto" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            {forceShow
              ? "MonProf adapte le micro, les voix et les astuces à votre appareil."
              : "Confirmez ou changez votre appareil pour adapter l'expérience."}
          </p>
          {detected && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full"
                 style={{ background: `${detected.color}18`, color: detected.color, fontFamily: 'DM Sans', fontWeight: 700, fontSize: 12 }}>
              <span>{detected.emoji}</span>
              <span>détecté : {detected.name}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {DEVICES.map(dev => {
            const isSelected = selected === dev.id;
            return (
              <button key={dev.id} onClick={() => setSelected(dev.id)}
                className="p-4 sm:p-5 text-center transition-all hover:-translate-y-1"
                style={{
                  borderRadius: '24px',
                  border: `2px solid ${isSelected ? dev.color : `${dev.color}33`}`,
                  background: isSelected
                    ? `linear-gradient(135deg, ${dev.color}18, ${dev.color}08)`
                    : 'white',
                  boxShadow: isSelected
                    ? `0 8px 24px ${dev.color}55`
                    : `0 2px 8px ${dev.color}15`,
                }}>
                <div className="rounded-full mx-auto mb-3 flex items-center justify-center transition-transform"
                     style={{
                       width: 64, height: 64,
                       background: `radial-gradient(circle at 30% 30%, ${dev.color}30, ${dev.color}18)`,
                       transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                     }}>
                  <span style={{ fontSize: 32 }}>{dev.emoji}</span>
                </div>
                <div className="font-medium leading-tight"
                     style={{ fontFamily: 'Fraunces, Georgia, serif', color: isSelected ? dev.color : 'var(--ink)', fontSize: 16 }}>
                  {dev.name}
                </div>
                {isSelected && (
                  <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                       style={{ fontFamily: 'DM Sans', color: dev.color }}>
                    <Check size={11} /> choisi
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Astuce contextuelle */}
        {selected && (() => {
          const dev = DEVICES.find(d => d.id === selected);
          if (!dev) return null;
          return (
            <div className="mt-5 p-4 sm:p-5 rounded-3xl"
                 style={{ background: `${dev.color}12`, border: `1px solid ${dev.color}33` }}>
              <div className="flex items-start gap-3">
                <div className="rounded-full flex items-center justify-center shrink-0"
                     style={{ width: 36, height: 36, background: dev.color, color: 'white', fontSize: 18 }}>
                  💡
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider mb-1"
                       style={{ fontFamily: 'DM Sans', color: dev.color }}>
                    astuce {dev.name}
                  </div>
                  <p className="text-[14px] leading-snug"
                     style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                    {dev.tip}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        <button onClick={save}
          className="wl-btn-primary w-full mt-6 flex items-center justify-center gap-2">
          <Check size={16} /> {forceShow ? 'Continuer' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

// Mini-écran : choix de langue pour lancer un test depuis "Mon compte"
function LanguagePickForTest({ onSelect, onBack }) {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 mb-6 text-sm font-bold hover:opacity-70"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-3"
               style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 6px 18px rgba(255,56,92,0.3)' }}>
            <span style={{ fontSize: 28 }}>🎯</span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
            Refaire un <em style={{ color: 'var(--corail)' }}>test</em>
          </h1>
          <p className="mt-3 text-[15px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Choisissez la langue à évaluer
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5 sm:gap-6 px-2">
          {Object.values(LANGUAGES).map(lang => (
            <button key={lang.code} onClick={() => onSelect(lang)}
              className="group relative flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              style={{
                width: '132px', height: '132px',
                borderRadius: '50%',
                border: `1.5px solid ${lang.accent}55`,
                background: `radial-gradient(circle at 30% 30%, ${lang.accent}25, ${lang.accent}18)`,
                boxShadow: `0 3px 10px ${lang.accent}20`,
              }}>
              <span className="absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${lang.accent}, ${lang.accent}DD)`,
                  boxShadow: `0 10px 28px ${lang.accent}66`,
                }} />
              <div className="relative z-10 flex flex-col items-center justify-center px-3 text-center">
                <span className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-110">{lang.glyph}</span>
                <span className="text-[15px] sm:text-base font-semibold leading-tight transition-colors duration-300 group-hover:text-white"
                  style={{ fontFamily: 'Fraunces, Georgia, serif', color: lang.accent }}>
                  {lang.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3: AVATAR ───────────────────────────────────────────────────────────

function AvatarPicker({ language, level, onSelect, onBack }) {
  const [withHistory, setWithHistory] = useState(new Set());

  useEffect(() => {
    listAvatarsWithHistory(language, level).then(setWithHistory);
  }, [language.code, level.id]);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'transparent' }}>
      <div className="max-w-3xl mx-auto">
        <StepHeader step={4} total={4} label="interlocuteur" onBack={onBack} />
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-none" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          Avec <em>qui</em> ?
        </h1>
        <p className="mt-3 text-[color:var(--gris)] max-w-xl" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          {language.name} · {level.label.toLowerCase()} · choisissez l'accent et la personnalité qui vous parlent
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {language.avatars.map(av => {
            const hasHist = withHistory.has(av.id);
            return (
              <button key={av.id} onClick={() => onSelect(av)}
                className="relative text-left hover:-translate-y-1 transition-all p-4 sm:p-5 flex gap-4 items-center group"
                style={{
                  borderRadius: '9999px',
                  background: 'white',
                  border: `1.5px solid ${av.color}44`,
                  boxShadow: `0 3px 12px ${av.color}18`,
                }}>
                {/* Pastille ronde avec personnage animé */}
                <div className="relative shrink-0"
                     style={{ transform: 'scale(1)', transition: 'transform 0.3s ease' }}>
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    <AnimatedAvatar avatar={av} size="lg" />
                  </div>
                  {hasHist && (
                    <span
                      className="absolute -top-1 -right-1 rounded-full flex items-center justify-center text-white"
                      style={{ width: 22, height: 22, background: av.color, fontSize: 11, boxShadow: `0 2px 6px ${av.color}88` }}
                      title="conversation en cours">
                      📖
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }} className="text-xl sm:text-2xl font-medium leading-none truncate">{av.name}</h3>
                    <span className="text-[10px] uppercase tracking-widest shrink-0" style={{ fontFamily:'DM Sans, sans-serif', color: av.color, fontWeight: 700 }}>{av.age} ans</span>
                  </div>
                  <div className="text-[11px] mt-1 truncate" style={{ fontFamily:'DM Sans, sans-serif', color: 'var(--gris)' }}>{av.location} · {av.role}</div>
                  <p className="mt-1.5 text-sm leading-snug line-clamp-2" style={{ fontFamily:'Fraunces, Georgia, serif', color: 'var(--ink)' }}>{av.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CORRECTIONS ──────────────────────────────────────────────────────────────

function CorrectionsPanel({ corrections, onReplay }) {
  if (!corrections || !corrections.length) return null;
  return (
    <div className="mt-2 rounded-2xl bg-amber-50/70 border border-amber-300/60 pl-3 pr-3 py-2.5 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-900" style={{ fontFamily:'DM Sans, sans-serif' }}>
          <BookOpen size={11} /> correction{corrections.length > 1 ? 's' : ''}
        </div>
        {onReplay && (
          <button onClick={onReplay}
            title="réécouter le prof lire la correction"
            className="w-7 h-7 rounded-full grid place-items-center hover:bg-amber-200/60 transition-colors">
            <Volume2 size={13} className="text-amber-900" />
          </button>
        )}
      </div>
      {corrections.map((c, i) => (
        <div key={i} className="text-sm" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="line-through text-[color:var(--gris)] italic">{c.original}</span>
            <span className="text-amber-800">→</span>
            <span className="font-medium text-[color:var(--ink)] italic">{c.corrected}</span>
          </div>
          {c.spoken_echo && (
            <div className="mt-1 flex items-start gap-1.5 text-[13px] italic" style={{ color: '#78350F' }}>
              <Volume2 size={11} className="mt-1 shrink-0" />
              <span>« {c.spoken_echo} »</span>
            </div>
          )}
          <div className="mt-1 text-[color:var(--ink)] text-[13px] leading-snug">{c.explanation_fr}</div>
        </div>
      ))}
    </div>
  );
}

// ─── CLICKABLE WORDS + EXPLAIN POPUP ─────────────────────────────────────────

// Attempts a request with a fast model first, then falls back to a reliable one.
async function chatWithFallback({ system, messages, maxTokens = 500 }) {
  const models = [
    'claude-haiku-4-5',           // fastest
    'claude-3-5-haiku-latest',    // fast, widely available fallback
    'claude-sonnet-4-20250514',   // reliable last resort
  ];
  let lastError = null;
  for (const model of models) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      // 400 usually means "model not found" — try next
      if (response.status === 400 || response.status === 404) {
        lastError = new Error(`Model ${model} unavailable`);
        continue;
      }
      // Other errors (401, 429, 500) — stop and report
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error('All models failed');
}

// Fetch a word explanation via our API
async function explainWord(word, context, lang) {
  const systemPrompt = `You are a language tutor helping a French speaker learn ${lang.nativeName} (${lang.name} in French).
The user just clicked on the word "${word}" appearing in this sentence: "${context}".
Give:
- Its French translation IN THIS CONTEXT
- A short French explanation (nature: nom/verbe/adjectif/etc, grammar note, nuance, or false friend warning)
- A short example sentence in ${lang.nativeName} using this word, with its French translation

Respond ONLY with a JSON object, no code fences:
{
  "translation": "<French translation of the word in this context>",
  "explanation": "<short French explanation, 1-2 sentences>",
  "example": {
    "text": "<short example sentence in ${lang.nativeName}>",
    "fr": "<French translation of the example>"
  }
}`;

  const data = await chatWithFallback({
    system: systemPrompt,
    messages: [{ role: 'user', content: `Explain the word "${word}".` }],
    maxTokens: 300,
  });
  const textOut = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
  const cleaned = textOut.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
  return JSON.parse(s !== -1 && e !== -1 ? cleaned.slice(s, e + 1) : cleaned);
}

function WordExplainPopup({ word, context, lang, onClose, onSpeak }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setData(null); setError(null);
    explainWord(word, context, lang)
      .then(d => { if (alive) setData(d); })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [word, context, lang.code]);

  return (
    <div className="fixed inset-0 z-50 bg-[color:rgba(43,36,34,0.55)] flex items-end sm:items-center justify-center p-0 sm:p-4"
         onClick={onClose}>
      <div className="w-full sm:max-w-md wl-card max-h-[85vh] flex flex-col"
           onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
              mot · {lang.name.toLowerCase()}
            </div>
            <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-2xl font-medium leading-none mt-0.5 italic" dir={lang.rtl ? 'rtl' : 'ltr'}>
              {word}
            </div>
          </div>
          <button onClick={() => onSpeak(word)} className="w-9 h-9 grid place-items-center wl-btn-secondary" title="écouter">
            <Volume2 size={14} />
          </button>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)]">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {!data && !error && (
            <div className="flex items-center gap-2 text-[color:var(--gris)] text-sm" style={{ fontFamily:'DM Sans, sans-serif' }}>
              <Loader2 size={14} className="animate-spin" />
              <span>recherche…</span>
            </div>
          )}
          {error && (
            <div className="text-sm text-amber-800" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
              Impossible de récupérer l'explication. Vérifiez votre connexion.
            </div>
          )}
          {data && (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-1" style={{ fontFamily:'DM Sans, sans-serif' }}>traduction</div>
                <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-xl text-[color:var(--ink)] italic">
                  {data.translation}
                </div>
              </div>
              {data.explanation && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-1" style={{ fontFamily:'DM Sans, sans-serif' }}>explication</div>
                  <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-stone-800 text-sm leading-relaxed">
                    {data.explanation}
                  </div>
                </div>
              )}
              {data.example && data.example.text && (
                <div className="border-l-4 border-amber-700 pl-3 py-1 bg-amber-50/60">
                  <div className="text-[10px] uppercase tracking-widest text-amber-900 mb-1" style={{ fontFamily:'DM Sans, sans-serif' }}>exemple</div>
                  <div className="flex items-start gap-2">
                    <button onClick={() => onSpeak(data.example.text)} className="mt-0.5 shrink-0 text-[color:var(--gris)] hover:text-[color:var(--ink)]" title="écouter">
                      <Volume2 size={12} />
                    </button>
                    <div className="flex-1">
                      <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-[color:var(--ink)] italic" dir={lang.rtl ? 'rtl' : 'ltr'}>
                        « {data.example.text} »
                      </div>
                      <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-[color:var(--gris)] text-sm mt-1 italic">
                        {data.example.fr}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Splits text into clickable word tokens.
// Non-word characters (punctuation, spaces) are rendered as static spans.
function ClickableText({ text, onWordClick, rtl = false }) {
  if (!text) return null;
  // Match word chunks (letters incl. accents & CJK) vs non-word chunks
  const parts = text.split(/(\s+|[.,;:!?¿¡«»"'()\[\]{}—–…])/g);
  return (
    <span style={{ direction: rtl ? 'rtl' : 'ltr' }}>
      {parts.map((part, i) => {
        if (!part) return null;
        // Words: at least one letter (any script)
        const isWord = /[\p{L}]/u.test(part) && !/^\s+$/.test(part);
        if (!isWord) return <span key={i}>{part}</span>;
        return (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); onWordClick(part.trim(), text); }}
            className="inline hover:bg-amber-200 hover:underline decoration-dotted underline-offset-2 rounded-sm transition-colors cursor-pointer"
            style={{ padding: '0 1px' }}
          >
            {part}
          </button>
        );
      })}
    </span>
  );
}

// ─── BUBBLES ──────────────────────────────────────────────────────────────────

function UserMessage({ message, rtl, onReplayCorrection }) {
  return (
    <div className="flex flex-col items-end mb-4">
      <div className="max-w-[85%]">
        <div className="wl-card px-4 py-2.5" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-1" style={{ fontFamily:'DM Sans, sans-serif' }}>vous</div>
          <div className="text-[color:var(--ink)] leading-relaxed" style={{ direction: rtl ? 'rtl' : 'ltr' }}>{message.content}</div>
        </div>
        <div className="mt-1">
          <CorrectionsPanel
            corrections={message.corrections}
            onReplay={message.corrections?.length ? () => onReplayCorrection?.(message.corrections) : null} />
        </div>
      </div>
    </div>
  );
}

function AssistantMessage({ message, avatar, lang, onSpeak, speaking, onWordClick }) {
  const [showFr, setShowFr] = useState(false);
  return (
    <div className="flex gap-3 mb-4 items-start">
      <AnimatedAvatar avatar={avatar} size="sm" speaking={speaking} />
      <div className="max-w-[85%] flex-1">
        <div className="px-4 py-3 relative" style={{ backgroundColor: avatar.soft, borderLeft: `3px solid ${avatar.color}`, fontFamily:'Fraunces, Georgia, serif' }}>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily:'DM Sans, sans-serif', color: avatar.color }}>{avatar.name}</span>
            <div className="flex items-center gap-2">
              <button onClick={onSpeak} className="text-[color:var(--gris)] hover:text-[color:var(--ink)]" aria-label="écouter"><Volume2 size={14} /></button>
              <button onClick={() => setShowFr(s => !s)} className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] hover:text-[color:var(--ink)] px-1.5 border border-stone-400" style={{ fontFamily:'DM Sans, sans-serif' }}>fr</button>
            </div>
          </div>
          <div className="text-[color:var(--ink)] leading-relaxed">
            <ClickableText text={message.reply} onWordClick={onWordClick} rtl={lang.rtl} />
          </div>
          {showFr && message.translation && (
            <div className="mt-2 pt-2 border-t border-stone-400/40 text-sm text-[color:var(--ink)] italic">{message.translation}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ avatar }) {
  return (
    <div className="flex gap-3 mb-4 items-start">
      <AnimatedAvatar avatar={avatar} size="sm" />
      <div className="px-4 py-3" style={{ backgroundColor: avatar.soft, borderLeft: `3px solid ${avatar.color}` }}>
        <div className="flex gap-1.5 items-center">
          {[0,150,300].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: avatar.color, animationDelay: `${d}ms` }} />)}
        </div>
      </div>
    </div>
  );
}

// ─── CHAT INPUT ───────────────────────────────────────────────────────────────

function ChatInput({ onSend, disabled, avatar, lang, autoListen, avatarIsSpeaking }) {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [interim, setInterim] = useState('');
  const [micError, setMicError] = useState(null); // null | 'denied' | 'other'
  const [countdown, setCountdown] = useState(0); // seconds remaining before auto-send
  const { supported, listen, stop, abort } = useRecognition(lang.srLocale);
  const textareaRef = useRef(null);

  // Refs used inside setTimeout callbacks (which can't read latest state)
  const silenceTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const accumulatedRef = useRef('');
  const submittedRef = useRef(false);

  const SILENCE_MS = 3000; // Auto-send after 3 seconds of silence

  const clearTimers = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    silenceTimerRef.current = null;
    countdownTimerRef.current = null;
  };

  const doSubmit = (value) => {
    if (submittedRef.current) return;
    const v = (value ?? '').trim();
    if (!v) return;
    submittedRef.current = true;
    clearTimers();
    setRecording(false);
    setInterim('');
    setCountdown(0);
    accumulatedRef.current = '';
    setText('');
    abort(); // hard stop the mic
    onSend(v);
  };

  const armSilenceTimer = () => {
    clearTimers();
    setCountdown(Math.ceil(SILENCE_MS / 1000));
    let remaining = SILENCE_MS;
    countdownTimerRef.current = setInterval(() => {
      remaining -= 1000;
      setCountdown(Math.max(0, Math.ceil(remaining / 1000)));
    }, 1000);
    silenceTimerRef.current = setTimeout(() => {
      // Silence timer fired → send whatever we have
      doSubmit(accumulatedRef.current || text);
    }, SILENCE_MS);
  };

  const startListening = () => {
    if (!supported) { setMicError('other'); return; }
    if (recording || disabled) return;
    setMicError(null);
    setInterim('');
    setRecording(true);
    submittedRef.current = false;
    accumulatedRef.current = text || '';
    listen({
      onInterim: (t) => {
        setInterim(t);
        // Any speech → reset silence timer
        armSilenceTimer();
      },
      onFinal: (chunk) => {
        accumulatedRef.current = (accumulatedRef.current
          ? accumulatedRef.current + ' '
          : '') + chunk.trim();
        setText(accumulatedRef.current);
        setInterim('');
        armSilenceTimer();
      },
      onEnd: () => {
        setRecording(false);
        setInterim('');
        // If not yet submitted and we have something → send now
        if (!submittedRef.current && (accumulatedRef.current || '').trim()) {
          doSubmit(accumulatedRef.current);
        }
      },
      onError: (e) => {
        clearTimers();
        setRecording(false);
        setInterim('');
        setCountdown(0);
        if (e?.error === 'no-speech') return;
        if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
          setMicError('denied');
        } else if (e?.error !== 'aborted') {
          setMicError('other');
        }
      },
    });
  };

  const stopListening = () => {
    clearTimers();
    setCountdown(0);
    stop();
  };

  const submitFromButton = () => {
    const v = ((accumulatedRef.current || text) + ' ' + interim).trim();
    if (!v || disabled) return;
    doSubmit(v);
  };

  // Auto-listen: when enabled, start mic as soon as it's our turn and avatar isn't speaking
  useEffect(() => {
    if (!autoListen) return;
    if (disabled) return;
    if (avatarIsSpeaking) return;
    if (recording) return;
    if (micError === 'denied') return; // don't spam if user refused
    // Small delay so the avatar's voice fully ends
    const id = setTimeout(() => startListening(), 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line
  }, [autoListen, disabled, avatarIsSpeaking]);

  // Stop listening if avatar starts speaking
  useEffect(() => {
    if (avatarIsSpeaking && recording) stopListening();
    // eslint-disable-next-line
  }, [avatarIsSpeaking]);

  // Cleanup on unmount
  useEffect(() => () => { clearTimers(); abort(); }, []);

  useEffect(() => {
    if (!disabled && !recording && textareaRef.current) textareaRef.current.focus();
  }, [disabled, recording]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitFromButton(); }
  };

  const displayText = recording && interim
    ? (text ? text + ' ' : '') + interim
    : text;

  return (
    <div className="border-t wl-card px-3 sm:px-5 py-2.5 sticky bottom-0">
      <div className="max-w-3xl mx-auto">
        {micError === 'denied' && (
          <div className="mb-2 text-[10px] uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-700/30 px-2 py-1.5 text-center" style={{ fontFamily:'DM Sans, sans-serif' }}>
            ⚠ micro refusé · autorisez-le dans les paramètres du site
          </div>
        )}
        {micError === 'other' && (
          <div className="mb-2 text-[10px] uppercase tracking-widest text-[color:var(--gris)] bg-stone-100 border border-stone-300 px-2 py-1.5 text-center" style={{ fontFamily:'DM Sans, sans-serif' }}>
            micro non disponible sur ce navigateur
          </div>
        )}

        {/* Recording status bar */}
        {recording && (
          <div className="mb-2 flex items-center gap-2 px-3 py-2 border" style={{ backgroundColor: avatar.soft, borderColor: avatar.color }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: avatar.color }}></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: avatar.color }}></span>
            </span>
            <span className="text-[11px] uppercase tracking-widest flex-1" style={{ fontFamily:'DM Sans, sans-serif', color: avatar.color }}>
              {countdown > 0
                ? `envoi dans ${countdown} s… continuez de parler pour attendre`
                : `à l'écoute · parlez en ${lang.name.toLowerCase()}`}
            </span>
          </div>
        )}

        <div className="flex items-end gap-2">
          <button
            onClick={recording ? stopListening : startListening}
            disabled={disabled}
            className={`shrink-0 w-11 h-11 grid place-items-center transition-all ${
              recording
                ? 'text-stone-50 animate-pulse'
                : micError === 'denied' || micError === 'other'
                  ? 'bg-stone-400 text-stone-100'
                  : 'wl-btn-secondary disabled:opacity-30'
            }`}
            style={recording ? { backgroundColor: avatar.color } : {}}
            aria-label={recording ? 'arrêter le micro' : 'démarrer le micro'}
            title={recording ? 'arrêter' : 'démarrer le micro'}>
            {recording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <div className="flex-1 relative">
            <textarea ref={textareaRef} value={displayText}
              onChange={(e) => { setText(e.target.value); accumulatedRef.current = e.target.value; }}
              onKeyDown={handleKey} rows={1} disabled={disabled}
              placeholder={recording
                ? `parlez en ${lang.name.toLowerCase()}…`
                : autoListen
                  ? `parlez ou écrivez à ${avatar.name}…`
                  : `écrivez à ${avatar.name}…`}
              className="w-full resize-none wl-card px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-700/40 disabled:opacity-50 text-base"
              style={{ fontFamily:'Fraunces, Georgia, serif', maxHeight:120, direction: lang.rtl ? 'rtl' : 'ltr' }} />
          </div>
          <button onClick={submitFromButton} disabled={disabled || !((text || interim).trim())}
            className="shrink-0 w-11 h-11 grid place-items-center text-stone-50 disabled:opacity-30 transition-all"
            style={{ backgroundColor: avatar.color }} aria-label="envoyer">
            {disabled ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VOICE PICKER ─────────────────────────────────────────────────────────────

function VoicePicker({ voices, lang, avatar, currentURI, onChoose, onClose, onPreview }) {
  const base = (lang.ttsLocale || 'en-US').split('-')[0];
  const filtered = voices
    .filter(v => v.lang.startsWith(base))
    .sort((a, b) => {
      // Quality score
      const score = (v) => {
        let s = 0;
        const n = v.name.toLowerCase();
        if (/natural|premium|enhanced|neural|wavenet|studio/.test(n)) s += 100;
        if (/google/.test(n)) s += 50;
        if (/microsoft/.test(n) && /online|natural/.test(n)) s += 40;
        return s;
      };
      return score(b) - score(a);
    });

  return (
    <div className="fixed inset-0 z-50 bg-[color:rgba(43,36,34,0.55)] flex items-end sm:items-center justify-center p-0 sm:p-4"
         onClick={onClose}>
      <div className="w-full sm:max-w-lg wl-card max-h-[85vh] flex flex-col"
           onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
              voix pour · {avatar.name}
            </div>
            <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-lg font-medium leading-none mt-0.5">
              Choisir la voix
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:var(--ink)] hover:text-white">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center">
              <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-[color:var(--ink)]">
                Aucune voix installée pour <em>{lang.name.toLowerCase()}</em> sur cet appareil.
              </div>
              <div className="mt-3 text-xs text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
                installez une voix dans les paramètres système<br/>
                (windows : paramètres › voix · android : synthèse vocale)
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => onChoose(null)}
                className={`w-full text-left px-4 py-3 border-b border-stone-300 hover:bg-white flex items-center gap-3 ${!currentURI ? 'bg-amber-50' : ''}`}
              >
                <div className="flex-1">
                  <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="font-medium">Auto (recommandé)</div>
                  <div className="text-xs text-[color:var(--gris)] mt-0.5" style={{ fontFamily:'DM Sans, sans-serif' }}>
                    l'appli choisit la meilleure voix disponible
                  </div>
                </div>
                {!currentURI && <span className="text-amber-700">✓</span>}
              </button>
              {filtered.map((v) => {
                const isNatural = /natural|premium|enhanced|neural|wavenet/i.test(v.name);
                const isGoogle = /google/i.test(v.name);
                const gender = guessVoiceGender(v.name);
                const isSelected = currentURI === v.voiceURI;
                return (
                  <div key={v.voiceURI} className={`px-4 py-3 border-b border-stone-200 flex items-center gap-2 ${isSelected ? 'bg-amber-50' : 'hover:bg-white'}`}>
                    <button onClick={() => onPreview(v.voiceURI)}
                      className="w-9 h-9 grid place-items-center wl-btn-secondary shrink-0"
                      title="écouter un extrait">
                      <Volume2 size={14} />
                    </button>
                    <button onClick={() => onChoose(v.voiceURI)} className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontFamily:'Fraunces, Georgia, serif' }} className="font-medium truncate">
                          {v.name}
                        </span>
                        {gender === 'female' && (
                          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-rose-600 text-stone-50" style={{ fontFamily:'DM Sans, sans-serif' }}>
                            ♀ f
                          </span>
                        )}
                        {gender === 'male' && (
                          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-sky-700 text-stone-50" style={{ fontFamily:'DM Sans, sans-serif' }}>
                            ♂ h
                          </span>
                        )}
                        {isNatural && (
                          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-emerald-700 text-stone-50" style={{ fontFamily:'DM Sans, sans-serif' }}>
                            naturelle
                          </span>
                        )}
                        {isGoogle && !isNatural && (
                          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-stone-700 text-stone-50" style={{ fontFamily:'DM Sans, sans-serif' }}>
                            google
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[color:var(--gris)] mt-0.5" style={{ fontFamily:'DM Sans, sans-serif' }}>
                        {v.lang}{v.localService ? ' · local' : ' · en ligne'}
                      </div>
                    </button>
                    {isSelected && <span className="text-amber-700 shrink-0">✓</span>}
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="px-4 py-2 border-t border-stone-300 text-[10px] uppercase tracking-widest text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
          {filtered.length} voix trouvée{filtered.length > 1 ? 's' : ''} · touchez 🔊 pour écouter
        </div>
      </div>
    </div>
  );
}

// ─── EXERCISES SCREEN ─────────────────────────────────────────────────────────

function ExercisesScreen({ lang, level, onBack }) {
  const [errors, setErrors] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedCats, setSelectedCats] = useState(null); // null = all top 3
  const [exercises, setExercises] = useState(null);
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(null); // { correct, feedback_fr }
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const e = loadRecentErrors(lang, level, 30);
    setErrors(e);
    setSummary(summarizeErrors(e));
  }, [lang.code, level.id]);

  const generate = async (categories) => {
    setLoading(true); setError(null);
    setExercises(null); setCurrent(0); setUserAnswer(''); setShowResult(null); setScore(0); setDone(false);
    try {
      // Pick sample errors from chosen categories
      const cats = categories?.length ? categories : summary.slice(0, 3).map(s => s.category);
      const samples = errors
        .filter(e => cats.includes(e.category || 'other'))
        .slice(0, 10);

      const system = `You are a language teacher creating targeted grammar exercises for a French speaker learning ${lang.nativeName} (${lang.name}) at ${level.label} level.

${LEVEL_CONSTRAINTS[level.id] || level.prompt}

Their recent mistakes (JSON):
${JSON.stringify(samples, null, 2)}

Categories to work on: ${cats.map(c => CATEGORY_LABELS_FR[c] || c).join(', ')}

Generate exactly 5 short exercises that target these specific weaknesses. Mix 3 types:
- "fill_blank": one sentence with a ___ blank to fill (the answer is 1-4 words)
- "transform": a sentence to rewrite following an instruction (e.g. "Put in the past tense", "Correct the following sentence")
- "translate": a short French sentence to translate into ${lang.nativeName}

For each exercise, provide the model answer AND acceptable alternative answers.

Respond ONLY with a JSON array, no code fences:
[
  {
    "type": "fill_blank"|"transform"|"translate",
    "instruction_fr": "<short instruction in French>",
    "prompt": "<the sentence in ${lang.nativeName} with ___ for fill_blank, or the source sentence to transform, or the French sentence to translate>",
    "answer": "<the correct answer, plain text, in ${lang.nativeName}>",
    "alternatives": ["<other acceptable answers, if any>"],
    "hint_fr": "<one short hint in French to help if the user is stuck>",
    "category": "<same category taxonomy>"
  }
]

Each exercise must clearly target one of the given categories. Keep exercises short, appropriate to level, and pedagogically clear.`;

      const data = await chatWithFallback({
        system,
        messages: [{ role: 'user', content: `Generate the 5 exercises now, focused on: ${cats.join(', ')}.` }],
        maxTokens: 1500,
      });
      const raw = data?.content?.[0]?.text || '[]';
      const cleaned = raw.replace(/```json\s*|```/g, '').trim();
      const s = cleaned.indexOf('['), e = cleaned.lastIndexOf(']');
      const parsed = JSON.parse(s !== -1 ? cleaned.slice(s, e + 1) : cleaned);
      setExercises(parsed);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const check = async () => {
    if (!userAnswer.trim() || !exercises) return;
    const ex = exercises[current];
    setChecking(true);
    try {
      // Local quick check first
      const normalize = (s) => s.toLowerCase().trim().replace(/[.,;!?"']/g, '').replace(/\s+/g, ' ');
      const acceptable = [ex.answer, ...(ex.alternatives || [])].map(normalize);
      const userNorm = normalize(userAnswer);
      let correct = acceptable.includes(userNorm);

      // If not an exact match, ask Claude to judge (tolerates paraphrases)
      let feedback_fr = '';
      if (!correct) {
        const judge = await chatWithFallback({
          system: `You judge whether a language learner's answer to a grammar exercise is correct.
Language being learned: ${lang.nativeName}.
Be lenient on minor typos but strict on grammar and vocabulary.
Respond ONLY with JSON: {"correct": <boolean>, "feedback_fr": "<one short French sentence explaining what's wrong or confirming, mention the correct form>"}`,
          messages: [{ role: 'user', content: `Exercise: ${ex.instruction_fr}\nPrompt: ${ex.prompt}\nExpected answer: ${ex.answer}\nAcceptable alternatives: ${(ex.alternatives || []).join(' | ')}\nStudent's answer: ${userAnswer}` }],
          maxTokens: 200,
        });
        const rawJ = judge?.content?.[0]?.text || '{}';
        const cleaned = rawJ.replace(/```json\s*|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        correct = !!parsed.correct;
        feedback_fr = parsed.feedback_fr || '';
      } else {
        feedback_fr = `✓ Bonne réponse !`;
      }

      setShowResult({ correct, feedback_fr });
      if (correct) setScore(s => s + 1);
    } catch (e) {
      // Fallback to lenient local judge
      const okLocal = userAnswer.trim().toLowerCase() === ex.answer.trim().toLowerCase();
      setShowResult({ correct: okLocal, feedback_fr: okLocal ? '✓ Bonne réponse !' : `La bonne réponse est : « ${ex.answer} »` });
      if (okLocal) setScore(s => s + 1);
    } finally {
      setChecking(false);
    }
  };

  const nextExercise = () => {
    if (current + 1 < exercises.length) {
      setCurrent(current + 1);
      setUserAnswer(''); setShowResult(null);
    } else {
      setDone(true);
    }
  };

  const accent = lang.accent;

  // ─── Écran d'accueil : choix des catégories ───────────────────────────────
  if (!exercises && !loading) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">
          <button onClick={onBack}
            className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
            style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            <ArrowLeft size={14} /> retour
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center rounded-full mb-3"
                 style={{ width: 68, height: 68, background: `linear-gradient(135deg, ${accent}, ${accent}CC)`, boxShadow: `0 6px 18px ${accent}55` }}>
              <span style={{ fontSize: 30 }}>📝</span>
            </div>
            <h1 className="text-3xl sm:text-4xl leading-none mt-2"
                style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
              Exercices <em style={{ color: accent }}>sur mesure</em>
            </h1>
            <p className="mt-3 text-[15px] max-w-md mx-auto" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              Générés à partir de vos dernières erreurs en {lang.name}
            </p>
          </div>

          {errors.length === 0 ? (
            <div className="wl-card p-8 text-center" style={{ borderRadius: '24px' }}>
              <div className="text-4xl mb-3">✨</div>
              <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 16 }}>
                Aucune erreur enregistrée pour l'instant.<br/>
                Discutez d'abord avec un prof pour identifier vos points faibles !
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--gris)' }}>
                vos points à travailler
              </div>
              <div className="space-y-2 mb-6">
                {summary.slice(0, 6).map((s, i) => {
                  const label = CATEGORY_LABELS_FR[s.category] || s.category;
                  const isTop = i === 0;
                  return (
                    <div key={s.category}
                         className="flex items-center gap-3 p-3.5"
                         style={{
                           borderRadius: '9999px',
                           background: 'white',
                           border: `1.5px solid ${isTop ? accent : 'rgba(90,78,69,0.15)'}`,
                           boxShadow: isTop ? `0 3px 10px ${accent}22` : 'none',
                         }}>
                      <div className="rounded-full flex items-center justify-center shrink-0 text-white font-bold"
                           style={{ width: 36, height: 36, background: isTop ? accent : 'var(--gris)', fontFamily: 'Fraunces, Georgia, serif', fontSize: 14 }}>
                        {s.count}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 15, fontWeight: 500 }}>
                          {label}
                        </div>
                        <div className="text-[11px] truncate" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                          {s.count} erreur{s.count > 1 ? 's' : ''} détectée{s.count > 1 ? 's' : ''}
                        </div>
                      </div>
                      {isTop && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white shrink-0"
                              style={{ background: accent, fontFamily: 'DM Sans' }}>
                          priorité
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button onClick={() => generate(null)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}DD)`, boxShadow: `0 6px 20px ${accent}55`, fontFamily: 'DM Sans', fontWeight: 700 }}>
                🎯 Générer 5 exercices ciblés
              </button>

              {summary.length > 3 && (
                <div className="mt-3 text-center text-[12px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                  focus sur les 3 catégories prioritaires
                </div>
              )}
            </>
          )}

          {error && (
            <div className="wl-card px-4 py-3 mt-4 text-sm font-semibold text-center"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Chargement ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 size={28} className="animate-spin inline mb-3" style={{ color: accent }} />
          <p style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)', fontSize: 18 }}>
            Le prof prépare vos exercices…
          </p>
        </div>
      </div>
    );
  }

  // ─── Écran final ──────────────────────────────────────────────────────────
  if (done) {
    const pct = Math.round((score / exercises.length) * 100);
    const compliment = pct === 100 ? 'Parfait !' : pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien joué' : pct >= 40 ? 'Continuez' : 'À retravailler';
    return (
      <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-3">{pct === 100 ? '🏆' : pct >= 60 ? '🎉' : '💪'}</div>
          <h1 className="text-3xl sm:text-4xl leading-none"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
            {compliment}
          </h1>
          <div className="mt-6 mx-auto rounded-full flex items-center justify-center relative"
               style={{ width: 160, height: 160, background: `radial-gradient(circle at 30% 30%, ${accent}, ${accent}CC)`, boxShadow: `0 12px 40px ${accent}66` }}>
            <div className="text-white">
              <div className="text-5xl font-bold" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>{score}/{exercises.length}</div>
              <div className="text-[13px] opacity-90 mt-1" style={{ fontFamily: 'DM Sans' }}>{pct}%</div>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={() => generate(null)}
              className="wl-chip px-6 py-3 flex items-center justify-center gap-2"
              style={{ fontFamily: 'DM Sans', fontWeight: 700, color: 'var(--ink)' }}>
              <RefreshCw size={14} /> nouvelle série
            </button>
            <button onClick={onBack}
              className="wl-btn-primary flex-1 flex items-center justify-center gap-2">
              Retour au chat →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Écran d'exercice en cours ────────────────────────────────────────────
  const ex = exercises[current];
  const typeLabel = { fill_blank: 'Complétez', transform: 'Transformez', translate: 'Traduisez' }[ex.type] || 'Exercice';

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        {/* Progression */}
        <div className="flex items-center gap-2 mb-6">
          {exercises.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full transition-colors"
                 style={{ background: i < current ? accent : (i === current ? `${accent}88` : 'rgba(90,78,69,0.15)') }} />
          ))}
        </div>

        <div className="wl-card p-5 sm:p-6" style={{ borderRadius: '24px', border: `1.5px solid ${accent}33` }}>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-3"
               style={{ fontFamily: 'DM Sans', color: accent }}>
            <span className="rounded-full px-2.5 py-1" style={{ background: `${accent}18` }}>
              exercice {current + 1} / {exercises.length}
            </span>
            <span className="rounded-full px-2.5 py-1" style={{ background: `${accent}18` }}>
              {typeLabel}
            </span>
            <span className="rounded-full px-2.5 py-1" style={{ background: 'rgba(90,78,69,0.1)', color: 'var(--gris)' }}>
              {CATEGORY_LABELS_FR[ex.category] || ex.category}
            </span>
          </div>

          <p className="text-[15px] italic mb-3" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--gris)' }}>
            {ex.instruction_fr}
          </p>

          <div className="text-[20px] sm:text-[22px] leading-relaxed mb-4 py-3 px-1"
               style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
            « {ex.prompt} »
          </div>

          {!showResult && (
            <>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={`votre réponse en ${lang.name.toLowerCase()}…`}
                rows={2}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); } }}
                className="w-full px-4 py-3 focus:outline-none resize-none"
                style={{
                  fontFamily: 'DM Sans', fontSize: 16,
                  border: '1px solid rgba(90,78,69,0.2)',
                  borderRadius: '18px',
                  background: 'white',
                }}
              />

              {ex.hint_fr && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider hover:opacity-70"
                           style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                    💡 indice
                  </summary>
                  <div className="mt-2 p-3 rounded-2xl text-[13px]"
                       style={{ fontFamily: 'Fraunces, Georgia, serif', background: `${accent}12`, color: 'var(--ink)' }}>
                    {ex.hint_fr}
                  </div>
                </details>
              )}

              <button onClick={check} disabled={checking || !userAnswer.trim()}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-full text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}DD)`, fontFamily: 'DM Sans', fontWeight: 700 }}>
                {checking && <Loader2 size={16} className="animate-spin" />}
                {checking ? 'vérification…' : 'Valider'}
              </button>
            </>
          )}

          {showResult && (
            <div className="mt-2">
              <div className="p-4 rounded-2xl"
                   style={{
                     background: showResult.correct ? '#DCFCE7' : '#FEE2E2',
                     border: `1px solid ${showResult.correct ? '#86EFAC' : '#FCA5A5'}`,
                   }}>
                <div className="flex items-center gap-2 text-sm font-bold mb-2"
                     style={{ fontFamily: 'DM Sans', color: showResult.correct ? '#15803D' : '#B91C1C' }}>
                  {showResult.correct ? (<><Check size={16} /> Bravo !</>) : (<><X size={16} /> Pas tout à fait</>)}
                </div>
                <div className="text-[13px]" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                  {showResult.feedback_fr}
                </div>
                {!showResult.correct && (
                  <div className="mt-2 text-[14px] italic" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                    Réponse attendue&nbsp;: <strong>« {ex.answer} »</strong>
                  </div>
                )}
              </div>

              <button onClick={nextExercise}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-full text-white transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}DD)`, fontFamily: 'DM Sans', fontWeight: 700 }}>
                {current + 1 < exercises.length ? 'Exercice suivant →' : 'Voir le résultat 🏁'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-[13px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          Score : <strong style={{ color: accent }}>{score}</strong> / {current + (showResult ? 1 : 0)}
        </div>
      </div>
    </div>
  );
}

// ─── CHAT SCREEN ──────────────────────────────────────────────────────────────

function ChatScreen({ lang, level, avatar, onChangeAvatar, onOpenExercises }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [autoListen, setAutoListen] = useState(() => {
    // Default: auto-listen ON, but respect user's saved preference
    const saved = storage.get('pref:autoListen');
    return saved === null ? true : saved === 'true';
  });
  const [resumedFrom, setResumedFrom] = useState(null);
  const [voiceURI, setVoiceURI] = useState(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [wordPopup, setWordPopup] = useState(null);
  const { speak, speakSequence, stop, speakingText, voices } = useSpeech();
  const endRef = useRef(null);
  const initDone = useRef(false);

  // Persist autoListen pref
  useEffect(() => {
    storage.set('pref:autoListen', String(autoListen));
  }, [autoListen]);

  // Load voice preference for this avatar
  useEffect(() => {
    loadVoicePref(avatar).then(setVoiceURI);
  }, [avatar.id]);

  const speakFor = (text) => speak(text, avatar, lang, voiceURI);

  // Speak the reply, then (if corrections) the tutor's echo of the correct form.
  const speakReplyWithCorrections = (reply, corrections) => {
    const items = [];
    if (reply) items.push({ text: reply });
    if (corrections && corrections.length) {
      corrections.forEach(c => {
        const echo = c.spoken_echo || c.corrected;
        if (echo) items.push({ text: echo, pauseBefore: 700, rate: (avatar?.rate ?? 0.9) - 0.05 });
      });
    }
    if (items.length > 1) speakSequence(items, avatar, lang, voiceURI);
    else if (items.length === 1) speakFor(items[0].text);
  };

  useEffect(() => {
    initDone.current = false;
    setResumedFrom(null);
    (async () => {
      const saved = await loadConversation(lang, level, avatar);
      if (saved && saved.length > 0) {
        setMessages(saved);
        const stats = await loadStats(lang, level, avatar);
        setResumedFrom(stats?.lastVisit || null);
      } else {
        const g = avatar.greetings[Math.floor(Math.random() * avatar.greetings.length)];
        setMessages([{ role:'assistant', reply: g.t, translation: g.fr, corrections: [] }]);
        setTimeout(() => speakFor(g.t), 600);
      }
      initDone.current = true;
    })();
    return () => stop();
    // eslint-disable-next-line
  }, [avatar.id, lang.code, level.id]);

  // Auto-save on every message change (after initial load)
  useEffect(() => {
    if (!initDone.current) return;
    if (messages.length < 1) return;
    saveConversation(lang, level, avatar, messages);
  }, [messages, lang.code, level.id, avatar.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMsg = { role:'user', content: text, corrections: [] };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => m.role === 'user' ? { role:'user', content: m.content } : { role:'assistant', content: m.reply });
      // Uses chatWithFallback: Haiku first (fast + cheap), Sonnet only if Haiku unavailable
      const data = await chatWithFallback({
        system: buildSystemPrompt(lang, level, avatar),
        messages: apiMessages,
        maxTokens: 1000,
      });
      const textOut = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
      let parsed;
      try {
        const cleaned = textOut.replace(/```json\s*/gi,'').replace(/```/g,'').trim();
        const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
        parsed = JSON.parse(s !== -1 && e !== -1 ? cleaned.slice(s, e+1) : cleaned);
      } catch (e) {
        parsed = { reply: textOut, fr_translation:'', corrections: [] };
      }
      setMessages(prev => {
        const upd = [...prev];
        const lastU = upd.map(m => m.role).lastIndexOf('user');
        if (lastU !== -1) upd[lastU] = { ...upd[lastU], corrections: parsed.corrections || [] };
        return [...upd, { role:'assistant', reply: parsed.reply || '(no reply)', translation: parsed.fr_translation || '', corrections: [] }];
      });
      // Log errors for the grammar-exercises generator
      (parsed.corrections || []).forEach(c => logError(lang, level, c));
      if (autoSpeak && parsed.reply) speakReplyWithCorrections(parsed.reply, parsed.corrections || []);
    } catch (err) {
      setMessages(prev => [...prev, { role:'assistant', reply:'…', translation:"Désolé, problème de connexion.", corrections: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const restartChat = async () => {
    if (messages.length > 1) {
      if (!window.confirm("Effacer cette conversation et recommencer à zéro ?")) return;
    }
    stop();
    await clearConversation(lang, level, avatar);
    setResumedFrom(null);
    const g = avatar.greetings[Math.floor(Math.random() * avatar.greetings.length)];
    setMessages([{ role:'assistant', reply: g.t, translation: g.fr, corrections: [] }]);
    setTimeout(() => speakFor(g.t), 400);
  };

  const handleChooseVoice = async (uri) => {
    setVoiceURI(uri);
    await saveVoicePref(avatar, uri);
    setShowVoicePicker(false);
  };
  const handlePreviewVoice = (uri) => {
    const sample = avatar.greetings[0].t;
    speak(sample, avatar, lang, uri);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor:'transparent' }}>
      <div className="border-b wl-card sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-3 flex items-center gap-3">
          <button onClick={onChangeAvatar} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:var(--ink)] hover:text-white transition-colors" title="changer">
            <ArrowLeft size={16} />
          </button>
          <AnimatedAvatar avatar={avatar} size="sm" speaking={!!speakingText} />
          <div className="flex-1 min-w-0">
            <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-lg font-medium leading-none">{avatar.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mt-0.5 truncate" style={{ fontFamily:'DM Sans, sans-serif' }}>
              {lang.name} · {level.label.toLowerCase()} · {avatar.location}
            </div>
          </div>
          <button onClick={() => setShowVoicePicker(true)} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)] relative" title="choisir la voix">
            <span className="text-[10px] font-bold" style={{ fontFamily:'DM Sans, sans-serif' }}>A♪</span>
            {voiceURI && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-700 rounded-full" />}
          </button>
          <button onClick={() => setAutoListen(s => !s)} className={`w-9 h-9 grid place-items-center border ${autoListen ? 'wl-btn-secondary border-transparent' : 'border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)]'}`} title={autoListen ? "conversation mains-libres activée" : "conversation mains-libres désactivée"}>
            <Mic size={14} />
          </button>
          <button onClick={() => setAutoSpeak(s => !s)} className={`w-9 h-9 grid place-items-center border ${autoSpeak ? 'wl-btn-secondary border-transparent' : 'border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)]'}`} title="lecture auto">
            <Volume2 size={14} />
          </button>
          <button onClick={restartChat} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)]" title="nouvelle conversation">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-5">
          {resumedFrom && (
            <div className="border-l-4 border-stone-400 pl-3 py-2 mb-4 bg-stone-100/70 flex items-center gap-2 text-[11px] uppercase tracking-widest text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
              <span>📖</span>
              <span>reprise · dernière visite {timeSince(resumedFrom)}</span>
            </div>
          )}
          {messages.map((m, i) => m.role === 'user'
            ? <UserMessage key={i} message={m} rtl={lang.rtl}
                onReplayCorrection={(corrs) => {
                  const items = corrs.map(c => ({ text: c.spoken_echo || c.corrected })).filter(x => x.text);
                  if (items.length) speakSequence(items, avatar, lang, voiceURI);
                }} />
            : <AssistantMessage key={i} message={m} avatar={avatar} lang={lang}
                onSpeak={() => speakFor(m.reply)}
                speaking={speakingText === m.reply}
                onWordClick={(w, ctx) => setWordPopup({ word: w, context: ctx })} />
          )}
          {loading && <TypingIndicator avatar={avatar} />}
          <div ref={endRef} />
        </div>
      </div>

      <ChatInput onSend={sendMessage} disabled={loading} avatar={avatar} lang={lang}
        autoListen={autoListen} avatarIsSpeaking={!!speakingText} />

      {showVoicePicker && (
        <VoicePicker voices={voices} lang={lang} avatar={avatar} currentURI={voiceURI}
          onChoose={handleChooseVoice} onPreview={handlePreviewVoice}
          onClose={() => setShowVoicePicker(false)} />
      )}
      {wordPopup && (
        <WordExplainPopup word={wordPopup.word} context={wordPopup.context} lang={lang}
          onClose={() => setWordPopup(null)}
          onSpeak={(t) => speakFor(t)} />
      )}
    </div>
  );
}

// ─── READER MODE ──────────────────────────────────────────────────────────────

const READER_TOPICS = [
  { id: 'daily',    label: 'Vie quotidienne',       icon: '☕' },
  { id: 'travel',   label: 'Voyage & culture',      icon: '✈️' },
  { id: 'work',     label: 'Travail & bureau',      icon: '💼' },
  { id: 'tech',     label: 'Technologie',           icon: '💻' },
  { id: 'food',     label: 'Cuisine',               icon: '🍜' },
  { id: 'news',     label: 'Actualité',             icon: '📰' },
  { id: 'science',  label: 'Sciences',              icon: '🔬' },
  { id: 'story',    label: 'Petite histoire',       icon: '📖' },
];

async function generateReaderText(lang, level, topic, { onPartial } = {}) {
  const lengthByLevel = {
    beginner: '4 short simple sentences (5-10 words max each)',
    intermediate: '5-6 sentences with varied structure (8-18 words each)',
    advanced: '6-7 sentences, rich vocabulary and complex structures',
  };
  const system = `You write short reading passages for French speakers learning ${lang.nativeName} (${lang.name}).

${LEVEL_CONSTRAINTS[level.id] || level.prompt}

Length: ${lengthByLevel[level.id]}. KEEP IT SHORT.
Topic: ${topic.label}.

Write a self-contained passage in ${lang.nativeName}${lang.code === 'mfe' ? ' (Kreol Morisien, authentic Mauritian Creole)' : ''}.
The vocabulary AND grammar must STRICTLY respect the level constraints above — never exceed them.
Also provide the full French translation.
Give the passage a short title (in ${lang.nativeName}).

Respond ONLY with JSON, no code fences. Emit fields IN THIS ORDER — title first, then text, then translation:
{
  "title": "<short title in target language>",
  "text": "<the reading passage in target language, plain text>",
  "translation": "<full French translation>"
}`;

  // Try streaming with Haiku models first, then non-streaming Sonnet as last resort.
  const streamingModels = ['claude-haiku-4-5', 'claude-3-5-haiku-latest'];
  let accumulated = '';
  let streamSucceeded = false;

  for (const model of streamingModels) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model, max_tokens: 800, system,
          messages: [{ role: 'user', content: `Give me a new passage about "${topic.label}".` }],
          stream: true,
        }),
      });
      if (!response.ok || !response.body) {
        if (response.status === 400 || response.status === 404) continue;
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        for (const evt of events) {
          for (const line of evt.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const dataStr = line.slice(6);
            try {
              const evtData = JSON.parse(dataStr);
              if (evtData.type === 'content_block_delta' && evtData.delta?.text) {
                accumulated += evtData.delta.text;
                if (onPartial) {
                  const partial = extractPartialJson(accumulated);
                  if (partial) onPartial(partial);
                }
              }
            } catch { /* skip */ }
          }
        }
      }
      streamSucceeded = true;
      break;
    } catch (e) {
      // Try next model
    }
  }

  // Fallback: non-streaming call via chatWithFallback
  if (!streamSucceeded) {
    const data = await chatWithFallback({
      system,
      messages: [{ role: 'user', content: `Give me a new passage about "${topic.label}".` }],
      maxTokens: 800,
    });
    accumulated = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
  }

  const cleaned = accumulated.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
  return JSON.parse(s !== -1 && e !== -1 ? cleaned.slice(s, e + 1) : cleaned);
}

// Given a partial JSON string (still streaming), extract already-completed fields.
function extractPartialJson(raw) {
  const start = raw.indexOf('{');
  if (start === -1) return null;
  const inner = raw.slice(start);
  const out = {};
  const grab = (key) => {
    const re = new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)`, 's');
    const m = inner.match(re);
    if (!m) return null;
    return m[1]
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
  };
  const t = grab('title');
  const tx = grab('text');
  const tr = grab('translation');
  if (t !== null) out.title = t;
  if (tx !== null) out.text = tx;
  if (tr !== null) out.translation = tr;
  return (out.title || out.text || out.translation) ? out : null;
}

function ReaderScreen({ lang, level, onBack }) {
  const [topic, setTopic] = useState(READER_TOPICS[0]);
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingHint, setLoadingHint] = useState('');
  const [error, setError] = useState(null);
  const [showFr, setShowFr] = useState(false);
  const [wordPopup, setWordPopup] = useState(null);
  const { speak, stop, speakingText } = useSpeech();

  // Cache: keep the last passage per topic in memory for instant re-display
  const cacheRef = useRef({});

  const load = async (t, forceNew = false) => {
    // Instant display from cache if available and not forcing new
    const cacheKey = `${lang.code}:${level.id}:${t.id}`;
    if (!forceNew && cacheRef.current[cacheKey]) {
      setPassage(cacheRef.current[cacheKey]);
      setShowFr(false);
      setError(null);
      return;
    }

    setLoading(true); setError(null); setPassage(null); setShowFr(false);
    setLoadingHint('génération…');

    try {
      // Streaming: the passage state updates as tokens arrive.
      const data = await generateReaderText(lang, level, t, {
        onPartial: (partial) => {
          setPassage(prev => ({
            title: partial.title || prev?.title || '',
            text: partial.text || prev?.text || '',
            translation: partial.translation || prev?.translation || '',
          }));
          // Once we start receiving text, we can hide the loading state
          if (partial.text) setLoading(false);
        },
      });
      cacheRef.current[cacheKey] = data;
      setPassage(data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(topic); return () => stop();
    // eslint-disable-next-line
  }, [topic.id, lang.code, level.id]);

  const speakPassage = () => {
    if (passage) speak(passage.text, null, lang);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor:'transparent' }}>
      <div className="border-b wl-card sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-3 flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:var(--ink)] hover:text-white transition-colors" title="retour">
            <ArrowLeft size={16} />
          </button>
          <div className="w-11 h-11 grid place-items-center text-stone-50 shrink-0" style={{ backgroundColor: lang.accent }}>
            <BookText size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-lg font-medium leading-none">Lecture</div>
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mt-0.5 truncate" style={{ fontFamily:'DM Sans, sans-serif' }}>
              {lang.name} · {level.label.toLowerCase()}
            </div>
          </div>
          <button onClick={() => load(topic, true)} disabled={loading}
            className="w-9 h-9 grid place-items-center border border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)] disabled:opacity-30" title="nouveau texte">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-5">
          {/* Topic pills */}
          <div className="mb-5">
            <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-2" style={{ fontFamily:'DM Sans, sans-serif' }}>
              sujet
            </div>
            <div className="flex gap-2 flex-wrap">
              {READER_TOPICS.map(t => (
                <button key={t.id} onClick={() => setTopic(t)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                    topic.id === t.id
                      ? 'wl-btn-secondary border-transparent'
                      : 'bg-stone-50 border-stone-300 hover:border-[color:rgba(90,78,69,0.3)]'
                  }`}
                  style={{ fontFamily:'DM Sans, sans-serif' }}>
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading && !passage && (
            <div className="wl-card p-5 sm:p-8 relative">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-stone-300">
                <div className="w-9 h-9 grid place-items-center bg-stone-100 border border-stone-300">
                  <Loader2 size={14} className="animate-spin text-[color:var(--gris)]" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)]" style={{ fontFamily:'DM Sans, sans-serif' }}>
                    {topic.icon} {topic.label}
                  </div>
                  <div className="text-sm text-[color:var(--ink)] mt-1" style={{ fontFamily:'DM Sans, sans-serif' }}>
                    {loadingHint || 'préparation…'}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[100, 92, 85, 96, 78].map((w, i) => (
                  <div key={i} className="h-4 bg-stone-200 animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="border-2 border-amber-700 bg-amber-50 p-4 text-amber-900" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
              Impossible de générer un texte. Vérifiez votre connexion et réessayez.
            </div>
          )}

          {passage && (
            <div className="wl-card p-5 sm:p-8 relative"
                 style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.04) 31px, rgba(0,0,0,0.04) 32px)' }}>
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-stone-300">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] flex items-center gap-2" style={{ fontFamily:'DM Sans, sans-serif' }}>
                    <span>{topic.icon} {topic.label}</span>
                    {loading && <Loader2 size={10} className="animate-spin" />}
                  </div>
                  <h2 style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-2xl sm:text-3xl font-medium leading-tight mt-1 italic" dir={lang.rtl ? 'rtl' : 'ltr'}>
                    {passage.title || <span className="text-[color:rgba(90,78,69,0.55)]">…</span>}
                  </h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={speakPassage} disabled={loading || !passage.text}
                    className={`w-9 h-9 grid place-items-center transition-colors disabled:opacity-30 ${speakingText === passage.text ? 'bg-amber-700 text-stone-50 animate-pulse' : 'wl-btn-secondary'}`}
                    title="écouter le texte">
                    <Volume2 size={14} />
                  </button>
                  <button onClick={() => setShowFr(s => !s)} disabled={!passage.translation}
                    className={`px-2 py-1 text-[10px] uppercase tracking-widest border disabled:opacity-30 ${showFr ? 'wl-btn-secondary border-transparent' : 'border-[color:rgba(90,78,69,0.3)] hover:bg-[color:rgba(255,255,255,0.5)]'}`}
                    style={{ fontFamily:'DM Sans, sans-serif' }}>
                    fr
                  </button>
                </div>
              </div>

              <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-lg leading-relaxed text-[color:var(--ink)]" dir={lang.rtl ? 'rtl' : 'ltr'}>
                <ClickableText text={passage.text || ''} onWordClick={(w, ctx) => setWordPopup({ word: w, context: ctx })} rtl={lang.rtl} />
                {loading && (
                  <span className="inline-block w-0.5 h-5 bg-[color:var(--ink)] ml-0.5 align-middle" style={{ animation: 'cursor-blink 0.9s steps(2) infinite' }} />
                )}
              </div>

              {showFr && passage.translation && (
                <div className="mt-5 pt-4 border-t border-stone-300">
                  <div className="text-[10px] uppercase tracking-widest text-[color:var(--gris)] mb-2" style={{ fontFamily:'DM Sans, sans-serif' }}>traduction française</div>
                  <div style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-[color:var(--ink)] leading-relaxed italic">
                    {passage.translation}
                  </div>
                </div>
              )}

              {!loading && (
                <div className="mt-6 text-[10px] uppercase tracking-widest text-[color:rgba(90,78,69,0.55)] text-center" style={{ fontFamily:'DM Sans, sans-serif' }}>
                  ↳ touchez un mot pour sa traduction et son explication
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {wordPopup && (
        <WordExplainPopup word={wordPopup.word} context={wordPopup.context} lang={lang}
          onClose={() => setWordPopup(null)}
          onSpeak={(t) => speak(t, null, lang)} />
      )}
    </div>
  );
}

// ─── STEP 2.5: MODE PICKER ────────────────────────────────────────────────────

function ModePicker({ language, level, onSelect, onBack }) {
  const modes = [
    { id: 'chat',   label: 'Discuter',  icon: MessageCircle,
      desc: "Conversation vocale avec un interlocuteur virtuel. Il vous répond, corrige vos erreurs et explique." },
    { id: 'reader', label: 'Lire',      icon: BookText,
      desc: "Textes générés à votre niveau, sur le sujet de votre choix. Touchez chaque mot pour sa traduction et son explication." },
  ];
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'transparent' }}>
      <div className="max-w-3xl mx-auto">
        <StepHeader step={3} total={4} label="mode" onBack={onBack} />
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-none" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          <em>Comment</em> apprendre ?
        </h1>
        <p className="mt-3 text-[color:var(--gris)] max-w-xl" style={{ fontFamily:'Fraunces, Georgia, serif' }}>
          {language.name} · {level.label.toLowerCase()} — choisissez votre mode
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {modes.map(m => {
            const Icon = m.icon;
            return (
              <button key={m.id} onClick={() => onSelect(m.id)}
                className="text-left wl-card hover:-translate-y-0.5 transition-all p-5 flex flex-col gap-3 items-start">
                <div className="w-14 h-14 grid place-items-center text-stone-50" style={{ backgroundColor: language.accent }}>
                  <Icon size={26} />
                </div>
                <h3 style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-2xl font-medium leading-none">{m.label}</h3>
                <p style={{ fontFamily:'Fraunces, Georgia, serif' }} className="text-sm text-[color:var(--ink)] leading-relaxed">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

// ─── AUTH HOOK ────────────────────────────────────────────────────────────────

function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false); // password reset flow in progress

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    // Detect recovery link on initial load (hash contains type=recovery)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      if (hash.includes('type=recovery') || hash.includes('password-reset')) {
        setRecovering(true);
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id);
      else setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((ev, sess) => {
      if (ev === 'PASSWORD_RECOVERY') {
        setRecovering(true);
      }
      setSession(sess);
      if (sess) loadProfile(sess.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      setProfile(data);
    } catch (e) {}
    setLoading(false);
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null); setProfile(null);
  };

  const reloadProfile = async () => {
    if (session?.user?.id) await loadProfile(session.user.id);
  };

  const clearRecovery = () => {
    setRecovering(false);
    // Clean the URL hash so it does not re-trigger on refresh
    if (typeof window !== 'undefined' && window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return { session, profile, loading, signOut, reloadProfile, recovering, clearRecovery };
}

// ─── AUTH SCREENS ─────────────────────────────────────────────────────────────

function MascotHoot({ size = 180 }) {
  return (
    <svg viewBox="0 0 180 180" width={size} height={size}
         style={{ filter: 'drop-shadow(0 6px 12px rgba(255, 107, 74, 0.25))' }}>
      <ellipse cx="90" cy="105" rx="55" ry="60" fill="#FF6B4A" stroke="#2C1B1D" strokeWidth="4"/>
      <ellipse cx="90" cy="115" rx="35" ry="42" fill="#FFF3E0"/>
      <path d="M75 160 L72 170 M80 160 L80 172 M85 160 L88 170" stroke="#2C1B1D" strokeWidth="3" strokeLinecap="round"/>
      <path d="M95 160 L92 170 M100 160 L100 172 M105 160 L108 170" stroke="#2C1B1D" strokeWidth="3" strokeLinecap="round"/>
      <path d="M40 100 Q30 130 50 145" stroke="#2C1B1D" strokeWidth="4" fill="#E4522F"/>
      <path d="M140 100 Q150 130 130 145" stroke="#2C1B1D" strokeWidth="4" fill="#E4522F"/>
      <circle cx="70" cy="80" r="20" fill="white" stroke="#2C1B1D" strokeWidth="4"/>
      <circle cx="110" cy="80" r="20" fill="white" stroke="#2C1B1D" strokeWidth="4"/>
      <circle cx="72" cy="82" r="10" fill="#2C1B1D"/>
      <circle cx="112" cy="82" r="10" fill="#2C1B1D"/>
      <circle cx="75" cy="79" r="3" fill="white"/>
      <circle cx="115" cy="79" r="3" fill="white"/>
      <path d="M85 95 L90 108 L95 95 Z" fill="#FFC94D" stroke="#2C1B1D" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M60 55 L55 40 L65 50 Z" fill="#E4522F" stroke="#2C1B1D" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M120 55 L125 40 L115 50 Z" fill="#E4522F" stroke="#2C1B1D" strokeWidth="3" strokeLinejoin="round"/>
      <circle cx="55" cy="105" r="8" fill="#FF8FB1" opacity="0.6"/>
      <circle cx="125" cy="105" r="8" fill="#FF8FB1" opacity="0.6"/>
      <rect x="75" y="130" width="30" height="22" rx="2" fill="#A78BFA" stroke="#2C1B1D" strokeWidth="3"/>
      <line x1="90" y1="132" x2="90" y2="150" stroke="#2C1B1D" strokeWidth="2"/>
    </svg>
  );
}

function WelcomeScreen({ onLogin, onSignup }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Hero image with sunset gradient + city silhouette */}
      <div className="relative overflow-hidden" style={{ height: '52vh', minHeight: '380px' }}>
        <div className="absolute inset-0 wl-hero-sunset"></div>
        <svg className="absolute bottom-0 left-0 right-0" style={{ height: '130px', opacity: 0.7 }} viewBox="0 0 400 130" preserveAspectRatio="xMidYEnd meet">
          <g fill="#2A1520" opacity="0.7">
            <rect x="0" y="90" width="30" height="40"/>
            <rect x="35" y="70" width="25" height="60"/>
            <path d="M180 20 L195 130 L165 130 Z"/>
            <rect x="70" y="80" width="35" height="50"/>
            <rect x="110" y="60" width="20" height="70"/>
            <rect x="135" y="85" width="25" height="45"/>
            <rect x="205" y="75" width="30" height="55"/>
            <rect x="240" y="65" width="25" height="65"/>
            <rect x="270" y="80" width="35" height="50"/>
            <rect x="310" y="55" width="20" height="75"/>
            <path d="M340 40 L350 60 L340 60 L340 130 L360 130 L360 60 L370 60 L360 40 Z"/>
            <rect x="380" y="75" width="20" height="55"/>
          </g>
        </svg>
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white z-10">
          {/* Brand + live badge */}
          <div className="flex items-center justify-between">
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '24px', color: 'white' }}>
              MonProf
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--ink)', backdropFilter: 'blur(10px)' }}>
              <span className="wl-dot-live"></span>1 200 en ligne
            </span>
          </div>
          {/* Big headline */}
          <div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 500, fontSize: 'clamp(32px, 8vw, 46px)', lineHeight: 1.05, letterSpacing: '-0.03em', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              Le monde en <em style={{ color: '#FFDBB5' }}>conversations.</em>
            </h1>
            <p className="mt-2 text-[15px] font-medium max-w-xs" style={{ opacity: 0.95, textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>
              Rencontrez 33 professeurs à travers 10 pays.
            </p>
          </div>
        </div>
      </div>

      {/* Content below hero */}
      <div className="flex-1 px-6 sm:px-8 pt-8 pb-8 max-w-md mx-auto w-full">
        <p className="text-center text-[15px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          Une nouvelle façon d'apprendre les langues :<br/>
          en conversant, comme en voyage.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button onClick={onSignup} className="wl-btn-primary w-full">
            Commencer l'aventure
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button onClick={onLogin} className="wl-btn-secondary w-full">
            J'ai déjà un compte
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          <span className="wl-chip">🇬🇧 Anglais</span>
          <span className="wl-chip">🇪🇸 Español</span>
          <span className="wl-chip">🇯🇵 日本語</span>
          <span className="wl-chip">+7 autres</span>
        </div>
      </div>
    </div>
  );
}

function AuthField({ icon: Icon, type, placeholder, value, onChange, autoComplete, disabled }) {
  return (
    <div className="flex items-center gap-3 wl-card px-4 py-3 rounded-2xl">
      {Icon && <Icon size={16} style={{ color: 'var(--gris)' }} />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
        className="flex-1 bg-transparent focus:outline-none text-base disabled:opacity-60"
        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: 'var(--ink)' }}
      />
    </div>
  );
}

function SelectField({ icon: Icon, value, onChange, options, placeholder }) {
  return (
    <div className="flex items-center gap-3 wl-card px-4 py-3 rounded-2xl">
      {Icon && <Icon size={16} style={{ color: 'var(--gris)' }} />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent focus:outline-none text-base"
        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: value ? 'var(--ink)' : 'var(--gris)' }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function PhoneField({ dialCode, onDialChange, number, onNumberChange }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 wl-card px-3 py-3 rounded-2xl min-w-[120px]">
        <Globe2 size={16} style={{ color: 'var(--gris)' }} />
        <select
          value={dialCode}
          onChange={(e) => onDialChange(e.target.value)}
          className="flex-1 bg-transparent focus:outline-none text-base"
          style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: 'var(--ink)' }}
        >
          {COUNTRIES.map((c, i) => (
            <option key={`${c.code}-${i}`} value={c.dial}>
              {c.flag} {c.dial} {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3 wl-card px-4 py-3 rounded-2xl flex-1">
        <Phone size={16} style={{ color: 'var(--gris)' }} />
        <input
          type="tel"
          placeholder="numéro"
          value={number}
          onChange={(e) => onNumberChange(e.target.value.replace(/[^\d\s]/g, ''))}
          className="flex-1 bg-transparent focus:outline-none text-base"
          style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: 'var(--ink)' }}
        />
      </div>
    </div>
  );
}

function LoginForm({ onBack, onSuccess, onGoSignup, onGoForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Service non configuré.'); return; }
    setLoading(true); setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      if (err.message?.includes('Email not confirmed')) {
        setError('Confirmez d\'abord votre email (regardez votre boîte de réception).');
      } else if (err.message?.includes('Invalid')) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError(err.message);
      }
    } else if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
      <div className="" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'var(--soleil)' }}></div>
      <div className="max-w-md w-full relative z-10">
        <button onClick={onBack} className="flex items-center gap-1 mb-6 hover:opacity-70 text-sm font-bold"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-2" style={{ width: 72, height: 72, background: "linear-gradient(135deg, #FF385C, #E31C5F)", boxShadow: "0 6px 18px rgba(255,56,92,0.3)" }}><span style={{ fontSize: 34 }}>🌍</span></div>
          <h1 className="text-3xl sm:text-4xl leading-none mt-4"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            Content de te <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>revoir !</span>
          </h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <AuthField icon={Mail} type="email" placeholder="votre email"
            value={email} onChange={setEmail} autoComplete="email" />
          <AuthField icon={Lock} type="password" placeholder="mot de passe"
            value={password} onChange={setPassword} autoComplete="current-password" />

          {error && (
            <div className="wl-card px-4 py-3 text-sm font-semibold"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading || !email || !password}
            className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'connexion…' : 'Se connecter →'}
          </button>
        </form>

        <div className="mt-3 text-center text-sm" style={{ fontFamily: 'DM Sans' }}>
          <button onClick={() => onGoForgot?.(email)}
            className="font-bold hover:opacity-70"
            style={{ color: 'var(--corail)' }}>
            Mot de passe oublié&nbsp;?
          </button>
        </div>

        <div className="mt-4 text-center text-sm" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          Pas encore de compte ?{' '}
          <button onClick={onGoSignup}
            className="font-bold hover:opacity-70"
            style={{ color: 'var(--corail)' }}>
            Créer un compte →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FORGOT PASSWORD (envoi du lien de réinitialisation) ─────────────────────

function ForgotPasswordForm({ onBack, onGoLogin, prefilledEmail }) {
  const [email, setEmail] = useState(prefilledEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Service non configuré.'); return; }
    if (!email) { setError('Merci de saisir votre email.'); return; }
    setLoading(true); setError(null);
    // The link brings the user back to /?type=recovery — AuthGate detects it.
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${window.location.pathname}#password-reset`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-10">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4 inline-block">📬</div>
          <h1 className="text-3xl leading-none mt-2"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            Vérifiez vos <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>emails</span>
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed"
             style={{ fontFamily: 'DM Sans', fontWeight: 500, color: 'var(--gris)' }}>
            Un lien de réinitialisation a été envoyé à <strong style={{ color: 'var(--ink)' }}>{email}</strong>.<br/>
            Cliquez dessus pour définir un nouveau mot de passe.
          </p>
          <p className="mt-3 text-[13px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Pensez à regarder dans les spams. Le lien expire dans 1 heure.
          </p>
          <button onClick={onGoLogin} className="wl-btn-primary mt-8">
            Retour à la connexion →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="max-w-md w-full">
        <button onClick={onBack} className="flex items-center gap-1 mb-6 hover:opacity-70 text-sm font-bold"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-2"
               style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 6px 18px rgba(255,56,92,0.3)' }}>
            <span style={{ fontSize: 34 }}>🔑</span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none mt-4"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            Mot de passe <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>oublié&nbsp;?</span>
          </h1>
          <p className="mt-3 text-[15px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Saisissez votre email, nous vous envoyons un lien pour le redéfinir.
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <AuthField icon={Mail} type="email" placeholder="votre email"
            value={email} onChange={setEmail} autoComplete="email" />

          {error && (
            <div className="wl-card px-4 py-3 text-sm font-semibold"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading || !email}
            className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'envoi…' : 'Envoyer le lien 📩'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          Vous vous souvenez ?{' '}
          <button onClick={onGoLogin}
            className="font-bold hover:opacity-70"
            style={{ color: 'var(--corail)' }}>
            Se connecter →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RESET PASSWORD (arrivé via le lien email) ───────────────────────────────

function ResetPasswordScreen({ onDone }) {
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Service non configuré.'); return; }
    if (newPwd.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return; }
    if (newPwd !== confirmPwd) { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true); setError(null);
    const { error: err } = await supabase.auth.updateUser({ password: newPwd });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
    setTimeout(() => onDone?.(), 1800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-2"
               style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #FF385C, #E31C5F)', boxShadow: '0 6px 18px rgba(255,56,92,0.3)' }}>
            <span style={{ fontSize: 34 }}>🔒</span>
          </div>
          <h1 className="text-3xl sm:text-4xl leading-none mt-4"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            Nouveau <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>mot de passe</span>
          </h1>
          <p className="mt-3 text-[15px]" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
            Choisissez un nouveau mot de passe pour votre compte
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <AuthField icon={Lock} type="password" placeholder="nouveau mot de passe (6 caractères min.)"
            value={newPwd} onChange={setNewPwd} autoComplete="new-password" />
          <AuthField icon={Lock} type="password" placeholder="confirmer le mot de passe"
            value={confirmPwd} onChange={setConfirmPwd} autoComplete="new-password" />

          {error && (
            <div className="wl-card px-4 py-3 text-sm font-semibold"
                 style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading || success || !newPwd || !confirmPwd}
            className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {success ? (<><Check size={16} /> mot de passe mis à jour !</>) : (loading ? 'mise à jour…' : 'Enregistrer le mot de passe')}
          </button>
        </form>
      </div>
    </div>
  );
}

function SignupForm({ onBack, onSuccess, onGoLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nativeLang, setNativeLang] = useState('fr');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [dialCode, setDialCode] = useState('+33');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1); // 1: essentiel / 2: profil
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const nextStep = () => {
    if (!firstName || !lastName || !email || !password) {
      setError('Merci de remplir tous les champs.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Service non configuré.'); return; }
    if (password.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return; }
    setLoading(true); setError(null);

    const phoneFull = phoneNumber ? `${dialCode} ${phoneNumber}` : null;

    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (err) { setLoading(false); setError(err.message); return; }

    // Create profile row with all fields
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        native_language: nativeLang,
        birth_date: birthDate || null,
        address: address || null,
        phone_dial_code: dialCode,
        phone_number: phoneNumber || null,
        phone_full: phoneFull,
      });
    }
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
        <div className="" style={{ top: '-40px', left: '-40px', width: '200px', height: '200px', background: 'var(--menthe)' }}></div>
        <div className="max-w-md w-full text-center relative z-10">
          <div className="text-6xl mb-4  inline-block">🎉</div>
          <h1 className="text-3xl leading-none mt-2"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            Vérifie tes <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>emails !</span>
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed"
             style={{ fontFamily: 'DM Sans', fontWeight: 500, color: 'var(--gris)' }}>
            Un email a été envoyé à <strong style={{ color: 'var(--ink)' }}>{email}</strong>.<br/>
            Clique sur le lien pour activer ton compte, puis reviens ici 👇
          </p>
          <button onClick={onGoLogin} className="wl-btn-primary mt-8">
            Aller à la connexion →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
      <div className="" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'var(--menthe)' }}></div>
      <div className="max-w-md w-full relative z-10">
        <button onClick={onBack} className="flex items-center gap-1 mb-6 hover:opacity-70 text-sm font-bold"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full mb-2" style={{ width: 72, height: 72, background: "linear-gradient(135deg, #FF385C, #E31C5F)", boxShadow: "0 6px 18px rgba(255,56,92,0.3)" }}><span style={{ fontSize: 34 }}>🌍</span></div>
          <h1 className="text-3xl sm:text-4xl leading-none mt-4"
              style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800 }}>
            <span style={{ color: 'var(--corail)', fontStyle: 'italic' }}>Enchanté !</span>
          </h1>
          <p className="mt-3 text-[15px]"
             style={{ fontFamily: 'DM Sans', fontWeight: 500, color: 'var(--gris)' }}>
            {step === 1 ? "Quelques infos essentielles" : "Complétez votre profil"}  ✨
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-8 h-1.5 rounded-full transition-colors" style={{ background: step >= 1 ? 'var(--corail)' : 'rgba(90,78,69,0.2)' }}></div>
            <div className="w-8 h-1.5 rounded-full transition-colors" style={{ background: step >= 2 ? 'var(--corail)' : 'rgba(90,78,69,0.2)' }}></div>
          </div>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <AuthField icon={User} type="text" placeholder="prénom"
                value={firstName} onChange={setFirstName} autoComplete="given-name" />
              <AuthField icon={User} type="text" placeholder="nom"
                value={lastName} onChange={setLastName} autoComplete="family-name" />
            </div>
            <AuthField icon={Mail} type="email" placeholder="votre email"
              value={email} onChange={setEmail} autoComplete="email" />
            <AuthField icon={Lock} type="password" placeholder="mot de passe (6 caractères min.)"
              value={password} onChange={setPassword} autoComplete="new-password" />

            {error && (
              <div className="wl-card px-4 py-3 text-sm font-semibold"
                   style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="button" onClick={nextStep}
              disabled={!firstName || !lastName || !email || !password}
              className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
              Continuer →
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <SelectField icon={Globe2} value={nativeLang} onChange={setNativeLang}
              options={Object.values(LANGUAGES).map(l => ({ value: l.code, label: `${l.glyph} ${l.name}` }))} />

            <AuthField icon={Calendar} type="date" placeholder="date de naissance"
              value={birthDate} onChange={setBirthDate} autoComplete="bday" />

            <AuthField icon={MapPin} type="text" placeholder="adresse (ex: 12 rue Lafayette, 75009 Paris)"
              value={address} onChange={setAddress} autoComplete="street-address" />

            <PhoneField
              dialCode={dialCode}
              onDialChange={setDialCode}
              number={phoneNumber}
              onNumberChange={setPhoneNumber} />

            {error && (
              <div className="wl-card px-4 py-3 text-sm font-semibold"
                   style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => { setStep(1); setError(null); }}
                className="wl-chip px-5 py-3 flex items-center gap-2"
                style={{ fontFamily: 'DM Sans', fontWeight: 700, color: 'var(--ink)' }}>
                <ArrowLeft size={14} /> retour
              </button>
              <button type="submit" disabled={loading}
                className="wl-btn-primary flex-1 flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'inscription…' : 'Créer mon compte 🚀'}
              </button>
            </div>

            <p className="text-xs text-center mt-2" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              Ces informations sont modifiables plus tard depuis votre compte.
            </p>
          </form>
        )}

        <div className="mt-6 text-center text-sm" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          Déjà un compte ?{' '}
          <button onClick={onGoLogin}
            className="font-bold hover:opacity-70"
            style={{ color: 'var(--corail)' }}>
            Se connecter →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE / MON COMPTE ─────────────────────────────────────────────────────

function ProfileScreen({ profile, onBack, onProfileUpdated, onStartTest, onChangeDevice, device }) {
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [nativeLang, setNativeLang] = useState(profile?.native_language || 'fr');
  const [birthDate, setBirthDate] = useState(profile?.birth_date || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [dialCode, setDialCode] = useState(profile?.phone_dial_code || '+33');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || '');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState(null);
  const [pwdError, setPwdError] = useState(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [expandedTest, setExpandedTest] = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    loadLevelTests(profile.id).then(list => {
      setTests(list || []);
      setLoadingTests(false);
    });
  }, [profile?.id]);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!supabase || !profile?.id) return;
    setSaving(true); setError(null); setSavedFlash(false);

    const phoneFull = phoneNumber ? `${dialCode} ${phoneNumber}` : null;

    const { error: err } = await supabase.from('profiles').update({
      first_name: firstName,
      last_name: lastName,
      native_language: nativeLang,
      birth_date: birthDate || null,
      address: address || null,
      phone_dial_code: dialCode,
      phone_number: phoneNumber || null,
      phone_full: phoneFull,
    }).eq('id', profile.id);

    setSaving(false);
    if (err) { setError(err.message); return; }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
    if (onProfileUpdated) onProfileUpdated();
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setPwdError(null); setPwdSuccess(false);
    if (newPassword.length < 6) { setPwdError('Le mot de passe doit faire au moins 6 caractères.'); return; }
    if (newPassword !== confirmPassword) { setPwdError('Les mots de passe ne correspondent pas.'); return; }
    setChangingPassword(true);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (err) { setPwdError(err.message); return; }
    setPwdSuccess(true);
    setNewPassword(''); setConfirmPassword('');
    setTimeout(() => setPwdSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'transparent' }}>
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 mb-4 text-sm font-bold hover:opacity-70"
          style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
          <ArrowLeft size={14} /> retour
        </button>

        {/* Header avec avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="rounded-full flex items-center justify-center shrink-0"
               style={{ width: 72, height: 72, background: "linear-gradient(135deg, #FF385C, #E31C5F)", boxShadow: "0 6px 18px rgba(255,56,92,0.3)" }}>
            <span style={{ fontSize: 32, color: 'white', fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700 }}>
              {(firstName?.[0] || '?').toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gris)' }}>
              mon compte
            </div>
            <h1 className="text-3xl sm:text-4xl leading-tight truncate"
                style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 800, color: 'var(--ink)' }}>
              {firstName || 'Bienvenue'}
            </h1>
            <div className="text-[13px] mt-0.5 truncate" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
              {email}
            </div>
          </div>
        </div>

        {/* Section: infos personnelles */}
        <form onSubmit={saveProfile} className="wl-card p-5 sm:p-6" style={{ borderRadius: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <UserCircle size={18} style={{ color: 'var(--corail)' }} />
            <h2 className="text-lg font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
              Informations personnelles
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>prénom</label>
                <AuthField icon={User} type="text" placeholder="prénom" value={firstName} onChange={setFirstName} autoComplete="given-name" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>nom</label>
                <AuthField icon={User} type="text" placeholder="nom" value={lastName} onChange={setLastName} autoComplete="family-name" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>email (identifiant)</label>
              <AuthField icon={Mail} type="email" placeholder="email" value={email} onChange={setEmail} autoComplete="email" disabled />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>langue maternelle</label>
              <SelectField icon={Globe2} value={nativeLang} onChange={setNativeLang}
                options={Object.values(LANGUAGES).map(l => ({ value: l.code, label: `${l.glyph} ${l.name}` }))} />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>date de naissance</label>
              <AuthField icon={Calendar} type="date" placeholder="date de naissance" value={birthDate} onChange={setBirthDate} autoComplete="bday" />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>adresse</label>
              <AuthField icon={MapPin} type="text" placeholder="12 rue Lafayette, 75009 Paris" value={address} onChange={setAddress} autoComplete="street-address" />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>téléphone</label>
              <PhoneField dialCode={dialCode} onDialChange={setDialCode} number={phoneNumber} onNumberChange={setPhoneNumber} />
            </div>

            {error && (
              <div className="wl-card px-4 py-3 text-sm font-semibold"
                   style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={saving}
              className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {savedFlash ? (<><Check size={16} /> enregistré !</>) : (saving ? 'enregistrement…' : 'Enregistrer les modifications')}
            </button>
          </div>
        </form>

        {/* Section: appareil */}
        {onChangeDevice && (() => {
          const dev = DEVICES.find(d => d.id === device) || DEVICES.find(d => d.id === 'other') || DEVICES[0];
          const color = dev?.color || 'var(--corail)';
          return (
            <button onClick={onChangeDevice}
              className="w-full text-left wl-card p-5 sm:p-6 mt-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all group"
              style={{ borderRadius: '24px', border: `1.5px solid ${color}33` }}>
              <div className="rounded-full flex items-center justify-center shrink-0"
                   style={{ width: 56, height: 56, background: `radial-gradient(circle at 30% 30%, ${color}30, ${color}18)` }}>
                <span style={{ fontSize: 26 }}>{dev.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                    Mon appareil
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ fontFamily: 'DM Sans', color }}>
                    {dev.name}
                  </span>
                </div>
                <p className="text-[13px] mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                  Toucher pour changer l'appareil
                </p>
              </div>
              <span className="shrink-0 group-hover:translate-x-1 transition-transform" style={{ color, fontFamily: 'Fraunces, Georgia, serif', fontSize: 20 }}>→</span>
            </button>
          );
        })()}

        {/* Section: mot de passe */}
        <form onSubmit={changePassword} className="wl-card p-5 sm:p-6 mt-5" style={{ borderRadius: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} style={{ color: 'var(--corail)' }} />
            <h2 className="text-lg font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
              Changer mon mot de passe
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>nouveau mot de passe</label>
              <AuthField icon={Lock} type="password" placeholder="6 caractères minimum" value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider ml-1 mb-1 block" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>confirmer</label>
              <AuthField icon={Lock} type="password" placeholder="ressaisir" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
            </div>

            {pwdError && (
              <div className="wl-card px-4 py-3 text-sm font-semibold"
                   style={{ fontFamily: 'DM Sans', color: 'var(--corail-2)', background: 'var(--peche)' }}>
                ⚠️ {pwdError}
              </div>
            )}

            <button type="submit" disabled={changingPassword || !newPassword}
              className="wl-btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {changingPassword && <Loader2 size={16} className="animate-spin" />}
              {pwdSuccess ? (<><Check size={16} /> mot de passe mis à jour</>) : (changingPassword ? 'mise à jour…' : 'Changer mon mot de passe')}
            </button>
          </div>
        </form>

        {/* Section: mes tests de niveau */}
        <div className="wl-card p-5 sm:p-6 mt-5" style={{ borderRadius: '24px' }}>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 18 }}>🎯</span>
              <h2 className="text-lg font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                Mes tests de niveau
              </h2>
            </div>
            <button onClick={onStartTest}
              className="wl-btn-primary flex items-center gap-2"
              style={{ padding: '10px 16px', fontSize: 13 }}>
              <RefreshCw size={14} /> Refaire un test
            </button>
          </div>

          {loadingTests && (
            <div className="text-center py-6" style={{ color: 'var(--gris)' }}>
              <Loader2 size={18} className="animate-spin inline mr-2" />
              chargement…
            </div>
          )}

          {!loadingTests && tests.length === 0 && (
            <div className="text-center py-6 text-sm" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--gris)' }}>
              Aucun test enregistré pour le moment.<br/>
              Faites votre premier test pour connaître votre niveau ✨
            </div>
          )}

          {!loadingTests && tests.length > 0 && (
            <div className="space-y-2.5">
              {tests.map((t, i) => {
                const langObj = LANGUAGES[t.language_code];
                const langAccent = langObj?.accent || 'var(--corail)';
                const cefrColor = { A1:'#78716C', A2:'#A78BFA', B1:'#FF385C', B2:'#E88865', C1:'#FCD34D', C2:'#22C55E' }[t.cefr] || 'var(--corail)';
                const isOpen = expandedTest === (t.id || t._local_id || i);
                return (
                  <div key={t.id || t._local_id || i}
                       style={{
                         borderRadius: '18px',
                         background: 'white',
                         border: `1px solid ${langAccent}33`,
                         boxShadow: `0 2px 6px ${langAccent}12`,
                       }}>
                    <button
                      onClick={() => setExpandedTest(isOpen ? null : (t.id || t._local_id || i))}
                      className="w-full flex items-center gap-3 p-3 sm:p-4 text-left hover:bg-black/5 rounded-[18px] transition-colors">
                      {/* Pastille CEFR */}
                      <div className="shrink-0 rounded-full flex items-center justify-center text-white font-bold"
                           style={{
                             width: 46, height: 46,
                             background: `radial-gradient(circle at 30% 30%, ${cefrColor}, ${cefrColor}CC)`,
                             boxShadow: `0 2px 8px ${cefrColor}55`,
                             fontFamily: 'Fraunces, Georgia, serif',
                             fontSize: 16,
                           }}>
                        {t.cefr}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-base font-medium" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                            {langObj?.glyph} {t.language_name || langObj?.name || t.language_code}
                          </span>
                          {typeof t.score === 'number' && (
                            <span className="text-[11px] font-bold" style={{ fontFamily: 'DM Sans', color: cefrColor }}>
                              {t.score}/100
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ fontFamily: 'DM Sans', color: 'var(--gris)' }}>
                          {formatTestDate(t.taken_at)} · {t.exchanges || '?'} échanges
                        </div>
                      </div>
                      <span className="shrink-0 text-[color:var(--gris)]" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>→</span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 space-y-2 text-[13px]" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--ink)' }}>
                        {t.strengths_fr && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#22C55E', fontFamily: 'DM Sans' }}>✓ points forts</span>
                            <p className="mt-0.5">{t.strengths_fr}</p>
                          </div>
                        )}
                        {t.weaknesses_fr && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--corail-2)', fontFamily: 'DM Sans' }}>→ à travailler</span>
                            <p className="mt-0.5">{t.weaknesses_fr}</p>
                          </div>
                        )}
                        {t.advice_fr && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--corail)', fontFamily: 'DM Sans' }}>💡 conseil</span>
                            <p className="mt-0.5">{t.advice_fr}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTestDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return `Aujourd'hui à ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function AuthGate({ children }) {
  const { session, profile, loading, signOut, reloadProfile, recovering, clearRecovery } = useAuth();
  const [mode, setMode] = useState('welcome'); // welcome | login | signup | forgot
  const [forgotEmail, setForgotEmail] = useState('');

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="wl-card p-6 max-w-md text-center"
             style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-2">configuration manquante</div>
          <p className="italic">
            Les clés Supabase ne sont pas configurées.<br/>
            Ajoutez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> dans les variables d'environnement Vercel.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--corail-2)' }} />
      </div>
    );
  }

  // Priority: user arrived from the password-recovery email link.
  // Supabase auto-creates a session bound to the recovery token.
  if (recovering && session) {
    return <ResetPasswordScreen onDone={async () => {
      clearRecovery();
      // Sign out to force a fresh login with the new password
      await supabase.auth.signOut();
      setMode('login');
    }} />;
  }

  if (!session) {
    if (mode === 'forgot') return <ForgotPasswordForm
      prefilledEmail={forgotEmail}
      onBack={() => setMode('login')}
      onGoLogin={() => setMode('login')} />;
    if (mode === 'login')  return <LoginForm
      onBack={() => setMode('welcome')}
      onGoSignup={() => setMode('signup')}
      onGoForgot={(email) => { setForgotEmail(email); setMode('forgot'); }} />;
    if (mode === 'signup') return <SignupForm onBack={() => setMode('welcome')} onGoLogin={() => setMode('login')} />;
    return <WelcomeScreen onLogin={() => setMode('login')} onSignup={() => setMode('signup')} />;
  }

  // User authenticated — render the app with profile context
  return React.cloneElement(children, { profile, signOut, reloadProfile });
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function MainApp({ profile, signOut, reloadProfile }) {
  // First-launch device chooser: show it once if no explicit choice yet.
  const hasDeviceChoice = (() => { try { return !!storage.get(DEVICE_KEY); } catch { return false; } })();
  const [step, setStep] = useState(hasDeviceChoice ? 'language' : 'device');
  const [language, setLanguage] = useState(null);
  const [level, setLevel] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [deviceChoice, setDeviceChoice] = useState(getUserDevice());

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();

    const style = document.createElement('style');
    style.textContent = `
      @keyframes avatar-breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.03); }
      }
      @keyframes avatar-bounce {
        0%, 100% { transform: scale(1.05) translateY(0); }
        50% { transform: scale(1.07) translateY(-2px); }
      }
      @keyframes avatar-ping {
        0% { transform: scale(1); opacity: 0.4; }
        80%, 100% { transform: scale(1.5); opacity: 0; }
      }
      @keyframes cursor-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes avatar-wave {
        0%   { transform: rotate(0deg); opacity: 0; }
        15%  { opacity: 1; }
        25%  { transform: rotate(-20deg); }
        50%  { transform: rotate(20deg); }
        75%  { transform: rotate(-15deg); }
        90%  { transform: rotate(0deg); opacity: 1; }
        100% { transform: rotate(0deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      try { document.head.removeChild(link); document.head.removeChild(style); } catch (e) {}
    };
  }, []);

  if (step === 'device')   return <DeviceChooserScreen
    forceShow={!hasDeviceChoice}
    currentDevice={deviceChoice}
    onSaved={(d) => { setDeviceChoice(d); setStep(hasDeviceChoice ? 'profile' : 'language'); }}
    onSkip={hasDeviceChoice ? () => setStep('profile') : null} />;
  if (step === 'profile')  return <ProfileScreen profile={profile}
    onBack={() => setStep('language')}
    onProfileUpdated={reloadProfile}
    onStartTest={() => setStep('picklangfortest')}
    onChangeDevice={() => setStep('device')}
    device={deviceChoice} />;
  if (step === 'picklangfortest') return <LanguagePickForTest
    onBack={() => setStep('profile')}
    onSelect={(l) => { setLanguage(l); setStep('leveltest'); }} />;
  if (step === 'language') return <LanguagePicker
    profile={profile} signOut={signOut}
    onSelect={(l) => { setLanguage(l); setStep('level'); }}
    onOpenProfile={() => setStep('profile')}
    onResumeLast={(s) => { setLanguage(s.lang); setLevel(s.level); setAvatar(s.avatar); setStep('chat'); }}
  />;
  if (step === 'level')    return <LevelPicker language={language}
    onSelect={(lv) => { setLevel(lv); setStep('mode'); }}
    onStartTest={() => setStep('leveltest')}
    onBack={() => setStep('language')} />;
  if (step === 'leveltest') return <LevelTestScreen language={language}
    onLevelDetermined={(lv) => { setLevel(lv); setStep('mode'); }}
    onBack={() => setStep('level')} />;
  if (step === 'mode')     return <ModePicker language={language} level={level}
    onSelect={(m) => setStep(m === 'chat' ? 'avatar' : 'reader')}
    onBack={() => setStep('level')} />;
  if (step === 'avatar')   return <AvatarPicker language={language} level={level} onSelect={(a) => { setAvatar(a); setStep('chat'); }} onBack={() => setStep('mode')} />;
  if (step === 'reader')   return <ReaderScreen lang={language} level={level} onBack={() => setStep('mode')} />;
  return <ChatScreen lang={language} level={level} avatar={avatar} onChangeAvatar={() => setStep('avatar')} />;
}

export default function App() {
  return <AuthGate><MainApp /></AuthGate>;
}
