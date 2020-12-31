import RealmSchema from '../schemaNames';

import RelQuerent from './RelQuerent';

export default class DenseRelQuerent extends RelQuerent {
  constructor(realm: Realm, schema: RealmSchema) {
    super(realm, schema);
  }
}
