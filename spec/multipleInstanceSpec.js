'use strict';

var Aggregator = require('../src/index');
var mock1 = require('./mocks/stream_5');
var mock2 = require('./mocks/stream_10');

/**
 * Main tests
 */
describe('Aggragation Spec', function() {

  var aggregator1 = new Aggregator();
  var aggregator2 = new Aggregator();

  // Set configuration in each test run
  beforeEach(function() {
    aggregator1.setConfig({
      groupBy: ['campaingId', 'adId'],
      increment: {
        impressions: {init: 0, type: 'integer'}
      }
    });

    aggregator2.setConfig({
      groupBy: ['campaingId', 'adId'],
      increment: {
        clicks: {init: 0, type: 'integer'}
      }
    });
  });

  /**
   * Test number of results
   */
  it ('should return different results for each instance', function() {
    for (var i=0; i< mock1.length; i++) {
      aggregator1.aggregate(mock1[i]);
    }

    for (var z=0; z< mock2.length; z++) {
      aggregator2.aggregate(mock2[z]);
    }

    var res1 = aggregator1.results();
    var res2 = aggregator2.results();
    
    expect(Object.keys(res1).length).toEqual(2);
    expect(Object.keys(res2).length).toEqual(10);
  });

});
