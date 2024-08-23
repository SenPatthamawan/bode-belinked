<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs
          class="pl-0 pb-10"
          :items="breadcrumbs"
          divider=">"
        ></v-breadcrumbs>
        <v-row>
          <!-- data table -->
          <v-col v-if="dataReady"  cols="12">
            <v-container>
              <v-stepper v-model="e1">
                <v-stepper-header>
                  <v-stepper-step
                    :complete="e1 > 1"
                    step="1"
                  >
                    Messaging API
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step
                    :complete="e1 > 2"
                    step="2"
                  >
                    LINE Login
                  </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content step="1">
                    <v-card
                      class="mb-12"
                    >
                        <v-container>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12">
                                <v-text-field
                                  v-model="messagingAPIChannelId"
                                  label="Channel ID"
                                  outlined
                                  dense
                                  prepend-inner-icon="mdi-lock"
                                  required
                                  :rules="[rules.required]"
                                >
                                </v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-text-field
                                  v-model="messagingAPIChannelSecret"
                                  label="Channel secret"
                                  outlined
                                  dense
                                  prepend-inner-icon="mdi-lock"
                                  required
                                  :rules="[rules.required]"
                                >
                                </v-text-field>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-container>
                    </v-card>

                    <v-btn
                      color="primary"
                      @click="checkMessaging()"
                    >
                      ต่อไป
                    </v-btn>
                    <v-btn
                      color="warning"
                      @click="gotoManaul('messagingApi')"
                    >
                      <v-icon
                        left
                        dark
                      >
                        mdi-help-circle
                      </v-icon>
                      วิธีได้รับ Channel ID และ Channel secret (Messaging API)
                    </v-btn>
                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <v-card
                      class="mb-12"
                    >
                        <v-container>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12">
                                <v-text-field
                                  v-model="lineLoginChannelId"
                                  label="Channel ID"
                                  outlined
                                  dense
                                  prepend-inner-icon="mdi-lock"
                                  required
                                  :rules="[rules.required]"
                                >
                                </v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-text-field
                                  v-model="lineLoginChannelSecret"
                                  label="Channel secret"
                                  outlined
                                  dense
                                  prepend-inner-icon="mdi-lock"
                                  required
                                  :rules="[rules.required]"
                                >
                                </v-text-field>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-container>
                    </v-card>
                    <v-btn
                      color="error"
                      @click="e1 = 1"
                    >
                      ย้อนกลับ
                    </v-btn>

                    <v-btn
                      v-if="statusGetData"
                      color="primary"
                     @click="checkLineLogin()"
                    >
                      บันทึกข้อมูล
                    </v-btn>
                    <v-btn
                      v-else
                      color="primary"
                     @click="checkLineLoginUpdate()"
                    >
                      แก้ไขข้อมูล
                    </v-btn>
                    <v-btn
                      color="warning"
                      @click="gotoManaul('lineLogin')"
                    >
                      <v-icon
                        left
                        dark
                      >
                        mdi-help-circle
                      </v-icon>
                      วิธีได้รับ Channel ID และ Channel secret (LINE Login)
                    </v-btn>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
              <br>
              <v-alert
                border="bottom"
                colored-border
                type="warning"
                elevation="2"
              >
                เมื่อทำรายการสำเร็จกรุณาเปลี่ยนลิ้งค์นัดหมายใน Rich Menu หรือ โพสโปรโมทใน Social Media ของท่าน
              </v-alert>
            </v-container>
          </v-col>
          <v-col v-else  cols="12">
            <div class="text-center">
              <waitingAlert></waitingAlert>
            </div>
          </v-col>
          <!-- end data table -->
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
// import moment from 'moment' // แปลง date

export default {
  components: {
    waitingAlert,
    'left-menu-admin': adminLeftMenu
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  data () {
    return {
      messagingAPIChannelId: '',
      messagingAPIChannelSecret: '',
      lineLoginChannelId: '',
      lineLoginChannelSecret: '',
      accessToken: '',
      e1: 1,
      statusGetData: true,
      dataReady: true,
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'ตั้งค่ารับการแจ้งเตือนอัตโนมัติ',
          disabled: false,
          href: '/System/LINEConfigSendMessage'
        }
      ],
      rules: {
        required: value => !!value || 'กรุณากรอก.'
      }
    }
  },
  beforeCreate () {
    if (!this.$session.exists()) {
      this.$router.push('/Core/Login')
    }
  },
  async mounted () {
    await this.getData()
  },
  methods: {
    gotoManaul (text) {
      if (text === 'messagingApi') {
        window.open('https://betaskthai.com/messaging_api/', '_blank')
      } else {
        window.open('https://betaskthai.com/create-line-login/', '_blank')
      }
    },
    async getData () {
      this.dataReady = false
      await axios.get(this.DNS_IP + '/lineconfig/get?shopId=' + this.$session.getAll().data.shopId).then((response) => {
        let rs = response.data
        console.log('getData', rs)
        if (rs.status === false) {
          this.statusGetData = true
          this.dataReady = true
        } else {
          this.messagingAPIChannelId = rs[0].messagingAPIChannelId
          this.messagingAPIChannelSecret = rs[0].messagingAPIChannelSecret
          this.lineLoginChannelId = rs[0].lineLoginChannelId
          this.lineLoginChannelSecret = rs[0].lineLoginChannelSecret
          this.statusGetData = false
          this.dataReady = true
        }
      })
    },
    async checkMessaging () {
      if (this.messagingAPIChannelId !== '' && this.messagingAPIChannelSecret !== '') {
        this.dataReady = false
        await axios
          .post(this.DNS_IP + '/line/checkMessagingAPI', {'messagingAPIChannelId': this.messagingAPIChannelId, 'messagingAPIChannelSecret': this.messagingAPIChannelSecret})
          .then(async response => {
            let rs = response.data
            if (rs.status === true) {
              this.e1 = 2
              this.accessToken = rs.accessToken
              this.dataReady = true
            } else {
              this.e1 = 1
              this.accessToken = ''
              this.$swal('ผิดพลาด', 'กรุณาตรวจสอบ Channel ID และ Channel secret ของ Messaging API', 'error')
              this.dataReady = true
            }
          }).catch(error => {
            console.log(error)
            this.$swal('ผิดพลาด', 'กรุณาตรวจสอบ Channel ID และ Channel secret ของ Messaging API', 'error')
            this.dataReady = true
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณากรอก Channel ID และ Channel secret ของ Messaging API ให้ครบ', 'error')
        this.dataReady = true
      }
    },
    async checkLineLogin () {
      if (this.lineLoginChannelId !== '' && this.lineLoginChannelSecret !== '') {
        this.dataReady = false
        let dt = {
          'lineLoginChannelId': this.lineLoginChannelId,
          'lineLoginChannelSecret': this.lineLoginChannelSecret,
          'messagingAPIChannelId': this.messagingAPIChannelId,
          'messagingAPIChannelSecret': this.messagingAPIChannelSecret,
          'shopId': this.$session.getAll().data.shopId,
          'CREATE_USER': this.$session.getAll().data.userName,
          'LAST_USER': this.$session.getAll().data.userName
        }
        await axios
          .post(this.DNS_IP + '/line/createLiffAndAddData', dt)
          .then(async response => {
            let rs = response.data
            if (rs.status === true) {
              this.e1 = 1
              this.getData()
              this.$swal('เรียบร้อย', 'เปิดใช้งานระบบแจ้งเตือนอัตโนมัติเรียบร้อย', 'success')
              this.dataReady = true
            } else {
              this.e1 = 2
              this.$swal('ผิดพลาด', 'กรุณาตรวจสอบ Channel ID และ Channel secret ของ LINE Login', 'error')
              this.dataReady = true
            }
          }).catch(error => {
            console.log(error)
            this.$swal('ผิดพลาด', 'กรุณาตรวจสอบ Channel ID และ Channel secret ของLINE Login', 'error')
            this.dataReady = true
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณากรอก Channel ID และ Channel secret ของ LINE Login ให้ครบ', 'error')
        this.dataReady = true
      }
    },
    async checkLineLoginUpdate () {
      if (this.lineLoginChannelId !== '' && this.lineLoginChannelSecret !== '') {
        this.dataReady = false
        let dt = {
          'lineLoginChannelId': this.lineLoginChannelId,
          'lineLoginChannelSecret': this.lineLoginChannelSecret,
          'messagingAPIChannelId': this.messagingAPIChannelId,
          'messagingAPIChannelSecret': this.messagingAPIChannelSecret,
          'shopId': this.$session.getAll().data.shopId,
          'LAST_USER': this.$session.getAll().data.userName
        }
        await axios
          .post(this.DNS_IP + '/line/createLiffAndUpdate', dt)
          .then(async response => {
            let rs = response.data
            if (rs.status === true) {
              this.e1 = 1
              this.getData()
              this.$swal('เรียบร้อย', 'เปิดใช้งานระบบแจ้งเตือนอัตโนมัติเรียบร้อย', 'success')
              this.dataReady = true
            } else {
              this.e1 = 2
              this.$swal('ผิดพลาด', 'กรุณาตรวจสอบ Channel ID และ Channel secret ของ LINE Login', 'error')
              this.dataReady = true
            }
          }).catch(error => {
            console.log(error)
            this.$swal('ผิดพลาด', 'กรุณาตรวจสอบ Channel ID และ Channel secret ของLINE Login', 'error')
            this.dataReady = true
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณากรอก Channel ID และ Channel secret ของ LINE Login ให้ครบ', 'error')
        this.dataReady = true
      }
    }
  }
}
</script>
<style scope></style>
