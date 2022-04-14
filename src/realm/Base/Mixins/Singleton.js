"use strict";
/**
 * To follow the SINGLETON pattern expected for this class,
 * return this._getInstance() from the Derived class's constructor
 *
 * Example usage in Derived class:
 *
 *      constructor() {
 *          super()
 *          ...
 *
 *          return this._getSingleton();
 *      }
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Singleton = void 0;
function Singleton(Base) {
    var Singleton = /** @class */ (function (_super) {
        __extends(Singleton, _super);
        // Is this necessary?
        function Singleton() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _super.call(this, args) || this;
        }
        Singleton.getSingleton = function (DerivedSingleton) {
            return new DerivedSingleton();
        };
        Singleton.prototype.getSingleton = function () {
            if (!this._hasInstance())
                this._setInstance();
            return this._getInstance();
        };
        Singleton.prototype._getInstance = function () {
            return this.constructor._instance;
        };
        Singleton.prototype._setInstance = function () {
            this.constructor._instance = this;
        };
        Singleton.prototype._hasInstance = function () {
            return !!this.constructor._instance;
        };
        return Singleton;
    }(Base));
    return Singleton;
}
exports.Singleton = Singleton;
