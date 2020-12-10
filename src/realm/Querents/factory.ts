import Realm from 'realm';

import {
  ActivitySchema,
  CategorySchema,
  CategoryRelationshipSchema,
  ActivityRelationshipSchema,
} from '../Activity';

import RealmSchema from '../../realm/schemaNames';
import {Querent, RelQuerent} from './';

export default class QuerentFactory {
  static realmInstanceMap: Record<RealmPath, Realm> = {};
  static querentInstanceMap: Record<
    RealmPath,
    {[key in RealmSchema]?: Querent}
  > = {};

  static getRelQuerent(
    realmPath: RealmPath,
    schema: RealmSchema,
    classType: AnyRel | any,
  ): RelQuerent {
    let realmInstance = QuerentFactory.getRealm(realmPath);
    let querentInstance =
      QuerentFactory.querentInstanceMap[schema]?.[realmPath];

    if (querentInstance === undefined) {
      querentInstance = new RelQuerent(realmInstance, schema);
      querentInstance.create = classType.prototype.create;
      // TODO Add update logic
      // querentInstance.update = classType.prototype.update;

      QuerentFactory.querentInstanceMap[realmPath][schema] = querentInstance;
    }

    return querentInstance as RelQuerent;
  }

  static getRealm(realmPath: RealmPath) {
    let realmInstance = QuerentFactory.realmInstanceMap[realmPath];

    // Open new Realm
    if (realmInstance === undefined) {
      realmInstance = new Realm({
        path: realmPath,
        schema: [
          ActivitySchema,
          CategorySchema,
          CategoryRelationshipSchema,
          ActivityRelationshipSchema,
        ],
        deleteRealmIfMigrationNeeded: true,
      });

      // Add to maps
      QuerentFactory.realmInstanceMap[realmPath] = realmInstance;
      QuerentFactory.querentInstanceMap[realmPath] = {};
    }

    return realmInstance;
  }
}
