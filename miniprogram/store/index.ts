import { data as userData, authInit, login, logout } from './user'
import { data as listData, addList, deleteList, updateList, getList} from './list'
import config from 'config/index'

export default {
  data: {
    user: userData,
    list: listData
  },
  debug: config.debug,
  authInit,
  login,
  logout,
  addList,
  deleteList,
  updateList,
  getList
}
