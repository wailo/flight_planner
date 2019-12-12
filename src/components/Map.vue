<template>
  <div>
    <l-map ref="myMap" class="map"></l-map>
    <label>{{max_edge_distance}}</label>
    <input
      type="range"
      min="1"
      max="200"
      value="50"
      v-model="max_edge_distance"
      @change="update_links"
      class="slider"
      id="myRange"
    />
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import nodes from "@/assets/waypoints.json";
import flights from "@/assets/flightplans.json";
import map_polygons from "@/assets/map.json";
import * as Algorithms from "@/Algorithms.js";

export default {
  name: "MyAwesomeMap",
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  props: {},
  data: function() {
    return {
      nodes: nodes["nodes"],
      edges: [],
      flights: flights["flights"],
      polygons: map_polygons,
      map: null,
      icon: L.icon({
        iconUrl: marker_logo,
        iconSize: [20, 20] // size of the icon
        // iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62], // the same for the shadow
        // popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
      }),
      Algorithms: Algorithms,
      max_edge_distance: 10,
      waypoints_polylines: []
    };
  },
  methods: {
    create_marker: function(node) {
      let ic = new L.DivIcon({
        className: "my-div-icon",
        html:
          '<svg height="20" width="20">  <circle cx="10" cy="10" r="10" stroke="black" stroke-width="1" fill="white" /> </svg>' +
          "<span>" +
          node.name +
          "</span>"
      });

      L.marker([node.lat, node.lon], { icon: ic })
        .addTo(this.map)
        .bindPopup(node.name);
    },
    create_links: function(nodes) {
      var waypoints_links = new Array();
      nodes.forEach(node => {
        for (let index = 0; index < this.nodes.length; index++) {
          const node_B = this.nodes[index];
          if (node_B.id == node.id) {
            continue;
          }
          if (
            Algorithms.distance(
              node.lat,
              node.lon,
              node_B.lat,
              node_B.lon,
              "nm"
            ) > this.max_edge_distance
          ) {
            continue;
          }
          waypoints_links.push([node, node_B]);
        }
      });
      return waypoints_links;
    },
    create_edges: function(links) {
      var waypoints_polylines = new Array();

      links.forEach(edge => {
        let polyline = this.draw_link(edge[0], edge[1]);
        waypoints_polylines.push(polyline);
      });
      return waypoints_polylines;
    },
    draw_link: function(start_node, end_node) {
      var latlngs = [
        [start_node.lat, start_node.lon],
        [end_node.lat, end_node.lon]
      ];
      var polyline = L.polyline(latlngs, {
        color: "red",
        weight: 1,
        opacity: 1.0
      }).addTo(this.map);

      return polyline;
      // zoom the map to the polyline
      // this.map.fitBounds(polyline.getBounds());
    },
    update_links: function(baseMaps) {
      // FIXME This does not work because baseMaps is undefined when passed from the slider event
      // Remove old edges
      this.waypoints_polylines.forEach(p => {
        p.remove(this.map);
      });

      // Create graph links
      const links = this.create_links(this.nodes);
      // Create polylines on the map
      this.waypoints_polylines = this.create_edges(links);
      // Add control layer
      var waypoint_edges = L.layerGroup(this.map_polylines);
      // Create an overlay map
      var overlayMaps = {
        waypoint_edges: waypoint_edges
      };

      L.control.layers(baseMaps, overlayMaps).addTo(this.map);
    },
    node_by_name: function(node_name) {
      var res = this.nodes.filter(function(node) {
        return node.name === node_name;
      });

      if (res.length === 0) {
        throw node_name + " not found";
      }
      return res;
    }
  },
  mounted() {
    // Add nodes ID
    for (let index = 0; index < this.nodes.length; index++) {
      let node = this.nodes[index];
      node.id = index;
    }

    // Update flight plans
    this.$store.commit("setFlightPlans", this.flights);
    this.$nextTick(() => {
      this.map = this.$refs.myMap.mapObject.setView([52.3, 4.76], 8);
      this.tileLayer = L.tileLayer(
        "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        // "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
        }
      );

      var myStyle = {
        color: "#00ffff",
        fillColor: "#111111",
        weight: 1,
        opacity: 0.65
      };

      // this.tileLayer.addTo(this.map);
      var polygons = L.geoJSON(this.polygons, {
        style: myStyle
      }).addTo(this.map);

      this.nodes.forEach(node => {
        this.create_marker(node);
      });

      this.flights.forEach(flight => {
        flight.links.forEach(link => {
          var s_node = this.node_by_name(link.s);
          var t_node = this.node_by_name(link.t);
          this.draw_link(s_node[0], t_node[0]);
        });
      });

      var baseMaps = {
        Polygons: polygons
      };

      this.update_links(baseMaps);
    });
  }
};
</script>

<style scoped>
.leaflet-container {
  background-color: rgba(0, 0, 0, 0.1);
}

.map {
  height: 600px;
}
</style>
