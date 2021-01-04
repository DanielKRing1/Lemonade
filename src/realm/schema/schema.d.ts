declare type RealmSchema = {
  name: string;
  primaryKey?: string;
  properties: Record<string, any>;
};

declare type TrendSchema = RealmSchema;

declare type TrendBlueprint = {
  schemaName: string;
  realmPath: string;
  trendSchema: string;
};
