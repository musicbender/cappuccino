import { expect } from 'chai';
import { filterFiles } from '../src/util/global-func-tests';

// mocks
import mockFiles from './mocks/global-func-mocks';

// tests
describe('filterFiles()', function () {
  const tests = [
    { assert: mockFiles[0], expected: ["load", "gnb"] },
    { assert: mockFiles[1], expected: ["load", "gnb", "wut", "huh", "yer", "uhh"] },
    { assert: mockFiles[2], expected: ["load", "gnb", "wut"] },
    { assert: mockFiles[3], expected: [] },
    { assert: mockFiles[4], expected: ["load"] },
    { assert: mockFiles[5], expected: [] },
    { assert: mockFiles[6], expected: [] },
  ];

  tests.forEach(test => {
    const { assert, expected } = test;

    it(`If given ${assert}, give back ${expected}`, function () {
      expect(filterFiles(assert)).to.deep.equal(expected);
    });
  });
});
