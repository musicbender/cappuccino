import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { modJSON, getFileList } from '../src/util/mod-json';

// mocks
const files = [
  'test/mocks/json-parse.json',
  'test/mocks/json-parse-2.json',
  'test/mocks/json-parse-3.json'
]

const globs = [
  'test/mocks/*.json',
  'test/*',
  'test/**/*.json'
]

// tests
describe('json-parse.js', function () {
  const extract = 'module.exports = ';

  it('JSON mock file with module.exports reads as exists', function () {
    expect(fs.existsSync(files[0])).to.be.true;
  });

  it('JSON file with module.exports can be opened and read', function (done) {
    fs.readFile(files[0], 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        done();
      }
      expect(data).to.exist;   
      done();
    })
  });

  describe('modJSON()', function () {
    it('"module.exports" can be removed from a single JSON file', function (done) {
      modJSON([files[0]], "remove", () => {
        fs.readFile(files[0], 'utf8', (err, data) => {
          if (err) {
            console.log(err);
            done();
          }
          const expected = data.indexOf(extract);
          expect(expected).to.equal(-1);

          modJSON([files[0]], "add", () => {
            done();
          })
        })
      });
    });

    it('"module.exports" can be added to a single JSON file', function (done) {
      modJSON([files[0]], "remove", () => {
        modJSON([files[0]], "add", () => {
          fs.readFile(files[0], 'utf8', (err, data) => {
            if (err) {
              console.log(err);
              done();
            }
            const expected = data.indexOf(extract);
            expect(expected).to.be.at.least(0);
            done();
          })
        })
      });
    });

    it('"module.exports" can be removed from multiple JSON files', function (done) {
      modJSON(files, "remove", () => {
        for (let i = 0; i < files.length; i++) {
          fs.readFile(files[i], 'utf8', (err, data) => {
            if (err) {
              console.log(err);
              done();
            }
            const expected = data.indexOf(extract);
            expect(expected).to.equal(-1);

            modJSON([files[i]], "add", () => {
              if (i + 1 === files. length) done();
            })
          })
        }
      });
    });

    it('"module.exports" can be added to multiple JSON files', function (done) {
      modJSON(files, "remove", () => {
        modJSON(files, "add", () => {
          for (let i = 0; i < files.length; i++) {
            fs.readFile(files[i], 'utf8', (err, data) => {
              if (err) {
                console.log(err);
                done();
              }
              const expected = data.indexOf(extract);
              expect(expected).to.be.at.least(0);

              if (i + 1 === files. length) done();
            });
          }
        });
      });
    });
  });

  describe('getJSONList()', function () {
    it('returns a list of files from one glob path', function () {
      getFileList([globs[0]])
    });
    it('returns a list of files from array of glob paths', function () {
      getFileList(globs);
    })
  })
});
