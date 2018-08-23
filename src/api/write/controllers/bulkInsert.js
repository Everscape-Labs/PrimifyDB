'use strict';

import {generateKeyStorageDirectoryIfNotExists} from "../../utils/core";
import {getFileHandle} from "../../utils/resourcesManager";
import Timer from '../../utils/Timer';

const smartBulk = async (database, collection, data) => {
  const time     = new Timer();
  const cache    = {};
  let totalWrote = 0;

  data.forEach(async bulkRecord => {
    const path = `${bulkRecord.date}.${bulkRecord.key}`;

    if (!cache[path]) {
      cache[path] = {
        key             : bulkRecord.key,
        storageDirectory: await generateKeyStorageDirectoryIfNotExists(database, collection, bulkRecord.date),
        data            : [`${JSON.stringify(bulkRecord.data)},\n`],
      }
    } else {
      cache[path].data.push(`${JSON.stringify(bulkRecord.data)},\n`);
    }
  });

  await Object.keys(cache).forEach(async path => {
    const storageFile = `${cache[path].storageDirectory}/${cache[path].key}.json`;
    const handle      = getFileHandle(storageFile);

    handle.write(cache[path].data);
    totalWrote += 1;
  });

  time.end();
  return Promise.resolve({
    insertCount: totalWrote,
    duration   : time.format(),
  });
};


const regularBulk = async (database, collection, data) => {
  const time     = new Timer();
  let totalWrote = 0;

  await data.forEach(async bulkRecord => {
    const storageDirectory = await generateKeyStorageDirectoryIfNotExists(database, collection, bulkRecord.date);
    const storageFile      = `${storageDirectory}/${bulkRecord.key}.json`;
    const handle           = getFileHandle(storageFile);

    handle.write(`${JSON.stringify(bulkRecord.data)},\n`);
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
  const { data, smart }          = request.body;
  const { database, collection } = request.params;

  // logger.info('DATA TO INSERT', data);
  // logger.info('splitField : ', splitField);
  // logger.info('Date : ', data.date);
  // logger.info('Date : ', data[splitField]);

  if (smart) {
    const response = await smartBulk(database, collection, data);
    reply.send(response);
  } else {
    const response = await regularBulk(database, collection, data);
    reply.send(response);
  }
};

module.exports = main;