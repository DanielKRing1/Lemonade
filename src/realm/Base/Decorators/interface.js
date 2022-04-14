"use strict";
exports.__esModule = true;
exports.Implement = void 0;
function Implement(interfaceName) {
    // this is the decorator factory
    return function (target, propertyName, descriptor) {
        // this is the decorator
        // do something with 'target' and 'value'...
    };
}
exports.Implement = Implement;
