import RealmSchema from '../schemaNames';

export const DayPart = {
  name: RealmSchema.DayPart,
  primaryKey: 'id',
  properties: {
    id: 'string',
    schemaType: 'string',
    mood: {},
  },
};
