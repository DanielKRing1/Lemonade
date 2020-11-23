import realm from '../../';
import RealmSchema from '../../schemaNames';


export const getRelationshipId = (a1: string, a2: string) => {
    const id = [a1, a2].sort().join('-');

    return id;
};


const Activity1 = 'Activity1';
const Activity2 = 'Activity2';

const ActivityCategory1 = 'ActivityCategory1';
const ActivityCategory2 = 'ActivityCategory2';

export const test = () => {
    realm.write(() => {
        realm.deleteAll();

        realm.create(RealmSchema.ActivityRelationship, {
            id: getRelationshipId(Activity1, Activity2),
            activities: [
                {
                    name: Activity1,
                    category: {
                        name: ActivityCategory1,
                    },
                    totalRatings: 1,
                },
                {
                    name: Activity2,
                    category: {
                        name: ActivityCategory2,
                    },
                    totalRatings: 1,
                }
            ],
            totalRatings: 1,
        }, 'all');

        const activity1 = realm.create(RealmSchema.Activity, {
            name: Activity1,
            category: {
                name: ActivityCategory1,
            },
            totalRatings: 2,
        }, 'all');
        const activity2 = realm.create(RealmSchema.Activity, {
            name: Activity2,
            category: {
                name: ActivityCategory2,
            },
            totalRatings: 2,
        }, 'all');
        const activityRelationship = realm.create(RealmSchema.ActivityRelationship, {
            id: getRelationshipId(Activity1, Activity2),
            activities: [activity1, activity2],
            totalRatings: 2,
        }, 'all');
    });

    const activityRelationship = realm.objects(RealmSchema.ActivityRelationship).filtered(`activities.category.name = "${ActivityCategory1}" AND activities.category.name = "${ActivityCategory2}"`);

    console.log('\n\Activity Relationship');
    activityRelationship.forEach(ar => console.log(JSON.stringify(ar)))
    console.log('Done\n\n')

    const activity1 = realm.objects(RealmSchema.Activity).filtered(`name = "${Activity1}"`);
    const activity2 = realm.objects(RealmSchema.Activity).filtered(`name = "${Activity2}"`);

    console.log(Activity1);
    console.log(activity1);
    console.log(Activity2);
    console.log(activity2);
    console.log('\n\n');


    const activityCategory1 = realm.objects(RealmSchema.ActivityCategory).filtered(`name = "${ActivityCategory1}"`);
    const activityCategory2 = realm.objects(RealmSchema.ActivityCategory).filtered(`name = "${ActivityCategory2}"`);

    console.log(ActivityCategory1);
    console.log(activityCategory1);
    console.log(ActivityCategory2);
    console.log(activityCategory2);

    const rel = realm.objectForPrimaryKey(RealmSchema.ActivityRelationship, getRelationshipId(Activity1, Activity2));
    console.log('\n\nPrimary key query');
    console.log(rel)
}

export const rateActivityCategories = (categories: string[], mood: string, rating: number) => {
    const totalCategories = categories.length;

    realm.write(() => {
        const categoryObjMap = {};

        categories.forEach((categoryName: string) => {
            // Getter
            let categoryObj = realm.objects(RealmSchema.ActivityCategory).filter(`name = ${categoryName}`);

            if (categoryObj === null) {
                categoryObj = realm.create(RealmSchema.ActivityCategory, {
                    name: categoryName
                }, 'all');
            }

            categoryObjMap[categoryName] = categoryObj;

        });

        for (let c1 of categories) {
            for (let c2 of categories) {
                if (c1 === c2) continue;

                const c1Obj = categoryObjMap[c1];
                const c2Obj = categoryObjMap[c2];

                // Getter
                let categoryRelationship = realm.objects(RealmSchema.CategoryRelationship).filter(`activityCategories.name = c1 AND activityCategories.name = c2`);

                if (categoryRelationship === null) {
                    categoryRelationship = realm.create(RealmSchema.CategoryRelationship, {
                        activityCategories: [c1Obj, c2Obj],
                        totalRatings: 1 / totalCategories,
                    }, 'all');
                }

            }
        }
    });
}; import realm from '../../';
import RealmSchema from '../../schemaNames';


export const getRelationshipId = (a1: string, a2: string) => {
    const id = [a1, a2].sort().join('-');

    return id;
};


const Activity1 = 'Activity1';
const Activity2 = 'Activity2';

const ActivityCategory1 = 'ActivityCategory1';
const ActivityCategory2 = 'ActivityCategory2';

export const test = () => {
    realm.write(() => {
        realm.deleteAll();

        realm.create(RealmSchema.ActivityRelationship, {
            id: getRelationshipId(Activity1, Activity2),
            activities: [
                {
                    name: Activity1,
                    category: {
                        name: ActivityCategory1,
                    },
                    totalRatings: 1,
                },
                {
                    name: Activity2,
                    category: {
                        name: ActivityCategory2,
                    },
                    totalRatings: 1,
                }
            ],
            totalRatings: 1,
        }, 'all');

        const activity1 = realm.create(RealmSchema.Activity, {
            name: Activity1,
            category: {
                name: ActivityCategory1,
            },
            totalRatings: 2,
        }, 'all');
        const activity2 = realm.create(RealmSchema.Activity, {
            name: Activity2,
            category: {
                name: ActivityCategory2,
            },
            totalRatings: 2,
        }, 'all');
        const activityRelationship = realm.create(RealmSchema.ActivityRelationship, {
            id: getRelationshipId(Activity1, Activity2),
            activities: [activity1, activity2],
            totalRatings: 2,
        }, 'all');
    });

    const activityRelationship = realm.objects(RealmSchema.ActivityRelationship).filtered(`activities.category.name = "${ActivityCategory1}" AND activities.category.name = "${ActivityCategory2}"`);

    console.log('\n\Activity Relationship');
    activityRelationship.forEach(ar => console.log(JSON.stringify(ar)))
    console.log('Done\n\n')

    const activity1 = realm.objects(RealmSchema.Activity).filtered(`name = "${Activity1}"`);
    const activity2 = realm.objects(RealmSchema.Activity).filtered(`name = "${Activity2}"`);

    console.log(Activity1);
    console.log(activity1);
    console.log(Activity2);
    console.log(activity2);
    console.log('\n\n');


    const activityCategory1 = realm.objects(RealmSchema.ActivityCategory).filtered(`name = "${ActivityCategory1}"`);
    const activityCategory2 = realm.objects(RealmSchema.ActivityCategory).filtered(`name = "${ActivityCategory2}"`);

    console.log(ActivityCategory1);
    console.log(activityCategory1);
    console.log(ActivityCategory2);
    console.log(activityCategory2);

    const rel = realm.objectForPrimaryKey(RealmSchema.ActivityRelationship, getRelationshipId(Activity1, Activity2));
    console.log('\n\nPrimary key query');
    console.log(rel)
}

export const rateActivityCategories = (categories: string[], mood: string, rating: number) => {
    const totalCategories = categories.length;

    realm.write(() => {
        const categoryObjMap = {};

        categories.forEach((categoryName: string) => {
            // Getter
            let categoryObj = realm.objects(RealmSchema.ActivityCategory).filter(`name = ${categoryName}`);

            if (categoryObj === null) {
                categoryObj = realm.create(RealmSchema.ActivityCategory, {
                    name: categoryName
                }, 'all');
            }

            categoryObjMap[categoryName] = categoryObj;

        });

        for (let c1 of categories) {
            for (let c2 of categories) {
                if (c1 === c2) continue;

                const c1Obj = categoryObjMap[c1];
                const c2Obj = categoryObjMap[c2];

                // Getter
                let categoryRelationship = realm.objects(RealmSchema.CategoryRelationship).filter(`activityCategories.name = c1 AND activityCategories.name = c2`);

                if (categoryRelationship === null) {
                    categoryRelationship = realm.create(RealmSchema.ActivityCategoryRelationship, {
                        activityCategories: [c1Obj, c2Obj],
                        totalRatings: 1 / totalCategories,
                    }, 'all');
                }

            }
        }
    });
};