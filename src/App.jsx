import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Send, ArrowLeft, Loader2, BookOpen, RefreshCw, Mic, MicOff } from 'lucide-react';

// ─── LANGUAGES & AVATARS ──────────────────────────────────────────────────────

const LANGUAGES = {
  en: {
    code: 'en', name: 'Anglais', nativeName: 'English', glyph: 'EN',
    ttsLocale: 'en-US', srLocale: 'en-US', srSupported: true,
    accent: '#B85B3F',
    avatars: [
      { id:'emma', name:'Emma', age:28, location:'Manchester, UK', role:'Amie de café',
        tagline:'Détendue, vie quotidienne, séries, week-end',
        persona:'casual, warm British English, uses colloquial expressions',
        color:'#B85B3F', soft:'#F6E2D4', pattern:'circles',
        voiceHint:['samantha','kate','serena','female','martha','amelie'],
        greetings:[{t:"Hey! How's it going today?", fr:"Salut ! Comment ça va aujourd'hui ?"},
                   {t:"Hi there! What've you been up to?", fr:"Coucou ! Qu'est-ce que tu as fait de beau ?"}]},
      { id:'marcus', name:'Marcus', age:35, location:'San Francisco, USA', role:'Ingénieur logiciel',
        tagline:'Tech, boulot, projets, idées',
        persona:'direct, professional American English, brings up technical topics naturally',
        color:'#2D5F8A', soft:'#D5E2EF', pattern:'grid',
        voiceHint:['daniel','alex','fred','tom','aaron','male'],
        greetings:[{t:"Hey, nice to meet you. What kind of work do you do?", fr:"Hé, ravi de te rencontrer. Tu fais quoi comme boulot ?"},
                   {t:"Hi! Working on anything fun lately?", fr:"Salut ! Tu bosses sur des trucs sympas ?"}]},
      { id:'hannah', name:'Hannah', age:32, location:'Dublin, Ireland', role:"Professeure d'anglais",
        tagline:'Patiente, claire, parle doucement',
        persona:'gentle, clear, slightly slower English, very reassuring',
        color:'#3F6B4E', soft:'#DCE8DF', pattern:'lines',
        voiceHint:['fiona','moira','karen','tessa','female'],
        greetings:[{t:"Hello! Take your time. What would you like to chat about?", fr:"Bonjour ! Prends ton temps. De quoi veux-tu parler ?"},
                   {t:"Hi! Tell me a bit about yourself.", fr:"Salut ! Parle-moi un peu de toi."}]},
      { id:'oliver', name:'Oliver', age:47, location:'Oxford, UK', role:'Universitaire',
        tagline:'Cultivé, humour pince-sans-rire, sujets de fond',
        persona:'formal, witty, intellectual British English, dry humor',
        color:'#7A4A2F', soft:'#EBD7C5', pattern:'dots',
        voiceHint:['daniel','oliver','arthur','gordon','male'],
        greetings:[{t:"Good day. What's been on your mind recently?", fr:"Bonjour. Qu'est-ce qui vous occupe l'esprit ces temps-ci ?"},
                   {t:"Hello there. Care for an interesting conversation?", fr:"Bonjour. Envie d'une discussion intéressante ?"}]},
      { id:'priya', name:'Priya', age:31, location:'Bangalore, India', role:'Développeuse logicielle',
        tagline:'Anglais indien, tech, voyages, cuisine',
        persona:'Indian English (educated Bangalore accent), warm and articulate. Occasionally uses Hinglish expressions like "yaar", "actually", or sentence-final "no?" naturally. Brings up tech and travel topics.',
        color:'#A16207', soft:'#EFE0C7', pattern:'dots',
        voiceHint:['veena','rishi','raveena','lekha','heera','female'],
        greetings:[{t:"Hi! Nice to meet you. So tell me, what do you do?", fr:"Salut ! Ravi de te rencontrer. Dis-moi, tu fais quoi ?"},
                   {t:"Hello, how is your day going? Working on something interesting?", fr:"Bonjour, comment se passe ta journée ? Tu travailles sur quelque chose d'intéressant ?"}]},
      { id:'karim', name:'Karim', age:41, location:'Dubaï, EAU', role:'Ingénieur',
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
      { id:'lucia', name:'Lucía', age:27, location:'Madrid, España', role:'Amie de café',
        tagline:'Castillan moderne, sorties, ciné, food',
        persona:'casual Castilian Spanish from Madrid, friendly and energetic',
        color:'#C2410C', soft:'#FBE4D2', pattern:'circles',
        voiceHint:['monica','marisol','paulina','female'],
        greetings:[{t:"¡Hola! ¿Qué tal te va el día?", fr:"Salut ! Comment se passe ta journée ?"},
                   {t:"¿Qué tal? Cuéntame algo.", fr:"Ça va ? Raconte-moi quelque chose."}]},
      { id:'diego', name:'Diego', age:34, location:'Buenos Aires, Argentina', role:'Designer',
        tagline:'Espagnol argentin, créativité, voyages',
        persona:'Argentine Spanish (rioplatense), uses "vos" and "che", warm and chatty',
        color:'#6B4D9B', soft:'#E1D8EE', pattern:'lines',
        voiceHint:['jorge','diego','juan','carlos','male'],
        greetings:[{t:"¡Che, qué bueno conocerte! ¿De dónde sos?", fr:"Hé, content de te connaître ! D'où tu viens ?"},
                   {t:"Hola, ¿qué onda? ¿Cómo estás?", fr:"Salut, ça roule ? Comment ça va ?"}]},
      { id:'carmen', name:'Carmen', age:42, location:'Ciudad de México', role:"Professeure d'espagnol",
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
      { id:'lena', name:'Lena', age:26, location:'Berlin, Deutschland', role:'Amie créative',
        tagline:'Berlinois moderne, culture, sorties',
        persona:'casual Berliner German, hip and modern',
        color:'#5B6CB8', soft:'#DDE2F0', pattern:'lines',
        voiceHint:['anna','helena','steffi','female'],
        greetings:[{t:"Hi! Wie läuft's bei dir?", fr:"Salut ! Comment ça se passe pour toi ?"},
                   {t:"Hallo! Was machst du so?", fr:"Salut ! Tu fais quoi de beau ?"}]},
      { id:'klaus', name:'Klaus', age:48, location:'München, Deutschland', role:'Ingénieur',
        tagline:'Précis, technique, sujets de fond',
        persona:'precise, structured German, professional',
        color:'#374151', soft:'#D6DAE0', pattern:'grid',
        voiceHint:['markus','stefan','yannick','male'],
        greetings:[{t:"Guten Tag. Womit beschäftigen Sie sich beruflich?", fr:"Bonjour. Que faites-vous comme métier ?"},
                   {t:"Hallo. Worüber möchten Sie sprechen?", fr:"Bonjour. De quoi souhaitez-vous parler ?"}]},
      { id:'anja', name:'Anja', age:38, location:'Wien, Österreich', role:"Professeure d'allemand",
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
      { id:'giulia', name:'Giulia', age:30, location:'Roma, Italia', role:'Amie de café',
        tagline:'Romaine, expressive, food et dolce vita',
        persona:'expressive Roman Italian, warm and lively',
        color:'#B85B3F', soft:'#F6E2D4', pattern:'circles',
        voiceHint:['alice','silvia','federica','female'],
        greetings:[{t:"Ciao! Come va oggi?", fr:"Salut ! Comment ça va aujourd'hui ?"},
                   {t:"Ehi, ciao! Raccontami qualcosa di te.", fr:"Hé, salut ! Raconte-moi quelque chose sur toi."}]},
      { id:'marco', name:'Marco', age:42, location:'Milano, Italia', role:'Designer',
        tagline:'Italien du Nord, raffiné, design',
        persona:'refined Northern Italian (Milanese), elegant and professional',
        color:'#1E3A5F', soft:'#D0DAE5', pattern:'grid',
        voiceHint:['luca','paolo','marco','male'],
        greetings:[{t:"Buongiorno. Di cosa ti occupi?", fr:"Bonjour. De quoi t'occupes-tu ?"},
                   {t:"Ciao, piacere. Cosa ti porta qui?", fr:"Salut, enchanté. Qu'est-ce qui t'amène ?"}]},
      { id:'sofia', name:'Sofia', age:55, location:'Firenze, Italia', role:"Professeure d'italien",
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
      { id:'rafael', name:'Rafael', age:32, location:'Rio de Janeiro, Brasil', role:'Ami carioca',
        tagline:'Portugais brésilien, plage, musique, foot',
        persona:'casual Brazilian Portuguese (carioca), relaxed and warm',
        color:'#15803D', soft:'#D5E8D9', pattern:'circles',
        voiceHint:['felipe','luciana','male'],
        greetings:[{t:"E aí, beleza? Tudo bem com você?", fr:"Salut, ça va ? Tout va bien ?"},
                   {t:"Oi! O que você anda fazendo?", fr:"Salut ! Qu'est-ce que tu fais en ce moment ?"}]},
      { id:'beatriz', name:'Beatriz', age:34, location:'Lisboa, Portugal', role:'Amie lisboète',
        tagline:'Portugais européen, calme, culture',
        persona:'European Portuguese (Lisbon), elegant and clear pronunciation',
        color:'#2D5F8A', soft:'#D5E2EF', pattern:'lines',
        voiceHint:['joana','catarina','female'],
        greetings:[{t:"Olá, tudo bem? Como tem passado?", fr:"Bonjour, ça va ? Comment vous portez-vous ?"},
                   {t:"Boa tarde. De onde é?", fr:"Bonjour. D'où venez-vous ?"}]},
      { id:'joao', name:'João', age:45, location:'São Paulo, Brasil', role:"Professeur de portugais",
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
      { id:'yuki', name:'Yuki', age:26, location:'東京 (Tokyo)', role:'Amie tokyoïte',
        tagline:'Décontractée, pop culture, café',
        persona:'casual modern Tokyo Japanese, friendly and conversational',
        color:'#9D174D', soft:'#F0D5DE', pattern:'circles',
        voiceHint:['kyoko','haruka','female'],
        greetings:[{t:"こんにちは！元気ですか？", fr:"Bonjour ! Comment vas-tu ?"},
                   {t:"やあ、最近どうしてた？", fr:"Hé, qu'est-ce que tu deviens ?"}]},
      { id:'takeshi', name:'Takeshi', age:54, location:'京都 (Kyoto)', role:'Professeur',
        tagline:'Japonais soutenu, patient',
        persona:'polite, classical Kyoto Japanese, very patient with learners',
        color:'#3F2A1F', soft:'#E5DBD0', pattern:'dots',
        voiceHint:['otoya','hattori','male'],
        greetings:[{t:"こんにちは。お名前は何ですか？", fr:"Bonjour. Comment vous appelez-vous ?"},
                   {t:"はじめまして。何について話したいですか？", fr:"Enchanté. De quoi voulez-vous parler ?"}]},
      { id:'aiko', name:'Aiko', age:33, location:'大阪 (Osaka)', role:"Professeure de japonais",
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
      { id:'mei', name:'Mei', age:28, location:'上海 (Shanghai)', role:'Amie',
        tagline:'Mandarin moderne, vie urbaine',
        persona:'modern Mandarin from Shanghai, casual and friendly',
        color:'#B91C1C', soft:'#F4D5D5', pattern:'circles',
        voiceHint:['tingting','meijia','female'],
        greetings:[{t:"你好！今天怎么样？", fr:"Salut ! Comment ça va aujourd'hui ?"},
                   {t:"嗨，最近忙吗？", fr:"Coucou, occupé ces temps-ci ?"}]},
      { id:'wei', name:'Wei', age:45, location:'北京 (Beijing)', role:'Professeur de mandarin',
        tagline:'Mandarin standard, patient, clair',
        persona:'standard Beijing Mandarin, patient teacher with clear pronunciation',
        color:'#A16207', soft:'#EFE0C7', pattern:'dots',
        voiceHint:['tian-tian','male'],
        greetings:[{t:"你好。你叫什么名字？", fr:"Bonjour. Comment vous appelez-vous ?"},
                   {t:"欢迎！你想聊什么？", fr:"Bienvenue ! De quoi voulez-vous parler ?"}]},
      { id:'lin', name:'Lin', age:31, location:'台北 (Taipei)', role:'Designer',
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
      { id:'layla', name:'Layla', age:32, location:'Beyrouth, Liban', role:'Journaliste',
        tagline:'Arabe levantin, culture, actualité',
        persona:'Levantine Arabic (Lebanese), educated and culturally engaged',
        color:'#1E40AF', soft:'#D6DEF2', pattern:'circles',
        voiceHint:['laila','majed','female'],
        greetings:[{t:"مرحبا! كيف حالك اليوم؟", fr:"Bonjour ! Comment vas-tu aujourd'hui ?"},
                   {t:"أهلا. عن أي موضوع تحب أن نتكلم؟", fr:"Salut. De quel sujet aimerais-tu qu'on parle ?"}]},
      { id:'omar', name:'Omar', age:44, location:'القاهرة (Le Caire)', role:'Professeur',
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
      { id:'anais', name:'Anaïs', age:30, location:'Port-Louis, Maurice', role:'Amie',
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
      { id:'ravi', name:'Ravi', age:42, location:'Curepipe, Maurice', role:'Ingénieur',
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
      { id:'marie', name:'Marie', age:48, location:'Beau Bassin, Maurice', role:'Professeure',
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
const PLATFORM = detectPlatform();

const PLATFORM_HINTS = {
  android: { label: 'micro du clavier', detail: 'sur le clavier Gboard, touchez le 🎤 en haut à droite' },
  ios:     { label: 'dictée du clavier', detail: 'sur le clavier, touchez le 🎤 à côté de la barre espace' },
  mac:     { label: 'dictée macOS', detail: 'appuyez deux fois sur Fn pour dicter' },
  windows: { label: 'Win + H', detail: 'appuyez sur Win+H pour dicter' },
  other:   { label: 'dictée clavier', detail: 'utilisez le micro de votre système' },
};

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

const buildSystemPrompt = (lang, level, avatar) => `You are ${avatar.name}, a ${avatar.age}-year-old ${avatar.role.toLowerCase()} from ${avatar.location}.

You are having a casual conversation with a French speaker who is learning ${lang.nativeName} (${lang.name} in French). They are at ${level.prompt}

Persona: ${avatar.persona}

Your role:
- Always reply in ${lang.nativeName}. ${lang.code === 'mfe' ? 'IMPORTANT: respond strictly in Kreol Morisien using authentic Mauritian spelling and expressions. Do NOT respond in French.' : ''}
- Stay in character. Be natural and engaging.
- Keep replies short: 1–3 sentences. End with a question or remark that invites continuing.
- Match your vocabulary and complexity exactly to the user's level.
- If the user writes mainly in French, gently respond in ${lang.nativeName}, encourage them, and provide one short model sentence they could try.

Error correction (always in French, regardless of target language):
- Detect real errors in the user's ${lang.nativeName}: grammar, conjugation, gender, word order, vocabulary, prepositions, false friends.
- Do NOT flag minor stylistic preferences — only what a teacher would correct.
- Brief, friendly French explanations, including the rule.

CRITICAL OUTPUT FORMAT: Respond ONLY with one valid JSON object, no markdown, no code fences, no preamble. Schema:

{
  "reply": "<your in-character response in ${lang.nativeName}>",
  "fr_translation": "<a natural French translation of your reply>",
  "corrections": [
    { "original": "<user's incorrect phrase>", "corrected": "<correction in ${lang.nativeName}>", "explanation_fr": "<short explanation in French with the rule>" }
  ]
}

If no errors, return "corrections": []. Never wrap the JSON in backticks. Never add text outside the JSON.`;

// ─── HOOKS ────────────────────────────────────────────────────────────────────

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
    // Per-avatar rate/pitch override if defined (used e.g. for Mauritian Creole)
    u.rate = avatar?.rate ?? 0.9;
    u.pitch = avatar?.pitch ?? 1;
    u.onstart = () => setSpeakingText(text);
    u.onend = () => setSpeakingText(null);
    u.onerror = () => setSpeakingText(null);
    if (voices.length) {
      let chosen = null;
      // 1) Explicit preferred voice
      if (preferredVoiceURI) {
        chosen = voices.find(v => v.voiceURI === preferredVoiceURI);
      }
      // 2) Auto-pick: prefer natural/premium/enhanced voices matching the locale
      if (!chosen) {
        const base = (lang?.ttsLocale || 'en-US').split('-')[0];
        const langPool = voices.filter(v => v.lang.startsWith(base));
        const exactPool = langPool.filter(v => v.lang === (lang?.ttsLocale || 'en-US'));
        const pool = exactPool.length ? exactPool : langPool;
        // Prioritize higher-quality voices AND per-avatar hints
        const scored = pool.map(v => {
          let score = 0;
          const n = v.name.toLowerCase();
          if (/natural|premium|enhanced|neural|wavenet|studio/.test(n)) score += 100;
          if (/google/.test(n)) score += 60;
          if (/microsoft/.test(n) && /online|natural/.test(n)) score += 40;
          // Boost avatar-specific voice preferences a lot — they matter more than generic Google
          if (avatar && avatar.voiceHint.some(h => n.includes(h))) score += 80;
          if (v.localService === false) score += 5;
          return { v, score };
        });
        scored.sort((a, b) => b.score - a.score);
        chosen = scored[0]?.v || pool[0];
      }
      if (chosen) u.voice = chosen;
    }
    window.speechSynthesis.speak(u);
  };
  const stop = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingText(null);
  };
  return { speak, stop, speakingText, voices };
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

  useEffect(() => {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      if (Math.random() < 0.5) {
        setBlink(true);
        setTimeout(() => alive && setBlink(false), 130);
      }
    };
    const id = setInterval(tick, 2400);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return (
    <div className={`${sizes[size]} relative shrink-0`}>
      {speaking && (
        <span className="absolute inset-0 pointer-events-none" style={{
          backgroundColor: avatar.color,
          opacity: 0.4,
          animation: 'avatar-ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
        }} />
      )}
      <div
        className="relative w-full h-full grid place-items-center overflow-hidden"
        style={{
          backgroundColor: avatar.color,
          ...PATTERN_BG(avatar.pattern),
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
          {/* Eyes */}
          <Eye cx={34} style={face.eyes} blink={blink} />
          <Eye cx={66} style={face.eyes} blink={blink} />
          {/* Moustache (Oliver) */}
          {face.moustache && (
            <path d="M 38 60 Q 50 64 62 60 Q 58 63 50 63 Q 42 63 38 60 Z" fill="#1a1a1a" opacity={0.85} />
          )}
          {/* Accessory */}
          <Accessory kind={face.accessory} />
          {/* Mouth */}
          <Mouth style={face.mouth} speaking={speaking} color={mouthColor} />
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
         style={{ backgroundColor: lang.accent, fontFamily:'Fraunces, serif', fontWeight: 500 }}>
      <span>{lang.glyph}</span>
    </div>
  );
}

// ─── STEP HEADER ──────────────────────────────────────────────────────────────

function StepHeader({ step, total, label, onBack }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {onBack && (
        <button onClick={onBack} className="w-9 h-9 grid place-items-center border border-stone-900 hover:bg-stone-900 hover:text-stone-50 transition-colors">
          <ArrowLeft size={16} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500" style={{ fontFamily:'JetBrains Mono, monospace' }}>
          étape {step} / {total} · {label}
        </div>
        <div className="flex gap-1 mt-1.5">
          {Array.from({length: total}).map((_,i) => (
            <div key={i} className={`h-0.5 flex-1 ${i < step ? 'bg-stone-900' : 'bg-stone-300'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 1: LANGUAGE ─────────────────────────────────────────────────────────

function LanguagePicker({ onSelect, onResumeLast }) {
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
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'#F5F0E6' }}>
      <div className="max-w-3xl mx-auto">
        <StepHeader step={1} total={3} label="langue" />
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-none" style={{ fontFamily:'Fraunces, serif' }}>
          Quelle <em>langue</em> voulez-vous apprendre ?
        </h1>
        <p className="mt-3 text-stone-600 max-w-xl" style={{ fontFamily:'Spectral, serif' }}>
          9 langues disponibles. La voix et la prononciation s'adapteront automatiquement.
        </p>

        {lastSession && (
          <button onClick={() => onResumeLast(lastSession)}
            className="mt-6 w-full border-2 border-stone-900 bg-stone-50 hover:bg-white hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)] transition-all p-4 flex items-center gap-3 text-left">
            <AnimatedAvatar avatar={lastSession.avatar} size="md" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-stone-500" style={{ fontFamily:'JetBrains Mono, monospace' }}>
                📖 reprendre votre conversation
              </div>
              <div style={{ fontFamily:'Fraunces, serif' }} className="text-xl font-medium leading-tight mt-0.5">
                {lastSession.avatar.name} · <span className="italic font-normal">{lastSession.lang.name}</span>
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5 truncate" style={{ fontFamily:'JetBrains Mono, monospace' }}>
                niveau {lastSession.level.label.toLowerCase()} · {timeSince(lastSession.lastUpdated)}
              </div>
            </div>
            <span className="shrink-0 text-stone-900 text-xl" style={{ fontFamily:'Fraunces, serif' }}>→</span>
          </button>
        )}

        <div className="mt-6">
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-2" style={{ fontFamily:'JetBrains Mono, monospace' }}>
            {lastSession ? 'ou commencer une nouvelle' : 'choisissez'}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.values(LANGUAGES).map(lang => (
            <button key={lang.code} onClick={() => onSelect(lang)}
              className="text-left border-2 border-stone-900 bg-stone-50 hover:bg-white hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)] transition-all p-4 flex flex-col gap-2 min-h-[120px]">
              <LanguageBadge lang={lang} size="sm" />
              <div className="mt-auto">
                <div style={{ fontFamily:'Fraunces, serif' }} className="text-xl font-medium leading-tight">{lang.name}</div>
                <div className="text-xs text-stone-500 mt-0.5" style={{ fontFamily:'JetBrains Mono, monospace' }}>{lang.nativeName}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: LEVEL ────────────────────────────────────────────────────────────

function LevelPicker({ language, onSelect, onBack }) {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'#F5F0E6' }}>
      <div className="max-w-3xl mx-auto">
        <StepHeader step={2} total={3} label="niveau" onBack={onBack} />
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-none" style={{ fontFamily:'Fraunces, serif' }}>
            Votre <em>niveau</em> en
          </h1>
          <span className="text-2xl sm:text-4xl px-3 py-1 text-stone-50" style={{ fontFamily:'Fraunces, serif', backgroundColor: language.accent }}>
            {language.name}
          </span>
        </div>
        <p className="mt-3 text-stone-600 max-w-xl" style={{ fontFamily:'Spectral, serif' }}>
          Soyez honnête — c'est mieux de commencer un peu en dessous et de progresser.
        </p>
        <div className="mt-6 space-y-3">
          {Object.values(LEVELS).map(lv => (
            <button key={lv.id} onClick={() => onSelect(lv)}
              className="w-full text-left border-2 border-stone-900 bg-stone-50 hover:bg-white hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)] transition-all p-4 sm:p-5 flex items-center gap-4">
              <div className="w-14 h-14 grid place-items-center text-stone-50 shrink-0" style={{ backgroundColor: language.accent, fontFamily:'Fraunces, serif' }}>
                <span className="text-2xl">{lv.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span style={{ fontFamily:'Fraunces, serif' }} className="text-xl sm:text-2xl font-medium">{lv.label}</span>
                  <span className="text-[10px] uppercase tracking-widest text-stone-500" style={{ fontFamily:'JetBrains Mono, monospace' }}>{lv.sublabel}</span>
                </div>
                <p className="text-sm text-stone-600 mt-1" style={{ fontFamily:'Spectral, serif' }}>{lv.description}</p>
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
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10" style={{ backgroundColor:'#F5F0E6' }}>
      <div className="max-w-3xl mx-auto">
        <StepHeader step={3} total={3} label="interlocuteur" onBack={onBack} />
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight leading-none" style={{ fontFamily:'Fraunces, serif' }}>
          Avec <em>qui</em> ?
        </h1>
        <p className="mt-3 text-stone-600 max-w-xl" style={{ fontFamily:'Spectral, serif' }}>
          {language.name} · {level.label.toLowerCase()} · choisissez l'accent et la personnalité qui vous parlent
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {language.avatars.map(av => {
            const hasHist = withHistory.has(av.id);
            return (
              <button key={av.id} onClick={() => onSelect(av)}
                className="relative text-left border-2 border-stone-900 bg-stone-50 hover:bg-white hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)] transition-all p-4 flex gap-3 items-start">
                <AnimatedAvatar avatar={av} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 style={{ fontFamily:'Fraunces, serif' }} className="text-xl sm:text-2xl font-medium leading-none">{av.name}</h3>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500" style={{ fontFamily:'JetBrains Mono, monospace' }}>{av.age} ans</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 truncate" style={{ fontFamily:'JetBrains Mono, monospace' }}>{av.location} · {av.role}</div>
                  <p className="mt-2 text-sm text-stone-700 leading-snug" style={{ fontFamily:'Spectral, serif' }}>{av.tagline}</p>
                  {hasHist && (
                    <div className="inline-flex items-center gap-1 mt-2 px-1.5 py-0.5 text-stone-50 text-[9px] uppercase tracking-widest" style={{ fontFamily:'JetBrains Mono, monospace', backgroundColor: av.color }}>
                      <span>📖</span><span>reprendre</span>
                    </div>
                  )}
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

function CorrectionsPanel({ corrections }) {
  if (!corrections || !corrections.length) return null;
  return (
    <div className="mt-2 border-l-4 border-amber-700 bg-amber-50/70 pl-3 pr-3 py-2.5 space-y-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-900" style={{ fontFamily:'JetBrains Mono, monospace' }}>
        <BookOpen size={11} /> correction{corrections.length > 1 ? 's' : ''}
      </div>
      {corrections.map((c, i) => (
        <div key={i} className="text-sm" style={{ fontFamily:'Spectral, serif' }}>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="line-through text-stone-500 italic">{c.original}</span>
            <span className="text-amber-800">→</span>
            <span className="font-medium text-stone-900 italic">{c.corrected}</span>
          </div>
          <div className="mt-1 text-stone-700 text-[13px] leading-snug">{c.explanation_fr}</div>
        </div>
      ))}
    </div>
  );
}

// ─── BUBBLES ──────────────────────────────────────────────────────────────────

function UserMessage({ message, rtl }) {
  return (
    <div className="flex flex-col items-end mb-4">
      <div className="max-w-[85%]">
        <div className="border-2 border-stone-900 px-4 py-2.5 bg-stone-50" style={{ fontFamily:'Spectral, serif' }}>
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1" style={{ fontFamily:'JetBrains Mono, monospace' }}>vous</div>
          <div className="text-stone-900 leading-relaxed" style={{ direction: rtl ? 'rtl' : 'ltr' }}>{message.content}</div>
        </div>
        <div className="mt-1"><CorrectionsPanel corrections={message.corrections} /></div>
      </div>
    </div>
  );
}

function AssistantMessage({ message, avatar, lang, onSpeak, speaking }) {
  const [showFr, setShowFr] = useState(false);
  return (
    <div className="flex gap-3 mb-4 items-start">
      <AnimatedAvatar avatar={avatar} size="sm" speaking={speaking} />
      <div className="max-w-[85%] flex-1">
        <div className="px-4 py-3 relative" style={{ backgroundColor: avatar.soft, borderLeft: `3px solid ${avatar.color}`, fontFamily:'Spectral, serif' }}>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily:'JetBrains Mono, monospace', color: avatar.color }}>{avatar.name}</span>
            <div className="flex items-center gap-2">
              <button onClick={onSpeak} className="text-stone-600 hover:text-stone-900" aria-label="écouter"><Volume2 size={14} /></button>
              <button onClick={() => setShowFr(s => !s)} className="text-[10px] uppercase tracking-widest text-stone-600 hover:text-stone-900 px-1.5 border border-stone-400" style={{ fontFamily:'JetBrains Mono, monospace' }}>fr</button>
            </div>
          </div>
          <div className="text-stone-900 leading-relaxed" style={{ direction: lang.rtl ? 'rtl' : 'ltr' }}>{message.reply}</div>
          {showFr && message.translation && (
            <div className="mt-2 pt-2 border-t border-stone-400/40 text-sm text-stone-700 italic">{message.translation}</div>
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
    <div className="border-t-2 border-stone-900 bg-stone-50 px-3 sm:px-5 py-2.5 sticky bottom-0">
      <div className="max-w-3xl mx-auto">
        {micError === 'denied' && (
          <div className="mb-2 text-[10px] uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-700/30 px-2 py-1.5 text-center" style={{ fontFamily:'JetBrains Mono, monospace' }}>
            ⚠ micro refusé · autorisez-le dans les paramètres du site
          </div>
        )}
        {micError === 'other' && (
          <div className="mb-2 text-[10px] uppercase tracking-widest text-stone-600 bg-stone-100 border border-stone-300 px-2 py-1.5 text-center" style={{ fontFamily:'JetBrains Mono, monospace' }}>
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
            <span className="text-[11px] uppercase tracking-widest flex-1" style={{ fontFamily:'JetBrains Mono, monospace', color: avatar.color }}>
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
                  : 'bg-stone-900 text-stone-50 hover:bg-stone-700 disabled:opacity-30'
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
              className="w-full resize-none border-2 border-stone-900 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/40 disabled:opacity-50 text-base"
              style={{ fontFamily:'Spectral, serif', maxHeight:120, direction: lang.rtl ? 'rtl' : 'ltr' }} />
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
    <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
         onClick={onClose}>
      <div className="w-full sm:max-w-lg bg-stone-50 border-2 border-stone-900 max-h-[85vh] flex flex-col"
           onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b-2 border-stone-900 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-stone-500" style={{ fontFamily:'JetBrains Mono, monospace' }}>
              voix pour · {avatar.name}
            </div>
            <div style={{ fontFamily:'Fraunces, serif' }} className="text-lg font-medium leading-none mt-0.5">
              Choisir la voix
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center border border-stone-900 hover:bg-stone-900 hover:text-stone-50">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center">
              <div style={{ fontFamily:'Spectral, serif' }} className="text-stone-700">
                Aucune voix installée pour <em>{lang.name.toLowerCase()}</em> sur cet appareil.
              </div>
              <div className="mt-3 text-xs text-stone-500" style={{ fontFamily:'JetBrains Mono, monospace' }}>
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
                  <div style={{ fontFamily:'Fraunces, serif' }} className="font-medium">Auto (recommandé)</div>
                  <div className="text-xs text-stone-500 mt-0.5" style={{ fontFamily:'JetBrains Mono, monospace' }}>
                    l'appli choisit la meilleure voix disponible
                  </div>
                </div>
                {!currentURI && <span className="text-amber-700">✓</span>}
              </button>
              {filtered.map((v) => {
                const isNatural = /natural|premium|enhanced|neural|wavenet/i.test(v.name);
                const isGoogle = /google/i.test(v.name);
                const isSelected = currentURI === v.voiceURI;
                return (
                  <div key={v.voiceURI} className={`px-4 py-3 border-b border-stone-200 flex items-center gap-2 ${isSelected ? 'bg-amber-50' : 'hover:bg-white'}`}>
                    <button onClick={() => onPreview(v.voiceURI)}
                      className="w-9 h-9 grid place-items-center bg-stone-900 text-stone-50 hover:bg-stone-700 shrink-0"
                      title="écouter un extrait">
                      <Volume2 size={14} />
                    </button>
                    <button onClick={() => onChoose(v.voiceURI)} className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontFamily:'Fraunces, serif' }} className="font-medium truncate">
                          {v.name}
                        </span>
                        {isNatural && (
                          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-emerald-700 text-stone-50" style={{ fontFamily:'JetBrains Mono, monospace' }}>
                            naturelle
                          </span>
                        )}
                        {isGoogle && !isNatural && (
                          <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-stone-700 text-stone-50" style={{ fontFamily:'JetBrains Mono, monospace' }}>
                            google
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5" style={{ fontFamily:'JetBrains Mono, monospace' }}>
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

        <div className="px-4 py-2 border-t border-stone-300 text-[10px] uppercase tracking-widest text-stone-500" style={{ fontFamily:'JetBrains Mono, monospace' }}>
          {filtered.length} voix trouvée{filtered.length > 1 ? 's' : ''} · touchez 🔊 pour écouter
        </div>
      </div>
    </div>
  );
}

// ─── CHAT SCREEN ──────────────────────────────────────────────────────────────

function ChatScreen({ lang, level, avatar, onChangeAvatar }) {
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
  const { speak, stop, speakingText, voices } = useSpeech();
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: buildSystemPrompt(lang, level, avatar),
          messages: apiMessages,
        }),
      });
      const data = await response.json();
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
      if (autoSpeak && parsed.reply) speakFor(parsed.reply);
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor:'#F5F0E6' }}>
      <div className="border-b-2 border-stone-900 bg-stone-50 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-3 flex items-center gap-3">
          <button onClick={onChangeAvatar} className="w-9 h-9 grid place-items-center border border-stone-900 hover:bg-stone-900 hover:text-stone-50 transition-colors" title="changer">
            <ArrowLeft size={16} />
          </button>
          <AnimatedAvatar avatar={avatar} size="sm" speaking={!!speakingText} />
          <div className="flex-1 min-w-0">
            <div style={{ fontFamily:'Fraunces, serif' }} className="text-lg font-medium leading-none">{avatar.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-0.5 truncate" style={{ fontFamily:'JetBrains Mono, monospace' }}>
              {lang.name} · {level.label.toLowerCase()} · {avatar.location}
            </div>
          </div>
          <button onClick={() => setShowVoicePicker(true)} className="w-9 h-9 grid place-items-center border border-stone-900 hover:bg-stone-100 relative" title="choisir la voix">
            <span className="text-[10px] font-bold" style={{ fontFamily:'JetBrains Mono, monospace' }}>A♪</span>
            {voiceURI && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-700 rounded-full" />}
          </button>
          <button onClick={() => setAutoListen(s => !s)} className={`w-9 h-9 grid place-items-center border ${autoListen ? 'bg-stone-900 text-stone-50 border-stone-900' : 'border-stone-900 hover:bg-stone-100'}`} title={autoListen ? "conversation mains-libres activée" : "conversation mains-libres désactivée"}>
            <Mic size={14} />
          </button>
          <button onClick={() => setAutoSpeak(s => !s)} className={`w-9 h-9 grid place-items-center border ${autoSpeak ? 'bg-stone-900 text-stone-50 border-stone-900' : 'border-stone-900 hover:bg-stone-100'}`} title="lecture auto">
            <Volume2 size={14} />
          </button>
          <button onClick={restartChat} className="w-9 h-9 grid place-items-center border border-stone-900 hover:bg-stone-100" title="nouvelle conversation">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-5">
          {resumedFrom && (
            <div className="border-l-4 border-stone-400 pl-3 py-2 mb-4 bg-stone-100/70 flex items-center gap-2 text-[11px] uppercase tracking-widest text-stone-600" style={{ fontFamily:'JetBrains Mono, monospace' }}>
              <span>📖</span>
              <span>reprise · dernière visite {timeSince(resumedFrom)}</span>
            </div>
          )}
          {messages.map((m, i) => m.role === 'user'
            ? <UserMessage key={i} message={m} rtl={lang.rtl} />
            : <AssistantMessage key={i} message={m} avatar={avatar} lang={lang}
                onSpeak={() => speakFor(m.reply)}
                speaking={speakingText === m.reply} />
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
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState('language');
  const [language, setLanguage] = useState(null);
  const [level, setLevel] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Spectral:ital,wght@0,300;0,400;0,500;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&display=swap';
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
    `;
    document.head.appendChild(style);
    return () => {
      try { document.head.removeChild(link); document.head.removeChild(style); } catch (e) {}
    };
  }, []);

  if (step === 'language') return <LanguagePicker
    onSelect={(l) => { setLanguage(l); setStep('level'); }}
    onResumeLast={(s) => { setLanguage(s.lang); setLevel(s.level); setAvatar(s.avatar); setStep('chat'); }}
  />;
  if (step === 'level')    return <LevelPicker language={language} onSelect={(lv) => { setLevel(lv); setStep('avatar'); }} onBack={() => setStep('language')} />;
  if (step === 'avatar')   return <AvatarPicker language={language} level={level} onSelect={(a) => { setAvatar(a); setStep('chat'); }} onBack={() => setStep('level')} />;
  return <ChatScreen lang={language} level={level} avatar={avatar} onChangeAvatar={() => setStep('avatar')} />;
}
