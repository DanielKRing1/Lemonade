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
}

// User Defined Table Definitions
declare type SchemaBlueprintRow = {
  schemaName: string;
  realmPath: string;
  schemaType: SchemaTypeEnum;
  schemaStr: string;
};

declare type TrendBlueprintRow = TrendBlueprintObj;

// Schema Types
declare enum SchemaTypeEnum {
  Blueprint = 'blueprint',
  TREND_NODE = 'trend_node',
  TAG_NODE = 'tag_node',
  TREND_EDGE = 'trend_edge',
  TAG_EDGE = 'tag_edge',
  Unknown = 'unknown',
}

// Schema Names
declare enum SchemaNameEnum {
  SchemaBlueprint = 'SchemaBlueprint',
  TrendBlueprint = 'TrendBlueprint',
}
