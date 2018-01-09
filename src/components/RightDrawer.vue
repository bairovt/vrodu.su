<template>
  <v-navigation-drawer
    app
    right
    fixed
    clipped
    :value="rightDrawer"
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
</template>

<script>
export default {
  name: 'RightDrawer',
  data () {
    return {
    }
  },
  computed: {
    rightDrawer () {
      return this.$store.state.rightDrawer;
    }
  }
}
</script>

<style scoped>

</style>
