import {Cache, LoadParams, Singleton, Override, Implement} from '../../Base';
import {SchemaBlueprint} from '../Schema/SchemaBlueprint';

import {buildTrendBlueprints, getTrendTagSchemaName, TrendTracker} from '../Trends';
import {TrendBlueprint} from '../Trends/TrendBlueprints';

/**
 * A SINGLETON CACHE that caches all TrendSchemas and their TrendTracker
 *
 */
export class TrendCache extends Singleton(Cache)<TrendCacheValue> {
  constructor() {
    super();

    return this.getSingleton() as TrendCache;
  }

  @Override('Cache')
  add(trendName: string, valueParams: {realmPath: string; trendProperties: string[]}): TrendBlueprint {
    const {realmPath, trendProperties} = valueParams;

    // 1. Add to cache
    this._map[trendName] = new TrendTracker(realmPath, trendName, trendProperties);

    // 2. Construct new TrendBlueprint
    const trendBlueprint: TrendBlueprint = new TrendBlueprint(trendName, realmPath, trendProperties);
    return trendBlueprint;
  }
}
