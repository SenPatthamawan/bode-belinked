<template>
  <div>
    <br>
    <br>
    <br>
     <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1>{{queuePlay}}</h1>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-btn icon
              large
              color="red"
              @click="changeStatusSound('off')"
              v-if="statusSound === true"
            >
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
            <v-btn icon
              large
              color="green"
              @click="changeStatusSound('on')"
              v-else
            >
              <v-icon>mdi-volume-off</v-icon>
            </v-btn>
      </v-col>
      </v-row>
      <v-row v-show="hideSound === true">
        <audio id="playerTV" controls="controls">
          Your browser does not support the audio format.
        </audio>
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
     </v-container>
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
    videoElement () {
      return this.$refs.video
    },
    formattedDateTime () {
      return this.currentTime
    },
    wifiIcon () {
      console.log('wifiStatus', this.wifiStatus)
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
      queuePlay: '',
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
      GroupQueueItem: {
        'one': [],
        'two': [],
        'three': []
      },
      currentTime: moment().format('DD/MMM/YYYY HH:mm'),
      isPortrait: true,
      wifiStatus: 'unknown',
      checkRef: false,
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
        { 'queue': 'A309', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A309.wav' },
        { 'queue': 'A310', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A310.wav' },
        { 'queue': 'A311', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A311.wav' },
        { 'queue': 'A312', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A312.wav' },
        { 'queue': 'A313', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A313.wav' },
        { 'queue': 'A314', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A314.wav' },
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
        { 'queue': 'A363', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A363.wav' },
        { 'queue': 'A364', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A364.wav' },
        { 'queue': 'A365', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A365.wav' },
        { 'queue': 'A366', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A366.wav' },
        { 'queue': 'A367', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A367.wav' },
        { 'queue': 'A368', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A368.wav' },
        { 'queue': 'A369', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A369.wav' },
        { 'queue': 'A370', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A370.wav' },
        { 'queue': 'A371', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A371.wav' },
        { 'queue': 'A372', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A372.wav' },
        { 'queue': 'A373', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A373.wav' },
        { 'queue': 'A374', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A374.wav' },
        { 'queue': 'A375', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A375.wav' },
        { 'queue': 'A376', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A376.wav' },
        { 'queue': 'A377', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A377.wav' },
        { 'queue': 'A378', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A378.wav' },
        { 'queue': 'A379', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A379.wav' },
        { 'queue': 'A380', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A380.wav' },
        { 'queue': 'A381', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A381.wav' },
        { 'queue': 'A382', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A382.wav' },
        { 'queue': 'A383', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A383.wav' },
        { 'queue': 'A384', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A384.wav' },
        { 'queue': 'A385', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A385.wav' },
        { 'queue': 'A386', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A386.wav' },
        { 'queue': 'A387', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A387.wav' },
        { 'queue': 'A388', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A388.wav' },
        { 'queue': 'A389', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A389.wav' },
        { 'queue': 'A390', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A390.wav' },
        { 'queue': 'A391', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A391.wav' },
        { 'queue': 'A392', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A392.wav' },
        { 'queue': 'A393', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A393.wav' },
        { 'queue': 'A394', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A394.wav' },
        { 'queue': 'A395', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A395.wav' },
        { 'queue': 'A396', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A396.wav' },
        { 'queue': 'A397', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A397.wav' },
        { 'queue': 'A398', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A398.wav' },
        { 'queue': 'A399', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A399.wav' },
        { 'queue': 'A400', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A400.wav' },
        { 'queue': 'A401', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A401.wav' },
        { 'queue': 'A402', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A402.wav' },
        { 'queue': 'A403', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A403.wav' },
        { 'queue': 'A404', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A404.wav' },
        { 'queue': 'A405', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A405.wav' },
        { 'queue': 'A406', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A406.wav' },
        { 'queue': 'A407', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A407.wav' },
        { 'queue': 'A408', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A408.wav' },
        { 'queue': 'A409', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A409.wav' },
        { 'queue': 'A410', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A410.wav' },
        { 'queue': 'A411', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A411.wav' },
        { 'queue': 'A412', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A412.wav' },
        { 'queue': 'A413', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A413.wav' },
        { 'queue': 'A414', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A414.wav' },
        { 'queue': 'A415', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A415.wav' },
        { 'queue': 'A416', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A416.wav' },
        { 'queue': 'A417', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A417.wav' },
        { 'queue': 'A418', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A418.wav' },
        { 'queue': 'A419', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A419.wav' },
        { 'queue': 'A420', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A420.wav' },
        { 'queue': 'A421', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A421.wav' },
        { 'queue': 'A422', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A422.wav' },
        { 'queue': 'A423', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A423.wav' },
        { 'queue': 'A424', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A424.wav' },
        { 'queue': 'A425', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A425.wav' },
        { 'queue': 'A426', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A426.wav' },
        { 'queue': 'A427', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A427.wav' },
        { 'queue': 'A428', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A428.wav' },
        { 'queue': 'A429', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A429.wav' },
        { 'queue': 'A430', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A430.wav' },
        { 'queue': 'A431', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A431.wav' },
        { 'queue': 'A432', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A432.wav' },
        { 'queue': 'A433', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A433.wav' },
        { 'queue': 'A434', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A434.wav' },
        { 'queue': 'A435', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A435.wav' },
        { 'queue': 'A436', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A436.wav' },
        { 'queue': 'A437', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A437.wav' },
        { 'queue': 'A438', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A438.wav' },
        { 'queue': 'A439', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A439.wav' },
        { 'queue': 'A440', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A440.wav' },
        { 'queue': 'A441', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A441.wav' },
        { 'queue': 'A442', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A442.wav' },
        { 'queue': 'A443', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A443.wav' },
        { 'queue': 'A444', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A444.wav' },
        { 'queue': 'A445', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A445.wav' },
        { 'queue': 'A446', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A446.wav' },
        { 'queue': 'A447', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A447.wav' },
        { 'queue': 'A448', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A448.wav' },
        { 'queue': 'A449', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A449.wav' },
        { 'queue': 'A450', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A450.wav' },
        { 'queue': 'A451', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A451.wav' },
        { 'queue': 'A452', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A452.wav' },
        { 'queue': 'A453', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A453.wav' },
        { 'queue': 'A454', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A454.wav' },
        { 'queue': 'A455', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A455.wav' },
        { 'queue': 'A456', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A456.wav' },
        { 'queue': 'A457', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A457.wav' },
        { 'queue': 'A458', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A458.wav' },
        { 'queue': 'A459', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A459.wav' },
        { 'queue': 'A460', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A460.wav' },
        { 'queue': 'A461', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A461.wav' },
        { 'queue': 'A462', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A462.wav' },
        { 'queue': 'A463', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A463.wav' },
        { 'queue': 'A464', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A464.wav' },
        { 'queue': 'A465', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A465.wav' },
        { 'queue': 'A466', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A466.wav' },
        { 'queue': 'A467', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A467.wav' },
        { 'queue': 'A468', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A468.wav' },
        { 'queue': 'A469', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A469.wav' },
        { 'queue': 'A470', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A470.wav' },
        { 'queue': 'A471', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A471.wav' },
        { 'queue': 'A472', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A472.wav' },
        { 'queue': 'A473', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A473.wav' },
        { 'queue': 'A474', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A474.wav' },
        { 'queue': 'A475', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A475.wav' },
        { 'queue': 'A476', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A476.wav' },
        { 'queue': 'A477', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A477.wav' },
        { 'queue': 'A478', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A478.wav' },
        { 'queue': 'A479', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A479.wav' },
        { 'queue': 'A480', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A480.wav' },
        { 'queue': 'A481', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A481.wav' },
        { 'queue': 'A482', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A482.wav' },
        { 'queue': 'A483', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A483.wav' },
        { 'queue': 'A484', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A484.wav' },
        { 'queue': 'A485', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A485.wav' },
        { 'queue': 'A486', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A486.wav' },
        { 'queue': 'A487', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A487.wav' },
        { 'queue': 'A488', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A488.wav' },
        { 'queue': 'A489', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A489.wav' },
        { 'queue': 'A490', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A490.wav' },
        { 'queue': 'A491', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A491.wav' },
        { 'queue': 'A492', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A492.wav' },
        { 'queue': 'A493', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A493.wav' },
        { 'queue': 'A494', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A494.wav' },
        { 'queue': 'A495', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A495.wav' },
        { 'queue': 'A496', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A496.wav' },
        { 'queue': 'A497', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A497.wav' },
        { 'queue': 'A498', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A498.wav' },
        { 'queue': 'A499', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A499.wav' },
        { 'queue': 'A500', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A500.wav' },
        { 'queue': 'A501', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A501.wav' },
        { 'queue': 'A502', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A502.wav' },
        { 'queue': 'A503', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A503.wav' },
        { 'queue': 'A504', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A504.wav' },
        { 'queue': 'A505', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A505.wav' },
        { 'queue': 'A506', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A506.wav' },
        { 'queue': 'A507', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A507.wav' },
        { 'queue': 'A508', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A508.wav' },
        { 'queue': 'A509', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A509.wav' },
        { 'queue': 'A510', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A510.wav' },
        { 'queue': 'A511', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A511.wav' },
        { 'queue': 'A512', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A512.wav' },
        { 'queue': 'A513', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A513.wav' },
        { 'queue': 'A514', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A514.wav' },
        { 'queue': 'A515', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A515.wav' },
        { 'queue': 'A516', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A516.wav' },
        { 'queue': 'A517', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A517.wav' },
        { 'queue': 'A518', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A518.wav' },
        { 'queue': 'A519', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A519.wav' },
        { 'queue': 'A520', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A520.wav' },
        { 'queue': 'A521', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A521.wav' },
        { 'queue': 'A522', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A522.wav' },
        { 'queue': 'A523', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A523.wav' },
        { 'queue': 'A524', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A524.wav' },
        { 'queue': 'A525', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A525.wav' },
        { 'queue': 'A526', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A526.wav' },
        { 'queue': 'A527', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A527.wav' },
        { 'queue': 'A528', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A528.wav' },
        { 'queue': 'A529', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A529.wav' },
        { 'queue': 'A530', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A530.wav' },
        { 'queue': 'A531', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A531.wav' },
        { 'queue': 'A532', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A532.wav' },
        { 'queue': 'A533', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A533.wav' },
        { 'queue': 'A534', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A534.wav' },
        { 'queue': 'A535', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A535.wav' },
        { 'queue': 'A536', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A536.wav' },
        { 'queue': 'A537', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A537.wav' },
        { 'queue': 'A538', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A538.wav' },
        { 'queue': 'A539', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A539.wav' },
        { 'queue': 'A540', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A540.wav' },
        { 'queue': 'A541', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A541.wav' },
        { 'queue': 'A542', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A542.wav' },
        { 'queue': 'A543', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A543.wav' },
        { 'queue': 'A544', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A544.wav' },
        { 'queue': 'A545', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A545.wav' },
        { 'queue': 'A546', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A546.wav' },
        { 'queue': 'A547', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A547.wav' },
        { 'queue': 'A548', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A548.wav' },
        { 'queue': 'A549', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A549.wav' },
        { 'queue': 'A550', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A550.wav' },
        { 'queue': 'A551', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A551.wav' },
        { 'queue': 'A552', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A552.wav' },
        { 'queue': 'A553', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A553.wav' },
        { 'queue': 'A554', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A554.wav' },
        { 'queue': 'A555', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A555.wav' },
        { 'queue': 'A556', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A556.wav' },
        { 'queue': 'A557', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A557.wav' },
        { 'queue': 'A558', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A558.wav' },
        { 'queue': 'A559', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A559.wav' },
        { 'queue': 'A560', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A560.wav' },
        { 'queue': 'A561', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A561.wav' },
        { 'queue': 'A562', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A562.wav' },
        { 'queue': 'A563', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A563.wav' },
        { 'queue': 'A564', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A564.wav' },
        { 'queue': 'A565', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A565.wav' },
        { 'queue': 'A566', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A566.wav' },
        { 'queue': 'A567', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A567.wav' },
        { 'queue': 'A568', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A568.wav' },
        { 'queue': 'A569', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A569.wav' },
        { 'queue': 'A570', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A570.wav' },
        { 'queue': 'A571', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A571.wav' },
        { 'queue': 'A572', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A572.wav' },
        { 'queue': 'A573', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A573.wav' },
        { 'queue': 'A574', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A574.wav' },
        { 'queue': 'A575', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A575.wav' },
        { 'queue': 'A576', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A576.wav' },
        { 'queue': 'A577', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A577.wav' },
        { 'queue': 'A578', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A578.wav' },
        { 'queue': 'A579', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A579.wav' },
        { 'queue': 'A580', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A580.wav' },
        { 'queue': 'A581', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A581.wav' },
        { 'queue': 'A582', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A582.wav' },
        { 'queue': 'A583', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A583.wav' },
        { 'queue': 'A584', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A584.wav' },
        { 'queue': 'A585', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A585.wav' },
        { 'queue': 'A586', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A586.wav' },
        { 'queue': 'A587', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A587.wav' },
        { 'queue': 'A588', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A588.wav' },
        { 'queue': 'A589', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A589.wav' },
        { 'queue': 'A590', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A590.wav' },
        { 'queue': 'A591', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A591.wav' },
        { 'queue': 'A592', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A592.wav' },
        { 'queue': 'A593', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A593.wav' },
        { 'queue': 'A594', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A594.wav' },
        { 'queue': 'A595', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A595.wav' },
        { 'queue': 'A596', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A596.wav' },
        { 'queue': 'A597', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A597.wav' },
        { 'queue': 'A598', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A598.wav' },
        { 'queue': 'A599', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A599.wav' },
        { 'queue': 'A600', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/A600.wav' },

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
        { 'queue': 'B029', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B029.wav' },
        { 'queue': 'B030', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B030.wav' },
        { 'queue': 'B031', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B031.wav' },
        { 'queue': 'B032', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B032.wav' },
        { 'queue': 'B033', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B033.wav' },
        { 'queue': 'B034', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B034.wav' },
        { 'queue': 'B035', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B035.wav' },
        { 'queue': 'B036', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B036.wav' },
        { 'queue': 'B037', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B037.wav' },
        { 'queue': 'B038', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B038.wav' },
        { 'queue': 'B039', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B039.wav' },
        { 'queue': 'B040', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B040.wav' },
        { 'queue': 'B041', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B041.wav' },
        { 'queue': 'B042', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B042.wav' },
        { 'queue': 'B043', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B043.wav' },
        { 'queue': 'B044', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B044.wav' },
        { 'queue': 'B045', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B045.wav' },
        { 'queue': 'B046', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B046.wav' },
        { 'queue': 'B047', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B047.wav' },
        { 'queue': 'B048', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B048.wav' },
        { 'queue': 'B049', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B049.wav' },
        { 'queue': 'B050', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B050.wav' },
        { 'queue': 'B051', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B051.wav' },
        { 'queue': 'B052', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B052.wav' },
        { 'queue': 'B053', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B053.wav' },
        { 'queue': 'B054', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B054.wav' },
        { 'queue': 'B055', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B055.wav' },
        { 'queue': 'B056', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B056.wav' },
        { 'queue': 'B057', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B057.wav' },
        { 'queue': 'B058', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B058.wav' },
        { 'queue': 'B059', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B059.wav' },
        { 'queue': 'B060', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B060.wav' },
        { 'queue': 'B061', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B061.wav' },
        { 'queue': 'B062', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B062.wav' },
        { 'queue': 'B063', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B063.wav' },
        { 'queue': 'B064', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B064.wav' },
        { 'queue': 'B065', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B065.wav' },
        { 'queue': 'B066', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B066.wav' },
        { 'queue': 'B067', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B067.wav' },
        { 'queue': 'B068', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B068.wav' },
        { 'queue': 'B069', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B069.wav' },
        { 'queue': 'B070', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B070.wav' },
        { 'queue': 'B071', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B071.wav' },
        { 'queue': 'B072', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B072.wav' },
        { 'queue': 'B073', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B073.wav' },
        { 'queue': 'B074', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B074.wav' },
        { 'queue': 'B075', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B075.wav' },
        { 'queue': 'B076', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B076.wav' },
        { 'queue': 'B077', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B077.wav' },
        { 'queue': 'B078', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B078.wav' },
        { 'queue': 'B079', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B079.wav' },
        { 'queue': 'B080', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B080.wav' },
        { 'queue': 'B081', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B081.wav' },
        { 'queue': 'B082', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B082.wav' },
        { 'queue': 'B083', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B083.wav' },
        { 'queue': 'B084', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B084.wav' },
        { 'queue': 'B085', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B085.wav' },
        { 'queue': 'B086', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B086.wav' },
        { 'queue': 'B087', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B087.wav' },
        { 'queue': 'B088', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B088.wav' },
        { 'queue': 'B089', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B089.wav' },
        { 'queue': 'B090', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B090.wav' },
        { 'queue': 'B091', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B091.wav' },
        { 'queue': 'B092', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B092.wav' },
        { 'queue': 'B093', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B093.wav' },
        { 'queue': 'B094', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B094.wav' },
        { 'queue': 'B095', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B095.wav' },
        { 'queue': 'B096', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B096.wav' },
        { 'queue': 'B097', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B097.wav' },
        { 'queue': 'B098', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B098.wav' },
        { 'queue': 'B099', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B099.wav' },
        { 'queue': 'B100', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/B100.wav' },

        { 'queue': 'C001', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C001.wav' },
        { 'queue': 'C002', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C002.wav' },
        { 'queue': 'C003', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C003.wav' },
        { 'queue': 'C004', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C004.wav' },
        { 'queue': 'C005', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C005.wav' },
        { 'queue': 'C006', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C006.wav' },
        { 'queue': 'C007', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C007.wav' },
        { 'queue': 'C008', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C008.wav' },
        { 'queue': 'C009', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C009.wav' },
        { 'queue': 'C010', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C010.wav' },
        { 'queue': 'C011', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C011.wav' },
        { 'queue': 'C012', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C012.wav' },
        { 'queue': 'C013', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C013.wav' },
        { 'queue': 'C014', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C014.wav' },
        { 'queue': 'C015', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C015.wav' },
        { 'queue': 'C016', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C016.wav' },
        { 'queue': 'C017', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C017.wav' },
        { 'queue': 'C018', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C018.wav' },
        { 'queue': 'C019', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C019.wav' },
        { 'queue': 'C020', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C020.wav' },
        { 'queue': 'C021', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C021.wav' },
        { 'queue': 'C022', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C022.wav' },
        { 'queue': 'C023', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C023.wav' },
        { 'queue': 'C024', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C024.wav' },
        { 'queue': 'C025', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C025.wav' },
        { 'queue': 'C026', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C026.wav' },
        { 'queue': 'C027', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C027.wav' },
        { 'queue': 'C028', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C028.wav' },
        { 'queue': 'C029', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C029.wav' },
        { 'queue': 'C030', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C030.wav' },
        { 'queue': 'C031', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C031.wav' },
        { 'queue': 'C032', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C032.wav' },
        { 'queue': 'C033', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C033.wav' },
        { 'queue': 'C034', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C034.wav' },
        { 'queue': 'C035', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C035.wav' },
        { 'queue': 'C036', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C036.wav' },
        { 'queue': 'C037', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C037.wav' },
        { 'queue': 'C038', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C038.wav' },
        { 'queue': 'C039', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C039.wav' },
        { 'queue': 'C040', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C040.wav' },
        { 'queue': 'C041', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C041.wav' },
        { 'queue': 'C042', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C042.wav' },
        { 'queue': 'C043', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C043.wav' },
        { 'queue': 'C044', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C044.wav' },
        { 'queue': 'C045', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C045.wav' },
        { 'queue': 'C046', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C046.wav' },
        { 'queue': 'C047', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C047.wav' },
        { 'queue': 'C048', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C048.wav' },
        { 'queue': 'C049', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C049.wav' },
        { 'queue': 'C050', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C050.wav' },
        { 'queue': 'C051', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C051.wav' },
        { 'queue': 'C052', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C052.wav' },
        { 'queue': 'C053', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C053.wav' },
        { 'queue': 'C054', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C054.wav' },
        { 'queue': 'C055', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C055.wav' },
        { 'queue': 'C056', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C056.wav' },
        { 'queue': 'C057', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C057.wav' },
        { 'queue': 'C058', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C058.wav' },
        { 'queue': 'C059', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C059.wav' },
        { 'queue': 'C060', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C060.wav' },
        { 'queue': 'C061', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C061.wav' },
        { 'queue': 'C062', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C062.wav' },
        { 'queue': 'C063', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C063.wav' },
        { 'queue': 'C064', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C064.wav' },
        { 'queue': 'C065', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C065.wav' },
        { 'queue': 'C066', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C066.wav' },
        { 'queue': 'C067', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C067.wav' },
        { 'queue': 'C068', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C068.wav' },
        { 'queue': 'C069', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C069.wav' },
        { 'queue': 'C070', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C070.wav' },
        { 'queue': 'C071', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C071.wav' },
        { 'queue': 'C072', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C072.wav' },
        { 'queue': 'C073', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C073.wav' },
        { 'queue': 'C074', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C074.wav' },
        { 'queue': 'C075', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C075.wav' },
        { 'queue': 'C076', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C076.wav' },
        { 'queue': 'C077', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C077.wav' },
        { 'queue': 'C078', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C078.wav' },
        { 'queue': 'C079', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C079.wav' },
        { 'queue': 'C080', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C080.wav' },
        { 'queue': 'C081', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C081.wav' },
        { 'queue': 'C082', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C082.wav' },
        { 'queue': 'C083', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C083.wav' },
        { 'queue': 'C084', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C084.wav' },
        { 'queue': 'C085', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C085.wav' },
        { 'queue': 'C086', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C086.wav' },
        { 'queue': 'C087', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C087.wav' },
        { 'queue': 'C088', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C088.wav' },
        { 'queue': 'C089', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C089.wav' },
        { 'queue': 'C090', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C090.wav' },
        { 'queue': 'C091', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C091.wav' },
        { 'queue': 'C092', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C092.wav' },
        { 'queue': 'C093', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C093.wav' },
        { 'queue': 'C094', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C094.wav' },
        { 'queue': 'C095', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C095.wav' },
        { 'queue': 'C096', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C096.wav' },
        { 'queue': 'C097', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C097.wav' },
        { 'queue': 'C098', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C098.wav' },
        { 'queue': 'C099', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C099.wav' },
        { 'queue': 'C100', 'audioFile': 'https://storage.googleapis.com/ohrich-sound/C100.wav' }
      ],
      dataListPlay: [],
      dataService: [],
      dataWaiting: [],
      dataSound: [],
      playingSound: []
    }
  },

  async mounted () {
    this.getFirestorePlaySound()
  },
  methods: {
    getFirestorePlaySound () {
      try {
        this.firestore = this.$firebase.firestore()
        const FieldPath = this.$firebase.firestore.FieldPath
        this.firestore.collection('ProcessOhrichSound')
          .where(FieldPath.documentId(), '==', (this.$session.getAll().data.masBranchID).toString())
          .onSnapshot(async (snapshot) => {
            if (snapshot.empty) {
              this.setNewQueueFirebase()
            } else {
              for (let x = 0; x < snapshot.docChanges().length; x++) {
                let change = snapshot.docChanges()[x]
                if (change.doc.data().queue.length > 0) {
                  console.log(change.doc.data().queue)
                  for (let i = 0; i < change.doc.data().queue.length; i++) {
                    let itemIsNotify = change.doc.data().queue[i]
                    await this.deleteQueueFirebase(itemIsNotify.storeFrontQueue, itemIsNotify.servicePoint)
                    this.queuePlay = itemIsNotify.storeFrontQueue
                    const audioUrl = `https://storage.googleapis.com/ohrich-sound/${itemIsNotify.storeFrontQueue}.wav`
                    this.playingSound.push({storeFrontQueue: itemIsNotify.storeFrontQueue, audioUrl: audioUrl, servicePoint: itemIsNotify.servicePoint})
                    console.log('storeFrontQueue : ', itemIsNotify.storeFrontQueue, '-', itemIsNotify.servicePoint)
                    // console.log('servicePoint : ', itemIsNotify.servicePoint)
                  }
                  if (this.playingSound.length > 0) {
                    this.playingSound.reverse()
                    for (let index = this.playingSound.length - 1; index >= 0; index--) {
                      let sound = this.playingSound[index]
                      this.playSoundBooking(sound.audioUrl, sound.servicePoint, sound.storeFrontQueue)
                      this.playingSound.pop()
                    }
                  }
                }
              }
            }
          })
      } catch (error) {
        console.log('Error getFirestore', error)
      }
    },
    async deleteQueueFirebase (queue, sPoint) {
      const params = {
        storeFrontQueue: queue,
        servicePoint: sPoint,
        masBranchID: (this.$session.getAll().data.masBranchID).toString()
      }
      await axios.post(`https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Pepsico-DeleteQueueByBranch`, params)
    },
    async setNewQueueFirebase () {
      const params = {
        masBranchID: (this.$session.getAll().data.masBranchID).toString()
      }
      await axios.post(`https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/Pepsico-SetNewQueueByBranch`, params)
    },
    async changeStatusSound (text) {
      if (text === 'on') {
        this.statusSound = true
        // await this.updatestatusNotifyByShopId()
      } else {
        this.statusSound = false
      }
    },
    playSoundBooking (audioUrl, servicePoint, storeFrontQueue) {
      let playerTV = document.getElementById('playerTV')
      // let video = document.getElementById('videoAds')
      try {
        if (playerTV.paused) {
          let roundCount = 0
          let maxRounds = 2
          // video.pause()
          let playList = [
            'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/ohrich2%2FQNumber.wav?alt=media&token=451f683b-28da-44d0-8673-f5d25a84a9e1',
            audioUrl,
            this.tableAudioList[String(servicePoint).trim()]
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
            } else {
              // video.play()
            }
          }
          playerTV.onended = playNext
          playNext()
        } else {
          setTimeout(() => {
            this.playSoundBooking(audioUrl, servicePoint, storeFrontQueue)
          }, 2000)
        }
      } catch (error) {
        console.log('Error playSound', error)
        playerTV.pause()
      }
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
