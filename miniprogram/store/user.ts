import wxp from 'utils/wxp'
import { unLoginAvatar } from 'images/index'
import pages from 'config/pages'
const UnionIdStorageKey = 'unionId'

export const data = {
  unionId: '',
  avatarUrl: unLoginAvatar,
  nickName: ''
}

// 授权初始化
export const authInit = () => {
  data.unionId = wxp.getStorageSync(UnionIdStorageKey)
  !data.unionId && wxp.navigateTo({ url: pages.login })
}
// 登录
export const login = async () => {
  const { code } = await wxp.login()
  const {
    encryptedData,
    iv,
    userInfo: { avatarUrl, nickName }
  } = await wxp.getUserInfo()
  const { result } = await wxp.cloud.callFunction({
    name: 'login',
    data: {
      encryptedData,
      code,
      iv
    }
  })
  data.unionId = result.unionId
  data.nickName = nickName
  data.avatarUrl = avatarUrl
  wxp.setStorageSync(UnionIdStorageKey, result.unionId)
}
// 退出登录
export const logout = () => {
  wxp.removeStorageSync(UnionIdStorageKey)
  data.unionId = ''
}