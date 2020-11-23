const stemmer = require('stemmer');

import { activityCategoryAliases } from './Activity';
import { emotionAliases } from './Emotion';

import { Enums, Aliases, AliasMap } from './Types';

export const getAliasMap = (map: Aliases<Enums>): AliasMap<Enums> => {
  const aliasMap = Object.entries(map).reduce(
    (map: AliasMap<Enums>, [name, aliases]) => {
      aliases!.forEach((alias) => {
        // Add original word
        map[alias] = {
          name: <Enums>name,
        };

        // Add stem
        const stem = stemmer(alias);
        map[stem] = {
          name: <Enums>name,
        };
      });

      return map;
    },
    {},
  );

  const sortedAliasMap: Record<string, any> = {};
  Object.keys(aliasMap)
    .sort()
    .forEach((key) => {
      sortedAliasMap[key] = aliasMap[<Enums>key];
    });

  return sortedAliasMap;
};

export const getActivityCategoriesAliasMap = () => {
  return getAliasMap(activityCategoryAliases);
};

export const getEmotionsAliasMap = () => {
  return getAliasMap(emotionAliases);
};

console.log(getActivityCategoriesAliasMap());

console.log(getEmotionsAliasMap());
