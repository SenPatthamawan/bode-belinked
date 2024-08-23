<template lang="">
    <div >
      <v-card class="p-3" color="#f2f2f2" v-if="chartItem.length > 0">
        <v-row  v-if="chartItem.length > 0">
        <v-col :cols="resCol">
          <h3  style="margin-bottom: 0px;">Working</h3>
          <h6> ประเภทบริการ / ขั้นตอนการทำงาน</h6>
          <!-- <v-card
                class="pa-md-4 mx-lg-auto "
                width="500"
                height="100"
                elevation="8"
                >
                 <v-row>
                   <v-col cols="2" md="2">
                     <v-icon
                     style="font-size:70px !important; margin:3px -10px 10px 55px;"
                    x-large
                    color="blue"
                  >mdi-car-wash</v-icon>
                   </v-col>
                   <v-col cols="10" md="10">
                    <v-card-title class="justify-center" ><h3>กำลังซ่อม</h3></v-card-title>
                      <v-card-text>
                        <v-row
                          align="center"
                          class="justify-center"
                        >
                      <h5></h5>
                        </v-row>
                     </v-card-text>
                   </v-col>
                 </v-row>
              </v-card> -->
        </v-col>
      </v-row>
      <v-row  v-if="chartItem.length > 0">
        <v-col  v-for="(item , index) in chartItem" :key="index">
          <v-card
        class="pa-2"
        max-width="400"
        elevation="8"
      >
      <p class="text-center">{{chartName[index]}}</p>
      <C3Chart :chartData="chartItem[index]" v-if="chartItem[index]"></C3Chart>
      </v-card>
       </v-col>
      </v-row>
      </v-card>
      <v-dialog
      v-model="dialog"
      max-width="900"
      class="pa-6"
    >
      <v-card elevation="8" class="pa-4">
        <div class="text-right pa-0">
          <v-btn
          small
          color="#E0E0E0"
          @click="(dialog = false)"
        >
          <v-icon color="#173053">mdi-close</v-icon>
        </v-btn>
        </div>
          <h3 class="text-center">รายละเอียดงานซ่อม</h3>
              <v-card height="4"  color="green"></v-card>
            <v-data-table
            :headers="headers"
            :items="desserts"
            :items-per-page="4"
            class="elevation-1"
          ></v-data-table>
      </v-card>
    </v-dialog>
    </div>
</template>
<script>
import adminLeftMenu from '../Sidebar.vue' // เมนู
import axios from 'axios'
import C3Chart from './C3Chart.vue'
export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    C3Chart

  },
  computed: {
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '12'
        case 'sm': return '12'
        case 'md': return '6'
        case 'lg': return '4'
        case 'xl': return '4'
      }
      console.log('this.$vuetify.breakpoint.name', this.$vuetify.breakpoint.name)
    }
  },
  data () {
    return {
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      flowNameitem: [],
      chartItem: [],
      chartBranch: null,
      chartName: [],
      headers: [],
      desserts: [],
      dessertsItem: [],
      dialog: false,
      startDate: '',
      endDate: ''
    }
  },
  async mounted () {
    // await this.getBranch()
  },
  methods: {
    async Ifshopcategory () {
      if (this.session.data.category === 'ธุรกิจรถยนต์') {
        this.headers = [
          { text: 'ชื่อ', value: 'Name' },
          { text: 'เลขทะเบียน', value: 'carNo' },
          { text: 'วันที่รับรถ', value: 'CREATE_DATE' },
          { text: 'วันที่ส่งรถ', value: 'endDate' },
          { text: 'ประเภทบริการ', value: 'flowName' },
          { text: 'จำนวนวันที่ซ่อม', value: 'totalDateDiff' },
          { text: 'ผู้รับผิดชอบ', value: 'empStep' }
        ]
      } else {
        this.headers = [
          { text: 'ชื่อ', value: 'Name' },
          { text: 'เบอร์โทร', value: 'phoneNumber' },
          { text: 'วันที่เริ่มงาน', value: 'CREATE_DATE' },
          { text: 'วันที่เสร็จงาน', value: 'endDate' },
          { text: 'ประเภทบริการ', value: 'flowName' },
          { text: 'ผู้รับผิดชอบ', value: 'empStep' }
        ]
      }
    },
    async getFlow (masBranchName, dateRange) {
      await this.getDataflow()
      this.startDate = this.momenDate_1(dateRange.startDate)
      this.endDate = this.momenDate_1(dateRange.endDate)
      if (masBranchName) {
        await axios.get(this.DNS_IP + '/job_log/getChartflowByBranch?startDate=' + this.startDate + '&endDate=' + this.endDate + '&shopId=' + this.shopId + '&masBranchName=' + masBranchName)
          .then((response) => {
            let rs = response.data
            this.dessertsItem = rs
            // console.log('rs', rs)
            if (rs.length > 0) {
              this.genChart(rs)
              this.Ifshopcategory()
            }
          })
          .catch((error) => {
            console.log('error function addDataGlobal : ', error)
          })
      } else {
        await axios.get(this.DNS_IP + '/job_log/getChartflowNoBranch?startDate=' + this.startDate + '&endDate=' + this.endDate + '&shopId=' + this.shopId)
          .then((response) => {
            let rs = response.data
            this.dessertsItem = rs
            // console.log('rs', rs)
            if (rs.length > 0) {
              this.genChart(rs)
              this.Ifshopcategory()
            }
          })
          .catch((error) => {
            console.log('error function addDataGlobal : ', error)
          })
      }

      // console.log('this.statusitem', this.statusitem)
    },
    async getDataflow () {
      this.flowNameitem = []
      this.chartItem = []
      this.chartBranch = null
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then((response) => {
        let rs = response.data
        if (rs.length > 0) {
          this.flowNameitem = rs.map(item => item.flowName)
        }
        // console.log('flowname', this.flowNameitem)
      })
    },
    async genChart (item) {
      let FullChart = []
      this.chartName = []
      let chartStep = []
      let chartValue = []
      const reducer = (previousValue, currentValue) => previousValue + currentValue
      for (let i = 0; i < this.flowNameitem.length; i++) {
        let a = []
        let d = this.flowNameitem[i]
        if (item.filter(row => row.flowName === d).map(item => item.flowName)[0] !== undefined) {
          this.chartName.push(item.filter(row => row.flowName === d).map(item => item.flowName)[0])
        }
        // console.log('charTNsame', this.chartName)
        chartStep.push(Array.from(new Set(item.filter(row => row.flowName === d).map(item => item.stepTitle))))
        chartStep.forEach((v, k) => {
          let dt = []
          v.forEach((v1, k1) => {
            let dd = item.filter(row => row.flowName === d).filter(row1 => row1.stepTitle === v1).map(item => item.Job)
            // console.log('dd', dd.length)
            if (dd.length > 1) {
              dt.push(dd.reduce(reducer))
            } else {
              dt.push(dd)
            }
          })
          // console.log('dt', dt)
          a = dt
        })
        chartValue.push(a)
      }
      // console.log('chartStep', chartStep)
      // console.log('chartValue', chartValue)
      let Totaljob = []
      chartStep.forEach((element, key) => {
        let dtitem = []
        let Totals = []
        chartValue[key].forEach((v, k) => {
          chartStep[key].forEach((v2, k2) => {
            if (k === k2) {
              let item = [
                v2,
                v
              ]
              if (v.length > 0) {
                Totals.push(v[0])
              } else {
                Totals.push(v)
              }
              // console.log('Value2', v)
              dtitem.push(item)
            }
          })
        })
        console.log('Totals', Totals)
        if (Totals.length > 0) {
          Totaljob.push(Totals.reduce(reducer))
          FullChart.push(dtitem)
        }
      })
      let _this = this
      for (let a = 0; a < FullChart.length; a++) {
        let d = FullChart[a]
        if (d.length > 0) {
          let chartBranch = {
            data: {
              columns: d,
              type: 'donut',
              onclick: function (d, i) { _this.genDataTable(d, chartBranch) }
            },
            donut: {
              title: `( ${Totaljob[a]} )`,
              label: {
                format: function (value, ratio, id) {
                  return value
                }
              }
            },
            datafilter: this.chartName[a]
          }
          this.chartItem.push(chartBranch)
        }
      }
      // console.log('this.chartItem.', this.chartItem)
      this.genDataTable()
    },
    async genDataTable (dataFilter, i) {
      console.log('datafilter', dataFilter, i)
      let Tableitem = []
      let dataitem = []
      let datafilter = this.dessertsItem
      await axios.get(this.DNS_IP + '/job_log/select_by_DataTable_TotalJob?startDate=' + this.startDate + '&endDate=' + this.endDate + '&shopId=' + this.shopId).then(response => {
        let rs = response.data
        dataitem = rs
        // console.log('rs2', rs)
      })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
      datafilter.forEach((element, key) => {
        let dt = {}
        dt.Name = dataitem.filter(item => item.jobId === element.jobId).filter(item2 => item2.fieldName === 'ชื่อ').map(row => row.fieldValue)[0]
        dt.carNo = dataitem.filter(item => item.jobId === element.jobId).filter(item2 => item2.fieldName === 'เลขทะเบียน').map(row => row.fieldValue)[0]
        dt.phoneNumber = dataitem.filter(item => item.jobId === element.jobId).filter(item2 => item2.fieldName === 'เบอร์โทร').map(row => row.fieldValue)[0]
        dt.endDate = this.format_dateNotime(dataitem.filter(item => item.jobId === element.jobId).map(row => row.endDate)[0])
        dt.flowName = dataitem.filter(item => item.jobId === element.jobId).map(row => row.flowName)[0]
        dt.dateTotal = dataitem.filter(item => item.jobId === element.jobId).map(row => row.totalDateDiff)[0]
        dt.stepTitle = dataitem.filter(item => item.jobId === element.jobId).map(row => row.stepTitle)[0]
        dt.totalPrice = dataitem.filter(item => item.jobId === element.jobId).map(row => row.totalPrice)[0]
        dt.RECORD_STATUS = dataitem.filter(item => item.jobId === element.jobId).map(row => row.RECORD_STATUS)[0]
        dt.CREATE_DATE = this.format_dateNotime(dataitem.filter(item => item.jobId === element.jobId).map(row => row.CREATE_DATE)[0])
        dt.totalDateDiff = dataitem.filter(item => item.jobId === element.jobId).map(row => row.totalDateDiff)[0]
        dt.empStep = dataitem.filter(item => item.jobId === element.jobId).map(row => row.empStep)[0]
        Tableitem.push(dt)
        // datafilter.filter(item => item.JobId === element.JobId)
      })
      if (dataFilter) {
        let stepTitle = dataFilter.id
        let flowNameitem = i.datafilter
        // console.log('Tableitem', Tableitem)
        this.desserts = Tableitem.filter(item => item.flowName === flowNameitem).filter(item2 => item2.stepTitle === stepTitle)
        this.dialog = true
      } else {
        this.desserts = Tableitem
      }
      // console.log('this.desserts', this.desserts)
    }
  }
}
</script>
<style lang="">
.BGmain {
  --bg-color: #f2f2f2;
  background-color: var(--bg-color);
}

</style>
