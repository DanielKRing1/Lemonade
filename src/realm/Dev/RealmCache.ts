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
  static realmMap: Record<string, Realm> = {};
  // static trendSchemaMap: TrendSchemaMap = {};

  static init() {
    RealmCache._loadSchemaBlueprints();
    RealmCache._loadAllRealms();
  }

  static _openRealm(realmPath: string, schemas: Array<RealmSchema>, options: RealmOptions) {
    const newRealm = new Realm({
      path: realmPath,
      schema: schemas.map((schema: RealmSchema) => schema.getSchemaObject()),
      deleteRealmIfMigrationNeeded: true,
      ...options,
    });

    return newRealm;
  }

  /**
   * Simply add realm to cache
   *
   * @param realmPath Realm path
   * @param schemas Schema[] expected to be used (and therefore loaded) with Realm
   * @param options Options object for opening Realm
   */
  static add(realmPath: string, schemas: Array<RealmSchema>, options: RealmOptions = {}) {
    const realmInstance = RealmCache._openRealm(realmPath, schemas, options);
    RealmCache.realmMap[realmPath] = realmInstance;

    return realmInstance;
  }

  /**
   * Simply get Realm from cache, if exists
   */
  static get(realmPath: string) {
    let realmInstance = RealmCache.realmMap[realmPath];

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
      const schema = RealmSchema.fromSchemaStr(schemaBlueprint);

      SchemaCache.add(schema);
    });
  }

  /**
   * Call after loading blueprints with RealmCache._loadSchemaBlueprints()
   *
   * Iterates RealmCache.trendSchemaMap to open a Realm at each realmPath, with the mapped TrendSchema[]
   *
   * @param options Use to override default 'new Realm' options
   */
  static _loadAllRealms(options: RealmOptions = {}) {
    for (let realmPath in RealmCache.trendSchemaMap) {
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
    // Merge all Table Schemas related to Realm
    const trendSchemas: TrendSchema[] = SchemaCache.trendSchemaMap[realmPath];
    const allSchemas = [...trendSchemas];

    // Add Realm to RealmCache
    const realmInstance = RealmCache.add(realmPath, allSchemas, options);

    // Add TrendSchema[] to TrendCache
    trendSchemas.forEach((trendSchema: TrendSchema) => {
      TrendCache.add(trendSchema.name, realmInstance);
    });
  }
}
// Init
RealmCache.init();

export default RealmCache;
