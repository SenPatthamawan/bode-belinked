<template lang="">
  <v-card>
    <Chart :chart-data="chartData" />
  </v-card>
</template>
<script>
import adminLeftMenu from '../Sidebar.vue' // เมนู
import Chart from './Line'
import axios from 'axios'
export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    Chart
  },
  data () {
    return {
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      chartData: null,
      dataitem: [],
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
      ]
    }
  },
  async mounted () {
  },
  methods: {
    async getBranchSelect (masBranchName, dateRange) {
      this.dataitem = []
      this.chartData = null
      console.log('chart', this.chartData)
      let startDate = this.momenDate_1(dateRange.startDate)
      let endDate = this.momenDate_1(dateRange.endDate)
      // console.log('masBranchName', masBranchName)
      await axios.get(this.DNS_IP + '/job_log/getDashbord_total?startDate=' + startDate + '&endDate=' + endDate + '&shopId=' + this.shopId).then(response => {
        let rs = response.data
        // console.log('rs', rs)
        if (rs.length > 0) {
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.masBranchName === masBranchName) {
              this.dataitem.push(d)
            }
          }
          // console.log('this.dataitem', this.dataitem)
          // console.log('this.dataitem', this.dataitem)
        }
        this.getChart()
        // console.log('this.statusitem', this.statusitem)
      })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async getChart () {
      let datasetsitem = []
      console.log('itethis.dataitemm', this.dataitem)
      if (this.dataitem.length > 0) {
        let s = {}
        s.label = this.dataitem[0].masBranchName
        s.data = this.dataitem.map(item => { return item.totalJob })
        s.fill = false
        s.borderColor = 'rgb(251, 133, 0)'
        s.tension = 0.1
        datasetsitem.push(s)
        const labels = this.dataitem.map(item => { return item.CREATE_DATE })
        this.chartData = {
          labels: labels,
          datasets: datasetsitem
        }
        console.log('if')
      } else {
        this.chartData = {
          labels: '',
          datasets: []
        }
        console.log('else')
      }
      // [1, 2, 3, 4, 5]
    }
  }
}
</script>
<style lang="">

</style>
