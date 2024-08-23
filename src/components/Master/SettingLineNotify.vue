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
            <v-btn color="primary" depressed @click="(dialogAdd = true), all()">
              <v-icon left>mdi-text-box-plus</v-icon>
              เพิ่มการแจ้งเตือน
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-dialog v-model="dialogAdd" persistent width="45%">
            <v-card class="pa-3" min-height="400" style="overflow-x: hidden;">
              <v-row>
                <v-col cols="10" class="text-left pt-10">
                  <h3 class="ml-7">
                    <strong>เลือกบริการที่จะรับการแจ้งเตือน</strong>
                  </h3>
                </v-col>
                <v-col cols="2" class="pt-10">
                  <div style="text-align: end;">
                    <v-btn
                      class="mx-2"
                      fab
                      small
                      dark
                      color="white"
                      :style="styleCloseBt"
                      @click="dialogAdd = false,clearDataAdd()"
                    >
                      X
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row class="pa-6">
                <v-col class="pa-0" cols="12">
                  <!-- <p>{{itemBranch}}</p> -->
                  <v-select
                    v-model="itemBranch"
                    :items="BranchItem"
                    label="เลือกสาขาที่ต้องการรับการแจ้งเตือน"
                    dense
                    outlined
                    multiple
                    persistent-hint
                    attach
                    :menu-props="{ bottom: true, offsetY: true }"
                    class="ma-3"
                  ></v-select>
                </v-col>
                <v-col class="pa-0" cols="12" md="12">
                  <h3
                    class="text-center font-weight-black mb-5"
                    style="color:#173053;"
                  >
                    ประเภทบริการ
                  </h3>
                  <div class="text-right mb-5">
                    <v-btn
                      v-if="panel.length !== flowData.length"
                      dark
                      color="#14AE5C"
                      @click="all"
                    >
                      แสดงทั้งหมด
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="panel.length === flowData.length"
                      dark
                      color="error"
                      @click="none"
                    >
                      ปิด
                      <v-icon>mdi-chevron-up</v-icon>
                    </v-btn>
                  </div>
                  <v-sheet class="pa-2 mb-2" elevation="1">
                    <v-row class="pa-1 ma-0 mb-n4 ml-3">
                          <v-col class="ma-0 pa-0">
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-checkbox-marked'"
                              :off-icon="'mdi-checkbox-blank-outline'"
                              v-model="allBookingAdd"
                              label="ทั้งหมด"
                              @click="clickAllbutton('checkBooking','Add')"
                            ></v-checkbox>
                          </v-col>
                          <v-col class="ma-0 pa-0">
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-checkbox-marked'"
                              :off-icon="'mdi-checkbox-blank-outline'"
                              label="ทั้งหมด"
                              v-model="allOnsiteAdd"
                              @click="clickAllbutton('checkOnsite','Add')"
                            ></v-checkbox>
                          </v-col>
                          <v-col class="ma-0 pa-0">
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-checkbox-marked'"
                              :off-icon="'mdi-checkbox-blank-outline'"
                              label="ทั้งหมด"
                              v-model="allJobAdd"
                              @click="clickAllbutton('checkJob','Add')"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                  </v-sheet>
                  <v-expansion-panels v-model="panel" multiple>
                    <v-expansion-panel
                      v-for="(item, index) in flowData"
                      :key="index"
                    >
                      <v-expansion-panel-header expand-icon="mdi-menu-down">
                        <h6 class="font-weight-medium" style="color:#000000;">
                          <v-icon class="mr-1" color="#000000">
                            mdi-bell-circle
                          </v-icon>
                          {{ item.text }}
                        </h6>
                        <!-- <template v-slot:actions>
                        <v-icon color="error">
                          mdi-chevron-down-box
                        </v-icon>
                      </template> -->
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col>
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              v-model="item.checkBooking"
                              label="นัดหมายเข้ารับบริการ"
                              @click="item.checkBooking === true ? selectAddAll('checkBooking',true) : selectAddAll('checkBooking',false)"
                            ></v-checkbox>
                          </v-col>
                          <v-col>
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              v-model="item.checkOnsite"
                              label="แจ้งเตือนพนักงาน Onsite"
                              @click="item.checkOnsite === true ? selectAddAll('checkOnsite',true) : selectAddAll('checkOnsite',false)"
                            ></v-checkbox>
                          </v-col>
                          <v-col>
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              v-model="item.checkJob"
                              label="กระดานการทำงาน"
                              @click="item.checkJob === true ? selectAddAll('checkJob',true) : selectAddAll('checkJob',false)"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
                <!-- <v-col class="pa-0" cols="12" md='12'>
                <v-container fluid>
                  <h4 class="text-center font-weight-black mb-5" style="color:#173053;">ประเภทบริการ</h4>
                   <v-row v-for="(item , index) in flowData" :key="index" class="mb-1"  style="border-style: groove;">
                    <v-col cols="12" class="text-center">
                      <p class="pa-0 ma-0 mt-4 font-weight-black" style="color:#173053;" >{{item.text}}</p>
                    </v-col>
                    <v-col class="pa-0 ps-4 ma-0" cols="12">
                      <v-checkbox class="pa-0 ma-0"
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        v-model="item.checkBooking"
                        label="นัดหมายเข้ารับบริการ"
                      ></v-checkbox>
                      <v-checkbox class="pa-0 ma-0"
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        v-model="item.checkOnsite"
                        label="แจ้งเตือนพนักงาน Onsite"
                      ></v-checkbox>
                      <v-checkbox class="pa-0 ma-0"
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        v-model="item.checkJob"
                        label="กระดานการทำงาน"
                      ></v-checkbox>
                      <v-checkbox class="pa-0 ma-0"
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        v-model="item.checkEpmtime"
                        label="การบันทึกเวลาพนักงาน"
                      ></v-checkbox>
                    </v-col>
                   </v-row>
                </v-container>
              </v-col> -->
                <!-- <v-col class="pa-0" cols="6" md='6'>
                <v-container fluid>
                    <p class="text-center">การBooking</p>
                    <v-checkbox
                    v-model="BookingSend"
                    label="Booking"
                  ></v-checkbox>
                </v-container>
              </v-col> -->
              </v-row>
              <div class="mr-4">
                <v-btn
                  block
                  class="ma-2"
                  color="#14AE5C"
                  dark
                  large
                  @click="AddData()"
                >
                  บันทึก
                </v-btn>
              </div>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog" persistent width="45%">
            <v-card class="pa-3" min-height="400" style="overflow-x: hidden;">
              <v-row>
                <v-col cols="10" class="text-left pt-10">
                  <h3 class="ml-7">
                    <strong>เลือกบริการที่จะรับการแจ้งเตือน</strong>
                  </h3>
                </v-col>
                <v-col cols="2" class="pt-10">
                  <div style="text-align: end;">
                    <v-btn
                      class="mx-2"
                      fab
                      small
                      dark
                      color="white"
                      :style="styleCloseBt"
                      @click="dialog = false"
                    >
                      X
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row class="pa-6">
                <v-col class="pa-0" cols="12">
                  <!-- <p>{{itemBranch}}</p> -->
                  <v-select
                    v-model="itemBranchEdit"
                    :items="BranchItem"
                    label="เลือกสาขาที่ต้องการรับการแจ้งเตือน"
                    dense
                    outlined
                    multiple
                    persistent-hint
                    attach
                    :menu-props="{ bottom: true, offsetY: true }"
                    class="ma-3"
                  ></v-select>
                </v-col>
                <v-col class="pa-0" cols="12" md="12">
                  <h3
                    class="text-center font-weight-black mb-5"
                    style="color:#173053;"
                  >
                    ประเภทบริการ
                  </h3>
                  <div class="text-right mb-5">
                    <v-btn
                      v-if="panelEdit.length !== itemSelectEdit.length"
                      dark
                      color="#14AE5C"
                      @click="allEdit"
                    >
                      แสดงทั้งหมด
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="panelEdit.length === itemSelectEdit.length"
                      dark
                      color="error"
                      @click="noneEdit"
                    >
                      ปิด
                      <v-icon>mdi-chevron-up</v-icon>
                    </v-btn>
                  </div>
                  <v-sheet class="pa-2 mb-2" elevation="1">
                    <v-row class="pa-1 ma-0 mb-n4 ml-3">
                          <v-col class="ma-0 pa-0">
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-checkbox-marked'"
                              :off-icon="'mdi-checkbox-blank-outline'"
                              v-model="allBookingEdit"
                              label="ทั้งหมด"
                              @click="clickAllbutton('checkBooking','Edit')"
                            ></v-checkbox>
                          </v-col>
                          <v-col class="ma-0 pa-0">
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-checkbox-marked'"
                              :off-icon="'mdi-checkbox-blank-outline'"
                              label="ทั้งหมด"
                              v-model="allOnsiteEdit"
                              @click="clickAllbutton('checkOnsite','Edit')"
                            ></v-checkbox>
                          </v-col>
                          <v-col class="ma-0 pa-0">
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-checkbox-marked'"
                              :off-icon="'mdi-checkbox-blank-outline'"
                              label="ทั้งหมด"
                              v-model="allJobEdit"
                              @click="clickAllbutton('checkJob','Edit')"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                  </v-sheet>
                  <v-expansion-panels v-model="panelEdit" multiple>
                    <v-expansion-panel
                      v-for="(item, index) in itemSelectEdit"
                      :key="index"
                    >
                      <v-expansion-panel-header expand-icon="mdi-menu-down">
                        <h6 class="font-weight-medium" style="color:#000000;">
                          <v-icon class="mr-1" color="#000000">
                            mdi-bell-circle
                          </v-icon>
                          {{ item.text }}
                        </h6>
                        <!-- <template v-slot:actions>
                        <v-icon color="error">
                          mdi-chevron-down-box
                        </v-icon>
                      </template> -->
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col>
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              v-model="item.checkBooking"
                              label="นัดหมายเข้ารับบริการ"
                              @click="item.checkBooking === true ? selectEditAll('checkBooking',true) : selectEditAll('checkBooking',false)"
                            ></v-checkbox>
                          </v-col>
                          <v-col>
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              v-model="item.checkOnsite"
                              label="แจ้งเตือนพนักงาน Onsite"
                              @click="item.checkOnsite === true ? selectEditAll('checkOnsite',true) : selectEditAll('checkOnsite',false)"
                            ></v-checkbox>
                          </v-col>
                          <v-col>
                            <v-checkbox
                              class="pa-0 ma-0"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              v-model="item.checkJob"
                              label="กระดานการทำงาน"
                              @click="item.checkJob === true ? selectEditAll('checkJob',true) : selectEditAll('checkJob',false)"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
                <!-- <v-col class="pa-0" cols="12" md='12'>
                <v-container fluid>
                  <h4 class="text-center font-weight-black mb-5" style="color:#173053;">ประเภทบริการ</h4>
                   <v-row v-for="(item , index) in itemSelectEdit" :key="index" class="mb-1"  style="border-style: groove;">
                    <v-col cols="12" class="text-center">
                      <p class="pa-0 ma-0 mt-4 font-weight-black" style="color:#173053;" >{{item.text}}</p>
                    </v-col>
                    <v-col class="pa-0 ps-4 ma-0" cols="12">
                      <v-checkbox class="pa-0 ma-0"
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        v-model="item.checkBooking"
                        label="นัดหมายเข้ารับบริการ"
                      ></v-checkbox>
                      <v-checkbox class="pa-0 ma-0"
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        v-model="item.checkOnsite"
                        label="สำหรับพนักงาน Onsite"
                      ></v-checkbox>
                      <v-checkbox class="pa-0 ma-0"
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        v-model="item.checkJob"
                        label="กระดานการทำงาน"
                      ></v-checkbox>
                      <v-checkbox class="pa-0 ma-0"
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        v-model="item.checkEpmtime"
                        label="การบันทึกเวลาพนักงาน"
                      ></v-checkbox>
                    </v-col>
                   </v-row>
                </v-container>
              </v-col> -->
                <!-- <v-col class="pa-0" cols="6" md='6'>
                <v-container fluid>
                    <p class="text-center">การBooking</p>
                    <v-checkbox
                    v-model="BookingSend"
                    label="Booking"
                  ></v-checkbox>
                </v-container>
              </v-col> -->
              </v-row>
              <div class="mr-4">
                <v-btn
                  block
                  class="ma-2"
                  color="#14AE5C"
                  dark
                  large
                  @click="editData()"
                >
                  แก้ไขข้อมูล
                </v-btn>
              </div>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="LineGroupitem"
                :search="search"
              >
                <!-- <template v-slot:[`item.Img`]="{ item }">
              <v-avatar>
                <img
                  :src="item.Img"
                >
              </v-avatar>
            </template> -->
            <template v-slot:[`item.notifyLanguage`]="{ item }">
              <div style="display:flex;justify-content: center;" class="ma-3">
            <v-chip
              class="mr-1 font-weight-black"
              :style="'background-color:' + (item.notifyLanguage === 0 ? 'rgb(0, 31, 165)' : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="Editlanguage(item,0)"
              >
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-TH.png?alt=media&token=e4bd7ffa-aed9-47e3-9240-4dcb9d8d284e"></v-img>
              </v-avatar>
                TH
            </v-chip>
            <v-chip
              class="ml-1 font-weight-black"
              :style="'background-color:' + (item.notifyLanguage === 1 ? 'rgb(0, 31, 165)' : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
              dark
              @click="Editlanguage(item,1)"
              >
              <v-avatar left>
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-USA1.png?alt=media&token=a83dd820-f576-457a-8d08-1009cea9d70b"></v-img>
              </v-avatar>
                EN
            </v-chip>
          </div>
            </template>
                <template v-slot:[`item.action`]="{ item }">
                  <v-btn
                    color="info"
                    fab
                    v-if="item.accessToken === '' || item.accessToken === null"
                    small
                    dark
                    @click="gotoSelectGroup(item)"
                  >
                    <v-icon> mdi-send-clock </v-icon>
                  </v-btn>
                  <v-btn
                    color="#173053"
                    fab
                    x-small
                    dark
                    @click="setEdit(item), (dialog = true)"
                  >
                    <v-icon> mdi-wrench </v-icon>
                  </v-btn>
                  <v-btn
                    color="red"
                    fab
                    x-small
                    dark
                    @click="DeleteGroup(item)"
                  >
                    <v-icon> mdi-delete </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </div>
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
    // whenever question changes, this function will run
    // allBookingEdit (newQuestion, oldQuestion) {
    //   console.log('allBookingEdit', newQuestion, oldQuestion, this.itemSelectEdit)
    //   this.itemSelectEdit.forEach((item) => {
    //     item.checkBooking = newQuestion
    //   })
    // },
    // allOnsiteEdit (newQuestion, oldQuestion) {
    //   console.log('allBookingEdit', newQuestion, oldQuestion, this.itemSelectEdit)
    //   this.itemSelectEdit.forEach((item) => {
    //     item.checkOnsite = newQuestion
    //   })
    // },
    // allJobEdit (newQuestion, oldQuestion) {
    //   console.log('allBookingEdit', newQuestion, oldQuestion, this.itemSelectEdit)
    //   this.itemSelectEdit.forEach((item) => {
    //     item.checkJob = newQuestion
    //   })
    // }
  },
  data () {
    return {
      allBookingAdd: false,
      allJobAdd: false,
      allOnsiteAdd: false,
      allBookingEdit: false,
      allJobEdit: false,
      allOnsiteEdit: false,
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'จัดการ การแจ้งเตือน LineGroup',
          disabled: false,
          href: '/Master/SettingLineNotify'
        }
      ],
      dialog: false,
      dialogAdd: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      search: '',
      headers: [
        { text: 'ชื่อ / ชื่อกลุ่ม', value: 'target' },
        { text: 'ประเภท', value: 'targetType' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATEtext' },
        { text: 'วันที่แก้ไข', value: 'LAST_DATEtext' },
        {
          text: 'ภาษา',
          value: 'notifyLanguage',
          sortable: false,
          align: 'center'
        },
        {
          text: 'จัดการข้อมูล',
          value: 'action',
          sortable: false,
          align: 'center'
        }
      ],
      LineGroupitem: [],
      itemSelect: [],
      itemSelectEdit: [],
      Flowitem: [],
      BranchItem: [],
      itemBranch: [],
      itemBranchEdit: [],
      BookingSend: false,
      BookingSendEdit: false,
      idEdit: '',
      notifyId: '',
      flowData: [],
      panel: [],
      panelEdit: []
    }
  },
  async mounted () {
    this.getLineGroup()
    this.getDataBranch()
    this.getFLow()
  },
  methods: {
    clickAllbutton (text, title) {
      if (title === 'Edit') {
        if (text === 'checkBooking') {
          this.itemSelectEdit.forEach((item) => {
            item.checkBooking = this.allBookingEdit
          })
        }
        if (text === 'checkOnsite') {
          this.itemSelectEdit.forEach((item) => {
            item.checkOnsite = this.allOnsiteEdit
          })
        }
        if (text === 'checkJob') {
          this.itemSelectEdit.forEach((item) => {
            item.checkJob = this.allJobEdit
          })
        }
      }
      if (title === 'Add') {
        console.log('this.flowData', this.flowData)
        if (text === 'checkBooking') {
          this.flowData.forEach((item) => {
            item.checkBooking = this.allBookingAdd
          })
        }
        if (text === 'checkOnsite') {
          this.flowData.forEach((item) => {
            item.checkOnsite = this.allOnsiteAdd
          })
        }
        if (text === 'checkJob') {
          this.flowData.forEach((item) => {
            item.checkJob = this.allJobAdd
          })
        }
      }
    },
    selectAddAll (text, value) {
      // console.log('test', this.itemSelectEdit)
      if (text === 'checkBooking') {
        if (value === true) {
          if (this.flowData.filter((item) => item.checkBooking === true).length === this.flowData.length) {
            this.allBookingAdd = value
          }
        } else {
          this.allBookingAdd = value
        }
      }
      if (text === 'checkOnsite') {
        if (value === true) {
          if (this.flowData.filter((item) => item.checkOnsite === true).length === this.flowData.length) {
            this.allOnsiteAdd = value
          }
        } else {
          this.allOnsiteAdd = value
        }
      }
      if (text === 'checkJob') {
        if (value === true) {
          if (this.flowData.filter((item) => item.checkJob === true).length === this.flowData.length) {
            this.allJobAdd = value
          }
        } else {
          this.allJobAdd = value
        }
      }
    },
    selectEditAll (text, value) {
      // console.log('test', this.itemSelectEdit)
      if (text === 'checkBooking') {
        if (value === true) {
          if (this.itemSelectEdit.filter((item) => item.checkBooking === true).length === this.itemSelectEdit.length) {
            this.allBookingEdit = value
          }
        } else {
          this.allBookingEdit = value
        }
      }
      if (text === 'checkOnsite') {
        if (value === true) {
          if (this.itemSelectEdit.filter((item) => item.checkOnsite === true).length === this.itemSelectEdit.length) {
            this.allOnsiteEdit = value
          }
        } else {
          this.allOnsiteEdit = value
        }
      }
      if (text === 'checkJob') {
        if (value === true) {
          if (this.itemSelectEdit.filter((item) => item.checkJob === true).length === this.itemSelectEdit.length) {
            this.allJobEdit = value
          }
        } else {
          this.allJobEdit = value
        }
      }
    },
    clearDataAdd () {
      this.flowData.forEach((item) => {
        delete item.checkBooking
        delete item.checkJob
        delete item.checkOnsite
        this.allBookingAdd = false
        this.allJobAdd = false
        this.allOnsiteAdd = false
        this.itemBranch = []
      })
    },
    all () {
      this.panel = this.flowData.map((k, i) => i)
    },
    // Reset the panel
    none () {
      this.panel = []
    },
    allEdit () {
      this.panelEdit = this.itemSelectEdit.map((k, i) => i)
    },
    // Reset the panel
    noneEdit () {
      this.panelEdit = []
    },
    async getLineGroup () {
      this.LineGroupitem = []
      await axios
        .get(this.DNS_IP + '/lineNotifySetUp/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            this.LineGroupitem = rs
            // for (let i = 0; i < rs.length; i++) {
            //   let d = rs[i]
            //   let s = {}
            //   s.Id = d.Id
            //   s.GroupId = d.GroupId
            //   s.GroupName = d.LineGroupName
            //   s.Img = d.GroupImg
            //   this.LineGroupitem.push(s)
            // }
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async getFLow () {
      this.flowData = []
      await axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          console.log('rs2', rs)
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.flowName
              s.value = d.flowId
              this.flowData.push(s)
            }
            // this.flowData = rs
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
      console.log('this.flowData', this.flowData)
    },
    async getDataBranch () {
      this.BranchItem = []
      await axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          // console.log('212', rs)
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            d.text = d.masBranchName
            d.value = d.masBranchID
            this.BranchItem.push(d)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async Editlanguage (item, language) {
      console.log('item', item, 'language', language)
      let update = {
        'notifyLanguage': language
      }
      await axios
        .post(this.DNS_IP + '/lineNotifySetUp/edit/' + item.id, update)
        .then(async response => {
          await this.getLineGroup()
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async AddData () {
      let BranchJSON = []
      this.notifyId = moment().valueOf()
      // console.log('itemBrtanch', this.itemBranch)
      for (let i = 0; i < this.itemBranch.length; i++) {
        let d = this.itemBranch[i]
        let s = {}
        s.masBranchID = d
        BranchJSON.push(s)
      }
      let checkitemSelect = []
      console.log('flowData', this.flowData)
      this.flowData.forEach(v => {
        if (v.checkBooking === true) {
          checkitemSelect.push(v.checkBooking)
        } else if (v.checkJob === true) {
          checkitemSelect.push(v.checkJob)
        } else if (v.checkOnsite === true) {
          checkitemSelect.push(v.checkOnsite)
        }
      })
      let dataAdd = {}
      let bookingS = ''
      if (this.BookingSend) {
        bookingS = 'N'
      } else {
        bookingS = 'D'
      }
      if (checkitemSelect.length > 0) {
        dataAdd = {
          flowData: JSON.stringify(this.fixJsonData(this.flowData)),
          masBranchID: JSON.stringify(BranchJSON),
          BookingSend: bookingS,
          notifyLanguage: 0,
          shopId: this.shopId,
          notifyId: this.notifyId.toString(),
          CREATE_USER: this.$session.getAll().data.userName,
          LAST_USER: this.$session.getAll().data.userName
        }
      } else {
        dataAdd = {
          flowData: null,
          masBranchID: JSON.stringify(BranchJSON),
          BookingSend: bookingS,
          notifyLanguage: 0,
          shopId: this.shopId,
          notifyId: this.notifyId.toString(),
          CREATE_USER: this.$session.getAll().data.userName,
          LAST_USER: this.$session.getAll().data.userName
        }
      }
      console.log('test', dataAdd)
      if (checkitemSelect.length === 0) {
        this.$swal('ผิดพลาด', 'กรุณาเลือกรายการแจ้งเตือน', 'error')
      } else {
        if (BranchJSON.length > 0) {
          this.$swal({
            title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#b3b1ab',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          })
            .then(async (result) => {
              await axios
                .post(this.DNS_IP + '/lineNotifySetUp/add', dataAdd)
                .then(async response => {
                  this.$swal('บันทึกข้อมูลเรียบร้อย', ' ', 'success')
                  this.dialog = false
                  window.location.href =
                'https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=bH0O0FW2isiXycTQh9GoXp' +
                '&scope=notify&state=LQpoVxRXet0KHIKLNl5lyIySzAgIM5bIPVgKq74nvKd' +
                '&redirect_uri=https://betask-linked-admin.web.app/UpdateNotify?shopId=' +
                this.shopId +
                'notifyId' +
                this.notifyId
                })
              // eslint-disable-next-line handle-callback-err
                .catch(error => {
                  console.log('error function addData : ', error)
                })
            })
          console.log('dataAdd', dataAdd)
        } else {
          this.$swal('ผิดพลาด', 'กรุณาเลือกสาขา', 'error')
        }
      }
      // console.log('dataAdd', dataAdd)
    },
    async DeleteGroup (item) {
      console.log('item', item)
      item.shopId = this.shopId
      item.LAST_USER = this.$session.getAll().data.userName
      this.$swal({
        title: 'ต้องการ ลบข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async () => {
        await axios
          .post(this.DNS_IP + '/lineNotifySetUp/delete/' + item.id, item)
          .then(async response => {
            this.$swal('ลบข้อมูลเรียบร้อย', ' ', 'success')
            this.getLineGroup()
            this.getDataBranch()
            this.getFLow()
          })
          // eslint-disable-next-line handle-callback-err
          .catch(error => {
            console.log('error function addData : ', error)
          })
      })
    },
    gotoSelectGroup (item) {
      window.location.href =
        'https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=bH0O0FW2isiXycTQh9GoXp' +
        '&scope=notify&state=LQpoVxRXet0KHIKLNl5lyIySzAgIM5bIPVgKq74nvKd' +
        '&redirect_uri=https://betask-linked-admin.web.app/UpdateNotify?shopId=' +
        item.shopId +
        'notifyId' +
        item.notifyId
    },
    async setEdit (item) {
      console.log('item', item)
      console.log('this.flowData', this.flowData)
      // console.log('this.BranchItem', this.BranchItem)
      this.itemBranchEdit = []
      this.itemSelectEdit = []
      this.idEdit = item.id
      this.flowData.forEach((v, k) => {
        if (JSON.parse(item.flowData).filter(a => a.value === v.value).length > 0) {
          // this.itemSelectEdit.push(JSON.parse(item.flowData).filter(a => a.value === v.value)[0])
          JSON.parse(item.flowData).forEach((itemJS) => {
            if (itemJS.value === v.value) {
              itemJS.text = v.text
              this.itemSelectEdit.push(itemJS)
            }
            // console.log('itemJS', itemJS)
          })
        } else {
          this.itemSelectEdit.push({ text: v.text, value: v.value })
        }
      })
      if (this.itemSelectEdit.filter((item) => item.checkBooking === true).length === this.itemSelectEdit.length) {
        this.allBookingEdit = true
      } else {
        this.allBookingEdit = false
      }
      if (this.itemSelectEdit.filter((item) => item.checkJob === true).length === this.itemSelectEdit.length) {
        this.allJobEdit = true
      } else {
        this.allJobEdit = false
      }
      if (this.itemSelectEdit.filter((item) => item.checkOnsite === true).length === this.itemSelectEdit.length) {
        this.allOnsiteEdit = true
      } else {
        this.allOnsiteEdit = false
      }
      // console.log('itemSelectEdit', this.itemSelectEdit)
      // this.BranchItem.forEach((v, k) => {
      //   if (JSON.parse(item.masBranchID).filter((a) => a.value === v.value).length > 0) {
      //     this.itemSelectEdit.push(JSON.parse(item.flowData).filter((a) => a.value === v.value)[0])
      //   } else {
      //     this.itemSelectEdit.push({'text': v.text, 'value': v.value})
      //   }
      // })
      JSON.parse(item.masBranchID).forEach((v, k) => {
        this.itemBranchEdit.push(v.masBranchID)
      })
      if (item.BookingSend === 'N') {
        this.BookingSendEdit = true
      } else {
        this.BookingSendEdit = false
      }
      console.log('itemSelectEdit', this.itemSelectEdit)
      await this.allEdit()
    },
    fixJsonData (data) {
      return data.map(item => {
        item.text = item.text.trim()
        if (item.text.includes('"')) {
          // แก้ไขข้อมูลในกรณีที่มี " ในข้อความ
          item.text = item.text.replace(/"/g, '\\"')
          // item.text = item.text.trim()
        }
        return item
      })
    },
    async editData () {
      console.log('this.itemSelectEdit', this.itemSelectEdit)
      var bookingS = ''
      if (this.BookingSendEdit) {
        bookingS = 'N'
      } else {
        bookingS = 'D'
      }
      let BranchJSON = []
      // console.log('itemBrtanch', this.itemBranch)
      for (let i = 0; i < this.itemBranchEdit.length; i++) {
        let d = this.itemBranchEdit[i]
        // console.log('d', d)
        let s = {}
        s.masBranchID = d
        BranchJSON.push(s)
      }
      // for (let i = 0; i < this.itemSelectEdit.length; i++) {
      //   let d = this.itemSelectEdit[i]
      //   d.text = d.text.replace(/['"]/g, '')
      //   console.log('d', d)
      // }
      // console.log('JSON.stringify(this.itemSelectEdit)', JSON.stringify(this.itemSelectEdit))
      var data = {
        flowData: JSON.stringify(this.fixJsonData(this.itemSelectEdit)),
        masBranchID: JSON.stringify(BranchJSON),
        BookingSend: bookingS,
        LAST_USER: this.$session.getAll().data.userName
      }
      let checkitemSelect = []
      this.itemSelectEdit.forEach(v => {
        if (v.checkBooking === true) {
          checkitemSelect.push(v.checkBooking)
        } else if (v.checkJob === true) {
          checkitemSelect.push(v.checkJob)
        } else if (v.checkOnsite === true) {
          checkitemSelect.push(v.checkOnsite)
        }
      })
      // console.log('checkitemselect', checkitemSelect)
      if (checkitemSelect.length === 0) {
        this.$swal('ผิดพลาด', 'กรุณาเลือกรายการแจ้งเตือน', 'error')
      } else {
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
              .post(this.DNS_IP + '/lineNotifySetUp/edit/' + this.idEdit, data)
              .then(async response => {
                this.$swal('แก้ไขเรียบร้อย', ' ', 'success')
                await this.getLineGroup()
                this.dialog = false
              })
              .catch(error => {
                console.log('error function addData : ', error)
              })
          })
      }
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
