// pages/designerPieces/designerPieces.js
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js');
Page({
  data: {

  },
  onLoad(op) {
    util.http('Design/proDetail', {
      id: op.id
    }, 'post').then(res => {
      if (res.code == 200) {
        let details = res.data.content;
        WxParse.wxParse('details', 'html', details, this, 0)
      }
    })
  },
})
