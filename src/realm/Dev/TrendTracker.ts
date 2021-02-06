import RealmCache from './RealmCache';

import EntityQuerent from '../Querents/EntityQuerent';
import DenseRelQuerent from '../Querents/DenseRelQuerent';
import SeqRelQuerent from '../Querents/SeqRelQuerent';
import DPSeqRelQuerent from '../Querents/DayPartSeqRelQuerent';

class TrendTracker {
  realmPath: string;
  trendName: string;

  entityQ: EntityQuerent;
  denseQ: DenseRelQuerent;
  seqQ: SeqRelQuerent;
  dpSeqQ: DPSeqRelQuerent;

  constructor(realmPath: string, trendName: string) {
    this.realmPath = realmPath;
    this.trendName = trendName;

    this.entityQ = new EntityQuerent(trendName);
    this.denseQ = new DenseRelQuerent(trendName);
    this.seqQ = new SeqRelQuerent(trendName);
    this.dpSeqQ = new DPSeqRelQuerent(trendName);
  }

  rate(entities: Array<string>, mood: string, rating: number, weights: null | number | Array<number>) {
    const realm = this.getRealm();

    // TODO Add weights to Querent.rate methods
    this.entityQ.rate(realm, entities, mood, rating, weights);
    this.denseQ.rate(realm, entities, mood, rating, weights);
    this.seqQ.rate(realm, entities, mood, rating, weights);
    this.dpSeqQ.rate(realm, entities, mood, rating, weights);
  }

  getRealm() {
    return RealmCache.get(this.realmPath);
  }
}

export default TrendTracker;
