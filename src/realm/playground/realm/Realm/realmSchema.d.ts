// Db Definition
declare type RealmPath = string;

// User Defined Table Definition
declare interface SchemaBlueprintObj {
  schemaName: string;
  realmPath: string;
  schemaType: SchemaType;
  schemaDef: Realm.ObjectSchema;
}

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
