<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h2>Люди</h2>
        <persons-list :persons="persons" />
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
    loadData: function(){
      axiosInst.get('/api/person/all')
          .then(resp => {
            this.persons = resp.data.persons;
          })
          .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
    }
  },
  created: function () {
		this.loadData()
  }
}
</script>
