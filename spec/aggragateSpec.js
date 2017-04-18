'use strict';

var Aggregator = require('../src/index');
var mock = require('./mocks/stream_5');
var mockEdge = require('./mocks/edge_cases');

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
   * Test reset method
   */
  it ('should set to null keys that are not defined', function() {
    aggregator.aggregate({impressions: 1, clicks: 1, campaingId: 1});
    aggregator.aggregate({impressions: 1, clicks: 1, campaingId: 1});

    var res = aggregator.results();
    
    expect(res['be0d5b49d4e93d78b22427ce4b4d17c3'].adId).toEqual(null);
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

  /**
   * Test integer aggregation
   * Make a new aggregation and check first item
   */
  it ('should aggregate an array of objects', function() {
    aggregator.aggregate(mock);
    var res = aggregator.results();
    expect(Object.keys(res).length).toEqual(2);
  });

  it ('should return 0 for all values', function() {
    for (var i=0; i< mockEdge.length; i++) {
      aggregator.aggregate(mockEdge[i]);
    }

    var res = aggregator.results();
    var obj = res['4a30d2549b1a1ecae37790e2ac7a3770'];

    expect(obj.impressions).toEqual(0);
    expect(obj.clicks).toEqual(0);
    expect(obj.spent).toEqual(0);
  });

  it ('should return sum for 6 decimal floats', function() {
    for (var i=0; i< mockEdge.length; i++) {
      aggregator.aggregate(mockEdge[i]);
    }

    var res = aggregator.results();
    var spent = res['29ae806c615805fa243735f61a984189'].spent;

    expect(spent).toEqual(0.000111);
  });

  it ('should return accurate sum for negative numbers', function() {
    for (var i=0; i< mockEdge.length; i++) {
      aggregator.aggregate(mockEdge[i]);
    }

    var res = aggregator.results();
    // First element in results
    var spent = res['33f93e1b8c353cacc0c53a7369d14fc3'].spent;

    expect(spent).toEqual(0.10);
  });

});
