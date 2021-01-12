import {RealmSchema} from './RealmSchema';

// {
//     realmPath: {
//         schemaType: {
//             schemaName: RealmSchema
//         }
//     }
// }

class SchemaCache {
  //   static cache: RealmSchemaTypeMap = {};
  static cache: any = {};

  static add(realmSchema: RealmSchema) {
    const {realmPath, schemaType, name} = realmSchema;

    SchemaCache.initSchemaType(realmPath, schemaType);
    SchemaCache.cache[realmPath][schemaType]![name] = realmSchema;
  }

  static getByPath(realmPath: string | undefined, schemaType: SchemaType | undefined, schemaName: string | undefined) {
    if (realmPath && !schemaType && !schemaName) return SchemaCache._getByRealmPath(realmPath);
    else if (realmPath && schemaType && !schemaName) return SchemaCache._getBySchemaTypePath(realmPath, schemaType);
    else if (realmPath && schemaType && schemaName) return SchemaCache._getBySchemaNamePath(realmPath, schemaType, schemaName);
  }

  static getByRealm(realmPath: RealmPath) {
    return SchemaCache._getByRealmPath(realmPath);
  }

  static getBySchemaType(schemaType: SchemaType) {
    const schemas = [];

    for (let realmPath in SchemaCache.cache) {
      const schemaTypeSchemas = SchemaCache._getBySchemaTypePath(realmPath, schemaType);

      schemas.push(...schemaTypeSchemas);
    }

    return schemas;
  }

  static getBySchemaName(schemaName: SchemaName) {
    for (let realmPath in SchemaCache.cache) {
      for (let schemaType in SchemaCache.cache[realmPath]) {
        for (let name in SchemaCache.cache[realmPath][schemaType as SchemaType]) {
          if (name === schemaName) return SchemaCache.cache[realmPath][schemaType as SchemaType][schemaName];
        }
      }
    }
  }

  /**
   * Get all loaded RealmSchemas within a specified Realm
   * ie Get all RealmSchemas indexed by 'realmPath'
   *
   * @param realmPath The Realm for which to fetch all associated Schemas
   */
  static _getByRealmPath(realmPath: string) {
    const schemas = [];

    if (SchemaCache.hasRealmPath(realmPath)) {
      const schemaTypeMap: SchemaTypeMap = SchemaCache.cache[realmPath];

      for (let schemaType in schemaTypeMap) {
        const schemaTypeSchemas = SchemaCache._getBySchemaTypePath(realmPath, schemaType as SchemaType);
        schemas.push(...schemaTypeSchemas);
      }

      //   return Object.values(schemaTypeMap).reduce((allSchemas: Array<RealmSchema>, schemaMap: SchemaMap) => {
      //     const schemaTypeSchemas = Object.values(schemaMap);
      //     allSchemas.push(...schemaTypeSchemas);

      //     return allSchemas;
      //   }, []);
    }

    return schemas;
  }

  /**
   * Get all loaded RealmSchemas of type 'schemaType' within a specified Realm
   * ie Get all RealmSchemas indexed by 'realmPath'.'schemaType'
   *
   * @param realmPath The Realm from which to fetch associated Schemas
   * @param schemaType The type of Schema to fetch for the associated Realm
   */
  static _getBySchemaTypePath(realmPath: string, schemaType: SchemaType) {
    if (SchemaCache.hasSchemaType(realmPath, schemaType)) {
      const schemaMap: SchemaMap = SchemaCache.cache[realmPath][schemaType]!;

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
  static _getBySchemaNamePath(realmPath: string, schemaType: SchemaType, schemaName: string) {
    if (SchemaCache.hasSchemaName(realmPath, schemaType, schemaName)) return SchemaCache.cache[realmPath][schemaType]![schemaName];
  }

  //   UTILS METHODS

  static initSchemaType(realmPath: string, schemaType: SchemaType) {
    if (!SchemaCache.hasSchemaType(realmPath, schemaType)) {
      SchemaCache.initRealmPath(realmPath);
      SchemaCache.cache[realmPath][schemaType] = {};
    }
  }

  static initRealmPath(realmPath: string) {
    if (!SchemaCache.hasRealmPath(realmPath))
      SchemaCache.cache[realmPath] = {
        [SchemaType.Blueprint]: {},
        [SchemaType.Trend]: {},
      };
  }

  static hasSchemaName(realmPath: string, schemaType: SchemaType, schemaName: string) {
    return SchemaCache.hasSchemaType(realmPath, schemaType) && SchemaCache.cache[realmPath][schemaType]!.hasOwnProperty(schemaName);
  }

  static hasSchemaType(realmPath: string, schemaType: SchemaType) {
    return SchemaCache.hasRealmPath(realmPath) && SchemaCache.cache[realmPath].hasOwnProperty(schemaType);
  }

  static hasRealmPath(realmPath: string) {
    return SchemaCache.cache.hasOwnProperty(realmPath);
  }
}

export default SchemaCache;
