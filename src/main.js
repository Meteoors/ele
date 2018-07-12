import Vue from 'vue'
import app from './App'
import router from './router'

import './common/stylus/fonts.styl'
import './mock/mockServer'

import VueResource from 'vue-resource'
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(app)
})
