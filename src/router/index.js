import Vue from 'vue'
import Router from 'vue-router'
import discover from '@/components/log/Discover'
import showMonitor from '@/components/monitor/show'
import addMonitor from '@/components/monitor/add'
import modifyMonitor from '@/components/monitor/modify'
import addContact from '@/components/contact/add'
import showContact from '@/components/contact/show'
import event from '@/components/monitor/event'
import health from '@/components/health/health'
import healthGraph from '@/components/health/graph'


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
      path: '/health',
      component: health
    },
    {
      path: '/health/graph',
      component: healthGraph
    }
  ]
})
