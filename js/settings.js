const Settings = (() => {
  const animations = document.getElementById("settingAnimations");
  const compact = document.getElementById("settingCompact");
  const sounds = document.getElementById("settingSounds");

  const applySettings = (settings) => {
    document.body.classList.toggle("no-animations", !settings.animations);
    document.body.classList.toggle("compact", settings.compact);
  };

  const loadSettings = () => {
    const settings = Storage.getSettings();
    if (animations) animations.checked = settings.animations;
    if (compact) compact.checked = settings.compact;
    if (sounds) sounds.checked = settings.sounds;
    applySettings(settings);
  };

  const saveSettings = () => {
    const settings = {
      animations: animations ? animations.checked : true,
      compact: compact ? compact.checked : false,
      sounds: sounds ? sounds.checked : false,
    };
    Storage.setSettings(settings);
    applySettings(settings);
  };

  const init = () => {
    if (!document.body.classList.contains("settings")) return;
    loadSettings();
    [animations, compact, sounds].forEach((input) => {
      if (input) input.addEventListener("change", saveSettings);
    });
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", Settings.init);
