const Leaderboard = (() => {
  const table = document.getElementById("leaderboardTable");

  const render = () => {
    if (!table) return;
    const users = Storage.getUsers();
    if (!users.length) {
      table.innerHTML = "<p class=\"subtext\">No data yet. Start chatting to earn XP.</p>";
      return;
    }

    const rows = [...users].sort((a, b) => b.xp - a.xp).slice(0, 10);
    table.innerHTML = `
      <div class="table-row table-head">
        <span>#</span>
        <span>User</span>
        <span>Level</span>
        <span>XP</span>
      </div>
      ${rows
        .map(
          (user, index) => `
        <div class="table-row">
          <span>${index + 1}</span>
          <span>${user.username}</span>
          <span>${user.level}</span>
          <span>${user.xp}</span>
        </div>
      `
        )
        .join("")}
    `;
  };

  const init = () => {
    if (!document.body.classList.contains("leaderboard")) return;
    render();
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", Leaderboard.init);
