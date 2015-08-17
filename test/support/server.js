'use strict';

var koa = require('koa');
var http = require('http');
var app = koa();

app.use(function *controllers(){
  switch(this.request.path){
    case '/favicon.ico':
      this.status = 404;
      break;
    default:
      this.body = "do nothing...";
      break;
  }
});

var app = module.exports = http.createServer(app.callback());