import {DEFAULT_PATH} from '../../../../constants';
import {Singleton} from '../Base';
import {RealmCache, SchemaCache, TrendCache} from './Caches';
import {RealmUtils} from './Utility';

import {SchemaBlueprint} from './Schema/SchemaBlueprint';

export class RealmInterface extends Singleton(Object) {
  private _realmCache: RealmCache;
  private _schemaCache: SchemaCache;

  constructor() {
    super();

    this._realmCache = new RealmCache();
    this._schemaCache = new SchemaCache();

    return this.getSingleton() as RealmInterface;
  }

  public loadRealms(): SchemaBlueprint[] {
    return this._realmCache.load();
  }

  public addRealm(realmPath: string, valueParams: {schemaBlueprints: Array<SchemaBlueprint>; options?: any}) {
    this._realmCache.add(realmPath, valueParams);
  }
  public rmRealm(realmPath: string, options?: any) {
    this._realmCache.rm(realmPath, options);
  }

  public addTrend(trendName: string, schemaDef: Realm.ObjectSchema, options?: Dict<string>): SchemaBlueprint | undefined {
    const realmPath = DEFAULT_PATH;
    const schemaType = SchemaTypeEnum.Trend;

    const addedSchema: SchemaBlueprint | undefined = this._addSchema(realmPath, trendName, schemaType, schemaDef, options);

    return addedSchema;
  }
  public rmTrend(trendName: string, options?: Dict<string>): Array<SchemaBlueprint> | undefined {
    const defaultRealmPath = DEFAULT_PATH;

    const remainingSchemas: Array<SchemaBlueprint> | undefined = this._rmSchema(defaultRealmPath, trendName, options);

    return remainingSchemas;
  }

  private _addSchema(realmPath: string, schemaName: string, schemaType: SchemaTypeEnum, schemaDef: Realm.ObjectSchema, options?: Dict<string>): SchemaBlueprint | undefined {
    const realm = this._realmCache.get(realmPath);

    if (!!realm) {
      const newSchemaBlueprint: SchemaBlueprint = SchemaBlueprint.save(realm, schemaName, realmPath, schemaType, schemaDef);
      const allSchemas: Array<SchemaBlueprint> = RealmUtils.mergeSchemasFromRealm(realm, [newSchemaBlueprint]);

      this._realmCache.add(realmPath, {
        schemaBlueprints: allSchemas,
        options,
      });

      this._schemaCache.add(schemaName, {schemaBlueprint: newSchemaBlueprint});

      return newSchemaBlueprint;
    }
  }

  private _rmSchema(realmPath: string, schemaName: string, options?: Dict<string>): Array<SchemaBlueprint> | undefined {
    const realm = this._realmCache.get(realmPath);

    if (!!realm) {
      const remainingSchemas: Array<SchemaBlueprint> = RealmUtils.filterSchemasfromRealm(realm, [schemaName]);

      this._realmCache.add(realmPath, {
        schemaBlueprints: remainingSchemas,
        options,
      });

      this._schemaCache.rm(schemaName);

      return remainingSchemas;
    }
  }

  // Main TODOS
  // 1. Save SchemaBlueprints in a Singleton SchemaCache
  // 2. Fetch and Pass appropriate SchemaBlueprints to rate method

  //   TODO
  // 1. Design Base Trend Schema + TrendTags Schema: Think about all properties needed
  // 2. Design RealmInterface.rate method: Accepts list of entity names, 'mood' , single rating for the set of entities, weights for each entity (defaults to 1/# entities) + Call rate on all of a Schema's defined Querent types
  // 3. Design Querent.rate method
  // 4. Define Querent types: Enum dense, sequential, sequential_dense
  // 5. Define variable Trend attributes (hasTags - Create Seperate Graph for tags, Enum relationshipTypes - dense, sequential, sequential_dense, ...)
  // 6. Define DayPart Schema: Timestamp, entities, rating, mood
  // 7. Define Day Schema: Timestamp, List reference to DayParts
}
