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

  /**
   * Calls the realm.create method on the passed row
   *
   * @param realm Realm to insert into
   * @param row Data object to insert into Realm
   */
  _create(realm: Realm, row: any): RealmEntity {
    const rel: RealmEntity = realm.create(this.schema, row, Realm.UpdateMode.All);

    return rel;
  }
  /**
   * Creates a row to insert into the passed Realm
   * Then calls _create to perform the actual insertion
   *
   * @param realm Realm to insert into
   * @param args Any parameters necessary for creating row to insert
   */
  create(realm: Realm, ...args: any[]): RealmEntity {
    throw new NotImplementedError('Querent.create');
  }
  getOrCreate(realm: Realm, ...args: any[]) {
    throw new NotImplementedError('Querent.getOrCreate');
  }
}
