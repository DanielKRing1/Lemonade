export const Day = {
  name: StaticSchemaName.Day,
  primaryKey: 'date',
  properties: {
    date: 'date',
    dayParts: {
      type: 'list',
      objectType: StaticSchemaName.DayPart,
    },
  },
};
