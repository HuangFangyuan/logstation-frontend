import Vue from 'vue'
import Router from 'vue-router'
import discover from '../pages/log/Discover.vue'
import showMonitor from '../pages/monitor/show.vue'
import addMonitor from '../pages/monitor/add.vue'
import modifyMonitor from '../pages/monitor/modify.vue'
import addContact from '../pages/contact/add.vue'
import showContact from '../pages/contact/show.vue'
import event from '../pages/monitor/event.vue'
import graph from '../pages/graph/show.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/log/discover',
      component: discover
    },
    {
      path: '/monitor/show',
      component: showMonitor,
    },
    {
      path: '/monitor/add',
      component: addMonitor
    },
    {
      path: '/monitor/event',
      component: event
    },
    {
      path: '/monitor/modify/:id',
      component: modifyMonitor,
      props: true
    },
    {
      path: '/contact/add',
      component: addContact
    },
    {
      path: '/contact/show',
      component: showContact
    }
    ,
    {
      path: '/graph',
      name: 'graph',
      component: graph,
    },
  ]
})
