// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'


import fastclick from 'fastclick'
import axios from 'axios'

import filter from './filter'

import Vodal from 'vodal'

import '@/wechat/index'
import "@/common/js/flexible.js"
import '@/common/stylus/index.styl'
import 'vodal/common.css'
import 'vodal/door.css'
import 'vodal/slide-down.css'
import 'common/player.css'

fastclick.attach(document.body)

Vue.component(Vodal.name,Vodal)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  filter,
  store,
  template: '<App/>',
  components: { App }
})
