import realm from '../../';
import RealmSchema from '../../schemaNames';

import {Mood} from '../enum';

import ARQuerent from '../../Querents/ActivityRelQuerent';
import CRQuerent from '../../Querents/CategoryRelQuerent';
import {QuerentFactory} from '../../Querents';

const ActivityRelQuerent = QuerentFactory.getRelQuerent(
  RealmSchema.ActivityRelationship,
  ARQuerent,
);
const CategoryRelQuerent = QuerentFactory.getRelQuerent(
  RealmSchema.CategoryRelationship,
  CRQuerent,
);
const SeqCategoryRelQuerent = QuerentFactory.getRelQuerent(
  RealmSchema.SequentialCategoryRelationship,
  CRQuerent,
);

export const createTest = () => {
  for (let i = 0; i < 20; i++) {
    for (let j = 21; j < 40; j++) {
      if (i === j) continue;

      // @ts-ignore
      CategoryRelQuerent.create(`${i}`, `${j}`);
    }
  }
};

export const executeTest = () => {
  let startId = '2';

  const reflectiveEntities = CategoryRelQuerent.getMostReflectiveEntities(
    startId,
    Mood.Happiness,
    2,
  );

  console.log('Reflective Entities');
  console.log(reflectiveEntities);
};

export const test = () => {
  realm.write(() => {
    realm.deleteAll();

    console.log(
      'Create find closest - Time elapsed!!!!!!!!!!!!!----------------------',
    );
    let start = Date.now();
    createTest();
    let end = Date.now();
    console.log((end - start) / 1000);

    console.log(
      'Execute find closest - Time elapsed!!!!!!!!!!!!!----------------------',
    );
    start = Date.now();
    executeTest();
    end = Date.now();
    console.log((end - start) / 1000);
  });
};

// Utils
// export const sortPair = (a1: string, a2: string): string[] => [a1, a2].sort();
// export const getRelationshipId = (a1: string, a2: string): string => sortPair(a1, a2).join('-');

// const Activity1 = 'Activity1';
// const Activity2 = 'Activity2';

// const ActivityCategory1 = 'ActivityCategory1';
// const ActivityCategory2 = 'ActivityCategory2';

// export const test = () => {
//     realm.write(() => {
//         realm.deleteAll();

//         for (let i = 0; i < 100; i++) {
//             for (let j = 0; j < 100; j++) {
//                 if (i === j) continue;

//                 realm.create(RealmSchema.ActivityRelationship, {
//                     id: getRelationshipId(Activity1, Activity2),
//                     activities: [
//                         {
//                             name: `$Activity${i}`,
//                             category: {
//                                 name: `ActivityCategory${i}`,
//                             },
//                             totalRatings: 1,
//                         },
//                         {
//                             name: `Activity${j}`,
//                             category: {
//                                 name: `ActivityCategory${j}`,
//                             },
//                             totalRatings: 1,
//                         }
//                     ],
//                     totalRatings: 1,
//                 }, 'all');
//             }
//         }
//     });

//     const activityRelationship = realm.objects(RealmSchema.ActivityRelationship).filtered(`activities.category.name = "${ActivityCategory1}" AND activities.category.name = "${ActivityCategory2}"`);

// };

// realm.write(() => {
//     console.log('Create Time elapsed!!!!!!!!!!!!!----------------------')
//     let start = Date.now();
//     for (let i = 0; i < 100; i++) {
//         realm.create(RealmSchema.CategoryRelationship, { id: 'Activity1-Activity2' }, Realm.UpdateMode.All);
//     }
//     let end = Date.now();
//     console.log((end - start) / 1000);
// });

// console.log('Write and Create Time elapsed!!!!!!!!!!!!!----------------------')
// let start = Date.now();
// for (let i = 0; i < 100; i++) {
//     realm.write(() => {
//         realm.create(RealmSchema.CategoryRelationship, { id: 'Activity1-Activity2' }, Realm.UpdateMode.All);
//     });
// }
// let end = Date.now();
// console.log((end - start) / 1000);

// export const rateCategories = (categories: string[], mood: Mood, rating: number = 10) => {
//     const totalCategories = categories.length;
//     const weight = 1 / totalCategories;
//     const weightedRating = rating * weight

//     realm.write(() => {

//         // Update CatRel Graph
//         const allCatRels = CategoryRelQuerent.getCombos(categories) as Array<CategoryRel>;
//         allCatRels.forEach(catRel => {
//             const prevRating = catRel[mood]!;
//             const newRating = (prevRating * catRel.totalRatings + weightedRating) / (catRel.totalRatings + weight);
//             catRel[mood] = newRating;
//             catRel.totalRatings += weight;
//         });

//         // Update CatRel Sequence Graph

//     });

// };
