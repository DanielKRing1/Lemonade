"use strict";
exports.__esModule = true;
exports.uuid = void 0;
var CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{[}];:,<.>?";
var CHARS_LENGTH = CHARACTERS.length;
var uuid = function (length) {
    var result = '';
    for (var i = 0; i < length; i++) {
        result += CHARACTERS.charAt(Math.floor(Math.random() * CHARS_LENGTH));
    }
    return result;
};
exports.uuid = uuid;
