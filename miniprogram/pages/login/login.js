// pages/login/login.js
import Toast from '@vant/weapp/toast/toast'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    hasuserinfo: false,
    stuID: null,
    password: null,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //已有用户信息则不进行登录验证
    if(app.globalData.hasUserinfo){
      wx.reLaunch({
        url: '../index/index',
      })
    }
    else{//用于切换用户后触发
      wx.getStorage({
        key: 'userinfo',
        success: res=>{
          console.log(res)
          if(res.data != null){
            getApp().hasUserinfo = true
            getApp().userinfo = res.data
          }
        }
      })
    }
  },

  /**
   * 登录
   */
  onGetUserinfo: function(res){
      //判断输入内容是否为空
      if(this.data.stuID == null || this.data.password == null){
        Toast.fail('账号密码不得为空')
      }
      //判断输入是否正确
      else{
        let that = this
        Toast.loading({//显示加载条
          message: '登录中...',
          forbidClick: true,
        })
        wx.cloud.callFunction({
          name: "getUser",
          data: {
            option: "get",
            stuID: that.data.stuID
          }
        }).then(res=>{
          //判断是否存在该用户名
          if(res.result.data.length == 0){
            Toast.fail('用户名或密码错误，请重试')
          }
          else{
            //判断密码是否正确
            if(res.result.data[0].password == this.data.password){//登陆成功
              getApp().globalData.hasUserinfo = true
              getApp().globalData.userinfo = res.result.data[0]
              wx.setStorage({
                data: res.result.data[0],
                key: 'userinfo',
              }).then(res=>{
                wx.reLaunch({
                  url: '../index/index',
                })
              })
              
            }
            else{//登陆失败
              Toast.fail('用户名或密码错误，请重试')
            }
          }
        })
      }

      // else if(res.detail.userInfo){
      //   this.setData({
      //     userinfo: res.detail.userInfo
      //   })}

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 注册
   */
  onRegister: function(){
    wx.navigateTo({
      url: '../register/register',
    })
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