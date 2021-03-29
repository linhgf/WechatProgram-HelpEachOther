import Toast from '@vant/weapp/toast/toast'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:[],//信息列表
    refresh_trigger: false,//为false时关闭loading界面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.cloud.callFunction({
      name:"getMessage",
      data:{
        options:"get",
        stuID: getApp().globalData.userinfo.stuID
      }
    }).then(res=>{
      that.setData({
        message: res.result.data
      })
      that.changeTime()
    })
  },

    /**
   * 将数据库中的时间格式进行转换
   */
  changeTime: function(){
    for(var i = 0; i < this.data.message.length; i++){
      var date = new Date(this.data.message[i].time)
      var create_date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
      var temp_str = 'message['+ i +'].time'
      this.setData({
        [temp_str]: create_date_time
      }) 
    }
  },

    /**
   * 下拉刷新获取数据
   */
  onRefreshData: function(){
    let that = this
    wx.cloud.callFunction({
      name:"getMessage",
      data:{
        options:"get",
        stuID: getApp().globalData.userinfo.stuID
      }
    }).then(res=>{
      that.setData({
        refresh_trigger: false
      })
      console.log(res,that.data.message[0])
      if(res.result.data[0]._id == that.data.message[0]._id){
        Toast("已是最新消息(ノ￣▽￣)")
      }
      else{ 
        that.setData({
          message: res.result.data
        })
        that.changeTime()
      }
    })
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

  }
})