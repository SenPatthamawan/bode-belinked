<template>
  <div class="example">
    <v-main>
      <v-dialog
        v-model="dialogHistoryCall"
        max-width="40%"
        persistent
        style="background: #FFFFFF;box-shadow: 0px 1px 28px rgba(0, 0, 0, 0.12);border-radius: 14px;"
      >
        <v-card>
          <v-container>
            <v-row
              style="padding-left: 5%; padding-right: 0.5%; padding-top: 2%;"
            >
              <v-col cols="10" class="text-left">
                <h3><strong>สรุปการเข้ารับบริการ</strong></h3>
              </v-col>
              <v-col cols="2">
                <div style="text-align: end;">
                  <v-btn
                    class="button5"
                    @click="(dialogHistoryCall = false), clear()"
                  >
                    <v-icon large color="#F1F1F1 ">
                      mdi-close
                    </v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-form ref="form_add" v-model="valid_add" lazy-validation>
                  <v-card
                    style="margin-bottom: 4%;background: #FFFFFF;box-shadow: 1.5px 2.6px 10px rgba(119, 119, 119, 0.1);"
                    class="mx-auto"
                  >
                    <v-container>
                      <!-- {{ formAdd.serviceListId }} -->
                      <v-row>
                        <v-col
                          cols="6"
                          v-for="(value, key, index) in serviceType"
                          :key="index"
                        >
                          <v-checkbox
                            v-model="formAdd.serviceListId"
                            :label="`${value.text.toString()}`"
                            :value="`${value.values}`"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                  <v-row>
                    <v-col class="text-center">
                      <v-btn
                        large
                        block
                        dark
                        color="#14AE5C"
                        @click="validate(), addData()"
                        ><strong>บันทึก</strong></v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios'
import VuetifyLogo from '../logo'
import moment from 'moment' // แปลง date
export default {
  components: {
    VuetifyLogo,
    moment
  },
  data () {
    return {
      path: '/BookingService/',
      session: this.$session.getAll(),
      formAdd: {
        bookNo: '',
        serviceListId: [],
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      },
      valid_add: true,
      serviceType: [],
      dialogHistoryCall: false
    }
  },
  // eslint-disable-next-line space-before-function-paren
  async mounted() {
    // this.getServiceType()
  },
  methods: {
    async setData (item) {
      console.log('bookNo', item.bookNo)
      this.formAdd.bookNo = item.bookNo
      await this.getServiceType()
      this.getData()
      this.dialogHistoryCall = true
    },
    validate (Action) {
      switch (Action) {
        case 'ADD':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_add.validate()
          })
          break
        case 'UPDATE':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_update.validate()
          })
          break

        default:
          break
      }
    },
    reset () {
      this.$refs.form_add.reset()
    },
    getData () {
      axios
        .get(
          this.DNS_IP +
            this.path +
            'get?shopId=' +
            this.$session.getAll().data.shopId +
            '&bookNo=' +
            this.formAdd.bookNo
        )
        .then(res => {
          let rs = res.data
          console.log(rs)
          if (rs.status === false) {
            this.formAdd.serviceListId = []
          } else {
            let arr = []
            rs.map(el => {
              arr.push(el.serviceListId)
            })
            this.formAdd.serviceListId = [...new Set(arr)]
          }
        })
    },
    addData () {
      console.log('formAdd', this.formAdd)
      this.$swal({
        title: 'ต้องการ เพิ่มข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async result => {
        console.log(this.formAdd)
        await axios
          .post(
            // eslint-disable-next-line quotes
            this.DNS_IP + this.path + 'add',
            this.formAdd
          )
          .then(async response => {
            console.log('addDataGlobal DNS_IP + PATH + "add"', response)
            this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
            this.clear()
            this.dialogHistoryCall = false
            // this.getData()
          })
          .catch(error => {
            console.log('error function addDataGlobal : ', error)
            this.$swal('ผิดพลาด', 'กรุณาทำรายการอีกครั้ง', 'success')
            this.dataReady = true
          })
      })
    },
    async getServiceType () {
      this.serviceType = []
      await axios
        .get(
          this.DNS_IP +
            '/serviceList/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&RECORD_STATUS=N'
        )
        .then(res => {
          let rs = res.data
          if (rs.status === false) {
            this.serviceType = []
          } else {
            rs.map(el => {
              var s = {}
              s.servicePrice = el.servicePrice || ''
              s.text = s.servicePrice === '' ? el.serviceName : el.serviceName + ' : ' + s.servicePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' บาท'
              s.values = el.id
              this.serviceType.push(s)
            })
          }
        })
    },
    clear () {
      this.formAdd.bookingNo = ''
      this.formAdd.serviceListId = []
      this.formAdd.shopId = this.$session.getAll().data.shopId
      this.formAdd.CREATE_USER = this.$session.getAll().data.userName
      this.formAdd.LAST_USER = this.$session.getAll().data.userName
    }
  }
}
</script>
<style scoped>
.button5 {
  background-color: #dadada !important;
  border: none;
  /* padding: 20px !important; */
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 1px 2px;
  cursor: pointer;
  height: 60% !important;
  width: 36px !important;
  border-radius: 50%;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 36px;
  min-width: 40px;
  padding: 0 16px;
}
h1 {
  font-style: normal;
  font-weight: 700;
  font-size: 34px !important;
  line-height: 51px;
  color: #202020;
}
h2 {
  font-style: normal;
  font-weight: 700;
  font-size: 30px !important;
  line-height: 24px;
  color: #ffffff;
}
h4 {
  font-style: normal;
  font-weight: 500;
  font-size: 22px !important;
  line-height: 30px;
  color: #161616;
}
.subheader {
  font-weight: 400;
  font-size: 20px;
  line-height: 54px;
  display: flex;
  align-items: center;
  color: #464a53;
  padding-top: 20px;
}
v-data-table-header {
  background-color: #ffffff !important;
}
.v-dialog {
  /* overflow-y: hidden !important; */
  overflow-x: hidden !important;
}
.v-application a {
  /* position: absolute; */
  color: #464255 !important;
}
.v-tabs-slider {
  height: 0%;
  width: 100%;
  background-color: #bde3ff !important;
}
.v-tab--active {
  color: inherit;
  background-color: #bde3ff !important;
}
.v-tab:before,
.v-tabs-slider {
  background-color: #bde3ff !important;
}
a.v-tab {
  text-decoration: none;
}
</style>

<!-- <script>
import axios from 'axios'
import VuetifyLogo from '../logo'
import moment from 'moment' // แปลง date
export default {
  components: {
    VuetifyLogo,
    moment
  },
  beforeCreate () {
    this.$liff.init({ liffId: this.$liff_id_login }, function (data) {})
  },
  data () {
    return {
      path: '/BookingService/',
      returnLink: '/System/NotificationService',
      session: this.$session.getAll(),
      formAdd: {
        bookNo: '',
        serviceListId: [],
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: '',
        LAST_USER: ''
      },
      valid_add: true,
      dialogHistoryCall: false,
      serviceType: []
    }
  },
  // eslint-disable-next-line space-before-function-paren
  async mounted() {
    //   NotiSer
    this.getServiceType()
  },
  methods: {
    getServiceType () {
      this.serviceType = []
      axios
        .get(this.DNS_IP + '/serviceList/get?shopId=' + this.$session.getAll().data.shopId)
        .then(res => {
          let rs = res.data
          rs.map(el => {
            var s = {}
            s.text = el.serviceName
            s.values = el.id
            this.serviceType.push(s)
          })
          console.log('serviceType', this.serviceType)
        })
    },
    validate (Action) {
      switch (Action) {
        case 'ADD':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_add.validate()
          })
          break
        case 'UPDATE':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_update.validate()
          })
          break

        default:
          break
      }
    },
    addData () {
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
          this.formAdd.CREATE_USER = this.session.data.userName
          this.formAdd.LAST_USER = this.session.data.userName
          await axios
            .post(
              this.DNS_IP + '/BookingService/add',
              this.formAdd
            )
            .then(async response => {
              console.log('addDataGlobal DNS_IP + PATH + "add"', response)
              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
            })
            .catch(error => {
              console.log('error function addDataGlobal : ', error)
              this.$router.push(
                '/system/Errorpage?returnLink=' + this.returnLink
              )
              this.dataReady = true
            })
        })
    },
    clearData () {
      this.checkbox = []
    }
  }
}
</script>
  <style scoped>
    .button5 {
background-color: #DADADA !important;
  border: none;
  /* padding: 20px !important; */
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 1px 2px;
  cursor: pointer;
  height: 60% !important;
  width: 36px !important;
  border-radius: 50%;
}
.v-btn:not(.v-btn--round).v-size--default {
    height: 36px;
    min-width: 40px;
    padding: 0 16px;
}
h1 {
    font-style: normal;
    font-weight: 700;
    font-size: 34px !important;
    line-height: 51px;
    color: #202020;
}
h2 {
    font-style: normal;
    font-weight: 700;
    font-size: 30px !important;
    line-height: 24px;
    color: #FFFFFF;

}
h4 {
    font-style: normal;
    font-weight: 500;
    font-size: 22px !important;
    line-height: 30px;
    color: #161616;

}
.subheader {
    font-weight: 400;
    font-size: 20px;
    line-height: 54px;
    display: flex;
    align-items: center;
    color: #464A53;
    padding-top: 20px;
}
v-data-table-header {
  background-color: #FFFFFF !important;
}
.v-dialog {
    overflow-y: hidden !important;
    overflow-x: hidden !important;
}
.v-application a {
    /* position: absolute; */
    color:#464255 !important;
}
.v-tabs-slider {
    height: 0%;
    width: 100%;
    background-color: #BDE3FF !important;
}
.v-tab--active {
    color: inherit;
    background-color: #BDE3FF !important;
}
.v-tab:before, .v-tabs-slider {
    background-color: #BDE3FF !important;
}
a.v-tab {
    text-decoration: none;
}
  </style> -->
