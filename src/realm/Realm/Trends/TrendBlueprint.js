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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TrendBlueprint = void 0;
var MetaDataBlueprint_1 = require("../Schema/MetaDataBlueprint");
var util_1 = require("../../../util");
var Base_1 = require("../../Base");
var TrendBlueprint = /** @class */ (function (_super) {
    __extends(TrendBlueprint, _super);
    function TrendBlueprint(trendName, realmPath, properties, existingTrendEntities, existingTrendTags) {
        if (existingTrendEntities === void 0) { existingTrendEntities = []; }
        if (existingTrendTags === void 0) { existingTrendTags = []; }
        var _this = _super.call(this, trendName, realmPath, BlueprintTypeEnum.TREND, {
            properties: properties,
            existingTrendEntities: existingTrendEntities,
            existingTrendTags: existingTrendTags
        }) || this;
        // GENERATE PREDICTABLE SCHEMA DEFINITIONS FOR NEW SCHEMABLUEPRINTS
        _this.genTrendNodeSchemaDef = function (schemaName, nodeDailySnapshotSchemaName) {
            // 1. Get property ratings to add to Trend Schema
            var addedProperties = _this.genTrendProperties();
            // 2. Get property counts to add to Trend Schema
            var addedPropertyCounts = _this.genTrendPropertyCounts();
            // 3. Build and return SchemaDefinition
            return {
                name: schemaName,
                primaryKey: 'id',
                properties: __assign(__assign({ id: 'string', edges: 'string[]', dailySnapshots: nodeDailySnapshotSchemaName + "[]" }, addedProperties), addedPropertyCounts)
            };
        };
        _this.genTrendEdgeSchemaDef = function (schemaName) {
            // 1. Get property ratings to add to Trend Schema
            var addedProperties = _this.genTrendProperties();
            // 2. Get property counts to add to Trend Schema
            var addedPropertyCounts = _this.genTrendPropertyCounts();
            // 3. Build and return SchemaDefinition
            return {
                name: schemaName,
                primaryKey: 'id',
                properties: __assign(__assign({ id: 'string', nodes: 'string[]' }, addedProperties), addedPropertyCounts)
            };
        };
        _this.genTrendNodeDailySnapshotSchemaDef = function (schemaName) {
            // 1. Get property ratings to add to Trend Schema
            var propertiesToSnapshot = _this.genTrendProperties();
            // 2. Build and return SchemaDefinition
            return {
                name: schemaName,
                properties: __assign({ date: 'date' }, propertiesToSnapshot)
            };
        };
        _this.properties = properties;
        _this.existingTrendEntities = existingTrendEntities;
        _this.existingTrendTags = existingTrendTags;
        return _this;
    }
    // GENERATE PREDICTABLE NAMES FOR A NEW TREND'S SCHEMABLUEPRINTS
    TrendBlueprint.genPropertyKey = function (propertyName) {
        return "" + propertyName;
    };
    TrendBlueprint.genPropertyCountKey = function (propertyName) {
        return propertyName + "_" + TrendPropertySuffix.Count;
    };
    TrendBlueprint.genSchemaName = function (trendName, trendSchemaType) {
        switch (trendSchemaType) {
            case TrendSchemaType.TREND_NODE:
                return trendName + "_" + TrendNameSuffix.Node;
            case TrendSchemaType.TREND_EDGE:
                return trendName + "_" + TrendNameSuffix.Edge;
            case TrendSchemaType.TAG_NODE:
                return trendName + "_" + TrendNameSuffix.Tag + "_" + TrendNameSuffix.Node;
            case TrendSchemaType.TAG_EDGE:
                return trendName + "_" + TrendNameSuffix.Tag + "_" + TrendNameSuffix.Edge;
            case TrendSchemaType.NODE_DAILY_SNAPSHOT:
                return trendName + "_" + TrendNameSuffix.NodeDailySnapshot;
            // case SchemaTypeEnum.DAILY_SNAPSHOTS:
            //   return `${trendName}_${TrendNameSuffix.DailySnapshot}`;
            // case SchemaTypeEnum.MOOD_SNAPSHOT:
            //   return `${trendName}_${TrendNameSuffix.MoodSnapshot}`;
        }
        return trendName + "_Unknown";
    };
    // private genTrendDailySnapshotSchemaDef = (schemaName: string, moodSnapshotsSchemaName: string): Realm.ObjectSchema => {
    //   return {
    //     name: schemaName,
    //     primaryKey: 'nodeName',
    //     properties: {
    //       nodeName: 'string',
    //       moodSnapshot: `${moodSnapshotsSchemaName}[]`,
    //     },
    //   };
    // };
    // private genTrendMoodSnapshotSchemaDef = (schemaName: string): Realm.ObjectSchema => {
    //   return {
    //     name: schemaName,
    //     properties: {
    //       date: 'date',
    //       moodName: 'string',
    //       rating: 'number',
    //     },
    //   };
    // };
    TrendBlueprint.prototype.genTrendProperties = function () {
        // 1. Map each of this Trend's moods/properties to a uniform naming convention
        var propertyKeys = this.properties.map(function (propertyName) { return TrendBlueprint.genPropertyKey(propertyName); });
        // 2. Init the default Realm definition that will apply to each property
        var propertyValue = { type: 'float', "default": 0 };
        // 3. Build the actual, complete set of Realm definition for this Trend's moods/properties
        var properties = util_1.ObjectBuilder.buildUniformObject(propertyKeys, propertyValue);
        return properties;
    };
    TrendBlueprint.prototype.genTrendPropertyCounts = function () {
        // 1. Map each of this Trend's moods/properties to a uniform naming convention for 'property count' attributes
        var propertyKeys = this.properties.map(function (propertyName) { return TrendBlueprint.genPropertyCountKey(propertyName); });
        // 2. Init the default Realm definition that will apply to each property
        var propertyValue = { type: 'float', "default": 0 };
        // 3. Build the actual, complete set of Realm definition for this Trend's mood/property counts
        var properties = util_1.ObjectBuilder.buildUniformObject(propertyKeys, propertyValue);
        return properties;
    };
    // SCHEMABLUEPRINT SERIALIZE UTILS
    TrendBlueprint.prototype.toTrendSchemaBlueprints = function () {
        // // 1. Get NodeMoodSnapshot Schema
        // const nodeMoodSnapshotName: string = TrendBlueprint.genSchemaName(this.schemaName, SchemaTypeEnum.MOOD_SNAPSHOT);
        // const nodeMoodSnapshotSB: MetaDataBlueprint = new MetaDataBlueprint(nodeMoodSnapshotName, this.realmPath, SchemaTypeEnum.DAILY_SNAPSHOTS, this.genTrendMoodSnapshotSchemaDef(nodeMoodSnapshotName));
        var _a;
        // // 2. Get NodeDailySnapshot Schema
        // const nodeDailySnapshotName: string = TrendBlueprint.genSchemaName(this.schemaName, SchemaTypeEnum.DAILY_SNAPSHOTS);
        // const nodeDailySnapshotSB: MetaDataBlueprint = new MetaDataBlueprint(
        //   nodeDailySnapshotName,
        //   this.realmPath,
        //   SchemaTypeEnum.DAILY_SNAPSHOTS,
        //   this.genTrendDailySnapshotSchemaDef(nodeDailySnapshotName, nodeMoodSnapshotName),
        // );
        // 1. Get Trend Node Daily Snapshot Schema
        var trendNodeDailySnapshotName = TrendBlueprint.genSchemaName(this.schemaName, TrendSchemaType.NODE_DAILY_SNAPSHOT);
        var trendNodeDailySnapshotOS = this.genTrendNodeDailySnapshotSchemaDef(trendNodeDailySnapshotName);
        // 2. Get Trend Node Schema
        var trendNodeName = TrendBlueprint.genSchemaName(this.schemaName, TrendSchemaType.TREND_NODE);
        var trendNodeOS = this.genTrendNodeSchemaDef(trendNodeName, trendNodeDailySnapshotName);
        // 3. Get Trend Edge Schema
        var trendEdgeName = TrendBlueprint.genSchemaName(this.schemaName, TrendSchemaType.TREND_EDGE);
        var trendEdgeOS = this.genTrendEdgeSchemaDef(trendEdgeName);
        // 4. Get Trend Tag Node Schema
        var tagNodeName = TrendBlueprint.genSchemaName(this.schemaName, TrendSchemaType.TAG_NODE);
        var tagNodeOS = this.genTrendNodeSchemaDef(tagNodeName, trendNodeDailySnapshotName);
        // 5. Get Trend Tag Edge Schema
        var tagEdgeName = TrendBlueprint.genSchemaName(this.schemaName, TrendSchemaType.TAG_EDGE);
        var tagEdgeOS = this.genTrendEdgeSchemaDef(tagEdgeName);
        // 6. Compile and return
        return _a = {},
            _a[TrendSchemaType.TREND_NODE] = trendNodeOS,
            _a[TrendSchemaType.TAG_NODE] = trendEdgeOS,
            _a[TrendSchemaType.TREND_EDGE] = tagNodeOS,
            _a[TrendSchemaType.TAG_EDGE] = tagEdgeOS,
            _a[TrendSchemaType.NODE_DAILY_SNAPSHOT] = trendNodeDailySnapshotOS,
            _a;
    };
    // GETTERS
    TrendBlueprint.prototype.getTrendName = function () {
        return this.schemaName;
    };
    TrendBlueprint.prototype.getProperties = function () {
        return this.properties;
    };
    TrendBlueprint.prototype.getExistingTrendEntities = function () {
        return this.existingTrendEntities;
    };
    TrendBlueprint.prototype.getExistingTrendTags = function () {
        return this.existingTrendTags;
    };
    // JSON/OBJECT DE/SERIALIZATION
    TrendBlueprint.fromObj = function (obj) {
        var schemaName = obj.schemaName, realmPath = obj.realmPath, schemaMetadata = obj.schemaMetadata;
        var _a = schemaMetadata, properties = _a.properties, existingTrendEntities = _a.existingTrendEntities, exisitingTrendTags = _a.exisitingTrendTags;
        return new TrendBlueprint(schemaName, realmPath, properties, existingTrendEntities, exisitingTrendTags);
    };
    TrendBlueprint.fromRow = function (rowObj) {
        var schemaName = rowObj.schemaName, realmPath = rowObj.realmPath, blueprintType = rowObj.blueprintType, schemaMetadataStr = rowObj.schemaMetadataStr;
        var _a = JSON.parse(schemaMetadataStr), properties = _a.properties, existingTrendEntities = _a.existingTrendEntities, exisitingTrendTags = _a.exisitingTrendTags;
        var obj = {
            schemaName: schemaName,
            realmPath: realmPath,
            blueprintType: blueprintType,
            schemaMetadata: {
                properties: properties,
                existingTrendEntities: existingTrendEntities,
                exisitingTrendTags: exisitingTrendTags
            }
        };
        return TrendBlueprint.fromObj(obj);
    };
    TrendBlueprint.prototype.toObj = function () {
        return {
            schemaName: this.getTrendName(),
            realmPath: this.realmPath,
            blueprintType: BlueprintTypeEnum.TREND,
            schemaMetadata: {
                properties: this.properties,
                existingTrendEntities: this.existingTrendEntities,
                exisitingTrendTags: this.existingTrendTags
            }
        };
    };
    TrendBlueprint.prototype.toRow = function () {
        var schemaMetadataStr = JSON.stringify({
            properties: this.properties,
            existingTrendEntities: this.existingTrendEntities,
            exisitingTrendTags: this.existingTrendTags
        });
        return {
            schemaName: this.getTrendName(),
            realmPath: this.realmPath,
            blueprintType: BlueprintTypeEnum.TREND,
            schemaMetadataStr: schemaMetadataStr
        };
    };
    // SAVE TO/ DELETE FROM DISK UTILS
    TrendBlueprint.save = function (defaultRealm, trendName, realmPath, properties, existingTrendEntities, existingTrendTags) {
        if (existingTrendEntities === void 0) { existingTrendEntities = []; }
        if (existingTrendTags === void 0) { existingTrendTags = []; }
        var trendBlueprint = new TrendBlueprint(trendName, realmPath, properties, existingTrendEntities, existingTrendTags);
        trendBlueprint.save(defaultRealm);
        return trendBlueprint;
    };
    TrendBlueprint.prototype.save = function (defaultRealm) {
        var trendBlueprintRow = this.toRow();
        defaultRealm.write(function () {
            defaultRealm.create(BlueprintNameEnum.TREND, trendBlueprintRow);
        });
    };
    TrendBlueprint.prototype["delete"] = function (defaultRealm) {
        var primaryKey = this.schemaName;
        if (primaryKey) {
            defaultRealm.write(function () {
                var realmObj = defaultRealm.objectForPrimaryKey(BlueprintNameEnum.TREND, primaryKey);
                if (realmObj) {
                    defaultRealm["delete"](realmObj);
                    return true;
                }
            });
        }
        // No primary key or no entry found in realm
        return false;
    };
    TrendBlueprint.prototype.getBlueprintType = function () {
        return BlueprintTypeEnum.METADATA;
    };
    TrendBlueprint.prototype.getSchemaDefs = function () {
        return Object.values(this.toTrendSchemaBlueprints());
    };
    // High level disk operations
    // Trend entities
    TrendBlueprint.prototype.addExistingTrendEntities = function (realm, trendEntitiesToAdd) {
        var _a;
        (_a = this.existingTrendEntities).push.apply(_a, trendEntitiesToAdd);
        this.save(realm);
    };
    TrendBlueprint.prototype.rmExistingTrendEntities = function (realm, trendEntitiesToRm) {
        this.existingTrendEntities = this.existingTrendEntities.filter(function (existingTrendEntity) { return !trendEntitiesToRm.includes(existingTrendEntity); });
        this.save(realm);
    };
    // Trend tags
    TrendBlueprint.prototype.addExistingTrendTags = function (realm, trendTagsToAdd) {
        var _a;
        (_a = this.existingTrendEntities).push.apply(_a, trendTagsToAdd);
        this.save(realm);
    };
    TrendBlueprint.prototype.rmExistingTrendTags = function (realm, trendTagsToRm) {
        this.existingTrendEntities = this.existingTrendEntities.filter(function (existingTrendEntity) { return !trendTagsToRm.includes(existingTrendEntity); });
        this.save(realm);
    };
    __decorate([
        Base_1.Override('Blueprint')
    ], TrendBlueprint.prototype, "toObj");
    __decorate([
        Base_1.Override('Blueprint')
    ], TrendBlueprint.prototype, "toRow");
    __decorate([
        Base_1.Override('Blueprint')
    ], TrendBlueprint.prototype, "save");
    __decorate([
        Base_1.Override('Blueprint')
    ], TrendBlueprint.prototype, "delete");
    __decorate([
        Base_1.Override('Blueprint')
    ], TrendBlueprint.prototype, "getBlueprintType");
    __decorate([
        Base_1.Override('Blueprint')
    ], TrendBlueprint.prototype, "getSchemaDefs");
    __decorate([
        Base_1.Override('Blueprint')
    ], TrendBlueprint, "fromObj");
    __decorate([
        Base_1.Override('Blueprint')
    ], TrendBlueprint, "fromRow");
    __decorate([
        Base_1.Override('Blueprint')
    ], TrendBlueprint, "save");
    return TrendBlueprint;
}(MetaDataBlueprint_1.MetaDataBlueprint));
exports.TrendBlueprint = TrendBlueprint;
