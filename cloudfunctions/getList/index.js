const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const get = (unionId) =>
  db.collection('list').where({ creatorId: unionId }).get()

exports.main = async ({ unionId }) => {
  let res = await get(unionId)
  // 默认列表不存在则创建
  if (res.data.length === 0) {
    await db.collection('list').add({
      data: {
        title: '我的清单',
        type: 0,
        creatorId: unionId,
        ctime: db.serverDate(),
        mtime: db.serverDate(),
        color: '#2196F3',
        todos: [],
        deleted: false
      }
    })
    res = await get(unionId)
  }
  return res
}
