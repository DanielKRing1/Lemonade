import {ArrayCache, Cache, Singleton, Override} from '../../Base';
import {SchemaBlueprint} from '../Schema/SchemaBlueprint';

import {TrendCache} from './TrendCache';

export class SchemaCache extends Singleton(Cache)<SchemaBlueprint> {
  private _realmMap: RealmSchemaCache = new RealmSchemaCache();
  private _schemaTypeMap: SchemaTypeCache = new SchemaTypeCache();

  constructor() {
    super();

    return this.getSingleton() as SchemaCache;
  }

  @Override('Cache')
  add(schemaName: string, valueParams: Record<string, any> & {schemaBlueprint: SchemaBlueprint}) {
    const {schemaBlueprint} = valueParams;
    const {realmPath, schemaType} = schemaBlueprint;

    // Add to main map
    this._map[schemaName] = schemaBlueprint;

    // Add to normalized helper maps
    this._realmMap.add(realmPath, {schemaName});
    this._schemaTypeMap.add(schemaType, {schemaName});
  }

  @Override('Cache')
  rm(schemaName: string, options?: any): void {
    const realmPath = this.getRealmPath(schemaName);
    const schemaType = this.getSchemaType(schemaName);

    if (!!realmPath && !!schemaType) {
      this._realmMap.rm(realmPath, schemaName);
      this._schemaTypeMap.rm(schemaType, schemaName);
    }
  }

  // Realm-Schemas utils
  public getRealmSchemaNames(realmPath: RealmPath): SchemaName[] | undefined {
    return this._realmMap.get(realmPath);
  }
  public getRealmSchemas(realmPath: RealmPath): SchemaBlueprint[] | undefined {
    const schemaNames: SchemaName[] | undefined = this.getRealmSchemaNames(realmPath);

    if (!!schemaNames) {
      const schemaBlueprints: SchemaBlueprint[] = schemaNames
        .map((schemaName: SchemaName) => this.get(schemaName))
        .filter((schemaBlueprint: SchemaBlueprint | undefined) => schemaBlueprint == undefined) as SchemaBlueprint[];

      return schemaBlueprints;
    }
  }

  // SchemaType-Schemas utils
  public getSchemaTypeSchemaNames(schemaType: SchemaTypeEnum): SchemaName[] | undefined {
    return this._schemaTypeMap.get(schemaType);
  }
  public getSchemaTypeSchemas(schemaType: SchemaTypeEnum): SchemaBlueprint[] | undefined {
    const schemaNames: SchemaName[] | undefined = this.getSchemaTypeSchemaNames(schemaType);

    if (!!schemaNames) {
      const schemaBlueprints: SchemaBlueprint[] = schemaNames
        .map((schemaName: SchemaName) => this.get(schemaName))
        .filter((schemaBlueprint: SchemaBlueprint | undefined) => schemaBlueprint == undefined) as SchemaBlueprint[];

      return schemaBlueprints;
    }
  }

  // SchemaBlueprint reverse look-up utils
  public getRealmPath(schemaName: SchemaName): RealmPath | undefined {
    const schemaBlueprint: SchemaBlueprint | undefined = this.get(schemaName);
    if (!!schemaBlueprint) {
      return schemaBlueprint.realmPath;
    }
  }

  public getSchemaType(schemaName: SchemaName): SchemaTypeEnum | undefined {
    const schemaBlueprint: SchemaBlueprint | undefined = this.get(schemaName);
    if (!!schemaBlueprint) {
      return schemaBlueprint.schemaType;
    }
  }

  public getTrendCache(): TrendCache {
    return this._trendCache;
  }
}

class RealmSchemaCache extends Singleton(ArrayCache)<SchemaName> {
  constructor() {
    super();

    return this.getSingleton() as RealmSchemaCache;
  }

  add(realmPath: string, valueParams: Record<string, any> & {schemaName: SchemaName}) {
    const {schemaName} = valueParams;
    this.addToKeyArr(realmPath, schemaName);
  }
}

class SchemaTypeCache extends Singleton(ArrayCache)<SchemaName> {
  constructor() {
    super();

    return this.getSingleton() as SchemaTypeCache;
  }

  add(schemaType: string, valueParams: Record<string, any> & {schemaName: SchemaName}) {
    const {schemaName} = valueParams;
    this.addToKeyArr(schemaType, schemaName);
  }
}
