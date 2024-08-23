<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <!-- {{session.data}} -->
      </div>
        <v-row >
          <v-col cols="12">
                <div class="content">
                  <BarChart/>
                </div>
          </v-col>
           <v-col cols="12">
                <div class="content">
                  <LineChart/>
                </div>
          </v-col>
        </v-row>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'
import BarChart from '../Dashbord/BarPerfor.vue'
import LineChart from '../Dashbord/LinePerfor.vue'
// import moment from 'moment' // แปลง date

export default {
  // layout: 'Zoom',
  components: {
    'left-menu-admin': adminLeftMenu,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile,
    BarChart,
    LineChart
  },
  created () {
    // setInterval(this.getNow, 1000)
  },
  data () {
    return {
      PK: '',
      dataReady: true,
      dateTime: '', // Generate DateTime
      code: '', // Generate Code
      // Dialog Config ADD EDIT DELETE IMPORT
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogImport: false,
      // END Dialog Config ADD EDIT DELETE
      panel: [],
      panel1: [],
      session: this.$session.getAll(),
      // Search All
      searchAll: '',
      // Search Advanced
      search: {
        carName: '',
        carColor: ''
      },
      // End Search Advanced

      // Config Import
      columnsImport: [
      ],
      dataItemImportChecKHide: true,
      dataItemImport: [],
      // End Config Import

      // Form Config ADD EDIT
      formAdd: {
        carName: '',
        carModel: '',
        carColor: '',
        carYear: '',
        carPrice: ''
      },
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      formUpdate: {
      },
      // End Form Config ADD EDIT
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        }
      ],
      // End Menu Config
      // Data Table Config
      columns: [],
      dataItem: [],
      // End Data Table Config
      // Export Config
      exportType: 'xls',
      exportFileName: 'Home.xls',
      exportWorksheet: 'WorkSheet',
      export_fields: {
        carID: 'carID',
        carName: 'carName',
        carColor: 'carColor'
      },
      export_data: [],
      json_meta: [
        [
          {
            key: 'charset',
            value: 'utf-8'
          }
        ]
      ]
      // End Export Config
    }
  },
  async mounted () {
    // this.getGetToken(this.DNS_IP)
    console.log('ApplicationKey HRM', this.$session.getAll().ApplicationKey)
  },
  methods: {
    getNow () {
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
      const dateTime = date + ' ' + time
      this.dateTime = dateTime
      this.code = code
    },
    async getData () {
      // Clear Data ทุกครั้ง
      this.dataItem = []
      // Clear ข้อมูลใน Import
      this.dataItemImport = []
      // Clear ช่องค้นหา
      this.searchAll = ''

      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/master_car/get"
        )
        .then(async (response) => {
          console.log('getData', response.data)
          this.dataReady = true
          this.dataItem = response.data
          this.export_data = response.data
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log(error)
          this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          this.dataReady = true
        })
    },
    async getDataById (item) {
      this.PK = item.carID
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/master_car/get?carID=" + item.carID
        )
        .then(async (response) => {
          if (response.data) {
            this.formUpdate.carName = response.data[0].carName
            this.formUpdate.carColor = response.data[0].carColor
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log('error function getDataById : ', error)
        })
    },
    async addData () {
      console.log('form', JSON.stringify(this.formAdd))
      this.formAdd.CREATE_USER = this.$session.getAll().data.userName
      this.formAdd.LAST_USER = this.$session.getAll().data.userName
      this.$swal({
        title: 'ต้องการ เพิ่มข้อมูล ใช่หรือไม่?',
        type: 'warn',
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
              this.DNS_IP + "/master_car/add",
              this.formAdd
            )
            .then(async (response) => {
              // Debug response
              console.log('/master_car/add/', response)

              // Close Dialog
              this.dialogAdd = false

              // Load Data
              await this.getData()
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              console.log('error function addData : ', error)
              this.dataReady = true
            })
        })
        .catch((error) => {
          console.log('error function addData : ', error)
          this.dataReady = true
        })
    },
    async editData () {
      // Debug
      console.log('PK', this.PK)
      console.log('formUpdate', JSON.stringify(this.formUpdate))
      // End Debug

      // Config User ทำรายการล่าสุด
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName
      // End Config User ทำรายการล่าสุด

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
              this.DNS_IP + "/master_car/edit/" + this.PK,
              this.formUpdate
            )
            .then(async (response) => {
              // Debug response
              console.log('/master_car/edit/', response)

              // Close Dialog
              this.dialogEdit = false

              // Load Data
              await this.getData()
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              console.log('error function editData : ', error)
            })
        })
        .catch((error) => {
          console.log('error function editData : ', error)
        })
    },
    async deleteData () {
      console.log('PK', this.PK)
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName
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
              this.DNS_IP + "/master_car/delete/" + this.PK,
              this.formUpdate
            )
            .then(async (response) => {
              // Debug response
              console.log('/master_car/delete/', response)

              // Close Dialog
              this.dialogDelete = false

              // Load Data
              await this.getData()
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              console.log('error function deleteData : ', error)
            })
        })
        .catch((error) => {
          console.log('error function deleteData : ', error)
          this.dataReady = true
        })
    },
    async searchDataAll () {
      var search = '?carName=' + this.searchAll + '&carColor=' + this.searchAll
      this.dataReady = false
      this.dataItem = []
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/master_car/find_advanced" + search
        )
        .then(async (response) => {
          console.log(response.data)
          this.clearSearch()
          this.dataReady = true
          this.dataItem = response.data
          this.export_data = response.data
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log(error)
          this.clearSearch()
          this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          this.dataReady = true
          this.getData()
        })
    },
    async saerchDataAdvanced () {
      var search = ''
      for (var key in this.search) {
        console.log(key)

        if (this.search[key]) {
          if (search !== '') {
            search += '&'
          }
          search += key + '=' + this.search[key]
        }
      }
      console.log(search)

      this.dataReady = false
      this.dataItem = []
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/master_car/get?RECORD_STATUS=N&" + search
        )
        .then(async (response) => {
          console.log(response.data)
          this.clearSearch()
          this.dataReady = true
          this.dataItem = response.data
          this.export_data = response.data
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log(error)
          this.clearSearch()
          this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          this.dataReady = true
          this.getData()
        })
    },
    clearSearch () {
      // Clear Search All
      this.searchAll = ''
      // Clear Saerch Advanced
      for (var key in this.search) {
        this.search[key] = ''
      }
    },
    importData (event) {
      var input = event.target
      var reader = new FileReader()
      reader.onload = () => {
        var fileData = reader.result
        var wb = XLSX.read(fileData, { type: 'binary' })
        wb.SheetNames.forEach((sheetName) => {
          var rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
          console.log(rowObj)
          this.dataItemImport = rowObj
        })
        if (this.dataItemImport.length === 0) {
          alert('โปรดใส่ไฟล์ให้ถูกต้อง')
        } else {
          this.dataItemImportChecKHide = false
        }
      }

      reader.readAsBinaryString(input.files[0])
    },
    importDataApprove (action) {
      console.log('Action', action)
      var titleMsg = ''
      var checkError = false
      if (action === 'add') {
        titleMsg = 'ท่านต้องการ นำเข้าข้อมูลจากไฟล์นี้ ใช่หรือไม่'
      } else if (action === 'delete') {
        titleMsg = 'ท่านต้องการ ลบข้อมูลจากไฟล์นี้ ใช่หรือไม่'
      } else {
        titleMsg = 'ท่านต้องการ ปรับปรุงข้อมูลจากไฟล์นี้ ใช่หรือไม่'
      }

      this.$swal({
        title: titleMsg,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (result) => {
          for (var key in this.dataItemImport) {
            this.PK = this.dataItemImport[key].carID
            if (action === 'add') {
              console.log('add')
              await this.importDataAdd(this.dataItemImport[key])
              checkError = true
            } else {
              await axios
                .get(
                // eslint-disable-next-line quotes
                  this.DNS_IP + "/master_car/get?carID=" + this.dataItemImport[key].carID
                )
                .then(async (response) => {
                  if (action === 'update') {
                    await this.importDataUpdate(this.dataItemImport[key])
                    checkError = true
                  }
                  if (action === 'delete') {
                    await this.importDataDelete(this.dataItemImport[key])
                    checkError = true
                  }
                })
              // eslint-disable-next-line handle-callback-err
                .catch((error) => {
                  checkError = false

                  console.log('error /master_car/get?carID : ', error)
                })
            }
          }
          if (checkError === true) {
            await this.getData()
          } else {
            this.dataItemImport = []
            this.dataItemImportChecKHide = true
            alert('โปรดใส่ไฟล์ให้ถูกต้อง')
          }
        })
        .catch((error) => {
          console.log('error function importDataApprove : ', error)
          this.dataReady = true
        })
    },
    async importDataAdd (dt) {
      this.formAdd.carName = dt.carName
      this.formAdd.carColor = dt.carColor
      this.formAdd.LAST_USER = this.$session.getAll().data.userName
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/master_car/add",
          this.formAdd
        )
        .then(async (response) => {
          this.dialogImport = false
          // Debug response
          console.log('/master_car/add/', response)
        })
      // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          alert('โปรดใส่ไฟล์ให้ถูกต้อง', dt)
          console.log('error function importDataAdd addData : ', error)
          this.dataReady = true
        })
    },
    async importDataUpdate (dt) {
      this.formUpdate.carName = dt.carName
      this.formUpdate.carColor = dt.carColor
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/master_car/edit/" + dt.carID,
          this.formUpdate
        )
        .then(async (response) => {
          this.dialogImport = false
          // Debug response
          console.log('/master_car/edit/', response)
        })
      // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          alert('โปรดใส่ไฟล์ให้ถูกต้อง', dt)
          console.log('error function importDataUpdate : ', error)
        })
    },
    async importDataDelete (dt) {
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/master_car/delete/" + dt.carID,
          this.formUpdate
        )
        .then(async (response) => {
          this.dialogImport = false
          // Debug response
          console.log('/master_car/delete/', response)
        })
      // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          alert('โปรดใส่ไฟล์ให้ถูกต้อง', dt)
          console.log('error function importDataDelete : ', error)
        })
    }
  }
}
</script>
<style scope>
.main{
  background-color: #F5F5F5;
  border-radius: 1rem;
}
.content{
  padding: 1rem;
}
</style>
