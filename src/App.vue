<template>
  <v-app>
    <v-navigation-drawer v-if="user"
      app
      fixed
      clipped
      v-model="drawer"            
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to="item.url"
        >
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
        <!-- <v-btn flat v-if="user" @click.stop="logout">
          Выход
        </v-btn> -->
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
        <router-link to="/" tag="span" style="cursor: pointer">
          <!-- <v-icon>bubble_chart</v-icon>   -->
          ВРоду
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat v-if="user" :to="`/person/${user._key}`">
          {{user.name}}
        </v-btn>
      </v-toolbar-items>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <!-- <v-icon>menu</v-icon> -->
        <v-icon>face</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
        <router-view>
        </router-view>
    </v-content>

    <v-footer app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: false,
        items: [
          {icon: 'bubble_chart', title: 'Рода', url: "/rod/all"},
          {icon: 'supervisor_account', title: 'Все персоны', url: "/person/all"}
        ]
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      },
      rightDrawer: {
        get() {
          return this.$store.state.rightDrawer
        },
        set(newVal) {
          this.$store.commit('setRightDrawer', newVal)
        }
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('logout')
      }
    },
    created: function () {
      this.$store.dispatch('fetchAllRods')
    }
  }
</script>
