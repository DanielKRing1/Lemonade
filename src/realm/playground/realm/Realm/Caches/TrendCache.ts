import {Cache, LoadParams, Singleton, Override, Implement} from '../../Base';

import {TrendTracker} from '../Trends';

type Realm = any;

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
  add(key: string, valueParams: Record<string, any>) {
    throw new Error('Method not implemented.');
  }
}
