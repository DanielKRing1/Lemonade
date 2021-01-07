import RealmSchema from '../schemaNames';

import RelQuerent from './RelQuerent';

export default class SeqRelQuerent extends RelQuerent {
  // Override method, order matters and creates different key
  static sortNamePair(n1: string, n2: string): string[] {
    return [n1, n2];
  }

  constructor(schema: RealmSchema | string) {
    super(schema);
  }

  // TODO Update
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
