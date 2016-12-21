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
  867d29864a70187f6ad78d190f944193: {campaingId:28, impressions:6, spent:0.24},
  fc67dbd2d170a175032ad8e0b6e9f51f: {campaingId:45, impressions:8, spent:0.18}
}
```

In each collection you will get a unique hash ID (867d29864a70187f6ad78d190f944193)
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

## Check this example in action
[https://runkit.com/juanem1/585a8074d1cdae00144bd526](https://runkit.com/juanem1/585a8074d1cdae00144bd526)


## Development scripts
Run all tests
```
npm run test
```

Lint all code and show error/warnings
```
npm run lint
```

Lint all code, show error/warnings and automatically fix code
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
