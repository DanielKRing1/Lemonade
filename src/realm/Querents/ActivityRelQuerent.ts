import RealmSchema from '../schemaNames';

import {Category} from '../../realm/Activity/enum';

import RelQuerent from './RelQuerent';

const actCatMap: Record<string, Category> = {
  test: Category.Academics,
};

export default class ActivityRelQuerent extends RelQuerent {
  constructor(realm: Realm, schema: RealmSchema) {
    super(realm, schema);
  }

  create(a1: string, a2: string): ActivityRel {
    const [activityName1, activityName2] = RelQuerent.sortNamePair(a1, a2);
    const id = RelQuerent.getRelId(a1, a2);

    const relObj: ActivityRel = {
      id,
      entity1: {
        id: activityName1,
        category: actCatMap[activityName1],
      },
      entity2: {
        id: activityName2,
        category: actCatMap[activityName2],
      },
      totalRatings: 0,
    };

    const realmRel = this._create(relObj);

    return realmRel as ActivityRel;
  }
}
