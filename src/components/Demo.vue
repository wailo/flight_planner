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
        <label for>Auto Update</label>
        <vs-switch v-model="auto_route" />
      </li>
      <li>
        <vs-button color="primary" type="border" v-on:click="update_links">Primary</vs-button>
      </li>
    </ul>
    <ul class="ui"></ul>
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

const node_status = {
ACTIVE: 0,
IDLE: 1,
DEFECT: 2,
MAX: 3
}

export default {
  components: {
    D3Network
  },
  data: function() {
    return {
      auto_route: Boolean,
      nodes: [
        {
          alt: 0,
          id: 0,
          name: "EHAM",
          lat: 52.308099999999996,
          lon: 4.764170000000007,
          description: "Amsterdam Schiphol",
          type: "APT",
          via: "",
          status: node_status.ACTIVE
        },
        {
          alt: 0,
          id: 1,
          name: "PAM",
          lat: 52.3348,
          lon: 5.092160000000007,
          description: "PAMPUS",
          type: "VOR",
          via: "",
          status: node_status.ACTIVE
        },
        {
          alt: 0,
          id: 2,
          name: "NYKER",
          lat: 52.2304,
          lon: 5.52879999999999,
          description: "",
          type: "FIX",
          via: "",
          status: node_status.ACTIVE
        },
        {
          alt: 0,
          id: 3,
          name: "ARNEM",
          lat: 52.09640000000002,
          lon: 6.076600000000013,
          description: "",
          type: "FIX",
          via: "",
          status: node_status.ACTIVE
        },
        {
          alt: 0,
          id: 4,
          name: "TEBRO",
          lat: 51.89420000000001,
          lon: 6.587780000000009,
          description: "",
          type: "FIX",
          via: "",
          status: node_status.ACTIVE
        },
        {
          alt: 0,
          id: 5,
          name: "KOMOT",
          lat: 51.628600000000006,
          lon: 7.074170000000009,
          description: "",
          type: "FIX",
          via: "",
          status: node_status.ACTIVE
        },
        {
          alt: 0,
          id: 6,
          name: "SIGEN",
          lat: 50.84610000000001,
          lon: 8.279439999999994,
          description: "",
          type: "FIX",
          via: "",
          status: node_status.ACTIVE
        },
        {
          alt: 0,
          id: 7,
          name: "MTR",
          lat: 50.27629999999999,
          lon: 8.848630000000014,
          description: "METRO",
          type: "VOR",
          via: "",
          status: node_status.ACTIVE
        },
        {
          alt: 0,
          id: 8,
          name: "REDGO",
          lat: 50.10919999999999,
          lon: 8.856369999999998,
          description: "",
          type: "FIX",
          via: "",
          status: node_status.ACTIVE
        },
        {
          alt: 0,
          id: 9,
          name: "EDDF",
          lat: 50.0326,
          lon: 8.540670000000006,
          description: "Frankfurt",
          type: "APT",
          via: "",
          status: node_status.ACTIVE
        },
        {name:"ABA02", lat:52.2576277778, lon:4.77401388889, type:"FIX"},
{name:"ABA03", lat:52.2409944444, lon:4.77241388889, type:"FIX"},
{name:"ABA05", lat:52.2077555556, lon:4.76921388889, type:"FIX"},
{name:"ABA11", lat:52.1030666667, lon:4.75917222222, type:"FIX"},
{name:"ABA38", lat:52.2243833333, lon:4.77081388889, type:"FIX"},
{name:"ABA62", lat:52.1878166667, lon:4.76729722222, type:"FIX"},
{name:"ABA93", lat:52.1363027778, lon:4.76235555556, type:"FIX"},
{name:"AMGOD", lat:52.9752194444, lon:3.68538888889, type:"FIX"},
{name:"ANDIK", lat:52.7394027778, lon:5.27048888889, type:"FIX"},
{name:"ARNEM", lat:52.0964472222, lon:6.07660277778, type:"FIX"},
{name:"ARTIP", lat:52.5112138889, lon:5.56908055556, type:"FIX"},
{name:"BASNO", lat:52.3501527778, lon:4.57504166667, type:"FIX"},
{name:"BATAK", lat:51.5711111111, lon:4.78885555556, type:"FIX"},
{name:"BAXIM", lat:50.9566722222, lon:6.04731944444, type:"FIX"},
{name:"BEDUM", lat:53.3481694444, lon:6.58886666667, type:"FIX"},
{name:"BEKEM", lat:51.4322222222, lon:4.58027777778, type:"FIX"},
{name:"BEMTI", lat:50.7722222222, lon:5.7825, type:"FIX"},
{name:"BERGI", lat:52.74875, lon:4.35893055556, type:"FIX"},
{name:"BETUS", lat:52.6881416667, lon:5.16255277778, type:"FIX"},
{name:"BKN02", lat:50.9198194444, lon:5.77635, type:"FIX"},
{name:"BKN03", lat:50.9646055556, lon:5.82205555556, type:"FIX"},
{name:"BKN04", lat:50.9772972222, lon:5.83764166667, type:"FIX"},
{name:"BKN05", lat:50.9925361111, lon:5.85074444444, type:"FIX"},
{name:"BKN06", lat:51.0098694444, lon:5.87121388889, type:"FIX"},
{name:"BKN14", lat:50.9785611111, lon:5.83638611111, type:"FIX"},
{name:"BKN20", lat:50.9506194444, lon:5.80770277778, type:"FIX"},
{name:"BKN63", lat:51.0106888889, lon:5.86941666667, type:"FIX"},
{name:"BOBMO", lat:51.1127194444, lon:5.99670277778, type:"FIX"},
{name:"BOLGA", lat:52.7905666667, lon:5.37867777778, type:"FIX"},
{name:"BREDA", lat:51.5602944444, lon:4.85333333333, type:"FIX"},
{name:"COA55", lat:51.8981333333, lon:4.53791666667, type:"FIX"},
{name:"DENAG", lat:52.0823861111, lon:3.89079722222, type:"FIX"},
{name:"DIBIR", lat:51.2769444444, lon:6.12444444444, type:"FIX"},
{name:"DIBRU", lat:51.6402777778, lon:3.49666666667, type:"FIX"},
{name:"DIDAM", lat:52.0341666667, lon:6.32694444444, type:"FIX"},
{name:"DOBAK", lat:53.2133333333, lon:7.21694444444, type:"FIX"},
{name:"DOSEX", lat:51.1833333333, lon:5.93611111111, type:"FIX"},
{name:"EDUPO", lat:51.975525, lon:5.83593611111, type:"FIX"},
{name:"EEL10", lat:53.1924888889, lon:6.93955277778, type:"FIX"},
{name:"EH613", lat:52.209075, lon:4.46255555556, type:"FIX"},
{name:"EHV03", lat:51.4088, lon:5.325775, type:"FIX"},
{name:"EHV04", lat:51.5006138889, lon:5.44061666667, type:"FIX"},
{name:"EHV05", lat:51.4636305556, lon:5.38981111111, type:"FIX"},
{name:"EHV07", lat:51.4353194444, lon:5.35786944444, type:"FIX"},
{name:"EHV14", lat:51.4058055556, lon:5.332625, type:"FIX"},
{name:"EHV25", lat:51.3942944444, lon:5.09502777778, type:"FIX"},
{name:"EHV26", lat:51.4442611111, lon:5.20189722222, type:"FIX"},
{name:"EHV28", lat:51.6140472222, lon:5.49923055556, type:"FIX"},
{name:"EHV29", lat:51.5044138889, lon:5.09589444444, type:"FIX"},
{name:"EHV33", lat:51.3327083333, lon:5.14777222222, type:"FIX"},
{name:"EHV36", lat:51.6311583333, lon:5.36466666667, type:"FIX"},
{name:"EHV40", lat:51.50335, lon:5.43459722222, type:"FIX"},
{name:"EHV44", lat:51.3889305556, lon:5.30588888889, type:"FIX"},
{name:"EHV55", lat:51.6477416667, lon:5.80231666667, type:"FIX"},
{name:"EHV61", lat:51.5399638889, lon:5.47571111111, type:"FIX"},
{name:"EHV64", lat:51.36165, lon:5.27538333333, type:"FIX"},
{name:"EHV65", lat:51.5983416667, lon:5.85123333333, type:"FIX"},
{name:"EHV85", lat:51.4875416667, lon:5.90422777778, type:"FIX"},
{name:"EKROS", lat:52.2372777778, lon:4.61954722222, type:"FIX"},
{name:"ELBED", lat:50.8248027778, lon:6.05585277778, type:"FIX"},
{name:"ELDIN", lat:53.1609305556, lon:3.35675833333, type:"FIX"},
{name:"ELPAT", lat:52.1274194444, lon:5.95114166667, type:"FIX"},
{name:"ENKOS", lat:52.6781277778, lon:5.24326388889, type:"FIX"},
{name:"ETEBO", lat:52.1383333333, lon:6.87527777778, type:"FIX"},
{name:"EVELI", lat:52.6404083333, lon:3.387, type:"FIX"},
{name:"EVOSA", lat:51.1827777778, lon:5.76972222222, type:"FIX"},
{name:"FLEVO", lat:52.38535, lon:5.60216944444, type:"FIX"},
{name:"GISEB", lat:51.9013166667, lon:4.99083333333, type:"FIX"},
{name:"GISIM", lat:52.0770305556, lon:4.22806111111, type:"FIX"},
{name:"GOBNO", lat:50.9822222222, lon:5.98972222222, type:"FIX"},
{name:"GODOS", lat:53.2490416667, lon:3.42966388889, type:"FIX"},
{name:"GORLO", lat:51.9240666667, lon:3.17183611111, type:"FIX"},
{name:"GOTIG", lat:52.118775, lon:6.76395833333, type:"FIX"},
{name:"GRONY", lat:53.1054694444, lon:6.05496944444, type:"FIX"},
{name:"GUBAS", lat:52.2233333333, lon:4.2215, type:"FIX"},
{name:"HDR01", lat:52.8824083333, lon:4.75822222222, type:"FIX"},
{name:"HDR02", lat:52.9352805556, lon:4.79472222222, type:"FIX"},
{name:"HDR05", lat:52.9757972222, lon:4.843175, type:"FIX"},
{name:"HDR18", lat:52.8570194444, lon:4.76636666667, type:"FIX"},
{name:"HDR20", lat:52.9352055556, lon:4.79493611111, type:"FIX"},
{name:"HDR40", lat:52.9453861111, lon:4.81855, type:"FIX"},
{name:"HDR41", lat:52.9635472222, lon:4.82381666667, type:"FIX"},
{name:"HDR45", lat:52.9424611111, lon:4.82389166667, type:"FIX"},
{name:"HDR52", lat:52.8218861111, lon:4.73948333333, type:"FIX"},
{name:"HDR57", lat:53.0095944444, lon:4.883425, type:"FIX"},
{name:"HDR71", lat:52.7889888889, lon:4.77729444444, type:"FIX"},
{name:"HDR75", lat:53.0131694444, lon:4.87436388889, type:"FIX"},
{name:"HDR96", lat:53.0243555556, lon:4.94528333333, type:"FIX"},
{name:"HDR97", lat:53.0204972222, lon:4.95196111111, type:"FIX"},
{name:"HELEN", lat:51.2353138889, lon:3.86971111111, type:"FIX"},
{name:"INKET", lat:51.8146277778, lon:4.77196111111, type:"FIX"},
{name:"IVLUT", lat:52.2441138889, lon:5.25696111111, type:"FIX"},
{name:"KAG01", lat:52.2792555556, lon:4.710375, type:"FIX"},
{name:"KAG02", lat:52.2705083333, lon:4.68726388889, type:"FIX"},
{name:"KAG03", lat:52.2617694444, lon:4.66419722222, type:"FIX"},
{name:"KAG05", lat:52.2442611111, lon:4.61804444444, type:"FIX"},
{name:"KAG22", lat:52.2879055556, lon:4.73401944444, type:"FIX"},
{name:"KAG62", lat:52.2337527778, lon:4.59038333333, type:"FIX"},
{name:"KAG91", lat:52.2076805556, lon:4.52083888889, type:"FIX"},
{name:"KEGIT", lat:51.4070138889, lon:3.10659722222, type:"FIX"},
{name:"KUBAT", lat:53.3363888889, lon:6.99361111111, type:"FIX"},
{name:"KUDAD", lat:51.6674805556, lon:4.56761388889, type:"FIX"},
{name:"KUVEK", lat:53.7347222222, lon:6.49944444444, type:"FIX"},
{name:"LABIL", lat:53.4958333333, lon:6.81638888889, type:"FIX"},
{name:"LARAS", lat:51.8345722222, lon:4.697325, type:"FIX"},
{name:"LEKKO", lat:51.924175, lon:4.76733055556, type:"FIX"},
{name:"LILSI", lat:52.4732638889, lon:5.34833333333, type:"FIX"},
{name:"LIMBI", lat:54.5516333333, lon:6.06299722222, type:"FIX"},
{name:"LISDA", lat:52.2338444444, lon:4.37670555556, type:"FIX"},
{name:"LONAM", lat:53.8395833333, lon:3.94254444444, type:"FIX"},
{name:"LOPIK", lat:51.9308277778, lon:5.12915555556, type:"FIX"},
{name:"LUGUM", lat:53.3072222222, lon:7.06805555556, type:"FIX"},
{name:"LUNIX", lat:52.1098333333, lon:5.56540277778, type:"FIX"},
{name:"LUTEX", lat:52.6814333333, lon:3.46854722222, type:"FIX"},
{name:"LUTOM", lat:51.2655555556, lon:5.42111111111, type:"FIX"},
{name:"LWD00", lat:53.1303333333, lon:5.52256111111, type:"FIX"},
{name:"LWD01", lat:53.2329138889, lon:5.77493888889, type:"FIX"},
{name:"LWD02", lat:53.2343055556, lon:5.77319166667, type:"FIX"},
{name:"LWD05", lat:53.1770277778, lon:5.63712777778, type:"FIX"},
{name:"LWD10", lat:53.1308055556, lon:5.52203055556, type:"FIX"},
{name:"LWD11", lat:53.1031361111, lon:5.48694444444, type:"FIX"},
{name:"LWD12", lat:53.2196611111, lon:5.41927777778, type:"FIX"},
{name:"LWD13", lat:53.2143027778, lon:5.72896111111, type:"FIX"},
{name:"LWD15", lat:53.2106083333, lon:5.71643611111, type:"FIX"},
{name:"LWD16", lat:53.4164666667, lon:5.83845277778, type:"FIX"},
{name:"LWD17", lat:53.3843277778, lon:5.82398333333, type:"FIX"},
{name:"LWD18", lat:53.0684638889, lon:5.32536666667, type:"FIX"},
{name:"LWD19", lat:53.2439833333, lon:5.79224722222, type:"FIX"},
{name:"LWD20", lat:53.2490138889, lon:5.80330277778, type:"FIX"},
{name:"LWD21", lat:53.3818444444, lon:5.83794722222, type:"FIX"},
{name:"LWD22", lat:53.4134833333, lon:5.855225, type:"FIX"},
{name:"LWD23", lat:53.111625, lon:5.47680277778, type:"FIX"},
{name:"LWD24", lat:53.202175, lon:5.69581944444, type:"FIX"},
{name:"LWD25", lat:53.2301166667, lon:5.41935, type:"FIX"},
{name:"LWD26", lat:53.2012638889, lon:5.6968, type:"FIX"},
{name:"LWD27", lat:53.2203833333, lon:5.47471944444, type:"FIX"},
{name:"LWD28", lat:53.2492722222, lon:5.80295277778, type:"FIX"},
{name:"LWD38", lat:53.2691222222, lon:5.84755277778, type:"FIX"},
{name:"LWD41", lat:53.2147888889, lon:5.72843333333, type:"FIX"},
{name:"LWD42", lat:53.1852861111, lon:5.65458333333, type:"FIX"},
{name:"LWD50", lat:53.2770472222, lon:5.85828333333, type:"FIX"},
{name:"LWD52", lat:53.3303861111, lon:5.96488888889, type:"FIX"},
{name:"LWD53", lat:52.5741666667, lon:6.7475, type:"FIX"},
{name:"LWD54", lat:53.3516972222, lon:6.00760555556, type:"FIX"},
{name:"LWD56", lat:52.6355, lon:6.95766666667, type:"FIX"},
{name:"LWD57", lat:53.3434916667, lon:6.01843333333, type:"FIX"},
{name:"LWD60", lat:53.3861222222, lon:6.17241666667, type:"FIX"},
{name:"LWD75", lat:53.2290972222, lon:5.47478888889, type:"FIX"},
{name:"LWD94", lat:53.3253277778, lon:5.97165, type:"FIX"},
{name:"MAPAD", lat:50.8294444444, lon:6.01916666667, type:"FIX"},
{name:"MAS08", lat:51.1038222222, lon:5.93098888889, type:"FIX"},
{name:"MAS12", lat:50.8894472222, lon:5.68083333333, type:"FIX"},
{name:"MAS51", lat:50.9576916667, lon:5.89850555556, type:"FIX"},
{name:"MASOS", lat:51.7993333333, lon:3.59646944444, type:"FIX"},
{name:"MAVAS", lat:52.3985833333, lon:3.16675, type:"FIX"},
{name:"MOKUM", lat:54.4841666667, lon:6.09331944444, type:"FIX"},
{name:"MONIL", lat:52.7607555556, lon:3.74664166667, type:"FIX"},
{name:"NARSO", lat:52.7153194444, lon:6.70954444444, type:"FIX"},
{name:"NAVAK", lat:50.8274444444, lon:5.9181, type:"FIX"},
{name:"NAVPI", lat:52.5472222222, lon:2.84055555556, type:"FIX"},
{name:"NIK08", lat:51.2962694444, lon:4.14730833333, type:"FIX"},
{name:"NIK10", lat:51.3158166667, lon:4.29615, type:"FIX"},
{name:"NOR40", lat:50.8217, lon:5.65416944444, type:"FIX"},
{name:"NOVEN", lat:52.7102138889, lon:5.89845277778, type:"FIX"},
{name:"NV31", lat:52.0970833333, lon:4.86728055556, type:"FIX"},
{name:"NV48", lat:52.0951083333, lon:4.8226, type:"FIX"},
{name:"NYKER", lat:52.2303888889, lon:5.52880277778, type:"FIX"},
{name:"OGINA", lat:52.0974777778, lon:5.05463333333, type:"FIX"},
{name:"OKOKO", lat:52.5978444444, lon:4.36444444444, type:"FIX"},
{name:"OSGOS", lat:51.1833333333, lon:5.91590833333, type:"FIX"},
{name:"OSKUR", lat:52.4904555556, lon:6.02402222222, type:"FIX"},
{name:"PEPEL", lat:52.5851222222, lon:3.41417777778, type:"FIX"},
{name:"PESER", lat:51.6146472222, lon:4.52681388889, type:"FIX"},
{name:"PETIK", lat:52.6149111111, lon:4.21573611111, type:"FIX"},
{name:"PEVAD", lat:51.9153972222, lon:2.66690833333, type:"FIX"},
{name:"PIMIP", lat:51.0405555556, lon:6.02, type:"FIX"},
{name:"PS064", lat:51.8758722222, lon:4.24822777778, type:"FIX"},
{name:"PS207", lat:51.8273944444, lon:4.180625, type:"FIX"},
{name:"PS74", lat:51.86735, lon:4.12998055556, type:"FIX"},
{name:"PS92", lat:51.8947805556, lon:4.08536111111, type:"FIX"},
{name:"R1781", lat:53.2191527778, lon:5.73772777778, type:"FIX"},
{name:"R1811", lat:52.290825, lon:4.77734722222, type:"FIX"},
{name:"R1812", lat:52.2891305556, lon:4.73729166667, type:"FIX"},
{name:"R1813", lat:52.3313972222, lon:4.74003055556, type:"FIX"},
{name:"R1814", lat:52.318375, lon:4.79689166667, type:"FIX"},
{name:"R2204", lat:50.9188333333, lon:5.77731388889, type:"FIX"},
{name:"R2205", lat:52.9264111111, lon:4.78388611111, type:"FIX"},
{name:"R2274", lat:53.2313083333, lon:5.767025, type:"FIX"},
{name:"R2704", lat:51.9618583333, lon:4.45269166667, type:"FIX"},
{name:"R2871", lat:51.4593416667, lon:5.38483055556, type:"FIX"},
{name:"R3093", lat:51.440925, lon:5.36419166667, type:"FIX"},
{name:"RAKIX", lat:52.1363916667, lon:5.77680833333, type:"FIX"},
{name:"REFSO", lat:51.8095666667, lon:2.66690833333, type:"FIX"},
{name:"RELBI", lat:52.1183333333, lon:6.81361111111, type:"FIX"},
{name:"RENDI", lat:52.0615444444, lon:5.675425, type:"FIX"},
{name:"RILTI", lat:51.0975, lon:5.885, type:"FIX"},
{name:"RIVER", lat:51.9127638889, lon:4.13259444444, type:"FIX"},
{name:"RKN24", lat:51.9884888889, lon:6.15981944444, type:"FIX"},
{name:"ROBVI", lat:52.5716472222, lon:3.77644722222, type:"FIX"},
{name:"ROMIN", lat:51.2244416667, lon:5.96025, type:"FIX"},
{name:"ROT28", lat:51.9712916667, lon:4.61687222222, type:"FIX"},
{name:"ROT46", lat:51.9324805556, lon:4.61210833333, type:"FIX"},
{name:"ROVEN", lat:51.9629222222, lon:5.11485, type:"FIX"},
{name:"RTM01", lat:51.9827611111, lon:4.50357777778, type:"FIX"},
{name:"RTM02", lat:51.9918194444, lon:4.52619166667, type:"FIX"},
{name:"RTM03", lat:52.000875, lon:4.54881944444, type:"FIX"},
{name:"RTM04", lat:51.9956472222, lon:4.54009166667, type:"FIX"},
{name:"RTM05", lat:52.009925, lon:4.57145277778, type:"FIX"},
{name:"RTM08", lat:51.9526027778, lon:4.24088611111, type:"FIX"},
{name:"RTM09", lat:52.0180638889, lon:4.59183333333, type:"FIX"},
{name:"RTM10", lat:52.073275, lon:4.59441666667, type:"FIX"},
{name:"RTM13", lat:51.9619083333, lon:4.45159444444, type:"FIX"},
{name:"RTM21", lat:51.8627777778, lon:3.90249722222, type:"FIX"},
{name:"RTM22", lat:51.9537416667, lon:4.43126666667, type:"FIX"},
{name:"RTM23", lat:51.9904777778, lon:4.53674166667, type:"FIX"},
{name:"RTM28", lat:51.9474972222, lon:4.41700555556, type:"FIX"},
{name:"RTM40", lat:51.9374, lon:4.39063333333, type:"FIX"},
{name:"RTM48", lat:52.1467694444, lon:4.77289722222, type:"FIX"},
{name:"RTM49", lat:52.0165944444, lon:4.59335277778, type:"FIX"},
{name:"RTM50", lat:51.9283166667, lon:4.36806944444, type:"FIX"},
{name:"RTM60", lat:51.9192277778, lon:4.34551666667, type:"FIX"},
{name:"RTM62", lat:51.9229138889, lon:4.62647777778, type:"FIX"},
{name:"RTM63", lat:51.94785, lon:4.18756666667, type:"FIX"},
{name:"RTM70", lat:51.9101333333, lon:4.322975, type:"FIX"},
{name:"RTM79", lat:52.0451777778, lon:4.65981666667, type:"FIX"},
{name:"RTM80", lat:51.9010361111, lon:4.30043888889, type:"FIX"},
{name:"RTM84", lat:51.8973944444, lon:4.29142777778, type:"FIX"},
{name:"RUMER", lat:51.6206638889, lon:5.88469166667, type:"FIX"},
{name:"SASKI", lat:51.5480916667, lon:2.5, type:"FIX"},
{name:"SIPSA", lat:53.0713888889, lon:7.19583333333, type:"FIX"},
{name:"SOGPO", lat:51.9655888889, lon:6.25286944444, type:"FIX"},
{name:"SOMPO", lat:53.3988888889, lon:6.94944444444, type:"FIX"},
{name:"SOPVI", lat:51.2496833333, lon:5.90185, type:"FIX"},
{name:"SPL14", lat:52.42665, lon:4.37199166667, type:"FIX"},
{name:"SPL15", lat:52.147275, lon:4.47616388889, type:"FIX"},
{name:"SPL28", lat:52.37355, lon:4.78479722222, type:"FIX"},
{name:"SPL42", lat:52.3182444444, lon:4.85169722222, type:"FIX"},
{name:"SPL43", lat:52.31865, lon:4.87889166667, type:"FIX"},
{name:"SPL46", lat:52.3199111111, lon:4.96582777778, type:"FIX"},
{name:"SPL56", lat:52.31905, lon:4.90605555556, type:"FIX"},
{name:"SPL72", lat:52.4148333333, lon:5.13475833333, type:"FIX"},
{name:"SPL95", lat:51.8727444444, lon:4.55793611111, type:"FIX"},
{name:"SPY65", lat:53.2128611111, lon:6.25419166667, type:"FIX"},
{name:"SUGOL", lat:52.5255111111, lon:3.96735, type:"FIX"},
{name:"SULUT", lat:52.447925, lon:3.42106388889, type:"FIX"},
{name:"SUMUM", lat:51.6372805556, lon:2.10770555556, type:"FIX"},
{name:"SUPAM", lat:52.1555555556, lon:5.33722222222, type:"FIX"},
{name:"SUPUR", lat:53.015225, lon:3.56446388889, type:"FIX"},
{name:"SUSET", lat:52.1288888889, lon:5.13189722222, type:"FIX"},
{name:"TEB12", lat:51.7636833333, lon:6.83166944444, type:"FIX"},
{name:"TEMLU", lat:53.4744444444, lon:6.86361111111, type:"FIX"},
{name:"TENLI", lat:52.2464694444, lon:6.25014166667, type:"FIX"},
{name:"TOLEN", lat:51.5303138889, lon:4.08659444444, type:"FIX"},
{name:"TOPPA", lat:53.4025916667, lon:3.56146666667, type:"FIX"},
{name:"TORNU", lat:51.1833972222, lon:5.83339166667, type:"FIX"},
{name:"TOTNA", lat:51.7031083333, lon:5.26056944444, type:"FIX"},
{name:"TULIP", lat:52.36775, lon:3.85730833333, type:"FIX"},
{name:"ULPEN", lat:50.7555555556, lon:5.9275, type:"FIX"},
{name:"UNKAR", lat:52.0216666667, lon:6.165, type:"FIX"},
{name:"VALAM", lat:53.0315722222, lon:5.38848333333, type:"FIX"},
{name:"VALKO", lat:52.0713444444, lon:3.83983055556, type:"FIX"},
{name:"VEROR", lat:52.9017861111, lon:6.38285277778, type:"FIX"},
{name:"VKL00", lat:51.664925, lon:5.72908888889, type:"FIX"},
{name:"VKL03", lat:51.627425, lon:5.64056388889, type:"FIX"},
{name:"VKL04", lat:51.8315666667, lon:5.85906111111, type:"FIX"},
{name:"VKL05", lat:51.6836472222, lon:5.77340555556, type:"FIX"},
{name:"VKL07", lat:51.7117027778, lon:5.83995, type:"FIX"},
{name:"VKL10", lat:51.6474194444, lon:5.68358055556, type:"FIX"},
{name:"VKL13", lat:51.8527083333, lon:5.85065, type:"FIX"},
{name:"VKL18", lat:51.7285611111, lon:6.03471111111, type:"FIX"},
{name:"VKL36", lat:51.8298027778, lon:5.913625, type:"FIX"},
{name:"VKL55", lat:51.7770138889, lon:5.99553888889, type:"FIX"},
{name:"VKL67", lat:51.7799, lon:5.57242777778, type:"FIX"},
{name:"VKL68", lat:51.8075111111, lon:5.54243611111, type:"FIX"},
{name:"VKL69", lat:51.5978972222, lon:5.42751388889, type:"FIX"},
{name:"VKL70", lat:51.6544416667, lon:5.41237777778, type:"FIX"},
{name:"VKL71", lat:51.6066638889, lon:5.56688055556, type:"FIX"},
{name:"VKL72", lat:51.5657944444, lon:5.45039166667, type:"FIX"},
{name:"VKL81", lat:51.8984861111, lon:5.99020833333, type:"FIX"},
{name:"VKL99", lat:51.8235416667, lon:6.10695, type:"FIX"},
{name:"WP24", lat:52.2891333333, lon:5.12321388889, type:"FIX"},
{name:"WP41", lat:52.2616805556, lon:5.11873611111, type:"FIX"},
{name:"ZANDA", lat:52.389775, lon:4.92251944444, type:"FIX"},
{name:"ABLUN", lat:54.8507638889, lon:5.89508611111, type:"FIX"},
{name:"ADOMI", lat:54.2055833333, lon:4.55786388889, type:"FIX"},
{name:"AGASO", lat:54.9445777778, lon:4.57248888889, type:"FIX"},
{name:"AGISI", lat:53.6174694444, lon:4.54659722222, type:"FIX"},
{name:"AKOXA", lat:54.5308777778, lon:4.56423611111, type:"FIX"},
{name:"ALINA", lat:51.4453444444, lon:4.023775, type:"FIX"},
{name:"AMSOT", lat:53.3132638889, lon:4.58576111111, type:"FIX"},
{name:"ASGOS", lat:53.8728277778, lon:4.55145, type:"FIX"},
{name:"ATRIX", lat:53.1384777778, lon:4.62463888889, type:"FIX"},
{name:"BAGOV", lat:53.6663694444, lon:4.33578888889, type:"FIX"},
{name:"BAKLU", lat:52.9849583333, lon:4.77273055556, type:"FIX"},
{name:"BANDU", lat:53.0694944444, lon:6.47456111111, type:"FIX"},
{name:"BASGU", lat:51.9123027778, lon:5.84993055556, type:"FIX"},
{name:"BENUX", lat:55.0, lon:4.00146111111, type:"FIX"},
{name:"BERIR", lat:50.7714666667, lon:5.78421666667, type:"FIX"},
{name:"BESBU", lat:54.5, lon:4.00681388889, type:"FIX"},
{name:"BESTI", lat:51.6424027778, lon:5.42762777778, type:"FIX"},
{name:"BIBIS", lat:54.0065888889, lon:4.09057777778, type:"FIX"},
{name:"BOGTI", lat:54.1159333333, lon:4.01083611111, type:"FIX"},
{name:"BUDIP", lat:51.3792638889, lon:5.874275, type:"FIX"},
{name:"BUROG", lat:53.0447805556, lon:4.77811666667, type:"FIX"},
{name:"DESUL", lat:53.7511583333, lon:3.86470555556, type:"FIX"},
{name:"DEVIG", lat:54.3248166667, lon:2.93413611111, type:"FIX"},
{name:"DEXOR", lat:54.0, lon:3.46562777778, type:"FIX"},
{name:"DIMOX", lat:53.5373083333, lon:4.20225, type:"FIX"},
{name:"DISOT", lat:54.85, lon:5.51666666667, type:"FIX"},
{name:"DISRA", lat:53.3333333333, lon:4.41945833333, type:"FIX"},
{name:"DIVPA", lat:53.0024472222, lon:6.18442222222, type:"FIX"},
{name:"EBAGO", lat:53.6384305556, lon:3.76601666667, type:"FIX"},
{name:"EDUMA", lat:51.0957138889, lon:5.93441111111, type:"FIX"},
{name:"EH001", lat:52.2752083333, lon:4.7011, type:"FIX"},
{name:"EH005", lat:52.2738277778, lon:4.69749722222, type:"FIX"},
{name:"EH006", lat:52.5907361111, lon:4.54623333333, type:"FIX"},
{name:"EH008", lat:52.2083333333, lon:4.76666666667, type:"FIX"},
{name:"EH009", lat:52.2236888889, lon:4.55455277778, type:"FIX"},
{name:"EH010", lat:52.3780083333, lon:4.76926944444, type:"FIX"},
{name:"EH012", lat:52.4203694444, lon:4.71763611111, type:"FIX"},
{name:"EH013", lat:52.5447166667, lon:4.72934722222, type:"FIX"},
{name:"EH014", lat:52.3376527778, lon:4.86384166667, type:"FIX"},
{name:"EH015", lat:52.5908861111, lon:4.73453611111, type:"FIX"},
{name:"EH016", lat:52.3986694444, lon:4.41455277778, type:"FIX"},
{name:"EH017", lat:52.1849638889, lon:4.94151666667, type:"FIX"},
{name:"EH018", lat:52.3203555556, lon:4.81865, type:"FIX"},
{name:"EH019", lat:52.3379611111, lon:4.837325, type:"FIX"},
{name:"EH020", lat:52.336875, lon:4.92878333333, type:"FIX"},
{name:"EH021", lat:52.4767416667, lon:4.655725, type:"FIX"},
{name:"EH022", lat:52.6804888889, lon:4.52193333333, type:"FIX"},
{name:"EH023", lat:52.2558944444, lon:4.84808888889, type:"FIX"},
{name:"EH024", lat:52.2530055556, lon:4.98061388889, type:"FIX"},
{name:"EH025", lat:52.2068305556, lon:4.73998888889, type:"FIX"},
{name:"EH026", lat:52.1713722222, lon:4.86978611111, type:"FIX"},
{name:"EH027", lat:52.2509416667, lon:5.02606666667, type:"FIX"},
{name:"EH028", lat:52.3577916667, lon:4.42103055556, type:"FIX"},
{name:"EH029", lat:52.1876972222, lon:4.820675, type:"FIX"},
{name:"EH030", lat:52.261575, lon:4.8013, type:"FIX"},
{name:"EH032", lat:52.2641472222, lon:4.58849166667, type:"FIX"},
{name:"EH033", lat:52.3884722222, lon:4.78453333333, type:"FIX"},
{name:"EH034", lat:52.5178305556, lon:4.57669722222, type:"FIX"},
{name:"EH036", lat:52.2570444444, lon:4.847875, type:"FIX"},
{name:"EH037", lat:52.2578666667, lon:4.774425, type:"FIX"},
{name:"EH038", lat:52.1699527778, lon:4.96096666667, type:"FIX"},
{name:"EH039", lat:52.1602722222, lon:4.75727222222, type:"FIX"},
{name:"EH040", lat:52.1066472222, lon:4.46759444444, type:"FIX"},
{name:"EH041", lat:52.3227333333, lon:4.42654444444, type:"FIX"},
{name:"EH042", lat:52.2956111111, lon:4.9621, type:"FIX"},
{name:"EH043", lat:52.4253833333, lon:5.13180277778, type:"FIX"},
{name:"EH044", lat:52.4350694444, lon:4.86369166667, type:"FIX"},
{name:"EH046", lat:52.217875, lon:4.72963055556, type:"FIX"},
{name:"EH047", lat:52.43105, lon:4.71846666667, type:"FIX"},
{name:"EH048", lat:52.2701111111, lon:4.73440833333, type:"FIX"},
{name:"EH049", lat:52.2891666667, lon:4.61236666667, type:"FIX"},
{name:"EH050", lat:52.1553222222, lon:4.91797777778, type:"FIX"},
{name:"EH051", lat:52.2438416667, lon:4.65101944444, type:"FIX"},
{name:"EH052", lat:52.3241694444, lon:4.89976944444, type:"FIX"},
{name:"EH053", lat:52.3872305556, lon:4.78973333333, type:"FIX"},
{name:"EH055", lat:52.3207583333, lon:4.86653055556, type:"FIX"},
{name:"EH056", lat:52.3293555556, lon:4.65078611111, type:"FIX"},
{name:"EH057", lat:52.3711944444, lon:4.69087222222, type:"FIX"},
{name:"EH058", lat:52.3300638889, lon:4.67569722222, type:"FIX"},
{name:"EH059", lat:52.3468694444, lon:4.85010555556, type:"FIX"},
{name:"EH060", lat:52.3051916667, lon:4.907025, type:"FIX"},
{name:"EH061", lat:52.2250666667, lon:4.88946666667, type:"FIX"},
{name:"EH062", lat:52.2591416667, lon:4.72456944444, type:"FIX"},
{name:"EH063", lat:52.2752861111, lon:4.74762222222, type:"FIX"},
{name:"EH064", lat:52.2511666667, lon:4.78962777778, type:"FIX"},
{name:"EH065", lat:52.2768861111, lon:4.70545833333, type:"FIX"},
{name:"EH066", lat:52.27385, lon:4.67336944444, type:"FIX"},
{name:"EH067", lat:52.3181222222, lon:4.64004166667, type:"FIX"},
{name:"EH069", lat:52.15155, lon:4.92929444444, type:"FIX"},
{name:"EH070", lat:52.3664777778, lon:4.85014722222, type:"FIX"},
{name:"EH072", lat:52.0205861111, lon:4.84300277778, type:"FIX"},
{name:"EH073", lat:52.2141944444, lon:4.807725, type:"FIX"},
{name:"EH074", lat:52.1661666667, lon:4.75701944444, type:"FIX"},
{name:"EH075", lat:52.1561333333, lon:4.75745, type:"FIX"},
{name:"EH080", lat:52.2913694444, lon:4.73635833333, type:"FIX"},
{name:"EH081", lat:52.4235666667, lon:4.84568333333, type:"FIX"},
{name:"EH082", lat:52.4241333333, lon:4.98883888889, type:"FIX"},
{name:"EH084", lat:52.3951888889, lon:4.71515277778, type:"FIX"},
{name:"EH085", lat:52.2982, lon:4.68363888889, type:"FIX"},
{name:"EH086", lat:52.3043, lon:4.68614166667, type:"FIX"},
{name:"EH087", lat:52.4799444444, lon:4.77215833333, type:"FIX"},
{name:"EH088", lat:52.4874416667, lon:4.91533611111, type:"FIX"},
{name:"EH090", lat:52.4672222222, lon:4.53436388889, type:"FIX"},
{name:"EH091", lat:52.4228361111, lon:4.48895833333, type:"FIX"},
{name:"EH094", lat:52.4660805556, lon:4.66133888889, type:"FIX"},
{name:"EH150", lat:52.1556277778, lon:4.78702222222, type:"FIX"},
{name:"EH151", lat:52.05, lon:4.60886388889, type:"FIX"},
{name:"EH152", lat:51.9905388889, lon:4.5358, type:"FIX"},
{name:"EH153", lat:52.0023055556, lon:4.574175, type:"FIX"},
{name:"EH154", lat:51.8710805556, lon:4.55704166667, type:"FIX"},
{name:"EH155", lat:51.9655666667, lon:4.38289166667, type:"FIX"},
{name:"EH156", lat:51.9491, lon:4.18728055556, type:"FIX"},
{name:"EH157", lat:52.0132944444, lon:4.61008055556, type:"FIX"},
{name:"EH158", lat:51.9614888889, lon:4.33408333333, type:"FIX"},
{name:"EH159", lat:51.9480055556, lon:4.41802777778, type:"FIX"},
{name:"EH161", lat:51.9243888889, lon:4.68272222222, type:"FIX"},
{name:"EH162", lat:51.6194361111, lon:4.40922777778, type:"FIX"},
{name:"EH163", lat:52.0166666667, lon:4.55290833333, type:"FIX"},
{name:"EH164", lat:51.9454194444, lon:4.14411111111, type:"FIX"},
{name:"EH165", lat:51.7670555556, lon:4.28970555556, type:"FIX"},
{name:"EH200", lat:52.2830555556, lon:6.03681666667, type:"FIX"},
{name:"EH201", lat:52.030475, lon:6.05376111111, type:"FIX"},
{name:"EH250", lat:51.8972083333, lon:4.29131944444, type:"FIX"},
{name:"EH251", lat:51.8463833333, lon:4.165175, type:"FIX"},
{name:"EH252", lat:52.0175277778, lon:4.59246666667, type:"FIX"},
{name:"EH253", lat:52.0445361111, lon:4.66055555556, type:"FIX"},
{name:"EH254", lat:51.8607722222, lon:3.90352777778, type:"FIX"},
{name:"EH255", lat:51.9979694444, lon:4.54327222222, type:"FIX"},
{name:"EH256", lat:52.0093972222, lon:4.572, type:"FIX"},
{name:"EH257", lat:51.9168666667, lon:4.34028055556, type:"FIX"},
{name:"EH258", lat:51.9835305556, lon:4.72700555556, type:"FIX"},
{name:"EH302", lat:50.8188722222, lon:5.67626111111, type:"FIX"},
{name:"EH303", lat:50.84085, lon:5.69842222222, type:"FIX"},
{name:"EH305", lat:51.0163194444, lon:6.00020555556, type:"FIX"},
{name:"EH306", lat:51.0104055556, lon:5.87024166667, type:"FIX"},
{name:"EH307", lat:51.0772777778, lon:5.93829444444, type:"FIX"},
{name:"EH309", lat:50.8371111111, lon:5.85363055556, type:"FIX"},
{name:"EH310", lat:50.8659916667, lon:5.72380555556, type:"FIX"},
{name:"EH311", lat:50.9781416667, lon:5.83743333333, type:"FIX"},
{name:"EH315", lat:50.9375833333, lon:5.80838888889, type:"FIX"},
{name:"EH316", lat:50.9486777778, lon:5.85736111111, type:"FIX"},
{name:"EH317", lat:50.9579444444, lon:5.89835833333, type:"FIX"},
{name:"EH318", lat:50.784675, lon:5.96550555556, type:"FIX"},
{name:"EH319", lat:50.8140194444, lon:5.94621666667, type:"FIX"},
{name:"EH320", lat:50.8891416667, lon:5.74720555556, type:"FIX"},
{name:"EH321", lat:50.86135, lon:5.71911666667, type:"FIX"},
{name:"EH322", lat:50.9276472222, lon:5.82663333333, type:"FIX"},
{name:"EH323", lat:50.804575, lon:5.99121944444, type:"FIX"},
{name:"EH373", lat:51.3949472222, lon:5.73130555556, type:"FIX"},
{name:"EH374", lat:51.3434472222, lon:5.6832, type:"FIX"},
{name:"EH375", lat:51.2657305556, lon:5.56019444444, type:"FIX"},
{name:"EH376", lat:51.3564166667, lon:5.64233611111, type:"FIX"},
{name:"EH377", lat:51.3573416667, lon:5.87894722222, type:"FIX"},
{name:"EH400", lat:52.9299055556, lon:4.787775, type:"FIX"},
{name:"EH401", lat:52.9445, lon:4.8585, type:"FIX"},
{name:"EH402", lat:52.9854666667, lon:4.74764722222, type:"FIX"},
{name:"EH403", lat:52.9888416667, lon:4.71596666667, type:"FIX"},
{name:"EH404", lat:52.9939638889, lon:4.66773888889, type:"FIX"},
{name:"EH405", lat:53.0306333333, lon:4.73723055556, type:"FIX"},
{name:"EH406", lat:52.9025972222, lon:4.68345, type:"FIX"},
{name:"EH407", lat:52.9285472222, lon:4.691325, type:"FIX"},
{name:"EH408", lat:52.9324611111, lon:4.82882777778, type:"FIX"},
{name:"EH409", lat:52.5907027778, lon:5.01758611111, type:"FIX"},
{name:"EH410", lat:52.4681111111, lon:5.02473888889, type:"FIX"},
{name:"EH511", lat:53.0477972222, lon:6.42963333333, type:"FIX"},
{name:"EH512", lat:53.1874361111, lon:6.72294722222, type:"FIX"},
{name:"EH513", lat:53.1904444444, lon:6.71887222222, type:"FIX"},
{name:"EH515", lat:53.1642416667, lon:6.67361111111, type:"FIX"},
{name:"EH516", lat:52.9858805556, lon:6.79070555556, type:"FIX"},
{name:"EH517", lat:53.2129722222, lon:6.76326666667, type:"FIX"},
{name:"EH521", lat:52.7839888889, lon:6.25665555556, type:"FIX"},
{name:"EH522", lat:52.3815916667, lon:6.25176388889, type:"FIX"},
{name:"EH523", lat:52.0094888889, lon:6.24731944444, type:"FIX"},
{name:"EH527", lat:52.9585027778, lon:6.44391111111, type:"FIX"},
{name:"EH528", lat:52.8695611111, lon:6.09624166667, type:"FIX"},
{name:"EH529", lat:53.0868027778, lon:6.50959444444, type:"FIX"},
{name:"EH530", lat:53.0768888889, lon:6.40559444444, type:"FIX"},
{name:"EH532", lat:53.0453944444, lon:6.46362222222, type:"FIX"},
{name:"EH533", lat:52.9931, lon:6.66805555556, type:"FIX"},
{name:"EH535", lat:53.0818555556, lon:6.779375, type:"FIX"},
{name:"EH536", lat:53.1863416667, lon:6.91118611111, type:"FIX"},
{name:"EH538", lat:52.9659916667, lon:6.71370277778, type:"FIX"},
{name:"EH539", lat:53.0279777778, lon:6.76147777778, type:"FIX"},
{name:"EH540", lat:51.2966777778, lon:5.92278333333, type:"FIX"},
{name:"EH541", lat:51.2699138889, lon:5.75583888889, type:"FIX"},
{name:"EH544", lat:51.3380166667, lon:5.64563055556, type:"FIX"},
{name:"EH545", lat:51.3417166667, lon:5.65675, type:"FIX"},
{name:"EH550", lat:51.5034444444, lon:5.43435555556, type:"FIX"},
{name:"EH552", lat:51.4948277778, lon:5.5744, type:"FIX"},
{name:"EH555", lat:51.6480333333, lon:5.07314166667, type:"FIX"},
{name:"EH556", lat:51.5026527778, lon:5.19297777778, type:"FIX"},
{name:"EH557", lat:51.4091111111, lon:5.30906388889, type:"FIX"},
{name:"EH558", lat:51.4080333333, lon:5.32737777778, type:"FIX"},
{name:"EH560", lat:51.3534444444, lon:5.266425, type:"FIX"},
{name:"EH561", lat:51.3187583333, lon:5.17770555556, type:"FIX"},
{name:"EH562", lat:51.3683222222, lon:5.54921111111, type:"FIX"},
{name:"EH563", lat:51.3680166667, lon:5.65895, type:"FIX"},
{name:"EH566", lat:51.5630055556, lon:5.34329166667, type:"FIX"},
{name:"EH567", lat:51.5399777778, lon:5.47544166667, type:"FIX"},
{name:"EH568", lat:51.564125, lon:5.50265277778, type:"FIX"},
{name:"EH569", lat:51.5994666667, lon:5.50758055556, type:"FIX"},
{name:"EH570", lat:51.3681138889, lon:5.62787222222, type:"FIX"},
{name:"EH571", lat:51.5791166667, lon:5.55394166667, type:"FIX"},
{name:"EH573", lat:51.3604888889, lon:5.27429166667, type:"FIX"},
{name:"EH574", lat:51.3331861111, lon:5.24386666667, type:"FIX"},
{name:"EH575", lat:51.48385, lon:5.65521111111, type:"FIX"},
{name:"EH576", lat:51.3684888889, lon:5.46335555556, type:"FIX"},
{name:"EH577", lat:51.3949777778, lon:5.507275, type:"FIX"},
{name:"EH580", lat:51.3943861111, lon:5.31212777778, type:"FIX"},
{name:"EH583", lat:51.3888916667, lon:5.30599166667, type:"FIX"},
{name:"EH584", lat:51.5114305556, lon:5.44331666667, type:"FIX"},
{name:"EH600", lat:52.5954194444, lon:5.18016111111, type:"FIX"},
{name:"EH601", lat:52.6881638889, lon:4.84913888889, type:"FIX"},
{name:"EH602", lat:52.6882638889, lon:4.68007777778, type:"FIX"},
{name:"EH603", lat:52.688125, lon:4.51337222222, type:"FIX"},
{name:"EH604", lat:52.5894194444, lon:4.83725833333, type:"FIX"},
{name:"EH605", lat:52.0663722222, lon:4.11604166667, type:"FIX"},
{name:"EH606", lat:52.4224416667, lon:4.38791388889, type:"FIX"},
{name:"EH607", lat:52.5838833333, lon:4.64688611111, type:"FIX"},
{name:"EH608", lat:52.539425, lon:4.72814166667, type:"FIX"},
{name:"EH609", lat:52.2345722222, lon:4.59575, type:"FIX"},
{name:"EH610", lat:52.2053472222, lon:4.22158055556, type:"FIX"},
{name:"EH611", lat:52.3315166667, lon:4.6829, type:"FIX"},
{name:"EH612", lat:52.3281527778, lon:4.375925, type:"FIX"},
{name:"EH614", lat:52.2077638889, lon:4.52649166667, type:"FIX"},
{name:"EH616", lat:52.2537277778, lon:4.64535555556, type:"FIX"},
{name:"EH621", lat:52.4627027778, lon:4.72109722222, type:"FIX"},
{name:"EH622", lat:52.4267277778, lon:4.7178, type:"FIX"},
{name:"EH624", lat:52.3526666667, lon:4.54869444444, type:"FIX"},
{name:"EH625", lat:52.4859972222, lon:4.754275, type:"FIX"},
{name:"EH626", lat:52.3979416667, lon:4.74592777778, type:"FIX"},
{name:"EH630", lat:52.4338138889, lon:4.74945555556, type:"FIX"},
{name:"EH632", lat:52.2034444444, lon:4.72831111111, type:"FIX"},
{name:"EH633", lat:52.2393611111, lon:4.73158888889, type:"FIX"},
{name:"EH634", lat:52.1362777778, lon:4.76308888889, type:"FIX"},
{name:"EH635", lat:52.2243555556, lon:4.77120555556, type:"FIX"},
{name:"EH636", lat:52.1884638889, lon:4.76789722222, type:"FIX"},
{name:"EH637", lat:52.3733944444, lon:4.78500277778, type:"FIX"},
{name:"EH638", lat:52.2444611111, lon:4.73206111111, type:"FIX"},
{name:"EH639", lat:52.3239444444, lon:4.96400277778, type:"FIX"},
{name:"EH640", lat:52.3220166667, lon:4.90537222222, type:"FIX"},
{name:"EH641", lat:52.3543611111, lon:4.43740555556, type:"FIX"},
{name:"EH642", lat:52.3075805556, lon:4.58100277778, type:"FIX"},
{name:"EH643", lat:52.3030611111, lon:4.49988333333, type:"FIX"},
{name:"EH644", lat:52.519725, lon:4.62801111111, type:"FIX"},
{name:"EH645", lat:52.5124638889, lon:4.72812777778, type:"FIX"},
{name:"EH646", lat:52.462675, lon:4.72188888889, type:"FIX"},
{name:"EH647", lat:52.3824277778, lon:4.71186111111, type:"FIX"},
{name:"EH648", lat:52.5310166667, lon:4.98924722222, type:"FIX"},
{name:"EH649", lat:52.4677666667, lon:5.02424166667, type:"FIX"},
{name:"EH650", lat:52.4303277778, lon:4.970175, type:"FIX"},
{name:"EH651", lat:52.3640416667, lon:4.87475833333, type:"FIX"},
{name:"EH652", lat:52.3290333333, lon:4.82452777778, type:"FIX"},
{name:"EH654", lat:52.3283666667, lon:4.85059444444, type:"FIX"},
{name:"EH655", lat:52.3306222222, lon:4.93371666667, type:"FIX"},
{name:"EH656", lat:52.3272722222, lon:4.96359722222, type:"FIX"},
{name:"EH657", lat:52.133, lon:4.59213055556, type:"FIX"},
{name:"EH658", lat:52.2044888889, lon:4.71346388889, type:"FIX"},
{name:"EH659", lat:52.1553027778, lon:4.69948888889, type:"FIX"},
{name:"EH660", lat:52.2817194444, lon:4.73547222222, type:"FIX"},
{name:"EH661", lat:52.3911138889, lon:4.91367777778, type:"FIX"},
{name:"EH662", lat:52.3145638889, lon:4.70841111111, type:"FIX"},
{name:"EH700", lat:52.2558638889, lon:6.51226666667, type:"FIX"},
{name:"EH701", lat:52.40455, lon:6.84477777778, type:"FIX"},
{name:"EH702", lat:52.2614194444, lon:6.67555, type:"FIX"},
{name:"EH703", lat:52.2378916667, lon:6.80093333333, type:"FIX"},
{name:"EH704", lat:51.9246833333, lon:6.53114166667, type:"FIX"},
{name:"EH705", lat:52.0318027778, lon:6.6888, type:"FIX"},
{name:"EH728", lat:52.2363888889, lon:6.77111111111, type:"FIX"},
{name:"EH729", lat:52.3265416667, lon:6.99784444444, type:"FIX"},
{name:"EH740", lat:53.3066555556, lon:6.72939166667, type:"FIX"},
{name:"EH741", lat:53.2542111111, lon:6.79777222222, type:"FIX"},
{name:"EH742", lat:53.2079305556, lon:6.76659722222, type:"FIX"},
{name:"EKDAR", lat:53.8234138889, lon:2.94387777778, type:"FIX"},
{name:"EKDEN", lat:54.5166666667, lon:6.03333333333, type:"FIX"},
{name:"ELBEK", lat:52.9425555556, lon:6.71924444444, type:"FIX"},
{name:"GEMTI", lat:51.5466388889, lon:5.646175, type:"FIX"},
{name:"GETSI", lat:53.2367416667, lon:6.49289166667, type:"FIX"},
{name:"GIKOV", lat:53.1097333333, lon:4.53677222222, type:"FIX"},
{name:"GILTI", lat:51.5702805556, lon:2.05504722222, type:"FIX"},
{name:"GIROS", lat:53.5008722222, lon:3.64639444444, type:"FIX"},
{name:"GOLOR", lat:53.2178222222, lon:4.4137, type:"FIX"},
{name:"GULTO", lat:53.8333333333, lon:6.28333333333, type:"FIX"},
{name:"IBALO", lat:53.2790305556, lon:3.45532222222, type:"FIX"},
{name:"INDEV", lat:53.2889277778, lon:3.05870555556, type:"FIX"},
{name:"IPVIS", lat:53.1551111111, lon:3.89985833333, type:"FIX"},
{name:"IRDUK", lat:53.5573666667, lon:2.99357777778, type:"FIX"},
{name:"KEKIX", lat:52.7824527778, lon:5.36149166667, type:"FIX"},
{name:"KEROR", lat:53.1380833333, lon:3.33508611111, type:"FIX"},
{name:"KOLAG", lat:53.0434722222, lon:3.25488055556, type:"FIX"},
{name:"KOLAV", lat:53.0271916667, lon:4.35, type:"FIX"},
{name:"KONEP", lat:53.0539055556, lon:3.701175, type:"FIX"},
{name:"KONOM", lat:53.6327194444, lon:5.49532222222, type:"FIX"},
{name:"KOPAD", lat:53.1293916667, lon:3.10408888889, type:"FIX"},
{name:"KUSON", lat:53.1946222222, lon:3.08557222222, type:"FIX"},
{name:"LAMSO", lat:52.7328972222, lon:2.99435555556, type:"FIX"},
{name:"LANSU", lat:52.4140138889, lon:4.94665277778, type:"FIX"},
{name:"LARBO", lat:53.1660222222, lon:6.67739722222, type:"FIX"},
{name:"LASEX", lat:52.865025, lon:4.0, type:"FIX"},
{name:"LERGO", lat:52.8847666667, lon:4.35, type:"FIX"},
{name:"LUVOR", lat:52.8065138889, lon:3.05572777778, type:"FIX"},
{name:"MEBOT", lat:52.7550555556, lon:3.75615277778, type:"FIX"},
{name:"MIMVA", lat:53.1008916667, lon:3.30350833333, type:"FIX"},
{name:"MITSA", lat:51.2855166667, lon:5.35272777778, type:"FIX"},
{name:"MOLIX", lat:52.822, lon:3.06866944444, type:"FIX"},
{name:"NAKON", lat:52.7793555556, lon:4.42463333333, type:"FIX"},
{name:"NARIX", lat:52.6527388889, lon:4.97613333333, type:"FIX"},
{name:"NEKAS", lat:52.6885833333, lon:4.18457777778, type:"FIX"},
{name:"NEXAR", lat:52.7824222222, lon:4.72023611111, type:"FIX"},
{name:"NIDOP", lat:52.7593083333, lon:4.883775, type:"FIX"},
{name:"NIREX", lat:52.2903194444, lon:3.81616944444, type:"FIX"},
{name:"NIRSI", lat:52.5838777778, lon:4.51337222222, type:"FIX"},
{name:"NOPSU", lat:52.5869361111, lon:4.95080277778, type:"FIX"},
{name:"OBILO", lat:52.0, lon:3.0, type:"FIX"},
{name:"OKIDU", lat:51.7894, lon:4.85, type:"FIX"},
{name:"OLGAX", lat:52.1728888889, lon:4.72552222222, type:"FIX"},
{name:"OMASA", lat:51.9575, lon:4.02472222222, type:"FIX"},
{name:"OMORU", lat:52.3528916667, lon:5.27226666667, type:"FIX"},
{name:"OSTIR", lat:52.901, lon:6.21851944444, type:"FIX"},
{name:"PENIM", lat:53.4920472222, lon:5.94035, type:"FIX"},
{name:"PEROR", lat:53.0351194444, lon:5.02955277778, type:"FIX"},
{name:"PEVOS", lat:52.4931972222, lon:4.72389444444, type:"FIX"},
{name:"PILEV", lat:53.3, lon:5.58333333333, type:"FIX"},
{name:"PODOD", lat:53.5061944444, lon:5.60051944444, type:"FIX"},
{name:"RAVLO", lat:52.9169027778, lon:3.14819722222, type:"FIX"},
{name:"REDFA", lat:52.1145861111, lon:2.48794722222, type:"FIX"},
{name:"REGNA", lat:52.1525583333, lon:3.74937777778, type:"FIX"},
{name:"RENVU", lat:52.4992166667, lon:3.83202222222, type:"FIX"},
{name:"RIMBU", lat:51.7062777778, lon:2.16211388889, type:"FIX"},
{name:"RINIS", lat:51.9082388889, lon:2.32245, type:"FIX"},
{name:"ROBIS", lat:52.4686111111, lon:6.46722222222, type:"FIX"},
{name:"RODIR", lat:53.4376722222, lon:5.0, type:"FIX"},
{name:"ROLDU", lat:52.8893555556, lon:6.19885833333, type:"FIX"},
{name:"RONSA", lat:51.504075, lon:4.44178888889, type:"FIX"},
{name:"RUSAL", lat:51.3807555556, lon:5.13478055556, type:"FIX"},
{name:"SITSU", lat:53.4003944444, lon:4.68468888889, type:"FIX"},
{name:"SOKSI", lat:52.2373777778, lon:4.36443333333, type:"FIX"},
{name:"SOMEL", lat:51.9407083333, lon:4.08911944444, type:"FIX"},
{name:"SOMVA", lat:52.3072222222, lon:2.64401111111, type:"FIX"},
{name:"SONSA", lat:52.3308944444, lon:6.74558611111, type:"FIX"},
{name:"SOTAP", lat:53.5820333333, lon:4.89253333333, type:"FIX"},
{name:"TEVKA", lat:53.7256166667, lon:4.76666666667, type:"FIX"},
{name:"TILVU", lat:51.5179, lon:5.10377222222, type:"FIX"},
{name:"TIREP", lat:54.0294027778, lon:4.71670555556, type:"FIX"},
{name:"TOLKO", lat:53.1189361111, lon:6.36258055556, type:"FIX"},
{name:"TORGA", lat:52.5985638889, lon:5.20319722222, type:"FIX"},
{name:"ULPAT", lat:52.47, lon:4.595, type:"FIX"},
{name:"ULSED", lat:53.7497111111, lon:5.70999166667, type:"FIX"},
{name:"UNORA", lat:54.0495611111, lon:5.43781944444, type:"FIX"},
{name:"UNVAR", lat:54.4998388889, lon:5.00796666667, type:"FIX"},
{name:"VEDAM", lat:52.9967472222, lon:6.89567222222, type:"FIX"},
{name:"VELED", lat:51.3901305556, lon:5.36704166667, type:"FIX"},
{name:"VOLLA", lat:52.3141805556, lon:4.1562, type:"FIX"},
{name:"XAMAN", lat:51.7847583333, lon:2.22422777778, type:"FIX"}
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
        force: 200,
        nodeSize: 20,
        nodeLabels: true,
        linkWidth: 2,
        canvas: false
      }
    };
  },
  methods: {
    update_node_css_class: function(node){ 
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
node._cssClass = "defect_node"
node._labelClass = "defect_node_label";
break;
}      
    },
    changeIcon: function(event, node) {
      node.status = (node.status + 1) % node_status.MAX
      this.update_node_css_class(node)
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
        if (this.nodes[i].status === node_status.ACTIVE) {
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
        this.update_node_css_class(node)
        
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

        // if (!("selected" in link)) {
        //   link.selected = false;
        // }

        var source_node = this.nodes.find(obj => {
          return obj.id === link.sid;
        });

        var target_node = this.nodes.find(obj => {
          return obj.id === link.tid;
        });

        if (source_node.status !== node_status.ACTIVE || target_node.status !== node_status.ACTIVE) {
          this.links.splice(index, 1);
        }
      }
      return this.links;
    }
  }
};
</script>

<style>
.ui {
  text-align: left;
}
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

.active_node {
  stroke: #21aa8c;
  stroke-width: 2;
  transition: fill 0.5s ease;
  fill: #21aa8c;
}

.active_node_label {
  /* stroke: #21aa8c; */
  /* stroke-width: 0; */
  transition: fill 0.5s ease;
  fill: #21aa8c;
}

.idle_node {
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 1;
  transition: fill 0.5s ease;
  fill: rgba(255, 255, 255, 0.2);
}

.idle_node_label {
  
  fill: red
}

.defect_node {
  stroke: rgba(255, 0, 0, 0.7);
  stroke-width: 1;
  transition: fill 0.5s ease;
  fill: #f0000f;
}

.defect_node_label {
  stroke: #21aa8c;
  stroke-width: 2;
  transition: fill 0.5s ease;
  fill: #21aa8c;
}

.node-label {
  fill: #ffffff;
}
</style>
