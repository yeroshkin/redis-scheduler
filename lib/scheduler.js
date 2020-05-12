const { v1: uuid } = require("uuid");
const isPromise = require("is-promise");
const { QUEUE_KEY, ...redis } = require("./redis");
const { dispatch } = require("./dispatcher");
const {timeoutPromise} = require("./utils");

const FETCH_LIMIT = 10,
  SERVICE_DOWN = 0,
  SERVICE_UP = 1;

let status = SERVICE_DOWN;
let timer = null;
let currentActionPromise; // Using for gracefull shuttingdown. We waiting currentAction until complete

exports.addTask = (time, data) =>
  redis.zadd(
    QUEUE_KEY,
    new Date(time).getTime() || 0,
    JSON.stringify({ uid: uuid(), data })
  );

exports.start = (poolingInterval = 1000) => {
  const loop = () => {
    const now = Date.now();

    currentActionPromise = redis
      .zrangebyscore(QUEUE_KEY, 0, now, "limit", 0, FETCH_LIMIT)
      .then((replies) => replies.map(dispatch)) // Batch processing
      .then(Promise.all.bind(Promise)) // Waiting for dispatching
      .then((results) => (SERVICE_UP === status ? results : Promise.reject()))
      .then((results) =>
        results.length
          ? setImmediate(loop)
          : (timer = setTimeout(loop, poolingInterval))
      )
      .catch(() => "Service stopped");
  };

  // If server is started
  return timer ? false : (status = SERVICE_UP), loop(), true;
};

exports.stop = () => {
  clearTimeout(timer);
  timer = null;
  status = SERVICE_DOWN;

  // Gracefull shutting down
  // If the service is working on the task right now,
  // we should waiting to finish it no more then 1 second
  return Promise.race([currentActionPromise, timeoutPromise(1000)]);
};
