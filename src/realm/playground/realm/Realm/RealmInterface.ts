import {DEFAULT_PATH} from '../../../../constants';
import {Singleton} from '../Base';
import {RealmCache, SchemaCache, TrendCache} from './Caches';
import {RealmUtils} from './Utility';

import {SchemaBlueprint} from './Schema/SchemaBlueprint';
import {TrendBlueprint} from './Trends/TrendBlueprints';
import {TrendTracker} from './Trends';

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

  // PUBLIC API

  // TREND API

  public addTrend(trendName: string, trendProperties: string[], options?: Dict<string>): SchemaBlueprint[] | undefined {
    const realmPath = DEFAULT_PATH;

    // 1. Add to TrendCache
    this._trendCache.add(trendName, {realmPath, trendProperties});
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;

    // 2. Save TrendBlueprint to disk
    trendTracker.getTrendBlueprint().save(this._realmCache.getDefault());

    // 3. Get list of relevant SchemaBlueprints from TrendBlueprint
    const completeTrendSB: CompleteTrendSB = trendTracker.getTrendBlueprint().toSchemaBlueprints();
    const schemaBlueprints: SchemaBlueprint[] = Object.values(completeTrendSB);

    // 4. Add Schemas to SchemaCache, will reload Realm in RealmCache
    const addedSchemas: SchemaBlueprint[] | undefined = this._addSchemas(realmPath, schemaBlueprints, options);

    return addedSchemas;
  }
  public rmTrend(trendName: string, options?: Dict<string>): Array<SchemaBlueprint> | undefined {
    const defaultRealmPath = DEFAULT_PATH;

    // 1. Rm from TrendCache
    const trendBlueprint: TrendBlueprint | undefined = this._trendCache.rm(trendName) as TrendBlueprint | undefined;

    if (!!trendBlueprint) {
      // 2. Delete TrendBlueprint from disk
      trendBlueprint.delete(this._realmCache.getDefault());

      // 3. Get Schema names to remove from SchemaCache
      const completeTrendSB: CompleteTrendSB = trendBlueprint.toSchemaBlueprints();
      const schemaNamesToRm: string[] = Object.values(completeTrendSB).map((sb: SchemaBlueprint) => sb.schemaName);

      // 4. Rm from SchemaCache, will reload Realm in RealmCache
      const remainingSchemas: SchemaBlueprint[] | undefined = this._rmSchemas(defaultRealmPath, schemaNamesToRm, options);

      return remainingSchemas;
    }
  }

  // Trend entities
  public addExistingTrendEntities(trendName: string, trendEntitiesToAdd: string[]) {
    // 1. Get TrendTracker from TrendCache
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;

    // 2. Get Realm from RealmCache
    const realm: Realm = this._realmCache.get(trendTracker.getTrendBlueprint().getRealmPath()) as Realm;

    // 3. Save TrendBlueprint to disk
    trendTracker.getTrendBlueprint().addExistingTrendEntities(realm, trendEntitiesToAdd);
  }

  public rmExistingTrendEntities(trendName: string, trendEntitiesToRm: string[]) {
    // 1. Get TrendTracker from TrendCache
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;

    // 2. Get Realm from RealmCache
    const realm: Realm = this._realmCache.get(trendTracker.getTrendBlueprint().getRealmPath()) as Realm;

    // 3. Save TrendBlueprint to disk
    trendTracker.getTrendBlueprint().rmExistingTrendEntities(realm, trendEntitiesToRm);
  }

  // Trend entitiestags
  public addExistingTrendTags(trendName: string, trendTagsToAdd: string[]) {
    // 1. Get TrendTracker from TrendCache
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;

    // 2. Get Realm from RealmCache
    const realm: Realm = this._realmCache.get(trendTracker.getTrendBlueprint().getRealmPath()) as Realm;

    // 3. Save TrendBlueprint to disk
    trendTracker.getTrendBlueprint().addExistingTrendTags(realm, trendTagsToAdd);
  }

  public rmExistingTrendTags(trendName: string, trendTagsToRm: string[]) {
    // 1. Get TrendTracker from TrendCache
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;

    // 2. Get Realm from RealmCache
    const realm: Realm = this._realmCache.get(trendTracker.getTrendBlueprint().getRealmPath()) as Realm;

    // 3. Save TrendBlueprint to disk
    trendTracker.getTrendBlueprint().rmExistingTrendTags(realm, trendTagsToRm);
  }

  /**
   * Get list of available Trends in TrendCache
   */
  public getTrendNames(): string[] {
    return this._trendCache.getKeys();
  }

  /**
   * Get properties of a Trend in TrendCache
   *
   * @param trendName String, Trend with properties in TrendCache
   */
  public getTrendProperties(trendName: string): string[] | undefined {
    const trendTracker: TrendTracker | undefined = this._trendCache.get(trendName);

    if (!!trendTracker) return trendTracker.trendProperties;
  }

  // PRIVATE API

  // REALM API

  public loadRealms(): SchemaBlueprint[] {
    return this._realmCache.load();
  }

  private addRealm(realmPath: string, valueParams: {schemaBlueprints: Array<SchemaBlueprint>; options?: any}) {
    this._realmCache.add(realmPath, valueParams);
  }
  private rmRealm(realmPath: string, options?: any) {
    this._realmCache.rm(realmPath, options);
  }

  // SCHEMA API

  private _addSchemas(realmPath: string, schemaBlueprints: SchemaBlueprint[], options?: Dict<string>): SchemaBlueprint[] | undefined {
    // 1. Get Realm
    const realm = this._realmCache.get(realmPath);

    if (!!realm) {
      // 2. Save SchemaBlueprint to Realm
      // schemaBlueprints.forEach((schemaBlueprint: SchemaBlueprint) => schemaBlueprint.save(realm));

      // 3. Reload Realm with added SchemaBlueprints
      const allSchemas: Array<SchemaBlueprint> = RealmUtils.mergeSchemasFromRealm(realm, schemaBlueprints);
      // NOTE: Adding also reloads the Realm
      this.addRealm(realmPath, {
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

    // 2. Get SchemaBlueprints to remove
    const schemaBlueprints: SchemaBlueprint[] = schemaNames
      .map((schemaName: string) => this._schemaCache.get(schemaName))
      .filter((schemaBlueprint: SchemaBlueprint | undefined) => schemaBlueprint !== undefined) as SchemaBlueprint[];

    if (!!realm) {
      // 3. Remove SchemaBlueprints from Realm
      // schemaBlueprints.forEach((schemaBlueprint: SchemaBlueprint) => schemaBlueprint.delete(realm));

      // 4. Reload Realm without Schemas
      const schemaNamesToRm: string[] = schemaBlueprints.map((sb) => sb.schemaName);
      const remainingSchemas: Array<SchemaBlueprint> = RealmUtils.filterSchemasfromRealm(realm, schemaNamesToRm);
      // NOTE: Adding also reloads the Realm
      this.addRealm(realmPath, {
        schemaBlueprints: remainingSchemas,
        options,
      });

      // 5. Remove from SchemaCache
      schemaBlueprints.forEach((schemaBlueprint) => this._schemaCache.rm(schemaBlueprint.schemaName));

      return remainingSchemas;
    }
  }

  //   TODO
  // 6. Define DayPart Schema: Timestamp, entities, rating, mood
  // 7. Define Day Schema: Timestamp, List reference to DayParts
}
