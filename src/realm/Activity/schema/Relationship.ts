import RealmSchema from '../../schemaNames';


export const ActivityRelationshipSchema = {
    name: RealmSchema.ActivityRelationship,
    primaryKey: 'id',
    properties: {
        id: 'string',
        entity1: { type: `${RealmSchema.Activity}` },
        entity2: { type: `${RealmSchema.Activity}` },
        totalRatings: { type: 'int', default: 0 },
        fearRating: { type: 'float', default: 0 },
        angerRating: { type: 'float', default: 0 },
        sadRating: { type: 'float', default: 0 },
        worryRating: { type: 'float', default: 0 },
        shameRating: { type: 'float', default: 0 },
        lonelyRating: { type: 'float', default: 0 },
        happinessRating: { type: 'float', default: 0 },
        lovedRating: { type: 'float', default: 0 },
        fulfilledRating: { type: 'float', default: 0 },
        comfortableRating: { type: 'float', default: 0 },
    }
};


export const CategoryRelationshipSchema: RealmSchemaType<CategoryRel> = {
    name: RealmSchema.CategoryRelationship,
    primaryKey: 'id',
    properties: {
        id: 'string',
        entity1: { type: `${RealmSchema.ActivityCategory}` },
        entity2: { type: `${RealmSchema.ActivityCategory}` },
        totalRatings: { type: 'int', default: 0 },
        fear: { type: 'float', default: 0 },
        anger: { type: 'float', default: 0 },
        sadness: { type: 'float', default: 0 },
        worry: { type: 'float', default: 0 },
        shame: { type: 'float', default: 0 },
        lonely: { type: 'float', default: 0 },
        happiness: { type: 'float', default: 0 },
        loved: { type: 'float', default: 0 },
        fulfilled: { type: 'float', default: 0 },
        comfortable: { type: 'float', default: 0 },
    }
};