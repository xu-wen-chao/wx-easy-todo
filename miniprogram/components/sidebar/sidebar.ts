import create from 'utils/omix/create'
import store from 'store/index'

create.Component(store, {
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {
    show: false
  },
  methods: {
    toggle() {
      this.setData({ show: !this.data.show })
    }
  }
})
