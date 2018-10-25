//app.js
var config = require('./config.js');
var zhiji_request = require('./utils/zhiji_request.js');
var webim = require('./utils/webim_wx.js');
global.webim = webim;
var webimhandler = require('./utils/webim_handler.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
   // logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)

    //登录
    
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        zhiji_request.request({
          url: config.zhijiServerUrl + 'login',
          data: {code: res.code },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success:res=>{
           this.globalData.wxInfo=res;
            // 获取用户信息
            wx.getSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      console.log(res.userInfo);
                      this.globalData.userInfo = res.userInfo
                      this.getWXLogin();
                    },
                    fail: function () {
                      console.log('获取xinxifail');
                      // proto_getLoginInfo(options);
                      var toUrl = '../login/login';
                      wx.navigateTo({
                        url: toUrl,
                      });
                    }
                  })
                }else{
                  var toUrl = '../login/login';
                  wx.navigateTo({
                    url: toUrl,
                  });
                }
              },
              fail:()=>{
                console.log('获取xinxifail');
                // proto_getLoginInfo(options);
                var toUrl = '../login/login';
                wx.navigateTo({
                  url: toUrl,
                });
              }
            })
          }
        })
        console.log(res.code);
      }
    })
   
  },
  globalData: {
    userInfo: null,
    wxInfo:null,
    zjUser:null
  },
  getWXLogin:function(){
    var _globaldata=this.globalData;
    if (_globaldata.userInfo && _globaldata.wxInfo){
      zhiji_request.request({
        url: config.zhijiServerUrl + 'login',
        data: { openId: _globaldata.wxInfo.openid, nickName: _globaldata.userInfo.nickName, avatarUrl: _globaldata.userInfo.avatarUrl, city: _globaldata.userInfo.city, country: _globaldata.userInfo.country, gender: _globaldata.userInfo.gender, province: _globaldata.userInfo.province },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success:res=>{
          _globaldata.zjUser=res;
          wx.setStorage({
            key: 'token',
            data: _globaldata.zjUser.token
          })
          this.initIM(res);
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res)
          }
        }
      })
    }
  },
  initIM:function(userInfo){
    //var that = this;

    //var avChatRoomId = 'test';
    webimhandler.init({
      accountMode: config.accountMode,
      accountType: config.accountType,
      sdkAppID: config.sdkappid,
      selType: webim.SESSION_TYPE.C2C,
      selToID: null,
      selSess: null //当前聊天会话
    });
    //当前用户身份
    var loginInfo = {
      'sdkAppID': config.sdkappid, //用户所属应用id,必填
      'appIDAt3rd': config.sdkappid, //用户所属应用id，必填
      'accountType': config.accountType, //用户所属应用帐号类型，必填
      'identifier': userInfo.userId+'', //当前用户ID,必须是否字符串类型，选填
      'identifierNick': userInfo.nickName, //当前用户昵称，选填
      'userSig': userInfo.wxSign, //当前用户身份凭证，必须是字符串类型，选填,
      'userImg': userInfo.headImg, //头像，选填
    };

    //监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
    var onGroupSystemNotifys = {
      "5": webimhandler.onDestoryGroupNotify, //群被解散(全员接收)
      "11": webimhandler.onRevokeGroupNotify, //群已被回收(全员接收)
      "255": webimhandler.onCustomGroupNotify //用户自定义通知(默认全员接收)
    };

    //监听连接状态回调变化事件
    var onConnNotify = function (resp) {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          //webim.Log.warn('连接状态正常...');
          console.log("连接状态正常");
          var sessMap = webim.MsgStore.sessMap();
          for (var i in sessMap) {
            console.log("未读信息" + sessMap[i]);
          }
          break;
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
          console.log('连接已断开，无法收到新消息，请检查下你的网络是否正常');
          break;
        default:
          console.log('未知连接状态,status=' + resp.ErrorCode);
          webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
          break;
      }
    };


    //监听事件
    var listeners = {
      "onConnNotify": onConnNotify, //选填 
      "onMsgNotify": webimhandler.onMsgNotify, //监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
    };

    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true, //是否访问正式环境，默认访问正式，选填
      'isLogOn': true //是否开启控制台打印日志,默认开启，选填
    };

    if (config.accountMode == 1) { //托管模式
      webimhandler.sdkLogin(loginInfo, listeners, options, avChatRoomId);
    } else { //独立模式
      //sdk登录
      webimhandler.sdkLogin(loginInfo, listeners, options);
    }
  }, 
  onUnload:function() {
    webimhandler.logout();
  },
  onHide:function(){
    webimhandler.logout();
  }
})