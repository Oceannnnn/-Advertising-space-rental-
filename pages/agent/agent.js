// pages/ad/ad.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    agent: [],
    isChoose: 0
  },
  onLoad(op) {
    if (op.isChoose) {
      this.setData({
        isChoose: op.isChoose
      })
    }
    this.setData({
      id: op.id
    })
    this.agent(1, op.id)
  },
  bindDesigner(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../designer/designer?id=' + id
    })
  },
  bindBack(e) {
    let index = e.currentTarget.dataset.index;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2] //上一个页面
    let agent = this.data.agent;
    let price = '';
    let name = agent[index].name;
    let id = agent[index].id;
    let pic = agent[index].pic;
    let token = app.globalData.token;
    util.http('pay/countDesignPrice', { design_id: id }, 'post', token).then(res => {
      if (res.code == 200) {
        prevPage.setData({
          design_id: id,
          design_name: name,
          design_price: res.data,
          design_pic: pic,
          design: 1
        })
        wx.navigateBack() 
      }
    })
  },
  choose() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      design_id: '',
      design_price: 0,
      design: 1
    })
    wx.navigateBack()
  },
  agent(page, id) {
    let json = {
      pageSize: 10,
      current: page,
      ad_id: id
    }
    let list = this.data.agent;
    util.http('Design/getMore', json, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          agent: list
        })
      } else if (res.code == 0) {
        if (page > 1) {
          wx.showToast({
            title: '没有数据啦！',
            icon: 'none',
            duration: 2000
          })
          this.data.onBottom = false;
        }
      }
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.agent(this.data.page, this.data.id);
    }
  }
})