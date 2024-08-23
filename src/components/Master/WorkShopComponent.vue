<template>
    <v-main>
      <v-dialog v-model="dialogWorkShop" persistent>
        <v-card min-width="200px" class="pa-3" style="overflow-y: auto;background-color: #FFFFFF;">
          <div style="text-align: end;">
              <v-btn
                fab
                small
                dark
                color="#F3F3F3"
                @click="CloseDialog(), dialogWorkShop = false"
              >
                <v-icon dark
                color="#FE4A01 ">
                  mdi-close
                </v-icon>
              </v-btn>
          </div>
          <div class="stepLayout">
        <v-col cols="12" sm="8">
            <h3 style="color:#1B437C">แก้ไขกระดานทำงาน</h3>
          </v-col>
        <v-row>
          <v-col cols="6" sm="4">
          <v-select
          v-model="DataBranchID"
            :items="DataMasbranch"
            label="เลือกสาขา"
            required
            dense
            outlined
            background-color="#FFFFFF"
            @change="getDataFlow()"
          ></v-select>
          </v-col>
        <v-col cols="6" sm="4" v-if="DataBranchID !== ''">
          <v-select
          v-model="DataflowId"
            :items="DataFlowName"
            label="เลือกประเภทงาน"
            required
            dense
            outlined
            background-color="#FFFFFF"
            @change="getLayout()"
          ></v-select>
        </v-col>
      </v-row>
      </div>
        <div class="workLayout ma-3">
          <v-row class="rowstep" >
              <draggable  v-model="stepData" group="workshop">
              <div  v-for="(element , step) in stepData" :key="step">
                   <v-card
                    class="pa-1 pl-3 mb-5"
                    width="180"
                    min-height="30px"
                   >
                    <p style="color:#1B437C">{{element.stepTitle}}</p>
                    </v-card>
              </div>
            </draggable>
            <div  v-for="(element , i ) in Layout" :key="i">
                <v-col cols="12" class="Layoutcolum pa-3">
                <draggable v-model="Layout[i].workData" group="workshop" @change="UpdateworkShop ()">
                  <div  v-for="(element , workData) in Layout[i].workData" :key="workData">
                    <v-card
                    class="pa-1 pl-2 mb-5"
                    width="180"
                    min-height="30px"
                    :color="codeColor[i]"
                   >
                    <strong dark class="mb-n5" style="color:#FFFFFF">{{element.stepTitle}}</strong>
                    </v-card>
                  </div>
                </draggable>
                </v-col>
            </div>
            <v-col >
              <div v-show="stepData.length > 0 || Layout.length > 0">
                <v-btn class="mx-2" elevation="2" outlined dark  color="primary" @click="AddColum ()">
                  <v-icon dark> mdi-plus </v-icon>
                  เพิ่มกระดาน
              </v-btn>
              </div>
              <div v-show="Layout.length > 0">
                <v-btn class="mx-2" elevation="2" outlined dark color="error" @click="DeleteColum ()">
                <v-icon dark> mdi-minus </v-icon>
                ลบกระดาน
              </v-btn>
              </div>
            </v-col>
            </v-row>
        </div>
        </v-card>
      </v-dialog>
    </v-main>
</template>

<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import Menu from '../System/Menu.vue'
import draggable from 'vuedraggable'

// import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
// import XLSX from 'xlsx' // import xlsx
// import readXlsxFile from 'read-excel-file'
// import moment from 'moment' // แปลง date
// const app = Vue.createApp({})

export default {
  components: {
    draggable,
    Menu,
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
  },
  created () {
    // setInterval(this.getNowGlobal, 1000)
  },
  watch: {
    // whenever question changes, this function will run
    // dialogWorkShop (newQuestion, oldQuestion) {
    //   console.log('dialogWorkShop', newQuestion, oldQuestion)
    //   if (newQuestion === false) {
    //     // this.getLayout()
    //     this.$emit('getLayout')
    //   }
    // }
  },
  data () {
    return {
      stepData: [],
      dialogWorkShop: false,
      Layout: [],
      DataflowId: '',
      DataBranchID: '',
      DataMasbranch: [],
      DataFlowName: [],
      stepItemSelete: [],
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      fromAdd: {
        workColum: null,
        workData: '',
        flowId: null,
        CREATE_USER: '',
        LAST_USER: '',
        shopId: ''
      },
      CCSS: 'rgb(142, 202, 230)',
      codeColor: [
        '#4D67AB',
        '#4E79C4',
        '#57A2AC',
        '#824D99',
        '#84C650',
        '#C65050',
        '#CE2220',
        '#E67F33',
        '#EB56F6',
        '#FED966',
        '#4D67AB',
        '#4E79C4',
        '#57A2AC',
        '#824D99',
        '#84C650',
        '#C65050',
        '#CE2220',
        '#E67F33',
        '#EB56F6',
        '#FED966'
      ],
      numberRules: [ (v) => (!isNaN(parseFloat(v)) && v >= 0 && v <= 9999999999) ]
    }
  },
  async mounted () {
    // await this.redirectBybord()
  },
  methods: {
    CloseDialog () {
      this.$emit('confirmed')
    },
    async showDialog (flowId, masBranchID) {
      await this.getDataMasbranch()
      await this.getStepFlow()
      console.log('item', flowId, masBranchID)
      // if (flowId && masBranchID) {
      this.DataBranchID = masBranchID
      await this.getDataFlow()
      this.DataflowId = flowId
      await this.getLayout()
      this.dialogWorkShop = true
      // } else {
      //   this.dialogWorkShop = false
      //   console.log('ELSE')
      // }
      // this.dialogWorkShop = true
    },
    async getStepFlow (flowId) {
      this.stepItemSelete = []
      await axios
        .get(
          this.DNS_IP +
            '/flowStep/get?flowId=' +
            flowId +
            '&shopId=' +
            this.shopId
        )
        .then(async response => {
          let rs = response.data
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
    getDataFlow () {
      this.Layout = []
      this.DataFlowName = []
      this.DataflowId = ''
      console.log('DataBranchID', this.DataBranchID)
      axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        // console.log('rs', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            if (d.masBranchID === this.DataBranchID.toString() || (d.masBranchID === 'All' || d.masBranchID === null)) {
              d.text = d.flowName
              d.value = d.flowId
              this.DataFlowName.push(d)
            }
          }
        } else {
          this.DataFlowName = []
          // console.log('DataFlowName136', this.DataFlowName)
        }
      })
    },
    getDataMasbranch () {
      this.DataMasbranch = []
      console.log('shopId', this.shopId)
      axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        console.log('rs', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            if (this.session.data.masBranchID === '' || this.session.data.masBranchID === null) {
              d.text = d.masBranchName
              d.value = d.masBranchID
              this.DataMasbranch.push(d)
            } else {
              if (d.masBranchID === this.session.data.masBranchID) {
                d.text = d.masBranchName
                d.value = d.masBranchID
                this.DataMasbranch.push(d)
              }
            }
          }
        } else {
          this.DataMasbranch = []
          // console.log('DataMasbranch', this.DataMasbranch)
        }
      })
    },
    async redirectBybord () {
      if (this.$route.query.flowId && this.$route.query.masBranchID) {
        this.DataflowId = this.$route.query.flowId
        this.DataBranchID = this.$route.query.masBranchID
        this.getLayout()
      }
    },
    async getLayout () {
      await this.getStepFlow(this.DataflowId)
      this.Layout = []
      await axios.get(this.DNS_IP + '/WorkShopLayout/get?flowId=' + this.DataflowId + '&shopId=' + this.shopId + '&masBranchID=' + this.DataBranchID)
        .then((response) => {
          let rs = response.data
          console.log('rs', rs)
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            var workData = []
            var workDataUse = []
            workData = JSON.parse(d.workData)
            console.log('workData', d.workData)
            console.log('this.stepItemSelete.filt', this.stepItemSelete)
            if (workData.length > 0) {
              console.log('1', workData)
              workData.forEach((item) => {
                if (this.stepItemSelete.filter(el => { return el.stepId === item.stepId }).length > 0) {
                  let s = {}
                  s.sortNo = item.sortNo
                  s.stepId = item.stepId
                  s.stepTitle = this.stepItemSelete.filter(el => { return el.stepId === item.stepId })[0].stepTitle
                  workDataUse.push(s)
                }
                console.log('workDataCheck', workDataUse)
              })
              // for (let x = 0; x < workData.length; x++) {
              //   let t = workData[x]
              //   let s = {}
              //   s.sortNo = t.sortNo
              //   s.stepId = t.stepId
              //   s.stepTitle = this.stepItemSelete.filter(el => { return el.stepId === t.stepId })[0].stepTitle || ''
              //   workDataUse.push(s)
              //   console.log('2')
              // }
            } else {
              workDataUse = []
            }
            this.Layout.push({
              workShopId: d.workShopId,
              workColum: d.workColum,
              workData: workDataUse
            })
          }
          const flowId = this.DataflowId
          this.getStep(flowId)
          console.log('this.Layout', this.Layout)
        })
        .catch((error) => {
          console.log('error function addDataGlobal7777777777 : ', error)
        })
    },
    async getStep (flowId) {
      this.stepData = []
      await axios
        .get(this.DNS_IP + '/flowStep/get?flowId=' + flowId + '&shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.status === false) {
            this.stepData = []
            this.DataflowId = ''
            this.$swal('ผิดพลาด', 'กรุณากำหนดขั้นตอนการทำงาน', 'error')
          } else {
            const dt = rs.map((item) => {
              return {
                stepId: item.stepId,
                stepTitle: item.stepTitle,
                sortNo: item.sortNo
              }
            })
            console.log('dt', dt)
            let datastep = []
            for (let i = 0; i < this.Layout.length; i++) {
              let aa = this.Layout[i]
              if (aa.workData.length > 0) {
                for (let y = 0; y < aa.workData.length; y++) {
                  datastep.push(aa.workData[y].stepId)
                }
              }
            }
            this.stepData = dt.filter(item => !datastep.includes(item.stepId))
          }
        })
    },
    async UpdateworkShop () {
      const dt = this.Layout
      for (let i = 0; i < dt.length; i++) {
        let d = dt[i]
        let dtwork = []
        // console.log('testlength', d.workData.length)
        if (d.workData.length > 0) {
          dtwork = d.workData.map(item => (
            {
              'stepId': item.stepId,
              'sortNo': item.sortNo
            }
          ))
          // console.log('-------------------', JSON.stringify(itemworkData))
        } else {

          // console.log('-------------------', JSON.stringify(itemworkData))
        }
        console.log('dtwork', JSON.stringify(dtwork))
        console.log('d.workData', JSON.stringify(d.workData))
        let workDt = {
          workData: JSON.stringify(dtwork)
        }
        // console.log('update', workDt)
        await axios
          .post(
            this.DNS_IP + '/WorkShopLayout/update/' + d.workShopId, workDt
          )
          .then(
          )
          .catch((error) => {
            console.log('error function addData : ', error)
          })
      }
      // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
    },
    async DeleteColum () {
      this.$swal({
        title: 'ต้องการลบ Colum ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (result) => {
          let Delete = this.Layout.length - 1
          let workShopId = this.Layout[Delete].workShopId
          let LAST_USER = {
            LAST_USER: this.session.data.userName
          }
          if (this.Layout[Delete].workData.length > 0) {
            this.$swal({
              title: 'มีข้อมูลอยู่ใน Colum นี้ ไม่สามารถลบได้',
              type: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#b3b1ab',
              confirmButtonText: 'ใช่',
              cancelButtonText: 'ไม่'
            })
          } else {
            await axios
              .post(
                this.DNS_IP + '/WorkShopLayout/delete/' + workShopId, LAST_USER
              ).then(async (response) => {
                console.log('addDataGlobal DNS_IP + /job/add', response)
                this.getLayout()
                await this.clearData()
              })
              .catch((error) => {
                console.log('error function addData : ', error)
              })
            this.$swal('เรียบร้อย', 'DeleteColum', 'success')
          }
        })
    },
    async AddColum () {
      if (this.Layout.length >= 6) {
        this.$swal({
          title: 'ไม่สามารถเพิ่ม Colum มากกว่า 6 Colum ?',
          type: 'info',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        this.$swal({
          title: 'ต้องการเพิ่ม Colum ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        })
          .then(async (result) => {
            this.fromAdd.CREATE_USER = this.session.data.userName
            this.fromAdd.LAST_USER = this.session.data.userName
            this.fromAdd.workData = '[]'
            this.fromAdd.workColum = this.Layout.length + 1
            this.fromAdd.flowId = this.DataflowId
            this.fromAdd.shopId = this.shopId
            this.fromAdd.masBranchID = this.DataBranchID
            console.log('fromAdd', this.fromAdd)
            await axios
              .post(
                this.DNS_IP + '/WorkShopLayout/add', this.fromAdd
              ).then(async (response) => {
                console.log('addDataGlobal DNS_IP + /job/add', response)
                this.dialogAdd = false
                this.getLayout()
                await this.clearData()
              })
              .catch((error) => {
                console.log('error function addData : ', error)
              })
          })
      }
    },
    clearData () {
      this.fromAdd = {}
    }
  }
}

</script>
<style scope>
/* width */
::-webkit-scrollbar {
  width: 2px;
  height: 5px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #173053;
  border-radius: 0px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #173053;
}
.main{
  margin-top: 1rem;
  background-color: #E1F3FF;
  height: 800px;
  max-height: max-content;
}
.Layoutcolum{
  margin-top: 2px;
  margin-left: 5px;
  min-height: 600px !important;
  width: 200px !important;
  border-color: #ffffff ;
  background-color: #f0eeee ;
  display:flex;
}
.layout{
  flex-wrap: wrap;
  display: flex;
}
.stepLayout{
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding-left: 1rem;
  width: 100%;
}
.workLayout{
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding-left: 1rem;
  width: max-content;
}
body{
  overflow:auto;
  white-space: normal;
}
.rowIncolum{
  margin-top: 10px;
  margin-left: 1px;
  padding: 20px 20px 20px 20px;
  height: 100px !important;
  width: 220px !important;
  border-style: groove;
  border-color: #000002;
  background-color: #FFFFFF ;
  display:flex;
}
.rowStepworkshop{
  background-color: rgb(92, 90, 90);
  min-width: 100px !important;
}
</style>
