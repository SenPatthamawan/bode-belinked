<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <v-row>
          <!-- Search All -->
          <v-col cols="12">
            <v-expansion-panels v-model="panel" multiple>
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
            <v-expansion-panels v-model="panel1" multiple>
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
                          <v-col cols="3">
                            <v-text-field
                              label="menuCode"
                              placeholder="menuCode"
                              v-model="search.menuCode"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              label="orderNumber"
                              placeholder="orderNumber"
                              v-model="search.orderNumber"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>

                          <v-col
                            cols="3"
                          >
                            <v-select
                              v-model="search.menuRefCodeHeader"
                              :items="MenuHeader"
                              label="Header Menu"
                              outlined
                              dense
                            ></v-select>
                          </v-col>

                          <v-col
                              cols="3"
                            >
                              <v-select
                                v-model="search.menuType"
                                :items="menuType"
                                label="ประเภทเมนู"
                                outlined
                                dense
                              ></v-select>
                            </v-col>
                            <v-col cols="3">
                            <v-text-field
                              label="menuName"
                              placeholder="menuName"
                              v-model="search.menuName"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3">

                            <v-text-field
                              label="menuPath"
                              v-model="search.menuPath"
                              :counter="50"
                              maxlength="50"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>

                            <v-col
                              cols="3"
                            >
                              <v-select
                                v-model="search.masApplicationName"
                                :items="Application"
                                label="ระบบที่ใช้งาน"
                                outlined
                              dense
                              ></v-select>
                            </v-col>
                            <v-col
                              cols="3"
                            >
                              <v-select
                                v-model="search.userTypeGroup"
                                :items="UserTypeGroup"
                                attach
                                chips
                                label="กลุ่มผู้ใช้งาน"
                                outlined
                              dense
                              ></v-select>
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
                          <v-col cols="6">
                            <v-menu
                              ref="menu3"
                              v-model="menu3"
                              :close-on-content-click="false"
                              :return-value.sync="date"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="search.last_date_start"
                                  label="วันที่แก้ไข เริ่มต้น"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="search.last_date_start" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu3 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu3.save(search.last_date_start)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="6">
                            <v-menu
                              ref="menu4"
                              v-model="menu4"
                              :close-on-content-click="false"
                              :return-value.sync="date"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="search.last_date_end"
                                  label="วันที่แก้ไข สิ้นสุด"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="search.last_date_end" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu4 = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu4.save(search.last_date_end)"
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
            <v-btn color="primary" depressed @click="dialogAdd = true">
              <v-icon left>mdi-text-box-plus</v-icon>
              Add
            </v-btn>
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
            <v-btn color="yellow-light" depressed @click="dialogImport = true">
              <v-icon left>mdi-import</v-icon>
              Manage Data By Excel.xls
            </v-btn>
          </v-col>
          <!-- Import -->
          <v-dialog v-model="dialogImport" persistent max-width="80%">
            <v-card>
              <v-card-title>
                <span class="headline">จัดการไฟล์ผ่าน excel.xls</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <input type="file" @change="importData" accept=".xls" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <template>
                        <v-data-table
                          :headers="columnsImport"
                          :items="dataItemImport"
                          :items-per-page="5"
                          class="elevation-1"
                        ></v-data-table>
                      </template>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="2"
                  color="red darken-1"
                  text
                  @click="(dialogImport = false), (dataItemImport = [])"
                >
                  ปิด
                </v-btn>
                <template v-if="!dataItemImportChecKHide">
                  <v-btn
                    elevation="2"
                    color="red"
                    text
                    @click="importDataApprove('delete')"
                  >
                    ล้างข้อมูลทั้งหมดที่เลือก
                  </v-btn>
                  <v-btn
                    elevation="2"
                    color="blue darken-1"
                    text
                    @click="importDataApprove('update')"
                  >
                    ปรับปรุงข้อมูลที่ตรงกัน
                  </v-btn>
                  <v-btn
                    elevation="2"
                    color="green darken-1"
                    text
                    @click="importDataApprove('add')"
                  >
                    นำเข้าใหม่ทั้งหมด
                  </v-btn>
                </template>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end Import -->

          <!-- ADD -->
          <v-dialog v-model="dialogAdd" persistent max-width="80%">
            <v-card>
              <v-card-title>
                <span class="headline">เพิ่มข้อมูล</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="orderNumber*"
                        v-model="formAdd.orderNumber"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="menuName*"
                        v-model="formAdd.menuName"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        required
                      ></v-text-field>
                    </v-col>
                     <v-col
                      cols="6"
                    >
                      <v-select
                         v-model="formAdd.menuRefCodeHeader"
                        :items="MenuHeader"
                        label="Header Menu"
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="menuPath"
                        v-model="formAdd.menuPath"
                        :counter="50"
                        maxlength="50"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="6"
                    >
                      <v-select
                        v-model="formAdd.menuType"
                        :items="menuType"
                        label="ประเภทเมนู"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="6"
                    >
                      <v-select
                        v-model="formAdd.masApplicationName"
                        :items="Application"
                        label="ระบบที่ใช้งาน"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="6"
                    >
                      <v-select
                        v-model="formAdd.userTypeGroup"
                        :items="UserTypeGroup"
                        attach
                        chips
                        label="กลุ่มผู้ใช้งาน"
                        multiple
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="2"
                  x-large
                  color="dark darken-1"
                  text
                  @click="dialogAdd = false,clearData()"
                >
                  <v-icon left> mdi-cancel</v-icon>
                  ปิด
                </v-btn>
                <v-btn
                  elevation="2"
                  x-large
                  color="success"
                  text
                  @click="addData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  เพิ่ม
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end add -->

          <!-- edit -->
          <v-dialog v-model="dialogEdit" persistent max-width="80%">
            <v-card>
              <v-card-title>
                <span class="headline">แก้ไขข้อมูล</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                   <v-row>
                     <v-col cols="12">
                      <v-text-field
                        label="menuCode*"
                        v-model="formUpdate.menuCode"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        required
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="orderNumber*"
                        v-model="formUpdate.orderNumber"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="menuName*"
                        v-model="formUpdate.menuName"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        required
                      ></v-text-field>
                    </v-col>
                   <v-col
                      cols="6"
                    >
                      <v-select
                         v-model="formUpdate.menuRefCodeHeader"
                        :items="MenuHeader"
                        label="Header Menu"
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="menuPath"
                        v-model="formUpdate.menuPath"
                        :counter="50"
                        maxlength="50"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="6"
                    >
                      <v-select
                        v-model="formUpdate.menuType"
                        :items="menuType"
                        label="ประเภทเมนู"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="6"
                    >
                      <v-select
                        v-model="formUpdate.masApplicationName"
                        :items="Application"
                        label="ระบบที่ใช้งาน"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="6"
                    >
                      <v-select
                        v-model="formUpdate.userTypeGroup"
                        :items="UserTypeGroup"
                        attach
                        chips
                        label="กลุ่มผู้ใช้งาน"
                        multiple
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="2"
                  x-large
                  color="blue darken-1"
                  text
                  @click="dialogEdit = false"
                >
                  <v-icon left> mdi-cancel</v-icon>
                  ปิด
                </v-btn>
                <v-btn
                  elevation="2"
                  x-large
                  color="success"
                  text
                  @click="editData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  แก้ไข
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end edit -->

          <!-- delete -->
          <v-dialog v-model="dialogDelete" persistent max-width="80%">
            <v-card>
              <v-card-title>
                <span class="headline">ลบข้อมูลนี้</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                     <v-col cols="12">
                      <v-text-field
                        label="menuCode*"
                        v-model="formUpdate.menuCode"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        required
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="orderNumber*"
                        v-model="formUpdate.orderNumber"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        required
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="menuName*"
                        v-model="formUpdate.menuName"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        required
                        readonly
                      ></v-text-field>
                    </v-col>
                     <v-col
                      cols="6"
                    >
                      <v-select
                         v-model="formUpdate.menuRefCodeHeader"
                        :items="MenuHeader"
                        label="Header Menu"
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="menuPath"
                        v-model="formUpdate.menuPath"
                        :counter="50"
                        maxlength="50"
                        required
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="6"
                    >
                      <v-select
                        v-model="formUpdate.menuType"
                        :items="menuType"
                        label="ประเภทเมนู"
                        readonly
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="6"
                    >
                      <v-select
                        v-model="formUpdate.masApplicationName"
                        :items="Application"
                        label="ระบบที่ใช้งาน"
                        readonly
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="6"
                    >
                      <v-select
                        v-model="formUpdate.userTypeGroup"
                        :items="UserTypeGroup"
                        attach
                        chips
                        label="กลุ่มผู้ใช้งาน"
                        multiple
                        readonly
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="2"
                  x-large
                  color="dark darken-1"
                  text
                  @click="dialogDelete = false"
                >
                  <v-icon left> mdi-cancel</v-icon>
                  ปิด
                </v-btn>
                <v-btn
                  elevation="2"
                  x-large
                  color="red darken-1"
                  text
                  @click="deleteData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  ลบ
                </v-btn>
              </v-card-actions>
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
                  :items-per-page="-1"
                >
                   <template v-slot:[`item.CREATE_DATE`]="{ item }">
                      {{ format_date(item.CREATE_DATE) }}
                  </template>
                   <template v-slot:[`item.LAST_DATE`]="{ item }">
                      {{ format_date(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      color="question"
                      fab
                      small
                      @click.stop="(dialogEdit = true), getDataById(item)"
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
import axios from 'axios' // api
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
      path: '/system_menu/', // Path Model
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'จัดการเมนู',
          disabled: true,
          href: '/System/Menu'
        }
      ],
      // End Menu Config
      dataReady: true,
      dateTime: '', // Generate DateTime
      date: this.momenDate_1(new Date()),
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      code: 'SYS_MENU_', // Generate Code
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
        menuCode: '',
        menuRefCodeHeader: '',
        menuName: '',
        menuPath: '',
        menuType: '',
        masApplicationName: '',
        userTypeGroup: '',
        orderNumber: '',
        create_date_start: '',
        create_date_end: '',
        last_date_start: '',
        last_date_end: ''
      },
      formAdd: {
        menuCode: '',
        menuRefCodeHeader: '',
        menuName: '',
        menuPath: '',
        menuType: 'Sub',
        masApplicationName: 'HRM',
        userTypeGroup: '',
        orderNumber: ''
      },
      formUpdate: {
        menuCode: '',
        menuRefCodeHeader: '',
        menuName: '',
        menuPath: '',
        menuType: '',
        masApplicationName: '',
        userTypeGroup: '',
        orderNumber: ''
      },
      formUpdateItem: {
        menuCode: '',
        menuRefCodeHeader: '',
        menuName: '',
        menuPath: '',
        menuType: '',
        masApplicationName: '',
        userTypeGroup: '',
        orderNumber: ''
      },
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => v.length <= 50 || 'Name must be less than 10 characters'
      ],
      // End Form Config ADD EDIT
      // Data Table Config
      columns: [
        { text: 'เรียงลำดับ', value: 'orderNumber' },
        { text: 'ภายใต้', value: 'menuRefCodeHeader' },
        { text: 'ประเภท', value: 'menuType' },
        { text: 'ชื่อ', value: 'menuName' },
        { text: 'Path', value: 'menuPath' },
        { text: 'Action', value: 'action', sortable: false, align: 'center' }
      ],
      dataItem: [],
      // End Data Table Config

      // Config Import
      columnsImport: [
        { text: 'menuCode', value: 'menuCode' },
        { text: 'orderNumber', value: 'orderNumber' },
        { text: 'menuRefCodeHeader', value: 'menuRefCodeHeader' },
        { text: 'menuType', value: 'menuType' },
        { text: 'menuName', value: 'menuName' },
        { text: 'menuPath', value: 'menuPath' },
        { text: 'masApplicationName', value: 'masApplicationName' }
      ],
      dataItemImportChecKHide: true,
      dataItemImport: [],
      // End Config Import
      // Export Config
      exportType: 'xls',
      exportFileName: 'System-Menu.xls',
      exportWorksheet: 'WorkSheet',
      export_fields: {
        menuCode: 'menuCode',
        orderNumber: 'orderNumber',
        menuRefCodeHeader: 'menuRefCodeHeader',
        menuType: 'menuType',
        menuName: 'menuName',
        menuPath: 'menuPath',
        masApplicationName: 'masApplicationName'
      },
      json_meta: [
        [
          {
            key: 'charset',
            value: 'utf-8'
          }
        ]
      ],
      // End Export Config
      Application: [],
      UserTypeGroup: [],
      MenuHeader: [],
      menuType: ['Topic', 'Header', 'Sub']
    }
  },
  async mounted () {
    this.getGetToken(this.DNS_IP)
    this.dataReady = false
    // Get Data
    this.getDataGlobal(this.DNS_IP, this.path)
    this.getDataApplication()
    this.getDataTypeGroup()
    this.getDataMenuHeader()
  },
  methods: {
    async getDataById (item) {
      await this.getDataApplication()
      await this.getDataTypeGroup()
      await this.getDataMenuHeader()
      this.PK = item.menuId
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + this.path + "getID?" + 'menuId' + "=" + item.menuId,
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          console.log('get id : ', response.data)
          this.dataReady = true
          if (response.data) {
            if (response.data.userTypeGroup) {
              response.data.userTypeGroup = JSON.parse(response.data.userTypeGroup)
            }

            Object.assign(this.formUpdate, response.data)
            delete this.formUpdate['menuId']
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
    async addData () {
      //
      //
      // สำหรับ เพิ่มข้อมูล
      // ต้องระบุ Create / Last User ว่าใครเป็นคนสร้าง
      //
      this.formAdd.CREATE_USER = this.$session.getAll().data.userName
      this.formAdd.LAST_USER = this.$session.getAll().data.userName
      if (this.formAdd.userTypeGroup) {
        this.formAdd.userTypeGroup = JSON.stringify(this.formAdd.userTypeGroup)
      }

      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      //
      // กำหนด Code ของรายการ * อย่าลืมเปลี่ยน field
      //
      this.formAdd.menuCode = this.code + this.generateCodeGlobal()
      //
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

      console.log('form', JSON.stringify(this.formAdd))

      if (this.formAdd.menuType === 'Topic') {
        if (this.formAdd.menuPath !== '') {
          this.$swal('ประเภท Topic', 'ไม่ต้องกรอกข้อมูล Path', 'error')
          this.formAdd.menuPath = ''
        } else if (this.formAdd.menuRefCodeHeader !== '') {
          this.$swal('ประเภท Topic', 'ไม่ต้องกรอกข้อมูล Ref.Header Code', 'error')
          this.formAdd.menuRefCodeHeader = ''
        } else {
          this.dataReady = false
          this.submitAdd()
        }
      } else {
        this.dataReady = false
        this.submitAdd()
      }
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
        .then(async (result) => {
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + this.path + "add",
              this.formAdd,
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
              await this.getDataGlobal(this.DNS_IP, this.path)
              await this.getDataApplication()
              await this.getDataTypeGroup()
              await this.getDataMenuHeader()
              this.formAdd.menuCode = ''
              this.formAdd.menuRefCodeHeader = ''
              this.formAdd.menuName = ''
              this.formAdd.menuPath = ''
              this.formAdd.menuType = 'Sub'
              this.formAdd.masApplicationName = 'HRM'
              this.formAdd.userTypeGroup = ''
              this.formAdd.orderNumber = ''
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
    async editData () {
      // Config User ทำรายการล่าสุด
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName
      // End Config User ทำรายการล่าสุด

      for (var key in this.formUpdateItem) {
        for (var key2 in this.formUpdate) {
          if (key === key2) {
            this.formUpdateItem[key] = this.formUpdate[key2]
          }
        }
      }
      console.log('this.formUpdateItem', this.formUpdateItem)

      if (this.formUpdateItem.userTypeGroup) {
        this.formUpdateItem.userTypeGroup = JSON.stringify(this.formUpdateItem.userTypeGroup)
      }
      if (this.formUpdateItem.menuType === 'Topic') {
        if (this.formUpdateItem.menuPath !== '') {
          this.$swal('ประเภท Topic', 'ไม่ต้องกรอกข้อมูล Path', 'error')
          this.formUpdateItem.menuPath = ''
        } else if (this.formUpdateItem.menuRefCodeHeader !== '') {
          this.$swal('ประเภท Topic', 'ไม่ต้องกรอกข้อมูล Ref.Header Code', 'error')
          this.formUpdateItem.menuRefCodeHeader = ''
        } else {
          this.dataReady = false
          this.submitEdit(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
        }
      } else {
        this.dataReady = false
        this.submitEdit(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
      }
    },
    async submitEdit (DNS_IP, PATH, ID, DT) {
      // this.editDataGlobal(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
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
              await this.getDataApplication()
              await this.getDataTypeGroup()
              await this.getDataMenuHeader()
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
    async deleteData () {
      console.log('DELETE PK : ', this.PK)
      //
      //
      // สำหรับ ลบข้อมูล
      // ต้องระบุ  Last User ว่าใครเป็นคนลบล่าสุด
      //
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName
      this.dataReady = false
      this.deleteDataGlobal(this.DNS_IP, this.path, this.PK)
    },
    async searchDataAll () {
      //
      //
      // สำหรับ ค้นหาแบบ LIKE Search
      // ต้องระบุ Field ที่จะส่งไปให้ตรงกับ Model
      //
      var search =
        '?menuCode=' + this.searchAll + '&menuName=' + this.searchAll
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

      if (this.search.last_date_start !== '' && this.search.last_date_end === '') {
        this.search.last_date_end = this.search.last_date_start + ' 23:59:59'
      } else {
        if (this.search.last_date_end !== '') {
          this.search.last_date_end = this.search.last_date_end + ' 23:59:59'
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

        if (this.search.last_date_start === '' && this.search.last_date_end !== '') {
          check = false
          this.$swal('ผิดพลาด', 'กรุณาเลือกวันที่แก้ไข เริ่มต้น', 'error')
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
        if (key === 'menuType') {
          if (this.formAdd[key]) {
            this.formAdd[key] = 'Sub'
          }
        } else if (key === 'masApplicationName') {
          if (this.formAdd[key]) {
            this.formAdd[key] = 'HRM'
          }
        } else {
          if (this.formAdd[key]) {
            this.formAdd[key] = ''
          }
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
    },
    async getDataApplication () {
      // Clear Data ทุกครั้ง
      this.Application = []
      // console.log('getDataApplication')
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/master_application/' + "get",
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          let rs = response.data
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            var s = {}
            s.value = d.masApplicationName
            s.text = d.masApplicationName
            d = s
            console.log(d)
            this.Application.push(d)
          }
          console.log('getDataApplication : ', this.Application)
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log(error)
        })
    },
    async getDataTypeGroup () {
      // Clear Data ทุกครั้ง
      this.UserTypeGroup = []
      // console.log('getDataTypeGroup')
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/system_user_type_group/' + "get",
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          let rs = response.data
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            var s = {}
            s.value = d.userTypeGroupName
            s.text = d.userTypeGroupName
            d = s
            console.log(d)
            this.UserTypeGroup.push(d)
          }
          console.log('getDataTypeGroup : ', this.UserTypeGroup)
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log(error)
        })
    },
    async getDataMenuHeader () {
      // Clear Data ทุกครั้ง
      this.MenuHeader = []
      // console.log('getDataTypeGroup')
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/system_menu/' + "get?not_in_menuType=Sub",
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          let rs = response.data
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            var s = {}
            s.value = d.menuName
            s.text = d.menuName
            d = s
            console.log(d)
            this.MenuHeader.push(d)
          }
          console.log('getDataMenuHeader : ', this.MenuHeader)
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log(error)
        })
    },
    // * Option Import Excel
    // * ตั้งค่าจาก Data
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
            this.PK = this.dataItemImport[key].menuId
            if (action === 'add') {
              console.log('add')
              await this.importDataAdd(this.dataItemImport[key])
              checkError = true
            } else {
              await axios
                .get(
                  // eslint-disable-next-line quotes
                  this.DNS_IP +
                    this.path +
                    'get?menuId=' +
                    this.dataItemImport[key].menuId,
                  {
                    headers: {
                      'Application-Key': this.$session.getAll().ApplicationKey
                    }
                  }
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

                  console.log('error /system_menu/get?menuId : ', error)
                })
            }
          }
          console.log(checkError)
          if (checkError === true) {
            await this.getDataGlobal(this.DNS_IP, this.path)
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
      console.log('importDataAdd : ', dt)

      Object.assign(this.formAdd, dt)
      this.formAdd.CREATE_USER = this.$session.getAll().data.userName
      this.formAdd.LAST_USER = this.$session.getAll().data.userName
      if (this.formAdd.menuType === 'Topic') {
        this.formAdd.menuPath = ''
        this.formAdd.menuRefCodeHeader = ''
      }
      if (this.formAdd.userTypeGroup) {
        this.formAdd.userTypeGroup = JSON.stringify(this.formAdd.userTypeGroup)
      }
      delete this.formAdd['menuId']
      delete this.formAdd['LAST_DATE']
      delete this.formAdd['CREATE_DATE']
      delete this.formAdd['RECORD_STATUS']
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + this.path + "add",
          this.formAdd,
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          this.dialogImport = false
          // Debug response
          console.log('/system_menu/add/', response)
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          alert('โปรดใส่ไฟล์ให้ถูกต้อง', dt)
          console.log('error function importDataAdd addData : ', error)
          this.dataReady = true
        })
    },
    async importDataUpdate (dt) {
      if (dt.userTypeGroup) {
        dt.userTypeGroup = JSON.stringify(dt.userTypeGroup)
      }
      Object.assign(this.formUpdate, dt)
      delete this.formUpdate['menuId']
      delete this.formUpdate['LAST_DATE']
      delete this.formUpdate['CREATE_DATE']
      delete this.formUpdate['RECORD_STATUS']
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName

      for (var key in this.formUpdateItem) {
        for (var key2 in this.formUpdate) {
          if (key === key2) {
            this.formUpdateItem[key] = this.formUpdate[key2]
          }
        }
      }

      if (this.formUpdateItem.menuType === 'Topic') {
        this.formUpdate.menuPath = ''
        this.formUpdate.menuRefCodeHeader = ''
        this.formUpdateItem.menuPath = ''
        this.formUpdateItem.menuRefCodeHeader = ''
      }
      // Debug
      console.log('EDIT PK : ', this.PK)
      console.log('formUpdateItem', JSON.stringify(this.formUpdateItem))

      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + this.path + "edit/" + dt.menuId,
          this.formUpdateItem,
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          this.dialogImport = false
          // Debug response
          console.log('/system_menu/edit/', response)
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
          this.DNS_IP + this.path + "delete/" + dt.menuId,
          this.formUpdate,
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async (response) => {
          this.dialogImport = false
          // Debug response
          console.log('/system_menu/delete/', response)
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
</style>
