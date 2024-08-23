<template>
 <div>
    <v-btn v-if="isOpen" icon @click="closeDrawer()" class="close-noti d-sm-block d-none">
       <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-navigation-drawer v-model="isOpen" app temporary right :width="600" @click.stop>
      <v-btn icon  @click="closeDrawer()" class="close-button-mobile d-sm-none d-block">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    <v-card class="slide-card-style">
      <div class="p-3">
        <div class="mb-5 d-flex justify-content-center"><h3 class="slide-font">Setup guide</h3></div>
         <div v-if="progress !== 100" class="d-flex flex-row justify-content-between bg-setup m-2 p-2">
          <div class="d-flex flex-column">
            <div>
              <span class="font-title-setup">
                สวัสดี {{shopName}} เรามาตั้งค่าร้านของคุณให้พร้อมใช้งานกันเถอะ
              </span>
            </div>
            <div class="mt-auto">
              <span class="font-detail-setup">คุณยังเหลืออีก {{(setup !== null ? setup.length : 0) - countTest}} ของการตั้งค่า </span>
            </div>
            </div>
          <div>
          <div class="progress-bar" :style="progressDesktopStyle">
             <progress :value="progress" min="0" max="100" style="height:0;width:0;"></progress>
             <div class="progress-value">{{ progress }}%</div>
          </div>
          </div>
         </div>
         <div  v-else class="d-flex flex-row justify-content-between bg-setup m-2 p-2">
          <div class="d-flex flex-column">
            <div>
              <span class="font-title-setup-completed">
                ยินดีด้วย ร้านของคุณพร้อมใช้งานแล้ว
              </span>
            </div>
            <div class="mt-auto">
              <v-btn class="w-100"  rounded color="white" @click="onClickComplete()">
                Link จองของคุณพร้อมแล้ว คลิกเลย
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
            </div>
          <div>
          <div class="progress-bar" :style="progressCompoteDesktopStyle">
             <progress :value="progress" min="0" max="100" style="height:0;width:0;"></progress>
             <div class="progress-value">100%</div>
          </div>
          </div>
         </div>
         <div v-for="(item, index) in setup" :key="index" class="m-2">
          <v-btn class="d-flex flex-row justify-content-start div-slide hoverable col-12"  @click="updateSetUp(item.taskId, item.isComplete)">
            <div class="mr-5">
              <v-icon v-if="item.isComplete" color="#1B437C">mdi-checkbox-marked-circle-outline</v-icon>
              <v-icon v-else color="#1B437C">mdi-checkbox-blank-circle-outline</v-icon>
            </div>
            <div>
               <span class="font-choice-setup">{{item.taskName}}</span>
            </div>
          </v-btn>
         </div>
      </div>
    </v-card>
  </v-navigation-drawer>
 </div>
</template>
<script>
export default {
  props: {
    isOpen: {type: Boolean, default: false},
    closeDrawer: Function,
    shopName: {type: String, default: ''},
    progress: {type: Number, default: 0},
    setup: {type: Array, default: () => []},
    updateSetUp: Function,
    onClickComplete: Function
  },
  data () {
    return {
      isCheck: false
    }
  },
  computed: {
    progressDesktopStyle () {
      return `background: radial-gradient(closest-side, #1B437C 88%, transparent 80% 100%), conic-gradient(#E3E6E9 ${this.progress}%, #1B437C 0)`
    },
    progressCompoteDesktopStyle () {
      return `background: radial-gradient(closest-side, #1B437C 88%, transparent 80% 100%), conic-gradient(#E3E6E9 100%, #1B437C 0)`
    },
    countTest () {
      return this.setup ? this.setup.filter((item) => item.isComplete === true).length : 0
    }
  }
}
</script>
<style lang="css" scoped>
.slide-card-style{
  border-radius: 0%;
  height: 100%;
}
.font-detail-setup{
  font-size: 0.75rem;
  color: #ddd;
}
.font-title-setup {
  font-weight: 600;
  font-size: 0.90rem;
  color: #ddd;
}
.font-title-setup-completed {
  font-weight: 600;
  font-size: 1.5rem;
  color: #ddd;
}
.font-choice-setup {
  font-weight: 600;
  font-size: 0.90rem;
  color: #ddd;
}
.font-time-slide{
  font-size: 2.75rem;
  color: #77808d;
}
.div-slide{
    border: 1px solid var(--nav-bg) !important;
    border-radius: 10px;
    cursor: pointer;
    background-color: #fff !important;
    height: 55px !important;
}

.slide-font, .font-detail-slide, .font-title-slide, .slide-icon, .font-choice-setup {
  color: #1B437C;
}
.close-noti{
    position: absolute;
    top: 13px;
    right: 612px;
    z-index: 10;
    background-color: #ddd;
    color: #1B437C;
    font-size: 24px;
}
.close-button-mobile {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  background-color: transparent;
  color: #1B437C !important;
  font-size: 24px;
}
.progress-bar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: relative;
}
.progress-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #E3E6E9;
  font-weight: bold;
  font-size: 27px;
}
.bg-setup {
    background-color: #1B437C;
    border-radius: 10px;
}
.hoverable:hover {
 transform: scale(1.03) !important;
}
</style>
