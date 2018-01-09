import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import jwtDecode from 'jwt-decode'
import axiosInst from '@/utils/axios-instance';
import axiosErrorHandler from '@/utils/axios-error-handler';

Vue.use(Vuex)

export const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  state: {
    user: null,
    loading: false,
    error: null,
    rightDrawer: false
  },
  getters: {    
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    // setUser (state, payload=undefined) {
    //   if (payload === null) state.user = null // unset user

    // },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setRightDrawer (state, payload) {
      state.rightDrawer = payload
    }
  },
  actions: {
    axiosErrorHandle({commit, dispatch}, error) {
      commit('setLoading', false) // остановить крутилку
      if (error.response) {
        // The request was made, but the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data.location) {
          this.$router.push(error.response.data.location) // todo: ??? доделать редирект с сервера
        } else if (error.response.status === 401) { // ie. invalid jwt token
          commit('setError', {message: 'Ошибка аутентификации'})
          // console.error(error.response.data.message);
          // dispatch('logout');
        } else {
          console.error('data: ', error.response.data);
          // console.log('headers: ', error.response.headers);
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Something happened in setting up the request: ' + error);
      }
    },
    signUserIn ({commit, dispatch}, payload) {
      axiosInst.post('/api/user/signin', {email: payload.email, password: payload.password})
        .then(resp => {
          commit('setLoading', false)
          const authToken = resp.data.authToken;
          window.localStorage.setItem('authToken', authToken);
          commit('setUser', jwtDecode(authToken)); // user object
          router.push(resp.data.location);
        })
        .catch(error => {
          dispatch('axiosErrorHandle', error)
          // const handle = axiosErrorHandler.bind(this)
          // handle(error)
        })
    },
    autoSingIn ({commit}) {
      const authToken = window.localStorage.getItem('authToken')
      if (authToken) {
        commit('setUser', jwtDecode(authToken)) // todo: разлогинивание конкретного юзера с сервера
      } else {
        router.push('/signin')
      }
    },
    logout ({commit}) {
      commit('setUser', null)
      window.localStorage.removeItem('authToken')
      router.push('/signin')
    }
  }
})
