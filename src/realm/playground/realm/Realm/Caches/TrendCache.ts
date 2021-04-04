import {Cache, LoadParams, Singleton, Override, Implement} from '../../Base';
import {SchemaBlueprint} from '../Schema/SchemaBlueprint';

import {buildTrendBlueprints, getTrendTagSchemaName, TrendTracker} from '../Trends';

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
  add(trendName: string, valueParams: {realmPath: string; attributeNames: string[]; relTypes: RelationshipTypeEnum[]}) {
    const {realmPath, attributeNames, relTypes} = valueParams;

    // 1. Get all Trend Blueprints
    const trendBlueprints: CompleteTrendBlueprints = buildTrendBlueprints(trendName, realmPath, attributeNames, relTypes);

    // 2. Add TREND and TAG TrendTrackers to Cache
    this._map[trendName] = {
      [SchemaTypeEnum.TREND]: new TrendTracker(realmPath, trendName),
      [SchemaTypeEnum.TAG]: new TrendTracker(realmPath, getTrendTagSchemaName(trendName)),
    };

    // TODO Make Array flatten util

    // 3. Return lsit of SchemaBlueprints
    return Object.values(trendBlueprints).reduce((acc: SchemaBlueprint[], cur) => {
      if (Array.isArray(cur)) acc.push(...(cur as SchemaBlueprint[]));
      else acc.push(cur as SchemaBlueprint);

      return acc as SchemaBlueprint[];
    }, []);
  }

  getTrend(trendName: string, valueParams: any = {}): TrendTracker | undefined {
    const cachedValue: TrendCacheValue | undefined = this.get(trendName);
    if (!!cachedValue) return cachedValue[SchemaTypeEnum.TREND];
  }

  getTag(trendName: string, valueParams: any = {}): TrendTracker | undefined {
    const cachedValue: TrendCacheValue | undefined = this.get(trendName);
    if (!!cachedValue) return cachedValue[SchemaTypeEnum.TREND];
  }
}
