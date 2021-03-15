// Db Definition
declare type RealmPath = string;

// Schema Definition for Realm
type schema_property_Primitive = 'bool' | 'int' | 'float' | 'double' | 'string' | 'data' | 'date';
type schema_property_Object = {
  type: string;
  default?: any;
};
type schema_property = schema_property_Primitive | schema_property_Object;
declare type SchemaDef = {
  name: string;
  primaryKey?: string;
  properties: Record<string, schema_property>;
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
