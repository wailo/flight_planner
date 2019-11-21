<template>
<body>
  <div id="Demo">
    <d3-network
      :net-nodes="nodes_processed"
      :net-links="links"
      :options="options"
      @node-click="changeIcon"
    ></d3-network>
    <ul class="ui">
      <li>
        <vs-switch v-on:click="update_links" color="success" v-model="auto_route">
          <span slot="on">Auto Update ON</span>
          <span slot="off">AUto Update OFF</span>
        </vs-switch>
      </li>
    </ul>
    <ul class="ui"></ul>
  </div>
</body>
</template>

<script>
const airportIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve">
<g>
	<g>
		<path d="M455.007,319.815h-29.387v-12.68c0-4.218-3.419-7.637-7.637-7.637H198.954v-8.726h18.727
			c7.58,0,13.747-6.167,13.747-13.747v-23.124h35.597c3.94,0,7.234-2.997,7.603-6.92l2.843-30.144
			c0.001-0.006,0.001-0.011,0.002-0.017l8.792-93.228c0.001-0.006,0.001-0.011,0.002-0.017l0.005-0.054
			c0.008-0.09,0.006-0.178,0.011-0.267c0.009-0.15,0.022-0.298,0.022-0.45V88.032c0-4.218-3.419-7.637-7.637-7.637h-84.743v-18.79
			c0-5.499-3.253-10.241-7.929-12.437V13.747c0-7.58-6.167-13.747-13.747-13.747h-8.719c-7.58,0-13.747,6.167-13.747,13.747v35.366
			c-4.738,2.172-8.043,6.948-8.043,12.492v18.79H56.994c-4.218,0-7.637,3.419-7.637,7.637v34.771c0,0.152,0.014,0.3,0.022,0.45
			c0.005,0.089,0.003,0.178,0.011,0.267l0.005,0.054c0.001,0.006,0.001,0.011,0.002,0.017l8.792,93.225
			c0.001,0.007,0.001,0.015,0.002,0.022l2.842,30.142c0.37,3.923,3.664,6.92,7.603,6.92h35.711v23.124
			c0,7.58,6.167,13.747,13.747,13.747h18.613v213.591c0,4.218,3.419,7.637,7.637,7.637h46.974h50.404h31.473h50.404h31.473h50.172
			h31.473c4.218,0,7.637-3.419,7.637-7.637V366.56h10.651c4.218,0,7.637-3.419,7.637-7.637V327.45
			C462.644,323.235,459.224,319.815,455.007,319.815z M410.345,314.772v5.043H198.954v-5.043H410.345z M262.923,208.413h-34.102
			v-77.972h41.455L262.923,208.413z M165.055,15.274h5.665v32.585h-5.665V15.274z M157.011,63.133h0.001h0.406h20.939h0.292v17.263
			h-21.638V63.133z M64.631,95.669H271.03v19.497H64.631V95.669z M213.547,130.44v77.972h-38.079V130.44H213.547z M160.193,130.44
			v77.972h-40.572V130.44H160.193z M65.385,130.44h38.962v77.972H72.738L65.385,130.44z M118.093,238.627H75.588l-1.409-14.941
			h187.303l-1.409,14.941H217.68H118.093z M183.68,307.135v20.318v31.473v56.982v22.452v58.367h-31.7V290.772h31.7V307.135z
			 M191.316,275.498h-46.974H119.62v-21.596h0.001h96.532v21.596H191.316z M234.084,496.726h-35.13v-50.73h35.13V496.726z
			 M234.084,430.722h-35.13v-7.178h35.13V430.722z M234.084,408.27h-35.13v-41.708h35.13V408.27z M265.557,415.907v22.452v58.367
			h-16.199v-58.367v-22.452v-49.345h16.199V415.907z M315.962,496.726h-35.13v-50.73h35.13V496.726z M315.962,430.722h-35.13v-7.178
			h35.13V430.722z M315.962,408.27h-35.13v-41.708h35.13V408.27z M347.435,415.907v22.452v58.367h-16.199v-58.367v-22.452v-49.345
			h16.199V415.907z M397.607,496.726h-34.898v-50.73h34.898V496.726z M397.608,430.722H362.71v-7.178h34.898V430.722z
			 M397.608,408.27H362.71v-41.708h34.898V408.27z M429.08,496.726h-16.199v-56.529c0.146-0.59,0.232-1.204,0.232-1.839v-22.452
			c0-0.635-0.086-1.248-0.232-1.839V366.56h16.199V496.726z M447.373,351.288h-0.003h-10.651h-31.473h-50.172h-31.473h-50.404
			h-31.473h-42.767v-16.199h219.028h29.387V351.288z"/></g></g></svg>`;

const fixIcon = `<svg class="svg-icon">
    <path d="M17.684,7.925l-5.131-0.67L10.329,2.57c-0.131-0.275-0.527-0.275-0.658,0L7.447,7.255l-5.131,0.67C2.014,7.964,1.892,8.333,2.113,8.54l3.76,3.568L4.924,17.21c-0.056,0.297,0.261,0.525,0.533,0.379L10,15.109l4.543,2.479c0.273,0.153,0.587-0.089,0.533-0.379l-0.949-5.103l3.76-3.568C18.108,8.333,17.986,7.964,17.684,7.925 M13.481,11.723c-0.089,0.083-0.129,0.205-0.105,0.324l0.848,4.547l-4.047-2.208c-0.055-0.03-0.116-0.045-0.176-0.045s-0.122,0.015-0.176,0.045l-4.047,2.208l0.847-4.547c0.023-0.119-0.016-0.241-0.105-0.324L3.162,8.54L7.74,7.941c0.124-0.016,0.229-0.093,0.282-0.203L10,3.568l1.978,4.17c0.053,0.11,0.158,0.187,0.282,0.203l4.578,0.598L13.481,11.723z"></path>
    </svg>`;

const vorIcon = `<svg class="svg-icon" >
    <path d="M15.684,16.959L10.879,8.52c0.886-0.343,1.517-1.193,1.517-2.186c0-1.296-1.076-2.323-2.396-2.323S7.604,5.037,7.604,6.333c0,0.993,0.63,1.843,1.517,2.186l-4.818,8.439c-0.189,0.311,0.038,0.708,0.412,0.708h10.558C15.645,17.667,15.871,17.27,15.684,16.959 M8.562,6.333c0-0.778,0.645-1.382,1.438-1.382s1.438,0.604,1.438,1.382c0,0.779-0.645,1.412-1.438,1.412S8.562,7.113,8.562,6.333 M5.55,16.726L10,8.91l4.435,7.815H5.55z M15.285,9.62c1.26-2.046,1.26-4.525,0-6.572c-0.138-0.223-0.064-0.512,0.162-0.646c0.227-0.134,0.521-0.063,0.658,0.16c1.443,2.346,1.443,5.2,0,7.546c-0.236,0.382-0.641,0.17-0.658,0.159C15.221,10.131,15.147,9.842,15.285,9.62 M13.395,8.008c0.475-1.063,0.475-2.286,0-3.349c-0.106-0.238,0.004-0.515,0.246-0.62c0.242-0.104,0.525,0.004,0.632,0.242c0.583,1.305,0.583,2.801,0,4.106c-0.214,0.479-0.747,0.192-0.632,0.242C13.398,8.523,13.288,8.247,13.395,8.008 M3.895,10.107c-1.444-2.346-1.444-5.2,0-7.546c0.137-0.223,0.431-0.294,0.658-0.16c0.226,0.135,0.299,0.424,0.162,0.646c-1.26,2.047-1.26,4.525,0,6.572c0.137,0.223,0.064,0.512-0.162,0.646C4.535,10.277,4.131,10.489,3.895,10.107 M5.728,8.387c-0.583-1.305-0.583-2.801,0-4.106c0.106-0.238,0.39-0.346,0.631-0.242c0.242,0.105,0.353,0.382,0.247,0.62c-0.475,1.063-0.475,2.286,0,3.349c0.106,0.238-0.004,0.515-0.247,0.62c-0.062,0.027-0.128,0.04-0.192,0.04C5.982,8.668,5.807,8.563,5.728,8.387"></path>
    </svg>`;

import D3Network from "vue-d3-network";
import nodes from "@/assets/waypoints.json"

const node_status = {
  ACTIVE: 0,
  DEFECT: 1,
  IDLE: 2,
  MAX: 3
};

export default {
  components: {
    D3Network
  },
  data: function() {
    return {
      auto_route: Boolean,
      nodes: nodes['nodes'],
      links: [
        { sid: 0, tid: 1 },
        { sid: 1, tid: 2 },
        { sid: 2, tid: 3 },
        { sid: 3, tid: 4 },
        { sid: 4, tid: 5 },
        { sid: 5, tid: 6 },
        { sid: 6, tid: 7 },
        { sid: 7, tid: 8 },
        { sid: 8, tid: 9 }
      ],
      options: {
        force: 1000,
        nodeSize: 20,
        nodeLabels: true,
        linkWidth: 1,
        canvas: false
      }
    };
  },
  methods: {
    update_node_css_class: function(node) {
      switch (node.status) {
        case node_status.ACTIVE:
          node._cssClass = "active_node";
          node._labelClass = "active_node_label";
          break;
        case node_status.IDLE:
          node._cssClass = "idle_node";
          node._labelClass = "idle_node_label";
          break;
        case node_status.DEFECT:
          node._cssClass = "defect_node";
          node._labelClass = "defect_node_label";
          break;
      }
    },
    changeIcon: function(event, node) {
      node.status = (node.status + 1) % node_status.MAX;
      this.update_node_css_class(node);
      this.$set(this.nodes, node.index, node);
      if (this.auto_route) {
        this.update_links(null);
      }
    },
    update_links: function(event) {
      var active_nodes = [];
      var links = [];
      var sid = null;
      for (var i in this.nodes) {
        var node = this.nodes[i];
        if (
          this.nodes[i].status === node_status.ACTIVE ||
          this.nodes[i].status === node_status.DEFECT
        ) {
          if (sid === null) {
            sid = node.id;
          } else {
            links.push({ sid: sid, tid: node.id });
            sid = node.id;
          }
        }
        this.links = links;
      }
    }
  },
  computed: {
    nodes_processed: function() {
      for (var index in this.nodes) {
        var node = this.nodes[index];

        if (!("status" in node)) {
          node.status = node_status.IDLE;
        }
        else if (node.status === "ACTIVE") {
          node.status = node_status.ACTIVE
        }
        else if (node.status === "DEFECT") {
          node.status === node_status.DEFECT
        }
        else if (node.status === "IDLE") {
          node.status === node_status.IDLE
        }
        this.update_node_css_class(node);

        if (this.nodes[index].type == "APT") {
          node["svgSym"] = airportIcon;
        } else if (node.type == "FIX") {
          node["svgSym"] = fixIcon;
        } else if (node.type == "VOR") {
          node["svgSym"] = vorIcon;
        }
      }
      return this.nodes;
    }
  }
};
</script>

<style>
.ui {
  text-align: left;
}
/* .node {
  stroke: rgba(120, 18, 18, 0);
  stroke-width: 3;
  transition: fill 0.5s ease;
  fill: #1aad8d;
} */

.node:hover {
  /* stroke: rgba(120, 18, 18, 0); */
  stroke-width: 3;
  transition: fill 0.5s ease;
  /* fill: #ffd900; */
}

.link {
  stroke: rgba(243, 243, 243, 0.7);
  stroke-width: 1;
  transition: fill 0.5s ease;
  fill: rgba(7, 7, 7, 0.7);
}
.link:hover {
  /* stroke: rgba(43, 15, 201, 0.7); */
  stroke-width: 3;
  transition: fill 0.5s ease;
  /* fill: rgba(47, 0, 255, 0.7); */
}

.active_node {
  stroke: rgb(33, 170, 140, 1);
  stroke-width: 1;
  transition: fill 0.5s ease;
  fill: rgb(33, 170, 140, 1);
}

.active_node_label {
  stroke: #21aa8c;
  stroke-width: 0.5;
  fill: #21aa8c;
}

.idle_node {
  stroke: rgba(255, 255, 255, 0);
  stroke-width: 3;
  transition: fill 0.5s ease;
  fill: rgba(255, 255, 255, 0.2);
}

.idle_node_label {
  fill: yellow;
  color: yellow;
}

.defect_node {
  stroke: rgba(255, 0, 0, 0.7);
  stroke-width: 1;
  transition: fill 0.5s ease;
  fill: #f0000f;
  -moz-animation: myfirst 2s infinite; /* Firefox */
  -webkit-animation: myfirst 2s infinite; /* Safari and Chrome */
}

.defect_node_label {
  stroke: red;
  stroke-width: 0;
  transition: fill 0.5s ease;
  fill: red;
}

@-moz-keyframes myfirst /* Firefox */ {
  0% {
    stroke: red;
  }
  50% {
    stroke: white;
  }
  100% {
    stroke: red;
  }
}

@-webkit-keyframes myfirst /* Safari and Chrome */ {
  0% {
    stroke: red;
  }
  50% {
    stroke: white;
  }
  100% {
    stroke: red;
  }
}

.node-label {
  fill: #ffffff;
}
</style>
