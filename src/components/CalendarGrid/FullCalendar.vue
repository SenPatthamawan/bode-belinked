<template>
    <div>
      <v-sheet
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
        <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      </v-sheet>
      <v-sheet height="670" style="overflow-x: hidden;">
        <v-calendar
          ref="calendar"
          v-model="value"
          :weekdays="weekday"
          :type="type"
          :events="events"
          :event-overlap-mode="mode"
          :event-overlap-threshold="30"
          :event-color="getEventColor"
          @click:more="Test"
          first-interval="6"
          :interval-count="24-6"
          :interval-format="customIntervalFormat"
          locale="th-TH"
          short-intervals
          @click:event="clickEvent"
          @change="getEvents"
        >
        <template #event="{ event }">
            <!-- {{ event }} -->
        <div v-if="type === 'month'">
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
        </div>
        <div v-if="type === 'week'">
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
        </div>
        <div v-if="type === 'day'">
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
                <p class="mb-1"> {{ event.status}}</p>
            </div>
        </div>
        <div v-if="type === '4day'">
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
        </div>
        </template>
        </v-calendar>
      </v-sheet>
    </div>
</template>

<script>
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
    categoriesCheckBox: {
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
  watch: {
    // whenever question changes, this function will run
    focus (newQuestion, oldQuestion) {
      if (newQuestion !== oldQuestion) {
        this.value = newQuestion
      }
    },
    value (newQuestion, oldQuestion) {
      this.sendDataToParent(newQuestion)
    }
  },
  data () {
    return {
    //   type: 'month',
      types: ['month', 'week', 'day', '4day'],
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] }
      ],
      value: this.focus
    //   colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    //   names: ['ล้างรถยนต์นอกสถานที่', 'Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']
    }
  },
  methods: {
    Test (event) {
      this.$emit('more', event.date)
    },
    clickEvent (event) {
      // console.log('event!!!!"', event)
      this.$emit('showEvent', event.event)
    },
    sendDataToParent (newQuestion) {
      // ส่งข้อมูลไปยังคอมโพเนนต์แม่ ผ่านการส่งเหตุการณ์ (event) ชื่อว่า 'send-data'
      this.$emit('send-data', newQuestion)
    },
    customIntervalFormat (interval) {
      // จัดรูปแบบเวลาให้อยู่ในรูปแบบ HH:mm โดยไม่ใช้ AM/PM
      // console.log(interval)
      return interval.time
    },
    getEvents () {
      // console.log('!!!!!!!!', this.events)
    },
    getEventColor (event) {
      if (this.typeColor === 'Flow') {
        let key = this.flowName.findIndex((item) => item.text === event.name)
        let color = this.colors[key]
        return color
      } else {
        let data = this.categories.filter((a) => a === event.category).length > 0 ? this.categories.filter((a) => a === event.category)[0] : []
        if (this.categoriesCheckBox.filter((a) => a === data).length > 0) {
          let key = this.categoriesCheckBox.findIndex((item) => item === event.category)
          let color = this.colors[key]
          // console.log('color', color)
          return color
        } else {
          // console.log('ELSE')
        }
      }
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    }
  }
}
</script>
<style scoped>
.v-calendar-daily_head-weekday {
  display: none !important;
}
.eventIF {
    padding-left: 0.5vw;
    height: 100%;
    width: 100%;
}
.eventElse {
    padding-left: 0.5vw;
    height: 100%;
    width: 100%;
}
</style>
