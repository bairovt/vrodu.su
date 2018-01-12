import Vue from 'vue'
import Router from 'vue-router'
import Rods from '@/components/Rods'
import Rod from '@/components/Rod'
import Person from '@/components/Person/Person'
import Signin from '@/components/User/Signin'
import Signup from '@/components/User/Signup'
import notFound from '@/components/notFound'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/rod/all'
    },
    {
      path: '/rod/all',
      name: 'Rods',
      component: Rods
    },
    {
      path: '/rod/:key',
      name: 'Rod',
      component: Rod
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/person/:key',
      name: 'Person',
      component: Person
    },
    {
      path: '*',
      component: notFound
    }
  ],
  mode: 'history'
})
