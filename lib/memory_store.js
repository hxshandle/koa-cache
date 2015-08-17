/**!
 * koa-generic-session - lib/memory_store.js
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

var debug = require('debug')('koa-cache:memory_store');
var _ = require('lodash');

var MemoryStore = module.exports = function () {
  this.cache = {};
};

MemoryStore.prototype.get = function *(key,func) {
  debug('get value %j with key %s', this.cache[key], key);
  if(this.cache[key] === undefined && _.isFunction(func)){
    this.cache[key] = func.call();
  }
  return this.cache[key];
};

MemoryStore.prototype.set = function *(sid, val) {
  debug('set value %j for key %s', val, sid);
  if(_.isFunction(val)){
    this.cache[sid] = val.call();
  }else{
    this.cache[sid] = val;
  }
  
};

MemoryStore.prototype.destroy = function *(sid) {
  delete this.cache[sid];
};
