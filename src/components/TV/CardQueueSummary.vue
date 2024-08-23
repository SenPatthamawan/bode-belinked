<template>
  <div class="d-flex flex-column justify-content-between mr-1 mr-1 p-0">
    <div class=" d-flex flex-column justify-content-center py-1 title">
      <div class="text-center">
        <span class="text-waiting">Number of queues waiting / จำนวนคิวที่รอ</span>
      </div>
    </div>
    <div class="d-flex flex-column div-waiting h-100">
      <div v-for="(item, key) in queueSummary" :key="key" class="d-flex flex-row justify-content-around py-2">
        <div >
          <span class="text-number-waiting">{{ item.key }}</span>
        </div>
        <div><span class="text-number-waiting">{{ item.value }}</span></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    queueSummary: { type: Array, default: () => [] },
    isPortrait: { type: Boolean, default: false },
    colorTitle: { type: String, default: '' }
  }
}
</script>
<style scoped>
.title {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px 15px 0 0;
}

.div-waiting {
  background-color: #fff;
  border-radius: 0 0 15px 15px;
}

.text-number-waiting {
  font-weight: 700;
}

@media screen and (orientation: portrait) {
  .text-number-waiting {
    font-size: 3vw;
  }

  .text-waiting {
    font-size: 1.5vw;
  }
}

@media screen and (orientation: landscape) {
  .text-number-waiting {
    font-size: 1.8vw;
  }

  .text-waiting {
    font-size: 0.9vw;
  }
}</style>
