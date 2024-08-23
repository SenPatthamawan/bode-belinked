<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
          <v-col cols="6"> </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="4">
            <v-menu
              v-model="menuDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="today"
                  label="วันที่"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="today"
                @input="(menuDate = false), getBookingList()"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="4">
            <!-- <v-select
              :items="DataBranchName"
              v-model="masBranchName"
              dense
              outlined
              filled
              hide-details
              item-text="text"
              item-value="value"
              return-object
              label="สาขา"
              prepend-inner-icon="mdi-map-marker"
              @change="getByBranch()"
              class="ma-2"
            ></v-select> -->
            <v-select
              :items="DataBranchName"
              v-model="masBranchName"
              @change="getByBranch()"
              dense
              outlined
              filled
              hide-details
              label="สาขา"
              prepend-inner-icon="mdi-map-marker"
              class="ma-2"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              v-if="masBranchName !== '' && masBranchName !== null"
              :items="DataFlowName"
              v-model="flowId"
              dense
              outlined
              filled
              @change="getBookingList()"
              hide-details
              label="ประเภทบริการ"
              prepend-inner-icon="mdi-format-list-bulleted"
              class="ma-2"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            <v-alert
              color="primary"
              dark
              icon="mdi-account-clock"
              border="left"
              prominent
            >
              จำนวนลูกค้าต่อวัน : {{ countCus || 0 }}
            </v-alert>
          </v-col>
          <v-col cols="12">
            <v-card elevation="7" v-if="dataReady">
              <v-card-text>
                <v-sheet height="64">
                  <v-toolbar dense>
                    <v-btn
                      fab
                      text
                      small
                      color="grey darken-2"
                      @click="prev()"
                    >
                      <v-icon small>
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                    <v-btn
                      fab
                      text
                      small
                      color="grey darken-2"
                      @click="next()"
                    >
                      <v-icon small>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="$refs.calendar">{{
                      $refs.calendar.title
                    }}</v-toolbar-title>

                    <v-spacer></v-spacer>
                    <v-btn
                      :loading="loadingExport"
                      :disabled="loadingExport"
                      color="success" @click="exportExcel()" v-if="dataItemTimesChange.length > 0 && $session.getAll().data.shopId !== 'U9084920b3005bd1dcb57af1ae6bdba32'">
                      <v-icon right class="white--text">mdi-microsoft-excel</v-icon>
                      &nbsp;Export
                    </v-btn>
                    &nbsp;
                    <v-menu
                      bottom
                      right
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          outlined
                          color="grey darken-2"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <span>{{ typeToLabel[type] }}</span>
                          <v-icon right>
                            mdi-menu-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <!-- <v-list-item class="vlistitem" @click="type = 'week', getBookingList()">
                          <v-list-item-title>Week</v-list-item-title>
                        </v-list-item> -->
                        <v-list-item class="vlistitem" @click="type = 'month', getBookingList()">
                          <v-list-item-title>Month</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-toolbar>
                </v-sheet>
                <v-sheet>
                  <v-calendar
                    ref="calendar"
                    :now="today"
                    v-model="today"
                    :events="events"
                    locale="th-TH"
                    @click:event="showEvent"
                    color="primary"
                    :type="type"
                  >
                  <template v-slot:day-label="{ day }">
                    <span style="font-size:20px !important;">{{day}}</span>
                  </template>
                  <template v-slot:day="{ date }">
                    <div v-if="eventInfo[date] && eventInfo[date].all > 0" :class="(date === today) ? 'today' : ''">
                      <v-row>
                        <v-col>
                          <v-progress-linear
                            :value="eventInfo[date].allPercent"
                            :color="(eventInfo[date].allPercent >= 100) ? 'red lighten-1' : ((eventInfo[date].allPercent < 80) ? 'green lighten-1' : 'yellow lighten-1' ) "
                            height="20"
                            style="cursor: pointer"
                            @click.native="openTaskList(date, 'all')"
                          >
                            <template v-slot:default="{}">
                              {{ eventInfo[date].all }} / {{ countCus }}
                            </template>
                          </v-progress-linear>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="text-center mb-1 mt-0">
                          <v-badge
                            avatar
                            bordered
                            overlap
                            color="orange darken-1"
                            v-if="eventInfo[date].fastTrack > 0"
                            class="mr-1"
                            style="cursor: pointer"
                            @click.native="openTaskList(date, 'fastTrack')"
                          >
                            <template v-slot:badge>
                              <v-avatar class="mb-1" color="orange darken-1">
                                {{eventInfo[date].fastTrack}}
                              </v-avatar>
                            </template>

                            <v-avatar size="40" color="orange darken-3">
                              <v-icon dark>
                                  mdi-flash
                              </v-icon>
                            </v-avatar>
                          </v-badge>
                          <v-badge
                            avatar
                            bordered
                            overlap
                            color="blue darken-1"
                            v-if="eventInfo[date].normal > 0 || eventInfo[date].normalExtra > 0"
                            class="mr-1"
                            style="cursor: pointer"
                            @click.native="openTaskList(date, 'normal')"
                          >
                            <template v-slot:badge>
                              <v-avatar class="mb-1" color="blue darken-1" v-if="eventInfo[date].normal > 0">
                                {{eventInfo[date].normal - eventInfo[date].normalExtra}}
                              </v-avatar>
                              <v-avatar class="mb-1" color="red darken-1" v-if="eventInfo[date].normalExtra > 0">
                                {{eventInfo[date].normalExtra}}
                              </v-avatar>
                            </template>

                            <v-avatar size="40" color="blue darken-3">
                              <v-icon dark>
                                  mdi-clock-outline
                              </v-icon>
                            </v-avatar>
                          </v-badge>
                        </v-col>
                      </v-row>
                    </div>
                  </template>
                  </v-calendar>
                </v-sheet>
              </v-card-text>
            </v-card>
            <div class="text-center">
              <v-dialog v-model="dialog" width="600">
                <v-card>
                  <v-card-title class="grey lighten-2">
                    รายชื่อลูกค้านัดหมาย
                  </v-card-title>
                  <br />
                  <template v-for="(sumItems, index1) in dataSummary">
                    <v-row v-bind:key="'sum'+index1" no-gutters>
                    <template v-for="(items, index2) in sumItems">
                      <v-col cols="auto" v-bind:key="'sum'+index1+index2">
                        <v-chip
                          class="ma-2"
                          :color="index1 + ' darken-2'"
                          text-color="white"
                        >
                          <v-avatar
                            left
                            :class="index1 + ' darken-4'"
                          >
                            {{items.length}}
                          </v-avatar>
                          {{index2}}
                        </v-chip>
                      </v-col>
                    </template>
                    </v-row>
                  </template>
                  <v-card-text
                    v-for="(items, index) in dataCalendar"
                    :key="index"
                  >
                  <!-- {{ items.tagDataShow }}
                  {{ items.memberDataTag }} -->
                    <v-card elevation="2">
                      <v-list-item :style="((items.bgcolor) ? 'background-color:' + items.bgcolor + ' !important' : '') ">
                        <v-list-item-content>
                          <v-row style="color:#fff;">
                            <v-col cols="3">
                              <!-- <h3>{{items.timeDue}}</h3><br> -->
                              <h3>{{items.timeText}}</h3><br>
                              <v-icon dark class="mr-1" v-if="items.fastTrack === 'true' || items.fastTrack === 'True'">
                                  mdi-flash
                              </v-icon>
                              <v-icon dark class="mr-1" v-else-if="items.extraJob === 'true' || items.extraJob === 'True'">
                                  mdi-alarm-plus
                              </v-icon>
                              <v-icon dark class="mr-1" v-else>
                                  mdi-clock-outline
                              </v-icon>
                            </v-col>
                            <v-col cols="9">
                              <v-row>
                                <v-col cols="8"><h4>คุณ {{ items.name }}</h4></v-col>
                                 <!-- <v-col cols="10" v-if="items.memberDataTag.length > 0" class="pt-0 pb-0">
                              <v-chip v-for="(tag, index) in items.tagDataShow" :key="index"
                              small class="mr-2 mb-2" >
                                {{ tag.text }}
                              </v-chip>
                            </v-col> -->
                            <v-col cols="4" class="text-right">{{items.licenseNo}}</v-col>
                              </v-row>
                               <v-col cols="12 ps-0" v-if="items.memberDataTag.length > 0">
                          <v-chip v-for="(tag, index) in items.tagDataShow" :key="index" small class="mr-2 mb-2">
                            {{ tag.text }}
                          </v-chip>
                      </v-col>
                              {{ items.serviceDetail }}<br>
                              โทร {{ items.tel }}
                              {{ items.carModel === '' ? '' : 'รุ่นรถ ' + items.carModel }}<br>
                              {{ items.bookingEmpFlowName === '' ? '' : 'พนักงาน ' + items.bookingEmpFlowName }}<br>
                              <!-- {{ items.dueDateFix }} -->
                          <div>{{ items.dueDateFix.split(' ')[0].split('-')[2] + '/' + items.dueDateFix.split(' ')[0].split('-')[1] + '/' + items.dueDateFix.split(' ')[0].split('-')[0] }}</div>
                          <div>{{ items.dueDateFix.split(' ')[1] + ' น.' + items.dueDateEnd }}</div>
                            </v-col>
                          </v-row>
                          <!-- <v-list-item-subtitle>
                            <v-btn
                              color="success"
                              fab
                              id="v-step-2"
                              v-if="items.statusBt !== 'confirmJob'"
                              :disabled="items.chkConfirm"
                              small
                              @click.stop="confirmChk(items)"
                            >
                              <v-icon dark> mdi-phone-check </v-icon>
                            </v-btn>
                            <v-btn
                              color="error"
                              fab
                              v-if="items.statusBt !== 'confirmJob'"
                              id="v-step-2"
                              small
                              :disabled="items.chkCancel"
                              @click.stop="cancelChk(items)"
                            >
                              <v-icon dark> mdi-phone-cancel </v-icon>
                            </v-btn>
                          </v-list-item-subtitle> -->
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false">
                      ยืนยัน
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import draggable from 'vuedraggable'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import moment from 'moment-timezone' // แปลง date
import XLSX from 'xlsx' // import xlsx

export default {
  name: 'BookingList',
  components: {
    draggable,
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
  },
  data () {
    return {
      session: this.$session.getAll(),
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'ปฏิทินลูกค้านัดหมาย',
          disabled: false,
          href: '/Master/CalendarBooking'
        }
      ],
      dataReady: true,
      today: this.momenDate_1(new Date()),
      events: [],
      countCus: 0,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      menuDate: false,
      dialog: false,
      dataCalendar: [],
      dataSummary: [],
      DataFlowName: [],
      colors: [
        'blue',
        'indigo',
        'deep-purple',
        'cyan',
        'green',
        'orange',
        'grey darken-1'
      ],
      DataBranchName: [],
      masBranchName: '',
      flowId: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week'
      },
      eventInfo: [],
      monthData: null,
      bookingData: [],
      editedItemSeleteField: [],
      dataItemTime: [],
      dataItemTimesChange: [],
      dataexport: [],
      loadingExport: false
    }
  },
  beforeCreate () {
    if (!this.$session.exists()) {
      this.$router.push('/Core/Login')
    }
  },
  async mounted () {
    this.getCustomFieldStart()
    await this.getDataBranch()
    await this.getDataFlow()
    await this.getBookingList()
    this.$refs.calendar.checkChange()
    // await this.getBookingData()
  },
  methods: {
    prev () {
      this.$refs.calendar.prev()
      this.getBookingList()
      // this.getBookingData()
    },
    next () {
      this.$refs.calendar.next()
      this.getBookingList()
      // this.getBookingData()
    },
    async getByBranch () {
      this.flowId = ''
      await this.getDataFlow()
      this.getBookingList()
    },
    async getDataFlow () {
      this.DataFlowName = []
      await axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.$session.getAll().data.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.DataFlowName.push({text: 'ทั้งหมด', value: 'allFlow'})
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              console.log('masBranchName', this.masBranchName)
              if (d.masBranchID === this.masBranchName.toString() || d.masBranchID === 'All' || d.masBranchID === null) {
                console.log('d', d)
                d.text = d.flowName
                d.value = d.flowId
                this.DataFlowName.push(d)
              } else {
                console.log('d3', d)
              }
            }
            this.flowId = this.DataFlowName[0].value
          } else {
            this.DataFlowName = []
          }
        })
    },
    async getDataBranch () {
      this.DataBranchName = []
      await axios
        .get(
          this.DNS_IP +
            '/master_branch/get?shopId=' +
            this.$session.getAll().data.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              // d.text = d.masBranchName
              // d.value = d.masBranchName
              // this.DataBranchName.push(d)
              if (this.session.data.masBranchID === '' || this.session.data.masBranchID === null) {
                console.log('TEST1', d.masBranchID, this.session.data.masBranchID)
                d.text = d.masBranchName
                d.value = d.masBranchID
                this.DataBranchName.push(d)
              } else {
                console.log('TEST', d.masBranchID, this.session.data.masBranchID)
                if (d.masBranchID === this.session.data.masBranchID) {
                  d.text = d.masBranchName
                  d.value = d.masBranchID
                  this.DataBranchName.push(d)
                }
              }
            }
            this.masBranchName = this.DataBranchName[0].value
          } else {
            this.DataBranchName = []
          }
        })
    },
    // async getDataBranch () {
    //   this.DataBranchName = []
    //   await axios
    //     .get(
    //       this.DNS_IP +
    //         '/master_branch/get?shopId=' +
    //         this.$session.getAll().data.shopId
    //     )
    //     .then(async response => {
    //       let rs = response.data
    //       if (rs.length > 0) {
    //         for (var i = 0; i < rs.length; i++) {
    //           var d = rs[i]
    //           d.text = d.masBranchName
    //           d.value = d.masBranchID
    //           this.DataBranchName.push(d)
    //         }
    //         this.masBranchName = this.DataBranchName[0].value
    //       } else {
    //         this.DataBranchName = []
    //       }
    //     })
    // },
    async getBookingData () {
      this.bookingData = []
      const dateSplit = this.today.split('-')
      const year = String(dateSplit[0])
      const month = String(dateSplit[1])
      let url = ''
      if (this.flowId === 'allFlow') {
        url = `${this.DNS_IP}/BookingData/getView?shopId=${this.$session.getAll().data.shopId}&dueDate=${year}-${month}&masBranchID=${this.masBranchName}`
      } else {
        url = `${this.DNS_IP}/BookingData/getView?shopId=${this.$session.getAll().data.shopId}&dueDate=${year}-${month}&masBranchID=${this.masBranchName}&flowId=${this.flowId}`
      }
      // let url = `${this.DNS_IP}/BookingData/get?shopId=${this.$session.getAll().data.shopId}&dueDate=${year}-${month}&masBranchName=${this.masBranchName.text}`
      await axios
        .get(url)
        .then(async response => {
          response.data.forEach((row) => {
            if (typeof (this.bookingData[row.bookNo]) === 'undefined') {
              this.bookingData[row.bookNo] = []
            }
            this.bookingData[row.bookNo].push(row)
          })
        })
    },
    async getTagData () {
      console.log('getTagData')
      this.tagItem = await this.getDataFromAPI('/Mas_Tag/get', 'tagId', 'tagName', '')
      console.log(this.tagItem)
    },
    getDataFromFieldName (data, key) {
      if (data !== undefined) {
        return data.filter(function (el) {
          return el.fieldName === key
        })
      } else {
        return []
      }
    },
    async countTime (time, setTime, timeSlotCustomer) {
      try {
        if (!setTime || timeSlotCustomer <= 0 || timeSlotCustomer > setTime.length) {
          return '' // กรณีไม่มีข้อมูลหรือ timeSlotCustomer ไม่ถูกต้อง
        }
        // console.log('setTimeLength', setTime.length)
        // ค้นหาเวลาเริ่มต้นใน setTime
        const startTimeInfo = setTime.find(slot => slot.text === time || slot.value === time)
        const findIndex = setTime.findIndex(slot => slot.text === time || slot.value === time)
        // console.log('startTime', findIndex, startTimeInfo)
        if (startTimeInfo) {
          // หาเวลาสิ้นสุดโดยใช้ timeSlotCustomer
          let endTimeInfo = ''
          if (findIndex + timeSlotCustomer >= setTime.length) {
            endTimeInfo = ' เป็นต้นไป'
          } else {
            endTimeInfo = '- ' + setTime[startTimeInfo.id + timeSlotCustomer - 1].value + ' น.'
          }
          // console.log('endTimeInfo', endTimeInfo)
          return endTimeInfo || ''
        } else {
          return ''
        }
      } catch (error) {
        return ''
      }
    },
    async getBookingList () {
      try {
        await this.getTagData()
      } catch (error) {
        console.log(error)
      }

      // this.getBookingData()
      // if (this.masBranchName) {
      //   this.masBranchName = this.masBranchName
      // } else {
      //   this.masBranchName = this.DataBranchName[0]
      // }
      // Clear Data ทุกครั้ง
      this.events = []
      // Clear ช่องค้นหา
      this.searchAll2 = ''
      const dateSplit = this.today.split('-')
      // console.log(dateSplit)
      // const date = dateSplit[0].split('-')
      const year = String(dateSplit[0])
      const month = String(dateSplit[1])
      let countCustomer = this.DataBranchName.filter(el => { return el.value === this.masBranchName })
      this.countCus = countCustomer.length > 0 ? countCustomer[0].countCus : 0
      if (this.type === 'month') {
        let url = ''
        let dataItems = []
        let dataItemTimes = []
        this.dataItemTime = []
        if (this.flowId === 'allFlow') {
          console.log('IFTRUE')
          url = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&dueDate=' +
            year +
            '-' +
            month +
            '&masBranchID=' +
            this.masBranchName
        } else {
          url = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&dueDate=' +
            year +
            '-' +
            month +
            '&masBranchID=' +
            this.masBranchName +
            '&flowId=' + this.flowId
        }
        await axios
          .get(url)
          .then(async responses => {
            this.monthData = []
            this.eventInfo = []
            console.log('res---------', responses.data)
            for (var x = 0; x < responses.data.length; x++) {
              var e = responses.data[x]
              let dueDate = e.dueDate
              dueDate = dueDate.split(' ')
              dueDate = dueDate[0]
              let endTime = await this.countTime(e.timeText, (JSON.parse(e.bookingEmpSetTime) || []), e.timeSlotCustomer)
              e.dueDateFix = e.dueDate || ''
              e.dueDateEnd = endTime || ''

              if (typeof this.eventInfo[dueDate] === 'undefined') {
                this.monthData[dueDate] = []
                this.eventInfo[dueDate] = {'timeDue': e.timeDue, 'all': 0, 'allPercent': 0, 'fastTrack': 0, 'extraJob': 0, 'normal': 0, 'normalExtra': 0}
              }
              this.monthData[dueDate].push(e)
              if (e.statusBt) {
                if (e.statusBt === 'confirm' || e.statusBt === 'confirmJob') {
                  this.eventInfo[dueDate].all++
                  this.eventInfo[dueDate].allPercent = this.eventInfo[dueDate].all * 100 / this.countCus
                  if (e.fastTrack === 'True' || e.fastTrack === 'true') {
                    this.eventInfo[dueDate].fastTrack++
                  } else {
                    if (e.extraJob === 'True' || e.extraJob === 'true') {
                      this.eventInfo[dueDate].normalExtra++
                    }
                    this.eventInfo[dueDate].normal++
                  }
                }
              }
              let s = {}
              s.statusUpload1 = e.statusUpload1 || 'False'
              s.statusUpload2 = e.statusUpload2 || 'False'
              s.fileUpload1 = e.fileUpload1 || '[]'
              s.fileUpload2 = e.fileUpload2 || '[]'
              s.bookNo = e.bookNo
              s.flowId = e.flowId
              s.flowName = e.flowName
              s.dueDate = e.dueDate
              s.bookingEmpFlowName = e.bookingEmpFlowName
              // console.log('s.dueDate', s.dueDate)
              s.dueDateDay = e.dueDateDay
              s.dueDateTimeStamp = e.dueDateTimeStamp
              s.remarkRemove = e.remarkRemove
              s.remark = e.remark
              s.userId = e.userId
              s.chkConfirm = false
              s.chkCancel = false
              s.jobNo = e.jobNo
              s.empFull_NameTH = e.empFull_NameTH
              s.extraJob = (e.extraJob === 'true' || e.extraJob === 'True')
              s.fastTrack = (e.fastTrack === 'true' || e.fastTrack === 'True')
              s.remarkRemove = e.remarkRemove || ''
              s.timeDueHtext = e.timeDueH + ':00'
              s.timeDuetext = e.timeDue
              s.timeDueEnd = endTime
              if (e.statusUseBt === 'use' && e.statusBt === 'confirm') {
                s.chkConfirm = true
                s.chkCancel = false
              }
              if (e.statusUseBt === 'use' && e.statusBt === 'cancel') {
                s.chkConfirm = false
                s.chkCancel = true
              }
              s.statusBt = e.statusBt || 'wait'
              switch (e.statusBt) {
                case 'confirm':
                  s.statusBtText = 'ยืนยันแล้ว'
                  break
                case 'cancel':
                  s.statusBtText = 'ยกเลิก'
                  break
                case 'confirmJob':
                  s.statusBtText = 'รับรถแล้ว'
                  break
                default:
                  s.statusBtText = 'รายการนัดหมายใหม่'
                  break
              }
              var chkTime = this.dataItemTime.filter(el => { return el.timeDueHtext === s.timeDueHtext })
              if (chkTime.length === 0) {
                dataItemTimes.push(s)
              }
              // s.cusName = this.getDataFromFieldName(this.bookingData[e.bookNo], 'ชื่อ')
              // s.cusReg = this.getDataFromFieldName(this.bookingData[e.bookNo], 'เลขทะเบียน')
              // s.tel = this.getDataFromFieldName(this.bookingData[e.bookNo], 'เบอร์โทร')
              // s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
              // s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
              // s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
              s.cusName = e.bookingDataCustomerName || ''
              s.cusReg = e.bookingDataCustomerRegisNumber || ''
              s.tel = e.bookingDataCustomerTel || ''
              s.carModel = e.bookingDataCustomerCarModel || ''
              s.displayFlowName = e.displayFlowName || ''
              let memberDataTag = s.memberDataTag || []
              let checkType = typeof s.memberDataTag
              // console.log('type', checkType)
              // console.log('memberDataTag', memberDataTag)
              // console.log('memTag', s.memberDataTag)

              try {
                s.memberDataTag = checkType === 'string' ? JSON.parse(s.memberDataTag) : memberDataTag
                if (Array.isArray(s.memberDataTag) && s.memberDataTag.length > 0) {
                  s.tagDataShow = []
                  let memberDataTag = s.memberDataTag
                  for (let i = 0; i < memberDataTag.length; i++) {
                    let e = memberDataTag[i]
                    let x = {}
                    let checkTagItem = this.tagItem.filter(el => { return el.value === e })
                    if (checkTagItem.length > 0) {
                      x.text = checkTagItem[0].text
                      x.value = checkTagItem[0].value
                      s.tagDataShow.push(x)
                    }
                  }
                }

                // console.log('dTag', d.memberDataTag)
              } catch (error) {
                s.tagDataShow = []
                console.log(error)
              }
              dataItems.push(s)
            }
            this.dataReady = true
            console.log('dataItems', dataItems)
            if (dataItems.length === 0 || dataItems.status === false) {
              this.dataItemTimesChange = []
              this.dataItemTime = []
            } else {
              this.dataItemTimesChange = dataItems.sort((a, b) => {
                if (a.timeDuetext < b.timeDuetext) return -1
                return a.timeDuetext > b.timeDuetext ? 1 : 0
              })
              var datause = dataItemTimes.sort((a, b) => {
                if (a.timeDueHtext < b.timeDueHtext) return -1
                return a.timeDueHtext > b.timeDueHtext ? 1 : 0
              })
              for (var k = 0; k < datause.length; k++) {
                var t = datause[k]
                var h = {}
                h.timeDueHtext = t.timeDueHtext
                let chkTimes = this.dataItemTime.filter(el => { return el.timeDueHtext === t.timeDueHtext })
                if (chkTimes.length === 0) {
                  this.dataItemTime.push(h)
                }
              }
              this.dataRemoveExport = this.dataItemTimesChange.filter(el => { return el.statusBt === 'cancel' })
            }
          })
      // -------   S T A R T   W E E K   ---------
      } else if (this.type === 'week') {
        let url = ''
        if (this.flowId === 'allFlow') {
          url = this.DNS_IP +
            '/booking_view/getCountNotime?shopId=' +
            this.$session.getAll().data.shopId +
            '&dueDate=' +
            year +
            '-' +
            month +
            '&masBranchID=' +
            this.masBranchName
        } else {
          url = this.DNS_IP +
            '/booking_view/getCountNotime?shopId=' +
            this.$session.getAll().data.shopId +
            '&dueDate=' +
            year +
            '-' +
            month +
            '&masBranchID=' +
            this.masBranchName +
            '&flowId=' + this.flowId
        }
        await axios
          .get(url)
          .then(async response => {
            this.dataReady = true
            let countCustomer = this.DataBranchName.filter(el => { return el.value === this.masBranchName })
            this.countCus = countCustomer.length > 0 ? countCustomer[0].countCus : 0
            // this.countCus = this.masBranchName.countCus
            for (var i = 0; i < response.data.length; i++) {
              var d = response.data[i]
              var s = {}
              if (this.countCus > 0) {
                s.start = d.start
                d.d50 = parseInt((this.countCus / 100) * 50)
                d.d70 = parseInt((this.countCus / 100) * 70)
                d.d90 = parseInt((this.countCus / 100) * 90)
                if (parseInt(d.name) <= d.d50) {
                  s.color = 'blue'
                  s.name =
                  'คล่อง : ' +
                  d.name.toString() +
                  '/' +
                  this.countCus.toString()
                }
                if (parseInt(d.name) <= d.d70 && parseInt(d.name) >= d.d50) {
                  console.log('70')
                  s.color = 'deep-purple'
                  s.name =
                  'ติดขัด : ' +
                  d.name.toString() +
                  '/' +
                  this.countCus.toString()
                }
                if (parseInt(d.name) <= d.d90 && parseInt(d.name) >= d.d70) {
                  console.log('90')
                  s.color = 'red accent-1'
                  s.name =
                  'ติดขัด : ' +
                  d.name.toString() +
                  '/' +
                  this.countCus.toString()
                }
                if (parseInt(d.name) === this.countCus) {
                  s.color = 'red'
                  s.name =
                  'เต็ม : ' +
                  d.name.toString() +
                  '/' +
                  this.countCus.toString()
                }
                this.events.push(s)
              }
            }
            if (this.events.length === 0 || this.events.status === false) {
              this.events = []
            // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
            } else {
              let url = ''
              if (this.flowId === 'allFlow') {
                url = this.DNS_IP +
                  '/booking_view/getCount?shopId=' +
                  this.$session.getAll().data.shopId +
                  '&dueDate=' +
                  year +
                  '-' +
                  month +
                  '&masBranchID=' +
                  this.masBranchName
              } else {
                url = this.DNS_IP +
                  '/booking_view/getCount?shopId=' +
                  this.$session.getAll().data.shopId +
                  '&dueDate=' +
                  year +
                  '-' +
                  month +
                  '&masBranchID=' +
                  this.masBranchName +
                  '&flowId=' + this.flowId
              }
              await axios
                .get(url)
                .then(async responses => {
                  for (var x = 0; x < responses.data.length; x++) {
                    var e = responses.data[x]
                    var f = {}
                    // console.log(d)
                    if (e.statusBt) {
                      f.start = e.start + ' ' + e.timeDue + ':00'
                      f.end = e.start + ' ' + e.timeDue + ':30'
                      f.statusBt = e.statusBt
                      if (e.statusBt === 'confirm') {
                        f.color = 'green'
                        f.name =
                        'ยืนยัน เวลา ' +
                        e.timeDue +
                        ' โมง : ' +
                        e.name.toString()
                      } else if (e.statusBt === 'confirmJob') {
                        f.color = 'info'
                        f.name =
                        'รับรถ : ' +
                        e.name.toString()
                      } else {
                        f.color = 'red'
                        f.name =
                        'ยกเลิก เวลา ' +
                        e.timeDue +
                        ' โมง : ' +
                        e.name.toString()
                      }
                    } else {
                      f.start = e.start + ' ' + e.timeDue + ':00'
                      f.end = e.start + ' ' + e.timeDue + ':30'
                      f.statusBt = e.statusBt
                      f.color = 'orange'
                      f.name =
                      'รอยืนยัน เวลา ' +
                      e.timeDue +
                      ' โมง : ' +
                      e.name.toString()
                    }
                    this.events.push(f)
                  }
                })
            }
            console.log('events', this.events)
          })
        // eslint-disable-next-line handle-callback-err
          .catch(error => {
            console.log(error)
            this.dataReady = true
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
          })
      }
    },
    async getCustomFieldStart () {
      this.editedItemSeleteField = []
      axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.fieldId = d.fieldId
              s.fieldName = d.fieldName
              s.fieldType = d.fieldType
              s.optionField = d.optionField
              s.conditionField = d.conditionField
              s.conditionValue = d.conditionValue
              s.shopId = d.shopId
              s.showCard = d.showCard
              s.fieldValue = ''
              this.editedItemSeleteField.push(s)
            }
            // console.log('this.editedItemSeleteField', this.editedItemSeleteField)
          }
        })
    },
    openTaskList (date, type) {
      console.log('start TaskList')
      console.log('start gett', this.tagItem)
      this.dataSummary = []
      this.dataCalendar = []
      let targetData = null
      if (type === 'fastTrack') {
        targetData = this.monthData[date].filter((row) => { return row.fastTrack === 'True' || row.fastTrack === 'true' })
      } else if (type === 'normal') {
        targetData = this.monthData[date].filter((row) => { return (row.fastTrack !== 'True' && row.fastTrack !== 'true') })
      } else {
        targetData = this.monthData[date]
      }
      console.log('moreeee', this.monthData)
      for (let i = 0; i < targetData.length; i++) {
        let d = targetData[i]
        d.chkConfirm = false
        d.chkCancel = false
        if (d.timeText === null || d.timeText === '') {
          d.timeText = d.timeDue
        }
        if (d.statusBt === 'cancel' || !d.statusBt) {
          continue
        }
        let serviceDetail = ''
        // let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(d.flowId) })
        // fieldflow.forEach((row) => {
        //   let tempField = this.bookingData[d.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
        //   serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
        // })
        serviceDetail = d.displayFlowName || d.flowName
        d.serviceDetail = serviceDetail
        if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
          d.chkConfirm = true
          d.chkCancel = false
        }
        if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
          d.chkConfirm = false
          d.chkCancel = true
        }
        if (d.fastTrack === 'true' || d.fastTrack === 'True') {
          d.bgcolor = '#EF6C00'
          d.bgcolorChip = 'orange'
        } else if (d.extraJob === 'true' || d.extraJob === 'True') {
          d.bgcolor = '#C62828'
          d.bgcolorChip = 'red'
        } else {
          d.bgcolor = '#1565C0'
          d.bgcolorChip = 'blue'
        }
        d.bookingEmpFlowName = d.bookingEmpFlowName || ''
        d.name = d.bookingDataCustomerName || ''
        d.licenseNo = d.bookingDataCustomerRegisNumber || ''
        d.tel = d.bookingDataCustomerTel || ''
        d.carModel = d.bookingDataCustomerCarModel || ''
        d.displayFlowName = d.displayFlowName || ''
        let memberDataTag = d.memberDataTag || []

        let checkType = typeof d.memberDataTag
        // console.log('type', checkType)
        // console.log('memberDataTag', memberDataTag)
        // console.log('memTag', d.memberDataTag)

        try {
          if (checkType === 'string') {
            d.memberDataTag = JSON.parse(d.memberDataTag)
          } else {
            d.memberDataTag = memberDataTag
          }
          if (Array.isArray(d.memberDataTag) && d.memberDataTag.length > 0) {
            d.tagDataShow = []
            let memberDataTag = d.memberDataTag
            for (let i = 0; i < memberDataTag.length; i++) {
              let e = memberDataTag[i]
              let x = {}
              let checkTagItem = this.tagItem.filter(el => { return el.value === e })
              if (checkTagItem.length > 0) {
                x.text = checkTagItem[0].text
                x.value = checkTagItem[0].value
                d.tagDataShow.push(x)
              }
            }
          }

          // console.log('dTag', d.memberDataTag)
        } catch (error) {
          console.log(error)
        }
        this.dataCalendar.push(d)
      }
      console.log('data', this.dataCalendar)
      this.dataCalendar.sort((a, b) => {
        let keyA = new Date(a.dueDate)
        let keyB = new Date(b.dueDate)
        if (keyA < keyB) return -1
        if (keyA > keyB) return 1
        return 0
      })
      this.dataSummary = this.dataCalendar.reduce((r, a) => {
        r[a.bgcolorChip] = r[a.bgcolorChip] || {}
        r[a.bgcolorChip][a.timeText] = r[a.bgcolorChip][a.timeText] || []
        r[a.bgcolorChip][a.timeText].push(a)
        // r[a.bgcolorChip][a.timeDue] = r[a.bgcolorChip][a.timeDue] || []
        // r[a.bgcolorChip][a.timeDue].push(a)
        return r
      }, Object.create(null))
      console.log('dataSummary', this.dataSummary)
      this.dialog = true
    },
    async showEvent (event) {
      this.dataCalendar = []
      this.selectedEvent = event.event.start
      console.log('event', event.event)
      console.log('type', this.type)
      console.log('start', event.event.start + ' ' + event.event.timeDue)
      let url = ''
      if (this.type === 'week') {
        url = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.session.data.shopId +
            "&DATE_FORMAT(dueDate,'%%Y-%%m-%%d %%H')=" +
            moment(moment(new Date(event.event.start)), 'YYYY-MM-DD HH').format('YYYY-MM-DD HH') +
            '&statusBt=' + event.event.statusBt
      } else {
        url = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.session.data.shopId +
            '&dueDate=' + event.event.start + ' ' + event.event.timeDue +
            '&statusBt=' + event.event.statusBt
      }
      console.log('url', url)
      await axios
        .get(
          url
        )
        .then(async response => {
          console.log('getData', response.data)
          for (let i = 0; i < response.data.length; i++) {
            let d = response.data[i]
            d.chkConfirm = false
            d.chkCancel = false
            if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
              d.chkConfirm = true
              d.chkCancel = false
            }
            if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
              d.chkConfirm = false
              d.chkCancel = true
            }
            console.log('d.statusBt', d.statusBt)
            if (d.statusBt) {
              if (d.statusBt === 'confirm') {
                d.color = 'green'
              } else if (d.statusBt === 'confirmJob') {
                d.color = 'info'
              } else {
                d.color = 'red'
              }
            } else {
              d.color = 'orange'
            }
            d.name = d.bookingDataCustomerName || ''
            d.licenseNo = d.bookingDataCustomerRegisNumber || ''
            d.tel = d.bookingDataCustomerTel || ''
            d.carModel = d.bookingDataCustomerCarModel || ''
            d.displayFlowName = d.displayFlowName || ''
            // d.memberDataTag = JSON.parse(d.memberDataTag) || []
            // if (d.memberDataTag.length > 0) {
            //   d.tagDataShow = []
            //   let memberDataTag = d.memberDataTag
            //   for (let i = 0; i < memberDataTag.length; i++) {
            //     let e = memberDataTag[i]
            //     let x = {}
            //     let checkTagItem = this.tagItem.filter(el => { return el.value === e })
            //     if (checkTagItem.length > 0) {
            //       x.text = checkTagItem[0].text
            //       x.value = checkTagItem[0].value
            //       d.tagDataShow.push(x)
            //     }
            //   }
            // }

            this.dataCalendar.push(d)
          }
          this.dialog = true
        })
    },
    // async showEventre (event) {
    //   this.dataCalendar = []
    //   this.selectedEvent = event.event.start
    //   console.log('selectedEventweek', moment(moment(new Date(event.event.start)), 'YYYY-MM-DD HH').format('YYYY-MM-DD HH'))
    //   await axios
    //     .get(
    //       // eslint-disable-next-line quotes
    //       this.DNS_IP +
    //         '/booking_view/get?shopId=' +
    //         this.session.data.shopId +
    //         '&dueDate=' +
    //         event.event.start
    //     )
    //     .then(async response => {
    //       console.log('getData', response.data)
    //       for (let i = 0; i < response.data.length; i++) {
    //         let d = response.data[i]
    //         d.chkConfirm = false
    //         d.chkCancel = false
    //         if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
    //           d.chkConfirm = true
    //           d.chkCancel = false
    //         }
    //         if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
    //           d.chkConfirm = false
    //           d.chkCancel = true
    //         }
    //         console.log('d.statusBt', d.statusBt)
    //         if (d.statusBt) {
    //           if (d.statusBt === 'confirm') {
    //             d.color = 'green'
    //           } else if (d.statusBt === 'confirmJob') {
    //             d.color = 'info'
    //           } else {
    //             d.color = 'red'
    //           }
    //         } else {
    //           d.color = 'orange'
    //         }
    //         this.dataCalendar.push(d)
    //       }
    //       this.dialog = true
    //     })
    // },
    confirmChk (item) {
      console.log('item', item)
      this.$swal({
        title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async result => {
        var dt = {
          bookNo: item.bookNo,
          contactDate: this.format_date(new Date()),
          status: 'confirm',
          statusUse: 'use',
          shopId: this.$session.getAll().data.shopId,
          CREATE_USER: this.session.data.userName,
          LAST_USER: this.session.data.userName
        }
        axios
          .post(this.DNS_IP + '/booking_transaction/add', dt)
          .then(response => {
            this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
            this.getBookingList()
            console.log('addDataGlobal', response)
            this.dialog = false
          })
          .catch(error => {
            console.log('error function addData : ', error)
          })
      })
    },
    cancelChk (item) {
      // console.log('item', item)
      this.$swal({
        title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async result => {
        var dt = {
          bookNo: item.bookNo,
          contactDate: this.format_date(new Date()),
          status: 'cancel',
          statusUse: 'use',
          shopId: this.$session.getAll().data.shopId,
          CREATE_USER: this.session.data.userName,
          LAST_USER: this.session.data.userName
        }
        axios
          .post(this.DNS_IP + '/booking_transaction/add', dt)
          .then(response => {
            this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
            console.log('addDataGlobal', response)
            this.getBookingList()
            this.dialog = false
          })
          .catch(error => {
            console.log('error function addData : ', error)
          })
      })
    },
    async exportExcel () {
      this.loadingExport = true
      let dataExport = []
      this.dataexport = []
      let runNo = 0
      let sortDataExport = []
      // console.log('bookingData', this.bookingData)
      // console.log('this.editedItemSeleteField', this.editedItemSeleteField)
      // console.log('this.dataItemTimesChange', this.dataItemTimesChange)
      // console.log('this.dataItemTime', this.dataItemTime)
      await this.getBookingData()
      // console.log('')
      var datause = this.dataItemTime.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      // console.log('----datause', datause)
      for (let i = 0; i < datause.length; i++) {
        // var d = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === item.timeDueHtext })[i]
        let d = datause[i]
        // console.log('d.timeDueHtext', d.timeDueHtext)
        // console.log('this.dataItemTimesChange', this.dataItemTimesChange)
        let dataSelect = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === d.timeDueHtext && el.fastTrack && (el.statusBtText === 'ยืนยันแล้ว' || el.statusBtText === 'รับรถแล้ว') })
        console.log('s.dataSelect fastTrack', dataSelect)
        if (dataSelect.length > 0) {
          var datauseSelect = dataSelect.sort((a, b) => {
            if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
            return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
          })

          for (let x = 0; x < datauseSelect.length; x++) {
            runNo++
            let t = datauseSelect[x]
            let s = {}
            // console.log('fastTrack')
            // console.log('s.t', t)
            if (dataExport.filter(el => { return el.timeDueHtext === this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )' }).length === 0) {
              s.timeDueHtext = this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )'
            } else {
              s.timeDueHtext = ''
            }
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(t.flowId) })
            fieldflow.forEach((row) => {
              let tempField = this.bookingData[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
              // serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
              let convertTextField = ''
              if (tempField.length > 0) {
              // console.log('fieldType', row.fieldType)
                if (row.fieldType === 'Selects' || row.fieldType === 'Autocompletes' || row.fieldType === 'Radio') {
                  // console.log('optionField', row.optionField)
                  // console.log('fieldValue', tempField[0].fieldValue)
                  if (tempField[0].fieldValue) {
                    let checkValue = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })
                    if (checkValue.length > 0) {
                      convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                    } else {
                      convertTextField = tempField[0].fieldValue
                    }
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              // console.log('convertTextField', convertTextField)
              serviceDetail += (tempField.length > 0 ? convertTextField + ' ' : '')
            })
            // serviceDetail = serviceDetail.trim() || t.flowName
            serviceDetail = serviceDetail.trim() ? t.flowName + ' : ' + serviceDetail.trim() : t.flowName
            // console.log('serviceDetail', serviceDetail)

            s.type = this.dataTypeJob3
            s.runNo = runNo
            s.dateBooking = t.dueDateDay
            s.licenseNo = t.cusReg
            s.title = t.timeDuetext + t.timeDueEnd
            s.status = t.statusBtText
            s.remark = t.remark
            s.cusName = t.cusName
            s.cusReg = t.cusReg
            s.flowName = serviceDetail
            // s.flowName = t.flowName
            s.dueDateTimeStamp = t.dueDateTimeStamp
            s.empFull_NameTH = t.empFull_NameTH
            s.extraJob = t.extraJob ? this.dataTypeJob2 : ''
            s.carModel = t.bookingDataCustomerCarModel || ''
            s.statusUpload1 = t.statusUpload1 || 'False'
            s.statusUpload2 = t.statusUpload2 || 'False'
            s.fileUpload1 = t.fileUpload1 || '[]'
            s.fileUpload2 = t.fileUpload2 || '[]'
            // s.carModel = this.getDataFromFieldName(this.bookingData[t.bookNo], 'รุ่นรถ')
            // s.carModel = (s.carModel.length > 0) ? s.carModel[0].fieldValue : ''
            s.tel = t.tel
            s.bookingEmpFlowName = t.bookingEmpFlowName || ''
            s.dataFiled = this.bookingData[t.bookNo] || []
            dataExport.push(s)
          }
        }
      }
      if (dataExport.length > 0) {
        sortDataExport = dataExport.sort((a, b) => {
          if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
          return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
        })
      } else {
        sortDataExport = []
      }

      let sortDataExport2 = []
      let s = {}
      s.type = ''
      s.runNo = ''
      s.licenseNo = ''
      s.title = ''
      s.status = ''
      s.cusName = ''
      s.cusReg = ''
      s.flowName = ''
      s.remark = ''
      s.tel = ''
      s.empFull_NameTH = ''
      s.dueDateTimeStamp = ''
      s.carModel = ''
      s.statusUpload1 = 'False'
      s.statusUpload2 = 'False'
      s.fileUpload1 = '[]'
      s.fileUpload2 = '[]'
      s.dataFiled = []
      s.bookingEmpFlowName = ''
      dataExport.push(s)
      runNo = 0
      var datause2 = this.dataItemTime.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      for (let i = 0; i < datause2.length; i++) {
        console.log('i', i)
        let d = datause2[i]
        let dataSelect = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === d.timeDueHtext && !el.fastTrack && (el.statusBtText === 'ยืนยันแล้ว' || el.statusBtText === 'รับรถแล้ว') })
        // console.log('s.dataSelect !fastTrack' + 'TTT', dataSelect)
        // console.log('this.BookingDataList', this.bookingData)
        if (dataSelect.length > 0) {
          var datauseSelect2 = dataSelect.sort((a, b) => {
            if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
            return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
          })

          for (let x = 0; x < datauseSelect2.length; x++) {
            runNo++
            let t = datauseSelect2[x]
            let s = {}
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(t.flowId) })
            fieldflow.forEach((row) => {
              let tempField = []
              if (this.bookingData[t.bookNo] !== undefined) {
                tempField = this.bookingData[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
              }
              // console.log('tempField', tempField)
              // serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
              let convertTextField = ''
              if (tempField.length > 0) {
                // console.log('fieldType', row.fieldType)
                if (row.fieldType === 'Selects' || row.fieldType === 'Autocompletes' || row.fieldType === 'Radio') {
                  console.log('optionField1', row.optionField)
                  // console.log('fieldValue', tempField[0].fieldValue)
                  if (tempField[0].fieldValue) {
                    let checkValue = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })
                    if (checkValue.length > 0) {
                      convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                    } else {
                      convertTextField = tempField[0].fieldValue
                    }
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              // console.log('convertTextField', this.timeTable)
              serviceDetail += (tempField.length > 0 ? convertTextField + ' ' : '')
            })
            if (dataExport.filter(el => { return el.timeDueHtext === this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )' }).length === 0) {
              // console.log('if', x, datauseSelect2.length)
              s.timeDueHtext = this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )'
            } else {
              // console.log('else')
              s.timeDueHtext = ''
            }
            // serviceDetail = t.displayFlowName.trim() || t.flowName
            // serviceDetail = serviceDetail.trim() || t.flowName
            serviceDetail = serviceDetail.trim() ? t.flowName + ' : ' + serviceDetail.trim() : t.flowName
            // console.log('serviceDetail', serviceDetail)
            s.type = 'ปกติ'
            s.runNo = runNo
            s.dateBooking = t.dueDateDay
            s.licenseNo = t.cusReg
            s.title = t.timeDuetext + t.timeDueEnd
            s.status = t.statusBtText
            s.cusName = t.cusName
            s.bookingEmpFlowName = t.bookingEmpFlowName
            s.remark = t.remark
            s.cusReg = t.cusReg
            s.flowName = serviceDetail
            // s.flowName = t.flowName
            s.dueDateTimeStamp = t.dueDateTimeStamp
            s.tel = t.tel
            s.empFull_NameTH = t.empFull_NameTH
            s.extraJob = t.extraJob ? 'Extra Job' : ''
            // s.carModel = this.getDataFromFieldName(this.bookingData[t.bookNo], 'รุ่นรถ')
            // s.carModel = (s.carModel.length > 0) ? s.carModel[0].fieldValue : ''
            s.carModel = t.bookingDataCustomerCarModel || ''
            s.dataFiled = this.bookingData[t.bookNo] || []
            // console.log('sortDataExport2', s)
            s.statusUpload1 = t.statusUpload1 || 'False'
            s.statusUpload2 = t.statusUpload2 || 'False'
            s.fileUpload1 = t.fileUpload1 || '[]'
            s.fileUpload2 = t.fileUpload2 || '[]'
            sortDataExport2.push(s)
          }
          // console.log('IFIFIFIFIFIF')
        }
      }
      console.log('sortDataExport2', sortDataExport, sortDataExport2)
      let sortDataExportUse = sortDataExport2.sort((a, b) => {
        if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
        return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
      })
      this.dataexport = sortDataExport.concat(sortDataExportUse)
      console.log('dataEport', this.dataexport)
      this.onExport()
      // console.log('dataEport', JSON.stringify(dataExport))
    },
    onExport () {
      var dataexport = []
      for (var i = 0; i < this.dataexport.length; i++) {
        var a = this.dataexport[i]
        let data2 = {}
        for (let g = 0; g < a.dataFiled.length; g++) {
          let t = a.dataFiled[g]
          let fieldNames = ''
          let fieldValues = ''
          fieldNames = t.fieldName
          fieldValues = t.fieldValue
          data2[fieldNames] = fieldValues
          // dataOb.push({fieldNames: fieldValues})
        }
        let data1 = {
          'ประเภท': a.type,
          // 'ลำดับ': a.runNo,
          'วันที่': a.dateBooking,
          'เวลา': a.title,
          // 'ชื่อลูกค้า': a.cusName,
          'รายการบริการ': a.flowName,
          // 'หมายเหตุ': a.extraJob,
          // 'หมายเหตุยกเลิก': a.remarkRemove,
          // 'เวลาติดตาม': '',
          'เหตุผล': a.remark,
          // 'ตรง': '',
          // 'ไม่ตรง': '',
          // 'เปิดJob': '',
          // 'พนักงานรับนัดหมาย': a.empFull_NameTH,
          // 'หมายเหตุเพิ่มเติม': a.remark
          'พนักงาน': a.bookingEmpFlowName
        }
        let data4 = {}
        let fileUpload = []
        if (a.statusUpload1 === 'True') {
          let jsDT1 = JSON.parse(a.fileUpload1)
          // console.log('jsDT1', jsDT1, jsDT1.length)
          if (jsDT1.length > 0) {
            for (let element = 0; element < jsDT1.length; element++) {
              let dt = jsDT1[element]
              // console.log('dt1', dt)
              fileUpload.push(dt)
              // data1[`fileUpdate${element + 1}`] = dt
            }
          }
        }
        if (a.statusUpload2 === 'True') {
          let jsDT2 = JSON.parse(a.fileUpload2)
          console.log('jsDT2', jsDT2)
          if (jsDT2.length > 0) {
            for (let element = 0; element < jsDT2.length; element++) {
              let dt = jsDT2[element]
              // console.log('dt2', dt)
              // data1[`fileUpdate${element + 1}`] = dt
              fileUpload.push(dt)
            }
          }
        }
        if (fileUpload.length > 0) {
          for (let element = 0; element < fileUpload.length; element++) {
            let dt = fileUpload[element]
            data4[`fileUpload${element + 1}`] = dt
          }
        }
        let dataSum = null
        if (fileUpload.length > 0) {
          dataSum = Object.assign({}, data1, data2, data4)
        } else {
          dataSum = Object.assign({}, data1, data2)
        }
        dataexport.push(dataSum)
      }
      console.log('dataexport', dataexport)
      const dateSplit = this.today.split('-')
      // console.log(dateSplit)
      // const date = dateSplit[0].split('-')
      const year = String(dateSplit[0])
      const month = String(dateSplit[1])
      const dataWS = XLSX.utils.json_to_sheet(dataexport)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, dataWS)
      XLSX.writeFile(wb, 'export_' + this.format_dateNotime(year + '-' + month) + '.xlsx')
      this.loadingExport = false
    }
  }
}
</script>
<style scoped>
.vlistitem {
  background-color: #1B437C;
}
.today {
  background-color: #C1DFFF;
}
</style>
