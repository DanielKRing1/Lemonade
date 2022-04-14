declare enum RelationshipTypeEnum {
  DENSE = 'dense',
  SEQUENTIAL = 'seq',
  SEQURNTIAL_DENSE = 'seq_dense',
}

declare enum TrendNameSuffix {
  Tag = 'tag',
  Node = 'node',
  Edge = 'edge',
  NodeDailySnapshot = 'nodeDailySnapshot',
  // DailySnapshot = 'dailySnapshot',
  // MoodSnapshot = 'moodSnapshot',
}

declare enum TrendPropertySuffix {
  Count = 'count',
}

declare type CompleteTrendOS = {
  [TrendSchemaType.TREND_NODE]: Realm.ObjectSchema;
  [TrendSchemaType.TAG_NODE]: Realm.ObjectSchema;
  [TrendSchemaType.TREND_EDGE]: Realm.ObjectSchema;
  [TrendSchemaType.TAG_EDGE]: Realm.ObjectSchema;

  [TrendSchemaType.NODE_DAILY_SNAPSHOT]: Realm.ObjectSchema;
  //   [SchemaTypeEnum.DAILY_SNAPSHOTS]: import('../Schema/MetaDataBlueprint').MetaDataBlueprint;
  //   [SchemaTypeEnum.MOOD_SNAPSHOT]: import('../Schema/MetaDataBlueprint').MetaDataBlueprint;
};
