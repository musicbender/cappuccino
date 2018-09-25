import { getFuncURL }  from './util';

const setNodeVars = configs => {
  const { funcURLS, funcEnv, funcGNB } = configs;

  global.CAPPUCCINO_FUNC_URL = getFuncURL(funcURLS, funcEnv);
  global.CAPPUCCINO_FUNC_ENV = funcEnv;

  if (funcGNB !== undefined) {
    const {
      env,
      elements,
      supportURL,
      loginURL,
      logoutURL
    } = funcGNB;

    global.CAPPUCCINO_GNB_ELEMENTS = elements;
    global.CAPPUCCINO_GNB_SUPPORTURL = supportURL;
    global.CAPPUCCINO_GNB_LOGINURL = loginURL;
    global.CAPPUCCINO_GNB_LOGOUTURL = logoutURL;
    global.CAPPUCCINO_GNB_ENV = env;
    global.CAPPUCCINO_GNB_LANG = 'en';
  }
}

export default setNodeVars;
