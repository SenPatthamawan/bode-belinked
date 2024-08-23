<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row class="no-gutters">
          <v-col cols="12" md="6" lg="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
          <v-col cols="12" md="6" lg="6" class="v-margit_button text-right">
            <v-btn-toggle>
              <!-- <v-btn
                color="warning"
                style="z-index:8;margin-right: 5px;"
                id="v-step-0"
                depressed
                @click="getDataDefault()"
              >
                <v-icon left>mdi-refresh-circle</v-icon>
                Refresh
              </v-btn> -->
              <v-btn
                :loading="loadingRefresh"
                :disabled="loadingRefresh"
                color="warning"
                style="z-index:8;margin-right: 5px;"
                @click="getDataDefault(), searchOther = '', showColorSearch = false, statusSearch = 'no'"
              >
                <v-icon left>mdi-refresh-circle</v-icon>
                Refresh
                <template v-if="loadingRefresh">
                  <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-btn
                color="primary"
                style="z-index:8;margin-right: 5px;"
                id="v-step-0"
                depressed
                @click="$router.push('./Qrcodereader')"
              >
                <v-icon left>mdi-text-box-plus</v-icon>
                Qr Code
              </v-btn>
              <v-btn
                color="primary"
                style="z-index:8;margin-right: 5px;"
                id="v-step-0"
                depressed
                @click="addDataSet()"
              >
                <v-icon left>mdi-text-box-plus</v-icon>
                เพิ่ม
              </v-btn>
              <!-- <v-btn
                color="teal"
                style="z-index:8;"
                id="v-step-0"
                dark
                depressed
                @click="(dialogExport = true), validate('EXPORT')"
              >
                <v-icon left>mdi-download</v-icon>
                Export Data
              </v-btn> -->
            </v-btn-toggle>
            <!-- </v-overlay> -->
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="8" lg="8" class="text-left">
            <template  v-if="changeBackgroundColor">
            <v-row>
              <v-col cols="6" class="text-center pb-0">
                <v-alert
                  :color="'orange ' + ((getSelectText === 'wait') ? '' : 'lighten-4')"
                  :dark="((getSelectText === 'wait') ? true : false)"
                  dense
                  icon="mdi-phone-ring"
                  prominent
                  @click="getSelect('wait',countWaiting)"
                >
                  <div>
                    <strong>รอโทรยืนยัน</strong>
                  </div>
                  <div>จำนวน : {{countWaiting}}</div>
                </v-alert>
              </v-col>
              <v-col cols="6" class="text-center pb-0">
                <v-alert
                  :color="'green ' + ((getSelectText === 'confirm') ? '' : 'lighten-4')"
                  :dark="((getSelectText === 'confirm') ? true : false)"
                  dense
                  icon="mdi-phone-check"
                  prominent
                  @click="getSelect('confirm',countConfirm)"
                >
                  <div>
                    <strong>ยืนยันแล้ว</strong>
                  </div>
                  <div>จำนวน : {{countConfirm}}</div>
                </v-alert>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="text-center pb-0">
                <v-alert
                  :color="'red ' + ((getSelectText === 'cancel') ? '' : 'lighten-4')"
                  :dark="((getSelectText === 'cancel') ? true : false)"
                  dense
                  icon="mdi-phone-cancel"
                  prominent
                  @click="getSelect('cancel',countCancel)"
                >
                  <div>
                    <strong>ยกเลิก</strong>
                  </div>
                  <div>จำนวน : {{countCancel}}</div>
                </v-alert>
              </v-col>
              <v-col cols="6" class="text-center pb-0">
                <v-alert
                  :color="'blue ' + ((getSelectText === 'confirmJob') ? '' : 'lighten-4')"
                  :dark="((getSelectText === 'confirmJob') ? true : false)"
                  dense
                  icon="mdi-car-cog"
                  prominent
                  @click="getSelect('confirmJob',countJob)"
                >
                   <div>
                    <strong>รับรถแล้ว</strong>
                  </div>
                  <div>จำนวน : {{countJob}}</div>
                </v-alert>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center pb-0  pt-0">
                <v-btn
                  color="blue-grey"
                  dense
                  dark
                  rounded
                  block
                  class="ma-2 white--text"
                  @click="getSelect('all',countAll)"
                >
                  ทั้งหมด จำนวน : {{countAll}}
                  <v-icon
                    right
                    dark
                  >
                    mdi-database-arrow-down
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            </template>
          </v-col>
          <v-col cols="12" md="4" lg="4" class="pl-5 v-margit_button">
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
                  v-model="dateStart"
                  label="เลือก เดือน/ปี"
                  prepend-icon="mdi-calendar"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                @input="menuStart = false,dataReady = false,getBookingList()"
                v-model="dateStart"
                type="month"
                no-title
                scrollable
              >
              </v-date-picker>
            </v-menu>
            <v-select
              v-model="masBranchID"
              :items="branch"
              label="สาขา"
              outlined
              dense
              required
              @change="dataReady = false,getBookingList()"
            ></v-select>
            <v-btn
              elevation="4"
              block
              dark
              rounded
              :color="changeBackgroundColor ? 'red' : 'green'"
              @click="changeBackgroundColor = !changeBackgroundColor"
            >
              {{changeBackgroundColor ? 'ซ่อน' : 'แสดง'}}
            </v-btn>
            <hr>
            <v-text-field
              dense
              v-model="searchOther"
              append-icon="mdi-text-box-search"
              label="ค้นหาทั้งหมด"
              :color="showColorSearch ? 'green' : 'info'"
              @click:append="searchAny(), showColorSearch = true, statusSearch = 'yes', dataReady = false"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <!-- EXPORT -->
          <v-dialog v-model="dialogExport" persistent max-width="70%">
            <v-card class="text-center">
              <v-form ref="form_export" v-model="validExport" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-col class="text-right pa-0">
                      <v-btn
                        small
                        color="#E0E0E0"
                        @click="(dialogExport = false)"
                      >
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                    <v-row justify="center">
                      <v-col
                        cols="5"
                        class="text-center"
                        style="margin: auto 0;"
                      >
                        <v-col class="text-center">
                          <v-img
                            class="v-margit_img_reward"
                            :src="require('@/assets/ExportExcel.svg')"
                            max-width="470.37"
                            max-height="247"
                          ></v-img>
                        </v-col>
                      </v-col>

                      <v-col cols="6" class="v-margit_text_add mt-0 pa-0">
                        <v-col class="text-center pa-3 ml-2">
                          <v-img
                            class="v_text_add"
                            :src="require('@/assets/Grouptitle.svg')"
                          ></v-img>
                        </v-col>
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="6">
                               <p>เลือกสาขา</p>
                              <v-select
                                v-model="masBranchIDExport"
                                :items="branch"
                                label=""
                                outlined
                                :rules="[rules.required]"
                              ></v-select>
                            </v-col>
                            <v-col cols="6">
                              <p>เลือกวันที่</p>
                              <date-range-picker
                                opens="left"
                                :append-to-body='appendBody'
                                ref="picker"
                                :locale-data="localeData"
                                v-model="dateRange"
                                :rules="[rules.required]"
                                @update="updateValuesExport()"
                                >
                                  <template #ranges="ranges">
                                    <div class="ranges">
                                      <ul>
                                        <li v-for="(range, name) in ranges.ranges" :key="name" @click="ranges.clickRange(range)">
                                          <b v-if="name === 'Today'">วันนี้</b>
                                          <b v-if="name === 'Yesterday'">เมื่อวาน</b>
                                          <b v-if="name === 'This month'">เดือนนี้</b>
                                          <b v-if="name === 'This year'">ปีนี้ทั้งปี</b>
                                          <b v-if="name === 'Last month'">เดือนที่แล้ว</b>
                                        </li>
                                        <!-- <li data-range-key="Today" tabindex="0" class="active" @click="ranges.clickRange('Today')">วันนี้ </li>
                                        <li data-range-key="Yesterday" tabindex="0" class="" @click="ranges.clickRange('Yesterday')">เมื่อวาน </li>
                                        <li data-range-key="This month" tabindex="0" class="" @click="ranges.clickRange('This month')">เดือนนี้ </li>
                                        <li data-range-key="This year" tabindex="0" class="" @click="ranges.clickRange('This year')">ปีนี้ทั้งปี </li>
                                        <li data-range-key="Last month" tabindex="0" class="" @click="ranges.clickRange('Last month')">เดือนที่แล้ว </li> -->
                                      </ul>
                                    </div>
                                  </template>
                                </date-range-picker>
                            </v-col>
                            </v-row>
                        </v-col>
                      </v-col>
                    </v-row>
                    <div class="text-center" v-if="export_data.length > 0">
                      <v-btn color="yellow-light" @click="dialogExport = false">
                        <v-icon left>mdi-download</v-icon>
                        <download-excel
                          class="btn btn-default"
                          :data="export_data"
                          :fields="export_fields"
                          :type="exportType"
                          :worksheet="exportWorksheet"
                          :name="exportFileName"
                        >
                          Export Data
                        </download-excel>
                      </v-btn>
                    </div>
                  </v-container>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- end add -->
          <!-- ADD -->
          <v-dialog v-model="dialogAdd" hide-overlay fullscreen>
          <!-- <v-dialog v-model="dialogAdd" persistent max-width="70%"> -->
            <v-card class="text-center">
              <v-form ref="form_add" v-model="validAdd" lazy-validation>
                <v-card-text>
                    <v-col class="text-right pa-0">
                      <v-btn
                        small
                        color="#E0E0E0"
                        @click="(dialogAdd = false), clearDataAdd()"
                      >
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                    <v-row justify="center">
                      <v-col
                        cols="9"
                      >
                      <!-- <v-col
                        cols="8"
                        class="text-center d-none d-sm-flex"
                        style="margin: auto 0;"
                      > -->
                        <v-col class="text-center">
                          <CalendarBooking ref="CalendarBooking"></CalendarBooking>
                          <!-- <v-img
                            class="v-margit_img_reward"
                            :src="require('@/assets/AddBookingList.svg')"
                            max-width="470.37"
                            max-height="247"
                          ></v-img> -->
                        </v-col>
                      </v-col>

                      <v-col cols="3">
                      <!-- <v-col cols="12" sm="6" md="6" lg="6" class="v-margit_text_add mt-0 pa-0"> -->
                        <v-col class="text-center pa-3 ml-2">
                          <v-img
                            class="v_text_add"
                            :src="require('@/assets/Grouptitle.svg')"
                          ></v-img>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="formAdd.flowId"
                            :items="DataFlowName"
                            label="ประเภทบริการ"
                            outlined
                            dense
                            required
                            :rules="[rules.required]"
                          ></v-select>
                          <v-select
                            v-model="formAdd.masBranchID"
                            :items="branch"
                            label="สาขา"
                            outlined
                            dense
                            required
                            @change="checkTime()"
                            :rules="[rules.required]"
                          ></v-select>
                          <template v-if="fieldNameItem">
                            <div
                              v-for="(item, index) in fieldNameItem" :key="index"
                            >
                              <template
                                v-if="
                                  item.conditionField === '' ||
                                    item.conditionField === null
                                "
                              >
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'text'">
                                  <v-text-field
                                    v-model="item.fieldValue"
                                    :label="item.fieldName"
                                    outlined
                                    dense
                                    required
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'number'">
                                  <v-text-field
                                    v-model="item.fieldValue"
                                    :label="item.fieldName"
                                    outlined
                                    dense
                                    required
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                  ></v-text-field>
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
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'Radio'" style="padding:0px;">
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
                                      v-model="item.fieldValue"
                                      :label="item.fieldName"
                                      outlined
                                      required
                                      dense
                                      :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                    ></v-text-field>
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
                                        v-model="item.fieldValue"
                                        :label="item.fieldName"
                                        dense
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="InputData" v-if="item.fieldType == 'number'">
                                      <v-text-field
                                        v-model="item.fieldValue"
                                        :label="item.fieldName"
                                        dense
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
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
                            <v-col class="pb-0">
                              <v-menu
                                v-model="menuDate"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="date"
                                    label="วันที่"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    dense
                                    outlined
                                    v-on="on"
                                    required
                                    :rules="[rules.required]"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="date"
                                  @input="menuDate = false"
                                  :min="
                                    new Date(
                                      Date.now() -
                                        new Date().getTimezoneOffset() * 60000
                                    )
                                      .toISOString()
                                      .substr(0, 10)
                                  "
                                ></v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col class="pb-0" v-if="timeavailable.length > 0">
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
                          <!-- <v-row>
                            <v-col class="pt-0">
                              <v-radio-group v-model="formAdd.radiosRemark" row required :rules ="[rules.required]">
                                <v-radio value="ซ่อมปกติ">
                                  <template v-slot:label>
                                    <div class="mt-3"><strong class="primary--text">ซ่อมปกติ</strong></div>
                                  </template>
                                </v-radio>
                                <v-radio value="ExtraJob">
                                  <template v-slot:label>
                                    <div class="mt-3"><strong class="error--text">Extra Job</strong></div>
                                  </template>
                                </v-radio>
                                <v-radio value="FastTrack">
                                  <template v-slot:label>
                                    <div class="mt-3"><strong class="orange--text">Fast Track</strong></div>
                                  </template>
                                </v-radio>
                              </v-radio-group>
                            </v-col>
                          </v-row> -->
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
                            <v-col class="pt-0">
                            <v-textarea
                              v-model="remark"
                              outlined
                              label="หมายเหตุเพิ่มเติม"
                              auto-grow
                            ></v-textarea>
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

          <!-- delete -->
          <v-dialog v-model="dialogDelete" persistent max-width="70%">
            <v-card>
              <v-card-title>
                <span class="headline">ลบข้อมูลนี้</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="รหัส Booking No"
                        v-model="formUpdate.bookNo"
                        readonly
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="2"
                  x-large
                  dark
                  color="dark darken-1"
                  @click="dialogDelete = false"
                >
                  <v-icon left> mdi-cancel</v-icon>
                  ปิด
                </v-btn>
                <v-btn
                  elevation="2"
                  x-large
                  dark
                  color="red darken-1"
                  @click="deleteData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  ลบ
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end delete -->

          <!-- edit -->
          <v-dialog v-model="dialogEdit" persistent :max-width="dialogwidth">
            <v-card class="text-center">
              <v-card-title>มอบหมายงานให้พนักงาน Onsite</v-card-title>
              <!-- <v-col class="text-right pa-0">
                <v-btn
                  x-small
                  color="#E0E0E0"
                  @click="(dialogEdit = false)"
                >
                  <v-icon color="#173053">mdi-close</v-icon>
                </v-btn>
              </v-col> -->
              <v-card-text  v-if="dataEditJobReady">
                <v-container>
                  <v-col
                    v-for="(item, indexitem) in BookingDataItem"
                    :key="indexitem"
                    cols="12"
                    class="pa-0"
                  >
                    <v-text-field
                      :label="item.fieldName"
                      :value="item.fieldValue"
                      class="pa-0"
                      outlined
                      dense
                      readonly
                    ></v-text-field>
                    <!-- {{item.fieldName}} : {{item.fieldValue}} -->
                  </v-col>
                  <v-form ref="form_update" v-model="validUpdate" lazy-validation>
                  <div v-for="(p, index) in flowfieldNameitem" :key="index">
                    <div class="pa-0" v-if="p.conditionField === ''">
                      <div>
                        <div v-if="p.fieldType == 'text'">
                          <br />
                          <v-text-field
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                            outlined
                          ></v-text-field>
                        </div>
                        <div v-if="p.fieldType == 'number'">
                          <br />
                          <!-- <p>{{p.fieldName}}</p> -->
                          <v-text-field
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                            outlined
                          ></v-text-field>
                        </div>
                        <v-row>
                          <v-col
                            cols="12"
                            v-if="p.fieldType == 'Autocompletes'"
                            style="padding-top: 0px;padding-bottom: 0px;"
                          >
                          <br />
                            <v-autocomplete
                              v-model="p.fieldValue"
                              :items="JSON.parse(p.optionField)"
                              dense
                              filled
                              :label="p.fieldName"
                              :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                            ></v-autocomplete>
                          </v-col>
                          <v-col
                            cols="12"
                            v-if="p.fieldType == 'Selects'"
                            style="padding-top: 0px;padding-bottom: 0px;"
                          >
                          <br />
                            <div>
                              <v-select
                                v-model="p.fieldValue"
                                :items="JSON.parse(p.optionField)"
                                menu-props="auto"
                                :label="p.fieldName"
                                hide-details
                                outlined
                                dense
                                :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                              ></v-select>
                            </div>
                          </v-col>
                        </v-row>
                        <div v-if="p.fieldType == 'Radio'" style="padding:0px;">
                            <br />
                            <v-container fluid style="padding:0px;">
                              <v-radio-group
                                row
                                v-model="p.fieldValue"
                                style="margin:0px;"
                                :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                              >
                              <template v-slot:label> </template>
                              <div
                                v-for="radios in JSON.parse(
                                  p.optionField
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
                        </div>
                      </div>
                    </div>
                    <div  v-if="p.conditionField !== '' && flowfieldNameitem.filter(row => {return (row.fieldId === parseInt(p.conditionField));}).length > 0">
                      <div v-if="p.conditionValue === flowfieldNameitem.filter(row => {return (row.fieldId === parseInt(p.conditionField));})[0].fieldValue">
                        <div
                          cols="12"
                          v-if="p.fieldType == 'Autocompletes'"
                        >
                          <v-autocomplete
                            v-model="p.fieldValue"
                            :items="JSON.parse(p.optionField)"
                            dense
                            filled
                            :label="p.fieldName"
                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                          ></v-autocomplete>
                        </div>
                          <div v-if="p.fieldType == 'Selects'">
                            <v-select
                              v-model="p.fieldValue"
                              :items="JSON.parse(p.optionField)"
                              menu-props="auto"
                              :label="p.fieldName"
                              dense
                              hide-details
                              outlined
                              :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                            ></v-select>
                          </div>
                          <div v-if="p.fieldType === 'Radio'" style="padding:0px;">
                            <br />
                            <v-container fluid style="padding:0px;">
                              <v-radio-group
                                row
                                v-model="p.fieldValue"
                                style="margin:0px;"
                                :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                              >
                                <template v-slot:label> </template>
                                <div
                                  v-for="radios in JSON.parse(
                                    p.optionField
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
                          </div>
                      </div>
                    </div>
                    <div  v-if="p.conditionField === 'flow' ">
                      <div v-if="parseInt(p.conditionValue) === parseInt(formAdd.flowId) ">
                        <div v-if="p.fieldType == 'text'">
                          <br />
                          <v-text-field
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                            outlined
                          ></v-text-field>
                        </div>
                        <div v-if="p.fieldType == 'number'">
                          <br />
                          <v-text-field
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                            outlined
                          ></v-text-field>
                        </div>
                        <div
                          cols="12"
                          v-if="p.fieldType == 'Autocompletes'"
                        >
                          <v-autocomplete
                            v-model="p.fieldValue"
                            :items="JSON.parse(p.optionField)"
                            dense
                            filled
                            :label="p.fieldName"
                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                          ></v-autocomplete>
                        </div>
                          <div v-if="p.fieldType == 'Selects'">
                            <v-select
                              v-model="p.fieldValue"
                              :items="JSON.parse(p.optionField)"
                              menu-props="auto"
                              :label="p.fieldName"
                              dense
                              :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                              hide-details
                              outlined
                            ></v-select>
                          </div>
                          <div v-if="p.fieldType === 'Radio'" style="padding:0px;">
                            <br />
                            <v-container fluid style="padding:0px;">
                              <v-radio-group
                                row
                                v-model="p.fieldValue"
                                style="margin:0px;"
                                :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                              >
                                <template v-slot:label> </template>
                                <div
                                  v-for="radios in JSON.parse(
                                    p.optionField
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
                          </div>
                      </div>
                    </div>
                  </div>
                  <v-row>
                    <v-col cols="12" sm="6" md="6" lg="6" class="pb-0">
                      <v-text-field
                        readonly
                        v-model="dueDateText"
                        outlined
                        dense
                        label="วันที่นัดหมายลูกค้า"
                        prepend-inner-icon="mdi-calendar-multiple-check"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6">
                      <v-select
                        v-model="empSelectJob"
                        :items="empSelectStepAdd"
                        label="พนักงาน Onsite"
                        menu-props="auto"
                        outlined
                        required
                        :rules="[rules.required]"
                        dense
                        @change="checkEmpJob()"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <!-- <v-row v-for="(item, index) in dataEmpOnsite" :key="index">
                    <v-col cols="6" sm="6" md="6" lg="6" class="pb-0">
                      {{item.stepTitle}}
                    </v-col>
                  </v-row> -->
                  <v-row v-if="empSelectJob !== ''">
                    <v-col cols="12" class="pb-0 pt-0">
                      <v-sheet height="64">
                      <v-toolbar dense>
                        <v-btn
                          fab
                          text
                          small
                          color="grey darken-2"
                          @click="prev()"
                        >
                          <v-icon small>
                            mdi-chevron-left
                          </v-icon>
                        </v-btn>
                        <v-btn
                          fab
                          text
                          small
                          color="grey darken-2"
                          @click="next()"
                        >
                          <v-icon small>
                            mdi-chevron-right
                          </v-icon>
                        </v-btn>
                        <!-- <v-toolbar-title v-if="$refs.calendaronsite">{{
                          $refs.calendaronsite.title
                        }}</v-toolbar-title> -->
                        <v-toolbar-title>{{
                          monthNamesThai[parseInt(today.split("-")[1])] + ' ' + today.split("-")[0]
                        }}</v-toolbar-title>
                      </v-toolbar>
                    </v-sheet>
                    </v-col>
                  </v-row>
                  <v-row v-if="empSelectJob !== '' && checkEventInfo.length > 0">
                    <v-col cols="12" class="pb-0 pt-0">
                      <v-sheet>
                      <v-calendar
                        ref="calendaronsite"
                        :now="today"
                        v-model="today"
                        locale="th-TH"
                        color="primary"
                        type="month"
                      >
                        <!-- <template v-slot:day-label="{ day }">
                          <span style="font-size:26px !important;">{{day}}</span>
                        </template> -->
                        <template v-slot:day="{ date }">
                          <div v-if="eventInfo[date]">
                            <v-row>
                              <v-col class="text-center mb-1 mt-0">
                                <v-badge
                                  avatar
                                  bordered
                                  overlap
                                  color="orange darken-1"
                                  v-if="eventInfo[date].sortNo1 > 0"
                                  class="mr-1"
                                  style="cursor: pointer"
                                  @click.native="openCalendaList(date, 'sortNo1')"
                                >
                                  <template v-slot:badge>
                                    <v-avatar class="mb-1" color="orange darken-1">
                                      {{eventInfo[date].sortNo1}}
                                    </v-avatar>
                                  </template>

                                  <v-avatar size="40" color="orange darken-3">
                                    <v-icon dark>
                                        mdi-water-plus
                                    </v-icon>
                                  </v-avatar>
                                </v-badge>
                                <v-badge
                                  avatar
                                  bordered
                                  overlap
                                  color="blue darken-1"
                                  v-if="eventInfo[date].sortNo2 > 0"
                                  class="mr-1"
                                  style="cursor: pointer"
                                  @click.native="openCalendaList(date, 'sortNo2')"
                                >
                                  <template v-slot:badge>
                                    <v-avatar class="mb-1" color="blue darken-1">
                                      {{eventInfo[date].sortNo2}}
                                    </v-avatar>
                                  </template>

                                  <v-avatar size="40" color="blue darken-3">
                                    <v-icon dark>
                                        mdi-water-check
                                    </v-icon>
                                  </v-avatar>
                                </v-badge>
                              </v-col>
                            </v-row>
                          </div>
                        </template>
                      </v-calendar>
                      </v-sheet>
                    </v-col>
                  </v-row>
                  <v-row v-if="empSelectJob !== '' && checkEventInfo.length === 0">
                    <v-col cols="12" class="pb-0 pt-0">
                      <v-sheet>
                      <v-calendar
                        ref="calendaronsite"
                        :now="today"
                        v-model="today"
                        locale="th-TH"
                        color="primary"
                        type="month"
                      ></v-calendar>
                      </v-sheet>
                    </v-col>
                    <v-col cols="12">
                    <v-alert
                      text
                      type="success"
                    >
                      เดือน <strong>{{monthNamesThai[parseInt(today.split("-")[1])]}}</strong> พนักงานท่านนี้ <strong>ว่างงาน</strong>
                    </v-alert>
                    </v-col>
                  </v-row>
                  </v-form>
                  <br>
                  <template v-if="BookingDataItem.length > 0">
                  <div class="text-center" v-if="BookingDataItem[0].addressLatLong === null">
                    <v-alert
                        dense
                        outlined
                        type="error"
                      >
                      <v-row align="center">
                        <v-col class="grow">
                          เนื่องจาก นัดหมายนี้ยังไม่มี แผนที่ กรุณานำ QR code หรือ ส่งลิงค์ ให้ลูกค้ากรอกด้วย !!
                        </v-col>
                        <v-col class="shrink">
                          <v-btn
                            tile
                            color="success"
                            @click="getQrCOde(BookingDataItem[0])"
                          >
                            <v-icon left>
                              mdi-qrcode-scan
                            </v-icon>
                            เปิด QR Code
                          </v-btn>
                        </v-col>
                      </v-row>
                      </v-alert>
                  </div>
                  <div class="text-center">
                    <v-btn
                      elevation="2"
                      v-if="BookingDataItem[0].addressLatLong !== null"
                      small
                      dark
                      color="#173053"
                      @click="addEmpJob()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      มอบหมายงาน
                    </v-btn>
                    <v-btn small color="red" dark @click="dialogEdit = false, getDataDefault(), searchOther = '', showColorSearch = false, statusSearch = 'no', empSelectJob = ''">
                      <v-icon color="#173053">mdi-close</v-icon> ยกเลิก
                    </v-btn>
                  </div>
                  </template>
                </v-container>
              </v-card-text>
              <v-card-text  v-if="!dataEditJobReady">
                <v-container>
                  <div class="text-center">
                    <waitingAlert></waitingAlert>
                    </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- end -->

          <v-dialog v-model="dialogJob" persistent :max-width="dialogwidth">
            <v-card
              style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);">
                <v-container >
                  <v-row >
                    <v-col cols="12" v-if="sortNo === 1">
                      <div class=" text-center">
                      <br/>
                        <br>
                        <h2 style="font-weight: 900; color:#FFA000">เปลี่ยนพนักงาน Onsite!</h2>
                        <v-row>
                          <v-col cols="12">
                            <v-select
                              v-model="empSelectJob"
                              :items="empSelectStepAdd"
                              label="พนักงาน Onsite"
                              menu-props="auto"
                              outlined
                              required
                              :rules="[rules.required]"
                              dense
                              @change="checkEmpJob()"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row v-if="empSelectJob !== ''">
                          <v-col cols="12" class="pb-0 pt-0">
                            <v-sheet height="64">
                            <v-toolbar dense>
                              <v-btn
                                fab
                                text
                                small
                                color="grey darken-2"
                                @click="prev()"
                              >
                                <v-icon small>
                                  mdi-chevron-left
                                </v-icon>
                              </v-btn>
                              <v-btn
                                fab
                                text
                                small
                                color="grey darken-2"
                                @click="next()"
                              >
                                <v-icon small>
                                  mdi-chevron-right
                                </v-icon>
                              </v-btn>
                              <!-- <v-toolbar-title v-if="$refs.calendaronsite">{{
                                $refs.calendaronsite.title
                              }}</v-toolbar-title> -->
                              <v-toolbar-title>{{
                                monthNamesThai[parseInt(today.split("-")[1])] + ' ' + today.split("-")[0]
                              }}</v-toolbar-title>
                            </v-toolbar>
                          </v-sheet>
                          </v-col>
                        </v-row>
                        <v-row v-if="empSelectJob !== '' && checkEventInfo.length > 0">
                          <v-col cols="12" class="pb-0 pt-0">
                            <v-sheet>
                            <v-calendar
                              ref="calendaronsite"
                              :now="today"
                              v-model="today"
                              locale="th-TH"
                              color="primary"
                              type="month"
                            >
                              <!-- <template v-slot:day-label="{ day }">
                                <span style="font-size:26px !important;">{{day}}</span>
                              </template> -->
                              <template v-slot:day="{ date }">
                                <div v-if="eventInfo[date]">
                                  <v-row>
                                    <v-col class="text-center mb-1 mt-0">
                                      <v-badge
                                        avatar
                                        bordered
                                        overlap
                                        color="orange darken-1"
                                        v-if="eventInfo[date].sortNo1 > 0"
                                        class="mr-1"
                                        style="cursor: pointer"
                                        @click.native="openCalendaList(date, 'sortNo1')"
                                      >
                                        <template v-slot:badge>
                                          <v-avatar class="mb-1" color="orange darken-1">
                                            {{eventInfo[date].sortNo1}}
                                          </v-avatar>
                                        </template>

                                        <v-avatar size="40" color="orange darken-3">
                                          <v-icon dark>
                                              mdi-water-plus
                                          </v-icon>
                                        </v-avatar>
                                      </v-badge>
                                      <v-badge
                                        avatar
                                        bordered
                                        overlap
                                        color="blue darken-1"
                                        v-if="eventInfo[date].sortNo2 > 0"
                                        class="mr-1"
                                        style="cursor: pointer"
                                        @click.native="openCalendaList(date, 'sortNo2')"
                                      >
                                        <template v-slot:badge>
                                          <v-avatar class="mb-1" color="blue darken-1">
                                            {{eventInfo[date].sortNo2}}
                                          </v-avatar>
                                        </template>

                                        <v-avatar size="40" color="blue darken-3">
                                          <v-icon dark>
                                              mdi-water-check
                                          </v-icon>
                                        </v-avatar>
                                      </v-badge>
                                    </v-col>
                                  </v-row>
                                </div>
                              </template>
                            </v-calendar>
                            </v-sheet>
                          </v-col>
                        </v-row>
                        <v-row v-if="empSelectJob !== '' && checkEventInfo.length === 0">
                          <v-col cols="12" class="pb-0 pt-0">
                            <v-sheet>
                            <v-calendar
                              ref="calendaronsite"
                              :now="today"
                              v-model="today"
                              locale="th-TH"
                              color="primary"
                              type="month"
                            ></v-calendar>
                            </v-sheet>
                          </v-col>
                          <v-col cols="12">
                          <v-alert
                            text
                            type="success"
                          >
                            เดือน <strong>{{monthNamesThai[parseInt(today.split("-")[1])]}}</strong> พนักงานท่านนี้ <strong>ว่างงาน</strong>
                          </v-alert>
                          </v-col>
                        </v-row>
                    </div>
                  </v-col>
                  <v-col cols="12" v-if="sortNo !== 1">
                      <div class=" text-center">
                        <v-alert
                          outlined
                          type="error"
                        >
                          รายการนี้ได้เริ่มงานไปแล้ว !!
                        </v-alert>
                      </div>
                  </v-col>
                </v-row>
                </v-container>
                <v-row >
                  <v-col cols="12" class="text-center">
                    <v-btn small class="ma-2" v-if="sortNo === 1" color="primary" @click="jobConfirm()" dark>
                            เปลี่ยนพนักงาน
                        <v-icon dark right>
                        mdi-checkbox-marked-circle
                        </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="error" @click="dialogJob = false" dark >
                            ปิด
                            <v-icon dark right>
                                mdi-minus-circle
                            </v-icon>
                        </v-btn>
                  </v-col>
                </v-row>
              </v-card>
          </v-dialog>

          <v-dialog v-model="dialogChange" persistent :max-width="dialogwidth">
            <v-card class="text-center">
              <v-card-title>เปลี่ยนเวลานัดหมาย</v-card-title>
              <v-form ref="form_change" v-model="validChange" lazy-validation>
                <v-card-text v-if="dataChangeReady">
                  <v-container>
                    <v-row>
                      <v-col cols= "12">
                        <v-textarea
                          v-model="remark"
                          outlined
                          v-if="getSelectText === 'confirm'"
                          label="หมายเหตุเพิ่มเติม"
                          auto-grow
                        ></v-textarea>
                      </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6" lg="6">
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
                          @input="menuDateChange = false"
                          :min="
                            new Date(
                              Date.now() -
                                new Date().getTimezoneOffset() * 60000
                            )
                              .toISOString()
                              .substr(0, 10)
                          "
                        ></v-date-picker>
                        <!-- <v-date-picker
                          v-model="formChange.date"
                          @input="menuDateChange = false"
                        ></v-date-picker> -->
                      </v-menu>
                    </v-col>
                    <v-col  cols="12" md="6" lg="6">
                      <!-- <v-select
                          v-model="formChange.time"
                          :items="timeavailable"
                          label="เวลา"
                          menu-props="auto"
                          outlined
                          dense
                          required
                          :rules ="[rules.required]"
                        ></v-select> -->
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
                  <div class="text-center">
                    <!-- <v-btn
                      elevation="10"
                      color="green darken-1"
                      dark
                      small
                      :disabled="!validChange"
                      @click="changeChk(dataChange, 'confirm')"
                      >เปลี่ยนวันเวลานัดหมาย (ยืนยัน)</v-btn> -->
                    <v-btn
                      elevation="10"
                      color="#173053"
                      dark
                      small
                      :disabled="!validChange"
                      @click="changeChk(dataChange, 'confirm')"
                      >เปลี่ยนวันเวลานัดหมาย</v-btn
                    >
                    <!-- <v-btn
                      elevation="10"
                      color="#173053"
                      dark
                      v-if="getSelectText !== 'confirm'"
                      small
                      :disabled="!validChange"
                      @click="changeChk(dataChange, 'change')"
                      >เปลี่ยนวันเวลานัดหมาย</v-btn
                    > -->
                    <v-btn
                      elevation="10"
                      color="#173053"
                      outlined
                      style="background-color:#FFFFFF"
                      small
                      @click="dialogChange = false"
                      >ยกเลิก</v-btn
                    >
                  </div>
                  </v-container>
                </v-card-text>
                <div class="text-center" v-if="!dataChangeReady">
                  <waitingAlert></waitingAlert>
                  </div>
                <br />
              </v-form>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogInfo" :max-width="dialogwidth">
            <v-card class="text-center">
              <v-card-title><b>รายละเอียดนัดหมาย</b></v-card-title>
              <v-card-text v-if="dataInfo">
                <v-row>
                  <v-col class="text-right">ประเภทบริการ</v-col>
                  <v-col class="text-left">{{dataInfo.flowName}}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-right">วันที่ต้องการเข้ารับบริการ</v-col>
                  <v-col class="text-left">{{dataInfo.dueDate}}</v-col>
                </v-row>
                <v-row v-for="(row, index) in BookingDataItem" v-bind:key="index">
                  <v-col class="text-right">{{row.fieldName}}</v-col>
                  <v-col class="text-left">{{row.fieldValue}}</v-col>
                </v-row><br>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogRemove" :max-width="dialogwidth">
            <v-card class="text-center">
              <v-card-title>
                ยกเลิกรายการนี้
              </v-card-title>
              <v-form ref="form_remove" v-model="validRemove" lazy-validation>
                <v-container>
              <v-card-text v-if="dataCancelReady">
                <v-row>
                  <v-col cols= "12">
                  <v-textarea
                    v-model="remarkRemove"
                    outlined
                    label="หมายเหตุในการยกเลิก"
                    auto-grow
                    required
                    :rules="[rules.required]"
                  ></v-textarea>
                  </v-col>
                  <v-col cols= "12">
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
                    elevation="10"
                    color="#173053"
                    dark
                    small
                    @click="cancelChk()"
                    >ยกเลิกรายการนี้</v-btn
                  >
                  <v-btn
                    elevation="10"
                    color="#173053"
                    outlined
                    style="background-color:#FFFFFF"
                    small
                    @click="dialogRemove = false"
                    >ยกเลิก</v-btn
                  >
                </div>
              </v-card-text>
              <div class="text-center" v-if="!dataCancelReady">
                  <waitingAlert></waitingAlert>
                  </div>
              </v-container>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogRemark" :max-width="dialogwidth">
            <v-card class="text-center">
              <v-card-title>
                หมายเหตุเพิ่มเติม
              </v-card-title>
              <!-- <v-form ref="form_remove" v-model="validRemove" lazy-validation> -->
                <v-container>
              <v-card-text>
                <v-row>
                  <v-col cols= "12">
                  <v-textarea
                    v-model="remark"
                    outlined
                    label="หมายเหตุเพิ่มเติม"
                    auto-grow
                  ></v-textarea>
                  </v-col>
                </v-row>
                <div class="text-center">
                  <v-btn
                    elevation="10"
                    color="#173053"
                    dark
                    small
                    @click="onSaveRemark()"
                    >หมายเหตุเพิ่มเติม</v-btn
                  >
                  <v-btn
                    elevation="10"
                    color="#173053"
                    outlined
                    style="background-color:#FFFFFF"
                    small
                    @click="dialogRemark = false"
                    >ยกเลิก</v-btn
                  >
                </div>
              </v-card-text>
              </v-container>
              <!-- </v-form> -->
            </v-card>
          </v-dialog>
          <!-- data table -->
          <v-col cols="12" >
            <BookingQueue :branchParent="branch" :masBranchIDParent="masBranchID" :drawerParent="drawer" :menu1Parent="menu1" :timeTableParent="timeTable" :rulesParent="rules" :masterTimeParent="masterTime" :dataItemTimesChangeParent="dataItemTimesChange" :getTimesChangeParent="getTimesChange" :exportExcelParent="exportExcel" :dataRemoveExportParent="dataRemoveExport" :exportExcelRemoveParent="exportExcelRemove" :toggleParent="toggle" @updateTimeTable="updateTimeTablefromChild"></BookingQueue>
            <v-card elevation="7" v-if="dataReady">
              <div>
                <v-btn
                  v-if="dataItem.length > 0"
                  color="blue-grey"
                  class="ma-2 white--text"
                  @click="toggle"
                  small
                >
                  ตรวจสอบคิวจองรายวัน
                  <v-icon
                    right
                    dark
                  >
                    mdi-table-eye
                  </v-icon>
                </v-btn>
                <v-btn
                  v-if="dataItem.length > 0"
                  color="blue-grey"
                  class="ma-2 white--text"
                  small
                  @click="addDataSet()"
                >
                  ตรวจสอบคิวจองรายเดือน
                </v-btn>
              </div>
              <v-card-title>
                <v-text-field
                  v-model="searchAll2"
                  append-icon="mdi-magnify"
                  label="ค้นหา"
                  single-line
                  dense
                  hide-details
                ></v-text-field>
                <v-menu
                  v-model="menuDateSearch"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="filters"
                      label="ค้นหาจากวันที่นัดหมาย"
                      prepend-icon="mdi-calendar"
                      readonly
                      outlined
                      class="pa-4"
                      append-icon="mdi-magnify"
                      dense
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="filters"
                    @input="menuDateSearch = false"
                  ></v-date-picker>
                </v-menu>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="red"
                      fab
                      class="mb-7"
                      dark
                      small
                      @click.stop="filters=''"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon> mdi-calendar-remove </v-icon>
                    </v-btn>
                  </template>
                  <span>เคลียร์ ค้นหาจากวันที่นัดหมาย</span>
                </v-tooltip>
                <!-- <v-icon color="#64DD17" small @click="filters=''">call</v-icon> -->
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="columns"
                  :items="dataItem"
                  v-if="!selectedStatus"
                  :search="searchAll2"
                  :items-per-page="10"
                >
                  <template v-slot:[`item.cusName`]="{ item }">
                    <a @click.stop="openInfo(item)" style="cursor:hand"><u>{{ item.cusName }}</u></a>
                  </template>
                  <template v-slot:[`item.CREATE_DATE`]="{ item }">
                    {{ format_dateNotime(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                    {{ format_dateNotime(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.dueDate`]="{ item }">
                    {{ format_date(item.dueDate) }}
                  </template>
                  <template v-slot:[`item.action2`]="{ item }">
                    <v-row>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          v-if="item.statusBt === 'confirm' || item.statusBt === 'confirmJob'"
                          :color="(item.remarkConfirm1) ? 'green darken-2' : 'grey darken-1'"
                          v-model="item.remarkConfirm1"
                          @click.stop="item.remarkConfirm1=!item.remarkConfirm1;confirmRemark(item, 'inAdvance')"
                        >
                          1 วัน
                        </v-chip>
                      </v-col>
                      <!-- <v-col>
                        <v-chip
                          filter
                          dark
                          v-if="item.statusBt === 'confirm' || item.statusBt === 'confirmJob'"
                          :color="(item.remarkConfirm2) ? 'green darken-2' : 'grey darken-1'"
                          v-model="item.remarkConfirm2"
                          @click.stop="item.remarkConfirm2=!item.remarkConfirm2;confirmRemark(item, 'inDay')"
                        >
                          30 นาที
                        </v-chip>
                      </v-col> -->
                    </v-row>
                  </template>
                  <template v-slot:[`item.action3`]="{ item }">
                    <v-row>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          :color="(item.fastTrack) ? 'green darken-2' : 'grey darken-1'"
                          v-model="item.fastTrack"
                          @click.stop="item.fastTrack=!item.fastTrack;confirmRemark(item, 'fastTrack')"
                        >
                          Fast Track
                        </v-chip>
                      </v-col>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          :color="(item.extraJob) ? 'green darken-2' : 'grey darken-1'"
                          v-model="item.extraJob"
                          @click.stop="item.extraJob=!item.extraJob;confirmRemark(item, 'extraJob')"
                        >
                          Extra Job
                        </v-chip>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <!-- confirm -->
                    <v-btn
                      color="success"
                      fab
                      id="v-step-2"
                      v-if="item.statusBt !== 'confirmJob'"
                      :disabled="item.chkConfirm"
                      small
                      @click.stop="confirmChk(item)"
                    >
                      <v-icon dark> mdi-phone-check </v-icon>
                    </v-btn>
                    <v-btn
                      color="error"
                      fab
                      id="v-step-2"
                      v-if="item.statusBt !== 'confirmJob'"
                      small
                      :disabled="item.chkCancel"
                      @click.stop="setDataRemove(item)"
                      title="ยกเลิกนัด"
                    >
                      <v-icon dark> mdi-phone-cancel </v-icon>
                    </v-btn>
                    <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="warning"
                          fab
                          v-if="item.statusBt !== 'confirmJob'"
                          small
                          @click.stop="setDataChang(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon> mdi-calendar-clock </v-icon>
                        </v-btn>
                      </template>
                      <span>เปลี่ยนเวลานัดหมาย</span>
                    </v-tooltip>

                    <v-btn
                      color="primary"
                      fab
                      v-if="item.statusBt === 'confirm'"
                      small
                      @click.stop="(dialogEdit = true), getBookingData(item), checkTimeFlow(), getEmpSelectAdd()"
                    >
                      <v-icon dark> mdi-account-plus </v-icon>
                    </v-btn>
                    <v-btn
                      color="red"
                      dark
                      v-if="item.statusBt === 'confirmJob' || item.statusBt === 'cancel'"
                      fab
                      small
                      @click.stop="(dialogDelete = true), getDataById(item)"
                    >
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
                <v-data-table
                  :headers="columnsSelected"
                  :items="filteredSelect"
                  v-if="selectedStatus"
                  :search="searchAll2"
                  :items-per-page="10"
                >
                  <template v-slot:[`item.CREATE_DATE`]="{ item }">
                    {{ format_dateNotime(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                    {{ format_dateNotime(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.dueDate`]="{ item }">
                    {{ (item.dueDate) }}
                  </template>
                  <template v-slot:[`item.remark`]="{ item }">
                    <a v-if="item.remark !== ''" @click.stop="openRemark(item)" style="cursor:hand"><u>{{ item.remark }}</u></a>
                    <v-btn
                      color="teal"
                      small
                      v-if="item.remark === ''"
                      dark
                      @click.stop="openRemark(item)"
                    >
                      <v-icon left dark> mdi-playlist-edit </v-icon>
                      เพิ่มหมายเหตุ
                    </v-btn>
                  </template>
                  <template v-slot:[`item.action2`]="{ item }">
                    <v-row>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          v-if="item.statusBt === 'confirm' || item.statusBt === 'confirmJob'"
                          :color="(item.remarkConfirm1) ? 'green darken-2' : 'grey darken-1'"
                          v-model="item.remarkConfirm1"
                          @click.stop="item.remarkConfirm1=!item.remarkConfirm1;confirmRemark(item, 'inAdvance')"
                        >
                          1 วัน
                        </v-chip>
                      </v-col>
                      <!-- <v-col>
                        <v-chip
                          filter
                          dark
                          v-if="item.statusBt === 'confirm' || item.statusBt === 'confirmJob'"
                          :color="(item.remarkConfirm2) ? 'green darken-2' : 'grey darken-1'"
                          v-model="item.remarkConfirm2"
                          @click.stop="item.remarkConfirm2=!item.remarkConfirm2;confirmRemark(item, 'inDay')"
                        >
                          30 นาที
                        </v-chip>
                      </v-col> -->
                    </v-row>
                  </template>
                  <template v-slot:[`item.action3`]="{ item }">
                    <v-row>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          :color="(item.fastTrack) ? 'green darken-2' : 'grey darken-1'"
                          v-model="item.fastTrack"
                          @click.stop="item.fastTrack=!item.fastTrack;confirmRemark(item, 'fastTrack')"
                        >
                          Fast Track
                        </v-chip>
                      </v-col>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          :color="(item.extraJob) ? 'green darken-2' : 'grey darken-1'"
                          v-model="item.extraJob"
                          @click.stop="item.extraJob=!item.extraJob;confirmRemark(item, 'extraJob')"
                        >
                          Extra Job
                        </v-chip>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <!-- confirm -->
                    <v-tooltip bottom v-if="item.addressLatLong !== null">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="blue-grey darken-1"
                          fab
                          small
                          dark
                          @click.stop="setShowMap(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark> mdi-map-marker-radius-outline </v-icon>
                        </v-btn>
                      </template>
                      <span>ดูแผนที่</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="yellow"
                          fab
                          small
                          @click.stop="setDataEdit(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark> mdi-tools </v-icon>
                        </v-btn>
                      </template>
                      <span>แก้ไขข้อมูล</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="item.statusBt === 'confirm'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          fab
                          small
                          @click.stop="(dialogEdit = true), getBookingDataJob(item, 'qrcode'), getEmpSelectAdd()"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark> mdi-account-plus </v-icon>
                        </v-btn>
                      </template>
                      <span>มอบหมายงาน</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="item.statusBt !== 'confirmJob' && item.statusBt !== 'confirm'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="success"
                          fab
                          :disabled="item.chkConfirm"
                          small
                          @click.stop="confirmChk(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark> mdi-phone-check </v-icon>
                        </v-btn>
                      </template>
                      <span>ยืนยันนัดหมาย</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="item.statusBt !== 'wait'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="warning"
                          fab
                          small
                          @click.stop="setDataChang(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon> mdi-calendar-clock </v-icon>
                        </v-btn>
                      </template>
                      <span>เปลี่ยนเวลานัดหมาย</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="item.statusBt !== 'cancel' && item.statusBt !== 'confirmJob' && item.statusBt !== 'confirm'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="error"
                          fab
                          small
                          :disabled="item.chkCancel"
                          @click.stop="setDataRemove(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark> mdi-phone-cancel </v-icon>
                        </v-btn>
                      </template>
                      <span>ยกเลิกนัดหมาย</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="item.statusBt === 'confirmJob'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="info"
                          dark
                          fab
                          small
                          @click.stop="(dialogJob = true), getjob(item), getEmpSelectAdd()"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon> mdi-account-reactivate </v-icon>
                        </v-btn>
                      </template>
                      <span>เปลี่ยนพนักงาน Onsite</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="item.statusBt === 'cancel'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="red"
                          dark
                          fab
                          small
                          @click.stop="(dialogDelete = true), getDataById(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon> mdi-delete </v-icon>
                        </v-btn>
                      </template>
                      <span>ลบรายการนี้</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="item.userId === 'user-skip' || item.userId === ''">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="purple"
                          dark
                          fab
                          small
                          @click.stop="getQrCOde(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon> mdi-qrcode-scan </v-icon>
                        </v-btn>
                      </template>
                      <span>Qr Code เพื่อขอที่อยู่</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
            <div v-if="!dataReady" class="text-center">
              <waitingAlert></waitingAlert>
            </div>
          </v-col>
          <!-- end data table -->
        </v-row>
        <v-dialog v-model="dialogMap" :max-width="dialogwidth">
           <v-card class="text-center">
          <v-card-title>
            แสดงแผนที่
          </v-card-title>
          <v-card-text>
              <v-container>
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
                        <gmap-info-window
                              :opened="true"
                              :position="center"
                              :options="{
                                pixelOffset: {
                                  width: 0,
                                  height: -35
                                }
                              }"
                          >
                              กดที่หมุดเพื่อ นำทาง
                          </gmap-info-window>
                      </GmapMap>
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
                <hr>
                <div class="text-center">
                  <v-btn
                    elevation="10"
                    color="#173053"
                    outlined
                    style="background-color:#FFFFFF"
                    small
                    @click="dialogMap = false"
                    >ปิด</v-btn
                  >
                </div>
              </v-container>
          </v-card-text>
           </v-card>
        </v-dialog>
        <v-dialog v-model="dialogConfirm" :max-width="dialogwidth">
          <v-form ref="form_update" v-model="validUpdate" lazy-validation>
            <v-card class="text-center">
              <v-container>
                <v-card-title>
                  ยืนยันรายการนี้
                </v-card-title>
              </v-container>
              <v-card-text v-if="dataConfirmReady">
                <v-container>
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
                  <v-col class="pb-0 pt-0" cols="12" v-if="dataPackage.filter(el => { return el.balanceAmount > 0 }).length > 0">
                    <v-card class="pl-1">
                      <v-subheader>ลูกค้ามี {{dataPackage.filter(el => { return el.balanceAmount > 0 }).length}} แพ็คเกจ</v-subheader>
                      <v-subheader v-show="StatusPackage.packageName">ลูกค้าได้ทำการเลือกแพ็คเกจ {{StatusPackage.packageName}}</v-subheader>
                      <v-slide-group
                        active-class="success"
                        >
                        <v-slide-item v-for="(item, index) in dataPackage.filter(el => { return el.balanceAmount > 0 })" :key="index">
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
                </v-row>
                <div class="text-center">
                  <v-btn
                    elevation="10"
                    color="#173053"
                    dark
                    small
                    @click="addDataJob(dataConfirm)"
                    >ยืนยันรายการนี้</v-btn
                  >
                  <v-btn
                    elevation="10"
                    color="#173053"
                    outlined
                    style="background-color:#FFFFFF"
                    small
                    @click="dialogConfirm = false"
                    >ยกเลิก</v-btn
                  >
                </div>
                </v-container>
              </v-card-text>
               <div class="text-center" v-if="!dataConfirmReady">
                  <waitingAlert></waitingAlert>
                  </div>
            </v-card>
          </v-form>
          </v-dialog>
        <v-dialog v-model="dialogEditData" :max-width="dialogwidth">
          <!-- <v-dialog v-model="dialogAdd" persistent max-width="70%"> -->
            <v-card class="text-center">
                <v-card-text>
                    <v-col class="text-right pa-0">
                      <v-btn
                        small
                        color="#E0E0E0"
                        @click="(dialogEditData = false)"
                      >
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                    <v-row justify="center">
                      <v-col cols="12">
                      <!-- <v-col cols="12" sm="6" md="6" lg="6" class="v-margit_text_add mt-0 pa-0"> -->
                        <v-col class="text-center pa-3 ml-2">
                          <h3 style="font-size:10vw;" class="underline-06">แก้ไขข้อมูล</h3>
                        </v-col>
                        <v-form ref="form_edit" v-model="validEdit" lazy-validation>
                        <v-col cols="12" v-if="dataEditReady">
                          <v-select
                            v-model="formEdit.flowId"
                            :items="DataFlowName"
                            label="ประเภทบริการ"
                            outlined
                            dense
                            required
                            :rules="[rules.required]"
                          ></v-select>
                          <v-select
                            v-model="formEdit.masBranchID"
                            :items="branch"
                            label="สาขา"
                            outlined
                            dense
                            required
                            @change="checkTimeEdit()"
                            :rules="[rules.required]"
                          ></v-select>
                          <template v-if="BookingDataItemEdit">
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
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'text'">
                                  <v-text-field
                                    v-model="item.fieldValue"
                                    :label="item.fieldName"
                                    outlined
                                    dense
                                    required
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'number'">
                                  <v-text-field
                                    v-model="item.fieldValue"
                                    :label="item.fieldName"
                                    outlined
                                    dense
                                    required
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                  ></v-text-field>
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
                                    :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                    dense
                                    clearable
                                    outlined
                                  ></v-select>
                                </v-col>
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'Radio'" style="padding:0px;">
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
                                  <v-col cols="12" class="InputData" v-if="item.fieldType == 'text'">
                                    <v-text-field
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
                                      v-model="item.fieldValue"
                                      :label="item.fieldName"
                                      outlined
                                      required
                                      dense
                                      :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                    ></v-text-field>
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
                                  <template v-if="parseInt(item.conditionValue) === parseInt(formEdit.flowId) ">
                                    <v-col cols="12" class="InputData" v-if="item.fieldType == 'text'">
                                      <v-text-field
                                        v-model="item.fieldValue"
                                        :label="item.fieldName"
                                        dense
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="InputData" v-if="item.fieldType == 'number'">
                                      <v-text-field
                                        v-model="item.fieldValue"
                                        :label="item.fieldName"
                                        dense
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
                                        outlined
                                      ></v-text-field>
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
                                          dense
                                          clearable
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
                            <v-col class="pb-0">
                              <v-menu
                                v-model="menuDateEdit"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="dateEdit"
                                    label="วันที่"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    dense
                                    outlined
                                    v-on="on"
                                    required
                                    :rules="[rules.required]"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="dateEdit"
                                  @input="menuDateEdit = false"
                                  :min="
                                    new Date(
                                      Date.now() -
                                        new Date().getTimezoneOffset() * 60000
                                    )
                                      .toISOString()
                                      .substr(0, 10)
                                  "
                                ></v-date-picker>
                                <!-- <v-date-picker
                                  v-model="dateEdit"
                                  @input="menuDate = false"
                                ></v-date-picker> -->
                              </v-menu>
                            </v-col>
                            <v-col class="pb-0">
                              <!-- <v-select
                              v-model="timeEdit"
                              :items="timeavailable"
                              label="เวลา"
                              menu-props="auto"
                              outlined
                              dense
                            ></v-select> -->
                            <v-select
                              v-model="timeEdit"
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
                          <!-- <v-row>
                            <v-col class="pt-0">
                              <v-radio-group v-model="formEdit.radiosRemark" row  required :rules ="[rules.required]">
                                <v-radio value="ซ่อมปกติ">
                                  <template v-slot:label>
                                    <div class="mt-3"><strong class="primary--text">ซ่อมปกติ</strong></div>
                                  </template>
                                </v-radio>
                                <v-radio value="ExtraJob">
                                  <template v-slot:label>
                                    <div class="mt-3"><strong class="error--text">Extra Job</strong></div>
                                  </template>
                                </v-radio>
                                <v-radio value="FastTrack">
                                  <template v-slot:label>
                                    <div class="mt-3"><strong class="orange--text">Fast Track</strong></div>
                                  </template>
                                </v-radio>
                              </v-radio-group>
                            </v-col>
                          </v-row> -->
                          <v-row>
                            <v-col class="pt-0">
                              <v-select
                                v-model="empSelectEdit"
                                :items="empSelectStepAdd"
                                label="พนักงานที่รับนัดหมาย"
                                menu-props="auto"
                                outlined
                                dense
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="InputData pb-0 pt-0" cols="12">
                                <v-text-field
                                v-model="address"
                                label="ชื่อของที่อยู่"
                                outlined
                                required
                                :rules="statusBt === 'confirm' ? [rules.required] : [true]"
                                ></v-text-field>
                            </v-col>
                            <v-col class="InputData" cols="12">
                              <v-card class="p-3">
                                <!-- <GmapAutocomplete>
                                  <template v-slot:input="slotProps">
                                      <v-text-field
                                        outlined
                                        prepend-inner-icon="place"
                                        placeholder="Location Of Event"
                                        ref="input"
                                        v-on:listeners="slotProps.listeners"
                                        v-on:attrs="slotProps.attrs">
                                      </v-text-field>
                                  </template>
                                </GmapAutocomplete> -->
                                <GmapAutocomplete @place_changed="updatePlace" />
                                <hr>
                                <!-- <gmap-autocomplete @place_changed="updatePlace"/> -->
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
                              </v-card>
                            </v-col>
                          </v-row>
                          <div class="text-center">
                            <v-btn
                              elevation="2"
                              large
                              color="#173053"
                              class="text-white"
                              :loading="loadingEdit"
                              :disabled="loadingEdit"
                              @click="editDataSelect()"
                            >
                              <template v-slot:loader>
                                <span class="custom-loader">
                                  <v-icon light>mdi-cached</v-icon>
                                </span>
                              </template>
                              <v-icon left>mdi-checkbox-marked-circle</v-icon>
                              แก้ไขข้อมูล
                            </v-btn>
                            <v-btn
                              elevation="2"
                              large
                              color="red"
                              dark
                              @click="dialogEditData = false"
                            >
                              <v-icon left>mdi-close</v-icon>
                              ปิด
                            </v-btn>
                          </div>
                        </v-col>
                        </v-form>
                        <div class="text-center" v-if="!dataEditReady">
                            <waitingAlert></waitingAlert>
                            </div>
                      </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogAddCon"
            persistent
            max-width="500px"
          >
            <v-card>
              <v-card-title class="text-h5">
                บันทึกข้อมูล
              </v-card-title>
              <v-card-text>ต้องการ บันทึกข้อมูล ใช่หรือไม่?</v-card-text>
              <v-card-actions v-if="dataReadyAdd">
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  color="red darken-1"
                  @click="dialogAddCon = false, loadingAdd = false"
                >
                  ตรวจสอบอีกครั้ง
                </v-btn>
                <v-btn
                  dark
                  color="green darken-1"
                  @click="addDataInsert()"
                >
                  บันทึกข้อมูล
                </v-btn>
              </v-card-actions>
              <div class="text-center" v-if="!dataReadyAdd">
                <waitingAlert></waitingAlert>
              </div>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogError"
            persistent
            max-width="500px"
          >
            <v-card>
              <v-card-title class="text-h5">
                ผิดพลาด
              </v-card-title>
              <v-card-text>{{textError}}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  color="red darken-1"
                  @click="dialogError = false"
                >
                  ตรวจสอบอีกครั้ง
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogCalenda" width="600">
            <v-card>
              <v-card-title class="text-h6 grey lighten-2">
                รายชื่อลูกค้านัดหมาย
              </v-card-title>
              <br />
              <template v-for="(sumItems, index1) in dataSummary">
                <!-- {{sumItems}} -->
                <v-row v-bind:key="'sum'+index1" no-gutters>
                <template v-for="(items, index2) in sumItems">
                  <v-col cols="auto" v-bind:key="'sum'+index1+index2">
                    <v-chip
                      class="ma-2"
                      :color="index1 + ' darken-2'"
                      text-color="white"
                    >
                      <v-avatar
                        left
                        :class="index1 + ' darken-4'"
                      >
                        {{items.length}}
                      </v-avatar>
                      {{index2}}
                    </v-chip>
                  </v-col>
                </template>
                </v-row>
              </template>
              <v-card-text
                v-for="(items, index) in dataCalendar"
                :key="index"
              >
                <v-card elevation="2">
                  <v-list-item :style="((items.bgcolor) ? 'background-color:' + items.bgcolor + ' !important' : '') ">
                    <v-list-item-content>
                      <v-row style="color:#fff;">
                        <v-col cols="3">
                          <!-- <h3>{{items.timeDue}}</h3><br> -->
                          <h3>{{items.timeDue}}</h3><br>
                          <v-icon dark class="mr-1" v-if="items.sortNo === 1">
                              mdi-water-plus
                          </v-icon>
                          <v-icon dark class="mr-1" v-else-if="items.sortNo === 2">
                              mdi-water-check
                          </v-icon>
                          <v-icon dark class="mr-1" v-else>
                              mdi-clock-outline
                          </v-icon>
                        </v-col>
                        <v-col cols="9">
                          <v-row>
                            <v-col cols="8"><h4>คุณ {{ items.name }}</h4></v-col>
                            <v-col cols="4" class="text-right">{{items.licenseNo}}</v-col>
                          </v-row>
                          โทร {{ items.tel }}
                        </v-col>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialogCalenda = false">
                  ยืนยัน
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogQrCode" persistent :max-width="dialogwidth">
            <v-card
              style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);">
                <v-container >
                  <v-row >
                    <v-col cols="12">
                      <div class=" text-center">
                      <br/>
                        <br>
                        <h2 style="font-weight: 900; color:#FFA000">QR Code และ Link สำหรับ รับที่อยู่ลูกค้า !</h2>
                        <qrcode-vue :value="value" :size="size" level="H" :foreground="foreground" />
                        <v-row align-content="center">
                        <v-col cols="12"  class="pb-0">
                          <v-text-field
                            v-model="Redirect"
                            style="background-color:#050C42;"
                            solo
                            disabled
                            id="myInput"
                            dense
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row justify="center" no-gutters>
                        <v-col cols="6" class="text-center">
                          <v-btn
                            color="#1B437C"
                            small
                            fab
                            dark
                            @click="FunCopy()"
                          >
                            <v-icon>mdi-content-copy</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
                </v-container>
                <v-row >
                  <v-col cols="12">
                      <v-container class="text-center" >
                        <v-btn small class="ma-2" color="error" @click="dialogQrCode = false" dark >
                            ปิดหน้านี้
                            <v-icon dark right>
                                mdi-minus-circle
                            </v-icon>
                        </v-btn>
                      </v-container>
                  </v-col>
                </v-row>
              </v-card>
          </v-dialog>
      </div>
    </v-main>
  </div>
</template>

<style scoped>
.pac-target-input {
  padding: 10px;
  width: 100%;
  border-style: solid;
  border-radius: 10px;
}
.today {
  background-color: #C1DFFF;
}
.a{
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
}
.font14 {
  font-size: 14px;
}
.font16 {
  font-size: 16px;
}
.headline1 {
  color: var(--color_headline1) !important;
  font-weight: bold;
}
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
.theme--light.v-divider {
    border-color: rgba(243, 5, 25, 0.904) !important;
}
.slidein {
  max-width: 40%;
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

/* General styles unrelated to slide in */
body {
  font-family: 'Mulish', sans-serif;
}

.toggle {
  margin: 1em;
}
.InputData{
  margin: 0px !important;
  padding: 0px !important;
}
</style>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import draggable from 'vuedraggable'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'
import DateRangePicker from 'vue2-daterange-picker'
// you need to import the CSS manually
import QrcodeVue from 'qrcode.vue'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
// import { PivotTable } from '@click2buy/vue-pivot-table'
import moment from 'moment-timezone'
import BookingQueue from './BookingQueue.vue'
import CalendarBooking from './CalendarBookingList.vue'

export default {
  name: 'BookingList',
  components: {
    waitingAlert,
    draggable,
    'left-menu-admin': adminLeftMenu,
    DateRangePicker,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile,
    VuetifyMoney,
    QrcodeVue,
    // PivotTable,
    BookingQueue,
    CalendarBooking
  },
  computed: {
    filteredSelect () {
      return this.dataItemSelect.filter(d => {
        return this.filters.length < 1 || d['dueDate'].toString().toLowerCase().includes(this.filters.toLowerCase())
        // return Object.keys(this.filters).every(f => {
        // f is search column
        // this.filters[f] is the current search string entered by user
        // d[f] is the entry being tested against the search string
        //   return this.filters[f].length < 1 || d[f].toString().toLowerCase().includes(this.filters[f].toLowerCase())
        // })
      })
    },
    dialogwidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '70%'
        case 'sm': return '60%'
        case 'md': return '50%'
        case 'lg': return '50%'
        case 'xl': return '50%'
      }
    }
  },
  data () {
    let startDate = null
    let endDate = null
    return {
      monthNamesThai: ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      Redirect: 'https://liff.line.me/1656581804-7KRQyqo5/BookingAddress?shopId=' + this.$session.getAll().data.shopId,
      dataCalendar: [],
      dataSummary: [],
      today: '',
      events: [],
      eventInfo: [],
      checkEventInfo: [],
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
      totalPrice: '',
      packageId: '',
      dataPackage: [],
      flowId: '',
      dataCoin: [],
      productExchangeRateId: '',
      filters: '',
      loadingEdit: false,
      loadingAdd: false,
      loadingRefresh: false,
      menuDateSearch: false,
      timeTable: '',
      drawer: false,
      value: '',
      size: 200,
      foreground: '#173053',
      userId: '',
      skip: {
        userId: 'user-skip'
      },
      pathToweb: 'https://liff.line.me/1656581804-7KRQyqo5/JobConfirm?jobId=',
      changeBackgroundColor: true,
      countWaiting: 0,
      countConfirm: 0,
      countCancel: 0,
      countJob: 0,
      countAll: 0,
      export_fields: {
        'Booking Id': 'bookNo',
        'สาขา': 'masBranchName',
        'ชื่อลูกค้า': 'cusName',
        'ทะเบียนรถ': 'cusReg',
        'วันและเวลานัดหมาย': 'dueDate',
        'ชื่อบริการ': 'flowName',
        'สถานะ ติดต่อ': 'statusBt',
        'วันที่ ติดต่อ': 'contactDateBt',
        // 'วันที่ แจ้งเปลี่ยน': 'changDateBt',
        'สถานะนำเข้ากระดาน': 'statusUseBt',
        'วันที่ สร้าง': 'CREATE_DATE',
        'วันที่ แก้ไขล่าสุด': 'LAST_DATE'
      },
      exportType: 'xls',
      exportFileName: 'BookingList' + new Date().toISOString().substr(0, 10).replace('/-/g', '') + '.xls',
      exportWorksheet: 'WorkSheet',
      export_data: [],
      dateRange: {startDate, endDate},
      localeData: {
        // direction: 'ltr',
        format: 'yyyy-mm-dd',
        // separator: ' - ',
        applyLabel: 'ยืนยัน',
        cancelLabel: 'ยกเลิก',
        // weekLabel: 'W',
        // customRangeLabel: 'Custom Range',
        // daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        daysOfWeek: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
        monthNames: ['ม.ค', 'ก.พ', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค'],
        // monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        firstDay: 1
      },
      masterTime: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
      masBranchID: '',
      masBranchIDExport: '',
      bookNo: '',
      BookingDataItem: [],
      Layout: [],
      dataItemTime: [],
      dataItemTimesChange: [],
      appendBody: true,
      dataEditReady: true,
      dataConfirmReady: true,
      dataCancelReady: true,
      dialogQrCode: false,
      dialogCalenda: false,
      dialogExport: false,
      dialogRemove: false,
      dialogError: false,
      dataReady: false,
      menuDate: false,
      menuDateEdit: false,
      menuDateChange: false,
      date: '',
      time: '',
      empSelectAdd: '',
      dateEdit: '',
      timeEdit: '',
      empSelectEdit: '',
      session: this.$session.getAll(),
      fieldNameItem: [],
      flowfieldNameitem: [],
      DataflowId: '',
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'รายชื่อลูกค้านัดหมาย',
          disabled: false,
          href: '/Master/BookingList'
        }
      ],
      branch: [],
      DataFlowName: [],
      // Data Table Config
      searchAll2: '',
      columns: [
        { text: 'จัดการ', value: 'action', sortable: false, align: 'center' },
        // { text: 'Booking Id', value: 'bookNo' },
        { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
        { text: 'ชื่อบริการ', value: 'flowName' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        { text: 'เบอร์โทร', value: 'tel' },
        { text: 'ทะเบียนรถ', value: 'cusReg' },
        { text: 'สถานะนัดหมาย', value: 'statusBtText' },
        // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
        { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' }
        // { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
      ],
      columnsSelected: [],
      dataItem: [],
      dataItemCheck: [],
      dataexport: [],
      dataItemSelect: [],
      editedItemSeleteField: [],
      jobitem: [],
      // End Data Table Config
      formAdd: {
        bookingId: null,
        fieldId: '',
        fieldValue: '',
        flowId: null,
        masBranchID: null,
        dueDate: '',
        shopId: this.$session.getAll().data.shopId,
        bookingFieldId: '',
        radiosRemark: ''
      },
      formEdit: {
        bookingId: null,
        fieldId: '',
        fieldValue: '',
        flowId: null,
        masBranchID: null,
        dueDate: '',
        shopId: this.$session.getAll().data.shopId,
        bookingFieldId: '',
        radiosRemark: ''
      },
      formUpdate: {
        masBranchCode: '',
        masBranchName: '',
        tel: '',
        map: '',
        shopId: '',
        bookNo: ''
      },
      formChange: {
        date: '',
        time: ''
      },
      dataChange: {},
      validUpdate: true,
      validAdd: true,
      validEdit: true,
      validRemove: true,
      validChange: true,
      validExport: true,
      // Dialog Config ADD EDIT DELETE IMPORT
      dialogAdd: false,
      dialogEdit: false,
      dialogEditData: false,
      dialogDelete: false,
      dialogChange: false,
      dialogRemark: false,
      dialogJob: false,
      dialogAddCon: false,
      menu: false,
      menu1: false,
      menuStart: false,
      dateStart: new Date().toISOString().substr(0, 7),
      endDate: '',
      endTime: '',
      memberPicture: '',
      dataInfo: null,
      dialogInfo: false,
      detailInfo: null,
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
      getSelectText: '',
      getSelectCount: 0,
      selectedStatus: false,
      swalConfig: {
        title: null,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      },
      BookingDataList: [],
      BookingDataListTimechange: [],
      remarkRemove: '',
      bookNoRemove: '',
      timeavailable: [],
      dialogConfirm: false,
      dialogMap: false,
      empSelectStep: [],
      empSelectStepAdd: [],
      dataConfirm: [],
      empSelect: '',
      dataRemoveExport: [],
      dataexportRemove: [],
      BookingDataItemEdit: [],
      dataQrcode: [],
      bookNoRemark: '',
      remark: '',
      showMap: '',
      setTimer: null,
      setTimerCalendar: null,
      searchOther: '',
      showColorSearch: false,
      dataEditJobReady: true,
      dataChangeReady: true,
      statusSearch: 'no',
      // window_open: true,
      center: null,
      address: '',
      empSelectJob: '',
      textError: '',
      dataReadyAdd: true,
      lineUserId: '',
      dueDateText: '',
      jobNo: '',
      dataEmpOnsite: [],
      checkPayment: '',
      sortNo: '',
      statusBt: '',
      tokenKey: ''
    }
  },
  beforeCreate () {
    // if (localStorage.userName) {
    //   console.log(localStorage.userName)
    // } else {
    //   console.log('not user')
    // }
    if (!this.$session.exists()) {
      if (this.$route.query.bookNo) {
        this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId + '&type=' + this.$route.query.type)
      } else {
        this.$router.push('/Core/Login')
      }
      // this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId)
    }
  },
  async mounted () {
    // this.dataReady = false
    if (this.$route.query.bookNo) {
      await this.getDataBranch()
      // await this.getEmpSelectAdd()
      this.getCustomFieldStart()
      this.getDataFlow()
      await this.scanQrcode()
    } else {
      await this.getDataBranch()
      // await this.getEmpSelectAdd()
      this.getCustomFieldStart()
      this.getDataFlow()
      this.getBookingList()
      this.$refs.calendaronsite.checkChange()
    }
    this.$root.$on('closeSetTimeGetCalenda', () => {
      // your code goes here
      this.closeSetTimeGetCalenda()
    })
  },
  methods: {
    FunCopy (text) {
      var copyText = document.getElementById('myInput')
      copyText.select()
      copyText.setSelectionRange(0, 99999)
      navigator.clipboard.writeText(copyText.value + '&bookNo=' + this.bookNo)
    },
    getQrCOde (item) {
      this.bookNo = item.bookNo
      this.value = this.Redirect + '&bookNo=' + this.bookNo
      this.dialogQrCode = true
    },
    async openCalendaList (date, text) {
      this.dataSummary = []
      this.dataCalendar = []
      let dataJobData = []
      if (text === 'sortNo1') {
        // let jobNo = this.checkEventInfo.filter(el => { return el.start === date && el.sortNo === 2 })[0].jobNo
        await axios
          .get(
          // eslint-disable-next-line quotes
            this.DNS_IP +
            '/job/get?shopId=' +
            this.session.data.shopId +
            '&empStepId=' + this.empSelectJob + '&dueDate=' + date + '&sortNo=1' + '&checkOnsite=True'
          )
          .then(async response => {
            if (response.data.status === false) {
              dataJobData = []
            } else {
              // dataJobData = response.data
              response.data.forEach((row) => {
                if (typeof (dataJobData[row.jobNo]) === 'undefined') {
                  dataJobData[row.jobNo] = []
                }
                dataJobData[row.jobNo].push(row)
              })
              console.log('dataJobData', dataJobData)
              console.log('checkEventInfo', this.checkEventInfo.filter(el => { return el.start === date && el.sortNo === 1 }))
              for (let i = 0; i < this.checkEventInfo.filter(el => { return el.start === date && el.sortNo === 1 }).length; i++) {
                var d = this.checkEventInfo.filter(el => { return el.start === date && el.sortNo === 1 })[i]
                d.name = dataJobData[d.jobNo].filter((row) => { return row.fieldName === 'ชื่อ' })
                d.licenseNo = dataJobData[d.jobNo].filter((row) => { return row.fieldName === 'เลขทะเบียน' })
                d.tel = dataJobData[d.jobNo].filter((row) => { return row.fieldName === 'เบอร์โทร' })
                d.carModel = dataJobData[d.jobNo].filter((row) => { return row.fieldName === 'รุ่นรถ' })
                d.name = (d.name.length > 0) ? d.name[0].fieldValue : ''
                d.licenseNo = (d.licenseNo.length > 0) ? d.licenseNo[0].fieldValue : ''
                d.tel = (d.tel.length > 0) ? d.tel[0].fieldValue : ''
                d.carModel = (d.carModel.length > 0) ? d.carModel[0].fieldValue : ''
                d.timeDue = dataJobData[d.jobNo][0].timeDue
                d.dueDate = dataJobData[d.jobNo][0].dueDate
                d.bgcolor = 'orange'
                this.dataCalendar.push(d)
              }

              this.dataCalendar.sort((a, b) => {
                let keyA = new Date(a.dueDate)
                let keyB = new Date(b.dueDate)
                if (keyA < keyB) return -1
                if (keyA > keyB) return 1
                return 0
              })
              console.log('this.dataCalendar', this.dataCalendar)
              this.dataSummary = this.dataCalendar.reduce((r, a) => {
                r[a.bgcolor] = r[a.bgcolor] || {}
                r[a.bgcolor][a.timeDue] = r[a.bgcolor][a.timeDue] || []
                r[a.bgcolor][a.timeDue].push(a)
                return r
              }, Object.create(null))
              console.log('this.dataSummary', this.dataSummary)
            }
          })
        this.dialogCalenda = true
      } else {
        await axios
          .get(
          // eslint-disable-next-line quotes
            this.DNS_IP +
            '/job/get?shopId=' +
            this.session.data.shopId +
            '&empStepId=' + this.empSelectJob + '&dueDate=' + date + '&sortNo=2' + '&checkOnsite=True'
          )
          .then(async response => {
            if (response.data.status === false) {
              dataJobData = []
            } else {
              // dataJobData = response.data
              response.data.forEach((row) => {
                if (typeof (dataJobData[row.jobNo]) === 'undefined') {
                  dataJobData[row.jobNo] = []
                }
                dataJobData[row.jobNo].push(row)
              })
              console.log('dataJobData', dataJobData)
              console.log('checkEventInfo', this.checkEventInfo.filter(el => { return el.start === date && el.sortNo === 2 }))
              for (let i = 0; i < this.checkEventInfo.filter(el => { return el.start === date && el.sortNo === 2 }).length; i++) {
                var d = this.checkEventInfo.filter(el => { return el.start === date && el.sortNo === 2 })[i]
                d.name = dataJobData[d.jobNo].filter((row) => { return row.fieldName === 'ชื่อ' })[0].fieldValue
                d.licenseNo = dataJobData[d.jobNo].filter((row) => { return row.fieldName === 'เลขทะเบียน' })[0].fieldValue
                d.tel = dataJobData[d.jobNo].filter((row) => { return row.fieldName === 'เบอร์โทร' })[0].fieldValue
                d.timeDue = dataJobData[d.jobNo][0].timeDue
                d.dueDate = dataJobData[d.jobNo][0].dueDate
                d.bgcolor = 'blue'
                this.dataCalendar.push(d)
              }

              this.dataCalendar.sort((a, b) => {
                let keyA = new Date(a.dueDate)
                let keyB = new Date(b.dueDate)
                if (keyA < keyB) return -1
                if (keyA > keyB) return 1
                return 0
              })
              console.log('this.dataCalendar', this.dataCalendar)
              this.dataSummary = this.dataCalendar.reduce((r, a) => {
                r[a.bgcolor] = r[a.bgcolor] || {}
                r[a.bgcolor][a.timeDue] = r[a.bgcolor][a.timeDue] || []
                r[a.bgcolor][a.timeDue].push(a)
                return r
              }, Object.create(null))
              console.log('this.dataSummary', this.dataSummary)
            }
          })
        this.dialogCalenda = true
      }
    },
    async prev () {
      this.$refs.calendaronsite.prev()
      // this.getBookingList()
      await this.checkEmpJobCalenda()
    },
    async next () {
      this.$refs.calendaronsite.next()
      // this.getBookingList()
      await this.checkEmpJobCalenda()
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
    closeSetTimeGetCalenda () {
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
    },
    // async getShowMap () {
    //   await axios
    //     .get(
    //       this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
    //     )
    //     .then(async response1 => {
    //       let rs = response1.data
    //       if (rs.status !== false) {
    //         if (rs[0].showMap === null || rs[0].showMap === '') {
    //           this.showMap = 'ไม่แสดง'
    //         } else {
    //           this.showMap = rs[0].showMap
    //         }
    //       } else {
    //         this.showMap = 'ไม่แสดง'
    //       }
    //     })
    // },
    gotoMap () {
      window.open('https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + this.center.lat + ',' + this.center.lng, '_blank')
      // window.location.href = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + this.center.lat + ',' + this.center.lng
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
    async searchAny () {
      if (this.searchOther.trim().length > 1) {
        // this.dataReady = false
        this.selectedStatus = true
        // this.getSelectText = ''
        this.dataItem = []
        this.countWaiting = 0
        this.countConfirm = 0
        this.countCancel = 0
        this.countJob = 0
        this.countAll = 0
        // Clear ช่องค้นหา
        this.searchAll2 = ''
        // this.dataItemSelect = []
        var dataItemTimes = []
        var dataItems = []
        await this.getBookingDataList('no', this.searchOther)
        await axios
          .get(
          // eslint-disable-next-line quotes
            this.DNS_IP +
            '/booking_view/getSearch?shopId=' +
            this.session.data.shopId +
            '&fieldValue=' +
            this.searchOther + '&checkOnsite=True'
          )
          .then(async response => {
          // console.log('getData', response.data)
            if (response.data.length > 0) {
              for (let i = 0; i < response.data.length; i++) {
                let d = response.data[i]
                let s = {}
                if (dataItems.filter(el => { return el.bookNo === d.bookNo }).length === 0) {
                  // console.log('d.bookNo', d.bookNo)
                  s.bookNo = d.bookNo
                  s.flowId = d.flowId
                  s.flowName = d.flowName
                  s.dueDate = d.dueDate
                  if (d.timeText === null || d.timeText === '') {
                    d.timeText = d.timeDue
                  }
                  s.dueDateText = this.format_dateNotime(d.dueDate) + ' ' + d.timeText
                  s.shopId = d.shopId
                  s.remark = d.remark || ''
                  s.masBranchID = d.masBranchID
                  s.empSelect = d.empSelect
                  s.empFull_NameTH = d.empFull_NameTH || ''
                  s.empFull_NameTH = s.empFull_NameTH.replace('นางสาว', '')
                  s.empFull_NameTH = s.empFull_NameTH.replace('นาย', '')
                  s.empFull_NameTH = s.empFull_NameTH.replace('นาง', '')
                  s.userId = d.userId
                  s.chkConfirm = false
                  s.chkCancel = false
                  s.packageId = d.packageId
                  s.address = d.address
                  s.addressLatLong = d.addressLatLong
                  s.jobNo = d.jobNo
                  s.timeText = d.timeText
                  s.remarkRemove = d.remarkRemove || ''
                  s.remarkConfirm1 = (d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True')
                  s.remarkConfirm2 = (d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True')
                  s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
                  s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
                  s.lineUserId = d.lineUserId
                  s.timeDueHtext = d.timeDueH + ':00'
                  s.timeDuetext = d.timeDue
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
                    default:
                      s.statusBtText = 'รายการนัดหมายใหม่'
                      this.countWaiting = this.countWaiting + 1
                      break
                  }
                  var chkTime = this.dataItemTime.filter(el => { return el.timeDueHtext === s.timeDueHtext })
                  if (chkTime.length === 0) {
                    dataItemTimes.push(s)
                  }
                  // console.log('this.BookingDataListSearch', this.BookingDataList[d.bookNo])
                  s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
                  s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
                  s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
                  s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                  s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                  s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                  // s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
                  // s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
                  // s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
                  // s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                  // s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                  // s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                  dataItems.push(s)
                }
              }
            }
            if (dataItems.length === 0 || dataItems.status === false) {
              this.dataItem = []
              this.dataItemTime = []
              // await this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(this.getSelectText, 0)
              } else {
                this.getSelect('wait', this.countWaiting)
              }
              this.dataReady = true
            // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
            } else {
              this.dataItem = dataItems
              var datause = dataItemTimes.sort((a, b) => {
                if (a.timeDueHtext < b.timeDueHtext) return -1
                return a.timeDueHtext > b.timeDueHtext ? 1 : 0
              })
              console.log('datause', datause)
              for (var k = 0; k < datause.length; k++) {
                var t = datause[k]
                var h = {}
                h.timeDueHtext = t.timeDueHtext
                let chkTimes = this.dataItemTime.filter(el => { return el.timeDueHtext === t.timeDueHtext })
                // console.log('chkTimes', chkTimes)
                if (chkTimes.length === 0) {
                  this.dataItemTime.push(h)
                }
              }
              // await this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(this.getSelectText, 0)
              } else {
                this.getSelect('wait', this.countWaiting)
              }
              // this.dataItemTime = dataItemTimes.sort((a, b) => {
              //   if (a.timeDueHtext < b.timeDueHtext) return -1
              //   return a.timeDueHtext > b.timeDueHtext ? 1 : 0
              // })
              console.log('this.BookingDataList', this.BookingDataList)
              this.dataReady = true
            }
          })
        // eslint-disable-next-line handle-callback-err
          .catch(error => {
            console.log(error)
            this.dataReady = true
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาใส่คำค้นหาให้มากว่า 1 ตัวอักษร', 'error')
      }
    },
    openRemark (item) {
      this.bookNoRemark = item.bookNo
      this.remark = item.remark
      this.dialogRemark = true
    },
    async onSaveRemark () {
      var dt = {
        LAST_USER: this.session.data.userName,
        remark: (this.remark || '').replace(/%/g, '%%')
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + this.bookNoRemark,
          dt
        )
        .then(async response => {
          this.$swal('เรียบร้อย', 'เปลี่ยนแปลงหมายเหตุเพิ่มเติมเรียบร้อย', 'success')
          this.dialogRemark = false
          if (this.statusSearch === 'no') {
            await this.getBookingList()
          } else {
            await this.searchAny()
          }
          // this.getTimesChange('update')
          if (this.getSelectText) {
            this.getSelect(this.getSelectText, this.getSelectCount)
          }
        })
    },
    // async geolocate () {
    //   await navigator.geolocation.getCurrentPosition(
    //     async (position) => {
    //       const center = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude
    //       }
    //       if (center) {
    //         this.center = center
    //       }
    //     },
    //     (error) => {
    //       this.center = null
    //       // this.center.lat = null
    //       // this.center.lng = null
    //       console.log('error map :', error.message)
    //     }
    //   )
    // },
    updatePlace (place) {
      // console.log(place)
      this.center = {
        // lat: place.latitude,
        // lng: place.longitude
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      // console.log(place.geometry.location)
      // this.updateCoordinates(place.geometry.location)
    },
    updateCoordinates (location) {
      this.center = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      }
    },
    async setDataEdit (dt) {
      // this.dialogEditData = true
      await this.getBookingField()
      this.getEmpSelectAddBooking()
      // await this.geolocate()
      // await this.getBookingData(dt, 'edit')
      console.log('setDataEdit', dt)
      this.BookingDataItemEdit = []
      this.formEdit.masBranchID = dt.masBranchID
      this.formEdit.flowId = dt.flowId
      this.empSelectEdit = parseInt(dt.empSelect)
      this.address = dt.address
      this.statusBt = dt.statusBt
      this.center = JSON.parse(dt.addressLatLong) || null
      this.timeavailable = []
      let dtTime = await this.branch.filter(item => { return item.value === this.formEdit.masBranchID })
      // console.log('test', JSON.parse(dtTime.map(item => item.allData.setTime)))
      this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
      this.dateEdit = moment(moment(dt.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
      if (this.timeavailable.filter(el => { return el.text === dt.timeText }).length > 0) {
        if (dt.timeText) {
          this.timeEdit = { text: dt.timeText, value: dt.dueDate.slice(-5) }
        } else {
          this.timeEdit = { text: dt.dueDate.slice(-5), value: dt.dueDate.slice(-5) }
        }
      } else {
        this.timeEdit = { text: dt.dueDate.slice(-5), value: dt.dueDate.slice(-5) }
      }
      var extraJob = ''
      var fastTrack = ''
      if (dt.extraJob === null) {
        extraJob = false
      } else {
        extraJob = dt.extraJob
      }
      if (dt.fastTrack === null) {
        fastTrack = false
      } else {
        fastTrack = dt.fastTrack
      }

      if (!extraJob && !fastTrack) {
        this.formEdit.radiosRemark = 'ซ่อมปกติ'
      } else if (extraJob && !fastTrack) {
        this.formEdit.radiosRemark = 'ExtraJob'
      } else if (!extraJob && fastTrack) {
        this.formEdit.radiosRemark = 'FastTrack'
      }

      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
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
                      for (var i = 0; i < sortrs.length; i++) {
                        var d = sortrs[i]
                        var s = {}
                        var dataBD = rs.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
                        // console.log('dataBD', dataBD)
                        if (dataBD.length > 0) {
                          s.bookNo = dataBD[0].bookNo
                          s.bookingFieldId = rs2[0].bookingFieldId
                          s.bookingDataId = dataBD[0].bookingDataId
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
                        } else {
                          s.bookNo = rs[0].bookNo
                          s.bookingFieldId = rs2[0].bookingFieldId
                          s.bookingDataId = 'newDataBooking'
                          s.conditionField = d.conditionField
                          s.fieldId = d.fieldId
                          s.fieldType = d.fieldType
                          s.fieldValue = ''
                          s.fieldName = d.fieldName
                          s.conditionField = d.conditionField
                          s.conditionValue = d.conditionValue
                          s.requiredField = d.requiredField
                          s.optionField = d.optionField
                          this.BookingDataItemEdit.push(s)
                        }
                      }
                    } else {
                      this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
                        this.dialogEditData = false
                      }).catch((error) => {
                        console.log('error function setDataEdit : ', error)
                        this.dialogEditData = false
                      })
                    }
                  }).catch((error) => {
                    this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
                      this.dialogEditData = false
                    }).catch((error) => {
                      console.log('error function setDataEdit : ', error)
                      this.dialogEditData = false
                    })
                    console.log('error function setDataEdit : ', error)
                  })
              })
          } else {
            this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
              this.dialogEditData = false
            }).catch((error) => {
              console.log('error function setDataEdit : ', error)
              this.dialogEditData = false
            })
          }
        }).catch((error) => {
          this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
            this.dialogEditData = false
          }).catch((error) => {
            console.log('error function setDataEdit : ', error)
            this.dialogEditData = false
          })
          console.log('error function setDataEdit : ', error)
        })
      console.log('this.BookingDataItemEdit', this.BookingDataItemEdit)
      this.dialogEditData = true
    },
    editDataSelect () {
      this.validate('EDIT')
      setTimeout(() => this.checkDuplicate(), 500)
      // setTimeout(() => this.editDataSelectSubmit(), 500)
    },
    async checkDuplicate () {
      if (this.validEdit !== false) {
        this.loadingEdit = true
        let checkDupliRegNo = this.BookingDataItemEdit.filter(el => { return el.fieldName === 'เลขทะเบียน' })
        console.log('checkDupliRegNo', checkDupliRegNo[0].fieldValue.replace(/ /g, ''))
        console.log('checkDupliRegNo1', checkDupliRegNo[0])
        console.log('this.statusBt', this.statusBt)
        if (checkDupliRegNo.length > 0) {
          // console.log('checkDupliRegNo', checkDupliRegNo[0].fieldValue.replace(/ /g, ''))
          await axios
            .get(this.DNS_IP + '/booking_view/getSearchDuplicate?shopId=' + this.session.data.shopId + '&fieldValue=' + checkDupliRegNo[0].fieldValue.replace(/ /g, '') +
            '&flowId=' + this.formEdit.flowId + '&dueDate=' + this.dateEdit + '&noBookNo=' + checkDupliRegNo[0].bookNo + '&statusBt=noCancel' + '&checkOnsite=True')
            .then(response => {
              let rs = response.data
              if (rs.status === false) {
              // this.addDataInsert()
                this.swalConfig.title = 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?'
                this.$swal(this.swalConfig)
                  .then(async result => {
                    this.editDataSelectSubmit()
                  }).catch(error => {
                    this.loadingEdit = false
                    console.log('editDataSelectSubmit error', error)
                  })
              } else {
                var dateEdit = this.format_dateNotime(this.dateEdit)
                this.textError = 'เลขทะเบียนนี้ วันที่ ' + dateEdit + ' ได้ทำรายการนัดหมายไปแล้ว'
                this.dialogError = true
                this.loadingEdit = false
              }
            }).catch(error => {
              setTimeout(() => this.checkDuplicate(), 3000)
              console.log('close alert : ', error)
            })
        } else {
          this.swalConfig.title = 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?'
          this.$swal(this.swalConfig)
            .then(async result => {
              this.editDataSelectSubmit()
            }).catch(error => {
              this.loadingEdit = false
              console.log('editDataSelectSubmit error', error)
            })
        }
      } else {
        this.loadingEdit = false
      }
    },
    async editDataSelectSubmit () {
      // if (this.validEdit !== false) {
      console.log('this.center', this.center)
      if (this.$session.id() !== undefined) {
        if (this.statusBt === 'confirm') {
          if (this.center === null) {
            this.$swal('ผิดพลาด', 'กรุณา ปักหมุด แผ่นที่', 'error')
            this.loadingEdit = false
          } else {
            this.editData()
          }
        } else {
          this.editData()
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
      // }
    },
    async editData () {
      this.dataEditReady = false
      let rs = this.BookingDataItemEdit
      let Add = []
      let fielditem = this.BookingDataItemEdit
      console.log('this.BookingDataItemEdit', this.BookingDataItemEdit)
      var fastTrack = 'False'
      var extraJob = 'False'
      switch (this.formEdit.radiosRemark) {
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
      for (let i = 0; i < rs.length; i++) {
        let d = rs[i]
        let update = {}
        if (d.conditionField === '' || d.conditionField === null) {
          update.fieldId = d.fieldId
          update.bookingDataId = d.bookingDataId
          update.bookingFieldId = d.bookingFieldId
          update.bookNo = d.bookNo
          update.fieldValue = (d.fieldValue || '').replace(/%/g, '%%').replace(/'/g, "\\'")
          update.dueDate = this.dateEdit + ' ' + this.timeEdit.value
          update.timeText = this.timeEdit.text
          update.flowId = this.formEdit.flowId
          update.masBranchID = this.formEdit.masBranchID
          update.fastTrack = fastTrack
          update.extraJob = extraJob
          update.LAST_USER = this.$session.getAll().data.userName
          update.empSelect = this.empSelectEdit
          update.shopId = this.session.data.shopId
          update.address = this.address
          update.addressLatLong = JSON.stringify(this.center)
          Add.push(update)
        } else {
          if (
            fielditem.filter(row => {
              return row.fieldId === parseInt(d.conditionField)
            }).length > 0
          ) {
            if (
              d.conditionValue ===
              fielditem.filter(row => {
                return row.fieldId === parseInt(d.conditionField)
              })[0].fieldValue
            ) {
              update.fieldId = d.fieldId
              update.bookingDataId = d.bookingDataId
              update.bookingFieldId = d.bookingFieldId
              update.bookNo = d.bookNo
              update.fieldValue = (d.fieldValue || '').replace(/%/g, '%%').replace(/'/g, "\\'")
              update.dueDate = this.dateEdit + ' ' + this.timeEdit.value
              update.timeText = this.timeEdit.text
              update.flowId = this.formEdit.flowId
              update.masBranchID = this.formEdit.masBranchID
              update.fastTrack = fastTrack
              update.extraJob = extraJob
              update.LAST_USER = this.$session.getAll().data.userName
              update.empSelect = this.empSelectEdit
              update.shopId = this.session.data.shopId
              update.address = this.address
              update.addressLatLong = JSON.stringify(this.center)
              Add.push(update)
            }
          } else if (d.conditionField === 'flow') {
            if (parseInt(d.conditionValue) === parseInt(this.formEdit.flowId)) {
              update.fieldId = d.fieldId
              update.bookingDataId = d.bookingDataId
              update.bookingFieldId = d.bookingFieldId
              update.bookNo = d.bookNo
              update.fieldValue = (d.fieldValue || '').replace(/%/g, '%%').replace(/'/g, "\\'")
              update.dueDate = this.dateEdit + ' ' + this.timeEdit.value
              update.timeText = this.timeEdit.text
              update.flowId = this.formEdit.flowId
              update.masBranchID = this.formEdit.masBranchID
              update.fastTrack = fastTrack
              update.extraJob = extraJob
              update.LAST_USER = this.$session.getAll().data.userName
              update.empSelect = this.empSelectEdit
              update.shopId = this.session.data.shopId
              update.address = this.address
              update.addressLatLong = JSON.stringify(this.center)
              Add.push(update)
            }
          }
        }
      }
      console.log('Add', Add)
      // this.swalConfig.title = 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?'
      // this.$swal(this.swalConfig)
      //   .then(async result => {
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/BookingData/editAdmin",
          Add
        )
        .then(async response => {
          if (this.statusSearch === 'no') {
            await this.getBookingList()
          } else {
            await this.searchAny()
          }
          // this.getTimesChange('update')
          this.formEdit.radiosRemark = ''
          this.address = ''
          this.center = null
          this.formEdit.radiosRemark = ''
          if (this.getSelectText) {
            this.getSelect(this.getSelectText, this.getSelectCount)
          }
          this.getDataCalendaBooking()
          this.dialogEditData = false
          this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
          this.dataEditReady = true
          this.loadingEdit = false
        }).catch(error => {
          // this.dataEditReady = true
          setTimeout(() => this.editDataSelectSubmit(), 3000)
          console.log('close alert : ', error)
        })
      // }).catch(error => {
      //   // this.dataEditReady = true
      //   setTimeout(() => this.editDataSelectSubmit(), 3000)
      //   console.log('close alert : ', error)
      // })
    },
    async getDataCalendaBooking () {
      console.log('this.$session.id()', this.$session.id())
      if (this.$session.id() !== undefined) {
        console.log('getDataCalendaBooking')
        try {
          await this.$refs.CalendarBooking.getDataReturn('&checkOnsite=True')
        } catch (e) { console.log(e) }
      // this.$refs.CalendarBooking.getDataFlow()
      // this.$refs.CalendarBooking.getDataBranch()
      // this.$refs.CalendarBooking.getBookingList()
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async addDataSet () {
      let _this = this
      this.setTimerCalendar = setInterval(function () { _this.getDataCalendaBooking() }, 20000)
      // var _this = this
      // this.setTimerCalendar = setInterval(function () { _this.getDataCalendaBooking() }, 30000)
      this.dialogAdd = true
      setTimeout(() => this.getDataCalendaBooking(), 1000)
      if (this.branch.length === 0) {
        await this.getDataBranch()
      }
      this.getEmpSelectAddBooking()
      this.getBookingField()
      this.checkTime()
      this.remark = ''
    },
    async getDataDefault () {
      this.loadingRefresh = true
      await this.getDataBranch()
      // await this.getEmpSelectAdd()
      this.getCustomFieldStart()
      this.getDataFlow()
      await this.getBookingList()
      // await this.getTimesChange('update')
      this.getSelect(this.getSelectText, this.getSelectCount)
      this.getDataCalendaBooking()
      this.loadingRefresh = false
    },
    async getDataSetTime () {
      if (this.statusSearch === 'no') {
        await this.getBookingList()
      } else {
        await this.searchAny()
      }
      // await this.getTimesChange('update')
      if (this.getSelectText) {
        this.getSelect(this.getSelectText, this.getSelectCount)
      }
    },
    checkTime () {
      this.timeavailable = []
      let dtTime = this.branch.filter(item => { return item.value === this.formAdd.masBranchID })
      // console.log('test', dtTime)
      this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
      // console.log('timevailable', this.timeavailable)
    },
    checkTimeEdit () {
      this.timeavailable = []
      let dtTime = this.branch.filter(item => { return item.value === this.formEdit.masBranchID })
      // console.log('test', dtTime)
      this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
      // console.log('timevailable', this.timeavailable)
    },
    checkTimeFlow () {
      this.timeavailable = []
      let dtTime = this.branch.filter(item => { return item.value === this.masBranchID })
      // console.log('test', JSON.parse(dtTime.map(item => item.allData.setTime)))
      this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
      // console.log('timevailable', this.timeavailable)
    },
    async confirmRemark (item, text) {
      let dt = null
      if (text === 'inAdvance') {
        dt = {
          remarkConfirm1: item.remarkConfirm1,
          LAST_USER: this.session.data.userName
        }
      } else if (text === 'inDay') {
        dt = {
          remarkConfirm2: item.remarkConfirm2,
          LAST_USER: this.session.data.userName
        }
      } else if (text === 'extraJob') {
        dt = {
          fastTrack: (item.extraJob) ? false : item.fastTrack,
          extraJob: item.extraJob,
          LAST_USER: this.session.data.userName
        }
      } else if (text === 'fastTrack') {
        dt = {
          extraJob: (item.fastTrack) ? false : item.extraJob,
          fastTrack: item.fastTrack,
          LAST_USER: this.session.data.userName
        }
      }
      if (dt) {
        await axios
          .post(this.DNS_IP + '/Booking/edit/' + item.bookNo, dt)
          .then(async response => {
            if (this.statusSearch === 'no') {
              await this.getBookingList()
            } else {
              await this.searchAny()
            }
            // this.getTimesChange('update')
            if (this.getSelectText) {
              this.getSelect(this.getSelectText, this.getSelectCount)
            }
            console.log('getSelectText', this.getSelectText, this.getSelectCount)
          })
          .catch(error => {
            console.log('error function addData : ', error)
          })
      }
    },
    exportExcel () {
      let dataExport = []
      this.dataexport = []
      let runNo = 0
      // console.log('bookingData', this.BookingDataListTimechange)
      // console.log('this.editedItemSeleteField', this.editedItemSeleteField)
      // console.log('this.dataItemTimesChange', this.dataItemTimesChange)
      // console.log('this.dataItemTime', this.dataItemTime)
      var datause = this.dataItemTime.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      for (let i = 0; i < datause.length; i++) {
        // var d = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === item.timeDueHtext })[i]
        let d = datause[i]
        let dataSelect = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === d.timeDueHtext && el.fastTrack && (el.statusBtText === 'ยืนยันแล้ว' || el.statusBtText === 'รับรถแล้ว') })
        console.log('s.dataSelect', dataSelect)
        if (dataSelect.length > 0) {
          var datauseSelect = dataSelect.sort((a, b) => {
            if (a.timeDuetext < b.timeDuetext) return -1
            return a.timeDuetext > b.timeDuetext ? 1 : 0
          })

          for (let x = 0; x < datauseSelect.length; x++) {
            runNo++
            let t = datauseSelect[x]
            let s = {}
            // console.log('fastTrack')
            // console.log('s.t', t)
            if (dataExport.filter(el => { return el.timeDueHtext === this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )' }).length === 0) {
              s.timeDueHtext = this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )'
            } else {
              s.timeDueHtext = ''
            }
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(t.flowId) })
            fieldflow.forEach((row) => {
              let tempField = this.BookingDataListTimechange[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
              // serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
              let convertTextField = ''
              if (tempField.length > 0) {
              // console.log('fieldType', row.fieldType)
                if (row.fieldType === 'Selects' || row.fieldType === 'Autocompletes' || row.fieldType === 'Radio') {
                // console.log('optionField', row.optionField)
                // console.log('fieldValue', tempField[0].fieldValue)
                  if (tempField[0].fieldValue) {
                    convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              // console.log('convertTextField', convertTextField)
              serviceDetail += (tempField.length > 0 ? convertTextField + ' ' : '')
            })
            // console.log('fieldflow', fieldflow)
            // let convertTextField = ''
            // if (serviceDetail !== '' && fieldflow.filter(el => { return el.fieldType === 'Selects' || el.fieldType === 'Autocompletes' || el.fieldType === 'Radio' }).length > 0) {
            //   let textField = ''
            //   textField = JSON.parse(fieldflow.filter(el => { return el.fieldType === 'Selects' || el.fieldType === 'Autocompletes' || el.fieldType === 'Radio' })[0].optionField)
            //   convertTextField = textField.filter(el => { return el.value === serviceDetail })
            //   console.log('convertTextField', convertTextField)
            // }
            serviceDetail = serviceDetail.trim() || t.flowName
            console.log('serviceDetail', serviceDetail)

            s.type = 'Fast Track'
            s.runNo = runNo
            s.dateBooking = this.format_dateNotime(this.timeTable)
            s.licenseNo = t.cusReg
            s.title = t.timeDuetext
            s.status = t.statusBtText
            s.remark = t.remark
            s.cusName = t.cusName
            s.cusReg = t.cusReg
            s.flowName = serviceDetail
            s.empFull_NameTH = t.empFull_NameTH
            s.extraJob = t.extraJob ? 'Extra Job' : ''
            s.carModel = this.getDataFromFieldName(this.BookingDataListTimechange[t.bookNo], 'รุ่นรถ')
            s.carModel = (s.carModel.length > 0) ? s.carModel[0].fieldValue : ''
            s.tel = t.tel
            dataExport.push(s)
          }
        }
      }
      let s = {}
      s.type = ''
      s.runNo = ''
      s.licenseNo = ''
      s.title = ''
      s.status = ''
      s.cusName = ''
      s.cusReg = ''
      s.flowName = ''
      s.remark = ''
      s.tel = ''
      s.empFull_NameTH = ''
      s.carModel = ''
      dataExport.push(s)
      runNo = 0
      var datause2 = this.dataItemTime.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      for (let i = 0; i < datause2.length; i++) {
        let d = datause2[i]
        let dataSelect = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === d.timeDueHtext && !el.fastTrack && (el.statusBtText === 'ยืนยันแล้ว' || el.statusBtText === 'รับรถแล้ว') })
        // console.log('s.dataSelect', dataSelect)
        // console.log('this.BookingDataList', this.BookingDataListTimechange)
        if (dataSelect.length > 0) {
          var datauseSelect2 = dataSelect.sort((a, b) => {
            if (a.timeDuetext < b.timeDuetext) return -1
            return a.timeDuetext > b.timeDuetext ? 1 : 0
          })

          for (let x = 0; x < datauseSelect2.length; x++) {
            runNo++
            let t = datauseSelect2[x]
            let s = {}
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(t.flowId) })
            fieldflow.forEach((row) => {
              let tempField = this.BookingDataListTimechange[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
              // serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
              let convertTextField = ''
              if (tempField.length > 0) {
              // console.log('fieldType', row.fieldType)
                if (row.fieldType === 'Selects' || row.fieldType === 'Autocompletes' || row.fieldType === 'Radio') {
                // console.log('optionField', row.optionField)
                // console.log('fieldValue', tempField[0].fieldValue)
                  if (tempField[0].fieldValue) {
                    convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              // console.log('convertTextField', convertTextField)
              serviceDetail += (tempField.length > 0 ? convertTextField + ' ' : '')
            })
            if (dataExport.filter(el => { return el.timeDueHtext === this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )' }).length === 0) {
              s.timeDueHtext = this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )'
            } else {
              s.timeDueHtext = ''
            }
            serviceDetail = serviceDetail.trim() || t.flowName
            s.type = 'ปกติ'
            s.runNo = runNo
            s.dateBooking = this.format_dateNotime(this.timeTable)
            s.licenseNo = t.cusReg
            s.title = t.timeDuetext
            s.status = t.statusBtText
            s.cusName = t.cusName
            s.remark = t.remark
            s.cusReg = t.cusReg
            s.flowName = serviceDetail
            s.tel = t.tel
            s.empFull_NameTH = t.empFull_NameTH
            s.extraJob = t.extraJob ? 'Extra Job' : ''
            s.carModel = this.getDataFromFieldName(this.BookingDataListTimechange[t.bookNo], 'รุ่นรถ')
            s.carModel = (s.carModel.length > 0) ? s.carModel[0].fieldValue : ''
            dataExport.push(s)
          }
        }
      }
      this.dataexport = dataExport
      this.onExport()
      console.log('dataEport', JSON.stringify(dataExport))
    },
    onExport () {
      var dataexport = []
      for (var i = 0; i < this.dataexport.length; i++) {
        var a = this.dataexport[i]
        dataexport.push({
          'ประเภท': a.type,
          'ลำดับ': a.runNo,
          'วันที่': a.dateBooking,
          'เวลา': a.title,
          'ชื่อลูกค้า': a.cusName,
          'รุ่นรถ': a.carModel,
          'ทะเบียน': a.cusReg,
          'รายการซ่อม': a.flowName,
          'เบอร์โทร': a.tel,
          'หมายเหตุ': a.extraJob,
          'เวลาติดตาม': '',
          'เหตุผล': '',
          'ตรง': '',
          'ไม่ตรง': '',
          'เปิดJob': '',
          'พนักงานรับนัดหมาย': a.empFull_NameTH,
          'หมายเหตุเพิ่มเติม': a.remark
        })
      }
      const dataWS = XLSX.utils.json_to_sheet(dataexport)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, dataWS)
      XLSX.writeFile(wb, 'export_' + this.format_dateNotime(this.timeTable) + '.xlsx')
    },
    exportExcelRemove () {
      let dataExport = []
      this.dataexportRemove = []
      let runNo = 0
      var datause = this.dataItemTime.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      for (let i = 0; i < datause.length; i++) {
        // var d = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === item.timeDueHtext })[i]
        let d = datause[i]
        let dataSelect = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === d.timeDueHtext && el.fastTrack && (el.statusBtText === 'ยกเลิก') })
        // console.log('s.dataSelect', dataSelect)
        if (dataSelect.length > 0) {
          var datauseSelect = dataSelect.sort((a, b) => {
            if (a.timeDuetext < b.timeDuetext) return -1
            return a.timeDuetext > b.timeDuetext ? 1 : 0
          })
          for (let x = 0; x < datauseSelect.length; x++) {
            runNo++
            let t = datauseSelect[x]
            let s = {}
            console.log('fastTrack')
            console.log('s.t', t)
            if (dataExport.filter(el => { return el.timeDueHtext === this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )' }).length === 0) {
              s.timeDueHtext = this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )'
            } else {
              s.timeDueHtext = ''
            }
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(t.flowId) })
            fieldflow.forEach((row) => {
              let tempField = this.BookingDataListTimechange[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
              // serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
              let convertTextField = ''
              if (tempField.length > 0) {
                console.log('fieldType', row.fieldType)
                if (row.fieldType === 'Selects' || row.fieldType === 'Autocompletes' || row.fieldType === 'Radio') {
                  console.log('optionField', row.optionField)
                  console.log('fieldValue', tempField[0].fieldValue)
                  if (tempField[0].fieldValue) {
                    convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              console.log('convertTextField', convertTextField)
              serviceDetail += (tempField.length > 0 ? convertTextField + ' ' : '')
            })
            serviceDetail = serviceDetail.trim() || t.flowName
            s.type = 'Fast Track'
            s.runNo = runNo
            s.dateBooking = this.format_dateNotime(this.timeTable)
            s.licenseNo = t.cusReg
            s.remarkRemove = t.remarkRemove
            s.title = t.timeDuetext
            s.status = t.statusBtText
            s.remark = t.remark
            s.cusName = t.cusName
            s.cusReg = t.cusReg
            s.flowName = serviceDetail
            s.empFull_NameTH = t.empFull_NameTH
            s.extraJob = t.extraJob ? 'Extra Job' : ''
            s.tel = t.tel
            s.carModel = this.getDataFromFieldName(this.BookingDataListTimechange[t.bookNo], 'รุ่นรถ')
            s.carModel = (s.carModel.length > 0) ? s.carModel[0].fieldValue : ''
            dataExport.push(s)
          }
        }
      }
      let s = {}
      s.type = ''
      s.runNo = ''
      s.licenseNo = ''
      s.title = ''
      s.status = ''
      s.cusName = ''
      s.cusReg = ''
      s.remarkRemove = ''
      s.tel = ''
      s.remark = ''
      s.empFull_NameTH = ''
      s.carModel = ''
      dataExport.push(s)
      runNo = 0
      var datause2 = this.dataItemTime.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      for (let i = 0; i < datause2.length; i++) {
        let d = datause2[i]
        let dataSelect = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === d.timeDueHtext && !el.fastTrack && (el.statusBtText === 'ยกเลิก') })
        // console.log('s.dataSelect', dataSelect)
        if (dataSelect.length > 0) {
          var datauseSelect2 = dataSelect.sort((a, b) => {
            if (a.timeDuetext < b.timeDuetext) return -1
            return a.timeDuetext > b.timeDuetext ? 1 : 0
          })
          for (let x = 0; x < datauseSelect2.length; x++) {
            runNo++
            let t = datauseSelect2[x]
            let s = {}
            console.log('normal')
            console.log('s.t', t)
            if (dataExport.filter(el => { return el.timeDueHtext === this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )' }).length === 0) {
              s.timeDueHtext = this.format_dateNotime(this.timeTable) + ' ' + d.timeDueHtext + ' ( ' + dataSelect.length.toString() + ' )'
            } else {
              s.timeDueHtext = ''
            }
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(t.flowId) })
            fieldflow.forEach((row) => {
              let tempField = this.BookingDataListTimechange[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
              // serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
              let convertTextField = ''
              if (tempField.length > 0) {
                console.log('fieldType', row.fieldType)
                if (row.fieldType === 'Selects' || row.fieldType === 'Autocompletes' || row.fieldType === 'Radio') {
                  console.log('optionField', row.optionField)
                  console.log('fieldValue', tempField[0].fieldValue)
                  if (tempField[0].fieldValue) {
                    convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              console.log('convertTextField', convertTextField)
              serviceDetail += (tempField.length > 0 ? convertTextField + ' ' : '')
            })
            serviceDetail = serviceDetail.trim() || t.flowName
            s.type = 'ปกติ'
            s.runNo = runNo
            s.dateBooking = this.format_dateNotime(this.timeTable)
            s.licenseNo = t.cusReg
            s.remarkRemove = t.remarkRemove
            s.title = t.timeDuetext
            s.status = t.statusBtText
            s.remark = t.remark
            s.cusName = t.cusName
            s.cusReg = t.cusReg
            s.flowName = serviceDetail
            s.tel = t.tel
            s.empFull_NameTH = t.empFull_NameTH
            s.extraJob = t.extraJob ? 'Extra Job' : ''
            s.carModel = this.getDataFromFieldName(this.BookingDataListTimechange[t.bookNo], 'รุ่นรถ')
            s.carModel = (s.carModel.length > 0) ? s.carModel[0].fieldValue : ''
            dataExport.push(s)
          }
        }
      }
      this.dataexportRemove = dataExport
      this.onExportRemove()
      console.log('dataEportCancel', JSON.stringify(dataExport))
    },
    onExportRemove () {
      var dataexport = []
      for (var i = 0; i < this.dataexportRemove.length; i++) {
        var a = this.dataexportRemove[i]
        dataexport.push({
          'ประเภท': a.type,
          'ลำดับ': a.runNo,
          'วันที่': a.dateBooking,
          'เวลา': a.title,
          'ชื่อลูกค้า': a.cusName,
          'รุ่นรถ': a.carModel,
          'ทะเบียน': a.cusReg,
          'รายการซ่อม': a.flowName,
          'เบอร์โทร': a.tel,
          'หมายเหตุ': a.extraJob,
          'หมายเหตุยกเลิก': a.remarkRemove,
          'เวลาติดตาม': '',
          'เหตุผล': '',
          'ตรง': '',
          'ไม่ตรง': '',
          'เปิดJob': '',
          'พนักงานรับนัดหมาย': a.empFull_NameTH,
          'หมายเหตุเพิ่มเติม': a.remark
        })
      }
      const dataWS = XLSX.utils.json_to_sheet(dataexport)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, dataWS)
      XLSX.writeFile(wb, 'export_cancel_' + this.format_dateNotime(this.timeTable) + '.xlsx')
    },
    toggle () {
      this.timeTable = moment(moment(new Date(), 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
      this.getTimesChange('update')
      this.drawer = !this.drawer
    },
    async getCustomFieldStart () {
      this.editedItemSeleteField = []
      axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
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
              s.showCard = d.showCard
              s.fieldValue = ''
              this.editedItemSeleteField.push(s)
            }
            // console.log('this.editedItemSeleteField', this.editedItemSeleteField)
          }
        })
    },
    validate (Action) {
      switch (Action) {
        case 'ADD':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_add.validate()
          })
          break
        case 'UPDATE':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_update.validate()
          })
          break
        case 'EDIT':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_edit.validate()
          })
          break
        case 'REMOVE':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_remove.validate()
          })
          break
        case 'CHANGE':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_change.validate()
          })
          break
        case 'EXPORT':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_export.validate()
          })
          break

        default:
          break
      }
    },
    async scanQrcode () {
      if (this.$route.query.shopId === this.session.data.shopId) {
        let dt = {
          bookNo: this.$route.query.bookNo
        }
        await axios.get(this.DNS_IP + '/booking_view/getJob?bookNo=' + dt.bookNo).then(async response => {
          let rs = response.data
          console.log('rsJob', rs)
          if (rs.length > 0) {
            await this.getBookingListJob(rs[0])
            this.dialogEdit = true
          } else {
            this.$swal('ผิดพลาด', 'นัดหมายนี้ไม่ได้อยู่ในร้านของคุณ หรือ อยู่ในกระดานการทำงานแล้ว', 'error')
            this.$router.push('/Master/BookingList')
          }
        })
      } else {
        this.$swal('ผิดพลาด', 'นัดหมายนี้ไม่ได้อยู่ในร้านของคุณ', 'error')
        this.$router.push('/Core/Login')
      }
    },
    async getBookingListJob (item) {
      this.dataReady = false
      this.selectedStatus = true
      // this.getSelectText = ''
      this.dataItem = []
      this.countWaiting = 0
      this.countConfirm = 0
      this.countCancel = 0
      this.countJob = 0
      this.countAll = 0
      // Clear ช่องค้นหา
      this.searchAll2 = ''
      // this.dataItemSelect = []
      var dataItemTimes = []
      var dataItems = []
      this.BookingDataList = []
      if (this.branch.length === 0) {
        await this.getDataBranch()
      }
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP +
            '/booking_view/getJob?shopId=' +
            this.session.data.shopId +
            '&bookNo=' +
            item.bookNo
        )
        .then(async response => {
          // console.log('getData', response.data)
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let d = response.data[i]
              let s = {}
              if (dataItems.filter(el => { return el.bookNo === d.bookNo }).length === 0) {
                s.bookNo = d.bookNo
                s.flowId = d.flowId
                s.flowName = d.flowName
                s.dueDate = d.dueDate
                s.shopId = d.shopId
                s.remark = d.remark || ''
                s.masBranchID = d.masBranchID
                s.empSelect = d.empSelect
                s.empFull_NameTH = d.empFull_NameTH || ''
                s.empFull_NameTH = s.empFull_NameTH.replace('นางสาว', '')
                s.empFull_NameTH = s.empFull_NameTH.replace('นาย', '')
                s.empFull_NameTH = s.empFull_NameTH.replace('นาง', '')
                s.userId = d.userId
                s.chkConfirm = false
                s.chkCancel = false
                s.jobNo = d.jobNo
                s.remarkRemove = d.remarkRemove || ''
                s.remarkConfirm1 = (d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True')
                s.remarkConfirm2 = (d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True')
                s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
                s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
                s.lineUserId = d.lineUserId
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
                  default:
                    s.statusBtText = 'รายการนัดหมายใหม่'
                    this.countWaiting = this.countWaiting + 1
                    break
                }
                var chkTime = this.dataItemTime.filter(el => { return el.timeDueHtext === s.timeDueHtext })
                if (chkTime.length === 0) {
                  dataItemTimes.push(s)
                }
                let dataBookingData = []
                await axios
                  .get(
                    // eslint-disable-next-line quotes
                    this.DNS_IP + "/BookingData/getView?bookNo=" + d.bookNo
                  )
                  .then(async responses => {
                    console.log('getDataData', responses.data)
                    dataBookingData = responses.data
                    if (responses.data.status !== false) {
                      responses.data.forEach((row) => {
                        if (typeof (this.BookingDataList[row.bookNo]) === 'undefined') {
                          this.BookingDataList[row.bookNo] = []
                        }
                        this.BookingDataList[row.bookNo].push(row)
                      })
                    }
                    // this.BookingDataList[dataBookingData[0].bookNo].push(dataBookingData[0])
                  })
                s.cusName = dataBookingData.filter(function (el) {
                  return el.fieldName === 'ชื่อ'
                })
                s.cusReg = dataBookingData.filter(function (el) {
                  return el.fieldName === 'เลขทะเบียน'
                })
                s.tel = dataBookingData.filter(function (el) {
                  return el.fieldName === 'เบอร์โทร'
                })
                s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                // s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
                // s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
                // s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
                // s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                // s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                // s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                dataItems.push(s)
              }
            }
          }
          if (dataItems.length === 0 || dataItems.status === false) {
            this.dataItem = []
            this.dataItemTime = []
            this.dataReady = true
            // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
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
              // console.log('chkTimes', chkTimes)
              if (chkTimes.length === 0) {
                // console.log('datause(H)', h)
                this.dataItemTime.push(h)
              }
            }
            this.masBranchID = this.dataItem[0].masBranchID
            console.log('dtTime', this.dataItem[0].masBranchID)
            await this.getBookingData(this.dataItem[0])
            this.checkTimeFlow()
            // this.timeavailable = []
            // console.log('dtTime', this.dataItem[0].masBranchID)
            // let dtTime = this.branch.filter(item => { return item.value === this.dataItem[0].masBranchID })
            // console.log('dtTime', this.dataItem[0].masBranchID)
            // this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
            this.dialogEdit = true
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log(error)
          this.dataReady = true
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
        })
    },
    async getDataFromAPI (url, fieldId, fieldName, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.session.data.shopId}${param}`)
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
    async getDataFlow () {
      this.DataFlowName = await this.getDataFromAPI('/flow/get', 'flowId', 'flowName', '&checkOnsite=True')
    },
    async getDataBranch () {
      // if (localStorage.getItem('BRANCH') === null) {
      //   let temp = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName')
      //   console.log(typeof temp)
      //   localStorage.setItem('BRANCH', JSON.stringify(temp))
      // }
      // this.branch = JSON.parse(localStorage.getItem('BRANCH'))
      this.branch = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName', '')
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
    async updateValuesExport () {
      this.export_data = []
      console.log('dateRange', new Date(this.dateRange.endDate).toISOString().substr(0, 10))
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            this.masBranchIDExport +
            '&dateRange=' + new Date(this.dateRange.startDate).toISOString().substr(0, 10) + '/' + new Date(this.dateRange.endDate).toISOString().substr(0, 10) + '&checkOnsite=True'
        )
        .then(async response => {
          console.log('getData', response.data)
          this.dataReady = true
          var exportdatas = []
          for (let i = 0; i < response.data.length; i++) {
            let d = response.data[i]
            let s = {}
            s.bookNo = d.bookNo
            s.masBranchName = d.masBranchName
            s.statusUseBt = d.statusUseBt || 'booking'
            s.CREATE_DATE = d.CREATE_DATE
            s.LAST_DATE = d.LAST_DATE
            s.flowName = d.flowName
            s.dueDate = d.dueDate
            s.chkConfirm = false
            s.chkCancel = false
            if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
              s.chkConfirm = true
              s.chkCancel = false
            } else if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
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
                s.statusBtText = 'รอโทรยืนยัน'
                break
            }
            let dataBookingData = []
            await axios
              .get(
                this.DNS_IP + `/BookingData/getView?bookNo=${d.bookNo}`
              )
              .then(async responses => {
                dataBookingData = responses.data
              })
            s.cusName = this.getDataFromFieldName(dataBookingData, 'ชื่อ')
            s.cusReg = this.getDataFromFieldName(dataBookingData, 'เลขทะเบียน')
            s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
            s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
            exportdatas.push(s)
          }
          this.export_data = exportdatas
          // if (exportdatas.length === 0 || exportdatas.status === false) {
          //   this.export_data = []
          //   // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          // } else {
          //   // this.dataReady = true
          //   this.export_data = exportdatas
          // }
        }).catch(error => {
          console.log(error)
          this.dataReady = true
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
        })
    },
    getSelect (text, count) {
      this.selectedStatus = true
      this.getSelectText = text
      this.getSelectCount = count || 0
      this.dataItemSelect = []
      this.dataItemTimesChange = []
      this.columnsSelected = []
      console.log('text', text)
      // if (count > 0) {
      if (text === 'all') {
        // this.dataItemSelect = this.dataItem
        if (this.dataItem.length > 0) {
          for (let x = 0; x < this.dataItem.length; x++) {
            let t = this.dataItem[x]
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(t.flowId) })
            // fieldflow.forEach((row) => {
            //   let tempField = this.BookingDataList[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
            //   serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
            // })
            fieldflow.forEach((row) => {
              let tempField = this.BookingDataList[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
              let convertTextField = ''
              if (tempField.length > 0) {
                if (row.fieldType === 'Selects' || row.fieldType === 'Autocompletes' || row.fieldType === 'Radio') {
                  if (tempField[0].fieldValue) {
                    convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              serviceDetail += (tempField.length > 0 ? convertTextField + ' ' : '')
            })
            serviceDetail = serviceDetail.trim() || t.flowName
            t.flowNameShow = serviceDetail
            this.dataItemSelect.push(t)
          }
        } else {
          this.dataItemSelect = []
        }
        console.log('dataSelect', this.dataItemSelect)
        this.columnsSelected = [{ text: 'จัดการ', value: 'action', sortable: false, align: 'center' },
          // { text: 'Booking Id', value: 'bookNo' },
          { text: 'วันและเวลานัดหมาย', value: 'dueDateText' },
          // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
          { text: 'ชื่อบริการ', value: 'flowNameShow' },
          { text: 'ชื่อลูกค้า', value: 'cusName' },
          { text: 'เบอร์โทร', value: 'tel' },
          { text: 'ทะเบียนรถ', value: 'cusReg' },
          // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
          { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' },
          { text: 'หมายเหตุที่ยกเลิก', value: 'remarkRemove', sortable: false, align: 'center' },
          { text: 'ชื่อพนักงาน', value: 'empFull_NameTH', align: 'center' },
          { text: 'หมายเหตุเพิ่มเติม', value: 'remark', align: 'center' }
          // { text: 'คุณสมบัติเพิ่มเตืม', value: 'action3', sortable: false, align: 'center' },
          // { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' }
          // { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
        ]
      } else {
        var dataSelect = this.dataItem.filter(el => { return el.statusBt === text })
        // console.log('fieldflow', dataSelect)
        if (dataSelect.length > 0) {
          for (let x = 0; x < dataSelect.length; x++) {
            let t = dataSelect[x]
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(t.flowId) })
            // fieldflow.forEach((row) => {
            //   let tempField = this.BookingDataList[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
            //   serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
            // })
            // console.log('fieldflow1', fieldflow)
            // console.log('this.BookingDataList', this.BookingDataList)
            if (fieldflow.length > 0) {
              fieldflow.forEach((row) => {
                // console.log('this.BookingDataList[t.bookNo]', this.BookingDataList[t.bookNo])
                // console.log('[t.bookNo]', t.bookNo)
                let tempField = []
                if (this.BookingDataList[t.bookNo] !== undefined) {
                  tempField = this.BookingDataList[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
                } else {
                  tempField = []
                }
                // console.log('tempField', tempField)
                // console.log('fieldType', row.fieldType)
                let convertTextField = ''
                if (tempField.length > 0) {
                  if (row.fieldType === 'Selects' || row.fieldType === 'Autocompletes' || row.fieldType === 'Radio') {
                    if (tempField[0].fieldValue) {
                      convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                    } else {
                      convertTextField = tempField[0].fieldValue || ''
                    }
                  } else {
                    convertTextField = tempField[0].fieldValue || ''
                  }
                }
                serviceDetail += (tempField.length > 0 ? convertTextField + ' ' : '')
              })
            }
            serviceDetail = serviceDetail.trim() || t.flowName
            t.flowNameShow = serviceDetail
            this.dataItemSelect.push(t)
          }
        } else {
          this.dataItemSelect = []
        }
        // console.log('dataSelect', this.dataItemSelect)
        if (text === 'cancel') {
          this.columnsSelected = [{ text: 'จัดการ', value: 'action', sortable: false, align: 'center' },
            // { text: 'Booking Id', value: 'bookNo' },
            { text: 'วันและเวลานัดหมาย', value: 'dueDateText' },
            // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
            { text: 'ชื่อบริการ', value: 'flowNameShow' },
            { text: 'ชื่อลูกค้า', value: 'cusName' },
            { text: 'เบอร์โทร', value: 'tel' },
            { text: 'ทะเบียนรถ', value: 'cusReg' },
            { text: 'หมายเหตุที่ยกเลิก', value: 'remarkRemove', sortable: false, align: 'center' },
            { text: 'ชื่อพนักงาน', value: 'empFull_NameTH', align: 'center' },
            { text: 'หมายเหตุเพิ่มเติม', value: 'remark', align: 'center' }
            // { text: 'คุณสมบัติเพิ่มเตืม', value: 'action3', sortable: false, align: 'center' },
            // { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' }
            // { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
          ]
        } else if (text === 'confirm') {
          this.columnsSelected = [{ text: 'จัดการ', value: 'action', sortable: false, align: 'center' },
            // { text: 'Booking Id', value: 'bookNo' },
            { text: 'วันและเวลานัดหมาย', value: 'dueDateText' },
            // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
            { text: 'ชื่อบริการ', value: 'flowNameShow' },
            { text: 'ชื่อลูกค้า', value: 'cusName' },
            { text: 'เบอร์โทร', value: 'tel' },
            { text: 'ทะเบียนรถ', value: 'cusReg' },
            // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
            { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' },
            { text: 'ชื่อพนักงาน', value: 'empFull_NameTH', align: 'center' },
            { text: 'หมายเหตุเพิ่มเติม', value: 'remark', align: 'center' }]
        } else {
          this.columnsSelected = [{ text: 'จัดการ', value: 'action', sortable: false, align: 'center' },
            // { text: 'Booking Id', value: 'bookNo' },
            { text: 'วันและเวลานัดหมาย', value: 'dueDateText' },
            // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
            { text: 'ชื่อบริการ', value: 'flowNameShow' },
            { text: 'ชื่อลูกค้า', value: 'cusName' },
            { text: 'เบอร์โทร', value: 'tel' },
            { text: 'ทะเบียนรถ', value: 'cusReg' },
            // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
            { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' },
            { text: 'หมายเหตุเพิ่มเติม', value: 'remark', align: 'center' }]
        }
      }
      // }
    },
    updateTimeTablefromChild (timeTable) {
      this.timeTable = timeTable
    },
    async getTimesChange (text) {
      try {
        this.dataItemTimesChange = []
        this.dataRemoveExport = []
        // console.log('this.dataItem', this.dataItem.filter(el => { return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable }))
        if (text === 'all') {
          this.dataItemTimesChange = this.dataItem
          this.dataRemoveExport = this.dataItemTimesChange.filter(el => { return el.statusBt === 'cancel' })
          this.BookingDataListTimechange = this.BookingDataList
        } else {
          // if (moment(moment(this.timeTable, 'YYYY-MM').toDate()).format('YYYY-MM') === this.dateStart) {
          //   console.log('month old')
          //   this.dataItemTimesChange = this.dataItem.filter(el => {
          //     let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
          //     return dueDate === this.timeTable
          //   // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
          //   }).sort((a, b) => {
          //     if (a.timeDuetext < b.timeDuetext) return -1
          //     return a.timeDuetext > b.timeDuetext ? 1 : 0
          //   })
          //   this.BookingDataListTimechange = this.BookingDataList
          // }
          // } else {
          //   var data = this.dataItemCheck.filter(el => {
          //     let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
          //     return dueDate === this.timeTable
          //   // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
          //   })
          //   console.log('data', data)
          //   if (data.length === 0) {
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
          if (this.timeTable !== '') {
            var dateStart = moment(moment(this.timeTable, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
            console.log('dateStartxx', dateStart)
            console.log('timeTable', this.timeTable)
            await this.getBookingDataListTimechange(dateStart)

            // var dataItemTimes = []
            await axios
              .get(
                // eslint-disable-next-line quotes
                this.DNS_IP +
                    '/booking_view/get?shopId=' +
                    this.session.data.shopId +
                    '&masBranchID=' +
                    this.masBranchID +
                    '&dueDate=' + moment(moment(this.timeTable, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD') + '&checkOnsite=True'
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
                    s.remarkRemove = d.remarkRemove
                    s.remark = d.remark
                    s.userId = d.userId
                    s.chkConfirm = false
                    s.chkCancel = false
                    s.jobNo = d.jobNo
                    s.empFull_NameTH = d.empFull_NameTH
                    s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
                    s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
                    s.remarkRemove = d.remarkRemove || ''
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
                    // let dataBookingData = []
                    // await axios
                    //   .get(
                    //     this.DNS_IP + `/BookingData/getView?bookNo=${d.bookNo}`
                    //   )
                    //   .then(async responses => {
                    //     dataBookingData = responses.data
                    //   })
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
                  // console.log('month new if')
                  console.log('month new if', dataItems)
                  this.dataItemCheck = dataItems
                  this.dataItemTimesChange = this.dataItemCheck.sort((a, b) => {
                    if (a.timeDuetext < b.timeDuetext) return -1
                    return a.timeDuetext > b.timeDuetext ? 1 : 0
                  })
                  // this.dataItemTimesChange = this.dataItemCheck.filter(el => {
                  //   let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
                  //   return dueDate === this.timeTable
                  //   // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
                  // }).sort((a, b) => {
                  //   if (a.timeDuetext < b.timeDuetext) return -1
                  //   return a.timeDuetext > b.timeDuetext ? 1 : 0
                  // })
                  this.dataRemoveExport = this.dataItemTimesChange.filter(el => { return el.statusBt === 'cancel' })
                  // console.log('this.dataRemoveExport', this.dataRemoveExport)
                }
              })
          }
          // } else {
          //   console.log('month new else')
          //   this.dataItemTimesChange = this.dataItemCheck.filter(el => {
          //     let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
          //     return dueDate === this.timeTable
          //     // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
          //   }).sort((a, b) => {
          //     if (a.timeDuetext < b.timeDuetext) return -1
          //     return a.timeDuetext > b.timeDuetext ? 1 : 0
          //   })
          // }
        }
        // this.dataRemoveExport = this.dataItemTimesChange.filter(el => { return el.statusBt === 'cancel' })
        // console.log('this.dataRemoveExport', this.dataRemoveExport)
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
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.session.data.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
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
    async getBookingDataList (dateStart, searchOther) {
      console.log('dateStart', dateStart)
      this.BookingDataList = []
      if (this.masBranchID) {
        this.masBranchID = this.masBranchID
      } else {
        if (this.branch.length > 0) {
          this.masBranchID = this.branch[0].value
        } else {
          this.masBranchID = ''
        }
      }
      let url = ''
      if (dateStart === 'no') {
        url = `${this.DNS_IP}/BookingData/getsearchOther?shopId=${this.session.data.shopId}&fieldValue=${searchOther}`
      } else {
        url = `${this.DNS_IP}/BookingData/getView?shopId=${this.session.data.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
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
        })
      console.log('this.BookingDataList1', this.BookingDataList)
    },
    async getBookingList () {
      // Clear Data ทุกครั้ง
      // this.setTimer = setInterval(this.getDataDefault(), 100000)
      // console.log('this.masBranchID1', this.masBranchID)
      // console.log('this.setTimer', this.setTimer)

      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null

      if (this.masBranchID) {
        this.masBranchID = this.masBranchID
      } else {
        if (this.branch.length > 0) {
          this.masBranchID = this.branch[0].value
        } else {
          this.masBranchID = ''
        }
      }
      // this.dataReady = false
      this.selectedStatus = true
      // this.getSelectText = ''
      this.dataItem = []
      this.countWaiting = 0
      this.countConfirm = 0
      this.countCancel = 0
      this.countJob = 0
      this.countAll = 0
      // Clear ช่องค้นหา
      this.searchAll2 = ''
      var dataItemTimes = []
      var dataItems = []
      // await this.getShowMap()
      await this.getBookingDataList(this.dateStart)
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&dueDate=' +
            this.dateStart +
            '&checkOnsite=True'
        )
        .then(async response => {
          // console.log('getData', response.data)
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let d = response.data[i]
              let s = {}
              if (this.BookingDataList[d.bookNo] !== undefined) {
                s.bookNo = d.bookNo
                s.flowId = d.flowId
                s.flowName = d.flowName
                s.dueDate = d.dueDate
                if (d.timeText === null || d.timeText === '') {
                  d.timeText = d.timeDue
                }
                s.dueDateText = this.format_dateNotime(d.dueDate) + ' ' + d.timeText
                s.shopId = d.shopId
                s.remark = d.remark || ''
                s.masBranchID = d.masBranchID
                s.empSelect = d.empSelect
                s.empFull_NameTH = d.empFull_NameTH || ''
                s.empFull_NameTH = s.empFull_NameTH.replace('นางสาว', '')
                s.empFull_NameTH = s.empFull_NameTH.replace('นาย', '')
                s.empFull_NameTH = s.empFull_NameTH.replace('นาง', '')
                s.userId = d.userId
                s.chkConfirm = false
                s.chkCancel = false
                s.address = d.address
                s.packageId = d.packageId
                s.addressLatLong = d.addressLatLong
                s.jobNo = d.jobNo
                s.timeText = d.timeText
                s.remarkRemove = d.remarkRemove || ''
                s.remarkConfirm1 = (d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True')
                s.remarkConfirm2 = (d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True')
                s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
                s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
                s.lineUserId = d.lineUserId
                s.timeDueHtext = d.timeDueH + ':00'
                s.timeDuetext = d.timeDue
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
                  // default:
                  //   s.statusBtText = 'รายการนัดหมายใหม่'
                  //   this.countWaiting = this.countWaiting + 1
                  //   break
                }
                var chkTime = this.dataItemTime.filter(el => { return el.timeDueHtext === s.timeDueHtext })
                if (chkTime.length === 0) {
                  dataItemTimes.push(s)
                }
                s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
                s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
                s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
                s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                if (s.statusBt !== 'wait') {
                  dataItems.push(s)
                }
              } else {
                console.log('BookingNo no bookingData', d.bookNo)
              }
            }
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log(error)
          this.dataReady = true
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
        })
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.session.data.shopId}&masBranchID=${this.masBranchID}&statusBt=is null`
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
        })
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP +
                '/booking_view/get?shopId=' +
                this.session.data.shopId +
                '&masBranchID=' +
                this.masBranchID +
                '&statusBt=null&checkOnsite=True'
        )
        .then(async responses => {
          if (responses.data.length > 0) {
            for (let i = 0; i < responses.data.length; i++) {
              let d = responses.data[i]
              let s = {}
              if (this.BookingDataList[d.bookNo] !== undefined) {
                s.bookNo = d.bookNo
                s.flowId = d.flowId
                s.flowName = d.flowName
                s.dueDate = d.dueDate
                if (d.timeText === null || d.timeText === '') {
                  d.timeText = d.timeDue
                }
                s.dueDateText = this.format_dateNotime(d.dueDate) + ' ' + d.timeText
                s.shopId = d.shopId
                s.remark = d.remark || ''
                s.masBranchID = d.masBranchID
                s.empSelect = d.empSelect
                s.empFull_NameTH = d.empFull_NameTH || ''
                s.empFull_NameTH = s.empFull_NameTH.replace('นางสาว', '')
                s.empFull_NameTH = s.empFull_NameTH.replace('นาย', '')
                s.empFull_NameTH = s.empFull_NameTH.replace('นาง', '')
                s.userId = d.userId
                s.chkConfirm = false
                s.chkCancel = false
                s.address = d.address
                s.packageId = d.packageId
                s.addressLatLong = d.addressLatLong
                s.jobNo = d.jobNo
                s.timeText = d.timeText
                s.remarkRemove = d.remarkRemove || ''
                s.remarkConfirm1 = (d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True')
                s.remarkConfirm2 = (d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True')
                s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
                s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
                s.lineUserId = d.lineUserId
                s.timeDueHtext = d.timeDueH + ':00'
                s.timeDuetext = d.timeDue
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
                s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
                s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
                s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
                s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                dataItems.push(s)
              } else {
                console.log('BookingNo no bookingData', d.bookNo)
              }
            }
          }
        })
      if (dataItems.length === 0 || dataItems.status === false) {
        this.dataItem = []
        this.dataItemTime = []
        // await this.getTimesChange('update')
        if (this.getSelectText) {
          this.getSelect(this.getSelectText, 0)
        } else {
          this.getSelect('wait', this.countWaiting)
        }
        this.dataReady = true
        // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
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
          // console.log('chkTimes', chkTimes)
          if (chkTimes.length === 0) {
            console.log('datause(H)', h)
            this.dataItemTime.push(h)
          }
        }
        // this.dataItemTime = dataItemTimes.sort((a, b) => {
        //   if (a.timeDueHtext < b.timeDueHtext) return -1
        //   return a.timeDueHtext > b.timeDueHtext ? 1 : 0
        // })
        console.log('dataItemTime', this.dataItemTime)
        // await this.getTimesChange('update')
        if (this.getSelectText) {
          this.getSelect(this.getSelectText, 0)
        } else {
          this.getSelect('wait', this.countWaiting)
        }
        this.dataReady = true
      }
    },
    async getBookingField () {
      // this.bookingField = []
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
            }).catch((error) => {
              console.log('error function addData : ', error)
              this.dialogAdd = false
            })
          }
        })
        .catch(error => {
          this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
            this.dialogAdd = false
          }).catch((error) => {
            console.log('error function addData : ', error)
            this.dialogAdd = false
          })
          console.log('error function addData : ', error)
        })
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
            // data2.push({'indexC': indexC, 'indexF': indexF})
            }
          // setTimeout(() => this.validate('ADD'), 500)
          } else {
            this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
              this.dialogAdd = false
            }).catch((error) => {
              console.log('error function addData : ', error)
              this.dialogAdd = false
            })
          }
        })
        .catch(error => {
          this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
            this.dialogAdd = false
          }).catch((error) => {
            console.log('error function addData : ', error)
            this.dialogAdd = false
          })
          console.log('error function addData : ', error)
        })
    },
    async getflowfield (item) {
      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP +
            '/flowField/get?flowId=' +
            item.flowId +
            '&shopId=' +
            this.session.data.shopId
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
          let sortrs = rs.sort((a, b) => a.sortNoField - b.sortNoField)
          for (var i = 0; i < sortrs.length; i++) {
            let d = sortrs[i]
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
          var data1 = flowfieldNameitems.filter(el => parseInt(el.conditionField || 0) > 0)
          // var data2 = []
          for (let i = 0; i < data1.length; i++) {
            let d = data1[i]
            let indexC = flowfieldNameitems.findIndex(function (o) {
              return o.fieldId === d.fieldId
            })
            let indexF = flowfieldNameitems.findIndex(function (o) {
              return o.fieldId === parseInt(d.conditionField)
            })
            flowfieldNameitems.splice((indexF + 1), 0, flowfieldNameitems.splice(indexC, 1)[0])
            // data2.push({'indexC': indexC, 'indexF': indexF})
          }
          // console.log('data1', data1)
          // console.log('data2', data2)
          for (var x = 0; x < flowfieldNameitems.length; x++) {
            var s = flowfieldNameitems[x]
            var chk = this.BookingDataItem.filter(el => { return parseInt(el.fieldId) === s.fieldId })
            // console.log('cccxxx', s)
            // console.log('chk', chk)
            if (chk.length === 0) {
              this.flowfieldNameitem.push(s)
            }
          }
          // console.log('flowfieldNameitems', this.flowfieldNameitem)
          // console.log('flowfieldNameitems', flowfieldNameitems)
          // console.log('BookingDataItem', this.BookingDataItem)
          // setTimeout(() => this.validate('ADD'), 500)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    addData () {
      this.loadingAdd = true
      this.validate('ADD')
      setTimeout(() => this.addDataSubmit(), 500)
    },
    addDataInsert () {
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
        let rs = this.fieldNameItem
        let Add = []
        let fielditem = this.fieldNameItem
        console.log('this.fieldNameItem', this.fieldNameItem)
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
            update.dueDate = this.date + ' ' + this.time.value
            update.timeText = this.time.text
            update.userId = 'user-skip'
            update.pageName = 'BookingList'
            update.sourceLink = 'direct'
            update.fastTrack = fastTrack
            update.extraJob = extraJob
            update.empSelect = this.empSelectAdd
            update.adminLogin = this.session.data.userName
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
                update.dueDate = this.date + ' ' + this.time.value
                update.timeText = this.time.text
                update.sourceLink = 'direct'
                update.userId = 'user-skip'
                update.pageName = 'BookingList'
                update.fastTrack = fastTrack
                update.extraJob = extraJob
                update.empSelect = this.empSelectAdd
                update.adminLogin = this.session.data.userName
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
                update.dueDate = this.date + ' ' + this.time.value
                update.timeText = this.time.text
                update.sourceLink = 'direct'
                update.userId = 'user-skip'
                update.pageName = 'BookingList'
                update.fastTrack = fastTrack
                update.extraJob = extraJob
                update.empSelect = this.empSelectAdd
                update.adminLogin = this.session.data.userName
                Add.push(update)
              }
            }
          }
        }
        console.log('Add', Add)
        axios
          .post(this.DNS_IP + '/Booking/add', Add)
          .then(async response => {
            this.clearDataAdd()
            this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
            // await this.confirmChkAdd(response.data)
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
    async addDataSubmit () {
      if (this.validAdd === true) {
        if (this.$session.id() !== undefined) {
          let checkDupliRegNo = this.fieldNameItem.filter(el => { return el.fieldName === 'เลขทะเบียน' })
          if (checkDupliRegNo.length > 0) {
            console.log('checkDupliRegNo', checkDupliRegNo[0].fieldValue.replace(/ /g, ''))
            await axios
              .get(this.DNS_IP + '/booking_view/getSearchDuplicate?shopId=' + this.session.data.shopId + '&fieldValue=' + checkDupliRegNo[0].fieldValue.replace(/ /g, '') +
            '&flowId=' + this.formAdd.flowId + '&dueDate=' + this.date + '&statusBt=noCancel' + '&checkOnsite=True')
              .then(response => {
                let rs = response.data
                if (rs.status === false) {
                // this.addDataInsert()
                  this.dialogAddCon = true
                } else {
                  var dateEdit = this.format_dateNotime(this.date)
                  this.textError = 'เลขทะเบียนนี้ วันที่ ' + dateEdit + ' ได้ทำรายการนัดหมายไปแล้ว'
                  this.dialogError = true
                  this.loadingAdd = false
                }
              }).catch(error => {
                console.log('error function addData : ', error)
                setTimeout(() => this.addDataSubmit(), 3000)
              })
          } else {
            this.dialogAddCon = true
          }
        } else {
          this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
          clearInterval(this.setTimerCalendar)
          this.setTimerCalendar = null
          this.$router.push('/Core/Login')
        }
      } else {
        this.loadingAdd = false
      }
    },
    async pushMsglineGroup (bookNo) {
      await axios
        .post(this.DNS_IP + '/Booking/pushMsgLineGroup/' + bookNo)
        .then(response => {
          this.clearData()
        })
    },
    // async confirmChkAdd (item) {
    //   console.log('item', item)
    //   var dt = {
    //     bookNo: item.bookNo,
    //     contactDate: this.format_date(new Date()),
    //     status: 'confirm',
    //     statusUse: 'use',
    //     shopId: this.$session.getAll().data.shopId,
    //     CREATE_USER: this.session.data.userName,
    //     LAST_USER: this.session.data.userName
    //   }
    //   await axios
    //     .post(this.DNS_IP + '/booking_transaction/add', dt)
    //     .then(async response => {
    //       this.getDataCalendaBooking()
    //       this.clearDataAdd()
    //       this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
    //       // await this.getBookingList()
    //       // this.getTimesChange('update')
    //     })
    //     .catch(error => {
    //       console.log('error function addData : ', error)
    //       setTimeout(() => this.confirmChkAdd(), 3000)
    //     })
    // },
    async clearDataAdd () {
      this.dataReady = false
      if (this.statusSearch === 'no') {
        await this.getBookingList()
      } else {
        await this.searchAny()
      }
      // this.getTimesChange('update')
      if (this.getSelectText) {
        this.getSelect(this.getSelectText, this.getSelectCount)
      }
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
      this.getDataCalendaBooking()
      // this.countWaiting = 0
      // this.countConfirm = 0
      // this.countCancel = 0
      // this.countJob = 0
      // this.countAll = 0
      this.date = ''
      this.time = ''
      this.empSelectAdd = ''
      this.remark = ''
      // this.fieldNameItem = []
      this.formAdd.radiosRemark = ''
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
      this.dataReadyAdd = true
    },
    async getDataById (dt) {
      console.log('dt', dt)
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/getID?bookNo=" + dt.bookNo
        )
        .then(async response => {
          this.dataReady = true
          if (response.data) {
            Object.assign(this.formUpdate, response.data)
            delete this.formUpdate['RECORD_STATUS']
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.dataReady = true
          console.log('error function getDataById : ', error)
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
        })
    },
    async deleteData () {
      this.swalConfig.title = 'ต้องการ ลบข้อมูล ใช่หรือไม่?'
      this.$swal(this.swalConfig)
        .then(async result => {
          this.formUpdate.LAST_USER = this.$session.getAll().data.userName
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/Booking/delete/" + this.formUpdate.bookNo,
              this.formUpdate
            )
            .then(async response => {
              // Debug response
              console.log('DNS_IP + PATH + "delete/"', response)

              this.$swal('เรียบร้อย', 'ลบข้อมูลเรียบร้อย', 'success')
              // Close Dialog

              // Load Data
              if (this.statusSearch === 'no') {
                await this.getBookingList()
              } else {
                await this.searchAny()
              }
              // this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(this.getSelectText, this.getSelectCount)
              }
              this.getDataCalendaBooking()
              this.dialogDelete = false
            })
            // eslint-disable-next-line handle-callback-err
            .catch(error => {
              this.dataReady = true
              this.$swal('ผิดพลาด', 'ผิดพลาด -1', 'error')
              console.log('error function deleteDataGlobal : ', error)
              //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
            })
        })
        .catch(error => {
          this.dataReady = true
          this.$swal('ผิดพลาด', 'ผิดพลาด -2', 'error')
          console.log('error function deleteDataGlobal : ', error)
        })
    },
    async getBookingDataJob (dt, text) {
      console.log('itemBookingData', dt)
      this.lineUserId = dt.lineUserId
      this.dueDateText = dt.dueDateText
      this.jobNo = dt.jobNo
      this.checkTimeFlow()
      this.BookingDataItem = []
      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
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
                      let sortrs = rs1.sort((a, b) => a.sortNoField - b.sortNoField)
                      for (var i = 0; i < sortrs.length; i++) {
                        var d = sortrs[i]
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
                      this.dataEditJobReady = true
                    }
                  })
              })
          }
        })
    },
    async getBookingData (dt, text) {
      this.BookingDataItem = []
      await axios
        .get(this.DNS_IP + '/BookingDataSelect/get?bookNo=' + dt.bookNo)
        .then(async response => {
          let rs = response.data
          console.log('BookingDataSelect', rs)
          if (response.data) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              if (d.userId === 'user-skip') {
                d.userId = ''
              }
              d.shopId = this.session.data.shopId
              d.userName = this.$session.getAll().data.userName
              this.BookingDataItem.push(d)
            }
            if (text === 'qrcode') {
              this.dataQrcode = dt
            }
            // await this.getBookingField()
            await this.getflowfield(dt)
          }
        })
    },
    async confirmChk (item) {
      this.getEmpSelectAddBooking()
      this.empSelectAdd = parseInt(item.empSelect || 0)
      this.dialogConfirm = true
      this.dataConfirmReady = false
      console.log('confirmChkItem', item)
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
    addDataJob () {
      console.log('this.StatusPackage', this.StatusPackage)
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
            this.tokenKey = ''
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
                  let statusCoin = ''
                  if (response.data.status) {
                    if (this.packageId !== '' && this.productExchangeRateId === '') {
                      await this.usePackage()
                    } else if (this.packageId === '' && this.productExchangeRateId !== '') {
                      if (this.lineUserId !== '') {
                        if (this.totalPrice !== '') {
                          await this.useCoin(this.totalPrice)
                          statusCoin = 'use'
                        }
                      }
                    } else if (this.packageId !== '' && this.productExchangeRateId !== '') {
                      if (this.lineUserId !== '') {
                        if (this.totalPrice !== '') {
                          await this.useCoin(this.totalPrice)
                          statusCoin = 'use'
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
                      remark: this.remark,
                      packageId: this.packageId || ''
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
                          CREATE_USER: this.session.data.userName,
                          LAST_USER: this.session.data.userName
                        }
                        axios
                          .post(this.DNS_IP + '/booking_transaction/add', dtt)
                          .then(async response => {
                            this.$swal('เรียบร้อย', 'นำเข้าสำเร็จ', 'success')
                            if (this.lineUserId !== '') {
                              this.pushMsgCustomer(this.BookingDataItem[0].bookNo, statusCoin)
                              if (this.statusSearch === 'no') {
                                await this.getBookingList()
                              } else {
                                await this.searchAny()
                              }
                            } else {
                              if (this.statusSearch === 'no') {
                                await this.getBookingList()
                              } else {
                                await this.searchAny()
                              }
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
                            this.dialogConfirm = false
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
            this.dialogConfirm = false
            if (this.statusSearch === 'no') {
              await this.getBookingList()
            } else {
              await this.searchAny()
            }
            // this.getTimesChange('update')
            if (this.getSelectText) {
              this.getSelect(this.getSelectText, this.getSelectCount)
            }
          }).catch(error => {
            console.log('error function addData : ', error)
            this.dialogConfirm = false
            if (this.statusSearch === 'no') {
              this.getBookingList()
            } else {
              this.searchAny()
            }
            // this.getTimesChange('update')
            if (this.getSelectText) {
              this.getSelect(this.getSelectText, this.getSelectCount)
            }
          })
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async pushMsgCustomer (bookNo, statusCoin) {
      let updateStatusSend = {}
      if (statusCoin === 'use') {
        updateStatusSend = {
          updateStatusSend: 'false',
          statusCoin: 'use',
          tokenKey: this.tokenKey
        }
      } else {
        updateStatusSend = {
          updateStatusSend: 'false',
          statusCoin: 'no'
        }
      }
      await axios
        .post(this.DNS_IP + '/BookingOnsite/pushMsgCustomer/' + bookNo, updateStatusSend)
        .then(async response => {})
    },
    async checkEmpJob () {
      this.today = this.dateStart + '-15'
      const dateSplit = this.today.split('-')
      const year = String(dateSplit[0])
      const month = String(dateSplit[1])
      var flowId = ''
      if (this.flowId !== '') {
        flowId = this.flowId
      } else {
        flowId = this.BookingDataItem[0].flowId
      }
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
      var flowId = ''
      if (this.flowId !== '') {
        flowId = this.flowId
      } else {
        flowId = this.BookingDataItem[0].flowId
      }
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
    addEmpJob () {
      this.validate('UPDATE')
      console.log('this.empSelectJob', this.empSelectJob)
      console.log('this.BookingDataItem[0]', this.BookingDataItem[0])
      setTimeout(() => this.addEmpJobSubmit(), 500)
    },
    async addEmpJobSubmit () {
      console.log('this.BookingDataItem[0]', this.BookingDataItem[0])
      if (this.$session.id() !== undefined) {
        if (this.validUpdate === true) {
          this.dataEditJobReady = false
          var updateJob = {
            empStep: this.empSelectJob,
            userId: this.BookingDataItem[0].userId,
            LAST_USER: this.$session.getAll().data.userName
          }
          console.log('updateJobNo', updateJob)
          await axios
            .post(this.DNS_IP + '/job/updateJobNo/' + this.jobNo, updateJob)
            .then(async response => {
              var dt = {
                bookNo: this.BookingDataItem[0].bookNo,
                statusJob: 'job'
              }
              console.log('editStatus', dt)
              await axios
                .post(
                  this.DNS_IP +
                    '/Booking/editStatus/' +
                    this.BookingDataItem[0].bookNo,
                  dt
                )
                .then(async response1 => {
                  var dtt = {
                    bookNo: this.BookingDataItem[0].bookNo,
                    contactDate: this.format_date(new Date()),
                    status: 'confirmJob',
                    statusUse: 'use',
                    shopId: this.$session.getAll().data.shopId,
                    CREATE_USER: this.session.data.userName,
                    LAST_USER: this.session.data.userName
                  }
                  await axios
                    .post(this.DNS_IP + '/booking_transaction/add', dtt)
                    .then(async response => {
                      this.$swal('เรียบร้อย', 'มอบหมายงานให้พนักงาน Onsite เรียบร้อย', 'success')
                      this.empSelectJob = ''
                      this.lineNotifyGroupOnsite(this.BookingDataItem[0].bookNo)
                      if (this.statusSearch === 'no') {
                        await this.getBookingList()
                      } else {
                        await this.searchAny()
                      }
                      this.dialogEdit = false
                      this.dataEditJobReady = true
                    })
                })
            }).catch(error => {
              setTimeout(() => this.addEmpJobSubmit(), 3000)
              console.log('error function updateJobNo : ', error)
            })
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async lineNotifyGroupOnsite (bookNo) {
      await axios
        .post(this.DNS_IP + '/Booking/LineNotifyGroupOnsite/' + bookNo)
        .then(async response => {
          if (this.lineUserId !== '') {
            var dt = {
              updateStatusSend: 'false'
            }
            await axios
              .post(this.DNS_IP + '/BookingOnsite/pushEmpCustomer/' + bookNo, dt)
              .then(async response1 => {})
          }
        })
    },
    // async pushMsg (jobNo) {
    //   const result = await axios
    //     .get(
    //       this.DNS_IP +
    //         '/member/get?shopId=' +
    //         this.session.data.shopId +
    //         '&liffUserId=' +
    //         this.BookingDataItem[0].userId
    //     )
    //     .catch(error => {
    //       console.log('error function addData : ', error)
    //     })
    //   console.log('result', result.data.status)
    //   if (result.data.status === false) {
    //     let statusSend = {
    //       statusSend: 'false'
    //     }
    //     await axios.post(this.DNS_IP + '/job/updateJobNo/' + jobNo, statusSend)
    //     console.log('statusSend', 'false')
    //     let updateStatusSend = {
    //       updateStatusSend: 'false'
    //     }
    //     await axios
    //       .post(
    //         this.DNS_IP + '/job/pushQr/' + jobNo,
    //         updateStatusSend
    //       )
    //       .then(
    //         this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
    //         // this.clearData()
    //         // this.$router.push('/Master/FlowStep')
    //       )
    //       .catch(error => {
    //         console.log('error function addDataGlobal : ', error)
    //       })
    //   } else {
    //     let statusSend = {
    //       statusSend: 'true'
    //     }
    //     await axios
    //       .post(this.DNS_IP + '/job/updateJobNo/' + jobNo, statusSend)
    //       .then(async response => {
    //         // let lineUserId = result.data[0].lineUserId
    //         console.log('statusSend', 'true')
    //         let updateStatusSend = {
    //           updateStatusSend: 'false'
    //         }
    //         await axios
    //           .post(
    //             this.DNS_IP + '/job/pushMsg/' + response.data.jobId,
    //             updateStatusSend
    //           )
    //           .catch(error => {
    //             console.log('error function addData : ', error)
    //           })
    //       })
    //   }
    //   // this.clearData()
    // },
    async usePackage () {
      var params = {
        shopId: this.$session.getAll().data.shopId,
        token: this.StatusPackage.token
      }
      await axios({
        method: 'post',
        headers: {
          shopId: this.$session.getAll().data.shopId,
          lineUserId: this.lineUserId,
          lineId: this.userId
        },
        url: this.DNS_IP_Loyalty + '/use_package/edit?shopId=' + this.$session.getAll().data.shopId + '&token=' + this.StatusPackage.token,
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
        CREATE_USER: this.session.data.userName,
        LAST_USER: this.session.data.userName,
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
          }).then((response) => {
            this.tokenKey = tokenKey
          })
        })
    },
    async getEmpSelect (item) {
      this.empSelectStep = []
      await axios
        .get(this.DNS_IP + '/empSelect/getUse?empIdUser=isNotNull&shopId=' + item.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              var s = {}
              s.text = d.empFull_NameTH
              s.value = d.empId
              this.empSelectStep.push(s)
            }
            this.empSelect = this.empSelectStep[0].value
          }
        })
    },
    async getEmpSelectAdd () {
      this.empSelectStepAdd = []
      await axios
        .get(this.DNS_IP + '/empSelect/getUse?empIdUser=isNotNull&shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              var s = {}
              s.text = d.empFull_NameTH
              s.value = d.empId
              this.empSelectStepAdd.push(s)
            }
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
              var s = {}
              s.text = d.empFull_NameTH
              s.value = d.empId
              this.empSelectStepAdd.push(s)
            }
          }
        })
    },
    onConfirm (item) {
      if (this.$session.id() !== undefined) {
        console.log('item', item)
        this.dataConfirmReady = false
        var dt = {
          bookNo: item.bookNo,
          contactDate: this.format_date(new Date()),
          status: 'confirm',
          statusUse: 'use',
          shopId: this.$session.getAll().data.shopId,
          CREATE_USER: this.session.data.userName,
          LAST_USER: this.session.data.userName
        }
        axios
          .post(this.DNS_IP + '/booking_transaction/add', dt)
          .then(async response => {
            this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
            await this.updateRemarkAndEmpSelect(item)
            this.getDataCalendaBooking()
            let DTitem = item.userId
            console.log('DTITEM', DTitem)
            if (DTitem !== 'user-skip') {
              if (this.statusSearch === 'no') {
                await this.getBookingList()
              } else {
                await this.searchAny()
              }
              // this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(this.getSelectText, this.getSelectCount)
              }
              let pushText = {
                'to': item.lineUserId,
                'messages': [
                  {
                    'type': 'text',
                    'text': ` ✍️ ยืนยันเวลานัดหมาย\n ✅ ชื่อ : ${item.cusName}\n ✅ เลขทะเบียน : ${item.cusReg}
                          \nวันเดือนปี ${this.format_dateFUllTime(item.dueDate)}`
                  }
                ]
              }
              axios
                .post(
                  this.DNS_IP + '/line/pushmessage?shopId=' + this.$session.getAll().data.shopId,
                  pushText
                )
                .catch(error => {
                  console.log('error function addData : ', error)
                })
            } else {
              if (this.statusSearch === 'no') {
                await this.getBookingList()
              } else {
                await this.searchAny()
              }
              // this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(this.getSelectText, this.getSelectCount)
              }
            }
            this.dataConfirmReady = true
            this.dialogConfirm = false
            console.log('addDataGlobal', response)
          })
          .catch(error => {
            console.log('error function addData : ', error)
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async updateRemarkAndEmpSelect (item) {
      var dt = {
        LAST_USER: this.session.data.userName,
        empSelect: this.empSelect,
        remark: (this.remark || '').replace(/%/g, '%%')
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + item.bookNo,
          dt
        )
        .then(async response => {})
    },
    async updateRemark (item) {
      var dt = {
        LAST_USER: this.session.data.userName,
        empSelect: this.empSelect
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + item.bookNo,
          dt
        )
        .then(async response => {})
    },
    async setDataRemove (item) {
      this.bookNoRemove = item
      await this.getEmpSelect(item)
      this.dialogRemove = true
    },
    cancelChk () {
      this.validate('REMOVE')
      setTimeout(() => this.onCancelChk(), 500)
    },
    onCancelChk () {
      if (this.validRemove === true) {
        if (this.$session.id() !== undefined) {
          this.dataCancelReady = false
          var dt = {
            bookNo: this.bookNoRemove.bookNo,
            contactDate: this.format_date(new Date()),
            status: 'cancel',
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.session.data.userName,
            LAST_USER: this.session.data.userName,
            remarkRemove: (this.remarkRemove || '').replace(/%/g, '%%')
          }
          axios
            .post(this.DNS_IP + '/booking_transaction/add', dt)
            .then(async response => {
              await this.updateRemark(this.bookNoRemove)
              this.$swal('เรียบร้อย', 'ยกเลิกเรียบร้อย', 'success')
              console.log('addDataGlobal', response)
              if (this.statusSearch === 'no') {
                await this.getBookingList()
              } else {
                await this.searchAny()
              }
              // this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(this.getSelectText, this.getSelectCount)
              }
              this.getDataCalendaBooking()
              this.dataCancelReady = true
              this.dialogRemove = false
              this.remarkRemove = ''
              this.bookNo = ''
            })
            .catch(error => {
              console.log('error function addData : ', error)
            })
        } else {
          this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
          clearInterval(this.setTimerCalendar)
          this.setTimerCalendar = null
          this.$router.push('/Core/Login')
        }
      }
    },
    async changeChk (item, changeStatus) {
      this.dataChangeReady = false
      if (item.statusBt === 'confirm') {
        if (this.remark !== '') {
          var dt = {
            LAST_USER: this.session.data.userName,
            remark: (this.remark || '').replace(/%/g, '%%')
          }
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/Booking/edit/" + item.bookNo,
              dt
            )
            .then(async response => {
              this.onChangeChk(item, changeStatus)
            })
        } else {
          this.$swal('ผิดพลาด', 'กรุณาใส่ หมายเหตุเพิ่มเติม', 'error')
          this.dataChangeReady = true
        }
      } else {
        this.onChangeChk(item, changeStatus)
      }
    },
    onChangeChk (item, changeStatus) {
      console.log('item', item)
      console.log('changeStatus', changeStatus)
      this.swalConfig.title = 'ต้องการ เปลี่ยนเวลานัดหมาย ใช่หรือไม่?'
      this.$swal(this.swalConfig).then(async result => {
        if (this.$session.id() !== undefined) {
          var dtChange = {
            changeDueDate: 'change',
            dueDate: this.formChange.date + ' ' + this.formChange.time.value,
            timeText: this.formChange.time.text,
            LAST_USER: this.session.data.userName
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
                status: changeStatus,
                statusUse: 'use',
                shopId: this.$session.getAll().data.shopId,
                CREATE_USER: this.session.data.userName,
                LAST_USER: this.session.data.userName,
                changDate: this.formChange.date + ' ' + this.formChange.time.value
              }
              await axios
                .post(this.DNS_IP + '/booking_transaction/add', dt)
                .then(async response => {
                  console.log('addDataGlobal', response)
                  if (changeStatus === 'confirm') {
                    if (item.userId !== 'user-skip') {
                      if (this.statusSearch === 'no') {
                        await this.getBookingList()
                      } else {
                        await this.searchAny()
                      }
                      // this.getTimesChange('update')
                      if (this.getSelectText) {
                        this.getSelect(this.getSelectText, this.getSelectCount)
                      }
                      let pushText = {
                        'to': item.lineUserId,
                        'messages': [
                          {
                            'type': 'text',
                            'text': ` ✍️ ยืนยันเปลี่ยนเวลานัดหมาย\n ✅ ชื่อ : ${item.cusName}\n ✅ เลขทะเบียน : ${item.cusReg}
                          \nวันเดือนปี ${this.format_dateFUllTime(this.formChange.date + ' ' + this.formChange.time.value)}`
                          }
                        ]
                      }
                      axios
                        .post(
                          this.DNS_IP + '/line/pushmessage?shopId=' + this.$session.getAll().data.shopId,
                          pushText
                        )
                        .catch(error => {
                          console.log('error function addData : ', error)
                        })
                    } else {
                      if (this.statusSearch === 'no') {
                        await this.getBookingList()
                      } else {
                        await this.searchAny()
                      }
                      // this.getTimesChange('update')
                      if (this.getSelectText) {
                        this.getSelect(this.getSelectText, this.getSelectCount)
                      }
                    }
                  } else {
                    if (this.statusSearch === 'no') {
                      await this.getBookingList()
                    } else {
                      await this.searchAny()
                    }
                    // this.getTimesChange('update')
                    if (this.getSelectText) {
                      this.getSelect(this.getSelectText, this.getSelectCount)
                    }
                  }
                  this.getDataCalendaBooking()
                  this.$swal('เรียบร้อย', 'เปลี่ยนเวลานัดหมาย เรียบร้อย', 'success')
                  this.dataChangeReady = true
                  this.dialogChange = false
                })
                .catch(error => {
                  console.log('error function addData : ', error)
                })
            })
        } else {
          this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
          clearInterval(this.setTimerCalendar)
          this.setTimerCalendar = null
          this.$router.push('/Core/Login')
        }
      }).catch(error => {
        this.dataChangeReady = true
        console.log('catch alear : ', error)
      })
    },
    async getjob (item) {
      await this.getEmpSelectAdd()
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
    async jobConfirm () {
      console.log('this.jobitem', this.jobitem)
      this.swalConfig.title = 'ต้องการ เปลี่ยนพนักงาน ใช่หรือไม่?'
      this.$swal(this.swalConfig)
        .then(async () => {
          if (this.$session.id() !== undefined) {
            var updateJob = {
              empStep: this.empSelectJob,
              LAST_USER: this.$session.getAll().data.userName
            }
            await axios
              .post(this.DNS_IP + '/job/updateJobNo/' + this.jobitem[0].jobNo, updateJob)
              .then(async response => {
                this.$swal('เรียบร้อย', 'เปลี่ยนพนักงาน เรียบร้อย', 'success')
                if (parseInt(this.jobitem[0].empStepId) !== this.empSelectJob) {
                  if (this.jobitem[0].lineUserId !== '') {
                    var dt = {
                      updateStatusSend: 'false',
                      oldEmpName: this.jobitem[0].empStep
                    }
                    await axios
                      .post(this.DNS_IP + '/BookingOnsite/pushEmpCustomer/' + this.jobitem[0].bookNo, dt)
                      .then(async response1 => {})
                  }
                  var dtNoti = {
                    oldEmpName: this.jobitem[0].empStep
                  }
                  await axios
                    .post(this.DNS_IP + '/Booking/LineNotifyGroupOnsite/' + this.jobitem[0].bookNo, dtNoti)
                    .then(async response1 => {})
                }
                if (this.statusSearch === 'no') {
                  await this.getBookingList()
                } else {
                  await this.searchAny()
                }
                this.dialogJob = false
                // this.getTimesChange('update')
                if (this.getSelectText) {
                  this.getSelect(this.getSelectText, this.getSelectCount)
                }
              })
          } else {
            this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
            clearInterval(this.setTimerCalendar)
            this.setTimerCalendar = null
            this.$router.push('/Core/Login')
          }
        })
    },
    async setDataChang (item) {
      console.log('dueDate', item.dueDate)
      console.log('timeText', item.timeText)
      await this.checkTimeFlow()
      this.dataChange = item
      this.remark = item.remark
      this.formChange.date = this.momenDate_1(item.dueDate)
      if (this.timeavailable.filter(el => { return el.text === item.timeText }).length > 0) {
        if (item.timeText) {
          this.formChange.time = { text: item.timeText, value: this.momenTime(item.dueDate) }
        } else {
          this.formChange.time = { text: this.momenTime(item.dueDate), value: this.momenTime(item.dueDate) }
        }
      } else {
        this.formChange.time = { text: this.momenTime(item.dueDate), value: this.momenTime(item.dueDate) }
      }
      this.dialogChange = true
      console.log(this.formChange)
    },
    async openInfo (item) {
      this.detailInfo = await this.getBookingData(item)
      this.dataInfo = item
      this.dialogInfo = true
    }
  }
}
</script>
