"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.log = exports.writeFile = exports.httpRequest = undefined;

var _config = require("./config");

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var httpRequest = exports.httpRequest = function httpRequest(url) {
    var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';

    var headers = {
        'Authorization': 'Basic ' + _config.TOKEN,
        'Accept': 'application/json'
    };

    return new Promise(function (resolve, reject) {
        (0, _request2.default)({
            url: "" + _config.HOST + url,
            json: true,
            method: 'GET',

            headers: headers
        }, function (err, response, body) {
            return err || response.statusCode < 200 || response.statusCode >= 300 ? reject({ err: err, statusCode: response.statusCode }) : resolve(body);
        });
    });
};

var writeFile = exports.writeFile = function writeFile(path, filename, data) {
    return new Promise(function (resolve, reject) {
        return _fs2.default.writeFile(path + '/' + filename, data, 'utf8', function (err) {
            return err ? reject() : resolve();
        });
    });
};

var log = exports.log = function log(text) {
    return console.log(text);
};