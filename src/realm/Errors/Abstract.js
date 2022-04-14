"use strict";
exports.__esModule = true;
exports.NotImplementedError = exports.InstantiateAbstractError = void 0;
var Error_1 = require("./Error");
var InstantiateAbstractError = function (params) {
    var error = new Error_1.MyError(ErrorCodeEnum.AbstractClass, "This class (" + params.className + ") is abstract and cannot be instantiated directly");
    return error;
};
exports.InstantiateAbstractError = InstantiateAbstractError;
var NotImplementedError = function (params) {
    if (params === void 0) { params = {}; }
    var error = new Error_1.MyError(ErrorCodeEnum.AbstractClass, "This method (" + exports.NotImplementedError.caller + ") has not been implemented");
    return error;
};
exports.NotImplementedError = NotImplementedError;
