'use strict';

var _fetch = require('./controllers/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var basePath = '/:database/_read';

var main = function main(Fastify) {
  Fastify.post(basePath + '/:collection', (0, _fetch2.default)(Fastify));
};

module.exports = main;