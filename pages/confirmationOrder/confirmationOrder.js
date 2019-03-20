// pages/confirmationOrder/confirmationOrder.js
const app = getApp();
import initCalendar, {
  getSelectedDay,
  setTodoLabels,
  disableDay,
  switchView
  // enableArea
} from '../../template/calendar/index';
const util = require('../../utils/util.js');
Page({
  data: {
    design_id: '',
    material_id: '',
    material_price: 0,
    design_price: 0,
    dataTime: '',
    hasInstall:0
  },
  onLoad(op) {
    this.init(op);
    this.setData({
      type: op.type,
      id:op.id
    })
  },
  onShow() {
    let token = app.globalData.token;
    util.http('My/getUserInfo', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          name: res.data.truename,
          phone: res.data.mobile
        })
      } else if (res.code == -1) {
        util.clear();
      }
    })
    if (this.data.design == 1) {
      this.conut()
    }
    if (this.data.material == 1) {
      this.conut()
    }
  },
  conut() {
    let money = Number(this.data.money);
    let newCount = Number(this.data.newCount);
    let design_price = Number(this.data.design_price);
    let material_price = Number(this.data.material_price);
    let install_price = Number(this.data.install);
    let hasInstall = this.data.hasInstall;
    if (hasInstall == 1) {
      newCount = design_price + money + material_price + install_price
    } else {
      newCount = design_price + money + material_price
    }
    newCount.toFixed(2);
    this.setData({
      newCount: newCount
    })
  },
  init(op) {
    let token = app.globalData.token;
    let json = {
      product_id: op.id,
      spec_id: op.spec_id,
      type: op.type
    }
    util.http('Pay/createOrder', json, 'post', token).then(res => {
      if (res.code == 200) {
        this.setData({
          info: res.data,
          money: res.data.total_price,
          newCount: res.data.total_price,
          install: res.data.install_price
        })
        let disable = res.data.date;
        initCalendar({
          // multi: true, // 是否开启多选,
          disablePastDay: true, // 是否禁选过去日期
          afterTapDay: (currentSelect, allSelectedDays) => {
            let dataTime = currentSelect.year + '-' + currentSelect.month + '-' + currentSelect.day
            this.setData({
              dataTime: dataTime,
              hidden: false
            })
          },
          whenChangeMonth(current, next) {
          },
          afterCalendarRender() {
            disableDay(disable);
          }
        });
      } else if (res.code == -1) {
        util.clear();
      }
    })
  },
  installChange(e) {
    wx.navigateTo({
      url: '../material/material?isChoose=1&id='+this.data.id,
    })
  },
  bindtapData() {
    this.setData({
      hidden: true
    })
  },
  checkboxChange(e){
    let value = e.detail.value;
    let hasInstall = 0;
    if (value != '') {
      hasInstall = 1;
    }else{
      hasInstall = 0;
    }
    this.setData({
      hasInstall: hasInstall
    })
    this.conut();
  },
  design() {
    wx.navigateTo({
      url: '../agent/agent?isChoose=1&id=' + this.data.id,
    })
  },
  comfirm() {
    let token = app.globalData.token;
    if (this.data.name == '') {
      wx.showToast({
        title: '请填写信息',
        icon: 'none'
      })
      return
    }
    if (this.data.dataTime == '') {
      wx.showToast({
        title: '请选择起始日期',
        icon: 'none'
      })
      return
    }
    this.setData({
      disabled: true
    })
    let that = this;
    let json = {
      design_id: this.data.design_id,
      material_id: this.data.material_id,
      start_time: this.data.dataTime,
      is_install: this.data.hasInstall
    }
    util.http('Pay/repay', json, 'post', token).then(res => {
      if (res.code == 200) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function(res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000,
              success: function() {
                if (that.data.type != 1) {
                  wx.navigateTo({
                    url: '../allorder/allorder?allorder=1'
                  })
                } else {
                  wx.navigateTo({
                    url: '../appointment/appointment?appointment=1'
                  })
                }
              }
            })
            that.setData({
              disabled: false
            })
          },
          'fail': function(res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 1000
            })
            that.setData({
              disabled: false
            })
          }
        })
      } else if (res.code == -1) {
        util.clear();
      } else if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
        that.setData({
          disabled: false
        })
      }
    })
  }
})