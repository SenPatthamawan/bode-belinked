<template>
  <v-main>
    <v-row class="fill-height">
    <v-col class="pa-3">
      <!-- \border-color: rgb(0 0 0)!important; -->
      <!-- <v-sheet
        tile
        height="54"
        class="d-flex"
      >
        <v-btn
          icon
          class="ma-2"
          @click="$refs.calendar.prev()"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="type"
          :items="types"
          dense
          outlined
          hide-details
          class="ma-2"
          label="type"
        ></v-select>
        <v-select
          v-model="mode"
          :items="modes"
          dense
          outlined
          hide-details
          label="event-overlap-mode"
          class="ma-2"
        ></v-select>
        <v-select
          v-model="weekday"
          :items="weekdays"
          dense
          outlined
          hide-details
          label="weekdays"
          class="ma-2"
        ></v-select>
        <v-spacer></v-spacer>
        <v-btn
          icon
          class="ma-2"
          @click="$refs.calendar.next()"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-sheet> -->
          <div class="pa-0 ma-0" v-if="colsSize === 'md' || colsSize === 'lg' || colsSize === 'xl'">
            <v-sheet class="Main pa-3" v-if="focus">
            <div class="menuleft">
            <div>
              <v-select
              v-model="type"
              :items="types"
              dense
              outlined
              hide-details
              class="ma-2"
              label="ประเภทปฏิทิน"
            ></v-select>
            </div>
            <div style="overflow-y: scroll;">
            <v-date-picker
            v-model="focus"
            no-title
            >
            </v-date-picker>
              <v-btn
              small
              color="success"
              class="my-2"
              :loading="loading"
              @click="ExportJob()">
                <v-icon left>mdi-file-excel</v-icon>
                Export
              </v-btn>
              <v-sheet elevation="2" class="pa-2 px-3 py-6 ma-1">
              <h6 class="text-center font-weight-black">EVENT COLOR</h6>
              <div style="display: flex;justify-content: space-around;">
                <!-- {{ typeColor }} -->
                <div class="radio-switch">
                  <label class="radio-switch-label" for="radio-switch-All"  @click="typeColorStatus('Flow')" :style="{
                    backgroundColor:
                    typeColor === 'Flow' ? '#5987d6' : 'rgb(240 240 240)',
                    color: typeColor === 'Flow' ? '#fff' : 'rgb(89 135 214 / 78%)',
                    borderRadius:
                    typeColor === 'Flow'
                        ? '10px'
                        : '10px 0px 0px 10px'
                  }">บริการ
                  </label>
                  <label class="radio-switch-label" for="radio-switch-low" @click="typeColorStatus('Emp')" :style="{
                    backgroundColor:
                    typeColor === 'Emp' ? '#5987d6' : 'rgb(240 240 240)',
                    color: typeColor === 'Emp' ? '#fff' : 'rgb(89 135 214 / 78%)',
                    borderRadius:
                    typeColor === 'Emp' ? '10px' : '0px 10px 10px 0px'
                  }">พนักงาน
                  </label>
                </div>
                <!-- <v-switch
                v-model="typeColor"
                hide-details
                inset
                label="บริการ"
                :true-value="typesColor[0]"
                :false-value="typesColor[1]"
              ></v-switch>
              <v-switch
                v-model="typeColor"
                hide-details
                inset
                :true-value="typesColor[1]"
                :false-value="typesColor[0]"
                label="พนักงาน"
              ></v-switch> -->
              </div>
            </v-sheet>
            <v-expansion-panels v-model="panel" multiple class="pa-2">
              <v-expansion-panel>
                <v-expansion-panel-header>{{ 'บริการ ' + '( ' + flowName.length + ' )' }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="pa-1"  v-for="(item , index) in flowName" :key="index">
                    <h6 style="display: flex;align-items: center;">
                      <v-icon class="mr-2" :color="colors[index]">mdi-checkbox-multiple-blank</v-icon>
                      {{ item.text }}
                    </h6>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>{{ 'พนักงาน ' + '( ' + categoriesCheckBox.length + ' )' }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <!-- Filter ช่างได้ -->
                  <!-- {{ categoriesCheckBoxs }} -->
                  <div class="pa-1" v-if="categoriesCheckBox.length > 0">
                    <div style="display: flex;justify-content: space-between;">
                      <v-checkbox
                        hide-details
                        on-icon="mdi-checkbox-marked-circle"
                        off-icon="mdi-checkbox-blank-circle-outline"
                        v-model="checkboxAll"
                        label="ทั้งหมด"
                        false-value="None"
                        true-value="All"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="checkboxAll"
                        on-icon="mdi-checkbox-marked-circle"
                        off-icon="mdi-checkbox-blank-circle-outline"
                        hide-details
                        label="มีงาน"
                        false-value="None"
                        true-value="Job"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="checkboxAll"
                        on-icon="mdi-checkbox-marked-circle"
                        off-icon="mdi-checkbox-blank-circle-outline"
                        hide-details
                        label="ว่าง"
                        false-value="None"
                        true-value="NoneJob"
                      ></v-checkbox>
                    </div>
                    <v-divider></v-divider>
                    <v-checkbox
                      :color="colors[index2]"
                      hide-details
                      v-for="(item2 , index2) in categoriesCheckBox" :key="index2"
                      v-model="categories"
                      :label="item2"
                      :value="item2"
                      @click="filterEmp(item2, index2), maplegnht()"
                    ></v-checkbox>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            </div>
          </div>
          <div class="pl-1 menuright">
            <FullCalendar
             v-if="type !== 'category'"
            :events="events"
            :focus="focus"
            :type="type"
            :colors="colors"
            :categories="categories"
            :categoriesCheckBox="categoriesCheckBox"
            :typeColor="typeColor"
            :names="names"
            :flowName="flowName"
            @send-data="changeData"
            @more="clickMore"
            @showEvent="getShowEvent"
            ></FullCalendar>
            <CategoryCalendar
              v-else
              :events="events"
              :focus="focus"
              :type="type"
              :typeColor="typeColor"
              :colors="colors"
              :names="names"
              :categories="categories"
              :categoriesItem="categoriesItem"
              :categoriesCheckBox="categoriesCheckBox"
              :empDayoff="empDayoff"
              :flowName="flowName"
              @send-data="changeData"
              @showEvent="getShowEvent"
              >
              </CategoryCalendar>
          </div>
        </v-sheet>
          </div>
          <div class="pa-0 ma-0" v-else>
            <v-sheet class="pa-3 MainMobile" v-if="focus">
              <div class="pl-1 menuright">
                <CategoryCalendar
                :events="events"
                :focus="focus"
                :type="type"
                :typeColor="typeColor"
                :colors="colors"
                :names="names"
                :categories="categories"
                :categoriesItem="categoriesItem"
                :categoriesCheckBox="categoriesCheckBox"
                :empDayoff="empDayoff"
                :flowName="flowName"
                @send-data="changeData"
                @showEvent="getShowEvent"
                >
                </CategoryCalendar>
              </div>
            </v-sheet>
          </div>
      <!-- เป็น prop ที่ไว้แสดงเวลาเริ่มและเวลาสิ้นสุด
        first-interval="7"
          :interval-count="24-7" -->
    </v-col>
  </v-row>
  <v-dialog
      v-model="dialogEvent"
      scrollable
      max-width="500px"
    >
      <v-card v-if="jobEvent">
        <v-card-title>{{ jobEvent.item[0].flowName }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text >
          <h3 class="mb-1" style="color: #2e76f6;">{{ jobEvent.startTime + '-' + jobEvent.endTime }}</h3>
          <h5 class="font-weight-black mb-1" style="color: rgb(93 93 93);">{{ format_dateNotime(jobEvent.item[0].dueDate) }}</h5>
          <div v-for="(dt, index) in jobEvent.jobData" :key="index" v-if="jobEvent.jobData.length > 0">
            <h5 class="font-weight-black mb-1" style="color: rgb(93 93 93);" v-if="dt.fieldName === 'ชื่อ'">{{ dt.fieldValue }}</h5>
            <p class="mb-1" v-else>{{ dt.fieldValue }}</p>
          </div>
          <div style="display: flex;align-items: flex-start;">
            <v-icon color="rgb(255 146 146)">mdi-map-marker</v-icon>
            <p class="mb-1">
              {{ jobEvent.item[0].address }}
            </p>
          </div>
          <v-chip
            v-if="jobEvent.item[0].RECORD_STATUS === 'N'"
            class="ma-2"
            color="green"
            text-color="white"
          >
            {{jobEvent.status}}
          </v-chip>
          <v-chip
            v-else
            class="ma-2"
            color="red"
            text-color="white"
          >
          {{jobEvent.status}}
          </v-chip>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions style="display: flex;justify-content: flex-end;">
          <v-btn
            color="blue darken-1"
            text
            @click="dialogEvent = false"
          >
            ปิด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  <!-- <FullCalendar :events="TT"></FullCalendar> -->
  </v-main>
</template>

<script>
import axios from 'axios' // api
import moment from 'moment' // แปลง date
import FullCalendar from './FullCalendar.vue'
// import CalendarCategory from './CalendarCategory.vue'
import CategoryCalendar from './CategoryCalendar.vue'
import XLSX from 'xlsx' // import xlsx
export default {
  components: {
    CategoryCalendar,
    FullCalendar
  },
  computed: {
    colsWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '12'
        case 'sm': return '12'
        case 'md': return '12'
        case 'lg': return '4'
        case 'xl': return '4'
      }
    },
    colsSize () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'xs'
        case 'sm': return 'sm'
        case 'md': return 'md'
        case 'lg': return 'lg'
        case 'xl': return 'xl'
      }
    }
  },
  data () {
    return {
      dialogEvent: false,
      dia: null,
      panel: [0, 1],
      type: 'month',
      types: ['month', 'day', 'category'],
      // types: ['month', 'week', 'day', '4day', 'category'],
      typeColor: 'Emp',
      typesColor: ['Flow', 'Emp'],
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] }
      ],
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      focus: null,
      pickerDate: null,
      events: [],
      eventsMaster: [],
      // colors: [
      //   '#FE6F5E',
      //   '#E4CC51',
      //   '#C32876',
      //   '#532A75',
      //   '#57472E',
      //   '#B93424',
      //   '#B66D2F',
      //   '#024B55',
      //   '#568455',
      //   '#FF9B8E',
      //   '#57A298',
      //   '#009076',
      //   '#722211',
      //   '#A10057',
      //   '#89ACBC',
      //   '#222E75',
      //   '#705899',
      //   '#696BC5',
      //   '#123249',
      //   '#0A3E28'
      // ],
      colors: [
        '#FE6F5E', '#E4CC51', '#C32876', '#532A75', '#57472E', '#B93424', '#B66D2F', '#024B55', '#568455', '#FF9B8E',
        '#57A298', '#009076', '#722211', '#A10057', '#89ACBC', '#222E75', '#705899', '#696BC5', '#123249', '#0A3E28',
        '#FE7D6E', '#E4D651', '#C42877', '#542B74', '#57482F', '#BA3624', '#B66E30', '#014C55', '#578556', '#FF9D8D',
        '#58A299', '#009176', '#732111', '#A20058', '#8AACBD', '#232F75', '#705999', '#6A6CC6', '#133349', '#0B3F28',
        '#FF6F5D', '#E4CB50', '#C22875', '#522974', '#57462D', '#B83423', '#B66C2E', '#014A54', '#558355', '#FF9A8D',
        '#57A197', '#008F75', '#722011', '#A00056', '#88ABBB', '#212D74', '#6F5898', '#686AC4', '#113148', '#0A3D27',
        '#FD6F5D', '#E5CC52', '#C42977', '#542B73', '#57472E', '#B93423', '#B66D2F', '#024C56', '#578456', '#FF9B8F',
        '#58A197', '#009077', '#732311', '#A20058', '#8AACBD', '#222F74', '#705999', '#6A6BC5', '#123148', '#0A3E29',
        '#FF6E5D', '#E5CC51', '#C42876', '#542B73', '#57472E', '#B93323', '#B66D2E', '#024D55', '#568456', '#FF9C8D',
        '#57A198', '#009176', '#732011', '#A10057', '#8AABBD', '#232F74', '#705999', '#6A6BC4', '#133048', '#0A3E28'
      ],
      names: [],
      // categories: ['AAAAAA', 'BBBBBB']
      flowName: [],
      dataFlow: [],
      categories: [],
      categoriesCheckBox: [],
      categoriesItem: [],
      eventsItem: [],
      empDayoff: [],
      dataJob: [],
      TT: [],
      checkboxAll: 'All',
      loading: false,
      toggle_EVENT: undefined,
      newQuestionlength: '',
      jobEvent: null,
      jobEventData: []
    }
  },
  watch: {
    // whenever question changes, this function will run
    async checkboxAll (newQuestion, oldQuestion) {
      console.log('checkboxAll', newQuestion)
      this.newQuestionlength = newQuestion
      // console.log('this.categories', this.categories.length)
      // console.log('this.categoriesCheckBox', this.categoriesCheckBox.length)

      if (newQuestion === 'All') {
        this.categories = this.categoriesCheckBox
      } else if (newQuestion === 'Job') {
        let dt = []
        for (let index = 0; index < this.categoriesCheckBox.length; index++) {
          const element = this.categoriesCheckBox[index]
          if (this.type === 'day' || this.type === 'category') {
            if ((this.eventsMaster.filter((item) => item.category === element && (moment(item.start).format('YYYY-MM-DD') === this.focus)).length > 0) && (this.eventsMaster.filter((item) => (moment(item.start).format('YYYY-MM-DD') === this.focus)).length > 0)) {
              dt.push(element)
            }
          } else {
            if (this.eventsMaster.filter((item) => item.category === element).length > 0) {
              dt.push(element)
            }
          }
        }
        this.categories = dt
      } else if (newQuestion === 'NoneJob') {
        let dt = []
        for (let index = 0; index < this.categoriesCheckBox.length; index++) {
          const element = this.categoriesCheckBox[index]
          if (this.type === 'day' || this.type === 'category') {
            if ((this.eventsMaster.filter((item) => item.category === element).length === 0) && (this.eventsMaster.filter((item) => (moment(item.start).format('YYYY-MM-DD') === this.focus)).length > 0)) {
              dt.push(element)
            }
          } else {
            if (this.eventsMaster.filter((item) => item.category === element).length === 0) {
              dt.push(element)
            }
          }
        }
        this.categories = dt
      } else if (newQuestion === 'None') {
        this.categories = []
      }
    },
    async colsSize (newQuestion, oldQuestion) {
      if (newQuestion === 'md' || newQuestion === 'lg' || newQuestion === 'xl') {
      } else {
        this.type = 'category'
        this.typeColor = 'Flow'
      }
    },
    async focus (newQuestion, oldQuestion) {
      if (oldQuestion) {
        let monthnewQuestion = moment(newQuestion).format('YYYY-MM')
        let montholdQuestion = moment(oldQuestion).format('YYYY-MM')
        if (monthnewQuestion !== montholdQuestion) {
          // console.log('getDATA')
          this.events = []
          await this.setEvent()
          this.updateSelect()
        } else {
          let daynewQuestion = moment(newQuestion).format('YYYY-MM-DD')
          let dayoldQuestion = moment(oldQuestion).format('YYYY-MM-DD')
          console.log('daynewQuestion', daynewQuestion, dayoldQuestion)
          if (daynewQuestion !== dayoldQuestion) {
            // this.updateSelect()
            // console.log('this.checkboxAll', this.checkboxAll)
            if (this.checkboxAll === 'All') {
              this.categories = this.categoriesCheckBox
            } else if (this.checkboxAll === 'Job') {
              let dt = []
              for (let index = 0; index < this.categoriesCheckBox.length; index++) {
                const element = this.categoriesCheckBox[index]
                if (this.type === 'day' || this.type === 'category') {
                  if ((this.eventsMaster.filter((item) => item.category === element && (moment(item.start).format('YYYY-MM-DD') === this.focus)).length > 0) && (this.eventsMaster.filter((item) => (moment(item.start).format('YYYY-MM-DD') === this.focus)).length > 0)) {
                    dt.push(element)
                  }
                } else {
                  if (this.eventsMaster.filter((item) => item.category === element).length > 0) {
                    dt.push(element)
                  }
                }
              }
              this.categories = dt
            } else if (this.checkboxAll === 'NoneJob') {
              let dt = []
              for (let index = 0; index < this.categoriesCheckBox.length; index++) {
                const element = this.categoriesCheckBox[index]
                if (this.type === 'day' || this.type === 'category') {
                  if ((this.eventsMaster.filter((item) => item.category === element).length === 0) && (this.eventsMaster.filter((item) => (moment(item.start).format('YYYY-MM-DD') === this.focus)).length > 0)) {
                    dt.push(element)
                  }
                } else {
                  if (this.eventsMaster.filter((item) => item.category === element).length === 0) {
                    dt.push(element)
                  }
                }
              }
              this.categories = dt
            } else if (this.checkboxAll === 'None') {
              this.categories = []
            }
            this.updateSelect()
          }
        }
      }
    },
    async type (newQuestion, oldQuestion) {
      if (this.checkboxAll === 'All') {
        this.categories = this.categoriesCheckBox
      } else if (this.checkboxAll === 'Job') {
        let dt = []
        for (let index = 0; index < this.categoriesCheckBox.length; index++) {
          const element = this.categoriesCheckBox[index]
          if (this.type === 'day' || this.type === 'category') {
            if ((this.eventsMaster.filter((item) => item.category === element && (moment(item.start).format('YYYY-MM-DD') === this.focus)).length > 0) && (this.eventsMaster.filter((item) => (moment(item.start).format('YYYY-MM-DD') === this.focus)).length > 0)) {
              dt.push(element)
            }
          } else {
            if (this.eventsMaster.filter((item) => item.category === element).length > 0) {
              dt.push(element)
            }
          }
        }
        this.categories = dt
      } else if (this.checkboxAll === 'NoneJob') {
        let dt = []
        for (let index = 0; index < this.categoriesCheckBox.length; index++) {
          const element = this.categoriesCheckBox[index]
          if (this.type === 'day' || this.type === 'category') {

          } else {
            if ((this.eventsMaster.filter((item) => item.category === element).length === 0) && (this.eventsMaster.filter((item) => (moment(item.start).format('YYYY-MM-DD') === this.focus)).length > 0)) {
              dt.push(element)
            }
          }
        }
        this.categories = dt
      } else if (this.checkboxAll === 'None') {
        this.categories = []
      }
      this.updateSelect()
    },
    async categories (newQuestion, oldQuestion) {
      this.updateSelect()
    }
  },
  async mounted () {
    // console.log('this.DNS_IP ', this.DNS_IP)
    await this.getEmpOnsite()
    await this.getFlow()
    this.focus = moment().format('YYYY-MM-DD')
    // await this.getEventEmp()
    await this.setEvent()
    // await this.$refs.calendar.checkChange()
  },
  methods: {
    async typeColorStatus (data) {
      this.typeColor = data
    },
    async maplegnht () {
      try {
        if (this.newQuestionlength && this.categories.length) {
          if (this.newQuestionlength.length !== this.categories.length) {
            this.checkboxAll = null
          } else {
            this.checkboxAll = 'All'
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getShowEvent (data) {
      this.jobEvent = data
      let jobDataShow = await this.getJobDataShow(data.item[0].bookNo)
      this.jobEvent['jobData'] = jobDataShow
      console.log('this.jobEvent', this.jobEvent)
      this.dialogEvent = true
    },
    async ExportJob () {
      this.loading = true
      let job = await this.getExportJob()
      let jobData = await this.getExportJobData()
      let dataExport = []
      for (let i = 0; i < job.length; i++) {
        const element = job[i]
        let obj = {
          บริการ: element.flowName,
          สถานะ: element.RECORD_STATUS === 'N' ? 'ยังไม่ปิดงาน' : 'ปิดงานแล้ว',
          ขั้นตอนปัจจุบัน: element.stepTitle || '',
          ที่อยู่: element.address || '',
          พนักงานที่รับผิดชอบ: element.empFull_NameTH,
          วันที่นัดหมาย: moment(element.dueDate).format('YYYY-MM-DD'),
          เวลา: element.timeText
        }
        for (let a = 0; a < jobData.length; a++) {
          const dt = jobData[a]
          if (dt.jobNo === element.jobNo) {
            obj[dt.fieldName] = dt.fieldValue
          }
        }
        dataExport.push(obj)
        console.log(dataExport)
      }
      await this.Send_XLSX(dataExport)
      this.loading = false
    },
    Send_XLSX (data) {
      var info = XLSX.utils.json_to_sheet(data)
      var wb = XLSX.utils.book_new() // make Workbook of Excel
      XLSX.utils.book_append_sheet(wb, info, 'worksheet1') // sheetAName is name of Worksheet
      XLSX.writeFile(wb, 'file.xls') // name of the file is 'book.xlsx'
    },
    async getExportJob () {
      let month = moment(this.focus).format('YYYY-MM')
      let job = []
      try {
        await axios
          .get(this.DNS_IP + '/job/get-reportJob?shopId=' + this.shopId + '&dueDate=' + month)
          .then(async (response) => {
            let rs = response.data
            if (rs.status === false) {
              job = []
            } else {
              job = rs
              console.log('job', job)
            }
          })
        return job
      } catch (error) {
        console.log('getJob-error', error)
        return job
      }
    },
    async getExportJobData () {
      let month = moment(this.focus).format('YYYY-MM')
      let jobData = []
      try {
        await axios
          .get(this.DNS_IP + '/job/get-reportJobData?shopId=' + this.shopId + '&dueDate=' + month)
          .then(async (response) => {
            let rs = response.data
            if (rs.status === false) {
              jobData = []
            } else {
              jobData = rs
              console.log('jobData', jobData)
            }
          })
        return jobData
      } catch (error) {
        console.log('getJob-error', error)
        return jobData
      }
    },
    clickMore (data) {
      this.type = 'day'
      this.focus = data
    },
    changeData (data) {
      // console.log('data!!!!', data)
      this.focus = data
    },
    filterEmp (item, key) {
      this.categories.sort((a, b) => {
        return this.categoriesCheckBox.indexOf(a) - this.categoriesCheckBox.indexOf(b)
      })
      // console.log('-------', item, ' - ', key)
    },
    customIntervalFormat (interval) {
      // จัดรูปแบบเวลาให้อยู่ในรูปแบบ HH:mm โดยไม่ใช้ AM/PM
      // console.log(interval)
      return interval.time
    },
    getEventColor (event) {
      return event.color
    },
    async updateSelect () {
      // console.log('type', this.type)
      let dt = []
      for (let index = 0; index < this.eventsMaster.length; index++) {
        const element = this.eventsMaster[index]
        if (this.type === 'day' || this.type === 'category') {
          // console.log('if1')
          if (moment(element.start).format('YYYY-MM-DD') === this.focus) {
            if (this.categories.includes(element.category)) {
              dt.push(element)
            }
          }
        } else {
          // console.log('else1')
          if (this.categories.includes(element.category)) {
            dt.push(element)
          }
        }
      }
      // this.events = this.eventsMaster.filter(item => this.categories.includes(item.category))
      this.events = dt
      // console.log(this.events)
    },
    setToday () {
      this.focus = moment().format('YYYY-MM-DD')
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent (refID) {
      let dt = this.dataJob.filter((item) => item.bookNo === refID)
      console.log(dt)
    },
    async getJobData () {
      this.dataJob = []
      // let params = null
      let month = moment(this.focus).format('YYYY-MM')
      let params = this.DNS_IP + '/job/get-JobCalendarGrid?shopId=' + this.shopId + '&checkOnsite=True' + '&dueDate=' + month
      await axios
        .get(params)
        .then(async (response) => {
          let rs = response.data
          if (rs.status === false) {
            this.dataJob = []
          } else {
            this.dataJob = rs
            console.log('this.dataJob', this.dataJob)
          }
        })
    },
    async getJobDataShow (bookNo) {
      let jobData = []
      let params = this.DNS_IP + '/job/get-JobDataCalendarGrid?bookNo=' + bookNo
      await axios
        .get(params)
        .then(async (response) => {
          let rs = response.data
          if (rs.status === false) {
            jobData = []
          } else {
            jobData = rs
            console.log('jobData', jobData)
          }
        })
      return jobData
    },
    async getFlow () {
      await axios
        .get(this.DNS_IP + `/flow/get?shopId=${this.shopId}`)
        .then(async (response) => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              // console.log('d', d)
              if (d.checkOnsite === 'True') {
                let s = {}
                s.value = d.flowId
                s.text = d.flowName
                this.flowName.push(s)
                this.names.push(d.flowName)
              }
            }
            console.log('flowName', this.flowName)
            // console.log('this.$refs.calendar', this.$refs.calendar)
            // await this.$refs.calendar.checkChange()
          } else {
            // กรณีไม่มีข้อมูล
            console.log('No data returned from the server.')
          }
        })
        .catch(error => {
          // ดัก error และทำอะไรกับ error นั้น
          console.error('Error fetching data:', error)
        })
      // console.log('this.categories', this.categories)
    },
    async getEmpOnsite () {
      let param = this.DNS_IP + `/empSelect/get?shopId=${this.shopId}`
      if (this.session.data.USER_ROLE === 'onsite') {
        param = this.DNS_IP + `/empSelect/get?shopId=${this.shopId}&empId=${this.session.data.empId}`
      }
      await axios
        .get(param)
        .then(async (response) => {
          let rs = response.data
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (d.USER_ROLE === 'onsite') {
                console.log('empId', d)
                d.value = d.empId
                d.text = d.empFull_NameTH
                this.categoriesItem.push(d)
                this.categories.push(d.empFull_NameTH)
                this.categoriesCheckBox.push(d.empFull_NameTH)
                let dayOff = {
                  'empName': d.empFull_NameTH,
                  'typeDayCustom': d.typeDayCustom,
                  'dateDayCustom': JSON.parse(d.dateDayCustom) || [],
                  'dateDayoffValue': JSON.parse(d.dateDayoffValue) || []
                }
                this.empDayoff.push(dayOff)
              }
            }
            // console.log('this.empDayoff', this.empDayoff)
            // await this.$refs.calendar.checkChange()
          } else {
            // กรณีไม่มีข้อมูล
            console.warn('No data returned from the server.')
          }
        })
        .catch(error => {
          // ดัก error และทำอะไรกับ error นั้น
          console.error('Error fetching data:', error)
        })
      console.log('this.categories', this.categories)
    },
    async getEventEmp () {
      this.eventsItem = []
      // console.log('getEventEmp', this.DNS_IP)
      let month = moment(this.focus).format('YYYY-MM')
      console.log('month', month)
      let param = this.DNS_IP + `/CalendarGridTime/get?shopId=${this.shopId}&start=${month}&type=onsite`
      if (this.session.data.USER_ROLE === 'onsite') {
        param = this.DNS_IP + `/CalendarGridTime/get?shopId=${this.shopId}&start=${month}&empId=${this.session.data.empId}&type=onsite`
      }
      await axios
        .get(param)
        .then(async (response) => {
          let rs = response.data
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              this.eventsItem.push(d)
            }
            console.log('this.eventsItm', this.eventsItem)
            // console.log('this.$refs.calendar', this.$refs.calendar)
            // await this.$refs.calendar.checkChange()
          } else {
            // กรณีไม่มีข้อมูล
            // console.warn('No data returned from the server.')
          }
        })
        .catch(error => {
          // ดัก error และทำอะไรกับ error นั้น
          console.error('Error fetching data:', error)
        })
      // console.log('this.categories', this.categories)
    },
    async setEvent () {
      try {
        await this.getEventEmp()
        await this.getJobData()
        // console.log('----', this.eventsItem)
        const events = []
        this.eventsMaster = []
        // let TT = []
        for (let i = 0; i < this.eventsItem.length; i++) {
          let element = this.eventsItem[i]
          // console.log('DATE', element.start)
          // console.log('DATEMONENT', moment(element.start, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'))
          // console.log('newDATE', new Date(moment(element.start, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')))
          // console.log('------', startDate, startTime)
          if (this.flowName.filter((item) => item.value === element.flowId).length && this.categoriesItem.filter((item) => item.value === element.empId).length > 0) {
            let start = new Date(moment(element.start, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'))
            let end = new Date(moment(element.end, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'))
            let findIndex = this.flowName.findIndex((item) => item.value === element.flowId)
            let flowName = this.flowName.filter((item) => item.value === element.flowId)[0].text
            let jobdata = this.dataJob.filter((item) => item.bookNo === element.refID) || []
            // console.log('moment', moment())
            // console.log('start', start, ' - ', end)
            events.push({
              name: flowName,
              start: start,
              end: end,
              color: this.colors[findIndex],
              timed: true,
              category: this.categoriesItem.filter((item) => item.value === element.empId)[0].text,
              item: jobdata,
              status: jobdata.RECORD_STATUS === 'N' ? 'ยังไม่ปิดงาน' : 'ปิดงานแล้ว',
              startTime: moment(element.start, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').tz('Asia/Bangkok').format('HH:mm'),
              endTime: moment(element.end, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').tz('Asia/Bangkok').format('HH:mm')
            })
            this.eventsMaster.push({
              name: flowName,
              start: start,
              end: end,
              color: this.colors[findIndex],
              timed: true,
              category: this.categoriesItem.filter((item) => item.value === element.empId)[0].text,
              item: jobdata,
              status: (jobdata.length > 0 && jobdata[0].RECORD_STATUS === 'N') ? 'ยังไม่ปิดงาน' : 'ปิดงานแล้ว',
              startTime: moment(element.start, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').tz('Asia/Bangkok').format('HH:mm'),
              endTime: moment(element.end, 'ddd, DD MMM YYYY HH:mm:ss [GMT]').tz('Asia/Bangkok').format('HH:mm')
            })
          }
        }
        // console.log('events', events)
        this.events = events
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
.MainMobile {
  min-height: 750px;
}
.Main {
  min-height: 650px;
  display: flex;
  border-style: solid;
  border-width: 1px;
  border-color: #e0e0e0;
}
.menuleft {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 750px;
}
.menuright {
  flex-grow: 1;
  overflow: scroll;
}
/* .v-calendar-daily_head-weekday {
  display: none !important;
}
.v-calendar-daily_head-day-label {
  display: none !important;
} */
.categoriesProfile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative; /* ต้องกำหนด position เป็น relative หรือ absolute */
    top: -40px;
}
.intervalOff {
  border-top: 1px solid #9e9e9e;
  border-right: 1px solid #9e9e9e;
  border-left: 1px solid #9e9e9e;
  background: linear-gradient(45deg, #d1d1d1 37.50%, #e6e6e6 37.50%, #e6e6e6 50%, #d1d1d1 50%, #d1d1d1 87.50%, #e6e6e6 87.50%, #e6e6e6 100%);
  background-size: 10px 10px;height: 100%;
}
/* width */
::-webkit-scrollbar {
  width: 0px;
  height: 0px
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #e0e0e0;
}

.radio-switch-input {
  display: flex;
}

.radio-switch-label {
  display: block;
  width: 90px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #33333300;
  cursor: pointer;
}

.radio-switch-label[for="radio-switch-All"] {
  background-color: #007bff ;
  color: #fff;
  width: 90px;
  height: 40px;
  display: flex;
  padding: 10px;
  place-content: center;
  align-items: center;
  border-radius: 10px 0px 0px 10px;
  /* text-shadow: rgb(255, 255, 255) 1px 1px 5px; */
  font-weight: bold;
}

.radio-switch-label[for="radio-switch-low"] {
  background-color: #007bff ;
  color: #fff;
  width: 90px;
  height: 40px;
  padding: 10px;
  display: flex;
  place-content: center;
  align-items: center;
  /* text-shadow: rgb(255, 255, 255) 1px 1px 5px; */
  font-weight: bold;
}
.radio-switch-label[for="radio-switch-low"],
.radio-switch-label[for="radio-switch-All"] {
  background-color: #dbaee100;
}
.radio-switch {
  display: flex;
  margin-top: 15px;
  align-items: stretch;
  padding-bottom: 40px;
  height: 40px;
  background-color: rgb(240 240 240);
  border-radius: 30px;
  /* filter: drop-shadow(2px 4px 6px #ddd); */
}
</style>
