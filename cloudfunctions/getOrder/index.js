// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  //发布订单
  if(event.option == "add"){
    return await db.collection("help_order").add({
      data: {
        address: event.address,
        award: event.award,
        category: event.category,
        contact: event.contact,
        pack: event.pack,
        publisher: event.publisher,
        remark: event.remark,
        score: event.score,
        status: "未接取",
        recipient: "",
        title: event.title,
        weight: event.weight,
        telephone: event.telephone,
        publish_time: db.serverDate()
      }
    })
  }

  //接取订单
  if(event.option == "take_order"){
    return await db.collection("help_order").where({
      _id: event._id
    }).update({
      data:{
        status: "进行中",
        recipient: event.recipient
      }
    })
  }

  //获取用户个人订单
  if(event.option == "get_private"){
    return await db.collection("help_order").where({
      publisher: event.stuID
    }).get({success: function(res){
      return res
    }})
  }

  //根据条数获取订单(只获取未被接取的订单)
  if(event.option == "get_unTake"){
    return await db.collection("help_order").where({
        status: "未接取"
    }).orderBy('publish_time','desc').skip(event.skip).limit(event.limit).get()
  }

  if(event.option == "getAll"){//获取全部订单
    return await db.collection("help_order").get()
  }
}