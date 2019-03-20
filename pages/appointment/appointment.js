// pages/allorder/allorder.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    page: 1,
    onBottom: true,
    appointmentList: []
  },
  onLoad(op) {
    if (op.appointment) {
      this.setData({
        appointment: op.appointment
      })
    }
    this.appointmentList(1)
  },
  appointmentList(page) {
    let json = {
      pageSize: 10,
      current: page
    }
    let list = this.data.appointmentList;
    let token = app.globalData.token;
    util.http('Order/appointList', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data != '') {
          for (let item of res.data) {
            list.push(item)
          }
          this.setData({
            appointmentList: list
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
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.appointmentList(this.data.page);
    }
  },
  onUnload() { //如果页面被卸载时被执行
    if (this.data.appointment == 1) {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }
})