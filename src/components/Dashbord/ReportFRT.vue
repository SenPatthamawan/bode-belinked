<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <!-- <v-col class="ma-2" id="text-Board">กระดานทำงาน</v-col> -->
        <v-row class="pt-5 pb-5">
          <v-col :cols="colsWidth">
            <v-select
              :items="DataFlowName"
              v-model="flowId"
              dense
              outlined
              filled
              hide-details
              label="ประเภทบริการ"
              prepend-inner-icon="mdi-car-connected"
              class="ma-2"
            >
            </v-select>
          </v-col>
          <!-- สาขา -->
          <v-col :cols="colsWidth">
            <v-select
              :items="DataBranchName"
              v-model="masBranchID"
              dense
              outlined
              hide-details
              filled
              label="สาขา"
              prepend-inner-icon="mdi-map-marker"
              class="ma-2"
            ></v-select>
          </v-col>
          <v-col :cols="colsWidth">
              <div style="display: flex">
                <date-range-picker
                ref="picker"
                :locale-data="{ firstDay: 1, format: 'yyyy-mm-dd' }"
                v-model="dateRange"
                />
                <v-btn
                  small class="ml-5 mt-2" color="#1B437C" dark
                  readonly
                  @click="getall()"
                >
                  กรุณาเลือกวันที่
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-card
          v-if="perforTime.length > 0"
          color="#FFFFFF"
          class="pa-6">
          <v-row>
          <v-col class="pa-0" cols="8">
            <p  class="text-center font-weight-bold" style="font-size:50px !important;color:#1B437C;">
              Dashboard ( FRT )
              </p>
          </v-col>
          <v-col
          class="text-right pa-0"
          cols="4"
        >
          <v-text-field
            class="ma-2"
              dense
              background-color="#f0eeee"
              v-model="searchJob"
              :append-outer-icon="searchJob ? 'mdi-refresh-circle' : ''"
              append-icon="mdi-text-box-search"
              label="ค้นหาทั้งหมด"
              @click:append-outer="refreshData()"
              @click:append="searchData()"
              solo
            >
            </v-text-field>
        </v-col>
          </v-row>
          <v-card
          :v-if="perforTime.length > 0"
          class="pa-2 mt-5"
          color="#FFFFFF"
          elevation="5"
          background-color="primary"
          min-height="200px"
           v-for="(jobTitle , jobTitleK) in perforTime" :key="jobTitleK">
            <v-row>
              <v-col cols="12" class="pb-0 mt-3">
                <p
                v-if="jobTitle.datatime[0].totalTimeAll > 0"
                class="text-center font-weight-bold ma-0"
                style="font-size:30px !important;"
                >
                {{'⏱ เวลารวมทั้งหมด ' + jobTitle.datatime[0].totalTimeAll + ' นาที'}}
                </p>
              </v-col>
              <v-col cols="12" class="pa-5 pt-0 mt-n2">
               <v-row class="flex-nowrap pa-3 pt-0 mt-1 ms-3" style="width:100%;height:max-content;">
                  <!-- <div v-for="(step , stepK) in jobTitle.datatime" :key="stepK">
                  <v-card  width="50px" height="100px"></v-card>
                </div> -->
                <div class="pa-0 ma-0 mb-3 ms-2" v-for="(step , stepK) in jobTitle.datatime" :key="stepK"
                :style="'width:' + (step.totalTimeStepPer) + '%;background-color:#FFFFFF;'"
                >
                  <p v-if="step.totalTimeStepPer > 0"
                  class="text-center ma-0 mb-2"
                  style="background-color:#FFFFFF;"
                  >
                  <v-icon
                  :color="codeColor[stepK]"
                  style="font-size:25px !important;"
                  >mdi-check-network</v-icon>
                  </p>
                  <v-card
                  class="ma-0"
                  v-if="step.totalTimeStepPer > 0"
                  width="100%"
                  height="100%"
                  style="background-color:#FFFFFF;border: 1px solid  #000000;display:flex;"
                  >
                      <v-col class="pa-0 ma-0" v-for="(empTime , empTimeK) in step.timeEmp" :key="empTimeK"
                      :style="'min-width:' +
                      ((empTimeK === (step.timeEmp.length - 1)) ? empTime.leadTimePer + empTime.totalTimePer: empTime.leadTimePer + empTime.totalTimePer)
                      +'%;height:100%;'"
                      >
                      <!-- เคสที่ มี leadTimePer > 0 && totalTimePer > 0 -->
                      <div class="pa-0 ma-0" v-if="empTime.leadTimePer > 0 && empTime.totalTimePer > 0"
                        :style="'width:' + 100 +'%;height:100%;display:flex;'"
                      >

                      <v-tooltip :color="codeColor[stepK]" bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on" class="text-center pa-0 ma-0" v-if="empTime.leadTimePer > 0"
                          :style="'width:' + empTime.leadTimePer +'%;height:100%;background-color:#FFFF66;'">
                          </div>
                           </template>
                        <span>{{step.stepTitle + ' ' + (empTime.leadTime) + ' นาที'}}</span>
                      </v-tooltip>

                      <v-tooltip :color="codeColor[stepK]" bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on" class="text-center pa-0 ma-0" v-if="empTime.totalTime > 0"
                            :style="'width:' + empTime.totalTimePer +'%;height:100%;background-color: #7FFF00;'">
                          </div>
                          </template>
                        <span>{{step.stepTitle + ' ' + (empTime.totalTime) + ' นาที'}}</span>
                      </v-tooltip>

                      <v-tooltip :color="codeColor[stepK]" bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on" class="text-center pa-0 ma-0" v-if="empTime.leadEndTimePer > 0 && empTimeK === (step.timeEmp.length - 1)"
                            :style="'width:' + (100 - (empTime.leadTimePer + empTime.totalTimePer)) +'%;height:100%;background-color:#FFFF66;'">
                        </div>
                         </template>
                        <span>{{step.stepTitle + ' ' + (empTime.leadEndTime) + ' นาที'}}</span>
                      </v-tooltip>

                      </div>
                      <!-- เคสที่ มี leadTimePer > 0 && leadEndTimePer เป็น Array ตัวสุดท้าย -->
                      <div class="text-center pa-0 ma-0" v-else-if="empTime.leadTimePer > 0 && (empTimeK === (step.timeEmp.length - 1))"
                         :style="'width:' + 100 +'%;height:100%;display:flex;'">

                      <v-tooltip :color="codeColor[stepK]" bottom>
                        <template v-slot:activator="{ on, attrs }">
                         <div v-bind="attrs" v-on="on" class="text-center pa-0 ma-0" v-if="empTime.leadTimePer > 0"
                          :style="'width:' + (empTime.leadTimePer + empTime.leadEndTimePer) +'%;height:100%;background-color:#FFFF66;'">
                          </div>
                      </template>
                        <span>{{step.stepTitle + ' ' + (empTime.leadTime + empTime.leadEndTime) + ' นาที'}}</span>
                      </v-tooltip>

                      <!-- <v-tooltip :color="codeColor[stepK]" bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on" class="text-center pa-0 ma-0" v-if="empTime.leadEndTime > 0 && (empTimeK === (step.timeEmp.length - 1))"
                            :style="'width:' + empTime.leadEndTimePer +'%;height:100%;background-color: #FFFFFF;'">
                          </div>
                      </template>
                        <span>{{empTime.leadEndTime + ' นาที'}}</span>
                      </v-tooltip> -->

                      </div>
                      <!-- เคสที่ มี totalTime > 0 && leadEndTimePer เป็น Array ตัวสุดท้าย -->
                      <div class="text-center pa-0 ma-0" v-else-if="empTime.totalTime > 0 && (empTimeK === (step.timeEmp.length - 1))"
                        :style="'width:' + 100 +'%;height:100%;display:flex;'">

                      <v-tooltip :color="codeColor[stepK]" bottom>
                        <template  v-slot:activator="{ on, attrs }">
                        <div v-bind="attrs" v-on="on" class="text-center pa-0 ma-0" v-if="empTime.totalTime > 0"
                            :style="'width:' + empTime.totalTimePer +'%;height:100%;background-color: #7FFF00;'">
                          </div>
                      </template>
                        <span>{{step.stepTitle + ' ' + (empTime.totalTime) + ' นาที'}}</span>
                      </v-tooltip>

                      <v-tooltip :color="codeColor[stepK]" bottom>
                        <template  v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on" class="text-center pa-0 ma-0" v-if="empTime.leadEndTime > 0 && (empTimeK === (step.timeEmp.length - 1))"
                            :style="'width:' + empTime.leadEndTimePer +'%;height:100%;background-color: #FFFF66;'">
                          </div>
                      </template>
                        <span>{{step.stepTitle + ' ' + (empTime.leadEndTime) + ' นาที'}}</span>
                      </v-tooltip>

                      </div>
                      <!-- เคสที่ มี leadTimePer > 0 -->
                      <v-tooltip :color="codeColor[stepK]" bottom v-else-if="empTime.leadTimePer > 0 ">
                        <template  v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on" class="text-center pa-0 ma-0"
                         :style="'width:' + 100 +'%;height:100%;background-color:#FFFF66;'">
                      </div>
                      </template>
                        <span>{{step.stepTitle + ' ' + (empTime.leadTime) + ' นาที'}}</span>
                      </v-tooltip>
                      <!-- เคสที่ มี totalTime > 0 -->
                      <v-tooltip :color="codeColor[stepK]" bottom v-else-if="empTime.totalTime > 0">
                        <template  v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on" class="text-center pa-0 ma-0"
                        :style="'width:' + 100 +'%;height:100%;background-color: #7FFF00;'">
                      </div>
                      </template>
                        <span>{{step.stepTitle + ' ' + (empTime.totalTime) + ' นาที'}}</span>
                      </v-tooltip>
                      </v-col>
                      <!-- เคสที่ มี timeEmp = 0 && ไม่ใช่ Array ปิดจ็อบ -->
                      <v-tooltip :color="codeColor[stepK]" bottom v-if="step.timeEmp.length ===  0 && step.stepTitle !== 'closejob'">
                        <template  v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on" class="text-center pa-0 ma-0"
                        :style="'width:' + 100 +'%;height:100%;background-color: #FFFF66;'">
                      </div>
                      </template>
                        <span>{{step.stepTitle + ' ' + (step.totalTimeStep) + ' นาที'}}</span>
                      </v-tooltip>
                  </v-card>
                </div>
               </v-row>
              </v-col>
              <v-col cols="12" class="pa-5 pb-6" v-if="jobTitle.showdetail === true">
                <v-row  class="pa-0 ma-0" style="background-color: #FFFFFF;">
                  <v-col cols="4" class="pa-0 ma-0 ps-16 mt-6" >
                    <div class="pa-0 ma-0" v-for="(jobItem , jobItemK) in jobTitle.Jobitem" :key="jobItemK">
                      <p
                      v-if="jobItem.fieldName === 'ชื่อ' || jobItem.fieldName === 'เบอร์โทร' || jobItem.fieldName === 'เลขทะเบียน'"
                      class="font-weight-bold ma-0 mb-0"
                      style="font-size:23px !important;"
                      >
                      <v-icon
                      color="#3F51B5"
                      v-if="jobItem.fieldName === 'ชื่อ'"
                      class="mb-2 mr-1"
                      style="font-size:25px !important;"
                      >mdi-account-tie</v-icon>
                       <v-icon
                       color="#FF5722"
                       v-if="jobItem.fieldName === 'เบอร์โทร'"
                      class="mb-2 mr-1"
                      style="font-size:25px !important;"
                      >mdi-phone-settings</v-icon>
                       <v-icon
                       color="#4CAF50"
                       v-if="jobItem.fieldName === 'เลขทะเบียน'"
                      class="mb-2 mr-1"
                      style="font-size:25px !important;"
                      >mdi-car-outline</v-icon>
                      {{'  ' + jobItem.fieldValue}}
                      </p>
                    </div>

                    <p class="font-weight-bold pa-0 ma-0 mt-8">
                      <v-icon color="#7FFF00" style="font-size:40px !important;">
                        mdi-square-rounded
                      </v-icon>
                      เวลาการทำงานของพนักงาน
                    </p>
                    <p class="font-weight-bold pa-0 ma-0">
                      <v-icon color="#FFFF66" style="font-size:40px !important;">
                        mdi-square-rounded
                        </v-icon>
                      LeadTime
                    </p>
                  </v-col >
                  <v-col cols="8" class="pa-0 ma-0 ps-11 pt-8" >
                    <div class="pa-0 ma-0" v-for="(step , stepK) in jobTitle.datatime" :key="stepK">
                      <v-row class="pa-0 mb-6">
                        <v-icon
                        v-if="step.totalTimeStepPer > 0"
                        class="mr-4"
                        :color="codeColor[stepK]"
                        style="font-size:40px !important;"
                        >mdi-timeline-check</v-icon>
                        <p
                        v-if="step.totalTimeStepPer > 0"
                        class="font-weight-bold ma-0 mb-0"
                        style="font-size:20px !important;"
                        >
                        {{step.stepTitle}}
                        </p>
                        <p
                        v-if="step.totalTimeStepPer > 0"
                        class="font-weight-medium ma-0 mb-0 ms-n6 mt-8"
                        style="font-size:20px !important;"
                        >
                        {{'⏱ เวลาแต่ละขั้นตอน ' + step.totalTimeStep + ' นาที '}}
                        </p>
                        <p
                        v-if="step.totalTimeStepPer > 0 && step.totalEmpTime > 0"
                        class="font-weight-medium ma-0 mb-0 ms-3 mt-8"
                        style="font-size:20px !important;"
                        >
                        {{'🧑 เวลารวมของพนักงาน ' + step.totalEmpTime + ' นาที'}}
                        </p>
                      </v-row>
                    </div>
                    <v-col
                    v-if="jobTitle.showdetail === true"
                    class="text-right pa-0 ma-0"
                    >
                    <v-tooltip color="#1B437C" bottom >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ma-2"
                          small
                          color="#1B437C"
                          v-bind="attrs"
                          v-on="on"
                          @click="jobTitle.showdetail = false"
                        >
                          <v-icon large color="#FFFFFF">
                            mdi-menu-up
                          </v-icon>
                        </v-btn>
                          </template>
                      <span>ปิดรายละเอียด</span>
                    </v-tooltip>
                  </v-col>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="pa-0 ma-0 pt-6 ms-16">
              <v-col v-if="jobTitle.showdetail === false" cols="10" class="text-center pa-0 ma-0 " >
                <p class="text-center font-weight-bold ma-0 ms-16"
                style="font-size:30px !important;">
                  <v-icon
                  class="ma-0 mb-3"
                  color="#1B437C"
                  style="font-size:40px !important;"
                  >
                    mdi-car-arrow-right
                  </v-icon>
                  {{jobTitle.Jobitem.filter((item) => item.fieldName === 'เลขทะเบียน')[0].fieldValue}}
                </p>
              </v-col>
              <v-col cols="2"  v-if="jobTitle.showdetail === false"
              class="text-right pa-0 ma-0 "
              >
              <v-tooltip color="#1B437C" bottom >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                class="ma-2 mr-7 mb-3"
                small
                color="#1B437C"
                v-bind="attrs"
                v-on="on"
                @click="jobTitle.showdetail = true"
              >
                <v-icon large color="#FFFFFF">
                  mdi-menu-down
                </v-icon>
              </v-btn>
                </template>
                <span>แสดงรายละเอียด</span>
              </v-tooltip>
            </v-col>
            </v-row>
          </v-card>
          </v-card>
      </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import draggable from 'vuedraggable'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import Menu from '../System/Menu.vue'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
// import moment from 'moment' // แปลง date

export default {
  name: 'hello',
  components: {
    draggable,
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    Menu,
    DateRangePicker
  },
  computed: {
    colsWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '12'
        case 'sm': return '12'
        case 'md': return '12'
        case 'lg': return '4'
        case 'xl': return '4'
      }
    },
    classWork () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return ''
        case 'sm': return ''
        case 'md': return ''
        case 'lg': return 'workRow'
        case 'xl': return 'workRow'
      }
    }
  },
  data () {
    let startDate = new Date()
    let endDate = new Date()
    return {
      dateRange: {startDate, endDate},
      Layout: [],
      layout: 'grid',
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'Flow',
          disabled: false,
          href: '/Master/Flow'
        }
      ],
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        required: value => !!value || 'กรุณากรอก.'
      },
      columnsStep: [
        { text: 'Title', value: 'stepTitle' },
        { text: ' ', value: 'actions2', sortable: false, align: 'center' }
      ],
      flowCode: '',
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      stepItemSelete: [],
      stepItemSeleteInBoard: [],
      empSeleteStep: [],
      DataFlowName: [],
      validAdd: false,
      TotalDate: [],
      DataBranchName: [],
      ItemSelete: [],
      userId: '',
      totalDateDiff: '',
      masBranchID: '',
      branchData: [],
      codeColor: [
        '#4D67AB',
        '#B8860B',
        '#CE2220',
        '#824D99',
        '#84C650',
        '#C65050',
        '#57A2AC',
        '#E67F33',
        '#4E79C4',
        '#EB56F6'
      ],
      flowId: '',
      jobId: [],
      allJob: [],
      allJobLog: [],
      EmpTime: [],
      perforTime: [],
      searchJob: ''
    }
  },
  async mounted () {
    await this.getDataFlow()
    await this.getDataBranch()
    await this.getEmpSelect()
    // await this.getLayoutDefault()
  },
  methods: {
    async getall () {
      if (this.masBranchID !== '' && this.flowId !== '' && this.dateRange !== '') {
        this.jobId = []
        this.allJob = []
        this.allJobLog = []
        this.EmpTime = []
        this.perforTime = []
        this.getJobData()
      } else {
        this.$swal('ผิดพลาด', 'กรุณาเลือกข้อมูล', 'error')
      }
    },
    getDataFlow () {
      this.DataFlowName = []
      // console.log('DataFlowName', this.DataFlowName)
      axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId + '&checkOnsite=is null')
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.flowName
              d.value = d.flowId
              this.DataFlowName.push(d)
            }
          } else {
            this.DataFlowName = []
          }
        })
    },
    getDataBranch () {
      this.DataBranchName = []
      this.branchData = []
      // console.log('DataBranchName', this.DataBranchName)
      axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.masBranchName
              d.value = d.masBranchID
              this.DataBranchName.push(d)
              this.branchData.push(d)
            }
          } else {
            this.DataBranchName = []
          }
        })
    },
    async getJobData () {
      // this.JobDataItem = []
      // this.allJob = []
      let startDate = this.momenDate_1(this.dateRange.startDate)
      let endDate = this.momenDate_1(this.dateRange.endDate)
      // Get VW_Job
      await axios.get(this.DNS_IP + '/job/DashBordFRT?flowId=' + this.flowId + '&masBranchID=' + this.masBranchID + '&shopId=' + this.shopId + '&startDate=' + startDate + '&endDate=' + endDate + '&checkOnsite=is null').then(async response => {
        let rs = response.data
        if (rs.length > 0) {
          // filter หา JobId
          let item = rs.reduce((r, a) => {
            let jobId = a.jobId
            r[jobId] = r[jobId]
            return r
          }, Object.create(null))
          for (let x in item) {
            this.jobId.push(x)
          }

          this.allJob = rs
          await this.getJobLog()
          await this.getTimeLog(startDate, endDate)
          await this.genDataFRT()
        }
      }).catch((error) => {
        console.log('error VW_Job : ', error)
      })
    },
    async getJobLog () {
      // Get Job_LOG
      await axios.get(this.DNS_IP + '/job_log/FRT?flowId=' + this.flowId + '&masBranchID=' + this.masBranchID + '&shopId=' + this.shopId).then(async response => {
        let rs = response.data
        if (rs.length > 0) {
          this.allJobLog = rs
        }
      }).catch((error) => {
        console.log('error Job_LOG : ', error)
      })
    },
    async getTimeLog (startDate, endDate) {
      // Get TimeEmp_Log
      await axios.get(this.DNS_IP + '/TimeEmp_Log/select_by_FRT?shopId=' + this.shopId + '&startDate=' + startDate + '&endDate=' + endDate).then(async response => {
        let rs = response.data
        if (rs.length > 0) {
          this.EmpTime = rs
        }
      }).catch((error) => {
        console.log('error TimeEmp_Log : ', error)
      })
    },
    async genDataFRT () {
      // console.log('this.jobId', this.jobId)
      // console.log('this.allJob', this.allJob)
      // console.log('this.allJobLog', this.allJobLog)
      // console.log('this.EmpTime', this.EmpTime)
      let dtitem = []
      this.jobId.forEach((v1, k1) => {
        let indexTime = null
        let indexCloseJobTime = null
        let s = {}
        s.JobId = v1
        s.Jobitem = this.allJob.filter((item) => item.jobId.toString() === v1)
        s.datatime = []
        s.showdetail = false
        this.allJobLog.forEach((v2, k2) => {
          let jobLog = {}
          if (v1 === v2.jobId.toString()) {
            jobLog.stepTitle = (v2.totalPrice === null) ? v2.stepTitle : 'closejob'
            jobLog.totalTimeAll = this.jsTimeDiff(this.allJobLog.filter((item) => item.jobId === v2.jobId)[0].CREATE_DATE, this.allJobLog.filter((item) => item.jobId === v2.jobId)[this.allJobLog.filter((item) => item.jobId === v2.jobId).length - 1].LAST_DATE)
            jobLog.totalTimeStep = this.jsTimeDiff(v2.CREATE_DATE, v2.LAST_DATE)
            jobLog.totalTimeStepPer = (jobLog.totalTimeStep * 100) / jobLog.totalTimeAll
            jobLog.totalEmpTime = 0
            indexCloseJobTime = (v2.totalPrice !== null) ? indexCloseJobTime : this.jsTimeDiff(v2.CREATE_DATE, v2.LAST_DATE)
            jobLog.timeEmp = []
            s.datatime.push(jobLog)
            let indexleadTimeEnd = 0
            this.EmpTime.forEach((v3, k3) => {
              let empTime = {}
              if (v1 === v3.jobId.toString() && v2.stepId === v3.stepId && v2.totalPrice === null) {
                let logStartD = new Date(v2.CREATE_DATE)
                let logEndD = new Date(v2.LAST_DATE)
                let EmpStartD = new Date(v3.timeStart)
                let EmpEndD = new Date(v3.timeEnd)
                if (EmpStartD >= logStartD && EmpEndD <= logEndD) {
                  let checkleadtime = indexTime
                  if (indexTime === null) {
                    empTime.leadTime = this.jsTimeDiff(v2.CREATE_DATE, v3.timeStart)
                    empTime.TimeId = v3.timeEmpId
                    empTime.totalTime = parseInt(v3.totalTime * 0.016666)
                    jobLog.totalEmpTime += empTime.totalTime
                    empTime.leadTimePer = (empTime.leadTime * 100) / jobLog.totalTimeStep
                    empTime.totalTimePer = (empTime.totalTime * 100) / jobLog.totalTimeStep
                    indexleadTimeEnd += empTime.leadTime + empTime.totalTime
                    empTime.leadEndTime = jobLog.totalTimeStep - indexleadTimeEnd
                    empTime.leadEndTimePer = (empTime.leadEndTime * 100) / jobLog.totalTimeStep
                    // console.log('Testlog', v2.CREATE_DATE, v3.timeStart, this.jsTimeDiff(v2.CREATE_DATE, v3.timeStart), v3.timeEmpId)
                    // console.log('jobLog', jobLog.stepTitle, 'if', k3)
                  } else {
                    empTime.TimeId = v3.timeEmpId
                    empTime.leadTime = this.jsTimeDiff(checkleadtime, v3.timeStart)
                    // console.log('Testlog', checkleadtime, v3.timeStart, this.jsTimeDiff(checkleadtime, v3.timeStart), v3.timeEmpId)
                    empTime.totalTime = parseInt(v3.totalTime * 0.016666)
                    jobLog.totalEmpTime += empTime.totalTime
                    empTime.leadTimePer = (empTime.leadTime * 100) / jobLog.totalTimeStep
                    empTime.totalTimePer = (empTime.totalTime * 100) / jobLog.totalTimeStep
                    indexleadTimeEnd += empTime.leadTime + empTime.totalTime
                    empTime.leadEndTime = jobLog.totalTimeStep - indexleadTimeEnd
                    empTime.leadEndTimePer = (empTime.leadEndTime * 100) / jobLog.totalTimeStep
                    // console.log('jobLog', jobLog.stepTitle, 'else', k3)
                  }
                  jobLog.timeEmp.push(empTime)
                  indexTime = v3.timeEnd
                }
              } else if (v1 === v3.jobId.toString() && v2.stepId === v3.stepId && v2.totalPrice !== null) {
                let leadTimeEnd = this.EmpTime.filter((item) => item.jobId.toString() === v1 && item.stepId === v2.stepId)
                empTime.leadTimeEnd = this.jsTimeDiff(leadTimeEnd[leadTimeEnd.length - 1].timeEnd, v2.LAST_DATE)
                empTime.leadTimeEndPer = (empTime.leadTimeEnd * 100) / indexCloseJobTime
                // indexCloseJobTime = null
                jobLog.timeEmp.push(empTime)
              }
            })
          }
        })
        dtitem.push(s)
      })
      this.perforTime = dtitem
      console.log('this.perforTime', this.perforTime)
    },
    jsTimeDiff (Time1, Time2) {
      var oneday = 1000 * 60
      var defDate = (new Date(Time2).getTime() - new Date(Time1).getTime()) / oneday
      // console.log('def', Time1, Time2)
      return defDate
    },
    async searchData () {
      // console.log('Up', this.searchJob.toUpperCase())
      // console.log('Low', this.searchJob.toLowerCase())
      let test = this.allJob.filter((item) => (item.fieldValue.replace(/ |-/g, '')).includes(this.searchJob.toLowerCase().replace(/ |-/g, '')) || (item.fieldValue.replace(/ |-/g, '')).includes(this.searchJob.toUpperCase().replace(/ |-/g, '')))
      if (test.length > 0) {
        this.jobId = []
        let item = test.reduce((r, a) => {
          let jobId = a.jobId
          r[jobId] = r[jobId]
          return r
        }, Object.create(null))
        for (let x in item) {
          this.jobId.push(x)
        }
        // console.log('test', this.jobId)
        this.genDataFRT()
      } else {
        this.$swal('ผิดพลาด', 'ไม่พบข้อมูล', 'error')
      }
    },
    async refreshData () {
      this.searchJob = ''
      this.getall()
    }
  }
}
</script>
<style scoped>
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  background-color: #f0eeee !important;
}
.v-card__subtitle, .v-card__text, .v-card__title {
  padding: 0px !important;
}
.theme--light.v-card {
    border-radius: 0px !important;
}
.v-sheet.v-card {
    border-radius: 0px !important;
}
.workRow {
  display: inline-block;
  width: max-content;
  height: max-content;
}
.colum {
  margin-top: 1rem;
  width: 200px;
  background-color: #FFFFFF;
  margin-left: 1.5px;
}
.allFrame {
  padding-top: 0px;
  width: 100%;
  min-height: max-content;
}
#subtextTitle {
  color: #173053;
  font-size: 20px !important;
  font-weight: bold;
}
#textTitleB {
  color: #173053;
  font-size: 40px !important;
  font-weight: bold;
  font-family: Roboto;
  font-style: normal;
}
#cardleft {
  height: 1024px;
  width: 502px;
  left: 1210px;
  top: 0px;
  border-radius: 0px;
}
#v-img-car {
  height: 60px;
  width: 64px;
}
#img_edit_step {
  width: 135px;
  height: 100px;
}
#text_edit_step {
  Width: 250px;
  Height: 50px;
}
#textButton {
  height: 50px;
  width: 117px;
  font-family: Kittithada Bold 75;
  font-style: normal;
  font-weight: bold;
  align-items: center;
}
#text-Board {
  position: absolute;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  display: flex;
  align-items: center;
  color: #1b437c;
}
#cardTitle {
  width: auto !important;
  height: 32px !important;
  border-radius: 2px !important;
}
#v-text-editLayout {
  height: 50px;
  width: 238px;
}
body {
  overflow: auto;
  white-space: normal;
}
</style>
