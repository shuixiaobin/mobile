// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'lib-flexible'
import Router from 'vue-router'
import {Toast,Indicator} from 'mint-ui'
import vconsole from 'vconsole'
import initShare from '../../common/share'
// if(process.env.NODE_ENV === 'development'){
//     const vConsole = new vconsole();
// }

//初始化分享
initShare()
Vue.prototype.Toast = Toast;
Vue.prototype.Indicator = Indicator;

Vue.use(Router);
const router = new Router({
  mode:'history'
});
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
