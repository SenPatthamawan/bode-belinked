<template >
  <div >
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4" >
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <v-divider class="mx-4"></v-divider>
        <v-card class="p-3" color="#f2f2f2">
          <v-row>
            <v-col cols="8" md="8">
              <div style="display: flex">
                <date-range-picker
                ref="picker"
                :locale-data="{ firstDay: 1, format: 'yyyy-mm-dd' }"
                v-model="dateRange"
                @update="getReportBooking()"
                />
                <v-btn
                  small class="ml-5 mt-2" color="#173053" dark
                  readonly
                >
                  กรุณาเลือกวันที่
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="resCol">
              <BookingsourceLink ref="modal1"></BookingsourceLink>
            </v-col>
            <v-col :cols="resCol" >
              <BookingflowName ref="modal2"></BookingflowName>
            </v-col>
          </v-row>
          <v-row>
            <v-col>

            </v-col>
          </v-row>
        </v-card>
        <v-divider class="mx-4"></v-divider>
      <v-card class="p-3" color="#f2f2f2">
          <v-menu
        ref="menu"
        v-model="menumonth"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="datemonth"
            label="กรุณาเลือกเดือน"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="datemonth"
          type="month"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menu.save(date) , getDateMount()"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
        <v-row>
          <v-col cols="12">
            <BookingC3line ref="modal3"></BookingC3line>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <BookingChartCarAndFlow ref="modal4"></BookingChartCarAndFlow>
          </v-col>
        </v-row>
      </v-card>
      </div>
    </v-main>
  </div>
</template>
<style>
  @import '../../assets/c3.min.css';
</style>
<script>
// import axios from 'axios' // api
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
import BookingsourceLink from './BookingsourceLink.vue'
import BookingflowName from './BookingflowName.vue'
import BookingC3line from './BookingC3line.vue'
import BookingChartCarAndFlow from './BookingChartCarAndFlow.vue'

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
    BookingsourceLink,
    BookingflowName,
    BookingC3line,
    BookingChartCarAndFlow
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  computed: {
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '12'
        case 'sm': return '12'
        case 'md': return '6'
        case 'lg': return '6'
        case 'xl': return '6'
      }
      console.log('this.$vuetify.breakpoint.name', this.$vuetify.breakpoint.name)
    }
  },
  data () {
    let startDate = new Date()
    let endDate = new Date()
    return {
      PK: '',
      menumonth: false,
      datemonth: new Date().toISOString().substr(0, 7),
      itemFlowName: [],
      TBcolor: '',
      SelectFlowName: [],
      center: {},
      session: this.$session.getAll(),
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
      chartBranch: null,
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
      ]
    }
  },
  async mounted () {
    await this.getReportBooking()
    await this.getDateMount()
  },
  methods: {
    async getReportBooking () {
      await this.getComponents()
    },
    getComponents () {
      this.$refs.modal1.getSourcelink(this.dateRange)
      this.$refs.modal2.getflowName(this.dateRange)
    },
    getDateMount () {
      this.$refs.modal3.getDate(this.datemonth)
      this.$refs.modal4.getBookingcarAndflow(this.datemonth)
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
.main {
  background-color: #f2f2f2;
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
