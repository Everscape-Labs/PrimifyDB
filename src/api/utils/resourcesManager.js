import fs from 'fs';
import {join} from 'path';
import config from '../../config/local';

let resourceCount = 0;
const cache       = {};

const registerExpiration = (path, keepAliveDuration) => {
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

/**
 *
 * @param path the path of the file
 * @param keepAliveDuration / keep alive value, in second(s)
 * @returns Object
 */

export const getFileHandle = (path, keepAliveDuration = 1) => {
  if (cache[path]) {
    cache[path].keepAlive = true;
    return cache[path].handle;
  }

  resourceCount += 1;
  cache[path] = {
    keepAlive: false,
    handle   : fs.createWriteStream(path, { flags: 'a' }),
  };

  registerExpiration(path, keepAliveDuration);

  return cache[path].handle;
};

setInterval(() => {
  console.log(`Handles : ${resourceCount}`);
}, 5000);

export const getAppendLogFileHandle = () => {
  const path = join(config.path, 'append_log');
  return getFileHandle(path, 60 * 10) // 10 minutes
};
