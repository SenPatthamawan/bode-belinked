<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <v-row v-if="dateRange">
            <v-col cols="12">
                <div style="display: flex">
                <date-range-picker
                    ref="picker"
                    :locale-data="{ firstDay: 1, format: 'yyyy-mm-dd' }"
                    v-model="dateRange"
                />
                <v-btn
                    small class="ml-5 mt-2" color="#173053" dark
                    @click="searchData()"
                >
                    ค้นหา
                </v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="8" ><C3Chart :chartData="chartTimeSeries" v-if="chartTimeSeries"></C3Chart></v-col>
            <v-col cols="4" ><C3Chart :chartData="chartBranch" v-if="chartBranch"></C3Chart></v-col>
        </v-row>
     </div>
    </v-main>
  </div>
</template>
<style>
  @import '../../assets/c3.min.css';
</style>
<script>
import axios from 'axios'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import C3Chart from './C3Chart.vue'
import moment from 'moment-timezone'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    DateRangePicker,
    C3Chart
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  data () {
    return {
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'รายงาน',
          disabled: false,
          href: '/Dashbord/Report'
        }
      ],
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      startDate: null,
      endDate: null,
      dateRange: null,
      dataitem: [],
      chartTimeSeries: null,
      chartBranch: null,
      timeXSeries: [],
      dateDiff: 0
    }
  },
  async mounted () {
    this.startDate = new Date()
    this.endDate = new Date()
    this.dateRange = { startDate: this.startDate, endDate: this.endDate }
    this.searchData()
  },
  methods: {
    async searchData () {
      this.startDate = this.momenDate_1(this.dateRange.startDate)
      this.endDate = this.momenDate_1(this.dateRange.endDate)
      await this.createTimeSeries()
      this.getData1()
    },
    createTimeSeries () {
      let start = moment(this.startDate)
      let end = moment(this.endDate)
      let duration = moment.duration(end.diff(start))
      this.dateDiff = duration.asDays()
      for (let i = 0; i <= this.dateDiff; i++) {
        start = moment(this.startDate).add(i, 'days')
        this.timeXSeries.push(start.format('YYYY-MM-DD').toString())
      }
    },
    async getData1 () {
      console.log(this.startDate)
      console.log(this.endDate)
      await axios.get(
        this.DNS_IP + '/job_log/getDashbord_total?startDate=' + this.startDate + '&endDate=' + this.endDate + '&shopId=' + this.shopId
      ).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          let chartData = []
          let branchList = []
          chartData['x'] = this.timeXSeries
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (typeof chartData[d.masBranchName] === 'undefined') {
              branchList.push(d.masBranchName)
              chartData[d.masBranchName] = Array(this.dateDiff + 1).fill(0)
            }
            const index = this.timeXSeries.indexOf(d.CREATE_DATE)
            chartData[d.masBranchName][index] = d.totalJob
            this.dataitem.push(d)
          }
          let columns = []
          columns[0] = ['x', ...chartData['x']]
          for (let i = 0; i < branchList.length; i++) {
            columns[i + 1] = [branchList[i], ...chartData[branchList[i]]]
          }

          this.chartTimeSeries = {
            data: {
              x: 'x',
              columns: columns,
              order: 'desc'
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d'
                }
              },
              y: {
                label: 'จำนวนรับรถ'
              }
            },
            size: {
              height: 400
            }
          }

          this.chartBranch = {
            data: {
              x: 'x',
              columns: columns,
              type: 'donut'
            },
            donut: {
              title: 'สาขา',
              label: {
                format: function (value, ratio, id) {
                  return value
                }
              }
            }
          }
          console.log(this.chartBranch)
        }
      }).catch((error) => {
        console.log('error function addDataGlobal : ', error)
      })
    }
  }
}
</script>
