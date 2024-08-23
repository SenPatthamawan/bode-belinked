<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-overlay :value="overlay">
            <v-progress-circular
              indeterminate
              size="64"
            ></v-progress-circular>
          </v-overlay>
          <v-col cols="6" class="text-left">
          </v-col>
          <v-col cols="6" class="v-margit_button text-right">
            <v-btn
              color="primary"
              style="z-index:8;"
              id="v-step-0"
              depressed
              @click="gotoLoyalty()"
            >
              <v-icon left>mdi-gift-open</v-icon>
              เปิดใช้งานโปรแกรม Loyalty
            </v-btn>
          </v-col>
        </v-row>
        <v-dialog
            v-model="dialogError"
            persistent
            max-width="500px"
          >
            <v-card>
              <v-card-title class="text-h5">
                ผิดพลาด
              </v-card-title>
              <v-card-text>ขออภัย Admin User นี้มีอยู่ในระบบอยู่แล้ว</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  color="red darken-1"
                  @click="dialogError = false"
                >
                  รับทราบ
                </v-btn>
                <v-btn
                  dark
                  color="green darken-1"
                  @click="gotoWebLoyalty()"
                >
                  ไปยังเว็บ Loyalty
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </div>
    </v-main>
  </div>
</template>
<script>
import adminLeftMenu from '../Sidebar.vue' // เมนู
import axios from 'axios' // api
import moment from 'moment-timezone'
export default {
  components: {
    'left-menu-admin': adminLeftMenu
  },
  data () {
    return {
      session: this.$session.getAll(),
      dialogError: false,
      overlay: false
    }
  },
  methods: {
    gotoWebLoyalty () {
      window.open('https://betask-loyalty-app.web.app', '_blank')
      this.dialogError = false
      this.overlay = false
    },
    async gotoLoyalty () {
      this.overlay = true
      console.log('session', this.session.data)
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP_Loyalty +
            '/system_shop/get?shopId=' +
            this.session.data.shopId
        )
        .then(async (response) => {
          if (response.data.status === false) {
            var dt = {
              shopId: this.session.data.shopId,
              logo: this.session.data.shopImge,
              name: this.session.data.shopName,
              userName: this.session.data.userName,
              password: this.session.data.userPassword,
              userCode: this.session.data.userCode,
              userCreate: this.session.data.userName,
              contactTel: this.session.data.contactTel,
              Email: this.session.data.contactEmail,
              expire_date_trial: moment().add(7, 'days').format('YYYY-MM-DD')
            }
            console.log('add', dt)
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP_Loyalty + "/system_shop/createShop",
                dt
              )
              .then(async (response) => {
                this.$swal('เรียบร้อย', 'สร้างร้าน เรียบร้อย', 'success')
                this.overlay = false
                window.location.href = `https://betask-loyalty-app.web.app/core/login`
                // this.$router.push('/Core/Login')
              })
            // eslint-disable-next-line handle-callback-err
              .catch((error) => {
                console.log(error)
                // this.$router.push('/system/Errorpage?returnLink=' + this.returnLink)
                this.dataReady = true
              })
          } else {
            this.dialogError = true
            this.overlay = false
          }
        })// eslint-disable-next-line handle-callback-err
        .catch(async (error) => {
          console.log(error)
          this.overlay = false
        })
    },
    async addBetaskDB (ds) {
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP_Betask + "/sys_shop/addLoyalty", ds
        )
        .then(async response => {
        })
    }
  }
}
</script>
