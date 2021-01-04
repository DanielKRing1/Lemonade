import Realm from 'realm';

import RealmSchemaName from '../schemaNames';
import {TrendBlueprint} from './Schemas';
import {DEFAULT_PATH} from '../../constants/Realm';

export type TrendSchemaMap = Record<string, Array<TrendSchema>>;
type RealmOptions = Record<string, any>;

/**
 *
 * All methods are static
 *
 * This class should be used to fetch and cache realm connections
 *
 * It also has convenience a method to fetch the Default Realm
 *
 */

class RealmCache {
  static realmMap: Record<string, Realm> = {};
  static trendSchemaMap: TrendSchemaMap = {};

  static init() {
    RealmCache._loadBlueprints();
    RealmCache._loadRealms();
  }

  static _openRealm(realmPath: string, schemas: Array<TrendSchema>, options: RealmOptions) {
    const newRealm = new Realm({
      path: realmPath,
      schema: schemas,
      deleteRealmIfMigrationNeeded: true,
      ...options,
    });

    return newRealm;
  }

  static add(realmPath: string, schemas: Array<TrendSchema>, options: RealmOptions = {}) {
    const realmInstance = RealmCache._openRealm(realmPath, schemas, options);
    RealmCache.realmMap[realmPath] = realmInstance;

    return realmInstance;
  }

  /**
   * Call with 'schemas' and 'options' if expecting to open Realm for the first time
   * Else, simply provide realmPath to fetch from cache
   *
   * @param realmPath Realm id to open
   * @param options Options with which Realm will be opened
   * @param schemas Array of TrendSchemas to be loaded into Realm
   * @param update If true, opens Realm and replaces existing realm in cache
   */
  static get(realmPath: string, schemas: Array<TrendSchema> = [], options: RealmOptions = {}, update: boolean = false) {
    // Get or Create + cache
    let realmInstance = RealmCache.realmMap[realmPath];
    if (!realmInstance || update) realmInstance = RealmCache.add(realmPath, schemas, options);

    return realmInstance;
  }

  static getDefaultRealm() {
    return RealmCache.get(DEFAULT_PATH, [TrendBlueprint], {});
  }

  /**
   * Load the TrendBlueprints stored in the default Schema
   * Then parse each TrendBlueprint's 'trendSchema' string into a usable TrendSchema object
   */
  static _loadBlueprints() {
    // Load
    const defaultRealm = RealmCache.getDefaultRealm();
    const blueprints: Realm.Results<TrendBlueprint> = defaultRealm.objects(RealmSchemaName.TrendBlueprint);

    // Map to realmPath keys
    RealmCache.trendSchemaMap = blueprints.reduce((map: TrendSchemaMap, bp: TrendBlueprint) => {
      // Deserialize
      const trendSchema: TrendSchema = JSON.parse(bp.trendSchema);

      if (!map[bp.realmPath]) map[bp.realmPath] = [];
      map[bp.realmPath].push(trendSchema);

      return map;
    }, {});
  }

  /**
   * Call after loading blueprints (_loadBlueprints())
   * Uses trendSchemaMap to open a Realm at each realmPath, with the mapped TrendSchema[]
   *
   * @param options Use to override default 'new Realm' options
   */
  static _loadRealms(options: RealmOptions = {}) {
    for (let realmPath in RealmCache.trendSchemaMap) {
      RealmCache._loadRealm(realmPath, options);
    }
  }

  static _loadRealm(realmPath: string, options: RealmOptions) {
    const trendSchemas = RealmCache.trendSchemaMap[realmPath];
    RealmCache.add(realmPath, trendSchemas, options);
  }
}
// Init
RealmCache.init();

export default RealmCache;
