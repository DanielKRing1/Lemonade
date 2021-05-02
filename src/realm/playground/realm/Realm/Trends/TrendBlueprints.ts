import {SchemaBlueprint} from '../Schema/SchemaBlueprint';
import {DEFAULT_PATH} from '../../../../../constants';
import {ObjectBuilder} from '../Utility';

export class TrendBlueprint {
  // FOR SAVING/LOADING TRENDSCHEMABLUEPRINTS TO/FROM REALM

  public static SCHEMA_BLUEPRINT_SCHEMA_DEF: Realm.ObjectSchema = {
    name: SchemaNameEnum.TrendBlueprint,
    primaryKey: 'trendName',
    properties: {
      trendName: 'string',
      realmPath: 'string',
      properties: 'string[]',
    },
  };
  public static SCHEMA_BLUEPRINT: SchemaBlueprint = new SchemaBlueprint(SchemaNameEnum.TrendBlueprint, DEFAULT_PATH, SchemaTypeEnum.Blueprint, TrendBlueprint.SCHEMA_BLUEPRINT_SCHEMA_DEF);

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
    }

    return `${trendName}_Unknown`;
  }

  private trendName: string;
  private realmPath: string;
  private properties: string[];
  private existingTrendEntities: string[];

  constructor(trendName: string, realmPath: string, properties: string[], existingTrendEntities: string[] = []) {
    this.trendName = trendName;
    this.realmPath = realmPath;
    this.properties = properties;
    this.existingTrendEntities = existingTrendEntities;
  }

  // GENERATE PREDICTABLE SCHEMA DEFINITIONS FOR NEW SCHEMABLUEPRINTS

  private genTrendNodeSchemaDef = (schemaName: string): Realm.ObjectSchema => {
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

  private genTrendProperties(): Dict<Realm.ObjectSchemaProperty> {
    const propertyKeys: string[] = this.properties.map((propertyName) => TrendBlueprint.genPropertyKey(propertyName));
    const propertyValue: Realm.ObjectSchemaProperty = {type: 'float', default: 0};

    const properties: Dict<Realm.ObjectSchemaProperty> = ObjectBuilder.buildUniformObject(propertyKeys, propertyValue);

    return properties;
  }

  private genTrendPropertyCounts(): Dict<Realm.ObjectSchemaProperty> {
    const propertyKeys: string[] = this.properties.map((propertyName) => TrendBlueprint.genPropertyCountKey(propertyName));
    const propertyValue: Realm.ObjectSchemaProperty = {type: 'float', default: 0};

    const properties: Dict<Realm.ObjectSchemaProperty> = ObjectBuilder.buildUniformObject(propertyKeys, propertyValue);

    return properties;
  }

  // SCHEMABLUEPRINT SERIALIZE UTILS

  public toSchemaBlueprints(): CompleteTrendSB {
    // 1. Get Trend Node Schema
    const trendNodeName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.TREND_NODE);
    const trendNodeSB: SchemaBlueprint = new SchemaBlueprint(trendNodeName, this.realmPath, SchemaTypeEnum.TREND_NODE, this.genTrendNodeSchemaDef(trendNodeName));

    // 2. Get Trend Edge Schema
    const trendEdgeName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.TREND_EDGE);
    const trendEdgeSB: SchemaBlueprint = new SchemaBlueprint(trendEdgeName, this.realmPath, SchemaTypeEnum.TREND_EDGE, this.genTrendNodeSchemaDef(trendEdgeName));

    // 3. Get Trend Tag Node Schema
    const tagNodeName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.TAG_NODE);
    const tagNodeSB: SchemaBlueprint = new SchemaBlueprint(tagNodeName, this.realmPath, SchemaTypeEnum.TAG_NODE, this.genTrendEdgeSchemaDef(tagNodeName));

    // 4. Get Trend Tag Node Schema
    const tagEdgeName: string = TrendBlueprint.genSchemaName(this.trendName, SchemaTypeEnum.TAG_EDGE);
    const tagEdgeSB: SchemaBlueprint = new SchemaBlueprint(tagEdgeName, this.realmPath, SchemaTypeEnum.TAG_EDGE, this.genTrendEdgeSchemaDef(tagEdgeName));

    // 5. Compile and return
    return {
      [SchemaTypeEnum.TREND_NODE]: trendNodeSB,
      [SchemaTypeEnum.TAG_NODE]: trendEdgeSB,
      [SchemaTypeEnum.TREND_EDGE]: tagNodeSB,
      [SchemaTypeEnum.TAG_EDGE]: tagEdgeSB,
    };
  }

  // GETTERS

  public getTrendName(): string {
    return this.trendName;
  }

  public getrealmPath(): string {
    return this.realmPath;
  }

  public getProperties(): string[] {
    return this.properties;
  }

  public getExistingTrendEntities(): string[] {
    return this.existingTrendEntities;
  }

  // JSON/OBJECT DE/SERIALIZATION

  static fromObj(obj: TrendBlueprintObj): TrendBlueprint {
    const {trendName, realmPath, properties, existingTrendEntities} = obj;

    return new TrendBlueprint(trendName, realmPath, properties, existingTrendEntities);
  }

  static fromRow(rowObj: TrendBlueprintRow): TrendBlueprint {
    const {trendName, realmPath, properties, existingTrendEntities} = rowObj;

    const obj = {
      trendName,
      realmPath,
      properties,
      existingTrendEntities,
    };

    return TrendBlueprint.fromObj(obj);
  }

  toObj(): TrendBlueprintObj {
    return {
      trendName: this.trendName,
      realmPath: this.realmPath,
      properties: this.properties,
      existingTrendEntities: this.existingTrendEntities,
    };
  }

  toRow(): TrendBlueprintRow {
    return {
      trendName: this.trendName,
      realmPath: this.realmPath,
      properties: this.properties,
      existingTrendEntities: this.existingTrendEntities,
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
      defaultRealm.create(SchemaNameEnum.TrendBlueprint, trendBlueprintRow);
    });

    return trendBlueprintRow;
  }

  delete(defaultRealm: Realm): boolean {
    const primaryKey: string = this.trendName;

    if (primaryKey) {
      defaultRealm.write(() => {
        const realmObj: Realm.Results<any> | undefined = defaultRealm.objectForPrimaryKey(SchemaNameEnum.TrendBlueprint, primaryKey);

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

  public addExistingTrendEntity(realm: Realm, trendEntitiesToAdd: string[]) {
    this.existingTrendEntities.push(...trendEntitiesToAdd);
    this.save(realm);
  }

  public rmExistingTrendEntity(realm: Realm, trendEntitiesToRm: string[]) {
    this.existingTrendEntities = this.existingTrendEntities.filter((existingTrendEntity: string) => !trendEntitiesToRm.includes(existingTrendEntity));
    this.save(realm);
  }
}
