<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <!-- <v-row> -->
          <!-- <v-col cols="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col> -->
          <!-- <v-col cols="6" class="v-margit_button text-right">
            <v-btn color="primary" depressed @click="dialogAdd = true">
              <v-icon left>mdi-text-box-plus</v-icon>
              เพิ่มข้อมูล
            </v-btn>
          </v-col> -->
        <!-- </v-row> -->
        <div style="display:flex;justify-content: center;" class="ma-3">
            <v-chip
              class="mr-1 font-weight-black"
              :style="'background-color:' + (languageSelect === 0 ? '#173053' : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="languageSelect = 0"
              >
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-TH.png?alt=media&token=e4bd7ffa-aed9-47e3-9240-4dcb9d8d284e"></v-img>
              </v-avatar>
                TH
            </v-chip>
            <v-chip
              class="ml-1 font-weight-black"
              :style="'background-color:' + (languageSelect === 1 ? '#173053' : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="languageSelect = 1">
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-USA1.png?alt=media&token=a83dd820-f576-457a-8d08-1009cea9d70b"></v-img>
              </v-avatar>
                EN
            </v-chip>
          </div>
        <v-form ref="form_search" v-model="validSearch" lazy-validation>
          <v-row>
            <v-col col="2">
              <v-select
                :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                v-model="masBranchID"
                background-color="white"
                style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                hide-details
                :items="branchItem"
                :label="languageSelect === 0 ? 'สาขา' : 'Branch'"
                outlined
                dense
                required
                :rules ="[rules.required]"
                @change="clearTimeLoop(), checkSearch()"
                ><template #prepend-inner>
                  <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                    mdi-map-marker-outline
                  </v-icon>
                </template>
              </v-select>
            </v-col>
            <!-- <v-col col="2">
              <v-select
                :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                :label="languageSelect === 0 ? 'ประเภทบริการ' : 'Service'"
                style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                v-model="flowSelect"
                hide-details
                background-color="white"
                :items="DataFlowItem"
                outlined
                dense
                required
                :rules ="[rules.required]"
                @change="setTime()"
              >
                <template #prepend-inner>
                  <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                    mdi-note-text-outline
                  </v-icon>
                </template>
              </v-select>
            </v-col> -->
            <v-col col="2">
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
                    :label="languageSelect === 0 ? 'วัน/เดือน/ปี' : 'Date'"
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
                  @input="menuStart = false, clearTimeLoop(), checkSearch()"
                  v-model="dateStart"
                  no-title
                  scrollable
                >
                </v-date-picker>
              </v-menu>
            </v-col>
            <!-- <v-col>
              <v-select
                style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                v-model="time"
                hide-details
                background-color="white"
                :items="timeavailable"
                :label="languageSelect === 0 ? 'เวลา' : 'Time'"
                outlined
                dense
                required
                :rules ="[rules.required]"
              >
                <template #prepend-inner>
                  <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                    mdi-map-marker-circle
                  </v-icon>
                </template>
              </v-select>
            </v-col> -->
            <!-- <v-col col="2">
              <v-btn
                color="warning"
                block
                style="border-radius: 20px !important;margin-right: 0px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                @click="clearTimeLoop(), checkSearch()"
              >
                <v-icon color="white" left>mdi-clipboard-text-search</v-icon>
                ค้นหา
              </v-btn>
            </v-col> -->
          </v-row>
          <!-- <v-row justify="center">
            <v-col cols="3" class="pt-0">
              <v-btn
                color="warning"
                block
                style="border-radius: 20px !important;margin-right: 0px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                @click="clearTimeLoop(), checkSearch()"
              >
                <v-icon color="white" left>mdi-clipboard-text-search</v-icon>
                ค้นหา
              </v-btn>
            </v-col>
          </v-row> -->
        </v-form>
        <template>
          <v-row>
            <v-col v-for="(items, id) in itemBookingUse" :key="id" lg="3" xl="2" md="6" sm="6" xs="6">
              <v-sheet class="pa-3 pt-5 mt-3" :style="'background-color:'+ DarkModeBackground +';min-height: 339px;border-radius: 0px 0px 0px 0px;border: 2px dotted #c8c8c8;'" >
                <div class="" style="border-radius: 45px 45px 0px 0px;display:flex;justify-content: center;background-color:#FFFFFF;min-height: 180px;" v-if="items.statusBt === 'confirmJob'">
                  <v-row style="margin:auto;">
                  <v-col cols="12" class="text-center"><v-icon color="#28B446" x-large class="ma-0 mr-2" style="font-size:70px;">mdi-check-circle</v-icon></v-col>
                  <!-- <v-col cols="12" class="text-center font-weight-bold"><h3 style="color:#28B446;">{{ languageSelect === 0 ? "เข้ารับบริการ" : "Receive service" }}</h3></v-col> -->
                  <v-col cols="12" class="text-center font-weight-bold" v-if="items.flowName !== ''"><h3><strong>{{ languageSelect === 0 ? items.flowName : items.flowNameEn }}</strong></h3></v-col>
                  <v-col cols="12" class="text-center font-weight-bold" v-if="items.servicePoint !== ''"><h3 style="color:#28B446;"><strong>{{ languageSelect === 0 ? items.servicePoint : JSON.parse(items.servicePointCount).filter(el => { return el.textTh === items.servicePoint}).length > 0 ? JSON.parse(items.servicePointCount).filter(el => { return el.textTh === items.servicePoint})[0].textEn:items.servicePoint }}</strong></h3></v-col>
                  <!-- <v-col cols="12" class="text-center font-weight-bold" v-if="items.serviceTH !== ''"><h5>{{ languageSelect === 0 ? items.serviceTH : fieldNameEn.filter(el => { return el.textTH === items.serviceTH })[0].textEN || items.serviceTH }}</h5></v-col> -->
                </v-row>
                </div>
                <div class="" style="border-radius: 45px 45px 0px 0px;display:flex;justify-content: center;background-color:#FFFFFF;min-height: 180px;" v-else>
                  <v-row style="margin:auto;">
                  <v-col cols="12" class="text-center"><v-icon x-large class="ma-0 mr-2" style="font-size:70px;">mdi-check-circle</v-icon></v-col>
                  <!-- <v-col cols="12" class="text-center font-weight-bold"><h3>{{ languageSelect === 0 ? "กำลังรอคิว" : "Waiting in queue" }}</h3></v-col> -->
                  <v-col cols="12" class="text-center font-weight-bold" v-if="items.flowName !== ''"><h3><strong>{{ languageSelect === 0 ? items.flowName : items.flowNameEn }}</strong></h3></v-col>
                  <v-col cols="12" class="text-center font-weight-bold"><h3>______</h3></v-col>
                </v-row>
              </div>
              <!-- <div v-if="items.storeFrontQueue" class="pa-3" :style="'border-top: 4px dotted '+ DarkModeBackground + ';background-color:#FFFFFF;min-height: 180px;'"> -->
                <!-- <h4 class="text-center font-weight-bold mt-5" style="color:#092C4C">{{ shop[0].shopName }}</h4> -->
                <!-- <v-row>
                  <v-col cols="6" >
                    <div class="text-left ml-6 mt-3">
                      <p class="font-weight-bold" style="color:#092C4C">{{ languageSelect === 0 ? "วันที่นัดหมาย" : "Date" }}</p>
                      <p style="color:#092C4C" class="mt-n4 font-weight-bold">{{ languageSelect === 0 ? "เวลา" : "Time Of issu" }}</p>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-right mr-6 mt-3">
                      <p class="font-weight-bold"  style="color:#092C4C">{{format_dateNotime(items.dueDate)}}</p>
                      <p style="color:#092C4C" class="mt-n4 font-weight-bold">{{momenTime(items.dueDate)}}{{ languageSelect === 0 ? "  น." : "" }}</p>
                    </div>
                  </v-col>
                </v-row> -->
              <!-- </div> -->
              <v-sheet v-if="items.storeFrontQueue" class="pa-1" :style="'background-color:#FFFFFF;min-height: 60px;border-radius: 0px 0px 45px 45px;border-top: 4px dotted '+ DarkModeBackground + ';position:relative'">
                <!-- <span :style="'background-color:'+ DarkModeBackground + ';padding: 14px 15px;border-radius: 50%;position: absolute;bottom: 176px;left: -12px;'"></span>
                <span :style="'background-color:'+ DarkModeBackground + ';padding: 14px 15px;border-radius: 50%;position: absolute;top: -12px;right: -12px;'"></span> -->
                <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "หมายเลขคิวของคุณ" : "Your Number" }}</h5>
                <p :style="'color:#092C4C;font-size:' + Fontsize + 'px;'" class="text-center font-weight-black mt-n5 mb-n5">{{items.storeFrontQueue}}</p>
                <!-- <div style="display:flex;justify-content: center;" v-if="beforQueue !== 0">
                  <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "มีคิวก่อนหน้าคุณ" : "At the front of the queue" }}</h5>
                  <h5 style="color:#FFFFFF;background-color:#092C4C;min-height: 30px;width:30px;border-radius: 80px 80px 80px 80px;display: flex;justify-content: center;align-items: center;" class="text-center font-weight-black ml-2 mr-2 mt-2">{{beforQueue}}</h5>
                  <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "คิว" : "Queue" }}</h5>
                </div> -->
                <!-- <h5 style="color:#092C4C" class="text-center font-weight-bold mt-2">{{ languageSelect === 0 ? "ถึงคิวคุณแล้ว" : "You are in the queue" }}</h5> -->
              </v-sheet>
            </v-sheet>
            </v-col>
          </v-row>
        </template>
        </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import pdfMake from 'pdfmake'
import pdfFonts from '../../assets/custom-fonts.js' // 1. import custom fonts
// import moment from 'moment-timezone'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
  },
  computed: {
    colsWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '55'
        case 'sm': return '55'
        case 'md': return '55'
        case 'lg': return '60'
        case 'xl': return '80'
      }
    },
    colsWidth2 () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'xs'
        case 'sm': return 'sm'
        case 'md': return 'md'
        case 'lg': return 'lg'
        case 'xl': return 'xl'
      }
    }
  },
  watch: {
    // whenever question changes, this function will run
    colsWidth (newQuestion, oldQuestion) {
      // console.log('newnewnew', newQuestion, oldQuestion)
      this.Fontsize = newQuestion
    },
    colsWidth2 (newQuestion, oldQuestion) {
      // console.log('newnewnew', newQuestion, oldQuestion)
      this.DiSize = newQuestion
    }
  },
  data () {
    return {
      Fontsize: null,
      DiSize: null,
      setTimerCalendar: null,
      languageSelect: 0,
      DarkModeBackground: '#FFFFFF',
      validSearch: true,
      itemBooking: [],
      itemBookingUse: [],
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
      shop: [],
      // fieldNameEn: [{textTH: 'นวดคอ บ่า ไหล่', textEN: 'Nack & Shoulder  Massage'}, {textTH: 'นวดตอกเส้น', textEN: 'TOK  SEN MASSAGE'}, {textTH: 'นวดหินร้อน', textEN: 'HOT STONE MASSAGE'}],
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'จัดการ Queue',
          disabled: false,
          href: '/Master/BookingListQueue'
        }
      ],
      dialog: false,
      dialogAdd: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      search: '',
      shopName: '',
      headers: [
        { text: 'คิว', value: 'storeFrontQueue' },
        { text: 'วันที่นัดหมาย', value: 'dueDate' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        { text: 'จัดการข้อมูล', value: 'action', sortable: false, align: 'center' }
      ],
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
      }
    }
  },
  async mounted () {
    this.Fontsize = this.colsWidth
    await this.getDataFlow()
    await this.getDataBranch()
    this.setTime()
    this.getShop()
    this.$root.$on('closeSetTimeBookingMonitor', () => {
      // your code goes here
      this.closeSetTimeBookingMonitor()
    })
    this.dateStart = this.momenDate_1(new Date())
    this.clearTimeLoop()
    this.checkSearch()
  },
  beforeDestroy () {
    this.$root.$off('dataReturn')
  },
  methods: {

    async getShop () {
      this.shop = []
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.shop = rs
            this.shopName = rs[0].shopName
          } else {
            this.shopName = ''
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
    closeSetTimeBookingMonitor () {
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
    },
    checkSearch () {
      this.validate('SEARCH')
      setTimeout(() => this.searchBooking(), 500)
    },
    clearTimeLoop () {
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
      let _this = this
      this.setTimerCalendar = setInterval(function () { _this.searchBooking() }, 15000)
    },
    async searchBooking () {
      if (this.validSearch === true) {
        this.itemBooking = []
        // await this.getBookingDataList(this.dateStart)
        let urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&masBranchID=' +
            this.masBranchID +
            // '&flowId=' +
            // this.flowSelect +
            '&dueDate=' +
            this.dateStart + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
        // '&dueDate=' +
        // this.dateStart + ' ' + this.time + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
        await axios
          .get(urlApi)
          .then(async response => {
            console.log('getData', response.data)
            let rs = response.data
            if (rs.length > 0) {
              let sortData = rs.sort((a, b) => {
                if (a.storeFrontQueue < b.storeFrontQueue) return -1
                return a.storeFrontQueue > b.storeFrontQueue ? 1 : 0
              })
              for (let i = 0; i < sortData.length; i++) {
                let d = sortData[i]
                // if (this.BookingDataList[d.bookNo] !== undefined) {
                // d.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
                // d.serviceTH = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'บริการ')
                // d.serviceEN = this.getDataFromFieldNameEn(this.BookingDataList[d.bookNo], 'Service')
                // d.cusName = (d.cusName.length > 0) ? d.cusName[0].fieldValue : ''
                // d.serviceTH = (d.serviceTH.length > 0) ? d.serviceTH[0].fieldValue : ''
                // d.serviceEN = (d.serviceEN.length > 0) ? d.serviceEN[0].fieldValue : ''
                //   this.itemBooking.push(d)
                // }
                this.itemBooking.push(d)
              }
              this.itemBookingUse = this.itemBooking
            } else {
              this.itemBookingUse = []
            }
          })
      }
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
    async getBookingDataList (dateStart) {
      this.BookingDataList = []
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
      // let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}&flowId=${this.flowSelect}`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach((row) => {
              if (typeof (this.BookingDataList[row.bookNo]) === 'undefined') {
                this.BookingDataList[row.bookNo] = []
              }
              this.BookingDataList[row.bookNo].push(row)
            })
          }
        }).catch(error => {
          // this.dataEditReady = true
          setTimeout(() => this.getBookingDataList(dateStart), 3000)
          console.log('catch getBookingDataList : ', error)
        })
      console.log('this.BookingDataList1', this.BookingDataList)
    },
    setTime () {
      this.timeavailable = []
      let checkFlow = this.DataFlowItem.filter(el => { return el.value === this.flowSelect })
      if (checkFlow.length > 0) {
        this.timeavailable = JSON.parse(checkFlow[0].allData.setTime)
      } else {
        this.timeavailable = []
      }
    },
    async getDataFlow () {
      let resultOption = []
      await axios
        .get(this.DNS_IP + `/flow/get?shopId=${this.shopId}&storeFrontCheck=True`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.textEng = d.flowNameEn
              s.text = d.flowName
              s.value = d.flowId
              s.allData = d
              resultOption.push(s)
              // console.log('this.DataFlowName', this.DataFlowName)
            }
          } else {
            resultOption = []
          }
        })
      this.DataFlowItem = resultOption
      if (resultOption.length > 0) {
        this.flowSelect = this.DataFlowItem[0].value
      }
    },
    async getDataBranch () {
      // if (localStorage.getItem('BRANCH') === null) {
      //   let temp = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName')
      //   console.log(typeof temp)
      //   localStorage.setItem('BRANCH', JSON.stringify(temp))
      // }
      // this.branch = JSON.parse(localStorage.getItem('BRANCH'))
      this.branchItem = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName', '', 'masBranchNameEn')
      if (this.branchItem.length > 0) {
        this.masBranchID = this.branchItem[0].value
      }
    },
    async getDataFromAPI (url, fieldId, fieldName, param, fieldNameEn) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.shopId}${param}`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d[fieldName]
              if (fieldNameEn) {
                s.textEng = d[fieldNameEn]
              }
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
    async closeJobSubmit (item) {
      this.$swal({
        title: 'ให้บริการ เสร็จเรียบร้อยแล้ว ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#fa0202',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async response => {
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
            this.$swal('เรียบร้อย', 'นำเข้าสำเร็จ', 'success')
            await this.searchBooking()
            let bookSelect = this.itemBooking.filter((element, index) => { return index <= 2 })
            if (bookSelect.length > 0) {
              for (let i = 0; i < bookSelect.length; i++) {
                let d = bookSelect[i]
                let s = {}
                s.lineUserId = d.lineUserId || ''
                if (s.lineUserId !== '') {
                  await axios
                    .post(this.DNS_IP + '/Booking/pushMsgQueue/' + d.bookNo)
                    .then(async responses => {}).catch(error => {
                      console.log('error function pushMsgQueue : ', error)
                    })
                }
              }
            }
          })
      })
    },
    setPrint (item, language) {
      let docDefinition = {}
      if (language === 'th') {
        docDefinition = {
          pageSize: 'A4',
          content: [
            {
              text: this.shopName,
              style: 'header',
              alignment: 'center'
            },
            {
              text: '   ',
              style: 'header',
              widths: ['*']
            },
            {
              columns: [
                {
                  style: 'subheader',
                  text: 'วันที่'
                },
                {
                  style: 'subheader',
                  text: item.dueDateText.split(' ')[0],
                  alignment: 'right'
                }
              ]
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              columns: [
                {
                  style: 'subheader',
                  text: 'รับคิวเวลา'
                },
                {
                  style: 'subheader',
                  text: item.timeText,
                  alignment: 'right'
                }
              ]
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              alignment: 'center',
              style: 'tableExample',
              table: {
                heights: [70],
                widths: ['*'],
                body: [
                  [
                    {
                      text: [
                        {text: 'หมายเลขคิวของคุณ\n', fontSize: 20, color: 'white'},
                        {text: item.storeFrontQueue, fontSize: 150, color: 'white'}
                      ],
                      border: [false, false, false, false],
                      fillColor: '#092C4C'
                    }
                  ]
                ]
              }
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              text: '*ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
              fontSize: 15,
              alignment: 'center'
            }
          ],
          styles: {
            header: {
              fontSize: 28,
              bold: true
            },
            subheader: {
              fontSize: 25,
              bold: true
            },
            quote: {
              italics: true
            },
            small: {
              fontSize: 8
            },
            defaultStyle: {
              columnGap: 20
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            }
          },
          defaultStyle: { // 4. default style 'KANIT' font to test
            font: 'Kanit'
          }
        }
      } else {
        docDefinition = {
          pageSize: 'A4',
          content: [
            {
              text: this.shopName,
              style: 'header',
              alignment: 'center'
            },
            {
              text: '   ',
              style: 'header',
              widths: ['*']
            },
            {
              columns: [
                {
                  style: 'subheader',
                  text: 'Date'
                },
                {
                  style: 'subheader',
                  text: item.dueDateText.split(' ')[0],
                  alignment: 'right'
                }
              ]
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              columns: [
                {
                  style: 'subheader',
                  text: 'Time'
                },
                {
                  style: 'subheader',
                  text: item.timeText,
                  alignment: 'right'
                }
              ]
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              alignment: 'center',
              style: 'tableExample',
              table: {
                heights: [70],
                widths: ['*'],
                body: [
                  [
                    {
                      text: [
                        {text: 'Number\n', fontSize: 30, color: 'white'},
                        {text: item.storeFrontQueue, fontSize: 150, color: 'white'}
                      ],
                      border: [false, false, false, false],
                      fillColor: '#092C4C'
                    }
                  ]
                ]
              }
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              text: '* The company reserves the right to skip the queue. In the event that the customer does not come.',
              fontSize: 15,
              alignment: 'center'
            }
          ],
          styles: {
            header: {
              fontSize: 28,
              bold: true
            },
            subheader: {
              fontSize: 25,
              bold: true
            },
            quote: {
              italics: true
            },
            small: {
              fontSize: 8
            },
            defaultStyle: {
              columnGap: 20
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            }
          },
          defaultStyle: { // 4. default style 'KANIT' font to test
            font: 'Kanit'
          }
        }
      }
      pdfMake.vfs = pdfFonts.pdfMake.vfs // 2. set vfs pdf font
      pdfMake.fonts = {
        // download default Roboto font from cdnjs.com
        Roboto: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        },
        // Kanit Font
        Kanit: { // 3. set Kanit font
          normal: 'Kanit-Regular.ttf',
          bold: 'Kanit-Medium.ttf',
          italics: 'Kanit-Italic.ttf',
          bolditalics: 'Kanit-MediumItalic.ttf'
        }
      }
      // pdfMake.createPdf(docDefinition).open({}, window)
      pdfMake.createPdf(docDefinition).getDataUrl(function (outDoc) {
        document.getElementById('pdfV').src = outDoc
      })
      this.dialogPrint = true
    }
  }
}
</script>
<style scope>
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
</style>
