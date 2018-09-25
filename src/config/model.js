import process from 'process';

const getConfigModel = type => {

  //--//--//--// Default Objects //--//--//--//
  const globPatterns = {
    unit: `**/*.test.js`,
    integration: `test/integration/**/*.test.js`,
    functional: `test/functional/**/*.test.js`
  };

  const baseDirs = {
    unit: `test/runner`,
    integration: `test/integration/runner`,
    functional: `test/functional/runner`
  };

  const excludes = {
    unit: [
      'test/functional/*',
      'test/integration/*',
      'node_modules/**/*'
    ],
    integration: [
      'test/functional/*',
      'node_modules/**/*'
    ],
    functional: [
      'test/integration/*',
      'node_modules/**/*'
    ]
  };
  const globalFuncTestDefault = {
    shouldRun: true,
    excludeSuites: []
  };

  const funcObj = type === "functional" ? { dev: '', qa: '', live: '' } : {};

  const port = type === 'unit' ? 3010 : 3011;


  //--//--//--// Object Type Models //--//--//--//
  const globalFuncTestModel = {
    shouldRun: {
      type: 'boolean',
      default: globalFuncTestDefault.shouldRun
    },
    excludeSuites: {
      type: 'array',
      default: globalFuncTestDefault.excludeSuites
    }
  };

  const funcObjModel = {
    dev: {
      type: 'string',
      default: funcObj.dev || ''
    },
    qa: {
      type: 'string',
      default: funcObj.qa || ''
    },
    live: {
      type: 'string',
      default: funcObj.live || ''
    }
  }

  //--//--//--// Root Model //--//--//--//
  return {
    type: {
      type: 'string',
      default: 'unit'
    },
    pageTitle: {
      type: 'string',
      default: 'Test'
    },
    globPattern: {
      type: 'string',
      default: globPatterns[type]
    },
    ignored: {
      type: 'array',
      default: excludes[type]
    },
    baseDir: {
      type: 'string',
      default: baseDirs[type]
    },
    index: {
      type: 'string',
      default: 'runner.html'
    },
    quiet: {
      type: 'boolean',
      default: true
    },
    watch: {
      type: 'boolean',
      default: type === 'unit'
    },
    minimal: {
      type: 'boolean',
      default: false
    },
    isLocal: {
      type: 'boolean',
      default: true
    },
    showBrowserView: {
      type: 'boolean',
      default: false
    },
    port: {
      type: 'number',
      default: port
    },
    moduleJSONFiles: {
      type: 'array',
      default: []
    },
    funcEnv: {
      type: 'string',
      default: 'live'
    },
    funcURLS: {
      type: 'object',
      model: funcObjModel,
      default: funcObj
    },
    funcGNB: {
      type: 'object',
      default: {}
    },
    funcGlobalTests: {
      type: 'object',
      model: globalFuncTestModel,
      default: globalFuncTestDefault
    },
  }
}

export default getConfigModel;
