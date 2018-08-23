'use strict';

require('babel-polyfill');

var _fastify = require('fastify');

var _fastify2 = _interopRequireDefault(_fastify);

var _api = require('./api');

var _logger = require('./api/utils/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Fastify = (0, _fastify2.default)({
  logger: true,
  bodyLimit: 1048576 * 200 // 200 Mo
});

// register the logger for application wide usage
(0, _logger.registerLogger)('debug');

// Declare a route
(0, _api.internal)(Fastify);
(0, _api.write)(Fastify);
(0, _api.read)(Fastify);

Fastify.listen(process.env.PORT || 3000, process.env.HOST || '127.0.0.1', function (err, address) {
  if (err) {
    throw err;
  }

  Fastify.log.info('server listening on ' + address);
});