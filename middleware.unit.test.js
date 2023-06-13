const { statusCodes } = require('@haensl/http');
const log = require('@haensl/iso-log');

const middleware = require('./');

jest.mock('@haensl/iso-log');

describe('koa-error-middleware', () => {
  let ctx;
  let next;

  beforeEach(() => {
    ctx = {
      request: {},
      response: {},
      status: 200
    };
  });

  describe('when subsequent middlewares do not throw', () => {
    beforeEach(async () => {
      next = jest.fn();
      await middleware()(ctx, next);
    });

    it('does not alter the status code', () => {
      expect(ctx.status)
        .toEqual(200);
    });

    it('does not alter the response', () => {
      expect(ctx.response)
        .toEqual({});
    });
  });

  describe('when subsequent middlewares throw', () => {
    describe(`with status code lower than ${statusCodes.internalServerError}`, () => {
      describe('and the error is exposed', () => {
        beforeEach(async () => {
          next = jest.fn()
            .mockImplementation(() => {
              const e = new Error('unit test error middleware throwing');
              e.expose = true;
              e.status = statusCodes.notFound;
              throw e;
            });
          await middleware()(ctx, next);
        });

        it('sets the status code on context', () => {
          expect(ctx.status)
            .toEqual(statusCodes.notFound);
        });

        it('sets the response body to the error message', () => {
          expect(ctx.response.body)
            .toEqual('unit test error middleware throwing');
        });
      });

      describe('and the error is not exposed', () => {
        beforeEach(async () => {
          next = jest.fn()
            .mockImplementation(() => {
              const e = new Error('unit test error middleware throwing');
              e.status = statusCodes.notFound;
              throw e;
            });
          await middleware()(ctx, next);
        });

        it('sets the status code on context', () => {
          expect(ctx.status)
            .toEqual(statusCodes.notFound);
        });

        it('does not set the response body to the error message', () => {
          expect(ctx.response.body)
            .not
            .toBeDefined();
        });
      });
    });

    describe(`with status code greater or equal to ${statusCodes.internalServerError}`, () => {
      let spy;

      beforeEach(async () => {
        next = jest.fn()
          .mockImplementation(() => {
            const e = new Error('unit test error middleware throwing');
            e.status = statusCodes.serviceUnavailable;
            throw e;
          });

        spy = jest.spyOn(log, 'error');

        await middleware()(ctx, next);
      });

      afterEach(() => {
        spy.mockRestore();
      });

      it('sets the status code on context', () => {
        expect(ctx.status)
          .toEqual(statusCodes.serviceUnavailable);
      });

      it('logs the error', () => {
        expect(spy)
          .toHaveBeenCalled();
      });

      it('does not propagate the error in the response', () => {
        expect(ctx.response)
          .toEqual({});
      });
    });
  });
});

