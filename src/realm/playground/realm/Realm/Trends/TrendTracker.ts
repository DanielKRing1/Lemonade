import RealmCache from './RealmCache';

import NodeQuerent from '../../Querents/Nodes/NodeQuerent';
import DenseEdgeQuerent from '../../Querents/Edges/DenseEdgeQuerent';
// TODO Add Querent for Days
// import DPSeqRelQuerent from '../../../../Querents/DayPartSeqRelQuerent';

export class TrendTracker {
  trendName: string;
  trendProperties: string[];

  nodeQ: NodeQuerent;
  edgeQ: DenseEdgeQuerent;

  // dayQ: DPSeqRelQuerent;

  constructor(realmPath: string, trendName: string, trendProperties: string[]) {
    this.trendName = trendName;
    this.trendProperties = trendProperties;

    this.nodeQ = new NodeQuerent(realmPath, trendName);
    this.edgeQ = new DenseEdgeQuerent(realmPath, trendName);

    // this.dayQ = new DPSeqRelQuerent(trendName);
  }

  rate(realm: Realm, entities: Array<string>, mood: string, rating: number, weights: null | number | Array<number>, options: Dict<any>) {
    this.nodeQ.rate(realm, entities, mood, rating, weights, options);
    this.edgeQ.rate(realm, entities, mood, rating, weights, options);

    // this.dayQ.rate(realm, entities, mood, rating, weights);
  }
}
