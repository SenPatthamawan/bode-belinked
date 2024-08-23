<template>
  <div>
    <v-main>
      <div :class="dialogwidth === '50%' ? 'pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4' : 'px-lg-4'" :style="dialogwidth === '50%' ? '' : 'overflow-x: hidden;height:100vh;background-color: #1B437C;padding-bottom: 80px;'">
        <v-row>
          <v-col cols="6" class="text-left" v-if="dialogwidth === '50%'">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
          <v-col cols="6" class="v-margit_button text-right" v-if="dialogwidth === '50%'">
            <v-col col="auto">
              <v-btn
                color="info"
                fab
                style="border-radius: 20px !important;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                @click="checkSearch()"
              >
                <v-icon color="white">mdi-backup-restore</v-icon>
              </v-btn>
            </v-col>
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
        <v-form ref="form_search" v-model="validSearch" lazy-validation v-if="dialogwidth === '50%'">
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
                :rules ="[rules.required]"
                @change="searchBooking(),clearTimeLoop()"
                ><template #prepend-inner>
                  <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
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
                :rules ="[rules.required]"
                @change="searchBooking(),clearTimeLoop()"
              >
                <template #prepend-inner>
                  <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
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
                  @input="menuStart = false, clearTimeLoop(), checkSearch()"
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
          <v-row v-if="DataFlowItem.filter(el => { return el.value !== 'allFlow' }).length > 0">
            <v-col col="auto" v-for="(item3 , index3) in DataFlowItem.filter(el => { return el.value !== 'allFlow' })" :key="index3" style="display: flex;justify-content: center;">
              <v-card
                v-if="itemBookingCount.filter(el => { return el.flowId === item3.value  }).length > 0"
                elevation="1"
                :color="(item3.text === search) ? '#C9F2DC' : 'white'"
                style="padding: 10px; width: 230px;"
                @click="searchFlow(item3)"
              >
                <div style="margin: auto 0;">
                  <strong>{{item3.text}}</strong>
                  <div>จำนวน : {{itemBookingCount.filter(el => { return el.flowId === item3.value  })[0].countFlow}}</div>
                </div>
              </v-card>
              <v-card
                v-else
                elevation="1"
                color="white"
                style="padding: 10px; width: 230px;"
              >
                <div style="margin: auto 0;">
                  <strong>{{item3.text}}</strong>
                  <div>จำนวน : 0</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
        <v-form ref="form_search" v-model="validSearch" lazy-validation v-else>
          <v-row>
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
                  @input="menuStart = false, clearTimeLoop(), checkSearch()"
                  v-model="dateStart"
                  no-title
                  scrollable
                >
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-form>
        <!-- sen -->
        <div class="pl-5 pb-5 pr-5 pt-0 mb-4">
          <v-row style="display: flex;justify-content: space-between;margin-bottom:15px;margin-top:2px;">
            <v-col cols="auto" style="text-align: end;" class="px-0 pb-0">
              <v-btn
                  class="bottomAdd"
                  style="margin-right: 0px;border-radius: 15px;color: white;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                  width="250px"
                  x-large
                  @click="addDataSet()"
                >
                  เพิ่มรายการนัดหมาย
                  <v-icon color="white" class="ml-4" >mdi-plus-circle</v-icon>
            </v-btn>
            </v-col>
          </v-row>
          </div>
<!-- sen -->
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
                @click="overlay = false, setPrint(item, 'th')"
              >
                <v-icon > mdi-printer </v-icon>
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
                @click="overlay = false, setPrint(item, 'en')"
              >
                <v-icon> mdi-printer </v-icon>
                EN
              </v-btn>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-row class="text-center" v-if="item.statusBt !== 'closeJob' && item.statusBt !== 'cancel'">
                <v-col cols="3" class="pb-0">
                  <v-btn
                    color="#24C74D"
                    small
                    rounded
                    block
                    :disabled="item.statusBt === 'confirm' ? false:true"
                    @click="closeJobSubmit(item)"
                    :class="item.statusBt === 'confirm' ? 'text-white':''"
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
                    :disabled="item.statusBt === 'confirmJob' ? false:true"
                    @click="closeJobSubmitReturn(item)"
                    :class="item.statusBt === 'confirmJob' ? 'text-white':''"
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
                    :disabled="item.statusBt === 'confirmJob' ? false:true"
                    @click="backHomeSubmit(item)"
                    :class="item.statusBt === 'confirmJob' ? 'text-white':''"
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
                    :disabled="item.statusBt === 'confirmJob' ? false:true"
                    @click="removeQueue(item)"
                    :class="item.statusBt === 'confirmJob' ? 'text-white':''"
                  >
                    ยกเลิกคิว
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="text-center" v-if="item.statusBt === 'closeJob'">
                <v-col cols="12" class="text-center">
                  <v-chip
                    class="ma-2"
                    color="primary"
                    text-color="white"
                  >
                    ปิดงานแล้ว
                    <v-icon right>
                      mdi-checkbox-marked-circle
                    </v-icon>
                  </v-chip>
                </v-col>
              </v-row>
              <v-row class="text-center" v-if="item.statusBt === 'cancel'">
                <v-col cols="12" class="text-center">
                  <v-chip
                    class="ma-2"
                    color="error"
                    text-color="white"
                  >
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
                    <v-col col="auto" class="text-ceter" v-if="item.userId === 'user-skip' || item.userId === '' || item.userId === null || item.userId === 'data import'">
                        {{ item.storeFrontQueue }}
                    </v-col>
                    <template v-else>
                      <v-col col="auto" class="text-ceter">
                        <a @click.stop="openHistory(item)" style="cursor:hand"><u>{{ item.storeFrontQueue }}</u></a>
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
        <v-row v-if="itemBooking.filter(el => el.statusBt !== 'closeJob').length > 0 && dialogwidth !== '50%'" justify="center">
          <v-col cols="10">
            <v-row>
              <v-slide-group
                mandatory
              >
                <v-slide-item
                  v-for="(item, n) in DataFlowItem"
                  :key="n"
                >
                  <v-card
                    elevation="1"
                    class="ma-2"
                    min-width="100px"
                    height="76px"
                    :style="'border-radius: 15px 15px 15px 15px;'"
                    :color="modelslide === item.value ? '#092C4C': ''"
                    v-if="itemBookingCount.filter(el => { return el.flowId === item.value || item.value === 'allFlow'  }).length > 0"
                    @click="modelslide = item.value, item.value === 'allFlow' ? itemBooking = itemBookingUse: itemBooking = itemBookingUse.filter(el => { return el.flowId === item.value })"
                  >
                      <v-card-text>
                        <div class="text-center">
                          <template>
                            <strong v-if="item.value !== 'allFlow'"  style="color:#FFFFFF;background-color:#092C4C;min-height: 30px;width:30px;border-radius: 80px 80px 80px 80px;display: flex;justify-content: center;align-items: center;">{{itemBookingCount.filter(el => { return el.flowId === item.value  })[0].countFlow}}</strong>
                            <strong v-if="item.value !== 'allFlow'" :class="modelslide === item.value ? 'text-white': ''">{{item.text}}</strong>
                            <strong v-else :class="modelslide === item.value ? 'text-white': ''">{{item.text}}</strong>
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
                            <strong v-if="item.value !== 'allFlow'"  style="color:#FFFFFF;background-color:#092C4C;min-height: 30px;width:30px;border-radius: 80px 80px 80px 80px;display: flex;justify-content: center;align-items: center;">0</strong>
                            <strong v-if="item.value !== 'allFlow'" >{{item.text}}</strong>
                            <strong v-if="item.value === 'allFlow'">{{item.text}}</strong>
                          </template>
                        </div>
                      </v-card-text>
                  </v-card>
                </v-slide-item>
              </v-slide-group>
            </v-row>
          </v-col>
          <v-col cols="12"  v-for="(item, id) in itemBooking.filter(el => el.statusBt !== 'closeJob' && el.statusBt !== 'cancel')" :key="id">
            <v-card class="mx-6 pa-3 ma-2" style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;">
              <div mb-n5>
                <v-row>
                  <v-col cols="12" class="pb-0 pt-0">
                    <v-btn
                      v-if="item.statusBt === 'confirmJob'"
                      color="#ECEFF1"
                      class="ma-2 white--text"
                      fab
                      elevation="1"
                      x-small
                      @click="removeQueue(item)"
                    >
                      <v-icon color="red">
                        mdi-delete-circle
                      </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="8" class="pt-0">
                    <p style="color:#092C4C;font-size: 48px;" class="text-left font-weight-black mt-n1 mb-n5 pa-7 pt-0" v-if="item.userId === 'user-skip' || item.userId === '' || item.userId === null || item.userId === 'data import'">{{item.storeFrontQueue}}</p>
                    <p @click.stop="openHistory(item)" style="color:#092C4C;font-size: 48px;" class="text-left font-weight-black mt-n1 mb-n5 pa-7 pt-0" v-else>{{ item.storeFrontQueue }}</p>
                    <p style="color:#000000;font-size: 16px;" class="text-left font-weight-medium mt-n10 ml-7">{{item.cusName}}</p>
                    <p style="color:#000000;font-size: 16px;" class="text-left font-weight-medium ml-7" v-if="checkShowCount">จำนวน : {{item.countCus}}</p>
                    <p style="color:#000000;font-size: 16px;" class="text-left font-weight-medium mt-n3 ml-7">{{ languageSelect === 0 ? item.servicePoint : JSON.parse(item.servicePointCount).filter(el => { return el.textTh === item.servicePoint}).length > 0 ? JSON.parse(item.servicePointCount).filter(el => { return el.textTh === item.servicePoint})[0].textEn:item.servicePoint}}</p>
                  </v-col>
                  <v-col cols="4" class="pt-0">
                    <div class="mt-5" align="center">
                      <v-img
                        @click="closeJobSubmit(item)"
                        :src="item.statusBt === 'confirm' ? 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FselectActiveQ1.png?alt=media&token=938edfa3-26a9-4c27-94a6-208cc2e81a0f': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2FselectInactiveQ1.png?alt=media&token=e7c25716-7e4d-4499-af94-8ef382a51185'" max-width="107px" max-height="107px"></v-img>
                    </div>
                  </v-col>
                </v-row>
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
                  :disabled="item.statusBt === 'confirmJob' ? false:true"
                  @click="closeJobSubmitReturn(item)"
                >
                  <strong class="text-white">เรียกคิวซ้ำ</strong>
                </v-btn>
                <v-btn
                  color="#F38383"
                  rounded
                  min-width="88px"
                  :disabled="item.statusBt === 'confirmJob' ? false:true"
                  @click="backHomeSubmit(item)"
                >
                  <strong class="text-white">ปิดงาน</strong>
                </v-btn>
                </div>
              </div>
            </v-card>
          </v-col>
          <br>
        </v-row>
        </template>
        <v-dialog v-model="dialogPrint" scrollable transition="dialog-bottom-transition" persistent max-width="100%">
              <v-card class="text-center">
                <v-card-text>
                  <iframe id='pdfV' style="width:100%; height: 900px"></iframe>
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
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogHistory" scrollable persistent :max-width="dialogwidth">
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
                          @click="dialogHistory = false,clearTimeLoop()"
                          >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                   <v-row >
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
                      <br>
                      <template v-if="HistoryData.length > 0">
                        <h6 class="text-start font-weight-bold">{{format_dateThai(HistoryData[0].dueDate)}}</h6>
                        <h6 class="text-start font-weight-bold">{{HistoryData[0].flowName}}</h6>
                        <h6 class="text-start font-weight-bold">{{HistoryData[0].masBranchName}}</h6>
                        <div v-for="(item3 , index3) in HistoryData" :key="index3">
                          <p class="text-start" v-if="item3.fieldValue !== ''"><strong>{{item3.fieldName}} : </strong> {{item3.fieldValue}}</p>
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
            <v-dialog v-model="dialogServicePointStatus" scrollable persistent :max-width="dialogwidth">
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
                          @click="dialogServicePointStatus = false,clearTimeLoop()"
                          >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                   <v-row v-if="overlaySave">
                    <v-col cols="12">
                      <v-radio-group v-model="servicePoint" row>
                        <v-row>
                          <v-col class="px-0" cols="4" v-for="(n, id) in servicePointItem" :key="id">
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
          <!-- ADD -->
          <v-dialog v-model="dialogAdd"
          max-width="100%"
          persistent>
            <v-card class="text-center">
              <v-form ref="form_add" v-model="validAdd" lazy-validation>
                <v-card-text>
                    <v-row justify="center">
                      <v-col
                        v-if="ColsDialogAdd === 'True'"
                        :cols="ColsDialogAdd === 'True' ? 8 : 8"
                      >
                        <v-col class="text-center">
                          <CalendarBooking ref="CalendarBooking"></CalendarBooking>
                        </v-col>
                      </v-col>

                      <v-col :cols="ColsDialogAdd === 'True' ? 4 : 10">
                      <!-- <v-col cols="12" sm="6" md="6" lg="6" class="v-margit_text_add mt-0 pa-0"> -->
                        <v-row>
                          <v-col cols="8" class="text-left pt-10">
                            <h3><strong>เพิ่มรายการนัดหมาย</strong></h3>
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
                                @click="(dialogAdd = false), clearDataAdd()"
                                >
                                X
                              </v-btn>
                            </div>
                          </v-col>
                        </v-row>
                        <v-col cols="12">
                          <v-checkbox
                            v-if="$session.getAll().data.shopId !== 'U52928fc4d2ed0bb777f7c1d1c95d6173'"
                            v-model="statusVIP"
                            label="เปิดจองคิวซ้ำได้"
                            false-value="False"
                            true-value="True"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            @click="date = ''"
                          ></v-checkbox>
                          <v-select
                            v-model="formAdd.masBranchID"
                            :items="branch"
                            label="สาขา"
                            outlined
                            dense
                            required
                            :rules="[rules.required]"
                            @change="priceMenuAdd = 0,drawerAdd = false,showMenu = 'False',getDataCalendaBookingAdd(),setFlowByBranchAdd()"
                          ></v-select>
                          <v-select
                            v-if="formAdd.masBranchID !== null && formAdd.masBranchID !== ''"
                            v-model="formAdd.flowId"
                            :items="dataFlowSelectAdd"
                            label="ประเภทบริการ"
                            outlined
                            dense
                            required
                            @change="priceMenuAdd = 0,drawerAdd = false, checkTime(),getDataCalendaBookingAdd(),SetallowedDates(),setFlowAdd(), date = ''"
                            :rules="[rules.required]"
                          ></v-select>
                          <template v-if="fieldNameItem">
                            <div
                              v-for="(item, index) in fieldNameItem"
                              :key="index"
                            >
                              <template
                                v-if="
                                  item.conditionField === '' ||
                                    item.conditionField === null
                                "
                              >
                                <v-col class="InputData pa-0" v-if="item.fieldType == 'text'">
                                  <v-text-field
                                    v-if="item.fieldName === 'เบอร์โทร'"
                                    v-mask="'###-###-####'"
                                    v-model="item.fieldValue"
                                    :label="item.fieldName"
                                    outlined
                                    dense
                                    required
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                  ></v-text-field>
                                  <v-text-field
                                    v-else
                                    v-model="item.fieldValue"
                                    :label="item.fieldName"
                                    outlined
                                    dense
                                    required
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" class="InputData pa-0" v-if="item.fieldType == 'number'">
                                  <v-text-field
                                    v-if="item.fieldName === 'เบอร์โทร'"
                                    v-mask="'###-###-####'"
                                    v-model="item.fieldValue"
                                    :label="item.fieldName"
                                    outlined
                                    dense
                                    required
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                  ></v-text-field>
                                  <v-text-field
                                    v-else
                                    v-model="item.fieldValue"
                                    :label="item.fieldName"
                                    outlined
                                    dense
                                    required
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'dateTime'">
                                  <v-menu
                                    v-model="menuAdd1"
                                    :close-on-content-click="false"
                                    :return-value.sync="date"
                                    :rules="[rules.required]"
                                    transition="scale-transition"
                                    offset-y
                                    required
                                    min-width="auto"
                                    ref="menuAdd1"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="item.fieldValue"
                                        readonly
                                        :label="item.fieldName"
                                        outlined
                                        dense
                                        v-bind="attrs"
                                        v-on="on"
                                        required
                                        prepend-inner-icon="mdi-calendar"
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                      >
                                      </v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="item.fieldValue"
                                      no-title
                                      scrollable
                                      @input="(menuAdd1 = false), $refs.menuAdd1.save(item.fieldValue)"
                                    >
                                    </v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'Autocompletes'">
                                  <v-autocomplete
                                    v-model="item.fieldValue"
                                    :items="JSON.parse(item.optionField)"
                                    outlined
                                    :label="item.fieldName"
                                    required
                                    dense
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                  ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'Selects'">
                                  <v-select
                                  class="mb-6"
                                    v-model="item.fieldValue"
                                    :items="JSON.parse(item.optionField)"
                                    menu-props="auto"
                                    :label="item.fieldName"
                                    clearable
                                    required
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                    dense
                                    outlined
                                  ></v-select>
                                </v-col>
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'radio'" style="padding:0px;">
                                  <v-container fluid style="padding:0px;">
                                    <v-radio-group
                                      column
                                      dense
                                      v-model="item.fieldValue"
                                      style="margin:0px;"
                                    >
                                      <template v-slot:label> </template>
                                      <div
                                        v-for="radios in JSON.parse(
                                          item.optionField
                                        )"
                                        :key="radios.toISOString"
                                      >
                                        <v-radio
                                          :label="radios.text"
                                          dense
                                          :value="radios.value"
                                        ></v-radio>
                                      </div>
                                    </v-radio-group>
                                  </v-container>
                                </v-col>
                              </template>
                              <template
                                v-if="
                                  item.conditionField !== '' &&
                                    fieldNameItem.filter(row => {
                                      return (
                                        row.fieldId ===
                                        parseInt(item.conditionField)
                                      );
                                    }).length > 0
                                "
                              >
                                <template
                                  v-if="
                                    item.conditionValue ===
                                      fieldNameItem.filter(row => {
                                        return (
                                          row.fieldId ===
                                          parseInt(item.conditionField)
                                        );
                                      })[0].fieldValue
                                  "
                                >
                                  <v-col cols="12" class="InputData" v-if="item.fieldType == 'text'">
                                    <v-text-field
                                      v-if="item.fieldName === 'เบอร์โทร'"
                                      v-mask="'###-###-####'"
                                      v-model="item.fieldValue"
                                      :label="item.fieldName"
                                      outlined
                                      required
                                      dense
                                      :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                    ></v-text-field>
                                    <v-text-field
                                      v-else
                                      v-model="item.fieldValue"
                                      :label="item.fieldName"
                                      outlined
                                      required
                                      dense
                                      :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" class="InputData" v-if="item.fieldType == 'number'">
                                    <v-text-field
                                      v-if="item.fieldName === 'เบอร์โทร'"
                                      v-mask="'###-###-####'"
                                      v-model="item.fieldValue"
                                      :label="item.fieldName"
                                      outlined
                                      required
                                      dense
                                      :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                    ></v-text-field>
                                    <v-text-field
                                      v-else
                                      v-model="item.fieldValue"
                                      :label="item.fieldName"
                                      outlined
                                      required
                                      dense
                                      :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" class="InputData" v-if="item.fieldType == 'dateTime'">
                                  <v-menu
                                    v-model="menuAdd2"
                                    :close-on-content-click="false"
                                    :return-value.sync="date"
                                    :rules="[rules.required]"
                                    transition="scale-transition"
                                    offset-y
                                    required
                                    min-width="auto"
                                    ref="menuAdd2"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="item.fieldValue"
                                        readonly
                                        :label="item.fieldName"
                                        outlined
                                        dense
                                        v-bind="attrs"
                                        v-on="on"
                                        required
                                        prepend-inner-icon="mdi-calendar"
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                      >
                                      </v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="item.fieldValue"
                                      no-title
                                      scrollable
                                      @input="(menuAdd2 = false), $refs.menuAdd2.save(item.fieldValue)"
                                    >
                                    </v-date-picker>
                                  </v-menu>
                                </v-col>
                                  <v-col cols="12" class="InputData" v-if="item.fieldType == 'Autocompletes'">
                                    <v-autocomplete
                                      v-model="item.fieldValue"
                                      :items="JSON.parse(item.optionField)"
                                      outlined
                                      :label="item.fieldName"
                                      required
                                      dense
                                      :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                    ></v-autocomplete>
                                  </v-col>
                                  <v-col cols="12" class="InputData" v-if="item.fieldType == 'Selects'">
                                    <v-select
                                    class="mb-6"
                                      v-model="item.fieldValue"
                                      :items="JSON.parse(item.optionField)"
                                      menu-props="auto"
                                      :label="item.fieldName"
                                      required
                                      dense
                                      clearable
                                      :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                      outlined
                                    ></v-select>
                                  </v-col>
                                  <v-col cols="12" class="InputData" v-if="item.fieldType == 'Radio'" style="padding:0px;">
                                    <v-container fluid style="padding:0px;">
                                      <v-radio-group
                                        row
                                        dense
                                        v-model="item.fieldValue"
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                        style="margin:0px;"
                                      >
                                        <template v-slot:label> </template>
                                        <div
                                          v-for="radios in JSON.parse(
                                            item.optionField
                                          )"
                                          :key="radios.toISOString"
                                        >
                                          <v-radio
                                            :label="radios.text"
                                            :value="radios.value"
                                            dense
                                          ></v-radio>
                                        </div>
                                      </v-radio-group>
                                    </v-container>
                                  </v-col>
                                </template>
                              </template>
                                <template  v-if="item.conditionField === 'flow' ">
                                  <template v-if="parseInt(item.conditionValue) === parseInt(formAdd.flowId) ">
                                    <v-col cols="12" class="InputData" v-if="item.fieldType == 'text'">
                                      <v-text-field
                                        v-if="item.fieldName === 'เบอร์โทร'"
                                        v-mask="'###-###-####'"
                                        v-model="item.fieldValue"
                                        :label="item.fieldName"
                                        dense
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                      <v-text-field
                                        v-else
                                        v-model="item.fieldValue"
                                        :label="item.fieldName"
                                        dense
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="InputData" v-if="item.fieldType == 'number'">
                                      <v-text-field
                                        v-if="item.fieldName === 'เบอร์โทร'"
                                        v-mask="'###-###-####'"
                                        v-model="item.fieldValue"
                                        :label="item.fieldName"
                                        dense
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                      <v-text-field
                                        v-else
                                        v-model="item.fieldValue"
                                        :label="item.fieldName"
                                        dense
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                    </v-col>
                                     <v-col cols="12" class="InputData" v-if="item.fieldType == 'dateTime'">
                                      <v-menu
                                        v-model="menuAdd3"
                                        :close-on-content-click="false"
                                        :return-value.sync="date"
                                        :rules="[rules.required]"
                                        transition="scale-transition"
                                        offset-y
                                        required
                                        min-width="auto"
                                        ref="menuAdd3"
                                      >
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-text-field
                                            v-model="item.fieldValue"
                                            readonly
                                            :label="item.fieldName"
                                            outlined
                                            dense
                                            v-bind="attrs"
                                            v-on="on"
                                            required
                                            prepend-inner-icon="mdi-calendar"
                                            :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                          >
                                          </v-text-field>
                                        </template>
                                        <v-date-picker
                                          v-model="item.fieldValue"
                                          no-title
                                          scrollable
                                          @input="(menuAdd3 = false), $refs.menuAdd3.save(item.fieldValue)"
                                        >
                                        </v-date-picker>
                                      </v-menu>
                                    </v-col>
                                    <v-col
                                      cols="12"
                                      class="InputData"
                                      v-if="item.fieldType == 'Autocompletes'"
                                    >
                                      <v-autocomplete
                                        v-model="item.fieldValue"
                                        :items="JSON.parse(item.optionField)"
                                        dense
                                        filled
                                        :label="item.fieldName"
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                      ></v-autocomplete>
                                    </v-col>
                                      <v-col cols="12" class="InputData" v-if="item.fieldType == 'Selects'">
                                        <v-select
                                        class="mb-6"
                                          v-model="item.fieldValue"
                                          :items="JSON.parse(item.optionField)"
                                          menu-props="auto"
                                          :label="item.fieldName"
                                          clearable
                                          dense
                                          :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                          hide-details
                                          outlined
                                        ></v-select>
                                      </v-col>
                                      <v-col cols="12" class="InputData" v-if="item.fieldType === 'Radio'" style="padding:0px;">
                                        <v-container fluid style="padding:0px;">
                                          <v-radio-group
                                            row
                                            v-model="item.fieldValue"
                                            style="margin:0px;"
                                            :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                          >
                                            <template v-slot:label> </template>
                                            <div
                                              v-for="radios in JSON.parse(
                                                item.optionField
                                              )"
                                              :key="radios.toISOString"
                                              class="text-center"
                                            >
                                              <v-radio
                                                :label="radios.text"
                                                dense
                                                :value="radios.value"
                                              ></v-radio>
                                            </div>
                                          </v-radio-group>
                                        </v-container>
                                      </v-col>
                                  </template>
                                </template>
                            </div>
                          </template>
                          <v-row>
                            <v-col class="pb-0 pt-0" v-if="formAdd.flowId">
                              <v-menu
                                ref="menu"
                                v-model="menuDate"
                                :close-on-content-click="false"
                                :return-value.sync="date"
                                :rules="[rules.required]"
                                transition="scale-transition"
                                offset-y
                                required
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="date"
                                    readonly
                                    label="วันที่นัดหมาย"
                                    outlined
                                    dense
                                    v-bind="attrs"
                                    v-on="on"
                                    required
                                    @click="pickerDate ? getMonth(pickerDate) : null"
                                    :rules="[rules.required]"
                                  >
                                    <template #prepend>
                                      <v-icon right>
                                        mdi-calendar
                                      </v-icon>
                                    </template>
                                  </v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="date"
                                  no-title
                                  scrollable
                                  :allowed-dates="allowedDates"
                                  :picker-date.sync="pickerDate"
                                  @change="setLimitBooking(date)"
                                  @input="(menuDate = false), $refs.menu.save(date)"
                                  :min="currentDate"
                                >
                                </v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col class="pb-0 pt-0" v-if="timeavailable.length > 0 && date !== ''">
                              <v-select
                              v-model="time"
                              :items="timeavailable"
                              label="เวลา"
                              item-text="text"
                              item-value="text"
                              persistent-hint
                              return-object
                              outlined
                              dense
                              required
                              :rules ="[rules.required]"
                            ></v-select>
                            </v-col>
                          </v-row>
                          <v-row v-if="showMenu === 'True'">
                          <sideMenu :drawerParent="drawerAdd" :toggleParent="toggleAdd" :languageSelectParent="languageSelect" :dataMenuParent="dataMenuAdd" :priceMenuParent="priceMenuAdd" @updatePriceMenuParent="updatePriceMenuAdd"></sideMenu>
                          <v-col cols="12" class="pt-0 pb-4">
                            <v-btn
                              block
                              dark
                              @click="toggleAdd"
                            >เมนู</v-btn>
                          </v-col>
                          <v-col cols="12" class="pt-0 pb-6">
                            <v-expansion-panels multiple v-model="expansionMenuAdd">
                              <v-expansion-panel>
                                <v-expansion-panel-header>รายการและราคา</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                  <div style="align-items: center;width:100%;">
                                    <v-row>
                                      <v-col cols="12" v-for="(item,id) in dataMenuAdd.filter(el => { return parseInt(el.qty) > 0 })" :key="id" style="display: flex;">
                                        <v-card class="cardMenu">
                                            <v-img
                                              class="pictureMenu"
                                              :src="item.picture"
                                            ></v-img>
                                            <v-row>
                                              <v-col cols="8" class="pt-0 pb-0 textTitelMenu">{{item.name}}</v-col>
                                              <v-col cols="8" style="display: flex;justify-content: flex-start;" class="pt-0 pb-0 textTitelMenuSub">{{item.qty}} x {{formatNumber(item.price)}}</v-col>
                                              <v-col cols="6" class="pt-0 pb-0 textTitelMenuRemark">{{item.remark}}</v-col>
                                            </v-row>
                                        </v-card>
                                      </v-col>
                                      <v-col cols="12">
                                        <v-row>
                                          <v-col cols="6"><p class="ma-0 textTitelPriceMenu">รวมราคา</p></v-col>
                                          <v-col cols="6" style="display: flex;justify-content: flex-end;" class="textTitelPriceMenu">{{formatNumber(priceMenuAdd)}}</v-col>
                                        </v-row>
                                      </v-col>
                                    </v-row>
                                  </div>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                          </v-col>
                        </v-row>
                          <v-row v-if="$session.getAll().data.shopId !== 'U9f316c85400fd716ea8c80d7cd5b61f8'">
                            <v-col class="pt-0 pb-0">
                              <v-radio-group v-model="formAdd.radiosRemark" row required :rules ="[rules.required]">
                                <v-radio value="ซ่อมปกติ">
                                  <template v-slot:label>
                                    <div class="mt-3"><strong class="primary--text">{{dataTypeJob1}}</strong></div>
                                  </template>
                                </v-radio>
                                <v-radio value="ExtraJob">
                                  <template v-slot:label>
                                    <div class="mt-3"><strong class="error--text">{{dataTypeJob2}}</strong></div>
                                  </template>
                                </v-radio>
                                <v-radio value="FastTrack">
                                  <template v-slot:label>
                                    <div class="mt-3"><strong class="orange--text">{{dataTypeJob3}}</strong></div>
                                  </template>
                                </v-radio>
                              </v-radio-group>
                            </v-col>
                          </v-row>
                          <v-row v-if="checkDepositAdd === 'True'">
                            <v-col cols="12" class="pt-0">
                              <v-checkbox
                                :label="`มีหลักฐานมัดจำหรือไม่ : ${dataDepositAdd.toString()}`"
                                false-value="ไม่มี"
                                true-value="มี"
                                v-model="dataDepositAdd"
                                hide-details
                                @change="dataDepositAdd === 'มี' ? panelDeposit = [0] : panelDeposit = []"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="12" class="pt-0" v-if="dataDepositAdd === 'มี'">
                              <v-expansion-panels
                                v-model="panelDeposit"
                                multiple
                              >
                                <v-expansion-panel>
                                  <v-expansion-panel-header>อัพเดทหลักฐานเงินมัดจำ</v-expansion-panel-header>
                                  <v-expansion-panel-content>
                                    <v-row justify="center">
                                      <v-col cols="12" class="text-center">
                                        <v-img
                                          aspect-ratio="3"
                                          contain
                                          :src="formAdd.pictureUrlPreviewDeposit"
                                        ></v-img>
                                        <br />
                                        <v-file-input
                                          counter
                                          show-size
                                          accept="image/png, image/jpeg, image/bmp"
                                          prepend-icon="mdi-camera"
                                          label="รูปหลักฐานการมัดจำ"
                                          @change="selectImgAdd"
                                          v-model="filesDepositAdd"
                                        ></v-file-input>
                                      </v-col>
                                    </v-row>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </v-col>
                            <v-col cols="12" class="pt-0 pb-0">
                              <VuetifyMoney
                                v-model="formAdd.depositPrice"
                                placeholder="จำนวนเงินมัดจำ"
                                dense
                                label="จำนวนเงินมัดจำ"
                                outlined
                                v-bind:options="options2"
                              />
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="pt-0 pb-0">
                              <v-select
                                v-if="formAdd.masBranchID !== null && formAdd.masBranchID !== ''"
                                v-model="empSelectAdd"
                                :items="empSelectStepAdd.filter((i) => i.masBranchID === formAdd.masBranchID || i.masBranchID === '')"
                                label="พนักงานที่รับนัดหมาย"
                                menu-props="auto"
                                outlined
                                required
                                :rules="[rules.required]"
                                dense
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="pt-0">
                            <v-textarea
                              v-model="remark"
                              outlined
                              label="หมายเหตุเพิ่มเติม"
                              auto-grow
                            ></v-textarea>
                            </v-col>
                          </v-row>
                          <v-row v-if="statusShowMap === 'True'">
                            <v-col class="pb-0 pt-0" cols="12">
                                <v-text-field
                                v-model="address"
                                label="ชื่อของที่อยู่"
                                outlined
                                required
                                dense
                                :rules="[rules.required]"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-card>
                                <v-card-text>
                                  <v-row>
                                    <v-col class="pb-0" cols="12">
                                      <h6>ค้นหาที่อยู่ลูกค้า :</h6>
                                    </v-col>
                                    <v-col class="mr-16" cols="12">
                                      <GmapAutocomplete id="autocompleteMap" @place_changed="updatePlace" />
                                    </v-col>
                                  </v-row>
                                </v-card-text>
                                <hr>
                                <!-- <gmap-autocomplete @place_changed="updatePlace"/> -->
                                <v-card-text>
                                <GmapMap
                                  v-if="center !== null"
                                  :center="center"
                                  @click='updateCoordinates'
                                  :zoom="15"
                                  style="width: 100%; height: 200px"
                                  :options="{ disableDefaultUI: true, fullscreenControl: true, zoomControl: true }"
                                >
                                  <GmapMarker :position="center" :draggable="true" @drag="updateCoordinates" />
                                </GmapMap>
                                </v-card-text>
                              </v-card>
                              <br>
                            </v-col>
                          </v-row>
                          <div class="text-center">
                            <v-btn
                              elevation="2"
                              large
                              color="#173053"
                              :loading="loadingAdd"
                              :disabled="loadingAdd"
                              class="white--text"
                              @click="addData()"
                            >
                              <template v-slot:loader>
                                <span class="custom-loader">
                                  <v-icon light>mdi-cached</v-icon>
                                </span>
                              </template>
                              <v-icon color="white" dark left>mdi-checkbox-marked-circle</v-icon>
                              เพิ่ม
                            </v-btn>
                          </div>
                        </v-col>
                      </v-col>
                    </v-row>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- end add -->
          <v-footer v-if="dialogwidth !== '50%'" fixed padless color="#1B437C" class="text-center" style="justify-content: center;padding-top: 10px;">
          <p class="text-white" width="100%">POWERED BY  BETASK CONSULTING</p>
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
import CalendarBooking from './CalendarBookingList.vue'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    waitingAlert,
    CalendarBooking
  },
  data () {
    return {
      // panel
      menuStart1: false,
      dateStart1: new Date().toISOString().substr(0, 7),
      masBranchID1: '',
      dataReady: false,
      branch: [],
      statusBranchReadonly: false,
      flowSelect1: '',
      DataFlowName: [],
      searchAll2: '',
      formAdd: {
        bookingId: null,
        fieldId: '',
        fieldValue: '',
        flowId: null,
        masBranchID: null,
        dueDate: '',
        shopId: this.$session.getAll().data.shopId,
        bookingFieldId: '',
        radiosRemark: '',
        depositStatus: '',
        depositImge: '',
        pictureUrlPreviewDeposit: '',
        depositPrice: 0
      },
      validAdd: true,
      statusVIP: 'False',
      fieldNameItem: [],
      dataFlowSelectAdd: [],
      showMenu: 'False',
      checkDepositAdd: '',
      remark: '',
      statusShowMap: '',
      loadingAdd: false,
      validAdd1: true,
      dataTypeJob1: '',
      dataTypeJob2: '',
      dataTypeJob3: '',
      priceMenuAdd: 0,
      drawerAdd: false,
      empSelectStepAdd: [],
      empSelectAdd: '',
      DataFlowNameDefault: [],
      menuDate: false,
      date: '',
      currentDate: moment().format('YYYY-MM-DD'),
      pickerDate: null,
      dataEmpOnsite: [],
      // end panel
      modelslide: '',
      shopPhone: '',
      languageSelect: 0,
      servicePointItem: [],
      servicePoint: '',
      closeItem: '',
      dialogServicePointStatus: false,
      validSearch: true,
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
        { text: 'ปริ้นบัตรคิว', value: 'action1', sortable: false, align: 'center' },
        { text: 'การจัดการคิว', value: 'action', sortable: false, align: 'center', width: '400px' }
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
      setTimerCalendar: null,
      checkShowCount: false
    }
  },
  computed: {
    dialogwidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '90%'
        case 'sm': return '70%'
        case 'md': return '50%'
        case 'lg': return '50%'
        case 'xl': return '50%'
      }
    },
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'xs'
        case 'sm':
          return 'sm'
        case 'md':
          return 'md'
        case 'lg':
          return 'lg'
        case 'xl':
          return 'xl'
      }
      console.log(
        'this.$vuetify.breakpoint.name',
        this.$vuetify.breakpoint.name
      )
    },
    ColsDialogAdd () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'False'
        case 'sm': return 'False'
        case 'md': return 'False'
        case 'lg': return 'True'
        case 'xl': return 'True'
      }
    }
  },
  async mounted () {
    this.dataLineConfig = await this.getDataLineConfig(this.$session.getAll().data.shopId)
    this.dateStart = this.momenDate_1(new Date())
    await this.getCustomFieldStart()
    if (this.checkShowCount) {
      this.headers = [
        { text: 'คิว', value: 'storeFrontQueue' },
        { text: 'บริการ', value: 'flowName' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        { text: 'จำนวนที่นั่ง', value: 'countCus' },
        { text: 'เวลาที่ลูกค้ากดรับบัตร', value: 'CREATE_DATEtime', align: 'center' },
        { text: 'ปริ้นบัตรคิว', value: 'action1', sortable: false, align: 'center' },
        { text: 'การจัดการคิว', value: 'action', sortable: false, align: 'center', width: '400px' }
      ]
    } else {
      this.headers = [
        { text: 'คิว', value: 'storeFrontQueue' },
        { text: 'บริการ', value: 'flowName' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        { text: 'เวลาที่ลูกค้ากดรับบัตร', value: 'CREATE_DATEtime', align: 'center' },
        { text: 'ปริ้นบัตรคิว', value: 'action1', sortable: false, align: 'center' },
        { text: 'การจัดการคิว', value: 'action', sortable: false, align: 'center', width: '400px' }
      ]
    }
    await this.getDataBranch()
    console.log('this.branchItem ok', this.branchItem)
    await this.getDataFlow()
    await this.searchBooking('unNoti')
    this.$root.$on('closeSetTimeBookingListQueue', () => {
      this.closeSetTimeBookingListQueue()
    })
    this.dateStart = moment().format('YYYY-MM-DD')
    this.clearTimeLoop()
    this.setTime()
    this.getShop()
  },
  methods: {
    async addDataInsert () {
      // this.swalConfig.title = 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?'
      // this.$swal(this.swalConfig)
      //   .then(async result => {
      if (this.$session.id() !== undefined) {
        this.dataReadyAdd = false
        var fastTrack = 'False'
        var extraJob = 'False'
        switch (this.formAdd.radiosRemark) {
          case 'ซ่อมปกติ':
            fastTrack = 'False'
            extraJob = 'False'
            break
          case 'ExtraJob':
            fastTrack = 'False'
            extraJob = 'True'
            break
          case 'FastTrack':
            fastTrack = 'True'
            extraJob = 'False'
            break
        }
        let flowIdData = this.formAdd.flowId
        let rs = this.fieldNameItem
        let Add = []
        let fielditem = this.fieldNameItem
        if (this.checkDepositAdd === 'False') {
          this.formAdd.depositStatus = ''
          this.formAdd.depositImge = ''
          this.formAdd.depositPrice = ''
        } else {
          if (this.dataDepositAdd === 'มี') {
            if (this.formAdd.depositPrice === null) {
              this.formAdd.depositPrice = ''
            }
            this.formAdd.depositStatus = 'True'
            if (this.filesDepositAdd) {
              const _this = this
              let configDepositUpload = {
                headers: {
                  'bookNo': 'BK' + moment().unix()
                }
              }
              let params = new FormData()
              params.append('file', this.filesDepositAdd)
              await axios
                .post(this.DNS_IP + `/file/upload/deposit`, params, configDepositUpload)
                .then(function (response) {
                  _this.formAdd.depositImge = response.data
                  console.log('url Pic', response.data)
                })
            } else {
              this.formAdd.depositImge = this.pictureUrlPreviewDeposit
            }
          } else {
            if (this.formAdd.depositPrice === null) {
              this.formAdd.depositPrice = ''
            }
            this.formAdd.depositStatus = 'True'
            this.formAdd.depositImge = ''
          }
        }
        console.log('this.fieldNameItem', this.fieldNameItem)
        let limitBookingCheck = ''
        if (this.checkLimitBooking.limitCheck === 'true' || null) {
          limitBookingCheck = 'True'
        } else {
          limitBookingCheck = 'False'
        }
        let storeFront = this.DataFlowNameDefault.filter(item => { return item.value === this.formAdd.flowId })
        let storeFrontCheck = ''
        if (storeFront.length > 0) {
          storeFrontCheck = storeFront[0].allData.storeFrontCheck || 'False'
        } else {
          storeFrontCheck = 'False'
        }
        let timeValue = ''
        let timeTime = ''
        if (this.time.value) {
          timeValue = this.time.value
          timeTime = this.time.text
        } else {
          timeValue = ''
          timeTime = ''
        }
        for (let i = 0; i < rs.length; i++) {
          let d = rs[i]
          let update = {}
          if (d.conditionField === '' || d.conditionField === null) {
            update.masBranchID = this.formAdd.masBranchID
            update.bookingFieldId = d.bookingFieldId
            update.remark = this.remark
            update.flowId = this.formAdd.flowId
            update.fieldId = d.fieldId
            update.fieldValue = d.fieldValue
            update.shopId = d.shopId
            update.dueDate = this.date + ' ' + timeValue
            update.dateSelect = this.date
            update.timeSelect = timeValue
            update.timeText = timeTime
            update.userId = 'user-skip'
            update.pageName = 'BookingList'
            update.sourceLink = 'direct'
            update.fastTrack = fastTrack
            update.extraJob = extraJob
            update.depositStatus = this.formAdd.depositStatus
            update.depositImge = this.formAdd.depositImge
            update.empSelect = this.empSelectAdd
            update.adminLogin = this.session.data.userName
            update.limitBookingCheck = limitBookingCheck
            update.limitBookingId = this.checkLimitBooking.ID
            update.limitBookingCount = this.checkLimitBooking.countBooking
            update.getLimitBooking = this.checkLimitBooking.limitBooking
            update.depositPrice = this.formAdd.depositPrice
            update.storeFrontCheck = storeFrontCheck
            if (this.statusVIP === 'True') {
              update.statusVIP = 'True'
            } else {
              update.statusVIP = 'False'
            }
            update.statusBookingForm = 'BookingForm'
            update.address = (this.address || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            update.addressLatLong = JSON.stringify(this.center)
            if (this.dataMenuAdd.filter((i) => parseInt(i.qty) > 0).length > 0) {
              update.menuItem = JSON.stringify(this.dataMenuAdd.filter((i) => parseInt(i.qty) > 0))
              update.menuPrice = this.priceMenuAdd
            }
            Add.push(update)
          } else {
            if (fielditem.filter(row => { return row.fieldId === parseInt(d.conditionField) }).length > 0) {
              if (d.conditionValue === fielditem.filter(row => { return row.fieldId === parseInt(d.conditionField) })[0].fieldValue) {
                update.masBranchID = this.formAdd.masBranchID
                update.bookingFieldId = d.bookingFieldId
                update.remark = this.remark
                update.flowId = this.formAdd.flowId
                update.fieldId = d.fieldId
                update.fieldValue = d.fieldValue
                update.shopId = d.shopId
                update.dueDate = this.date + ' ' + timeValue
                update.dateSelect = this.date
                update.timeSelect = timeValue
                update.timeText = timeTime
                update.sourceLink = 'direct'
                update.userId = 'user-skip'
                update.pageName = 'BookingList'
                update.fastTrack = fastTrack
                update.extraJob = extraJob
                update.depositStatus = this.formAdd.depositStatus
                update.depositImge = this.formAdd.depositImge
                update.empSelect = this.empSelectAdd
                update.adminLogin = this.session.data.userName
                update.limitBookingCheck = limitBookingCheck
                update.limitBookingId = this.checkLimitBooking.ID
                update.limitBookingCount = this.checkLimitBooking.countBooking
                update.getLimitBooking = this.checkLimitBooking.limitBooking
                update.depositPrice = this.formAdd.depositPrice
                update.storeFrontCheck = storeFrontCheck
                if (this.statusVIP === 'True') {
                  update.statusVIP = 'True'
                } else {
                  update.statusVIP = 'False'
                }
                update.statusBookingForm = 'BookingForm'
                update.address = (this.address || '').replace(/%/g, '%%').replace(/'/g, "\\'")
                update.addressLatLong = JSON.stringify(this.center)
                if (this.dataMenuAdd.filter((i) => parseInt(i.qty) > 0).length > 0) {
                  update.menuItem = JSON.stringify(this.dataMenuAdd.filter((i) => parseInt(i.qty) > 0))
                  update.menuPrice = this.priceMenuAdd
                }
                Add.push(update)
              }
            } else if (d.conditionField === 'flow') {
              if (parseInt(d.conditionValue) === parseInt(this.formAdd.flowId)) {
                update.masBranchID = this.formAdd.masBranchID
                update.bookingFieldId = d.bookingFieldId
                update.remark = this.remark
                update.flowId = this.formAdd.flowId
                update.fieldId = d.fieldId
                update.fieldValue = d.fieldValue
                update.shopId = d.shopId
                update.dueDate = this.date + ' ' + timeValue
                update.dateSelect = this.date
                update.timeSelect = timeValue
                update.timeText = timeTime
                update.sourceLink = 'direct'
                update.userId = 'user-skip'
                update.pageName = 'BookingList'
                update.fastTrack = fastTrack
                update.extraJob = extraJob
                update.depositStatus = this.formAdd.depositStatus
                update.depositImge = this.formAdd.depositImge
                update.empSelect = this.empSelectAdd
                update.adminLogin = this.session.data.userName
                update.limitBookingCheck = limitBookingCheck
                update.limitBookingId = this.checkLimitBooking.ID
                update.limitBookingCount = this.checkLimitBooking.countBooking
                update.getLimitBooking = this.checkLimitBooking.limitBooking
                update.depositPrice = this.formAdd.depositPrice
                update.storeFrontCheck = storeFrontCheck
                if (this.statusVIP === 'True') {
                  update.statusVIP = 'True'
                } else {
                  update.statusVIP = 'False'
                }
                update.statusBookingForm = 'BookingForm'
                update.address = (this.address || '').replace(/%/g, '%%').replace(/'/g, "\\'")
                update.addressLatLong = JSON.stringify(this.center)
                if (this.dataMenuAdd.filter((i) => parseInt(i.qty) > 0).length > 0) {
                  update.menuItem = JSON.stringify(this.dataMenuAdd.filter((i) => parseInt(i.qty) > 0))
                  update.menuPrice = this.priceMenuAdd
                }
                Add.push(update)
              }
            }
          }
        }
        console.log('Add', Add)
        axios
          .post(this.DNS_IP + '/Booking/add', Add)
          .then(async response => {
          // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
            if (response.data.message === 'LimitBooking_Full') {
              this.$swal('คิวเต็มแล้ว', 'กรุณาเลือกวันที่และเวลาใหม่อีกครั้ง', 'error')
              this.date = ''
              this.time = ''
            } else {
              let checkDeposit = this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) })
              let depositCheckStatus = ''
              if (checkDeposit.length > 0) {
                depositCheckStatus = checkDeposit[0].allData.checkDeposit || 'False'
              } else {
                depositCheckStatus = 'False'
              }
              if (depositCheckStatus === 'True') {
                if (this.dataDepositAdd === 'มี') {
                  await this.confirmChkAdd(response.data)
                } else {
                  this.clearDataAdd()
                  this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                }
                this.dialogShowDeposit = true
                this.bookNo = response.data.bookNo
                this.depositPrice = this.formAdd.depositPrice
                this.depositLink = 'https://betask-linked.web.app/Thank?shopId=' + this.$session.getAll().data.shopId + '&redirectBy=BookingAdmin&flowId=' + flowIdData + '&bookNo=' + response.data.bookNo
              } else {
                await this.confirmChkAdd(response.data)
              }
            }
          // console.log('addDataGlobal DNS_IP + /job/add', response)
          })
          .catch(error => {
            console.log('error function addData : ', error)
            setTimeout(() => this.addDataInsert(), 3000)
          })
        // })
        // .catch(error => {
        //   console.log('Cencel : ', error)
        //   this.closeSetTimeGetCalenda()
        // })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async clearDataAdd () {
      this.showMenu = 'False'
      this.dataMenuAdd = []
      this.dataReady = true
      this.date = ''
      this.time = ''
      this.empSelectAdd = ''
      this.remark = ''
      this.formAdd.radiosRemark = ''
      this.formAdd.depositStatus = ''
      this.formAdd.depositImge = ''
      this.formAdd.pictureUrlPreviewDeposit = ''
      this.filesDepositAdd = null
      this.dataDepositAdd = 'ไม่มี'
      this.DataflowId = ''
      this.formAdd.bookingId = null
      this.formAdd.fieldId = ''
      this.formAdd.fieldValue = ''
      this.formAdd.flowId = null
      this.formAdd.masBranchID = null
      this.formAdd.dueDate = ''
      this.formAdd.shopId = this.$session.getAll().data.shopId
      this.dialogAdd = false
      this.dialogAddCon = false
      this.loadingAdd = false
      this.address = ''
      this.center = null
      this.dataReadyAdd = true
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
      if (this.statusSearch === 'no') {
        this.getBookingList()
      } else {
        this.searchAny()
      }
      if (this.getSelectText) {
        this.getSelect(this.getSelectText, this.getSelectCount, this.filterCloseJobValue)
      }
      this.getDataCalendaBooking()
    },
    async checkShowDataOnsiteSet (text) {
      if (text === 'ไม่แสดง') {
        // this.showOnsite = 'แสดง'
        // this.selectOnsite = '&checkOnsite=is null'
        await this.updateShowOnsite('ไม่แสดง')
        this.checkShowDataOnsite()
      } else {
        // this.showOnsite = 'ไม่แสดง'
        // this.selectOnsite = '&checkOnsite=True'
        await this.updateShowOnsite('แสดง')
        this.checkShowDataOnsite()
      }
    },
    async checkShowDataOnsite () {
      this.dataReady = false
      let text = await this.getShowOnsite()
      if (text === 'ไม่แสดง') {
        this.showOnsite = 'แสดง'
        this.selectOnsite = '&checkOnsite=is null'
        // this.updateShowOnsite('ไม่แสดง')
      } else {
        this.showOnsite = 'ไม่แสดง'
        this.selectOnsite = '&checkOnsite=True'
        // this.updateShowOnsite('แสดง')
      }
      if (this.$route.query.bookNo) {
        // this.beforeCreateScan()
        await this.getDataBranch()
        await this.getEmpSelectAdd()
        await this.getBookingFieldText()
        this.getCustomFieldStart()
        await this.getDataFlow()
        await this.scanQrcode()
        // this.getBookingList()
      } else {
        await this.getDataBranch()
        await this.getEmpSelectAdd()
        await this.getBookingFieldText()
        this.getCustomFieldStart()
        await this.getDataFlow()
        this.getBookingList()
      }
    },
    async getEmpSelectAdd () {
      this.empSelectStepAdd = []
      await axios
        .get(this.DNS_IP + '/empSelect/getUse?privacyPage=booking&shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.masBranchID = d.masBranchID || ''
              console.log('this.$session.getAll().data.masBranchID', this.$session.getAll().data.masBranchID)
              if (this.$session.getAll().data.masBranchID === '' || this.$session.getAll().data.masBranchID === null) {
                // console.log('D', d)
                let s = {}
                s.text = d.empFirst_NameTH
                s.value = d.empId
                s.masBranchID = d.masBranchID
                this.empSelectStepAdd.push(s)
                console.log('this.empSelectStepAdd if getEmpSelectAdd', this.empSelectStepAdd)
              } else {
                if (this.$session.getAll().data.masBranchID === d.masBranchID || d.masBranchID === '') {
                  let s = {}
                  s.text = d.empFirst_NameTH
                  s.value = d.empId
                  s.masBranchID = d.masBranchID
                  this.empSelectStepAdd.push(s)
                  console.log('this.empSelectStepAdd else getEmpSelectAdd', this.empSelectStepAdd)
                }
              }
            }
            if (this.$session.getAll().data.empId !== '' && this.$session.getAll().data.empId !== null) {
              this.empSelectAdd = this.empSelectStepAdd.filter((item) => item.value === parseInt(this.$session.getAll().data.empId))[0].value
            }
            console.log('this.empSelectStepAdd', this.empSelectStepAdd)
          }
        })
    },
    async getDataDefault () {
      this.loadingRefresh = true
      this.$route.query.bookNoNoti = 'None'
      this.searchAll2 = ''
      await this.getDataBranch()
      await this.getEmpSelectAdd()
      this.getCustomFieldStart()
      await this.getDataFlow()
      await this.getBookingList()
      // await this.getTimesChange('update')
      this.getSelect(this.getSelectText, this.getSelectCount, this.filterCloseJobValue)
      // this.getDataCalendaBooking()
      this.loadingRefresh = false
    },
    async setLimitBooking (dateitem) {
      this.time = ''
      this.timeavailable = []
      this.limitBookingCheck = 'False'
      let setTime = []
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      if (this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.setTimebyday === 'True') {
        let timeJson = JSON.parse(this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.setTime).filter((items) => items.value === new Date(dateitem).getDay())
        setTime = timeJson[0].setTime || []
        console.log('IF')
      } else {
        console.log('ELSE')
        setTime = JSON.parse(this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.setTime) || []
      }
      if (this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) }).length > 0) {
        this.limitBookingCheck = this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.limitBookingCheck || 'False'
      } else {
        this.limitBookingCheck = 'False'
      }
      if (this.limitBookingCheck === 'True') {
        let TimeData = []
        let currentDate = setTime
        TimeData = currentDate
        if (this.statusVIP === 'False') {
          this.timeavailable = TimeData.filter((item) => parseInt(item.limitBooking) > 0)
          console.log('TimeData', TimeData)
          if (this.timeavailable.length > 0) {
            let LimitBooking = await this.getLimitBooking()
            console.log('LimitBooking', LimitBooking)
            if (LimitBooking.status !== false) {
              if (LimitBooking.length > 0) {
                LimitBooking.forEach((i, n) => {
                  this.timeavailable.forEach((v, k) => {
                    if (i.bookingTime === v.value) {
                      if (i.countBooking >= parseInt(v.limitBooking)) {
                        this.timeavailable.splice(k, 1)
                      }
                    }
                  })
                })
                if (this.timeavailable.length === 0) {
                  this.$swal(
                    'คิวเต็มแล้ว',
                    'กรุณาเลือกวันที่ใหม่อีกครั้ง',
                    'error'
                  )
                  this.date = ''
                }
              }
              console.log('this.timeavailable IF', this.timeavailable)
            } else {
              this.timeavailable = TimeData.filter((item) => parseInt(item.limitBooking) > 0)
              console.log('this.timeavailable ELSE', this.timeavailable)
            }
          } else {
            this.$swal(
              'คิวเต็มแล้ว',
              'กรุณาเลือกวันที่ใหม่อีกครั้ง',
              'error'
            )
            this.date = ''
          }
        } else {
          this.timeavailable = TimeData
        }
      } else {
        console.log('this.timeavailable ELSEEEEE', this.timeavailable)
        // LimitBookingBy Flow
        // this.timeavailable = JSON.parse(this.flowItemLimit.filter(item => { return item.flowId === this.formAdd.flowId })[0].setTime) || []

        // LimitBookingBy masBranch
        if (this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) }).length > 0) {
          this.timeavailable = setTime
        } else {
          this.timeavailable = []
        }
      }
    },
    async getMonth (month) {
      console.log('month', month)
      // console.log('!!!!!!!!!', this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.setTimebyday)
      // const result = await axios.get(this.DNS_IP + '/LimitBookingDate/get_LimitDate?shopId=' + this.$session.getAll().data.shopId + '&masBranchID=' + this.formAdd.masBranchID + '&bookingDate=' + month)
      const result = await axios.get(this.DNS_IP + '/LimitBookingDate/get_LimitDate?shopId=' + this.$session.getAll().data.shopId + '&flowId=' + this.formAdd.flowId + '&bookingDate=' + month)
      if (result.data.length > 0) {
        let setTimebyday = this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.setTimebyday
        console.log('getMonth IF', result.data)
        this.dateDaylimit = []
        // let dt = result.data
        const objectDT = result.data.reduce((acc, curr) => {
          const bookingDate = curr.bookingDate
          if (!acc[bookingDate]) {
            acc[bookingDate] = []
          }
          acc[bookingDate].push(curr)
          return acc
        }, {})

        console.log(objectDT)
        for (const dt in objectDT) {
          let statusOffDate1 = false
          // console.log(dt, objectDT[dt])
          if (objectDT[dt][0].limitBookingCheck === 'True') {
            // console.log('limitBookingCheck === True')
            objectDT[dt].forEach((v, k) => {
              // let statusOffDate2 = false
              // let statusOffDate3 = false
              if (JSON.parse(v.setTime)) {
                if (setTimebyday === 'True') {
                  // console.log('sdfsdfsdfds', JSON.parse(v.setTime).filter((items) => items.value === new Date(v.bookingDate).getDay())[0].setTime)
                  JSON.parse(v.setTime).filter((items) => items.value === new Date(v.bookingDate).getDay())[0].setTime.forEach((v2, k2) => {
                    // console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
                    if (parseInt(v2.limitBooking) > 0 && v.bookingTime === v2.value) {
                      console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
                      if (v.bookingTime === v2.value) {
                        if (v.countBooking < parseInt(v2.limitBooking)) {
                          statusOffDate1 = true
                          // console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
                        }
                      }
                    } else if (parseInt(v2.limitBooking) > 0) {
                      if (objectDT[dt].filter((aa) => aa.bookingTime === v2.value).length === 0) {
                        console.log(v.bookingDate, '+++++', v2.value)
                        statusOffDate1 = true
                      }
                    }
                  })
                } else {
                  JSON.parse(v.setTime).forEach((v2, k2) => {
                    if (parseInt(v2.limitBooking) > 0 && v.bookingTime === v2.value) {
                      console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
                      if (v.bookingTime === v2.value) {
                        if (v.countBooking < parseInt(v2.limitBooking)) {
                          statusOffDate1 = true
                          // console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
                        }
                      }
                    } else if (parseInt(v2.limitBooking) > 0) {
                      if (objectDT[dt].filter((aa) => aa.bookingTime === v2.value).length === 0) {
                        console.log(v.bookingDate, '+++++', v2.value)
                        statusOffDate1 = true
                      }
                    }
                  })
                }
              }
            })
            console.log('---------!!!!1--------', dt, '----', statusOffDate1)
            if (statusOffDate1 === false) {
              console.log('---------OFF--------', objectDT[dt])
              this.dateDaylimit.push(
                moment(objectDT[dt][0].bookingDate).format('YYYY-MM-DD')
              )
            }
          } else {
            // console.log('limitBookingCheck === False')
            this.dateDaylimit = []
          }
          // if (statusOffDate1 === false) {
          //   this.dateDaylimit.push(
          //     moment(objectDT[dt][0].bookingDate).format('YYYY-MM-DD')
          //   )
          // }
          console.log('this.dateDaylimit', this.dateDaylimit)
          // this.dateDaylimit = result.data.map((item) => { return this.momenDate_1(item.bookingDate) })
        }
      } else {
        console.log('getMonth ELSE')
        this.dateDaylimit = []
      }
    },
    allowedDates (val) {
      if (this.dateDaylimit) {
        if (this.dataFlowSelectAdd.filter(el => el.value === this.formAdd.flowId).length > 0) {
          if (this.dataFlowSelectAdd.filter(el => el.value === this.formAdd.flowId)[0].allData.typeDayCustom === 'on') {
            return val === this.dateDayCustom.filter(el => el === val)[0]
          } else {
            if (
              this.dateDayoff.filter(el => {
                return el === new Date(val).getDay()
              }).length === 0 &&
            this.dateDayCustom.filter(el => {
              return el === val
            }).length === 0 &&
            this.dateDaylimit.filter(el => {
              return el === val
            }).length === 0
            ) {
              return val
            }
          }
        } else {
          return val
        }
      } else {
        return val
      }
    },
    SetallowedDates () {
      let dataFlow = this.dataFlowSelectAdd.filter(el => { return el.value === this.formAdd.flowId })
      if (dataFlow.length > 0) {
        dataFlow.forEach((v, k) => {
          console.log('v', v)
          if (v.allData.flowId === this.formAdd.flowId) {
            // console.log('Value', v.dateDayoffValue)
            v.allData.dateDayCustom = v.allData.dateDayCustom || ''
            v.allData.dateDayoffValue = v.allData.dateDayoffValue || ''
            if (v.allData.dateDayoffValue !== '') {
              // console.log('if')
              this.dateDayoff = JSON.parse(v.allData.dateDayoffValue)
            } else {
              // console.log('else')
              this.dateDayoff = []
            }
            if (v.dateDayCustom !== '') {
              this.dateDayCustom = JSON.parse(v.allData.dateDayCustom)
            } else {
              this.dateDayCustom = []
            }
          }
        })
      } else {
        this.dateDayoff = []
        this.dateDayCustom = []
      }
    },
    async checkEmpJob () {
      this.today = this.dateStart + '-15'
      const dateSplit = this.today.split('-')
      const year = String(dateSplit[0])
      const month = String(dateSplit[1])
      var flowId = this.dataEmpOnsite.flowId
      // if (this.flowId !== '') {
      //   flowId = this.flowId
      // } else {
      //   flowId = this.dataEmpOnsite.flowId
      // }
      this.eventInfo = []
      await axios
        .get(
          this.DNS_IP + '/booking_view/getCountNotimeJob?shopId=' + this.session.data.shopId + '&empStep=' + this.empSelectJob + '&flowId=' + flowId + '&dueDate=' + year + '-' + month + '&checkOnsite=True'
        )
        .then(async responses => {
          console.log('this.responses', responses.data)
          if (responses.data.status === false) {
            this.eventInfo = []
            this.checkEventInfo = []
          } else {
            for (var x = 0; x < responses.data.length; x++) {
              var d = responses.data[x]
              // var s = {}
              let dueDate = d.start
              // s.start = d.start
              // s.name = d.name.toString()
              // s.color = 'blue'
              // this.events.push(s)
              if (typeof this.eventInfo[dueDate] === 'undefined') {
                this.eventInfo[dueDate] = {'sortNo1': 0, 'sortNo2': 0, 'sortNo3': 0}
              }
              if (d.sortNo === 1) {
                this.eventInfo[dueDate].sortNo1++
              } else if (d.sortNo === 2) {
                this.eventInfo[dueDate].sortNo2++
              } else if (d.sortNo === 3) {
                this.eventInfo[dueDate].sortNo3++
              }
            }
            this.checkEventInfo = responses.data
            console.log('this.eventInfo', this.eventInfo)
            console.log('this.checkEventInfo', this.checkEventInfo)
          }
        })
      // this.$refs.calendaronsite.checkChange()
      //   }
      // })
    },
    async checkEmpJobCalenda () {
      console.log('this.today', this.today)
      // this.dataEmpOnsite = []
      // this.today = moment(moment(new Date()), 'YYYY-MM-DD').format('YYYY-MM-DD')
      const dateSplit = this.today.split('-')
      const year = String(dateSplit[0])
      const month = String(dateSplit[1])
      var flowId = this.dataEmpOnsite.flowId
      // if (this.flowId !== '') {
      //   flowId = this.flowId
      // } else {
      //   flowId = this.dataEmpOnsite.flowId
      // }
      this.eventInfo = []
      await axios
        .get(
          this.DNS_IP + '/booking_view/getCountNotimeJob?shopId=' + this.session.data.shopId + '&empStep=' + this.empSelectJob + '&flowId=' + flowId + '&dueDate=' + year + '-' + month + '&checkOnsite=True'
        )
        .then(async responses => {
          if (responses.data.status === false) {
            this.eventInfo = []
            this.checkEventInfo = []
          } else {
            for (var x = 0; x < responses.data.length; x++) {
              var d = responses.data[x]
              // var s = {}
              let dueDate = d.start
              // s.start = d.start
              // s.name = d.name.toString()
              // s.color = 'blue'
              // this.events.push(s)
              if (typeof this.eventInfo[dueDate] === 'undefined') {
                this.eventInfo[dueDate] = {'sortNo1': 0, 'sortNo2': 0, 'sortNo3': 0}
              }
              if (d.sortNo === 1) {
                this.eventInfo[dueDate].sortNo1++
              } else if (d.sortNo === 2) {
                this.eventInfo[dueDate].sortNo2++
              } else if (d.sortNo === 3) {
                this.eventInfo[dueDate].sortNo3++
              }
            }
            this.checkEventInfo = responses.data
            console.log('this.eventInfo', this.eventInfo)
            console.log('this.checkEventInfo', this.checkEventInfo)
          }
        })
      // this.$refs.calendaronsite.checkChange()
    },
    async getBookingDataJob (dt, text) {
      console.log('item!!!!!!', dt)
      this.masBranchIDAddJob = dt.masBranchID
      this.dataEmpOnsite = dt
      this.dueDateText = dt.dueDateText
      let dateCurrent = moment().format('YYYY-MM-DD')
      let dueDate = dt.dueDateDay
      console.log(dateCurrent, dueDate)
      if (dt.checkDateConfirmJob === 'True') {
        this.statusConfirmJob = true
      } else {
        if (dateCurrent >= dueDate) {
          this.statusConfirmJob = true
        } else {
          this.statusConfirmJob = false
        }
      }
      // console.log('this.statusConfirmJob', this.statusConfirmJob)
      let checkStep = await axios.get(this.DNS_IP + '/flowStep/get?flowId=' + dt.flowId)
      console.log('checkStep', checkStep)
      if (checkStep.data.status === false) {
        this.endDate = moment().format('YYYY-MM-DD')
        this.endTime = moment().format('HH:mm')
        this.statusShowDateConfiremjob = false
      } else {
        this.statusShowDateConfiremjob = true
      }
      this.dueDate = dt.dueDateTextDay
      if (this.statusConfirmJob && this.showOnsite === 'แสดง') {
        this.jobCheckPackage = false
        console.log('dt', dt)
        this.dateTimestamp = moment().unix()
        this.remark = dt.remark
        this.userId = dt.userId
        this.lineUserId = dt.lineUserId
        console.log(this.userId, this.lineUserId)
        if (dt.packageId !== '') {
          this.dataPackageDefault = true
        } else {
          this.dataPackageDefault = false
        }
        await this.getPackage(dt)
        if (this.dataPackage.length > 0) {
          console.log('dataPackage', this.dataPackage.filter(el => { return el.packageId === dt.packageId }))
          if (this.dataPackage.filter(el => { return el.packageId === dt.packageId }).length > 0) {
            let dataPack = this.dataPackage.filter(el => { return el.packageId === dt.packageId })
            this.dataPackageDefault = true
            // this.packageId = dataPack[0].value
            this.UpdatePackage(dataPack[0].value, 'ตกลง', dataPack[0].text, dataPack[0], dt.tokenPackage)
          } else {
            this.UpdatePackage('', 'ยกเลิก', '', '', '')
            this.dataPackageDefault = false
          }
        }
        this.checkTimeFlow(dt)
        this.BookingDataItem = []
        let itemIncustomField = []

        await axios
          .get(
            this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
          )
          .then(async response1 => {
            let rs2 = response1.data
            console.log('BookingField', rs2)
            if (rs2.length > 0) {
              let bookingData = []
              bookingData = JSON.parse(rs2[0].flowfieldName)
              for (let i = 0; i < bookingData.length; i++) {
                let d = bookingData[i]
                itemIncustomField.push(d.fieldId)
              }
              await axios
                .get(this.DNS_IP + '/customField/fieldId?fieldId=' + itemIncustomField)
                .then(async responses => {
                  let rs1 = responses.data
                  await axios
                    .get(this.DNS_IP + '/BookingDataSelect/get?bookNo=' + dt.bookNo)
                    .then(async response => {
                      let rs = response.data
                      if (rs.length > 0) {
                        console.log('BookingDataSelect', rs)
                        console.log('customField', rs1)
                        let sortrs = rs1.sort((a, b) => a.sortNoField - b.sortNoField)
                        for (let i = 0; i < sortrs.length; i++) {
                          let d = sortrs[i]
                          // var s = {}
                          var dataBD = rs.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
                          if (dataBD.length > 0) {
                            if (dt.flowId === dataBD[0].flowId) {
                              d.bookNo = dataBD[0].bookNo
                              d.bookingFieldId = rs2[0].bookingFieldId
                              d.bookingDataId = dataBD[0].bookingDataId
                              d.flowId = dataBD[0].flowId
                              d.masBranchID = dataBD[0].masBranchID
                              // d.dueDate = dt.dueDate
                              // d.conditionField = d.conditionField
                              // d.fieldId = d.fieldId
                              // d.fieldType = d.fieldType
                              d.fieldValue = dataBD[0].fieldValue
                              d.packageId = dataBD[0].packageId
                              // d.fieldName = d.fieldName
                              // d.conditionField = d.conditionField
                              // d.conditionValue = d.conditionValue
                              // d.requiredField = d.requiredField
                              // d.optionField = d.optionField
                              // d.userId = d.userId
                              if (rs[0].userId === 'user-skip') {
                                d.userId = ''
                              } else {
                                d.userId = rs[0].userId
                              }
                              d.shopId = this.session.data.shopId
                              d.userName = this.$session.getAll().data.userName
                              this.BookingDataItem.push(d)
                            }
                          }
                        }
                        if (text === 'qrcode') {
                          this.dataQrcode = dt
                        }
                        // await this.getBookingField()
                        await this.getflowfield(dt)
                      }
                    })
                })
            }
          })
      }
      if (this.showOnsite === 'ไม่แสดง') {
        this.jobCheckPackage = false
        console.log('dt', dt)
        this.dateTimestamp = moment().unix()
        this.remark = dt.remark
        this.userId = dt.userId
        this.lineUserId = dt.lineUserId
        console.log(this.userId, this.lineUserId)
        if (dt.packageId !== '') {
          this.dataPackageDefault = true
        } else {
          this.dataPackageDefault = false
        }
        await this.getPackage(dt)
        if (this.dataPackage.length > 0) {
          console.log('dataPackage', this.dataPackage.filter(el => { return el.packageId === dt.packageId }))
          if (this.dataPackage.filter(el => { return el.packageId === dt.packageId }).length > 0) {
            let dataPack = this.dataPackage.filter(el => { return el.packageId === dt.packageId })
            this.dataPackageDefault = true
            // this.packageId = dataPack[0].value
            this.UpdatePackage(dataPack[0].value, 'ตกลง', dataPack[0].text, dataPack[0], dt.tokenPackage)
          } else {
            this.UpdatePackage('', 'ยกเลิก', '', '', '')
            this.dataPackageDefault = false
          }
        }
        this.checkTimeFlow(dt)
        this.BookingDataItem = []
        let itemIncustomField = []

        await axios
          .get(
            this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
          )
          .then(async response1 => {
            let rs2 = response1.data
            console.log('BookingField', rs2)
            if (rs2.length > 0) {
              let bookingData = []
              bookingData = JSON.parse(rs2[0].flowfieldName)
              for (let i = 0; i < bookingData.length; i++) {
                let d = bookingData[i]
                itemIncustomField.push(d.fieldId)
              }
              await axios
                .get(this.DNS_IP + '/customField/fieldId?fieldId=' + itemIncustomField)
                .then(async responses => {
                  let rs1 = responses.data
                  await axios
                    .get(this.DNS_IP + '/BookingDataSelect/get?bookNo=' + dt.bookNo)
                    .then(async response => {
                      let rs = response.data
                      if (rs.length > 0) {
                        console.log('BookingDataSelect', rs)
                        console.log('customField', rs1)
                        let sortrs = rs1.sort((a, b) => a.sortNoField - b.sortNoField)
                        for (let i = 0; i < sortrs.length; i++) {
                          let d = sortrs[i]
                          // var s = {}
                          let dataBD = rs.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
                          if (dataBD.length > 0) {
                            if (dt.flowId === dataBD[0].flowId) {
                              d.bookNo = dataBD[0].bookNo
                              d.bookingFieldId = rs2[0].bookingFieldId
                              d.bookingDataId = dataBD[0].bookingDataId
                              d.flowId = dataBD[0].flowId
                              d.masBranchID = dataBD[0].masBranchID
                              // d.dueDate = dt.dueDate
                              // d.conditionField = d.conditionField
                              // d.fieldId = d.fieldId
                              // d.fieldType = d.fieldType
                              d.fieldValue = dataBD[0].fieldValue
                              d.packageId = dataBD[0].packageId
                              // d.fieldName = d.fieldName
                              // d.conditionField = d.conditionField
                              // d.conditionValue = d.conditionValue
                              // d.requiredField = d.requiredField
                              // d.optionField = d.optionField
                              // d.userId = d.userId
                              if (rs[0].userId === 'user-skip') {
                                d.userId = ''
                              } else {
                                d.userId = rs[0].userId
                              }
                              d.shopId = this.session.data.shopId
                              d.userName = this.$session.getAll().data.userName
                              this.BookingDataItem.push(d)
                            }
                          }
                        }
                        if (text === 'qrcode') {
                          this.dataQrcode = dt
                        }
                        // await this.getBookingField()
                        await this.getflowfield(dt)
                      }
                    })
                })
            }
          })
      }
    },
    async getjobChangeOnsite (item) {
      this.dataEmpOnsite = item
      await this.getEmpSelectAddJob()
      this.jobitem = []
      console.log(item)
      console.log(this.empSelectStepAdd)
      if (item.jobNo !== '') {
        await axios.get(this.DNS_IP + '/job/getJobNo?jobNo=' + item.jobNo).then((response) => {
          let rs = response.data
          console.log('getJobNo', rs)
          if (rs.status === false) {
          } else {
            this.jobitem = rs
            this.sortNo = rs[0].sortNo
            this.empSelectJob = parseInt(rs[0].empStepId)
            this.flowId = rs[0].flowId
            console.log('this.flowId', this.flowId)
            if (this.sortNo === 1) {
              this.checkEmpJob()
            }
          }
        })
      }
    },
    async getChangeOnsite (item) {
      await this.getEmpSelectAddJob()
      this.jobitem = []
      console.log(item)
      console.log(this.empSelectStepAdd)
      if (item.jobNo !== '') {
        await axios.get(this.DNS_IP + '/job/getJobNo?jobNo=' + item.jobNo).then((response) => {
          let rs = response.data
          console.log('getJobNo', rs)
          if (rs.status === false) {
          } else {
            this.jobitem = rs
            this.sortNo = rs[0].sortNo
            this.empSelectJob = parseInt(rs[0].empStepId)
            this.flowId = rs[0].flowId
            console.log('this.flowId', this.flowId)
            if (this.sortNo === 1) {
              this.checkEmpJob()
            }
          }
        })
      }
    },
    async getEmpSelectAddJob () {
      this.empSelectStepAdd = []
      await axios
        .get(this.DNS_IP + '/empSelect/getUse?USER_ROLE=onsite&shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              console.log('DDDDDSFDSDFSDF', d)
              var s = {}
              s.text = d.empFull_NameTH
              s.value = d.empId
              this.empSelectStepAdd.push(s)
            }
          }
        })
    },
    setFlowByBranchAdd () {
      this.formAdd.flowId = ''
      let DD = this.DataFlowNameDefault
      console.log('DD_', DD)
      let dataFilter = []
      DD.forEach((item) => {
        if (item.text !== 'ทั้งหมด') {
          let checkBranchByFlow = item.allData.masBranchID || 'All'
          if ((checkBranchByFlow === this.formAdd.masBranchID.toString()) || checkBranchByFlow === 'All') {
            console.log('eeeeeee', item.allData.flowName)
            dataFilter.push(item)
          }
        }
      })
      this.dataFlowSelectAdd = dataFilter
    },
    setFlowAdd () {
      if (this.dataFlowSelectAdd.filter(el => { return el.value === this.formAdd.flowId }).length > 0) {
        this.checkDepositAdd = this.dataFlowSelectAdd.filter(el => { return el.value === this.formAdd.flowId })[0].allData.checkDeposit || 'False'
        this.statusShowMap = this.dataFlowSelectAdd.filter(el => { return el.value === this.formAdd.flowId })[0].allData.checkOnsite || 'False'
      } else {
        this.checkDepositAdd = 'False'
        this.statusShowMap = 'False'
      }
    },
    async getDataCalendaBooking () {
      console.log('this.$session.id()', this.$session.id())
      if (this.$session.id() !== undefined) {
        console.log('getDataCalendaBooking')
        try {
          await this.$refs.CalendarBooking.getDataReturn(this.selectOnsite, this.dateStart, this.masBranchID, this.flowSelect)
        } catch (e) { console.log(e) }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั้ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async getDataCalendaBookingAdd () {
      console.log('this.$session.id()', this.$session.id())
      if (this.$session.id() !== undefined) {
        console.log('getDataCalendaBooking')
        let masBranchID = this.formAdd.masBranchID || this.masBranchID
        let flowSelect = this.formAdd.flowId || this.flowSelect
        console.log('masBranchID', masBranchID)
        console.log('flowSelect', flowSelect)
        try {
          await this.$refs.CalendarBooking.getDataReturn(this.selectOnsite, this.dateStart, masBranchID, flowSelect)
        } catch (e) { console.log(e) }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั้ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async getCustomField (item) {
      this.fieldNameItem = []
      await axios
        .get(this.DNS_IP + '/customField/fieldId?fieldId=' + item)
        .then(async response => {
          let rs = response.data
          // let aa = []
          if (rs.length > 0) {
            let sortrs = rs.sort((a, b) => a.sortNoField - b.sortNoField)
            for (let i = 0; i < sortrs.length; i++) {
              let d = sortrs[i]
              let s = {}
              s.fieldId = d.fieldId
              s.fieldName = d.fieldName
              s.fieldType = d.fieldType
              s.optionField = d.optionField
              s.conditionField = d.conditionField
              s.conditionValue = d.conditionValue
              s.shopId = d.shopId
              s.fieldValue = ''
              s.requiredField = d.requiredField
              this.fieldNameItem.push(s)
            }
            var data1 = this.fieldNameItem.filter(el => parseInt(el.conditionField || 0) > 0)
            // var data2 = []
            for (var i = 0; i < data1.length; i++) {
              var d = data1[i]
              var indexC = this.fieldNameItem.findIndex(function (o) {
                return o.fieldId === d.fieldId
              })
              var indexF = this.fieldNameItem.findIndex(function (o) {
                return o.fieldId === parseInt(d.conditionField)
              })
              this.fieldNameItem.splice((indexF + 1), 0, this.fieldNameItem.splice(indexC, 1)[0])
            }
          } else {
            this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
              this.dialogAdd = false
              this.clearDataAdd()
            }).catch((error) => {
              console.log('error function addData : ', error)
              this.dialogAdd = false
              this.clearDataAdd()
            })
          }
        })
        .catch(error => {
          this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
            this.dialogAdd = false
            this.clearDataAdd()
          }).catch((error) => {
            console.log('error function addData : ', error)
            this.dialogAdd = false
            this.clearDataAdd()
          })
          console.log('error function addData : ', error)
        })
    },
    async addDataSet () {
      console.log('yo')
      this.statusdepositPrice = false
      this.datailLinkDeposit = ''
      this.remark = ''
      let _this = this
      this.setTimerCalendar = setInterval(function () { _this.getDataCalendaBookingAdd() }, 20000)
      this.dialogAdd = true
      setTimeout(() => this.getDataCalendaBookingAdd(), 1000)
      if (this.branch.length === 0) {
        this.getDataBranch()
      }
      this.getBookingField()
      this.checkTime()
      this.setFlowAdd()
      this.$refs.CalendarBooking.setdataReturnReady()
    },
    async getBookingField () {
      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.formAdd.bookingId = rs[0].bookingId
            let bookingData = []
            bookingData = JSON.parse(rs[0].flowfieldName)
            for (let i = 0; i < bookingData.length; i++) {
              let d = bookingData[i]
              itemIncustomField.push(d.fieldId)
            }
            await this.getCustomField(itemIncustomField)
          } else {
            this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
              this.dialogAdd = false
              this.clearDataAdd()
            }).catch((error) => {
              console.log('error function addData : ', error)
              this.dialogAdd = false
              this.clearDataAdd()
            })
          }
        })
        .catch(error => {
          this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
            this.dialogAdd = false
            this.clearDataAdd()
          }).catch((error) => {
            console.log('error function addData : ', error)
            this.dialogAdd = false
            this.clearDataAdd()
          })
          console.log('error function addData : ', error)
        })
    },
    checkTime () {
      this.timeavailable = []
      let dtTime = this.dataFlowSelectAdd.filter(item => { return item.value === this.formAdd.flowId })
      if (dtTime.length > 0) {
        if (dtTime[0].menuShowStatus === 'True') {
          this.showMenu = 'True'
          this.dataMenuAdd = JSON.parse(dtTime[0].allData.menuItem) || []
        } else {
          this.showMenu = 'False'
          this.dataMenuAdd = []
        }
        if (dtTime.map(item => item.allData.setTime) === null) {
          this.timeavailable = []
        } else {
          this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
        }
      }
    },
    async getBookingList () {
      await this.getTagData()
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null

      if (this.session.data.masBranchID === '' || this.session.data.masBranchID === null) {
        this.statusBranchReadonly = false
        if (this.masBranchID) {
          this.masBranchID = this.masBranchID
        } else {
          if (this.branch.length > 0) {
            this.masBranchID = this.branch[0].value
          } else {
            await this.getDataBranch()
            if (this.branch.length > 0) {
              this.masBranchID = this.branch[0].value
            } else {
              this.masBranchID = ''
              this.$swal('ผิดพลาด', 'กรุณาตรวจสอบสาขาของท่าน เนื่องจากระบบตรวจหาสาขาไม่พบ', 'error')
            }
          }
        }
      } else {
        this.statusBranchReadonly = true
        if (this.branch.filter(el => { return el.value === this.session.data.masBranchID }).length > 0) {
          this.masBranchID = this.session.data.masBranchID
        } else {
          await this.getDataBranch()
          if (this.branch.filter(el => { return el.value === this.session.data.masBranchID }).length > 0) {
            this.masBranchID = this.session.data.masBranchID
          } else {
            this.masBranchID = ''
            this.$swal('ผิดพลาด', 'กรุณาตรวจสอบสาขาของท่าน เนื่องจากระบบตรวจหาสาขาไม่พบ', 'error')
          }
        }
      }
      console.log('masBranchID', this.masBranchID)
      if (this.flowSelect !== '') {
        this.flowSelect = this.flowSelect
      } else {
        this.DataFlowName = this.DataFlowNameDefault.filter(el => { return parseInt(el.masBranchID) === this.masBranchID || el.value === 'AllFlow' || el.value === 'All' })
        if (this.DataFlowName.length > 0) {
          console.log('masBranchID', this.DataFlowName)
          this.flowSelect = this.DataFlowName[0].value
        } else {
          this.flowSelect = ''
          await this.getDataFlow()
          console.log('masBranchID', this.DataFlowName)
          this.flowSelect = this.DataFlowName[0].value
        }
      }
      console.log('this.flowSelect', this.flowSelect)
      this.selectedStatus = true
      this.dataItem = []
      this.countWaiting = 0
      this.countConfirm = 0
      this.countCancel = 0
      this.countJob = 0
      this.countAll = 0
      var dataItemTimes = []
      var dataItems = []
      let urlApi = ''
      if (this.flowSelect === 'AllFlow') {
        urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&dueDate=' +
            this.dateStart + this.selectOnsite
      } else {
        urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&dueDate=' +
            this.dateStart + '&flowId=' + this.flowSelect + this.selectOnsite
      }
      await axios
        .get(urlApi)
        .then(async response => {
          console.log('getData', response.data.length)
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let d = response.data[i]
              let s = {}
              s.bookNo = d.bookNo
              s.flowId = d.flowId
              let checkDeposit = this.DataFlowNameDefault.filter(el => { return el.value === parseInt(d.flowId) })
              if (checkDeposit.length > 0) {
                s.depositCheckStatus = checkDeposit[0].allData.checkDeposit || 'False'
              } else {
                s.depositCheckStatus = 'False'
              }
              s.flowName = d.flowName
              s.dueDate = d.dueDate || ''
              if (d.timeText === null || d.timeText === '') {
                d.timeText = d.timeDue
              }
              if (s.dueDate === '') {
                s.dueDateText = 'ไม่มีเวลานัดหมาย'
              } else {
                s.dueDateText = d.dueDateTextDay + ' ' + d.timeText
              }
              s.cusName = d.bookingDataCustomerName || ''
              s.cusReg = d.bookingDataCustomerRegisNumber || ''
              s.tel = d.bookingDataCustomerTel || ''
              s.displayFlowName = d.displayFlowName || ''
              s.shopId = d.shopId
              s.dueDateDay = d.dueDateDay
              s.statusVIP = d.statusVIP
              s.checkDateConfirmJob = d.checkDateConfirmJob
              s.packageName = d.packageName
              s.packageDetails = d.packageDetails
              s.packageImage = d.packageImage
              s.packagePrice = d.packagePrice
              s.packageBalanceAmount = d.packageBalanceAmount
              s.packageAmount = d.packageAmount
              s.packagePoint = d.packagePoint
              s.packageExpire = d.packageExpire
              s.depositTextTH = d.depositTextTH
              s.CREATE_DATE_Status = d.CREATE_DATE_Status
              s.CREATE_DATE = d.CREATE_DATE
              s.menuShowStatus = d.menuShowStatus
              s.dueDateTextDay = d.dueDateTextDay
              s.remark = d.remark || ''
              s.masBranchID = d.masBranchID
              s.limitBookingCheck = d.limitBookingCheck
              s.memberId = d.memberId || ''
              s.countHourLimit = d.countHourLimit
              s.empSelect = d.empSelect
              s.empFull_NameTH = d.empFull_NameTH || ''
              s.empFull_NameTH = s.empFull_NameTH.replace('นางสาว', '')
              s.empFull_NameTH = s.empFull_NameTH.replace('นาย', '')
              s.empFull_NameTH = s.empFull_NameTH.replace('นาง', '')
              s.userId = d.userId
              s.chkConfirm = false
              s.chkCancel = false
              s.address = d.address
              s.addressLatLong = d.addressLatLong
              s.jobNo = d.jobNo
              s.timeText = d.timeText
              s.remarkRemove = d.remarkRemove || ''
              s.remarkConfirm1 = (d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True')
              s.remarkConfirm2 = (d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True')
              s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
              s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
              s.depositStatus = d.depositStatus || 'False'
              s.depositImge = d.depositImge || ''
              s.depositReturnImge = d.depositReturnImge || ''
              s.depositPrice = d.depositPrice || ''
              s.remarkDepositLinked = d.remarkDepositLinked || ''
              s.lineUserId = d.lineUserId
              s.memberPicture = d.memberPicture
              s.memberName = d.memberName
              s.timeDueHtext = d.timeDueH + ':00'
              s.timeDuetext = d.timeDue
              s.countChangeTime = d.countChangeTime || 0
              s.remarkReturn = d.remarkReturn || ''
              s.dateReturn = d.dateReturn || ''
              s.packageId = d.packageId || ''
              s.tokenPackage = d.tokenPackage || ''
              s.RECORD_STATUS_Job = d.RECORD_STATUS_Job || ''
              s.menuItem = d.menuItem || []
              s.menuPrice = d.menuPrice || ''
              s.memberDataTagName = []
              try {
                s.memberDataTag = JSON.parse(d.memberDataTag) || []
                if (s.memberDataTag.length > 0) {
                  s.tagDataShow = []
                  let memberDataTag = s.memberDataTag
                  for (let i = 0; i < memberDataTag.length; i++) {
                    let d = memberDataTag[i]
                    let x = {}
                    let checkTagItem = this.tagItem.filter(el => { return el.value === d })
                    if (checkTagItem.length > 0) {
                      x.text = checkTagItem[0].text
                      x.value = checkTagItem[0].value
                      s.tagDataShow.push(x)
                      s.memberDataTagName.push(x.text)
                    }
                  }
                }
                s.memberDataTagName = s.memberDataTagName.join(', ')
              } catch (error) {
                s.tagDataShow = []
                console.log(error)
              }
              this.countAll = this.countAll + 1
              if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
                s.chkConfirm = true
                s.chkCancel = false
              }
              if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
                s.chkConfirm = false
                s.chkCancel = true
              }
              s.statusBt = d.statusBt || 'wait'
              switch (d.statusBt) {
                case 'confirm':
                  s.statusBtText = 'ยืนยันแล้ว'
                  this.countConfirm = this.countConfirm + 1
                  break
                case 'cancel':
                  s.statusBtText = 'ยกเลิก'
                  this.countCancel = this.countCancel + 1
                  break
                case 'confirmJob':
                  s.statusBtText = 'รับรถแล้ว'
                  this.countJob = this.countJob + 1
                  break
              }
              var chkTime = this.dataItemTime.filter(el => { return el.timeDueHtext === s.timeDueHtext })
              if (chkTime.length === 0) {
                dataItemTimes.push(s)
              }
              if (s.statusBt !== 'wait') {
                dataItems.push(s)
              }
            }
            console.log('dataItemsnn', dataItems)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log(error)
          this.dataReady = true
        })
      let urlApiwait = ''
      if (this.flowSelect === 'AllFlow') {
        urlApiwait = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&statusBt=null' + this.selectOnsite
      } else {
        urlApiwait = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&statusBt=null&flowId=' + this.flowSelect + this.selectOnsite
      }
      await axios
        .get(urlApiwait)
        .then(async responses => {
          if (responses.data.length > 0) {
            for (let i = 0; i < responses.data.length; i++) {
              let d = responses.data[i]
              let s = {}
              s.bookNo = d.bookNo
              s.flowId = d.flowId
              let checkDeposit = this.DataFlowNameDefault.filter(el => { return el.value === parseInt(d.flowId) })
              if (checkDeposit.length > 0) {
                s.depositCheckStatus = checkDeposit[0].allData.checkDeposit || 'False'
              } else {
                s.depositCheckStatus = 'False'
              }
              s.flowName = d.flowName
              s.dueDate = d.dueDate || ''
              if (d.timeText === null || d.timeText === '') {
                d.timeText = d.timeDue
              }
              if (s.dueDate === '') {
                s.dueDateText = 'ไม่มีเวลานัดหมาย'
              } else {
                s.dueDateText = d.dueDateTextDay + ' ' + d.timeText
              }
              s.statusUpload1 = d.statusUpload1 || 'False'
              s.statusUpload2 = d.statusUpload2 || 'False'
              s.fileUpload1 = d.fileUpload1 || '[]'
              s.fileUpload2 = d.fileUpload2 || '[]'
              s.shopId = d.shopId
              s.dueDateDay = d.dueDateDay
              s.statusVIP = d.statusVIP
              s.checkDateConfirmJob = d.checkDateConfirmJob
              s.packageName = d.packageName
              s.packageDetails = d.packageDetails
              s.packageImage = d.packageImage
              s.packagePrice = d.packagePrice
              s.packageBalanceAmount = d.packageBalanceAmount
              s.packageAmount = d.packageAmount
              s.packagePoint = d.packagePoint
              s.packageExpire = d.packageExpire
              s.depositTextTH = d.depositTextTH
              s.CREATE_DATE_Status = d.CREATE_DATE_Status
              s.CREATE_DATE = d.CREATE_DATE
              s.menuShowStatus = d.menuShowStatus
              s.dueDateTextDay = d.dueDateTextDay
              s.remark = d.remark || ''
              s.masBranchID = d.masBranchID
              s.limitBookingCheck = d.limitBookingCheck
              s.memberId = d.memberId || ''
              s.countHourLimit = d.countHourLimit
              s.empSelect = d.empSelect
              s.empFull_NameTH = d.empFull_NameTH || ''
              s.empFull_NameTH = s.empFull_NameTH.replace('นางสาว', '')
              s.empFull_NameTH = s.empFull_NameTH.replace('นาย', '')
              s.empFull_NameTH = s.empFull_NameTH.replace('นาง', '')
              s.userId = d.userId
              s.chkConfirm = false
              s.chkCancel = false
              s.address = d.address
              s.addressLatLong = d.addressLatLong
              s.jobNo = d.jobNo
              s.timeText = d.timeText
              s.remarkRemove = d.remarkRemove || ''
              s.remarkConfirm1 = (d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True')
              s.remarkConfirm2 = (d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True')
              s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
              s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
              s.depositStatus = d.depositStatus || 'False'
              s.depositImge = d.depositImge || ''
              s.depositReturnImge = d.depositReturnImge || ''
              s.depositPrice = d.depositPrice || ''
              s.remarkDepositLinked = d.remarkDepositLinked || ''
              s.lineUserId = d.lineUserId
              s.memberPicture = d.memberPicture
              s.memberName = d.memberName
              s.timeDueHtext = d.timeDueH + ':00'
              s.timeDuetext = d.timeDue
              s.countChangeTime = d.countChangeTime || 0
              s.remarkReturn = d.remarkReturn || ''
              s.dateReturn = d.dateReturn || ''
              s.packageId = d.packageId || ''
              s.tokenPackage = d.tokenPackage || ''
              s.RECORD_STATUS_Job = d.RECORD_STATUS_Job || ''
              s.menuItem = d.menuItem || []
              s.menuPrice = d.menuPrice || ''
              this.countAll = this.countAll + 1
              if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
                s.chkConfirm = true
                s.chkCancel = false
              }
              if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
                s.chkConfirm = false
                s.chkCancel = true
              }
              s.statusBt = d.statusBt || 'wait'
              switch (s.statusBt) {
                case 'wait':
                  s.statusBtText = 'รายการนัดหมายใหม่'
                  this.countWaiting = this.countWaiting + 1
                  break
              }
              var chkTime = this.dataItemTime.filter(el => { return el.timeDueHtext === s.timeDueHtext })
              if (chkTime.length === 0) {
                dataItemTimes.push(s)
              }
              s.cusName = d.bookingDataCustomerName || ''
              s.cusReg = d.bookingDataCustomerRegisNumber || ''
              s.tel = d.bookingDataCustomerTel || ''
              s.displayFlowName = d.displayFlowName || ''
              s.memberDataTagName = []
              s.memberDataTag = JSON.parse(d.memberDataTag) || []
              if (s.memberDataTag.length > 0) {
                s.tagDataShow = []
                let memberDataTag = s.memberDataTag
                for (let i = 0; i < memberDataTag.length; i++) {
                  let d = memberDataTag[i]
                  let x = {}
                  let checkTagItem = this.tagItem.filter(el => { return el.value === d })
                  if (checkTagItem.length > 0) {
                    x.text = checkTagItem[0].text
                    x.value = checkTagItem[0].value
                    s.tagDataShow.push(x)
                    s.memberDataTagName.push(x.text)
                  }
                }
              }
              s.memberDataTagName = s.memberDataTagName.join(', ')
              dataItems.push(s)
            }
          }
        })
      if (dataItems.length === 0 || dataItems.status === false) {
        this.dataItem = []
        this.dataItemTime = []
        if (this.getSelectText) {
          this.getSelect(this.getSelectText, 0, this.filterCloseJobValue)
        } else {
          this.getSelect('wait', this.countWaiting, this.filterCloseJobValue)
        }
        this.dataReady = true
      } else {
        this.dataItem = dataItems
        var datause = dataItemTimes.sort((a, b) => {
          if (a.timeDueHtext < b.timeDueHtext) return -1
          return a.timeDueHtext > b.timeDueHtext ? 1 : 0
        })
        for (var k = 0; k < datause.length; k++) {
          var t = datause[k]
          var h = {}
          h.timeDueHtext = t.timeDueHtext
          let chkTimes = this.dataItemTime.filter(el => { return el.timeDueHtext === t.timeDueHtext })
          if (chkTimes.length === 0) {
            this.dataItemTime.push(h)
          }
        }
        console.log('dataItemTime', this.dataItemTime)
        if (this.$route.query.bookNoNoti) {
          let checkBook = dataItems.filter(el => { return el.bookNo === this.$route.query.bookNoNoti })
          if (checkBook.length > 0) {
            this.getSelectText = checkBook[0].statusBt
            this.searchAll2 = checkBook[0].cusName
          }
        }
        if (this.getSelectText) {
          this.getSelect(this.getSelectText, 0, this.filterCloseJobValue)
        } else {
          this.getSelect('wait', this.countWaiting, this.filterCloseJobValue)
        }
        this.dataReady = true
      }
    },
    async getCustomFieldStart () {
      this.checkShowCount = false
      await axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (d.fieldName === 'จำนวนคน' || d.fieldName === 'จำนวนที่นั่ง' || d.fieldName === 'จำนวนลูกค้า' || d.fieldName === 'จำนวนกี่ท่าน') {
                this.checkShowCount = true
                break
              }
            }
          }
        }).catch(async err => {
          console.log('getCustomFieldStart', err)
        })
    },
    async removeQueue (item) {
      console.log('removeQueue', item)
      this.closeSetTimeBookingListQueue()
      let statusBooking = await this.checkBookingStatus(item.bookNo)
      if (statusBooking === 'confirmJob') {
        this.$swal({
          title: 'ต้องการยกเลิกคิวนี้ ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1DBF73',
          cancelButtonColor: '#F38383',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async response => {
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
              await this.searchBooking('unNoti')
              this.clearTimeLoop()
            })
        }).catch(async err => {
          console.log(err.code, err.message)
          await this.searchBooking('unNoti')
          this.clearTimeLoop()
        })
      } else {
        this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
        await this.searchBooking('unNoti')
        this.clearTimeLoop()
      }
    },
    closeSetTimeBookingListQueue () {
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
    },
    clearTimeLoop () {
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
      let _this = this
      this.setTimerCalendar = setInterval(function () { _this.searchBooking('unNoti') }, 15000)
    },
    searchFlow (item) {
      this.search = item.text
    },
    momentThaiText (item) {
      let dt = moment(item).locale('th').format('LL')
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
        }).catch(error => {
          console.log('error function pushMsgQueue : ', error)
        })
    },
    async openHistory (item) {
      const BookingData = await axios.get(this.DNS_IP + '/BookingData/get_history?bookNo=' + item.bookNo)
        .then(async (response) => {
          return response.data
        })
        .catch((error) => {
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
      setTimeout(() => this.searchBooking('unNoti'), 500)
    },
    async searchBooking (checkNoti, item) {
      if (this.validSearch === true) {
        let itemBookingTem = []
        let itemBookingCountTem = []
        this.overlaySave = false
        this.itemBookingUse = []
        if (this.checkShowCount) {
          await this.getBookingDataList(this.dateStart)
        }
        let urlApi = {}
        if (this.flowSelect === 'allFlow') {
          urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&dueDate=' +
            this.dateStart + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob and closeJob and cancel'
        } else {
          urlApi = this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&flowId=' +
            this.flowSelect +
            '&dueDate=' +
            this.dateStart + '&storeFrontQueue=is not null&statusBt=confirm and confirmJob and closeJob'
        }
        await axios
          .get(urlApi)
          .then(async response => {
            let rs = response.data
            if (rs.length > 0) {
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
                d.cusPhone = d.bookingDataCustomerTel || ''
                this.itemBookingUse.push(d)
              }
              itemBookingTem = this.itemBookingUse
              for (let i = 0; i < this.itemBookingUse.length; i++) {
                let d = this.itemBookingUse[i]
                if (d.statusBt === 'confirm') {
                  let checkFlow = itemBookingCountTem.filter(el => { return el.flowId === d.flowId })
                  let checkIndexFlow = itemBookingCountTem.findIndex(el => { return el.flowId === d.flowId })
                  if (checkFlow.length > 0) {
                    itemBookingCountTem[checkIndexFlow].countFlow = itemBookingCountTem[checkIndexFlow].countFlow + 1
                  } else {
                    itemBookingCountTem.push({flowId: d.flowId, flowName: d.flowName, statusBt: d.statusBt, countFlow: 1})
                  }
                }
              }
              if (this.modelslide === '' || this.modelslide === 'allFlow') {
                itemBookingTem = this.itemBookingUse
              } else {
                itemBookingTem = this.itemBookingUse.filter(el => { return el.flowId === this.modelslide })
              }
              this.itemBooking = itemBookingTem
              this.itemBookingCount = itemBookingCountTem
              if (checkNoti === 'noti') {
                console.log('item', item, checkNoti, item.storeFrontNotifySet, item.storeFrontNotifyStatus)
                if (item.storeFrontNotifyStatus === 'True') {
                  if (parseInt(item.storeFrontNotifySet) > 0) {
                    this.pushMessageRecallQueue(parseInt(item.storeFrontNotifySet), 'False')
                  }
                }
              }
            } else {
              itemBookingTem = []
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
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach((row) => {
              if (typeof (this.BookingDataList[row.bookNo]) === 'undefined') {
                this.BookingDataList[row.bookNo] = []
              }
              this.BookingDataList[row.bookNo].push(row)
            })
          }
        }).catch(error => {
          setTimeout(() => this.getBookingDataList(dateStart), 3000)
          console.log('catch getBookingDataList : ', error)
        })
      console.log('this.BookingDataList1', this.BookingDataList)
    },
    setTime () {
      this.timeavailable = []
      let checkFlow = this.DataFlowItem.filter(el => { return el.value === this.flowSelect })
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
        .get(this.DNS_IP + `/flow/get?shopId=${this.shopId}&storeFrontCheck=True&masBranchIDAll=${this.masBranchID}`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            if (this.$session.getAll().data.USER_ROLE === 'storeFront') {
              resultOption.push({'text': 'ทั้งหมด', 'value': 'allFlow'})
              for (let i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {}
                if (JSON.parse(this.$session.getAll().data.flowId).filter(el => { return el === d.flowId }).length > 0) {
                  s.text = d.flowName
                  s.value = d.flowId
                  s.allData = d
                  resultOption.push(s)
                }
              }
            } else {
              resultOption.push({'text': 'ทั้งหมด', 'value': 'allFlow'})
              for (let i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {}
                s.text = d.flowName
                s.value = d.flowId
                s.allData = d
                resultOption.push(s)
              }
            }
          } else {
            resultOption = []
          }
        })
      this.DataFlowItem = resultOption
      this.DataFlowNameDefault = resultOption
      if (resultOption.length > 0) {
        this.flowSelect = this.DataFlowItem[0].value
      }
    },
    async getDataBranch () {
      this.branchItem = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName', '')
      let branchData = this.branchItem
      if (this.branchItem.length > 0) {
        this.masBranchID = this.branchItem[0].value
        if (this.session.data.masBranchID === '' || this.session.data.masBranchID === null) {
          this.branch = branchData
        } else {
          let checkData = branchData.filter(el => { return el.value === this.session.data.masBranchID })
          if (checkData.length > 0) {
            this.branch = checkData
          } else {
            await this.getDataBranch()
            if (checkData.length > 0) {
              this.branch = checkData
            } else {
              this.branch = []
              this.$swal('ผิดพลาด', 'กรุณาตรวจสอบสาขาของท่าน เนื่องจากระบบตรวจหาสาขาไม่พบ', 'error')
            }
          }
        }
        // console.log('this.masBranchID sen', this.masBranchID)
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
            title: 'ต้องการเรียกคิวนี้ ใช่หรือไม่?',
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
            this.clearTimeLoop()
          })
        } else {
          this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
          await this.searchBooking('unNoti')
          this.clearTimeLoop()
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
          let lineUserId = item.lineUserId || ''
          if (lineUserId !== '') {
            let dtt = {
              checkGetQueue: 'True'
            }
            await axios
              .post(this.DNS_IP + '/Booking/pushMsgQueue/' + item.bookNo, dtt)
              .then(async responses => {}).catch(error => {
                console.log('error function pushMsgQueue : ', error)
              })
          }
          this.dialogServicePointStatus = false
          this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
          await this.searchBooking('noti', item)
          this.clearTimeLoop()
        })
    },
    async closeJobServicePoint (item) {
      if (this.servicePoint === '') {
        this.$swal('ผิดพลาด', 'กรุณาเลือกจุดบริการ', 'error')
      } else {
        let statusBooking = await this.checkBookingStatus(item.bookNo)
        if (statusBooking === 'confirm') {
          this.$swal({
            title: 'ต้องการเรียกคิวนี้ ใช่หรือไม่?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1DBF73',
            cancelButtonColor: '#F38383',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          }).then(async response => {
            this.overlaySave = false
            let USER_ROLE = this.session.data.USER_ROLE || ''
            let empId = this.session.data.empId || ''
            if (USER_ROLE === 'storeFront' && empId !== '') {
              let statusBookingCheck = await this.checkBookingStatus(item.bookNo)
              if (statusBookingCheck === 'confirm') {
                let statusUpdateEmp = await this.updateEmp(item.bookNo, 'confirm')
                if (statusUpdateEmp === true) {
                  this.closeJobServicePointSubmit(item)
                } else {
                  this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
                  this.dialogServicePointStatus = false
                  await this.searchBooking('unNoti')
                  this.clearTimeLoop()
                }
              } else {
                this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
                this.dialogServicePointStatus = false
                await this.searchBooking('unNoti')
                this.clearTimeLoop()
              }
            } else {
              this.closeJobServicePointSubmit(item)
            }
          })
        } else {
          this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
          await this.searchBooking('unNoti')
          this.clearTimeLoop()
        }
      }
    },
    async closeJobSubmitReturn (item) {
      this.closeSetTimeBookingListQueue()
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
            title: 'ต้องการเรียกคิวนี้ ใช่หรือไม่?',
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
            this.clearTimeLoop()
          })
        }
      } else {
        this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
        await this.searchBooking('unNoti')
        this.clearTimeLoop()
      }
    },
    async backHomeSubmit (item) {
      console.log('backHomeSubmit', item)
      this.closeSetTimeBookingListQueue()
      let statusBooking = await this.checkBookingStatus(item.bookNo)
      if (statusBooking === 'confirmJob') {
        this.$swal({
          title: 'ต้องการปิดงานนี้ ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1DBF73',
          cancelButtonColor: '#F38383',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async response => {
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
              await this.searchBooking('unNoti')
              this.clearTimeLoop()
            })
        }).catch(async err => {
          console.log(err.code, err.message)
          await this.searchBooking('unNoti')
          this.clearTimeLoop()
        })
      } else {
        this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
        await this.searchBooking('unNoti')
        this.clearTimeLoop()
      }
    },
    async setservicePointCount (item) {
      this.servicePointItem = []
      await axios
        .get(this.DNS_IP + '/booking_view/get?shopId=' + item.shopId + '&flowId=' + item.flowId +
        '&dueDateDay=' + this.dateStart + '&storeFrontQueue=is not null&statusBt=confirmJob&servicePointStatus=True')
        .then(async response => {
          let rs = response.data
          console.log('setservicePointCount', rs)
          if (rs.status !== false) {
            let servicePointItem = rs.filter(el => { return el.servicePoint !== null || el.servicePoint !== '' })
            if (servicePointItem.length > 0) {
              if (JSON.parse(item.servicePointCount).length > 0) {
                for (let i = 0; i < JSON.parse(item.servicePointCount).length; i++) {
                  let d = JSON.parse(item.servicePointCount)[i]
                  console.log('Count', servicePointItem.filter(el => { return el.servicePoint === d.textTh }))
                  if (servicePointItem.filter(el => { return el.servicePoint === d.textTh }).length === 0) {
                    this.servicePointItem.push(d)
                  }
                }
                if (servicePointItem.filter(el => { return el.servicePoint === item.servicePoint }).length > 0) {
                  let otherCounr = JSON.parse(item.servicePointCount).filter(el => { return el.textTh === item.servicePoint })
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
              .then(async responses => {}).catch(error => {
                console.log('error function pushMsgQueue : ', error)
              })
          }
          this.$swal('เรียบร้อย', 'เรียกคิวสำเร็จ', 'success')
          await this.searchBooking('noti', item)
          this.clearTimeLoop()
        })
    },
    async closeJobSubmit (item) {
      this.closeSetTimeBookingListQueue()
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
              title: 'ต้องการเรียกคิวนี้ ใช่หรือไม่?',
              type: 'question',
              showCancelButton: true,
              confirmButtonColor: '#1DBF73',
              cancelButtonColor: '#F38383',
              confirmButtonText: 'ใช่',
              cancelButtonText: 'ไม่'
            }).then(async response => {
              let USER_ROLE = this.session.data.USER_ROLE || ''
              let empId = this.session.data.empId || ''
              if (USER_ROLE === 'storeFront' && empId !== '') {
                let statusBookingCheck = await this.checkBookingStatus(item.bookNo)
                if (statusBookingCheck === 'confirm') {
                  let statusUpdateEmp = await this.updateEmp(item.bookNo, 'confirm')
                  if (statusUpdateEmp === true) {
                    await this.closeJob(item)
                  } else {
                    this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
                    await this.searchBooking('unNoti')
                    this.clearTimeLoop()
                  }
                } else {
                  this.$swal('คำเตือน', 'รายการนี้มีพนักงานท่านอื่น เริ่มงานไปแล้ว', 'info')
                  await this.searchBooking('unNoti')
                  this.clearTimeLoop()
                }
              } else {
                await this.closeJob(item)
              }
            })
          }
        } else {
          this.$swal('ผิดพลาด', 'รายการนี้ได้เปลี่ยนสถานะไปแล้ว', 'info')
          await this.searchBooking('unNoti')
          this.clearTimeLoop()
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
        .post(this.DNS_IP + '/Booking/editQueueEmp/' + bookNo + '?status=' + status, dtt)
        .then(async response => {
          let rs = response.data
          result = rs.status
        })
      return result
    },
    async checkBookingStatus (bookNo) {
      let result = ''
      await axios
        .get(this.DNS_IP + '/booking_view/get?shopId=' +
            this.shopId +
            '&bookNo=' + bookNo)
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
          this.$swal('เรียบร้อย', 'กรุณารอเรียกคิว', 'success')
        })
    },
    setPrint (item, language) {
      let docDefinition = {}
      if (this.shopImg === '') {
        if (language === 'th') {
          docDefinition = {
            pageSize: 'A4',
            content: [
              {
                text: this.shopName,
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
                  {alignment: 'center', text: 'หมายเลขคิวของคุณ\n', fontSize: 20, color: 'black'},
                  {alignment: 'center', text: item.storeFrontQueue, fontSize: 120, color: 'black'}
                ]
              },
              {
                text: 'QR Code สำหรับรับการแจ้งเตือน',
                fontSize: 15,
                alignment: 'center'
              },
              { qr: 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/ConfirmUser?bookNo=' + item.bookNo + '&shopId=' + item.shopId, fit: '200', alignment: 'center' },
              {
                text: '   ',
                fontSize: 15,
                widths: ['*']
              },
              {
                text: '*ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
                fontSize: 15,
                alignment: 'center'
              },
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
            defaultStyle: { // 4. default style 'KANIT' font to test
              font: 'Kanit'
            }
          }
        } else {
          docDefinition = {
            pageSize: 'A4',
            content: [
              {
                text: this.shopName,
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
                alignment: 'center', text: 'Number', fontSize: 20, color: 'black'
              },
              {
                alignment: 'center', text: item.storeFrontQueue, fontSize: 110, color: 'black'
              },
              {
                text: 'QR Code for receiving notifications',
                fontSize: 15,
                alignment: 'center'
              },
              { qr: 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/ConfirmUser?bookNo=' + item.bookNo + '&shopId=' + item.shopId, fit: '200', alignment: 'center' },
              {
                text: '   ',
                fontSize: 15,
                widths: ['*']
              },
              {
                text: "The company reserves the right to skip the queue. In case the customer doesn't come",
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
            defaultStyle: { // 4. default style 'KANIT' font to test
              font: 'Kanit'
            }
          }
        }
      } else {
        if (language === 'th') {
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
              {
                alignment: 'center',
                text: item.flowName,
                fontSize: 30,
                widths: ['*']
              },
              {
                text: [
                  {alignment: 'center', text: 'หมายเลขคิวของคุณ\n', fontSize: 20, color: 'black'},
                  {alignment: 'center', text: item.storeFrontQueue, fontSize: 120, color: 'black'}
                ]
              },
              {
                text: 'QR Code สำหรับรับการแจ้งเตือน',
                fontSize: 15,
                alignment: 'center'
              },
              { qr: 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/ConfirmUser?bookNo=' + item.bookNo + '&shopId=' + item.shopId, fit: '200', alignment: 'center' },
              {
                text: '   ',
                fontSize: 15,
                widths: ['*']
              },
              {
                text: '*ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
                fontSize: 15,
                alignment: 'center'
              },
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
            defaultStyle: { // 4. default style 'KANIT' font to test
              font: 'Kanit'
            }
          }
        } else {
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
              {
                alignment: 'center',
                text: item.flowNameEn,
                fontSize: 30,
                widths: ['*']
              },
              {
                alignment: 'center', text: 'Number', fontSize: 20, color: 'black'
              },
              {
                alignment: 'center', text: item.storeFrontQueue, fontSize: 110, color: 'black'
              },
              {
                text: 'QR Code for receiving notifications',
                fontSize: 15,
                alignment: 'center'
              },
              { qr: 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/ConfirmUser?bookNo=' + item.bookNo + '&shopId=' + item.shopId, fit: '200', alignment: 'center' },
              {
                text: '   ',
                fontSize: 15,
                widths: ['*']
              },
              {
                text: "The company reserves the right to skip the queue. In case the customer doesn't come",
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
            defaultStyle: { // 4. default style 'KANIT' font to test
              font: 'Kanit'
            }
          }
        }
      }
      pdfMake.vfs = pdfFonts.pdfMake.vfs // 2. set vfs pdf font
      pdfMake.fonts = {
        // download default Roboto font from cdnjs.com
        Roboto: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        },
        // Kanit Font
        Kanit: { // 3. set Kanit font
          normal: 'Kanit-Regular.ttf',
          bold: 'Kanit-Medium.ttf',
          italics: 'Kanit-Italic.ttf',
          bolditalics: 'Kanit-MediumItalic.ttf'
        }
      }

      pdfMake.createPdf(docDefinition).getDataUrl(function (outDoc) {
        let dataReplate = outDoc.replace('data:application/pdf;base64,', '')
        printJS({printable: dataReplate, type: 'pdf', base64: true})
      })
      this.overlay = true
    },
    async pushMessageRecallQueue (countNoti, checkGetQueue) {
      let bookSelect = this.itemBooking.filter((element, index) => { return element.statusBt === 'confirm' })
      if (bookSelect.length > 0) {
        let bookSelectuse = bookSelect.filter((element, index) => { return index === countNoti })
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
              .then(async responses => {}).catch(error => {
                console.log('error function pushMsgQueue : ', error)
              })
          }
        }
      }
    },
    async exportExcel () {
      const dataBooking = []
      const BookingData = await axios.get(this.DNS_IP + '/BookingData/get?shopId=' + this.shopId + '&masBranchID=' +
          this.masBranchID + '&dueDate=' + this.dateStart)
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
          วันที่นัดหมาย: item.dueDateText || '-',
          สถานะ: statusBt || '-',
          ชื่อลูกค้า: item.bookingDataCustomerName || '-',
          เบอร์โทร: item.bookingDataCustomerTel || '-',
          ชื่อLine: item.memberName || '-'
        }
        for (let a = 0; a < customField.length; a++) {
          const dt = customField[a]

          if (dt.bookNo === item.bookNo) {
            if (dt.fieldValue !== null || '') {
              obj[dt.fieldName] = dt.fieldValue || '-'
            }

            console.log('dt.bookNo', dt.fieldValue)
          }
        }
        dataExport.push(obj)
      }
      // Populate data array with shop data

      const ws = XLSX.utils.json_to_sheet(dataExport)

      const today = new Date()
      const year = today.getFullYear()
      const month = (today.getMonth() + 1).toString().padStart(2, '0') // +1 เพราะเดือนเริ่มที่ 0
      const day = today.getDate().toString().padStart(2, '0')
      const hours = today.getHours().toString().padStart(2, '0')
      const minutes = today.getMinutes().toString().padStart(2, '0')

      const formattedDate = `${day}-${month}-${year}-${hours}-${minutes}`
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, 'BookingListQueue_' + formattedDate + '.xlsx')
    }
  }
}
</script>
<style scope>
.btnTobicon .v-btn__content {
    display:flex;
    flex-direction:column;
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
.bottomAdd {
  background: linear-gradient(3.82deg, #1093FF 0.25%, #66BAFF 99.75%);
}
.InputData{
  margin: 0px !important;
  padding: 0px !important;
}
</style>
