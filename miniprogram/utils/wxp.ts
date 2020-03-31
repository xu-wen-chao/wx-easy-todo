import { promisifyAll } from 'miniprogram-api-promise'
// @ts-ignore-start
const wxp: WechatMiniprogram.Wx = {}
// @ts-ignore-end
promisifyAll(wx, wxp)
export default wxp
