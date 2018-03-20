<template>
  <v-container>
    <v-layout row wrap v-if="person">
      <v-flex xs12 class="mb-3">
        <h3>Профиль</h3>
        <h2><strong>{{person.surname}} {{person.name}} {{person.midname}}</strong></h2>
        <div v-if="person.maidenName">дев. фамилия: {{person.maidenName}}</div>
      </v-flex>

      <v-flex xs12 sm3 class="text-xs-center">
        <img v-if="person.pic"
          width="250px"
          :src="'/static/upload/' + person._key + '/' + person.pic" alt="pic" class="mb-2"
        />
        <div class="mb-2">
          ключ: {{person._key}}
        </div>
        <div class="mb-2">
          <v-btn round color="success" :to="`/tree/${person._key}`">ДРЕВО</v-btn>
        </div>
        <div v-if="person.rod">
          Род: <v-btn small round :to="`/rod/${person.rod._key}`">{{person.rod.name}}</v-btn>
        </div>
        <div class="pt-2 pb-2">
          <span>Добавил(а):</span>
          <v-btn round small :to="`/tree/${person.addedBy._key}`">
            {{person.addedBy.name}}
            {{person.addedBy.surname}}
          </v-btn>
        </div>
        <br />
        <div v-if="!person.disableRelPropose">
          <!-- todo: проработать права на указание -->
          <!-- todo refactor ? to the dialog box -->
          <v-btn small color="warning" :to="`/person/${person._key}/set_relation`">Соединить</v-btn>
        </div>
        <br />
        <div v-if="person.editable">
          <v-btn color="accent" class="white--text" small @click.stop="editDialog=true">Изменить</v-btn>
        </div>
        <br />
        <div v-if="person.editable">
          <v-btn small @click.prevent="deletePerson">Удалить</v-btn>
          <!-- <v-btn small :to="`/person/${person._key}/update`">Изменить</v-btn> -->
        </div>
      </v-flex>

      <v-flex xs12 sm9 class="mb-2">
        <div>
          <span v-if="person.born">{{person.born}}</span>
          <span v-if="person.died">- {{person.died}}</span>
        </div>
        <div>
          {{person.info}}
        </div>
      </v-flex>
    </v-layout>

    <v-dialog v-if="person" v-model="editDialog" max-width="600px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <v-card>
        <v-card-text>
          <person-fields :person="person" :info="true"></person-fields>
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="updatePerson" class="primary"
          :disabled="loading" :loading="loading">
            Сохранить
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </v-btn>
          <v-btn class="ml-3" @click.stop="editDialog=false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {gender} from '@/filters'
import axiosInst from '@/utils/axios-instance'

export default {
  data () {
    return {
      editDialog: false
    }
  },
  name: 'Profile',
  computed: {
    user () {return this.$store.state.user},
    person () {return this.$store.state.person},
    loading () {return this.$store.state.loading}
  },
  methods: {
    loadProfile () {
      this.$store.commit('setLoading', true)
      axiosInst.get(`/api/person/profile/${this.$route.params.key}`)
      .then(resp => {
          this.$store.commit('setPerson', resp.data.profile)
          this.$store.commit('setLoading', false)
      }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)});
		},
    deletePerson () {
      if (confirm(`Подтвердить удаление: ${this.person.name}?`)) { // todo: сделать красиво
        axiosInst.delete(`/api/person/${this.person._key}`)
        .then((resp) => {
          this.$store.commit('setPerson', null)
          // this.$router.push(`/person/${this.user._key}`)
          this.$router.push('/tree/' + resp.data.redirKey) // переход на единственного rel (либо на user)
        }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
      }
	  },
    updatePerson () {
      this.$store.commit('setLoading', true)
      axiosInst.post(`/api/person/update/${this.person._key}`, {
        person: this.person
      })
      .then((resp) => {
        this.$store.commit('setLoading', false)
        this.editDialog = false
      }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
    }
  },
  filters: {
		gender
	},
  created () {
    if (!this.person) this.loadProfile()
  }
}
</script>
