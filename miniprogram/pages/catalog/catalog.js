var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    navList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0
  },
  onLoad: function (options) {
    this.getCatalog();
  },
  getCatalog: function () {
    //CatalogList
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    // util.request(api.CatalogList).then(function (res) {
    //     that.setData({
    //       navList: res.data.categoryList,
    //       currentCategory: res.data.currentCategory
    //     });
    //     wx.hideLoading();
    //   });
    // util.request(api.GoodsCount).then(function (res) {
    //   that.setData({
    //     goodsCount: res.data.goodsCount
    //   });
    // });
    wx.cloud.callFunction({
      // 云函数名称
      name: 'category',
      // 传给云函数的参数
      data: {

      },
    })
      .then(res => {
        console.log('+++++++++++') // 3

        console.log(res) // 3
        that.setData({
          navList: res.result.currentCategory,
          currentCategory: res.result.currentCategory[0],
        });
        wx.hideLoading();
      })
      .catch(console.error)

  },
  getCurrentCategory: function (id) {
    console.log(id)
    let that = this;
    this.data.navList.map((val) => {
      console.log(val.id)
      
      if(val.id == id){
        that.setData({
          currentCategory: val
        });
      }
    })

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // getList: function () {
  //   var that = this;
  //   util.request(api.ApiRootUrl + 'api/catalog/' + that.data.currentCategory.cat_id)
  //     .then(function (res) {
  //       that.setData({
  //         categoryList: res.data,
  //       });
  //     });
  // },
  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }

    this.getCurrentCategory(event.currentTarget.dataset.id);
  }
})