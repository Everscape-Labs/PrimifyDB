import fs from 'fs';
import logger from './logger';

const keepAliveDuration = 2000; // seconds
let resourceCount       = 0;
const cache             = {};

const registerExpiration = (path) => {
  setTimeout(() => {
    if (cache[path].keepAlive) {
      cache[path].keepAlive = false;
      registerExpiration(path);
    } else {
      resourceCount -= 1;
      cache[path].handle.end();
      delete cache[path];
      logger.info(`handlers ${resourceCount}`);
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

  logger.info(`handlers ${resourceCount}`);

  return cache[path].handle;
};