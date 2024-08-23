<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
          </v-col>
          <v-col cols="6" class="v-margit_button text-right">
            <v-btn color="primary" depressed @click="dialogAdd = true, validate('ADD'), dataItemAddTime = []">
              <v-icon left>mdi-text-box-plus</v-icon>
              เพิ่มสาขา
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- ADD -->
          <v-dialog v-model="dialogAdd" persistent max-width="35%">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                      <v-col cols="8" class="text-left pt-10">
                      <h3><strong>เพิ่มสาขา</strong></h3>
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
                          @click="dialogAdd = false,clearData()"
                          >
                          X
                          </v-btn>
                      </div>
                      </v-col>
                  </v-row>
                  <v-form
                    ref="form_add"
                    v-model="valid_add"
                    lazy-validation
                  >
                    <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                      dense
                        label="ชื่อสาขา (ภาษาไทย)"
                        v-model="formAdd.masBranchName"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                      dense
                        label="ชื่อสาขา (ภาษาอังกฤษ)"
                        v-model="formAdd.masBranchNameEn"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        outlined

                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        outlined
                        label="เบอร์โทรศัพท์"
                        placeholder="Contact Tel*"
                        v-model="formAdd.contactTel"
                        :rules="[rules.required, rules.numberRules]"
                        :counter="10"
                        maxlength="10"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <VuetifyMoney
                      dense
                          label="จำนวนคนเข้าใช้บริการ / วัน"
                          v-model="formAdd.countCus"
                          placeholder="จำนวนคนเข้าใช้บริการ / วัน"
                          required
                          outlined
                          v-bind:options="options2" />
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <VuetifyMoney
                      dense
                          label="จำนวนที่รับงานด่วน / วัน"
                          v-model="formAdd.countFastTrack"
                          placeholder="จำนวนที่รับงานด่วน / วัน"
                          required
                          outlined
                          v-bind:options="options2" />
                    </v-col>
                    <v-col cols="12" class="px-0">
                      <v-row align="center">
                      <v-checkbox
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        class="ml-6"
                        v-model="checkLocationStatus"
                        label="เปิดระบบจองในพื้นที่ที่กำหนด"
                        true-value="True"
                        false-value="False"
                        @change="checkLocationStatus === 'True' ? geolocate() : ''"
                      ></v-checkbox>
                      <!-- <v-checkbox
                        false-value="False"
                        true-value="True"
                        v-model="checkLocationStatus"
                        hide-details
                        class="shrink ml-6 mr-0 mt-0 mb-6"
                        @change="checkLocationStatus === 'True' ? geolocate() : ''"
                      ></v-checkbox>
                      <v-text-field :value="checkLocationStatus === 'True' ? 'ใช้งาน' : 'ไม่ใช้งาน'" readonly label="เปิดระบบจองในพื้นที่ที่กำหนด"></v-text-field> -->
                    </v-row>
                    <template v-if="checkLocationStatus === 'True'">
                      <v-col cols="12" class="pb-0 pt-0">
                        <v-select
                          v-model="distanceSet"
                          :items="itemDistance"
                          label="จับระยะภายใน"
                          outlined
                          attach
                          dense
                          :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-col>
                      <v-col class="pb-0 pt-0" id="divTest1" cols="12">
                        <gmap-autocomplete
                          class="introInput"
                          placeholder="ค้นหาสถานที่"
                          @place_changed="updatePlace"
                          @keydown="testStyleInputGoogleMap('divTest1')"
                          style="width: 100%; height: 45px; border: 1px solid;padding-left: 8px; border-radius: 4px;">
                        </gmap-autocomplete>
                      </v-col>
                      <v-col class="pb-0" cols="12">
                        <v-card class="p-3">
                          <GmapMap
                            v-if="center !== null"
                            :center="center"
                            :zoom="15"
                            style="width: 100%; height: 200px"
                            :options="{
                              disableDefaultUI: true,
                              fullscreenControl: true,
                              zoomControl: true
                            }"
                          >
                            <GmapMarker
                              :position="center"
                              :draggable="true"
                              @drag="updateCoordinates"
                            />
                          </GmapMap>
                        </v-card>
                      </v-col>
                    </template>
                    </v-col>
                    <v-col>
                      <v-btn
                        elevation="2"
                        block
                        large
                        color="#173053"
                        dark
                        :disabled="!valid_add"
                        @click="addData()"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        บันทึก
                      </v-btn>
                    </v-col>
                  </v-row>
                  <!-- <v-divider></v-divider>
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        label="แสดงเวลา"
                        v-model="timeText"
                        :counter="50"
                        maxlength="50"
                        outlined

                      ></v-text-field>
                      <v-text-field
                          v-model="formAdd.time"
                           v-mask="'##:##'"
                           label="ตั้งค่าเวลาที่ต้องการ"
                           placeholder="HH:mm"
                           outlined
                      ></v-text-field>
                      <VuetifyMoney
                          label="Limit Booking"
                          v-model="formAdd.limitBooking"
                          placeholder="Limit Booking"
                          required
                          outlined
                          v-bind:options="options2" />
                      <v-select
                        v-if="dataItemAddTime.length > 0"
                        :items="dataItemAddTime"
                        label="ตัวอย่างการแสดงเวลา"
                        item-text="text"
                        item-value="text"
                        outlined
                      ></v-select>
                      <v-btn
                        block
                        color="teal"
                        elevation="2"
                        rounded
                        small
                        dark
                        @click="presetTime()"
                      >
                        แบบร่าง เวลา
                      </v-btn>
                    </v-col>
                    <v-col cols="2">
                      <v-btn
                        class="mx-2"
                        fab
                        dark
                        v-if="typeTimeAdd === 'add'"
                        color="indigo"
                        @click="addDataTimeAdd()"
                      >
                        <v-icon dark>
                          mdi-plus
                        </v-icon>
                      </v-btn>
                      <v-btn
                        class="mx-2"
                        fab
                        dark
                        v-if="typeTimeAdd === 'update'"
                        color="question"
                        @click="UpdateDataTimeAdd()"
                      >
                        <v-icon dark>
                          mdi-tools
                        </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="7">
                      <v-row align="center" class="ma-5">
                        <v-checkbox
                          @click="chekshowTime()"
                          false-value="False"
                          true-value="True"
                          v-model="formAdd.limitBookingCheck"
                          label="ตั้ง Limit การนัดหมาย"
                          hide-details
                          class="shrink ml-6 mr-0 mt-0 mb-2"
                        ></v-checkbox>
                         </v-row>
                      <v-data-table
                        :headers="columnsAddTime"
                        :items="dataItemAddTime"
                        :items-per-page="10"
                      >
                           <template v-slot:[`item.actions2`]="{ item, index }">
                              <v-btn
                                color="question"
                                fab
                                dark
                                x-small
                                @click.stop="getUpdateAdd(item, 'update', index)"
                              >
                                <v-icon color="#FFFFFF"> mdi-tools </v-icon>
                              </v-btn>
                              <v-btn
                                color="red"
                                dark
                                fab
                                x-small
                                @click.stop="getUpdateAdd(item, 'delete', index)"
                              >
                                <v-icon> mdi-delete </v-icon>
                              </v-btn>
                            </template>
                      </v-data-table>
                    </v-col>

                  </v-row> -->
                  <!-- <v-row>
                    <v-col cols="12">
                      <v-card class="pa-3" min-height="200">
                        <strong >วันหยุดทั่วไปของบริษัท</strong>
                        <v-select
                        class="mt-5"
                        v-model="formAdditem.dateDayoffText"
                        :items="itemDateStop"
                        chips
                        label="เลือกวันหยุด"
                        multiple
                        outlined
                      ></v-select>
                      </v-card>
                    </v-col>
                  </v-row> -->
                  <!-- <v-row>
                    <v-col cols="12">
                      <v-card class="pa-6">
                        <v-row>
                          <v-col cols="6">
                            <strong>วันหยุดประจำปีของบริษัท</strong>
                          </v-col>
                          <v-col cols="6">
                            <v-select
                              v-model="formAdditem.typeDayCustom"
                              :item-text="typeDayCustomitem.text"
                              :items="typeDayCustomitem"
                              label="ประเภทของวันหยุด"
                              outlined
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-date-picker
                        v-model="formAdditem.dateDayCustom"
                          multiple
                          full-width
                          class="mt-4"
                        ></v-date-picker>
                      </v-card>
                    </v-col>
                  </v-row> -->
                  </v-form>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- end add -->

          <!-- edit -->
          <v-dialog v-model="dialogEdit" persistent max-width="35%">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-form
                    ref="form_add"
                    v-model="valid_add"
                    lazy-validation
                  >
                    <v-row>
                      <v-col cols="8" class="text-left pt-10">
                      <h3><strong>แก้ไขข้อมูล</strong></h3>
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
                          @click="dialogEdit = false, dataReady = true"
                          >
                          X
                          </v-btn>
                      </div>
                      </v-col>
                  </v-row>
                    <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                      dense
                        label="ชื่อสาขา (ภาษาไทย)"
                        v-model="formUpdate.masBranchName"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        outlined

                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                      dense
                        label="ชื่อสาขา (ภาษาอังกฤษ)"
                        v-model="formUpdate.masBranchNameEn"
                        :rules="nameRules"
                        :counter="50"
                        maxlength="50"
                        outlined

                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        outlined
                        label="เบอร์โทรศัพท์"
                        placeholder="Contact Tel*"
                        v-model="formUpdate.contactTel"
                        :rules="[rules.required, rules.numberRules]"
                        :counter="10"
                        maxlength="10"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <VuetifyMoney
                      dense
                          label="จำนวนคนเข้าใช้บริการ / วัน"
                          v-model="formUpdate.countCus"
                          placeholder="จำนวนคนเข้าใช้บริการ / วัน"
                          required
                          outlined
                          v-bind:options="options2" />
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <VuetifyMoney
                      dense
                          label="จำนวนที่รับงานด่วน / วัน"
                          v-model="formUpdate.countFastTrack"
                          placeholder="จำนวนที่รับงานด่วน / วัน"
                          required
                          outlined
                          v-bind:options="options2" />
                    </v-col>
                    <v-col cols="12" class="px-0">
                      <v-row align="center">
                      <v-checkbox
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        class="ml-6"
                        v-model="checkLocationStatus"
                        label="เปิดระบบจองในพื้นที่ที่กำหนด"
                        true-value="True"
                        false-value="False"
                        @change="checkLocationStatus === 'True' ? geolocate() : ''"
                      ></v-checkbox>
                      <!-- <v-checkbox
                        false-value="False"
                        true-value="True"
                        v-model="checkLocationStatus"
                        hide-details
                        class="shrink ml-6 mr-0 mt-0 mb-6"
                        @change="checkLocationStatus === 'True' ? geolocate() : ''"
                      ></v-checkbox>
                      <v-text-field :value="checkLocationStatus === 'True' ? 'ใช้งาน' : 'ไม่ใช้งาน'" readonly label="เปิดระบบจองในพื้นที่ที่กำหนด"></v-text-field> -->
                    </v-row>
                    <template v-if="checkLocationStatus === 'True'">
                      <v-col cols="12" class="pb-0 pt-0">
                        <v-select
                          v-model="distanceSet"
                          :items="itemDistance"
                          label="จับระยะภายใน"
                          outlined
                          attach
                          dense
                          :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-col>
                      <v-col class="pb-0 pt-0" id="divTest2" cols="12">
                        <gmap-autocomplete
                          class="introInput"
                          placeholder="ค้นหาสถานที่"
                          @place_changed="updatePlace"
                          @keydown="testStyleInputGoogleMap('divTest2')"
                          style="width: 100%; height: 45px; border: 1px solid;padding-left: 8px; border-radius: 4px;">
                        </gmap-autocomplete>
                      </v-col>
                      <v-col class="pb-0" cols="12">
                        <v-card class="p-3">
                          <GmapMap
                            v-if="center !== null"
                            :center="center"
                            :zoom="15"
                            style="width: 100%; height: 200px"
                            :options="{
                              disableDefaultUI: true,
                              fullscreenControl: true,
                              zoomControl: true
                            }"
                          >
                            <GmapMarker
                              :position="center"
                              :draggable="true"
                              @drag="updateCoordinates"
                            />
                          </GmapMap>
                        </v-card>
                      </v-col>
                    </template>
                    </v-col>
                    <v-col>
                      <v-btn
                        elevation="2"
                        block
                        color="#173053"
                        dark
                        large
                        :disabled="!valid_update"
                        @click="editData()"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        บันทึก
                      </v-btn>
                    </v-col>
                  </v-row>
                  <!-- <v-divider></v-divider>
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        label="แสดงเวลา"
                        v-model="timeText"
                        :counter="50"
                        maxlength="50"
                        outlined

                      ></v-text-field>
                      <v-text-field
                          v-model="formAdd.time"
                           v-mask="'##:##'"
                           label="ตั้งค่าเวลาที่ต้องการ"
                           placeholder="HH:mm"
                           outlined
                      ></v-text-field>
                      <VuetifyMoney
                          label="Limit Booking"
                          v-model="formAdd.limitBooking"
                          placeholder="Limit Booking"
                          required
                          outlined
                          v-bind:options="options2" />
                      <v-select
                        v-if="dataItemAddTime.length > 0"
                        :items="dataItemAddTime"
                        label="ตัวอย่างการแสดงเวลา"
                        item-text="text"
                        item-value="text"
                        outlined
                      ></v-select>
                      <v-btn
                        block
                        color="teal"
                        elevation="2"
                        rounded
                        small
                        dark
                        @click="presetTime()"
                      >
                        แบบร่าง เวลา
                      </v-btn>
                    </v-col>
                    <v-col cols="2">
                      <v-btn
                        class="mx-2"
                        fab
                        dark
                        v-if="typeTimeAdd === 'add'"
                        color="indigo"
                        @click="addDataTimeAdd()"
                      >
                        <v-icon dark>
                          mdi-plus
                        </v-icon>
                      </v-btn>
                      <v-btn
                        class="mx-2"
                        fab
                        dark
                        v-if="typeTimeAdd === 'update'"
                        color="question"
                        @click="UpdateDataTimeAdd()"
                      >
                        <v-icon dark>
                          mdi-tools
                        </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="7">
                      <v-row align="center" class="ma-5">
                        <v-checkbox
                          @click="chekshowTime()"
                          false-value="False"
                          true-value="True"
                          v-model="formAdd.limitBookingCheck"
                          label="ตั้ง Limit การนัดหมาย"
                          hide-details
                          class="shrink ml-6 mr-0 mt-0 mb-2"
                        ></v-checkbox>
                         </v-row>
                      <v-data-table
                        :headers="columnsAddTime"
                        :items="dataItemAddTime"
                        :items-per-page="10"
                      >
                           <template v-slot:[`item.actions2`]="{ item, index }">
                              <v-btn
                                color="question"
                                fab
                                dark
                                x-small
                                @click.stop="getUpdateAdd(item, 'update', index)"
                              >
                                <v-icon color="#FFFFFF"> mdi-tools </v-icon>
                              </v-btn>
                              <v-btn
                                color="red"
                                dark
                                fab
                                x-small
                                @click.stop="getUpdateAdd(item, 'delete', index)"
                              >
                                <v-icon> mdi-delete </v-icon>
                              </v-btn>
                            </template>
                      </v-data-table>
                    </v-col>

                  </v-row> -->
                  <!-- <v-row>
                    <v-col cols="12">
                      <v-card class="pa-3" min-height="200">
                        <strong >วันหยุดทั่วไปของบริษัท</strong>
                        <v-select
                        class="mt-5"
                        v-model="formAdditem.dateDayoffText"
                        :items="itemDateStop"
                        chips
                        label="เลือกวันหยุด"
                        multiple
                        outlined
                      ></v-select>
                      </v-card>
                    </v-col>
                  </v-row> -->
                  <!-- <v-row>
                    <v-col cols="12">
                      <v-card class="pa-6">
                        <v-row>
                          <v-col cols="6">
                            <strong>วันหยุดประจำปีของบริษัท</strong>
                          </v-col>
                          <v-col cols="6">
                            <v-select
                              v-model="formAdditem.typeDayCustom"
                              :item-text="typeDayCustomitem.text"
                              :items="typeDayCustomitem"
                              label="ประเภทของวันหยุด"
                              outlined
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-date-picker
                        v-model="formAdditem.dateDayCustom"
                          multiple
                          full-width
                          class="mt-4"
                        ></v-date-picker>
                      </v-card>
                    </v-col>
                  </v-row> -->
                  </v-form>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- end edit -->

          <!-- delete -->
          <v-dialog v-model="dialogDelete" persistent max-width="500px">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                      <v-col cols="8" class="text-left pt-10">
                      <h3><strong>ลบข้อมูลนี้</strong></h3>
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
                          @click="dialogDelete = false, dataReady = true"
                          >
                          X
                          </v-btn>
                      </div>
                      </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        label="สาขา"
                        v-model="formUpdate.masBranchName"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-btn
                        elevation="2"
                        large
                        color="#173053"
                        block
                        dark
                        @click="deleteData()"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        ลบ
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- end delete -->

          <!-- data table -->
         <v-col cols="12">
            <v-card elevation="7" v-if="dataReady">
              <v-card-title>
                <v-text-field
                  v-model="searchAll2"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="columns"
                  :items="dataItem"
                  :search="searchAll2"
                  :items-per-page="10"
                >
                   <template v-slot:[`item.CREATE_DATE`]="{ item }">
                      {{ format_date(item.CREATE_DATE) }}
                  </template>
                   <template v-slot:[`item.LAST_DATE`]="{ item }">
                      {{ format_date(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      color="question"
                      fab
                      dark
                      small
                      @click.stop="(dialogEdit = true),chekshowTime('open',item), getDataById(item), validate('UPDATE')"
                    >
                      <v-icon dark> mdi-tools </v-icon>
                    </v-btn>
                    <v-btn
                      color="red"
                      dark
                      fab
                      small
                      @click.stop="(dialogDelete = true), getDataById(item)"
                    >
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
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
      </div>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'
import VuetifyMoney from '../VuetifyMoney.vue'
import TheMask from 'vue-the-mask'
// import moment from 'moment' // แปลง date

export default {
  components: {
    waitingAlert,
    'left-menu-admin': adminLeftMenu,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile,
    VuetifyMoney,
    TheMask
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  data () {
    return {
      itemDistance: [
        {text: '20 เมตร', value: '0.02'},
        {text: '40 เมตร', value: '0.04'},
        {text: '60 เมตร', value: '0.06'},
        {text: '80 เมตร', value: '0.08'},
        {text: '100 เมตร', value: '0.1'},
        {text: '500 เมตร', value: '0.5'},
        {text: '1 กิโลเมตร', value: '1'},
        {text: '1 กิโลเมตรครึ่ง', value: '1.5'},
        {text: '2 กิโลเมตร', value: '2'},
        {text: '2 กิโลเมตรครึ่ง', value: '2.5'},
        {text: '3 กิโลเมตร', value: '3'},
        {text: '3 กิโลเมตรครึ่ง', value: '3.5'},
        {text: '4 กิโลเมตร', value: '4'},
        {text: '4 กิโลเมตรครึ่ง', value: '4.5'},
        {text: '5 กิโลเมตร', value: '5'}
      ],
      checkLocationStatus: 'False',
      distanceSet: '',
      shopLat: '',
      shopLong: '',
      center: null,
      picker: null,
      date2: null,
      activePicker: 'MONTH',
      PK: '',
      path: '/master_branch/', // Path Model
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'สาขา',
          disabled: false,
          href: '/Master/Branch'
        }
      ],
      // End Menu Config
      dataReady: true,
      dateTime: '', // Generate DateTime
      date: this.momenDate_1(new Date()),
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      code: 'BCH_', // Generate Code
      valid_add: true,
      valid_update: true,
      // Dialog Config ADD EDIT DELETE IMPORT
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogImport: false,
      // END Dialog Config ADD EDIT DELETE
      panel: [0],
      panel1: [1],
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      // Search All
      searchAll: '',
      searchAll2: '',
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },
      formAdditem: {
        dateDayoffText: [],
        dateDayoffValue: [],
        dateDayCustom: [],
        typeDayCustom: ''
      },
      formAdd: {
        masBranchCode: '',
        masBranchName: '',
        masBranchNameEn: '',
        countCus: 0,
        countFastTrack: 0,
        time: '',
        setTime: '',
        limitBooking: 0,
        limitBookingCheck: 'False',
        shopId: this.$session.getAll().data.shopId,
        dateDayoffText: [],
        dateDayoffValue: [],
        dateDayCustom: [],
        typeDayCustom: '',
        contactTel: ''
      },
      formUpdate: {
        masBranchCode: '',
        countCus: 0,
        countFastTrack: 0,
        masBranchName: '',
        masBranchNameEn: '',
        setTime: '',
        limitBookingCheck: 'False',
        time: '',
        dateDayoffText: [],
        dateDayoffValue: [],
        dateDayCustom: [],
        typeDayCustom: '',
        contactTel: ''
      },
      formUpdateItem: {
        countCus: 0,
        countFastTrack: 0,
        setTime: '',
        limitBookingCheck: 'False',
        masBranchName: '',
        masBranchNameEn: '',
        dateDayoffText: [],
        dateDayoffValue: [],
        dateDayCustom: [],
        typeDayCustom: '',
        contactTel: ''
      },
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => v.length <= 50 || 'Name must be less than 50 characters'
      ],
      nameSelect: [
        (v) => !!v || 'select is required',
        (v) => v.length > 1 || 'Please select'
      ],
      // End Form Config ADD EDIT
      // Data Table Config
      columns: [
        { text: 'สาขา', value: 'masBranchName' },
        { text: 'จำนวนคนเข้าใช้บริการ / วัน', value: 'countCus', align: 'center' },
        { text: 'จำนวนที่รับงานด่วน / วัน', value: 'countFastTrack', align: 'center' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
        { text: 'Action', value: 'action', sortable: false, align: 'center' }
      ],
      dataItem: [],
      dataItemAddTime: [],
      columnsAddTime: [
        { text: 'แสดงเวลา', value: 'text' },
        { text: 'เวลา', value: 'value' },
        { text: 'Limit Booking', value: 'limitBooking', align: 'center' },
        // { text: 'เรียงตำแหน่ง', value: 'actions1', align: 'center' },
        { text: 'จัดการเวลา', value: 'actions2', align: 'center' }
      ],
      typeTimeAdd: 'add',
      timeText: '',
      indexTimeAdd: 0,
      itemDateStop: ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'],
      itemDateStopValue: [0, 1, 2, 3, 4, 5, 6],
      arrayDates: ['2022-06-09', '2020-06-21', '2020-06-23', '2020-06-10'],
      day: [1, 2, 6],
      BookingFieldshowtime: null,
      typeDayCustomitem: [
        {
          text: 'วันที่เปิด',
          value: 'on'
        },
        {
          text: 'วันที่ปิด',
          value: 'off'
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
      }
    }
  },
  async mounted () {
    // this.getGetToken(this.DNS_IP)
    this.dataReady = false
    // Get Data
    this.getDataGlobal(this.DNS_IP, this.path, this.$session.getAll().data.shopId)
    this.getBookingField()
  },
  methods: {
    async geolocate () {
      await navigator.geolocation.getCurrentPosition(
        async position => {
          const center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          if (center) {
            this.center = center
            this.shopLat = center.lat
            this.shopLong = center.lng
          }
        },
        error => {
          this.center = null
          this.shopLat = ''
          this.shopLong = ''
          // this.center.lat = null
          // this.center.lng = null
          console.log('error map :', error.message)
        }
      )
    },
    updatePlace (place) {
      // console.log(place)
      this.shopLat = place.geometry.location.lat()
      this.shopLong = place.geometry.location.lng()
      this.center = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    },
    updateCoordinates (location) {
      console.log('location.latLng.lat()', location.latLng.lat())
      console.log('location.latLng.lng()', location.latLng.lng())
      this.shopLat = location.latLng.lat()
      this.shopLong = location.latLng.lng()
      this.center = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      }
    },
    chekshowTime (open, item) {
      if (open) {
        if (this.BookingFieldshowtime === 'แสดง') {
        } else {
          console.log('this.formUpdate.limitBookingCheck', this.formUpdate.limitBookingCheck)
          if (item.limitBookingCheck === 'True') {
            this.$swal('ปิด LimitBooking ', 'กรุณาเปิดการแสดงเวลานัดหมายเพื่อเปิด LimitBooking', 'error').then(() => {
              this.formUpdate.limitBookingCheck = 'False'
            })
          } else {
            console.log('else')
            this.formUpdate.limitBookingCheck = 'False'
          }
        }
      } else {
        if (this.BookingFieldshowtime === 'แสดง') {
        } else {
          this.$swal('ร้านของคุณไม่สามารถเปิด LimitBooking ได้', 'กรุณาเปิดการแสดงเวลานัดหมาย', 'error').then(() => {
            this.formUpdate.limitBookingCheck = 'False'
            this.formAdd.limitBookingCheck = 'False'
          })
        }
      }
    },
    async getBookingField () {
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.BookingFieldshowtime = rs[0].showTime
            console.log('testtttttttttt', this.BookingFieldshowtime)
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    presetTime () {
      this.dataItemAddTime = [{'value': '08:00', 'text': '08:00', 'limitBooking': ''}, {'value': '08:30', 'text': '08:30', 'limitBooking': ''}, {'value': '09:00', 'text': '09:00', 'limitBooking': ''}, {'value': '09:30', 'text': '09:30', 'limitBooking': ''}, {'value': '10:00', 'text': '10:00', 'limitBooking': ''}, {'value': '10:30', 'text': '10:30', 'limitBooking': ''}, {'value': '11:00', 'text': '11:00', 'limitBooking': ''}, {'value': '11:30', 'text': '11:30', 'limitBooking': ''}, {'value': '12:00', 'text': '12:00', 'limitBooking': ''}, {'value': '12:30', 'text': '12:30', 'limitBooking': ''}, {'value': '13:00', 'text': '13:00', 'limitBooking': ''}, {'value': '13:30', 'text': '13:30', 'limitBooking': ''}, {'value': '14:00', 'text': '14:00', 'limitBooking': ''}, {'value': '14:30', 'text': '14:30', 'limitBooking': ''}, {'value': '15:00', 'text': '15:00', 'limitBooking': ''}, {'value': '15:30', 'text': '15:30', 'limitBooking': ''}, {'value': '16:00', 'text': '16:00', 'limitBooking': ''}, {'value': '16:30', 'text': '16:30', 'limitBooking': ''}, {'value': '17:00', 'text': '17:00', 'limitBooking': ''}]
    },
    addDataTimeAdd () {
      if (this.formAdd.time !== '' && this.timeText !== '') {
        var dataTime = this.formAdd.time.split(':')
        var hh = dataTime[0]
        var mm = dataTime[1]
        console.log(dataTime)
        if (parseInt(hh) <= 24 && parseInt(mm) <= 59) {
          if (this.dataItemAddTime.length === 0) {
            // this.dataItemAddTime.push({value: this.formAdd.time, text: this.formAdd.time, sortNo: 1})
            let numhh = 100 + parseInt(hh)
            let nummm = 100 + parseInt(mm)
            let strhh = numhh.toString().substring(1, 3)
            let strmm = nummm.toString().substring(1, 3)
            this.dataItemAddTime.push({value: strhh + ':' + strmm, text: this.timeText, limitBooking: this.formAdd.limitBooking})
          } else {
            // let numhh = 100 + parseInt(hh)
            // let nummm = 100 + parseInt(mm)
            // let strhh = numhh.toString().substring(1, 3)
            // let strmm = nummm.toString().substring(1, 3)
            // if (this.dataItemAddTime.filter(el => { return el.value === strhh + ':' + strmm }).length > 0) {
            //   this.$swal('ผิดพลาด', 'เวลาที่ท่านเลือกมีอยู่ในรายการแล้ว', 'error')
            // } else {
            let numhh = 100 + parseInt(hh)
            let nummm = 100 + parseInt(mm)
            let strhh = numhh.toString().substring(1, 3)
            let strmm = nummm.toString().substring(1, 3)
            this.dataItemAddTime.push({value: strhh + ':' + strmm, text: this.timeText, limitBooking: this.formAdd.limitBooking})
            this.dataItemAddTime.sort(function (a, b) {
              return a.value.localeCompare(b.value)
            })
            // }
          }
        } else {
          this.$swal('ผิดพลาด', 'กรุณาตรวจสอบเวลาให้ถูกต้อง', 'error')
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ', 'error')
      }
    },
    // async actionUp (item, index) {
    //   if ((index - 1) >= this.dataItemAddTime.length) {
    //     var k = (index - 1) - this.dataItemAddTime.length + 1
    //     while (k--) {
    //       this.dataItemAddTime.push(undefined)
    //     }
    //   }
    //   this.dataItemAddTime.splice((index - 1), 0, this.dataItemAddTime.splice(index, 1)[0])
    //   this.dataItemAddTime[index].sortNo = this.dataItemAddTime[index].sortNo + 1
    //   this.dataItemAddTime[index - 1].sortNo = this.dataItemAddTime[index].sortNo - 1
    // },
    // async actionDown (item, index) {
    //   if ((index + 1) >= this.dataItemAddTime.length) {
    //     var k = (index + 1) - this.dataItemAddTime.length + 1
    //     while (k--) {
    //       this.dataItemAddTime.push(undefined)
    //     }
    //   }
    //   this.dataItemAddTime.splice((index + 1), 0, this.dataItemAddTime.splice(index, 1)[0])
    //   this.dataItemAddTime[index].sortNo = this.dataItemAddTime[index].sortNo - 1
    //   this.dataItemAddTime[index + 1].sortNo = this.dataItemAddTime[index].sortNo + 1
    // },
    getUpdateAdd (item, text, index) {
      if (text === 'update') {
        this.formAdd.time = item.value
        this.formAdd.limitBooking = item.limitBooking
        this.timeText = item.text
        this.typeTimeAdd = text
        this.indexTimeAdd = index
      } else {
        this.dataItemAddTime.splice(index, 1)
        // console.log('this.dataItemAddTime', this.dataItemAddTime)
        // for (var i = 0; i < this.dataItemAddTime.length; i++) {
        //   var d = this.dataItemAddTime[i]
        //   d.sortNo = i + 1
        // }
        this.dataItemAddTime.sort(function (a, b) {
          return a.value.localeCompare(b.value)
        })
        this.typeTimeAdd = 'add'
      }
    },
    UpdateDataTimeAdd () {
      if (this.formAdd.time !== '' && this.timeText !== '') {
        var dataTime = this.formAdd.time.split(':')
        var hh = dataTime[0]
        var mm = dataTime[1]
        console.log(dataTime)
        if (parseInt(hh) <= 24 && parseInt(mm) <= 59) {
          // let numhh = 100 + parseInt(hh)
          // let nummm = 100 + parseInt(mm)
          // let strhh = numhh.toString().substring(1, 3)
          // let strmm = nummm.toString().substring(1, 3)
          // if (this.dataItemAddTime.filter(el => { return el.value === strhh + ':' + strmm }).length > 0) {
          //   this.$swal('ผิดพลาด', 'เวลาที่ท่านเลือกมีอยู่ในรายการแล้ว', 'error')
          // } else {
          let numhh = 100 + parseInt(hh)
          let nummm = 100 + parseInt(mm)
          let strhh = numhh.toString().substring(1, 3)
          let strmm = nummm.toString().substring(1, 3)
          this.dataItemAddTime[this.indexTimeAdd].value = strhh + ':' + strmm
          this.dataItemAddTime[this.indexTimeAdd].text = this.timeText
          this.dataItemAddTime[this.indexTimeAdd].limitBooking = this.formAdd.limitBooking
          this.typeTimeAdd = 'add'
          this.formAdd.time = ''
          this.timeText = ''
          this.formAdd.limitBooking = 0
          this.dataItemAddTime.sort(function (a, b) {
            return a.value.localeCompare(b.value)
          })
          // }
        } else {
          this.$swal('ผิดพลาด', 'กรุณาตรวจสอบเวลาให้ถูกต้อง', 'error')
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ', 'error')
      }
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

        default:
          break
      }
    },
    async getDataById (item) {
      //
      //
      // สำหรับ เรียกข้อมูล ใส่ form Update / Delete1
      //
      //
      // Get ID /main.js
      this.dataReady = false
      Object.assign(this.formUpdate, item)
      this.PK = item.masBranchID
      console.log('testttttttttttttt2234234234', item)
      // this.getDataByIdGlobal(this.DNS_IP, this.path, 'masBranchID', item.masBranchID)
      if (item.dateDayoffText === null || item.dateDayoffText === '') {
        this.formUpdate.dateDayoffText = []
      } else {
        this.formUpdate.dateDayoffText = JSON.parse(item.dateDayoffText)
      }
      if (item.dateDayCustom === null || item.dateDayCustom === '') {
        this.formUpdate.dateDayCustom = []
      } else {
        this.formUpdate.dateDayCustom = JSON.parse(item.dateDayCustom)
      }
      if (this.formUpdate.countCus) {
        this.formUpdate.countCus = this.formUpdate.countCus
      } else {
        this.formUpdate.countCus = 0
      }
      this.formUpdate.contactTel = item.contactTel || ''
      this.formUpdate.typeDayCustom = item.typeDayCustom
      this.formUpdate.limitBookingCheck = item.limitBookingCheck || 'False'
      this.shopLat = item.shopLat || ''
      this.shopLong = item.shopLong || ''
      this.distanceSet = item.distanceSet || ''
      this.checkLocationStatus = item.checkLocationStatus || 'False'
      if (this.checkLocationStatus === 'True') {
        this.center = {
          lat: parseFloat(this.shopLat),
          lng: parseFloat(this.shopLong)
        }
      }
      console.log('this.formUpdate.setTime', item.setTime)
      if (item.setTime === null || item.setTime === '') {
        this.dataItemAddTime = []
      } else {
        let setTime = JSON.parse(item.setTime)
        if (setTime.length > 0) {
          console.log('setTime', setTime)
          if (setTime[0].limitBooking === undefined) {
            console.log('dasdas')
            for (let i = 0; i < setTime.length; i++) {
              let d = setTime[i]
              d.limitBooking = ''
              this.dataItemAddTime.push(d)
            }
          } else {
            this.dataItemAddTime = setTime
          }
        } else {
          this.dataItemAddTime = []
        }
      }
      console.log('testget', this.formUpdate)
    },
    allowedDates (val) {
      // console.log('val', val)
      // this.getMonth(this.pickerDate)
      if (this.formUpdate.dateDayoffValue !== null) {
        // console.log('test', moment(val).format('YYYY-MM-DD'))
        if (JSON.parse(this.formUpdate.dateDayoffValue).filter(el => { return el === new Date(val).getDay() }).length === 0) {
          return val
        }
      } else {
        return val
      }
    },
    async addData () {
      this.formAdd.CREATE_USER = this.$session.getAll().data.userName
      this.formAdd.LAST_USER = this.$session.getAll().data.userName
      if (this.formAdd.countCus) {
        this.formAdd.countCus = this.formAdd.countCus
      } else {
        this.formAdd.countCus = 0
      }

      // console.log('form', JSON.stringify(this.formAdd))
      // console.log('this.dataItemAddTime', this.dataItemAddTime)

      this.formAdd.dateDayoffText = JSON.stringify(this.formAdditem.dateDayoffText)
      let dd = []
      this.itemDateStop.forEach((v, k) => {
        // console.log('test', this.formUpdate.dateDayoffText.filter(item => item === v))
        if (this.formAdditem.dateDayoffText.filter(item => item === v).length > 0) {
          dd.push(k)
        }
      })
      this.formAdd.typeDayCustom = this.formAdditem.typeDayCustom === '' ? 'off' : this.formAdditem.typeDayCustom
      this.formAdd.dateDayoffValue = JSON.stringify(dd)
      this.formAdd.dateDayCustom = JSON.stringify(this.formAdditem.dateDayCustom)
      console.log('this.formAdd', this.formAdd)
      this.formAdd.masBranchCode = this.code + this.generateCodeGlobal()
      this.formAdd.setTime = JSON.stringify(this.dataItemAddTime)
      delete this.formAdd['time']
      delete this.formAdd['limitBooking']
      this.dataReady = false
      console.log('this.formAdd', this.formAdd)
      if (this.checkLocationStatus === 'True') {
        if (this.shopLat !== '' && this.shopLong !== '' && this.distanceSet !== '') {
          this.formAdd.shopLat = this.shopLat
          this.formAdd.shopLong = this.shopLong
          this.formAdd.distanceSet = this.distanceSet
          this.formAdd.checkLocationStatus = this.checkLocationStatus
          console.log('this.formAdd', this.formAdd)
          if (this.formAdd.masBranchName === '') {
            this.$swal('ผิดพลาด', 'กรอกชื่อ สาขา', 'error')
          } else if (this.formAdd.masBranchCode === '') {
            this.$swal('ผิดพลาด', 'กรุณาเลือก สาขา', 'error')
          } else if (this.formAdd.limitBookingCheck === 'True') {
            if (this.dataItemAddTime.filter(el => { return el.limitBooking === '' }).length === 0) {
              this.dataReady = false
              this.submitAdd()
            } else {
              this.dataReady = true
              this.$swal('ผิดพลาด', 'กรุณาเลือก ใส่จำนวน Limit Booking ให้ครบ เนื่องจากท่านได้เลือกที่จะ ตั้ง Limit การจอง', 'error')
            }
          } else {
            this.dataReady = false
            this.submitAdd()
          }
        } else {
          this.dataReady = false
          this.$swal('ผิดพลาด', 'กรุณาใส่ข้อมูล ระบบจองในพื้นืี่ ในครบ', 'info')
        }
      } else {
        if (this.formAdd.masBranchName === '') {
          this.$swal('ผิดพลาด', 'กรอกชื่อ สาขา', 'error')
        } else if (this.formAdd.masBranchCode === '') {
          this.$swal('ผิดพลาด', 'กรุณาเลือก สาขา', 'error')
        } else if (this.formAdd.limitBookingCheck === 'True') {
          if (this.dataItemAddTime.filter(el => { return el.limitBooking === '' }).length === 0) {
            this.dataReady = false
            this.submitAdd()
          } else {
            this.dataReady = true
            this.$swal('ผิดพลาด', 'กรุณาเลือก ใส่จำนวน Limit Booking ให้ครบ เนื่องจากท่านได้เลือกที่จะ ตั้ง Limit การจอง', 'error')
          }
        } else {
          this.dataReady = false
          this.submitAdd()
        }
      }
    },
    async submitAdd () {
      this.dataReady = false

      this.$swal({
        title: 'ต้องการ เพิ่มข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (result) => {
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + this.path + "add",
              this.formAdd,
              {
                headers: {
                  'Application-Key': this.$session.getAll().ApplicationKey
                }
              }
            )
            .then(async (response) => {
              // Debug response
              console.log('addDataGlobal DNS_IP + PATH + "add"', response)

              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              // Close Dialog
              this.dialogAdd = false

              // Load Data
              await this.clearData()
              await this.getDataGlobal(this.DNS_IP, this.path, this.$session.getAll().data.shopId)
            })
          // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              console.log('error function addDataGlobal : ', error)
              this.dataReady = true
            })
        })
        .catch((error) => {
          console.log('error function addData : ', error)
          this.dataReady = true
        })
    },
    async editData () {
      // if (this.dataItemAddTime.length > 0) {
      // this.formUpdateItem.countCus = this.formUpdate.countCus
      this.formUpdateItem.masBranchName = this.formUpdate.masBranchName
      this.formUpdateItem.masBranchNameEn = this.formUpdate.masBranchNameEn
      this.formUpdateItem.contactTel = this.formUpdate.contactTel
      this.formUpdateItem.setTime = JSON.stringify(this.dataItemAddTime)
      this.formUpdateItem.dateDayoffText = JSON.stringify(this.formUpdate.dateDayoffText)
      this.formUpdateItem.typeDayCustom = this.formUpdate.typeDayCustom
      let dd = []
      this.itemDateStop.forEach((v, k) => {
        // console.log('test', this.formUpdate.dateDayoffText.filter(item => item === v))
        if (this.formUpdate.dateDayoffText.filter(item => item === v).length > 0) {
          dd.push(k)
        }
      })
      this.formUpdateItem.dateDayoffValue = JSON.stringify(dd)
      this.formUpdateItem.dateDayCustom = JSON.stringify(this.formUpdate.dateDayCustom)
      // Config User ทำรายการล่าสุด
      this.formUpdateItem.LAST_USER = this.$session.getAll().data.userName
      if (this.formUpdate.countCus) {
        this.formUpdateItem.countCus = this.formUpdate.countCus
      } else {
        this.formUpdateItem.countCus = 0
      }
      if (this.formUpdate.countFastTrack) {
        this.formUpdateItem.countFastTrack = this.formUpdate.countFastTrack
      } else {
        this.formUpdateItem.countFastTrack = 0
      }
      this.formUpdateItem.limitBookingCheck = this.formUpdate.limitBookingCheck
      this.formUpdateItem.checkLocationStatus = this.checkLocationStatus || 'False'
      // End Config User ทำรายการล่าสุด
      console.log('this.formUpdateItem', this.formUpdateItem)

      // Debug
      console.log('EDIT PK : ', this.PK)
      console.log('formUpdateItem', this.formUpdateItem)
      // End Debug
      // สำหรับ แก้ไขข้อมูล
      // ต้องระบุ  Last User ว่าใครเป็นคนแก้ไขล่าสุด
      //
      if (this.checkLocationStatus === 'True') {
        if (this.shopLat !== '' && this.shopLong !== '' && this.distanceSet !== '') {
          this.formUpdateItem.shopLat = this.shopLat
          this.formUpdateItem.shopLong = this.shopLong
          this.formUpdateItem.distanceSet = this.distanceSet
          this.formUpdateItem.checkLocationStatus = this.checkLocationStatus
          console.log('this.formUpdateItem', this.formUpdateItem)
          if (this.formUpdateItem.limitBookingCheck === 'True') {
            if (this.dataItemAddTime.filter(el => { return el.limitBooking === '' }).length === 0) {
              this.dataReady = false
              this.submitEdit(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
            } else {
              this.dataReady = true
              this.$swal('ผิดพลาด', 'กรุณาเลือก ใส่จำนวน Limit Booking ให้ครบ เนื่องจากท่านได้เลือกที่จะ ตั้ง Limit การจอง', 'error')
            }
          } else {
            this.dataReady = false
            this.submitEdit(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
          }
        } else {
          this.dataReady = false
          this.$swal('ผิดพลาด', 'กรุณาใส่ข้อมูล ระบบจองในพื้นืี่ ในครบ', 'info')
        }
      } else {
        if (this.formUpdateItem.limitBookingCheck === 'True') {
          if (this.dataItemAddTime.filter(el => { return el.limitBooking === '' }).length === 0) {
            this.dataReady = false
            this.submitEdit(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
          } else {
            this.dataReady = true
            this.$swal('ผิดพลาด', 'กรุณาเลือก ใส่จำนวน Limit Booking ให้ครบ เนื่องจากท่านได้เลือกที่จะ ตั้ง Limit การจอง', 'error')
          }
        } else {
          this.dataReady = false
          this.submitEdit(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
        }
      }
      // } else {
      //   this.$swal('ผิดพลาด', 'กรุณาตั้งเวลาที่จะให้ในสาขานี้', 'error')
      // }
    },
    async submitEdit (DNS_IP, PATH, ID, DT) {
      console.log('DT', DT)
      // this.editDataGlobal(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
      this.dataReady = false

      this.$swal({
        title: 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (result) => {
          await axios
            .post(
              // eslint-disable-next-line quotes
              DNS_IP + PATH + "edit/" + ID,
              DT,
              {
                headers: {
                  'Application-Key': this.$session.getAll().ApplicationKey
                }
              }
            )
            .then(async (response) => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)

              this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
              // Close Dialog
              this.dialogEdit = false
              await this.clearData()
              // Load Data
              await this.getDataGlobal(DNS_IP, PATH, this.$session.getAll().data.shopId)
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              this.dataReady = true
              console.log('error function editDataGlobal : ', error)
            })
        })
        .catch((error) => {
          this.dataReady = true
          console.log('error function editDataGlobal : ', error)
        })
    },
    async deleteData () {
      console.log('DELETE PK : ', this.PK)
      //
      //
      // สำหรับ ลบข้อมูล
      // ต้องระบุ  Last User ว่าใครเป็นคนลบล่าสุด
      //
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName
      this.dataReady = false
      this.deleteDataGlobal(this.DNS_IP, this.path, this.PK, this.$session.getAll().data.shopId)
    },
    async clearData () {
      this.dataReady = true
      this.formAdd.masBranchCode = ''
      this.formAdd.masBranchName = ''
      this.formAdd.masBranchNameEn = ''
      this.formAdd.dateDayoffText = []
      this.formAdd.dateDayCustom = []
      this.formAdd.typeDayCustom = []
      this.formAdd.countCus = 0
      this.formAdd.shopId = this.$session.getAll().data.shopId
      this.dataItemAddTime = []
      this.typeTimeAdd = 'add'
      this.indexTimeAdd = 0
      this.formAdditem.dateDayoffText = []
      this.formAdditem.dateDayoffValue = []
      this.formAdditem.dateDayCustom = []
      this.formAdditem.typeDayCustom = ''
    },
    testStyleInputGoogleMap (item) {
      console.log('item ', item)
      const divTest = document.getElementById(item)
      console.log('divTest ', divTest)
      const divTestVal = divTest.getBoundingClientRect()
      const poc = document.getElementsByClassName('pac-container pac-logo')
      divTest.appendChild(poc[0])
      poc[0].style.setProperty('position', 'initial', 'important')
      poc[0].style.display = 'inline'
      console.log('divTestVal : ', divTestVal)
      console.log('pocVal : ', poc[0])
    }
  }
}
</script>
<style scope>
</style>
<style>
.pac-container {
  position: initial !important;
  /* ค่าเริ่มต้นเป็น relative เลยกำหนด style ของ pac-container เป็น initial ไม่งั้นการแสดงผลมันจะแปลกไป*/
  /* position: static !important; */
}
</style>
