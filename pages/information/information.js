// pages/information/information.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {},
  onLoad() {
    this.init()
  },
  init() {
    let token = app.globalData.token;
    util.http('My/getUserInfo', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          name: res.data.truename,
          phone: res.data.mobile
        })  
      }
    })
  },
  bindPhoneChange(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindNameChange(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //表单验证
  checkInput() {
    let phone = this.data.phone;
    let name = this.data.name;
    if (!name) {
      wx.showToast({
        title: '请输入联系人',
        icon: 'none'
      })
      return false
    } else if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    } else {
      if (!util.toCheck(phone)) {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'none'
        })
        return false
      }
    }
    return true
  },
  submit() {
    let json = {
      uname: this.data.name,
      mobile: this.data.phone
    }
    let token = app.globalData.token;
    if (this.checkInput()) {
      util.http('My/setUserInfo', json, 'post', token).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          })
          this.init();
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
      })
    }
  },
})