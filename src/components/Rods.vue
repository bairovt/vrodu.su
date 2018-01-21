<template>
  <v-container>
    <v-layout row wrap>
      <v-flex class="xs12">
        <h1>Рода</h1>
      </v-flex>
      <v-flex class="xs12" v-if="rods">
        <h2><router-link to="/person/Khory">Хори</router-link> буряты</h2>
        <br />
        <p v-for="rod in rods" :key="rod._id">
          <router-link :to="`/rod/${rod._key}`">{{ rod.name }} <span class="small">{{ rod.count }}</span></router-link>
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'

export default {
  name: 'Rods',
  computed: {
    rods () {
      return this.$store.state.rods
    }
  },
  created: function () {
    this.$store.dispatch('loadAllRods')
  }
}
</script>

<style scoped>
h1 {
  text-align: center
}
</style>
