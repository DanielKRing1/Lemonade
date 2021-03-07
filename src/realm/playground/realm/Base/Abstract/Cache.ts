import { NotImplementedError } from '../../Errors';

export class Cache<T> {
    _map: Record<string, T>;

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
        throw NotImplementedError();
    }

    get(key: string): T {
        if (this.has(key)) return this._map[key];

        return undefined;
    }

    has(key: string) {
        return this._map.hasOwnProperty(key);
    }
}
