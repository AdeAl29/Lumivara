const Gamification = (() => {
  const achievementList = [
    {
      id: "first_message",
      title: "First Message",
      detail: "Send your first chat message.",
    },
    {
      id: "xp_50",
      title: "50 XP Milestone",
      detail: "Reach 50 XP.",
    },
    {
      id: "first_ai",
      title: "First AI Usage",
      detail: "Try a Lumi command.",
    },
  ];

  const getUser = () => {
    const current = Storage.getCurrentUser();
    const users = Storage.getUsers();
    return users.find((entry) => entry.username === current);
  };

  const updateUser = (user) => {
    const users = Storage.getUsers();
    const index = users.findIndex((entry) => entry.username === user.username);
    if (index === -1) return;
    users[index] = user;
    Storage.setUsers(users);
  };

  const showToast = (message) => {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2400);
  };

  const addXp = (amount, trigger) => {
    const user = getUser();
    if (!user) return;
    user.xp += amount;
    const newLevel = Math.floor(user.xp / 100) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
      showToast(`Level up! You reached level ${user.level}.`);
    }
    updateUser(user);
    checkAchievements(user, trigger);
    refreshUi(user);
  };

  const checkAchievements = (user, trigger) => {
    const unlocked = new Set(user.achievements);

    if (trigger === "message" && !unlocked.has("first_message")) {
      unlocked.add("first_message");
      showToast("Achievement unlocked: First Message");
    }

    if (user.xp >= 50 && !unlocked.has("xp_50")) {
      unlocked.add("xp_50");
      showToast("Achievement unlocked: 50 XP Milestone");
    }

    if (trigger === "ai" && !unlocked.has("first_ai")) {
      unlocked.add("first_ai");
      showToast("Achievement unlocked: First AI Usage");
    }

    user.achievements = Array.from(unlocked);
    updateUser(user);
  };

  const renderAchievements = () => {
    const container = document.getElementById("achievementList");
    if (!container) return;
    const user = getUser();
    if (!user) return;
    container.innerHTML = "";
    achievementList.forEach((achievement) => {
      const hasAchievement = user.achievements.includes(achievement.id);
      const card = document.createElement("div");
      card.className = "badge";
      card.innerHTML = `
        <h4>${achievement.title}</h4>
        <span>${achievement.detail}</span>
        <span>${hasAchievement ? "Unlocked" : "Locked"}</span>
      `;
      container.appendChild(card);
    });
  };

  const refreshUi = (user = getUser()) => {
    if (!user) return;
    const levelEl = document.getElementById("userLevel");
    const xpEl = document.getElementById("userXp");
    if (levelEl) levelEl.textContent = user.level;
    if (xpEl) xpEl.textContent = user.xp;
    const fill = document.getElementById("xpFill");
    if (fill) fill.style.width = `${user.xp % 100}%`;
    renderAchievements();
  };

  const init = () => {
    renderAchievements();
    refreshUi();
  };

  return {
    addXp,
    init,
    showToast,
  };
})();

document.addEventListener("DOMContentLoaded", Gamification.init);
