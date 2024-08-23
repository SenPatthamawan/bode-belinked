<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <v-row>
          <!-- Search All -->
          <v-col cols="12">
             <v-expansion-panels focusable v-model="panel" multiple>
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  ค้นหาช่องเดียว
                  <template v-slot:actions>
                    <v-icon color="teal"> search </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="2">
                    <v-card-text>
                      <form>
                        <v-row justify="center">
                          <v-col cols="4">
                            <v-text-field
                              label="ค้นหาทุกอย่าง"
                              placeholder="ทุกอย่างที่พิมพ์"
                              v-model="searchAll"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row class="text-right">
                          <v-col cols="12">
                            <v-btn
                              color="question"
                              depressed
                              @click.prevent="searchDataAll()"
                            >
                              <v-icon left> search </v-icon>
                              ค้นหา
                            </v-btn>
                            <v-btn
                              color="error"
                              depressed
                              @click.prevent="getDataGlobal(DNS_IP, path) , clearData()"
                            >
                              <v-icon left> settings_backup_restore </v-icon>
                              Clear
                            </v-btn>
                          </v-col>
                        </v-row>
                      </form>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>

          <!-- Search advanced -->
          <v-col cols="12">
            <v-expansion-panels focusable v-model="panel1" multiple>
              <v-expansion-panel>
                <v-expansion-panel-header disable-icon-rotate>
                  ค้นหาจาก Field ทั้งหมด
                  <template v-slot:actions>
                    <v-icon color="cyan"> search </v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="2">
                    <v-card-text>
                      <form>
                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              label="privacyConfigId"
                              placeholder="privacyConfigId"
                              v-model="search.privacyConfigId"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              label="userCode"
                              placeholder="userCode"
                              v-model="search.userCode"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              label="privacyStatus"
                              placeholder="privacyStatus"
                              v-model="search.privacyStatus"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>

                        </v-row>
                         <v-row>
                          <v-col cols="6">
                            <v-menu
                              ref="menu"
                              v-model="menu"
                              :close-on-content-click="false"
                              :return-value.sync="date"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="search.create_date_start"
                                  label="วันที่สร้าง เริ่มต้น"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="search.create_date_start" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu.save(search.create_date_start)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="6">
                            <v-menu
                              ref="menu2"
                              v-model="menu2"
                              :close-on-content-click="false"
                              :return-value.sync="date"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="search.create_date_end"
                                  label="วันที่สร้าง สิ้นสุด"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="search.create_date_end" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu2 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu2.save(search.create_date_end)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                        <v-row class="text-right">
                          <v-col cols="12">
                            <v-btn
                              color="question"
                              depressed
                              @click.prevent="saerchDataAdvanced()"
                            >
                              <v-icon left> search </v-icon>
                              ค้นหา
                            </v-btn>
                            <v-btn
                              color="error"
                              depressed
                              @click.prevent="getDataGlobal(DNS_IP, path) , clearData()"
                            >
                              <v-icon left> settings_backup_restore </v-icon>
                              Clear
                            </v-btn>
                          </v-col>
                        </v-row>
                      </form>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <!-- end Search advanced -->
          <!-- Dialog export / import -->
          <v-col cols="12">
            <v-btn color="yellow-light">
              <v-icon left>mdi-download</v-icon>
              <download-excel
                class="btn btn-default"
                :data="export_data"
                :fields="export_fields"
                :type="exportType"
                :worksheet="exportWorksheet"
                :name="exportFileName"
              >
                Export Data
              </download-excel>
            </v-btn>
          </v-col>
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
                   <template v-slot:[`item.LAST_DATE`]="{ item }">
                      {{ format_date(item.LAST_DATE) }}
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
            <div v-if="!dataReady" class="text-center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
          </v-col>
          <!-- end data table -->
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<script>
// import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'
// import moment from 'moment' // แปลง date

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  data () {
    return {
      PK: '',
      path: '/system_privacy_check/', // Path Model
      dataReady: true,
      dateTime: '', // Generate DateTime
      date: this.momenDate_1(new Date()),
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      code: 'SYS_PCH_', // Generate Code
      // Dialog Config ADD EDIT DELETE IMPORT
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogImport: false,
      // END Dialog Config ADD EDIT DELETE
      panel: [0],
      panel1: [1],
      session: this.$session.getAll(),
      // Search All
      searchAll: '',
      searchAll2: '',
      // Search Advanced
      search: {
        privacyConfigId: '',
        userCode: '',
        privacyStatus: '',
        create_date_start: '',
        create_date_end: ''
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
          text: 'Privacy Check',
          disabled: true,
          href: '/System/PrivacyCheck'
        }
      ],
      // End Menu Config
      // Data Table Config
      columns: [
        { text: 'privacyId', value: 'privacyId' },
        { text: 'privacyConfigId', value: 'privacyConfigId' },
        { text: 'userCode', value: 'userCode' },
        { text: 'privacyStatus', value: 'privacyStatus' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        { text: 'ผู้สร้าง', value: 'CREATE_USER' }
      ],
      dataItem: [],
      // End Data Table Config

      // Export Config
      exportType: 'xls',
      exportFileName: 'Privacy-Check.xls',
      exportWorksheet: 'WorkSheet',
      export_fields: {
        privacyId: 'privacyId',
        privacyConfigId: 'privacyConfigId',
        userCode: 'userCode',
        privacyStatus: 'privacyStatus'
      },
      json_meta: [
        [
          {
            key: 'charset',
            value: 'utf-8'
          }
        ]
      ]
    }
  },
  async mounted () {
    this.getGetToken(this.DNS_IP)
    this.dataReady = false
    // Get Data
    this.getDataGlobal(this.DNS_IP, this.path)
  },
  methods: {
    async getDataById (item) {
      console.log(item)
      //
      //
      // สำหรับ เรียกข้อมูล ใส่ form Update / Delete
      //
      //
      // Get ID /main.js
      this.dataReady = false
      this.getDataByIdGlobal(this.DNS_IP, this.path, 'privacyId', item.privacyId)
    },
    async searchDataAll () {
      //
      //
      // สำหรับ ค้นหาแบบ LIKE Search
      // ต้องระบุ Field ที่จะส่งไปให้ตรงกับ Model
      //
      var search =
        '?privacyConfigId=' + this.searchAll + '&privacyStatus=' + this.searchAll
      this.dataReady = false
      this.searchDataAllGlobal(this.DNS_IP, this.path, search)
    },
    async saerchDataAdvanced () {
      var search = ''
      var check = false
      // config วันที่สร้าง วันที่แก้ไข
      // config นำวันที่สิ้นสุดมาต่อ 23:59:59
      if (this.search.create_date_start !== '' && this.search.create_date_end === '') {
        this.search.create_date_end = this.search.create_date_start + ' 23:59:59'
      } else {
        if (this.search.create_date_start !== '') {
          this.search.create_date_end = this.search.create_date_end + ' 23:59:59'
        }
      }

      for (var key in this.search) {
        console.log('Key', key)
        console.log('Value', this.search)

        check = true
        if (this.search[key]) {
          if (search !== '') {
            search += '&'
          }
          search += key + '=' + this.search[key]
        }
        if (this.search.create_date_start === '' && this.search.create_date_end !== '') {
          check = false
          this.$swal('ผิดพลาด', 'กรุณาเลือกวันที่สร้าง เริ่มต้น', 'error')
        }
      }
      console.log('saerchDataAdvanced', search)
      //
      //
      // สำหรับ ค้นหาแบบ กำหนดจาก form serach
      //
      if (check === true) {
        this.dataReady = false

        this.saerchDataAdvancedGlobal(this.DNS_IP, this.path, search)
      } else {
        this.dataReady = true
      }
    },
    async clearData () {
      // eslint-disable-next-line no-redeclare
      for (var key in this.formAdd) {
        console.log('Key', key)
        console.log('Value', this.formAdd)

        if (this.formAdd[key]) {
          this.formAdd[key] = ''
        }
      }

      // eslint-disable-next-line no-redeclare
      for (var key in this.search) {
        console.log('Key', key)
        console.log('Value', this.search)

        if (this.search[key]) {
          this.search[key] = ''
        }
      }
    }
  }
}
</script>
<style scope>
</style>
