//index.js
import create from 'utils/omix/create'
import store from 'store/index'
import { TODO_TITLE_MAX_LENGTH } from 'constants/index'

create.Page(store, {
  data: {
    title: '',
    TODO_TITLE_MAX_LENGTH
  },
  onLoad() {
    console.log('load', this.TODO_TITLE_MAX_LENGTH)
  },
  toggleSidebar() {
    this.selectComponent('#sidebar').toggle()
  },
  bindInput(e: VantEvent) {
    const { detail } = e
    console.log(e)
    this.data.title = detail
    console.log(this.data.title)
  },
  bindConfirm(e: VantEvent) {
    console.log(e)
  }
})
