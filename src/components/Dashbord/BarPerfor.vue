<template>
  <v-card title="Bar">
    <v-container>
      <v-row>
        <v-col cols="12">
          <p>Select Flow</p>
          <v-select
            :items="DataFlowName"
            v-model="fromInsert.flowId"
            required
            dense
            outlined
            @change="getTimeinJobLog()"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-card img-bottom >
            <ChartBarBase :chart-data="chartData" />
          </v-card>
        </v-col>
      </v-row>
      </v-container>
  </v-card>
</template>

<script>
import axios from 'axios' // api
import ChartBarBase from './Bar'

export default {
  components: {
    ChartBarBase
  },
  data () {
    return {
      chartData: null,
      DataFlowName: [],
      fromInsert: {
        flowId: ''
      },
      stepName: [],
      timeavg: [],
      timesum: []
    }
  },
  mounted () {
    this.getDataFlow()
  },
  methods: {
    getDataFlow () {
      this.DataFlowName = []
      console.log('DataFlowName', this.DataFlowName)
      axios.get(this.DNS_IP + '/flow/get').then(response => {
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
        // console.log(this.DataFlowName)
      })
    },
    async getTimeinJobLog () {
      this.clearData()
      await axios.get(this.DNS_IP + '/job_log/getAvgSum?flowId=' + this.fromInsert.flowId).then(response => {
        let rs = response.data
        rs.map((item) => this.stepName.push(item.stepTitle))
        rs.map((item) => this.timeavg.push(item.timeavg))
        rs.map((item) => this.timesum.push(item.timesum))
        console.log('stepId', this.stepName)
        this.filldata()
      }).catch((error) => console.log(error))
    },
    filldata () {
      this.chartData = {
        labels: this.stepName,
        datasets: [
          {
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: '#0c0306',
            data: this.timeavg,
            label: 'เวลาเฉลี่ย',
            yAxisID: 'A'
          },
          {
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: '#0c0306',
            data: this.timesum,
            label: 'เวลารวม',
            yAxisID: 'B'
          }
        ]
      }
    },
    async clearData () {
      this.chartData = {
        labels: [],
        datasets: []
      }
      this.stepName = []
      this.timeavg = []
      this.timesum = []
    }
  }
}
</script>
<style scope>
/* .main{
  min-height: 800px;
  max-height: 800px;
} */

</style>
