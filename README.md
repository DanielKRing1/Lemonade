# Lemonade

# TODO

1. Add TrendTrackerBuilder:
    - Owns connection to default realm
    - Api to:
        - Add new trend to track
    - Implementation to create new TrendTracker definitions from input trends and save to default realm
    
2. Add TrendTrackerManager:
    - Reads in all TrendTracker definitions from default realm
    - Stores all TrendTracker Schemas (indexed by realm path)
    - Use these Schemas to construct each realm
    - Owns map of TrendTrackers and passes in relevant realm
    
3. - Owns many realm connections: Connection to each trend-specific realm
    - Owns 
    
3. RelQuerent 

4. Add DayTracker:
    - Connects to default realm
    - Add Day and DayPart Realm schemas
    - Api to:
        - Add DayPart to Day
        - Query days
