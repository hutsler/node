'use strict';
const common = require('../common');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

let watchSeenOne = 0;
let watchSeenTwo = 0;
let watchSeenThree = 0;
let watchSeenFour = 0;

const testDir = common.tmpDir;

const filenameOne = 'watch.txt';
const filepathOne = path.join(testDir, filenameOne);

const filenameTwo = 'hasOwnProperty';
const filepathTwo = filenameTwo;
const filepathTwoAbs = path.join(testDir, filenameTwo);

const filenameThree = 'charm'; // because the third time is

const filenameFour = 'get';

process.on('exit', function() {
  fs.unlinkSync(filepathOne);
  fs.unlinkSync(filepathTwoAbs);
  fs.unlinkSync(filenameThree);
  fs.unlinkSync(filenameFour);
  assert.strictEqual(1, watchSeenOne);
  assert.strictEqual(2, watchSeenTwo);
  assert.strictEqual(1, watchSeenThree);
  assert.strictEqual(1, watchSeenFour);
});


fs.writeFileSync(filepathOne, 'hello');

assert.throws(
    function() {
      fs.watchFile(filepathOne);
    },
    function(e) {
      return e.message === 'watchFile requires a listener function';
    }
);

assert.doesNotThrow(
    function() {
      fs.watchFile(filepathOne, function(curr, prev) {
        fs.unwatchFile(filepathOne);
        ++watchSeenOne;
      });
    }
);

setTimeout(function() {
  fs.writeFileSync(filepathOne, 'world');
}, 1000);


process.chdir(testDir);

fs.writeFileSync(filepathTwoAbs, 'howdy');

assert.throws(
    function() {
      fs.watchFile(filepathTwo);
    },
    function(e) {
      return e.message === 'watchFile requires a listener function';
    }
);

assert.doesNotThrow(
    function() {
      function a(curr, prev) {
        fs.unwatchFile(filepathTwo, a);
        ++watchSeenTwo;
      }
      function b(curr, prev) {
        fs.unwatchFile(filepathTwo, b);
        ++watchSeenTwo;
      }
      fs.watchFile(filepathTwo, a);
      fs.watchFile(filepathTwo, b);
    }
);

setTimeout(function() {
  fs.writeFileSync(filepathTwoAbs, 'pardner');
}, 1000);

assert.doesNotThrow(
    function() {
      function a(curr, prev) {
        assert.ok(0); // should not run
      }
      function b(curr, prev) {
        fs.unwatchFile(filenameThree, b);
        ++watchSeenThree;
      }
      fs.watchFile(filenameThree, a);
      fs.watchFile(filenameThree, b);
      fs.unwatchFile(filenameThree, a);
    }
);

setTimeout(function() {
  fs.writeFileSync(filenameThree, 'pardner');
}, 1000);

setTimeout(function() {
  fs.writeFileSync(filenameFour, 'hey');
}, 200);

setTimeout(function() {
  fs.writeFileSync(filenameFour, 'hey');
}, 500);

assert.doesNotThrow(
    function() {
      function a(curr, prev) {
        ++watchSeenFour;
        assert.strictEqual(1, watchSeenFour);
        fs.unwatchFile('.' + path.sep + filenameFour, a);
      }
      fs.watchFile(filenameFour, a);
    }
);
