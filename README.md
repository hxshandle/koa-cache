
[![Build Status](https://travis-ci.org/hxshandle/koa-cache.svg?branch=master)](https://travis-ci.org/hxshandle/koa-cache)
[![NPM version][npm-image]][npm-url]

# koa-cache
koa-cache is a koa middleware which provide cache for app.

## Install
```
npm install koa-cache-it

```


## Usage 

``` JavaScript
var app = require('koa')();
var cache = require('koa-cache');
app.use(cache({
          store:redisStore(),
          prefix:"koa-cache-test:"
      }));

app.use(function * controller(){
      this.cache.get('cache-key',function * provider(){
          // do something
          return "your value";
        });
    });
```

## APIs

  * get(key[,function *(){}])
  * set(key,value)
  * destory(key)


[npm-image]: https://img.shields.io/npm/v/koa.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa-cache-it