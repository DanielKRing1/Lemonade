declare enum SchemaType {
  Blueprint = 'Blueprint',
  Trend = 'Trend',
}

declare type RealmSchemaObject = {
  name: string;
  primaryKey?: string;
  properties: Record<string, any>;
};

// From database 'Blueprint' Table
type SchemaBlueprintRow = {
  schemaName: string;
  schemaType: SchemaType;
  realmPath: string;
  schemaStr: string;
};

// declare type RealmSchema = {
//   name: string;
//   primaryKey?: string;
//   properties: Record<string, any>;
// };

// declare type TrendSchema = RealmSchema;

// declare type TrendBlueprint = {
//   schemaName: string;
//   realmPath: string;
//   trendSchema: string;
// };
