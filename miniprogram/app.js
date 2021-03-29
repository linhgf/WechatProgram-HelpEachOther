//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {}

    let that = this
    wx.getStorage({
      key: 'userinfo',
      success: res=>{
        if(res.data != null){
          that.globalData.hasUserinfo = true
          that.globalData.userinfo = res.data
        }
      }
    })

  },
  
  globalData: {
    hasUserinfo: false,
    userinfo: null
  }

})
