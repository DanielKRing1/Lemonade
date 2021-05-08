declare type DayType = {
  date: string;
  dayParts: DayPartType[];
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

export type EntityEntryType = {
  name: string;
  tags: string[];
};
