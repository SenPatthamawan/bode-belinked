<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
        </v-row>
        <v-row>
          <v-dialog
      v-model="dialog"
      persistent
      max-width="600"
    >
      <v-card class="pa-10" min-height="700">
        <div class="text-center">
          <h3>เลือกบริการที่จะรับการแจ้งเตือน</h3>
        </div>
        <v-row class="pa-16">
          <v-col class="pa-0" cols="12">
            <!-- <p>{{itemBranch}}</p> -->
            <v-select
              v-model="itemBranch"
              :items="BranchItem"
              :menu-props="{ maxHeight: '400' }"
              label="เลือกสาขาที่ต้องการรับการแจ้งเตือน"
              dense
              outlined
              multiple
              persistent-hint
              class="ma-3"
            ></v-select>
          </v-col>
          <v-col class="pa-0" cols="6" md='6'>
            <v-container fluid>
              <p class="text-center">ประเภทบริการ</p>
              <div v-for="(item , index) in itemSelect" :key="index">
                <v-checkbox
                v-model="item.checkitem"
                :label="item.text"
              ></v-checkbox>
              </div>
            </v-container>
          </v-col>
          <v-col class="pa-0" cols="6" md='6'>
            <v-container fluid>
                <p class="text-center">การนัดหมายเข้ารับบริการ</p>
                <v-checkbox
                v-model="BookingSend"
                label="Booking"
              ></v-checkbox>
            </v-container>
          </v-col>
        </v-row>
        <div class="text-center">
          <v-btn
            small class="ma-2" color="#173053" dark
            @click="AddData()"
          >
            บันทึก
          </v-btn>
          <v-btn
            small class="ma-2" color="#173053" outlined dark
            @click="dialog = false"
          >
            Close
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
            <template v-slot:[`item.Img`]="{ item }">
              <v-avatar>
                <img
                  :src="item.Img"
                >
              </v-avatar>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-btn
                color="#173053"
                fab
                small
                dark
                @click="getLineData(item) , dialog=true"
              >
                <v-icon > mdi-wrench </v-icon>
              </v-btn>
              <v-btn
                color="red"
                fab
                small
                dark
                @click="DeleteGroup(item)"
              >
                <v-icon > mdi-delete </v-icon>
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

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
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
          text: 'จัดการLineGroup',
          disabled: false,
          href: '/Master/SettingLineGroup'
        }
      ],
      dialog: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      search: '',
      headers: [
        { text: 'ID', value: 'Id' },
        { text: 'GroupID', value: 'GroupId' },
        { text: 'GroupName', value: 'GroupName' },
        { text: 'รูปกลุ่ม', value: 'Img' },
        { text: 'จัดการข้อมูล', value: 'action', sortable: false, align: 'center' }

      ],
      LineGroupitem: [],
      itemSelect: [],
      Flowitem: [],
      BranchItem: [],
      itemBranch: [],
      BookingSend: false,
      GroupId: '',
      flowData: []
    }
  },
  async mounted () {
    this.getLineGroup()
    this.getDataBranch()
    this.getFLow()
  },
  methods: {
    async getLineGroup () {
      this.LineGroupitem = []
      await axios
        .get(this.DNS_IP + '/LineGroupShopId/get?shopId=' + this.shopId).then((response) => {
          let rs = response.data
          // console.log('rs', rs)
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.Id = d.Id
              s.GroupId = d.GroupId
              s.GroupName = d.LineGroupName
              s.Img = d.GroupImg
              this.LineGroupitem.push(s)
            }

            // console.log('this', this.LineGroupitem)
          }
        }).catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    async getLineData (item) {
      this.itemSelect = []
      this.GroupId = item.GroupId
      let GroupId = item.GroupId
      await axios
        .get(this.DNS_IP + '/LineGroupFlow/get?shopId=' + this.shopId + '&GroupId=' + GroupId).then((response) => {
          let rs = response.data
          this.itemBranch = []
          let dataitem = []
          // console.log('rs1', rs)
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (d.flowCode === '' || d.flowCode === null) {
              } else {
                let flowitem = this.flowData.filter(item => { return item.flowCode === d.flowCode })
                // console.log('flowitem', flowitem)
                if (flowitem.length > 0) {
                  let s = {}
                  s.Id = d.Id
                  s.flowCode = d.flowCode
                  s.text = flowitem[0].flowName
                  s.value = flowitem[0].flowId
                  s.checkitem = true
                  this.itemSelect.push(s)
                  dataitem.push(s)
                }
              }
            }
            // this.getFLow(dataitem)
            if (rs[0].BookingSend === 'N') {
              this.BookingSend = true
            }
            if (rs[0].masBranchID === null) {
              // console.log('rs[1]', rs[0].masBranchID)
            } else {
              // this.itemBranch = JSON.parse(rs[0].masBranchID)
              JSON.parse(rs[0].masBranchID).forEach((v, k) => {
                this.itemBranch.push(v.masBranchID)
              })
              // console.log('this.itemBranch', this.itemBranch)
            }
            let datatest = []
            for (let a = 0; a < this.flowData.length; a++) {
              let d = this.flowData[a]
              let dt = dataitem.filter(item => { return item.flowCode === d.flowCode })
              if (dt.length === 0) {
                let s = {}
                s.Id = d.flowId
                s.flowCode = d.flowCode
                s.text = d.flowName
                s.value = d.flowId
                s.checkitem = false
                datatest.push(s)
              }
            }
            datatest.forEach((v, k) => {
              this.itemSelect.push(v)
            })
          } else {
            // this.getFLow(dataitem)
            for (let i = 0; i < this.flowData.length; i++) {
              let d = this.flowData[i]
              let s = {}
              s.Id = d.flowId
              s.flowCode = d.flowCode
              s.text = d.flowName
              s.value = d.flowId
              s.checkitem = false
              this.itemSelect.push(s)
            }
          }
        }).catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    async getFLow () {
      await axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then((response) => {
          let rs = response.data
          // console.log('rs2', rs)
          if (rs.length > 0) {
            this.flowData = rs
          }
        }).catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    async getDataBranch () {
      this.BranchItem = []
      await axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(async (response) => {
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
        .catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    async AddData () {
      let BranchJSON = []
      // console.log('itemBrtanch', this.itemBranch)
      for (let i = 0; i < this.itemBranch.length; i++) {
        let d = this.itemBranch[i]
        let s = {}
        s.masBranchID = d
        BranchJSON.push(s)
      }
      let checkitemSelect = []
      this.itemSelect.forEach(v => {
        if (v.checkitem === true) {
          checkitemSelect.push(v.checkitem)
        }
      })
      let dataAdd = {}
      if (checkitemSelect.length > 0) {
        dataAdd = {
          flow: this.itemSelect,
          masBranchID: JSON.stringify(BranchJSON),
          Booking: this.BookingSend,
          shopId: this.shopId,
          GroupId: this.GroupId
        }
      } else {
        dataAdd = {
          flow: null,
          masBranchID: JSON.stringify(BranchJSON),
          Booking: this.BookingSend,
          shopId: this.shopId,
          GroupId: this.GroupId
        }
      }
      if (this.BookingSend === false && checkitemSelect.length === 0) {
        this.$swal('ผิดพลาด', 'กรุณาเลือกรายการแจ้งเตือน', 'error')
      } else {
        await axios
          .post(this.DNS_IP + '/LineGroupFlow/AdminEdit', dataAdd)
          .then(async (response) => {
            this.$swal('บันทึกข้อมูลเรียบร้อย', ' ', 'success')
            this.dialog = false
            this.getLineGroup()
            this.getDataBranch()
            this.getFLow()
          })
        // eslint-disable-next-line handle-callback-err
          .catch((error) => {
            console.log('error function addData : ', error)
          })
      }
      // console.log('dataAdd', dataAdd)
    },
    async DeleteGroup (item) {
      console.log('item', item)
      item.shopId = this.shopId
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
          .post(this.DNS_IP + '/LineGroupFlow/deleteGroup/' + item.Id, item)
          .then(async (response) => {
            this.$swal('ลบข้อมูลเรียบร้อย', ' ', 'success')
            this.getLineGroup()
            this.getDataBranch()
            this.getFLow()
          })
        // eslint-disable-next-line handle-callback-err
          .catch((error) => {
            console.log('error function addData : ', error)
          })
      })
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
  Width: 255px;
  Height: 52px;
  font-size: 10px !important;
}
#subtext {
  color: #173053;
  font-size: 30px !important;
  font-weight: bold;
}
</style>
