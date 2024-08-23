<template>
  <div id="login" class="bgPage">
    <v-row>
      <v-col cols="12" md="6" align="center" :style="resCol === '6' ? 'padding-top: 30px;' : 'padding-top: 20px'">
        <v-img
          contain
          width="60%"
          src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FMascot-Betask.png?alt=media&token=fa5315ab-476e-4c8d-bca1-04bf8846b5f2"
        ></v-img>
        <!-- <v-img
          contain
          width="60%"
          :src="require('@/assets/Mascot-Betask.png')"
        ></v-img> -->
      </v-col>
      <v-col>
        <v-container
          fluid
          :style="resCol === '6' ? 'padding-top: 70px;' : 'padding-top: 0'"
        >
          <v-row class="text-center" justify="center" no-gutters>
            <v-col cols="10">
              <h2>
                <strong style="color: #001d6e">เข้าสู่ระบบ BeTask</strong>
              </h2>
              <p><strong>ลงชื่อเข้าใช้บัญชีของคุณ</strong></p>
            </v-col>
          </v-row>
          <div>
            <v-row justify="center" no-gutters>
              <v-col cols="10" class="pa-0">
                <v-text-field
                  label="อีเมล"
                  outlined
                  autofocus
                  v-model="form.userName"
                  @keyup.enter="onSubmit()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters style="height: 70px">
              <v-col cols="10" class="pa-0">
                <v-text-field
                  class=""
                  label="รหัสผ่าน"
                  outlined
                  v-model="form.userPassword"
                  @keyup.enter="onSubmit()"
                  type="password"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutter>
              <v-col cols="10">
                <v-btn
                  color="#001D6E"
                  style="font-size: 20px"
                  dark
                  x-large
                  block
                  @click="onSubmit()"
                >
                  เข้าสู่ระบบ
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-col>
    </v-row>
    <div v-if="!dataReady" class="text-center">
      <waitingAlert></waitingAlert>
    </div>
  </div>
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
    this.$session.destroy()
    this.$session.clear()
    localStorage.clear()
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
              localStorage.clear()
              localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
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
</style>
