<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <!-- <v-row>
          <v-col cols="12">
            <v-sheet tile height="54" class="d-flex">
              <v-col cols="3">
                <v-select
                  v-model="masBranchName"
                  :items="BranchItem"
                  dense
                  outlined
                  hide-details
                  label="สาขา"
                  class="ma-3"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="empStep"
                  :items="EmployeeSelect"
                  dense
                  outlined
                  hide-details
                  label="พนักงาน"
                  class="ma-3"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <date-range-picker
                  ref="picker"
                  :locale-data="{ firstDay: 1, format: 'yyyy-mm-dd' }"
                  v-model="dateRange"
                />
              </v-col>
            </v-sheet>
          </v-col>
        </v-row> -->
        <div id="app" class="container mt-5">
          <!-- <h2 class="border-bottom pb-2 mb-4">
            Pivot <small>(drag & drop UI + PivotTable)</small>
          </h2> -->
          <div class="mb-5">
            <!-- <pivot
              :data="data"
              :fields="fields"
              :available-field-keys="availableFieldKeys"
              :row-field-keys="rowFieldKeys"
              :col-field-keys="colFieldKeys"
              :reducer="reducer"
              :default-show-settings="defaultShowSettings"
              :is-data-loading="isDataLoading"
            >
              <template slot="value" slot-scope="{ value }">
                {{ value.toLocaleString() }}
              </template>
            </pivot> -->
          </div>
        </div>
      </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
// import adminLeftMenu from '../Sidebar.vue' // เมนู
import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'
import moment from 'moment' // แปลง date
import DateRangePicker from 'vue2-daterange-picker'
// you need to import the CSS manually
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
// import { PivotTable, Pivot } from '@click2buy/vue-pivot-table'
export default {
  components: {
    // 'left-menu-admin': adminLeftMenu,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile,
    moment,
    DateRangePicker
    // Pivot
    // PivotTable
  },
  // created () {
  //   setInterval(this.getNowGlobal, 1000)
  // },
  data () {
    // let startDate = new Date()
    // let endDate = new Date()
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
      data: [],

      // Pivot params
      fields: [
        {
          key: 'masBranchName',
          getter: item => item.masBranchName,
          label: 'สาขา',
          valueFilter: true,
          displayTotal: true
        },
        {
          key: 'empStep',
          getter: item => item.empStep,
          label: 'พนักงาน',
          valueFilter: true,
          displayTotal: false
        },
        {
          key: 'jobDate',
          getter: item => item.jobDate,
          label: 'วันที่เปิด Job',
          valueFilter: true,
          displayTotal: false
        }
      ],
      availableFieldKeys: [],
      rowFieldKeys: ['masBranchName', 'empStep'],
      colFieldKeys: ['jobDate'],
      reducer: (sum, item) => sum + item.closeJob,
      defaultShowSettings: false,
      isDataLoading: false,
      showFooter: true,
      shopId: this.$session.getAll().data.shopId
    }
  },
  async mounted () {
    console.log('shopId', this.shopId)
    await this.getPerformance()
  },
  methods: {
    async getPerformance () {
      this.isDataLoading = false
      this.data = []
      await axios
        .get(
          this.DNS_IP + '/job_log/getReport_performance?shopId=' + this.shopId
        )
        .then(async response => {
          if (response.data) {
            // Object.assign(this.data, response.data)
            this.data = response.data
          } else {
            this.isDataLoading = true
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
<style scope>
.v-data-table-header {
  background-color: #1b437c !important;
}
.Color-Font {
  color: #808588;
}
.Color-Font-Action {
  color: #b61c1c;
}
.Color-Font-Preview {
  color: #262a34;
}
.Color-Button {
  color: #b61c1c;
}
.Divider {
  border: 2px solid #808588;
  background: #808588;
  border-radius: 5px;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.v-data-table-header {
  background-color: var(--table-head-bg) !important;
}
</style>
