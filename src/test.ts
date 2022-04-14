import {filterDict} from './util/dictionary/Operations';
import {getInitialWeights, pageRank, redistributeWeight} from './util/graph/pageRank';
import * as DictUtil from './util/dictionary/Operations';

type Dict<T> = Record<string, T>;
type TrendNode = {
  id: string;
  edges: string[];
  dailySnapshots: TrendNodeDailySnapshot[];
  // // List of snapshots of the TrendNode's moods in the past
  // dailySnapshots: NodeSnapshots;
} & Dict<number>;
type TrendNodeDailySnapshot = {
  date: Date;
} & Dict<number>;
type TrendEdge = {
  id: string;
  nodes: string[];
} & Dict<number>;

type Node = {
  name: string;
  rels: string[];
} & Attrs;

type Edge = {
  id: string;
  node1: string;
  node2: string;
} & Attrs;

type Attrs = {
  attrA: number;
  attrB: number;
};

const nodes1: Dict<Node> = {
  a: {
    name: 'a',
    rels: ['ab', 'ca', 'da', 'ae'],
    attrA: 1.5,
    attrB: 1.5,
  },
  b: {
    name: 'b',
    rels: ['ab', 'bc'],
    attrA: 1,
    attrB: 1,
  },
  c: {
    name: 'c',
    rels: ['bc', 'ca', 'cd'],
    attrA: 1,
    attrB: 1,
  },
  d: {
    name: 'd',
    rels: ['cd', 'da'],
    attrA: 1,
    attrB: 1,
  },
  e: {
    name: 'e',
    rels: ['ae'],
    attrA: 1,
    attrB: 1,
  },
};

const allNodes1: Node[] = Object.values(nodes1);
const edges1: Dict<Edge> = {
  ab: {
    id: 'ab',
    node1: 'a',
    node2: 'b',
    attrA: 0.6,
    attrB: 0.6,
  },
  bc: {
    id: 'bx',
    node1: 'b',
    node2: 'c',
    attrA: 0.8,
    attrB: 0.8,
  },
  ca: {
    id: 'ca',
    node1: 'c',
    node2: 'a',
    attrA: 1,
    attrB: 1,
  },
  cd: {
    id: 'cd',
    node1: 'c',
    node2: 'd',
    attrA: 1.2,
    attrB: 1.2,
  },
  da: {
    id: 'da',
    node1: 'd',
    node2: 'a',
    attrA: 1.5,
    attrB: 1.5,
  },
  dc: {
    id: 'dc',
    node1: 'd',
    node2: 'c',
    attrA: 2,
    attrB: 2,
  },
  ae: {
    id: 'ae',
    node1: 'a',
    node2: 'e',
    attrA: 3,
    attrB: 3,
  },
};

const nodes: Dict<Node> = {
  center: {
    name: 'center',
    rels: ['center1', 'center2', 'center3', 'center4'],
    attrA: 0.1,
    attrB: 0.1,
  },
  n1: {
    name: 'n1',
    rels: ['center1'],
    attrA: 100,
    attrB: 100,
  },
  n2: {
    name: 'n2',
    rels: ['center2'],
    attrA: 100,
    attrB: 100,
  },
  n3: {
    name: 'n3',
    rels: ['center3'],
    attrA: 100,
    attrB: 100,
  },
  n4: {
    name: 'n4',
    rels: ['center4'],
    attrA: 100,
    attrB: 100,
  },
};

const allNodes: Node[] = Object.values(nodes);
const edges: Dict<Edge> = {
  center1: {
    id: 'center1',
    node1: 'center',
    node2: 'n1',
    attrA: 0.6,
    attrB: 0.6,
  },
  center2: {
    id: 'center2',
    node1: 'center',
    node2: 'n2',
    attrA: 0.8,
    attrB: 0.8,
  },
  center3: {
    id: 'center3',
    node1: 'center',
    node2: 'n3',
    attrA: 1,
    attrB: 1,
  },
  center4: {
    id: 'center4',
    node1: 'center',
    node2: 'n4',
    attrA: 1.2,
    attrB: 1.2,
  },
};
const getNodeId = (node: Node) => node.name;
const getNodeAttrs = (node: Node) => DictUtil.copyDictRm<any>(node, ['name', 'rels']) as Dict<number>;
const getEdges = (node: Node): Edge[] => node.rels.map((relId: string) => edges[relId]);
const getEdgeAttrs = (edge: Edge): Dict<number> => filterDict(edge, (key: string, value: string | number) => !['id', 'node1', 'node2'].includes(key)) as Dict<number>;
const getDestinationNode = (node: Node, edge: Edge) => (edge.node1 === getNodeId(node) ? nodes[edge.node2] : nodes[edge.node1]);
const ITERATIONS: number = 50;
const DAMPING_FACTOR: number = 0.8;

// 1. Get initial map, evenly distributed
const myInitialMap: Dict<Attrs> = {
  a: {
    attrA: 1 / 4,
    attrB: 1 / 4,
  },
  b: {
    attrA: 1 / 4,
    attrB: 1 / 4,
  },
  c: {
    attrA: 1 / 4,
    attrB: 1 / 4,
  },
  d: {
    attrA: 1 / 4,
    attrB: 1 / 4,
  },
};
const initialMap = getInitialWeights(allNodes, getNodeId, getNodeAttrs);
console.log('INITIAL MAP');
console.log(initialMap);

const redistributedWeights = redistributeWeight(initialMap, 0.5, ['a', 'b', 'c']);
console.log('Redistributed weights');
console.log(redistributedWeights);

// expect(redistributedWeights).toMatchSnapshot();

const weightedMap: Dict<Dict<number>> = pageRank(initialMap, allNodes, getNodeId, getEdges, getEdgeAttrs, getDestinationNode, ITERATIONS, DAMPING_FACTOR);

console.log('WEIGHTED MAP');
console.log(weightedMap);

const initialWeights = {
  a: {
    attrA: 0.125,
    attrB: 0.125,
  },
  b: {
    attrA: 0.125,
    attrB: 0.125,
  },
  c: {
    attrA: 0.125,
    attrB: 0.125,
  },
  d: {
    attrA: 0.125,
    attrB: 0.125,
  },
  e: {
    attrA: 0.125,
    attrB: 0.125,
  },
  f: {
    attrA: 0.125,
    attrB: 0.125,
  },
  g: {
    attrA: 0.1,
    attrB: 0.125,
  },
  h: {
    attrA: 0.15,
    attrB: 0.125,
  },
};

// expect(weightedMap).toBe(expectedWeightedMap);
