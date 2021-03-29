import {Cache, Singleton} from '../../Base';
import {SchemaBlueprint} from '../Schema/SchemaBlueprint';

export class SchemaCache extends Singleton(Cache)<SchemaBlueprint> {
  protected _realmMap: Dict<SchemaName>;

  constructor() {
    super();

    this._realmMap = {};

    return this.getSingleton() as SchemaCache;
  }

  add(schemaName: string, valueParams: Record<string, any> & {schemaBlueprint: SchemaBlueprint}) {
    const {schemaBlueprint} = valueParams;

    this._map[schemaName] = schemaBlueprint;
  }
}
