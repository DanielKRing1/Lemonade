import Realm from 'realm';
import Heap from 'heap';

import RealmSchema from '../schemaNames';

import { InstantiateAbstractClassError, NotImplementedError } from '../../Errors';
import Querent from './Querent';
import realm from '..';


export default class RelQuerent extends Querent {

    static sortNamePair(n1: string, n2: string): string[] {
        return [n1, n2].sort((a, b) => a < b ? -1 : 1);
    };
    static getRelId(a1: string, a2: string): string {
        return RelQuerent.sortNamePair(a1, a2).join('-');
    };

    constructor(schema: RealmSchema) {
        super(schema);

        if (this.constructor === Querent) throw new InstantiateAbstractClassError('RelQuerent');
    };

    get(a1: string, a2: string): RelationshipType<any> {
        const id = RelQuerent.getRelId(a1, a2);
        return this.getById(id) as RelationshipType<any>;
    };
    getOrCreateCombos = (entityNames: string[]): RelationshipType<any>[] => {
        const allRels = [];

        for (let n1 of entityNames) {
            for (let n2 of entityNames) {
                if (n1 === n2) continue;

                const rel = this.getOrCreate(n1, n2);
                allRels.push(rel);
            }
        }

        return allRels;
    };
    getCombos(entities: string[]): RelationshipType<any>[] {
        const allRels = [];

        for (let e1 of entities) {
            for (let e2 of entities) {
                if (e1 === e2) continue;

                const rel = this.get(e1, e2);
                allRels.push(rel);
            }
        }

        return allRels;
    };

    getByEntityId(id: string): Realm.Results<RelationshipEntity & Realm.Object> {
        return realm.objects(this.schema).filtered(`entity1.id = "${id}" OR entity2.id = "${id}"`);
    };

    create(n1: string, n2: string): RelationshipType<any> {
        throw new NotImplementedError('RelQuerent.create');
    };

    getOrCreate(n1: string, n2: string): RelationshipType<any> {
        let rel = this.get(n1, n2);
        if (rel === undefined) rel = this.create(n1, n2);

        return rel;
    };


    // Trend Algos

    /**
     * Branch out to n most [Category] Entities
     * The Most Reflective Entities are ones who's branches reflect back to themselves most often
     * 
     * @param startId Which Entity id to start branching from
     * @param branchCount Number of times to branhch out from each Entity (More will take longer to compute; also, branches out in ascending order)
     * 
     */
    getMostRelectiveEntities = (startId: string, mood: Mood, branchCount: number): Array<RelationshipEntity> => {

        const reflectivityMap: Record<string, number> = {
            [startId]: 1
        };


        const run = (startId: string) => {

            const allRel: Realm.Results<RelationshipEntity> = this.getByEntityId(startId);

            const heap = new Heap((a: RelationshipEntity, b: RelationshipEntity) => {
                if (a !== undefined && b !== undefined) return a[mood] - b[mood];
                else return a === undefined ? 1 : -1;
            });


            allRel.forEach(rel => heap.push(rel));

            const closestRels = [];
            for (let i = 0; i < branchCount; i++) {
                if (heap.empty()) break;

                const nextClosest = heap.pop();
                closestRels.push(nextClosest);
            }

            // console.log('closest relationships')
            // console.log(closestRels)

            for (let closestRel of closestRels) {

                const otherEntityId = (startId !== closestRel.entity1.id) ? closestRel.entity1.id : closestRel.entity2.id;

                if (!reflectivityMap[otherEntityId]) {
                    reflectivityMap[otherEntityId] = 1;
                    run(otherEntityId);
                }
                else reflectivityMap[otherEntityId]++;
            }

        };
        run(startId);


        type IdCountType = {
            id: string;
            count: number;
        }
        const reflectivityMaxHeap = new Heap((a: IdCountType, b: IdCountType) => b.count - a.count);
        for (let id in reflectivityMap) {
            const count = reflectivityMap[id];
            const idCount: IdCountType = {
                id,
                count
            };

            reflectivityMaxHeap.push(idCount);
        }

        return reflectivityMaxHeap.toArray();
    };

};