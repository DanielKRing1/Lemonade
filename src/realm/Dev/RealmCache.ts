import Realm from 'realm';

import {DEFAULT_PATH} from '../../constants/Realm';
import RealmSchemaName from '../schemaNames';
import {RealmSchema, TrendSchema} from './RealmSchema';

import SchemaCache from './SchemaCache';
import TrendCache from './TrendCache';

type RealmPath = string;
type RealmOptions = Record<string, any>;
type TrendSchemaMap = Record<RealmPath, Array<TrendSchema>>;

/**
 *
 * All methods are static
 *
 * This class should be used to fetch and cache realm connections
 * It also has convenience a method to fetch the Default Realm
 *
 * This class adds openned Realms to TrendCache
 *
 */

class RealmCache {
  static cache: Record<string, Realm> = {};
  // static trendSchemaMap: TrendSchemaMap = {};

  static init() {
    RealmCache._loadSchemaBlueprints();
    RealmCache._openAllRealms();
  }

  static _openRealm(realmPath: string, realmSchemas: Array<RealmSchema>, options: RealmOptions) {
    const newRealm = new Realm({
      path: realmPath,
      schema: realmSchemas.map((schema: RealmSchema) => schema.toSchemaObject()),
      deleteRealmIfMigrationNeeded: true,
      ...options,
    });

    return newRealm;
  }

  /**
   * Simply add realm to cache
   *
   * @param realmPath Realm path
   * @param realmSchemas Schema[] expected to be used (and therefore loaded) with Realm
   * @param options Options object for opening Realm
   */
  static add(realmPath: string, realmSchemas: Array<RealmSchema>, options: RealmOptions = {}) {
    const realmInstance = RealmCache._openRealm(realmPath, realmSchemas, options);
    RealmCache.cache[realmPath] = realmInstance;

    return realmInstance;
  }

  /**
   * Simply get Realm from cache, if exists
   */
  static get(realmPath: string) {
    let realmInstance = RealmCache.cache[realmPath];

    return realmInstance;
  }

  /**
   * Get Default Realm
   * Opens Default Realm and caches it if not already in cache
   */
  static getDefaultRealm() {
    let realmInstance = RealmCache.get(DEFAULT_PATH);
    if (!realmInstance) realmInstance = RealmCache.add(DEFAULT_PATH, [RealmSchema.getBlueprintSchema()], {});

    return realmInstance;
  }

  /**
   * Load all Blueprints defined in Default Realm
   *
   * Load the TrendBlueprints stored in the Default Realm
   * Then parse each TrendBlueprint's 'trendSchema' string into a usable TrendSchema object
   *
   * Save to RealmCache.trendSchemaMap as { realmPath: TrendSchema[] }
   */
  static _loadSchemaBlueprints() {
    // Load
    const defaultRealm = RealmCache.getDefaultRealm();
    const schemaBlueprints: Realm.Results<SchemaBlueprintRow> = defaultRealm.objects(RealmSchemaName.SchemaBlueprint);

    // Add to SchemaCache
    schemaBlueprints.forEach((schemaBlueprint: SchemaBlueprintRow) => {
      // Deserialize
      const realmSchema = RealmSchema.fromSchemaStr(schemaBlueprint);

      SchemaCache.add(realmSchema);

      // Add 'Trend' type RealmSchemas to TrendCache
      if (realmSchema.schemaType === SchemaType.Trend) TrendCache.add(realmSchema.realmPath, realmSchema.name);
    });
  }

  /**
   * Call after loading blueprints with RealmCache._loadSchemaBlueprints()
   *
   * Iterates RealmCache.trendSchemaMap to open a Realm at each realmPath, with the mapped TrendSchema[]
   *
   * @param options Use to override default 'new Realm' options
   */
  static _openAllRealms(options: RealmOptions = {}) {
    for (let realmPath in SchemaCache.cache) {
      RealmCache._loadRealm(realmPath, options);
    }
  }

  /**
   * Call after loading blueprints with RealmCache._loadSchemaBlueprints()
   *
   * Fetches TrendSchema[] from RealmCache.trendSchemaMap, using the 'realmPath' key
   * And opens a Realm at the specified 'realmPath', with the fetched TrendSchema[]
   *
   * Also tells TrendCache to add a TrendTracker for any TrendSchemas loaded into the Realm
   *
   * @param realmPath The RealmCache.trendSchemaMap key from which to fetch a TrendSchema[]
   * @param options Use to override default 'new Realm' options
   */
  static _loadRealm(realmPath: string, options: RealmOptions) {
    const realmSchemas = SchemaCache.getByRealm(realmPath);

    // Add Realm to RealmCache
    const realmInstance = RealmCache.add(realmPath, realmSchemas, options);
  }
}
// Init
RealmCache.init();

export default RealmCache;
