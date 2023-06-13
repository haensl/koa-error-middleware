# koa-error-middleware

Koa error logging middleware using [iso-log](http://github.com/haensl/iso-log).

[![NPM](https://nodei.co/npm/@haensl%2Fkoa-error-middleware.png?downloads=true)](https://nodei.co/npm/@haensl%2Fkoa-error-middleware/)

[![npm version](https://badge.fury.io/js/@haensl%2Fkoa-error-middleware.svg)](http://badge.fury.io/js/@haensl%2Fkoa-error-middleware)
[![CircleCI](https://circleci.com/gh/haensl/koa-error-middlware.svg?style=svg)](https://circleci.com/gh/haensl/koa-error-middleware)

If downstream middlewares throw, the koa-error-middleware handles those errors gracefully. If the error thrown by a downstream middleware contains a `status` property (as is the case with Koa's [`ctx.throw`](https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxthrowstatus-msg-properties)), then the context status code is updated to reflect this, else the context status code is defaulted to 500 (internal server error).

If downstream middlewares throw an error with `status` lower than 500 and the [error is exposed](https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxthrowstatus-msg-properties), the error message is set as the response body.

If the context status code ends up equal to or greater than 500 (internal server error), the error middleware logs the request and error using [iso-log](https://github.com/haensl/iso-log). This requires the [`iso-log` to be initialized](https://github.com/haensl/iso-log#config). When doing so the error middlware tries to extrapolate the user id from context, i.e. `ctx.userId`, and attaches the Koa context to the error.

## Installation

### Via `npm`

```bash
$ npm install -S @haensl/koa-error-middleware @haensl/iso-log
```

### Via `yarn`

```bash
$ yarn add @haensl/koa-error-middleware @haensl/iso-log
```

## Usage

1. [Install @haensl/koa-error-middleware](#installation)

2. Ensure you have [iso-log](https://www.npmjs.com/package/@haensl/iso-log) installed and initialized.

3. Use koa-error-middlware in your projects:


    ```javascript
    const Koa = require('koa');
    const errorLog = require('@haensl/koa-error-middleware');
    const log = require('@haensl/iso-log');

    // Initialize your app
    const app = new Koa();

    // Don't forget to initialize iso-log
    log.init({
      // ...
    });

    // Attach error logging middleware
    app.use(errorLog());
    ```

## Synopsis

The koa-error-middleware is exposed as a function that returns an `async` Koa middleware:

```javascript
() => async (ctx, next) => { }
```

## [Changelog](CHANGELOG.md)
