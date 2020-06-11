import { data as userData } from './user'
import DB from './db'

export const data = {
  list: []
}

export const addList = () => {}
export const deleteList = () => {}

export const updateList = () => {}

export const getList = async () => {
  const data = await DB.list.where({ unionId: userData.unionId }).get()
  console.log('data', data)
}
