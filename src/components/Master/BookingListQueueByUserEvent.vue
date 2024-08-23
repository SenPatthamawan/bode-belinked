<template>
  <v-main class="main">
    <div class="d-flex flex-column flex-sm-row mx-5 my-sm-5 my-2">
      <div class="col-12 col-sm-12 col-md-6">
        <v-card flat v-if="!overlay">
            <v-card-text>
               <div class="text-center">
                <waitingAlert></waitingAlert>
              </div>
            </v-card-text>
        </v-card>
        <v-card class="p-3 p-md-5 main-card" v-if="overlay">
        <div class="d-flex flex-column">
          <div class="d-flex flex-row d-flex justify-content-between">
            <div><h5 class="font-weight-bold m-0" >Counter {{$session.getAll().data.empFirst_NameTH}}</h5></div>
            <div class="d-flex flex-sm-row">
              <div class="d-flex flex-row align-items-center mr-3" v-if="branchName !== ''">
                <div class="mr-1"><v-icon  color="red">mdi-map-marker</v-icon></div>
                <div><span class="text-main">{{branchName }}</span></div>
              </div>
              <div class="d-flex flex-row align-items-center mr-3">
                <div class="mr-1"><v-icon  color="red">mdi-calendar-blank-outline</v-icon></div>
                <div><span class="text-main">{{currentDate }}</span></div>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <v-card class="p-3">
              <div>
                <h5 class="font-weight-bold">เลือกประเภทของบริการ</h5>
              </div>
              <div v-for="(flowitem, index) in flowSelectCheckItem" :key="index">
                <div class="d-flex flex-row justify-content-between align-items-center">
                  <div><span>{{ flowitem.flowNameEn + ' : Type ' + flowitem.storeFrontText }}</span></div>
                  <div><v-switch inset color="success" v-model="flowitem.checked"  @change="UpdatetypeStoreFrontText(flowitem)" /></div>
                </div>
                <v-divider v-if="(index + 1) < flowSelectCheckItem.length" class="m-0"></v-divider>
                 </div>
            </v-card>
          </div>
          <div class="d-flex flex-row justify-content-between align-items-center my-5">
            <div><span class="text-center font-weight-black text-number">{{ callQueue.storeFrontQueue}}</span></div>
            <div>
              <v-btn
                @click="closeJobSubmit()"
                :disabled="callQueue !== null && (callQueue.status === 'confirm' || callQueue.status === 'againqQueue') ? false : true"
                dark
                :class="`rounded-btn justify-content-center align-items-center ${callQueue !== null && (callQueue.status === 'confirm' || callQueue.status === 'againqQueue')  ? 'rounded-btn-confirm':'rounded-btn-closejob'}`">
                <div class="d-flex flex-column">
                <div><v-icon size="45">mdi-bell-ring</v-icon></div>
                <div><span :class="`text-event ${callQueue !== null && callQueue.status === 'confirm' ? 'text-white' :'text-bell-disabled'}`">เรียกคิว</span></div>
                </div>
            </v-btn>
            </div>
          </div>
          <div class="d-flex flex-row justify-content-between align-items-center">
            <div class="w-100 mr-2">
              <v-btn class="btn-event" color="warning" rounded elevation="1" :disabled="callQueue !== null && (callQueue.status === 'confirm' || callQueue.status === 'confirmJob') ? false : true" @click="removeQueue()">
               <v-icon class="mr-2">mdi-delete</v-icon><span class="text-event">ลบคิว</span> </v-btn></div>
            <div class="w-100 mx-2">
               <v-btn  class="btn-event" color="#1B437C" rounded :disabled="callQueue !== null && callQueue.status === 'confirmJob' ? false : true"
               @click="closeJobSubmitReturn()">
                <strong class="text-white text-event">เรียกคิวซ้ำ</strong>
                </v-btn>
            </div>
            <div class="w-100 ml-2">
              <v-btn class="btn-event" color="#F38383" rounded
              :disabled="callQueue !== null && callQueue.status !== 'confirmJob'"
              @click="backHomeSubmit()">
               <strong class="text-white text-event">ปิดงาน</strong>
               </v-btn>
            </div>
          </div>
        </div>
        </v-card>
    </div>
      <div class="col-12 col-sm-12 col-md-6">
        <v-card class="p-4 main-card h-100">
         <div class="d-flex flex-column">
           <div><h3 class="font-weight-black text-center mt-3"> {{ 'จำนวนคิวที่รอ (' + waitingQueue.length + ')' }}</h3></div>
           <div class="pa-1" style="display: flex;flex-wrap: wrap;justify-content: space-around;flex-direction: row;">
            <v-col :cols="resCol === '12' ? '4' : '4'" v-for="(item) in waitingQueue" :key="`waitingQueue-${item}`">
             <h3 class="font-weight-black text-center">{{ item }}</h3>
              </v-col>
          </div>
         </div>
      </v-card>
    </div>
    </div>
    <v-footer fixed padless color="#eeeeee" class="text-center mt-n16"
     style="justify-content: center;">
      <p class="text-black" width="100%">POWERED BY BETASK CONSULTING</p>
    </v-footer>
  </v-main>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import moment from 'moment-timezone'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    waitingAlert
  },
  data () {
    return {
      servicePointItem: [],
      servicePoint: '',
      closeItem: '',
      dialogServicePointStatus: false,
      validSearch: true,
      statusReturn: false,
      itemBooking: [],
      BookingDataList: [],
      overlay: true,
      branchName: '',
      masBranchID: '',
      DataFlowItem: [],
      flowSelect: '',
      dateStart: '',
      dialog: false,
      dialogAdd: false,
      checkRef: false,
      checkStatusEdit: false,
      datawainingShow: [],
      dataReady: false,
      flowSelectCheckItem: [],
      flowSelectCheck: [],
      currentDate: moment().format('DD/MMM/YYYY'),
      callQueue: {},
      waitingQueue: [],
      storeFront: []
    }
  },
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
    }
  },
  created () {
    this.updateDateStart()
  },
  async mounted () {
    await this.beforeCreate()
    await this.getBooking()
  },
  methods: {
    updateDateStart () {
      const update = () => {
        this.dateStart = this.momenDate_1(new Date())
        this.currentDate = moment().format('DD/MMM/YYYY')
        const now = new Date()
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        const msUntilTomorrow = tomorrow - now
        setTimeout(update, msUntilTomorrow)
      }

      update()
    },
    async MyBooking () {
      let fittleConfirmJob = []
      try {
        let empId = parseInt(this.$session.getAll().data.empId) || null
        await axios
          .get(`${this.DNS_IP}/booking_view/getEventQueue?masBranchID=${this.masBranchID}&flowId=${this.$session.getAll().data.flowId}&storeFrontQueueEmpId=${empId}&shopId=${this.$session.getAll().data.shopId}`)
          .then(async response => {
            if (response && response.data) {
              let data = response.data
              if (data && data.length > 0) {
                fittleConfirmJob = data.filter(item => item.status === 'confirmJob' && parseInt(item.storeFrontQueueEmpId) === empId)
              }
            }
          })
      } catch (error) {
        console.log('Error getBooking', error)
      }
      return fittleConfirmJob
    },
    async getBooking () {
      try {
        let flowId = []
        let waitingQueue = []
        if (Array.isArray(this.flowSelectCheck)) {
          this.flowSelectCheck.forEach(text => {
            let storeFront = this.storeFront.filter(a => a.storeFrontText === text)
            if (storeFront && storeFront.length > 0) {
              flowId.push(storeFront[0].flowId)
            }
          })
        }
        if (this.flowSelectCheck && this.flowSelectCheck.length > 0) {
          let empId = parseInt(this.$session.getAll().data.empId) || null
          await axios
            .get(`${this.DNS_IP}/booking_view/getEventQueue?masBranchID=${this.masBranchID}&flowId=[${flowId}]&storeFrontQueueEmpId=${empId}&shopId=${this.$session.getAll().data.shopId}`)
            .then(async response => {
              if (response && response.data) {
                let data = response.data
                if (data.status === false) {
                  this.callQueue = {
                    bookNo: '',
                    storeFrontQueue: 'XXXX',
                    status: 'no have type',
                    audioFileId: null,
                    storeFrontQueueEmpId: null
                  }
                  waitingQueue = []
                  return
                }
                if (data && data.length > 0) {
                  const fittleConfirmJob = await this.MyBooking()
                  if (fittleConfirmJob && fittleConfirmJob.length > 0) {
                    this.callQueue = {
                      bookNo: fittleConfirmJob[0].bookNo,
                      storeFrontQueue: fittleConfirmJob[0].storeFrontQueue,
                      status: 'confirmJob',
                      audioFileId: fittleConfirmJob[0].audioFileId,
                      storeFrontQueueEmpId: parseInt(fittleConfirmJob[0].storeFrontQueueEmpId)
                    }
                  } else {
                    let fittleDataConfirm = data.filter(a => a.status === 'confirm')
                    if (fittleDataConfirm.length > 0) {
                      this.callQueue = {
                        bookNo: fittleDataConfirm[0].bookNo,
                        storeFrontQueue: fittleDataConfirm[0].storeFrontQueue,
                        status: fittleDataConfirm[0].status,
                        audioFileId: fittleDataConfirm[0].audioFileId,
                        storeFrontQueueEmpId: parseInt(fittleDataConfirm[0].storeFrontQueueEmpId)
                      }
                    } else {
                      this.callQueue = {
                        bookNo: '',
                        storeFrontQueue: 'XXXX',
                        status: 'no have type',
                        audioFileId: null,
                        storeFrontQueueEmpId: null
                      }
                    }
                  }
                  response.data.filter(item => item.status === 'confirm').forEach(queue => {
                    waitingQueue.push(queue.storeFrontQueue)
                  })
                }
              }
            })
        } else {
          this.callQueue = {
            bookNo: '',
            storeFrontQueue: 'XXXX',
            status: 'no have type',
            storeFrontQueueEmpId: null
          }
        }
        this.waitingQueue = waitingQueue
      } catch (error) {
        console.log('Error getBooking', error)
      }
    },
    async getBookingOnlyWait () {
      try {
        let flowId = []
        let waitingQueue = []
        this.flowSelectCheck.forEach(text => {
          let storeFront = this.storeFront.filter(a => a.storeFrontText === text)
          if (storeFront && storeFront.length > 0) {
            flowId.push(storeFront[0].flowId)
          }
        })
        await axios
          .get(`${this.DNS_IP}/booking_view/getEventQueue?masBranchID=${this.masBranchID}&flowId=[${flowId}]&storeFrontQueueEmpId=${this.$session.getAll().data.empId}&shopId=${this.$session.getAll().data.shopId}`)
          .then(async response => {
            if (response && response.data) {
              let data = response.data
              if (data.status === false) {
                waitingQueue = []
                return
              }
              if (data && data.length > 0) {
                let empId = parseInt(this.$session.getAll().data.empId) || null
                let update = response.data.filter(itemUpdate => itemUpdate.status === 'confirmJob' && parseInt(itemUpdate.storeFrontQueueEmpId) === empId)
                if (update && update.length > 0) {
                  this.callQueue = {
                    bookNo: update[0].bookNo,
                    storeFrontQueue: update[0].storeFrontQueue,
                    status: update[0].status,
                    audioFileId: update[0].audioFileId,
                    storeFrontQueueEmpId: null
                  }
                }
                response.data.filter(item => item.status === 'confirm').forEach(queue => {
                  waitingQueue.push(queue.storeFrontQueue)
                })
              }
            }
          })
        this.waitingQueue = waitingQueue
      } catch (error) {
        console.log('Error getBookingOnlyWait', error)
      }
    },
    async UpdatetypeStoreFrontText (flowitem) {
      this.flowSelectCheck = this.flowSelectCheck || []
      if (flowitem.checked) {
        if (this.flowSelectCheck) {
          if (!this.flowSelectCheck.includes(flowitem.storeFrontText)) {
            this.flowSelectCheck.push(flowitem.storeFrontText)
          }
        } else {
          this.flowSelectCheck.push(flowitem.storeFrontText)
        }
      } else {
        const index = this.flowSelectCheck.indexOf(flowitem.storeFrontText)
        if (index > -1) {
          this.flowSelectCheck.splice(index, 1)
        }
      }
      let dataSession = this.$session.get('data')
      dataSession.typeStoreFrontText = JSON.stringify(this.flowSelectCheck)
      this.$session.set('data', dataSession)
      localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
      let obj = {
        'typeStoreFrontText': JSON.stringify(this.flowSelectCheck)
      }
      // if (this.callQueue.status !== 'confirmJob') {
      this.getBooking()
      // } else {
      //  this.getBookingOnlyWait()
      //  }
      this.updateSYS_USER(this.$session.getAll().data.userId, obj)
    },
    async updateSYS_USER (id, obj) {
      await axios
        .post(this.DNS_IP + '/system_user/edit/' + id, obj)
        .then(async responses => { console.log('updateSYS_USER', responses) })
        .catch((error) => { console.log(error) })
    },
    async getFirestore () {
      this.firestore = this.$firebase.firestore()
      const FieldPath = this.$firebase.firestore.FieldPath
      this.firestore.collection('EventProcess')
        .where(FieldPath.documentId(), '==', this.$session.getAll().data.userName)
        .onSnapshot((snapshot) => {
          if (snapshot.empty) {
            this.updateProcessOhrichUpdate()
          } else {
            snapshot.docChanges().forEach(async (change) => {
              if (change.doc.data().active === '1') {
                await this.getBooking()
                this.updateProcessOhrichUpdate()
              }
            })
          }
        })
    },
    updateProcessOhrichUpdate () {
      let params = {
        userName: this.$session.getAll().data.userName,
        masBranchID: this.$session.getAll().data.masBranchID
      }
      axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Event-ProcessUseNew', params)
    },
    async resetFirebaseUse () {
      let params = {
        userName: this.$session.getAll().data.userName,
        masBranchID: this.$session.getAll().data.masBranchID
      }
      await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Event-ProcessNew', params)
    },
    async removeQueue () {
      if (this.callQueue.status === 'confirmJob' || this.callQueue.status === 'confirm') {
        let body = {
          bookNo: this.callQueue.bookNo,
          contactDate: this.format_date(new Date()),
          status: 'cancel',
          statusUse: 'use',
          shopId: this.$session.getAll().data.shopId,
          CREATE_USER: this.$session.getAll().data.userName,
          LAST_USER: this.$session.getAll().data.userName,
          remarkRemove: 'เนื่องจากลูกค้าไม่มาตามคิวที่เลือก'
        }
        await axios
          .post(`${this.DNS_IP}/booking_transaction/addOhrich`, body)
      } else {
        this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
      }
      this.callQueue = {
        bookNo: null,
        storeFrontQueue: 'XXXX',
        status: 'removeQueue',
        audioFileId: null
      }
      this.resetFirebaseUse()
    },
    async checkSession () {
      if (!this.$session.exists()) {
        this.$router.push('/Core/Login')
      } else {
        if (this.$session.getAll().data.shopId) {
          localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
          await this.getDataBranch()
          await this.getDataFlow()
          await this.getFirestore()
        } else {
          this.$router.push('/Core/Login')
        }
      }
    },
    async beforeCreate () {
      if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
        if (JSON.parse(localStorage.getItem('sessionData')).shopId) {
          this.$session.start()
          this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
          await this.getDataBranch()
          await this.getDataFlow()
          await this.getFirestore()
        } else {
          this.$router.push('/Core/Login')
        }
      } else {
        await this.checkSession()
      }
    },
    dial: function (number) {
      window.location = 'tel:' + number
    },
    async getDataFlow () {
      let resultOption = []
      let flowSelectCheckItem = []
      let typeStoreFrontTextValues = this.$session.getAll().data.typeStoreFrontText ? JSON.parse(this.$session.getAll().data.typeStoreFrontText) : null
      this.storeFront = []
      await axios
        .get(this.DNS_IP + `/flow/get?shopId=${this.$session.getAll().data.shopId}&storeFrontCheck=True&masBranchIDAll=${this.masBranchID}`)
        .then(response => {
          let rs = response.data
          let sessionFlowIds = JSON.parse(this.$session.getAll().data.flowId)
          let filteredResults = rs.filter(flowData => sessionFlowIds.includes(flowData.flowId))
          for (let itemFlow of filteredResults) {
            let isChecked = true
            if (typeStoreFrontTextValues) {
              isChecked = typeStoreFrontTextValues.includes(itemFlow.storeFrontText)
            } else {
              isChecked = false
            }
            this.storeFront.push({ flowId: itemFlow.flowId, storeFrontText: itemFlow.storeFrontText })
            flowSelectCheckItem.push({ flowNameEn: itemFlow.flowNameEn, storeFrontText: itemFlow.storeFrontText, checked: isChecked })
            resultOption.push({ text: itemFlow.flowName, value: itemFlow.flowId, allData: itemFlow })
          }
          this.flowSelectCheckItem = flowSelectCheckItem.length > 0 ? flowSelectCheckItem : []
          this.flowSelectCheck = typeStoreFrontTextValues

          this.DataFlowItem = resultOption
          if (resultOption.length === 1) {
            this.flowSelect = this.DataFlowItem[0].value
          } else if (resultOption.length > 1) {
            this.flowSelect = 'allFlow'
          }
        }).catch(error => {
          this.DataFlowItem = []
          console.log('catch getDataFlow : ', error)
        })
    },
    async getDataBranch () {
      try {
        this.masBranchID = this.$session.getAll().data.masBranchID
        await axios
          .get(`${this.DNS_IP}/master_branch/get?shopId=` + `${this.$session.getAll().data.shopId}&masBranchID=${this.masBranchID}`)
          .then(response => {
            let data = response.data.filter(branch => branch.masBranchID === this.masBranchID)
            if (data && data.length > 0) {
              this.branchName = data[0].masBranchName
            }
          }).catch(error => {
            console.log('catch getDataBranch : ', error)
          })
      } catch (error) {
        console.log('error getDataBranch', error)
      }
    },
    async closeJobSubmitReturn () {
      try {
        if (this.callQueue.status === 'confirmJob') {
          this.reCallNoti(this.callQueue.audioFileId)
          await axios
            .post(`${this.DNS_IP}/Booking/pushMsgQueueReturnOhrich/${this.callQueue.bookNo}`, { checkGetQueue: 'True' })
            .then(async responses => {}).catch(error => {
              console.log('error function pushMsgQueueReturnOhrich : ', error)
            })
          await this.resetFirebaseUse()
        }
      } catch (error) {
        console.log('Error closeJobSubmitReturn', error)
      }
    },
    async backHomeSubmit () {
      if (this.callQueue.status === 'confirmJob') {
        let body = {
          bookNo: this.callQueue.bookNo,
          contactDate: this.format_date(new Date()),
          status: 'closeJob',
          statusUse: 'use',
          shopId: this.$session.getAll().data.shopId,
          CREATE_USER: this.$session.getAll().data.userName,
          LAST_USER: this.$session.getAll().data.userName
        }
        await axios
          .post(`${this.DNS_IP}/booking_transaction/addOhrich`, body)
          .then(async responses => {}).catch(error => {
            console.log('catch getBookingDataList : ', error)
          })
        this.storeFrontQueue = 'XXXX'
        this.callQueue.status = 'closeJob'
        await this.resetFirebaseUse()
      } else {
        this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
      }
    },
    async closeJobSubmit () {
      try {
        if (this.callQueue.status === 'confirm') {
          let body = {
            bookNo: this.callQueue.bookNo,
            contactDate: this.format_date(new Date()),
            status: 'confirmJob',
            statusUse: 'use',
            pageStatus: 'wait',
            limitBookingCount: 1,
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.$session.getAll().data.shopId,
            LAST_USER: this.$session.getAll().data.shopId,
            packageId: '',
            tokenPackage: '',
            storeFrontQueueEmpId: parseInt(this.$session.getAll().data.empId),
            servicePoint: this.$session.getAll().data.empFirst_NameTH
          }
          this.callQueue.status = 'confirmJob'
          await axios
            .post(`${this.DNS_IP}/booking_transaction/addOhrich`, body)
            .then(async res => {
              if (res.data.status) {
                await this.CallNoti()
                let dtt = {
                  checkGetQueue: 'True'
                }
                await axios
                  .post(this.DNS_IP + '/Booking/pushMsgQueueEvent/' + body.bookNo, dtt)
                  .then(async responses => {}).catch(error => {
                    console.log('error function pushMsgQueueEvent : ', error)
                  })
              } else {
                this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
              }
              await this.resetFirebaseUse()
            })
        }
      } catch (error) {
        console.log('error closeJobSubmit', error)
      }
    },
    async closeJob (item) {
      var dtt = {
        bookNo: item.bookNo,
        contactDate: this.format_date(new Date()),
        status: 'confirmJob',
        statusUse: 'use',
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/booking_transaction/addOhrich', dtt)
        .then(async responses => {
          let checkresponses = responses.data
          if (checkresponses.status === true) {
            await this.CallNoti(item)
            let lineUserId = item.lineUserId || ''
            if (lineUserId !== '') {
              let dtt = {
                checkGetQueue: 'True'
              }
              await axios
                .post(this.DNS_IP + '/Booking/pushMsgQueueOhrich/' + item.bookNo, dtt)
                .then(async responses => {}).catch(error => {
                  console.log('error function pushMsgQueueOhrich : ', error)
                })
            }
            // this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
            await this.resetFirebaseUse()
          }
          await this.getBooking()
        })
    },
    async updateServicePoint (bookNo) {
      try {
        var body = {
          servicePoint: this.servicePoint
        }
        await axios
          .post(this.DNS_IP + '/Booking/edit/' + bookNo, body)
          .then(async responses => {})
      } catch (error) {
        console.log('error updateServicePoint', error)
      }
    },
    async checkBookingStatus (bookNo) {
      let result = ''
      await axios
        .get(this.DNS_IP + '/booking_view/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&bookNo=' + bookNo)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            result = rs[0].statusBt || ''
          } else {
            result = ''
          }
        })
      return result
    },
    async updateEmp (bookNo, status) {
      let result = ''
      var body = {
        storeFrontQueueEmpId: parseInt(this.$session.getAll().data.empId),
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(`${this.DNS_IP}/Booking/editQueueEmp/${bookNo}?status=${status}`, body)
        .then(async response => {
          let rs = response.data
          result = rs.status
        })
      return result
    },
    async CallNoti () {
      let body = {
        bookNo: this.callQueue.bookNo,
        servicePoint: this.$session.getAll().data.empFirst_NameTH,
        shopId: this.$session.getAll().data.shopId,
        storeFrontQueue: this.callQueue.storeFrontQueue,
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(`${this.DNS_IP}/callQueues/add`, body)
        .then(async responses => {})
    },
    async reCallNoti (audioFileId) {
      try {
        let body = {
          statusNotify: 'False',
          servicePoint: this.$session.getAll().data.empFirst_NameTH,
          LAST_USER: this.$session.getAll().data.userName
        }
        await axios
          .post(this.DNS_IP + '/callQueues/edit/' + audioFileId, body)
      } catch (error) {
        console.log('reCallNoti', error)
      }
    }
  }
}
</script>
<style scoped>
.main {
  overflow-x: hidden;
  height:100vh;
  background-color: #eeeeee
}
.main-card {
  border-radius: 20px !important;
}
.text-main{
  font-size: 0.9vw;
}
.text-number{
  color:#092C4C;
  font-size: 90px;
}
.btn-event {
  width: 100%;
  height: 45px !important;
}
.text-event{
  font-size: 20px;
  font-weight: bold;
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
.rounded-btn-closejob {
  background: linear-gradient(#DADADA,  #A1A1A1) padding-box, linear-gradient(to right,#DADADA,  #A1A1A1) border-box;
}
.rounded-btn-confirm {
  background: linear-gradient(#25D366,  #23B091) padding-box, linear-gradient(to right,#25D366,  #23B091) border-box;
}
.rounded-btn {
  color: white;
  padding: 10px 20px; /* Adjust padding as needed */
  border: none;
  cursor: pointer;
  /* font-size: 40px; */
  border-radius: 50em;
  width: 140px !important;
  height: 140px !important;
  box-sizing: border-box;
  border: 10px solid transparent;
}
.text-bell{
  width: 100px !important;
}
.text-bell-disabled{
  color: hsla(0,0%,100%,.3)!important;
}
@media (max-width: 600px){
  .text-main {
    font-size: 3vw;
  }
  .text-number {
  font-size: 13vw;
  }
  .text-event{
  font-size: 15px;
  font-weight: bold;
}
}
@media (min-width: 601px) and (max-width: 1300px) {
  .text-main {
    font-size: 1.5vw;
  }
}
  @media (min-width: 1301px) and (max-width: 1500px) {
  .text-main {
    font-size: 1vw;
  }
}
</style>
