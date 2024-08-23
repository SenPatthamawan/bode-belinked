<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <br>
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
        </v-row>
        <v-card flat v-if="!overlay">
          <v-card-text>
            <div class="text-center">
              <waitingAlert></waitingAlert>
            </div>
          </v-card-text>
        </v-card>
        <template v-else>
        <v-form ref="form_search" v-model="validSearch" lazy-validation>
          <v-row>
            <v-col col="3">
              <v-card
                style="padding: 10px;"
                dense
                elevation="2"
                prominent
                :color="typeMain === 'booking' ? '#ECEFF1' : 'white'"
                @click="getSelect(getSelectText === '' ? 'wait':getSelectText , 'booking'), typeMain = 'booking'"
              >
                <v-row>
                  <v-col cols="12" class="pb-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <v-avatar
                          rounded
                          size="50"
                          class="pa-2"
                          color="#134996"
                        >
                          <v-icon dark size="30" class="iconify" data-icon="basil:calendar-solid">
                          </v-icon>
                        </v-avatar>
                      </div>
                      <div>
                        <strong>Be Linked</strong>
                        <div style="color: #828282;">ระบบนัดหมายจองคิว</div>
                      </div>
                    </div>
                    <v-divider></v-divider>
                  </v-col>
                  <v-col cols="6" class="pt-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <strong>{{countNewCus}}</strong>
                        <div style="font-size: 15px;color: #828282;">ลูกค้าใหม่</div>
                      </div>
                    </div>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col cols="6" class="pt-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <strong>{{countOldCus}}</strong>
                        <div style="font-size: 15px;color: #828282;">ลูกค้าเก่า</div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col col="3">
              <v-card
                style="padding: 10px;"
                dense
                elevation="2"
                prominent
                :color="typeMain === 'storeFront' ? '#ECEFF1' : 'white'"
                @click="getSelect(getSelectText === '' ? 'wait':getSelectText , 'storeFront'), typeMain = 'storeFront'"
              >
                <v-row>
                  <v-col cols="12" class="pb-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <v-avatar
                          rounded
                          size="50"
                          class="pa-2"
                          color="#D2FFDC"
                        >
                          <v-icon color="#38E25D" size="30" class="iconify" data-icon="ri:file-list-3-fill">
                          </v-icon>
                        </v-avatar>
                      </div>
                      <div>
                        <strong>Be Linked</strong>
                        <div style="color: #828282;">ระบบบัตรคิวออนไลน์</div>
                      </div>
                    </div>
                    <v-divider></v-divider>
                  </v-col>
                  <v-col cols="6" class="pt-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <strong>{{countNewCusStoreFront}}</strong>
                        <div style="font-size: 15px;color: #828282;">ลูกค้าใหม่</div>
                      </div>
                    </div>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col cols="6" class="pt-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <strong>{{countOldCusStoreFront}}</strong>
                        <div style="font-size: 15px;color: #828282;">ลูกค้าเก่า</div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col col="3">
              <v-card
                style="padding: 10px;"
                dense
                elevation="2"
                prominent
                :color="typeMain === 'loyalty' ? '#ECEFF1' : 'white'"
                @click="getSelect(getSelectText === '' ? 'wait':getSelectText , 'loyalty'), typeMain = 'loyalty'"
              >
                <v-row>
                  <v-col cols="12" class="pb-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <v-avatar
                          rounded
                          size="50"
                          class="pa-2"
                          color="#FFEEFA"
                        >
                          <v-icon color="#E328AF" size="30" class="iconify" data-icon="ant-design:gift-filled">
                          </v-icon>
                        </v-avatar>
                      </div>
                      <div>
                        <strong>Be Loyalty</strong>
                        <div style="color: #828282;">ระบบสะสมคะแนน</div>
                      </div>
                    </div>
                    <v-divider></v-divider>
                  </v-col>
                  <v-col cols="6" class="pt-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <strong>{{countNewCusLoyalty}}</strong>
                        <div style="font-size: 15px;color: #828282;">ลูกค้าใหม่</div>
                      </div>
                    </div>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col cols="6" class="pt-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <strong>{{countOldCusLoyalty}}</strong>
                        <div style="font-size: 15px;color: #828282;">ลูกค้าเก่า</div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col col="3">
              <v-card
                style="padding: 10px;"
                dense
                elevation="2"
                prominent
              >
                <v-row>
                  <v-col cols="12" class="pb-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <v-avatar
                          rounded
                          size="50"
                          class="pa-2"
                          color="#FF7D52"
                        >
                          <v-icon dark size="30" class="iconify" data-icon="solar:shop-linear">
                          </v-icon>
                        </v-avatar>
                      </div>
                      <div>
                        <div style="color: #828282;">รายรับทั้งหมด <strong style="color: #262626;">{{formatNumber(sumAmountAll)}} บาท</strong></div>
                      </div>
                    </div>
                    <v-divider></v-divider>
                  </v-col>
                  <v-col cols="12" class="pt-0 pl-0 pr-0">
                    <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <strong>{{countNewCus + countOldCus + countNewCusStoreFront + countOldCusStoreFront + countNewCusLoyalty + countOldCusLoyalty}}</strong>
                        <div style="font-size: 15px;color: #828282;">ลูกค้าทั้งหมด</div>
                      </div>
                    </div>
                  </v-col>
                  <!-- <v-divider vertical></v-divider>
                  <v-col cols="6" class="pt-0 pl-0 pr-0"> -->
                    <!-- <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap;">
                      <div class="text-center">
                        <strong>{{countOldCus}}</strong>
                        <div style="font-size: 15px;color: #828282;">ยกเลิกสมาชิก</div>
                      </div>
                    </div> -->
                  <!-- </v-col> -->
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col col="6">
              <strong style="font-size: 34px;">Invoices List</strong>
            </v-col>
            <v-col col="auto">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="ค้นหา"
                hide-details
                outlined
                dense
                @input="setDataExportSearch()"
              ></v-text-field>
            </v-col>
            <v-col col="auto">
              <v-menu
                ref="menu"
                v-model="menuStart"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    hide-details
                    background-color="white"
                    v-model="dateStart"
                    label="เดือน/ปี"
                    readonly
                    outlined
                    dense
                    required
                    :rules ="[rules.required]"
                    v-bind="attrs"
                    v-on="on"
                  >
                  <template #prepend-inner>
                  <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                    mdi-calendar
                  </v-icon>
                </template></v-text-field>
                </template>
                <v-date-picker
                  @input="menuStart = false, checkSearch()"
                  v-model="dateStart"
                  type="month"
                  no-title
                  scrollable
                >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="auto" class="pt-0" v-if="itemBookingUseExportSearch.length > 0">
              <v-btn
                block
                color="primary"
                class="mt-4"
                dark
                @click="exportExcelSearch()"
              >
                <v-icon > mdi-microsoft-excel</v-icon>
                Export Search
              </v-btn>
            </v-col>
            <v-col cols="auto" class="pt-0">
              <v-btn
                color="warning"
                block
                class="mt-4"
                style="border-radius: 20px !important;margin-right: 0px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                @click="checkSearch()"
              ><v-icon color="white" left>mdi-account-reactivate</v-icon>รีเฟรชข้อมูล</v-btn>
            </v-col>
          </v-row>
          <!-- <v-row>
            <v-col col="auto">
              <v-menu
                ref="menu"
                v-model="menuStart"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    hide-details
                    background-color="white"
                    v-model="dateStart"
                    style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                    label="เดือน/ปี"
                    readonly
                    outlined
                    dense
                    required
                    :rules ="[rules.required]"
                    v-bind="attrs"
                    v-on="on"
                  >
                  <template #prepend-inner>
                  <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                    mdi-calendar
                  </v-icon>
                </template></v-text-field>
                </template>
                <v-date-picker
                  @input="menuStart = false, checkSearch()"
                  v-model="dateStart"
                  type="month"
                  no-title
                  scrollable
                >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="auto" class="pt-0">
              <v-btn
                color="warning"
                block
                class="mt-4"
                style="border-radius: 20px !important;margin-right: 0px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                @click="checkSearch()"
              ><v-icon color="white" left>mdi-account-reactivate</v-icon>รีเฟรชข้อมูล</v-btn>
            </v-col>
          </v-row> -->
          <v-row style="justify-content: space-around;">
            <!-- <v-col cols="4" style="display: flex;justify-content: center;">
              <v-card
                style="padding: 10px; width: 230px;"
                dense
                elevation="0"
                prominent
                :color="(getSelectText === 'countNewCusOnMonth') ? 'teal lighten-4' : 'white'"
                @click="getSelectNewMonth('countNewCusOnMonth')"
              >
                <div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
                  <div class="text-center">
                    <v-avatar
                      size="70"
                      class="pa-3"
                      color="#F57C00"
                    >
                      <v-icon dark size="30" class="iconify" data-icon="mdi:calendar-cursor-outline">
                      </v-icon>
                    </v-avatar>
                  </div>
                  <div style="margin: auto 0;">
                    <strong>ลูกค้าใหม่ในเดือน</strong>
                    <div>จำนวน : {{countNewCusOnMonth}}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="4" style="display: flex;justify-content: center;">
              <v-card
                style="padding: 10px; width: 230px;"
                color="#E65100"
                dense
                elevation="0"
                prominent
              >
                <div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
                  <div class="text-center">
                    <v-avatar
                      size="70"
                      class="pa-3"
                      color="#F57C00"
                    >
                      <v-icon dark size="30" class="iconify" data-icon="material-symbols:fiber-new">
                      </v-icon>
                    </v-avatar>
                  </div>
                  <div style="margin: auto 0;" class="text-white">
                    <strong>ลูกค้าใหม่</strong>
                    <div>จำนวน : {{countNewCus}}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="4" style="display: flex;justify-content: center;">
              <v-card
                style="padding: 10px; width: 230px;"
                color="#1A237E"
                dense
                elevation="0"
                prominent
              >
                <div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
                  <div class="text-center">
                    <v-avatar
                      size="70"
                      class="pa-3"
                      color="#303F9F"
                    >
                      <v-icon dark size="30" class="iconify" data-icon="mdi:super-chat-for-good">
                      </v-icon>
                    </v-avatar>
                  </div>
                  <div style="margin: auto 0;" class="text-white">
                    <strong>ลูกค้าเก่า</strong>
                    <div>จำนวน : {{countOldCus}}</div>
                  </div>
                </div>
              </v-card>
            </v-col> -->
            <v-col cols="auto" style="display: flex;justify-content: center;">
              <v-card
                style="padding: 10px; width: 230px;"
                :color="(getSelectText === 'wait') ? '#DBDBDB' : 'white'"
                dense
                elevation="0"
                prominent
                @click="getSelect('wait', typeMain), getSelectText = 'wait'"
              >
                <div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
                  <div class="text-center">
                    <v-avatar
                      size="70"
                      class="pa-3"
                      color="#c2c2c2"
                    >
                      <v-icon dark size="30" class="iconify" data-icon="ps:warning">
                      </v-icon>
                    </v-avatar>
                  </div>
                  <div style="margin: auto 0;">
                    <strong>ยังไม่ได้ยืนยัน</strong>
                    <div>จำนวน : {{typeMain === 'booking' ? countWait : typeMain === 'storeFront' ? countWaitStoreFront : countWaitLoyalty }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="auto" style="display: flex;justify-content: center;">
              <v-card
                style="padding: 10px; width: 230px;"
                :color="(getSelectText === 'confirm') ? 'teal lighten-4' : 'white'"
                dense
                elevation="0"
                prominent
                @click="getSelect('confirm', typeMain), getSelectText = 'confirm'"
              >
                <div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
                  <div class="text-center">
                    <v-avatar
                      size="70"
                      class="pa-3"
                      color="teal"
                    >
                      <v-icon dark size="30" class="iconify" data-icon="mdi:cash-check">
                      </v-icon>
                    </v-avatar>
                  </div>
                  <div style="margin: auto 0;">
                    <strong>ชำระเรียบร้อย</strong>
                    <!-- <div>จำนวน : {{countConfirm}}</div> -->
                    <div>จำนวน : {{typeMain === 'booking' ? countConfirm : typeMain === 'storeFront' ? countConfirmStoreFront : countConfirmLoyalty }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="auto" style="display: flex;justify-content: center;">
              <v-card
                style="padding: 10px; width: 230px;"
                :color="(getSelectText === 'noCash') ? '#E0F4FF' : 'white'"
                dense
                icon="mdi-email-check"
                prominent
                elevation="0"
                @click="getSelect('noCash', typeMain), getSelectText = 'noCash'"
              >
              <div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
                <div class="text-center">
                  <v-avatar
                    size="70"
                    color="#ade2ff"
                    style="padding:13px"
                  >
                    <v-icon dark size="40" class="iconify" data-icon="mdi:cash-remove">
                    </v-icon>
                  </v-avatar>
                </div>
                <div style="margin: auto 0;">
                  <strong>ไม่ได้ชำระ</strong>
                  <!-- <div>จำนวน : {{countNoCash}}</div> -->
                  <div>จำนวน : {{typeMain === 'booking' ? countNoCash : typeMain === 'storeFront' ? countNoCashStoreFront : countNoCashLoyalty }}</div>
                </div>
              </div>
              </v-card>
            </v-col>
            <v-col cols="auto" style="display: flex;justify-content: center;">
              <v-card
                style="padding: 10px; width: 230px;"
                :color="(getSelectText === 'finish') ? '#9FA8DA' : 'white'"
                dense
                icon="mdi-email-check"
                prominent
                elevation="0"
                @click="getSelect('finish', typeMain), getSelectText = 'finish'"
              >
              <div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
                <div class="text-center">
                  <v-avatar
                    size="70"
                    color="#3F51B5"
                    style="padding:13px"
                  >
                    <v-icon dark size="40" class="iconify" data-icon="game-icons:finish-line">
                    </v-icon>
                  </v-avatar>
                </div>
                <div style="margin: auto 0;">
                  <strong>เสร็จสิ้น</strong>
                  <!-- <div>จำนวน : {{countFinish}}</div> -->
                  <div>จำนวน : {{typeMain === 'booking' ? countFinish : typeMain === 'storeFront' ? countFinishStoreFront : countFinishLoyalty }}</div>
                </div>
              </div>
              </v-card>
            </v-col>
            <v-col cols="auto" style="display: flex;justify-content: center;">
              <v-card
                style="padding: 10px; width: 230px;"
                :color="(getSelectText === 'inactive') ? 'error lighten-4' : 'white'"
                dense
                elevation="0"
                prominent
                @click="getSelect('inactive', typeMain), getSelectText = 'inactive'"
              >
                <div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
                  <div class="text-center">
                    <v-avatar
                      size="70"
                      class="pa-3"
                      color="error"
                    >
                      <v-icon dark size="30" class="iconify" data-icon="lucide:shield-close">
                      </v-icon>
                    </v-avatar>
                  </div>
                  <div style="margin: auto 0;">
                    <strong>Inactive</strong>
                    <!-- <div>จำนวน : {{countInactive}}</div> -->
                    <div>จำนวน : {{typeMain === 'booking' ? countInactive : typeMain === 'storeFront' ? countInactiveStoreFront : countInactiveLoyalty }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col cols="6">
            <v-menu
                v-if="itemBookingUse.length > 0"
                ref="menuExport"
                v-model="menuExport"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    hide-details
                    background-color="white"
                    v-model="dateExport"
                    label="Export วัน/เดือน/ปี สิ้นสุดทดลองใช้"
                    readonly
                    outlined
                    dense
                    required
                    :rules ="[rules.required]"
                    v-bind="attrs"
                    v-on="on"
                  >
                  <template #prepend-inner>
                  <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                    mdi-calendar
                  </v-icon>
                </template></v-text-field>
                </template>
                <v-date-picker
                  @input="menuExport = false"
                  v-model="dateExport"
                  no-title
                  scrollable
                  @change="setDataExport()"
                >
                </v-date-picker>
              </v-menu>
          </v-col>
          <v-col cols="6">
            <v-btn
                v-if="itemBookingUseExport.length > 0"
                color="primary"
                dark
                @click="exportExcel()"
              >
                <v-icon > mdi-microsoft-excel</v-icon>
                Export {{'(' + itemBookingUseExport.length + ')'}}
              </v-btn>
          </v-col>
          <v-col cols="12">
            <v-card>
            <v-data-table
              :headers="headers"
              :items="itemBookingUse"
              :search="search"
              disable-pagination
              hide-default-footer
            >
            <template v-slot:[`item.dueDate`]="{ item }">
              {{ format_dateFUllTime(item.dueDate) }}
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <!-- <v-chip
                class="ma-2"
                color="primary"
                outlined
                pill
                v-if="item.paymentStatus === 'confirm'"
                @click="changStatus(item, 'finish')"
              >
                ชำระเรียบร้อย
                <v-icon right>
                  mdi-cash-check
                </v-icon>
              </v-chip> -->
              <v-btn
                v-if="item.paymentStatus === 'confirm'"
                color="primary"
                small
                dark
                @click="changStatus(item, 'finish', typeMain)"
              >
                <v-icon > mdi-cash-check</v-icon>
                ชำระเรียบร้อย
              </v-btn>
              <v-btn
                v-if="item.paymentStatus === 'confirm' || item.paymentStatus === 'finish'"
                color="orange"
                small
                dark
                @click="changStatus(item, 'wait', typeMain)"
              >
                <v-icon >mdi-cash-sync</v-icon>
                ลูกค้าชำระอีกครั้ง
              </v-btn>
              <v-btn
                v-if="item.paymentStatus === 'wait'"
                color="success"
                small
                dark
                @click="changStatus(item, 'confirm', typeMain)"
              >
                <v-icon > mdi-check-circle </v-icon>
                Active
              </v-btn>
              <v-btn
                v-if="item.paymentStatus === 'inactive'"
                color="success"
                small
                dark
                @click="changStatus(item, 'inactiveToactive', typeMain)"
              >
                <v-icon > mdi-check-circle </v-icon>
                Active
              </v-btn>
              <v-btn
                v-if="item.paymentStatus === 'wait' || item.paymentStatus === 'noCash'"
                color="error"
                small
                dark
                @click="changStatus(item, 'inactive', typeMain)"
              >
                <v-icon > mdi-close-circle </v-icon>
                Inactive
              </v-btn>
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="primary"
                @click="setDataSetting(item)"
              >
                <v-icon dark>
                  mdi-cog-box
                </v-icon>
              </v-btn>
            </template>
            <template v-slot:[`item.shopImge`]="{ item }">
              <v-avatar color="primary" size="40" @click="gotoPicture(item.shopImge)" v-if="item.shopImge !== null">
                <img :src="item.shopImge" alt="img"
              /></v-avatar>
            </template>
            <template v-slot:[`item.paymentImage`]="{ item }">
              <v-avatar color="primary" size="40" @click="gotoPicture(item.paymentImage)" v-if="item.paymentImage !== null">
                <img :src="item.paymentImage" alt="img"
              /></v-avatar>
            </template>
            <template v-slot:[`item.shopName`]="{ item }">
              <v-row>
                <v-col cols="12">
                  <a @click.stop="openDetail(item)" style="cursor:hand"><u>{{ item.shopName }}</u></a>
                </v-col>
              </v-row>
            </template>
            </v-data-table>
          </v-card>
          </v-col>
        </v-row>
        <v-dialog v-model="dialogDetails" scrollable persistent max-width="500px">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="8" class="text-left pt-10">
                      <h3><strong>รายละเอียดนัดหมาย</strong></h3>
                    </v-col>
                    <v-col cols="4" class="pt-10">
                      <div style="text-align: end;">
                        <v-btn
                          class="mx-2"
                          fab
                          small
                          dark
                          color="white"
                          :style="styleCloseBt"
                          @click="dialogDetails = false"
                          >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row >
                    <v-col cols="12">
                      <v-card-text v-if="itemPayMent">
                        <div class="avatar text-center">
                          <v-avatar size="120" style="border:5px solid #FFFFFF;">
                          <v-img
                            v-if="itemPayMent.shopImge"
                            :src="itemPayMent.shopImge"
                          ></v-img>
                          <v-icon size="100" color="orange" v-else>
                            mdi-tooltip-account
                          </v-icon>
                        </v-avatar>
                        </div>
                        <div class="text-center">
                          <h3>{{itemPayMent.shopName}}</h3>
                        </div>
                        <v-row>
                          <v-col cols="12" class="pb-0">
                            <h4>เลขประจำตัวผู้เสียภาษี : {{itemPayMent.billingTax}}</h4>
                          </v-col>
                          <v-col cols="12" class="pb-0">
                            <h4>ชื่อ-สกุล : {{itemPayMent.billingCusName}}</h4>
                          </v-col>
                          <v-col cols="12" class="pb-0">
                            <h4>เบอร์โทร : {{itemPayMent.billingPhone || itemPayMent.contactTel}}</h4>
                          </v-col>
                          <v-col cols="12" class="pb-0">
                            <h4>อีเมล : {{itemPayMent.contactEmail}}</h4>
                          </v-col>
                          <v-col cols="12" class="pb-0">
                            <h4>ที่อยู่ : {{itemPayMent.billingAddress}}</h4>
                          </v-col>
                          <v-col cols="12" class="pb-0">
                            <h4>ราคาแพ็คเกจ : {{itemPayMent.paymentAmount}}</h4>
                          </v-col>
                          <v-col cols="12" class="pt-0">
                            <h4>รอบชำระ : {{itemPayMent.paymentDateMonthYear}}</h4>
                          </v-col>
                          <v-col cols="12" class="pt-0" v-if="itemPayMent.billingEndDate">
                            <h4>วันที่หมดอายุ : {{itemPayMent.billingEndDate}}</h4>
                          </v-col>
                        </v-row>
                        <br>
                          <div class="text-center" v-if="itemPayMent.paymentImage !== ''">
                            <h6><strong>หลักฐานเงินมัดจำ</strong></h6>
                          </div>
                      </v-card-text>
                      <v-card-text>
                        <v-container>
                          <v-img
                            v-if="itemPayMent.paymentImage !== ''"
                            class="pa-3"
                            contain
                            max-height="100%"
                            max-width="100%"
                            @click="gotoPicture(itemPayMent.paymentImage)"
                            :src="itemPayMent.paymentImage"
                          ></v-img>
                        </v-container>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogSetting" scrollable persistent max-width="500px">
          <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="8" class="text-left pt-10">
                      <h3><strong>รายละเอียดนัดหมาย</strong></h3>
                    </v-col>
                    <v-col cols="4" class="pt-10">
                      <div style="text-align: end;">
                        <v-btn
                          class="mx-2"
                          fab
                          small
                          dark
                          color="white"
                          :style="styleCloseBt"
                          @click="dialogSetting = false"
                          >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row >
                    <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                      <v-text-field
                        prepend-icon="mdi-format-list-numbered"
                        v-model="btNumber"
                        label="BT Number"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                      <v-menu
                        ref="menu"
                        v-model="menutrialsVersionDate"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="trialsVersionDate"
                            label="วันที่ทดลองใช้"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                          >
                          <template #prepend>
                          <v-icon>
                            mdi-calendar
                          </v-icon>
                        </template></v-text-field>
                        </template>
                        <v-date-picker
                          @input="menutrialsVersionDate = false"
                          v-model="trialsVersionDate"
                          no-title
                          scrollable
                        >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                      <v-text-field
                        v-model="trialsVersionDateTime"
                        dense
                        v-mask="'##:##'"
                        placeholder="HH:mm"
                        outlined
                        label="เวลาทดลองใช้"
                        prepend-icon="mdi-clock-time-eleven"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                      <v-menu
                        ref="menu"
                        v-model="menubillingEndDate"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="billingEndDate"
                            label="วันที่สิ้นสุด (กรณีหลายเดือน/ปี)"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                          >
                          <template #prepend>
                          <v-icon>
                            mdi-calendar
                          </v-icon>
                        </template></v-text-field>
                        </template>
                        <v-date-picker
                          @input="menubillingEndDate = false"
                          v-model="billingEndDate"
                          no-title
                          scrollable
                        >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                      <v-text-field
                        prepend-icon="mdi-account"
                        v-model="billingCusName"
                        label="ชื่อ-สกุล"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                      <v-text-field
                        prepend-icon="mdi-card-account-phone-outline"
                        v-mask="'##########'"
                        v-model="billingPhone"
                        label="เบอร์โทร"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                      <v-text-field
                        prepend-icon="mdi-hail"
                        v-model="billingTax"
                        label="เลขประจำตัวผู้เสียภาษี"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                        <v-textarea
                          v-model="billingAddressDetails"
                          auto-grow
                          rows="2"
                          label="รายละเอียดที่อยู่"
                          :rules="[v => !!v || 'กรุณากรอกรายละเอียดที่อยู่']"
                          dense
                          outlined
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                        <v-select
                          v-model="billingSubDistrict"
                          :items="optionSubDistrict"
                          :rules="[v => !!v || 'กรุณากรอกตำบล']"
                          dense
                          outlined
                          no-data-text="กรุณกรอกรหัสไปรษณีย์"
                          label="ตำบล"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                        <v-select
                          v-model="billingDistrict"
                          :items="optionDistrict"
                          :rules="[v => !!v || 'กรุณากรอกอำเภอ']"
                          dense
                          outlined
                          no-data-text="กรุณกรอกรหัสไปรษณีย์"
                          label="อำเภอ"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                        <v-select
                          v-model="billingProvinces"
                          :items="optionProvinces"
                          :rules="[v => !!v || 'กรุณากรอกจังหวัด']"
                          dense
                          outlined
                          no-data-text="กรุณกรอกรหัสไปรษณีย์"
                          label="จังหวัด"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pt-1 pb-0" v-if="shopId_Shop !== ''">
                        <v-text-field
                          v-model="billingPostalCode"
                          :rules="[v => !!v || 'กรุณากรอกรหัสไปรษณีย์', v => (!isNaN(v)) && v.length >= 5 && v.length <= 5  || 'รหัสไปรษณีย์ต้องมีตัวเลข 5 ตัว', resZipCode.length > 0 || 'ไม่เจอรหัสรหัสไปรษณีย์']"
                          dense
                          outlined
                          label="รหัสไปรษณีย์"
                          no-data-text="ไม่มีข้อมูล"
                          required
                          @input="checkAddress()"
                        ></v-text-field>
                      </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="idPayment !== ''">
                      <v-menu
                        ref="menu"
                        v-model="menupaymentDateTrue"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="paymentDateTrue"
                            label="วันที่ได้รับเงินจริง"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                          >
                          <template #prepend>
                          <v-icon>
                            mdi-calendar
                          </v-icon>
                        </template></v-text-field>
                        </template>
                        <v-date-picker
                          @input="menupaymentDateTrue = false"
                          v-model="paymentDateTrue"
                          no-title
                          scrollable
                        >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="idPayment !== ''">
                      <v-text-field
                        v-model="paymentDateTrueTime"
                        dense
                        v-mask="'##:##'"
                        placeholder="HH:mm"
                        outlined
                        label="เวลา"
                        prepend-icon="mdi-clock-time-eleven"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-0 pb-0" v-if="idPayment !== ''">
                      <VuetifyMoney
                        v-model="paymentAmountSlip"
                        placeholder="จำนวนเงินตามสลิป"
                        dense
                        label="จำนวนเงินตามสลิป"
                        outlined
                        v-bind:options="options2"
                        prepend-icon="mdi-account-cash"
                      />
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="idPayment !== '' && receiptFile !== ''">
                      <v-btn
                        color="blue-grey"
                        class="ma-2 white--text"
                        @click="gotoLink(receiptFile)"
                      >
                        แสดงใบเสร็จเดิม
                        <v-icon
                          right
                          dark
                        >
                          mdi-eye
                        </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="idPayment !== ''">
                      <v-file-input
                          class="mt-6 mb-6"
                          required
                          counter
                          show-size
                          :rules="[rules.resizeImag]"
                          prepend-icon="mdi-paperclip"
                          label="Upload ใบเสร็จ"
                          v-model="filesFlieReceipt"
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0" v-if="idPayment !== ''">
                      <v-textarea
                        prepend-icon="mdi-comment-edit"
                        v-model="remark"
                        label="หมายเหตุ"
                        outlined
                        dense
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0">
                      <v-img
                        v-if="paymentImage !== ''"
                        class="pa-3"
                        contain
                        max-height="100%"
                        max-width="100%"
                        @click="gotoPicture(paymentImage)"
                        :src="paymentImage"
                      ></v-img>
                    </v-col>
                  </v-row>
                  <div class="text-center mt-5">
                      <v-btn
                      class="button pa-2 white--text"
                      color="#173053"
                      large
                      :loading="loadingDateSetting"
                      :disabled="loadingDateSetting"
                      @click="saveDateSetting(typeMain)"
                      >บันทึกข้อมูล</v-btn>
                  </div>
                </v-container>
              </v-card-text>
          </v-card>
        </v-dialog>
        </template>
        </div>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import moment from 'moment-timezone'
import XLSX from 'xlsx' // import xlsx
export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    waitingAlert
  },
  data () {
    return {
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 2
      },
      loadingDateSetting: false,
      menubillingEndDate: false,
      menuExport: false,
      dateExport: '',
      paymentImage: '',
      billingCusName: '',
      billingAddress: '',
      billingAddressDetails: '',
      billingSubDistrict: '',
      billingDistrict: '',
      billingProvinces: '',
      billingPostalCode: '',
      billingTax: '',
      billingPhone: '',
      menutrialsVersionDate: false,
      billingEndDate: '',
      paymentAmountSlip: '',
      trialsVersionDate: '',
      trialsVersionDateTime: '',
      menupaymentDateTrue: false,
      paymentDateTrue: '',
      paymentDateTrueTime: '',
      btNumber: '',
      remark: '',
      shopId_Shop: '',
      idPayment: '',
      dialogSetting: false,
      countNewCusOnMonth: 0,
      countNewCus: 0,
      countOldCus: 0,
      countWait: 0,
      countConfirm: 0,
      countNoCash: 0,
      countFinish: 0,
      countInactive: 0,
      getSelectText: 'wait',
      validSearch: true,
      itemBooking: [],
      BookingDataList: [],
      menuStart: false,
      dialogPrint: false,
      overlay: true,
      time: '',
      timeavailable: [],
      branchItem: [],
      masBranchID: '',
      DataFlowItem: [],
      flowSelect: '',
      dateStart: '',
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'จัดการ Queue',
          disabled: false,
          href: '/Master/BookingListQueue'
        }
      ],
      dialog: false,
      dialogAdd: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      search: '',
      shopName: '',
      shopImg: '',
      headers: [
        { text: 'รูปร้าน', value: 'shopImge' },
        { text: 'BT', value: 'btNumber' },
        { text: 'ชื่อร้าน', value: 'shopName' },
        // { text: 'วันที่นัดหมาย', value: 'dueDate' },
        { text: 'เบอร์โทร', value: 'billingPhone' },
        { text: 'email', value: 'contactEmail' },
        { text: 'จำนวนนัดหมายที่สร้างของเดือนที่แล้ว', value: 'countBooking' },
        { text: 'สลิป', value: 'paymentImage' },
        { text: 'ยอดเงินที่ชำระ', value: 'paymentDateuse' },
        { text: 'สถานะ', value: 'paymentStatus' },
        { text: 'วันที่จ่าย/วันที่หมดอายุ', value: 'paymentDate' },
        { text: 'วันวันที่สิ้นสุดทดลองใช้', value: 'trialsVersionDate' },
        { text: 'จัดการข้อมูล', value: 'action', sortable: false, align: 'center' }
      ],
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        IDcardRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: value => !!value || 'กรุณากรอก.',
        resizeImag: value =>
          !value ||
          value.size < 10000000 ||
          'Avatar size should be less than 10 MB!',
        counterIDcard: value => value.length <= 13 || 'Max 13 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      typeMain: 'booking',
      itemBookingUse: [],
      itemBookingUseExport: [],
      itemBookingUseExportSearch: [],
      itemPayMent: [],
      itemCountBooking: [],
      itemCountQrcode: [],
      dialogDetails: false,
      countInactiveStoreFront: 0,
      countFinishStoreFront: 0,
      countWaitStoreFront: 0,
      countConfirmStoreFront: 0,
      countNoCashStoreFront: 0,
      countNewCusOnMonthStoreFront: 0,
      countNewCusStoreFront: 0,
      countOldCusStoreFront: 0,
      countInactiveLoyalty: 0,
      countFinishLoyalty: 0,
      countWaitLoyalty: 0,
      countConfirmLoyalty: 0,
      countNoCashLoyalty: 0,
      countNewCusOnMonthLoyalty: 0,
      countNewCusLoyalty: 0,
      countOldCusLoyalty: 0,
      sumAmountAll: 0,
      resZipCode: [],
      optionDistrict: [],
      optionSubDistrict: [],
      optionProvinces: [],
      filesFlieReceipt: null,
      receiptFile: ''
    }
  },
  async mounted () {
    this.dateStart = moment(moment(new Date(), 'YYYY-MM').toDate()).format('YYYY-MM')
    this.checkSearch()
  },
  methods: {
    gotoLink (Link) {
      window.open(Link, '_blank')
    },
    async checkAddress () {
      console.log('checkAddress')
      if (this.billingPostalCode.length >= 5) {
        console.log('postalCode')
        this.optionDistrict = []
        this.optionSubDistrict = []
        this.optionProvinces = []
        await axios
          .get(
            // eslint-disable-next-line quotes
            this.DNS_IP + "/location/map_thai?zipcode=" +
              this.billingPostalCode
          )
          .then(async (response) => {
            console.log(response.data.length > 0)
            this.resZipCode = response.data
            let rs = response.data
            for (var i = 0; i < rs.length; i++) {
              var x = rs[i]
              var z = {}
              z.text = x.district
              z.value = x.district
              this.optionDistrict.push(z)

              var d = rs[i]
              var s = {}
              s.text = d.sub_district
              s.value = d.sub_district
              this.optionSubDistrict.push(s)
            }
            for (var t = 0; t < rs.length; t++) {
              var k = rs[t]
              var l = {}
              l.text = k.province
              l.value = k.province
              this.optionProvinces.push(l)
            }
          }) // eslint-disable-next-line handle-callback-err
          .catch((error) => {
            console.log(error)
            // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          })
      } else if (this.billingPostalCode.length < 5) {
        console.log('น้อยกว่า')
        this.optionDistrict = []
        this.optionSubDistrict = []
        this.optionProvinces = []
        // this.billingPostalCode = ''
        this.billingSubDistrict = ''
        this.billingDistrict = ''
        this.billingProvinces = ''
      }
    },
    async setDataSetting (item) {
      console.log('setDataSetting', item)
      this.billingCusName = item.billingCusName || ''
      this.billingAddress = item.billingAddress || ''

      this.billingAddressDetails = item.billingAddressDetails || ''
      this.billingPostalCode = item.billingPostalCode || ''
      await this.checkAddress()
      this.billingSubDistrict = item.billingSubDistrict || ''
      this.billingDistrict = item.billingDistrict || ''
      this.billingProvinces = item.billingProvinces || ''

      this.billingTax = item.billingTax || ''
      this.billingPhone = item.billingPhone || ''
      this.paymentDateTrue = item.paymentDateTrue || ''
      this.receiptFile = item.receiptFile || ''
      if (this.paymentDateTrue === '') {
        this.paymentDateTrueTime = ''
      } else {
        this.paymentDateTrueTime = this.paymentDateTrue.split(' ')[1]
        this.paymentDateTrue = this.paymentDateTrue.split(' ')[0]
      }
      this.trialsVersionDate = item.trialsVersionDate || ''
      if (this.trialsVersionDate === '') {
        this.trialsVersionDate = ''
      } else {
        this.trialsVersionDateTime = this.trialsVersionDate.split(' ')[1]
        this.trialsVersionDate = this.trialsVersionDate.split(' ')[0]
      }
      this.billingEndDate = item.billingEndDate || ''
      this.paymentAmountSlip = item.paymentAmountSlip || 0
      this.btNumber = item.btNumber || ''
      this.remark = item.remark || ''
      this.shopId_Shop = item.shopId_Shop || ''
      this.idPayment = item.id || ''
      this.paymentImage = item.paymentImage || ''
      this.dialogSetting = true
    },
    async saveDateSetting (typeMain) {
      this.loadingDateSetting = true
      let paymentDateTrue = ''
      console.log('idPayment', this.idPayment)
      console.log('typeMain', typeMain)
      if (this.paymentDateTrue) {
        if (this.paymentDateTrueTime) {
          paymentDateTrue = this.paymentDateTrue + ' ' + this.paymentDateTrueTime || '00:00'
        } else {
          paymentDateTrue = this.paymentDateTrue + ' 00:00'
        }
      } else {
        paymentDateTrue = ''
      }
      let trialsVersionDate = ''
      if (this.trialsVersionDate) {
        if (this.trialsVersionDateTime) {
          trialsVersionDate = this.trialsVersionDate + ' ' + this.trialsVersionDateTime || '00:00'
        } else {
          trialsVersionDate = this.trialsVersionDate + ' 00:00'
        }
      } else {
        trialsVersionDate = ''
      }
      let receiptFiles = null
      if (this.filesFlieReceipt) {
        console.log('shopReceipt')
        let params = new FormData()
        params.append('file', this.filesFlieReceipt)
        await axios
          .post(this.DNS_IP + `/file/upload/shopReceipt`, params)
          .then(function (response) {
            receiptFiles = response.data
            console.log('url Pic', response.data)
          })
      } else {
        if (this.receiptFile !== '') {
          receiptFiles = this.receiptFile
        } else {
          receiptFiles = null
        }
      }
      if (this.btNumber !== '') {
        this.btNumber = this.btNumber.replace(/%/g, '%%').replace(/'/g, "\\'")
      }
      if (this.remark !== '') {
        this.remark = this.remark.replace(/%/g, '%%').replace(/'/g, "\\'")
      }
      console.log('receiptFiles', receiptFiles)
      this.billingAddress = this.billingAddressDetails + ' ตําบล/แขวง ' + this.billingSubDistrict + ' อำเภอ/เขต ' + this.billingDistrict + ' จังหวัด ' + this.billingProvinces + ' ' + this.billingPostalCode
      if (this.idPayment === '') {
        if (this.shopId_Shop !== '') {
          let url = ''
          let ds = {}
          if (typeMain === 'loyalty') {
            url = this.DNS_IP_Loyalty + '/sys_shop/edit/' + this.shopId_Shop
            ds = {
              btNumber: this.btNumber,
              expire_date_trial: trialsVersionDate,
              billingCusName: this.billingCusName,
              billingAddress: this.billingAddress,
              billingAddressDetails: this.billingAddressDetails,
              billingSubDistrict: this.billingSubDistrict,
              billingDistrict: this.billingDistrict,
              billingProvinces: this.billingProvinces,
              billingPostalCode: this.billingPostalCode,
              billingTax: this.billingTax,
              billingPhone: this.billingPhone,
              billingEndDate: this.billingEndDate
            }
          } else {
            url = this.DNS_IP + '/sys_shop/edit/' + this.shopId_Shop
            ds = {
              btNumber: this.btNumber,
              trialsVersionDate: trialsVersionDate,
              billingCusName: this.billingCusName,
              billingAddress: this.billingAddress,
              billingAddressDetails: this.billingAddressDetails,
              billingSubDistrict: this.billingSubDistrict,
              billingDistrict: this.billingDistrict,
              billingProvinces: this.billingProvinces,
              billingPostalCode: this.billingPostalCode,
              billingTax: this.billingTax,
              billingPhone: this.billingPhone,
              billingEndDate: this.billingEndDate
            }
          }
          await axios
            .post(
              // eslint-disable-next-line quotes
              url,
              ds
            )
            .then(async (response) => {
              this.dialogSetting = false
              this.$swal('สำเร็จ', 'บันทึกสำเร็จ', 'success')
              this.checkSearch()
              this.paymentDateTrue = ''
              this.trialsVersionDate = ''
              this.trialsVersionDateTime = ''
              this.btNumber = ''
              this.remark = ''
              this.shopId_Shop = ''
              this.idPayment = ''
              this.billingEndDate = ''
              this.loadingDateSetting = false
            })
        }
      } else {
        let url = ''
        let ds = {}
        if (typeMain === 'loyalty') {
          url = this.DNS_IP_Loyalty + '/system_shop_Payment/editAdmin/' + this.idPayment
          ds = {
            paymentDateTrue: paymentDateTrue,
            btNumber: this.btNumber,
            remark: this.remark,
            shopId: this.shopId_Shop,
            expire_date_trial: trialsVersionDate,
            billingCusName: this.billingCusName,
            billingAddress: this.billingAddress,
            billingAddressDetails: this.billingAddressDetails,
            billingSubDistrict: this.billingSubDistrict,
            billingDistrict: this.billingDistrict,
            billingProvinces: this.billingProvinces,
            billingPostalCode: this.billingPostalCode,
            billingTax: this.billingTax,
            billingPhone: this.billingPhone,
            paymentAmountSlip: this.paymentAmountSlip,
            billingEndDate: this.billingEndDate,
            receiptFile: receiptFiles
          }
        } else {
          console.log('booking')
          url = this.DNS_IP + '/system_shop_Payment/editAdmin/' + this.idPayment
          ds = {
            paymentDateTrue: paymentDateTrue,
            btNumber: this.btNumber,
            remark: this.remark,
            shopId: this.shopId_Shop,
            trialsVersionDate: trialsVersionDate,
            billingCusName: this.billingCusName,
            billingAddress: this.billingAddress,
            billingAddressDetails: this.billingAddressDetails,
            billingSubDistrict: this.billingSubDistrict,
            billingDistrict: this.billingDistrict,
            billingProvinces: this.billingProvinces,
            billingPostalCode: this.billingPostalCode,
            billingTax: this.billingTax,
            billingPhone: this.billingPhone,
            paymentAmountSlip: this.paymentAmountSlip,
            billingEndDate: this.billingEndDate,
            receiptFile: receiptFiles
          }
        }
        await axios
          .post(
          // eslint-disable-next-line quotes
            url,
            ds
          )
          .then(async (response) => {
            this.dialogSetting = false
            this.$swal('สำเร็จ', 'บันทึกสำเร็จ', 'success')
            this.checkSearch()
            this.paymentDateTrue = ''
            this.trialsVersionDate = ''
            this.trialsVersionDateTime = ''
            this.btNumber = ''
            this.remark = ''
            this.shopId_Shop = ''
            this.idPayment = ''
            this.paymentAmountSlip = ''
            this.filesFlieReceipt = null
            this.loadingDateSetting = false
          })
      }
    },
    openDetail (item) {
      this.itemPayMent = item
      this.dialogDetails = true
    },
    gotoPicture (Linkitem) {
      window.open(Linkitem, '_blank')
    },
    checkSearch () {
      // this.validate('SEARCH')
      // setTimeout(() => this.searchBooking(), 500)
      this.searchBooking()
    },
    async getCountBooking () {
      this.itemCountBooking = []
      let urlApi = this.DNS_IP + '/Booking/getCountBooking?paymentDate=' + this.dateStart
      await axios
        .get(urlApi)
        .then(async response => {
          let rs = response.data
          if (rs.status !== false) {
            this.itemCountBooking = rs
          } else {
            this.itemCountBooking = []
          }
        })
    },
    async getCountQrcode () {
      this.itemCountQrcode = []
      let urlApi = this.DNS_IP_Loyalty + '/qrcode/getCountQRCode?paymentDate=' + this.dateStart
      await axios
        .get(urlApi)
        .then(async response => {
          let rs = response.data
          console.log('getCountQrcode', rs)
          if (rs.status !== false) {
            this.itemCountQrcode = rs
          } else {
            this.itemCountQrcode = []
          }
        })
    },
    async searchBooking () {
      await this.getCountBooking()
      await this.getCountQrcode()
      this.countWait = 0
      this.countConfirm = 0
      this.countNoCash = 0
      this.countFinish = 0
      this.countInactive = 0
      this.countNewCusOnMonth = 0
      this.countNewCus = 0
      this.countOldCus = 0
      this.countWaitStoreFront = 0
      this.countConfirmStoreFront = 0
      this.countNoCashStoreFront = 0
      this.countFinishStoreFront = 0
      this.countInactiveStoreFront = 0
      this.countNewCusOnMonthStoreFront = 0
      this.countNewCusStoreFront = 0
      this.countOldCusStoreFront = 0
      this.countWaitLoyalty = 0
      this.countConfirmLoyalty = 0
      this.countNoCashLoyalty = 0
      this.countFinishLoyalty = 0
      this.countInactiveLoyalty = 0
      this.countNewCusOnMonthLoyalty = 0
      this.countNewCusLoyalty = 0
      this.countOldCusLoyalty = 0
      this.itemBooking = []
      this.itemBookingUse = []
      let urlApi = this.DNS_IP + '/system_shop_Payment/get?paymentStatus=not null&paymentDate=' + this.dateStart
      await axios
        .get(urlApi)
        .then(async response => {
          console.log('system_shop_Payment', response.data)
          let rs = response.data
          if (rs.status !== false) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.billingPhone = d.billingPhone || d.contactTel
              d.paymentStatus = d.paymentStatus || ''
              if (this.itemCountBooking.filter(el => { return el.shopId === d.shopId }).length > 0) {
                d.countBooking = this.itemCountBooking.filter(el => { return el.shopId === d.shopId })[0].countBooking
              } else {
                d.countBooking = 0
              }
              if (d.shopActive === 'inactive') {
                d.paymentStatus = 'inactive'
              }
              d.billingEndDate = d.billingEndDate || ''
              if (d.billingEndDate !== '') {
                if (d.billingEndDate >= moment().format('YYYY-MM-DD')) {
                  d.paymentStatus = 'finish'
                  d.paymentDate = d.billingEndDate
                }
              }
              let s = {}
              s.amountCheck = d.paymentAmountSlip || ''
              if (s.amountCheck === '') {
                d.paymentDateuse = d.paymentAmount || ''
              } else {
                d.paymentDateuse = d.paymentAmountSlip || ''
              }
              if (d.paymentDateuse !== '') {
                d.paymentDateuse = d.paymentDateuse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              d.typeProgram = 'linked'
              this.itemBooking.push(d)
            }
            // this.itemBookingUse = this.itemBooking.filter(el => { return el.paymentStatus === this.getSelectText })
          }
        })
      let urlApi1 = this.DNS_IP + '/system_shop_Payment/get?accountTest=False'
      // let urlApi1 = this.DNS_IP + '/system_shop_Payment/get?paymentStatus=is null&NopaymentDate=' + this.dateStart
      await axios
        .get(urlApi1)
        .then(async response => {
          let rs = response.data
          console.log('system_shop_Payment', rs)
          if (rs.status !== false) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.billingPhone = d.billingPhone || d.contactTel
              // d.paymentStatus = d.paymentStatus || 'noCash'
              // console.log(this.itemBooking.filter(el => { return el.shopId === d.shopId_Shop }))
              if (this.itemBooking.filter(el => { return el.shopId === d.shopId_Shop && el.typeProgram === 'linked' }).length === 0) {
                if (this.itemCountBooking.filter(el => { return el.shopId === d.shopId_Shop }).length > 0) {
                  d.countBooking = this.itemCountBooking.filter(el => { return el.shopId === d.shopId_Shop })[0].countBooking
                } else {
                  d.countBooking = 0
                }
                d.paymentStatus = 'noCash'
                d.billingEndDate = d.billingEndDate || ''
                // if (d.billingEndDate !== '') {
                //   if (d.billingEndDate >= moment().format('YYYY-MM-DD')) {
                //     d.paymentStatus = 'finish'
                //   }
                // }
                let s = {}
                s.amountCheck = d.paymentAmountSlip || ''
                if (s.amountCheck === '') {
                  d.paymentDateuse = d.paymentAmount || ''
                } else {
                  d.paymentDateuse = d.paymentAmountSlip || ''
                }
                if (d.paymentDateuse !== '') {
                  d.paymentDateuse = d.paymentDateuse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                if (d.paymentStatus === 'noCash') {
                  if (d.shopActive === 'inactive') {
                    d.paymentStatus = 'inactive'
                  }
                  if (d.billingEndDate !== '') {
                    if (d.billingEndDate >= moment().format('YYYY-MM-DD')) {
                      d.paymentStatus = 'finish'
                      d.paymentDate = d.billingEndDate
                    }
                  }
                  d.typeProgram = 'linked'
                  this.itemBooking.push(d)
                }
              }
            }
          }
        })
      let urlApi1isNull = this.DNS_IP + '/system_shop_Payment/getByRecordIsnull?accountTest=False&CREATE_DATE_SHOP=' + this.dateStart
      // let urlApi1 = this.DNS_IP + '/system_shop_Payment/get?paymentStatus=is null&NopaymentDate=' + this.dateStart
      await axios
        .get(urlApi1isNull)
        .then(async response => {
          let rs = response.data
          console.log('system_shop_Payment', rs)
          if (rs.status !== false) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.billingPhone = d.billingPhone || d.contactTel
              // d.paymentStatus = d.paymentStatus || 'noCash'
              // console.log(this.itemBooking.filter(el => { return el.shopId === d.shopId_Shop }))
              if (this.itemBooking.filter(el => { return el.shopId === d.shopId_Shop && el.typeProgram === 'linked' }).length === 0) {
                if (this.itemCountBooking.filter(el => { return el.shopId === d.shopId_Shop }).length > 0) {
                  d.countBooking = this.itemCountBooking.filter(el => { return el.shopId === d.shopId_Shop })[0].countBooking
                } else {
                  d.countBooking = 0
                }
                d.paymentStatus = 'noCash'
                d.billingEndDate = d.billingEndDate || ''
                // if (d.billingEndDate !== '') {
                //   if (d.billingEndDate >= moment().format('YYYY-MM-DD')) {
                //     d.paymentStatus = 'finish'
                //   }
                // }
                let s = {}
                s.amountCheck = d.paymentAmountSlip || ''
                if (s.amountCheck === '') {
                  d.paymentDateuse = d.paymentAmount || ''
                } else {
                  d.paymentDateuse = d.paymentAmountSlip || ''
                }
                if (d.paymentDateuse !== '') {
                  d.paymentDateuse = d.paymentDateuse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                if (d.paymentStatus === 'noCash') {
                  if (d.shopActive === 'inactive') {
                    d.paymentStatus = 'inactive'
                  }
                  if (d.billingEndDate !== '') {
                    if (d.billingEndDate >= moment().format('YYYY-MM-DD')) {
                      d.paymentStatus = 'finish'
                      d.paymentDate = d.billingEndDate
                    }
                  }
                  d.typeProgram = 'linked'
                  this.itemBooking.push(d)
                }
              }
            }
          }
        })
      let urlApiLoyalty = this.DNS_IP_Loyalty + '/system_shop_Payment/get?paymentStatus=not null&paymentDate=' + this.dateStart
      await axios
        .get(urlApiLoyalty)
        .then(async response => {
          console.log('system_shop_Payment', response.data)
          let rs = response.data
          if (rs.status !== false) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.billingPhone = d.billingPhone || d.contactTel
              d.paymentStatus = d.paymentStatus || ''
              if (this.itemCountQrcode.filter(el => { return el.shopId === d.shopId }).length > 0) {
                d.countBooking = this.itemCountQrcode.filter(el => { return el.shopId === d.shopId })[0].countQrcode
              } else {
                d.countBooking = 0
              }
              if (d.shopActive === 'inactive') {
                d.paymentStatus = 'inactive'
              }
              d.billingEndDate = d.billingEndDate || ''
              if (d.billingEndDate !== '') {
                if (d.billingEndDate >= moment().format('YYYY-MM-DD')) {
                  d.paymentStatus = 'finish'
                  d.paymentDate = d.billingEndDate
                }
              }
              let s = {}
              s.amountCheck = d.paymentAmountSlip || ''
              if (s.amountCheck === '') {
                d.paymentDateuse = d.paymentAmount || ''
              } else {
                d.paymentDateuse = d.paymentAmountSlip || ''
              }
              if (d.paymentDateuse !== '') {
                d.paymentDateuse = d.paymentDateuse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              d.typeProgram = 'loyalty'
              this.itemBooking.push(d)
            }
            // this.itemBookingUse = this.itemBooking.filter(el => { return el.paymentStatus === this.getSelectText })
          }
        })
      let urlApiLoyalty1 = this.DNS_IP_Loyalty + '/system_shop_Payment/get?accountTest=False'
      // let urlApi1 = this.DNS_IP + '/system_shop_Payment/get?paymentStatus=is null&NopaymentDate=' + this.dateStart
      await axios
        .get(urlApiLoyalty1)
        .then(async response => {
          let rs = response.data
          console.log('DNS_IP_Loyalty', rs)
          if (rs.status !== false) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.billingPhone = d.billingPhone || d.contactTel
              // d.paymentStatus = d.paymentStatus || 'noCash'
              // console.log(this.itemBooking.filter(el => { return el.shopId === d.shopId_Shop }))
              // console.log('d.shopId', this.itemBooking.filter(el => { return el.shopId === d.shopId_Shop }).length)
              // console.log('d.shopId_Shop', d.shopId_Shop)
              // console.log('d.paymentStatus', d.paymentStatus)
              if (this.itemBooking.filter(el => { return el.shopId === d.shopId_Shop && el.typeProgram === 'loyalty' }).length === 0) {
                if (this.itemCountQrcode.filter(el => { return el.shopId === d.shopId }).length > 0) {
                  d.countBooking = this.itemCountQrcode.filter(el => { return el.shopId === d.shopId })[0].countQrcode
                } else {
                  d.countBooking = 0
                }
                // if (this.itemCountBooking.filter(el => { return el.shopId === d.shopId_Shop }).length > 0) {
                //   d.countBooking = this.itemCountBooking.filter(el => { return el.shopId === d.shopId_Shop })[0].countBooking
                // } else {
                //   d.countBooking = 0
                // }
                // console.log('d', d)
                d.paymentStatus = 'noCash'
                d.billingEndDate = d.billingEndDate || ''
                // if (d.billingEndDate !== '') {
                //   if (d.billingEndDate >= moment().format('YYYY-MM-DD')) {
                //     d.paymentStatus = 'finish'
                //   }
                // }
                // console.log('d.paymentStatus', d.paymentStatus)
                // console.log('d.billingEndDate', d.billingEndDate)
                let s = {}
                s.amountCheck = d.paymentAmountSlip || ''
                if (s.amountCheck === '') {
                  d.paymentDateuse = d.paymentAmount || ''
                } else {
                  d.paymentDateuse = d.paymentAmountSlip || ''
                }
                if (d.paymentDateuse !== '') {
                  d.paymentDateuse = d.paymentDateuse.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                if (d.paymentStatus === 'noCash') {
                  if (d.shopActive === 'inactive') {
                    d.paymentStatus = 'inactive'
                  }
                  if (d.billingEndDate !== '') {
                    if (d.billingEndDate >= moment().format('YYYY-MM-DD')) {
                      d.paymentStatus = 'finish'
                      d.paymentDate = d.billingEndDate
                    }
                  }
                  d.typeProgram = 'loyalty'
                  this.itemBooking.push(d)
                }
              }
            }
          }
        })
      console.log('this.itemBooking', this.itemBooking)
      this.countWait = this.itemBooking.filter(el => { return el.paymentStatus === 'wait' && el.bookingTypeShop === 'booking' }).length
      this.countFinish = this.itemBooking.filter(el => { return el.paymentStatus === 'finish' && el.bookingTypeShop === 'booking' }).length
      this.countConfirm = this.itemBooking.filter(el => { return el.paymentStatus === 'confirm' && el.bookingTypeShop === 'booking' }).length
      this.countNoCash = this.itemBooking.filter(el => { return el.paymentStatus === 'noCash' && el.bookingTypeShop === 'booking' }).length
      this.countInactive = this.itemBooking.filter(el => { return el.paymentStatus === 'inactive' && el.bookingTypeShop === 'booking' }).length
      this.countNewCusOnMonth = this.itemBooking.filter(el => { return moment(el.trialsVersionDate).month() === moment().month() && moment(el.trialsVersionDate).year() === moment().year() && (el.paymentStatus === 'confirm' || el.paymentStatus === 'finish') && el.bookingTypeShop === 'booking' }).length
      let dataCus = this.itemBooking.filter(el => { return el.paymentStatus === 'finish' && el.bookingTypeShop === 'booking' })
      for (let i = 0; i < dataCus.length; i++) {
        let d = dataCus[i]
        d.countBooking = d.countBooking || 0
        if (parseInt(d.countBooking) === 0) {
          this.countNewCus = this.countNewCus + 1
        } else {
          this.countOldCus = this.countOldCus + 1
        }
      }
      this.countWaitStoreFront = this.itemBooking.filter(el => { return el.paymentStatus === 'wait' && el.bookingTypeShop === 'storeFront' }).length
      this.countFinishStoreFront = this.itemBooking.filter(el => { return el.paymentStatus === 'finish' && el.bookingTypeShop === 'storeFront' }).length
      this.countConfirmStoreFront = this.itemBooking.filter(el => { return el.paymentStatus === 'confirm' && el.bookingTypeShop === 'storeFront' }).length
      this.countNoCashStoreFront = this.itemBooking.filter(el => { return el.paymentStatus === 'noCash' && el.bookingTypeShop === 'storeFront' }).length
      this.countInactiveStoreFront = this.itemBooking.filter(el => { return el.paymentStatus === 'inactive' && el.bookingTypeShop === 'storeFront' }).length
      this.countNewCusOnMonthStoreFront = this.itemBooking.filter(el => { return moment(el.trialsVersionDate).month() === moment().month() && moment(el.trialsVersionDate).year() === moment().year() && (el.paymentStatus === 'confirm' || el.paymentStatus === 'finish') && el.bookingTypeShop === 'storeFront' }).length
      let dataCusStoreFront = this.itemBooking.filter(el => { return el.paymentStatus === 'finish' && el.bookingTypeShop === 'storeFront' })
      for (let i = 0; i < dataCusStoreFront.length; i++) {
        let d = dataCusStoreFront[i]
        d.countBooking = d.countBooking || 0
        if (parseInt(d.countBooking) === 0) {
          this.countNewCusStoreFront = this.countNewCusStoreFront + 1
        } else {
          this.countOldCusStoreFront = this.countOldCusStoreFront + 1
        }
      }
      this.countWaitLoyalty = this.itemBooking.filter(el => { return el.paymentStatus === 'wait' && el.bookingTypeShop === 'loyalty' }).length
      this.countFinishLoyalty = this.itemBooking.filter(el => { return el.paymentStatus === 'finish' && el.bookingTypeShop === 'loyalty' }).length
      this.countConfirmLoyalty = this.itemBooking.filter(el => { return el.paymentStatus === 'confirm' && el.bookingTypeShop === 'loyalty' }).length
      this.countNoCashLoyalty = this.itemBooking.filter(el => { return el.paymentStatus === 'noCash' && el.bookingTypeShop === 'loyalty' }).length
      this.countInactiveLoyalty = this.itemBooking.filter(el => { return el.paymentStatus === 'inactive' && el.bookingTypeShop === 'loyalty' }).length
      this.countNewCusOnMonthLoyalty = this.itemBooking.filter(el => { return moment(el.trialsVersionDate).month() === moment().month() && moment(el.trialsVersionDate).year() === moment().year() && (el.paymentStatus === 'confirm' || el.paymentStatus === 'finish') && el.bookingTypeShop === 'loyalty' }).length
      let dataCusLoyalty = this.itemBooking.filter(el => { return el.paymentStatus === 'finish' && el.bookingTypeShop === 'loyalty' })
      // for (let i = 0; i < dataCusLoyalty.length; i++) {
      //   let d = dataCusLoyalty[i]
      //   d.paymentDate = d.paymentDate || ''
      //   console.log('moment(d.paymentDate)', moment(d.paymentDate).format('YYYY-MM'))
      //   if (moment(d.paymentDate).format('YYYY-MM') === moment().format('YYYY-MM')) {
      //     this.countNewCusLoyalty = this.countNewCusLoyalty + 1
      //   } else {
      //     this.countOldCusLoyalty = this.countOldCusLoyalty + 1
      //   }
      // }
      for (let i = 0; i < dataCusLoyalty.length; i++) {
        let d = dataCusLoyalty[i]
        d.countBooking = d.countBooking || 0
        if (parseInt(d.countBooking) === 0) {
          this.countNewCusLoyalty = this.countNewCusLoyalty + 1
        } else {
          this.countOldCusLoyalty = this.countOldCusLoyalty + 1
        }
      }
      let sumAmountAll = 0
      for (let i = 0; i < this.itemBooking.length; i++) {
        let d = this.itemBooking[i]
        if (d.paymentStatus === 'finish' && d.paymentDateMMYY === this.dateStart) {
          console.log('sumAmountAll', d.paymentAmountTrue)
          sumAmountAll = sumAmountAll + parseFloat(d.paymentAmountTrue || 0)
        }
      }
      if (sumAmountAll > 0) {
        this.sumAmountAll = sumAmountAll.toFixed(2)
      }
      // this.sumAmountAll = this.itemBooking.filter(el => { return el.paymentStatus === 'finish' }).reduce((n, {paymentAmountTrue}) => parseFloat(n) + parseFloat(paymentAmountTrue), 0)
      this.getSelect(this.getSelectText, this.typeMain)
    },
    async changStatus (item, text, typeMain) {
      let textShow = ''
      if (text === 'finish') {
        textShow = 'ชำระเรียบร้อย'
      } else if (text === 'wait') {
        textShow = 'ลูกค้าชำระอีกครั้ง'
      } else if (text === 'confirm') {
        textShow = 'Active'
      } else if (text === 'inactive') {
        textShow = 'Inactive'
      }
      console.log('changStatus', item, text)
      this.$swal({
        title: 'ต้องการเปลี่ยนแปลงสถานะเป็น ' + textShow + ' ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (result) => {
          if (item.id && text !== 'inactiveToactive') {
            let url = ''
            if (typeMain === 'loyalty') {
              url = this.DNS_IP_Loyalty + '/system_shop_Payment/edit/' + item.id
            } else {
              url = this.DNS_IP + '/system_shop_Payment/edit/' + item.id
            }
            let dt = {
              paymentStatus: text,
              LAST_USER: this.$session.getAll().data.userName
            }
            // }
            await axios.post(url, dt).then(async (response) => {
              if (text === 'inactive') {
                await this.updateShopActive('inactive', item, typeMain)
                this.checkSearch()
              } else if (text === 'confirm') {
                if (item.shopActive === 'inactive') {
                  await this.updateShopActive('active', item, typeMain)
                  this.checkSearch()
                } else {
                  this.checkSearch()
                }
              } else {
                this.checkSearch()
              }
            })
          } else {
            if (text === 'inactive') {
              await this.updateShopActive('inactive', item, typeMain)
              this.checkSearch()
            } else if (text === 'inactiveToactive') {
              await this.updateShopActive('active', item, typeMain)
              this.checkSearch()
            } else {
              this.$swal(
                'พบความผิดพลาดระหว่างดำเนินการ',
                'ไม่มีข้อมูลร้านค้า',
                'info'
              )
            }
          }
        })
    },
    async updateShopActive (text, item, typeMain) {
      let url = ''
      let ds = {}
      if (typeMain === 'loyalty') {
        url = this.DNS_IP_Loyalty + '/sys_shop/edit/' + item.shopId
        ds = {
          shopStatus: text,
          LAST_USER: this.$session.getAll().data.userName
        }
      } else {
        url = this.DNS_IP + '/sys_shop/edit/' + item.shopId
        ds = {
          shopActive: text,
          LAST_USER: this.$session.getAll().data.userName
        }
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          url,
          ds
        )
        .then(async (response) => {
        })
    },
    getSelect (text, type) {
      if (type === 'loyalty') {
        this.headers = [
          { text: 'รูปร้าน', value: 'shopImge' },
          { text: 'BT', value: 'btNumber' },
          { text: 'ชื่อร้าน', value: 'shopName' },
          // { text: 'วันที่นัดหมาย', value: 'dueDate' },
          { text: 'เบอร์โทร', value: 'billingPhone' },
          { text: 'email', value: 'contactEmail' },
          { text: 'จำนวนการแจกคะแนน', value: 'countBooking' },
          { text: 'สลิป', value: 'paymentImage' },
          { text: 'ยอดเงินที่ชำระ', value: 'paymentDateuse' },
          { text: 'สถานะ', value: 'paymentStatus' },
          { text: 'วันที่จ่าย/วันที่หมดอายุ', value: 'paymentDate' },
          { text: 'วันที่สิ้นสุดทดลองใช้', value: 'trialsVersionDate' },
          { text: 'จัดการข้อมูล', value: 'action', sortable: false, align: 'center' }
        ]
      } else {
        this.headers = [
          { text: 'รูปร้าน', value: 'shopImge' },
          { text: 'BT', value: 'btNumber' },
          { text: 'ชื่อร้าน', value: 'shopName' },
          // { text: 'วันที่นัดหมาย', value: 'dueDate' },
          { text: 'เบอร์โทร', value: 'billingPhone' },
          { text: 'email', value: 'contactEmail' },
          { text: 'จำนวนนัดหมายที่สร้างของเดือนที่แล้ว', value: 'countBooking' },
          { text: 'สลิป', value: 'paymentImage' },
          { text: 'ยอดเงินที่ชำระ', value: 'paymentDateuse' },
          { text: 'สถานะ', value: 'paymentStatus' },
          { text: 'วันที่จ่าย/วันที่หมดอายุ', value: 'paymentDate' },
          { text: 'วันที่สิ้นสุดทดลองใช้', value: 'trialsVersionDate' },
          { text: 'จัดการข้อมูล', value: 'action', sortable: false, align: 'center' }
        ]
      }
      this.getSelectText = text
      this.itemBookingUse = this.itemBooking.filter(el => { return el.paymentStatus === this.getSelectText && el.bookingTypeShop === type })
      this.setDataExportSearch()
      console.log('this.itemBookingUse', this.itemBookingUse)
    },
    getSelectNewMonth (text) {
      this.getSelectText = text
      this.headers = [
        { text: 'รูปร้าน', value: 'shopImge' },
        { text: 'BT', value: 'btNumber' },
        { text: 'ชื่อร้าน', value: 'shopName' },
        // { text: 'วันที่นัดหมาย', value: 'dueDate' },
        { text: 'เบอร์โทร', value: 'billingPhone' },
        { text: 'email', value: 'contactEmail' },
        { text: 'จำนวนนัดหมายที่สร้างของเดือนที่แล้ว', value: 'countBooking' },
        { text: 'สลิป', value: 'paymentImage' },
        { text: 'ยอดเงินที่ชำระ', value: 'paymentDateuse' },
        { text: 'สถานะ', value: 'paymentStatus' },
        { text: 'วันที่จ่าย/วันที่หมดอายุ', value: 'paymentDate' },
        { text: 'วันวันที่สิ้นสุดทดลองใช้', value: 'trialsVersionDate' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE_SHOP' }
      ]
      this.itemBookingUse = this.itemBooking.filter(el => { return moment(el.trialsVersionDate).month() === moment().month() && moment(el.trialsVersionDate).year() === moment().year() && (el.paymentStatus === 'confirm' || el.paymentStatus === 'finish') })
    },
    setDataExport () {
      this.itemBookingUseExport = []
      for (let i = 0; i < this.itemBookingUse.length; i++) {
        let d = this.itemBookingUse[i]
        d.trialsVersionDate = d.trialsVersionDate || ''
        if (d.trialsVersionDate !== '') {
          if (d.trialsVersionDate.includes(this.dateExport)) { this.itemBookingUseExport.push(d) }
        }
      }
    },
    exportExcel () {
      const dataWS = XLSX.utils.json_to_sheet(this.itemBookingUseExport)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, dataWS)
      XLSX.writeFile(wb, 'export_' + this.getSelectText + '_' + this.dateExport + '.xlsx')
    },
    setDataExportSearch () {
      this.itemBookingUseExportSearch = []
      for (let i = 0; i < this.itemBookingUse.length; i++) {
        let d = this.itemBookingUse[i]
        let s = {}
        s.btNumber = d.btNumber
        s.shopName = d.shopName
        s.billingPhone = d.billingPhone
        s.contactEmail = d.contactEmail
        s.countBooking = d.countBooking
        s.paymentAmount = d.paymentAmount
        s.paymentStatus = d.paymentStatus
        s.paymentDate = d.paymentDate
        s.trialsVersionDate = d.trialsVersionDate
        // console.log(Object.keys(d).some(key => ('' + d[key]).includes(this.search)))
        if (Object.keys(s).some(key => ('' + s[key]).includes(this.search))) { this.itemBookingUseExportSearch.push(d) }
      }
      console.log(this.itemBookingUseExportSearch)
    },
    exportExcelSearch () {
      const dataWS = XLSX.utils.json_to_sheet(this.itemBookingUseExportSearch)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, dataWS)
      XLSX.writeFile(wb, 'export_' + this.getSelectText + '_search.xlsx')
    }
  }
}
</script>
<style scope>
.plan_button {
  padding-bottom: 10px;
}
#margin {
  margin-top: 50px;
  margin-bottom: 40px;
}
.v_text_edit {
  Width: 255px;
  Height: 52px;
  font-size: 10px !important;
}
#subtext {
  color: #173053;
  font-size: 30px !important;
  font-weight: bold;
}
</style>
