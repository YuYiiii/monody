// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import CusBread from './components/cusBread.vue'
import router from './router'
import ELEMENT from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/bace.css'
import moment from 'moment'

import HttpServer from './components/http'
// vue插件的使用


Vue.use(HttpServer)
Vue.use(ELEMENT)


Vue.config.productionTip = false

/* eslint-disable no-new */
// 全局过滤器
Vue.filter('fmtdate',(v)=>{
   return moment(v).format('YYYY-MM-DD')
})

// 全局自定义组件
Vue.component(CusBread.name,CusBread)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
