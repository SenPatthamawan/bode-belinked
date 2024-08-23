<template lang="">
    <div >
      <v-card class="p-3" color="#f2f2f2" v-if="chartBranch" >
        <v-row  v-if="chartBranch" >
        <v-col :cols="resCol" >
          <h4  style="margin-bottom: 0px;">Work Done</h4>
          <h6 >เสร็จล่าช้า / เสร็จตรงเวลาที่กำหนด</h6>
          <!-- <v-card
                class="pa-md-4 mx-lg-auto "
                width="500"
                height="100"
                elevation="8"
                @click="genDataTable()"
                >
                 <v-row>
                   <v-col cols="2" md="2">
                     <v-icon
                     style="font-size:70px !important; margin:3px -10px 10px 55px;"
                    x-large
                    color="orange"
                  >mdi-clipboard-check</v-icon>
                   </v-col>
                   <v-col cols="10" md="10">
                    <v-card-title class="justify-center" ><h3>ซ่อมเสร็จแล้ว</h3></v-card-title>
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
      <v-row  v-if="chartBranch">
        <v-col :cols="resCol" >
          <v-card elevation="8" class="pa-2" v-if="chartBranch">
          <C3Chart :chartData="chartBranch" ></C3Chart>
          </v-card>
       </v-col>
       <v-col cols="8" lg="8" md="12" sm="12" xs="12">
            <v-card elevation="8" class="pa-4" v-if="chartBranch">
              <h3 class="text-center">รายละเอียดงาน</h3>
              <v-card height="4"  :color="TBcolor"></v-card>
              <v-data-table
              v-if="headers"
              :headers="headers"
              :items="desserts"
              :items-per-page="4"
              class="elevation-1"
            ></v-data-table>
            </v-card>
          </v-col>
      </v-row>
      </v-card>
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
      chartBranch: null,
      headers: [],
      desserts: [],
      dessertsItem: [],
      startDate: '',
      endDate: '',
      TBcolor: ''
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
          { text: 'สรุปค่าใช้จ่าย', value: 'totalPrice' },
          { text: 'ผู้รับผิดชอบ', value: 'empStep' }
        ]
      } else {
        this.headers = [
          { text: 'ชื่อ', value: 'Name' },
          { text: 'เบอร์โทร', value: 'phoneNumber' },
          { text: 'วันที่เริ่มงาน', value: 'CREATE_DATE' },
          { text: 'วันที่เสร็จงาน', value: 'endDate' },
          { text: 'ประเภทบริการ', value: 'flowName' },
          { text: 'สรุปค่าใช้จ่าย', value: 'totalPrice' },
          { text: 'ผู้รับผิดชอบ', value: 'empStep' }
        ]
      }
    },
    async getCloseJob (masBranchName, dateRange) {
      this.chartBranch = null
      this.startDate = this.momenDate_1(dateRange.startDate)
      this.endDate = this.momenDate_1(dateRange.endDate)
      let rs = []
      if (masBranchName) {
        await axios.get(this.DNS_IP + '/job_log/getChartCloseJobByBranch?startDate=' + this.startDate + '&endDate=' + this.endDate + '&shopId=' + this.shopId + '&masBranchName=' + masBranchName).then(response => {
          rs = response.data
        }).catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
      } else {
        await axios.get(this.DNS_IP + '/job_log/getChartCloseJobNoBranch?startDate=' + this.startDate + '&endDate=' + this.endDate + '&shopId=' + this.shopId).then(response => {
          rs = response.data
        }).catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
      }
      if (rs.length > 0) {
        let TotalJob = []
        let JobGood = []
        let JobLate = []
        if (rs.length > 0) {
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.totalDateDiff > 0) {
              JobGood.push('1')
              TotalJob.push(1)
            } else if (d.totalDateDiff < 0) {
              JobLate.push('1')
              TotalJob.push(1)
            }
          }
        }
        this.dessertsItem = rs
        this.Ifshopcategory()
        this.genDataTable()
        // console.log('rs', rs)
        this.genChart(JobGood, JobLate, TotalJob)
      }
    },
    async genChart (JobGood, JobLate, TotalJob) {
      // this.chartBranch = null
      let columns = [
        ['เสร็จตามเวลา', ...JobGood],
        ['เสร็จช้ากว่าเวลาที่กำหนด', ...JobLate]
      ]
      const reducer = (previousValue, currentValue) => previousValue + currentValue
      let TotalsJob = TotalJob.reduce(reducer)
      let _this = this
      this.chartBranch = {
        data: {
          columns: columns,
          type: 'donut',
          onclick: function (d, i) { _this.genDataTable(d) }
        },
        donut: {
          title: `( ${TotalsJob} )`,
          label: {
            format: function (value, ratio, id) {
              return value
            }
          }
        }
      }
    },
    async genDataTable (dataFilter) {
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
        dt.totalPrice = dataitem.filter(item => item.jobId === element.jobId).map(row => row.totalPrice)[0]
        dt.RECORD_STATUS = dataitem.filter(item => item.jobId === element.jobId).map(row => row.RECORD_STATUS)[0]
        dt.CREATE_DATE = this.format_dateNotime(dataitem.filter(item => item.jobId === element.jobId).map(row => row.CREATE_DATE)[0])
        dt.totalDateDiff = dataitem.filter(item => item.jobId === element.jobId).map(row => row.totalDateDiff)[0]
        dt.empStep = dataitem.filter(item => item.jobId === element.jobId).map(row => row.empStep)[0]
        dt.totalPrice = dataitem.filter(item => item.jobId === element.jobId).map(row => row.totalPrice)[0]
        Tableitem.push(dt)
        // datafilter.filter(item => item.JobId === element.JobId)
      })
      if (dataFilter) {
        if (dataFilter.name === 'เสร็จตามเวลา') {
          // console.log('1')
          this.desserts = Tableitem.filter(item => item.dateTotal > 0)
          this.TBcolor = 'blue'
        }
        if (dataFilter.name === 'เสร็จช้ากว่าเวลาที่กำหนด') {
          // console.log('2')
          this.desserts = Tableitem.filter(item => item.dateTotal < 0)
          this.TBcolor = 'orange'
        }
      } else {
        this.TBcolor = 'green'
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
