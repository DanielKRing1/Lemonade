import {SchemaBlueprint} from '../Schema/SchemaBlueprint';
import {ObjectBuilder} from '../Utility';

/**
 * Get the Entity, Tag, EntityRelationships, and TagRelationships SchemaBlueprints needed to add the given Trend to the App
 *
 * Entity - A Node Table tracking attributes for each entity in the Trend, for example: (running) (working) (dieting) (swimming)
 * Tag - An abstract Node Table (tracking the same attributes as the Entity table but) for groupings (tags) of entity nodes in the Trend
 * EntityRelationships - An Edge Table (tracking the same attributes as the Entity table but) for the relationship between 2 entities in the Trend
 * TagRelationships = An Edge Table (tracking the same atributes as the Entity table but) for the relationship between 2 groupings (tags) in the Trend
 *
 * @param trendName
 * @param realmPath
 * @param attributeNames
 * @param relTypes
 */
export const buildTrendBlueprints = (trendName: string, realmPath: string, attributeNames: string[], relTypes: RelationshipTypeEnum[]): CompleteTrendBlueprints => {
  // Build Trend blueprint obj with custom attributes and relationship arrays
  const trendSchemaDef: Realm.ObjectSchema = getBaseTrendSchemaDef(trendName);

  const attributesProps: Realm.PropertiesTypes = getTrendAttributeProps(attributeNames);
  const relationshipsProps: Realm.PropertiesTypes = getRelationshipProps(trendName, relTypes);
  trendSchemaDef.properties = {
    ...trendSchemaDef.properties,
    ...attributesProps,
    ...relationshipsProps,
  };

  // Also build Tag blueprint obj
  const trendTagSchemaName = getTrendTagSchemaName(trendName);
  const trendTagSchemaDef = getBaseTrendSchemaDef(trendTagSchemaName);
  trendTagSchemaDef.properties = {
    ...trendTagSchemaDef.properties,
    ...attributesProps,
    ...relationshipsProps,
  };

  // Also build Relationship Schemas for Trend and TrendTag
  const relSchemaDefs: Array<Realm.ObjectSchema> = getRelSchemaDefs(trendName, relTypes);
  const tagRelSchemaDefs: Array<Realm.ObjectSchema> = getRelSchemaDefs(trendTagSchemaName, relTypes);

  // Return SchemaBlueprints
  const trendSchemaBlueprint: SchemaBlueprint = new SchemaBlueprint(trendName, realmPath, SchemaTypeEnum.Trend, trendSchemaDef);
  const trendTagSchemaBlueprint: SchemaBlueprint = new SchemaBlueprint(trendTagSchemaName, realmPath, SchemaTypeEnum.TrendTag, trendTagSchemaDef);
  const relSchemaBlueprints: Array<SchemaBlueprint> = relSchemaDefs.map((def) => new SchemaBlueprint(def.name, realmPath, SchemaTypeEnum.TrendRelationship, def));
  const tagRelSchemaBlueprints: Array<SchemaBlueprint> = tagRelSchemaDefs.map((def) => new SchemaBlueprint(def.name, realmPath, SchemaTypeEnum.TrendTagRelationship, def));

  return {
    trend: trendSchemaBlueprint,
    tag: trendTagSchemaBlueprint,
    rels: relSchemaBlueprints,
    tagRels: tagRelSchemaBlueprints,
  };
};

const getBaseTrendSchemaDef = (schemaName: string): Realm.ObjectSchema => ({
  name: schemaName,
  primaryKey: 'id',
  properties: {
    id: 'string',
    totalRatings: {type: 'int', default: 0},
  },
});

const getTrendAttributeProps = (attributeNames: string[]): Realm.PropertiesTypes => {
  const attributeKeys: string[] = attributeNames.map((name) => getTrendAttrKey(name));
  const attributeValue: Realm.ObjectSchemaProperty = {type: 'float', default: 0};

  return ObjectBuilder.buildUniformObject(attributeKeys, attributeValue);
};

const getRelationshipProps = (schemaName: string, relTypes: RelationshipTypeEnum[]): Realm.PropertiesTypes => {
  const relKeys: string[] = relTypes.map((relType) => getTrendRelKey(relType));
  const relSchemaValues: string[] = relTypes.map((relType) => `${getRelSchemaName(schemaName, relType)}[]`);

  return ObjectBuilder.buildObject(relKeys, relSchemaValues);
};

const getRelSchemaDefs = (schemaName: string, relTypes: RelationshipTypeEnum[]): Array<Realm.ObjectSchema> => {
  const relSchemaDefs: Array<Realm.ObjectSchema> = [];
  for (const relType of relTypes) {
    const relKey = getTrendRelKey(relType);
    const relSchemaName: string = getRelSchemaName(schemaName, relType);

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

const getTrendAttrKey = (attributeName: string) => `${attributeName}_rating`;
const getTrendRelKey = (relType: RelationshipTypeEnum) => `rel_${relType}`;
export const getTrendTagSchemaName = (trendName: string) => `${trendName}_tag`;
export const getRelSchemaName = (entitySchemaName: string, relType: RelationshipTypeEnum) => `${entitySchemaName}_${getTrendRelKey(relType)}`;
