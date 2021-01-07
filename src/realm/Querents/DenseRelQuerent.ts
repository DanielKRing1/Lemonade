import RealmSchema from '../schemaNames';

import RelQuerent from './RelQuerent';

export default class DenseRelQuerent extends RelQuerent {
  constructor(schema: RealmSchema | string) {
    super(schema);
  }

  groupAndRate(realm: Realm, entities: Array<string>, mood: string, rating: number, other: Object = {}) {
    for (let i = 0; i < entities.length - 2; i++) {
      const entity1 = entities[i];
      for (let j = i + 1; j < entities.length - 1; j++) {
        const entity2 = entities[j];
        this._rate(realm, mood, rating, 1 / entities.length, entity1, entity2);
      }
    }
  }
}
