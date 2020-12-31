// Base Types
declare interface RelationshipType<T> extends RealmEntity {
  entity1: T;
  entity2: T;
  totalRatings: number;
}
declare interface ActivityRel
  extends RelationshipType<ActivityType>,
    MoodRatingType {}
declare interface CategoryRel
  extends RelationshipType<CategoryType>,
    MoodRatingType {}
declare type AnyRel = ActivityRel | CategoryRel;

declare type MoodRatingType = {
  [key in Mood]?: number;
};

// Realm Tables
declare interface RelationshipEntity extends RealmEntity, MoodRatingType {
  // entity1: RealmEntity;
  // entity2: RealmEntity;
}
declare interface CategoryType extends RelationshipEntity {}
declare interface ActivityType extends CategoryType {
  category: Category;
}
declare type AnyEntity = CategoryType | ActivityType;
