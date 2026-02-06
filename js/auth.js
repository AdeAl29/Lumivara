const Auth = (() => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const resetDemoBtn = document.getElementById("resetDemoBtn");

  const showMessage = (element, message, isError = true) => {
    if (!element) return;
    element.textContent = message;
    element.style.color = isError ? "var(--danger)" : "var(--success)";
  };

  const validateLogin = (username, password) => {
    const users = Storage.getUsers();
    return users.find((user) => user.username === username && user.password === password);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    if (!username || !password) {
      showMessage(message, "Please fill out all fields.");
      return;
    }

    const user = validateLogin(username, password);
    if (!user) {
      showMessage(message, "Invalid credentials.");
      return;
    }

    Storage.setCurrentUser(username);
    showMessage(message, "Login successful!", false);
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 600);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("registerConfirm").value;
    const message = document.getElementById("registerMessage");

    if (!username || !password || !confirm) {
      showMessage(message, "Please fill out all fields.");
      return;
    }

    if (password !== confirm) {
      showMessage(message, "Passwords do not match.");
      return;
    }

    const users = Storage.getUsers();
    if (users.some((user) => user.username === username)) {
      showMessage(message, "Username already exists.");
      return;
    }

    users.push({
      username,
      password,
      level: 1,
      xp: 0,
      achievements: [],
    });
    Storage.setUsers(users);
    Storage.setCurrentUser(username);
    showMessage(message, "Account created!", false);
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 600);
  };

  const handleLogout = () => {
    Storage.setCurrentUser(null);
    window.location.href = "index.html";
  };

  const protectPages = () => {
    const current = Storage.getCurrentUser();
    const onProtectedPage = document.body.classList.contains("dashboard") || document.body.classList.contains("chat");
    if (onProtectedPage && !current) {
      window.location.href = "login.html";
    }
  };

  const applyUserUi = (user) => {
    const welcome = document.getElementById("welcomeMessage");
    if (welcome) welcome.textContent = `Welcome, ${user.username}`;

    const level = document.getElementById("userLevel");
    if (level) level.textContent = user.level;

    const xp = document.getElementById("userXp");
    if (xp) xp.textContent = user.xp;

    const fill = document.getElementById("xpFill");
    if (fill) fill.style.width = `${user.xp % 100}%`;

    const avatar = document.getElementById("sidebarAvatar");
    if (avatar) avatar.textContent = user.username.charAt(0).toUpperCase();

    const sidebarName = document.getElementById("sidebarUserName");
    if (sidebarName) sidebarName.textContent = user.username;

    const activeName = document.getElementById("activeUserName");
    if (activeName) activeName.textContent = user.username;

    const currentUserName = document.getElementById("currentUserName");
    if (currentUserName) currentUserName.textContent = user.username;

    const currentUserAvatar = document.getElementById("currentUserAvatar");
    if (currentUserAvatar) currentUserAvatar.textContent = user.username.charAt(0).toUpperCase();

    const currentUserStatus = document.getElementById("currentUserStatus");
    if (currentUserStatus) currentUserStatus.textContent = "Active now";
  };

  const refreshUserUi = () => {
    const current = Storage.getCurrentUser();
    if (!current) return;
    const users = Storage.getUsers();
    const user = users.find((entry) => entry.username === current);
    if (user) applyUserUi(user);
  };

  const initDashboard = () => {
    if (!document.body.classList.contains("dashboard")) return;
    const current = Storage.getCurrentUser();
    const users = Storage.getUsers();
    const user = users.find((entry) => entry.username === current);
    if (!user) return;
    applyUserUi(user);
  };

  const initChatHeader = () => {
    if (!document.body.classList.contains("chat")) return;
    const current = Storage.getCurrentUser();
    const users = Storage.getUsers();
    const user = users.find((entry) => entry.username === current);
    if (!user) return;
    applyUserUi(user);
  };

  const bindEvents = () => {
    if (loginForm) loginForm.addEventListener("submit", handleLogin);
    if (registerForm) registerForm.addEventListener("submit", handleRegister);
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener("click", () => {
        const confirmed = window.confirm("Reset demo data? This will clear local storage.");
        if (!confirmed) return;
        Storage.resetAll();
        window.location.href = "index.html";
      });
    }
  };

  const init = () => {
    protectPages();
    bindEvents();
    initDashboard();
    initChatHeader();
    const settings = Storage.getSettings ? Storage.getSettings() : null;
    if (settings) {
      document.body.classList.toggle("no-animations", !settings.animations);
      document.body.classList.toggle("compact", settings.compact);
    }
  };

  return { init, refreshUserUi };
})();

document.addEventListener("DOMContentLoaded", Auth.init);
