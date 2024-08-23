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
      labels: [],
      data: [],
      Branchitems: [],
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
    async getBranchLine (dateRange) {
      let startDate = this.momenDate_1(dateRange.startDate)
      let endDate = this.momenDate_1(dateRange.endDate)
      this.data = []
      this.labels = []
      this.dataitem = []
      await this.getMasbranch()
      await axios.get(this.DNS_IP + '/job_log/getDashbord_total?startDate=' + startDate + '&endDate=' + endDate + '&shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            this.dataitem.push(d)
          }
          // console.log('this.dataitem', this.dataitem)
        }
        // console.log('this.statusitem', this.statusitem)
      })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
      await this.getChart()
    },
    async getMasbranch () {
      this.Branchitems = []
      await axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        for (let i = 0; i < rs.length; i++) {
          let d = rs[i]
          this.Branchitems.push(d.masBranchName)
        }
        // console.log('this.Branchitems', this.Branchitems)
      })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async getChart () {
      let item = []
      let datasetsitem = []
      for (let i = 0; i < this.Branchitems.length; i++) {
        let d = this.Branchitems[i]
        item.push(this.dataitem.filter(row => row.masBranchName === d))
      }
      // console.log('item', item)
      for (let a = 0; a < item.length; a++) {
        let d = item[a]
        let s = {}
        s.label = this.Branchitems[a]
        s.data = d.map(item => { return item.totalJob })
        s.fill = false
        s.borderColor = this.codeColor[a]
        s.tension = 0.1
        // console.log('s', s)
        datasetsitem.push(s)
      }
      const dupArr = this.dataitem.map(row => { return row.CREATE_DATE })
      const labels = Array.from(new Set(dupArr))
      this.chartData = {
        labels: labels,
        datasets: datasetsitem
      }
      // [1, 2, 3, 4, 5]
    }
  }
}
</script>
<style lang="">

</style>
