import {RealmSchema} from './RealmSchema';

type SchemaName = string;
type SchemaMap = Record<SchemaName, RealmSchema>;

type SchemaType = string;
type SchemaTypeMap = Record<SchemaType, SchemaMap>;

type RealmPath = string;
type RealmSchemaMap = Record<RealmPath, SchemaTypeMap>;

// {
//     realmPath: {
//         schemaType: {
//             schemaName: RealmSchema
//         }
//     }
// }

class SchemaCache {
  static map: RealmSchemaMap = {};

  static addSchema(realmSchema: RealmSchema) {
    const {realmPath, schemaType, name} = realmSchema;

    SchemaCache.initSchemaType(realmPath, schemaType);
    SchemaCache.map[realmPath][schemaType][name] = realmSchema;
  }

  static initSchemaType(realmPath: string, schemaType: string) {
    if (!SchemaCache.hasSchemaType(realmPath, schemaType)) {
      SchemaCache.initRealmPath(realmPath);
      SchemaCache.map[realmPath][schemaType] = {};
    }
  }

  static initRealmPath(realmPath: string) {
    if (!SchemaCache.hasRealmPath(realmPath)) SchemaCache.map[realmPath] = {};
  }

  static hasSchemaName(realmPath: string, schemaType: string, schemaName: string) {
    return SchemaCache.hasSchemaType(realmPath, schemaType) && SchemaCache.map[realmPath][schemaType].hasOwnProperty(schemaName);
  }

  static hasSchemaType(realmPath: string, schemaType: string) {
    return SchemaCache.hasRealmPath(realmPath) && SchemaCache.map[realmPath].hasOwnProperty(schemaType);
  }

  static hasRealmPath(realmPath: string) {
    return SchemaCache.map.hasOwnProperty(realmPath);
  }
}

export default SchemaCache;
