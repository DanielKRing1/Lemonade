"use strict";
exports.__esModule = true;
exports.MetaDataBlueprint = void 0;
var Errors_1 = require("../../Errors");
var MetaDataBlueprint = /** @class */ (function () {
    function MetaDataBlueprint(schemaName, realmPath, blueprintType, schemaMetadata) {
        this.schemaName = schemaName;
        this.realmPath = realmPath;
        this.blueprintType = blueprintType;
        this.schemaMetadata = schemaMetadata;
    }
    //   CONVERSION
    MetaDataBlueprint.fromObj = function (obj) {
        var schemaName = obj.schemaName, realmPath = obj.realmPath, blueprintType = obj.blueprintType, schemaMetadata = obj.schemaMetadata;
        return new this.constructor(schemaName, realmPath, blueprintType, schemaMetadata);
    };
    MetaDataBlueprint.fromRow = function (rowObj) {
        var schemaName = rowObj.schemaName, realmPath = rowObj.realmPath, blueprintType = rowObj.blueprintType, schemaMetadataStr = rowObj.schemaMetadataStr;
        var schemaMetadata = JSON.parse(schemaMetadataStr);
        var obj = {
            schemaName: schemaName,
            realmPath: realmPath,
            blueprintType: blueprintType,
            schemaMetadata: schemaMetadata
        };
        return MetaDataBlueprint.fromObj(obj);
    };
    MetaDataBlueprint.prototype.toObj = function () {
        return {
            schemaName: this.schemaName,
            realmPath: this.realmPath,
            blueprintType: this.blueprintType,
            schemaDef: this.schemaMetadata
        };
    };
    MetaDataBlueprint.prototype.toRow = function () {
        return {
            schemaName: this.schemaName,
            realmPath: this.realmPath,
            blueprintType: this.blueprintType,
            schemaMetadataStr: JSON.stringify(this.schemaMetadata)
        };
    };
    //   SAVE
    MetaDataBlueprint.save = function () {
        var agrs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            agrs[_i] = arguments[_i];
        }
        throw Errors_1.NotImplementedError();
    };
    MetaDataBlueprint.prototype.save = function (defaultRealm) {
        var schemaBlueprintRow = this.toRow();
        defaultRealm.write(function () {
            defaultRealm.create(BlueprintNameEnum.METADATA, schemaBlueprintRow);
        });
    };
    MetaDataBlueprint.prototype["delete"] = function (defaultRealm) {
        var _this = this;
        defaultRealm.write(function () {
            var realmObj = defaultRealm.objectForPrimaryKey(BlueprintNameEnum.METADATA, _this.schemaName);
            if (realmObj)
                defaultRealm["delete"](realmObj);
        });
    };
    MetaDataBlueprint.prototype.getBlueprintType = function () {
        return BlueprintTypeEnum.METADATA;
    };
    // STATIC UTILITIES
    MetaDataBlueprint.METADATA_SCHEMA_DEF = {
        name: METADATA_SCHEMA_NAME,
        primaryKey: 'schemaName',
        properties: {
            schemaName: 'string',
            realmPath: 'string',
            blueprintType: 'string',
            schemaMetadata: 'string'
        }
    };
    return MetaDataBlueprint;
}());
exports.MetaDataBlueprint = MetaDataBlueprint;
