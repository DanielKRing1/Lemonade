"use strict";
exports.__esModule = true;
exports.ObjectBuilder = void 0;
var ObjectBuilder = /** @class */ (function () {
    function ObjectBuilder() {
    }
    ObjectBuilder.buildUniformObject = function (keys, value) {
        var values = keys.map(function () { return value; });
        return ObjectBuilder.buildObject(keys, values);
    };
    ObjectBuilder.buildObject = function (keys, values) {
        var obj = {};
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = values[i];
            obj[key] = value;
        }
        return obj;
    };
    return ObjectBuilder;
}());
exports.ObjectBuilder = ObjectBuilder;
