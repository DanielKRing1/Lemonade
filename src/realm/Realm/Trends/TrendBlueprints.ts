import {SchemaBlueprint} from '../Schema/SchemaBlueprint';
import {DEFAULT_PATH} from '../../../constants';
import {ObjectBuilder} from '../../../util';

export class TrendBlueprint {
  // FOR SAVING/LOADING TRENDSCHEMABLUEPRINTS TO/FROM REALM

  public static SCHEMA_BLUEPRINT_SCHEMA_DEF: Realm.ObjectSchema = {
    name: BlueprintNameEnum.Trend,
    primaryKey: 'trendName',
    properties: {
      trendName: 'string',
      realmPath: 'string',
      properties: 'string[]',
    },
  };
  public static SCHEMA_BLUEPRINT: SchemaBlueprint = new SchemaBlueprint(BlueprintNameEnum.Trend, DEFAULT_PATH, SchemaTypeEnum.Blueprint, TrendBlueprint.SCHEMA_BLUEPRINT_SCHEMA_DEF);

  // GENERATE PREDICTABLE NAMES FOR NEW SCHEMABLUEPRINTS

  public static genPropertyKey(propertyName: string): string {
    return `${propertyName}`;
  }
  public static genPropertyCountKey(propertyName: string): string {
    return `${propertyName}_${TrendPropertySuffix.Count}`;
  }

  public static genSchemaName(trendName: string, schemaType: SchemaTypeEnum) {
    switch (schemaType) {
      case SchemaTypeEnum.TREND_NODE:
        return `${trendName}_${TrendNameSuffix.Node}`;

      case SchemaTypeEnum.TREND_EDGE:
        return `${trendName}_${TrendNameSuffix.Edge}`;

      case SchemaTypeEnum.TAG_NODE:
        return `${trendName}_${TrendNameSuffix.Tag}_${TrendNameSuffix.Node}`;

      case SchemaTypeEnum.TAG_EDGE:
        return `${trendName}_${TrendNameSuffix.Tag}_${TrendNameSuffix.Edge}`;

      case SchemaTypeEnum.NODE_DAILY_SNAPSHOT:
        return `${trendName}_${TrendNameSuffix.NodeDailySnapshot}`;

      // case SchemaTypeEnum.DAILY_SNAPSHOTS:
      //   return `${trendName}_${TrendNameSuffix.DailySnapshot}`;

      // case SchemaTypeEnum.MOOD_SNAPSHOT:
      //   return `${trendName}_${TrendNameSuffix.MoodSnapshot}`;
    }

    return `${trendName}_Unknown`;
  }

  private trendName: string;
  private realmPath: string;
  private properties: string[];

  private existingTrendEntities: string[];
  private existingTrendTags: string[];

  constructor(trendName: string, realmPath: string, properties: string[], existingTrendEntities: string[] = [], existingTrendTags: string[] = []) {
    this.trendName = trendName;
    this.realmPath = realmPath;
    this.properties = properties;

    this.existingTrendEntities = existingTrendEntities;
    this.existingTrendTags = existingTrendTags;
  }

  // GENERATE PREDICTABLE SCHEMA DEFINITIONS FOR NEW SCHEMABLUEPRINTS

  private genTrendNodeSchemaDef = (schemaName: string, nodeDailySnapshotSchemaName: string): Realm.ObjectSchema => {
    // 1. Get property ratings to add to Trend Schema
    const addedProperties: Dict<Realm.ObjectSchemaProperty> = this.genTrendProperties();

    // 2. Get property counts to add to Trend Schema
    const addedPropertyCounts: Dict<Realm.ObjectSchemaProperty> = this.genTrendPropertyCounts();

    // 3. Build and return SchemaDefinition
    return {
      name: schemaName,
      primaryKey: 'id',
      properties: {
        id: 'string',
        edges: 'string[]',
        dailySnapshots: `${nodeDailySnapshotSchemaName}[]`,
        ...addedProperties,
        ...addedPropertyCounts,
      },
    };
  };

  private genTrendEdgeSchemaDef = (schemaName: string): Realm.ObjectSchema => {
    // 1. Get property ratings to add to Trend Schema
    const addedProperties: Dict<Realm.ObjectSchemaProperty> = this.genTrendProperties();

    // 2. Get property counts to add to Trend Schema
    const addedPropertyCounts: Dict<Realm.ObjectSchemaProperty> = this.genTrendPropertyCounts();

    // 3. Build and return SchemaDefinition
    return {
      name: schemaName,
      primaryKey: 'id',
      properties: {
        id: 'string',
        nodes: 'string[]',
        ...addedProperties,
        ...addedPropertyCounts,
      },
    };
  };

  private genTrendNodeDailySnapshotSchemaDef = (schemaName: string): Realm.ObjectSchema => {
    // 1. Get property ratings to add to Trend Schema
    const propertiesToSnapshot: Dict<Realm.ObjectSchemaProperty> = this.genTrendProperties();

    // 2. Build and return SchemaDefinition
    return {
      name: schemaName,
      properties: {
        date: 'date',
        ...propertiesToSnapshot,
      },
    };
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

  private genTrendProperties(): Dict<Realm.ObjectSchemaProperty> {
    // 1. Map each of this Trend's moods/properties to a uniform naming convention
    const propertyKeys: string[] = this.properties.map((propertyName) => TrendBlueprint.genPropertyKey(propertyName));
    // 2. Init the default Realm definition that will apply to each property
    const propertyValue: Realm.ObjectSchemaProperty = {type: 'float', default: 0};

    // 3. Build the actual, complete set of Realm definition for this Trend's moods/properties
    const properties: Dict<Realm.ObjectSchemaProperty> = ObjectBuilder.buildUniformObject(propertyKeys, propertyValue);

    return properties;
  }

  private genTrendPropertyCounts(): Dict<Realm.ObjectSchemaProperty> {
    // 1. Map each of this Trend's moods/properties to a uniform naming convention for 'property count' attributes
    const propertyKeys: string[] = this.properties.map((propertyName) => TrendBlueprint.genPropertyCountKey(propertyName));
    // 2. Init the default Realm definition that will apply to each property
    const propertyValue: Realm.ObjectSchemaProperty = {type: 'float', default: 0};

    // 3. Build the actual, complete set of Realm definition for this Trend's mood/property counts
    const properties: Dict<Realm.ObjectSchemaProperty> = ObjectBuilder.buildUniformObject(propertyKeys, propertyValue);

    return properties;
  }

  // SCHEMABLUEPRINT SERIALIZE UTILS

  public toSchemaBlueprints(): CompleteTrendSB {
    // // 1. Get NodeMoodSnapshot Schema
    // const nodeMoodSnapshotName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.MOOD_SNAPSHOT);
    // const nodeMoodSnapshotSB: SchemaBlueprint = new SchemaBlueprint(nodeMoodSnapshotName, this.realmPath, SchemaTypeEnum.DAILY_SNAPSHOTS, this.genTrendMoodSnapshotSchemaDef(nodeMoodSnapshotName));

    // // 2. Get NodeDailySnapshot Schema
    // const nodeDailySnapshotName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.DAILY_SNAPSHOTS);
    // const nodeDailySnapshotSB: SchemaBlueprint = new SchemaBlueprint(
    //   nodeDailySnapshotName,
    //   this.realmPath,
    //   SchemaTypeEnum.DAILY_SNAPSHOTS,
    //   this.genTrendDailySnapshotSchemaDef(nodeDailySnapshotName, nodeMoodSnapshotName),
    // );

    // 1. Get Trend Node Daily Snapshot Schema
    const trendNodeDailySnapshotName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.NODE_DAILY_SNAPSHOT);
    const trendNodeDailySnapshotSB: SchemaBlueprint = new SchemaBlueprint(
      trendNodeDailySnapshotName,
      this.realmPath,
      SchemaTypeEnum.NODE_DAILY_SNAPSHOT,
      this.genTrendNodeDailySnapshotSchemaDef(trendNodeDailySnapshotName),
    );

    // 2. Get Trend Node Schema
    const trendNodeName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.TREND_NODE);
    const trendNodeSB: SchemaBlueprint = new SchemaBlueprint(trendNodeName, this.realmPath, SchemaTypeEnum.TREND_NODE, this.genTrendNodeSchemaDef(trendNodeName, trendNodeDailySnapshotName));

    // 3. Get Trend Edge Schema
    const trendEdgeName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.TREND_EDGE);
    const trendEdgeSB: SchemaBlueprint = new SchemaBlueprint(trendEdgeName, this.realmPath, SchemaTypeEnum.TREND_EDGE, this.genTrendEdgeSchemaDef(trendEdgeName));

    // 4. Get Trend Tag Node Schema
    const tagNodeName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.TAG_NODE);
    const tagNodeSB: SchemaBlueprint = new SchemaBlueprint(tagNodeName, this.realmPath, SchemaTypeEnum.TAG_NODE, this.genTrendNodeSchemaDef(tagNodeName, trendNodeDailySnapshotName));

    // 5. Get Trend Tag Edge Schema
    const tagEdgeName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.TAG_EDGE);
    const tagEdgeSB: SchemaBlueprint = new SchemaBlueprint(tagEdgeName, this.realmPath, SchemaTypeEnum.TAG_EDGE, this.genTrendEdgeSchemaDef(tagEdgeName));

    // 6. Compile and return
    return {
      [SchemaTypeEnum.TREND_NODE]: trendNodeSB,
      [SchemaTypeEnum.TAG_NODE]: trendEdgeSB,
      [SchemaTypeEnum.TREND_EDGE]: tagNodeSB,
      [SchemaTypeEnum.TAG_EDGE]: tagEdgeSB,

      [SchemaTypeEnum.NODE_DAILY_SNAPSHOT]: trendNodeDailySnapshotSB,
      // [SchemaTypeEnum.DAILY_SNAPSHOTS]: nodeDailySnapshotSB,
      // [SchemaTypeEnum.MOOD_SNAPSHOT]: nodeMoodSnapshotSB,
    };
  }

  // GETTERS

  public getTrendName(): string {
    return this.trendName;
  }

  public getRealmPath(): string {
    return this.realmPath;
  }

  public getProperties(): string[] {
    return this.properties;
  }

  public getExistingTrendEntities(): string[] {
    return this.existingTrendEntities;
  }

  public getExistingTrendTags(): string[] {
    return this.existingTrendTags;
  }

  // JSON/OBJECT DE/SERIALIZATION

  static fromObj(obj: TrendBlueprintObj): TrendBlueprint {
    const {trendName, realmPath, properties, existingTrendEntities, exisitingTrendTags} = obj;

    return new TrendBlueprint(trendName, realmPath, properties, existingTrendEntities);
  }

  static fromRow(rowObj: TrendBlueprintRow): TrendBlueprint {
    const {trendName, realmPath, properties, existingTrendEntities, exisitingTrendTags} = rowObj;

    const obj = {
      trendName,
      realmPath,
      properties,
      existingTrendEntities,
      exisitingTrendTags,
    };

    return TrendBlueprint.fromObj(obj);
  }

  toObj(): TrendBlueprintObj {
    return {
      trendName: this.trendName,
      realmPath: this.realmPath,
      properties: this.properties,
      existingTrendEntities: this.existingTrendEntities,
      exisitingTrendTags: this.existingTrendTags,
    };
  }

  toRow(): TrendBlueprintRow {
    return {
      trendName: this.trendName,
      realmPath: this.realmPath,
      properties: this.properties,
      existingTrendEntities: this.existingTrendEntities,
      exisitingTrendTags: this.existingTrendTags,
    };
  }

  // SAVE TO/ DELETE FROM DISK UTILS

  static save(defaultRealm: Realm, trendName: string, realmPath: string, properties: string[], existingTrendEntities: string[] = []): TrendBlueprint {
    const trendBlueprint = new TrendBlueprint(trendName, realmPath, properties, existingTrendEntities);
    trendBlueprint.save(defaultRealm);

    return trendBlueprint;
  }

  save(defaultRealm: Realm): TrendBlueprintRow {
    const trendBlueprintRow: TrendBlueprintRow = this.toRow();

    defaultRealm.write(() => {
      defaultRealm.create(BlueprintNameEnum.Trend, trendBlueprintRow);
    });

    return trendBlueprintRow;
  }

  delete(defaultRealm: Realm): boolean {
    const primaryKey: string = this.trendName;

    if (primaryKey) {
      defaultRealm.write(() => {
        const realmObj: Realm.Results<any> | undefined = defaultRealm.objectForPrimaryKey(BlueprintNameEnum.Trend, primaryKey);

        if (realmObj) {
          defaultRealm.delete(realmObj);

          return true;
        }
      });
    }

    // No primary key or no entry found in realm
    return false;
  }

  // High level disk operations

  // Trend entities
  public addExistingTrendEntities(realm: Realm, trendEntitiesToAdd: string[]) {
    this.existingTrendEntities.push(...trendEntitiesToAdd);
    this.save(realm);
  }

  public rmExistingTrendEntities(realm: Realm, trendEntitiesToRm: string[]) {
    this.existingTrendEntities = this.existingTrendEntities.filter((existingTrendEntity: string) => !trendEntitiesToRm.includes(existingTrendEntity));
    this.save(realm);
  }

  // Trend tags
  public addExistingTrendTags(realm: Realm, trendTagsToAdd: string[]) {
    this.existingTrendEntities.push(...trendTagsToAdd);
    this.save(realm);
  }

  public rmExistingTrendTags(realm: Realm, trendTagsToRm: string[]) {
    this.existingTrendEntities = this.existingTrendEntities.filter((existingTrendEntity: string) => !trendTagsToRm.includes(existingTrendEntity));
    this.save(realm);
  }
}
