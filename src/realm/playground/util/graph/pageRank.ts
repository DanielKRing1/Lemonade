function pageRank<T>(
  initialWeights: Dict<number>,
  originEntity: T,
  getId: (entity: T) => string,
  getConnectedEntities: (entity: T) => ConnectedEntity<T>[],
  iterations: number,
  currentIteration: number = 0,
): Dict<number> {
  const nextWeights: Dict<number> = {};

  // 1. Compute sum of all scores for each node, N, (for each attribute), SN

  // 2.1. Init a map, M, to track weights for each node, where each node starts with a weight of W, where W is computed as follows:
  // 2.1. Compute sum of all scores for each relationship, R, of current node (for each attribute), SR
  // 2.2. Choose arbitrary starting point as "current node"
  // 2.3. For each node connected to current node, compute weight, W = (R/SR) * (N/SN)
  // 2.4. Add W to the initial map, M

  // 3.1. Init a map, NM, to track the weights for each node, for the NEXT ITERATION, where each node start with a weight of 0
  // 3.2. Choose arbitrary starting point as "current node"
  // 3.3. For each node conencted to current node, compute next weight, NW, using the curent node's weight, CW, such that NW += CW / (R/SR)

  // 4. Repeat step 3 until the weights converge

  return currentIteration < iterations ? pageRank(nextWeights, originEntity, getId, getConnectedEntities, iterations, currentIteration + 1) : nextWeights;
}
