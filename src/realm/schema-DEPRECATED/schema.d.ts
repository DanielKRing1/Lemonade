// ENUMS
// declare enum SchemaTypeEnum {
//   Blueprint = 'Blueprint',
//   Trend = 'Trend',
// }

// DATA STORE MAPS
// {
//     realmPath: {
//         schemaType: {
//             schemaName: RealmSchema
//         }
//     }
// }
declare type RealmSchemaTypeEnumMap = Record<RealmPath, SchemaTypeEnumMap>;

declare type SchemaTypeEnumMap = Record<SchemaTypeEnum, SchemaMap>;

// declare type SchemaName = string;
declare type SchemaMap = Record<SchemaName, RealmSchemaObject>;
// declare type SchemaMap = Record<SchemaName, import('../Dev/RealmSchema/RealmSchema').RealmSchema>;

// REALM DATA

// From database 'Blueprint' Table
declare type SchemaBlueprintRowObj = {
  schemaName: string;
  schemaType: SchemaTypeEnum;
  realmPath: string;
  schemaStr: string;
};

// 'schemaStr' parsed
declare type RealmSchemaObject = GenericRealmSchemaObject<Record<string, any>>;
declare type RealmSchemaBlueprintObject = GenericRealmSchemaObject<SchemaBlueprintRowObj>;

declare type GenericRealmSchemaObject<T> = {
  name: string;
  primaryKey?: string;
  properties: T;
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
