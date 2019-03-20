const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {},
  onLoad() {
    this.setData({
      name: app.globalData.name,
      phone: app.globalData.phone,
      address: app.globalData.address,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      email: app.globalData.email,
      wechat: app.globalData.wechat,
      markers: [{
        iconPath: "../../images/location_img.png",
        id: 0,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        width: 30,
        height: 30
      }]
    })
  },
  toCall(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
    let formId = e.detail.formId;
    util.collectFormIds(formId)
  },
  toPosition() {
    let latitude = Number(this.data.latitude);
    let longitude = Number(this.data.longitude);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: this.data.address,
      scale: 15
    })
  }
})