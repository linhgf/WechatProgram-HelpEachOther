// miniprogram/pages/order/order_publish.js
import Toast from '@vant/weapp/toast/toast'
import Dialog from '@vant/weapp/dialog/dialog'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_score: 0,
    title: "",
    address: "",
    award: "",
    contact: "",
    pack: "",
    publisher: "",
    remark: "",
    score: "",
      
    telephone: "",
    category: "",
    weight: "",

    category_show: false,
    weight_show: false,

    weight_actions: [
      {
        name: '大件',
        subname: '扣取 15 积分',
      },
      {
        name: '中件',
        subname: '扣取 10 积分',
      },
      {
        name: '小件',
        subname: '扣取 5 积分',
      }
    ],

    category_actions: [
      {
        name: '代取物品',
        subname: '代取快递、物品',
      },
      {
        name: '代送物品',
        subname: '代寄快递、物品',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * category选择面板打开
   */
  onCategoryOpen: function(){
    this.setData({category_show: true})
  },

  /**
   * weight选择面板打开
   */
  onWeightOpen: function(){
    this.setData({weight_show: true})
  },

  /**
   * category选择
   */
  onCategorySelect: function(res){
    this.setData({
      category: res.detail.name
    })
  },

   /**
   * weight选择
   */
  onWeightSelect: function(res){
    this.setData({
      weight: res.detail.name
    })

    if(this.data.weight == "大件"){
      this.setData({
        score: 15
      })
    }
    else if(this.data.weight == "中件"){
      this.setData({
        score: 10
      })
    }

    else{
      this.setData({
        score: 5
      })
    }

  },

  /**
   * category面板关闭
   */
  onCategoryClose: function() {
    this.setData({ category_show: false });
  },

  /**
   * weight面板关闭
   */
  onWeightClose: function() {
    this.setData({ weight_show: false });
  },

  /**
   * 检测是否能发布订单
   */
  onCheck: function(){
    
  },

  /**
   * 提交
   */
  onPublish: function(){
    let that = this
    //检查信息是否填写完整
    if(this.data.title == "" || this.data.contact == "" || this.data.telephone == "" || this.data.category == "" || this.data.weight == "" || this.data.pack == ""
    || this.data.address == ""){
      Toast.fail('内容未填写完整')
      return false
    }
    
    //判断积分是否充足
    wx.cloud.callFunction({
      name: "getUser",
      data:{
        option: "get",
        stuID: getApp().globalData.userinfo.stuID
      }
    }).then(res=>{
      that.setData({
        user_score: res.result.data[0].score
      }) 
      if(that.data.user_score < that.data.score){
        Toast.fail('积分不足')
      }else{
        Dialog.confirm({
          message: '确认发布订单',
        }).then(() => {//确认发布
            that.setData({
              user_score: that.data.user_score - that.data.score
            })
            wx.cloud.callFunction({//发布订单 上传到数据库
              name: "getOrder",
              data: {
                option: "add",
                address: that.data.address,
                award: that.data.award,
                category: that.data.category,
                contact: that.data.contact,
                pack: that.data.pack,
                publisher: getApp().globalData.userinfo.stuID,
                remark: that.data.remark,
                score: that.data.score,
                title: that.data.title,
                weight: that.data.weight,
                telephone: that.data.telephone,
              }
            }).then(res=>{//上传成功后扣除积分
              getApp().globalData.userinfo.score = that.data.user_score
              wx.setStorageSync('userinfo', getApp().globalData.userinfo)
              wx.cloud.callFunction({
                name: "getUser",
                data: {
                  option: "update_score",
                  stuID: getApp().globalData.userinfo.stuID,
                  score: getApp().globalData.userinfo.score
                }
              }).then(res=>{//上传成功后返回主页
                Toast.success('发布成功');
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                 }, 2000)

            })
              
            })
          }).catch(() => {//取消发布
            // on cancel
          });
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