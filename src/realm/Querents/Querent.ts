import RealmSchema from '../schemaNames';

import {InstantiateAbstractClassError, NotImplementedError} from '../../Errors';

export default class Querent {
  realm: Realm;
  schema: string;

  constructor(realm: Realm, schema: RealmSchema) {
    if (this.constructor === Querent)
      throw new InstantiateAbstractClassError('Querent');

    this.realm = realm;
    this.schema = schema;
  }

  getById(id: string): RealmEntity | undefined {
    return this.realm.objectForPrimaryKey(this.schema, id);
  }
  get(...args: any[]) {
    throw new NotImplementedError('Querent.get');
  }
  getAll() {
    return this.realm.objects(this.schema);
  }

  _create(entity: any): RealmEntity {
    const rel: RealmEntity = this.realm.create(
      this.schema,
      entity,
      Realm.UpdateMode.All,
    );

    return rel;
  }
  create(...args: any[]): RealmEntity {
    throw new NotImplementedError('Querent.create');
  }
  getOrCreate(...args: any[]) {
    throw new NotImplementedError('Querent.getOrCreate');
  }
}
