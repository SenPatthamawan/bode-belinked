<template>
        <div class="col-4 div-waiting d-flex flex-column justify-content-between mr-1">
            <div v-if="groupQueueItem && groupQueueItem.length > 6" class="mb-4 d-flex justify-content-center">
                <span class="text-number-waiting">{{ groupQueueItem[0].storeFrontQueue + ' ~ ' + groupQueueItem[groupQueueItem.length - 1].storeFrontQueue }}</span>
            </div>
            <div v-else-if="groupQueueItem && groupQueueItem.length > 0" :class="`mb-4`">
                <div  :class="`d-flex flex-wrap justify-content-center`">
                    <div v-for="(item, index) in groupQueueItem" :key="index" class="pa-1 text-number-waiting col-4">
                         {{ item.storeFrontQueue }}
                    </div>
                      </div>
                </div>
            <div v-else class="d-flex"></div>
                    <div class="d-flex justify-content-center"><span class="text-waiting">Estimate Waiting time {{ time }} min</span></div>
            </div>
</template>
<script>
export default {
  props: {
    groupQueueItem: { type: Array, default: () => [] },
    time: { type: String, default: '' },
    isPortrait: {type: Boolean, default: false}
  }
}
</script>
<style scoped>

  .div-waiting{
    background-color: #fff;
    border-radius: 15px;
  }
  .text-number-waiting{
    font-weight: 700;
  }

  @media screen and (orientation: portrait) {
    .text-number-waiting{
    font-size: 3vw;
  }
  .text-waiting{
    font-size: 1.8vw;
  }
  }

@media screen and (orientation: landscape) {
  .text-number-waiting{
    font-size: 1.8vw;
  }
  .text-waiting{
    font-size: 1vw;
  }
}
</style>
