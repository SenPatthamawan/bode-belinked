<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <v-row>
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
        </v-row>
        <v-divider class="mx-4"></v-divider>
         <v-row>
          <v-col cols="12">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr style="background-color: #1b437c">
                    <th class="text-left">สาขา</th>
                    <th class="text-left">ชื่อ</th>
                    <th
                      class="text-center"
                      v-for="item in dataDate"
                      :key="item"
                    >
                      {{ item }}
                    </th>
                    <th class="text-center">รวมทั้งหมด</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr style="background-color: #1b437c">
                    <th class="text-left">รวมทั้งหมด</th>
                    <th></th>
                    <th class="text-center"></th>
                    <th class="text-center"></th>
                    <th class="text-center"></th>
                    <th class="text-center"></th>
                  </tr>
               </tfoot>
                <tbody>
                  <template v-for="item in datePushTest">
                    <tr v-for="itemB in item.value" :key="itemB">
                      <td class="text-left">{{ item.masBranchName }}</td>
                      <td class="text-left">{{ itemB.empStep }}</td>
                      <td
                        class="text-center"
                        v-for="item2 in itemB.value"
                        :key="item2.empStep"
                      >
                        {{ item2.value }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'
import moment from 'moment' // แปลง date
import DateRangePicker from 'vue2-daterange-picker'
// you need to import the CSS manually
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile,
    moment,
    DateRangePicker
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  data () {
    let startDate = new Date()
    let endDate = new Date()
    return {
      dataDate: [],
      datePushTest: [],
      dataTest: [],
      PK: '',
      path: '/job_log/',
      center: {},
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
      dataReady: true,
      date: this.momenDate_1(new Date()),
      EmployeeSelect: [],
      empStep: '',
      dateRange: { startDate, endDate },
      format: 'yyyy-mm-dd',
      firstDay: 0,
      masBranchName: '',
      BranchItem: []
    }
  },
  async mounted () {
    console.log('shopId', this.shopId)
    this.dataReady = false
    await this.getPerformance()
    await this.getDataBranch()
    await this.getEmployee()

    var DateGroup = []

    this.dataTest.forEach((uqDateValue) => {
      DateGroup.push(uqDateValue.jobDate)
    })
    var uDate = [...new Set(DateGroup)]
    console.log('uDate=>', uDate)
    this.dataDate = uDate

    const groupB = this.dataTest.reduce((groupB, value) => {
      const masBranchName = value.masBranchName
      if (!groupB[masBranchName]) {
        groupB[masBranchName] = []
      }
      groupB[masBranchName].push(value)
      return groupB
    }, {})

    // console.log('groupB', groupB)
    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groupB).map((masBranchName) => {
      return {
        masBranchName,
        value: groupB[masBranchName]
      }
    })
    groupArrays.forEach((element1) => {
      const groupEmpStep = element1.value.reduce((groupEmpStep, value) => {
        const empStep = value.empStep
        if (!groupEmpStep[empStep]) {
          groupEmpStep[empStep] = []
        }
        groupEmpStep[empStep].push(value)
        return groupEmpStep
      }, {})

      const groupArrays2 = Object.keys(groupEmpStep).map((empStep) => {
        return {
          empStep,
          value: groupEmpStep[empStep]
        }
      })

      // console.log('groupArrays2', groupArrays2)
      var dataGroup2 = []
      groupArrays2.forEach((element2) => {
        const groupDate = element2.value.reduce((groupDate, value) => {
          const jobDate = value.jobDate
          // console.log(jobDate)
          // console.log(uDate)
          uDate.forEach((dateElm) => {
            // console.log(dateElm, jobDate)
            if (jobDate === dateElm) {
              if (!groupDate[jobDate]) {
                groupDate[jobDate] = []
              }
              groupDate[jobDate].push(value)
            } else {
              if (!groupDate[dateElm]) {
                groupDate[dateElm] = []
              }
              groupDate[dateElm].push(value)
            }
          })
          return groupDate
        }, {})

        // console.log('groupDate', groupDate)
        const groupArrays3 = Object.keys(groupDate).map((jobDate) => {
          var i = 0
          // console.log('groupDate[jobDate]', jobDate)
          groupDate[jobDate].forEach(function (a) {
            if (jobDate === a.jobDate) {
              i += a.closeJob
            }
          })
          return {
            jobDate,
            value: i
          }
        })
        // console.log('groupArrays3', groupArrays3)
        element2.value = groupArrays3
        dataGroup2.push(element2)
      })
      element1.value = dataGroup2
    })
    this.datePushTest = groupArrays
  },
  methods: {
    async getDataBranch () {
      this.BranchItem = []
      await axios
        .get(this.DNS_IP + '/job_log/select_branch?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            d.text = d.masBranchName
            d.value = d.masBranchID
            this.BranchItem.push(d)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.BranchItem = []
        })
    },
    async getPerformance () {
      this.dataTest = []
      await axios
        .get(this.DNS_IP + '/job_log/getReport_performance?shopId=' + this.shopId)
        .then(async response => {
          if (response.data) {
            Object.assign(this.dataTest, response.data)
          }
          console.log(response)
          console.log('dataTest', this.dataTest)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.dataTest = []
        })
    },
    async getEmployee () {
      this.EmployeeSelect = []
      await axios
        .get(this.DNS_IP + '/job_log/select_employee?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            d.text = d.empStep
            d.value = d.empStep
            this.EmployeeSelect.push(d)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.EmployeeSelect = []
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
