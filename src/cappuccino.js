import Mocha from 'mocha';
import glob from 'glob';
import fs from 'fs';
import path from 'path';
import configs from './config';
import server from './server';
import buildDirs from './util/dirs';
import getGlobalFuncTests, { getFuncExcludes } from './util/global-func-tests';
import { logError, logSuccess, logProcessing, logIntro, logWarning } from './util/log-config';
import { noop }  from './util/util';
import { modJSON, getFileList } from './util/mod-json';
import { watchFiles } from './util/watch';
import { getReporter } from './util/util';
import setNodeVars from './util/node-vars';

const cappuccino = (options, cb) => {
  //--//--//--// Initialization Tasks //--//--//--//
  const config = configs(options);
  const {
    type,
    pageTitle,
    globPattern,
    baseDir,
    ignored,
    quiet,
    minimal,
    isLocal,
    watch,
    showBrowserView,
    funcGlobalTests,
    funcEnv,
    funcURLS,
    funcGNB
  } = config;

  const title = `${pageTitle}: ${type} tests`;
  const globalFuncGlob = 'node_modules/@ncw/cappuccino/dist/global-func-tests/*.test.js';
  let testFiles;

  console.log(logIntro(`\n ${title} \n`));

  // check for and create necessary directories
  if (isLocal) { buildDirs() }

  if (type !== 'functional') {
    // prehook setup things
    require('./setup');

    // look for a custom setup.js in test directory
    const customSetup = path.resolve('test/setup.js');
    if (fs.existsSync(path.resolve(customSetup))) {
      require(customSetup);
    }
  }

  // initiate mocha instance
  const mocha = new Mocha({
    reporter: getReporter({ minimal, showBrowserView }),
    reporterOptions: {
      reportDir: baseDir,
      reportFilename: 'runner',
      quiet,
      reportPageTitle: title,
      reportTitle: title,
      dev: false,
      html: isLocal,
      minimal
    }
  });

  // clear suite and node require cache for reloading tests
  const invalidate = (files = mocha.files) => {
    mocha.suite.suites = [];
    files.forEach(p => {
      p = path.resolve(p);
      delete require.cache[require.resolve(p)]
    });
  }

  //--//--//--// Promise Chain of Test Tasks //--//--//--//
  // async initialization tasks
  const setupTest = () => {
    return new Promise((resolve, reject) => {

      // de-module.export bad json files
      if (config.moduleJSONFiles.length > 0) {
        console.log(logWarning('Temporarily editing "bad" JSON files...'));
        modJSON(getFileList(config.moduleJSONFiles), "remove", () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // find and add all test files to mocha
  const addTests = () => {
    return new Promise((resolve, reject) => {
      console.log(logProcessing('Processing test files...'));

      glob(globPattern, {ignore: ignored}, (err, files) => {
        if (err) {
          console.log(logError(err));
          return reject(err);
        }

        files.forEach(file => mocha.addFile(file));
        testFiles = mocha.files;

        // add global func tests
        if (type === 'functional' && funcGlobalTests.shouldRun) {
          const excludes = getFuncExcludes(funcGlobalTests.excludeSuites, {
            gnb: funcGNB || {}
          });

          getGlobalFuncTests(excludes, globalFuncGlob)
            .then(files => {
              files.forEach(file => mocha.addFile(file));
              testFiles = mocha.files;
              resolve();
            })
            .catch(reject);
        } else {
          resolve();
        }
      });
    });
  }

  // run mocha instance
  const runMocha = resolve => {
    mocha.run(failures => {
      if (resolve) { resolve() }
    })
    .on("end", () => {
      const message = `******* ${type} testing is complete! *******\n`;
      if (config.moduleJSONFiles.length > 0) {
        modJSON(getFileList(config.moduleJSONFiles), "add", () => {
          console.log(logSuccess(message));
        });
      } else {
        console.log(logSuccess(message));
      }
    })
  }

  // wrap mocha.run with a promise
  const runTest = () => {
    return new Promise((resolve, reject) => {
      runMocha(resolve);
    });
  }

  // run a server and open test report in browser
  const showResults = () => {
    return new Promise((resolve, reject) => {
      if (showBrowserView) {
        if(isLocal) {
          console.log(logProcessing(`Opening ${type} test results in browser...\n`));
          resolve(
            server({
              ...config,
              invalidate,
              setupTest,
              runMocha
            })
          );
        } else {
          reject(`Cannot open in browser if this is not a local environment.\n`);
        }
      } else {
        resolve();
      }
    });
  }

  // watch all test and tested files
  const watchTests = bs => {
    return new Promise((resolve, reject) => {
      if (watch) {
        const watchConfig = {
          testFiles,
          type,
          resolve,
          reject
        };

        watchFiles(watchConfig, (watchedFiles) => {
          setupTest()
            .then(() => {
              invalidate(watchedFiles);
              runMocha();
              bs && bs.reload();
            })
            .catch(reject);
        });
      } else {
        bs && bs.exit();
        resolve();
      }
    });
  }

  // finish hook
  const finish = () => {
    cb && cb(invalidate);

    if (!watch && isLocal) {
      console.log(logProcessing('Watch is disabled. Closing process...\n'));
      setTimeout(() => {
        console.log(logIntro('Test process closed. Have a nice day.\n\n'));
        process.exit();
      }, 5000);
    }
  }

  //--//--//--// GO GO GADGET TEST //--//--//--//
  setupTest()
    .then(addTests)
    .then(runTest)
    .then(showResults)
    .then(watchTests)
    .then(finish)
    .catch(err => {
      console.log(logError(err));
    });

  //--//--//--// GLOBAL NODE VARS //--//--//--//
  setNodeVars({
    funcURLS,
    funcEnv,
    funcGNB
  });
}

//--//--//--// PUBLIC //--//--//--//
export {
  cappuccino as default
}
