'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let electronRequest = (() => {
  var _ref = _asyncToGenerator(function* ({ method, url, headers, qs, timeout, body, stream }) {
    yield _electron.app.whenReady();

    const { net, session } = require('electron');
    const req = net.request({
      method,
      url: `${url}${qs != null ? `?${_querystring2.default.stringify(qs)}` : ''}`,
      redirect: 'follow',
      session: session.defaultSession
    });

    if (headers != null) {
      for (const headerKey of Object.keys(headers)) {
        req.setHeader(headerKey, headers[headerKey]);
      }
    }

    if (body != null) {
      req.write(body, 'utf-8');
    }

    return new Promise(function (resolve, reject) {
      const reqTimeout = setTimeout(function () {
        req.abort();
        reject(new Error(`network timeout: ${url}`));
      }, timeout != null ? timeout : DEFAULT_REQUEST_TIMEOUT);

      req.on('login', function (authInfo, callback) {
        return callback();
      });

      req.on('response', function (response) {
        clearTimeout(reqTimeout);
        handleHTTPResponse(resolve, reject, response, stream);
      });

      req.on('error', function (err) {
        clearTimeout(reqTimeout);
        reject(err);
      });

      req.end();
    });
  });

  return function electronRequest(_x) {
    return _ref.apply(this, arguments);
  };
})();

let requestWithMethod = (() => {
  var _ref2 = _asyncToGenerator(function* (method, options) {
    if (typeof options === 'string') {
      options = { url: options };
    }

    options = _extends({}, options, { method });

    try {
      return yield electronRequest(options);
    } catch (err) {
      console.log(`Error downloading with electron net: ${err.message}`);
      console.log('Falling back to node net library..');
    }

    return nodeRequest(options);
  });

  return function requestWithMethod(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

// only supports get for now, since retrying is non-idempotent and
// we'd want to grovel the errors to make sure it's safe to retry


var _electron = require('electron');

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const DEFAULT_REQUEST_TIMEOUT = 30000;

function makeHTTPResponse({ method, url, headers, statusCode, statusMessage }, body) {
  return {
    method,
    url,
    headers,
    statusCode,
    statusMessage,
    body
  };
}

function makeHTTPStatusError(response) {
  const err = new Error(`HTTP Error: Status Code ${response.statusCode}`);
  err.response = response;
  return err;
}

function handleHTTPResponse(resolve, reject, response, stream) {
  const totalBytes = parseInt(response.headers['content-length'] || 1, 10);
  let receivedBytes = 0;
  const chunks = [];

  // don't stream response if it's a failure
  if (response.statusCode >= 300) {
    stream = null;
  }

  response.on('data', chunk => {
    if (stream != null) {
      receivedBytes += chunk.length;
      stream.write(chunk);
      stream.emit('progress', { totalBytes, receivedBytes });
      return;
    }

    chunks.push(chunk);
  });

  response.on('end', () => {
    if (stream != null) {
      stream.on('finish', () => resolve(makeHTTPResponse(response, null)));
      stream.end();
      return;
    }

    const res = makeHTTPResponse(response, Buffer.concat(chunks));

    if (res.statusCode >= 300) {
      reject(makeHTTPStatusError(res));
      return;
    }

    resolve(res);
  });
}

function nodeRequest({ method, url, headers, qs, timeout, body, stream }) {
  return new Promise((resolve, reject) => {
    const req = (0, _request2.default)({
      method,
      url,
      qs,
      headers,
      followAllRedirects: true,
      encoding: null,
      timeout: timeout != null ? timeout : DEFAULT_REQUEST_TIMEOUT,
      body
    });

    req.on('response', response => handleHTTPResponse(resolve, reject, response, stream));
    req.on('error', err => reject(err));
  });
}

for (const method of ['get']) {
  requestWithMethod[method] = requestWithMethod.bind(null, method.toUpperCase());
}

exports.default = requestWithMethod;
module.exports = exports.default;