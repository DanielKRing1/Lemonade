import {DEFAULT_PATH} from '../../../constants/Realm';
import RealmSchemaName from '../../schemaNames';

import {InstantiateAbstractClassError, NotImplementedError} from '../../../Errors';

export class SchemaBlueprintRow {
  schemaType: SchemaTypeEnum;
  realmPath: string;

  name: string;
  properties: Record<string, any>;
  primaryKey: string | undefined;

  static getBlueprintSchema() {
    return new SchemaBlueprintRow(
      SchemaTypeEnum.Blueprint,
      DEFAULT_PATH,
      RealmSchemaName.SchemaBlueprint,
      {
        schemaName: 'string',
        realmPath: 'string',
        schemaStr: 'string',
      },
      'schemaName',
    );
  }

  static fromBlueprintRowObj(blueprintRow: SchemaBlueprintRowObj) {
    const {schemaStr, schemaType, realmPath} = blueprintRow;

    const schemaObj: Realm.ObjectSchema = JSON.parse(schemaStr);
    const {name, primaryKey, properties} = schemaObj;

    return new SchemaBlueprintRow(schemaType, realmPath, name, properties, primaryKey);
  }

  constructor(schemaType: SchemaTypeEnum, realmPath: string, name: string, properties: Record<string, any>, primaryKey?: string) {
    if (this.constructor === SchemaBlueprintRow) throw new InstantiateAbstractClassError('SchemaBlueprintRow');

    this.schemaType = schemaType;
    this.realmPath = realmPath;

    this.name = name;
    this.properties = properties;
    this.primaryKey = primaryKey;
  }

  save(defaultRealm: Realm): SchemaBlueprintRowObj {
    const schemaBlueprint: SchemaBlueprintRowObj = this.getSchemaBlueprintRowObj();

    defaultRealm.write(() => {
      defaultRealm.create(RealmSchemaName.SchemaBlueprint, schemaBlueprint);
    });

    return schemaBlueprint;
  }

  /**
   * Formats object instance into a plain object that can be used to open Realms
   */
  getSchemaObject(): Realm.ObjectSchema {
    return {
      name: this.name,
      primaryKey: this.primaryKey,
      properties: this.properties,
    };
  }

  getSchemaBlueprintRowObj(): SchemaBlueprintRowObj {
    const schemaObj: Realm.ObjectSchema = this.getSchemaObject();
    const schemaStr = JSON.stringify(schemaObj);

    const schemaBlueprint: SchemaBlueprintRowObj = {
      schemaName: this.name,
      schemaType: this.schemaType,
      realmPath: this.realmPath,
      schemaStr,
    };

    return schemaBlueprint;
  }
}
