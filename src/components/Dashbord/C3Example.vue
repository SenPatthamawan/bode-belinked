<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
          <v-row>
              <v-col cols="8" ><C3Chart :chartData="chartData1" v-if="chartData1"></C3Chart></v-col>
              <v-col cols="4" ><C3Chart :chartData="chartData2" v-if="chartData2"></C3Chart></v-col>
          </v-row>
          <v-row>
              <v-col cols="8" ><C3Chart :chartData="chartData3" v-if="chartData3"></C3Chart></v-col>
              <v-col cols="4" ><C3Chart :chartData="chartData4" v-if="chartData4"></C3Chart></v-col>
          </v-row>
          <v-row>
              <v-col cols="8" ><C3Chart :chartData="chartData6" v-if="chartData6"></C3Chart></v-col>
              <v-col cols="4" ><C3Chart :chartData="chartData7" v-if="chartData7"></C3Chart></v-col>
          </v-row>
          <v-row>
              <v-col cols="11" ><C3Chart :chartData="chartData5" v-if="chartData5"></C3Chart></v-col>
          </v-row>
          <v-row>
              <v-col cols="11" ><C3Chart :chartData="chartData8" v-if="chartData8"></C3Chart></v-col>
          </v-row>
     </div>
    </v-main>
  </div>
</template>
<style>
  @import '../../assets/c3.min.css';
</style>
<script>
import adminLeftMenu from '../Sidebar.vue' // เมนู
import C3Chart from './C3Chart.vue'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    C3Chart
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  data () {
    return {
      session: this.$session.getAll(),
      chartData1: null,
      chartData2: null,
      chartData3: null,
      chartData4: null,
      chartData5: null,
      chartData6: null,
      chartData7: null,
      chartData8: null
    }
  },
  async mounted () {
    this.dataReady = false
    this.chartData1 = {
      data: {
        columns: [
          ['ซ่อมทั่วไป', 30, 200, 100, 400, 150, 250],
          ['เช็คระยะ', 50, 20, 10, 40, 15, 25]
        ]
      }
    }

    this.chartData2 = {
      data: {
        columns: [
          ['ซ่อมทั่วไป', 30],
          ['เช็คระยะ', 120]
        ],
        type: 'donut'
      },
      donut: {
        title: 'ประเภทบริการ'
      }
    }

    this.chartData3 = {
      data: {
        columns: [
          ['ซ่อมทั่วไป', 30, 200, 100, 400, 150, 250],
          ['เช็คระยะ', 50, 20, 10, 40, 15, 25]
        ],
        type: 'bar'
      }
    }

    this.chartData4 = {
      data: {
        columns: [
          ['ซ่อมทั่วไป', 30],
          ['เช็คระยะ', 120]
        ],
        type: 'pie'
      },
      pie: {
        title: 'ประเภทบริการ'
      }
    }

    this.chartData5 = {
      data: {
        x: 'x',
        columns: [
          ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 130, 340, 200, 500, 250, 350]
        ]
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          }
        }
      }
    }

    this.chartData6 = {
      data: {
        columns: [
          ['ซ่อมทั่วไป', 30, 200, 100, 400, 150, 250],
          ['เช็คระยะ', 50, 20, 10, 40, 15, 25]
        ],
        type: 'bar',
        groups: [
          ['ซ่อมทั่วไป', 'เช็คระยะ']
        ]
      }
    }

    this.chartData7 = {
      data: {
        columns: [
          ['data', 91.4]
        ],
        type: 'gauge'
      },
      color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
        threshold: {
          values: [30, 60, 90, 100]
        }
      },
      size: {
        height: 220
      }
    }

    this.chartData8 = {
      data: {
        x: 'x',
        columns: [
          ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
          ['ซ่อมทั่วไป', 30, 200, 100, 400, 150, 250],
          ['เช็คระยะ', 130, 340, 200, 300, 550, 350]
        ],
        axes: {
          ซ่อมทั่วไป: 'y',
          เช็คระยะ: 'y2'
        }
      },
      axis: {
        y: {
          label: 'ซ่อมทั่วไป'
        },
        y2: {
          show: true,
          label: 'เช็คระยะ'
        },
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          }
        }
      }
    }
  },
  methods: {
  }
}
</script>
