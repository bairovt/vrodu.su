<template>
	<v-container>
		<v-layout row v-if="error">
			<v-flex xs12 sm6 offset-sm3>
				<app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
			</v-flex>
		</v-layout>

		<v-layout row>
			<v-flex xs12 sm6 offset-sm3>
				<h1 class="mb-4">Авторизация</h1>
				<form @submit.prevent="onSignin">
					<v-text-field
							name="email"
							label="e-mail"
							id="email"
							type="email"
							v-model="email"
							required>
					</v-text-field>
					<v-text-field
							name="password"
							label="пароль"
							id="password"
							type="password"
							v-model="password"
							required>
					</v-text-field>
					<v-btn type="submit"
					       class="primary"
					       :disabled="loading"
					       :loading="loading"
					>
						Войти
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
  export default {
    data () {
      return {
        email: '',
        password: ''
      }
    },
    computed: {
      error () {return this.$store.state.error},
	    loading () {return this.$store.state.loading},
			// formIsValid () {
      //   return this.email && this.password
      // },
    },
    methods: {
      onSignin () {
        this.$store.commit('setLoading', true)
        this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
      },
      onDismissed () {
        this.$store.commit('clearError')
      }
    }
  }
</script>
