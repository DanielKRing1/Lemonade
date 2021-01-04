declare type TrendSchema = {
  name: string;
  primaryKey?: string;
  properties: Record<string, any>;
};

declare type TrendBlueprint = {
  schemaName: string;
  realmPath: string;
  trendSchema: string;
};
