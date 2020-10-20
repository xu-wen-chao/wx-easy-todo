const db = wx.cloud.database()

export default {
  list: db.collection('list')
}
