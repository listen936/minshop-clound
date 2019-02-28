// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const model = db.collection('minshop_goods')
  const info = await model.where({ id: event.id }).get()
  const gallery = await db.collection('minshop_goods_gallery').where({ goods_id: event.id }).limit(4).get()
  const brand = await db.collection('minshop_brand').where({ id: info.data[0].brand_id }).get()
  const productList = await db.collection('mishop_product').where({ goods_id: event.id }).get()
  
  return{
    info: info.data[0],
    gallery: gallery.data,
    // attribute: attribute,
    userHasCollect: 0,
    // issue: issue,
    // comment: comment,
    brand: brand.data,
    specificationList: [],
    productList: productList.data
  }

}