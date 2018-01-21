<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h2>Люди</h2>
        <v-list>
          <template v-for="p in persons">
            <v-list-tile avatar :key="p.title" :to="`/person/${p._key}`">
              <v-list-tile-avatar>
                <img v-if="p.image" :src="`/static/upload/${p._key}/${p.image}`">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{p.surname}} {{p.name}} {{p.midname}}</v-list-tile-title>
                <v-list-tile-sub-title>{{p.about}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
          </template>
        </v-list>
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
