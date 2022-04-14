"use strict";
exports.__esModule = true;
var Operations_1 = require("./util/dictionary/Operations");
var pageRank_1 = require("./util/graph/pageRank");
var DictUtil = require("./util/dictionary/Operations");
var nodes1 = {
    a: {
        name: 'a',
        rels: ['ab', 'ca', 'da', 'ae'],
        attrA: 1.5,
        attrB: 1.5
    },
    b: {
        name: 'b',
        rels: ['ab', 'bc'],
        attrA: 1,
        attrB: 1
    },
    c: {
        name: 'c',
        rels: ['bc', 'ca', 'cd'],
        attrA: 1,
        attrB: 1
    },
    d: {
        name: 'd',
        rels: ['cd', 'da'],
        attrA: 1,
        attrB: 1
    },
    e: {
        name: 'e',
        rels: ['ae'],
        attrA: 1,
        attrB: 1
    }
};
var allNodes1 = Object.values(nodes1);
var edges1 = {
    ab: {
        id: 'ab',
        node1: 'a',
        node2: 'b',
        attrA: 0.6,
        attrB: 0.6
    },
    bc: {
        id: 'bx',
        node1: 'b',
        node2: 'c',
        attrA: 0.8,
        attrB: 0.8
    },
    ca: {
        id: 'ca',
        node1: 'c',
        node2: 'a',
        attrA: 1,
        attrB: 1
    },
    cd: {
        id: 'cd',
        node1: 'c',
        node2: 'd',
        attrA: 1.2,
        attrB: 1.2
    },
    da: {
        id: 'da',
        node1: 'd',
        node2: 'a',
        attrA: 1.5,
        attrB: 1.5
    },
    dc: {
        id: 'dc',
        node1: 'd',
        node2: 'c',
        attrA: 2,
        attrB: 2
    },
    ae: {
        id: 'ae',
        node1: 'a',
        node2: 'e',
        attrA: 3,
        attrB: 3
    }
};
var nodes = {
    center: {
        name: 'center',
        rels: ['center1', 'center2', 'center3', 'center4'],
        attrA: 0.1,
        attrB: 0.1
    },
    n1: {
        name: 'n1',
        rels: ['center1'],
        attrA: 100,
        attrB: 100
    },
    n2: {
        name: 'n2',
        rels: ['center2'],
        attrA: 100,
        attrB: 100
    },
    n3: {
        name: 'n3',
        rels: ['center3'],
        attrA: 100,
        attrB: 100
    },
    n4: {
        name: 'n4',
        rels: ['center4'],
        attrA: 100,
        attrB: 100
    }
};
var allNodes = Object.values(nodes);
var edges = {
    center1: {
        id: 'center1',
        node1: 'center',
        node2: 'n1',
        attrA: 0.6,
        attrB: 0.6
    },
    center2: {
        id: 'center2',
        node1: 'center',
        node2: 'n2',
        attrA: 0.8,
        attrB: 0.8
    },
    center3: {
        id: 'center3',
        node1: 'center',
        node2: 'n3',
        attrA: 1,
        attrB: 1
    },
    center4: {
        id: 'center4',
        node1: 'center',
        node2: 'n4',
        attrA: 1.2,
        attrB: 1.2
    }
};
var getNodeId = function (node) { return node.name; };
var getNodeAttrs = function (node) { return DictUtil.copyDictRm(node, ['name', 'rels']); };
var getEdges = function (node) { return node.rels.map(function (relId) { return edges[relId]; }); };
var getEdgeAttrs = function (edge) { return Operations_1.filterDict(edge, function (key, value) { return !['id', 'node1', 'node2'].includes(key); }); };
var getDestinationNode = function (node, edge) { return (edge.node1 === getNodeId(node) ? nodes[edge.node2] : nodes[edge.node1]); };
var ITERATIONS = 50;
var DAMPING_FACTOR = 0.8;
// 1. Get initial map, evenly distributed
var myInitialMap = {
    a: {
        attrA: 1 / 4,
        attrB: 1 / 4
    },
    b: {
        attrA: 1 / 4,
        attrB: 1 / 4
    },
    c: {
        attrA: 1 / 4,
        attrB: 1 / 4
    },
    d: {
        attrA: 1 / 4,
        attrB: 1 / 4
    }
};
var initialMap = pageRank_1.getInitialWeights(allNodes, getNodeId, getNodeAttrs);
console.log('INITIAL MAP');
console.log(initialMap);
var redistributedWeights = pageRank_1.redistributeWeight(initialMap, 0.5, ['a', 'b', 'c']);
console.log('Redistributed weights');
console.log(redistributedWeights);
// expect(redistributedWeights).toMatchSnapshot();
var weightedMap = pageRank_1.pageRank(initialMap, allNodes, getNodeId, getEdges, getEdgeAttrs, getDestinationNode, ITERATIONS, DAMPING_FACTOR);
console.log('WEIGHTED MAP');
console.log(weightedMap);
var initialWeights = {
    a: {
        attrA: 0.125,
        attrB: 0.125
    },
    b: {
        attrA: 0.125,
        attrB: 0.125
    },
    c: {
        attrA: 0.125,
        attrB: 0.125
    },
    d: {
        attrA: 0.125,
        attrB: 0.125
    },
    e: {
        attrA: 0.125,
        attrB: 0.125
    },
    f: {
        attrA: 0.125,
        attrB: 0.125
    },
    g: {
        attrA: 0.1,
        attrB: 0.125
    },
    h: {
        attrA: 0.15,
        attrB: 0.125
    }
};
// expect(weightedMap).toBe(expectedWeightedMap);
