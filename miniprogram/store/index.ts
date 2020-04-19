import { data as userData, init, login, logout } from './user'
import config from 'config/index'

export default {
  data: {
    user: userData
  },
  debug: config.debug,
  init,
  login,
  logout
}
