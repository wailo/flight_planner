<template>
<body>
  <div id="Demo">
    <d3-network
      :net-nodes="nodes_processed"
      :net-links="links"
      :options="options"
      @node-click="changeIcon"
    ></d3-network>
    <ul>
      <li>
        <button v-on:click="update_links">Greet</button>
      </li>
      <li>
        <button>Test 2</button>
      </li>
      <li>
        <button>Test 3</button>
      </li>
      <li>
        <button>Test 4</button>
      </li>
    </ul>
  </div>
</body>
</template>

<script>
const airportIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M22 1h-2v1h4v5l-2 2v13h2v2h-24v-2h2v-9h12v-4l-2-2v-5h4v-1h-2v-1h8v1zm-13 18h-3v4h3v-4zm5 0h-4v4h4v-4zm4 0h-3v4h3v-4zm-2-15h-2v2l1 1h1v-3zm3 0h-2v3h2v-3zm3 0h-2v3h1l1-1v-2z"/></svg>`;

const fixIcon = `<svg class="svg-icon">
    <path d="M17.684,7.925l-5.131-0.67L10.329,2.57c-0.131-0.275-0.527-0.275-0.658,0L7.447,7.255l-5.131,0.67C2.014,7.964,1.892,8.333,2.113,8.54l3.76,3.568L4.924,17.21c-0.056,0.297,0.261,0.525,0.533,0.379L10,15.109l4.543,2.479c0.273,0.153,0.587-0.089,0.533-0.379l-0.949-5.103l3.76-3.568C18.108,8.333,17.986,7.964,17.684,7.925 M13.481,11.723c-0.089,0.083-0.129,0.205-0.105,0.324l0.848,4.547l-4.047-2.208c-0.055-0.03-0.116-0.045-0.176-0.045s-0.122,0.015-0.176,0.045l-4.047,2.208l0.847-4.547c0.023-0.119-0.016-0.241-0.105-0.324L3.162,8.54L7.74,7.941c0.124-0.016,0.229-0.093,0.282-0.203L10,3.568l1.978,4.17c0.053,0.11,0.158,0.187,0.282,0.203l4.578,0.598L13.481,11.723z"></path>
    </svg>`;

const vorIcon = `<svg class="svg-icon" >
    <path d="M15.684,16.959L10.879,8.52c0.886-0.343,1.517-1.193,1.517-2.186c0-1.296-1.076-2.323-2.396-2.323S7.604,5.037,7.604,6.333c0,0.993,0.63,1.843,1.517,2.186l-4.818,8.439c-0.189,0.311,0.038,0.708,0.412,0.708h10.558C15.645,17.667,15.871,17.27,15.684,16.959 M8.562,6.333c0-0.778,0.645-1.382,1.438-1.382s1.438,0.604,1.438,1.382c0,0.779-0.645,1.412-1.438,1.412S8.562,7.113,8.562,6.333 M5.55,16.726L10,8.91l4.435,7.815H5.55z M15.285,9.62c1.26-2.046,1.26-4.525,0-6.572c-0.138-0.223-0.064-0.512,0.162-0.646c0.227-0.134,0.521-0.063,0.658,0.16c1.443,2.346,1.443,5.2,0,7.546c-0.236,0.382-0.641,0.17-0.658,0.159C15.221,10.131,15.147,9.842,15.285,9.62 M13.395,8.008c0.475-1.063,0.475-2.286,0-3.349c-0.106-0.238,0.004-0.515,0.246-0.62c0.242-0.104,0.525,0.004,0.632,0.242c0.583,1.305,0.583,2.801,0,4.106c-0.214,0.479-0.747,0.192-0.632,0.242C13.398,8.523,13.288,8.247,13.395,8.008 M3.895,10.107c-1.444-2.346-1.444-5.2,0-7.546c0.137-0.223,0.431-0.294,0.658-0.16c0.226,0.135,0.299,0.424,0.162,0.646c-1.26,2.047-1.26,4.525,0,6.572c0.137,0.223,0.064,0.512-0.162,0.646C4.535,10.277,4.131,10.489,3.895,10.107 M5.728,8.387c-0.583-1.305-0.583-2.801,0-4.106c0.106-0.238,0.39-0.346,0.631-0.242c0.242,0.105,0.353,0.382,0.247,0.62c-0.475,1.063-0.475,2.286,0,3.349c0.106,0.238-0.004,0.515-0.247,0.62c-0.062,0.027-0.128,0.04-0.192,0.04C5.982,8.668,5.807,8.563,5.728,8.387"></path>
    </svg>`;

import D3Network from "vue-d3-network";

export default {
  components: {
    D3Network
  },
  data: function() {
    return {
      auto_route : Boolean,
      nodes: [
        {
          alt: 0,
          id: 0,
          name: "EHAM",
          lat: 52.308099999999996,
          lon: 4.764170000000007,
          description: "Amsterdam Schiphol",
          type: "APT",
          via: ""
        },
        {
          alt: 0,
          id: 1,
          name: "PAM",
          lat: 52.3348,
          lon: 5.092160000000007,
          description: "PAMPUS",
          type: "VOR",
          via: ""
        },
        {
          alt: 0,
          id: 2,
          name: "NYKER",
          lat: 52.2304,
          lon: 5.52879999999999,
          description: "",
          type: "FIX",
          via: ""
        },
        {
          alt: 0,
          id: 3,
          name: "ARNEM",
          lat: 52.09640000000002,
          lon: 6.076600000000013,
          description: "",
          type: "FIX",
          via: ""
        },
        {
          alt: 0,
          id: 4,
          name: "TEBRO",
          lat: 51.89420000000001,
          lon: 6.587780000000009,
          description: "",
          type: "FIX",
          via: ""
        },
        {
          alt: 0,
          id: 5,
          name: "KOMOT",
          lat: 51.628600000000006,
          lon: 7.074170000000009,
          description: "",
          type: "FIX",
          via: ""
        },
        {
          alt: 0,
          id: 6,
          name: "SIGEN",
          lat: 50.84610000000001,
          lon: 8.279439999999994,
          description: "",
          type: "FIX",
          via: ""
        },
        {
          alt: 0,
          id: 7,
          name: "MTR",
          lat: 50.27629999999999,
          lon: 8.848630000000014,
          description: "METRO",
          type: "VOR",
          via: ""
        },
        {
          alt: 0,
          id: 8,
          name: "REDGO",
          lat: 50.10919999999999,
          lon: 8.856369999999998,
          description: "",
          type: "FIX",
          via: ""
        },
        {
          alt: 0,
          id: 9,
          name: "EDDF",
          lat: 50.0326,
          lon: 8.540670000000006,
          description: "Frankfurt",
          type: "APT",
          via: ""
        }
      ],
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
        force: 3000,
        nodeSize: 20,
        nodeLabels: true,
        linkWidth: 2,
        canvas: false
      }
    };
  },
  methods: {
    changeIcon: function(event, node) {
      node.selected = !node.selected;
      if (node.selected) {
        node._cssClass = "selected";
      } else {
        node._cssClass = null;
      }

      this.$set(this.nodes, node.index, node);
      if (this.auto_route) {
        this.update_links(null)
      }
    },
    update_links: function(event) {
      var active_nodes = []
      var links = []
      for (var i in this.nodes) {
        if (!this.nodes[i].selected) {
          active_nodes.push(this.nodes[i]);
        }
      }

      for (i = 1; i < active_nodes.length; i++) {
        // Push link
        links.push({ sid: active_nodes[i - 1].id, tid: active_nodes[i].id });
      }
      this.links = links;
    }
  },
  computed: {
    nodes_processed: function() {
      for (var index in this.nodes) {
        var node = this.nodes[index];
        if (!("selected" in node)) {
          node.selected = false;
        }
        if (this.nodes[index].type == "APT") {
          node["svgSym"] = airportIcon;
        } else if (node.type == "FIX") {
          node["svgSym"] = fixIcon;
        } else if (node.type == "VOR") {
          node["svgSym"] = vorIcon;
        }
      }
      return this.nodes;
    },
    links_processed: function() {
      var index = this.links.length;
      while (index--) {
        var link = this.links[index];

        if (!("selected" in link)) {
          link.selected = false;
        }

        var source_node = this.nodes.find(obj => {
          return obj.id === link.sid;
        });

        var target_node = this.nodes.find(obj => {
          return obj.id === link.tid;
        });

        if (source_node.selected === true || target_node.selected === true) {
          this.links.splice(index, 1);
        }
      }
      return this.links;
    }
  }
};
</script>

<style>
.node {
  stroke: rgba(120, 18, 18, 0);
  stroke-width: 3;
  transition: fill 0.5s ease;
  fill: #1aad8d;
}

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
  fill: rgba(243, 243, 243, 0.7);
}
.link:hover {
  /* stroke: rgba(43, 15, 201, 0.7); */
  stroke-width: 3;
  transition: fill 0.5s ease;
  /* fill: rgba(47, 0, 255, 0.7); */
}

.selected {
  stroke: rgba(255, 0, 0, 0.7);
  stroke-width: 1;
  transition: fill 0.5s ease;
  fill: #f0000f;
}

.node-label {
  fill: #ffffff;
}
</style>
