import RealmSchema from '../schemaNames';

export const SchemaDefinition = {
  name: RealmSchema.SchemaDefinition,
  primaryKey: 'schemaName',
  properties: {
    schemaName: 'string',
    realmPath: 'string',
    definition: 'string',
  },
};
