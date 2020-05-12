const fs = require("fs");

exports.log = (message) =>
  console.log(
    "\x1b[2m",
    `[${new Date().toLocaleString()}]`,
    `\x1b[0m${message}`
  );

// Just for testing
exports.fileLog = (message) =>
  fs.appendFileSync("messages.txt", `${message}\n`);
