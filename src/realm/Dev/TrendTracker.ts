class TrendTracker {
  trendName: string;
  realm: Realm;

  constructor(trendName: string, realm: Realm) {
    this.trendName = trendName;
    this.realm = realm;
  }
}

export default TrendTracker;
