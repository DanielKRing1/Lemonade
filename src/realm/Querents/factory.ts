import RealmSchema from '../../realm/schemaNames';
import { Querent, RelQuerent } from './';


export default class QuerentFactory {


    static instanceMap: { [key in RealmSchema]?: Querent } = {};

    static getRelQuerent(schema: RealmSchema, classType: any): RelQuerent {

        let instance = QuerentFactory.instanceMap[schema];

        if (instance === undefined) {
            instance = new RelQuerent(schema)
            instance.create = classType.prototype.create;

            QuerentFactory.instanceMap[schema] = instance;
        }

        return instance as RelQuerent;
    };

};