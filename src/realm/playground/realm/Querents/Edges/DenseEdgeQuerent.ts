import {Override} from '../../Base';
import EdgeQuerent from '../Base/EdgeQuerent';

export default class DenseEdgeQuerent extends EdgeQuerent {
  constructor(realmPath: string, schemaName: string) {
    super(realmPath, schemaName);
  }

  @Override('Querent')
  protected _group(realm: Realm, nodeIds: string[], weights: number[], options: Dict<any> = {}): EntityWeight<Realm.Results<TrendEdge>>[] {
    const edgeAndWeights: EntityWeight<Realm.Results<TrendEdge>>[] = this.getDenseEdgeCombos(realm, nodeIds, weights, true);

    return edgeAndWeights;
  }
}
