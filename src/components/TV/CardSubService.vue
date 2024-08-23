<template>
  <div :class="`d-flex flex-row mx-4 ${isPortrait ? '' : 'mt-5'}`">
    <div
      class="d-flex flex-row  align-items-center card-service p-2 mx-2"
      v-for="(data,index) in booking"
      :key="index"
    >
      <div class="mr-1">
        <v-icon :size="`${isPortrait ? '20' : '25'}`" :color="shopColor">mdi-cat</v-icon>
      </div>
      <div class="mr-1">
        <strong class="text-service">{{data.storeFrontQueue}}</strong>
      </div>
      <div>
        <strong class="text-service">โต๊ะที่ {{ empList.indexOf(parseInt(data.empNo)) +1 }}</strong>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    booking: { type: Array, default: () => [] },
    empList: { type: Array, default: () => [] },
    shopColor: { type: String, default: '' },
    isPortrait: {type: Boolean, default: false}
  }
}
</script>
<style scope>
.card-service {
  background: #fff;
  border-radius: 50px;
}
.text-service {
  font-size: 0.7vw;
}
@media screen and (min-width: 1000px) {
  .text-service {
  font-size: 1.7vh;
}

}
@media screen and (min-width: 2000px) {
  .text-service {
  font-size: 2vh;
}

}
@media screen and (orientation: portrait) {
  .text-service {
  font-size: 1.5vh;
}
}

@media screen and (orientation: landscape) {}
</style>
