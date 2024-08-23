<template>
  <div>
    <v-card flat v-if="!dataReady" class="centered">
      <v-card-text>
        <waitingAlert></waitingAlert>
      </v-card-text>
    </v-card>
    <v-card flat v-if="dataReady" >
      <v-toolbar color="#173053" dark extended flat>
        <!-- <a  @click="getCheckWait()">รายการที่ยังไมไ่ด้ยืนยัน</a> -->
        <!-- <v-btn
          v-if="dataItem.length > 0"
          class="text-white"
          color="warning"
          style="z-index:8;margin-right: 5px;"
          @click="getCheckWait()"
        >
          <v-icon color="white" left>mdi-alert-decagram</v-icon>
          รายการที่ยังไมไ่ด้ยืนยัน
        </v-btn> -->
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      </v-toolbar>

      <v-card class="mx-auto" max-width="700" elevation="0"  style="margin-top: -52px;">
        <v-toolbar flat>
          <v-toolbar-title class="#173053--text">
            {{ dataItem[0].cusName }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <v-btn
            v-if="dataItem.length > 0"
            class="text-white"
            color="warning"
            small
            outlined
            style="z-index:8;margin-right: 5px;"
            @click="getCheckWait()"
          >
            <v-icon left>mdi-alert-decagram</v-icon>
            รายการที่รอการยืนยัน
          </v-btn>
          <!-- <a @click="getCheckWait()"><h6><strong>รายการที่ยังไม่ได้ยืนยัน</strong></h6></a> -->
          <v-btn color="#173053" icon @click="toggle">
            <v-icon>mdi-calendar-multiple-check</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <template v-if="paymentStatus === 'noCash'">
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
                  ท่านยังไม่ได้ชำระค่าบริการ
                </v-col>
                <v-col class="shrink" @click="gotoBilling()">
                  <v-btn small>ชำระค่าบริการ</v-btn>
                </v-col>
              </v-row>
            </v-alert>
        </template>
          <template v-if="paymentStatus === 'wait'">
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

        <v-card-text style="height: 100%;">
          <v-container>
            <template v-if="BookingDataItemEdit">
              <div class="avatar text-center">
                <div style="display:flex;align-items: center;justify-content: center;" v-if="dataItem[0].memberName">
                  <h4>
                  {{dataItem[0].memberName}}
                  </h4>
                  <v-btn
                    class="ml-3"
                    dark
                    fab
                    x-small
                    color="blue"
                    @click="coppyLink(dataItem[0].memberName)"
                  >
                    <v-icon dark>
                      mdi-content-copy
                    </v-icon>
                  </v-btn>
                </div>
                <v-avatar size="120" style="border:5px solid #FFFFFF;">
                <v-img
                  v-if="dataItem[0].memberPicture"
                  :src="dataItem[0].memberPicture"
                ></v-img>
                <v-icon size="100" color="orange" v-else>
                  mdi-tooltip-account
                </v-icon>
              </v-avatar>
              </div>
              <v-row class="InputData">
                 <!-- <v-select
                    v-model="masBranchID"
                    :items="branch"
                    label="สาขา"
                    outlined
                    dense
                    class="pa-2 pb-0 pt-0"
                    readonly
                  ></v-select> -->
                  <v-text-field
                    v-model="BookingDataItemEdit[0].masBranchName"
                    label="สาขา"
                    class="pa-2 pb-0 pt-0"
                    outlined
                    dense
                    readonly
                  ></v-text-field>
                </v-row>
              <v-row class="InputData">
                  <v-text-field
                    v-model="BookingDataItemEdit[0].flowName"
                    label="ประเภทบริการ"
                    class="pa-2 pb-0 pt-0"
                    outlined
                    dense
                    readonly
                  ></v-text-field>
                </v-row>
              <div
                v-for="(item, index) in BookingDataItemEdit"
                :key="index"
              >
                <template
                  v-if="
                    item.conditionField === '' ||
                      item.conditionField === null
                  "
                >
                  <v-row class="InputData">
                    <v-text-field
                      v-model="item.fieldValue"
                      :label="item.fieldName"
                      class="pa-2 pb-0 pt-0"
                      outlined
                      dense
                      readonly
                      v-if="item.fieldName === 'เบอร์โทร'"
                      @click="dial(item.phone)"
                      prepend-inner-icon="mdi-phone"
                    ></v-text-field>
                    <v-text-field
                      v-model="item.fieldValue"
                      :label="item.fieldName"
                      class="pa-2 pb-0 pt-0"
                      outlined
                      dense
                      readonly
                      v-else
                    ></v-text-field>
                    <!-- <v-icon class="pa-3 pb-10 pt-0" v-if="item.fieldName === 'เบอร์โทร'" large color="#64DD17" @click="dial(item.phone)">call</v-icon> -->
                  </v-row>
                </template>
                <template
                  v-if="
                    item.conditionField !== '' &&
                      BookingDataItemEdit.filter(row => {
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
                        BookingDataItemEdit.filter(row => {
                          return (
                            row.fieldId ===
                            parseInt(item.conditionField)
                          );
                        })[0].fieldValue
                    "
                  >
                    <v-row class="InputData">
                      <v-text-field
                        v-model="item.fieldValue"
                        :label="item.fieldName"
                        class="pa-2 pb-0 pt-0"
                        outlined
                        dense
                        readonly
                        v-if="item.fieldName === 'เบอร์โทร'"
                        @click="dial(item.phone)"
                        prepend-inner-icon="mdi-phone"
                      ></v-text-field>
                      <v-text-field
                        v-model="item.fieldValue"
                        :label="item.fieldName"
                        class="pa-2 pb-0 pt-0"
                        outlined
                        dense
                        readonly
                        v-else
                      ></v-text-field>
                      <!-- <v-text-field
                        v-model="item.fieldValue"
                        :label="item.fieldName"
                        outlined
                        readonly
                        class="pa-2 pb-0 pt-0"
                        dense
                        :prepend-inner-icon="item.fieldName === 'เบอร์โทร' ? 'mdi-map-marker' : ''"
                      ></v-text-field> -->
                      <!-- <v-icon class="pa-3 pb-10 pt-0" v-if="item.fieldName === 'เบอร์โทร'" large color="#64DD17" @click="dial(item.phone)">call</v-icon> -->
                    </v-row>
                  </template>
                </template>
                  <template  v-if="item.conditionField === 'flow' ">
                    <template v-if="parseInt(item.conditionValue) === parseInt(flowIdSelect) ">
                      <v-row class="InputData">
                        <v-text-field
                          v-model="item.fieldValue"
                          :label="item.fieldName"
                          class="pa-2 pb-0 pt-0"
                          outlined
                          dense
                          readonly
                          v-if="item.fieldName === 'เบอร์โทร'"
                          @click="dial(item.phone)"
                          prepend-inner-icon="mdi-phone"
                        ></v-text-field>
                        <v-text-field
                          v-model="item.fieldValue"
                          :label="item.fieldName"
                          class="pa-2 pb-0 pt-0"
                          outlined
                          dense
                          readonly
                          v-else
                        ></v-text-field>
                        <!-- <v-text-field
                          v-model="item.fieldValue"
                          :label="item.fieldName"
                          dense
                          readonly
                          class="pa-2 pb-0 pt-0"
                          outlined
                          :prepend-inner-icon="item.fieldName === 'เบอร์โทร' ? 'mdi-map-marker' : ''"
                        ></v-text-field> -->
                        <!-- <v-icon class="pa-3 pb-10 pt-0" v-if="item.fieldName === 'เบอร์โทร'" large color="#64DD17" @click="dial(item.phone)">call</v-icon> -->
                      </v-row>
                    </template>
                  </template>
              </div>
            </template>
            <v-row class="InputData">
              <v-text-field
                v-model="BookingDataItem[0].fieldValue"
                :label="BookingDataItem[0].fieldName"
                class="pa-2 pb-0 pt-0"
                outlined
                dense
                readonly
              ></v-text-field>
            </v-row>
            <v-row class="InputData">
              <v-text-field
                v-model="empDetails"
                label="พนักงานช่าง"
                class="pa-2 pb-0 pt-0"
                outlined
                dense
                readonly
              ></v-text-field>
            </v-row>
            <v-row class="my-3" v-if="bookItemAll[0].statusUpload1 === 'True' && bookItemAll[0].fileUpload1" style="display: flex;flex-direction: column;align-items: center;">
              <h5>{{ BookingFieldData[0].textUpload1 }}</h5>
              <template v-if="bookItemAll[0].fileUpload1.includes('[')">
                <v-row  v-for="(item, index) in JSON.parse(bookItemAll[0].fileUpload1)" :key="index">
                <v-col cols="12">
                   รายการที่ : {{index+1}}
                </v-col>
                <v-col cols="12" v-if="item.endsWith('.pdf') || item.endsWith('.xlsx') || item.endsWith('.xls')">
                  <v-btn
                    color="blue-grey"
                    class="ma-2 white--text"
                    @click="gotoLink(item)"
                  >
                    แสดงรายการ
                    <v-icon
                      right
                      dark
                    >
                      mdi-eye
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" v-else>
                  <v-img
                    max-height="150"
                    max-width="250"
                    contain
                    :src="item"
                    @click="gotoLink(item)"
                  ></v-img>
                </v-col>
              </v-row>
              </template>
              <template v-else>
                <v-row>
                <v-col cols="12">
                   รายการที่ : 1
                </v-col>
                <v-col cols="12" v-if="bookItemAll[0].fileUpload1.endsWith('.pdf') || bookItemAll[0].fileUpload1.endsWith('.xlsx') || bookItemAll[0].fileUpload1.endsWith('.xls')">
                  <v-btn
                    color="blue-grey"
                    class="ma-2 white--text"
                    @click="gotoPicture(bookItemAll[0].fileUpload1)"
                  >
                    แสดงรายการ
                    <v-icon
                      right
                      dark
                    >
                      mdi-eye
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" v-else>
                  <v-img
                    height="300"
                    contain
                    :src="srcUpload"
                    @click="gotoPicture(bookItemAll[0].fileUpload1)"
                  ></v-img>
                </v-col>
              </v-row>
              </template>
              <!-- <v-img
                v-if="get_url_extension(bookItemAll[0].fileUpload1) !== 'pdf'"
                max-height="150"
                max-width="250"
                :src="bookItemAll[0].fileUpload1"
                @click="SelectImg(bookItemAll[0].fileUpload1)"
              ></v-img>
              <v-text-field
                v-else
                class="mx-4"
                v-model="bookItemAll[0].fileUpload1"
                readonly
                style="width: -webkit-fill-available;"
                outlined
                dense
                :label="BookingFieldData[0].textUpload1"
                prepend-inner-icon="mdi-chevron-right-box"
                @click="gotoLink(bookItemAll[0].fileUpload1)"
              ></v-text-field> -->
              <!-- <p @click="gotoLink(bookItemAll[0].fileUpload1)">{{  bookItemAll[0].fileUpload1}}</p> -->
            </v-row>
            <v-row class="my-3" v-if="bookItemAll[0].statusUpload2 === 'True' && bookItemAll[0].fileUpload2" style="display: flex;flex-direction: column;align-items: center;">
              <h5>{{ BookingFieldData[0].textUpload2 }}</h5>
              <template v-if="bookItemAll[0].fileUpload2.includes('[')">
                <v-row  v-for="(item, index) in JSON.parse(bookItemAll[0].fileUpload2)" :key="index">
                <v-col cols="12">
                   รายการที่ : {{index+1}}
                </v-col>
                <v-col cols="12" v-if="item.endsWith('.pdf') || item.endsWith('.xlsx') || item.endsWith('.xls')">
                  <v-btn
                    color="blue-grey"
                    class="ma-2 white--text"
                    @click="gotoLink(item)"
                  >
                    แสดงรายการ
                    <v-icon
                      right
                      dark
                    >
                      mdi-eye
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" v-else>
                  <v-img
                    max-height="150"
                    max-width="250"
                    contain
                    :src="item"
                    @click="gotoLink(item)"
                  ></v-img>
                </v-col>
              </v-row>
              </template>
              <template v-else>
                <v-row>
                <v-col cols="12">
                   รายการที่ : 1
                </v-col>
                <v-col cols="12" v-if="bookItemAll[0].fileUpload2.endsWith('.pdf') || bookItemAll[0].fileUpload2.endsWith('.xlsx') || bookItemAll[0].fileUpload2.endsWith('.xls')">
                  <v-btn
                    color="blue-grey"
                    class="ma-2 white--text"
                    @click="gotoPicture(bookItemAll[0].fileUpload2)"
                  >
                    แสดงรายการ
                    <v-icon
                      right
                      dark
                    >
                      mdi-eye
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" v-else>
                  <v-img
                    height="300"
                    contain
                    :src="srcUpload"
                    @click="gotoPicture(bookItemAll[0].fileUpload2)"
                  ></v-img>
                </v-col>
              </v-row>
              </template>
              <!-- <v-img
                v-if="get_url_extension(bookItemAll[0].fileUpload2) !== 'pdf'"
                max-height="150"
                max-width="250"
                :src="bookItemAll[0].fileUpload2"
                @click="SelectImg(bookItemAll[0].fileUpload2)"
              ></v-img>
              <v-text-field
                v-else
                class="mx-4"
                v-model="bookItemAll[0].fileUpload2"
                readonly
                style="width: -webkit-fill-available;"
                outlined
                dense
                :label="BookingFieldData[0].textUpload2"
                prepend-inner-icon="mdi-chevron-right-box"
                @click="gotoLink(bookItemAll[0].fileUpload2)"
              ></v-text-field> -->
            </v-row>
            <v-col cols='12' class="pb-0 pt-0 mt-0" v-if="dataItem[0].checkOnsite !== 'True'">
              <v-radio-group v-model="radiosRemark">
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
            <div class="text-center">
              <v-btn
                v-if="showMap === 'แสดง' && dataItem[0].addressLatLong !== null"
                color="blue-grey darken-1"
                fab
                small
                dark
                @click.stop="setShowMap(dataItem[0])"
              >
                <v-icon dark> mdi-map-marker-radius-outline </v-icon>
              </v-btn>
              <v-btn
                color="success"
                small
                id="v-step-2"
                v-if="
                  dataItem[0].statusBt !== 'confirmJob' &&
                    dataItem[0].statusBt !== 'confirm' && dataItem[0].checkOnsite !== 'True'
                "
                :disabled="dataItem[0].chkConfirm"
                @click="confirmChk(dataItem[0])"
              >
                <!-- <v-icon dark> mdi-phone-check </v-icon> -->
                <v-icon dark size="30" class="iconify" data-icon="quill:mail-subbed"></v-icon>
                ยืนยัน
              </v-btn>
              <v-btn
                color="success"
                id="v-step-2"
                small
                v-if="
                  dataItem[0].statusBt !== 'confirmJob' &&
                    dataItem[0].statusBt !== 'confirm' && dataItem[0].checkOnsite === 'True'
                "
                :disabled="dataItem[0].chkConfirm"
                @click.stop="confirmChkOnsite(dataItem[0])"
              >
                <!-- <v-icon dark> mdi-phone-check </v-icon> -->
                <v-icon dark size="30" class="iconify" data-icon="quill:mail-subbed"></v-icon>
                ยืนยัน
              </v-btn>
              <v-btn
                color="warning"
                v-if="dataItem[0].statusBt !== 'cancel'"
                id="v-step-2"
                small
                @click.stop="setDataChang(dataItem[0])"
              >
                <v-icon> mdi-calendar-clock </v-icon>
                เลื่อนนัด
              </v-btn>
              <v-btn
                color="error"
                id="v-step-2"
                small
                v-if="
                  dataItem[0].statusBt !== 'cancel' &&
                    dataItem[0].statusBt !== 'confirmJob' && dataItem[0].statusBt !== 'confirm'  && dataItem[0].checkOnsite === 'True'
                "
                @click.stop="setDataRemove(dataItem[0])"
              >
                <!-- <v-icon dark> mdi-phone-cancel </v-icon> -->
                <v-icon dark size="30" class="iconify" data-icon="carbon:rule-cancelled"></v-icon>
                ยกเลิกนัด
              </v-btn>
              <v-btn
                color="error"
                id="v-step-2"
                small
                v-if="
                  dataItem[0].statusBt !== 'cancel' &&
                    dataItem[0].statusBt !== 'confirmJob' && dataItem[0].checkOnsite !== 'True'
                "
                @click.stop="setDataRemove(dataItem[0])"
              >
                <!-- <v-icon dark> mdi-phone-cancel </v-icon> -->
                <v-icon dark size="30" class="iconify" data-icon="carbon:rule-cancelled"></v-icon>
                ยกเลิกนัด
              </v-btn>
            </div>
            <br>
            <div class="text-center" v-if="paymentImge !== ''">
              <h6><strong>หลักฐานเงินมัดจำ</strong></h6>
            </div>
            <!-- <div class="text-center">
              <a @click="getCheckWait()"><h6><strong>รายการที่ยังไม่ได้ยืนยัน</strong></h6></a>
            </div> -->
          </v-container>
        </v-card-text>
        <v-card-text>
          <v-container>
            <v-img
              v-if="paymentImge !== ''"
              class="pa-3"
              contain
              max-height="100%"
              max-width="100%"
              :src="paymentImge"
            ></v-img>
          </v-container>
        </v-card-text>
      </v-card>
    </v-card>
    <v-dialog
      v-model="dialogImg"
      max-width="100%"
    >
      <v-card>
        <v-img
          :lazy-src="showImg"
          :src="showImg"
        ></v-img>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDataWait" fullscreen
      hide-overlay
      transition="dialog-bottom-transition">
      <v-card>
          <v-card-text>
            <!-- <div style="text-align: end;">
                <v-btn
                  fab
                  small
                  dark
                  color="#F3F3F3"
                  @click="(dialogDataWait = false)"
                >
                  <v-icon dark
                  color="#FE4A01 ">
                    mdi-close
                  </v-icon>
                </v-btn>
            </div> -->
              <v-row>
                <v-col cols="8" class="text-left pt-10">
                    <h5 class="font-weight-bold mt-5" style="color:#173053;">รายการที่ยังไม่ได้ยืนยัน</h5>
                  </v-col>
                  <v-col cols="4" class="text-right pt-10">
                    <v-btn
                      fab
                      small
                      dark
                      color="#F3F3F3"
                      @click="(dialogDataWait = false)"
                    >
                      <v-icon dark
                      color="#FE4A01 ">
                        mdi-close
                      </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols= "12" class="pb-0">
                    <v-data-table
                      :headers="headers"
                      :items="desserts"
                      hide-default-footer
                      disable-pagination
                      :mobile-breakpoint="0"
                      class="elevation-1"
                    >
                      <template v-slot:[`item.action`]="{ item }">
                        <v-btn
                          @click="gotoBookNo(item)"
                          rounded
                          x-small
                          color="primary"
                          dark
                        >
                          จัดการ
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
              </v-row>
          </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogMap" max-width="90%">
           <v-card class="text-center">
          <v-card-text>
              <v-container>
                <v-row>
              <v-col cols="10" class="text-left pt-10">
              <h3><strong>แสดงแผนที่</strong></h3>
              </v-col>
              <v-col cols="2" class="pt-10">
              <div style="text-align: end;">
                  <v-btn
                  class="mx-2"
                  fab
                  small
                  dark
                  color="white"
                  :style="styleCloseBt"
                  @click="dialogMap = false"
                  >
                  X
                  </v-btn>
              </div>
              </v-col>
          </v-row>
                <v-row>
                  <v-col cols= "12" class="pb-0">
                    <v-text-field
                      v-model="address"
                      outlined
                      label="ชื่อของที่อยู่"
                      auto-grow
                    ></v-text-field>
                  </v-col>
                  <v-col cols= "12" class="pb-0">
                    <v-card class="text-center">
                      <v-container>
                      <GmapMap
                        v-if="center !== null"
                        :center="center"
                        :zoom="15"
                        style="width: 100%; height: 200px"
                        :options="{ disableDefaultUI: true }"
                      >
                        <GmapMarker @click="gotoMap()" :position="center" />
                        <!-- <gmap-info-window
                          @closeclick="window_open=false"
                          :opened="window_open"
                          :position="center"
                          :options="{
                            pixelOffset: {
                              width: 0,
                              height: -35
                            }
                          }"
                      >
                          {{address}}
                      </gmap-info-window> -->
                      </GmapMap>
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
          </v-card-text>
           </v-card>
        </v-dialog>
    <v-dialog v-model="dialogChange" persistent max-width="90%">
      <v-card class="text-center">
        <v-card-text v-if="dataReady">
          <v-row>
              <v-col cols="10" class="text-left pt-10">
              <h3><strong>เปลี่ยนเวลานัดหมาย</strong></h3>
              </v-col>
              <v-col cols="2" class="pt-10">
              <div style="text-align: end;">
                  <v-btn
                  class="mx-2"
                  fab
                  small
                  dark
                  color="white"
                  :style="styleCloseBt"
                  @click="dialogChange = false , fromAddTimeCus = '' , customerTimeSlot = 'False'"
                  >
                  X
                  </v-btn>
              </div>
              </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="pb-0">
                    <v-select
                      v-model="flowSelect"
                      :items="dataFlow.filter((ii) => ii.allData.masBranchID === 'All' || ii.allData.masBranchID === null || ii.allData.masBranchID === masBranchID.toString())"
                      label="เลือกประเภทบริการ"
                      menu-props="auto"
                      outlined
                      dense
                      @change="getEmp(masBranchID), empSelect='',fromAddTimeCus = '', checkCustomerTimeSlot(),formChange.date = ''"
                    ></v-select>
                    </v-col>
            <v-col  cols="12" class="pt-0 pb-0">
                <v-select
                  v-model="bookingEmpFlow"
                  :items="dataEmp"
                  label="พนักงานช่าง"
                  menu-props="auto"
                  outlined
                  required
                  :rules="[rules.required]"
                  dense
                  @change="checkTime(),SetallowedDatesChange(bookingEmpFlow), formChange.date = '',fromAddTimeCus = '', checkCustomerTimeSlot()"
                ></v-select>
              </v-col>
              <v-col  cols="12" class="pt-0 pb-0">
                <v-select
                  v-if="customerTimeSlot === 'True' && bookingEmpFlow !== '' && timeSlotbyCustomer.length > 1"
                  v-model="fromAddTimeCus"
                  :items="timeSlotbyCustomer"
                  label="จำนวนชั่วโมง"
                  outlined
                  dense
                  required
                  :rules="[rules.required]"
                  @change="formChange.date = '', AddallowedDatesBysetTimebyday()"
                ></v-select>
              </v-col>
            <v-col cols="12" class="pt-0 pb-0" v-if="customerTimeSlot === 'False' ? bookingEmpFlow !== '' : fromAddTimeCus">
              <v-menu
                v-model="menuDateChange"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formChange.date"
                    label="วันที่"
                    prepend-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formChange.date"
                  :allowed-dates="allowedDatesChange"
                  @change="setLimitBooking(formChange.date)"
                  @input="menuDateChange = false"
                  :min="
                    new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .substr(0, 10)
                  "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" class="pt-0" v-if="customerTimeSlot === 'False' ? formChange.date !== '' : formChange.date !== '' && fromAddTimeCus !== ''">
                <v-select
                  v-model="formChange.time"
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
          <div class="text-center mt-2">
            <v-btn
              elevation="2"
              color="#173053"
              dark
              block
              @click="changeChk(dataChange)"
              >เปลี่ยนเวลานัดหมาย</v-btn
            >
            <v-btn
            v-if="
                  dataItem[0].statusBt !== 'confirmJob' &&
                    dataItem[0].statusBt !== 'confirm' && dataItem[0].checkOnsite === 'True'
                "
              class="mt-3"
              elevation="2"
              color="success"
              dark
              block
              @click="changeChkConfirmOnsite(dataChange)"
              >เปลี่ยนเวลานัดหมาย / ยืนยันนัดหมาย</v-btn
            >
            <v-btn
            v-if="
                  dataItem[0].statusBt !== 'confirmJob' &&
                    dataItem[0].statusBt !== 'confirm' && dataItem[0].checkOnsite !== 'True'
                "
              class="mt-3"
              elevation="2"
              color="success"
              dark
              block
              @click="changeChkConfirm(dataChange)"
              >เปลี่ยนเวลานัดหมาย / ยืนยันนัดหมาย</v-btn
            >
          </div>
        </v-card-text>
        <v-card-text v-else>
          <waitingAlert></waitingAlert>
        </v-card-text>
        <br />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogConfirm" max-width="90%">
      <v-card class="text-center">
        <v-card-text v-if="dataReady">
          <v-container>
            <v-row>
              <v-col cols="10" class="text-left pt-10">
              <h3><strong>ยืนยันรายการนี้</strong></h3>
              </v-col>
              <v-col cols="2" class="pt-10">
              <div style="text-align: end;">
                  <v-btn
                  class="mx-2"
                  fab
                  small
                  dark
                  color="white"
                  :style="styleCloseBt"
                  @click="dialogConfirm = false"
                  >
                  X
                  </v-btn>
              </div>
              </v-col>
          </v-row>
            <v-row v-if="checkStatusBooking === 'cancel'">
              <v-col cols="12" class="pt-0 pb-0">
              <v-select
                v-model="flowSelect"
                :items="dataFlow"
                label="เลือกประเภทบริการ"
                menu-props="auto"
                outlined
                dense
                @change="getEmp(masBranchID), empSelect='', flowIDLimit = flowSelect"
              ></v-select>
              </v-col>
              <v-col  cols="12" class="pt-0 pb-0">
                <v-select
                  v-model="bookingEmpFlow"
                  :items="dataEmp"
                  label="พนักงานช่าง"
                  menu-props="auto"
                  outlined
                  required
                  :rules="[rules.required]"
                  dense
                  @change="checkTime(),SetallowedDatesChange(bookingEmpFlow), formChange.date = '',fromAddTimeCus = '', checkCustomerTimeSlot(), flowIDLimit = flowSelect"
                ></v-select>
              </v-col>
              <v-col  cols="12" class="pt-0 pb-0">
                <v-select
                  v-if="customerTimeSlot === 'True' && bookingEmpFlow !== '' && timeSlotbyCustomer.length > 1"
                  v-model="fromAddTimeCus"
                  :items="timeSlotbyCustomer"
                  label="จำนวนชั่วโมง"
                  outlined
                  dense
                  required
                  :rules="[rules.required]"
                  @change="formChange.date = '', AddallowedDatesBysetTimebyday()"
                ></v-select>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0">
                <v-menu
                  v-model="menuDateChange"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formChange.date"
                      label="วันที่"
                      prepend-icon="mdi-calendar"
                      readonly
                      outlined
                      dense
                      v-bind="attrs"
                      v-on="on"
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="formChange.date"
                    :allowed-dates="allowedDatesChange"
                    @change="setLimitBookingEdit(formChange.date)"
                    @input="menuDateChange = false"
                    :min="
                      new Date(
                        Date.now() - new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .substr(0, 10)
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" class="pt-0 pb-0" v-if="formChange.date != ''">
                  <v-select
                    v-model="formChange.time"
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
          <v-row>
            <v-col cols="12" class="pt-0 pb-0">
              <v-textarea
                    v-model="dataConfirm.remark"
                    outlined
                    label="หมายเหตุเพิ่มเติม"
                    auto-grow
                  ></v-textarea>
            <v-select
              v-model="empSelect"
              :items="empSelectStep"
              label="พนักงานที่รับนัดหมาย"
              menu-props="auto"
              outlined
              dense
            ></v-select>
            </v-col>
          </v-row>
          <div class="text-center">
            <v-btn
              elevation="2"
              color="#173053"
              dark
              large
              block
              @click="onConfirm(dataConfirm)"
              >ยืนยันรายการนี้</v-btn
            >
          </div>
          </v-container>
        </v-card-text>
        <v-card-text v-else>
          <waitingAlert></waitingAlert>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogRemove" max-width="90%">
      <v-card class="text-center">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="10" class="text-left pt-10">
              <h3><strong>ยกเลิกรายการนี้</strong></h3>
              </v-col>
              <v-col cols="2" class="pt-10">
              <div style="text-align: end;">
                  <v-btn
                  class="mx-2"
                  fab
                  small
                  dark
                  color="white"
                  :style="styleCloseBt"
                  @click="dialogRemove = false"
                  >
                  X
                  </v-btn>
              </div>
              </v-col>
          </v-row>
          <v-row>
            <v-textarea
              v-model="remarkRemove"
              outlined
              label="หมายเหตุในการยกเลิก"
              auto-grow
            ></v-textarea>
          </v-row>
          <v-row>
            <v-select
              v-model="empSelect"
              :items="empSelectStep"
              label="พนักงานที่รับนัดหมาย"
              menu-props="auto"
              outlined
              dense
            ></v-select>
            <v-btn
              elevation="2"
              color="#173053"
              dark
              large
              block
              @click="cancelChk()"
              >ยกเลิกรายการนี้</v-btn
            >
          </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogConfirmOnsite" max-width="90%">
      <v-form ref="form_update" v-model="validUpdate" lazy-validation>
        <v-card class="text-center">
          <v-card-text v-if="dataConfirmReady">
            <v-container>
              <v-row>
              <v-col cols="10" class="text-left pt-10">
              <h3><strong>ยืนยันรายการนี้</strong></h3>
              </v-col>
              <v-col cols="2" class="pt-10">
              <div style="text-align: end;">
                  <v-btn
                  class="mx-2"
                  fab
                  small
                  dark
                  color="white"
                  :style="styleCloseBt"
                  @click="dialogConfirmOnsite = false"
                  >
                  X
                  </v-btn>
              </div>
              </v-col>
          </v-row>
            <v-row>
              <v-col
                v-for="(item, indexitem) in BookingDataItem"
                :key="indexitem"
                cols="12"
                class="pb-0"
              >
                <v-text-field
                  :label="item.fieldName"
                  :value="item.fieldValue"
                  outlined
                  dense
                  readonly
                ></v-text-field>
                <!-- {{item.fieldName}} : {{item.fieldValue}} -->
              </v-col>
              <!-- <v-col cols= "12" class="pb-0">
              <v-select
                v-model="empSelect"
                :items="empSelectStep"
                label="พนักงานที่รับนัดหมาย"
                menu-props="auto"
                outlined
                dense
              ></v-select>
              </v-col> -->
            </v-row>
            <v-row>
              <v-col cols="12" class="pb-0  pt-0" v-if="checkPayment === 'True'">
                <VuetifyMoney
                  v-model="totalPrice"
                  placeholder="ค่าใช้จ่ายทั้งหมด"
                  dense
                  label="ค่าใช้จ่ายทั้งหมด"
                  required
                  outlined
                  :rules="[rules.required]"
                  v-bind:options="options2"
                />
              </v-col>
              <v-col class="pb-0 pt-0" cols="12" v-if="dataPackage.length > 0">
                <v-card class="pl-1">
                  <v-subheader>ลูกค้ามี {{dataPackage.length}} แพ็คเกจ</v-subheader>
                  <v-subheader v-show="StatusPackage.packageName">ลูกค้าได้ทำการเลือกแพ็คเกจ {{StatusPackage.packageName}}</v-subheader>
                  <v-slide-group
                    active-class="success"
                    >
                    <v-slide-item v-for="(item, index) in dataPackage" :key="index">
                        <v-card
                        class="ma-2 p-1"
                        width="340"
                        height="90"
                        color="#FFFFFF"
                        elevation="6"
                        >
                        <v-row>
                          <v-col cols="4" class="pr-1">
                            <v-img
                          contain
                          max-height="80"
                          max-width="200"
                          :src="item.packageImg"
                        ></v-img>
                          </v-col>
                          <v-col cols="8" class="pb-6" >
                            <v-row class="font16 headline1">
                                <v-col class="pl-0 pt-2 pb-0">{{item.packageName}}</v-col>
                                <v-btn class="mr-4 mt-3" v-if="item.packageId !== packageId" color="green" outlined rounded x-small @click="UpdatePackage(item.packageId,'ตกลง',item.packageName, item)">ตกลง</v-btn>
                                <v-btn class="mr-4 mt-3" v-if="item.packageId === packageId" color="red" outlined rounded x-small @click="UpdatePackage(item.packageId,'ยกเลิก',item.packageName, item)">ยกเลิก</v-btn>
                            </v-row>
                            <v-row class="font14 headline1">
                                <v-col class="pl-1 pt-0 pb-0">จำนวนการใช้  {{item.balanceAmount}} / {{item.amount}} </v-col>
                            </v-row>
                            <v-row class="font14 headline1">
                                <v-col class="pl-0 pt-0 pb-0">วันหมดอายุ  {{new Date(item.expirePackage * 1000).toLocaleString().substr(0,9)}} </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                        </v-card>
                    </v-slide-item>
                </v-slide-group>
                </v-card>
                <br>
              </v-col>
              <!-- <v-col class="pb-0 pt-0"  cols="12" v-if="dataPackage.length > 0">
                <v-select
                  v-model="packageId"
                  :items="dataPackage"
                  dense
                  label="แพ็กเก็ต *"
                  outlined
                  required
                  clearable
                  item-text="packageName"
                  item-value="packageId"
                  return-object
                  :rules="[rules.required]"
                >
                </v-select>
              </v-col> -->
              <v-col class="pb-0 pt-0"  cols="12"  v-if="dataCoin.length > 0 && checkPayment === 'True'">
                <v-select
                  v-model="productExchangeRateId"
                  :items="dataCoin"
                  dense
                  outlined
                  label="เลือกอัตราแลกเปลี่ยน (แจก Coin Loyalty) *"
                  clearable
                  item-text="text"
                  item-value="value"
                  return-object
                >
                </v-select>
              </v-col>
            </v-row>
              <v-row>
              <v-col class="pt-0">
                <v-select
                  v-model="empSelectAdd"
                  :items="empSelectStepAdd"
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
              <v-col cols= "12"  class="pb-0 pt-0">
              <v-textarea
                v-model="remark"
                outlined
                label="หมายเหตุเพิ่มเติม"
                auto-grow
              ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-btn
                elevation="10"
                color="#173053"
                dark
                large
                block
                @click="addDataJob(dataConfirm)"
                >ยืนยันรายการนี้</v-btn
              >
              </v-col>
            </v-row>
            </v-container>
          </v-card-text>
          <div class="text-center" v-if="!dataConfirmReady">
            <waitingAlert></waitingAlert>
          </div>
        </v-card>
      </v-form>
      </v-dialog>
    <BookingQueue :branchParent="branch" :masBranchIDParent="masBranchID" :drawerParent="drawer" :menu1Parent="menu1" :timeTableParent="timeTable" :rulesParent="rules" :masterTimeParent="masterTime" :dataItemTimesChangeParent="dataItemTimesChange" :getTimesChangeParent="getTimesChange" :toggleParent="toggle" @updateTimeTable="updateTimeTablefromChild"></BookingQueue>
    <GoogleCalendarCmp ref="GoogleCalendarRef" />
  </div>
</template>
<script>
import axios from 'axios' // api
import moment from 'moment-timezone'
import BookingQueue from './BookingQueueMobile.vue'
import VuetifyMoney from '../VuetifyMoney.vue'
import waitingAlert from '../waitingAlert.vue'
import GoogleCalendarCmp from '../Core/GoogleCalendarCmp.vue'
export default {
  components: {
    BookingQueue,
    VuetifyMoney,
    waitingAlert,
    GoogleCalendarCmp
  },
  name: 'BookingMobileEmp',
  data () {
    return {
      srcUpload: '',
      headers: [
        { text: 'วันที่นัดหมาย', value: 'dueDate', sortable: true, align: 'left' },
        { text: 'ชื่อลูกค้า', value: 'cusName', sortable: true, align: 'left' },
        { text: 'จัดการ', value: 'action', sortable: false, align: 'center' }
      ],
      desserts: [],
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
      menuDateChange: false,
      menu1: false,
      session: this.$session.getAll(),
      dataItem: [],
      dataItemBooking: [],
      dataItemTimesChange: [],
      BookingDataItem: [],
      dataItemCheck: [],
      dataReady: false,
      getSelectText: '',
      timeTable: '',
      radiosRemark: 'ซ่อมปกติ',
      getSelectCount: 0,
      dialogEdit: false,
      dialogDataWait: false,
      dialogDelete: false,
      dialogChange: false,
      dialogJob: false,
      dialogConfirm: false,
      dialogRemove: false,
      dialogConfirmOnsite: false,
      drawer: false,
      formChange: {
        date: '',
        time: ''
      },
      masterTime: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
      timeavailable: [],
      empSelectStep: [],
      dataConfirm: [],
      empSelect: '',
      bookNoRemove: '',
      remarkRemove: '',
      masBranchID: '',
      branch: [],
      BookingDataListWait: [],
      BookingDataItemEdit: [],
      BookingDataListTimechange: [],
      dateStart: '',
      flowIdSelect: '',
      dialogMap: false,
      center: null,
      address: '',
      totalPrice: '',
      packageId: '',
      dataPackage: [],
      flowId: '',
      dataCoin: [],
      productExchangeRateId: '',
      dataConfirmReady: true,
      validUpdate: true,
      DataFlowName: [],
      empSelectStepAdd: [],
      editedItemSeleteField: [],
      empSelectAdd: '',
      remark: '',
      lineUserId: '',
      checkPayment: '',
      dueDateText: '',
      userId: '',
      StatusPackage: {
        status: 'ตกลง',
        color: 'green',
        packageName: '',
        token: ''
      },
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },
      swalConfig: {
        title: null,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      },
      dueDateOld: '',
      dueDateTimeOld: '',
      dataFlow: [],
      flowIDLimit: '',
      dateDayoff: [],
      dateDayCustom: [],
      countBooking: 0,
      dataTypeJob1: '',
      dataTypeJob2: '',
      dataTypeJob3: '',
      bookingEmpFlow: '',
      bookingEmpFlowOld: '',
      EmpItemLimit: [],
      dataEmp: [],
      dataEmpAll: [],
      empDetails: '',
      checkStatusBooking: '',
      paymentImge: '',
      bookNo: '',
      flowSelect: '',
      timeSlotbyCustomer: [],
      customerTimeSlot: 'False',
      fromAddTimeCus: '',
      paymentStatus: '',
      dateCheckBill: '',
      bookItemAll: [],
      dialogImg: false,
      showImg: '',
      BookingFieldData: [],
      statusGoogleCalendar: '',
      statusGoogleCalendarEmp: ''
    }
  },
  async mounted () {
    console.log('statusGoogleCalendar', this.statusGoogleCalendar, this.statusGoogleCalendarEmp)
    this.dateCheckBill = moment().format('YYYY-MM')
    await this.beforeCreate()
  },
  methods: {
    connectGoogleCalendarNoSession (status, bookNo) {
      console.log('status !!!', status)
      this.$refs.GoogleCalendarRef.checkTypeEvenEmpNoSession(status, bookNo, this.$session.getAll().data.shopId, this.DNS_IP)
    },
    async connectGoogleCalendar (status, bookNo) {
      this.connectGoogleCalendarNoSession(status, bookNo)
    },
    async getShop () {
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$session.getAll().data.shopId)
        .then(response => {
          let rs = response.data
          console.log('rssssssssssss', rs)
          if (rs.length > 0) {
            this.shop = rs
            this.statusGoogleCalendar = rs[0].statusGoogleCalendar
            this.statusGoogleCalendarEmp = rs[0].statusGoogleCalendarEmp
          }
        })
    },
    async coppyLink (item) {
      console.log('item', item)
      // this.$swal.fire('Any fool can use a computer')
      // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
      this.$swal({
        title: 'Copy successfully',
        text: 'คัดลอกลายชื่อเรียบร้อย',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      await navigator.clipboard.writeText(item)
    },
    showFileUpload (item, text) {
      if (text === '1') {
        if (item.fileUpload1.includes('[')) {
          this.srcUpload = JSON.parse(item.fileUpload1)
        } else {
          this.srcUpload = item.fileUpload1
        }
      } else {
        if (item.fileUpload2.includes('[')) {
          this.srcUpload = JSON.parse(item.fileUpload2)
        } else {
          this.srcUpload = item.fileUpload2
        }
      }
      this.dialogShowFileUpload = true
    },
    async SelectImg (Imgitem) {
      this.showImg = Imgitem
      this.dialogImg = true
    },
    gotoLink (Link) {
      window.open(Link, '_blank')
    },
    get_url_extension (url) {
      return url.split(/[#?]/)[0].split('.').pop().trim()
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
    gotoBilling () {
      this.$router.push('/BillingPlan')
    },
    calculateTime (start, end) {
      let countTime = null
      // if (end > start) {
      //   let time = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
      //   let h = parseInt(time.split(':')[0])
      //   let m = parseInt(time.split(':')[1])
      //   countTime = (h * 60) + m
      // } else {
      //   countTime = 0
      // }
      if (end > start) {
        let genTime = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
        let h = parseInt(genTime.split(':')[0])
        let m = parseInt(genTime.split(':')[1])
        if (h === 0 && m !== 0) {
          countTime = m + ' นาที'
        } else if (h !== 0 && m === 0) {
          countTime = h + ' ชม.'
        } else {
          countTime = h + ' ชม. ' + m + ' นาที'
        }
      } else {
        countTime = 'No Data'
      }
      return countTime
    },
    checkCustomerTimeSlotStart (flowId) {
      console.log('flowId', flowId)
      // console.log('flowIdTTT', this.dataFlow)
      this.timeSlotbyCustomer = []
      this.customerTimeSlot = this.dataFlow.filter((v) => v.value === flowId)[0].allData.customerTimeSlot
      // console.log('DataFlowNameall', this.customerTimeSlot, flowId)
      let allTime = []
      if (this.customerTimeSlot === 'True') {
        // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
        console.log('!!!!', this.EmpItemLimit)
        if (this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTimebyday === 'True') {
          // let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime).filter((items) => items.value === new Date().getDay())
          // setTime = timeJson[0].setTime || []
          let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime)
          let dataTime = []
          timeJson.forEach((itemTime, index) => {
            // console.log('item', itemTime)
            allTime = itemTime.setTime
            allTime.forEach((item, key) => {
              let ss = {}
              if (allTime.length === 1) {
                ss.text = 'ไม่ระบุ (มีเวลาเดียว)'
                ss.value = key + 1
                dataTime.push(ss)
              } else {
                if (key > 0) {
                  let start = allTime.filter((i, k) => k === 0)[0].value
                  let end = item.value
                  ss.text = this.calculateTime(start, end)
                  ss.value = key
                  // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                  dataTime.push(ss)
                  // this.timeSlotbyCustomer.push(ss)
                }
              }
            })
          })
          dataTime.forEach((i, n) => {
            if (this.timeSlotbyCustomer.filter((item) => item.text === i.text && item.value === i.value).length === 0) {
              console.log('n', n)
              this.timeSlotbyCustomer.push(i)
            }
          })
          console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
        } else {
          allTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime)
          allTime.forEach((item, key) => {
            let ss = {}
            if (allTime.length === 1) {
            // ss.text = item.value
            // ss.value = key + 1
            // this.timeSlotbyCustomer.push(ss)
              this.fromAddTimeCus = key + 1
            } else {
              if (key > 0) {
                let start = allTime.filter((i, k) => k === 0)[0].value
                let end = item.value
                ss.text = this.calculateTime(start, end)
                ss.value = key
                console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                this.timeSlotbyCustomer.push(ss)
              }
            }
          })
        }
      }
      console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
    },
    checkCustomerTimeSlot () {
      this.timeSlotbyCustomer = []
      this.customerTimeSlot = this.dataFlow.filter((v) => v.value === this.flowSelect)[0].allData.customerTimeSlot || 'False'
      console.log('DataFlowNameall', this.customerTimeSlot, this.flowSelect)
      let allTime = []
      if (this.customerTimeSlot === 'True') {
        if (this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTimebyday === 'True') {
          // let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime).filter((items) => items.value === new Date().getDay())
          // setTime = timeJson[0].setTime || []
          let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime)
          let dataTime = []
          timeJson.forEach((itemTime, index) => {
            // console.log('item', itemTime)
            allTime = itemTime.setTime
            allTime.forEach((item, key) => {
              let ss = {}
              if (allTime.length === 1) {
                ss.text = 'ไม่ระบุ (มีเวลาเดียว)'
                ss.value = key + 1
                dataTime.push(ss)
              } else {
                if (key > 0) {
                  let start = allTime.filter((i, k) => k === 0)[0].value
                  let end = item.value
                  ss.text = this.calculateTime(start, end)
                  ss.value = key
                  // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                  dataTime.push(ss)
                  // this.timeSlotbyCustomer.push(ss)
                }
              }
            })
          })
          dataTime.forEach((i, n) => {
            if (this.timeSlotbyCustomer.filter((item) => item.text === i.text && item.value === i.value).length === 0) {
              console.log('n', n)
              this.timeSlotbyCustomer.push(i)
            }
          })
          console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
        } else {
          allTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime)
          allTime.forEach((item, key) => {
            let ss = {}
            if (allTime.length === 1) {
            // ss.text = item.value
            // ss.value = key + 1
            // this.timeSlotbyCustomer.push(ss)
              this.fromAddTimeCus = key + 1
            } else {
              if (key > 0) {
                let start = allTime.filter((i, k) => k === 0)[0].value
                let end = item.value
                ss.text = this.calculateTime(start, end)
                ss.value = key
                console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                this.timeSlotbyCustomer.push(ss)
              }
            }
          })
        }
      }
      // console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
    },
    gotoBookNo (item) {
      this.$router.push('/BookingMobileEmp?bookNo=' + item.bookNo + '&shopId=' + this.$route.query.shopId)
      location.reload()
    },
    async getCheckWait () {
      this.BookingDataListWait = []
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.$route.query.shopId}&masBranchID=${this.masBranchID}&statusBt=is null`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach((row) => {
              if (typeof (this.BookingDataListWait[row.bookNo]) === 'undefined') {
                this.BookingDataListWait[row.bookNo] = []
              }
              this.BookingDataListWait[row.bookNo].push(row)
            })
          }
        })
      let urlApiwait = this.DNS_IP + '/booking_view/get?shopId=' + this.$route.query.shopId + '&masBranchID=' + this.masBranchID + '&statusBt=null&checkOnsite=is null'
      let dataItems = []
      await axios
        .get(urlApiwait)
        .then(async responses => {
          if (responses.data.length > 0) {
            // console.log('length', responses.data.length)
            for (let i = 0; i < responses.data.length; i++) {
              let d = responses.data[i]
              let s = {}
              if (this.BookingDataListWait[d.bookNo] !== undefined) {
                s.bookNo = d.bookNo
                s.flowId = d.flowId
                let checkDeposit = this.DataFlowName.filter(el => { return el.value === parseInt(d.flowId) })
                if (checkDeposit.length > 0) {
                  s.depositCheckStatus = checkDeposit[0].allData.checkDeposit || 'False'
                } else {
                  s.depositCheckStatus = 'False'
                }
                s.flowName = d.flowName
                s.dueDate = d.dueDate || ''
                s.dueDateDay = d.dueDateDay
                if (d.timeText === null || d.timeText === '') {
                  d.timeText = d.timeDue
                }
                if (s.dueDate === '') {
                  s.dueDateText = 'ไม่มีเวลานัดหมาย'
                } else {
                  s.dueDateText = this.format_dateNotime(d.dueDate) + ' ' + d.timeText
                }
                s.shopId = d.shopId
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
                s.lineUserId = d.lineUserId
                s.memberName = d.memberName || ''
                s.memberPicture = d.memberPicture || ''
                s.timeDueHtext = d.timeDueH + ':00'
                s.timeDuetext = d.timeDue
                s.countChangeTime = d.countChangeTime || 0
                s.remarkReturn = d.remarkReturn || ''
                s.dateReturn = d.dateReturn || ''
                s.packageId = d.packageId || ''
                s.tokenPackage = d.tokenPackage || ''
                s.memberDataTag = JSON.parse(d.memberDataTag) || []
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
                    break
                }
                s.cusName = this.getDataFromFieldName(this.BookingDataListWait[d.bookNo], 'ชื่อ')
                s.cusReg = this.getDataFromFieldName(this.BookingDataListWait[d.bookNo], 'เลขทะเบียน')
                s.tel = this.getDataFromFieldName(this.BookingDataListWait[d.bookNo], 'เบอร์โทร')
                s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                dataItems.push(s)
                // console.log('this.countWaiting', this.countWaiting)
              } else {
                console.log('BookingNo no bookingData', d.bookNo)
              }
            }
            console.log('dataItems', dataItems)
            if (dataItems.length > 0) {
              this.desserts = dataItems.filter(el => { return el.bookNo !== this.bookNo })
            } else {
              this.desserts = []
            }
            this.dialogDataWait = true
          } else {
            this.desserts = []
            await this.$swal('ผิดพลาด', 'ไม่พบข้อมูล', 'error')
          }
        })
    },
    async AddallowedDatesBysetTimebyday () {
      await this.SetallowedDatesChange(this.bookingEmpFlow)
      if (this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTimebyday === 'True') {
        let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime)
        timeJson.forEach((item) => {
          if (item.setTime.length < this.fromAddTimeCus) {
            if (this.dateDayoff.filter((i) => i === item.value).length === 0) {
              this.dateDayoff.push(item.value)
            }
          }
        })
      }
      console.log('this.dateDayoff', this.dateDayoff)
    },
    async checkTime () {
      // LimitBookingBy masBranch
      // this.timeavailable = JSON.parse(this.branchData.filter(item => { return item.masBranchID === this.fromAdd.masBranchID })[0].setTime) || []

      // LimitBookingBy Flow
      this.timeavailable = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime) || []
      console.log('timevailable', this.timeavailable)
    },
    async getEmp (masBranchID) {
      this.dataEmp = []
      this.dataEmpAll = []
      await axios.get(this.DNS_IP + '/empSelect/get?privacyPage=bookingform&masBranchID=' + masBranchID).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            if (d.flowId !== null && d.flowId !== '') {
              let checkFlowId = JSON.parse(d.flowId)
              if (checkFlowId.filter((a) => parseInt(a) === this.flowSelect).length > 0) {
                let s = {}
                s.text = d.empFull_NameTH
                s.textEng = d.empFull_NameTH
                s.value = d.empId
                d.text = d.empFull_NameTH
                d.textEng = d.empFull_NameTH
                d.value = d.empId
                this.dataEmp.push(s)
                this.dataEmpAll.push(d)
                let limit = {}
                limit.empId = d.empId
                limit.limitBookingCheck = d.limitBookingCheck || 'False'
                limit.setTime = d.setTime || '[]'
                limit.setTimebyday = d.setTimebyday
                this.EmpItemLimit.push(limit)
              }
            }
          }
          if (this.dataEmp.length === 0) {
            this.$swal(
              'ไม่มีช่างสำหรับประเภทบริการนี้',
              'กรุณาเลือกประเภทบริการอื่นๆ',
              'info'
            )
          }
          console.log('EmpItemLimit', this.EmpItemLimit)
        } else {
          this.dataEmp = []
          this.dataEmpAll = []
          this.EmpItemLimit = []
        }
      })
      console.log('dataEmp', this.dataEmpAll)
    },
    async setLimitBooking (dateitem) {
      console.log('dateitem', dateitem)
      this.time = ''
      this.timeavailable = []
      let setTime = []
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      if (this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTimebyday === 'True') {
        let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime).filter((items) => items.value === new Date(dateitem).getDay())
        setTime = timeJson[0].setTime || []
        console.log('IF')
      } else {
        console.log('ELSE')
        setTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime) || []
      }
      console.log('this.EmpItemLimit.filter', this.EmpItemLimit)
      // this.showTable = []
      this.limitBookingCheck = this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].limitBookingCheck || 'False'
      if (this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].limitBookingCheck || 'False') {
        this.timeavailable = setTime
        console.log('DataFlowName', this.dataFlow.filter((v) => v.value === this.dataItem[0].flowId)[0].allData)
        // let slotByflow = this.dataFlow.filter((v) => v.value === this.dataItem[0].flowId)[0].allData.timeSlot
        let slotByflow = []
        console.log('dataEmp', this.dataItem)
        if (this.customerTimeSlot === 'False') {
          slotByflow = this.dataFlow.filter((v) => v.value === this.dataItem[0].flowId)[0].allData.timeSlot
        } else {
          slotByflow = this.fromAddTimeCus
        }
        let overTime = this.dataFlow.filter((v) => v.value === this.dataItem[0].flowId)[0].allData.overTime
        if (this.timeavailable.length >= slotByflow) {
          let LimitBooking = await this.getLimitBooking(dateitem)
          console.log('LimitBooking', LimitBooking)
          // เซ็ต Status ให้แต่ละช่วงเวลา
          // เซ็ต Status ให้แต่ละช่วงเวลา
          this.timeavailable.forEach((v, k) => {
            if (typeof v.status === 'undefined') {
              v.status = true
              if (v.limitBooking === '0') {
                v.status = false
              }
            }
          })
          console.log('timeavailable', this.timeavailable)
          if (LimitBooking.status !== false) {
            if (LimitBooking.length > 0) {
              this.timeavailable.forEach((v, k) => {
                let bookingTarget = LimitBooking.filter((a) => a.bookingTime === v.value)
                if (bookingTarget.length > 0) {
                  v.status = false
                  let bookingTargetSlot = bookingTarget[0].timeSlotCustomer || bookingTarget[0].timeSlot
                  for (let bT = 0; bT < bookingTargetSlot; bT++) {
                    if (this.timeavailable[k + bT] !== undefined) {
                      this.timeavailable[k + bT].status = false
                    }
                  }
                }
              })
            }
          }
          // For ค่าใส่ ตัวแปร array
          let Newtimeavailable = []
          let slotCheck = slotByflow
          for (let i = 0; i < this.timeavailable.length; i++) {
            let num = i + (slotCheck - 1)
            let checkitem = this.timeavailable.filter((item, key) => (key >= i && key <= num))
            console.log('checkitem', checkitem, slotCheck)
            Newtimeavailable.push(checkitem)
          }
          console.log('Newtimeavailable', Newtimeavailable)
          this.timeavailable = []
          Newtimeavailable.forEach((v, k) => {
            // console.log('v.length >= slotCheck', v.length, slotCheck)
            if (overTime === 'True') {
              if (v.filter((v) => v.status === false).length <= 0) {
                this.timeavailable.push(v[0])
              }
            } else {
              // ปิดเวลาสุดท้ายในกรณีที่ ไม่ต้องการให้จองเลยเวลา
              if (v.filter((v) => v.status === false).length <= 0 && v.length >= slotCheck) {
                console.log('else', v[0])
                this.timeavailable.push(v[0])
              }
            }
          })

          // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก
          // if (dateC === moment().format('YYYY-MM-DD')) {
          //   this.timeavailable = this.timeavailable.filter(item => moment().format(item.value) > moment().format('HH:mm'))
          // } else {
          // }
          // console.log('this.timeavailable 4', this.timeavailable)
          // console.log('Newitem', Newtimeavailable)
          if (this.timeavailable.length === 0) {
            this.$swal(
              'คิวเต็มแล้ว',
              'กรุณาเลือกวันที่ใหม่อีกครั้ง',
              'error'
            )
            this.date = ''
          }
        } else {
          this.timeavailable = []
          this.$swal(
            'คิวเต็ม',
            'ช่างคนนี้คิวเต็มแล้ว',
            'error'
          ).then(() => { this.date = '' }).catch(() => { this.date = '' })
        }
      } else {
        console.log('this.timeavailable ELSEEEEE', this.timeavailable)
        // LimitBookingBy Flow
        this.timeavailable = setTime
      }
      // await this.chekSlotTime()
    },
    async setLimitBookingEdit (dateitem) {
      console.log('dateitemssss', dateitem)
      this.time = ''
      this.timeavailable = []
      let setTime = []
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      console.log(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow }))
      if (this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTimebyday === 'True') {
        let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime).filter((items) => items.value === new Date(dateitem).getDay())
        setTime = timeJson[0].setTime || []
        console.log('IF')
      } else {
        console.log('ELSE')
        setTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].setTime) || []
      }
      console.log('this.EmpItemLimit.filter', this.EmpItemLimit)
      console.log('setTime', setTime)
      // this.showTable = []
      this.limitBookingCheck = this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].limitBookingCheck || 'False'
      if (this.EmpItemLimit.filter(item => { return item.empId === this.bookingEmpFlow })[0].limitBookingCheck || 'False') {
        this.timeavailable = setTime
        console.log('DataFlowName', this.dataFlow.filter((v) => v.value === this.flowSelect)[0].allData)
        // let slotByflow = this.dataFlow.filter((v) => v.value === this.flowSelect)[0].allData.timeSlot
        let slotByflow = []
        console.log('dataEmp', this.dataItem)
        if (this.customerTimeSlot === 'False') {
          slotByflow = this.dataFlow.filter((v) => v.value === this.flowSelect)[0].allData.timeSlot
        } else {
          slotByflow = this.fromAddTimeCus
        }
        let overTime = this.dataFlow.filter((v) => v.value === this.flowSelect)[0].allData.overTime
        if (this.timeavailable.length >= slotByflow) {
          let LimitBooking = await this.getLimitBooking(dateitem)
          console.log('LimitBooking', LimitBooking)
          // เซ็ต Status ให้แต่ละช่วงเวลา
          this.timeavailable.forEach((v, k) => {
            if (typeof v.status === 'undefined') {
              v.status = true
              if (v.limitBooking === '0') {
                v.status = false
              }
            }
          })
          if (LimitBooking.status !== false) {
            if (LimitBooking.length > 0) {
              this.timeavailable.forEach((v, k) => {
                let bookingTarget = LimitBooking.filter((a) => a.bookingTime === v.value)
                if (bookingTarget.length > 0) {
                  v.status = false
                  let bookingTargetSlot = bookingTarget[0].timeSlotCustomer || bookingTarget[0].timeSlot
                  for (let bT = 0; bT < bookingTargetSlot; bT++) {
                    if (this.timeavailable[k + bT] !== undefined) {
                      this.timeavailable[k + bT].status = false
                    }
                  }
                }
              })
            }
          }
          console.log('timeavailable', this.timeavailable)
          // For ค่าใส่ ตัวแปร array
          let Newtimeavailable = []
          let slotCheck = slotByflow
          for (let i = 0; i < this.timeavailable.length; i++) {
            let num = i + (slotCheck - 1)
            let checkitem = this.timeavailable.filter((item, key) => (key >= i && key <= num))
            console.log('checkitem', checkitem, slotCheck)
            Newtimeavailable.push(checkitem)
          }
          console.log('Newtimeavailable', Newtimeavailable)
          this.timeavailable = []
          Newtimeavailable.forEach((v, k) => {
            // console.log('v.length >= slotCheck', v.length, slotCheck)
            if (v.length > 0) {
              if (overTime === 'True') {
                if (v.filter((v) => v.status === false).length <= 0) {
                  this.timeavailable.push(v[0])
                }
              } else {
              // ปิดเวลาสุดท้ายในกรณีที่ ไม่ต้องการให้จองเลยเวลา
                if (v.filter((v) => v.status === false).length <= 0 && v.length >= slotCheck) {
                // console.log('else', v)
                  this.timeavailable.push(v[0])
                }
              }
            }
          })

          // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก
          // if (dateC === moment().format('YYYY-MM-DD')) {
          //   this.timeavailable = this.timeavailable.filter(item => moment().format(item.value) > moment().format('HH:mm'))
          // } else {
          // }
          // console.log('this.timeavailable 4', this.timeavailable)
          // console.log('Newitem', Newtimeavailable)
          if (this.timeavailable.length === 0) {
            this.$swal(
              'คิวเต็มแล้ว',
              'กรุณาเลือกวันที่ใหม่อีกครั้ง',
              'error'
            )
            this.date = ''
          }
        } else {
          this.timeavailable = []
          this.$swal(
            'คิวเต็ม',
            'ช่างคนนี้คิวเต็มแล้ว',
            'error'
          ).then(() => { this.date = '' }).catch(() => { this.date = '' })
        }
      } else {
        console.log('this.timeavailable ELSEEEEE', this.timeavailable)
        // LimitBookingBy Flow
        this.timeavailable = setTime
      }
      // await this.chekSlotTime()
    },
    async getLimitBooking (dateitem) {
      let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDateEmp/get?shopId=' + this.$route.query.shopId + '&empId=' + this.bookingEmpFlow + '&bookingDate=' + dateitem).then(async (response) => {
        let rs = response.data
        return rs
      })
      return LimitBooking
    },
    async getCheckCountBook () {
      // await axios.get(this.DNS_IP + '/booking_view/getCheckPack?statusBt=wait and confirm&shopId=' + this.$session.getAll().data.shopId + '&dueDate=' + this.format_dateNoDay(new Date())).then(response => {
      await axios.get(this.DNS_IP + '/booking_view/getCheckPack?statusBt=wait and confirm&shopId=' + this.$session.getAll().data.shopId + '&dueDateLastMonth=T').then(response => {
        let rs = response.data
        if (rs.status !== false) {
          this.countBooking = response.data.countJob
        } else {
          this.countBooking = 0
        }
      })
    },
    async getDataFlowAll () {
      this.dataFlow = await this.getDataFromAPI('/flow/get', 'flowId', 'flowName', '')
    },
    SetallowedDatesChange (bookingEmpFlow) {
      // console.log('!!!!!@@@@@@@', bookingEmpFlow)
      this.dataEmpAll.forEach((v, k) => {
        if (v.empId === bookingEmpFlow) {
          // console.log('dateDayoffValue', v.dateDayoffValue)
          // console.log('dateDayCustom', v.dateDayCustom)
          v.dateDayCustom = v.dateDayCustom || ''
          v.dateDayoffValue = v.dateDayoffValue || ''
          if (v.dateDayoffValue !== '') {
            // console.log('if')
            this.dateDayoff = JSON.parse(v.dateDayoffValue)
          } else {
            // console.log('else')
            this.dateDayoff = []
          }
          if (v.dateDayCustom !== '') {
            this.dateDayCustom = JSON.parse(v.dateDayCustom)
          } else {
            this.dateDayCustom = []
          }
        }
      })
      // console.log('datoff', this.dateDayoff)
      // console.log('Daycustom', this.dateDayCustom)
    },
    allowedDatesChange (val) {
      // if (this.dateDaylimit) {
      // console.log('!!!!!@@@@@@@', this.bookingEmpFlow)
      // console.log('!#@!@#!@#!@#!@#!@', this.dataEmpAll)
      if (this.dataEmpAll.filter(el => el.empId === this.bookingEmpFlow).length > 0) {
        if (this.dataEmpAll.filter(el => el.empId === this.bookingEmpFlow)[0].typeDayCustom === 'on') {
          // console.log('IF ON')
          return val === this.dateDayCustom.filter(el => el === val)[0]
        } else {
          // console.log('IF OFF')
          if (
            this.dateDayoff.filter(el => {
              return el === new Date(val).getDay()
            }).length === 0 &&
          this.dateDayCustom.filter(el => {
            return el === val
          }).length === 0
          ) {
            return val
          }
        }
      } else {
        return val
      }
      // }
    },
    pushMsgConfirm (bookNo) {
      axios
        .post(
          this.DNS_IP + '/Booking/pushMsgConfirm/' + bookNo
        )
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    pushMsgConfirmChangeTime (bookNo) {
      let dt = {
        dueDateOld: this.dueDateOld + ' ' + this.dueDateTimeOld
      }
      axios
        .post(
          this.DNS_IP + '/Booking/pushMsgConfirmChamgeTime/' + bookNo, dt
        )
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    validate (Action) {
      switch (Action) {
        case 'UPDATE':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_update.validate()
          })
          break

        default:
          break
      }
    },
    async getCustomFieldStart () {
      this.editedItemSeleteField = []
      axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.fieldId = d.fieldId
              s.fieldName = d.fieldName
              s.fieldType = d.fieldType
              s.optionField = d.optionField
              s.conditionField = d.conditionField
              s.conditionValue = d.conditionValue
              s.shopId = d.shopId
              s.showCard = d.showCard
              s.fieldValue = ''
              this.editedItemSeleteField.push(s)
            }
            // console.log('this.editedItemSeleteField', this.editedItemSeleteField)
          }
        })
    },
    async getEmpSelectAddBooking () {
      this.empSelectStepAdd = []
      await axios
        .get(this.DNS_IP + '/empSelect/getUse?privacyPage=booking&shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.masBranchID = d.masBranchID || ''
              var s = {}
              this.empSelectStepAdd.push(s)
              if (this.$session.getAll().data.masBranchID === '' || this.$session.getAll().data.masBranchID === null) {
                s.text = d.empFull_NameTH
                s.value = d.empId
                this.empSelectStepAdd.push(s)
              } else {
                if (this.$session.getAll().data.masBranchID === d.masBranchID || d.masBranchID === '') {
                  s.text = d.empFull_NameTH
                  s.value = d.empId
                  this.empSelectStepAdd.push(s)
                }
              }
            }
          }
        })
    },
    async getBookingField () {
      this.BookingFieldData = []
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.BookingFieldData = rs
            console.log('this.await this.getBookingField()', this.BookingFieldData)
          }
        })
    },
    async UpdatePackage (packageId, StatusPackage, packageName, data) {
      if (StatusPackage === 'ตกลง') {
        this.packageId = packageId
        // this.StatusPackage.status = 'ยกเลิก'
        // this.StatusPackage.color = 'red'
        this.StatusPackage.packageName = packageName
        this.StatusPackage.token = data.token
      } else {
        this.packageId = ''
        // this.StatusPackage.status = 'ตกลง'
        // this.StatusPackage.color = 'green'
        this.StatusPackage.packageName = ''
        this.StatusPackage.token = ''
      }
    },
    async getCoin (dt) {
      if (this.lineUserId !== '') {
        this.dataCoin = []
        await axios.get(this.DNS_IP_Loyalty + '/productExchangeRate/get?shopId=' + dt.shopId +
      '&flowId=' + dt.flowId).then(response => {
          console.log('productExchangeRate', response.data)
          let rs = response.data
          if (rs.status !== false) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.text = d.name
              d.value = d.productExchangeRateId
              this.dataCoin.push(d)
            // console.log('this.DataFlowName', this.DataFlowName)
            }
          } else {
            this.dataCoin = []
          }
        })
      }
    },
    async getPackage (dt) {
      this.dataPackage = []
      await axios.get(this.DNS_IP_Loyalty + '/PackageLog/get?shopId=' + dt.shopId + '&lineUserId=' + dt.lineUserId +
      '&flowId=' + dt.flowId).then(response => {
        console.log('PackageLog', response.data)
        let rs = response.data
        if (rs.status !== false) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            d.text = d.packageName
            d.value = d.packageId
            this.dataPackage.push(d)
          }
        } else {
          this.dataPackage = []
        }
      })
    },
    async confirmChkOnsiteAndChang (item) {
      await this.getEmpSelectAddBooking()
      await this.getDataFlow()
      this.getCustomFieldStart()
      this.empSelectAdd = parseInt(item.empSelect || 0)
      this.dialogConfirmOnsite = true
      this.dataConfirmReady = false
      console.log('confirmChkItem', item)
      console.log('this.DataFlowName.filter(el => { return el.value === item.flowId })[0].allData.checkPayment', this.DataFlowName)
      this.totalPrice = ''
      this.dataConfirm = item
      this.remark = item.remark
      this.lineUserId = item.lineUserId || ''
      this.userId = item.userId
      this.checkPayment = this.DataFlowName.filter(el => { return el.value === item.flowId })[0].allData.checkPayment
      console.log('checkPayment', this.checkPayment)
      console.log('DataFlowName', this.DataFlowName)
      // await this.getEmpSelect(item)
      if (this.lineUserId !== '') {
        await this.getPackage(item)
        await axios
          .get(this.DNS_IP_Loyalty + '/member/get?lineUserId=' + this.lineUserId + '&shopId=' + this.$session.getAll().data.shopId)
          .then(async responseMember => {
            if (responseMember.data.status === false) {
              this.productExchangeRateId = ''
              this.dataCoin = []
            } else {
              await this.getCoin(item)
            }
          })
        if (this.dataPackage.length > 0) {
          if (this.dataPackage.filter(el => { return el.packageId === item.packageId }).length > 0) {
            var dataPack = this.dataPackage.filter(el => { return el.packageId === item.packageId })
            // this.packageId = dataPack[0].value
            this.UpdatePackage(dataPack[0].value, 'ตกลง', dataPack[0].text, dataPack[0])
          } else {
            this.UpdatePackage('', 'ยกเลิก', '', '')
          }
        }
      }
      await this.getBookingDataJob(item, '')
      this.dataConfirmReady = true
    },
    async confirmChkOnsite (item) {
      await this.getEmpSelectAddBooking()
      await this.getDataFlow()
      this.getCustomFieldStart()
      this.empSelectAdd = parseInt(item.empSelect || 0)
      this.dialogConfirmOnsite = true
      this.dataConfirmReady = false
      console.log('confirmChkItem', item)
      console.log('this.DataFlowName.filter(el => { return el.value === item.flowId })[0].allData.checkPayment', this.DataFlowName)
      this.totalPrice = ''
      this.dataConfirm = item
      this.remark = item.remark
      this.lineUserId = item.lineUserId || ''
      this.userId = item.userId
      this.checkPayment = this.DataFlowName.filter(el => { return el.value === item.flowId })[0].allData.checkPayment
      console.log('checkPayment', this.checkPayment)
      console.log('DataFlowName', this.DataFlowName)
      // await this.getEmpSelect(item)
      if (this.lineUserId !== '') {
        await this.getPackage(item)
        await axios
          .get(this.DNS_IP_Loyalty + '/member/get?lineUserId=' + this.lineUserId + '&shopId=' + this.$session.getAll().data.shopId)
          .then(async responseMember => {
            if (responseMember.data.status === false) {
              this.productExchangeRateId = ''
              this.dataCoin = []
            } else {
              await this.getCoin(item)
            }
          })
        if (this.dataPackage.length > 0) {
          if (this.dataPackage.filter(el => { return el.packageId === item.packageId }).length > 0) {
            var dataPack = this.dataPackage.filter(el => { return el.packageId === item.packageId })
            // this.packageId = dataPack[0].value
            this.UpdatePackage(dataPack[0].value, 'ตกลง', dataPack[0].text, dataPack[0])
          } else {
            this.UpdatePackage('', 'ยกเลิก', '', '')
          }
        }
      }
      await this.getBookingDataJob(item, '')
      this.dataConfirmReady = true
    },
    async getBookingDataJob (dt, text) {
      console.log('itemBookingData', dt)
      this.lineUserId = dt.lineUserId
      this.dueDateText = dt.dueDateText
      this.jobNo = dt.jobNo
      this.BookingDataItem = []
      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP + '/BookingField/get?shopId=' + this.$route.query.shopId
        )
        .then(async response1 => {
          let rs2 = response1.data
          if (rs2.length > 0) {
            let bookingData = []
            bookingData = JSON.parse(rs2[0].flowfieldName)
            for (let i = 0; i < bookingData.length; i++) {
              let d = bookingData[i]
              itemIncustomField.push(d.fieldId)
            }
            console.log('itemIncustomField', itemIncustomField)
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
                      for (var i = 0; i < rs1.length; i++) {
                        var d = rs1[i]
                        // var s = {}
                        var dataBD = rs.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
                        if (dataBD.length > 0) {
                          if (dt.flowId === dataBD[0].flowId) {
                            d.bookNo = dataBD[0].bookNo
                            d.bookingFieldId = rs2[0].bookingFieldId
                            d.bookingDataId = dataBD[0].bookingDataId
                            d.flowId = dataBD[0].flowId
                            d.masBranchID = dataBD[0].masBranchID
                            d.addressLatLong = dataBD[0].addressLatLong
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
                            d.shopId = this.$route.query.shopId
                            d.userName = this.$session.getAll().data.userName
                            this.BookingDataItem.push(d)
                          }
                        }
                      }
                      // await this.getBookingField()
                      await this.getflowfield(dt)
                      this.dataEditJobReady = true
                    }
                  })
              })
          }
        })
    },
    addDataJob () {
      console.log('this.dataItem', this.dataItem)
      console.log('this.BookingDataItem', this.BookingDataItem)
      this.validate('UPDATE')
      setTimeout(() => this.addDataJobSubmit(), 500)
    },
    addDataJobSubmit () {
      if (this.$session.id() !== undefined) {
        if (this.dataItem.filter(row => row.bookNo === this.BookingDataItem[0].bookNo).length > 0) {
          if (this.validUpdate === true) {
            this.dataConfirmReady = false
            // console.log('this.BookingDataItem', this.BookingDataItem)
            let Add = []
            let fielditem = this.flowfieldNameitem
            for (var i = 0; i < this.BookingDataItem.length; i++) {
              var d = this.BookingDataItem[i]
              let update = {}
              let addData = false
              var dataField = this.editedItemSeleteField.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
              if (dataField[0].conditionField === '' || dataField[0].conditionField === null) {
                addData = true
              } else {
                if (
                  fielditem.filter(row => {
                    return row.fieldId === parseInt(d.conditionField)
                  }).length > 0
                ) {
                  console.log('this', fielditem)
                  if (d.conditionValue === fielditem.filter(row => {
                    return row.fieldId === parseInt(d.conditionField)
                  })[0].fieldValue
                  ) {
                    addData = true
                  } else if (d.conditionField === 'flow') {
                    addData = true
                  }
                } else if (d.conditionField === 'flow') {
                  addData = true
                }
              }
              if (addData) {
                if (d.fieldValue !== '') {
                  update.masBranchID = this.BookingDataItem[0].masBranchID
                  update.CREATE_USER = d.userName
                  update.LAST_USER = d.userName
                  update.packageId = this.packageId
                  update.totalPrice = this.totalPrice || '0'
                  update.checkCar = ''
                  update.userId = d.userId
                  // update.endDate = this.endDate
                  // update.endTime = this.endTime.value
                  update.fieldId = d.fieldId
                  update.fieldName = d.fieldName
                  update.fieldType = dataField[0].fieldType
                  update.fieldValue = d.fieldValue
                  update.flowId = d.flowId
                  // update.empStep = this.empSelectJob
                  // update.empSelect = this.$session.getAll().data.shopId
                  update.conditionField = dataField[0].conditionField
                  update.conditionValue = dataField[0].conditionValue
                  update.optionField = dataField[0].optionField
                  update.shopId = dataField[0].shopId
                  update.showCard = dataField[0].showCard
                  Add.push(update)
                }
              }
            }
            console.log('this.Add', Add)
            this.swalConfig.title = 'ต้องการยืนยันรายการ ใช่หรือไม่?'
            this.$swal(this.swalConfig).then(async result => {
              this.dataEditJobReady = false
              await axios
                .post(this.DNS_IP + '/job/add', Add)
                .then(async response => {
                  this.endDate = ''
                  this.endTime = ''
                  this.empSelectJob = ''
                  if (response.data.status) {
                    if (this.packageId !== '' && this.productExchangeRateId === '') {
                      await this.usePackage()
                    } else if (this.packageId === '' && this.productExchangeRateId !== '') {
                      if (this.lineUserId !== '') {
                        if (this.totalPrice !== '') {
                          await this.useCoin(this.totalPrice)
                        }
                      }
                    } else if (this.packageId !== '' && this.productExchangeRateId !== '') {
                      if (this.lineUserId !== '') {
                        if (this.totalPrice !== '') {
                          await this.useCoin(this.totalPrice)
                        }
                        await this.usePackage()
                      } else {
                        await this.usePackage()
                      }
                    }
                    var dt = {
                      bookNo: this.BookingDataItem[0].bookNo,
                      statusJob: 'confirm',
                      jobNo: response.data.jobNo,
                      empSelect: this.empSelectAdd,
                      remark: this.remark
                    }
                    await axios
                      .post(
                        this.DNS_IP +
                    '/Booking/editStatus/' +
                    this.BookingDataItem[0].bookNo,
                        dt
                      )
                      .then(async response1 => {
                        // await this.pushMsg(response.data.jobNo)
                        var dtt = {
                          bookNo: this.BookingDataItem[0].bookNo,
                          contactDate: this.format_date(new Date()),
                          status: 'confirm',
                          statusUse: 'use',
                          shopId: this.$session.getAll().data.shopId,
                          CREATE_USER: this.$session.getAll().data.userName,
                          LAST_USER: this.$session.getAll().data.userName
                        }
                        axios
                          .post(this.DNS_IP + '/booking_transaction/add', dtt)
                          .then(async response => {
                            this.$swal('เรียบร้อย', 'นำเข้าสำเร็จ', 'success')
                            if (this.lineUserId !== '') {
                              this.pushMsgCustomer(this.BookingDataItem[0].bookNo)
                              this.chkBookingNo()
                            } else {
                              this.chkBookingNo()
                            }
                            this.empSelectAdd = ''
                            this.totalPrice = ''
                            this.remark = ''
                            this.productExchangeRateId = ''
                            this.StatusPackage = {
                              status: 'ตกลง',
                              color: 'green',
                              packageName: '',
                              token: ''
                            }
                            this.packageId = ''
                            this.dialogConfirmOnsite = false
                            this.dataConfirmReady = true
                            // var dataJob = this.dataItem.filter(el => { return el.bookNo === this.dataQrcode.bookNo })
                            // this.getjob(dataJob[0])
                            // this.dialogJob = true
                          })
                      })
                  }
                }).catch(error => {
                  setTimeout(() => this.addDataJobSubmit(), 3000)
                  console.log('error function addDataJobSubmit : ', error)
                })
            }).catch(error => {
              this.dataConfirmReady = true
              console.log('error alert : ', error)
            })
          }
        } else {
          this.dataConfirmReady = true
          this.$swal('ผิดพลาด', 'ไม่มีนัดหมายเข้ารับบริการนี้', 'error').then(async response => {
            this.dialogConfirmOnsite = false
            this.chkBookingNo()
          }).catch(error => {
            console.log('error function addData : ', error)
            this.dialogConfirmOnsite = false
            this.chkBookingNo()
          })
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async pushMsgCustomer (bookNo) {
      let updateStatusSend = {
        updateStatusSend: 'false'
      }
      await axios
        .post(this.DNS_IP + '/BookingOnsite/pushMsgCustomer/' + bookNo, updateStatusSend)
        .then(async response => {})
    },
    async usePackage () {
      var params = {
        shopId: this.$session.getAll().data.shopId,
        token: this.StatusPackage.token,
        branchBeLinked: this.BookingDataItem[0].masBranchID
      }
      await axios({
        method: 'post',
        headers: {
          shopId: this.$session.getAll().data.shopId,
          lineUserId: this.lineUserId,
          lineId: this.userId
        },
        url: this.DNS_IP_Loyalty + '/use_package/edit?shopId=' + this.$session.getAll().data.shopId + '&token=' + this.StatusPackage.token,
        // url: this.DNS_IP_Loyalty + '/use_package/edit?shopId=' + this.$session.getAll().data.shopId + '&token=' + this.StatusPackage.token + '&branchBeLinked=' + this.BookingDataItem[0].masBranchID,
        data: params
      }).then((response) => {})
    },
    async useCoin (totalPrice) {
      // productExchangeRateId
      const today = new Date()
      // console.log(today)
      const date =
            today.getFullYear() +
            '' +
            (today.getMonth() + 1) +
            '' +
            today.getDate()
      const time =
            today.getHours() + '' + today.getMinutes() + '' + today.getSeconds()
      const token = date + '' + time
      var point = ''
      if (this.productExchangeRateId.exchangeRate === 0) {
        point = 0
      } else {
        point = parseInt(totalPrice) / this.productExchangeRateId.exchangeRate
      }
      var md5 = require('md5')
      var tokenKey = md5(token)
      let ds = {
        productExchangeRateId: this.productExchangeRateId.value,
        amount: parseInt(totalPrice),
        refId: '',
        point: parseInt(point),
        token: tokenKey,
        status: 'waiting',
        statusMemberCard: 'collect',
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName,
        shopId: this.$session.getAll().data.shopId,
        qrCodeURL: `https://liff.line.me/1656906322-RnAKKNyq/collect?shopId=${this.$session.getAll().data.shopId}&token=${tokenKey}`
        // masBranchID: '',
        // branchName: ''
      }
      console.log('ds', ds)
      await axios
        .post(this.DNS_IP_Loyalty + '/qrcode/add', ds)
        .then(async response => {
          var params = {
            shopId: this.$session.getAll().data.shopId,
            token: tokenKey
          }
          await axios({
            method: 'post',
            headers: {
              shopId: this.$session.getAll().data.shopId,
              lineUserId: this.lineUserId,
              lineId: this.userId
            },
            url: this.DNS_IP_Loyalty + '/memberCard/edit',
            data: params
          }).then((response) => {})
        })
    },
    gotoMap () {
      window.location.href = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + this.center.lat + ',' + this.center.lng
    },
    setShowMap (dt) {
      this.center = null
      if (dt.addressLatLong === null && dt.addressLatLong === '') {
        this.center = null
      } else {
        this.center = JSON.parse(dt.addressLatLong)
        this.address = dt.address
        this.dialogMap = true
      }
    },
    async beforeCreate () {
    // if (!this.$session.exists()) {
    //   this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId)
    // }
      // console.log(JSON.parse(localStorage.getItem('sessionData')))
      if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
        console.log('beforeCreateIF')
        if (JSON.parse(localStorage.getItem('sessionData')).shopId === this.$route.query.shopId) {
          this.$session.start()
          this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
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
          await this.getShop()
          await this.chkBookingNo()
          await this.getDataBranch()
          await this.getDataFlowAll()
          await this.getBookingField()
        } else {
          this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId)
        }
      } else {
        console.log('beforeCreateELSE')
        if (!this.$session.exists()) {
          this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId)
        } else {
          if (this.$session.getAll().data.shopId === this.$route.query.shopId) {
            localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
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
            await this.getShop()
            await this.chkBookingNo()
            await this.getDataBranch()
            await this.getDataFlowAll()
            await this.getBookingField()
          } else {
            this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId)
          }
        }
      }
      // console.log(JSON.stringify(this.$session.getAll().data))
    },
    getDataFromFieldName (data, key) {
      if (data !== undefined) {
        return data.filter(function (el) {
          return el.fieldName === key
        })
      } else {
        return []
      }
    },
    updateTimeTablefromChild (timeTable) {
      this.timeTable = timeTable
    },
    async getDataBranch () {
      this.branch = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName', '')
    },
    async getDataFlow () {
      this.DataFlowName = await this.getDataFromAPI('/flow/get', 'flowId', 'flowName', '&checkOnsite=True')
    },
    async getDataFromAPI (url, fieldId, fieldName, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.$route.query.shopId}${param}`)
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
    dial: function (number) {
      window.location = 'tel:' + number
    },
    toggle () {
      this.timeTable = this.momenDate_1(new Date())
      this.getTimesChange('update')
      this.drawer = !this.drawer
    },
    async getTimesChange (text) {
      try {
        this.dataItemTimesChange = []
        // console.log('this.dataItem', this.dataItem.filter(el => { return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable }))
        if (text === 'all') {
          this.dataItemTimesChange = this.dataItemBooking
        } else {
          if (this.masBranchID) {
            this.masBranchID = this.masBranchID
          } else {
            if (this.branch.length > 0) {
              this.masBranchID = this.branch[0].value
            } else {
              this.masBranchID = ''
            }
          }
          this.dataItemCheck = []
          var dataItems = []
          // var dataItemTimes = []
          var dateStart = moment(moment(this.timeTable, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
          console.log('dateStartxx', dateStart)
          await this.getBookingDataListTimechange(dateStart)
          await axios
            .get(
              // eslint-disable-next-line quotes
              this.DNS_IP +
                    '/booking_view/get?shopId=' +
                    this.$route.query.shopId +
                    '&masBranchID=' +
                    this.masBranchID +
                    '&dueDate=' + moment(moment(this.timeTable, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
            )
            .then(async response => {
              console.log('getData', response.data)
              if (response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                  let d = response.data[i]
                  let s = {}
                  s.bookNo = d.bookNo
                  s.flowId = d.flowId
                  s.flowName = d.flowName
                  s.dueDate = d.dueDate
                  s.dueDateDay = d.dueDateDay
                  s.userId = d.userId
                  s.chkConfirm = false
                  s.chkCancel = false
                  s.jobNo = d.jobNo
                  s.remarkRemove = d.remarkRemove || ''
                  s.timeDueHtext = d.timeDueH + ':00'
                  s.timeDuetext = d.timeDue
                  s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
                  s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
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
                      break
                    case 'cancel':
                      s.statusBtText = 'ยกเลิก'
                      break
                    case 'confirmJob':
                      s.statusBtText = 'รับรถแล้ว'
                      break
                    default:
                      s.statusBtText = 'รายการนัดหมายใหม่'
                      break
                  }

                  s.cusName = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'ชื่อ')
                  s.cusReg = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'เลขทะเบียน')
                  s.tel = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'เบอร์โทร')
                  s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                  s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                  s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                  // var chkTime = this.dataItemTime.filter(el => { return el.timeDueHtext === s.timeDueHtext })
                  // if (chkTime.length === 0) {
                  //   dataItemTimes.push(s)
                  // }
                  dataItems.push(s)
                }
              }
              if (dataItems.length === 0 || dataItems.status === false) {
                this.dataItemCheck = []
                // this.dataItemTime = []
                // this.dataReady = true
                // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
              } else {
                console.log('month new if')
                this.dataItemCheck = dataItems
                this.dataItemTimesChange = this.dataItemCheck.filter(el => {
                  let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
                  return dueDate === this.timeTable
                  // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
                }).sort((a, b) => {
                  if (a.timeDuetext < b.timeDuetext) return -1
                  return a.timeDuetext > b.timeDuetext ? 1 : 0
                })
              }
            })
        }
        console.log('this.dataItemTimesChange', this.dataItemTimesChange)
      } catch (err) {
        console.log(err)
      }
    },
    async getBookingDataListTimechange (dateStart) {
      this.BookingDataListTimechange = []
      if (this.masBranchID) {
        this.masBranchID = this.masBranchID
      } else {
        if (this.branch.length > 0) {
          this.masBranchID = this.branch[0].value
        } else {
          this.masBranchID = ''
        }
      }
      let url = `${this.DNS_IP}/BookingData/get?shopId=${this.$route.query.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach((row) => {
              if (typeof (this.BookingDataListTimechange[row.bookNo]) === 'undefined') {
                this.BookingDataListTimechange[row.bookNo] = []
              }
              this.BookingDataListTimechange[row.bookNo].push(row)
            })
          }
        })
      console.log(this.BookingDataListTimechange)
    },
    async chkBookingNo () {
      this.BookingDataItem = []
      this.dataReady = false
      this.bookNo = this.$route.query.bookNo
      // await this.getShowMap()
      if (this.bookNo === undefined) {
        // console.log('11111111111111', this.bookNo)
      } else {
        let dt = {
          bookNo: this.bookNo
        }
        axios
          .get(
            this.DNS_IP +
              '/booking_view/get?shopId=' +
              this.$route.query.shopId +
              '&bookNo=' +
              dt.bookNo
          )
          .then(async response => {
            let rs = response.data
            console.log('rsssssss', rs)
            if (rs.length > 0) {
              var dataItems = []
              this.dataItem = []
              for (let i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {}
                s.shopId = d.shopId
                if (d.fastTrack === 'False' && d.extraJob === 'False') {
                  this.radiosRemark = 'ซ่อมปกติ'
                } else if (d.fastTrack === 'False' && d.extraJob === 'True') {
                  this.radiosRemark = 'ExtraJob'
                } else if (d.fastTrack === 'True' && d.extraJob === 'False') {
                  this.radiosRemark = 'FastTrack'
                }
                s.memberName = d.memberName || ''
                s.memberPicture = d.memberPicture || ''
                s.bookNo = d.bookNo
                s.flowId = d.flowId
                s.flowName = d.flowName
                s.dueDate = d.dueDate
                s.dueDateDay = d.dueDateDay
                s.userId = d.userId
                s.timeText = d.timeText
                s.chkConfirm = false
                s.chkCancel = false
                s.jobNo = d.jobNo
                s.address = d.address || ''
                s.checkOnsite = d.checkOnsite || 'False'
                s.addressLatLong = d.addressLatLong || ''
                s.lineUserId = d.lineUserId
                s.empSelect = d.empSelect
                s.packageId = d.packageId
                s.remark = d.remark || null
                s.remarkConfirm1 = (d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True')
                s.remarkConfirm2 = (d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True')
                s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
                s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
                s.timeDueHtext = d.timeDueH + ':00'
                s.timeDuetext = d.timeDue
                if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
                  s.chkConfirm = true
                  s.chkCancel = false
                }
                if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
                  s.chkConfirm = false
                  s.chkCancel = true
                }
                s.statusBt = d.statusBt || 'wait'
                let dataBookingData = []
                await axios
                  .get(
                    // eslint-disable-next-line quotes
                    this.DNS_IP + "/BookingData/get?bookNo=" + d.bookNo
                  )
                  .then(async responses => {
                    console.log('dataBookingData', responses.data)
                    dataBookingData = responses.data
                    this.bookItemAll = response.data
                    if (responses.data) {
                      this.BookingDataItem.push({
                        fieldName: 'วันที่นัดหมาย',
                        fieldValue: d.dueDateText
                        // fieldValue: this.format_dateFUllTime(s.dueDate)
                      })
                      for (var i = 0; i < responses.data.length; i++) {
                        var t = responses.data[i]
                        if (t.userId === 'user-skip') {
                          t.userId = ''
                        }
                        t.shopId = this.$route.query.shopId
                        t.userName = JSON.parse(localStorage.getItem('sessionData')).userName
                        this.BookingDataItem.push(t)
                      }
                      console.log('BookingDataItem', this.BookingDataItem)
                      // await this.getBookingField()
                      // await this.getflowfield(dt)
                    }
                    // for (let i = 0; i < response.data.length; i++) {
                    //   let e = response.data[i]
                    //   if (e.fieldName === 'ชื่อ') {
                    //     s.cusName = s.fieldValue
                    //   }
                    //   if (e.fieldName === 'เลขทะเบียน') {
                    //     s.cusReg = s.fieldValue
                    //   }
                    // }
                  })
                this.flowIdSelect = dataBookingData[0].flowId
                this.flowSelect = dataBookingData[0].flowId
                s.masBranchID = dataBookingData[0].masBranchID
                this.masBranchID = dataBookingData[0].masBranchID
                this.bookingEmpFlow = d.bookingEmpFlow
                s.bookingEmpFlow = d.bookingEmpFlow
                this.paymentImge = d.depositImge || ''
                // this.timeavailable = JSON.parse(dataBookingData[0].setTime)
                s.cusName = this.getDataFromFieldName(dataBookingData, 'ชื่อ')
                s.cusReg = this.getDataFromFieldName(dataBookingData, 'เลขทะเบียน')
                s.tel = this.getDataFromFieldName(dataBookingData, 'เบอร์โทร')
                s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                console.log('dataE', d)
                dataItems.push(s)
              }
              console.log('dataItems', dataItems)
              if (dataItems.length === 0 || dataItems.status === false) {
                this.dataItem = []
                this.showMap = ''
                // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
              } else {
                await this.getEmp(this.masBranchID)
                console.log(this.dataEmpAll)
                console.log(this.bookingEmpFlow)
                console.log(this.dataEmp.filter(item => { return item.value === this.bookingEmpFlow }))
                if (this.dataEmp.filter(item => { return item.value === this.bookingEmpFlow }).length > 0) {
                  // this.BookingDataItem.push({
                  //   fieldName: 'พนักงานช่าง',
                  //   fieldValue: this.dataEmp.filter(item => { return item.value === this.bookingEmpFlow })[0].text
                  // // fieldValue: this.format_dateFUllTime(s.dueDate)
                  // })
                  this.empDetails = this.dataEmp.filter(item => { return item.value === this.bookingEmpFlow })[0].text
                }
                this.dataItem = dataItems
                if (dataItems[0].addressLatLong === '') {
                  this.showMap = 'ไม่แสดง'
                } else {
                  this.showMap = 'แสดง'
                }
                // this.dataReady = true
                await this.getBookingList(dataItems[0])
              }
            }
          })
        // masBranchID
        // this.getBookingData(dt)
        this.dialogEdit = true
      }
    },
    async getflowfield (item) {
      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP +
            '/flowField/get?flowId=' +
            item.flowId +
            '&shopId=' +
            this.$route.query.shopId
        )
        .then(response => {
          let tt = response.data
          // console.log('tt', tt)
          let flowId = tt[0].flowId
          let flowfieldName = []
          flowfieldName = JSON.parse(tt[0].flowfieldName)
          for (let a = 0; a < flowfieldName.length; a++) {
            let d = flowfieldName[a]
            itemIncustomField.push(d.fieldId)
          }
          this.getCustomfieldFlow(itemIncustomField, flowId)
          // console.log('itemIncustomField', itemIncustomField)
        })
    },
    async getCustomfieldFlow (item, flowId) {
      let flowfieldNameitems = []
      this.flowfieldNameitem = []
      await axios
        .get(this.DNS_IP + '/customField/fieldId?fieldId=' + item)
        .then(async response => {
          let rs = response.data
          console.log('rs', rs)
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.fieldId = d.fieldId
            s.flowId = flowId
            s.fieldName = d.fieldName
            s.optionField = d.optionField
            s.conditionField = d.conditionField || ''
            s.fieldType = d.fieldType
            s.fieldValue = ''
            s.CREATE_USER = ''
            s.LAST_USER = ''
            s.showCard = d.showCard
            s.shopId = this.shopId
            s.endDate = ''
            s.endTime = ''
            s.checkCar = 'False'
            s.conditionValue = d.conditionValue
            s.requiredField = d.requiredField
            flowfieldNameitems.push(s)
          }
          var data1 = flowfieldNameitems.filter(
            el => parseInt(el.conditionField || 0) > 0
          )
          // var data2 = []
          for (let i = 0; i < data1.length; i++) {
            let d = data1[i]
            let indexC = flowfieldNameitems.findIndex(function (o) {
              return o.fieldId === d.fieldId
            })
            let indexF = flowfieldNameitems.findIndex(function (o) {
              return o.fieldId === parseInt(d.conditionField)
            })
            flowfieldNameitems.splice(
              indexF + 1,
              0,
              flowfieldNameitems.splice(indexC, 1)[0]
            )
            // data2.push({'indexC': indexC, 'indexF': indexF})
          }
          // console.log('data1', data1)
          // console.log('data2', data2)
          for (var x = 0; x < flowfieldNameitems.length; x++) {
            var s = flowfieldNameitems[x]
            var chk = this.BookingDataItem.filter(el => {
              return parseInt(el.fieldId) === s.fieldId
            })
            console.log('cccxxx', s)
            console.log('chk', chk)
            if (chk.length === 0) {
              this.flowfieldNameitem.push(s)
            }
          }
          console.log('flowfieldNameitems', this.flowfieldNameitem)
          console.log('flowfieldNameitems', flowfieldNameitems)
          console.log('BookingDataItem', this.BookingDataItem)
          // setTimeout(() => this.validate('ADD'), 500)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async confirmChk (item) {
      console.log('item++', item)
      if (item.statusBt === 'wait') {
        this.checkStatusBooking = item.statusBt
        // this.SetallowedDatesChange(this.bookingEmpFlow)
        this.formChange.date = item.dueDateDay
        this.formChange.time = { text: item.timeText, value: item.timeDuetext }
        // await this.setLimitBookingEdit(item.dueDateDay)
        // this.formChange.date = this.momenDate_1(item.dueDate)
        // await this.setLimitBooking(this.momenDate_1(item.dueDate))
        console.log('confirmChk', item)
        this.dataConfirm = item
        await this.getEmpSelect(item)
        // if (this.timeavailable.filter(el => { return el.value === item.timeDuetext }).length > 0) {
        //   this.formChange.time = item.timeDuetext
        //   // if (this.timeavailable.filter(el => { return el.value === this.momenTime(item.dueDate) }).length > 0) {
        //   //   this.formChange.time = this.momenTime(item.dueDate)
        // } else {
        //   this.formChange.time = ''
        // }
        this.dialogConfirm = true
        console.log('formChange', this.formChange)
        console.log('flowSelect', this.flowSelect)
      } else {
        this.fromAddTimeCus = ''
        this.flowIDLimit = this.flowSelect
        this.checkStatusBooking = item.statusBt
        await this.getEmp(item.masBranchID)
        // this.bookingEmpFlow = ''
        this.checkCustomerTimeSlot()
        // await this.getEmp(this.masBranchID)
        // this.checkTime()
        this.SetallowedDatesChange(this.bookingEmpFlow)
        // this.fromAddTimeCus = ''
        // this.checkCustomerTimeSlot()
        this.formChange.date = item.dueDateDay
        await this.setLimitBookingEdit(item.dueDateDay)
        // this.formChange.date = this.momenDate_1(item.dueDate)
        // await this.setLimitBooking(this.momenDate_1(item.dueDate))
        console.log('confirmChk', item)
        this.dataConfirm = item
        await this.getEmpSelect(item)
        if (this.timeavailable.filter(el => { return el.value === item.timeDuetext }).length > 0) {
          this.formChange.time = item.timeDuetext
          // if (this.timeavailable.filter(el => { return el.value === this.momenTime(item.dueDate) }).length > 0) {
          //   this.formChange.time = this.momenTime(item.dueDate)
        } else {
          this.formChange.time = ''
        }
        this.dialogConfirm = true
        console.log('formChange', this.formChange)
        console.log('flowSelect', this.flowSelect)
      }
    },
    async onConfirm (item) {
      this.dataReady = false
      if (this.dataItem[0].checkOnsite === 'True') {
        this.dataReady = true
      } else {
        if (this.checkStatusBooking === 'cancel') {
          if (this.timeavailable.filter(el => { return el.value === this.formChange.time.value }).length > 0) {
            let chkStatLimit = this.dataEmpAll.filter(el => { return el.value === this.bookingEmpFlow })
            if (chkStatLimit.length > 0) {
              if (chkStatLimit[0].limitBookingCheck === 'True') {
                this.insertLimitBooking(item, this.formChange.date, this.formChange.time.value || this.formChange.time, this.bookingEmpFlow)
              }
            }
            var dtChange = {
              bookingEmpFlow: this.bookingEmpFlow,
              flowId: this.flowSelect,
              // countChangeTime: countTime,
              changeDueDate: 'change',
              dueDate: this.formChange.date + ' ' + this.formChange.time.value,
              timeText: this.formChange.time.text,
              LAST_USER: this.$session.getAll().data.userName
            }
            await axios
              .post(
                // eslint-disable-next-line quotes
                this.DNS_IP + "/BookingData/edit/" + item.bookNo,
                dtChange
              )
              .then(async response => {
                // let dtint = '0'
                // if (this.dataFlow.filter(el => { return el.value === item.flowId }).length > 0) {
                //   let dts = JSON.parse(this.dataFlow.filter(el => { return el.value === item.flowId })[0].allData.setTime) || []
                //   dtint = parseInt(dts.filter(el => el.value === item.timeDuetext)[0].limitBooking || '0')
                // } else {
                //   dtint = '0'
                // }
                let dt = {
                  // pageStatus: this.dataItem[0].statusBt,
                  // limitBookingCount: dtint,
                  bookNo: item.bookNo,
                  contactDate: this.format_date(new Date()),
                  status: 'confirm',
                  statusUse: 'use',
                  shopId: this.$session.getAll().data.shopId,
                  CREATE_USER: this.$session.getAll().data.userName,
                  LAST_USER: this.$session.getAll().data.userName
                }
                axios
                  .post(this.DNS_IP + '/booking_transaction/add', dt)
                  .then(async response => {
                    console.log('statusGoogleCalendar', this.statusGoogleCalendar)
                    if (this.statusGoogleCalendar === 'True') {
                      await this.connectGoogleCalendar('Add', item.bookNo)
                    }
                    await this.updateRemark(item)
                    this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                    let DTitem = item.userId
                    console.log('DTITEM', DTitem)
                    this.dialogConfirm = false
                    this.dataReady = true
                    if (DTitem !== 'user-skip') {
                      await this.chkBookingNo()
                      // this.getTimesChange('update')
                      this.pushMsgConfirm(item.bookNo)
                    } else {
                      await this.chkBookingNo()
                      // this.getTimesChange('update')
                    }
                    this.dialogConfirm = false
                    console.log('addDataGlobal', response)
                  })
                  .catch(error => {
                    console.log('error function addData : ', error)
                    this.dataReady = true
                  })
              })
          } else {
            this.$swal('ผิดพลาด', 'กรุณาเลือกเวลา', 'error')
            this.dataReady = true
          }
        } else {
          // let dtint = '0'
          // if (this.dataFlow.filter(el => { return el.value === item.flowId }).length > 0) {
          //   let dts = JSON.parse(this.dataFlow.filter(el => { return el.value === item.flowId })[0].allData.setTime) || []
          //   dtint = parseInt(dts.filter(el => el.value === item.timeDuetext)[0].limitBooking || '0')
          // } else {
          //   dtint = '0'
          // }
          let dt = {
            pageStatus: this.dataItem[0].statusBt,
            // limitBookingCount: dtint,
            bookNo: item.bookNo,
            contactDate: this.format_date(new Date()),
            status: 'confirm',
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.$session.getAll().data.userName,
            LAST_USER: this.$session.getAll().data.userName
          }
          axios
            .post(this.DNS_IP + '/booking_transaction/add', dt)
            .then(async response => {
              console.log('statusGoogleCalendar', this.statusGoogleCalendar)
              if (this.statusGoogleCalendar === 'True') {
                await this.connectGoogleCalendar('Add', item.bookNo)
              }
              await this.updateRemark(item)
              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              let DTitem = item.userId
              console.log('DTITEM', DTitem)
              this.dialogConfirm = false
              this.dataReady = true
              if (DTitem !== 'user-skip') {
                await this.chkBookingNo()
                // this.getTimesChange('update')
                this.pushMsgConfirm(item.bookNo)
              } else {
                await this.chkBookingNo()
                // this.getTimesChange('update')
              }
              this.dialogConfirm = false
              console.log('addDataGlobal', response)
            })
            .catch(error => {
              console.log('error function addData : ', error)
              this.dataReady = true
            })
        }
      }
      // }
    },
    async insertLimitBooking (item, dueDateNew, dueDateTimeNew, bookingEmpFlow) {
      let result = []
      let timeSlotCustomer = ''
      if (this.customerTimeSlot === 'True') {
        timeSlotCustomer = this.fromAddTimeCus
      } else {
        console.log('TESTSTTETETSETSET', this.dataFlow.filter((v) => v.value === this.flowSelect)[0].allData)
        timeSlotCustomer = this.dataFlow.filter((v) => v.value === this.flowSelect)[0].allData.timeSlot
      }
      let dt = {
        dueDateNew: dueDateNew,
        dueDateTimeNew: dueDateTimeNew,
        flowId: this.flowSelect,
        masBranchID: item.masBranchID,
        shopId: item.shopId,
        userId: item.userId,
        bookingEmpFlow: bookingEmpFlow,
        timeSlotCustomer: timeSlotCustomer,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios.post(this.DNS_IP + '/Booking/insertLimitBooking', dt).then(async response => {
        result = response.data
      })
      return result
    },
    async setDataRemove (item) {
      this.bookNoRemove = item
      this.dueDateOld = item.dueDateDay
      this.dueDateTimeOld = item.timeDuetext
      // this.dueDateOld = this.momenDate_1(item.dueDate)
      // this.dueDateTimeOld = this.momenTime(item.dueDate)
      await this.getEmpSelect(item)
      this.dialogRemove = true
      console.log(this.dueDateOld, this.dueDateTimeOld)
    },
    async cancelChk () {
      if (this.remarkRemove === '') {
        this.$swal('ผิดพลาด', 'กรุณากรอกหมายเหตุ', 'error')
      } else {
        let chkStatLimit = this.dataEmpAll.filter(el => { return el.value === this.bookingEmpFlow })
        if (chkStatLimit.length > 0) {
          if (chkStatLimit[0].limitBookingCheck === 'True') {
            let chkStatus = await this.updateLimitBookingCancel(this.bookNoRemove, this.dueDateOld, this.dueDateTimeOld)
            console.log('chkStatus', chkStatus)
            if (chkStatus.status) {
              this.onCancelChkSubmit()
            } else {
              this.onCancelChkSubmit()
            }
          } else {
            this.onCancelChkSubmit()
          }
        } else {
          this.onCancelChkSubmit()
        }
      }
    },
    onCancelChkSubmit () {
      var dt = {
        bookNo: this.bookNoRemove.bookNo,
        contactDate: this.format_date(new Date()),
        status: 'cancel',
        statusUse: 'use',
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.$session.getAll().data.userName,
        LAST_USER: this.$session.getAll().data.userName,
        remarkRemove: this.remarkRemove
      }
      axios
        .post(this.DNS_IP + '/booking_transaction/add', dt)
        .then(async response => {
          console.log('!!!!!statusGoogleCalendar', this.statusGoogleCalendar)
          if (this.statusGoogleCalendar === 'True') {
            await this.connectGoogleCalendar('Delete', dt.bookNo)
          }
          await this.updateRemark(this.bookNoRemove)
          this.pushMsglineCancel(this.bookNoRemove)
          this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
          console.log('addDataGlobal', response)
          this.dialogRemove = false
          await this.chkBookingNo()
          // this.getTimesChange('update')
          this.dialogRemove = false
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    pushMsglineCancel (item) {
      let lineUserId = item.lineUserId || ''
      if (lineUserId !== '') {
        var dt = {
          bookNo: item.bookNo,
          lineUserId: lineUserId,
          dueDate: item.dueDate,
          flowName: item.flowName,
          shopId: this.$session.getAll().data.shopId,
          tell: this.$session.getAll().data.contactTel
        }
        axios
          .post(this.DNS_IP + '/Booking/pushMsgCancelBook', dt)
          .then(async response => {})
      }
    },
    async updateLimitBookingCancel (item, dueDateOld, dueDateTimeOld) {
      let result = []
      let dt = {
        flowId: item.flowId,
        dateSelect: dueDateOld,
        timeSelect: dueDateTimeOld,
        shopId: item.shopId,
        userId: item.userId,
        bookingEmpFlow: this.bookingEmpFlow,
        masBranchID: item.masBranchID,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios.post(this.DNS_IP + '/Booking/updateLimitBookingCancelEmp', dt).then(async response => {
        result = response.data
      })
      return result
    },
    async updateRemark (item) {
      var dt = {}
      if (this.radiosRemark === 'ซ่อมปกติ') {
        dt = {
          remark: item.remark,
          fastTrack: 'False',
          extraJob: 'False',
          LAST_USER: this.$session.getAll().data.userName,
          empSelect: this.empSelect
        }
      } else if (this.radiosRemark === 'ExtraJob') {
        dt = {
          remark: item.remark,
          fastTrack: 'False',
          extraJob: 'True',
          LAST_USER: this.$session.getAll().data.userName,
          empSelect: this.empSelect
        }
      } else if (this.radiosRemark === 'FastTrack') {
        dt = {
          remark: item.remark,
          fastTrack: 'True',
          extraJob: 'False',
          LAST_USER: this.$session.getAll().data.userName,
          empSelect: this.empSelect
        }
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + item.bookNo,
          dt
        )
        .then(async response => {})
    },
    async getEmpSelect (item) {
      this.empSelectStep = []
      await axios
        .get(this.DNS_IP + '/empSelect/get?shopId=' + item.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            console.log('rsEmpSelect', rs)
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.masBranchID = d.masBranchID || ''
              var s = {}
              if (this.$session.getAll().data.masBranchID === '' || this.$session.getAll().data.masBranchID === null) {
                console.log('IF')
                s.text = d.empFirst_NameTH
                s.value = d.empId
                this.empSelectStep.push(s)
              } else {
                if (this.$session.getAll().data.masBranchID === d.masBranchID || d.masBranchID === '') {
                  console.log('ELSE')
                  s.text = d.empFirst_NameTH
                  s.value = d.empId
                  this.empSelectStep.push(s)
                }
              }
            }
            this.empSelect = this.empSelectStep[0].value
          }
        })
    },
    async setDataChang (item) {
      this.flowIDLimit = item.flowId
      this.SetallowedDatesChange(this.bookingEmpFlow)
      this.dataChange = item
      this.formChange.date = item.dueDateDay
      console.log('item', item)
      await this.checkCustomerTimeSlotStart(this.flowSelect)
      await this.setLimitBooking(item.dueDateDay)
      this.dueDateOld = item.dueDateDay
      this.dueDateTimeOld = item.timeDuetext
      // this.formChange.date = this.momenDate_1(item.dueDate)
      // await this.setLimitBooking(this.momenDate_1(item.dueDate))
      // this.dueDateOld = this.momenDate_1(item.dueDate)
      // this.dueDateTimeOld = this.momenTime(item.dueDate)
      this.dialogChange = true
      console.log('True')
      this.bookingEmpFlowOld = this.bookingEmpFlow
      if (this.timeavailable.filter(el => { return el.value === item.timeDuetext }).length > 0) {
        this.formChange.time = item.timeDuetext
      // if (this.timeavailable.filter(el => { return el.value === this.momenTime(item.dueDate) }).length > 0) {
      //   this.formChange.time = this.momenTime(item.dueDate)
      } else {
        this.formChange.time = ''
      }
      console.log('this.formChange', this.formChange)
    },
    async changeChkConfirmOnsite (item) {
      // console.log('timeavailable', this.timeavailable)
      // console.log('this.formChange.time', this.formChange.time.value)
      console.log('timeavailable', this.timeavailable.filter(el => { return el.value === this.formChange.time.value }))
      this.dataReady = false
      if (this.timeavailable.filter(el => { return el.value === this.formChange.time.value }).length > 0) {
        let checkCountTime = await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + item.bookNo)
        let chkStatLimit = this.dataEmpAll.filter(el => { return el.value === this.bookingEmpFlow })
        console.log('chkStatLimit', chkStatLimit)
        console.log('this.DataFlowName', chkStatLimit)
        if (chkStatLimit.length > 0) {
          if (chkStatLimit[0].limitBookingCheck === 'True') {
            let limitBookingCounts = 0
            let chkStatus = await this.updateLimitBookingChange(item, this.dueDateOld, this.dueDateTimeOld, this.formChange.date, this.formChange.time.value || this.formChange.time, limitBookingCounts, this.bookingEmpFlowOld, this.flowSelect, item.masBranchID)
            console.log('chkStatus', chkStatus)
            if (chkStatus.status) {
              this.onchangeChkConfirmSubmitOnsite(item, checkCountTime)
            } else {
              this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
              this.dataReady = true
              this.dataChangeReady = true
            }
          } else {
            this.onchangeChkConfirmSubmitOnsite(item, checkCountTime)
          }
        } else {
          this.onchangeChkConfirmSubmitOnsite(item, checkCountTime)
        }
      } else {
        this.dataReady = true
        this.$swal('ผิดพลาด', 'กรุณาเลือกเวลา', 'error')
      }
    },
    async changeChkConfirm (item) {
      // console.log('timeavailable', this.timeavailable)
      // console.log('this.formChange.time', this.formChange.time.value)
      console.log('timeavailable', this.timeavailable.filter(el => { return el.value === this.formChange.time.value }))
      this.dataReady = false
      if (this.timeavailable.filter(el => { return el.value === this.formChange.time.value }).length > 0) {
        let checkCountTime = await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + item.bookNo)
        let chkStatLimit = this.dataEmpAll.filter(el => { return el.value === this.bookingEmpFlow })
        console.log('chkStatLimit', chkStatLimit)
        console.log('this.DataFlowName', chkStatLimit)
        if (chkStatLimit.length > 0) {
          if (chkStatLimit[0].limitBookingCheck === 'True') {
            let limitBookingCounts = 0
            let chkStatus = await this.updateLimitBookingChange(item, this.dueDateOld, this.dueDateTimeOld, this.formChange.date, this.formChange.time.value || this.formChange.time, limitBookingCounts, this.bookingEmpFlowOld, this.flowSelect, item.masBranchID)
            console.log('chkStatus', chkStatus)
            if (chkStatus.status) {
              this.onchangeChkConfirmSubmit(item, checkCountTime)
            } else {
              this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
              this.dataReady = true
              this.dataChangeReady = true
            }
          } else {
            this.onchangeChkConfirmSubmit(item, checkCountTime)
          }
        } else {
          this.onchangeChkConfirmSubmit(item, checkCountTime)
        }
      } else {
        this.dataReady = true
        this.$swal('ผิดพลาด', 'กรุณาเลือกเวลา', 'error')
      }
    },
    async changeChk (item) {
      // console.log('timeavailable', this.timeavailable)
      // console.log('this.formChange.time', this.formChange.time.value)
      // console.log('timeavailable', this.timeavailable.filter(el => { return el.value === this.formChange.time.value }))
      this.dataReady = false
      if (this.timeavailable.filter(el => { return el.value === this.formChange.time.value }).length > 0) {
        let checkCountTime = await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + item.bookNo)
        let chkStatLimit = this.dataEmpAll.filter(el => { return el.value === this.bookingEmpFlow })
        console.log('chkStatLimit', chkStatLimit)
        console.log('this.DataFlowName', chkStatLimit)
        if (chkStatLimit.length > 0) {
          if (chkStatLimit[0].limitBookingCheck === 'True') {
            let limitBookingCounts = 0
            let chkStatus = await this.updateLimitBookingChange(item, this.dueDateOld, this.dueDateTimeOld, this.formChange.date, this.formChange.time.value || this.formChange.time, limitBookingCounts, this.bookingEmpFlowOld, this.flowSelect, item.masBranchID)
            console.log('chkStatus', chkStatus)
            if (chkStatus.status) {
              this.onChangeChkSubmit(item, checkCountTime)
            } else {
              this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
              this.dataReady = true
              this.dataChangeReady = true
            }
          } else {
            this.onChangeChkSubmit(item, checkCountTime)
          }
        } else {
          this.onChangeChkSubmit(item, checkCountTime)
        }
      } else {
        this.dataReady = true
        this.$swal('ผิดพลาด', 'กรุณาเลือกเวลา', 'error')
      }
    },
    async onchangeChkConfirmSubmitOnsite (item, checkCountTime) {
      // console.log('item', item)
      // console.log('formChange', this.formChange)
      // this.$swal({
      //   title: 'ต้องการ เปลี่ยนเวลานัดหมาย ใช่หรือไม่?',
      //   type: 'question',
      //   showCancelButton: true,
      //   confirmButtonColor: '#3085d6',
      //   cancelButtonColor: '#b3b1ab',
      //   confirmButtonText: 'ใช่',
      //   cancelButtonText: 'ไม่'
      // }).then(async result => {
      let countTime = 0
      if (checkCountTime) {
        countTime = checkCountTime.data[0].countChangeTime || 0
      }
      console.log('this.flowSelect', this.flowSelect)
      var dtChange = {
        flowId: this.flowSelect,
        bookingEmpFlow: this.bookingEmpFlow,
        countChangeTime: countTime,
        changeDueDate: 'change',
        dueDate: this.formChange.date + ' ' + this.formChange.time.value,
        timeText: this.formChange.time.text,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/BookingData/edit/" + item.bookNo,
          dtChange
        )
        .then(async response => {
          var dt = {
            bookNo: item.bookNo,
            contactDate: this.format_date(new Date()),
            status: 'change',
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.$session.getAll().data.userName,
            LAST_USER: this.$session.getAll().data.userName,
            changDate: this.formChange.date + ' ' + this.formChange.time.value
          }
          await axios
            .post(this.DNS_IP + '/booking_transaction/add', dt)
            .then(async response => {
              // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              // this.dialogChange = false
              this.fromAddTimeCus = ''
              this.customerTimeSlot = 'False'
              console.log('addDataGlobal', response)
              this.dataReady = true
              if (item.statusBt === 'confirm') {
                if (item.userId !== 'user-skip') {
                  await this.chkBookingNo()
                  this.pushMsgConfirmChangeTime(item.bookNo)
                  // this.getTimesChange('update')
                } else {
                  await this.chkBookingNo()
                  // this.getTimesChange('update')
                }
              } else {
                await this.chkBookingNo()
                // this.getTimesChange('update')
              }
              await this.confirmChkOnsiteAndChang(item)
              this.dialogChange = false
            })
            .catch(error => {
              this.dataReady = true
              console.log('error function addData : ', error)
            })
        })
      // })
    },
    async onchangeChkConfirmSubmit (item, checkCountTime) {
      // console.log('item', item)
      // console.log('formChange', this.formChange)
      // this.$swal({
      //   title: 'ต้องการ เปลี่ยนเวลานัดหมาย ใช่หรือไม่?',
      //   type: 'question',
      //   showCancelButton: true,
      //   confirmButtonColor: '#3085d6',
      //   cancelButtonColor: '#b3b1ab',
      //   confirmButtonText: 'ใช่',
      //   cancelButtonText: 'ไม่'
      // }).then(async result => {
      let countTime = 0
      if (checkCountTime) {
        countTime = checkCountTime.data[0].countChangeTime || 0
      }
      console.log('this.flowSelect', this.flowSelect)
      var dtChange = {
        flowId: this.flowSelect,
        bookingEmpFlow: this.bookingEmpFlow,
        countChangeTime: countTime,
        changeDueDate: 'change',
        dueDate: this.formChange.date + ' ' + this.formChange.time.value,
        timeText: this.formChange.time.text,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/BookingData/edit/" + item.bookNo,
          dtChange
        )
        .then(async response => {
          var dt = {
            bookNo: item.bookNo,
            contactDate: this.format_date(new Date()),
            status: 'change',
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.$session.getAll().data.userName,
            LAST_USER: this.$session.getAll().data.userName,
            changDate: this.formChange.date + ' ' + this.formChange.time.value
          }
          await axios
            .post(this.DNS_IP + '/booking_transaction/add', dt)
            .then(async response => {
              // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              // this.dialogChange = false
              console.log('statusGoogleCalendar', this.statusGoogleCalendar)
              if (this.statusGoogleCalendar === 'True') {
                await this.connectGoogleCalendar('Add', dt.bookNo)
              }
              this.fromAddTimeCus = ''
              this.customerTimeSlot = 'False'
              console.log('addDataGlobal', response)
              this.dataReady = true
              if (item.statusBt === 'confirm') {
                if (item.userId !== 'user-skip') {
                  await this.chkBookingNo()
                  this.pushMsgConfirmChangeTime(item.bookNo)
                  // this.getTimesChange('update')
                } else {
                  await this.chkBookingNo()
                  // this.getTimesChange('update')
                }
              } else {
                await this.chkBookingNo()
                // this.getTimesChange('update')
              }
              await this.onConfirmChang(item)
              this.dialogChange = false
            })
            .catch(error => {
              this.dataReady = true
              console.log('error function addData : ', error)
            })
        })
      // })
    },
    async onConfirmChang (item) {
      this.dataReady = false
      if (this.dataItem[0].checkOnsite === 'True') {
        this.dataReady = true
      } else {
        if (this.checkStatusBooking === 'cancel') {
          if (this.timeavailable.filter(el => { return el.value === this.formChange.time.value }).length > 0) {
            let chkStatLimit = this.dataEmpAll.filter(el => { return el.value === this.bookingEmpFlow })
            if (chkStatLimit.length > 0) {
              if (chkStatLimit[0].limitBookingCheck === 'True') {
                this.insertLimitBooking(item, this.formChange.date, this.formChange.time.value || this.formChange.time, this.bookingEmpFlow)
              }
            }
            var dtChange = {
              bookingEmpFlow: this.bookingEmpFlow,
              flowId: this.flowSelect,
              // countChangeTime: countTime,
              changeDueDate: 'change',
              dueDate: this.formChange.date + ' ' + this.formChange.time.value,
              timeText: this.formChange.time.text,
              LAST_USER: this.$session.getAll().data.userName
            }
            await axios
              .post(
                // eslint-disable-next-line quotes
                this.DNS_IP + "/BookingData/edit/" + item.bookNo,
                dtChange
              )
              .then(async response => {
                // let dtint = '0'
                // if (this.dataFlow.filter(el => { return el.value === item.flowId }).length > 0) {
                //   let dts = JSON.parse(this.dataFlow.filter(el => { return el.value === item.flowId })[0].allData.setTime) || []
                //   dtint = parseInt(dts.filter(el => el.value === item.timeDuetext)[0].limitBooking || '0')
                // } else {
                //   dtint = '0'
                // }
                let dt = {
                  // pageStatus: this.dataItem[0].statusBt,
                  // limitBookingCount: dtint,
                  bookNo: item.bookNo,
                  contactDate: this.format_date(new Date()),
                  status: 'confirm',
                  statusUse: 'use',
                  shopId: this.$session.getAll().data.shopId,
                  CREATE_USER: this.$session.getAll().data.userName,
                  LAST_USER: this.$session.getAll().data.userName
                }
                axios
                  .post(this.DNS_IP + '/booking_transaction/add', dt)
                  .then(async response => {
                    await this.updateRemark(item)
                    this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                    let DTitem = item.userId
                    console.log('DTITEM', DTitem)
                    this.dialogConfirm = false
                    this.dataReady = true
                    if (DTitem !== 'user-skip') {
                      await this.chkBookingNo()
                      // this.getTimesChange('update')
                      this.pushMsgConfirm(item.bookNo)
                    } else {
                      await this.chkBookingNo()
                      // this.getTimesChange('update')
                    }
                    this.dialogConfirm = false
                    console.log('addDataGlobal', response)
                  })
                  .catch(error => {
                    console.log('error function addData : ', error)
                    this.dataReady = true
                  })
              })
          } else {
            this.$swal('ผิดพลาด', 'กรุณาเลือกเวลา', 'error')
            this.dataReady = true
          }
        } else {
          // let dtint = '0'
          // if (this.dataFlow.filter(el => { return el.value === item.flowId }).length > 0) {
          //   let dts = JSON.parse(this.dataFlow.filter(el => { return el.value === item.flowId })[0].allData.setTime) || []
          //   dtint = parseInt(dts.filter(el => el.value === item.timeDuetext)[0].limitBooking || '0')
          // } else {
          //   dtint = '0'
          // }
          let dt = {
            pageStatus: this.dataItem[0].statusBt,
            // limitBookingCount: dtint,
            bookNo: item.bookNo,
            contactDate: this.format_date(new Date()),
            status: 'confirm',
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.$session.getAll().data.userName,
            LAST_USER: this.$session.getAll().data.userName
          }
          axios
            .post(this.DNS_IP + '/booking_transaction/add', dt)
            .then(async response => {
              await this.updateRemark(item)
              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              let DTitem = item.userId
              console.log('DTITEM', DTitem)
              this.dialogConfirm = false
              this.dataReady = true
              if (DTitem !== 'user-skip') {
                await this.chkBookingNo()
                // this.getTimesChange('update')
                this.pushMsgConfirm(item.bookNo)
              } else {
                await this.chkBookingNo()
                // this.getTimesChange('update')
              }
              this.dialogConfirm = false
              console.log('addDataGlobal', response)
            })
            .catch(error => {
              console.log('error function addData : ', error)
              this.dataReady = true
            })
        }
      }
      // }
    },
    async onChangeChkSubmit (item, checkCountTime) {
      // console.log('item', item)
      // console.log('formChange', this.formChange)
      // this.$swal({
      //   title: 'ต้องการ เปลี่ยนเวลานัดหมาย ใช่หรือไม่?',
      //   type: 'question',
      //   showCancelButton: true,
      //   confirmButtonColor: '#3085d6',
      //   cancelButtonColor: '#b3b1ab',
      //   confirmButtonText: 'ใช่',
      //   cancelButtonText: 'ไม่'
      // }).then(async result => {
      let countTime = 0
      if (checkCountTime) {
        countTime = checkCountTime.data[0].countChangeTime || 0
      }
      console.log('this.flowSelect', this.flowSelect)
      var dtChange = {
        flowId: this.flowSelect,
        bookingEmpFlow: this.bookingEmpFlow,
        countChangeTime: countTime,
        changeDueDate: 'change',
        dueDate: this.formChange.date + ' ' + this.formChange.time.value,
        timeText: this.formChange.time.text,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/BookingData/edit/" + item.bookNo,
          dtChange
        )
        .then(async response => {
          var dt = {
            bookNo: item.bookNo,
            contactDate: this.format_date(new Date()),
            status: 'change',
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.$session.getAll().data.userName,
            LAST_USER: this.$session.getAll().data.userName,
            changDate: this.formChange.date + ' ' + this.formChange.time.value
          }
          await axios
            .post(this.DNS_IP + '/booking_transaction/add', dt)
            .then(async response => {
              console.log('statusGoogleCalendar', this.statusGoogleCalendar)
              if (this.statusGoogleCalendar === 'True') {
                console.log('TEST----')
                await this.connectGoogleCalendar('Edit', dt.bookNo)
              }
              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              this.dialogChange = false
              this.fromAddTimeCus = ''
              this.customerTimeSlot = 'False'
              console.log('addDataGlobal', response)
              this.dataReady = true
              if (item.statusBt === 'confirm') {
                if (item.userId !== 'user-skip') {
                  await this.chkBookingNo()
                  this.pushMsgConfirmChangeTime(item.bookNo)
                  // this.getTimesChange('update')
                } else {
                  await this.chkBookingNo()
                  // this.getTimesChange('update')
                }
              } else {
                await this.chkBookingNo()
                // this.getTimesChange('update')
              }
            })
            .catch(error => {
              this.dataReady = true
              console.log('error function addData : ', error)
            })
        })
      // })
    },
    async updateLimitBookingChange (item, dueDateOld, dueDateTimeOld, dueDateNew, dueDateTimeNew, limitBookingCount, bookingEmpFlowOld, flowIdNew, masBranchIDNew) {
      let result = []
      let timeSlotCustomer = ''
      if (this.customerTimeSlot === 'True') {
        timeSlotCustomer = this.fromAddTimeCus
      } else {
        console.log('TESTSTTETETSETSET', this.dataFlow.filter((v) => v.value === flowIdNew)[0].allData)
        timeSlotCustomer = this.dataFlow.filter((v) => v.value === flowIdNew)[0].allData.timeSlot
      }
      let dt = {
        dueDateOld: dueDateOld,
        dueDateTimeOld: dueDateTimeOld,
        dueDateNew: dueDateNew,
        dueDateTimeNew: dueDateTimeNew,
        flowId: item.flowId,
        flowIdNew: flowIdNew,
        masBranchID: item.masBranchID,
        masBranchIDNew: masBranchIDNew,
        dateSelect: dueDateNew,
        timeSelect: dueDateTimeNew,
        timeSlotCustomer: timeSlotCustomer,
        shopId: item.shopId,
        userId: item.userId,
        limitBookingCount: limitBookingCount,
        bookingEmpFlow: this.bookingEmpFlow,
        bookingEmpFlowOld: bookingEmpFlowOld,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios.post(this.DNS_IP + '/Booking/updateLimitBookingChangeTimeEmp', dt).then(async response => {
        result = response.data
      })
      return result
    },
    async getBookingList (dt) {
      // Clear Data ทุกครั้ง
      this.dataReady = false
      this.dataItemBooking = []
      // Clear ช่องค้นหา
      this.searchAll2 = ''
      var dataItems = []
      this.dateStart = dt.dueDate.substring(0, 7)
      await this.getBookingDataList(dt)
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.$route.query.shopId +
            '&masBranchID=' +
            dt.masBranchID +
            '&dueDate=' +
            dt.dueDate.substring(0, 7)
        )
        .then(async response => {
          console.log('getBookingList', response.data)
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let d = response.data[i]
              let s = {}
              s.bookNo = d.bookNo
              s.flowId = d.flowId
              s.flowName = d.flowName
              s.dueDate = d.dueDate
              s.dueDateDay = d.dueDateDay
              s.userId = d.userId
              s.chkConfirm = false
              s.chkCancel = false
              s.remarkConfirm1 = (d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True')
              s.remarkConfirm2 = (d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True')
              s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
              s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
              s.jobNo = d.jobNo
              s.timeDueHtext = d.timeDueH + ':00'
              s.timeDuetext = d.timeDue
              if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
                s.chkConfirm = true
                s.chkCancel = false
              }
              if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
                s.chkConfirm = false
                s.chkCancel = true
              }
              s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
              s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
              s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
              s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
              s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
              s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
              s.statusBt = d.statusBt || 'wait'
              dataItems.push(s)
            }
          }
          if (dataItems.length === 0 || dataItems.status === false) {
            this.dataItemBooking = []
            this.BookingDataItemEdit = []
            let itemIncustomField = []
            await axios
              .get(
                this.DNS_IP + '/BookingField/get?shopId=' + this.$route.query.shopId
              )
              .then(async response1 => {
                let rs2 = response1.data
                if (rs2.length > 0) {
                  let bookingData = []
                  console.log('BookingField', rs2[0])
                  bookingData = JSON.parse(rs2[0].flowfieldName)
                  this.dataTypeJob1 = rs2[0].typeJob1
                  this.dataTypeJob2 = rs2[0].typeJob2
                  this.dataTypeJob3 = rs2[0].typeJob3
                  for (let i = 0; i < bookingData.length; i++) {
                    let d = bookingData[i]
                    itemIncustomField.push(d.fieldId)
                  }
                  await axios
                    .get(this.DNS_IP + '/customField/fieldId?fieldId=' + itemIncustomField)
                    .then(async responses => {
                      let rs1 = responses.data
                      for (var i = 0; i < rs1.length; i++) {
                        var d = rs1[i]
                        var s = {}
                        var dataBD = this.BookingDataItem.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
                        console.log('dataBD', dataBD)
                        if (dataBD.length > 0) {
                          s.flowName = dataBD[0].flowName
                          s.masBranchName = dataBD[0].masBranchName
                          s.bookingFieldId = rs2[0].bookingFieldId
                          s.conditionField = d.conditionField
                          s.fieldId = d.fieldId
                          s.fieldType = d.fieldType
                          s.fieldValue = dataBD[0].fieldValue
                          s.fieldName = d.fieldName
                          s.conditionField = d.conditionField
                          s.conditionValue = d.conditionValue
                          s.requiredField = d.requiredField
                          s.optionField = d.optionField
                          this.BookingDataItemEdit.push(s)
                        }
                      }
                    })
                }
              })
            this.dataReady = true
            // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          } else {
            this.dataItemBooking = dataItems
            this.BookingDataItemEdit = []
            let itemIncustomField = []
            await axios
              .get(
                this.DNS_IP + '/BookingField/get?shopId=' + this.$route.query.shopId
              )
              .then(async response1 => {
                let rs2 = response1.data
                if (rs2.length > 0) {
                  let bookingData = []
                  console.log('BookingField', rs2[0])
                  bookingData = JSON.parse(rs2[0].flowfieldName)
                  this.dataTypeJob1 = rs2[0].typeJob1
                  this.dataTypeJob2 = rs2[0].typeJob2
                  this.dataTypeJob3 = rs2[0].typeJob3
                  for (let i = 0; i < bookingData.length; i++) {
                    let d = bookingData[i]
                    itemIncustomField.push(d.fieldId)
                  }
                  await axios
                    .get(this.DNS_IP + '/customField/fieldId?fieldId=' + itemIncustomField)
                    .then(async responses => {
                      let rs1 = responses.data
                      for (var i = 0; i < rs1.length; i++) {
                        var d = rs1[i]
                        var s = {}
                        var dataBD = this.BookingDataItem.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
                        console.log('dataBD', dataBD)
                        if (dataBD.length > 0) {
                          s.flowName = dataBD[0].flowName
                          s.masBranchName = dataBD[0].masBranchName
                          s.bookingFieldId = rs2[0].bookingFieldId
                          s.conditionField = d.conditionField
                          s.fieldId = d.fieldId
                          s.fieldType = d.fieldType
                          s.fieldValue = dataBD[0].fieldValue
                          s.fieldName = d.fieldName
                          s.conditionField = d.conditionField
                          s.conditionValue = d.conditionValue
                          s.requiredField = d.requiredField
                          s.optionField = d.optionField
                          this.BookingDataItemEdit.push(s)
                        }
                      }
                    })
                }
              })
            this.dataReady = true
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log(error)
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
        })
    },
    async getBookingDataList (dt) {
      this.BookingDataList = []
      let url = `${this.DNS_IP}/BookingData/get?shopId=${this.$route.query.shopId}&masBranchID=${dt.masBranchID}&dueDate=${dt.dueDate.substring(0, 7)}`
      await axios
        .get(url)
        .then(async response => {
          console.log('getBookingDataList', response)
          if (response.data.status !== false) {
            response.data.forEach((row) => {
              if (typeof (this.BookingDataList[row.bookNo]) === 'undefined') {
                this.BookingDataList[row.bookNo] = []
              }
              this.BookingDataList[row.bookNo].push(row)
            })
          }
        })
      console.log(this.BookingDataList)
    }
  }
}
</script>
<style scoped>
.centered {
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}
.lds-grid {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-grid div {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #173053;
  animation: lds-grid 1.2s linear infinite;
}
.lds-grid div:nth-child(1) {
  top: 8px;
  left: 8px;
  animation-delay: 0s;
}
.lds-grid div:nth-child(2) {
  top: 8px;
  left: 32px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(3) {
  top: 8px;
  left: 56px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(4) {
  top: 32px;
  left: 8px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(5) {
  top: 32px;
  left: 32px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(6) {
  top: 32px;
  left: 56px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(7) {
  top: 56px;
  left: 8px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(8) {
  top: 56px;
  left: 32px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(9) {
  top: 56px;
  left: 56px;
  animation-delay: -1.6s;
}
@keyframes lds-grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.theme--light.v-divider {
    border-color: rgba(243, 5, 25, 0.904) !important;
}
.InputData{
  margin: 0px !important;
  padding: 0px !important;
}
.slidein {
  max-width: 100%;
  padding: 2em 1em;
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  background: #fff;
  height: 100%;
  overflow: scroll;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease-in-out;
}
button {
  padding: .5em 1em;
  border-radius: 3em;
  font-size: 1.1em;
}
/* before the element is shown, start off the screen to the right */
.slide-enter, .slide-leave-active {
  right: -100%;
}

.close-btn {
  border: none;
  font-weight: bold;
  font-size: 2em;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5em;
}

/* General styles unrelated to slide in */
body {
  font-family: 'Mulish', sans-serif;
}

.toggle {
  margin: 1em;
}
.v-input--selection-controls {
    margin-top: 0px;
    padding-top: 0px;
}
</style>
