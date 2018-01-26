<template>
  <!-- hide-overlay -->
  <v-navigation-drawer
    app
    right
    fixed
    clipped
    v-model="rightDrawer"
    :disable-route-watcher="$vuetify.breakpoint.smAndUp"
  >
    <v-layout column v-if="person" class="pa-2">
      <v-flex class="text-xs-center">
        <img v-if="person.image"
          width="200px"
          :src="'/static/upload/' + person._key + '/' + person.image" alt="image" class="mb-2"
        />
      </v-flex>
      <v-flex class="mb-2">
        <div><strong>{{person.surname}} {{person.name}} {{person.midname}}</strong></div>
        <div v-if="person.gender === 0">Дев. фамилия: {{person.maidenName}}</div>
        <div v-if="person.birthYear">{{person.birthYear}} г.р.</div>
      </v-flex>
      <v-flex class="mb-2">
        id: {{person._key}}
      </v-flex>
      <v-flex v-if="person.rod" class="mb-2">
          Род: <v-btn small round :to="`/rod/${person.rod._key}`">{{person.rod.name}}</v-btn>
      </v-flex>

        <!-- <p>
          пол: {{person.gender | gender}}
        </p> -->

      <v-flex class="mb-2">
        {{person.about}}
      </v-flex>
      <!-- <p>{{person.lifestory}}</p> -->
      <v-flex class="mt-2 mb-2">
        Добавил:
        <v-btn round color="accent" small :to="`/person/${person.addedBy._key}`">
          {{person.addedBy.name}}
          {{person.addedBy.surname}}
        </v-btn>
      </v-flex>
      <v-flex v-if="person.editable"> <!-- todo: проработать права на добавление -->
        Добавить: <br />
        <v-btn small color="accent" :to="`/person/${person._key}/add/father`">отца</v-btn>
        <v-btn small color="accent" :to="`/person/${person._key}/add/mother`">мать</v-btn>
        <v-btn small color="accent" :to="`/person/${person._key}/add/son`">сына</v-btn>
        <v-btn small color="accent" :to="`/person/${person._key}/add/daughter`">дочь</v-btn>
      </v-flex>
      <br>
      <v-flex v-if="!person.disableRelPropose"> <!-- todo: проработать права на указание -->
        <v-btn small :to="`/person/${person._key}/set_relation`">Указать родителя или ребенка</v-btn>
      </v-flex>
      <br>
      <v-flex v-if="person.editable">
        <v-btn small color="warning" @click.prevent="removePerson">Удалить</v-btn>
        <v-btn small :to="`/person/${person._key}/update`">Изменить</v-btn>
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
import {gender} from '@/filters'
import axiosInst from '@/utils/axios-instance'

export default {
  name: 'RightDrawer',
  computed: {
    rightDrawer: {
      get () {return this.$store.state.rightDrawer},
      set (newval) {this.$store.state.rightDrawer = newval} // instead of: this.$store.commit('setRightDrawer', newval)
    },
    user () {return this.$store.state.user},
    person () {return this.$store.state.person},
	  editRights: function() {
      // todo: проверка прав на редактирование персоны
      return true
	  }
  },
  methods: {
    removePerson () {
      if (confirm(`Подтвердить удаление: ${this.person.name}?`)) { // todo: сделать красиво
        axiosInst.delete(`/api/person/${this.person._key}`)
        .then((resp) => {
          this.$store.commit('setPerson', null)
          this.$router.push(`/person/${this.user._key}`)
        }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
      }
	  }
  },
  filters: {
		gender
	}
}
</script>
