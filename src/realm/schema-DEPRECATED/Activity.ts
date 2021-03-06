import RealmSchema from '../schemaNames';

const Entity = {
  primaryKey: 'id',
  properties: {
    id: 'string',
    totalRatings: {type: 'int', default: 0},
    fearRating: {type: 'float', default: 0},
    angerRating: {type: 'float', default: 0},
    sadRating: {type: 'float', default: 0},
    worryRating: {type: 'float', default: 0},
    shameRating: {type: 'float', default: 0},
    lonelyRating: {type: 'float', default: 0},
    happinessRating: {type: 'float', default: 0},
    lovedRating: {type: 'float', default: 0},
    fulfilledRating: {type: 'float', default: 0},
    comfortableRating: {type: 'float', default: 0},
  },
};

export const ActivitySchema = {
  ...Entity,
  name: RealmSchema.Activity,
  category: RealmSchema.ActivityCategory,
};

export const CategorySchema = {
  ...Entity,
  name: RealmSchema.ActivityCategory,
};
