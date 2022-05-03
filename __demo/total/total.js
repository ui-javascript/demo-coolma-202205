import Vue from 'vue'
import App from './total.vue'
import router from './components/Router'

import "./total.scss"
import "./total.less"

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
