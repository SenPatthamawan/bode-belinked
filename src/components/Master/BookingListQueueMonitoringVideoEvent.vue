<template>
    <div id="app-container" class="fullscreen-background d-flex flex-column">
        <!-- <main> -->
        <v-main class="main">
            <div class="mb-2 d-flex justify-content-center responsive-image" style="text-align: center;">
                <img
                :src="require('@/assets/thaiairways-logo.png')"
                alt="Thai Airways Logo"
                />
            </div>
            <div class="main-content">
                <v-card color="#31215F" class="col-11 mx-auto main-card align-content-center">
                    <div class="row d-flex">
                        <div v-for="(group, groupIndex) in groupedData" :key="groupIndex" class="col-4">
                            <div class="col-12 text-white" color="#31215F">
                                <div class="d-flex mb-3">
                                    <v-card-title class="col-6 justify-start subtext-title text-white">
                                        เลขคิว
                                    </v-card-title>
                                    <v-card-title class="col-6 justify-end subtext-title text-white">
                                        ช่องบริการ
                                    </v-card-title>
                                </div>
                                <v-card class="d-flex text-center align-center justify-center mb-3" color="#ffffff" style="height: 96px;"
                                v-for="(item, index) in group" :key="index">
                                    <div class="col-6 subtext">
                                        {{ item.queue }}
                                    </div>
                                    <div class="col-6 subtext">
                                        {{ item.serviceNo }}
                                    </div>
                                </v-card>
                            </div>
                        </div>
                    </div>
                </v-card>
            </div>
        <!-- </main> -->
        </v-main>
        <v-footer padless :style="{ backgroundColor: 'rgba(255, 255, 255, 0)' }" :class="`flex-grow-1 fixed-bottom d-flex flex-row justify-content-between align-items-center ${isPortrait ? '' : 'mt-3'}`">
            <div class="col py-0">
                <v-icon class="mr-3">
                {{ wifiIcon }}
                </v-icon>
                <v-btn icon color="#000000" @click="changeStatusSound('off')" v-if="statusSound === true">
                <v-icon>mdi-volume-high</v-icon>
                </v-btn>
                <v-btn icon color="#000000" @click="changeStatusSound('on')" v-else>
                <v-icon>mdi-volume-off</v-icon>
                </v-btn>
            </div>
            <div class="col d-flex justify-content-center"><span class="text-footer">POWER BY BETASK CONSULTING</span></div>
            <div class="col py-0 d-flex justify-content-end"><span class="text-datetime">{{ formattedDate }}</span><span class="ml-4 text-datetime">{{ formattedTime }}</span></div>
        </v-footer>
        <v-row v-show="hideSound === true">
      <audio id="playerTV" controls="controls">
        Your browser does not support the audio format.
      </audio>
      <v-col>
        <audio id="playerPrefix" controls="controls">>
          <source
            src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FQNumber.wav?alt=media&token=451f683b-28da-44d0-8673-f5d25a84a9e1">
          Your browser does not support the audio format.
        </audio>
        <audio id="playerQueue" controls="controls">>
          <source :src="audio">
          Your browser does not support the audio format.
        </audio>
        <audio id="playerCounter" controls="controls">>
          <source :src="tableTarget">
          Your browser does not support the audio format.
        </audio>
      </v-col>
      <v-col>
        {{ history }}
      </v-col>
    </v-row>
    </div>
</template>

<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import moment from 'moment-timezone'
import { CardWaitingOhrich, BookingUseEventCat, CardSubService } from '../TV'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    CardWaitingOhrich,
    BookingUseEventCat,
    CardSubService
  },
  computed: {
    videoElement () {
      return this.$refs.video
    },
    formattedTime () {
      const timeString = this.currentTime.split(' ')[1]
      return timeString
    },
    formattedDate () {
      return this.currentDate
    },
    wifiIcon () {
      switch (this.wifiStatus) {
        case 'connected':
          return 'mdi-wifi'
        case 'disconnected':
          return 'mdi-wifi-off'
        default:
          return 'mdi-wifi-strength-alert-outline'
      }
    },
    sortedDataQueueList () {
      // แยกข้อมูลที่มีค่าและค่าว่าง
      const queueData = this.dataQueueList.filter(item => item.queue !== '' && item.serviceNo !== '')
      const emptyData = this.dataQueueList.filter(item => item.queue === '' || item.serviceNo === '')
      const sortedNonEmptyData = queueData.slice().sort((a, b) => a.index - b.index).reverse()

      // รวมข้อมูลที่มีค่าที่จัดเรียงแล้วและข้อมูลที่ว่าง
      return sortedNonEmptyData.concat(emptyData)
    },
    groupedData () {
      const chunkSize = 6
      const groups = []
      const sortedData = this.sortedDataQueueList

      for (let i = 0; i < sortedData.length; i += chunkSize) {
        groups.push(sortedData.slice(i, i + chunkSize))
      }
      return groups
    }
  },
  created () {
    this.checkWiFiStatus()
    window.addEventListener('online', () => { this.wifiStatus = 'connected' })
    window.addEventListener('offline', () => { this.wifiStatus = 'disconnected' })
    this.getFirestore()
  },
  data () {
    return {
      tableTarget: 0,
      dataQueueList: [],
      orientation: '',
      statusSound: true,
      dateStartShow: '',
      video: '',
      DarkModeBackground: '#FFFFFF',
      validSearch: true,
      itemBooking: [],
      itemBookingUse: [],
      BookingDataList: [],
      time: '',
      timeavailable: [],
      branchItem: [],
      masBranchID: '',
      flowSelect: '',
      dateStart: '',
      shop: [],
      dialog: false,
      search: '',
      shopColor: '',
      shopImage: '',
      bgColor: '',
      bgColor2: '',
      bgColor3: '',
      text: '',
      videoLinkMonition: '',
      statusSoundCheck: null,
      hideSound: false,
      audio: null,
      timeCount: 0,
      repeatRound: 2,
      speakerId: 27,
      history: [],
      objInterval: null,
      text2: '',
      tableId: 0,
      currentDate: moment().format('DD MMM YYYY'),
      currentTime: moment().format('HH:mm'),
      isPortrait: true,
      wifiStatus: 'unknown',
      checkRef: false,
      soundQueneNo: [],
      dataListPlay: [],
      dataService: [],
      dataWaiting: [],
      dataSound: [],
      playingSound: [],
      empList: [4300, 4301, 4302, 4303, 4304, 4305, 4306, 4307, 4308, 4309, 4310, 4311, 4312, 4313, 4314, 4315, 4316, 4317, 4318],
      dataListTest1: [1, 2, 3, 4, 5, 6, 7],
      dataListTest2: [1, 2, 3, 4, 5, 6],
      tableAudioList: [
        '',
        'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FPleaseContactCounterOne.wav?alt=media&token=0a90f02b-f23b-430c-874c-e476c7701def',
        'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FPleaseContactCounterTwo.wav?alt=media&token=7348068e-b96e-4ce4-a2d8-19b13fb6ce55',
        'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FPleaseContactCounterThree.wav?alt=media&token=fb455275-eac7-4375-9e9b-3ee2f20182b5',
        'https://storage.googleapis.com/ohrich-sound/PleaseContactCounterFour.wav',
        'https://storage.googleapis.com/ohrich-sound/PleaseContactCounterFive.wav',
        '',
        ''
      ]
    }
  },

  async mounted () {
    this.checkOrientation()
    this.setupEventListeners()

    this.fetchInitialData()
  },
  destroyed () {
    window.removeEventListener('resize', this.checkOrientation)
  },
  beforeDestroy () {
    this.$root.$off('dataReturn')
    clearInterval(this.interval)
    clearInterval(this.intervalSound)
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    getTempleteQueue () {
      return [
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        },
        {
          queue: '',
          serviceNo: ''
        }
      ]
    },
    checkOrientation () {
      this.isPortrait = window.innerHeight > window.innerWidth
    },
    setupEventListeners () {
      window.addEventListener('resize', this.checkOrientation)
      window.addEventListener('orientationchange', this.checkOrientation)
      document.querySelector('body').requestFullscreen()
    },
    async getDataBranch () {
      this.branchItem = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName', '')
      if (this.branchItem.length > 0) {
        this.masBranchID = this.branchItem[0].value
      }
    },
    async getDataFromAPI (url, fieldId, fieldName, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.$session.getAll().data.shopId}${param}`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d[fieldName]
              s.value = d[fieldId]
              s.allData = d
              result.push(s)
              // console.log('this.DataFlowName', this.DataFlowName)
            }
          } else {
            result = []
          }
        })
      return result
    },
    async fetchInitialData () {
      // await Promise.all([this.getShop(), this.getBooking(), this.getFirestore()])
      await this.getShop()
      await this.getDataBranch()
      await this.getBooking()
      this.startDateTimeInterval()
    },
    startDateTimeInterval () {
      this.interval = setInterval(() => {
        this.currentTime = moment().format('DD/MMM/YYYY HH:mm')
      }, 1000)
    },
    replaceFunc (text) {
      let itemText = text.split('')
      let textFill = ''
      for (let i = 1; i < itemText.length; i++) {
        let d = itemText[i]
        if (d === '0') {
          textFill = textFill + ' zero'
        } else if (d === '1') {
          textFill = textFill + ' one'
        } else if (d === '2') {
          textFill = textFill + ' two'
        } else if (d === '3') {
          textFill = textFill + ' three'
        } else if (d === '4') {
          textFill = textFill + ' four'
        } else if (d === '5') {
          textFill = textFill + ' five'
        } else if (d === '6') {
          textFill = textFill + ' six'
        } else if (d === '7') {
          textFill = textFill + ' seven'
        } else if (d === '8') {
          textFill = textFill + ' eight'
        } else if (d === '9') {
          textFill = textFill + ' nine'
        }
      }
      if (itemText[0] === 'เ') {
        return itemText[0] + itemText[1] + ' ' + textFill
      } else {
        return itemText[0] + ' ' + textFill
      }
    },
    async getFirestore () {
      try {
        if (this.unsubscribe) {
          this.unsubscribe()
        }
        this.firestore = this.$firebase.firestore()
        const FieldPath = this.$firebase.firestore.FieldPath
        this.unsubscribe = this.firestore.collection('EventProcess')
          .where(FieldPath.documentId(), '==', this.$session.getAll().data.userName)
          .onSnapshot((snapshot) => {
            console.log('getFirestore')
            if (snapshot.empty) {
              this.updateProcessUpdate()
            } else {
              snapshot.docChanges().forEach(async (change) => {
                if (change.doc.id === this.$session.getAll().data.userName) {
                  if (change.doc.data().active === '1' && (this.$session.getAll().data.USER_ROLE === 'user' || this.$session.getAll().data.USER_ROLE === 'admin')) {
                    await this.getBooking()
                    await this.updateNotifyByShopId()
                    this.updateProcessUpdate()
                  }
                }
              })
            }
          })
      } catch (error) {
        console.log('Error getFirestore', error)
      }
    },
    updateProcessUpdate () {
      let body = {
        userName: this.$session.getAll().data.userName,
        masBranchID: this.masBranchID
      }
      axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Event-ProcessUseNew', body)
    },
    async changeStatusSound (text) {
      if (text === 'on') {
        this.statusSound = true
        await this.updatestatusNotifyByShopId()
      } else {
        this.statusSound = false
      }
    },
    async updatestatusNotifyByShopId () {
      const params = {
        statusNotify: 'True',
        shopId: this.$session.getAll().data.shopId,
        masBranchID: this.masBranchID
      }
      await axios.post(`${this.DNS_IP}/callQueues/updateStatusNotifyOhrich`, params)
    },
    async getMessageNoInterval (storeFrontQueue, dueDateDay) {
      try {
        let branchId = this.masBranchID || 2185
        let url = `${this.DNS_IP}/callQueues/get?statusNotify=False&shopId=${this.$session.getAll().data.shopId}&masBranchID=${branchId}&storeFrontQueue=${storeFrontQueue}&CREATE_DATE=${dueDateDay}`
        await axios
          .get(
            url
          ).then(async (response) => {
            if (response.data.status !== false) {
              let result = await this.generateSound(response.data[0])
              await this.updateMessage(response.data[0].id, result)
            }
          })
      } catch (e) {
        console.log(e)
      }
    },
    updateMessage (id, result) {
      const params = {
        statusNotify: 'True',
        audioFile: result.audio_url
      }
      axios.post(`${this.DNS_IP}/callQueues/edit/${id}`, params)
    },
    async generateSound (item) {
      try {
        // eslint-disable-next-line no-tabs
        this.tableId = item.servicePoint.replace('	  ', '').replace(' ', '').trim()
        let storeFrontQueue = item.storeFrontQueue
        storeFrontQueue = this.replaceFunc(storeFrontQueue.replace('A', 'เอ'))
        let result
        let oldSound = this.soundQueneNo.filter((row) => { return row.queue === item.storeFrontQueue })
        item.audioFile = null
        if (oldSound.length > 0) {
          item.audioFile = oldSound[0].audioFile
        } else {
          // let branchId = this.$session.getAll().data.masBranchID || 2185
          await axios
            .get(
              `${this.DNS_IP}/callQueues/get?storeFrontQueue=${item.storeFrontQueue}&shopId=` + this.$session.getAll().data.shopId + `&audioFile=notNull`
            ).then(async (response) => {
              if (response.data.length > 0 && typeof response.data.status === 'undefined') {
                item.audioFile = response.data[0].audioFile
              }
            })
        }
        if (item.audioFile === null) {
          var params = {
            text: ' ' + storeFrontQueue,
            text_delay: ' ' + storeFrontQueue,
            speaker: this.speakerId,
            volume: 1,
            speed: 0.75,
            type_media: 'wav'
          }
          await axios
            .post(
              'https://api-voice.botnoi.ai/openapi/v1/generate_audio',
              params,
              { headers: { 'Botnoi-Token': 'VTNjZDc5OTM3ZjM4MDg4NzhkYzlkMTI0ZjNiZWZlMTZkNTYxODk0' } }
            ).then((res) => {
              this.dataListPlay.push(res.data)
              this.playSound()
              result = res.data
            })
        } else {
          let res = { text: item.storeFrontQueue, audio_url: item.audioFile }
          this.dataListPlay.push(res)
          this.playSound()
          result = res
        }
        return result
      } catch (e) {
        console.log(e)
        return null
      }
    },
    playSoundBooking (audioUrl, servicePoint, storeFrontQueue) {
      let playerTV = document.getElementById('playerTV')
      try {
        if (playerTV.paused) {
          let roundCount = 0
          let maxRounds = 2
          let playList = [
            'https://storage.googleapis.com/thaiairway-sound/prefix.wav',
            audioUrl,
            `https://storage.googleapis.com/thaiairway-sound/counter${String(servicePoint).trim()}.wav`
          ]
          let index = 0
          let playNext = () => {
            if (index < playList.length) {
              playerTV.src = playList[index++]
              playerTV.load()
              playerTV.play()
            } else if (roundCount < maxRounds - 1) {
              index = 0
              roundCount++
              playNext()
            }
          }
          playerTV.onended = playNext
          playNext()
        } else {
          this.intervalSound = setTimeout(() => {
            this.playSoundBooking(audioUrl, servicePoint, storeFrontQueue)
          }, 2000)
        }
      } catch (error) {
        console.log('Error playSound', error)
        playerTV.pause()
      }
    },
    playOnceAndRemove (playList) {
      let playerTV = document.getElementById('playerTV')
      console.log('playOnceAndRemove', playList)
      let index = 0
      let playNext = () => {
        if (index < playList.length) {
          playerTV.src = playList[index++]
          playerTV.load()
          playerTV.play()
        }
      }
      playNext()
      playerTV.removeEventListener('ended', this.playOnceAndRemove)
    },
    async getShop () {
      await axios
        .get(`${this.DNS_IP}/sys_shop/get?shopId=${this.$session.getAll().data.shopId}`)
        .then(response => {
          let data = response.data
          if (data.length > 0) {
            this.shopColor = data[0].secondaryColor
            this.videoLinkMonition = data[0].videoLinkMonition
          }
        })
    },
    async getBooking () {
      let arrDataService = []
      let dataQueueList = this.getTempleteQueue()
      try {
        await axios.get(`${this.DNS_IP}/booking_view/getQueueEventTV?masBranchID=${this.masBranchID}&shopId=${this.$session.getAll().data.shopId}`)
          .then(async response => {
            if (response.data) {
              const data = response.data
              if (data.status) {
                arrDataService = data.dataService
                if (arrDataService !== null && arrDataService.length > 0) {
                  arrDataService.forEach((service, index) => {
                    if (index < dataQueueList.length) {
                      dataQueueList[index].queue = service.storeFrontQueue
                      dataQueueList[index].serviceNo = service.servicePoint
                    }
                  })
                } else {
                  dataQueueList = this.getTempleteQueue()
                }
              } else {
                arrDataService = []
                dataQueueList = this.getTempleteQueue()
              }
            }
          })
      } catch (error) {
        console.log('Error', error)
      }
      this.dataService = arrDataService
      this.dataQueueList = dataQueueList
      // playSound
      if (this.statusSound) {
        arrDataService.filter(item => item.IsNotify === 'False').forEach(itemIsNotify => {
          const audioUrl = `https://storage.googleapis.com/thaiairway-sound/${itemIsNotify.storeFrontQueue}.wav`

          this.playingSound.push({ storeFrontQueue: itemIsNotify.storeFrontQueue, audioUrl: audioUrl, servicePoint: itemIsNotify.servicePoint })
        }
        )
      }
      console.log('playingSound', this.playingSound)
      if (this.playingSound.length > 0) {
        this.playingSound.reverse()
        for (let index = this.playingSound.length - 1; index >= 0; index--) {
          let sound = this.playingSound[index]
          this.playSoundBooking(sound.audioUrl, sound.servicePoint, sound.storeFrontQueue)
          this.playingSound.pop()
        }
      }
    },
    async updateNotifyByShopId () {
      const params = {
        statusNotify: 'True',
        shopId: this.$session.getAll().data.shopId,
        masBranchID: this.masBranchID
      }
      await axios.post(`${this.DNS_IP}/callQueues/updateStatusNotifyOhrich`, params)
    },
    updateMessageSound (bookNo, audioUrl) {
      try {
        const params = {
          statusNotify: 'True',
          audioFile: audioUrl
        }
        axios.post(`${this.DNS_IP}/callQueues/edit/${bookNo}`, params)
      } catch (error) {
        console.log('Error updateMessageSound', error)
      }
    },
    checkWiFiStatus () {
      this.wifiStatus = navigator.onLine ? 'connected' : 'disconnected'
    }
  }
}

</script>
<style scope>
.main-card {
  border-radius: 20px 20px 0 0 !important;
  /* width: 1190px; */
  /* height: 700px; */
}

#app-container {
  height: 100vh;
  overflow: hidden;
}

.fullscreen-background {
  background-image: url('../../assets/thaiairways-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
}

.main-card-container {
    height: calc(100vh - 120px); /* ปรับค่าตามความสูงของ footer */
    overflow-y: auto; /* เพิ่มแถบเลื่อนถ้าเนื้อหามากเกินไป */
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
    .subtext {
        color: #14142B;
        font-size: 10px !important;
        font-weight: bold;
    }
    .subtext-title {
        color: #14142B;
        font-size: 10px !important;
        font-weight: bold;
    }
    .responsive-image {
        height: 110px;
    }
    .text-datetime,
    .text-footer {
        font-size: 11px;
        font-weight: 700;
        color: black;
    }
    .main-content {
        height: 90%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
 }

 /* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
    .subtext {
        color: #14142B;
        font-size: 22px !important;
        font-weight: bold;
    }
    .subtext-title {
        color: #14142B;
        font-size: 16px !important;
        font-weight: bold;
    }
    .responsive-image {
        height: 150px;
    }
    .text-datetime,
    .text-footer {
        font-size: 15px;
        font-weight: 700;
        color: black;
    }
    .main-content {
        height: 85%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
 }

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
    .subtext {
        color: #14142B;
        font-size: 35px !important;
        font-weight: bold;
    }
    .subtext-title {
        color: #14142B;
        font-size: 22px !important;
        font-weight: bold;
    }
    .responsive-image {
        height: 150px;
    }
    .text-datetime,
    .text-footer {
        font-weight: 700;
        color: black;
    }
    .main-content {
        height: 85%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
 }

 /* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
    .subtext {
        color: #14142B;
        font-size: 47px !important;
        font-weight: bold;
    }
    .subtext-title {
        color: #14142B;
        font-size: 28px !important;
        font-weight: bold;
    }
    .responsive-image {
        height: 200px;
    }
    .text-datetime,
    .text-footer {
        font-weight: 700;
        color: black;
    }
    .main-content {
        height: 80%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
 }

 /* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
    .subtext {
        color: #14142B;
        font-size: 48px !important;
        font-weight: bold;
    }
    .subtext-title {
        color: #14142B;
        font-size: 28px !important;
        font-weight: bold;
    }
    .responsive-image {
        height: 200px;
    }
    .text-datetime,
    .text-footer {
        font-weight: 700;
        color: black;
    }
    .main-content {
        height: 80%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
 }
</style>
