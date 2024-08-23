<template>
    <div class="col d-flex flex-column">
      <div class="d-flex flex-row col">
        <div class="col-6 d-flex flex-column justify-content-center align-items-center">
            <div><span class="text-Header">Number</span></div>
             <div><span class="text-sub">หมายเลขคิว</span></div>
            </div>
            <div class="col-6 d-flex flex-column justify-content-center align-items-center">
                <div><span class="text-Header">Counter</span></div>
            <div><span class="text-sub">ช่องบริการ</span></div>
            </div>
        </div>
    <div v-for="(index) in 6" :key="index" :class="`d-flex flex-row row-service my-1 ${bookingUse && bookingUse.length > 0 ? bookingUse.length >= index ?  'service' : 'none-service' : 'none-service'}`" >
        <div class="col-6 d-flex justify-content-center align-items-center py-0"><span class="text-service">{{bookingUse && bookingUse.length > 0  ? bookingUse.length >= index ? bookingUse[index-1].storeFrontQueue  : '': ''}}</span></div>
         <div class="col-6 d-flex justify-content-center align-items-center py-0"><span class="text-service">{{bookingUse && bookingUse.length > 0  ? bookingUse.length >= index ? bookingUse[index-1].servicePoint === '' ? (bookingUse[index-1].statusBt === 'confirmJob' ? 'เรียกคิว' : '') :bookingUse[index-1].servicePoint  : '': ''}}</span></div>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    bookingUse: { type: Array, default: () => [] },
    isPortrait: {type: Boolean, default: false}
  }
}
</script>
<style scoped>

.col-left{
background-color: #E9E9E9;
}
.col-right{
background-color: #E9E9E9;
}
.col-full {
  background-color: #E9E9E9;
  border: 3px solid #BDE56A;
}
.row-service{
border-radius: 20px;
box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.4);
overflow: hidden;
background-color: #E9E9E9;
border: 3px solid #BDE56A;
}
.text-Header, .text-sub, .text-service{
font-weight: 700;
}
.service{
min-height: 8vh;
}
.none-service{
min-height: 8vh;
}
.text-number-waiting{
font-size: 1.8vw;
text-align: center;
}
@media screen and (orientation: portrait) {
.text-service {
font-size: 5vw;
}
.text-sub{
font-size: 3vw;
}
.text-Header {
font-size: 4vw;
}
.service{
min-height: 5vh;
}
.none-service{
min-height: 5vh;
}
}

@media screen and (orientation: landscape) {
.text-service {
font-size: 3.5vw;
}
.text-sub{
font-size: 1.8vw;
}
.text-Header {
font-size: 3.5vw;
}
.service{
min-height: 10vh;
}
.none-service{
min-height: 10vh;
}

}
</style>
