import {DEFAULT_PATH} from '../../../../constants';
import {Singleton} from '../Base';
import {RealmCache, SchemaCache, TrendCache} from './Caches';
import {RealmUtils} from './Utility';

import {SchemaBlueprint} from './Schema/SchemaBlueprint';

export class RealmInterface extends Singleton(Object) {
  private _realmCache: RealmCache;
  private _schemaCache: SchemaCache;
  private _trendCache: TrendCache;

  constructor() {
    super();

    this._realmCache = new RealmCache();
    this._schemaCache = new SchemaCache();
    this._trendCache = new TrendCache();

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

  public addTrend(trendName: string, attributeNames: string[], relTypes: RelationshipTypeEnum[] = Object.values(RelationshipTypeEnum), options?: Dict<string>): SchemaBlueprint[] | undefined {
    const realmPath = DEFAULT_PATH;
    const schemaType = SchemaTypeEnum.Trend;

    // Add to TrendCache
    const schemaBlueprints: SchemaBlueprint[] = this._trendCache.add(trendName, {realmPath, attributeNames, relTypes});

    const addedSchemas: SchemaBlueprint[] | undefined = this._addSchemas(realmPath, schemaBlueprints);

    return addedSchemas;
  }
  public rmTrend(trendName: string, options?: Dict<string>): Array<SchemaBlueprint> | undefined {
    const defaultRealmPath = DEFAULT_PATH;

    this._trendCache.rm(trendName);
    const remainingSchemas: SchemaBlueprint[] | undefined = this._rmSchemas(defaultRealmPath, [trendName], options);

    return remainingSchemas;
  }

  private _addSchemas(realmPath: string, schemaBlueprints: SchemaBlueprint[], options?: Dict<string>): SchemaBlueprint[] | undefined {
    // 1. Get Realm
    const realm = this._realmCache.get(realmPath);

    if (!!realm) {
      // 2. Save to Realm
      this._realmCache.save(realm, schemaBlueprints);

      // 3. Reload Realm
      const allSchemas: Array<SchemaBlueprint> = RealmUtils.mergeSchemasFromRealm(realm, schemaBlueprints);
      // NOTE: Adding also reloads the Realm
      this._realmCache.add(realmPath, {
        schemaBlueprints: allSchemas,
        options,
      });

      // 4. Add to SchemaCache
      schemaBlueprints.forEach((schemaBlueprint) => this._schemaCache.add(schemaBlueprint.schemaName, {schemaBlueprint}));

      return schemaBlueprints;
    }
  }

  private _rmSchemas(realmPath: string, schemaNames: string[], options?: Dict<string>): SchemaBlueprint[] | undefined {
    // 1. Get Realm
    const realm: Realm | undefined = this._realmCache.get(realmPath);

    // 2. Get SchemaBlueprints
    const schemaBlueprints: SchemaBlueprint[] = schemaNames
      .map((schemaName: string) => this._schemaCache.get(schemaName))
      .filter((schemaBlueprint: SchemaBlueprint | undefined) => schemaBlueprints !== undefined) as SchemaBlueprint[];

    if (!!realm) {
      // 3. Remove from Realm
      this._realmCache.delete(realm, schemaBlueprints);

      // 4. Reload Realm
      const schemaNamesToRm: string[] = schemaBlueprints.map((sb) => sb.schemaName);
      const remainingSchemas: Array<SchemaBlueprint> = RealmUtils.filterSchemasfromRealm(realm, schemaNamesToRm);
      // NOTE: Adding also reloads the Realm
      this._realmCache.add(realmPath, {
        schemaBlueprints: remainingSchemas,
        options,
      });

      // 5. Remove from SchemaCache
      schemaBlueprints.forEach((schemaBlueprint) => this._schemaCache.rm(schemaBlueprint.schemaName));

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
