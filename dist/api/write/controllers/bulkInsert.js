'use strict';

var _core = require("../../utils/core");

var _resourcesManager = require("../../utils/resourcesManager");

var _Timer = require("../../utils/Timer");

var _Timer2 = _interopRequireDefault(_Timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var smartBulk = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(database, collection, data) {
    var time, cache, totalWrote;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            time = new _Timer2.default();
            cache = {};
            totalWrote = 0;


            data.forEach(function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bulkRecord) {
                var path;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        path = bulkRecord.date + "." + bulkRecord.key;

                        if (cache[path]) {
                          _context.next = 10;
                          break;
                        }

                        _context.t0 = bulkRecord.key;
                        _context.next = 5;
                        return (0, _core.generateKeyStorageDirectoryIfNotExists)(database, collection, bulkRecord.date);

                      case 5:
                        _context.t1 = _context.sent;
                        _context.t2 = [JSON.stringify(bulkRecord.data) + ",\n"];
                        cache[path] = {
                          key: _context.t0,
                          storageDirectory: _context.t1,
                          data: _context.t2
                        };
                        _context.next = 11;
                        break;

                      case 10:
                        cache[path].data.push(JSON.stringify(bulkRecord.data) + ",\n");

                      case 11:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }());

            _context3.next = 6;
            return Object.keys(cache).forEach(function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(path) {
                var storageFile, handle;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        storageFile = cache[path].storageDirectory + "/" + cache[path].key + ".json";
                        handle = (0, _resourcesManager.getFileHandle)(storageFile);


                        handle.write(cache[path].data);
                        totalWrote += 1;

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 6:

            time.end();
            return _context3.abrupt("return", Promise.resolve({
              insertCount: totalWrote,
              duration: time.format()
            }));

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function smartBulk(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var regularBulk = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(database, collection, data) {
    var time, totalWrote;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            time = new _Timer2.default();
            totalWrote = 0;
            _context5.next = 4;
            return data.forEach(function () {
              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(bulkRecord) {
                var storageDirectory, storageFile, handle;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return (0, _core.generateKeyStorageDirectoryIfNotExists)(database, collection, bulkRecord.date);

                      case 2:
                        storageDirectory = _context4.sent;
                        storageFile = storageDirectory + "/" + bulkRecord.key + ".json";
                        handle = (0, _resourcesManager.getFileHandle)(storageFile);


                        handle.write(JSON.stringify(bulkRecord.data) + ",\n");
                        totalWrote += 1;

                      case 7:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, undefined);
              }));

              return function (_x9) {
                return _ref5.apply(this, arguments);
              };
            }());

          case 4:

            time.end();
            return _context5.abrupt("return", Promise.resolve({
              insertCount: totalWrote,
              duration: time.format()
            }));

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function regularBulk(_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Format of the payload for bulk insert :
 * [{
 *  key: String,
 *  date: Date,
 *  data: Object
 * }]
 *
 * option :
 *  - smart : will bulk data by key before writing it on disk
 *
 * @returns {Function}
 */
var main = function main() {
  return function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(request, reply) {
      var _request$body, data, smart, _request$params, database, collection, response, _response;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _request$body = request.body, data = _request$body.data, smart = _request$body.smart;
              _request$params = request.params, database = _request$params.database, collection = _request$params.collection;

              // logger.info('DATA TO INSERT', data);
              // logger.info('splitField : ', splitField);
              // logger.info('Date : ', data.date);
              // logger.info('Date : ', data[splitField]);

              if (!smart) {
                _context6.next = 9;
                break;
              }

              _context6.next = 5;
              return smartBulk(database, collection, data);

            case 5:
              response = _context6.sent;

              reply.send(response);
              _context6.next = 13;
              break;

            case 9:
              _context6.next = 11;
              return regularBulk(database, collection, data);

            case 11:
              _response = _context6.sent;

              reply.send(_response);

            case 13:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    }));

    return function (_x10, _x11) {
      return _ref6.apply(this, arguments);
    };
  }();
};

module.exports = main;