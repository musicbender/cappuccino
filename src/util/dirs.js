import fs from 'fs';
import path from 'path';
import { logError, logWarning, logProcessing } from './log-config';

let dirsMissing = false;

const checkDir = dir => {
  if (!fs.existsSync(path.resolve(dir))) {
    if(!dirsMissing) {
      console.log(logWarning('\nRequired directories missing. Creating necessary directories now...'));
      dirsMissing = true;
    }

    console.log(logWarning(`Making '${dir}' directory...`));
    fs.mkdirSync(path.resolve(dir));
  }
}

const buildDirs = () => {
  const dirs = [
    'test',
    'test/integration',
    'test/functional',
    'test/mocks',
    'test/util'
  ]

  dirs.forEach(dir => {
    checkDir(dir);
  })

  if (dirsMissing) {
    console.log(logWarning('Finished building dirs.\n\n'));
  }
}

export default buildDirs;
