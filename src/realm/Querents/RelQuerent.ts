import Realm from 'realm';

import RealmSchema from '../schemaNames';

import { InstantiateAbstractClassError, NotImplementedError } from '../../Errors';
import Querent from './Querent';


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
    getCombos = (entities: string[]): RelationshipType<any>[] => {
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
    create(n1: string, n2: string): RelationshipType<any> {
        throw new NotImplementedError('RelQuerent.create');
    };

    getOrCreate(n1: string, n2: string): RelationshipType<any> {
        let rel = this.get(n1, n2);
        if (rel === undefined) rel = this.create(n1, n2);

        return rel;
    };

};