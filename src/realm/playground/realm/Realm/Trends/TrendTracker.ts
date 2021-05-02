import NodeQuerent from '../../Querents/Nodes/NodeQuerent';
import DenseEdgeQuerent from '../../Querents/Edges/DenseEdgeQuerent';
import {TrendBlueprint} from './TrendBlueprints';
// TODO Add Querent for Days
// import DPSeqRelQuerent from '../../../../Querents/DayPartSeqRelQuerent';

export class TrendTracker {
  private trendBlueprint: TrendBlueprint;

  private nodeQ: NodeQuerent;
  private edgeQ: DenseEdgeQuerent;

  // dayQ: DPSeqRelQuerent;

  constructor(realmPath: string, trendName: string, trendProperties: string[]) {
    this.trendBlueprint = new TrendBlueprint(trendName, realmPath, trendProperties);

    this.nodeQ = new NodeQuerent(realmPath, trendName);
    this.edgeQ = new DenseEdgeQuerent(realmPath, trendName);

    // this.dayQ = new DPSeqRelQuerent(trendName);
  }

  public rate(realm: Realm, entities: Array<string>, mood: string, rating: number, weights: null | number | Array<number>, options: Dict<any>) {
    this.nodeQ.rate(realm, entities, mood, rating, weights, options);
    this.edgeQ.rate(realm, entities, mood, rating, weights, options);

    // this.dayQ.rate(realm, entities, mood, rating, weights);
  }

  public getTrendBlueprint(): TrendBlueprint {
    return this.trendBlueprint;
  }
}
