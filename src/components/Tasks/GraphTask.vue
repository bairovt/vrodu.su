<template>
  <v-container fluid class="pa-0">
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular v-if="loading" indeterminate :size="32" color="primary"></v-progress-circular>
      </v-flex>
      <v-flex class="xs12">
        <div id="task_net"></div>
      </v-flex>
    </v-layout>

    <!-- set relation dialog -->

    <!--<v-dialog v-model="relateDialog" max-width="500px">-->
      <!--<relate-dialog v-if="personForRel" v-on:related="loadData">-->
      <!--</relate-dialog>-->
    <!--</v-dialog>-->

    <!-- when clicked on edge -->

    <v-dialog v-model="edgeDialog" persistent max-width="500px">
        <v-card v-if="edge">
          <v-card-title>
            {{edge.id}} added by {{edge.addedBy | keyFromId}}
          </v-card-title>
          <v-card-text class="pt-0 pb-0">
            Связь: {{edge.from | keyFromId}} -> {{edge.to | keyFromId}}
            <br>
            <br>
          </v-card-text>
          <v-card-actions>
            <v-btn @click.stop="deleteChildEdge" :loading="loading">
              удалить
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="primary" small flat
            @click.native.stop="closeEdgeDialog">
              Закрыть
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// todo: wrong person key -> 404 message
import axiosInst from '@/utils/axios-instance'
import {predokRelation, potomokRelation, surName, keyFromId} from '@/filters'
import router from '@/router'
import {visGraphTaskOptions, doneColor, notDoneColor} from '@/options/vis-opts'

let network;

export default {
  name: 'TasksGraph',
  data () {
    return {
      task: null,
      tasks: [],
      edgeDialog: false,
      edge: null
    }
  },
  computed: {
    // person () {return this.$store.state.person},
    loading () {return this.$store.state.loading},
    // relateDialog: {
    //   get () {return this.$store.state.relateDialog},
    //   set (newval) {this.$store.state.relateDialog = newval}
    // },

    visData: function() {
      const graphData = {nodes: [], edges: []};
      if (this.tasks.length === 0) {
        return graphData;
      }

      // nodesIds, edgesIds - массивы для проверки уникальности nodes и edges в treeData.
      // Для избежания ошибок дублирования vis в случае откл. uniqueVertices: "global" на сервере
      const nodesIds = []
      const edgesIds = []

      // if (this.showShortestTree) {
      //   this.person.shortest.map(item => {
      //     if (nodesIds.indexOf(item.person._id) === -1) { // добавляем без повторов
      //       treeData.nodes.push({
      //         id: item.person._id,
      //         label: surName(item.person),
      //         // title: surName(item.person) + ', ' + predokRelation(item),
      //         shape: item.person.pic ? 'circularImage' : 'icon',
      //         image: item.person.pic ? '/static/upload/' + item.person._key + '/' + item.person.pic : undefined,
      //         group: item.person.gender
      //       });
      //       nodesIds.push(item.person._id)
      //     }
      //     if (item.edge && (edgesIds.indexOf(item.edge._id) === -1)) { // добавляем без повторов
      //       treeData.edges.push({
      //         id: item.edge._id,
      //         from: item.edge._from,
      //         to: item.edge._to,
      //         addedBy: item.edge.addedBy,
      //         adopted: item.edge.adopted,
      //         color: {  // adopted arrow color
      //           color: item.edge.adopted ? '#18bc9c' : undefined,
      //           highlight: item.edge.adopted ? '#18bc9c' : undefined,
      //           hover: item.edge.adopted ? '#18bc9c' : undefined
      //         },
      //       });
      //       edgesIds.push(item.edge._id)
      //     }
      //   });
      //   return treeData;
      // }

      // graphData.nodes.push({
	    //   id: this.task._id,
	    //   label: this.task.name,
	    //   // title: surName(this.person),
	    //   shape: this.task.pic ? 'circularImage' : 'icon',
	    //   image: this.task.pic ? '/static/upload/' + this.task._key + '/' + this.task.pic : undefined,
      //   icon: {face: 'FontAwesome', code: '\uf2be', size: 50, color: this.task.done === 0 ? notDoneColor : doneColor},
      //   color: {border: this.task.gender === 0 ? notDoneColor : doneColor},  // arrows color
      //   borderWidth: 5,
      //   // group: this.person.gender, // bug: why group settings are prior over the node's?
      // });
      // nodesIds.push(this.task._id)

      this.tasks.map(item => {
        if (item.task && nodesIds.indexOf(item.task._id) === -1) { // добавляем без повторов
          graphData.nodes.push({
  	        id: item.task._id,
            label: item.task.name,
            // title: surName(item.person) + ', ' + predokRelation(item),
            // shape: item.task.pic ? 'circularImage' : 'icon',
            shape: 'icon',
            // image: item.task.pic ? '/static/upload/' + item.task._key + '/' + item.task.pic : undefined,
            icon: {face: 'FontAwesome', code: '\uf111', size: 30}
  	        // group: 1 //item.person.gender
          });
          nodesIds.push(item.task._id)
        }
        if (item.edge && edgesIds.indexOf(item.edge._id) === -1) { // добавляем без повторов
          graphData.edges.push({
            id: item.edge._id,
            from: item.edge._from,
            to: item.edge._to,
            addedBy: item.edge.addedBy,
            adopted: item.edge.adopted,
            color: {  // adopted arrow color
              color: item.edge.adopted ? '#18bc9c' : undefined,
              highlight: item.edge.adopted ? '#18bc9c' : undefined,
              hover: item.edge.adopted ? '#18bc9c' : undefined
            },
          });
          edgesIds.push(item.edge._id)
        }
      });

      return graphData;
    }
  },
  watch: {
    '$route': 'loadData',
	  'visData': 'renderTree'
  },
  methods: {
    loadData () {
      // this.showShortestTree = false;
      axiosInst.get(`/api/tasks/${this.$route.params.key}/graphtask`)
      .then(resp => {
        // this.$store.commit('setPerson', resp.data.person)
        this.tasks = resp.data.graphTask;
      }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)});
		},
	  renderTree () { // initialize vis network!
      // let start = Date.now()
      // отключение физики при большом количестве потомков для ускорения отрисовки
      if (this.tasks.length > 100) visGraphTaskOptions.physics.enabled = false
      else visGraphTaskOptions.physics.enabled = true
      const visData = this.visData;
      for (let i = 0; i < visData.nodes.length; i++) {
        visData.nodes[i].last = true;
        visData.nodes[i].top = true;
        for (let edge of visData.edges) {
          if (edge.from === visData.nodes[i].id) {
            visData.nodes[i].last = false;
          }
          if (edge.to === visData.nodes[i].id) {
            visData.nodes[i].top = false;
          }
        }
        if (visData.nodes[i].last) {
          visData.nodes[i].icon.code = '\uf170';
          visData.nodes[i].icon.color = '#aa00ff';
        }
        if (visData.nodes[i].top) {
          visData.nodes[i].icon.code = '\uf005';
          visData.nodes[i].icon.color = '#1B14FF';
        }
      }

      network = new vis.Network(document.getElementById('task_net'), visData, visGraphTaskOptions);
      network.on("selectNode", function (props) {
        let nodeId = props.nodes[0]
        let task_key = nodeId.split('/')[1];
        router.push('/tasks/' + task_key)
      });
      network.on("selectEdge", (props) => {
        let edgeId = props.edges[0]
	      this.edge = network.body.data.edges._data[edgeId]
        this.edgeDialog = true
      });
      // network.once("afterDrawing", function () {
      //   console.log('render time: ' + (Date.now() - start)) // log render time
      // })
	  },
  },
  created () {
    this.loadData()
  },
	filters: {
    keyFromId
	}
}
</script>

<style scoped>
	#task_net {
		height: 800px;
		border: 1px solid lightgray;
	}
  .progress-circular {
    margin: 1rem
  }
</style>
