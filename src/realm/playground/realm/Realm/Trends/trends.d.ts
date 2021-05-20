declare enum RelationshipTypeEnum {
  DENSE = 'dense',
  SEQUENTIAL = 'seq',
  SEQURNTIAL_DENSE = 'seq_dense',
}

declare enum TrendNameSuffix {
  Tag = 'tag',
  Node = 'node',
  Edge = 'edge',
  DailySnapshot = 'dailySnapshot',
  MoodSnapshot = 'moodSnapshot',
}

declare enum TrendPropertySuffix {
  Count = 'count',
}

declare type CompleteTrendSB = {
  [SchemaTypeEnum.TREND_NODE]: import('../Schema/SchemaBlueprint').SchemaBlueprint;
  [SchemaTypeEnum.TAG_NODE]: import('../Schema/SchemaBlueprint').SchemaBlueprint;
  [SchemaTypeEnum.TREND_EDGE]: import('../Schema/SchemaBlueprint').SchemaBlueprint;
  [SchemaTypeEnum.TAG_EDGE]: import('../Schema/SchemaBlueprint').SchemaBlueprint;
  [SchemaTypeEnum.DAILY_SNAPSHOTS]: import('../Schema/SchemaBlueprint').SchemaBlueprint;
  [SchemaTypeEnum.MOOD_SNAPSHOT]: import('../Schema/SchemaBlueprint').SchemaBlueprint;
};
