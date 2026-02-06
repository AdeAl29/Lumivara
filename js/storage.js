const Storage = (() => {
  const KEYS = {
    USERS: "lumivara_users",
    CURRENT: "lumivara_current_user",
    MESSAGES: "lumivara_messages",
  };

  const load = (key, fallback) => {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (err) {
      console.warn("Failed to parse", key, err);
      return fallback;
    }
  };

  const save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getUsers = () => load(KEYS.USERS, []);
  const setUsers = (users) => save(KEYS.USERS, users);

  const getCurrentUser = () => load(KEYS.CURRENT, null);
  const setCurrentUser = (username) => save(KEYS.CURRENT, username);

  const getMessages = () => load(KEYS.MESSAGES, []);
  const setMessages = (messages) => save(KEYS.MESSAGES, messages);

  return {
    KEYS,
    getUsers,
    setUsers,
    getCurrentUser,
    setCurrentUser,
    getMessages,
    setMessages,
  };
})();
