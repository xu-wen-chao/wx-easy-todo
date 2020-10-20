import store from 'store/index'
import config from 'config/index'

wx.cloud.init({
  env: config.env,
  traceUser: true
})

App<IAppOption>({
  globalData: {},
  async onLaunch() {
    store.authInit()
    store.getList()
  }
})
