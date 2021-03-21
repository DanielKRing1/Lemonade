import {Cache, LoadParams, Singleton, Override, Implement} from '../../Base';

import {TrendTracker} from '../Trends';

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
  add(trendName: string, valueParams: {realmPath: string}) {
    const {realmPath} = valueParams;

    this._map[trendName] = new TrendTracker(realmPath, trendName);
  }
}
