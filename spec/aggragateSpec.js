'use strict';

var Aggregator = require('../src/index');
var mock = require('./mocks/stream_5');

/**
 * Main tests
 */
describe('Aggragation Spec', function() {

  var aggregator = new Aggregator();

  // Set configuration in each test run
  beforeEach(function() {
    aggregator.setConfig({
      groupBy: ['campaingId', 'adId'],
      increment: {
        impressions: {init: 0, type: 'integer'},
        clicks: {init: 0, type: 'integer'},
        spent: {init: 0, type: 'float'}
      }
    });
  });
  
  // Reset all values after each test
  afterEach(function() {
    aggregator.reset();
  });

  /**
   * Test reset method
   */
  it ('should return an empty object', function() {
    for (var i=0; i< mock.length; i++) {
      aggregator.aggregate(mock[i]);
    }

    aggregator.reset();
    var res = aggregator.results();
    
    expect(res).toEqual({});
  });

  /**
   * Test number of results
   */
  it ('should return 2 rows in total', function() {
    for (var i=0; i< mock.length; i++) {
      aggregator.aggregate(mock[i]);
    }

    var res = aggregator.results();
    
    expect(Object.keys(res).length).toEqual(2);
  });

  /**
   * Test integer aggregation
   * Make a new aggregation and check first item
   */
  it ('should return the sum of one integer item', function() {
    for (var i=0; i< mock.length; i++) {
      aggregator.aggregate(mock[i]);
    }

    var res = aggregator.results();
    // First element in results
    var impressions = res['a541b7ae3ab8ef7cf8cd3c47f823fc88'].impressions;

    expect(impressions).toEqual(9);
  });

  /**
   * Test float aggregation
   * Make a new aggregation and check first item
   */
  it ('should return the sum of one float item', function() {
    for (var i=0; i< mock.length; i++) {
      aggregator.aggregate(mock[i]);
    }

    var res = aggregator.results();
    // First element in results
    var spent = res['a541b7ae3ab8ef7cf8cd3c47f823fc88'].spent;

    expect(spent).toEqual(2.2);
  });


});
