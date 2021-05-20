export const Day = {
  name: StaticSchemaName.Day,
  primaryKey: 'date',
  properties: {
    date: 'date',
    dayParts: {
      type: 'list',
      objectType: StaticSchemaName.DayPart,
    },
    trendSnapshots: {
      type: 'list',
      // String with mood name + mood rating at the time of rating
      objectType: StaticSchemaName.TrendSnapshot,
    },
  },
};

export const TrendSnapshot = {
  name: StaticSchemaName.TrendSnapshot,
  properties: {
    trendName: 'string',
    entitySnapshots: {
      type: 'list',
      objectType: StaticSchemaName.TrendSnapshot,
    },
  },
};

export const EntitySnapshot = {
  name: StaticSchemaName.EntitySnapshot,
  properties: {
    entityName: 'string',
    moodSnapshots: {
      type: 'list',
      objectType: StaticSchemaName.MoodSnapshot,
    },
  },
};

export const MoodSnapshot = {
  name: StaticSchemaName.MoodSnapshot,
  properties: {
    moodName: 'string',
    rating: 'float',
  },
};
