<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <header class="mb-3">
          <h2 class="mt-0 mb-1" style="color:silver">Dashboards</h2>
          <h1 class="mt-0 mb-0">Overview</h1>
        </header>
        <hr class="o-20" />
        <v-row>
            <v-col cols="8" md="8">
              <div style="display: flex">
                <date-range-picker
                ref="picker"
                :locale-data="{ firstDay: 1, format: 'yyyy-mm-dd' }"
                v-model="dateRange"
                @update="getSourcelink(dateRange)"
                />
                <v-btn
                  small class="ml-5 mt-2" color="#173053" dark
                  readonly
                >
                  กรุณาเลือกวันที่
                </v-btn>
              </div>
            </v-col>
          </v-row>
        <v-row>
          <v-col cols="4" class="text-center"  v-if="BooksourceLinkChart">
            <v-card dark tile flat color="blue lighten-1" hover>
              <v-icon size="45" class="iconify" data-icon="simple-icons:bitcoincash"></v-icon>
              <!-- <v-icon x-large>cash-clock</v-icon> -->
              <v-card-text class="headline">{{(sumTotal || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}</v-card-text>
              <v-card-text class="headline">ยอดเงิน</v-card-text>
            </v-card>
            <hr>
            <v-row>
              <v-col cols="6" v-for="(item, index) in dataInFlowName" :key="item.bookingId">
                <v-card dark tile flat :color="codeColor[index]" hover @click="getBookigList(startDates, endDates, item.flowId)">
                  <!-- <v-icon size="45" class="iconify" data-icon="simple-icons:bitcoincash"></v-icon> -->
                  <!-- <v-icon x-large>cash-clock</v-icon> -->
                  <v-card-text>{{item.flowName}}</v-card-text>
                  <v-card-text>{{(item.sumPrice || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' บาท'}}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col  cols="8" v-if="BooksourceLinkChart">
            <v-card class="p-3">
              <h3 class="text-center">ยอดเงินแยกตามบริการ</h3>
              <C3Chart :chartData="BooksourceLinkChart"></C3Chart>
            </v-card>
          </v-col>
          <v-col cols="12" class="text-center">
            <v-text-field v-model="search" append-icon="mdi-magnify" label="ค้นหา" single-line
                    hide-details></v-text-field>
            <v-data-table :headers="headers" :items="dataTableValues" :search="search">
              <template v-slot:[`item.No`]="{ item, index }">
                <div>
                  {{ index + 1 }}
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<style>
  @import '../../assets/c3.min.css';
</style>
<script>
import DateRangePicker from 'vue2-daterange-picker'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import axios from 'axios'
import C3Chart from './C3Chart.vue'
export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    C3Chart,
    DateRangePicker
  },
  data () {
    let startDate = new Date()
    let endDate = new Date()
    return {
      dataTableValues: [],
      search: '',
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      dateRange: {startDate, endDate},
      startDates: '',
      endDates: '',
      sumTotal: 0,
      dataInFlowName: [],
      BooksourceLinkChart: null,
      headers: [
        { text: 'ลำดับที่', value: 'No' },
        { text: 'ชื่อลูกค้า', value: 'bookingDataCustomerName' },
        { text: 'ชื่อลูกค้า', value: 'flowName' },
        { text: 'วันที่จอง', value: 'dueDateText' },
        { text: 'เงินมัดจำ', value: 'depositPrice' }
      ],
      codeColor: [
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
    // this.getSourcelink(this.dateRange)
  },
  methods: {
    async getSourcelink (dateRange) {
      // this.dataTableValues = []
      this.BooksourceLinkChart = null
      this.startDates = this.momenDate_1(dateRange.startDate)
      this.endDates = this.momenDate_1(dateRange.endDate)
      await axios.get(this.DNS_IP + '/booking_view_getBookSumDepositPrice/get?startDate=' + this.startDates + '&endDate=' + this.endDates + '&shopId=' + this.shopId)
        .then((response) => {
          let rs = response.data
          if (rs.length > 0) {
            this.dataInFlowName = rs
            this.genChart(rs)
            this.getBookigList(this.startDates, this.endDates, 'none')
          }
        })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async getBookigList (startDates, endDates, flowId) {
      console.log('flowId', flowId)
      this.dataTableValues = []
      let url = ''
      if (flowId === 'none') {
        url = this.DNS_IP + '/booking_view_getBookSumDepositPriceDetails/get?startDate=' + startDates + '&endDate=' + endDates + '&shopId=' + this.shopId
      } else {
        url = this.DNS_IP + '/booking_view_getBookSumDepositPriceDetails/get?startDate=' + startDates + '&endDate=' + endDates + '&shopId=' + this.shopId + '&flowId=' + flowId
      }
      await axios.get(url)
        .then((response) => {
          let rs = response.data
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.depositPrice = (d.depositPrice || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              this.dataTableValues.push(d)
            }
          }
        })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async genChart (dt) {
      let chartData = []
      this.sumTotal = 0
      dt.forEach((value, key) => {
        if ((value.sumPrice || 0) > 0) {
          this.sumTotal = this.sumTotal + value.sumPrice
          chartData.push([value.flowName, value.sumPrice])
        }
      })
      console.log('chartData', chartData)
      this.BooksourceLinkChart = {
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
