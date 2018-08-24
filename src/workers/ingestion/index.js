import {Tail} from 'tail';
import config from "../../config/local";
import {join} from "path";
import {generateKeyStorageDirectoryIfNotExists} from "../../api/utils/core";
import {getFileHandle} from "../../api/utils/resourcesManager";


const launchIngestion = () => {
  const path = join(config.path, 'append_log');

  const tail = new Tail(path, { follow: true });

  tail.on("line", async (line) => {
    const record = JSON.parse(line);
    const { key, date, database, collection, data } = record;

    const storageDirectory = await generateKeyStorageDirectoryIfNotExists(database, collection, date);
    const storageFile      = `${storageDirectory}/${key}.json`;
    const handle           = getFileHandle(storageFile);

    handle.write(`${JSON.stringify(data)},\n`);
  });

  tail.on("error", function (error) {
    console.log('ERROR: ', error);
  });
};

export default launchIngestion;