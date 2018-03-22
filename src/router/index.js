import Vue from 'vue'
import Router from 'vue-router'
import discover from '@/components/discover'
import show_monitor from '@/components/monitor/show'
import add_monitor from '@/components/monitor/add'
import modify_monitor from '@/components/monitor/modify'
import add_contact from '@/components/contact/add'
import show_contact from '@/components/contact/show'
import event from '@/components/monitor/event'
import alarm from '@/components/alarm'
import health from '@/components/health'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/discover',
      component: discover
    },
    {
      path: '/monitor/show',
      component: show_monitor,
    },
    {
      path: '/monitor/add',
      component: add_monitor
    },
    {
      path: '/monitor/event',
      component: event
    },
    {
      path: '/monitor/modify/:id',
      component: modify_monitor,
      props: true
    },
    {
      path: '/contact/add',
      component: add_contact
    },
    {
      path: '/contact/show',
      component: show_contact
    }
    ,
    {
      path: '/alarm',
      component: alarm
    },
    {
      path: '/health',
      component: health
    }
  ]
})
