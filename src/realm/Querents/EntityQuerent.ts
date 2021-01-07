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
  create(realm: Realm, entityObj: any): RealmEntity {
    const realmRel = this._create(realm, entityObj);

    return realmRel;
  }
}

export default EntityQuerent;
