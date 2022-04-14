import {MetaDataBlueprint} from '../Schema/MetaDataBlueprint';

export abstract class RealmUtils {
  static getSchemasFromRealm(realm: Realm): MetaDataBlueprint[] {
    const realmPath: string = realm.path;

    return realm.schema.map((oldSchema: Realm.ObjectSchema) => {
      const schemaDef: Realm.ObjectSchema = {name: oldSchema.name, primaryKey: oldSchema.primaryKey, properties: oldSchema.properties};

      return new MetaDataBlueprint(oldSchema.name, realmPath, SchemaTypeEnum.Unknown, schemaDef);
    });
  }

  static mergeSchemasFromRealm(realm: Realm, newSchemas: MetaDataBlueprint[]): MetaDataBlueprint[] {
    const allSchemas = RealmUtils.getSchemasFromRealm(realm);
    allSchemas.push(...newSchemas);

    return allSchemas;
  }

  static filterSchemasfromRealm(realm: Realm, schemaNameBlacklist: string[]): MetaDataBlueprint[] {
    const allSchemas = RealmUtils.getSchemasFromRealm(realm);

    return allSchemas.filter((schema: MetaDataBlueprint) => !schemaNameBlacklist.includes(schema.schemaName));
  }
}
