import {createDatabaseIfNotExists,createCollectionIfNotExists} from "../../utils/core";

const main = () => async (request, reply) => {
  const database    = request.params.database;
  const collection  = request.body.collection;

  const databaseCreatedFS   = await createDatabaseIfNotExists(database);
  const collectionCreatedFS = await createCollectionIfNotExists(database, collection);

  return reply.send({
    response: {
      database: {
        name: database,
        fs: databaseCreatedFS,
      },
      collection: {
        name: collection,
        fs: collectionCreatedFS,
      },
    },
  });
};

module.exports = main;