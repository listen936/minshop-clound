// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const goodsId = event.goodsId
  const productId = event.productId
  const number = event.number

  // 判断商品是否可以购买
  const goodsInfo
  await db.collection('minshop_goods').where({ id: goodsId }).get().then(res=>{
    goodsInfo = res.data
  })
  if (goodsInfo.length < 1 || goodsInfo[0].is_delete === 1) {
    return '商品已下架'
  }

  // 取得规格的信息,判断规格库存
  const productInfo
  await db.collection('product').where({ goods_id: goodsId, id: productId }).get().then(res => {
    productInfo = res.data
  });
  if (productInfo.length < 0 || productInfo[0].goods_number < number) {
    return '库存不足'
  }

  // 判断购物车中是否存在此规格商品
  const cartInfo
  await db.collection('minshop_cart').where({ goods_id: goodsId, product_id: productId }).get().then(res => {
    cartInfo = res.data
  })
  if (cartInfo.length < 1) {
    // 添加操作

    // 添加规格名和值
    let goodsSepcifitionValue = [];
    if (!productInfo[0].goods_specification_ids) {
      goodsSepcifitionValue = await this.model('goods_specification').where({
        goods_id: goodsId,
        id: { 'in': productInfo.goods_specification_ids.split('_') }
      }).getField('value');
    }

    // 添加到购物车
    const cartData = {
      goods_id: goodsId,
      product_id: productId,
      goods_sn: productInfo.goods_sn,
      goods_name: goodsInfo.name,
      list_pic_url: goodsInfo.list_pic_url,
      number: number,
      session_id: 1,
      user_id: this.getLoginUserId(),
      retail_price: productInfo.retail_price,
      market_price: productInfo.retail_price,
      goods_specifition_name_value: goodsSepcifitionValue.join(';'),
      goods_specifition_ids: productInfo.goods_specification_ids,
      checked: 1
    };

    await this.model('cart').thenAdd(cartData, { product_id: productId });
  } else {
    // 如果已经存在购物车中，则数量增加
    if (productInfo.goods_number < (number + cartInfo.number)) {
      return this.fail(400, '库存不足');
    }

    await this.model('cart').where({
      goods_id: goodsId,
      product_id: productId,
      id: cartInfo.id
    }).increment('number', number);
  }
  return this.success(await this.getCart());
}