import RealmSchema from '../schemaNames';

export const Day = {
  name: RealmSchema.Day,
  primaryKey: 'date',
  properties: {
    date: 'date',
    dayParts: {
      type: 'list',
      objectType: RealmSchema.DayPart,
    },
  },
};

export type DayType = {
  date: string;
  dayParts: DayPartType[];
};
