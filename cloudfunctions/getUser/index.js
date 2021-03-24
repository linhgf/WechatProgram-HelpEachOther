// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //获取数据库
  const db = cloud.database()
  const _ = db.command

  //更新用户积分
  if(event.option == "update_score"){
    return await db.collection("help_user").where({
      stuID: event.stuID
    }).update({
      data:{
        score: event.score
      }
    })
  }
  
  //用户注册
  if(event.option == "add"){
    return await db.collection('help_user').add({
      data:{
        stuID: event.stuID,
        password: event.password,
        score: 30,
        published: 0,
        accepted: 0
      }
    })
  }
  
  //用户登录
  else if(event.option == "get"){
    return await db.collection("help_user").where({
      stuID: event.stuID
    }).get({success: function(res){
      return res
    }})
  }
  
}