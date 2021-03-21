import {Cache, Loadable, Loader, LoadParams, Singleton, Override, Implement} from '../../Base';
import {SchemaBlueprint} from '../SchemaBlueprint';

import {TrendCache} from './TrendCache';

import {DEFAULT_PATH} from '../../../../../constants';

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
        schemaBlueprints: [SchemaBlueprint.BLUEPRINT_SCHEMA],
        options: {},
      });

    return this.get(DEFAULT_PATH) as Realm;
  }

  @Override('Cache')
  public add(realmPath: string, valueParams: {schemaBlueprints: Array<SchemaBlueprint>; options?: any}): void {
    const {schemaBlueprints, options} = valueParams;
    const newRealm = this._open(realmPath, schemaBlueprints, options);

    // Close existing realm (if exists)
    this._close(realmPath);
    this._map[realmPath] = newRealm;
  }

  @Override('Cache')
  public rm(realmPath: string, options?: any): Realm | undefined {
    const realm: Realm | undefined = this._close(realmPath);

    if (!!realm) {
      const removed = super.rm(realmPath, options);
      return removed;
    }
  }

  // Loadable

  @Implement('Loadable')
  public load(params?: {options?: Dict<string>}): Array<SchemaBlueprint> {
    // Get SchemaBlueprints
    const allParams = {
      ...params,
      defaultRealm: this.getDefault(),
    };

    // TODO
    // Does Realm.Results work in place of Array?
    const schemas: Array<SchemaBlueprint> = this._loader.load(allParams);

    // TODO Make utility for this
    // Index SchemaBlueprints by realmPath
    const schemasIndexedByRealmPath: Dict<Array<SchemaBlueprint>> = {};

    for (const schema of schemas) {
      const realmPath = schema.realmPath;

      if (!schemasIndexedByRealmPath.hasOwnProperty(realmPath)) schemasIndexedByRealmPath[realmPath] = [];
      schemasIndexedByRealmPath[realmPath].push(schema);
    }

    // Add a Realm to the RealmCache for each set of indexed SchemaBlueprints
    const realmPaths = Object.keys(schemasIndexedByRealmPath);
    for (const realmPath of realmPaths) {
      const schemaBlueprints = schemasIndexedByRealmPath[realmPath];
      const options = {};

      this._loadOne(realmPath, {
        schemaBlueprints,
        options,
      });
    }

    return schemas;
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

  load(params: LoadParams & {defaultRealm: Realm}): Array<SchemaBlueprint> {
    const {defaultRealm} = params;

    // Load
    const schemaBlueprints: Array<SchemaBlueprint> = Array.from(defaultRealm.objects(SchemaName.SchemaBlueprint));

    return schemaBlueprints;
  }
}
