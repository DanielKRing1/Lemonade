/**
 * This class maps to a Row in the default Realm's TrendDefinition Table
 *
 * It should be used to wrap all rows read from the TrendDefinition Table
 * Also has a static method that should be used to write new Trend schemas to the TrendDefinition Table
 *
 */

import RealmSchema from '../schemaNames';

import {DEFAULT_PATH} from '../../constants/Realm';
import {realmSchemaDefinitions} from '..';

class TrendBlueprint {
  trendName: string;
  realmPath: string;
  realmSchema: string;

  static writeNewTrend(trendName: string, realmPath: string = DEFAULT_PATH, trendBlueprint: Record<string, any>) {}

  constructor(trendName: string, realmPath: string, realmSchemaObj: Record<string, any>) {
    const a = {
      name: RealmSchema.TrendBlueprint,
      primaryKey: 'trendName',
      properties: {
        trendName: 'string',
        realmPath: 'string',
        realmSchema: 'string',
      },
    };

    this.trendName = trendName;
    this.realmPath = realmPath;
    this.realmSchema = JSON.stringify(realmSchemaObj);
  }
}
