// pages/ad/ad.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    material: [],
    isChoose: 0
  },
  onLoad(op) {
    if (op.isChoose) {
      this.setData({
        isChoose: op.isChoose
      })
    }
    this.setData({
      id:op.id
    })
    this.material(1,op.id)
  },
  bindBack(e) {
    let index = e.currentTarget.dataset.index;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]  //上一个页面
    let material = this.data.material;
    let price = material[index].price;
    let name = material[index].name;
    let id = material[index].id;
    let pic = material[index].pic;
    prevPage.setData({
      material_id: id,
      material_name: name,
      material_price: price,
      material_pic: pic,
      material: 1
    })
    wx.navigateBack()
  },
  choose() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      material_id: '',
      material_price: 0,
      material: 1
    })
    wx.navigateBack()
  },
  material(page,id) {
    let json = {
      pageSize: 10,
      current: page,
      ad_id:id
    }
    let list = this.data.material;
    util.http('Param/getMaterial', json, 'post').then(res => {
      if (res.code == 200) {
        for (let item of res.data) {
          list.push(item)
        }
        this.setData({
          material: list
        })
      } else if (res.code == 0) {
        if (page > 1) {
          wx.showToast({
            title: '没有数据啦！',
            icon: 'none',
            duration: 2000
          })
          this.data.onBottom = false;
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
      this.material(this.data.page,this.data.id);
    }
  }
})