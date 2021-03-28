import {SchemaBlueprint} from '../Schema/SchemaBlueprint';

type BuildTrendBlueprintReturn = {
  trend: SchemaBlueprint;
  tag: SchemaBlueprint;
  rels: Array<SchemaBlueprint>;
  tagRels: Array<SchemaBlueprint>;
};
export const buildTrendBlueprint = (trendName: string, realmPath: string, attributeNames: string[], relTypes: RelationshipType[]): BuildTrendBlueprintReturn => {
  const schemaType = SchemaType.Trend;

  // Build base Trend blueprint obj
  const schemaDef: Realm.ObjectSchema = getBaseSchemaDef(trendName);

  // Get custom attributes
  const attributesProps: Realm.PropertiesTypes = getAttributeProps(attributeNames);

  // Get entity relationship types
  const relationshipsProps: Realm.PropertiesTypes = getRelationshipProps(trendName, relTypes);

  // Add entity relationship types
  schemaDef.properties = {
    ...schemaDef.properties,
    ...attributesProps,
    ...relationshipsProps,
  };

  // Build Tag blueprint obj
  const tagSchemaName = `${trendName}_tag`;
  const tagSchemaDef = getBaseSchemaDef(tagSchemaName);
  tagSchemaDef.properties = {
    ...tagSchemaDef.properties,
    ...attributesProps,
    ...relationshipsProps,
  };

  // Build Trend Relationship blueprint objs
  const relSchemaDefs: Array<Realm.ObjectSchema> = getRelSchemaDefs(trendName, relTypes);

  // Build Trend Tag Relationship blueprint objs
  const tagRelSchemaDefs: Array<Realm.ObjectSchema> = getRelSchemaDefs(tagSchemaName, relTypes);

  const trendSchemaBlueprint: SchemaBlueprint = new SchemaBlueprint(trendName, realmPath, schemaType, schemaDef);
  const trendTagSchemaBlueprint: SchemaBlueprint = new SchemaBlueprint(tagSchemaName, realmPath, schemaType, tagSchemaDef);
  const relSchemaBlueprints: Array<SchemaBlueprint> = relSchemaDefs.map((def) => new SchemaBlueprint(def.name, realmPath, schemaType, def));
  const tagRelSchemaBlueprints: Array<SchemaBlueprint> = tagRelSchemaDefs.map((def) => new SchemaBlueprint(def.name, realmPath, schemaType, def));

  return {
    trend: trendSchemaBlueprint,
    tag: trendTagSchemaBlueprint,
    rels: relSchemaBlueprints,
    tagRels: tagRelSchemaBlueprints,
  };
};

const getBaseSchemaDef = (schemaName: string): Realm.ObjectSchema => ({
  name: schemaName,
  primaryKey: 'id',
  properties: {
    id: 'string',
    totalRatings: {type: 'int', default: 0},
  },
});

const getAttributeProps = (attributeNames: string[]): Realm.PropertiesTypes => {
  const attributesProps: Realm.PropertiesTypes = {};
  for (const attributeName of attributeNames) {
    const attributeKey: string = `${attributeName}_rating`;
    attributesProps[attributeKey] = {type: 'float', default: 0};
  }

  return attributesProps;
};

const getRelationshipProps = (schemaName: string, relTypes: RelationshipType[]): Realm.PropertiesTypes => {
  // Get entity relationship types
  const relationshipsProps: Realm.PropertiesTypes = {};
  for (const relType of relTypes) {
    const relKey = `rel_${relType}`;
    const relSchemaName: string = `${schemaName}_${relKey}`;
    relationshipsProps[relKey] = `${relSchemaName}[]`;
  }

  return relationshipsProps;
};

const getRelSchemaDefs = (schemaName: string, relTypes: RelationshipType[]): Array<Realm.ObjectSchema> => {
  const relSchemaDefs: Array<Realm.ObjectSchema> = [];
  for (const relType of relTypes) {
    const relKey = `rel_${relType}`;
    const relSchemaName: string = `${schemaName}_${relKey}`;

    const relSchemaDef: Realm.ObjectSchema = {
      name: relSchemaName,
      primaryKey: 'id',
      properties: {
        id: 'string',
        totalRatings: {type: 'int', default: 0},
        entities: {type: 'linkingObjects', objectType: schemaName, property: relKey},
      },
    };

    relSchemaDefs.push(relSchemaDef);
  }

  return relSchemaDefs;
};
