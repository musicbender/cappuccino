import { logError, logWarning } from './log-config';

const throwError = err => {
  console.log(logError(err));
  console.log(logWarning('Closing process...'));
  process.exit();
}

export default throwError;
