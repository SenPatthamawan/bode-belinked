<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <v-row>
        <v-col cols="6" class="text-left">
          <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
        </v-col>
      </v-row>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h3>ระบบนัดหมาย สามารถใช้ได้กับทุกช่องทาง</h3>
          </v-col>
        </v-row>
        <div class="text-center"  style="width:40%;">
          <v-row>
              <v-col cols="12" md="12" sm="12" style="background-color:#FFFFFF;">
                <div v-if="Redirect !== ''">
                  <v-card class="p-3" style="background-color:#050C42;">
                    <h4 class="text-center" style="color:#FFFFFF;">
                      Copy ลิ้งค์นี้ไปใส่ช่องทางต่างๆ เพิ่อเริ่มใช้งาน!
                    </h4>
                    <v-img
                      :src="require('@/assets/Blue_Arrow_PNG.png')"
                      class="a"
                      style="width:60px;height:76px;margin-bottom:13px;"
                    ></v-img>
                    <v-card-text>
                      <v-row align-content="center">
                        <v-col cols="12"   class="pb-0">
                          <v-text-field
                            v-model="Redirect"
                            style="background-color:#050C42;"
                            solo
                            readonly
                            id="myInput"
                            dense
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row justify="center" no-gutters>
                        <v-col cols="auto" class="text-lelf">
                          <v-btn
                            color="#1B437C"
                            small
                            fab
                            dark
                            @click="FunCopy('facebook')"
                          >
                            <v-icon>mdi-facebook</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="auto" class="text-lelf">
                          <v-btn
                            color="#1B437C"
                            small
                            fab
                            dark
                            @click="FunCopy('twitter')"
                          >
                            <v-icon>mdi-twitter</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="auto" class="text-lelf">
                          <button v-on:click="FunCopy('line')"><v-img :src="require('@/assets/lineIcon.png')" style="width:40px;height:40px;margin-bottom:13px;" /></button>
                        </v-col>
                        <v-col cols="auto" class="text-lelf">
                          <v-btn
                            color="#1B437C"
                            small
                            fab
                            dark
                            @click="FunCopy('instagram')"
                          >
                            <v-icon>mdi-instagram</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="auto" class="text-lelf">
                          <v-btn
                            color="#1B437C"
                            small
                            fab
                            dark
                            @click="dialogOther = true, validate('other')"
                          >
                            <v-icon>mdi-tag-plus</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-dialog v-model="dialogOther" max-width="70%">
                        <v-card class="text-center">
                          <v-card-title>
                            ยืนยันรายการนี้
                          </v-card-title>
                          <v-card-text>
                            <v-form ref="form_other" v-model="validOther" lazy-validation>
                            <v-container>
                            <v-row>
                              <v-text-field
                                v-model="textOther"
                                label="ใส่แหล่งที่มาที่ต้องการ"
                                outlined
                                dense
                                required
                                :rules ="[rules.required]"
                              ></v-text-field>
                            </v-row>
                            <div class="text-center">
                              <v-btn
                                elevation="10"
                                color="#173053"
                                dark
                                :disabled="!validOther"
                                small
                                @click="FunCopy(textOther), dialogOther = false"
                                >คัดลอก</v-btn>
                              <v-btn
                                elevation="10"
                                color="#173053"
                                outlined
                                style="background-color:#FFFFFF"
                                small
                                @click="dialogOther = false"
                                >ยกเลิก</v-btn
                              >
                            </div>
                            </v-container>
                            </v-form>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                      <v-row class="pa-0">
                        <v-col cols="12" md="12" sm="12" class="pa-0" style="background-color:#FFFFFF;">
                          <div class="pa-1">
                           <Showbooking class="pa-0" ></Showbooking>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <v-btn
                          elevation="10"
                          color="#5C99DB" block dark
                          medium
                          @click="$router.push('/Master/BookingField')"
                        >แก้ไขหน้า Booking</v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
              </v-col>
            </v-row>
        </div>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import Showbooking from './Showbooking.vue'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    Showbooking
  },
  data () {
    return {
      itemdetell: [],
      Redirect:
        'https://liff.line.me/1656581804-7KRQyqo5/Booking?shopId=' +
        this.$session.getAll().data.shopId,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      IdUpdate: '',
      bookingField: [],
      menuDate: false,
      date: '',
      time: '',
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },
      Fielditem: [],
      textOther: '',
      showitem: false,
      validOther: false,
      dialogOther: false,
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
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'หน้านัดหมาย',
          disabled: false,
          href: '/Master/BookingField'
        }
      ],
      fixtureField: [
        {
          fieldName: 'ประเภทบริการ'
        },
        {
          fieldName: 'สาขา'
        }
      ],
      FieldSelect: [
        {
          text: 'Field Id',
          value: 'fieldId'
        },
        {
          text: 'Field Name',
          value: 'fieldName'
        },
        { text: 'เลือกข้อมูล', value: 'showitem' }
      ]
    }
  },
  async mounted () {
    await this.getBookingField()
  },
  methods: {
    validate (Action) {
      switch (Action) {
        case 'other':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_other.validate()
          })
          break
        default:
          break
      }
    },
    async getBookingField () {
      let itemIncustomField = []
      this.IdUpdate = ''
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          if (typeof (rs.status) === 'undefined') {
            this.IdUpdate = rs[0].bookingFieldId
            console.log('this.IdUpdate', this.IdUpdate)
            console.log('rs', rs)
            if (rs.length > 0) {
              let bookingData = []
              bookingData = JSON.parse(rs[0].flowfieldName)
              for (let i = 0; i < bookingData.length; i++) {
                let d = bookingData[i]
                itemIncustomField.push(d.fieldId)
              }
              console.log('item', itemIncustomField)
              this.getCustomField(itemIncustomField)
            }
          } else {
            this.getCustomField(itemIncustomField)
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async getCustomField (item) {
      let checkdata = []
      this.Fielditem = []
      await axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.shopId)
        .then(response => {
          let dt = response.data
          for (let i = 0; i < dt.length; i++) {
            let d = dt[i]
            checkdata.push(d.fieldId)
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
      let fieldAll = checkdata.filter(function (x) {
        return !item.includes(x)
      })
      if (item.length > 0) {
        await this.getCustomFieldData(item, true)
      }
      if (fieldAll.length > 0) {
        await this.getCustomFieldData(fieldAll, false)
      }
    },
    async getCustomFieldData (fieldSet, showItem) {
      await axios
        .get(this.DNS_IP + '/customField/fieldId?fieldId=' + fieldSet)
        .then(async response => {
          let rs = response.data
          // let aa = []
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.fieldId = d.fieldId
            s.fieldName = d.fieldName
            s.fieldType = d.fieldType
            s.optionField = d.optionField
            s.conditionField = d.conditionField
            s.conditionValue = d.conditionValue
            s.shopId = d.shopId
            s.fieldValue = ''
            s.showitem = showItem
            this.Fielditem.push(s)
          }
          let data1 = this.Fielditem.filter(el => parseInt(el.conditionField || 0) > 0)
          // let data2 = []
          for (let i = 0; i < data1.length; i++) {
            let d = data1[i]
            let indexC = this.Fielditem.findIndex(function (o) {
              return o.fieldId === d.fieldId
            })
            let indexF = this.Fielditem.findIndex(function (o) {
              return o.fieldId === parseInt(d.conditionField)
            })
            this.Fielditem.splice((indexF + 1), 0, this.Fielditem.splice(indexC, 1)[0])
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async addBooking () {
      let booking = {}
      let UpdateField = []
      // this.Redirect = this.DNS_IP + '/booking?shopId=' + this.$route.query.shopId
      for (let i = 0; i < this.Fielditem.length; i++) {
        let d = this.Fielditem[i]
        if (d.showitem === true) {
          UpdateField.push({
            fieldId: d.fieldId
          })
        }
      }
      console.log('update', this.Fielditem)
      booking.flowfieldName = JSON.stringify(UpdateField)
      booking.shopId = this.shopId
      booking.LAST_USER = this.session.data.userName
      console.log('dtbooking', booking)
      this.$swal({
        title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          await this.saveBooking(booking)
        })
        .catch(error => {
          console.log('Cencel : ', error)
        })
    },
    async saveBooking (booking) {
      let url = '/BookingField/add'
      if (this.IdUpdate !== '') {
        url = '/BookingField/edit/' + this.IdUpdate
      } else {
        booking.CREATE_USER = this.session.data.userName
      }

      await axios
        .post(this.DNS_IP + url, booking)
        .then(async response => {
          for (let i = 0; i < this.Fielditem.length; i++) {
            let d = this.Fielditem[i]
            let showcarditem = {
              showCard: d.showcard
            }
            await axios
              .post(
                this.DNS_IP + '/customField/edit/' + d.fieldId,
                showcarditem
              )
              .then(response => {})
              .catch(error => {
                console.log('error function addData : ', error)
              })
          }

          this.$swal('บันทึกข้อมูลเรียบร้อย', ' ', 'success')
          this.getBookingField()
          console.log(`addDataGlobal DNS_IP + ${url}`, response)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    FunCopy (text) {
      var copyText = document.getElementById('myInput')
      copyText.select()
      copyText.setSelectionRange(0, 99999)
      navigator.clipboard.writeText(copyText.value + '&source=' + text)
    }
  }
}
</script>

<style scoped>
span.v-btn__content {
  color: #1b437c !important;
}
.main {
  margin-top: 1rem;
}
.Bar {
  padding: 10px;
  background-color: #ffffff;
  height: 100%;
}
.Review {
  padding: 20px, 20px, 20px, 20px;
}
.content {
  overflow: auto;
  white-space: normal;
}
.a {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
}
.continer {
  padding: 20px, 20px, 20px, 20px;
}
</style>
