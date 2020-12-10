import Realm from 'realm';

import {
  ActivitySchema,
  CategorySchema,
  CategoryRelationshipSchema,
  ActivityRelationshipSchema,
} from './Activity';

export default new Realm({
  schema: [
    ActivitySchema,
    CategorySchema,
    CategoryRelationshipSchema,
    ActivityRelationshipSchema,
  ],
  deleteRealmIfMigrationNeeded: true,
});
