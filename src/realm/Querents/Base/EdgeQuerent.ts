//@ts-ignore
import Heap from "heap";
//@ts-ignore
import { Override } from "../../Base";

//@ts-ignore
import { InstantiateAbstractError, NotImplementedError } from "../../Errors";
import Querent from "./Querent";
//@ts-ignore
import Realm from "../Realm";

type Dict<T> = Record<string, T>;

type Node = {
  name: string;
  edges: Edge[];
};

type Edge = {
  name: string;
  nodes: Node[];
};

export default class EdgeQuerent extends Querent<Edge> {
  private propertySuffix: string;

  static sortNamePair(n1: string, n2: string): string[] {
    return [n1, n2].sort((a, b) => (a < b ? -1 : 1));
  }
  static getEdgeId(n1: string, n2: string): string {
    //@ts-ignore
    return this.constructor.sortNamePair(n1, n2).join("-");
  }

  constructor(realmPath: string, schemaName: string, propertySuffix: string) {
    super(realmPath, schemaName);

    this.propertySuffix = propertySuffix;

    if (this.constructor === EdgeQuerent)
      throw InstantiateAbstractError({ className: "EdgeQuerent" });
  }

  // CREATORS

  /**
   * Create an Edge in the Realm database that is linked to Nodes 1 and 2
   *
   * @param realm
   * @param node1
   * @param node2
   */
  @Override("Querent")
  //@ts-ignore
  public create(
    realm: Realm,
    node1: Realm.Object & Node,
    node2: Realm.Object & Node
  ): Realm.Results<Edge> | undefined {
    const edgeId: string = EdgeQuerent.getEdgeId(node1.name, node2.name);

    const edge: Edge = {
      name: edgeId,
      nodes: [node1, node2],
    };

    const realmEdge = this._create(realm, edge);
    return realmEdge;
  }

  // GETTERS

  /**
   * Get Edge row from Realm database
   *
   * @param realm
   * @param nodeName1
   * @param nodeName2
   */
  public getByNodeIds(
    realm: Realm,
    nodeName1: string,
    nodeName2: string
  ): Realm.Results<Edge> {
    const id = EdgeQuerent.getEdgeId(nodeName1, nodeName2);
    return this.getById(realm, id) as Realm.Results<Edge>;
  }

  public getByNodes(
    realm: Realm,
    node1: Realm.Results<Node>,
    node2: Realm.Results<Node>,
    create: boolean
  ): Realm.Results<Edge> | undefined {
    let edge = this.getByNodeIds(realm, node1.name, node2.name);
    if (create && edge === undefined) edge = this.create(realm, node1, node2);

    return edge;
  }

  // TODO Check if this works
  /**
   * Get all edges that connect to the given node id
   *
   * @param realm
   * @param nodeId
   */
  getNodeEdges(realm: Realm, nodeId: string): Realm.Results<Edge> {
    return this.getAll(realm).filtered(`"${nodeId}" == nodes.name`);
  }

  /**
   * Get (or optionally create) edges between all nodes in a set of nodes
   *
   * @param realm
   * @param nodes
   * @param create
   */
  getDenseEdgeCombos(
    realm: Realm,
    nodes: (Realm.Object & Node)[],
    weights: number[],
    create: boolean = false
  ): {
    entity: Realm.Results<Edge>;
    weight: number;
  }[] {
    const connectingEdges: {
      entity: Realm.Results<Edge>;
      weight: number;
    }[] = [];

    for (let i = 0; i < nodes.length; i++) {
      const n1: Realm.Object & Node = nodes[i];

      for (let j = 0; j < nodes.length; j++) {
        const n2: Realm.Object & Node = nodes[j];

        if (n1.name === n2.name) continue;

        const edge: Realm.Results<Edge> = this.getByNodes(
          realm,
          n1,
          n2,
          create
        );
        const weight: number = (weights[i] + weights[j]) / 2;

        if (edge !== undefined) connectingEdges.push({ entity: edge, weight });
      }
    }

    return connectingEdges;
  }

  /**
   * Get (or optionally create) edges between each sequential pair of nodes in a set of nodes
   *
   * @param realm
   * @param nodes
   * @param create
   */
  getSeqEdgeCombos(
    realm: Realm,
    nodes: (Realm.Object & Node)[],
    create: boolean = false
  ): Realm.Results<Edge>[] {
    const connectingEdges: Realm.Results<Edge>[] = [];

    for (let i = 0; i < nodes.length - 1; i++) {
      const n1: Realm.Object & Node = nodes[i];
      const n2: Realm.Object & Node = nodes[i + 1];

      if (n1.name === n2.name) continue;

      const edge: Realm.Results<Edge> = this.getByNodes(realm, n1, n2, create);
      if (edge !== undefined) connectingEdges.push(edge);
    }

    return connectingEdges;
  }

  // Stock example:
  //    rating = % of stake compared to total of all investments
  //    weight = 1
  //
  // Base Querent's rate method:
  // Accept single rating number or an array of ratings (for each entity)
  // Accept no weight (then use 1/# entities) or an array of weights
  // Accept rating option:
  //    Uniform, then rating = single rating
  //    Unique (Array), then rating = rating1 + rating2
  // In Base Querent, map entities to:
  // [
  //    {
  //        entity: string,
  //        rating: number,
  //        weight: number,
  //    }
  // ]
  // This _rate method accepts this ^ Entity type and rating options:
  //    Uniform, then rating = rating1 + rating2 / 2
  //    Unique (Array), then rating = rating1 + rating2
  protected _rate(
    mood: string,
    rating: number,
    weight: number,
    edge: Realm.Object & Realm.Results<Edge>
  ): number {
    // TODO Call getCombos and execute rating process on each returned Edge
    // const edge: Realm.Object & Realm.Results<Edge> = this.getByNodes(
    //   realm,
    //   node1,
    //   node2,
    //   true
    // );
    // 1. Compute weighted rating to add
    const weightedRating: number = rating * weight;

    // 2. Get mood keys
    const avgRatingKey: string = `${mood}`;
    const totalCountKey: string = `${mood}_count`;

    // 3. Compute new mood rating value
    const prevRating: number = edge[avgRatingKey]!;
    const newRating: number =
      (prevRating * edge.totalRatings + weightedRating) /
      (edge.totalRatings + weight);

    // 4. Update mood values in Realm
    edge[avgRatingKey] = newRating;
    edge[totalCountKey] += weight;

    return newRating;
  }

  // update(entities: Array<string>, mood: string, rating: number) {
  //   throw new NotImplementedError('RelQuerent.update');
  // }

  // Trend Algos

  /**
   * Branch out to n most [Category] Entities
   * The Most Reflective Entities are ones who's branches reflect back to themselves most often
   *
   * @param startId Which Entity id to start branching from
   * @param branchCount Number of times to branhch out from each Entity (More will take longer to compute; also, branches out in ascending order)
   *
   */
  getMostReflectiveEntities = (
    realm: Realm,
    startId: string,
    mood: string,
    branchCount: number
  ): Array<string> => {
    const reflectivityMap: Record<string, number> = {
      [startId]: 1,
    };

    const run = (startId: string) => {
      const allRel: Realm.Results<AnyRel> = this.getByEntityId(realm, startId);

      const heap = new Heap((a: AnyRel, b: AnyRel) => {
        if (a !== undefined && b !== undefined) return a[mood] - b[mood];
        else return a === undefined ? 1 : -1;
      });

      allRel.forEach((rel) => heap.push(rel));

      const closestRels = [];
      for (let i = 0; i < branchCount; i++) {
        if (heap.empty()) break;

        const nextClosest = heap.pop();
        closestRels.push(nextClosest);
      }

      // console.log('closest relationships')
      // console.log(closestRels)

      for (let closestRel of closestRels) {
        const otherEntityId =
          startId !== closestRel.entity1.id
            ? closestRel.entity1.id
            : closestRel.entity2.id;

        if (!reflectivityMap[otherEntityId]) {
          reflectivityMap[otherEntityId] = 1;
          run(otherEntityId);
        } else reflectivityMap[otherEntityId]++;
      }
    };
    run(startId);

    type IdCountType = {
      id: string;
      count: number;
    };
    const reflectivityMaxHeap = new Heap(
      (a: IdCountType, b: IdCountType) => b.count - a.count
    );
    for (let id in reflectivityMap) {
      const count = reflectivityMap[id];
      const idCount: IdCountType = {
        id,
        count,
      };

      reflectivityMaxHeap.push(idCount);
    }

    return reflectivityMaxHeap.toArray().map((el) => el.id);
  };

  // DEPRECATED BY getSCEntities of depth 1
  getMostCorrelatedEntities = (
    realm: Realm,
    startId: string,
    mood: Mood,
    branchCount: number,
    entityCount: number
  ): Array<string> => {
    const mostCorrelatedEntities = new Set([startId]);

    const run = () => {
      if (mostCorrelatedEntities.size < entityCount) return;

      const heap = new Heap((a: AnyRel, b: AnyRel) => {
        if (a !== undefined && b !== undefined) return a[mood] - b[mood];
        else return a === undefined ? 1 : -1;
      });

      const entityMap: Record<string, RealmRow> = {};
      mostCorrelatedEntities.forEach((id) => {
        const allRel: Realm.Results<AnyRel> = this.getByEntityId(realm, id);

        allRel.forEach((rel) => {
          const { entity1, entity2 } = rel;

          if (mostCorrelatedEntities.size === 1) {
            entityMap[entity1.id] = {
              ...entity1,
              count: 1,
            };
            entityMap[entity2.id] = {
              ...entity2,
              count: 1,
            };
          } else {
            if (entityMap[entity1.id]) {
              entityMap[entity1.id][mood] += entity1[mood];
              entityMap[entity1.id].counter++;
            }

            if (entityMap[entity2.id]) {
              entityMap[entity2.id][mood] += entity2[mood];
              entityMap[entity2.id].counter++;
            }
          }
        });
      });

      const correlatedEntities = Object.entries(entityMap)
        .filter(
          ([entityId, entity]) => entity.counter === mostCorrelatedEntities.size
        )
        .map(([entityId, entity]) => entity);

      correlatedEntities.forEach((rel) => heap.push(rel));

      while (!heap.empty() && mostCorrelatedEntities.size < entityCount) {
        const closestRel = heap.pop();
        const closestEntityId =
          startId !== closestRel.entity1.id
            ? closestRel.entity1.id
            : closestRel.entity2.id;

        if (!mostCorrelatedEntities.has(closestEntityId)) {
          mostCorrelatedEntities.add(closestEntityId);
          run();
        }
      }
    };

    run();

    return Array.from(mostCorrelatedEntities);
  };

  getMaximizedEntitiesAlongPath = (
    realm: Realm,
    startId: string,
    mood: Mood,
    branchCount: number,
    depth: number
  ): Array<string> => {
    const maximizedEntities = new Set([startId]);

    const run = (startId: string, curDepth = 0) => {
      if (curDepth >= depth) return;

      // All connected entities
      const allRel: Realm.Results<AnyRel> = this.getByEntityId(realm, startId);

      const heap = new Heap((a: AnyRel, b: AnyRel) => {
        if (a !== undefined && b !== undefined) return a[mood] - b[mood];
        else return a === undefined ? 1 : -1;
      });

      allRel.forEach((rel) => heap.push(rel));

      // Closest
      let curBranchCount = 0;
      while (!heap.empty() && curBranchCount < branchCount) {
        const closestRel = heap.pop();
        const closestEntityId =
          startId !== closestRel.entity1.id
            ? closestRel.entity1.id
            : closestRel.entity2.id;

        if (!maximizedEntities.has(closestEntityId)) {
          curBranchCount++;
          maximizedEntities.add(closestEntityId);
          run(closestEntityId, curDepth + 1);
        }
      }
    };

    run(startId);

    return Array.from(maximizedEntities);
  };

  getSCEntity(
    realm: Realm,
    startId: string,
    mood: Mood,
    branchCount: number,
    depth: number
  ) {
    type Path = Array<string>;
    type Paths = Array<Path>;
    const scEntityIds: Record<string, Paths> = {};

    const run = (nextId: string, path: Array<string> = []) => {
      if (path.length >= depth) return;

      // All connected entities
      const heap = initHeap(mood);
      const allRel: Realm.Results<AnyRel> = this.getByEntityId(realm, nextId);
      allRel.forEach((rel) => heap.push(rel));

      let curBranchCount = 0;
      while (!heap.empty() && curBranchCount < branchCount) {
        curBranchCount++;

        const closestRel = heap.pop();
        const closestEntityId =
          nextId !== closestRel.entity1.id
            ? closestRel.entity1.id
            : closestRel.entity2.id;

        if (!scEntityIds.hasOwnProperty(closestEntityId)) {
          scEntityIds[closestEntityId] = [path];
          run(closestEntityId, [...path, closestEntityId]);
        } else {
          // Break, do not repeat (rest of path already taken if in scEntityIds map)
          scEntityIds[closestEntityId].push(path);
          return;
        }
      }
    };

    run(startId);

    type EntityPath = {
      id: string;
      paths: Paths;
    };
    const maxHeap = new Heap(
      (a: EntityPath, b: EntityPath) => b.paths.length - a.paths.length
    );
    Object.entries(scEntityIds).forEach(([entityId, pathsToEntity]) =>
      maxHeap.push({
        id: entityId,
        paths: pathsToEntity,
      })
    );

    return maxHeap.toArray();
  }

  getMostRelevantEntity(
    realm: Realm,
    startId: string,
    mood: Mood,
    branchCount: number = 1
  ) {
    this.getSCEntity(realm, startId, mood, branchCount, 1);
  }
}

const initHeap = (mood: string) => {
  const heap = new Heap((a: AnyRel, b: AnyRel) => {
    if (a !== undefined && b !== undefined) return a[mood] - b[mood];
    else return a === undefined ? 1 : -1;
  });

  return heap;
};
