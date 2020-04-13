import wxp from 'utils/wxp'
const UnionIdStorageKey = 'unionId'

export const data = {
  unionId: ''
}

export const getUnionId = (): string => {
  return wxp.getStorageSync(UnionIdStorageKey)
}

export const setUnionId = async () => {
  const { code } = await wxp.login()
  const { encryptedData, iv } = await wxp.getUserInfo()
  const { result }  = await wxp.cloud.callFunction({
    name: 'login',
    data: {
      encryptedData,
      code,
      iv
    }
  })
  data.unionId = result.unionId
  wxp.setStorageSync(UnionIdStorageKey, result.unionId)
}
