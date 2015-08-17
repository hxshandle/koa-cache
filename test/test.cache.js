"use strict";

var request = require('supertest'),
    app = require('./support/server')
    should = require('should');
var date = new Date().getTime();
var FIELD_NAME = "dateTime";
describe('koa-cache-test', function () {

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
});