// Db Definition
declare type RealmPath = string;
declare type SchemaName = string;

// User Defined Object Definitions
declare interface SchemaBlueprintObj {
  schemaName: string;
  realmPath: string;
  schemaType: SchemaTypeEnum;
  schemaDef: Realm.ObjectSchema;
}
declare interface TrendBlueprintObj {
  trendName: string;
  realmPath: string;
  properties: string[];
  existingTrendEntities: string[];
  exisitingTrendTags: string[];
}

// User Defined Table Definitions
declare type SchemaBlueprintRow = {
  schemaName: string;
  realmPath: string;
  schemaType: SchemaTypeEnum;
  schemaStr: string;
};

declare type TrendBlueprintRow = TrendBlueprintObj;

// Static Schema Names
declare enum StaticSchemaName {
  Day = 'day',
  TrendSnapshot = 'trend snapshot',
  EntitySnapshot = 'entity snapshot',
  MoodSnapshot = 'mood snapshot',

  DayPart = 'day part',
  TrendEntry = 'trend entry',
}

// Schema Types
declare enum SchemaTypeEnum {
  // Schema, Trend, etc Blueprints
  Blueprint = 'blueprint',

  // Trends
  TREND_NODE = 'trend_node',
  TAG_NODE = 'tag_node',
  TREND_EDGE = 'trend_edge',
  TAG_EDGE = 'tag_edge',

  // Other
  Unknown = 'unknown',
}

// Blueprint names
// Only contains TrendBlueprint atm
declare type LoadedBlueprints = {
  [BlueprintNameEnum.Trend]: import('./Trends/TrendBlueprints').TrendBlueprint[];
};

declare enum BlueprintNameEnum {
  Schema = 'SchemaBlueprint',
  Trend = 'TrendBlueprint',
}

// Node and Edge Properties
declare type TrendNode = {
  id: string;
  edges: string[];
} & Dict<number>;

declare type TrendEdge = {
  id: string;
  nodes: string[];
} & Dict<number>;
