//@ts-ignore
import Realm from "realm";
import { Override } from "../Base";

import Querent from "../Base/Querent";
//@ts-ignore
import Realm from "../Realm";

type Node = {
  name: string;
  edges: string[];
};

export default class NodeQuerent extends Querent<Node> {
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
  ): Realm.Results<Node> | undefined {
    const entityObj = {
      id: entityName,
      ...properties,
    };

    const realmRel = this._create(realm, entityObj);
    return realmRel;
  }

  @Override('Querent');
  get(realm: Realm, create: boolean, nodeId: string): Realm.Results<Node> {
    let node = this.getById(realm, nodeId);

    // Optionally create if does not exist
    if (create && node === undefined) node = this.create(realm, nodeId);

    return node;
  }

  @Override('Querent');
  protected _group(
    realm: Realm,
    nodeIds: string[],
    weights: number[],
    options: Object = {}
  ): EntityWeight<Node>[] {
    const entityWeights: EntityWeight<Node>[] = [];

    // 1. For each Node
    for(let i = 0; i < nodeIds.length; i++) {
      // 2. Create if it does not exist
      const nodeId: string = nodeIds[i];
      const node: Realm.Result<Node> = this.get(realm, true, nodeId);
      
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
    node: Realm.Results<Node> & Node,
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

    return newMoodRating;
  }
}
