// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  // const wxContext = cloud.getWXContext()
  let task = {}
  const banner = db.collection('minshop_ad').get().then(res => res.data)
  // 分类
  const channel = db.collection('minshop_channel').get()

    // 品牌直供
  const brandList =  db.collection('minshop_brand').where({ is_new: "1" }).orderBy('new_sort_order', 'asc' ).limit(4).get()
  // 新品
  const newGoodsList =  db.collection('minshop_goods').field({id:true, name:true, list_pic_url:true, retail_price:true}).where({ is_new: '1' }).limit(4).get()
  // 人气
  const hotGoodsList =  db.collection('minshop_goods').field({ id: true, name: true, list_pic_url: true, retail_price: true, goods_brief:true } ).where({ is_hot: '1' }).limit(3).get()

  return await Promise.all([banner, channel, brandList, newGoodsList, hotGoodsList]).then((res) =>  ({
    banner:res[0],
    channel: res[1].data,
    brandList: res[2].data,
    newGoodsList: res[3].data,
    hotGoodsList: res[4].data
  }) )
}