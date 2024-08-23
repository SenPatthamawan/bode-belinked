<template lang="">
    <div >
      <v-card class="p-3" v-if="BookingflowName">
        <h3 class="text-center">ประเภทการนัดหมายเข้ารับบริการ</h3>
        <C3Chart :chartData="BookingflowName"></C3Chart>
      </v-card>
    </div>
</template>
<script>
import adminLeftMenu from '../Sidebar.vue' // เมนู
import axios from 'axios'
import C3Chart from './C3Chart.vue'
export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    C3Chart

  },
  computed: {
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '12'
        case 'sm': return '12'
        case 'md': return '6'
        case 'lg': return '4'
        case 'xl': return '4'
      }
      console.log('this.$vuetify.breakpoint.name', this.$vuetify.breakpoint.name)
    }
  },
  data () {
    return {
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      startDate: '',
      endDate: '',
      BookingflowName: null,
      codeColor: [
        '#0099FF',
        '#F898A4',
        '#CC0066',
        '#CCFF00',
        'rgb(33, 158, 188)',
        'rgb(2, 48, 71)',
        'rgb(255, 183, 3)',
        'rgb(61,90,128)',
        'rgb(152,193,217)',
        'rgb(28,251,252)',
        'rgb(255,212,91)',
        'rgb(238,108,77)',
        'rgb(41,50,65)'
      ]
    }
  },
  async mounted () {
    // await this.getBranch()
  },
  methods: {
    async getflowName (dateRange) {
      this.BookingflowName = null
      this.startDate = this.momenDate_1(dateRange.startDate)
      this.endDate = this.momenDate_1(dateRange.endDate)
      // console.log('data', dateRange)
      await axios.get(this.DNS_IP + '/booking_view_getBookflowName/get?startDate=' + this.startDate + '&endDate=' + this.endDate + '&shopId=' + this.shopId)
        .then((response) => {
          let rs = response.data
          // console.log('rs', rs)
          if (rs.length > 0) {
            this.genChart(rs)
          }
        })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async genChart (dt) {
      let chartData = []
      dt.forEach((value, key) => {
        chartData.push([value.flowName, value.Total])
      })
      // console.log('chart', chartData)
      this.BookingflowName = {
        data: {
        // iris data from R
          columns: chartData,
          type: 'pie'
          // onclick: function (d, i) { console.log('onclick', d, i) },
          // onmouseover: function (d, i) { console.log('onmouseover', d, i) },
          // onmouseout: function (d, i) { console.log('onmouseout', d, i) }
        },
        pie: {
          label: {
            format: function (value, ratio, id) {
              return value
            }
          }
        },
        color: {
          pattern: this.codeColor
        }
      }
    }
  }
}
</script>
<style lang="">
.BGmain {
  --bg-color: #f2f2f2;
  background-color: var(--bg-color);
}

</style>
