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
              <!-- <v-btn
                color="primary"
                style="z-index:8;margin-right: 5px;"
                id="v-step-0"
                depressed
                @click="$router.push('./Qrcodereader')"
              >
                <v-icon left>mdi-text-box-plus</v-icon>
                Qr Code
              </v-btn> -->
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
              <v-col cols="5" class="text-center pb-0">
                <v-row>
                  <v-col cols="12" class="pb-0 mt-6">
                    <v-alert
                      :color="'orange ' + ((getSelectText === 'wait') ? '' : 'lighten-4')"
                      :dark="((getSelectText === 'wait') ? true : false)"
                      dense
                      icon="mdi-phone-ring"
                      prominent
                      @click="getSelect('wait',countWaiting)"
                    >
                      <div>
                        <strong>{{dataTypeProcess1}}</strong>
                      </div>
                      <div>จำนวน : {{countWaiting}}</div>
                    </v-alert>
                  </v-col>
                  <v-col cols="12" class="pt-0">
                    <v-alert
                      :color="'red ' + ((getSelectText === 'cancel') ? '' : 'lighten-4')"
                      :dark="((getSelectText === 'cancel') ? true : false)"
                      dense
                      icon="mdi-phone-cancel"
                      prominent
                      @click="getSelect('cancel',countCancel)"
                    >
                      <div>
                        <strong>{{dataTypeProcess3}}</strong>
                      </div>
                      <div>จำนวน : {{countCancel}}</div>
                    </v-alert>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="7" class="text-center pb-0 ma-auto">
                <v-row>
                  <v-col cols="6" class="pb-0 pr-1 pl-0">
                    <v-alert
                      :color="'green ' + ((getSelectText === 'confirm') ? '' : 'lighten-4')"
                      :dark="((getSelectText === 'confirm') ? true : false)"
                      dense
                      icon="mdi-phone-check"
                      prominent
                      @click="getSelect('confirm',countConfirm)"
                    >
                      <div>
                        <strong>{{dataTypeProcess2}}</strong>
                      </div>
                      <div>จำนวน : {{countConfirm}}</div>
                    </v-alert>
                  </v-col>
                  <v-col cols="6" class="pb-0 pl-1 pr-0">
                    <v-alert
                      :color="'blue ' + ((getSelectText === 'confirmJob') ? '' : 'lighten-4')"
                      :dark="((getSelectText === 'confirmJob') ? true : false)"
                      dense
                      icon="mdi-car-cog"
                      prominent
                      @click="getSelect('confirmJob',countJob)"
                    >
                      <div>
                        <strong>{{dataTypeProcess4}}</strong>
                      </div>
                      <div>จำนวน : {{countJob}}</div>
                    </v-alert>
                  </v-col>
                  <v-col cols="12" class="pt-0 pl-0 pr-0">
                    <v-alert
                      :color="'teal ' + ((getSelectText === 'confirmSum') ? '' : 'lighten-4')"
                      :dark="((getSelectText === 'confirmSum') ? true : false)"
                      dense
                      icon="mdi-expand-all"
                      @click="getSelect('confirmSum',(countConfirm + countJob))"
                    >
                      <div>
                        <strong>รวม</strong>  : {{countConfirm + countJob}}
                      </div>
                      <!-- <div>จำนวน : {{countConfirm + countJob}}</div> -->
                    </v-alert>
                  </v-col>
                </v-row>
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
            <v-select
              v-model="flowSelect"
              :items="DataFlowName"
              label="ประเภทบริการ"
              outlined
              dense
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
          <v-dialog v-model="dialogAdd" max-width="100%"
          persistent>
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
                            @change="checkTime(), date = ''"
                            :rules="[rules.required]"
                          ></v-select>
                          <v-select
                            v-model="formAdd.masBranchID"
                            :items="branch"
                            label="สาขา"
                            outlined
                            dense
                            required
                            :rules="[rules.required]"
                            @change="SetallowedDates(), date = ''"
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
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'text'">
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
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'number'">
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
                                      dense
                                      required
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
                                        outlined
                                        dense
                                        required
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
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
                                        outlined
                                        dense
                                        required
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
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
                            <div v-if="formAdd.masBranchID && formAdd.flowId">
                            <v-col class="pb-0">
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
                                    label="วันที่"
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
                            </div>
                            <v-col class="pb-0" v-if="timeavailable.length > 0 && date !== ''">
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
                            <!-- <v-col class="pb-0">
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
                            </v-col> -->
                          </v-row>
                          <v-row>
                            <v-col class="pt-0">
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
              <v-card-title>นำเข้ากระดานการทำงาน</v-card-title>
              <v-card-text  v-if="dataEditJobReady && statusConfirmJob">
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
                            v-if="p.fieldName === 'เบอร์โทร'"
                            v-mask="'###-###-####'"
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                            outlined
                          ></v-text-field>
                          <v-text-field
                            v-else
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
                            v-if="p.fieldName === 'เบอร์โทร'"
                            v-mask="'###-###-####'"
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                            outlined
                          ></v-text-field>
                          <v-text-field
                            v-else
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
                            v-if="p.fieldName === 'เบอร์โทร'"
                            v-mask="'###-###-####'"
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                            outlined
                          ></v-text-field>
                          <v-text-field
                            v-else
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
                            v-if="p.fieldName === 'เบอร์โทร'"
                            v-mask="'###-###-####'"
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="p.requiredField === 'True' ? [rules.required] : [true]"
                            outlined
                          ></v-text-field>
                          <v-text-field
                            v-else
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
                  <br>
                  <v-row>
                    <v-col cols="12" sm="6" md="6" lg="6" class="pb-0" v-if="statusShowDateConfiremjob">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="endDate"
                            label="วันที่นัดส่งรถลูกค้า"
                            persistent-hint
                            dense
                            outlined
                            required
                            :rules="[rules.required]"
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                            readonly
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="endDate"
                          no-title
                          @input="menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-col cols="12" sm="6" md="6" lg="6" class="pb-0" v-if="statusShowDateConfiremjob">
                          <!-- <v-select
                          v-model="endTime"
                          :items="timeavailable"
                          label="เวลา"
                          menu-props="auto"
                          outlined
                          dense
                          required
                          :rules ="[rules.required]"
                        ></v-select> -->
                        <v-select
                          v-model="endTime"
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
                    <v-col cols="12" sm="12" md="12" lg="12">
                      <v-select
                        v-model="empSelectJob"
                        :items="empSelectStepAdd"
                        label="พนักงานที่นำเข้ากระดานทำงาน"
                        menu-props="auto"
                        outlined
                        required
                        :rules="[rules.required]"
                        dense
                      ></v-select>
                    </v-col>
                  </v-row>
                  </v-form>
                  <div class="text-center">
                    <v-btn
                      elevation="2"
                      small
                      dark
                      color="#173053"
                      @click="addDataJob()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      นำเข้าตารางงาน
                    </v-btn>
                    <v-btn small color="red" dark @click="dialogEdit = false, getDataDefault(), searchOther = '', showColorSearch = false, statusSearch = 'no'">
                      <v-icon color="#173053">mdi-close</v-icon> ยกเลิก
                    </v-btn>
                  </div>
                </v-container>
              </v-card-text>
              <v-card-text  v-if="dataEditJobReady && !statusConfirmJob">
                <strong><h2>เนื่องจากวันที่นัดหมาย {{format_dateNotime(dueDate)}} ไม่ตรงกับวันที่ปัจจุบัน</h2></strong>
                <strong style="color: red;"><h3>กรุณาตรวจสอบข้อมูล หรือ เปลี่ยนเวลานัดหมายใหม่</h3></strong>
                <div class="text-center">
                  <v-btn small color="red" dark @click="dialogEdit = false, getDataDefault(), searchOther = '', showColorSearch = false, statusSearch = 'no'">
                    <v-icon color="#173053">mdi-close</v-icon> ปิดหน้าต่าง
                  </v-btn>
                </div>
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
                    <v-col cols="12" v-if="checkShowSelectUser">
                      <div class=" text-center">
                        <v-tabs
                          v-model="tabSelectUser"
                          background-color="#1B437C"
                          centered
                          dark
                          icons-and-text
                        >
                          <v-tabs-slider></v-tabs-slider>
                          <v-tab>
                            ลูกค้าที่นัดหมาย
                            <v-icon>mdi-card-account-phone</v-icon>
                          </v-tab>

                          <v-tab>
                            แสกน QR / Skip
                            <v-icon>mdi-qrcode-edit</v-icon>
                          </v-tab>

                          <v-tab-item style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);">
                            <br>
                            <v-row justify="center" class="spacer" no-gutters>
                              <v-col cols="4" sm="2" md="1">
                                <v-avatar
                                  size="60px"
                                >
                                  <img
                                    alt="Avatar"
                                    :src="dataSelectUser.picture"
                                  >
                                </v-avatar>
                              </v-col>
                              <v-col cols="6" sm="4" md="2">คุณ {{dataSelectUser.name}}</v-col>
                            </v-row>
                            <v-row justify="center" class="spacer" no-gutters>
                              <v-col col="12"><strong>ลูกค้าที่นัดหมาย</strong></v-col>
                            </v-row>
                          </v-tab-item>
                          <v-tab-item style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);">
                            <br>
                            <div v-if="jobitem.length > 0 && userId === ''" class="avatar text-center">
                              <qrcode-vue :value="value" :size="size" level="H" :foreground="foreground" />
                            </div>
                          </v-tab-item>
                        </v-tabs>
                      </div>
                    </v-col>
                    <v-col cols="12" v-if="!checkShowSelectUser">
                      <div class=" text-center">
                      <br>
                        <br>
                        <h2 style="font-weight: 900; color:#FFA000">ติดตามสถานะ!</h2>
                        <qrcode-vue v-if="userId === ''" :value="value" :size="size" level="H" :foreground="foreground" />
                        <template v-if="jobitem.length > 0">
                         <div v-if="userId !== ''" class="avatar text-center">
                            <v-avatar v-if="memberPicture !== ''" size="120" style="border:5px solid #FFFFFF;">
                                <img :src= memberPicture>
                            </v-avatar>
                            <v-avatar v-if="memberPicture === '' && userId === 'user-skip' && jobitem[0].recordStatus === 'D'" size="120" style="border:5px solid #FFFFFF;">
                                <v-img
                                  class="v_text_add"
                                  :src="require('@/assets/OtherP.svg')"
                                ></v-img>
                            </v-avatar>
                            <!-- <p class="text-center">{{profile.displayName}}</p> -->
                        </div>
                        </template>
                         <div v-if="jobitem.length > 0" class="avatar text-center">
                           <qrcode-vue v-if="userId === 'user-skip' && jobitem[0].recordStatus === 'N'" :value="value" :size="size" level="H" :foreground="foreground" />
                        </div>
                    </div>
                  </v-col>
                </v-row>
                </v-container>
                <v-row >
                  <v-col cols="12">
                      <v-container class="text-center" >
                        <v-container>
                            <div v-for="(p , index) in jobitem" :key="index">
                              <h4>{{p.name}} : {{p.value}}</h4>
                              <!-- <h4 v-if="p.showCard === 'True' ">{{p.name}} : {{p.value}}</h4> -->
                            </div>
                            <div v-if="jobitem.length > 0">
                              <strong style="color: red;" v-if="jobitem[0].recordStatus === 'D'"><h2>รายการนี้ปิดไปแล้ว</h2></strong>
                            </div>
                        </v-container>
                        <template v-if="!checkShowSelectUser">
                          <v-btn small class="ma-2" color="success" v-if="userId === ''" @click="pushMsgSelectUser" dark>
                            ส่ง QR Code
                          <v-icon dark right>
                          mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="primary" v-if="userId === ''" @click="jobConfirm" dark>
                            SKIP
                          <v-icon dark right>
                          mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="error" @click="dialogJob = false" dark >
                        Close
                        <v-icon dark right>
                            mdi-minus-circle
                        </v-icon>
                        </v-btn>
                        </template>
                        <template v-if="checkShowSelectUser">
                        <v-btn small class="ma-2" color="success" v-if="userId === '' && tabSelectUser === 1" @click="pushMsgSelectUser" dark>
                            ส่ง QR Code
                          <v-icon dark right>
                          mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="primary" v-if="userId === '' && tabSelectUser === 1" @click="jobConfirm" dark>
                            SKIP
                          <v-icon dark right>
                          mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="primary" v-if="tabSelectUser === 0 || tabSelectUser === null" @click="jobConfirmUser" dark>
                            ลูกค้าท่านเดียวกับที่นัดหมาย
                          <v-icon dark right>
                            mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" color="error" @click="dialogJob = false" dark >
                            Close
                            <v-icon dark right>
                                mdi-minus-circle
                            </v-icon>
                        </v-btn>
                        </template>
                    </v-container>
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
                          v-if="checkSelectText === 'confirm'"
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
                    <v-btn
                      elevation="10"
                      color="green darken-1"
                      dark
                      small
                      :disabled="!validChange"
                      @click="changeChk(dataChange, 'confirm')"
                      >เปลี่ยนวันเวลานัดหมาย (ยืนยัน)</v-btn
                    >
                    <v-btn
                      elevation="10"
                      color="#173053"
                      dark
                      v-if="checkSelectText !== 'confirm'"
                      small
                      :disabled="!validChange"
                      @click="changeChk(dataChange, 'change')"
                      >เปลี่ยนวันเวลานัดหมาย</v-btn
                    >
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
            <BookingQueue :branchParent="branch" :masBranchIDParent="masBranchID" :drawerParent="drawer" :menu1Parent="menu1" :timeTableParent="timeTable" :rulesParent="rules" :masterTimeParent="masterTime" :dataItemTimesChangeParent="dataItemTimesChange" :getTimesChangeParent="getTimesChange" :exportExcelParent="exportExcel" :exportExcelMazdaParent="exportExcelMazda" :dataRemoveExportParent="dataRemoveExport" :exportExcelRemoveParent="exportExcelRemove" :toggleParent="toggle" @updateTimeTable="updateTimeTablefromChild"></BookingQueue>
            <v-card elevation="7" v-if="dataReady">
              <v-card-text>
              <v-row>
                <v-col col="auto">
                  <v-btn
                  v-if="dataItem.length > 0"
                  color="blue-grey"
                  class="ma-1 white--text"
                  @click="toggle"
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
                  class="ma-1 white--text"
                  @click="addDataSet()"
                >
                  ตรวจสอบคิวจองรายเดือน
                </v-btn>
                </v-col>
                <v-col class="text-right" col="auto">
                  <v-text-field
                    dense
                    v-model="searchOther"
                    append-icon="mdi-text-box-search"
                    label="ค้นหาทั้งหมด"
                    :color="showColorSearch ? 'green' : 'info'"
                    @click:append="searchAny()"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col class="text-right" cols="auto"></v-col>
              </v-row>
              </v-card-text>
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
                        <v-btn
                          elevation="2"
                          rounded
                          v-if="item.statusBt === 'confirm' || item.statusBt === 'confirmJob'"
                          :color="(item.remarkConfirm1) ? 'green darken-2' : 'grey darken-1'"
                          @click.stop="item.remarkConfirm1=!item.remarkConfirm1;confirmRemark(item, 'inAdvance')"
                          :loading="loadingConfirmDay"
                          :disabled="loadingConfirmDay"
                        >
                          1 วัน
                        </v-btn>
                      </v-col>
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
                          :loading="loadingConfirmDay"
                          :disabled="loadingConfirmDay"
                        >
                          {{dataTypeJob3}}
                        </v-chip>
                      </v-col>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          :color="(item.extraJob) ? 'green darken-2' : 'grey darken-1'"
                          v-model="item.extraJob"
                          @click.stop="item.extraJob=!item.extraJob;confirmRemark(item, 'extraJob')"
                          :loading="loadingConfirmDay"
                          :disabled="loadingConfirmDay"
                        >
                          {{dataTypeJob2}}
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
                    <v-tooltip bottom v-if="item.statusBt !== 'confirmJob'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-badge
                          avatar
                          bordered
                          overlap
                          :content="item.countChangeTime"
                          color="warning"
                          class="mr-1"
                          style="cursor: pointer"
                        >
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
                        </v-badge>
                      </template>
                      <span>เปลี่ยนเวลานัดหมาย</span>
                    </v-tooltip>

                    <v-btn
                      color="primary"
                      fab
                      v-if="item.statusBt === 'confirm'"
                      small
                      @click.stop="(dialogEdit = true), getBookingData(item), checkTimeFlow(item)"
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
                    <v-btn
                      color="info"
                      dark
                      v-if="item.statusBt === 'confirmJob'"
                      fab
                      small
                      @click.stop="(dialogJob = true), getjob(item)"
                    >
                      <v-icon> mdi-qrcode-scan </v-icon>
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
                        <v-btn
                          elevation="2"
                          rounded
                          v-if="item.statusBt === 'confirm' || item.statusBt === 'confirmJob'"
                          :color="(item.remarkConfirm1) ? 'green darken-2' : 'grey darken-1'"
                          @click.stop="item.remarkConfirm1=!item.remarkConfirm1;confirmRemark(item, 'inAdvance')"
                          :loading="loadingConfirmDay"
                          :disabled="loadingConfirmDay"
                          class="white--text"
                        >
                          1 วัน
                        </v-btn>
                      </v-col>
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
                          :loading="loadingConfirmDay"
                          :disabled="loadingConfirmDay"
                        >
                          {{dataTypeJob3}}
                        </v-chip>
                      </v-col>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          :color="(item.extraJob) ? 'green darken-2' : 'grey darken-1'"
                          v-model="item.extraJob"
                          @click.stop="item.extraJob=!item.extraJob;confirmRemark(item, 'extraJob')"
                          :loading="loadingConfirmDay"
                          :disabled="loadingConfirmDay"
                        >
                          {{dataTypeJob2}}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <!-- confirm -->
                    <VueCustomTooltip label="ดูแผนที่" position="is-top" v-if="item.addressLatLong !== null">
                    <!-- <VueCustomTooltip label="ดูแผนที่" :position="filteredSelect.length === 1 ? 'is-top' : 'is-bottom'" v-if="item.addressLatLong !== null"> -->
                      <v-btn
                          color="blue-grey darken-1"
                          fab
                          small
                          dark
                          @click.stop="setShowMap(item)"
                        >
                          <v-icon dark> mdi-map-marker-radius-outline </v-icon>
                        </v-btn>
                    </VueCustomTooltip>
                    <VueCustomTooltip label="แก้ไขข้อมูล" position="is-top">
                        <v-btn
                          color="yellow"
                          fab
                          small
                          @click.stop="setDataEdit(item)"
                        >
                          <v-icon dark> mdi-tools </v-icon>
                        </v-btn>
                    </VueCustomTooltip>
                    <VueCustomTooltip label="รับรถเข้าศูนย์" position="is-top"  v-if="item.statusBt === 'confirm'">
                        <v-btn
                          color="primary"
                          fab
                          small
                          @click.stop="(dialogEdit = true), getBookingDataJob(item, 'qrcode')"
                        >
                          <v-icon dark> mdi-account-plus </v-icon>
                        </v-btn>
                    </VueCustomTooltip>
                    <VueCustomTooltip label="ยืนยันนัดหมาย" position="is-top" v-if="item.statusBt !== 'confirmJob' && item.statusBt !== 'confirm'">
                        <v-btn
                          color="success"
                          fab
                          :disabled="item.chkConfirm"
                          small
                          @click.stop="confirmChk(item)"
                        >
                          <v-icon dark> mdi-phone-check </v-icon>
                        </v-btn>
                    </VueCustomTooltip>
                    <VueCustomTooltip label="เปลี่ยนเวลานัดหมาย" position="is-top" v-if="item.statusBt !== 'confirmJob'">
                        <v-badge
                          avatar
                          bordered
                          overlap
                          :content="item.countChangeTime"
                          :value="item.countChangeTime"
                          color="warning"
                          class="mr-1"
                          style="cursor: pointer"
                        >
                          <v-btn
                            color="warning"
                            fab
                            small
                            @click.stop="setDataChang(item)"
                          >
                            <v-icon> mdi-calendar-clock </v-icon>
                          </v-btn>
                        </v-badge>
                    </VueCustomTooltip>
                    <VueCustomTooltip label="ยกเลิกนัดหมาย" position="is-top" v-if="item.statusBt !== 'cancel' && item.statusBt !== 'confirmJob'">
                        <v-btn
                          color="error"
                          fab
                          small
                          :disabled="item.chkCancel"
                          @click.stop="setDataRemove(item)"
                        >
                          <v-icon dark> mdi-phone-cancel </v-icon>
                        </v-btn>
                    </VueCustomTooltip>
                    <VueCustomTooltip label="QR Code สำหรับให้ลูกค้า" position="is-top" bottom v-if="item.statusBt === 'confirmJob'">
                        <v-btn
                          color="info"
                          dark
                          fab
                          small
                          @click.stop="(dialogJob = true), getjob(item)"
                        >
                          <v-icon> mdi-qrcode-scan </v-icon>
                        </v-btn>
                    </VueCustomTooltip>
                    <VueCustomTooltip label="ลบรายการนี้" position="is-top" bottom v-if="item.statusBt === 'cancel'">
                        <v-btn
                          color="red"
                          dark
                          fab
                          small
                          @click.stop="(dialogDelete = true), getDataById(item)"
                        >
                          <v-icon> mdi-delete </v-icon>
                        </v-btn>
                    </VueCustomTooltip>
                    <!-- <v-tooltip bottom v-if="item.addressLatLong !== null">
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
                          @click.stop="(dialogEdit = true), getBookingDataJob(item, 'qrcode')"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark> mdi-account-plus </v-icon>
                        </v-btn>
                      </template>
                      <span>รับรถเข้าศูนย์</span>
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
                    <v-tooltip bottom v-if="item.statusBt !== 'confirmJob'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-badge
                          avatar
                          bordered
                          overlap
                          :content="item.countChangeTime"
                          :value="item.countChangeTime"
                          color="warning"
                          class="mr-1"
                          style="cursor: pointer"
                        >
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
                        </v-badge>
                      </template>
                      <span>เปลี่ยนเวลานัดหมาย</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="item.statusBt !== 'cancel' && item.statusBt !== 'confirmJob'">
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
                          @click.stop="(dialogJob = true), getjob(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon> mdi-qrcode-scan </v-icon>
                        </v-btn>
                      </template>
                      <span>QR Code สำหรับให้ลูกค้า</span>
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
                    </v-tooltip> -->
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
            <v-card class="text-center">
              <v-card-title>
                ยืนยันรายการนี้
              </v-card-title>
              <v-card-text v-if="dataConfirmReady">
                <v-container>
                <v-row>
                  <v-col cols= "12" class="pb-0">
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
                <v-row>
                  <v-col cols= "12"  class="pb-0">
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
                    @click="onConfirm(dataConfirm)"
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
          </v-dialog>
        <v-dialog v-model="dialogEditData" :max-width="dialogwidth">
          <!-- <v-dialog v-model="dialogAdd" persistent max-width="70%"> -->
            <v-card class="text-center">
                <v-card-text>
                    <v-col class="text-right pa-0">
                      <v-btn
                        small
                        color="#E0E0E0"
                        @click="(dialogEditData = false, this.dataEditReady = true)"
                      >
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                    <v-row justify="center">
                      <!-- <v-col
                        cols="6"
                      > -->
                      <!-- <v-col
                        cols="8"
                        class="text-center d-none d-sm-flex"
                        style="margin: auto 0;"
                      > -->
                        <!-- <v-col class="text-center">
                          <CalendarBooking ref="CalendarBooking"></CalendarBooking> -->
                          <!-- <v-img
                            class="v-margit_img_reward"
                            :src="require('@/assets/AddBookingList.svg')"
                            max-width="470.37"
                            max-height="247"
                          ></v-img> -->
                        <!-- </v-col> -->
                      <!-- </v-col> -->

                      <v-col cols="12">
                      <!-- <v-col cols="12" sm="6" md="6" lg="6" class="v-margit_text_add mt-0 pa-0"> -->
                        <v-col class="text-center pa-3 ml-2">
                          <h3 style="font-size:10vw;" class="underline-06">แก้ไขข้อมูล</h3>
                          <!-- <v-img
                            class="v_text_add"
                            :src="require('@/assets/Grouptitle.svg')"
                          ></v-img> -->
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
                                <v-col cols="12" class="InputData" v-if="item.fieldType == 'number'">
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
                                      dense
                                      required
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
                                        outlined
                                        dense
                                        required
                                        :rules="item.requiredField === 'True' ? [rules.required] : [true]"
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
                          <v-row v-if="checkSelectText !== 'confirmJob'">
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
                          <v-row>
                            <v-col class="pt-0 pb-0">
                              <v-radio-group v-model="formEdit.radiosRemark" row  required :rules ="[rules.required]">
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
                          <v-row v-if="checkSelectText !== 'confirmJob'">
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
                              :loading="loadingEdit"
                              :disabled="loadingEdit"
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
          <v-dialog
            v-model="dialogAddCon"
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
          <v-dialog
            v-model="dialogError"
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
      </div>
    </v-main>
  </div>
</template>
<style scoped>
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
  watch: {
    // menuDate (val) {
    //   val && setTimeout(() => (this.$refs.dateRef.activePicker = 'month'))
    // },
    pickerDate (newval, oldval) {
      this.getMonth(newval)
      // this.allowedDates()
      // here you can check if month changed using newval and oldval
    }
  },
  data () {
    let startDate = null
    let endDate = null
    return {
      pickerDate: null,
      currentDate: moment().format('YYYY-MM-DD'),
      currentMonth: moment().format('YYYY-MM'),
      checkSelectText: '',
      flowSelect: '',
      dueDate: '',
      statusConfirmJob: false,
      filters: '',
      loadingEdit: false,
      loadingAdd: false,
      loadingRefresh: false,
      loadingConfirmDay: false,
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
        { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
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
      checkShowSelectUser: false,
      tabSelectUser: null,
      dataSelectUser: {},
      dataTypeJob1: '',
      dataTypeJob2: '',
      dataTypeJob3: '',
      dataTypeProcess1: '',
      dataTypeProcess2: '',
      dataTypeProcess3: '',
      dataTypeProcess4: '',
      dateDayoff: [],
      dateDayCustom: [],
      dateDaylimit: null,
      flowItemLimit: [],
      checkLimitBooking: {
        ID: '',
        countBooking: null,
        limitCheck: null,
        limitBooking: 0
      },
      dueDateOld: '',
      dueDateTimeOld: '',
      dataEdit: '',
      statusShowDateConfiremjob: true
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
    if (this.$route.query.bookNo) {
      await this.getDataBranch()
      await this.getEmpSelectAdd()
      await this.getBookingFieldText()
      this.getCustomFieldStart()
      this.getDataFlow()
      await this.scanQrcode()
      // this.getBookingList()
    } else {
      await this.getDataBranch()
      await this.getEmpSelectAdd()
      await this.getBookingFieldText()
      this.getCustomFieldStart()
      this.getDataFlow()
      this.getBookingList()
    }
    this.$root.$on('closeSetTimeGetCalenda', () => {
      // your code goes here
      this.closeSetTimeGetCalenda()
    })
  },
  methods: {
    pushMsgConfirm (bookNo) {
      axios
        .post(
          this.DNS_IP + '/Booking/pushMsgConfirm/' + bookNo
        )
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async checkLimit () {
      this.checkLimitBooking.ID = 'NO'
      this.checkLimitBooking.countBooking = 1
      let LimitBooking = await this.getLimitBooking()
      if (LimitBooking.status === false) {
        this.checkLimitBooking.ID = 'NO'
        this.checkLimitBooking.countBooking = 1
        console.log('1257')
      } else {
        console.log('1259', LimitBooking)
        LimitBooking.forEach((item) => {
          let dt = JSON.parse(this.DataFlowName.filter(item => { return item.value === this.formAdd.flowId })[0].allData.setTime) || []
          // let dt = JSON.parse(this.branchData.filter(item => { return item.masBranchID === this.formAdd.masBranchID })[0].setTime) || []
          let dtint = parseInt(dt.filter(item => item.value === this.time.value)[0].limitBooking || '0')
          console.log('test', dtint)
          // console.log('test', item.flowId === this.formAdd.flowId && this.momenDate_1(item.bookingDate) === this.date && item.bookingTime === this.time.value)
          // if (item.masBranchID === this.formAdd.masBranchID && this.momenDate_1(item.bookingDate) === this.date && item.bookingTime === this.time.value) {
          if (item.flowId === this.formAdd.flowId && this.momenDate_1(item.bookingDate) === this.date && item.bookingTime === this.time.value) {
            this.checkLimitBooking.ID = item.id
            console.log('1266')
            this.checkLimitBooking.countBooking = parseInt(item.countBooking) + 1
            this.checkLimitBooking.limitCheck = parseInt(item.countBooking) >= dtint ? 'false' : 'true'
            this.checkLimitBooking.limitBooking = dtint
            // console.log('item.masBranchID', item)
          }
        })
      }
      console.log('this.checkLimitBooking', this.checkLimitBooking)
    },
    async getLimitBooking () {
      // console.log('date', this.date)
      // let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDate/get?shopId=' + this.$session.getAll().data.shopId + '&masBranchID=' + this.formAdd.masBranchID + '&bookingDate=' + this.date).then(async (response) => {
      //   let rs = response.data
      //   return rs
      // })
      // return LimitBooking
      let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDate/get?shopId=' + this.$session.getAll().data.shopId + '&flowId=' + this.formAdd.flowId + '&bookingDate=' + this.date).then(async (response) => {
        let rs = response.data
        return rs
      })
      return LimitBooking
    },
    allowedDates (val) {
      if (this.dateDaylimit) {
        if (this.branch.filter(el => el.value === this.formAdd.masBranchID)[0].allData.typeDayCustom === 'on') {
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
      }
    },
    async setLimitBooking (dateitem) {
      this.time = ''
      this.timeavailable = []

      // LimitBookingBy Flow
      // this.limitBookingCheck = this.flowItemLimit.filter(item => { return item.flowId === this.formAdd.flowId })[0].limitBookingCheck || 'False'
      // let setTimeOld = JSON.parse(this.DataFlowName.filter(el => { return el.value === parseInt(item.flowId) })[0].allData.setTime)

      // LimitBookingBy masBranch
      this.limitBookingCheck = this.DataFlowName.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.limitBookingCheck || 'False'
      if (this.DataFlowName.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.limitBookingCheck || 'False') {
        let TimeData = []
        let currentDate = JSON.parse(this.DataFlowName.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.setTime) || []
        // if (
        //   moment(dateitem).format('YYYY-MM-DD') ===
        //   moment().format('YYYY-MM-DD')
        // ) {
        //   TimeData = currentDate.filter(
        //     item => moment().format(item.value) > moment().format('HH:mm')
        //   )
        // } else {
        //   TimeData = currentDate
        // }
        TimeData = currentDate
        this.timeavailable = TimeData
        console.log('TimeData', TimeData)
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
          this.timeavailable = TimeData
          console.log('this.timeavailable ELSE', this.timeavailable)
        }
      } else {
        console.log('this.timeavailable ELSEEEEE', this.timeavailable)
        // LimitBookingBy Flow
        // this.timeavailable = JSON.parse(this.flowItemLimit.filter(item => { return item.flowId === this.formAdd.flowId })[0].setTime) || []

        // LimitBookingBy masBranch
        this.timeavailable = JSON.parse(this.DataFlowName.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.setTime) || []
      }
    },
    async getMonth (month) {
      console.log('month', month)
      // const result = await axios.get(this.DNS_IP + '/LimitBookingDate/get_LimitDate?shopId=' + this.$session.getAll().data.shopId + '&masBranchID=' + this.formAdd.masBranchID + '&bookingDate=' + month)
      const result = await axios.get(this.DNS_IP + '/LimitBookingDate/get_LimitDate?shopId=' + this.$session.getAll().data.shopId + '&flowId=' + this.formAdd.flowId + '&bookingDate=' + month)
      if (result.data.length > 0) {
        console.log('getMonth IF', result.data)
        this.dateDaylimit = []
        let dt = result.data
        if (dt[0].limitBookingCheck === 'True') {
          console.log('limitBookingCheck === True')
          dt.forEach((v, k) => {
            if (JSON.parse(v.setTime)) {
              let count = 0
              JSON.parse(v.setTime).forEach((v2, k2) => {
                count += parseInt(v2.limitBooking)
              })
              if (v.sum >= count) {
                this.dateDaylimit.push(
                  moment(v.bookingDate).format('YYYY-MM-DD')
                )
              }
            }
          })
        } else {
          console.log('limitBookingCheck === False')
          this.dateDaylimit = []
        }

        // this.dateDaylimit = result.data.map((item) => { return this.momenDate_1(item.bookingDate) })
      } else {
        console.log('getMonth ELSE')
        this.dateDaylimit = []
      }
      // console.log('this.dateDaylimit', this.dateDaylimit)
    },
    SetallowedDates () {
      this.branch.forEach((v, k) => {
        console.log('v', v)
        if (v.allData.masBranchID === this.formAdd.masBranchID) {
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
    },
    async getBookingFieldText () {
      console.log('getBookingFieldText', JSON.parse(localStorage.getItem('sessionData')))
      if (JSON.parse(localStorage.getItem('typeData')) === null) {
        await axios
          .get(
            this.DNS_IP + '/BookingField/get?shopId=' + this.$session.getAll().data.shopId
          )
          .then(async response => {
            let rs = response.data
            console.log('rs', rs)
            if (rs.status === false) {
              this.$swal('ผิดพลาด', 'เนื่องจากไม่สามารถเรียกชื่อกระบวนการ และประเภทงานได้', 'error')
            } else {
              localStorage.setItem('typeData', JSON.stringify(rs[0]))
              this.dataTypeJob1 = JSON.parse(localStorage.getItem('typeData')).typeJob1 || ''
              this.dataTypeJob2 = JSON.parse(localStorage.getItem('typeData')).typeJob2 || ''
              this.dataTypeJob3 = JSON.parse(localStorage.getItem('typeData')).typeJob3 || ''
              this.dataTypeProcess1 = JSON.parse(localStorage.getItem('typeData')).typeProcess1 || ''
              this.dataTypeProcess2 = JSON.parse(localStorage.getItem('typeData')).typeProcess2 || ''
              this.dataTypeProcess3 = JSON.parse(localStorage.getItem('typeData')).typeProcess3 || ''
              this.dataTypeProcess4 = JSON.parse(localStorage.getItem('typeData')).typeProcess4 || ''
            }
          })
      } else {
        this.dataTypeJob1 = JSON.parse(localStorage.getItem('typeData')).typeJob1 || ''
        this.dataTypeJob2 = JSON.parse(localStorage.getItem('typeData')).typeJob2 || ''
        this.dataTypeJob3 = JSON.parse(localStorage.getItem('typeData')).typeJob3 || ''
        this.dataTypeProcess1 = JSON.parse(localStorage.getItem('typeData')).typeProcess1 || ''
        this.dataTypeProcess2 = JSON.parse(localStorage.getItem('typeData')).typeProcess2 || ''
        this.dataTypeProcess3 = JSON.parse(localStorage.getItem('typeData')).typeProcess3 || ''
        this.dataTypeProcess4 = JSON.parse(localStorage.getItem('typeData')).typeProcess4 || ''
      }
    },
    closeSetTimeGetCalenda () {
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
    },
    // async getShowMap () {
    //   await axios
    //     .get(
    //       this.DNS_IP + '/BookingField/get?shopId=' + this.$session.getAll().data.shopId
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
        this.showColorSearch = true
        this.statusSearch = 'yes'
        this.dataReady = false
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
            '/booking_view/getSearchNew?shopId=' +
            this.$session.getAll().data.shopId +
            '&fieldValue=' +
            this.searchOther + '&checkOnsite=is null'
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
                  s.dueDate = d.dueDate || ''
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
                  s.lineUserId = d.lineUserId
                  s.timeDueHtext = d.timeDueH + ':00'
                  s.timeDuetext = d.timeDue
                  s.address = d.address
                  s.addressLatLong = d.addressLatLong
                  s.countChangeTime = d.countChangeTime || 0
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
            this.showColorSearch = false
            this.statusSearch = 'no'
            this.$swal('ผิดพลาด', 'กรุณาใส่ลองอีกครั้ง', 'error')
            // setTimeout(() => this.searchAny(), 3000)
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
          })
      } else {
        this.dataReady = true
        this.showColorSearch = false
        this.statusSearch = 'no'
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
        remark: (this.remark || '').replace(/%/g, '%%').replace(/'/g, "\\'")
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
    async setDataEdit (dt) {
      // this.dialogEditData = true
      await this.getBookingField()
      // await this.getBookingData(dt, 'edit')
      this.checkSelectText = dt.statusBt
      console.log('setDataEdit', dt)
      this.dataEdit = dt
      this.BookingDataItemEdit = []
      this.formEdit.masBranchID = dt.masBranchID
      this.formEdit.flowId = dt.flowId
      this.empSelectEdit = parseInt(dt.empSelect)
      this.dueDateOld = this.momenDate_1(dt.dueDate)
      this.dueDateTimeOld = this.momenTime(dt.dueDate)

      this.timeavailable = []
      let dtTime = this.dataFlowSelectEdit.filter(item => { return item.value === this.formEdit.flowId })
      this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
      // let dtTime = await this.branch.filter(item => { return item.value === this.formEdit.masBranchID })
      // this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
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
          this.DNS_IP + '/BookingField/get?shopId=' + this.$session.getAll().data.shopId
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
        if (checkDupliRegNo.length > 0) {
          // console.log('checkDupliRegNo', checkDupliRegNo[0].fieldValue.replace(/ /g, ''))
          await axios
            .get(this.DNS_IP + '/booking_view/getSearchDuplicate?shopId=' + this.$session.getAll().data.shopId + '&fieldValue=' + checkDupliRegNo[0].fieldValue.replace(/ /g, '') +
            '&flowId=' + this.formEdit.flowId + '&dueDate=' + this.dateEdit + '&noBookNo=' + checkDupliRegNo[0].bookNo + '&statusBt=noCancel' + '&checkOnsite=is null')
            .then(response => {
              let rs = response.data
              if (rs.status === false) {
              // this.addDataInsert()
                this.swalConfig.title = 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?'
                this.$swal(this.swalConfig)
                  .then(async result => {
                    let chkStatLimit = this.dataFlowSelectEdit.filter(el => { return el.value === this.formEdit.flowId })
                    if (chkStatLimit.length > 0) {
                      if (chkStatLimit[0].allData.limitBookingCheck === 'True') {
                        let dueOld = this.dueDateOld + this.dueDateTimeOld
                        let dueNew = this.dateEdit + this.timeEdit.value
                        let limitBookingCount = this.timeavailable.filter(el => { return el.value === this.timeEdit.value })
                        console.log('limitBookingCount', limitBookingCount)
                        let limitBookingCounts = 0
                        if (limitBookingCount.length > 0) {
                          limitBookingCounts = parseInt(limitBookingCount[0].limitBooking)
                        } else {
                          limitBookingCounts = 0
                        }
                        if (dueOld !== dueNew) {
                          let chkStatus = await this.updateLimitBookingChange(this.dataEdit, this.dueDateOld, this.dueDateTimeOld, this.dateEdit, this.timeEdit.value, limitBookingCounts)
                          console.log('chkStatus', chkStatus)
                          if (chkStatus.status) {
                            this.editDataSelectSubmit()
                          } else {
                            this.$swal('ผิดพลาด', 'เวลาที่ท่านเลือกคิวเต็มแล้ว', 'error')
                            this.loadingEdit = false
                          }
                        } else {
                          this.editDataSelectSubmit()
                        }
                      } else {
                        this.editDataSelectSubmit()
                      }
                    } else {
                      this.editDataSelectSubmit()
                    }
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
      if (this.$session.id() !== undefined) {
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
            update.shopId = this.$session.getAll().data.shopId
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
                update.shopId = this.$session.getAll().data.shopId
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
                update.shopId = this.$session.getAll().data.shopId
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
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
      // }
    },
    async getDataCalendaBooking () {
      console.log('this.$session.id()', this.$session.id())
      if (this.$session.id() !== undefined) {
        console.log('getDataCalendaBooking')
        try {
          await this.$refs.CalendarBooking.getDataReturn('&checkOnsite=is null', this.dateStart, this.masBranchID, this.flowSelect)
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
      this.remark = ''
      let _this = this
      this.setTimerCalendar = setInterval(function () { _this.getDataCalendaBooking() }, 20000)
      // var _this = this
      // this.setTimerCalendar = setInterval(function () { _this.getDataCalendaBooking() }, 30000)
      this.dialogAdd = true
      setTimeout(() => this.getDataCalendaBooking(), 1000)
      if (this.branch.length === 0) {
        this.getDataBranch()
      }
      this.getBookingField()
      this.checkTime()
    },
    async getDataDefault () {
      this.loadingRefresh = true
      await this.getDataBranch()
      await this.getEmpSelectAdd()
      this.getCustomFieldStart()
      this.getDataFlow()
      await this.getBookingList()
      // await this.getTimesChange('update')
      this.getSelect(this.getSelectText, this.getSelectCount)
      // this.getDataCalendaBooking()
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
      // console.log('dataFlowSelectAdd', this.dataFlowSelectAdd)
      let dtTime = this.dataFlowSelectAdd.filter(item => { return item.value === this.formAdd.flowId })
      // let dtTime = this.branch.filter(item => { return item.value === this.formAdd.masBranchID })
      // console.log('test', dtTime)
      this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
      // console.log('timevailable', this.timeavailable)
    },
    checkTimeEdit () {
      this.timeavailable = []
      let dtTime = this.dataFlowSelectEdit.filter(item => { return item.value === this.formEdit.flowId })
      // let dtTime = this.branch.filter(item => { return item.value === this.formEdit.masBranchID })
      // console.log('test', dtTime)
      this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
      // console.log('timevailable', this.timeavailable)
    },
    checkTimeFlow (dt) {
      this.timeavailable = []
      // let dtTime = this.branch.filter(item => { return item.value === this.masBranchID })
      let dtTime = this.DataFlowName.filter(item => { return item.value === dt.flowId })
      // console.log('test', JSON.parse(dtTime.map(item => item.allData.setTime)))
      this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
      // console.log('timevailable', this.timeavailable)
    },
    // checkTime () {
    //   this.timeavailable = []
    //   let dtTime = this.branch.filter(item => { return item.value === this.formAdd.masBranchID })
    //   // console.log('test', dtTime)
    //   this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
    //   // console.log('timevailable', this.timeavailable)
    // },
    // checkTimeEdit () {
    //   this.timeavailable = []
    //   let dtTime = this.branch.filter(item => { return item.value === this.formEdit.masBranchID })
    //   // console.log('test', dtTime)
    //   this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
    //   // console.log('timevailable', this.timeavailable)
    // },
    // checkTimeFlow () {
    //   this.timeavailable = []
    //   let dtTime = this.branch.filter(item => { return item.value === this.masBranchID })
    //   this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
    // },
    async confirmRemark (item, text) {
      let dt = null
      if (text === 'inAdvance') {
        this.loadingConfirmDay = true
        dt = {
          remarkConfirm1: item.remarkConfirm1,
          LAST_USER: this.session.data.userName
        }
      } else if (text === 'inDay') {
        this.loadingConfirmDay = true
        dt = {
          remarkConfirm2: item.remarkConfirm2,
          LAST_USER: this.session.data.userName
        }
      } else if (text === 'extraJob') {
        this.loadingConfirmDay = true
        dt = {
          fastTrack: (item.extraJob) ? false : item.fastTrack,
          extraJob: item.extraJob,
          LAST_USER: this.session.data.userName
        }
      } else if (text === 'fastTrack') {
        this.loadingConfirmDay = true
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
            this.loadingConfirmDay = false
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
    exportExcelMazda () {
      const url = `${window.location.origin}/mazda/report?shopId=${this.$session.getAll().data.shopId}&masBranchID=${this.masBranchID}&timeTable=${this.timeTable}&checkOnsite=is null`
      window.open(url, '_blank').focus()
    },
    exportExcel () {
      let dataExport = []
      this.dataexport = []
      let runNo = 0
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
            if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
            return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
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

            s.type = this.dataTypeJob3
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
            s.extraJob = t.extraJob ? this.dataTypeJob2 : ''
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
            if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
            return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
          })
          console.log('datauseSelect2', datauseSelect2)
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
            if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
            return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
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
            s.type = this.dataTypeJob3
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
            s.extraJob = t.extraJob ? this.dataTypeJob2 : ''
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
            if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
            return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
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
      if (this.$route.query.shopId === this.$session.getAll().data.shopId) {
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
      let dateCurrent = this.momenDate_1(new Date())
      let dueDate = this.momenDate_1(item.dueDate)
      if (dateCurrent >= dueDate) {
        this.statusConfirmJob = true
      } else {
        this.dueDate = item.dueDate
        this.statusConfirmJob = false
      }
      if (this.statusConfirmJob) {
        let checkStep = await axios.get(this.DNS_IP + '/flowStep/get?flowId=' + item.flowId)
        console.log('checkStep', checkStep)
        if (checkStep.data.status === false) {
          this.endDate = this.momenDate_1(new Date())
          this.endTime = this.momenTime(new Date())
          this.statusShowDateConfiremjob = false
        } else {
          this.statusShowDateConfiremjob = true
        }
        this.dataQrcode = item
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
            this.$session.getAll().data.shopId +
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
              this.checkTimeFlow(item)
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
      }
    },
    async getDataFromAPI (url, fieldId, fieldName, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.$session.getAll().data.shopId}${param}`)
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
    // async getDataFlow () {
    //   this.DataFlowName = await this.getDataFromAPI('/flow/get', 'flowId', 'flowName', '&checkOnsite=is null')
    // },
    async getDataFlow () {
      let result = []
      let resultOption = []
      await axios
        .get(this.DNS_IP + `/flow/get?shopId=${this.$session.getAll().data.shopId}&checkOnsite=is null`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            // result.push({ text: 'ทั้งหมด', value: 'AllFlow' })
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.flowName
              s.value = d.flowId
              s.allData = d
              result.push(s)
              resultOption.push(s)
              // console.log('this.DataFlowName', this.DataFlowName)
            }
          } else {
            result = []
            resultOption = []
          }
        })
      this.DataFlowName = result
      this.dataFlowSelectAdd = resultOption
      this.dataFlowSelectEdit = resultOption
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
            this.$session.getAll().data.shopId +
            '&masBranchID=' +
            this.masBranchIDExport +
            '&dateRange=' + new Date(this.dateRange.startDate).toISOString().substr(0, 10) + '/' + new Date(this.dateRange.endDate).toISOString().substr(0, 10) + '&checkOnsite=is null'
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
      // this.dataItemTimesChange = []
      this.columnsSelected = []
      console.log('text', text)
      // if (count > 0) {
      if (text === 'all') {
        // this.dataItemSelect = this.dataItem
        if (this.dataItem.length > 0) {
          this.checkSelectText = this.dataItem[0].statusBt
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
                    // convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                    if (JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue }).length === 0) {
                      convertTextField = tempField[0].fieldValue || ''
                    } else {
                      convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                    }
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
          { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
          { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' },
          { text: 'หมายเหตุที่ยกเลิก', value: 'remarkRemove', sortable: false, align: 'center' },
          { text: 'ชื่อพนักงาน', value: 'empFull_NameTH', align: 'center' },
          { text: 'หมายเหตุเพิ่มเติม', value: 'remark', align: 'center' }
          // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
          // { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' }
          // { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
        ]
      } else {
        var dataSelect = []
        if (text === 'confirmSum') {
          dataSelect = this.dataItem.filter(el => { return el.statusBt === 'confirm' || el.statusBt === 'confirmJob' })
        } else {
          dataSelect = this.dataItem.filter(el => { return el.statusBt === text })
        }
        // console.log('fieldflow', dataSelect)
        if (dataSelect.length > 0) {
          this.checkSelectText = dataSelect[0].statusBt
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
                      // convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                      if (JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue }).length === 0) {
                        convertTextField = tempField[0].fieldValue || ''
                      } else {
                        convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
                      }
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
            // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
            // { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' }
            // { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
          ]
        } else if (text === 'confirm' || text === 'confirmSum') {
          this.columnsSelected = [{ text: 'จัดการ', value: 'action', sortable: false, align: 'center' },
            // { text: 'Booking Id', value: 'bookNo' },
            { text: 'วันและเวลานัดหมาย', value: 'dueDateText' },
            // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
            { text: 'ชื่อบริการ', value: 'flowNameShow' },
            { text: 'ชื่อลูกค้า', value: 'cusName' },
            { text: 'เบอร์โทร', value: 'tel' },
            { text: 'ทะเบียนรถ', value: 'cusReg' },
            { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
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
            { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
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
                    this.$session.getAll().data.shopId +
                    '&masBranchID=' +
                    this.masBranchID +
                    '&dueDate=' + moment(moment(this.timeTable, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD') + '&checkOnsite=is null&flowId=' + this.flowSelect
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
                    s.dueDateTimeStamp = d.dueDateTimeStamp
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
                } else {
                  // console.log('month new if')
                  this.dataItemCheck = dataItems
                  this.dataItemTimesChange = this.dataItemCheck.sort((a, b) => {
                    if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
                    return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
                  })
                  console.log('this.dataItemCheck', this.dataItemCheck)
                  this.dataRemoveExport = this.dataItemTimesChange.filter(el => { return el.statusBt === 'cancel' })
                  // console.log('this.dataRemoveExport', this.dataRemoveExport)
                }
              })
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    // async getTimesChange (text) {
    //   try {
    //     this.dataItemTimesChange = []
    //     this.dataRemoveExport = []
    //     // console.log('this.dataItem', this.dataItem.filter(el => { return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable }))
    //     if (text === 'all') {
    //       this.dataItemTimesChange = this.dataItem
    //       this.dataRemoveExport = this.dataItemTimesChange.filter(el => { return el.statusBt === 'cancel' })
    //       this.BookingDataListTimechange = this.BookingDataList
    //     } else {
    //       if (moment(moment(this.timeTable, 'YYYY-MM').toDate()).format('YYYY-MM') === this.dateStart) {
    //         console.log('month old')
    //         this.dataItemTimesChange = this.dataItem.filter(el => {
    //           let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
    //           return dueDate === this.timeTable
    //         // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
    //         }).sort((a, b) => {
    //           if (a.timeDuetext < b.timeDuetext) return -1
    //           return a.timeDuetext > b.timeDuetext ? 1 : 0
    //         })
    //         this.BookingDataListTimechange = this.BookingDataList
    //       } else {
    //         var data = this.dataItemCheck.filter(el => {
    //           let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
    //           return dueDate === this.timeTable
    //         // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
    //         })
    //         console.log('data', data)
    //         if (data.length === 0) {
    //           if (this.masBranchID) {
    //             this.masBranchID = this.masBranchID
    //           } else {
    //             if (this.branch.length > 0) {
    //               this.masBranchID = this.branch[0].value
    //             } else {
    //               this.masBranchID = ''
    //             }
    //           }
    //           this.dataItemCheck = []
    //           var dataItems = []
    //           if (this.timeTable !== '') {
    //             var dateStart = moment(moment(this.timeTable, 'YYYY-MM').toDate()).format('YYYY-MM')
    //             console.log('dateStartxx', dateStart)
    //             await this.getBookingDataListTimechange(dateStart)

    //             // var dataItemTimes = []
    //             await axios
    //               .get(
    //               // eslint-disable-next-line quotes
    //                 this.DNS_IP +
    //                 '/booking_view/get?shopId=' +
    //                 this.$session.getAll().data.shopId +
    //                 '&masBranchID=' +
    //                 this.masBranchID +
    //                 '&dueDate=' + moment(moment(this.timeTable, 'YYYY-MM').toDate()).format('YYYY-MM')
    //               )
    //               .then(async response => {
    //                 console.log('getData', response.data)
    //                 if (response.data.length > 0) {
    //                   for (let i = 0; i < response.data.length; i++) {
    //                     let d = response.data[i]
    //                     let s = {}
    //                     s.bookNo = d.bookNo
    //                     s.flowId = d.flowId
    //                     s.flowName = d.flowName
    //                     s.dueDate = d.dueDate
    //                     s.remarkRemove = d.remarkRemove
    //                     s.userId = d.userId
    //                     s.chkConfirm = false
    //                     s.chkCancel = false
    //                     s.jobNo = d.jobNo
    //                     s.extraJob = (d.extraJob === 'true' || d.extraJob === 'True')
    //                     s.fastTrack = (d.fastTrack === 'true' || d.fastTrack === 'True')
    //                     s.remarkRemove = d.remarkRemove || ''
    //                     s.timeDueHtext = d.timeDueH + ':00'
    //                     s.timeDuetext = d.timeDue
    //                     if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
    //                       s.chkConfirm = true
    //                       s.chkCancel = false
    //                     }
    //                     if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
    //                       s.chkConfirm = false
    //                       s.chkCancel = true
    //                     }
    //                     s.statusBt = d.statusBt || 'wait'
    //                     switch (d.statusBt) {
    //                       case 'confirm':
    //                         s.statusBtText = 'ยืนยันแล้ว'
    //                         break
    //                       case 'cancel':
    //                         s.statusBtText = 'ยกเลิก'
    //                         break
    //                       case 'confirmJob':
    //                         s.statusBtText = 'รับรถแล้ว'
    //                         break
    //                       default:
    //                         s.statusBtText = 'รายการนัดหมายใหม่'
    //                         break
    //                     }
    //                     // let dataBookingData = []
    //                     // await axios
    //                     //   .get(
    //                     //     this.DNS_IP + `/BookingData/getView?bookNo=${d.bookNo}`
    //                     //   )
    //                     //   .then(async responses => {
    //                     //     dataBookingData = responses.data
    //                     //   })
    //                     s.cusName = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'ชื่อ')
    //                     s.cusReg = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'เลขทะเบียน')
    //                     s.tel = this.getDataFromFieldName(this.BookingDataListTimechange[d.bookNo], 'เบอร์โทร')
    //                     s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
    //                     s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
    //                     s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
    //                     // var chkTime = this.dataItemTime.filter(el => { return el.timeDueHtext === s.timeDueHtext })
    //                     // if (chkTime.length === 0) {
    //                     //   dataItemTimes.push(s)
    //                     // }
    //                     dataItems.push(s)
    //                   }
    //                 }
    //                 if (dataItems.length === 0 || dataItems.status === false) {
    //                   this.dataItemCheck = []
    //                 // this.dataItemTime = []
    //                 // this.dataReady = true
    //                 // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
    //                 } else {
    //                 // console.log('month new if')
    //                   console.log('month new if', dataItems)
    //                   this.dataItemCheck = dataItems
    //                   this.dataItemTimesChange = this.dataItemCheck.filter(el => {
    //                     let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
    //                     return dueDate === this.timeTable
    //                   // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
    //                   }).sort((a, b) => {
    //                     if (a.timeDuetext < b.timeDuetext) return -1
    //                     return a.timeDuetext > b.timeDuetext ? 1 : 0
    //                   })
    //                 }
    //               })
    //           }
    //         } else {
    //           console.log('month new else')
    //           this.dataItemTimesChange = this.dataItemCheck.filter(el => {
    //             let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
    //             return dueDate === this.timeTable
    //             // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
    //           }).sort((a, b) => {
    //             if (a.timeDuetext < b.timeDuetext) return -1
    //             return a.timeDuetext > b.timeDuetext ? 1 : 0
    //           })
    //         }
    //       }
    //       this.dataRemoveExport = this.dataItemTimesChange.filter(el => { return el.statusBt === 'cancel' })
    //       console.log('this.dataRemoveExport', this.dataRemoveExport)
    //     }
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },
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
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.$session.getAll().data.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
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
        url = `${this.DNS_IP}/BookingData/getsearchOther?shopId=${this.$session.getAll().data.shopId}&fieldValue=${searchOther}`
      } else {
        url = `${this.DNS_IP}/BookingData/getView?shopId=${this.$session.getAll().data.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
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
          // this.dataEditReady = true
          setTimeout(() => this.getBookingDataList(dateStart, searchOther), 3000)
          console.log('catch getBookingDataList : ', error)
        })
      console.log('this.BookingDataList1', this.BookingDataList)
    },
    async getBookingList () {
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null

      if (this.masBranchID) {
        this.masBranchID = this.masBranchID
      } else {
        if (this.branch.length > 0) {
          this.masBranchID = this.branch[0].value
        } else {
          this.masBranchID = ''
          await this.getDataBranch()
          this.masBranchID = this.branch[0].value
          // this.getBookingList()
        }
      }
      if (this.flowSelect !== '') {
        this.flowSelect = this.flowSelect
      } else {
        if (this.DataFlowName.length > 0) {
          this.flowSelect = this.DataFlowName[0].value
        } else {
          this.flowSelect = ''
          await this.getDataFlow()
          this.flowSelect = this.DataFlowName[0].value
          // this.getBookingList()
        }
      }
      console.log('this.flowSelect', this.flowSelect)
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
            this.$session.getAll().data.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&dueDate=' +
            this.dateStart + '&checkOnsite=is null&flowId=' + this.flowSelect
        )
        .then(async response => {
          console.log('getData', response.data.length)
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let d = response.data[i]
              let s = {}
              if (this.BookingDataList[d.bookNo] !== undefined) {
                s.bookNo = d.bookNo
                s.flowId = d.flowId
                s.flowName = d.flowName
                s.dueDate = d.dueDate || ''
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
                s.lineUserId = d.lineUserId
                s.timeDueHtext = d.timeDueH + ':00'
                s.timeDuetext = d.timeDue
                s.countChangeTime = d.countChangeTime || 0
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
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.$session.getAll().data.shopId}&masBranchID=${this.masBranchID}&statusBt=is null`
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
                this.$session.getAll().data.shopId +
                '&masBranchID=' +
                this.masBranchID +
                '&statusBt=null&checkOnsite=is null&flowId=' + this.flowSelect
        )
        .then(async responses => {
          if (responses.data.length > 0) {
            // console.log('length', responses.data.length)
            for (let i = 0; i < responses.data.length; i++) {
              let d = responses.data[i]
              let s = {}
              if (this.BookingDataList[d.bookNo] !== undefined) {
                s.bookNo = d.bookNo
                s.flowId = d.flowId
                s.flowName = d.flowName
                s.dueDate = d.dueDate || ''
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
                s.lineUserId = d.lineUserId
                s.timeDueHtext = d.timeDueH + ':00'
                s.timeDuetext = d.timeDue
                s.countChangeTime = d.countChangeTime || 0
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
                // console.log('this.countWaiting', this.countWaiting)
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
          this.DNS_IP + '/BookingField/get?shopId=' + this.$session.getAll().data.shopId
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
    async getflowfield (item) {
      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP +
            '/flowField/get?flowId=' +
            item.flowId +
            '&shopId=' +
            this.$session.getAll().data.shopId
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
            console.log('cccxxx', s)
            console.log('chk', chk)
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
        let limitBookingCheck = ''
        if (this.checkLimitBooking.limitCheck === 'true' || null) {
          limitBookingCheck = 'True'
        } else {
          limitBookingCheck = 'False'
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
            update.dateSelect = this.date
            update.timeSelect = this.time.value
            update.timeText = this.time.text
            update.userId = 'user-skip'
            update.pageName = 'BookingList'
            update.sourceLink = 'direct'
            update.fastTrack = fastTrack
            update.extraJob = extraJob
            update.empSelect = this.empSelectAdd
            update.adminLogin = this.session.data.userName
            update.limitBookingCheck = limitBookingCheck
            update.limitBookingId = this.checkLimitBooking.ID
            update.limitBookingCount = this.checkLimitBooking.countBooking
            update.getLimitBooking = this.checkLimitBooking.limitBooking
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
                update.dateSelect = this.date
                update.timeSelect = this.time.value
                update.timeText = this.time.text
                update.sourceLink = 'direct'
                update.userId = 'user-skip'
                update.pageName = 'BookingList'
                update.fastTrack = fastTrack
                update.extraJob = extraJob
                update.empSelect = this.empSelectAdd
                update.adminLogin = this.session.data.userName
                update.limitBookingCheck = limitBookingCheck
                update.limitBookingId = this.checkLimitBooking.ID
                update.limitBookingCount = this.checkLimitBooking.countBooking
                update.getLimitBooking = this.checkLimitBooking.limitBooking
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
                update.dateSelect = this.date
                update.timeSelect = this.time.value
                update.timeText = this.time.text
                update.sourceLink = 'direct'
                update.userId = 'user-skip'
                update.pageName = 'BookingList'
                update.fastTrack = fastTrack
                update.extraJob = extraJob
                update.empSelect = this.empSelectAdd
                update.adminLogin = this.session.data.userName
                update.limitBookingCheck = limitBookingCheck
                update.limitBookingId = this.checkLimitBooking.ID
                update.limitBookingCount = this.checkLimitBooking.countBooking
                update.getLimitBooking = this.checkLimitBooking.limitBooking
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
            await this.confirmChkAdd(response.data)
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
            await axios
              .get(this.DNS_IP + '/booking_view/getSearchDuplicate?shopId=' + this.$session.getAll().data.shopId + '&fieldValue=' + checkDupliRegNo[0].fieldValue.replace(/ /g, '') +
            '&flowId=' + this.formAdd.flowId + '&dueDate=' + this.date + '&statusBt=noCancel' + '&checkOnsite=is null')
              .then(async response => {
                let rs = response.data
                if (rs.status === false) {
                  if (this.DataFlowName.filter(item => { return item.value === this.formAdd.flowId })[0].allData.limitBookingCheck === 'True') {
                    await this.checkLimit()
                    console.log('this.checkLimitBooking.limitCheck', this.checkLimitBooking)
                    // console.log('test', this.branchData.filter(item => { return item.masBranchID === this.formAdd.masBranchID })[0].setTime)
                    if (this.checkLimitBooking.limitCheck === 'true') {
                      this.dialogAddCon = true
                    } else if (this.checkLimitBooking.limitCheck === 'false') {
                      console.log('else1402')
                      this.$swal('คิวเต็มแล้ว', 'กรุณาเลือกวันที่ใหม่อีกครั้ง', 'error')
                      this.date = ''
                      this.time = ''
                    } else {
                      this.checkLimitBooking.limitCheck = 'true'
                      this.dialogAddCon = true
                      console.log('else1407')
                    }
                  } else {
                    this.checkLimitBooking.limitCheck = 'false'
                    this.dialogAddCon = true
                    console.log('else1407')
                  }
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
            if (this.DataFlowName.filter(item => { return item.value === this.formAdd.flowId })[0].allData.limitBookingCheck === 'True') {
              await this.checkLimit()
              // console.log('test', this.branchData.filter(item => { return item.masBranchID === this.formAdd.masBranchID })[0].setTime)
              if (this.checkLimitBooking.limitCheck === 'true') {
                this.dialogAddCon = true
              } else if (this.checkLimitBooking.limitCheck === 'false') {
                console.log('else1402')
                this.$swal('คิวเต็มแล้ว', 'กรุณาเลือกวันที่ใหม่อีกครั้ง', 'error')
                this.date = ''
                this.time = ''
              } else {
                this.checkLimitBooking.limitCheck = 'true'
                this.dialogAddCon = true
                console.log('else1407')
              }
            } else {
              this.checkLimitBooking.limitCheck = 'false'
              this.dialogAddCon = true
            }
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
    async confirmChkAdd (item) {
      console.log('item', item)
      var dt = {
        bookNo: item.bookNo,
        contactDate: this.format_date(new Date()),
        status: 'confirm',
        statusUse: 'use',
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.session.data.userName,
        LAST_USER: this.session.data.userName
      }
      await axios
        .post(this.DNS_IP + '/booking_transaction/add', dt)
        .then(async response => {
          // this.getDataCalendaBooking()
          this.clearDataAdd()
          this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
          // await this.getBookingList()
          // this.getTimesChange('update')
        })
        .catch(error => {
          console.log('error function addData : ', error)
          setTimeout(() => this.confirmChkAdd(), 3000)
        })
    },
    async clearDataAdd () {
      this.dataReady = true
      this.date = ''
      this.time = ''
      this.empSelectAdd = ''
      this.remark = ''
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
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
      if (this.statusSearch === 'no') {
        this.getBookingList()
      } else {
        this.searchAny()
      }
      if (this.getSelectText) {
        this.getSelect(this.getSelectText, this.getSelectCount)
      }
      this.getDataCalendaBooking()
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
      this.checkTimeFlow(dt)
      this.BookingDataItem = []
      let itemIncustomField = []
      this.statusConfirmJob = false
      this.dueDate = dt.dueDate
      let dateCurrent = this.momenDate_1(new Date())
      let dueDate = this.momenDate_1(dt.dueDate)
      if (dateCurrent >= dueDate) {
        this.statusConfirmJob = true
      } else {
        this.statusConfirmJob = false
      }
      console.log('this.statusConfirmJob', this.statusConfirmJob)
      if (this.statusConfirmJob) {
        await axios
          .get(
            this.DNS_IP + '/BookingField/get?shopId=' + this.$session.getAll().data.shopId
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
                              d.shopId = this.$session.getAll().data.shopId
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
              d.shopId = this.$session.getAll().data.shopId
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
    addDataJob () {
      this.validate('UPDATE')
      setTimeout(() => this.addDataJobSubmit(), 500)
    },
    async addDataJobSubmit () {
      if (this.$session.id() !== undefined) {
        if (this.dataItem.filter(row => row.bookNo === this.BookingDataItem[0].bookNo).length > 0) {
          if (this.validUpdate === true) {
            let checkJobno = ''
            await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + this.BookingDataItem[0].bookNo)
              .then(async response => {
                let rs = response.data
                console.log('checkJobNoInBooking', rs)
                if (rs.status === false) {
                  checkJobno = 'ไม่มีข้อมูล'
                } else {
                  checkJobno = rs[0].jobNo || ''
                }
              })
            if (checkJobno === '') {
              console.log('this.BookingDataItem', this.BookingDataItem)
              let Add = []
              let fielditem = this.flowfieldNameitem
              console.log('fielditem', fielditem)
              for (var i = 0; i < this.BookingDataItem.length; i++) {
                var d = this.BookingDataItem[i]
                let update = {}
                let addData = false
                var dataField = this.editedItemSeleteField.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
                if (dataField[0].conditionField === '' || dataField[0].conditionField === null) {
                  addData = true
                } else {
                  if (fielditem.filter(row => { return row.fieldId === parseInt(d.conditionField) }).length > 0) {
                    console.log('this', fielditem)
                    if (d.conditionValue === fielditem.filter(row => { return row.fieldId === parseInt(d.conditionField) })[0].fieldValue) {
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
                    update.masBranchID = this.BookingDataItem[0].masBranchID || ''
                    update.CREATE_USER = d.userName
                    update.LAST_USER = d.userName
                    update.packageId = d.packageId
                    update.checkCar = ''
                    // update.userId = d.userId
                    update.endDate = this.endDate
                    update.endTime = this.endTime.value
                    update.fieldId = d.fieldId
                    update.fieldName = d.fieldName
                    update.fieldType = dataField[0].fieldType || ''
                    update.fieldValue = d.fieldValue
                    update.flowId = d.flowId
                    update.empSelect = this.empSelectJob
                    update.conditionField = dataField[0].conditionField || ''
                    update.conditionValue = dataField[0].conditionValue || ''
                    update.optionField = dataField[0].optionField || ''
                    update.shopId = dataField[0].shopId || ''
                    update.showCard = dataField[0].showCard || ''
                    Add.push(update)
                  }
                }
              }
              for (var x = 0; x < fielditem.length; x++) {
                var t = fielditem[x]
                if (Add.filter(row => { return row.fieldId === t.fieldId }).length === 0) {
                  let update = {}
                  let dataField = this.editedItemSeleteField.filter(el => { return parseInt(el.fieldId) === parseInt(t.fieldId) })
                  update.masBranchID = this.BookingDataItem[0].masBranchID || ''
                  update.CREATE_USER = Add[0].CREATE_USER
                  update.LAST_USER = Add[0].CREATE_USER
                  update.packageId = Add[0].packageId
                  update.checkCar = ''
                  // update.userId = Add[0].userId
                  update.endDate = this.endDate
                  update.endTime = this.endTime.value
                  update.fieldId = t.fieldId
                  update.fieldName = t.fieldName
                  update.fieldType = dataField[0].fieldType || ''
                  update.fieldValue = t.fieldValue
                  update.flowId = d.flowId
                  update.empSelect = this.empSelectJob
                  update.conditionField = dataField[0].conditionField || ''
                  update.conditionValue = dataField[0].conditionValue || ''
                  update.optionField = dataField[0].optionField || ''
                  update.shopId = dataField[0].shopId || ''
                  update.showCard = dataField[0].showCard || ''
                  Add.push(update)
                }
              }
              console.log('this.Add', Add)
              this.swalConfig.title = 'ต้องการนำรายการนี้ เข้าตารางใช่หรือไม่?'
              this.$swal(this.swalConfig)
                .then(async result => {
                  this.dataEditJobReady = false
                  await axios
                    .post(this.DNS_IP + '/job/add', Add)
                    .then(async response => {
                      this.endDate = ''
                      this.endTime = ''
                      this.empSelectJob = ''
                      this.statusShowDateConfiremjob = true
                      if (response.data.status) {
                        var dt = {
                          bookNo: this.BookingDataItem[0].bookNo,
                          statusJob: 'job',
                          jobNo: response.data.jobNo
                        }
                        await axios
                          .post(
                            this.DNS_IP +
                    '/Booking/editStatus/' +
                    this.BookingDataItem[0].bookNo,
                            dt
                          )
                          .then(async response1 => {
                            await this.pushMsg(response.data.jobNo)
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
                                this.$swal('เรียบร้อย', 'นำเข้าสำเร็จ', 'success')
                                if (this.statusSearch === 'no') {
                                  await this.getBookingList()
                                } else {
                                  await this.searchAny()
                                }
                                this.dialogEdit = false
                                this.dataEditJobReady = true
                                let dataBooking = await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + this.dataQrcode.bookNo)
                                // var dataJob = dataBooking.filter(el => { return el.bookNo === this.dataQrcode.bookNo })
                                if (dataBooking.data.status === false) {
                                  console.log(dataBooking)
                                } else {
                                  this.getjob(dataBooking.data[0])
                                  this.dialogJob = true
                                }
                              })
                          })
                      } else {
                        this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
                        this.dialogEdit = false
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
                    }).catch(error => {
                      setTimeout(() => this.addDataJobSubmit(), 3000)
                      console.log('error function addData : ', error)
                    })
                })
            } else {
              this.$swal('ผิดพลาด', 'รายการนี้ได้นำเข้ากระดานการทำงานแล้ว', 'error').then(async response => {
                this.dialogEdit = false
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
                this.dialogEdit = false
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
          }
        } else {
          this.$swal('ผิดพลาด', 'ไม่มีนัดหมายเข้ารับบริการนี้', 'error').then(async response => {
            this.dialogEdit = false
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
            this.dialogEdit = false
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
    async pushMsg (jobNo) {
      const result = await axios
        .get(
          this.DNS_IP +
            '/member/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&liffUserId=' +
            this.BookingDataItem[0].userId
        )
        .catch(error => {
          console.log('error function addData : ', error)
        })
      console.log('result', result.data.status)
      if (result.data.status === false) {
        let statusSend = {
          statusSend: 'false'
        }
        await axios.post(this.DNS_IP + '/job/updateJobNo/' + jobNo, statusSend)
        console.log('statusSend', 'false')
        let updateStatusSend = {
          updateStatusSend: 'false'
        }
        await axios
          .post(
            this.DNS_IP + '/job/NotifyQrcode/' + jobNo,
            updateStatusSend
          )
          .then(
            // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
          )
          .catch(error => {
            console.log('error function addDataGlobal : ', error)
          })
      } else {
        let updateStatusSend = {
          updateStatusSend: 'true'
        }
        await axios
          .post(
            this.DNS_IP + '/job/NotifyQrcode/' + jobNo,
            updateStatusSend
          )
          .then(
            // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
          )
          .catch(error => {
            console.log('error function addDataGlobal : ', error)
          })
      }
    },
    async getEmpSelect (item) {
      this.empSelectStep = []
      await axios
        .get(this.DNS_IP + '/empSelect/getUse?privacyPage=booking&shopId=' + item.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              var s = {}
              s.text = d.empFirst_NameTH
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
        .get(this.DNS_IP + '/empSelect/getUse?privacyPage=booking&shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              var s = {}
              s.text = d.empFirst_NameTH
              s.value = d.empId
              s.allData = d
              this.empSelectStepAdd.push(s)
            }
          }
        })
    },
    async confirmChk (item) {
      this.dataConfirm = item
      this.remark = item.remark
      await this.getEmpSelect(item)
      this.dialogConfirm = true
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
              this.pushMsgConfirm(item.bookNo)
              // let pushText = {
              //   'to': item.lineUserId,
              //   'messages': [
              //     {
              //       'type': 'text',
              //       'text': ` ✍️ ยืนยันเวลานัดหมาย\n ✅ ชื่อ : ${item.cusName}\n ✅ เลขทะเบียน : ${item.cusReg}
              //             \nวันเดือนปี ${this.format_dateFUllTime(item.dueDate)}`
              //     }
              //   ]
              // }
              // axios
              //   .post(
              //     this.DNS_IP + '/line/pushmessage?shopId=' + this.$session.getAll().data.shopId,
              //     pushText
              //   )
              //   .catch(error => {
              //     console.log('error function addData : ', error)
              //   })
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
        remark: (this.remark || '').replace(/%/g, '%%').replace(/'/g, "\\'")
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
      this.dueDateOld = this.momenDate_1(item.dueDate)
      this.dueDateTimeOld = this.momenTime(item.dueDate)
      await this.getEmpSelect(item)
      this.dialogRemove = true
    },
    cancelChk () {
      this.validate('REMOVE')
      setTimeout(() => this.onCancelChk(), 500)
    },
    async updateLimitBookingCancel (item, dueDateOld, dueDateTimeOld) {
      let result = []
      let dt = {
        flowId: item.flowId,
        dateSelect: dueDateOld,
        timeSelect: dueDateTimeOld,
        shopId: item.shopId,
        userId: item.userId
      }
      await axios.post(this.DNS_IP + '/Booking/updateLimitBookingCancel', dt).then(async response => {
        result = response.data
      })
      return result
    },
    async onCancelChk () {
      if (this.validRemove === true) {
        if (this.$session.id() !== undefined) {
          let chkStatLimit = this.DataFlowName.filter(el => { return el.value === this.bookNoRemove.flowId })
          if (chkStatLimit.length > 0) {
            if (chkStatLimit[0].allData.limitBookingCheck === 'True') {
              // let dueOld = this.dueDateOld + this.dueDateTimeOld
              // let limitBookingCount = this.timeavailable.filter(el => { return el.value === this.formChange.time.value })
              // console.log('limitBookingCount', limitBookingCount)
              // let limitBookingCounts = 0
              // if (limitBookingCount.length > 0) {
              //   limitBookingCounts = parseInt(limitBookingCount[0].limitBooking)
              // } else {
              //   limitBookingCounts = 0
              // }
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
        } else {
          this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
          clearInterval(this.setTimerCalendar)
          this.setTimerCalendar = null
          this.$router.push('/Core/Login')
        }
      }
    },
    onCancelChkSubmit () {
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
          // this.getDataCalendaBooking()
          this.dataCancelReady = true
          this.dialogRemove = false
          this.remarkRemove = ''
          this.bookNo = ''
        })
        .catch(error => {
          console.log('error function addData : ', error)
          this.dataCancelReady = true
        })
    },
    // onCancelChk () {
    //   if (this.validRemove === true) {
    //     if (this.$session.id() !== undefined) {
    //       this.dataCancelReady = false
    //       var dt = {
    //         bookNo: this.bookNoRemove.bookNo,
    //         contactDate: this.format_date(new Date()),
    //         status: 'cancel',
    //         statusUse: 'use',
    //         shopId: this.$session.getAll().data.shopId,
    //         CREATE_USER: this.session.data.userName,
    //         LAST_USER: this.session.data.userName,
    //         remarkRemove: (this.remarkRemove || '').replace(/%/g, '%%')
    //       }
    //       axios
    //         .post(this.DNS_IP + '/booking_transaction/add', dt)
    //         .then(async response => {
    //           await this.updateRemark(this.bookNoRemove)
    //           this.$swal('เรียบร้อย', 'ยกเลิกเรียบร้อย', 'success')
    //           console.log('addDataGlobal', response)
    //           if (this.statusSearch === 'no') {
    //             await this.getBookingList()
    //           } else {
    //             await this.searchAny()
    //           }
    //           // this.getTimesChange('update')
    //           if (this.getSelectText) {
    //             this.getSelect(this.getSelectText, this.getSelectCount)
    //           }
    //           this.getDataCalendaBooking()
    //           this.dataCancelReady = true
    //           this.dialogRemove = false
    //           this.remarkRemove = ''
    //           this.bookNo = ''
    //         })
    //         .catch(error => {
    //           console.log('error function addData : ', error)
    //         })
    //     } else {
    //       this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
    //       clearInterval(this.setTimerCalendar)
    //       this.setTimerCalendar = null
    //       this.$router.push('/Core/Login')
    //     }
    //   }
    // },
    async changeChk (item, changeStatus) {
      this.dataChangeReady = false
      if (item.statusBt === 'confirm') {
        if (this.remark !== '') {
          var dt = {
            LAST_USER: this.session.data.userName,
            remark: (this.remark || '').replace(/%/g, '%%').replace(/'/g, "\\'")
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
      this.swalConfig.title = 'ต้องการ เปลี่ยนเวลานัดหมาย ใช่หรือไม่?'
      this.$swal(this.swalConfig).then(async result => {
        if (this.$session.id() !== undefined) {
          let checkCountTime = await axios.get(this.DNS_IP + '/booking_view/get?bookNo=' + item.bookNo)
          console.log('checkCountTime', checkCountTime)
          if (checkCountTime.data.status === false) {
            this.onChangeChk(item, changeStatus)
          } else {
            // Update LimitBooking
            // if (this.formChange.date + ' ' + this.formChange.time.value >= this.format_date(new Date())) {
            let chkStatLimit = this.DataFlowName.filter(el => { return el.value === item.flowId })
            if (chkStatLimit.length > 0) {
              if (chkStatLimit[0].allData.limitBookingCheck === 'True') {
                let dueOld = this.dueDateOld + this.dueDateTimeOld
                let dueNew = this.formChange.date + this.formChange.time.value
                let limitBookingCount = this.timeavailable.filter(el => { return el.value === this.formChange.time.value })
                console.log('limitBookingCount', limitBookingCount)
                let limitBookingCounts = 0
                if (limitBookingCount.length > 0) {
                  limitBookingCounts = parseInt(limitBookingCount[0].limitBooking)
                } else {
                  limitBookingCounts = 0
                }
                if (dueOld !== dueNew) {
                  let chkStatus = await this.updateLimitBookingChange(item, this.dueDateOld, this.dueDateTimeOld, this.formChange.date, this.formChange.time.value, limitBookingCounts)
                  console.log('chkStatus', chkStatus)
                  if (chkStatus.status) {
                    this.onChangeChkSubmit(item, changeStatus, checkCountTime)
                  } else {
                    this.$swal('ผิดพลาด', 'เวลาที่ท่านเลือกคิวเต็มแล้ว', 'error')
                    this.dataChangeReady = true
                  }
                } else {
                  this.onChangeChkSubmit(item, changeStatus, checkCountTime)
                }
              } else {
                this.onChangeChkSubmit(item, changeStatus, checkCountTime)
              }
            } else {
              this.onChangeChkSubmit(item, changeStatus, checkCountTime)
            }
            // } else {
            //   this.onChangeChkSubmit(item, changeStatus, checkCountTime)
            // }
          }
        } else {
          this.dataChangeReady = true
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
    async onChangeChkSubmit (item, changeStatus, checkCountTime) {
      let countTime = 0
      if (checkCountTime) {
        countTime = checkCountTime.data[0].countChangeTime || 0
      }
      let dueOld = this.dueDateOld + this.dueDateTimeOld
      let dueNew = this.formChange.date + this.formChange.time.value
      if (dueOld === dueNew) {
        countTime = countTime + 0
      } else {
        countTime = countTime + 1
      }
      var dtChange = {
        countChangeTime: countTime,
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
                  this.pushMsgConfirm(item.bookNo)
                  // let pushText = {
                  //   'to': item.lineUserId,
                  //   'messages': [
                  //     {
                  //       'type': 'text',
                  //       'text': ` ✍️ ยืนยันเวลานัดหมาย\n ✅ ชื่อ : ${item.cusName}\n ✅ เลขทะเบียน : ${item.cusReg}
                  //         \nวันเดือนปี ${this.format_dateFUllTime(this.formChange.date + ' ' + this.formChange.time.value)}`
                  //     }
                  //   ]
                  // }
                  // axios
                  //   .post(
                  //     this.DNS_IP + '/line/pushmessage?shopId=' + this.$session.getAll().data.shopId,
                  //     pushText
                  //   )
                  //   .catch(error => {
                  //     console.log('error function addData : ', error)
                  //   })
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
              // this.getDataCalendaBooking()
              this.$swal('เรียบร้อย', 'เปลี่ยนเวลานัดหมาย เรียบร้อย', 'success')
              this.dataChangeReady = true
              this.dialogChange = false
            })
            .catch(error => {
              console.log('error function addData : ', error)
            })
        })
    },
    async updateLimitBookingChange (item, dueDateOld, dueDateTimeOld, dueDateNew, dueDateTimeNew, limitBookingCount) {
      let result = []
      let dt = {
        dueDateOld: dueDateOld,
        dueDateTimeOld: dueDateTimeOld,
        dueDateNew: dueDateNew,
        dueDateTimeNew: dueDateTimeNew,
        flowId: item.flowId,
        masBranchID: item.masBranchID,
        dateSelect: dueDateNew,
        timeSelect: dueDateTimeNew,
        shopId: item.shopId,
        userId: item.userId,
        limitBookingCount: limitBookingCount
      }
      await axios.post(this.DNS_IP + '/Booking/updateLimitBookingChangeTime', dt).then(async response => {
        result = response.data
      })
      return result
    },
    async getjob (item) {
      console.log(item)
      this.jobitem = []
      if (item.jobNo !== '') {
        let checkBookingMember = ''
        const result = await axios
          .get(
            this.DNS_IP +
            '/member/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&liffUserId=' +
            item.userId
          )
          .catch(error => {
            console.log('error function addData : ', error)
          })
        console.log('result', result.data)
        if (result.data.status === false) {
          checkBookingMember = ''
        } else {
          checkBookingMember = result.data[0]
        }
        await axios.get(this.DNS_IP + '/job/getJobNo?jobNo=' + item.jobNo).then((response) => {
          let rs = response.data
          let Id = ''
          let memberPicture = ''
          console.log('getJobNo', rs)
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {
                Id: d.jobId,
                value: d.fieldValue,
                name: d.fieldName,
                showCard: d.showCard,
                jobNo: d.jobNo,
                recordStatus: d.RECORD_STATUS
              }
              Id = d.userId || ''
              memberPicture = d.memberPicture || ''
              this.jobitem.push(s)
            }
            let empNameSelect = ''
            let dataCheckEmpSelect = this.empSelectStepAdd.filter(el => { return el.allData.empId === parseInt(rs[0].empSelect) })
            if (dataCheckEmpSelect.length > 0) {
              empNameSelect = dataCheckEmpSelect[0].allData.empFull_NameTH
              this.jobitem.push(
                {
                  Id: rs[0].jobId,
                  value: empNameSelect,
                  name: 'พนักงานที่นำเข้ากระดานทำงาน',
                  showCard: 'True',
                  jobNo: rs[0].jobNo,
                  recordStatus: rs[0].RECORD_STATUS
                }
              )
            }
            // console.log('empNameSelect', empNameSelect)
            // console.log('dataCheckEmpSelect', dataCheckEmpSelect)
            this.userId = Id
            this.memberPicture = memberPicture
            if (checkBookingMember !== '' && this.memberPicture === '') {
              this.checkShowSelectUser = true
              this.dataSelectUser = checkBookingMember
            } else {
              this.checkShowSelectUser = false
              this.dataSelectUser = ''
            }
            this.value = this.pathToweb + this.jobitem[0].Id + '&shopId=' + this.$session.getAll().data.shopId
            console.log('this.value', this.value)
            // this.getUserId()
          }
        })
      }
    },
    async jobConfirm () {
      console.log('this.jobitem[0]', this.jobitem[0])
      this.swalConfig.title = 'ต้องการ ยืนยันข้อมูล ใช่หรือไม่?'
      this.$swal(this.swalConfig)
        .then(async () => {
          if (this.$session.id() !== undefined) {
            await axios
              .post(
                this.DNS_IP + '/job/update/' + this.jobitem[0].Id, this.skip
              ).then(async (response) => {
                console.log(response)
                if (response.data.status) {
                  // let updateStatusSend = {
                  //   updateStatusSend: 'false'
                  // }
                  // await axios
                  //   .post(
                  //     this.DNS_IP + '/job/NotifyQrcode/' + this.jobitem[0].jobNo,
                  //     updateStatusSend
                  //   )
                  //   .then(
                  //     this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                  //     // this.clearData()
                  //     // this.$router.push('/Master/FlowStep')
                  //   )
                  //   .catch(error => {
                  //     console.log('error function addDataGlobal : ', error)
                  //   })
                  // this.getDataCalendaBooking()
                  this.$swal('เรียบร้อย', 'ปรับปรุงเรียบร้อย', 'success')
                  this.dialogJob = false
                } else {
                  this.$swal('ผิดพลาด', 'เนื่องจากรายการนี้มีคนนำเข้าแล้ว', 'error')
                  this.dialogJob = false
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
    async jobConfirmUser () {
      console.log('this.jobitem', this.jobitem)
      console.log('this.BookingDataItem', this.BookingDataItem)
      this.swalConfig.title = 'ต้องการ ยืนยันข้อมูล ใช่หรือไม่?'
      this.$swal(this.swalConfig)
        .then(async () => {
          if (this.$session.id() !== undefined) {
            let dt = {
              userId: this.dataSelectUser.liffUserId
            }
            await axios
              .post(
                this.DNS_IP + '/job/update/' + this.jobitem[0].Id, dt
              ).then(async (response) => {
                console.log(response)
                if (response.data.status) {
                  let statusSend = {
                    statusSend: 'true'
                  }
                  await axios
                    .post(this.DNS_IP + '/job/updateJobNo/' + this.jobitem[0].jobNo, statusSend)
                    .then(async response => {
                    // let lineUserId = result.data[0].lineUserId
                      console.log('statusSend', 'true')
                      let updateStatusSend = {
                        updateStatusSend: 'true'
                      }
                      await axios
                        .post(
                          this.DNS_IP + '/job/pushMsg/' + response.data.jobId,
                          updateStatusSend
                        )
                        .catch(error => {
                          console.log('error function addData : ', error)
                        })
                      // let updateStatusSendNoti = {
                      //   updateStatusSend: 'true'
                      // }
                      // await axios
                      //   .post(
                      //     this.DNS_IP + '/job/NotifyQrcode/' + this.jobitem[0].jobNo,
                      //     updateStatusSendNoti
                      //   )
                      //   .then(
                      //     // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                      //     // this.clearData()
                      //     // this.$router.push('/Master/FlowStep')
                      //   )
                      //   .catch(error => {
                      //     console.log('error function addDataGlobal : ', error)
                      //   })
                    })
                  // this.getDataCalendaBooking()
                  this.$swal('เรียบร้อย', 'ปรับปรุงเรียบร้อย', 'success')
                  this.dialogJob = false
                } else {
                  this.$swal('ผิดพลาด', 'เนื่องจากรายการนี้มีคนนำเข้าแล้ว', 'error')
                  this.dialogJob = false
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
    async pushMsgSelectUser () {
      let statusSend = {
        statusSend: 'false'
      }
      await axios.post(this.DNS_IP + '/job/updateJobNo/' + this.jobitem[0].jobNo, statusSend)
      console.log('statusSend', 'false')
      let updateStatusSend = {
        updateStatusSend: 'false'
      }
      await axios
        .post(
          this.DNS_IP + '/job/NotifyQrcode/' + this.jobitem[0].jobNo,
          updateStatusSend
        )
        .then(async response => {
          this.$swal('เรียบร้อย', 'ส่ง QR Code กลุ่มของท่านเรียบร้อย', 'success')
          this.dialogJob = false
          // this.clearData()
          // this.$router.push('/Master/FlowStep')
        })
        .catch(error => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async setDataChang (item) {
      this.checkSelectText = item.statusBt
      console.log('dueDate', item.dueDate)
      console.log('timeText', item.timeText)
      this.checkTimeFlow(item)
      this.dataChange = item
      this.remark = item.remark
      this.formChange.date = this.momenDate_1(item.dueDate)
      this.dueDateOld = this.momenDate_1(item.dueDate)
      this.dueDateTimeOld = this.momenTime(item.dueDate)
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
