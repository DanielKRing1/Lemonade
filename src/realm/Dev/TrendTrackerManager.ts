import RealmCache, {BlueprintMap} from './RealmCache';

import RealmSchema from '../schemaNames';

// Reads in all TrendTracker definitions from default realm
// Stores all TrendTracker Schemas (indexed by realm path)
// Use these Schemas to construct each realm
// Owns map of TrendTrackers and passes in relevant realm

class TrendTrackerManager {
  static blueprintMap: BlueprintMap = {};

  static init() {
    TrendTrackerManager.loadBlueprints();
    TrendTrackerManager.loadRealms();
  }

  static loadBlueprints() {
    // Load
    const defaultRealm = RealmCache.getDefaultRealm();
    const blueprints: Realm.Results<TrendBlueprint> = defaultRealm.objects(RealmSchema.TrendBlueprint);

    // Map to realmPath keys
    TrendTrackerManager.blueprintMap = blueprints.reduce((map: BlueprintMap, bp) => {
      if (!map[bp.realmPath]) map[bp.realmPath] = [];
      map[bp.realmPath].push(bp);

      return map;
    }, {});
  }

  static loadRealms() {
    RealmCache.addFromBlueprintMap(TrendTrackerManager.blueprintMap);
  }
}
// Init
TrendTrackerManager.init();

export default TrendTrackerManager;
