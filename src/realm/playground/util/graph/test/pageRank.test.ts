import {pageRank} from '../pageRank';

describe('PageRank alforithm', () => {
  beforeAll(async () => {});

  it('should return correct weighted map after 5 iterations', async () => {
    // expect.assertions(1);

    type Node = {
      name: string;
      rels: string[];
    };

    type Edge = {
      id: string;
      node1: string;
      node2: string;
    } & Attrs;

    type Attrs = {
      attrA: number;
      attrB: number;
    };

    const initialMap: Dict<Attrs> = {
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

    const nodes: Dict<Node> = {
      a: {
        name: 'a',
        rels: ['ab', 'ca', 'da', 'ae'],
      },
      b: {
        name: 'b',
        rels: ['ab', 'bc'],
      },
      c: {
        name: 'c',
        rels: ['bc', 'ca', 'cd'],
      },
      d: {
        name: 'd',
        rels: ['cd', 'da'],
      },
      e: {
        name: 'e',
        rels: ['ae'],
      },
    };
    const allNodes: Node[] = Object.values(nodes);
    const edges: Dict<Edge> = {
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
    const getNodeId = (node: Node) => node.name;
    const getEdges = (node: Node): Edge[] => node.rels.map((relId: string) => edges[relId]);
    const getEdgeAttrs = (edge: Edge) => ({
      attrA: edge.attrA,
      attrB: edge.attrA,
    });
    const getDestinationNode = (node: Node, edge: Edge) => (edge.node1 === getNodeId(node) ? nodes[edge.node2] : nodes[edge.node1]);

    const weightedMap: Dict<Dict<number>> = pageRank(initialMap, allNodes, getNodeId, getEdges, getEdgeAttrs, getDestinationNode, 50);

    console.log('WEIGHTED MAP');
    console.log(weightedMap);

    // expect(weightedMap).toBe(expectedWeightedMap);
  });
});
