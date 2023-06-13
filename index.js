const log = require('@haensl/iso-log');
const { statusCodes } = require('@haensl/http');

module.exports = () =>
  async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || statusCodes.internalServerError;
      if (ctx.status < statusCodes.internalServerError && err.expose) {
        ctx.response.body = err.message;
      } else {
        // If possible provide user context.
        if (ctx.userId) {
          err.user = {
            id: ctx.userId.toString(),
            ...err.user
          };
        }

        // Attach koa context.
        err.koa = ctx;

        log.error(
          'Request failing',
          'Request',
          err.request,
          'Error',
          err
        );
      }
    }
  };
