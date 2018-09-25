import { expect } from 'chai';
import { globalConfig, gnb as config } from './config';
import { hasBrazilElm, removeEn } from '../util/global-func-tests';
import Nightmare from 'nightmare';
import nightmareWM from 'nightmare-window-manager';

nightmareWM(Nightmare);

//*********************************//
//--//--//--// CONFIGS //--//--//--//
//*********************************//

// node envs from the specific project being tested
const {
  CAPPUCCINO_FUNC_URL,
  CAPPUCCINO_FUNC_ENV,
  CAPPUCCINO_GNB_ELEMENTS,
  CAPPUCCINO_GNB_SUPPORTURL,
  CAPPUCCINO_GNB_LOGINURL,
  CAPPUCCINO_GNB_LOGOUTURL,
  CAPPUCCINO_GNB_ENV,
  CAPPUCCINO_GNB_LANG
} = global;

let nightmare;
const { nightmareConfig, useragent } = globalConfig;
const { defaultTimeout } = nightmareConfig;
const baseURL = CAPPUCCINO_FUNC_URL;
const env = CAPPUCCINO_FUNC_ENV === "live" ? "live" : "qa";
const qaPrefix = env === "qa" ? "qa." : "";
const protocall = env === "qa" ? "http://" : "https://";
const imgPath = `${protocall}${qaPrefix}${config.imgBasePath}`;


//*******************************//
//--//--//--// TESTS //--//--//--//
//*******************************//

describe('GNB', function () {
  this.timeout(defaultTimeout);

  beforeEach(() => {
    nightmare = new Nightmare();
  });

  it('Spritesheet image loads', function (done) {
    nightmare
      .useragent(useragent)
      .goto(imgPath)
      .end()
      .then(result => {
        expect(result).to.exist;
        expect(result.code).to.equal(200);
        done();
      })
      .catch(done);
  });

  //--//--//--// HEADER //--//--//--//
  describe('Header', function () {
    //--//--//--// BASE TESTS //--//--//--//
    this.timeout(defaultTimeout);

    beforeEach(() => {
      nightmare = new Nightmare(nightmareConfig);
    });

    it('GNB header loads', function (done) {
      nightmare
        .useragent(useragent)
        .goto(baseURL)
        .wait(config.header)
        .evaluate(header => {
          return document.querySelectorAll(header).length;
        }, config.header)
        .end()
        .then(result => {
          expect(result).to.equal(1);
          done();
        })
        .catch(done);
    });

    it('NCSOFT icon parent element loads', function (done) {
      nightmare
        .useragent(useragent)
        .goto(baseURL)
        .wait('.sprite.ncsoft')
        .evaluate(elm => {
          return document.querySelectorAll(elm).length;
        }, '.sprite.ncsoft')
        .end()
        .then(result => {
          expect(result).to.equal(1);
          done();
        })
        .catch(done);
    });

    it('NCSOFT logo link works', function (done) {
      const selector = '.sprite.ncsoft > a';
      nightmare
        .useragent(useragent)
        .goto(baseURL)
        .wait(selector)
        .click(selector)
        .wait(2000)
        .url()
        .end()
        .then(result => {
          expect(result).to.equal('http://us.ncsoft.com/en/');
          done();
        })
        .catch(done);
    });

    //--//--//--// HEADER GAMES DROPDOWN //--//--//--//
    if (CAPPUCCINO_GNB_ELEMENTS.indexOf("games") > -1) {
      describe('Games Dropdown', function () {
        this.timeout(defaultTimeout);

        beforeEach(() => {
          nightmare = new Nightmare(nightmareConfig);
        });

        it('Games dropdown loads', function (done) {
          const selector = config.header + ' .games';
          nightmare
            .useragent(useragent)
            .goto(baseURL)
            .wait(selector)
            .evaluate(selector => {
              return document.querySelectorAll(selector).length;
            }, selector)
            .end()
            .then(result => {
              expect(result).to.equal(1);
              done();
            })
            .catch(done);
        });

        config.games.forEach((game, i) => {
          it(`Link number ${i+1} goes to ${game.url}`, function (done) {
            const selector = `${config.header} .games > .gnb-sm > ul > .game:nth-child(${i+1}) > a`;

            nightmare
              .useragent(useragent)
              .goto(baseURL)
              .wait(selector)
              .click(selector)
              .cookies.set(game.cookies)
              .wait(10000)
              .url()
              .end()
              .then(result => {
                expect(result).to.equal(game.url);
                done();
              })
              .catch(done);
          });
        });
      });
    }

    //--//--//--// HEADER UNAUTHENTICATED LINKS //--//--//--//
    if (CAPPUCCINO_GNB_ELEMENTS.indexOf("unauthenticated") > -1) {
      describe('Unauthenticated Links', function () {
        this.timeout(30000);

        beforeEach(() => {
          nightmare = new Nightmare(nightmareConfig);
        });

        it('Create account link works', function (done) {
          const selector = `${config.header} .gnb-right > .signup > a`;
          const expected = 'https://qa.account.ncsoft.com/signup/index';
          nightmare
            .useragent(useragent)
            .goto(baseURL)
            .wait(selector)
            .click(selector)
            .wait(2000)
            .url()
            .end()
            .then(result => {
              const isExpected = result.indexOf(expected) > -1;
              expect(isExpected).to.be.true;
              done();
            })
            .catch(done);
        });

        it('Login link works', function (done) {
          const selector = `${config.header} .gnb-right > .login > a`;
          const expected = `https://${qaPrefix}${CAPPUCCINO_GNB_LOGINURL}`;
          nightmare
            .useragent(useragent)
            .goto(baseURL)
            .wait(selector)
            .click(selector)
            .wait(2000)
            .url()
            .end()
            .then(result => {
              const containsUrl = result.indexOf(expected) > -1;
              expect(containsUrl).to.be.true;
              done();
            })
            .catch(done);
        });
      });
    }

    //--//--//--// HEADER SUPPORT LINK //--//--//--//
    if (CAPPUCCINO_GNB_ELEMENTS.indexOf("support") > -1) {
      describe('Support link', function () {
        this.timeout(defaultTimeout);

        beforeEach(() => {
          nightmare = new Nightmare(nightmareConfig);
        });

        it('Support link works', function (done) {
          const selector = `${config.header} .gnb-right > .support > a`;
          nightmare
            .useragent(useragent)
            .goto(baseURL)
            .wait(selector)
            .click(selector)
            .wait(2000)
            .url()
            .end()
            .then(result => {
              expect(result).to.equal(CAPPUCCINO_GNB_SUPPORTURL);
              done();
            })
            .catch(done);
        });
      });
    }

    if(hasBrazilElm(CAPPUCCINO_GNB_ELEMENTS)) {
      describe('Brazil/Latam Dropdown', function () {
        this.timeout(defaultTimeout);

        beforeEach(() => {
          nightmare = new Nightmare(nightmareConfig);
        });

        it('Brazil/Latam dropdown loads', function (done) {
          const selector = `${config.header} .gnb-right > .brazil.globe`;
          nightmare
            .useragent(useragent)
            .goto(baseURL)
            .wait(selector)
            .evaluate(selector => {
              return document.querySelectorAll(selector).length;
            }, selector)
            .end()
            .then(result => {
              expect(result).to.equal(1);
              done();
            })
            .catch(done);
        });
      });
    }
  });

  //--//--//--// FOOTER //--//--//--//
  describe('Footer', function () {
    this.timeout(defaultTimeout);

    beforeEach(() => {
      nightmare = new Nightmare(nightmareConfig);
    });

    //--//--//--// BASE TESTS //--//--//--//
    it('GNB footer loads', function (done) {
      nightmare
        .useragent(useragent)
        .goto(baseURL)
        .wait(config.footer)
        .evaluate(footer => {
          return document.querySelectorAll(footer).length;
        }, config.footer)
        .end()
        .then(result => {
          expect(result).to.equal(1);
          done();
        })
        .catch(done);
    });

    it('NCSOFT logo parent element loads', function (done) {
      const selector = `${config.footer} .gnb-left > li > .sprite.ncsoft-icon`;
      nightmare
        .useragent(useragent)
        .goto(baseURL)
        .wait(selector)
        .evaluate(selector => {
          return document.querySelectorAll(selector).length;
        }, selector)
        .end()
        .then(result => {
          expect(result).to.equal(1);
          done();
        })
        .catch(done);
    });

    it('NCSOFT logo link works', function (done) {
      const selector = `${config.footer} .gnb-left > li > .sprite.ncsoft-icon > a`;
      nightmare
        .useragent(useragent)
        .goto(baseURL)
        .wait(selector)
        .click(selector)
        .wait(5000)
        .url()
        .end()
        .then(result => {
          expect(result).to.equal('http://us.ncsoft.com/en/');
          done();
        })
        .catch(done);
    });

    it('NCSOFT link works', function (done) {
      const selector = `${config.footer} .gnb-right > li:nth-child(1) > a`;
      nightmare
        .useragent(useragent)
        .goto(baseURL)
        .wait(selector)
        .click(selector)
        .wait(5000)
        .url()
        .end()
        .then(result => {
          expect(result).to.equal('http://us.ncsoft.com/en/');
          done();
        })
        .catch(done);
    });

    it('Legal documentation link works', function (done) {
      const selector = `${config.footer} .gnb-right > li:nth-child(2) > a`;
      nightmare
        .useragent(useragent)
        .goto(baseURL)
        .wait(selector)
        .click(selector)
        .wait(5000)
        .url()
        .end()
        .then(result => {
          expect(result).to.equal('http://us.ncsoft.com/en/legal/');
          done();
        })
        .catch(done);
    });

    describe('Language Dropdown', function () {
      this.timeout(defaultTimeout);

      beforeEach(() => {
        nightmare = new Nightmare(nightmareConfig);
      });

      const baseSelector = `${config.footer} .gnb-right > li:nth-child(3) > .gnb-lang > ul`;
      const langs = ["en", "uk", "fr", "de"];

      langs.forEach((lang, i) => {
        it(`Click ${lang} in lang dropdown should go to correct url`, function (done) {
          const selector = `${baseSelector} > li:nth-child(${i + 1}) > a`;
          const expected = `${removeEn(baseURL)}/${lang}`;
          nightmare
            .useragent(useragent)
            .goto(baseURL)
            .wait(selector)
            .click(selector)
            .wait(5000)
            .url()
            .end()
            .then(result => {
              const isExpected = result.indexOf(expected) > -1;
              expect(isExpected).to.be.true;
              done();
            })
            .catch(done);
        });
      });
    });
  });
});
