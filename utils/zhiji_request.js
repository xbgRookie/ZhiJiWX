function request(Object) {
  wx.request({
    url: Object.url,
    data: Object.data,
    header: Object.header,
    method: Object.method,
    dataType: Object.dataType,
    responseType: Object.responseType,
    success: res => {
      if (res.data && res.data.code == '200') {
        Object.success(res.data.apiData);
      }
    },
    fail: res => {
      console.log(res);
    },
    complete: Object.complete
  })
}
function requestToken(Object) {
  wx.request({
    url: Object.url,
    data: Object.data,
    header: Object.header,
    method: Object.method,
    dataType: Object.dataType,
    responseType: Object.responseType,
    success: res => {
      if (res.data && res.data.code == '200') {
        Object.success(res.data.apiData);
      }
    },
    fail: res => {
      console.log(res);
      
    },
    complete: res=>{
      console.log(res);
      if (res.statusCode == 401) {
        wx.showToast({
          title: 'token错误',
        })
      }
    }
  })
}
module.exports = {
  request: request,
  requestToken: requestToken
}