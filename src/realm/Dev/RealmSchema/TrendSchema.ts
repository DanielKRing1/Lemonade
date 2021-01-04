import {RealmSchema} from './RealmSchema';
import BlueprintTableName from '../BlueprintTableName';

export class TrendSchema extends RealmSchema {
  constructor(realmPath: string, name: string, properties: Record<string, any>, primaryKey?: string) {
    super(SchemaType.Trend, realmPath, name, properties, primaryKey);
  }

  save(defaultRealm: Realm, blueprintTableName: BlueprintTableName = BlueprintTableName.TrendBlueprint) {
    super.save(defaultRealm, blueprintTableName);
  }
}
