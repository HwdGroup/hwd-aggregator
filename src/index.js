'use strict';

var crypto = require('crypto');
var Big = require('bignumber.js');

/**
 * Export main function
 */
module.exports = function () {
  
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

    return crypto.createHash('md5')
      .update(JSON.stringify(objToHash))
      .digest('hex');
  }

  /**
   * Logic for aggregate values
   * @private
   * @param {Object} record Object to aggregate
   * @return Void
   */
  function makeAggregation(record) {
    var id = makeHash(record);
    var item = {};

    item = ( ! base[id] ) ?
      makeBaseRecord(record):
      base[id];

    for (var key in config.increment) {
      if (record[key] !== undefined) {
        if (config.increment[key].type === 'integer') {
          item[key] += parseInt(record[key]);
        }
        if (config.increment[key].type === 'float') {
          item[key] = parseFloat(
            new Big(item[key])
              .plus(record[key])
              .toString()
            );
        }
      }
    }

    base[id] = item;
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
   * @param rawRecord Can be Object or Array
   * @returns Void
   */
  function aggregate(rawRecord) {
    if (Array.isArray(rawRecord)) {
      for (var i = 0, len = rawRecord.length; i < len; i++) {
        makeAggregation(rawRecord[i]);
      }
    } else {
      makeAggregation(rawRecord);
    }
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
   * Return only public methods
   */
  return {
    setConfig: setConfig,
    getConfig: getConfig,
    aggregate: aggregate,
    results: results,
    reset: reset
  };
  
};
