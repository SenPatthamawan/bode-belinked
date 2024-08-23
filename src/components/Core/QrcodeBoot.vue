<template>
  <!-- <div style="height:100vh"> -->
    <v-main>
      <div class="pa-4" style="min-height:100vh;background-color:#1B437C;border-bottom-left-radius: 20px;border-bottom-right-radius: 20px;position: relative;">
        <div class="mb-4 mt-4">
          <v-img contain height="50" :src="require('@/assets/betask.png')">
          </v-img>
        </div>
        <!-- <div>

        </div> -->
        <div class="pa-4" style="background-color:white;height: 75vh;border-radius: 43px;justify-content: center;
    display: flex;
    align-items: center;
    flex-direction: column;">
          <p class="mb-0" style="font-size: 20px;text-align: center;font-weight: bold;">Lash Miss Award 2023</p>
          <v-img
                height="50"
                contain
                :src="require('@/assets/qr-code-boot.png')"
          ></v-img>
          <div style="display: flex;justify-content: center;">
            <p class="mb-0" style="font-size: 16px;text-align: center;width: 244px;">เพิ่มเราเป็นเพื่อนได้ง่ายๆ เพียงสแกน QR Code หรือคลิกที่ลิ้งค์</p>
          </div>
          <div class="mb-7" style="text-align: center;">
            <a style="color:#182d96 !important;text-decoration: revert;" href="https://lin.ee/8dJyn31">@betask</a>
          </div>
          <div class="buttomSetting" @click="updateAndpushToblizard()">
            Setting Appointments
          </div>
        </div>
        <div style="text-align: center;position: absolute;
    left: 0;
    right: 0;
    bottom: 0;">
          <p style="color:white !important">POWERED BY  BETASK CONSULTING</p>
        </div>
      </div>
    </v-main>
  <!-- </div> -->
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios'
import VuetifyLogo from '../logo'
// import NavbarRegister from './NavbarRegister'
// import VueRecaptcha from 'vue-recaptcha'
export default {
  components: {
    waitingAlert,
    VuetifyLogo
    // NavbarRegister,
    // 'vue-recaptcha': VueRecaptcha
  },
  name: 'Login',
  computed: {
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '12'
        case 'sm':
          return '12'
        case 'md':
          return '6'
        case 'lg':
          return '6'
        case 'xl':
          return '6'
      }
      console.log(
        'this.$vuetify.breakpoint.name',
        this.$vuetify.breakpoint.name
      )
    }
  },
  // beforeCreate () {
  //   this.$liff.init({ liffId: this.$liff_id_login }, function (data) {})
  // },
  data () {
    return {
      dialogPaymentUpload: false,
      session: this.$session.getAll(),
      cards: [
        {
          title: 'Favorite road trips',
          src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
          flex: 6
        },
        {
          title: 'Best airlines',
          src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg',
          flex: 6
        }
      ],
      queryData: '',
      bookNo: '',
      jobNo: '',
      dialog: false,
      dialogPopup: true,
      sheet: false,
      profile: [],
      privacyConfigDetail: '',
      privacyConfigCode: '',
      widthScreen: window.screen.width,
      menu: [],
      rules: {
        numberRules: (value) =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: (value) => value.length <= 10 || 'Max 10 characters',
        IDcardRules: (value) =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: (value) => !!value || 'กรุณากรอก.',
        resizeImag: (value) =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
        counterIDcard: (value) => value.length <= 13 || 'Max 13 characters',
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      formCheckPrivacy: {
        privacyConfigCode: '',
        userCode: '',
        privacyStatus: '',
        userTypeGroup: ''
      },
      form: {
        userLineId: '',
        userLinepictureUrl: '',
        userName: '',
        newUserName: '',
        userPassword: '',
        newUserPassword: ''
      },
      dataReady: true,
      hidePrivacy: true,
      validUpdate: true,
      recapchaToken: '',
      recapStatus: false,
      dataBilling: []
    }
  },
  // eslint-disable-next-line space-before-function-paren
  async mounted() {
    // await this.checkLiffLogin()
    // this.$session.destroy()
    // this.$session.clear()
  },
  methods: {
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
    gotoConnectLine () {
      this.$swal({
        title: 'หากท่านต้องการเชื่อมต่อ LINE OA ระบบจะนำท่านไปยังหน้าเชื่อมต่อ และ เข้าสู่ระบบอีกครั้ง',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          console.log('result', result)
          if (result) {
            window.open('https://betask-linked.web.app/CreateLineOAaccount?shopId=' + this.$session.getAll().data.shopId, '_blank').focus()
            this.$router.push('/Core/Login')
          }
        }).catch(error => {
          console.log('error function editDataGlobal : ', error)
        })
      // window.open('https://betask-linked.web.app/CreateLineOAaccount?shopId=' + this.$session.getAll().data.shopId, '_blank').focus()
    },
    async updateAndpushToblizard () {
      console.log('updateAndpushToblizard', this.session)
      axios.post(this.DNS_IP + '/sys_shop/edit/' + this.session.data.shopId, {'statusFollowOA': 'True'})
        .then((res) => {
          this.$router.push('/InstallWizard')
        })
        .catch((error) => {
          this.dataReady = true
          console.log(error)
          this.$swal('ผิดพลาด', 'Account ไม่ถูกต้อง2', 'error')
        })
    },
    async onSubmit () {
      this.dataReady = false
      this.form.type = 'username'
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP +
              '/system_user/auth?userName=' +
              this.form.userName +
              '&userPassword=' +
              this.form.userPassword +
              '&USER_ROLE=account'
        )
        .then(async (response) => {
          if (response.data.status !== false) {
            console.log('response.data[0]', response.data[0])
            if (response.data[0]) {
              this.$session.start()
              this.$session.set('data', response.data[0])
              if (this.$route.query.shopId !== undefined && this.$route.query.paymentDateMonthYear !== undefined) {
                this.$router.push('/UpdateStatusPayment?shopId=' + this.$route.query.shopId + '&paymentDateMonthYear=' + this.$route.query.paymentDateMonthYear)
              } else {
                this.$router.push('/ShopList')
              }
            } else {
              this.dataReady = true
              this.$swal('ผิดพลาด', 'Account ไม่ถูกต้อง1', 'error')
            }
          }
        })
      // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          this.dataReady = true
          console.log(error)
          this.$swal('ผิดพลาด', 'Account ไม่ถูกต้อง2', 'error')
        })
    }
  }
}
</script>
<style scoped>
.bgPage {
  background: linear-gradient(180deg, #ffffff 10%, #e1f3ff 100%);
  height: 100%;
  /* left: 0%;
  right: 0%;
  top: 0%;
  bottom: 0%; */
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
h1 {
  text-align: center;
}
.a >>> .ql-align-center {
  text-align: center;
}
a {
  color: #42b983;
}
#danger {
  color: red;
}
#login {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 100px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 60px; */
}
.v-subheader {
  color: #1b437c !important;
}
#xxxxxx {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
hr {
  border: none;
  border-top: 4px dotted grey;
  color: #fff;
  background-color: #fff;
  height: 1px;
  width: 50%;
  margin-top: 30px;
}
/* body {
  background-color: lightgreen;
} */
.buttomSetting {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 62px;
  background: #23B066;
  border-radius: 20px;
  color: white;
  font-size: 18px;
  padding: 10px 60px;
  white-space: nowrap;
  font-size: 15px;
}
</style>
