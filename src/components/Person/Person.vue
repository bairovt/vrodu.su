<template>
  <v-container fluid>
    <v-layout>
      <v-flex class="xs12">
        <div id="rod_tree"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// todo: wrong person key -> 404 message
import axiosInst from '@/utils/axios-instance'
import {ancestorRelation, descendantRelation} from '@/filters'
import router from '@/router'

// provide the data in the vis format
let visOptions = {
  // locale: 'ru'
  layout: {
    hierarchical: {
      sortMethod: "directed"
    }
  },
  nodes: {
    shape: 'icon',
    brokenImage: '/static/upload/image.jpeg',
    font: {
      strokeWidth: 7
    }
  },
  edges: {
    smooth: true,
    arrows: {to : true }
  },
  groups: {
    0: {                      //women
      icon: {face: 'FontAwesome', code: '\uf007', size: 50, color: '#aa00ff'},
      color: {border: '#aa00ff'}  // arrow color
    },
	  1: {                      //men
      // shape: 'icon',
      icon: {face: 'FontAwesome', code: '\uf007', size: 50, color: '#2b7ce9'}
	  }
  },
	interaction:{hover:true}
};

export default {
  name: 'person',
  data () {
    return {
      ancestors: null,
      descendants: null,
      visContainer: '',  //document.getElementById('rod_tree'),
    }
  },
  computed: {
    person () {
      return this.$store.state.person
    },
    visData: function(){
      const treeData = {nodes: [], edges: []};
			if(this.person === null || this.ancestors === null || this.descendants === null) return treeData;

      treeData.nodes.push({
	      id: this.person._id,
	      label: this.person.surname + ' ' + this.person.name,
	      title: this.person.surname + ' ' + this.person.name,
	      shape: this.person.image ? 'circularImage' : 'icon',
	      image: this.person.image ? '/static/upload/' + this.person._key + '/' + this.person.image : undefined,
	      icon: {face: 'FontAwesome', code: '\uf2be', size: 50}, //color: '#18BC9C'
        borderWidth: 4,
        group: this.person.gender
      });

      this.ancestors.map(item => {
        treeData.nodes.push({
	        id: item.person._id, label: item.person.surname + ' ' + item.person.name,
          title: item.person.surname + ' ' + item.person.name + ', ' + ancestorRelation(item),
          shape: item.person.image ? 'circularImage' : 'icon',
          image: item.person.image ? '/static/upload/' + item.person._key + '/' + item.person.image : undefined,
	        group: item.person.gender
        });
        treeData.edges.push({from: item.edge._from, to: item.edge._to});
      });
      this.descendants.map(item => {
        treeData.nodes.push({
	        id: item.person._id, label: `${item.person.surname} ${item.person.name}`,
          title: item.person.surname + ' ' + item.person.name + ', ' + descendantRelation(item),
          shape: item.person.image ? 'circularImage' : 'icon',
          image: item.person.image ? '/static/upload/' + item.person._key + '/' +item.person.image : undefined,
          group: item.person.gender
        });
        treeData.edges.push({from: item.edge._from, to: item.edge._to});
      });
      return treeData;
    }
  },
  watch: {
    '$route': 'fetchData',
	  'visData': 'renderTree'
  },
  methods: {
    fetchData () {
      axiosInst.get(`/api/person/${this.$route.params.key}/get-anc-des`)
      .then(resp => {
          this.$store.commit('setPerson', resp.data.person)
          this.ancestors = resp.data.ancestors;
          this.descendants = resp.data.descendants;
      }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)});
		},
	  renderTree () { // initialize vis network!
      let network = new vis.Network(document.getElementById('rod_tree'), this.visData, visOptions);
      network.on("click", function (params) {
        let person_key = params.nodes[0].split('/')[1]; // node.id -> person._key (Persons/BairovTumenG -> BairovTumenG); edge's _from, _to in form of 'Persons/BairovTumenG'
        let edgeId = params.edges[0];
	      if (person_key) {       // node clicked
          router.push('/person/' + person_key) // id: Persons/BairovTumenG
	      } else if (edgeId) { // edge clicked
		      console.log(params)
	      }
      });
	  },
	  removePerson () {
      axiosInst.get(`/api/person/${this.person._key}/remove`)
      .then((resp) => {
        this.$router.push('/person/all')
      }).catch(error => {this.$store.dispatch('axiosErrorHandle', error)});
	  }
  },
  created () {
    this.fetchData()
  },
	filters: {
    ancestorRelation,
    descendantRelation
	}
}
</script>

<style scoped>
	#rod_tree {
		height: 800px;
		/*border: 1px solid lightgray;*/
	}
</style>
