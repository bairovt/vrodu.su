<template>
  <v-container>
    <v-layout row wrap v-if="person">
      <v-flex xs12 class="mb-3">
        <h3>Профиль</h3>
        <h2><strong>{{person.surname}} {{person.name}} {{person.midname}}</strong></h2>
      </v-flex>

      <v-flex v-if="person.maidenName">
        <div >дев. фамилия: {{person.maidenName}}</div>
      </v-flex>

      <v-flex xs12 sm3 class="text-xs-center">
        <img v-if="person.pic"
          width="250px"
          :src="'/static/upload/' + person._key + '/' + person.pic" alt="pic" class="mb-2"
        />
        <div v-else-if="person.editable">
          <v-btn @click.stop="openCroppaDialog">Загрузить фото</v-btn>
        </div>
        <div>
          ключ: {{person._key}}
        </div>
        <div v-if="person.rod">
          Род: <v-btn small round :to="`/rod/${person.rod._key}`">{{person.rod.name}}</v-btn>
        </div>
        <div class="pt-2 pb-2">
          <span>Добавил(а):</span>
          <v-btn round color="accent" small :to="`/tree/${person.addedBy._key}`">
            {{person.addedBy.name}}
            {{person.addedBy.surname}}
          </v-btn>
        </div>
        <div v-if="person.editable"> <!-- todo: проработать права на добавление -->
          Добавить: <br />
          <v-btn small color="accent" :to="`/person/${person._key}/add/father`">отца</v-btn>
          <v-btn small color="accent" :to="`/person/${person._key}/add/mother`">мать</v-btn>
          <v-btn small color="accent" :to="`/person/${person._key}/add/son`">сына</v-btn>
          <v-btn small color="accent" :to="`/person/${person._key}/add/daughter`">дочь</v-btn>
        </div>
        <br />
        <div v-if="!person.disableRelPropose">
          <!-- todo: проработать права на указание -->
          <!-- todo refactor ? to the dialog box -->
          <v-btn small color="warning" :to="`/person/${person._key}/set_relation`">Соединить</v-btn>
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
  </v-container>
</template>

<script>
import {gender} from '@/filters'
import axiosInst from '@/utils/axios-instance'

export default {
  name: 'Profile',
  computed: {
    user () {return this.$store.state.user},
    person () {return this.$store.state.person}
  },
  methods: {
    deletePerson () {
      if (confirm(`Подтвердить удаление: ${this.person.name}?`)) { // todo: сделать красиво
        axiosInst.delete(`/api/person/${this.person._key}`)
        .then((resp) => {
          this.$store.commit('setPerson', null)
          // this.$router.push(`/person/${this.user._key}`)
          this.$router.push('/tree/' + resp.data.redirKey) // переход на единственного rel (либо на user)
        }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
      }
	  }
  },
  filters: {
		gender
	}
}
</script>
