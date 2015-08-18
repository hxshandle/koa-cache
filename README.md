# koa-cache

koa-cache is a koa middleware which provide cache for app.

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
