import RealmSchema from '../schemaNames';

import SeqRelQuerent from './SeqRelQuerent';

export default class DayPartSeqRelQuerent extends SeqRelQuerent {
  constructor(realm: Realm, schema: RealmSchema) {
    super(realm, schema);
  }

  update(
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
        this.rate(entityNow, entityPrev, mood, rating, 1 / entitiesNow.length);
      }
    }
  }
}
