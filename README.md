# Lemonade

# TODO
https://to-do.live.com/tasks/id/AQMkADAwATM3ZmYAZS0xZTNlLTAwADNiLTAwAi0wMAoARgAAA9pjfO-eJGRDtgYlgN5czDoHANG8VvlXnS1GtBTkR9X4T0YAAAIBEgAAANG8VvlXnS1GtBTkR9X4T0YAAgTL5k4AAAA=

# SO FAR...

0. RealmSchema
    + schemaType: SchemaType;
    + realmPath: string;

    + name: string;
    + properties: Record<string, any>;
    + primaryKey: string | undefined;
    
    + static fromSchemaStr(blueprintRow: SchemaBlueprintRow)
    + save(defaultRealm: Realm, blueprintTableName: BlueprintTableName)
    + getSchemaObject(): RealmSchemaObject

1. RealmCache
    + cache (map of all currently open and available Realms)
    
    + add(realmPath: string, realmSchemas: Array<RealmSchema>, options: RealmOptions = {})
        - Opens a realm at the specified realmPath, with the supplied realmSchemas
        - Then caches the realm, using 'realmPath' as the key
    
    - Reads in Schema Blueprints from Default Realm
    - Saves all read Schema Blueprint in the SchemaCache as a Schema Class object (realmPath, schemaType, schema, ...)
    - Opens a Realm for each 'realmPath' that has been indexed in the SchemaCache, using all the Schemas cached under the realmPath
    - Adds Trends to TrendSchema

2. SchemaCache
    + cache
    ({
        realmPath: {
            schemaType: {
                schemaName: RealmSchema
            }
        }
    })
    
    + add(realmSchema: RealmSchema)
        - Destructures the realmSchema into keys to index the realmSchema in the cache
    
    + getByRealm(realmPath: string)
    + getBySchemaType(realmPath: string, schemaType: string)
    + getBySchemaName(realmPath: string, schemaType: string, schemaName: string)
    
    - Stores RealmSchemas in nested hierarchy
    - Fetches list of RealmSchemas from hierarchy

3. TrendCache
    + cache
    
    + add(realmPath: string, trendName: string)
        - Creates a new TrendTracker to add to the cache

# TODO
    
1. TrendTracker
    - Should own all Querents related to Trends, eg RelQuerent, SequentialRelQuerent, DayPartSeqRelQuerent, ...
    
3. RelQuerents
    - Complete 'reate' method

4. Add DayTracker:
    - Connects to default realm
    - Add Day and DayPart Realm schemas
    - Api to:
        - Add DayPart to Day
        - Query days
