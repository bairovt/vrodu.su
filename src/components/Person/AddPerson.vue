<template>
  <v-container>
    <v-layout>
      <v-flex v-if="person" xs12 sm6 offset-sm3>
        <h2>Добавить <strong>{{reltype | translate('v')}}</strong></h2>
        <h3> для: {{person.surname}} {{person.name}} {{person.midname}}</h3>
        <br/>
        <form @submit.prevent="addPerson">
          <v-checkbox :label="labelAdopted" v-model="relation.adopted" color="primary"></v-checkbox>
          <v-text-field
							name="name" label="Имя" type="text"
							v-model="newPerson.name" required :rules="[rules.required]">
          </v-text-field>
          <v-text-field
							name="surname" label="Фамилия"
							type="text" v-model="newPerson.surname">
          </v-text-field>
          <v-text-field
							name="midname" label="Отчество"
							type="text" v-model="newPerson.midname">
          </v-text-field>
          <v-text-field v-if="gender === 0"
							name="maidenName" label="Девичья фамилия"
							type="text" v-model="newPerson.maidenName">
          </v-text-field>
          <v-select
            v-bind:items="rods"
            v-model="newPerson.rod"
            label="Род"
            autocomplete
            item-text="name"
            item-value="_id"
            auto chips clearable
          ></v-select>
          <v-text-field multi-line
              name="info" label="Краткая информация"
              type="text" v-model="newPerson.info">
          </v-text-field>
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
    rods () {return this.$store.state.rods},
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
		      this.$router.push('/person/' + resp.data.newPersonKey);
		    })
		    .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
		}
  },
	filters: {
    translate
	}
}
</script>
