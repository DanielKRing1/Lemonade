//@ts-ignore
import { InstantiateAbstractError, NotImplementedError } from "../../Errors";
//@ts-ignore
import Realm from "../Realm";

type EntityAndWeights<T> = {
  entity: Realm.Object & T;
  weight: number;
}[];

type Dict<T> = Record<string, T>;

export default class Querent<T> {
  protected realmPath: string;
  protected schemaName: string;

  constructor(realmPath: string, schemaName: string) {
    if (this.constructor === Querent)
      throw InstantiateAbstractError({ className: "Querent" });

    this.realmPath = realmPath;
    this.schemaName = schemaName;
  }

  /**
   * Use this method to associate this Querent with the correct Realm and Schema
   */
  public getQuerentIds() {
    return {
      realmPath: this.realmPath,
      schemaName: this.schemaName,
    };
  }

  // GETTERS

  public getById(realm: Realm, id: string): Realm.Results<T> | undefined {
    return realm.objectForPrimaryKey(this.schemaName, id);
  }
  public getAll(realm: Realm): Realm.Results<T> | undefined {
    return realm.objects(this.schemaName);
  }

  /**
   * Insertion into Realm happens here
   * Calls the realm.create method on the passed row
   *
   * @param realm Realm to insert into
   * @param row Data object to insert into Realm
   */
  // TODO Check which UpdateMode to use
  protected _create(realm: Realm, row: T): Realm.Results<T> | undefined {
    const entry: Realm.Results<T> | undefined = realm.create(
      this.schemaName,
      row,
      Realm.UpdateMode.Modified
    );

    return entry;
  }
  /**
   * User creates a row to insert into the passed Realm
   * Then calls _create to perform the actual insertion
   *
   * @param realm Realm to insert into
   * @param args Any parameters necessary for creating row to insert
   */
  public create(realm: Realm, ...args: any[]): Realm.Results<T> | undefined {
    throw NotImplementedError("Querent.create");
  }
  public getOrCreate(realm: Realm, ...args: any[]): Realm.Results<T> {
    throw NotImplementedError("Querent.getOrCreate");
  }

  /**
   * Receives all entities associated with rating process
   * Decides how to group and weight ratings before calling _rate (1 entity for Node and 2 entities for Edge, instead of rating whole group)
   *
   * @param realm
   * @param entities
   * @param mood
   * @param rating
   * @param options
   */
  protected _group(
    realm: Realm,
    entities: string[],
    mood: string,
    rating: number,
    weights: number[],
    options: Dict<any> = {}
  ): {
    entity: Realm.Object & T;
    weight: number;
  }[] {
    throw NotImplementedError("Querent._groupAndRate");
  }

  /**
   * Executes rating process on a subset of entities (1 entity for Node and 2 entities for Edge, instead of rating whole group) and saves in Realm
   *
   * @param realm
   * @param mood
   * @param rating
   * @param weight
   * @param entities
   */
  protected _rate(
    mood: string,
    rating: number,
    weight: number,
    ...args: (Realm.Object & T)[]
  ) {
    throw NotImplementedError("Querent._rate");
  }

  /**
   * Public method for initiating rate process on a group of entities
   * Wraps subsequent calls within realm.write context
   *
   * @param realm
   * @param entities
   * @param mood
   * @param rating
   * @param options
   */
  public rate(
    realm: Realm,
    entities: (Realm.Object & T)[],
    mood: string,
    rating: number,
    weights: null | number | number[],
    options: Dict<any> = {}
  ) {
    // 1. Format weights as a number array

    // null to number
    if (weights === null) weights = 1 / entities.length;
    // number to number[]
    if (!Array.isArray(weights))
      weights = new Array(entities.length).fill(weights);

    // 2. Execute rating process
    realm.write(() => {
      const entityAndWeights: EntityAndWeights<T> = this._group(
        realm,
        entities,
        mood,
        rating,
        weights as number[],
        options
      );

      for (const { entity, weight } of entityAndWeights) {
        this._rate(mood, rating, weight, entity);
      }
    });
  }
}
