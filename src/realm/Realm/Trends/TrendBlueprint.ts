import {MetaDataBlueprint} from '../Schema/MetaDataBlueprint';
import {DEFAULT_PATH} from '../../../constants';
import {ObjectBuilder} from '../../../util';
import {Override} from '../../Base';

export class TrendBlueprint extends MetaDataBlueprint {
  // GENERATE PREDICTABLE NAMES FOR A NEW TREND'S SCHEMABLUEPRINTS

  public static genPropertyKey(propertyName: string): string {
    return `${propertyName}`;
  }
  public static genPropertyCountKey(propertyName: string): string {
    return `${propertyName}_${TrendPropertySuffix.Count}`;
  }

  public static genSchemaName(trendName: string, trendSchemaType: TrendSchemaType) {
    switch (trendSchemaType) {
      case TrendSchemaType.TREND_NODE:
        return `${trendName}_${TrendNameSuffix.Node}`;

      case TrendSchemaType.TREND_EDGE:
        return `${trendName}_${TrendNameSuffix.Edge}`;

      case TrendSchemaType.TAG_NODE:
        return `${trendName}_${TrendNameSuffix.Tag}_${TrendNameSuffix.Node}`;

      case TrendSchemaType.TAG_EDGE:
        return `${trendName}_${TrendNameSuffix.Tag}_${TrendNameSuffix.Edge}`;

      case TrendSchemaType.NODE_DAILY_SNAPSHOT:
        return `${trendName}_${TrendNameSuffix.NodeDailySnapshot}`;

      // case SchemaTypeEnum.DAILY_SNAPSHOTS:
      //   return `${trendName}_${TrendNameSuffix.DailySnapshot}`;

      // case SchemaTypeEnum.MOOD_SNAPSHOT:
      //   return `${trendName}_${TrendNameSuffix.MoodSnapshot}`;
    }

    return `${trendName}_Unknown`;
  }

  private properties: string[];

  private existingTrendEntities: string[];
  private existingTrendTags: string[];

  constructor(trendName: string, realmPath: string, properties: string[], existingTrendEntities: string[] = [], existingTrendTags: string[] = []) {
    super(trendName, realmPath, BlueprintTypeEnum.TREND, {
      properties,
      existingTrendEntities,
      existingTrendTags,
    });

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

  public toTrendSchemaBlueprints(): CompleteTrendOS {
    // // 1. Get NodeMoodSnapshot Schema
    // const nodeMoodSnapshotName: string = TrendBlueprint.genSchemaName(this.schemaName, SchemaTypeEnum.MOOD_SNAPSHOT);
    // const nodeMoodSnapshotSB: MetaDataBlueprint = new MetaDataBlueprint(nodeMoodSnapshotName, this.realmPath, SchemaTypeEnum.DAILY_SNAPSHOTS, this.genTrendMoodSnapshotSchemaDef(nodeMoodSnapshotName));

    // // 2. Get NodeDailySnapshot Schema
    // const nodeDailySnapshotName: string = TrendBlueprint.genSchemaName(this.schemaName, SchemaTypeEnum.DAILY_SNAPSHOTS);
    // const nodeDailySnapshotSB: MetaDataBlueprint = new MetaDataBlueprint(
    //   nodeDailySnapshotName,
    //   this.realmPath,
    //   SchemaTypeEnum.DAILY_SNAPSHOTS,
    //   this.genTrendDailySnapshotSchemaDef(nodeDailySnapshotName, nodeMoodSnapshotName),
    // );

    // 1. Get Trend Node Daily Snapshot Schema
    const trendNodeDailySnapshotName: string = TrendBlueprint.genSchemaName(this.schemaName, TrendSchemaType.NODE_DAILY_SNAPSHOT);
    const trendNodeDailySnapshotOS: Realm.ObjectSchema = this.genTrendNodeDailySnapshotSchemaDef(trendNodeDailySnapshotName);

    // 2. Get Trend Node Schema
    const trendNodeName: string = TrendBlueprint.genSchemaName(this.schemaName, TrendSchemaType.TREND_NODE);
    const trendNodeOS: Realm.ObjectSchema = this.genTrendNodeSchemaDef(trendNodeName, trendNodeDailySnapshotName);

    // 3. Get Trend Edge Schema
    const trendEdgeName: string = TrendBlueprint.genSchemaName(this.schemaName, TrendSchemaType.TREND_EDGE);
    const trendEdgeOS: Realm.ObjectSchema = this.genTrendEdgeSchemaDef(trendEdgeName);

    // 4. Get Trend Tag Node Schema
    const tagNodeName: string = TrendBlueprint.genSchemaName(this.schemaName, TrendSchemaType.TAG_NODE);
    const tagNodeOS: Realm.ObjectSchema = this.genTrendNodeSchemaDef(tagNodeName, trendNodeDailySnapshotName);

    // 5. Get Trend Tag Edge Schema
    const tagEdgeName: string = TrendBlueprint.genSchemaName(this.schemaName, TrendSchemaType.TAG_EDGE);
    const tagEdgeOS: Realm.ObjectSchema = this.genTrendEdgeSchemaDef(tagEdgeName);

    // 6. Compile and return
    return {
      [TrendSchemaType.TREND_NODE]: trendNodeOS,
      [TrendSchemaType.TAG_NODE]: trendEdgeOS,
      [TrendSchemaType.TREND_EDGE]: tagNodeOS,
      [TrendSchemaType.TAG_EDGE]: tagEdgeOS,

      [TrendSchemaType.NODE_DAILY_SNAPSHOT]: trendNodeDailySnapshotOS,
      // [SchemaTypeEnum.DAILY_SNAPSHOTS]: nodeDailySnapshotSB,
      // [SchemaTypeEnum.MOOD_SNAPSHOT]: nodeMoodSnapshotSB,
    };
  }

  // GETTERS

  public getTrendName(): string {
    return this.schemaName;
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

  @Override('Blueprint')
  static fromObj(obj: BlueprintObj): TrendBlueprint {
    const {schemaName, realmPath, schemaMetadata} = obj;
    const {properties, existingTrendEntities, exisitingTrendTags} = schemaMetadata as TrendSchemaMetadata;

    return new TrendBlueprint(schemaName, realmPath, properties, existingTrendEntities, exisitingTrendTags);
  }

  @Override('Blueprint')
  static fromRow(rowObj: BlueprintRow): TrendBlueprint {
    const {schemaName, realmPath, blueprintType, schemaMetadataStr} = rowObj;
    const {properties, existingTrendEntities, exisitingTrendTags} = JSON.parse(schemaMetadataStr) as TrendSchemaMetadata;

    const obj: BlueprintObj = {
      schemaName,
      realmPath,
      blueprintType,
      schemaMetadata: {
        properties,
        existingTrendEntities,
        exisitingTrendTags,
      },
    };

    return TrendBlueprint.fromObj(obj);
  }

  @Override('Blueprint')
  toObj(): BlueprintObj {
    return {
      schemaName: this.getTrendName(),
      realmPath: this.realmPath,
      blueprintType: BlueprintTypeEnum.TREND,
      schemaMetadata: {
        properties: this.properties,
        existingTrendEntities: this.existingTrendEntities,
        exisitingTrendTags: this.existingTrendTags,
      },
    };
  }

  @Override('Blueprint')
  toRow(): BlueprintRow {
    const schemaMetadataStr: string = JSON.stringify({
      properties: this.properties,
      existingTrendEntities: this.existingTrendEntities,
      exisitingTrendTags: this.existingTrendTags,
    });

    return {
      schemaName: this.getTrendName(),
      realmPath: this.realmPath,
      blueprintType: BlueprintTypeEnum.TREND,
      schemaMetadataStr,
    };
  }

  // SAVE TO/ DELETE FROM DISK UTILS

  @Override('Blueprint')
  static save(defaultRealm: Realm, trendName: string, realmPath: string, properties: string[], existingTrendEntities: string[] = [], existingTrendTags: string[] = []): TrendBlueprint {
    const trendBlueprint = new TrendBlueprint(trendName, realmPath, properties, existingTrendEntities, existingTrendTags);
    trendBlueprint.save(defaultRealm);

    return trendBlueprint;
  }

  @Override('Blueprint')
  save(defaultRealm: Realm): void {
    const trendBlueprintRow: BlueprintRow = this.toRow();

    defaultRealm.write(() => {
      defaultRealm.create(BlueprintNameEnum.TREND, trendBlueprintRow);
    });
  }

  @Override('Blueprint')
  delete(defaultRealm: Realm): boolean {
    const primaryKey: string = this.schemaName;

    if (primaryKey) {
      defaultRealm.write(() => {
        const realmObj: Realm.Results<any> | undefined = defaultRealm.objectForPrimaryKey(BlueprintNameEnum.TREND, primaryKey);

        if (realmObj) {
          defaultRealm.delete(realmObj);

          return true;
        }
      });
    }

    // No primary key or no entry found in realm
    return false;
  }

  @Override('Blueprint')
  public getBlueprintType(): BlueprintTypeEnum {
    return BlueprintTypeEnum.METADATA;
  }
  @Override('Blueprint')
  public getSchemaDefs(): Realm.ObjectSchema[] {
    return Object.values(this.toTrendSchemaBlueprints());
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
