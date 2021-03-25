const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    //     option: "get",
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
   * 子节点滚动
   */
  onChildScrolling: function(res){

  },

  
  /**
   * 子滑动条到底部时触发
   */
  onScrollToBottom: function(res){
    //this.data.isEndOfList || this.onGetData()
  },

  /**
   * 子滑动条滑动到顶部时
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
        option: "get",
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
        wx.navigateTo({
          url: '../order/order_detail',
        })
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