// pages/order/order.js
import Toast from '@vant/weapp/toast/toast'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh_trigger: false,
    orders:[],
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
      orders: wx.getStorageSync('my_orders')
    })
    that.changeTime()
  },

  /**
   * 下拉刷新加载新数据
   */
  onRefreshData: function(){
    let that = this
    wx.cloud.callFunction({
      name: "getOrder",
      data:{
        option: "get_private",
        stuID: getApp().globalData.userinfo.stuID
      }
    }).then(res=>{//更新缓存
      wx.setStorageSync('my_orders', res.result.data)
      Toast("加载完毕 (oﾟvﾟ)ノ")
      //更新数据显示内容
      that.setData({
        refresh_trigger: false,
        orders: wx.getStorageSync('my_orders')
      })
      that.changeTime()
    })
  },

  /**
   * 将数据库中的时间格式进行转换
   */
  changeTime: function(){
    for(var i = 0; i < this.data.orders.length; i++){
      var date = new Date(this.data.orders[i].publish_time)
      var create_date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
      var temp_str = 'orders['+ i +'].publish_time'
      this.setData({
        [temp_str]: create_date_time
      }) 
    }
  },

  onClickOrder: function(res){
    this.data.orders.forEach(order => {
      if(order._id == res.currentTarget.dataset.id){
        wx.setStorageSync('click_order', order)
        if(order.publisher == getApp().globalData.userinfo.stuID){
          wx.navigateTo({
            url: '../order/order_detail?ismine=true&&isaccept=false',
          })
        }
        else if(order.recipient == getApp().globalData.userinfo.stuID){
          wx.navigateTo({
            url: '../order/order_detail?ismine=false&&isaccept=true',
          })
        }
        
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