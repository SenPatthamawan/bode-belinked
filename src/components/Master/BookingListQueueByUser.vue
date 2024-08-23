<template>
  <div>
    <v-main>
      <div class="px-lg-4" style="overflow-x: hidden;height:100vh;background-color: #1B437C;">
        <template>
        <v-form ref="form_search" v-model="validSearch" lazy-validation>
          <v-row class="no-gutters">
          </v-row>
        </v-form>
        <v-row>
          <v-col cols="12">
            <br>
            <v-card class="mx-6 pa-3 ma-2" style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;">
              <v-card-text>
                <v-row class="no-gutters">
                  <v-col col="auto" class="px-3 mt-5 text-right">
                    <v-select
                      style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                      v-model="flowSelect"
                      hide-details
                      background-color="white"
                      :items="DataFlowItem"
                      label="ประเภทบริการ"
                      outlined
                      dense
                      required
                      :rules ="[rules.required]"
                      @change="searchBooking()"
                    >
                      <template #prepend-inner>
                        <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                          mdi-note-text-outline
                        </v-icon>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" class="px-3 mt-5 text-right">
                    <v-menu
                      ref="menu"
                      v-model="menuStart"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          hide-details
                          background-color="white"
                          v-model="dateStart"
                          style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                          label="วัน/เดือน/ปี"
                          readonly
                          outlined
                          dense
                          required
                          :rules ="[rules.required]"
                          v-bind="attrs"
                          v-on="on"
                        >
                        <template #prepend-inner>
                        <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                          mdi-calendar
                        </v-icon>
                      </template></v-text-field>
                      </template>
                      <v-date-picker
                        @input="menuStart = false, checkSearch()"
                        v-model="dateStart"
                        no-title
                        scrollable
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card-text>
              <div mb-n5>
                <div class="text-right">
                  <v-btn
                    v-if="callQueue.status !== 'no have type' && callQueue.storeFrontQueue !== 'XXXX'"
                    color="#ECEFF1"
                    class="ma-2 white--text"
                    fab
                    elevation="1"
                    small
                    style="height: 40px; width: 40px;"
                    @click="removeQueue(callQueue)"
                  >
                    <v-icon color="red"
                    size="40">
                      mdi-delete-circle
                    </v-icon>
                  </v-btn>
                </div>
                <p style="color:#092C4C;font-size: 80px;" class="text-center font-weight-black mt-n5 mb-n5">{{ callQueue.storeFrontQueue}}</p>
                <div class="mt-5" align="center">
                  <v-btn
                    @click="closeJobSubmit(callQueue)"
                    :disabled="callQueue !== null && (callQueue.status === 'confirm' || callQueue.status === 'againqQueue') ? false : true"
                    dark
                    :class="`rounded-btn-circle justify-content-center align-items-center ${callQueue !== null && (callQueue.status === 'confirm' || callQueue.status === 'againqQueue')  ? 'rounded-btn-confirm-circle':'rounded-btn-closejob-circle'}`">
                    <div class="d-flex flex-column">
                    <div><v-icon size="45">mdi-bell-ring</v-icon></div>
                    <div><span :class="`text-event ${callQueue !== null && callQueue.status === 'confirm' ? 'text-white' :'text-bell-disabled'}`">เรียกคิว</span></div>
                    </div>
                  </v-btn>
                </div>
                <template v-if="HistoryData && HistoryData.length > 0">
                <div class="mt-5" v-for="(item3 , index3) in HistoryData" :key="index3">
                  <h5 class="text-start ml-10" v-if="item3.fieldValue !== '' && item3.fieldName !== 'เบอร์โทร'"><strong>{{item3.fieldValue}}</strong></h5>
                </div>
                </template>
                <h5 v-if="callQueue.servicePoint" class="text-start ml-10 mt-2"><strong>{{ languageSelect === 0 ? callQueue.servicePoint : JSON.parse(callQueue.servicePointCount).filter(el => { return el.textTh === callQueue.servicePoint}).length > 0 ? JSON.parse(callQueue.servicePointCount).filter(el => { return el.textTh === callQueue.servicePoint})[0].textEn:callQueue.servicePoint}}</strong></h5>
                <div class="text-start ml-9 mt-2" style="display: flex;word-break: break-word;">
                  <v-icon color="#979797" class="iconify" data-icon="ic:twotone-access-time"></v-icon>
                  <p class="font-weight-medium text-center ma-0 ml-2" v-if="dateStart" style="font-size:16px;color:#979797;">
                    {{momentThaiText(dateStart)}}</p>
                </div>
                <div class="text-start ml-8 mt-2" style="display: flex;word-break: break-word;">
                  <v-icon color="#979797" class="mx-1 mr-2">mdi-map-marker-radius</v-icon>
                  <p class="font-weight-medium mb-1" style="font-size:16px;color:#979797;" v-if="masBranchID !== '' && branchItem">
                  สาขา : {{branchItem.filter(el => { return masBranchID === el.value })[0].text}}
                </p>
                </div>
                <br>
                <div class="text-center">
                  <v-btn
                  color="#F8CD70"
                  rounded
                  min-width="88px"
                  v-if="shopPhone !== ''"
                  @click="dial(shopPhone)"
                >
                  <strong class="text-white">โทร</strong>
                </v-btn>
                <v-btn
                  color="#1B437C"
                  rounded
                  min-width="88px"
                  :disabled="callQueue.status === 'confirmJob' ? false:true"
                  @click="closeJobSubmitReturn(callQueue)"
                >
                  <strong class="text-white">เรียกคิวซ้ำ</strong>
                </v-btn>
                <v-btn
                  color="#F38383"
                  rounded
                  min-width="88px"
                  :disabled="callQueue.status === 'confirmJob' ? false:true"
                  @click="backHomeSubmit(callQueue)"
                >
                  <strong class="text-white">ปิดงาน</strong>
                </v-btn>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-dialog v-model="dialogPrint" scrollable transition="dialog-bottom-transition" persistent max-width="100%">
              <v-card class="text-center">
                <v-card-text>
                  <iframe id='pdfV' style="width:100%; height: 900px"></iframe>
                </v-card-text>
                <v-card-actions class="text-center">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="error"
                    class="button"
                    dark
                    large
                    @click="dialogPrint = false"
                  >
                    ปิด
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogHistory" scrollable persistent :max-width="dialogwidth">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6" class="text-left pt-10">
                      <h3><strong>รายละเอียดนัดหมาย</strong></h3>
                    </v-col>
                    <v-col cols="6" class="pt-10">
                      <div style="text-align: end;">
                        <v-btn
                          class="mx-2"
                          fab
                          small
                          dark
                          color="white"
                          :style="styleCloseBt"
                          @click="dialogHistory = false"
                          >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                   <v-row >
                    <v-col cols="12">
                      <div class="avatar text-center">
                        <v-avatar size="120" style="border:5px solid #FFFFFF;">
                          <v-img
                            v-if="pictureUrHistory"
                            :src="pictureUrHistory"
                          ></v-img>
                          <v-icon size="100" color="orange" v-else>
                            mdi-tooltip-account
                          </v-icon>
                        </v-avatar>
                      </div>
                      <br>
                      <template v-if="HistoryData && HistoryData.length > 0">
                        <h6 class="text-start font-weight-bold">{{format_dateThai(HistoryData[0].dueDate)}}</h6>
                        <h6 class="text-start font-weight-bold">{{HistoryData[0].flowName}}</h6>
                        <h6 class="text-start font-weight-bold">{{HistoryData[0].masBranchName}}</h6>
                        <div v-for="(item3 , index3) in HistoryData" :key="index3">
                          <p class="text-start" v-if="item3.fieldValue !== ''"><strong>{{item3.fieldName}} : </strong> {{item3.fieldValue}}</p>
                        </div>
                        <v-btn
                          color="#1B437C"
                          small
                          dark
                          @click="sendQonline(HistoryData[0])"
                        >
                          <v-icon left>mdi-send-check-outline</v-icon>
                          ส่งคิวออนไลน์
                        </v-btn>
                      </template>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
            <v-dialog v-model="dialogServicePointStatus" scrollable persistent max-width="90%">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="10" class="text-left pt-10">
                      <h5><strong style="color:#000000">กรุณาเลือกจุดบริการ</strong></h5>
                    </v-col>
                    <v-col cols="2" class="pt-7">
                      <div style="text-align: end;">
                        <v-btn
                          class="mx-2"
                          fab
                          small
                          dark
                          color="white"
                          :style="styleCloseBt"
                          @click="dialogServicePointStatus = false"
                          >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                   <v-row>
                    <v-col cols="12">
                      <v-radio-group v-model="servicePoint" row>
                        <v-row>
                          <v-col class="px-0" cols="4" v-for="(n, id) in servicePointItem" :key="id">
                            <v-radio
                              :label="`${n.textTh}`"
                              :value="n.textTh"
                            ></v-radio>
                          </v-col>
                        </v-row>
                      </v-radio-group>
                    </v-col>
                    <v-col cols="12">
                      <v-btn
                        color="#1DBF73"
                        block
                        v-if="statusReturn"
                        dark
                        @click="closeJobServicePointReturn(closeItem)"
                      >
                        ตกลง
                      </v-btn>
                      <v-btn
                        v-else
                        color="#1DBF73"
                        block
                        dark
                        @click="closeJobServicePoint(closeItem)"
                      >
                        ตกลง
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col clos="12" class="text-center">
                      <waitingAlert></waitingAlert>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
        <v-footer fixed padless color="#1B437C" class="text-center mt-n16" style="justify-content: center;">
          <p class="text-white" width="100%">POWERED BY  BETASK CONSULTING</p>
        </v-footer>
        </template>
        </div>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import moment from 'moment-timezone'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    waitingAlert
  },
  data () {
    return {
      callQueue: {
        bookNo: '',
        storeFrontQueue: 'XXXX',
        status: 'no have type',
        storeFrontQueueEmpId: null
      },
      waitingQueue: [],
      unsubscribe: null,
      languageSelect: 0,
      servicePointItem: [],
      servicePoint: '',
      closeItem: '',
      dialogServicePointStatus: false,
      validSearch: true,
      statusReturn: false,
      BookingDataList: [],
      menuStart: false,
      dialogPrint: false,
      time: '',
      timeavailable: [],
      branchItem: [],
      masBranchID: '',
      DataFlowItem: [],
      flowSelect: '',
      dateStart: '',
      dialog: false,
      search: '',
      shopName: '',
      shopImg: '',
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        IDcardRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: value => !!value || 'กรุณากรอก.',
        resizeImag: value =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
        counterIDcard: value => value.length <= 13 || 'Max 13 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      dataLineConfig: {},
      HistoryData: [],
      pictureUrHistory: '',
      dialogHistory: false,
      shopPhone: '',
      setTimerCalendar: null
    }
  },
  computed: {
    dialogwidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '70%'
        case 'sm': return '60%'
        case 'md': return '50%'
        case 'lg': return '50%'
        case 'xl': return '50%'
      }
    }
  },
  created () {
    this.getFirestore()
  },
  beforeDestroy () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  async mounted () {
    this.dateStart = this.momenDate_1(new Date())
    console.log('localStorage', JSON.parse(localStorage.getItem('sessionData')))
    console.log('session', this.$session.getAll().data)
    await this.beforeCreate()
  },
  methods: {
    closeSetTimeBookingListQueue () {
      this.setTimerCalendar = null
    },
    async removeQueue (item) {
      console.log('removeQueue', item)
      this.closeSetTimeBookingListQueue()
      // let statusBooking = await this.checkBookingStatus(item.bookNo)
      // if (statusBooking === 'confirmJob') {
      this.$swal({
        title: `ต้องการยกเลิกคิว ${item.storeFrontQueue} ใช่หรือไม่?`,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1DBF73',
        cancelButtonColor: '#F38383',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async response => {
        var dtt = {
          bookNo: item.bookNo,
          contactDate: this.format_date(new Date()),
          status: 'cancel',
          statusUse: 'use',
          shopId: this.$session.getAll().data.shopId,
          CREATE_USER: this.$session.getAll().data.userName,
          LAST_USER: this.$session.getAll().data.userName,
          remarkRemove: 'เนื่องจากลูกค้าไม่มาตามคิวที่เลือก'
        }
        await axios
          .post(this.DNS_IP + '/booking_transaction/add', dtt)
          .then(async responses => {
            this.$swal('เรียบร้อย', 'ยกเลิกคิวสำเร็จ', 'success')
            await this.updateProcessShopNew()
            // await this.searchBooking('unNoti')
            this.HistoryData = []
            this.shopPhone = ''
          })
      })
        .catch(async err => {
          console.log(err.code, err.message)
          await this.searchBooking('unNoti')
        })
      // } else {
      //   this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
      //   await this.searchBooking('unNoti')
      // }
    },
    async getBefore () {
      await this.getDataBranch()
      await this.getDataFlow()
      this.setTime()
      this.getShop()
      this.checkSearch()
      this.$root.$on('closeSetTimeBookingListQueue', () => {
        this.closeSetTimeBookingListQueue()
      })
      this.dataLineConfig = await this.getDataLineConfig(this.$session.getAll().data.shopId)
    },
    async beforeCreate () {
      if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
        if (JSON.parse(localStorage.getItem('sessionData')).shopId) {
          this.$session.start()
          this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
          await this.getBefore()
        } else {
          this.$router.push('/Core/Login')
        }
      } else {
        if (!this.$session.exists()) {
          this.$router.push('/Core/Login')
        } else {
          if (this.$session.getAll().data.shopId) {
            localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
            await this.getBefore()
          } else {
            this.$router.push('/Core/Login')
          }
        }
      }
    },
    momentThaiText (item) {
      let dt = moment(item).locale('th').format('LL')
      return dt
    },
    dial: function (number) {
      window.location = 'tel:' + number
    },
    async sendQonline (item) {
      let dtt = {
        checkGetQueue: 'False'
      }
      await axios
        .post(this.DNS_IP + '/Booking/pushMsgQueue/' + item.bookNo, dtt)
        .then(async responses => {
          this.$swal({
            title: 'Send successfully',
            text: 'ส่งสำเร็จ',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        }).catch(error => {
          console.log('error function pushMsgQueue : ', error)
        })
    },
    async openHistory (item) {
      if (item) {
        this.HistoryData = this.BookingDataList[item.bookNo]
        this.pictureUrHistory = item.memberPicture
        if (this.HistoryData) {
          let phoneNum = this.HistoryData.filter(item3 => { return item3.fieldValue !== '' && item3.fieldName === 'เบอร์โทร' })
          if (phoneNum && phoneNum.length > 0) {
            this.shopPhone = phoneNum[0].fieldValue.replace(/-/g, '')
          } else {
            this.shopPhone = ''
          }
        }
      }
    },
    async getShop () {
      let shopImg = ''
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs && rs.length > 0) {
            this.shopName = rs[0].shopName
            shopImg = rs[0].imageBase64 || ''
          } else {
            this.shopName = ''
            this.shopImg = ''
            shopImg = ''
          }
          if (shopImg !== '') {
            this.shopImg = shopImg
          } else {
            this.shopImg = ''
          }
        })
    },
    validate (Action) {
      switch (Action) {
        case 'SEARCH':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_search.validate()
          })
          break
        default:
          break
      }
    },
    checkSearch () {
      this.validate('SEARCH')
      this.searchBooking('unNoti')
    },
    async MyBooking () {
      let filterConfirmJob = []
      try {
        let empId = parseInt(this.$session.getAll().data.empId) || null
        await axios
          .get(`${this.DNS_IP}/booking_view/getQueueOhrich?masBranchID=${this.masBranchID}&flowId=${this.$session.getAll().data.flowId}&storeFrontQueueEmpId=${empId}`)
          .then(async response => {
            if (response && response.data) {
              let data = response.data
              if (data && data.length > 0) {
                filterConfirmJob = data.filter(item => item.status === 'confirmJob' && parseInt(item.storeFrontQueueEmpId) === empId)
              }
            }
          })
      } catch (error) {
        console.log('Error getBooking', error)
      }
      return filterConfirmJob
    },
    async searchBooking (checkNoti, item) {
      try {
        if (this.validSearch === true) {
          let waitingQueue = []
          await this.getBookingDataList(this.dateStart)
          let urlApi = {}
          if (this.flowSelect === 'allFlow') {
            urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&dueDate=' +
            this.dateStart + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
          } else {
            urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&flowId=' +
            this.flowSelect +
            '&dueDate=' +
            this.dateStart + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
          }
          console.log('this.flowSelect x', this.flowSelect)
          if (this.flowSelect) {
            let empIdQueue = parseInt(this.$session.getAll().data.empId) || null
            await axios
              .get(urlApi)
              .then(async response => {
                let rs = response.data
                if (rs.status === false) {
                  this.callQueue = {
                    bookNo: '',
                    storeFrontQueue: 'XXXX',
                    status: 'no have type',
                    audioFileId: null,
                    storeFrontQueueEmpId: null
                  }
                  waitingQueue = []
                  this.HistoryData = []
                  this.shopPhone = ''
                  return
                }
                console.log('rs', rs)
                if (rs && rs.length > 0) {
                  const filterConfirmJob = rs.filter(item => item.statusBt === 'confirmJob' && parseInt(item.storeFrontQueueEmpId) === empIdQueue)
                  if (filterConfirmJob && filterConfirmJob.length > 0) {
                    this.callQueue = {
                      bookNo: filterConfirmJob[0].bookNo,
                      storeFrontQueue: filterConfirmJob[0].storeFrontQueue,
                      status: 'confirmJob',
                      audioFileId: filterConfirmJob[0].audioFileId,
                      storeFrontQueueEmpId: parseInt(filterConfirmJob[0].storeFrontQueueEmpId),
                      storeFrontNotifyStatus: filterConfirmJob[0].storeFrontNotifyStatus,
                      storeFrontNotifySet: filterConfirmJob[0].storeFrontNotifySet,
                      lineUserId: filterConfirmJob[0].lineUserId,
                      servicePoint: filterConfirmJob[0].servicePoint,
                      servicePointCount: filterConfirmJob[0].servicePointCount
                    }
                  } else {
                    let filterDataConfirm = rs.filter(a => a.statusBt === 'confirm')
                    if (filterDataConfirm && filterDataConfirm.length > 0) {
                      this.callQueue = {
                        bookNo: filterDataConfirm[0].bookNo,
                        storeFrontQueue: filterDataConfirm[0].storeFrontQueue,
                        status: filterDataConfirm[0].statusBt,
                        audioFileId: filterDataConfirm[0].audioFileId,
                        storeFrontQueueEmpId: parseInt(filterDataConfirm[0].storeFrontQueueEmpId),
                        storeFrontNotifyStatus: filterDataConfirm[0].storeFrontNotifyStatus,
                        storeFrontNotifySet: filterDataConfirm[0].storeFrontNotifySet,
                        lineUserId: filterDataConfirm[0].lineUserId,
                        servicePoint: filterDataConfirm[0].servicePoint,
                        servicePointCount: filterDataConfirm[0].servicePointCount
                      }
                    } else {
                      this.callQueue = {
                        bookNo: '',
                        storeFrontQueue: 'XXXX',
                        status: 'no have type',
                        audioFileId: null,
                        storeFrontQueueEmpId: null
                      }
                      this.HistoryData = []
                      this.shopPhone = ''
                    }
                  }
                  response.data.filter(item => item.statusBt === 'confirm').forEach(queue => {
                    waitingQueue.push(queue.storeFrontQueue)
                  })
                  this.openHistory(this.callQueue)
                  if (checkNoti === 'noti') {
                    if (item.storeFrontNotifyStatus === 'True') {
                      if (parseInt(item.storeFrontNotifySet) > 0) {
                        this.pushMessageRecallQueue(parseInt(item.storeFrontNotifySet), 'False')
                      }
                    }
                  }
                }
              })
          } else {
            this.callQueue = {
              bookNo: '',
              storeFrontQueue: 'XXXX',
              status: 'no have type',
              storeFrontQueueEmpId: null
            }
          }
          this.waitingQueue = waitingQueue
        }
      } catch (error) {
        console.log('Error searchBooking', error)
      }
    },
    async getBookingDataList (dateStart) {
      this.BookingDataList = []
      let url = ''
      if (this.flowSelect === 'allFlow') {
        url = `${this.DNS_IP}/BookingData/getView?shopId=${this.$session.getAll().data.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
      } else {
        url = `${this.DNS_IP}/BookingData/getView?shopId=${this.$session.getAll().data.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}&flowId=${this.flowSelect}`
      }
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach((row) => {
              if (typeof (this.BookingDataList[row.bookNo]) === 'undefined') {
                this.BookingDataList[row.bookNo] = []
              }
              // ข้อมูลวนตามจำนวน row จึงต้องเช็คให้ push เฉพาะตัวที่ไม่ซ้ำ
              const exists = this.BookingDataList[row.bookNo].some(item => item.bookingDataId === row.bookingDataId)
              if (!exists) {
                this.BookingDataList[row.bookNo].push(row)
              }
            })
          }
        }).catch(error => {
          this.getBookingDataList(dateStart)
          console.log('catch getBookingDataList : ', error)
        })
    },
    setTime () {
      this.timeavailable = []
      if (this.DataFlowItem) {
        let checkFlow = this.DataFlowItem.filter(el => { return el.value === this.flowSelect })
        if (checkFlow && checkFlow.length > 0) {
          this.timeavailable = JSON.parse(checkFlow[0].allData.setTime)
        } else {
          this.timeavailable = []
        }
      }
    },
    async getDataFlow () {
      let resultOption = []
      await axios
        .get(this.DNS_IP + `/flow/get?shopId=${this.$session.getAll().data.shopId}&storeFrontCheck=True&masBranchIDAll=${this.masBranchID}`)
        .then(response => {
          let rs = response.data
          if (rs && rs.length > 0) {
            // resultOption.push({'text': 'ทั้งหมด', 'value': 'allFlow'})
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              if (JSON.parse(this.$session.getAll().data.flowId).filter(el => { return el === d.flowId }).length > 0) {
                s.text = d.flowName
                s.value = d.flowId
                s.allData = d
                resultOption.push(s)
              }
            }
          } else {
            resultOption = []
          }
        })
      this.DataFlowItem = resultOption
      if (resultOption && resultOption.length > 0) {
        this.flowSelect = this.DataFlowItem[0].value
      }
    },
    async getDataBranch () {
      this.branchItem = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName', '')
      if (this.branchItem && this.branchItem.length > 0) {
        const branchSession = this.$session.getAll().data.masBranchID
        let USER_ROLE = this.$session.getAll().data.USER_ROLE || ''
        if (USER_ROLE === 'storeFront' && this.branchItem) {
          const matchBranch = this.branchItem.filter(branch => branch.allData.masBranchID === branchSession)
          this.branchItem = matchBranch && matchBranch.length > 0 ? matchBranch : this.branchItem
        }
        this.masBranchID = this.branchItem[0].value
      }
    },
    async getDataFromAPI (url, fieldId, fieldName, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.$session.getAll().data.shopId}${param}`)
        .then(response => {
          let rs = response.data
          if (rs && rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d[fieldName]
              s.value = d[fieldId]
              s.allData = d
              result.push(s)
            }
          } else {
            result = []
          }
        })
      return result
    },
    closeJobServicePointReturn (item) {
      if (this.servicePoint === '') {
        this.$swal('ผิดพลาด', 'กรุณาเลือกจุดบริการ', 'error')
      } else {
        this.$swal({
          title: `ต้องการเรียกคิว ${item.storeFrontQueue} ใช่หรือไม่?`,
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1DBF73',
          cancelButtonColor: '#F38383',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async response => {
          await this.updateServicePoint(item.bookNo)
          await this.reCallNoti(item)
          let lineUserId = item.lineUserId || ''
          if (lineUserId !== '') {
            let dtt = {
              checkGetQueue: 'True'
            }
            await axios
              .post(this.DNS_IP + '/Booking/pushMsgQueueReturn/' + item.bookNo, dtt)
              .then(async responses => {}).catch(error => {
                console.log('error function pushMsgQueueReturn : ', error)
              })
          }
          this.dialogServicePointStatus = false
          this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
          // await this.updateProcessShopNew()
          // await this.searchBooking('unNoti')
        })
      }
    },
    async closeJobServicePointSubmit (item) {
      var dtt = {
        bookNo: item.bookNo,
        contactDate: this.format_date(new Date()),
        status: 'confirmJob',
        statusUse: 'use',
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/booking_transaction/add', dtt)
        .then(async responses => {
          await this.updateServicePoint(item.bookNo)
          await this.CallNoti(item)
          this.updateProcessShopNew()
          let lineUserId = item.lineUserId || ''
          if (lineUserId !== '') {
            let dtt = {
              checkGetQueue: 'True'
            }
            await axios
              .post(this.DNS_IP + '/Booking/pushMsgQueue/' + item.bookNo, dtt)
              .then(async responses => {}).catch(error => {
                console.log('error function pushMsgQueue : ', error)
              })
          }
          this.dialogServicePointStatus = false
          this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
          await this.searchBooking('noti', item)
        })
    },
    async closeJobServicePoint (item) {
      if (this.servicePoint === '') {
        this.$swal('ผิดพลาด', 'กรุณาเลือกจุดบริการ', 'error')
      } else {
        let statusBooking = await this.checkBookingStatus(item.bookNo)
        if (statusBooking === 'confirm') {
          this.$swal({
            title: `ต้องการเรียกคิว ${item.storeFrontQueue} ใช่หรือไม่?`,
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1DBF73',
            cancelButtonColor: '#F38383',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          }).then(async response => {
            let USER_ROLE = this.$session.getAll().data.USER_ROLE || ''
            let empId = this.$session.getAll().data.empId || ''
            if (USER_ROLE === 'storeFront' && empId !== '') {
              let statusBookingCheck = await this.checkBookingStatus(item.bookNo)
              if (statusBookingCheck === 'confirm') {
                let statusUpdateEmp = await this.updateEmp(item.bookNo, 'confirm')
                if (statusUpdateEmp === true) {
                  this.closeJobServicePointSubmit(item)
                } else {
                  this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
                  this.dialogServicePointStatus = false
                  await this.searchBooking('unNoti')
                }
              } else {
                this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
                this.dialogServicePointStatus = false
                await this.searchBooking('unNoti')
              }
            } else {
              this.closeJobServicePointSubmit(item)
            }
          })
        } else {
          this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
          this.dialogServicePointStatus = false
          await this.searchBooking('unNoti')
        }
      }
    },
    async closeJobSubmitReturn (item) {
      this.closeSetTimeBookingListQueue()
      console.log('closeJobSubmitReturn', item)
      if (item.servicePointStatus === 'True') {
        this.closeItem = item
        this.dialogServicePointStatus = true
        this.servicePoint = item.servicePoint || ''
        if (item.servicePointRecursive === 'False') {
          await this.setservicePointCount(item)
        } else {
          this.servicePointItem = JSON.parse(item.servicePointCount) || []
        }
        this.statusReturn = true
      } else {
        this.$swal({
          title: `ต้องการเรียกคิว ${item.storeFrontQueue} ใช่หรือไม่?`,
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1DBF73',
          cancelButtonColor: '#F38383',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async response => {
          let lineUserId = item.lineUserId || ''
          this.reCallNoti(item)
          if (lineUserId !== '') {
            let dtt = {
              checkGetQueue: 'True'
            }
            await axios
              .post(this.DNS_IP + '/Booking/pushMsgQueueReturn/' + item.bookNo, dtt)
              .then(async responses => {}).catch(error => {
                console.log('error function pushMsgQueueReturn : ', error)
              })
          }
          this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
          await this.searchBooking('unNoti')
        }).catch(errors => {
          console.log(errors)
        })
      }
    },
    async backHomeSubmit (item) {
      console.log('backHomeSubmit', item)
      this.closeSetTimeBookingListQueue()
      let statusBooking = await this.checkBookingStatus(item.bookNo)
      if (statusBooking === 'confirmJob') {
        this.$swal({
          title: `ต้องการปิดงาน ${item.storeFrontQueue} ใช่หรือไม่?`,
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1DBF73',
          cancelButtonColor: '#F38383',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async response => {
          var dtt = {
            bookNo: item.bookNo,
            contactDate: this.format_date(new Date()),
            status: 'closeJob',
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.$session.getAll().data.userName,
            LAST_USER: this.$session.getAll().data.userName
          }
          await axios
            .post(this.DNS_IP + '/booking_transaction/add', dtt)
            .then(async responses => {
              this.$swal('เรียบร้อย', 'ปิดงานสำเร็จ', 'success')
              await this.updateProcessShopNew()
              // await this.searchBooking('unNoti')
              this.HistoryData = []
              this.shopPhone = ''
            })
        }).catch(errors => {
          console.log(errors)
        })
      } else {
        this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
        await this.searchBooking('unNoti')
      }
    },
    async setservicePointCount (item) {
      this.servicePointItem = []
      await axios
        .get(this.DNS_IP + '/booking_view/get?shopId=' + item.shopId + '&flowId=' + item.flowId +
        '&dueDateDay=' + this.dateStart + '&storeFrontQueue=is not null&statusBt=confirmJob&servicePointStatus=True')
        .then(async response => {
          let rs = response.data
          console.log('setservicePointCount', rs)
          if (rs && rs.status !== false) {
            let servicePointItem = rs.filter(el => { return el.servicePoint !== null || el.servicePoint !== '' })
            if (servicePointItem && servicePointItem.length > 0) {
              if (JSON.parse(item.servicePointCount).length > 0) {
                for (let i = 0; i < JSON.parse(item.servicePointCount).length; i++) {
                  let d = JSON.parse(item.servicePointCount)[i]
                  console.log('Count', servicePointItem.filter(el => { return el.servicePoint === d.textTh }))
                  if (servicePointItem.filter(el => { return el.servicePoint === d.textTh }).length === 0) {
                    this.servicePointItem.push(d)
                  }
                }
                if (servicePointItem.filter(el => { return el.servicePoint === item.servicePoint }).length > 0) {
                  let otherCounr = JSON.parse(item.servicePointCount).filter(el => { return el.textTh === item.servicePoint })
                  if (otherCounr && otherCounr.length > 0) {
                    this.servicePointItem.push(otherCounr[0])
                  }
                }
              } else {
                this.servicePointItem = []
              }
            } else {
              this.servicePointItem = JSON.parse(item.servicePointCount) || []
            }
          } else {
            this.servicePointItem = JSON.parse(item.servicePointCount) || []
          }
        })
        .catch(err => {
          console.log(err.code, err.message)
          this.servicePointItem = JSON.parse(item.servicePointCount) || []
        })
    },
    async closeJobSubmit (item) {
      this.closeSetTimeBookingListQueue()
      if (item.status === 'confirm') {
        console.log('closeJobSubmit', item)
        let statusBooking = await this.checkBookingStatus(item.bookNo)
        if (statusBooking === 'confirm') {
          if (item.servicePointStatus === 'True') {
            this.closeItem = item
            this.dialogServicePointStatus = true
            this.servicePoint = item.servicePoint || ''
            if (item.servicePointRecursive === 'False') {
              await this.setservicePointCount(item)
            } else {
              this.servicePointItem = JSON.parse(item.servicePointCount) || []
            }
            this.statusReturn = false
          } else {
            this.$swal({
              title: `ต้องการเรียกคิว ${item.storeFrontQueue} ใช่หรือไม่?`,
              type: 'question',
              showCancelButton: true,
              confirmButtonColor: '#1DBF73',
              cancelButtonColor: '#F38383',
              confirmButtonText: 'ใช่',
              cancelButtonText: 'ไม่'
            }).then(async response => {
              let USER_ROLE = this.$session.getAll().data.USER_ROLE || ''
              let empId = this.$session.getAll().data.empId || ''
              if (USER_ROLE === 'storeFront' && empId !== '') {
                let statusBookingCheck = await this.checkBookingStatus(item.bookNo)
                if (statusBookingCheck === 'confirm') {
                  let statusUpdateEmp = await this.updateEmp(item.bookNo, 'confirm')
                  if (statusUpdateEmp === true) {
                    this.closeJob(item)
                    await this.updateProcessShopNew()
                  } else {
                    this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
                    await this.searchBooking('unNoti')
                  }
                } else {
                  this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
                  await this.searchBooking('unNoti')
                }
              } else {
                this.closeJob(item)
                await this.updateProcessShopNew()
              }
            }).catch(errors => {
              console.log(errors)
            })
          }
        } else {
          this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
          await this.searchBooking('unNoti')
        }
      }
    },
    async closeJob (item) {
      var dtt = {
        bookNo: item.bookNo,
        contactDate: this.format_date(new Date()),
        status: 'confirmJob',
        statusUse: 'use',
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/booking_transaction/add', dtt)
        .then(async responses => {
          await this.CallNoti(item)
          let lineUserId = item.lineUserId || ''
          if (lineUserId !== '') {
            let dtt = {
              checkGetQueue: 'True'
            }
            await axios
              .post(this.DNS_IP + '/Booking/pushMsgQueue/' + item.bookNo, dtt)
              .then(async responses => {}).catch(error => {
                console.log('error function pushMsgQueue : ', error)
              })
          }
          this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
          await this.searchBooking('noti', item)
        })
    },
    async updateServicePoint (bookNo) {
      var dtt = {
        servicePoint: this.servicePoint
      }
      await axios
        .post(this.DNS_IP + '/Booking/edit/' + bookNo, dtt)
        .then(async responses => {})
    },
    async checkBookingStatus (bookNo) {
      let result = ''
      await axios
        .get(this.DNS_IP + '/booking_view/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&bookNo=' + bookNo)
        .then(response => {
          let rs = response.data
          if (rs && rs.length > 0) {
            result = rs[0].statusBt || ''
          } else {
            result = ''
          }
        })
      return result
    },
    async updateEmp (bookNo, status) {
      let result = ''
      var dtt = {
        storeFrontQueueEmpId: parseInt(this.$session.getAll().data.empId),
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/Booking/editQueueEmp/' + bookNo + '?status=' + status, dtt)
        .then(async response => {
          let rs = response.data
          result = rs.status
        })
      return result
    },
    async CallNoti (item) {
      let dtdt = {
        bookNo: item.bookNo,
        servicePoint: this.servicePoint,
        shopId: this.$session.getAll().data.shopId,
        storeFrontQueue: item.storeFrontQueue,
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/callQueues/add', dtdt)
        .then(async responses => {})
    },
    async reCallNoti (item) {
      let dtdt = {
        statusNotify: 'False',
        servicePoint: this.servicePoint,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/callQueues/edit/' + item.audioFileId, dtdt)
        .then(async responses => {
          this.$swal('เรียบร้อย', 'กรุณารอเรียกคิว', 'success')
        })
      this.updateProcessShopNew()
    },
    async pushMessageRecallQueue (countNoti, checkGetQueue) {
      if (this.callQueue) {
        let bookSelect = this.callQueue.filter((element, index) => { return element.statusBt === 'confirm' })
        console.log('bookSelect', bookSelect)
        if (bookSelect && bookSelect.length > 0) {
          let bookSelectuse = bookSelect.filter((element, index) => { return index === countNoti })
          console.log('bookSelectuse', bookSelectuse)
          for (let i = 0; i < bookSelectuse.length; i++) {
            let d = bookSelectuse[i]
            let s = {}
            s.lineUserId = d.lineUserId || ''
            if (s.lineUserId !== '') {
              let dtt = {
                checkGetQueue: checkGetQueue
              }
              await axios
                .post(this.DNS_IP + '/Booking/pushMsgQueue/' + d.bookNo, dtt)
                .then(async responses => {}).catch(error => {
                  console.log('error function pushMsgQueue : ', error)
                })
            }
          }
        }
      }
    },
    async getFirestore () {
      try {
        console.log('getFirestore -> ', this.unsubscribe)
        if (this.unsubscribe) {
          this.unsubscribe()
        }
        this.firestore = this.$firebase.firestore()
        this.unsubscribe = this.firestore.collection(`QueueOnline/shopId/${this.$session.getAll().data.shopId}`).doc(this.$session.getAll().data.userName)
          .onSnapshot(async (snapshot) => {
            if (!snapshot.exists) {
              await this.createProcessShopNew()
            } else {
              // console.log('getFirestore -> data', snapshot.data())
              if (snapshot.data().active === '1') {
                console.log('active [start] is updateProcessShopUpdate')
                await this.updateProcessShopUpdate()
                console.log('active [end] is updateProcessShopUpdate')
                console.log('snapshot data -> active is 1')
                console.log('active [start] is get booking')
                await this.searchBooking()
                console.log('active [end] is get booking')
              } else {
                console.log('snapshot data -> active is 0')
              }
            }
          })
      } catch (error) {
        console.log('Error getFirestore', error)
      }
    },
    async createProcessShopNew () { // set active = 1
      try {
        let body = {
          userName: this.$session.getAll().data.userName,
          shopId: this.$session.getAll().data.shopId
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/QueueOnline-CreateProcessNew', body)
      } catch (error) {
        console.log('createProcessShopNew error-> ', error)
      }
    },
    async updateProcessShopNew () { // update active = 1
      try {
        let body = {
          // userName: this.$session.getAll().data.userName,
          shopId: this.$session.getAll().data.shopId
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/QueueOnline-ProcessNew', body)
      } catch (error) {
        console.log('updateProcessShopNew error-> ', error)
      }
    },
    async updateProcessShopUpdate () { // update active = 0
      try {
        let body = {
          userName: this.$session.getAll().data.userName,
          shopId: this.$session.getAll().data.shopId
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/QueueOnline-ProcessUseNew', body)
      } catch (error) {
        console.log('updateProcessShopUpdate error-> ', error)
      }
    }
  }
}
</script>
<style scope>
.rounded-btn-circle {
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 50em !important;
  width: 140px !important;
  height: 140px !important;
  box-sizing: border-box;
  border: 10px solid transparent;
}
.rounded-btn-confirm-circle {
  background: linear-gradient(#25D366,  #23B091) padding-box, linear-gradient(to right,#25D366,  #23B091) border-box;
}
.rounded-btn-closejob-circle {
  background: linear-gradient(#DADADA,  #A1A1A1) padding-box, linear-gradient(to right,#DADADA,  #A1A1A1) border-box;
}
#margin {
  margin-top: 50px;
  margin-bottom: 40px;
}
.v_text_edit {
  Width: 255px;
  Height: 52px;
  font-size: 10px !important;
}
#subtext {
  color: #173053;
  font-size: 30px !important;
  font-weight: bold;
}
/* .rounded-btn {
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 50em;
  width: 140px !important;
  height: 140px !important;
  box-sizing: border-box;
  border: 10px solid transparent;
}
.rounded-btn-confirm {
  background: linear-gradient(#25D366,  #23B091) padding-box, linear-gradient(to right,#25D366,  #23B091) border-box;
}
.rounded-btn-closejob {
  background: linear-gradient(#DADADA,  #A1A1A1) padding-box, linear-gradient(to right,#DADADA,  #A1A1A1) border-box;
} */
.text-event{
  font-size: 20px;
  font-weight: bold;
}
.text-bell-disabled{
  color: hsla(0,0%,100%,.3)!important;
}
</style>
