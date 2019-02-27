// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event);
  let model = db.collection('minshop_category')
  let currentCategory,goodsList,brotherCategory;
  await model.where({id:event.id}).get().then(res =>{
    currentCategory = res.data
  })
  
  await db.collection('minshop_goods').where({ category_id: event.id}).get().then(res => {
    goodsList = res.data
  });;
  await model.where({ parent_id: currentCategory[0].parent_id }).orderBy('sort_order','asc').get().then(res => {
    brotherCategory = res.data
  });;
  return {
    currentCategory,
    goodsList,
    brotherCategory
  };
}