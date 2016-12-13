'use strict';

/*eslint no-console: "off"*/

var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var Aggregator = require('../src/index');

// Set aggregator instance and configuration
var aggregator = new Aggregator();
aggregator.setConfig({
  groupBy: [
    'campaignId', 
    'creativeId', 
    'lineId', 
    'orderId', 
    'clientId', 
    'agencyId', 
    'sourceId', 
    'productId'
  ],
  increment: {
    payout: {init: 0, type: 'float'},
    cost: {init: 0, type: 'float'}
  }
});

if ( process.argv[2] ) {
  var lines = 0;
  var instream = fs.createReadStream(process.argv[2]);
  var outstream = new stream;
  var rl = readline.createInterface(instream, outstream);

  var start = process.hrtime();
  console.log('Started');

  // Event on each line
  rl.on('line', function(line) {
    lines++;
    aggregator.aggregate(JSON.parse(line));
  });

  // When finish reading all the file
  rl.on('close', function() {
    var finished = process.hrtime(start);
    console.log('Finished at: ' + finished);
    console.log(lines + ' lines processed');
    console.log('Benchmark took ' + finished[0] + ' seconds or ' + finished[0] * 1e9 + finished[1] + ' nanoseconds');

    //var res = aggregator.results();
    //console.log(res);
  });

} else {
  console.log('File path not defined');
  console.log('Use: npm run benchmark -- ./benchmark/someFile.log');
}


