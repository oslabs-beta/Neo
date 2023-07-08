"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocketSubject_1 = require("./WebSocketSubject");
function webSocket(urlConfigOrSource) {
    return new WebSocketSubject_1.WebSocketSubject(urlConfigOrSource);
}
exports.webSocket = webSocket;
//# sourceMappingURL=webSocket.js.mappi');

var WebSocket = function(request, socket, body, protocols, options) {
  options = options || {};

  this._stream = socket;
  this._driver = driver.http(request, { maxLength: options.maxLength, protocols: protocols });

  var self = this;
  if (!this._stream || !this._stream.writable) return;
  if (!this._stream.readable) return this._stream.end();

  var catchup = function() { self._stream.removeListener('data', catchup) };
  this._stream.on('data', catchup);

  API.call(this, options);

  process.nextTick(function() {
    self._driver.start();
    self._driver.io.write(body);
  });
};
util.inherits(WebSocket, API);

WebSocket.isWebSocket = function(request) {
  return driver.isWebSocket(request);
};

WebSocket.validateOptions = function(options, validKeys) {
  driver.validateOptions(options, validKeys);
};

WebSocket.WebSocket   = WebSocket;
WebSocket.Client      = require('./websocket/client');
WebSocket.EventSource = require('./eventsource');

module.exports        = WebSocket;
