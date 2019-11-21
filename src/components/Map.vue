<template>
  <l-map ref="myMap" class="map"></l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

export default {
  name: "MyAwesomeMap",
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.myMap.mapObject.setView([38.63, -90.23], 12);
      //this.map = L.map("myMap").setView([38.63, -90.23], 12);
      this.tileLayer = L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
        }
      );
      this.tileLayer.addTo(this.map);
    });
  }
};
</script>

<style scoped>
.map {
  height: 300px;
}
</style>