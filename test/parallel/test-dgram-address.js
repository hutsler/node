'use strict';
const common = require('../common');
const assert = require('assert');
const dgram = require('dgram');

// IPv4 Test
const socket_ipv4 = dgram.createSocket('udp4');
const family_ipv4 = 'IPv4';

socket_ipv4.on('listening', function() {
  const address_ipv4 = socket_ipv4.address();
  assert.strictEqual(address_ipv4.address, common.localhostIPv4);
  assert.strictEqual(typeof address_ipv4.port, 'number');
  assert.ok(isFinite(address_ipv4.port));
  assert.ok(address_ipv4.port > 0);
  assert.strictEqual(address_ipv4.family, family_ipv4);
  socket_ipv4.close();
});

socket_ipv4.on('error', function(e) {
  console.log('Error on udp4 socket. ' + e.toString());
  socket_ipv4.close();
});

socket_ipv4.bind(0, common.localhostIPv4);

// IPv6 Test
const localhost_ipv6 = '::1';
const socket_ipv6 = dgram.createSocket('udp6');
const family_ipv6 = 'IPv6';

socket_ipv6.on('listening', function() {
  const address_ipv6 = socket_ipv6.address();
  assert.strictEqual(address_ipv6.address, localhost_ipv6);
  assert.strictEqual(typeof address_ipv6.port, 'number');
  assert.ok(isFinite(address_ipv6.port));
  assert.ok(address_ipv6.port > 0);
  assert.strictEqual(address_ipv6.family, family_ipv6);
  socket_ipv6.close();
});

socket_ipv6.on('error', function(e) {
  console.log('Error on udp6 socket. ' + e.toString());
  socket_ipv6.close();
});

socket_ipv6.bind(0, localhost_ipv6);
