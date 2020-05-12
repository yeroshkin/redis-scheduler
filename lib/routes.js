const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const scheduler = require("./scheduler");

router.get("/", (req, res) => {
  res.send("Scheduler app!");
});

router.get(
  "/echoAtTime",
  [
    check("time").exists().isInt(), // Timestamp
    check("message").exists(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { time, message } = req.query;

    scheduler
      .addTask(parseInt(time), message)
      .then(() => {
        res.send({ ok: 1, time, message });
      })
      .catch(() => {
        res.send({ ok: 0 });
      });
  }
);

module.exports = router;
