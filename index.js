'use strict';

const zlib = require('zlib');
const request = require('request');
const fs = require('fs');
const concat = require('concat-stream');

function makeRequest() {
  return request({
    method: 'GET',
    uri: 'https://api.nordvpn.com/server',
    headers: {
      'user-agent': 'NodeClient/0.0.1',
      'accept-encoding': 'gzip, deflate',
      'content-type': 'application/json'
    }
  });
};

function getServers() {
  let req = makeRequest();
  let output = req.on('response', resp => {
    let decompress;
    switch (resp.headers['content-encoding']) {
      case 'gzip':
        decompress = zlib.createGunzip();
        break;
      case 'deflate':
        decompress = zlib.createDeflate();
        break;
      default:
        decompress = concat(body => body);
        break;
      }
      let chunks = ''
      req
        .pipe(decompress)
        .on('data', chunk => chunks += chunk)
        .on('end',  () => req.response.body = JSON.parse(chunks))
  });
  return output;
};

module.exports = {
  'getServers': getServers,
  'makeRequest': makeRequest
}
