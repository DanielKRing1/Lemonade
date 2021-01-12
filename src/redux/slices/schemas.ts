import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import memoize from 'lodash.memoize';

import RealmCache from '../../realm/Dev/RealmCache';
import TrendCache from '../../realm/Dev/TrendCache';
import RealmSchemaName from '../../realm/schemaNames';

import {RealmSchema} from '../../realm/Dev/RealmSchema';

const initialState: RealmSchemaTypeMap = {};

// THUNKS

const loadSchemas = createAsyncThunk(
  'schemas/loadSchemas',
  async (arg, {dispatch, getState}): Promise<Array<SchemaBlueprintRow>> => {
    try {
      // Load
      const defaultRealm = RealmCache.getDefaultRealm();
      const schemaBlueprints: Realm.Results<SchemaBlueprintRow> = await defaultRealm.objects(RealmSchemaName.SchemaBlueprint);

      // TODO Check that this actually converts to an Array
      return Array.from(schemaBlueprints);
    } catch (err) {
      console.log(`RealmCache._loadSchemaBlueprints error: ${err}`);

      return [];
    }
  },
);

export {loadSchemas};

// SELECTORS

const selectRealmPath = createSelector(
  (state: RealmSchemaTypeMap) => state,
  (state: RealmSchemaTypeMap) =>
    memoize((realmPath: RealmPath) => {
      const schemas = [];

      if (state.hasOwnProperty(realmPath)) {
        const schemaTypeMap = state[realmPath];

        for (let schemaType in schemaTypeMap) {
          const schemaTypeSchemas = Object.values(state[realmPath][schemaType as SchemaType]);
          schemas.push(...schemaTypeSchemas);
        }
      }

      return schemas;
    }),
);

const selectSchemaType = createSelector(
  (state: RealmSchemaTypeMap) => state,
  (state: RealmSchemaTypeMap) =>
    memoize((schemaType: SchemaType) => {
      const schemas = [];

      // For each realmPath
      for (let realmPath in state) {
        if (state.hasOwnProperty(realmPath) && state[realmPath].hasOwnProperty(schemaType)) {
          // Get values (schema objects) of state.realmPath.schemaType
          const schemaTypeSchemas = Object.values(state[realmPath][schemaType]);
          schemas.push(...schemaTypeSchemas);
        }
      }

      return schemas;
    }),
);

const selectSchemaName = createSelector(
  (state: RealmSchemaTypeMap) => state,
  (state: RealmSchemaTypeMap) =>
    memoize((schemaName: SchemaName) => {
      for (let realmPath in state) {
        const schemaTypeMap = state[realmPath];

        for (let schemaType in schemaTypeMap) {
          if (state[realmPath][schemaType as SchemaType].hasOwnProperty(schemaName)) return state[realmPath][schemaType as SchemaType][schemaName];
        }
      }
    }),
);

export {selectRealmPath, selectSchemaType, selectSchemaName};

// SLICE

export const schemasSlice = createSlice({
  name: 'schemas',
  initialState,
  reducers: {
    addSchemas(state, action: PayloadAction<Array<string>>) {
      const activities = action.payload;
    },
  },
  extraReducers: {
    [loadSchemas.fulfilled]: (state, action) => {
      const realmSchemas: Array<SchemaBlueprintRow> = action.payload;

      realmSchemas.forEach((realmSchema: SchemaBlueprintRow) => {
        const {realmPath, schemaType, schemaName, schemaStr} = realmSchema;

        // Add to state
        if (!state.hasOwnProperty(realmPath))
          state[realmPath] = {
            Blueprint: {},
            Trend: {},
          };
        if (!state[realmPath].hasOwnProperty(schemaType)) state[realmPath][schemaType] = {};

        const schemaObj: RealmSchemaObject = JSON.parse(schemaStr);
        state[realmPath][schemaType][schemaName] = schemaObj;

        // Add to TrendCache
        if (schemaType === SchemaType.Trend) TrendCache.add(realmPath, schemaName);
      });

      // TODO Load Realms
      // TODO Update method to read from Redux instead of SchemaCache
      RealmCache._loadAllRealms();
    },
  },
});

// ACTIONS
export const {addSchemas} = schemasSlice.actions;

// REDUCER
export default schemasSlice.reducer;
