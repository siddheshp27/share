'use strict';

const { Contract } = require('fabric-contract-api');

class certificateContract extends Contract {
  async initLedger(ctx) {
    await ctx.stub.putState('test', 'test value');
    return 'success';
  }

  async addCid(ctx, userName, cid) {
    const data = JSON.parse(cid);
    const res = await ctx.stub.putState(userName, Buffer.from(JSON.stringify(data)));
    // return `Image Successfully uploaded by ${userName}`;
    return Buffer.from(JSON.stringify(data));
  }

  async getCid(ctx, userName) {
    let cidIterator = await ctx.stub.getHistoryForKey(userName);
    let cids = await this.getIteratorData(cidIterator);
    return JSON.stringify(cids);
  }
  async getSingleCid(ctx, userName) {
    let cid = await ctx.stub.getState(userName);
    let temp = JSON.parse(cid.toString());
    return JSON.stringify(temp);
  }

  async getIteratorData(iterator) {
    let resultArray = [];

    while (true) {
      let res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        const obj = JSON.parse(res.value.value.toString());
        resultArray.push(obj);
      }

      if (res.done) {
        await iterator.close();
        return resultArray;
      }
    }
  }
}

module.exports = certificateContract;
