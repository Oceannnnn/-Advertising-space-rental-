// pages/ad/ad.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {},
  onShow() {
    let address = wx.getStorageSync('address');
    this.init(address);
  },
  init(address) {
    var _this = this;
    util.http('Position/map', {
      address: address
    }, 'post').then(res => {
      if (res.code == 200) {
        _this.setData({
          listData: res.data
        })
        wx.getLocation({
          type: 'wgs84',
          success: data => {
            if (data) {
              _this.setData({
                scale: 15,
                latitude: data.latitude,
                longitude: data.longitude
              });
            }
            let markets = _this.getSchoolMarkers();
            _this.setData({
              markers: [],
              markers: markets
            })
          }
        })
      }else{
        wx.showToast({
          title: '暂无数据！',
          icon:'none'
        })
      }
    })
  },
  getSchoolMarkers() {
    var market = [];
    for (let item of this.data.listData) {
      let marker1 = this.createMarker(item);
      market.push(marker1)
    }
    return market;
  },
  createMarker(point) {
    let latitude = point.latitude;
    let longitude = point.longitude;
    let type = point.type;
    let bgColor = "";
    let funame = point.funame;
    // let image = point.image;
    if (type == 0) {
      bgColor = "#138BC8";
      funame = funame;
      // image = "../../images/ad_2.png";
    } else {
      bgColor = "#dddddd";
      funame = funame + "(已租)";
      // image = "../../images/ad_1.png";
    }
    let marker = {
      // iconPath: image,
      id: point.id,
      latitude: latitude,
      longitude: longitude,
      label: {
        anchorX: -20,
        anchorY: 0,
        content: funame,
        fontSize: 12,
        color: '#ffffff',
        bgColor: bgColor,
        borderRadius: 4,
        padding: 4
      },
      width: 30,
      height: 30
    };
    return marker;
  },
  bindmarkertap(e) {
    let id = e.markerId;
    wx.navigateTo({
      url: '../details/details?id=' + id,
    })
  }
})