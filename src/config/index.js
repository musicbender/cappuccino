import getConfigModel from './model';
import throwError from '../util/errors';

// check if each option is correct type, if not throw an error and end process
const checkType = (option, model, config) => {
  if (!model[option].type || model[option].type === undefined || model[option].type === "mixed") {
    return;
  }

  switch(model[option].type) {
    case "array":
      if (!Array.isArray(config[option])) {
        throwError(`The option '${option}' should be ${model[option].type}`);
      }
      break;
    default:
      if(typeof config[option] !== model[option].type) {
        throwError(`The option '${option}' should be ${model[option].type}, but was ${typeof config[option]}`);
      }
  }
}

// set defaults for configs inside objects
const setDeepDefaults = (obj, model) => {
  let output = {};

  Object.keys(model.default).forEach(option => {
    if (obj[option] === undefined) {
      output[option] = model.default[option]
    } else {
      output[option] = obj[option];
    }
  });

  return output;
}

// after setting config obj, do some things
const postHook = (configObj, model) => {
  Object.keys(configObj).forEach(option => {
    if (model[option].type === 'object' && model[option].model !== undefined) {
      postHook(configObj[option], model[option].model);
    } else {
      checkType(option, model, configObj);
    }
  });
};

const configs = options => {
  // get model
  const model = getConfigModel(options.type || 'unit');

  // if option not specified, fallback to defaults
  const {
    type = model.type.default,
    globPattern = model.globPattern.default,
    ignored = model.ignored.default,
    quiet = model.quiet.default,
    watch = model.watch.default,
    minimal = model.minimal.default,
    isLocal = model.isLocal.default,
    moduleJSONFiles = model.moduleJSONFiles.default,
    pageTitle = model.pageTitle.default,
    baseDir = model.baseDir.default,
    index = model.index.default,
    showBrowserView = model.showBrowserView.default,
    port = model.port.default,
    funcGlobalTests = model.funcGlobalTests.default,
    funcEnv = model.funcEnv.default,
    funcURLS = model.funcURLS.default,
    funcGNB = model.funcGNB.default
  } = options;

  // define config object
  const config = {
    type,
    pageTitle,
    globPattern,
    ignored,
    baseDir,
    quiet,
    watch,
    minimal,
    isLocal,
    showBrowserView,
    port,
    index,
    moduleJSONFiles,
    funcEnv,
    funcURLS,
    funcGlobalTests,
    funcGNB
  };

  // check if config is an object and has its own obj model
  // if so, set default fallbacks for each of its parameters
  Object.keys(config).forEach(option => {
    if (model[option].type === 'object' && model[option].model !== undefined) {
      config[option] = setDeepDefaults(config[option], model[option]);
    }
  });

  // validation
  postHook(config, model);

  return config;
}

export default configs;
