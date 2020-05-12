// Redis Fasade
const client = require("redis").createClient();
const util = require("util");

exports.QUEUE_KEY = "messages";
exports.client = client;
exports.zadd = util.promisify(client.zadd.bind(client));
exports.zrangebyscore = util.promisify(client.zrangebyscore.bind(client));
exports.quit = util.promisify(client.quit.bind(client));
