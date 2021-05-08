export const DayPart = {
  name: StaticSchemaName.DayPart,
  primaryKey: 'date',
  properties: {
    date: 'date',
    entityType: 'string',
    entities: {
      type: 'list',
      // Entity name
      objectType: 'EntityEntry',
    },
    mood: 'string',
    expectedMood: 'string',
    rating: 'float',
    expectedRating: 'float',
  },
};

export const EntityEntry = {
  // Change this to 'EntityEntry'
  name: StaticSchemaName.DayPart,
  properties: {
    name: 'string',
    tags: {
      type: 'list',
      // Tag name
      objectType: 'string',
    },
  },
};
