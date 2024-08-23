<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div :class="dialogwidth === '50%' ? 'pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4': 'px-lg-4'" :style="dialogwidth === '50%' ? '' : 'overflow-x: hidden;height:100vh;background-color: #1B437C;padding-bottom: 80px;'">
        <v-row>
          <v-col cols="6" class="text-left" v-if="dialogwidth === '50%'">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
          <v-col
            cols="6"
            class="v-margit_button text-right"
            v-if="dialogwidth === '50%'"
          >
            <v-item-group mandatory>
              <v-container>
                <v-row class="d-flex">
                  <v-col col="auto" class="text-right">
                    <v-btn
                      color="info"
                      fab
                      style="border-radius: 20px !important;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                      @click="checkSearch()"
                    >
                      <v-icon color="white">mdi-backup-restore</v-icon>
                    </v-btn>
                    <ModelBookingList></ModelBookingList>
                  </v-col>
                </v-row>
              </v-container>
            </v-item-group>
          </v-col>
          <v-col cols="6" v-else></v-col>
        </v-row>
        <v-card flat v-if="!overlay">
          <v-card-text>
            <div class="text-center">
              <waitingAlert></waitingAlert>
            </div>
          </v-card-text>
        </v-card>

        <template v-else>
          <v-form
            ref="form_search"
            v-model="validSearch1"
            lazy-validation
            v-if="dialogwidth === '50%'"
          >
            <v-row>
              <v-col cols="2">
                <v-select
                  v-model="masBranchID"
                  background-color="white"
                  style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                  hide-details
                  :items="branchItem"
                  label="สาขา"
                  outlined
                  dense
                  required
                  :disabled="statusBranchReadonly"
                  :rules="[rules.required]"
                  @change="searchBooking(), getDataFlow()"
                  ><template #prepend-inner>
                    <v-icon
                      color="#69D1FD"
                      style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                    >
                      mdi-map-marker-outline
                    </v-icon>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                  v-model="flowSelect"
                  hide-details
                  background-color="white"
                  :items="DataFlowItem"
                  label="ประเภทบริการ"
                  outlined
                  dense
                  required
                  :rules="[rules.required]"
                  @change="setFlowSelect(),searchBooking()"
                >
                  <template #prepend-inner>
                    <v-icon
                      color="#69D1FD"
                      style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                    >
                      mdi-note-text-outline
                    </v-icon>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="2">
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
                      label="วัน/เดือน/ปี"
                      readonly
                      outlined
                      dense
                      required
                      :rules="[rules.required]"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <template #prepend-inner>
                        <v-icon
                          color="#69D1FD"
                          style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                        >
                          mdi-calendar
                        </v-icon>
                      </template></v-text-field
                    >
                  </template>
                  <v-date-picker
                    @input="(menuStart = false),checkSearch(), resetSearchText(), resetFlowSelect()"
                    v-model="dateStart"
                    no-title
                    scrollable
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="4" class="pt-0">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="ค้นหา"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn
                  color="primary"
                  class="ma-2"
                  outlined
                  @click="exportExcel()"
                >
                  <v-icon>mdi-calendar-multiselect</v-icon>
                  Export
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="DataFlowItem.length > 0">
              <v-col
                col="auto"
                v-for="(item3, index3) in DataFlowItem"
                :key="index3"
                style="display: flex;justify-content: center;"
              >
                <template v-if="item3.value === 'allFlow'">
                    <v-card
                    v-if="itemBookingCount.length > 0"
                    elevation="1"
                    :color="search === '' ? '#C9F2DC' : 'white'"
                    style="padding: 10px; width: 230px;"
                    @click="searchFlow(item3)">
                    <div style="margin: auto 0;">
                      <strong>{{ item3.text }}</strong>
                      <div>
                        จำนวน :
                        {{
                          itemBookingCount.reduce((sum, item) => sum + item.countFlow, 0)
                        }}
                      </div>
                    </div>
                  </v-card>
                  <v-card
                    v-else
                    elevation="1"
                    color="white"
                    style="padding: 10px; width: 230px;"
                    @click="searchFlow(item3)"
                  >
                    <div style="margin: auto 0;">
                      <strong>{{ item3.text }}</strong>
                      <div>จำนวน : 0</div>
                    </div>
                  </v-card>
                </template>
                 <template v-else>
                  <v-card
                    v-if="itemBookingCount.filter(el => { return el.flowId === item3.value}).length > 0"
                    elevation="1"
                    :color="item3.text === search ? '#C9F2DC' : 'white'"
                    style="padding: 10px; width: 230px;"
                    @click="searchFlow(item3)">
                    <div style="margin: auto 0;">
                      <strong>{{ item3.text }}</strong>
                      <div>
                        จำนวน :
                        {{
                          itemBookingCount.filter(el => {
                            return el.flowId === item3.value;
                          })[0].countFlow
                        }}
                      </div>
                    </div>
                  </v-card>
                  <v-card
                    v-else
                    elevation="1"
                    color="white"
                    style="padding: 10px; width: 230px;"
                    @click="searchFlow(item3)"
                  >
                    <div style="margin: auto 0;">
                      <strong>{{ item3.text }}</strong>
                      <div>จำนวน : 0</div>
                    </div>
                  </v-card>
                </template>
              </v-col>
            </v-row>
          </v-form>
          <v-form
            ref="form_search"
            v-model="validSearch2"
            lazy-validation
            v-else
          >
            <v-row>
              <v-col cols="12"  class="pl-10 pr-10">
                <v-select
                  v-model="masBranchID"
                  background-color="white"
                  style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                  hide-details
                  :items="branchItem"
                  label="สาขา"
                  outlined
                  dense
                  required
                  :disabled="statusBranchReadonly"
                  :rules="[rules.required]"
                  @change="searchBooking(),getDataFlow()"
                  ><template #prepend-inner>
                    <v-icon
                      color="#69D1FD"
                      style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                    >
                      mdi-map-marker-outline
                    </v-icon>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" class="pl-10 pr-10">
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
                      readonly
                      outlined
                      dense
                      required
                      :rules="[rules.required]"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <template #prepend-inner>
                        <v-icon
                          color="#69D1FD"
                          style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                        >
                          mdi-calendar
                        </v-icon>
                      </template></v-text-field
                    >
                  </template>
                  <v-date-picker
                    @input="(menuStart = false), checkSearch()"
                    v-model="dateStart"
                    no-title
                    scrollable
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" class="mb-4" style="text-align: center;">
                <ModelBookingList></ModelBookingList>
              </v-col>
            </v-row>
          </v-form>
          <v-row v-if="dialogwidth === '50%'">
            <v-col cols="12">
              <v-card>
                <v-data-table
                  :headers="headers"
                  :items="itemBooking"
                  :search="search"
                  disable-pagination
                  hide-default-footer
                >
                  <template v-slot:[`item.dueDate`]="{ item }">
                    {{ format_dateFUllTime(item.dueDate) }}
                  </template>
                  <template v-slot:[`item.action1`]="{ item }">
                    <v-btn
                      class="btnTobicon"
                      color="#809FB8"
                      small
                      dark
                      wigth="46px"
                      height="46px"
                      outlined
                      @click="(overlay = false), setPrint(item, 'th')"
                    >
                      <v-icon> mdi-printer </v-icon>
                      TH
                    </v-btn>
                    <v-btn
                      class="btnTobicon"
                      color="#809FB8"
                      small
                      dark
                      wigth="46px"
                      height="46px"
                      outlined
                      @click="(overlay = false), setPrint(item, 'en')"
                    >
                      <v-icon> mdi-printer </v-icon>
                      EN
                    </v-btn>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-row
                      class="text-center"
                      v-if="
                        item.statusBt !== 'closeJob' &&
                      item.statusBt !== 'cancel'
                      "
                    >
                      <v-col cols="3" class="pb-0">
                        <v-btn
                          color="#24C74D"
                          small
                          rounded
                          block
                          :disabled="item.statusBt === 'confirm' ? false : true"
                          @click="closeJobSubmit(item)"
                          :class="
                            item.statusBt === 'confirm' ? 'text-white' : ''
                          "
                        >
                          เรียกคิว
                        </v-btn>
                      </v-col>
                      <v-col cols="3" class="pb-0">
                        <v-btn
                          color="#F38383"
                          small
                          rounded
                          block
                          :disabled="
                            item.statusBt === 'confirmJob' ? false : true
                          "
                          @click="closeJobSubmitReturn(item)"
                          :class="
                            item.statusBt === 'confirmJob' ? 'text-white' : ''
                          "
                        >
                          เรียกคิวซ้ำ
                        </v-btn>
                      </v-col>
                      <v-col cols="3" class="pb-0">
                        <v-btn
                          color="#1B437C"
                          small
                          rounded
                          block
                          :disabled="
                            item.statusBt === 'confirmJob' ? false : true
                          "
                          @click="backHomeSubmit(item)"
                          :class="
                            item.statusBt === 'confirmJob' ? 'text-white' : ''
                          "
                        >
                          เสร็จสิ้น
                        </v-btn>
                      </v-col>
                      <v-col cols="3" class="pb-0">
                        <v-btn
                          color="error"
                          small
                          rounded
                          block
                          @click="removeQueue(item)"
                          :class="
                            item.statusBt === 'confirmJob' ? 'text-white' : ''
                          "
                        >
                          ยกเลิกคิว
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row
                      class="text-center"
                      v-if="item.statusBt === 'closeJob'"
                    >
                      <v-col cols="12" class="text-center">
                        <v-chip class="ma-2" color="primary" text-color="white">
                          ปิดงานแล้ว
                          <v-icon right>
                            mdi-checkbox-marked-circle
                          </v-icon>
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-row
                      class="text-center"
                      v-if="item.statusBt === 'cancel'"
                    >
                      <v-col cols="12" class="text-center">
                        <v-chip class="ma-2" color="error" text-color="white">
                          ยกเลิกคิวแล้ว
                          <v-icon right>
                            mdi-delete
                          </v-icon>
                        </v-chip>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.storeFrontQueue`]="{ item }">
                    <v-row>
                      <v-col cols="12">
                        <v-row>
                          <v-col
                            col="auto"
                            class="text-ceter"
                            v-if="
                              item.userId === 'user-skip' ||
                            item.userId === '' ||
                            item.userId === null ||
                            item.userId === 'data import'
                            "
                          >
                            {{ item.storeFrontQueue }}
                          </v-col>
                          <template v-else>
                            <v-col col="auto" class="text-ceter">
                              <a
                                @click.stop="openHistory(item)"
                                style="cursor:hand"
                                ><u>{{ item.storeFrontQueue }}</u></a
                              >
                            </v-col>
                          </template>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="itemBooking.filter(el => el.statusBt !== 'closeJob').length > 0 &&dialogwidth !== '50%'" justify="center">
            <v-col cols="10">
              <v-row>
                <v-slide-group mandatory>
                  <v-slide-item v-for="(item, n) in DataFlowItem" :key="n">
                    <template>
                      <v-card
                        elevation="1"
                        class="ma-2"
                        min-width="100px"
                        height="76px"
                        :style="'border-radius: 15px 15px 15px 15px;'"
                        :color="modelslide === item.value ? '#092C4C' : ''"
                        v-if="itemBookingCount.filter(el => {return (el.flowId === item.value || item.value === 'allFlow');}).length > 0"
                        @click="(modelslide = item.value),item.value === 'allFlow' ? (itemBooking = itemBookingUse) : (itemBooking = itemBookingUse.filter(el => { return el.flowId === item.value;}))">
                        <v-card-text>
                          <div class="text-center">
                            <template>
                              <strong
                                v-if="item.value !== 'allFlow'"
                                style="color:#FFFFFF;background-color:#092C4C;min-height: 30px;width:30px;border-radius: 80px 80px 80px 80px;display: flex;justify-content: center;align-items: center;"
                                >{{
                                  itemBookingCount.filter(el => {
                                    return el.flowId === item.value;
                                  })[0].countFlow
                                }}</strong
                              >
                              <strong
                                v-if="item.value !== 'allFlow'"
                                :class="
                                  modelslide === item.value ? 'text-white' : ''">{{ item.text }}</strong>
                              <strong
                                v-else
                                :class="
                                  modelslide === item.value ? 'text-white' : ''">{{ item.text }}</strong>
                            </template>
                          </div>
                        </v-card-text>
                      </v-card>
                      <v-card
                        elevation="1"
                        min-width="100px"
                        height="76px"
                        class="ma-2"
                        v-else
                        :style="'border-radius: 15px 15px 15px 15px;'"
                        >
                        <v-card-text>
                          <div class="text-center">
                            <template>
                              <strong
                                v-if="item.value !== 'allFlow'"
                                style="color:#FFFFFF;background-color:#092C4C;min-height: 30px;width:30px;border-radius: 80px 80px 80px 80px;display: flex;justify-content: center;align-items: center;"
                                >0</strong
                              >
                              <strong v-if="item.value !== 'allFlow'">{{
                                item.text
                              }}</strong>
                              <strong v-if="item.value === 'allFlow'">{{
                                item.text
                              }}</strong>
                            </template>
                          </div>
                        </v-card-text>
                      </v-card>
                    </template>
                  </v-slide-item>
                </v-slide-group>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              v-for="(item, id) in itemBooking.filter(
              el => el.statusBt !== 'closeJob' && el.statusBt !== 'cancel'
              )"
              :key="id"
            >
              <v-card
                class="mx-6 pa-3 ma-2"
                style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;"
              >
                <div mb-n5>
                  <!-- <h6 style="color:#092C4C" class="text-left font-weight-bold ml-10">{{ item.flowName }}</h6> -->
                  <v-row>
                    <v-col cols="12" class="pb-0 pt-0">
                      <v-btn
                        v-if="item.statusBt === 'confirmJob' || item.statusBt === 'confirm'"
                        color="#ECEFF1"
                        class="ma-2 white--text"
                        fab
                        elevation="1"
                        small
                        @click="removeQueue(item)"
                      >
                        <v-icon color="red" size="40">
                          mdi-delete-circle
                        </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="8" class="pt-0 pl-0">
                      <p
                        style="color:#092C4C;font-size: 48px;"
                        class="text-left font-weight-black mt-n1 mb-n5 pa-7 pt-0"
                        v-if="
                          item.userId === 'user-skip' ||
                          item.userId === '' ||
                          item.userId === null ||
                          item.userId === 'data import'
                        "
                      >
                        {{ item.storeFrontQueue }}
                      </p>
                      <p
                        @click.stop="openHistory(item)"
                        style="color:#092C4C;font-size: 48px;"
                        class="text-left font-weight-black mt-n1 mb-n5 pa-7 pt-0"
                        v-else
                      >
                        {{ item.storeFrontQueue }}
                      </p>
                      <p
                        style="color:#000000;font-size: 16px;"
                        class="text-left font-weight-medium mt-n10 ml-7"
                      >
                        {{ item.cusName }}
                      </p>
                      <p
                        style="color:#000000;font-size: 16px;"
                        class="text-left font-weight-medium ml-7"
                        v-if="checkShowCount"
                      >
                        จำนวน : {{ item.countCus }}
                      </p>
                      <p style="color:#000000;font-size: 16px;" class="text-left font-weight-medium ml-7"
                        v-if="checkShowTel">
                        เบอร์โทร : {{ item.cusPhone }}
                      </p>
                      <p
                        style="color:#000000;font-size: 16px;"
                        class="text-left font-weight-medium mt-n3 ml-7"
                      >
                        {{
                          languageSelect === 0
                          ? item.servicePoint
                          : JSON.parse(item.servicePointCount).filter(el => {
                                return el.textTh === item.servicePoint;
                          }).length > 0
                            ? JSON.parse(item.servicePointCount).filter(el => {
                                return el.textTh === item.servicePoint;
                            })[0].textEn
                            : item.servicePoint
                        }}
                      </p>
                    </v-col>
                    <v-col cols="4" class="pt-0">
                      <div class="mt-5" align="center">
                      </div>
                    </v-col>
                  </v-row>
                  <!-- <h5 v-if="item.servicePoint" class="text-start  ml-10 mt-2"><strong>{{ languageSelect === 0 ? item.servicePoint : JSON.parse(item.servicePointCount).filter(el => { return el.textTh === item.servicePoint}).length > 0 ? JSON.parse(item.servicePointCount).filter(el => { return el.textTh === item.servicePoint})[0].textEn:item.servicePoint}}</strong></h5> -->
                  <div class="text-center">
                    <v-btn
                      color="#F8CD70"
                      rounded
                      min-width="88px"
                      v-if="item.cusPhone !== ''"
                      @click="dial(item.cusPhone)"
                    >
                      <strong class="text-white">โทร</strong>
                    </v-btn>
                    <v-btn
                      color="#1B437C"
                      rounded
                      min-width="88px"
                      :disabled="item.statusBt === 'confirmJob' ? false : true"
                      @click="closeJobSubmitReturn(item)"
                    >
                      <strong class="text-white">เรียกคิวซ้ำ</strong>
                    </v-btn>
                    <v-btn
                      color="#F38383"
                      rounded
                      min-width="88px"
                      :disabled="item.statusBt === 'confirmJob' ? false : true"
                      @click="backHomeSubmit(item)"
                    >
                      <strong class="text-white">ปิดงาน</strong>
                    </v-btn>
                  </div>
                  <!-- <v-row> -->
                  <!-- <v-col col="12" class="text-center">
                    <div class=" mt-2" style="display: flex;">
                      <v-icon  color="#F38080" class="iconify" data-icon="ic:twotone-access-time"></v-icon>
                      <p class="font-weight-medium text-center ma-0 ml-2" v-if="dateStart" style="font-size:16px;color:#979797;">
                        {{momentThaiText(dateStart)}}</p>
                    </div>
                  </v-col> -->
                  <!-- <v-col cols="6" class="pl-0 pr-0">
                    <div class="text-start mt-2" style="display: flex;word-break: break-word;">
                      <v-icon color="#979797" class="mx-1 mr-2">mdi-map-marker-radius</v-icon>
                      <p class="font-weight-medium mb-1" style="font-size:16px;color:#979797;" v-if="masBranchID !== ''">
                      สาขา : {{branchItem.filter(el => { return masBranchID === el.value })[0].text}}
                    </p>
                    </div>
                  </v-col> -->
                  <!-- </v-row> -->
                </div>
                <v-btn
                  @click="closeJobSubmit(item)"
                  :disabled="item !== null && (item.statusBt === 'confirm') ? false : true"
                  dark
                  fab
                  :class="`rounded-btn-circle justify-content-center align-items-center ${item !== null && (item.statusBt === 'confirm')  ? 'rounded-btn-confirm-circle':'rounded-btn-closejob-circle'}`">
                  <div class="d-flex flex-column">
                  <div><v-icon size="45" class='m-2'>mdi-bell-ring</v-icon></div>
                  <div><span :class="`text-event ${item !== null && item.statusBt === 'confirm' ? 'text-white' :'text-bell-disabled'}`">เรียกคิว</span></div>
                  </div>
                </v-btn>
              </v-card>
            </v-col>
            <br />
          </v-row>
        </template>
        <v-dialog
          v-model="dialogPrint"
          scrollable
          transition="dialog-bottom-transition"
          persistent
          max-width="100%"
        >
          <v-card class="text-center">
            <v-card-text>
              <iframe id="pdfV" style="width:100%; height: 900px"></iframe>
            </v-card-text>
            <v-card-actions class="text-center">
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                class="button"
                dark
                large
                @click="dialogPrint = false"
              >
                ปิด
              </v-btn>
              <!-- </div> -->
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogHistory"
          scrollable
          persistent
          :max-width="dialogwidth"
        >
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6" class="text-left pt-10">
                    <h3><strong>รายละเอียดนัดหมาย</strong></h3>
                  </v-col>
                  <v-col cols="6" class="pt-10">
                    <div style="text-align: end;">
                      <v-btn
                        class="mx-2"
                        fab
                        small
                        dark
                        color="white"
                        :style="styleCloseBt"
                        @click="(dialogHistory = false), searchBooking()"
                      >
                        X
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <div class="avatar text-center">
                      <v-avatar size="120" style="border:5px solid #FFFFFF;">
                        <v-img
                          v-if="pictureUrHistory"
                          :src="pictureUrHistory"
                        ></v-img>
                        <v-icon size="100" color="orange" v-else>
                          mdi-tooltip-account
                        </v-icon>
                      </v-avatar>
                    </div>
                    <br />
                    <template v-if="HistoryData.length > 0">
                      <h6 class="text-start font-weight-bold">
                        {{ format_dateThai(HistoryData[0].dueDate) }}
                      </h6>
                      <h6 class="text-start font-weight-bold">
                        {{ HistoryData[0].flowName }}
                      </h6>
                      <h6 class="text-start font-weight-bold">
                        {{ HistoryData[0].masBranchName }}
                      </h6>
                      <div v-for="(item3, index3) in HistoryData" :key="index3">
                        <p class="text-start" v-if="item3.fieldValue !== ''">
                          <strong>{{ item3.fieldName }} : </strong>
                          {{ item3.fieldValue }}
                        </p>
                      </div>
                      <v-btn
                        color="#1B437C"
                        small
                        dark
                        @click="sendQonline(HistoryData[0])"
                      >
                        <v-icon left>mdi-send-check-outline</v-icon>
                        ส่งคิวออนไลน์
                      </v-btn>
                    </template>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogServicePointStatus"
          scrollable
          persistent
          :max-width="dialogwidth"
        >
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="10" class="text-left pt-10">
                    <h3><strong>กรุณาเลือกจุดบริการ</strong></h3>
                  </v-col>
                  <v-col cols="2" class="pt-7">
                    <div style="text-align: end;">
                      <v-btn
                        class="mx-2"
                        fab
                        small
                        dark
                        color="white"
                        :style="styleCloseBt"
                        @click="
                        (dialogServicePointStatus = false), searchBooking()
                        "
                      >
                        X
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row v-if="overlaySave">
                  <v-col cols="12">
                    <!-- <v-select
                        v-model="servicePoint"
                        item-text="textTh"
                        item-value="textTh"
                        background-color="white"
                        style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                        hide-details
                        :items="servicePointItem"
                        label="จุดบริการ"
                        outlined
                        dense
                        ><template #prepend-inner>
                          <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                            mdi-access-point
                          </v-icon>
                        </template>
                      </v-select> -->
                    <v-radio-group v-model="servicePoint" row>
                      <v-row>
                        <v-col
                          class="px-0"
                          cols="4"
                          v-for="(n, id) in servicePointItem"
                          :key="id"
                        >
                          <v-radio
                            :label="`${n.textTh}`"
                            :value="n.textTh"
                          ></v-radio>
                        </v-col>
                      </v-row>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      color="#1DBF73"
                      block
                      v-if="statusReturn"
                      dark
                      @click="closeJobServicePointReturn(closeItem)"
                    >
                      เรียกคิว
                    </v-btn>
                    <v-btn
                      v-else
                      color="#1DBF73"
                      block
                      dark
                      @click="closeJobServicePoint(closeItem)"
                    >
                      เรียกคิว
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col clos="12" class="text-center">
                    <waitingAlert></waitingAlert>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-footer
          v-if="dialogwidth !== '50%'"
          fixed
          padless
          color="#1B437C"
          class="text-center"
          style="justify-content: center;padding-top: 10px;"
        >
          <p class="text-white" width="100%">POWERED BY BETASK CONSULTING</p>
        </v-footer>
      </div>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import pdfMake from 'pdfmake'
import pdfFonts from '../../assets/custom-fonts.js' // 1. import custom fonts
import moment from 'moment-timezone'
import printJS from 'print-js'
import XLSX from 'xlsx' // import xlsx
import ModelBookingList from '../DialogModels/ModelBookingList.vue'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    waitingAlert,
    ModelBookingList
  },
  data () {
    return {
      unsubscribe: null,
      userFlow: '',
      userBranch: [],
      statusBranchReadonly: false,
      checkShowTel: false,
      modelslide: '',
      shopPhone: '',
      languageSelect: 0,
      servicePointItem: [],
      servicePoint: '',
      closeItem: '',
      dialogServicePointStatus: false,
      validSearch1: true,
      validSearch2: true,
      statusReturn: false,
      itemBooking: [],
      itemBookingUse: [],
      BookingDataList: [],
      menuStart: false,
      dialogPrint: false,
      overlay: true,
      overlaySave: true,
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
        { text: 'คิว', value: 'storeFrontQueue' },
        // { text: 'วันที่นัดหมาย', value: 'dueDate' },
        { text: 'บริการ', value: 'flowName' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        // { text: 'H.N.', value: 'hnNo' },
        { text: 'วันที่นัดหมาย', value: 'CREATE_DATEtext' },
        {
          text: 'ปริ้นบัตรคิว',
          value: 'action1',
          sortable: false,
          align: 'center'
        },
        {
          text: 'การจัดการคิว',
          value: 'action',
          sortable: false,
          align: 'center',
          width: '400px'
        }
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
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
        counterIDcard: value => value.length <= 13 || 'Max 13 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      dataLineConfig: {},
      HistoryData: [],
      pictureUrHistory: '',
      dialogHistory: false,
      itemBookingCount: [],
      itemBookingCount2: [],
      setTimerCalendar: null,
      checkShowCount: false,
      dataSearchFlow: null
    }
  },
  computed: {
    dialogwidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '90%'
        case 'sm':
          return '70%'
        case 'md':
          return '50%'
        case 'lg':
          return '50%'
        case 'xl':
          return '50%'
      }
    }
  },
  created () {
    // this.dateStart = '2024-07-20'
    this.dateStart = moment().format('YYYY-MM-DD')
    this.getFirestore()
  },
  beforeDestroy () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  async mounted () {
    this.dataLineConfig = await this.getDataLineConfig(
      this.$session.getAll().data.shopId
    )
    await this.getCustomFieldStart()
    if (this.checkShowCount && !this.checkShowTel) {
      this.headers = [
        { text: 'คิว', value: 'storeFrontQueue' },
        // { text: 'วันที่นัดหมาย', value: 'dueDate' },
        { text: 'บริการ', value: 'flowName' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        { text: 'จำนวนที่นั่ง', value: 'countCus' },
        {
          text: 'เวลาที่ลูกค้ากดรับบัตร',
          value: 'CREATE_DATEtime',
          align: 'center'
        },
        {
          text: 'ปริ้นบัตรคิว',
          value: 'action1',
          sortable: false,
          align: 'center'
        },
        {
          text: 'การจัดการคิว',
          value: 'action',
          sortable: false,
          align: 'center',
          width: '400px'
        }
      ]
    } else if (this.checkShowCount && this.checkShowTel) {
      this.headers = [
        { text: 'คิว', value: 'storeFrontQueue' },
        // { text: 'วันที่นัดหมาย', value: 'dueDate' },
        { text: 'บริการ', value: 'flowName' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        { text: 'เบอร์โทร', value: 'cusPhone' },
        { text: 'จำนวนที่นั่ง', value: 'countCus' },
        { text: 'เวลา', value: 'CREATE_DATEtime', align: 'center' },
        {
          text: 'ปริ้นบัตรคิว',
          value: 'action1',
          sortable: false,
          align: 'center'
        },
        {
          text: 'การจัดการคิว',
          value: 'action',
          sortable: false,
          align: 'center',
          width: '400px'
        }
      ]
    } else if (!this.checkShowCount && this.checkShowTel) {
      this.headers = [
        { text: 'คิว', value: 'storeFrontQueue' },
        // { text: 'วันที่นัดหมาย', value: 'dueDate' },
        { text: 'บริการ', value: 'flowName' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        { text: 'เบอร์โทร', value: 'cusPhone' },
        { text: 'เวลา', value: 'CREATE_DATEtime', align: 'center' },
        {
          text: 'ปริ้นบัตรคิว',
          value: 'action1',
          sortable: false,
          align: 'center'
        },
        {
          text: 'การจัดการคิว',
          value: 'action',
          sortable: false,
          align: 'center',
          width: '400px'
        }
      ]
    } else {
      this.headers = [
        { text: 'คิว', value: 'storeFrontQueue' },
        // { text: 'วันที่นัดหมาย', value: 'dueDate' },
        { text: 'บริการ', value: 'flowName' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        // { text: 'H.N.', value: 'hnNo' },
        {
          text: 'เวลาที่ลูกค้ากดรับบัตร',
          value: 'CREATE_DATEtime',
          align: 'center'
        },
        {
          text: 'ปริ้นบัตรคิว',
          value: 'action1',
          sortable: false,
          align: 'center'
        },
        {
          text: 'การจัดการคิว',
          value: 'action',
          sortable: false,
          align: 'center',
          width: '400px'
        }
      ]
    }
    await this.getDataBranch()
    await this.getDataFlow()
    await this.searchBooking('unNoti')
    // this.dateStart = '2024-07-20'
    this.dateStart = moment().format('YYYY-MM-DD')
    this.setTime()
    this.getShop()
    console.log('this.detectBrowser() >>>>>>>>>>>>>>>>>> ', navigator.userAgent)
  },
  methods: {
    async getCustomFieldStart () {
      this.checkShowCount = false
      this.checkShowTel = false
      await axios
        .get(
          this.DNS_IP +
          '/customField/get?shopId=' +
          this.$session.getAll().data.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (
                d.fieldName === 'จำนวนคน' ||
                d.fieldName === 'จำนวนที่นั่ง' ||
                d.fieldName === 'จำนวนลูกค้า' ||
                d.fieldName === 'จำนวนกี่ท่าน'
              ) {
                this.checkShowCount = true
                break
              }
            }
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (d.fieldName === 'เบอร์โทร') {
                this.checkShowTel = true
                break
              }
            }
          }
        })
        .catch(async err => {
          // this.$router.push({ name: '404' })
          console.log('getCustomFieldStart', err)
        })
    },
    async removeQueue (item) {
      console.log('removeQueue', item)
      let checkCatch = 0
      let statusBooking = await this.checkBookingStatus(item.bookNo)
      if (statusBooking === 'confirmJob' || statusBooking === 'confirm') {
        this.$swal({
          title: `ต้องการยกเลิกคิว ${item.storeFrontQueue} ใช่หรือไม่?`,
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1DBF73',
          cancelButtonColor: '#F38383',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async response => {
          // await this.clearConfirmJob(item.dueDate)
          var dtt = {
            bookNo: item.bookNo,
            contactDate: this.format_date(new Date()),
            status: 'cancel',
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.$session.getAll().data.userName,
            LAST_USER: this.$session.getAll().data.userName,
            remarkRemove: 'เนื่องจากลูกค้าไม่มาตามคิวที่เลือก'
          }
          await axios
            .post(this.DNS_IP + '/booking_transaction/add', dtt)
            .then(async responses => {
              this.$swal('เรียบร้อย', 'ยกเลิกคิวสำเร็จ', 'success')
              await this.updateProcessShopNew()
            })
        })
          .catch(async err => {
            // this.$router.push({ name: '404' })
            checkCatch = checkCatch + 1
            console.log(err.code, err.message)
            if (checkCatch < 4) {
              await this.searchBooking('unNoti')
            }
          })
      } else {
        this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
        await this.searchBooking('unNoti')
      }
    },
    resetSearchText () {
      this.search = ''
    },
    setFlowSelect () {
      this.DataFlowItem.filter(el => {
        return el.value === this.flowSelect
      })
    },
    resetFlowSelect () {
      this.flowSelect = 'allFlow'
      // this.searchBooking()
    },
    searchFlow (item3) {
      console.log('item3', item3)
      this.dataSearchFlow = item3
      if (item3.value === 'allFlow') {
        this.itemBooking = this.itemBookingUse
        this.itemBooking.sort((a, b) => {
          if (a.statusBt !== b.statusBt) {
            const order = ['confirmJob', 'confirm', 'closeJob', 'cancel']
            return order.indexOf(a.statusBt) - order.indexOf(b.statusBt)
          }
          // ถ้า statusBt เหมือนกัน ให้เปรียบเทียบ string storeFrontQueue (กำหนด numeric: true เพื่อกำหนดให้ localeCompare เช็คระดับตัวเลขใน string นั้นด้วย)
          // undefined = ใช้ค่าภาษาเริ่มต้นของระบบหรือเบราว์เซอร์ที่กำลังใช้งานอยู่ในการเปรียบเทียบสตริง
          // sensitivity: 'base' = ไม่สนใจตัวพิมพ์เล็ก/ใหญ่และสัญลักษณ์เกี่ยวกับตัวอักษร
          return a.storeFrontQueue.localeCompare(b.storeFrontQueue, undefined, {numeric: true, sensitivity: 'base'})
        })
        this.search = ''
        this.flowSelect = item3.value
      } else {
        this.itemBooking.filter(el => el.flowId === item3.value)
        this.itemBooking.sort((a, b) => {
          if (a.statusBt !== b.statusBt) {
            const order = ['confirmJob', 'confirm', 'closeJob', 'cancel']
            return order.indexOf(a.statusBt) - order.indexOf(b.statusBt)
          }
          // ถ้า statusBt เหมือนกัน ให้เปรียบเทียบ string storeFrontQueue (กำหนด numeric: true เพื่อกำหนดให้ localeCompare เช็คระดับตัวเลขใน string นั้นด้วย)
          // undefined = ใช้ค่าภาษาเริ่มต้นของระบบหรือเบราว์เซอร์ที่กำลังใช้งานอยู่ในการเปรียบเทียบสตริง
          // sensitivity: 'base' = ไม่สนใจตัวพิมพ์เล็ก/ใหญ่และสัญลักษณ์เกี่ยวกับตัวอักษร
          return a.storeFrontQueue.localeCompare(b.storeFrontQueue, undefined, {numeric: true, sensitivity: 'base'})
        })
        this.search = item3.text
        this.flowSelect = item3.value
      }
    },
    momentThaiText (item) {
      let dt = moment(item)
        .locale('th')
        .format('LL')
      return dt
    },
    dial: function (number) {
      window.location = 'tel:' + number
    },
    async sendQonline (item) {
      let dtt = {
        checkGetQueue: 'False'
      }
      await axios
        .post(this.DNS_IP + '/Booking/pushMsgQueue/' + item.bookNo, dtt)
        .then(async responses => {
          this.$swal({
            title: 'Send successfully',
            text: 'ส่งสำเร็จ',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        })
        .catch(error => {
          console.log('error function pushMsgQueue : ', error)
        })
    },
    async openHistory (item) {
      // console.log('this.BookingDataList[item.bookNo]', this.BookingDataList[item.bookNo])
      // this.HistoryData = this.BookingDataList[item.bookNo]
      const BookingData = await axios
        .get(this.DNS_IP + '/BookingData/get_history?bookNo=' + item.bookNo)
        .then(async response => {
          return response.data
        })
        .catch(error => {
          console.log('error function addData : ', error)
          return null
        })
      this.HistoryData = BookingData || []
      this.pictureUrHistory = item.memberPicture
      this.dialogHistory = true
    },
    async getShop () {
      let shopImg = ''
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.shopName = rs[0].shopName
            shopImg = rs[0].imageBase64 || ''
          } else {
            this.shopName = ''
            this.shopImg = ''
            shopImg = ''
          }
          if (shopImg !== '') {
            this.shopImg = shopImg
          } else {
            this.shopImg = ''
          }
        })
    },
    validate (Action) {
      switch (Action) {
        case 'SEARCH':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_search.validate()
          })
          break
        default:
          break
      }
    },
    checkSearch () {
      this.validate('SEARCH')
      this.searchBooking('unNoti')
    },
    async searchBooking (checkNoti, item) {
      console.log('searchBooking', checkNoti, item)
      if (this.validSearch1 || this.validSearch2) {
        let itemBookingTem = []
        let itemBookingCountTem = []
        this.overlaySave = false
        this.itemBookingUse = []
        // comment เพื่อให้ตอนคลิกที่ card แล้วมีการ searchBooking ใหม่ จะยัง active ที่ card ที่เลือกไว้อยู่
        // this.modelslide = ''
        if (this.checkShowCount) {
          await this.getBookingDataList(this.dateStart)
        }
        if (this.$session.getAll().data.flowId !== null) {
          try {
            let checkArrayFlow = JSON.parse(this.$session.getAll().data.flowId)
            console.error('checkArrayFlow.length: ', checkArrayFlow.length)
            if (checkArrayFlow.length === 1) {
              this.flowSelect = checkArrayFlow[0]
            }
          } catch (error) {
            console.error('Error parsing JSON: ', error)
          }
        }
        console.log('this.flowSelect : ???????? ', this.flowSelect)
        let urlApi = {}
        if (this.flowSelect === 'allFlow') {
          urlApi =
            this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&masBranchID=' +
            this.masBranchID +
            // '&flowId=' +
            // this.flowSelect +
            '&dueDate=' +
            this.dateStart +
            '&storeFrontQueue=is not null&statusBt=confirm and confirmJob and closeJob and cancel'
          // '&dueDate=' +
          // this.dateStart + ' ' + this.time + '&storeFrontQueue=is not null&statusBt=confirm'
        } else {
          urlApi =
            this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&flowId=' +
            this.flowSelect +
            '&dueDate=' +
            this.dateStart +
            '&storeFrontQueue=is not null&statusBt=confirm and confirmJob and closeJob'
        }
        await axios
          .get(urlApi)
          .then(async response => {
            let rs = response.data
            if (rs && rs.length > 0) {
              let sortData = rs.sort((a, b) => {
                if (a.storeFrontQueue < b.storeFrontQueue) return -1
                return a.storeFrontQueue > b.storeFrontQueue ? 1 : 0
              })
              for (let i = 0; i < sortData.length; i++) {
                let d = sortData[i]
                if (this.checkShowCount) {
                  d.countCus = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'จำนวนที่นั่ง', 'จำนวนคน')
                  d.countCus = (d.countCus.length > 0) ? d.countCus[0].fieldValue : ''
                }
                d.cusName = d.bookingDataCustomerName || ''
                // s.cusReg = d.bookingDataCustomerRegisNumber || ''
                d.cusPhone = d.bookingDataCustomerTel || ''
                // s.displayFlowName = d.displayFlowName || ''
                // ป้องกันการ push ข้อมูลเบิ้ล โดยเช็คเอาเฉพาะ bookNo ที่ไม่ซ้ำกันใส่ใน array itemBookingUse
                const isDuplicate = this.itemBookingUse.some(item => item.bookNo === d.bookNo)
                if (!isDuplicate) {
                  this.itemBookingUse.push(d)
                }
              }
              itemBookingTem = this.itemBookingUse
              for (let i = 0; i < this.itemBookingUse.length; i++) {
                let d = this.itemBookingUse[i]
                if (d.statusBt === 'confirm' || d.statusBt === 'confirmJob') {
                  let checkFlow = itemBookingCountTem.filter(el => { return el.flowId === d.flowId })
                  let checkIndexFlow = itemBookingCountTem.findIndex(el => { return el.flowId === d.flowId })
                  if (checkFlow && checkFlow.length > 0) {
                    itemBookingCountTem[checkIndexFlow].countFlow = itemBookingCountTem[checkIndexFlow].countFlow + 1
                  } else {
                  // this.itemBookingCount.push({flowId: d.flowId, flowName: d.flowName, statusBt: d.statusBt, countFlow: 1})
                    itemBookingCountTem.push({flowId: d.flowId, flowName: d.flowName, statusBt: d.statusBt, countFlow: 1})
                  }
                }
              }
              if (this.modelslide === '' || this.modelslide === 'allFlow') {
                itemBookingTem = this.itemBookingUse
              } else {
                if (this.dialogwidth !== '50%') {
                  itemBookingTem = this.itemBookingUse.filter(el => {
                    return el.flowId === this.modelslide
                  })
                }
              }
              this.itemBooking = itemBookingTem
              this.itemBookingCount = itemBookingCountTem
              this.itemBooking.sort((a, b) => {
                if (a.statusBt !== b.statusBt) {
                  const order = ['confirmJob', 'confirm', 'closeJob', 'cancel']
                  return order.indexOf(a.statusBt) - order.indexOf(b.statusBt)
                }
                // ถ้า statusBt เหมือนกัน ให้เปรียบเทียบ string storeFrontQueue (กำหนด numeric: true เพื่อกำหนดให้ localeCompare เช็คระดับตัวเลขใน string นั้นด้วย)
                // undefined = ใช้ค่าภาษาเริ่มต้นของระบบหรือเบราว์เซอร์ที่กำลังใช้งานอยู่ในการเปรียบเทียบสตริง
                // sensitivity: 'base' = ไม่สนใจตัวพิมพ์เล็ก/ใหญ่และสัญลักษณ์เกี่ยวกับตัวอักษร
                return a.storeFrontQueue.localeCompare(b.storeFrontQueue, undefined, {numeric: true, sensitivity: 'base'})
              })
              console.log('item3', this.dataSearchFlow)
              if (this.dataSearchFlow === null) {
                this.searchFlow({
                  'text': 'ทั้งหมด',
                  'value': 'allFlow'
                })
              }
              if (checkNoti === 'noti') {
                if (item.storeFrontNotifyStatus === 'True') {
                  if (parseInt(item.storeFrontNotifySet) > 0) {
                    this.pushMessageRecallQueue(parseInt(item.storeFrontNotifySet), 'False')
                  }
                }
              }
            } else {
              itemBookingTem = []
              this.itemBooking = []
            }
            this.overlaySave = true
          })
      } else {
        this.overlaySave = true
      }
    },
    getDataFromFieldName (data, key, key2) {
      if (data !== undefined) {
        return data.filter(function (el) {
          return el.fieldName === key || el.fieldName === key2
        })
      } else {
        return []
      }
    },
    async getBookingDataList (dateStart) {
      this.BookingDataList = []
      let url = ''
      if (this.flowSelect === 'allFlow') {
        url = `${this.DNS_IP}/BookingData/getView?shopId=${this.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
      } else {
        url = `${this.DNS_IP}/BookingData/getView?shopId=${this.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}&flowId=${this.flowSelect}`
      }
      // let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}&flowId=${this.flowSelect}`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach(row => {
              if (typeof this.BookingDataList[row.bookNo] === 'undefined') {
                this.BookingDataList[row.bookNo] = []
              }
              this.BookingDataList[row.bookNo].push(row)
            })
          }
        })
        .catch(error => {
          // this.dataEditReady = true
          this.getBookingDataList(dateStart)
          console.log('catch getBookingDataList : ', error)
        })
      console.log('this.BookingDataList1', this.BookingDataList)
    },
    setTime () {
      this.timeavailable = []
      let checkFlow = this.DataFlowItem.filter(el => {
        return el.value === this.flowSelect
      })
      if (checkFlow.length > 0) {
        if (checkFlow[0].value === 'allFlow') {
          this.timeavailable = []
        } else {
          this.timeavailable = JSON.parse(checkFlow[0].allData.setTime)
        }
      } else {
        this.timeavailable = []
      }
    },
    async getDataFlow () {
      let resultOption = []
      await axios
        .get(
          this.DNS_IP +
          `/flow/get?shopId=${this.shopId}&storeFrontCheck=True&masBranchIDAll=${this.masBranchID}`
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            if (this.$session.getAll().data.USER_ROLE === 'storeFront') {
              resultOption.push({ text: 'ทั้งหมด', value: 'allFlow' })
              for (let i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {}
                if (
                  JSON.parse(this.$session.getAll().data.flowId).filter(el => {
                    return el === d.flowId
                  }).length > 0
                ) {
                  s.text = d.flowName
                  s.value = d.flowId
                  s.allData = d
                  resultOption.push(s)
                }
              }
            } else if (
              this.$session.getAll().data.USER_ROLE === 'user' &&
              this.userBranch &&
              this.userBranch.length > 0
            ) {
              resultOption.push({ text: 'ทั้งหมด', value: 'allFlow' })
              this.statusBranchReadonly = true
              for (let i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {}
                if (
                  JSON.parse(this.$session.getAll().data.flowId).filter(el => {
                    return el === d.flowId
                  }).length > 0
                ) {
                  s.text = d.flowName
                  s.value = d.flowId
                  s.allData = d
                  resultOption.push(s)
                }
              }
            } else {
              resultOption.push({ text: 'ทั้งหมด', value: 'allFlow' })
              for (let i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {}
                s.text = d.flowName
                s.value = d.flowId
                s.allData = d
                resultOption.push(s)
                // console.log('this.DataFlowName', this.DataFlowName)
              }
            }
          } else {
            resultOption = []
          }
        })
      this.DataFlowItem = resultOption
      if (resultOption.length > 0) {
        this.flowSelect = this.DataFlowItem[0].value
      }
    },
    async getDataBranch () {
      this.branchItem = await this.getDataFromAPI(
        '/master_branch/get',
        'masBranchID',
        'masBranchName',
        ''
      )
      if (this.branchItem && this.branchItem.length > 0) {
        const branchSession = this.session.data.masBranchID
        const flowIdSession = this.session.data.flowId
        let USER_ROLE = this.session.data.USER_ROLE || ''
        if (USER_ROLE === 'user') {
          const matchBranch = this.branchItem.filter(
            branch => branch.allData.masBranchID === branchSession
          )
          this.userBranch = matchBranch
          this.branchItem =
            matchBranch.length > 0 ? matchBranch : this.branchItem
          this.userFlow = flowIdSession
        }
        this.masBranchID = this.branchItem[0].value
      }
    },
    async getDataFromAPI (url, fieldId, fieldName, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.shopId}${param}`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d[fieldName]
              s.value = d[fieldId]
              s.allData = d
              result.push(s)
              // console.log('this.DataFlowName', this.DataFlowName)
            }
          } else {
            result = []
          }
        })
      return result
    },
    async closeJobServicePointReturn (item) {
      if (this.servicePoint === '') {
        this.$swal('ผิดพลาด', 'กรุณาเลือกจุดบริการ', 'error')
      } else {
        let statusBooking = await this.checkBookingStatus(item.bookNo)
        if (statusBooking === 'confirmJob') {
          this.$swal({
            title: `ต้องการเรียกคิว ${item.storeFrontQueue} ใช่หรือไม่?`,
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1DBF73',
            cancelButtonColor: '#F38383',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          }).then(async response => {
            this.overlaySave = false
            await this.updateServicePoint(item.bookNo)
            await this.reCallNoti(item)
            let lineUserId = item.lineUserId || ''
            if (lineUserId !== '') {
              let dtt = {
                checkGetQueue: 'True'
              }
              await axios
                .post(this.DNS_IP + '/Booking/pushMsgQueueReturn/' + item.bookNo, dtt)
                .then(async responses => {}).catch(error => {
                  console.log('error function pushMsgQueueReturn : ', error)
                })
            }
            this.dialogServicePointStatus = false
            this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
            await this.searchBooking('unNoti')
          }).catch(errors => {
            console.log(errors)
          })
        } else {
          this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
          await this.searchBooking('unNoti')
        }
      }
    },
    async closeJobServicePointSubmit (item) {
      var dtt = {
        bookNo: item.bookNo,
        contactDate: this.format_date(new Date()),
        status: 'confirmJob',
        statusUse: 'use',
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/booking_transaction/add', dtt)
        .then(async responses => {
          await this.updateServicePoint(item.bookNo)
          await this.CallNoti(item)
          this.updateProcessShopNew()
          let lineUserId = item.lineUserId || ''
          if (lineUserId !== '') {
            let dtt = {
              checkGetQueue: 'True'
            }
            await axios
              .post(this.DNS_IP + '/Booking/pushMsgQueue/' + item.bookNo, dtt)
              .then(async responses => {})
              .catch(error => {
                console.log('error function pushMsgQueue : ', error)
              })
          }
          this.dialogServicePointStatus = false
          this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
          await this.searchBooking('noti', item)
        })
    },
    async closeJobServicePoint (item) {
      if (this.servicePoint === '') {
        this.$swal('ผิดพลาด', 'กรุณาเลือกจุดบริการ', 'error')
      } else {
        let statusBooking = await this.checkBookingStatus(item.bookNo)
        if (statusBooking === 'confirm') {
          this.$swal({
            title: `ต้องการเรียกคิว ${item.storeFrontQueue} ใช่หรือไม่?`,
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1DBF73',
            cancelButtonColor: '#F38383',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          }).then(async response => {
            this.overlaySave = false
            // await this.clearConfirmJob(item.dueDate)
            let USER_ROLE = this.session.data.USER_ROLE || ''
            let empId = this.session.data.empId || ''
            if (USER_ROLE === 'storeFront' && empId !== '') {
              let statusBookingCheck = await this.checkBookingStatus(item.bookNo)
              if (statusBookingCheck === 'confirm') {
                let statusUpdateEmp = await this.updateEmp(item.bookNo, 'confirm')
                if (statusUpdateEmp === true) {
                  this.closeJobServicePointSubmit(item)
                } else {
                  this.$swal(
                    'คำเตือน',
                    'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว',
                    'info'
                  )
                  this.dialogServicePointStatus = false
                  await this.searchBooking('unNoti')
                }
              } else {
                this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
                this.dialogServicePointStatus = false
                await this.searchBooking('unNoti')
              }
            } else {
              this.closeJobServicePointSubmit(item)
            }
          }).catch(errors => {
            console.log(errors)
          })
        } else {
          this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
          await this.searchBooking('unNoti')
        }
      }
    },
    async closeJobSubmitReturn (item) {
      console.log('closeJobSubmit', item)
      let statusBooking = await this.checkBookingStatus(item.bookNo)
      if (statusBooking === 'confirmJob') {
        if (item.servicePointStatus === 'True') {
          this.closeItem = item
          this.dialogServicePointStatus = true
          this.servicePoint = item.servicePoint || ''
          if (item.servicePointRecursive === 'False') {
            await this.setservicePointCount(item)
          } else {
            this.servicePointItem = JSON.parse(item.servicePointCount) || []
          }
          this.statusReturn = true
        } else {
          this.$swal({
            title: `ต้องการเรียกคิว ${item.storeFrontQueue} ใช่หรือไม่?`,
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1DBF73',
            cancelButtonColor: '#F38383',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          }).then(async response => {
            let lineUserId = item.lineUserId || ''
            this.reCallNoti(item)
            if (lineUserId !== '') {
              let dtt = {
                checkGetQueue: 'True'
              }
              await axios
                .post(this.DNS_IP + '/Booking/pushMsgQueueReturn/' + item.bookNo, dtt)
                .then(async responses => {}).catch(error => {
                  console.log('error function pushMsgQueueReturn : ', error)
                })
            }
            this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
            await this.searchBooking('unNoti')
          }).catch(errors => {
            console.log(errors)
          })
        }
      } else {
        this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
        await this.searchBooking('unNoti')
      }
    },
    async backHomeSubmit (item) {
      let statusBooking = await this.checkBookingStatus(item.bookNo)
      let checkCatch = 0
      if (statusBooking === 'confirmJob') {
        this.$swal({
          title: `ต้องการปิดงาน ${item.storeFrontQueue} ใช่หรือไม่?`,
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1DBF73',
          cancelButtonColor: '#F38383',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async response => {
          // await this.clearConfirmJob(item.dueDate)
          var dtt = {
            bookNo: item.bookNo,
            contactDate: this.format_date(new Date()),
            status: 'closeJob',
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.$session.getAll().data.userName,
            LAST_USER: this.$session.getAll().data.userName
          }
          await axios
            .post(this.DNS_IP + '/booking_transaction/add', dtt)
            .then(async responses => {
              this.$swal('เรียบร้อย', 'ปิดงานสำเร็จ', 'success')
              await this.updateProcessShopNew()
            })
        })
          .catch(async err => {
            checkCatch = checkCatch + 1
            console.log(err.code, err.message)
            if (checkCatch < 4) {
              await this.searchBooking('unNoti')
            }
          })
      } else {
        this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
        await this.searchBooking('unNoti')
      }
    },
    async setservicePointCount (item) {
      this.servicePointItem = []
      await axios
        // .get(this.DNS_IP + '/BookingData/get?shopId=' + this.shopId + '&bookNo=' + this.bookNo)
        .get(
          this.DNS_IP +
          '/booking_view/get?shopId=' +
          item.shopId +
          '&flowId=' +
          item.flowId +
          '&dueDateDay=' +
          this.dateStart +
          '&storeFrontQueue=is not null&statusBt=confirmJob&servicePointStatus=True'
        )
        .then(async response => {
          let rs = response.data
          console.log('setservicePointCount', rs)
          if (rs.status !== false) {
            let servicePointItem = rs.filter(el => {
              return el.servicePoint !== null || el.servicePoint !== ''
            })
            if (servicePointItem.length > 0) {
              if (JSON.parse(item.servicePointCount).length > 0) {
                for (
                  let i = 0;
                  i < JSON.parse(item.servicePointCount).length;
                  i++
                ) {
                  let d = JSON.parse(item.servicePointCount)[i]
                  console.log(
                    'Count',
                    servicePointItem.filter(el => {
                      return el.servicePoint === d.textTh
                    })
                  )
                  if (
                    servicePointItem.filter(el => {
                      return el.servicePoint === d.textTh
                    }).length === 0
                  ) {
                    this.servicePointItem.push(d)
                  }
                }
                if (
                  servicePointItem.filter(el => {
                    return el.servicePoint === item.servicePoint
                  }).length > 0
                ) {
                  let otherCounr = JSON.parse(item.servicePointCount).filter(
                    el => {
                      return el.textTh === item.servicePoint
                    }
                  )
                  if (otherCounr.length > 0) {
                    this.servicePointItem.push(otherCounr[0])
                  }
                }
              } else {
                this.servicePointItem = []
              }
            } else {
              this.servicePointItem = JSON.parse(item.servicePointCount) || []
            }
          } else {
            this.servicePointItem = JSON.parse(item.servicePointCount) || []
          }
        })
        .catch(err => {
          // this.$router.push({ name: '404' })
          console.log(err.code, err.message)
          this.servicePointItem = JSON.parse(item.servicePointCount) || []
        })
    },
    async closeJob (item) {
      var dtt = {
        bookNo: item.bookNo,
        contactDate: this.format_date(new Date()),
        status: 'confirmJob',
        statusUse: 'use',
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/booking_transaction/add', dtt)
        .then(async responses => {
          await this.CallNoti(item)
          let lineUserId = item.lineUserId || ''
          if (lineUserId !== '') {
            let dtt = {
              checkGetQueue: 'True'
            }
            await axios
              .post(this.DNS_IP + '/Booking/pushMsgQueue/' + item.bookNo, dtt)
              .then(async responses => {})
              .catch(error => {
                console.log('error function pushMsgQueue : ', error)
              })
          }
          this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
          await this.searchBooking('noti', item)
        })
    },
    async closeJobSubmit (item) {
      if (item.statusBt === 'confirm') {
        let statusBooking = await this.checkBookingStatus(item.bookNo)
        if (statusBooking === 'confirm') {
          if (item.servicePointStatus === 'True') {
            this.closeItem = item
            this.dialogServicePointStatus = true
            this.servicePoint = item.servicePoint || ''
            if (item.servicePointRecursive === 'False') {
              await this.setservicePointCount(item)
            } else {
              this.servicePointItem = JSON.parse(item.servicePointCount) || []
            }
            this.statusReturn = false
          } else {
            this.$swal({
              title: `ต้องการเรียกคิว ${item.storeFrontQueue} ใช่หรือไม่?`,
              type: 'question',
              showCancelButton: true,
              confirmButtonColor: '#1DBF73',
              cancelButtonColor: '#F38383',
              confirmButtonText: 'ใช่',
              cancelButtonText: 'ไม่'
            }).then(async response => {
            // await this.clearConfirmJob(item.dueDate)
              let USER_ROLE = this.session.data.USER_ROLE || ''
              let empId = this.session.data.empId || ''
              if (USER_ROLE === 'storeFront' && empId !== '') {
                let statusBookingCheck = await this.checkBookingStatus(item.bookNo)
                if (statusBookingCheck === 'confirm') {
                  let statusUpdateEmp = await this.updateEmp(item.bookNo, 'confirm')
                  if (statusUpdateEmp === true) {
                    await this.closeJob(item)
                    await this.updateProcessShopNew()
                  } else {
                    this.$swal(
                      'คำเตือน',
                      'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว',
                      'info'
                    )
                    await this.searchBooking('unNoti')
                  }
                } else {
                  this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
                  await this.searchBooking('unNoti')
                }
              } else {
                await this.closeJob(item)
                await this.updateProcessShopNew()
              }
            }).catch(errors => {
              console.log(errors)
            })
          }
        } else {
          this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
          await this.searchBooking('unNoti')
        }
      }
    },
    async clearConfirmJob (dueDateUse) {
      var dtt = {
        dueDate: dueDateUse,
        shopId: this.$session.getAll().data.shopId
      }
      await axios
        .post(this.DNS_IP + '/booking_transaction/changeQueue', dtt)
        .then(async responses => {})
    },
    async updateServicePoint (bookNo) {
      var dtt = {
        servicePoint: this.servicePoint
      }
      await axios
        .post(this.DNS_IP + '/Booking/edit/' + bookNo, dtt)
        .then(async responses => {})
    },
    async updateEmp (bookNo, status) {
      let result = ''
      var dtt = {
        storeFrontQueueEmpId: parseInt(this.session.data.empId),
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          this.DNS_IP + '/Booking/editQueueEmp/' + bookNo + '?status=' + status,
          dtt
        )
        .then(async response => {
          let rs = response.data
          result = rs.status
        })
      return result
    },
    async checkBookingStatus (bookNo) {
      let result = ''
      await axios
        .get(
          this.DNS_IP +
          '/booking_view/get?shopId=' +
          this.shopId +
          '&bookNo=' +
          bookNo
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            result = rs[0].statusBt || ''
          } else {
            result = ''
          }
        })
      return result
    },
    async CallNoti (item) {
      let dtdt = {
        bookNo: item.bookNo,
        servicePoint: this.servicePoint,
        shopId: this.$session.getAll().data.shopId,
        storeFrontQueue: item.storeFrontQueue,
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/callQueues/add', dtdt)
        .then(async responses => {})
    },
    async reCallNoti (item) {
      let dtdt = {
        statusNotify: 'False',
        servicePoint: this.servicePoint,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/callQueues/edit/' + item.audioFileId, dtdt)
        .then(async responses => {
          // this.$swal('เรียบร้อย', 'กรุณารอเรียกคิว', 'success')
          this.updateProcessShopNew()
        })
    },
    // async getBase64ImageFromURL (img) {
    //   let image = await axios.get(img, {withCredentials: true, responseType: 'arraybuffer'})
    //   let raw = Buffer.from(image.data).toString('base64')
    //   this.shopImg = 'data:' + image.headers['content-type'] + ';base64,' + raw
    // },
    setPrint (item, language) {
      let docDefinition = {}
      // let pageWidth = 598.28
      // let pageHeight = 'auto'
      if (this.shopImg === '') {
        let showTextTH = ''
        if (this.shopName === 'Krungsri Auto Ultimate Test Drive & Ride') {
          showTextTH = 'Krungsri Auto Ultimate\nTest Drive & Ride'
        } else {
          showTextTH = this.shopName
        }
        if (language === 'th') {
          console.log('TH 1')
          docDefinition = {
            pageSize: 'A4',
            content: [
              {
                text: showTextTH,
                style: 'header',
                alignment: 'center'
              },
              {
                alignment: 'center',
                text: item.flowName,
                fontSize: 30,
                widths: ['*']
              },
              {
                text: [
                  {
                    alignment: 'center',
                    text: 'หมายเลขคิวของคุณ\n',
                    fontSize: 25,
                    color: 'black'
                  },
                  {
                    alignment: 'center',
                    text: item.storeFrontQueue,
                    fontSize: 120,
                    color: 'black'
                  }
                ]
              },
              {
                text: 'QR Code สำหรับรับการแจ้งเตือน',
                fontSize: 20,
                alignment: 'center'
              },
              {
                text: '   ',
                fontSize: 5,
                widths: ['*']
              },
              {
                qr:
                  'https://liff.line.me/' +
                  this.dataLineConfig.liffMainID +
                  '/ConfirmUser?bookNo=' +
                  item.bookNo +
                  '&shopId=' +
                  item.shopId,
                fit: '300',
                alignment: 'center'
              },
              {
                text: '   ',
                fontSize: 10,
                // style: 'subheader',
                widths: ['*']
              },
              {
                text: '*ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
                // text: '*ทางโรงพยาบาลขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
                fontSize: 20,
                alignment: 'center'
              },
              // {
              //   text: '   ',
              //   fontSize: 25,
              //   widths: ['*']
              // },
              {
                columns: [
                  {
                    fontSize: 20,
                    alignment: 'center',
                    text: 'วันที่ ' + item.dueDateText.split(' ')[0]
                  }
                ]
              }
              // {
              //   text: '................................................',
              //   style: 'subheader',
              //   widths: ['*'],
              //   alignment: 'center'
              // }
            ],
            styles: {
              header: {
                fontSize: 30,
                bold: true
              },
              subheader: {
                fontSize: 29,
                bold: true
              },
              quote: {
                italics: true
              },
              small: {
                fontSize: 8
              },
              defaultStyle: {
                columnGap: 20
              },
              tableExample: {
                margin: [0, 5, 0, 15]
              }
            },
            defaultStyle: {
              font: 'Kanit'
            }
          }
        } else {
          console.log('TH 2')
          docDefinition = {
            pageSize: 'A4',
            content: [
              {
                text: showTextTH,
                style: 'header',
                alignment: 'center'
              },
              {
                alignment: 'center',
                text: item.flowNameEn,
                fontSize: 30,
                widths: ['*']
              },
              {
                alignment: 'center',
                text: 'Number',
                fontSize: 23,
                color: 'black'
              },
              {
                alignment: 'center',
                text: item.storeFrontQueue,
                fontSize: 110,
                color: 'black'
              },
              {
                text: 'QR Code for receiving notifications',
                fontSize: 18,
                alignment: 'center'
              },
              {
                text: '   ',
                fontSize: 8,
                widths: ['*']
              },
              {
                qr:
                  'https://liff.line.me/' +
                  this.dataLineConfig.liffMainID +
                  '/ConfirmUser?bookNo=' +
                  item.bookNo +
                  '&shopId=' +
                  item.shopId,
                fit: '300',
                alignment: 'center'
              },
              {
                text: '   ',
                fontSize: 8,
                // style: 'subheader',
                widths: ['*']
              },
              {
                text:
                  "The company reserves the right to skip the queue.\nIn case the customer doesn't come",
                // text: "The hospital reserves the right to skip the queue. In case the customer doesn't come",
                fontSize: 18,
                alignment: 'center'
              },
              {
                columns: [
                  {
                    fontSize: 18,
                    alignment: 'center',
                    text: 'Date ' + item.dueDateText.split(' ')[0]
                  }
                ]
              }
              // {
              //   text: '................................................',
              //   style: 'subheader',
              //   widths: ['*'],
              //   alignment: 'center'
              // }
            ],
            styles: {
              header: {
                fontSize: 30,
                bold: true
              },
              subheader: {
                fontSize: 29,
                bold: true
              },
              quote: {
                italics: true
              },
              small: {
                fontSize: 8
              },
              defaultStyle: {
                columnGap: 20
              },
              tableExample: {
                margin: [0, 5, 0, 15]
              }
            },
            defaultStyle: {
              font: 'Kanit'
            }
          }
        }
      } else {
        if (language === 'th') {
          console.log('TH 3')
          docDefinition = {
            pageSize: 'A4',
            content: [
              {
                text: this.shopName,
                style: 'header',
                alignment: 'center'
              },
              {
                image: 'mySuperImage',
                width: 150,
                alignment: 'center'
              },
              // {
              //   text: '   ',
              //   style: 'header',
              //   widths: ['*']
              // },
              // {
              //   text: '   ',
              //   style: 'subheader',
              //   widths: ['*']
              // },
              // {
              //   columns: [
              //     {
              //       style: 'subheader',
              //       text: 'รับคิวเวลา'
              //     },
              //     {
              //       style: 'subheader',
              //       text: item.timeText,
              //       alignment: 'right'
              //     }
              //   ]
              // },
              {
                alignment: 'center',
                text: item.flowName,
                fontSize: 30,
                widths: ['*']
              },
              {
                text: [
                  {
                    alignment: 'center',
                    text: 'หมายเลขคิวของคุณ\n',
                    fontSize: 20,
                    color: 'black'
                  },
                  {
                    alignment: 'center',
                    text: item.storeFrontQueue,
                    fontSize: 120,
                    color: 'black'
                  }
                ]
                // alignment: 'center',
                // style: 'tableExample',
                // table: {
                //   heights: [50],
                //   widths: ['*'],
                //   body: [
                //     [
                //       {
                //         text: [
                //           {text: 'หมายเลขคิวของคุณ\n', fontSize: 20, color: 'black'},
                //           {text: item.storeFrontQueue, fontSize: 120, color: 'black'}
                //         ],
                //         border: [false, false, false, false]
                //         // fillColor: '#092C4C'
                //       }
                //     ]
                //   ]
                // }
              },
              {
                text: 'QR Code สำหรับรับการแจ้งเตือน',
                fontSize: 15,
                alignment: 'center'
              },
              {
                qr:
                  'https://liff.line.me/' +
                  this.dataLineConfig.liffMainID +
                  '/ConfirmUser?bookNo=' +
                  item.bookNo +
                  '&shopId=' +
                  item.shopId,
                fit: '200',
                alignment: 'center'
              },
              {
                text: '   ',
                fontSize: 15,
                // style: 'subheader',
                widths: ['*']
              },
              {
                text: '*ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
                // text: '*ทางโรงพยาบาลขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
                fontSize: 15,
                alignment: 'center'
              },
              // {
              //   text: '   ',
              //   fontSize: 25,
              //   widths: ['*']
              // },
              {
                columns: [
                  {
                    fontSize: 15,
                    alignment: 'center',
                    text: 'วันที่ ' + item.dueDateText.split(' ')[0]
                  }
                ]
              },
              {
                text: '................................................',
                style: 'subheader',
                widths: ['*'],
                alignment: 'center'
              }
            ],
            images: {
              mySuperImage: this.shopImg

              // in browser is supported loading images via url (https or http protocol) (minimal version: 0.1.67)
              // snow: this.shopImg

              // is supported loading images via url with custom headers (minimal version: 0.2.5)
              // strawberries: {
              //   url: 'https://picsum.photos/id/1080/367/267',
              //   headers: {
              //     myheader: '123',
              //     myotherheader: 'abc',
              //   }
              // }
            },
            styles: {
              header: {
                fontSize: 30,
                bold: true
              },
              subheader: {
                fontSize: 29,
                bold: true
              },
              quote: {
                italics: true
              },
              small: {
                fontSize: 8
              },
              defaultStyle: {
                columnGap: 20
              },
              tableExample: {
                margin: [0, 5, 0, 15]
              }
            },
            defaultStyle: {
              // 4. default style 'KANIT' font to test
              font: 'Kanit'
            }
          }
        } else {
          console.log('TH 4')
          docDefinition = {
            pageSize: 'A4',
            content: [
              {
                text: this.shopName,
                style: 'header',
                alignment: 'center'
              },
              {
                image: 'mySuperImage',
                width: 150,
                alignment: 'center'
              },
              // {
              //   text: '   ',
              //   style: 'header',
              //   widths: ['*']
              // },
              // {
              //   text: '   ',
              //   style: 'subheader',
              //   widths: ['*']
              // },
              // {
              //   columns: [
              //     {
              //       style: 'subheader',
              //       text: 'Time'
              //     },
              //     {
              //       style: 'subheader',
              //       text: item.timeText,
              //       alignment: 'right'
              //     }
              //   ]
              // },
              // {
              //   text: '   ',
              //   style: 'subheader',
              //   widths: ['*']
              // },
              {
                alignment: 'center',
                text: item.flowNameEn,
                fontSize: 30,
                widths: ['*']
              },
              {
                alignment: 'center',
                text: 'Number',
                fontSize: 20,
                color: 'black'
              },
              {
                alignment: 'center',
                text: item.storeFrontQueue,
                fontSize: 110,
                color: 'black'
              },
              // {
              //   text: [
              //     {alignment: 'center', text: 'Number\n', fontSize: 20, color: 'black'},
              //     {alignment: 'center', text: item.storeFrontQueue, fontSize: 120, color: 'black'}
              //   ]
              //   // alignment: 'center',
              //   // style: 'tableExample',
              //   // table: {
              //   //   heights: [50],
              //   //   widths: ['*'],
              //   //   body: [
              //   //     [
              //   //       {
              //   //         text: [
              //   //           {text: 'Number\n', fontSize: 20, color: 'black'},
              //   //           {text: item.storeFrontQueue, fontSize: 120, color: 'black'}
              //   //         ],
              //   //         border: [false, false, false, false]
              //   //         // fillColor: '#092C4C'
              //   //       }
              //   //     ]
              //   //   ]
              //   // }
              // },
              {
                text: 'QR Code for receiving notifications',
                fontSize: 15,
                alignment: 'center'
              },
              {
                qr:
                  'https://liff.line.me/' +
                  this.dataLineConfig.liffMainID +
                  '/ConfirmUser?bookNo=' +
                  item.bookNo +
                  '&shopId=' +
                  item.shopId,
                fit: '200',
                alignment: 'center'
              },
              {
                text: '   ',
                fontSize: 15,
                // style: 'subheader',
                widths: ['*']
              },
              {
                text:
                  "The company reserves the right to skip the queue. In case the customer doesn't come",
                // text: "The hospital reserves the right to skip the queue. In case the customer doesn't come",
                fontSize: 15,
                alignment: 'center'
              },
              {
                columns: [
                  {
                    fontSize: 15,
                    alignment: 'center',
                    text: 'Date ' + item.dueDateText.split(' ')[0]
                  }
                ]
              },
              {
                text: '................................................',
                style: 'subheader',
                widths: ['*'],
                alignment: 'center'
              }
            ],
            images: {
              mySuperImage: this.shopImg

              // in browser is supported loading images via url (https or http protocol) (minimal version: 0.1.67)
              // snow: this.shopImg

              // is supported loading images via url with custom headers (minimal version: 0.2.5)
              // strawberries: {
              //   url: 'https://picsum.photos/id/1080/367/267',
              //   headers: {
              //     myheader: '123',
              //     myotherheader: 'abc',
              //   }
              // }
            },
            styles: {
              header: {
                fontSize: 30,
                bold: true
              },
              subheader: {
                fontSize: 29,
                bold: true
              },
              quote: {
                italics: true
              },
              small: {
                fontSize: 8
              },
              defaultStyle: {
                columnGap: 20
              },
              tableExample: {
                margin: [0, 5, 0, 15]
              }
            },
            defaultStyle: {
              // 4. default style 'KANIT' font to test
              font: 'Kanit'
            }
          }
        }
      }
      pdfMake.vfs = pdfFonts.pdfMake.vfs // 2. set vfs pdf font
      pdfMake.fonts = {
        // download default Roboto font from cdnjs.com
        Roboto: {
          normal:
            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold:
            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics:
            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics:
            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        },
        // Kanit Font
        Kanit: {
          // 3. set Kanit font
          normal: 'Kanit-Regular.ttf',
          bold: 'Kanit-Medium.ttf',
          italics: 'Kanit-Italic.ttf',
          bolditalics: 'Kanit-MediumItalic.ttf'
        }
      }
      // pdfMake.createPdf(docDefinition).open({}, window)
      // pdfMake.createPdf(docDefinition).print({}, window)

      // pdfMake.createPdf(docDefinition).print()
      // this.$scope.generatePdf = function () {
      // create the window before the callback
      // win.close()
      // }

      const userAgent = navigator.userAgent

      if (userAgent.indexOf('Firefox') > -1) {
        pdfMake.createPdf(docDefinition).download(item.storeFrontQueue + '.pdf')
      } else {
        pdfMake.createPdf(docDefinition).getDataUrl(function (outDoc) {
          let dataReplate = outDoc.replace('data:application/pdf;base64,', '')
          printJS({ printable: dataReplate, type: 'pdf', base64: true })
        })
      }

      this.overlay = true
      // var pdfFrame = window.frames['pdfV']
      // pdfFrame.print()
      // this.dialogPrint = true
    },
    async pushMessageRecallQueue (countNoti, checkGetQueue) {
      let bookSelect = this.itemBooking.filter((element, index) => {
        return element.statusBt === 'confirm'
      })
      if (bookSelect.length > 0) {
        let bookSelectuse = bookSelect.filter((element, index) => {
          return index === countNoti
        })
        for (let i = 0; i < bookSelectuse.length; i++) {
          let d = bookSelectuse[i]
          let s = {}
          s.lineUserId = d.lineUserId || ''
          if (s.lineUserId !== '') {
            let dtt = {
              checkGetQueue: checkGetQueue
            }
            await axios
              .post(this.DNS_IP + '/Booking/pushMsgQueue/' + d.bookNo, dtt)
              .then(async responses => {})
              .catch(error => {
                console.log('error function pushMsgQueue : ', error)
              })
          }
        }
      }
    },
    async exportExcel () {
      const dataBooking = []
      const BookingData = await axios.get(
        this.DNS_IP +
        '/BookingData/get?shopId=' +
        this.shopId +
        '&masBranchID=' +
        this.masBranchID +
        '&dueDate=' +
        this.dateStart
      )
      console.log('BookingData', BookingData)
      const customField = BookingData.data
      let dataExport = []
      for (let i = 0; i < this.itemBooking.length; i++) {
        dataBooking[i] = []
        let item = this.itemBooking[i]
        let statusBt = ''
        if (item.statusBt === 'confirm') {
          statusBt = 'จองคิว'
        } else if (item.statusBt === 'cancel') {
          statusBt = 'ลบคิว'
        } else if (item.statusBt === 'confirmJob') {
          statusBt = 'เรียกคิวแล้ว'
        } else if (item.statusBt === 'closeJob') {
          statusBt = 'ปิดงาน'
        } else {
          statusBt = 'ไม่มีสถานะ'
        }
        console.log('statusBt', statusBt)
        let obj = {
          เลขคิว: item.storeFrontQueue || '-',
          บริการภาษาไทย: item.flowName || '-',
          บริการภาษาอังกฤษ: item.flowNameEn || '-',
          วันที่นัดหมาย: item.dueDateTextDay + ' ' + item.CREATE_DATEtime || '-',
          สถานะ: statusBt || '-',
          วันที่สถานะ: item.CREATE_DATE_Status || '-',
          ชื่อลูกค้า: item.bookingDataCustomerName || '-',
          เบอร์โทร: item.bookingDataCustomerTel || '-',
          ชื่อLine: item.memberName || '-'
        }
        for (let a = 0; a < customField.length; a++) {
          const dt = customField[a]
          if (dt.bookNo === item.bookNo) {
            if ((dt.fieldValue !== null && dt.fieldValue !== '') && dt.fieldName !== 'ชื่อ') {
              obj[dt.fieldName] = dt.fieldValue || '-'
            }

            console.log('dt.fieldName', dt.fieldName)
            console.log('dt.fieldValue', dt.fieldValue)
          }
        }
        dataExport.push(obj)
      }
      // Populate data array with shop data

      const ws = XLSX.utils.json_to_sheet(dataExport)

      const today = new Date()
      const year = today.getFullYear()
      const month = (today.getMonth() + 1).toString().padStart(2, '0') // +1 เพราะเดือนเริ่มที่ 0
      const day = today
        .getDate()
        .toString()
        .padStart(2, '0')
      const hours = today
        .getHours()
        .toString()
        .padStart(2, '0')
      const minutes = today
        .getMinutes()
        .toString()
        .padStart(2, '0')

      const formattedDate = `${day}-${month}-${year}-${hours}-${minutes}`
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, 'BookingListQueue_' + formattedDate + '.xlsx')
    },
    async getFirestore () {
      try {
        console.log('getFirestore -> ', this.unsubscribe)
        if (this.unsubscribe) {
          this.unsubscribe()
        }
        this.firestore = this.$firebase.firestore()
        this.unsubscribe = this.firestore.collection(`QueueOnline/shopId/${this.$session.getAll().data.shopId}`).doc(this.$session.getAll().data.userName)
          .onSnapshot(async (snapshot) => {
            if (!snapshot.exists) {
              await this.createProcessShopNew()
            } else {
              console.log('getFirestore -> data', snapshot.data())
              if (snapshot.data().active === '1') {
                console.log('active [start] is updateProcessShopUpdate')
                await this.updateProcessShopUpdate()
                console.log('active [end] is updateProcessShopUpdate')
                console.log('snapshot data -> active is 1')
                console.log('active [start] is get booking')
                this.flowSelect = 'allFlow'
                await this.searchBooking('unNoti')
                console.log('item3', this.dataSearchFlow)
                this.searchFlow(this.dataSearchFlow)
                console.log('active [end] is get booking')
              } else {
                console.log('snapshot data -> active is 0')
              }
            }
          })
      } catch (error) {
        console.log('Error getFirestore', error)
      }
    },
    async createProcessShopNew () { // set active = 1
      try {
        let body = {
          userName: this.$session.getAll().data.userName,
          shopId: this.$session.getAll().data.shopId
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/QueueOnline-CreateProcessNew', body)
      } catch (error) {
        console.log('createProcessShopNew error-> ', error)
      }
    },
    async updateProcessShopNew () { // update active = 1
      try {
        let body = {
          userName: this.$session.getAll().data.userName,
          shopId: this.$session.getAll().data.shopId
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/QueueOnline-ProcessNew', body)
      } catch (error) {
        console.log('updateProcessShopNew error-> ', error)
      }
    },
    async updateProcessShopUpdate () { // update active = 0
      try {
        let body = {
          userName: this.$session.getAll().data.userName,
          shopId: this.$session.getAll().data.shopId
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/QueueOnline-ProcessUseNew', body)
      } catch (error) {
        console.log('updateProcessShopUpdate error-> ', error)
      }
    }
  }
}
</script>
<style scope>
.btnTobicon .v-btn__content {
  display: flex;
  flex-direction: column;
}
#margin {
  margin-top: 50px;
  margin-bottom: 40px;
}
.v_text_edit {
  width: 255px;
  height: 52px;
  font-size: 10px !important;
}
#subtext {
  color: #173053;
  font-size: 30px !important;
  font-weight: bold;
}
.rounded-btn-circle {
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 50em !important;
  width: 120px !important;
  height: 120px !important;
  box-sizing: border-box;
  border: 10px solid transparent;
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
}
.rounded-btn-confirm-circle {
  background: linear-gradient(#25D366,  #23B091) padding-box, linear-gradient(to right,#25D366,  #23B091) border-box;
}
.rounded-btn-closejob-circle {
  background: linear-gradient(#DADADA,  #A1A1A1) padding-box, linear-gradient(to right,#DADADA,  #A1A1A1) border-box;
}
.text-event{
  font-size: 20px;
  font-weight: bold;
}
</style>
