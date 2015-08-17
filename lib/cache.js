"use strict";

var debug = require('debug')('koa-cache:cache');
var MemoryStore = require('./memory_store');
var Store = require('./store');
var copy = require('copy-to');
var uid = require('uid-safe');
var util = require('util');

var warning = 'Warning: koa-cache\'s MemoryStore is not\n' + 'designed for a production environment, as it will leak\n' + 'memory, and will not scale past a single process.';

module.exports = function(opts) {
  var opts = opts || {};
  var key = opts.key || 'koa.cache-id';
  var client = opts.store || new MemoryStore();
  var errorHandler = opts.errorHandler || defaultErrorHanlder;
  var reconnectTimeout = opts.reconnectTimeout || 10000;

  var store = new Store(client, {
    ttl: opts.ttl,
    prefix: opts.prefix
  }); 
  debug('new Store...');

  var storeStatus = 'avaliable';
  var waitStore = Promise.resolve();

  if ('production' === process.env.NODE_ENV && client instanceof MemoryStore) console.warn(warning);

  store.on('disconnect',
  function() {
    if (storeStatus !== 'avaliable') return;
    storeStatus = 'pending';
    waitStore = new Promise(function(resolve, reject) {
      setTimeout(function() {
        if (storeStatus === 'pending') storeStatus = 'unavaliable';
        reject(new Error('session store is unavaliable'));
      },
      reconnectTimeout);
      store.once('connect', resolve);
    });

  });

  store.on('connect',
  function() {
    storeStatus = 'avaliable';
    waitStore = Promise.resolve();
  });

  return function *cache(next) {
    if (this.cache !== undefined) return yield* next;

    try {
      this.cache = store;
    } catch (err) {
      if (defaultErrorHanlder) {
        defaultErrorHanlder(err, this);
      } else {
        throw err;
      }
    }

    yield* next;
  };
}

function defaultErrorHanlder(err,ctx) {
  err.name = 'koa-cache ' + type + ' error';
  throw err;
}

