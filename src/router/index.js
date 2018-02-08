import Vue from 'vue'
import Router from 'vue-router'
// import Channel from '@/components/channel/channel'
// import Items from '@/components/items/items'
//路由懒加载
const Channel = r => require.ensure([], () => r(require('@/components/channel/channel')), 'channel')
const Items = r => require.ensure([], () => r(require('@/components/items/items')), 'items')
const Live = r => require.ensure([], () => r(require('@/components/live/live')), 'live')

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name:'root',
      redirect: '/channel',
      meta:{
        path:'/'
      }
    },
    {
      path: '/channel',
      name: 'channel',
      component: Channel,
      meta:{
        path:'/channel'
      }
    },
    {
      path: '/items',
      name: 'items',
      component: Items,
      meta:{
        path:'/channel/items'
      }
    },
    {
      path: '/live',
      name: 'live',
      component: Live,
      meta:{
        path:'/channel/items/live'
      }
    }
  ]
})
