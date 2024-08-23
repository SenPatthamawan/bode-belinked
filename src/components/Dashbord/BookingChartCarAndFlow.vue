<template lang="">
    <div >
      <v-card class="p-3">
        <h3 class="text-center">ปริมาณข้อมูลแบ่งตามประเภทบริการ</h3>
        <v-row>
          <v-col cols="4" v-for="(item , index ) in allItem" :key='index'>
                <v-card
                class="pa-2"
                elevation="8"
                >
                 <v-row>
                   <v-col >
                    <v-card-title class="justify-center" ><h4>{{index}}</h4></v-card-title>
                      <v-card-text>
                        <v-row
                          align="center"
                          class="justify-center"
                        >
                      <v-col
                        align="center"
                        class="justify-center"
                        v-for="(item2 , index2) in item" :key="index2"
                        >
                        <v-card
                            elevation="10"
                            block
                            dark
                            small
                            color="rgb(238,108,77)"
                            @click="genChart(index , index2)"
                          >{{index2}}</v-card>
                      </v-col>
                        </v-row>
                     </v-card-text>
                   </v-col>
                 </v-row>
              </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="p-3" v-if="itemChart">
              <C3Chart :chartData="itemChart"></C3Chart>
          </v-col>
        </v-row>
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
        case 'md': return '4'
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
      dateStatus: '',
      codeColor: [
        '#F898A4',
        '#0099FF',
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
      ],
      itemChart: null,
      allItem: [],
      rsItem: []
    }
  },
  async mounted () {
    // await this.getBranch()
  },
  methods: {
    async getBookingcarAndflow (picker) {
      this.dateStatus = picker
      this.itemChart = null
      this.allItem = []
      this.rsItem = []
      // console.log('picker', picker)
      await axios.get(this.DNS_IP + '/BookingData/getChartCarAndFlow?picker=' + picker + '&shopId=' + this.shopId)
        .then((response) => {
          let rs = response.data
          // console.log('********************', rs)
          if (rs.length > 0) {
            this.rsItem = rs
            this.allItem = rs.reduce((item, value) => {
              let flowName = value.flowName
              let fieldName = value.fieldName
              item[flowName] = item[flowName] || {}
              item[flowName][fieldName] = item[flowName][fieldName] || []
              item[flowName][fieldName].push(value)
              return item
            }, Object.create(null))
            // console.log('******************', this.allItem)
          }
        })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async genChart (flowName, item) {
      this.itemChart = null
      let column = []
      console.log(flowName, item)
      if (item === 'รอบเช็คระยะ') {
        let rsItemfilter = []
        for (let i = 0; i < this.rsItem.length; i++) {
          let d = this.rsItem[i]
          if (d.fieldValue !== '') {
            if (d.fieldName === item) {
              rsItemfilter.push(d)
            }
          }
        }
        // console.log('rsItemfilter', rsItemfilter)
        // console.log('rsItemfilterTTTTT', rsItemfilter.sort((a, b) => { return a.fieldValue.replace(',', '') - b.fieldValue.replace(',', '') }))
        await rsItemfilter.sort((a, b) => { return a.fieldValue.replace(',', '') - b.fieldValue.replace(',', '') }).forEach((v, k) => {
          if (v.fieldName === item) {
            if (v.fieldValue !== '') {
              let d = [v.fieldValue, v.Count]
              column.push(d)
            }
          }
        })
      } else {
        await this.rsItem.forEach((v, k) => {
          if (v.flowName === flowName && v.fieldName === item) {
            if (v.fieldValue !== '') {
              let d = [v.fieldValue, v.Count]
              // console.log('dddd', d)
              column.push(d)
            }
          }
        })
      }
      this.itemChart = {
        data: {
          columns: column,
          type: 'bar'
        },
        bar: {
          width: {
            ratio: 0.75 // this makes bar width 50% of length between ticks
          }
        // or
        // width: 100 // this makes bar width 100px
        },
        tooltip: {
          grouped: false // Default true
        },
        axis: {
          x: {
            label: {
              text: item,
              position: 'outer-left'
              // inner-right : default
              // inner-center
              // inner-left
              // outer-right
              // outer-center
              // outer-left
            }
          },
          y: {
            label: {
              text: 'จำนวน',
              position: 'outer-middle'
              // inner-top : default
              // inner-middle
              // inner-bottom
              // outer-top
              // outer-middle
              // outer-bottom
            }
          }
        },
        size: {
          height: 300
        }
      }
      // console.log(this.itemChart)
    }
  }
}
</script>
<style lang="">

</style>
