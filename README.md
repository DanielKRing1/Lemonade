# Lemonade

# TODO

1. Add TrendTrackerBuilder:
    + realmConnection
    + def addTrendTracker(mood)
    
    - Owns connection to default realm
    - Api to:
        - Add schemas of new trends to track
    - Implementation to create new TrendTracker schema definitions from input and save to default realm
    
2. Add TrendTrackerManager:
    + trendTrackers (map)
    + def loadTrendTrackers()
    + def openRealm(realmPath)
        - Checks if path is in map, Uses map's Trendtrackers' schema defs to open Realms

    - Reads in all TrendTracker definitions from default realm
    - Stores all TrendTracker Schemas (indexed by realm path)
    - Use these Schemas to construct each realm
    - Owns map of TrendTrackers and passes in relevant realm
    
3. TrendTracker
    + realmPath
    + realm
    + schema

    - Owns realm connection to its trend
    
3. RelQuerent
    + trendName
    + def allMethods(realm)

4. Add DayTracker:
    - Connects to default realm
    - Add Day and DayPart Realm schemas
    - Api to:
        - Add DayPart to Day
        - Query days
