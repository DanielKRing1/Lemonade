import TrendTracker from './TrendTracker';

import RealmSchema from '../schemaNames';

/**
 * This class owns a map of { trendName: TrendTracker(trendName, realm) }
 *
 * RealmCache will add all trends associated with a Realm when a Realm is RealmCache.add()'ed
 */

class TrendCache {
  static trends: Record<string, TrendTracker> = {};

  static add(trendName: string, realm: Realm, update: boolean = false) {
    // Do not overwrite
    if (TrendCache.trends[trendName] && !update) return;

    TrendCache.trends[trendName] = new TrendTracker(trendName, realm);
  }

  static get(trendName: string) {
    return TrendCache.trends[trendName];
  }
}

export default TrendCache;
