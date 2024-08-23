<template>
    <div>
      <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
      <v-row >
        <v-col cols="12">
          <v-sheet
            :color="shopColor"
            elevation="1"
            :height="resCol === '12' ? '70' : '170'"
            width="100%"
            style="border-bottom: 1px solid #695988 !important"
          >
            <v-row>
              <v-col :cols="resCol === '12' ? '6' : '8' " align="left" :class=" resCol !== '12' ? 'mt-6 ml-8 pa-0' : 'mt-1 pl-7'">
                <v-img :src="shopImage" contain :max-width="resCol === '12' ? '50px' : '170px'" max-height="130px"></v-img>
              </v-col>
              <v-col :cols="resCol === '12' ? '6' : '3' " align="right" :class="resCol !== '12' ? 'mt-6 ml-16' : 'mt-1 pr-7 pt-5'">
                <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6" :max-width="resCol === '12' ? '70px' : '220px'"></v-img>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
          <!-- <div style="display:flex;justify-content: center;" class="ma-3">
              <v-chip
                class="mr-1 font-weight-black"
                :style="'background-color:' + (languageSelect === 0 ? '#173053' : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
                dark
                @click="languageSelect = 0"
                >
                <v-avatar left>
                  <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-TH.png?alt=media&token=e4bd7ffa-aed9-47e3-9240-4dcb9d8d284e"></v-img>
                </v-avatar>
                  TH
              </v-chip>
              <v-chip
                class="ml-1 font-weight-black"
                :style="'background-color:' + (languageSelect === 1 ? '#173053' : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
                dark
                @click="languageSelect = 1">
                <v-avatar left>
                  <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-USA1.png?alt=media&token=a83dd820-f576-457a-8d08-1009cea9d70b"></v-img>
                </v-avatar>
                  EN
              </v-chip>
            </div> -->
          <!-- <v-form ref="form_search" v-model="validSearch" lazy-validation>
            <v-row>
              <v-col cols="3">
                <v-select
                  :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                  v-model="masBranchID"
                  background-color="white"
                  style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                  hide-details
                  :items="branchItem"
                  :label="languageSelect === 0 ? 'สาขา' : 'Branch'"
                  outlined
                  dense
                  required
                  :rules ="[rules.required]"
                  @change="clearTimeLoop(), checkSearch()"
                  ><template #prepend-inner>
                    <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                      mdi-map-marker-outline
                    </v-icon>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                  :label="languageSelect === 0 ? 'ประเภทบริการ' : 'Service'"
                  style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                  v-model="flowSelect"
                  hide-details
                  background-color="white"
                  :items="DataFlowItem"
                  outlined
                  dense
                  required
                  :rules ="[rules.required]"
                  @change="clearTimeLoop(), checkSearch()"
                >
                  <template #prepend-inner>
                    <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                      mdi-note-text-outline
                    </v-icon>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="3">
                <v-menu
                  ref="menu"
                  v-model="menuStart"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      hide-details
                      background-color="white"
                      v-model="dateStart"
                      style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                      :label="languageSelect === 0 ? 'วัน/เดือน/ปี' : 'Date'"
                      readonly
                      outlined
                      dense
                      required
                      :rules ="[rules.required]"
                      v-bind="attrs"
                      v-on="on"
                    >
                    <template #prepend-inner>
                    <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                      mdi-calendar
                    </v-icon>
                  </template></v-text-field>
                  </template>
                  <v-date-picker
                    @input="menuStart = false, clearTimeLoop(), checkSearch()"
                    v-model="dateStart"
                    no-title
                    scrollable
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="2" class="mt-n3">
                <v-switch
                  v-model="switchMode"
                  inset
                  label="เปิดวิดีโอ"
                ></v-switch>
              </v-col>
            </v-row>
          </v-form> -->
      <v-sheet
        :color="shopColor"
        elevation="0"
        height="110vh"
        width="100%"
      >
        <v-row class="ml-6">
          <v-col :cols="resCol === '12' ? '5' : '4'" :class="resCol === '12' ? 'pr-0 pt-0' : 'pr-0'">
            <v-container>
              <v-row v-if="resCol !== '12'">
                <v-col cols="6">
                  <v-menu
                    ref="menu"
                    v-model="menuStart"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            hide-details
                            :background-color="'white'"
                            v-model="dateStartShow"
                            readonly
                            outlined
                            dense
                            required
                            :rules ="[rules.required]"
                            v-bind="attrs"
                            v-on="on"
                          >
                          <template #prepend-inner>
                          <v-icon :color="'black'" style="padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                            mdi-calendar
                          </v-icon>
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      @input="menuStart = false, clearTimeLoop(), checkSearch()"
                      v-model="dateStart"
                      no-title
                      scrollable
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    outlined
                    :background-color="'white'"
                    dense
                    readonly
                    v-model="shopTime"
                  >
                    <template #prepend-inner>
                      <v-icon :color="'black'" style="padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                        mdi-clock-time-four
                      </v-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12">
                  <v-sheet
                    :color="bgColor3"
                    elevation="1"
                    :height="resCol === '12' ? '99' : '130'"
                    width="100%"
                    dark
                    style="border-bottom: 1px solid #695988 !important;border-radius: 10px 10px 0px 0px;"
                  >
                    <v-container>
                      <v-row>
                        <v-col cols="6" :class="resCol === '12' ? 'pa-0' : ''">
                          <br>
                          <v-row class="text-center">
                            <v-col  :class="resCol === '12' ? 'pa-0' : ''" cols="12" :style="'font-weight: 700;font-size: ' + font() + ';line-height: 24px;color:' + text">
                            <!-- <v-col cols="12" :style="'font-weight: 700;font-size: ' + '5px' + ';line-height: 24px;color:' + text"> -->
                              หมายเลขคิว
                            </v-col>
                            <v-col :class="resCol === '12' ? 'pa-0' : ''" cols="12" :style="'font-weight: 700;font-size:' + font() + ';line-height: 24px;color:' + text" >
                              Number
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="6" :class="resCol === '12' ? 'pa-0' : ''">
                          <br>
                          <v-row class="text-center">
                            <v-col :class="resCol === '12' ? 'pa-0' : ''" cols="12" :style="'font-weight: 700;font-size:' + font() + ';line-height: 24px;color:' + text">
                              ช่องบริการ
                            </v-col>
                            <v-col :class="resCol === '12' ? 'pa-0' : ''" cols="12" :style="'font-weight: 700;font-size:'  + font() + ';line-height: 24px;color:' + text">
                              Counter
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-sheet>
                  <v-sheet
                    elevation="1"
                    height="85%"
                    width="100%"
                    style="border-radius: 0px 0px 10px 10px;"
                  >
                    <v-container>
                      <v-row v-for="(items, id) in itemBookingUse" :key="id">
                        <v-col cols="6" class="pt-2">
                          <v-row class="text-center">
                            <v-col cols="12" :style="'font-weight: 700;font-size: ' + font2() + ';color:black'">
                              {{items.storeFrontQueue}}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="6" class="pt-2" style="border-left: 1px solid #695988 !important">
                          <v-row class="text-center">
                            <v-col cols="12" :style="'font-weight: 700;font-size: 48px;color:black'">
                              {{items.servicePoint === '' ? (items.statusBt === 'confirmJob' ? 'เรียกคิว' : '') : items.servicePoint}}
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <div class="text-right">
                        <v-icon
                          large
                          color="#695988"
                          @click="changeStatusSound('off')"
                          v-if="statusSound === true"
                        >
                          mdi-volume-high
                        </v-icon>
                        <v-icon
                          large
                          color="#695988"
                          @click="changeStatusSound('on')"
                          v-else
                        >
                           mdi-volume-off
                        </v-icon>
                      </div>
                    </v-container>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col :cols="resCol === '12' ? '7' : '8'">
            <!-- <v-row>
              <v-col cols="11" class="pb-0 pt-0 mt-3" style="display: flex;justify-content: flex-end;">
                <v-card
                  elevation="1"
                  :color="bgColor3"
                  style="padding: 10px; width: 330px;"
                >
                  <div style="margin: auto 0;" class="text-center text-white">
                    <div style="font-weight: 700;font-size: 28px;">คิวที่ยังไม่ได้เลือก</div>
                    <strong style="font-weight: 700;font-size: 28px;">{{countConfirm}}</strong>
                  </div>
                </v-card>
              </v-col>
            </v-row> -->
            <v-row v-if="videoLinkMonition">
              <v-col cols="12" class="text-center pt-0">
                <video v-if="videoLinkMonition.includes('firebasestorage')" ref="video" id="videoAds" :class=" resCol === '12' ? 'mt-3' : 'mt-15'" width="90%" autoplay muted autopictureinpicture controls loop="true" poster="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FbetaskMonitor.png?alt=media&token=eba79dd1-c0f3-4799-aea1-4187e2662fc6">
                  <source :src="videoLinkMonition" type="video/webm">
                </video>
                <iframe v-else ref="video" id="videoAds" class="mt-15" width="90%" height="600px" :src="videoLinkMonition + '?playlist=' + videoLinkMonition.substring(videoLinkMonition.length -11) + '&autoplay=1&loop=1'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
              </v-col>
            </v-row>
            <template>
              <v-row>
                <v-col cols="4" class="pb-0 pt-0 mt-3 pr-0">
                  <v-card
                    elevation="1"
                    :color="bgColor3"
                    style="padding: 10px; width: 90%;"
                  >
                    <div style="margin: auto 0;" class="text-center text-white">
                      <div :style="'margin-bottom:4px;font-weight: 700;font-size: ' + font3() + ';color:' + text">คิวที่รอเรียก : {{countConfirm}}</div>
                      <!-- <strong style="font-weight: 700;font-size: 28px;">{{countConfirm}}</strong> -->
                      <v-row>
                        <v-col cols="4" class="px-0 py-0 pl-1" v-for="(item3 , index3) in DataFlowItem.filter(el => { return el.value !== 'allFlow' })" :key="index3">
                           <strong :style="'font-size: ' + font4() + ';color:' + text ">{{item3.storeFrontText}} : {{countConfirmList.filter(el => { return el.flowId === item3.value  }).length}}</strong>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>
                <v-col clos="8" class="pb-0 pt-0 mt-3 pl-0">
                  <v-sheet
                    :color="bgColor3"
                    elevation="1"
                    height="100%"
                    width="93%"
                    dark
                    style="border-radius: 10px 10px 10px 10px;padding: 10px;"
                  >
                    <v-row>
                      <v-col cols="2" :class="resCol === 12 ? 'pb-0 pt-1 mt-3 pl-10' : 'pl-2'" v-for="(items, id) in countConfirmList" :key="id">
                        <strong :style="'font-size: ' + font3() + ';color:' + text">{{items.storeFrontQueue}}</strong>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </v-col>
              </v-row>
            </template>
          </v-col>
          <v-row v-show="hideSound === true">
            <v-col>
              <audio id="playerPrefix" controls="controls">>
                <source src="https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02132023084603578380.wav">
                Your browser does not support the audio format.
              </audio>
              <audio id="playerQueue" controls="controls">>
                <source :src="audio">
                Your browser does not support the audio format.
              </audio>
              <audio id="playerSuffix" controls="controls">>
                <source src="https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_05092023150816848745.wav">
                Your browser does not support the audio format.
              </audio>
            </v-col>
            <v-col>
              {{history}}
            </v-col>
          </v-row>
        </v-row>
      </v-sheet>
    </div>
  </template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import pdfMake from 'pdfmake'
import pdfFonts from '../../assets/custom-fonts.js' // 1. import custom fonts
import moment from 'moment-timezone'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
  },
  computed: {
    videoElement () {
      return this.$refs.video
    },
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '12'
        case 'sm':
          return '12'
        case 'md':
          return '6'
        case 'lg':
          return '3'
        case 'xl':
          return '6'
      }
      console.log(
        'this.$vuetify.breakpoint.name',
        this.$vuetify.breakpoint.name
      )
    },
    colsWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '55'
        case 'sm': return '55'
        case 'md': return '55'
        case 'lg': return '60'
        case 'xl': return '80'
      }
    },
    colsWidth2 () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'xs'
        case 'sm': return 'sm'
        case 'md': return 'md'
        case 'lg': return 'lg'
        case 'xl': return 'xl'
      }
    }
  },
  watch: {
    // whenever question changes, this function will run
    colsWidth (newQuestion, oldQuestion) {
      // console.log('newnewnew', newQuestion, oldQuestion)
      this.Fontsize = newQuestion
    },
    colsWidth2 (newQuestion, oldQuestion) {
      // console.log('newnewnew', newQuestion, oldQuestion)
      this.DiSize = newQuestion
    }
  },
  created () {
    setInterval(this.getNow, 1000)
  },
  data () {
    return {
      statusSound: false,
      dateStartShow: '',
      video: 'https://www.youtube.com/watch?v=B5TDAXLPrRY&list=RDCMUC-4vsQo3bHMzLuHyVM_iIRA&start_radio=1',
      Fontsize: null,
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
      headers: [
        { text: 'คิว', value: 'storeFrontQueue' },
        { text: 'วันที่นัดหมาย', value: 'dueDate' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        { text: 'จัดการข้อมูล', value: 'action', sortable: false, align: 'center' }
      ],
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
            'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        IDcardRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
            'กรุณากรอกตัวเลข 0 ถึง 9',
        required: value => !!value || 'กรุณากรอก.',
        resizeImag: value =>
          !value ||
            value.size < 2000000 ||
            'Avatar size should be less than 2 MB!',
        counterIDcard: value => value.length <= 13 || 'Max 13 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
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
      speakerId: 3,
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
      countConfirmList: []
    }
  },
  async mounted () {
    this.Fontsize = this.colsWidth
    await this.getShop()
    await this.getDataFlow()
    await this.getDataBranch()
    this.setTime()
    this.$root.$on('closeSetTimeBookingMonitor', () => {
      // your code goes here
      this.closeSetTimeBookingMonitor()
    })
    this.dateStart = moment().format('YYYY-MM-DD')
    this.clearTimeLoop()
    this.checkSearch()
    document.querySelector('body').requestFullscreen()
    console.log('tetx', this.text)
    if (this.isMobileDevice()) {
      // Code to execute if the device is a mobile device
      window.scrollTo(0, 1)
    }
  },
  beforeDestroy () {
    this.$root.$off('dataReturn')
  },
  methods: {
    isMobileDevice () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    font () {
      if (this.resCol === '12') {
        return '14px'
      } else {
        return '24px'
      }
      // console.log('sssss', this.resCol)
    },
    font2 () {
      if (this.resCol === '12') {
        return '17px'
      } else {
        return '48px'
      }
    },
    font3 () {
      if (this.resCol === '12') {
        return '10px'
      } else {
        return '28px'
      }
    },
    font4 () {
      if (this.resCol === '12') {
        return '10px'
      } else {
        return '28px'
      }
    },
    async changeStatusSound (text) {
      console.log('changeStatusSound', text)
      if (text === 'on') {
        this.statusSound = true
        await this.updatestatusNotifyByShopId()
        this.getMessage()
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
    updateMessage (id, result) {
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
        await axios
          .get(
            `${this.DNS_IP}/callQueues/get?storeFrontQueue=${item.storeFrontQueue}&shopId=` + this.$session.getAll().data.shopId + `&audioFile=notNull`
          ).then(async (response) => {
            if (response.data.length > 0 && typeof response.data.status === 'undefined') {
              item.audioFile = response.data[0].audioFile
            }
          })

          // let text = this.convertItemtoText(item)
        if (!item.audioFile) {
          var params = {
            text: storeFrontQueue,
            text_delay: storeFrontQueue,
            speaker: this.speakerId,
            volume: 1,
            speed: 1,
            type_media: 'wav'
          }
          await axios
            .post(
              'https://api-voice.botnoi.ai/openapi/v1/generate_audio',
              params,
              { headers: { 'Botnoi-Token': 'VTNjZDc5OTM3ZjM4MDg4NzhkYzlkMTI0ZjNiZWZlMTZkNTYxODk0' } }
            ).then((res) => {
              this.playSound(res.data)
              result = res.data
            })
        } else {
          let res = { text: item.storeFrontQueue, audio_url: item.audioFile }
          this.playSound(res)
          result = res
        }
        return result
      } catch (e) {
        console.log(e)
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
      console.log(res)
      this.audio = res.audio_url
      // this.tableTarget = this.tableAudioList[this.tableId]
      this.timeCount = 1
      let playerPrefix = document.getElementById('playerPrefix')
      let playerQueue = document.getElementById('playerQueue')
      let playerSuffix = document.getElementById('playerSuffix')
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
                  var vid = document.getElementById('videoAds')
                  vid.play()
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
          console.log('getShop', rs)
          if (rs.length > 0) {
            this.shop = rs
            this.shopName = rs[0].shopName
            this.shopColor = rs[0].primaryColor
            this.shopImage = rs[0].shopImge
            this.videoLinkMonition = rs[0].videoLinkMonition
            this.bgColor = this.hexToRgbA(rs[0].primaryColor)
            console.log('rs[0].primaryColor', rs[0].primaryColor)
            this.bgColor2 = this.bgColor22(this.bgColor)
            this.bgColor3 = this.bgColor33(this.bgColor2)
            this.text = this.HEXToVBColor(rs[0].primaryColor)
            this.text2 = this.HEXToVBColor(this.bgColor3)
            console.log('bgColor2', this.bgColor)
            console.log('bgColor3', this.text2)
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
      console.log('rgb', rgb)
      var c = rgb.slice(3).slice(1, -1).split(',')
      console.log('ddddds', c)
      return 'rgb(' + (parseInt(c[0]) + 50) + ',' + (parseInt(c[1]) + 50) + ',' + (parseInt(c[2]) + 50) + ')'
    },
    bgColor33 (rgb) {
      var c = rgb.slice(3).slice(1, -1).split(',')
      return 'rgb(' + (parseInt(c[0]) + 50) + ',' + (parseInt(c[1]) + 50) + ',' + (parseInt(c[2]) + 50) + ', 0.3)'
    },
    HEXToVBColor (a) {
      console.log('HEXToVBColor', a)
      let rr = parseInt(a.substr(1, 2), 16)
      let gg = parseInt(a.substr(3, 2), 16)
      let bb = parseInt(a.substr(5, 2), 16)

      console.log('rrrr', rr * 0.299 + gg * 0.587 + bb * 0.114)
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
        this.itemBooking = []
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
            console.log('getData', response.data)
            let rs = response.data
            if (rs.length > 0) {
              let sortData = rs.sort((a, b) => {
                if (a.storeFrontQueue < b.storeFrontQueue) return -1
                return a.storeFrontQueue > b.storeFrontQueue ? 1 : 0
              })
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
              console.log(dataCon, dataWain)
              let sortDataDataCon = dataCon.sort((a, b) => {
                if (a.LAST_DATE > b.LAST_DATE) return -1
                return a.LAST_DATE < b.LAST_DATE ? 1 : 0
              })
              this.countConfirm = dataWain.length
              this.countConfirmList = dataWain.filter((el, ind) => { return ind <= 11 })
              this.itemBookingUse = [ ...sortDataDataCon, ...dataWain ].filter((el, ind) => { return ind <= 5 })
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
        .get(this.DNS_IP + `/flow/get?shopId=${this.shopId}&storeFrontCheck=True`)
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
      this.branchItem = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName', '', 'masBranchNameEn')
      if (this.branchItem.length > 0) {
        this.masBranchID = this.branchItem[0].value
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
</style>
