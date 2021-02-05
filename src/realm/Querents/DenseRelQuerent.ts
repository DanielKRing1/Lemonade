import RealmSchema from '../schemaNames';

import RelQuerent from './RelQuerent';

export default class DenseRelQuerent extends RelQuerent {
  constructor(schema: RealmSchema | string) {
    super(schema);
  }

  _groupAndRate(realm: Realm, entities: Array<string>, mood: string, ratings: Array<number>, weights: Array<number>, other: Object = {}) {
    for (let i = 0; i < entities.length - 2; i++) {
      const entity1 = entities[i];
      for (let j = i + 1; j < entities.length - 1; j++) {
        const rating = (ratings[i] + ratings[j]) / 2;
        const weight = (weights[i] + weights[j]) / 2;

        const entity2 = entities[j];
        this._rate(realm, mood, rating, weight, entity1, entity2);
      }
    }
  }
}
