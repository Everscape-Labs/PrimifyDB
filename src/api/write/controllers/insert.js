'use strict';

import logger from '../../utils/logger';
import {getAppendLogFileHandle} from "../../utils/resourcesManager";

const main = () => async (request, reply) => {
  const { data, key, splitField } = request.body;
  const { database, collection }  = request.params;

  const temp = {
    database,
    collection,
    key,
    data,
    splitField
  };

  // logger.info('DATA TO INSERT', data);
  // logger.info('splitField : ', splitField);
  // logger.info('Date : ', data.date);
  // logger.info('Date : ', data[splitField]);

  const handle = getAppendLogFileHandle();

  handle.write(`${JSON.stringify({key, date: data[splitField], data})},\n`);

  reply.send(temp);
};

module.exports = main;