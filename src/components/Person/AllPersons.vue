<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h2>Все персоны</h2>
        <ul v-if="persons">
  				<li v-for="p in persons">
            <router-link :to="`/person/${p._key}`">{{ p.surname }} {{ p.name }} {{ p.midname }}</router-link>
          </li>
  			</ul>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'

export default {
  name: 'all-persons',
  data () {
    return {
      persons: null
    }
  },
  methods: {
    fetchData: function(){
      axiosInst.get('/api/person/all')
          .then(resp => {
            this.persons = resp.data.persons;
          })
          .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
    }
  },
  created: function () {
		this.fetchData()
  }
}
</script>
