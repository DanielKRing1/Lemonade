import {Cache, LoadParams, Singleton, Override, Implement} from '../../Base';
import {SchemaBlueprint} from '../Schema/SchemaBlueprint';

import {buildTrendBlueprints, TrendTracker} from '../Trends';

/**
 * A SINGLETON CACHE that caches all TrendSchemas and their TrendTracker
 *
 */
export class TrendCache extends Singleton(Cache)<TrendTracker> {
  constructor() {
    super();

    return this.getSingleton() as TrendCache;
  }

  @Override('Cache')
  add(trendName: string, valueParams: {realmPath: string; attributeNames: string[]; relTypes: RelationshipTypeEnum[]}) {
    const {realmPath, attributeNames, relTypes} = valueParams;

    // 1. Get all Trend Blueprints
    const trendBlueprints: CompleteTrendBlueprints = buildTrendBlueprints(trendName, realmPath, attributeNames, relTypes);

    // 2. Add Blueprints to TrendTracker + Cache TrendTracker
    this._map[trendName] = new TrendTracker(realmPath, trendName);

    // TODO Make Array flatten util

    // 3. Return lsit of SchemaBlueprints
    return Object.values(trendBlueprints).reduce((acc: SchemaBlueprint[], cur) => {
      if (Array.isArray(cur)) acc.push(...(cur as SchemaBlueprint[]));
      else acc.push(cur as SchemaBlueprint);

      return acc as SchemaBlueprint[];
    }, []);
  }
}
