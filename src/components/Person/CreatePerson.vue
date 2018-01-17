<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <h2>Создать персону</h2>
        <br/>
        <form @submit.prevent="createPerson">
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

          <!-- <p>пол:
    				<label for="radio_man">муж</label> <input type="radio" id="radio_man" v-model="personData.gender" value="1"/>
    			  <label for="radio_woman">жен</label> <input type="radio" id="radio_woman" v-model="personData.gender" value="0"/>
    		  </p> -->
          <v-radio-group v-model="personData.gender">
            <v-radio label="Мужчина" :value="1"></v-radio>
            <v-radio label="Женщина" :value="0"></v-radio>
          </v-radio-group>

          <v-text-field v-if="personData.gender === 0"
							id="maidenName" name="maidenName" label="Девичья фамилия"
							type="text" v-model="personData.maidenName">
          </v-text-field>

          <v-select
            v-bind:items="rods"
            v-model="personData.rod"
            label="Род"
            autocomplete
            item-text="name"
            item-value="_id"
            auto chips clearable
          ></v-select>

          <v-text-field multi-line
            id="about" name="about" label="Краткая информация"
            type="text" v-model="personData.about">
          </v-text-field>
          <!-- <p>
    			  <label for="is-user">Пользователь?</label>
    			  <input type="checkbox" id="is-user" v-model="isUser"/>
    		  </p> -->
          <v-switch label="Пользователь" v-model="isUser"></v-switch>
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
    			  <!-- <p><input type="text" size="40" name="email" placeholder="E-mail" v-model="userData.email"></p>
    			  <p><input type="password" size="40" name="password" placeholder="пароль" v-model="userData.password"></p> -->
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
      personData: {
        gender: 1
      },
	    isUser: false,
	    userData: {}
    }
  },
  computed: {
    loading () {return this.$store.state.loading},
    rods () {return this.$store.state.rods},
    rules () {return this.$store.state.rules}
  },
  methods: {
    createPerson: function () {
      axiosInst.post(`/api/person/create`, {
        personData: this.personData,
        isUser: this.isUser,
        userData: this.userData
      })
	      .then(resp => {
	        this.$router.push('/person/' + resp.data.newPersonKey)
	      })
	      .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
		}
  }
}
</script>
