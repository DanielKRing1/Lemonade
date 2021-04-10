import {current} from '@reduxjs/toolkit';
import * as DictUtil from '../dictionary/Operations';

type ConnectedNode<N> = {
  node: N;
  distance: number;
};

type ConnectedEdge<E> = {
  edge: E;
  distance: number;
};

// function pageRank<N, E>(
//   initialWeights: Dict<number>,
//   allNodes: N[],
//   getId: (node: N) => string,
//   getConnectedNodes: (node: N) => ConnectedNode<N>[],
//   iterations: number,
//   currentIteration: number = 0,
// ): Dict<number> {
//   const nextWeights: Dict<number> = {};

//   // 1. Compute sum of all scores for each node, N, (for each attribute), SN

//   // 2.1. Init a map, M, to track weights for each node, where each node starts with a weight of W, where W is computed as follows:
//   // 2.1. Compute sum of all scores for each relationship, R, of current node (for each attribute), SR
//   // 2.2. Choose arbitrary starting point as "current node"
//   // 2.3. For each node connected to current node, compute weight, W = (R/SR) * (N/SN)
//   // 2.4. Add W to the initial map, M

//   // 3.1. Init a map, NM, to track the weights for each node, for the NEXT ITERATION, where each node start with a weight of 0
//   // 3.2. Choose arbitrary starting point as "current node"
//   // 3.3. For each node conencted to current node, compute next weight, NW, using the curent node's weight, CW, such that NW += CW / (R/SR)

//   // 4. Repeat step 3 until the weights converge

//   return currentIteration < iterations ? pageRank(nextWeights, allNodes, getId, getConnectedNodes, iterations, currentIteration + 1) : nextWeights;
// }

export function pageRank<N, E>(
  initialMap: Dict<Dict<number>>,
  allNodes: N[],
  getNodeId: (node: N) => string,
  getEdges: (node: N) => E[],
  getEdgeAttrs: (edge: E) => Dict<number>,
  getDestinationNode: (node: N, edge: E) => N,
  iterations: number,
  curIteration: number = 0,
): Dict<Dict<number>> {
  console.log(`Iteration ${curIteration}`);
  console.log(initialMap);
  let weightMap: Dict<Dict<number>> = {};
  for (const node of allNodes) {
    const nodeId: string = getNodeId(node);

    // 1. Get edges
    const nodeEdges: E[] = getEdges(node);
    const allNodeEdgeAttrs: Dict<number>[] = nodeEdges.map((nodeEdge: E) => {
      //   console.log('heeee');
      //   console.log(nodeEdges);
      return getEdgeAttrs(nodeEdge);
    });
    const summedNodeEdgeAttrs: Dict<number> = DictUtil.sumDicts(...allNodeEdgeAttrs);

    for (const nodeEdge of nodeEdges) {
      // 2. Get each edge's destination node
      const destinationNode: N = getDestinationNode(node, nodeEdge);
      const destinationId: string = getNodeId(destinationNode);

      // 3. Get weight for each destination node, based its edge's attributes (sum of weights for all destination nodes should = 1)
      const edgeAttrs: Dict<number> = getEdgeAttrs(nodeEdge);
      const weightedNodeEdgeAttrs: Dict<number> = DictUtil.divideDicts(edgeAttrs, summedNodeEdgeAttrs);

      const curNodeAttrWeights: Dict<number> = initialMap[nodeId];
      const destinationNodeAddendWeights: Dict<number> = DictUtil.multiplyDicts(curNodeAttrWeights, weightedNodeEdgeAttrs);

      // 3. Add product of edge weight and current node weight to destination node
      //   console.log(`Destination id: ${destinationId}`);
      weightMap[destinationId] = DictUtil.sumDicts(weightMap[destinationId], destinationNodeAddendWeights);
    }
  }

  return curIteration < iterations ? pageRank(weightMap, allNodes, getNodeId, getEdges, getEdgeAttrs, getDestinationNode, iterations, curIteration + 1) : weightMap;
}

export function getInitialWeights<N, E>(
  allNodes: N[],
  getNodeId: (node: N) => string,
  getNodeAttrs: (node: N) => Dict<number>,
  getEdges: (node: N) => E[],
  getEdgeAttrs: (edge: E) => Dict<number>,
  getDestinationNode: (node: N, edge: E) => N,
): Dict<Dict<number>> {
  // 1. Compute total summed node attributes
  const allNodeAttrs: Dict<number>[] = [];
  for (const node of allNodes) {
    const nodeAttrs: Dict<number> = getNodeAttrs(node);
    allNodeAttrs.push(nodeAttrs);
  }
  const summedNodeAttrs: Dict<number> = DictUtil.sumDicts(...allNodeAttrs);

  let weightMap: Dict<Dict<number>> = {};
  for (const node of allNodes) {
    const nodeAttrs: Dict<number> = getNodeAttrs(node);
    const weightedNodeAttrs: Dict<number> = DictUtil.divideDicts(nodeAttrs, summedNodeAttrs);

    // 2. Compute summed edge attributes for each node
    const nodeEdges: E[] = getEdges(node);
    const allNodeEdgeAttrs: Dict<number>[] = nodeEdges.map((nodeEdge: E) => getEdgeAttrs(nodeEdge));
    const summedNodeEdgeAttrs: Dict<number> = DictUtil.sumDicts(...allNodeEdgeAttrs);

    // 3. Get weighted attributes for each edge
    for (const nodeEdge of nodeEdges) {
      const edgeAttrs: Dict<number> = getEdgeAttrs(nodeEdge);

      const destinationNode: N = getDestinationNode(node, nodeEdge);
      const destinationId: string = getNodeId(destinationNode);

      // 4. Add weighted attributes to weightedMap
      const weightedNodeEdgeAttrs: Dict<number> = DictUtil.divideDicts(edgeAttrs, summedNodeEdgeAttrs);
      weightMap[destinationId] = DictUtil.multiplyDicts(weightedNodeAttrs, weightedNodeEdgeAttrs);
    }
  }

  return weightMap;
}

export function redistributeWeight(initialWeights: Dict<Dict<number>>, targetCentralWeight: number, keysToRedistributeTo: string[]) {
  // 1. Get "central" weights (in keysToRedistributeTo)
  const centralWeights: Dict<Dict<number>> = DictUtil.filterDict<Dict<number>>(initialWeights, (key: string, value: Dict<number>) => keysToRedistributeTo.includes(key));
  const centralNodeCount = Object.keys(centralWeights).length;
  console.log(1);
  console.log(centralWeights);

  // 2. Get "other" weights (not in keysToRedistributeTo)
  const otherWeights: Dict<Dict<number>> = DictUtil.filterDict<Dict<number>>(initialWeights, (key: string, value: Dict<number>) => !keysToRedistributeTo.includes(key));
  const otherNodeCount = Object.keys(otherWeights).length;
  console.log(2);
  console.log(otherWeights);

  // 3. Sum "central" weights and determine what percentage of weight to redistribute to these central nodes
  const summedCentralWeights: Dict<number> = DictUtil.sumDicts(...Object.values(centralWeights));
  console.log('3.1. Central weights');
  console.log(summedCentralWeights);
  const missingWeight: Dict<number> = DictUtil.subScalarDict(targetCentralWeight, summedCentralWeights);
  console.log('3.2. Missing weights');
  console.log(missingWeight);
  const weightToRedistribute: Dict<number> = DictUtil.mutateDict<number>(missingWeight, (key: string, value: number) => Math.max(0, value));
  console.log('3.3. Weight to Redistribute');
  console.log(weightToRedistribute);

  // 4. Subtract out this percentage from each of the "other" weights
  const dehydratedOtherWeights: Dict<Dict<number>> = DictUtil.mutateDict<Dict<number>>(otherWeights, (key: string, nestedDict: Dict<number>) => {
    const dehydratedWeights: Dict<number> = {};

    for (const nestedKey in nestedDict) {
      const value: number = nestedDict[nestedKey];
      // The weight to redistribute is equally redistributed among "other" nodes
      const totalWeightToRedistribute = weightToRedistribute[nestedKey];
      const owedPercentage = 1 / otherNodeCount;
      const owedWeight = totalWeightToRedistribute * owedPercentage;

      dehydratedWeights[nestedKey] = value - owedWeight;
    }

    return dehydratedWeights;
  });
  console.log(4);
  console.log(dehydratedOtherWeights);

  // 5. Add in this percentage to the "central" weights
  console.log('ONLY LOOK HERE---------------------------------');
  const hydratedCentralWeights: Dict<Dict<number>> = DictUtil.mutateDict<Dict<number>>(centralWeights, (key: string, nestedDict: Dict<number>) => {
    const hydratedWeights: Dict<number> = {};

    for (const nestedKey in nestedDict) {
      console.log(nestedKey);
      console.log(key);
      console.log(weightToRedistribute[nestedKey]);
      const value = nestedDict[nestedKey];
      console.log(value);
      console.log(summedCentralWeights);

      const totalWeightToRedistribute = weightToRedistribute[nestedKey];
      const earnedPercentage = value / summedCentralWeights[nestedKey];
      // The weight to redistribute is not equally redistributed among "central" nodes: Central nodes with higher starting weight get a larger cut
      const earnedWeight = totalWeightToRedistribute * earnedPercentage;
      console.log(earnedWeight);

      hydratedWeights[nestedKey] = value + earnedWeight;
    }

    return hydratedWeights;
  });
  console.log('ONLY LOOK THERE^^^^---------------------------------');

  console.log(5);
  console.log(hydratedCentralWeights);

  return {
    ...dehydratedOtherWeights,
    ...hydratedCentralWeights,
  };
}
