// pages/allorder/allorder.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    currentId: 0,
    HeaderList: [{
      name: "待支付",
      id: 0,
    }, {
      name: "已完成",
      id: 1,
    }],
    page: 1,
    onBottom: true,
    orderList: []
  },
  onLoad(op) {
    if (op.allorder) {
      this.setData({
        allorder: op.allorder,
        currentId:1
      })
    }
    this.orderList(1, 0)
  },
  orderList(page, id) {
    let json = {
      status: id,
      pageSize: 10,
      current: page
    }
    let list = this.data.orderList;
    let token = app.globalData.token;
    util.http('Order/index', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data != '') {
          for (let item of res.data) {
            list.push(item)
          }
          this.setData({
            orderList: list
          })
        } else {
          if (page > 1) {
            this.data.onBottom = false;
          }
        }
      } else if (res.code == -1) {
        util.clear()
      }
    })
  },
  toList(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      currentId: id,
      page: 1,
      onBottom: true,
      orderList: []
    })
    this.orderList(1, id)
  },
  orderDetails(e) {
    let id = e.currentTarget.dataset.id;
    let type = this.data.currentId;
    wx.navigateTo({
      url: '../orderDetails/orderDetails?id=' + id + '&type=' + type,
    })
  },
  transfer(e) {
    let id = e.currentTarget.dataset.id;
    let token = app.globalData.token;
    let that = this;
    util.http('Pay/waitPay', { order_id: id }, 'post', token).then(res => {
      if (res.code == 200) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000,
              success: function () {
                that.setData({
                  currentId: id,
                  page: 1,
                  onBottom: true,
                  orderList: []
                })
                that.orderList(1, 0)
              }
            })
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 1000
            })
          }
        })
      } else if (res.code == -1) {
        util.clear();
      }
    })
  },
  details(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.orderList(this.data.page, this.data.currentId);
    }
  },
  onUnload() { //如果页面被卸载时被执行
    if (this.data.allorder == 1) {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }
})