<template>
  <v-main  :style="{ backgroundColor: shopColor }">
    <div class="p-4">
      <div class="d-flex flex-row justify-content-between">
        <div>
          <span class="text-white">{{ $session.getAll().data.userFirst_NameTH }}</span>
        </div>
        <div>
          <span class="text-white">{{ currentDate }} </span>
        </div>
      </div>
      <div v-if="loading" class="mt-3">
        <v-card flat>
          <v-card-text>
            <div class="text-center">
              <waitingAlert></waitingAlert>
            </div>
          </v-card-text>
        </v-card>
      </div>
      <div v-if="!loading">
        <div class="mt-3">
          <div>
            <h4 class="text-white">
              คิวที่รอทั้งหมด
              {{ dataQueue.queueWaiting ? dataQueue.queueWaiting.length : 0 }} คิว
            </h4>
          </div>
        </div>
        <div v-if="dataQueue.queueWaiting && dataQueue.queueWaiting.length > 0">
          <v-autocomplete id="selectedCat" v-model="selectedCat" label="เลือกแมวที่ต้องการเรียก"
            item-text="storeFrontQueue" :items="dataQueue.queueWaiting" class="px-0 white-label" return-object
            :disabled="dataQueue.queueConfirm !== null && dataQueue.queueConfirm.storeFrontQueue !== ''"></v-autocomplete>
        </div>
        <div v-if="dataQueue.queueConfirm !== null && dataQueue.queueConfirm.storeFrontQueue !== ''">
          <div><strong class="text-white">หมายเลขแมวที่เรียกคิว</strong></div>
          <div class="mt-3">
            <CardQueueBooking :queueItem="dataQueue.queueConfirm" :removeWork="removeWork" :callQueue="callQueue"
              :closingWork="closingWork" :callQueueAgain="callQueueAgain" :returnQueue="returnQueue" />
          </div>
        </div>
        <div v-if="selectedCat">
          <div><strong class="text-white">หมายเลขแมวที่เลือก</strong></div>
          <div class="mt-3">
            <CardQueueBooking :queueItem="selectedCat" :removeWork="removeWork" :callQueue="callQueue"
              :closingWork="closingWork" :callQueueAgain="callQueueAgain" :returnQueue="returnQueue" />
          </div>
        </div>
        <div class="mt-3" v-if="filteredQueue && filteredQueue.length > 0">
          <div>
            <strong class="text-white">รายการแมวทั้งหมดที่กำลังรอเรียก</strong>
          </div>
          <div v-for="(item, index) in filteredQueue" :key="index" class="mt-3">
            <CardQueueBooking
              :isDisabled="dataQueue.queueConfirm !== null && dataQueue.queueConfirm.storeFrontQueue !== ''"
              :queueItem="item" :removeWork="removeWork" :callQueue="callQueue" :closingWork="closingWork"
              :callQueueAgain="callQueueAgain" :returnQueue="returnQueue" />
          </div>
        </div>
      </div>
    </div>
  </v-main>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import adminLeftMenu from '../Sidebar.vue'
import { CardQueueBooking } from '../EventCat'
import moment from 'moment-timezone'
import axios from 'axios'
export default {
  name: 'BookingListQueueByUserEventCat',
  components: {
    'left-menu-admin': adminLeftMenu,
    CardQueueBooking,
    waitingAlert
  },
  data () {
    return {
      shopColor: '',
      loading: false,
      selectedCat: null,
      currentDate: moment().format('DD/MM/YYYY'),
      filteredQueue: [],
      dataQueue: {
        queueConfirm: null,
        queueWaiting: null
      }
    }
  },
  async mounted () {
    await this.getShop()
    await this.getFirestore()
    await this.getBooking()
  },
  created () {
    this.updateDateStart()
  },
  methods: {
    async getShop () {
      await axios
        .get(
          `${this.DNS_IP}/sys_shop/get?shopId=${this.$session.getAll().data.shopId
          }`
        )
        .then(response => {
          let data = response.data
          if (data.length > 0) {
            this.shopColor = data[0].secondaryColor
          }
        })
    },
    async getBooking () {
      this.selectedCat = null
      try {
        axios
          .get(
            `${this.DNS_IP}/booking_cat_event/getByEmpNo?empNo=${this.$session.getAll().data.empId
            }`
          )
          .then(async response => {
            if (response && response.data) {
              if (response.data.status) {
                let data = response.data
                this.dataQueue.queueConfirm = data.queueConfirm
                this.dataQueue.queueWaiting = data.queueWaiting
                this.filteredQueue = data.queueWaiting
              } else {
                this.filteredQueue = []
                this.dataQueue = {
                  queueConfirm: null,
                  queueWaiting: null
                }
              }
            }
          })
      } catch (error) {
        console.log('Error -> ', error)
      }
    },
    updateDateStart () {
      const update = () => {
        this.currentDate = moment().format('DD/MM/YYYY')
        const now = new Date()
        const tomorrow = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        )
        const msUntilTomorrow = tomorrow - now
        setTimeout(update, msUntilTomorrow)
      }

      update()
    },
    async getFirestore () {
      this.firestore = this.$firebase.firestore()
      const FieldPath = this.$firebase.firestore.FieldPath
      this.firestore.collection('CatEvent')
        .where(FieldPath.documentId(), '==', this.$session.getAll().data.userName)
        .onSnapshot((snapshot) => {
          if (snapshot.empty) {
            this.updateProcessUpdate()
          } else {
            snapshot.docChanges().forEach(async (change) => {
              if (change.doc.data().active === '1') {
                await this.getBooking()
                this.updateProcessUpdate()
              }
            })
          }
        })
    },
    async apiUpdateEvent (item, isInsertCallQueues) {
      try {
        let body = {
          statusQueue: item.statusQueue
        }
        console.log('apiUpdateEvent', item)
        const response = await axios.post(`${this.DNS_IP}/booking_cat_event/edit/${item.bookID}`, body)
        if (response.data.status) {
          if (isInsertCallQueues) {
            if (item.audioFileId) {
              this.updateCallQueues(item.audioFileId)
            } else {
              await this.insertCallQueues(item)
            }
          }
          this.getBooking()
          this.resetFirebase()
          this.selectedCat = null
        }
      } catch (error) {
        console.log('removeWork Error -> ', error)
      }
    },
    async insertCallQueues (item) {
      try {
        let body = {
          bookNo: item.bookID,
          shopId: this.$session.getAll().data.shopId,
          storeFrontQueue: item.storeFrontQueue,
          CREATE_USER: this.$session.getAll().data.userName,
          LAST_USER: this.$session.getAll().data.userName,
          statusNotify: 'False'
        }
        await axios
          .post(`${this.DNS_IP}/callQueues/add`, body)
      } catch (error) { console.log('Error insertCallQueues -> ', error) }
    },
    async updateCallQueues (audioFileId) {
      try {
        let body = {
          statusNotify: 'False',
          LAST_USER: this.$session.getAll().data.userName
        }
        await axios
          .post(this.DNS_IP + '/callQueues/edit/' + audioFileId, body)
      } catch (error) {
        console.log('reCallNoti', error)
      }
    },
    updateProcessUpdate () {
      let params = {
        userName: this.$session.getAll().data.userName
      }
      axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/CatEvent-ProcessUseNew', params)
    },
    async resetFirebase () {
      let paramsAdmin = {
        userName: 'monitor@wdf.com'
      }
      await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/CatEvent-ProcessNewByUser', paramsAdmin)
    },
    async removeWork (item) {
      try {
        this.loading = true
        item.statusQueue = 'canceljob'
        await this.apiUpdateEvent(item)
      } catch (error) {
        console.log('removeWork Error -> ', error)
      }
      this.loading = false
    },
    async callQueue (item) {
      try {
        this.loading = true
        item.statusQueue = 'confirmjob'
        await this.apiUpdateEvent(item, true)
      } catch (error) {
        console.log('callQueue Error -> ', error)
      }
      this.loading = false
    },
    async closingWork (item) {
      try {
        this.loading = true
        item.statusQueue = 'closing'
        await this.apiUpdateEvent(item)
      } catch (error) {
        console.log('closingWork Error -> ', error)
      }
      this.loading = false
    },
    async callQueueAgain (item) {
      try {
        this.loading = true
        this.updateCallQueues(item.audioFileId)
        this.resetFirebase()
      } catch (error) {
        console.log('callQueueAgain Error -> ', error)
      }
      this.loading = false
    },
    async returnQueue (item) {
      try {
        this.loading = true
        item.statusQueue = 'waiting'
        await this.apiUpdateEvent(item)
      } catch (error) {
        console.log('returnQueue Error -> ', error)
      }
      this.loading = false
    }
  },
  watch: {
    selectedCat (newValue, oldValue) {
      if (
        this.dataQueue.queueWaiting &&
        this.dataQueue.queueWaiting.length > 0
      ) {
        let queueWaiting = this.dataQueue.queueWaiting
        this.filteredQueue = queueWaiting.filter(
          queueItem => queueItem.bookID !== newValue.bookID
        )
      }
    }
  }
}
</script>
<style scoped>
.main-queue{
  height: 'unset' !important;
  border-radius: 'unser' !important;
}
/deep/ .v-select__slot>.v-label {
  color: white !important;
}

/deep/ input#selectedCat {
  color: white !important;
}
</style>
