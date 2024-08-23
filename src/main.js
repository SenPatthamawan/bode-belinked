// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vuetify from '@/plugins/vuetify'
import VueSweetAlert from 'vue-sweetalert'
import Swal from 'sweetalert2'
import VueSession from 'vue-session'
import VueMask from 'v-mask'
import 'bootstrap/dist/css/bootstrap.css'
// import vueXlsxTable from 'vue-xlsx-table'
import axios from 'axios' // api
import moment from 'moment-timezone' // แปลง date
// import moment from 'moment' // แปลง date
// import { PivotViewPlugin } from '@syncfusion/ej2-vue-pivotview'

import * as VueGoogleMaps from 'vue2-google-maps'
import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip'
import VueClipboard from 'vue-clipboard2'
import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: '98104331104-1vtghokkaevmou3r1qiajsuc4kmi0f29.apps.googleusercontent.com',
  scope: 'profile email openid https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
  prompt: 'consent'
  // prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.prototype.$firebase = window.firebase

Vue.use(VueCustomTooltip, {
  name: 'VueCustomTooltip',
  color: '#fff',
  background: '#000',
  borderRadius: 10,
  fontWeight: 900
})
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCnDosnYWNnKQxLbsI5Cy_iw_VC5oyc1Ck',
    libraries: 'places',
    region: 'TH',
    language: 'th'
  }
})

Vue.prototype.$profile_dev = {
  'displayName': 'Pamorn Trivorrarat',
  'pictureUrl': 'https://profile.line-scdn.net/0heYkOVB2MOnZGNizwjMlECTZmORxlR2NkYlMmRXNhZhF8USomP1knFSZjN0N9ACh1OlR9QnozbBNKJU0QWGDGQkEGZEF_AXkpall0lQ',
  // 'pictureUrl': 'https://profile.line-scdn.net/0hehdTWCiWOkdZLRKhl6VFEGVoNCouAzwPIUl2JX4pNnQnSHsUMRx8dCgoNCUmTS1BMRhzKHQpMyN9',
  'statusMessage': 'ใช้ไลน์อันนี้นะคร้าบ',
  'userId': 'Ud2e630e20bb8597b90d4908a46fbc4e9'
  // 'userId': 'Ubb981ed38ad6dd18734560d2203df255'
}

// Vue.use(PivotViewPlugin)

Vue.config.productionTip = false
Vue.use(Swal)
Vue.use(VueSweetAlert)
Vue.use(VueSession)
Vue.use(VueMask)
// Vue.use(vueXlsxTable, {rABS: false})

Vue.prototype.$omise_public_key = 'pkey_test_5pyxhrcj5hv0pb3azgd'
Vue.prototype.$liff_id_login = '1654154168-E3mxd54W'
Vue.prototype.$liff = window.liff
Vue.prototype.$OmiseCard = window.OmiseCard
Vue.config.productionTip = false
Vue.mixin({
  data: function () {
    return {
      shopNameData: {
        airmate: 'U59422b6ffb95aea0fd17b0b79bcc9895'
      },
      globalVar: 'global',
      DNS_IP: '',
      DNS_IP_Loyalty: '',
      DNS_IP_Betask: '',
      PK: '', // Primary Key
      ApplicationKey: '', // Token
      IPPotocalENV_Production: 'https://api-belinked.betaskthai.com',
      IPPotocalENV_ProductionBetask: 'https://customer-core.betaskthai.com',
      IPPotocalENV_ProductionLoyalty: 'https://api-beloyalty-productions.betaskthai.com',
      // IPPotocalENV_Developer: 'https://hw.api-belinked.betaskthai.com',
      IPPotocalENV_Developer: 'http://localhost:5001',
      // IPPotocalENV_Developer: 'http://localhost:5001',
      IPPotocalENV_DeveloperBetask: 'http://localhost:5006',
      IPPotocalENV_DeveloperLoyalty: 'http://localhost:5001',
      // IPPotocalENV_DeveloperLoyalty: 'https://api-beloyalty-productions.betaskthai.com',
      // IPPotocalENV_DeveloperLoyalty: 'http://localhost:5004',
      main_profile: {
        userLineuserId: 'U97a2b1814542579b9e5d7c1b891538ab',
        pictureUrl: 'https://profile.line-scdn.net/0hI98EFerAFhYFPD-Dk3VpQTl5GHtyEhBefVoNdiA_SSMtWFdIbV0KIiU9HCApCFUSbVxZJSZpSyQh',
        token: 'TU2c2a6a5eaf2a8f410404714bc8d05e035368ceafd65c028636a6e0a1558f255f9077bbce0fa8fe0feca559406f365a68'
      },
      dataItem: [],
      dataItemImport: [],
      export_data: [],
      searchAll: '',
      dataReady: true,
      monthNamesThai: ['', 'ม.ค', 'ก.พ', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค'],
      styleCloseBt: 'color:red;font-size:20px;'
    }
  },
  async mounted () {
    // console.log('process.env.NODE_ENV ', process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'development') {
      // this.DNS_IP = this.IPPotocalENV_Developer
      this.DNS_IP = this.IPPotocalENV_Production
      this.DNS_IP_Betask = this.IPPotocalENV_DeveloperBetask
      this.DNS_IP_Loyalty = this.IPPotocalENV_DeveloperLoyalty
    } else {
      this.DNS_IP = this.IPPotocalENV_Production
      this.DNS_IP_Betask = this.IPPotocalENV_ProductionBetask
      this.DNS_IP_Loyalty = this.IPPotocalENV_ProductionLoyalty
    }
  },
  methods: {
    async getDataLineConfig (shopId) {
      let dataLineConfig = []
      await axios.get(this.DNS_IP + '/lineconfig/get?shopId=' + shopId).then(response => {
        let rs = response.data
        if (rs.status === false) {
          dataLineConfig = {
            liffMainID: '1656581804-7KRQyqo5',
            liffBookingFormID: '1656581804-32mk7OgE',
            liffBookingFormEmpID: '1656581804-b09WBwkP',
            liffMainIDLoyalty: '1656906322-JN5MM8Ep',
            checkConfig: false
          }
        } else {
          dataLineConfig = rs[0]
        }
      }).catch((error) => {
        console.log(error)
        dataLineConfig = {
          liffMainID: '1656581804-7KRQyqo5',
          liffBookingFormID: '1656581804-32mk7OgE',
          liffBookingFormEmpID: '1656581804-b09WBwkP',
          liffMainIDLoyalty: '1656906322-JN5MM8Ep',
          checkConfig: false
        }
      })
      return dataLineConfig
    },
    formatNumber (value) {
      if (value && value !== 0) {
        console.log('valuevalue', value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return 0
      }
    },
    format_date (value) {
      if (value) {
        return moment(moment(new Date(value)), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        // return moment(String(value)).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    format_dateFUllTime (value) {
      if (value) {
        return moment(moment(new Date(value)), 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss')
        // return moment(String(value)).format('DD/MM/YYYY HH:mm:ss')
      }
    },
    format_dateNotime (value) {
      if (value) {
        return moment(moment(new Date(value), 'DD/MM/YYYY').toDate()).format('DD/MM/YYYY')
        // return moment(String(value)).format('DD/MM/YYYY')
      }
    },
    format_dateThai (value) {
      if (value) {
        // return moment(String(value)).format('DD') + ' ' + this.monthNamesThai[moment(String(value)).format('M')]
        return moment(moment(new Date(value), 'DD/MM/YYYY').toDate()).format('DD') + ' ' + this.monthNamesThai[moment(moment(new Date(value), 'DD/MM/YYYY').toDate()).format('M')]
      }
    },
    // YYYY-MM-DD
    momenDate_1 (value) {
      if (value) {
        // return moment(String(value)).format('YYYY-MM-DD')
        return moment(moment(new Date(value), 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
      }
    },
    // HH:MM:ss
    momenTime (value) {
      if (value) {
        // return moment(String(value)).format('HH:mm')
        return moment(moment(new Date(value), 'HH:mm').toDate()).format('HH:mm')
      }
    },
    momenDate_YYYY (value) {
      if (value) {
        return moment(String(value)).format('YYYY')
      }
    },
    momenDate_MM (value) {
      if (value) {
        return moment(String(value)).format('MM')
      }
    },
    getGetToken (DNS_IP) {
      this.ApplicationKey = ''
      axios
        .get(
        // eslint-disable-next-line quotes
          DNS_IP +
          '/system_token/getKey?tokenName=' + this.$session.getAll().AccessKey
        )
        .then(async (response) => {
          axios
            .get(
              // eslint-disable-next-line quotes
              DNS_IP +
              '/master_application/get?masApplicationName=HRM'
            )
            .then(async (response) => {
              this.ApplicationKey = response.data[0].masApplicationToken
              this.$session.set('ApplicationKey', response.data[0].masApplicationToken)
            })
          // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              // this.$router.push('/Core/LoginFailed')
              this.$router.push('/Core/Login?access=' + this.$session.getAll().AccessKey)
              console.log(error)
            })
        })
      // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          // this.$router.push('/Core/LoginFailed')
          console.log(error)
        })
    },
    getNowGlobal () {
      const today = new Date()
      // console.log(today)
      const date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate()
      const time =
        today.getHours() +
        ':' +
        today.getMinutes() +
        ':' +
        today.getSeconds() +
        ':' +
        today.getMilliseconds()
      const dateTime = date + ' ' + time
      return dateTime
    },
    generateCodeGlobal () {
      const today = new Date()
      // console.log(today)
      const code =
        today.getFullYear() +
        '' +
        (today.getMonth() + 1) +
        '' +
        today.getDate() +
        '' +
        today.getHours() +
        '' +
        today.getMinutes() +
        '' +
        today.getSeconds() +
        '' +
        today.getMilliseconds()
      return code
    },
    async getRunningCodeGlobal (DNS_IP, CODE) {
      var RUNCODE = ''
      const today = new Date()
      var DT = {
        runningCode: today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds() + '' + today.getMilliseconds(),
        runningName: CODE,
        runningYear: today.getFullYear(),
        runningMonth: (today.getMonth() + 1)
      }
      await axios
        .get(
          // eslint-disable-next-line quotes
          DNS_IP + '/system_running/' + "get?RECORD_STATUS=N&runningName=" + this.code +
          '&runningYear=' + today.getFullYear() +
          '&runningMonth=' + (today.getMonth() + 1),
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          console.log('getRunningCode', response.data[0])
          var rs = response.data[0]
          // console.log('Number;', rs.runningNumber)
          var number = Number(rs.runningNumber) + 1 // 1234
          // console.log('Convert : ', String(number))
          var str = String(number)
          var pad = '000'
          var ans = pad.substring(0, pad.length - str.length) + str
          // console.log('ANS : ', ans)
          //
          DT.runningNumber = ans
          //
          // console.log(DT)
          await axios
            .post(
              // eslint-disable-next-line quotes
              DNS_IP + '/system_running/' + "edit/" + rs.runningID,
              DT,
              {
                headers: {
                  'Application-Key': this.$session.getAll().ApplicationKey
                }
              }
            )
            .then(async (response) => {
              console.log('Success', rs.runningName + '' + rs.runningYear + '' + rs.runningMonth + '' + ans)
              RUNCODE = rs.runningName + '' + rs.runningYear + '' + rs.runningMonth + '' + ans
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              console.log('error function system_running : ', error)
            })
        })
        // eslint-disable-next-line handle-callback-err
        .catch(async (error) => {
          // console.log('ไม่พบข้อมูลให้เพิ่ม')
          //
          DT.runningNumber = '001'
          //
          console.log(JSON.stringify(DT))
          await axios
            .post(
              // eslint-disable-next-line quotes
              DNS_IP + '/system_running/' + "add",
              DT,
              {
                headers: {
                  'Application-Key': this.$session.getAll().ApplicationKey
                }
              }
            )
            .then(async (response) => {
              RUNCODE = DT.runningName + '' + DT.runningYear + '' + DT.runningMonth + '' + DT.runningNumber
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              console.log('error function system_running : ', error)
            })
        })
      return RUNCODE
    },
    async getDataGlobal (DNS_IP, PATH, shopId) {
      // Clear Data ทุกครั้ง
      this.dataItem = []
      // Clear ข้อมูลใน Import
      this.dataItemImport = []
      // Clear ช่องค้นหา
      this.searchAll = ''

      console.log('Test Global')

      await axios
        .get(
          // eslint-disable-next-line quotes
          DNS_IP + PATH + "get?shopId=" + shopId,
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          console.log('getData', response.data)
          this.dataReady = true
          this.dataItem = response.data
          this.export_data = response.data
          if (this.dataItem.length === 0 || this.dataItem.status === false) {
            this.dataItem = []
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log(error)
          this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          this.dataReady = true
        })
    },
    async getDataByIdGlobal (DNS_IP, PATH, FIELD_PK_NAME, id) {
      this.PK = id
      await axios
        .get(
          // eslint-disable-next-line quotes
          DNS_IP + PATH + "getID?" + FIELD_PK_NAME + "=" + id,
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          console.log('get id : ', response)
          this.dataReady = true
          if (response.data) {
            Object.assign(this.formUpdate, response.data)
            // delete this.formUpdate[FIELD_PK_NAME]
            delete this.formUpdate['LAST_DATE']
            delete this.formUpdate['CREATE_DATE']
            delete this.formUpdate['RECORD_STATUS']
            console.log('getDataById', this.formUpdate)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          this.dataReady = true
          console.log('error function getDataById : ', error)
        })
    },
    async addDataGlobal (DNS_IP, PATH, DT) {
      this.$swal({
        title: 'ต้องการ เพิ่มข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (result) => {
          await axios
            .post(
              // eslint-disable-next-line quotes
              DNS_IP + PATH + "add",
              DT,
              {
                headers: {
                  'Application-Key': this.$session.getAll().ApplicationKey
                }
              }
            )
            .then(async (response) => {
              // Debug response
              console.log('addDataGlobal DNS_IP + PATH + "add"', response)

              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              // Close Dialog
              this.dialogAdd = false

              // Load Data
              await this.getDataGlobal(DNS_IP, PATH)
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              console.log('error function addDataGlobal : ', error)
              this.dataReady = true
            })
        })
        .catch((error) => {
          console.log('error function addData : ', error)
          this.dataReady = true
        })
    },
    async editDataGlobal (DNS_IP, PATH, ID, DT) {
      this.$swal({
        title: 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (result) => {
          await axios
            .post(
              // eslint-disable-next-line quotes
              DNS_IP + PATH + "edit/" + ID,
              DT,
              {
                headers: {
                  'Application-Key': this.$session.getAll().ApplicationKey
                }
              }
            )
            .then(async (response) => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)

              this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
              // Close Dialog
              this.dialogEdit = false

              // Load Data
              await this.getDataGlobal(DNS_IP, PATH)
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              this.dataReady = true
              console.log('error function editDataGlobal : ', error)
            })
        })
        .catch((error) => {
          this.dataReady = true
          console.log('error function editDataGlobal : ', error)
        })
    },
    async deleteDataGlobal (DNS_IP, PATH, ID, shopId) {
      this.$swal({
        title: 'ต้องการ ลบข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#fa0202',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (result) => {
          await axios
            .post(
              // eslint-disable-next-line quotes
              DNS_IP + PATH + "delete/" + ID,
              this.formUpdate,
              {
                headers: {
                  'Application-Key': this.$session.getAll().ApplicationKey
                }
              }
            )
            .then(async (response) => {
              // Debug response
              console.log('DNS_IP + PATH + "delete/"', response)

              this.$swal('เรียบร้อย', 'ลบข้อมูลเรียบร้อย', 'success')
              // Close Dialog
              this.dialogDelete = false

              // Load Data
              await this.getDataGlobal(DNS_IP, PATH, shopId)
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              this.dataReady = true
              this.$swal('ผิดพลาด', 'ผิดพลาด -1', 'error')
              console.log('error function deleteDataGlobal : ', error)
            })
        })
        .catch((error) => {
          this.dataReady = true
          this.$swal('ผิดพลาด', 'ผิดพลาด -2', 'error')
          console.log('error function deleteDataGlobal : ', error)
        })
    },
    async searchDataAllGlobal (DNS_IP, PATH, DT) {
      this.dataReady = false
      this.dataItem = []
      await axios
        .get(
          // eslint-disable-next-line quotes
          DNS_IP + PATH + "find_advanced" + DT,
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          // Clear Search All
          this.searchAll = ''
          this.dataReady = true
          this.dataItem = response.data
          this.export_data = response.data
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log('error function searchDataAllGlobal : ', error)
          this.clearSearch()
          this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          this.dataReady = true
          this.getDataGlobal(DNS_IP, PATH)
        })
    },
    async saerchDataAdvancedGlobal (DNS_IP, PATH, DT) {
      this.dataReady = false
      this.dataItem = []
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + this.path + "get?RECORD_STATUS=N&" + DT,
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          console.log(response.data)
          this.dataReady = true
          this.dataItem = response.data
          this.export_data = response.data
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log('error function saerchDataAdvancedGlobal : ', error)
          this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          this.dataReady = true
          this.getDataGlobal(DNS_IP, PATH)
        })
    },
    async getDataFromAPI (url, fieldId, fieldName, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.session.data.shopId}${param}`)
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
            }
          } else {
            result = []
          }
        })
      return result
    }
  }
})
Vue.component('my-currency-input', {
  props: ['value'],
  template: `
          <input type="text" v-model="displayValue" @blur="isInputActive = false" @focus="isInputActive = true"/>
     `,
  data: function () {
    return {
      isInputActive: false
    }
  },
  computed: {
    displayValue: {
      get: function () {
        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          return this.value.toString()
        } else {
          // User is not modifying now. Format display value for user interface
          return this.value
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
        }
      },
      set: function (modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        // eslint-disable-next-line no-useless-escape
        let newValue = parseFloat(modifiedValue.replace(/[^\d\.]/g, ''))
        // Ensure that it is not NaN
        if (isNaN(newValue)) {
          newValue = 0
        }
        // Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
        // $emit the event so that parent component gets it
        this.$emit('input', newValue)
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  vuetify,
  router,
  components: { App },
  template: '<App/>'
})
