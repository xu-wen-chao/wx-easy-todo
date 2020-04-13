const cloud = require('wx-server-sdk')
const axios = require('axios')
const WXBizDataCrypt = require('./WXBizDataCrypt')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event) => {
  try {
    const { encryptedData, code, iv } = event
    const { data } = await axios.get(
      'https://api.weixin.qq.com/sns/jscode2session',
      {
        params: {
          appid: 'APP_ID',
          secret: 'APP_SECRET',
          js_code: code,
          grant_type: 'authorization_code'
        }
      }
    )
    const wxdc = new WXBizDataCrypt('APP_ID', data.session_key)
    return wxdc.decryptData(encryptedData, iv)
  } catch (error) {
    console.error(error)
    return error
  }
}
