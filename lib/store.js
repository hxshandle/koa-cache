/**!
 * koa-generic-session - lib/store.js
 * Copyright(c) 2014
 * MIT Licensed
 *
 * Authors:
 *   dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 */

'use strict';

/**
 * Module dependencies.
 */

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('koa-cache:store');
var _ = require('lodash');
var copy = require('copy-to');

var defaultOptions = {
  prefix: 'koa-cache:'
};

function Store(client, options) {
  this.client = client;
  this.options = {};
  copy(options).and(defaultOptions).to(this.options);
  EventEmitter.call(this);

  // delegate client connect / disconnect event
  if (typeof client.on === 'function') {
    client.on('disconnect', this.emit.bind(this, 'disconnect'));
    client.on('connect', this.emit.bind(this, 'connect'));
  }
}

util.inherits(Store, EventEmitter);

Store.prototype.get = function *(key,func) {
  var data;
  var originalKey = key;
  key = this.options.prefix + key;
  debug('GET %s', key);
  data = yield this.client.get(key);
  if (!data) {
    debug('GET empty');
    // call function
    if(_.isFunction(func)){
      debug("execute data provider and cache it");
      data = func.call();
      yield this.set(originalKey,data);
    }
    return data;
  }
  debug('GOT %j', data);
  return data;
};

Store.prototype.set = function *(key, val) {
  var ttl = this.options.ttl;

  key = this.options.prefix + key;
  debug('SET key: %s, value: %s, ttl: %d', key, val, ttl);
  yield this.client.set(key, val, ttl);
  debug('SET complete');
};

Store.prototype.destroy = function *(key) {
  key = this.options.prefix + key;
  debug('DEL %s', key);
  yield this.client.destroy(key);
  debug('DEL %s complete', key);
};

module.exports = Store;
