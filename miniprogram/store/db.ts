import config from 'config/index'

wx.cloud.init({
  env: config.env,
  traceUser: true
})

const db = wx.cloud.database()

export default {
  list: db.collection('list')
}
