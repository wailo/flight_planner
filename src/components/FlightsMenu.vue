<template lang="html">
<div>
  <vs-table
    v-model="selected"
    @selected="handleSelected"
    @dblSelection="doubleSelection"
    :data="flightplans">
    <template slot="header">
      <h3>
        Flight Plans
      </h3>
    </template>
    <template slot="thead">
  <vs-th v-for="flight in Object.keys(flightplans[0])">{{ flight }}</vs-th>
</template>
    <template>
  <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in flightplans">
    <vs-td :data="flightplans[indextr].name">{{flightplans[indextr].name}}</vs-td>
    <vs-td :data="flightplans[indextr].links">{{flightplans[indextr].links}}</vs-td>
  </vs-tr>
</template>
  </vs-table>
  <pre>{{ selected }}</pre>
</div>
</template>

<script>
export default {
  props: {
    flightplans: Array
  },
  data: function() {
    return { selected: [] };
  },

  methods: {
    handleSelected(tr) {
      this.$vs.notify({
        title: `Selected ${tr.name}`
      });
    },
    doubleSelection(tr) {
      this.selected = [tr];
      this.$vs.notify({
        title: `Double Selection ${tr.name}`,
        color: "success"
      });
    }
  }
};
</script>