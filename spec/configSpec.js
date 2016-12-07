'use strict';

var Aggregator = require('../src/index');

/**
 * Main tests
 */
describe('Config Spec', function() {

  var aggregator = new Aggregator();

  // Reset all values after each test
  afterEach(function() {
    aggregator.reset();
  });

  it ('should throw an exeption config is not an object', function() {
    var config = 'asdfasd';

    expect(function() {
      aggregator.setConfig(config);
    }).toThrowError('Configuration must be object');
  });

  it ('should validate an invalid configuration', function() {
    var config = {
      something: []
    };

    expect(function() {
      aggregator.setConfig(config);
    }).toThrow();
  });

  it ('should throw an exeption if group by is not an array', function() {
    var config = {
      groupBy: 'abcde',
      increment: {
        impressions: {init: 0, type: 'integer'}
      }
    };

    expect(function() {
      aggregator.setConfig(config);
    }).toThrow();
  });

  it ('should return the configuration', function() {
    var config = {
      groupBy: ['campaingId', 'adId'],
      increment: {
        impressions: {init: 0, type: 'integer'},
        clicks: {init: 0, type: 'integer'},
        spent: {init: 0, type: 'float'}
      }
    };
    aggregator.setConfig(config);
    expect(aggregator.getConfig()).toEqual(config);
  });

  it ('should set the initial value', function() {
    var setConfig = {
      groupBy: ['something'],
      increment: {
        impressions: 1
      }
    };

    var getConfig = {
      groupBy: ['something'],
      increment: {
        impressions: {init: 1, type: 'integer'}
      }
    };

    aggregator.setConfig(setConfig);
    expect(aggregator.getConfig()).toEqual(getConfig);
  });


});
