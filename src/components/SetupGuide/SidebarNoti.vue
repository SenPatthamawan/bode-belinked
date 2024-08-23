<template>
  <div>
    <v-btn
      v-if="isOpen"
      icon
      @click="closeDrawer()"
      class="close-noti d-sm-block d-none"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-navigation-drawer v-model="isOpen" app temporary right :width="600">
      <v-btn
        icon
        @click="closeDrawer()"
        class="close-button-mobile d-sm-none d-block"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div class="slide-card-style">
        <div  class="d-flex flex-row">
          <div>
            <v-tabs class="tab-noti" vertical>
              <v-tab  class="tab-noti" v-for="(item, i) in taps" :key="i" @click="activeTab = item.key">
                <div class="d-flex flex-column justify-content-center align-items-center">
                  <div :class="`icon-tap my-3 ${activeTab === item.key ? ' icon-tap-active' :' icon-tap-inactive'}`"><v-icon color="#ffff">{{ item.icon }}</v-icon></div>
                  <div class="d-none d-sm-block"><span class="font-weight-bold">{{item.label}}</span></div>
                </div>
              </v-tab>
            </v-tabs>
          </div>
          <div class="pt-10 px-4 col">
            <div v-if="activeTab === 'appointment'">
              <div>
               <h3 class="font-weight-bold ">Appointment</h3>
             </div>
             <div id="listnoti">
              <div v-if="listDataUnread && listDataUnread.length > 0">
                <div><span class="font-detail-slide font-weight-bold">ใหม่</span></div>
                <CardNotiDetail :listData="listDataUnread" :onClickReadedNoti=onClickReadedNoti />
              </div>
              <div v-if="listDataReaded && listDataReaded.length > 0">
                <div><span class="font-detail-slide font-weight-bold">ก่อนหน้านี้</span></div>
                <CardNotiDetail :listData="listDataReaded" :onClickReadedNoti=onClickReadedNoti />
              </div>
             </div>
            </div>
            <div v-else>
              <div><h3 class="font-weight-bold">News</h3></div>
            </div>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import CardNotiDetail from './CardNotiDetail.vue'
export default {
  components: {
    CardNotiDetail
  },
  props: {
    isOpen: { type: Boolean, default: false },
    closeDrawer: Function,
    listDataUnread: { type: Array, default: () => [] },
    listDataReaded: { type: Array, default: () => [] },
    taps: { type: Array, default: () => [] },
    onClickReadedNoti: Function
  },
  data () {
    return {
      activeTab: 'appointment'
    }
  }
}
</script>
<style lang="css" scoped>
#listnoti {
  max-height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.icon-tap {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
}
.icon-tap-active {
  background-color: #1b437c;
}
.icon-tap-inactive {
  background-color: #CACACA;
}
.tab-noti {
  height: 200px !important;
}
.slide-card-style {
  border-radius: 0%;
  height: 100vh;
  background-color: #fff;
}
.font-detail-slide {
  font-size: 0.75rem;
}

.slide-font {
  color: #1b437c;
}
.close-noti {
  position: absolute;
  top: 13px;
  right: 612px;
  z-index: 10;
  background-color: #ddd;
  color: #1b437c;
  font-size: 24px;
}
.close-button-mobile {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  background-color: transparent;
  color: #1b437c !important;
  font-size: 24px;
}
.tab-vertical {
  flex-direction: column;
}
@media only screen and (max-width: 768px) and (orientation: landscape) {
  .tab-horizontal {
    flex-direction: row;
  }
}
</style>
