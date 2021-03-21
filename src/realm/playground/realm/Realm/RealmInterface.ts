import {DEFAULT_PATH} from '../../../../constants';
import {Singleton} from '../Base';
import {RealmCache, TrendCache} from './Caches';
import {RealmUtils} from './Utility';

import {SchemaBlueprint} from './SchemaBlueprint';

class RealmInterface extends Singleton(Object) {
  private _realmCache: RealmCache;
  private _trendCache: TrendCache;

  constructor() {
    super();

    this._realmCache = new RealmCache();
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

  public addTrend(trendName: string, schemaDef: SchemaDef, options?: Dict<string>): SchemaBlueprint | undefined {
    const realmPath = DEFAULT_PATH;
    const schemaType = SchemaType.Trend;

    const addedSchema: SchemaBlueprint | undefined = this._addSchema(realmPath, trendName, schemaType, schemaDef, options);
    if (!!addedSchema) {
      this._trendCache.add(trendName, {realmPath});
    }

    return addedSchema;
  }
  public rmTrend(trendName: string, options?: Dict<string>): Array<SchemaBlueprint> | undefined {
    const defaultRealmPath = DEFAULT_PATH;

    const remainingSchemas: Array<SchemaBlueprint> | undefined = this._rmSchema(defaultRealmPath, trendName, options);
    if (!!remainingSchemas) {
      this._trendCache.rm(trendName);
    }

    return remainingSchemas;
  }

  private _addSchema(realmPath: string, schemaName: string, schemaType: SchemaType, schemaDef: SchemaDef, options?: Dict<string>): SchemaBlueprint | undefined {
    const realm = this._realmCache.get(realmPath);

    if (!!realm) {
      const newSchemaBlueprint: SchemaBlueprint = SchemaBlueprint.save(realm, schemaName, realmPath, schemaType, schemaDef);
      const allSchemas: Array<SchemaBlueprint> = RealmUtils.mergeSchemas(realm, [newSchemaBlueprint]);

      this._realmCache.add(realmPath, {
        schemaBlueprints: allSchemas,
        options,
      });

      return newSchemaBlueprint;
    }
  }

  private _rmSchema(realmPath: string, schemaName: string, options?: Dict<string>): Array<SchemaBlueprint> | undefined {
    const realm = this._realmCache.get(realmPath);

    if (!!realm) {
      const remainingSchemas: Array<SchemaBlueprint> = RealmUtils.filterSchemas(realm, [schemaName]);

      this._realmCache.add(realmPath, {
        schemaBlueprints: remainingSchemas,
        options,
      });

      return remainingSchemas;
    }
  }
}
