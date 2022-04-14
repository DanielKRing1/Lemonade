"use strict";
exports.__esModule = true;
exports.NotInCacheError = void 0;
var Error_1 = require("./Error");
var NotInCacheError = function (params) {
    var message = params.message;
    var error = new Error_1.MyError(ErrorCodeEnum.NotInCache, message);
    return error;
};
exports.NotInCacheError = NotInCacheError;
