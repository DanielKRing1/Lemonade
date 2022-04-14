// Db Definition
declare type RealmPath = string;
declare type SchemaName = string;

declare interface BlueprintObj {
  schemaName: string;
  realmPath: string;
  blueprintType: BlueprintTypeEnum;
  schemaMetadata: Dict<any>;
}

// User Defined Object Definitions
declare interface SchemaBlueprintObj extends BlueprintObj {}
declare interface TrendSchemaMetadata {
  properties: string[];
  existingTrendEntities: string[];
  exisitingTrendTags: string[];
}

// User Defined Table Definitions
declare type BlueprintRow = {
  schemaName: string;
  realmPath: string;
  blueprintType: BlueprintTypeEnum;
  schemaMetadataStr: string;
};

// Static Schema Names
declare enum StaticSchemaName {
  Day = 'day',
  TrendSnapshot = 'trend snapshot',
  EntitySnapshot = 'entity snapshot',
  MoodSnapshot = 'mood snapshot',

  DayPart = 'day part',
  TrendEntry = 'trend entry',
}

// Schema Metadata Types
declare enum BlueprintTypeEnum {
  // Schema, Trend, etc Blueprints
  METADATA = 'metadata',

  SCHEMA = 'schema',

  // Trends
  TREND = 'trend',

  // Other
  Unknown = 'unknown',
}

// Trend Schema Types
declare enum TrendSchemaType {
  TREND_NODE = 'trend_node',
  TAG_NODE = 'tag_node',
  TREND_EDGE = 'trend_edge',
  TAG_EDGE = 'tag_edge',

  NODE_DAILY_SNAPSHOT = 'node_daily_snapshot',
}

// Blueprint names
// Only contains TrendBlueprint atm
declare type LoadedBlueprints = {
  [BlueprintNameEnum.TREND]: import('./Trends/TrendBlueprint').TrendBlueprint[];
};

declare const METADATA_SCHEMA_NAME = 'metadata_schema';

declare enum BlueprintNameEnum {
  METADATA = 'MetaDataBlueprint',
  TREND = 'TrendBlueprint',
}

// Node and Edge Properties
declare type TrendNode = {
  id: string;
  edges: string[];
  dailySnapshots: TrendNodeDailySnapshot[];
  // // List of snapshots of the TrendNode's moods in the past
  // dailySnapshots: NodeSnapshots;
} & Dict<number>;
declare type TrendNodeDailySnapshot = {
  date: Date;
} & Dict<number>;
// declare type NodeSnapshots = {
//   nodeName: string;
//   snapshots: NodeDailySnapshot[];
// };
// declare type NodeDailySnapshot = {
//   date: Date;
//   moodName: string;
//   rating: number;
// };

declare type TrendEdge = {
  id: string;
  nodes: string[];
} & Dict<number>;
