// Base Types
declare interface RealmRelationship<T> extends RealmRow, MoodRatingType {
  entity1: T;
  entity2: T;
  totalRatings: number;
}

declare type MoodRatingType = {
  [key in Mood]?: number;
};

// Realm Tables
declare interface RealmEntity extends RealmRow, MoodRatingType {
  totalRatings: number;
}
