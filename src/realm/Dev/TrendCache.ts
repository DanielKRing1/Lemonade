import TrendTracker from './TrendTracker';

import RealmSchema from '../schemaNames';

/**
 * This class owns a map of { trendName: TrendTracker(trendName, realm) }
 *
 * RealmCache will add all trends associated with a Realm when a Realm is RealmCache.add()'ed
 */

class DEPRECATEDTrendCache {
  static cache: Record<string, TrendTracker> = {};

  static add(realmPath: string, trendName: string, update: boolean = false) {
    // Do not overwrite
    if (TrendCache.cache[trendName] && !update) return;

    TrendCache.cache[trendName] = new TrendTracker(realmPath, trendName);
  }

  static get(trendName: string) {
    return TrendCache.cache[trendName];
  }
}

export default TrendCache;
