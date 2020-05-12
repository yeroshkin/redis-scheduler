const express = require("express");
const redis = require("./redis");
const routes = require("./routes");
const scheduler = require("./scheduler");
const dispatcher = require("./dispatcher");
const { log, fileLog } = require("./logger");

const app = express();
const port = process.env.PORT || 3000;

app.use("/", routes);
dispatcher.subscribe(log);
// dispatcher.subscribe(fileLog); // Only for testing

redis.client.on("connect", () => {
  const httpServer = app.listen(port, () => {
    console.log(`Scheduler app listening at http://localhost:${port}`);
  });

  process.on("SIGTERM", () => {
    console.log("Gracefull shutingdown");
    httpServer.close(() => {
      console.log("Http server closed");
      scheduler
        .stop()
        .then(() => console.log("Scheduler stopped"))
        .catch(() => console.error("Can't stop scheduler"))
        .then(() => redis.quit())
        .then(() => console.log("Redis stopped"))
        .finally(() => process.exit(0));
    });
  });

  scheduler.start();
});
