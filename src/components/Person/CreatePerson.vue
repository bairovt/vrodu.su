<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <h2>Создать персону</h2>
        <br/>
        <form @submit.prevent="createPerson">
          <v-text-field
  						name="_key" label="key (id)" type="text"
  						v-model="newPerson._key">
          </v-text-field>

          <v-radio-group v-model="newPerson.gender">
            <v-radio label="Мужчина" :value="1" color="primary"></v-radio>
            <v-radio label="Женщина" :value="0" color="primary"></v-radio>
          </v-radio-group>

          <person-fields :person="newPerson"></person-fields>

          <v-switch label="Пользователь" v-model="isUser" color="primary"></v-switch>
    		  <!-- optional user properties -->
    		  <template v-if="isUser">
            <v-text-field
							name="email"
							label="e-mail"
							type="email"
							v-model="userData.email"
							required>
  					</v-text-field>
  					<v-text-field
							name="password"
							label="пароль"
              v-model="userData.password"
							type="password"
							required>
  					</v-text-field>
    		  </template>

          <v-btn type="submit" class="primary"
					       :disabled="loading"
                 :loading="loading"
          >
						Создать персону
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

export default {
  name: 'createPerson',
  data () {
    return {
      newPerson: {
        gender: 1
      },
	    isUser: false,
	    userData: {}
    }
  },
  computed: {
    loading () {return this.$store.state.loading},
    // rules () {return this.$store.state.rules}
  },
  methods: {
    createPerson: function () {
      axiosInst.post(`/api/person/create`, {
        personData: this.newPerson,
        isUser: this.isUser,
        userData: this.userData
      }) // config
	      .then(resp => {
	        this.$router.push('/tree/' + resp.data.newPersonKey)
	      })
	      .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
		}
  }
}
</script>
