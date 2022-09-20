const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// DOM manipulation
function outputMessage(message) {
  const classesToAdd = ["message", "animate__animated", "animate__slideInUp"];
  const div = document.createElement("div");
  div.classList.add(...classesToAdd);
  // div.classList.add("animate__bounceInUp");
  div.innerHTML = `
        <p class="meta">${message.userName} <span>${message.time}</span></p>
        <p class="text">
            ${message.content}
        </p>
    `;

  const chatMessages = document.querySelector(".chat-messages");
  chatMessages.appendChild(div);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function outputRoomName(room) {
  const roomName = document.getElementById("room-name");
  roomName.innerText = room;
}

function outputUsers(users) {
  const userList = document.getElementById("users");
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// message from server
socket.on("message", (message) => {
  outputMessage(message);
});

// message submit
const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = document.getElementById("msg");

  // emitting the user message to the server
  socket.emit("chatMessage", input.value);

  //   e.target.elements.msg.value = "";
  input.value = "";
  input.focus();
});
