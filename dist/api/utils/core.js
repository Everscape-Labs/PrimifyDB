'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readRangeOfDates = exports.readSingleDate = exports.generateKeyStorageDirectoryIfNotExists = exports.createKeyStorageDirectory = exports.keyStorageExists = exports.generateKeyStorageDirectoryPath = exports.createCollectionIfNotExists = exports.createDatabaseIfNotExists = exports.createCollection = exports.createDatabase = exports.collectionExists = exports.databaseExists = exports.getCollectionPath = exports.getDatabasePath = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _local = require('../../config/local');

var _local2 = _interopRequireDefault(_local);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _fs3 = require('./fs');

var _metaData = require('./metaData');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var caches = {
  databases: {},
  collections: {},
  files: {}
};

var getDatabasePath = exports.getDatabasePath = function getDatabasePath(database) {
  return _path2.default.join(_local2.default.path, database);
};
var getCollectionPath = exports.getCollectionPath = function getCollectionPath(database, collection) {
  _logger2.default.debug('getCollectionPath : ', {
    path: _local2.default.path,
    database: database,
    collection: collection
  });

  return _path2.default.join(_local2.default.path, database, 'collections', collection);
};

var registerDatabaseInCache = function registerDatabaseInCache(database) {
  _logger2.default.debug('[utils/fileSystem] cache registration : database ' + database);
  caches.databases[database] = {
    collections: {}
  };

  return true;
};

var registerCollectionInCache = function registerCollectionInCache(database, collection) {
  _logger2.default.debug('[utils/fileSystem] cache registration : collection ' + collection);
  caches.collections[database + '.' + collection] = true;
  caches.databases[database]['collections'][collection] = true;
  return true;
};

var databaseExists = exports.databaseExists = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(database) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!caches.databases[database]) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', true);

          case 2:

            // in case we are not in sync with the file system (bad server reboot ...)
            _logger2.default.debug('[utils/fileSystem] check path : ' + getDatabasePath(database));

            if (!_fs2.default.existsSync(getDatabasePath(database))) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', registerDatabaseInCache(database));

          case 5:

            _logger2.default.debug('[utils/fileSystem] database not found in the file sytem');
            return _context.abrupt('return', false);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function databaseExists(_x) {
    return _ref.apply(this, arguments);
  };
}();

var collectionExists = exports.collectionExists = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(database, collection) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return databaseExists(database);

          case 2:
            if (_context2.sent) {
              _context2.next = 4;
              break;
            }

            throw new Error('You cannot create a collection for an unknown database');

          case 4:
            if (!caches.collections[database + '.' + collection]) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return', true);

          case 6:

            // in case we are not in sync with the file system (bad server reboot ...)
            _logger2.default.debug('[utils/fileSystem] check path : ' + getDatabasePath(database));

            if (!_fs2.default.existsSync(getCollectionPath(database, collection))) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt('return', registerCollectionInCache(database, collection));

          case 9:

            _logger2.default.debug('[utils/fileSystem] collection not found in the file sytem');
            return _context2.abrupt('return', false);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function collectionExists(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var createDatabase = exports.createDatabase = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(database) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _logger2.default.debug('[utils/fileSystem] create dir : ' + getDatabasePath(database));

            _context3.next = 3;
            return (0, _fs3.mkdir)(getDatabasePath(database) + '/collections');

          case 3:
            if (!_context3.sent) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt('return', registerDatabaseInCache(database));

          case 5:

            _logger2.default.debug('[utils/fileSystem] Cannot create the database ' + database + ' - ' + getDatabasePath(database));
            throw new Error('Cannot create the database ' + database + ' in ' + getDatabasePath(database));

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function createDatabase(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var createCollection = exports.createCollection = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(database, collection) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _logger2.default.debug('[utils/fileSystem] create dir : ' + getCollectionPath(database, collection));

            _context4.next = 3;
            return (0, _fs3.mkdir)('' + getCollectionPath(database, collection));

          case 3:
            if (!_context4.sent) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt('return', registerCollectionInCache(database, collection));

          case 5:

            _logger2.default.debug('[utils/fileSystem] Cannot create the collection ' + collection + ' - ' + getCollectionPath(database, collection));
            throw new Error('Cannot create the database ' + database + ' in ' + getCollectionPath(database, collection));

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function createCollection(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

var createDatabaseIfNotExists = exports.createDatabaseIfNotExists = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(database) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _logger2.default.debug('[utils/fileSystem] check if database exists: ' + database);
            _context5.next = 3;
            return databaseExists(database);

          case 3:
            if (_context5.sent) {
              _context5.next = 10;
              break;
            }

            _logger2.default.debug('[utils/fileSystem] database doesn\'t exists : ' + database);

            _context5.next = 7;
            return createDatabase(database);

          case 7:
            _context5.next = 9;
            return (0, _metaData.createDatabase)(database);

          case 9:
            return _context5.abrupt('return', getDatabasePath(database));

          case 10:

            _logger2.default.debug('[utils/fileSystem] no database : ' + database);
            return _context5.abrupt('return', getDatabasePath(database));

          case 12:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function createDatabaseIfNotExists(_x7) {
    return _ref5.apply(this, arguments);
  };
}();

var createCollectionIfNotExists = exports.createCollectionIfNotExists = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(database, collection) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _logger2.default.debug('[utils/fileSystem] check if collection exists: ' + database + '.' + collection);
            _context6.next = 3;
            return collectionExists(database, collection);

          case 3:
            if (_context6.sent) {
              _context6.next = 10;
              break;
            }

            _logger2.default.debug('[utils/fileSystem] collection doesn\'t exists : ' + database + '.' + collection);

            _context6.next = 7;
            return createCollection(database, collection);

          case 7:
            _context6.next = 9;
            return (0, _metaData.createCollection)(database, collection);

          case 9:
            return _context6.abrupt('return', getCollectionPath(database, collection));

          case 10:

            _logger2.default.debug('[utils/fileSystem] no collection : ' + database + '.' + collection);
            return _context6.abrupt('return', getCollectionPath(database, collection));

          case 12:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function createCollectionIfNotExists(_x8, _x9) {
    return _ref6.apply(this, arguments);
  };
}();

var formatDate = function formatDate(date) {
  var d = new Date(date);
  var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }

  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('');
};

var generateKeyStorageDirectoryPath = exports.generateKeyStorageDirectoryPath = function generateKeyStorageDirectoryPath(database, collection, date) {
  return _path2.default.join(getCollectionPath(database, collection), formatDate(date));
};

var keyStorageExists = exports.keyStorageExists = function keyStorageExists(path) {
  if (caches.files[path]) {
    return true;
  }

  if (_fs2.default.existsSync(path)) {
    caches.files[path] = true;
    return true;
  }

  return false;
};

var createKeyStorageDirectory = exports.createKeyStorageDirectory = function createKeyStorageDirectory(path) {
  return (0, _fs3.mkdir)(path);
};

var generateKeyStorageDirectoryIfNotExists = exports.generateKeyStorageDirectoryIfNotExists = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(database, collection, date) {
    var path;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            path = generateKeyStorageDirectoryPath(database, collection, date);

            if (!keyStorageExists(path)) {
              _context7.next = 3;
              break;
            }

            return _context7.abrupt('return', path);

          case 3:
            _context7.next = 5;
            return createKeyStorageDirectory(path);

          case 5:
            return _context7.abrupt('return', path);

          case 6:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function generateKeyStorageDirectoryIfNotExists(_x10, _x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();

var escapeOutput = function escapeOutput(content) {
  if (!content || (typeof content === 'undefined' ? 'undefined' : _typeof(content)) !== _typeof(" ")) {
    return false;
  }

  return content.substring(0, content.length - 2);
};

var readSingleDate = exports.readSingleDate = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(database, collection, key, date) {
    var objectMode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var dirPath, error, content, escapedContent;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            dirPath = generateKeyStorageDirectoryPath(database, collection, date);
            error = {};
            content = {};
            _context8.prev = 3;
            _context8.next = 6;
            return (0, _fs3.readFile)(dirPath + '/' + key + '.json', false);

          case 6:
            content = _context8.sent;
            _context8.next = 12;
            break;

          case 9:
            _context8.prev = 9;
            _context8.t0 = _context8['catch'](3);

            error = _context8.t0;

          case 12:
            if (!(objectMode === true)) {
              _context8.next = 19;
              break;
            }

            escapedContent = escapeOutput(content);

            if (!escapedContent) {
              _context8.next = 18;
              break;
            }

            return _context8.abrupt('return', {
              data: JSON.parse('[' + escapedContent + ']'),
              error: error
            });

          case 18:
            return _context8.abrupt('return', {
              data: null,
              error: 'content is undefined - cannot escape sentence'
            });

          case 19:
            return _context8.abrupt('return', {
              data: content,
              error: error
            });

          case 20:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined, [[3, 9]]);
  }));

  return function readSingleDate(_x13, _x14, _x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var readRangeOfDates = exports.readRangeOfDates = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(database, collection, key, dateFrom, dateTo) {
    var data, errors, d, response, content;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            data = [];
            errors = [];
            d = dateFrom;

          case 3:
            if (!(d <= dateTo)) {
              _context9.next = 12;
              break;
            }

            _context9.next = 6;
            return readSingleDate(database, collection, key, d);

          case 6:
            response = _context9.sent;

            if (response.data && response.data.length > 0) {
              data.push(response.data);
            }

            if (response.error && response.error.length > 0) {
              errors.push(response.error);
            }

          case 9:
            d.setDate(d.getDate() + 1);
            _context9.next = 3;
            break;

          case 12:
            content = data.join('');
            return _context9.abrupt('return', {
              response: JSON.parse('[' + content.substring(0, content.length - 2) + ']'),
              errors: errors
            });

          case 14:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function readRangeOfDates(_x18, _x19, _x20, _x21, _x22) {
    return _ref9.apply(this, arguments);
  };
}();