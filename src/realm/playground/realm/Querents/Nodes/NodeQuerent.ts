//@ts-ignore
import Realm from "realm";
import { getTodaysDate } from "../../../util";
import { Override } from "../../Base";

import Querent from "../Base/Querent";
//@ts-ignore
import Realm from "../Realm";

export default class NodeQuerent extends Querent<TrendNode> {
  constructor(realmPath: string, schemaName: string) {
    super(realmPath, schemaName);
  }

  /**
   * Accepts an object to insert into a Realm
   *
   * @param realm
   * @param entityObj
   */
  create(
    realm: Realm,
    entityName: string,
    properties: Dict<any> = {}
  ): Realm.Results<TrendNode> | undefined {
    const entityObj: TrendNode = {
      id: entityName,
      edges: [],
      dailySnapshots: [],
      ...properties,
    };

    const realmRel = this._create(realm, entityObj);
    return realmRel;
  }

  @Override('Querent');
  get(realm: Realm, create: boolean, nodeId: string): Realm.Results<TrendNode> {
    let node = this.getById(realm, nodeId);

    // Optionally create if does not exist
    if (create && node === undefined) node = this.create(realm, nodeId);

    return node as Realm.Results<TrendNode>;
  }

  @Override('Querent');
  protected _group(
    realm: Realm,
    nodeIds: string[],
    weights: number[],
    options: Object = {}
  ): EntityWeight<Realm.Results<TrendNode>>[] {
    const entityWeights: EntityWeight<Realm.Results<TrendNode>>[] = [];

    // 1. For each Node
    for(let i = 0; i < nodeIds.length; i++) {
      // 2. Create if it does not exist
      const nodeId: string = nodeIds[i];
      const node: Realm.Results<TrendNode> = this.get(realm, true, nodeId);
      
      // 3. Add Node and its weight
      entityWeights.push({
        entity: node,
        weight: weights[i]
      })
    }

    return entityWeights;
  }

  @Override('Querent');
  _rate(
    mood: string,
    rating: number,
    weight: number,
    node: Realm.Results<TrendNode> & TrendNode,
  ): number {
    // 1. Compute weighted rating to add
    const weightedRating = rating * weight;

    // 2. Get relevant keys
    const moodRatingKey: string = `${mood}`;
    const totalMoodRatingsCountKey: string = `${mood}_count`;
    // const totalRatingsCountKey: string = `total_ratings`;

    // 3. Compute new mood rating value
    const prevMoodRating: number = node[moodRatingKey]!;
    const totalMoodRatingsCount: number = node[totalMoodRatingsCountKey];
    const newMoodRating: number =
      (prevMoodRating * totalMoodRatingsCount + weightedRating) /
      (totalMoodRatingsCount + weight);

    // 4. Update mood values in Realm
    node[moodRatingKey] = newMoodRating;
    node[totalMoodRatingsCountKey] += weight;

    // 5. Add/Update Node's Daily Snapshot with most up-to-date (current) snapshot of moods
    // 5.1. Get the date at the start of today
    const todaysDate: Date = getTodaysDate();

    // 5.2. Create snapshot
    // Hopefully this will automatically filter out
    const newSnapshot: TrendNodeDailySnapshot | any = {
      date: todaysDate,
      ...node
    }

    // 5.3. Check existing snapshots, with the intent of removing an existing snapshot for today
    const latestSnapshotIndex: number = node.dailySnapshots.length - 1;
    if(latestSnapshotIndex >= 0) {
      const latestSnapshot: TrendNodeDailySnapshot = node.dailySnapshots[latestSnapshotIndex];
      // Already has a snapshot for today... Remove it!
      if(latestSnapshot.date.getTime() === todaysDate.getTime()) node.dailySnapshots.pop();
    }
    
    // 5.4. Add snapshot for today!
    node.dailySnapshots.push(newSnapshot);

    return newMoodRating;
  }
}
