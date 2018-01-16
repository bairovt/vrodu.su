<template>
  <v-container>
    <v-layout>
      <v-flex v-if="person" xs12 sm6 offset-sm3>
        <h2>Добавить <strong>{{$route.params.reltype | translate('v')}}</strong></h2>
        <h3> для: {{person.surname}} {{person.name}} {{person.midname}}</h3>
        <br/>
        <form @submit.prevent="addPerson">
          <v-text-field
							id="name" name="name" label="Имя" type="text"
							v-model="personData.name" required :rules="[rules.required]">
          </v-text-field>
          <v-text-field
							id="surname" name="surname" label="Фамилия"
							type="text" v-model="personData.surname">
          </v-text-field>
          <v-text-field
							id="midname" name="midname" label="Отчество"
							type="text" v-model="personData.midname">
          </v-text-field>
          <v-text-field v-if="personData.gender === 0"
							id="maidenName" name="maidenName" label="Девичья фамилия"
							type="text" v-model="personData.maidenName">
          </v-text-field>
          <!-- <input type="text" size="40" name="name" placeholder="Имя" v-model="personData.name"> -->
          <v-select
            v-bind:items="rods"
            v-model="personData.rod"
            label="Род"
            autocomplete
            item-text="name"
            item-value="_id"
            auto chips clearable
          ></v-select>
          <!-- <p v-if="rods">
            <label for="rod-selector">Род</label>
            <select v-model="personData.rod" id="rod-selector">
              <option value="" selected></option>
              <option v-for="rod in rods" :value="rod._id">{{rod.name}}</option>
            </select>
          </p> -->
          <v-text-field multi-line
              id="about" name="about" label="Краткая информация"
              type="text" v-model="personData.about">
          </v-text-field>
          <!-- <textarea name="lifestory" placeholder="Биография" cols="40" rows="5" v-model="personData.lifestory"></textarea> -->
          <v-btn type="submit" class="primary"
					       :disabled="loading" :loading="loading"
          >
						Добавить {{$route.params.reltype | translate('v')}}
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
import axiosErrorHandler from '@/utils/axios-error-handler'
import {translate} from '@/filters'

export default {
  name: 'addPerson',
  data () {
    return {
      personData: {
        gender: ['mother', 'daughter'].includes(this.$route.params.reltype)  ? 0 : 1 // остальные свойства
      }
    }
  },
  computed: {
    person () {return this.$store.state.person},
    loading () {return this.$store.state.loading},
    rods () {return this.$store.state.rods},
    rules () {return this.$store.state.rules}
  },
  methods: {
    addPerson () {
      // let rodName = this.personData.rod
      // let rod = this.$store.state.rods.find(rod => {
      //   return rod.name === rodName
      // });
      // if (rod) {
      //   this.personData.rod = rod._id
      // }
      axiosInst.post(`/api/person/${this.person._key}/add/${this.$route.params.reltype}`, {
        personData: this.personData
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
