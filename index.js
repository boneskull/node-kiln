/**
 * @module kiln
 * @title node-kiln
 * @overview Provides Kiln API functionality.
Very little here at the moment.  You can login but can't do anything.
`kiln.watchActivity()` works well, but you have to deal with the objects
returned by Feedparser yourself.
 */

var Q = require('q'),
  request = require('request'),
  conf = require(process.env.PWD + '/kiln.conf.json'),
  Feedparser = require('feedparser'),
  redis = require('redis'),
  _ = require('lodash'),
  format = require('util').format,

  client = redis.createClient();

var APIVersion = '2.0';

var URLs = {
  login: 'Auth/Login'
};

/**
 * Builds a URL to a Kiln API endpoint
 * @param path
 * @returns {options.format|*}
 */
var buildURL = function buildURL(path) {
  return format('%s://%s/Api/%s/%s',
    conf.useSSL ? 'https' : 'http',
    conf.onDemand ? format('%s.kilnhg.com', conf.site) : conf.site,
    APIVersion,
    path);
};

var token;

var kiln = {

  /**
   * Logs into Kiln.  Saves a token.
   * @method login
   * @returns {Function|promise|Q.promise}
   */
  login: function login() {
    var options = {
        url: buildURL(URLs.login),
        qs: {
          sUser: conf.username,
          sPassword: conf.password
        },
        headers: {
          'User-Agent': 'node-kiln (chiller@badwing.com)'
        }
      },
      dfrd = Q.defer();

    request(options, function (err, res, body) {
      if (err) {
        return dfrd.reject(err);
      }
      token = JSON.parse(body);
      dfrd.resolve(token);
    });

    return dfrd.promise;
  },

  /**
   * Watches RSS feed and callbacks when we have data.  Saves data GUIDs
   * in Redis.  Asynchronous.
   * @param {function} dataHandler Callback for when we have data
   * @param {function} metaHandler Callback for when we have metadata.  This
   * should only happen once per call.
   * @param {number=30000} ms How often to poll in ms (defaults to 30s)
   * @method watchActivity
   */
  watchActivity: function watchActivity(dataHandler, metaHandler, ms) {

    var metaHandled = false;

    function poll() {

      request(conf.feedURL)
        .pipe(new Feedparser({normalize: false}))
        .on('error', function (err) {
          console.error(err);
        })
        .on('meta', function (meta) {
          if (metaHandler && !metaHandled) {
            metaHandler(meta);
            metaHandled = true;
          }
          setTimeout(poll, ms || 30000);
        })
        .on('data', function (data) {
          client.hset('node-kiln-activity', data['rss:guid']['#'], data,
            function (err, result) {
              if (result === 1 && dataHandler) {
                dataHandler(data);
              }
            });
        });

    }

    poll();
  }
};

module.exports = kiln;
