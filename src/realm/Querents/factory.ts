import Realm from 'realm';

import RealmSchema from '../../realm/schemaNames';
import {Querent, DayQuerent, RelQuerent} from './';

import {ActivitySchema, CategorySchema, CategoryRelationshipSchema, ActivityRelationshipSchema} from '../Activity';

import {DEFAULT_PATH} from '../../constants/Realm/paths';

export default class QuerentFactory {
  static realmInstanceMap: Record<RealmPath, Realm> = {};
  static querentInstanceMap: Record<RealmPath, {[key in RealmSchema]?: Querent}> = {};

  static getDayQuerent(realmPath: RealmPath = DEFAULT_PATH, schema: RealmSchema | string = RealmSchema.Day) {
    let realmInstance = QuerentFactory.getRealm(DEFAULT_PATH);
    let querentInstance = QuerentFactory.querentInstanceMap[DEFAULT_PATH][schema];

    if (querentInstance === undefined) {
      querentInstance = new DayQuerent(realmInstance, schema);

      QuerentFactory.querentInstanceMap[realmPath][schema] = querentInstance;
    }

    return querentInstance as DayQuerent;
  }

  static getRelQuerent(realmPath: RealmPath = DEFAULT_PATH, schema: RealmSchema | string, classType: AnyRel | any): RelQuerent {
    let realmInstance = QuerentFactory.getRealm(realmPath);
    let querentInstance = QuerentFactory.querentInstanceMap[realmPath][schema];

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
        schema: [ActivitySchema, CategorySchema, CategoryRelationshipSchema, ActivityRelationshipSchema],
        deleteRealmIfMigrationNeeded: true,
      });

      // Add to maps
      QuerentFactory.realmInstanceMap[realmPath] = realmInstance;
      QuerentFactory.querentInstanceMap[realmPath] = {};
    }

    return realmInstance;
  }
}
