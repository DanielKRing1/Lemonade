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

  // FOR CREATING NEW SCHEMABLUEPRINTS

  public static PROPERTY_COUNT_SUFFIX = 'count';

  public static getPropertyKey(propertyName: string): string {
    return `${propertyName}`;
  }
  public static getPropertyCountKey(propertyName: string): string {
    return `${propertyName}_${TrendBlueprint.PROPERTY_COUNT_SUFFIX}`;
  }

  public static getSchemaName(trendName: string, schemaType: SchemaTypeEnum) {
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

  private getTrendNodeSchemaDef = (schemaName: string): Realm.ObjectSchema => {
    // 1. Get property ratings to add to Trend Schema
    const addedProperties: Dict<Realm.ObjectSchemaProperty> = this.getTrendProperties();

    // 2. Get property counts to add to Trend Schema
    const addedPropertyCounts: Dict<Realm.ObjectSchemaProperty> = this.getTrendPropertyCounts();

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

  private getTrendEdgeSchemaDef = (schemaName: string): Realm.ObjectSchema => {
    // 1. Get property ratings to add to Trend Schema
    const addedProperties: Dict<Realm.ObjectSchemaProperty> = this.getTrendProperties();

    // 2. Get property counts to add to Trend Schema
    const addedPropertyCounts: Dict<Realm.ObjectSchemaProperty> = this.getTrendPropertyCounts();

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

  private getTrendProperties(): Dict<Realm.ObjectSchemaProperty> {
    const propertyKeys: string[] = this.properties.map((propertyName) => TrendBlueprint.getPropertyKey(propertyName));
    const propertyValue: Realm.ObjectSchemaProperty = {type: 'float', default: 0};

    const properties: Dict<Realm.ObjectSchemaProperty> = ObjectBuilder.buildUniformObject(propertyKeys, propertyValue);

    return properties;
  }

  private getTrendPropertyCounts(): Dict<Realm.ObjectSchemaProperty> {
    const propertyKeys: string[] = this.properties.map((propertyName) => TrendBlueprint.getPropertyCountKey(propertyName));
    const propertyValue: Realm.ObjectSchemaProperty = {type: 'float', default: 0};

    const properties: Dict<Realm.ObjectSchemaProperty> = ObjectBuilder.buildUniformObject(propertyKeys, propertyValue);

    return properties;
  }

  // SCHEMABLUEPRINT UTILS

  public toSchemaBlueprints(): CompleteTrendBlueprints {
    // 1. Get Trend Node Schema
    const trendNodeName: string = TrendBlueprint.getSchemaName(this.trendName, SchemaTypeEnum.TREND_NODE);
    const trendNodeSB: SchemaBlueprint = new SchemaBlueprint(trendNodeName, this.realmPath, SchemaTypeEnum.TREND_NODE, this.getTrendNodeSchemaDef(trendNodeName));

    // 2. Get Trend Edge Schema
    const trendEdgeName: string = TrendBlueprint.getSchemaName(this.trendName, SchemaTypeEnum.TREND_EDGE);
    const trendEdgeSB: SchemaBlueprint = new SchemaBlueprint(trendEdgeName, this.realmPath, SchemaTypeEnum.TREND_EDGE, this.getTrendNodeSchemaDef(trendEdgeName));

    // 3. Get Trend Tag Node Schema
    const tagNodeName: string = TrendBlueprint.getSchemaName(this.trendName, SchemaTypeEnum.TAG_NODE);
    const tagNodeSB: SchemaBlueprint = new SchemaBlueprint(tagNodeName, this.realmPath, SchemaTypeEnum.TAG_NODE, this.getTrendEdgeSchemaDef(tagNodeName));

    // 4. Get Trend Tag Node Schema
    const tagEdgeName: string = TrendBlueprint.getSchemaName(this.trendName, SchemaTypeEnum.TAG_EDGE);
    const tagEdgeSB: SchemaBlueprint = new SchemaBlueprint(tagEdgeName, this.realmPath, SchemaTypeEnum.TAG_EDGE, this.getTrendEdgeSchemaDef(tagEdgeName));

    return {
      [SchemaTypeEnum.TREND_NODE]: trendNodeSB,
      [SchemaTypeEnum.TAG_NODE]: trendEdgeSB,
      [SchemaTypeEnum.TREND_EDGE]: tagNodeSB,
      [SchemaTypeEnum.TAG_EDGE]: tagEdgeSB,
    };
  }

  private trendName: string;
  private realmPath: string;
  private properties: string[];

  constructor(trendName: string, realmPath: string, properties: string[]) {
    this.trendName = trendName;
    this.realmPath = realmPath;
    this.properties = properties;
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

  //   CONVERSION

  static fromObj(obj: TrendBlueprintObj): TrendBlueprint {
    const {trendName, realmPath, properties} = obj;

    return new TrendBlueprint(trendName, realmPath, properties);
  }

  static fromRow(rowObj: TrendBlueprintRow): TrendBlueprint {
    const {trendName, realmPath, properties} = rowObj;

    const obj = {
      trendName,
      realmPath,
      properties,
    };

    return TrendBlueprint.fromObj(obj);
  }

  toObj(): TrendBlueprintObj {
    return {
      trendName: this.trendName,
      realmPath: this.realmPath,
      properties: this.properties,
    };
  }

  toRow(): TrendBlueprintRow {
    return {
      trendName: this.trendName,
      realmPath: this.realmPath,
      properties: this.properties,
    };
  }

  //   SAVE

  static save(realm: Realm, trendName: string, realmPath: string, properties: string[]): TrendBlueprint {
    const trendBlueprint = new TrendBlueprint(trendName, realmPath, properties);
    trendBlueprint.save(realm);

    return trendBlueprint;
  }

  save(realm: Realm): TrendBlueprintRow {
    const trendBlueprintRow: TrendBlueprintRow = this.toRow();

    realm.write(() => {
      realm.create(SchemaNameEnum.TrendBlueprint, trendBlueprintRow);
    });

    return trendBlueprintRow;
  }

  delete(realm: Realm): boolean {
    const primaryKey: string = this.trendName;

    if (primaryKey) {
      realm.write(() => {
        const realmObj: Realm.Results<any> | undefined = realm.objectForPrimaryKey(SchemaNameEnum.TrendBlueprint, primaryKey);

        if (realmObj) {
          realm.delete(realmObj);

          return true;
        }
      });
    }

    // No primary key or no entry found in realm
    return false;
  }
}
