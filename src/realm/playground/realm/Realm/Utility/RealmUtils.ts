import {SchemaBlueprint} from '../SchemaBlueprint';

export abstract class RealmUtils {
  static getSchemas(realm: Realm): Array<SchemaBlueprint> {
    const realmPath: string = realm.path;

    return realm.schema.map((oldSchema: Realm.ObjectSchema) => {
      const schemaDef: SchemaDef = {name: oldSchema.name, primaryKey: oldSchema.primaryKey, properties: oldSchema.properties};

      return new SchemaBlueprint(oldSchema.name, realmPath, SchemaType.Unknown, schemaDef);
    });
  }

  static mergeSchemas(realm: Realm, newSchemas: Array<SchemaBlueprint>) {
    const allSchemas = RealmUtils.getSchemas(realm);
    allSchemas.push(...newSchemas);

    return allSchemas;
  }

  static filterSchemas(realm: Realm, schemaNameBlacklist: Array<string>) {
    const allSchemas = RealmUtils.getSchemas(realm);

    return allSchemas.filter((schema: SchemaBlueprint) => !schemaNameBlacklist.includes(schema.schemaName));
  }
}
