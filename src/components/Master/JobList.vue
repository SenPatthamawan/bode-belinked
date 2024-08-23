<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
        </v-row>
        <!-- select flow-->
        <v-row>
          <v-col cols="12">
        <v-sheet tile height="54" class="d-flex">
          <!-- ประเภทบริการ -->
          <v-col cols="12" sm="4">
          <v-select
            :items="DataFlowName"
            v-model="searchFlowId"
            dense
            outlined
            hide-details
            label="ประเภทบริการ"
            class="ma-2"
          ></v-select>
          </v-col>
          <!-- สาขา -->
          <!-- <v-col cols="12" sm="4">
          <v-select
            :items="DataBranchName"
            v-model="masBranchName"
            dense
            outlined
            hide-details
            label="สาขา"
            class="ma-2"
          ></v-select>
          </v-col> -->
          <v-col cols="12" sm="4">
          <v-btn
            color="#173053"
            @click="searchData()"
          >
            <v-icon left>mdi-database-search</v-icon>
            ค้นหา
          </v-btn>
          </v-col>
        </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <!-- edit -->
          <v-dialog v-model="dialogEdit" persistent max-width="30%">
            <v-card class="text-center">
              <v-card-title>นำเข้าตารางงาน</v-card-title>
              <v-form ref="form_update" v-model="validUpdate" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-col v-for="(item , indexitem) in JobDataItem" :key="indexitem" cols="12">
                      {{item.fieldName}} : {{item.fieldValue}}
                    </v-col>
                    <v-col cols='12'>
                      <v-select
                        outlined
                        dense
                        v-model="stepId"
                        :items="stepItemSelete"
                        label="ขั้นตอนต่อไป"
                        :rules="[rules.required]"
                        ></v-select>
                    </v-col>
                    <v-col cols='12'>
                      <v-autocomplete
                      outlined
                      dense
                      v-model="empStep"
                      :items="empSeleteStep"
                      :rules="[rules.required]"
                      label="ชื่อ คนรับผิดชอบ"
                      ></v-autocomplete>
                    </v-col>
                  </v-container>
                </v-card-text>
              </v-form>
              <v-card-actions id="v-step-3">
                <v-col id="margin">
                  <v-row justify="center">
                    <v-btn
                      elevation="2"
                      small
                      color="#173053"
                      :disabled="!validUpdate"
                      @click="changDataJob()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      เปลี่ยนสถานะ
                    </v-btn>
                    <v-btn
                        small
                        color="red"
                        @click=";(dialogEdit = false)"
                      >
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                  </v-row>
                </v-col>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end -->
          <!-- data table -->
          <v-col cols="12">
            <v-card elevation="7" v-if="dataReady">
              <v-card-title>
                <v-text-field
                  v-model="searchAll2"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="columns"
                  :items="dataItem"
                  :search="searchAll2"
                  :items-per-page="10"
                >
                  <template v-slot:[`item.CREATE_DATE`]="{ item }">
                    {{ format_dateNotime(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                    {{ format_dateNotime(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.dueDate`]="{ item }">
                    {{ format_date(item.dueDate) }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      color="question"
                      fab
                      id="v-step-2"
                      small
                      @click.stop="
                        (dialogEdit = true),
                          getJobData(item),
                          validate('UPDATE');
                      "
                    >
                      <v-icon dark> mdi-account-convert </v-icon>
                    </v-btn>
                    <v-btn
                      color="red"
                      dark
                      fab
                      small
                      @click.stop="(dialogDelete = true), getDataById(item);"
                    >
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
            <div v-if="!dataReady" class="text-center">
              <waitingAlert></waitingAlert>
            </div>
          </v-col>
          <!-- end data table -->
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import draggable from 'vuedraggable'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'

export default {
  name: 'JobList',
  components: {
    waitingAlert,
    draggable,
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
  },
  data () {
    return {
      Layout: [],
      dataReady: false,
      menuDate: false,
      date: '',
      time: '',
      session: this.$session.getAll(),
      fieldNameItem: [],
      DataflowId: '',
      masBranchName: '',
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'เพิ่ม/ลบ กระดานการทำงาน',
          disabled: false,
          href: '/Master/JobList'
        }
      ],
      DataBranchName: [],
      DataFlowName: [],
      // Data Table Config
      searchAll2: '',
      columns: [
        { text: 'Job No.', value: 'jobNo' },
        { text: 'ชื่อบริการ', value: 'flowName' },
        { text: 'ขั้นตอนการทำงาน', value: 'stepTitle' },
        // { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        // { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
        { text: 'จัดการ', value: 'action', sortable: false, align: 'center' }
      ],
      dataItem: [],
      stepItemSelete: [],
      JobDataItem: [],
      allJob: [],
      empSeleteStep: [],
      searchFlowId: '',
      empStep: '',
      stepId: '',
      stepIdOld: '',
      flowId: '',
      jobId: '',
      // End Data Table Config
      formAdd: {
        bookingId: null,
        fieldId: '',
        fieldValue: '',
        flowId: null,
        masBranchID: null,
        dueDate: '',
        shopId: this.$session.getAll().data.shopId
      },
      formUpdate: {
        stepId: '',
        flowId: '',
        flowName: '',
        stepTitle: '',
        sortNo: '',
        CREATE_USER: '',
        LAST_USER: '',
        endDate: '',
        jobId: '',
        empStep: '',
        departmentStep: '',
        branchStep: ''
      },
      validUpdate: true,
      validAdd: true,
      // Dialog Config ADD EDIT DELETE IMPORT
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
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
    // this.dataReady = false
    this.getDataFlow()
    this.getDataBranch()
    this.getEmpSelect()
    this.searchData()
  },
  methods: {
    validate (Action) {
      switch (Action) {
        case 'ADD':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_add.validate()
          })
          break
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
    async getStepFlow () {
      this.stepItemSelete = []
      await axios
        .get(this.DNS_IP + '/flowStep/get?flowId=' + this.flowId)
        .then(async response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.stepTitle
              d.value = d.stepId
              this.stepItemSelete.push(d)
            }
            console.log('stepItemSelete', this.stepItemSelete)
          }
        })
    },
    async getEmpSelect () {
      this.empSeleteStep = []
      await axios
        .get(this.DNS_IP + '/empSelect/getSelect?shopId=' + this.session.data.shopId)
        .then(async response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              var s = {}
              s.text = d.empFirst_NameTH + ' ' + d.empLast_NameTH
              s.value = d.empFirst_NameTH
              this.empSeleteStep.push(s)
            }
            console.log('empSeleteStep', this.empSeleteStep)
          }
        })
    },
    async getDataFlow () {
      this.DataFlowName = []
      // console.log('DataFlowName', this.DataFlowName)
      axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.session.data.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.flowName
              s.value = d.flowId
              this.DataFlowName.push(s)
              // console.log('this.DataFlowName', this.DataFlowName)
            }
            this.dataReady = true
          } else {
            this.DataFlowName = []
          }
        })
    },
    async getDataBranch () {
      this.DataBranchName = []
      // console.log('branch', this.branch)
      axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.session.data.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.masBranchName
              s.value = d.masBranchID
              this.DataBranchName.push(s)
              // console.log('dtdtdtdt', this.branch)
            }
          } else {
            this.DataBranchName = []
          }
        })
    },
    async getJobList () {
      // Clear Data ทุกครั้ง
      this.dataItem = []
      // Clear ช่องค้นหา
      this.searchAll2 = ''
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/flowStep/get?shopId=" + this.session.data.shopId
        )
        .then(async response => {
          console.log('getData', response.data)
          this.dataReady = true
          this.dataItem = response.data
          if (this.dataItem.length === 0 || this.dataItem.status === false) {
            this.dataItem = []
            // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log(error)
          this.dataReady = true
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
        })
    },
    async searchData () {
      this.dataReady = false
      this.dataItem = []
      await axios
        .get(this.DNS_IP + '/job/getList?flowId=' + this.searchFlowId + '&shopId=' + this.session.data.shopId)
        .then(async response => {
          this.dataItem = response.data
          console.log('searchData', response.data)
          this.dataReady = true
        })
    },
    async getJobData (dt) {
      this.JobDataItem = []
      await axios
        .get(this.DNS_IP + '/jobData/get?jobNo=' + dt.jobNo)
        .then(async (response) => {
          let rs = response.data
          if (response.data) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.shopId = this.session.data.shopId
              d.userName = this.$session.getAll().data.userName
              this.JobDataItem.push(d)
            }
            this.flowId = rs[0].flowId
            this.jobId = rs[0].jobId
            this.stepId = rs[0].stepId
            this.stepIdOld = rs[0].stepId
            this.getStepFlow()
            console.log('JobDataItem', this.JobDataItem)
          }
        })
    },
    changDataJob () {
      if (this.stepIdOld !== this.stepId) {
        console.log('stepTitle', this.stepId, this.stepIdOld)
        this.dataReady = false
        this.$swal({
          title: 'ต้องการ แก้ไขสถานะ ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        })
          .then(async (result) => {
            var dt = {
              stepId: this.stepId,
              empStep: this.empStep
            }
            var ID = this.jobId
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + "/job/edit/" + ID,
                dt
              )
              .then(async (response) => {
              // Debug response
                console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
                this.dialogEdit = false
                this.$swal('เรียบร้อย', 'แก้ไขสถานะ เรียบร้อย', 'success')
                this.searchData()
              })
          })
      } else {
        this.$swal('ผิดพลาด', 'ขั้นตอนที่ท่านเลือกช้ำกับตอนแรก', 'error')
      }
    },
    clearDataAdd () {
      this.date = ''
      this.time = ''
      this.fieldNameItem = []
      this.DataflowId = ''
      this.formAdd.bookingId = null
      this.formAdd.fieldId = ''
      this.formAdd.fieldValue = ''
      this.formAdd.flowId = null
      this.formAdd.masBranchID = null
      this.formAdd.dueDate = ''
      this.formAdd.shopId = this.$session.getAll().data.shopId
      this.dialogAdd = false
    },
    async getDataById (dt) {
      if (dt) {
        Object.assign(this.formUpdate, dt)
        delete this.formUpdate['RECORD_STATUS']
        console.log('getDataById', this.formUpdate)
      }
    },
    async deleteDataGlobal () {
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
          this.formUpdate.LAST_USER = this.$session.getAll().data.userName
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/BookingData/delete/" + this.formUpdate.bookingDataId,
              this.formUpdate
            )
            .then(async (response) => {
              // Debug response
              console.log('DNS_IP + PATH + "delete/"', response)
              console.log('status', status)

              this.$swal('เรียบร้อย', 'ลบข้อมูลเรียบร้อย', 'success')
              // Close Dialog
              this.dialogDelete = false

              // Load Data
              if (status !== '') {
                await this.getDataFlow()
              }
              if (status === '') {
                await this.getDataFlow()
              }
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              this.dataReady = true
              this.$swal('ผิดพลาด', 'ผิดพลาด -1', 'error')
              console.log('error function deleteDataGlobal : ', error)
            //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
            })
        })
        .catch((error) => {
          this.dataReady = true
          this.$swal('ผิดพลาด', 'ผิดพลาด -2', 'error')
          console.log('error function deleteDataGlobal : ', error)
        })
    }
  }
}
</script>
