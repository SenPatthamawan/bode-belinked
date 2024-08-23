<template>
  <div id="app-container">
    <main :class="`${ isPortrait ? '' : 'd-flex align-items-center'}`">
    <div :class="`d-flex ${isPortrait ? 'flex-column' : 'flex-row col-12 w-100'}`">
      <BookingUseOhrich :bookingUse="dataService" :isPortrait="isPortrait" />
      <div v-if="!isPortrait" class="col-7 d-flex flex-column">
        <div class="mt-5">
          <video v-if="videoLinkMonition.includes('firebasestorage')" ref="videoAds" id="videoAds" class="col-12"
            width="100%" autoplay muted autopictureinpicture controls loop="true"
            poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
            <source :src="videoLinkMonition" type="video/webm">
          </video>
          <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px"
            :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length - 11) + '&autoplay=1&loop=1'"
            title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen></iframe>
        </div>
        <div class="d-flex flex-row justify-content-between mx-4 mt-5 h-100">
          <CardWaitingOhrich :groupQueueItem="dataWaiting.slice(0, 6)" time="10"  />
          <CardWaitingOhrich :groupQueueItem="dataWaiting.slice(6, 12)" time="10 - 20" />
          <CardWaitingOhrich :groupQueueItem="dataWaiting.slice(12)" time="20 - 30" />
        </div>
      </div>
    </div>
    <div v-if="isPortrait" class="col-12 d-flex flex-row  height-card">
      <CardWaitingOhrich :groupQueueItem="dataWaiting.slice(0, 6)" time="10" :isPortrait="isPortrait" />
      <CardWaitingOhrich :groupQueueItem="dataWaiting.slice(6, 12)" time="10 - 20" :isPortrait="isPortrait" />
      <CardWaitingOhrich :groupQueueItem="dataWaiting.slice(12)" time="20 - 30" :isPortrait="isPortrait" />
    </div>
    <div v-if="isPortrait" class="d-flex  flex-row justify-content-between">
      <video v-if="videoLinkMonition.includes('firebasestorage')" ref="videoAds" id="videoAds" class="col-12" width="100%"
        autoplay muted autopictureinpicture controls loop="true"
        poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
        <source :src="videoLinkMonition" type="video/webm">
      </video>
      <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px"
        :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length - 11) + '&autoplay=1&loop=1'"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    </div>
  </main>
    <v-footer padless color="#BDE56A" :class="`d-flex flex-row justify-content-between align-items-center ${isPortrait ? '' : 'mt-3'}`">
        <div class="col py-0">
          <v-icon class="mr-3">
            {{ wifiIcon }}
          </v-icon>
          <v-btn icon color="#695988" @click="changeStatusSound('off')" v-if="statusSound === true">
            <v-icon>mdi-volume-high</v-icon>
          </v-btn>
          <v-btn icon color="#695988" @click="changeStatusSound('on')" v-else>
            <v-icon>mdi-volume-off</v-icon>
          </v-btn>
        </div>
        <div class="col d-flex justify-content-center"><span class="text-white text-footer">POWER BY BETASK CONSULTING
          </span></div>
        <div class="col py-0 d-flex justify-content-end"><span class="text-datetime">{{ formattedDateTime }}</span>
        </div>
    </v-footer>
    <v-row v-show="hideSound === true">
      <audio id="playerTV" controls="controls" ref="playerTV">
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
import { CardWaitingOhrich, BookingUseOhrich } from '../TV'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    CardWaitingOhrich,
    BookingUseOhrich
  },
  computed: {
    formattedDateTime () {
      return this.currentTime
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
      unsubscribe: null,
      orientation: '',
      statusSound: true,
      dateStartShow: '',
      video: 'https://www.youtube.com/watch?v=B5TDAXLPrRY&list=RDCMUC-4vsQo3bHMzLuHyVM_iIRA&start_radio=1',
      setTimerCalendar: null,
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
      sound: 'ขอเชิญ คิว A delay{0.2} 001 ที่ช่อง 2 ค่ะ',
      audio: null,
      timeCount: 0,
      repeatRound: 2,
      speakerId: 27,
      history: [],
      objInterval: null,
      text2: '',
      tableAudioList: [
        '',
        'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FPleaseContactCounterOne.wav?alt=media&token=0a90f02b-f23b-430c-874c-e476c7701def',
        'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FPleaseContactCounterTwo.wav?alt=media&token=7348068e-b96e-4ce4-a2d8-19b13fb6ce55',
        'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FPleaseContactCounterThree.wav?alt=media&token=fb455275-eac7-4375-9e9b-3ee2f20182b5',
        'https://storage.googleapis.com/ohrich-sound/PleaseContactCounterFour.wav',
        'https://storage.googleapis.com/ohrich-sound/PleaseContactCounterFive.wav',
        '',
        ''
      ],
      tableTarget: 0,
      tableId: 0,
      countConfirm: 0,
      countConfirmList: [],
      countConfirmListGroup: [],
      counterTotal: 4,
      currentTime: moment().format('DD/MMM/YYYY HH:mm'),
      isPortrait: true,
      wifiStatus: 'unknown',
      checkRef: false,
      dataListPlay: [],
      dataService: [],
      dataWaiting: [],
      dataSound: [],
      playingSound: [],
      languages: ['th', 'en', 'ch', 'jp'],
      words: ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'],
      num: 0
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
    checkOrientation () {
      this.isPortrait = window.innerHeight > window.innerWidth
    },
    setupEventListeners () {
      window.addEventListener('resize', this.checkOrientation)
      window.addEventListener('orientationchange', this.checkOrientation)
      document.querySelector('body').requestFullscreen()
    },
    async fetchInitialData () {
      await this.getShop()
      await this.getBooking()
      this.startDateTimeInterval()
    },
    startDateTimeInterval () {
      this.interval = setInterval(() => {
        this.currentTime = moment().format('DD/MMM/YYYY HH:mm')
      }, 1000)
    },
    async getFirestore () {
      try {
        console.log('getFirestore -> ', this.unsubscribe)
        if (this.unsubscribe) {
          this.unsubscribe()
        }
        this.firestore = this.$firebase.firestore()
        this.unsubscribe = this.firestore.collection('ProcessOhrichUpdate').doc(this.$session.getAll().data.userName)
          .onSnapshot(async (snapshot) => {
            if (!snapshot.exists) {
              await this.updateProcessOhrichNew()
            } else {
              console.log('getFirestore -> data', snapshot.data())
              if (snapshot.data().active === '1') {
                console.log('active [start] is updateProcessOhrichUpdate')
                await this.updateProcessOhrichUpdate()
                console.log('active [end] is updateProcessOhrichUpdate')
                console.log('snapshot data -> active is 1')
                console.log('active [start] is get booking')
                await this.getBooking()
                console.log('active [end] is get booking')
              } else {
                console.log('snapshot data -> active is 0')
              }
            }
          })
      } catch (error) {
        console.log('Error getFirestore', error)
      }
    },
    async updateProcessOhrichNew () {
      try {
        let body = {
          userName: this.$session.getAll().data.userName,
          masBranchID: this.$session.getAll().data.masBranchID
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Pepsico-ProcessOhrichUseNew', body)
      } catch (error) {
        console.log('updateProcessOhrichNew error ->', error)
      }
    },
    async updateProcessOhrichUpdate () {
      try {
        let body = {
          userName: this.$session.getAll().data.userName,
          masBranchID: this.$session.getAll().data.masBranchID
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Pepsico-ProcessOhrichReNewTest', body)
      } catch (error) {
        console.log('updateProcessOhrichUpdate error ->', error)
      }
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
        masBranchID: this.$session.getAll().data.masBranchID
      }
      await axios.post(`${this.DNS_IP}/callQueues/updateStatusNotifyOhrich`, params)
    },
    playSoundBooking (prefixAudio, audioUrl, servicePoint) {
      let playerTV = this.$refs.playerTV
      let video = this.$refs.videoAds
      let playList = []
      try {
        if (playerTV !== undefined) {
          if (playerTV.paused) {
            let roundCount = 0
            let maxRounds = 2
            video.pause()
            if (prefixAudio !== '') {
              playList = [prefixAudio, audioUrl, servicePoint]
            } else {
              playList = [audioUrl, servicePoint]
            }

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
              } else {
                video.play().catch(error => {
                  console.error('Error playing video:', error)
                })
              }
            }
            playerTV.onended = playNext
            playNext()
          } else {
            this.intervalSound = setTimeout(() => {
              this.playSoundBooking(prefixAudio, audioUrl, servicePoint)
            }, 2000)
          }
        } else {
          console.log('Error playSound : playerTV in null')
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
      let arrDataWaiting = []
      try {
        await axios.get(`${this.DNS_IP}/booking_view/getQueueOhrichTV?masBranchID=${this.$session.getAll().data.masBranchID}`)
          .then(async response => {
            if (response.data) {
              const data = response.data
              if (data.status) {
                arrDataService = data.dataService
                arrDataWaiting = data.dataWaiting
              } else {
                arrDataService = []
                arrDataWaiting = []
              }
            }
          })
      } catch (error) {
        console.log('Error')
      }
      console.log('dataService -> ', this.dataService)
      this.dataService = arrDataService.length > 0 ? arrDataService.sort((a, b) => {
        const dateA = new Date(a.LAST_DATE).getTime()
        const dateB = new Date(b.LAST_DATE).getTime()
        return dateB - dateA
      }) : []
      this.dataWaiting = arrDataWaiting
      // playSound
      let prefix = 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FQNumber.wav?alt=media&token=451f683b-28da-44d0-8673-f5d25a84a9e1'
      console.log('[Sound] ---> ', this.statusSound, 'playingSound --->', this.playingSound)
      const fitterDataService = arrDataService.filter(item => item.IsNotify === 'False')
      if (fitterDataService.length > 0) {
        let arrBooking = fitterDataService.map(obj => `'${obj.bookNo}'`).join(',')
        console.log('fitterDataService --->', arrBooking)
        await this.updateNotifyByShopId(arrBooking)
      }
      if (this.statusSound) {
        console.log('[arrDataService] --->', arrDataService)
        arrDataService.filter(item => item.IsNotify === 'False').forEach(itemIsNotify => {
          let audioUrl = `https://storage.googleapis.com/ohrich-sound/${itemIsNotify.storeFrontQueue}.wav`
          let servicePoint = `https://storage.googleapis.com/ohrich-sound/counter${itemIsNotify.servicePoint}.wav`

          const language = this.languages[itemIsNotify.bookingLanguage]

          if (language === 'th') {
            prefix = `https://storage.googleapis.com/ohrich-sound/${language}/prefix.wav`
          } else if (language === 'jp' || language === 'ch') {
            prefix = ''
          } else {
            prefix = 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FQNumber.wav?alt=media&token=451f683b-28da-44d0-8673-f5d25a84a9e1'
          }

          const servicePointNumber = String(itemIsNotify.servicePoint).trim()
          if (language !== 'en') {
            audioUrl = `https://storage.googleapis.com/ohrich-sound/${language}/${itemIsNotify.storeFrontQueue}.wav`
            servicePoint = `https://storage.googleapis.com/ohrich-sound/${language}/counter${servicePointNumber}.wav`
          } else {
            audioUrl = `https://storage.googleapis.com/ohrich-sound/${itemIsNotify.storeFrontQueue}.wav`
            servicePoint = this.tableAudioList[servicePointNumber]
          }
          // }
          const existQueue = this.playingSound.filter(itemNo => itemNo.storeFrontQueue === itemIsNotify.storeFrontQueue)
          console.log('storeFrontQueue --->', itemIsNotify.storeFrontQueue)
          if (existQueue.length === 0) {
            console.log('existQueue ----> existQueue === 0', existQueue)
            this.playingSound.push({ prefix: prefix, audioUrl: audioUrl, servicePoint: servicePoint })
          }
          console.log('playingSound 2 --->', this.playingSound)
        })
      }
      if (this.playingSound.length > 0) {
        console.log('playingSound length > 0')
        this.playingSound.reverse()
        for (let index = this.playingSound.length - 1; index >= 0; index--) {
          this.playSoundBooking(this.playingSound[index].prefix, this.playingSound[index].audioUrl, this.playingSound[index].servicePoint)
          this.playingSound.pop()
        }
      }
    },
    async updateNotifyByShopId (arrBooking) {
      try {
        const params = {
          statusNotify: 'True',
          shopId: this.$session.getAll().data.shopId,
          bookNo: arrBooking
        }
        await axios.post(`${this.DNS_IP}/callQueues/updateStatusNotifyOhrichByIn`, params)
      } catch (error) {
        console.log('updateNotifyByShopId -> ', error)
      }
    },
    checkWiFiStatus () {
      this.wifiStatus = navigator.onLine ? 'connected' : 'disconnected'
    }
  }
}

</script>
<style scope>
main  {
  flex: 1;
}
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.centered-input>>>input {
  text-align: center
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

.center_screen {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: auto;
  height: auto;
  text-align: center;
  border: solid 1px blue;
  padding: .5rem;
}

.text-black>>>.v-input__slot {
  color: #005fcc !important;
}

.text-datetime,
.text-number-waiting {
  font-weight: 700;
}

@media screen and (orientation: portrait) {
  .height-card {
    min-height: 16vh;
  }

  .text-footer {
    font-size: 1.8vw;
  }
}

@media screen and (orientation: landscape) {
  .text-footer {
    font-size: 1vw;
  }
}
</style>
