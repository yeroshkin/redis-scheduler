const { QUEUE_KEY, client } = require("./redis");
const observers = new Set();

exports.subscribe = (cb) => (observers.add(cb), () => observers.delete(cb));

exports.dispatch = value =>
  new Promise((resolve, reject) =>
    client.watch(QUEUE_KEY, (watchError) =>
      watchError
        ? reject()
        : client
            .multi()
            .zrem(QUEUE_KEY, value)
            .exec((error, reply) => {
              if (!error && reply && reply[0]) {
                // Processing message

                /* In fact queue servers should be persistent
                 ** No messages are lost in case of a consumer failure.
                 ** but because, on the condition of the task, the result is just to be put into the console and nothing more.
                 ** Because of console.log is anomic synchronouse operation,
                 ** will be enoght to use simple Observable layer instead of the much more complex Consumer abstraction
                 ** with message delivery confirmation, retry attemts, message experations, consumer timeout etc.
                 ** and because it is not specified in the terms of the task, that way I focused only on
                 ** - messages should not be lost
                 ** - the same message should be printed only once
                 ** - message order should not be changed
                 ** - should be scalable
                 ** - seeing your code in action (SOLID would be a plus)
                 ** - use only redis.io
                 */
                const { uid, data } = JSON.parse(value);
                // So, here is a simple synchronouse event emitter
                observers.forEach((observer) => observer(data));
              }

              resolve();
            })
    )
  );
