const moment = require("moment");

function messageFormatter(userName, content) {
  return {
    userName,
    content,
    time: moment().format("h:mm a"),
  };
}

module.exports = messageFormatter;
