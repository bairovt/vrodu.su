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
        <img v-if="person.pic"
          width="200px"
          :src="'/static/upload/' + person._key + '/' + person.pic" alt="pic" class="mb-2"
        />
        <div v-else-if="person.editable">
          <v-btn @click.stop="openCroppaDialog">Загрузить фото</v-btn>
        </div>
      </v-flex>
      <v-flex class="mb-2">
        <div>
          <router-link :to="`/profile/${person._key}`" class="name-profile-link">
            <strong>{{person.surname}} {{person.name}} {{person.midname}}</strong>
          </router-link>
        </div>
        <div>
          <span v-if="person.born">{{person.born}}</span>
          <span v-if="person.died">- {{person.died}}</span>
        </div>
      </v-flex>
      <v-flex class="mb-2">
        ключ: {{person._key}}
      </v-flex>
      <v-flex class="mb-2" v-if="person.maidenName">
        <div >дев. фамилия: {{person.maidenName}}</div>
      </v-flex>
      <v-flex v-if="person.rod" class="mb-2">
          Род: <v-btn small round :to="`/rod/${person.rod.split('/')[1]}`">{{person.rod | rodName}}</v-btn>
      </v-flex>

      <v-flex class="mb-2">
        {{person.info}}
      </v-flex>

      <!-- <p>{{person.lifestory}}</p> -->
      <v-flex class="mt-2 mb-2">
        <span>Добавил(а):</span>
        <v-btn round small :to="`/tree/${person.addedBy._key}`">
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
        <!-- todo refactor ? to the dialog box -->
        <v-btn small color="warning" :to="`/person/${person._key}/set_relation`">Соединить</v-btn>
      </v-flex>
      <br>
    </v-layout>

    <v-dialog v-model="croppaDialog" max-width="350px">
        <v-card>
          <!-- <v-card-title>
            Загрузить фото
          </v-card-title> -->
          <v-card-text>
            <croppa v-model="myCroppa"
                    :width="250"
                    :height="250"
                    placeholder="Выбрать фото"
                    :zoom-speed="10"
                    accept="image/*"
                    :file-size-limit="0"
                    :prevent-white-space="true"
                    remove-button-color="grey"
                    :remove-button-size="25"
                    :quality="2"
                    :show-loading="true"
            ></croppa>
            <br />
            выберите область фото
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click.stop="uploadCroppedImage">Загрузить</v-btn>
            <v-btn flat @click.stop="croppaDialog=false">Отмена</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
import axiosInst from '@/utils/axios-instance'
import 'vue-croppa/dist/vue-croppa.css'

export default {
  name: 'RightDrawer',
  data () {
    return {
      croppaDialog: false,
      myCroppa: {}
    }
  },
  computed: {
    rightDrawer: {
      get () {return this.$store.state.rightDrawer},
      set (newval) {this.$store.state.rightDrawer = newval} // instead of: this.$store.commit('setRightDrawer', newval)
    },
    user () {return this.$store.state.user},
    person () {return this.$store.state.person}
  },
  methods: {
    openCroppaDialog () {
      this.myCroppa.chooseFile()
      this.croppaDialog = true
    },
    uploadCroppedImage() {
      var formData = new FormData();
      this.myCroppa.generateBlob((blob) => {
        // console.log(blob)
        formData.append("pic", blob);
        axiosInst.post("/api/upload/pic/" + this.person._key, formData)
        .then(resp => {
          console.log("response: " + resp.data.pic)
          this.$store.commit('setPersonPic', resp.data.pic)
          this.croppaDialog = false
        })
        .catch(error => {this.$store.dispatch('axiosErrorHandle', error)})
        // write code to upload the cropped image file (a file is a blob)
      }, 'image/jpeg', 0.8) // 0.8 - 80% compressed jpeg file
    }
  }
}
</script>

<style>
.name-profile-link {
  text-decoration: none;
}
</style>
