declare enum RelationshipTypeEnum {
  DENSE = 'dense',
  SEQUENTIAL = 'seq',
  SEQURNTIAL_DENSE = 'seq_dense',
}

declare type CompleteTrendBlueprints = {
  [SchemaTypeEnum.TREND]: import('../Schema/SchemaBlueprint').SchemaBlueprint;
  [SchemaTypeEnum.TAG]: import('../Schema/SchemaBlueprint').SchemaBlueprint;
  [SchemaTypeEnum.TREND_RELS]: import('../Schema/SchemaBlueprint').SchemaBlueprint[];
  [SchemaTypeEnum.TAG_RELS]: import('../Schema/SchemaBlueprint').SchemaBlueprint[];
};

declare type TrendCacheValue = {
  [SchemaTypeEnum.TREND]: import('../Trends/TrendTracker').TrendTracker;
  [SchemaTypeEnum.TAG]: import('../Trends/TrendTracker').TrendTracker;
};
