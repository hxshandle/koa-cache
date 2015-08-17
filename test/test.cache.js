"use strict";

var request = require('supertest');
var app = require('./support/server');

describe('koa-cache-test', function () {
  it('should do what...', function (done) {
    request(app)
    .get('/favicon.ico')
    .expect(404)
    .end(function(err, res){
      if(err) return done(err);
      done();
    });
  });
});