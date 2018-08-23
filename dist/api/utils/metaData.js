'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCollection = exports.addCollectionToDatabaseMeta = exports.createDatabase = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _core = require('./core');

var _fs3 = require('./fs');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var cache = {
  databases: {},
  collections: {}
};

var createDatabase = exports.createDatabase = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(database, opts) {
    var metadata;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            metadata = _extends({
              name: database,
              schema: false,
              created_at: new Date(),
              encoding: 'utf-8',
              collections: []
            }, opts);


            cache.databases[database] = metadata;
            return _context.abrupt('return', (0, _fs3.writeFile)((0, _core.getDatabasePath)(database) + '/.metadata', JSON.stringify(metadata)));

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createDatabase(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getDatabaseMetadata = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(database) {
    var metadata;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!cache.databases[database]) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt('return', cache.databases[database]);

          case 2:
            _context2.next = 4;
            return (0, _fs3.readFile)((0, _core.getDatabasePath)(database) + '/.metadata');

          case 4:
            metadata = _context2.sent;


            cache.databases[database] = metadata;

            return _context2.abrupt('return', metadata);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getDatabaseMetadata(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var getCollectionMetadata = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(database, collection) {
    var metadata;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!cache.collections[database + '.' + collection]) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt('return', cache.collections[database + '.' + collection]);

          case 2:
            _context3.next = 4;
            return (0, _fs3.readFile)((0, _core.getCollectionPath)(database, collection) + '/.metadata');

          case 4:
            metadata = _context3.sent;


            cache.collections[database + '.' + collection] = metadata;

            return _context3.abrupt('return', metadata);

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getCollectionMetadata(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var addCollectionToDatabaseMeta = exports.addCollectionToDatabaseMeta = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(database, collection) {
    var metadata;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getDatabaseMetadata(database);

          case 2:
            metadata = _context4.sent;


            _logger2.default.info('METADATA : ', metadata);

            metadata.collections.push(collection);

            _logger2.default.info('METADATA AFTER: ', metadata);

            return _context4.abrupt('return', createDatabase(database, metadata));

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function addCollectionToDatabaseMeta(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

var createCollection = exports.createCollection = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(database, collection, opts) {
    var metadata;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            metadata = _extends({
              database: database,
              name: collection,
              schema: false,
              created_at: new Date(),
              encoding: 'utf-8'
            }, opts);


            cache.collections[database + '.' + collection] = metadata;
            _context5.next = 4;
            return (0, _fs3.writeFile)((0, _core.getCollectionPath)(database, collection) + '/.metadata', JSON.stringify(metadata));

          case 4:
            _context5.next = 6;
            return addCollectionToDatabaseMeta(database, collection);

          case 6:
            return _context5.abrupt('return', true);

          case 7:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function createCollection(_x8, _x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();