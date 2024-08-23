<template lang="">
    <div v-if="Branchitems.length > 0">
      <v-row>
        <v-col cols="6">
        <center>
        <v-card class="mx-auto" elevation="5" :color="codeColor[3]">
          <v-list-item two-line>
            <v-list-item-content>
                งานทั้งหมด
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <v-row align="center">
              <v-col class="text-h5" cols="12">{{sumstatusitem.totalJob}}/{{sumstatusitem.closeJob}}</v-col>
            </v-row>
          </v-card-text>
          </v-card>
        </center>
      </v-col>
        <v-col cols="6">
        <v-row >
          <v-col cols="12" v-for="(item , index) in statusitem" :key='index'>
            <center>
            <v-card class="mx-auto" elevation="5" :color="codeColor[index]">
              <v-list-item two-line>
                <v-list-item-content>
                    {{item.masBranchName}}
                </v-list-item-content>
              </v-list-item>

              <v-card-text>
                <v-row align="center">
                  <v-col class="text-h5" cols="12">{{item.totalJob}}/{{item.closeJob}}</v-col>
                </v-row>
              </v-card-text>
              </v-card>
            </center>
          </v-col>
        </v-row>
      </v-col>
      </v-row>
    </div>
</template>
<script>
import adminLeftMenu from '../Sidebar.vue' // เมนู
import axios from 'axios'
export default {
  components: {
    'left-menu-admin': adminLeftMenu

  },
  data () {
    return {
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      Branchitems: [],
      statusitem: [],
      sumstatusitem: {
        totalJob: '',
        closeJob: ''
      },
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
    // await this.getBranch()
  },
  methods: {
    getBranchCard (masBranchID, dateRange) {
      let startDate = this.momenDate_1(dateRange.startDate)
      let endDate = this.momenDate_1(dateRange.endDate)
      this.statusitem = []
      axios.get(this.DNS_IP + '/job_log/getDashbord_total_card?startDate=' + startDate + '&endDate=' + endDate + '&shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.masBranchName = d.masBranchName
            s.totalJob = d.totalJob
            s.closeJob = d.closeJob
            this.statusitem.push(s)
          }
          const SumtotalJob = this.statusitem.map(item => { return item.totalJob })
          const SumcloseJob = this.statusitem.map(item => { return item.closeJob })
          const reducer = (accumulator, curr) => accumulator + curr
          this.sumstatusitem.totalJob = SumtotalJob.reduce(reducer)
          this.sumstatusitem.closeJob = SumcloseJob.reduce(reducer)
          this.getMasbranch(masBranchID)
        }
        // console.log('this.statusitem', this.statusitem)
      })
        .catch((error) => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async getMasbranch (masBranchID) {
      this.Branchitems = []
      axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
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
    }
  }
}
</script>
<style lang="">

</style>
