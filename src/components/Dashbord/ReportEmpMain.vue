<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <!-- <v-col class="ma-2" id="text-Board">กระดานทำงาน</v-col> -->
        <v-row class="pt-5">
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
              <v-btn
                  small class="ml-5 mt-2" color="#173053" dark
                  readonly
                  @click="getall()"
                >
                  ค้นหา
                </v-btn>
            </v-col>
          </v-row>
        <v-divider></v-divider>
        <div
          v-if="flowId === ''"
          :class="classWork"
        >
          <v-row>
            <v-col class="colum" v-for="(element, work) in Layout" :key="work">
              <div
                v-for="(item, indexitem) in Layout[work].workData"
                :key="indexitem"
                class="pb-0 pt-0"
              >
                <v-card class="mb-2">
                  <v-card id="cardTitle" elevation="12">
                    <v-card-title class="ma-3">
                      <v-row>
                        <v-col cols="8" class="pa-1">
                          <strong>{{ item.stepTitle }}</strong>
                        </v-col>
                        <v-col cols="4" class="text-right pb-1 pt-0">
                          <strong>{{
                            allJob.filter(row => {
                              return row.stepId == item.stepId
                            }).length
                          }}</strong>
                        </v-col>
                      </v-row>
                    </v-card-title>
                  </v-card>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- GridView -->
        <div
          v-if="layout === 'grid'"
          :class="classWork"
          v-show="masBranchID"
        >
          <v-row >
            <v-col class="colum pa-1"  v-for="(element, work) in Layout" :key="work" >
              <div
                v-for="(item, indexitem) in Layout[work].workData"
                :key="indexitem"
                class="pb-0 pt-0"
              >
                <v-card class="pa-0" style="background-color: #f0eeee;">
                  <v-card id="cardTitle" class="mb-1" :style="'background-color:' + codeColor[work] + ';'">
                    <v-card-title class="ma-3">
                      <v-row class="pa-0" style="color: white;">
                        <v-col cols="10" class="pa-1">
                          <v-tooltip
                            :color="codeColor[work]"
                            v-if="item.stepTitle.length > 18"
                            top
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <strong
                                  class="ml-2"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                {{ item.stepTitle.substring(0, 18)}}...
                                </strong>
                              </template>
                              <span>{{item.stepTitle}}</span>
                            </v-tooltip>
                          <strong class="ml-2" v-if="item.stepTitle.length <= 18">{{ item.stepTitle }}</strong>
                        </v-col>
                        <v-col cols="2" class="text-right pb-1 pt-1 pl-0 ">
                          <strong class="pa-0">{{
                            allJob.filter(row => {
                              return row.stepId == item.stepId
                            }).length
                          }}</strong>
                          <!-- <v-icon color="#ABB1C7">
                            mdi-dots-vertical
                          </v-icon> -->
                        </v-col>
                      </v-row>
                    </v-card-title>
                  </v-card>

                  <div
                    class="mt-n1"
                    v-for="(itemsJob, indexJob) in allJob.filter(row => {
                      return row.stepId == item.stepId
                    })"
                    :key="indexJob"
                    :style="'border-left-style: solid;border-width: 5px;border-color:' + codeColor[work] +';'"
                  >
                    <v-list-item class="pa-1 pb-2">
                      <v-alert
                        class="pa-2 pt-0 mb-n1"
                        width="100%"
                        min-height="160px"
                      >
                      <v-row class="mb-n2 pa-0 mt-n1" >
                          <v-col cols="2" class="pa-0 ps-3" >
                            <v-tooltip top
                                v-if="parseInt(itemsJob.totalDateDiff) <= 2"
                                color="#DE6467"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                    style="font-size:35px !important;"
                                      v-bind="attrs"
                                      v-on="on"
                                      x-large
                                      color="#DE6467"
                                    >
                                      mdi-alarm-light
                                    </v-icon>
                                  </template>
                                  <span style="background-color:#DE6467;">{{ itemsJob.totalDateDiff }}</span>
                             </v-tooltip>
                             <v-tooltip top
                                v-else-if="parseInt(itemsJob.totalDateDiff) <= 4 &&parseInt(itemsJob.totalDateDiff) >= 2"
                                color="#FED966"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                    style="font-size:35px !important;"
                                      v-bind="attrs"
                                      v-on="on"
                                      x-large
                                      color="#FED966"
                                    >
                                      mdi-alarm-light
                                    </v-icon>
                                  </template>
                                  <span style="background-color:#FED966;">{{ itemsJob.totalDateDiff }}</span>
                             </v-tooltip>
                             <v-tooltip top
                                v-else-if="parseInt(itemsJob.totalDateDiff) >= 4"
                                color="#4F93D0"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                    style="font-size:35px !important;"
                                      v-bind="attrs"
                                      v-on="on"
                                      x-large
                                      color="#4F93D0"
                                    >
                                      mdi-alarm-light
                                    </v-icon>
                                  </template>
                                  <span style="background-color:#4F93D0;">{{ itemsJob.totalDateDiff }}</span>
                             </v-tooltip>
                        <!-- end diffDate -->
                          </v-col>
                        <v-col cols="10" class="pa-0 ps-6">
                      <strong class="text-center"  style="font-size:25px !important;">
                        {{JobDataItem.filter(row => {return row.jobId == itemsJob.jobId && row.fieldName === 'เลขทะเบียน'})[0].fieldValue}}
                      </strong>
                        </v-col>
                      </v-row>
                        <!-- <div
                          class="bodyFrame"
                          v-for="(items, index) in JobDataItem.filter(row => {
                            return row.jobId == itemsJob.jobId
                          })"
                          :key="index"
                        >
                        <div style="height:20px;" v-if="items.showCard === 'True' && items.fieldValue !== ''">
                          <v-tooltip
                            :color="codeColor[work]"
                            v-if="items.fieldValue.length > 14"
                            top
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <p
                                  class="ma-0"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                {{ items.fieldValue.substring(0, 14)}}...
                                </p>
                              </template>
                              <span>{{items.fieldValue}}</span>
                            </v-tooltip>
                          <p class="ma-0" v-if="items.fieldValue.length <= 14">{{ items.fieldValue }}</p>
                        </div>
                        </div> -->
                        <v-row style="height:50px;" class=" ps-3 pt-0 pb-1 mb-1">
                          <v-col cols="12" class="mt-1 pa-0 ps-3">
                                <p
                                style="font-size:50px !important;color: #DE6467;"
                                class="font-weight-black pa-0 ma-0"
                                  v-if="itemsJob.statusTime === 'timeEnd' && itemsJob.statusTime !== null"
                                >
                                {{itemsJob.showTime}}
                                </p>
                                <p
                                style="font-size:50px !important;color: #ff9900;"
                                class="font-weight-black pa-0 ma-0"
                                  v-if="itemsJob.statusTime === 'timeStart' && itemsJob.statusTime !== null"
                                >
                                {{convertHMS(timeItem.filter((item) => item.jobId === itemsJob.jobId && item.stepId === itemsJob.stepId && item.empId === itemsJob.empId)[0].totalTime)}}
                                </p>
                                <p
                                style="font-size:50px !important;color: #84C650;"
                                class="font-weight-black pa-0 ma-0"
                                  v-if="itemsJob.statusTime === null"
                                >
                                00:00:00
                                </p>
                          </v-col>
                          <v-col cols="12" class="mt-1 pa-0">
                            <p class="font-weight-medium mb-0 pb-1">
                              <!-- <v-icon class="pb-1 mr-1 ml-1" large > mdi-shield-account</v-icon> -->
                              <v-tooltip top
                              color="#84C650"
                                v-if="itemsJob.statusTime === 'timeStart' || itemsJob.statusTime === null">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                    class="pb-1 mr-1 ml-1"
                                      v-bind="attrs"
                                      v-on="on"
                                      x-large
                                      color="#84C650"
                                    >
                                      mdi-timer
                                    </v-icon>
                                  </template>
                                  <span>จับเวลา</span>
                                </v-tooltip>
                                <v-tooltip top
                                color="#DE6467"
                                v-if="itemsJob.statusTime === 'timeEnd' && itemsJob.statusTime !== null">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                    class="pb-1 mr-1 ml-1"
                                      v-bind="attrs"
                                      v-on="on"
                                      x-large
                                      color="#DE6467"
                                    >
                                      mdi-timer-off
                                    </v-icon>
                                  </template>
                                  <span>หยุดเวลา</span>
                                </v-tooltip>
                                {{JobDataItem.filter(row => {return row.jobId == itemsJob.jobId})[0].empStep}}
                            </p>
                          </v-col>
                        </v-row>
                      </v-alert>
                    </v-list-item>
                  </div>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </div>

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
      JobDataItem: [],
      allJob: [],
      form: {
        jobId: '',
        flowId: '',
        stepId: '',
        fieldId: '',
        fieldValue: '',
        fieldName: ''
      },
      codeColor: [
        '#4D67AB',
        '#4E79C4',
        '#57A2AC',
        '#824D99',
        '#84C650',
        '#C65050',
        '#CE2220',
        '#E67F33',
        '#EB56F6',
        '#FED966'
      ],
      flowId: '',
      timeItem: [],
      clearInter: null,
      clearInterAll: null
    }
  },
  async mounted () {
    await this.getDataFlow()
    await this.getDataBranch()
    await this.getEmpSelect()
    // await this.getLayoutDefault()
  },
  methods: {
    async getInterval () {
      clearInterval(this.clearInterAll)
      this.clearInterAll = null
      this.clearInterAll = setInterval(this.getJobData, 20000)
    },
    async getall () {
      if (this.masBranchID !== '' && this.flowId !== '' && this.dateRange !== '') {
        await this.getStepFlow()
        await this.getLayout()
        await this.getJobData()
        await this.getTime()
        await this.getInterval()
      } else {
        this.$swal('ผิดพลาด', 'กรุณาเลือก ประเภทบริการ', 'error')
      }
    },
    getDataFlow () {
      this.DataFlowName = []
      console.log('DataFlowName', this.DataFlowName)
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
      console.log('DataBranchName', this.DataBranchName)
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
    async getLayout () {
      this.Layout = []
      // console.log('Branch' + this.masBranchID)
      // console.log('this.stepItemSelete', this.stepItemSelete)
      await axios
        .get(
          this.DNS_IP +
            '/WorkShopLayout/get?flowId=' +
            this.flowId +
            '&masBranchID=' + this.masBranchID +
            '&shopId=' +
            this.shopId
        )
        .then(response => {
          let rs = response.data
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            var workData = []
            var workDataUse = []
            workData = JSON.parse(d.workData)
            console.log('workData', workData)
            if (workData.length > 0) {
              for (let x = 0; x < workData.length; x++) {
                let t = workData[x]
                let s = {}
                s.sortNo = t.sortNo
                s.stepId = t.stepId
                var chkStepTitle = this.stepItemSelete.filter(el => { return el.stepId === t.stepId })
                if (chkStepTitle.length > 0) {
                  s.stepTitle = this.stepItemSelete.filter(el => { return el.stepId === t.stepId })[0].stepTitle
                  workDataUse.push(s)
                }
              }
            } else {
              workDataUse = []
            }
            this.Layout.push({
              workShopId: d.workShopId,
              workColum: d.workColum,
              workData: workDataUse
            })
          }
          // console.log('this.Layout', this.Layout)
        })
        .catch(error => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async getStepFlow () {
      this.stepItemSelete = []
      await axios
        .get(
          this.DNS_IP +
            '/flowStep/get?flowId=' +
            this.flowId +
            '&shopId=' +
            this.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.stepTitle
              d.value = d.stepId
              this.stepItemSelete.push(d)
            }
            // console.log('stepItemSelete', this.stepItemSelete)
          }
        })
    },
    async getEmpSelect () {
      this.empSeleteStep = []
      await axios
        .get(this.DNS_IP + '/empSelect/getUse?privacyPage=board&shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              var s = {}
              s.text = d.empFirst_NameTH + ' ' + d.empLast_NameTH
              s.value = d.empId
              this.empSeleteStep.push(s)
            }
            // console.log('empSeleteStep', this.empSeleteStep)
          }
        })
    },
    async getJobData () {
      console.log('test')
      // this.JobDataItem = []
      // this.allJob = []
      // let startDate = this.momenDate_1(this.dateRange.startDate)
      // let endDate = this.momenDate_1(this.dateRange.endDate)
      var JobDataItem = []
      var allJob = []
      axios
        .get(
          this.DNS_IP +
            '/job/get?checkUser=check&flowId=' +
            this.flowId +
            '&masBranchID=' + this.masBranchID +
            '&shopId=' +
            this.shopId + '&checkOnsite=is null'
        )
        .then(async response => {
          this.dataReady = true
          var jobs = []
          // console.log('res', response.data.length)
          // console.log('res', response.data)
          // console.log('userId', this.formUpdate.userId === 'NULL')
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              var d = response.data[i]
              d.userId = d.userId || ''
              if (jobs.indexOf(d.jobId) === -1) {
                jobs.push(d.jobId)
                if (d.userId !== '') {
                  var rss = response.data.filter(el => { return el.jobId === d.jobId })
                  for (var x = 0; x < response.data.filter(el => { return el.jobId === d.jobId }).length; x++) {
                    var s = rss[x]
                    // jobs.push(element.jobId)
                    JobDataItem.push(s)
                  }
                  allJob.push({
                    jobId: d.jobId,
                    jobNo: d.jobNo,
                    stepId: d.stepId,
                    checkCar: d.checkCar,
                    totalDateDiff: d.totalDateDiff,
                    endDate: d.endDate,
                    endTime: d.endTime,
                    checkPayment: d.checkPayment,
                    empStepId: d.empStepId,
                    empId: d.empId,
                    lineUserId: d.lineUserId,
                    userId: d.userId,
                    packageId: d.packageId,
                    statusTime: d.statusTime,
                    timeStart: d.timeStart,
                    timeEnd: d.timeEnd,
                    totalTime: d.totalTime,
                    flowName: d.flowName,
                    showTime: '',
                    countTime: 0
                  })
                }
              }
              if (JobDataItem.length > 0) {
                this.JobDataItem = JobDataItem
              } else {
                this.JobDataItem = []
              }
              if (allJob.length > 0) {
                this.allJob = allJob
              } else {
                this.allJob = []
              }
            }
            console.log('allJob', this.allJob)
          } else {
            this.JobDataItem = []
            this.allJob = []
            this.$swal('ไม่มีข้อมูล', 'กรุณาเลือกบริการใหม่', 'warning')
            clearInterval(this.setTimerJob)
            this.setTimerJob = null
          }
        })
    },
    async updateTimeEmp (itemsJob, status, empIdstep) {
      let dt = this.format_date(new Date())
      console.log('dtttttttttttt', dt)
      console.log('ddddddddddddddddd', itemsJob)
      itemsJob.Time = dt
      itemsJob.statusTime = status
      console.log('itemsJobitemsJob', itemsJob)
      if (status === 'closeStep') {
        itemsJob.empId = empIdstep
        if (itemsJob.empId !== '' && itemsJob.empId !== null) {
          await axios.post(this.DNS_IP + '/TimeEmp_Log_Update/get', itemsJob).then(async (response) => {

          }).catch((error) => {
            console.log('error function addData : ', error)
          })
        } else {
          console.log('ผิดพลาด', 'กรุณาเลือกพนักงานที่รับผิดชอบ', 'error')
        }
      } else {
        this.$swal({
          title: 'อัพเดท เวลา ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
          if (itemsJob.empId !== '' && itemsJob.empId !== null) {
            await axios.post(this.DNS_IP + '/TimeEmp_Log_Update/get', itemsJob).then(async (response) => {
              await this.$swal('เรียบร้อย', 'อัพเดทเวลาสำเร็จ', 'success')
              await this.getStepFlow()
              await this.getLayout()
              await this.getJobData()
            }).catch((error) => {
              console.log('error function addData : ', error)
            })
          } else {
            this.$swal('ผิดพลาด', 'กรุณาเลือกพนักงานที่รับผิดชอบ', 'error')
          }
        })
      }
    },
    async getTime () {
      await axios
        .get(this.DNS_IP + '/TimeEmp_Log/DashBord?shopId=' + this.$session.getAll().data.shopId).then((response) => {
          let rs = response.data
          console.log('rs', rs)
          let time = []
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (this.allJob.filter(i => { return i.jobId === d.jobId && i.stepId === d.stepId && i.empId === d.empId }).length > 0) {
                if (this.allJob.filter(i => { return i.jobId === d.jobId && i.stepId === d.stepId && i.empId === d.empId })[0].statusTime === 'timeEnd') {
                  let TimeNow = this.jsTimeDiff(this.allJob.filter(i => { return i.jobId === d.jobId && i.stepId === d.stepId && i.empId === d.empId })[0].timeStart)
                  d.totalTime = d.totalTime + TimeNow
                  d.showTime = this.convertHMS(d.totalTime)
                }
              } else {
                d.showTime = this.convertHMS(d.totalTime)
              }
              time.push(d)
            }
            this.timeItem = time
          }
          clearInterval(this.clearInter)
          this.clearInter = null
          this.clearInter = setInterval(this.setTimeshow, 1000)
        }).catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    setTimeshow (tr, dt) {
      for (let i = 0; i < this.allJob.length; i++) {
        let d = this.allJob[i]
        // if (d.statusTime === 'timeEnd') {
        //   // console.log('showTime', this.jsTimeDiff(new Date(d.timeStart)))
        // }
        if (this.timeItem.filter((item) => { return item.jobId === d.jobId && item.stepId === d.stepId }).length > 0) {
          let showTime = this.timeItem.filter((item) => { return item.jobId === d.jobId && item.stepId === d.stepId })[0].totalTime
          if (d.countTime === 0) {
            d.countTime = showTime + 1
          } else {
            d.countTime = d.countTime + 1
          }
          d.showTime = this.convertHMS(d.countTime)
          // console.log('test', d.countTime)
          // console.log('showTime', d.showTime)
        }
      }
    },
    convertHMS (value) {
      const sec = parseInt(value, 10) // convert value to number if it's string
      let hours = Math.floor(sec / 3600) // get hours
      let minutes = Math.floor((sec - (hours * 3600)) / 60) // get minutes
      let seconds = sec - (hours * 3600) - (minutes * 60) // get seconds
      // add 0 if value < 10; Example: 2 => 02
      if (hours < 10) { hours = '0' + hours }
      if (minutes < 10) { minutes = '0' + minutes }
      if (seconds < 10) { seconds = '0' + seconds }
      return hours + ':' + minutes + ':' + seconds // Return is HH : MM : SS
    },
    jsTimeDiff (strDateTime1) {
      // var oneday = 1000 * 60
      let strDateTime2 = new Date()
      var defDate = (strDateTime2.getTime() - new Date(strDateTime1).getTime()) / 1000
      // console.log('def', defDate)
      return defDate
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
