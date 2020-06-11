import store from 'store/index'

App<IAppOption>({
  globalData: {},
  async onLaunch() {
    store.authInit()
    store.getList()
  }
})
