// TODO
// 1. Add rate to RealmInterface
// 2. Test Realm relationships on phone
// 3. Construct Node and Edge Querents for new TrendTracker, within TT

import {MetaDataBlueprint} from '../Realm/Schema/MetaDataBlueprint';
import {TrendBlueprint} from '../Realm/Trends/TrendBlueprint';
import NodeQuerent from './Nodes/NodeQuerent';
import DenseEdgeQuerent from './Edges/DenseEdgeQuerent';
import EdgeQuerent from './Base/EdgeQuerent';

export class QuerentFactory {
  public static buildForTrend(trendBlueprint: TrendBlueprint) {
    const denseNodeQuerent: NodeQuerent = new NodeQuerent(trendBlueprint.getRealmPath(), trendBlueprint.getTrendName());
    const denseEdgeQuerent: DenseEdgeQuerent = new DenseEdgeQuerent(trendBlueprint.getRealmPath(), trendBlueprint.getTrendName());
    const seqEdgeQuerent: DenseEdgeQuerent = new DenseEdgeQuerent(trendBlueprint.getRealmPath(), trendBlueprint.getTrendName());
  }
}
