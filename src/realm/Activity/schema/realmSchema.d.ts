// Base Types
declare interface RelationshipType<T> extends RealmEntity {
    entity1: T;
    entity2: T;
    totalRatings: number;
}


declare type MoodRatingType = {
    [key in Mood]?: number;
}

// Realm Tables
declare interface CategoryType extends RealmEntity, MoodRatingType { }
declare interface ActivityType extends RealmEntity, CategoryType {
    category: Category;
}


declare interface ActivityRel extends RelationshipType<ActivityType>, MoodRatingType { }
declare interface CategoryRel extends RelationshipType<CategoryType>, MoodRatingType { }