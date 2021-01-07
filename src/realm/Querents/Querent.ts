import RealmSchema from '../schemaNames';

import {InstantiateAbstractClassError, NotImplementedError} from '../../Errors';

export default class Querent {
  schema: string;

  constructor(schema: RealmSchema | string) {
    if (this.constructor === Querent) throw new InstantiateAbstractClassError('Querent');

    this.schema = schema;
  }

  getById(realm: Realm, id: string): RealmRow | undefined {
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
  _create(realm: Realm, row: any): RealmRow {
    const rel: RealmRow = realm.create(this.schema, row, Realm.UpdateMode.All);

    return rel;
  }
  /**
   * Creates a row to insert into the passed Realm
   * Then calls _create to perform the actual insertion
   *
   * @param realm Realm to insert into
   * @param args Any parameters necessary for creating row to insert
   */
  create(realm: Realm, ...args: any[]): RealmRow {
    throw new NotImplementedError('Querent.create');
  }
  getOrCreate(realm: Realm, ...args: any[]) {
    throw new NotImplementedError('Querent.getOrCreate');
  }

  /**
   * Public method for initiating rate process
   * Wraps subsequent calls in realm.write
   *
   * @param realm
   * @param entities
   * @param mood
   * @param rating
   * @param other
   */
  rate(realm: Realm, entities: Array<string>, mood: string, rating: number, other: Object = {}) {
    realm.write(() => {
      this.groupAndRate(realm, entities, mood, rating, other);
    });
  }

  /**
   * Receives all entities associated with rating
   * Decides how to group and weight ratings before calling _rate
   *
   * @param realm
   * @param entities
   * @param mood
   * @param rating
   * @param other
   */
  groupAndRate(realm: Realm, entities: Array<string>, mood: string, rating: number, other: Object = {}) {
    throw new NotImplementedError('Querent.rate');
  }
  /**
   * Actually rates entities and saves in Realm
   *
   * @param realm
   * @param mood
   * @param rating
   * @param weight
   * @param args
   */
  _rate(realm: Realm, mood: string, rating: number, weight: number, ...args: any[]) {
    throw new NotImplementedError('Querent._rate');
  }
}
