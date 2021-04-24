describe('Traversing a linkingObject Realm reference', () => {
  beforeAll(async () => {});

  it('should be fast', async () => {
    let startTime: Date;

    function start() {
      startTime = new Date();
    }

    function end() {
      const timeDiff = Date.now().getTime() - startTime.getTime();
      // strip the ms
      timeDiff /= 1000;

      // get seconds
      var seconds = Math.round(timeDiff);
      console.log(seconds + ' seconds');
    }
  });
});
