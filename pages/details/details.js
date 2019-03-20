const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js');
Page({
  data: {
    num: 1,
    imgUrls: [],
    shopContent: "请选择时间",
    attrValueList: []
  },
  onLoad(op) {
    this.setData({
      id: op.id
    })
    this.init(op.id)
  },
  init(id) {
    let token = app.globalData.token;
    util.http('Position/detail', {
      ad_id: id
    }, 'post', token).then(res => {
      if (res.code == 200) {
        let details = res.data;
        let attrValueList = details.specList;
        attrValueList[0].state = 1;
        this.setData({
          pro_info: details,
          imgUrls: details.swiperList,
          attrValueList: attrValueList,
          collect: details.isCollected,
          shopMoney: details.money,
          shopContent: attrValueList[0].spec_name,
          shopMoney: attrValueList[0].spec_price,
          spec_id: attrValueList[0].id
        })
        let content = details.content;
        WxParse.wxParse('details', 'html', content, this, 0)
      }
    })
  },
  collect(e) {
    let collect = this.data.collect;
    if (app.globalData.state == 1) {
      let token = app.globalData.token;
      if (collect == 1) {
        collect = 0
      } else {
        collect = 1
      }
      this.setData({
        collect: collect
      })
      util.http('My/collect', {
        ad_id: this.data.id
      }, 'post', token).then(res => {})
    } else {
      wx.showModal({
        content: '为了您更好的体验，建议您先登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my',
            })
          }
        }
      })
    }
  },
  selectAttrValue(e) {
    let attrValueList = this.data.attrValueList;
    let index = e.currentTarget.dataset.index;
    for (var i = 0; i < attrValueList.length; i++) {
      attrValueList[i].state = 0;
    }
    attrValueList[index].state = 1;
    this.setData({
      attrValueList: attrValueList,
      shopContent: attrValueList[index].spec_name,
      shopMoney: attrValueList[index].spec_price,
      spec_id: attrValueList[index].id
    })
  },
  buy(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      type:type
    })
    this.close();
  },
  close() {
    this.setData({
      info: !this.data.info
    })
  },
  comfirm() {
    if (app.globalData.state != 1) {
      wx.showModal({
        content: '为了您更好的体验，建议您先登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my',
            })
          }
        }
      })
      return
    }
    wx.navigateTo({
      url: '../confirmationOrder/confirmationOrder?id=' + this.data.id + '&type=' + this.data.type + '&spec_id=' + this.data.spec_id
    })
  },
  onShareAppMessage(ops) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let url = "/" + currentPage.route;
    if (ops.from === 'button') {}
    return {
      title: '超级推荐' + this.data.pro_info.name,
      path: url + '?id=' + this.data.id
    }
  }
})