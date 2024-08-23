<template>
  <div>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon dark @click.stop="drawer = !drawer" />
        <!-- <v-toolbar-title v-text="title" /> -->
        <div style="position: absolute;top: 60px;display: flex;flex-direction: column;">
          <template v-if="paymentStatus === 'noCash'">
            <v-spacer></v-spacer>
            <v-alert
              class="mt-3"
              dense
              prominent
              color="warning"
              icon="mdi-alarm-multiple"
              dark
            >
              <v-row align="center">
                <v-col class="grow">
                  โปรดชำระเงิน ภายในวันที่ 7 ของทุกเดือนเพื่อการใช้งานที่ต่อเนื่อง
                </v-col>
                <v-col class="shrink" @click="gotoBilling()">
                  <v-btn small>ชำระค่าบริการ</v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </template>
          <template v-if="paymentStatus === 'wait'">
            <v-spacer></v-spacer>
            <v-alert
              class="mt-3"
              dense
              prominent
              color="warning"
              icon="mdi-cash-remove"
              dark
            >
              <v-row align="center">
                <v-col class="grow">
                  สลิปของท่านไม่ถูกต้อง
                </v-col>
                <v-col class="shrink" @click="gotoBilling()">
                  <v-btn small>อัพเดทสลิป</v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </template>
          <template v-if="lineOaStatus === 'True'">
            <v-spacer></v-spacer>
            <v-alert
              class="mt-3"
              dense
              prominent
              color="teal"
              icon="mdi-link-variant-remove"
              dark
            >
              <v-row align="center">
                <v-col class="grow">
                  บัญชีของท่านยังไม่ได้เชื่อมต่อ LINE OA
                </v-col>
                <v-col class="shrink" @click="gotoConnectLine()">
                  <v-btn small>เชื่อมต่อ</v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </template>
        </div>
      <v-spacer></v-spacer>
        <div  v-if="session.data.USER_ROLE === 'admin'"  class="progress-mobile d-block d-sm-none" :style="progressMobileStyle"  @click.stop="isOpenSetup = !isOpenSetup">
          <progress :value="progress" min="0" max="100" style="height:0;width:0;"></progress>
          <div class="progress-value-mobile">{{ progress }}%</div>
        </div>
        <v-card  v-if="session.data.USER_ROLE === 'admin'"  class="d-none d-sm-block" @click.stop="isOpenSetup = !isOpenSetup">
          <div class="d-flex flex-row p-1">
          <div class="col-3 p-0">
          <div class="progress-desktop" :style="progressDesktopStyle">
             <progress :value="progress" min="0" max="100" style="height:0;width:0;"></progress>
             <div class="progress-value">{{ progress }}%</div>
          </div>
           </div>
           <div class="d-flex flex-row justify-content-between align-items-center">
            <div>
              <span class="complete-span px-2">Complete Setup</span>
            </div>
            <div>
              <v-icon class="icon-setup">mdi-chevron-right </v-icon>
            </div>
           </div>
          </div>
        </v-card>
        <v-btn  v-if="session.data.USER_ROLE === 'user' || session.data.USER_ROLE === 'admin'" icon @click.stop="onOpenNoti">
         <div class="icon-with-badge">
         <v-icon color="white">mdi-bell</v-icon>
          <span :class="isNoti ? 'badge' :''"></span>
         </div>
      </v-btn>
      <v-avatar class="mr-3" @click="dialogLogOut = true">
        <v-img :src="session.data.shopImge ? session.data.shopImge : require('@/assets/LogoDefault.jpg')"></v-img>
      </v-avatar>
      <v-toolbar-title>{{ session.data.shopName }}</v-toolbar-title>
        <!-- <v-list-item-avatar>
          <v-img :src="session.data.shopImge"></v-img>
        </v-list-item-avatar>
        <v-list-item-content><strong style="color: white;">{{ session.data.shopName }}</strong></v-list-item-content> -->
    </v-app-bar>
    <v-navigation-drawer dark v-model="drawer" max-height="100%" fixed app>
      <v-list>
        <v-list-item>
          <v-col>
        <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FLogoBetask.svg?alt=media&token=d781ca7b-811f-45b0-a80c-caf0f60c3f41" max-width="70px"></v-img>
        <!-- <v-img :src="require('@/assets/LogoBetask.svg')" max-width="70px"></v-img> -->
          </v-col>
          <v-col>
        <v-img class="ml-1 mr-9" src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FGroupBetask.svg?alt=media&token=805907c9-d721-402a-9cec-1d5ed7ae31d5" max-width="80px"></v-img>
        <!-- <v-img class="ml-1 mr-9" :src="require('@/assets/GroupBetask.svg')" max-width="80px"></v-img> -->
          </v-col>
        </v-list-item>
      </v-list>
      <!-- <v-list>
        <v-list-item to="/Core/Home">
          <v-list-item-icon>
            <v-icon color="white">mdi-view-grid</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="menu-head">Dashboard</v-list-item-title>
        </v-list-item>
      </v-list> -->

      <v-list-group
      dense
      :value="DashboardValue"
      prepend-icon="mdi-shopping"
      color="white"
      no-action
      v-if="Dashboard.length > 0"
    >
    <template v-slot:activator>
        <v-list-item-title class="menu-head text-wrap">Dashboard</v-list-item-title>
      </template>

      <v-list-item
      dense
        v-for="(item, i) in Dashboard"
        :key="i"
        :to="item.to"
        router
        exact
        @click="clearTimeAll()"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon" dense  color="white"></v-icon>
        </v-list-item-icon>
        <v-list-item-title dense v-text="item.title"></v-list-item-title>
      </v-list-item>
    </v-list-group>

    <v-list-group
      dense
        :value="bookingValue"
        prepend-icon="mdi-notebook-edit"
        color="white"
        no-action
        v-if="booking.length > 0"
      >
      <template v-slot:activator>
        <v-list-item-title class="menu-head text-wrap">ระบบนัดหมาย</v-list-item-title>
      </template>

        <v-list-item
          v-for="(item, i) in booking"
          :key="i"
          :to="item.to"
          router
          exact
          dense
          @click="clearTimeAll()"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" dense  color="white"></v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-wrap" dense v-text="item.title"></v-list-item-title>
        </v-list-item>
    </v-list-group>

    <v-list-group
      dense
        :value="workflowValue"
        prepend-icon="mdi-toolbox "
        color="white"
        no-action
        v-if="workflow.length > 0"
      >
      <template v-slot:activator>
        <v-list-item-title class="menu-head">จัดการงานในศูนย์</v-list-item-title>
      </template>

        <v-list-item
          v-for="(item, i) in workflow"
          :key="i"
          :to="item.to"
          router
          exact
          dense
          @click="clearTimeAll()"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" dense  color="white"></v-icon>
          </v-list-item-icon>
          <v-list-item-title dense class="text-wrap" v-text="item.title"></v-list-item-title>
        </v-list-item>
    </v-list-group>

    <v-list-group
      dense
        :value="customerValue"
        prepend-icon="mdi-account-details"
        color="white"
        no-action
        v-if="customer.length > 0"
      >
      <template v-slot:activator>
        <v-list-item-title class="menu-head text-wrap">ข้อมูลลูกค้า</v-list-item-title>
      </template>

        <v-list-item
          v-for="(item, i) in customer"
          :key="i"
          :to="item.to"
          router
          exact
          dense
          @click="clearTimeAll()"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" dense  color="white"></v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-wrap" dense v-text="item.title"></v-list-item-title>
        </v-list-item>
    </v-list-group>

    <v-list-group
      dense
        :value="broadCastValue"
        prepend-icon="mdi-graph-outline"
        color="white"
        no-action
        v-if="broadCast.length > 0"
      >
      <template v-slot:activator>
          <v-list-item-title class="menu-head text-wrap">เครื่องมือการตลาด</v-list-item-title>
        </template>

        <v-list-item
          v-for="(item, i) in broadCast"
          :key="i"
          :to="item.to"
          router
          exact
          dense
          @click="clearTimeAll()"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" dense color="white"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="item.title" class="text-wrap" dense color="white"></v-list-item-title>
        </v-list-item>
      </v-list-group>

    <v-list-group
      dense
        :value="corporateValue"
        prepend-icon="mdi-domain"
        color="white"
        no-action
        v-if="corporate.length > 0"
      >
      <template v-slot:activator>
          <v-list-item-title class="menu-head text-wrap">ข้อมูลบริษัท</v-list-item-title>
        </template>

        <v-list-item
          v-for="(item, i) in corporate"
          :key="i"
          :to="item.to"
          router
          exact
          dense
          @click="clearTimeAll()"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" dense color="white"></v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-wrap" v-text="item.title" dense color="white"></v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-list-group
      dense
        :value="settingsValue"
        prepend-icon="mdi-cog-transfer-outline"
        color="white"
        no-action
        v-if="settings.length > 0"
      >
      <template v-slot:activator>
          <v-list-item-title class="menu-head text-wrap">ตั้งค่าระบบ</v-list-item-title>
        </template>

        <v-list-item
          v-for="(item, i) in settings"
          :key="i"
          :to="item.to"
          router
          exact
          dense
          @click="clearTimeAll()"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" dense color="white"></v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-wrap" v-text="item.title" dense color="white"></v-list-item-title>
        </v-list-item>
      </v-list-group>

        <v-list-group
          dense
            :value="true"
            prepend-icon="mdi-toolbox"
            color="white"
            no-action
            v-if="boardSide.length > 0"
          >
          <template v-slot:activator>
            <v-list-item-title class="menu-head text-wrap">จัดการงานในศูนย์</v-list-item-title>
          </template>

            <v-list-item
              v-for="(item, i) in boardSide"
              :key="i"
              :to="item.to"
              router
              exact
              dense
              @click="clearTimeAll()"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" dense  color="white"></v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-wrap" dense v-text="item.title"></v-list-item-title>
            </v-list-item>
        </v-list-group>

      <v-list-group
      dense
        :value="true"
        prepend-icon="mdi-cog-transfer-outline"
        color="white"
        no-action
        v-if="onsiteSide.length > 0"
      >
      <template v-slot:activator>
          <v-list-item-title class="menu-head text-wrap">ตั้งค่าระบบ</v-list-item-title>
        </template>

        <v-list-item
          v-for="(item, i) in onsiteSide"
          :key="i"
          :to="item.to"
          router
          exact
          dense
          @click="clearTimeAll()"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" dense color="white"></v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-wrap" v-text="item.title" dense color="white"></v-list-item-title>
        </v-list-item>
      </v-list-group>
      <v-list-group
        v-if="session.data.USER_ROLE === 'admin' && packagePlan.length > 0"
        dense
        :value="packagePlanValue"
        prepend-icon="mdi-cash-check"
        color="white"
        no-action
      >
      <template v-slot:activator>
          <v-list-item-title class="menu-head text-wrap">My subscription</v-list-item-title>
        </template>

        <v-list-item
          v-for="(item, i) in packagePlan"
          :key="i"
          router
          exact
          dense
          @click="clearTimeAll(), gotoBilling()"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" dense color="white"></v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-wrap" v-text="item.title" dense color="white"></v-list-item-title>
        </v-list-item>
      </v-list-group>
      <template v-slot:append>
        <v-divider class="ma-0"></v-divider>
        <v-btn block
            text
            tile
            dark
            v-if="session.data.USER_ROLE === 'admin'"
            class="nav-button-dark"
            @click.prevent="$router.push('/LoyaltyPresent')">
            <v-icon color="white">mdi-gift-open</v-icon>&nbsp;&nbsp;Be-Loyalty
          </v-btn>
        <!-- <v-divider class="ma-0"></v-divider>
        <v-btn block
            text
            tile
            v-if="session.data.USER_ROLE === 'admin'"
            dark
            class="nav-button-dark"
            @click.prevent="chkPlan(), dialogCash = true">
            <v-icon color="white">mdi-briefcase-edit-outline</v-icon>&nbsp;&nbsp;จัดการแพคเกจ
          </v-btn> -->
        <v-divider class="ma-0"></v-divider>
          <v-btn block
            text
            tile
            dark
            class="nav-button-dark"
            @click.prevent="logout()">
            <v-icon color="white">mdi-logout</v-icon>&nbsp;&nbsp;ออกจากระบบ
          </v-btn>
      </template>
      <v-dialog
      v-model="dialogCash"
      persistent
      max-width="80%"
    >
      <v-card>
        <v-card-title class="text-h5">
          Be-Linked billing plans
        </v-card-title>
        <v-card-text>
          <div class="text-right plan_button">
            <v-btn
              rounded
              color="error"
              dark
              @click="dialogCancel = true"
            >
              ยกเลิกแผนการชำระเงิน
            </v-btn>
            <v-btn
              class="mx-2"
              fab
              dark
              small
              outlined
              @click="dialogCash = false"
              color="red"
            >
              <v-icon dark>
                mdi-close
              </v-icon>
            </v-btn>
          </div>
        </v-card-text>
        <v-card-text v-if="dataReadyGet">
          <v-row>
            <v-col col="6" v-for="(item, index) in dataPackage" :key="index">
              <v-container>
                <v-card>
                  <v-row>
                  <v-col col="12">
                    <v-list two-line>
                      <v-list-item  v-for="(items, index) in item.description" :key="index">
                        <v-list-item-icon>
                          <v-icon dark>
                            {{items.icon}}
                          </v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title>{{items.title}}</v-list-item-title>
                          <v-list-item-subtitle class="feature_detail">{{items.subtitle}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  </v-row>
                  <div v-if="dataBilling !== item.id" class="text-center plan_button">
                    <v-btn
                      rounded
                      color="primary"
                      dark
                      @click="billingPlan(item)"
                    >
                      เปลี่ยนแพลน
                    </v-btn>
                  </div>
                  <div v-if="dataBilling === item.id" class="text-center plan_button">
                    <v-btn
                      rounded
                      outlined
                      color="teal"
                      dark
                    >
                      แพลนปัจจุบัน
                    </v-btn>
                  </div>
                </v-card>
              </v-container>
            </v-col>
          </v-row>
          <div class="text-right plan_button">
            <v-btn
              rounded
              color="error"
              dark
              @click="dialogCash = false"
            >
              ปิด
            </v-btn>
          </div>
        </v-card-text>
        <v-card-text v-if="!dataReadyGet">
          <div class="text-center">
              <waitingAlert></waitingAlert>
            </div>
        </v-card-text>
      </v-card>
    </v-dialog>
      <v-dialog
      v-model="dialogCondition"
      persistent
      max-width="70%"
    >
      <v-card>
        <v-card-title class="text-h5">
          คุณต้องการเปลี่ยน แผนการจ่ายเงินหรือไม่
        </v-card-title>
        <v-card-text>
          <h6>รายละเอียด แผนการจ่ายเงินที่จะเปล่ี่ยน</h6>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-list two-line>
                  <v-list-item  v-for="(items, index) in dataCondition.description" :key="index">
                    <v-list-item-icon>
                      <v-icon dark>
                        {{items.icon}}
                      </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{items.title}}</v-list-item-title>
                      <v-list-item-subtitle class="feature_detail">{{items.subtitle}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
            <v-row v-if="dataReady">
              <v-col cols="12" class="pb-0">
                <v-row>
                  <v-checkbox
                    false-value="ไม่ยอมรับ"
                    true-value="ยอมรับ"
                    v-model="checkCondition"
                    hide-details
                    class="shrink ml-6 mr-0 mt-0 mb-6"
                  ></v-checkbox>
                  <v-text-field v-model="checkCondition" dense outlined readonly label="ท่านยอมรับเงื่อนไข และค่าใช้จ่ายในการเปลี่ยนแผน หรือไม่"></v-text-field>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-0">
                <div class="text-center">
                  <v-alert
                    outlined
                    type="warning"
                  >* บริษัทจะไม่มีการคืนเงินในทุกกรณี *</v-alert>
                </div>
              </v-col>
              <v-col cols="12" class="pb-0">
                <div class="text-center">
                  <v-btn
                    rounded
                    color="primary"
                    dark
                    @click="submitBillingPlan(dataCondition)"
                  >
                    ยืนยันรายการนี้
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <div class="text-center" v-if="!dataReady">
              <waitingAlert></waitingAlert>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    </v-navigation-drawer>
    <v-snackbar
      v-model="snackbarSchedule"
      shaped
      top
      right
      color="warning"
      outlined
      timeout="60000"
    >
       {{ textSchedule }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          fab
          dark
          x-small
          outlined
          v-bind="attrs"
          @click="snackbarSchedule = false"
        >
          <v-icon dark>
            mdi-close-circle
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog
      v-model="dialogCancel"
      persistent
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          ยกเลิกแผนการชำระเงิน
        </v-card-title>
        <v-card-text>ต้องการ ยกเลิกแผนการชำระเงิน ใช่หรือไม่?</v-card-text>
        <!-- <v-card-text class="text-red">* บริษัทจะไม่มีการคืนเงินในกรณีใดๆทั้งสิ้น *</v-card-text> -->
        <v-alert
          outlined
          type="warning"
        >* บริษัทจะไม่มีการคืนเงินในทุกกรณี *</v-alert>
        <v-card-actions v-if="dataReadyCancel">
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="red darken-1"
            @click="dialogCancel = false"
          >
            ตรวจสอบอีกครั้ง
          </v-btn>
          <v-btn
            dark
            color="green darken-1"
            @click="cancelPlan()"
          >
            ยกเลิกแผนการชำระเงิน
          </v-btn>
        </v-card-actions>
        <div class="text-center" v-if="!dataReadyCancel">
          <waitingAlert></waitingAlert>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogLogOut"
    >
      <v-card>
        <v-card-title>
          ออกจากระบบ
        </v-card-title>
        <v-card-text>ต้องการ ออกจากระบบ ใช่หรือไม่?</v-card-text>
        <v-card-actions>
          <v-btn
            text
            tile
            dark
            class="nav-button-dark"
            @click.prevent="logout()">
            <v-icon color="white">mdi-logout</v-icon>&nbsp;&nbsp;ออกจากระบบ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
     <SidebarNoti v-if="session.data.USER_ROLE === 'user' || this.$session.getAll().data.USER_ROLE === 'admin'"  :isOpen="isOpenNoti" :closeDrawer="closeDrawer" :listDataUnread="listDataUnread" :listDataReaded="listDataReaded" :taps="dataTapSidebarNoti" :onClickReadedNoti="onClickReadedNoti"/>
     <SidebarSetupGuide v-if="session.data.USER_ROLE === 'user' || this.$session.getAll().data.USER_ROLE === 'admin'"  :isOpen="isOpenSetup" :closeDrawer="closeSetup" :shopName="session.data.shopName" :progress="progress" :setup="dataSetupGuide" :updateSetUp="updateSetUp" :onClickComplete="onClickComplete"/>
     <Dialogfinish v-if="session.data.USER_ROLE === 'user' || this.$session.getAll().data.USER_ROLE === 'admin'"  :shopName="session.data.shopName" :isOpenCompleted="isOpenCompleted" :closeCompleted="closeCompleted" :url="linkUrlLine"/>
  </div>
</template>

<script>
import axios from 'axios' // api
import moment from 'moment-timezone'
import waitingAlert from './waitingAlert.vue'
import { SidebarNoti, SidebarSetupGuide, Dialogfinish } from './SetupGuide/index'
export default {
  components: {
    waitingAlert,
    SidebarNoti,
    SidebarSetupGuide,
    Dialogfinish
  },
  data () {
    return {
      dialogLogOut: false,
      title: 'Be-Linked',
      dataReadyCancel: true,
      dataReady: true,
      dataReadyGet: true,
      drawer: true,
      mini: false,
      session: this.$session.getAll(),
      onsiteSide: [],
      boardSide: [],
      workflow: [],
      master: [],
      corporate: [],
      settings: [],
      customer: [],
      booking: [],
      broadCast: [],
      items: [],
      Dashboard: [],
      dataPackage: [],
      packagePlan: [
        { title: 'Billing information', icon: 'mdi-cash-register', to: '/BillingPlan', type: 'packagePlan' }
      ],
      dialogCancel: false,
      dialogCondition: false,
      dataCondition: [],
      dialogCash: false,
      btFree: false,
      btBilling: false,
      checkCondition: 'ไม่ยอมรับ',
      billingCustomerId: '',
      chkDateSchedule: '',
      snackbarSchedule: false,
      textSchedule: '',
      dataBilling: '',
      workflowValue: false,
      corporateValue: false,
      settingsValue: false,
      customerValue: false,
      bookingValue: false,
      broadCastValue: false,
      DashboardValue: false,
      packagePlanValue: false,
      paymentStatus: '',
      dateCheckBill: '',
      lineOaStatus: 'False',
      isOpenNoti: false,
      progress: 0,
      isOpenSetup: false,
      dataSetupGuide: [],
      isOpenCompleted: false,
      isNewShop: false,
      isNoti: false,
      listDataUnread: [],
      listDataReaded: [],
      dataLineConfig: {},
      dataTapSidebarNoti: [ { key: 'appointment', icon: 'mdi-calendar-month-outline', label: 'Appointment' }, { key: 'news', icon: 'mdi-newspaper', label: 'News' } ]
    }
  },
  // beforeCreate () {
  //   console.log(this.$route.query)
  //   if (!this.$session.exists()) {
  //     this.$router.push('/Core/Login?' + this.$route.query)
  //   }
  // },
  computed: {
    progressDesktopStyle () {
      return `background: radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(#1B437C ${this.progress ? this.progress : 0}%, #E3E6E9 0)`
    },
    progressDesktopAfterStyle () {
      return `
      content: '${this.progress}%';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #1B437C;
      font-weight: bold;
      font-size: 14px;`
    },
    progressMobileStyle () {
      return `background: radial-gradient(closest-side, #1B437C 79%, transparent 80% 100%), conic-gradient(#E3E6E9 ${this.progress ? this.progress : 0}%, #A4C3E3 0);`
    },
    linkUrlLine () {
      if (this.$session.getAll().data.timeSlotStatus === 'True') {
        return `https://liff.line.me/${this.dataLineConfig.liffBookingFormEmpID}?shopId=${this.$session.getAll().data.shopId}`
      } else {
        return `https://liff.line.me/${this.dataLineConfig.liffBookingFormID}?shopId=${this.$session.getAll().data.shopId}`
      }
    }
  },
  async mounted () {
    document.addEventListener('click', this.closeDrawerOnClickOutside)
    if (this.$session.getAll().data.shopActive === 'inactive') {
      this.$router.push('/Core/Login')
    } else {
      this.dataLineConfig = await this.getDataLineConfig(this.$session.getAll().data.shopId)
      this.getFirestore()
      await this.getShopSetUp()
      this.getShop()
      this.checkImageUrl(this.session.data.shopImge)
        .then(async (status) => {
          console.log('status', status)
          if (status === false) {
            this.checkAndUpdateImg()
          }
        })
        .catch((error) => {
          console.log('status error', error)
          this.checkAndUpdateImg()
        })

      if (this.$session.getAll().data.shopId.includes('SD_')) {
        await this.chkConnectLineOa()
      } else {
        this.lineOaStatus = 'False'
      }
      // console.log('DD', parseInt(moment().format('DD')))
      // this.dateCheckBill = '2023-01'
      this.dateCheckBill = moment().format('YYYY-MM')
      // if (parseInt(moment().format('DD')) <= 7) {
      //   this.chkPlan()
      // } else {
      //   this.paymentStatus = 'fix'
      // }
      let trialsVersionDate = this.$session.getAll().data.trialsVersionDate || ''
      let billingEndDate = this.$session.getAll().data.billingEndDate || ''
      if (trialsVersionDate === '' || moment().format('YYYY-MM-DD HH:mm') > trialsVersionDate) {
        if (parseInt(moment().format('DD')) <= 7) {
          if (billingEndDate === '') {
            this.chkPlan()
          } else {
            console.log(moment().format('YYYY-MM-DD'), billingEndDate)
            if (moment().format('YYYY-MM-DD') > billingEndDate) {
              this.chkPlan()
            }
          }
        } else {
          if (moment().format('YYYY-MM-DD') > billingEndDate) {
            this.chkPlan()
          }
        }
      }
      this.billingCustomerId = this.session.data.billingCustomerId || ''
      // this.$root.$refs.BoardControl.closeSetTime()
      this.$root.$emit('closeSetTime')
      this.$root.$emit('closeSetTimeGetCalenda')
      this.$root.$emit('closeSetTimeBookingMonitor')
      this.$root.$emit('closeSetTimeBookingListQueue')
      this.items = []
      if (this.session.data.USER_ROLE === 'onsite') {
        this.onsite()
      } else if (this.session.data.USER_ROLE === 'board') {
        this.board()
      } else if (this.session.data.USER_ROLE === 'booking') {
        this.bookingChk()
      } else if (this.session.data.USER_ROLE === 'storeFront') {
        this.storeFrontChk()
      } else {
        this.adminChk()
      }
      this.$OmiseCard.configure({
        publicKey: this.$omise_public_key
      })
      if (this.chkDateSchedule === '' || this.chkDateSchedule !== moment(moment(new Date(), 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')) {
        this.chkSchedule()
      }
    }
  },
  beforeDestroy () {
    // ลบการจัดการคลิกไปยังพื้นหลังหน้าเมื่อคอมโพนентถูกทำลาย
    document.removeEventListener('click', this.closeDrawerOnClickOutside)
  },
  methods: {
    async getShop () {
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.session.data.shopId)
        .then(response => {
          let rs = response.data
          console.log(rs, this.session.data.shopId)
          if (rs.status === false) {
            this.logout()
          } else {
            if (rs[0].shopActive === 'inactive') {
              this.logout()
            }
          }
        })
    },
    checkImageUrl (url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(true) // รูปภาพโหลดสำเร็จ
        // eslint-disable-next-line prefer-promise-reject-errors
        img.onerror = () => reject(false) // ไม่สามารถโหลดรูปภาพ

        img.src = url // ตั้งค่า URL ของรูปภาพ
      })
    },
    async checkAndUpdateImg () {
      const url = `${this.DNS_IP}/line/getOa`
      const config = {
        headers: {
          'botId': this.session.data.shopId
        }
      }
      await axios.get(url, config).then((response) => {
        let rs = response.data
        if (rs.pictureUrl !== undefined) {
          const item = {
            shopImge: rs.pictureUrl
          }
          axios
            .post(this.DNS_IP + '/sys_shop/edit/' + this.session.data.shopId, item)
            .then(async response => {
              console.log('/sys_shop/edit/', response)
              let session = JSON.parse(localStorage.getItem('sessionData'))
              session.shopImge = rs.pictureUrl
              this.$session.start()
              this.$session.set('data', session)
              localStorage.clear()
              localStorage.setItem('sessionData', JSON.stringify(session))
            })
            .catch((err) => { console.log('error', err) })
        }
      }).catch((error) => {
        console.log('error', error)
      })
    },
    gotoBilling () {
      // this.$router.push('/BillingPlan')
      if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
        if (JSON.parse(localStorage.getItem('sessionData')).shopId) {
          this.$session.start()
          this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
          window.location.href = 'https://liff.line.me/1660658626-Qn8zej1p'
          // this.$router.push('/BillingPlan')
        } else {
          this.$router.push('/Core/Login')
        }
      } else {
        if (!this.$session.exists()) {
          this.$router.push('/Core/Login')
        } else {
          if (this.$session.getAll().data.shopId) {
            localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
            window.location.href = 'https://liff.line.me/1660658626-Qn8zej1p'
            // this.$router.push('/BillingPlan')
          } else {
            this.$router.push('/Core/Login')
          }
        }
      }
    },
    gotoConnectLine () {
      this.$swal({
        title: 'หากท่านต้องการเชื่อมต่อ LINE OA ระบบจะนำท่านไปยังหน้าเชื่อมต่อ และ เข้าสู่ระบบอีกครั้ง',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          console.log('result', result)
          if (result) {
            window.open('https://betask-linked.web.app/CreateLineOAaccount?shopId=' + this.$session.getAll().data.shopId, '_blank').focus()
            this.$router.push('/Core/Login')
          }
        }).catch(error => {
          console.log('error function editDataGlobal : ', error)
        })
      // window.open('https://betask-linked.web.app/CreateLineOAaccount?shopId=' + this.$session.getAll().data.shopId, '_blank').focus()
    },
    async chkConnectLineOa () {
      this.lineOaStatus = 'False'
      await axios
        .get(
          this.DNS_IP +
              '/lineconfig/get?shopId=' +
              this.$session.getAll().data.shopId
        )
        .then(async (response) => {
          let rs = response.data
          console.log('chkConnectLineOa', rs)
          if (rs.status === false) {
            this.lineOaStatus = 'True'
          } else {
            this.lineOaStatus = 'False'
          }
        }).catch((error) => {
          console.log(error)
          this.lineOaStatus = 'False'
        })
    },
    async chkPlan () {
      await axios
        .get(
          this.DNS_IP +
              '/system_shop_Payment/get?shopId=' +
              this.$session.getAll().data.shopId +
              '&paymentDate=' + this.dateCheckBill
        )
        .then(async (response) => {
          let rs = response.data
          if (rs.status === false) {
            this.paymentStatus = 'noCash'
          } else {
            this.paymentStatus = rs[0].paymentStatus
          }
        })
    },
    clearTimeAll () {
      console.log('clear all')
      this.$root.$emit('closeSetTime')
      this.$root.$emit('closeSetTimeGetCalenda')
      this.$root.$emit('closeSetTimeBookingMonitor')
      this.$root.$emit('closeSetTimeBookingListQueue')
    },
    logout () {
      this.$session.destroy()
      this.$session.clear()
      localStorage.clear()
      this.$router.push('/Core/Login')
    },
    adminChk () {
      this.workflowValue = false
      this.corporateValue = false
      this.settingsValue = false
      this.customerValue = false
      this.bookingValue = false
      this.broadCastValue = false
      this.DashboardValue = false
      this.master = []
      this.customer = [
        { title: 'ข้อมูลลงทะเบียนลูกค้า', icon: 'mdi-account-plus', to: '/System/ListMember', type: 'customer' },
        { title: 'ข้อมูลคะแนนบริการ', icon: 'mdi-star-check', to: '/Master/Rating', type: 'customer' }
      ]
      if (this.session.data.shopId === 'U9084920b3005bd1dcb57af1ae6bdba32' || this.session.data.shopId === 'U951aaccf8b715308c8af44068f511fb0') {
        this.booking = [
          { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingField', type: 'booking' },
          // { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingLink', type: 'booking' },
          { title: 'รายชื่อลูกค้านัดหมาย', icon: 'mdi-account-edit', to: '/Master/BookingList', type: 'booking' },
          // { title: '(Onsite)รายชื่อลูกค้านัดหมาย', icon: 'mdi-car-shift-pattern', to: '/Master/BookingListOnsite', type: 'booking' },
          { title: 'ปฏิทินนัดหมาย', icon: 'mdi-calendar-search', to: '/Master/CalendarBooking', type: 'booking' }
        ]
        this.Dashboard = [
          { title: 'นัดหมายเข้ารับบริการ', icon: 'mdi-clipboard-check-multiple-outline', to: '/Dashbord/ReportBooking', type: 'Dashboard' },
          { title: 'งานในศูนย์', icon: 'mdi-cog-transfer', to: '/Dashbord/Report', type: 'Dashboard' }
          // { title: 'ReportFRT', icon: 'mdi-account-clock-outline', to: '/Dashbord/ReportFRT', type: 'Dashboard' },
          // { title: 'ReportEmp', icon: 'mdi-account-clock-outline', to: '/Dashbord/ReportEmpMain', type: 'Dashboard' }
          // { title: 'Performance', icon: 'mdi-application-settings', to: '/Dashbord/Performance', type: 'Dashboard' }
        ]
        if (this.$session.getAll().data.USER_ROLE === 'admin' || this.$session.getAll().data.USER_ROLE === 'user') {
          if (this.$session.getAll().data.showOnsite === 'แสดง') {
            this.Dashboard.push(
              { title: 'ปฏิทิน', icon: 'mdi-calendar', to: '/Onsite/OnsiteCalendarGrid', type: 'customer' }
            )
          }
        }
        this.workflow = [
          { title: 'กระดานการทำงาน', icon: 'mdi-clipboard-check-multiple-outline', to: '/Master/BoardControl', type: 'workflow' }
        ]
      } else {
        if (this.$session.getAll().data.timeSlotStatus === 'True') {
          this.booking = [
            { title: 'จัดการลิ้งค์', icon: 'mdi-link-variant', to: '/Master/ManageLink', type: 'booking' },
            // { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingLink', type: 'booking' },
            { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingField', type: 'booking' },
            { title: 'รายชื่อลูกค้านัดหมาย', icon: 'mdi-account-edit', to: '/Master/BookingListBeautyEmp', type: 'booking' },
            { title: 'ปฏิทินนัดหมาย', icon: 'mdi-calendar-search', to: '/Master/CalendarBooking', type: 'booking' },
            { title: 'จัดการเวลานัดหมาย', icon: 'mdi-table-edit', to: '/Master/BookingWalkinEmp', type: 'booking' }
          ]
          if (this.$session.getAll().data.billingPlan === '1' || this.$session.getAll().data.billingPlan === '2') {
            if (this.$session.getAll().data.shopId === 'U1b8d05a22f9ca1b2744f352cc64f14e4' || this.$session.getAll().data.shopId === 'SD_1659673973416') {
              this.workflow = [
                { title: 'กระดานการทำงาน', icon: 'mdi-clipboard-check-multiple-outline', to: '/Master/BoardControlBeauty', type: 'workflow' }
              ]
            } else {
              this.workflow = []
            }
          } else {
            this.workflow = [
              { title: 'กระดานการทำงาน', icon: 'mdi-clipboard-check-multiple-outline', to: '/Master/BoardControlBeauty', type: 'workflow' }
            ]
          }
        } else {
          if (this.$session.getAll().data.shopId === 'Ue9f527da07ff2da05246ea3f62671493') {
            this.booking = [
              { title: 'จัดการลิ้งค์', icon: 'mdi-link-variant', to: '/Master/ManageLink', type: 'booking' },
              // { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingLink', type: 'booking' },
              { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingField', type: 'booking' },
              { title: 'รายชื่อลูกค้านัดหมาย', icon: 'mdi-account-edit', to: '/Master/BookingListBeauty', type: 'booking' },
              { title: 'ปฏิทินนัดหมาย', icon: 'mdi-calendar-search', to: '/Master/CalendarBooking', type: 'booking' },
              { title: 'จัดการเวลานัดหมาย', icon: 'mdi-table-edit', to: '/Master/BookingWalkin', type: 'booking' },
              { title: 'จัดการคิวหน้าร้าน', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueue', type: 'booking' },
              { title: 'แสดงผลคิวหน้าร้าน วิดีโอ', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoringVideoOhrich', type: 'booking' }
            ]
          } else {
            if (this.$session.getAll().data.shopId === 'Uc19ef99d9acdaab02f0e995b7e8221c6') {
              this.booking = [
                { title: 'จัดการลิ้งค์', icon: 'mdi-link-variant', to: '/Master/ManageLink', type: 'booking' },
                // { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingLink', type: 'booking' },
                { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingField', type: 'booking' },
                { title: 'รายชื่อลูกค้านัดหมาย', icon: 'mdi-account-edit', to: '/Master/BookingListBeauty', type: 'booking' },
                { title: 'ปฏิทินนัดหมาย', icon: 'mdi-calendar-search', to: '/Master/CalendarBooking', type: 'booking' },
                { title: 'จัดการเวลานัดหมาย', icon: 'mdi-table-edit', to: '/Master/BookingWalkin', type: 'booking' },
                { title: 'จัดการคิวหน้าร้าน', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueue', type: 'booking' },
                { title: 'แสดงผลคิวหน้าร้าน', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoring', type: 'booking' },
                { title: 'แสดงผลคิวหน้าร้าน วิดีโอ', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoringVideo', type: 'booking' }
              ]
            } else if (this.$session.getAll().data.shopId === 'Ue26280cb7c25119d75055cd07391b5e8') {
              this.booking = [
                { title: 'จัดการลิ้งค์', icon: 'mdi-link-variant', to: '/Master/ManageLink', type: 'booking' },
                // { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingLink', type: 'booking' },
                { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingField', type: 'booking' },
                { title: 'รายชื่อลูกค้านัดหมาย', icon: 'mdi-account-edit', to: '/Master/BookingListBeauty', type: 'booking' },
                { title: 'ปฏิทินนัดหมาย', icon: 'mdi-calendar-search', to: '/Master/CalendarBooking', type: 'booking' },
                { title: 'จัดการเวลานัดหมาย', icon: 'mdi-table-edit', to: '/Master/BookingWalkin', type: 'booking' },
                { title: 'จัดการคิวหน้าร้าน', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueue', type: 'booking' },
                { title: 'แสดงผลคิวหน้าร้าน', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoring', type: 'booking' },
                { title: 'แสดงผลคิวหน้าร้าน วิดีโอ', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoringVideoEventCat', type: 'booking' }
              ]
            } else if (this.$session.getAll().data.shopId === 'Ubb80127ad92f4b69686a9a5a7aabd463') {
              this.booking = [
                { title: 'จัดการลิ้งค์', icon: 'mdi-link-variant', to: '/Master/ManageLink', type: 'booking' },
                // { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingLink', type: 'booking' },
                { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingField', type: 'booking' },
                { title: 'รายชื่อลูกค้านัดหมาย', icon: 'mdi-account-edit', to: '/Master/BookingListBeauty', type: 'booking' },
                { title: 'ปฏิทินนัดหมาย', icon: 'mdi-calendar-search', to: '/Master/CalendarBooking', type: 'booking' },
                { title: 'จัดการเวลานัดหมาย', icon: 'mdi-table-edit', to: '/Master/BookingWalkin', type: 'booking' },
                { title: 'จัดการคิวหน้าร้าน', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueue', type: 'booking' },
                { title: 'แสดงผลคิวหน้าร้าน', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoring', type: 'booking' },
                { title: 'แสดงผลคิวหน้าร้าน วิดีโอ', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoringVideoNew', type: 'booking' }
              ]
            } else if (this.$session.getAll().data.shopId === this.shopNameData.airmate) {
              this.booking = [
                { title: 'จัดการลิ้งค์', icon: 'mdi-link-variant', to: '/Master/ManageLink', type: 'booking' },
                // { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingLink', type: 'booking' },
                { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingField', type: 'booking' },
                { title: 'รายชื่อลูกค้านัดหมาย', icon: 'mdi-account-edit', to: '/Master/BookingListBeauty', type: 'booking' },
                { title: 'ตรวจสอบรายการนัดหมาย', icon: 'mdi-briefcase-check', to: '/Master/BookingJob', type: 'booking' },
                { title: 'ปฏิทินนัดหมาย', icon: 'mdi-calendar-search', to: '/Master/CalendarBooking', type: 'booking' },
                { title: 'จัดการเวลานัดหมาย', icon: 'mdi-table-edit', to: '/Master/BookingWalkin', type: 'booking' },
                { title: 'จัดการคิวหน้าร้าน', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueue', type: 'booking' },
                { title: 'แสดงผลคิวหน้าร้าน', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoring', type: 'booking' },
                { title: 'แสดงผลคิวหน้าร้าน วิดีโอ', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoringVideoNew', type: 'booking' }
              ]
            } else {
              this.booking = [
                { title: 'จัดการลิ้งค์', icon: 'mdi-link-variant', to: '/Master/ManageLink', type: 'booking' },
                // { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingLink', type: 'booking' },
                { title: 'หน้านัดหมาย', icon: 'mdi-application-settings', to: '/Master/BookingField', type: 'booking' },
                { title: 'รายชื่อลูกค้านัดหมาย', icon: 'mdi-account-edit', to: '/Master/BookingListBeauty', type: 'booking' },
                { title: 'ปฏิทินนัดหมาย', icon: 'mdi-calendar-search', to: '/Master/CalendarBooking', type: 'booking' },
                { title: 'จัดการเวลานัดหมาย', icon: 'mdi-table-edit', to: '/Master/BookingWalkin', type: 'booking' },
                { title: 'จัดการคิวหน้าร้าน', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueue', type: 'booking' },
                // { title: 'จัดการคิวหน้าร้านทั้งหมด', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueuePanel', type: 'booking' },
                { title: 'แสดงผลคิวหน้าร้าน', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoring', type: 'booking' },
                { title: 'แสดงผลคิวหน้าร้าน วิดีโอ', icon: 'mdi-monitor-eye', to: '/Master/BookingListQueueMonitoringVideoNew', type: 'booking' }
              ]
            }
          }
          if (this.$session.getAll().data.billingPlan === '1' || this.$session.getAll().data.billingPlan === '2') {
            if (this.$session.getAll().data.shopId === 'U1b8d05a22f9ca1b2744f352cc64f14e4') {
              this.workflow = [
                { title: 'กระดานการทำงาน', icon: 'mdi-clipboard-check-multiple-outline', to: '/Master/BoardControlBeauty', type: 'workflow' }
              ]
            } else {
              this.workflow = []
            }
          } else {
            this.workflow = [
              { title: 'กระดานการทำงาน', icon: 'mdi-clipboard-check-multiple-outline', to: '/Master/BoardControlBeauty', type: 'workflow' }
            ]
          }
        }
        this.Dashboard = [
          { title: 'นัดหมายเข้ารับบริการ', icon: 'mdi-clipboard-check-multiple-outline', to: '/Dashbord/ReportBooking', type: 'Dashboard' }
          // { title: 'งานในศูนย์', icon: 'mdi-cog-transfer', to: '/Dashbord/Report', type: 'Dashboard' }
          // { title: 'ReportFRT', icon: 'mdi-account-clock-outline', to: '/Dashbord/ReportFRT', type: 'Dashboard' },
          // { title: 'ReportEmp', icon: 'mdi-account-clock-outline', to: '/Dashbord/ReportEmpMain', type: 'Dashboard' }
          // { title: 'Performance', icon: 'mdi-application-settings', to: '/Dashbord/Performance', type: 'Dashboard' }
        ]
        if (this.$session.getAll().data.category === '7') {
          this.Dashboard.push(
            { title: 'งานในศูนย์', icon: 'mdi-cog-transfer', to: '/Dashbord/Report', type: 'Dashboard' }
          )
        }
        // console.log('this.$session.getAll().data', this.$session.getAll().data.category)
        if (this.$session.getAll().data.USER_ROLE === 'admin' || this.$session.getAll().data.USER_ROLE === 'user') {
          if (this.$session.getAll().data.showOnsite === 'แสดง') {
            this.Dashboard.push(
              { title: 'ปฏิทิน', icon: 'mdi-calendar', to: '/Onsite/OnsiteCalendarGrid', type: 'customer' }
            )
          }
        }
      }
      if (this.$session.getAll().data.USER_ROLE === 'admin') {
        this.corporate = [
          { title: 'สาขา', icon: 'mdi-home-group', to: '/Master/Branch', type: 'corporate' },
          { title: 'พนักงาน', icon: 'mdi-account-multiple', to: '/Master/Employee', type: 'corporate' },
          { title: 'บริการเสริม', icon: 'mdi-atom-variant', to: '/Master/ServiceType', type: 'corporate' },
          { title: 'ช่องทางการชำระเงิน', icon: 'mdi-credit-card-outline', to: '/Master/PaymentType', type: 'corporate' },
          { title: 'จัดการบริษัท', icon: 'mdi-home-city', to: '/System/EditShop', type: 'corporate' },
          { title: 'สมัครและจัดการยูเซอร์', icon: 'mdi-account-circle', to: '/System/ManageUser', type: 'corporate' }
          // { title: 'พิมพ์ใบเสร็จ', icon: 'mdi-printer-search', to: '/PrintPdf/PrintInvoice', type: 'corporate' }
        ]
        this.broadCast = []
        // this.broadCast = [
        //   { title: 'กลุ่มเป้าหมาย', icon: 'mdi-account-group', to: '/BroadCast/Audience', type: 'broadCast' },
        //   { title: 'บรอดแคสต์', icon: 'mdi-bullhorn', to: '/BroadCast/BroadCast', type: 'broadCast' }
        // ]
        if (this.$session.getAll().data.timeSlotStatus === 'True') {
          if (this.$session.getAll().data.billingPlan === '1' || this.$session.getAll().data.billingPlan === '2') {
            if (this.$session.getAll().data.shopId === 'U1b8d05a22f9ca1b2744f352cc64f14e4' || this.$session.getAll().data.shopId === 'SD_1659673973416') {
              this.settings = [
              // { title: 'จัดการข้อมูลนัดหมาย', icon: 'mdi-book-cog-outline', to: '/Master/BookingField', type: 'settings' },
                { title: 'ตั้งค่าการแจ้งเตือน', icon: 'mdi-bell-ring', to: '/Master/NoticeManagement', type: 'settings' },
                { title: 'จัดการ บริการ', icon: 'mdi-transit-connection-variant', to: '/Master/Flow', type: 'settings' },
                { title: 'จัดโครงสร้างกระดาน', icon: 'mdi-view-dashboard', to: '/Master/WorkShop', type: 'settings' },
                { title: 'จัดการ ช่องกรอกข้อมูล', icon: 'mdi-account-edit', to: '/Master/CustomField', type: 'settings' },
                { title: 'จัดการ Tag', icon: 'mdi-wrench', to: '/Master/SettingTag', type: 'settings' },
                { title: 'จัดการ Notify', icon: 'mdi-bell-plus', to: '/Master/SettingLineNotify', type: 'settings' },
                { title: 'ตั้งค่ารับการแจ้งเตือนอัตโนมัติ', icon: 'mdi-access-point', to: '/System/LINEConfigSendMessage', type: 'settings' },
                { title: 'ตั้งค่าแบบสอบถาม', icon: 'mdi-star', to: '/Rating/RatingAnswer', type: 'settings' },
                { title: 'ตั้งค่ากำหนดจำนวนวันส่งข้อความ', icon: 'mdi-mail', to: '/Message/StepMessage', type: 'settings' }
              ]
            } else {
              this.settings = [
                // { title: 'จัดการข้อมูลนัดหมาย', icon: 'mdi-book-cog-outline', to: '/Master/BookingField', type: 'settings' },
                { title: 'ตั้งค่าการแจ้งเตือน', icon: 'mdi-bell-ring', to: '/Master/NoticeManagement', type: 'settings' },
                { title: 'จัดการ บริการ', icon: 'mdi-transit-connection-variant', to: '/Master/Flow', type: 'settings' },
                { title: 'จัดการ ช่องกรอกข้อมูล', icon: 'mdi-account-edit', to: '/Master/CustomField', type: 'settings' },
                { title: 'จัดการ Tag', icon: 'mdi-wrench', to: '/Master/SettingTag', type: 'settings' },
                { title: 'จัดการ Notify', icon: 'mdi-bell-plus', to: '/Master/SettingLineNotify', type: 'settings' },
                { title: 'ตั้งค่ารับการแจ้งเตือนอัตโนมัติ', icon: 'mdi-access-point', to: '/System/LINEConfigSendMessage', type: 'settings' },
                { title: 'ตั้งค่าแบบสอบถาม', icon: 'mdi-star', to: '/Rating/RatingAnswer', type: 'settings' },
                { title: 'ตั้งค่ากำหนดจำนวนวันส่งข้อความ', icon: 'mdi-mail', to: '/Message/StepMessage', type: 'settings' }
              ]
            }
          } else {
            this.settings = [
              // { title: 'จัดการข้อมูลนัดหมาย', icon: 'mdi-book-cog-outline', to: '/Master/BookingField', type: 'settings' },
              { title: 'ตั้งค่าการแจ้งเตือน', icon: 'mdi-bell-ring', to: '/Master/NoticeManagement', type: 'settings' },
              { title: 'จัดการ บริการ', icon: 'mdi-transit-connection-variant', to: '/Master/Flow', type: 'settings' },
              { title: 'จัดโครงสร้างกระดาน', icon: 'mdi-view-dashboard', to: '/Master/WorkShop', type: 'settings' },
              { title: 'จัดการ ช่องกรอกข้อมูล', icon: 'mdi-account-edit', to: '/Master/CustomField', type: 'settings' },
              { title: 'จัดการ Tag', icon: 'mdi-wrench', to: '/Master/SettingTag', type: 'settings' },
              { title: 'จัดการ Notify', icon: 'mdi-bell-plus', to: '/Master/SettingLineNotify', type: 'settings' },
              { title: 'ตั้งค่ารับการแจ้งเตือนอัตโนมัติ', icon: 'mdi-access-point', to: '/System/LINEConfigSendMessage', type: 'settings' },
              { title: 'ตั้งค่าแบบสอบถาม', icon: 'mdi-star', to: '/Rating/RatingAnswer', type: 'settings' },
              { title: 'ตั้งค่ากำหนดจำนวนวันส่งข้อความ', icon: 'mdi-mail', to: '/Message/StepMessage', type: 'settings' }
            ]
          }
        } else {
          if (this.$session.getAll().data.billingPlan === '1' || this.$session.getAll().data.billingPlan === '2') {
            if (this.$session.getAll().data.shopId === 'U1b8d05a22f9ca1b2744f352cc64f14e4') {
              this.settings = [
              // { title: 'จัดการข้อมูลนัดหมาย', icon: 'mdi-book-cog-outline', to: '/Master/BookingField', type: 'settings' },
                { title: 'ตั้งค่าการแจ้งเตือน', icon: 'mdi-bell-ring', to: '/Master/NoticeManagement', type: 'settings' },
                { title: 'จัดการ บริการ', icon: 'mdi-transit-connection-variant', to: '/Master/Flow', type: 'settings' },
                { title: 'จัดโครงสร้างกระดาน', icon: 'mdi-view-dashboard', to: '/Master/WorkShop', type: 'settings' },
                { title: 'จัดการ ช่องกรอกข้อมูล', icon: 'mdi-account-edit', to: '/Master/CustomField', type: 'settings' },
                { title: 'จัดการ Tag', icon: 'mdi-wrench', to: '/Master/SettingTag', type: 'settings' },
                { title: 'จัดการ Notify', icon: 'mdi-bell-plus', to: '/Master/SettingLineNotify', type: 'settings' },
                { title: 'ตั้งค่ารับการแจ้งเตือนอัตโนมัติ', icon: 'mdi-access-point', to: '/System/LINEConfigSendMessage', type: 'settings' },
                { title: 'ตั้งค่าแบบสอบถาม', icon: 'mdi-star', to: '/Rating/RatingAnswer', type: 'settings' },
                { title: 'ตั้งค่ากำหนดจำนวนวันส่งข้อความ', icon: 'mdi-mail', to: '/Message/StepMessage', type: 'settings' }
              ]
            } else {
              this.settings = [
              // { title: 'จัดการข้อมูลนัดหมาย', icon: 'mdi-book-cog-outline', to: '/Master/BookingField', type: 'settings' },
                { title: 'ตั้งค่าการแจ้งเตือน', icon: 'mdi-bell-ring', to: '/Master/NoticeManagement', type: 'settings' },
                { title: 'จัดการ บริการ', icon: 'mdi-transit-connection-variant', to: '/Master/Flow', type: 'settings' },
                { title: 'จัดการ ช่องกรอกข้อมูล', icon: 'mdi-account-edit', to: '/Master/CustomField', type: 'settings' },
                { title: 'จัดการ Tag', icon: 'mdi-wrench', to: '/Master/SettingTag', type: 'settings' },
                { title: 'จัดการ Notify', icon: 'mdi-bell-plus', to: '/Master/SettingLineNotify', type: 'settings' },
                { title: 'ตั้งค่ารับการแจ้งเตือนอัตโนมัติ', icon: 'mdi-access-point', to: '/System/LINEConfigSendMessage', type: 'settings' },
                { title: 'ตั้งค่าแบบสอบถาม', icon: 'mdi-star', to: '/Rating/RatingAnswer', type: 'settings' },
                { title: 'ตั้งค่ากำหนดจำนวนวันส่งข้อความ', icon: 'mdi-mail', to: '/Message/StepMessage', type: 'settings' }
              ]
            }
          } else {
            this.settings = [
              // { title: 'จัดการข้อมูลนัดหมาย', icon: 'mdi-book-cog-outline', to: '/Master/BookingField', type: 'settings' },
              { title: 'ตั้งค่าการแจ้งเตือน', icon: 'mdi-bell-ring', to: '/Master/NoticeManagement', type: 'settings' },
              { title: 'จัดการ บริการ', icon: 'mdi-transit-connection-variant', to: '/Master/Flow', type: 'settings' },
              { title: 'จัดโครงสร้างกระดาน', icon: 'mdi-view-dashboard', to: '/Master/WorkShop', type: 'settings' },
              { title: 'จัดการ ช่องกรอกข้อมูล', icon: 'mdi-account-edit', to: '/Master/CustomField', type: 'settings' },
              { title: 'จัดการ Tag', icon: 'mdi-wrench', to: '/Master/SettingTag', type: 'settings' },
              { title: 'จัดการ Notify', icon: 'mdi-bell-plus', to: '/Master/SettingLineNotify', type: 'settings' },
              { title: 'ตั้งค่ารับการแจ้งเตือนอัตโนมัติ', icon: 'mdi-access-point', to: '/System/LINEConfigSendMessage', type: 'settings' },
              { title: 'ตั้งค่าแบบสอบถาม', icon: 'mdi-star', to: '/Rating/RatingAnswer', type: 'settings' },
              { title: 'ตั้งค่ากำหนดจำนวนวันส่งข้อความ', icon: 'mdi-mail', to: '/Message/StepMessage', type: 'settings' }
            ]
          }
        }
      }
      if (this.$session.getAll().data.USER_ROLE === 'user') {
        this.corporate = [
          // { title: 'สาขา', icon: 'mdi-home-group', to: '/Master/Branch', type: 'corporate' },
          // { title: 'พนักงาน', icon: 'mdi-account-multiple', to: '/Master/Employee', type: 'corporate' },
          // { title: 'บริการเสริม', icon: 'mdi-atom-variant', to: '/Master/ServiceType', type: 'corporate' },
          // { title: 'ช่องทางการชำระเงิน', icon: 'mdi-credit-card-outline', to: '/Master/PaymentType', type: 'corporate' },
          // { title: 'จัดการบริษัท', icon: 'mdi-home-city', to: '/System/EditShop', type: 'corporate' },
          { title: 'สมัครและจัดการยูเซอร์', icon: 'mdi-account-circle', to: '/System/ManageUser', type: 'corporate' }
          // { title: 'พิมพ์ใบเสร็จ', icon: 'mdi-printer-search', to: '/PrintPdf/PrintInvoice', type: 'corporate' }
        ]
      }
      // this.master = [this.customer[0], this.booking[0], this.Dashboard[0], this.workflow[0], this.corporate[0], this.broadCast[0], this.settings[0]]
      this.master.push(...this.customer, ...this.booking, ...this.Dashboard, ...this.workflow, ...this.corporate, ...this.broadCast, ...this.settings, ...this.packagePlan)
      var textValue = this.master.filter(el => { return this.$route.fullPath === el.to })[0].type
      switch (textValue) {
        case 'customer':
          this.customerValue = true
          break
        case 'booking':
          this.bookingValue = true
          break
        case 'Dashboard':
          this.DashboardValue = true
          break
        case 'workflow':
          this.workflowValue = true
          break
        case 'corporate':
          this.corporateValue = true
          break
        case 'broadCast':
          this.broadCastValue = true
          break
        case 'settings':
          this.settingsValue = true
          break
        case 'packagePlan':
          this.packagePlanValue = true
          break
        default:
    // code block
      }
    },
    storeFrontChk () {
      if (this.session.data.shopId === 'U512ca78be8cd402fd96f57d5f6aca6f3') {
        this.booking = [
          { title: 'รายการจัดการคิวหน้าร้าน', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueue', type: 'booking' },
          { title: 'จัดการคิวหน้าร้าน', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueueByUserEvent', type: 'booking' }
        ]
      } else {
        this.booking = [
          { title: 'รายการจัดการคิวหน้าร้าน', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueue', type: 'booking' },
          { title: 'จัดการคิวหน้าร้าน', icon: 'mdi-notebook-edit', to: '/Master/BookingListQueueByUser', type: 'booking' }
        ]
      }
    },
    bookingChk () {
      if (this.$session.getAll().data.timeSlotStatus === 'True') {
        let check = this.$session.getAll().data.empId || ''
        if (check !== '') {
          this.boardSide = [
            { title: 'ตรวจสอบคิวจองรายวัน', icon: 'mdi-calendar-search', to: '/Master/BookingByUserEmp', type: 'booking' }
          ]
        } else {
          this.boardSide = [
            { title: 'ตรวจสอบคิวจองรายวัน', icon: 'mdi-calendar-search', to: '/Master/BookingByUserEmp', type: 'booking' },
            { title: 'รายชื่อลูกค้านัดหมาย', icon: 'mdi-account-edit', to: '/Master/BookingListBeautyEmp', type: 'booking' }
          ]
        }
      } else {
        this.booking = [
          { title: 'รายชื่อลูกค้านัดหมาย', icon: 'mdi-account-edit', to: '/Master/BookingListBeauty', type: 'booking' }
        ]
      }
    },
    onsite () {
      // this.$router.push('/Onsite/JobList')
      if (this.session.data.shopId === this.shopNameData.airmate) {
        this.onsiteSide = [
          { title: 'รายการงานทั้งหมด', icon: 'mdi-account-plus', to: '/Onsite/JobListAirmate', type: 'customer' },
          { title: 'ปฏิทิน', icon: 'mdi-calendar', to: '/Onsite/OnsiteCalendarGrid', type: 'customer' }
        ]
      } else {
        this.onsiteSide = [
          { title: 'รายการงานทั้งหมด', icon: 'mdi-account-plus', to: '/Onsite/JobList', type: 'customer' },
          { title: 'ปฏิทิน', icon: 'mdi-calendar', to: '/Onsite/OnsiteCalendarGrid', type: 'customer' }
        ]
      }
    },
    board () {
      if (this.session.data.shopId === 'U9084920b3005bd1dcb57af1ae6bdba32' || this.session.data.shopId === 'U951aaccf8b715308c8af44068f511fb0') {
        this.boardSide = [
          { title: 'กระดานการทำงาน', icon: 'mdi-clipboard-check-multiple-outline', to: '/Master/BoardControl', type: 'workflow' }
        ]
      } else {
        if (this.$session.getAll().data.billingPlan === '1' || this.$session.getAll().data.billingPlan === '2') {
          if (this.$session.getAll().data.shopId === 'U1b8d05a22f9ca1b2744f352cc64f14e4') {
            this.boardSide = [
              { title: 'กระดานการทำงาน', icon: 'mdi-clipboard-check-multiple-outline', to: '/Master/BoardControlBeauty', type: 'workflow' }
            ]
          } else {
            this.boardSide = []
          }
        } else {
          this.boardSide = [
            { title: 'กระดานการทำงาน', icon: 'mdi-clipboard-check-multiple-outline', to: '/Master/BoardControlBeauty', type: 'workflow' }
          ]
        }
      }
    },
    billingPlan (dt) {
      console.log('billingPlan', dt)
      this.dataCondition = []
      this.dialogCondition = true
      this.dataCondition = dt
      // }
    },
    async submitBillingPlan (dt) {
      if (this.checkCondition === 'ยอมรับ') {
        this.dataReady = false
        if (dt.pricePackage === '') {
          var ds = {
            billingPlan: dt.id,
            LAST_USER: this.$session.getAll().data.userName,
            billingCustomerId: '',
            billingCustomerCardId: '',
            billingScheduleId: '',
            billingCustomerData: ''
          }
          await axios
            .post(
            // eslint-disable-next-line quotes
              this.DNS_IP + "/sys_shop/edit/" + this.$session.getAll().data.shopId,
              ds
            )
            .then(async response => {
              await this.updateBetaskDB(ds, this.$session.getAll().data.shopId)
              this.chkPlan()
              this.$swal('เรียบร้อย', 'คุณได้อัพเดทเป็นสมาชิกสายฟรีแล้ว', 'success')
              this.checkCondition = 'ไม่ยอมรับ'
              this.dataReady = true
              this.dialogCondition = false
            })
        } else {
          this.dataReadyGet = false
          this.$OmiseCard.open({
            amount: parseInt(dt.pricePackage + '00'),
            currency: 'THB',
            defaultPaymentMethod: 'credit_card',
            onCreateTokenSuccess: (nonce) => {
              if (nonce.startsWith('tokn_')) {
                this.omiseToken = nonce
                this.getCustomersOmise(nonce, dt)
                this.dialogCondition = false
              } else {
                this.omiseSource = nonce
                this.checkCondition = 'ไม่ยอมรับ'
                this.dataReady = true
                this.dialogCondition = false
                this.chkPlan()
              }
            // form.submit()
            }
          })
        }
      } else {
        this.dialogCondition = false
        this.dataReady = true
      }
    },
    async getCustomersOmise (tokn, dt) {
      var ds = {
        billingPlan: dt.id,
        email: this.$session.getAll().data.userName,
        description: this.$session.getAll().data.shopName,
        descriptionCharge: dt.source + '-' + dt.name + '-' + this.$session.getAll().data.shopId,
        card: tokn,
        shopId: this.$session.getAll().data.shopId
      }
      await axios
        .post(this.DNS_IP + '/omise/customers', ds)
        .then(async response => {
          console.log('getCustomersOmise', response)
          if (response.data.status) {
            this.chkPlan()
            this.$swal('เรียบร้อย', 'คุณได้อัพเดทเป็นสมาชิก Premium แล้ว', 'success')
            this.checkCondition = 'ไม่ยอมรับ'
            this.dataReady = true
          } else {
            this.$swal('ผิดพลาด', 'กรุณาตรวจสอบข้อมูลครับ', 'error')
            this.checkCondition = 'ไม่ยอมรับ'
            this.dataReady = true
          }
        })
    },
    // async chkPlan () {
    //   this.dataBilling = ''
    //   this.billingCustomerId = ''
    //   this.dataReadyGet = false
    //   await axios
    //     .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$session.getAll().data.shopId)
    //     .then(async response => {
    //       let rs = response.data[0]
    //       if (response.data.length > 0) {
    //         this.$session.set('data', response.data[0])
    //         this.billingCustomerId = rs.billingCustomerId
    //         if (rs.billingPlan === 'free') {
    //           this.dataBilling = rs.billingPlan
    //         } else {
    //           this.dataBilling = parseInt(rs.billingPlan)
    //         }
    //       }
    //     })
    //   this.dataPackage = []
    //   await axios
    //     .get(this.DNS_IP_Betask + '/packet/getSortNo?source=BeLinked')
    //     .then(async (responses) => {
    //       let rsPacket = responses.data
    //       for (let i = 0; i < rsPacket.length; i++) {
    //         var d = rsPacket[i]
    //         var s = {}
    //         s.id = d.id
    //         if (d.sortNo === null || d.sortNo === '') {
    //           s.sortNo = i + 1
    //         } else {
    //           s.sortNo = d.sortNo
    //         }
    //         s.name = d.name
    //         s.description = JSON.parse(d.description)
    //         s.warning = d.warning
    //         s.close = d.close
    //         s.source = d.source
    //         s.pricePackage = d.pricePackage
    //         s.rangeRePackage = d.rangeRePackage
    //         this.dataPackage.push(s)
    //       }
    //       if (this.dataBilling === 'free') {
    //         this.dataBilling = this.dataPackage.filter(el => { return el.pricePackage === '' || el.pricePackage === '0' })[0].id
    //       }
    //       // this.dataPackage = rsPacket
    //     })
    //   console.log('this.dataBilling', this.dataBilling)
    //   console.log('this.dataPackage', this.dataPackage)
    //   this.dataReadyGet = true
    // },
    async chkSchedule () {
      this.chkDateSchedule = moment(moment(new Date(), 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
      this.snackbarSchedule = false
      if (this.billingCustomerId !== '') {
        await axios
          .get(this.DNS_IP + '/omise/getSchedule?billingCustomerId=' + this.billingCustomerId)
          .then(async response => {
          // console.log('chkSchedule', response.data.data.next_occurrences_on[0])
            const date1 = new Date(this.chkDateSchedule)
            const date2 = new Date(response.data.data.next_occurrences_on[0])
            const diffTime = Math.abs(date2 - date1)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            console.log(diffDays + ' days')
            if (diffDays < 7) {
              this.snackbarSchedule = true
              this.textSchedule = 'ระบบจะตัดเงินผ่านระบบอัตโนมัติในวันที่ ' + this.format_dateNotime(response.data.data.next_occurrences_on[0])
            }
          })
      }
    },
    async cancelPlan () {
      this.dataReadyCancel = false
      var ds = {
        billingPlan: 'free',
        LAST_USER: this.$session.getAll().data.userName,
        billingCustomerId: '',
        billingCustomerCardId: '',
        billingScheduleId: '',
        billingCustomerData: ''
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/sys_shop/edit/" + this.$session.getAll().data.shopId,
          ds
        )
        .then(async response => {
          await this.updateBetaskDB(ds, this.$session.getAll().data.shopId)
          this.chkPlan()
          this.$swal('เรียบร้อย', 'คุณได้อัพเดทเป็นสมาชิกสายฟรีแล้ว', 'success')
          this.checkCondition = 'ไม่ยอมรับ'
          this.dialogCancel = false
          this.dataReadyCancel = true
        })
    },
    async updateBetaskDB (ds, shopId) {
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP_Betask + "/sys_shop/edit/" + shopId,
          ds
        )
        .then(async response => {
        })
    },
    closeDrawer () {
      this.isOpenNoti = false
    },
    closeSetup () {
      this.isOpenSetup = false
    },
    onOpenNoti () {
      this.GetNotiBookingUnRead()
      this.GetNotiBookingReading()
      this.isOpenNoti = true
    },
    onOpenSetup () {
      this.isOpenSetup = true
    },
    async getShopSetUp () {
      await axios
        .get(this.DNS_IP + '/Task_Transaction/getCheck?shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          if (response !== null) {
            if (response.data !== null) {
              this.progress = response.data.percentage ? response.data.percentage : 0
              if (response.data.setupGuide && response.data.setupGuide.length > 0) {
                this.dataSetupGuide = response.data.setupGuide
                if (response.data.percentage < 100) {
                  this.isOpenSetup = true
                }
              } else {
                this.dataSetupGuide = []
              }
              // if (this.progress === 100) {
              //   this.isNewShop = false
              //   this.isOpenSetup = false

              //   let session = JSON.parse(localStorage.getItem('sessionData'))
              //   session.IsNewShop = 0
              //   this.$session.start()
              //   this.$session.set('data', session)
              //   localStorage.clear()
              //   localStorage.setItem('sessionData', JSON.stringify(session))
              // } else {
              //   if (response.data.setupGuide && response.data.setupGuide.length > 0) {
              //     this.dataSetupGuide = response.data.setupGuide
              //     this.isOpenSetup = true
              //   } else {
              //     this.dataSetupGuide = []
              //   }
              // }
            }
          }
        })
    },
    closeDrawerOnClickOutside (event) {
      if (!this.$el.contains(event.target) && (this.isOpenSetup || this.isOpenNoti)) {
        this.isOpenNoti = false
        this.isOpenSetup = false
      }
    },
    async closeCompleted () {
      try {
        if (this.$session.getAll().isNewShop === 1) {
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/sys_shop/edit/" + this.$session.getAll().data.shopId, {IsNewShop: 0}
            )
            .then(async response => {
              this.getShop()
            })
        }
      } catch (error) {
        console.log('Error ', error)
      }

      this.isOpenCompleted = false
    },
    async updateSetUp (taskid, isComplete) {
      try {
        if (taskid === 1) {
          this.$router.push('/Master/Flow')
        } else if (taskid === 2) {
          this.$router.push('/Master/Branch')
        } else if (taskid === 3) {
          this.$router.push('/Master/Employee')
        }
        this.isOpenSetup = false
        if (!isComplete) {
          const body = { shopId: this.$session.getAll().data.shopId, taskId: taskid }
          await axios
            .post(
              this.DNS_IP + '/Task_Transaction/add', body)
            .then(async response => {
              if (response.data) {
                if (response.data.status) {
                  await this.getShopSetUp()
                }
              }
            })
        }
      } catch (error) {
        console.log('Error updateSetUp', error)
      }
    },
    async getFirestore () {
      this.firestore = this.$firebase.firestore()
      const FieldPath = this.$firebase.firestore.FieldPath
      this.firestore.collection('BetaskLinked')
        .where(FieldPath.documentId(), '==', this.$session.getAll().data.shopId)
        .onSnapshot((snapshot) => {
          if (snapshot.empty) {
            this.setNewNotifyApp()
          } else {
            snapshot.forEach((doc) => {
              if (doc.data().activeBooking === '1') {
                console.log('getFirestore --> activeBooking')
                this.isNoti = true
              } else {
                this.isNoti = false
              }
            })
          }
        })
    },
    async GetNotiBookingUnRead () {
      try {
        console.log('[Start GetNotiBookingUnRead]')
        try {
          await axios
            .get(
              this.DNS_IP + '/booking_view/get?shopId=' + this.$session.getAll().data.shopId + '&IsNotify=False&limit=10')
            .then(async response => {
              if (response.data) {
                console.log('[Data GetNotiBookingUnRead]', response.data)
                if (response.data.status !== false) {
                  this.listDataUnread = response.data
                } else {
                  this.listDataUnread = []
                }
              }
            })
        } catch (error) {
          console.log('Error updateSetUp', error)
        }
      } catch (error) {
        console.log('Error updateSetUp', error)
      }
    },
    async GetNotiBookingReading () {
      try {
        await axios
          .get(
            this.DNS_IP + '/booking_view/get?shopId=' + this.$session.getAll().data.shopId + '&IsNotify=True&limit=5')
          .then(async response => {
            if (response.data) {
              console.log('[Data GetNotiBookingReading]', response.data)
              if (response.data.status !== false) {
                this.listDataReaded = response.data
              } else {
                this.listDataReaded = []
              }
            }
          })
      } catch (error) {
        console.log('Error updateSetUp', error)
      }
    },
    async updateReadNoti (bookNo) {
      try {
        let body = {shopId: this.$session.getAll().data.shopId}
        await axios
          .post(
            'https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/BetaskNotify-ProcessBookingNotify', body)
          .then(async response => {
            if (response.data) {
              this.UpdateBookingIsNotifyByShopId(bookNo)
              console.log('GetNotiBooking ->', response.data)
            }
          })
      } catch (error) {
        console.log('Error updateSetUp', error)
      }
    },
    async UpdateBookingIsNotifyByShopId (bookNo) {
      try {
        let body = {
          bookNo: bookNo
        }
        await axios
          .post(
            this.DNS_IP + '/Booking/editIsNotifyByShopId/' + this.$session.getAll().data.shopId, body)
          .then(async response => {
          })
      } catch (error) {
        console.log('Error updateSetUp', error)
      }
    },
    async setNewNotifyApp () {
      try {
        let body = {shopId: this.$session.getAll().data.shopId}
        await axios
          .post(
            'https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/BetaskNotify-ProcessBookingSetNew', body)
          .then(async response => {
            if (response.data) {
              console.log('ProcessBookingSetNew ->', response.data)
            }
          })
      } catch (error) {
        console.log('Error ProcessBookingSetNew', error)
      }
    },
    onClickComplete () {
      console.log('onClickComplete')
      this.isOpenCompleted = true
    },
    onClickReadedNoti (itemNoti) {
      try {
        console.log('onClickReadedNoti', itemNoti)
        if (itemNoti.bookNo !== '') {
          if (itemNoti.IsNotify === 'False') {
            this.updateReadNoti(itemNoti.bookNo)
          }
          this.$router.push({ path: this.$session.getAll().data.timeSlotStatus === 'True' ? '/Master/BookingListBeautyEmp' : '/Master/BookingListBeauty',
            query: { bookNoNoti: itemNoti.bookNo, customerName: itemNoti.bookingDataCustomerName, dueDate: itemNoti.dueDate.substring(0, 7), masBranchID: itemNoti.masBranchID } }).catch(err => {
            if (err.name !== 'NavigationDuplicated') {
              throw err
            }
          })
          this.isOpenNoti = false
        }
      } catch (error) {
        console.log('onClickReadedNoti -> ', error)
      }
    }

  }
}
</script>

<style lang="css" scoped>
.plan_button {
  padding-bottom: 10px;
}
.feature_detail {
  color:#ddd !important;
}
.listChin {
    background-color: white !important;
}
#img_bt {
  width: 50px;
  height: 50px;
}
.icon-with-badge {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.icon-with-badge .badge {
  position: absolute;
  top: 0px;
  right: -1px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  min-width: 10px;
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.complete-span, .icon-setup{
  font-size: 0.70rem;
  color: #1B437C;
}

.progress-desktop, .progress-mobile {
  width: 41px;
  height: 41px;
  border-radius: 50%;
  position: relative;
}
.progress-value-mobile{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ddd;
  font-weight: bold;
  font-size: 13px;
}
.progress-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1B437C;
  font-weight: bold;
  font-size: 13px;
}
</style>
