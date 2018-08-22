import fs from 'fs';

const keepAliveDuration = 1000; // seconds
let resourceCount       = 0;
const cache             = {};

const registerExpiration = (path) => {
  setTimeout(() => {
    if (cache[path].keepAlive === true) {
      cache[path].keepAlive = false;
      registerExpiration(path);
    } else {
      resourceCount -= 1;
      cache[path].handle.end();
      delete cache[path];
    }
  }, keepAliveDuration);
};

export const getFileHandle = (path) => {
  if (cache[path]) {
    cache[path].keepAlive = true;
    return cache[path].handle;
  }

  resourceCount += 1;
  cache[path] = {
    keepAlive: false,
    handle   : fs.createWriteStream(path, {flags: 'a'}),
  };

  registerExpiration(path);

  return cache[path].handle;
};

setInterval(() => {
  console.log(`Handles : ${resourceCount}`);
}, 5000);