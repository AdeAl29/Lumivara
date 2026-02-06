
const Chat = (() => {
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatMessages = document.getElementById("chatMessages");
  const loader = document.getElementById("loader");
  const typingStatus = document.getElementById("currentUserStatus");
  const activeUserSelect = document.getElementById("activeUserSelect");
  const addDemoUserBtn = document.getElementById("addDemoUserBtn");
  const sidebarRooms = document.getElementById("sidebarRooms");
  const sidebarDm = document.getElementById("sidebarDm");
  const replyPreview = document.getElementById("replyPreview");
  const replyAuthor = document.getElementById("replyAuthor");
  const replyText = document.getElementById("replyText");
  const cancelReplyBtn = document.getElementById("cancelReplyBtn");
  const attachBtn = document.getElementById("attachBtn");
  const fileInput = document.getElementById("fileInput");
  const roomTitle = document.getElementById("roomTitle");
  const roomTopic = document.getElementById("roomTopic");
  const roomMode = document.getElementById("roomMode");
  let typingTimer;
  let replyTarget = null;

  const peers = ["Alya", "Ravi", "Mina", "Jude", "Niko", "Sora", "Isha", "Ken", "Dina", "Tari"];
  const demoNames = ["Luna", "Kai", "Zara", "Felix", "Nala", "Arlo", "Mira", "Vera", "Theo", "Noah"];
  const personaMap = {
    Alya: "Mentor",
    Ravi: "Analyst",
    Mina: "Calm Focus",
    Jude: "Sprinter",
    Niko: "Practical",
    Sora: "Creative",
    Isha: "Encourager",
    Ken: "Debugger",
    Dina: "Organizer",
    Tari: "Note-taker",
  };

  const seedTopics = [
    {
      topic: "algebra",
      keywords: ["algebra", "factor", "quadratic", "equation", "polynomial"],
      questions: [
        "I'm stuck on factoring x^2 + 5x + 6. Any quick trick?",
        "How do I spot factors for a quadratic fast?",
      ],
      human: [
        "Look for two numbers that multiply to 6 and add to 5. That's 2 and 3.",
        "Write it as (x + a)(x + b). You want a + b = 5 and ab = 6.",
      ],
      lumi: [
        "Try rewriting as x^2 + 2x + 3x + 6, then factor by grouping.",
        "For x^2 + 5x + 6, the factors are (x + 2)(x + 3).",
      ],
      followups: [
        "Got it. The grouping trick makes sense now.",
        "Nice, that was quicker than I expected. Thanks!",
      ],
      peerReplies: [
        "Try factoring by grouping. It usually clicks after one example.",
        "If the coefficient is 1, search for a pair that multiplies and adds.",
      ],
    },
    {
      topic: "chemistry",
      keywords: ["chemistry", "mole", "stoichiometry", "reaction", "balance"],
      questions: [
        "Can someone explain how to use mole ratios from a balanced equation?",
        "I keep mixing up grams and moles. What's a good workflow?",
      ],
      human: [
        "Balance first, then use the coefficients as ratios. Convert units step by step.",
        "Write what you have and what you want, then do conversions in a chain.",
      ],
      lumi: [
        "Think of the equation as a recipe. The coefficients are the recipe amounts.",
        "Use dimensional analysis so the units cancel cleanly until you reach the target.",
      ],
      followups: [
        "Recipe analogy helped a lot. I'll practice conversions.",
        "Okay, I'll line up the units to see it clearly.",
      ],
      peerReplies: [
        "Once it is balanced, the coefficients are your roadmap.",
        "Set up a conversion chain so each unit cancels cleanly.",
      ],
    },
    {
      topic: "biology",
      keywords: ["biology", "cell", "mitosis", "dna"],
      questions: [
        "What's the easiest way to remember the stages of mitosis?",
        "Do you have a short summary of cell division?",
      ],
      human: [
        "I use the mnemonic PMAT: prophase, metaphase, anaphase, telophase.",
        "Just remember it goes from DNA prep to division, then cytokinesis.",
      ],
      lumi: [
        "PMAT works well. Visualize chromosomes lining up and splitting apart.",
        "Each stage is just moving and separating copied chromosomes.",
      ],
      followups: [
        "PMAT is easy to keep in mind. Thanks.",
        "That makes it less scary. Appreciate it.",
      ],
      peerReplies: [
        "PMAT plus a quick sketch helps it stick.",
        "Think of it like tidy steps: prep, line up, split, finish.",
      ],
    },
    {
      topic: "history",
      keywords: ["history", "timeline", "revolution", "independence"],
      questions: [
        "How should I study a long timeline without forgetting dates?",
        "Any tips to remember causes vs effects in history topics?",
      ],
      human: [
        "Make a 5-point timeline and attach a short story to each event.",
        "I map causes to arrows, then write effects below them.",
      ],
      lumi: [
        "Focus on sequence and why each event happens. That anchors the dates.",
        "Use cause-effect pairs so your brain connects them as one memory.",
      ],
      followups: [
        "Story trick seems fun. I'll try it.",
        "Cause-effect chart feels doable. Thanks!",
      ],
      peerReplies: [
        "Make a mini timeline with only the big turning points.",
        "I like a cause-effect chart so each event has a reason.",
      ],
    },
    {
      topic: "essay",
      keywords: ["essay", "writing", "thesis", "paragraph"],
      questions: [
        "My essay feels messy. How do I organize paragraphs?",
        "How do I write a stronger thesis statement?",
      ],
      human: [
        "Each paragraph should have one idea with evidence. Keep it tight.",
        "A thesis should answer the prompt directly and hint your main points.",
      ],
      lumi: [
        "Try topic sentences first, then fill in proof and explanation.",
        "A strong thesis is specific and debatable, not just a fact.",
      ],
      followups: [
        "I'll rewrite with clearer topic sentences.",
        "I'll make my thesis more direct. Good call.",
      ],
      peerReplies: [
        "Topic sentence first, then one piece of evidence. Repeat per paragraph.",
        "A thesis should be one clear claim, not just a topic.",
      ],
    },
    {
      topic: "physics",
      keywords: ["physics", "force", "energy", "motion", "diagram"],
      questions: [
        "How do I decide between using force equations or energy equations?",
        "Any quick check when solving motion problems?",
      ],
      human: [
        "If forces are messy, energy is easier. If energy changes, use work-energy.",
        "Sketch the motion and label knowns. It keeps you from mixing formulas.",
      ],
      lumi: [
        "Use energy when you only care about start and end states.",
        "A free-body diagram reduces mistakes and shows the correct equation.",
      ],
      followups: [
        "Free-body diagrams are saving me now.",
        "Energy approach is way faster. Thanks.",
      ],
      peerReplies: [
        "Draw the forces first, then pick the formula.",
        "Energy is great for start-to-finish questions.",
      ],
    },
    {
      topic: "calculus",
      keywords: ["calculus", "derivative", "integral", "limit"],
      questions: [
        "How do I know when to use derivative rules vs the limit definition?",
        "Integrals still feel abstract. Any quick intuition?",
      ],
      human: [
        "Use the definition to understand, then switch to rules for speed.",
        "Think of integrals as stacking tiny rectangles to get total area.",
      ],
      lumi: [
        "Limit definition shows why the rule works. Use it to build intuition.",
        "An integral is accumulation. Imagine filling a container with small drops.",
      ],
      followups: [
        "Limit definition makes more sense now.",
        "Accumulation analogy helps. I'll keep that in mind.",
      ],
      peerReplies: [
        "Definition for understanding, rules for practice speed.",
        "Integrals are just adding tiny slices.",
      ],
    },
    {
      topic: "programming",
      keywords: ["coding", "javascript", "debug", "function", "bug"],
      questions: [
        "My JS function is not running. Where should I start debugging?",
        "How do I break down a big coding task?",
      ],
      human: [
        "Check the console first, then add logs before each step.",
        "Split into smaller functions and test each one with fake data.",
      ],
      lumi: [
        "Start from inputs, confirm each step, and verify outputs.",
        "Write a tiny prototype, then expand it gradually.",
      ],
      followups: [
        "Console logs are my best friend now.",
        "Breaking it into smaller parts is helping a lot.",
      ],
      peerReplies: [
        "Console first, then log each step.",
        "Split tasks into tiny functions and test them quickly.",
      ],
    },
    {
      topic: "language",
      keywords: ["language", "english", "grammar", "vocabulary"],
      questions: [
        "How can I remember new vocabulary faster?",
        "Any tips for grammar without getting bored?",
      ],
      human: [
        "Use the words in sentences and review them the next day.",
        "Practice one grammar pattern and write a short paragraph with it.",
      ],
      lumi: [
        "Link each word to a mental image and a sentence.",
        "Short daily practice beats long sessions once a week.",
      ],
      followups: [
        "Sentence practice sounds good. I'll do that.",
        "Daily mini practice feels doable.",
      ],
      peerReplies: [
        "Make two sentences per new word and review tomorrow.",
        "One grammar pattern per day keeps it fun.",
      ],
    },
    {
      topic: "study",
      keywords: ["study", "focus", "pomodoro", "time", "plan"],
      questions: [
        "How do you stay focused when you feel tired?",
        "What is a realistic study plan for busy weeks?",
      ],
      human: [
        "I do 25-minute sprints with water breaks in between.",
        "Pick 2 main tasks per day so you don't overload yourself.",
      ],
      lumi: [
        "Short focus blocks plus a clear goal keep momentum strong.",
        "Plan smaller goals and review them weekly to adjust.",
      ],
      followups: [
        "I'll try 25-minute sprints today.",
        "Two main tasks per day sounds manageable.",
      ],
      peerReplies: [
        "Short sprints plus a single goal really helps.",
        "Two key tasks per day keeps it realistic.",
      ],
    },
    {
      topic: "statistics",
      keywords: ["statistics", "mean", "median", "box plot"],
      questions: [
        "What's the difference between mean and median in real life?",
        "How do I read box plots quickly?",
      ],
      human: [
        "Mean can be pulled by outliers, median shows the middle.",
        "Look at the middle line for median and the box for spread.",
      ],
      lumi: [
        "Median is often better for skewed data. Mean is better for balanced data.",
        "Box plots show distribution at a glance: center, spread, and outliers.",
      ],
      followups: [
        "Median makes more sense for skewed cases. Thanks.",
        "Box plots feel clearer now.",
      ],
      peerReplies: [
        "Mean is sensitive to outliers, median is more stable.",
        "Box plot: center line is median, box is middle 50 percent.",
      ],
    },
    {
      topic: "economics",
      keywords: ["economics", "supply", "demand", "inflation"],
      questions: [
        "How do I remember supply and demand shifts?",
        "What's a quick way to explain inflation?",
      ],
      human: [
        "I draw the axes and label shifts right for increase, left for decrease.",
        "Inflation is when prices rise and money buys less.",
      ],
      lumi: [
        "Keep price and quantity axes consistent, then move the curve as needed.",
        "Inflation is a general rise in prices across many goods.",
      ],
      followups: [
        "Drawing axes helps. I'll stick to that.",
        "Simple inflation definition finally clicked.",
      ],
      peerReplies: [
        "Shift right for increase, left for decrease. Keep the axes fixed.",
        "Inflation just means money buys less over time.",
      ],
    },
    {
      topic: "design",
      keywords: ["design", "color", "layout", "spacing"],
      questions: [
        "How do I choose colors that feel calm?",
        "Any tip to keep a UI layout clean?",
      ],
      human: [
        "Pick one main color, then soften it with light tints.",
        "Use consistent spacing and align everything to a grid.",
      ],
      lumi: [
        "Limit the palette and use neutral backgrounds to make accents pop.",
        "Whitespace is your friend. It creates breathing room.",
      ],
      followups: [
        "Less colors, more balance. Got it.",
        "I'll respect the grid more from now on.",
      ],
      peerReplies: [
        "Use one accent color and a lot of neutral space.",
        "Spacing consistency makes layouts look instantly cleaner.",
      ],
    },
    {
      topic: "geography",
      keywords: ["geography", "map", "capital", "country"],
      questions: [
        "How do you remember capital cities without mixing them up?",
        "Any trick to study maps faster?",
      ],
      human: [
        "Group by region and quiz yourself with small batches.",
        "Make a blank map and fill it in from memory.",
      ],
      lumi: [
        "Chunking by region helps your brain create anchors.",
        "Use color coding for regions, then recall with quick reviews.",
      ],
      followups: [
        "Batching by region makes sense. I'll try it.",
        "Blank maps sound helpful. I'll print one.",
      ],
      peerReplies: [
        "Group by region and drill a few at a time.",
        "Blank maps are the fastest way to test recall.",
      ],
    },
    {
      topic: "literature",
      keywords: ["literature", "novel", "theme", "quote"],
      questions: [
        "How do I analyze theme without overthinking?",
        "Any tips for remembering quotes for exams?",
      ],
      human: [
        "Pick one recurring idea and trace it through key scenes.",
        "Use short quote fragments and pair them with scenes.",
      ],
      lumi: [
        "Theme is the big idea the story keeps returning to. Look for repetition.",
        "Remember the context of the quote; it makes recall much easier.",
      ],
      followups: [
        "Tracking repetition feels doable. Thanks!",
        "Pairing quotes with scenes will help me remember.",
      ],
      peerReplies: [
        "Follow one idea across scenes and it becomes obvious.",
        "Link quotes to where they happen so they stick.",
      ],
    },
    {
      topic: "accounting",
      keywords: ["accounting", "debit", "credit", "balance sheet"],
      questions: [
        "I keep mixing debits and credits. Any quick rule?",
        "How do you read a balance sheet faster?",
      ],
      human: [
        "Remember: assets and expenses increase on the debit side.",
        "Scan totals first, then compare changes across periods.",
      ],
      lumi: [
        "Think of debits as left, credits as right, then map each account type.",
        "Check liquidity and liabilities to get the big picture quickly.",
      ],
      followups: [
        "Left/right mapping helps. I'll drill it.",
        "Totals first makes it less overwhelming.",
      ],
      peerReplies: [
        "Assets and expenses go up on debit. Liabilities on credit.",
        "Totals first, then scan big changes.",
      ],
    },
    {
      topic: "psychology",
      keywords: ["psychology", "memory", "conditioning", "behavior"],
      questions: [
        "How can I remember the main memory types?",
        "Any simple way to explain classical conditioning?",
      ],
      human: [
        "Short-term, long-term, and working memory are the core ones.",
        "Classical conditioning is learning by association, like Pavlov's bell.",
      ],
      lumi: [
        "Use a simple chart: sensory, short-term, working, long-term.",
        "Pair a neutral cue with a response repeatedly and it becomes learned.",
      ],
      followups: [
        "Charting memory types helps a lot.",
        "Association explanation is super clear.",
      ],
      peerReplies: [
        "Make a quick chart of memory types and their roles.",
        "Conditioning is basically repeated association.",
      ],
    },
    {
      topic: "data structures",
      keywords: ["data", "structure", "stack", "queue", "big-o"],
      questions: [
        "When should I use a stack vs a queue?",
        "How do I memorize big-O without stress?",
      ],
      human: [
        "Stacks are LIFO, queues are FIFO. Think of a plate stack vs a line.",
        "Learn by comparing: arrays vs linked lists, then hash maps.",
      ],
      lumi: [
        "Use stacks for backtracking and queues for order-based processing.",
        "Big-O sticks when you pair it with the actual operation cost.",
      ],
      followups: [
        "Plate stack vs line clicked instantly. Thanks!",
        "Pairing with operations makes it less abstract.",
      ],
      peerReplies: [
        "Stacks are LIFO, queues are FIFO. Use the right mental image.",
        "Big-O is easier when you tie it to the operation you perform.",
      ],
    },
    {
      topic: "ux",
      keywords: ["ux", "ui", "layout", "onboarding"],
      questions: [
        "How do I make a layout feel balanced?",
        "What makes a good onboarding flow?",
      ],
      human: [
        "Use consistent spacing and align elements to an invisible grid.",
        "Onboarding should be short, guided, and show immediate value.",
      ],
      lumi: [
        "Balance comes from rhythm: spacing, alignment, and consistent typography.",
        "A good onboarding flow teaches one thing at a time and removes friction.",
      ],
      followups: [
        "Rhythm framing helps. I'll adjust spacing.",
        "One step at a time onboarding makes sense.",
      ],
      peerReplies: [
        "Balance is spacing + alignment + consistent typography.",
        "Onboarding should show value in the first minute.",
      ],
    },
  ];

  const fallbackReplies = [
    "That makes sense. Try breaking it into smaller steps.",
    "I would start with the basic definition, then do one example.",
    "If you want, we can outline a quick plan together.",
    "Maybe summarize the main idea in one sentence, then expand.",
  ];

  const randomPick = (list) => list[Math.floor(Math.random() * list.length)];

  const formatTime = (date = new Date()) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const makeId = () => `msg_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

  const findTopicByText = (text) => {
    if (!text) return null;
    const lower = text.toLowerCase();
    return seedTopics.find((topic) => topic.keywords.some((key) => lower.includes(key)));
  };

  const getPersona = (name) => personaMap[name] || "Learner";

  const updateUserListRole = () => {
    const currentRole = document.getElementById("currentUserRole");
    if (currentRole) currentRole.textContent = "Learner";
  };

  const setTyping = (name, isTyping) => {
    const listItem = document.querySelector(`[data-user="${name}"]`);
    if (!listItem) return;
    listItem.classList.toggle("typing", isTyping);
    const status = listItem.querySelector(".user-status");
    if (status) status.textContent = isTyping ? "Typing..." : status.getAttribute("data-default") || status.textContent;
  };

  const cacheUserStatusDefaults = () => {
    document.querySelectorAll(".user").forEach((item) => {
      const status = item.querySelector(".user-status");
      if (status && !status.getAttribute("data-default")) {
        status.setAttribute("data-default", status.textContent);
      }
    });
  };
  const schedulePeerReply = (text, roomId) => {
    const topic = findTopicByText(text);
    const responsePool = topic ? topic.peerReplies : fallbackReplies;
    const responder = peers[Math.floor(Math.random() * peers.length)];
    const delay = 900 + Math.floor(Math.random() * 800);

    setTyping(responder, true);
    setTimeout(() => {
      setTyping(responder, false);
      const message = {
        id: makeId(),
        author: responder,
        text: randomPick(responsePool),
        time: formatTime(),
      };
      saveMessage(roomId, message);
      chatMessages.appendChild(renderMessage(message));
      scrollToBottom();
    }, delay);

    if (Math.random() > 0.6) {
      const secondResponder = peers[(peers.indexOf(responder) + 2) % peers.length];
      const secondDelay = delay + 900 + Math.floor(Math.random() * 700);
      setTyping(secondResponder, true);
      setTimeout(() => {
        setTyping(secondResponder, false);
        const follow = {
          id: makeId(),
          author: secondResponder,
          text: randomPick(topic ? topic.followups : fallbackReplies),
          time: formatTime(),
        };
        saveMessage(roomId, follow);
        chatMessages.appendChild(renderMessage(follow));
        scrollToBottom();
      }, secondDelay);
    }
  };

  const getRoomId = () => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("room");
    const dmTarget = params.get("dm");
    const rooms = Storage.getRooms();
    if (dmTarget) return `dm-${dmTarget}`;
    if (requested && rooms.some((room) => room.id === requested)) return requested;
    return rooms[0]?.id || "focus-room";
  };

  const updateRoomUi = (roomId) => {
    const rooms = Storage.getRooms();
    if (roomId.startsWith("dm-")) {
      const name = roomId.replace("dm-", "");
      if (roomTitle) roomTitle.textContent = `DM with ${name}`;
      if (roomTopic) roomTopic.textContent = "Direct message";
      if (roomMode) roomMode.textContent = "Private";
      document.querySelectorAll(".room").forEach((button) => button.classList.remove("active"));
      document.querySelectorAll(".dm-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.dm === name);
      });
      return;
    }

    const room = rooms.find((item) => item.id === roomId);
    if (!room) return;
    if (roomTitle) roomTitle.textContent = room.name;
    if (roomTopic) roomTopic.textContent = room.topic;
    if (roomMode) roomMode.textContent = "Focus Mode";

    document.querySelectorAll(".room").forEach((button) => {
      button.classList.toggle("active", button.dataset.room === roomId);
    });
    document.querySelectorAll(".dm-item").forEach((item) => item.classList.remove("active"));
  };

  const renderSidebarRooms = () => {
    if (!sidebarRooms) return;
    const rooms = Storage.getRooms();
    sidebarRooms.innerHTML = rooms
      .map((room) => `<button class="room" data-room="${room.id}">${room.name}</button>`)
      .join("");
  };

  const renderDmList = () => {
    if (!sidebarDm) return;
    const current = Storage.getCurrentUser();
    const list = peers.filter((peer) => peer !== current);
    sidebarDm.innerHTML = list
      .map(
        (name) => `
        <div class="dm-item" data-dm="${name}">
          ${name}
          <span>${personaMap[name] || "Learner"}</span>
        </div>
      `
      )
      .join("");
  };

  const handleRoomNav = () => {
    document.querySelectorAll(".room").forEach((button) => {
      button.addEventListener("click", () => {
        const roomId = button.dataset.room;
        if (!roomId) return;
        window.location.href = `chat.html?room=${roomId}`;
      });
    });

    document.querySelectorAll(".dm-item").forEach((item) => {
      item.addEventListener("click", () => {
        const dm = item.dataset.dm;
        if (!dm) return;
        window.location.href = `chat.html?dm=${dm}`;
      });
    });
  };

  const generateSeedMessages = (currentUser, roomId) => {
    const messages = [];
    let timestamp = new Date();
    timestamp.setHours(8, 10, 0, 0);

    let index = 0;
    while (messages.length < 820) {
      const topic = seedTopics[index % seedTopics.length];
      const asker = peers[index % peers.length];
      const responder = peers[(index + 3) % peers.length];

      messages.push({
        id: makeId(),
        author: asker,
        text: randomPick(topic.questions),
        time: formatTime(timestamp),
      });
      timestamp = new Date(timestamp.getTime() + 1000 * 60 * 4);

      messages.push({
        id: makeId(),
        author: responder,
        text: randomPick(topic.human),
        time: formatTime(timestamp),
      });
      timestamp = new Date(timestamp.getTime() + 1000 * 60 * 3);

      messages.push({
        id: makeId(),
        author: "Lumi",
        text: randomPick(topic.lumi),
        time: formatTime(timestamp),
      });
      timestamp = new Date(timestamp.getTime() + 1000 * 60 * 2);

      if (index % 2 === 0) {
        messages.push({
          id: makeId(),
          author: currentUser,
          text: randomPick(topic.followups),
          time: formatTime(timestamp),
        });
        timestamp = new Date(timestamp.getTime() + 1000 * 60 * 2);
      }

      if (index % 3 === 0) {
        messages.push({
          id: makeId(),
          author: responder,
          text: randomPick(topic.peerReplies),
          time: formatTime(timestamp),
        });
        timestamp = new Date(timestamp.getTime() + 1000 * 60 * 2);
      }

      index += 1;
    }

    Storage.setMessages(roomId, messages.slice(0, 820));
  };

  const ensureIds = (roomId, messages) => {
    let changed = false;
    messages.forEach((message) => {
      if (!message.id) {
        message.id = makeId();
        changed = true;
      }
    });
    if (changed) Storage.setMessages(roomId, messages);
  };

  const loadMessages = (roomId) => {
    if (!chatMessages) return;
    let messages = Storage.getMessages(roomId);
    if (!messages || messages.length < 5) {
      generateSeedMessages(Storage.getCurrentUser() || "You", roomId);
      messages = Storage.getMessages(roomId);
    }

    ensureIds(roomId, messages);
    chatMessages.innerHTML = "";
    const fragment = document.createDocumentFragment();
    messages.forEach((message, idx) => fragment.appendChild(renderMessage(message, idx)));
    chatMessages.appendChild(fragment);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (!chatMessages) return;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const renderMessage = (message, index = 0) => {
    const bubble = document.createElement("div");
    const currentUser = Storage.getCurrentUser();
    const role = message.author === "Lumi" ? "lumi" : message.author === currentUser ? "self" : "peer";
    const persona = role === "peer" ? ` (${getPersona(message.author)})` : "";
    const mention = currentUser && message.text.includes(`@${currentUser}`);
    bubble.className = `chat-bubble ${role}${mention ? " mention" : ""}`;
    bubble.style.animationDelay = `${Math.min(index, 10) * 35}ms`;

    const replyMarkup = message.replyTo
      ? `<div class="reply-snippet">Replying to ${message.replyTo.author}: ${message.replyTo.text}</div>`
      : "";

    const attachmentMarkup = message.attachment
      ? `<div class="chat-attachment">?? <span>${message.attachment.name}</span> (${message.attachment.size})</div>`
      : "";

    bubble.innerHTML = `
      ${replyMarkup}
      <div>${message.text}</div>
      ${attachmentMarkup}
      <div class="chat-meta">${message.author}${persona} · ${message.time}</div>
      <button class="btn ghost small" data-reply-id="${message.id}">Reply</button>
    `;

    bubble.querySelector("button").addEventListener("click", () => setReplyTarget(message));
    return bubble;
  };

  const saveMessage = (roomId, message) => {
    const messages = Storage.getMessages(roomId);
    messages.push(message);
    Storage.setMessages(roomId, messages);
  };

  const setReplyTarget = (message) => {
    replyTarget = message;
    if (!replyPreview) return;
    replyPreview.classList.add("show");
    if (replyAuthor) replyAuthor.textContent = `Replying to ${message.author}`;
    if (replyText) replyText.textContent = message.text.slice(0, 80);
  };

  const clearReplyTarget = () => {
    replyTarget = null;
    if (!replyPreview) return;
    replyPreview.classList.remove("show");
  };

  const handleSend = (roomId) => {
    if (!messageInput) return;
    const text = messageInput.value.trim();
    if (!text) return;

    const user = Storage.getCurrentUser() || "You";
    const newMessage = {
      id: makeId(),
      author: user,
      text,
      time: formatTime(),
      replyTo: replyTarget
        ? { author: replyTarget.author, text: replyTarget.text }
        : null,
    };

    saveMessage(roomId, newMessage);
    chatMessages.appendChild(renderMessage(newMessage));
    messageInput.value = "";
    clearReplyTarget();
    scrollToBottom();

    if (text.startsWith("/")) {
      handleCommand(roomId, text);
    } else {
      Gamification.addXp(10, "message");
      schedulePeerReply(text, roomId);
    }
  };

  const handleCommand = (roomId, text) => {
    const [command, ...rest] = text.slice(1).split(" ");
    const topic = rest.join(" ").trim();

    if (loader) loader.classList.add("show");

    setTimeout(() => {
      if (loader) loader.classList.remove("show");
      const response = LumiAI.respond(command, topic, Storage.getMessages(roomId));
      const message = {
        id: makeId(),
        author: "Lumi",
        text: response,
        time: formatTime(),
      };
      saveMessage(roomId, message);
      chatMessages.appendChild(renderMessage(message));
      scrollToBottom();
      Gamification.addXp(20, "ai");
    }, 800);
  };

  const handleTyping = () => {
    if (!typingStatus) return;
    clearTimeout(typingTimer);
    if (messageInput.value.trim().length > 0) {
      typingStatus.textContent = "Typing...";
      typingTimer = setTimeout(() => {
        typingStatus.textContent = "Active now";
      }, 1200);
    } else {
      typingStatus.textContent = "Active now";
    }
  };

  const populateUserSelect = () => {
    if (!activeUserSelect) return;
    const users = Storage.getUsers();
    activeUserSelect.innerHTML = users
      .map((user) => `<option value="${user.username}">${user.username}</option>`)
      .join("");
    const current = Storage.getCurrentUser();
    if (current) activeUserSelect.value = current;
  };

  const addDemoUser = () => {
    const users = Storage.getUsers();
    const name = demoNames.find((demo) => !users.some((user) => user.username === demo));
    if (!name) return;
    users.push({
      username: name,
      password: "demo",
      level: 1,
      xp: 0,
      achievements: [],
    });
    Storage.setUsers(users);
    Storage.setCurrentUser(name);
    populateUserSelect();
    renderDmList();
    if (window.Auth && typeof window.Auth.refreshUserUi === "function") {
      window.Auth.refreshUserUi();
    }
  };

  const handleAttachment = (roomId) => {
    if (!fileInput) return;
    const file = fileInput.files?.[0];
    if (!file) return;
    const user = Storage.getCurrentUser() || "You";
    const newMessage = {
      id: makeId(),
      author: user,
      text: `Shared a file: ${file.name}`,
      time: formatTime(),
      attachment: {
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      },
    };
    saveMessage(roomId, newMessage);
    chatMessages.appendChild(renderMessage(newMessage));
    scrollToBottom();
    fileInput.value = "";
  };

  const bindEvents = (roomId) => {
    if (!sendBtn) return;
    sendBtn.addEventListener("click", () => handleSend(roomId));
    messageInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleSend(roomId);
      }
    });
    messageInput.addEventListener("input", handleTyping);

    if (activeUserSelect) {
      activeUserSelect.addEventListener("change", (event) => {
        Storage.setCurrentUser(event.target.value);
        renderDmList();
        if (window.Auth && typeof window.Auth.refreshUserUi === "function") {
          window.Auth.refreshUserUi();
        }
      });
    }

    if (addDemoUserBtn) addDemoUserBtn.addEventListener("click", addDemoUser);
    if (cancelReplyBtn) cancelReplyBtn.addEventListener("click", clearReplyTarget);

    if (attachBtn && fileInput) {
      attachBtn.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", () => handleAttachment(roomId));
    }
  };

  const bindStorage = (roomId) => {
    window.addEventListener("storage", (event) => {
      if (event.key === Storage.KEYS.MESSAGES) {
        loadMessages(roomId);
      }
    });
  };

  const init = () => {
    if (!document.body.classList.contains("chat")) return;
    const roomId = getRoomId();
    cacheUserStatusDefaults();
    updateUserListRole();
    renderSidebarRooms();
    renderDmList();
    updateRoomUi(roomId);
    handleRoomNav();
    populateUserSelect();
    loadMessages(roomId);
    bindEvents(roomId);
    bindStorage(roomId);
    handleTyping();
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", Chat.init);
