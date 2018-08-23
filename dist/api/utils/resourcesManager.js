'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileHandle = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keepAliveDuration = 1000; // seconds
var resourceCount = 0;
var cache = {};

var registerExpiration = function registerExpiration(path) {
  setTimeout(function () {
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

var getFileHandle = exports.getFileHandle = function getFileHandle(path) {
  if (cache[path]) {
    cache[path].keepAlive = true;
    return cache[path].handle;
  }

  resourceCount += 1;
  cache[path] = {
    keepAlive: false,
    handle: _fs2.default.createWriteStream(path, { flags: 'a' })
  };

  registerExpiration(path);

  return cache[path].handle;
};

setInterval(function () {
  console.log('Handles : ' + resourceCount);
}, 5000);