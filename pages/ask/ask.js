// pages/ask/ask.js
var config = require('../../config.js');
var zhiji_request = require('../../utils/zhiji_request.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = options.userId;
    this.setData({
      userId: userId
    })
    zhiji_request.requestToken({
      url: config.zhijiServerUrl + 'ZJUsers',
      data: { userId: userId },
      method: 'GET',
      header: {
        'Authorization': 'bearer ' + app.globalData.zjUser.token
      },
      success: res => {
        this.setData({
          userInfo: res
        })
        console.log(res);
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  askuser: function () {
    var that = this;

    var question= app.globalData.zjUser.userId;
    var answer=that.data.userInfo.userId;

    zhiji_request.requestToken({
      url: config.zhijiServerUrl + 'Chat',
      data: { question:question,answer:answer },
      method: 'POST',
      header: {
        'Authorization': 'bearer ' + app.globalData.zjUser.token
      },
      success: res => {
        // this.setData({
        //   userInfo: res
        // })
        console.log(res);
        var url = '../chat/chat?userId=' + that.data.userInfo.userId
        wx.navigateTo({ url: url });

      }
    });

  }
})