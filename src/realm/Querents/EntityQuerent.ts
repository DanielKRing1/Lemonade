import Querent from './Querent';

class EntityQuerent extends Querent {
  constructor(schema: string) {
    super(schema);
  }

  /**
   * Accepts an object to insert into a Realm
   *
   * @param realm
   * @param entityObj
   */
  create(realm: Realm, entityName: string): RealmEntity {
    const entityObj = {
      id: entityName,
      totalRatings: 0,
    };

    const realmRel = this._create(realm, entityObj);

    return realmRel as RealmEntity;
  }

  getOrCreate(realm: Realm, entityName: string): RealmEntity {
    let entity = this.getById(realm, entityName);
    if (entity === undefined) entity = this.create(realm, entityName);

    return entity as RealmEntity;
  }

  groupAndRate(realm: Realm, entities: Array<string>, mood: string, rating: number, other: Object = {}) {
    for (let i = 0; i < entities.length - 2; i++) {
      const entity = entities[i];
      this._rate(realm, mood, rating, 1 / entities.length, entity);
    }
  }

  _rate(realm: Realm, mood: string, rating: number, weight: number, entityName: string) {
    const entity = this.getOrCreate(realm, entityName);

    const weightedRating = rating * weight;
    const prevRating = entity[mood]!;
    const newRating = (prevRating * entity.totalRatings + weightedRating) / (entity.totalRatings + weight);

    entity[mood] = newRating;
    entity.totalRatings += weight;

    return newRating;
  }
}

export default EntityQuerent;
