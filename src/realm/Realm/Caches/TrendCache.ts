import {Cache, LoadParams, Singleton, Override, Implement} from '../../Base';

import {TrendTracker} from '../Trends';
import {TrendBlueprint} from '../Trends/TrendBlueprint';

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
  add(trendName: string, valueParams: {realmPath: string; trendProperties: string[]}): void {
    const {realmPath, trendProperties} = valueParams;

    // 1. Add to cache
    this._map[trendName] = new TrendTracker(realmPath, trendName, trendProperties);
  }
}
