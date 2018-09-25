import bs from 'browser-sync';
import { logError, logSuccess } from './util/log-config';

// finished callback for bs
const finish = err => {
  if (err) {
    console.log(logError(err));
  }

  console.log(logSuccess('\n***** Test report has finished opening in browser *****\n'));
}

// server
const testServer = config => {
  const {
    baseDir,
    index,
    port,
  } = config;
  const server = { index, baseDir };

  // create browser-sync server instance
  bs.create('Opening testing server');

  // init and run bs
  bs.init({
    serveStatic: [baseDir],
    port,
    server,
  }, (err, bs) => {
    finish(err);
  });

  return bs;

  // watch for changes
  // if (watch) {
  //   bs.watch(files, { ignored }).on("change", () => {
  //     console.log(logProcessing('Changes detected. Reloading tests...'));
  //     setupTest()
  //       .then(() => {
  //         invalidate(files);
  //         runMocha();
  //         bs.reload();
  //       })
  //       .catch(err => {
  //         console.log(logError(err));
  //       });
  //   });
  // }
}

export default testServer;
