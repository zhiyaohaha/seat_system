import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import ajax from './ajax'

import './common/reset.styl'
import 'element-ui/lib/theme-chalk/index.css'
import './mock/seatData'

Vue.use(ElementUI);
Vue.prototype.$ajax = ajax
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
