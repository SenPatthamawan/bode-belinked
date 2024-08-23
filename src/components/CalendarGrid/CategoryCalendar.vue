<template>
    <div>
      <div class="pa-3 ma-0" style="display: flex;justify-content: center;">
        <v-btn-toggle
          rounded
          color="#000000"
        >
        <v-btn
            outlined
            @click="prev"
          >
            <v-icon>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            outlined
            @click="setToday"
          >
            Today
          </v-btn>
          <!-- <v-btn
            outlined
          >
          <p class="ma-0" style="color: black;">{{ momentTitle(focus)}}</p>
          </v-btn> -->
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="auto"
            bottom
            left
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  outlined
                  v-bind="attrs"
                  v-on="on"
                >
                <p class="ma-0" style="color: black;">{{ momentTitle(focus)}}</p>
                </v-btn>
              </template>
              <v-date-picker
              v-model="value"
              no-title
              @input="menu = false"
              >
              </v-date-picker>
          </v-menu>
          <v-btn
            outlined
            @click="next"
          >
            <v-icon>
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
      <v-sheet height="690" style="width: 100%;">
        <!-- {{ focus }}
        {{ categories }}
        {{ names }} -->
        <v-calendar
        v-if="categories.length > 0"
        ref="calendar"
        v-model="focus"
        color="primary"
        type="category"
        category-show-all
        first-interval="6"
        :interval-count="24-6"
        :interval-format="customIntervalFormat"
        short-intervals
        :categories="categories"
        :events="events"
        :event-color="getEventColor"
        locale="th-TH"
        :event-timed="isTimedEvent"
        @click:event="clickEvent"
        @change="getEvents"
        >
        <template #event="{ event }">
        <!-- <div v-if="event.item.length > 0" style="height: 100%;" class="pa-1 pl-3">
          <div class="ma-0 pa-0 font-weight-black" style="display:flex;justify-content:space-between;">
              <p class="ma-0">{{ event.item[0].flowName}}</p>
          </div>
          <p class="mb-1"><v-icon small color="#FFFFFF">mdi-map-marker-outline</v-icon> {{ event.item[0].address }}</p>
        </div>
        <div v-else>
          {{ event }}
        </div> -->
        <div v-if="event.item.length > 0 && event.status === 'ยังไม่ปิดงาน'" class="eventIF">
                <div class="ma-0 pa-0 font-weight-black" style="display:flex;justify-content:space-between;">
                    <p class="ma-0">{{ event.item[0].flowName}}</p>
                </div>
                <p class="mb-1"><v-icon small color="#FFFFFF">mdi-map-marker-outline</v-icon> {{ event.item[0].address }}</p>
        </div>
        <div v-else class="eventElse">
          <div class="ma-0 pa-0 font-weight-black" style="display:flex;justify-content:space-between;">
            <p class="ma-0">{{ event.name}}</p>
          </div>
          <p class="mb-1"> {{ event.status }}</p>
        </div>
        </template>
        <template #interval="{ date, category}">
        <!-- Custom content for the interval -->
        <div class="intervalOff" v-if="setDayOff(category, date)">
        <!-- Render additional content here -->
        </div>
        <!-- <div v-else class="intervalOn"></div> -->
        </template>
        <!-- <template v-slot:day-label-header="{}">-</template> -->
        <!-- ปรับแต่งการแสดงของแต่ละ category -->
        <template #category="{ category }" >
        <!-- นำรูปภาพมาแสดง -->
        <!-- <img v-if="category.image" :src="category.image" alt="Category Image" /> -->
        <!-- <v-sheet class="categoriesProfile pa-4"> -->
        <v-sheet class="d-flex flex-column justify-content-center  align-items-center m-2">
        <!-- {{ categoriesItem.filter((item) => item.text === category)[0].empImge }} -->
        <v-avatar
        class="mb-3"
        v-if="categoriesItem.filter((item) => item.text === category)[0].empImge"
        style="border-width: 4px;border-color: #1c437c;border-style: solid;"
        size="90"
        >
        <img
            :src="categoriesItem.filter((item) => item.text === category)[0].empImge"
            :alt="category"
        >
        </v-avatar>
        <v-avatar
        class="mb-3"
        v-else
        color="indigo"
            size="90"
        >
            <v-icon dark  x-large>
            mdi-account-circle
            </v-icon>
        </v-avatar>
        <p>{{ category }}</p>
        </v-sheet>
        <!-- หรือสามารถใส่ HTML ตามที่ต้องการ -->
        <!-- <div v-else>{{ category.name }}</div> -->
        </template>
        </v-calendar>
      </v-sheet>
    </div>
</template>

<script>
import moment from 'moment' // แปลง date
export default {
  props: {
    events: {
      type: Array,
      default: () => []
    },
    focus: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: () => 'month'
    },
    weekday: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Array,
      default: () => []
    },
    names: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    empDayoff: {
      type: Array,
      default: () => []
    },
    categoriesItem: {
      type: Array,
      default: () => []
    },
    flowName: {
      type: Array,
      default: () => []
    },
    typeColor: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      menu: false,
      value: ''
    //   type: 'month',
    //   types: ['month', 'week', 'day', '4day'],
    //   mode: 'stack',
    //   modes: ['stack', 'column'],
    //   weekday: [0, 1, 2, 3, 4, 5, 6],
    //   weekdays: [
    //     { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
    //     { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
    //     { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
    //     { text: 'Mon, Wed, Fri', value: [1, 3, 5] }
    //   ],
    //   value: '',
    //   colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    //   names: ['ล้างรถยนต์นอกสถานที่', 'Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']
    }
  },
  watch: {
    focus (newQuestion, oldQuestion) {
      console.log('forcus-----', newQuestion)
      if (newQuestion !== oldQuestion) {
        this.value = newQuestion
      }
    },
    value (newQuestion, oldQuestion) {
      this.sendDataToParent(newQuestion)
    }
  },
  methods: {
    clickEvent (event) {
      // console.log('event!!!!"', event)
      this.$emit('showEvent', event.event)
    },
    getEventColor (event) {
      if (this.typeColor === 'Flow') {
        let key = this.flowName.findIndex((item) => item.text === event.name)
        let color = this.colors[key]
        return color
      } else {
        let key = this.categoriesItem.findIndex((item) => item.empFull_NameTH === event.category)
        let color = this.colors[key]
        return color
      }
    },
    setToday () {
      this.value = moment().format('YYYY-MM-DD')
    },
    sendDataToParent (newQuestion) {
      // ส่งข้อมูลไปยังคอมโพเนนต์แม่ ผ่านการส่งเหตุการณ์ (event) ชื่อว่า 'send-data'
      this.$emit('send-data', newQuestion)
    },
    prev () {
      this.value = moment(this.focus).subtract(1, 'days').format('YYYY-MM-DD')
    },
    next () {
      this.value = moment(this.focus).add(1, 'days').format('YYYY-MM-DD')
    },
    momentTitle (focus) {
      return moment(focus).format('ddd, MMM D, YYYY')
    },
    isTimedEvent (event) {
      // console.log('event!!!!!"', event)
      // event.end = '2024-02-05'
      return event
    },
    customIntervalFormat (interval) {
      // จัดรูปแบบเวลาให้อยู่ในรูปแบบ HH:mm โดยไม่ใช้ AM/PM
      // console.log(interval)
      return interval.time
    },
    setDayOff (category, date) {
      let empDayoffItem = this.empDayoff.filter((item) => item.empName === category)[0]
      if (empDayoffItem.typeDayCustom === 'off') {
        let dayCustomStatus = empDayoffItem.dateDayCustom.filter((item) => item === date)
        let newDate = new Date(date)
        let day = newDate.getDay()
        let dayValueStatus = empDayoffItem.dateDayoffValue.filter((item) => item === day)
        // console.log('status', dayCustomStatus, typeof day)
        // console.log('IF')
        if (dayCustomStatus.length > 0 || dayValueStatus.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        // console.log('ELSE')
        let dayCustomStatus = empDayoffItem.dateDayCustom.filter((item) => item === date)
        if (dayCustomStatus.length > 0) {
          return false
        } else {
          return true
        }
      }
      // console.log('category', category, date)
      // console.log('this.categoriesItem', this.categoriesItem)
      // return true
    },
    getEvents () {
      console.log('@@@@@@@@@', this.events)
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    }
  }
}
</script>
<style>
.v-calendar-category .v-calendar-category__columns .v-calendar-category__column-header {
    min-width: 300px;
}
.v-calendar-category .v-calendar-daily__day {
    min-width: 300px;
}
.categoriesProfile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.intervalOff {
  border-top: 1px solid #9e9e9e;
  border-right: 1px solid #9e9e9e;
  border-left: 1px solid #9e9e9e;
  background: linear-gradient(45deg, #d1d1d1 37.50%, #e6e6e6 37.50%, #e6e6e6 50%, #d1d1d1 50%, #d1d1d1 87.50%, #e6e6e6 87.50%, #e6e6e6 100%);
  background-size: 10px 10px;height: 100%;
}
.eventIF {
    padding-left: 0.5vw;
    height: 100%;
}
.eventElse {
    padding-left: 0.5vw;
    height: 100%;
}
</style>
