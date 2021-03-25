const app = getApp()
import Toast from '@vant/weapp/toast/toast'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    refresh_trigger: false,//为false时关闭loading界面
    topContentLength: 124,//除去卡片 顶部内容占据124
    showLoading: false,//展示加载图
    orders: [],
    toTop: 0,
    lastScrollTop: 0,//子节点上次距离top的位置
    limit: 5,//每次获取5条数据
    isEndOfList: false,//为true时代表数据被取完（旧数据，新数据通过刷新获取）
    search_value: null,
    express: [
      { text: '全部订单', value: 0 },
      { text: '代取物品', value: 1 },
      { text: '代送物品', value: 2 },
    ],
    sort: [
      { text: '默认排序', value: 'a' },
      { text: '重量排序（降序）', value: 'b' },
      { text: '重量排序（升序）', value: 'c' },
    ],
    take: "代取物品",
    deliver: "代送物品",
    card_take_logo: "https://cdn.jsdelivr.net/gh/linhgf/PicGo/img/20210325195322.png",
    card_deliver_logo: "https://cdn.jsdelivr.net/gh/linhgf/PicGo/img/20210325195253.png",
    express_choosed: 0,
    sort_choosed: 'a',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // wx.cloud.callFunction({
    //   name: "getOrder",
    //   data: {
    //     option: "get_unTake",
    //     skip: 0,
    //     limit: that.data.limit
    //   }
    // }).then(res=>{
    //   console.log(res)
    //   this.setData({
    //     orders: res.result.data
    //   })
    // }).then(res=>{
    //   wx.setStorage({
    //     data: this.data.orders,
    //     key: 'orders',
    //   })
    // }).then(res=>{
      
    // })

    //缓存中的订单数据
    that.setData({
      orders: wx.getStorageSync('orders')
    })
    that.changeTime()
  
    
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
   * 滚动
   */
  onScrolling: function(res){

  },

  /**
   * 下拉更新数据
   */
  onRefreshData: function(){
    let that = this
    //获取数据 覆盖原数据 为5条最新数据
    wx.cloud.callFunction({
      name: "getOrder",
      data: {
        option: "get_unTake",
        skip: 0,
        limit: that.data.limit
      }
    }).then(res=>{
      that.setData({
        refresh_trigger: false
      })
      if(res.result.data[0]._id == that.data.orders[0]._id){
        Toast("休息休息吧~暂无新订单 (っ°Д°;)っ")
      }
      else{
        that.setData({
          orders: res.result.data
        })
      }
    })
  },
  
  /**
   * 滑动条到底部时触发
   */
  onScrollToBottom: function(res){
    //this.data.isEndOfList || this.onGetData()
  },

  /**
   * 滑动条滑动到顶部时
   */
  onScrollToTop: function(res){
    
  },

  /**
   * 滑动条到底部时获取额外数据
   */
  onGetData: function(){
    let that = this
    that.setData({
      showLoading: true
    })
    wx.cloud.callFunction({
      name: 'getOrder',
      data: {
        option: "get_unTake",
        skip: that.data.orders.length,
        limit: that.data.limit
      }
    }).then(res=>{//获取完毕
        that.setData({
          orders: [...that.data.orders,...res.result.data],
          isEndOfList: res.result.data.length < that.data.limit ? true : false,
          showLoading: false
        })
        that.changeTime()
      }
    )
  },

  /**
   * 点击订单进入详细页面
   */
  onClickOrder: function(res){
    this.data.orders.forEach(order => {
      if(order._id == res.currentTarget.dataset.id){
        wx.setStorageSync('click_order', order)
        if(order.stuID == getApp().globalData.userinfo.stuID){//判断是否为自己发布的订单
          wx.navigateTo({
            url: '../order/order_detail?ismine=true',
          })
        }
        else{
          wx.navigateTo({
            url: '../order/order_detail?ismine=false',
          })
        }
        
      }
    });
  },


  /**
   * 搜索栏搜索
   */
  onSearch: function(content){
    
  },

  /**
   * 搜索栏输入
   */
  onSearchChange: function(content){
    this.setData({search_value: content.detail})
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
    wx.hideHomeButton()
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