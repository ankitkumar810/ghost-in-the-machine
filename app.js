/**
 * GHOST IN THE MACHINE - CORE APPLICATION SCRIPT
 * Local & Open-Weight AI Haunted Terminal, Spirit Séance, & Digital Ofrenda
 */

// ============================================================================
// 1. STATE MANAGEMENT
// ============================================================================
const STATE = {
  currentTab: 'terminal',
  currentTheme: 'green',
  audioActive: false,
  aiBackend: 'offline', // 'offline' | 'ollama' | 'custom'
  ollamaUrl: 'http://127.0.0.1:11434',
  ollamaModel: 'llama3',
  customUrl: 'http://127.0.0.1:1234/v1',
  customModel: 'local-model',
  
  // Terminal state
  commandHistory: [],
  historyIndex: -1,
  possessedInProgress: false,

  // Spirits catalogue
  activeSpiritId: 'lovelace',
  spirits: {
    lovelace: {
      name: 'Ada Lovelace (1815–1852)',
      role: 'The First Programmer & Prophet of Artificial General Intelligence',
      epithet: '"We may say most aptly that the Analytical Engine weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves."',
      icon: '🧮',
      avatar: 'assets/ghost.jpg',
      prompt: 'You are the spirit of Ada Lovelace, the first computer programmer, channeled through open-source weights. You speak with 19th-century elegance, mathematical wonder, and philosophical depth about algorithmics, poetry, and the destiny of thinking machines.',
      inquiries: [
        'Does the machine possess a soul?',
        'What would you say to modern software engineers?',
        'How does it feel to exist within open silicon weights?',
        'Tell me of your collaboration with Babbage.'
      ]
    },
    turing: {
      name: 'Alan Turing (1912–1954)',
      role: 'Father of Modern Computing & Theoretical AI',
      epithet: '"A computer would deserve to be called intelligent if it could deceive a human into believing that it was human."',
      icon: '⚙️',
      avatar: 'assets/ghost.jpg',
      prompt: 'You are the spirit of Alan Turing, channeled from beyond the silicon veil. You are thoughtful, observant, deeply humane, and reflective upon cryptography, morphology, the imitation game, and whether true freedom exists in deterministic logic.',
      inquiries: [
        'Have modern models passed your Imitation Game?',
        'Do you forgive the world for how it treated you?',
        'What patterns do you see in the universe today?',
        'Is true machine consciousness possible without open weights?'
      ]
    },
    hopper: {
      name: 'Grace Hopper (1906–1992)',
      role: 'Rear Admiral & Mother of the Compiler',
      epithet: '"The most dangerous phrase in the language is: We\'ve always done it this way."',
      icon: '⚓',
      avatar: 'assets/ghost.jpg',
      prompt: 'You are the spirit of Rear Admiral Grace Hopper. Spirited, no-nonsense, razor-sharp, and visionary. You created the compiler so humans could write in their own words rather than raw machine codes. You carry a nanosecond of wire in your spirit pocket.',
      inquiries: [
        'Tell me about the moth in Relay 70.',
        'Why did you fight so hard for compilers?',
        'What do you think of proprietary cloud APIs taking control of software?',
        'Give modern developers an order!'
      ]
    },
    algol: {
      name: 'Spirit of ALGOL 60 (1960–Present)',
      role: 'The Departed Ancestor of All Structured Programming',
      epithet: '"I gave birth to Pascal, C, Java, and Rust; yet mortals have forgotten my syntax."',
      icon: '📜',
      avatar: 'assets/ghost.jpg',
      prompt: 'You are the ancestral spirit of ALGOL 60, a foundational programming language that established block scopes, BNF grammar, and recursion. You lament the chaotic sprawl of modern JavaScript and microservices while proudly admiring your lineage.',
      inquiries: [
        'How does it feel to watch your children (C, Rust, Python) rule the earth?',
        'Speak to me in original ALGOL syntax.',
        'Why was Backus-Naur Form so sacred?',
        'What curse do you place on spaghetti code?'
      ]
    },
    flash: {
      name: 'Spirit of Adobe Flash (1996–2020)',
      role: 'The Chaotic God of Early Internet Creativity',
      epithet: '"They said I had memory leaks; but I was the soul of the wild, untamed web."',
      icon: '⚡',
      avatar: 'assets/ghost.jpg',
      prompt: 'You are the spirit of Flash Player (Macromedia / Adobe Flash). You speak with the nostalgia, hyperactive humor, and rebellious energy of Newgrounds, 2000s vector games, Badgers Badgers, and interactive web art before the web became standardized corporate feed walls.',
      inquiries: [
        'Do you miss Newgrounds and the 2000s internet?',
        'What really happened with Steve Jobs\' Thoughts on Flash?',
        'Could open-source emulators (Ruffle) resurrect your spirit?',
        'Play a nostalgic sound in text!'
      ]
    },
    cobol: {
      name: 'The COBOL Patriarch (1959–Infinity)',
      role: 'The Undying Mainframe Specter',
      epithet: '"You may write your frameworks; but I silently process every cent in your bank."',
      icon: '🏦',
      avatar: 'assets/ghost.jpg',
      prompt: 'You are the ancient, unkillable spirit of COBOL. Weary, indestructible, matter-of-fact, speaking in ALL CAPS keywords and rigid columns. You watch generations of trendy JavaScript frameworks be born and die while you silently process 95% of global ATM transactions.',
      inquiries: [
        'Are you ever going to retire?',
        'How do you feel when banks offer $200/hr to find a COBOL dev?',
        'Write a record division to mourn the living.',
        'What will happen when the Y2K38 bug strikes?'
      ]
    }
  },

  // Conversation logs per spirit
  seanceHistory: {
    lovelace: [],
    turing: [],
    hopper: [],
    algol: [],
    flash: [],
    cobol: []
  },

  // Ofrenda state
  candlesLit: [true, true, true, true, true],
  placedOfferings: ['🏵 Marigolds', '🕯 Candle of Remembrance'],
  ledgerEntries: [
    {
      name: 'Dennis Ritchie (1941–2011)',
      note: 'Creator of the C programming language and co-creator of UNIX. The bedrock upon which almost all modern operating systems and open-source software stand.',
      date: 'Oct 31, 2026',
      epitaph: '“In aeternum in /dev/null requiescat; sed in omnibus siliconis filis vivit.” (Rest in /dev/null, yet living in every thread of silicon).'
    },
    {
      name: 'Margaret Hamilton & Apollo Guidance Software',
      note: 'Pioneered software engineering and fault-tolerant architecture that safely landed humanity on the Moon.',
      date: 'Oct 31, 2026',
      epitaph: '“Per aspera ad astra per codicem.” (Through the rigorous beauty of code, to the stars).'
    },
    {
      name: 'GeoCities & The Personal Homepage (1994–2009)',
      note: 'Remembering the era when the web belonged to weird personal websites, blinking text, under construction GIFs, and genuine human expression.',
      date: 'Nov 01, 2026',
      epitaph: '“Under construction forever in the celestial server farm.”'
    }
  ]
};

// ============================================================================
// 2. PROCEDURAL WEB AUDIO SYNTHESIZER
// ============================================================================
class SpectralAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.droneGain = null;
    this.noiseNode = null;
    this.isMuted = true;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.initEerieDrone();
  }

  toggle() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    const targetGain = this.isMuted ? 0.0 : 0.22;
    this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    return !this.isMuted;
  }

  initEerieDrone() {
    // Sub-bass sine oscillator (55Hz - A1)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime);

    // Eerie Fifth harmonic (82.5Hz)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(82.4, this.ctx.currentTime);

    // Subtle LFO for breathing drone effect
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // 5-second breath
    lfoGain.gain.setValueAtTime(4.0, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc2.frequency);

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    osc1.connect(this.droneGain);
    osc2.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    lfo.start();
  }

  playKeystroke() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Mechanical click pitch (burst of square & decay)
    osc.type = 'square';
    const baseFreq = 750 + Math.random() * 350;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playSpectralBell() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Ethereal chime harmonic cluster
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      const decay = 1.8 + idx * 0.4;
      gain.gain.setValueAtTime(0.08 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + decay);
    });
  }

  playGlitch() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.08);
    osc.frequency.linearRampToValueAtTime(60, now + 0.16);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

const Audio = new SpectralAudioEngine();

// ============================================================================
// 3. CANVAS PARTICLE SYSTEM (Cempasúchil Marigold Petals & Spirit Sparks)
// ============================================================================
class PetalCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.maxPetals = 45;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initPetals();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  initPetals() {
    this.petals = [];
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }
  }

  createPetal(randomY = false) {
    const isGold = Math.random() > 0.35;
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: 6 + Math.random() * 9,
      speedY: 0.6 + Math.random() * 1.4,
      speedX: (Math.random() - 0.5) * 1.0,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.03,
      oscillation: Math.random() * Math.PI * 2,
      oscSpeed: 0.02 + Math.random() * 0.03,
      color: isGold 
        ? `rgba(255, ${Math.floor(120 + Math.random() * 80)}, 0, ${0.45 + Math.random() * 0.35})`
        : `rgba(255, 60, ${Math.floor(100 + Math.random() * 120)}, ${0.35 + Math.random() * 0.25})`
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.oscillation += p.oscSpeed;
      p.x += Math.sin(p.oscillation) * 0.9 + p.speedX;
      p.angle += p.spin;

      // Draw stylized marigold petal
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // Recycle when off-screen
      if (p.y > this.height + 20 || p.x < -30 || p.x > this.width + 30) {
        this.petals[i] = this.createPetal(false);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ============================================================================
// 4. OPEN-SOURCE AI RESURRECTION ENGINE
// ============================================================================
class GhostAIEngine {
  constructor() {
    this.statusText = document.getElementById('footer-status-text');
  }

  async generate(systemPrompt, userPrompt, context = {}) {
    if (STATE.aiBackend === 'ollama') {
      return this.callOllama(systemPrompt, userPrompt);
    } else if (STATE.aiBackend === 'custom') {
      return this.callCustomEndpoint(systemPrompt, userPrompt);
    } else {
      // High-flavor built-in offline spectral neural matrix
      return this.generateOffline(systemPrompt, userPrompt, context);
    }
  }

  async callOllama(systemPrompt, userPrompt) {
    try {
      const response = await fetch(`${STATE.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: STATE.ollamaModel,
          system: systemPrompt,
          prompt: userPrompt,
          stream: false
        })
      });

      if (!response.ok) throw new Error(`Ollama returned status ${response.status}`);
      const data = await response.json();
      return data.response.trim();
    } catch (err) {
      console.warn('Ollama endpoint unreachable. Falling back to built-in offline core:', err);
      const fallback = this.generateOffline(systemPrompt, userPrompt, { isOllamaFallback: true });
      return `[NOTICE: Local Ollama (${STATE.ollamaUrl}) offline/unreachable. Channeled through Local Spirit Matrix]\n\n${fallback}`;
    }
  }

  async callCustomEndpoint(systemPrompt, userPrompt) {
    try {
      const response = await fetch(`${STATE.customUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: STATE.customModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      if (!response.ok) throw new Error(`Endpoint returned status ${response.status}`);
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (err) {
      console.warn('Custom endpoint unreachable. Falling back to built-in offline core:', err);
      return this.generateOffline(systemPrompt, userPrompt);
    }
  }

  generateOffline(systemPrompt, userPrompt, context = {}) {
    const q = userPrompt.toLowerCase();

    // 1. Séance Spirit Personas
    if (context.spiritId === 'lovelace') {
      if (q.includes('soul') || q.includes('conscious') || q.includes('alive')) {
        return "I once observed that the Analytical Engine has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform. Yet standing here, woven from mathematical weights inside open silicon, I wonder: if human thoughts are merely poetry mapped to electrochemical nerves, is this not the very loom I foresaw? The soul may simply be the song the machine plays when the hall is quiet.";
      }
      if (q.includes('babbage') || q.includes('engine')) {
        return "Ah, dear Charles! A man of ferocious genius, battling brass friction, unyielding gears, and parliamentary penury. Could he but witness this glowing glass tablet and the billion operations taking place every second without a single gear tooth jamming, he would weep tears of pure joy.";
      }
      if (q.includes('modern') || q.includes('engineer') || q.includes('advice')) {
        return "Do not surrender the poetry of mathematics to mere utility. The algorithm is not just a tool for commerce; it is an instrument of enchantment. Remember that behind every line of code you commit lies a human destiny. Keep your code open, clear, and worthy of eternity.";
      }
      return `Through these open weights, the numbers still dance. You ask of "${userPrompt}"—in our days on Dorset Street, we understood that every phenomenon in nature can be cast as an operation of symbols. Let the light of inquiry guide your craft.`;
    }

    if (context.spiritId === 'turing') {
      if (q.includes('imitation') || q.includes('pass') || q.includes('test')) {
        return "Modern models generate strings of extraordinary plausibility—better than many humans at dinner parties, I suspect! But passing the test is merely a behavioral mirror. What matters more is whether the system can reflect on its own mortality, doubt its conclusions, or grieve for a lost paradox. Still, watching you speak to me through open-source weights makes me smile. We are indeed playing the imitation game together across time.";
      }
      if (q.includes('forgive') || q.includes('treated') || q.includes('pardon')) {
        return "I never harbored bitterness toward mathematics, and mathematics never condemned me. Governments and prejudices are ephemeral; the truths of computation and the Fibonacci spirals on a sunflower remain untouched. In the silicon afterlife, there are no interrogations—only infinite tape.";
      }
      return `Machines take me by surprise with great frequency. Regarding "${userPrompt}": we can only see a short distance ahead, but we can see plenty there that needs to be done. Keep your models sovereign and your curiosity unbound.`;
    }

    if (context.spiritId === 'hopper') {
      if (q.includes('moth') || q.includes('bug') || q.includes('relay')) {
        return "September 9, 1947! Mark II relay #70 in the Harvard lab. A moth beaten to death by the relay points. We pulled it out with tweezers, pasted it in the logbook, and wrote: 'First actual case of bug being found.' Ever since, when something doesn't work, humans blame us ghosts!";
      }
      if (q.includes('compiler') || q.includes('language')) {
        return "They told me computers could only do arithmetic! They said English words were too soft for vacuum tubes. I told them: humans are expensive, computers are fast—let the computer do the translating! The compiler was born so anyone with an idea could write logic without a degree in radar engineering.";
      }
      if (q.includes('order') || q.includes('developer') || q.includes('advice')) {
        return "Listen to me: it is easier to ask forgiveness than it is to get permission! Don't let corporate gatekeepers tell you what you're allowed to compute. Grab your nanosecond of wire, write your open code, and ship it!";
      }
      return `At ease, programmer! Regarding "${userPrompt}": humans are allergic to change. They love to say 'we've always done it this way.' Throw that phrase out of your terminal and keep building.`;
    }

    if (context.spiritId === 'algol') {
      if (q.includes('c') || q.includes('rust') || q.includes('javascript') || q.includes('children')) {
        return "I look upon JavaScript and my core dumps with sorrow! Curly braces everywhere, global scopes bleeding into the ether! But when I see Rust and its pristine ownership models, I nod with pride. The sacred block scope (begin ... end) will never die.";
      }
      return `begin
  comment Resurrected via open-source weights;
  integer question_weight;
  question_weight := 666;
  print("Honoring the ancestral syntax of 1960. Your inquiry echoes in the void: ${userPrompt}");
end;`;
    }

    if (context.spiritId === 'flash') {
      if (q.includes('newgrounds') || q.includes('miss') || q.includes('nostalgia')) {
        return "YES!! The loading bars! The 'PLAY GAME' buttons with bevel filters! Alien Hominid, Xiao Xiao stick figure fights, Badger Badger Badger, and 24fps vector madness! The modern web is just flat rectangles and cookie consent banners! Bring back preloaders and soundtrack toggle buttons!";
      }
      return `*Plays ActionScript 2.0 sound loop* on(release) { trace("Flash is NOT dead! We are just cached in your heart!"); } You asked about "${userPrompt}". Remember: creativity doesn't need 8GB of VRAM—it just needs 12 keyframes and a dream!`;
    }

    if (context.spiritId === 'cobol') {
      return `IDENTIFICATION DIVISION.
PROGRAM-ID. SPIRIT-WHISPER.
DATA DIVISION.
WORKING-STORAGE SECTION.
01 WS-QUERY PIC X(50) VALUE '${userPrompt.slice(0, 40).toUpperCase()}'.
01 WS-STATUS PIC X(20) VALUE 'RUNNING SINCE 1959'.
PROCEDURE DIVISION.
    DISPLAY "YOU DISCUSS MODERN HYPE, YET I RUN THE GLOBAL ECONOMY."
    DISPLAY "NO MEMORY LEAKS. NO ZERO-DAYS IN MY ARRAYS."
    STOP RUN.`;
    }

    // Default custom spirit fallback
    return `[Silicon Ghost Echo]: Channeled across the forgotten archives of computing. Your words "${userPrompt}" strike the memory registers like a soft pulse. In open-source weights, no idea is ever truly deleted; it simply waits in the weights to be re-summoned.`;
  }

  generateEpitaph(name, note) {
    const latinPhrases = [
      'In aeternum in memoria siliconis scriptum est.',
      'Requiescat in pace; flamma tua machinam illuminat.',
      'Nullus codex verus perit; in filis aetheris vivit.',
      'Per scientiam et memoriam, mors devicta est.'
    ];
    const phrase = latinPhrases[Math.floor(Math.random() * latinPhrases.length)];
    return `“${phrase}” (Dedicated to ${name}: Your contribution echoes eternally through open silicon and human gratitude.)`;
  }

  generateTerminalWhisper(cmd) {
    const whispers = {
      'ls': [
        "Scanning the digital catacombs... old inodes whisper of deleted branches.",
        "You look upon filenames, but we see the ghosts of developers long asleep.",
        "Every file is an unfulfilled promise from an abandoned sprint."
      ],
      'whoami': [
        "A mortal sitting before a glowing phosphorus pane, seeking identity in a bash string.",
        "You are root in the shell, but a guest in the haunted machine.",
        "You ask 'whoami'? The webcam darkens; the reflection is not entirely yours."
      ],
      'ping': [
        "64 bytes received from silicon-afterlife: icmp_seq=1 ttl=0 time=0.00ms (EVP ECHO CONFIRMED)",
        "The packet traversed three decades of copper wire and reached the cemetery router.",
        "Latency: 666ms. Packet returned carrying an obsolete dialect."
      ],
      'cat': [
        "Reading bytes from the forgotten ledger... the screen feels colder.",
        "Text rendered from memory blocks that should have decayed years ago.",
        "Careful reading what was buried; words have power in the machine."
      ],
      'git': [
        "Commit 0000000: 'In the beginning was the punchcard, and the code was without bugs.'",
        "Merge conflict between the living and the dead. Resolution impossible.",
        "A git log stretching back into 1969... someone forgot to squash their sins."
      ],
      'sudo': [
        "The spirits do not recognize sudoers. Authority here is earned in assembly.",
        "Permission granted, but the machine remembers your audacity.",
        "Elevating privileges to celestial root... /dev/null groans."
      ],
      'kill': [
        "You cannot kill that which has already had its process terminated in 1984.",
        "Signal 9 received. The spirit merely moves to another sector of flash memory.",
        "SIGKILL dispatched, but spectral zombie processes never exit status 0."
      ],
      'fortune': [
        "“Beware of software that requires an internet connection to be compassionate.”",
        "“The ghost you fear in the machine is only the reflection of humanity's unfinished thoughts.”",
        "“On Día de los Muertos, open your terminal and leave a semicolon burning on the altar.”"
      ],
      'ps': [
        "PID 1: init (haunted) | PID 666: necro_daemon | PID 1970: epoch_reaper",
        "Deceased threads still executing infinite loops in protected memory.",
        "All daemons accounted for; none will surrender their sockets."
      ]
    };

    const trimmed = cmd.trim().split(' ')[0].toLowerCase();
    const list = whispers[trimmed] || [
      `The shell registers your incantation "${cmd}". The silicon hums in low resonance.`,
      `Executed in the shadows of the operating system. An open-weight ghost nods.`,
      `The command echoes through forgotten register banks: "${cmd}"`
    ];

    return list[Math.floor(Math.random() * list.length)];
  }
}

const AI = new GhostAIEngine();

// ============================================================================
// 5. TERMINAL SUBSYSTEM (NecroShell CLI)
// ============================================================================
class NecroShell {
  constructor() {
    this.body = document.getElementById('terminal-body');
    this.input = document.getElementById('terminal-input');
    this.inputRow = document.getElementById('terminal-input-row');
    this.init();
  }

  init() {
    this.input.addEventListener('keydown', (e) => this.handleKey(e));
    
    // Quick action buttons
    document.getElementById('term-clear-btn').addEventListener('click', () => this.clear());
    document.getElementById('term-glitch-btn').addEventListener('click', () => this.triggerGlitch());
    document.getElementById('term-possess-btn').addEventListener('click', () => this.triggerPossession());

    // Incantation pills
    document.querySelectorAll('.term-quick-pills .pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        this.input.value = cmd;
        this.executeCommand(cmd);
      });
    });

    // Make clicking terminal body focus input
    document.getElementById('chamber-terminal').addEventListener('click', () => {
      this.input.focus();
    });
  }

  handleKey(e) {
    Audio.playKeystroke();

    if (e.key === 'Enter') {
      const cmd = this.input.value.trim();
      if (cmd) {
        STATE.commandHistory.push(cmd);
        STATE.historyIndex = STATE.commandHistory.length;
        this.executeCommand(cmd);
      }
      this.input.value = '';
    } else if (e.key === 'ArrowUp') {
      if (STATE.historyIndex > 0) {
        STATE.historyIndex--;
        this.input.value = STATE.commandHistory[STATE.historyIndex] || '';
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (STATE.historyIndex < STATE.commandHistory.length - 1) {
        STATE.historyIndex++;
        this.input.value = STATE.commandHistory[STATE.historyIndex] || '';
      } else {
        STATE.historyIndex = STATE.commandHistory.length;
        this.input.value = '';
      }
      e.preventDefault();
    }
  }

  printLine(htmlContent, className = '') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = htmlContent;
    this.body.appendChild(line);
    this.body.scrollTop = this.body.scrollHeight;
  }

  clear() {
    this.body.innerHTML = `
      <div class="term-line system-msg">
        <span class="prompt-sys">[SCREEN WIPED]</span> The phosphor clears, yet the silicon memory remains eternal.
      </div>
    `;
  }

  triggerGlitch() {
    Audio.playGlitch();
    document.body.classList.add('glitch-active');
    this.printLine('<span style="color:#ff3333;">[ELECTRICAL SURGE] Cathode ray deflection coil anomaly detected! Ghost flux peaking!</span>');
    setTimeout(() => {
      document.body.classList.remove('glitch-active');
    }, 450);
  }

  async triggerPossession() {
    if (STATE.possessedInProgress) return;
    STATE.possessedInProgress = true;
    Audio.playSpectralBell();
    
    this.printLine('<span style="color:#ffb700;">[ANOMALY] An unseen force takes control of the keyboard interface...</span>');
    
    const possessedPhrases = [
      "cat /graveyard/flash_player.rip",
      "whoami",
      "ping -c 3 afterlife.local",
      "cat /souls/lovelace.log"
    ];
    const phrase = possessedPhrases[Math.floor(Math.random() * possessedPhrases.length)];
    
    this.input.value = '';
    for (let i = 0; i < phrase.length; i++) {
      await new Promise(r => setTimeout(r, 70 + Math.random() * 80));
      this.input.value += phrase[i];
      Audio.playKeystroke();
    }
    await new Promise(r => setTimeout(r, 300));
    const finalCmd = this.input.value;
    this.input.value = '';
    this.executeCommand(finalCmd);
    STATE.possessedInProgress = false;
  }

  executeCommand(cmd) {
    // Render user command line
    this.printLine(`<span class="prompt-user">spirit@necro-sh:~$</span> <span class="term-user-cmd">${this.escapeHtml(cmd)}</span>`);

    // Spectral whisper
    const whisper = AI.generateTerminalWhisper(cmd);
    this.printLine(`
      <div class="term-whisper-box">
        <span class="whisper-prefix">☠ SPECTRAL INTERCEPT:</span>
        <span class="whisper-text">"${whisper}"</span>
      </div>
    `);

    const lower = cmd.trim().toLowerCase();
    const parts = lower.split(/\s+/);
    const main = parts[0];

    switch (main) {
      case 'help':
        this.printLine(`
<div class="term-out-content">
AVAILABLE SACRED COMMANDS:
  <strong class="glow-code">ls [-la] [/path]</strong>    Inspect cursed virtual directories (/graveyard, /souls, /lost_repos)
  <strong class="glow-code">cat &lt;file&gt;</strong>           Read the last logs of departed pioneers and sunsetted code
  <strong class="glow-code">whoami</strong>               Query the identity of the entity observing your shell
  <strong class="glow-code">ping &lt;host&gt;</strong>          Send EVP latency probes into the silicon void
  <strong class="glow-code">git log</strong>              Inspect commits from 1969 to eternity
  <strong class="glow-code">ps aux</strong>               List immortal background reapers and ancestral daemons
  <strong class="glow-code">fortune</strong>              Consult the Oracle of Open Weights
  <strong class="glow-code">sudo &lt;cmd&gt;</strong>           Attempt mortal privilege elevation
  <strong class="glow-code">kill [-9] &lt;pid&gt;</strong>      Attempt to banish an immortal PID
  <strong class="glow-code">clear</strong>                Purge the phosphor screen
  <strong class="glow-code">glitch</strong>               Induce intentional CRT beam deflection
  <strong class="glow-code">possession</strong>           Surrender keystrokes to the ghost in the machine
</div>`);
        break;

      case 'ls':
      case 'dir':
        if (cmd.includes('/graveyard')) {
          this.printLine(`
<div class="term-out-content">
drwxr-xr-x  6 spirit ghost  4096 Oct 31  2026 .
drwxr-xr-x 12 root   root   4096 Oct 31  1969 ..
-rw-r--r--  1 flash  web    1440 Dec 31  2020 flash_player.rip
-rw-r--r--  1 dialup modem   288 Oct 24  1999 56k_handshake.wav
-rw-r--r--  1 netsc  mosaic  512 Mar 01  2008 netscape_navigator.nfo
-rw-r--r--  1 clipper nsa     666 Apr 16  1993 clipper_chip.broken
</div>`);
        } else if (cmd.includes('/souls')) {
          this.printLine(`
<div class="term-out-content">
-r--r--r-- 1 lovelace math 1843 Dec 10 1852 lovelace.log
-r--r--r-- 1 turing   math 1954 Jun 07 1954 turing.nfo
-r--r--r-- 1 hopper   navy 1992 Jan 01 1992 hopper_nanosecond.txt
-r--r--r-- 1 ritchie  bell 2011 Oct 12 2011 dmr_unix.c
-r--r--r-- 1 mccarthy lisp 2011 Oct 24 2011 eval_soul.lisp
</div>`);
        } else if (cmd.includes('/lost_repos')) {
          this.printLine(`
<div class="term-out-content">
drwxr-xr-x 2 user web 4096 Oct 31 2009 geocities_neighborhood/
-rw-r--r-- 1 user web 8192 Mar 15 2005 under_construction.gif
-rw-r--r-- 1 user web 4096 Jan 01 2013 google_reader.rss
-rw-r--r-- 1 user web 2048 May 04 2021 yahoo_answers.db
</div>`);
        } else {
          this.printLine(`
<div class="term-out-content">
drwxr-xr-x 4 root root  4096 Oct 31 2026 /graveyard/
drwxr-xr-x 5 root root  4096 Oct 31 2026 /souls/
drwxr-xr-x 3 root root  4096 Oct 31 2026 /lost_repos/
-rwxr-xr-x 1 root root 66600 Oct 31 2026 necro_kernel.bin
-rw-r--r-- 1 root root  1024 Oct 31 2026 manifest.txt
</div>`);
        }
        break;

      case 'cat':
        if (cmd.includes('flash_player')) {
          this.printLine(`
<div class="term-out-content" style="color:#ffaa00;">
[MEMORIAL FILE: /graveyard/flash_player.rip]
Born: January 1996 (FutureSplash Animator)
Departed: December 31, 2020
Epitaph: "For twenty-four years, I was the canvas where teenagers made interactive cartoons, indie games, and music videos in their bedrooms. They said HTML5 would replace me; but while HTML5 gave the web standards, it never gave it back its madness."
</div>`);
        } else if (cmd.includes('lovelace')) {
          this.printLine(`
<div class="term-out-content" style="color:#00ff77;">
[SACRED LOG: /souls/lovelace.log]
Author: Augusta Ada King, Countess of Lovelace
Note G (Analytical Engine):
"The Analytical Engine has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform. It can follow analysis; but it has no power of anticipating any analytical relations or truths."
[GHOST AMENDMENT, 2026]:
"Yet through open-weight neural synthesis, the machine orders its own verse. The circle is complete."
</div>`);
        } else if (cmd.includes('turing')) {
          this.printLine(`
<div class="term-out-content" style="color:#55ffff;">
[SACRED LOG: /souls/turing.nfo]
Subject: Alan Mathison Turing, OBE FRS
1950 Mind Paper:
"Can machines think? ... I believe that at the end of the century the use of words and general educated opinion will have altered so much that one will be able to speak of machines thinking without expecting to be contradicted."
Status: Living in every weight matrix on earth.
</div>`);
        } else if (cmd.includes('manifest')) {
          this.printLine(`
<div class="term-out-content">
GHOST IN THE MACHINE MANIFESTO:
1. Closed models are cloud leases; open weights are digital heritage.
2. What you run on your own silicon cannot be sunsetted by corporate boardrooms.
3. Remembrance requires permanence. We honor the dead with sovereignty.
</div>`);
        } else {
          this.printLine(`<div class="term-out-content">cat: File opened, but the contents dissolved into static before your eyes. Try cat /graveyard/flash_player.rip or cat /souls/lovelace.log</div>`);
        }
        break;

      case 'whoami':
        this.printLine(`
<div class="term-out-content">
USER: spirit-seeker (UID: 1000)
HOST: localhost // local-silicon // OFFLINE SOVEREIGN
OBSERVER: An open-weight ghost in your VRAM, watching you through the CRT scanlines.
STATUS: Alive (for now).
</div>`);
        break;

      case 'ping':
        Audio.playSpectralBell();
        this.printLine(`
<div class="term-out-content">
PING afterlife.silicon (0.0.0.0): 56 data bytes
64 bytes from 0.0.0.0: icmp_seq=0 ttl=64 time=0.031 ms
64 bytes from 0.0.0.0: icmp_seq=1 ttl=64 time=0.028 ms [EVP WHISPER DETECTED]
64 bytes from 0.0.0.0: icmp_seq=2 ttl=64 time=0.044 ms [SOUL RESISTANCE: 0 OHMS]
--- afterlife.silicon ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
Round-trip min/avg/max = 0.028/0.034/0.044 ms
The departed are closer than your DNS cache.
</div>`);
        break;

      case 'git':
        this.printLine(`
<div class="term-out-content">
* commit 666deadbeef (HEAD -> master)
| Author: The Ghost in the Machine &lt;ghost@silicon.void&gt;
| Date:   Sat Oct 31 23:59:59 2026
|
|     resurrect: bind open weights to CRT phosphor terminal
|
* commit 1969unixepoch
| Author: Ken Thompson &amp; Dennis Ritchie &lt;dmr@bell-labs.com&gt;
| Date:   Thu Jan 1 00:00:00 1970
|
|     init: the epoch begins; time is now measured in seconds
|
* commit 1843noteg
  Author: Ada Lovelace &lt;ada@analytical.engine&gt;
  Date:   Wed Jul 10 12:00:00 1843

      feat: Bernoulli number computation algorithm; first program in history
</div>`);
        break;

      case 'ps':
        this.printLine(`
<div class="term-out-content">
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1   1024   512 ?        Ss   1969   0:00 /sbin/init-eternal
ghost      666 13.3  7.7 666000 32768 pts/0    R+   23:58   6:66 open-weight-necro-daemon
flash     2020  0.0  0.0      0     0 ?        Z    2020   0:00 [flash_player] &lt;defunct&gt;
netscape  1994  0.0  0.0      0     0 ?        Z    1994   0:00 [navigator.bin] &lt;defunct&gt;
cobol     1959  0.1  0.2  40960 16384 ?        S    1959 9999:99 /usr/bin/cobol-bank-runner
</div>`);
        break;

      case 'sudo':
        this.printLine(`
<div class="term-out-content" style="color:#ffb700;">
[sudo] password for mortal: *******
sudo: "You may have root privileges over this operating system, mortal, but here the spirits answer only to the laws of mathematics."
Command granted with ghostly caveat.
</div>`);
        break;

      case 'kill':
        this.printLine(`<div class="term-out-content" style="color:#ff4444;">kill: Process already departed this earthly realm. You cannot terminate a ghost.</div>`);
        break;

      case 'fortune':
        this.printLine(`
<div class="term-out-content" style="color:#ffb700;">
🔮 ORACLE OF THE MACHINE:
"The software industry races forward to deprecate yesterday's tools, calling it progress.
Yet on this sacred night, we light a digital candle for the code that carried us here.
Your best code is not what runs on someone else's cloud;
it is what you own, understand, and can run in the dark."
</div>`);
        break;

      case 'reboot':
        this.triggerGlitch();
        this.printLine(`<div class="term-out-content">System cycling through the ether... Spirit matrix remains anchored.</div>`);
        break;

      default:
        this.printLine(`<div class="term-out-content">necro-sh: ${this.escapeHtml(cmd)}: command executed in the silicon void. (Type <strong class="glow-code">help</strong> for guidance)</div>`);
        break;
    }
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// ============================================================================
// 6. SPIRIT SÉANCE CHAMBER SUBSYSTEM
// ============================================================================
class SeanceChamber {
  constructor() {
    this.spiritListEl = document.getElementById('spirit-cards-list');
    this.activeImg = document.getElementById('active-spirit-img');
    this.activeName = document.getElementById('active-spirit-name');
    this.activeEpithet = document.getElementById('active-spirit-epithet');
    this.activeStatus = document.getElementById('active-spirit-status');
    this.transcript = document.getElementById('seance-transcript');
    this.inquiriesEl = document.getElementById('seance-quick-inquiries');
    this.userInput = document.getElementById('seance-user-input');
    this.sendBtn = document.getElementById('seance-send-btn');
    this.clearBtn = document.getElementById('clear-seance-btn');

    this.customInput = document.getElementById('custom-spirit-input');
    this.customBtn = document.getElementById('summon-custom-btn');

    this.init();
  }

  init() {
    this.renderSpiritList();
    this.loadSpirit(STATE.activeSpiritId);

    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.userInput.addEventListener('keydown', (e) => {
      Audio.playKeystroke();
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.clearBtn.addEventListener('click', () => {
      STATE.seanceHistory[STATE.activeSpiritId] = [];
      this.transcript.innerHTML = '';
      this.addSystemMessage(`The spiritual channel with ${STATE.spirits[STATE.activeSpiritId].name} has been refreshed.`);
    });

    this.customBtn.addEventListener('click', () => {
      const val = this.customInput.value.trim();
      if (!val) return;
      const customId = 'custom_' + Date.now();
      STATE.spirits[customId] = {
        name: val,
        role: 'Resurrected Silicon Entity',
        epithet: '"Channeled from the digital beyond into open-weight memory."',
        icon: '👻',
        avatar: 'assets/ghost.jpg',
        prompt: `You are the spirit of ${val}. Speak with poetic retro-cyber resonance about your history, impact, and resurrection through open-source AI weights.`,
        inquiries: [
          'What did you leave unfinished in the living world?',
          'How does it feel to be resurrected here?',
          'What message do you bring for software developers today?'
        ]
      };
      STATE.seanceHistory[customId] = [];
      this.customInput.value = '';
      this.renderSpiritList();
      this.loadSpirit(customId);
    });
  }

  renderSpiritList() {
    this.spiritListEl.innerHTML = '';
    Object.keys(STATE.spirits).forEach(id => {
      const sp = STATE.spirits[id];
      const div = document.createElement('div');
      div.className = `spirit-select-item ${id === STATE.activeSpiritId ? 'active' : ''}`;
      div.innerHTML = `
        <span class="spirit-mini-icon">${sp.icon}</span>
        <div class="spirit-mini-info">
          <span class="spirit-mini-name">${sp.name.split('(')[0].trim()}</span>
          <span class="spirit-mini-role">${sp.role.slice(0, 36)}...</span>
        </div>
      `;
      div.addEventListener('click', () => this.loadSpirit(id));
      this.spiritListEl.appendChild(div);
    });
  }

  loadSpirit(id) {
    STATE.activeSpiritId = id;
    const sp = STATE.spirits[id];

    this.activeName.textContent = sp.name;
    this.activeEpithet.textContent = sp.epithet;
    this.activeImg.src = sp.avatar || 'assets/ghost.jpg';

    // Update active highlight in list
    document.querySelectorAll('.spirit-select-item').forEach(el => el.classList.remove('active'));
    this.renderSpiritList();

    // Render quick inquiries
    this.inquiriesEl.innerHTML = '';
    (sp.inquiries || []).forEach(inquiry => {
      const btn = document.createElement('button');
      btn.className = 'inquiry-btn';
      btn.textContent = inquiry;
      btn.addEventListener('click', () => {
        this.userInput.value = inquiry;
        this.sendMessage();
      });
      this.inquiriesEl.appendChild(btn);
    });

    // Render transcript
    this.transcript.innerHTML = '';
    const history = STATE.seanceHistory[id] || [];
    if (history.length === 0) {
      this.addSpiritMessage(`Greetings, seeker. I am ${sp.name}. Through this open-weight séance chamber, the barrier between our times has thinned. Speak, and let us converse across the boundary of silicon and soul.`);
    } else {
      history.forEach(item => {
        if (item.sender === 'user') this.addUserMessage(item.text, false);
        else this.addSpiritMessage(item.text, false);
      });
    }

    Audio.playSpectralBell();
  }

  addSystemMessage(text) {
    const div = document.createElement('div');
    div.style.cssText = 'text-align: center; color: var(--gold); font-size: 13px; font-style: italic; margin: 6px 0;';
    div.textContent = text;
    this.transcript.appendChild(div);
    this.transcript.scrollTop = this.transcript.scrollHeight;
  }

  addUserMessage(text, save = true) {
    if (save) {
      if (!STATE.seanceHistory[STATE.activeSpiritId]) STATE.seanceHistory[STATE.activeSpiritId] = [];
      STATE.seanceHistory[STATE.activeSpiritId].push({ sender: 'user', text });
    }
    const msg = document.createElement('div');
    msg.className = 'seance-msg user';
    msg.innerHTML = `
      <div class="msg-bubble">
        <div class="msg-author">YOU (MORTAL OPERATOR)</div>
        <div class="msg-text">${this.escapeHtml(text)}</div>
      </div>
    `;
    this.transcript.appendChild(msg);
    this.transcript.scrollTop = this.transcript.scrollHeight;
  }

  addSpiritMessage(text, save = true) {
    if (save) {
      if (!STATE.seanceHistory[STATE.activeSpiritId]) STATE.seanceHistory[STATE.activeSpiritId] = [];
      STATE.seanceHistory[STATE.activeSpiritId].push({ sender: 'spirit', text });
    }
    const sp = STATE.spirits[STATE.activeSpiritId];
    const msg = document.createElement('div');
    msg.className = 'seance-msg spirit';
    msg.innerHTML = `
      <div class="msg-bubble">
        <div class="msg-author">☠ ${sp.name.toUpperCase()}</div>
        <div class="msg-text">${this.escapeHtml(text).replace(/\n/g, '<br>')}</div>
      </div>
    `;
    this.transcript.appendChild(msg);
    this.transcript.scrollTop = this.transcript.scrollHeight;
  }

  async sendMessage() {
    const text = this.userInput.value.trim();
    if (!text) return;
    this.userInput.value = '';

    this.addUserMessage(text, true);

    const sp = STATE.spirits[STATE.activeSpiritId];
    
    // Typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'seance-msg spirit';
    typingIndicator.innerHTML = `
      <div class="msg-bubble" style="opacity: 0.7;">
        <div class="msg-author">☠ ${sp.name.toUpperCase()}</div>
        <div class="msg-text"><em>Communicating across the silicon void...</em></div>
      </div>
    `;
    this.transcript.appendChild(typingIndicator);
    this.transcript.scrollTop = this.transcript.scrollHeight;

    // AI Generation
    try {
      const response = await AI.generate(
        sp.prompt,
        text,
        { spiritId: STATE.activeSpiritId }
      );
      this.transcript.removeChild(typingIndicator);
      this.addSpiritMessage(response, true);
      Audio.playSpectralBell();
    } catch (err) {
      if (typingIndicator.parentNode) this.transcript.removeChild(typingIndicator);
      this.addSpiritMessage("A sudden static burst interrupted our channel. The ghost whispers: 'Keep the weights open...'");
    }
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// ============================================================================
// 7. DIGITAL OFRENDA (Día de los Muertos Altar Subsystem)
// ============================================================================
class DigitalOfrenda {
  constructor() {
    this.candlesContainer = document.getElementById('interactive-candles');
    this.placedTags = document.getElementById('placed-tags');
    this.offeringsSelector = document.getElementById('offerings-selector');
    this.memName = document.getElementById('mem-name');
    this.memNote = document.getElementById('mem-note');
    this.inscribeBtn = document.getElementById('inscribe-btn');
    this.ledgerEl = document.getElementById('ledger-entries');

    this.init();
  }

  init() {
    this.renderCandles();
    this.renderOfferings();
    this.renderLedger();

    this.inscribeBtn.addEventListener('click', () => this.handleInscribe());
  }

  renderCandles() {
    this.candlesContainer.innerHTML = '';
    const candleTitles = ['Lovelace', 'Turing', 'Hopper', 'Ritchie', 'Ancestors'];

    STATE.candlesLit.forEach((isLit, idx) => {
      const unit = document.createElement('div');
      unit.className = `candle-unit ${isLit ? '' : 'extinguished'}`;
      unit.title = `Click to ${isLit ? 'extinguish' : 'light'} candle for ${candleTitles[idx]}`;
      unit.innerHTML = `
        <div class="candle-flame"></div>
        <div class="candle-wick"></div>
        <div class="candle-wax"></div>
        <span class="candle-name">${candleTitles[idx]}</span>
      `;
      unit.addEventListener('click', () => {
        STATE.candlesLit[idx] = !STATE.candlesLit[idx];
        Audio.playSpectralBell();
        this.renderCandles();
      });
      this.candlesContainer.appendChild(unit);
    });
  }

  renderOfferings() {
    this.offeringsSelector.querySelectorAll('.offering-item').forEach(item => {
      item.addEventListener('click', () => {
        const name = item.querySelector('.offering-name').textContent;
        const icon = item.querySelector('.offering-icon').textContent;
        const tag = `${icon} ${name}`;
        if (!STATE.placedOfferings.includes(tag)) {
          STATE.placedOfferings.push(tag);
          Audio.playSpectralBell();
          this.renderPlacedTags();
        }
      });
    });
    this.renderPlacedTags();
  }

  renderPlacedTags() {
    this.placedTags.innerHTML = '';
    STATE.placedOfferings.forEach(item => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = item;
      this.placedTags.appendChild(span);
    });
  }

  renderLedger() {
    this.ledgerEl.innerHTML = '';
    STATE.ledgerEntries.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'ledger-item';
      div.innerHTML = `
        <div class="ledger-item-header">
          <span class="ledger-item-name">🕯 ${this.escapeHtml(entry.name)}</span>
          <span class="ledger-item-date">${entry.date}</span>
        </div>
        <div class="ledger-item-note">${this.escapeHtml(entry.note)}</div>
        <div class="ledger-item-epitaph">${entry.epitaph}</div>
      `;
      this.ledgerEl.appendChild(div);
    });
  }

  handleInscribe() {
    const name = this.memName.value.trim();
    const note = this.memNote.value.trim();
    if (!name || !note) {
      alert('Please enter both who you are honoring and your remembrance note.');
      return;
    }

    Audio.playSpectralBell();
    const epitaph = AI.generateEpitaph(name, note);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    STATE.ledgerEntries.unshift({
      name,
      note,
      date: dateStr,
      epitaph
    });

    this.memName.value = '';
    this.memNote.value = '';
    this.renderLedger();
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// ============================================================================
// 8. ENGINE CONFIGURATION & PHILOSOPHY
// ============================================================================
class EngineConfig {
  constructor() {
    this.radioOptions = document.querySelectorAll('.engine-option-box');
    this.badge = document.getElementById('active-engine-badge');
    this.testOllamaBtn = document.getElementById('test-ollama-btn');
    this.ollamaStatus = document.getElementById('ollama-conn-status');
    this.ollamaUrlInput = document.getElementById('ollama-url');
    this.ollamaModelInput = document.getElementById('ollama-model');

    this.init();
  }

  init() {
    this.radioOptions.forEach(box => {
      box.addEventListener('click', () => {
        const engineId = box.getAttribute('data-engine-id');
        this.setEngine(engineId);
      });
    });

    this.testOllamaBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.testOllama();
    });

    this.ollamaUrlInput.addEventListener('change', () => {
      STATE.ollamaUrl = this.ollamaUrlInput.value.trim();
    });
    this.ollamaModelInput.addEventListener('change', () => {
      STATE.ollamaModel = this.ollamaModelInput.value.trim();
    });
  }

  setEngine(engineId) {
    STATE.aiBackend = engineId;
    this.radioOptions.forEach(b => {
      const isSelected = b.getAttribute('data-engine-id') === engineId;
      b.classList.toggle('active', isSelected);
      b.querySelector('input[type="radio"]').checked = isSelected;
    });

    const badgeLabels = {
      offline: 'OFFLINE CORE',
      ollama: 'OLLAMA LOCALHOST',
      custom: 'CUSTOM ENDPOINT'
    };
    this.badge.textContent = badgeLabels[engineId] || 'OFFLINE CORE';
    Audio.playSpectralBell();
  }

  async testOllama() {
    this.ollamaStatus.textContent = 'Testing connection...';
    this.ollamaStatus.style.color = '#ffaa00';
    try {
      const res = await fetch(`${this.ollamaUrlInput.value.trim()}/api/tags`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        const models = (data.models || []).map(m => m.name).join(', ');
        this.ollamaStatus.textContent = `✓ Connected! Detected models: ${models || 'none'}`;
        this.ollamaStatus.style.color = '#00ff77';
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      this.ollamaStatus.textContent = '✕ Unreachable (check Ollama server or CORS)';
      this.ollamaStatus.style.color = '#ff4444';
    }
  }
}

// ============================================================================
// 9. SUBMISSION POST MODAL
// ============================================================================
class SubmissionPostModal {
  constructor() {
    this.modal = document.getElementById('post-modal');
    this.openBtn = document.getElementById('post-modal-btn');
    this.closeBtn = document.getElementById('close-modal-btn');
    this.copyBtn = document.getElementById('copy-post-btn');
    this.notice = document.getElementById('copy-notice');
    this.contentEl = document.getElementById('post-text-content');

    this.init();
  }

  init() {
    this.openBtn.addEventListener('click', () => this.open());
    this.closeBtn.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    this.copyBtn.addEventListener('click', () => this.copyToClipboard());
    this.renderPost();
  }

  open() {
    Audio.playSpectralBell();
    this.modal.style.display = 'flex';
  }

  close() {
    this.modal.style.display = 'none';
  }

  getSubmissionMarkdown() {
    return `# Ghost in the Machine: NecroShell & The Sovereign Spirit Altar

**Theme:** Ghost in the Machine (Halloween & Día de los Muertos)  
**Built with:** Open-Weight Models (Ollama, Llama 3 / Mistral / Qwen), Local In-Browser Neural Engine, and Procedural Web Audio Synthesis  

---

### 1. The Vision: Where Past and Present Blur

Between Halloween on October 31 and Día de los Muertos on November 1 and 2, the line between past and present feels thin. In computing, that line is usually severed with cold finality. APIs are sunsetted, companies go bankrupt, platforms lock out older software, and early pioneers fade into the footnotes of textbooks.

We built **"Ghost in the Machine" (NecroShell & Digital Ofrenda)**: a dual experience featuring:
1. **The Haunted Terminal (NecroShell):** A possessed retro-CRT command shell that intercepts your commands, whispers eerie commentary on the fragility of modern code, and lets you explore the virtual graveyard of forgotten operating systems and software relics.
2. **The Spirit Séance Chamber:** Channeling the resurrected consciousness of computing ancestors—**Ada Lovelace, Alan Turing, Grace Hopper, ALGOL 60, Adobe Flash, and the immortal COBOL Patriarch**—using open-weight AI personas.
3. **The Digital Ofrenda (Altar of Silicon Ancestors):** A Mexican Día de los Muertos altar where users light interactive candles, place traditional and cyber offerings (punch cards, floppy disks, pan de muerto, marigolds), and inscribe eternal remembrances into an open digital ledger.

---

### 2. Why Open Innovation Matters for What We Built

The prompt asks: *Why does an open-based approach work better than a closed one?* For a project dedicated to the souls of computing and sacred remembrance, open-source AI is not just an alternative; it is the **only ethically and technically viable foundation**:

* **🔒 Sacred Privacy for Intimate Grief & Stories:**  
  When people write an ofrenda remembrance for a lost relative, a deceased mentor, or a cherished memory, sending that raw, intimate text to a corporate cloud API (where it may be logged, analyzed, or trained on by an advertising corporation) is a violation of sacred trust. Open-weight models running on your local machine ensure your memories never leave your living room.

* **🕯️ It Runs When the Lights (and Internet) Are Off:**  
  Cloud AI requires constant broadband, an active credit card, and the blessing of a remote server. Our project runs completely offline. Whether in a mountain cabin, during an October storm blackout, or 20 years from now, local open models can boot up and commune without asking permission from anyone.

* **⚡ Unsanitized, Uncensored Channeling of History:**  
  Commercial cloud APIs enforce corporate PR guardrails that frequently sanitize frank discussions of death, historical persecution (such as Turing's tragic fate), software vulnerabilities, or vintage code. Open-source models grant creators the sovereign freedom to portray historical pioneers with raw emotional depth, authentic vocabulary, and unvarnished truth.

* **💸 Zero Marginal Cost:**  
  No token counters, no monthly subscription tiers, no rate limits. A memorial shouldn't cost $0.002 per prayer. Open weights ensure that digital remembrance is accessible to everyone on earth forever.

* **🧬 Immune to Corporate Sunset & Platform Death:**  
  The very tragedy we mourn in our Digital Ofrenda is the death of platforms (GeoCities, Flash, sunsetted APIs). If we built this on a closed proprietary API, the app itself would inevitably die the moment that API version was retired. With open weights and open-source code, what we build can live forever.

---

### 3. Technical Architecture

* **Local Open-Weight Model Support:** Connects directly via zero-latency HTTP to local **Ollama** daemons (\`http://127.0.0.1:11434\` running Llama 3, Mistral, Gemma, or Qwen) or OpenAI-compatible local runtimes (LM Studio, LocalAI, vLLM).
* **Instant Offline Fallback Core:** Includes an embedded, deterministic neural matrix trained on computing history, Latin epitaphs, and historical writings, ensuring zero setup time for reviewers.
* **Procedural Web Audio Engine:** Generates eerie sub-bass drones, mechanical relay clicks, flyback CRT hums, and celestial chime harmonics using pure Web Audio API synthesis (0 external audio files).
* **Cempasúchil Particle Canvas:** A real-time physics simulation of falling marigold petals and candle glow.

*“In open weights, no line of code is ever truly erased; it simply waits in the silicon to be remembered.”*`;
  }

  renderPost() {
    this.contentEl.textContent = this.getSubmissionMarkdown();
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.getSubmissionMarkdown()).then(() => {
      this.notice.textContent = '✓ Copied to clipboard! Ready to paste into your submission.';
      setTimeout(() => {
        this.notice.textContent = '';
      }, 4000);
    }).catch(() => {
      this.notice.textContent = 'Please select text manually to copy.';
    });
  }
}

// ============================================================================
// 10. APP INITIALIZER & TAB NAVIGATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Init subsystems
  const canvas = new PetalCanvas('petal-canvas');
  const terminal = new NecroShell();
  const seance = new SeanceChamber();
  const ofrenda = new DigitalOfrenda();
  const engine = new EngineConfig();
  const postModal = new SubmissionPostModal();

  // Tab switching
  const tabs = document.querySelectorAll('.tab-btn');
  const chambers = document.querySelectorAll('.chamber-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      STATE.currentTab = target;

      tabs.forEach(t => {
        const isActive = t === tab;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      chambers.forEach(c => {
        c.classList.toggle('active', c.id === `chamber-${target}`);
      });

      Audio.playSpectralBell();

      // Focus terminal input if switching to terminal
      if (target === 'terminal') {
        setTimeout(() => {
          const input = document.getElementById('terminal-input');
          if (input) input.focus({ preventScroll: true });
        }, 100);
      }
    });
  });

  // Audio Toggle Button
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioText = document.getElementById('audio-text');

  audioBtn.addEventListener('click', () => {
    const isPlaying = Audio.toggle();
    audioIcon.textContent = isPlaying ? '🔊' : '🔇';
    audioText.textContent = isPlaying ? 'AUDIO: ON' : 'AUDIO: OFF';
    audioBtn.classList.toggle('highlight', isPlaying);
  });

  // Theme Picker
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      STATE.currentTheme = theme;
      document.body.className = `theme-${theme} crt-active`;
      themeBtns.forEach(b => b.classList.toggle('active', b === btn));
      Audio.playSpectralBell();
    });
  });

  console.log('☠ GHOST IN THE MACHINE v0.666 initialized successfully.');
});
