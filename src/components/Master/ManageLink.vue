<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left">
            <!-- <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs> -->
          </v-col>
          <v-col cols="6" class="v-margit_button text-right">
          </v-col>
        </v-row>
        <h3 class="text-left ml-4 mb-16 font-weight-bold">ลิ้งค์สำหรับส่งให้ลูกค้า / Admin</h3>
        <v-row>
          <v-col>
            <v-sheet class="pa-3 pl-6 pb-6 mb-6" elevation="4" v-if="!setTimeError">
              <h3 class="text-center ml-4 mb-6 mt-10 font-weight-bold">
                <v-icon x-large>mdi-alert-decagram</v-icon>
                 กรุณาตรวจสอบการตั้งค่าประเภทบริการและเวลาของพนักงาน
                </h3>
                <div v-for="(flowitem, f) in this.flowTime" :key="f">
                  <div v-if="flowitem.setTimeError === false">
                    <h4 class="mb-1 mt-1">
                      <v-icon class="mb-1" color="red">mdi-alert-octagon</v-icon>
                      {{ flowitem.flowName}}
                    </h4>
                    <div class="pl-6" v-for="(item,i) in flowitem.empTime" :key="i">
                     <div>
                        <div v-if="!item.statusEmp">
                          <h6 class="mb-1 mt-1">
                            <v-icon class="mb-1" color="blue">mdi-account-alert</v-icon>
                            {{ item.empFull_NameTH}}
                          </h6>
                          <div v-for="(item2,i2) in item.Duplicates" :key="i2">
                            <p class="mb-0 ml-9">{{ `ใช้เวลา Slot ละ ${item2} นาที` }}</p>
                          </div>
                        </div>
                        <div v-else>
                          <h6 class="mb-1 mt-1">
                            <v-icon class="mb-1" color="blue">mdi-account-alert</v-icon>
                            {{ item.empFull_NameTH }}
                          </h6>
                          <p class="mb-0 ml-9">{{ `ใช้เวลา Slot ละ ${item.Duplicates[0]} นาที` }}</p>
                        </div>
                     </div>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <v-btn class="text-center mt-3" color="red" dark @click="gotosetting()">
                  <v-icon>mdi-clock-time-three</v-icon>
                  ตั้งค่าเวลาพนักงาน
                </v-btn>
                </div>
            </v-sheet>
            <v-sheet min-height="650px" >
              <h3 class="text-left ml-4 mb-10 font-weight-bold"> QR CODE สำหรับสแกน</h3>
              <div class="ml-1">
                <v-card class="pa-2 ma-4">
                  <h3 class="text-center mt-5" v-if="value !== ''">{{linkItem.filter((v) => v.text === value)[0].title}}</h3>
                  <div class="text-center ma-7 mt-3" ref="printMe" v-if="value !== ''">
                   <v-sheet class="py-6">
                      <qrcode-vue :value="value" :size="size" level="H" :foreground="foreground" />
                   </v-sheet>
                </div>
                <div class="text-center ma-7" v-else>
                  <v-icon color="#000000" style="font-size:200px;">
                    mdi-select-search
                  </v-icon>
                </div>
                <!-- <div class="text-center mt-n2 mb-5" v-if="value !== ''">
                  <v-btn
                    class="mx-2"
                    dark
                    rounded
                    x-large
                    color="#173053"
                    @click="downloadQR()"
                  >
                    <v-icon dark x-large>
                      mdi-cloud-download
                    </v-icon>
                  </v-btn>
                </div> -->
                </v-card>
                <!-- <h6>ระบุ URL ที่ต้องการสร้างคิวอาร์โค๊ด</h6> -->
                <v-row>
                  <v-col cols="12" v-if="qrValue !== '' && qrValue !== null">
                    <v-text-field
                    v-model="qrValue"
                    label="URL"
                    outlined
                    prepend-inner-icon="mdi-paperclip"
                    disabled
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-btn
                  v-if="qrValue !== '' && qrValue !== null"
                  block
                  color="#2BC155"
                  dark
                  rounded
                  large
                  @click="downloadQR()"
                >Download QR CODE
                <v-icon class="ml-3" dark x-large>
                      mdi-cloud-download
                    </v-icon>
                    </v-btn>
              </div>
            </v-sheet>
          </v-col>
          <v-col >
            <v-sheet min-height="650px">
              <h3 class="text-left ml-4 mb-10 font-weight-bold">ลิ้งค์สำหรับลูกค้า</h3>
              <div class="ml-10" >
                <!-- <h6 v-if="item.type === 'customer'">{{item.title}}</h6> -->
                <v-row v-for="(item1,i) in linkItem" :key="i">
                  <v-col cols="12" class="pa-0" v-if="item1.type === 'customer'">
                    <v-text-field
                    class=""
                    solo
                    v-model="item1.title"
                    readonly
                    >
                    <template v-slot:append-outer>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                          class="mx-2 mt-n2 ml-n1"
                          dark
                          fab
                          small
                          v-bind="attrs"
                          v-on="on"
                          color="#2BC155"
                          @click="coppyLink(item1.text, item1)"
                        >
                          <v-icon dark>
                            mdi-content-copy
                          </v-icon>
                        </v-btn>
                        </template>
                        <span>Coppy Link / สร้าง QR CODE</span>
                      </v-tooltip>
                    </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </div>
              <h3 class="text-left ml-4 mb-10 mt-5 font-weight-bold">ลิ้งค์สำหรับ Admin</h3>
              <div class="ml-10" >
                <v-row v-for="(item2,y) in linkItem" :key="y" >
                  <v-col cols="12" class="pa-0" v-if="item2.type === 'admin'">
                    <v-text-field
                    class=""
                    solo
                    v-model="item2.title"
                    readonly
                    >
                    <template v-slot:append-outer>
                     <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                          class="mx-2 mt-n2 ml-n1"
                          dark
                          fab
                          small
                          v-bind="attrs"
                          v-on="on"
                          color="#2BC155"
                          @click="coppyLink(item2.text, item2)"
                        >
                          <v-icon dark>
                            mdi-content-copy
                          </v-icon>
                        </v-btn>
                        </template>
                        <span>Coppy Link / สร้าง QR CODE</span>
                      </v-tooltip>
                    </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-sheet>
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
import QrcodeVue from 'qrcode.vue'
// import moment from 'moment-timezone'

import Vue from 'vue'
import VueHtml2Canvas from 'vue-html2canvas'
Vue.use(VueHtml2Canvas)

export default {
  components: {
    QrcodeVue,
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
          text: 'จัดการ การแจ้งเตือน LineGroup',
          disabled: false,
          href: '/Master/SettingLineNotify'
        }
      ],
      shopId: this.$session.getAll().data.shopId,
      linkItem: [],
      Alerts: false,
      output: null,
      value: '',
      size: 200,
      foreground: '#000000',
      qrValue: null,
      dataLineConfig: {},
      shopData: [],
      flowTime: [],
      empTime: [],
      setTimeError: true
    }
  },
  async mounted () {
    this.dataLineConfig = await this.getDataLineConfig(this.$session.getAll().data.shopId)
    await this.getShop()
    await this.setLinkItem()
  },
  methods: {
    async downloadQR () {
      await this.print()
      await axios({
        url: this.output,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        let fileUrl = window.URL.createObjectURL(new Blob([response.data]))
        let fileLink = document.createElement('a')
        fileLink.href = fileUrl
        let fieldName = this.linkItem.filter((v) => v.text === this.value)[0].title
        fileLink.setAttribute('download', 'QR CODE ' + fieldName + '.jpg')
        document.body.appendChild(fileLink)

        fileLink.click()
      })
    },
    async genQrCode (link) {
      this.qrValue = link
      this.value = link
    },
    async print () {
      const el = this.$refs.printMe
      // add option type to get the image version
      // if not provided the promise will return
      // the canvas.
      const options = {
        type: 'dataURL'
      }
      this.output = await this.$html2canvas(el, options)
      console.log('this.output', this.output)
    },
    async getShop () {
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          this.shopData = rs
          console.log('rssssssssssss', rs)
        })
    },
    gotosetting () {
      this.$router.push('/Master/Employee')
    },
    async coppyTrue (item) {
      this.$swal({
        title: 'Copy successfully',
        text: 'คัดลอกลิ้งสำเร็จ',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      await navigator.clipboard.writeText(item)
      // setTimeout(() => {
      //   this.Alerts = false
      // }, 4000)
      await this.genQrCode(item)
    },
    async coppyFalse (item) {
      this.$swal({
        title: 'กรุณาตรวจสอบบริการที่ไม่สามารถใช้งานได้',
        text: 'คัดลอกลิ้งสำเร็จ',
        type: 'info',
        timer: 5000,
        showConfirmButton: false
      })
      await navigator.clipboard.writeText(item)
      // setTimeout(() => {
      //   this.Alerts = false
      // }, 4000)
      await this.genQrCode(item)
    },
    async coppyLink (item, itemAll) {
      this.qrValue = ''
      this.value = ''
      // this.statusAll = true
      // this.statusEmp = true
      this.setTimeError = true
      if (itemAll.typeName === 'CalendarBookingAutoEmp') {
        console.log('item', itemAll)
        await this.getFlowCheck()
        if (this.flowTime.length > 0) {
          await this.getEmp()
          await this.checkSlot()
          if (this.setTimeError === false) {
            this.coppyFalse(item)
          } else {
            this.coppyTrue(item)
          }
        } else {
          this.coppyTrue(item)
        }
      } else {
        this.coppyTrue(item)
      }
    },
    async getFlowCheck () {
      this.flowTime = []
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(async (response) => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.customerTimeSlot === 'True') {
              this.flowTime.push(d)
            }
          }
        }
      })
      // console.log('this.flowTime', this.flowTime)
    },
    async setLinkItem () {
      this.linkItem = []
      console.log('this.$session.getAll().data.timeSlotStatus', this.$session.getAll().data)
      if (this.$session.getAll().data.timeSlotStatus === 'True') {
        let itemLink = [
          {
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/CalendarBookingEmp?shopId=' + this.shopId,
            'title': 'ตรวจสอบคิวว่างก่อนนัดหมาย',
            'type': 'customer'
          },
          {
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/CalendarBookingAutoEmp?shopId=' + this.shopId,
            'title': 'ตรวจสอบคิวว่างก่อนนัดหมาย (ลูกค้าไม่ระบุช่าง)',
            'type': 'customer',
            'typeName': 'CalendarBookingAutoEmp'
          },
          {
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/BookingFormAutoEmp?shopId=' + this.shopId + '&source=line',
            'title': 'หน้ากรอกข้อมูลแบบฟอร์ม (ลูกค้าไม่ระบุช่าง)',
            'type': 'customer',
            'typeName': 'BookingFormAutoEmp'
          },
          {
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/PaymentUpload?shopId=' + this.shopId,
            'title': 'อัพโหลดสลิปมัดจำ ( ย้อนหลัง )',
            'type': 'customer'
          },
          {
            'text': 'https://betask-linked-admin.web.app/CheckBookingEmpList?shopId=' + this.shopId,
            'title': 'ตรวจสอบรายการนัดหมาย ( มือถือ / แทปเล็ต )',
            'type': 'admin'
          },
          {
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/BookingHistory?shopId=' + this.shopId,
            'title': 'ตรวจสอบรายการนัดหมาย',
            'type': 'customer'
          },
          // {
          //   'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/CheckBookingNext?shopId=' + this.shopId,
          //   'title': 'ลูกค้านัดหมาย',
          //   'type': 'customer'
          // },
          {
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/stampFirstStep?shopId=' + this.shopId,
            'title': 'ลูกค้าตรวจสอบและเข้ารับบริการ',
            'type': 'customer'
          },
          {
            'text': 'https://belinked-redirect-url-facebook.web.app/?liffId=' + this.dataLineConfig.liffBookingFormEmpID + '&shopId=' + this.shopId + '&source=facebook',
            'title': 'ลิ้งค์สำหรับนัดหมายผ่าน Facebook หรือ Messenger',
            'type': 'customer'
          }
        ]
        this.linkItem = itemLink
        if (this.shopData[0].statusCustomerEdit === 'True') {
          this.linkItem.push({
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/EditBooking?shopId=' + this.shopId,
            'title': 'ลูกค้าเลื่อนนัด',
            'type': 'customer'
          })
        }
      } else {
        let itemLink = [
          {
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/CalendarBooking?shopId=' + this.shopId,
            'title': 'ตรวจสอบคิวว่างก่อนนัดหมาย',
            'type': 'customer'
          },
          {
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/PaymentUpload?shopId=' + this.shopId,
            'title': 'อัพโหลดสลิปมัดจำ ( ย้อนหลัง )',
            'type': 'customer'
          },
          {
            'text': 'https://betask-linked-admin.web.app/CheckBookingList?shopId=' + this.shopId,
            'title': 'ตรวจสอบรายการนัดหมาย ( มือถือ / แทปเล็ต )',
            'type': 'admin'
          },
          {
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/BookingHistory?shopId=' + this.shopId,
            'title': 'ตรวจสอบรายการนัดหมาย ',
            'type': 'customer'
          },
          // {
          //   'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/CheckBookingNext?shopId=' + this.shopId,
          //   'title': 'ลูกค้าตรวจสอบและเข้ารับบริการ',
          //   'type': 'customer'
          // },
          {
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/stampFirstStep?shopId=' + this.shopId,
            'title': 'ลูกค้าตรวจสอบและเข้ารับบริการ',
            'type': 'customer'
          },
          {
            'text': 'https://belinked-redirect-url-facebook.web.app/?liffId=' + this.dataLineConfig.liffBookingFormID + '&shopId=' + this.shopId + '&source=facebook',
            'title': 'ลิ้งค์สำหรับนัดหมายผ่าน Facebook หรือ Messenger',
            'type': 'customer'
          }
        ]
        this.linkItem = itemLink
        if (this.shopData[0].statusCustomerEdit === 'True') {
          this.linkItem.push({
            'text': 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/EditBooking?shopId=' + this.shopId,
            'title': 'ลูกค้าเลื่อนนัด',
            'type': 'customer'
          })
        }
      }
      console.log('test', this.linkItem)
    },
    async checkSlot () {
      if (this.flowTime.length > 0) {
        for (let i = 0; i < this.flowTime.length; i++) {
          let f = this.flowTime[i]
          f.empTime = []
          // console.log('TEST', this.empTime.filter((e) => e.checkFlowId.filter((c) => parseInt(c) === f.flowId).length > 0).length > 0)
          for (let e = 0; e < this.empTime.length; e++) {
            let emp = this.empTime[e]
            if (emp.checkFlowId.filter((c) => parseInt(c) === f.flowId).length > 0) {
              f.empTime.push(emp)
            }
          }
        }
      }
      console.log('this.flowTime.length', this.flowTime)
      // console.log('this.flowTime.filter((item) => item.empTime.length > 1)', this.flowTime.filter((item) => item.empTime.length > 1).length > 0)
      if (this.flowTime.filter((item) => item.empTime.length > 1).length > 0) {
        for (let i = 0; i < this.flowTime.length; i++) {
          let allTime = []
          let d = this.flowTime[i]
          d.setTimeError = true
          for (let e = 0; e < d.empTime.length; e++) {
            let emp = d.empTime[e]
            allTime.push(...emp.Duplicates)
          }
          // console.log('allTime', allTime)
          // console.log('allTime.every(value => value === allTime[0])', allTime.every(value => value === allTime[0]))
          if (allTime.every(value => value === allTime[0]) === false) {
            d.setTimeError = false
            this.setTimeError = false
          }
        }
      } else if (this.flowTime.filter((item) => item.empTime.length === 1).length > 0) {
        for (let i = 0; i < this.flowTime.length; i++) {
          let d = this.flowTime[i]
          if (d.empTime[0].statusEmp === false) {
            this.setTimeError = false
          }
        }
      } else {
        console.log('ไม่มีช่าง')
      }
      // if (this.empTime.length > 1) {
      //   let allTime = []
      //   for (let i = 0; i < this.empTime.length; i++) {
      //     let d = this.empTime[i]
      //     allTime.push(...d.Duplicates)
      //   }
      //   // console.log('allTime', allTime)
      //   // console.log('allTime.every(value => value === allTime[0])', allTime.every(value => value === allTime[0]))
      //   if (allTime.every(value => value === allTime[0]) === false) {
      //     this.setTimeError = false
      //   }
      // } else if (this.empTime.length === 1) {
      //   if (this.empTime[0].statusEmp === false) {
      //     this.setTimeError = false
      //   }
      // } else {
      //   console.log('ไม่มีช่าง')
      // }
    },
    async getEmp () {
      this.empTime = []
      await axios.get(this.DNS_IP + '/empSelect/get?privacyPage=bookingform&shopId=' + this.shopId).then(async (response) => {
        let rs = response.data
        console.log('rssssssssssssss', rs)
        if (rs.length > 0) {
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.flowId !== null && d.flowId !== '') {
              let checkFlowId = JSON.parse(d.flowId)
              if (d.setTime !== null && d.setTime !== '[]' && d.setTime !== '') {
                if (d.setTimebyday === 'True') {
                  let dt = JSON.parse(d.setTime) || []
                  let TimeDifference = []
                  console.log('dt', dt)
                  for (let b = 0; b < dt.length; b++) {
                    let dtTime = dt[b]
                    // console.log('TEST', await this.calculateTimeDifference(dtTime.setTime))
                    if (dtTime.setTime) {
                      TimeDifference.push(...await this.calculateTimeDifference(dtTime.setTime))
                    }
                  }
                  console.log('TimeDifference', TimeDifference)
                  d.slotTimeCheck = TimeDifference
                  d.checkFlowId = checkFlowId
                  d.Duplicates = await this.removeDuplicates(TimeDifference)
                  d.statusEmp = TimeDifference.every(value => value === TimeDifference[0])
                  this.empTime.push(d)
                } else {
                  let TimeDifference = await this.calculateTimeDifference(JSON.parse(d.setTime))
                  d.slotTimeCheck = TimeDifference
                  d.checkFlowId = checkFlowId
                  d.Duplicates = await this.removeDuplicates(TimeDifference)
                  d.statusEmp = TimeDifference.every(value => value === TimeDifference[0])
                  this.empTime.push(d)
                }
              }
            }
          }
        }
      })
      console.log('this.empTime', this.empTime)
    },
    removeDuplicates (array) {
      // ใช้ filter เพื่อสร้างอาร์เรย์ใหม่ที่มีเฉพาะค่าที่ไม่ซ้ำ
      const uniqueArray = array.filter((value, index, self) => {
        // ใช้ indexOf เพื่อตรวจสอบว่าค่าอยู่ในอาร์เรย์เพียงครั้งเดียว
        return self.indexOf(value) === index
      })

      return uniqueArray
    },
    calculateTimeDifference (timeData) {
      // แปลงข้อมูลเวลาเป็นวินาที
      const timesInSeconds = timeData.map(item => this.convertToSeconds(item.value))

      // คำนวณระยะห่างระหว่างเวลา
      const differences = []
      for (let i = 0; i < timesInSeconds.length - 1; i++) {
        const difference = timesInSeconds[i + 1] - timesInSeconds[i]
        differences.push(difference)
      }

      // แปลงระยะห่างเป็นนาที
      const differencesInMinutes = differences.map(difference => Math.floor(difference / 60))
      // console.log(differencesInMinutes)
      return differencesInMinutes
    },

    // แปลงเวลาจาก HH:mm เป็นวินาที
    convertToSeconds (time) {
      const [hours, minutes] = time.split(':')
      return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60
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
