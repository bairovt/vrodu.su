import Vue from 'vue'
import Router from 'vue-router'
import Rods from '@/components/Rods'
import Rod from '@/components/Rod'
import Tree from '@/components/Person/Tree'
import Profile from '@/components/Person/Profile'
import FindPersons from '@/components/Person/FindPersons'
import CreatePerson from '@/components/Person/CreatePerson'
import AddPerson from '@/components/Person/AddPerson'
import SetRelation from '@/components/Person/SetRelation'
import Signin from '@/components/User/Signin'
import Signup from '@/components/User/Signup'
import notFound from '@/components/notFound'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/rod/all'},
    {path: '/rod/all', name: 'Rods', component: Rods},
    {path: '/rod/:_key', name: 'Rod', component: Rod, props: true},
    {path: '/signin', name: 'Signin', component: Signin}, // todo: redirect на страницу user если уже signed in
    {path: '/signup', name: 'Signup', component: Signup},
    {path: '/profile/:key', name: 'Profile', component: Profile},
    {path: '/person/find', name: 'FindPersons', component: FindPersons},
    {path: '/person/create', name: 'CreatePerson', component: CreatePerson},
    {path: '/tree/:key', name: 'Tree', component: Tree},
    {path: '/person/:key/add/:reltype', name: 'AddPerson', component: AddPerson,
      props: true},
    {path: '/person/:key/set_relation', name: 'SetRelation', component: SetRelation},
    {path: '*', component: notFound}
  ],
  mode: 'history'
})
