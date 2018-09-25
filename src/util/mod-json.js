import fs from 'fs';
import glob from 'glob';
import { logWarning } from './log-config';

const mod = 'module.exports = ';

const removeDupes = arr => {
  return [...new Set(arr)];
}

// this removes or adds module.export to head of a JSON file
const modJSON = (files, action, cb) => {
  let completed = [];
  for (let i = 0; i < files.length; i++) {
    // open/read JSON file
    fs.readFile(files[i], 'utf8', (err, data) => {
      if (err) console.error(err);

      // remove or add module.exports to file data
      const newFile = action === "remove"
        ?
        data.replace(mod, '')
        :
        data.replace(/\{/, mod + '{');

      // write new data to file
      fs.writeFile(files[i], newFile, 'utf8', err => {
        if (err) console.error(err);
        console.log(logWarning(`${action} 'module.exports' in ${files[i]}'`));
        completed = [...completed, i];

        if (completed.length === files.length) cb();
      });
    });
  }
}

// makes list of files from array of globs
const getFileList = paths => {
  let fileList = [];

  paths.forEach(path => {
    fileList = [...fileList, ...glob.sync(path)];
  });

  return removeDupes(fileList);
}

export {
  modJSON,
  getFileList
}
