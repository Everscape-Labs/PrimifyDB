"use strict";

var _core = require("../../utils/core");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var main = function main() {
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, reply) {
      var database, collection, databaseCreatedFS, collectionCreatedFS;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              database = request.params.database;
              collection = request.body.collection;
              _context.next = 4;
              return (0, _core.createDatabaseIfNotExists)(database);

            case 4:
              databaseCreatedFS = _context.sent;
              _context.next = 7;
              return (0, _core.createCollectionIfNotExists)(database, collection);

            case 7:
              collectionCreatedFS = _context.sent;
              return _context.abrupt("return", reply.send({
                response: {
                  database: {
                    name: database,
                    fs: databaseCreatedFS
                  },
                  collection: {
                    name: collection,
                    fs: collectionCreatedFS
                  }
                }
              }));

            case 9:
            case "end":
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

module.exports = main;