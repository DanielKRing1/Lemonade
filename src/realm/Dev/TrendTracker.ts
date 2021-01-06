import RealmCache from './RealmCache';

import DenseRelQuerent from '../Querents/DenseRelQuerent';
import SeqRelQuerent from '../Querents/SeqRelQuerent';
import DPSeqRelQuerent from '../Querents/DayPartSeqRelQuerent';

class TrendTracker {
  realmPath: string;
  trendName: string;

  denseQ: DenseRelQuerent;
  seqQ: SeqRelQuerent;
  dpSeqQ: DPSeqRelQuerent;

  constructor(realmPath: string, trendName: string) {
    this.realmPath = realmPath;
    this.trendName = trendName;

    this.denseQ = new DenseRelQuerent(trendName);
    this.seqQ = new SeqRelQuerent(trendName);
    this.dpSeqQ = new DPSeqRelQuerent(trendName);
  }

  getRealm() {
    RealmCache.get(this.realmPath);
  }
}

export default TrendTracker;
