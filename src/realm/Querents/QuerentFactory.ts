// TODO
// 1. Add rate to RealmInterface
// 2. Test Realm relationships on phone
// 3. Construct Node and Edge Querents for new TrendTracker, within TT

import {SchemaBlueprint} from '../Realm/Schema/SchemaBlueprint';
import {TrendBlueprint} from '../Realm/Trends/TrendBlueprint';
import EdgeQuerent from './Base/EdgeQuerent';

export class QuerentFactory {
  public static buildForTrend(trendBlueprint: TrendBlueprint) {
    const denseNodeQuerent: EdgeQuerent = new NodeQuerent(trendBlueprint.realmPath, trendBlueprint.schemaName, trendBlueprint.getAttributes());
    const denseEdgeQuerent: EdgeQuerent = new DenseEdgeQuerent(trendBlueprint.realmPath, trendBlueprint.schemaName, trendBlueprint.getAttributes());
    const seqEdgeQuerent: EdgeQuerent = new EdgeQuerent(trendBlueprint.realmPath, trendBlueprint.schemaName, trendBlueprint.getAttributes());
  }
}
