import gaze from 'gaze';
import { logProcessing } from './log-config';

// Adds regular files being tested to array of .test files
const buildFileList = files => {
  let filesArr = [];
  files.forEach(file => {
    filesArr.push(file.replace('.test', ''));
  });
  return filesArr;
}

// build list of watched files. If unit test, also watch files being tested
const getWatchFiles = (testFiles, type) => {
  return type === 'unit' ? [...testFiles, ...buildFileList(testFiles)] : testFiles;
}

export const watchFiles = (config, onChange) => {
  const { testFiles, type, resolve, reject } = config;
  const watchedFiles = getWatchFiles(testFiles, type);

  gaze(watchedFiles, (err, watcher) => {
    if (err) reject(err);

    console.log(logProcessing('Now watching test files and tested files for changes...'));

    watcher.on('all', (event, filePath) => {
      console.log(logProcessing(`File ${event}:\n${filePath}\nReloading tests...`));
      onChange && onChange(watchedFiles);
    });

    resolve();
  });
}
