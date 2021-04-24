import EdgeQuerent from "../Base/EdgeQuerent";

export default class SeqEdgeQuerent extends EdgeQuerent {
  // Override method, order matters and creates different key
  static sortNamePair(n1: string, n2: string): string[] {
    return [n1, n2];
  }

  constructor(realmPath: string, schemaName: string) {
    super(realmPath, schemaName);
  }

  @Override("Querent")
  protected _group(
    realm: Realm,
    nodeIds: string[],
    weights: Array<number>,
    options: Dict<string> = {}
  ): EntityWeight<Edge>[] {
    const edgeAndWeights: EntityWeight<Edge>[] = this.getSeqEdgeCombos(
      realm,
      nodeIds,
      weights,
      true
    );

    return edgeAndWeights;
  }
}
