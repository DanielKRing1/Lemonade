import {RealmSchema} from './RealmSchema';

// {
//     realmPath: {
//         schemaType: {
//             schemaName: RealmSchema
//         }
//     }
// }

class SchemaCache {
  static cache: RealmSchemaTypeMap = {};

  static add(realmSchema: RealmSchema) {
    const {realmPath, schemaType, name} = realmSchema;

    SchemaCache.initSchemaType(realmPath, schemaType);
    SchemaCache.cache[realmPath][schemaType][name] = realmSchema;
  }

  /**
   * Get all loaded RealmSchemas within a specified Realm
   * ie Get all RealmSchemas indexed by 'realmPath'
   *
   * @param realmPath The Realm for which to fetch all associated Schemas
   */
  static getByRealm(realmPath: string) {
    if (SchemaCache.hasRealmPath(realmPath)) {
      const schemaTypeMap: SchemaTypeMap = SchemaCache.cache[realmPath];

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
      const schemaMap: SchemaMap = SchemaCache.cache[realmPath][schemaType];

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
    if (SchemaCache.hasSchemaName(realmPath, schemaType, schemaName)) return SchemaCache.cache[realmPath][schemaType][schemaName];
  }

  //   UTILS METHODS

  static initSchemaType(realmPath: string, schemaType: string) {
    if (!SchemaCache.hasSchemaType(realmPath, schemaType)) {
      SchemaCache.initRealmPath(realmPath);
      SchemaCache.cache[realmPath][schemaType] = {};
    }
  }

  static initRealmPath(realmPath: string) {
    if (!SchemaCache.hasRealmPath(realmPath)) SchemaCache.cache[realmPath] = {};
  }

  static hasSchemaName(realmPath: string, schemaType: string, schemaName: string) {
    return SchemaCache.hasSchemaType(realmPath, schemaType) && SchemaCache.cache[realmPath][schemaType].hasOwnProperty(schemaName);
  }

  static hasSchemaType(realmPath: string, schemaType: string) {
    return SchemaCache.hasRealmPath(realmPath) && SchemaCache.cache[realmPath].hasOwnProperty(schemaType);
  }

  static hasRealmPath(realmPath: string) {
    return SchemaCache.cache.hasOwnProperty(realmPath);
  }
}

export default SchemaCache;
