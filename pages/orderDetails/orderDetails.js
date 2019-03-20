// pages/orderDetails/orderDetails.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {},
  onLoad(op) {
    this.setData({
      type:op.type
    })
    let token = app.globalData.token; 
    util.http('Order/detail', { order_id:op.id}, 'post', token).then(res => {
      if (res.code == 200) {
        this.setData({
          order: res.data,
        })
      } else if(res.code==-1) {
        util.clear()
      }
    })
  }
})