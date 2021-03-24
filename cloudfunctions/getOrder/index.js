// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

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

  if(event.option == "get_private"){
    return await db.collection("help_order").where({
      publisher: event.stuID
    }).get({success: function(res){
      return res
    }})
  }

  if(event.option == "get"){//懒加载 每次加载 15 条
    return await db.collection("help_order").limit(15).get()
  }

  if(event.option == "getAll"){//获取全部订单
    return await db.collection("help_order").get()
  }
}