import Vue from 'vue'
import Router from 'vue-router'
// import Channel from '@/components/channel/channel'
// import Items from '@/components/items/items'
//路由懒加载

const Items = r =>
  require.ensure([], () => r(require('@/components/items/items')), 'items')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/items',
      meta: {
        path: '/'
      }
    },

    {
      path: '/items',
      name: 'items',
      component: Items,
      meta: {
        path: '/channel/items'
      }
    }
  ]
})
