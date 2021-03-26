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
    show_orders: [],//用于展示
    orders: [],//容纳全部订单
    big_orders: [],//容纳全部大订单
    medium_orders: [],//容纳全部中订单
    small_orders: [],//容纳全部小订单
    toTop: 0,
    lastScrollTop: 0,//子节点上次距离top的位置
    limit: 5,//每次获取5条数据
    isEndOfList: false,//为true时代表数据被取完（旧数据，新数据通过刷新获取）
    search_value: null,
    express: [
      { text: '全部订单', value: 0 },
      { text: '大件', value: 1 },
      { text: '中件', value: 2 },
      { text: '小件', value: 3 },
    ],
    sort: [
      { text: '默认排序', value: 'a' },
      { text: '时间排序（降序）', value: 'b' },
      { text: '时间排序（升序）', value: 'c' },
    ],
    big: "大件",
    medium:"中件",
    small:"小件",
    card_big_logo: "https://cdn.jsdelivr.net/gh/linhgf/PicGo/img/20210326171431.png",
    card_medium_logo: "https://cdn.jsdelivr.net/gh/linhgf/PicGo/img/20210326171827.png",
    card_small_logo: "https://cdn.jsdelivr.net/gh/linhgf/PicGo/img/20210326171741.png",
    express_choosed: 0,
    sort_choosed: 'a',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       let that = this
    // this.getData(0,that.data.limit,this.data.express_choosed).then(res=>{
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
    that.addLogo()
  },

  /**
   * 下拉菜单切换
   */
  onDropDownChange: function(res){
    let that = this
    var category = res.detail
    this.getData(0,this.data.limit,res.detail).then(res=>{
      that.setData({
        express_choosed: category,
        orders: res.result.data,
        isEndOfList: false
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



  /**
   * 获取数据
   * 
   * Paramters:
   *  category:当前页面展示类型
   *  skip:要跳过的数据个数
   *  limit:获取的数据个数
   * Rturns:
   *  orders数组 
   */
  getData: function(skip, limit, category){
    var option,weight;
    switch(category){
      case 0:
        option = "get_unTake"
        break
      case 1://获取大件物品订单列表
        weight = "大件"
        option = "get_particular_orders"
        break
      case 2://获取中件物品订单列表
        weight = "中件"
        option = "get_particular_orders"
        break
      case 3://获取小件物品订单列表
        weight = "小件"
        option = "get_particular_orders"
    }

    return wx.cloud.callFunction({
      name:"getOrder",
      data:{
        options: option,
        skip: skip,
        limit: limit,
        weight: weight
      }
    })
  },

  /**
   * 下拉刷新获取数据
   */
  onRefreshData: function(){
    let that = this
    //获取数据 覆盖原数据 为5条最新数据
    this.getData(0,that.data.limit,this.data.express_choosed).then(res=>{
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
   * 到达底部获取数据数据
   */
  onScrollToBottomToGetData: function(){
    let that = this
    that.setData({
      showLoading: true
    })
    this.getData(that.data.orders.length,this.data.limit,this.data.express_choosed).then(res=>{//获取完毕
        that.setData({
          orders: [...that.data.orders,...res.result.data],
          isEndOfList: res.result.data.length < that.data.limit ? true : false,
          showLoading: false
        })
        that.changeTime()
        that.addLogo()
      }
    )
  },

  /**
   * 滑动条到底部时触发
   */
  onScrollToBottom: function(res){
    this.data.isEndOfList || this.onScrollToBottomToGetData()
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