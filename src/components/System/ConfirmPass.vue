<template>
  <div id="login">
    <v-card elevation="15" max-width="600" class="mx-auto my-12">
      <v-container>
          <v-card-text>
              <v-row class="mb-6" justify="center">
                <v-col md="auto">
                  <v-img :src="require('@/assets/forget.svg')" class="a" style="width:306px;height:206px"></v-img>
                </v-col>
              </v-row>
          </v-card-text>
          <v-card-text>
              <v-row class="mb-6" justify="center" no-gutters>
                <v-col md="auto">
                  <h2 style="font-size:10vw;" class="underline-06">กรุณาใส่ รหัสผ่าน ที่ท่านต้องการ</h2>
                  <!-- <h1 style="color:black;"><strong>Forget Password?</strong></h1> -->
                </v-col>
              </v-row>
          <v-form ref="form_update" v-model="validUpdate" lazy-validation>
            <v-row no-gutter>
            <v-subheader class="pl-16"><strong>Password</strong></v-subheader>
          </v-row>
          <v-row
          no-gutter
              justify="center"
            >
              <v-col lg="12" class="pt-0 pb-0">
          <v-text-field
              prepend-icon="mdi-lock"
              solo
              v-model="form.newUserPassword"
              label="Password"
              :rules="[rules.required]"
              required
            ></v-text-field>
              </v-col>
          </v-row>
          </v-form>
          </v-card-text>
          <br />
          <template >
            <v-btn
              elevation="2"
              x-large
              dark
              color="#1B437C"
              @click="onSubmitForgot()"
              :disabled="!validUpdate"
            >
              รีเซ็ตรหัสผ่าน
            </v-btn>
          </template>
        </v-container>
    </v-card>
  </div>
</template>
<script>
import axios from 'axios'
import VuetifyLogo from '../logo'
export default {
  components: {
    VuetifyLogo
  },
  name: 'Login',
  beforeCreate () {
    this.$liff.init({ liffId: this.$liff_id_login }, function (data) {})
  },
  data () {
    return {
      session: this.$session.getAll(),
      queryData: '',
      bookNo: '',
      jobNo: '',
      dialog: false,
      sheet: false,
      profile: [],
      privacyConfigDetail: '',
      privacyConfigCode: '',
      menu: [],
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
      validUpdate: true
    }
  },
  // eslint-disable-next-line space-before-function-paren
  async mounted() {
    this.validate('UPDATE')
    // await this.checkLiffLogin()
    // this.$session.destroy()
    // this.$session.clear()
  },
  methods: {
    validate (Action) {
      switch (Action) {
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
    async onSubmitForgot () {
      this.dataReady = false
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP +
            '/token_email/get?status=wait&token=' +
            this.$route.query.token
        )
        .then(async (response) => {
          if (response.data[0]) {
            var ID = response.data[0].refId
            var dt = {
              userPassword: this.form.newUserPassword
            }
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + '/system_user/' + 'edit/' + ID,
                dt
              )
              .then(async res => {
                if (res.data.status === true) {
                  let dt = {
                    'status': 'use',
                    'LAST_USER': response.data[0].CREATE_USER
                  }
                  await axios
                    .post(
                      this.DNS_IP + '/token_email/edit/' + this.$route.query.token, dt
                    )
                    .then(async response1 => {
                      if (response1.data.status) {
                        let dt = {
                          'email': response.data[0].CREATE_USER,
                          'status': 'confirm',
                          'user': response.data[0].CREATE_USER,
                          'pass': this.form.newUserPassword
                        }
                        await axios
                          .post(
                            'https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Welcome-sendMail', dt
                          )
                          .then(async response => {
                            this.$swal('เรียบร้อย', 'กรุณาเข้าสู่ระบบด้วยรหัสใหม่', 'success')
                            this.$router.push('/Core/Login')
                          })
                      }
                    })
                } else {
                  this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
                }
              })
          } else {
            this.dataReady = true
            this.$swal('ผิดพลาด', 'ท่านได้เปลี่ยนรหัสผ่านจากลิ้งค์นี้แล้ว กรุณาทำรายการใหม่', 'error')
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
  margin-top: 100px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 60px;
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
</style>
