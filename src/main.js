import Vue from 'vue'
import {store} from './store/store'
import App from './App'
import router from './router'
import Alert from './components/Shared/Alert.vue'
import PersonsList from './components/Shared/PersonsList.vue'
import RightDrawer from './components/RightDrawer.vue'

import {Vuetify,
    VApp, VNavigationDrawer, VFooter, VList, VDivider, VBtn, VIcon, VGrid, VToolbar,
    VTextField, VSelect, VRadioGroup, VSwitch, VCheckbox, VAlert, VAvatar, transitions
} from 'vuetify'

Vue.use(Vuetify, {
  components: {
    VApp, VNavigationDrawer, VFooter, VList, VDivider, VBtn, VIcon, VGrid, VToolbar,
    VTextField, VSelect, VRadioGroup, VSwitch, VCheckbox, VAlert, VAvatar, transitions
  },
  theme: {
    primary: '#3f51b5',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})

Vue.component('app-alert', Alert)
Vue.component('persons-list', PersonsList)
Vue.component('right-drawer', RightDrawer)

// import '../node_modules/vuetify/src/stylus/app.styl'
import './stylus/main.styl'
import './stylus/theme.styl'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    this.$store.dispatch('autoSingIn')
  }
})
