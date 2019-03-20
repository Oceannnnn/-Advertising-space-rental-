// pages/category/category.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {

  },
  onLoad(op) {
    this.init(op);
  },
  init(op) {
    util.http('Gener/index', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          gener: res.data
        })
      }
    })
    this.setData({
      type:op.type
    })
  },
  toContent(e){
    let type = this.data.type;
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    if (type == 1) {
      wx.navigateTo({
        url: '../informationRelease/informationRelease?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '../contentList/contentList?id=' + id + '&title=' + title,
      })
    }

  }
})