// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Axios from 'axios'
import store from './store'

import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/style/reset.css'
import '@/assets/style/iconfont.css'
import '@/assets/style/animate.css'
import 'swiper/dist/css/swiper.css'

import './util/elementUi.js'
import moment from 'moment'

Vue.config.productionTip = false

Vue.use(VueAwesomeSwiper, /* { default global options } */)

Vue.prototype.$axios = Axios
Vue.prototype.$moment = moment
Axios.defaults.headers.post['Content-type'] = 'application/json'
Axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
