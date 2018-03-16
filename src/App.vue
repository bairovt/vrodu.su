<template>
  <v-app>
    <!-- :disable-route-watcher="$vuetify.breakpoint.smAndUp" -->
    <v-navigation-drawer v-if="user"
      app
      fixed
      clipped
      v-model="drawer"
      temporary
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          v-if="user.hasRoles(item.allowed)"
          :key="i"
          :to="item.url"
        >
        <!-- v-if="!item.allowed || user.hasRoles(item.allowed)" -->
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click.stop="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Выход</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <right-drawer v-if="user">
    </right-drawer>

    <v-toolbar app
      fixed
      clipped-right
      clipped-left
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link v-if="user" :to="`/tree/${user._key}`" tag="span" style="cursor: pointer">
          Род
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat to="/person/find">
          Поиск
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn flat v-if="person" :to="`/profile/${person._key}`">
          {{person.name}}
        </v-btn>
      </v-toolbar-items>
      <v-btn icon @click="rightDrawer = !rightDrawer">
        <v-icon>face</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view>
      </router-view>
    </v-content>

    <v-footer app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: false,
        items: [
          {icon: 'bubble_chart', title: 'Рода', url: '/rod/all'},
          {icon: 'supervisor_account', title: 'Поиск', url: '/person/find'},
          {icon: 'add_circle', title: 'Создать', url: '/person/create', allowed: ['manager']}
        ]
      }
    },
    computed: {
      user () {return this.$store.state.user},
      person () {return this.$store.state.person},
      rightDrawer: {
        get() { return this.$store.state.rightDrawer},
        set(newval) {this.$store.state.rightDrawer = newval}
      }
    },
    methods: {
      logout () {this.$store.dispatch('logout')}
    },
    mounted () {
      // console.log(this.$vuetify.breakpoint)
      if (this.$vuetify.breakpoint.smAndUp) {this.rightDrawer=true}  // open rightDrawer on wide screens
    },
  }
</script>
