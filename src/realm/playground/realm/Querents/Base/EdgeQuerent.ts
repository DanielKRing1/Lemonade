//@ts-ignore
import Heap from "heap";
//@ts-ignore
import { Override } from "../../Base";

//@ts-ignore
import { InstantiateAbstractError } from "../../Errors";
import Querent from "./Querent";
//@ts-ignore
import Realm from "realm";

type Dict<T> = Record<string, T>;

type Node = {
  name: string;
  edges: string[];
};

type Edge = {
  name: string;
  nodes: string[];
};

export default class EdgeQuerent extends Querent<Edge> {
  static sortNamePair(n1: string, n2: string): string[] {
    return [n1, n2].sort((a, b) => (a < b ? -1 : 1));
  }
  static getEdgeId(n1: string, n2: string): string {
    //@ts-ignore
    return this.constructor.sortNamePair(n1, n2).join("-");
  }

  constructor(realmPath: string, schemaName: string) {
    super(realmPath, schemaName);

    if (this.constructor === EdgeQuerent)
      throw InstantiateAbstractError({ className: "EdgeQuerent" });
  }

  // CREATORS

  /**
   * Create an Edge in the Realm database that is linked to Nodes 1 and 2
   *
   * @param realm
   * @param nodeId1
   * @param nodeId2
   */
  @Override("Querent")
  //@ts-ignore
  public create(
    realm: Realm,
    nodeId1: string,
    nodeId2: string,
    properties: Dict<any> = {}
  ): Realm.Results<Edge> | undefined {
    const edgeId: string = EdgeQuerent.getEdgeId(nodeId1, nodeId2);

    const edge: Edge = {
      name: edgeId,
      nodes: [nodeId1, nodeId2],
      ...properties,
    };

    const realmEdge = this._create(realm, edge);
    return realmEdge;
  }

  // GETTERS

  /**
   * Get Edge row from Realm database
   *
   * @param realm
   * @param nodeId1
   * @param nodeId2
   */
  @Override('Querent');
  public get(
    realm: Realm,
    create: boolean,
    nodeId1: string,
    nodeId2: string
  ): Realm.Results<Edge> {
    const edgeId = EdgeQuerent.getEdgeId(nodeId1, nodeId2);
    let edge = this.getById(realm, edgeId) as Realm.Results<Edge>;

    // Optionally create if does not exist
    if (create && edge === undefined)
      edge = this.create(realm, nodeId1, nodeId2);

    return edge;
  }

  // public getByNodes(
  //   realm: Realm,
  //   node1: Realm.Results<Node>,
  //   node2: Realm.Results<Node>,
  //   create: boolean
  // ): Realm.Results<Edge> | undefined {
  //   return this.getByNodeIds(realm, node1.name, node2.name, create);
  // }

  // TODO Check if this works
  /**
   * Get all edges that connect to the given node id
   *
   * @param realm
   * @param nodeId
   */
  public getConnectedEdges(realm: Realm, nodeId: string): Realm.Results<Edge> {
    return this.getAll(realm).filtered(`"${nodeId}" IN nodes`);
  }

  /**
   * Get (or optionally create) edges between all nodes in a set of nodes
   *
   * @param realm
   * @param nodes
   * @param create
   */
  protected getDenseEdgeCombos(
    realm: Realm,
    nodeIds: string[],
    weights: number[],
    create: boolean = false
  ): EntityWeight<Edge>[] {
    const connectingEdges: EntityWeight<Edge>[] = [];

    // 1. For each Node
    for (let i = 0; i < nodeIds.length; i++) {
      const nodeId1: string = nodeIds[i];

      // 2. Get the edge connecting it to each other Node
      for (let j = 0; j < nodeIds.length; j++) {
        const nodeId2: string = nodeIds[j];

        // 3. For each pair of distinct Nodes
        if (nodeId1 === nodeId2) continue;

        // 4. Create edge if does not exist
        const edge: Realm.Result<Edge> = this.get(realm, create, nodeId1, nodeId2);
        
        // 5. Avg the Nodes' weights into a single weight for the Edge
        const weight: number = (weights[i] + weights[j]) / 2;

        // 6. Add the Edge and its avg'd weight
        connectingEdges.push({ entity: edge, weight });
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
  protected getSeqEdgeCombos(
    realm: Realm,
    nodeIds: string[],
    weights: number[],
    create: boolean = false
  ): EntityWeight<Edge>[] {
    const connectingEdges: EntityWeight<Edge>[] = [];

    // 1. For each subsequent pair of Nodes
    for (let i = 0; i < nodeIds.length - 1; i++) {
      const nodeId1: string = nodeIds[i];
      const nodeId2: string = nodeIds[i + 1];

      // 2. For each pair of distinct Nodes
      if (nodeId1 === nodeId2) continue;

      // 3. Create edge if does not exist
      const edge: Realm.Result<Edge> = this.get(realm, create, nodeId1, nodeId2);

      // 4. Avg the Nodes' weights into a single weight for the Edge
      const weight: number = (weights[i] + weights[i + 1]) / 2;

      // 5. Add the Edge and its avg'd weight
      connectingEdges.push({ entity: edge, weight });
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
  @Override('Querent');
  protected _rate(
    mood: string,
    rating: number,
    weight: number,
    edge: Realm.Result<Edge> & Edge
  ): number {

    // 1. Compute weighted rating to add
    const weightedRating: number = rating * weight;

    // 2. Get relevant keys
    const moodRatingKey: string = `${mood}`;
    const totalMoodRatingsCountKey: string = `${mood}_count`;
    // const totalRatingsCountKey: string = `total_ratings`;

    // 3. Compute new mood rating value
    const prevMoodRating: number = edge[moodRatingKey]!;
    const totalMoodRatingsCount: number = edge[totalMoodRatingsCountKey];
    const newMoodRating: number =
      (prevMoodRating * totalMoodRatingsCount + weightedRating) /
      (totalMoodRatingsCount + weight);

    // 4. Update mood values in Realm
    edge[moodRatingKey] = newMoodRating;
    edge[totalMoodRatingsCountKey] += weight;

    return newMoodRating;
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
