// Fill test data
const scheduler = require("./lib  /scheduler");

Array(10000)
  .fill(0)
  .forEach((i, j) => {
    scheduler.addTask(Date.now() + j * 1000, "One second timer" + j);
  });

Array(10000)
  .fill(0)
  .forEach((i, j) => {
    scheduler.addTask(Date.now() + 10 * 1000, "The same time" + j);
  });

Array(10000)
  .fill(0)
  .forEach((i, j) => {
    scheduler.addTask(100500, "Occured" + j);
  });

Array(1000000)
  .fill(0)
  .forEach((i, j) => {
    scheduler.addTask(
      Date.now() + 20000 + parseInt(Math.random() * 10000),
      "Million in 10 seconds" + j
    );
  });
