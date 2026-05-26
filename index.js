"use strict";

const emptyResult = {};

const funds = {
  auto: {
    async getFund(_code) {
      return emptyResult;
    },

    async searchFunds(_query) {
      return emptyResult;
    },
  },
};

module.exports = {
  default: {
    funds,
  },
  funds,
};
