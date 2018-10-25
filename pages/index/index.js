//index.js
//获取应用实例
const app = getApp();
var config = require('../../config.js');
var zhiji_request = require('../../utils/zhiji_request.js');
// pages/main/main.js
Page({
  data: {
    navList: [{
      id: '0',
      title: '全部'
    }, {
      id: '1',
      title: '教育'
    }, {
      id: '2',
      title: '心理'
    }, {
      id: '3',
      title: '全部'
    }, {
      id: '4',
      title: '职场'
    }, {
      id: '5',
      title: '健康'
    }],
    listData: [],
    currentId: '0',
    isHideLoadMore: false,
    zjUser: null
  },
  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function() {
    console.log(app.globalData.zjUser)
    //this.getDataById(0);
    // wx.setTabBarItem({控制navBar样式
    //   index: 1,
    //   text: '消息',
    //   "iconPath": "pages/asset/images/tabBar-message-new.png",
    //   "selectedIconPath": "pages/asset/images/tabBar-message-new-active.png"
    // });
    if (app.globalData.zjUser) {
      app.globalData.zjUser.nickName = '测试';
      this.setData({
        zjUser: app.globalData.zjUser
      })
      this.getDataById(0);
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          zjUser: res
        })
        this.getDataById(0);
      }
    }
  },
  navToggleTap(e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.showLoading({
      title: '数据加载中',
    })
    this.getDataById(id);
    wx.hideLoading();
    this.setData({
      currentId: id
    })
  },
  goMineInfos: function(e) {
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    var url = '../ask/ask?userId=' + e.currentTarget.dataset.userid
    wx.navigateTo({
      url: url
    });

    this.setData({
      'tapTime': nowTime
    });
  },
  getDataById: function(id) {
    var that = this;
    zhiji_request.requestToken({
      url: config.zhijiServerUrl + 'homepage',
      data: {
        sign: id
      },
      method: 'GET',
      header: {
        'Authorization': 'bearer ' + that.data.zjUser.token
      },
      success: res => {
        this.setData({
          listData: res,
          isHideLoadMore: true
        })
        console.log(res);
      }
    });
  }
})