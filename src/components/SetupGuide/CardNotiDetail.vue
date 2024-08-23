<template>
  <div>
        <v-btn  @click="onClickReadedNoti(item)" v-for="(item, index) in listData" :key="index" class="d-flex flex-row justify-content-start div-slide p-0 col-12 my-2">
                <div class="col-2 d-flex align-items-center">
                  <div v-if="item.IsNotify !== 'True'"><div class="icon-unread"></div></div>
                  <v-icon  color="#1b437c" size="50">mdi-calendar-alert</v-icon>
                </div>
                <div class="col-10 d-flex flex-column justify-content-start">
                  <div class="text-justify"><span class="font-title-slide">รายการนัดหมายใหม่ {{ item.flowName }}</span><v-icon v-if="item.IsNotify !== 'True'" class="blink" color="#1b437c" size="20">mdi-new-box</v-icon></div>
                  <div class="text-justify"><span class="font-time-slide">{{item.CREATE_DATE}}</span></div>
                  <div class="text-justify"><span class="font-detail-slide">สาขา : {{ item.masBranchName }}</span></div>
                  <div class="text-justify"><span class="font-detail-slide">วันที่นัดหมาย : {{item.dueDateText}} น.</span></div>
                  <div v-if="item.bookingDataCustomerName && item.bookingDataCustomerName !== ''" class="text-justify"><span class="font-detail-slide">ชื่อลูกค้า : {{ item.bookingDataCustomerName }}</span></div>
                  <div class="text-justify" v-if="item.depositPrice !== null"><span class="font-detail-slide">ชำระเงิน: มัดจำ {{ item.depositPrice }} บาท</span></div>
                </div>
              </v-btn >
      </div>
</template>
<script>
export default {
  props: {
    listData: { type: Array, default: () => [] },
    onClickReadedNoti: Function
  }
}
</script>
<style lang="css" scoped>
.div-slide {
  border: 1px solid var(--nav-bg) !important;
  border-radius: 10px;
  height: 120px !important;
  cursor: pointer;
  background-color: #fff !important;
}

.icon-unread{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #1b437c;
}

.font-title-slide {
  font-weight: 600;
  font-size: 0.8rem;
}
.font-detail-slide {
  font-size: 0.75rem;
}
.font-detail-slide,
.font-title-slide {
  color: #1b437c;
}
.font-time-slide {
  font-size: 0.7rem;
  color: #77808d;
}
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

.blink {
  animation: blink 2s linear infinite;
}
</style>
