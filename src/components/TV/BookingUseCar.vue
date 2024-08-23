<template>
  <div>
    <div class="row d-flex justify-content-center px-4 pb-2 respons-height">
      <div
        v-bind:class="{
          'bg-primary': groupIndex % 2 === 0,
          'bg-secondary': groupIndex % 2 !== 0
        }"
        class="col-4 p-0"
        v-for="(group, groupIndex) in dataRow"
        :key="groupIndex"
      >
        <div class="d-flex flex-column justify-content-center px-2 col-12">
          <div class="col d-flex flex-column py-3 px-0">
            <div class="d-flex flex-row text-color p-0">
              <div
                class="col-4 d-flex flex-column justify-content-center align-items-center p-0"
              >
                <div>
                  <span class="text-Header">NUMBER </span>
                </div>
                <div><span class="text-sub">เลขคิว</span></div>
              </div>
              <div
                class="col-8 d-flex flex-column justify-content-center align-items-center p-0"
              >
                <div><span class="text-Header">BRAND</span></div>
                <div>
                  <span class="text-sub">แบรนด์ </span>
                </div>
              </div>
            </div>
            <div
              v-if="group.length > 0"
              v-for="(vals, index) in group"
              :key="groupIndex + '' + index"
              :class="
                `d-flex flex-row row-service my-1 p-0 ${
                  group && group.length > 0
                    ? group.length >= index
                      ? 'service'
                      : 'none-service'
                    : 'none-service'
                }`
              "
            >
              <div
                class="col-4 d-flex justify-content-center align-items-center col-left mr-2"
              >
                <span class="text-service">
                  {{ vals.Queue }}
                </span>
              </div>
              <div
                class="col-8 d-flex justify-content-center align-items-center col-right"
              >
                <span class="text-service">
                  {{ vals.Brand == 'HARLEY-DAVIDSON' ? 'HARLEY' : vals.Brand}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['bookingUse', 'isPortrait', 'shopId', 'masBranchID', 'test'],
  data () {
    return {
      defaultArr: [
        { Queue: '', Brand: '' },
        { Queue: '', Brand: '' },
        { Queue: '', Brand: '' },
        { Queue: '', Brand: '' },
        { Queue: '', Brand: '' },
        { Queue: '', Brand: '' }
      ],
      queueSummary: [],
      itemBooking: [],
      validSearch: true,
      groupQueueWaitingAll: [],
      dataS: this.test,
      state: 0,
      propBookingUseCar: this.bookingUseCar,
      propIsPortrait: this.isPortrait
    }
  },
  computed: {
    dataRow () {
      const dataArr = {
        1: JSON.parse(JSON.stringify(this.defaultArr)),
        2: JSON.parse(JSON.stringify(this.defaultArr)),
        3: JSON.parse(JSON.stringify(this.defaultArr))
      }
      if (this.test.length > 0) {
        let chkG = 0
        for (const i of this.test) {
          if (chkG <= 5) {
            dataArr[1][chkG]['Queue'] = i.storeFrontQueue
            dataArr[1][chkG]['Brand'] = i.flowNameEn
          } else if (chkG > 5 && chkG <= 11) {
            dataArr[2][chkG - 6]['Queue'] = i.storeFrontQueue
            dataArr[2][chkG - 6]['Brand'] = i.flowNameEn
          } else {
            dataArr[3][chkG - 12]['Queue'] = i.storeFrontQueue
            dataArr[3][chkG - 12]['Brand'] = i.flowNameEn
          }
          chkG++
        }
      }
      return dataArr
    }
  },
  mounted () {
    // this.dataArr[1] = JSON.parse(JSON.stringify(this.defaultArr))
    // this.dataArr[2] = JSON.parse(JSON.stringify(this.defaultArr))
    // this.dataArr[3] = JSON.parse(JSON.stringify(this.defaultArr))
    // this.intervalSearch = setInterval(() => {
    //   this.searchBooking()
    // }, 5000)
  },
  methods: {
    // async searchBooking () {
    //   this.queueSummary = []
    //   this.itemBooking = []
    //   this.dataArr[1] = JSON.parse(JSON.stringify(this.defaultArr))
    //   this.dataArr[2] = JSON.parse(JSON.stringify(this.defaultArr))
    //   this.dataArr[3] = JSON.parse(JSON.stringify(this.defaultArr))
    //   if (this.test.length > 0) {
    //     console.log(this.state, ':', this.test[0].flowNameEn, this.test[1].flowNameEn)
    //     let chkG = 0
    //     for (const i of this.test) {
    //       if (chkG <= 5) {
    //         this.dataArr[1][chkG]['Queue'] = i.storeFrontQueue
    //         this.dataArr[1][chkG]['Brand'] = i.flowNameEn
    //       } else if (chkG > 5 && chkG <= 11) {
    //         this.dataArr[2][chkG - 5]['Queue'] = i.bookingDataCustomerName
    //         this.dataArr[2][chkG - 5]['Brand'] = i.flowNameEn
    //       } else {
    //         this.dataArr[3][chkG - 11]['Queue'] = i.bookingDataCustomerName
    //         this.dataArr[3][chkG - 11]['Brand'] = i.flowNameEn
    //       }
    //       chkG++
    //     }
    //   } else {
    //   }
    //   this.state++
    //   // if (this.validSearch === true) {
    //   //   let urlApi =
    //   //     this.DNS_IP +
    //   //     '/booking_view/get?shopId=' +
    //   //     this.shopId +
    //   //     '&masBranchID=' +
    //   //     this.masBranchID +
    //   //     '&dueDate=' +
    //   //     moment().format('YYYY-MM-DD') +
    //   //     '&storeFrontQueue=is not null&statusBt=confirm and confirmJob'
    //   //   try {
    //   //     console.log('<<<<<<', this.defaultArr)
    //   //     const resPond = await axios.get(urlApi)
    //   //     if (resPond.data.length) {
    //   //       console.log('>>>>>> ', this.defaultArr)
    //   //     }
    //   //     // console.log(this.dataArr)
    //   //   } catch (err) {
    //   //     console.log('Errr : ', err)
    //   //   }
    //   //   // await axios.get(urlApi).then(async response => {
    //   //   //   let rs = response.data
    //   //   //   if (rs.length > 0) {
    //   //   //     this.groupQueueWaitingAll = rs.filter(el => {
    //   //   //       return el.statusBt === 'confirm'
    //   //   //     })
    //   //   //     let sortData = rs.sort((a, b) => {
    //   //   //       if (a.storeFrontQueue < b.storeFrontQueue) return -1
    //   //   //       return a.storeFrontQueue > b.storeFrontQueue ? 1 : 0
    //   //   //     })
    //   //   //     for (let i = 0; i < sortData.length; i++) {
    //   //   //       let d = sortData[i]
    //   //   //       d.servicePoint = d.servicePoint || ''
    //   //   //       this.itemBooking.push(d)
    //   //   //     }
    //   //   //     let dataCon = this.itemBooking.filter(el => {
    //   //   //       return el.statusBt === 'confirmJob'
    //   //   //     })
    //   //   //     let dataWain = this.itemBooking.filter(el => {
    //   //   //       return el.statusBt === 'confirm'
    //   //   //     })
    //   //   //     let sortDataDataCon = dataCon.sort((a, b) => {
    //   //   //       if (a.LAST_DATE > b.LAST_DATE) return -1
    //   //   //       return a.LAST_DATE < b.LAST_DATE ? 1 : 0
    //   //   //     })
    //   //   //     // this.queueSummary = await this.groupCountType(dataWain)
    //   //   //     this.countConfirm = dataWain.length
    //   //   //     this.countConfirmList = dataWain.filter((el, ind) => {
    //   //   //       return ind <= 11
    //   //   //     })
    //   //   //     this.itemBookingUse = sortDataDataCon.filter((el, ind) => {
    //   //   //       return ind <= 5
    //   //   //     })
    //   //   //     console.log('this.itemBookingUs book', this.itemBookingUse)
    //   //   //   } else {
    //   //   //     // this.itemBookingUse = this.getTempleteQueue()
    //   //   //     this.countConfirm = 0
    //   //   //     // this.queueSummary = []
    //   //   //     this.groupQueueWaitingAll = []
    //   //   //     this.countConfirmList = []
    //   //   //   }
    //   //   // })
    //   // }
    // }
  }
}
</script>
<style scoped>
.col-left {
  background-color: #706060;
  color: #fff9e0;
  border-radius: 20px;
  overflow: hidden;
}
.col-right {
  background-color: #fff0b4;
  color: #553e3e;
  border-radius: 20px;
  overflow: hidden;
}
.row-service {
  border-radius: 20px;
  /* box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.4); */
  overflow: hidden;
}
.text-Header,
.text-sub,
.text-service {
  font-weight: 700;
}
.service {
  min-height: 8vh;
}
.none-service {
  min-height: 8vh;
}
.text-number-waiting {
  font-size: 1.8vw;
  text-align: center;
}
.text-color {
  color: #553e3e;
}
@media screen and (orientation: portrait) {
  .text-service {
    font-size: 5vw;
  }
  .text-sub {
    font-size: 3vw;
  }
  .text-Header {
    font-size: 1.5vw;
  }
  .service {
    min-height: 5vh;
  }
  .none-service {
    min-height: 5vh;
  }
}

@media screen and (orientation: landscape) {
  .text-service {
    font-size: 2.5vw;
  }
  .text-sub {
    font-size: 1.8vw;
  }
  .text-Header {
    font-size: 1.5vw;
  }
  .service {
    min-height: 10vh;
  }
  .none-service {
    min-height: 10vh;
  }
}

@media screen and (max-width: 874px) {
  .row-service {
    border-radius: 20px;
    overflow: hidden;
  }
}

@media screen and (max-width: 993px) {
  .text-service {
    font-size: 3vw;
  }
}

@media screen and (max-width: 1024px) {
  .row-service {
    border-radius: 20px;
    overflow: hidden;
    height: 100px;
  }
}

@media screen and (max-width: 1920px) {
  .respons-height{
    padding-bottom: 0;
    height: 100vh;
  }
}

</style>
