'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../../utils/core');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var main = function main(Fastify) {
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, reply) {
      var _request$params, collection, database, _request$body, date, dateFrom, dateTo, key, data;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _request$params = request.params, collection = _request$params.collection, database = _request$params.database;
              _request$body = request.body, date = _request$body.date, dateFrom = _request$body.dateFrom, dateTo = _request$body.dateTo, key = _request$body.key;
              data = void 0;

              if (!date) {
                _context.next = 9;
                break;
              }

              _context.next = 6;
              return (0, _core.readSingleDate)(database, collection, key, date);

            case 6:
              data = _context.sent;
              _context.next = 13;
              break;

            case 9:
              if (!(dateFrom && dateTo)) {
                _context.next = 13;
                break;
              }

              _context.next = 12;
              return (0, _core.readRangeOfDates)(database, collection, key, new Date(dateFrom), new Date(dateTo));

            case 12:
              data = _context.sent;

            case 13:

              reply.header('content-type', 'application/json');
              reply.send(data);

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports.default = main;