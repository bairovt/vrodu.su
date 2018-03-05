<template>
  <v-container fluid class="pa-0">
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular v-if="loading" indeterminate :size="32" color="primary"></v-progress-circular>
      </v-flex>
      <v-flex class="xs12">
        <div id="rod_tree"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// todo: wrong person key -> 404 message
import axiosInst from '@/utils/axios-instance'
import {predokRelation, potomokRelation, surName} from '@/filters'
import router from '@/router'

// provide the data in the vis format
const menColor = '#2b7ce9'
const womenColor = '#aa00ff'
let visOptions = {
  locale: 'ru',
  layout: {
    // improvedLayout: false,
    hierarchical: {
      // enabled: false, // def true if any attribute enable
      // levelSeparation: 200, // def 150
      sortMethod: "directed", //"hubsize"
      // parentCentralization: false, // def true
      // edgeMinimization: false, // def true
      // blockShifting: false, // def true
      // nodeSpacing: 200 // def 100
    }
  },
  physics: {
    // enabled: false, // def true. Быстрый рендеринг если false
  },
  nodes: {
    shape: 'icon',
    brokenImage: '/static/upload/image.jpeg',
    font: {
      strokeWidth: 7
    },
    borderWidth: 0
    // borderWidthSelected: 5
  },
  edges: {
    smooth: true,
    arrows: {to : true }
  },
  groups: {
    0: { //women
      icon: {face: 'FontAwesome', code: '\uf007', size: 50, color: womenColor},
      color: {border: womenColor}  // arrow color
    },
	  1: { //men
      // shape: 'icon',
      icon: {face: 'FontAwesome', code: '\uf007', size: 50, color: menColor}
	  }
  },
	interaction: {
    hover:true,
    keyboard: {
      enabled: false, // если включено появляется голубая рамка
      bindToWindow: false // если true не работают кнопки - = х ъ
    },
    tooltipDelay: 100 // 300 ms default
  }
};

let network;
// let temp = 'temp'

export default {
  name: 'person',
  data () {
    return {
      predki: null,
      potomki: null,
      visContainer: '',  //document.getElementById('rod_tree'),
    }
  },
  computed: {
    person () {return this.$store.state.person},
    loading () {return this.$store.state.loading},
    visData: function(){
      const treeData = {nodes: [], edges: []};
      if (this.person === null || this.predki === null || this.potomki === null) return treeData;

      // nodesIds, edgesIds - массивы для проверки уникальности nodes и edges в treeData.
      // Для избежания ошибок дублирования vis в случае откл. uniqueVertices: "global" на сервере
      // когда идет кровосмешение
      // Error: Cannot add item: item with id Persons/50799218 already exists
      // Error: Cannot add item: item with id child/50799770 already exists
      const nodesIds = [] // для сбора id, для исключения повторов
      const edgesIds = [] // для сбора id, для исключения повторов

      treeData.nodes.push({
	      id: this.person._id,
	      label: surName(this.person),
	      title: surName(this.person),
	      shape: this.person.pic ? 'circularImage' : 'icon',
	      image: this.person.pic ? '/static/upload/' + this.person._key + '/' + this.person.pic : undefined,
        icon: {face: 'FontAwesome', code: '\uf2be', size: 50, color: this.person.gender == 0 ? womenColor : menColor},
        color: {border: this.person.gender == 0 ? womenColor : menColor},  // arrows color
        borderWidth: 5,
        // group: this.person.gender, // bug: why group settings are prior over the node's?
      });
      nodesIds.push(this.person._id)

      this.predki.map(item => {
        if (nodesIds.indexOf(item.person._id) === -1) { // добавляем без повторов
          treeData.nodes.push({
  	        id: item.person._id,
            label: surName(item.person),
            title: surName(item.person) + ', ' + predokRelation(item),
            shape: item.person.pic ? 'circularImage' : 'icon',
            image: item.person.pic ? '/static/upload/' + item.person._key + '/' + item.person.pic : undefined,
  	        group: item.person.gender
          });
          nodesIds.push(item.person._id)
        }
        if (edgesIds.indexOf(item.edge._id) === -1) { // добавляем без повторов
          treeData.edges.push({
            id: item.edge._id,
            from: item.edge._from, to: item.edge._to,
            addedBy: item.edge.addedBy,
            adopted: item.edge.adopted,
            color: {  // adopted arrow color
              color: item.edge.adopted == 1 ? '#18bc9c' : undefined,
              highlight: item.edge.adopted == 1 ? '#18bc9c' : undefined,
              hover: item.edge.adopted == 1 ? '#18bc9c' : undefined
            },
          });
          edgesIds.push(item.edge._id)
        }
      });

      this.potomki.map(item => {
        if (nodesIds.indexOf(item.person._id) === -1) { // добавляем в treeData.nodes если person._id еще не добавлен
          treeData.nodes.push({
  	        id: item.person._id,
            label: surName(item.person),
            title: surName(item.person) + ', ' + potomokRelation(item),
            shape: item.person.pic ? 'circularImage' : 'icon',
            image: item.person.pic ? '/static/upload/' + item.person._key + '/' +item.person.pic : undefined,
            group: item.person.gender
          });
          nodesIds.push(item.person._id)
        }
        if (edgesIds.indexOf(item.edge._id) === -1) { // добавляем без повторов
          treeData.edges.push({
            id: item.edge._id,
            from: item.edge._from, to: item.edge._to,
            addedBy: item.edge.addedBy,
            adopted: item.edge.adopted,
            color: { // adopted arrow color
              color: item.edge.adopted == 1 ? '#18bc9c' : undefined,
              highlight: item.edge.adopted == 1 ? '#18bc9c' : undefined,
              hover: item.edge.adopted == 1 ? '#18bc9c' : undefined
            }
          });
          edgesIds.push(item.edge._id)
        }
      });
      return treeData;
    }
  },
  watch: {
    '$route': 'loadData',
	  'visData': 'renderTree'
  },
  methods: {
    loadData () {
      this.$store.commit('setLoading', true)
      axiosInst.get(`/api/person/${this.$route.params.key}/predki-potomki`)
      .then(resp => {
          this.$store.commit('setPerson', resp.data.person)
          this.predki = resp.data.predki;
          this.potomki = resp.data.potomki;
          this.$store.commit('setLoading', false)
      }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)});
		},
	  renderTree () { // initialize vis network!
      let start = Date.now()
      network = new vis.Network(document.getElementById('rod_tree'), this.visData, visOptions);
      network.on("selectNode", function (props) {
        let nodeId = props.nodes[0] // edge's _from, _to in form of 'Persons/BairovTumenG'
        let person_key = nodeId.split('/')[1];  // node.id -> person._key (Persons/BairovTumenG -> BairovTumenG);
        router.push('/person/' + person_key)    // id: Persons/BairovTumenG
      });
      network.on("selectEdge", function (props) {
        let edgeId = props.edges[0]
	      // console.log(network.body.data.edges._data[edgeId])
      });
      network.once("afterDrawing", function () {
        console.log('render time: ' + (Date.now() - start)) // log render time
      })
	  },
  },
  created () {
    this.loadData()
  },
	filters: {
    predokRelation,
    potomokRelation
	}
}
</script>

<style scoped>
	#rod_tree {
		height: 800px;
		/*border: 1px solid lightgray;*/
	}
  .progress-circular {
    margin: 1rem
  }
</style>
