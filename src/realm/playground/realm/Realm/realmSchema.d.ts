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
  TREND = 'trend',
  TAG = 'tag',
  TREND_RELS = 'trend_rels',
  TAG_RELS = 'tag_rels',
  Unknown = 'unknown',
}

// Schema Names
declare enum SchemaNameEnum {
  SchemaBlueprint = 'SchemaBlueprint',
}
