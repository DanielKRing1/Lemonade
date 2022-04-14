"use strict";
exports.__esModule = true;
exports.getTodaysDate = void 0;
var getTodaysDate = function () {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};
exports.getTodaysDate = getTodaysDate;
