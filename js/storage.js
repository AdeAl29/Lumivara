const Storage = (() => {
  const KEYS = {
    USERS: "lumivara_users",
    CURRENT: "lumivara_current_user",
    MESSAGES: "lumivara_messages",
    ROOMS: "lumivara_rooms",
    SETTINGS: "lumivara_settings",
    PROFILES: "lumivara_profiles",
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

  const ensureRooms = () => {
    let rooms = load(KEYS.ROOMS, null);
    if (!rooms || rooms.length === 0) {
      rooms = [
        { id: "focus-room", name: "Focus Room", topic: "Deep work and calm study" },
        { id: "exam-prep", name: "Exam Prep", topic: "Revision and practice" },
        { id: "language-lab", name: "Language Lab", topic: "Vocabulary and grammar" },
        { id: "stem-support", name: "STEM Support", topic: "Math and science" },
      ];
      save(KEYS.ROOMS, rooms);
    }
    return rooms;
  };

  const getRooms = () => ensureRooms();
  const setRooms = (rooms) => save(KEYS.ROOMS, rooms);

  const getMessagesMap = () => {
    const stored = load(KEYS.MESSAGES, {});
    if (Array.isArray(stored)) {
      const migrated = { "focus-room": stored };
      save(KEYS.MESSAGES, migrated);
      return migrated;
    }
    return stored || {};
  };

  const getMessages = (roomId = "focus-room") => {
    const map = getMessagesMap();
    return map[roomId] || [];
  };

  const setMessages = (roomId, messages) => {
    const map = getMessagesMap();
    map[roomId] = messages;
    save(KEYS.MESSAGES, map);
  };

  const getSettings = () =>
    load(KEYS.SETTINGS, {
      compact: false,
      animations: true,
      sounds: false,
    });

  const setSettings = (settings) => save(KEYS.SETTINGS, settings);

  const getProfiles = () => load(KEYS.PROFILES, {});

  const getProfile = (username) => {
    const profiles = getProfiles();
    return (
      profiles[username] || {
        bio: "",
        focus: "",
        goal: "",
      }
    );
  };

  const setProfile = (username, profile) => {
    const profiles = getProfiles();
    profiles[username] = profile;
    save(KEYS.PROFILES, profiles);
  };

  const resetAll = () => {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  };

  return {
    KEYS,
    getUsers,
    setUsers,
    getCurrentUser,
    setCurrentUser,
    getRooms,
    setRooms,
    getMessages,
    setMessages,
    getSettings,
    setSettings,
    getProfile,
    setProfile,
    resetAll,
  };
})();
