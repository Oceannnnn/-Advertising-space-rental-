// pages/my/my.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    hasUserInfo: false,
    state: 0
  },
  onShow() {
    this.init()
  },
  init() {
    this.setData({
      hasUserInfo: true,
      userInfo: app.globalData.userInfo,
      state: app.globalData.state
    })
  },
  information() {
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../information/information'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
    }
  },
  allorder() {
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../allorder/allorder'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
    }
  },
  collection() {
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../collection/collection'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
    }
  },
  appointment() {
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../appointment/appointment'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
    }
  },
  getUserInfo(e) {
    let that = this;
    wx.login({
      success: function(res) {
        let code = res.code
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: msg => {
                  let encryptedData = msg.encryptedData;
                  let iv = msg.iv;
                  let token = '';
                  let json = {
                    code: code,
                    encryptedData: encryptedData,
                    iv: iv
                  }
                  util.http('Login/login', json, 'post', token).then(data => {
                    if (data.code == 200) {
                      app.globalData.userInfo = e.detail.userInfo;
                      app.globalData.state = 1;
                      app.globalData.token = data.data.token;
                      that.setData({
                        state: 1,
                        hasUserInfo: true,
                        userInfo: e.detail.userInfo,
                      })
                      wx.setStorage({
                        key: "httpClient",
                        data: {
                          state: 1,
                          userInfo: e.detail.userInfo,
                          token: data.data.token,
                        }
                      })
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000
                      })
                      setTimeout(() => {
                        wx.switchTab({
                          url: '../index/index'
                        })
                      }, 500)
                    }
                  })
                }
              })
            } else {
              wx.showToast({
                title: '授权才能登录哦！',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  }
})