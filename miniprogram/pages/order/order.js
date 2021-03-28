// pages/order/order.js
import Toast from '@vant/weapp/toast/toast'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh_trigger: false,
    orders:[],
    current_tab: 0,
    accepted_orders:[],
    big: "大件",
    medium:"中件",
    small:"小件",
    card_big_logo: "https://cdn.jsdelivr.net/gh/linhgf/PicGo/img/20210326171431.png",
    card_medium_logo: "https://cdn.jsdelivr.net/gh/linhgf/PicGo/img/20210326171827.png",
    card_small_logo: "https://cdn.jsdelivr.net/gh/linhgf/PicGo/img/20210326171741.png",
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
    that.addLogo()
  },

  /**
   * 导航栏切换
   */
  onTabChange: function(res){
    let that = this
    this.setData({
      current_tab: res.detail.name
    })
    this.getData().then(res=>{
      that.setData({
        orders: res.result.data
      })
      that.changeTime()
      that.addLogo()
    })
    
  },

  /**
   * 根据所在tab获取数据
   */
  getData: function(){
    var option;
    switch(this.data.current_tab){
      case 0://已发布 栏目
        option = "get_private"
        break
      case 1://已接受 栏目
        option = "get_accept"
        break
    }
    if(!wx.getStorageSync("get_accpet")){
      console.log(1111)
    }
    console.log(wx.getStorageSync("get_accpet"))
    return wx.cloud.callFunction({
      name: "getOrder",
      data:{
        options: option,
        stuID: getApp().globalData.userinfo.stuID
      }
    })
  },

  /**
   * 下拉刷新加载新数据
   */
  onRefreshData: function(){
    let that = this
    this.getData().then(res=>{//更新缓存
      Toast("加载完毕 (oﾟvﾟ)ノ")
      //更新数据显示内容
      that.setData({
        refresh_trigger: false,
        orders: res.result.data
      })
      that.changeTime()
      that.addLogo()
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

  /**
   * 根据不同重量为数据添加logo
   */
  addLogo: function(){
    for(var i = 0; i < this.data.orders.length; i++){

      var temp_str = 'orders['+ i +'].logo'
      var logo = ""
      if(this.data.orders[i].weight == this.data.big){
        logo = this.data.card_big_logo
      }
      else if(this.data.orders[i].weight == this.data.medium){
        logo = this.data.card_medium_logo
      }
      else
        logo = this.data.card_small_logo
      this.setData({
        [temp_str]: logo
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