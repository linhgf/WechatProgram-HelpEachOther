// pages/user/user.js
import Dialog from '@vant/weapp/dialog/dialog'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    finished: 0,
    accepted: 0,
    stuID: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      score: getApp().globalData.userinfo.score,
      finished: getApp().globalData.userinfo.finished,
      accepted: getApp().globalData.userinfo.accepted,
      stuID: getApp().globalData.userinfo.stuID
    })
  },

  /**
   * 发布订单
   */
  onPublish: function(){
    wx.navigateTo({
      url: '../order/order_publish',
    })
  },

  /**
   * 清除缓存（切换用户后）
   */
  onClearStorage: function(){
    wx.setStorageSync('userinfo', null)//去除缓存中的用户信息
    getApp().globalData.hasUserinfo = false//登录状态去除
  },

  /**
   * 登出
   */
  onLoginOut: function(){
    Dialog.confirm({
      title: '登出',
      message: '是否登出当前账号',
    })
      .then(() => {
        this.onClearStorage()
        wx.reLaunch({
          url: '../login/login',
        })
      })
      .catch(() => {
        // on cancel
      });
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