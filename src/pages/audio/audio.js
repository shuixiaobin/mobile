// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'lib-flexible'
import vconsole from 'vconsole'
import { Loadmore, Toast } from 'mint-ui'
import '../../less/common.less'
Vue.component(Loadmore.name, Loadmore)
if (process.env.NODE_ENV === 'development') {
  const vConsole = new vconsole()
}
Vue.prototype.Toast = Toast
Vue.prototype.eventBus = new Vue()
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
