import {Cache, Loadable, Loader, LoadParams, Singleton, Override, Implement} from '../../Base';
import {SchemaBlueprint} from '../Schema/SchemaBlueprint';

import {TrendCache} from './TrendCache';

import {DEFAULT_PATH} from '../../../../../constants';
import {TrendBlueprint} from '../Trends/TrendBlueprints';

/**
 * A SINGLETON CACHE that caches all open Realm connections
 *
 * It is also LOADABLE, meaning it can load() predefined Realm connections (defined the default Realm)
 */
export class RealmCache extends Singleton(Cache)<Realm> implements Loadable {
  _loader: SchemaLoader;

  constructor() {
    super();

    this._loader = new SchemaLoader();

    return this.getSingleton() as RealmCache;
  }

  // CACHE

  /**
   * Get Default Realm
   * Opens Default Realm and caches it if not already in cache
   */
  public getDefault(): Realm {
    if (!this.has(DEFAULT_PATH))
      // Init Default Realm
      this.add(DEFAULT_PATH, {
        schemaBlueprints: [TrendBlueprint.SCHEMA_BLUEPRINT],
        options: {},
      });

    return this.get(DEFAULT_PATH) as Realm;
  }

  /**
   * Call this method for:
   * - a new realmPath to open the realm with these schems
   * OR
   * - an existing realmPath, with new SchemaBlueprints to 'reload' the realm with these schemas
   *
   * @param realmPath
   * @param valueParams
   */
  @Override('Cache')
  public add(realmPath: string, valueParams: {schemaBlueprints: Array<SchemaBlueprint>; options?: any}): void {
    const {schemaBlueprints, options} = valueParams;
    const newRealm = this._open(realmPath, schemaBlueprints, options);

    // Close existing realm (if exists)
    this._close(realmPath);
    this._map[realmPath] = newRealm;
  }

  @Override('Cache')
  public rm(realmPath: string, options?: any): Realm | undefined | void {
    const realm: Realm | undefined = this._close(realmPath);

    if (!!realm) {
      const removed = super.rm(realmPath, options);
      return removed;
    }
  }

  // Loadable

  @Implement('Loadable')
  public load(params?: {options?: Dict<string>}): LoadedBlueprints {
    // Get SchemaBlueprints
    const allParams = {
      ...params,
      defaultRealm: this.getDefault(),
    };

    // TODO
    // Does Realm.Results work in place of Array?
    // 1. Get all Trend Blueprints saved to disk
    const loadedBlueprints: LoadedBlueprints = this._loader.load(allParams);

    // TODO Make utility for this
    // Index SchemaBlueprints by realmPath
    // 2. Prepare Data Structure to organize all loaded SchemaBlueprints by realmPath
    const schemasIndexedByRealmPath: Dict<Array<SchemaBlueprint>> = {};

    // 3. Convert all loaded TrendBlueprints to SchemaBlueprints
    for (const trendBlueprint of loadedBlueprints[BlueprintNameEnum.Trend]) {
      // 3.1. Init realmPath
      const realmPath = trendBlueprint.getRealmPath();
      if (!schemasIndexedByRealmPath.hasOwnProperty(realmPath)) schemasIndexedByRealmPath[realmPath] = [];

      // 3.2. Add all TrendBlueprint's Schemas to Data Structure
      schemasIndexedByRealmPath[realmPath].push(...Object.values(trendBlueprint.toSchemaBlueprints()));
    }

    // 4. Add a Realm to the RealmCache for each set of indexed SchemaBlueprints
    const realmPaths = Object.keys(schemasIndexedByRealmPath);
    for (const realmPath of realmPaths) {
      const schemaBlueprints = schemasIndexedByRealmPath[realmPath];
      const options = {};

      this._loadOne(realmPath, {
        schemaBlueprints,
        options,
      });
    }

    // 5. Return LoadedBlueprints object
    return loadedBlueprints;
  }

  /**
   * Same as this.add for now
   */
  public _loadOne(realmPath: string, params: {schemaBlueprints: Array<SchemaBlueprint>; options?: Dict<string>}) {
    const {schemaBlueprints, options} = params;

    this.add(realmPath, {
      schemaBlueprints,
      options,
    });
  }

  private _open(realmPath: string, schemaBlueprints: Array<SchemaBlueprint>, options: any): Realm {
    const schemaDefinitions = schemaBlueprints.map((blueprint) => blueprint.schemaDef);

    const newRealm = new Realm({
      path: realmPath,
      schema: schemaDefinitions,
      deleteRealmIfMigrationNeeded: true,
      ...options,
    });

    return newRealm;
  }

  private _close(realmPath: string): Realm | undefined {
    const existingRealm = this.get(realmPath);
    if (!!existingRealm && existingRealm instanceof Realm) existingRealm.close();

    return existingRealm;
  }
}

class SchemaLoader extends Loader {
  constructor() {
    super();
  }

  load(params: LoadParams & {defaultRealm: Realm}): LoadedBlueprints {
    const {defaultRealm} = params;

    // 1. Load
    const loadedTrendBlueprints: TrendBlueprint[] = Array.from(defaultRealm.objects(BlueprintNameEnum.Trend)).map(
      (row: TrendBlueprintRow) => new TrendBlueprint(row.trendName, row.realmPath, row.properties, row.existingTrendEntities, row.exisitingTrendTags),
    );

    // 2. Format and return
    return {
      [BlueprintNameEnum.Trend]: loadedTrendBlueprints,
    };
  }
}
