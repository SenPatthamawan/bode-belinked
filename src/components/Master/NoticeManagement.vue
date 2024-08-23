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
            <v-btn color="primary" depressed @click="dialogSendNotic = true">
              <v-icon left>mdi-text-box-plus</v-icon>
              ตั้งค่าการแจ้งเตือน
            </v-btn>
          </v-col>
        </v-row>
        <v-dialog
          v-model="dialogSendNotic"
          persistent
          width="40%"
        >
          <v-card class="pa-3" min-height="600" style="overflow-x: hidden;">
            <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
                <v-col cols="10" class="text-left pt-10">
                <h3><strong>ตั้งค่าการแจ้งเตือน</strong></h3>
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
                    @click="reset"
                    >
                    X
                    </v-btn>
                </div>
                </v-col>
            </v-row>
            <v-col class="text-left py-0">
              <p class="font-weight-medium"  style="color:#000000;"><v-icon class="mr-1" color="#69D1FD" style="font-size: 10px">mdi-checkbox-blank-circle</v-icon>ประเภทการแจ้งเตือน</p>
            </v-col>
            <v-row class="pa-3 ma-0">
              <v-col cols="6" class="pa-1">
              <v-select
                v-model="formSendNotify.NoticeType"
                dense
                :items="NoticeType"
                label="ประเภทการแจ้งเตือน"
                outlined
                append-icon="mdi-bell-circle-outline"
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
              </v-col>
              <v-col cols="6" class="pa-1" v-if="formSendNotify.NoticeType === 'setdate'">
              <v-select
                v-model="formSendNotify.setTime"
                dense
                :items="timeSenditem"
                label="ตั้งเวลาแจ้งเตือน"
                outlined
                append-icon="mdi-clock"
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
              </v-col>
            </v-row>
            <v-col class="text-left py-0">
              <p class="font-weight-medium"  style="color:#000000;"><v-icon class="mr-1" color="#69D1FD" style="font-size: 10px">mdi-checkbox-blank-circle</v-icon>สร้างกลุ่มเป้าหมาย</p>
            </v-col>
            <v-row class="pa-3 ma-0">
              <v-col cols="6" class="pa-1">
              <v-select
                v-model="formSendNotify.flowId"
                dense
                :items="DataFlowName"
                label="เลือกประเภทบริการ"
                outlined
                append-icon="mdi-map"
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-select
                v-if="session.data.empId === null"
                v-model="formSendNotify.empSelect"
                dense
                :items="dataEmp"
                label="เลือกพนักงาน"
                outlined
                append-icon="mdi-account-arrow-right"
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>
            <v-col cols="6" class="pa-1 mt-n4" v-if="formSendNotify.NoticeType === 'fixdate'">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formSendNotify.targetDate"
                    label="วันที่นัดหมาย"
                    append-icon="mdi-calendar"
                    color-icon
                    outlined
                    dense
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="required"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formSendNotify.targetDate"
                  no-title
                  scrollable
                  :rules="required"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6" class="pa-1 mt-n4" v-if="formSendNotify.NoticeType === 'setdate'">
              <v-select
                v-model="formSendNotify.setDate"
                dense
                :items="setdateItem"
                label="วันที่นัดหมาย"
                outlined
                append-icon="mdi-calendar"
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>
            <v-col cols="6" class="pa-1 mt-n4">
              <v-select
                dense
                v-model="formSendNotify.afterTime"
                :items="timeavailable"
                label="ตั่งแต่เวลา"
                outlined
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>
            </v-row>
            <v-col class="text-left py-0">
              <p class="font-weight-medium"  style="color:#000000;"><v-icon class="mr-1" color="#69D1FD" style="font-size: 10px">mdi-checkbox-blank-circle</v-icon>ตั้งค่ากลุ่มแจ้งเตือน</p>
              <v-radio-group
                v-model="formSendNotify.confirmOnly"
                row
                :rules="required"
              >
                <v-radio
                  label="ลูกค้าที่ยังไม่ได้เข้ารับบริการ"
                  value="confirm"
                  :on-icon="'mdi-checkbox-marked'"
                  :off-icon="'mdi-checkbox-blank-outline'"
                  color="#1B437C"
                ></v-radio>
                <v-radio
                  label="ลูกค้าที่เข้ารับบริการแล้ว"
                  value="confirmJob"
                  :on-icon="'mdi-checkbox-marked'"
                  :off-icon="'mdi-checkbox-blank-outline'"
                  color="#1B437C"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col class="py-0" v-if="formSendNotify.NoticeType === 'fixdate'">
                <v-row>
                  <v-col cols="6" >
                    <p class="font-weight-medium text-left mt-1"  style="color:#000000;">
                    <v-icon class="mr-1" color="#69D1FD" style="font-size: 10px">mdi-checkbox-blank-circle</v-icon>
                    ตรวจสอบรายชื่อลูกค้า
                    <v-btn
                    class="mx-2"
                    fab
                    small
                    dark
                    color="#14AE5C"
                    @click="getMemberList()"
                  >
                    <v-icon dark>
                      mdi-file-search
                    </v-icon>
                  </v-btn>
                    </p>
                  </v-col>
                  <v-col cols="6" >
                    <p class="font-weight-medium text-right mt-3"  style="color:#000000;">
                    {{'จำนวนลูกค้า  ' +  memberData.length + '  คน'}}
                    </p>
                  </v-col>
                </v-row>
              <v-card class="scroll pa-3 pl-6" height="155px">
                <v-row>
                  <v-col cols="4" class="mt-1" v-for="(item,index) in memberData" :key="index">
                    <v-sheet class="pa-1">
                      <v-row >
                        <v-col cols="4" class="pa-1">
                          <v-avatar>
                            <img
                               v-if="item.memberPicture"
                              :src="item.memberPicture"
                            >
                            <v-icon dark v-else>
                              mdi-account-circle
                            </v-icon>
                          </v-avatar>
                        </v-col>
                        <v-col cols="8" class="pa-1 mt-3">
                          <p>{{item.memberName}}</p>
                        </v-col>
                      </v-row>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col class="text-left py- mt-3 pb-0">
              <p class="font-weight-medium"  style="color:#000000;"><v-icon class="mr-1" color="#69D1FD" style="font-size: 10px">mdi-checkbox-blank-circle</v-icon>ข้อความ</p>
                <v-textarea
                    v-model="formSendNotify.message"
                    outlined
                    name="input-7-4"
                    label="ข้อความ"
                    rows="4"
                    row-height="6"
                    :rules="required"
                  ></v-textarea>
            </v-col>
            <v-col cols="12" class="pt-0" v-if="formSendNotify.NoticeType === 'fixdate'">
              <v-btn
                block
                class="ma-2 ml-n1"
                color="#14AE5C"
                dark
                large
                :readonly="!valid"
                @click="validate"
              >
                ส่งข้อความ
              </v-btn>
            </v-col>
            <v-col cols="12" class="pt-0" v-else>
              <v-btn
                block
                class="ma-2 ml-n1"
                color="#14AE5C"
                dark
                large
                :readonly="!valid"
                @click="validate"
              >
                บันทึกการแจ้งเตือน
              </v-btn>
            </v-col>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogSendNoticEdit"
          persistent
          width="40%"
        >
          <v-card class="pa-3" min-height="600" style="overflow-x: hidden;">
            <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
                <v-col cols="10" class="text-left pt-10">
                <h3><strong>ตั้งค่าการแจ้งเตือน</strong></h3>
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
                    @click="dialogSendNoticEdit = false, clearDataEdit()"
                    >
                    X
                    </v-btn>
                </div>
                </v-col>
            </v-row>
            <v-col class="text-left py-0">
              <p class="font-weight-medium"  style="color:#000000;"><v-icon class="mr-1" color="#69D1FD" style="font-size: 10px">mdi-checkbox-blank-circle</v-icon>ประเภทการแจ้งเตือน</p>
            </v-col>
            <v-row class="pa-3 ma-0">
              <v-col cols="6" class="pa-1">
              <v-select
                v-model="formSendNotifyEdit.NoticeType"
                dense
                :items="NoticeTypeEdit"
                label="ประเภทการแจ้งเตือน"
                outlined
                append-icon="mdi-bell-circle-outline"
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>
            <v-col cols="6" class="pa-1" v-if="formSendNotifyEdit.NoticeType === 'setdate'">
              <v-select
                v-model="formSendNotifyEdit.setTime"
                dense
                :items="timeSenditem"
                label="ตั้งเวลาแจ้งเตือน"
                outlined
                append-icon="mdi-clock"
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
              </v-col>
            </v-row>
            <v-col class="text-left py-0">
              <p class="font-weight-medium"  style="color:#000000;"><v-icon class="mr-1" color="#69D1FD" style="font-size: 10px">mdi-checkbox-blank-circle</v-icon>สร้างกลุ่มเป้าหมาย</p>
            </v-col>
            <v-row class="pa-3 ma-0">
              <v-col cols="6" class="pa-1">
              <v-select
                v-model="formSendNotifyEdit.flowId"
                dense
                :items="DataFlowName"
                label="เลือกประเภทบริการ"
                outlined
                append-icon="mdi-map"
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-select
                v-if="session.data.empId === null"
                v-model="formSendNotifyEdit.empSelect"
                dense
                :items="dataEmp"
                label="เลือกพนักงาน"
                outlined
                append-icon="mdi-account-arrow-right"
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>
            <v-col cols="6" class="pa-1 mt-n4" v-if="formSendNotifyEdit.NoticeType === 'fixdate'">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formSendNotifyEdit.targetDate"
                    label="วันที่นัดหมาย"
                    append-icon="mdi-calendar"
                    color-icon
                    outlined
                    dense
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="required"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formSendNotifyEdit.targetDate"
                  no-title
                  scrollable
                  :rules="required"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6" class="pa-1 mt-n4" v-if="formSendNotifyEdit.NoticeType === 'setdate'">
              <v-select
                v-model="formSendNotifyEdit.setDate"
                dense
                :items="setdateItem"
                label="วันที่นัดหมาย"
                outlined
                append-icon="mdi-calendar"
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>
            <v-col cols="6" class="pa-1 mt-n4">
              <v-select
                dense
                v-model="formSendNotifyEdit.afterTime"
                :items="timeavailable"
                label="ตั่งแต่เวลา"
                outlined
                :rules="required"
                attach
            :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>
            </v-row>
            <v-col class="text-left py-0">
              <p class="font-weight-medium"  style="color:#000000;"><v-icon class="mr-1" color="#69D1FD" style="font-size: 10px">mdi-checkbox-blank-circle</v-icon>ตั้งค่ากลุ่มแจ้งเตือน</p>
              <v-radio-group
                v-model="formSendNotifyEdit.confirmOnly"
                row
                :rules="required"
              >
                <v-radio
                  label="ลูกค้าที่ยังไม่ได้เข้ารับบริการ"
                  value="confirm"
                  :on-icon="'mdi-checkbox-marked'"
                  :off-icon="'mdi-checkbox-blank-outline'"
                  color="#1B437C"
                ></v-radio>
                <v-radio
                  label="ลูกค้าที่เข้ารับบริการแล้ว"
                  value="confirmJob"
                  :on-icon="'mdi-checkbox-marked'"
                  :off-icon="'mdi-checkbox-blank-outline'"
                  color="#1B437C"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col class="py-0" v-if="formSendNotifyEdit.NoticeType === 'fixdate'">
                <v-row>
                  <v-col cols="6" >
                    <p class="font-weight-medium text-left mt-1"  style="color:#000000;">
                    <v-icon class="mr-1" color="#69D1FD" style="font-size: 10px">mdi-checkbox-blank-circle</v-icon>
                    ตรวจสอบรายชื่อลูกค้า
                    <v-btn
                    class="mx-2"
                    fab
                    small
                    dark
                    color="#14AE5C"
                    @click="getMemberList()"
                  >
                    <v-icon dark>
                      mdi-file-search
                    </v-icon>
                  </v-btn>
                    </p>
                  </v-col>
                  <v-col cols="6" >
                    <p class="font-weight-medium text-right mt-3"  style="color:#000000;">
                    {{'จำนวนลูกค้า  ' +  memberData.length + '  คน'}}
                    </p>
                  </v-col>
                </v-row>
              <v-card class="scroll pa-3 pl-6" height="155px">
                <v-row>
                  <v-col cols="4" class="mt-1" v-for="(item,index) in memberData" :key="index">
                    <v-sheet class="pa-1">
                      <v-row >
                        <v-col cols="4" class="pa-1">
                          <v-avatar>
                            <img
                               v-if="item.memberPicture"
                              :src="item.memberPicture"
                            >
                            <v-icon dark v-else>
                              mdi-account-circle
                            </v-icon>
                          </v-avatar>
                        </v-col>
                        <v-col cols="8" class="pa-1 mt-3">
                          <p>{{item.memberName}}</p>
                        </v-col>
                      </v-row>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col class="text-left py- mt-3 pb-0">
              <p class="font-weight-medium"  style="color:#000000;"><v-icon class="mr-1" color="#69D1FD" style="font-size: 10px">mdi-checkbox-blank-circle</v-icon>ข้อความ</p>
                <v-textarea
                    v-model="formSendNotifyEdit.message"
                    outlined
                    name="input-7-4"
                    label="ข้อความ"
                    rows="4"
                    row-height="6"
                    :rules="required"
                  ></v-textarea>
            </v-col>
            <v-col cols="12" class="pt-0" >
              <v-btn
                block
                class="ma-2 ml-n1"
                color="#14AE5C"
                dark
                large
                :readonly="!valid"
                @click="updateNotice()"
              >
                บันทึกการแจ้งเตือน
              </v-btn>
            </v-col>
            </v-form>
          </v-card>
        </v-dialog>
        <v-row>
         <v-col cols="12">
            <v-card elevation="7" v-if="dataItem">
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
                  :headers="headers"
                  :items="dataItem"
                  :search="searchAll2"
                  :items-per-page="10"
                >
                   <template v-slot:[`item.sendDate`]="{ item }">
                      {{ item.sendDate }}
                  </template>
                   <template v-slot:[`item.targetDate`]="{ item }">
                      {{ item.targetDate }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      v-if="item.NoticeType === 'ส่งข้อความซ้ำ'"
                      color="blue"
                      fab
                      small
                      @click="EditNotice(item), dialogSendNoticEdit = true"
                    >
                      <v-icon color="#FFFFFF"> mdi-tools </v-icon>
                    </v-btn>
                    <v-btn
                      color="red"
                      fab
                      small
                      @click="DeleteNotice(item)"
                    >
                      <v-icon color="#FFFFFF"> mdi-delete </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
// import moment from 'moment'

export default {
  components: {
    waitingAlert,
    'left-menu-admin': adminLeftMenu
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
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'จัดการ NoticeManagement',
          disabled: false,
          href: '/Master/NoticeManagement'
        }
      ],
      dialogSendNotic: false,
      dialogSendNoticEdit: false,
      headers: [
        { text: 'วันที่ส่งข้อความ', value: 'sendDate' },
        { text: 'วันที่นัดหมาย', value: 'targetDate' },
        { text: 'ตั้งแต่เวลา', value: 'afterTime' },
        { text: 'เวลาที่ส่งข้อความ', value: 'setTimeText' },
        { text: 'ประเภทการแจ้งเตือน', value: 'NoticeType' },
        { text: 'จำนวนข้อความ', value: 'memberCnt' },
        { text: 'ผู้ส่งข้อความ', value: 'empFull' },
        { text: 'Action', value: 'action', sortable: false, align: 'center' }

      ],
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      date: '',
      valid: true,
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        IDcardRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: value => !!value || '',
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
      required: [
        v => !!v || 'กรุณากรอกข้อมูล'
      ],
      searchAll2: '',
      formSendNotify: {
        flowId: '',
        targetDate: '',
        setDate: '',
        setTime: '',
        afterTime: '',
        confirmOnly: '',
        memberCnt: '',
        memberList: null,
        message: '',
        shopId: '',
        empSelect: '',
        CREATE_USER: '',
        LAST_USER: '',
        NoticeType: ''
      },
      formSendNotifyEdit: {
        id: '',
        noticeNo: '',
        setTime: '',
        flowId: '',
        setDate: '',
        afterTime: '',
        confirmOnly: '',
        memberCnt: '',
        memberList: null,
        message: '',
        shopId: '',
        empSelect: '',
        CREATE_USER: '',
        LAST_USER: '',
        NoticeType: ''
      },
      menu: false,
      NoticeType: [
        {
          'text': 'ส่งครั้งเดียว',
          'value': 'fixdate'
        },
        {
          'text': 'ส่งซ้ำ',
          'value': 'setdate'
        }
      ],
      NoticeTypeEdit: [
        {
          'text': 'ส่งซ้ำ',
          'value': 'setdate'
        }
      ],
      setdateItem: [
        {
          'text': 'ย้อนหลัง 1 วัน',
          'value': 'yesterday'
        },
        {
          'text': 'ตามวันที่นัดหมาย',
          'value': 'today'
        },
        {
          'text': 'ล่วงหน้า 1 วัน',
          'value': 'tomorrow'
        }
      ],
      dataItem: null,
      timeavailable: [{'id': 1, 'value': '08:00', 'text': '08:00', 'limitBooking': ''}, {'id': 2, 'value': '08:30', 'text': '08:30', 'limitBooking': ''}, {'id': 3, 'value': '09:00', 'text': '09:00', 'limitBooking': ''}, {'id': 4, 'value': '09:30', 'text': '09:30', 'limitBooking': ''}, {'id': 5, 'value': '10:00', 'text': '10:00', 'limitBooking': ''}, {'id': 6, 'value': '10:30', 'text': '10:30', 'limitBooking': ''}, {'id': 7, 'value': '11:00', 'text': '11:00', 'limitBooking': ''}, {'id': 8, 'value': '11:30', 'text': '11:30', 'limitBooking': ''}, {'id': 9, 'value': '12:00', 'text': '12:00', 'limitBooking': ''}, {'id': 10, 'value': '12:30', 'text': '12:30', 'limitBooking': ''}, {'id': 11, 'value': '13:00', 'text': '13:00', 'limitBooking': ''}, {'id': 12, 'value': '13:30', 'text': '13:30', 'limitBooking': ''}, {'id': 13, 'value': '14:00', 'text': '14:00', 'limitBooking': ''}, {'id': 14, 'value': '14:30', 'text': '14:30', 'limitBooking': ''}, {'id': 15, 'value': '15:00', 'text': '15:00', 'limitBooking': ''}, {'id': 16, 'value': '15:30', 'text': '15:30', 'limitBooking': ''}, {'id': 17, 'value': '16:00', 'text': '16:00', 'limitBooking': ''}, {'id': 18, 'value': '16:30', 'text': '16:30', 'limitBooking': ''}, {'id': 19, 'value': '17:00', 'text': '17:00', 'limitBooking': ''}],
      timeSenditem: [{'id': 1, 'value': '8', 'text': '08:00', 'limitBooking': ''},
        {'id': 2, 'value': '9', 'text': '09:00'},
        {'id': 3, 'value': '10', 'text': '10:00'},
        {'id': 4, 'value': '11', 'text': '11:00'},
        {'id': 5, 'value': '12', 'text': '12:00'},
        {'id': 6, 'value': '13', 'text': '13:00'},
        {'id': 7, 'value': '14', 'text': '14:00'},
        {'id': 8, 'value': '15', 'text': '15:00'},
        {'id': 9, 'value': '16', 'text': '16:00'},
        {'id': 10, 'value': '17', 'text': '17:00'},
        {'id': 11, 'value': '18', 'text': '18:00'},
        {'id': 12, 'value': '19', 'text': '19:00'},
        {'id': 13, 'value': '20', 'text': '20:00'},
        {'id': 14, 'value': '21', 'text': '21:00'},
        {'id': 15, 'value': '22', 'text': '22:00'},
        {'id': 16, 'value': '23', 'text': '23:00'}],
      DataFlowName: [],
      DataFlowNameAll: [],
      memberData: [],
      dataEmp: []
    }
  },
  async mounted () {
    await this.getnotice()
    await this.getDataFlow()
    await this.getEmp()
  },
  methods: {
    validate () {
      // this.$refs.form.validate()
      if (this.$refs.form.validate()) {
        this.addNotice()
      }
    },
    reset () {
      this.$refs.form.resetValidation()
      this.dialogSendNotic = false
    },
    async getnotice () {
      this.dataItem = []
      await axios
        .get(this.DNS_IP + '/notice/get?shopId=' + this.shopId).then((response) => {
          let rs = response.data
          console.log('this.rs', rs)
          if (rs.length > 0) {
            // this.dataItem = rs
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              if (d.NoticeType === 'fixdate') {
                s.flowId = d.flowId
                s.id = d.id
                s.confirmOnly = d.confirmOnly
                s.noticeNo = d.noticeNo
                s.sendDate = this.format_date(d.sendDate)
                s.targetDate = this.momenDate_1(d.targetDate)
                s.afterTime = d.afterTime
                s.NoticeType = 'ส่งข้อความครั้งเดียว'
                s.NoticeTypeitem = d.NoticeType
                s.memberCnt = d.memberCnt
                s.empFull = d.empFull
                s.empId = d.empSelect
                s.message = d.message
                s.setTime = d.setTime
                if (d.setTime !== null && d.setTime !== '') {
                  s.setTimeText = this.timeSenditem.filter((v) => v.value === d.setTime.toString())[0].text + ' น.'
                } else {
                  s.setTimeText = ''
                }
              } else {
                s.flowId = d.flowId
                s.id = d.id
                s.confirmOnly = d.confirmOnly
                s.noticeNo = d.noticeNo
                s.sendDate = 'ตามเงือนไขที่ระบุ'
                s.targetDate = this.setdateItem.filter((v) => v.value === d.setDate)[0].text
                s.afterTime = d.afterTime
                s.NoticeType = 'ส่งข้อความซ้ำ'
                s.NoticeTypeitem = d.NoticeType
                s.memberCnt = 'ไม่ระบุ'
                s.empFull = d.empFull
                s.empId = d.empSelect
                s.message = d.message
                s.setTime = d.setTime
                if (d.setTime !== null && d.setTime !== '') {
                  s.setTimeText = this.timeSenditem.filter((v) => v.value === d.setTime.toString())[0].text + ' น.'
                } else {
                  s.setTimeText = ''
                }
              }
              this.dataItem.push(s)
            }
            console.log('this.dataItem', this.dataItem)
          } else {
            this.dataItem = []
          }
          console.log('this.dataItem', this.dataItem)
        }).catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    async getDataFlow () {
      this.DataFlowName = []
      this.DataFlowNameAll = []
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        console.log('getDataFlow', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.text = d.flowName
            s.textEng = d.flowNameEn
            s.value = d.flowId
            this.DataFlowName.push(s)
            this.DataFlowNameAll.push(d)
          }
          let s = {}
          s.text = 'ทั้งหมด'
          s.textEng = 'All'
          s.value = 'All'
          this.DataFlowName.push(s)
          console.log('this.DataFlowNameAll', this.DataFlowNameAll)
        } else {
          this.DataFlowName = []
          this.DataFlowNameAll = []
        }
      })
    },
    async setTime () {
      this.timeavailable = JSON.parse(this.DataFlowNameAll.filter(item => { return item.flowId === this.formSendNotify.flowId })[0].setTime) || []
    },
    async getMemberList () {
      console.log('test', this.formSendNotify)
      this.memberData = []
      let Url = ''
      if (this.formSendNotify.flowId === 'All') {
        Url = this.DNS_IP + '/notice/NoticMember?targetDate=' + this.formSendNotify.targetDate +
      '&afterTime=' + this.formSendNotify.afterTime + '&shopId=' + this.shopId + '&confirmOnly=' + this.formSendNotify.confirmOnly
      } else {
        Url = this.DNS_IP + '/notice/NoticMember?targetDate=' + this.formSendNotify.targetDate +
      '&afterTime=' + this.formSendNotify.afterTime + '&flowId=' +
      this.formSendNotify.flowId + '&shopId=' + this.shopId + '&confirmOnly=' + this.formSendNotify.confirmOnly
      }
      if (this.formSendNotify.targetDate !== '' && this.formSendNotify.afterTime !== '' && this.formSendNotify.flowId !== '' && this.formSendNotify.confirmOnly !== '') {
        await axios.get(Url)
          .then(response => {
            let rs = response.data
            console.log('getMemberList', rs)
            if (rs.length > 0) {
              for (var i = 0; i < rs.length; i++) {
                let d = rs[i]
                if (d.lineUserId !== null) {
                  if (this.memberData.filter((item) => item.lineUserId === d.lineUserId).length === 0) {
                    let s = {}
                    s.lineUserId = d.lineUserId
                    s.memberPicture = d.memberPicture
                    s.memberName = d.memberName
                    this.memberData.push(s)
                  }
                }
              }
              if (this.memberData.length === 0) {
                this.$swal('ไม่พบข้อมูลลูกค้า', 'กรุณาตรวจสอบเงือนไข', 'warning')
              }
              console.log('this.memberData', this.memberData)
            } else {
              this.$swal('ไม่พบข้อมูลลูกค้า', 'กรุณาตรวจสอบเงือนไข', 'warning')
            }
          }).catch((error) => {
            console.log(error)
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาเลือกเงือนไขให้ครบ', 'error')
      }
    },
    async getEmp () {
      this.dataEmp = []
      await axios.get(this.DNS_IP + '/empSelect/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.text = d.empFull_NameTH
            s.value = d.empId
            this.dataEmp.push(s)
          }
        } else {
          this.dataEmp = []
        }
      })
      console.log('dataEmp', this.dataEmp)
    },
    async EditNotice (item) {
      this.formSendNotifyEdit.id = item.id
      this.formSendNotifyEdit.noticeNo = item.noticeNo
      this.formSendNotifyEdit.NoticeType = item.NoticeTypeitem
      this.formSendNotifyEdit.flowId = parseInt(item.flowId)
      this.formSendNotifyEdit.afterTime = item.afterTime
      this.formSendNotifyEdit.empSelect = item.empId
      this.formSendNotifyEdit.setDate = this.setdateItem.filter((v) => v.text === item.targetDate)[0].value
      this.formSendNotifyEdit.confirmOnly = item.confirmOnly
      this.formSendNotifyEdit.message = item.message
      if (item.setTime !== null && item.setTime !== '') {
        this.formSendNotifyEdit.setTime = item.setTime.toString()
      } else {
        this.formSendNotifyEdit.setTime = ''
      }
      console.log('this.formSend', this.formSendNotifyEdit)
    },
    async updateNotice () {
      this.formSendNotifyEdit.shopId = this.shopId
      if (this.memberData.length > 0) {
        this.formSendNotifyEdit.memberList = JSON.stringify(this.memberData.map((item) => { return item.lineUserId }))
        this.formSendNotifyEdit.memberCnt = this.memberData.length
      } else {
        this.formSendNotifyEdit.memberList = ''
        this.formSendNotifyEdit.memberCnt = 0
      }
      if (this.session.data.empId !== null) {
        this.formSendNotifyEdit.empSelect = this.session.data.empId
      } else {
        this.formSendNotifyEdit.empSelect = this.formSendNotifyEdit.empSelect
      }
      this.formSendNotifyEdit.CREATE_USER = this.$session.getAll().data.userName
      this.formSendNotifyEdit.LAST_USER = this.$session.getAll().data.userName
      console.log('this.formSendNotifyEdit', this.formSendNotifyEdit)
      await axios
        .post(this.DNS_IP + '/notice/edit/' + this.formSendNotifyEdit.id, this.formSendNotifyEdit)
        .then(async (response) => {
          console.log('response', response)
          this.$swal('บันทึกข้อมูลเรียบร้อย', ' ', 'success')
          this.dialogSendNoticEdit = false
          await this.getMethod()
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    async addNotice () {
      this.formSendNotify.shopId = this.shopId
      if (this.memberData.length > 0) {
        this.formSendNotify.memberList = JSON.stringify(this.memberData.map((item) => { return item.lineUserId }))
        this.formSendNotify.memberCnt = this.memberData.length
      } else {
        this.formSendNotify.memberList = ''
        this.formSendNotify.memberCnt = 0
      }
      if (this.session.data.empId !== null) {
        this.formSendNotify.empSelect = this.session.data.empId
      } else {
        this.formSendNotify.empSelect = this.formSendNotify.empSelect
      }
      this.formSendNotify.CREATE_USER = this.$session.getAll().data.userName
      this.formSendNotify.LAST_USER = this.$session.getAll().data.userName
      console.log('this.formSendNotify', this.formSendNotify)
      if (this.valid !== false) {
        await axios
          .post(this.DNS_IP + '/notice/add', this.formSendNotify)
          .then(async (response) => {
            console.log('response', response)
            let noticeNo = response.data.noticeNo
            if (this.formSendNotify.NoticeType === 'fixdate') {
              if (noticeNo) {
                await this.sendMulticast(noticeNo)
                await this.clearData()
                await this.getMethod()
              }
            } else {
              if (noticeNo) {
                this.$swal('บันทึกข้อมูลเรียบร้อย', ' ', 'success')
                await this.clearData()
                await this.getMethod()
              }
            }
          })
        // eslint-disable-next-line handle-callback-err
          .catch((error) => {
            console.log('error function addData : ', error)
          })
      }
    },
    async sendMulticast (noticeNo) {
      await axios
        .post(this.DNS_IP + '/notice/sendMulticast/' + noticeNo)
        .then(async (response) => {
          console.log('response', response)
          this.$swal('บันทึกข้อมูลเรียบร้อย', ' ', 'success')
        })
      // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    async DeleteNotice (item) {
      item.shopId = this.shopId
      item.LAST_USER = this.$session.getAll().data.userName
      console.log('item', item)
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
          .post(this.DNS_IP + '/notice/delete/' + item.id, item)
          .then(async response => {
            this.$swal('ลบข้อมูลเรียบร้อย', ' ', 'success')
            await this.getnotice()
            await this.getDataFlow()
            await this.getEmp()
          })
          // eslint-disable-next-line handle-callback-err
          .catch(error => {
            console.log('error function addData : ', error)
          })
      })
    },
    async clearDataEdit () {
      this.formSendNotifyEdit.id = ''
      this.formSendNotifyEdit.noticeNo = ''
      this.formSendNotifyEdit.NoticeType = ''
      this.formSendNotifyEdit.flowId = ''
      this.formSendNotifyEdit.afterTime = ''
      this.formSendNotifyEdit.empSelect = ''
      this.formSendNotifyEdit.setDate = ''
      this.formSendNotifyEdit.confirmOnly = ''
      this.formSendNotifyEdit.message = ''
      this.formSendNotifyEdit.setTime = ''
    },
    async clearData () {
      this.reset()
      this.dialogSendNotic = false
      this.memberData = []
      this.formSendNotify.flowId = ''
      this.formSendNotify.targetDate = ''
      this.formSendNotify.afterTime = ''
      this.formSendNotify.confirmOnly = ''
      this.formSendNotify.memberCnt = ''
      this.formSendNotify.memberList = ''
      this.formSendNotify.message = ''
      this.formSendNotify.empSelect = ''
      this.formSendNotify.NoticeType = ''
      this.formSendNotify.setDate = ''
      this.formSendNotify.CREATE_USER = ''
      this.formSendNotify.LAST_USER = ''
    },
    async getMethod () {
      await this.getnotice()
      await this.getDataFlow()
      await this.getEmp()
    }
  }
}
</script>
<style scope>
.scroll {
   overflow-y: scroll;
   overflow-x: hidden;
}
/* width */
::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}
::-webkit-scrollbar-button {
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
/* .v-label{
  margin-bottom: 0;
  color:#1B437C !important;
  font-weight: bold;
} */
</style>
