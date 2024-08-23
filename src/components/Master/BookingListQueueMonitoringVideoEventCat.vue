<template>
  <div :style="{ backgroundColor: shopColor, height: '100%', width: '100%' }">
    <div :class="`d-flex ${isPortrait ? 'flex-column' : 'flex-row'}`">
      <BookingUseEventCat :class="`${isPortrait ? '' : 'ml-5'}`" :isDark="true" :bookingUse="dataService.slice(0,6)" :isPortrait="isPortrait" />
      <div v-if="!isPortrait" class="col-7 d-flex flex-column">
        <div class="mt-5 w-100" style="text-align: center;">
          <img class="img-promot"
          :src="require('@/assets/fream-queue.png')"
      />
          <!-- <video v-if="videoLinkMonition.includes('firebasestorage')" ref="video" id="videoAds" class="col-12"
            width="100%" autoplay muted autopictureinpicture controls loop="true"
            poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
            <source :src="videoLinkMonition" type="video/webm">
          </video>
          <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px"
            :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length - 11) + '&autoplay=1&loop=1'"
            title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen></iframe> -->
        </div>
        <div class="h-100">
        <CardSubService :shopColor="shopColor" :booking="dataService.slice(6,12)" :empList="empList"/>
        <CardSubService :shopColor="shopColor" :booking="dataService.slice(12,19)" :empList="empList"/>
      </div>
      </div>
    </div>
    <div v-if="isPortrait">
      <CardSubService :isPortrait="isPortrait" :shopColor="shopColor" :booking="dataService.slice(6,10)" :empList="empList"/>
      <CardSubService :isPortrait="isPortrait" :shopColor="shopColor" :booking="dataService.slice(10,14)" :empList="empList"/>
      <CardSubService :isPortrait="isPortrait" :shopColor="shopColor" :booking="dataService.slice(14,19)" :empList="empList"/>
    </div>
    <div v-if="isPortrait" :class="`${isPortrait ? 'justify-content-center' : 'justify-content-between'} d-flex flex-row w-100`">
      <img
          width="85%"
          :src="require('@/assets/fream-queue.png')"
      />
      <!-- <video v-if="videoLinkMonition.includes('firebasestorage')" ref="video" id="videoAds" class="col-12" width="100%"
        autoplay muted autopictureinpicture controls loop="true"
        poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
        <source :src="videoLinkMonition" type="video/webm">
      </video>
      <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px"
        :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length - 11) + '&autoplay=1&loop=1'"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe> -->
    </div>
    <div :class="`d-flex flex-row justify-content-between mx-3 ${isPortrait ? '' : 'mt-3 ml-5'}`">
      <div class="col-6 py-0">
        <v-icon class="mr-3" color="#FFFFFF" large>
          {{ wifiIcon }}
        </v-icon>
        <v-btn icon large color="#FFFFFF" @click="changeStatusSound('off')" v-if="statusSound === true">
          <v-icon>mdi-volume-high</v-icon>
        </v-btn>
        <v-btn icon large color="#FFFFFF" @click="changeStatusSound('on')" v-else>
          <v-icon>mdi-volume-off</v-icon>
        </v-btn>
      </div>
      <div class="col-6 py-0 d-flex justify-content-end"><span class="text-white text-datetime">{{ formattedDateTime
          }}</span></div>
    </div>
    <v-row v-show="hideSound === true">
      <audio id="playerTV" controls="controls">
        Your browser does not support the audio format.
      </audio>
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
  },
  data () {
    return {
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
      currentTime: moment().format('DD/MMM/YYYY HH:mm'),
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
      dataListTest2: [1, 2, 3, 4, 5, 6]
    }
  },

  async mounted () {
    this.checkOrientation()
    this.setupEventListeners()
    await this.getShop()
    await this.getBooking()
    await this.getFirestore()
    this.startDateTimeInterval()
  },
  destroyed () {
    window.removeEventListener('resize', this.checkOrientation)
  },
  beforeDestroy () {
    this.$root.$off('dataReturn')
    clearInterval(this.interval)
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
    startDateTimeInterval () {
      this.interval = setInterval(() => {
        this.currentTime = moment().format('DD/MMM/YYYY HH:mm')
      }, 1000)
    },
    async getFirestore () {
      try {
        this.firestore = this.$firebase.firestore()
        const FieldPath = this.$firebase.firestore.FieldPath
        this.firestore.collection('CatEvent')
          .where(FieldPath.documentId(), '==', this.$session.getAll().data.userName)
          .onSnapshot((snapshot) => {
            if (snapshot.empty) {
              this.updateProcessUpdate()
            } else {
              const doc = snapshot.docs.find(doc => doc.id === this.$session.getAll().data.userName)
              if (doc && doc.data().active === '1') {
                this.updateProcessUpdate()
                this.getBooking()
                this.updateNotifyByShopId()
              }
            }
          })
      } catch (error) {
        console.log('Error getFirestore', error)
      }
    },
    updateProcessUpdate () {
      let params = {
        userName: this.$session.getAll().data.userName
      }
      axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/CatEvent-ProcessUseNew', params)
    },
    async changeStatusSound (text) {
      if (text === 'on') {
        this.statusSound = true
        await this.updateNotifyByShopId()
      } else {
        this.statusSound = false
      }
    },
    async getMessageNoInterval (storeFrontQueue, dueDateDay) {
      try {
        let branchId = this.$session.getAll().data.masBranchID || 2185
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
    playSoundBooking (playList) {
      let playerTV = document.getElementById('playerTV')
      // let video = document.getElementById('videoAds')
      try {
        if (playerTV.paused) {
          let roundCount = 0
          let maxRounds = 2
          // video.pause()
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
              // video.play()
            }
          }
          playerTV.onended = playNext
          playNext()
        } else {
          setTimeout(() => {
            this.playSoundBooking(playList)
          }, 2000)
        }
      } catch (error) {
        console.log('playSoundBooking', error)
      }
    },
    async getShop () {
      await axios
        .get(`${this.DNS_IP}/sys_shop/get?shopId=${this.$session.getAll().data.shopId}`)
        .then(response => {
          let data = response.data
          if (data.length > 0) {
            this.shopColor = data[0].secondaryColor
            this.videoLinkMonition = data[0].videoLinkMonition ? data[0].videoLinkMonition : 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/BeLinked.mp4?alt=media&token=f88d1f83-3009-4ba4-871b-8e25b60ab01c'
          }
        })
    },
    async getBooking () {
      let arrDataService = []
      try {
        await axios.get(`${this.DNS_IP}/booking_cat_event/getByEmpNoComfirmjob`)
          .then(async response => {
            if (response.data) {
              const res = response.data
              if (res.status) {
                arrDataService = res.data.map(element => {
                  if (element.empNo !== '') {
                    let servicePoint = this.empList.indexOf(parseInt(element.empNo))
                    element.servicePoint = servicePoint + 1
                  }
                  return element
                })
              } else {
                arrDataService = []
              }
            }
          })
      } catch (error) {
        console.log('Error')
      }
      this.dataService = arrDataService
      if (this.statusSound) {
        arrDataService.filter(item => item.statusNotify === 'False').forEach(itemIsNotify => {
          console.log(itemIsNotify)
          let playSound = ['https://storage.googleapis.com/cat-sound/prefix.wav']
          for (const character of itemIsNotify.storeFrontQueue) {
            playSound.push(`https://storage.googleapis.com/cat-sound/${parseInt(character)}.wav`)
          }
          let empId = this.empList.indexOf(parseInt(itemIsNotify.empNo))
          playSound.push(`https://storage.googleapis.com/cat-sound/suffix_${empId + 1}.wav`)
          this.playingSound.push({ playSound: playSound })
        }
        )
      }
      if (this.playingSound.length > 0) {
        this.playingSound.reverse()
        for (let index = this.playingSound.length - 1; index >= 0; index--) {
          let sound = this.playingSound[index]
          this.playSoundBooking(sound.playSound)
          this.playingSound.pop()
        }
      }
    },
    async updateNotifyByShopId () {
      const params = {
        statusNotify: 'True',
        shopId: this.$session.getAll().data.shopId
      }
      await axios.post(`${this.DNS_IP}/callQueues/updateStatusNotify`, params)
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
    },
    soundTest () {
      try {
        let filterData = this.dataList.filter(item => item.IsNotify === 'False')
        filterData.forEach(item => {
          let playSound = ['https://storage.googleapis.com/cat-sound/prefix.wav']
          for (const character of item.storeFrontQueue) {
            playSound.push(`https://storage.googleapis.com/cat-sound/${parseInt(character)}.wav`)
          }
          let empId = this.empList.indexOf(parseInt(item.empNo))
          playSound.push(`https://storage.googleapis.com/cat-sound/suffix_${empId + 1}.wav`)
          console.log(playSound)
          this.playSoundBooking(playSound)
        })
      } catch (error) {
        console.log('soundTest ->', error)
      }
    }
  }
}

</script>
<style scope>
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
.img-promot{
  width: 70%;
}
@media screen and (min-width: 1000px) {
  .img-promot{
  width: 85%;
}
}
@media screen and (min-width: 1500px) {
  .img-promot{
  width: 85%;
}
}
@media screen and (orientation: portrait) {
  .height-card {
    min-height: 16vh;
  }
}

@media screen and (orientation: landscape) {}
</style>
