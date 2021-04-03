import {SchemaBlueprint} from './SchemaBlueprint';
import {filterForTrendAttrs} from '../Trends/trendDef';

export class TrendBlueprint extends SchemaBlueprint {
  constructor(schemaName: string, realmPath: string, schemaDef: Realm.ObjectSchema) {
    super(schemaName, realmPath, SchemaTypeEnum.TREND, schemaDef);
  }

  // TREND SCHEMA DEFINITION UTILITIES

  getAttributes() {
    const propertyNames = Object.keys(this.schemaDef.properties);

    return filterForTrendAttrs(propertyNames);
  }
}
