// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  let task = []
  // banner
 await db.collection('minshop_ad').get().then(res => {
    task.banner = res.data
  })
  // 分类
  await db.collection('minshop_channel').get().then(res => {
    task.channel = res.data
  })
  // 品牌直供
  await db.collection('minshop_brand').where({ is_new: "1" }).orderBy('new_sort_order', 'asc' ).limit(4).get().then(res => {
    task.brandList = res.data
  })
  // 新品
  await db.collection('minshop_goods').field({id:true, name:true, list_pic_url:true, retail_price:true}).where({ is_new: '1' }).limit(4).get().then(res => {
    task.newGoodsList = res.data
  })
  // 人气
  await db.collection('minshop_goods').field({ id: true, name: true, list_pic_url: true, retail_price: true, goods_brief:true } ).where({ is_hot: '1' }).limit(3).get().then(res => {
    task.hotGoodsList = res.data
  })

  return  {
    ...task
  }
}