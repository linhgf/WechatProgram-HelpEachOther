// pages/order/order.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_orders:[],
    accepted_orders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // wx.cloud.callFunction({
    //   name: "getOrder",
    //   data:{
    //     option: "get_private",
    //     stuID: getApp().globalData.userinfo.stuID
    //   }
    // }).then(res=>{
    //   wx.setStorageSync('my_orders', res.result.data)
    // }).then(res=>{

    // })
    that.setData({
      my_orders: wx.getStorageSync('my_orders')
    })
    that.changeTime()

   
  },

  /**
   * 将数据库中的时间格式进行转换
   */
  changeTime: function(){
    for(var i = 0; i < this.data.my_orders.length; i++){
      var date = new Date(this.data.my_orders[i].publish_time)
      var create_date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
      var temp_str = 'my_orders['+ i +'].publish_time'
      this.setData({
        [temp_str]: create_date_time
      }) 
    }
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