import create from 'utils/omix/create'
import store from 'store/index'
import wxp from 'utils/wxp'

//获取应用实例
// const app = getApp<IAppOption>()

create.Page(store, {
  loading: false,
  use: ['user'],
  async onLogin() {
    try {
      if (this.loading || store.data.user.isLogin) return
      this.loading = true
      wxp.showToast({
        title: '正在登录...',
        icon: 'loading'
      })
      await store.login()
      wxp.navigateBack()
      setTimeout(() => {
        wxp.showToast({
          title: '登录成功',
          icon: 'none'
        })
      }, 100)
    } catch (error) {
      console.error(error)
      wxp.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      this.loading = false
    }
  },
  logout() {
    if (!store.data.user.isLogin) return
    store.logout()
    wxp.navigateBack()
    setTimeout(() => {
      wxp.showToast({
        title: '已退出登录',
        icon: 'none'
      })
    }, 100)
  }
})
