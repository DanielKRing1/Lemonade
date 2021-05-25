import {uuid} from '../../../util';

type Constructor<T = {}> = new (...args: any[]) => T;

console.log('ppp');

export function Singleton<TBase extends Constructor>(Base: TBase) {
  abstract class Singleton extends Base {
    private static _instance: Singleton;

    public uuid: string;

    constructor(...args: any[]) {
      super(args);

      this.uuid = uuid(5);
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

class ABC {
  public print() {
    console.log('I am an ABC');
  }
}

class SchemaCache extends Singleton(ABC) {
  constructor() {
    super();

    return this.getSingleton() as SchemaCache;
  }
}

console.log('a');

const a: SchemaCache = SchemaCache.getSingleton(SchemaCache) as SchemaCache;
a.print();
console.log(a.uuid);

const b: SchemaCache = SchemaCache.getSingleton(SchemaCache) as SchemaCache;
b.print();
console.log(b.uuid);

const c: SchemaCache = SchemaCache.getSingleton(SchemaCache) as SchemaCache;
c.print();
console.log(c.uuid);
