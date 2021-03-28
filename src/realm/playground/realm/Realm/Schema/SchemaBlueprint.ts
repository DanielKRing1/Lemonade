import {DEFAULT_PATH} from '../../../../../constants';

export class SchemaBlueprint {
  schemaName: string;
  realmPath: string;
  schemaType: SchemaType;
  schemaDef: SchemaDef;

  // STATIC UTILITIES

  static BLUEPRINT_SCHEMA_DEF: SchemaDef = {
    name: SchemaName.SchemaBlueprint,
    primaryKey: 'schemaName',
    properties: {
      schemaName: 'string',
      realmPath: 'string',
      schemaType: 'string',
      schemaStr: 'string',
    },
  };
  static BLUEPRINT_SCHEMA: SchemaBlueprint = new SchemaBlueprint(SchemaName.SchemaBlueprint, DEFAULT_PATH, SchemaType.Blueprint, SchemaBlueprint.BLUEPRINT_SCHEMA_DEF);

  constructor(schemaName: string, realmPath: string, schemaType: SchemaType, schemaDef: SchemaDef) {
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

  static save(realm: Realm, schemaName: string, realmPath: string, schemaType: SchemaType, schemaDef: SchemaDef): SchemaBlueprint {
    const schemaBlueprint = new SchemaBlueprint(schemaName, realmPath, schemaType, schemaDef);
    schemaBlueprint.save(realm);

    return schemaBlueprint;
  }

  save(defaultRealm: Realm): SchemaBlueprintRow {
    const schemaBlueprintRow: SchemaBlueprintRow = this.toRow();

    defaultRealm.write(() => {
      defaultRealm.create(SchemaName.SchemaBlueprint, schemaBlueprintRow);
    });

    return schemaBlueprintRow;
  }
}
