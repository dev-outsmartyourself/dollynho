'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _externalIp = require('external-ip');

var _externalIp2 = _interopRequireDefault(_externalIp);

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

var _slackNotify = require('slack-notify');

var _slackNotify2 = _interopRequireDefault(_slackNotify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getIP = (0, _externalIp2.default)();

var getIPAsPromise = function getIPAsPromise() {
  return new Promise(function (resolve, reject) {
    getIP(function (err, ip) {
      if (err) {
        reject(err);
      }
      resolve(ip);
    });
  });
};

var defaultGetText = function defaultGetText(_ref) {
  var packageName = _ref.packageName,
      platform = _ref.platform,
      _ref$env = _ref.env,
      env = _ref$env === undefined ? 'development' : _ref$env,
      ip = _ref.ip,
      err = _ref.err;
  return '*' + packageName + '* - *' + platform.toString() + '@' + ip + '* (' + env + ') ```' + err.stack + '```';
};

exports.default = function (_ref2) {
  var webhookUrl = _ref2.webhookUrl,
      shouldSendToSlack = _ref2.shouldSendToSlack,
      _ref2$channel = _ref2.channel,
      channel = _ref2$channel === undefined ? "#alerts" : _ref2$channel,
      _ref2$iconUrl = _ref2.iconUrl,
      iconUrl = _ref2$iconUrl === undefined ? "http://www.guanabara.info/wp-content/uploads/2007/10/dollynho.jpg" : _ref2$iconUrl,
      _ref2$username = _ref2.username,
      username = _ref2$username === undefined ? 'Dollynho, seu amiguinho' : _ref2$username,
      _ref2$getText = _ref2.getText,
      getText = _ref2$getText === undefined ? defaultGetText : _ref2$getText;

  var slack = (0, _slackNotify2.default)(webhookUrl);
  return function (err, req, res, next) {
    if (!shouldSendToSlack(err)) {
      next(err);
      return;
    }

    getIPAsPromise().then(function (ip) {
      if (!(getText && typeof getText === 'function')) {
        throw new Error('Get text must be a function');
      }

      var text = getText({
        packageName: process.env.npm_package_name,
        env: process.env.NODE_ENV,
        platform: _platform2.default,
        ip: ip,
        err: err
      });

      slack.send({
        channel: channel,
        username: username,
        text: text,
        icon_url: iconUrl,
        unfurl_links: 1 });
    });

    next(err);
  };
};