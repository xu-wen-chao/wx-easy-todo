import create from 'utils/omix/create'
import store from 'store/index'

create.Component(store, {
  data: {
    show: false
  },
  methods: {
    toggle() {
      this.setData({show: !this.data.show})
    }
  }
})
