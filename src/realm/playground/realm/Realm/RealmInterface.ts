import {DEFAULT_PATH} from '../../../../constants';
import {Singleton} from '../Base';
import {RealmCache, SchemaCache, TrendCache} from './Caches';
import {RealmUtils} from './Utility';

import {SchemaBlueprint} from './Schema/SchemaBlueprint';
import {TrendBlueprint} from './Trends/TrendBlueprints';
import {TrendTracker} from './Trends';
import NodeQuerent from '../Querents/Nodes/NodeQuerent';
import EdgeQuerent from '../Querents/Base/EdgeQuerent';
import {realmPageRank, RedistributionOptions} from '../../util/graph/RealmPageRank';
import DayQuerent from '../Querents/Day/DayQuerent';

export class RealmInterface extends Singleton(Object) {
  private _realmCache: RealmCache;
  private _schemaCache: SchemaCache;
  private _trendCache: TrendCache;

  constructor() {
    super();

    this._realmCache = new RealmCache();
    this._schemaCache = new SchemaCache();
    this._trendCache = new TrendCache();

    return this.getSingleton() as RealmInterface;
  }

  // TREND API

  public addTrend(trendName: string, trendProperties: string[], options?: Dict<string>): SchemaBlueprint[] | undefined {
    const realmPath = DEFAULT_PATH;

    // 1. Add to TrendCache
    this._trendCache.add(trendName, {realmPath, trendProperties});
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;

    // 2. Save TrendBlueprint to disk
    trendTracker.getTrendBlueprint().save(this._realmCache.getDefault());

    // 3. Get list of relevant SchemaBlueprints from TrendBlueprint
    const completeTrendSB: CompleteTrendSB = trendTracker.getTrendBlueprint().toSchemaBlueprints();
    const schemaBlueprints: SchemaBlueprint[] = Object.values(completeTrendSB);

    // 4. Add Schemas to SchemaCache, will reload Realm in RealmCache
    const addedSchemas: SchemaBlueprint[] | undefined = this._addSchemas(realmPath, schemaBlueprints, options);

    return addedSchemas;
  }
  public rmTrend(trendName: string, options?: Dict<string>): Array<SchemaBlueprint> | undefined {
    const defaultRealmPath = DEFAULT_PATH;

    // 1. Rm from TrendCache
    const trendBlueprint: TrendBlueprint | undefined = this._trendCache.rm(trendName) as TrendBlueprint | undefined;

    if (!!trendBlueprint) {
      // 2. Delete TrendBlueprint from disk
      trendBlueprint.delete(this._realmCache.getDefault());

      // 3. Get Schema names to remove from SchemaCache
      const completeTrendSB: CompleteTrendSB = trendBlueprint.toSchemaBlueprints();
      const schemaNamesToRm: string[] = Object.values(completeTrendSB).map((sb: SchemaBlueprint) => sb.schemaName);

      // 4. Rm from SchemaCache, will reload Realm in RealmCache
      const remainingSchemas: SchemaBlueprint[] | undefined = this._rmSchemas(defaultRealmPath, schemaNamesToRm, options);

      return remainingSchemas;
    }
  }

  // Trend entities
  public addExistingTrendEntities(trendName: string, trendEntitiesToAdd: string[]) {
    // 1. Get TrendTracker from TrendCache
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;

    // 2. Get Realm from RealmCache
    const realm: Realm = this._realmCache.get(trendTracker.getTrendBlueprint().getRealmPath()) as Realm;

    // 3. Save TrendBlueprint to disk
    trendTracker.getTrendBlueprint().addExistingTrendEntities(realm, trendEntitiesToAdd);
  }

  public rmExistingTrendEntities(trendName: string, trendEntitiesToRm: string[]) {
    // 1. Get TrendTracker from TrendCache
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;

    // 2. Get Realm from RealmCache
    const realm: Realm = this._realmCache.get(trendTracker.getTrendBlueprint().getRealmPath()) as Realm;

    // 3. Save TrendBlueprint to disk
    trendTracker.getTrendBlueprint().rmExistingTrendEntities(realm, trendEntitiesToRm);
  }

  // Trend entity tags
  public addExistingTrendTags(trendName: string, trendTagsToAdd: string[]) {
    // 1. Get TrendTracker from TrendCache
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;

    // 2. Get Realm from RealmCache
    const realm: Realm = this._realmCache.get(trendTracker.getTrendBlueprint().getRealmPath()) as Realm;

    // 3. Save TrendBlueprint to disk
    trendTracker.getTrendBlueprint().addExistingTrendTags(realm, trendTagsToAdd);
  }

  public rmExistingTrendTags(trendName: string, trendTagsToRm: string[]) {
    // 1. Get TrendTracker from TrendCache
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;

    // 2. Get Realm from RealmCache
    const realm: Realm = this._realmCache.get(trendTracker.getTrendBlueprint().getRealmPath()) as Realm;

    // 3. Save TrendBlueprint to disk
    trendTracker.getTrendBlueprint().rmExistingTrendTags(realm, trendTagsToRm);
  }

  /**
   * Get list of available Trends in TrendCache
   */
  public getTrendNames(): string[] {
    return this._trendCache.getKeys();
  }

  /**
   * Get properties of a Trend in TrendCache
   *
   * @param trendName String, Trend with properties in TrendCache
   */
  public getTrendProperties(trendName: string): string[] | undefined {
    const trendTracker: TrendTracker | undefined = this._trendCache.get(trendName);

    if (!!trendTracker) return trendTracker.getTrendBlueprint().getProperties();
  }

  // REALM API

  public loadRealms(options: Dict<any> = {}): LoadedBlueprints {
    // 1. Read the TrendBlueprints from disk
    const loadedBlueprints: LoadedBlueprints = this._realmCache.load();

    // 2. Add the TrendBlueprints to the app the same way a new, user-added Trend would be added
    loadedBlueprints[BlueprintNameEnum.Trend].forEach((trendBlueprint) => this.addTrend(trendBlueprint.getTrendName(), trendBlueprint.getProperties(), options));

    return loadedBlueprints;
  }

  private addRealm(realmPath: string, valueParams: {schemaBlueprints: Array<SchemaBlueprint>; options?: any}) {
    this._realmCache.add(realmPath, valueParams);
  }
  private rmRealm(realmPath: string, options?: any) {
    this._realmCache.rm(realmPath, options);
  }

  // SCHEMA API

  private _addSchemas(realmPath: string, schemaBlueprints: SchemaBlueprint[], options?: Dict<string>): SchemaBlueprint[] | undefined {
    // 1. Get Realm
    const realm = this._realmCache.get(realmPath);

    if (!!realm) {
      // SAVE (TREND) SCHEMABLUEPRINTS BEFORE CALLING THIS METHOD
      // 2. Save SchemaBlueprint to Realm
      // schemaBlueprints.forEach((schemaBlueprint: SchemaBlueprint) => schemaBlueprint.save(realm));

      // 3. Reload Realm with added SchemaBlueprints
      const allSchemas: Array<SchemaBlueprint> = RealmUtils.mergeSchemasFromRealm(realm, schemaBlueprints);
      // NOTE: Adding also reloads the Realm
      this.addRealm(realmPath, {
        schemaBlueprints: allSchemas,
        options,
      });

      // 4. Add to SchemaCache
      schemaBlueprints.forEach((schemaBlueprint) => this._schemaCache.add(schemaBlueprint.schemaName, {schemaBlueprint}));

      return schemaBlueprints;
    }
  }

  private _rmSchemas(realmPath: string, schemaNames: string[], options?: Dict<string>): SchemaBlueprint[] | undefined {
    // 1. Get Realm
    const realm: Realm | undefined = this._realmCache.get(realmPath);

    // 2. Get SchemaBlueprints to remove
    const schemaBlueprints: SchemaBlueprint[] = schemaNames
      .map((schemaName: string) => this._schemaCache.get(schemaName))
      .filter((schemaBlueprint: SchemaBlueprint | undefined) => schemaBlueprint !== undefined) as SchemaBlueprint[];

    if (!!realm) {
      // 3. Remove SchemaBlueprints from Realm
      // schemaBlueprints.forEach((schemaBlueprint: SchemaBlueprint) => schemaBlueprint.delete(realm));

      // 4. Reload Realm without Schemas
      const schemaNamesToRm: string[] = schemaBlueprints.map((sb) => sb.schemaName);
      const remainingSchemas: Array<SchemaBlueprint> = RealmUtils.filterSchemasfromRealm(realm, schemaNamesToRm);
      // NOTE: Adding also reloads the Realm
      this.addRealm(realmPath, {
        schemaBlueprints: remainingSchemas,
        options,
      });

      // 5. Remove from SchemaCache
      schemaBlueprints.forEach((schemaBlueprint) => this._schemaCache.rm(schemaBlueprint.schemaName));

      return remainingSchemas;
    }
  }

  // PUBLIC RATING API

  public rate(trendName: string, entityIds: string[], tags: string[], mood: string, rating: number, weights: null | number | number[], options: Dict<any>): void {
    // 1. Get Realm associate with the given Trend
    const realm: Realm = this.getTrendRealm(trendName);

    // 2. Rate through the given trendName's TrendTracker

    // At this point, Trend should have been loaded/added to TrendCache
    // If not, then where did the user get this trendName? The UI should only offer existing Trends
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;
    trendTracker.rate(realm, entityIds, tags, mood, rating, weights, options);
  }

  // PUBLIC QUERENT API

  // PAGE RANK API

  /**
   * Get most influential nodes in graph
   *
   * @param trendName
   * @param mood
   */
  public getMostInfluentialOfAll(trendName: string, nodeType: SchemaTypeEnum.TREND_NODE | SchemaTypeEnum.TAG_NODE, mood: string, iterations: number, dampingFactor: number = 0.85) {
    // 1. Create empty redistribution options, ie do not redistribute weights.
    // Instead, just get the most influential nodes in the Realm graph, as is
    const emptyOptions: RedistributionOptions = {
      targetCentralWeight: 0,
      centralNodeIds: [],
    };

    // 2. Execute PageRank on all nodes
    const mostInfluentialNodes: Dict<Dict<number>> = this.getPageRank(trendName, nodeType, mood, iterations, dampingFactor, emptyOptions);

    return mostInfluentialNodes;
  }

  /**
   * Get most influential nodes in graph
   *
   * @param trendName
   * @param mood
   */
  public getMostInfluentialOfToday(
    trendName: string,
    nodeType: SchemaTypeEnum.TREND_NODE | SchemaTypeEnum.TAG_NODE,
    mood: string,
    iterations: number,
    dampingFactor: number = 0.85,
    redistributionOptions: RedistributionOptions,
  ) {
    // 1. Execute PageRank on all nodes
    const mostInfluentialNodes: Dict<Dict<number>> = this.getPageRank(trendName, nodeType, mood, iterations, dampingFactor, redistributionOptions);

    return mostInfluentialNodes;
  }

  /**
   * Get most influential nodes in graph
   *
   * @param trendName
   * @param mood
   */
  private getPageRank(
    trendName: string,
    nodeType: SchemaTypeEnum.TREND_NODE | SchemaTypeEnum.TAG_NODE,
    mood: string,
    iterations: number,
    dampingFactor: number = 0.85,
    redistributionOptions: RedistributionOptions,
  ) {
    // 1. Get Realm associate with the given Trend
    const realm: Realm = this.getTrendRealm(trendName);

    // 2. Get TrendTracker and Node/Edge Querents for given Trend
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;
    // Get appropriate trend Node Querent
    const nodeQ: NodeQuerent = trendTracker.getNodeQ(nodeType);
    // Get appropriate trend Edge Querent
    const edgeType: SchemaTypeEnum = nodeType === SchemaTypeEnum.TREND_NODE ? SchemaTypeEnum.TREND_EDGE : SchemaTypeEnum.TAG_EDGE;
    const edgeQ: EdgeQuerent = trendTracker.getEdgeQ(edgeType);

    // 3. Construct args for Page Rank
    const trendBlueprint: TrendBlueprint = this._trendCache.get(trendName)?.getTrendBlueprint() as TrendBlueprint;
    const allNodes: TrendNode[] = Array.from(nodeQ.getAll(realm) as Realm.Results<TrendNode>);
    const allEdges: TrendEdge[] = Array.from(edgeQ.getAll(realm) as Realm.Results<TrendEdge>);

    // 4. Execute PageRank on all nodes
    const mostInfluentialNodes: Dict<Dict<number>> = realmPageRank(trendBlueprint, allNodes, allEdges, iterations, dampingFactor, redistributionOptions);

    return mostInfluentialNodes;
  }

  /**
   * Get all nodes connected by an edge to the given node
   *
   * Requires access to both Node Querent and Edge Querent
   *
   * @param trendName
   * @param nodeId
   * @param nodeType Either SchemaTypeEnum.TREND_NODE or SchemaTypeEnum.TAG_NODE, determines whether to query the Trend's main Trend Schema or the Tag Schema
   */
  public getConnectedNodes(trendName: string, nodeId: string, nodeType: SchemaTypeEnum.TREND_NODE | SchemaTypeEnum.TAG_NODE = SchemaTypeEnum.TREND_NODE): TrendNode[] {
    // 0. Init TrendNode array to return
    const connectedNodes: TrendNode[] = [];

    // 1. Get Realm associate with the given Trend
    const realm: Realm = this.getTrendRealm(trendName);

    // 2. Get TrendTracker and Node/Edge Querents for given Trend
    const trendTracker: TrendTracker = this._trendCache.get(trendName) as TrendTracker;
    // Get appropriate trend Node Querent
    const nodeQ: NodeQuerent = trendTracker.getNodeQ(nodeType);
    // Get appropriate trend Edge Querent
    const edgeType: SchemaTypeEnum = nodeType === SchemaTypeEnum.TREND_NODE ? SchemaTypeEnum.TREND_EDGE : SchemaTypeEnum.TAG_EDGE;
    const edgeQ: EdgeQuerent = trendTracker.getEdgeQ(edgeType);

    // 3. Get node from NodeQuerent
    const nodeRealmResults: Realm.Results<TrendNode> = nodeQ.getById(realm, nodeId) as Realm.Results<TrendNode>;
    // Short circuit
    if (nodeRealmResults.length === 0) return connectedNodes;
    const node: TrendNode = nodeRealmResults[0];

    // 4. Get edges connected to the node
    node.edges.forEach((edgeId: string) => {
      // 4.1. Get edge from EdgeQuerent
      const edgeRealmResults: Realm.Results<TrendEdge> = edgeQ.getById(realm, edgeId) as Realm.Results<TrendEdge>;
      const edge: TrendEdge = edgeRealmResults[0];

      // 4.2. Get connected node on 'other side' of edge
      // It's either index 0 or 1, whichever index is not the given 'nodeId'
      const connectedNodeId: string = edge.nodes[0] !== nodeId ? edge.nodes[0] : edge.nodes[1];

      const connectedNodeRealmResults: Realm.Results<TrendNode> = nodeQ.getById(realm, connectedNodeId) as Realm.Results<TrendNode>;
      const connectedNode: TrendNode = connectedNodeRealmResults[0];

      // 4.3. Add to list of influential nodes
      connectedNodes.push(connectedNode);
    });

    return connectedNodes;
  }

  /**
   * Get most influential nodes connected by an edge to the given node
   *
   * @param trendName
   * @param nodeId
   * @param mood
   */
  public getMostInfluentialOfNode(trendName: string, nodeId: string, mood: string, nodeType: SchemaTypeEnum.TREND_NODE | SchemaTypeEnum.TAG_NODE = SchemaTypeEnum.TREND_NODE): TrendNode[] {
    // 1. Get connected nodes
    const connectedNodes: TrendNode[] = this.getConnectedNodes(trendName, nodeId, nodeType);

    // 2. Sort connected nodes: Most 'influential' first
    const moodKey: string = TrendBlueprint.genPropertyKey(mood);
    connectedNodes.sort((a: TrendNode, b: TrendNode) => b[moodKey] - a[moodKey]);

    return connectedNodes;
  }

  /**
   * Get the dominant mood for each day since the given 'startDate'
   *
   * @param trendName The Trend to query on for past days
   * @param startDate The date to start querying from for the given Trend's history
   */
  public getDailyMoods(trendName: string, startDate: Date): string[] {
    // 0. Define a callback method to get the dominant mood for a given day
    const getDominantMood = (day: TrendDay): string => {
      // 0.1. Iterate over the TrendDayParts
      const moodWeights: Dict<number> = day.dayParts.reduce((acc: Dict<number>, cur: TrendDayPart) => {
        const {mood, rating} = cur;
        const entityCount: number = cur.entities.length;
        const moodWeight: number = entityCount * rating;

        // 0.2. Record the # of entities associated with each mood
        if (!acc.hasOwnProperty(mood)) acc[mood] = 0;
        acc[mood] += moodWeight;

        return acc;
      }, {});

      // 0.3. Sort moods, so moods with most weight are at the beginning of the array
      const moodWeightArr: Dict<string | number>[] = Object.keys(moodWeights).map((moodName: string, i) => ({x: moodName, y: moodWeights[moodName]}));
      moodWeightArr.sort((a: Dict<string | number>, b: Dict<string | number>) => (b.y as number) - (a.y as number));

      // 0.4. Get most weighted mood
      const dominantMood: string = moodWeightArr[0].x as string;
      return dominantMood;
    };

    // 1. Get Trend Realm
    const realm: Realm = this.getTrendRealm(trendName);

    // 2. Get DayQuerent
    const dayQ: DayQuerent = this._trendCache.get(trendName)?.getDailyQ() as DayQuerent;

    // 3. Get all daily entries for given Trend from the given startDate, as POJO's
    const allDays: TrendDay[] = (dayQ.getAllAsPojos(realm) as TrendDay[]).filter((day: TrendDay) => day.date >= startDate);

    // 4. Sort days by ascending Date
    // TODO Make sure Realm stores 'Date' as an actual date object, not as a ms timestamp
    // If not a Date object, update TrendDay.date's declared type to the appropriate type and also update the way TrendDays are sorted here
    allDays.sort((a: TrendDay, b: TrendDay) => a.date.getTime() - b.date.getTime());

    // 5. Record dominant mood for each day
    const dominantMoods: string[] = allDays.map(getDominantMood);

    return dominantMoods;
  }

  public getNodeDailyMoods = (trendName: string, nodeName: string, startDate: Date) => {
    // 1. Get Trend Realm
    const realm: Realm = this.getTrendRealm(trendName);

    // 2. Get DayQuerent
    const dayQ: DayQuerent = this._trendCache.get(trendName)?.getDailyQ() as DayQuerent;

    // 3. Get all daily entries for given Trend from the given startDate, as POJO's
    const allDays: TrendDay[] = (dayQ.getAllAsPojos(realm) as TrendDay[]).filter((day: TrendDay) => day.date >= startDate);

    // 4. Sort days by ascending Date
    // TODO Make sure Realm stores 'Date' as an actual date object, not as a ms timestamp
    // If not a Date object, update TrendDay.date's declared type to the appropriate type and also update the way TrendDays are sorted here
    allDays.sort((a: TrendDay, b: TrendDay) => a.date.getTime() - b.date.getTime());

    // 5. Get moods for each day
    type DailyMoods = {date: Date; moods: Dict<number>}[];
    const dailyMoods: DailyMoods = allDays.reduce((acc: DailyMoods, day: TrendDay) => {
      // 5.1 Get the current date
      const date: Date = day.date;

      // 5.2. Drill down to the given trend name
      const trendSnapshot: TrendSnapshot | undefined = day.trendSnapshots.find((trendSnapshot: TrendSnapshot) => trendSnapshot.trendName === trendName);
      if (!trendSnapshot) return acc;

      // 5.3. Drill further down to the given node name
      const entitySnapshot: EntitySnapshot | undefined = trendSnapshot?.entitySnapshots.find((entitySnapshot: EntitySnapshot) => entitySnapshot.entityName === nodeName);
      if (!entitySnapshot) return acc;

      // 5.4. Drill to the 'bottom' and get the moods associated with the given Trend.Node for the current day
      const moodSnapshot: MoodSnapshot[] | undefined = entitySnapshot?.moodSnapshots;
      if (!moodSnapshot) return acc;

      // 5.5. Format the moods
      const moodDict: Dict<number> = moodSnapshot!.reduce((acc2: Dict<number>, cur: MoodSnapshot) => {
        const {moodName, rating} = cur;
        acc2[moodName] = rating;

        return acc2;
      }, {});

      // 5.6. Add snapshot to list
      const snapshot = {
        date,
        moods: moodDict,
      };
      acc.push(snapshot);

      return acc;
    }, []);

    return dailyMoods;
  };

  // PRIVATE UTILS

  private getTrendRealm(trendName: string): Realm {
    // 1. Get trend's schema name
    // Must choose a specific schema to query on, so just use the node schema to get the realmPath
    const trendNodeSchemaName: string = TrendBlueprint.genSchemaName(trendName, SchemaTypeEnum.TREND_NODE);

    // 2. Get Realm
    const realm: Realm = this.getRealm(trendNodeSchemaName);

    return realm;
  }

  private getRealm(schemaName: string): Realm {
    // 1. Get realmPath
    const realmPath: string = this._schemaCache.getRealmPath(schemaName) as string;

    // 2. Get Realm
    const realm: Realm = this._realmCache.get(realmPath) as Realm;

    return realm;
  }
}
