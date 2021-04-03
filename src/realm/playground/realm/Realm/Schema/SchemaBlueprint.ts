import {DEFAULT_PATH} from '../../../../../constants';
import {filterForTrendAttrs} from '../Trends/trendDef';

export class SchemaBlueprint implements SchemaBlueprintObj {
  schemaName: string;
  realmPath: string;
  schemaType: SchemaTypeEnum;
  schemaDef: Realm.ObjectSchema;

  // STATIC UTILITIES

  static BLUEPRINT_SCHEMA_DEF: Realm.ObjectSchema = {
    name: SchemaNameEnum.SchemaBlueprint,
    primaryKey: 'schemaName',
    properties: {
      schemaName: 'string',
      realmPath: 'string',
      schemaType: 'string',
      schemaStr: 'string',
    },
  };
  static BLUEPRINT_SCHEMA: SchemaBlueprint = new SchemaBlueprint(SchemaNameEnum.SchemaBlueprint, DEFAULT_PATH, SchemaTypeEnum.Blueprint, SchemaBlueprint.BLUEPRINT_SCHEMA_DEF);

  constructor(schemaName: string, realmPath: string, schemaType: SchemaTypeEnum, schemaDef: Realm.ObjectSchema) {
    this.schemaName = schemaName;
    this.realmPath = realmPath;
    this.schemaType = schemaType;
    this.schemaDef = schemaDef;
  }

  //   CONVERSION

  static fromObj(obj: SchemaBlueprintObj): SchemaBlueprint {
    const {schemaName, realmPath, schemaType, schemaDef} = obj;

    return new SchemaBlueprint(schemaName, realmPath, schemaType, schemaDef);
  }

  static fromRow(rowObj: SchemaBlueprintRow): SchemaBlueprint {
    const {schemaName, realmPath, schemaType, schemaStr} = rowObj;
    const schemaDef = JSON.parse(schemaStr);

    const obj = {
      schemaName,
      realmPath,
      schemaType,
      schemaDef,
    };

    return SchemaBlueprint.fromObj(obj);
  }

  toObj(): SchemaBlueprintObj {
    return {
      schemaName: this.schemaName,
      realmPath: this.realmPath,
      schemaType: this.schemaType,
      schemaDef: this.schemaDef,
    };
  }

  toRow(): SchemaBlueprintRow {
    return {
      schemaName: this.schemaName,
      realmPath: this.realmPath,
      schemaType: this.schemaType,
      schemaStr: JSON.stringify(this.schemaDef),
    };
  }

  //   SAVE

  static save(realm: Realm, schemaName: string, realmPath: string, schemaType: SchemaTypeEnum, schemaDef: Realm.ObjectSchema): SchemaBlueprint {
    const schemaBlueprint = new SchemaBlueprint(schemaName, realmPath, schemaType, schemaDef);
    schemaBlueprint.save(realm);

    return schemaBlueprint;
  }

  save(defaultRealm: Realm): SchemaBlueprintRow {
    const schemaBlueprintRow: SchemaBlueprintRow = this.toRow();

    defaultRealm.write(() => {
      defaultRealm.create(SchemaNameEnum.SchemaBlueprint, schemaBlueprintRow);
    });

    return schemaBlueprintRow;
  }

  delete(defaultRealm: Realm): boolean {
    const primaryKey: string | undefined = this.schemaDef.primaryKey;

    if (primaryKey) {
      defaultRealm.write(() => {
        const realmObj: Realm.Results<any> | undefined = defaultRealm.objectForPrimaryKey(SchemaNameEnum.SchemaBlueprint, primaryKey);

        if (realmObj) defaultRealm.delete(realmObj);
      });
    }

    // No primary key or no entry found in realm
    return false;
  }

  // SCHEMA UTILITIES

  getAttributes() {
    const propertyNames = Object.keys(this.schemaDef.properties);

    return filterForTrendAttrs(propertyNames);
  }
}
