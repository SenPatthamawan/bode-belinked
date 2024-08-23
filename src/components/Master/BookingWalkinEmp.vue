<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
          <v-col cols="6" class="v-margit_button text-right">

          </v-col>
        </v-row>
      </div>
        <v-row>
         <v-col cols="12" style="display: flex;justify-content: center;">
          <v-card class="pa-6 px-3 pb-10 ma-4"
          :color="DarkModeBackground"
          :style="'background-color:'+ DarkModeBackground +';min-height: 100vh;border-radius: 45px 45px 0px 0px;max-width:650px;width: inherit;'"
          >
      <v-sheet
        class="mx-auto mt-5 pa-0 pt-5 pb-5"
        min-height="60vh"
        rounded
        :style="'background-color:' + '#FFFFFF' +';border-radius: 15px 15px 15px 15px;'"
      >
      <h2
          class="text-center mt-1 font-weight-bold"
          :style="'color:' + '#000000' + ';'"
          v-if="shop.length > 0"
        >
          {{ languageSelect === 0 ? "จัดการคิวนัดหมาย" : "Check queue" }}
        </h2>
        <h4
          class="text-center mt-1 font-weight-bold"
          :style="'color:' + '#000000' + ';'"
          v-if="shop.length > 0"
        >
          {{ shop[0].shopName }}
        </h4>
        <v-row align="center" class="pa-4 pl-7">
          <v-col cols="12" >
            <v-select
            v-if="branch.length > 1"
              v-model="formSelect.masBranchID"
              :label="languageSelect === 0 ? 'สาขา *' : 'Branch *'"
              dense
              outlined
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              :items="branch"
              attach
            :menu-props="{ bottom: true, offsetY: true }"
              @change="selectBranch()"
            ></v-select>
            <v-select
            v-if="formSelect.masBranchID !== '' && formSelect.masBranchID !== null"
              v-model="formSelect.flowId"
              :label="languageSelect === 0 ? 'ประเภทบริการ *' : 'Sevice *'"
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              dense
              outlined
              :items="DataFlow"
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              @change="checkBranch(), checkTitleEmp()"
            >
            <template slot="item" slot-scope="data">
              <p class="text-wrap" style="color:#FFFFFF;">{{languageSelect === 0 ? data.item.text : data.item.textEn}}</p>
          </template></v-select>
            <v-select
              v-if="formSelect.flowId !== '' && dataEmp.length > 1"
              v-model="formSelect.empId"
              :label="languageSelect === 0 ? empTitleTh + ' *' : empTitleEng + ' *'"
              dense
              outlined
              :items="dataEmp"
              attach
            :menu-props="{ bottom: true, offsetY: true }"
              @change="fromAddTimeCus = '',checkCustomerTimeSlot()"
            ></v-select>
            <v-select
              :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-if="customerTimeSlot === 'True' && formSelect.empId !== '' && timeSlotbyCustomer.length > 1"
              v-model="fromAddTimeCus"
              :items="timeSlotbyCustomer"
              :label="languageSelect === 0 ? 'จำนวนชั่วโมง *' : 'number of hours *'"
              :background-color="DarkMode"
              color="#000000"
              outlined
              required
              dense
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules ="[rules.required]"
              @change="selectflow()"
            >
            </v-select>
          </v-col>
        </v-row>
        <div class="pa-0 mb-2 mt-n10">
          <v-row>
            <v-col cols="2" class="text-center">
              <v-icon
                class="mr-n13"
                v-if="previous"
                large
                color="#000000"
                @click="setMonthCarousel('previous')"
              >
                mdi-skip-previous
              </v-icon>
            </v-col>
            <v-col cols="8" class="text-center">
            <v-menu
              ref="menupicker"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="-80"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                  <h4
                  class="pa-1 text-center mt-0 font-weight-bold"
                  :style="'color:'+ '#000000' +';'"
                  v-bind="attrs"
                  v-on="on">
                  {{languageSelect === 0 ? defaultMonth.filter((v , k) => (k + 1) === parseInt(momenDate_MM(date)))[0] + ' ' + ' ' + (parseInt(momenDate_YYYY(date)) + 543) : defaultMonthEng.filter((v , k) => (k + 1) === parseInt(momenDate_MM(date)))[0] + ' ' + ' ' + (parseInt(momenDate_YYYY(date))) }}
                  </h4>
              </template>
              <v-date-picker
                v-model="date"
                type="month"
                no-title
                scrollable
                @input="menu2 = false"
                :min="currentMonth"
                :locale="languageSelect === 0 ? 'th': 'sv-se'"
                @change="setMonthCarousel()"
              ></v-date-picker>
            </v-menu>
            </v-col>
            <v-col cols="2" class="text-center">
              <v-icon
                class="ml-n13"
                large
                color="#000000"
                @click="setMonthCarousel('next')"
              >
                mdi-skip-next
              </v-icon>
            </v-col>
          </v-row>
        </div>
        <v-slide-group
          v-if="dateSelect.length > 0 && (customerTimeSlot === 'True' ? fromAddTimeCus !== '' : dataEmpAll.length > 0 && formSelect.empId !== '') "
          v-model="model"
          class="pa-4 pt-0 mt-n1"
          color="primary"
          show-arrows
          prev-icon="mdi-arrow-left-drop-circle-outline"
          next-icon="mdi-arrow-right-drop-circle-outline"
        >
          <v-slide-item
            v-for="(item, n) in dateSelect"
            :key="n"
          >
            <v-card
              v-if="dataEmpAll.filter((a) => a.empId === formSelect.empId)[0].typeDayCustom === 'off' && dayCustom(item.date).length === 0 && dayoffvalue(item.date).length === 0"
              :color="item.active ? '#1F6FEB' : item.color"
              :style="'border-radius: 15px 15px 15px 15px;'"
              class="ma-1"
              height="65px"
              width="50px"
              v-on:click="item.active? item.active = false: item.active = true  ,getDetails(item,n)"
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
              <v-col cols="12" class="pa-0 " v-if="languageSelect === 0">
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ item.colortext" >{{item.text + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0 " v-else>
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ item.colortext" >{{dateEng.filter(el => { return el.text === item.text })[0].textEn + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0" >
                <h4 class="text-center pa-0 ma-0 mt-n1 font-weight-bold" :style="'color:'+ item.colortext" >{{item.value}}</h4>
              </v-col>
              </v-row>
            </v-card>
            <v-card
              v-else-if="dataEmpAll.filter((a) => a.empId === formSelect.empId)[0].typeDayCustom === 'on' && dayCustom(item.date).length > 0 "
              :color="item.active ? '#1F6FEB' : item.color"
              :style="'border-radius: 15px 15px 15px 15px;'"
              class="ma-1"
              height="65px"
              width="50px"
              v-on:click="item.active? item.active = false: item.active = true  ,getDetails(item,n)"
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
              <v-col cols="12" class="pa-0 " v-if="languageSelect === 0">
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ item.colortext" >{{item.text + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0 " v-else>
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ item.colortext" >{{dateEng.filter(el => { return el.text === item.text })[0].textEn + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0" >
                <h4 class="text-center pa-0 ma-0 mt-n1 font-weight-bold" :style="'color:'+ item.colortext" >{{item.value}}</h4>
              </v-col>
              </v-row>
            </v-card>
            <v-sheet
              v-else
              :color="item.active ? '#FFFFFF' : '#FFFFFF'"
              :style="'border-radius: 15px 15px 15px 15px;'"
              class="ma-1"
              height="65px"
              width="50px"
              readonly
            >
              <v-row
                class="fill-height"
                align="center"
                justify="center"
              >
              <v-col cols="12" class="pa-0 " v-if="languageSelect === 0">
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ item.colortext" >{{item.text + '.'}}</p>
              </v-col>
              <v-col cols="12" class="pa-0 " v-else>
                <p class="text-center pa-0 ma-0 mt-5 font-weight-bold" :style="'color:'+ item.colortext" >{{dateEng.filter(el => { return el.text === item.text })[0].textEn + '.'}}</p>
              </v-col>
              <v-col  cols="12" class="pa-0" >
                <h4 class="text-center pa-0 ma-0 mt-n1 font-weight-bold"  :style="'color:'+ '#9E9E9E'" >{{item.value}}</h4>
              </v-col>
              </v-row>
            </v-sheet>
          </v-slide-item>
        </v-slide-group>
        <!-- <h5 class="ml-9 mt-3 font-weight-bold text-left" >
            หมายเหตู
            <v-icon>mdi-checkbox-blank</v-icon>
        </h5>
        <h5 class="ml-9 mt-3 font-weight-bold text-left" >
            เวลา
        </h5> -->
        <v-expand-transition>
          <v-sheet
            v-if="customerTimeSlot === 'True' ? fromAddTimeCus !== '' : showDetails.length > 0  && formSelect.empId !== ''"
            min-height="200"
            tile
            class="pa-3 px-5 ml-2 mr-2"
          >
          <v-row>
            <v-col cols="4" class="pa-0">
              <h5 class="mt-3 font-weight-bold text-center" >
                {{languageSelect === 0 ? 'เวลา': 'Time'}}
              </h5>
              <div v-for="(item , index) in showDetails" :key="index">
                <h5  class="mt-3 font-weight-bold text-center" >
                  <div v-if="(item.countBooking < parseInt(item.limitBooking)) && !item.Overtime">
                    <v-sheet
                      class="font-weight-bold text-center"
                      color="#0D47A1"
                      width="90%"
                      height="36px"
                      elevation="2"
                      rounded
                      style="display: flex;justify-content: center;align-items: center;"
                      >
                    <p class="ma-0" style="word-wrap: break-word;color: #FFFFFF;font-size:small;">{{item.time}}</p>
                    </v-sheet>
                  </div>
                  <div v-else-if="item.Overtime">
                    <v-sheet
                      class="font-weight-bold text-center"
                      color="rgb(224 224 224)"
                      width="90%"
                      height="36px"
                      elevation="0"
                      rounded
                      style="display: flex;justify-content: center;align-items: center;"
                      >
                    <p class="ma-0" style="word-wrap: break-word;color: rgb(166 166 166);font-size: small;">{{item.time}}</p>
                    </v-sheet>
                  </div>
                  <div v-else>
                    <v-sheet
                      class="font-weight-bold text-center"
                      color="rgb(224 224 224)"
                      width="90%"
                      height="36px"
                      elevation=""
                      rounded
                      style="display: flex;justify-content: center;align-items: center;"
                      >
                    <p class="ma-0" style="word-wrap: break-word;color: rgb(166 166 166);font-size: small;">{{item.time}}</p>
                    </v-sheet>
                  </div>
                </h5>
              </div>
            </v-col>
            <v-col cols="6" class="pa-0">
              <h5 class="mt-3 font-weight-bold text-center" >
                {{languageSelect === 0 ? 'รายละเอียด': 'Booking'}}
              </h5>
              <div v-for="(item , index) in showDetails" :key="index">
                <h5  class="mt-3 font-weight-bold text-center" >
                  <div v-if="(item.countBooking < parseInt(item.limitBooking)) && !item.Overtime">
                    <v-btn
                      dark
                      class="font-weight-bold  text-center"
                      color="#0D47A1"
                      width="95%"
                      >
                     {{ 'ว่าง' }}
                    </v-btn>
                  </div>
                  <div v-else-if="item.Overtime">
                    <v-btn
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="95%"
                      >
                      {{ DetailsBooking(item) }}
                    </v-btn>
                  </div>
                  <div v-else>
                    <v-btn
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="95%"
                      >
                      {{ DetailsBooking2(item) }}
                    </v-btn>
                  </div>
                </h5>
              </div>
            </v-col>
            <v-col cols="2" class="pa-0">
              <h5 class="mt-3 font-weight-bold text-center" >
                {{languageSelect === 0 ? 'สถานะ': 'Queues'}}
              </h5>
              <div v-for="(item , index) in showDetails" :key="index">
                <h5  class="mt-3 font-weight-bold text-center" >
                  <div v-if="(item.countBooking < parseInt(item.limitBooking)) && !item.Overtime">
                    <v-btn
                      dark
                      class="font-weight-bold  text-center"
                      color="#0ACF83"
                      width="80%"
                      style="border-radius: 30px 30px 30px 30px;"
                      @click="closeSlot(item)"
                      >{{languageSelect === 0 ? 'ปิด': 'Ready'}}
                    </v-btn>
                  </div>
                  <div v-else-if="item.Overtime">
                    <v-btn
                    v-if="checkButton(item)"
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="80%"
                      style="border-radius: 30px 30px 30px 30px;"
                      >{{languageSelect === 0 ? '-': '-'}}
                    </v-btn>
                    <div v-else style="height: 36px;">

                    </div>
                  </div>
                  <div v-else>
                    <v-btn
                    v-if="checkButton(item)"
                      dark
                      class="font-weight-bold  text-center"
                      color="#EB5757"
                      width="80%"
                      style="border-radius: 30px 30px 30px 30px;"
                      @click="openSlot(item)"
                      >{{languageSelect === 0 ? 'เปิด': 'Open'}}
                    </v-btn>
                    <div v-else style="height: 36px;">

                    </div>
                  </div>
                </h5>
              </div>
            </v-col>
          </v-row>
          </v-sheet>
        </v-expand-transition>
      </v-sheet>
        </v-card>
         </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import moment from 'moment-timezone'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
  },
  watch: {
    async model (newQuestion, oldQuestion) {
      let year = moment(this.date).format('YYYY')
      this.itemMonth.forEach((v, k) => {
        if (k === newQuestion) {
          // console.log('moment', moment(year + v.value, 'YYYY-MM').format('YYYY-MM'))
          this.date = moment(year + v.value, 'YYYY-MM').format('YYYY-MM')
        }
      })
      await this.DefaultDay(this.date)
      // await this.DefaultDay()
    },
    async showDetails (newQuestion, oldQuestion) {
      console.log('oldQuestion', oldQuestion)
      console.log('newQuestion', newQuestion)
    }
  },
  data () {
    return {
      overlay: false,
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'จัดการเวลานัดหมาย',
          disabled: false,
          href: '/Master/BookingWalkinEmp'
        }
      ],
      model: 0,
      previous: false,
      itemMonth: [],
      dateEng: [{text: 'อา', textEn: 'Sun'}, {text: 'จ', textEn: 'Mon'}, {text: 'อ', textEn: 'Tue'}, {text: 'พ', textEn: 'Wed'}, {text: 'พฤ', textEn: 'Thu'}, {text: 'ศ', textEn: 'Fri'}, {text: 'ส', textEn: 'Sat'}],
      defaultMonth: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      defaultMonthEng: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      menu2: false,
      date: moment(moment().format('YYYY-MM'), 'YYYY-MM').format('YYYY-MM'),
      currentDate: moment().format('YYYY-MM-DD'),
      currentMonth: moment().format('YYYY-MM'),
      showDetails: [],
      allDetails: [],
      LimitBooking: [],
      dateSelect: [],
      formSelect: {
        flowId: '',
        empId: '',
        masBranchID: '',
        datemonth: '',
        dateday: ''
      },
      formOpenslot: {
        flowId: '',
        empId: '',
        masBranchID: '',
        bookingDate: '',
        bookingTime: '',
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      },
      value: '',
      size: 200,
      foreground: '#000000',
      valid: true,
      userName: '',
      userPassword: '',
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      profile: null,
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
      dialog: false,
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      shop: [],
      LoGo: [],
      ImgCover: '',
      bookingthankText: null,
      redirectBy: null,
      DataFlow: [],
      DataFlowNameAll: [],
      languageSelect: 0,
      dateDayCustom: [],
      dateDayoffValue: [],
      statusChek: false,
      dataEmp: [],
      dataEmpAll: [],
      EmpItemLimit: [],
      branchData: [],
      branch: [],
      timeavailable: [],
      empTitleTh: '',
      empTitleEng: '',
      timeSlotbyCustomer: [],
      customerTimeSlot: 'False',
      fromAddTimeCus: '',
      currentSelect: {
        item: {},
        k: null
      }
    }
  },
  async mounted () {
    await this.getShop()
    // await this.getDataFlow()
    await this.getDataBranch()
  },
  methods: {
    calculateTime (start, end) {
      let countTime = null
      // if (end > start) {
      //   let time = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
      //   let h = parseInt(time.split(':')[0])
      //   let m = parseInt(time.split(':')[1])
      //   countTime = (h * 60) + m
      // } else {
      //   countTime = 0
      // }
      if (end > start) {
        let genTime = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
        let h = parseInt(genTime.split(':')[0])
        let m = parseInt(genTime.split(':')[1])
        if (h === 0 && m !== 0) {
          countTime = m + ' นาที'
        } else if (h !== 0 && m === 0) {
          countTime = h + ' ชม.'
        } else {
          countTime = h + ' ชม. ' + m + ' นาที'
        }
      } else {
        countTime = 'No Data'
      }
      return countTime
    },
    calculateTimeEng (start, end) {
      let countTime = null
      // if (end > start) {
      //   let time = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
      //   let h = parseInt(time.split(':')[0])
      //   let m = parseInt(time.split(':')[1])
      //   countTime = (h * 60) + m
      // } else {
      //   countTime = 0
      // }
      if (end > start) {
        let genTime = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
        let h = parseInt(genTime.split(':')[0])
        let m = parseInt(genTime.split(':')[1])
        if (h === 0 && m !== 0) {
          countTime = m + ' min.'
        } else if (h !== 0 && m === 0) {
          countTime = h + ' h.'
        } else {
          countTime = h + ' h. ' + m + ' min.'
        }
      } else {
        countTime = 'No Data'
      }
      return countTime
    },
    async AddallowedDatesBysetTimebyday () {
      this.dateDayoffValue = JSON.parse(this.dataEmpAll.filter((a) => a.empId === this.formSelect.empId)[0].dateDayoffValue || '[]')
      if (this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTimebyday === 'True') {
        console.log('IF1')
        this.statusChek = true
        let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime)
        timeJson.forEach((item) => {
          console.log('for')
          if (item.setTime.length < this.fromAddTimeCus) {
            console.log('IF2')
            if (this.dateDayoffValue.filter((i) => i === item.value).length === 0) {
              console.log('item.value', item.value)
              this.dateDayoffValue.push(item.value)
            }
          }
        })
      } else {
        this.statusChek = false
      }
      console.log('this.dateDayoffValue', this.dateDayoffValue)
    },
    async checkCustomerTimeSlot () {
      this.statusChek = false
      console.log('this.fromAddTimeCus', this.fromAddTimeCus)
      console.log('DataFlowNameAll', this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId))
      this.timeSlotbyCustomer = []
      this.customerTimeSlot = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].customerTimeSlot
      let allTime = []
      if (this.customerTimeSlot === 'True') {
        // console.log('EmpItemLimit', this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime)
        if (this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTimebyday === 'True') {
          let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime)
          let dataTime = []
          timeJson.forEach((itemTime, index) => {
            // console.log('item', itemTime)
            allTime = itemTime.setTime
            allTime.forEach((item, key) => {
              let ss = {}
              if (allTime.length === 1) {
                ss.text = 'ไม่ระบุ (มีเวลาเดียว)'
                ss.value = key + 1
                dataTime.push(ss)
              } else {
                if (key > 0) {
                  let start = allTime.filter((i, k) => k === 0)[0].value
                  let end = item.value
                  ss.text = this.calculateTime(start, end)
                  ss.textEng = this.calculateTimeEng(start, end)
                  ss.value = key
                  // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                  dataTime.push(ss)
                  // this.timeSlotbyCustomer.push(ss)
                }
              }
            })
          })
          dataTime.forEach((i, n) => {
            if (this.timeSlotbyCustomer.filter((item) => item.text === i.text && item.value === i.value).length === 0) {
              console.log('n', n)
              this.timeSlotbyCustomer.push(i)
            }
          })
          console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
        } else {
          allTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime)
          allTime.forEach((item, key) => {
            let ss = {}
            if (allTime.length === 1) {
            // ss.text = item.value
            // ss.value = key + 1
            // this.timeSlotbyCustomer.push(ss)
              this.fromAddTimeCus = key + 1
              this.selectflow()
            } else {
              if (key > 0) {
                let start = allTime.filter((i, k) => k === 0)[0].value
                let end = item.value
                ss.text = this.calculateTime(start, end)
                ss.textEng = this.calculateTimeEng(start, end)
                ss.value = key
                console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                this.timeSlotbyCustomer.push(ss)
              }
            }
          })
        }
      } else {
        await this.selectflow()
      }

      // console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
    },
    checkTitleEmp () {
      let checkDataEmpTitle = this.DataFlowNameAll.filter(el => { return el.flowId === this.formSelect.flowId })
      if (checkDataEmpTitle.length > 0) {
        this.empTitleTh = checkDataEmpTitle[0].empTitleTh || 'พนักงานช่าง'
        this.empTitleEng = checkDataEmpTitle[0].empTitleEng || 'Employee'
      } else {
        this.empTitleTh = 'พนักงานช่าง'
        this.empTitleEng = 'Employee'
      }
    },
    async checkBranch () {
      if (this.formSelect.masBranchID !== '') {
        console.log('IFFFFF')
        this.formSelect.empId = ''
        await this.getEmp()
      }
    },
    dayCustom (item) {
      let dateDayCustom = this.dataEmpAll.filter((a) => a.empId === this.formSelect.empId)[0].dateDayCustom || '[]'
      let d = JSON.parse(dateDayCustom).filter((b) => b === item)
      return d
    },
    dayoffvalue (item, itemqq = 'NO') {
      let newDate = new Date(item)
      let day = newDate.getDay()
      let dateDayoffValue = this.dataEmpAll.filter((a) => a.empId === this.formSelect.empId)[0].dateDayoffValue || '[]'
      let d = []
      // console.log('dateDayoffValue', this.dateDayoffValue)
      // console.log('JSON.parse(dateDayoffValue)', JSON.parse(dateDayoffValue))
      if (this.statusChek === true) {
        // console.log('if', itemqq, this.dateDayoffValue.filter((b) => b === day), newDate)
        d = this.dateDayoffValue.filter((b) => b === day)
      } else {
        // console.log('else')
        d = JSON.parse(dateDayoffValue).filter((b) => b === day)
      }
      return d
    },
    async DefaultDay () {
      // console.log('dateSelect', this.dateSelect)
      let count = 0
      this.dateSelect.forEach((v, k) => {
        let typeDayCustom = this.dataEmpAll.filter((a) => a.empId === this.formSelect.empId)[0].typeDayCustom
        if (typeDayCustom === 'off') {
          if (this.dayCustom(v.date).length === 0 && this.dayoffvalue(v.date, 'test').length === 0) {
            if (count === 0) {
              v.active = true
              console.log('v.active', v.active)
              this.getDetails(v, k)
              count = 1
            }
          }
        } else {
          if (this.dayCustom(v.date).length > 0) {
            if (count === 0) {
              v.active = true
              console.log('v.active', v.active)
              this.getDetails(v, k)
              count = 1
            }
          }
        }
      })
    },
    // async setDataDefault () {
    //   this.formSelect.flowId = this.DataFlow[0].value
    //   await this.setQueue(this.date)
    //   await this.DefaultDay()
    // },
    async setMonthCarousel (item) {
      // console.log('//////////////////////////', moment(this.date, 'YYYY-MM').format('YYYY-MM'))
      // console.log('currentMonth', moment(this.currentMonth, 'YYYY-MM').format('YYYY-MM'))
      if (item === 'next') {
        this.date = moment(this.date).add(1, 'months').format('YYYY-MM')
      } else if (item === 'previous') {
        this.date = moment(this.date).add(-1, 'months').format('YYYY-MM')
      } else {

      }
      if (moment(this.date, 'YYYY-MM').format('YYYY-MM') > moment(this.currentMonth, 'YYYY-MM').format('YYYY-MM')) {
        this.previous = true
        console.log('true')
      } else {
        this.previous = false
        console.log('false')
      }
      // console.log('******************', this.date)
      await this.setQueue(moment(this.date, 'YYYY-MM').format('YYYY-MM'))
      await this.DefaultDay()
    },
    async addBooking (item) {
      console.log('test', item)
      console.log('formSelect', this.formSelect)
      console.log(', this.timeSlotbyCustomer', this.fromAddTimeCus)
      this.$swal({
        title: this.languageSelect === 0 ? 'ต้องการนัดหมาย ใช่หรือไม่?' : 'Want to make an appointment?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
        cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
      })
        .then(async result => {
          this.$router.push('/BookingFormEmp?shopId=' + this.shopId + '&source=CalendarBookingEmp&time=' +
      item.timeValue + '&flowId=' + this.formSelect.flowId + '&date=' +
      item.date + '&empId=' + this.formSelect.empId + '&masBranchID=' + this.formSelect.masBranchID + '&languageSelect=' + this.languageSelect +
      '&fromAddTimeCus=' + this.fromAddTimeCus + '&customerTimeSlot=' + this.customerTimeSlot)
        })
    },
    async getDetails (item, key) {
      try {
        this.showDetails = []
        this.currentSelect.item = item
        this.currentSelect.k = key
        console.log('active', item.active)
        console.log('key', key)
        this.dateSelect.filter((item, n) => n !== key).forEach((i, u) => { i.active = false })
        // this.showDetails = ['3']
        if (this.dateSelect.filter((a) => a.active === true).length > 0) {
          // this.showDetails = ['4']
          // console.log('!!!', this.allDetails.filter((d) => d.date === item.date))
          this.showDetails = await this.allDetails.filter((d) => d.date === item.date)
          // console.log('finish!!!!', this.showDetails)
          // this.showDetails = ['6']
          this.$forceUpdate()
        } else {
          // this.showDetails = ['5']
          console.log('else')
          this.showDetails = []
        }
        console.log('show', this.showDetails)
      } catch (error) {
        this.showDetails = ['error']
        console.log('error', error)
      }
    },
    async selectflow () {
      console.log('selectflow')
      await this.AddallowedDatesBysetTimebyday()
      await this.setQueue(this.date)
      await this.DefaultDay()
    },
    async setQueue (month) {
      this.dateSelect = []
      this.allDetails = []
      this.showDetails = []
      console.log('setQueue')
      // console.log('month', month)
      if (this.formSelect.empId) {
        console.log('getLimitBooking')
        await this.getLimitBooking(month)
        this.dateSelect.sort(this.compare)
        console.log('sortCompare', this.dateSelect)
        // await this.setLimit(month)
      } else {
        // this.$swal('กรุณาเลือกประเภทบริการ', 'ผิดพลาด', 'error')
      }
    },
    async getLimitBooking (month) {
      const result = await axios.get(this.DNS_IP + '/LimitBookingDateEmp/get?shopId=' + this.shopId + '&empId=' + this.formSelect.empId + '&bookingDate=' + month)
      if (!result.data.status) {
        if (result.data.length > 0) {
          // console.log('result1', result.data.filter((a) => a.bookingDate === '2023-09-07'))
          this.LimitBooking = result.data
          await this.setLimit(month)
          await this.DefaultDay()
        } else {
          this.LimitBooking = []
          console.log('result2', result.data)
          await this.setLimit(month)
          await this.DefaultDay()
        }
      }
    },
    checkButton (item) {
      let flowId = this.LimitBooking.filter((i) => i.bookingTime === item.timeValue && i.bookingDate === item.date).length > 0 ? this.LimitBooking.filter((i) => i.bookingTime === item.timeValue && i.bookingDate === item.date)[0].flowId : false
      // console.log('item', flowId)
      if (flowId) {
        return true
      } else {
        return false
      }
    },
    DetailsBooking (item) {
      if (this.LimitBooking.filter((i) => i.bookingTime === item.timeValue && i.bookingDate === item.date).length > 0) {
        console.log('flowID', this.LimitBooking.filter((i) => i.bookingTime === item.timeValue && i.bookingDate === item.date)[0].flowId)
        let flowId = this.LimitBooking.filter((i) => i.bookingTime === item.timeValue && i.bookingDate === item.date)[0].flowId
        let flowName = this.DataFlowNameAll.filter((i) => i.flowId === flowId)
        if (flowName.length > 0) {
          return this.DataFlowNameAll.filter((i) => i.flowId === flowId)[0].flowName
        } else {
          return 'บริการนี้ถูกลบไปแล้ว'
        }
      } else {
        return '............'
      }
    },
    DetailsBooking2 (item) {
      if (this.LimitBooking.filter((i) => i.bookingTime === item.timeValue && i.bookingDate === item.date).length > 0) {
        console.log('flowID', this.LimitBooking.filter((i) => i.bookingTime === item.timeValue && i.bookingDate === item.date)[0].flowId)
        let flowId = this.LimitBooking.filter((i) => i.bookingTime === item.timeValue && i.bookingDate === item.date)[0].flowId
        let flowName = this.DataFlowNameAll.filter((i) => i.flowId === flowId)
        if (flowName.length > 0) {
          return this.DataFlowNameAll.filter((i) => i.flowId === flowId)[0].flowName
        } else {
          return 'บริการนี้ถูกลบไปแล้ว'
        }
      } else {
        return '............'
      }
    },
    async openSlot (item) {
      console.log('open', item)
      console.log('LimitBooking', this.LimitBooking)
      let dataSelect = this.currentSelect.item
      let key = this.currentSelect.k
      let ID = await this.LimitBooking.filter((i) => i.bookingTime === item.timeValue && i.bookingDate === item.date)[0].id
      let userId = {
        'userId': this.$session.getAll().data.userName
      }
      console.log('ID', ID)
      this.$swal({
        title: this.languageSelect === 0 ? 'ต้องการเปิดการจองเวลานี้ ใช่หรือไม่?' : 'Want to make an appointment?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
        cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
      }).then(async result => {
        await axios.post(this.DNS_IP + '/LimitBookingDateEmp/delete/' + ID, userId)
          .then(async (response) => {
            console.log(response)
            await this.setQueue(moment(this.date, 'YYYY-MM').format('YYYY-MM'))
            await this.DefaultDay()
            await this.dateSelect.filter((a, k) => k === key).map((a) => {
              a.active = true
            })
            await this.getDetails(dataSelect, key)
          })
          .catch(error => {
            console.log('error function addData : ', error)
          })
      })
    },
    async closeSlot (item) {
      let dataSelect = this.currentSelect.item
      let key = this.currentSelect.k
      this.formOpenslot.flowId = this.formSelect.flowId
      this.formOpenslot.empId = this.formSelect.empId
      this.formOpenslot.masBranchID = this.formSelect.masBranchID
      this.formOpenslot.bookingDate = item.date
      this.formOpenslot.bookingTime = item.timeValue
      this.formOpenslot.countBooking = 1
      this.formOpenslot.shopId = this.shopId
      if (this.customerTimeSlot === 'False') {
        this.formOpenslot.timeSlotCustomer = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].timeSlot
      } else {
        this.formOpenslot.timeSlotCustomer = this.fromAddTimeCus
      }
      console.log('formOpenslot', this.formOpenslot)
      this.$swal({
        title: this.languageSelect === 0 ? 'ต้องการปิดการจองเวลานี้ ใช่หรือไม่?' : 'Want to make an appointment?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
        cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
      }).then(async result => {
        await axios.post(this.DNS_IP + '/LimitBookingDateEmp/add', this.formOpenslot)
          .then(async (response) => {
            console.log(response)
            await this.setQueue(moment(this.date, 'YYYY-MM').format('YYYY-MM'))
            await this.DefaultDay()
            await this.dateSelect.filter((a, k) => k === key).map((a) => {
              a.active = true
            })
            await this.getDetails(dataSelect, key)
          })
          .catch(error => {
            console.log('error function addData : ', error)
          })
      })
    },
    compare (a, b) {
      if (parseInt(a.value) < parseInt(b.value)) {
        return -1
      }
      if (parseInt(a.value) > parseInt(b.value)) {
        return 1
      }
      return 0
    },
    async setLimit (item) {
      this.dateSelect = []
      this.allDetails = []
      let month = moment(item).format('MM')
      let year = moment(item).format('YYYY')
      // เซ็ตวันที่และวัน เช่น 1-จ
      let data = await this.getDaysArray(year, month)
      console.log('data', data)
      let bookingNowCheck = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheck
      if (bookingNowCheck === 'True') {
        console.log('test', this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckCount || 1)
        let bookingNowCheckCount = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckCount || 1
        this.currentDate = moment().add(bookingNowCheckCount, 'days').format('YYYY-MM-DD')
      } else {
        this.currentDate = moment().format('YYYY-MM-DD')
      }
      console.log('bookingNowCheck', bookingNowCheck)
      let dt1 = await this.A(data, item)
      console.time('myFunction2')
      await this.B(dt1)
      console.timeEnd('myFunction2')
      console.log('dt1', dt1)
      // let limitTime = JSON.parse(this.dataEmpAll.filter((item) => item.empId === this.formSelect.empId)[0].setTime)
      await console.log('val', this.dateSelect)
      // console.log('allDetails', this.allDetails)
    },
    async A (data, item) {
      const promises = data.map(async (v, k) => {
        let limitTime = null
        if (this.dataEmpAll.filter((dataEmpAllitem) => dataEmpAllitem.empId === this.formSelect.empId)[0].setTimebyday === 'True') {
          let timeJson = JSON.parse(this.dataEmpAll.filter((dataEmpAllitem) => dataEmpAllitem.empId === this.formSelect.empId)[0].setTime).filter((items) => items.value === new Date(moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')).getDay())
          limitTime = timeJson[0].setTime || []
        } else {
          limitTime = JSON.parse(this.dataEmpAll.filter((dataEmpAllitem) => dataEmpAllitem.empId === this.formSelect.empId)[0].setTime)
        }
        let sub = {
          'limitTime': limitTime,
          'v': v,
          'item': item
        }
        return sub // Return the sub-object as the result of this promise
      })

      const TT = await Promise.all(promises)
      console.log('TT', TT)
      return TT
    },
    async B (dt1) {
      await Promise.all(dt1.map(async (aa) => {
        let limitTime = aa.limitTime
        let v = aa.v
        let item = aa.item

        let dataTimeCheck = await this.setLimitBooking(moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD'))

        let s = {}
        s.text = v.split('-')[1]
        s.value = v.split('-')[0]
        s.checkLimit = null
        s.color = ''
        s.active = false
        s.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
        let countBooking = 0
        let totalLimit = limitTime.reduce((x, y) => x + parseInt(y.limitBooking), 0)

        await Promise.all(limitTime.map(async (a) => {
          let cheklimit = 0
          if (await dataTimeCheck.filter((TimeA, TimeB) => a.value === TimeA.value).length > 0) {
            cheklimit = 0
          } else {
            cheklimit = 1
          }

          let ss = {}
          if (moment(this.date + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            if (moment().format(a.value) > moment().format('HH:mm')) {
              ss.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
              ss.time = a.text
              ss.timeValue = a.value
              ss.countBooking = cheklimit
              ss.limitBooking = a.limitBooking
              ss.Overtime = false
              this.allDetails.push(ss)
            } else {
              ss.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
              ss.time = a.text
              ss.timeValue = a.value
              ss.countBooking = cheklimit
              ss.limitBooking = a.limitBooking
              ss.Overtime = true
              this.allDetails.push(ss)
            }
          } else {
            ss.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
            ss.time = a.text
            ss.timeValue = a.value
            ss.countBooking = cheklimit
            ss.limitBooking = a.limitBooking
            ss.Overtime = false
            this.allDetails.push(ss)
          }

          if ((countBooking += cheklimit) >= totalLimit) {
            s.checkLimit = false
            s.color = this.DarkMode
            s.colortext = '#000000'
          } else {
            s.checkLimit = true
            s.color = '#0D47A1'
            s.colortext = '#FFFFFF'
          }
        }))

        if (moment(item, 'YYYY-MM').format() <= moment(this.currentMonth, 'YYYY-MM').format()) {
          if (parseInt(s.value) >= parseInt(this.currentDate.split('-')[2])) {
            console.log('s', s)
            this.dateSelect.push(s)
          }
        } else {
          console.log('s', JSON.stringify(s))
          this.dateSelect.push(s)
        }
      }))
    },
    async getDaysArray (year, month) {
      // console.log('result', result)
      var monthIndex = month - 1 // 0..11 instead of 1..12
      var names = [ 'อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส' ]
      var date = new Date(year, monthIndex, 1)
      var result = []
      while (date.getMonth() === monthIndex) {
        result.push(date.getDate() + '-' + names[date.getDay()])
        date.setDate(date.getDate() + 1)
      }
      console.log('result', result)
      return result
    },
    getShop () {
      axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          this.shop = rs
          this.ColorByShop.push('#E1F3FF', '#FFFFFF')
          this.DarkMode = '#ffffff00'
          this.DarkModefont = '#173053'
        }
      })
    },
    async selectBranch () {
      this.formSelect.flowId = ''
      this.dateSelect = []
      this.showDetails = []
      this.customerTimeSlot = 'False'
      await this.getDataFlow()
    },
    async getDataFlow () {
      this.DataFlowName = []
      this.DataFlowNameAll = []
      this.DataFlow = []
      let dataFlow = []
      let dataFlowName = []
      let dataFlowNameAll = []
      // console.log('DataFlowName', this.DataFlowName)
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let checkBranchByFlow = d.masBranchID || 'All'
            if ((checkBranchByFlow === this.formSelect.masBranchID.toString()) || checkBranchByFlow === 'All') {
              console.log('eeeeeee', d.flowName)
              d.text = d.flowName
              d.textEn = d.flowNameEn
              d.value = d.flowId
              dataFlowName.push(d)
              dataFlowNameAll.push(d)
              dataFlow.push(d)
            }
            // let s = rs[i]
            // s.dateDayCustom = JSON.parse(s.dateDayCustom)
            // s.flowId = s.flowId
            // this.dateDayCustom.push(JSON.parse(s.dateDayCustom))
            // let a = rs[i]
            // a.dateDayCustom = JSON.parse(s.dateDayCustom)
            // a.flowId = s.flowId
            // this.dateDayoffValue.push(JSON.parse(s.dateDayoffValue))
          }
          this.DataFlowName = dataFlowName.sort((a, b) => {
            if (a.text < b.text) return -1
            return a.text > b.text ? 1 : 0
          })
          this.DataFlowNameAll = dataFlowNameAll.sort((a, b) => {
            if (a.text < b.text) return -1
            return a.text > b.text ? 1 : 0
          })
          this.DataFlow = dataFlow.sort((a, b) => {
            if (a.text < b.text) return -1
            return a.text > b.text ? 1 : 0
          })
        } else {
          this.DataFlow = []
          this.DataFlowName = []
          this.DataFlowNameAll = []
        }
        console.log('this.DataFlow', this.DataFlow)
        // console.log('this.dateDayCustom', this.dateDayCustom)
        // console.log('this.dateDayoffValue', this.dateDayoffValue)
      })
    },
    async getDataBranch () {
      this.branch = []
      this.branchData = []
      await axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        console.log('rs', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (this.session.data.masBranchID === '' || this.session.data.masBranchID === null) {
              let s = {}
              s.text = d.masBranchName
              s.textEn = d.masBranchNameEn
              s.value = d.masBranchID
              this.branch.push(s)
              this.branchData.push(d)
            } else {
              if (d.masBranchID === this.session.data.masBranchID) {
                let s = {}
                s.text = d.masBranchName
                s.textEn = d.masBranchNameEn
                s.value = d.masBranchID
                this.branch.push(s)
                this.branchData.push(d)
              }
            }
          }
          if (this.branch.length === 1) {
            this.formSelect.masBranchID = this.branch[0].value
            this.selectBranch()
            // this.checkTime()
            // this.getEmp()
          }
        }
      })
      // console.log('branchData', this.branchData)
    },
    async getEmp () {
      this.dataEmp = []
      this.dataEmpAll = []
      this.dateSelect = []
      this.showDetails = []
      this.timeSlotbyCustomer = []
      this.fromAddTimeCus = ''
      this.customerTimeSlot = 'False'
      await axios.get(this.DNS_IP + '/empSelect/get?privacyPage=bookingform&masBranchID=' + this.formSelect.masBranchID).then(async (response) => {
        let rs = response.data
        console.log('rssssssssssssss', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.flowId !== null && d.flowId !== '') {
              let checkFlowId = JSON.parse(d.flowId)
              if (checkFlowId.filter((a) => parseInt(a) === this.formSelect.flowId).length > 0) {
                if (d.setTime !== null && d.setTime !== '[]' && d.setTime !== '') {
                  let s = {}
                  s.text = d.empFull_NameTH
                  s.textEng = d.empFull_NameTH
                  s.value = d.empId
                  this.dataEmp.push(s)
                  this.dataEmpAll.push(d)
                  let limit = {}
                  limit.empId = d.empId
                  limit.limitBookingCheck = d.limitBookingCheck || 'False'
                  limit.setTime = d.setTime || '[]'
                  limit.setTimebyday = d.setTimebyday
                  this.EmpItemLimit.push(limit)
                }
              }
            }
          }
          if (this.dataEmp.length === 0) {
            this.$swal(
              this.languageSelect === 0 ? 'ไม่มี' + this.empTitleTh + 'สำหรับประเภทบริการนี้' : 'There is no ' + this.empTitleEng + ' for this type of service.',
              this.languageSelect === 0 ? 'กรุณาเลือกประเภทบริการอื่นๆ' : 'Please select another type of service.',
              'info'
            )
          }
          if (this.dataEmp.length === 1) {
            this.formSelect.empId = this.dataEmp[0].value
            // await this.selectflow()
            await this.checkCustomerTimeSlot()
          }
          console.log('EmpItemLimit', this.EmpItemLimit)
        } else {
          this.dataEmp = []
          this.dataEmpAll = []
          this.EmpItemLimit = []
        }
      })
      console.log('dataEmp', this.dataEmpAll)
    },
    async setLimitBooking (dateItem) {
      this.time = ''
      let dataTimeCheck = []
      // this.showTable = []
      if (this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTimebyday === 'True') {
        let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime).filter((items) => items.value === new Date(dateItem).getDay())
        dataTimeCheck = timeJson[0].setTime || []
        // console.log('IF')
      } else {
        // console.log('ELSE')
        dataTimeCheck = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime) || []
      }
      this.limitBookingCheck = this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].limitBookingCheck || 'False'
      if (this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].limitBookingCheck || 'False') {
        // dataTimeCheck = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime) || []
        let slotByflow = []
        if (this.customerTimeSlot === 'False') {
          slotByflow = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].timeSlot
          // console.log('overTimeIF', slotByflow)
        } else {
          slotByflow = this.fromAddTimeCus
          // console.log('overTimeELSE', slotByflow)
        }
        let overTime = this.DataFlowNameAll.filter((v) => v.flowId === this.formSelect.flowId)[0].overTime
        // console.log('overTime', overTime)
        if (dataTimeCheck.length >= slotByflow) {
          let LimitBooking = await this.checkDateToTime(dateItem)
          // เซ็ต Status True ให้แต่ละช่วงเวลา
          dataTimeCheck.forEach((v, k) => {
            if (typeof v.status === 'undefined') {
              v.status = true
              if (v.limitBooking === '0') {
                v.status = false
              }
            }
          })
          // เซ็ต Status False ให้กับเวลาที่มีคนจองเข้ามาแล้ว
          if (LimitBooking !== 'False') {
            if (LimitBooking.length > 0) {
              dataTimeCheck.forEach((v, k) => {
                let bookingTarget = LimitBooking.filter((a) => a.bookingTime === v.value)
                if (bookingTarget.length > 0) {
                  v.status = false
                  let bookingTargetSlot = bookingTarget[0].timeSlotCustomer || bookingTarget[0].timeSlot
                  // console.log('bookingTager', bookingTarget)
                  for (let bT = 0; bT < bookingTargetSlot; bT++) {
                    if (dataTimeCheck[k + bT] !== undefined) {
                      dataTimeCheck[k + bT].status = false
                    }
                  }
                }
              })
            }
          }
          // จับคู่เวลาตาม slotbyFlow
          let Newtimeavailable = []
          let slotCheck = slotByflow
          for (let i = 0; i < dataTimeCheck.length; i++) {
            let num = i + (slotCheck - 1)
            let checkitem = dataTimeCheck.filter((item, key) => (key >= i && key <= num))
            Newtimeavailable.push(checkitem)
          }
          // console.log('Newtimeavailable', Newtimeavailable)
          dataTimeCheck = []
          //  ตัดเวลาที่มีค่า False ออก
          Newtimeavailable.forEach((v, k) => {
            if (overTime === 'True') {
              if (v.filter((v) => v.status === false).length <= 0) {
                dataTimeCheck.push(v[0])
              }
            } else {
              if (v.filter((v) => v.status === false).length <= 0 && v.length === slotCheck) {
                dataTimeCheck.push(v[0])
              }
            }
          })
          return dataTimeCheck
        } else {
          // console.log('ทดสอบ')
          dataTimeCheck = []
          return dataTimeCheck
        }
      } else {
        // console.log('dataTimeCheck ELSEEEEE', dataTimeCheck)
        // LimitBookingBy Flow
        // dataTimeCheck = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.formSelect.empId })[0].setTime) || []
        return dataTimeCheck
      }
      // await this.chekSlotTime()
    },
    checkDateToTime (dateItem) {
      let dt = this.LimitBooking.filter((item) => moment(item.bookingDate).format('YYYY-MM-DD') === moment(dateItem, 'YYYY-MM-DD').format('YYYY-MM-DD'))
      if (dt.length > 0) {
        return dt
      } else {
        return 'False'
      }
    }
  }
}
</script>
<style scope>
.cardradius {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
.button {
  width: 45%;
  color: #fff;
  font-weight: 150;
  letter-spacing: 1px;
  margin: 6px 3px;
  padding: 10px 28px;
  border-radius: 25px !important;
  background-color: #0047a5;
}
.main{
  background-color: #FFFFFF;
  height: 100vh;
}
.content{
  overflow:auto;
  white-space: normal;
}
.a{
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  max-height: 350px;
}
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;
}

.my-event.with-time {
  position: absolute;
  right: 4px;
  margin-right: 0px;
}
#margin {
  margin-top: 50px;
  margin-bottom: 40px;
}
.v_text_edit {
  width: 255px;
  height: 52px;
  font-size: 10px !important;
}
#subtext {
  color: #173053;
  font-size: 30px !important;
  font-weight: bold;
}
/* width */
::-webkit-scrollbar {
  width: 2px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #173053;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #173053;
}
</style>
