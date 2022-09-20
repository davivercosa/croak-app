const users = [];

// join user to the chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

function getCurrentUser(id) {
  return users.find((user) => {
    return user.id === id;
  });
}

function userLeave(id) {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => {
    return user.room === room;
  });
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
