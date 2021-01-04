import RealmSchemaName from '../../../schemaNames';

const BlueprintSchema: RealmSchemaObject = {
  name: RealmSchemaName.SchemaBlueprint,
  primaryKey: 'schemaName',
  properties: {
    schemaName: 'string',
    schemaType: 'string',
    realmPath: 'string',
    schemaStr: 'string',
  },
};

export default BlueprintSchema;
