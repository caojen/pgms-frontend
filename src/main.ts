import Vue from 'vue'
import App from './Layout.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import Meta from 'vue-meta'

Vue.use(Antd)
Vue.use(Meta)

Vue.config.productionTip = true

new Vue({
  router,
  store,
  metaInfo () {
    return {
      title: '中山大学｜计算机学院｜研究生管理系统'
    }
  },
  render: h => h(App)
}).$mount('#app')
