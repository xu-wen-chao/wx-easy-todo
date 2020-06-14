import { data as userData } from './user'
import DB from './db'

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
  const data = await DB.list.where({ unionId: userData.unionId }).get()
  console.log('data', data)
}
