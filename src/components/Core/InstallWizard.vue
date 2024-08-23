<template>
  <div>
    <v-card flat v-if="!dataReady" class="centered">
      <v-card-text>
        <waitingAlert></waitingAlert>
      </v-card-text>
    </v-card>
    <v-card flat v-else>
      <v-toolbar color="#173053" dark extended flat>
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      </v-toolbar>

      <v-card class="mx-auto" max-width="700" elevation="2"  style="margin-top: -64px;">
        <v-toolbar flat>
          <v-toolbar-title class="#173053--text">
            Wizard Install
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn color="#173053" icon>
            <v-icon>mdi-cellphone-cog</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <template v-if="paymentStatus === 'noCash'">
          <v-alert
            class="mt-3"
            dense
            prominent
            color="warning"
            icon="mdi-alarm-multiple"
            dark
          >
            <v-row align="center">
              <v-col class="grow">
                ท่านยังไม่ได้ชำระค่าบริการ
              </v-col>
              <v-col class="shrink" @click="gotoBilling()">
                <v-btn small>ชำระค่าบริการ</v-btn>
              </v-col>
            </v-row>
          </v-alert>
      </template>
        <template v-if="paymentStatus === 'wait'">
          <v-alert
            class="mt-3"
            dense
            prominent
            color="warning"
            icon="mdi-cash-remove"
            dark
          >
            <v-row align="center">
              <v-col class="grow">
                สลิปของท่านไม่ถูกต้อง
              </v-col>
              <v-col class="shrink" @click="gotoBilling()">
                <v-btn small>อัพเดทสลิป</v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </template>
        <template v-if="lineOaStatus === 'True'">
          <v-alert
            class="mt-3"
            dense
            prominent
            color="teal"
            icon="mdi-link-variant-remove"
            dark
          >
            <v-row align="center">
              <v-col class="grow">
                บัญชีของท่านยังไม่ได้เชื่อมต่อ LINE OA
              </v-col>
              <v-col class="shrink" @click="gotoConnectLine()">
                <v-btn small>เชื่อมต่อ</v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </template>
        <v-card-text style="height: 100%;">
          <v-container>
            <v-stepper
              v-model="e1"
              vertical
            >
              <v-stepper-step
                step="1"
                :complete="e1 >= 1 ? true:false"
              >
                ข้อมูลบริการ
              </v-stepper-step>

              <v-stepper-content step="1">
                <v-card
                  class="mb-12"
                >
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-btn
                            color="#173053"
                            dark
                            block
                            @click="dialogFlow = true,showBTFlow=true, titleFlowDialog = 'เพิ่มข้อมูลบริการ'"
                          >
                            เพิ่มประเภทบริการ
                          </v-btn>
                        </v-col>
                        <v-col cols="12">
                          <draggable
                            :list="dataListFlow"
                            :disabled="!enabled"
                            class="list-group"
                            ghost-class="ghost"
                            :move="checkMove"
                            @start="draggingFlow = true"
                            @end="draggingFlow = false"
                          >
                            <div
                              class="list-group-item"
                              v-for="element in dataListFlow"
                              :key="element.flowId"
                            >
                              <v-row>
                                <v-col cols="10" class="pr-0">
                                  <v-icon>mdi-drag-variant</v-icon>
                                  <!-- {{ element.flowId }} -->
                                  {{ element.flowName }}
                                </v-col>
                                <v-col cols="2" class="pl-0">
                                  <v-btn
                                    fab
                                    dark
                                    x-small
                                    @click="setDataFlow(element),showBTFlow=false, titleFlowDialog = 'แก้ไขข้อมูลบริการ'"
                                    color="primary"
                                  >
                                    <v-icon dark>
                                      mdi-file-document-edit
                                    </v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </div>
                          </draggable>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>
                <v-btn
                  color="primary"
                  @click="checkDeposit ? e1 = 2 : e1 = 3, saveSortFlow(), checkDeposit ? setDataDeposit() : '', setTimeEmp()"
                >
                  ต่อไป
                </v-btn>
              </v-stepper-content>

              <v-stepper-step
                step="2"
                :complete="e1 >= 2 ? true:false"
                v-if="checkDeposit"
              >
                ข้อมูลมัดจำ
              </v-stepper-step>

              <v-stepper-content step="2" v-if="checkDeposit">
                <v-card>
                    <v-card-text>
                      <v-container>
                        <v-form ref="form_addFlowDeposit" v-model="validAddFlowDeposit" lazy-validation>
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <v-select
                              v-model="formFlow.depositTime"
                              :items="depositTimeItem"
                              label="ชำระเงินมัดจำภายในกี่นาที"
                              outlined
                              dense
                              required
                              :rules="[rules.required]"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" class="pb-0 pt-0">
                            <v-text-field
                              v-model="formFlow.promptPayName"
                              label="ชื่อบัญชีพร้อมเพย์"
                              outlined
                              dense
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" class="pb-0 pt-0">
                            <v-text-field
                              v-model="formFlow.promptPayID"
                              label="หมายเลขพร้อมเพย์"
                              outlined
                              dense
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        </v-form>
                      </v-container>
                    </v-card-text>
                </v-card>
                <br>
                <v-btn
                  color="primary"
                  @click="depositFlow(), setTimeEmp()"
                >
                  ต่อไป
                </v-btn>
                <v-btn
                  color="error"
                  @click="e1 = 3, setTimeEmp()"
                >
                  ข้าม
                </v-btn>
                <v-btn text @click="e1 = 1">
                  กลับ
                </v-btn>
              </v-stepper-content>

              <v-stepper-step
                :step="checkDeposit ? 3 : 2"
                :complete="e1 >= 3 ? true:false"
              >
                ข้อมูลพนักงานช่าง
              </v-stepper-step>

              <v-stepper-content step="3">
                <v-card>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-btn
                            color="#173053"
                            dark
                            block
                            @click="dialogEmp = true, titleEmpDialog = 'เพิ่มพนักงานช่าง',showBTEmp = true"
                          >
                            เพิ่มพนักงานช่าง
                          </v-btn>
                        </v-col>
                        <v-col cols="12">
                          <!-- <draggable
                            :list="dataListEmp"
                            :disabled="!enabledEmp"
                            class="list-group"
                            ghost-class="ghost"
                            :move="checkMoveEmp"
                            @start="draggingEmp = true"
                            @end="draggingEmp = false"
                          >

                          </draggable> -->
                          <div
                              class="list-group-item"
                              v-for="element in dataListEmp"
                              :key="element.empId"
                            >
                              <v-row>
                                <v-col cols="10" class="pr-0">
                                  <v-icon>mdi-account-circle</v-icon>
                                  <!-- {{ element.flowId }} -->
                                  {{ element.empFirst_NameTH }}
                                </v-col>
                                <v-col cols="2" class="pl-0">
                                  <v-btn
                                    fab
                                    dark
                                    x-small
                                    @click="setDataEmp(element), titleEmpDialog = 'แก้ไขพนักงานช่าง',showBTEmp = false"
                                    color="primary"
                                  >
                                    <v-icon dark>
                                      mdi-file-document-edit
                                    </v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>
                <br>
                <v-btn
                  color="primary"
                  @click="updateWizard()"
                >
                  Save
                </v-btn>
                <v-btn text @click="checkDeposit ? e1 = 2 : e1 = 1, checkDeposit ? setDataDeposit() : ''">
                  กลับ
                </v-btn>
              </v-stepper-content>

            </v-stepper>
          </v-container>
        </v-card-text>
      </v-card>
    </v-card>
    <v-dialog v-model="dialogFlow" persistent max-width="90%">
      <v-card>
        <v-form ref="form_addFlow" v-model="validAddFlow" lazy-validation>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="8" class="text-left pt-10">
                <h3><strong>{{ titleFlowDialog }}</strong></h3>
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
                      @click="(dialogFlow = false), clearDataFlow()"
                      >
                      X
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-card flat v-if="!dataReady" class="centered">
                <v-card-text>
                  <waitingAlert></waitingAlert>
                </v-card-text>
              </v-card>
              <v-row v-else>
                <v-col cols="12" class="v-margit_text_add mt-1">
                  <v-col cols="12" class="pb-0 pt-0">
                    <v-text-field
                      v-model="formFlow.flowName"
                      label="ชื่อบริการ (ภาษาไทย)"
                      outlined
                      required
                      dense
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pb-0 pt-0">
                    <v-text-field
                      v-model="formFlow.flowNameEn"
                      label="ชื่อบริการ (ภาษาอังกฤษ)"
                      outlined
                      required
                      dense
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pb-0 pt-0">
                    <VuetifyMoney
                      label="จำนวนเงินมัดจำ"
                      v-model="formFlow.amountDeposit"
                      required
                      outlined
                      dense
                      v-bind:options="options2" />
                  </v-col>
                  <v-col clos="12" class="pb-0 pt-0">
                    <v-select
                      v-model="formFlow.selectTimeFlow"
                      :items="selectTimeItem"
                      label="ใช่เวลาเท่าไหร่"
                      outlined
                      attach
                      dense
                      required
                      :rules="[rules.required]"
                      :menu-props="{ top: true, offsetY: true }"
                    ></v-select>
                  </v-col>
                  <v-col clos="12" class="pb-0 pt-0" v-if="showBTFlow">
                    <v-btn
                      color="#173053"
                      dark
                      block
                      @click="addFlow()"
                    >
                      บันทึกข้อมูล
                    </v-btn>
                  </v-col>
                  <v-col clos="6" class="pb-2 pt-0" v-if="!showBTFlow">
                    <v-btn
                      color="#173053"
                      dark
                      block
                      @click="editFlow()"
                    >
                      บันทึกข้อมูล
                    </v-btn>
                  </v-col>
                  <v-col clos="6" class="pb-0 pt-0" v-if="!showBTFlow">
                    <v-btn
                      color="error"
                      dark
                      block
                      @click="deleteDataFlow(dataListFlowSelect)"
                    >
                      ลบข้อมูล
                    </v-btn>
                  </v-col>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEmp" persistent max-width="90%">
      <v-card>
        <v-form ref="form_addEmp" v-model="validAddEmp" lazy-validation>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="8" class="text-left pt-10">
                <h3><strong>{{ titleEmpDialog }}</strong></h3>
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
                      @click="(dialogEmp = false), clearDataEmp()"
                      >
                      X
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row >
                <v-col cols="12" class="v-margit_text_add mt-1">
                  <v-col cols="12" class="pa-0">
                    <v-select
                      dense
                      outlined
                      label="คำนำหน้า*"
                      :items="itemsTitle"
                      v-model="formEmp.empTitle_NameTH"
                      :rules="[rules.required]"
                      :counter="50"
                      maxlength="50"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <v-text-field
                      dense
                      outlined
                      label="ชื่อ*"
                      v-model="formEmp.empFirst_NameTH"
                      :rules="[rules.required]"
                      :counter="50"
                      maxlength="50"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <v-text-field
                      dense
                      outlined
                      label="นามสกุล*"
                      v-model="formEmp.empLast_NameTH"
                      :rules="[rules.required]"
                      :counter="50"
                      maxlength="50"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <v-select
                      dense
                      outlined
                      label="เวลาเริ่มงาน"
                      :items="itemsTimeStart"
                      v-model="formEmp.startTime"
                      :rules="[rules.required]"
                      required
                      @change="setTimeEnd()"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="pa-0" v-if="formEmp.startTime">
                    <v-select
                      dense
                      outlined
                      label="เวลาเลิกงาน"
                      :items="itemsTimeEnd"
                      v-model="formEmp.endTime"
                      :rules="[rules.required]"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <v-select
                      dense
                      outlined
                      v-model="formEmp.privacyPage"
                      :items="privacyPageSelect"
                      menu-props="auto"
                      readonly
                      :rules="[rules.required]"
                      label="เลือกหน้าที่จะแสดง"
                      prepend-icon="mdi-map"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="pa-0" v-if="formEmp.privacyPage === 'bookingform' || formEmp.privacyPage === 'bookingStoreFront'">
                    <v-autocomplete
                      v-model="formEmp.flowId"
                      :items="dataListFlow"
                      :rules="[rules.required]"
                      required
                      clearable
                      label="ประเภทบริการ"
                      dense
                      outlined
                      multiple
                      item-text="flowName"
                      item-value="flowId"
                    ></v-autocomplete>
                  </v-col>
                  <!-- <v-col clos="12" class="pb-0 pt-0">
                    <v-btn
                      color="#173053"
                      dark
                      block
                      @click="addEmp()"
                    >
                      บันทึกข้อมูล
                    </v-btn>
                  </v-col> -->
                  <v-col clos="12" class="pb-0 pt-0" v-if="showBTEmp">
                    <v-btn
                      color="#173053"
                      dark
                      block
                      @click="addEmp()"
                    >
                      บันทึกข้อมูล
                    </v-btn>
                  </v-col>
                  <v-col clos="6" class="pb-2 pt-0" v-if="!showBTEmp">
                    <v-btn
                      color="#173053"
                      dark
                      block
                      @click="editEmp()"
                    >
                      บันทึกข้อมูล
                    </v-btn>
                  </v-col>
                  <v-col clos="6" class="pb-0 pt-0" v-if="!showBTEmp">
                    <v-btn
                      color="error"
                      dark
                      block
                      @click="deleteDataEmp(dataListEmpSelect)"
                    >
                      ลบข้อมูล
                    </v-btn>
                  </v-col>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import moment from 'moment-timezone'
import draggable from 'vuedraggable'
import VuetifyMoney from '../VuetifyMoney.vue'
export default {
  components: {
    waitingAlert,
    'left-menu-admin': adminLeftMenu,
    draggable,
    VuetifyMoney
  },
  computed: {
    draggingFlowInfo () {
      return this.draggingFlow ? 'under drag' : ''
    },
    draggingEmpInfo () {
      return this.draggingEmp ? 'under drag' : ''
    }
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
      selectTimeItem: [
        { text: 'ครึ่งชั่วโมง', value: 30 },
        { text: '1 ชั่วโมง', value: 60 },
        { text: '1 ชั่วโมงครึ่ง', value: 90 },
        { text: '2 ชั่วโมง', value: 120 },
        { text: '2 ชั่วโมงครึ่ง', value: 150 },
        { text: '3 ชั่วโมง', value: 180 }
      ],
      depositTimeItem: [
        { text: 'ไม่จำกัดเวลามัดจำ', value: 'NO' },
        { text: '10 นาที', value: '10' },
        { text: 'ครึ่งชั่วโมง', value: '30' },
        { text: '1 ชั่วโมง', value: '60' },
        { text: '6 ชั่วโมง', value: '360' },
        { text: '1 วัน', value: '1,440' }
      ],
      enabled: true,
      validAddFlow: true,
      validAddFlowDeposit: true,
      draggingFlow: false,
      dialogFlow: false,
      titleFlowDialog: '',
      dataListFlow: [],

      showBTEmp: true,
      titleEmpDialog: '',
      validAddEmp: true,
      dialogEmp: false,
      dataListEmp: [],
      enabledEmp: true,
      draggingEmp: false,
      dataListEmpSelect: [],
      itemsTitle: ['นาย', 'นาง', 'นางสาว', 'คุณ', ' '],
      privacyPageSelect: [
        { text: 'รายชื่อลูกค้านัดหมาย', value: 'booking' },
        { text: 'หน้ากระดานการทำงาน', value: 'board' },
        { text: 'หน้านัดหมายของลูกค้า', value: 'bookingform' },
        { text: 'นัดหมายบัตรคิว', value: 'bookingStoreFront' },
        { text: 'ทั้งหมด', value: 'all' }
      ],
      itemsTimeStart: [],
      itemsTimeEnd: [],
      itemsTimeFull: [],
      formEmp: {
        empCode: '',
        empTitle_NameTH: '',
        empFirst_NameTH: '',
        empLast_NameTH: '',
        privacyPage: 'bookingform',
        empImge: '',
        pictureUrlPreview: '',
        shopId: this.$session.getAll().data.shopId,
        setTime: [],
        masBranchID: '',
        flowId: '',
        additionalInformation: '',
        phoneNumber: '',
        startTime: '',
        endTime: ''
      },

      dataReady: true,
      e1: 1,
      paymentStatus: '',
      dateCheckBill: '',
      lineOaStatus: 'False',
      formFlow: {
        flowCode: '',
        flowId: '',
        flowName: '',
        flowNameEn: '',
        flowfieldName: [],
        CREATE_USER: '',
        LAST_USER: '',
        checkPayment: 'True',
        checkOnsite: 'False',
        checkDeposit: 'False',
        repeatBooking: 'False',
        storeFrontCheck: 'False',
        depositTime: 'NO',
        promptPayID: null,
        promptPayName: null,
        amountDeposit: 0,
        shopId: this.$session.getAll().data.shopId,
        remarkConfirm: '',
        remarkConfirmEn: '',
        timeSlotStatus: this.$session.getAll().data.timeSlotStatus || 'False',
        timeSlot: 1,
        bookingNowCheck: 'False',
        bookingNowCheckCount: 0,
        overTime: 'True',
        customerTimeSlot: 'False',
        empTitleTh: 'พนักงานช่าง',
        empTitleEng: 'Employee',
        storeFrontText: '',
        servicePointTh: '',
        servicePointEn: '',
        servicePointCount: '',
        servicePointStatus: 'False',
        servicePointCountStart: 0,
        servicePointCountEnd: 0,
        servicePointRecursive: 'False',
        selectTimeFlow: ''
      },
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
      },
      showBTFlow: true,
      dataListFlowSelect: [],
      checkDeposit: true,
      checkTimeFlow: '',
      masBranchID: ''
    }
  },
  async mounted () {
    if (this.$session.getAll().data.shopActive === 'inactive') {
      this.$router.push('/Core/Login')
    } else {
      await this.getDataFlow()
      this.getDataEmp()
      this.getDataBranch()
      if (this.$session.getAll().data.shopId.includes('SD_')) {
        await this.chkConnectLineOa()
      } else {
        this.lineOaStatus = 'False'
      }
      this.dateCheckBill = moment().format('YYYY-MM')
      let trialsVersionDate = this.$session.getAll().data.trialsVersionDate || ''
      if (trialsVersionDate === '' || moment().format('YYYY-MM-DD HH:mm') > trialsVersionDate) {
        this.chkPlan()
      }
    }
  },
  methods: {
    validate (Action) {
      switch (Action) {
        case 'ADDFLOW':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_addFlow.validate()
          })
          break
        case 'ADDFLOWDEPOSIT':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_addFlowDeposit.validate()
          })
          break
        case 'ADDEMP':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_addEmp.validate()
          })
          break

        default:
          break
      }
    },
    async updateWizard () {
      // update status blitzard
      // และพาไปหน้าแรก
      axios.post(this.DNS_IP + '/sys_shop/edit/' + this.$session.getAll().data.shopId, {'statusFinishWizard': 'True'})
        .then((res) => {
          if (res.data.status === true) {
            this.$swal({
              title: 'บันทึกข้อมูลสำเร็จ',
              icon: 'success',
              type: 'success',
              confirmButtonText: 'รับทราบ',
              confirmButtonColor: '#3085d6'
            })
              .then((confirm) => {
                // if (confirm.isConfirmed) {
                this.$router.push('/Master/BookingField')
                // }
              })
          }
        })
        .catch((error) => {
          this.dataReady = true
          console.log(error)
          this.$swal('ผิดพลาด', 'Account ไม่ถูกต้อง2', 'error')
        })
    },
    setTimeEmp () {
      let checkTimeFlow = 'h'
      if (this.dataListFlow.filter(el => { return el.selectTimeFlow === 30 || el.selectTimeFlow === 90 }).length > 0) {
        checkTimeFlow = 'm'
      } else {
        checkTimeFlow = 'h'
      }
      this.checkTimeFlow = checkTimeFlow
      if (checkTimeFlow === 'm') {
        this.itemsTimeStart = [
          { id: 1, value: '07:00', text: '07:00', limitBooking: '1' },
          { id: 2, value: '07:30', text: '07:30', limitBooking: '1' },
          { id: 3, value: '08:00', text: '08:00', limitBooking: '1' },
          { id: 4, value: '08:30', text: '08:30', limitBooking: '1' },
          { id: 5, value: '09:00', text: '09:00', limitBooking: '1' },
          { id: 6, value: '09:30', text: '09:30', limitBooking: '1' },
          { id: 7, value: '10:00', text: '10:00', limitBooking: '1' },
          { id: 8, value: '10:30', text: '10:30', limitBooking: '1' },
          { id: 9, value: '11:00', text: '11:00', limitBooking: '1' },
          { id: 10, value: '11:30', text: '11:30', limitBooking: '1' },
          { id: 11, value: '12:00', text: '12:00', limitBooking: '1' },
          { id: 12, value: '12:30', text: '12:30', limitBooking: '1' },
          { id: 13, value: '13:00', text: '13:00', limitBooking: '1' },
          { id: 14, value: '13:30', text: '13:30', limitBooking: '1' },
          { id: 15, value: '14:00', text: '14:00', limitBooking: '1' },
          { id: 16, value: '14:30', text: '14:30', limitBooking: '1' },
          { id: 17, value: '15:00', text: '15:00', limitBooking: '1' },
          { id: 18, value: '15:30', text: '15:30', limitBooking: '1' },
          { id: 19, value: '16:00', text: '16:00', limitBooking: '1' },
          { id: 20, value: '16:30', text: '16:30', limitBooking: '1' },
          { id: 21, value: '17:00', text: '17:00', limitBooking: '1' },
          { id: 22, value: '17:30', text: '17:30', limitBooking: '1' },
          { id: 23, value: '18:00', text: '18:00', limitBooking: '1' },
          { id: 24, value: '18:30', text: '18:30', limitBooking: '1' },
          { id: 25, value: '19:00', text: '19:00', limitBooking: '1' },
          { id: 26, value: '19:30', text: '19:30', limitBooking: '1' },
          { id: 27, value: '20:00', text: '20:00', limitBooking: '1' },
          { id: 28, value: '20:30', text: '20:30', limitBooking: '1' },
          { id: 29, value: '21:00', text: '21:00', limitBooking: '1' },
          { id: 30, value: '21:30', text: '21:30', limitBooking: '1' },
          { id: 31, value: '22:00', text: '22:00', limitBooking: '1' },
          { id: 32, value: '22:30', text: '22:30', limitBooking: '1' },
          { id: 33, value: '23:00', text: '23:00', limitBooking: '1' }
        // { id: 32, value: '23:30', text: '23:30', limitBooking: '1' }
        ]
        this.itemsTimeEnd = [
          { id: 1, value: '07:00', text: '07:00', limitBooking: '1' },
          { id: 2, value: '07:30', text: '07:30', limitBooking: '1' },
          { id: 3, value: '08:00', text: '08:00', limitBooking: '1' },
          { id: 4, value: '08:30', text: '08:30', limitBooking: '1' },
          { id: 5, value: '09:00', text: '09:00', limitBooking: '1' },
          { id: 6, value: '09:30', text: '09:30', limitBooking: '1' },
          { id: 7, value: '10:00', text: '10:00', limitBooking: '1' },
          { id: 8, value: '10:30', text: '10:30', limitBooking: '1' },
          { id: 9, value: '11:00', text: '11:00', limitBooking: '1' },
          { id: 10, value: '11:30', text: '11:30', limitBooking: '1' },
          { id: 11, value: '12:00', text: '12:00', limitBooking: '1' },
          { id: 12, value: '12:30', text: '12:30', limitBooking: '1' },
          { id: 13, value: '13:00', text: '13:00', limitBooking: '1' },
          { id: 14, value: '13:30', text: '13:30', limitBooking: '1' },
          { id: 15, value: '14:00', text: '14:00', limitBooking: '1' },
          { id: 16, value: '14:30', text: '14:30', limitBooking: '1' },
          { id: 17, value: '15:00', text: '15:00', limitBooking: '1' },
          { id: 18, value: '15:30', text: '15:30', limitBooking: '1' },
          { id: 19, value: '16:00', text: '16:00', limitBooking: '1' },
          { id: 20, value: '16:30', text: '16:30', limitBooking: '1' },
          { id: 21, value: '17:00', text: '17:00', limitBooking: '1' },
          { id: 22, value: '17:30', text: '17:30', limitBooking: '1' },
          { id: 23, value: '18:00', text: '18:00', limitBooking: '1' },
          { id: 24, value: '18:30', text: '18:30', limitBooking: '1' },
          { id: 25, value: '19:00', text: '19:00', limitBooking: '1' },
          { id: 26, value: '19:30', text: '19:30', limitBooking: '1' },
          { id: 27, value: '20:00', text: '20:00', limitBooking: '1' },
          { id: 28, value: '20:30', text: '20:30', limitBooking: '1' },
          { id: 29, value: '21:00', text: '21:00', limitBooking: '1' },
          { id: 30, value: '21:30', text: '21:30', limitBooking: '1' },
          { id: 31, value: '22:00', text: '22:00', limitBooking: '1' },
          { id: 32, value: '22:30', text: '22:30', limitBooking: '1' },
          { id: 33, value: '23:00', text: '23:00', limitBooking: '1' },
          { id: 34, value: '23:30', text: '23:30', limitBooking: '1' }
        ]
        this.itemsTimeFull = [
          { id: 1, value: '07:00', text: '07:00', limitBooking: '1' },
          { id: 2, value: '07:30', text: '07:30', limitBooking: '1' },
          { id: 3, value: '08:00', text: '08:00', limitBooking: '1' },
          { id: 4, value: '08:30', text: '08:30', limitBooking: '1' },
          { id: 5, value: '09:00', text: '09:00', limitBooking: '1' },
          { id: 6, value: '09:30', text: '09:30', limitBooking: '1' },
          { id: 7, value: '10:00', text: '10:00', limitBooking: '1' },
          { id: 8, value: '10:30', text: '10:30', limitBooking: '1' },
          { id: 9, value: '11:00', text: '11:00', limitBooking: '1' },
          { id: 10, value: '11:30', text: '11:30', limitBooking: '1' },
          { id: 11, value: '12:00', text: '12:00', limitBooking: '1' },
          { id: 12, value: '12:30', text: '12:30', limitBooking: '1' },
          { id: 13, value: '13:00', text: '13:00', limitBooking: '1' },
          { id: 14, value: '13:30', text: '13:30', limitBooking: '1' },
          { id: 15, value: '14:00', text: '14:00', limitBooking: '1' },
          { id: 16, value: '14:30', text: '14:30', limitBooking: '1' },
          { id: 17, value: '15:00', text: '15:00', limitBooking: '1' },
          { id: 18, value: '15:30', text: '15:30', limitBooking: '1' },
          { id: 19, value: '16:00', text: '16:00', limitBooking: '1' },
          { id: 20, value: '16:30', text: '16:30', limitBooking: '1' },
          { id: 21, value: '17:00', text: '17:00', limitBooking: '1' },
          { id: 22, value: '17:30', text: '17:30', limitBooking: '1' },
          { id: 23, value: '18:00', text: '18:00', limitBooking: '1' },
          { id: 24, value: '18:30', text: '18:30', limitBooking: '1' },
          { id: 25, value: '19:00', text: '19:00', limitBooking: '1' },
          { id: 26, value: '19:30', text: '19:30', limitBooking: '1' },
          { id: 27, value: '20:00', text: '20:00', limitBooking: '1' },
          { id: 28, value: '20:30', text: '20:30', limitBooking: '1' },
          { id: 29, value: '21:00', text: '21:00', limitBooking: '1' },
          { id: 30, value: '21:30', text: '21:30', limitBooking: '1' },
          { id: 31, value: '22:00', text: '22:00', limitBooking: '1' },
          { id: 32, value: '22:30', text: '22:30', limitBooking: '1' },
          { id: 33, value: '23:00', text: '23:00', limitBooking: '1' },
          { id: 34, value: '23:30', text: '23:30', limitBooking: '1' }
        ]
      } else {
        this.itemsTimeStart = [
          { id: 1, value: '07:00', text: '07:00', limitBooking: '1' },
          { id: 3, value: '08:00', text: '08:00', limitBooking: '1' },
          { id: 5, value: '09:00', text: '09:00', limitBooking: '1' },
          { id: 7, value: '10:00', text: '10:00', limitBooking: '1' },
          { id: 9, value: '11:00', text: '11:00', limitBooking: '1' },
          { id: 11, value: '12:00', text: '12:00', limitBooking: '1' },
          { id: 13, value: '13:00', text: '13:00', limitBooking: '1' },
          { id: 15, value: '14:00', text: '14:00', limitBooking: '1' },
          { id: 17, value: '15:00', text: '15:00', limitBooking: '1' },
          { id: 19, value: '16:00', text: '16:00', limitBooking: '1' },
          { id: 20, value: '17:00', text: '17:00', limitBooking: '1' },
          { id: 21, value: '18:00', text: '18:00', limitBooking: '1' },
          { id: 22, value: '19:00', text: '19:00', limitBooking: '1' },
          { id: 23, value: '20:00', text: '20:00', limitBooking: '1' },
          { id: 24, value: '21:00', text: '21:00', limitBooking: '1' },
          { id: 25, value: '22:00', text: '22:00', limitBooking: '1' }
          // { id: 31, value: '23:00', text: '23:00', limitBooking: '1' }
        // { id: 32, value: '23:30', text: '23:30', limitBooking: '1' }
        ]
        this.itemsTimeEnd = [
          { id: 1, value: '07:00', text: '07:00', limitBooking: '1' },
          { id: 3, value: '08:00', text: '08:00', limitBooking: '1' },
          { id: 5, value: '09:00', text: '09:00', limitBooking: '1' },
          { id: 7, value: '10:00', text: '10:00', limitBooking: '1' },
          { id: 9, value: '11:00', text: '11:00', limitBooking: '1' },
          { id: 11, value: '12:00', text: '12:00', limitBooking: '1' },
          { id: 13, value: '13:00', text: '13:00', limitBooking: '1' },
          { id: 15, value: '14:00', text: '14:00', limitBooking: '1' },
          { id: 17, value: '15:00', text: '15:00', limitBooking: '1' },
          { id: 19, value: '16:00', text: '16:00', limitBooking: '1' },
          { id: 20, value: '17:00', text: '17:00', limitBooking: '1' },
          { id: 21, value: '18:00', text: '18:00', limitBooking: '1' },
          { id: 22, value: '19:00', text: '19:00', limitBooking: '1' },
          { id: 23, value: '20:00', text: '20:00', limitBooking: '1' },
          { id: 24, value: '21:00', text: '21:00', limitBooking: '1' },
          { id: 25, value: '22:00', text: '22:00', limitBooking: '1' },
          { id: 26, value: '23:00', text: '23:00', limitBooking: '1' }
        ]
        this.itemsTimeFull = [
          { id: 1, value: '07:00', text: '07:00', limitBooking: '1' },
          { id: 3, value: '08:00', text: '08:00', limitBooking: '1' },
          { id: 5, value: '09:00', text: '09:00', limitBooking: '1' },
          { id: 7, value: '10:00', text: '10:00', limitBooking: '1' },
          { id: 9, value: '11:00', text: '11:00', limitBooking: '1' },
          { id: 11, value: '12:00', text: '12:00', limitBooking: '1' },
          { id: 13, value: '13:00', text: '13:00', limitBooking: '1' },
          { id: 15, value: '14:00', text: '14:00', limitBooking: '1' },
          { id: 17, value: '15:00', text: '15:00', limitBooking: '1' },
          { id: 19, value: '16:00', text: '16:00', limitBooking: '1' },
          { id: 20, value: '17:00', text: '17:00', limitBooking: '1' },
          { id: 21, value: '18:00', text: '18:00', limitBooking: '1' },
          { id: 22, value: '19:00', text: '19:00', limitBooking: '1' },
          { id: 23, value: '20:00', text: '20:00', limitBooking: '1' },
          { id: 24, value: '21:00', text: '21:00', limitBooking: '1' },
          { id: 25, value: '22:00', text: '22:00', limitBooking: '1' },
          { id: 26, value: '23:00', text: '23:00', limitBooking: '1' }
        ]
      }
    },
    checkMove: function (e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    },
    checkMoveEmp: function (e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    },
    async getDataFlow () {
      this.dataListFlow = await this.getDataFromAPI('/flow/get', '')
      if (this.dataListFlow.filter(el => { return parseInt(el.amountDeposit || 0) > 0 }).length > 0) {
        this.checkDeposit = true
      } else {
        this.checkDeposit = false
      }
    },
    async getDataEmp () {
      this.dataListEmp = await this.getDataFromAPI('/empSelect/get', '')
    },
    async getDataBranch () {
      let masBranchID = await this.getDataFromAPI('/master_branch/get', '')
      this.masBranchID = masBranchID[0].masBranchID
    },
    setDataEmp (item) {
      console.log('setDataEmp', item)
      this.dataListEmpSelect = item
      this.formEmp.empId = item.empId
      this.formEmp.startTime = item.startTime || ''
      this.formEmp.endTime = item.endTime || ''
      this.formEmp.empTitle_NameTH = item.empTitle_NameTH
      this.formEmp.empFirst_NameTH = item.empFirst_NameTH
      this.formEmp.empLast_NameTH = item.empLast_NameTH || 0
      this.formEmp.privacyPage = item.privacyPage || ''
      this.formEmp.flowId = JSON.parse(item.flowId) || ''
      this.setTimeEnd()
      this.dialogEmp = true
    },
    setTimeEnd () {
      this.itemsTimeEnd = this.itemsTimeStart.filter(el => { return el.value > this.formEmp.startTime })
      if (this.checkTimeFlow === 'm') {
        this.itemsTimeEnd.push({ id: 34, value: '23:30', text: '23:30', limitBooking: '1' })
      } else {
        this.itemsTimeEnd.push({ id: 26, value: '23:00', text: '23:00', limitBooking: '1' })
      }
    },
    setDataFlow (item) {
      this.dataListFlowSelect = item
      console.log('setDataFlow', item)
      this.formFlow.flowId = item.flowId
      this.formFlow.flowName = item.flowName
      this.formFlow.flowNameEn = item.flowNameEn
      this.formFlow.amountDeposit = item.amountDeposit || 0
      this.formFlow.selectTimeFlow = item.selectTimeFlow || ''
      this.dialogFlow = true
    },
    setDataDeposit () {
      this.formFlow.checkDeposit = this.dataListFlow[0].checkDeposit || 'True'
      this.formFlow.depositTime = this.dataListFlow[0].depositTime || 'NO'
      this.formFlow.promptPayID = this.dataListFlow[0].promptPayID || ''
      this.formFlow.promptPayName = this.dataListFlow[0].promptPayName || ''
    },
    // Flow and Deposit
    addFlow () {
      this.validate('ADDFLOW')
      setTimeout(() => this.addFlowSubmit(), 500)
    },
    addFlowSubmit () {
      if (this.validAddFlow === true) {
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
            this.formFlow.setTime = JSON.stringify([])
            this.formFlow.CREATE_USER = this.$session.getAll().data.userName
            this.formFlow.LAST_USER = this.$session.getAll().data.userName
            this.formFlow.flowCode = this.generateCodeGlobal()
            this.formFlow.flowfieldName = JSON.stringify([])
            this.formFlow.amountDeposit = this.formFlow.amountDeposit || 0

            this.formFlow.flowName = this.formFlow.flowName.replace(/%/g, '%%').replace(/'/g, "\\'")
            this.formFlow.flowNameEn = this.formFlow.flowNameEn.replace(/%/g, '%%').replace(/'/g, "\\'")
            console.log('formFlow', this.formFlow)
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + "/flow/add",
                this.formFlow
              )
              .then(async response => {
                // Close Dialog
                this.dialogFlow = false
                this.dataReady = true

                // Load Data
                await this.getDataFlow()
                this.$swal('เรียบร้อย', 'เพิ่มข้อมูลบริการ เรียบร้อย', 'success')
                await this.clearDataFlow()
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
      }
    },
    async saveSortFlow () {
      this.dataReady = false
      let dt = {
        data: this.dataListFlow
      }
      await axios
        .post(this.DNS_IP + '/flow/updateSortFlow', dt)
        .then(async (response) => {
          // this.$swal('เรียบร้อย', 'เปลี่ยนแปลงลำดับการแสดง เรียบร้อย', 'success')
          // this.dialogSortFlow = false
          this.dataReady = true
          await this.getDataFlow()
          if (this.checkDeposit === false) {
            let dt = {
              checkDeposit: 'False',
              depositTime: '',
              promptPayID: '',
              promptPayName: ''
            }
            console.log('depositFlowSubmit', dt)
            axios
              .post(
                // eslint-disable-next-line quotes
                this.DNS_IP + "/flow/updateDipositByShopId/" + this.$session.getAll().data.shopId,
                dt
              )
              .then(async response => {
              })
          }
          // if (this.dataItem.length > 0) {
          //   this.dessertsSort = []
          //   for (let i = 0; i < this.dataItem.length; i++) {
          //     let d = this.dataItem[i]
          //     let s = {}
          //     s.flowId = d.flowId
          //     s.flowName = d.flowName
          //     this.dessertsSort.push(s)
          //   }
          //   // this.initSortable()
          // }
        })
        .catch(error => {
          console.log('error function addData : ', error)
          this.dataReady = true
        })
    },
    editFlow () {
      this.validate('ADDFLOW')
      setTimeout(() => this.editFlowSubmit(), 500)
    },
    editFlowSubmit () {
      if (this.validAddFlow === true) {
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
            this.formFlow.LAST_USER = this.$session.getAll().data.userName
            this.formFlow.amountDeposit = this.formFlow.amountDeposit || 0
            this.formFlow.flowfieldName = JSON.stringify([])

            this.formFlow.flowName = this.formFlow.flowName.replace(/%/g, '%%').replace(/'/g, "\\'")
            this.formFlow.flowNameEn = this.formFlow.flowNameEn.replace(/%/g, '%%').replace(/'/g, "\\'")

            var ID = this.formFlow.flowId
            delete this.formFlow['flowId']
            delete this.formFlow['fieldId']
            delete this.formFlow['fieldName']
            delete this.formFlow['fieldType']
            delete this.formFlow['flowfieldId']

            this.formFlow.servicePointCount = ''
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + "/flow/edit/" + ID,
                this.formFlow
              )
              .then(async response => {
                // Close Dialog
                this.dialogFlow = false
                this.dataReady = true

                // Load Data
                await this.getDataFlow()
                this.$swal('เรียบร้อย', 'แก้ไขข้อมูลบริการ เรียบร้อย', 'success')
                await this.clearDataFlow()
              })
          })
      }
    },
    async deleteDataFlow (item) {
      this.dataReady = false
      this.$swal({
        title: 'ต้องการ ลบข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          let dt = {
            LAST_USER: this.$session.getAll().data.userName
          }
          var ID = item.flowId
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/flow/delete/" + ID,
              dt
            )
            .then(async response => {
              this.dataReady = true
              // Load Data
              await this.getDataFlow()
              await this.clearDataFlow()
              this.$swal('เรียบร้อย', 'ลบข้อมูล เรียบร้อย', 'success')
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
    depositFlow () {
      this.validate('ADDFLOWDEPOSIT')
      setTimeout(() => this.depositFlowSubmit(), 500)
    },
    async depositFlowSubmit () {
      this.dataReady = false
      if (this.validAddFlowDeposit === true) {
        let dt = {
          checkDeposit: 'True',
          depositTime: this.formFlow.depositTime,
          promptPayID: this.formFlow.promptPayID,
          promptPayName: this.formFlow.promptPayName
        }
        console.log('depositFlowSubmit', dt)
        await axios
          .post(
            // eslint-disable-next-line quotes
            this.DNS_IP + "/flow/updateDipositByShopId/" + this.$session.getAll().data.shopId,
            dt
          )
          .then(async response => {
            this.e1 = 3
            await this.getDataFlow()
            await this.clearDataFlow()
            this.dataReady = true
          })
      } else {
        this.dataReady = true
      }
    },
    async clearDataFlow () {
      this.formFlow.selectTimeFlow = ''
      // eslint-disable-next-line no-redeclare
      for (var key in this.formFlow) {
        if (this.formFlow[key]) {
          if (key === 'depositTime') {
            this.formFlow[key] = 'NO'
          } else if (key === 'flowfieldName') {
            this.formFlow[key] = []
          } else if (key === 'overTime') {
            this.formFlow[key] = 'True'
          } else if (key === 'checkPayment') {
            this.formFlow[key] = 'True'
          } else if (key === 'checkOnsite') {
            this.formFlow[key] = 'False'
          } else if (key === 'servicePointStatus') {
            this.formFlow[key] = 'False'
          } else if (key === 'checkDeposit') {
            this.formFlow[key] = 'False'
          } else if (key === 'bookingNowCheck') {
            this.formFlow[key] = 'False'
          } else if (key === 'repeatBooking') {
            this.formFlow[key] = 'False'
          } else if (key === 'customerTimeSlot') {
            this.formFlow[key] = 'False'
          } else if (key === 'servicePointRecursive') {
            this.formFlow[key] = 'False'
          } else if (key === 'amountDeposit') {
            this.formFlow[key] = 0
          } else if (key === 'servicePointCountStart') {
            this.formFlow[key] = 0
          } else if (key === 'servicePointCountEnd') {
            this.formFlow[key] = 0
          } else if (key === 'promptPayID') {
            this.formFlow[key] = null
          } else if (key === 'promptPayName') {
            this.formFlow[key] = null
          } else if (key === 'timeSlotStatus') {
            this.formFlow[key] = this.$session.getAll().data.timeSlotStatus || 'False'
          } else if (key === 'timeSlot') {
            this.formFlow[key] = 1
          } else if (key === 'shopId') {
            this.formFlow[key] = this.$session.getAll().data.shopId
          } else {
            if (key === 'empTitleTh' || key === 'empTitleEng') {

            } else {
              this.formFlow[key] = ''
            }
          }
        }
      }
    },
    //* ------Flow and Deposit------*
    addEmp () {
      this.validate('ADDEMP')
      setTimeout(() => this.addEmpSubmit(), 500)
      this.dataReady = false
    },
    addEmpSubmit () {
      if (this.validAddEmp === true) {
        console.log('addEmp', this.formEmp)
        this.$swal({
          title: 'ต้องการ เพิ่มข้อมูลพนักงาน ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        })
          .then(async result => {
            let setTime = this.itemsTimeFull.filter(el => { return el.value >= this.formEmp.startTime && el.value <= this.formEmp.endTime })
            if (setTime.length > 0) {
              this.formEmp.setTime = JSON.stringify(setTime)
            } else {
              this.formEmp.setTime = JSON.stringify([])
            }
            this.formEmp.empImge = ''
            this.formEmp.masBranchID = this.masBranchID
            if (this.formEmp.privacyPage === 'bookingform' || this.formEmp.privacyPage === 'bookingStoreFront') {
              this.formEmp.flowId = JSON.stringify(this.formEmp.flowId)
            } else {
              delete this.formEmp['flowId']
            }
            // if (this.formEmp.additionalInformation) {
            //   this.formEmp.additionalInformation = (this.formEmp.additionalInformation || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            // }
            if (this.formEmp.empFirst_NameTH) {
              this.formEmp.empFirst_NameTH = (this.formEmp.empFirst_NameTH || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            if (this.formEmp.empLast_NameTH) {
              this.formEmp.empLast_NameTH = (this.formEmp.empLast_NameTH || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            delete this.formEmp['pictureUrlPreview']
            await axios
              .post(
                this.DNS_IP + '/empSelect/add',
                this.formEmp
              )
              .then(async response => {
                this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                // Close Dialog
                // if (this.dataListFlow.filter(el => { return el.timeSlotStatus === 'False' }).length > 0) {
                this.updateFlowSlotTime()
                // }
                this.dialogEmp = false
                this.dataReady = true

                // Load Data
                await this.clearDataEmp()
                await this.getDataEmp()
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
      } else {
        this.dataReady = true
      }
    },
    editEmp () {
      this.validate('ADDEMP')
      setTimeout(() => this.editEmpSubmit(), 500)
    },
    editEmpSubmit () {
      if (this.validAddEmp === true) {
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
            let setTime = this.itemsTimeFull.filter(el => { return el.value >= this.formEmp.startTime && el.value <= this.formEmp.endTime })
            if (setTime.length > 0) {
              this.formEmp.setTime = JSON.stringify(setTime)
            } else {
              this.formEmp.setTime = JSON.stringify([])
            }
            this.formEmp.empImge = ''
            this.formEmp.masBranchID = this.masBranchID
            if (this.formEmp.privacyPage === 'bookingform' || this.formEmp.privacyPage === 'bookingStoreFront') {
              this.formEmp.flowId = JSON.stringify(this.formEmp.flowId)
            } else {
              delete this.formEmp['flowId']
            }
            // if (this.formEmp.additionalInformation) {
            //   this.formEmp.additionalInformation = (this.formEmp.additionalInformation || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            // }
            if (this.formEmp.empFirst_NameTH) {
              this.formEmp.empFirst_NameTH = (this.formEmp.empFirst_NameTH || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            if (this.formEmp.empLast_NameTH) {
              this.formEmp.empLast_NameTH = (this.formEmp.empLast_NameTH || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            delete this.formEmp['pictureUrlPreview']

            var ID = this.formEmp.empId
            delete this.formEmp['empId']
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + "/empSelect/edit/" + ID,
                this.formEmp
              )
              .then(async response => {
                // Close Dialog
                this.updateFlowSlotTime()
                this.dialogEmp = false
                this.dataReady = true

                // Load Data
                await this.getDataEmp()
                this.$swal('เรียบร้อย', 'แก้ไขข้อมูลบริการ เรียบร้อย', 'success')
                await this.clearDataEmp()
              })
          })
      }
    },
    async deleteDataEmp (item) {
      this.dataReady = false
      this.$swal({
        title: 'ต้องการ ลบข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          let dt = {
            LAST_USER: this.$session.getAll().data.userName
          }
          var ID = item.empId
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/empSelect/delete/" + ID,
              dt
            )
            .then(async response => {
              this.dataReady = true
              this.dialogEmp = false
              // Load Data
              await this.getDataEmp()
              await this.clearDataEmp()
              this.$swal('เรียบร้อย', 'ลบข้อมูล เรียบร้อย', 'success')
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
    async updateFlowSlotTime () {
      let data = []
      let num = 0
      if (this.checkTimeFlow === 'm') {
        num = 30
      } else {
        num = 60
      }
      for (let i = 0; i < this.dataListFlow.length; i++) {
        let d = this.dataListFlow[i]
        let s = {}
        s.timeSlot = parseInt(d.selectTimeFlow) / num
        s.flowId = d.flowId
        data.push(s)
      }
      await axios
        .post(
          this.DNS_IP + '/flow/updateTimeSlotByShop',
          data
        )
        .then(async response => {})
    },
    async clearDataEmp () {
      this.formEmp.empCode = ''
      this.formEmp.empTitle_NameTH = ''
      this.formEmp.empFirst_NameTH = ''
      this.formEmp.empLast_NameTH = ''
      this.formEmp.privacyPage = 'bookingform'
      this.formEmp.empImge = ''
      this.formEmp.pictureUrlPreview = ''
      this.formEmp.shopId = this.$session.getAll().data.shopId
      this.formEmp.masBranchID = ''
      this.formEmp.flowId = []
    },
    async chkPlan () {
      await axios
        .get(
          this.DNS_IP +
              '/system_shop_Payment/get?shopId=' +
              this.$session.getAll().data.shopId +
              '&paymentDate=' + this.dateCheckBill
        )
        .then(async (response) => {
          let rs = response.data
          if (rs.status === false) {
            this.paymentStatus = 'noCash'
          } else {
            this.paymentStatus = rs[0].paymentStatus
          }
        })
    },
    gotoBilling () {
      this.$router.push('/BillingPlan')
    },
    async chkConnectLineOa () {
      this.lineOaStatus = 'False'
      await axios
        .get(
          this.DNS_IP +
              '/lineconfig/get?shopId=' +
              this.$session.getAll().data.shopId
        )
        .then(async (response) => {
          let rs = response.data
          console.log('chkConnectLineOa', rs)
          if (rs.status === false) {
            this.lineOaStatus = 'True'
          } else {
            this.lineOaStatus = 'False'
          }
        }).catch((error) => {
          console.log(error)
          this.lineOaStatus = 'False'
        })
    },
    async getDataFromAPI (url, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.$session.getAll().data.shopId}${param}`)
        .then(response => {
          let rs = response.data
          console.log('getDataFromAPI', rs)
          if (rs.status !== false) {
            result = rs
            // for (var i = 0; i < rs.length; i++) {
            //   let d = rs[i]
            //   let s = {}
            //   s.text = d[fieldName]
            //   s.value = d[fieldId]
            //   s.allData = d
            //   result.push(s)
            //   // console.log('this.DataFlowName', this.DataFlowName)
            // }
          } else {
            result = []
          }
        })
      return result
    }
  }
}
</script>
