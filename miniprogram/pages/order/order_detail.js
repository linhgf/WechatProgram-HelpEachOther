// miniprogram/pages/order/order_detail.js
import Toast from '@vant/weapp/toast/toast'
import Dialog from '@vant/weapp/dialog/dialog'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    ismine: "false"//判断该订单是否属于本人发布
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order: wx.getStorageSync("click_order"),
      ismine: options.ismine
    })
  },

  /**
   * 接取订单
   */
  onTakeOrder: function(){
    let that = this
    //判断订单是否由自己发布
    if(this.data.order.publisher == getApp().globalData.userinfo.stuID){
      Toast.fail("无法接取自己发布的订单")
    }
    else{
      //接取订单
      Dialog.confirm({
        message: '是否接取订单',
      }).then(res=>{
        wx.cloud.callFunction({
          name: "getOrder",
          data: {
            options: "take_order",
            _id: that.data.order._id,
            recipient: getApp().globalData.userinfo.stuID
          }
        }).then(res=>{
          wx.reLaunch({
            url: '../index/index',
          })
        })
      }).catch(()=>{})

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