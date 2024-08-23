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
            <v-btn color="primary" depressed @click="dialogAdd = true">
              <v-icon left>mdi-text-box-plus</v-icon>
              เพิ่มข้อมูล
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-dialog
          v-model="dialogAdd"
          persistent
          width="40%"
        >
          <v-card class="pa-3" style="overflow-x: hidden;">
            <v-container>
            <v-row>
                <v-col cols="10" class="text-left pt-10">
                <h3><strong>เพิ่ม Tag</strong></h3>
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
                    @click="dialogAdd = false , formAdd.tagName = ''"
                    >
                    X
                    </v-btn>
                </div>
                </v-col>
            </v-row>
            <v-row>
              <v-col class="pb-0" cols="12">
                <!-- <p>{{itemBranch}}</p> -->
                <v-text-field
                  v-model="formAdd.tagName"
                  dense
                  label="กรอกข้อมูล Tag"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="#173053"
                  block
                  large
                  dark
                  @click="AddData()"
                >
                  บันทึก
                </v-btn>
              </v-col>
            </v-row>
            </v-container>
          </v-card>
        </v-dialog>
          <v-dialog
          v-model="dialog"
          persistent
          width="40%"
        >
          <v-card class="pa-3" style="overflow-x: hidden;">
            <v-container>
            <v-row>
                <v-col cols="10" class="text-left pt-10">
                <h3><strong>แก้ไข Tag</strong></h3>
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
            <v-row>
              <v-col class="pb-0" cols="12">
                <!-- <p>{{itemBranch}}</p> -->
                <v-text-field
                  dense
                  v-model="formUpdate.tagName"
                  label="กรอกข้อมูล Tag"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn
                  class="ma-2" color="#173053" dense dark block large
                  @click="editData()"
                >
                  บันทึก
                </v-btn>
              </v-col>
            </v-row>
            </v-container>
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
              :items="itemTag"
              :search="search"
            >
            <!-- <template v-slot:[`item.tagName`]="{ item }">
              <v-chip
                  class="ma-2 pa-6"
                  color="cyan"
                  label
                  dense
                  text-color="white"
                >
                  <v-icon left>
                    mdi-tag
                  </v-icon>
                  {{item.tagName}}
                </v-chip>
            </template> -->
            <template v-slot:[`item.CREATE_DATE`]="{ item }">
              {{ format_dateFUllTime(item.CREATE_DATE) }}
            </template>
            <template v-slot:[`item.LAST_DATE`]="{ item }">
              {{ format_dateFUllTime(item.LAST_DATE) }}
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-btn
                color="#173053"
                fab
                small
                dark
                @click="setEdit(item) , dialog=true"
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
// import moment from 'moment-timezone'

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
          text: 'จัดการ Tag',
          disabled: false,
          href: '/Master/SettingTag'
        }
      ],
      dialog: false,
      dialogAdd: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      search: '',
      headers: [
        { text: 'ID', value: 'tagId' },
        { text: 'ชื่อ', value: 'tagName' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
        { text: 'จัดการข้อมูล', value: 'action', sortable: false, align: 'center' }
      ],
      formAdd: {
        tagName: '',
        CREATE_USER: this.$session.getAll().data.USER_ROLE,
        LAST_USER: this.$session.getAll().data.USER_ROLE,
        shopId: this.$session.getAll().data.shopId
      },
      formUpdate: {
        tagId: '',
        tagName: '',
        LAST_USER: this.$session.getAll().data.USER_ROLE
      },
      itemTag: []
    }
  },
  async mounted () {
    this.getMasTag()
  },
  methods: {
    async getMasTag () {
      this.itemTag = []
      await axios
        .get(this.DNS_IP + '/Mas_Tag/get?shopId=' + this.shopId).then((response) => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            this.itemTag = rs
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
        }).catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    async AddData () {
      console.log('add', this.formAdd)
      await axios
        .get(this.DNS_IP + '/Mas_Tag/get?shopId=' + this.shopId + '&tagName=' + this.formAdd.tagName).then((response) => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.status === false) {
            this.$swal({
              title: 'ต้องการ เพิ่มข้อมูล ใช่หรือไม่?',
              type: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#b3b1ab',
              confirmButtonText: 'ใช่',
              cancelButtonText: 'ไม่'
            }).then(async () => {
              await axios
                .post(this.DNS_IP + '/Mas_Tag/add', this.formAdd)
                .then(async (response) => {
                  this.$swal('บันทึกข้อมูลเรียบร้อย', ' ', 'success')
                  this.dialogAdd = false
                  this.getMasTag()
                  this.formAdd.tagName = ''
                })
              // eslint-disable-next-line handle-callback-err
                .catch((error) => {
                  console.log('error function addData : ', error)
                })
            })
          } else {
            this.$swal('มีข้อมูลอยู่แล้ว', ' ', 'error')
          }
        }).catch((error) => {
          console.log('error function addData : ', error)
        })

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
          .post(this.DNS_IP + '/Mas_Tag/delete/' + item.tagId, item)
          .then(async (response) => {
            this.$swal('ลบข้อมูลเรียบร้อย', ' ', 'success')
            await this.getMasTag()
          })
        // eslint-disable-next-line handle-callback-err
          .catch((error) => {
            console.log('error function addData : ', error)
          })
      })
    },
    setEdit (item) {
      console.log('item', item)
      this.formUpdate.tagName = item.tagName
      this.formUpdate.tagId = item.tagId
    },
    async editData () {
      console.log('this.formUpdate', this.formUpdate)
      this.$swal({
        title: 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async () => {
        await axios.post(this.DNS_IP + '/Mas_Tag/edit/' + this.formUpdate.tagId, this.formUpdate).then(async response => {
          this.$swal('แก้ไขเรียบร้อย', ' ', 'success')
          await this.getMasTag()
          this.dialog = false
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
