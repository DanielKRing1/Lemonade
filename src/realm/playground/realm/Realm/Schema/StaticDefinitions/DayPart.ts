export const DayPart = {
  name: StaticSchemaName.DayPart,
  primaryKey: 'date',
  properties: {
    date: 'date',
    entries: {
      type: 'list',
      // Entity name
      objectType: StaticSchemaName.TrendEntry,
    },
    mood: 'string',
    expectedMood: 'string',
    rating: 'float',
    expectedRating: 'float',
  },
};

// Single entry for this part of the day
export const TrendEntry = {
  name: StaticSchemaName.TrendEntry,
  properties: {
    name: 'string',
    tags: {
      type: 'list',
      // Tag name
      objectType: 'string',
    },
  },
};
