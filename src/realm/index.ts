import Realm from 'realm';

import {SchemaDefinition} from './schema';
import RealmSchema from './schemaNames';

export const metadataRealm = new Realm({
  schema: [SchemaDefinition],
  // TODO Remove this after testing
  deleteRealmIfMigrationNeeded: true,
});

// TODO Remove after testing
const Entity = {
  name: RealmSchema.Activity,
  primaryKey: 'id',
  properties: {
    id: 'string',
    totalRatings: {type: 'int', default: 0},
    fearRating: {type: 'float', default: 0},
    angerRating: {type: 'float', default: 0},
    sadRating: {type: 'float', default: 0},
    worryRating: {type: 'float', default: 0},
    shameRating: {type: 'float', default: 0},
    lonelyRating: {type: 'float', default: 0},
    happinessRating: {type: 'float', default: 0},
    lovedRating: {type: 'float', default: 0},
    fulfilledRating: {type: 'float', default: 0},
    comfortableRating: {type: 'float', default: 0},
  },
};
metadataRealm.write(() => {
  // TODO Distribute as util method
  const getSchemaDeclaration = (
    schemaName: string,
    realmPath: string,
    schemaDef: SchemaDefinition,
  ): SchemaDeclaration => ({
    schemaName,
    realmPath,
    definition: JSON.stringify(schemaDef),
  });
  const entityDeclaration = getSchemaDeclaration(Entity.name, 'Mood', Entity);
  metadataRealm.create(RealmSchema.SchemaDeclaration, entityDeclaration);
});

// Might need to wait for timeout during creation

export const loadedSchemaDeclarations: Realm.Results<SchemaDeclaration> = metadataRealm.objects(
  RealmSchema.SchemaDeclaration,
);

// {
//   realmName: [ SchemaDefinition ],
//   ...
// }
export const realmSchemaDefinitions = loadedSchemaDeclarations.reduce(
  (
    realmMap: Record<string, Array<SchemaDefinition>>,
    declaration: SchemaDeclaration,
  ) => {
    const {schemaName, realmPath, definition: defStr} = declaration;
    if (!!realmMap[realmPath]) realmMap[realmPath] = [];

    const defObj = JSON.parse(defStr);
    realmMap[realmPath].push(defObj);

    return realmMap;
  },
  {},
);

export const realms = Object.keys(realmSchemaDefinitions).reduce(
  (_realms, realmName: string) => ({
    ..._realms,
    [realmName]: new Realm({
      path: `${realmName}.realm`,
      schema: realmSchemaDefinitions[realmName],
    }),
  }),
  // Initial realms obj
  {
    [Realm.defaultPath]: metadataRealm,
  },
);

// import {
//   ActivitySchema,
//   CategorySchema,
//   CategoryRelationshipSchema,
//   ActivityRelationshipSchema,
// } from './Activity';

// export default new Realm({
//   schema: [
//     ActivitySchema,
//     CategorySchema,
//     CategoryRelationshipSchema,
//     ActivityRelationshipSchema,
//   ],
//   deleteRealmIfMigrationNeeded: true,
// });
