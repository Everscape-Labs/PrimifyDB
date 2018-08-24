'use strict';

import logger from '../../utils/logger';
import {getAppendLogFileHandle} from "../../utils/resourcesManager";
import Timer from '../../utils/Timer';

const regularBulk = async (database, collection, data) => {
  const time     = new Timer();
  let totalWrote = 0;

  await data.forEach(async bulkRecord => {
    const handle = getAppendLogFileHandle();

    handle.write(`${JSON.stringify(bulkRecord)},\n`);
    totalWrote += 1;
  });

  time.end();
  return Promise.resolve({
    insertCount: totalWrote,
    duration   : time.format(),
  });
};


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
const main = () => async (request, reply) => {
  const { data }                 = request.body;
  const { database, collection } = request.params;

  // logger.info('DATA TO INSERT', data);
  // logger.info('splitField : ', splitField);
  // logger.info('Date : ', data.date);
  // logger.info('Date : ', data[splitField]);

  const response = await regularBulk(database, collection, data);
  reply.send(response);
};

module.exports = main;