"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function () {
    function Task() {
        _classCallCheck(this, Task);

        this._mode = "promise";
        this._outputPath = null;
    }

    _createClass(Task, [{
        key: "buildApiUrl",
        value: function buildApiUrl(sessionId) {
            var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            return "/sessions/" + sessionId + "/commands?page=" + page;
        }
    }, {
        key: "runInPromiseMode",
        value: function runInPromiseMode(sessionIds) {
            var _this = this;

            var task = new Promise(function (resolve) {
                return resolve((0, _utils.log)("Start ..."));
            });
            sessionIds.forEach(function (sessionId) {
                task = task.then(function () {
                    return (0, _utils.log)("Fetching commands for session with ID " + sessionId);
                }).then(function () {
                    return (0, _utils.httpRequest)(_this.buildApiUrl(sessionId));
                }).catch(function (err) {
                    (0, _utils.log)(">>Failed to load commands");
                    throw err;
                }).then(function (command) {
                    var currentPage = command.currentPage,
                        totalPages = command.totalPages,
                        data = command.data;

                    (0, _utils.log)(">>Found " + totalPages + " " + (totalPages === 1 ? "page" : "pages") + " of commands");
                    var commandList = [{
                        page: 1,
                        data: data
                    }];
                    var childTask = new Promise(function (resolve) {
                        return resolve((0, _utils.log)(">>>>Commands on page 1 loaded"));
                    });

                    var _loop = function _loop(page) {
                        childTask = childTask.then(function () {
                            return (0, _utils.httpRequest)(_this.buildApiUrl(sessionId, page));
                        }).then(function (command) {
                            (0, _utils.log)(">>>>Commands on page " + page + " loaded");
                            return commandList.push({
                                page: page,
                                data: command.data
                            });
                        }).catch(function (err) {
                            return (0, _utils.log)(">>>>Commands on page " + page + " failed to load");
                        });
                    };

                    for (var page = currentPage + 1; page <= totalPages; page++) {
                        _loop(page);
                    }return childTask.then(function () {
                        return commandList;
                    });
                }).then(function (commandList) {
                    var data = _this.buildData(sessionId, commandList);
                    (0, _utils.log)(">>Data received! Start writing to file");
                    return (0, _utils.writeFile)(_this._outputPath, sessionId + ".txt", data).then(function () {
                        return (0, _utils.log)(">>Finish writing to file");
                    }).catch(function (err) {
                        (0, _utils.log)(">>Failed to write record to file");
                        throw err;
                    });
                }).then(function () {
                    return (0, _utils.log)(">>Task completed!");
                }, function (err) {
                    (0, _utils.log)(">>Task failed!");
                    (0, _utils.log)(err);
                });
            });

            task.then(function () {
                return (0, _utils.log)("Finish!");
            });
        }
    }, {
        key: "runInAwaitAsyncMode",
        value: async function runInAwaitAsyncMode(sessionIds) {
            (0, _utils.log)("Start...");
            for (var i = 0; i < sessionIds.length; i++) {
                var sessionId = sessionIds[i];
                try {
                    (0, _utils.log)("Fetching commands for session with ID " + sessionId);
                    var command = null;
                    try {
                        command = await (0, _utils.httpRequest)(this.buildApiUrl(sessionId));
                    } catch (error) {
                        (0, _utils.log)(">>Failed to load commands");
                        throw error;
                    }
                    var _command = command,
                        currentPage = _command.currentPage,
                        totalPages = _command.totalPages,
                        data = _command.data;

                    (0, _utils.log)(">>Found " + totalPages + " " + (totalPages === 1 ? "page" : "pages") + " of commands");
                    var commandList = [{
                        page: 1,
                        data: data
                    }];
                    (0, _utils.log)(">>>>Commands on page 1 loaded");
                    for (var page = currentPage + 1; page <= totalPages; page++) {
                        try {
                            command = await (0, _utils.httpRequest)(this.buildApiUrl(sessionId, page));
                            commandList.push({
                                page: page,
                                data: command.data
                            });
                            (0, _utils.log)(">>>>Commands on page " + page + " loaded");
                        } catch (error) {
                            (0, _utils.log)(">>>>Commands on page " + page + " failed to load");
                        }
                    }var statistic = this.buildData(sessionId, commandList);
                    (0, _utils.log)(">>Data received! Start writing to file");
                    try {
                        await (0, _utils.writeFile)(this._outputPath, sessionId + ".txt", statistic);
                        (0, _utils.log)(">>Finish writing to file");
                    } catch (error) {
                        (0, _utils.log)(">>Failed to write record to file");
                        throw error;
                    }
                    (0, _utils.log)(">>Task completed!");
                } catch (error) {
                    (0, _utils.log)(">>Task failed!");
                    console.log(error);
                }
            }
        }
    }, {
        key: "buildData",
        value: function buildData(sessionId, commandList) {
            var docs = "SessionId: " + sessionId + "\n" + commandList.length + " " + (commandList.length > 1 ? "pages" : "page") + " of commands found:\n";
            commandList.forEach(function (command) {
                docs += "   Page " + command.page + "\n";
                command.data.forEach(function (record, index) {
                    docs += "       " + (index + 1) + ".\n";
                    docs += "        id = " + record.id + "\n";
                    docs += "        data url = " + record.data.url + "\n";
                    docs += "        created at = " + record.createdAt + "\n";
                    docs += "        ended at = " + record.endedAt + "\n";
                });
            });
            return docs;
        }
    }, {
        key: "run",
        value: function run(sessionIds) {
            return this._mode === "promise" ? this.runInPromiseMode(sessionIds) : this.runInAwaitAsyncMode(sessionIds);
        }
    }, {
        key: "mode",
        set: function set(mode) {
            this._mode = mode;
        }
    }, {
        key: "outputPath",
        set: function set(path) {
            this._outputPath = path;
        }
    }]);

    return Task;
}();

exports.default = Task;