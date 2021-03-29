import Toast from '@vant/weapp/toast/toast'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuID: "",
    openid: "",
    password: "",
    confirm_password: "",
    telephone: "",
    exited_stuID: false,
    wrong_confirm_password: false,
    wrong_length_password: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 检查用户输入内容是否正确
   */
  onCheckInput: function(){
    //判定用户信息是否填写完整
    if(this.data.stuID == "" || this.data.password == "" || this.data.confirm_password == "" || this.data.telephone == ""){      
      Toast.fail('账号密码不得为空')
      return false
    }

    //判断密码长短是否符合要求
    if(this.data.password.length < 6){
      Toast.fail('密码长度不足6位')
      this.setData({
        wrong_length_password: true
      })
      return false
    }else{
      this.setData({
        wrong_length_password: false
      })
    }

    //判断两次密码输入是否一致
    if(this.data.password != this.data.confirm_password){
      Toast.fail('两次密码输入不一致')
      this.setData({
        wrong_confirm_password: true
      })
      return false
    }else{
      this.setData({
        wrong_confirm_password: false
      })
    }

    return true
  },

  /**
   * 注册
   */
  onGetUserinfo: function(res){

    //登录
    if(this.onCheckInput() == true){
      //获取openid
      wx.cloud.callFunction({
        name: "login",
      }).then(res=>{
        this.setData({
          openid: res.result.openid
        })
        wx.cloud.callFunction({
          name:"getUser",
          data: {
            option: "get",
            stuID: this.data.stuID
          }
        }).then(res=>{//获取到对应信息
          //账号未存在 允许注册
          if(res.result.data.length == 0){
            this.setData({
              exited_stuID: false
            })
            //获取openid后将用户信息插入数据库
              wx.cloud.callFunction({
                name: "getUser",
                data:{
                option: "add",
                stuID: this.data.stuID,
                password: this.data.password,
                telephone: this.data.telephone
                }
              }).then(res=>{//注册成功后 转入主页
                console.log("注册成功")
                wx.reLaunch({
                  url: '../index/index',
                })
              })
          }
          else{
            this.setData({
              exited_stuID: true
            })
            Toast.fail("该用户已存在")
          }
        })
      })
    }

  },

  /**
   * 返回登录界面
   */
  onToLogin: function(){
    wx.redirectTo({
      url: '../login/login',
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