'use strict';

const GlobOptionError = require('.');
const test = require('tape');
const validateGlobOpts = require('validate-glob-opts');

test('GlobOptionError', t => {
  const error0 = new GlobOptionError(validateGlobOpts({realPath: true}));
  t.strictEqual(
    error0.toString(),
    'Error: node-glob doesn\'t have `realPath` option. Probably you meant `realpath`.',
    'should return an error if when it takes an array of errors.'
  );

  t.deepEqual(
    [...error0].map(String),
    ['Error: node-glob doesn\'t have `realPath` option. Probably you meant `realpath`.'],
    'should add [Symbol.iterator] property to the error.'
  );

  t.strictEqual(
    new GlobOptionError(validateGlobOpts({
      cache: Buffer.from('Hi'),
      nomount: new Uint8Array()
    })).toString(),
    `TypeError: 2 errors found in the glob options:
  1. node-glob expected \`nomount\` option to be a Boolean value, but got Uint8Array [  ].
  2. node-glob expected \`cache\` option to be an object, but got <Buffer 48 69>.`,
    'should merge multiple errors into single one.'
  );

  t.strictEqual(
    [...new GlobOptionError(validateGlobOpts({
      sync: null,
      realpathCache: Infinity
    }))].length,
    2,
    'should make the return value iterable.'
  );

  t.throws(
    () => new GlobOptionError(validateGlobOpts({
      matchBase: true,
      realpath: true
    })),
    /^RangeError.*Expected an array with at least one error, but got \[] \(empty array\)\./,
    'should throw an error when it takes an empty array.'
  );

  t.throws(
    () => new GlobOptionError(Math.sign),
    /^TypeError.*Expected an array of errors, but got a non-array value \[Function: sign]\./,
    'should throw an error when it takes a non-array argument.'
  );

  t.throws(
    () => new GlobOptionError(),
    /^TypeError.*Expected 1 argument \(Array<errors>\), but got no arguments\./,
    'should throw an error when it takes no arguments.'
  );

  t.throws(
    () => new GlobOptionError([new Error('0')], [new TypeError('1')]),
    /^TypeError.*Expected 1 argument \(Array<errors>\), but got 2 arguments\./,
    'should throw an error when it takes too many arguments.'
  );

  t.end();
});

