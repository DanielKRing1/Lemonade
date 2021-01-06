import Heap from 'heap';

import RealmSchema from '../schemaNames';

import {InstantiateAbstractClassError, NotImplementedError} from '../../Errors';
import Querent from './Querent';

export default class RelQuerent extends Querent {
  static sortNamePair(n1: string, n2: string): string[] {
    return [n1, n2].sort((a, b) => (a < b ? -1 : 1));
  }
  static getRelId(a1: string, a2: string): string {
    return this.constructor.sortNamePair(a1, a2).join('-');
  }

  constructor(schema: RealmSchema | string) {
    super(schema);

    if (this.constructor === RelQuerent) throw new InstantiateAbstractClassError('RelQuerent');
  }

  get(realm: Realm, a1: string, a2: string): RelationshipType<any> {
    const id = RelQuerent.getRelId(a1, a2);
    return this.getById(realm, id) as RelationshipType<any>;
  }
  getOrCreateCombos = (realm: Realm, entityNames: string[]): RelationshipType<any>[] => {
    const allRels = [];

    for (let n1 of entityNames) {
      for (let n2 of entityNames) {
        if (n1 === n2) continue;

        const rel = this.getOrCreate(realm, n1, n2);
        allRels.push(rel);
      }
    }

    return allRels;
  };
  getCombos(realm: Realm, entities: string[]): RelationshipType<any>[] {
    const allRels = [];

    for (let e1 of entities) {
      for (let e2 of entities) {
        if (e1 === e2) continue;

        const rel = this.get(realm, e1, e2);
        allRels.push(rel);
      }
    }

    return allRels;
  }

  getByEntityId(realm: Realm, id: string): Realm.Results<Realm.Object> {
    return realm.objects(this.schema).filtered(`entity1.id = "${id}" OR entity2.id = "${id}"`);
  }

  // create(n1: string, n2: string): AnyRel {
  //   throw new NotImplementedError('RelQuerent.create');
  // }
  create(realm: Realm, e1: string, e2: string): RelationshipType<any> {
    const [entityName1, entityName2] = RelQuerent.sortNamePair(e1, e2);
    const id = RelQuerent.getRelId(realm, e1, e2);

    const relObj: RelationshipType<any> = {
      id,
      entity1: {
        id: entityName1,
      },
      entity2: {
        id: entityName2,
      },
      totalRatings: 0,
    };

    const realmRel = this._create(realm, relObj);

    return realmRel as RelationshipType<any>;
  }

  getOrCreate(realm: Realm, n1: string, n2: string): AnyRel {
    let rel = this.get(realm, n1, n2);
    if (rel === undefined) rel = this.create(realm, n1, n2);

    return rel;
  }

  rate(realm: Realm, e1: string, e2: string, mood: string, rating: number, weight: number) {
    const rel = this.getOrCreate(realm, e1, e2);

    const weightedRating = rating * weight;
    const prevRating = rel[mood]!;
    const newRating = (prevRating * rel.totalRatings + weightedRating) / (rel.totalRatings + weight);

    rel[mood] = newRating;
    rel.totalRatings += weight;

    return newRating;
  }

  // update(entities: Array<string>, mood: string, rating: number) {
  //   throw new NotImplementedError('RelQuerent.update');
  // }

  update(realm: Realm, entities: Array<string>, mood: string, rating: number, other: Object = {}) {
    for (let i = 0; i < entities.length - 2; i++) {
      const entity1 = entities[i];
      for (let j = i + 1; j < entities.length - 1; j++) {
        const entity2 = entities[j];
        this.rate(realm, entity1, entity2, mood, rating, 1 / entities.length);
      }
    }
  }

  // Trend Algos

  /**
   * Branch out to n most [Category] Entities
   * The Most Reflective Entities are ones who's branches reflect back to themselves most often
   *
   * @param startId Which Entity id to start branching from
   * @param branchCount Number of times to branhch out from each Entity (More will take longer to compute; also, branches out in ascending order)
   *
   */
  getMostReflectiveEntities = (realm: Realm, startId: string, mood: Mood, branchCount: number): Array<string> => {
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
        const otherEntityId = startId !== closestRel.entity1.id ? closestRel.entity1.id : closestRel.entity2.id;

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
    const reflectivityMaxHeap = new Heap((a: IdCountType, b: IdCountType) => b.count - a.count);
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
  getMostCorrelatedEntities = (realm: Realm, startId: string, mood: Mood, branchCount: number, entityCount: number): Array<string> => {
    const mostCorrelatedEntities = new Set([startId]);

    const run = () => {
      if (mostCorrelatedEntities.size < entityCount) return;

      const heap = new Heap((a: AnyRel, b: AnyRel) => {
        if (a !== undefined && b !== undefined) return a[mood] - b[mood];
        else return a === undefined ? 1 : -1;
      });

      const entityMap: Record<string, RealmEntity> = {};
      mostCorrelatedEntities.forEach((id) => {
        const allRel: Realm.Results<AnyRel> = this.getByEntityId(realm, id);

        allRel.forEach((rel) => {
          const {entity1, entity2} = rel;

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
        .filter(([entityId, entity]) => entity.counter === mostCorrelatedEntities.size)
        .map(([entityId, entity]) => entity);

      correlatedEntities.forEach((rel) => heap.push(rel));

      while (!heap.empty() && mostCorrelatedEntities.size < entityCount) {
        const closestRel = heap.pop();
        const closestEntityId = startId !== closestRel.entity1.id ? closestRel.entity1.id : closestRel.entity2.id;

        if (!mostCorrelatedEntities.has(closestEntityId)) {
          mostCorrelatedEntities.add(closestEntityId);
          run();
        }
      }
    };

    run();

    return Array.from(mostCorrelatedEntities);
  };

  getMaximizedEntitiesAlongPath = (realm: Realm, startId: string, mood: Mood, branchCount: number, depth: number): Array<string> => {
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
        const closestEntityId = startId !== closestRel.entity1.id ? closestRel.entity1.id : closestRel.entity2.id;

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

  getSCEntity(realm: Realm, startId: string, mood: Mood, branchCount: number, depth: number) {
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
        const closestEntityId = nextId !== closestRel.entity1.id ? closestRel.entity1.id : closestRel.entity2.id;

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
    const maxHeap = new Heap((a: EntityPath, b: EntityPath) => b.paths.length - a.paths.length);
    Object.entries(scEntityIds).forEach(([entityId, pathsToEntity]) =>
      maxHeap.push({
        id: entityId,
        paths: pathsToEntity,
      }),
    );

    return maxHeap.toArray();
  }

  getMostRelevantEntity(realm: Realm, startId: string, mood: Mood, branchCount: number = 1) {
    this.getSCEntity(realm, startId, mood, branchCount, 1);
  }
}

const initHeap = (mood: Mood) => {
  const heap = new Heap((a: AnyRel, b: AnyRel) => {
    if (a !== undefined && b !== undefined) return a[mood] - b[mood];
    else return a === undefined ? 1 : -1;
  });

  return heap;
};
