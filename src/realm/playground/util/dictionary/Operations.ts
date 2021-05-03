// MODIFICATION OPERATIONS

export function filterDict<T>(originalDict: Dict<T>, conditionToPass: (key: string, value: T) => boolean): Dict<T> {
  const filteredDict: Dict<T> = {};

  for (const key in originalDict) {
    const value: T = originalDict[key];

    if (conditionToPass(key, value)) filteredDict[key] = value;
  }

  return filteredDict;
}

export function mutateDict<T>(originalDict: Dict<T>, mutate: (key: string, value: T) => T): Dict<T> {
  const mutatedDict: Dict<T> = {};

  for (const key in originalDict) {
    const value: T = originalDict[key];

    const mutatedValue: T = mutate(key, value);
    mutatedDict[key] = mutatedValue;
  }

  return mutatedDict;
}

// COPY OPERATIONS

export function copyDictRm<T>(originalDict: Dict<T>, blacklistKeys: string[]): Dict<T> {
  return filterDict<T>(originalDict, (key: string, value: T) => !blacklistKeys.includes(key));
}

export function copyDictKeep<T>(originalDict: Dict<T>, whitelistKeys: string[]): Dict<T> {
  return filterDict<T>(originalDict, (key: string, value: T) => whitelistKeys.includes(key));
}

// OPERATOR OPERATIONS

// Subtraction
export function subDictScalar(dict: Dict<number>, scalar: number): Dict<number> {
  return mutateDict<number>(dict, (key: string, value: number) => value - scalar);
}

export function subScalarDict(scalar: number, dict: Dict<number>): Dict<number> {
  return mutateDict<number>(dict, (key: string, value: number) => scalar - value);
}

/**
 * Subtract subsequent Dictionaries from the first provided Dictionaries to get the sum of each key in an array of Dictionaries
 *
 * @param dicts Array of Dictionaries attributes to be summed up into a single Dictionary
 */
export function subDicts(...dicts: Dict<number>[]): Dict<number> {
  // 1. Init to first dict
  const minuendDict: Dict<number> = Object.assign({}, dicts[0]);

  // 2. Subtract each subsequent dict from difference
  for (let i = 1; i < dicts.length; i++) {
    const subtrahendDict: Dict<number> = dicts[i];

    for (const key in subtrahendDict) {
      const subtrahend = subtrahendDict[key];
      minuendDict[key] -= subtrahend;
    }
  }

  return minuendDict;
}

// Division
export function divideDictScalar(dict: Dict<number>, scalar: number): Dict<number> {
  return mutateDict<number>(dict, (key: string, value: number) => value / scalar);
}

export function divideScalarDict(scalar: number, dict: Dict<number>): Dict<number> {
  return mutateDict<number>(dict, (key: string, value: number) => scalar / value);
}

export function divideDicts(a: Dict<number>, b: Dict<number>): Dict<number> {
  const keysToDivideOn: string[] = getIntersectingDictKeys(a, b);
  const dividedDict: Dict<number> = {};

  for (const key of keysToDivideOn) {
    dividedDict[key] = a[key] / b[key];
  }

  return dividedDict;
}

// Addition

export function sumDictScalar(dict: Dict<number>, scalar: number): Dict<number> {
  const newDict: Dict<number> = {};
  return mutateDict<number>(dict, (key: string, value: number) => value + scalar);
}

/**
 * Add up an array of Dictionaries to get the sum of each key in an array of Dictionaries
 *
 * @param dicts Array of Dictionaries attributes to be summed up into a single Dictionary
 */
export function sumDicts(...dicts: Dict<number>[]): Dict<number> {
  const summedDict: Dict<number> = {};

  for (const dict of dicts) {
    for (const key in dict) {
      if (!summedDict.hasOwnProperty(key)) summedDict[key] = 0;

      const addend = dict[key];
      summedDict[key] += addend;
    }
  }

  return summedDict;
}

// Multiplication

export function multiplyDictScalar(dict: Dict<number>, scalar: number): Dict<number> {
  return mutateDict<number>(dict, (key: string, value: number) => value * scalar);
}

export function multiplyDicts(a: Dict<number>, b: Dict<number>): Dict<number> {
  const keysToDivideOn: string[] = getIntersectingDictKeys(a, b);
  const multipliedDict: Dict<number> = {};

  for (const key of keysToDivideOn) {
    multipliedDict[key] = a[key] * b[key];
  }

  return multipliedDict;
}

// Other operations

/**
 * "Add up" an array of Dictionaries, then apply some averaging export function to each key to get the (potentially weighted) "average" of each key in an array of Dictionaries
 *
 * @param dicts Array of Dictionaries attributes to be averaged up into a single Dictionary
 */
export function avgDicts(getAvg: (sum: number, count: number) => number, ...dicts: Dict<number>[]): Dict<number> {
  const summedDict: Dict<number> = {};
  const occurenceDict: Dict<number> = {};

  for (const dict of dicts) {
    for (const key in dict) {
      if (!summedDict.hasOwnProperty(key)) {
        summedDict[key] = 0;
        occurenceDict[key] = 0;
      }

      const addend = dict[key];
      summedDict[key] += addend;
      occurenceDict[key]++;
    }
  }

  const avgedDict: Dict<number> = {};
  for (const key in summedDict) {
    const sum = summedDict[key];
    const count = occurenceDict[key];

    avgedDict[key] = getAvg(sum, count);
  }

  return avgedDict;
}

// UNION AND INTERSECTION OPERATIONS

/**
 * Given n dicts, get the keys that are present in all n dicts
 *
 * @param dicts
 */
export function getIntersectingDictKeys(...dicts: Dict<any>[]): string[] {
  const totalDicts: number = dicts.length;
  const keyCounter: Dict<number> = {};

  for (const dict of dicts) {
    for (const key in dict) {
      if (!keyCounter.hasOwnProperty(key)) keyCounter[key] = 0;
      keyCounter[key]++;
    }
  }

  const intersectingKeys: string[] = [];
  for (const key in keyCounter) {
    const count = keyCounter[key];
    if (count === totalDicts) intersectingKeys.push(key);
  }

  return intersectingKeys;
}
