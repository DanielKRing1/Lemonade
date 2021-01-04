import RealmSchema from '../../schemaNames';

export const TrendBlueprint = {
  name: RealmSchema.TrendBlueprint,
  primaryKey: 'trendName',
  properties: {
    trendName: 'string',
    realmPath: 'string',
    realmSchema: 'string',
  },
};
