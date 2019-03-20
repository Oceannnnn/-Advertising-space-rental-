// pages/listPage/listPage.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    region: [],
    itemsList: [],
    price: ""
  },
  onLoad(op) {
    this.setData({
      tabTxt: [{
          name: '投放场景',
          tab: 0
        },
        {
          name: '地区',
          tab: 1
        },
        {
          name: '价格',
          tab: 2
        }
      ],
      cate_id: op.cate_id,
      name: op.name,
      address: op.address,
      location: op.location
    })
    this.itemsList(1, op.address, op.cate_id, op.name,"");
    this.init();
  },
  init() {
    util.http('Param/categoryList', { type: 1 }, 'post').then(res => {
      this.setData({
        arrayScene: res.data
      })
    })
    util.http('Param/priceList', { }, 'get').then(res => {
      this.setData({
        arrayPrice: res.data
      })
    })
    this.dataInit();
  },
  dataInit() {
    this.setData({
      itemsList: [],
      page: 1,
      onBottom: true
    })
  },
  itemsList(page, address, cate_id, name, price) {
    let search = {
      name: name,
      cate_id: cate_id,
      address: address,
      price: price
    }
    search = JSON.stringify(search);
    let json = {
      pageSize: 10,
      current: page,
      search: search
    }
    let list = this.data.itemsList;
    util.http('Position/index', json, 'post').then(res => {
      if (res.code == 200) {
        let cate_type = res.data.cate_type;
        let cate_name = res.data.cate_name;
        let tabTxt = this.data.tabTxt;
        let location = this.data.location;
        if (location != '') {
          tabTxt[1].name = location
        }
        if (cate_type != '' && cate_type != undefined){
          if (cate_type==1){
            tabTxt[0].name = cate_name
          } else{
            tabTxt[2].name = cate_name
          }
          this.setData({
            tabTxt: tabTxt
          })
        }
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
      this.itemsList(this.data.page, this.data.address, this.data.cate_id, this.data.name, this.data.price);
    }
  },
  bindRegionChange(e) {
    let region = e.detail.value;
    let address = region[0] + region[1] + region[2];
    this.setData({
      region: region
    })
    this.dataInit();
    this.itemsList(1, address, this.data.cate_id, this.data.name, this.data.price)
  },
  bindPriceChange(e) {
    let arrayPrice = this.data.arrayPrice;
    let index = e.detail.value;
    let price = arrayPrice[e.detail.value].id;
    this.dataInit();
    this.setData({
      indexPrice: index,
      price: price
    })
    this.itemsList(1, this.data.address, this.data.cate_id, this.data.name, price)
  },
  bindSceneChange(e) {
    let arrayScene = this.data.arrayScene;
    let index = e.detail.value;
    let cate_id = arrayScene[index].id;
    this.dataInit();
    this.setData({
      cate_id: cate_id
    })
    this.itemsList(1, this.data.address, cate_id, this.data.name, this.data.price)
  },
  details(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id
    })
  },
  onReachBottom() {
    var page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.itemsList(this.data.page, this.data.id)
    }
  }
})