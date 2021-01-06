import RealmSchema from '../schemaNames';

import {InstantiateAbstractClassError, NotImplementedError} from '../../Errors';

export default class Querent {
  schema: string;

  constructor(schema: RealmSchema | string) {
    if (this.constructor === Querent) throw new InstantiateAbstractClassError('Querent');

    this.schema = schema;
  }

  getById(realm: Realm, id: string): RealmEntity | undefined {
    return realm.objectForPrimaryKey(this.schema, id);
  }
  get(realm: Realm, ...args: any[]) {
    throw new NotImplementedError('Querent.get');
  }
  getAll(realm: Realm) {
    return realm.objects(this.schema);
  }

  _create(realm: Realm, entity: any): RealmEntity {
    const rel: RealmEntity = realm.create(this.schema, entity, Realm.UpdateMode.All);

    return rel;
  }
  create(realm: Realm, ...args: any[]): RealmEntity {
    throw new NotImplementedError('Querent.create');
  }
  getOrCreate(realm: Realm, ...args: any[]) {
    throw new NotImplementedError('Querent.getOrCreate');
  }
}
