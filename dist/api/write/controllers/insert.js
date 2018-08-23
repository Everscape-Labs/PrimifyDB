'use strict';

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _core = require('../../utils/core');

var _resourcesManager = require('../../utils/resourcesManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var main = function main(Fastify) {
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, reply) {
      var _request$body, data, key, splitField, _request$params, database, collection, temp, storageDirectory, storageFile, handle;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _request$body = request.body, data = _request$body.data, key = _request$body.key, splitField = _request$body.splitField;
              _request$params = request.params, database = _request$params.database, collection = _request$params.collection;
              temp = {
                database: database,
                collection: collection,
                key: key,
                data: data,
                splitField: splitField
              };

              // logger.info('DATA TO INSERT', data);
              // logger.info('splitField : ', splitField);
              // logger.info('Date : ', data.date);
              // logger.info('Date : ', data[splitField]);

              _context.next = 5;
              return (0, _core.generateKeyStorageDirectoryIfNotExists)(database, collection, data[splitField]);

            case 5:
              storageDirectory = _context.sent;
              storageFile = storageDirectory + '/' + key + '.json';
              handle = (0, _resourcesManager.getFileHandle)(storageFile);


              handle.write(JSON.stringify(data) + ',\n');

              reply.send(temp);

            case 10:
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

module.exports = main;