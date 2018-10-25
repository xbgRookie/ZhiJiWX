// pages/mine/mine.js
const app = getApp()
Page({

  /**
     * 页面的初始数据
     */
  data: {
    isGetLoginInfo: false,  // 是否已经获取登录信息
    firstshow: true,// 第一次显示页面
    tapTime: '',// 防止两次点击操作间隔太快
    zjUser:{
      headImg:'',
      nickName:''
    }		
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    var zjUser = app.globalData.zjUser;
    this.setData({
      zjUser: zjUser
    })
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

  goMineSet: function () {
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    var url = '../mineSet/mineSet'
    wx.navigateTo({ url: url });
    
    this.setData({ 'tapTime': nowTime });
  },
  goMineInfos: function () {
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    var url = '../mineInfos/mineInfos'
    wx.navigateTo({ url: url });
    wx.showToast({
      title: '进入我的知几',
      icon: 'success',
      duration: 1000
    })
    this.setData({ 'tapTime': nowTime });
  },
  goWallet: function () {
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    var url = '../wallet/wallet'
    wx.navigateTo({ url: url });
    wx.showToast({
      title: '进入钱包',
      icon: 'success',
      duration: 1000
    })
    this.setData({ 'tapTime': nowTime });
  }, 
  goFeedBack: function () {
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    var url = '../feedBack/feedBack'
    wx.navigateTo({ url: url });
    wx.showToast({
      title: '进入反馈',
      icon: 'success',
      duration: 1000
    })
    this.setData({ 'tapTime': nowTime });
  },
})