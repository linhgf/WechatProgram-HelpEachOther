// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  //发送信息
  if(event.options == "send_message"){
    db.collection("help_message").add({
      data:{
        content:event.content,
        stuID: event.stuID,
        title: event.title
      }

  })
  }

  //获取信息
  if(event.options == "get"){
    return await db.collection("help_message").where({
      stuID: event.stuID
    }).orderBy('time','desc').get()
  }}