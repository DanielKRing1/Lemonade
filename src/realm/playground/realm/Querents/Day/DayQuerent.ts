import Realm from "realm";
import { Override } from "../../Base";
import { NotImplementedError } from "../../Errors";

import Querent from "../Base/Querent";

export default class DayQuerent extends Querent<TrendDay> {
  protected _group(realm: Realm, entities: string[], weights: number[], options: Record<string, any>): EntityWeight<Realm.Results<TrendDay>>[] {
    throw NotImplementedError();
  }
  protected _rate(mood: string, rating: number, weight: number, entity: Realm.Results<TrendDay> & TrendDay): number {
    throw NotImplementedError();
  }
  constructor(realmPath: string, schemaName: string) {
    super(realmPath, schemaName);
  }

  /**
   * Accepts an object to insert into a Realm
   *
   * @param realm
   * @param entityObj
   */
  create(
    realm: Realm,
  ): Realm.Results<TrendDay> | undefined {
    const dayObj: TrendDay = {
        date: new Date(),
        dayParts: [],
        trendSnapshots: [],
    };

    const realmRel = this._create(realm, dayObj);
    return realmRel;
  }

  @Override('Querent');
  get(realm: Realm, create: boolean, date: Date = new Date()): Realm.Results<TrendDay> {
    let day: Realm.Results<TrendDay> | undefined = this.getById(realm, date);

    // Optionally create if does not exist
    if (create && day === undefined) day = this.create(realm);

    return day as Realm.Results<TrendDay>;
  }

  @Override('Querent');
  public rate(realm: Realm, entityIds: string[], mood: string, rating: number, weights: null | number | number[], options: Dict<any> & {trendSnapshot: TrendSnapshot}): void {
    // 1. Get metadata from options
    const newTrendSnapshot: TrendSnapshot = options.trendSnapshot;
    
    // 2. Get the current TrendDay from Realm, create if does not exist
    const day: Realm.Results<TrendDay> = this.get(realm, true);

    realm.write(() => {
        // 3. Record rating as a TrendDayPart under the TrendDay
      const newDayPart: TrendDayPart = {
          date: new Date(),
          entities: entityIds,
          mood,
          expectedMood: 'unknown',
          rating,
          expectedRating: -1,
        }
        day[0].dayParts.push(newDayPart);

        // 4. Add new TrendSnapshot to the TrendDay's snapshots if it is not already recorded
        if(!day[0].trendSnapshots.some((existingTrendSnapshot: TrendSnapshot) => existingTrendSnapshot.trendName === newTrendSnapshot.trendName)) day[0].trendSnapshots.push();
    });
  }
}
