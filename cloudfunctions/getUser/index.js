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
  if(event.options == "update_score"){
    return await db.collection("help_user").where({
      stuID: event.stuID
    }).update({
      data:{
        score: event.score
      }
    })
  }
  
  //用户注册
  if(event.options == "add"){
    return await db.collection('help_user').add({
      data:{
        stuID: event.stuID,
        password: event.password,
        telephone: event.telephone,
        score: 30,
        published: 0,
        accepted: 0,
        finished: 0
      }
    }).then(res=>{
      db.collection("help_message").add({
        data:{
          content:"欢迎加入互帮大家庭",
          stuID: event.stuID,
          title:"欢迎注册使用"
        }
      })
    })
  }
  
  //获取用户信息
  else if(event.options == "get"){
    return await db.collection("help_user").where({
      stuID: event.stuID
    }).get({success: function(res){
      return res
    }})
  }
  
}