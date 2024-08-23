<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <v-dialog v-model="dialogHistory" persistent fullscreen scrollable style="background-color: #FFFFFF;">
        <!-- <v-app-bar app  fixed hide-on-scroll style="height: 70px;">
          <v-row style="" class="mb-2 mt-2 pa-2">
          <v-col cols="2" style="display: flex;justify-content: flex-start;">
            <v-icon x-large color="#007bff" @click="dialogHistory = false">mdi-chevron-left</v-icon>
          </v-col>
          <v-col cols="7" style="word-wrap: break-word;display: flex;justify-content: center;align-items: center;">
            <p class="mt-1 mb-0 font-weight-bold" style="font-size: 16px;">{{session.data.userFirst_NameTH}}</p>
          </v-col>
          <v-col cols="3" class="pl-0 pr-4 mt-3" style="display: flex;justify-content: flex-end;">
              <v-avatar v-if="empData[0].empImge" color="#007bff">
                <img
                  :src="empData[0].empImge"
                >
              </v-avatar>
              <v-avatar v-else color="#007bff">
                <v-icon dark>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
          </v-col>
        </v-row>
        </v-app-bar> -->
       <v-card class="pa-3" rounded  style="background: #FFFFFF;">
        <v-card-title>
            <v-row style="border-bottom: outset;border-color: #ffffff52;" class="mb-2">
            <v-col cols="2" style="display: flex;justify-content: flex-start;">
              <v-icon x-large color="#007bff" @click="dialogHistory = false">mdi-chevron-left</v-icon>
            </v-col>
            <v-col cols="7" style="word-wrap: break-word;display: flex;justify-content: center;align-items: center;">
              <div v-if="session.data.userFirst_NameTH">
                <p class="mt-1 mb-0 font-weight-bold" v-if="session.data.userFirst_NameTH.length > 20" style="font-size: 16px;">{{session.data.userFirst_NameTH.substring(0, 20)}}...</p>
                <p class="mt-1 mb-0 font-weight-bold" v-else style="font-size: 16px;">{{session.data.userFirst_NameTH}}</p>
              </div>
              <p class="mt-1 mb-0 font-weight-bold" v-else style="font-size: 16px;">ADMIN</p>
            </v-col>
            <v-col cols="3" class="pl-0 pr-4" style="display: flex;justify-content: flex-end;">
                <v-avatar v-if="empData[0]" color="#007bff">
                  <img
                    :src="empData[0].empImge"
                  >
                </v-avatar>
                <v-avatar v-else color="#007bff">
                  <v-icon dark>
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <div class="mb-3" v-for="(item, index) in history" :key="index">
            <div v-if="index === 0" style="display:flex;justify-content: center;">
              <p
              style="font-size: 14px;color: #000000;"
              class="text-center mr-1 ma-0 my-3">
              {{item.CREATE_DATEchatStory}}
              </p>
            </div>
            <div v-if="(index > 0) && item.CREATE_DATEchatStory !== history.filter((itemfil, i) => i === (index-1))[0].CREATE_DATEchatStory" style="display:flex;justify-content: center;">
              <p
              style="font-size: 14px;color: #000000;"
              class="text-center mr-1 ma-0 my-3">
              {{item.CREATE_DATEchatStory}}
              </p>
          </div>
          <div v-if="item.Message" class="mb-2" :style="'display: flex;justify-content: flex-start;align-items: flex-end;' + ((item.from === 'admin') ? 'flex-direction: column;flex-direction: row-reverse;' : '')">
            <!-- <p style="font-size: 12px;" class="mr-1 ma-0  font-weight-bold">{{item.CREATE_DATEtime}}</p> -->
            <div v-if="item.Message" color="#007bff" class="pa-2 pl-4 ml-3" max-width="auto" :style="'word-break: break-word; background-color:#007bff;min-width: 60px;text-align: left;'+((item.from === 'admin') ? 'border-radius: 20px 20px 0px 20px;' : 'border-radius: 20px 20px 20px 0px;')">
              <p style="color:#FFFFFF" class="ma-0">{{item.Message}}</p>
            </div>
            <p  style="font-size: 12px;" :class="((item.from === 'admin') ? 'mr-1' : 'ml-3') + ' ma-0 font-weight-regular'">{{item.CREATE_DATEtime}}</p>
          </div>
          <div v-if="item.Img" class="mb-2" :style="'display: flex;justify-content: flex-start;'+ ((item.from === 'admin') ? 'flex-direction: column;align-items: flex-end;flex-direction: row-reverse;' : '')">
            <!-- <p style="font-size: 12px;" class="mr-1 ma-0  font-weight-bold">{{item.CREATE_DATEtime}}</p> -->
            <!-- <v-card v-if="item.Message" color="#007bff" class="pa-2 ml-5" max-width="auto" style="word-break: break-word;">
              <p style="color:#FFFFFF" class="ma-0">{{item.Message}}</p>
            </v-card> -->
          <!-- <v-card v-if="item.Img" class="pa-0 ml-8 mt-2" max-width="auto" > -->
            <!-- <p style="font-size: 12px;" class="mr-1 ma-0  font-weight-bold">{{item.CREATE_DATEtime}}</p> -->
            <v-img
                  v-if="item.Img"
                  class="text-center mt-2 ml-3"
                  max-width="150"
                  :src="item.Img"
                  @click="SelectImg(item.Img)"
                ></v-img>
          <!-- </v-card> -->
            <p style="font-size: 12px;" class="mr-1 ma-0 font-weight-regular">{{item.CREATE_DATEtime}}</p>
          </div>
        </div>
        </v-card-text>
        <v-card-action style="border-top-style: groove;" class="mt-1">
          <v-col cols="12" class="text-center py-0">
            <v-file-input
            style="display: none;"
              class="mt-6 mb-6"
              id="fileUpload"
              hide-input
              required
              counter
              show-size
              outlined
              accept="image/png, image/jpeg, image/bmp"
              label="อัพโหลดรูปภาพ"
              @change="selectImgCoverUpdate"
              v-model="filesUpdateImgCover"
            ></v-file-input>
            <div v-if="formMessage.Img" style="display:flex;justify-content: center;" class="pa-3">
              <div style="width:200px;">
                  <v-img
                  class="pa-3 text-center"
                  contain
                  max-height="150px"
                  max-width="200px"
                  :src="formMessage.Img"
                  ></v-img>
              </div>
              <div>
                <v-icon class="mb-10" style="font-size:50px;position: absolute;" @click="formMessage.Img = ''" color="red">mdi-close-circle</v-icon>
              </div>
            </div>
            <v-textarea
              background-color="rgb(244 244 244)"
              v-model="formMessage.Message"
              class="mx-2 pt-4"
              filled
              auto-grow
              dense
              solo
              elevation="0"
              label="Type message"
              rows="1"
              row-height="20"
              style="margin-top: 10px;box-shadow: none !important;"
            >
            <template v-slot:prepend>
              <v-icon large  class="mx-2 mb-1 mt-n2" @click="refUpload()" color="#007bff">mdi-image</v-icon>
            </template>
            <template v-slot:append-outer>
              <v-icon large  class="mx-2 mb-1 mt-n2" @click="sendMessage()" color="#007bff">mdi-send</v-icon>
            </template>
          </v-textarea>
          </v-col>
        </v-card-action>
        <!-- <v-row style="position:fixed; border-bottom: outset;border-color: #ffffff52;" class="mb-2">
          <v-col cols="2" style="display: flex;justify-content: flex-start;">
            <v-icon x-large color="#007bff" @click="dialogHistory = false">mdi-chevron-left</v-icon>
          </v-col>
          <v-col cols="7" style="word-wrap: break-word;display: flex;justify-content: center;align-items: center;">
            <p class="mt-1 mb-0 font-weight-bold" style="font-size: 16px;">{{session.data.userFirst_NameTH}}</p>
          </v-col>
          <v-col cols="3" class="pl-0 pr-4" style="display: flex;justify-content: flex-end;">
              <v-avatar v-if="empData[0].empImge" color="#007bff">
                <img
                  :src="empData[0].empImge"
                >
              </v-avatar>
              <v-avatar v-else color="#007bff">
                <v-icon dark>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
          </v-col>
        </v-row> -->
        <!-- <div class="mb-3" v-for="(item, index) in history" :key="index">
            <div v-if="index === 0" style="display:flex;justify-content: center;">
              <p
              style="font-size: 14px;color: #000000;"
              class="text-center mr-1 ma-0 my-3">
              {{item.CREATE_DATEchatStory}}
              </p>
            </div>
            <div v-if="(index > 0) && item.CREATE_DATEchatStory !== history.filter((itemfil, i) => i === (index-1))[0].CREATE_DATEchatStory" style="display:flex;justify-content: center;">
              <p
              style="font-size: 14px;color: #000000;"
              class="text-center mr-1 ma-0 my-3">
              {{item.CREATE_DATEchatStory}}
              </p>
          </div>
          <div v-if="item.Message" class="mb-2" style="display: flex;justify-content: flex-start;flex-direction: column;align-items: flex-end;flex-direction: row-reverse;">
            <div v-if="item.Message" color="#007bff" class="pa-2 ml-3" max-width="auto" style="word-break: break-word; background-color:#007bff ;border-radius: 20px 20px 0px 20px;;min-width: 60px;text-align: center;">
              <p style="color:#FFFFFF" class="ma-0">{{item.Message}}</p>
            </div>
          <p  style="font-size: 12px;" class="mr-1 ma-0 font-weight-regular">{{item.CREATE_DATEtime}}</p>
          </div>
          <div v-if="item.Img" class="mb-2" style="display: flex;justify-content: flex-start;flex-direction: column;align-items: flex-end;flex-direction: row-reverse;">
            <v-img
                  v-if="item.Img"
                  class="text-center mt-2 ml-3"
                  max-height="100"
                  max-width="150"
                  :src="item.Img"
                  @click="SelectImg(item.Img)"
                ></v-img>
          <p style="font-size: 12px;" class="mr-1 ma-0 font-weight-regular">{{item.CREATE_DATEtime}}</p>
          </div>
        </div> -->
        <!-- <v-footer padless fixed color="#FFFFFF" style="border-top: outset;">
          <v-col cols="12" class="text-center py-0 mt-3">
            <v-file-input
            style="display: none;"
              class="mt-6 mb-6"
              id="fileUpload"
              hide-input
              required
              counter
              show-size
              outlined
              accept="image/png, image/jpeg, image/bmp"
              label="อัพโหลดรูปภาพ"
              @change="selectImgCoverUpdate"
              v-model="filesUpdateImgCover"
            ></v-file-input>
            <div v-if="formMessage.Img" style="display:flex;justify-content: center;" class="pa-3">
              <div style="width:200px;">
                  <v-img
                  class="pa-3 text-center"
                  contain
                  max-height="150px"
                  max-width="200px"
                  :src="formMessage.Img"
                  ></v-img>
              </div>
              <div>
                <v-icon class="mb-10" style="font-size:50px;position: absolute;" @click="formMessage.Img = ''" color="red">mdi-close-circle</v-icon>
              </div>
            </div>
            <v-textarea
              background-color="rgb(244 244 244)"
              v-model="formMessage.Message"
              class="mx-2 pt-2"
              filled
              auto-grow
              dense
              solo
              elevation="0"
              label="Type message"
              rows="1"
              row-height="20"
              style="margin-top: 5px;box-shadow: none !important;"
            >
            <template v-slot:prepend>
              <v-icon large  class="mx-2 mb-1" @click="refUpload()" color="#007bff">mdi-image</v-icon>
            </template>
            <template v-slot:append-outer>
              <v-icon large  class="mx-2 mb-1" @click="sendMessage()" color="#007bff">mdi-send</v-icon>
            </template>
          </v-textarea>
          </v-col>
        </v-footer> -->
       </v-card>
      </v-dialog>
      <v-dialog
      v-model="dialogImg"
      max-width="100%"
    >
      <v-card>
        <v-img
          :lazy-src="showImg"
          :src="showImg"
        ></v-img>
      </v-card>
    </v-dialog>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
  },
  data () {
    return {
      shopId: this.$session.getAll().data.shopId,
      session: this.$session.getAll(),
      history: [],
      empData: [],
      dialogHistory: false,
      dialogImg: false,
      showImg: '',
      filesUpdateImgCover: null,
      jobNo: null,
      userId: null,
      formMessage: {
        jobNo: '',
        Message: '',
        Img: '',
        empId: '',
        CREATE_USER: '',
        LAST_USER: '',
        shopId: ''
      }
    }
  },
  async mounted () {
    // this.getRating()
  },
  methods: {
    async getChatHistory (item) {
      console.log('item', item)
      this.jobNo = item.jobNo
      this.userId = item.userId
      console.log(this.userId)
      await this.getData()
      await this.getEmp()
      await this.setMessage(item)
      this.dialogHistory = true
    },
    test () {
      console.log('test')
    },
    async getData () {
      this.history = []
      await axios
        .get(this.DNS_IP + '/PushMessage_LOG/get?shopId=' + this.shopId + '&jobNo=' + this.jobNo).then((response) => {
          let rs = response.data
          if (rs.length > 0) {
            this.history = rs.reverse()
            rs.map((row) => {
              console.log(row['CREATE_DATE'])
              let timestamp = new Date(row['CREATE_DATE'])
              row['from'] = 'admin'
              row['timestamp'] = timestamp.getTime()
              return row
            })
            // this.dialogHistory = true
          }
        }).catch((error) => {
          console.log('error function addData : ', error)
        })

      if (this.shopId === 'U9f316c85400fd716ea8c80d7cd5b61f8') {
        const params = {
          userId: this.userId
        }
        await axios
          .post('https://joyridegetmessage-2nzdbsglia-an.a.run.app', params).then((response) => {
            let rs = response.data.data
            if (rs.length > 0) {
              rs.map((row) => {
                row['from'] = 'user'
                row['Message'] = ''
                if (row.message.type === 'text') {
                  row['Message'] = row.message.text
                } else {
                  row['Img'] = row.message.publicUrl
                }
                let timestamp = new Date(row['timestamp'])
                row['timestamp'] += 25200000
                row['CREATE_DATEtime'] = timestamp.getHours() + ':' + timestamp.getMinutes()
                this.history.push(row)
                return row
              })
            }
          }).catch((error) => {
            console.log('error function addData : ', error)
          })
        this.history.sort((a, b) => a.timestamp - b.timestamp)
      }
    },
    async getEmp () {
      let path = ''
      if (this.session.data.empId) {
        path = '/empSelect/get?empId=' + this.session.data.empId
      } else {
        path = '/empSelect/get?shopId=' + this.session.data.shopId
      }
      console.log('path', path)
      await axios
        .get(this.DNS_IP + path).then((response) => {
          let rs = response.data
          if (rs.length > 0) {
            if (rs.length === 1) {
              this.empData = rs
            } else if (rs.length > 1) {
              let s = {}
              s.userFirst_NameTH = 'Admin'
              s.empId = 0
              this.empData.push(s)
            }
            this.empData = rs
          }
          console.log('show', this.empData)
        }).catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    setMessage (item) {
      console.log('itemsetMessage', item)
      console.log('this.session.data', this.session.data)
      this.formMessage.jobNo = this.jobNo
      this.formMessage.empId = parseInt(this.session.data.empId) || 0
      this.formMessage.LAST_USER = this.session.data.userName
      this.formMessage.CREATE_USER = this.session.data.userName
      this.formMessage.shopId = this.shopId
      console.log('his.formMessage', this.formMessage)
    },
    clearMessage () {
      this.formMessage.jobNo = ''
      this.formMessage.empId = ''
      this.formMessage.Img = ''
      this.formMessage.Message = ''
      this.formMessage.LAST_USER = ''
      this.formMessage.CREATE_USER = ''
      this.filesUpdateImgCover = null
    },
    async sendMessage () {
      console.log('formMessage', this.formMessage)
      let replaceMessage = this.formMessage.Message || ''
      this.formMessage.Message = replaceMessage.replace(/%/g, '%%').replace(/'/g, "\\'")
      if (this.formMessage.Message !== '' || this.formMessage.Img !== '') {
        this.$swal({
          title: 'คุณต้องการ ส่งข้อความ ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#F38383',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async response => {
          if (this.filesUpdateImgCover) {
            const _this = this
            let params = new FormData()
            let configDepositUpload = {
              headers: {
                'jobNo': this.formMessage.jobNo
              }
            }
            params.append('file', this.filesUpdateImgCover)
            await axios
              .post(this.DNS_IP + `/file/upload/MessageImg`, params, configDepositUpload)
              .then(function (response) {
                _this.formMessage.Img = response.data
                console.log('url Pic', response.data)
              })
          } else {
            this.formMessage.Img = this.filesUpdateImgCover
          }
          await axios.post(this.DNS_IP + '/PushMessage_LOG/add', this.formMessage)
            .then(async (response) => {
              console.log('response', response)
              this.formMessage.Message = replaceMessage
              await this.pushMessage()
              await this.clearMessage()
              await this.getData()
              await this.setMessage()
              // this.dialogMessage = false
            }).catch(error => {
              console.log('error function addData : ', error)
            })
        })
      } else {
        this.$swal('ผิดพลาด', 'โปรดระบุ ข้อความ หรือ รูปภาพ', 'error')
      }
    },
    async pushMessage () {
      await axios.post(this.DNS_IP + '/job/MessageRider/' + this.formMessage.jobNo, this.formMessage)
        .then(response => {
          console.log('response', response)
        }).catch(error => {
          console.log('error function addData : ', error)
        })
    },
    selectImgCoverUpdate () {
      console.log('filesUpdateImgCover', this.filesUpdateImgCover)
      if (this.filesUpdateImgCover) {
        this.formMessage.Img = URL.createObjectURL(
          this.filesUpdateImgCover
        )
      } else {
        this.formMessage.Img = ''
      }
      console.log('testttttttttt', this.formMessage.Img)
    },
    refUpload () {
      console.log('RR')
      let fileUpload = document.getElementById('fileUpload')
      if (fileUpload != null) {
        fileUpload.click()
      }
    },
    async SelectImg (Imgitem) {
      this.showImg = Imgitem
      this.dialogImg = true
    }
  }
}
</script>
<style scope>
.v-application--is-ltr .v-timeline--dense:not(.v-timeline--reverse):before, .v-application--is-rtl .v-timeline--reverse.v-timeline--dense:before {
    right: auto !important;
    left: 28px !important;
}
.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)>.v-input__control>.v-input__slot {
    /* -webkit-box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%); */
    /* box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%); */
    box-shadow: none !important;
}
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
.bubble {
    position: relative;
    background: #2761bb;
    color: #ffffff;
    font-family: Arial;
    line-height: 40px;
    text-align: center;
    border-radius: 10px;
    padding: 0px;
    width: fit-content;
    height: auto;
    padding: 10px;
}
.chat:after {
  content: '';
    position: absolute;
    display: block;
    width: 0;
    z-index: 1;
    border-style: solid;
    border-width: 28px 0 0 19px;
    border-color: transparent transparent transparent #ffffff;
    top: 77%;
    right: -19px;
    margin-top: -14px;
}
</style>
