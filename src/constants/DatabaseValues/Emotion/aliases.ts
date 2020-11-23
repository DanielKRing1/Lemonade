import {Aliases, AliasMap} from '../Types';
import {Emotion} from './enums';

// Update, then optimize/format with '../util.getAliassMap()'
// Save output
export const emotionAliases: Aliases<Emotion> = {
  [Emotion.Fear]: [
    'fear',
    'angst',
    'anxiety',
    'concern',
    'despair',
    'dismay',
    'doubt',
    'dread',
    'horror',
    'jitter',
    'panic',
    'scare',
    'suspicion',
    'terror',
    'unease',
    'uneasy',
    'worry',
  ],
  [Emotion.Anger]: [
    'anger',
    'acrimony',
    'animosity',
    'annoy',
    'antagonize',
    'displeasure',
    'enmitiy',
    'exasperate',
    'fury',
    'hatred',
    'impatient',
    'indignant',
    'ire',
    'irritate',
    'outrage',
    'passion',
    'rage',
    'resent',
    'temper',
    'violence',
  ],
  [Emotion.Sadness]: [
    'sadness',
    'bitter',
    'dismal',
    'heartbroken',
    'melancholy',
    'mourn',
    'pessimistic',
    'somber',
    'sorrow',
    'sorry',
    'wistful',
    'bad',
    'dark',
    'depress',
    'misery',
    'moved',
    'pathetic',
    'pity',
    'poignant',
    'regret',
    'serious',
    'tragic',
    'unhappy',
  ],
  [Emotion.Happiness]: [
    'happiness',
    'cheer',
    'content',
    'delight',
    'ecstatic',
    'elated',
    'glad',
    'joy',
    'joyous',
    'jubilant',
    'live',
    'merry',
    'overjoy',
    'peace',
    'pleasant',
    'please',
    'thrill',
    'upbeat',
  ],
  [Emotion.Worry]: [
    'worry',
    'anguish',
    'apprehensive',
    'concern',
    'doubt',
    'fear',
    'headache',
    'misery',
    'misgiving',
    'pain',
    'problem',
    'uncertain',
    'uneasy',
    'woe',
    'annoy',
    'bother',
    'depress',
    'disturb',
    'trouble',
    'unsettle',
    'upset',
  ],
  [Emotion.Shame]: [
    'shame',
    'guilty',
    'humiliation',
    'remorse',
    'disgrace',
    'embarrassed',
    'debased',
    'dishonored',
    'ridicule',
  ],
  [Emotion.Lonely]: [
    'lonely',
    'alone',
    'desert',
    'desolate',
    'destitute',
    'empty',
    'homeless',
    'isolated',
    'lonesome',
    'recluse',
    'solitary',
  ],
  [Emotion.Loved]: [
    'loved',
    'adored',
    'beloved',
    'cherished',
    'wanted',
    'desired',
  ],
  [Emotion.Fulfilled]: [
    'fulfilled',
    'content',
    'satisfied',
    'completed',
    'happy',
    'warm',
    'pleasant',
    'serene',
    'calm',
    'peace',
  ],
  [Emotion.Comfortable]: [
    'comfortable',
    'warm',
    'satisfied',
    'complacent',
    'cozy',
    'pleasant',
    'relax',
    'serene',
    'snug',
    'calm',
    'peace',
    'poise',
    'tranquil',
  ],
};

// Optimized aliases, one-to-one mapping
export const emotionAliasMap: AliasMap<Emotion> = {
  acrimoni: {name: 'Anger'},
  acrimony: {name: 'Anger'},
  ador: {name: 'Loved'},
  adored: {name: 'Loved'},
  alon: {name: 'Lonely'},
  alone: {name: 'Lonely'},
  anger: {name: 'Anger'},
  angst: {name: 'Fear'},
  anguish: {name: 'Worry'},
  animos: {name: 'Anger'},
  animosity: {name: 'Anger'},
  annoi: {name: 'Worry'},
  annoy: {name: 'Worry'},
  antagonizw: {name: 'Anger'},
  anxieti: {name: 'Fear'},
  anxiety: {name: 'Fear'},
  apprehens: {name: 'Worry'},
  apprehensive: {name: 'Worry'},
  bad: {name: 'Sadness'},
  belov: {name: 'Loved'},
  beloved: {name: 'Loved'},
  bitter: {name: 'Sadness'},
  bother: {name: 'Worry'},
  calm: {name: 'Comfortable'},
  cheer: {name: 'Happiness'},
  cherish: {name: 'Loved'},
  cherished: {name: 'Loved'},
  comfort: {name: 'Comfortable'},
  comfortable: {name: 'Comfortable'},
  complac: {name: 'Comfortable'},
  complacent: {name: 'Comfortable'},
  complet: {name: 'Fulfilled'},
  completed: {name: 'Fulfilled'},
  concern: {name: 'Worry'},
  content: {name: 'Fulfilled'},
  cozi: {name: 'Comfortable'},
  cozy: {name: 'Comfortable'},
  dark: {name: 'Sadness'},
  debas: {name: 'Shame'},
  debased: {name: 'Shame'},
  delight: {name: 'Happiness'},
  depress: {name: 'Worry'},
  desert: {name: 'Lonely'},
  desir: {name: 'Loved'},
  desired: {name: 'Loved'},
  desol: {name: 'Lonely'},
  desolate: {name: 'Lonely'},
  despair: {name: 'Fear'},
  destitut: {name: 'Lonely'},
  destitute: {name: 'Lonely'},
  disgrac: {name: 'Shame'},
  disgrace: {name: 'Shame'},
  dishonor: {name: 'Shame'},
  dishonored: {name: 'Shame'},
  dismai: {name: 'Fear'},
  dismal: {name: 'Sadness'},
  dismay: {name: 'Fear'},
  displeasur: {name: 'Anger'},
  displeasure: {name: 'Anger'},
  disturb: {name: 'Worry'},
  doubt: {name: 'Worry'},
  dread: {name: 'Fear'},
  ecstat: {name: 'Happiness'},
  ecstatic: {name: 'Happiness'},
  elat: {name: 'Happiness'},
  elated: {name: 'Happiness'},
  embarrass: {name: 'Shame'},
  embarrassed: {name: 'Shame'},
  empti: {name: 'Lonely'},
  empty: {name: 'Lonely'},
  enmitii: {name: 'Anger'},
  enmitiy: {name: 'Anger'},
  exasper: {name: 'Anger'},
  exasperate: {name: 'Anger'},
  fear: {name: 'Worry'},
  fulfil: {name: 'Fulfilled'},
  fulfilled: {name: 'Fulfilled'},
  furi: {name: 'Anger'},
  fury: {name: 'Anger'},
  glad: {name: 'Happiness'},
  guilti: {name: 'Shame'},
  guilty: {name: 'Shame'},
  happi: {name: 'Fulfilled'},
  happiness: {name: 'Happiness'},
  happy: {name: 'Fulfilled'},
  hatr: {name: 'Anger'},
  hatred: {name: 'Anger'},
  headach: {name: 'Worry'},
  headache: {name: 'Worry'},
  heartbroken: {name: 'Sadness'},
  homeless: {name: 'Lonely'},
  horror: {name: 'Fear'},
  humili: {name: 'Shame'},
  humiliation: {name: 'Shame'},
  impati: {name: 'Anger'},
  impatient: {name: 'Anger'},
  indign: {name: 'Anger'},
  indignant: {name: 'Anger'},
  ir: {name: 'Anger'},
  ire: {name: 'Anger'},
  irrit: {name: 'Anger'},
  irritate: {name: 'Anger'},
  isol: {name: 'Lonely'},
  isolated: {name: 'Lonely'},
  jitter: {name: 'Fear'},
  joi: {name: 'Happiness'},
  joy: {name: 'Happiness'},
  joyou: {name: 'Happiness'},
  joyous: {name: 'Happiness'},
  jubil: {name: 'Happiness'},
  jubilant: {name: 'Happiness'},
  live: {name: 'Happiness'},
  lone: {name: 'Lonely'},
  lonely: {name: 'Lonely'},
  lonesom: {name: 'Lonely'},
  lonesome: {name: 'Lonely'},
  love: {name: 'Loved'},
  loved: {name: 'Loved'},
  melancholi: {name: 'Sadness'},
  melancholy: {name: 'Sadness'},
  merri: {name: 'Happiness'},
  merry: {name: 'Happiness'},
  miseri: {name: 'Worry'},
  misery: {name: 'Worry'},
  misgiv: {name: 'Worry'},
  misgiving: {name: 'Worry'},
  mourn: {name: 'Sadness'},
  move: {name: 'Sadness'},
  moved: {name: 'Sadness'},
  outrag: {name: 'Anger'},
  outrage: {name: 'Anger'},
  overjoi: {name: 'Happiness'},
  overjoy: {name: 'Happiness'},
  pain: {name: 'Worry'},
  panic: {name: 'Fear'},
  passion: {name: 'Anger'},
  pathet: {name: 'Sadness'},
  pathetic: {name: 'Sadness'},
  peac: {name: 'Comfortable'},
  peace: {name: 'Comfortable'},
  pessimist: {name: 'Sadness'},
  pessimistic: {name: 'Sadness'},
  piti: {name: 'Sadness'},
  pity: {name: 'Sadness'},
  pleas: {name: 'Happiness'},
  pleasant: {name: 'Comfortable'},
  please: {name: 'Happiness'},
  poignant: {name: 'Sadness'},
  pois: {name: 'Comfortable'},
  poise: {name: 'Comfortable'},
  problem: {name: 'Worry'},
  rage: {name: 'Anger'},
  reclus: {name: 'Lonely'},
  recluse: {name: 'Lonely'},
  regret: {name: 'Sadness'},
  relax: {name: 'Comfortable'},
  remors: {name: 'Shame'},
  remorse: {name: 'Shame'},
  resent: {name: 'Anger'},
  ridicul: {name: 'Shame'},
  ridicule: {name: 'Shame'},
  sad: {name: 'Sadness'},
  sadness: {name: 'Sadness'},
  satisfi: {name: 'Comfortable'},
  satisfied: {name: 'Comfortable'},
  scare: {name: 'Fear'},
  seren: {name: 'Comfortable'},
  serene: {name: 'Comfortable'},
  seriou: {name: 'Sadness'},
  serious: {name: 'Sadness'},
  shame: {name: 'Shame'},
  snug: {name: 'Comfortable'},
  solitari: {name: 'Lonely'},
  solitary: {name: 'Lonely'},
  somber: {name: 'Sadness'},
  sorri: {name: 'Sadness'},
  sorrow: {name: 'Sadness'},
  sorry: {name: 'Sadness'},
  suspicion: {name: 'Fear'},
  temper: {name: 'Anger'},
  terror: {name: 'Fear'},
  thrill: {name: 'Happiness'},
  tragic: {name: 'Sadness'},
  tranquil: {name: 'Comfortable'},
  troubl: {name: 'Worry'},
  trouble: {name: 'Worry'},
  uncertain: {name: 'Worry'},
  uneas: {name: 'Fear'},
  unease: {name: 'Fear'},
  uneasi: {name: 'Worry'},
  uneasy: {name: 'Worry'},
  unhappi: {name: 'Sadness'},
  unhappy: {name: 'Sadness'},
  unsettl: {name: 'Worry'},
  unsettle: {name: 'Worry'},
  upbeat: {name: 'Happiness'},
  upset: {name: 'Worry'},
  violenc: {name: 'Anger'},
  violence: {name: 'Anger'},
  want: {name: 'Loved'},
  wanted: {name: 'Loved'},
  warm: {name: 'Comfortable'},
  wist: {name: 'Sadness'},
  wistful: {name: 'Sadness'},
  woe: {name: 'Worry'},
  worri: {name: 'Worry'},
  worry: {name: 'Worry'},
};
