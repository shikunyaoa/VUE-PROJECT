import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import Treetable from 'vue-table-with-tree-grid'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import Nprograss from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  Nprograss.start()
  return config
})

axios.interceptors.response.use(config => {
  Nprograss.done()
  return config
})
Vue.use(VueQuillEditor)
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', Treetable)
Vue.filter('dateFormat', function (date) {
  const dt = new Date(date)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
