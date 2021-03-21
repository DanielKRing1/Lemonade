import {NotInCacheError, NotImplementedError} from '../../Errors';

export class Cache<T> {
  protected _map: Record<string, T>;

  constructor() {
    this._map = {};
  }

  /**
   * Override and build a 'value' from the given 'valueParams', to associate with the given 'key'
   *
   * @param key String key
   * @param valueParams Object of data needed to build a value for the key
   */
  add(key: string, valueParams: Record<string, any>) {
    throw NotImplementedError({});
  }

  rm(key: string, options?: any): T | undefined {
    if (this.has(key)) {
      const val = this._map[key];
      delete this._map[key];

      return val;
    }
  }

  get(key: string): T {
    if (this.has(key)) return this._map[key];

    // throw NotInCacheError({message: `"${key}" does not exist in ${this.constructor} Cache`});
  }

  has(key: string) {
    return this._map.hasOwnProperty(key);
  }
}
