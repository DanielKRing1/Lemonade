declare type TrendDay = {
  date: Date;
  dayParts: TrendDayPart[];
  // The ratings of this Trend entity at the start of this day
  trendSnapshots: TrendSnapshot[];
};

// Snapshots of Trends on a specific day in the past
declare type TrendSnapshot = {
  trendName: string;
  entitySnapshots: EntitySnapshot[];
};
declare type EntitySnapshot = {
  entityName: string;
  moodSnapshots: MoodSnapshot[];
};
declare type MoodSnapshot = {
  moodName: string;
  rating: number;
};

declare type TrendDayPart = {
  date: Date;
  entities: string[];
  mood: string;
  expectedMood: string;
  rating: number;
  expectedRating: number;
};
