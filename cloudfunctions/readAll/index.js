// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'product-77dda4'
})
const db = cloud.database()
const dbName = 'counters'
console.log(db)
const MAX_LIMIT = 80
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection(dbName).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(dbName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}