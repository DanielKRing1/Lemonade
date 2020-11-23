import {ActivityCategory} from '../Activity';
import {Emotion} from '../Emotion';

export type Enums = ActivityCategory | Emotion;

export type Aliases<K extends keyof any> = {
  [k in K]?: Array<string>;
};

export type EnumAttributes<K extends keyof any> = {
  name: string;
};
export type AliasMap<K extends keyof any> = {
  [key in string]: EnumAttributes<K>;
};
