import RealmSchema from '../schemaNames';

export const DayPart = {
  name: RealmSchema.DayPart,
  primaryKey: 'date',
  properties: {
    date: 'date',
    entityType: 'string',
    entities: {
      type: 'list',
      // Entity name
      objectType: 'string',
    },
    mood: 'string',
    expectedMood: 'string',
    rating: 'float',
    expectedRating: 'float',
  },
};
