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
  const trendSchemaBlueprint: SchemaBlueprint = new SchemaBlueprint(trendName, realmPath, SchemaTypeEnum.TREND, trendSchemaDef);
  const trendTagSchemaBlueprint: SchemaBlueprint = new SchemaBlueprint(trendTagSchemaName, realmPath, SchemaTypeEnum.TAG, trendTagSchemaDef);
  const relSchemaBlueprints: Array<SchemaBlueprint> = relSchemaDefs.map((def) => new SchemaBlueprint(def.name, realmPath, SchemaTypeEnum.TREND_RELS, def));
  const tagRelSchemaBlueprints: Array<SchemaBlueprint> = tagRelSchemaDefs.map((def) => new SchemaBlueprint(def.name, realmPath, SchemaTypeEnum.TAG_RELS, def));

  return {
    [SchemaTypeEnum.TREND]: trendSchemaBlueprint,
    [SchemaTypeEnum.TAG]: trendTagSchemaBlueprint,
    [SchemaTypeEnum.TREND_RELS]: relSchemaBlueprints,
    [SchemaTypeEnum.TAG_RELS]: tagRelSchemaBlueprints,
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

// TREND NAME BUILDERS AND CONSTANTS

const DELIM = '_';
const TREND_ATTRIBUTE_SUFFIX = `${DELIM}rating`;
const TREND_REL_PREFIX = `rel${DELIM}`;
const TAG_ATTRIBUTE_SUFFIX = `${DELIM}rating`;

// Key builders
const getTrendAttrKey = (attributeName: string) => `${attributeName}${TREND_ATTRIBUTE_SUFFIX}`;
const getTrendRelKey = (relType: RelationshipTypeEnum) => `${TREND_REL_PREFIX}${relType}`;

/**
 * Filter the property names of a SchemaBlueprint.schemaDef for only its trend attribute keys (end with the TREND_ATTRIBUTE_SUFFIX)
 * @param propertyNames Array of property names from SchemaBlueprint.schemaDef
 */
export const filterForTrendAttrKeys = (propertyNames: string[]): string[] => propertyNames.filter((name: string) => name.endsWith(TREND_ATTRIBUTE_SUFFIX));

/**
 * Filter the property names of a SchemaBlueprint.schemaDef for only its trend attribute keys and return the attribute names (without the TREND_ATTRIBUTE_SUFFIX)
 * @param propertyNames Array of property names from SchemaBlueprint.schemaDef
 */
export const filterForTrendAttrs = (propertyNames: string[]): string[] => filterForTrendAttrKeys(propertyNames).map((trendAttr: string) => trendAttr.slice(-TREND_ATTRIBUTE_SUFFIX.length));

// SchemaName builders
export const getTrendSchemaName = (trendName: string) => trendName;
export const getTrendTagSchemaName = (trendName: string) => `${trendName}${TAG_ATTRIBUTE_SUFFIX}`;
export const getRelSchemaName = (entitySchemaName: string, relType: RelationshipTypeEnum) => `${entitySchemaName}${getTrendRelKey(relType)}`;
