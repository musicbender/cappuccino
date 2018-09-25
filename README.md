cappuccino
===========

Cappuccino is a frothy and delicious javascript testing environment for NCW web projects


## Setup
---

- In your project root, run `npm i @ncw/cappuccino -D` to install.


## Directory structure
---

Cappuccino is opinionated on your test directory structure. The following structure should be used, and cappuccino will generate necessary folders if needed:

```
projectRoot/
└── test/
    ├── functional/
    ├── integration/
    ├── mocks/
    └── util/
```

The mocks/ and util/ are for storing your mock data and any of your custom util functions for running tests.

NOTE: Although your integration and functional tests will live inside their own folder, your **unit tests** have to live in the same directory as the file it is testing:

```
components/
└── my-component/
    ├── component.js
    └── component.test.js
```


## Useage
---

To run tests, you will need to create an entry js file for each type of test you need (unit, integration, etc...). Inside these scripts you will execute cappuccino() and add any needed options:


### `cappuccino(optionsObj)`

```js
/// unit-test.js

import cappuccino from '@ncw/cappuccino';

cappuccino({
  type: 'unit',
  watch: true,
  minimal: true,
  showBrowserView: true
});

```

You can also use this package without any options. This will run all defaults:

```js
/// unit-test.js

import cappuccino from '@ncw/cappuccino';

cappuccino();

```


From there, use an npm script to run that test:
```js
"test": "babel-node test/unit-test.js"
```
`npm test`


## Options
---

There are a list of options you can use, but none of them are required. If an option is not specified a default is used instead.

#### Base Options

- `type` Type of test: 'unit', 'integration', or 'functional'. Default: 'unit'.
- `globPattern` glob for finding your *.test.js* files. Default depends on test type:
  - `unit` - \*\*/\*.test.js
  - `integration` - test/integration/\*\*/\*.test.js
  - `functional` - test/functional/\*\*/\*.test.js
- `ignored` Array of globs for mocha tests to ignore. Default depends on test type.
- `watch` Watch test and tested files for TDD. Default: true if type is 'unit'.
- `isLocal` If this is being run on a server it should be false. Default: true.
- `minimal` Will display minimal results in the console. Default: false
- `moduleJSONFiles` This is for projects that contain bad JSON files that contain "module.exports". This option takes an array of globs that point to said JSON files. When the test is run, "module.exports" will be removed from the file and added back in when the test finishes. Default is an empty array.

#### Browser View Options

- `showBrowserView` Show results in a pretty browser view via browser sync server
- `pageTitle` Title of your project for report view. Default: 'Nc Web Test'
- `port` The port number for the browser-sync server to run report view. Default is 3010 for unit test and 3011 for integration and functional tests

#### Functional Testing Options

- `funcEnv` Sets the environment for functional tests. This can also be set via command line flags (see below). Default is 'dev'
- `funcGNB` Pass the GNB configs object here so the GNB can be automatically tested
- `funcURLS` For functional tests, and object that sets the urls for each environment. Three keys (dev, qa, live). Example:
  ```js
  funcURLS: {
    dev: 'http://local.aionlegionsofwar.com:3000/en',
    qa: 'http://www-qa.aionlegionsofwar.com/en',
    live: 'http://www.aionlegionsofwar.com/en'
  }
  ```
- `globalFuncTests` Options for running pre-written functional tests built into this package for global components
  - `shouldRun` Boolean for if these tests should run
  - `excludeSuites` Array of global test suites to exclude. The current list:
    ```js
      [load, gnb]
    ```
  - Defaults:
    ```js
    globalFuncTests: {
      shouldRun: true,
      excludeSuites: []
    }
    ```    


## Functional Testing
---

Functional tests run a running website, be it a qa, live, for dev site running locally. You will need to set the urls for each environment using the `funcURLS` option above.

There are two ways you can set the environment:
- Through setting the `funcEnv` option above
- Though a console flag when you run your npm script:
`npm run test:func -- --qa`
This will run your functional test npm script, and set the environment to qa. For live, use the `-- --live` flag. Dev is default so no flag is needed.

The functional test URL (set from the `funcURLS` option) will change based the environment you set. To access this URL when writing your tests, use `global.CAPPUCCINO_FUNCURL`.

## Node Vars for Functional Testing
---

There are many global node variables that will be available to your functional test:

- `global.CAPPUCCINO_FUNC_URL` The url your functional tests are pointing at;
- `global.CAPPUCCINO_FUNC_ENV` = Environment for functional test: 'dev', 'qa', or 'live'.

#### For GNB config data

- `global.CAPPUCCINO_GNB_ELEMENTS`
- `global.CAPPUCCINO_GNB_SUPPORTURL`
- `global.CAPPUCCINO_GNB_LOGINURL`
- `global.CAPPUCCINO_GNB_LOGOUTURL`
- `global.CAPPUCCINO_GNB_CSSHOST`
- `global.CAPPUCCINO_GNB_ENV`
- `global.CAPPUCCINO_GNB_LANG`

## Custom Setup file
---

You have the option of adding a `test/setup.js` file. This file acts as a "pre-hook" and will be executed before mocha or any of the test functions are initialized. Add any custom actions you need here (for example, mocking jquery or set up an Enzyme adapter).
