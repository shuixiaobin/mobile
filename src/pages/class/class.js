// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'lib-flexible'
import '../../less/common.less'
import vconsole from 'vconsole'
import { Toast } from 'mint-ui';
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
