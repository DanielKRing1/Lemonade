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
      objectType: 'EntityEntry',
    },
    mood: 'string',
    expectedMood: 'string',
    rating: 'float',
    expectedRating: 'float',
  },
};

export type DayPartType = {
  date: string;
  entityType: string;
  entities: EntityEntryType[];
  mood: string;
  expectedMood: string;
  rating: string;
  expectedRating: string;
};

export const EntityEntry = {
  // Change this to 'EntityEntry'
  name: RealmSchema.DayPart,
  properties: {
    name: 'string',
    tags: {
      type: 'list',
      // Tag name
      objectType: 'string',
    },
  },
};

export type EntityEntryType = {
  name: string;
  tags: string[];
};
