// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'


import fastclick from 'fastclick'
import axios from 'axios'

import filter from './filter'

import '@/wechat/index'

import "@/common/js/flexible.js"
import '@/common/stylus/index.styl'

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  filter,
  store,
  template: '<App/>',
  components: { App }
})
