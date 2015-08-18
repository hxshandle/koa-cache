"use strict";

var request = require('supertest'),
    app = require('./support/server'),
    co = require('co'),
    should = require('should');
var RedisStore = require('koa-redis');

var date = new Date().getTime();
var FIELD_NAME = "dateTime";

describe('koa-cache-test', function () {
  before(function(done){
    co(function * (){
      var store = RedisStore();
      yield store.client.del("koa-cache-test:getCache");
      return Promise.resolve();
    }).then(done);
  });
  describe('Test Memore store', function () {
    it('getDate from cache', function (done) {
      request(app)
      .post('/getCache')
      .send({ dateTime: date})
      .expect({dateTime:date},done);
    });
    it('getDate should return cached date time', function (done) {
      request(app)
      .post('/getCache')
      .send({ dateTime: "1234"})
      .expect({dateTime:date},done);
    });
    it('updateDate should update cached data with given value',function(done){
      request(app)
      .post('/updateCache')
      .send({ dateTime: "1234"})
      .expect({success:true},function (){
        request(app)
        .post('/getCache')
        .send({ dateTime: "34343"})
        .expect({dateTime:"1234"},done);
      });
    });
  });
});
