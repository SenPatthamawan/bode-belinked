<template>
  <div id="app-container" :style="{ backgroundColor: shopColor}">
    <main :class="`${ isPortrait ? '' : 'd-flex align-items-center'}`">
      <div :class="`d-flex ${isPortrait ? 'flex-column' : 'flex-row col-12 w-100'}`">
          <BookingUse :bookingUse="dataService" :isPortrait="isPortrait" :textRunQueue="textRunQueue[shopId] || 'เรียกคิว'" />
          <div v-if="!isPortrait"  class="col-7 d-flex flex-column">
              <div class="mt-5">
              <video v-if="videoLinkMonition.includes('firebasestorage')" ref="videoAds"   id="videoAds" class="col-12" width="100%" autoplay muted autopictureinpicture controls loop="true"
              poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
              <source :src="videoLinkMonition" type="video/webm">
            </video>
               <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px"
               :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length -11) + '&autoplay=1&loop=1'" title="YouTube video player" frameborder="0"
               allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               allowfullscreen></iframe>
              </div>
              <div class="d-flex flex-row justify-content-between mx-4 mt-5 h-100">
              <CardQueueSummary class="col-4" :queueSummary="queueSummary ? queueSummary : []"/>
              <CardWaitingAll class="col" :groupQueueItem="dataWaiting"/>
            </div>
          </div>
      </div>
     <div v-if="isPortrait" class="col-12 d-flex flex-row  height-card">
      <CardQueueSummary class="col-4" :queueSummary="queueSummary ? queueSummary : []"/>
      <CardWaitingAll class="col" :groupQueueItem="dataWaiting"/>
     </div>
      <div v-if="isPortrait" class="d-flex flex-row justify-content-between">
          <video v-if="videoLinkMonition.includes('firebasestorage')" ref="videoAds"  id="videoAds" class="col-12" width="100%" autoplay muted autopictureinpicture controls loop="true" poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
              <source :src="videoLinkMonition" type="video/webm">
           </video>
          <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px" :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length -11) + '&autoplay=1&loop=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
     </div>
     </main>
    <v-footer padless :color=shopColor :class="`d-flex flex-row justify-content-between align-items-center ${isPortrait ? '' : 'mt-3'}`">
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
import adminLeftMenu from '../Sidebar.vue'
import moment from 'moment-timezone'
import { CardWaitingAll, BookingUse, CardQueueSummary } from '../TV'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    CardWaitingAll,
    BookingUse,
    CardQueueSummary
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
      validSearch: true,
      itemBooking: [],
      itemBookingUse: [],
      BookingDataList: [],
      menuStart: false,
      timeavailable: [],
      branchItem: [],
      DataFlowItem: [],
      flowSelect: '',
      dateStart: '',
      dialog: false,
      dialogAdd: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      search: '',
      shopColor: '',
      shopTime: '',
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
      speakerId: 1,
      history: [],
      objInterval: null,
      text2: '',
      tableAudioList: [
        '',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023084650542663.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023084725582074.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023084756871326.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023084819480984.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023084846176701.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023084914852921.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023084938851367.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023085009434829.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023085042497294.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023085449577454.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023085522454629.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023085559998864.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02152023022750480676.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023085715437991.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023092857509523.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023092928359581.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02152023022850924702.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02152023022934174433.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02152023023007881725.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02152023023039434650.wav'
      ],
      tableTarget: 0,
      tableId: 0,
      countConfirm: 0,
      countConfirmList: [],
      isPortrait: true,
      currentTime: moment().format('DD/MMM/YYYY HH:mm'),
      wifiStatus: 'unknown',
      soundQueneNo: [],
      dataListPlay: [],
      queueSummary: [],
      groupQueueWaitingAll: [],
      dataService: [],
      dataWaiting: [],
      playingSound: [],
      textRunQueue: {
        'U1c7cb89c941d83931389985db0024d5b': 'Run Queue'
      }
    }
  },
  async mounted () {
    try {
      this.checkOrientation()
      this.setupEventListeners()
      this.fetchInitialData()
    } catch (error) {
      console.log('error', error)
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.checkOrientation)
  },
  beforeDestroy () {
    this.$root.$off('dataReturn')
    clearInterval(this.interval)
    clearInterval(this.intervalSound)
    this.statusSound = false
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
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
    checkOrientation () {
      this.isPortrait = window.innerHeight > window.innerWidth
    },
    async changeStatusSound (text) {
      if (text === 'on') {
        this.statusSound = true
      } else {
        this.statusSound = false
      }
    },
    async updatestatusNotifyByShopId () {
      const params = {
        statusNotify: 'True',
        shopId: this.$session.getAll().data.shopId
      }
      await axios.post(`${this.DNS_IP}/callQueues/updateStatusNotify`, params)
    },
    async getMessage () {
      try {
        await axios
          .get(
            `${this.DNS_IP}/callQueues/get?statusNotify=False&shopId=` + this.$session.getAll().data.shopId
          ).then(async (response) => {
            // เช็ค this.statusSound ต้องเป็น true ถึงจะให้เล่นเสียง
            // ถ้า response.data เป็น object = ไม่มีข้อมูล | ถ้า response.data เป็น array = มีข้อมูล, response.data.status = undefined เพราะเป็นการเช็ค object แต่เอามาเช็ค array จึงทำให้ undefined
            if ((Array.isArray(response.data) && response.data.length > 0 && this.statusSound) ||
                (typeof response.data === 'object' && typeof response.data.status !== 'boolean' && this.statusSound)) {
              clearInterval(this.objInterval)
              let result = await this.generateSound(response.data[0])
              await this.updateMessage(response.data[0].id, result)
              clearInterval(this.statusSoundCheck)
              this.statusSoundCheck = null
              this.statusSoundCheck = this.getMessage()
            } else {
              clearInterval(this.statusSoundCheck)
              this.statusSoundCheck = null
              this.statusSoundCheck = this.getMessage()
            }
          })
      } catch (e) {
        console.log(e)
        this.getMessage()
      }
    },
    async updateMessage (id, result) {
      const params = {
        statusNotify: 'True',
        audioFile: result.audio_url
      }
      axios.post(`${this.DNS_IP}/callQueues/edit/${id}`, params)
    },
    async isSound (typeStoreFront, numberStoreFront) {
      let isSound = false
      try {
        if (typeStoreFront === 'A' && numberStoreFront <= 450) {
          isSound = true
        } else if (typeStoreFront === 'B' && numberStoreFront <= 400) {
          isSound = true
        } else if (typeStoreFront === 'C' && numberStoreFront <= 350) {
          isSound = true
        } else if (typeStoreFront === 'M' && numberStoreFront <= 300) {
          isSound = true
        } else if (typeStoreFront === 'O' && numberStoreFront <= 200) {
          isSound = true
        }
      } catch (error) {
        console.log('error isSound', error)
      }
      return isSound
    },
    async generateSound (item) {
      try {
        this.tableId = item.servicePoint.replace('โต๊ะ ', '')
        let storeFrontQueue = item.storeFrontQueue
        storeFrontQueue = storeFrontQueue.replace('A', 'เอ')
        storeFrontQueue = storeFrontQueue.replace('B', 'บี')
        storeFrontQueue = storeFrontQueue.replace('C', 'ซี')
        storeFrontQueue = storeFrontQueue.replace('D', 'ดี')
        storeFrontQueue = storeFrontQueue.replace('E', 'อี')
        let result
        // let oldSound = this.soundQueneNo.filter((row) => { return row.queue === item.storeFrontQueue })
        item.audioFile = null
        const typeStoreFront = item.storeFrontQueue.substring(0, 1)
        const numberStoreFront = parseInt(item.storeFrontQueue.substring(1))
        if (this.isSound(typeStoreFront, numberStoreFront)) {
          item.audioFile = `https://storage.googleapis.com/thaiairway-sound/${item.storeFrontQueue}.wav`
        } else {
          console.log('oldSound no have')
          await axios
            .get(
              `${this.DNS_IP}/callQueues/get?storeFrontQueue=${item.storeFrontQueue}&shopId=` + this.$session.getAll().data.shopId + `&audioFile=notNull`
            ).then(async (response) => {
              console.log('nont oldSound callQueues', response.data)
              if ((Array.isArray(response.data) && response.data.length > 0 && this.statusSound) ||
                  (typeof response.data === 'object' && typeof response.data.status !== 'boolean' && this.statusSound)) {
                item.audioFile = response.data[0].audioFile
              }
            })
        }

        if (item.audioFile === null) {
          var params = {
            text: ' ' + storeFrontQueue,
            text_delay: ' ' + storeFrontQueue,
            speaker: this.speakerId,
            volume: 50,
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
              this.playSound(res.data)
              result = res.data
            })
        } else {
          let res = { text: item.storeFrontQueue, audio_url: item.audioFile }
          this.dataListPlay.push(res)
          this.playSound(res)
          result = res
        }
        return result
      } catch (e) {
        console.log(e)
        return null
      }
    },
    playSound (res) {
      try {
        if (res) {
          this.audio = res.audio_url
        }
        // this.tableTarget = this.tableAudioList[this.tableId]
        this.timeCount = 1
        let playerPrefix = document.getElementById('playerPrefix')
        let playerQueue = document.getElementById('playerQueue')
        let playerSuffix = document.getElementById('playerSuffix')
        var vid = document.getElementById('videoAds')
        playerQueue.src = res.audio_url
        vid.pause()
        playerPrefix.play()
        playerPrefix.onended = (event) => {
          playerQueue.load()
          playerQueue.play()
          playerQueue.onended = (event) => {
            playerSuffix.load()
            playerSuffix.play()
            playerSuffix.onended = (event) => {
              if (this.timeCount < this.repeatRound) {
                this.timeCount++
                playerPrefix.play()
                playerPrefix.onended = (event) => {
                  playerQueue.play()
                  playerQueue.onended = (event) => {
                    playerSuffix.play()
                    playerSuffix.onended = (event) => {
                      vid.play()
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.log('Error playSound', error)
      }
    },
    async getShop () {
      await axios
        .get(`${this.DNS_IP}/sys_shop/get?shopId=${this.$session.getAll().data.shopId}`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.shopColor = rs[0].primaryColor
            this.videoLinkMonition = rs[0].videoLinkMonition
          } else {
            this.shopColor = ''
          }
        })
    },
    playSoundBooking (prefixAudio, audioUrl, servicePoint) {
      let playerTV = this.$refs.playerTV
      let video = this.$refs.videoAds
      let playList = []
      try {
        if (playerTV !== undefined) {
          console.log(prefixAudio)
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
    async searchBooking () {
      this.queueSummary = []
      this.itemBooking = []
      if (this.validSearch === true) {
        let urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            // '&masBranchID=' +
            // this.masBranchID + // ปิด masBranchID เพื่อแสดงคิวทั้งหมด
            // '&flowId=' +
            // this.flowSelect +
            '&dueDate=' +
             moment().format('YYYY-MM-DD') + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
        // '&dueDate=' +
        // this.dateStart + ' ' + this.time + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
        await axios
          .get(urlApi)
          .then(async response => {
            let rs = response.data
            if (rs.length > 0) {
              this.groupQueueWaitingAll = rs.filter(el => { return el.statusBt === 'confirm' })
              let sortData = rs.sort((a, b) => {
                if (a.storeFrontQueue < b.storeFrontQueue) return -1
                return a.storeFrontQueue > b.storeFrontQueue ? 1 : 0
              })
              for (let i = 0; i < sortData.length; i++) {
                let d = sortData[i]
                d.servicePoint = d.servicePoint || ''
                // ป้องกันการ push ข้อมูลเบิ้ล โดยเช็คเอาเฉพาะ bookNo ที่ไม่ซ้ำกันใส่ใน array itemBooking
                const isDuplicate = this.itemBooking.some(item => item.bookNo === d.bookNo)
                if (!isDuplicate) {
                  this.itemBooking.push(d)
                }
              }
              let dataCon = this.itemBooking.filter(el => { return el.statusBt === 'confirmJob' })
              let dataWain = this.itemBooking.filter(el => { return el.statusBt === 'confirm' })
              let sortDataDataCon = dataCon.sort((a, b) => {
                if (a.LAST_DATE > b.LAST_DATE) return -1
                return a.LAST_DATE < b.LAST_DATE ? 1 : 0
              })
              this.queueSummary = await this.groupCountType(dataWain)
              this.countConfirm = dataWain.length
              this.countConfirmList = dataWain.filter((el, ind) => { return ind <= 11 })
              this.itemBookingUse = sortDataDataCon.filter((el, ind) => { return ind <= 5 })
            } else {
              this.itemBookingUse = []
              this.countConfirm = 0
              this.queueSummary = []
              this.groupQueueWaitingAll = []
              this.countConfirmList = []
            }
          })
      }
    },
    async groupCountType (dataConfirm) {
      try {
        const countStoreFrontText = dataConfirm.reduce((accumulator, currentValue) => {
          const text = currentValue.storeFrontText
          accumulator[text] = (accumulator[text] || 0) + 1
          return accumulator
        }, {})
        const queueSummaryArray = Object.entries(countStoreFrontText).map(([key, value]) => {
          return { key, value }
        })
        if (queueSummaryArray.length > 0) {
          return queueSummaryArray
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    checkWiFiStatus () {
      this.wifiStatus = navigator.onLine ? 'connected' : 'disconnected'
    },
    async getFirestore () {
      try {
        if (this.unsubscribe) {
          this.unsubscribe()
        }
        this.firestore = this.$firebase.firestore()
        this.unsubscribe = this.firestore.collection(`QueueOnline/shopId/${this.$session.getAll().data.shopId}`).doc(this.$session.getAll().data.userName)
          .onSnapshot(async (snapshot) => {
            if (!snapshot.exists) {
              await this.createProcessShopNew()
            } else {
              if (snapshot.data().active === '1') {
                await this.updateProcessShopUpdate()
                await this.getBooking()
              }
            }
          })
      } catch (error) {
        console.log('Error getFirestore', error)
      }
    },
    async createProcessShopNew () { // set active = 1
      try {
        let body = {
          userName: this.$session.getAll().data.userName,
          shopId: this.$session.getAll().data.shopId
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/QueueOnline-CreateProcessNew', body)
      } catch (error) {
        console.log('createProcessShopNew error-> ', error)
      }
    },
    async updateProcessShopUpdate () { // update active = 0
      try {
        let body = {
          userName: this.$session.getAll().data.userName,
          shopId: this.$session.getAll().data.shopId
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/QueueOnline-ProcessUseNew', body)
      } catch (error) {
        console.log('updateProcessShopUpdate error-> ', error)
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
    async getBooking () {
      let arrDataService = []
      let arrDataWaiting = []
      let queueSummary = []
      try {
        await axios.get(`${this.DNS_IP}/booking_view/getQueueTV?shopId=${this.$session.getAll().data.shopId}&masBranchID=${this.$session.getAll().data.masBranchID}`)
          .then(async response => {
            if (response.data) {
              const data = response.data
              if (data.status) {
                arrDataService = data.dataService
                arrDataWaiting = data.dataWaiting
                if (data.storeFrontQueueTextCounts) {
                  queueSummary = Object.entries(data.storeFrontQueueTextCounts).map(([key, value]) => {
                    return { key, value }
                  })
                }
              } else {
                arrDataService = []
                arrDataWaiting = []
                queueSummary = []
              }
            }
          })
      } catch (error) {
        console.log('Error')
      }
      this.dataService = arrDataService.length > 0 ? arrDataService.sort((a, b) => {
        const dateA = new Date(a.LAST_DATE).getTime()
        const dateB = new Date(b.LAST_DATE).getTime()
        return dateB - dateA
      }) : []
      this.dataWaiting = arrDataWaiting
      this.queueSummary = queueSummary
      console.log('arrDataService ->', arrDataService)
      const fitterDataService = arrDataService.filter(item => item.IsNotify === 'False')
      if (fitterDataService.length > 0) {
        let arrBooking = fitterDataService.map(obj => `'${obj.bookNo}'`).join(',')
        console.log('fitterDataService --->', arrBooking)
        await this.updateNotifyByShopId(arrBooking)
      }
      if (this.statusSound) {
        console.log('[arrDataService] --->', arrDataService)
        let prefix = 'https://storage.googleapis.com/thaiairway-sound/prefix1.wav'
        let servicePoint = `https://storage.googleapis.com/thaiairway-sound/suffix1.wav`
        arrDataService.filter(item => item.IsNotify === 'False').forEach(itemIsNotify => {
          let audioUrl = `https://storage.googleapis.com/thaiairway-sound/${itemIsNotify.storeFrontQueue}.wav`
          const existQueue = this.playingSound.filter(itemNo => itemNo.storeFrontQueue === itemIsNotify.storeFrontQueue)
          if (existQueue.length === 0) {
            this.playingSound.push({ prefix: prefix, audioUrl: audioUrl, servicePoint: servicePoint })
          }
          console.log('playingSound 2 --->', this.playingSound)
        })
      }
      if (this.playingSound.length > 0) {
        console.log('playingSound length > 0')
        for (let index = this.playingSound.length - 1; index >= 0; index--) {
          this.playSoundBooking(this.playingSound[index].prefix, this.playingSound[index].audioUrl, this.playingSound[index].servicePoint)
          this.playingSound.pop()
        }
      }
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
