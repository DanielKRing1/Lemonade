import {Override} from '../../Base';
import {MetaDataBlueprint} from './MetaDataBlueprint';

export class SchemaBlueprint extends MetaDataBlueprint {
  constructor(schemaName: string, realmPath: string, schemaDef: Dict<any>) {
    super(schemaName, realmPath, BlueprintTypeEnum.SCHEMA, schemaDef);
  }

  @Override('Blueprint')
  public static save(realm: Realm, schemaName: string, realmPath: string, blueprintType: BlueprintTypeEnum, schemaDef: Realm.ObjectSchema): MetaDataBlueprint {
    const schemaBlueprint = new (<any>this.constructor)(schemaName, realmPath, blueprintType, schemaDef);
    schemaBlueprint.save(realm);

    return schemaBlueprint;
  }

  @Override('Blueprint')
  public getSchemaDefs(): Realm.ObjectSchema[] {
    return [this.schemaMetadata as Realm.ObjectSchema];
  }
}
