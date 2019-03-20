const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js');
Page({
  data: {},
  onLoad(op) {
    util.http('Design/detail', {
      id: op.id
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          info: res.data,
          designerList:res.data.productionList
        })
        wx.setNavigationBarTitle({
          title: res.data.name
        })
        let details = res.data.content;
        WxParse.wxParse('details', 'html', details, this, 0)
      }
    })
  },
  designerList(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../designerPieces/designerPieces?id=' + id
    })
  }
})