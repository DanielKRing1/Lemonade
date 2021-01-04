import {DEFAULT_PATH} from '../../../constants/Realm';
import RealmSchemaName from '../../schemaNames';

import BlueprintTableName from '../BlueprintTableName';

import {InstantiateAbstractClassError, NotImplementedError} from '../../../Errors';

export class RealmSchema {
  schemaType: SchemaType;
  realmPath: string;

  name: string;
  properties: Record<string, any>;
  primaryKey: string | undefined;

  static getBlueprintSchema() {
    return new RealmSchema(
      SchemaType.Blueprint,
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

  static fromSchemaStr(blueprintRow: SchemaBlueprintRow) {
    const {schemaStr, schemaType, realmPath} = blueprintRow;

    const schemaObj: RealmSchemaObject = JSON.parse(schemaStr);
    const {name, primaryKey, properties} = schemaObj;

    return new RealmSchema(schemaType, realmPath, name, properties, primaryKey);
  }

  constructor(schemaType: SchemaType, realmPath: string, name: string, properties: Record<string, any>, primaryKey?: string) {
    if (this.constructor === RealmSchema) throw new InstantiateAbstractClassError('RealmSchema');

    this.schemaType = schemaType;
    this.realmPath = realmPath;

    this.name = name;
    this.properties = properties;
    this.primaryKey = primaryKey;
  }

  save(defaultRealm: Realm, blueprintTableName: BlueprintTableName) {
    defaultRealm.write(() => {
      const schemaObj: RealmSchemaObject = this.getSchemaObject();
      const schemaStr = JSON.stringify(schemaObj);

      const schemaBlueprint: SchemaBlueprintRow = {
        schemaName: this.name,
        schemaType: this.schemaType,
        realmPath: this.realmPath,
        schemaStr,
      };
      defaultRealm.create(blueprintTableName, schemaBlueprint);
    });
  }

  /**
   * Formats object instance into a plain object that can be used to open Realms
   */
  getSchemaObject(): RealmSchemaObject {
    return {
      name: this.name,
      primaryKey: this.primaryKey,
      properties: this.properties,
    };
  }
}
