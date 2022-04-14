"use strict";
exports.__esModule = true;
exports.Override = void 0;
function Override(className) {
    // this is the decorator factory
    return function (target, propertyName, descriptor) {
        // this is the decorator
        // do something with 'target' and 'value'...
    };
}
exports.Override = Override;
