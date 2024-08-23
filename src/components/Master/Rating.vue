<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
        </v-row>
        <v-row>
          <v-dialog v-model="dialog" persistent max-width="600">
            <v-card class="pa-3">
              <v-container>
                <div style="text-align: end;">
                  <v-btn fab small dark color="#F3F3F3" @click="dialog = false">
                    <v-icon dark color="#FE4A01 ">
                      mdi-close
                    </v-icon>
                  </v-btn>
                </div>
              </v-container>
              <v-timeline>
                <v-timeline-item
                  v-for="(item, index) in timelineitem"
                  :key="index"
                  :color="codeColor[index]"
                  small
                >
                  <template v-slot:opposite>
                    <span>{{ format_dateNotime(item.DTLAST_DATE) }}</span>
                  </template>
                  <v-card
                    class="elevation-2 p-2"
                    :style="'border-top: 8px solid ' + codeColor[index] + ';'"
                  >
                    <v-card-title class="text-h6" style="color:#173053;">
                    </v-card-title>
                    <v-card-text>
                      <p
                        class="font-weight-black"
                        style="margin-bottom: 0px;color:#000000;"
                      >
                        ขั้นตอน {{ item.stepTitle }}
                      </p>
                      <!-- <p style="margin-bottom: 0px; color:#173053;">ขั้นตอน {{item.stepTitle}}</p> -->
                      <p
                        v-if="item.stepTitle !== 'ปิดจ๊อบ'"
                        class="font-weight-bold"
                        style="margin-bottom: 0px;"
                      >
                        เวลาที่รับงาน {{ momenTime(item.DTLAST_DATE) }}
                      </p>
                      <p
                        v-if="item.stepTitle !== 'ปิดจ๊อบ'"
                        class="font-weight-bold"
                        style="margin-bottom: 0px;"
                      >
                        ผู้รับผิดชอบ {{ item.empStep }}
                      </p>
                      <p
                        v-if="item.stepTitle !== 'ปิดจ๊อบ'"
                        class="font-weight-bold"
                        style="margin-bottom: 0px;"
                      >
                        เวลาการทำงาน {{ item.Counttime }} นาที
                      </p>
                      <p
                        v-if="item.stepTitle === 'ปิดจ๊อบ'"
                        class="font-weight-bold"
                        style="margin-bottom: 0px;"
                      >
                        สรุปค่าใช้จ่าย {{ item.totalPrice }} บาท
                      </p>
                      <!-- <p style="margin-bottom: 0px;">วันที่เปลี่ยน {{format_dateNotime(item.DTLAST_DATE)}}</p> -->
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
              <br />
            </v-card>
          </v-dialog>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-select
              :items="branch"
              v-model="masBranchID"
              dense
              outlined
              hide-details
              filled
              label="สาขา"
              prepend-inner-icon="mdi-map-marker"
              class="ma-2"
              @change="getRating()"
            ></v-select>
          </v-col>
          <v-col cols="3">
      <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="startDate"
            label="START DATE"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="startDate"
          @input="onStartDateInput"
          :max="endDate"
          outlined
          @change="getRating()"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="3">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="endDate"
            label="END DATE"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="endDate"
          :min="startDate"
          @input="onEndDateInput"
          outlined
          @change="getRating()"
        ></v-date-picker>
      </v-menu>
    </v-col>
          <v-col cols="2" align="right">
            <v-btn
            color="primary"
            class="ma-2"
            outlined
            @click="exportExcel(booking.masBranchName, booking.flowName)"
            >
              <v-icon>mdi-calendar-multiselect</v-icon>
              Export
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="Ratingitem"
                :search="search"
              >
                <template v-slot:[`item.displayName`]="{ item }">
                  <v-avatar class="pa-2">
                    <img :src="item.pictureUrl" />
                  </v-avatar>
                  <strong v-html="item.displayName"></strong>
                </template>
                <template v-slot:[`item.rating`]="{ item }">
                  <div v-if="rs.answerId !== null">
                    <v-rating
                      v-model="item.rating"
                      color="yellow darken-3"
                      background-color="grey darken-1"
                      empty-icon="$ratingFull"
                      :length="
                        item.ratingMax === '' || item.ratingMax === null
                          ? 5
                          : item.ratingMax
                      "
                      readonly
                      small
                    ></v-rating>
                  </div>
                  <div v-else>
                    <v-rating
                      v-model="item.rating"
                      color="yellow darken-3"
                      background-color="grey darken-1"
                      empty-icon="$ratingFull"
                      length="5"
                      readonly
                      small
                    ></v-rating>
                  </div>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <v-btn
                    v-if="item.callBackStatus === 'True'"
                    :color="
                      item.staffCallBack === 'True' ? '#173053' : 'warning'
                    "
                    fab
                    small
                    dark
                    @click="getBookingDataCallBack(item, item.masBranchID)"
                  >
                    <v-icon> mdi-phone-in-talk </v-icon>
                  </v-btn>
                  <v-btn
                    color="#173053"
                    fab
                    small
                    dark
                    @click="getBookingData(item)"
                  >
                    <v-icon> mdi-account-details </v-icon>
                  </v-btn>
                  <v-btn
                    color="#173053"
                    fab
                    small
                    dark
                    @click="getJobitem(item), (dialog = true)"
                  >
                    <v-icon> mdi-timeline-clock </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-dialog v-model="dialogBooking" persistent width="500px">
          <v-card class="pa-1">
            <v-container>
              <div style="text-align: end;">
                <v-btn
                  fab
                  small
                  dark
                  color="#F3F3F3"
                  @click="dialogBooking = false"
                >
                  <v-icon dark color="#FE4A01 ">
                    mdi-close
                  </v-icon>
                </v-btn>
              </div>
            </v-container>
            <v-col class="text-center pa-0 px-3">
              <!-- <v-img
                  id="v_text_edits"
                  :src="require('@/assets/GroupEditTitle.svg')"
                ></v-img> -->
              <h2 class="font-weight-bold" style="color:#173053;">
                รายละเอียดนัดหมาย
              </h2>
            </v-col>
            <v-card-text class="text-left">
              <v-container>
                <h6 class="font-weight-bold" style="color:#000000;">
                  วันที่นัดหมาย : {{ format_dateThai(booking.dueDate) }}
                </h6>
                <h6 class="font-weight-bold" style="color:#000000;">
                  ประเภทบริการ : {{ booking.flowName }}
                </h6>
                <h6 class="font-weight-bold" style="color:#000000;">
                  สาขา : {{ booking.masBranchName }}
                </h6>
                <v-row v-for="(item, index3) in bookingData" :key="index3">
                  <v-col
                    v-if="item.fieldValue !== ''"
                    col="6"
                    class="pb-0"
                    style="color:#000000;"
                    ><strong style="color:#000000;"
                      >{{ item.fieldName }} :
                    </strong>
                    {{ item.fieldValue }}</v-col
                  >
                </v-row>
                <v-row>
                  <v-col cols="12" v-if="booking.remark" style="color:#000000;"
                    ><strong style="color:#000000;">หมายเหตุเพิ่มเติม : </strong
                    >{{ booking.remark }}</v-col
                  >
                </v-row>
                <hr />
                <v-row>
                  <v-col cols="12" style="color:#000000;" class="pb-0"
                    ><strong style="color:#000000;">คะแนนที่ได้</strong></v-col
                  >
                  <v-col cols="12" class="pt-0">
                    <div v-for="(data, index) in dataRating" :key="index">
                      <label>{{ data.answer }}</label>
                      <div v-if="rs.answerId !== null">
                        <v-rating
                          v-model="data.rating"
                          color="yellow darken-3"
                          background-color="grey darken-1"
                          empty-icon="$ratingFull"
                          :length="
                            data.ratingMax === '' || data.ratingMax === null
                              ? 5
                              : data.ratingMax
                          "
                          readonly
                          small
                        ></v-rating>
                      </div>
                      <div v-else>
                        <v-rating
                          v-model="data.rating"
                          color="yellow darken-3"
                          background-color="grey darken-1"
                          empty-icon="$ratingFull"
                          length="5"
                          readonly
                          small
                        ></v-rating>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" style="color:#000000;"
                    ><strong style="color:#000000;"
                      >ความคิดเห็นเพิ่มเติม : </strong
                    >{{ commentsCombined[0] }}</v-col
                  >
                </v-row>
              </v-container>
            </v-card-text>
            <br />
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogCallBack" persistent width="500px">
          <v-card class="pa-1">
            <v-container>
              <div style="text-align: end;">
                <v-btn
                  fab
                  small
                  dark
                  color="#F3F3F3"
                  @click="dialogCallBack = false"
                >
                  <v-icon dark color="#FE4A01 ">
                    mdi-close
                  </v-icon>
                </v-btn>
              </div>
            </v-container>
            <v-col class="text-center pa-0 px-3">
              <!-- <v-img
                  id="v_text_edits"
                  :src="require('@/assets/GroupEditTitle.svg')"
                ></v-img> -->
              <h2 class="font-weight-bold" style="color:#173053;">
                ลูกค้าต้องการให้ติดต่อกลับ
              </h2>
            </v-col>
            <v-card-text class="text-left">
              <v-container>
                <h6 class="font-weight-bold" style="color:#000000;">
                  วันที่นัดหมาย : {{ format_dateThai(booking.dueDate) }}
                </h6>
                <h6 class="font-weight-bold" style="color:#000000;">
                  ประเภทบริการ : {{ booking.flowName }}
                </h6>
                <h6 class="font-weight-bold" style="color:#000000;">
                  สาขา : {{ booking.masBranchName }}
                </h6>
                <v-row v-for="(item, index3) in bookingData" :key="index3">
                  <v-col
                    v-if="
                      item.fieldValue !== '' && item.fieldName !== 'เบอร์โทร'
                    "
                    col="6"
                    class="pb-0"
                    style="color:#000000;"
                    ><strong style="color:#000000;"
                      >{{ item.fieldName }} :
                    </strong>
                    {{ item.fieldValue }}</v-col
                  >
                  <v-col
                    v-if="
                      item.fieldValue !== '' && item.fieldName === 'เบอร์โทร'
                    "
                    col="12"
                    class="pb-0"
                    style="color:#000000;"
                    ><strong style="color:#000000;"
                      >{{ item.fieldName }} :
                    </strong>
                    <a @click="dial(item.fieldValue)">{{
                      item.fieldValue
                    }}</a></v-col
                  >
                </v-row>
                <v-row>
                  <v-col cols="12" v-if="booking.remark" style="color:#000000;"
                    ><strong style="color:#000000;">หมายเหตุเพิ่มเติม : </strong
                    >{{ booking.remark }}</v-col
                  >
                </v-row>
                <hr />
                <v-row>
                  <v-col cols="12" style="color:#000000;" class="pb-0"
                    ><strong style="color:#000000;">คะแนนที่ได้</strong></v-col
                  >
                  <v-col cols="12" class="pt-0">
                    <div v-for="(data, index) in dataRating" :key="index">
                      <label>{{ data.answer }}</label>
                      <div v-if="rs.answerId !== null">
                        <v-rating
                          v-model="data.rating"
                          color="yellow darken-3"
                          background-color="grey darken-1"
                          empty-icon="$ratingFull"
                          :length="
                            data.ratingMax === '' || data.ratingMax === null
                              ? 5
                              : data.ratingMax
                          "
                          readonly
                          small
                        ></v-rating>
                      </div>
                      <div v-else>
                        <v-rating
                          v-model="data.rating"
                          color="yellow darken-3"
                          background-color="grey darken-1"
                          empty-icon="$ratingFull"
                          length="5"
                          readonly
                          small
                        ></v-rating>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" style="color:#000000;"
                    ><strong style="color:#000000;"
                      >ความคิดเห็นเพิ่มเติม : </strong
                    >{{ commentsCombined[0] }}</v-col
                  >
                </v-row>
                <hr />
                <v-row>
                  <v-col cols="12" style="color:#000000;" class="pb-0"
                    ><strong style="color:#000000;"
                      >อัพเดทสถานะการติดต่อ</strong
                    ></v-col
                  >
                  <v-col cols="12" class="pt-0">
                    <v-checkbox
                      label="พนักงานติดต่อแล้ว"
                      false-value="False"
                      :on-icon="'mdi-check-circle'"
                      :off-icon="'mdi-checkbox-blank-circle-outline'"
                      color="#1B437C"
                      true-value="True"
                      style="display: flex;align-items: flex-start;"
                      v-model="formUpdate.staffCallBack"
                    ></v-checkbox>
                    <v-textarea
                      v-model="formUpdate.staffCallBackRemark"
                      label="หมายเหตุพนักงาน"
                      auto-grow
                      outlined
                      rows="3"
                      row-height="25"
                      shaped
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" class="pt-0">
                    <v-btn
                      dark
                      elevation="2"
                      large
                      block
                      color="#173053"
                      @click="updateStatusCallBack()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      อัพเดทสถานะการติดต่อ
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <br />
          </v-card>
        </v-dialog>
      </div>
      <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    XLSX,
    readXlsxFile
  },
  data () {
    return {
      dialogCallBack: false,
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'ข้อมูลนัดหมาย',
          disabled: false,
          href: '/Master/Rating'
        }
      ],
      dialog: false,
      dialogBooking: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      search: '',
      headers: [
        { text: 'วันที่', value: 'CREATE_DATE' },
        { text: 'ชื่อลูกค้า', value: 'displayName' },
        { text: 'คะแนน', value: 'rating' },
        { text: 'ความคิดเห็นเพิ่มเติม', value: 'comment' },
        {
          text: 'ดูรายละเอียดงาน',
          value: 'action',
          sortable: false,
          align: 'center'
        }
      ],
      Ratingitem: [],
      Ratingitemold: [],
      timelineitem: [],
      codeColor: [
        'rgb(142, 202, 230)',
        'rgb(33, 158, 188)',
        'rgb(2, 48, 71)',
        'rgb(241, 91, 76)',
        'rgb(255, 183, 3)',
        'rgb(251, 133, 0)',
        'rgb(61,90,128)',
        'rgb(152,193,217)',
        'rgb(224,251,252)',
        'rgb(255,212,91)',
        'rgb(238,108,77)',
        'rgb(41,50,65)'
      ],
      booking: [],
      bookingData: [],
      dataRating: [],
      rs: [],
      filterdate: [],
      formUpdate: {
        staffCallBack: 'False',
        staffCallBackRemark: '',
        LAST_USER: ''
      },
      DataBranchAll: [],
      branch: [],
      commentsCombined: '',
      masBranchID: '',
      dates: ['2019-09-10', '2019-09-20'],
      menu: false,
      menu2: false,
      startDate: '',
      endDate: '',
      response: [],
      dateNow: new Date(),
      ArrayData: [],
      overlay: false
    }
  },
  async created () {
    const today = new Date()
    const firstDayOfMonth = new Date(today)
    firstDayOfMonth.setDate(1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1)

    this.startDate = firstDayOfMonth.toISOString().slice(0, 10)
    this.endDate = lastDayOfMonth.toISOString().slice(0, 10)

    await this.onStartDateInput()
    await this.onEndDateInput()
  },
  computed: {
    minEndDate () {
      return this.startDate
    },
    dateRangeText () {
      return this.dates.join(' ~ ')
    }
  },
  async mounted () {
    await this.getDataBranch()
  },
  methods: {
    dial: function (number) {
      window.location = 'tel:' + number
    },
    getDataBranch () {
      this.DataBranchAll = []
      this.branch = []
      // console.log('DataBranchAll', this.DataBranchAll)
      axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              if (
                this.session.data.masBranchID === '' ||
                this.session.data.masBranchID === null
              ) {
                // console.log(
                //   'TEST1',
                //   d.masBranchID,
                //   this.session.data.masBranchID
                // )
                let s = {}
                s.text = d.masBranchName
                s.value = d.masBranchID
                this.DataBranchAll.push(d)
                this.branch.push(s)
              } else {
                // console.log(
                //   'TEST',
                //   d.masBranchID,
                //   this.session.data.masBranchID
                // )
                if (d.masBranchID === this.session.data.masBranchID) {
                  let s = {}
                  s.text = d.masBranchName
                  s.value = d.masBranchID
                  this.DataBranchAll.push(d)
                  this.branch.push(s)
                }
              }
            }
          } else {
            this.DataBranchName = []
            this.branch = []
          }
          if (this.branch.length > 0) {
            this.masBranchID = this.branch[0].value
            await this.getRating()
          }
        })
    },
    async getRating () {
      this.Ratingitem = []
      const payload = {
        shopId: this.shopId,
        masBranchID: this.masBranchID,
        create_date_start: this.startDate,
        create_date_end: this.endDate
      }
      await axios
        .get(this.DNS_IP + '/rating/get', { params: payload })
        .then(async response => {
          if (response.data.status !== false) {
            console.log('getRating', response.data)
            this.rs = response.data
            this.response = response
            this.filterByDateRange()
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async filterItem (rs, response) {
      this.Ratingitem = []
      if (rs.length > 0) {
        let tempGroup = rs.reduce((acc, d) => {
          if (d.masBranchID === this.masBranchID) {
            let refId = d.refId
            if (!acc[refId]) {
              acc[refId] = {
                sumRating: 0,
                countRating: 0,
                data: {
                  id: d.id,
                  refId: refId,
                  rating: parseInt(d.rating),
                  ratingMax: d.ratingMax,
                  comment: d.comment,
                  typeWork: d.typeWork,
                  displayName: d.displayName,
                  pictureUrl: d.pictureUrl,
                  callBackStatus: d.callBackStatus,
                  staffCallBack: d.staffCallBack,
                  staffCallBackRemark: d.staffCallBackRemark,
                  flowName: d.flowName,
                  bookingDataCustomerTel: d.bookingDataCustomerTel,
                  CREATE_DATE: this.format_dateNotime(d.CREATE_DATE)
                }
              }
            }
            acc[refId].sumRating += parseInt(d.rating)
            acc[refId].countRating += 1
          }
          return acc
        }, {})
        console.log('tempGroup', tempGroup)
        for (let refId in tempGroup) {
          if (refId.refId === response.data.refId) {
            let averageRating =
              tempGroup[refId].sumRating / tempGroup[refId].countRating
            let s = tempGroup[refId].data
            s.rating = averageRating
            this.Ratingitem.push(s)
          }
        }
      }
    },
    async getBookingData (item) {
      this.booking = []
      this.bookingData = []
      this.dataRating = this.rs.filter(data => data.refId === item.refId)
      this.dataRating.map(data => {
        data.rating = parseInt(data.rating)
      })

      this.commentsCombined = this.dataRating.reduce((comments, data) => {
        if (data.comment) {
          comments.push(data.comment)
        }
        return comments
      }, [])
      let urlApi =
        this.DNS_IP +
        '/booking_view/get?shopId=' +
        this.session.data.shopId +
        '&jobNo=' +
        item.refId
      await axios.get(urlApi).then(async response => {
        // console.log('getBookingData', response.data)
        if (response.data.status === false) {
          this.booking = []
          this.bookingData = []
          this.dialogBooking = false
          this.$swal('ผิดพลาด', 'ไม่มีข้อมูลนัดหมาย', 'error')
        } else {
          this.booking = response.data[0]
          await axios
            .get(
              `${this.DNS_IP}/BookingData/get?shopId=${this.session.data.shopId}&jobNo=${item.refId}`
            )
            .then(async responses => {
              // console.log('BookingData', responses.data)
              if (responses.data.status === false) {
                this.bookingData = []
              } else {
                this.bookingData = responses.data
              }
            })
          this.dialogBooking = true
        }
      })
    },
    async getbranceName (refIds) {
      let item = { refId: refIds }
      this.booking = []
      this.dataRating = this.rs.filter(data => data.refId === item.refId)
      this.dataRating.map(data => {
        data.rating = parseInt(data.rating)
      })

      let urlApi =
        this.DNS_IP +
        '/booking_view/get?shopId=' +
        this.session.data.shopId +
        '&jobNo=' +
        item.refId
      await axios.get(urlApi).then(async response => {
        // console.log('getBookingData', response.data)
        if (response.data.status === false) {
          this.booking = []
        } else {
          this.booking = response.data[0]
          console.log('masBranchNames', this.booking)
          // await this.ArrayData.push(this.booking + ',')
        }
      })
    },
    async getBookingDataCallBack (item) {
      // console.log('getBookingDataCallBack', item)
      this.booking = []
      this.bookingData = []
      console.log('this.rs', this.rs)
      this.dataRating = this.rs.filter(data => data.refId === item.refId)
      this.dataRating.map(data => {
        data.rating = parseInt(data.rating)
      })

      this.commentsCombined = this.dataRating.reduce((comments, data) => {
        if (data.comment) {
          comments.push(data.comment)
        }
        return comments
      }, [])

      this.formUpdate.staffCallBack = item.staffCallBack || 'False'
      this.formUpdate.staffCallBackRemark = item.staffCallBackRemark || ''
      let urlApi =
        this.DNS_IP +
        '/booking_view/get?shopId=' +
        this.session.data.shopId +
        '&jobNo=' +
        item.refId
      await axios.get(urlApi).then(async response => {
        // console.log('getBookingData', response.data)
        if (response.data.status === false) {
          this.booking = []
          this.bookingData = []
          this.dialogCallBack = false
          this.$swal('ผิดพลาด', 'ไม่มีข้อมูลนัดหมาย', 'error')
        } else {
          this.booking = response.data[0]
          await axios
            .get(
              `${this.DNS_IP}/BookingData/get?shopId=${this.session.data.shopId}&jobNo=${item.refId}`
            )
            .then(async responses => {
              // console.log('BookingData', responses.data)
              if (responses.data.status === false) {
                this.bookingData = []
              } else {
                this.bookingData = responses.data
              }
            })
          this.dialogCallBack = true
        }
      })
    },
    async filterByDateRange () {
      this.filterdate = this.rs.filter(data => {
        const currentDate = new Date(data.CREATE_DATE)
        const startDateWithTime = new Date(this.startDate + 'T00:00:00')
        const endDateWithTime = new Date(this.endDate + 'T23:59:59')

        return (
          currentDate >= startDateWithTime && currentDate <= endDateWithTime
        )
      })
      console.log('this.filterdate', this.filterdate)
      this.filterItem(this.filterdate, this.response)
    },
    updateStatusCallBack () {
      this.$swal({
        title: 'ต้องการ อัพเดทสถานะการติดต่อ ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async result => {
        this.formUpdate.LAST_USER = this.session.data.LAST_USER
        if (this.dataRating.length > 0) {
          axios
            .post(
              this.DNS_IP + '/rating/edit/' + this.dataRating[0].id,
              this.formUpdate
            )
            .then(response => {
              this.$swal(
                'เรียบร้อย',
                'อัพเดทสถานะการติดต่อ เรียบร้อย',
                'success'
              )
              this.getRating()
              this.dialogCallBack = false
            })
            .catch(error => {
              console.log('error function updateStatusCallBack : ', error)
            })
        } else {
          this.$swal('ผิดพลาด', 'กรุณาลองใหม่อีกครั้ง', 'error')
          this.getRating()
          this.dialogCallBack = false
        }
      })
    },
    async getJobitem (item) {
      // console.log('getJobitem', item)
      this.timelineitem = []
      await axios
        .get(this.DNS_IP + '/job_logCloseJob/' + item.refId)
        .then(response => {
          let rs = response.data
          // console.log('rs', rs)
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.empStep = d.empStep
              s.endDate = d.endDate
              s.totalPrice = s.totalPrice
              s.DTCREATE_DATE = d.CREATE_DATE
              s.DTLAST_DATE = d.LAST_DATE
              s.stepTitle = d.totalPrice === null ? d.stepTitle : 'ปิดจ๊อบ'
              s.timediff = d.timediff
              s.Counttime = this.convertHMS(
                this.jsTimeDiff(d.CREATE_DATE, d.LAST_DATE)
              )
              s.totalPrice = d.totalPrice
              this.timelineitem.push(s)
            }
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    convertHMS (value) {
      const sec = parseInt(value, 10) // convert value to number if it's string
      let hours = Math.floor(sec / 3600) // get hours
      let minutes = Math.floor((sec - hours * 3600) / 60) // get minutes
      let seconds = sec - hours * 3600 - minutes * 60 // get seconds
      // add 0 if value < 10; Example: 2 => 02
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return hours + ':' + minutes + ':' + seconds // Return is HH : MM : SS
    },
    jsTimeDiff (Time1, Time2) {
      var oneday = 1000 * 60
      var defDate =
        (new Date(Time2).getTime() - new Date(Time1).getTime()) / oneday
      // console.log('def', Time1, Time2)
      return defDate
    },
    async clearData () {
      this.timelineitem = []
    },
    onStartDateInput () {
      this.filterByDateRange()
      this.menu2 = false
      this.updateEndDateMinDate()
    },
    onEndDateInput () {
      this.filterByDateRange()
      this.menu = false
    },
    updateEndDateMinDate () {
      this.$refs.endDatePicker.minDate = this.startDate
    },
    async exportExcel () {
      this.overlay = true
      const dataAnswerId = []
      const dataUser = []
      for (let i = 0; i < this.rs.length; i++) {
        let d = this.rs[i]
        let v = {}
        d.answerId = d.answerId || 'old'
        v.answerId = d.answerId
        v.answer = d.answer || 'ประเมินแบบเก่า'
        if (dataAnswerId.filter(el => { return el.answerId === d.answerId }).length === 0) {
          dataAnswerId.push(v)
        }

        // console.log('dataanswer', dataanswer)
      }
      // let dataA = dataanswer.join('')
      // let dataB = dataA.replace(/"/g, '')
      // let dataBArray = dataB.split(',')
      // console.log('dataBArray', dataBArray)
      let answerHeaders = dataAnswerId.map(el => el.answer)
      const data = [
        ['รายงาน ' + 'ความพึงพอใจ ' + 'วันที่ ' + this.startDate + ' ถึง ' + this.endDate],
        ['ชื่อลูกค้า', 'วันที่ทำแบบสอบถาม', 'คำชี้แนะ', 'คะแนนโดยรวม', 'เบอร์ติดต่อ', 'ประเภทบริการ', ...answerHeaders]
      ]
      for (let i = 0; i < this.Ratingitem.length; i++) {
        dataUser[i] = []
        let item = this.Ratingitem[i]
        item.answerId = item.answerId || 'old'
        console.log('Ratingitem', item)
        // await this.getbranceName(item.refId)
        let rowData = [
          '"' + item.displayName ? item.displayName : '-' + '"',
          '"' + item.CREATE_DATE ? item.CREATE_DATE : '-' + '"',
          '"' + item.comment ? item.comment : '-' + '"',
          '"' + item.rating ? item.rating.toFixed(1) : '-' + '"',
          '"' + item.bookingDataCustomerTel ? item.bookingDataCustomerTel : '-' + '"',
          '"' + item.flowName ? item.flowName : '-' + '"'
        ]
        dataUser[i].push(rowData.join(','))
        let checkAnswer = this.filterdate.filter(el => { return el.refId === item.refId })
        if (checkAnswer.length > 0) {
          for (let n = 0; n < checkAnswer.length; n++) {
            let item2 = checkAnswer[n]
            item2.answerId = item2.answerId || 'old'
            for (let x = 0; x < dataAnswerId.length; x++) {
              let dataAnswer = dataAnswerId[x]
              if (item2.answerId === 'old') {
                if (dataAnswer.answerId !== 'old') {
                  dataUser[i].push(', ')
                } else {
                  dataUser[i].push(', "' + item2.rating + '"')
                }
              } else {
                if (item2.answerId === dataAnswer.answerId) {
                  dataUser[i].push(', "' + item2.rating + '"')
                }
              }
            }
            // }
          }
        }
        let dataUserA = dataUser[i].join('')
        let dataUserBArray = dataUserA.replace(/"/g, '').split(',')
        // console.log('dataUserBArray', dataUserBArray)
        data.push(dataUserBArray)
      }

      // console.log('data', data)

      const ws = XLSX.utils.aoa_to_sheet(data)
      // Set report title
      ws['A1'].s = {
        font: { bold: true, size: 24 }, // Bold and size 18 font
        alignment: { horizontal: 'center' } // Center align the text
      }
      ws['A2'].s = {
        font: { bold: false, size: 18 }, // Bold and size 18 font
        alignment: { horizontal: 'center' } // Center align the text
      }

      let NameBranch = this.branch.filter(data => data.value === this.masBranchID)
      const today = new Date()
      const year = today.getFullYear()
      const month = (today.getMonth() + 1).toString().padStart(2, '0') // +1 เพราะเดือนเริ่มที่ 0
      const day = today.getDate().toString().padStart(2, '0')
      const hours = today.getHours().toString().padStart(2, '0')
      const minutes = today.getMinutes().toString().padStart(2, '0')
      const seconds = today.getSeconds().toString().padStart(2, '0')

      const formattedDate = `${year}-${month}-${day} เวลา ${hours}-${minutes}-${seconds}`
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, 'สาขา' + NameBranch[0].text + ' ' + formattedDate + '.xlsx')
      this.overlay = false
    }
  }
}
</script>
<style scope>
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
</style>
