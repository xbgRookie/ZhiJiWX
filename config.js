/**
 * 小程序配置文件
 */
var config = {
  COSv5: {
    bucket: 'zhiji-1252493364',  //空间名称 Bucket
    region: 'ap-shanghai'   
  },
  //客户业务后台请求域名
  serverUrl: 'https://room.qcloud.com',
  //腾讯云RoomService后台请求域名
  roomServiceUrl: 'https://room.qcloud.com/weapp/double_room/',
  webrtcServerUrl: 'https://xzb.qcloud.com/webrtc/weapp/webrtc_room',
  zhijiServerUrl:'',
  sdkappid: 1400147405,
  accountType: 36862,
  accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
}
module.exports = config;
