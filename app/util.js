'use strict';

const utils = {
  makeRes: (msg, status, data = {}) => {
    return Object.assign({ errmsg: msg, errcode: status }, data);
  },

  randomNum: () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  },
};

module.exports = utils;
