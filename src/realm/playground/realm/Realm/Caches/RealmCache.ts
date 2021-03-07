import {Cache, Loadable, Loader, LoadParams, Singleton, Override, Implement} from '../../Base';

type Realm = any;

/**
 * A SINGLETON CACHE that caches all open Realm connections
 *
 * It is also LOADABLE, meaning it can load() predefined Realm connections (defined the default Realm)
 */
export class RealmCache extends Singleton(Cache)<Realm> implements Loadable {
  _loader: RealmLoader;

  constructor() {
    super();

    this._loader = new RealmLoader();

    return this.getSingleton();
  }

  @Override('Cache')
  add(key: string, valueParams: Record<string, any>) {
    throw new Error('Method not implemented.');
  }

  @Implement('Loadable')
  load(params?: LoadParams) {
    this._loader.load(params);
  }
}

class RealmLoader extends Loader {
  constructor() {
    super();
  }
}
