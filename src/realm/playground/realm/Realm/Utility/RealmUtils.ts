import {SchemaBlueprint} from '../Schema/SchemaBlueprint';

export abstract class RealmUtils {
  static getSchemasFromRealm(realm: Realm): Array<SchemaBlueprint> {
    const realmPath: string = realm.path;

    return realm.schema.map((oldSchema: Realm.ObjectSchema) => {
      const schemaDef: Realm.ObjectSchema = {name: oldSchema.name, primaryKey: oldSchema.primaryKey, properties: oldSchema.properties};

      return new SchemaBlueprint(oldSchema.name, realmPath, SchemaType.Unknown, schemaDef);
    });
  }

  static mergeSchemasFromRealm(realm: Realm, newSchemas: Array<SchemaBlueprint>) {
    const allSchemas = RealmUtils.getSchemasFromRealm(realm);
    allSchemas.push(...newSchemas);

    return allSchemas;
  }

  static filterSchemasfromRealm(realm: Realm, schemaNameBlacklist: Array<string>) {
    const allSchemas = RealmUtils.getSchemasFromRealm(realm);

    return allSchemas.filter((schema: SchemaBlueprint) => !schemaNameBlacklist.includes(schema.schemaName));
  }
}
