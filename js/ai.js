const LumiAI = (() => {
  const knowledgeBase = [
    {
      keywords: ["algebra", "factor", "equation", "quadratic"],
      ask: [
        "Start by identifying coefficients, then use factoring or the quadratic formula.",
        "Try writing the equation in standard form, then look for two numbers that multiply and add correctly.",
      ],
      explain: [
        "Think of a quadratic like a U-shaped curve. Factoring finds where it touches the x-axis.",
        "A quadratic equation is just a curved relationship; solving it means finding the input values that give zero.",
      ],
    },
    {
      keywords: ["chemistry", "mole", "stoichiometry", "reaction"],
      ask: [
        "Balance the equation first, then use mole ratios to convert between substances.",
        "Write knowns and unknowns, then follow the units step by step until you reach the target.",
      ],
      explain: [
        "Stoichiometry is just a recipe: coefficients show how much of each ingredient you need.",
        "A mole is a counting unit, like a dozen, but for atoms and molecules.",
      ],
    },
    {
      keywords: ["biology", "cell", "mitosis", "dna"],
      ask: [
        "Focus on the sequence: interphase, prophase, metaphase, anaphase, telophase.",
        "DNA replication happens before division so each daughter cell gets the same genetic info.",
      ],
      explain: [
        "Mitosis is how one cell becomes two identical cells through a set of organized steps.",
        "DNA is a set of instructions; mitosis is how cells copy and share that instruction manual.",
      ],
    },
    {
      keywords: ["history", "revolution", "independence", "timeline"],
      ask: [
        "Create a mini timeline with causes, key events, and outcomes to keep it clear.",
        "Link events to motivations; it helps you remember why each step happened.",
      ],
      explain: [
        "A revolution is a big shift in power. Focus on the causes and the turning points.",
        "Timelines turn a long story into a simple sequence you can review quickly.",
      ],
    },
    {
      keywords: ["essay", "writing", "thesis", "paragraph"],
      ask: [
        "Start with a clear thesis, then build each paragraph around one supporting idea.",
        "Draft quickly first, then revise for clarity and flow.",
      ],
      explain: [
        "A thesis is your main point; each paragraph is evidence that supports it.",
        "Good essays feel like a guided tour: point, example, and a short explanation.",
      ],
    },
    {
      keywords: ["physics", "force", "energy", "motion"],
      ask: [
        "Draw a quick diagram and label forces; it makes the equations easier.",
        "Use energy conservation when forces are hard to track.",
      ],
      explain: [
        "Force is a push or pull; energy is the ability to do work.",
        "Motion describes how position changes over time, often using speed and acceleration.",
      ],
    },
    {
      keywords: ["calculus", "derivative", "integral", "limit"],
      ask: [
        "Derivatives measure change; focus on the slope idea before formulas.",
        "Integrals add up tiny pieces. Sketch the area to see what the answer means.",
      ],
      explain: [
        "A derivative is the slope of a curve at a point.",
        "An integral is the total accumulation of many small parts.",
      ],
    },
    {
      keywords: ["coding", "javascript", "debug", "function"],
      ask: [
        "Break the problem into smaller functions and test each part.",
        "Use console logs to verify each step before moving on.",
      ],
      explain: [
        "A function is a reusable block of steps. It takes inputs and returns an output.",
        "Debugging is just checking each step until the output matches the plan.",
      ],
    },
    {
      keywords: ["language", "english", "grammar", "vocabulary"],
      ask: [
        "Learn vocabulary in context by making short example sentences.",
        "For grammar, focus on one pattern at a time and practice daily.",
      ],
      explain: [
        "Grammar is the structure of a sentence; vocabulary is the building blocks.",
        "Reading short texts helps you see grammar and vocabulary together.",
      ],
    },
    {
      keywords: ["study", "focus", "pomodoro", "time"],
      ask: [
        "Try a 25-minute focus block, then take a 5-minute break.",
        "Set a single goal per session so you feel progress quickly.",
      ],
      explain: [
        "Focus improves when tasks are small and timed. Short sprints reduce overwhelm.",
        "Pomodoro works because it balances effort with recovery.",
      ],
    },
    {
      keywords: ["geography", "map", "capital", "country"],
      ask: [
        "Group countries by region, then quiz yourself in small batches.",
        "Use blank maps and fill them in by memory for quick recall.",
      ],
      explain: [
        "Geography sticks better when you build mental anchors by region.",
        "Maps are easier when you study patterns, not just isolated points.",
      ],
    },
    {
      keywords: ["literature", "novel", "theme", "quote"],
      ask: [
        "Trace one recurring idea through key scenes to find the theme.",
        "Pair short quotes with the scene where they appear.",
      ],
      explain: [
        "Theme is the main idea the story keeps returning to.",
        "Quotes are easier to remember when tied to the moment they appear.",
      ],
    },
    {
      keywords: ["accounting", "debit", "credit", "balance sheet"],
      ask: [
        "Use the account type rule: assets and expenses increase on debits.",
        "Scan totals first, then compare changes for a quick read.",
      ],
      explain: [
        "Debits and credits are just sides of the ledger, mapped by account type.",
        "Balance sheets show what a company owns and owes at a glance.",
      ],
    },
    {
      keywords: ["psychology", "memory", "conditioning", "behavior"],
      ask: [
        "List memory types in a simple chart and review with examples.",
        "Classical conditioning is best remembered through association examples.",
      ],
      explain: [
        "Memory types are categories of how information is stored and used.",
        "Conditioning is learning by repeatedly pairing a stimulus and response.",
      ],
    },
    {
      keywords: ["data structure", "stack", "queue", "big-o"],
      ask: [
        "Use stacks for LIFO and queues for FIFO problems.",
        "Connect big-O to operations so it feels concrete.",
      ],
      explain: [
        "Stacks are LIFO, queues are FIFO. Think plates vs lines.",
        "Big-O is how time grows as input size increases.",
      ],
    },
    {
      keywords: ["ux", "ui", "layout", "onboarding"],
      ask: [
        "Keep spacing consistent and align to a simple grid.",
        "Onboarding should be short and show value fast.",
      ],
      explain: [
        "Balanced layouts come from consistent spacing and alignment.",
        "Good onboarding teaches one thing at a time.",
      ],
    },
  ];

  const generalAnswers = [
    "Let's break it into steps and start with the fundamentals.",
    "Try connecting this concept to a real-life example to remember it.",
    "Focus on the core definition first, then expand with practice questions.",
  ];

  const generalExplains = [
    "Think of it like building blocks: each small part supports the next.",
    "A simple way to see it is like a recipe: small steps combine into one result.",
    "Start with the big picture, then zoom into the details one by one.",
  ];

  const randomPick = (list) => list[Math.floor(Math.random() * list.length)];

  const findTopic = (topic) => {
    if (!topic) return null;
    const text = topic.toLowerCase();
    return knowledgeBase.find((entry) => entry.keywords.some((key) => text.includes(key)));
  };

  const summarize = (messages) => {
    if (!messages || messages.length === 0) {
      return "Summary: No recent messages yet. Start a discussion and I will summarize it.";
    }

    const recent = messages.slice(-8);
    const participants = Array.from(new Set(recent.map((msg) => msg.author))).filter(
      (name) => name !== "Lumi"
    );
    const text = recent.map((msg) => msg.text.toLowerCase()).join(" ");
    const topics = knowledgeBase
      .filter((entry) => entry.keywords.some((key) => text.includes(key)))
      .map((entry) => entry.keywords[0]);
    const topicLine = topics.length ? `Focus: ${topics.slice(0, 2).join(", ")}.` : "Focus: study planning.";

    return `Summary: ${participants.join(", ") || "Learners"} shared updates and asked questions. ${topicLine}`;
  };

  const respond = (command, topic, contextMessages = []) => {
    const matched = findTopic(topic);
    switch (command) {
      case "ask":
        return matched ? randomPick(matched.ask) : randomPick(generalAnswers);
      case "summary":
        return summarize(contextMessages);
      case "explain":
        return matched ? randomPick(matched.explain) : randomPick(generalExplains);
      default:
        return "I'm here to help. Try /ask, /summary, or /explain.";
    }
  };

  return { respond };
})();
