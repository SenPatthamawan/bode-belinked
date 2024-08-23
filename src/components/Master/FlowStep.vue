<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-right" v-if="formUpdate.flowName">
            <p id="textTitleB">
              {{formUpdate.flowName}}
            </p>
          </v-col>
          <v-col cols="6" v-if="masBranchName">
            <p class="text-h4 text--primary">
              ({{masBranchName}})
            </p>
          </v-col>
          </v-row>
          <v-row>
           <v-card-title class="text-h6" style="margin-left: 500px; margin-bottom: 10px;">นัดส่ง:</v-card-title>
            <v-chip
              class="ma-2"
              color="red"
              text-color="white"
            >
              ภายใน 2 วัน
            </v-chip>

            <v-chip
              class="ma-2"
              color="primary"
              text-color="white"
            >
              ภายใน 4 วัน
            </v-chip>

            <v-chip
              class="ma-2"
              color="green"
              text-color="white"
            >
              มากกว่า 4 วัน
            </v-chip>
          </v-row>

        <!-- select flow-->
        <v-sheet tile height="54" class="d-flex">
          <!-- ประเภทบริการ -->
          <v-col cols="12" sm="3">
          <v-select
            :items="DataFlowName"
            v-model="formUpdate.flowName"
            @change="getStepFlow() , getLayout()"
            dense
            outlined
            hide-details
            label="ประเภทบริการ"
            class="ma-2"
          ></v-select>
          </v-col>
          <!-- สาขา -->
          <v-col cols="12" sm="3">
          <v-select
            :items="DataBranchName"
            v-model="masBranchName"
            @change="getStepFlow() , getLayout()"
            dense
            outlined
            hide-details
            value="สาขาบางกอกน้อย"
            label="สาขา"
            class="ma-2"
          ></v-select>
          </v-col>
          <v-col cols="6" class="v-margit_button_right text-right">
          <v-btn class="ma-2 mt-5" color="primary" depressed @click="newCars()">
              <v-icon left>mdi-account-plus</v-icon>
              รับรถใหม่
            </v-btn>
          <v-btn class="ma-2 mt-5" color="primary" depressed @click="editLayout()">
            <v-icon left>mdi-application-cog</v-icon>
            แก้ไข Layout
          </v-btn>
          <v-btn class="ma-2 mt-5" color="primary" depressed @click="editStep()">
              <v-icon left>mdi-application-cog</v-icon>
              แก้ไข ขั้นตอน
            </v-btn>
          </v-col>
        </v-sheet>
        <v-divider></v-divider>

        <!-- เปลี่ยนสถานะ step-->
          <v-row justify="center">
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <v-card>
                <v-col class="text-right">
                  <v-icon color="#173053" @click="(dialog = false), clearData()">mdi-close</v-icon>
                </v-col>
                <center>
              <v-col class="text-center">
                <v-img :src="require('@/assets/UpDateStatus.png')"></v-img>
              </v-col>
              </center>
              <!-- <v-col class="text-center">
                <span class="headline">เปลี่ยนสถานะ</span>
              </v-col> -->
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-row style="height: 45px">
                        <v-subheader id="subtextTitle">ขั้นตอนต่อไป</v-subheader>
                      </v-row>
                      <v-row style="height: 30px">
                        <v-select
                          dense
                          v-model="formUpdate.stepTitle"
                          :items="stepItemSelete"
                          item-text="text"
                          item-value="stepId"
                          return-object
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-row style="height: 45px">
                        <v-subheader id="subtextTitle">ชื่อพนักงานที่รับผิดชอบ</v-subheader>
                      </v-row>
                      <v-row style="height: 30px">
                        <v-autocomplete
                          dense
                          v-model="formUpdate.empStep"
                          :items="empSeleteStep"
                        ></v-autocomplete>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
                <v-col class="text-center">
                   <v-btn color="#1B437C" depressed dark @click="onUpdate()">
                    Save
                  </v-btn>
                </v-col>
                <br>
              </v-card>
            </v-dialog>
          </v-row>
          <!-- end เปลี่ยนสถานะ step -->

          <!-- DIALOG แก้ไขข้อมูล ใน card -->

          <v-dialog v-model="dialogEdit" persistent max-width="50%">
            <v-card>
              <v-form ref="form_edit" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-col class="text-right">
                      <v-btn small color="#E0E0E0" @click="(dialogEdit = false), clearData()">
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                  </v-col>
                  <v-row justify="center">
                    <v-col cols="5" class="text-center">
                        <v-col class="text-center">
                      <v-img  class="v-margit_img_reward" :src="require('@/assets/EditCard.png')" max-width="330"></v-img>
                      </v-col>
                    </v-col>

                      <v-col cols="6" class="v-margit_text_add mt-1">
                    <v-col class="text-center">
                      <v-img class="v_text_edit" :src="require('@/assets/GroupEditTitle.svg')"></v-img>
                      </v-col>
                    <v-col cols="12">
                     <div class="column is-3" v-for="(itemsEdit, index) in JobDataItem.filter((row) => {return row.jobId == formUpdate.jobId})" :key="index">
                       <strong>{{ itemsEdit.fieldName }}: </strong>
                    <v-col cols="12">
                      <v-text-field
                      v-model="itemsEdit.fieldValue"
                      required dense />
                    </v-col>
                    </div>
                    </v-col>
                    <v-col cols="12">
                      <v-row style="height: 50px" justify="center">
                      <v-col cols="6">
                      <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="formUpdate.endDate"
                              label="วันที่นัดส่งรถลูกค้า"
                              persistent-hint
                              prepend-icon="mdi-calendar"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="formUpdate.endDate"
                            no-title
                            @input="menu = false"
                          ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="6">
                <v-text-field
                  v-model="formUpdate.endTime"
                  label="เวลา"
                  type="time"
                  suffix=""
                  required
                ></v-text-field>
              </v-col>
                      </v-row>
                    </v-col>
                      </v-col>

                  </v-row>
                </v-container>
              </v-card-text>
              <br>
              <v-col class="text-center">
                       <v-btn
                        dark
                        elevation="2"
                        depressed
                        color="#1B437C"
                        @click="editData()"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        แก้ไข
                      </v-btn>
                      </v-col>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- END DIALOG แก้ไขข้อมูล ใน card -->

          <!-- DIALOG ค่าใช้จ่าย -->
          <v-dialog v-model="dialogDelete" persistent max-width="400px">
            <v-card>
              <center>
              <v-col>
                <v-img id="v-img-car" :src="require('@/assets/sendcar.png')"></v-img>
              </v-col>
              </center>
              <v-col class="text-center">
                <span class="headline">ค่าใช้จ่าย</span>
              </v-col>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-row style="height: 35px">
                        <v-col class="text-center">
                        <v-subheader id="subtextTitle">ค่าใช้จ่ายทั้งหมด</v-subheader>
                        </v-col>
                      </v-row>
                      <v-row style="height: 70px">
                        <v-col class="text-center">
                        <VuetifyMoney
                          v-model="formDelete.totalPrice"
                          placeholder="Amount"
                          dense
                          required
                          :rules="[rules.required]"
                          v-bind:options="options2" />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-col class="text-center">
                <v-btn
                  dark
                  elevation="2"
                  depressed
                  color="#1B437C"
                  @click="deleteDataPrice()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  เพิ่ม
                </v-btn>
                   <v-btn
                  color="primary" depressed
                  @click="dialogDelete = false,clearData()"
                >
                  <v-icon left> mdi-cancel</v-icon>
                  ยกเลิก
                </v-btn>
                </v-col>
                <br>
            </v-card>
          </v-dialog>
          <!-- end add -->

        <div class="workRow" v-show="formUpdate.flowName && masBranchName !== ''">
          <v-row>
          <v-col class="colum" v-for="(element , work ) in Layout" :key="work">
               <div v-for="(item , indexitem) in Layout[work].workData" :key="indexitem">
                <v-card class="mb-6">
                  <v-toolbar
                    color="primary"
                    dark
                  >
                    <v-card-title class=" text pa-3">
                      {{item.stepTitle}} ({{allJob.filter((row) => {return row.stepId == item.stepId}).length}})
                    </v-card-title>
                  </v-toolbar>

                  <div  v-for="(itemsJob, indexJob) in allJob.filter((row) => {return row.stepId == item.stepId})" :key="indexJob">
                    <v-list-item>
                      <v-alert class="allFrame pb-3"
                        style="min-height: 105px;"
                        color="cyan"
                        border="left"
                        elevation="2"
                        colored-border
                      >
                        <div class="bodyFrame" v-for="(items, index) in JobDataItem.filter((row) => {return row.jobId == itemsJob.jobId})" :key="index">
                          {{ items.fieldValue}}<br>
                        </div>
                        <v-icon large color="black"> mdi-account</v-icon> <strong>{{ JobDataItem.filter((row) => {return row.jobId == itemsJob.jobId})[0].empStep }}</strong>
                        <!-- diffDate -->
                          <v-chip v-if="parseInt(itemsJob.totalDateDiff) <= 2"
                            class="ma-2"
                            color="red"
                            draggable
                            justify="center"
                            align="center"
                          >
                            {{itemsJob.totalDateDiff}}
                          </v-chip>
                          <v-chip v-else-if="parseInt(itemsJob.totalDateDiff) <= 4 && parseInt(itemsJob.totalDateDiff) >=2"
                            class="ma-2"
                            color="primary"
                            text-color="white"
                            draggable
                            justify="center"
                            align="center"
                          >
                            {{itemsJob.totalDateDiff}}
                          </v-chip>
                          <v-chip v-else-if="parseInt(itemsJob.totalDateDiff) >= 4"
                            class="ma-2"
                            color="green"
                            text-color="white"
                            draggable
                            justify="center"
                            align="center"
                          >
                            {{itemsJob.totalDateDiff}}
                          </v-chip>
                          <!-- end diffDate -->
                        <v-spacer></v-spacer>
                        <v-container class="grey lighten-4" style="position:absolute; width:30px; right:0px; top:0px;">
                          <!-- update satatus car -->
                          <v-row class="pl-1">
                              <v-icon v-if="allJob.filter((row) => {return row.jobId == itemsJob.jobId})[0].checkCar == 'False'"
                                color="#9E9E9E"
                                depressed
                                @click="updateStatusCars(itemsJob.jobId, 'False')"
                              > mdi-car </v-icon>

                              <v-icon v-else
                                color="#4F93D0"
                                depressed
                                @click="updateStatusCars(itemsJob.jobId, 'True')"
                              > mdi-car </v-icon>
                          </v-row>
                          <!-- end update satatus car -->
                          <v-row class="pt-2 pl-1">
                            <v-icon large color="#DE6467" dark @click="dialogEdit = true, setUpdate(itemsJob)"> mdi-square-edit-outline </v-icon>
                          </v-row>
                          <v-row class="pt-2 pl-1">
                              <v-icon large color="#FED966" @click="dialog = true, setUpdate(itemsJob)"> mdi-layers-triple </v-icon>
                          </v-row>
                          <v-row class="pt-2 pl-1">
                              <v-icon large color="#84C650" @click="dialogDelete = true, setUpdate(itemsJob)"> mdi-tag </v-icon>
                          </v-row>
                        </v-container>
                      </v-alert>
                    </v-list-item>
                  </div>

                </v-card>
               </div>
             </v-col>
        </v-row>
        </div>

       </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import draggable from 'vuedraggable'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import Menu from '../System/Menu.vue'
import moment from 'moment' // แปลง date

export default {
  name: 'hello',
  components: {
    draggable,
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    Menu
  },
  data () {
    return {
      Layout: [],
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'Flow',
          disabled: false,
          href: '/Master/Flow'
        }
      ],
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        required: value => !!value || 'กรุณากรอก.'
      },
      DataflowId: '',
      dialog: false,
      dialogEdit: false,
      dialogDelete: false,
      date: this.momenDate_1(new Date()),
      menu: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      stepItemSelete: [],
      empSeleteStep: [],
      DataFlowName: [],
      TotalDate: [],
      DataBranchName: [],
      ItemSelete: [],
      userId: '',
      totalDateDiff: '',
      masBranchName: '',
      formUpdate: {
        stepId: '',
        flowId: '',
        flowName: 'กระดานทำงาน',
        stepTitle: '',
        sortNo: '',
        CREATE_USER: '',
        LAST_USER: '',
        endDate: '',
        endTime: '',
        jobId: '',
        empStep: '',
        departmentStep: '',
        branchStep: '',
        checkCar: ''
      },
      JobDataItem: [],
      allJob: [],
      form: {
        jobId: '',
        flowId: '',
        stepId: '',
        fieldId: '',
        fieldValue: '',
        fieldName: ''
      },
      formDelete: {
        jobNo: '',
        shopId: this.$session.getAll().data.shopId,
        totalPrice: ''
      },
      formUpdateCar: {
        jobNo: '',
        shopId: this.$session.getAll().data.shopId,
        checkCar: ''
      },
      formEditData: {
        jobNo: '',
        shopId: this.$session.getAll().data.shopId,
        fieldValue: '',
        endDate: '',
        endTime: ''
      }
    }
  },
  async mounted () {
    this.dataReady = false
    // Get Data
    await this.getDataFlow()
    await this.getDataBranch()
    await this.getEmpSelect()
  },
  methods: {
    async newCars () {
      this.$router.push('/Master/RegisterAdd?shopId=' + this.shopId)
    },
    async editStep () {
      this.$router.push('/Master/Flow')
    },
    async editLayout () {
      this.$router.push('/Master/WorkShop')
    },
    log: function (evt) {
      window.console.log(evt)
    },
    getDataFlow () {
      this.DataFlowName = []
      console.log('DataFlowName', this.DataFlowName)
      axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            d.text = d.flowName
            d.value = d.flowName
            this.DataFlowName.push(d)
          }
        } else {
          this.DataFlowName = []
        }
      })
    },
    getDataBranch () {
      this.DataBranchName = []
      console.log('DataBranchName', this.DataBranchName)
      axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            d.text = d.masBranchName
            d.value = d.masBranchId
            this.DataBranchName.push(d)
          }
        } else {
          this.DataBranchName = []
        }
      })
    },
    async getLayout () {
      this.Layout = []
      console.log('flowName', this.formUpdate.flowName)
      await axios.get(this.DNS_IP + '/WorkShopLayout/get?flowName=' + this.formUpdate.flowName + '&shopId=' + this.shopId)
        .then((response) => {
          let rs = response.data
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            var workData = []
            workData = JSON.parse(d.workData)
            this.Layout.push(
              {
                workShopId: d.workShopId,
                workColum: d.workColum,
                workData: workData
              }
            )
          }
          console.log('this.Layout', this.Layout)
        })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async getStepFlow () {
      this.stepItemSelete = []
      await axios
        .get(this.DNS_IP + '/flowStep/get?flowName=' + this.formUpdate.flowName + '&shopId=' + this.shopId)
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
            console.log('stepItemSelete', this.formUpdate)
            await this.getJobData()
          }
        })
    },
    async getEmpSelect () {
      this.empSeleteStep = []
      await axios
        .get(this.DNS_IP + '/empSelect/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              var s = {}
              s.text = d.empFirst_NameTH
              s.value = d.empFirst_NameTH
              this.empSeleteStep.push(s)
            }
            console.log('empSeleteStep', this.formUpdate)
            await this.getJobData()
          }
        })
    },
    async getJobData () {
      this.JobDataItem = []
      this.allJob = []
      axios
        .get(this.DNS_IP + '/job/get?flowName=' + this.formUpdate.flowName + '&shopId=' + this.shopId)
        .then(async (response) => {
          this.dataReady = true
          var jobs = []
          console.log('res', response.data)
          // console.log('userId', this.formUpdate.userId === 'NULL')
          if (response.data) {
            // this.formUpdate.stepId = response.data[0].stepId
            // this.formUpdate.flowId = response.data[0].flowId
            // this.formUpdate.jobId = response.data[0].jobId
            // this.formUpdate.jobNo = response.data[0].jobNo
            // this.formUpdate.empStep = response.data[0].empStep
            // this.formUpdate.departmentStep = response.data[0].departmentStep
            // this.formUpdate.branchStep = response.data[0].branchStep
            // this.formUpdate.checkCar = response.data[0].checkCar
            // this.totalDateDiff = response.data[0].totalDateDiff
            // this.formUpdate.endDate = response.data[0].endDate
            // this.userId = response.data[0].userId
            response.data.forEach(element => {
              if (jobs.indexOf(element.jobId) === -1) {
                jobs.push(element.jobId)
                this.allJob.push({jobId: element.jobId, jobNo: element.jobNo, stepId: element.stepId, checkCar: element.checkCar, totalDateDiff: element.totalDateDiff, endDate: element.endDate, endTime: element.endTime})
              }
            })
            this.JobDataItem = response.data
          }
          console.log('JobDataItem', this.JobDataItem)
          console.log('JobLEN', this.userId)
          console.log('allJob', this.allJob)
          console.log('endTime', this.formUpdate.endDate)
          console.log('totalDateDiff', this.totalDateDiff)
        })
    },
    async pushmessage (jobId) {
      let updateStatusSend = { updateStatusSend: 'false' }
      await axios
        .post(
          this.DNS_IP + '/job/pushMsg/' + jobId, updateStatusSend
        )
        .then(
          console.log(jobId)
        )
    },
    momenDate (value) {
      if (value) {
        return moment(String(value)).format('YYYY-MM-DD')
      }
    },
    async setUpdate (item) {
      console.log(this.formUpdate)
      console.log(item)
      this.formUpdate.jobId = item.jobId
      this.formUpdate.endDate = this.momenDate(item.endDate)
      this.formUpdate.endTime = item.endTime
      this.formDelete.jobNo = item.jobNo
    },
    async onUpdate () {
      this.formUpdate.stepId = this.formUpdate.stepTitle.stepId
      console.log('stepId', this.formUpdate.stepTitle.stepId)
      console.log('id', this.formUpdate.jobId)
      console.log('formUpdate', this.formUpdate)
      console.log('allJob', this.allJob)
      console.log('empSeleteStep', this.empSeleteStep)
      console.log('empStep', this.formUpdate.empStep)
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
          this.formUpdate.LAST_USER = this.session.data.userName
          var ID = this.formUpdate.jobId
          var flowName = this.formUpdate.flowName
          delete this.formUpdate['flowId']
          delete this.formUpdate['flowName']
          delete this.formUpdate['sortNo']
          delete this.formUpdate['CREATE_USER']
          // delete this.formUpdate['stepTitle']
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/job/edit/" + ID,
              this.formUpdate
            )
            .then(async (response) => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
              // this.dialog = false
              // this.$swal('เรียบร้อย', 'แก้ไขสถานะ เรียบร้อย', 'success')
              // this.getStepFlow()
              // this.getLayout()
              // this.allJob.map((row, index) => {
              //   if (row.jobId === ID) {
              //     this.allJob[index].stepId = this.formUpdate.stepId
              //   }
              // })
              this.formUpdate.flowName = flowName
              await this.pushmessage(this.formUpdate.jobId)
              this.dialog = false
              this.$swal('เรียบร้อย', 'แก้ไขสถานะ เรียบร้อย', 'success')
              this.getStepFlow()
              this.getLayout()
              // console.log('allJob', this.allJob)
              // console.log(this.formUpdate.jobId)
              // console.log(this.formUpdate.stepId)
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
    async clearData () {
      // eslint-disable-next-line no-redeclare
      for (var key in this.formEdit) {
        console.log('Key', key)
        console.log('Value', this.formEdit)

        if (this.formEdit[key]) {
          this.formEdit[key] = ''
        }
      }
    },
    async updateStatusCars (item, status) {
      console.log(this.formUpdate.jobId)
      console.log(item)
      this.$swal({
        title: 'อัพเดท สถานะรถ ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ยกเลิก'
      })
        .then(async (response) => {
          var ID = item
          var statusUse = ''
          if (status === 'True') {
            statusUse = 'False'
          } else {
            statusUse = 'True'
          }
          let ds = {
            jobNo: this.formUpdateCar.jobNo,
            shopId: this.formUpdateCar.shopId,
            checkCar: statusUse,
            LAST_USER: this.session.data.userName,
            statusUpdateCar: 'True'
          }
          console.log('ds', ds)
          await axios
            .post(
              this.DNS_IP + '/job/editStatus/' + ID, ds
            )
            .then(async response => {
              this.$swal('เรียบร้อย', 'อัพเดท สถานะรถ เรียบร้อย', 'success')
              this.getStepFlow()
              this.getLayout()
              console.log('shopId:', this.shopId)
              console.log('form:', this.formUpdateCar)
            })
        })
    },
    async pushmessagePrice (jobNo) {
      let updateStatusSend = { updateStatusSend: 'false' }
      await axios
        .post(
          this.DNS_IP + '/job/pushClosejob/' + jobNo, updateStatusSend
        )
        .then(
          console.log(jobNo)
        )
    },
    deleteDataPrice () {
      this.jobNo = ''
      console.log('shopId:', this.shopId)
      console.log('form:', this.formDelete)
      this.$swal({
        title: 'ให้บริการ เสร็จเรียบร้อยแล้ว ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#fa0202',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (response) => {
          var ID = this.formUpdate.jobId
          let ds = {
            jobNo: this.formDelete.jobNo,
            shopId: this.shopId,
            totalPrice: this.formDelete.totalPrice,
            LAST_USER: this.session.data.userName,
            statusDelete: 'true'
          }
          console.log('ds', ds)
          await axios
            .post(
              this.DNS_IP + '/job/editPrice/' + ID, ds
            )
            .then(async response => {
              await this.pushmessagePrice(this.formDelete.jobNo)
              this.$swal('เรียบร้อย', 'ลบข้อมูล เรียบร้อย', 'success')
              this.getStepFlow()
              this.getLayout()
              this.dialogDelete = false
              console.log('shopId:', this.shopId)
              console.log('form:', this.formDelete)
            })
        })
    },
    async editData () {
      console.log(this.JobDataItem.filter((row) => { return row.jobId === this.formUpdate.jobId }))
      this.jobNo = ''
      console.log('shopId', this.shopId)
      console.log('formEditData', this.formEditData)
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
          // var ID = this.formUpdate.jobId
          let rs = this.JobDataItem.filter((row) => { return row.jobId === this.formUpdate.jobId })
          let dt = []
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            var s = {}
            s.jobNo = d.jobNo
            s.jobId = d.jobId
            s.fieldId = d.fieldId
            s.fieldValue = d.fieldValue
            s.endDate = this.formUpdate.endDate
            s.endTime = this.formUpdate.endTime
            s.LAST_USER = d.LAST_USER
            dt.push(s)
          }
          console.log('dt', dt)
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/jobData/editData", dt
            )
            .then(async (response) => {
              this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
              this.getStepFlow()
              this.getLayout()
              this.dialogEdit = false
              console.log('shopId:', this.shopId)
              console.log('form:', this.formEditData)
            })
        })
    }
  }
}
</script>
<style scoped>
.workRow{
  display: inline-block;
  width: max-content;
  height: max-content;
}
.colum{
  margin-top: 1rem;
  width: 250px;
  background-color: #f0eeee;
  margin-left: 5px;
}
.allFrame{
  padding-top: 0px;
  width: 100%;
  height: max-content;
}
#subtextTitle {
  color: #173053;
  font-size: 20px !important;
  font-weight: bold;
}
#textTitleB {
  color: #173053;
  font-size: 40px !important;
  font-weight: bold;
  font-family: Roboto;
  font-style: normal;
}
#v-img-car {
  height: 60px;
  width: 64px;
}
.bodyFrame {
  padding-top: 1px;
}
body{
  overflow:auto;
  white-space: normal;
}
</style>
