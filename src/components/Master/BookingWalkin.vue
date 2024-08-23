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
              @change="selectBranch()"
            :menu-props="{ bottom: true, offsetY: true }"
            ></v-select>
            <v-select
            v-if="formSelect.masBranchID !== '' && formSelect.masBranchID !== null"
              :item-text="languageSelect === 0 ? 'text' : 'textEn'"
              v-model="formSelect.flowId"
              :label="languageSelect === 0 ? 'ประเภทบริการ *' : 'Sevice *'"
              dense
              outlined
              :items="DataFlow"
              @change="checkFlowBranch()"
              attach
              :menu-props="{ bottom: true, offsetY: true }"
            ></v-select>
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
        v-if="dateSelect.length > 0 "
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
              v-if="DataFlow.filter((a) => a.flowId === formSelect.flowId)[0].typeDayCustom === 'off' && dayCustom(item.date).length === 0 && dayoffvalue(item.date).length === 0"
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
              v-else-if="DataFlow.filter((a) => a.flowId === formSelect.flowId)[0].typeDayCustom === 'on' && dayCustom(item.date).length > 0 "
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

        <v-expand-transition>
          <v-sheet
            v-if="showDetails.length > 0"
            min-height="200"
            tile
            class="pa-3 px-5 ml-2 mr-2"
          >
          <v-row>
            <v-col cols="4" class="pa-0">
              <h6 class="mt-3 font-weight-bold text-center" >
                {{languageSelect === 0 ? 'เวลา': 'Time'}}
              </h6>
              <div v-for="(item , index) in showDetails" :key="index">
                <h5  class="mt-3 font-weight-bold text-center" >
                  <div v-if="(item.countBooking < parseInt(item.limitBooking)) && !item.Overtime">
                    <!-- <v-btn
                      dark
                      class="font-weight-bold  text-center"
                      color="#0D47A1"
                      width="80%"
                      >{{item.time}}
                    </v-btn> -->
                    <v-sheet
                      class="font-weight-bold text-center"
                      color="#0D47A1"
                      width="100%"
                      height="36px"
                      elevation="2"
                      rounded
                      style="display: flex;justify-content: center;align-items: center;"
                      >
                    <p class="ma-0" style="word-wrap: break-word;color: #FFFFFF;font-size: small;">{{item.time}}</p>
                    </v-sheet>
                  </div>
                  <div v-else-if="item.Overtime">
                    <!-- <v-btn
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="80%"
                      >{{item.time}}
                    </v-btn> -->
                    <v-sheet
                      class="font-weight-bold text-center"
                      color="rgb(224 224 224)"
                      width="100%"
                      height="36px"
                      elevation="0"
                      rounded
                      style="display: flex;justify-content: center;align-items: center;"
                      >
                    <p class="ma-0" style="word-wrap: break-word;color: rgb(166 166 166);font-size: small;">{{item.time}}</p>
                    </v-sheet>
                  </div>
                  <div v-else>
                    <!-- <v-btn
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="80%"
                      >{{item.time}}
                    </v-btn> -->
                    <v-sheet
                      class="font-weight-bold text-center"
                      color="rgb(224 224 224)"
                      width="100%"
                      height="36px"
                      elevation="0"
                      rounded
                      style="display: flex;justify-content: center;align-items: center;"
                      >
                    <p class="ma-0" style="word-wrap: break-word;color: rgb(166 166 166);font-size: small;">{{item.time}}</p>
                    </v-sheet>
                  </div>
                </h5>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <h6 class="mt-3 font-weight-bold text-center" >
                {{languageSelect === 0 ? 'จำนวนคิวว่าง ': 'Queues'}}
              </h6>
              <div v-for="(item , index) in showDetails" :key="index">
                <h5  class="mt-3 font-weight-bold text-center" >
                  <div v-if="(item.countBooking < parseInt(item.limitBooking)) && !item.Overtime">
                    <v-btn
                      dark
                      class="font-weight-bold  text-center"
                      color="#0ACF83"
                      width="80%"
                      >{{(item.limitBooking - item.countBooking)}}
                    </v-btn>
                  </div>
                  <div v-else-if="item.Overtime">
                    <v-btn
                      disabled
                      class="font-weight-bold  text-center"
                      color="#000000"
                      width="80%"
                      >{{'เกินเวลา'}}
                    </v-btn>
                  </div>
                  <div v-else>
                    <v-btn
                    dark
                      readonly
                      class="font-weight-bold  text-center"
                      color="#EB5757"
                      width="80%"
                      >{{('เต็ม')}}
                    </v-btn>
                  </div>
                </h5>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <h6 class="mt-3 font-weight-bold text-center" >
                {{languageSelect === 0 ? 'ลด / เพิ่ม (คิวว่าง)': 'Booking'}}
              </h6>
              <div v-for="(item , index) in showDetails" :key="index">
                <div  class="mt-3 font-weight-bold text-center" >
                  <div style="height: 36px; display: flex; justify-content: center;align-items: center;" v-if="(item.countBooking < parseInt(item.limitBooking)) && !item.Overtime">
                    <v-btn
                    color="#0D47A1"
                      icon
                      x-large
                      @click="addWalkin(item)"
                    >
                    <v-icon>
                      mdi-minus-circle
                      </v-icon>
                  </v-btn>
                  <v-btn
                  :disabled="item.countBooking === 0 ? true : false"
                      color="#0D47A1"
                      icon
                      x-large
                      @click="removeWalkin(item)"
                    >
                    <v-icon>
                      mdi-plus-circle

                      </v-icon>
                  </v-btn>
                  </div>
                  <div style="height: 36px; display: flex; justify-content: center;align-items: center;" v-else-if="item.Overtime">
                    <v-btn
                    disabled
                    color="#0D47A1"
                      icon
                      x-large
                    >
                    <v-icon>
                      mdi-minus-circle
                      </v-icon>
                  </v-btn>
                  <v-btn
                  disabled
                  color="#0D47A1"
                      icon
                      x-large
                    >
                    <v-icon>
                      mdi-plus-circle
                      </v-icon>
                  </v-btn>
                  </div>
                  <div  style="height: 36px; display: flex; justify-content: center;align-items: center;" v-else>
                    <v-btn
                    disabled
                    color="#0D47A1"
                      icon
                      x-large
                      :loading="Addloading"
                      @click="addWalkin(item)"
                    >
                    <v-icon>
                      mdi-minus-circle
                      </v-icon>
                    </v-btn>
                    <v-btn
                      :disabled="parseInt(item.limitBooking) === 0 ? true : false"
                        color="#0D47A1"
                        icon
                        x-large
                        :loading="Removeloading"
                        @click="removeWalkin(item)"
                      >
                      <v-icon>
                        mdi-plus-circle
                        </v-icon>
                    </v-btn>
                  </div>
                </div>
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
      await this.setQueue(this.date)
      await this.DefaultDay()
    }
  },
  data () {
    return {
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'จัดการเวลานัดหมาย',
          disabled: false,
          href: '/Master/BookingWalkin'
        }
      ],
      model: 0,
      previous: false,
      itemMonth: [],
      defaultMonth: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      defaultMonthEng: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      dateEng: [{text: 'อา', textEn: 'Sun'}, {text: 'จ', textEn: 'Mon'}, {text: 'อ', textEn: 'Tue'}, {text: 'พ', textEn: 'Wed'}, {text: 'พฤ', textEn: 'Thu'}, {text: 'ศ', textEn: 'Fri'}, {text: 'ส', textEn: 'Sat'}],
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
        masBranchID: '',
        datemonth: '',
        dateday: ''
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
      branchData: [],
      branch: [],
      languageSelect: 0,
      dateDayCustom: [],
      dateDayoffValue: [],
      formOpenslot: {
        flowId: '',
        masBranchID: '',
        bookingDate: '',
        bookingTime: '',
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      },
      currentSelect: {
        item: {},
        k: null
      },
      Addloading: false,
      Removeloading: false
    }
  },
  async mounted () {
    await this.getShop()
    // await this.getDataFlow()
    await this.getDataBranch()
    await this.setMonthCarousel()
    await this.setDataDefault()
  },
  methods: {
    async addWalkin (item) {
      this.Addloading = true
      console.log('ADD', item)
      let dataSelect = this.currentSelect.item
      let key = this.currentSelect.k
      let addData = this.LimitBooking.filter((a) => a.bookingDate === item.date && a.bookingTime === item.timeValue)
      if (addData.length > 0) {
        let ID = addData[0].id
        let countBooking = (addData[0].countBooking + 1)
        let LAST_USER = {
          'countBooking': countBooking,
          'LAST_USER': this.$session.getAll().data.userName
        }
        // this.$swal({
        //   title: this.languageSelect === 0 ? 'ต้องการเพิ่ม ใช่หรือไม่?' : 'Want to make an appointment?',
        //   type: 'question',
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#b3b1ab',
        //   confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
        //   cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
        // }).then(async result => {

        // })
        await axios.post(this.DNS_IP + '/LimitBookingDate/edit/' + ID, LAST_USER)
          .then(async (response) => {
            console.log(response)
            await this.setQueue(moment(this.date, 'YYYY-MM').format('YYYY-MM'))
            await this.DefaultDay()
            await this.dateSelect.filter((a, k) => k === key).map((a) => {
              a.active = true
            })
            await this.getDetails(dataSelect, key)
            this.Addloading = false
          })
          .catch(error => {
            console.log('error function addData : ', error)
            this.Addloading = false
          })
      } else {
        this.formOpenslot.flowId = this.formSelect.flowId
        this.formOpenslot.masBranchID = this.formSelect.masBranchID
        this.formOpenslot.bookingDate = item.date
        this.formOpenslot.bookingTime = item.timeValue
        this.formOpenslot.countBooking = (item.countBooking + 1)
        this.formOpenslot.shopId = this.shopId
        console.log('this.formOpenslot', this.formOpenslot)
        // this.$swal({
        //   title: this.languageSelect === 0 ? 'ต้องการเพิ่ม ใช่หรือไม่?' : 'Want to make an appointment?',
        //   type: 'question',
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#b3b1ab',
        //   confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
        //   cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
        // }).then(async result => {
        // })
        await axios.post(this.DNS_IP + '/LimitBookingDate/add', this.formOpenslot)
          .then(async (response) => {
            console.log(response)
            await this.setQueue(moment(this.date, 'YYYY-MM').format('YYYY-MM'))
            await this.DefaultDay()
            await this.dateSelect.filter((a, k) => k === key).map((a) => {
              a.active = true
            })
            await this.getDetails(dataSelect, key)
            this.Addloading = false
          })
          .catch(error => {
            console.log('error function addData : ', error)
            this.Addloading = false
          })
      }
      this.Addloading = false
    },
    async removeWalkin (item) {
      // this.Removeloading = true
      console.log('item', item)
      console.log('this.currentSelect', this.currentSelect)
      let dataSelect = this.currentSelect.item
      let key = this.currentSelect.k
      let addData = this.LimitBooking.filter((a) => a.bookingDate === item.date && a.bookingTime === item.timeValue)
      let ID = addData[0].id
      let countBooking = (addData[0].countBooking - 1)
      let LAST_USER = {
        'countBooking': countBooking,
        'LAST_USER': this.$session.getAll().data.userName
      }
      // this.$swal({
      //   title: this.languageSelect === 0 ? 'ต้องการลด ใช่หรือไม่?' : 'Want to make an appointment?',
      //   type: 'question',
      //   showCancelButton: true,
      //   confirmButtonColor: '#3085d6',
      //   cancelButtonColor: '#b3b1ab',
      //   confirmButtonText: this.languageSelect === 0 ? 'ใช่' : 'Yes',
      //   cancelButtonText: this.languageSelect === 0 ? 'ไม่' : 'No'
      // }).then(async result => {
      // })
      await axios.post(this.DNS_IP + '/LimitBookingDate/edit/' + ID, LAST_USER)
        .then(async (response) => {
          console.log(response)
          this.Removeloading = false
          await this.setQueue(moment(this.date, 'YYYY-MM').format('YYYY-MM'))
          await this.DefaultDay()
          await this.dateSelect.filter((a, k) => k === key).map((a) => {
            a.active = true
          })
          await this.getDetails(dataSelect, key)
        })
        .catch(error => {
          // this.Removeloading = false
          console.log('error function addData : ', error)
        })
    },
    dayCustom (item) {
      let dateDayCustom = this.DataFlow.filter((a) => a.flowId === this.formSelect.flowId)[0].dateDayCustom || '[]'
      let d = JSON.parse(dateDayCustom).filter((b) => b === item)
      return d
    },
    dayoffvalue (item) {
      let newDate = new Date(item)
      let day = newDate.getDay()
      let dateDayoffValue = this.DataFlow.filter((a) => a.flowId === this.formSelect.flowId)[0].dateDayoffValue || '[]'
      let d = JSON.parse(dateDayoffValue).filter((b) => b === day)
      return d
    },
    async DefaultDay () {
      // console.log('dateSelect', this.dateSelect)
      let count = 0
      this.dateSelect.forEach((v, k) => {
        let typeDayCustom = this.DataFlow.filter((a) => a.flowId === this.formSelect.flowId)[0].typeDayCustom
        if (typeDayCustom === 'off') {
          if (this.dayCustom(v.date).length === 0 && this.dayoffvalue(v.date).length === 0) {
            if (count === 0) {
              v.active = true
              this.getDetails(v, k)
              count = 1
              console.log('kkkkkkkk', k)
              console.log('kkkkkkkk', v)
            }
          }
        } else {
          if (this.dayCustom(v.date).length > 0) {
            if (count === 0) {
              v.active = true
              this.getDetails(v, k)
              count = 1
              console.log('kkkkkkkk', k)
              console.log('kkkkkkkk', v)
            }
          }
        }
      })
    },
    async setDataDefault () {
      this.formSelect.flowId = this.DataFlow[0].value
      // await this.setQueue(this.date)
      // await this.DefaultDay()
      if (this.formSelect.flowId !== '' && this.formSelect.masBranchID !== '') {
        this.selectflow()
      }
    },
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
          this.$router.push('/BookingForm?shopId=' + this.shopId + '&source=CalendarBooking&time=' +
      item.timeValue + '&flowId=' + this.formSelect.flowId + '&masBranchID=' + this.formSelect.masBranchID + '&date=' + item.date + '&languageSelect=' + this.languageSelect)
        })
    },
    async getDetails (item, key, a) {
      this.showDetails = []
      // console.log('imte', item)
      // console.log('key', key)
      this.currentSelect.item = item
      this.currentSelect.k = key
      this.dateSelect.filter((item, n) => n !== key).forEach((i, u) => { i.active = false })
      if (this.dateSelect.filter((item) => item.active === true).length > 0) {
        this.showDetails = this.allDetails.filter((d) => d.date === item.date)
      } else {
        this.showDetails = []
      }
      console.log('showDetail', this.showDetails)
    },
    async checkFlowBranch () {
      console.log('!!!!!', this.formSelect.flowId, this.formSelect.masBranchID)
      if (this.formSelect.flowId !== '' && this.formSelect.masBranchID !== '') {
        this.selectflow()
      }
    },
    async selectflow () {
      await this.setQueue(this.date)
      await this.DefaultDay()
    },
    async setQueue (month) {
      this.dateSelect = []
      this.allDetails = []
      this.showDetails = []
      // console.log('month', month)
      if (this.formSelect.flowId) {
        await this.getLimitBooking(month)
        // await this.setLimit(month)
      } else {
        // this.$swal('กรุณาเลือกประเภทบริการ', 'ผิดพลาด', 'error')
      }
    },
    async getLimitBooking (month) {
      const result = await axios.get(this.DNS_IP + '/LimitBookingDate/get?shopId=' + this.shopId + '&flowId=' + this.formSelect.flowId + '&masBranchID=' + this.formSelect.masBranchID + '&bookingDate=' + month)
      if (!result.data.status) {
        if (result.data.length > 0) {
          console.log('result', result.data)
          this.LimitBooking = result.data
          await this.setLimit(month)
        } else {
          this.LimitBooking = []
          // console.log('result', result.data)
          await this.setLimit(month)
        }
      }
    },
    async setLimit (item) {
      this.dateSelect = []
      this.allDetails = []
      let month = moment(item).format('MM')
      let year = moment(item).format('YYYY')
      // เซ็ตวันที่และวัน เช่น 1-จ
      // console.log('month', month, year)
      let data = this.getDaysArray(year, month)
      // console.log('data!!!""', data)
      let limitTime = JSON.parse(this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].setTime) || []
      // console.log('consoletest', this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0])
      // let bookingNowCheck = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheck
      // console.log('bookingNowCheck', bookingNowCheck)
      // if (bookingNowCheck === 'True') {
      //   // console.log('test', this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckCount || 1)
      //   let bookingNowCheckCount = this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].bookingNowCheckCount || 1
      //   this.currentDate = moment().add(bookingNowCheckCount, 'days').format('YYYY-MM-DD')
      // } else {
      //   this.currentDate = moment().format('YYYY-MM-DD')
      // }
      this.currentDate = moment().format('YYYY-MM-DD')
      // console.log('bookingNowCheck', bookingNowCheck)
      data.forEach((v, k) => {
        let s = {}
        s.text = v.split('-')[1]
        s.value = v.split('-')[0]
        s.checkLimit = null
        s.color = ''
        s.active = false
        s.date = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
        // console.log('dayyyyy', moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD'))
        // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
        let NewDate = moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
        if (this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].setTimebyday === 'True') {
          let timeJson = JSON.parse(this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].setTime).filter((items) => items.value === new Date(NewDate).getDay())
          limitTime = timeJson[0].setTime || []
          // console.log('IF')
        } else {
          // console.log('ELSE')
          limitTime = JSON.parse(this.DataFlow.filter((item) => item.flowId === this.formSelect.flowId)[0].setTime) || []
        }
        let stasutColorDate = false
        // let countBooking = 0
        // let totalLimit = limitTime.reduce((x, y) => { return x + parseInt(y.limitBooking) }, 0)
        limitTime.forEach((a, b) => {
          // console.log('type')
          // console.log('aaaa', thi?s.LimitBooking.filter((limitItem) => moment(limitItem.bookingDate, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')))
          // let cheklimit = this.LimitBooking.filter((limitItem) => { return a.value === limitItem.bookingTime && moment(limitItem.bookingDate).format('YYYY-MM-DD') === moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD') }).map((d) => d.countBooking)[0] || 0
          let cheklimit = this.LimitBooking.filter((limitItem) => { return (a.value === limitItem.bookingTime && moment(limitItem.bookingDate).format('YYYY-MM-DD') === moment(item + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')) && limitItem.countBooking >= 0 }).map((d) => d.countBooking)[0] || 0
          // console.log(moment(this.date + v.split('-')[0], 'YYYY-MM-DD').format('YYYY-MM-DD'), '--', cheklimit)
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
          if (cheklimit < parseInt(a.limitBooking)) {
            stasutColorDate = true
          }
        })
        if (stasutColorDate === false) {
          s.checkLimit = false
          s.color = this.DarkMode
          s.colortext = '#000000'
          // console.log('aaaa' + s.date + ' ' + a.value + '-', cheklimit)
          // console.log('cheklimitIF', v, a.value, cheklimit)
        } else {
          s.checkLimit = true
          s.color = '#0D47A1'
          s.colortext = '#FFFFFF'
          // console.log('cheklimit', v, a.value, cheklimit)
        }
        // เซ็ตวันที่เป็นปัจจุบัน
        if (moment(item, 'YYYY-MM').format() <= moment(this.currentMonth, 'YYYY-MM').format()) {
          if (parseInt(s.value) >= parseInt(this.currentDate.split('-')[2])) {
            // console.log('werwerewrewrwerwerwerew', parseInt(this.currentDate.split('-')[2]), parseInt(s.value))
            this.dateSelect.push(s)
          }
        } else {
          this.dateSelect.push(s)
        }
      })
      console.log('val', this.dateSelect)
      // console.log('allDetails', this.allDetails)
    },
    getDaysArray (year, month) {
      var monthIndex = month - 1 // 0..11 instead of 1..12
      var names = [ 'อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส' ]
      var date = new Date(year, monthIndex, 1)
      var result = []
      while (date.getMonth() === monthIndex) {
        result.push(date.getDate() + '-' + names[date.getDay()])
        date.setDate(date.getDate() + 1)
      }
      return result
    },
    async checkLiffLogin (dataLineConfig) {
      console.log('dataLineConfig', dataLineConfig)
      await this.$liff
        .init({
          liffId: dataLineConfig.liffMainID
        })
        .then(async () => {
          if (process.env.NODE_ENV === 'development') {
            this.getProfile_dev()
          } else {
            if (!this.$liff.isLoggedIn()) {
              this.$liff.login({ redirectUri: window.location.href })
            } else {
              await this.getProfile()
            }
          }
        })
        .catch(err => {
          // this.$router.push({ name: '404' })
          console.log(err.code, err.message)
        })
      // this.$liff.init({ 'liffId': liffId }, function (data) {})
    },
    async getProfile () {
      let _this = this
      await this.$liff
        .getProfile()
        .then(function (profile) {
          _this.profile = profile
          console.log('prod', _this.profile)
        })
        .catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    getProfile_dev () {
      this.profile = this.$profile_dev
      console.log('dev', this.profile)
    },
    async getBotinfo () {
      if (this.$route.query.shopId) {
        const url = `${this.DNS_IP}/line/getOa`
        // const url = 'http://localhost:81/Api/vgroupl_api/v1/Zoom/Login/getData?'
        const config = {
          headers: {
            'botId': this.$route.query.shopId
          }
        }
        await axios.get(url, config).then((response) => {
          let rs = response.data
          console.log('rs1', rs)
          window.location.href = 'line://ti/p/' + rs.basicId
        })
      }
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
      await this.getDataFlow()
    },
    async getDataFlow () {
      this.DataFlow = []
      let dataFlow = []
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let checkBranchByFlow = d.masBranchID || 'All'
            if ((checkBranchByFlow === this.formSelect.masBranchID.toString()) || checkBranchByFlow === 'All') {
              if (d.limitBookingCheck === 'True') {
                console.log('eeeeeee', d)
                d.text = d.flowName
                d.textEn = d.flowNameEn
                d.value = d.flowId
                dataFlow.push(d)
              }
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
          this.DataFlow = dataFlow.sort((a, b) => {
            if (a.text < b.text) return -1
            return a.text > b.text ? 1 : 0
          })
        } else {
          this.DataFlow = []
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
        console.log('branch', rs)
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
            // console.log('dtdtdtdt', this.branch)
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
