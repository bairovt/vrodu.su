import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import jwtDecode from 'jwt-decode'
import axiosInst from '@/utils/axios-instance';
import axiosErrorHandler from '@/utils/axios-error-handler';
import rods from '@/data/rods';

Vue.use(Vuex)

export const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  state: {
    user: null,
    person: null,
    rods: rods,
    loading: false,
    error: null,
    rightDrawer: false,
    rules: {
      required: (v) => !!v || 'Обязательное поле'
    }
  },
  getters: {},
  mutations: {
    setUser (state, payload) {
      state.user = payload
      if (!payload) return // user set to null
      state.user.hasRoles = function (roles) {
        if (!state.user.roles) return false;
        if (state.user.roles.includes('admin')) return true;
        let allowed = false;
        roles.forEach(role => {
          if (state.user.roles.includes(role)) allowed = true
        })
        return allowed
      }
    },
    setPerson (state, payload) {state.person = payload},
    setPersonPic (state, payload) {state.person.pic = payload},
    setLoading (state, payload) {state.loading = payload},
    setError (state, payload) {state.error = payload},
    clearError (state) {state.error = null},
    setRightDrawer (state, payload) {state.rightDrawer = payload},
    setRods (state, payload) {state.rods = payload}
  },
  actions: {
    axiosErrorHandle({commit, dispatch}, error) {
      commit('setLoading', false) // остановить крутилку
      if (error.response) {
        // The request was made, but the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data.location) {
          router.push(error.response.data.location) // todo: ??? доделать редирект с сервера
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

    autoSingIn ({commit, dispatch}) {
      const authToken = window.localStorage.getItem('authToken')
      if (authToken) {
        commit('setUser', jwtDecode(authToken)); // todo: разлогинивание конкретного юзера с сервера
      } else {
        router.push('/signin')
      }
    },
    logout ({commit}) {
      commit('setUser', null)
      window.localStorage.removeItem('authToken')
      router.push('/signin')
    },
    loadAllRods ({commit, dispatch}) {
      axiosInst.get('/api/rod/all') // загрузка всех родов при создании App
        .then(resp => {
          commit('setRods', resp.data.rods);
        })
        .catch(error => {dispatch('axiosErrorHandle', error)});
    }
  }
})
