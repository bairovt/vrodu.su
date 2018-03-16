<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <template v-if="person">
          <h2>Соединить</h2>
          <br />
          <h3><strong>{{person.surname}} {{person.name}} {{person.midname}}</strong></h3>
          <h3>c:</h3>
          <v-radio-group v-model="reltype" row>
            <v-radio label="родителем" value="parent" color="primary"></v-radio>
            <v-radio label="ребенком" value="child" color="primary"></v-radio>
          </v-radio-group>
          <v-checkbox label="приемный/отданный" v-model="adopted" color="primary"></v-checkbox>
      	  <form @submit.prevent="setRelation">
            <v-container fluid class="pa-0">
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <!-- <v-subheader>Укажите ключ {{ reltype | translate('v')}}</v-subheader> -->
                  Укажите ключ {{ reltype | translate('v')}}
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    name="id" label="ключ" type="text"
                    v-model="end_key" required :rules="[rules.required]">
                  </v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-btn type="submit" class="primary"
                  :disabled="loading" :loading="loading">
                    Соединить
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
      	  </form>
        </template>
        <template v-else>
          <h2>Не выбрана персона для установления связи</h2>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'
import {translate} from '@/filters'

export default {
  name: 'setRelation',
  data () {
    return {
	    end_key: null,
	    reltype: 'parent',
      adopted: false
    }
  },
  computed: {
    person () {return this.$store.state.person},
    loading () {return this.$store.state.loading},
    rules () {return this.$store.state.rules}
  },
  methods: {
    setRelation () {
      axiosInst.post('/api/child/set_relation', {
        start_key: this.person._key,
        end_key: this.end_key,
	      reltype: this.reltype,
        adopted: this.adopted
      })
	      .then(resp => {
	        this.$router.push('/tree/' + this.person._key)
	      })
	      .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
		}
  },
  filters: {
    translate
  }
}
</script>
