import NodeQuerent from '../../Querents/Nodes/NodeQuerent';
import DenseEdgeQuerent from '../../Querents/Edges/DenseEdgeQuerent';
import {TrendBlueprint} from './TrendBlueprints';
import DayQuerent from '../../Querents/Day/DayQuerent';
// TODO Add Querent for Days
// import DPSeqRelQuerent from '../../../../Querents/DayPartSeqRelQuerent';

export class TrendTracker {
  private trendBlueprint: TrendBlueprint;

  private dayQ: DayQuerent;
  private nodeQ: NodeQuerent;
  private edgeQ: DenseEdgeQuerent;
  private nodeTagQ: NodeQuerent;
  private edgeTagQ: DenseEdgeQuerent;

  // dayQ: DPSeqRelQuerent;

  constructor(realmPath: string, trendName: string, trendProperties: string[]) {
    this.trendBlueprint = new TrendBlueprint(trendName, realmPath, trendProperties);

    // Trend entities
    this.nodeQ = new NodeQuerent(realmPath, trendName);
    this.edgeQ = new DenseEdgeQuerent(realmPath, trendName);

    // Trend tags
    this.nodeTagQ = new NodeQuerent(realmPath, trendName);
    this.edgeTagQ = new DenseEdgeQuerent(realmPath, trendName);

    // Day snapshots
    this.dayQ = new DayQuerent(realmPath, trendName);
  }

  /**
   * Make the Day Querent publicly available
   *
   * Get the Day Querent for the given Trend
   *
   * @param nodeType Either get the NodeQuerent for the set of all user-input ENITIES or for the user-input TAGS
   */
  public getDailyQ() {
    return this.dayQ;
  }

  /**
   * Make the Node Querents publicly available
   *
   * Get the Node Querent for either the 'default' entity nodes or for their tag nodes
   *
   * @param nodeType Either get the NodeQuerent for the set of all user-input ENITIES or for the user-input TAGS
   */
  public getNodeQ(nodeType: SchemaTypeEnum.TREND_NODE | SchemaTypeEnum.TAG_NODE = SchemaTypeEnum.TREND_NODE) {
    return nodeType === SchemaTypeEnum.TREND_NODE ? this.nodeQ : this.nodeTagQ;
  }

  /**
   * Make the Edge Querents publicly available
   *
   * Get the Edge Querent for either the 'default' entity edges or for their tag edge
   *
   * @param nodeType Either get the EdgeQuerent for the set of all user-input ENITIES or for the user-input TAGS
   */
  public getEdgeQ(edgeType: SchemaTypeEnum.TREND_EDGE | SchemaTypeEnum.TAG_EDGE = SchemaTypeEnum.TREND_EDGE) {
    return edgeType === SchemaTypeEnum.TREND_EDGE ? this.edgeQ : this.edgeTagQ;
  }

  public rate(realm: Realm, entities: string[], tags: string[], mood: string, rating: number, weights: null | number | number[], options: Dict<any>) {
    // 1. Update today's TrendDay
    const dayQOptions = {
      ...options,
    };
    this.dayQ.rate(realm, entities, mood, rating, weights, dayQOptions);

    // 2. Update Realm Trend Graph
    this.nodeQ.rate(realm, entities, mood, rating, weights, options);
    this.edgeQ.rate(realm, entities, mood, rating, weights, options);

    // 3. Update Realm Trend Tags Graph
    this.nodeTagQ.rate(realm, tags, mood, rating, weights, options);
    this.edgeTagQ.rate(realm, tags, mood, rating, weights, options);
  }

  public getTrendBlueprint(): TrendBlueprint {
    return this.trendBlueprint;
  }
}
