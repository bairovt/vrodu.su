<template>
  <v-container>
    <v-layout row>
      <v-flex v-if="person" xs12 sm6 offset-sm3>
        <h2>Добавить <strong>{{reltype | translate('v')}}</strong></h2>
        <h3> для: {{person.surname}} {{person.name}} {{person.midname}}</h3>
        <br/>
        <form @submit.prevent="addPerson">
          <v-checkbox :label="labelAdopted" v-model="relation.adopted" color="primary"></v-checkbox>

          <person-fields :person="newPerson"></person-fields>

          <v-btn type="submit" class="primary"
					       :disabled="loading" :loading="loading"
          >
						Добавить {{reltype | translate('v')}}
						<span slot="loader" class="custom-loader">
			        <v-icon light>cached</v-icon>
			      </span>
					</v-btn>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axiosInst from '@/utils/axios-instance'
import {translate} from '@/filters'

export default {
  name: 'addPerson',
  props: ['reltype'],
  data () {
    return {
      newPerson: {},
      relation: {
        adopted: false
      }
    }
  },
  computed: {
    person () {return this.$store.state.person},
    loading () {return this.$store.state.loading},
    rules () {return this.$store.state.rules},
    gender () {return ['mother', 'daughter'].includes(this.reltype)  ? 0 : 1},
    labelAdopted () {
      switch (this.reltype) {
        case 'father': return 'приемный отец/отчим';
        case 'mother': return 'приемная мать/мачеха';
        case 'son': return 'приемный сын/пасынок';
        case 'daughter': return 'приемная дочь/падчерица';
      }
    }
  },
  methods: {
    addPerson () {
      this.newPerson.gender = this.gender
      axiosInst.post(`/api/person/${this.person._key}/add/${this.reltype}`, {
        personData: this.newPerson,
        relation: this.relation
      }).then(resp => {
		      this.$router.push('/tree/' + resp.data.newPersonKey);
		    })
		    .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
		}
  },
	filters: {
    translate
	}
}
</script>
