import Vue from 'vue'
import Router from 'vue-router'
import discover from '@/components/discover'
import monitor from '@/components/monitor'
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
      path: '/monitor',
      component: monitor
    },
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
