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
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-if="user"
      app right
      fixed
      clipped
      v-model="rightDrawer"
    >
      <v-layout column align-center>
        <br>
        <img src="/static/v.png" alt="Vuetify.js" class="mb-5" />
        <blockquote>
          &#8220;First, solve the problem. Then, write the code.&#8221;
          <footer>
            <small>
              <em>&mdash;John Johnson</em>
            </small>
          </footer>
        </blockquote>
      </v-layout>
    </v-navigation-drawer>

    <v-toolbar fixed app
      clipped-right
      clipped-left
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat v-if="user" :to="`/person/${user._key}`">
          {{user.name}}
        </v-btn>
        <v-btn flat v-if="user" @click.stop="logout">
          Выход
        </v-btn>
      </v-toolbar-items>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
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
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        rightDrawer: false,
        title: 'ВРоду'
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('logout');
      }
    }
  }
</script>
