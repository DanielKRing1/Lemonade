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

        // Init to state
        if (!state.hasOwnProperty(realmPath))
          state[realmPath] = {
            Blueprint: {},
            Trend: {},
          };
        if (!state[realmPath].hasOwnProperty(schemaType)) state[realmPath][schemaType] = {};

        // Add to state
        const schemaObj: RealmSchemaObject = JSON.parse(schemaStr);
        state[realmPath][schemaType][schemaName] = schemaObj;

        // Filter into TrendCache
        if (schemaType === SchemaType.Trend) TrendCache.add(realmPath, schemaName);
      });

      Object.keys(state).forEach((realmPath: string) => {
        // Unsafe? way to select, so do not expect this selector to notice changes made to state draft in this reducer
        const schemaObjs = selectRealmPath(state)(realmPath);
        RealmCache.add(realmPath, schemaObjs);
      });
    },
  },
});

// TODO
// 1. Async Thunk: Load Schemas
//    1.1. Read Schemas from Default Realm into Redux
//    1.2. Save Schemas to Redux state
//    1.3. For any Trend Schemas, add new Trend to TrendCache
//    1.4. Foreach 'realmPath', push all Schemas to RealmCache.addRealm

// 2. Async Thunk: Rate Day
//    2.1. Accept 'trendName', 'entities', 'rating', 'weights'
//    2.2. Get TrendTracker from TrendCache.get(trendName)
//    2.3. Get 'realmPath' from Redux state, using 'selectSchemaName' selector with 'trendName'
//    2.4. Get Realm from RealmCache.get(realmPath)
//    2.5. Call myTrendTracker.rate(realm, entities, rating, weights)
//    2.6. For each instance Querent, myTrendTracker calls Querent.rate(realm, entities, rating, weights)

// x. Async Thunk: Add Schema
//    x.1. Accept new Schema definition
//    x.2. Save to Default Realm
//    x.3. If is a Trend Schema, add new Trend to TrendCache
//    x.4. If is new 'realmPath', push new Schema to RealmCache.addRealm
//         Else, reopen Realm with this new Schema with RealmCache.reloadRealm (Maybe internally, this just calls RealmCache.addRealm)

// ACTIONS
export const {addSchemas} = schemasSlice.actions;

// REDUCER
export default schemasSlice.reducer;
