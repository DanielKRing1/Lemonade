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

  static add(realmSchema: RealmSchema) {
    const {realmPath, schemaType, name} = realmSchema;

    SchemaCache.initSchemaType(realmPath, schemaType);
    SchemaCache.map[realmPath][schemaType][name] = realmSchema;
  }

  /**
   * Get all loaded RealmSchemas within a specified Realm
   * ie Get all RealmSchemas indexed by 'realmPath'
   *
   * @param realmPath The Realm for which to fetch all associated Schemas
   */
  static getByRealm(realmPath: string) {
    if (SchemaCache.hasRealmPath(realmPath)) {
      const schemaTypeMap: SchemaTypeMap = SchemaCache.map[realmPath];

      return Object.values(schemaTypeMap).reduce((allSchemas: Array<RealmSchema>, schemaMap: SchemaMap) => {
        const schemaTypeSchemas = Object.values(schemaMap);
        allSchemas.push(...schemaTypeSchemas);

        return allSchemas;
      }, []);
    }

    return [];
  }

  /**
   * Get all loaded RealmSchemas of type 'schemaType' within a specified Realm
   * ie Get all RealmSchemas indexed by 'realmPath'.'schemaType'
   *
   * @param realmPath The Realm from which to fetch associated Schemas
   * @param schemaType The type of Schema to fetch for the associated Realm
   */
  static getBySchemaType(realmPath: string, schemaType: string) {
    if (SchemaCache.hasSchemaType(realmPath, schemaType)) {
      const schemaMap: SchemaMap = SchemaCache.map[realmPath][schemaType];

      return Object.values(schemaMap);
    }

    return [];
  }

  /**
   * Get the RealmSchema indexed by 'realmPath'.'schemaType'.'schemaName'
   *
   * @param realmPath
   * @param schemaType
   * @param schemaName
   */
  static getBySchemaName(realmPath: string, schemaType: string, schemaName: string) {
    if (SchemaCache.hasSchemaName(realmPath, schemaType, schemaName)) return SchemaCache.map[realmPath][schemaType][schemaName];
  }

  //   UTILS METHODS

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
