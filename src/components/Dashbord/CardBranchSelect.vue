<template lang="">
<div v-if="Carditem.length > 0 ">
  <div  v-if="widthScreen > 410" v-for="(item,index) in Carditem" :key="index">
    <div class="p-3" v-if="Carditem[index].length > 0" >
      <v-card elevation="8" >
          <v-row >
          <v-col cols="12" >
        <center>
          <v-list-item two-line>
            <v-list-item-content>
                <p>{{flowNameitem[index]}}</p>
            </v-list-item-content>
          </v-list-item>
            <v-col align="center">
              <div :id="ID + index"/>
            </v-col>
        </center>
        </v-col>
      </v-row>
      </v-card>
        </div>
  </div>
  <div v-if="widthScreen < 410">
    <v-row >
    <div v-for="(item,index) in Carditem" :key="index">
    <div style="position:absolute;
                    top:13px;
                    left:-25px;" class="p-3" v-if="Carditem[index].length > 0" >
          <v-row >
          <v-col cols="12" >
        <v-card>
        <center>
          <v-list-item two-line>
            <v-list-item-content>
                <p>{{flowNameitem[index]}}</p>
            </v-list-item-content>
          </v-list-item>
            <v-col align="center">
              <div :id="ID + index"/>
            </v-col>
        </center>
         </v-card>
        </v-col>
      </v-row>
        </div>
      </div>
      </v-row>
  </div>
</div>
    <!-- <div v-if="Carditem.length > 0">
      <div v-for="(item , index) in Carditem" :key='index'>
        <v-card class="p-3" >
          <v-row >
          <v-col cols="6" >
        <center>
        <v-card class="mx-auto" elevation="5" :color="codeColor[index]" dark>
          <v-list-item two-line>
            <v-list-item-content>
                <p>{{item.flowName}}</p>
            </v-list-item-content>
          </v-list-item>
          </v-card>
        </center>
        </v-col>
          <v-col cols="6">
          <v-row >
            <v-col cols="12" >
              <div v-for="(item2 , index2) in item.stepTitle" :key='index2'>
              <center>
              <v-card class="mx-auto" elevation="5"  :color="codeColor[index2]" dark  >
                  <p style="margin-bottom: 0px;">{{item2}}({{item.Jobitem[index2] - item.closeJob[index2]}})</p>
                </v-card>
              </center>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
        </v-card>
      </div>
    </div> -->
</template>
<script>
import adminLeftMenu from '../Sidebar.vue' // เมนู
import axios from 'axios'
import D3Funnel from 'd3-funnel'
export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    D3Funnel
  },
  data () {
    return {
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      flowNameitem: [],
      dataitem: [],
      Carditem: [],
      widthScreen: window.screen.width,
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
      ],
      Chartitem: [],
      data: [
        { label: 'Inquiries', value: 5000 },
        { label: 'Applicants', value: 2500 },
        { label: 'Admits', value: 500 },
        { label: 'Deposits', value: 200 }
      ],
      options: {
        chart: {
          width: 350,
          height: 300,
          curve: {
            enabled: true
          }
        },
        label: {
          enabled: true,
          fontFamily: null,
          fontSize: '14px',
          fill: '#fff',
          format: `{l}
          {f}`
        },
        tooltip: {
          enabled: false,
          format: '{l}: {f}'
        },
        events: {
          click: {
            block: null
          }
        }
      },
      ID: 'A'
    }
  },
  async mounted () {
    // await this.getBranch()
  },
  methods: {
    async getBranchSelectCard (masBranchName, dateRange) {
      this.dataitem = []
      this.flowNameitem = []
      await this.getFlow()
      let startDate = this.momenDate_1(dateRange.startDate)
      let endDate = this.momenDate_1(dateRange.endDate)
      await axios
        .get(
          this.DNS_IP +
            '/job_log/getDashbord_selectBranch_card?startDate=' +
            startDate +
            '&endDate=' +
            endDate +
            '&shopId=' +
            this.shopId +
            '&masBranchName=' +
            masBranchName
        )
        .then((response) => {
          let rs = response.data
          // console.log('rs', rs)
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            this.dataitem.push(d)
          }
          console.log('dataitem', this.dataitem)
          this.getCard()
        })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
      // console.log('this.statusitem', this.statusitem)
    },
    async getFlow () {
      await axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId)
        .then((response) => {
          let rs = response.data
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            this.flowNameitem.push(d.flowName)
          }
        })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async getCard () {
      this.Carditem = []
      for (let i = 0; i < this.flowNameitem.length; i++) {
        let d = this.flowNameitem[i]
        // console.log('d', d)
        let aa = []
        for (let a = 0; a < this.dataitem.filter((item) => item.flowName === d).length; a++) {
          let ff = this.dataitem.filter((item) => item.flowName === d)[a]
          let s = {}
          s.label = ff.stepTitle
          s.value = ff.totalJob - ff.closeJob
          aa.push(s)
        }
        this.Carditem.push(aa)
      }
      console.log(' this.Carditem', this.Carditem)
      setTimeout(() => {
        this.renderChart()
      }, 500)
    },
    async renderChart () {
      let chart = []
      for (let i = 0; i < this.Carditem.length; i++) {
        chart.push('A' + i)

        if (this.Carditem[i].length > 0) {
          chart[i] = new D3Funnel('#' + this.ID + i)
          chart[i].draw(this.Carditem[i], this.options)
        }
      }
      // const chart = new D3Funnel('#' + this.ID + 1)
      // chart.draw(this.Carditem[1], this.options)
      // const chart2 = new D3Funnel('#' + this.ID + 1)
      // chart2.draw(this.data, this.options)
    },
    async selectflowname (item) {
      this.flowNameitem = item
      this.getCard()
    }
  }
}
</script>
<style lang="">
</style>
