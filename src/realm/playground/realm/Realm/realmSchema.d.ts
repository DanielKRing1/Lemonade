// Db Definition
declare type RealmPath = string;

// Schema Definition for Realm
declare type SchemaDef = {
  name: string;
  primaryKey?: string;
  properties: import('realm').PropertiesTypes;
};

// User Defined Table Definition
declare type SchemaBlueprintObj = {
  schemaName: string;
  realmPath: string;
  schemaType: SchemaType;
  schemaDef: SchemaDef;
};

// Table Definition saved to Realm Blueprint Table
declare type SchemaBlueprintRow = {
  schemaName: string;
  realmPath: string;
  schemaType: SchemaType;
  schemaStr: string;
};

// Schema Types
declare enum SchemaType {
  Blueprint = 'blueprint',
  Trend = 'trend',
  Unknown = 'unknown',
}

// Schema Names
declare enum SchemaName {
  SchemaBlueprint = 'SchemaBlueprint',
}
