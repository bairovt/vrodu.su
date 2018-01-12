<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h2>{{rod.name}}</h2>
        <h3>{{rod.about}}</h3>
        <ul>
          <li v-for="person in persons" :key="person._id">
            <router-link :to="`/person/${person._key}`">
              {{person.surname}} {{person.name}} {{person.midname}}
            </router-link>
          </li>
  			</ul>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'

function getRodPersons(rod_key, vm) {
  axiosInst.get(`/api/rod/${rod_key}/persons`)
      .then(resp => {
        vm.rod = resp.data.rod;
        vm.persons = resp.data.persons;
      })
      .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
}

export default {
  name: 'rods',
  data () {
    return {
      rod: {},
      persons: []
    }
  },
  methods: {
    getPersons: function (newRoute, oldRoute) {
      let vm = this;
      getRodPersons(newRoute.params.key, vm);
    }
  },
  created: function(){
    let vm = this;
    getRodPersons(this.$route.params.key, vm);
  },
  watch: {
    '$route': 'getPersons'
  }
}
</script>

<style scoped>
</style>
