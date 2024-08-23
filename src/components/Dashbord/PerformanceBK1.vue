<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <div v-if="dataSourceSettings">
          <ejs-pivotview
          class="e-frozenheader"
            id="pivotview"
            ref="pivotview"
            :dataSourceSettings="dataSourceSettings"
            :height="height"
            :showTooltip="showTooltip"
            width='100%'
            :gridSettings="gridSettings"
          ></ejs-pivotview>
        </div>
      </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
export default {
  components: {
    'left-menu-admin': adminLeftMenu
  },
  data () {
    return {
      session: this.$session.getAll(),
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'รายงาน',
          disabled: false,
          href: '/Dashbord/Report'
        }
      ],
      shopId: this.$session.getAll().data.shopId,
      dataSourceSettings: null,
      height: 900,
      showTooltip: false,
      data: [],
      gridSettings: {
        allowResizing: true
      }
    }
  },
  created () {},
  async mounted () {
    await this.getPivotData()
    console.log(this.$session.getAll().data.shopId)
  },
  methods: {
    async getPivotData () {
      this.isDataLoading = false
      this.data = []
      this.dataSourceSettings = null
      await axios
        .get(
          'http://localhost:5004/job_log/getReport_performance?shopId=' +
            this.$session.getAll().data.shopId
        )
        .then(async response => {
          if (response.data) {
            console.log(response.data)
            // Object.assign(this.data, response.data)
            // this.data = response.data
            this.dataSourceSettings = {
              dataSource: response.data,
              showGrandTotals: true,
              expandAll: true,
              columns: [{ name: 'jobDate' }],
              values: [{ name: 'closeJob', caption: 'closeJob' }],
              rows: [{ name: 'masBranchName' }, { name: 'empStep' }],
              filters: []
            }
          } else {
            // this.isDataLoading = true
          }
          console.log(response)
          console.log('data', this.data)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.data = []
        })
    }
  }
}
</script>

<style scoped>

</style>
