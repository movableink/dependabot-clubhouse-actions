"use strict";

module.exports = {
  getInput(identifier) {
    return identifier;
  },

  group(_label, callback) {
    return callback();
  }
};
