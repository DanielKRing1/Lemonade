import {NotImplementedError} from '../../Errors';

export abstract class MetaDataBlueprint implements SchemaBlueprintObj {
  schemaName: string;
  realmPath: string;
  blueprintType: BlueprintTypeEnum;
  schemaMetadata: Dict<any>;

  constructor(schemaName: string, realmPath: string, blueprintType: BlueprintTypeEnum, schemaMetadata: Dict<any>) {
    this.schemaName = schemaName;
    this.realmPath = realmPath;
    this.blueprintType = blueprintType;
    this.schemaMetadata = schemaMetadata;
  }

  // STATIC UTILITIES

  static METADATA_SCHEMA_DEF: Realm.ObjectSchema = {
    name: METADATA_SCHEMA_NAME,
    primaryKey: 'schemaName',
    properties: {
      schemaName: 'string',
      realmPath: 'string',
      blueprintType: 'string',
      schemaMetadata: 'string',
    },
  };

  //   CONVERSION

  static fromObj(obj: SchemaBlueprintObj): MetaDataBlueprint {
    const {schemaName, realmPath, blueprintType, schemaMetadata} = obj;

    return new (<any>this.constructor)(schemaName, realmPath, blueprintType, schemaMetadata);
  }

  static fromRow(rowObj: BlueprintRow): MetaDataBlueprint {
    const {schemaName, realmPath, blueprintType, schemaMetadataStr} = rowObj;
    const schemaMetadata = JSON.parse(schemaMetadataStr);

    const obj = {
      schemaName,
      realmPath,
      blueprintType,
      schemaMetadata,
    };

    return MetaDataBlueprint.fromObj(obj);
  }

  toObj(): SchemaBlueprintObj | any {
    return {
      schemaName: this.schemaName,
      realmPath: this.realmPath,
      blueprintType: this.blueprintType,
      schemaDef: this.schemaMetadata,
    };
  }

  toRow(): BlueprintRow {
    return {
      schemaName: this.schemaName,
      realmPath: this.realmPath,
      blueprintType: this.blueprintType,
      schemaMetadataStr: JSON.stringify(this.schemaMetadata),
    };
  }

  //   SAVE

  static save(...agrs: any[]): MetaDataBlueprint {
    throw NotImplementedError();
  }

  save(defaultRealm: Realm): void {
    const schemaBlueprintRow: BlueprintRow = this.toRow();

    defaultRealm.write(() => {
      defaultRealm.create(BlueprintNameEnum.METADATA, schemaBlueprintRow);
    });
  }

  delete(defaultRealm: Realm) {
    defaultRealm.write(() => {
      const realmObj: Realm.Results<any> | undefined = defaultRealm.objectForPrimaryKey(BlueprintNameEnum.METADATA, this.schemaName);

      if (realmObj) defaultRealm.delete(realmObj);
    });
  }

  public getBlueprintType(): BlueprintTypeEnum {
    return BlueprintTypeEnum.METADATA;
  }
  public abstract getSchemaDefs(): Realm.ObjectSchema[];
}
