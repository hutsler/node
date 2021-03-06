'use strict';
require('../common');

// no warnings should happen!
const trace = console.trace;
console.trace = function() {
  trace.apply(console, arguments);
  throw new Error('no tracing should happen here');
};

const http = require('http');
const net = require('net');

const numRequests = 20;
let first = false;

const server = http.createServer(function(req, res) {
  if (!first) {
    first = true;
    req.socket.on('close', function() {
      server.close();
    });
  }

  res.end('ok');
  // Oh no!  The connection died!
  req.socket.destroy();
});

server.listen(0, function() {
  const client = net.connect({ port: this.address().port,
                               allowHalfOpen: true });
  for (let i = 0; i < numRequests; i++) {
    client.write('GET / HTTP/1.1\r\n' +
                 'Host: some.host.name\r\n' +
                 '\r\n\r\n');
  }
  client.end();
  client.pipe(process.stdout);
});
