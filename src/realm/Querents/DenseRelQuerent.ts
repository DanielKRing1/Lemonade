import RealmSchema from '../schemaNames';

import RelQuerent from './RelQuerent';

export default class DenseRelQuerent extends RelQuerent {
  constructor(schema: RealmSchema | string) {
    super(schema);
  }
}
