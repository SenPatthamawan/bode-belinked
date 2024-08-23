<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
          </v-col>
          <v-col cols="6" class="v-margit_button text-right">
            <v-btn
              color="primary"
              depressed
              @click="(dialogAdd = true), validate('ADD')"
            >
              <v-icon left>mdi-text-box-plus</v-icon>
              เพิ่มรายการบริการ
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- ADD -->
          <v-dialog v-model="dialogAdd" persistent max-width="35%">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-form ref="form_add" v-model="valid_add" lazy-validation>
                    <v-row>
                    <v-col cols="8" class="text-left pt-10">
                    <h3><strong>เพิ่มรายการบริการ</strong></h3>
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
                        @click="(dialogAdd = false), clearData()"
                        >
                        X
                        </v-btn>
                    </div>
                    </v-col>
                </v-row>
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          dense
                          label="ชื่อรายการ"
                          v-model="formAdd.serviceName"
                          :rules="nameRules"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <VuetifyMoney
                          v-model="formAdd.servicePrice"
                          placeholder="ค่าใช้จ่าย"
                          dense
                          label="ค่าใช้จ่าย"
                          required
                          outlined
                          :rules="nameRules"
                          v-bind:options="options2"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="2"
                  block
                  color="#173053"
                  dark
                  large
                  :disabled="!valid_add"
                  @click="addData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึก
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end add -->

          <!-- edit -->
          <v-dialog v-model="dialogEdit" persistent max-width="35%">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-form ref="form_update" v-model="valid_update" lazy-validation>
                    <v-row>
                      <v-col cols="8" class="text-left pt-10">
                      <h3><strong>แก้ไขข้อมูล</strong></h3>
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
                            @click="(dialogEdit = false), (dataReady = true)"
                            >
                            X
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          dense
                          label="ชื่อรายการ"
                          v-model="formUpdate.serviceName"
                          :rules="nameRules"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <VuetifyMoney
                          v-model="formUpdate.servicePrice"
                          placeholder="ค่าใช้จ่าย"
                          dense
                          label="ค่าใช้จ่าย"
                          required
                          outlined
                          :rules="nameRules"
                          v-bind:options="options2"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="2"
                  block
                  color="#173053"
                  dark
                  large
                  :disabled="!valid_update"
                  @click="editData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึก
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end edit -->

          <v-dialog v-model="dialogDelete" persistent max-width="35%">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="8" class="text-left pt-10">
                    <h3><strong>ลบข้อมูลนี้</strong></h3>
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
                        @click="(dialogDelete = false), (dataReady = true)"
                        >
                        X
                        </v-btn>
                    </div>
                    </v-col>
                </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        dense
                        label="ชื่อรายการ"
                        v-model="formUpdate.serviceName"
                        outlined
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-btn
                        elevation="2"
                        large
                        color="#173053"
                        dark
                        block
                        @click="deleteData()"
                      >
                        <!-- <v-icon left> mdi-cancel</v-icon> -->
                        ลบ
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- end delete -->

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
                    {{ format_date(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.servicePrice`]="{ item }">
                    {{ item.servicePrice ? item.servicePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0' }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                    {{ format_date(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      color="question"
                      fab
                      dark
                      small
                      @click.stop="
                        (dialogEdit = true),
                          getDataById(item),
                          validate('UPDATE')
                      "
                    >
                      <v-icon dark> mdi-tools </v-icon>
                    </v-btn>
                    <v-btn
                      color="red"
                      dark
                      fab
                      small
                      @click.stop="(dialogDelete = true), getDataById(item)"
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
import adminLeftMenu from '../Sidebar.vue' // เมนู
import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'
import VuetifyMoney from '../VuetifyMoney.vue'
import TheMask from 'vue-the-mask'
// import moment from 'moment' // แปลง date

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
  data () {
    return {
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },
      picker: null,
      date2: null,
      activePicker: 'MONTH',
      PK: '',
      path: '/serviceList/', // Path Model
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'ประเภทบริการ',
          disabled: false,
          href: '/Master/ServiceType'
        }
      ],
      // End Menu Config
      dataReady: true,
      dateTime: '', // Generate DateTime
      date: this.momenDate_1(new Date()),
      valid_add: true,
      valid_update: true,
      // Dialog Config ADD EDIT DELETE IMPORT
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      // END Dialog Config ADD EDIT DELETE
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      // Search All
      searchAll: '',
      searchAll2: '',
      formAdd: {
        serviceName: '',
        servicePrice: 0,
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: '',
        LAST_USER: ''
      },
      formUpdate: {
        id: '',
        serviceName: '',
        servicePrice: 0,
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: '',
        LAST_USER: ''
      },
      nameRules: [
        v => !!v || 'กรุณากรอก'
        // v => v.length <= 50 || 'Name must be less than 50 characters'
      ],
      // End Form Config ADD EDIT
      // Data Table Config
      columns: [
        { text: 'ชื่อรายการ', value: 'serviceName' },
        { text: 'ค่าใช้จ่าย', value: 'servicePrice' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
        { text: '', value: 'action', sortable: false, align: 'center' }
      ],
      dataItem: []
    }
  },
  async mounted () {
    // this.getGetToken(this.DNS_IP)
    this.dataReady = false
    // Get Data
    this.getDataGlobal(
      this.DNS_IP,
      this.path,
      this.$session.getAll().data.shopId
    )
    this.getBookingField()
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
    async getDataById (item) {
      this.dataReady = false
      await this.getDataByIdGlobal(this.DNS_IP, this.path, 'id', item.id)
      if (this.formUpdate.servicePrice === '' || this.formUpdate.servicePrice === null) {
        this.formUpdate.servicePrice = 0
      }
    },
    async addData () {
      this.formAdd.CREATE_USER = this.$session.getAll().data.userName
      this.formAdd.LAST_USER = this.$session.getAll().data.userName
      this.dataReady = false
      console.log('this.formAdd', this.formAdd)
      if (this.formAdd.serviceName === '') {
        this.$swal('ผิดพลาด', 'กรอกชื่อ สาขา', 'error')
      }
      this.dataReady = false
      this.submitAdd()
    },
    async submitAdd () {
      this.dataReady = false

      this.$swal({
        title: 'ต้องการ เพิ่มข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          this.formAdd.servicePrice = this.formAdd.servicePrice || null
          await axios
            .post(this.DNS_IP + this.path + 'add', this.formAdd)
            .then(async response => {
              // Debug response
              console.log('addDataGlobal DNS_IP + PATH + "add"', response)

              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              // Close Dialog
              this.dialogAdd = false

              // Load Data
              await this.clearData()
              await this.getDataGlobal(
                this.DNS_IP,
                this.path,
                this.$session.getAll().data.shopId
              )
            })
            // eslint-disable-next-line handle-callback-err
            .catch(error => {
              console.log('error function addDataGlobal : ', error)
              this.dataReady = true
            })
        })
        .catch(error => {
          console.log('error function addData : ', error)
          this.dataReady = true
        })
    },
    async editData () {
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName
      this.dataReady = false
      this.$swal({
        title: 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          var ID = this.formUpdate.id
          this.formUpdate.servicePrice = this.formUpdate.servicePrice || 0
          delete this.formUpdate['id']
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + this.path + "edit/" + ID,
              this.formUpdate
            )
            .then(async response => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)

              this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
              // Close Dialog
              this.dialogEdit = false
              await this.clearData()
              // Load Data
              await this.getDataGlobal(
                this.DNS_IP,
                this.path,
                this.$session.getAll().data.shopId
              )
            })
            // eslint-disable-next-line handle-callback-err
            .catch(error => {
              this.dataReady = true
              console.log('error function editDataGlobal : ', error)
            })
        })
        .catch(error => {
          this.dataReady = true
          console.log('error function editDataGlobal : ', error)
        })
    },
    async deleteData () {
      console.log('DELETE PK : ', this.PK)
      //
      //
      // สำหรับ ลบข้อมูล
      // ต้องระบุ  Last User ว่าใครเป็นคนลบล่าสุด
      //
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName
      this.$swal({
        title: 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?',
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
      this.dataReady = false
      this.deleteDataGlobal(
        this.DNS_IP,
        this.path,
        this.PK,
        this.$session.getAll().data.shopId
      )
    },
    async clearData () {
      this.dataReady = true
      this.formAdd.serviceName = ''
      this.formAdd.CREATE_USER = ''
      this.formAdd.LAST_USER = ''
      this.formAdd.shopId = this.$session.getAll().data.shopId
    }
  }
}
</script>
<style scope>
.v-dialog {
  /* overflow-y: hidden !important; */
  overflow-x: hidden !important;
}
</style>
