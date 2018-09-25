import { expect } from 'chai';
import Nightmare from 'nightmare';
import { globalConfig } from './config';

let nightmare;
const baseURL = global.CAPPUCCINO_FUNC_URL;
const { nightmareConfig, useragent } = globalConfig;
const { defaultTimeout } = nightmareConfig;

describe('Page load tests', function () {
  this.timeout(defaultTimeout);

  beforeEach(() => {
    nightmare = new Nightmare(nightmareConfig);
  });

  it("Page loads without error", function (done) {
    nightmare
      .useragent(useragent)
      .goto(baseURL)
      .end()
      .then(result => {
        expect(result).to.exist;
        done();
      })
      .catch(done);
  });

  it('First interactive under 5 seconds', function (done) {
    nightmare
      .useragent(useragent)
      .goto(baseURL)
      .evaluate(() => {
        return {
          domInteractive: window.performance.timing.domInteractive,
          navigationStart: window.performance.timing.navigationStart
        };
      })
      .end()
      .then(result => {
        const { domInteractive, navigationStart } = result;
        const loadTime = domInteractive - navigationStart;

        expect(loadTime).to.be.below(5000);
        done();
      })
      .catch(done);
  });

  it('DOM loads under 6 seconds', function (done) {
    nightmare
      .useragent(useragent)
      .goto(baseURL)
      .evaluate(() => {
        return {
          domComplete: window.performance.timing.domComplete,
          navigationStart: window.performance.timing.navigationStart
        };
      })
      .end()
      .then(result => {
        const { domComplete, navigationStart } = result;
        const loadTime = domComplete - navigationStart;
        expect(loadTime).to.be.below(6000);
        done();
      })
      .catch(done);
  });

  it('Loading finished in under 8 seconds', function (done) {
    nightmare
      .useragent(useragent)
      .goto(baseURL)
      .evaluate(() => {
        return {
          loadEventEnd: window.performance.timing.loadEventEnd,
          navigationStart: window.performance.timing.navigationStart
        };
      })
      .end()
      .then(result => {
        const { loadEventEnd, navigationStart } = result;
        const loadTime = loadEventEnd - navigationStart;

        expect(loadTime).to.be.below(8000);
        done();
      })
      .catch(done);
  });
});
