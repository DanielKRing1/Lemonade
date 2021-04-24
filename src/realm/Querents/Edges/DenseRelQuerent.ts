import EdgeQuerent from "../Base/EdgeQuerent";

type EntityAndWeights<T> = {
  entity: Realm.Object & T;
  weight: number;
}[];

export default class DenseRelQuerent extends EdgeQuerent {
  constructor(realmPath: string, schemaName: string) {
    super(realmPath, schemaName, "dense");
  }

  // @Override("Querent")
  protected _group(
    realm: Realm,
    nodes: (Realm.Object & Node)[],
    mood: string,
    rating: number,
    weights: number[],
    options: Dict<any> = {}
  ): EntityAndWeights<Edge> {
    // 2. Get edges to rate
    const edgeAndWeights: EntityAndWeights<Edge> = this.getDenseEdgeCombos(
      realm,
      nodes,
      weights,
      true
    );

    return edgeAndWeights;
  }
}
