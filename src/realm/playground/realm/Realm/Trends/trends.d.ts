declare enum RelationshipTypeEnum {
  DENSE = 'dense',
  SEQUENTIAL = 'seq',
  SEQURNTIAL_DENSE = 'seq_dense',
}

declare type CompleteTrendBlueprints = {
  trend: import('../Schema/SchemaBlueprint').SchemaBlueprint;
  tag: import('../Schema/SchemaBlueprint').SchemaBlueprint;
  rels: import('../Schema/SchemaBlueprint').SchemaBlueprint[];
  tagRels: import('../Schema/SchemaBlueprint').SchemaBlueprint[];
};
