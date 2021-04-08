import {divide} from 'react-native-reanimated';

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

function pageRank<N, E>(
  initialMap: Dict<Dict<number>>,
  allNodes: N[],
  getNodeId: (node: N) => string,
  getEdges: (node: N) => E[],
  getEdgeAttrs: (edge: E) => Dict<number>,
  getDestinationNode: (node: N, edge: E) => N,
  iterations: number,
  curIteration: number = 0,
): Dict<Dict<number>> {
  let weightMap: Dict<Dict<number>> = {};
  for (const node of allNodes) {
    const nodeId: string = getNodeId(node);

    // 1. Get edges
    const nodeEdges: E[] = getEdges(node);
    const allNodeEdgeAttrs: Dict<number>[] = nodeEdges.map((nodeEdge: E) => getEdgeAttrs(nodeEdge));
    const summedNodeEdgeAttrs: Dict<number> = sumDicts(...allNodeEdgeAttrs);

    for (const nodeEdge of nodeEdges) {
      // 2. Get destination node
      const destinationNode: N = getDestinationNode(node, nodeEdge);
      const destinationId: string = getNodeId(destinationNode);

      // 3. Get weight for each destination node, based on edge attributes
      const edgeAttrs: Dict<number> = getEdgeAttrs(nodeEdge);
      const weightedNodeEdgeAttrs: Dict<number> = divideDicts(edgeAttrs, summedNodeEdgeAttrs);

      const curNodeAttrWeights: Dict<number> = initialMap[nodeId];
      const destinationNodeAddendWeights: Dict<number> = multiplyDicts(curNodeAttrWeights, weightedNodeEdgeAttrs);

      // 3. Add product of weight and current node to destinatio node
      weightMap[destinationId] = sumDicts(weightMap[destinationId], destinationNodeAddendWeights);
    }
  }

  return curIteration < iterations ? pageRank(weightMap, allNodes, getNodeId, getEdges, getEdgeAttrs, getDestinationNode, iterations, curIteration + 1) : weightMap;
}

function getInitialWeights<N, E>(
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
  const summedNodeAttrs: Dict<number> = sumDicts(...allNodeAttrs);

  let weightMap: Dict<Dict<number>> = {};
  for (const node of allNodes) {
    const nodeAttrs: Dict<number> = getNodeAttrs(node);
    const weightedNodeAttrs: Dict<number> = divideDicts(nodeAttrs, summedNodeAttrs);

    // 2. Compute summed edge attributes for each node
    const nodeEdges: E[] = getEdges(node);
    const allNodeEdgeAttrs: Dict<number>[] = nodeEdges.map((nodeEdge: E) => getEdgeAttrs(nodeEdge));
    const summedNodeEdgeAttrs: Dict<number> = sumDicts(...allNodeEdgeAttrs);

    // 3. Get weighted attributes for each edge
    for (const nodeEdge of nodeEdges) {
      const edgeAttrs: Dict<number> = getEdgeAttrs(nodeEdge);

      const destinationNode: N = getDestinationNode(node, nodeEdge);
      const destinationId: string = getNodeId(destinationNode);

      // 4. Add weighted attributes to weightedMap
      const weightedNodeEdgeAttrs: Dict<number> = divideDicts(edgeAttrs, summedNodeEdgeAttrs);
      weightMap[destinationId] = multiplyDicts(weightedNodeAttrs, weightedNodeEdgeAttrs);
    }
  }

  return weightMap;
}

/**
 * "Add up" an array of Dictionaries to get the sum of each key in an array of Dictionaries
 *
 * @param dicts Array of Dictionaries attributes to be summed up into a single Dictionary
 */
function sumDicts(...dicts: Dict<number>[]): Dict<number> {
  const summedDict: Dict<number> = {};

  for (const dict of dicts) {
    for (const key in dict) {
      if (!summedDict.hasOwnProperty(key)) summedDict[key] = 0;

      const addend = dict[key];
      summedDict[key] += addend;
    }
  }

  return summedDict;
}

/**
 * "Add up" an array of Dictionaries, then apply some averaging function to each key to get the (potentially weighted) "average" of each key in an array of Dictionaries
 *
 * @param dicts Array of Dictionaries attributes to be averaged up into a single Dictionary
 */
function avgDicts(getAvg: (sum: number, count: number) => number, ...dicts: Dict<number>[]): Dict<number> {
  const summedDict: Dict<number> = {};
  const occurenceDict: Dict<number> = {};

  for (const dict of dicts) {
    for (const key in dict) {
      if (!summedDict.hasOwnProperty(key)) {
        summedDict[key] = 0;
        occurenceDict[key] = 0;
      }

      const addend = dict[key];
      summedDict[key] += addend;
      occurenceDict[key]++;
    }
  }

  const avgedDict: Dict<number> = {};
  for (const key in summedDict) {
    const sum = summedDict[key];
    const count = occurenceDict[key];

    avgedDict[key] = getAvg(sum, count);
  }

  return avgedDict;
}

function divideDicts(a: Dict<number>, b: Dict<number>): Dict<number> {
  const keysToDivideOn: string[] = getIntersectingDictKeys(a, b);
  const dividedDict: Dict<number> = {};

  for (const key of keysToDivideOn) {
    dividedDict[key] = a[key] / b[key];
  }

  return dividedDict;
}

function multiplyDicts(a: Dict<number>, b: Dict<number>): Dict<number> {
  const keysToDivideOn: string[] = getIntersectingDictKeys(a, b);
  const multipliedDict: Dict<number> = {};

  for (const key of keysToDivideOn) {
    multipliedDict[key] = a[key] * b[key];
  }

  return multipliedDict;
}

/**
 * Given n dicts, get the keys that are present in all n dicts
 *
 * @param dicts
 */
function getIntersectingDictKeys(...dicts: Dict<any>[]): string[] {
  const totalDicts: number = dicts.length;
  const keyCounter: Dict<number> = {};

  for (const dict of dicts) {
    for (const key in dict) {
      if (!keyCounter.hasOwnProperty(key)) keyCounter[key] = 0;
      keyCounter[key]++;
    }
  }

  const intersectingKeys: string[] = [];
  for (const key in keyCounter) {
    const count = keyCounter[key];
    if (count === totalDicts) intersectingKeys.push(key);
  }

  return intersectingKeys;
}
