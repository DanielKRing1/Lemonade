import RealmSchema from '../schemaNames';

import RelQuerent from './RelQuerent';

export default class CategoryRelQuerent extends RelQuerent {
  constructor(realm: Realm, schema: RealmSchema | string) {
    super(realm, schema);
  }

  create(c1: Category, c2: Category): CategoryRel {
    const [categoryName1, categoryName2] = RelQuerent.sortNamePair(c1, c2);
    const id = RelQuerent.getRelId(c1, c2);

    const relObj: CategoryRel = {
      id,
      entity1: {
        id: categoryName1,
      },
      entity2: {
        id: categoryName2,
      },
      totalRatings: 0,
      happiness: categoryName1 !== '1' ? Math.random() : 0.0001,
    };

    const realmRel = this._create(relObj);

    return realmRel as CategoryRel;
  }
}
