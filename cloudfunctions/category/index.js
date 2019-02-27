// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let currentCategory = [];
  await db.collection('minshop_category').where({parent_id:'0'}).orderBy('show_index','asc').get().then(res => {
    currentCategory = res.data
  })
  // let task = [];
  // categoryList.map((val) => {
  //   currentCategory.push(val)
  // })
  for (let i = 0; i < currentCategory.length;i++){
    await db.collection('minshop_category').where({ parent_id: currentCategory[i].id }).orderBy('sort_order', 'asc').get().then(res => {
      currentCategory[i].subCategoryList = res.data
    })
    
  }
  // // 等待所有
  // return (await Promise.all(currentCategory)).reduce((acc, cur) => {
  //   return {
  //     data: acc.data.concat(cur.data),
  //     errMsg: acc.errMsg,
  //   }
  // })
  return {
    currentCategory
  }

}