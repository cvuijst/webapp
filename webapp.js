
var os = require("os");
var http = require('http');
var redis = require('redis');

var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  var version = "2.0";
  var log = {};
  log.header = 'webapp-redis';
  log.name = os.hostname();
  log.version = version;

  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
  }
  log.nics = addresses;

  var client = redis.createClient('6379', 'redis');
  client.on('connect', function() {
    console.log('Connected to Redis server');
  });
 
  client.incr('counter', function(err, reply) {
      if(err) return next(err);
      console.log('This page has been viewed ' + reply  + ' times!');
      console.log(JSON.stringify(log));
      response.end(" Hello, my hostname is "+ log.name +", this page has been viewed "+ reply  +"\n and my ip addresses are " + log.nics + "\n" );
  }); 
});
server.listen(8000);
