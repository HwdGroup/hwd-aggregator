'use strict';

var MD5 = require('crypto-js/md5');

/**
 * Main configuration
 * @private
 */
var config = {};

/**
 * Base object in witch we going to aggregate all values
 * @private
 */
var base = {};

/**
 * Generate base record for aggregation
 * @param {Object} rawRecord
 * @private 
 */
function makeBaseRecord(rawRecord) {
  var increment = {};

  // Add incremental fields
  for (var key in config.increment) {
    increment[key] = config.increment[key].init || 0;
  }

  // Add metadata
  for (var i = 0, len = config.groupBy.length; i < len; i++) {
    var field = config.groupBy[i];
    increment[field] = rawRecord[field];
  }

  return increment;
}

/**
 * Generate normalized configuration
 * Make validations, etc..
 * @param {Object} obj Raw config object
 * @private 
 */
function makeConfig(obj) {
  var normalizedConf = {};

  if ( typeof obj !== 'object') {
    throw new Error('Configuration must be object');
  }

  if (obj.groupBy === undefined || obj.increment === undefined) {
    throw new Error('Configuration object must have groupBy and increment defined');
  }
   
  if ( ! Array.isArray(obj.groupBy)) {
    throw new Error('groupBy key must be array');
  }

  // Set validated group by
  normalizedConf.groupBy = obj.groupBy;

  // Set increment as empty object
  normalizedConf.increment = {};

  for (var key in obj.increment) {
    
    // if increment is number
    if (typeof obj.increment[key] === 'number') {
      normalizedConf.increment[key] = {
        init: obj.increment[key], 
        type: 'integer'
      };
    } else {
      
      // if increment is object
      normalizedConf.increment[key] = {
        init: obj.increment[key].init || 0, 
        type: obj.increment[key].type || 'integer'
      };
    }
  }

  return normalizedConf;
}

/**
 * Generate MD5 hash in base of config params
 * @param {Object} record
 * @returns {String} MD5 string
 */
function makeHash(record) {
  var objToHash = {};
  for (var item in record) {
    for (var i = 0, gLen = config.groupBy.length; i < gLen; i++) {
      if (item === config.groupBy[i]) {
        objToHash[item] = record[item];
      }
    }
  }

  return MD5(JSON.stringify(objToHash)).toString();
}

/**************************************
 * PUBLIC METHODS BELOW THIS LINE
 *************************************/

/**
 * Set configuration
 * @public
 * @param {Array} arr Config object
 */
function setConfig(obj) {
  config = makeConfig(obj);
}

/**
 * Return stored configuration
 * @public
 * @returns {Object}
 */
function getConfig() {
  return config;
}

/**
 * Logic to aggregate values to base object
 * @public
 * @returns Void
 */
function aggregate(rawRecord) {
  
  var id = makeHash(rawRecord);
  var item = {};

  item = ( ! base[id] ) ?
    makeBaseRecord(rawRecord):
    base[id];

  for (var key in config.increment) {
    if (rawRecord[key] !== undefined) {
      if (config.increment[key].type === 'integer') {
        item[key] += parseInt(rawRecord[key]);
      }
      if (config.increment[key].type === 'float') {
        item[key] += parseFloat(rawRecord[key]);
      }
    }
  }

  base[id] = item;
}

/**
 * Return result of all aggregated values
 * @public
 * @returns {Object}
 */
function results() {
  return base;
}

/**
 * Reset all stored values
 * @return Void
 */
function reset() {
  config = {};
  base = {};
}

/**
 * Export public functions
 */
module.exports = function () {
  return {
    setConfig: setConfig,
    getConfig: getConfig,
    aggregate: aggregate,
    results: results,
    reset: reset
  };
};
