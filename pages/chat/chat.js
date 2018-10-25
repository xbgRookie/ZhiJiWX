//index.js
//获取应用实例
var webimhandler = require('../../utils/webim_handler.js');
var config = require('../../config.js');
var webim = require('../../utils/webim_wx.js');
var Uploader = require('../../utils/UploaderV5.js');
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    msgs: [],
    Identifier: null,
    UserSig: null,
    msgContent: "",
    to_Account: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  clearInput: function () {
    this.setData({
      msgContent: ""
    })
  },
  bindMsgInput: function (e) {
    var content = e.detail.value;
    this.setData({
      msgContent:content
    })
  },
  bindConfirm: function (e) {
    var that = this;
    var content = e.detail.value;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    webimhandler.onSendMsg(content, function () {
      that.clearInput();
    })
  },
  bindSend: function () {
    var that = this;
    var content = that.data.msgContent;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    webimhandler.onSendMsg(content, function () {
      var msgList = that.data.msgs;
      msgList.push({
        C2cImage: that.data.userInfo.headImg,
        C2cNick: that.data.userInfo.nickName,
        content: content,
        fromAccountNick: that.data.userInfo.userId,
        isSend: true
      });
      that.setData({
        msgs: msgList
      })
      that.clearInput();
    })
  },
  // login: function (cb) {
  //   var that = this;
  //   tls.login({
  //     success: function (data) {
  //       that.setData({
  //         Identifier: data.Identifier,
  //         UserSig: data.UserSig
  //       })
  //       cb();
  //     }
  //   });
  // },


  receiveMsgs: function (data) {
    var msgs = this.data.msgs || [];
    msgs.push(data);
    //最多展示10条信息
    if (msgs.length > 10) {
      msgs.splice(0, msgs.length - 10)
    }

    this.setData({
      msgs: msgs
    })
  },

  initIM: function (userInfo) {
    var that = this;
    var selToID = '';//会话列表不设置对方私聊账号
    var selType = webim.SESSION_TYPE.C2C;
    var to_Account = that.data.to_Account;
    var selSess = new webim.Session(selType, to_Account, to_Account, '', Math.round(new Date().getTime() / 1000));
    webimhandler.init({
      accountMode: config.accountMode,
      accountType: config.accountType,
      sdkAppID: config.sdkappid,
      selType: webim.SESSION_TYPE.C2C,
      selToID: to_Account,
      selSess: selSess //当前聊天会话
    });
    //初始化IM

    //当前用户身份
    if (webim.checkLogin()) {//检查是否登录返回true和false,不登录则重新登录
      console.log('已登录')
      // webim.syncMsgs(function (newMsgList) {
      //   that.onMsgGet(newMsgList);
      // });
      var lastMsgTime = 0;//第一次拉取好友历史消息时，必须传 0
      var msgKey = '';
      var reqMsgCount = 10;
      var options = {
        'Peer_Account': that.data.to_Account, //好友帐号
        'MaxCnt': reqMsgCount, //拉取消息条数
        'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
        'MsgKey': msgKey
      };
      webim.getC2CHistoryMsgs(options, function (resp) {
        var complete = resp.Complete;//是否还有历史消息可以拉取，1-表示没有，0-表示有
        var retMsgCount = resp.MsgCount;//返回的消息条数，小于或等于请求的消息条数，小于的时候，说明没有历史消息可拉取了
        if (resp.MsgList.length == 0) {
          //webim.Log.error("没有历史消息了:data=" + JSON.stringify(options));
          return;
        }
        // getPrePageC2CHistroyMsgInfoMap[selToID] = {//保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
        //   'LastMsgTime': resp.LastMsgTime,
        //   'MsgKey': resp.MsgKey
        // };
        that.onMsgGet(resp.MsgList);
      })
      //that.initRecentContactList();
      //this.msgSend();
    }
  },
  onLoad: function (options) {

    //调用应用实例的方法获取全局数据
    var to_Account = options.userId;
    var userInfo = app.globalData.zjUser
    this.setData({
      userInfo: userInfo,
      to_Account: to_Account
    })
    this.initIM(userInfo);
  },
  onMsgGet: function (newMsgList) {
    var newMsg;
    var that=this;
    var msgList = that.data.msgs;
    for (var j in newMsgList) {//遍历新消息
      newMsg = newMsgList[j];
      var content = webimhandler.convertMsgtoHtml(newMsg);
      console.log('新消息：' + newMsg);//处理新消息
      
      msgList.push({
        content: content,
        fromAccountNick: newMsg.fromAccount,
        isSend:newMsg.isSend
      });
    }
    var userId = msgList.map((item, index) => {
      return item.fromAccountNick
    })
    webimhandler.getAvatar(userId, msgList, function (data) {

      that.setData({
        msgs: data
      })  


    })
  }

})