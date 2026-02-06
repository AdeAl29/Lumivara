const Profile = (() => {
  const form = document.getElementById("profileForm");
  const bio = document.getElementById("profileBio");
  const focus = document.getElementById("profileFocus");
  const goal = document.getElementById("profileGoal");
  const message = document.getElementById("profileMessage");

  const loadProfile = () => {
    const user = Storage.getCurrentUser();
    if (!user) return;
    const profile = Storage.getProfile(user);
    if (bio) bio.value = profile.bio || "";
    if (focus) focus.value = profile.focus || "";
    if (goal) goal.value = profile.goal || "";
  };

  const handleSave = (event) => {
    event.preventDefault();
    const user = Storage.getCurrentUser();
    if (!user) return;
    Storage.setProfile(user, {
      bio: bio.value.trim(),
      focus: focus.value.trim(),
      goal: goal.value.trim(),
    });
    if (message) {
      message.textContent = "Profile saved.";
      message.style.color = "var(--success)";
    }
  };

  const init = () => {
    if (!document.body.classList.contains("profile")) return;
    loadProfile();
    if (form) form.addEventListener("submit", handleSave);
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", Profile.init);
