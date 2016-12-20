# HWD Aggregator
Agnostic library for object aggregations

## Install
```
npm install hwd-aggregator --save
```

## How it works
This library is tinking for object aggregation.

Consider this example with this set of records:

```
{"campaingId":28,"impressions":1,"spent":0.01}
{"campaingId":28,"impressions":2,"spent":0.10}
{"campaingId":28,"impressions":3,"spent":0.13}
{"campaingId":45,"impressions":4,"spent":0.09}
{"campaingId":45,"impressions":4,"spent":0.09}
```

After aggregate and grouping by campaignId you will get:
```
{
  254a86bfca1f75c6ac8541f866707e90: {campaingId:28, impressions:6, spent:0.24},
  a541b7ae3ab8ef7cf8cd3c47f823fc88: {campaingId:45, impressions:8, spent:0.18}
}
```

In each collection you will get a unique hash ID (254a86bfca1f75c6ac8541f866707e90)
generated with values of groupBy configuration. 

## Usage
```javascript
const Aggregator = require('hwd-aggregator');
const aggregator = new Aggregator();

// Configure how to aggregate
aggregator.setConfig({
  groupBy: ['campaingId'],
  increment: {
    impressions: {init: 0, type: 'integer'},
    spent: {init: 0, type: 'float'}
  }
});

// Aggregate single object
aggregator.aggregate({some: 'object'});

// Other option is batch aggregation
var array = [
  {some: 'object'}, 
  {other: 'object'}
];
aggregator.aggregate(array);


// Get results
let results = aggregator.results();

// Reset internal aggegator counter
aggregator.reset();

```

## Scripts
Run all tests
```
npm run test
```

Lint all code and show error/warnings
```
npm run lint
```

Lint all code show error/warnings and automatically fix code
```
npm run lint-fix
```

Run istanbul to generate coverage folder 
```
npm run coverage
```

Run benchmark in base of one file (preferably plain text with one json per line)
```
npm run benchmark -- ./benchmark/someFile.log
```
