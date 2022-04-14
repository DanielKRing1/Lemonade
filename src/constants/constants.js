"use strict";
exports.__esModule = true;
exports.Device = exports.H = exports.W = exports.win = exports.DISABLED_BACKGROUND_COLOR = exports.DISABLED_COLOR = exports.BORDER_COLOR = exports.HELP_COLOR = exports.ERROR_COLOR = exports.INPUT_COLOR = exports.LABEL_COLOR = exports.RED = exports.GREEN = exports.BLUE = exports.PURPLE = exports.PINK = exports.BG = void 0;
var react_native_1 = require("react-native");
exports.BG = '#0B0B0B';
exports.PINK = '#F20AF5';
exports.PURPLE = '#7A1374';
exports.BLUE = '#00FFFF';
exports.GREEN = '#2E7767';
exports.RED = '#FC2847';
exports.LABEL_COLOR = exports.BLUE;
exports.INPUT_COLOR = exports.PINK;
exports.ERROR_COLOR = exports.RED;
exports.HELP_COLOR = '#999999';
exports.BORDER_COLOR = exports.BLUE;
exports.DISABLED_COLOR = '#777777';
exports.DISABLED_BACKGROUND_COLOR = '#eeeeee';
exports.win = react_native_1.Dimensions.get('window');
exports.W = exports.win.width;
exports.H = exports.win.height;
exports.Device = {
    // eslint-disable-next-line
    select: function (variants) {
        if (exports.W >= 300 && exports.W <= 314)
            return variants.mobile300 || {};
        if (exports.W >= 315 && exports.W <= 341)
            return variants.iphone5 || {};
        if (exports.W >= 342 && exports.W <= 359)
            return variants.mobile342 || {};
        if (exports.W >= 360 && exports.W <= 374)
            return variants.mi5 || {};
        if (exports.W >= 375 && exports.W <= 399)
            return variants.iphone678 || {};
        if (exports.W >= 400 && exports.W <= 409)
            return variants.mobile400 || {};
        if (exports.W >= 410 && exports.W <= 414)
            return variants.googlePixel || {};
        if (exports.W >= 415 && exports.W <= 434)
            return variants.mobile415 || {};
        if (exports.W >= 435 && exports.W <= 480)
            return variants.redmiNote5 || {};
    }
};
