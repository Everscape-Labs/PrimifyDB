import {Tail} from 'tail';
import config from "../../config/local";
import {join} from "path";
import {generateKeyStorageDirectoryIfNotExists} from "../../api/utils/core";
import {getFileHandle} from "../../api/utils/resourcesManager";

const path = join(config.path, 'append_log');

const tail = new Tail(path);

tail.on("line", async (line) => {
  const {key, date, database, collection, data } = line;

  const storageDirectory = await generateKeyStorageDirectoryIfNotExists(database, collection, date);
  const storageFile      = `${storageDirectory}/${key}.json`;
  const handle           = getFileHandle(storageFile);

  handle.write(JSON.stringify(`${data},\n`));
});

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});
