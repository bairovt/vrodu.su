<template>
  <!-- app  -->
  <v-navigation-drawer
    app
    right
    fixed
    clipped
    :value="rightDrawer"
    disable-route-watcher
    hide-overlay
  >
    <v-layout column v-if="person">
      <v-flex xs12 class="pt-2 pl-2">
        <!-- <br /><br /><br /> -->
        <img v-if="person.image"
          width="80%"
          :src="'/static/upload/' + person._key + '/' + person.image" alt="image" class="mb-2" />
        <h4><strong>{{person.surname}} {{person.name}} {{person.midname}}</strong></h4>
        <p>пол: {{person.gender | gender}}</p>
        <p>{{person.about}}</p>
        <p>{{person.lifestory}}</p>

        <p v-if="person.rod">Род: <router-link :to="`/rod/${person.rod._key}`">{{person.rod.name}}</router-link></p>

        <p>Год рождения: {{person.birthYear}}</p>
        <p v-if="person.addedBy">Добавил:
          <router-link :to="`/person/${person.addedBy._key}`">
            {{person.addedBy.name}}
            {{person.addedBy.surname}}
          </router-link>
        </p>
        <p v-if="person.gender === 0">Девичья фамилия: {{person.maidenName}}</p>
        <p>id: {{person._key}}</p>
        <br>
        <p> <!-- todo: проработать права на добавление -->
          Добавить
          <router-link :to="`/person/${person._key}/add/father`">отца</router-link> |
          <router-link :to="`/person/${person._key}/add/mother`">мать</router-link> |
          <router-link :to="`/person/${person._key}/add/son`">сына</router-link> |
          <router-link :to="`/person/${person._key}/add/daughter`">дочь</router-link>
        </p>
        <p> <!-- todo: проработать права на указание -->
          <router-link :to="`/person/${person._key}/set-relation`">Указать родителя или ребенка</router-link>
        </p>

        <br>
        <p>
          <button type="button" @click.prevent="removePerson">Удалить</button>
          <router-link v-if="editRights" :to="`/person/${person._key}/update`">Изменить</router-link>
        </p>
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
    rightDrawer () {
      return this.$store.state.rightDrawer;
    },
    person () {
      return this.$store.state.person;
    },
	  editRights: function() {
      // todo: проверка прав на редактирование персоны
      return true
	  }
  },
  methods: {
    removePerson () {
      axiosInst.get(`/api/person/${this.person._key}/remove`)
      .then((resp) => {
        this.$store.commit('setPerson', null)
        this.$router.push('/person/all')
      }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
	  }
  },
  filters: {
		gender
	}
}
</script>
