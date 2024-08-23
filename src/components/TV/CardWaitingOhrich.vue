<template>
    <div :class="`${isPortrait ? 'col' :'col-4 mr-1 p-0' } div-waiting d-flex flex-column justify-content-between `">
        <div v-if="groupQueueItem && groupQueueItem.length > 6" class="div-top h-100 d-flex justify-content-center">
            <span class="text-number-waiting">{{ groupQueueItem[0]+ ' ~ ' + groupQueueItem[groupQueueItem.length - 1] }}</span>
        </div>
        <div v-else-if="groupQueueItem && groupQueueItem.length > 0" :class="`div-top h-100 `">
            <div  :class="`d-flex flex-wrap justify-content-center`">
                <div v-for="(item, index) in groupQueueItem" :key="index" :class="`pa-1 text-number-waiting col-4 d-flex  justify-content-center`">
                    {{ item }}
                </div>
                  </div>
            </div>
        <div v-else class="d-flex p-4 div-top h-100"></div>
                <div class="d-flex justify-content-center div-bottom py-1"><span class="text-waiting">Estimate Waiting time {{ time }} min</span></div>
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
border-radius: 20px;
}
.div-top {
  border-top: 3px solid #BDE56A;
  border-right: 3px solid #BDE56A;
  border-left: 3px solid #BDE56A;
  border-radius: 20px 20px 0 0;
}
.div-bottom {
  background-color: #BDE56A;
  border-radius: 0 0 20px 20px;
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
