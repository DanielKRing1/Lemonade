/**
 * To follow the SINGLETON pattern expected for this class,
 * return this._getInstance() from the Derived class's constructor
 *
 * Example usage in Derived class:
 *
 *      constructor() {
 *          super()
 *          ...
 *
 *          return this._getSingleton();
 *      }
 */

// type Constructor = new (...args: any[]) => {};
// type Constructor<T> = Function & { prototype: T };
// interface Constructor<T> extends Function {
//     prototype: T;
// }
type Constructor<T = {}> = new (...args: any[]) => T;

export function Singleton<TBase extends Constructor>(Base: TBase) {
  abstract class Singleton extends Base {
    private static _instance: Singleton;

    // Is this necessary?
    constructor(...args: any) {
      super(args);
    }

    public static getSingleton<TBase extends Constructor<Singleton>>(DerivedSingleton: TBase): Singleton {
      return new DerivedSingleton();
    }

    protected getSingleton() {
      if (!this._hasInstance()) this._setInstance();

      return this._getInstance();
    }

    private _getInstance() {
      return (this.constructor as typeof Singleton)._instance;
    }

    private _setInstance() {
      (this.constructor as typeof Singleton)._instance = this;
    }

    private _hasInstance() {
      return !!(this.constructor as typeof Singleton)._instance;
    }
  }

  return Singleton;
}
