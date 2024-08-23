<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4 ">
        <v-row>
          <v-col cols="12"  class="text-left">
            <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
          </v-col>
        </v-row>
        <!-- <v-row>
            <v-col col="auto">
              <v-select
                v-model="masBranchID"
                background-color="white"
                style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                hide-details
                :items="dataBranch"
                label="สาขา"
                outlined
                dense
                ><template #prepend-inner>
                  <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                    mdi-map-marker-outline
                  </v-icon>
                </template>
              </v-select>
            </v-col>
            <v-col col="auto">
              <v-select
                style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                v-model="flowSelect"
                hide-details
                background-color="white"
                :items="dataFlow"
                label="ประเภทบริการ"
                outlined
                dense
              >
                <template #prepend-inner>
                  <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                    mdi-note-text-outline
                  </v-icon>
                </template>
              </v-select>
            </v-col>
          </v-row> -->
        <v-row>
          <v-col cols="12">
              <v-file-input
                accept=".xlsx,.csv,.xls"
                label="นำเข้าข้อมูล (xlsx)"
                outlined
                v-model="selectXlsx"
                show-size
                dense
                @change="uploadXlsx"
              >
              </v-file-input>
          </v-col>
          <!-- <v-col cols="4" v-if="dataInsert.length === 0">
            <v-btn
              color="primary"
              @click="uploadXlsx"
            >
              <v-icon
                left
                dark
              >
                mdi-cloud-upload
              </v-icon>
                นำเข้าข้อมูล
            </v-btn>
          </v-col> -->
          <v-col cols="12" class="text-center"  v-if="(dataInsert.length > 0) && dataReady">
            <v-btn
              color="success"
              @click="insertData()"
            >
              <v-icon
                left
                dark
              >
                mdi-plus-circle-multiple-outline
              </v-icon>
              นำเข้าข้อมูล
            </v-btn>
          </v-col>
          <!-- data table -->
         <v-col cols="12" v-if="dataInsert.length > 0">
            <v-card elevation="7" v-if="dataReady">
              <v-card-title>
                <v-text-field
                  v-model="searchAll2"
                  append-icon="mdi-magnify"
                  label="ค้นหา"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="columns"
                  :items="dataInsert"
                  :search="searchAll2"
                  disable-pagination
                  hide-default-footer
                >
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-overlay :value="!dataReady">
            <v-progress-circular
              indeterminate
              size="64"
            ></v-progress-circular>
          </v-overlay>
          <!-- end data table -->
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'
import VuetifyMoney from '../VuetifyMoney.vue'
import TheMask from 'vue-the-mask'
import moment from 'moment' // แปลง date

export default {
  components: {
    waitingAlert,
    'left-menu-admin': adminLeftMenu,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile,
    VuetifyMoney,
    TheMask
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  data () {
    return {
      masBranchID: '',
      flowSelect: '',
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'Import Data',
          disabled: false,
          href: '/Pepsi/ImportData'
        }
      ],
      // End Menu Config
      selectXlsx: null,
      searchAll2: '',
      dataReady: true,
      // customFildData: [{'text': 'Purchase Order Number', 'value': 20001}, {'text': 'Ship-to Party name', 'value': 20002}, {'text': 'Driver', 'value': 20003}],
      dataInsert: [],
      dataUpdate: [],
      dataBookingData: [],
      columns: [
        { text: 'Purchase Order Number', value: 'PurchaseOrderNumber' },
        { text: 'Trip no', value: 'Tripno' },
        { text: 'Queue no', value: 'QueueNo' },
        { text: 'Plan Start Load Date', value: 'PlanStartLoadDate' },
        { text: 'Day Shift', value: 'DayShift' },
        { text: 'Plan Start Load Time', value: 'PlanStartLoadTime' },
        { text: 'Round Shift', value: 'RoundShift' }
      ],
      dataFlow: [],
      dataBranch: [],
      dataCustomField: []
    }
  },
  async mounted () {
    // await this.getShowColunm()
    // this.getDataFlow()
    // this.getDataBranch()
    // this.getDataCustomField()
  },
  methods: {
    // async getDataBranch () {
    //   let result = []
    //   await axios
    //     .get(this.DNS_IP + `/master_branch/get?shopId=${this.$session.getAll().data.shopId}`)
    //     .then(response => {
    //       let rs = response.data
    //       if (rs.length > 0) {
    //         for (var i = 0; i < rs.length; i++) {
    //           let d = rs[i]
    //           let s = {}
    //           s.text = d.masBranchName
    //           s.value = d.masBranchID
    //           s.allData = d
    //           result.push(s)
    //         }
    //       } else {
    //         result = []
    //       }
    //     }).catch(error => {
    //       console.log('getDataBranch', error)
    //       result = []
    //     })
    //   this.dataBranch = result
    //   if (this.dataBranch.length === 1) {
    //     this.masBranchID = result[0].value
    //   }
    // },
    // async getDataCustomField () {
    //   let result = []
    //   await axios
    //     .get(this.DNS_IP + '/customField/get?shopId=' + this.$session.getAll().data.shopId)
    //     .then(response => {
    //       let rs = response.data
    //       if (rs.length > 0) {
    //         for (var i = 0; i < rs.length; i++) {
    //           let d = rs[i]
    //           let s = {}
    //           s.text = d.fieldName
    //           s.value = d.fieldId
    //           s.allData = d
    //           result.push(s)
    //         }
    //       } else {
    //         result = []
    //       }
    //     }).catch(error => {
    //       console.log('getDataCustomField', error)
    //       result = []
    //     })
    //   this.dataCustomField = result
    // },
    // async getDataFlow () {
    //   let result = []
    //   await axios
    //     .get(this.DNS_IP + `/flow/get?shopId=${this.$session.getAll().data.shopId}`)
    //     .then(response => {
    //       let rs = response.data
    //       if (rs.length > 0) {
    //         for (var i = 0; i < rs.length; i++) {
    //           let d = rs[i]
    //           let s = {}
    //           s.text = d.flowName
    //           s.value = d.flowId
    //           s.allData = d
    //           result.push(s)
    //         }
    //       } else {
    //         result = []
    //       }
    //     }).catch(error => {
    //       console.log('getDataFlow', error)
    //       result = []
    //     })
    //   this.dataFlow = result
    //   if (this.dataFlow.length === 1) {
    //     this.flowSelect = result[0].value
    //   }
    // },
    async uploadXlsx () {
      if (!this.selectXlsx) {
        console.log('Please upload a xlsx file')
        return
      }
      if (this.selectXlsx) {
        let dataColunm = await this.getShowColunm()
        console.log('dataColunm', dataColunm)
        var input = this.selectXlsx
        var reader = new FileReader()
        var rowObj = null
        reader.onload = () => {
          var fileData = reader.result
          var wb = XLSX.read(fileData, { type: 'binary', cellDates: true })
          wb.SheetNames.forEach(async sheetName => {
            if (XLSX.utils.sheet_to_json(wb.Sheets[sheetName]).length > 0) {
              rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
              console.log('rowObj', rowObj)
              let dataDate = []
              let noCountQ = 0
              for (let i = 0; i < rowObj.length; i++) {
                let d = rowObj[i]
                let s = {}
                Object.entries(d).forEach(entry => {
                  const [key, value] = entry
                  let keyFix = key.split('/').join('').split(' ').join('').split('-').join('').split('.').join('')
                  // let keyFix = key.replace(/-/g, '').replace(/ /g, '').replace(/./g, '').replace(/\//g, '')
                  // console.log(keyFix, value)
                  let findColunm = dataColunm.filter(el => { return el.Field === keyFix })
                  if (findColunm.length > 0) {
                    if (keyFix === 'CreatedDate' || keyFix === 'PlanDeliveryDate' || keyFix === 'PlanDepartDate' || keyFix === 'PlanPickDate' || keyFix === 'PlanStartLoadDate' || keyFix === 'Updated_Date') {
                      if (value) {
                        if (typeof value === 'string') {
                          let day = value.split('/')[0]
                          let month = value.split('/')[1]
                          let year = value.split('/')[2]
                          s[keyFix] = year + '-' + (parseInt(month) + 100).toString().substring(1, 3) + '-' + (parseInt(day) + 100).toString().substring(1, 3)
                        } else {
                          s[keyFix] = this.momenDate_1(value)
                        }
                      } else {
                        s[keyFix] = ''
                      }
                    } else if (keyFix === 'Created_Time' || keyFix === 'InformDriverTime' || keyFix === 'PlanDeliveryTime' || keyFix === 'PlanDepartTime' || keyFix === 'PlanFinishLoadTime' || keyFix === 'PlanPickTime' || keyFix === 'PlanStartLoadTime' || keyFix === 'Updated_Time') {
                      s[keyFix] = this.momenTime(value)
                    } else {
                      s[keyFix] = value
                    }
                  }
                })
                if (s !== {}) {
                  if (dataDate.filter(el => { return el.Tripno === s.Tripno }).length === 0) {
                    noCountQ = noCountQ + 1
                    s.QueueNo = 'A' + (noCountQ + 1000).toString().substring(1, 5)
                  } else {
                    s.QueueNo = ''
                  }
                  if (s.PlanStartLoadTime) {
                    if (s.PlanStartLoadTime < '07:59:59') {
                      s.DayShift = moment(moment(new Date(s.PlanStartLoadDate), 'YYYY-MM-DD').add(-1, 'days')).format('YYYY-MM-DD')
                    } else {
                      s.DayShift = s.PlanStartLoadDate
                    }
                    if (this.isTimeInRange(parseInt(s.PlanStartLoadTime.split(':')[0]))) {
                      s.RoundShift = 'Night'
                    } else {
                      s.RoundShift = 'Day'
                    }
                  } else {
                    s.RoundShift = ''
                    s.DayShift = ''
                  }
                  // if (parseInt(s.PlanStartLoadTime.split(':')[0]) >= 20 && parseInt(s.PlanStartLoadTime.split(':')[0]) <= 7) {
                  //   s.RoundShift = 'Night'
                  // } else {
                  //   s.RoundShift = 'Day'
                  // }
                  dataDate.push(s)
                }
              }
              console.log('dataDate', dataDate)
              this.dataInsert = dataDate
            }
          })
        }
        reader.readAsBinaryString(input)
      }
      this.selectXlsx = null
    },
    isTimeInRange (currentHour) {
      // Check if current time is between 20:00 and 23:59
      if (currentHour >= 20 && currentHour <= 23) {
        return true
      }

      // Check if current time is between 00:00 and 07:59
      if (currentHour >= 0 && currentHour <= 7) {
        return true
      }

      return false
    },
    async getShowColunm () {
      let dataReturn = []
      let url = `${this.DNS_IP}/importData_Pepsico/getColunm`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            dataReturn = response.data
          } else {
            dataReturn = []
          }
        }).catch(error => {
          dataReturn = []
          console.log('catch getShowColunm : ', error)
        })
      return dataReturn
    },
    async getBookingDataInDate (dateSearch) {
      this.dataBookingData = []
      for (let i = 0; i < dateSearch.length; i++) {
        let d = dateSearch[i]
        let url = `${this.DNS_IP}/BookingData/get?shopId=${this.$session.getAll().data.shopId}&dueDate=${d.dueDate}&flowId=${this.flowSelect}&masBranchID=${this.masBranchID}`
        await axios
          .get(url)
          .then(async response => {
            if (response.data.status !== false) {
              for (let i = 0; i < response.data.length; i++) {
                let d = response.data[i]
                this.dataBookingData.push(d)
              }
            }
            console.log('this.dataBookingData', this.dataBookingData)
          }).catch(error => {
          // this.dataEditReady = true
            // setTimeout(() => this.getBookingDataInDate(dateSearch), 3000)
            console.log('catch getBookingDataInDate : ', error)
          })
      }
    },
    formateInsert (rowObj) {
      console.log(rowObj)
      let dataFormate = []
      let dataFormateUpdate = []
      this.dataInsert = []
      this.dataUpdate = []
      let headerText = Object.keys(rowObj[0])
      for (let i = 0; i < rowObj.length; i++) {
        let d = rowObj[i]
        if (this.dataBookingData.filter(el => { return el.fieldValue === d['Purchase Order Number'] }).length === 0) {
          let s = {}
          s.roderNo = d['Purchase Order Number']
          s.service = 'Out'
          // s.service = d['Service']
          s.dueDate = this.momenDate_1(d['Plan Delivery Date']) + ' ' + this.momenTime(d['Plan Delivery Time'])
          s.timeText = this.momenTime(d['Plan Delivery Time'])
          s.timeSelect = this.momenTime(d['Plan Delivery Time'])
          s.flowId = this.flowSelect
          s.masBranchID = this.masBranchID
          s.flowName = this.dataFlow.filter(el => { return el.value === s.flowId })[0].text
          s.masBranchName = this.dataBranch.filter(el => { return el.value === s.masBranchID })[0].text
          s.userId = 'data import'
          s.statusBookingForm = 'BookingForm'
          s.storeFrontCheck = 'True'
          s.adminLogin = this.$session.getAll().data.userName
          s.shopId = this.$session.getAll().data.shopId
          // Show table
          s.shipTo = d['Ship-to Party name']
          s.driver = d['Driver']
          // --------
          s.data = []
          for (let i = 0; i < headerText.length; i++) {
            let x = headerText[i]
            if (this.dataCustomField.filter(el => { return el.text === x }).length > 0) {
              if (x !== 'Service') {
                s.data.push({'fieldId': this.dataCustomField.filter(el => { return el.text === x })[0].value, 'fieldValue': d[x]})
              }
            }
          }
          s.data.push({'fieldId': 8, 'fieldValue': 'Out'})
          // s.data = [
          //   {'fieldId': 3, 'fieldValue': d['Purchase Order Number']},
          //   {'fieldId': 4, 'fieldValue': d['Ship-to Party name']},
          //   {'fieldId': 5, 'fieldValue': d['Driver']}
          // ]
          dataFormate.push(s)
        } else {
          let s = {}
          s.bookNo = this.dataBookingData.filter(el => { return el.fieldValue === d['Purchase Order Number'] })[0].bookNo
          s.dueDate = this.momenDate_1(d['Plan Delivery Date']) + ' ' + this.momenTime(d['Plan Delivery Time'])
          s.timeText = this.momenTime(d['Plan Delivery Time'])
          s.timeSelect = this.momenTime(d['Plan Delivery Time'])
          s.flowId = this.flowSelect
          s.masBranchID = this.masBranchID
          s.LAST_USER = this.$session.getAll().data.userName
          s.CREATE_USER = this.$session.getAll().data.userName
          // --------
          s.data = []
          for (let i = 0; i < headerText.length; i++) {
            let x = headerText[i]
            let checkdataCustomField = this.dataCustomField.filter(el => { return el.text === x })
            if (checkdataCustomField.length > 0) {
              if (x !== 'Service') {
                let checkBookingDataNo = this.dataBookingData.filter(el => { return el.bookNo === s.bookNo && parseInt(el.fieldId) === checkdataCustomField[0].value })
                if (checkBookingDataNo.length > 0) {
                  s.data.push({'bookingDataId': checkBookingDataNo[0].bookingDataId, 'fieldId': checkdataCustomField[0].value, 'fieldValue': d[x]})
                } else {
                  s.data.push({'bookingDataId': 'newDataBooking', 'fieldId': checkdataCustomField[0].value, 'fieldValue': d[x]})
                }
              }
            }
          }
          // s.data.push({'fieldId': 8, 'fieldValue': 'Out'})
          dataFormateUpdate.push(s)
        }
      }
      console.log('dataFormateUpdate', dataFormateUpdate)
      if (dataFormate.length > 0) {
        this.dataInsert = dataFormate
      } else {
        this.dataInsert = []
        this.selectXlsx = null
        // console.log('ไม่มีข้อมูล ลงทะเบียนซ้ำไปแล้ว')
        // this.$swal('ผิดพลาด', 'ลงทะเบียนซ้ำไปแล้ว', 'error')
      }
      if (dataFormateUpdate.length > 0) {
        this.dataUpdate = dataFormateUpdate
      } else {
        this.dataUpdate = []
        this.selectXlsx = null
        // console.log('ไม่มีข้อมูล ลงทะเบียนซ้ำไปแล้ว')
        // this.$swal('ผิดพลาด', 'ลงทะเบียนซ้ำไปแล้ว', 'error')
      }
    },
    insertData () {
      this.dataReady = false
      if (this.dataInsert.length > 0) {
        axios
          .post(
          // eslint-disable-next-line quotes
            this.DNS_IP + "/importData_Pepsico/addImport",
            this.dataInsert
          )
          .then(async response => {
            console.log(response.data)
            this.dataInsert = []
            // this.updateData()
            this.dataReady = true
            this.selectXlsx = null
            this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
          // }
          })
      } else {
        // this.updateData()
        this.$swal('ผิดพลาด', 'ลองอีกครั้ง', 'error')
      }
    },
    updateData () {
      // this.dataReady = false
      axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/bookingPepsi/editImport",
          this.dataUpdate
        )
        .then(async response => {
          console.log(response.data)
          // if (response.data.status) {
          this.dataReady = true
          this.selectXlsx = null
          this.dataUpdate = []
          this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
          // }
        })
    }
  }
}
</script>
<style scope>
</style>
