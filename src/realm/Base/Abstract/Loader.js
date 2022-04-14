"use strict";
exports.__esModule = true;
exports.Loader = void 0;
var Errors_1 = require("../../Errors");
var Loader = /** @class */ (function () {
    function Loader() {
    }
    Loader.prototype.load = function (param) {
        throw Errors_1.NotImplementedError();
    };
    return Loader;
}());
exports.Loader = Loader;
