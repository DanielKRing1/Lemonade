import {DEFAULT_PATH} from '../../../../constants';
import {Singleton} from '../Base';
import {RealmCache, SchemaCache, TrendCache} from './Caches';
import {RealmUtils} from './Utility';

import {SchemaBlueprint} from './Schema/SchemaBlueprint';
import {TrendBlueprint} from './Trends/TrendBlueprints';
import {TrendTracker} from './Trends';
import NodeQuerent from '../Querents/Nodes/NodeQuerent';
import EdgeQuerent from '../Querents/Base/EdgeQuerent';

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

  /**
   * Get most influential nodes in graph
   *
   * @param trendName
   * @param mood
   */
  public getMostInfluentialOfAll(trendName: string, mood: string) {
    // 1. Get Realm associate with the given Trend
    const realm: Realm = this.getTrendRealm(trendName);

    // 2. Execute PageRank on all nodes
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
