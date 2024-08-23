<template>
  <div>
    <br>
    <br>
      <v-card flat v-if="!dataReadyGet">
          <v-card-text>
            <div class="text-center">
              <waitingAlert></waitingAlert>
            </div>
          </v-card-text>
        </v-card>
      <v-card>
        <v-container>
        <v-card-text v-if="dataReadyGet">
          <div class="avatar text-center">
            <v-avatar size="120" style="border:5px solid #FFFFFF;">
            <v-img
              v-if="itemPayMent.shopImge"
              :src="itemPayMent.shopImge"
            ></v-img>
            <v-icon size="100" color="orange" v-else>
              mdi-tooltip-account
            </v-icon>
          </v-avatar>
          </div>
          <div class="text-center">
            <h3>{{itemPayMent.shopName}}</h3>
          </div>
          <v-row>
            <v-col cols="12" class="pb-0">
              <h4>เลขประจำตัวผู้เสียภาษี : {{itemPayMent.billingTax}}</h4>
            </v-col>
            <v-col cols="12" class="pb-0">
              <h4>ชื่อ-สกุล : {{itemPayMent.billingCusName}}</h4>
            </v-col>
            <v-col cols="12" class="pb-0">
              <h4>เบอร์โทร : {{itemPayMent.contactTel}}</h4>
            </v-col>
            <v-col cols="12" class="pb-0">
              <h4>อีเมล : {{itemPayMent.contactEmail}}</h4>
            </v-col>
            <v-col cols="12" class="pb-0">
              <h4>ที่อยู่ : {{itemPayMent.billingAddress}}</h4>
            </v-col>
            <v-col cols="12" class="pb-0">
              <h4>ราคาแพ็คเกจ : {{itemPayMent.paymentAmount}}</h4>
            </v-col>
            <v-col cols="12" class="pt-0">
              <h4>รอบชำระ : {{itemPayMent.paymentDateMonthYear}}</h4>
            </v-col>
          </v-row>
          <br>
          <div class="text-center">
            <v-btn
                v-if="itemPayMent.paymentStatus === 'confirm'"
                color="primary"
                small
                dark
                @click="changStatus(itemPayMent, 'finish')"
              >
                <v-icon > mdi-cash-check</v-icon>
                ชำระเรียบร้อย
              </v-btn>
              <v-btn
                v-if="itemPayMent.paymentStatus === 'confirm' || itemPayMent.paymentStatus === 'finish'"
                color="orange"
                small
                dark
                @click="changStatus(itemPayMent, 'wait')"
              >
                <v-icon >mdi-cash-sync</v-icon>
                ลูกค้าชำระอีกครั้ง
              </v-btn>
              <v-btn
                v-if="itemPayMent.paymentStatus === 'wait' || itemPayMent.paymentStatus === 'inactive'"
                color="success"
                small
                dark
                @click="changStatus(itemPayMent, 'confirm')"
              >
                <v-icon > mdi-check-circle </v-icon>
                Active
              </v-btn>
              <v-btn
                v-if="itemPayMent.paymentStatus === 'wait' || itemPayMent.paymentStatus === 'noCash'"
                color="error"
                small
                dark
                @click="changStatus(itemPayMent, 'inactive')"
              >
                <v-icon > mdi-close-circle </v-icon>
                Inactive
              </v-btn>
          </div>
          <br>
            <div class="text-center" v-if="itemPayMent.paymentImage !== ''">
              <h6><strong>หลักฐานเงินมัดจำ</strong></h6>
            </div>
        </v-card-text>
         <v-card-text>
          <v-container>
            <v-img
              v-if="itemPayMent.paymentImage !== ''"
              class="pa-3"
              contain
              max-height="100%"
              max-width="100%"
              :src="itemPayMent.paymentImage"
            ></v-img>
          </v-container>
        </v-card-text>
        </v-container>
      </v-card>
  </div>
</template>
<script>
import axios from 'axios' // api
import waitingAlert from '../waitingAlert.vue'

export default {
  components: {
    waitingAlert
  },
  data () {
    return {
      session: this.$session.getAll(),
      dataReadyGet: false,
      itemPayMent: []
    }
  },
  async mounted () {
    if (this.$route.query.shopId !== undefined && this.$route.query.paymentDateMonthYear !== undefined) {
      await this.beforeCreate()
    } else {
      this.$swal(
        'พบความผิดพลาดระหว่างดำเนินการ',
        'กรุณาตรวจสอบลิ้งค์',
        'info'
      )
        .then(result => {
          this.$router.push('/LoginAdmin')
        })
        .catch(error => {
          console.log('error function addData : ', error)
          this.$router.push('/LoginAdmin')
        })
    }
  },
  methods: {
    async beforeCreate () {
      if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
        if (JSON.parse(localStorage.getItem('sessionData')).USER_ROLE === 'account') {
          this.$session.start()
          this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
          await this.chkPayMent()
        } else {
          this.$router.push('/LoginAdmin?paymentDateMonthYear=' + this.$route.query.paymentDateMonthYear + '&shopId=' + this.$route.query.shopId)
        }
      } else {
        if (!this.$session.exists()) {
          this.$router.push('/LoginAdmin?paymentDateMonthYear=' + this.$route.query.paymentDateMonthYear + '&shopId=' + this.$route.query.shopId)
        } else {
          if (this.$session.getAll().data.USER_ROLE === 'account') {
            localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
            await this.chkPayMent()
          } else {
            this.$router.push('/LoginAdmin?paymentDateMonthYear=' + this.$route.query.paymentDateMonthYear + '&shopId=' + this.$route.query.shopId)
          }
        }
      }
    },
    async chkPayMent () {
      this.dataReadyGet = false
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/system_shop_Payment/get?paymentStatus=not null&paymentDateMonthYear=' + this.$route.query.paymentDateMonthYear + '&shopId=' + this.$route.query.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.status !== false) {
            this.itemPayMent = rs[0]
            this.dataReadyGet = true
          } else {
            this.$router.push('/LoginAdmin')
            this.$swal(
              'พบความผิดพลาดระหว่างดำเนินการ',
              'ไม่มีข้อมูลร้านค้า',
              'info'
            )
          }
        })
    },
    async changStatus (item, text) {
      console.log('changStatus', item)
      let textShow = ''
      if (text === 'finish') {
        textShow = 'ชำระเรียบร้อย'
      } else if (text === 'wait') {
        textShow = 'ลูกค้าชำระอีกครั้ง'
      } else if (text === 'confirm') {
        textShow = 'Active'
      } else if (text === 'inactive') {
        textShow = 'Inactive'
      }
      console.log('changStatus', item)
      this.$swal({
        title: 'ต้องการเปลี่ยนแปลงสถานะเป็น ' + textShow + ' ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (result) => {
          let url = this.DNS_IP + '/system_shop_Payment/edit/' + item.id
          let dt = {
            paymentStatus: text,
            LAST_USER: this.$session.getAll().data.userName
          }
          // }
          await axios.post(url, dt).then(async (response) => {
            if (text === 'inactive') {
              await this.updateShopActive('inactive', item)
              this.chkPayMent()
            } else if (text === 'confirm') {
              if (item.shopActive === 'inactive') {
                await this.updateShopActive('active', item)
                this.chkPayMent()
              } else {
                this.chkPayMent()
              }
            } else {
              this.chkPayMent()
            }
          })
        })
    },
    async updateShopActive (text, item) {
      var ds = {
        shopActive: text,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/sys_shop/edit/" + item.shopId,
          ds
        )
        .then(async (response) => {
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
  width: 255px;
  height: 52px;
  font-size: 10px !important;
}
#subtext {
  color: #173053;
  font-size: 30px !important;
  font-weight: bold;
}
</style>
