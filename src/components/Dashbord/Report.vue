<template >
  <div >
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <v-row>
                <v-col cols="6" md="6">
                  <div style="display: flex">
                    <date-range-picker
                    ref="picker"
                    :locale-data="{ firstDay: 1, format: 'yyyy-mm-dd' }"
                    v-model="dateRange"
                    />
                    <v-btn
                      small class="ml-5 mt-2" color="#173053" dark
                      @click="getBranchCard()"
                    >
                      ค้นหา
                    </v-btn>
                  </div>
                </v-col>
        </v-row>
        <v-divider class="mx-4"></v-divider>
        <v-row>
            <v-col cols="4" md="4">
                  <div style="display: flex">
                    <v-select
                      v-model="masBranchName"
                      :items="BranchItem"
                      dense
                      outlined
                      hide-details
                      background-color="white"
                      label="สาขา"
                      class="ma-3"
                      @change="getBranchCard(masBranchName)"
                    ></v-select>
                  </div>
                </v-col>
        </v-row>

        <v-divider class="mx-4"></v-divider>
        <v-card class="p-3" color="#f2f2f2" v-if="chartBranch">
          <v-row>
            <v-col :cols="resCol">
              <h4 style="margin-bottom: 0px;">Performance</h4>
                <h6 >{{titleText[0] + ' / ' + titleText[1] + ' / ' + titleText[2]}}</h6>
            </v-col>
          </v-row>
          <v-row  v-if="chartBranch">
              <v-col :cols="resCol" xs="12">
                <v-card
                class="pa-2"
                elevation="8"
                @click="genDataTable()"
                >
                 <v-row>
                   <v-col cols="2" lg="4" md="4" sm="6" xs="6">
                     <v-icon
                     style="font-size:70px !important; margin:3px -10px 10px 55px;"
                    x-large
                    color="green"
                  >mdi-home-edit</v-icon>
                   </v-col>
                   <v-col cols="10" lg="8" md="8" sm="6" xs="6">
                    <v-card-title class="justify-center" ><h2>{{carditem.cardTotal}}</h2></v-card-title>
                      <v-card-text>
                        <v-row
                          align="center"
                          class="justify-center"
                        >
                      <h5>{{titleText[0]}}</h5>
                        </v-row>
                     </v-card-text>
                   </v-col>
                 </v-row>
              </v-card>
              </v-col>
              <v-col :cols="resCol" xs="12">
              <v-card
                class="pa-2"
                elevation="8"
                @click="genDataTable('จำนวนรถที่ซ่อมอยู่')"
                >
                 <v-row>
                   <v-col cols="2" lg="4" md="4" sm="6" xs="6" >
                     <v-icon
                     style="font-size:70px !important; margin:3px -10px 10px 55px;"
                    x-large
                    color="blue"
                  >mdi-timer</v-icon>
                   </v-col>
                   <v-col cols="10" lg="8" md="8" sm="6" xs="6" >
                    <v-card-title class="justify-center" ><h2>{{carditem.cardWork}}</h2></v-card-title>
                      <v-card-text>
                        <v-row
                          align="center"
                          class="justify-center"
                        >
                      <h5>{{titleText[1]}}</h5>
                        </v-row>
                     </v-card-text>
                   </v-col>
                 </v-row>
              </v-card>
              </v-col>
              <v-col :cols="resCol" xs="12">
              <v-card
                class="pa-2"
                elevation="8"
                @click="genDataTable('จำนวนรถที่ซ่อมเสร็จ')"
                >
                 <v-row>
                   <v-col cols="2" lg="4" md="4" sm="6" xs="6" >
                     <v-icon
                     style="font-size:70px !important; margin:3px -10px 10px 55px;"
                    x-large
                    color="orange"
                  >mdi-checkbox-multiple-marked</v-icon>
                   </v-col>
                   <v-col cols="10" lg="8" md="8" sm="6" xs="6" >
                    <v-card-title class="justify-center" ><h2>{{carditem.cardClose}}</h2></v-card-title>
                      <v-card-text>
                        <v-row
                          align="center"
                          class="justify-center"
                        >
                      <h5>{{titleText[2]}}</h5>
                        </v-row>
                     </v-card-text>
                   </v-col>
                 </v-row>
              </v-card>
              </v-col>
            </v-row>
        <v-row  v-if="chartBranch">
          <v-col :cols="resCol" >
            <v-card elevation="8" class="pa-2" v-if="chartBranch">
              <C3Chart :chartData="chartBranch" ></C3Chart>
            </v-card>
            <!-- <LinechartBranch ref="modal2"></LinechartBranch> -->
          </v-col>
          <v-col cols="8" lg="8" md="12" sm="12" xs="12">
            <v-card class="pa-2" >
              <h3 class="text-center">รายละเอียดงาน</h3>
              <v-card height="4"  :color="TBcolor"></v-card>
              <v-data-table
              :headers="headers"
              :items="desserts"
              :items-per-page="4"
              class="elevation-1"
            ></v-data-table>
            </v-card>
          </v-col>
        </v-row>
        </v-card>
        <br>
        <v-row >
          <v-col cols="12" md="12">
            <ChartC3Flow ref="modal1"></ChartC3Flow>
          </v-col>
        </v-row>
        <v-row >
          <v-col cols="12" md="12">
            <ChartCloseJobC3 ref="modal2"></ChartCloseJobC3>
          </v-col>
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'
import moment from 'moment' // แปลง date
// import dayName from '../../assets/master/Date/day.json'
// import monthNameTH from '../../assets/master/Date/monthNameTH.json'
// import yearsNumber from '../../assets/master/Date/yearsNumber.json'
import ChartBarBase from './Line.js'
import LinechartBranch from './LinechartBranch.vue'
import DateRangePicker from 'vue2-daterange-picker'
// you need to import the CSS manually
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
// import CardBranch from './CardBranch.vue'
// import LinechartBranchSelect from './LinechartBranchSelect.vue'
// import CardBranchSelect from './CardBranchSelect.vue'
import C3Chart from './C3Chart.vue'
import ChartC3Flow from './ChartC3Flow.vue'
import ChartCloseJobC3 from './ChartCloseJobC3.vue'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile,
    moment,
    ChartBarBase,
    LinechartBranch,
    DateRangePicker,
    // CardBranch,
    // LinechartBranchSelect,
    // CardBranchSelect,
    C3Chart,
    ChartC3Flow,
    ChartCloseJobC3
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  computed: {
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '12'
        case 'sm': return '12'
        case 'md': return '4'
        case 'lg': return '4'
        case 'xl': return '4'
      }
      console.log('this.$vuetify.breakpoint.name', this.$vuetify.breakpoint.name)
    }
  },
  data () {
    let startDate = new Date()
    let endDate = new Date()
    return {
      PK: '',
      itemFlowName: [],
      TBcolor: '',
      SelectFlowName: [],
      center: {},
      session: this.$session.getAll(),
      headers: [],
      desserts: [],
      dessertsItem: [],
      // Menu Config
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
      stepData: [],
      Layout: [],
      DataflowId: '',
      DataFlowName: [],
      chartDataofMonth: false,
      shopId: this.$session.getAll().data.shopId,
      fromAdd: {
        workColum: null,
        workData: '',
        flowId: null,
        CREATE_USER: '',
        LAST_USER: '',
        shopId: ''
      },
      dialog: false,
      dataReady: true,
      dateTime: '', // Generate DateTime
      searchAll2: '',
      loader: null,
      loading3: false,
      date: this.momenDate_1(),
      menu: false,
      dataItem: [],
      EmployeeItem: [],
      empStep: '',
      dataByEmpView: [],
      // dayName: dayName,
      // monthNameTH: monthNameTH,
      // yearsNumber: yearsNumber,
      year: '',
      month: '',
      day: '',
      disableYear: true,
      disableMonth: true,
      dateRange: {startDate, endDate},
      format: 'yyyy-mm-dd',
      firstDay: 0,
      showDropdowns: false,
      showWeekNumbers: '',
      linkedCalendars: '',
      masBranchName: '',
      Branch: '',
      select: '',
      BranchItem: [],
      stepCountAll: '',
      totalJob: 0,
      closeJob: 0,
      chartBranch: null,
      columnsItem: [],
      carditem: {
        cardTotal: null,
        cardWork: null,
        cardClose: null
      },
      codeColor: [
        'rgb(142, 202, 230)',
        'rgb(33, 158, 188)',
        'rgb(2, 48, 71)',
        'rgb(241, 91, 76)',
        'rgb(255, 183, 3)',
        'rgb(251, 133, 0)',
        'rgb(61,90,128)',
        'rgb(152,193,217)',
        'rgb(28,251,252)',
        'rgb(255,212,91)',
        'rgb(238,108,77)',
        'rgb(41,50,65)'
      ],
      titleText: []
    }
  },
  async mounted () {
    this.dataReady = false
    await this.Ifshopcategory()
    await this.getDataBranch()
    await this.getFlow()
    await this.getBranchCard()
  },
  methods: {
    async Ifshopcategory () {
      console.log('this.session.data.category', this.session.data.category)
      if (this.session.data.category === 'ธุรกิจรถยนต์') {
        this.titleText = ['จำนวนรถทั้งหมด', 'จำนวนรถที่ซ่อมอยู่', 'จำนวนรถที่ซ่อมเสร็จ']
        this.headers = [
          { text: 'ชื่อ', value: 'Name' },
          { text: 'เลขทะเบียน', value: 'carNo' },
          { text: 'วันที่รับรถ', value: 'CREATE_DATE' },
          { text: 'วันที่ส่งรถ', value: 'endDate' },
          { text: 'ประเภทบริการ', value: 'flowName' },
          { text: 'จำนวนวันที่ซ่อม', value: 'totalDateDiff' }
        ]
      } else {
        this.titleText = ['ลูกค้าทังหมด', 'จำนวนลูกค้าในศูนย์บริการ', ' จำนวนลูกค้าที่ใช้บริการเสร็จแล้ว']
        this.headers = [
          { text: 'ชื่อ', value: 'Name' },
          { text: 'เบอร์โทร', value: 'phoneNumber' },
          { text: 'วันที่เริ่มงาน', value: 'CREATE_DATE' },
          { text: 'วันที่เสร็จงาน', value: 'endDate' },
          { text: 'ประเภทบริการ', value: 'flowName' }
        ]
      }
    },
    async getBranchCard (ItemmasBranchName) {
      // get ข้อมูล Chart แต่ละ Flow
      await this.getBranch()
      this.chartBranch = null
      let startDate = this.momenDate_1(this.dateRange.startDate)
      let endDate = this.momenDate_1(this.dateRange.endDate)
      this.statusitem = []
      let rs = []
      if (ItemmasBranchName) {
        await axios.get(this.DNS_IP + '/job_log/getDashbord_selectBranch_card?startDate=' + startDate + '&endDate=' + endDate + '&shopId=' + this.shopId + '&masBranchName=' + ItemmasBranchName).then(response => {
          rs = response.data
          console.log('1')
        }).catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
      } else {
        await axios.get(this.DNS_IP + '/job_log/getDashbord_total_card?startDate=' + startDate + '&endDate=' + endDate + '&shopId=' + this.shopId).then(response => {
          rs = response.data
          console.log('2')
        }).catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
      }
      if (rs.length > 0) {
        this.columnsItem = []
        let DT1 = ['จำนวนรถที่ซ่อมอยู่']
        let DT2 = ['จำนวนรถที่ซ่อมเสร็จ']
        const reducer = (previousValue, currentValue) => previousValue + currentValue
        let Jobwork = []
        let Total = []
        let Close = []
        // let JobIndex = null
        // console.log('rs', rs)
        for (let i = 0; i < rs.length; i++) {
          let d = rs[i]
          if (ItemmasBranchName) {
            if (d.masBranchName === this.masBranchName) {
              this.columnsItem = []
              DT2.push(...[d.closeJob])
              Jobwork.push(d.Jobwork)
              Total.push(d.totalJob)
              Close.push(d.closeJob)
            }
          } else {
            this.columnsItem = []
            DT2.push(...[d.closeJob])
            Jobwork.push(d.Jobwork)
            Total.push(d.totalJob)
            Close.push(d.closeJob)
          }
        }
        DT1.push(...[Jobwork.reduce(reducer)])
        let ChartDataitem = [
          DT1,
          DT2
        ]
        this.carditem = {}
        this.carditem.cardTotal = Total.reduce(reducer)
        this.carditem.cardWork = Jobwork.reduce(reducer)
        this.carditem.cardClose = Close.reduce(reducer)
        let _this = this
        this.chartBranch = {
          data: {
            columns: ChartDataitem,
            type: 'donut',
            onclick: function (d, i) { _this.genDataTable(d) }
          },
          donut: {
            title: `( ${this.carditem.cardTotal} )`,
            label: {
              format: function (value, ratio, id) {
                return value
              }
            }
          }
        }
        this.dessertsItem = rs
        await this.genDataTable()
        // console.log('555555', this.chartBranch)
      }
    },
    async getFlow () {
      this.itemFlowName = []
      this.SelectFlowName = []
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        for (let i = 0; i < rs.length; i++) {
          let d = rs[i]
          this.itemFlowName.push(d.flowName)
        }
        this.SelectFlowName = this.itemFlowName
        // console.log('rs2', this.itemFlowName)
      })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    getBranch () {
      this.$refs.modal1.getFlow(this.masBranchName, this.dateRange)
      this.$refs.modal2.getCloseJob(this.masBranchName, this.dateRange)
    },
    async getDataBranch () {
      this.BranchItem = []
      this.masBranchName = ''
      await axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(async (response) => {
          let rs = response.data
          // console.log('rsrsrs', rs)
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            d.text = d.masBranchName
            d.value = d.masBranchName
            this.BranchItem.push(d)
          }
          let dt = {
            text: 'ทั้งหมด',
            value: ''
          }
          this.BranchItem.push(dt)
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          this.BranchItem = []
        })
    },
    async genDataTable (dataFilter) {
      // console.log('dataFilter', dataFilter)
      let Tableitem = []
      let dataitem = []
      let datafilter = this.dessertsItem
      let startDate = this.momenDate_1(this.dateRange.startDate)
      let endDate = this.momenDate_1(this.dateRange.endDate)
      await axios.get(this.DNS_IP + '/job_log/select_by_DataTable_TotalJob?startDate=' + startDate + '&endDate=' + endDate + '&shopId=' + this.shopId).then(response => {
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
        Tableitem.push(dt)
        // datafilter.filter(item => item.JobId === element.JobId)
      })
      if (dataFilter) {
        if (dataFilter.name === 'จำนวนรถที่ซ่อมอยู่' || dataFilter === 'จำนวนรถที่ซ่อมอยู่') {
          this.desserts = Tableitem.filter(item => item.totalPrice === '' || item.totalPrice === null)
          this.TBcolor = 'blue'
        }
        if (dataFilter.name === 'จำนวนรถที่ซ่อมเสร็จ' || dataFilter === 'จำนวนรถที่ซ่อมเสร็จ') {
          this.desserts = Tableitem.filter(item => item.totalPrice)
          this.TBcolor = 'orange'
        }
      } else {
        this.desserts = Tableitem
        this.TBcolor = 'green'
      }
    }
  }
}
</script>
<style scope>
:root {
  --table-head-bg: #FFFFFF;
  --table-head-text: #000000;
  --table-body-row-even: #FFFFFF;
  --table-body-row-odd: #ffffff;
  --table-body-text: #000000;
}
.v-data-table-header {
  background-color:  var(--table-head-bg) !important;
}
.v-data-table>.v-data-table__wrapper>table>tbody>tr:nth-child(even) {background: var(--table-body-row-even)}
.v-data-table>.v-data-table__wrapper>table>tbody>tr:nth-child(odd) {background: var(--table-body-row-odd)}
.table_detail_2>.v-data-table__wrapper>table>tbody>tr:nth-child(even) {background: #eeeeee}
.table_detail_2>.v-data-table__wrapper>table>tbody>tr:nth-child(odd) {background: #ffffff}
.v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
  color: var(--table-body-text) !important;
}
.BGmain {
  --bbg-color: #f2f2f2;
  background-color: var(--bbg-color);
}
.Color-Font {
  color: #808588;
}
.Color-Font-Action {
  color: #b61c1c;
}
.Color-Font-Preview {
  color: #262a34;
}
.Color-Button {
  color: #b61c1c;
}
.Divider {
  border: 2px solid #808588;
  background: #808588;
  border-radius: 5px;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.v-data-table-header {
  background-color: var(--table-head-bg) !important;
}
</style>
