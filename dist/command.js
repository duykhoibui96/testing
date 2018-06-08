"use strict";

var _task = require("./task");

var _task2 = _interopRequireDefault(_task);

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import runTask from "./worker/async-await";
var sessionIds = [];
var task = new _task2.default();
task.outputPath = _config.OUTPUT_PATH;

process.argv.forEach(function (val, index, array) {
    if (index === 2) task.mode = val;
    if (index > 2) sessionIds.push(val);
});

if (sessionIds.length > 0) task.run(sessionIds);else console.log('Please enter your session ID list. Ex: $ node command.js [sessionId_1] [sessionId_2] ...');