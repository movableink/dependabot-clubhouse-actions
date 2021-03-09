'use strict';

module.exports = {
  debug: jest.fn(),
  error: jest.fn(),

  getInput(identifier) {
    return identifier;
  },

  group(_label, callback) {
    return callback();
  },
};
