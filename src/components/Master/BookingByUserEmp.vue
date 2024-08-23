<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <!-- <v-row>
          <v-col cols="12" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
        </v-row> -->
        <v-row>
          <v-col cols="12">
            <div>
            <h4 class="ml-6">ตรวจสอบคิวจองรายวัน</h4>
            <v-row no-gutters>
              <v-col cols="12">
                <v-menu
                  ref="menu"
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="timeTable"
                      label="วันที่นัดลูกค้า"
                      persistent-hint
                      dense
                      outlined
                      readonly
                      required
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="timeTable"
                    no-title
                    @input="(menu1 = false), getTimesChange('update')"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row justify="center" v-if="$session.getAll().data.USER_ROLE !== 'booking'">
            </v-row>
            <v-row>
              <v-col cols="12" class="pt-0 pb-0">
                <strong>
                  {{
                    "รายการนัดหมายทั้งหมด " +
                      dataItemTimesChange.filter(el => {
                        return (
                          el.statusBt === "confirmJob" || el.statusBt === "confirm"
                        );
                      }).length
                  }}{{
                    $session.getAll().data.category === "ธุรกิจรถยนต์"
                      ? " คัน"
                      : " รายการ"
                  }}
                </strong>
              </v-col>
              <!-- {{dataItemTimesChange.filter(el => { return (el.statusBt==='confirmJob' || el.statusBt==='confirm') })}} -->
              <v-col cols="12" class="pt-0 pb-0">
                <v-chip-group column>
                  <template v-for="(item, index) in dataCount">
                    <v-chip
                      :color="'grey lighten-5'"
                      v-bind:key="'chip' + index"
                      class="text-wrap"
                    >
                      {{ item.name + " : " + item.count }}{{
                    $session.getAll().data.category === "ธุรกิจรถยนต์"
                        ? " คัน"
                        : " รายการ"
                    }}
                    </v-chip>
                  </template>
                </v-chip-group>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-expansion-panels>
                <v-expansion-panel
                  v-for="(item, indexitem) in masterTime"
                  :key="indexitem"
                >
                  <v-expansion-panel-header v-slot="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4">
                        {{ item }}
                      </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span
                            v-if="
                              open &&
                                dataItemTimesChange.filter(el => {
                                  return (
                                    el.timeDueHtext === item &&
                                    (el.statusBt === 'confirmJob' ||
                                      el.statusBt === 'confirm')
                                  );
                                }).length > 0
                            "
                          >
                            {{
                              "รายการนัดหมาย " +
                                dataItemTimesChange.filter(el => {
                                  return (
                                    el.timeDueHtext === item &&
                                    (el.statusBt === "confirmJob" ||
                                      el.statusBt === "confirm")
                                  );
                                }).length
                            }}{{
                              $session.getAll().data.category === "ธุรกิจรถยนต์"
                                ? " คัน"
                                : " รายการ"
                            }}
                          </span>
                          <span
                            v-if="
                              open &&
                                dataItemTimesChange.filter(el => {
                                  return (
                                    el.timeDueHtext === item &&
                                    (el.statusBt === 'confirmJob' ||
                                      el.statusBt === 'confirm')
                                  );
                                }).length === 0
                            "
                          >
                            ไม่มีรายการนัดหมาย</span
                          >
                          <v-row
                            v-if="
                              !open &&
                                dataItemTimesChange.filter(el => {
                                  return (
                                    el.timeDueHtext === item &&
                                    (el.statusBt === 'confirmJob' ||
                                      el.statusBt === 'confirm')
                                  );
                                }).length > 0
                            "
                            no-gutters
                            style="width: 100%;justify-content: end;"
                          >
                            <v-col
                              cols="10"
                              style="display:contents"
                              class="text-right"
                            >
                              <div
                                class="mt-1 mr-1"
                                style="display:flex;justify-content: right;"
                                v-if="
                                  dataItemTimesChange.filter(el => {
                                    return (
                                      el.timeDueHtext === item &&
                                      el.fastTrack &&
                                      (el.statusBt === 'confirmJob' ||
                                        el.statusBt === 'confirm')
                                    );
                                  }).length > 0 &&
                                    $session.getAll().data.category !== 'ธุรกิจรถยนต์'
                                "
                              >
                                <div
                                  style="background-color:#F57C00;padding-left: 4px;padding-right: 4px;border-top-left-radius: 9px;border-bottom-left-radius: 9px;"
                                >
                                  <v-icon
                                    style="font-size: 20px;"
                                    color="white"
                                    class="iconify"
                                    data-icon="line-md:alert"
                                  >
                                  </v-icon>
                                </div>
                                <div
                                  style="margin: auto 0;padding-left: 3px;border: 1px solid #F57C00;padding: 3px 7px;border-top-right-radius: 10px;border-bottom-right-radius: 10px;font-size: 14px;"
                                >
                                  {{
                                    dataItemTimesChange.filter(el => {
                                      return (
                                        el.timeDueHtext === item &&
                                        el.fastTrack &&
                                        (el.statusBt === "confirmJob" ||
                                          el.statusBt === "confirm")
                                      );
                                    }).length + " รายการ"
                                  }}
                                </div>
                              </div>
                              <v-chip
                                class="ma-2"
                                color="orange darken-1"
                                dark
                                label
                                small
                                v-if="
                                  dataItemTimesChange.filter(el => {
                                    return (
                                      el.timeDueHtext === item &&
                                      el.fastTrack &&
                                      (el.statusBt === 'confirmJob' ||
                                        el.statusBt === 'confirm')
                                    );
                                  }).length > 0 &&
                                    $session.getAll().data.category === 'ธุรกิจรถยนต์'
                                "
                              >
                                <v-icon left>
                                  mdi-flash
                                </v-icon>
                                {{
                                  dataItemTimesChange.filter(el => {
                                    return (
                                      el.timeDueHtext === item &&
                                      el.fastTrack &&
                                      (el.statusBt === "confirmJob" ||
                                        el.statusBt === "confirm")
                                    );
                                  }).length
                                }}{{
                                  $session.getAll().data.category === "ธุรกิจรถยนต์"
                                    ? " คัน"
                                    : " รายการ"
                                }}
                              </v-chip>
                              <div
                                class="mt-1 mr-1"
                                style="display:flex;justify-content: right;"
                                v-if="
                                  dataItemTimesChange.filter(el => {
                                    return (
                                      el.timeDueHtext === item &&
                                      el.extraJob &&
                                      (el.statusBt === 'confirmJob' ||
                                        el.statusBt === 'confirm')
                                    );
                                  }).length > 0 &&
                                    $session.getAll().data.category !== 'ธุรกิจรถยนต์'
                                "
                              >
                                <div
                                  style="background-color:#C62828;padding-left: 4px;padding-right: 4px;border-top-left-radius: 9px;border-bottom-left-radius: 9px;"
                                >
                                  <v-icon
                                    style="font-size: 20px;"
                                    color="white"
                                    class="iconify"
                                    data-icon="line-md:alert"
                                  >
                                  </v-icon>
                                </div>
                                <div
                                  style="margin: auto 0;padding-left: 3px;border: 1px solid #C62828;padding: 3px 7px;border-top-right-radius: 10px;border-bottom-right-radius: 10px;font-size: 14px;"
                                >
                                  {{
                                    dataItemTimesChange.filter(el => {
                                      return (
                                      el.timeDueHtext === item &&
                                      el.extraJob &&
                                      (el.statusBt === "confirmJob" ||
                                        el.statusBt === "confirm")
                                    );
                                  }).length + " รายการ"
                                  }}
                                </div>
                              </div>
                              <v-chip
                                class="ma-2"
                                color="red darken-1"
                                dark
                                label
                                small
                                v-if="
                                  dataItemTimesChange.filter(el => {
                                    return (
                                      el.timeDueHtext === item &&
                                      el.extraJob &&
                                      (el.statusBt === 'confirmJob' ||
                                        el.statusBt === 'confirm')
                                    );
                                  }).length > 0 &&
                                    $session.getAll().data.category === 'ธุรกิจรถยนต์'
                                "
                              >
                                <v-icon left>
                                  mdi-alarm-plus
                                </v-icon>
                                {{
                                  dataItemTimesChange.filter(el => {
                                    return (
                                      el.timeDueHtext === item &&
                                      el.extraJob &&
                                      (el.statusBt === "confirmJob" ||
                                        el.statusBt === "confirm")
                                    );
                                  }).length
                                }}{{
                                  $session.getAll().data.category === "ธุรกิจรถยนต์"
                                    ? " คัน"
                                    : " รายการ"
                                }}
                              </v-chip>
                              <div
                                class="mt-1 mr-1"
                                style="display:flex;justify-content: right;"
                                v-if="
                                  dataItemTimesChange.filter(el => {
                                    return (
                                      el.timeDueHtext === item &&
                                      !el.fastTrack &&
                                      !el.extraJob &&
                                      (el.statusBt === 'confirmJob' ||
                                        el.statusBt === 'confirm')
                                    );
                                  }).length > 0 &&
                                    $session.getAll().data.category !== 'ธุรกิจรถยนต์'
                                "
                              >
                                <div
                                  style="background-color:#3476CC;padding-left: 4px;padding-right: 4px;border-top-left-radius: 9px;border-bottom-left-radius: 9px;"
                                >
                                  <v-icon
                                    style="font-size: 20px;"
                                    color="white"
                                    class="iconify"
                                    data-icon="line-md:alert"
                                  >
                                  </v-icon>
                                </div>
                                <div
                                  style="margin: auto 0;padding-left: 3px;border: 1px solid #3476CC;padding: 3px 7px;border-top-right-radius: 10px;border-bottom-right-radius: 10px;font-size: 14px;"
                                >
                                  {{
                                    dataItemTimesChange.filter(el => {
                                      return (
                                      el.timeDueHtext === item &&
                                      !el.fastTrack &&
                                      !el.extraJob &&
                                      (el.statusBt === "confirmJob" ||
                                        el.statusBt === "confirm")
                                    );
                                  }).length + " รายการ"
                                  }}
                                </div>
                              </div>
                              <v-chip
                                class="ma-2"
                                color="primary"
                                label
                                small
                                v-if="
                                  dataItemTimesChange.filter(el => {
                                    return (
                                      el.timeDueHtext === item &&
                                      !el.fastTrack &&
                                      !el.extraJob &&
                                      (el.statusBt === 'confirmJob' ||
                                        el.statusBt === 'confirm')
                                    );
                                  }).length > 0 &&
                                    $session.getAll().data.category === 'ธุรกิจรถยนต์'
                                "
                              >
                                <v-icon left>
                                  {{
                                    $session.getAll().data.category === "ธุรกิจรถยนต์"
                                      ? "mdi-car-multiple"
                                      : "mdi-account-box-multiple"
                                  }}
                                </v-icon>
                                {{
                                  dataItemTimesChange.filter(el => {
                                    return (
                                      el.timeDueHtext === item &&
                                      !el.fastTrack &&
                                      !el.extraJob &&
                                      (el.statusBt === "confirmJob" ||
                                        el.statusBt === "confirm")
                                    );
                                  }).length
                                }}{{
                                  $session.getAll().data.category === "ธุรกิจรถยนต์"
                                    ? " คัน"
                                    : " รายการ"
                                }}
                              </v-chip>
                            </v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <!-- <v-expansion-panel-header>{{item + '(' + dataItemTimesChange.filter(el => { return el.timeDueHtext === item && (el.statusBt==='confirmJob' || el.statusBt==='confirm') }).length + ')'}}</v-expansion-panel-header> -->
                  <v-expansion-panel-content
                    v-for="(items, indexitems) in dataItemTimesChange.filter(el => {
                      return (
                        el.timeDueHtext === item &&
                        (el.statusBt === 'confirmJob' || el.statusBt === 'confirm')
                      );
                    })"
                    :key="'td' + indexitems"
                  >
                    <v-card
                      :color="
                        items.fastTrack
                          ? 'orange darken-1'
                          : items.extraJob
                          ? 'red darken-1'
                          : '#1B437C'">
                      <v-container class="pt-0 pb-0">
                        <v-list-item
                          class="pa-0"
                          :style="
                            items.fastTrack
                              ? 'background-color:#FB8C00 !important'
                              : items.extraJob
                              ? 'background-color: #E53935 !important'
                              : ''">
                          <v-list-item-content>
                            <v-list-item-title class="pt-0 pb-0 text-wrap">{{
                              items.flowName
                            }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" class="pt-0">
                              <v-icon dark class="mr-1" v-if="items.fastTrack">
                                mdi-flash
                              </v-icon>
                              <v-icon dark class="mr-1" v-else-if="items.extraJob">
                                mdi-alarm-plus
                              </v-icon>
                              <v-icon dark class="mr-1" v-else>
                                mdi-clock-outline
                              </v-icon>
                              <span class="white--text mr-2" style="z-index:1;">{{
                                items.timeDuetext
                              }}</span>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-text>
                          <v-row class="white--text">
                            <v-col v-if="items.cusName" cols="12" class="pt-0 pb-0">
                              คุณ {{ items.cusName }}
                            </v-col>
                            <v-col v-if="items.tel" cols="12" class="pt-0 pb-0">
                              โทร {{ items.tel }}
                            </v-col>
                            <v-col v-if="items.cusReg" cols="12" class="pt-0 pb-0">
                              ทะเบียน {{ items.cusReg }}
                            </v-col>
                            <v-col v-if="items.bookingEmpFlowName" cols="12" class="pt-0 pb-0">
                              พนักงาน {{ items.bookingEmpFlowName }}
                            </v-col>
                            <v-col v-if="items.address" cols="12" class="pt-0 pb-0">
                              ที่อยู่ {{ items.address }}
                            </v-col>
                            <v-col v-if="items.addressLatLong" cols="12" class="pt-0">
                              <v-btn
                                small
                                block
                                outlined
                                color="white"
                                @click="setShowMap(items)"
                              >
                                <v-icon left>
                                  mdi-map-search
                                </v-icon>
                                ดูแผนที่
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-container>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-row>
          </div>
          </v-col>
        </v-row>
        <v-dialog v-model="dialogMap" max-width="90%">
           <v-card class="text-center">
          <v-card-text>
              <v-container>
                <v-row>
                    <v-col cols="8" class="text-left pt-10">
                      <h3><strong>แสดงแผนที่</strong></h3>
                    </v-col>
                    <v-col cols="4" class="pt-10">
                      <div style="text-align: end;">
                        <v-btn
                          class="mx-2"
                          fab
                          small
                          dark
                          color="white"
                          :style="styleCloseBt"
                          @click="dialogMap = false"
                          >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                <v-row>
                  <v-col cols= "12" class="pb-0">
                    <v-text-field
                      v-model="address"
                      outlined
                      readonly
                      label="ชื่อของที่อยู่"
                      auto-grow
                    ></v-text-field>
                  </v-col>
                  <v-col cols= "12" class="pb-0 pt-0">
                    <v-card class="text-center">
                      <v-container>
                      <GmapMap
                        v-if="center !== null"
                        :center="center"
                        :zoom="15"
                        style="width: 100%; height: 200px"
                        :options="{ disableDefaultUI: true }"
                      >
                        <GmapMarker @click="gotoMap()" :position="center" />
                        <gmap-info-window
                            :opened="true"
                            :position="center"
                            :options="{
                              pixelOffset: {
                                width: 0,
                                height: -35
                              }
                            }"
                        >
                              กดที่หมุดเพื่อ นำทาง
                          </gmap-info-window>
                      </GmapMap>
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
          </v-card-text>
           </v-card>
        </v-dialog>
        </div>
    </v-main>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import axios from 'axios' // api
export default {
  name: 'BookingListBeauty',
  components: {},
  data () {
    return {
      session: this.$session.getAll(),
      masterTime: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
      menu1: false,
      timeTable: '',
      dataItemCheck: [],
      dataItemTimesChange: [],
      dataRemoveExport: [],
      dataCount: [],
      center: null,
      address: '',
      dialogMap: false
    }
  },
  async mounted () {
    this.timeTable = moment().format('YYYY-MM-DD')
    await this.beforeCreate()
  },
  methods: {
    gotoMap () {
      window.open('https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + this.center.lat + ',' + this.center.lng, '_blank')
      // window.location.href = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + this.center.lat + ',' + this.center.lng
    },
    setShowMap (dt) {
      this.center = null
      if (dt.addressLatLong === null && dt.addressLatLong === '') {
        this.center = null
      } else {
        this.center = JSON.parse(dt.addressLatLong)
        this.address = dt.address
        this.dialogMap = true
      }
    },
    async beforeCreate () {
    // if (!this.$session.exists()) {
    //   this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId)
    // }
      // console.log(JSON.parse(localStorage.getItem('sessionData')))
      if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
        if (JSON.parse(localStorage.getItem('sessionData')).shopId) {
          this.$session.start()
          this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
          await this.getTimesChange()
        } else {
          this.$router.push('/Core/Login')
        }
      } else {
        if (!this.$session.exists()) {
          this.$router.push('/Core/Login')
        } else {
          if (this.$session.getAll().data.shopId) {
            localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
            await this.getTimesChange()
          } else {
            this.$router.push('/Core/Login')
          }
        }
      }
      // console.log(JSON.stringify(this.$session.getAll().data))
    },
    async getTimesChange (text) {
      try {
        this.dataItemTimesChange = []
        this.dataRemoveExport = []
        // if (this.masBranchID) {
        //   this.masBranchID = this.masBranchID
        // } else {
        //   if (this.branch.length > 0) {
        //     this.masBranchID = this.branch[0].value
        //   } else {
        //     this.masBranchID = ''
        //   }
        // }
        this.dataItemCheck = []
        var dataItems = []
        if (this.timeTable !== '') {
          // var dateStart = moment(moment(this.timeTable, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
          // console.log('dateStartxx', dateStart)
          // console.log('timeTable', this.timeTable)
          // await this.getBookingDataListTimechange(dateStart)

          // var dataItemTimes = []
          let urlApi = ''
          urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$session.getAll().data.shopId +
            // '&masBranchID=' +
            // this.masBranchID +
            '&dueDate=' +
            this.timeTable +
            '&bookingEmpFlow=' + this.$session.getAll().data.empId
          // this.timeTable + '&flowId=' + this.flowSelect + this.selectOnsite
          await axios
            .get(
              urlApi
            )
            .then(async response => {
              console.log('getData', response.data)
              if (response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                  let d = response.data[i]
                  let s = {}
                  s.address = d.address
                  s.addressLatLong = d.addressLatLong
                  s.bookNo = d.bookNo
                  s.flowId = d.flowId
                  s.flowName = d.flowName
                  s.bookingEmpFlowName = d.bookingEmpFlowName
                  s.dueDate = d.dueDate
                  s.dueDateTimeStamp = d.dueDateTimeStamp
                  s.remarkRemove = d.remarkRemove
                  s.remark = d.remark
                  s.userId = d.userId
                  s.chkConfirm = false
                  s.chkCancel = false
                  s.jobNo = d.jobNo
                  s.empFull_NameTH = d.empFull_NameTH
                  s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
                  s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
                  s.remarkRemove = d.remarkRemove || ''
                  s.timeDueHtext = d.timeDueH + ':00'
                  s.timeDuetext = d.timeDue
                  if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
                    s.chkConfirm = true
                    s.chkCancel = false
                  }
                  if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
                    s.chkConfirm = false
                    s.chkCancel = true
                  }
                  s.statusBt = d.statusBt || 'wait'
                  switch (d.statusBt) {
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
                  // s.cusName = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'ชื่อ')
                  // s.cusReg = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'เลขทะเบียน')
                  // s.tel = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'เบอร์โทร')
                  // s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                  // s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                  // s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                  s.cusName = d.bookingDataCustomerName || ''
                  s.cusReg = d.bookingDataCustomerRegisNumber || ''
                  s.tel = d.bookingDataCustomerTel || ''
                  s.displayFlowName = d.displayFlowName || ''
                  dataItems.push(s)
                }
              }
              if (dataItems.length === 0 || dataItems.status === false) {
                this.dataItemCheck = []
              } else {
                console.log('month new if', dataItems)
                this.dataItemCheck = dataItems
                this.dataItemTimesChange = this.dataItemCheck.sort((a, b) => {
                  if (a.timeDuetext < b.timeDuetext) return -1
                  return a.timeDuetext > b.timeDuetext ? 1 : 0
                })
                this.dataRemoveExport = this.dataItemTimesChange.filter(el => { return el.statusBt === 'cancel' })
              }
            })
        }
      } catch (err) {
        console.log(err)
      }
    },
    dataItemTimesChangeParent () {
      this.dataCount = []
      for (var issue of this.dataItemTimesChange) {
        var entryFound = false
        if (issue.statusBt === 'confirmJob' || issue.statusBt === 'confirm') {
          var tempObj = {
            name: issue.flowName,
            count: 1
          }
          for (var item of this.dataCount) {
            if (item.name === tempObj.name) {
              item.count++
              entryFound = true
              break
            }
          }
          if (!entryFound) {
            this.dataCount.push(tempObj)
          }
        }
      }
    }
  }
}
</script>
<style scoped>

</style>
