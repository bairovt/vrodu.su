<template>
  <v-container>
    <v-layout row wrap>
      <v-flex class="xs12">
        <h2>Рода</h2>
        <br />
      </v-flex>
      <v-flex class="xs12" v-if="rods">
        <h3>
          <router-link to="/tree/Khory">Хори</router-link> буряты
          <!-- Хори буряты -->
        </h3>
        <br />
        <span v-for="rod in rods" :key="rod._id" class="pa-2">
          <router-link :to="`/rod/${rod._key}`">{{ rod.name }} <span class="small">{{ rod.count }}</span></router-link>
        </span>
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
