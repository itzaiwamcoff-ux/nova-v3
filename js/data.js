/* ════════════════════════════════════════════════════════════════════
   NOVA — Data Layer (localStorage-backed)
   ════════════════════════════════════════════════════════════════════ */

const NovaData = (() => {
  const STORAGE_KEY = 'nova_data';

  const DEFAULT_ARTICLES = [
    {
      id: 'a1',
      title: 'Quantum Computing Breakthrough Ushers in New Era of Processing Power',
      excerpt: 'Scientists achieve stable qubit entanglement at room temperature, promising a revolution in computational capabilities across industries.',
      content: 'In a landmark development that has the scientific community buzzing, researchers at the Quantum Frontiers Laboratory have achieved sustained qubit entanglement at room temperature — a feat previously thought to be decades away. The breakthrough, published in the journal Nature Physics, demonstrates a novel approach using topological qubits protected by a custom-engineered crystal lattice.\n\nThe implications are staggering. Classical computers that would take thousands of years to solve certain problems could see those timelines collapse to minutes or even seconds. Financial modeling, drug discovery, climate simulation, and cryptography are just a few of the fields poised for transformation.\n\n"This is the equivalent of the transistor moment for quantum computing," said Dr. Elena Vasquez, lead researcher on the project. "We\'ve shown that stable quantum states are achievable without the cryogenic cooling that has been the single biggest barrier to practical quantum computers."\n\nIndustry giants have already announced plans to integrate the technology into next-generation systems, with projections suggesting consumer-facing quantum applications within five years.',
      category: 'science',
      author: 'Dr. Sarah Chen',
      date: '2026-06-17',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop'
    },
    {
      id: 'a2',
      title: 'Global Markets Surge as Trade Agreement Ushers in New Economic Era',
      excerpt: 'Historic multilateral trade pact between major economies creates unprecedented market optimism and cross-border investment opportunities.',
      content: 'Global stock markets rallied to record highs following the announcement of the Comprehensive Economic Partnership (CEP), a landmark trade agreement spanning the Pacific Rim and European economic zones. The pact, negotiated over three years, reduces tariffs by an average of 65% and establishes new frameworks for digital trade and intellectual property.\n\n"The CEP represents the most significant economic realignment since the end of the Cold War," said economist Dr. Marcus Webb. "We\'re seeing a level of market integration that will reshape supply chains, investment flows, and consumer prices for decades to come."\n\nTechnology and manufacturing sectors led the gains, with cross-border merger and acquisition activity expected to surge. Analysts project global GDP growth could accelerate by 1.5 to 2 percentage points annually over the next decade as the agreement\'s provisions phase in.\n\nCurrency markets have also responded, with emerging market currencies strengthening against traditional reserve currencies as capital flows diversify. Central banks globally are recalibrating monetary policy to account for the new trade dynamics.',
      category: 'business',
      author: 'James Mitchell',
      date: '2026-06-16',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop'
    },
    {
      id: 'a3',
      title: 'Revolutionary AI System Achieves Human-Level Language Understanding',
      excerpt: 'New neural architecture demonstrates unprecedented natural language comprehension, marking a pivotal moment in artificial intelligence development.',
      content: 'A new artificial intelligence system developed by collaborative research teams across four continents has achieved what creators are calling "human-parity" in natural language understanding. The system, named Aether, demonstrates the ability to grasp nuance, context, and even cultural subtext in ways that previously eluded AI models.\n\n"What makes Aether different isn\'t just scale — it\'s architecture," explained lead architect Dr. Aisha Patel. "We\'ve moved beyond the transformer model to something closer to how the human brain processes context, maintaining multiple interpretive frames simultaneously."\n\nIn standardized tests, Aether matched or exceeded human performance on reading comprehension, logical reasoning, and creative writing assessment benchmarks. The system also demonstrated unexpected emergent capabilities, including the ability to translate idioms across languages by understanding their cultural context rather than relying on direct translation.\n\nEthics researchers have called for careful governance frameworks as these capabilities raise important questions about AI transparency, creative attribution, and the future of knowledge work. Several nations have already begun consultations on updated AI regulation.',
      category: 'technology',
      author: 'Alex Rivera',
      date: '2026-06-15',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop'
    },
    {
      id: 'a4',
      title: 'World Leaders Pledge Transformative Climate Action at Geneva Summit',
      excerpt: 'Over 190 nations commit to binding emissions targets with unprecedented enforcement mechanisms and green technology transfer agreements.',
      content: 'The Geneva Climate Summit concluded with a historic binding agreement that commits 193 nations to enforceable emissions reduction targets. Unlike previous accords, the Geneva Compact includes robust enforcement mechanisms, including trade consequences for non-compliance and a $2 trillion annual green technology fund.\n\n"The era of voluntary pledges is over," declared UN Secretary-General Amara Osei. "The Geneva Compact turns promises into binding obligations, with clear timelines and accountability."\n\nKey provisions include: a 50% reduction in global carbon emissions by 2035 (baseline 2025); full decarbonization of electricity generation by 2040 in developed nations; and a comprehensive technology transfer framework ensuring developing nations have access to clean energy infrastructure.\n\nThe compact also establishes an International Climate Court to adjudicate disputes and enforce compliance. While praised by environmental groups as "the most ambitious climate agreement in history," some critics argue the enforcement mechanisms could exacerbate economic inequalities if not carefully implemented.\n\nRenewable energy stocks surged following the announcement, while fossil fuel markets experienced significant volatility as investors priced in the transition timeline.',
      category: 'politics',
      author: 'Emma Nakamura',
      date: '2026-06-14',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=400&fit=crop'
    },
    {
      id: 'a5',
      title: 'mRNA Technology Breakthrough Opens Door to Personalized Cancer Vaccines',
      excerpt: 'Clinical trials show remarkable success in training immune systems to target and eliminate specific cancer cells using next-generation mRNA therapeutics.',
      content: 'A groundbreaking clinical trial has demonstrated that personalized mRNA vaccines can train the human immune system to identify and destroy cancer cells with remarkable precision. The trial, involving 1,200 patients across 40 medical centers, showed a 74% reduction in tumor recurrence across multiple cancer types.\n\n"This isn\'t a single cancer vaccine — it\'s a platform," said Dr. Rachel Kim, chief medical officer at BioVax Therapeutics. "We sequence the patient\'s tumor, identify its unique mutations, and engineer a customized vaccine in under three weeks. The body\'s own immune system becomes a targeted weapon against that specific cancer."\n\nThe success builds on mRNA technology that proved effective during the global pandemic response. The key innovation involves lipid nanoparticle delivery systems that target dendritic cells more effectively, triggering a robust T-cell response.\n\nRegulatory agencies in the United States, European Union, and Japan have initiated fast-track approval processes. Manufacturing capacity is being expanded to support potential widespread availability within 18 to 24 months.\n\nPatient advocates have celebrated the results while emphasizing the importance of equitable access. "This can\'t be a therapy reserved for the wealthy," said patient advocate Maria Santos. "We need systems in place to ensure broad access."',
      category: 'health',
      author: 'Dr. Rachel Kim',
      date: '2026-06-13',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=400&fit=crop'
    },
    {
      id: 'a6',
      title: 'Ancient City Discovered Beneath Amazon Rainforest Using Advanced Radar',
      excerpt: 'LIDAR technology reveals a sprawling pre-Columbian metropolis hidden beneath the canopy, rewriting the history of Amazonian civilizations.',
      content: 'Archaeologists using advanced LIDAR (Light Detection and Ranging) technology have discovered the remains of a vast ancient city beneath the dense canopy of the Amazon rainforest. The settlement, covering an estimated 200 square kilometers, features an sophisticated network of roads, canals, plazas, and residential structures that suggest a population of at least 100,000 inhabitants.\n\n"This fundamentally changes our understanding of pre-Columbian South America," said Dr. Carlos Mendoza, lead archaeologist on the expedition. "We\'ve long known that the Amazon was home to complex societies, but the scale and sophistication of this city rivals anything found in Mesoamerica."\n\nThe city, tentatively named "Kuhikugu" after local Indigenous references, features geometric earthworks, agricultural terraces, and a water management system that includes reservoirs and drainage canals. Radiocarbon dating suggests peak occupation between 1200 and 1500 CE.\n\nOf particular interest is evidence of sustainable land management practices that maintained forest cover even as the city grew — a finding with potential relevance for modern sustainable development.\n\nThe discovery was made possible through a combination of satellite-mounted LIDAR and drone-based ground-penetrating radar, technologies that are revolutionizing archaeology by enabling survey through dense vegetation without disturbing sensitive ecosystems.',
      category: 'world',
      author: 'Dr. Carlos Mendoza',
      date: '2026-06-12',
      image: 'https://images.unsplash.com/photo-1590743050497-b9ad0028e6d1?w=800&h=400&fit=crop'
    },
    {
      id: 'a7',
      title: 'Neurotech Startup Demonstrates Thought-to-Text Communication at Record Speed',
      excerpt: 'Non-invasive brain-computer interface enables typing at 90 characters per minute using pure neural signals, bringing consumer neurotech closer to reality.',
      content: 'A Silicon Valley neurotechnology startup has demonstrated a non-invasive brain-computer interface (BCI) that enables users to type at 90 characters per minute using only their thoughts. The system, called MindWrite, uses a lightweight headband with advanced dry-electrode sensors and deep learning algorithms to decode neural signals associated with language production.\n\n"What we\'ve achieved is the decoding of inner speech — the words you say inside your head — in real-time," said MindWrite CEO Priya Sharma. "No surgery, no implants, just a comfortable headband and a few minutes of calibration."\n\nThe system achieves its speed through a novel approach that decodes phonemes rather than individual letters, combined with predictive language modeling that achieves 97% accuracy. The technology has profound implications for individuals with motor disabilities, offering a communication channel that doesn\'t rely on physical movement.\n\nBeyond accessibility, potential applications include hands-free computing, enhanced virtual reality interaction, and new paradigms for creative expression. The company has announced plans for a consumer product within two years, pending regulatory review.\n\nNeuroscience experts have praised the breakthrough while noting important privacy and ethical considerations around neural data. "We\'re entering an era where thoughts themselves may become data," said bioethicist Dr. James Okonkwo. "Robust protections for neural privacy will be essential."',
      category: 'technology',
      author: 'Priya Sharma',
      date: '2026-06-11',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop'
    },
    {
      id: 'a8',
      title: 'International Space Station Successor Unveiled: The Helios Orbital Complex',
      excerpt: 'A new modular space station with artificial gravity sections begins construction, marking humanity\'s next giant leap in orbital habitation.',
      content: 'The successor to the International Space Station has been officially unveiled: the Helios Orbital Complex, a next-generation modular space station featuring rotating habitat sections that provide variable artificial gravity. Construction is expected to begin in orbit in early 2027, with initial habitation capabilities by 2029.\n\nHelios represents a collaboration between twelve space agencies and multiple commercial partners. At its full buildout, the complex will accommodate 24 crew members — three times the ISS capacity — with dedicated modules for microgravity manufacturing, astronomical observation, and deep-space mission staging.\n\n"The artificial gravity capability is the game-changer," explained Commander Sarah Walsh, NASA\'s Helios program director. "Long-duration exposure to microgravity causes significant physiological changes. Being able to sleep, exercise, and work in partial gravity will dramatically improve crew health and mission sustainability."\n\nThe rotating habitat ring, with a diameter of 80 meters, will generate variable gravity levels from Martian-equivalent (0.38g) to near-Earth (0.9g), enabling unprecedented research into partial-gravity biology.\n\nCommercial modules include a luxury habitat for private astronauts, a pharmaceutical manufacturing facility leveraging microgravity protein crystallization, and a deep-space communications hub. The estimated $150 billion price tag will be shared across partner nations and commercial operators.',
      category: 'science',
      author: 'Sarah Walsh',
      date: '2026-06-10',
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=400&fit=crop'
    }
  ];

  /* ─── INIT ─── */
  function init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const initial = {
        articles: DEFAULT_ARTICLES,
        comments: {},
        users: [],
        currentUser: null
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }

  /* ─── HELPERS ─── */
  function getData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /* ─── ARTICLES ─── */
  function getArticles() {
    return getData().articles || [];
  }

  function getArticleById(id) {
    return getArticles().find(a => a.id === id) || null;
  }

  function addArticle(article) {
    const data = getData();
    if (!data.articles) data.articles = [];
    const newArticle = {
      id: 'a' + Date.now() + Math.random().toString(36).slice(2, 6),
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category || 'general',
      author: article.author || 'HAKHAMENSH-NEWS',
      date: new Date().toISOString().split('T')[0],
      image: article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=800&h=400&fit=crop',
      comments: []
    };
    data.articles.unshift(newArticle);
    saveData(data);
    return newArticle;
  }

  function deleteArticle(id) {
    const data = getData();
    if (!data.articles) return false;
    data.articles = data.articles.filter(a => a.id !== id);
    if (data.comments) delete data.comments[id];
    saveData(data);
    return true;
  }

  /* ─── COMMENTS ─── */
  function getComments(articleId) {
    const data = getData();
    /* Comments stored inline in articles for simplicity */
    const article = (data.articles || []).find(a => a.id === articleId);
    return article ? (article.comments || []) : [];
  }

  function addComment(articleId, text, author) {
    const data = getData();
    const article = (data.articles || []).find(a => a.id === articleId);
    if (!article) return null;
    if (!article.comments) article.comments = [];
    const comment = {
      id: 'c' + Date.now(),
      author: author || 'Anonymous',
      text: text,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    article.comments.push(comment);
    saveData(data);
    return comment;
  }

  /* ─── USERS ─── */
  function getUsers() {
    return getData().users || [];
  }

  function addUser(name, email, password) {
    const data = getData();
    if (!data.users) data.users = [];
    const existing = data.users.find(u => u.email === email);
    if (existing) return null;
    const user = {
      id: 'u' + Date.now(),
      name,
      email,
      password,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    data.users.push(user);
    saveData(data);
    return { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin };
  }

  function authenticateUser(email, password) {
    /* Check default admin first */
    if (email === 'admin@gmail.com' && password === 'admin123') {
      return { id: 'admin', name: 'Admin', email: 'admin@gmail.com', isAdmin: true };
    }
    const data = getData();
    const user = (data.users || []).find(u => u.email === email && u.password === password);
    if (user) {
      return { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin || false };
    }
    return null;
  }

  function setCurrentUser(user) {
    const data = getData();
    data.currentUser = user;
    saveData(data);
  }

  function getCurrentUser() {
    return getData().currentUser || null;
  }

  function clearCurrentUser() {
    const data = getData();
    data.currentUser = null;
    saveData(data);
  }

  /* ─── FORMAT HELPERS ─── */
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /* ─── AVATAR ─── */
  const AVATAR_KEY = 'nova_avatars';

  function getAvatars() {
    try {
      return JSON.parse(localStorage.getItem(AVATAR_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveAvatar(userId, dataUrl) {
    const avatars = getAvatars();
    avatars[userId] = dataUrl;
    localStorage.setItem(AVATAR_KEY, JSON.stringify(avatars));
  }

  function getAvatar(userId) {
    const avatars = getAvatars();
    return avatars[userId] || null;
  }

  /* ─── EXPORT ─── */
  return {
    init,
    getArticles,
    getArticleById,
    addArticle,
    deleteArticle,
    getComments,
    addComment,
    getUsers,
    addUser,
    authenticateUser,
    setCurrentUser,
    getCurrentUser,
    clearCurrentUser,
    saveAvatar,
    getAvatar,
    formatDate
  };
})();
