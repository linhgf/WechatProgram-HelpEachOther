// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  //(受托方)放弃订单
  if(event.options == "giveup_order"){
    db.collection("help_order").where({
      _id: event._id
    }).update({
      data:{
        recipient:"",
        recipient_telpehone:"",
        status:"未接取"
      }
    })
  }

  //(委托方)取消委托
  if(event.options == "cancel_order"){
    db.collection("help_order").where({
      _id: event._id
    }).update({
      data:{
        status: "已取消"
      }
    })
  }

  //获取受托方
  if(event.options == "get_recipient"){
    return await db.collection("help_order").where({
      _id: event._id
    }).get()
  }

  //完成订单
  if(event.options == "complete_order"){
    return await db.collection("help_order").where({
      _id: event._id
    }).update({
      data: {
        status: "已完成"
      }
    }).then(
      db.collection("help_user").where({
        stuID: event.stuID
      }).update({
        data:{
          score: event.score,
          finished: event.finished
        }
      })
    )
    
  }

  //查询订单
  if(event.options == "select"){
    return await db.collection("help_order").where({
      _id: event._id
    }).get()
  }

  //发布订单
  if(event.options == "add"){
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
        recipient_telpehone: "",
        title: event.title,
        weight: event.weight,
        telephone: event.telephone,
        publish_time: db.serverDate()
      }
    })
  }

  //接取订单
  if(event.options == "take_order"){
    return await db.collection("help_order").where({
      _id: event._id
    }).update({
      data:{
        status: "进行中",
        recipient: event.recipient,
        recipient_telpehone: event.recipient_telpehone
      }
    })
  }

  //获取个人已接订单
  if(event.options == "get_accept"){
    return await db.collection("help_order").where({
      recipient: event.stuID,
      status:"进行中"
    }).get({success: function(res){
      return res
    }})
  }

  //获取用户个人发布订单
  if(event.options == "get_private"){
    return await db.collection("help_order").where({
      publisher: event.stuID,
      status:_.neq("已完成").and(_.neq("已取消"))
    }).get({success: function(res){
      return res
    }})
  }

  //根据条数获取订单(只获取未被接取的订单)
  if(event.options == "get_unTake"){
    return await db.collection("help_order").where({
        status: "未接取"
    }).orderBy('publish_time','desc').skip(event.skip).limit(event.limit).get()
  }

    //根据条数获取订单(只获取未被接取的大件订单)
    if(event.options == "get_particular_orders"){
      return await db.collection("help_order").where({
          status: "未接取",
          weight: event.weight
      }).orderBy('publish_time','desc').skip(event.skip).limit(event.limit).get()
    }



  if(event.options == "getAll"){//获取全部订单
    return await db.collection("help_order").get()
  }
}