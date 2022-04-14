"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ArrayCache = exports.Cache = void 0;
var Errors_1 = require("../../Errors");
var Decorators_1 = require("../Decorators");
var Cache = /** @class */ (function () {
    function Cache() {
        this._map = {};
    }
    /**
     * Override and build a 'value' from the given 'valueParams', to associate with the given 'key'
     *
     * @param key String key
     * @param valueParams Object of data needed to build a value for the key
     */
    Cache.prototype.add = function (key, valueParams) {
        throw Errors_1.NotImplementedError({});
    };
    Cache.prototype.rm = function (key, options) {
        if (this.has(key)) {
            var val = this._map[key];
            delete this._map[key];
            return val;
        }
    };
    Cache.prototype.get = function (key) {
        if (this.has(key))
            return this._map[key];
        // throw NotInCacheError({message: `"${key}" does not exist in ${this.constructor} Cache`});
    };
    Cache.prototype.has = function (key) {
        return this._map.hasOwnProperty(key);
    };
    Cache.prototype.getKeys = function () {
        return Object.keys(this._map);
    };
    Cache.prototype.getValues = function () {
        return Object.values(this._map);
    };
    return Cache;
}());
exports.Cache = Cache;
var ArrayCache = /** @class */ (function (_super) {
    __extends(ArrayCache, _super);
    function ArrayCache() {
        var _this = _super.call(this) || this;
        _this._map = {};
        return _this;
    }
    ArrayCache.prototype.rm = function (key, itemToRm, options) {
        if (this.has(key)) {
            var arr = this._map[key];
            var indexToRm = typeof itemToRm === 'object' ? arr.findIndex(function (item) { return item.toString() === itemToRm.toString(); }) : arr.findIndex(function (item) { return item === itemToRm; });
            this._map[key] = arr.splice(indexToRm, 1);
        }
    };
    ArrayCache.prototype.addToKeyArr = function (key, value) {
        this.initKeyWithArray(key);
        this._map[key].push(value);
    };
    ArrayCache.prototype.initKeyWithArray = function (key) {
        if (!this.has(key))
            this._map[key] = [];
    };
    __decorate([
        Decorators_1.Override('Cache')
    ], ArrayCache.prototype, "rm");
    return ArrayCache;
}(Cache));
exports.ArrayCache = ArrayCache;
