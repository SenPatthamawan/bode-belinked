<template>
  <v-card  title="Line" >
    <v-container >
      <v-row >
        <v-col cols="6">
          <p>Select Flow</p>
          <v-select
            :items="DataFlowName"
            v-model="fromInsert.flowId"
            required
            dense
            outlined
            @change=" getTimeinJobLog()"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <div v-show="fromInsert.flowId !== ''">
            <v-radio-group v-model="select_M_or_Y" row>
            <v-radio label="Month" value="Month"></v-radio>
            <v-radio label="Year" value="Year"></v-radio>
          </v-radio-group>
          </div>
          <div v-if="select_M_or_Y == 'Month'">
            <v-menu
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="picker"
                  label="Picker in menu"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="picker"
                @input="menu2 = false"
                type="month"
                @change="xofMonth(picker)"
                this.picker="picker"
              ></v-date-picker>
            </v-menu>
          </div>
          <div v-if="select_M_or_Y == 'Year'">
            <v-select
              v-model="pickeryear"
              :items="years"
              menu-props="auto"
              hide-details
              label="Select Year"
              single-line
              @change="xofYear(pickeryear)"
            ></v-select>
          </div>
        </v-col>
        <v-col cols="12">
          <div v-show="select_M_or_Y == 'Month'">
            <v-card img-bottom>
            <ChartBarBase :chart-data="chartDataofMonth" />
          </v-card>
          </div>
          <div v-show="select_M_or_Y == 'Year'">
            <v-card img-bottom>
            <ChartBarBase :chart-data="chartDataofYear" />
          </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import axios from 'axios' // api
import ChartBarBase from './Line'

export default {
  components: {
    ChartBarBase
  },
  data () {
    return {
      itemChart: [],
      years: ([...Array(new Date().getFullYear() - 1989).keys()].map((e) => e + 1990)).reverse(),
      picker: null,
      pickeryear: null,
      shopId: this.$session.getAll().data.shopId,
      select_M_or_Y: null,
      chartDataofMonth: null,
      chartDataofYear: null,
      DataFlowName: [],
      fromInsert: {
        flowId: ''
      }
    }
  },
  mounted () {
    this.getDataFlow()
    // this.filldata()
  },
  methods: {
    async xofYear (pickeryear) {
      console.log(pickeryear)
      this.dataYear = []
      const year = pickeryear
      const months = {
        Monthname: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        Montnumber: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      }
      for (let i = 0; i < months.Montnumber.length; i++) {
        var data = {}
        data.fullYear = year + '-' + months.Montnumber[i]
        data.month = months.Monthname[i]
        data.step = this.itemChart.map((item) => {
          return {
            stepId: item.stepId,
            timesum: 0
          }
        })
        this.dataYear.push(data)
      }
      console.log('data', this.dataYear)
      await this.filldataofYear(pickeryear)
    },
    async xofMonth (picker) {
      console.log(picker)
      this.dataMonth = []
      const year = picker.split('-')[0]
      const month = picker.split('-')[1]
      var a = this.daysInMonth(month, year)
      for (var i = 0; i < a; i++) {
        var data = {}
        data.date = (i + 101).toString().substr(1, 2) + '-' + month + '-' + year
        data.day = (i + 101).toString().substr(1, 2)
        data.step = this.itemChart.map((item) => {
          return {
            stepId: item.stepId,
            timesum: 0
          }
        })
        // data.coin = 0
        this.dataMonth.push(data)
      }
      await this.filldataofMonth(picker)
    },
    daysInMonth (month, year) {
      return new Date(year, month, 0).getDate()
    },
    async getstepofYear (pickeryear) {
      let dt = pickeryear
      for (let i = 0; i < this.itemChart.length; i++) {
        let d = this.itemChart[i]
        await axios.get(this.DNS_IP + '/job_log/getofYear?year=' + dt + '&stepId=' + d.stepId)
          .then(response => {
            for (let y = 0; y < response.data.length; y++) {
              let r = response.data[y]
              console.log('r', r)
              let timedata = r.timeAvg
              let inyear = r.yearmonth
              let date = inyear.toString().substr(0, 4) + '-' + inyear.toString().substr(4, 2)
              console.log('date', date)
              let dataCheck = this.dataYear.findIndex(obj => obj.fullYear === date)
              this.dataYear[dataCheck].step[i].timesum = timedata
            }
          }).catch(error => console.log(error))
      }
    },
    async getstepofMonth (picker) {
      let date = picker.split('-')
      let year = date[0]
      let month = date[1]
      for (let i = 0; i < this.itemChart.length; i++) {
        let d = this.itemChart[i]
        await axios.get(this.DNS_IP + '/job_log/getofMonth?stepId=' + d.stepId + '&year=' + year + '&month=' + month)
          .then(response => {
            for (let y = 0; y < response.data.length; y++) {
              let r = response.data[y]
              let timedata = r.timeAvg
              let date = this.momenDate_1(r.dateday).split('-').reverse().join('-')
              let dataCheck = this.dataMonth.findIndex(obj => obj.date === date)
              this.dataMonth[dataCheck].step[i].timesum = timedata
            }
          }).catch(error => console.log(error))
      }
    },
    getDataFlow () {
      this.DataFlowName = []
      console.log('DataFlowName', this.DataFlowName)
      axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            d.text = d.flowName
            d.value = d.flowId
            this.DataFlowName.push(d)
          }
        } else {
          this.DataFlowName = []
        }
      })
    },
    async getTimeinJobLog () {
      this.clearData()
      await axios
        .get(
          this.DNS_IP + '/job_log/getStep?flowId=' + this.fromInsert.flowId
        )
        .then(response => {
          let rs = response.data
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {
              stepName: d.stepTitle,
              stepId: d.stepId
            }
            this.itemChart.push(s)
          }
          console.log('itemChart', this.itemChart)
        })
        .catch(error => console.log(error))
    },
    async filldataofYear () {
      await this.getstepofYear(this.pickeryear)
      let obj = []
      let Color = []
      for (let i = 0; i < this.itemChart.length; i++) {
        var d = this.itemChart[i]
        var s = this.stringToColour(d.stepName)
        Color.push(s)
      }
      for (let i = 0; i < this.dataYear[0].step.length; i++) {
        let dataSet = {
          borderColor: Color[i],
          data: this.dataYear.map(item => item.step[i].timesum),
          label: this.itemChart[i].stepName,
          fill: false,
          tension: 0.5
        }
        obj.push(dataSet)
      }
      console.log('year', this.dataYear)
      this.chartDataofYear = {
        labels: this.dataYear.map(item => {
          return item.month
        }),
        datasets: obj
      }
    },
    async filldataofMonth () {
      await this.getstepofMonth(this.picker)
      let obj = []
      let Color = []
      for (let i = 0; i < this.itemChart.length; i++) {
        var d = this.itemChart[i]
        var s = this.stringToColour(d.stepName)
        Color.push(s)
      }
      for (let i = 0; i < this.dataMonth[0].step.length; i++) {
        let dataSet = {
          borderColor: Color[i],
          data: this.dataMonth.map(item => item.step[i].timesum),
          label: this.itemChart[i].stepName,
          fill: false,
          tension: 0.5
        }
        obj.push(dataSet)
      }
      this.chartDataofMonth = {
        labels: this.dataMonth.map(item => {
          return item.day
        }),
        datasets: obj
      }
    },
    async clearData () {
      this.pickeryear = ''
      this.picker = ''
      this.dataMonth = []
      this.chartDataofMonth = {
        labels: [],
        datasets: []
      }
      this.chartDataofYear = {
        labels: [],
        datasets: []
      }
      this.itemChart = []
      this.stepName = []
      this.timediff = []
      this.hours = []
      this.mins = []
    },
    stringToColour (str) {
      var hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      var colour = '#'
      for (let i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF
        colour += ('00' + value.toString(16)).substr(-2)
      }
      return colour
    }
  }
}
</script>
<style scope>
/* .main{
} */

</style>
