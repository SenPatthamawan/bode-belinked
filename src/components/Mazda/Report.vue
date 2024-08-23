<template>
   <div style="overflow-x: scroll;">
      <table v-if="dataReady" border="1" cellspacing="1" cellpadding="2">
         <tr>
            <td align="center"><b>เวลา</b></td>
            <td align="center"><b>Fast Track</b></td>
            <td align="center" colspan="20"><b>เช็คระยะ ซ่อมทั่วไป</b></td>
         </tr>
         <tr v-for="(row, index) in dataReport" v-bind:key="index">
            <td align="center" style="min-width: 100px;height: 150px;">{{index.replace('time-', '')}}:00/<br>{{index.replace('time-', '')}}:15</td>
            <template v-for="(col, index2) in row">
               <td width="150" valign="top"  v-bind:key="index + '_' + index2" align="center" :rowspan="col.rowspan" v-if="col.colType !== 'remove'">
                  <table v-if="col.cusName">
                     <tr v-if="(col.colType === 'even')" style="height:30px;background-color:#ddd;"><td>&nbsp;</td></tr>
                     <tr :rowspan="(col.colType === 'even') ? '1' : '2'" valign="top"><td>
                        <table border="0" class="table_info">
                           <tr><td align="center"><b>{{col.timeText || '&nbsp;'}}</b></td></tr>
                           <tr><td align="center" :style="'height: ' + (190 * col.rowspan) + 'px;'">
                              <template v-if="col.cusName">
                                 {{col.cusName}}<br>
                                 {{col.carModel}}<br>
                                 {{col.cusReg}}<br>
                                 {{col.serviceDetail}}<br>
                                 T.{{col.tel}}<br>
                              </template>
                           </td></tr>
                        </table>
                     </td></tr>
                     <tr><td>
                        <table border=1 class="table_detail">
                           <tr align="center">
                              <td>DCRC<br>นัด</td>
                              <td>ลค.<br>นัด</td>
                              <td>โทรเตือน</td>
                              <td>ตรงเวลา</td>
                              <td>ไม่ตรง</td>
                           </tr>
                           <tr align="center">
                              <td v-if="col.remark">{{(col.remark.substring(0,1) !== 'ล' ? col.remark.substring(0,3) : '')}}</td>
                              <td v-if="col.remark">{{(col.remark.substring(0,1) === 'ล' ? (col.remark).replace('ล.', '').substring(0,4) : '')}}</td>
                              <td v-if="col.remarkConfirm1">{{(col.remarkConfirm1 ? '1' : '')}}</td>
                              <td>&nbsp;</td>
                              <td>&nbsp;</td>
                           </tr>
                        </table>
                     </td></tr>
                  </table>
               </td>
            </template>
         </tr>
      </table>
   </div>
</template>
<style scoped>
.table_info {
   width: 200px !important;
   min-height: 150px;
}
.table_detail {
   width: 200px !important;
}
.table_detail > tr > td {
   display: box;
   font-size: 16px !important;
   width: 130px !important;
}
</style>

<script>
import axios from 'axios' // api
import moment from 'moment-timezone'
export default {
  components: {},
  created () {},
  computed: {
    width () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '100%'
        case 'sm': return '80%'
        case 'md': return '40%'
        case 'lg': return '40%'
        case 'xl': return '40%'
      }
    }
  },
  data () {
    return {
      masBranchID: null,
      shopId: null,
      dueDate: null,
      timeTable: null,
      BookingDataListTimechange: null,
      dataItemTimesChange: null,
      dataRemoveExport: null,
      dataItemCheck: null,
      dataItems: null,
      dataReport: [],
      dataReady: false,
      editedItemSeleteField: null
    }
  },
  async mounted () {
    this.masBranchID = this.$route.query.masBranchID
    this.shopId = this.$route.query.shopId
    this.timeTable = this.$route.query.timeTable
    this.dueDate = moment(moment(this.timeTable, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
    await this.getCustomFieldStart()
    await this.getTimesChange()
  },
  methods: {
    getDataFromFieldName (data, key) {
      if (data !== undefined) {
        return data.filter(function (el) {
          return el.fieldName === key
        })
      } else {
        return []
      }
    },
    async getTimesChange () {
      try {
        this.dataItemTimesChange = []
        this.dataRemoveExport = []
        this.dataItemCheck = []
        var dataItems = []
        if (this.masBranchID && this.shopId && this.timeTable) {
          var dateStart = moment(moment(this.timeTable, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
          await this.getBookingDataListTimechange(dateStart)

          await axios
            .get(
              // eslint-disable-next-line quotes
              this.DNS_IP +
                  '/booking_view/get?shopId=' +
                  this.shopId +
                  '&masBranchID=' +
                  this.masBranchID +
                  '&dueDate=' + moment(moment(this.timeTable, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD') + '&checkOnsite=is null'
            ).then(async response => {
              if (response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                  let d = response.data[i]
                  let s = d
                  s.chkConfirm = false
                  s.chkCancel = false
                  s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
                  s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
                  s.remarkRemove = d.remarkRemove || ''
                  s.timeDueHtext = d.timeDueH + ':00'
                  s.timeDuetext = d.timeDue
                  if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
                    s.chkConfirm = true
                    s.chkCancel = false
                  }
                  if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
                    s.chkConfirm = false
                    s.chkCancel = true
                  }
                  s.statusBt = d.statusBt || 'wait'
                  switch (d.statusBt) {
                    case 'confirm':
                      s.statusBtText = 'ยืนยันแล้ว'
                      break
                    case 'cancel':
                      s.statusBtText = 'ยกเลิก'
                      break
                    case 'confirmJob':
                      s.statusBtText = 'รับรถแล้ว'
                      break
                    default:
                      s.statusBtText = 'รายการนัดหมายใหม่'
                      break
                  }
                  s.cusName = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'ชื่อ')
                  s.cusReg = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'เลขทะเบียน')
                  s.tel = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'เบอร์โทร')
                  s.carModel = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'รุ่นรถ')
                  s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                  s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                  s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                  s.carModel = (s.carModel.length > 0) ? s.carModel[0].fieldValue : ''
                  dataItems.push(s)
                }
              }
              if (dataItems.length === 0 || dataItems.status === false) {
                this.dataItemCheck = []
              } else {
                this.dataItemCheck = dataItems
                this.dataItemTimesChange = this.dataItemCheck.sort((a, b) => {
                  if (a.timeDuetext < b.timeDuetext) return -1
                  return a.timeDuetext > b.timeDuetext ? 1 : 0
                })

                let timebox = ''
                let indexOdd = 1
                let indexEven = 2
                this.dataReport = {}
                console.log(this.dataItemTimesChange)
                this.dataItemTimesChange.forEach(async (row) => {
                  row.serviceDetail = await this.getServiceDetail(row)
                  row.rowspan = 1
                  if (timebox !== row['timeDueH']) {
                    timebox = row['timeDueH']
                    if (!this.dataReport['time-' + timebox]) {
                      this.dataReport['time-' + timebox] = {}
                      this.dataReport['time-' + timebox][0] = { colType: 'fasttrack' }
                    }
                    indexOdd = 1
                    indexEven = 2
                  }
                  if (!row.fastTrack) {
                    if (row['timeDueHtext'] === row['timeDuetext']) {
                      row.colType = 'odd'
                      this.dataReport['time-' + timebox][indexOdd] = row
                      if (!this.dataReport['time-' + timebox][indexOdd + 1]) {
                        this.dataReport['time-' + timebox][indexOdd + 1] = { colType: 'even' }
                      }
                      indexOdd += 2
                    } else {
                      row.colType = 'even'
                      this.dataReport['time-' + timebox][indexEven] = row
                      if (!this.dataReport['time-' + timebox][indexEven - 1]) {
                        this.dataReport['time-' + timebox][indexEven - 1] = { colType: 'odd' }
                      }
                      indexEven += 2
                    }
                  } else {
                    let timebox1 = timebox
                    let timebox2 = ''
                    if (row['timeText'].indexOf('-') > -1) {
                      row.rowspan = 2
                      let timeText = row['timeText'].split('-')
                      timebox1 = timeText[0].trim().replace(':00', '')
                      timebox2 = timeText[1].trim().replace(':00', '')
                      if (!this.dataReport['time-' + timebox2]) {
                        this.dataReport['time-' + timebox2] = {}
                      }
                      console.log('time-' + timebox2)
                      this.dataReport['time-' + timebox2][0] = { colType: 'remove' }
                      console.log(this.dataReport['time-' + timebox2][0])
                    }
                    row.colType = 'fasttrack'
                    this.dataReport['time-' + timebox1][0] = row
                  }
                })
                this.dataReady = true
                console.log(this.dataReady)
                console.log(this.dataReport)
              }
            })
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getServiceDetail (row) {
      let serviceDetail = ''
      let fieldflow = this.editedItemSeleteField.filter((row2) => { return row2.conditionField === 'flow' && String(row2.conditionValue) === String(row.flowId) })
      fieldflow.forEach((row2) => {
        let tempField = this.BookingDataListTimechange[row.bookNo].filter((row3) => { return String(row3.fieldId) === String(row2.fieldId) })
        serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
      })
      serviceDetail = serviceDetail || row.flowName
      return serviceDetail
    },
    async getCustomFieldStart () {
      this.editedItemSeleteField = []
      axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.fieldId = d.fieldId
              s.fieldName = d.fieldName
              s.fieldType = d.fieldType
              s.optionField = d.optionField
              s.conditionField = d.conditionField
              s.conditionValue = d.conditionValue
              s.shopId = d.shopId
              s.showCard = d.showCard
              s.fieldValue = ''
              this.editedItemSeleteField.push(s)
            }
            // console.log('this.editedItemSeleteField', this.editedItemSeleteField)
          }
        })
    },
    async getBookingDataListTimechange (dateStart) {
      this.BookingDataListTimechange = []
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach((row) => {
              if (typeof (this.BookingDataListTimechange[row.bookNo]) === 'undefined') {
                this.BookingDataListTimechange[row.bookNo] = []
              }
              this.BookingDataListTimechange[row.bookNo].push(row)
            })
          }
        })
      console.log(this.BookingDataListTimechange)
    }
  }
}
</script>
