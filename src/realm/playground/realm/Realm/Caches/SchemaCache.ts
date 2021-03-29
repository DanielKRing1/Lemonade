import {sceneName} from 'aws-amplify';
import {ArrayCache, Cache, Singleton, Override} from '../../Base';
import {SchemaBlueprint} from '../Schema/SchemaBlueprint';

export class SchemaCache extends Singleton(Cache)<SchemaBlueprint> {
  protected _realmMap: RealmSchemaCache = new RealmSchemaCache();
  protected _schemaTypeMap: SchemaTypeCache = new SchemaTypeCache();

  constructor() {
    super();

    return this.getSingleton() as SchemaCache;
  }

  @Override('Cache')
  add(schemaName: string, valueParams: Record<string, any> & {schemaBlueprint: SchemaBlueprint}) {
    const {schemaBlueprint} = valueParams;
    const {realmPath, schemaType} = schemaBlueprint;

    this._map[schemaName] = schemaBlueprint;

    this._realmMap.add(realmPath, {schemaName});
    this._schemaTypeMap.add(schemaType, {schemaName});
  }
}

class RealmSchemaCache extends Singleton(ArrayCache)<SchemaName> {
  constructor() {
    super();

    return this.getSingleton() as RealmSchemaCache;
  }

  add(realmPath: string, valueParams: Record<string, any> & {schemaName: SchemaName}) {
    const {schemaName} = valueParams;
    this.addToArr(realmPath, schemaName);
  }
}

class SchemaTypeCache extends Singleton(ArrayCache)<SchemaName> {
  constructor() {
    super();

    return this.getSingleton() as SchemaTypeCache;
  }

  add(schemaType: string, valueParams: Record<string, any> & {schemaName: SchemaName}) {
    const {schemaName} = valueParams;
    this.addToArr(schemaType, schemaName);
  }
}
