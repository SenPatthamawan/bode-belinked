<template>
  <div>
    <v-card flat v-if="!dataReady">
      <v-card-text>
        <div class="text-center">
          <waitingAlert></waitingAlert>
        </div>
      </v-card-text>
    </v-card>
    <v-card flat v-if="dataReady">
      <v-toolbar color="#173053" dark extended flat>
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      </v-toolbar>

      <v-card class="mx-auto" max-width="700" style="margin-top: -64px;">
        <v-toolbar flat>
          <v-toolbar-title class="#173053--text">
            {{ dataItem[0].cusName }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn color="#173053" icon @click="toggle">
            <v-icon>mdi-calendar-multiple-check</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text style="height: 100%;">
          <v-container>
            <template v-if="BookingDataItemEdit">
              <v-row class="InputData">
                <!-- <v-select
                    v-model="masBranchID"
                    :items="branch"
                    label="สาขา"
                    outlined
                    dense
                    class="pa-2 pb-0 pt-0"
                    readonly
                  ></v-select> -->
                <v-text-field
                  v-model="BookingDataItemEdit[0].masBranchName"
                  label="สาขา"
                  class="pa-2 pb-0 pt-0"
                  outlined
                  dense
                  readonly
                ></v-text-field>
              </v-row>
              <v-row class="InputData">
                <v-text-field
                  v-model="BookingDataItemEdit[0].flowName"
                  label="ประเภทบริการ"
                  class="pa-2 pb-0 pt-0"
                  outlined
                  dense
                  readonly
                ></v-text-field>
              </v-row>
              <div v-for="(item, index) in BookingDataItemEdit" :key="index">
                <template
                  v-if="
                    item.conditionField === '' || item.conditionField === null
                  "
                >
                  <v-row class="InputData">
                    <v-text-field
                      v-model="item.fieldValue"
                      :label="item.fieldName"
                      class="pa-2 pb-0 pt-0"
                      outlined
                      dense
                      readonly
                    ></v-text-field>
                    <v-icon
                      class="pa-3 pb-10 pt-0"
                      v-if="item.fieldName === 'เบอร์โทร'"
                      large
                      color="#64DD17"
                      @click="dial(item.phone)"
                      >call</v-icon
                    >
                  </v-row>
                </template>
                <template
                  v-if="
                    item.conditionField !== '' &&
                      BookingDataItemEdit.filter(row => {
                        return row.fieldId === parseInt(item.conditionField);
                      }).length > 0
                  "
                >
                  <template
                    v-if="
                      item.conditionValue ===
                        BookingDataItemEdit.filter(row => {
                          return row.fieldId === parseInt(item.conditionField);
                        })[0].fieldValue
                    "
                  >
                    <v-row class="InputData">
                      <v-text-field
                        v-model="item.fieldValue"
                        :label="item.fieldName"
                        outlined
                        readonly
                        class="pa-2 pb-0 pt-0"
                        dense
                      ></v-text-field>
                      <v-icon
                        class="pa-3 pb-10 pt-0"
                        v-if="item.fieldName === 'เบอร์โทร'"
                        large
                        color="#64DD17"
                        @click="dial(item.phone)"
                        >call</v-icon
                      >
                    </v-row>
                  </template>
                </template>
                <template v-if="item.conditionField === 'flow'">
                  <template
                    v-if="
                      parseInt(item.conditionValue) === parseInt(flowIdSelect)
                    "
                  >
                    <v-row class="InputData">
                      <v-text-field
                        v-model="item.fieldValue"
                        :label="item.fieldName"
                        dense
                        readonly
                        class="pa-2 pb-0 pt-0"
                        outlined
                      ></v-text-field>
                      <v-icon
                        class="pa-3 pb-10 pt-0"
                        v-if="item.fieldName === 'เบอร์โทร'"
                        large
                        color="#64DD17"
                        @click="dial(item.phone)"
                        >call</v-icon
                      >
                    </v-row>
                  </template>
                </template>
              </div>
            </template>
            <v-row class="InputData">
              <v-text-field
                v-model="BookingDataItem[0].fieldValue"
                :label="BookingDataItem[0].fieldName"
                class="pa-2 pb-0 pt-0"
                outlined
                dense
                readonly
              ></v-text-field>
            </v-row>
            <v-form ref="form_update" v-model="validUpdate" lazy-validation>
            <v-col
              cols="12"
              class="pa-2 pb-0 pt-0"
              v-if="statusShowDateConfiremjob & statusBook === 'wait'"
            >
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDate"
                    label="วันที่คาดว่าจะเสร็จ"
                    persistent-hint
                    dense
                    outlined
                    required
                    :rules="[rules.required]"
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    v-on="on"
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  no-title
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              class="pa-2 pb-0 pt-0"
              v-if="statusShowDateConfiremjob & statusBook === 'wait'"
            >
              <v-select
                v-model="endTime"
                :items="timeavailable"
                label="เวลา"
                item-text="text"
                item-value="text"
                persistent-hint
                return-object
                outlined
                dense
                required
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col class="pa-2 pb-0 pt-0" cols="12" v-if="statusBook === 'confirm'">
              <v-select
                v-model="empSelectJob"
                :items="empSelectStepAdd"
                label="พนักงานที่นำเข้ากระดานทำงาน"
                menu-props="auto"
                outlined
                required
                :rules="[rules.required]"
                dense
              ></v-select>
            </v-col>
            </v-form>
            <div class="text-center">
              <v-btn
                v-if="statusBook === 'confirm'"
                color="primary"
                title
                @click.stop="addDataJob()"
              >
                <v-icon left dark> mdi-account-plus</v-icon>
                รับเข้าบริการ
              </v-btn>
              <v-btn
                v-if="statusBook === 'confirmJob'"
                color="teal"
                title
                dark
                @click.stop="(dialogJob = true), getjob(dataItem[0])"
              >
                <v-icon left> mdi-account-plus</v-icon>
                QR Code สำหรับให้ลูกค้า
              </v-btn>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
      <v-dialog v-model="dialogJob" persistent max-width="100%">
            <v-card
              style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);">
                <v-container >
                  <v-row >
                    <v-col cols="12" v-if="checkShowSelectUser">
                      <div class=" text-center">
                        <v-tabs
                          v-model="tabSelectUser"
                          background-color="#1B437C"
                          centered
                          dark
                          icons-and-text
                        >
                          <v-tabs-slider></v-tabs-slider>
                          <v-tab>
                            ลูกค้าที่นัดหมาย
                            <v-icon>mdi-card-account-phone</v-icon>
                          </v-tab>

                          <v-tab>
                            แสกน QR / Skip
                            <v-icon>mdi-qrcode-edit</v-icon>
                          </v-tab>

                          <v-tab-item style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);">
                            <br>
                            <v-row justify="center" class="spacer" no-gutters>
                              <v-col cols="4" sm="2" md="1">
                                <v-avatar
                                  size="60px"
                                >
                                  <img
                                    alt="Avatar"
                                    :src="dataSelectUser.picture"
                                  >
                                </v-avatar>
                              </v-col>
                              <v-col cols="6" sm="4" md="2">คุณ {{dataSelectUser.name}}</v-col>
                            </v-row>
                            <v-row justify="center" class="spacer" no-gutters>
                              <v-col col="12"><strong>ลูกค้าที่นัดหมาย</strong></v-col>
                            </v-row>
                          </v-tab-item>
                          <v-tab-item style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);">
                            <br>
                            <div v-if="jobitem.length > 0 && userId === ''" class="avatar text-center">
                              <qrcode-vue :value="value" :size="size" level="H" :foreground="foreground" />
                            </div>
                          </v-tab-item>
                        </v-tabs>
                      </div>
                    </v-col>
                    <v-col cols="12" v-if="!checkShowSelectUser">
                      <div class=" text-center">
                      <br>
                        <br>
                        <h2 style="font-weight: 900; color:#FFA000">ติดตามสถานะ!</h2>
                        <qrcode-vue v-if="userId === ''" :value="value" :size="size" level="H" :foreground="foreground" />
                        <template v-if="jobitem.length > 0">
                         <div v-if="userId !== ''" class="avatar text-center">
                            <v-avatar v-if="memberPicture !== ''" size="120" style="border:5px solid #FFFFFF;">
                                <img :src= memberPicture>
                            </v-avatar>
                            <v-avatar v-if="memberPicture === '' && userId === 'user-skip' && jobitem[0].recordStatus === 'D'" size="120" style="border:5px solid #FFFFFF;">
                                <v-img
                                  class="v_text_add"
                                  :src="require('@/assets/OtherP.svg')"
                                ></v-img>
                            </v-avatar>
                            <!-- <p class="text-center">{{profile.displayName}}</p> -->
                        </div>
                        </template>
                         <div v-if="jobitem.length > 0" class="avatar text-center">
                           <qrcode-vue v-if="userId === 'user-skip' && jobitem[0].recordStatus === 'N'" :value="value" :size="size" level="H" :foreground="foreground" />
                        </div>
                    </div>
                  </v-col>
                </v-row>
                </v-container>
                <v-row >
                  <v-col cols="12">
                      <v-container class="text-center" >
                        <v-container>
                            <div v-for="(p , index) in jobitem" :key="index">
                              <h4>{{p.name}} : {{p.value}}</h4>
                              <!-- <h4 v-if="p.showCard === 'True' ">{{p.name}} : {{p.value}}</h4> -->
                            </div>
                            <div v-if="jobitem.length > 0">
                              <!-- <v-btn small class="ma-2" color="teal" v-if="jobitem[0].recordStatus === 'D'" @click="setBookingingAgain()" dark>
                                  นัดหมายอีกครั้ง
                                <v-icon dark right>
                                  mdi-notebook-check
                                </v-icon>
                              </v-btn> -->
                              <strong style="color: red;" v-if="jobitem[0].recordStatus === 'D'"><h2>รายการนี้ปิดไปแล้ว</h2></strong>
                            </div>
                            <!-- <div>
                              <v-btn small class="ma-2" color="success" v-if="userId !== '' && recordStatusJob === 'N'" @click="dialogCloseJob = true" dark>
                                  ปิดงานนี้
                                <v-icon dark right>
                                  mdi-cash-usd-outline
                                </v-icon>
                              </v-btn>
                            </div> -->
                        </v-container>
                        <template v-if="!checkShowSelectUser">
                          <v-btn small class="ma-2" color="success" v-if="userId === ''" @click="pushMsgSelectUser" dark>
                            ส่ง QR Code
                          <v-icon dark right>
                          mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="primary" v-if="userId === ''" @click="jobConfirm" dark>
                            SKIP
                          <v-icon dark right>
                          mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="error" @click="dialogJob = false" dark >
                        Close
                        <v-icon dark right>
                            mdi-minus-circle
                        </v-icon>
                        </v-btn>
                        </template>
                        <template v-if="checkShowSelectUser">
                        <v-btn small class="ma-2" color="success" v-if="userId === '' && tabSelectUser === 1" @click="pushMsgSelectUser" dark>
                            ส่ง QR Code
                          <v-icon dark right>
                          mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="primary" v-if="userId === '' && tabSelectUser === 1" @click="jobConfirm" dark>
                            SKIP
                          <v-icon dark right>
                          mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="primary" v-if="tabSelectUser === 0 || tabSelectUser === null" @click="jobConfirmUser" dark>
                            ลูกค้าท่านเดียวกับที่นัดหมาย
                          <v-icon dark right>
                            mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="error" @click="dialogJob = false, chkBookingNo()" dark >
                            Close
                            <v-icon dark right>
                                mdi-minus-circle
                            </v-icon>
                        </v-btn>
                        </template>
                    </v-container>
                  </v-col>
                </v-row>
              </v-card>
          </v-dialog>
    </v-card>
    <BookingQueue
      :branchParent="branch"
      :masBranchIDParent="masBranchID"
      :drawerParent="drawer"
      :menu1Parent="menu1"
      :timeTableParent="timeTable"
      :rulesParent="rules"
      :masterTimeParent="masterTime"
      :dataItemTimesChangeParent="dataItemTimesChange"
      :getTimesChangeParent="getTimesChange"
      :toggleParent="toggle"
      @updateTimeTable="updateTimeTablefromChild"
    ></BookingQueue>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import QrcodeVue from 'qrcode.vue'
import axios from 'axios' // api
import moment from 'moment-timezone'
import BookingQueue from './BookingQueueMobile.vue'
import VuetifyMoney from '../VuetifyMoney.vue'
export default {
  components: {
    waitingAlert,
    BookingQueue,
    VuetifyMoney,
    QrcodeVue
  },
  name: 'BookingList',
  data () {
    return {
      formCloseJob: {
        jobId: '',
        jobNo: '',
        totalPrice: 0
      },
      recordStatusJob: '',
      statusBook: '',
      foreground: '#173053',
      value: '',
      size: 200,
      pathToweb: '',
      tabSelectUser: null,
      jobitem: [],
      menu: false,
      statusShowDateConfiremjob: true,
      endTime: '',
      endDate: '',
      empSelectJob: '',
      checkShowSelectUser: false,
      dataSelectUser: {},
      memberPicture: '',
      userId: '',
      bookNo: '',
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
      menuDateChange: false,
      menu1: false,
      session: this.$session.getAll(),
      dataItem: [],
      dataItemBooking: [],
      dataItemTimesChange: [],
      BookingDataItem: [],
      BookingDataItemJob: [],
      dataItemCheck: [],
      dataReady: false,
      getSelectText: '',
      timeTable: '',
      radiosRemark: 'ซ่อมปกติ',
      getSelectCount: 0,
      dialogEdit: false,
      dialogDelete: false,
      dialogChange: false,
      dialogJob: false,
      dialogConfirm: false,
      dialogRemove: false,
      dialogConfirmOnsite: false,
      drawer: false,
      formChange: {
        date: '',
        time: ''
      },
      masterTime: [
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00'
      ],
      timeavailable: [],
      empSelectStep: [],
      dataConfirm: [],
      empSelect: '',
      bookNoRemove: '',
      remarkRemove: '',
      masBranchID: '',
      branch: [],
      BookingDataList: [],
      BookingDataItemEdit: [],
      BookingDataListTimechange: [],
      dateStart: '',
      flowIdSelect: '',
      dialogMap: false,
      center: null,
      address: '',
      totalPrice: '',
      packageId: '',
      dataPackage: [],
      flowId: '',
      dataCoin: [],
      productExchangeRateId: '',
      dataConfirmReady: true,
      validUpdate: true,
      DataFlowName: [],
      empSelectStepAdd: [],
      editedItemSeleteField: [],
      empSelectAdd: '',
      remark: '',
      lineUserId: '',
      checkPayment: '',
      dueDateText: '',
      StatusPackage: {
        status: 'ตกลง',
        color: 'green',
        packageName: '',
        token: ''
      },
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },
      swalConfig: {
        title: null,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      },
      dataLineConfig: {}
    }
  },
  async mounted () {
    if (this.$route.query.shopId) {
      this.dataLineConfig = await this.getDataLineConfig(this.$route.query.shopId)
      this.pathToweb = 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/JobConfirm?jobId='
      await this.beforeCreate()
    } else {
      this.$swal('ผิดพลาด', 'ลิ้งค์ที่ท่านใช้ไม่ถูกต้องกรุณา ติดต่อพนักงาน', 'info')
      this.$router.push('/Core/Login')
    }
  },
  methods: {
    async jobConfirm () {
      this.swalConfig.title = 'ต้องการ ยืนยันข้อมูล ใช่หรือไม่?'
      this.$swal(this.swalConfig)
        .then(async () => {
          await axios
            .post(
              this.DNS_IP + '/job/update/' + this.jobitem[0].Id, this.skip
            ).then(async (response) => {
              console.log(response)
              if (response.data.status) {
                this.$swal('เรียบร้อย', 'ปรับปรุงเรียบร้อย', 'success')
                this.dialogJob = false
                this.chkBookingNo()
              } else {
                this.$swal('ผิดพลาด', 'เนื่องจากรายการนี้มีคนนำเข้าแล้ว', 'error')
                this.dialogJob = false
                this.chkBookingNo()
              }
            })
        })
    },
    async jobConfirmUser () {
      this.swalConfig.title = 'ต้องการ ยืนยันข้อมูล ใช่หรือไม่?'
      this.$swal(this.swalConfig)
        .then(async () => {
          let dt = {
            userId: this.dataSelectUser.liffUserId
          }
          await axios
            .post(
              this.DNS_IP + '/job/update/' + this.jobitem[0].Id, dt
            ).then(async (response) => {
              console.log(response)
              if (response.data.status) {
                let statusSend = {
                  statusSend: 'true'
                }
                await axios
                  .post(this.DNS_IP + '/job/updateJobNo/' + this.jobitem[0].jobNo, statusSend)
                  .then(async response => {
                    // let lineUserId = result.data[0].lineUserId
                    console.log('statusSend', 'true')
                    let updateStatusSend = {
                      updateStatusSend: 'false'
                    }
                    await axios
                      .post(
                        this.DNS_IP + '/job/pushMsg/' + response.data.jobId,
                        updateStatusSend
                      )
                      .catch(error => {
                        console.log('error function addData : ', error)
                      })
                  })
                this.$swal('เรียบร้อย', 'ปรับปรุงเรียบร้อย', 'success')
                this.dialogJob = false
                this.chkBookingNo()
              } else {
                this.$swal('ผิดพลาด', 'เนื่องจากรายการนี้มีคนนำเข้าแล้ว', 'error')
                this.dialogJob = false
                this.chkBookingNo()
              }
            })
        })
    },
    async pushMsgSelectUser () {
      let statusSend = {
        statusSend: 'false'
      }
      await axios.post(this.DNS_IP + '/job/updateJobNo/' + this.jobitem[0].jobNo, statusSend)
      console.log('statusSend', 'false')
      let updateStatusSend = {
        updateStatusSend: 'false'
      }
      await axios
        .post(
          this.DNS_IP + '/job/NotifyQrcode/' + this.jobitem[0].jobNo,
          updateStatusSend
        )
        .then(async response => {
          this.$swal('เรียบร้อย', 'ส่ง QR Code กลุ่มของท่านเรียบร้อย', 'success')
          this.dialogJob = false
          this.chkBookingNo()
        })
        .catch(error => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    validate (Action) {
      switch (Action) {
        case 'UPDATE':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_update.validate()
          })
          break

        default:
          break
      }
    },
    async getEmpSelectAdd () {
      this.empSelectStepAdd = []
      await axios
        .get(this.DNS_IP + '/empSelect/getUse?privacyPage=booking&shopId=' + this.$route.query.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              var s = {}
              s.text = d.empFirst_NameTH
              s.value = d.empId
              this.empSelectStepAdd.push(s)
            }
          }
        })
    },
    async pushMsgCustomer (bookNo) {
      let updateStatusSend = {
        updateStatusSend: 'false'
      }
      await axios
        .post(
          this.DNS_IP + '/BookingOnsite/pushMsgCustomer/' + bookNo,
          updateStatusSend
        )
        .then(async response => {})
    },
    async beforeCreate () {
      console.log(JSON.parse(localStorage.getItem('sessionData')))
      console.log(this.$session.exists())
      console.log(this.$session.getAll().data)
      if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
        if (
          JSON.parse(localStorage.getItem('sessionData')).shopId ===
          this.$route.query.shopId
        ) {
          this.$session.start()
          this.$session.set(
            'data',
            JSON.parse(localStorage.getItem('sessionData'))
          )
          await this.getDataFlow()
          await this.chkBookingNo()
          await this.getDataBranch()
          this.getEmpSelectAdd()
          this.getCustomFieldStart()
        } else {
          this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId + '&type=bookConfirm')
        }
      } else {
        if (!this.$session.exists()) {
          this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId + '&type=bookConfirm')
        } else {
          if (this.$route.query.shopId === this.$session.getAll().data.shopId) {
            localStorage.setItem(
              'sessionData',
              JSON.stringify(this.$session.getAll().data)
            )
            await this.getDataFlow()
            await this.chkBookingNo()
            await this.getDataBranch()
            this.getEmpSelectAdd()
            this.getCustomFieldStart()
          } else {
            this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId + '&type=bookConfirm')
          }
        }
      }
      // console.log(JSON.stringify(this.$session.getAll().data))
    },
    getDataFromFieldName (data, key) {
      return data.filter(function (el) {
        return el.fieldName === key
      })
    },
    updateTimeTablefromChild (timeTable) {
      this.timeTable = timeTable
    },
    async getCustomFieldStart () {
      this.editedItemSeleteField = []
      axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.$route.query.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            let sortrs = rs.sort((a, b) => a.sortNoField - b.sortNoField)
            for (let i = 0; i < sortrs.length; i++) {
              let d = sortrs[i]
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
          }
        })
    },
    async getDataBranch () {
      this.branch = await this.getDataFromAPI(
        '/master_branch/get',
        'masBranchID',
        'masBranchName',
        ''
      )
    },
    async getDataFlow () {
      this.DataFlowName = await this.getDataFromAPI(
        '/flow/get',
        'flowId',
        'flowName',
        ''
      )
    },
    async getDataFromAPI (url, fieldId, fieldName, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.$route.query.shopId}${param}`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d[fieldName]
              s.value = d[fieldId]
              s.allData = d
              result.push(s)
              // console.log('this.DataFlowName', this.DataFlowName)
            }
          } else {
            result = []
          }
        })
      return result
    },
    dial: function (number) {
      window.location = 'tel:' + number
    },
    toggle () {
      this.timeTable = this.momenDate_1(new Date())
      this.getTimesChange('update')
      this.drawer = !this.drawer
    },
    async getTimesChange (text) {
      try {
        this.dataItemTimesChange = []
        // console.log('this.dataItem', this.dataItem.filter(el => { return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable }))
        if (text === 'all') {
          this.dataItemTimesChange = this.dataItemBooking
        } else {
          if (this.masBranchID) {
            this.masBranchID = this.masBranchID
          } else {
            if (this.branch.length > 0) {
              this.masBranchID = this.branch[0].value
            } else {
              this.masBranchID = ''
            }
          }
          this.dataItemCheck = []
          var dataItems = []
          // var dataItemTimes = []
          var dateStart = moment(
            moment(this.timeTable, 'YYYY-MM-DD').toDate()
          ).format('YYYY-MM-DD')
          console.log('dateStartxx', dateStart)
          await this.getBookingDataListTimechange(dateStart)
          await axios
            .get(
              // eslint-disable-next-line quotes
              this.DNS_IP +
                '/booking_view/get?shopId=' +
                this.$route.query.shopId +
                '&masBranchID=' +
                this.masBranchID +
                '&dueDate=' +
                moment(moment(this.timeTable, 'YYYY-MM-DD').toDate()).format(
                  'YYYY-MM-DD'
                )
            )
            .then(async response => {
              console.log('getData', response.data)
              if (response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                  let d = response.data[i]
                  let s = {}
                  s.bookNo = d.bookNo
                  s.flowId = d.flowId
                  s.flowName = d.flowName
                  s.dueDate = d.dueDate
                  s.userId = d.userId
                  s.chkConfirm = false
                  s.chkCancel = false
                  s.jobNo = d.jobNo
                  s.remarkRemove = d.remarkRemove || ''
                  s.timeDueHtext = d.timeDueH + ':00'
                  s.timeDuetext = d.timeDue
                  s.extraJob = d.extraJob === 'true' || d.extraJob === 'True'
                  s.fastTrack =
                    d.fastTrack === 'true' || d.fastTrack === 'True'
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

                  s.cusName = this.getDataFromFieldName(
                    this.BookingDataListTimechange[d.bookNo],
                    'ชื่อ'
                  )
                  s.cusReg = this.getDataFromFieldName(
                    this.BookingDataListTimechange[d.bookNo],
                    'เลขทะเบียน'
                  )
                  s.tel = this.getDataFromFieldName(
                    this.BookingDataListTimechange[d.bookNo],
                    'เบอร์โทร'
                  )
                  s.cusName =
                    s.cusName.length > 0 ? s.cusName[0].fieldValue : ''
                  s.cusReg = s.cusReg.length > 0 ? s.cusReg[0].fieldValue : ''
                  s.tel = s.tel.length > 0 ? s.tel[0].fieldValue : ''
                  // var chkTime = this.dataItemTime.filter(el => { return el.timeDueHtext === s.timeDueHtext })
                  // if (chkTime.length === 0) {
                  //   dataItemTimes.push(s)
                  // }
                  dataItems.push(s)
                }
              }
              if (dataItems.length === 0 || dataItems.status === false) {
                this.dataItemCheck = []
                // this.dataItemTime = []
                // this.dataReady = true
                // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
              } else {
                console.log('month new if')
                this.dataItemCheck = dataItems
                this.dataItemTimesChange = this.dataItemCheck
                  .filter(el => {
                    let dueDate = moment(
                      moment(el.dueDate, 'YYYY-MM-DD').toDate()
                    ).format('YYYY-MM-DD')
                    return dueDate === this.timeTable
                    // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
                  })
                  .sort((a, b) => {
                    if (a.timeDuetext < b.timeDuetext) return -1
                    return a.timeDuetext > b.timeDuetext ? 1 : 0
                  })
              }
            })
        }
        console.log('this.dataItemTimesChange', this.dataItemTimesChange)
      } catch (err) {
        console.log(err)
      }
    },
    async getBookingDataListTimechange (dateStart) {
      this.BookingDataListTimechange = []
      if (this.masBranchID) {
        this.masBranchID = this.masBranchID
      } else {
        if (this.branch.length > 0) {
          this.masBranchID = this.branch[0].value
        } else {
          this.masBranchID = ''
        }
      }
      let url = `${this.DNS_IP}/BookingData/get?shopId=${this.$route.query.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
      await axios.get(url).then(async response => {
        if (response.data.status !== false) {
          response.data.forEach(row => {
            if (
              typeof this.BookingDataListTimechange[row.bookNo] === 'undefined'
            ) {
              this.BookingDataListTimechange[row.bookNo] = []
            }
            this.BookingDataListTimechange[row.bookNo].push(row)
          })
        }
      })
      console.log(this.BookingDataListTimechange)
    },
    async chkBookingNo () {
      this.BookingDataItem = []
      this.BookingDataItemJob = []
      this.statusBook = ''
      this.dataReady = false
      this.bookNo = this.$route.query.bookNo
      // await this.getShowMap()
      if (this.bookNo === undefined) {
        this.$swal('ผิดพลาด', 'กรุณา Scan QRcode อีกครั้ง', 'error')
        // console.log('11111111111111', this.bookNo)
      } else {
        let dt = {
          bookNo: this.bookNo
        }
        axios
          .get(
            this.DNS_IP +
              '/booking_view/get?shopId=' +
              this.$route.query.shopId +
              '&bookNo=' +
              dt.bookNo
          )
          .then(async response => {
            let rs = response.data
            if (rs.status === false) {
              this.$swal('ผิดพลาด', 'ไม่มีข้อมูลในระบบ', 'error')
            } else {
              var dataItems = []
              this.dataItem = []
              for (let i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {}
                s.shopId = d.shopId
                if (d.fastTrack === 'False' && d.extraJob === 'False') {
                  this.radiosRemark = 'ซ่อมปกติ'
                } else if (d.fastTrack === 'False' && d.extraJob === 'True') {
                  this.radiosRemark = 'ExtraJob'
                } else if (d.fastTrack === 'True' && d.extraJob === 'False') {
                  this.radiosRemark = 'FastTrack'
                }
                s.bookNo = d.bookNo
                s.flowId = d.flowId
                s.flowName = d.flowName
                s.dueDate = d.dueDate
                s.userId = d.userId
                s.timeText = d.timeText
                s.chkConfirm = false
                s.chkCancel = false
                s.jobNo = d.jobNo
                s.address = d.address || ''
                s.checkOnsite = d.checkOnsite || 'False'
                s.addressLatLong = d.addressLatLong || ''
                s.lineUserId = d.lineUserId
                s.empSelect = d.empSelect
                s.packageId = d.packageId
                s.remarkConfirm1 =
                  d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True'
                s.remarkConfirm2 =
                  d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True'
                s.extraJob = d.extraJob === 'true' || d.extraJob === 'True'
                s.fastTrack = d.fastTrack === 'true' || d.fastTrack === 'True'
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
                let dataBookingData = []
                await axios
                  .get(
                    // eslint-disable-next-line quotes
                    this.DNS_IP + "/BookingData/get?bookNo=" + d.bookNo
                  )
                  .then(async responses => {
                    console.log('dataBookingData', responses.data)
                    dataBookingData = responses.data
                    if (responses.data) {
                      this.BookingDataItem.push({
                        fieldName: 'วันที่นัดหมาย',
                        fieldValue: this.format_dateFUllTime(s.dueDate)
                      })
                      for (var i = 0; i < responses.data.length; i++) {
                        var t = responses.data[i]
                        if (t.userId === 'user-skip') {
                          t.userId = ''
                        }
                        t.shopId = this.$route.query.shopId
                        t.userName = JSON.parse(
                          localStorage.getItem('sessionData')
                        ).userName
                        this.BookingDataItem.push(t)
                        this.BookingDataItemJob.push(t)
                      }
                      console.log('BookingDataItem', this.BookingDataItem)
                      // await this.getBookingField()
                    }
                  })
                this.flowIdSelect = dataBookingData[0].flowId
                s.masBranchID = dataBookingData[0].masBranchID
                this.masBranchID = dataBookingData[0].masBranchID
                // this.timeavailable = JSON.parse(dataBookingData[0].setTime)
                s.cusName = this.getDataFromFieldName(dataBookingData, 'ชื่อ')
                s.cusReg = this.getDataFromFieldName(
                  dataBookingData,
                  'เลขทะเบียน'
                )
                s.tel = this.getDataFromFieldName(dataBookingData, 'เบอร์โทร')
                s.cusName = s.cusName.length > 0 ? s.cusName[0].fieldValue : ''
                s.cusReg = s.cusReg.length > 0 ? s.cusReg[0].fieldValue : ''
                s.tel = s.tel.length > 0 ? s.tel[0].fieldValue : ''
                dataItems.push(s)
              }
              console.log('dataItems', dataItems)
              if (dataItems.length === 0 || dataItems.status === false) {
                this.dataItem = []
                this.showMap = ''
                this.statusBook = ''
                this.userId = ''
                // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
              } else {
                this.dataItem = dataItems
                if (dataItems[0].addressLatLong === '') {
                  this.showMap = 'ไม่แสดง'
                } else {
                  this.showMap = 'แสดง'
                }
                this.statusBook = dataItems[0].statusBt
                this.userId = dataItems[0].userId
                // this.dataReady = true
                await this.getBookingList(dataItems[0])
              }
            }
          })
        // masBranchID
        // this.getBookingData(dt)
        this.dialogEdit = true
      }
    },
    async getBookingList (dt) {
      // Clear Data ทุกครั้ง
      this.dataReady = false
      this.dataItemBooking = []
      // Clear ช่องค้นหา
      this.searchAll2 = ''
      var dataItems = []
      this.dateStart = dt.dueDate.substring(0, 7)
      await this.getBookingDataList(dt)
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&masBranchID=' +
            dt.masBranchID +
            '&dueDate=' +
            dt.dueDate.substring(0, 7)
        )
        .then(async response => {
          console.log('getBookingList', response.data)
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let d = response.data[i]
              let s = {}
              s.bookNo = d.bookNo
              s.flowId = d.flowId
              s.flowName = d.flowName
              s.dueDate = d.dueDate
              s.userId = d.userId
              s.chkConfirm = false
              s.chkCancel = false
              s.remarkConfirm1 =
                d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True'
              s.remarkConfirm2 =
                d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True'
              s.extraJob = d.extraJob === 'true' || d.extraJob === 'True'
              s.fastTrack = d.fastTrack === 'true' || d.fastTrack === 'True'
              s.jobNo = d.jobNo
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
              s.cusName = this.getDataFromFieldName(
                this.BookingDataList[d.bookNo],
                'ชื่อ'
              )
              s.cusReg = this.getDataFromFieldName(
                this.BookingDataList[d.bookNo],
                'เลขทะเบียน'
              )
              s.tel = this.getDataFromFieldName(
                this.BookingDataList[d.bookNo],
                'เบอร์โทร'
              )
              s.cusName = s.cusName.length > 0 ? s.cusName[0].fieldValue : ''
              s.cusReg = s.cusReg.length > 0 ? s.cusReg[0].fieldValue : ''
              s.tel = s.tel.length > 0 ? s.tel[0].fieldValue : ''
              s.statusBt = d.statusBt || 'wait'
              dataItems.push(s)
            }
          }
          if (dataItems.length === 0 || dataItems.status === false) {
            this.dataItemBooking = []
            this.BookingDataItemEdit = []
            let itemIncustomField = []
            await axios
              .get(
                this.DNS_IP +
                  '/BookingField/get?shopId=' +
                  this.$route.query.shopId
              )
              .then(async response1 => {
                let rs2 = response1.data
                if (rs2.length > 0) {
                  let bookingData = []
                  bookingData = JSON.parse(rs2[0].flowfieldName)
                  for (let i = 0; i < bookingData.length; i++) {
                    let d = bookingData[i]
                    itemIncustomField.push(d.fieldId)
                  }
                  await axios
                    .get(
                      this.DNS_IP +
                        '/customField/fieldId?fieldId=' +
                        itemIncustomField
                    )
                    .then(async responses => {
                      let rs1 = responses.data
                      for (var i = 0; i < rs1.length; i++) {
                        var d = rs1[i]
                        var s = {}
                        var dataBD = this.BookingDataItem.filter(el => {
                          return parseInt(el.fieldId) === parseInt(d.fieldId)
                        })
                        console.log('dataBD', dataBD)
                        if (dataBD.length > 0) {
                          s.flowId = dataBD[0].flowId
                          s.flowName = dataBD[0].flowName
                          s.masBranchName = dataBD[0].masBranchName
                          s.bookingFieldId = rs2[0].bookingFieldId
                          s.conditionField = d.conditionField
                          s.fieldId = d.fieldId
                          s.fieldType = d.fieldType
                          s.fieldValue = dataBD[0].fieldValue
                          s.fieldName = d.fieldName
                          s.conditionField = d.conditionField
                          s.conditionValue = d.conditionValue
                          s.requiredField = d.requiredField
                          s.optionField = d.optionField
                          this.BookingDataItemEdit.push(s)
                        }
                      }
                    })
                }
              })
            this.dataReady = true
            // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          } else {
            this.dataItemBooking = dataItems
            this.BookingDataItemEdit = []
            let itemIncustomField = []
            await axios
              .get(
                this.DNS_IP +
                  '/BookingField/get?shopId=' +
                  this.$route.query.shopId
              )
              .then(async response1 => {
                let rs2 = response1.data
                if (rs2.length > 0) {
                  let bookingData = []
                  bookingData = JSON.parse(rs2[0].flowfieldName)
                  for (let i = 0; i < bookingData.length; i++) {
                    let d = bookingData[i]
                    itemIncustomField.push(d.fieldId)
                  }
                  await axios
                    .get(
                      this.DNS_IP +
                        '/customField/fieldId?fieldId=' +
                        itemIncustomField
                    )
                    .then(async responses => {
                      let rs1 = responses.data
                      for (var i = 0; i < rs1.length; i++) {
                        var d = rs1[i]
                        var s = {}
                        var dataBD = this.BookingDataItem.filter(el => {
                          return parseInt(el.fieldId) === parseInt(d.fieldId)
                        })
                        console.log('dataBD', dataBD)
                        if (dataBD.length > 0) {
                          s.flowId = dataBD[0].flowId
                          s.flowName = dataBD[0].flowName
                          s.masBranchName = dataBD[0].masBranchName
                          s.bookingFieldId = rs2[0].bookingFieldId
                          s.conditionField = d.conditionField
                          s.fieldId = d.fieldId
                          s.fieldType = d.fieldType
                          s.fieldValue = dataBD[0].fieldValue
                          s.fieldName = d.fieldName
                          s.conditionField = d.conditionField
                          s.conditionValue = d.conditionValue
                          s.requiredField = d.requiredField
                          s.optionField = d.optionField
                          this.BookingDataItemEdit.push(s)
                        }
                      }
                    })
                }
              })
            this.dataReady = true
            this.timeavailable = []
            if (this.DataFlowName.filter(el => { return el.value === this.BookingDataItemEdit[0].flowId }).length > 0) {
              this.timeavailable = JSON.parse(this.DataFlowName.filter(el => { return el.value === this.BookingDataItemEdit[0].flowId })[0].allData.setTime)
            } else {
              this.timeavailable = []
            }
            let checkStep = await axios.get(this.DNS_IP + '/flowStep/get?flowId=' + this.BookingDataItemEdit[0].flowId)
            this.getflowfield()
            console.log('checkStep', checkStep)
            if (checkStep.data.status === false) {
              this.endDate = this.momenDate_1(new Date())
              this.endTime = {value: this.momenTime(new Date())}
              this.statusShowDateConfiremjob = false
            } else {
              this.statusShowDateConfiremjob = true
            }
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log(error)
        })
    },
    async getBookingDataList (dt) {
      this.BookingDataList = []
      let url = `${this.DNS_IP}/BookingData/get?shopId=${
        this.$route.query.shopId
      }&masBranchID=${dt.masBranchID}&dueDate=${dt.dueDate.substring(0, 7)}`
      await axios.get(url).then(async response => {
        console.log('getBookingDataList', response)
        if (response.data.status !== false) {
          response.data.forEach(row => {
            if (typeof this.BookingDataList[row.bookNo] === 'undefined') {
              this.BookingDataList[row.bookNo] = []
            }
            this.BookingDataList[row.bookNo].push(row)
          })
        }
      })
      console.log(this.BookingDataList)
    },
    async getflowfield () {
      this.flowfieldNameitem = []
      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP +
            '/flowField/get?flowId=' +
            this.BookingDataItemEdit[0].flowId +
            '&shopId=' +
            this.$route.query.shopId
        )
        .then(response => {
          let tt = response.data
          console.log('tt', tt)
          if (tt.length > 0) {
            let flowId = tt[0].flowId
            let flowfieldName = []
            flowfieldName = JSON.parse(tt[0].flowfieldName)
            if (flowfieldName.length > 0) {
              for (let a = 0; a < flowfieldName.length; a++) {
                let d = flowfieldName[a]
                itemIncustomField.push(d.fieldId)
              }
              this.getCustomfieldFlow(itemIncustomField, flowId)
            }
          }
          // console.log('itemIncustomField', itemIncustomField)
        })
    },
    async getCustomfieldFlow (item, flowId) {
      let flowfieldNameitems = []
      this.flowfieldNameitem = []
      await axios
        .get(this.DNS_IP + '/customField/fieldId?fieldId=' + item)
        .then(async response => {
          let rs = response.data
          console.log('rs', rs)
          let sortrs = rs.sort((a, b) => a.sortNoField - b.sortNoField)
          for (var i = 0; i < sortrs.length; i++) {
            let d = sortrs[i]
            let s = {}
            s.fieldId = d.fieldId
            s.flowId = flowId
            s.fieldName = d.fieldName
            s.optionField = d.optionField
            s.conditionField = d.conditionField || ''
            s.fieldType = d.fieldType
            s.fieldValue = ''
            s.CREATE_USER = ''
            s.LAST_USER = ''
            s.showCard = d.showCard
            s.shopId = this.$route.query.shopId
            s.endDate = ''
            s.endTime = ''
            s.checkCar = 'False'
            s.conditionValue = d.conditionValue
            s.requiredField = d.requiredField
            flowfieldNameitems.push(s)
          }
          var data1 = flowfieldNameitems.filter(el => parseInt(el.conditionField || 0) > 0)
          // var data2 = []
          for (let i = 0; i < data1.length; i++) {
            let d = data1[i]
            let indexC = flowfieldNameitems.findIndex(function (o) {
              return o.fieldId === d.fieldId
            })
            let indexF = flowfieldNameitems.findIndex(function (o) {
              return o.fieldId === parseInt(d.conditionField)
            })
            flowfieldNameitems.splice((indexF + 1), 0, flowfieldNameitems.splice(indexC, 1)[0])
          }
          for (var x = 0; x < flowfieldNameitems.length; x++) {
            var s = flowfieldNameitems[x]
            var chk = this.BookingDataItem.filter(el => { return parseInt(el.fieldId) === s.fieldId })
            console.log('cccxxx', s)
            console.log('chk', chk)
            if (chk.length === 0) {
              this.flowfieldNameitem.push(s)
            }
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    addDataJob () {
      this.validate('UPDATE')
      setTimeout(() => this.addDataJobSubmit(), 500)
    },
    async addDataJobSubmit () {
      if (this.validUpdate === true) {
        console.log('this.BookingDataItemJob', this.BookingDataItemJob)
        let Add = []
        let fielditem = this.flowfieldNameitem
        console.log('fielditem', fielditem)
        for (var i = 0; i < this.BookingDataItemJob.length; i++) {
          var d = this.BookingDataItemJob[i]
          let update = {}
          let addData = false
          var dataField = this.editedItemSeleteField.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
          if (dataField[0].conditionField === '' || dataField[0].conditionField === null) {
            addData = true
          } else {
            if (fielditem.filter(row => { return row.fieldId === parseInt(d.conditionField) }).length > 0) {
              console.log('this', fielditem)
              if (d.conditionValue === fielditem.filter(row => { return row.fieldId === parseInt(d.conditionField) })[0].fieldValue) {
                addData = true
              } else if (d.conditionField === 'flow') {
                addData = true
              }
            } else if (d.conditionField === 'flow') {
              addData = true
            }
          }
          if (addData) {
            if (d.fieldValue !== '') {
              update.masBranchID = this.BookingDataItemJob[0].masBranchID || ''
              update.CREATE_USER = d.userName
              update.LAST_USER = d.userName
              update.packageId = d.packageId
              update.checkCar = ''
              // update.userId = d.userId
              update.endDate = this.endDate
              update.endTime = this.endTime.value
              update.fieldId = d.fieldId
              update.fieldName = d.fieldName
              update.fieldType = dataField[0].fieldType || ''
              update.fieldValue = d.fieldValue
              update.flowId = d.flowId
              update.empSelect = this.empSelectJob
              update.conditionField = dataField[0].conditionField || ''
              update.conditionValue = dataField[0].conditionValue || ''
              update.optionField = dataField[0].optionField || ''
              update.shopId = dataField[0].shopId || ''
              update.showCard = dataField[0].showCard || ''
              Add.push(update)
            }
          }
        }
        for (var x = 0; x < fielditem.length; x++) {
          var t = fielditem[x]
          if (Add.filter(row => { return row.fieldId === t.fieldId }).length === 0) {
            let update = {}
            let dataField = this.editedItemSeleteField.filter(el => { return parseInt(el.fieldId) === parseInt(t.fieldId) })
            update.masBranchID = this.BookingDataItemJob[0].masBranchID || ''
            update.CREATE_USER = Add[0].CREATE_USER
            update.LAST_USER = Add[0].CREATE_USER
            update.packageId = Add[0].packageId
            update.checkCar = ''
            // update.userId = Add[0].userId
            update.endDate = this.endDate
            update.endTime = this.endTime.value
            update.fieldId = t.fieldId
            update.fieldName = t.fieldName
            update.fieldType = dataField[0].fieldType || ''
            update.fieldValue = t.fieldValue
            update.flowId = d.flowId
            update.empSelect = this.empSelectJob
            update.conditionField = dataField[0].conditionField || ''
            update.conditionValue = dataField[0].conditionValue || ''
            update.optionField = dataField[0].optionField || ''
            update.shopId = dataField[0].shopId || ''
            update.showCard = dataField[0].showCard || ''
            Add.push(update)
          }
        }
        console.log('this.Add', Add)
        console.log(this.packageId, this.tokenPackage)
        this.swalConfig.title = 'ต้องการนำรายการนี้ เข้าตารางใช่หรือไม่?'
        this.$swal(this.swalConfig)
          .then(async result => {
            // this.dataEditJobReady = false
            await axios
              .post(this.DNS_IP + '/job/add', Add)
              .then(async response => {
                this.endDate = ''
                this.endTime = ''
                this.empSelectJob = ''
                this.statusShowDateConfiremjob = true
                if (response.data.status) {
                  var dt = {
                    bookNo: this.BookingDataItemJob[0].bookNo,
                    statusJob: 'job',
                    jobNo: response.data.jobNo
                  }
                  await axios
                    .post(
                      this.DNS_IP +
                    '/Booking/editStatus/' +
                    this.BookingDataItemJob[0].bookNo,
                      dt
                    )
                    .then(async response1 => {
                      // await this.pushMsg(response.data.jobNo)
                      var dtt = {
                        bookNo: this.BookingDataItemJob[0].bookNo,
                        contactDate: this.format_date(new Date()),
                        status: 'confirmJob',
                        statusUse: 'use',
                        shopId: this.$route.query.shopId,
                        CREATE_USER: this.session.data.userName,
                        LAST_USER: this.session.data.userName,
                        packageId: this.packageId,
                        tokenPackage: this.tokenPackage
                      }
                      axios
                        .post(this.DNS_IP + '/booking_transaction/add', dtt)
                        .then(async response => {
                          let dataBooking = await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + this.BookingDataItemJob[0].bookNo)
                          if (dataBooking.data.status === false) {
                            console.log(dataBooking)
                          } else {
                            // if (dataBooking.data[0].lineUserId) {
                            //   this.sendMessageConfirm(dataBooking.data[0])
                            // }
                            this.getjob(dataBooking.data[0])
                            this.dialogJob = true
                          }
                        })
                    })
                } else {
                  this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
                  this.chkBookingNo()
                }
              }).catch(error => {
                setTimeout(() => this.addDataJobSubmit(), 3000)
                console.log('error function addData : ', error)
              })
          })
      }
    },
    sendMessageConfirm (item) {
      let pushText = {}
      if (this.DataFlowName.filter(el => { return el.value === parseInt(this.BookingDataItemEdit[0].flowName) }).length > 0) {
        pushText = {
          'to': item.lineUserId,
          'messages': [
            {
              'type': 'text',
              'text': ` ✍️ ยืนยันเวลานัดหมาย\n ✅ ชื่อ : ${this.dataItem[0].cusName}
                              \nวันเดือนปี ${this.format_dateFUllTime(item.dueDate)}
                              \n${this.DataFlowName.filter(el => { return el.value === parseInt(item.flowId) })[0].allData.remarkConfirm || ''}`
            }
          ]
        }
      } else {
        pushText = {
          'to': item.lineUserId,
          'messages': [
            {
              'type': 'text',
              'text': ` ✍️ ยืนยันเวลานัดหมาย\n ✅ ชื่อ : ${this.dataItem[0].cusName}
                              \nวันเดือนปี ${this.format_dateFUllTime(item.dueDate)}`
            }
          ]
        }
      }
      axios
        .post(
          this.DNS_IP + '/line/pushmessage?shopId=' + this.$route.query.shopId,
          pushText
        )
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async getjob (item) {
      console.log(item)
      this.bookNo = item.bookNo
      this.jobitem = []
      if (item.jobNo !== '') {
        let checkBookingMember = ''
        const result = await axios
          .get(
            this.DNS_IP +
            '/member/get?shopId=' +
            this.$route.query.shopId +
            '&liffUserId=' +
            item.userId
          )
          .catch(error => {
            console.log('error function addData : ', error)
          })
        console.log('result', result.data)
        if (result.data.status === false) {
          checkBookingMember = ''
        } else {
          checkBookingMember = result.data[0]
        }
        await axios.get(this.DNS_IP + '/job/getJobNo?jobNo=' + item.jobNo).then((response) => {
          let rs = response.data
          let Id = ''
          let memberPicture = ''
          console.log('getJobNo', rs)
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {
                Id: d.jobId,
                value: d.fieldValue,
                name: d.fieldName,
                showCard: d.showCard,
                jobNo: d.jobNo,
                checkPayment: d.checkPayment,
                recordStatus: d.RECORD_STATUS
              }
              Id = d.userId || ''
              memberPicture = d.memberPicture || ''
              this.jobitem.push(s)
            }
            this.userId = Id
            this.memberPicture = memberPicture
            if (checkBookingMember !== '' && this.memberPicture === '') {
              this.checkShowSelectUser = true
              this.dataSelectUser = checkBookingMember
            } else {
              this.checkShowSelectUser = false
              this.dataSelectUser = ''
            }
            this.value = this.pathToweb + this.jobitem[0].Id + '&shopId=' + this.$route.query.shopId
            this.recordStatusJob = this.jobitem[0].recordStatus
            this.checkPayment = this.jobitem[0].checkPayment
            this.formCloseJob.jobNo = this.jobitem[0].jobNo
            this.formCloseJob.jobId = this.jobitem[0].Id
            // this.getUserId()
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.theme--light.v-divider {
  border-color: rgba(243, 5, 25, 0.904) !important;
}
.InputData {
  margin: 0px !important;
  padding: 0px !important;
}
.slidein {
  max-width: 100%;
  padding: 2em 1em;
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  background: #fff;
  height: 100%;
  overflow: scroll;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease-in-out;
}
button {
  padding: 0.5em 1em;
  border-radius: 3em;
  font-size: 1.1em;
}
/* before the element is shown, start off the screen to the right */
.slide-enter,
.slide-leave-active {
  right: -100%;
}

.close-btn {
  border: none;
  font-weight: bold;
  font-size: 2em;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5em;
}

/* General styles unrelated to slide in */
body {
  font-family: "Mulish", sans-serif;
}

.toggle {
  margin: 1em;
}
.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}
</style>
