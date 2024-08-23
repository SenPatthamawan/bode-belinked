<template>
  <div id="login" class="bgPage">
    <NavbarRegister />
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
              <v-form ref="form_login" v-model="validAdd" lazy-validation>
                <v-row justify="center" no-gutters>
                  <v-col cols="10" class="pa-0">
                    <v-text-field
                      label="อีเมล"
                      outlined
                      autofocus
                      v-model="form.userName"
                      required
                      :rules="[rules.email]"
                      @keyup.enter="onSubmit()"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center" no-gutters style="height: 70px">
                  <v-col cols="10" class="pa-0">
                    <v-text-field
                      :rules="[rules.required]"
                      required
                      class=""
                      label="รหัสผ่าน"
                      outlined
                      v-model="form.userPassword"
                      @keyup.enter="onSubmit()"
                      :type="showPass ? 'text' : 'password'"
                      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPass = !showPass"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- <v-row justify="center" no-gutters style="height: 70px">
                  <v-col cols="10" style="display: flex; justify-content: center">
                    <vue-recaptcha
                      ref="recaptcha"
                      @verify="verifyMethod"
                      @render="renderMethod"
                      sitekey="6Lef5A8hAAAAAIffpLLp_mpt_UFbcuq6l_mXbh8e"
                    ></vue-recaptcha>
                  </v-col>
                </v-row> -->
                <v-row
                  v-if="recapStatus"
                  justify="center"
                  class="mt-3"
                  no-gutters
                  style="height: 40px"
                >
                  <v-col cols="10">
                    <v-alert text outlined type="error">
                      กรุณากดยืนยันตัว.
                    </v-alert>
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
              </v-form>
              <v-col style="display: flex; justify-content: center">
                <div class="mr-1" style="font-size: 18px">ลืม?</div>
                <div
                  style="
                    font-size: 18px;
                    color: #001d6e;
                    cursor: pointer;
                    text-decoration: underline;"
                  @click="(dialog = true), validate('UPDATE')"
                >
                  รหัสผ่าน
                </div>
              </v-col>
              <v-col>
                <h6>
                  คุณได้ลงทะเบียนแล้วหรือยัง?
                  <a
                    style="cursor: pointer; text-decoration: underline"
                    href="https://belinked.betaskthai.com/register"
                    >ลงทะเบียน!</a
                  >
                </h6>
              </v-col>
            </div>
        </v-container>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogPaymentUpload" persistent max-width="500px">
      <v-card>
        <v-container>
          <v-card-text>
            <v-row>
              <v-col cols="10" class="text-left pt-10">
                <h3><strong>กรุณาชำระค่าบริการรายเดือน</strong></h3>
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
                    @click="(dialogPaymentUpload = false)"
                    >
                    X
                    </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-btn
                  elevation="2"
                  x-large
                  dark
                  color="#1B437C"
                  @click="gotoBilling(dataBilling)"
                  :disabled="!validUpdate"
                >
                  <v-icon left  class="iconify" data-icon="medical-icon:billing"></v-icon>
                  ชำระค่าบริการ
                </v-btn>
              </v-col>
              <v-col cols="12">
                <h4>หากต้องการติดต่อเจ้าหน้าที่ กรุณาติดต่อที่ LINE OA : <a href="https://lin.ee/8dJyn31">@betaskthai</a></h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" persistent max-width="445">
      <v-card>
        <v-container>
          <v-card-text>
            <v-row class="mb-6" justify="center">
              <v-col md="auto">
                <v-img
                  src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FforgotPassword.svg?alt=media&token=18d74e00-5b29-4d54-983e-f4ae5587510a"
                  class="a"
                  style="width: 103px; height: 103px"
                ></v-img>
                <!-- <v-img
                  :src="require('@/assets/forgotPassword.svg')"
                  class="a"
                  style="width: 103px; height: 103px"
                ></v-img> -->
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-row class="mb-6" justify="center" no-gutters>
              <v-col md="auto">
                <h1 style="font-size: 10vw" class="underline-06">
                  Forget Password?
                </h1>
              </v-col>
            </v-row>
            <v-form ref="form_update" v-model="validUpdate" lazy-validation>
              <v-row no-gutter>
                <v-subheader class="pl-16"
                  ><strong>Username/ Email</strong></v-subheader
                >
              </v-row>
              <v-row no-gutter justify="center">
                <v-col lg="12" class="pt-0 pb-0">
                  <v-text-field
                    prepend-icon="mdi-account"
                    v-model="form.newUserName"
                    label="Username"
                    solo
                    :rules="[rules.email]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col lg="12" class="pa-0">
                  <v-subheader class="pl-16"
                    >Enter you email address and we will send you an email for
                    reset password</v-subheader
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <br />
          <v-row justify="center" no-gutter>
            <v-col md="auto">
              <v-btn
                elevation="2"
                x-large
                dark
                color="#1B437C"
                @click="onSubmitForgot()"
                :disabled="!validUpdate"
              >
                <v-icon left>mdi-checkbox-marked-circle</v-icon>
                Reset Password
              </v-btn>
            </v-col>
          </v-row>
          <v-row justify="center" no-gutter>
            <v-col md="auto">
              <a class="v-subheader" @click="dialog = false"
                >Return to Signin</a
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <div v-if="!dataReady" class="text-center">
      <waitingAlert></waitingAlert>
    </div>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios'
import VuetifyLogo from '../logo'
import NavbarRegister from './NavbarRegister'
// import VueRecaptcha from 'vue-recaptcha'
export default {
  components: {
    waitingAlert,
    VuetifyLogo,
    NavbarRegister
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
      showPass: false,
      validAdd: true,
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
    if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
      this.checkRouter(JSON.parse(localStorage.getItem('sessionData')))
    } else {
      // await this.checkLiffLogin()
      this.$session.destroy()
      this.$session.clear()
      localStorage.clear()
    }
  },
  methods: {
    async checkRouter (dataSession) {
      if (dataSession.shopActive === 'active') {
        this.$session.start()
        this.$session.set('data', dataSession)
        localStorage.clear()
        localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
        // เช็คว่ามาจาก boot หรือป่าว
        if (dataSession.sourceLink === 'boot') {
          if (dataSession.timeSlotStatus === 'False') {
            let dt = {
              shopId: this.$session.getAll().data.shopId,
              timeSlotStatus: 'True',
              storeFrontCheck: 'False',
              LAST_USER: this.$session.getAll().data.userName,
              type: 'boot'
            }
            await axios
              .post(
                this.DNS_IP + '/flow/editTimeSlotStatusByshopId',
                dt
              )
              .then(() => {
                dataSession['timeSlotStatus'] = 'True'
                this.$session.start()
                this.$session.set('data', dataSession)
                localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
              })
          }
          //
          if (dataSession.statusFollowOA === 'False') {
            this.$router.push('/Core/QrcodeBoot')
          } else if (dataSession.statusFinishWizard === 'False') {
            this.$router.push('/InstallWizard')
          } else {
            this.checkbookNo(dataSession)
          }
        } else {
          this.checkbookNo(dataSession)
        }
      } else {
        this.dataBilling = dataSession
        this.dataReady = true
        this.dialogPaymentUpload = true
      }
    },
    gotoBilling (item) {
      this.$session.start()
      this.$session.set('data', item)
      localStorage.clear()
      localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
      window.location.href = 'https://liff.line.me/1660658626-Qn8zej1p'
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
        case 'LOGIN':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_login.validate()
          })
          break

        default:
          break
      }
    },
    verifyMethod (a) {
      this.recapchaToken = a
      this.recapStatus = false
      console.log('token', a)
    },
    renderMethod (c) {
      console.log(c)
    },
    async checkbookNo (dataitem) {
      if (this.$route.query.bookNo !== undefined && this.$route.query.type !== 'job') {
        if (dataitem.shopId === this.$route.query.shopId) {
          this.bookNo = this.$route.query.bookNo
          this.queryData = 'bookNo'
          console.log('dataitem.shopId', dataitem.shopId)
          if (this.$route.query.type === 'bookConfirm') {
            this.$router.push(
              '/BookingMobileConfirmJob?' +
                this.queryData +
                '=' +
                this.bookNo +
                '&shopId=' +
                this.$route.query.shopId
            )
          } else {
            if (dataitem.timeSlotStatus === 'True') {
              this.$router.push(
                '/BookingMobileEmp?' +
                this.queryData +
                '=' +
                this.bookNo +
                '&shopId=' +
                this.$route.query.shopId
              )
            } else {
              this.$router.push(
                '/BookingMobile?' +
                this.queryData +
                '=' +
                this.bookNo +
                '&shopId=' +
                this.$route.query.shopId
              )
            }
          }
        } else {
          this.$swal({
            title: 'ไม่มีข้อมูลการนัดหมาย?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#b3b1ab',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          })
            .then(async () => {
              this.dataReady = true
              this.$router.push('/Core/Login')
              // await _this.getTokenCheck()
            })
            .catch(async () => {
              this.$router.push('/Core/Login')
            })
        }
      } else if (this.$route.query.jobNo !== undefined && this.$route.query.type !== 'job') {
        if (this.$route.query.type === 'jobList') {
          this.$router.push(
            '/Onsite/JobList?jobNo=' +
              this.$route.query.jobNo +
              '&shopId=' +
              this.$route.query.shopId +
              '&type=jobList&empId=' +
              this.$route.query.empId
          )
        } else {
          if (dataitem.shopId === this.$route.query.shopId) {
            // this.jobNo = this.$route.query.jobNo
            console.log('jobMach')
            // this.queryData = 'jobNo'
            this.$router.push(
              '/Master/jobQrCode?jobNo=' +
                this.$route.query.jobNo +
                '&shopId=' +
                this.$route.query.shopId
            )
          } else {
            this.$swal({
              title: 'ข้อมูลงานไม่ถูกต้อง?',
              type: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#b3b1ab',
              confirmButtonText: 'ใช่',
              cancelButtonText: 'ไม่'
            })
              .then(async () => {
                this.$router.push(
                  '/Core/Login?jobNo=' +
                    this.$route.query.jobNo +
                    '&shopId=' +
                    this.$route.query.shopId
                )
                // await _this.getTokenCheck()
              })
              .catch(async () => {
                this.$router.push(
                  '/Core/Login?jobNo=' +
                    this.$route.query.jobNo +
                    '&shopId=' +
                    this.$route.query.shopId
                )
              })
          }
        }
      } else if (this.$route.query.bookNo !== undefined && this.$route.query.type === 'job') {
        if (dataitem.category === 'ธุรกิจรถยนต์') {
          this.$router.push(
            '/Master/BookingList?bookNo=' +
              this.$route.query.bookNo +
              '&shopId=' +
              this.$route.query.shopId +
              '&type=' +
              this.$route.query.type
          )
        } else {
          this.$router.push(
            '/Master/BookingListBeauty?bookNo=' +
              this.$route.query.bookNo +
              '&shopId=' +
              this.$route.query.shopId +
              '&type=' +
              this.$route.query.type
          )
        }
      } else if (this.$route.query.dateEvent !== undefined && this.$route.query.type === 'printInvoice') {
        this.$router.push(
          '/PrintPdf/PrintInvoice?dateEvent=' + this.$route.query.dateEvent
        )
      } else if (this.$route.query.type === 'billing') {
        window.location.href = 'https://liff.line.me/1660658626-Qn8zej1p'
      } else if (this.$route.query.type === 'CheckListBookingEmp') {
        if (dataitem.shopId === this.$route.query.shopId) {
          this.$router.push(
            '/CheckBookingEmpList?shopId=' + this.$route.query.shopId
          )
        } else {
          this.$swal({
            title: 'UserName ของท่านไม่สามารถใช้กับร้านค้านี้ได้',
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#b3b1ab',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          })
            .then(async () => {
              this.dataReady = true
              this.$router.push('/Core/Login')
              // await _this.getTokenCheck()
            })
            .catch(async () => {
              this.$router.push('/Core/Login')
            })
        }
      } else if (this.$route.query.type === 'AdminStampStep') {
        if (this.$route.query.jobNo !== undefined) {
          this.$router.push(
            '/AdminStampStep?jobNo=' + this.$route.query.jobNo +
                '&shopId=' + this.$route.query.shopId
          )
        } else {
          this.$router.push(
            '/AdminStampStep?shopId=' + this.$route.query.shopId
          )
        }
      } else {
        if (dataitem.USER_ROLE === 'onsite') {
          if (dataitem.shopId === this.shopNameData.airmate) {
            this.$router.push('/Onsite/JobListAirmate')
          } else {
            this.$router.push('/Onsite/JobList')
          }
        } else if (dataitem.USER_ROLE === 'board') {
          if (dataitem.shopId === 'U9084920b3005bd1dcb57af1ae6bdba32' || dataitem.shopId === 'U951aaccf8b715308c8af44068f511fb0') {
            this.$router.push('/Master/BoardControl')
          } else {
            this.$router.push('/Master/BoardControlBeauty')
          }
        } else if (dataitem.USER_ROLE === 'booking') {
          if (dataitem.shopId === 'U9084920b3005bd1dcb57af1ae6bdba32' || dataitem.shopId === 'U951aaccf8b715308c8af44068f511fb0') {
            this.$router.push('/Master/BookingList')
          } else {
            if (dataitem.timeSlotStatus === 'True') {
              this.$router.push('/Master/BookingByUserEmp')
            } else {
              this.$router.push('/Master/BookingListBeauty')
            }
          }
        } else if (dataitem.USER_ROLE === 'storeFront') {
          if (dataitem.shopId === 'Ue9f527da07ff2da05246ea3f62671493') {
            this.$router.push('/Master/BookingListQueueByUserOhrich')
          } else if (dataitem.shopId === 'Ue26280cb7c25119d75055cd07391b5e8') {
            this.$router.push('/Master/BookingListQueueByUserEventCat')
          } else if (dataitem.shopId === 'U512ca78be8cd402fd96f57d5f6aca6f3') {
            this.$router.push('/Master/BookingListQueueByUserEvent')
          } else {
            this.$router.push('/Master/BookingListQueueByUser')
          }
        } else {
          // this.$router.push('/Dashbord/ReportBooking')
          this.$router.push('/Master/BookingField')
        }
      }
    },
    async onSubmit () {
      this.validate('LOGIN')
      setTimeout(() => this.onSubmitSubmit(), 500)
    },
    async onSubmitSubmit () {
      if (this.validAdd !== false) {
        this.dataReady = false
        this.form.type = 'username'
        console.log(JSON.stringify(this.form))
        // if (this.recapchaToken !== '') {
        await axios
          .get(
            // eslint-disable-next-line quotes
            this.DNS_IP +
              '/system_user/auth?userName=' +
              this.form.userName +
              '&userPassword=' +
              this.form.userPassword
          )
          .then(async (response) => {
            if (response.data.status !== false) {
              console.log('response.data[0]', response.data[0])
              if (response.data[0]) {
                this.checkRouter(response.data[0])
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
        // } else {
        //   this.recapStatus = true
        //   this.dataReady = true
        // }
      }
    },
    async onSubmitForgot () {
      // this.dataReady = false
      this.form.type = 'username'
      // console.log(JSON.stringify(this.form))
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/system_user/get?userName=" + this.form.newUserName
        )
        .then(async (response) => {
          if (response.data.status !== false) {
            if (response.data[0]) {
              var md5 = require('md5')
              let autogen = await this.generateCodeGlobal
              let token = md5(autogen)

              let dt = {
                refId: response.data[0].userId,
                typeJob: 'forgot',
                status: 'wait',
                token: token,
                CREATE_USER: response.data[0].userName,
                LAST_USER: response.data[0].userName
              }
              await axios
                .post(this.DNS_IP + '/token_email/add', dt)
                .then(async (response1) => {
                  console.log('response1', response1.data.status)
                  if (response1.data.status) {
                    let dt = {
                      email: response.data[0].userName,
                      status: 'forgot',
                      token: token
                    }
                    await axios
                      .post(
                        'https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Welcome-sendMail',
                        dt
                      )
                      .then(async (response) => {
                        this.dialog = false
                        this.$swal(
                          'เรียบร้อย',
                          'กรุณาตรวจสอบ Email ของท่าน',
                          'success'
                        )
                        // location.reload()
                        this.form.newUserName = ''
                      })
                  } else {
                    this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
                    this.form.newUserName = ''
                  }
                })
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
