'use strict';

var koa = require('koa');
var debug = require('debug')('koa-cache:test-server');
var http = require('http');
var json = require('koa-json');
var cache = require('../../');
var bodyParser = require('koa-bodyparser');
var redisStore = require('koa-redis');


var app = koa();

app.use(cache({
  store:redisStore(),
  prefix:"koa-cache-test:"
}));
app.use(bodyParser());
app.use(json());

app.use(function *controllers(){
  switch(this.request.path){
    case '/favicon.ico':
      this.status = 404;
      break;
    case '/getCache':
      var t = this;
      var data = yield this.cache.get("getCache",function(){
        return t.request.body;
      });
      this.body = data;
      break;
    default:
      this.body = "do nothing...";
      break;
  }
});

var app = module.exports = http.createServer(app.callback());