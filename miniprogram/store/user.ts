import wxp from 'utils/wxp'
import { unLoginAvatar } from 'images/index'
import pages from 'config/pages'
const UnionIdStorageKey = 'unionId'

export const data = {
  unionId: '',
  avatarUrl: unLoginAvatar,
  nickName: '',
  isLogin: false
}

export const init = () => {
  data.isLogin = !!wxp.getStorageSync(UnionIdStorageKey)
  !data.isLogin && wxp.navigateTo({ url: pages.login })
}

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

export const logout = () => {
  wxp.removeStorageSync(UnionIdStorageKey)
  data.isLogin = false
}