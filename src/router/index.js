import Vue from 'vue'
import Router from 'vue-router'
import discover from '../pages/log/Discover.vue'
import showMonitor from '../pages/monitor/show.vue'
import addMonitor from '../pages/monitor/add.vue'
import modifyMonitor from '../pages/monitor/modify.vue'
import addContact from '../pages/contact/add.vue'
import showContact from '../pages/contact/show.vue'
import event from '../pages/monitor/event.vue'
import EG from '../pages/graph/EventGraph.vue'
import MG from '../pages/graph/ModuleGraph.vue'
import TG from '../pages/graph/TaskGraph.vue'
import LG from '../pages/graph/LogGraph.vue'

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
      path: '/graph/module',
      name: 'module',
      component: MG,
    },
    {
      path: '/graph/task',
      name: 'task',
      component: TG,
    },
    {
      path: '/graph/event',
      name: 'event',
      component: EG,
    },
    {
      path: '/graph/log',
      name: 'log',
      component: LG,
    },
  ]
})
