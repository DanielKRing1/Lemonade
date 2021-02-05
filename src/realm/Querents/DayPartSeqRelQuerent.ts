import RealmSchema from '../schemaNames';

import SeqRelQuerent from './SeqRelQuerent';

export default class DayPartSeqRelQuerent extends SeqRelQuerent {
  constructor(schema: RealmSchema | string) {
    super(schema);
  }

  // TODO Replace with update
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

  update(
    realm: Realm,
    entitiesNow: Array<string>,
    mood: string,
    rating: number,
    other: {
      entitiesPrev: Array<string>;
    },
  ) {
    const {entitiesPrev} = other;

    for (let i = 0; i < entitiesNow.length - 1; i++) {
      const entityNow = entitiesNow[i];
      for (let j = 0; j < entitiesPrev.length - 1; j++) {
        const entityPrev = entitiesPrev[j];
        this._rate(realm, mood, rating, 1 / entitiesNow.length, entityNow, entityPrev);
      }
    }
  }
}
