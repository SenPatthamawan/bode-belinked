<template>
  <v-main class='fix-scroll'>
  <div
    :style="{ backgroundColor: '#FBD743', height: '100%', width: '100%' }"
    class="respons_bg"
  >
    <v-row class="pt-3 respons_mobie">
      <v-col class="d-flex justify-start p-0">
        <img
          alt="Motor bike"
          height="200px"
          :src="require('../../assets/header-bike.png')"
          class="respons_img1"
        />
      </v-col>
      <v-col class="d-flex align-center justify-center p-0 respons_logo">
        <div class="mt-3">
          <img
            alt="Logo"
            height="140px"
            :src="require('../../assets/logo-car.png')"
          />
        </div>
        <div class="mb-3">
          <span class="text-header">{{ masBranchName }}</span>
        </div>
      </v-col>
      <v-col class="d-flex justify-end p-0">
        <img
          alt="Car"
          height="200px"
          :src="require('../../assets/header-car.png')"
          class="respons_img2"
        />
      </v-col>
    </v-row>
    <BookingUseCar
      :bookingUse="itemBookingUse"
      :isPortrait="isPortrait"
      :shopId="shopId"
      :masBranchID="masBranchID"
      :test="resPondArr"
    />
    <!-- <div class="d-flex flex-column col-4" v-for="(group, groupIndex) in groupedData" :key="groupIndex">
          <BookingUseCar :bookingUse="itemBookingUse" :isPortrait="isPortrait"/> -->
    <!-- <div v-if="!isPortrait"  class="col-7 d-flex flex-column">
              <div class="mt-5">
              <video v-if="videoLinkMonition.includes('firebasestorage')" ref="video" id="videoAds" class="col-12" width="100%" autoplay muted autopictureinpicture controls loop="true" poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
              <source :src="videoLinkMonition" type="video/webm">
            </video>
               <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px" :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length -11) + '&autoplay=1&loop=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
              </div>
              <div class="d-flex flex-row justify-content-between mx-4  h-100">
              <CardQueueSummary class="col-4" :queueSummary="queueSummary ? queueSummary : []"/>
              <CardWaitingAll class="col" :groupQueueItem="groupQueueWaitingAll && groupQueueWaitingAll.length > 0 ?  groupQueueWaitingAll.slice(0, 12) : []"/>
            </div>
          </div> -->
    <!-- </div> -->
    <!-- <div v-if="isPortrait" class="col-12 d-flex flex-row justify-content-between height-card">
      <CardQueueSummary class="col-4" :queueSummary="queueSummary ? queueSummary : []"/>
      <CardWaitingAll class="col" :groupQueueItem="groupQueueWaitingAll && groupQueueWaitingAll.length > 0 ?  groupQueueWaitingAll.slice(0, 12) : []"/>
     </div> -->
    <!-- <div v-if="isPortrait" class="d-flex flex-row justify-content-between">
          <video v-if="videoLinkMonition.includes('firebasestorage')" ref="video" id="videoAds" class="col-12" width="100%" autoplay muted autopictureinpicture controls loop="true" poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
              <source :src="videoLinkMonition" type="video/webm">
           </video>
          <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px" :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length -11) + '&autoplay=1&loop=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
     </div> -->
    <div :class="`d-flex flex-row justify-content-between footer-color`">
      <div class="col-6 p-0 d-flex align-items-center ma-2">
        <v-icon class="ml-6" large>
          {{ wifiIcon }}
        </v-icon>
        <span class="text-footer ml-3" style="opacity: 0.9;"
          >POWER BY BETASK CONSULTING</span
        >
        <!-- <v-btn icon
                      large
                      color="#695988"
                      @click="changeStatusSound('off')"
                      v-if="statusSound === true"
                    >
                    <v-icon>mdi-volume-high</v-icon>
                    </v-btn>
                    <v-btn icon
                      large
                      color="#695988"
                      @click="changeStatusSound('on')"
                      v-else
                    >
                    <v-icon>mdi-volume-off</v-icon>
                    </v-btn> -->
      </div>
      <div
        class="col-6 py-0 d-flex justify-content-end text-footer align-items-center"
      >
        <!-- <div class="d-flex flex-row align-items-center mr-3"> -->
        <div class="mr-1"><v-icon color="red">mdi-map-marker</v-icon></div>
        <div style="opacity: 0.9;"><span>Muang Thong Thani</span></div>
        <v-divider
          inset
          vertical
          class="mx-6 flex-grow-1"
          style="height: 25px; border-left: 2px solid; opacity: 0.4;"
        ></v-divider>
        <!-- </div> -->
        <!-- <span class="text-datetime mr-2">{{ userBranch.masBranchName }}</span> -->
        <span style="opacity: 0.9;">{{ formattedDate }}</span>
        <v-divider
          inset
          vertical
          class="mx-6 flex-grow-1 "
          style="height: 25px; border-left: 2px solid; opacity: 0.4;"
        ></v-divider>
        <span style="opacity: 0.9;" class="mr-8">{{ formattedTime }}</span>
      </div>
    </div>
    <!-- <v-row v-show="hideSound === true">
            <v-col>
              <audio id="playerPrefix" controls="controls">>
                <source src="https://storage.googleapis.com/clinic_ruangkao/queue.wav">
                Your browser does not support the audio format.
              </audio>
              <audio id="playerQueue" controls="controls">>
                <source :src="audio">
                Your browser does not support the audio format.
              </audio>
              <audio id="playerSuffix" controls="controls">>
                <source src="https://storage.googleapis.com/clinic_ruangkao/invite.wav">
                Your browser does not support the audio format.
              </audio>
            </v-col>
            <v-col>
              {{history}}
            </v-col>
          </v-row> -->
  </div>
</v-main>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue'
import moment from 'moment-timezone'
import { CardWaitingAll, BookingUseCar, CardQueueSummary } from '../TV'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    CardWaitingAll,
    BookingUseCar,
    CardQueueSummary
  },
  computed: {
    formattedTime () {
      return moment(this.currentTime, 'DD/MMM/YYYY hh:mm A').format('hh:mm A')
    },
    formattedDate () {
      const dateString = this.currentTime.split(' ')[0]
      const [day, month, year] = dateString.split('/')
      return `${parseInt(day)} ${month} ${year}`
      // return dateString
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
      const queueData = this.itemBookingUse.filter(
        item => item.queue !== '' && item.masBranchName !== ''
      )
      const emptyData = this.itemBookingUse.filter(
        item => item.queue === '' || item.masBranchName === ''
      )
      const sortedNonEmptyData = queueData
        .slice()
        .sort((a, b) => a.index - b.index)
        .reverse()

      // รวมข้อมูลที่มีค่าที่จัดเรียงแล้วและข้อมูลที่ว่าง
      return sortedNonEmptyData.concat(emptyData)
    },
    groupedData () {
      const chunkSize = 6
      const groups = []
      const sortedData = this.sortedDataQueueList
      console.log('sortedData', sortedData)

      // this.itemBookingUse = this.itemBookingUse.map(item => ({
      //   storeFrontQueue: item.storeFrontQueue,
      //   masBranchName: item.masBranchName
      // }))

      console.log('this.itemBookingUse groupedData', this.itemBookingUse)
      for (let i = 0; i < sortedData.length; i += chunkSize) {
        groups.push(sortedData.slice(i, i + chunkSize))
      }
      console.log('groups', groups)
      return groups
    }
  },
  created () {
    this.checkWiFiStatus()
    window.addEventListener('online', () => {
      this.wifiStatus = 'connected'
    })
    window.addEventListener('offline', () => {
      this.wifiStatus = 'disconnected'
    })
  },
  data () {
    return {
      masBranchName: '',
      // currentDate: moment().format('DD MMM YYYY'),
      // currentTime: moment().format('HH:mm'),
      orientation: '',
      statusSound: false,
      dateStartShow: '',
      video:
        'https://www.youtube.com/watch?v=B5TDAXLPrRY&list=RDCMUC-4vsQo3bHMzLuHyVM_iIRA&start_radio=1',
      validSearch: true,
      itemBooking: [],
      itemBookingUse: this.getTempleteQueue(),
      BookingDataList: [],
      menuStart: false,
      timeavailable: [],
      branchItem: [],
      masBranchID: '',
      DataFlowItem: [],
      flowSelect: '',
      dateStart: '',
      shop: [],
      dialog: false,
      dialogAdd: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      search: '',
      shopName: '',
      shopColor: '',
      shopImage: '',
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
      currentTime: moment().format('DD/MMM/YYYY HH:mm A'),
      wifiStatus: 'unknown',
      soundQueneNo: [],
      dataListPlay: [],
      queueSummary: [],
      groupQueueWaitingAll: [],
      resPondArr: []
    }
  },
  async mounted () {
    // this.changeStatusSound('on')
    this.checkOrientation()

    window.addEventListener('resize', this.checkOrientation)

    // เพิ่ม event listener เพื่อตรวจสอบการเปลี่ยนแปลงของ orientation
    window.addEventListener('orientationchange', this.checkOrientation)

    await this.getShop()
    await this.getDataFlow()
    await this.getDataBranch()
    this.setTime()
    document.querySelector('body').requestFullscreen()
    this.intervalSearch = setInterval(() => {
      this.searchBooking()
    }, 10000)
    this.interval = setInterval(() => {
      this.currentTime = moment().format('DD/MMM/YYYY HH:mm')
    }, 1000)
  },
  destroyed () {
    window.removeEventListener('resize', this.checkOrientation)
  },
  beforeDestroy () {
    this.$root.$off('dataReturn')
    clearInterval(this.interval)
    clearInterval(this.intervalSearch)
    this.statusSound = false
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
    async changeStatusSound (text) {
      if (text === 'on') {
        this.statusSound = true
        await this.updatestatusNotifyByShopId()
        await this.getMessage()
      } else {
        this.statusSound = false
        clearInterval(this.statusSoundCheck)
        this.statusSoundCheck = null
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
            `${this.DNS_IP}/callQueues/get?statusNotify=False&shopId=` +
              this.$session.getAll().data.shopId
          )
          .then(async response => {
            // เช็ค this.statusSound ต้องเป็น true ถึงจะให้เล่นเสียง
            // ถ้า response.data เป็น object = ไม่มีข้อมูล | ถ้า response.data เป็น array = มีข้อมูล, response.data.status = undefined เพราะเป็นการเช็ค object แต่เอามาเช็ค array จึงทำให้ undefined
            if (
              (Array.isArray(response.data) &&
                response.data.length > 0 &&
                this.statusSound) ||
              (typeof response.data === 'object' &&
                typeof response.data.status !== 'boolean' &&
                this.statusSound)
            ) {
              clearInterval(this.objInterval)
              let result = await this.generateSound(response.data[0])
              await this.updateMessage(response.data[0].id, result)
              clearInterval(this.statusSoundCheck)
              this.statusSoundCheck = null
              this.statusSoundCheck = setTimeout(this.getMessage, 12000)
            } else {
              clearInterval(this.statusSoundCheck)
              this.statusSoundCheck = null
              this.statusSoundCheck = setTimeout(this.getMessage, 2500)
            }
          })
      } catch (e) {
        // console.log(e)
        setTimeout(this.getMessage, 10000)
      }
    },
    async updateMessage (id, result) {
      const params = {
        statusNotify: 'True',
        audioFile: result.audio_url
      }
      axios.post(`${this.DNS_IP}/callQueues/edit/${id}`, params)
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
        let oldSound = this.soundQueneNo.filter(row => {
          return row.queue === item.storeFrontQueue
        })
        item.audioFile = null
        if (oldSound && oldSound.length > 0) {
          item.audioFile = oldSound[0].audioFile
        } else {
          // console.log('oldSound no have')
          await axios
            .get(
              `${this.DNS_IP}/callQueues/get?storeFrontQueue=${item.storeFrontQueue}&shopId=` +
                this.$session.getAll().data.shopId +
                `&audioFile=notNull`
            )
            .then(async response => {
              // console.log('nont oldSound callQueues', response.data)
              if (
                (Array.isArray(response.data) &&
                  response.data.length > 0 &&
                  this.statusSound) ||
                (typeof response.data === 'object' &&
                  typeof response.data.status !== 'boolean' &&
                  this.statusSound)
              ) {
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
              {
                headers: {
                  'Botnoi-Token':
                    'VTNjZDc5OTM3ZjM4MDg4NzhkYzlkMTI0ZjNiZWZlMTZkNTYxODk0'
                }
              }
            )
            .then(res => {
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
        // console.log(e)
        return null
      }
    },
    convertItemtoText (item) {
      let { dock, regNo, storeFrontQueue } = item
      console.log(dock, regNo, storeFrontQueue)
      dock = dock.replace('Dock ', '')
      storeFrontQueue = storeFrontQueue.split('')
      storeFrontQueue[0] = storeFrontQueue[0] + ' delay{0.2} '
      storeFrontQueue = storeFrontQueue.join(' ')
      let text = `ขอเชิญ คิว ${storeFrontQueue} ที่ช่อง ${dock} ค่ะ`
      return text
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
        playerPrefix.onended = event => {
          playerQueue.load()
          playerQueue.play()
          playerQueue.onended = event => {
            playerSuffix.load()
            playerSuffix.play()
            playerSuffix.onended = event => {
              if (this.timeCount < this.repeatRound) {
                this.timeCount++
                playerPrefix.play()
                playerPrefix.onended = event => {
                  playerQueue.play()
                  playerQueue.onended = event => {
                    playerSuffix.play()
                    playerSuffix.onended = event => {
                      vid.play()
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        // console.log('Error playSound', error)
      }
    },
    async getShop () {
      this.shop = []
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.shop = rs
            this.shopName = rs[0].shopName
            this.shopColor = rs[0].primaryColor
            this.shopImage = rs[0].shopImge
            this.videoLinkMonition = rs[0].videoLinkMonition
          } else {
            this.shopName = ''
            this.shopColor = ''
            this.shopImage = ''
          }
        })
    },
    validate (Action) {
      switch (Action) {
        case 'SEARCH':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_search.validate()
          })
          break
        default:
          break
      }
    },
    checkSearch () {
      this.validate('SEARCH')
      setTimeout(() => this.searchBooking(), 500)
    },
    async searchBooking () {
      this.queueSummary = []
      this.itemBooking = []
      // this.itemBookingUse = this.getTempleteQueue()
      if (this.validSearch === true) {
        let urlApi =
          this.DNS_IP +
          '/booking_view/get?shopId=' +
          this.shopId +
          '&masBranchID=' +
          this.masBranchID +
          // '&flowId=' +
          // this.flowSelect +
          '&dueDate=' +
          moment().format('YYYY-MM-DD') +
          '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
        // '&dueDate=' +
        // this.dateStart + ' ' + this.time + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
        await axios.get(urlApi).then(async response => {
          let rs = response.data
          console.log('rs : ', rs)
          if (rs.length > 0) {
            this.groupQueueWaitingAll = rs.filter(el => {
              return el.statusBt === 'confirm'
            })
            let sortData = rs.sort((a, b) => {
              if (a.storeFrontQueue < b.storeFrontQueue) return -1
              return a.storeFrontQueue > b.storeFrontQueue ? 1 : 0
            })
            for (let i = 0; i < sortData.length; i++) {
              let d = sortData[i]
              d.servicePoint = d.servicePoint || ''
              this.itemBooking.push(d)
            }
            let dataCon = this.itemBooking.filter(el => {
              return el.statusBt === 'confirmJob'
            })
            let dataWain = this.itemBooking.filter(el => {
              return el.statusBt === 'confirm'
            })
            let sortDataDataCon = dataCon.sort((a, b) => {
              if (a.LAST_DATE > b.LAST_DATE) return -1
              return a.LAST_DATE < b.LAST_DATE ? 1 : 0
            })
            this.queueSummary = await this.groupCountType(dataWain)
            this.countConfirm = dataWain.length
            this.countConfirmList = dataWain.filter((el, ind) => {
              return ind <= 11
            })
            this.itemBookingUse = sortDataDataCon.filter((el, ind) => {
              return ind <= 5
            })

            this.resPondArr = rs.filter(el => {
              return el.statusBt === 'confirmJob'
            })
            console.log('this.resPondArr', this.resPondArr)

            // this.resPondArr = this.resPondArr.sort((a, b) => {
            //   if (a.storeFrontQueue < b.storeFrontQueue) return -1
            //   return a.storeFrontQueue > b.storeFrontQueue ? 1 : 0
            // })
            this.resPondArr.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return (
                new Date(b.CREATE_DATE_Status) - new Date(a.CREATE_DATE_Status)
              )
            })

            this.resPondArr = this.resPondArr.slice(0, 18)

            // console.log('this.itemBookingUs book', this.itemBookingUse)
          } else {
            this.itemBookingUse = this.getTempleteQueue()
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
        const countStoreFrontText = dataConfirm.reduce(
          (accumulator, currentValue) => {
            const text = currentValue.storeFrontText
            accumulator[text] = (accumulator[text] || 0) + 1
            return accumulator
          },
          {}
        )
        const queueSummaryArray = Object.entries(countStoreFrontText).map(
          ([key, value]) => {
            return { key, value }
          }
        )
        if (queueSummaryArray.length > 0) {
          return queueSummaryArray
        }
      } catch (error) {
        // console.log('error', error)
      }
    },
    getDataFromFieldName (data, key) {
      if (data !== undefined) {
        return data.filter(function (el) {
          return el.fieldName === key
        })
      } else {
        return []
      }
    },
    async getBookingDataList (dateStart) {
      this.BookingDataList = []
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
      // let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}&flowId=${this.flowSelect}`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach(row => {
              if (typeof this.BookingDataList[row.bookNo] === 'undefined') {
                this.BookingDataList[row.bookNo] = []
              }
              this.BookingDataList[row.bookNo].push(row)
            })
          }
        })
        .catch(error => {
          // this.dataEditReady = true
          setTimeout(() => this.getBookingDataList(dateStart), 3000)
          console.log('catch getBookingDataList : ', error)
        })
      // console.log('this.BookingDataList1', this.BookingDataList)
    },
    setTime () {
      this.timeavailable = []
      let checkFlow = this.DataFlowItem.filter(el => {
        return el.value === this.flowSelect
      })
      if (checkFlow.length > 0) {
        this.timeavailable = JSON.parse(checkFlow[0].allData.setTime)
      } else {
        this.timeavailable = []
      }
    },
    async getDataFlow () {
      let resultOption = []
      await axios
        .get(
          this.DNS_IP + `/flow/get?shopId=${this.shopId}&storeFrontCheck=True`
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.textEng = d.flowNameEn
              s.text = d.flowName
              s.value = d.flowId
              s.storeFrontText = d.storeFrontText
              s.allData = d
              resultOption.push(s)
              // console.log('this.DataFlowName', this.DataFlowName)
            }
          } else {
            resultOption = []
          }
        })
      this.DataFlowItem = resultOption
      if (resultOption.length > 0) {
        this.flowSelect = this.DataFlowItem[0].value
      }
    },
    async getDataBranch () {
      // if (localStorage.getItem('BRANCH') === null) {
      //   let temp = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName')
      //   console.log(typeof temp)
      //   localStorage.setItem('BRANCH', JSON.stringify(temp))
      // }
      // this.branch = JSON.parse(localStorage.getItem('BRANCH'))
      this.branchItem = await this.getDataFromAPI(
        '/master_branch/get',
        'masBranchID',
        'masBranchName',
        '',
        'masBranchNameEn'
      )
      if (this.branchItem && this.branchItem.length > 0) {
        const branchSession = this.session.data.masBranchID
        let USER_ROLE = this.session.data.USER_ROLE || ''
        if (USER_ROLE === 'user' && branchSession) {
          const matchBranch = this.branchItem.filter(
            branch => branch.allData.masBranchID === branchSession
          )
          this.userBranch = matchBranch
          this.branchItem =
            matchBranch.length > 0 ? matchBranch : this.branchItem
          this.masBranchID = this.branchItem[0].value
          this.masBranchName = this.branchItem[0].text
        } else {
          // (Role: admin และ user ที่ไม่ผูก branch ) จะ fix masBranchID เพื่อโชว์คิวหน้า tv เฉพาะสำนักงานใหญ่
          const headOffice = this.branchItem.find(
            branch => branch.text === 'สำนักงานใหญ่'
          )
          this.masBranchID = headOffice ? headOffice.allData.masBranchID : null
          this.masBranchName = this.branchItem[0].text
        }
      }
    },
    async getDataFromAPI (url, fieldId, fieldName, param, fieldNameEn) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.shopId}${param}`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d[fieldName]
              if (fieldNameEn) {
                s.textEng = d[fieldNameEn]
              }
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
    async closeJobSubmit (item) {
      this.$swal({
        title: 'ให้บริการ เสร็จเรียบร้อยแล้ว ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#fa0202',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async response => {
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
          .post(this.DNS_IP + '/booking_transaction/add', dtt)
          .then(async responses => {
            this.$swal('เรียบร้อย', 'นำเข้าสำเร็จ', 'success')
            await this.searchBooking()
            let bookSelect = this.itemBooking.filter((element, index) => {
              return index <= 2
            })
            if (bookSelect.length > 0) {
              for (let i = 0; i < bookSelect.length; i++) {
                let d = bookSelect[i]
                let s = {}
                s.lineUserId = d.lineUserId || ''
                if (s.lineUserId !== '') {
                  await axios
                    .post(this.DNS_IP + '/Booking/pushMsgQueue/' + d.bookNo)
                    .then(async responses => {})
                    .catch(error => {
                      console.log('error function pushMsgQueue : ', error)
                    })
                }
              }
            }
          })
      })
    },
    checkWiFiStatus () {
      this.wifiStatus = navigator.onLine ? 'connected' : 'disconnected'
    }
  }
}
</script>
<style scope>
.fix-scroll {
  overflow: hidden;
  height: 100vh;
}
.centered-input >>> input {
  text-align: center;
}
#margin {
  margin-top: 50px;
  margin-bottom: 40px;
}
.v_text_edit {
  width: 255px;
  height: 52px;
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
  padding: 0.5rem;
}
.text-black >>> .v-input__slot {
  color: #005fcc !important;
}
.text-datetime,
.text-number-waiting {
  font-weight: 700;
}
.text-footer {
  font-size: 18px;
  font-weight: 900;
  color: #2e263d;
}
.divider-footer {
  width: 200px;
  height: 2px;
}
.bg-primary {
  background-image: linear-gradient(to bottom, #f7d142, #dfa627);
}
.bg-secondary {
  background-image: linear-gradient(to top, #f7d142, #dfa627);
}
.footer-color {
  background-color: #f2c300;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: auto;
}
.text-footer .v-divider {
  transform: translateY(30%);
}
.text-header {
  font-size: 4.5vw;
  font-weight: 900;
  color: #2e263d;
  opacity: 0.9;
  display: block;
  text-align: center;
  margin-top: 8px; /* Adjust this value as needed */
}
@media screen and (max-width: 793px) {
  .text-footer {
    font-size: 14px;
  }
}
@media screen and (max-width: 874px) {
  .respons_mobie {
    width: 100%; /* ปรับความกว้างของ v-row */
    height: 18%;
    /* margin: 0 auto; */
    /* margin-top: -50px; */
  }
  .respons_mobie img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .respons_mobie .v-col {
    display: flex;
    align-items: center; /* จัดให้รูปภาพอยู่ตรงกลางแนวตั้ง */
  }
  .respons_img1 {
    height: auto;
    max-height: 100px;
    margin-top: -50px;
  }
  .respons_img2 {
    height: auto;
    max-height: 100px;
    margin-right: -20px;
  }
  .respons_bg {
    height: auto;
    max-height: 100%;
  }
  .respons_logo {
    margin-left: 30px;
  }
}
</style>
