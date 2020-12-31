import RealmSchema from '../schemaNames';

import RelQuerent from './RelQuerent';

export default class SeqRelQuerent extends RelQuerent {
  // Override method, order matters and creates different key
  static sortNamePair(n1: string, n2: string): string[] {
    return [n1, n2];
  }

  constructor(realm: Realm, schema: RealmSchema) {
    super(realm, schema);
  }
}
