require('./util/browser-mock');

process.env.NODE_ENV = 'test';

const util = require('./util/util');
const noop = util.noop;

require.extensions['.css'] = noop;
require.extensions['.scss'] = noop; 
