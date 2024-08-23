<template>
  <div>
    <left-menu-admin ref="movein" menuActive="0" :sessionData="session"></left-menu-admin>
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left pa-0">
            <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
          </v-col>
        </v-row>
        <v-row>
          <!-- FromDataShow -->
          <v-col clos="5" class="pa-0">
            <template>
              <div class="text-center">
                <v-form>
                  <v-row>
                    <v-col cols="8" class="pa-0">
                      <v-sheet tile height="54" class="d-flex">
                        <!-- เลือกขั้นตอนบริการ -->
                        <v-col cols="12" sm="4">
                          <v-select
                            v-model="formAdd.flowId"
                            :items="editedItemSelete"
                            label="เลือกขั้นตอนบริการ"
                            dense
                            outlined
                            hide-details
                            @change="flowfieldtest(formAdd.flowId)"
                          >
                          </v-select>
                        </v-col>

                        <!-- สาขา -->
                        <v-col cols="12" sm="4">
                          <v-select
                            v-model="formAdd.masBranchID"
                            :items="DataBranchName"
                            @change="flowfieldtest(), checkTime()"
                            dense
                            outlined
                            hide-details
                            label="สาขา"
                          ></v-select>
                        </v-col>
                      </v-sheet>
                      </v-col>
                       <v-col cols="12" sm="4" right>
                      <v-alert v-if="itemJob.length >= 20"
                        :value="alert"
                        outlined
                        type="warning"
                        prominent
                        border="left"
                        elevation="24"
                      >
                        จำนวนรถในศูนย์ เต็มจำนวนแล้ว เพิ่ม แพ็คเก็จมากขึ้น
                         <v-btn small  color="primary" @click="moveOn()">
                            <v-icon small left>mdi-download</v-icon>
                            เพิ่มแพ็คเก็จ
                          </v-btn>
                      </v-alert>
                      </v-col>
                      <br>
                      <br />
                      <!-- <v-card v-show="formAdd.flowCode && formAdd.masBranchID !== '' "
                      class="mx-auto"
                      max-width="500"> -->
                      <v-col cols="12" class="pa-0">
                      <v-card
                        max-width="500%"
                      >
                      <br>
                        <v-container>
                          <v-row justify="center">
                            <v-col cols="6" style="margin: auto 0;">
                              <v-col style="margin-left: 1px;">
                                <v-img
                                  :src="require('@/assets/OBJECTSINSECTCARS.svg')"
                                ></v-img>
                              </v-col>
                              <v-col>
                      <v-img :src="require('@/assets/customtextAdd.svg')"></v-img>
                      </v-col>
                            </v-col>
                            <v-col cols="6">
                              <v-col class="text-center pa-0">
                                <v-img
                                  class="v_text_new"
                                  :src="require('@/assets/NewcarText.png')"
                                ></v-img>
                              </v-col>
                            <v-form  v-show="formAdd.flowId && formAdd.masBranchID !== ''" ref="form" v-model="valid" lazy-validation>
                              <div v-for="(p, index) in flowfieldNameitem" :key="index">
                                <div class="pa-0" v-if="p.conditionField === '' || p.conditionField === null ">
                                  <div>
                                    <div v-if="p.fieldType == 'text'">
                                      <br />
                                      <v-text-field
                                        v-model="p.fieldValue"
                                        :label="p.fieldName"
                                        dense
                                        :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                    </div>
                                    <div v-if="p.fieldType == 'number'">
                                      <br />
                                      <v-text-field
                                        v-model="p.fieldValue"
                                        :label="p.fieldName"
                                        dense
                                        :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                    </div>
                                    <v-row>
                                      <v-col
                                        cols="12"
                                        v-if="p.fieldType == 'Autocompletes'"
                                        style="padding-top: 0px;padding-bottom: 0px;"
                                      >
                                      <br />
                                        <v-autocomplete
                                          v-model="p.fieldValue"
                                          :items="JSON.parse(p.optionField)"
                                          dense
                                          filled
                                          :label="p.fieldName"
                                          :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                        ></v-autocomplete>
                                      </v-col>
                                      <v-col
                                        cols="12"
                                        v-if="p.fieldType == 'Selects'"
                                        style="padding-top: 0px;padding-bottom: 0px;"
                                      >
                                      <br />
                                        <div>
                                          <v-select
                                            v-model="p.fieldValue"
                                            :items="JSON.parse(p.optionField)"
                                            menu-props="auto"
                                            :label="p.fieldName"
                                            hide-details
                                            outlined
                                            dense
                                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                          ></v-select>
                                        </div>
                                      </v-col>
                                    </v-row>
                                    <div v-if="p.fieldType == 'Radio'" style="padding:0px;">
                                        <br />
                                        <v-container fluid style="padding:0px;">
                                          <v-radio-group
                                            row
                                            v-model="p.fieldValue"
                                            style="margin:0px;"
                                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                          >
                                          <template v-slot:label> </template>
                                          <div
                                            v-for="radios in JSON.parse(
                                              p.optionField
                                            )"
                                            :key="radios.toISOString"
                                            class="text-center"
                                          >
                                            <v-radio
                                              :label="radios.text"
                                              dense
                                              :value="radios.value"
                                            ></v-radio>
                                          </div>
                                        </v-radio-group>
                                      </v-container>
                                    </div>
                                  </div>
                                </div>
                                <div  v-if="p.conditionField !== '' && flowfieldNameitem.filter(row => {return (row.fieldId === parseInt(p.conditionField));}).length > 0">
                                  <div v-if="p.conditionValue === flowfieldNameitem.filter(row => {return (row.fieldId === parseInt(p.conditionField));})[0].fieldValue">
                                    <div v-if="p.fieldType == 'text'">
                                      <br />
                                      <v-text-field
                                        v-model="p.fieldValue"
                                        :label="p.fieldName"
                                        dense
                                        :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                    </div>
                                    <div v-if="p.fieldType == 'number'">
                                      <br />
                                      <v-text-field
                                        v-model="p.fieldValue"
                                        :label="p.fieldName"
                                        dense
                                        :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                    </div>
                                    <div
                                      cols="12"
                                      v-if="p.fieldType == 'Autocompletes'"
                                    >
                                      <v-autocomplete
                                        v-model="p.fieldValue"
                                        :items="JSON.parse(p.optionField)"
                                        dense
                                        filled
                                        :label="p.fieldName"
                                        :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                      ></v-autocomplete>
                                    </div>
                                      <div v-if="p.fieldType == 'Selects'">
                                        <v-select
                                          v-model="p.fieldValue"
                                          :items="JSON.parse(p.optionField)"
                                          menu-props="auto"
                                          :label="p.fieldName"
                                          dense
                                          hide-details
                                          outlined
                                          :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                        ></v-select>
                                      </div>
                                      <div v-if="p.fieldType === 'Radio'" style="padding:0px;">
                                        <br />
                                        <v-container fluid style="padding:0px;">
                                          <v-radio-group
                                            row
                                            v-model="p.fieldValue"
                                            style="margin:0px;"
                                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                          >
                                            <template v-slot:label> </template>
                                            <div
                                              v-for="radios in JSON.parse(
                                                p.optionField
                                              )"
                                              :key="radios.toISOString"
                                              class="text-center"
                                            >
                                              <v-radio
                                                :label="radios.text"
                                                dense
                                                :value="radios.value"
                                              ></v-radio>
                                            </div>
                                          </v-radio-group>
                                        </v-container>
                                      </div>
                                  </div>
                                </div>
                                <div  v-if="p.conditionField === 'flow' ">
                                  <div v-if="parseInt(p.conditionValue) === parseInt(formAdd.flowId) ">
                                    <div v-if="p.fieldType == 'text'">
                                      <br />
                                      <v-text-field
                                        v-model="p.fieldValue"
                                        :label="p.fieldName"
                                        dense
                                        :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                    </div>
                                    <div v-if="p.fieldType == 'number'">
                                      <br />
                                      <v-text-field
                                        v-model="p.fieldValue"
                                        :label="p.fieldName"
                                        dense
                                        :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                    </div>
                                    <div
                                      cols="12"
                                      v-if="p.fieldType == 'Autocompletes'"
                                    >
                                      <v-autocomplete
                                        v-model="p.fieldValue"
                                        :items="JSON.parse(p.optionField)"
                                        dense
                                        filled
                                        :label="p.fieldName"
                                        :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                      ></v-autocomplete>
                                    </div>
                                      <div v-if="p.fieldType == 'Selects'">
                                        <v-select
                                          v-model="p.fieldValue"
                                          :items="JSON.parse(p.optionField)"
                                          menu-props="auto"
                                          :label="p.fieldName"
                                          dense
                                          :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                          hide-details
                                          outlined
                                        ></v-select>
                                      </div>
                                      <div v-if="p.fieldType === 'Radio'" style="padding:0px;">
                                        <br />
                                        <v-container fluid style="padding:0px;">
                                          <v-radio-group
                                            row
                                            v-model="p.fieldValue"
                                            style="margin:0px;"
                                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                                          >
                                            <template v-slot:label> </template>
                                            <div
                                              v-for="radios in JSON.parse(
                                                p.optionField
                                              )"
                                              :key="radios.toISOString"
                                              class="text-center"
                                            >
                                              <v-radio
                                                :label="radios.text"
                                                dense
                                                :value="radios.value"
                                              ></v-radio>
                                            </div>
                                          </v-radio-group>
                                        </v-container>
                                      </div>
                                  </div>
                                </div>
                              </div>
                              <br>
                              <v-row>
                                <v-col cols="6">
                                  <v-row>
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
                                        v-model="endDate"
                                        label="วันที่นัดส่งรถลูกค้า"
                                        persistent-hint
                                        dense
                                        readonly
                                        outlined
                                        required
                                        :rules="[rules.required]"
                                        prepend-icon="mdi-calendar"
                                        v-bind="attrs"
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="endDate"
                                      no-title
                                      @input="menu = false"
                                      :min="
                                    new Date(
                                      Date.now() -
                                        new Date().getTimezoneOffset() * 60000
                                    )
                                      .toISOString()
                                      .substr(0, 10)
                                  "
                                    ></v-date-picker>
                                  </v-menu>
                                  </v-row>
                                </v-col>

                                <v-col cols="6">
                                  <v-row>
                                  <v-icon
                                  class="pb-5 ma-2"
                                  small
                                  color="#7F87A7"
                                >
                                 mdi-clock-outline
                                </v-icon>
                                  <v-select
                                    v-model="endTime"
                                    :items="timeavailable"
                                    label="เวลา"
                                    menu-props="auto"
                                    outlined
                                    dense
                                    required
                                    :rules ="[rules.required]"
                                  ></v-select>
                                  </v-row>
                                </v-col>
                              </v-row>
                              <div class="text-center">
                              <v-btn
                                depressed
                                dark
                                color="#1B437C"
                                @click="alert = !alert , addData()"
                              >
                                รับรถใหม่
                              </v-btn>
                              <v-btn
                                depressed
                                dark
                                color="red"
                                @click="clearData()"
                              >
                                ล้างข้อมูล
                              </v-btn>
                              </div>
                            </v-form>
                            </v-col>
                            <v-col cols="1"></v-col>
                          </v-row>
                        </v-container>
                      </v-card>
                      </v-col>
                  </v-row>
                </v-form>
              </div>
            </template>
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
import Menu from '../System/Menu.vue'
// import moment from 'moment' // แปลง date

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    Menu
  },
  data () {
    return {
      PK: '',
      path: '/flow/', // Path Model
      // Menu Config
      dtname: [],
      dtitem: [],
      GroupId: [],
      itemJob: [],
      editedItemSelete: [],
      flowfieldNameitem: [],
      flowCode: '',
      form1: {},
      alert: false,
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'รับรถลูกค้ารายใหม่',
          disabled: false,
          href: '/Master/CustomTable'
        }
      ],
      showCard: false,
      DataBranchName: [],
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },

      // End Menu Config
      dataReady: true,
      canvas: true,
      dateTime: '', // Generate DateTime
      date: this.momenDate_1(new Date()),
      menu: false,
      endDate: '',
      endTime: '',
      checkCar: 'True',
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      formAdd: {
        flowId: '',
        fieldId: [],
        fieldName: '',
        optionField: '',
        flowCode: '',
        CREATE_USER: '',
        LAST_USER: '',
        masBranchID: ''
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
      // End Form Config ADD EDIT
      // Data Table Config
      columns: [
        { text: 'FieldId', value: 'fieldId' },
        { text: 'FieldName', value: 'fieldName' },
        { text: 'Type', value: 'fieldType' },
        { text: 'Option', value: 'optionField' },
        { text: 'Action', value: 'action', sortable: false, align: 'center' }
      ],
      dataItem: [],
      valid: true,
      validAdd: false,
      validUpdate: false,
      branchData: [],
      timeavailable: []
    }
  },
  async mounted () {
    // this.getGetToken(this.DNS_IP)
    this.dataReady = false
    // Get Data
    this.getCustomField()
    this.getDataBranch()
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    checkTime () {
      console.log('this.branchData', this.branchData)
      console.log('this.fromAdd.masBranchID', this.formAdd.masBranchID)
      this.timeavailable = JSON.parse(this.branchData.filter(item => { return item.masBranchID === this.formAdd.masBranchID })[0].setTime)
      console.log('timevailable', this.timeavailable)
    },
    async getCustomField () {
      this.editedItemSelete = []
      axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.text = d.flowName
              d.value = d.flowId
              this.editedItemSelete.push(d)
            }
          }
          console.log(this.editedItemSelete)
        })
    },
    getDataBranch () {
      this.DataBranchName = []
      this.branchData = []
      console.log('DataBranchName', this.DataBranchName)
      axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.masBranchName
              d.value = d.masBranchID
              this.DataBranchName.push(d)
              this.branchData.push(d)
            }
          }
        })
    },
    flowfieldtest (item) {
      let itemIncustomField = []
      axios
        .get(
          this.DNS_IP +
            '/flowField/get?flowId=' +
            this.formAdd.flowId +
            '&shopId=' +
            this.shopId
        )
        .then(response => {
          let tt = response.data
          // console.log('tt', tt)
          let flowId = tt[0].flowId
          let flowfieldName = []
          flowfieldName = JSON.parse(tt[0].flowfieldName)
          for (let a = 0; a < flowfieldName.length; a++) {
            let d = flowfieldName[a]
            itemIncustomField.push(d.fieldId)
          }
          this.getCustomfield(itemIncustomField, flowId)
          // console.log('itemIncustomField', itemIncustomField)
        })
    },
    async getCustomfield (item, flowId) {
      this.flowfieldNameitem = []
      await axios
        .get(this.DNS_IP + '/customField/fieldId?fieldId=' + item)
        .then(async response => {
          let rs = response.data
          console.log('rs', rs)
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.fieldId = d.fieldId
            s.flowId = flowId
            s.fieldName = d.fieldName
            s.optionField = d.optionField
            s.conditionField = d.conditionField
            s.fieldType = d.fieldType
            s.fieldValue = ''
            s.CREATE_USER = ''
            s.LAST_USER = ''
            s.showCard = d.showCard
            s.shopId = this.shopId
            s.endDate = d.endDate
            s.endTime = d.endTime
            s.checkCar = 'True'
            s.conditionValue = d.conditionValue
            s.requiredField = d.requiredField
            // if (d.conditionField !== '') {
            //   s.conditionFieldId = this.flowfieldNameitem.filter((row) => { return row.fieldId === d.conditionField })['fieldId']
            // } else {
            //   s.conditionField = ''
            // }
            this.form1[d.fieldId] = ''
            this.flowfieldNameitem.push(s)
          }
          var data1 = this.flowfieldNameitem.filter(el => parseInt(el.conditionField || 0) > 0)
          // var data2 = []
          for (let i = 0; i < data1.length; i++) {
            let d = data1[i]
            let indexC = this.flowfieldNameitem.findIndex(function (o) {
              return o.fieldId === d.fieldId
            })
            let indexF = this.flowfieldNameitem.findIndex(function (o) {
              return o.fieldId === parseInt(d.conditionField)
            })
            this.flowfieldNameitem.splice((indexF + 1), 0, this.flowfieldNameitem.splice(indexC, 1)[0])
            // data2.push({'indexC': indexC, 'indexF': indexF})
          }
          // console.log('data1', data1)
          // console.log('data2', data2)
          // for (var x = 0; x < data2.length; x++) {
          //   var s = data2[x]
          //   this.fieldNameItem.splice((s.indexF + 1), 0, this.fieldNameItem.splice(s.indexC, 1)[0])
          // }
          console.log(this.fieldNameItem)
          console.log('flowfieldNameitem', this.flowfieldNameitem)
          // setTimeout(() => this.validate('ADD'), 500)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    // async getjob () {
    //   this.itemJob = []
    //   await axios
    //     .get(this.DNS_IP + '/job/getCount?shopId=' + this.shopId + '&flowId=' + this.formAdd.flowId)
    //     .then(async (response) => {
    //       this.dataReady = true
    //       let rs = response.data
    //       await axios
    //         .get(this.DNS_IP_Betask + '/packet/get?shopId=' + this.shopId + '&source=Belinked')
    //         .then(async (responses) => {
    //           let rsPacket = responses.data[0].close
    //           if (rs.length <= parseInt(rsPacket)) {
    //             console.log('เข้า')
    //             setTimeout(() => this.addDataSubmit(), 500)
    //           }
    //         })
    //     })
    // },
    async moveOn () {
      this.$refs.movein.chkPlan()
    },
    chkAdd () {
      this.res = []
      axios
        .get(this.DNS_IP + '/only_shop/get?shopId=' + this.session.data.shopId)
        .then(response => {
          let rs = response.data[0].billingPlan
          console.log('rs', rs)
          if (rs === 'billing') {
            axios
              .get(
                this.DNS_IP +
                  '/member/Member?shopId=' +
                  this.session.data.shopId
              )
              .then(response => {
                const rs = response.data
                console.log(rs)
              })
          } else {
            axios
              .get(
                this.DNS_IP +
                  '/member/Member?shopId=' +
                  this.session.data.shopId
              )
              .then(response => {
                this.res = response.data
                if (this.res.length >= this.Limit) {
                  this.statusLimit = true
                } else {
                  this.statusLimit = false
                }
              })
          }
        })
    },
    addData () {
      this.validate('ADD')
      setTimeout(() => this.addDataSubmit(), 500)
      // this.getjob()
    },
    async addDataSubmit (p) {
      if (this.valid === true) {
        this.flowfieldNameitem[0].endDate = this.endDate
        this.flowfieldNameitem[0].endTime = this.endTime
        this.flowfieldNameitem[0].CREATE_USER = this.session.data.userName
        this.flowfieldNameitem[0].LAST_USER = this.session.data.userName
        console.log('flowfieldNameitem', this.flowfieldNameitem)
        let Add = []
        let fielditem = this.flowfieldNameitem
        for (let i = 0; i < this.flowfieldNameitem.length; i++) {
          let d = this.flowfieldNameitem[i]
          let update = {}
          if (d.conditionField === '' || d.conditionField === null) {
            update.masBranchID = this.formAdd.masBranchID
            update.CREATE_USER = update.CREATE_USER
            update.LAST_USER = update.LAST_USER
            update.checkCar = d.checkCar
            update.conditionField = d.conditionField
            update.conditionValue = d.conditionValue
            update.endDate = this.endDate
            update.endTime = this.endTime
            update.fieldId = d.fieldId
            update.fieldName = d.fieldName
            update.fieldType = d.fieldType
            update.fieldValue = d.fieldValue
            update.flowId = d.flowId
            update.optionField = d.optionField
            update.shopId = d.shopId
            update.showCard = d.showCard
            Add.push(update)
          } else {
            if (
              fielditem.filter(row => {
                return row.fieldId === parseInt(d.conditionField)
              }).length > 0
            ) {
              console.log('this', fielditem)
              if (
                d.conditionValue ===
              fielditem.filter(row => {
                return row.fieldId === parseInt(d.conditionField)
              })[0].fieldValue
              ) {
                update.masBranchID = this.formAdd.masBranchID
                update.CREATE_USER = update.CREATE_USER
                update.LAST_USER = update.LAST_USER
                update.checkCar = d.checkCar
                update.conditionField = d.conditionField
                update.conditionValue = d.conditionValue
                update.endDate = this.endDate
                update.endTime = this.endTime
                update.fieldId = d.fieldId
                update.fieldName = d.fieldName
                update.fieldType = d.fieldType
                update.fieldValue = d.fieldValue
                update.flowId = d.flowId
                update.optionField = d.optionField
                update.shopId = d.shopId
                update.showCard = d.showCard
                Add.push(update)
              }
            }
          }
        }
        console.log('Add', Add)
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
            this.shopId = this.shopId
            this.endDate = this.endDate
            this.endTime = this.endTime
            this.checkCar = this.checkCar
            console.log('Add', Add)
            console.log('checkCar', this.checkCar)
            console.log('endDate', this.endDate)
            console.log('endTime', this.endTime)
            console.log('shopId', this.shopId)
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + "/job/add",
                Add
              )
              .then(async response => {
              // Debug response
                console.log('addDataGlobal DNS_IP + /job/add', response)
                console.log('data', response)
                let updateStatusSend = {
                  updateStatusSend: 'false'
                }
                await axios
                  .post(
                    this.DNS_IP + '/job/NotifyQrcode/' + response.data.jobNo,
                    updateStatusSend
                  )
                  .then(
                    this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success'),
                    this.clearData()
                  // this.$router.push('/Master/FlowStep')
                  )
                  .catch(error => {
                    console.log('error function addDataGlobal : ', error)
                  })
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
    async clearData () {
      // eslint-disable-next-line no-redeclare
      this.formAdd.flowCode = ''
      this.formAdd.masBranchID = ''
      this.endDate = ''
      this.endTime = ''
      this.dtname = []
      for (var key in this.flowfieldNameitem) {
        if (this.flowfieldNameitem[key]) {
          this.flowfieldNameitem[key] = ''
        }
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
}
</style>
