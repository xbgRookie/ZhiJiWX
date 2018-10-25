// pages/mineSet/mineSet.js
const app = getApp();
var config = require('../../config.js');
var Uploader = require('../../utils/UploaderV5.js');
var zhiji_request = require('../../utils/zhiji_request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zjUser: {
      userId: '',
      headImg: '',
      nickName: '',
      professional: '',
      answerTime: '',
      answerPrice: '',
      introduction: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var zjUser = app.globalData.zjUser;
    this.setData({
      zjUser: zjUser
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showToast({
      title: '进入修改页面',
      icon: 'success',
      duration: 1000
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  uploadImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        if (res.tempFilePaths && res.tempFilePaths.length) {
          var filePath = res.tempFilePaths[0];
          // wx.uploadFile({
          //   url: config.zhijiServerUrl + 'COS',
          //    //仅为示例，非真实的接口地址
          //   filePath: filePath,
          //   name: 'file',
          //   success(res) {
          //     const data = res.data
          //     //do something
          //   },
          //   error(res){
          //     console.log(res)
          //   }
          // })
          that.uploadFile(filePath);
        }
      }
    });
  },

  // 简单上传文件
  uploadFile: function(tempFilePath) {
    var that = this;
    Uploader.upload(tempFilePath, function(result) {
      //微信只能用 https
      console.debug(result);

      var imgUrl = result.Location.replace("http://", "https://")


      var zjuser = that.data.zjUser;
      zjuser.headImg = imgUrl;
      that.setData({
        zjUser: zjuser
      })
      //发送文本消息
      //var toUserId = app.globalData.toUser.identifier
      //IM.sendImageMsg(toUserId, imgUrl);

    });
  },
  bindNickNameInput: function(e) {
    var nickName = e.detail.value;
    var zjuser = this.data.zjUser;
    zjuser.nickName = nickName;
    this.setData({
      zjUser: zjuser
    })
  },
  bindProfessionalInput: function(e) {
    var professional = e.detail.value;
    var zjuser = this.data.zjUser;
    zjuser.professional = professional;
    this.setData({
      zjUser: zjuser
    })
  },
  bindIntroInput: function(e) {
    var introduction = e.detail.value;
    var zjuser = this.data.zjUser;
    zjuser.introduction = introduction;
    this.setData({
      zjUser: zjuser
    })
  },
  bindSend: function() {
    var that = this;
    zhiji_request.requestToken({
      url: config.zhijiServerUrl + 'ZJUsers',
      data: that.data.zjUser,
      method: 'PUT',
      header: {
        'Authorization': 'bearer ' + that.data.zjUser.token,
        'content-type': 'application/json'
      },
      success: res => {

      }
    });
  }
})