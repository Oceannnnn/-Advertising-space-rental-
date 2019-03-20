//index.js
const app = getApp();
// var address = require('../../utils/city.js');
const util = require('../../utils/util.js');
Page({
  data: {
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: '',
    // region: [],
    location: "未定位",
    imgUrls: [],
    gener: [],
    page: 1,
    onBottom: true,
    itemsList: [],
    agentList: []
  },
  onLoad() { // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    this.init();
  },
  init() {
    this.getCompanyConfig();
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        util.http('Param/location', {
          latitude: latitude,
          longitude: longitude
        }, 'post').then(res => {
          that.setData({
            location: res.data.city,
            address: res.data.address,
            itemsList: []
          })
          that.itemsList(1, that.data.address);
          wx.removeStorageSync('address');
          wx.setStorage({
            key: 'address',
            data: res.data.address,
          })
        })
      }
    })
    util.http('Param/swiperList', {}, 'get').then(res => {
      that.setData({
        imgUrls: res.data
      })
    })
    util.http('Param/categoryList', {
      type: 2
    }, 'post').then(res => {
      that.setData({
        gener: res.data
      })
    })
    util.http('Design/index', {}, 'get').then(res => {
      that.setData({
        agentList: res.data
      })
    })
    util.http('param/cityData', {}, 'get').then(res => {
      let addressMuse = res.data
      // 默认联动显示浙江省
      var id = addressMuse.provinces[0].id
      this.setData({
        addressMuse: addressMuse,
        provinces: addressMuse.provinces,
        citys: addressMuse.citys[id],
        areas: addressMuse.areas[addressMuse.citys[id][0].id],
      })
    })
  },
  onReady() {
    this.setData({
      itemsList: []
    })
    this.itemsList(1, this.data.address)
  },
  itemsList(page, address) {
    if (address == undefined) {
      address = ''
    }
    let search = {
      name: '',
      cate_id: '',
      address: address
    }
    search = JSON.stringify(search);
    let json = {
      pageSize: 10,
      current: page,
      search: search,
      price: ""
    }
    let list = this.data.itemsList;
    util.http('Position/index', json, 'post').then(res => {
      if (res.code == 200) {
        if (res.data.list != '') {
          for (let item of res.data.list) {
            list.push(item)
          }
          this.setData({
            itemsList: list
          })
        } else {
          if (page > 1) {
            wx.showToast({
              title: '没有数据啦！',
              icon: 'none',
              duration: 2000
            })
            this.data.onBottom = false;
          }
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
      this.itemsList(this.data.page, this.data.address);
    }
  },
  bindDesigner(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../designer/designer?id=' + id
    })
  },
  bindInputChange(e) {
    let address = this.data.address;
    let location = this.data.location;
    if (address == undefined) {
      address = '';
      location = '';
    }
    let value = e.detail.value;
    let cate_id = '';
    wx.navigateTo({
      url: '../listPage/listPage?name=' + value + '&address=' + address + '&cate_id=' + cate_id + '&location=' + location
    })
  },
  listPage(e) {
    let address = this.data.address;
    let location = this.data.location;
    if (address == undefined) {
      address = '';
      location = '';
    }
    let id = e.currentTarget.dataset.id;
    let name = '';
    wx.navigateTo({
      url: '../listPage/listPage?name=' + name + '&address=' + address + '&cate_id=' + id + '&location=' + location
    })
  },
  details(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id
    })
  },
  getCompanyConfig() {
    util.http('Param/companyConfig', {}, 'get').then(res => {
      if (res.code == 200) {
        let info = res.data;
        app.globalData.address = info.address;
        app.globalData.latitude = info.latitude;
        app.globalData.longitude = info.longitude;
        app.globalData.name = info.name;
        app.globalData.phone = info.phone;
        app.globalData.email = info.email;
        app.globalData.wechat = info.wechat;
      }
    })
  },
  onShareAppMessage(ops) {
    return {
      title: '分享不仅仅是一种生活，更是一种收获',
      path: '/pages/index/index'
    }

  },
  // 点击所在地区弹出选择框
  selectDistrict: function(e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function(isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(200 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function(e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function(e) {
    var city = this.data.city
    var value = this.data.value
    this.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = this.data.provinces[value[0]].name + ',' + this.data.citys[value[1]].name + ',' + this.data.areas[value[2]].name
    var province = this.data.provinces[value[0]].name;
    var city = this.data.citys[value[1]].name;
    var area = this.data.areas[value[2]].name;
    this.setData({
      areaInfo: areaInfo,
      province: province,
      city: city,
      area: area
    })
    let address = province + city + area;
    this.setData({
      location: area,
      itemsList: [],
      page: 1,
      onBottom: true,
      address: address
    })
    this.itemsList(1, address);
    wx.removeStorageSync('address');
    wx.setStorage({
      key: 'address',
      data: address,
    })
  },
  // 处理省市县联动逻辑
  cityChange: function(e) {
    let addressMuse = this.data.addressMuse;
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: addressMuse.citys[id],
        areas: addressMuse.areas[addressMuse.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: addressMuse.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  }
})