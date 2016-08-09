// A sample webserver with responds with version, hostname, IPs used and number of visits

var http = require('http'); 
var os = require("os"); // os module provides a few basic operating-system functions to capture hostname and IPs
var redis = require('redis'); // we use redis to store the visit counter

var server = http.createServer(function (request, response) {
  
  // We start building building an "OK" response 
  response.writeHead(200, {"Content-Type": "text/plain"});

  // and also log the variables we are going to use in our response
  var version = "2.0";
  var log = {};
  log.header = 'webapp';
  log.name = os.hostname();
  log.version = version;

  // We iterate over network interfaces to obtain IPv4 addreses
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

  // We try to reach our redis server (redisdb) ....by NAME 
  var client = redis.createClient('6379', 'redisdb');
  client.on('connect', function(err,reply) {
    if (err) return next(err);
    
    console.log('Connected to Redis server');
 
    client.incr('counter', function(err, reply) {
      if(err) return next(err);
      console.log('This page has been viewed ' + reply  + ' times!');
      console.log(JSON.stringify(log));
      response.end(" Hello, I'm version "+ log.version +".My hostname is "+ log.name +", this page has been viewed "+ reply  +"\n and my ip addresses are " + log.nics + "\n" );
     }); // client.incr
  }); // client.on 
}); // http.createHttpServer

// Let´s wait for http request on port 8000
server.listen(8000);
