// pages/collection/collection.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    page: 1,
    onBottom: true,
    collectionList:[]
  },
  onLoad() {
    this.collectionList(1);
  },
  onReachBottom() {
    var page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.collectionList(this.data.page)
    }
  },
  collectionList(page){
    wx.showLoading({
      title: '加载中'
    });
    var list = this.data.collectionList;
    let token = app.globalData.token
    util.http('My/myCollect', {size: 10,page: page}, 'post',token).then(res => {
      if (res.code == 200) {
        if (res.data != '') {
          for (let item of res.data) {
            list.push(item)
          }
          this.setData({
            collectionList: list
          })
        } else {
          if (page > 1) {
            wx.showToast({
              title: '没有数据啦！',
              icon: 'none',
              duration: 2000
            })
            this.data.onBottom = false;
          }
        }
      }
    })
    wx.hideLoading()
  },
  details(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id
    })
  }
})