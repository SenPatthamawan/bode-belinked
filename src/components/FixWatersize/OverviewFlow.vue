<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <v-row class="pa-3">
        <v-col cols="4">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="กรุณาเลือกวันที่"
                readonly
                dense
                outlined
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row class="pa-3">
        <v-col cols="2" v-for="(item, index) in dataFlow" :key="index">
          <v-card
            class="pa-2"
            min-height="100px"
            elevation="2"
          >{{ item.flowName }}</v-card>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import moment from 'moment' // แปลง date

export default {
  components: {
    waitingAlert,
    'left-menu-admin': adminLeftMenu
  },
  data () {
    return {
      menu: false,
      date: moment().format('YYYY-MM-DD'),
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      dataFlow: [],
      dataLimitBooking: []
    }
  },
  async mounted () {
    console.log('TEST---')
    await this.getFlow()
    await this.getLimitBooking()
  },
  methods: {
    async getFlow () {
      this.dataFlow = []
      console.log('IF')
      try {
        await axios
          .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId)
          .then(async (response) => {
            let rs = response.data
            if (rs.status === false) {
              this.dataFlow = []
            } else {
              // this.dataFlow = rs
              for (let i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {}
                s.flowId = d.flowId
                s.flowName = d.flowName
                s.setTime = d.setTime
                this.dataFlow.push(s)
              }
              console.log('this.dataFlow', this.dataFlow)
            }
          })
      } catch (error) {
        this.dataFlow = []
        console.log('getFlow-error', error)
      }
    },
    async getLimitBooking () {
      this.dataLimitBooking = []
      console.log('IF')
      try {
        await axios
          .get(this.DNS_IP + '/LimitBookingDate/get?shopId=' + this.shopId + '&bookingDate=' + '2024-03-27')
          .then(async (response) => {
            let rs = response.data
            if (rs.status === false) {
              this.dataLimitBooking = []
            } else {
              this.dataLimitBooking = rs
              // for (let i = 0; i < rs.length; i++) {
              //   let d = rs[i]
              //   let s = {}
              //   s.flowId = d.flowId
              //   s.flowName = d.flowName
              //   this.dataLimitBooking.push(s)
              // }
              console.log('this.dataLimitBooking', this.dataLimitBooking)
            }
          })
      } catch (error) {
        this.dataLimitBooking = []
        console.log('getLimitBooking-error', error)
      }
    }
  }
}
</script>
<style scope>
</style>
