<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <template v-if="person">
          <h2>Указать</h2>
          <v-radio-group v-model="reltype" row>
            <v-radio label="родителя" value="parent" color="primary"></v-radio>
            <v-radio label="ребенка" value="child" color="primary"></v-radio>
          </v-radio-group>
          <v-checkbox label="приемный" v-model="adopted" color="primary"></v-checkbox>
          <h3>для {{person.surname}} {{person.name}} {{person.midname}}</h3>
          <br />
      	  <form @submit.prevent="setRelation">
            <v-text-field
  						name="id" label="ключ" type="text"
  						v-model="end_key" required :rules="[rules.required]">
            </v-text-field>

            <v-btn type="submit" class="primary"
  					       :disabled="loading" :loading="loading"
            >
  						Установить связь
  						<span slot="loader" class="custom-loader">
  			        <v-icon light>cached</v-icon>
  			      </span>
  					</v-btn>
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
      axiosInst.post('/api/person/set_relation', {
        start_key: this.person._key,
        end_key: this.end_key,
	      reltype: this.reltype,
        adopted: this.adopted
      })
	      .then(resp => {
	        this.$router.push('/person/' + this.person._key)
	      })
	      .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
		}
  }
}
</script>
