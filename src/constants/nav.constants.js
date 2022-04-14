"use strict";
exports.__esModule = true;
exports.goHome = exports.onScreen = exports.goBack = void 0;
var goBack = function (navigation) { return function () { return navigation.goBack(); }; };
exports.goBack = goBack;
var onScreen = function (screen, navigation, obj) { return function () {
    navigation.navigate(screen, obj);
}; };
exports.onScreen = onScreen;
var goHome = function (navigation) { return function () { return navigation.popToTop()(); }; };
exports.goHome = goHome;
