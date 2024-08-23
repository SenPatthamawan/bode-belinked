<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row justify="center">
          <v-date-picker
          v-model="picker"
          :min="currentDate"
          @change="getLimitBooking"
          >
          </v-date-picker>
        </v-row>
        {{picker}}
        <v-select
        v-model="empId"
          :items="dataEmp"
          label="Standard"
          dense
          @change="getLimitBooking"
        ></v-select>
        {{empId}}

              <v-sheet  color="primary">
                <table style="font-family: arial, sans-serif;border-collapse: collapse;width: 100%;">
                  <tr >
                    <th style="background-color: #39e811;border: 1px solid #FFFFFF;text-align: left;padding: 8px;">เวลา</th>
                    <th v-for="(item,key) in timeEmp" :key="key" style="background-color: #39e811;border: 1px solid #FFFFFF;text-align: left;padding: 8px;">{{item.value}}</th>
                  </tr>
                  <tr v-for="(item2, key2) in allBookingTime" :key="key2">
                    <td style="background-color: #FFFFFF;border: 1px solid #FFFFFF;text-align: left;padding: 3px;">{{'เริ่ม ' + item2[0].value + ' น.'}}</td>
                    <td  v-for="(i,k) in timeEmp" :key="k" style="background-color: #FFFFFF;border: 1px solid #FFFFFF;text-align: left;padding: 3px;">
                      <v-chip v-if="item2.filter((a,b) => a.value === i.value).length > 0" color="red" label>{{i.value}}</v-chip>
                      <v-chip v-else color="green" label>*****</v-chip>
                    </td>
                    <!-- <td v-else v-for="(i1,k2) in timeEmp" :key="k2" style="background-color: #39e811;border: 1px solid #FFFFFF;text-align: left;padding: 8px;">{{i.value}}</td> -->
                  </tr>
                </table>
              </v-sheet>
      </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import moment from 'moment-timezone'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
  },
  data () {
    return {
      shopId: this.$session.getAll().data.shopId,
      currentDate: moment().format('YYYY-MM-DD'),
      picker: moment().format('YYYY-MM-DD'),
      dataEmp: [],
      dataEmpAll: [],
      empId: null,
      timeEmp: [],
      allBookingTime: []
    }
  },
  async mounted () {
    await this.getEmp()
  },
  methods: {
    async getLimitBooking () {
      this.timeEmp = []
      // this.timeEmp = JSON.parse(this.dataEmpAll.filter((a) => a.empId === this.empId)[0].setTime)
      if (this.dataEmpAll.filter((a) => a.empId === this.empId)[0].setTimebyday === 'True') {
        let timeJson = JSON.parse(this.dataEmpAll.filter((a) => a.empId === this.empId)[0].setTime).filter((items) => items.value === new Date(this.picker).getDay())
        this.timeEmp = timeJson[0].setTime || []
        console.log('IF')
      } else {
        console.log('ELSE')
        this.timeEmp = JSON.parse(this.dataEmpAll.filter((a) => a.empId === this.empId)[0].setTime) || []
      }
      this.allBookingTime = []
      console.log('this.TimeEmp', this.timeEmp)
      await axios.get(this.DNS_IP + '/LimitBookingDateEmp/get?shopId=' + this.shopId + '&empId=' + this.empId + '&bookingDate=' + this.picker)
        .then(async (response) => {
          let rs = response.data
          console.log('rsEmp', rs)
          let forTime = rs
          forTime.forEach((item, key) => {
            // if (item.bookingTime !== '') {
            //   // let value = this.timeEmp.filter((i, k) => i.value === item.bookingTime)[0].value
            //   let index = this.timeEmp.findIndex((i, k) => i.value === item.bookingTime)
            //   let slot = item.timeSlot
            //   let num = index + (slot - 1)
            //   // console.log('value', value, 'index', index, 'slot', slot, num)
            //   this.allBookingTime.push(this.timeEmp.filter((i, k) => (k >= index && k <= num)))
            // }
            // let value = this.timeEmp.filter((i, k) => i.value === item.bookingTime)[0].value
            if (this.timeEmp.filter((i, k) => i.value === item.bookingTime).length > 0) {
              let index = this.timeEmp.findIndex((i, k) => i.value === item.bookingTime)
              // let slot = item.timeSlot
              let slot = item.timeSlotCustomer || item.timeSlot
              let num = index + (slot - 1)
              console.log('item', item, 'index', index, 'slot', slot, num)
              console.log('this.timeEmp', this.timeEmp.filter((i, k) => (k >= index && k <= num)))
              this.allBookingTime.push(this.timeEmp.filter((i, k) => (k >= index && k <= num)))
            }
          })
          console.log('allbooknig', this.allBookingTime)
        }).catch(async (error) => console.log('Error :', error))
    },
    async getEmp () {
      this.dataEmp = []
      await axios.get(this.DNS_IP + '/empSelect/get?privacyPage=bookingform&shopId=' + this.shopId).then(async (response) => {
        let rs = response.data
        console.log('rssssssssssssss', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.text = d.empFull_NameTH
            s.value = d.empId
            this.dataEmp.push(s)
            this.dataEmpAll.push(d)
          }
        } else {
          this.dataEmp = []
        }
      })
    }
  }
}
</script>
<style scope>
#margin {
  margin-top: 50px;
  margin-bottom: 40px;
}
.v_text_edit {
  Width: 255px;
  Height: 52px;
  font-size: 10px !important;
}
#subtext {
  color: #173053;
  font-size: 30px !important;
  font-weight: bold;
}
</style>
