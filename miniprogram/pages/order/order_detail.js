// miniprogram/pages/order/order_detail.js
import Toast from '@vant/weapp/toast/toast'
import Dialog from '@vant/weapp/dialog/dialog'
import QR from "../../wxapp-qrcode/utils/qrcode"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    ismine: "false",//判断该订单是否属于本人发布
    is_me_accept: "fasle",//判断订单是否本人接受
    QR_result: ""//扫描二维码结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order: wx.getStorageSync("click_order"),
      ismine: options.ismine,
      is_me_accept: options.is_me_accept
    })
    if(this.data.is_me_accept == 'true'){
      this.onCreateCode()
    }
  },

  /**
   * 创建二维码
   * @param {*} content 
   * @param {*} canvasId 
   * @param {*} cavW 
   * @param {*} cavH 
   */
  createQrCode: function (content, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(content, canvasId, cavW, cavH, this);
  },
  
  /**
   * 调用创建二维码接口
   */
  onCreateCode: function(){
    var size = this.setCanvasSize(); //动态设置画布大小
    this.createQrCode (this.data.order._id, 'mycanvas', size.w, size.h)
  },

  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },

  /**
   * 扫描二维码
   */
  onScanCode: function(){
    let that = this
    wx.scanCode({
      success (res) {
        that.setData({
          QR_result: res.result
        })
        if(that.data.QR_result == that.data.order._id){//订单号正确
          Dialog.confirm({
            message: '是否确认完成该订单',
            confirmButtonText: '确认',
          }).then(res=>{//用户确定完成订单
            wx.cloud.callFunction({//获取用户积分、已完成订单数 以用来更新数据
              name: "getUser",
              data:{
                options: "get",
                stuID: getApp().globalData.userinfo.stuID
              }
            }).then(res=>{//更新订单信息以及用户相应信息（完成订单数、积分）
              console.log(11111)
              wx.cloud.callFunction({
                name:"getOrder",
                data:{
                  options: "complete_order",
                  _id: that.data.order._id,
                  stuID: getApp().globalData.userinfo.stuID,
                  score: res.result.data[0].score + that.data.order.score,
                  finished: res.result.data[0].finished + 1
                }
              }).then(res=>{//更改完数据后回调
                Toast.success('订单已完成~辛苦了！');
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../order/order',
                  })
                 }, 2000)
              })
            })
          }).catch(()=>{})
         
        }
        else{//扫描二维码结果不是该订单
          wx.cloud.callFunction({//查询该订单是属于用户
            name: "getOrder",
            data:{
              options: "select",
              _id: that.data.QR_result
            }
          }).then(res=>{
            if(res.result.data[0].publisher == getApp().globalData.userinfo.stuID){//当前订单发布者为当前用户 询问用户是否跳转到另一个订单中
              let result = res.result.data[0]
              Dialog.confirm({
                message: '当前订单非本页面订单，是否跳转至该订单？',
                confirmButtonText: '确认',
              }).then(res=>{//用户确认跳转
                wx.setStorageSync('click_order', result)
                that.setData({
                  order: result
                })
                that.changeTime()
              }).catch(()=>{})
            }

            else{//当前订单不属于该用户
                Toast.fail("当前订单非您所发布订单(T＿T)")
            }

          })
        }
      }
    })
  },

    /**
   * 将数据库中的时间格式进行转换
   */
  changeTime: function(){
    var date = new Date(this.data.order.publish_time)
    var create_date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    var temp_str = 'order.publish_time'
    console.log(this.data.order)
    this.setData({
      [temp_str]: create_date_time
    }) 
    console.log(this.data.order)
  },

  /**
   * 获取委托相关详情
   */
  onGetDetail: function(){
    let that = this
    if(that.data.order.recipient_telpehone){
      Dialog.alert({
        title: '委托详情',
        message: "受托方联系方式:" + that.data.order.recipient_telpehone ,
        showCancelButton: false,
        confirmButtonText: '扫描二维码',
        closeOnClickOverlay: true
      }).then(res=>{//调用扫描二维码方法
        this.onScanCode()
      }).catch(()=>{})
    }else{
      Dialog.alert({
        message: '耐心等等吧~\n暂未有人接取此订单',
      }).then(() => {
        // on close
      });
    }

    
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
            recipient_telpehone: getApp().globalData.userinfo.recipient_telpehone,
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