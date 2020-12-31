declare type SchemaDefinition = {
  name: string;
  primaryKey?: string;
  properties: Record<string, any>;
};

declare type SchemaDeclaration = {
  schemaName: string;
  realmPath: string;
  definition: string;
};
