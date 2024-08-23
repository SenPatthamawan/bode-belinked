<template>
    <div :style="{ backgroundColor: shopColor, height: '100%', width: '100%' }">
        <div :class="`d-flex ${isPortrait ? 'flex-column':'flex-row'}`">
            <BookingUse :bookingUse="itemBookingUse" :isPortrait="isPortrait"/>
            <div v-if="!isPortrait"  class="col-7 d-flex flex-column">
                <div class="mt-5">
                <video v-if="videoLinkMonition.includes('firebasestorage')" ref="video" id="videoAds" class="col-12" width="100%" autoplay muted autopictureinpicture controls loop="true" poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
                <source :src="videoLinkMonition" type="video/webm">
              </video>
                 <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px" :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length -11) + '&autoplay=1&loop=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
                <div class="d-flex flex-row justify-content-between mx-4 mt-5 h-100">
                <CardWaiting :groupQueueItem="GroupQueueItem.one" time="10"/>
                <CardWaiting :groupQueueItem="GroupQueueItem.two" time="10 - 20"/>
                <CardWaiting :groupQueueItem="GroupQueueItem.three" time="20 - 30"/>
              </div>
            </div>
        </div>
       <div v-if="isPortrait" class="col-12 d-flex flex-row justify-content-between height-card">
            <CardWaiting :groupQueueItem="GroupQueueItem.one" time="10"/>
            <CardWaiting :groupQueueItem="GroupQueueItem.two" time="10 - 20"/>
            <CardWaiting :groupQueueItem="GroupQueueItem.three" time="20 - 30"/>
       </div>
        <div v-if="isPortrait" class="d-flex flex-row justify-content-between">
            <video v-if="videoLinkMonition.includes('firebasestorage')" ref="video" id="videoAds" class="col-12" width="100%" autoplay muted autopictureinpicture controls loop="true" poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
                <source :src="videoLinkMonition" type="video/webm">
             </video>
            <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px" :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length -11) + '&autoplay=1&loop=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
       </div>
        <div :class="`d-flex flex-row justify-content-between mx-3 ${isPortrait ? '' : 'mt-3'}`">
            <div class="col-6 py-0">
              <v-icon class="mr-3" large>
               {{ wifiIcon }}
               </v-icon>
               <v-btn icon
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
                      </v-btn>
                    </div>
            <div class="col-6 py-0 d-flex justify-content-end"><span class="text-datetime">{{ formattedDateTime }}</span></div>
        </div>
        <v-row v-show="hideSound === true">
          <v-col>
            <audio id="playerPrefix" controls="controls">>
              <source src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FQNumber.wav?alt=media&token=451f683b-28da-44d0-8673-f5d25a84a9e1">
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
            {{history}}
          </v-col>
        </v-row>
    </div>
  </template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import pdfMake from 'pdfmake'
import pdfFonts from '../../assets/custom-fonts.js' // 1. import custom fonts
import moment from 'moment-timezone'
import { CardWaiting, BookingUse } from '../TV'
export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    CardWaiting,
    BookingUse
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
    setInterval(this.getNow, 1000)
    this.checkWiFiStatus()
    window.addEventListener('online', () => { this.wifiStatus = 'connected' })
    window.addEventListener('offline', () => { this.wifiStatus = 'disconnected' })
  },
  data () {
    return {
      orientation: '',
      statusSound: false,
      dateStartShow: '',
      video: 'https://www.youtube.com/watch?v=B5TDAXLPrRY&list=RDCMUC-4vsQo3bHMzLuHyVM_iIRA&start_radio=1',
      DiSize: null,
      setTimerCalendar: null,
      languageSelect: 0,
      DarkModeBackground: '#FFFFFF',
      validSearch: true,
      itemBooking: [],
      itemBookingUse: [],
      BookingDataList: [],
      menuStart: false,
      dialogPrint: false,
      time: '',
      timeavailable: [],
      branchItem: [],
      masBranchID: '',
      DataFlowItem: [],
      flowSelect: '',
      dateStart: '',
      shop: [],
      // fieldNameEn: [{textTH: 'นวดคอ บ่า ไหล่', textEN: 'Nack & Shoulder  Massage'}, {textTH: 'นวดตอกเส้น', textEN: 'TOK  SEN MASSAGE'}, {textTH: 'นวดหินร้อน', textEN: 'HOT STONE MASSAGE'}],
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'จัดการ Queue',
          disabled: false,
          href: '/Master/BookingListQueue'
        }
      ],
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
      GroupQueueItem: {
        'one': [],
        'two': [],
        'three': []
      },
      checkRef: false,
      currentTime: moment().format('DD/MMM/YYYY HH:mm'),
      isPortrait: true,
      wifiStatus: 'unknown',
      soundQueneNo: [
        { 'queue': 'A001', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A001.wav' },
        { 'queue': 'A002', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A002.wav' },
        { 'queue': 'A003', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A003.wav' },
        { 'queue': 'A004', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A004.wav' },
        { 'queue': 'A005', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A005.wav' },
        { 'queue': 'A006', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A006.wav' },
        { 'queue': 'A007', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A007.wav' },
        { 'queue': 'A008', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A008.wav' },
        { 'queue': 'A009', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A009.wav' },
        { 'queue': 'A010', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A010.wav' },
        { 'queue': 'A011', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A011.wav' },
        { 'queue': 'A012', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A012.wav' },
        { 'queue': 'A013', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A013.wav' },
        { 'queue': 'A014', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A014.wav' },
        { 'queue': 'A015', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A015.wav' },
        { 'queue': 'A016', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A016.wav' },
        { 'queue': 'A017', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A017.wav' },
        { 'queue': 'A018', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A018.wav' },
        { 'queue': 'A019', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A019.wav' },
        { 'queue': 'A020', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A020.wav' },
        { 'queue': 'A021', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A021.wav' },
        { 'queue': 'A022', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A022.wav' },
        { 'queue': 'A023', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A023.wav' },
        { 'queue': 'A024', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A024.wav' },
        { 'queue': 'A025', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A025.wav' },
        { 'queue': 'A026', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A026.wav' },
        { 'queue': 'A027', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A027.wav' },
        { 'queue': 'A028', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A028.wav' },
        { 'queue': 'A029', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A029.wav' },
        { 'queue': 'A030', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A030.wav' },
        { 'queue': 'A031', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A031.wav' },
        { 'queue': 'A032', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A032.wav' },
        { 'queue': 'A033', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A033.wav' },
        { 'queue': 'A034', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A034.wav' },
        { 'queue': 'A035', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A035.wav' },
        { 'queue': 'A036', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A036.wav' },
        { 'queue': 'A037', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A037.wav' },
        { 'queue': 'A038', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A038.wav' },
        { 'queue': 'A039', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A039.wav' },
        { 'queue': 'A040', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A040.wav' },
        { 'queue': 'A041', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A041.wav' },
        { 'queue': 'A042', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A042.wav' },
        { 'queue': 'A043', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A043.wav' },
        { 'queue': 'A044', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A044.wav' },
        { 'queue': 'A045', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A045.wav' },
        { 'queue': 'A046', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A046.wav' },
        { 'queue': 'A047', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A047.wav' },
        { 'queue': 'A048', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A048.wav' },
        { 'queue': 'A049', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A049.wav' },
        { 'queue': 'A050', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A050.wav' },
        { 'queue': 'A051', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A051.wav' },
        { 'queue': 'A052', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A052.wav' },
        { 'queue': 'A053', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A053.wav' },
        { 'queue': 'A054', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A054.wav' },
        { 'queue': 'A055', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A055.wav' },
        { 'queue': 'A056', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A056.wav' },
        { 'queue': 'A057', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A057.wav' },
        { 'queue': 'A058', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A058.wav' },
        { 'queue': 'A059', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A059.wav' },
        { 'queue': 'A060', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A060.wav' },
        { 'queue': 'A061', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A061.wav' },
        { 'queue': 'A062', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A062.wav' },
        { 'queue': 'A063', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A063.wav' },
        { 'queue': 'A064', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A064.wav' },
        { 'queue': 'A065', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A065.wav' },
        { 'queue': 'A066', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A066.wav' },
        { 'queue': 'A067', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A067.wav' },
        { 'queue': 'A068', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A068.wav' },
        { 'queue': 'A069', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A069.wav' },
        { 'queue': 'A070', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A070.wav' },
        { 'queue': 'A071', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A071.wav' },
        { 'queue': 'A072', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A072.wav' },
        { 'queue': 'A073', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A073.wav' },
        { 'queue': 'A074', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A074.wav' },
        { 'queue': 'A075', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A075.wav' },
        { 'queue': 'A076', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A076.wav' },
        { 'queue': 'A077', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A077.wav' },
        { 'queue': 'A078', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A078.wav' },
        { 'queue': 'A079', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A079.wav' },
        { 'queue': 'A080', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A080.wav' },
        { 'queue': 'A081', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A081.wav' },
        { 'queue': 'A082', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A082.wav' },
        { 'queue': 'A083', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A083.wav' },
        { 'queue': 'A084', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A084.wav' },
        { 'queue': 'A085', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A085.wav' },
        { 'queue': 'A086', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A086.wav' },
        { 'queue': 'A087', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A087.wav' },
        { 'queue': 'A088', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A088.wav' },
        { 'queue': 'A089', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A089.wav' },
        { 'queue': 'A090', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A090.wav' },
        { 'queue': 'A091', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A091.wav' },
        { 'queue': 'A092', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A092.wav' },
        { 'queue': 'A093', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A093.wav' },
        { 'queue': 'A094', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A094.wav' },
        { 'queue': 'A095', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A095.wav' },
        { 'queue': 'A096', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A096.wav' },
        { 'queue': 'A097', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A097.wav' },
        { 'queue': 'A098', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A098.wav' },
        { 'queue': 'A099', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A099.wav' },
        { 'queue': 'A100', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A100.wav' },
        { 'queue': 'A101', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A101.wav' },
        { 'queue': 'A102', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A102.wav' },
        { 'queue': 'A103', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A103.wav' },
        { 'queue': 'A104', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A104.wav' },
        { 'queue': 'A105', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A105.wav' },
        { 'queue': 'A106', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A106.wav' },
        { 'queue': 'A107', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A107.wav' },
        { 'queue': 'A108', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A108.wav' },
        { 'queue': 'A109', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A109.wav' },
        { 'queue': 'A110', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A110.wav' },
        { 'queue': 'A111', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A111.wav' },
        { 'queue': 'A112', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A112.wav' },
        { 'queue': 'A113', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A113.wav' },
        { 'queue': 'A114', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A114.wav' },
        { 'queue': 'A115', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A115.wav' },
        { 'queue': 'A116', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A116.wav' },
        { 'queue': 'A117', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A117.wav' },
        { 'queue': 'A118', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A118.wav' },
        { 'queue': 'A119', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A119.wav' },
        { 'queue': 'A120', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A120.wav' },
        { 'queue': 'A121', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A121.wav' },
        { 'queue': 'A122', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A122.wav' },
        { 'queue': 'A123', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A123.wav' },
        { 'queue': 'A124', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A124.wav' },
        { 'queue': 'A125', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A125.wav' },
        { 'queue': 'A126', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A126.wav' },
        { 'queue': 'A127', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A127.wav' },
        { 'queue': 'A128', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A128.wav' },
        { 'queue': 'A129', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A129.wav' },
        { 'queue': 'A130', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A130.wav' },
        { 'queue': 'A131', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A131.wav' },
        { 'queue': 'A132', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A132.wav' },
        { 'queue': 'A133', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A133.wav' },
        { 'queue': 'A134', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A134.wav' },
        { 'queue': 'A135', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A135.wav' },
        { 'queue': 'A136', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A136.wav' },
        { 'queue': 'A137', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A137.wav' },
        { 'queue': 'A138', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A138.wav' },
        { 'queue': 'A139', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A139.wav' },
        { 'queue': 'A140', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A140.wav' },
        { 'queue': 'A141', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A141.wav' },
        { 'queue': 'A142', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A142.wav' },
        { 'queue': 'A143', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A143.wav' },
        { 'queue': 'A144', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A144.wav' },
        { 'queue': 'A145', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A145.wav' },
        { 'queue': 'A146', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A146.wav' },
        { 'queue': 'A147', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A147.wav' },
        { 'queue': 'A148', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A148.wav' },
        { 'queue': 'A149', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A149.wav' },
        { 'queue': 'A150', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A150.wav' },
        { 'queue': 'A151', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A151.wav' },
        { 'queue': 'A152', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A152.wav' },
        { 'queue': 'A153', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A153.wav' },
        { 'queue': 'A154', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A154.wav' },
        { 'queue': 'A155', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A155.wav' },
        { 'queue': 'A156', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A156.wav' },
        { 'queue': 'A157', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A157.wav' },
        { 'queue': 'A158', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A158.wav' },
        { 'queue': 'A159', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A159.wav' },
        { 'queue': 'A160', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A160.wav' },
        { 'queue': 'A161', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A161.wav' },
        { 'queue': 'A162', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A162.wav' },
        { 'queue': 'A163', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A163.wav' },
        { 'queue': 'A164', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A164.wav' },
        { 'queue': 'A165', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A165.wav' },
        { 'queue': 'A166', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A166.wav' },
        { 'queue': 'A167', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A167.wav' },
        { 'queue': 'A168', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A168.wav' },
        { 'queue': 'A169', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A169.wav' },
        { 'queue': 'A170', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A170.wav' },
        { 'queue': 'A171', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A171.wav' },
        { 'queue': 'A172', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A172.wav' },
        { 'queue': 'A173', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A173.wav' },
        { 'queue': 'A174', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A174.wav' },
        { 'queue': 'A175', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A175.wav' },
        { 'queue': 'A176', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A176.wav' },
        { 'queue': 'A177', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A177.wav' },
        { 'queue': 'A178', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A178.wav' },
        { 'queue': 'A179', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A179.wav' },
        { 'queue': 'A180', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A180.wav' },
        { 'queue': 'A181', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A181.wav' },
        { 'queue': 'A182', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A182.wav' },
        { 'queue': 'A183', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A183.wav' },
        { 'queue': 'A184', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A184.wav' },
        { 'queue': 'A185', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A185.wav' },
        { 'queue': 'A186', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A186.wav' },
        { 'queue': 'A187', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A187.wav' },
        { 'queue': 'A188', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A188.wav' },
        { 'queue': 'A189', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A189.wav' },
        { 'queue': 'A190', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A190.wav' },
        { 'queue': 'A191', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A191.wav' },
        { 'queue': 'A192', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A192.wav' },
        { 'queue': 'A193', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A193.wav' },
        { 'queue': 'A194', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A194.wav' },
        { 'queue': 'A195', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A195.wav' },
        { 'queue': 'A196', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A196.wav' },
        { 'queue': 'A197', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A197.wav' },
        { 'queue': 'A198', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A198.wav' },
        { 'queue': 'A199', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A199.wav' },
        { 'queue': 'A200', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A200.wav' },
        { 'queue': 'A201', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A201.wav' },
        { 'queue': 'A202', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A202.wav' },
        { 'queue': 'A203', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A203.wav' },
        { 'queue': 'A204', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A204.wav' },
        { 'queue': 'A205', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A205.wav' },
        { 'queue': 'A206', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A206.wav' },
        { 'queue': 'A207', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A207.wav' },
        { 'queue': 'A208', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A208.wav' },
        { 'queue': 'A209', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A209.wav' },
        { 'queue': 'A210', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A210.wav' },
        { 'queue': 'A211', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A211.wav' },
        { 'queue': 'A212', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A212.wav' },
        { 'queue': 'A213', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A213.wav' },
        { 'queue': 'A214', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A214.wav' },
        { 'queue': 'A215', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A215.wav' },
        { 'queue': 'A216', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A216.wav' },
        { 'queue': 'A217', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A217.wav' },
        { 'queue': 'A218', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A218.wav' },
        { 'queue': 'A219', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A219.wav' },
        { 'queue': 'A220', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A220.wav' },
        { 'queue': 'A221', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A221.wav' },
        { 'queue': 'A222', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A222.wav' },
        { 'queue': 'A223', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A223.wav' },
        { 'queue': 'A224', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A224.wav' },
        { 'queue': 'A225', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A225.wav' },
        { 'queue': 'A226', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A226.wav' },
        { 'queue': 'A227', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A227.wav' },
        { 'queue': 'A228', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A228.wav' },
        { 'queue': 'A229', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A229.wav' },
        { 'queue': 'A230', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A230.wav' },
        { 'queue': 'A231', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A231.wav' },
        { 'queue': 'A232', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A232.wav' },
        { 'queue': 'A233', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A233.wav' },
        { 'queue': 'A234', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A234.wav' },
        { 'queue': 'A235', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A235.wav' },
        { 'queue': 'A236', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A236.wav' },
        { 'queue': 'A237', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A237.wav' },
        { 'queue': 'A238', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A238.wav' },
        { 'queue': 'A239', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A239.wav' },
        { 'queue': 'A240', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A240.wav' },
        { 'queue': 'A241', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A241.wav' },
        { 'queue': 'A242', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A242.wav' },
        { 'queue': 'A243', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A243.wav' },
        { 'queue': 'A244', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A244.wav' },
        { 'queue': 'A245', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A245.wav' },
        { 'queue': 'A246', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A246.wav' },
        { 'queue': 'A247', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A247.wav' },
        { 'queue': 'A248', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A248.wav' },
        { 'queue': 'A249', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A249.wav' },
        { 'queue': 'A250', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A250.wav' },
        { 'queue': 'A251', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A251.wav' },
        { 'queue': 'A252', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A252.wav' },
        { 'queue': 'A253', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A253.wav' },
        { 'queue': 'A254', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A254.wav' },
        { 'queue': 'A255', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A255.wav' },
        { 'queue': 'A256', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A256.wav' },
        { 'queue': 'A257', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A257.wav' },
        { 'queue': 'A258', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A258.wav' },
        { 'queue': 'A259', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A259.wav' },
        { 'queue': 'A260', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A260.wav' },
        { 'queue': 'A261', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A261.wav' },
        { 'queue': 'A262', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A262.wav' },
        { 'queue': 'A263', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A263.wav' },
        { 'queue': 'A264', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A264.wav' },
        { 'queue': 'A265', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A265.wav' },
        { 'queue': 'A266', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A266.wav' },
        { 'queue': 'A267', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A267.wav' },
        { 'queue': 'A268', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A268.wav' },
        { 'queue': 'A269', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A269.wav' },
        { 'queue': 'A270', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A270.wav' },
        { 'queue': 'A271', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A271.wav' },
        { 'queue': 'A272', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A272.wav' },
        { 'queue': 'A273', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A273.wav' },
        { 'queue': 'A274', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A274.wav' },
        { 'queue': 'A275', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A275.wav' },
        { 'queue': 'A276', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A276.wav' },
        { 'queue': 'A277', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A277.wav' },
        { 'queue': 'A278', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A278.wav' },
        { 'queue': 'A279', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A279.wav' },
        { 'queue': 'A280', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A280.wav' },
        { 'queue': 'A281', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A281.wav' },
        { 'queue': 'A282', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A282.wav' },
        { 'queue': 'A283', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A283.wav' },
        { 'queue': 'A284', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A284.wav' },
        { 'queue': 'A285', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A285.wav' },
        { 'queue': 'A286', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A286.wav' },
        { 'queue': 'A287', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A287.wav' },
        { 'queue': 'A288', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A288.wav' },
        { 'queue': 'A289', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A289.wav' },
        { 'queue': 'A290', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A290.wav' },
        { 'queue': 'A291', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A291.wav' },
        { 'queue': 'A292', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A292.wav' },
        { 'queue': 'A293', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A293.wav' },
        { 'queue': 'A294', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A294.wav' },
        { 'queue': 'A295', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A295.wav' },
        { 'queue': 'A296', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A296.wav' },
        { 'queue': 'A297', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A297.wav' },
        { 'queue': 'A298', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A298.wav' },
        { 'queue': 'A299', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A299.wav' },
        { 'queue': 'A300', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A300.wav' },
        { 'queue': 'A301', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A301.wav' },
        { 'queue': 'A302', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A302.wav' },
        { 'queue': 'A303', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A303.wav' },
        { 'queue': 'A304', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A304.wav' },
        { 'queue': 'A305', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A305.wav' },
        { 'queue': 'A306', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A306.wav' },
        { 'queue': 'A307', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A307.wav' },
        { 'queue': 'A308', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A308.wav' },
        { 'queue': 'A315', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A315.wav' },
        { 'queue': 'A316', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A316.wav' },
        { 'queue': 'A317', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A317.wav' },
        { 'queue': 'A318', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A318.wav' },
        { 'queue': 'A319', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A319.wav' },
        { 'queue': 'A320', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A320.wav' },
        { 'queue': 'A321', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A321.wav' },
        { 'queue': 'A322', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A322.wav' },
        { 'queue': 'A323', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A323.wav' },
        { 'queue': 'A324', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A324.wav' },
        { 'queue': 'A325', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A325.wav' },
        { 'queue': 'A326', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A326.wav' },
        { 'queue': 'A327', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A327.wav' },
        { 'queue': 'A328', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A328.wav' },
        { 'queue': 'A329', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A329.wav' },
        { 'queue': 'A330', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A330.wav' },
        { 'queue': 'A331', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A331.wav' },
        { 'queue': 'A332', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A332.wav' },
        { 'queue': 'A333', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A333.wav' },
        { 'queue': 'A334', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A334.wav' },
        { 'queue': 'A335', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A335.wav' },
        { 'queue': 'A336', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A336.wav' },
        { 'queue': 'A337', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A337.wav' },
        { 'queue': 'A338', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A338.wav' },
        { 'queue': 'A339', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A339.wav' },
        { 'queue': 'A340', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A340.wav' },
        { 'queue': 'A341', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A341.wav' },
        { 'queue': 'A342', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A342.wav' },
        { 'queue': 'A343', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A343.wav' },
        { 'queue': 'A344', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A344.wav' },
        { 'queue': 'A345', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A345.wav' },
        { 'queue': 'A346', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A346.wav' },
        { 'queue': 'A347', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A347.wav' },
        { 'queue': 'A348', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A348.wav' },
        { 'queue': 'A349', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A349.wav' },
        { 'queue': 'A350', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A350.wav' },
        { 'queue': 'A351', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A351.wav' },
        { 'queue': 'A352', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A352.wav' },
        { 'queue': 'A353', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A353.wav' },
        { 'queue': 'A354', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A354.wav' },
        { 'queue': 'A355', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A355.wav' },
        { 'queue': 'A356', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A356.wav' },
        { 'queue': 'A357', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A357.wav' },
        { 'queue': 'A358', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A358.wav' },
        { 'queue': 'A359', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A359.wav' },
        { 'queue': 'A360', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A360.wav' },
        { 'queue': 'A361', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A361.wav' },
        { 'queue': 'A362', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A362.wav' },
        { 'queue': 'B001', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B001.wav' },
        { 'queue': 'B002', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B002.wav' },
        { 'queue': 'B003', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B003.wav' },
        { 'queue': 'B004', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B004.wav' },
        { 'queue': 'B005', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B005.wav' },
        { 'queue': 'B006', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B006.wav' },
        { 'queue': 'B007', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B007.wav' },
        { 'queue': 'B008', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B008.wav' },
        { 'queue': 'B009', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B009.wav' },
        { 'queue': 'B010', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B010.wav' },
        { 'queue': 'B011', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B011.wav' },
        { 'queue': 'B012', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B012.wav' },
        { 'queue': 'B013', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B013.wav' },
        { 'queue': 'B014', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B014.wav' },
        { 'queue': 'B015', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B015.wav' },
        { 'queue': 'B016', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B016.wav' },
        { 'queue': 'B017', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B017.wav' },
        { 'queue': 'B018', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B018.wav' },
        { 'queue': 'B019', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B019.wav' },
        { 'queue': 'B020', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B020.wav' },
        { 'queue': 'B021', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B021.wav' },
        { 'queue': 'B022', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B022.wav' },
        { 'queue': 'B023', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B023.wav' },
        { 'queue': 'B024', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B024.wav' },
        { 'queue': 'B025', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B025.wav' },
        { 'queue': 'B026', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B026.wav' },
        { 'queue': 'B027', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B027.wav' },
        { 'queue': 'B028', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B028.wav' },
        { 'queue': 'B029', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B029.wav' }
      ]
    }
  },
  async mounted () {
    this.checkOrientation()

    window.addEventListener('resize', this.checkOrientation)

    // if (!this.isPortrait) {
    //   console.log(' หน้าจอเป็นแนวตั้ง')
    // } else {
    //   console.log(' หน้าจอเป็นแนวนอน')
    // }
    await this.getShop()
    await this.getDataBranch()
    await this.getDataFlow()
    this.setTime()
    // this.$root.$on('closeSetTimeBookingMonitor', () => {
    //   // your code goes here
    //   this.closeSetTimeBookingMonitor()
    // })
    this.dateStart = moment().format('YYYY-MM-DD')
    // this.clearTimeLoop()
    // this.checkSearch()
    this.getFirestore()
    document.querySelector('body').requestFullscreen()
    if (this.isMobileDevice()) {
      // Code to execute if the device is a mobile device
      window.scrollTo(0, 1)
    }
    this.interval = setInterval(() => {
      this.currentTime = moment().format('DD/MMM/YYYY HH:mm') // อัพเดตเวลาทุก 1 วินาที
    }, 1000)
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
      this.firestore = this.$firebase.firestore()
      this.firestore.collection('ProcessOhrichUpdate').limit(1000).onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (this.checkRef === false) {
            this.checkRef = true
            this.updateProcessOhrichUpdate()
            await this.searchBooking()
          } else {
            let branchId = this.$session.getAll().data.masBranchID || 2185
            if (change.doc.data().active === '1' && change.doc.data().masBranchID === branchId && (this.$session.getAll().data.USER_ROLE === 'user' || this.$session.getAll().data.USER_ROLE === 'admin')) {
              await this.searchBooking()
              this.updateProcessOhrichUpdate()
            }
          }
        })
      })
    },
    updateProcessOhrichUpdate (item) {
      let branchId = this.$session.getAll().data.masBranchID || 2185
      let params = {
        userName: this.$session.getAll().data.userName || 'monthon.y@srtforex.com',
        masBranchID: branchId
      }
      axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Pepsico-ProcessOhrichUseNew', params)
    },
    async GroupQueue (item) {
      let countIndex = 1
      this.GroupQueueItem = {
        'one': [],
        'two': [],
        'three': []
      }
      // console.log('TT', item)
      // console.log('item', item)
      for (let i = 0; i < item.length; i += this.counterTotal) {
        // console.log('i', item[i])
        const group = item.slice(i, i + this.counterTotal)
        // console.log('countIndex', countIndex)
        if (countIndex <= 2) {
          this.GroupQueueItem.one.push(...group)
        } else if (countIndex <= 4) {
          this.GroupQueueItem.two.push(...group)
        } else {
          this.GroupQueueItem.three.push(...group)
        }
        // console.log('group', group)
        // this.GroupQueueItem.push(group)
        countIndex++
      }
      if (this.GroupQueueItem.one.length > 0) {
        const firstPart1 = this.GroupQueueItem.one.slice(0, 6)
        if (this.GroupQueueItem.one.length > 6) {
          const lastElement1 = this.GroupQueueItem.one[this.GroupQueueItem.one.length - 1]
          this.GroupQueueItem.one = [...firstPart1, lastElement1]
        } else {
          this.GroupQueueItem.one = [...firstPart1]
        }
      }
      if (this.GroupQueueItem.two.length > 0) {
        const firstPart1 = this.GroupQueueItem.two.slice(0, 6)
        if (this.GroupQueueItem.two.length > 6) {
          const lastElement1 = this.GroupQueueItem.two[this.GroupQueueItem.two.length - 1]
          this.GroupQueueItem.two = [...firstPart1, lastElement1]
        } else {
          this.GroupQueueItem.two = [...firstPart1]
        }
      }
      if (this.GroupQueueItem.three.length > 0) {
        const firstPart1 = this.GroupQueueItem.three.slice(0, 6)
        if (this.GroupQueueItem.three.length > 6) {
          const lastElement1 = this.GroupQueueItem.three[this.GroupQueueItem.three.length - 1]
          this.GroupQueueItem.three = [...firstPart1, lastElement1]
        } else {
          this.GroupQueueItem.three = [...firstPart1]
        }
      }
    },
    async GroupArrayQueue (dataArray) {
      // ใช้ Map เพื่อจัดกลุ่มตาม flowId
      let dataConfirm = []
      let data = []
      let dataB = []
      for (let i = 0; i < dataArray.length; i++) {
        let d = dataArray[i]
        if (d.statusBt === 'confirmJob') {
          dataConfirm.push(d)
        } else {
          if (d.storeFrontText === 'B') {
            dataB.push(d)
          } else {
            data.push(d)
          }
        }
      }
      // console.log('dataConfirm', dataConfirm)
      // console.log('data', data)
      // console.log('dataB', dataB)
      let mergedData = [...dataB, ...data.slice(0)]
      dataConfirm.push(...mergedData)
      return dataConfirm
    },
    // async GroupArrayQueue (dataArray) {
    //   // ใช้ Map เพื่อจัดกลุ่มตาม flowId
    //   const sortedArray = dataArray.sort((a, b) => {
    //     const getParts = (str) => {
    //       const match = str.match(/([A-Z]+)([0-9]+)/)
    //       return [match[1], parseInt(match[2])]
    //     }

    //     const [prefixA, numA] = getParts(a.storeFrontQueue)
    //     const [prefixB, numB] = getParts(b.storeFrontQueue)

    //     // เรียงลำดับตาม num และ prefix
    //     if (numA === numB) {
    //       return prefixA.localeCompare(prefixB)
    //     } else {
    //       return numA - numB
    //     }
    //   })
    //   return sortedArray
    // },
    async changeStatusSound (text) {
      console.log('[changeStatusSound]', this.statusSound)
      if (text === 'on') {
        this.statusSound = true
        await this.updatestatusNotifyByShopId()
        // this.getMessage()
      } else {
        this.statusSound = false
        // clearInterval(this.statusSoundCheck)
        // this.statusSoundCheck = null
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
    async getMessage () {
      try {
        await axios
          .get(
            `${this.DNS_IP}/callQueues/get?statusNotify=False&shopId=` + this.$session.getAll().data.shopId
          ).then(async (response) => {
            if (response.data.length > 0 && typeof response.data.status === 'undefined') {
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
        console.log(e)
        setTimeout(this.getMessage, 10000)
      }
    },
    async getMessageNoInterval (storeFrontQueue, dueDateDay) {
      try {
        let branchId = this.$session.getAll().data.masBranchID || 2185
        let url = `${this.DNS_IP}/callQueues/get?statusNotify=False&shopId=` + this.$session.getAll().data.shopId + '&masBranchID=' + branchId + '&storeFrontQueue=' + storeFrontQueue + '&CREATE_DATE=' + dueDateDay
        // if (this.$session.getAll().data.shopId) {
        // url = `${this.DNS_IP}/callQueues/get?statusNotify=False&shopId=` + this.$session.getAll().data.shopId
        // } else {
        // url = `${this.DNS_IP}/callQueues/get?statusNotify=False&shopId=` + this.$session.getAll().data.shopId + '&masBranchID=' +
        // }
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
        this.tableId = item.servicePoint.replace(' ', '').replace(' ', '').trim()
        let storeFrontQueue = item.storeFrontQueue
        // storeFrontQueue = storeFrontQueue.replace('A', 'เอ')
        // storeFrontQueue = storeFrontQueue.replace('B', 'บี')
        // storeFrontQueue = storeFrontQueue.replace('C', 'ซี')
        // storeFrontQueue = storeFrontQueue.replace('D', 'ดี')
        // storeFrontQueue = storeFrontQueue.replace('E', 'อี')
        storeFrontQueue = this.replaceFunc(storeFrontQueue.replace('A', 'เอ'))
        let result
        let oldSound = this.soundQueneNo.filter((row) => { return row.queue === item.storeFrontQueue })
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
        // let text = this.convertItemtoText(item)
        if (!item.audioFile) {
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
              'https://api-voice.botnoi.ai/api/service/generate_audio',
              params,
              { headers: { 'Botnoi-Token': 'VTNjZDc5OTM3ZjM4MDg4NzhkYzlkMTI0ZjNiZWZlMTZkNTYxODk0' } }
            ).then((res) => {
              this.dataListPlay.push(res.data)
              this.playSound()
              result = res.data
              console.log('this.dataListPlay Log1', this.dataListPlay)
            })
        } else {
          let res = { text: item.storeFrontQueue, audio_url: item.audioFile }
          this.dataListPlay.push(res)
          console.log('this.dataListPlay Log2', this.dataListPlay)
          this.playSound()
          result = res
        }
        return result
      } catch (e) {
        console.log(e)
        return null
      }
    },
    // convertItemtoText (item) {
    //   let { dock, regNo, storeFrontQueue } = item
    //   dock = dock.replace('Dock ', '')
    //   storeFrontQueue = storeFrontQueue.split('')
    //   storeFrontQueue[0] = storeFrontQueue[0] + ' delay{0.2} '
    //   storeFrontQueue = storeFrontQueue.join(' ')
    //   let text = `ขอเชิญ คิว ${storeFrontQueue} ที่ช่อง ${dock} ค่ะ`
    //   return text
    // },
    playSound () {
      let playerPrefix = document.getElementById('playerPrefix')
      let playerQueue = document.getElementById('playerQueue')
      // let playerSuffix = document.getElementById('playerSuffix')
      let playerCounter = document.getElementById('playerCounter')
      if (playerPrefix.paused && playerQueue.paused && playerCounter.paused) {
        let res = this.dataListPlay[0]
        var vid = document.getElementById('videoAds')
        vid.pause()
        this.audio = res.audio_url
        this.tableTarget = this.tableAudioList[this.tableId]
        console.log('tableTarget', this.tableTarget)
        console.log('tableId', this.tableId)
        this.timeCount = 1
        playerPrefix.play()
        playerPrefix.onended = (event) => {
          playerQueue.load()
          playerQueue.play()
          playerQueue.onended = (event) => {
            playerCounter.load()
            playerCounter.play()
            playerCounter.onended = (event) => {
              if (this.timeCount < this.repeatRound) {
                this.timeCount++
                playerPrefix.play()
                playerPrefix.onended = (event) => {
                  playerQueue.play()
                  playerQueue.onended = (event) => {
                    playerCounter.play()
                    playerCounter.onended = (event) => {
                      vid.play()
                      this.dataListPlay = this.dataListPlay.slice(1)
                      if (this.dataListPlay.length > 0) {
                        this.playSound()
                      }
                      console.log('this.dataListPlay', this.dataListPlay)
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    getNow: function () {
      // const today = new Date()
      // const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      // const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      // const dateTime = date + ' ' + time
      this.shopTime = 'เวลา ' + moment().format('HH:mm') + ' น.'
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
            this.shopColor = rs[0].secondaryColor
            this.shopImage = rs[0].shopImge
            this.videoLinkMonition = rs[0].videoLinkMonition
            this.bgColor = this.hexToRgbA(rs[0].primaryColor)
            this.bgColor2 = this.bgColor22(this.bgColor)
            this.bgColor3 = this.bgColor33(this.bgColor2)
            this.text = this.HEXToVBColor(rs[0].primaryColor)
            this.text2 = this.HEXToVBColor(this.bgColor3)
          } else {
            this.shopName = ''
            this.shopColor = ''
            this.shopImage = ''
          }
        })
    },
    hexToRgbA (hex) {
      var c
      // if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('')
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]]
      }
      c = '0x' + c.join('')
      return 'rgb(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ')'
      // }
      // throw new Error('Bad Hex')
    },
    bgColor22 (rgb) {
      var c = rgb.slice(3).slice(1, -1).split(',')
      return 'rgb(' + (parseInt(c[0]) + 50) + ',' + (parseInt(c[1]) + 50) + ',' + (parseInt(c[2]) + 50) + ')'
    },
    bgColor33 (rgb) {
      var c = rgb.slice(3).slice(1, -1).split(',')
      return 'rgb(' + (parseInt(c[0]) + 50) + ',' + (parseInt(c[1]) + 50) + ',' + (parseInt(c[2]) + 50) + ', 0.3)'
    },
    HEXToVBColor (a) {
      let rr = parseInt(a.substr(1, 2), 16)
      let gg = parseInt(a.substr(3, 2), 16)
      let bb = parseInt(a.substr(5, 2), 16)

      if (rr * 0.299 + gg * 0.587 + bb * 0.114 > 186) {
        let black = '#000000'
        return black
      } else {
        let white = '#ffffff'
        return white
      }
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
    closeSetTimeBookingMonitor () {
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
    },
    checkSearch () {
      this.validate('SEARCH')
      setTimeout(() => this.searchBooking(), 500)
    },
    clearTimeLoop () {
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
      let _this = this
      this.setTimerCalendar = setInterval(function () { _this.searchBooking() }, 15000)
    },
    async searchBooking () {
      if (this.validSearch === true) {
        // this.dateStartShow = moment(this.dateStart).locale('th').format('LLLL')
        this.dateStartShow = 'วัน' + moment(this.dateStart).locale('th').format('dddd') + 'ที่ ' + moment(this.dateStart).locale('th').format('D MMMM ') + (parseInt(moment(this.dateStart).format('YYYY')) + 543).toString()
        // await this.getBookingDataList(this.dateStart)
        let urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&masBranchID=' +
            this.masBranchID +
            // '&flowId=' +
            // this.flowSelect +
            '&dueDate=' +
            this.dateStart + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
        // '&dueDate=' +
        // this.dateStart + ' ' + this.time + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
        await axios
          .get(urlApi)
          .then(async response => {
            let rs = response.data
            if (rs.length > 0) {
              let sortData = await this.GroupArrayQueue(rs)
              // let sortData = rs.sort((a, b) => {
              //   // console.log('LOG', a.storeFrontQueue, b.storeFrontQueue, a.storeFrontQueue < b.storeFrontQueue)
              //   if (a.storeFrontQueue < b.storeFrontQueue) return -1
              //   return a.storeFrontQueue > b.storeFrontQueue ? 1 : 0
              // })
              this.itemBooking = []
              for (let i = 0; i < sortData.length; i++) {
                let d = sortData[i]
                // if (this.BookingDataList[d.bookNo] !== undefined) {
                //   d.servicePoint = d.servicePoint || ''
                //   this.itemBooking.push(d)
                // }
                d.servicePoint = d.servicePoint || ''
                this.itemBooking.push(d)
              }
              let dataCon = this.itemBooking.filter(el => { return el.statusBt === 'confirmJob' })
              let dataWain = this.itemBooking.filter(el => { return el.statusBt === 'confirm' })
              let sortDataDataCon = dataCon.sort((a, b) => {
                if (a.LAST_DATE > b.LAST_DATE) return -1
                return a.LAST_DATE < b.LAST_DATE ? 1 : 0
              })
              this.countConfirm = dataWain.length
              this.countConfirmList = dataWain.filter((el, ind) => { return ind <= 11 })
              // this.countConfirmListGroup = dataWain.map((el, ind) => { return ind <= 11 })
              // this.GroupQueueItem = await this.GroupQueue(this.countConfirmList)
              // console.log('test', this.GroupQueueItem)
              this.itemBookingUse = sortDataDataCon.filter((el, ind) => { return ind <= 5 })
              let test = dataWain.filter((el, ind) => { return el.storeFrontText === 'A' })
              this.GroupQueue(test)
              if (dataCon.length > 0) {
                if (this.statusSound) {
                  for (let i = 0; i < dataCon.length; i++) {
                    let d = dataCon[i]
                    await this.getMessageNoInterval(d.storeFrontQueue, d.dueDateDay)
                  }
                }
              }
            } else {
              this.itemBookingUse = []
              this.countConfirm = 0
            }
          })
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
            response.data.forEach((row) => {
              if (typeof (this.BookingDataList[row.bookNo]) === 'undefined') {
                this.BookingDataList[row.bookNo] = []
              }
              this.BookingDataList[row.bookNo].push(row)
            })
          }
        }).catch(error => {
          // this.dataEditReady = true
          setTimeout(() => this.getBookingDataList(dateStart), 3000)
          console.log('catch getBookingDataList : ', error)
        })
      console.log('this.BookingDataList1', this.BookingDataList)
    },
    setTime () {
      this.timeavailable = []
      let checkFlow = this.DataFlowItem.filter(el => { return el.value === this.flowSelect })
      if (checkFlow.length > 0) {
        this.timeavailable = JSON.parse(checkFlow[0].allData.setTime)
      } else {
        this.timeavailable = []
      }
    },
    async getDataFlow () {
      let resultOption = []
      await axios
        .get(this.DNS_IP + `/flow/get?shopId=${this.shopId}&storeFrontCheck=True&masBranchID=${this.masBranchID}`)
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
              if (d.storeFrontText === 'A') {
                this.counterTotal = d.servicePointCountEnd - d.servicePointCountStart + 1
              }
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
      this.branchItem = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName', '', 'masBranchNameEn')
      if (this.branchItem.length > 0) {
        this.masBranchID = this.session.data.masBranchID || this.branchItem[0].value
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
          CREATE_USER: this.$session.getAll().data.userName || 'monthon.y@srtforex.com',
          LAST_USER: this.$session.getAll().data.userName || 'monthon.y@srtforex.com'
        }
        await axios
          .post(this.DNS_IP + '/booking_transaction/add', dtt)
          .then(async responses => {
            this.$swal('เรียบร้อย', 'นำเข้าสำเร็จ', 'success')
            await this.searchBooking()
            let bookSelect = this.itemBooking.filter((element, index) => { return index <= 2 })
            if (bookSelect.length > 0) {
              for (let i = 0; i < bookSelect.length; i++) {
                let d = bookSelect[i]
                let s = {}
                s.lineUserId = d.lineUserId || ''
                if (s.lineUserId !== '') {
                  await axios
                    .post(this.DNS_IP + '/Booking/pushMsgQueue/' + d.bookNo)
                    .then(async responses => {}).catch(error => {
                      console.log('error function pushMsgQueue : ', error)
                    })
                }
              }
            }
          })
      })
    },
    setPrint (item, language) {
      let docDefinition = {}
      if (language === 'th') {
        docDefinition = {
          pageSize: 'A4',
          content: [
            {
              text: this.shopName,
              style: 'header',
              alignment: 'center'
            },
            {
              text: '   ',
              style: 'header',
              widths: ['*']
            },
            {
              columns: [
                {
                  style: 'subheader',
                  text: 'วันที่'
                },
                {
                  style: 'subheader',
                  text: item.dueDateText.split(' ')[0],
                  alignment: 'right'
                }
              ]
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              columns: [
                {
                  style: 'subheader',
                  text: 'รับคิวเวลา'
                },
                {
                  style: 'subheader',
                  text: item.timeText,
                  alignment: 'right'
                }
              ]
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              alignment: 'center',
              style: 'tableExample',
              table: {
                heights: [70],
                widths: ['*'],
                body: [
                  [
                    {
                      text: [
                        {text: 'หมายเลขคิวของคุณ\n', fontSize: 20, color: 'white'},
                        {text: item.storeFrontQueue, fontSize: 150, color: 'white'}
                      ],
                      border: [false, false, false, false],
                      fillColor: '#092C4C'
                    }
                  ]
                ]
              }
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              text: '*ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
              fontSize: 15,
              alignment: 'center'
            }
          ],
          styles: {
            header: {
              fontSize: 28,
              bold: true
            },
            subheader: {
              fontSize: 25,
              bold: true
            },
            quote: {
              italics: true
            },
            small: {
              fontSize: 8
            },
            defaultStyle: {
              columnGap: 20
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            }
          },
          defaultStyle: { // 4. default style 'KANIT' font to test
            font: 'Kanit'
          }
        }
      } else {
        docDefinition = {
          pageSize: 'A4',
          content: [
            {
              text: this.shopName,
              style: 'header',
              alignment: 'center'
            },
            {
              text: '   ',
              style: 'header',
              widths: ['*']
            },
            {
              columns: [
                {
                  style: 'subheader',
                  text: 'Date'
                },
                {
                  style: 'subheader',
                  text: item.dueDateText.split(' ')[0],
                  alignment: 'right'
                }
              ]
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              columns: [
                {
                  style: 'subheader',
                  text: 'Time'
                },
                {
                  style: 'subheader',
                  text: item.timeText,
                  alignment: 'right'
                }
              ]
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              alignment: 'center',
              style: 'tableExample',
              table: {
                heights: [70],
                widths: ['*'],
                body: [
                  [
                    {
                      text: [
                        {text: 'Number\n', fontSize: 30, color: 'white'},
                        {text: item.storeFrontQueue, fontSize: 150, color: 'white'}
                      ],
                      border: [false, false, false, false],
                      fillColor: '#092C4C'
                    }
                  ]
                ]
              }
            },
            {
              text: '   ',
              style: 'subheader',
              widths: ['*']
            },
            {
              text: '* The company reserves the right to skip the queue. In the event that the customer does not come.',
              fontSize: 15,
              alignment: 'center'
            }
          ],
          styles: {
            header: {
              fontSize: 28,
              bold: true
            },
            subheader: {
              fontSize: 25,
              bold: true
            },
            quote: {
              italics: true
            },
            small: {
              fontSize: 8
            },
            defaultStyle: {
              columnGap: 20
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            }
          },
          defaultStyle: { // 4. default style 'KANIT' font to test
            font: 'Kanit'
          }
        }
      }
      pdfMake.vfs = pdfFonts.pdfMake.vfs // 2. set vfs pdf font
      pdfMake.fonts = {
        // download default Roboto font from cdnjs.com
        Roboto: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        },
        // Kanit Font
        Kanit: { // 3. set Kanit font
          normal: 'Kanit-Regular.ttf',
          bold: 'Kanit-Medium.ttf',
          italics: 'Kanit-Italic.ttf',
          bolditalics: 'Kanit-MediumItalic.ttf'
        }
      }
      // pdfMake.createPdf(docDefinition).open({}, window)
      pdfMake.createPdf(docDefinition).getDataUrl(function (outDoc) {
        document.getElementById('pdfV').src = outDoc
      })
      this.dialogPrint = true
    },
    checkWiFiStatus () {
      this.wifiStatus = navigator.onLine ? 'connected' : 'disconnected'
    }
  }
}
</script>
  <style scope>
  .centered-input >>> input {
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
  .text-black >>> .v-input__slot {
    color: #005fcc !important;
  }

  .text-datetime, .text-number-waiting{
    font-weight: 700;
  }
  @media screen and (orientation: portrait) {
    .height-card{
      min-height: 16vh;
    }
}

@media screen and (orientation: landscape) {}
</style>
