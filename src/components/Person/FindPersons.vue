<template>
  <v-container>
    <v-layout row wrap>
      <!-- <v-flex xs12>
        <h2>Люди</h2>
      </v-flex> -->
      <v-flex xs12>
        <form @submit.prevent="find">
          <v-container>
            <v-layout row wrap>
              <v-flex xs8>
        				<v-text-field autofocus clearable label="Поиск по ФИО"
        					v-model="search">
        				</v-text-field>
        			</v-flex>
              <v-flex xs4>
        				<v-btn class="primary" :disabled="loading" :loading="loading">
                  Найти
                  <span slot="loader" class="custom-loader">
      			        <v-icon light>cached</v-icon>
      			      </span>
                </v-btn>
        			</v-flex>
            </v-layout>
          </v-container>
        </form>
      </v-flex>
      <v-flex xs12>
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
      persons: null,
      search: ''
    }
  },
  computed: {
    loading () {return this.$store.state.loading},
  },
  methods: {
    find () {
      this.$store.commit('setLoading', true)
      axiosInst.get('/api/person/find/' + this.search.trim())
        .then(resp => {
          this.$store.commit('setLoading', false)
          this.persons = resp.data.persons;
        })
        .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
    }
  }
}
</script>
