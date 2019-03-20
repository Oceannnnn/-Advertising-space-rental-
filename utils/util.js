const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 正则校验手机号
const toCheck = (str) => {
  // 定义手机号的正则
  var isMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  //拿到去除空格后的手机号
  // 校验手机号
  return isMobile.test(str);
}
const u = "https://advert.fqwlkj.cn/api.php/api/"
const http = (url, data = {}, method = 'get', token = '') => {
  const allUrl = u + url;
  return new Promise(function(resolve, reject) {
    wx.request({
      url: allUrl,
      data: data,
      method: method ? method : 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res.data)
      }
    })
  })
}
const clear = () => {
  wx.showModal({
    content: '登录信息过期，请重新登陆',
    success(res) {
      if (res.confirm) {
        wx.switchTab({
          url: '../my/my',
        })
      } 
    }
  })
  wx.clearStorage();
  app.globalData.state = 0;
}
module.exports = {
  clear: clear,
  formatTime: formatTime,
  http: http,
  toCheck: toCheck
}