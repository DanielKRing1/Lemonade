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

  public rate(realm: Realm, entities: string[], tags: string[], mood: string, rating: number, weights: null | number | number[], options: Dict<any>) {
    // 1.1. Create TrendSnapshot for the TrendDay (The rating for each entity's' moods at the start of this day/ before rating the entities today)
    const trendSnapshot: TrendSnapshot = {
      // TrendSnapshot

      trendName: this.trendBlueprint.getTrendName(),
      entitySnapshots: entities.map((entityName: string) => ({
        // EntitySnapshot

        entityName,
        moodSnapshots: this.trendBlueprint
          .getProperties()
          .map((basePropertyName: string) => TrendBlueprint.genPropertyKey(basePropertyName))
          .map((moodName: string) => ({
            // MoodSnapshot

            moodName,
            rating: this.nodeQ.get(realm, true, entityName)[0][moodName],
          })),
      })),
    };

    // 1.2. Update today's TrendDay
    const dayQOptions = {
      ...options,
      trendSnapshot,
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
