const Rooms = (() => {
  const roomList = document.getElementById("roomList");
  const roomForm = document.getElementById("roomForm");
  const roomName = document.getElementById("roomName");
  const roomTopic = document.getElementById("roomTopic");
  const roomMessage = document.getElementById("roomMessage");

  const slugify = (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const renderRooms = () => {
    if (!roomList) return;
    const rooms = Storage.getRooms();
    roomList.innerHTML = "";
    rooms.forEach((room) => {
      const card = document.createElement("div");
      card.className = "room-card";
      card.innerHTML = `
        <div>
          <h3>${room.name}</h3>
          <p>${room.topic}</p>
        </div>
        <a class="btn ghost small" href="chat.html?room=${room.id}">Join</a>
      `;
      roomList.appendChild(card);
    });
  };

  const handleCreate = (event) => {
    event.preventDefault();
    const name = roomName.value.trim();
    const topic = roomTopic.value.trim();
    if (!name || !topic) {
      roomMessage.textContent = "Please fill out all fields.";
      roomMessage.style.color = "var(--danger)";
      return;
    }

    const rooms = Storage.getRooms();
    const id = slugify(name);
    if (rooms.some((room) => room.id === id)) {
      roomMessage.textContent = "Room already exists.";
      roomMessage.style.color = "var(--danger)";
      return;
    }

    rooms.push({ id, name, topic });
    Storage.setRooms(rooms);
    roomMessage.textContent = "Room created!";
    roomMessage.style.color = "var(--success)";
    roomForm.reset();
    renderRooms();
  };

  const init = () => {
    if (!document.body.classList.contains("rooms")) return;
    renderRooms();
    if (roomForm) roomForm.addEventListener("submit", handleCreate);
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", Rooms.init);
