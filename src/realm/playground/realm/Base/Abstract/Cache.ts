import {NotInCacheError, NotImplementedError} from '../../Errors';
import {Override} from '../Decorators';

export class Cache<T> {
  protected _map: Dict<T>;

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

  rm(key: string, options?: any): T | undefined | void {
    if (this.has(key)) {
      const val = this._map[key];
      delete this._map[key];

      return val;
    }
  }

  get(key: string): T | undefined {
    if (this.has(key)) return this._map[key];

    // throw NotInCacheError({message: `"${key}" does not exist in ${this.constructor} Cache`});
  }

  has(key: string) {
    return this._map.hasOwnProperty(key);
  }
}

export class ArrayCache<T> extends Cache<T[]> {
  protected _map: Dict<T[]>;

  constructor() {
    super();

    this._map = {};
  }

  @Override('Cache')
  rm(key: string, itemToRm: T, options?: any): void {
    if (this.has(key)) {
      const arr = this._map[key];
      const indexToRm = typeof itemToRm === 'object' ? arr.findIndex((item: Object) => item.toString() === (itemToRm as Object).toString()) : arr.findIndex((item: T) => item === itemToRm);
      this._map[key] = arr.splice(indexToRm, 1);
    }
  }

  protected addToKeyArr(key: string, value: T) {
    this.initKeyWithArray(key);

    this._map[key].push(value);
  }

  protected initKeyWithArray(key: string) {
    if (!this.has(key)) this._map[key] = [];
  }
}
