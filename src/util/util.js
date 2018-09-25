export const getFuncURL = (urls, funcEnv) => {
  if (funcEnv) {
    return urls[funcEnv];
  } else if (process.argv[2]) {
    return urls[process.argv[2].substring(2)];
  } else {
    return urls.dev;
  }
}

export const objNotEmpty = obj => {
  return typeof obj === 'object' && Object.keys(obj).length > 0;
}

export const getReporter = config => {
  const { minimal, showBrowserView } = config;
  switch (true) {
    case showBrowserView:
      return require('@ncw/mochawesome');
    case minimal:
      return 'min';
    default:
      return 'spec';
  }
}

export const noop = () => null;
