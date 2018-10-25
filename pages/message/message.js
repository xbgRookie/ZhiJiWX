// pages/message/message.js
var webim = require('../../utils/webim_wx.js');
var webimhandler = require('../../utils/webim_handler.js');
var config = require('../../config.js');
var zhiji_request = require('../../utils/zhiji_request.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNoData: true,
    noData: '',//无数据的图片
    contactList: [],//会话列表
    userInfo:null
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
   
    wx.showLoading();
    this.setData({
      userInfo: app.globalData.zjUser
    });
    
    var that = this;
    var selToID = '';//会话列表不设置对方私聊账号
    webimhandler.init({
      accountMode: config.accountMode,
      accountType: config.accountType,
      sdkAppID: config.sdkappid,
      selType: webim.SESSION_TYPE.C2C,
      selToID: that.data.userInfo.userId,
      selSess: null //当前聊天会话
    });
    if (webim.checkLogin()) {//检查是否登录返回true和false,不登录则重新登录
      console.log('已登录')
      zhiji_request.requestToken({
        url: config.zhijiServerUrl + 'Chat',        
        method: 'GET',
        header: {
          'Authorization': 'bearer ' + app.globalData.zjUser.token
        },
        success: res => {
          // this.setData({
          //   userInfo: res
          // })
          that.initRecentContactList();

        }
      });
      
      //this.msgSend();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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
  initRecentContactList: function () {

    var that = this;
    webim.getRecentContactList({//获取会话列表的方法
      'Count': 10 //最近的会话数 ,最大为 100
    }, function (resp) {
      if (resp.SessionItem) {

        if (resp.SessionItem.length == 0) {
          that.setData({
            isNoData: false,
          })
          wx.hideLoading()
        } else if (resp.SessionItem.length > 0) {
          that.setData({
            contactList: resp.SessionItem,
            isNoData: true
          })
          var userId = that.data.contactList.map((item, index) => {
            return item.To_Account
          })
          webimhandler.getAvatar(userId, that.data.contactList, function (data) {

             that.setData({
               contactList: data
             })
          //   wx.hideLoading();
          //  
           

           })
           // 初始化最近会话的消息未读数(监听新消息事件)
          webim.syncMsgs(function (newMsgList){
            var newMsg;
            for (var j in newMsgList) {//遍历新消息
              newMsg = newMsgList[j];
              console.log('新消息：'+newMsg);//处理新消息
            }
          });
          
          wx.hideLoading();
          // webim.syncMsgs(that.initUnreadMsgCount())
        } else {
          wx.hideLoading()
          return;
        }
      } else {
        wx.hideLoading()
      }


    }, function (resp) {
      //错误回调
    });


  },
  // 初始化最近会话的消息未读数（这个方法用不到，多余，这是个坑，登录之后仍然返回空对象）
  initUnreadMsgCount: function () {
    var sess;
    var sessMap = JSON.stringify(webim.MsgStore.sessMap());

    for (var i in sessMap) {
      console.log('循环对象')
      sess = sessMap[i];
      // if (selToID && selToID != sess.id()) { //更新其他聊天对象的未读消息数
      console.log('sess.unread()', sess.unread())
      // updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread());
      // }
    }
  },

  msgSend:function(){
    var selType= webim.SESSION_TYPE.C2C
    var selSess = new webim.Session(selType, '32314141324123314341234123413241', '32314141324123314341234123413241', '', Math.round(new Date().getTime() / 1000));
    var isSend = true;//是否为自己发送
    var seq = -1;//消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296);//消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000);//消息时间戳
    //群消息子类型如下：
    //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
    //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
    //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
    //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
    var subType = webim.GROUP_MSG_SUB_TYPE.COMMON;

    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, this.data.userInfo.userId, webim.C2C_MSG_SUB_TYPE);
    var msgtosend = 'wwwww哈哈哈123';
    var text_obj = new webim.Msg.Elem.Text(msgtosend);
    msg.addText(text_obj);

    webim.sendMsg(msg, function (resp) {
      if (selType == webim.SESSION_TYPE.C2C) {//私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
        //showMsg(msg);
      }
      webim.Log.info("点赞成功");
    }, function (err) {
      webim.Log.error("发送点赞消息失败:" + err.ErrorInfo);
      console.error("发送点赞消息失败:" + err.ErrorInfo);
    });
  }
})