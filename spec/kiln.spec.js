var Q = require('q'),
  loadModule = require('./module-loader').loadModule,
  inspect = require('util').inspect,

  dump = function dump(o) {
    return inspect(o, {depth: null});
  };
jasmine.getEnv().defaultTimeoutInterval = 15000;

describe('kiln module', function () {
//  describe('login method', function () {
//    it('should fail if error received', function (done) {
//      var msg = 'error',
//        request = jasmine.createSpy('request')
//          .andCallFake(function (url, cb) {
//            cb(msg);
//          }),
//        kiln = loadModule('./index.js', {}).module.exports;
//
//      kiln.login()
//        .then(function () {
//          expect(true).toBe(false);
//        }, function (err) {
//          expect(err).toBe(msg);
//        })
//        .finally(kiln.forgetToken)
//        .finally(done);
//    });
//  });

  describe('watchActivity method', function () {
    it('should get an RSS feed', function (done) {
      var kiln = loadModule('./index.js', {}).module.exports;

      kiln.watchActivity();
      setTimeout(done, 4500);
    });
  });
});

