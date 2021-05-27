import Vue from 'vue'
import App from './App'
import 'lib-flexible'
import vconsole from 'vconsole'
import { Toast } from 'mint-ui'
import '../../less/common.less'
if (process.env.NODE_ENV === 'development') {
  const vConsole = new vconsole()
}
Vue.prototype.Toast = Toast
//初始化分享
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
