import {SchemaBlueprintRow} from './RealmSchema';
import BlueprintTableName from '../BlueprintTableName';

export class TrendSchemaBlueprintRow extends SchemaBlueprintRow {
  constructor(realmPath: string, name: string, properties: Record<string, any>) {
    const pk = 'id';
    properties = {
      ...properties,
      [pk]: 'string',
    };

    super(SchemaTypeEnum.Trend, realmPath, name, properties, pk);
  }

  save(defaultRealm: Realm): SchemaBlueprintRowObj {
    return super.save(defaultRealm);
  }
}
