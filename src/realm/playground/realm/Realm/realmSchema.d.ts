// Db Definition
declare type RealmPath = string;
declare type SchemaName = string;

// User Defined Table Definition
declare interface SchemaBlueprintObj {
  schemaName: string;
  realmPath: string;
  schemaType: SchemaTypeEnum;
  schemaDef: Realm.ObjectSchema;
}

// Table Definition saved to Realm Blueprint Table
declare type SchemaBlueprintRow = {
  schemaName: string;
  realmPath: string;
  schemaType: SchemaTypeEnum;
  schemaStr: string;
};

// Schema Types
declare enum SchemaTypeEnum {
  Blueprint = 'blueprint',
  Trend = 'trend',
  TrendTag = 'trend_tag',
  TrendRelationship = 'trend_rel',
  TrendTagRelationship = 'trend_tag_rel',
  Unknown = 'unknown',
}

// Schema Names
declare enum SchemaNameEnum {
  SchemaBlueprint = 'SchemaBlueprint',
}
