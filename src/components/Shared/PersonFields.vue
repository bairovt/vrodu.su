<template>
  <div>
    <p>Ө ө Ү ү Һ һ</p>
    <v-text-field
        name="name" label="Имя" type="text"
        v-model="person.name" required :rules="[rules.required]">
    </v-text-field>

    <v-text-field
        name="surname" label="Фамилия"
        type="text" v-model="person.surname">
    </v-text-field>

    <v-text-field
        name="midname" label="Отчество"
        type="text" v-model="person.midname">
    </v-text-field>

    <v-text-field v-if="person.gender === 0"
        name="maidenName" label="Девичья фамилия"
        type="text" v-model="person.maidenName">
    </v-text-field>

    <v-select
      v-bind:items="rods"
      v-model="person.rod"
      label="Род"
      autocomplete
      item-text="name"
      item-value="_id"
      auto chips clearable
    ></v-select>

    <v-btn small @click.prevent="lifetime = !lifetime">Годы жизни</v-btn>
    <v-container class="pa-0" v-if="lifetime">
      <v-layout>
        <v-flex xs5 sm3>
          <v-text-field label="год рожд-я" v-model="person.born" mask="####"></v-text-field>
        </v-flex>
        <v-flex xs1 sm2>
        </v-flex>
        <v-flex xs5 sm3>
          <v-text-field label="год смерти" v-model="person.died" mask="####"></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>

    <v-text-field multi-line
      id="info" name="info" label="Информация"
      type="text" v-model="person.info">
    </v-text-field>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        lifetime: false
      }
    },
    props: ['person'],
    computed: {
      rods () {return this.$store.state.rods},
      rules () {return this.$store.state.rules}
    }
  }
</script>
