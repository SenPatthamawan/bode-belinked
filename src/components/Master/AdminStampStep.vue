<template>
    <div flat class="pa-3" :style="'background-color:' + primaryColor + ' ;min-height: 100vh;'">
      <!-- <v-toolbar color="#173053" dark extended flat>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </v-toolbar> -->
      <v-overlay :value="overlay">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
      <div class="pa-0 ma-2 mb-4" style="display: flex;justify-content: flex-end;">
        <v-avatar size="62" >
        <img
          :src="shopData[0].shopImge"
          alt="John"
        >
      </v-avatar>
      </div>
        <v-card-text>
            <div>
              <v-row class="InputData">
                <v-select
                  v-if="$route.query.jobNo === undefined"
                  :items="DataBranchName"
                  v-model="masBranchID"
                  @change="flowId = '', getDataFlow()"
                  solo
                  hide-details
                  label="สาขา"
                  class="ma-2"
                >
                <template v-slot:prepend-inner>
                  <v-icon class="" color="primary">mdi-map-marker</v-icon>
                </template>
              </v-select>
              </v-row>
              <v-row class="InputData">
                <v-select
                  v-if="(masBranchID !== '' && masBranchID !== null) && $route.query.jobNo === undefined"
                  :items="DataFlowName"
                  v-model="flowId"
                  solo
                  hide-details
                  label="ประเภทบริการ"
                  class="ma-2"
                  @change="getAllJob()"
                >
                <template v-slot:prepend-inner>
                  <v-icon class="ma-2 mt-1 iconify" color="primary" data-icon="maki:doctor"></v-icon>
                </template>
                </v-select>
              </v-row>
              <v-row v-if="dataItemAll.length > 0 && statusStart === true">
                <v-col cols="12" class="pa-0 ma-0">
                <!-- <v-autocomplete
                  outlined
                  dense
                  filled
                  label="รายชื่อลูกค้า"
                  v-model="jobNo"
                  item-text="CustomerName"
                  item-value="jobNo"
                  :items="dataItemAll"
                  :rules="[rules.required]"
                  class="ma-2"
                   @change="getDataJob()"
                ></v-autocomplete> -->
                  <div v-for="(item , index) in dataItemAll" :key="index">
                    <v-card class="mx-7 pa-3 ma-2 mb-6" style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;">
                      <v-row class="pa-5">
                        <v-col cols="3" md="3" sm="12"  class="pa-0 ma-0" style="display: flex;align-items: flex-start;justify-content: flex-end;padding-left: 11px !important;">
                          <v-avatar size="65" v-if="item.memberPicture">
                          <img
                            :src="item.memberPicture"
                          >
                        </v-avatar>
                        <v-avatar size="65" color="primary" v-else>
                          <v-icon dark x-large>
                            mdi-account-circle
                          </v-icon>
                        </v-avatar>
                        </v-col>
                        <v-col cols="9" md="9" sm="12" class="pa-0 ma-0 pl-2">
                          <p class="font-weight-bold mb-1 ml-2" style="font-size:16px" v-if="item.CustomerName">
                            {{item.CustomerName}}
                          </p>
                          <!-- <div style="display: flex;align-items: flex-start;">
                            <v-icon color="#F48686" class="mx-1">mdi-square-medium</v-icon>
                          <p class="font-weight-medium mb-1" style="font-size:14px" v-if="item.flowName !== null">
                            {{item.flowName}}
                          </p>
                          </div> -->
                          <div style="display: flex;align-items: flex-start;" v-if="item.CustomerTel">
                            <v-icon  color="#24C74D" class="mx-2 mr-2 mt-1 iconify" small data-icon="el:phone-alt"></v-icon>
                            <p class="font-weight-bold mb-1" style="font-size:14px" >
                            <!-- <v-icon  color="#24C74D" class="mx-2 mr-2 mt-1 iconify" small data-icon="el:phone-alt"></v-icon> -->
                          {{item.CustomerTel}}
                          </p>
                          </div>
                        </v-col>
                      </v-row>
                      <div style="display: flex;align-items: center;justify-content: center;" v-if="item.dueDate">
                        <v-icon  color="#F48686" class="iconify" data-icon="ic:twotone-access-time"></v-icon>
                        <p class="font-weight-bold text-center ma-0 ml-2" style="font-size:16px">
                          <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                          {{momentThaiText(item.dueDate)}}</p>
                      </div>
                    <v-row class="mt-2 mb-1 px-3">
                      <v-col class="text-center pa-1" v-if="item.CustomerTel">
                        <v-btn
                          color="#1DBF73"
                          rounded
                          dark
                          block
                          @click="callCustomer(item.CustomerTel)"
                        >โทร</v-btn>
                      </v-col>
                      <v-col class="text-center pa-1">
                        <v-btn
                          color="rgb(153 153 153)"
                          rounded
                          dark
                          block
                          @click="jobNo=item.jobNo, dataItemAll=[], getDataJob(), statusStart = false"
                        >
                        รายละเอียด</v-btn>
                      </v-col>
                      <v-col class="text-center pa-1">
                        <v-btn
                          :color="secondaryColor"
                          rounded
                          dark
                          block
                          @click="jobNo=item.jobNo,stepId=item.stepId,dialogLogStampStep = true,getDataJob(), statusStart = true"
                        >เริ่ม</v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                  </div>
                </v-col>
              </v-row>
              <v-card v-if="dataItem.length > 0 && statusStart === false" class="pa-3 mx-2" style="background-color:#FFFFFF;">
                <v-row class="InputData" >
                  <v-col cols="12" class="pa-0 ma-0 mb-2">
                    <!-- <v-btn
                      class="ma-1 mx-n1"
                      rounded
                      dark
                      :color="secondaryColor"
                      block
                      @click="getAllJob(), dataItem=[]"
                    > -->
                      <v-icon x-large :color="secondaryColor"  @click="getAllJob(), dataItem=[],statusStart = true" class="mr-6">mdi-arrow-left-box</v-icon>
                      <!-- กลับไปหน้ารวม
                    </v-btn> -->
                  </v-col>
                </v-row>
                <div class="avatar text-center mb-5">
                  <div style="display:flex;align-items: center;justify-content: center;" v-if="dataItem[0].memberName">
                    <h4>
                    {{dataItem[0].memberName}}
                    </h4>
                  </div>
                  <v-avatar size="120" style="border:5px solid #FFFFFF;">
                  <v-img
                    v-if="dataItem[0].memberPicture"
                    :src="dataItem[0].memberPicture"
                  ></v-img>
                  <v-icon size="100" color="orange" v-else>
                    mdi-tooltip-account
                  </v-icon>
                </v-avatar>
                </div>
                <v-row class="InputData">
                    <v-text-field
                      v-model="dataItem[0].masBranchName"
                      label="สาขา"
                      hide-details
                      class="pa-2 pb-0 pt-0 mb-3"
                      outlined
                      dense
                      readonly
                    ></v-text-field>
                  </v-row>
                <v-row class="InputData">
                    <v-text-field
                      v-model="dataItem[0].flowName"
                      label="ประเภทบริการ"
                      class="pa-2 pb-0 pt-0 mb-3"
                      outlined
                      hide-details
                      dense
                      readonly
                    ></v-text-field>
                  </v-row>
                <div
                  v-for="(item, index) in dataItem"
                  :key="index"
                >
                  <template
                    v-if="
                      item.conditionField === '' ||
                        item.conditionField === null
                    "
                  >
                    <v-row class="InputData">
                      <v-text-field
                        v-model="item.fieldValue"
                        :label="item.fieldName"
                        class="pa-2 pb-0 pt-0 mb-3"
                        hide-details
                        outlined
                        dense
                        readonly
                        v-if="item.fieldName === 'เบอร์โทร'"
                        @click="dial(item.phone)"
                        prepend-inner-icon="mdi-phone"
                      ></v-text-field>
                      <v-text-field
                        v-model="item.fieldValue"
                        :label="item.fieldName"
                        hide-details
                        class="pa-2 pb-0 pt-0 mb-3"
                        outlined
                        dense
                        readonly
                        v-else
                      ></v-text-field>
                    </v-row>
                  </template>
                  <template
                    v-if="
                      item.conditionField !== '' &&
                        dataItem.filter(row => {
                          return (
                            row.fieldId ===
                            parseInt(item.conditionField)
                          );
                        }).length > 0
                    "
                  >
                    <template
                      v-if="
                        item.conditionValue ===
                          dataItem.filter(row => {
                            return (
                              row.fieldId ===
                              parseInt(item.conditionField)
                            );
                          })[0].fieldValue
                      "
                    >
                      <v-row class="InputData">
                        <v-text-field
                          v-model="item.fieldValue"
                          :label="item.fieldName"
                          class="pa-2 pb-0 pt-0 mb-3"
                          hide-details
                          outlined
                          dense
                          readonly
                          v-if="item.fieldName === 'เบอร์โทร'"
                          @click="dial(item.phone)"
                          prepend-inner-icon="mdi-phone"
                        ></v-text-field>
                        <v-text-field
                          v-model="item.fieldValue"
                          :label="item.fieldName"
                          class="pa-2 pb-0 pt-0 mb-3"
                          hide-details
                          outlined
                          dense
                          readonly
                          v-else
                        ></v-text-field>
                      </v-row>
                    </template>
                  </template>
                    <template  v-if="item.conditionField === 'flow' ">
                      <template v-if="parseInt(item.conditionValue) === parseInt(flowIdSelect) ">
                        <v-row class="InputData">
                          <v-text-field
                            v-model="item.fieldValue"
                            :label="item.fieldName"
                            class="pa-2 pb-0 pt-0 mb-3"
                        hide-details
                            outlined
                            dense
                            readonly
                            v-if="item.fieldName === 'เบอร์โทร'"
                            @click="dial(item.phone)"
                            prepend-inner-icon="mdi-phone"
                          ></v-text-field>
                          <v-text-field
                            v-model="item.fieldValue"
                            :label="item.fieldName"
                            class="pa-2 pb-0 pt-0 mb-3"
                        hide-details
                            outlined
                            dense
                            readonly
                            v-else
                          ></v-text-field>
                        </v-row>
                      </template>
                    </template>
                </div>
                <!-- <v-row class="InputData" v-if="dataItem[0].stepTitle">
                  <h5>ขั้นตอนปัจจุบัน : {{dataItem[0].stepTitle}}</h5>
                </v-row> -->
                <v-col cols="12" class="pb-2">
                  <v-timeline
                  v-for="(itemStep , indexStep) in dataFlowStep.filter((v) => parseInt(v.flowId) === flowId)" :key="indexStep"
                      align-top
                      dense
                      class="pt-2"
                    >
                      <v-timeline-item
                      class="pb-1 pt-0"
                      v-if="itemStep.stepId === stepId"
                        :color="secondaryColor"
                        small
                      >
                        <v-row class="pt-1">
                          <v-col cols="3" class="px-1">
                            <strong
                              v-if="dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId).length > 0"
                              >{{dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId)[0].CREATE_DATE_TIME + ' น.'}}
                            </strong>
                          </v-col>
                          <v-col cols="9">
                            <strong
                      v-if="itemStep.stepTitle !== null"
                      class="mb-1" style="font-size:14px;color: #000000;"
                      >{{itemStep.stepTitle}}</strong>
                          </v-col>
                        </v-row>
                      </v-timeline-item>
                      <v-timeline-item
                      class="pb-1 pt-0"
                      v-else
                        color="#8A8D9F"
                        small
                      >
                        <v-row class="pt-1">
                          <v-col cols="3" class="px-1">
                            <strong
                              v-if="dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId).length > 0"
                              >{{dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId)[0].CREATE_DATE_TIME + ' น.'}}
                            </strong>
                          </v-col>
                          <v-col cols="9">
                            <strong
                      v-if="itemStep.stepTitle !== null"
                      class="mb-1" style="font-size:14px;color: #000000;"
                      >{{itemStep.stepTitle}}</strong>
                          </v-col>
                        </v-row>
                      </v-timeline-item>
                  </v-timeline>
                  <!-- <v-row v-for="(itemStep , indexStep) in dataFlowStep.filter((v) => parseInt(v.flowId) === flowId)" :key="indexStep">
                    <v-col cols="2" class="text-right py-0 pr-0" style="display: flex;justify-content: flex-end;align-items: center;">
                      <p
                      class="font-weight-bold mb-1" style="font-size:14px"
                      v-if="dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId).length > 0"
                      >{{dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId)[0].CREATE_DATE_TIME + ' น.'}}
                    </p>
                    </v-col>
                    <v-col cols="2" class="text-center py-0 px-0" style="display: flex;justify-content: center;align-items: center;">
                      <v-icon v-if="itemStep.stepId === stepId" color="#173053" class="mx-2 mr-2 mt-1 iconify"  data-icon="teenyicons:git-commit-solid"></v-icon>
                      <v-icon v-else class="mx-2 mr-2 mt-1 iconify" color="#8A8D9F"  data-icon="teenyicons:git-commit-outline"></v-icon>
                    </v-col>
                    <v-col cols="8" class="py-0 pl-0">
                      <p
                      v-if="itemStep.stepTitle !== null"
                      class="font-weight-bold mb-1" style="font-size:14px;color: #8A8D9F;"
                      >{{itemStep.stepTitle}}</p>
                    </v-col>
                  </v-row> -->
                </v-col>
                <v-row class="InputData">
                  <v-select
                  class="ma-2"
                    dense
                    outlined
                    label="ขั้นตอนต่อไป"
                    v-model="stepItemSelete"
                    :items="stepItemSeleteInBoard"
                    hide-details
                    item-text="text"
                    item-value="stepId"
                    :rules="[rules.required]"
                  ></v-select>
                </v-row>
                <v-row class="InputData">
                  <v-autocomplete
                  class="ma-2"
                    outlined
                    dense
                    hide-details
                    label="ชื่อพนักงานที่รับผิดชอบ"
                    v-model="empSelete"
                    :items="empSeleteStep.filter((i) => i.masBranchID === masBranchID || i.masBranchID === '')"
                    :rules="[rules.required]"
                  ></v-autocomplete>
                </v-row>
                <div class="text-center mb-10 mt-6">
                  <v-btn :color="secondaryColor" rounded depressed dark @click="onUpdate()">
                    <v-icon left>
                      mdi-swap-horizontal
                    </v-icon>
                    เปลี่ยนสถานะ
                  </v-btn>
                </div>
              </v-card >
              <v-dialog v-model="dialogLogStampStep"  fullscreen scrollable>
                <v-card :style="'background-color:' + primaryColor + ' ;'" >
                  <div class="pa-0 ma-2 mb-4 mt-4 mr-5" style="display: flex;justify-content: flex-end;">
                    <v-avatar size="62" >
                    <img
                      :src="shopData[0].shopImge"
                      alt="John"
                    >
                  </v-avatar>
                  </div>
                 <v-card class="ma-4 py-4 px-3">
                  <div style="display: flex;justify-content: flex-start;" class="mb-4">
                    <v-icon x-large :color="secondaryColor"  @click="dialogLogStampStep = false" class="mr-6">mdi-arrow-left-box</v-icon>
                  </div>
                  <v-card-title class="my-3" style="display: flex;justify-content: center;">
                  เปลี่ยนขั้นตอน
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <!-- <v-row v-for="(itemStep , indexStep) in dataFlowStep.filter((v) => parseInt(v.flowId) === flowId)" :key="indexStep">
                          <v-col cols="4" class="text-right py-0 pr-0" style="display: flex;justify-content: flex-end;align-items: center;">
                            <p
                            class="font-weight-bold mb-1" style="font-size:14px"
                            v-if="dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId).length > 0"
                            >{{dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId)[0].CREATE_DATE_TIME + ' น.'}}
                          </p>
                          </v-col>
                          <v-col cols="2" class="text-center py-0 px-0" style="display: flex;justify-content: center;align-items: center;">
                            <v-icon v-if="itemStep.stepId === stepId" color="#173053" class="mx-2 mr-2 mt-1 iconify"  data-icon="teenyicons:git-commit-solid"></v-icon>
                            <v-icon v-else class="mx-2 mr-2 mt-1 iconify" color="#8A8D9F"  data-icon="teenyicons:git-commit-outline"></v-icon>
                          </v-col>
                          <v-col cols="6" class="py-0 pl-0">
                            <p
                            v-if="itemStep.stepTitle !== null"
                            class="font-weight-bold mb-1" style="font-size:14px;color: #8A8D9F;"
                            >{{itemStep.stepTitle}}</p>
                          </v-col>
                        </v-row> -->
                        <v-timeline
                  v-for="(itemStep , indexStep) in dataFlowStep.filter((v) => parseInt(v.flowId) === flowId)" :key="indexStep"
                      align-top
                      dense
                      class="pt-2"
                    >
                      <v-timeline-item
                      class="pb-1 pt-0"
                      v-if="itemStep.stepId === stepId"
                        :color="secondaryColor"
                        small
                      >
                        <v-row class="pt-1">
                          <v-col cols="3" class="px-1">
                            <strong
                              v-if="dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId).length > 0"
                              style="color: #000000;"
                              >{{dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId)[0].CREATE_DATE_TIME + ' น.'}}
                            </strong>
                          </v-col>
                          <v-col cols="9">
                            <strong
                      v-if="itemStep.stepTitle !== null"
                      class="mb-1" style="font-size:14px;color: #000000;"
                      >{{itemStep.stepTitle}}</strong>
                          </v-col>
                        </v-row>
                      </v-timeline-item>
                      <v-timeline-item
                      class="pb-1 pt-0"
                      v-else
                        color="#8A8D9F"
                        small
                      >
                        <v-row class="pt-1">
                          <v-col cols="3" class="px-1">
                            <strong
                              v-if="dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId).length > 0"
                              style="color: #000000;"
                              >{{dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === jobNo && Ilog.stepId === itemStep.stepId)[0].CREATE_DATE_TIME + ' น.'}}
                            </strong>
                          </v-col>
                          <v-col cols="9">
                            <strong
                      v-if="itemStep.stepTitle !== null"
                      class="mb-1" style="font-size:14px;color: #000000;"
                      >{{itemStep.stepTitle}}</strong>
                          </v-col>
                        </v-row>
                      </v-timeline-item>
                  </v-timeline>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-row class="InputData">
                            <v-select
                            class="pa-2 pb-0 pt-0 mb-3 mt-4"
                              outlined
                              hide-details
                              dense
                              label="ขั้นตอนต่อไป"
                              v-model="stepItemSelete"
                              :items="stepItemSeleteInBoard"
                              item-text="text"
                              item-value="stepId"
                              :rules="[rules.required]"
                            ></v-select>
                          </v-row>
                          <v-row class="InputData">
                            <v-autocomplete
                            class="pa-2 pb-0 pt-0 mb-3"
                              outlined
                              hide-details
                              dense
                              label="ชื่อพนักงานที่รับผิดชอบ"
                              v-model="empSelete"
                              :items="empSeleteStep.filter((i) => i.masBranchID === masBranchID || i.masBranchID === '')"
                              :rules="[rules.required]"
                            ></v-autocomplete>
                          </v-row>
                          <div class="text-center my-4">
                            <v-btn :color="secondaryColor" rounded dark @click="onUpdate()">
                              <v-icon left>
                                mdi-swap-horizontal
                              </v-icon>
                              เปลี่ยนสถานะ
                            </v-btn>
                          </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                 </v-card>
                </v-card>
              </v-dialog>
            </div>
        </v-card-text>
        <v-footer
        fixed
        :style="'background-color:' + primaryColor + ' ;display: flex;justify-content: center;'"
        class="pa-6 py-1"

    >
    <strong style="color: #FFFFFF;">POWER BY  BETASK CONSULTING</strong>
    </v-footer>
   </div>
</template>

<script>
import axios from 'axios' // api
import moment from 'moment-timezone' // แปลง date
// import waitingAlert from '../waitingAlert.vue'
export default {
  components: {
    // waitingAlert
  },
  data () {
    return {
      dataJobLog: [],
      DataBranchName: [],
      masBranchID: '',
      DataFlowName: [],
      flowId: '',
      stepId: '',
      overlay: false,
      dialogLogStampStep: false,
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        required: value => !!value || 'กรุณากรอก.'
      },
      dataItem: [],
      dataItemAll: [],
      stepItemSelete: [],
      stepItemSeleteInBoard: [],
      empSelete: '',
      empSeleteStep: [],
      dataFlowStep: [],
      shopId: this.$session.getAll().data.shopId,
      jobId: '',
      jobNo: '',
      shopData: [],
      primaryColor: '',
      secondaryColor: '',
      statusStart: true
    }
  },
  async mounted () {
    // await this.getDataJob()
    await this.beforeCreate()
  },
  methods: {
    async getShop () {
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          console.log('rssssssssssss', rs)
          if (rs.length > 0) {
            this.shopData = rs
            this.primaryColor = rs[0].primaryColor
            this.secondaryColor = rs[0].secondaryColor
          }
        })
    },
    momentThaiText (item) {
      let dt = moment(item).locale('th').format('LLLL')
      return dt
    },
    callCustomer (data) {
      window.location = 'tel:' + data
    },
    async getJobLog (jobNo) {
      this.dataJobLog = []
      if (this.jobNo !== '') {
        let params = null
        // if (this.selectFlow === 'All') {
        // // if ()
        //   params = this.DNS_IP + '/job_log/get?shopId=' + this.shopId + '&checkOnsite=True&empStepId=' + this.session.data.empId + '&jobNo=' + this.jobLog_jobNo
        // } else {
        //   params = this.DNS_IP + '/job_log/get?shopId=' + this.shopId + '&flowId=' + this.selectFlow + '&empStepId=' + this.session.data.empId + '&jobNo=' + this.jobLog_jobNo
        // }
        if (this.selectFlow === 'All') {
        // if ()
          params = this.DNS_IP + '/job_log/get?shopId=' + this.shopId + '&checkOnsite=True&jobNo=' + jobNo
        } else {
          params = this.DNS_IP + '/job_log/get?shopId=' + this.shopId + '&flowId=' + this.flowId + '&jobNo=' + jobNo
        }
        await axios.get(params)
          .then(response => {
            let rs = response.data
            if (rs.length > 0) {
              this.dataJobLog = rs
            }
            console.log('!!!!!!JOB_LOG', rs)
          }).catch(error => {
            console.log('error function addData : ', error)
          })
      } else {
        this.dataJobLog = []
      }
    },
    async getDataBranch () {
      let DataBranchName = []
      let branchData = []
      this.DataBranchName = []
      await axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.masBranchName
              d.value = d.masBranchID
              DataBranchName.push(d)
            }
            if (this.$session.getAll().data.masBranchID === '' || this.$session.getAll().data.masBranchID === null) {
              this.DataBranchName = DataBranchName
            } else {
              let checkData = branchData.filter(el => { return el.value === this.$session.getAll().data.masBranchID })
              if (checkData.length > 0) {
                this.DataBranchName = checkData
              } else {
                await this.getDataBranch()
                if (checkData.length > 0) {
                  this.DataBranchName = checkData
                } else {
                  this.DataBranchName = []
                  this.branchData = []
                  this.$swal('ผิดพลาด', 'กรุณาตรวจสอบสาขาของท่าน เนื่องจากระบบตรวจหาสาขาไม่พบ', 'error')
                }
              }
            }
            this.overlay = false
            if (this.DataBranchName.length === 1) {
              this.masBranchID = this.DataBranchName[0].value
              this.getDataFlow()
            }
          } else {
            this.DataBranchName = []
            this.overlay = false
          }
        }).catch(async (error) => {
          this.overlay = false
          console.log('getDataBranch', error)
        })
    },
    async getDataFlow () {
      this.DataFlowName = []
      console.log('DataFlowName', this.DataFlowName)
      await axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId
        // + '&checkOnsite=is null'
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              if (d.masBranchID === this.masBranchID.toString() || (d.masBranchID === 'All' || d.masBranchID === null)) {
                d.text = d.flowName
                d.value = d.flowId
                this.DataFlowName.push(d)
              }
            }
            if (this.DataFlowName.length === 1) {
              this.flowId = this.DataFlowName[0].value
            }
          } else {
            this.DataFlowName = []
          }
        }).catch(async (error) => {
          console.log('getDataFlow', error)
        })
    },
    async getAllJob () {
      this.dataItemAll = []
      this.overlay = true
      await axios
        .get(this.DNS_IP + '/job/getJobItem?shopId=' + this.shopId + '&flowId=' + this.flowId + '&masBranchID=' + this.masBranchID)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.dataItemAll = rs
            this.overlay = false
          } else {
            this.$swal('ผิดพลาด', 'ไม่ได้ Job ที่ท่านแสกน', 'error')
            this.overlay = false
          }
        }).catch(async () => {
          this.$swal('ผิดพลาด', 'ไม่ได้ Job ที่ท่านแสกน', 'error')
          this.overlay = false
        })
    },
    async getDataJob () {
      this.dataItem = []
      let jobNo = ''
      if (this.$route.query.jobNo !== undefined) {
        jobNo = this.$route.query.jobNo
      } else {
        jobNo = this.jobNo
      }
      this.overlay = true
      await axios
        .get(this.DNS_IP + '/job/get?jobNo=' + jobNo)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.dataItem = rs
            this.empSelete = rs[0].empStep || ''
            if (this.$route.query.jobNo !== undefined) {
              this.flowId = rs[0].flowId
              this.masBranchID = rs[0].masBranchID || ''
            }
            this.stepId = rs[0].stepId || ''
            this.jobId = rs[0].jobId || ''
            this.jobNo = rs[0].jobNo || ''
            await this.getStepFlow(rs[0].stepId)
            await this.getEmpSelect()
            await this.getJobLog(rs[0].jobNo)
            // await this.getStepFlow(rs[0].stepId)
            this.overlay = false
          } else {
            this.$swal('ผิดพลาด', 'ไม่ได้ Job ที่ท่านแสกน', 'error')
            this.overlay = false
          }
        }).catch(async () => {
          this.$swal('ผิดพลาด', 'ไม่ได้ Job ที่ท่านแสกน', 'error')
          this.overlay = false
        })
    },
    async getStepFlow (stepId) {
      let dataStepItemSelete = []
      await axios
        .get(
          this.DNS_IP +
            '/flowStep/get?flowId=' +
            this.flowId +
            '&shopId=' +
            this.shopId
        )
        .then(async response => {
          let rs = response.data
          console.log('flowStep', rs)
          if (rs.length > 0) {
            this.dataFlowStep = rs
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.stepTitle
              d.value = d.stepId
              dataStepItemSelete.push(d)
            }
            this.stepItemSeleteInBoard = dataStepItemSelete.filter(el => el.value !== stepId)
          }
        })
    },
    async getEmpSelect () {
      this.empSeleteStep = []
      await axios
        .get(this.DNS_IP + '/empSelect/getUse?privacyPage=board&shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.masBranchID = d.masBranchID || ''
              if (this.$session.getAll().data.masBranchID === '' || this.$session.getAll().data.masBranchID === null) {
                let s = {}
                s.text = d.empFirst_NameTH + ' ' + d.empLast_NameTH
                s.value = d.empId
                s.masBranchID = d.masBranchID
                this.empSeleteStep.push(s)
              } else {
                if (this.$session.getAll().data.masBranchID === d.masBranchID || d.masBranchID === '') {
                  let s = {}
                  s.text = d.empFirst_NameTH + ' ' + d.empLast_NameTH
                  s.value = d.empId
                  s.masBranchID = d.masBranchID
                  this.empSeleteStep.push(s)
                }
              }
            }
            // console.log('empSeleteStep', this.empSeleteStep)
          }
        })
    },
    async onUpdate () {
      if (this.empSelete !== '' && this.stepItemSelete !== '') {
        this.overlay = true
        this.$swal({
          title: 'ต้องการ แก้ไขสถานะ ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        })
          .then(async result => {
            this.overlay = true
            let dt = {
              shopId: this.shopId,
              flowId: this.flowId,
              stepId: this.stepItemSelete,
              empStep: this.empSelete,
              LAST_USER: this.$session.getAll().data.userName
            }
            var ID = this.jobId
            // delete this.formUpdate['stepTitle']
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + '/job/edit/' + ID,
                dt
              )
              .then(async response => {
                await this.updateTimeEmp(this.dataItem.filter((item) => item.jobId === this.jobId)[0], 'closeStep', this.empSelete)
                await this.pushmessage(this.jobId)
                await this.NotifyEmpTime(this.jobNo)
                this.$swal('เรียบร้อย', 'แก้ไขสถานะ เรียบร้อย', 'success')
                this.stepItemSelete = ''
                this.empSelete = ''
                await this.getDataJob()
                this.overlay = false
              })
            // eslint-disable-next-line handle-callback-err
              .catch(error => {
                this.overlay = false
                console.log('error function editDataGlobal : ', error)
              })
          })
          .catch(error => {
            this.overlay = false
            console.log('error function editDataGlobal : ', error)
          })
      } else {
        this.overlay = false
        this.$swal('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ', 'error')
      }
    },
    async pushmessage (jobId) {
      let updateStatusSend = { updateStatusSend: 'false' }
      await axios
        .post(this.DNS_IP + '/job/pushMsg/' + jobId, updateStatusSend)
        .then(console.log(jobId))
    },
    async NotifyEmpTime (jobNo) {
      await axios
        .post(this.DNS_IP + '/job/NotifyEmpTime/' + jobNo)
        .then(console.log(jobNo))
    },
    async updateTimeEmp (itemsJob, status, empIdstep) {
      let dt = this.format_date(new Date())
      itemsJob.Time = dt
      itemsJob.statusTime = status
      if (status === 'closeStep') {
        itemsJob.empId = empIdstep
        if (itemsJob.empId !== '' && itemsJob.empId !== null) {
          await axios.post(this.DNS_IP + '/TimeEmp_Log_Update/get', itemsJob).then(async (response) => {

          }).catch((error) => {
            console.log('error function addData : ', error)
          })
        } else {
          console.log('ผิดพลาด', 'กรุณาเลือกพนักงานที่รับผิดชอบ', 'error')
        }
      }
    },
    async beforeCreate () {
      if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
        if (JSON.parse(localStorage.getItem('sessionData')).shopId === this.$route.query.shopId) {
          this.$session.start()
          this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
          if (this.$route.query.jobNo !== undefined) {
            // await this.getDataBranch()
            await this.getShop()
            this.getDataJob()
            console.log('Job')
            this.overlay = false
          } else {
            // this.getAllJob()
            await this.getShop()
            await this.getDataBranch()
            console.log('AllJob')
            this.overlay = false
          }
        } else {
          if (this.$route.query.jobNo !== undefined) {
            this.$router.push('/Core/Login?jobNo=' + this.$route.query.jobNo + '&shopId=' + this.$route.query.shopId + '&type=AdminStampStep')
          } else {
            this.$router.push('/Core/Login?shopId=' + this.$route.query.shopId + '&type=AdminStampStep')
          }
        }
      } else {
        if (!this.$session.exists()) {
          if (this.$route.query.jobNo !== undefined) {
            this.$router.push('/Core/Login?jobNo=' + this.$route.query.jobNo + '&shopId=' + this.$route.query.shopId + '&type=AdminStampStep')
          } else {
            this.$router.push('/Core/Login?shopId=' + this.$route.query.shopId + '&type=AdminStampStep')
          }
        } else {
          if (this.$session.getAll().data.shopId === this.$route.query.shopId) {
            localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
            if (this.$route.query.jobNo !== undefined) {
              // await this.getDataBranch()
              await this.getShop()
              this.getDataJob()
              console.log('Job')
              this.overlay = false
            } else {
              // this.getAllJob()
              await this.getShop()
              await this.getDataBranch()
              this.overlay = false
              console.log('AllJob')
            }
          } else {
            if (this.$route.query.jobNo !== undefined) {
              this.$router.push('/Core/Login?jobNo=' + this.$route.query.jobNo + '&shopId=' + this.$route.query.shopId + '&type=AdminStampStep')
            } else {
              this.$router.push('/Core/Login?shopId=' + this.$route.query.shopId + '&type=AdminStampStep')
            }
          }
        }
      }
    }
  }
}

</script>
<style scope>
.InputData{
  margin: 0px !important;
  padding: 0px !important;
  border-radius: 15px 15px 15px 15px;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 90%;
  text-align: center;
}
.main{
  padding: 0px;
  background: #FFFFFF;
}
.content{
  align-items: center;
  border-radius: 50px;
}
</style>
