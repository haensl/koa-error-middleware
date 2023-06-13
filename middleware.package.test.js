describe('@haensl/koa-error-middleware', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('import via full uri', () => {
    const error = require('@haensl/koa-error-middleware');

    it('exposes a function', () => {
      expect(typeof error)
      .toEqual('function');
    });
  });
});
