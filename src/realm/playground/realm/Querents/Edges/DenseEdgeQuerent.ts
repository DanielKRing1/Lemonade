import EdgeQuerent from "../Base/EdgeQuerent";

export default class DenseEdgeQuerent extends EdgeQuerent {
  constructor(realmPath: string, schemaName: string) {
    super(realmPath, schemaName);
  }

  @Override("Querent")
  protected _group(
    realm: Realm,
    nodeIds: string[],
    weights: number[],
    options: Dict<any> = {}
  ): EntityWeight<Edge>[] {
    const edgeAndWeights: EntityWeight<Edge>[] = this.getDenseEdgeCombos(
      realm,
      nodeIds,
      weights,
      true
    );

    return edgeAndWeights;
  }
}
