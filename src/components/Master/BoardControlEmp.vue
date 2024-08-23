<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-7 pr-12 pb-0 col-md-12 ml-sm-auto col-lg-12 px-4">
        <!-- <v-col class="ma-2" id="text-Board">กระดานทำงาน</v-col> -->
      </div>
      <div class="pl-2 pr-2 pt-0 col-md-12 ml-sm-auto col-lg-12 px-4">
            <v-card>
              <v-toolbar
                color="#1b437c"
                dark
                flat
                v-if="flownameTap.length > 0"
              >
                <v-toolbar-title>
                  <v-row>
                  <v-col cols="12">
                    <h5 class="mb-0">
                      <v-icon
                        x-large
                        class="mb-3 mr-2"
                        style="font-size:40px !important;"
                        color="#FFFFFF"
                      >
                        mdi-account-cog
                      </v-icon>
                      {{this.$session.getAll().data.userFirst_NameTH}}
                    </h5>
                  </v-col>
                  </v-row>
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <template v-slot:extension>
                  <v-tabs
                    v-model="tab"
                    align-with-title
                  >
                    <v-tabs-slider color="yellow"></v-tabs-slider>

                    <v-tab
                    class="ms-2"
                      v-for="(item , index) in flownameTap"
                      :key="index"
                    >
                      {{ item }}
                    </v-tab>
                  </v-tabs>
                </template>
              </v-toolbar>

              <v-tabs-items v-model="tab">
                <v-tab-item
                  v-for="(item , index) in flownameTap"
                      :key="index"
                >
                  <v-card
                  class="pa-4 pt-5"
                  min-height="715px"
                  flat
                  color="#F2F4F4"
                  >
                    <v-card
                    v-for="(itemsJob, indexJob) in allJob.filter(i => {return i.flowName === item})" :key="indexJob"
                    class="mt-4 pt-3 pb-4"
                    min-height="110px"
                    :style="'background: linear-gradient(to right,'+ codeColor[index] + ' 65%,#FFFFFF 35%);'"

                    >
                      <v-row >
                        <v-col cols="8" class="pa-2 pl-8 pb-4 mb-n1">
                          <h4 class="ma-0 mt-1 text-center font-weight-medium" style="height:22px;color:#FFFFFF;">
                            <v-icon color="yellow" class="mr-1 mb-2">mdi-hammer-wrench</v-icon>
                            {{JobDataItem.filter(row => { return row.jobId == itemsJob.jobId})[0].stepTitle}}
                          </h4>
                          <v-card-title
                          v-for="(items, index) in JobDataItem.filter(row => { return row.jobId == itemsJob.jobId})" :key="index"
                          >
                          <div style="height:22px;color:#FFFFFF;" v-if="items.showCard === 'True' && items.fieldValue !== ''">
                            <v-tooltip
                            color="#1b437c"
                            v-if="items.fieldValue.length > 14"
                            top
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <h4
                                  class="ma-0 mt-1"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                {{ items.fieldValue.substring(0, 14)}}...
                                </h4>
                              </template>
                              <span>{{items.fieldValue}}</span>
                            </v-tooltip>
                            <h4 v-if="items.fieldValue.length <= 14" class="ma-0 mt-1">{{ items.fieldValue}}</h4>
                          </div>
                          </v-card-title>
                        </v-col>
                        <v-col cols="4" class="ps-6 pb-4 mb-n1">
                          <v-col class="mb-n7 pa-0" style="left:55px;right: 0px;bottom:10px">
                                  <v-tooltip top
                                v-if="parseInt(itemsJob.totalDateDiff) <= 2"
                                color="#DE6467"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
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
                             </v-col>
                                <v-icon
                                  v-if="itemsJob.statusTime === 'timeStart' || itemsJob.statusTime === null"
                                  style="font-size:40px !important;"
                                  class="mt-3 ms-2"
                                    x-large
                                    color="#84C650"
                                    @click="updateTimeEmp(itemsJob,'timeStart')"
                                  >
                                    mdi-timer
                                </v-icon>
                                <v-icon
                                  v-if="itemsJob.statusTime === 'timeEnd' && itemsJob.statusTime !== null"
                                  style="font-size:40px !important;"
                                  class="mt-3 ms-2"
                                    x-large
                                    color="#DE6467"
                                    @click="updateTimeEmp(itemsJob,'timeEnd')"
                                  >
                                    mdi-timer-off
                                </v-icon>
                                <p
                                class="font-weight-black"
                                v-if="itemsJob.statusTime === 'timeEnd' && itemsJob.statusTime !== null"
                                >
                                {{itemsJob.showTime}}
                                </p>
                                <p
                                class="font-weight-black"
                                  v-if="itemsJob.statusTime === 'timeStart' && itemsJob.statusTime !== null"
                                >
                                {{convertHMS(timeItem.filter((item) => item.jobId === itemsJob.jobId && item.stepId === itemsJob.stepId && item.empId === itemsJob.empId)[0].totalTime)}}
                                </p>
                                <p
                                class="font-weight-black"
                                  v-if="itemsJob.statusTime === null"
                                >
                                00:00:00
                                </p>

                        </v-col>
                      </v-row>
                    </v-card>

                  </v-card>
                </v-tab-item>
              </v-tabs-items>
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
// import moment from 'moment' // แปลง date

export default {
  name: 'hello',
  components: {
    draggable,
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    Menu
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
    return {
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
      menu: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      lineUserId: '',
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
        '#57A2AC',
        '#824D99',
        '#84C650',
        '#C65050',
        '#CE2220',
        '#E67F33',
        '#EB56F6',
        '#FED966',
        '#4D67AB',
        '#4E79C4'
      ],
      checkPayment: 'True',
      setTimerJob: '',
      packageId: '',
      dataPackage: [],
      flowId: '',
      dataCoin: '',
      productExchangeRateId: '',
      flownameTap: [],
      tab: null,
      timeItem: [],
      clearInter: null,
      localStorageTimeCount: 0
    }
  },
  async mounted () {
    clearInterval(this.clearInter)
    this.clearInter = null
    await this.beforeCreate()
  },
  methods: {
    async beforeCreate () {
      if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
        if (JSON.parse(localStorage.getItem('sessionData')).shopId === this.$route.query.shopId && JSON.parse(localStorage.getItem('sessionData')).empId === this.$route.query.empId) {
          if (this.$session.id() !== undefined) {
            await this.getJobData()
            await this.getTime()
          } else {
            this.$session.start()
            this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
            location.reload()
            // await this.getDataFlow()
            // await this.checkJobList()
          }
        } else {
          if (this.$session.id() === undefined) {
            this.$session.start()
            this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
            // await this.getDataFlow()
            location.reload()
          } else {
            await this.getJobData()
            await this.getTime()
          }
        }
      } else {
        if (!this.$session.exists()) {
          this.$router.push('/Core/Login')
        } else {
          if (this.$session.id() !== undefined && this.$route.query.type === undefined) {
            localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
            await this.getJobData()
            await this.getTime()
          } else {
            this.$router.push('/Core/Login')
          }
        }
      }
      // console.log(JSON.stringify(this.$session.getAll().data))
    },
    async getJobData () {
      // this.JobDataItem = []
      // this.allJob = []
      var JobDataItem = []
      var allJob = []
      axios
        .get(this.DNS_IP + '/job/get?checkUser=check&shopId=' + this.shopId + '&empId=' + this.$session.getAll().data.empId + '&checkOnsite=is null')
        .then(async response => {
          this.dataReady = true
          var jobs = []
          // console.log('res', response.data.length)
          let itemstart = []
          let itemEnd = []
          // console.log('res', response.data)
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
                  if (d.statusTime === 'timeEnd') {
                    console.log('TTTTTTTTTTTT')
                    itemstart.push({
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
                  } else {
                    console.log('AAAAAAAAAAAA')
                    itemEnd.push({
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
              }
              if (JobDataItem.length > 0) {
                this.JobDataItem = JobDataItem
              } else {
                this.JobDataItem = []
              }
            }
            allJob.push(...itemstart, ...itemEnd)
            // console.log('allJob', allJob)
            if (allJob.length > 0) {
              this.allJob = allJob
            } else {
              this.allJob = []
            }
          } else {
            this.JobDataItem = []
            this.allJob = []
            this.$swal('ไม่มีข้อมูล', 'กรุณาเลือกบริการใหม่', 'warning')
            clearInterval(this.setTimerJob)
            this.setTimerJob = null
          }
          this.genflownameTap()
        })
    },
    async genflownameTap () {
      let dt = []
      this.allJob.forEach((v, k) => {
        dt.push(v.flowName)
      })
      this.flownameTap = Array.from(new Set(dt))
    },
    async updateTimeEmp (itemsJob, status) {
      this.$swal({
        title: 'อัพเดท เวลา ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ยกเลิก'
      }).then(async (result) => {
        let dt = this.format_date(new Date())
        clearInterval(this.clearInter)
        // console.log('dtttttttttttt', dt)
        itemsJob.Time = dt
        itemsJob.statusTime = status
        // console.log('itemsJobitemsJob', itemsJob)
        if (itemsJob.empId !== '' && itemsJob.empId !== null) {
          await axios.post(this.DNS_IP + '/TimeEmp_Log_Update/get', itemsJob).then(async (response) => {
            await this.$swal('เรียบร้อย', 'อัพเดทเวลาสำเร็จ', 'success')
            await this.getJobData()
            await this.getTime()
          }).catch((error) => {
            console.log('error function addData : ', error)
          })
        } else {
          this.$swal('ผิดพลาด', 'กรุณาเลือกพนักงานที่รับผิดชอบ', 'error')
        }
      })
    },
    async getTime () {
      await axios
        .get(this.DNS_IP + '/TimeEmp_Log/totalTime/' + this.$session.getAll().data.empId).then((response) => {
          let rs = response.data
          let time = []
          // let refreshTime = localStorage.getItem('timecount') ? localStorage.getItem('timecount') : 0
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (this.allJob.filter(i => { return i.jobId === d.jobId && i.stepId === d.stepId && i.empId === d.empId }).length > 0) {
                if (this.allJob.filter(i => { return i.jobId === d.jobId && i.stepId === d.stepId && i.empId === d.empId })[0].statusTime === 'timeEnd') {
                  // console.log('505')
                  // console.log('start time', this.allJob.filter(i => { return i.jobId === d.jobId && i.stepId === d.stepId && i.empId === d.empId })[0].timeStart)
                  let TimeNow = this.jsTimeDiff(this.allJob.filter(i => { return i.jobId === d.jobId && i.stepId === d.stepId && i.empId === d.empId })[0].timeStart)
                  d.totalTime = (d.totalTime / 60) + TimeNow
                  d.showTime = this.convertHMS(d.totalTime * 60)
                  // console.log('ddddd', d.totalTime)
                  // console.log('TimeNow', d.showTime)
                  // console.log('showTime', this.convertHMS(((d.totalTime / 60) + TimeNow) * 60))
                }
              } else {
                d.showTime = this.convertHMS(d.totalTime * 60)
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
          let showTime = this.timeItem.filter((item) => { return item.jobId === d.jobId && item.stepId === d.stepId })[0].totalTime / 60
          if (d.countTime === 0) {
            d.countTime = showTime + 1
            // console.log('if', typeof showTime)
          } else {
            d.countTime = d.countTime + 1
            // console.log('else', d)
          }
          d.showTime = this.convertHMS(d.countTime)
          // console.log('test', this.jsTimeDiff(d.timeStart))
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
      console.log('new Date()', new Date())
      let strDateTime2 = new Date()
      var defDate = (strDateTime2.getTime() - new Date(strDateTime1).getTime()) / 60000
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
  background-color: #f0eeee;
  margin-left: 1.5px;
}
.allFrame {
  padding-top: 0px;
  width: 100%;
  height: max-content;
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
  width: auto;
  height: auto;
  border-radius: 2px;
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
