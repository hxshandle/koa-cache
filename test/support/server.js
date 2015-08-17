'use strict';

var koa = require('koa');
var debug = require('debug')('koa-cache:test-server');
var http = require('http');
var json = require('koa-json');
var cache = require('../../');
var bodyParser = require('koa-bodyparser');

var app = koa();

app.use(cache());
app.use(bodyParser());
app.use(json());

app.use(function *controllers(){
  switch(this.request.path){
    case '/favicon.ico':
      this.status = 404;
      break;
    case '/getCache':
      debug('body is ',this.request.body);
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