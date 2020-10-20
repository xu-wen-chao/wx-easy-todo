import { data as userData } from './user'
// import DB from './db'
import wxp from 'utils/wxp'

export const data = {
  list: []
}
// 添加清单
export const addList = () => {}
// 删除清单
export const deleteList = () => {}
// 更新清单
export const updateList = () => {}
// 获取清单列表
export const getList = async () => {
  const { result } = await wxp.cloud.callFunction({
    name: 'getList',
    data: { unionId: userData.unionId }
  })
  console.log('res', result)
}
