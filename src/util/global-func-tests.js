import glob from 'glob';
import fs from 'fs';
import path from 'path';
import { objNotEmpty } from './util';

//--//--//--// Test scope functions //--//--//--//
const hasBrazilElm = elements => {
  const prefix = "brazil_";
  let hasBrazil = false;
  let elms = elements;

  if (typeof elements === "string") {
    elms = elements.split(",");
  }

  elms.forEach(elm => {
    if (elm.indexOf(prefix) > -1) {
      hasBrazil = true;
    }
  });

  return hasBrazil
}

const removeEn = url => {
  const enIndex = url.indexOf('/en');
  return url.substring(0, enIndex);
}

//--//--//--// App scope functions //--//--//--//

// add '.test.js' to each test exclude suite
const addFilePaths = excludes => {
  let output = [];
  const globPath = 'node_modules/@ncw/cappuccino/dist/global-func-tests/';

  excludes.forEach(item => {
    output = [ ...output, `${globPath}${item}.test.js`];
  });

  return output;
}

// auto sets excludes if certain configs aren't set
const getFuncExcludes = (excludes, { gnb }) => {
  let output = excludes;

  if (gnb && !objNotEmpty(gnb) && excludes.indexOf("gnb") < 0) {
    output = [ ...excludes, "gnb"];
  }

  return addFilePaths(output);
}

// filter out test files
const filterFiles = files => {
  let output = [];

  files.forEach(file => {
    if (file.includes(".test.js")) {
      output = [...output, file.replace(".test.js", "")];
    }
  });

  return output;
}

// get list of global test files
const getFuncTestList = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve('../global-func-tests'), (err, files) => {
      if (err) reject(err);
      resolve(filterFiles(files));
    })
  })
}

// returns global test files to run
const getGlobalFuncTests = (excludeSuites, globalFuncGlob) => {
  return new Promise((resolve, reject) => {
    glob(globalFuncGlob, { ignore: excludeSuites }, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
}

export {
  getGlobalFuncTests as default,
  getFuncTestList,
  filterFiles,
  getFuncExcludes,
  hasBrazilElm,
  removeEn
}
