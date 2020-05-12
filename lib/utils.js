exports.timeoutPromise = (timeoutMs) =>
  new Promise((resolve, reject) => setTimeout(() => reject(), timeoutMs));
