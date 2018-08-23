import {readSingleDate, readRangeOfDates} from "../../utils/core";

const main = (Fastify) => async (request, reply) => {
  const { collection, database } = request.params;
  const { date, dateFrom, dateTo, key }            = request.body;

  let data;
  if (date) {
    data = await readSingleDate(database, collection, key, date);
  } else if (dateFrom && dateTo) {
    data = await readRangeOfDates(database, collection, key, new Date(dateFrom), new Date(dateTo));
  }


  reply.header('content-type', 'application/json');
  reply.send(data);
};


export default main;