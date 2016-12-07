# HWD Aggregator
Agnostic library for object aggregations

## Install
`npm install hwd-aggregator --save`

## How it works
This library is tinking for object aggregation.

Consider this example with this set of records:

`
{"campaingId":28,"impressions":1,"spent":0.01}
{"campaingId":28,"impressions":2,"spent":0.10}
{"campaingId":28,"impressions":3,"spent":0.09}
{"campaingId":28,"impressions":4,"spent":0.10}
`

After aggregate and grouping by campaignId you will get:
`
{
  254a86bfca1f75c6ac8541f866707e90: {impressions:10, spent:0.30}
}
`

In each collection you will get a unique hash ID (254a86bfca1f75c6ac8541f866707e90)
generated with values of groupBy configuration. 

## Usage
`
const aggregator = require('hwd-aggregator');

// Configure how to aggregate
aggregator.setConfig({
  groupBy: ['campaingId'],
  increment: {
    impressions: {init: 0, type: 'integer'},
    spent: {init: 0, type: 'float'}
  }
});

// Aggregate object
aggregator.aggregate({some: 'object});

// Get results
let results = aggregator.results();
`

