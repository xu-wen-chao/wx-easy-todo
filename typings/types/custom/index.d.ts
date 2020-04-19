declare module 'miniprogram-api-promise'

declare namespace WechatMiniprogram {
  interface Wx {
    login(
      option?: WechatMiniprogram.LoginOption
    ): Promise<{
      code: string
    }>
    getUserInfo(
      option?: GetUserInfoOption
    ): Promise<{
      encryptedData: string
      iv: string,
      userInfo: WechatMiniprogram.UserInfo
    }>
  }
  interface UserInfo {
    unionId: string
  }
}

interface WxCloud {
  callFunction(
    param: RQ<ICloud.CallFunctionParam>
  ): Promise<{ result: WechatMiniprogram.UserInfo }>
}
