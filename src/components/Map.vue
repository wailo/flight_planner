<template>
  <l-map ref="myMap" class="map"></l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import nodes from "@/assets/waypoints.json";
import flights from "@/assets/flightplans.json";
import map_polygons from "@/assets/map.json";
import marker_logo from '@/assets/logo.png';
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
      flights: flights["flights"],
      polygons: map_polygons,
      map: null,
      icon: L.icon({
        iconUrl: marker_logo,
        iconSize: [10, 10] // size of the icon
        // iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        //  shadowAnchor: [4, 62], // the same for the shadow
        // popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
      })
    };
  },
  methods: {
    create_marker: function(node) {
      L.marker([node.lat, node.lon], { icon: this.icon })
        .addTo(this.map)
        .bindPopup(node.name);
    },
    create_link: function(start_node, end_node) {
      var latlngs = [
        [start_node.lat, start_node.lon],
        [end_node.lat, end_node.lon]
      ];
      var polyline = L.polyline(latlngs, { color: "red", weight:1 }).addTo(this.map);
      // zoom the map to the polyline
      // this.map.fitBounds(polyline.getBounds());
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
      L.geoJSON(this.polygons, {
        style: myStyle
      }).addTo(this.map);
      this.nodes.forEach(node => {
        this.create_marker(node);
      });

      this.flights.forEach(flight => {
        flight.links.forEach(link => {
          var s_node = this.node_by_name(link.s);
          var t_node = this.node_by_name(link.t);
          this.create_link(s_node[0], t_node[0]);
        });
      });
    });
  }
};
</script>

<style scoped>
.leaflet-container {
    background-color:rgba(0,0,0,0.1);
}

.map {
  height: 600px;
}
</style>
