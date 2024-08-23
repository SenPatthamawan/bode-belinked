<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="4" class="text-left">
            <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
          </v-col>
          <v-col cols="8" class="v-margit_button text-right">
            <v-btn
              color="purple"
              depressed
              dark
              @click="(dialogSortEmp = true)"
            >
              <v-icon left>mdi-vector-selection</v-icon>
              จัดลำดับการแสดง
            </v-btn>
            <v-btn
              color="primary"
              depressed
              @click=";(dialogAdd = true)"
            >
              <v-icon left>mdi-text-box-plus</v-icon>
              เพิ่มรายชื่อพนักงาน
            </v-btn>
            <v-btn color="primary" @click="exportData()">
              <v-icon left>mdi-download</v-icon>
              Export Data
            </v-btn>
            <!-- <v-btn color="primary" depressed @click="dialogImport = true">
              <v-icon left>mdi-import</v-icon>
              Manage Data By Excel.xls
            </v-btn> -->
          </v-col>
        </v-row>
        <v-row>
          <v-dialog v-model="dialogSortEmp" persistent max-width="70%">
            <v-card>
              <v-card-text v-if="dataReady">
                <v-container>
                  <v-row>
                    <v-col cols="10" class="text-left pt-10">
                    <h3><strong>จัดลำดับการแสดง</strong></h3>
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
                          @click="dialogSortEmp = false,getDataGlobal(DNS_IP,path,$session.getAll().data.shopId)"
                          >
                          X
                          </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <draggable
                        :list="dessertsSort"
                        :disabled="!enabled"
                        class="list-group"
                        ghost-class="ghost"
                        :move="checkMove"
                        @start="dragging = true"
                        @end="dragging = false"
                      >
                        <div
                          class="list-group-item"
                          v-for="element in dessertsSort"
                          :key="element.empId"
                        >
                          <v-icon>mdi-drag-variant</v-icon>
                          <!-- {{ element.flowId }} -->
                          {{ element.empFull_NameTH }}
                        </div>
                      </draggable>
                    </v-col>
                  </v-row>
                  <br>
                  <div class="text-right">
                      <v-btn
                      color="teal"
                      class="button"
                      dark
                      large
                      @click="saveSortEmp()"
                    >
                      จัดลำดับการแสดง
                    </v-btn>
                    <v-btn
                      color="error"
                      class="button"
                      dark
                      large
                      @click="dialogSortEmp = false,getDataGlobal(DNS_IP,path,$session.getAll().data.shopId)"
                    >
                      ปิด
                    </v-btn>
                  </div>
                </v-container>
              </v-card-text>
              <v-card-text v-else>
                <v-row>
                  <v-col cols="10" class="text-left pt-10">
                    <h3><strong>จัดลำดับการแสดง</strong></h3>
                  </v-col>
                </v-row>
                <div class="text-center">
                  <waitingAlert></waitingAlert>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- Dialog export / import -->
          <!-- Import -->
          <v-dialog v-model="dialogImport" persistent max-width="80%">
            <v-card>
              <v-card-title>
                <span class="headline">จัดการไฟล์ผ่าน excel.xls</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <input type="file" @change="importData" accept=".xls" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <template>
                        <v-data-table
                          :headers="columnsImport"
                          :items="dataItemImport"
                          :items-per-page="5"
                          class="elevation-1"
                        ></v-data-table>
                      </template>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="2"
                  color="red darken-1"
                  text
                  @click=";(dialogImport = false), (dataItemImport = [])"
                >
                  ปิด
                </v-btn>
                <template v-if="!dataItemImportChecKHide">
                  <!-- <v-btn
                    elevation="2"
                    color="red"
                    text
                    @click="importDataApprove('delete')"
                  >
                    ล้างข้อมูลทั้งหมดที่เลือก
                  </v-btn>
                  <v-btn
                    elevation="2"
                    color="blue darken-1"
                    text
                    @click="importDataApprove('update')"
                  >
                    ปรับปรุงข้อมูลที่ตรงกัน
                  </v-btn> -->
                  <v-btn
                    elevation="2"
                    color="green darken-1"
                    text
                    @click="importDataApprove('add')"
                  >
                    นำเข้าข้อมูล
                  </v-btn>
                </template>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end Import -->

          <!-- ADD -->
          <v-dialog v-model="dialogAdd" persistent max-width="600px">
            <v-card class="pa-1">
              <v-card-text class="pa-0 px-2">
                <v-container>
                  <v-form ref="form_add" v-model="valid_add" lazy-validation>
                    <v-row>
                      <v-col cols="8" class="text-left pt-10">
                        <h3><strong>เพิ่มรายชื่อพนักงาน</strong></h3>
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
                            @click="(dialogAdd = false), clearData()"
                          >
                            X
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-col cols="12" class="text-center">
                        <v-img
                          aspect-ratio="6"
                          contain
                          :src="formAdd.pictureUrlPreview"
                        ></v-img>
                        <!-- <v-avatar size="100px"><img alt="Avatar" :src="formAdd.pictureUrl"></v-avatar> -->
                        <br />
                        <v-file-input
                          required
                          counter
                          show-size
                          accept="image/png, image/jpeg, image/bmp"
                          prepend-icon="mdi-camera"
                          label="รูปพนักงาน (ถ้ามี)"
                          @change="selectImgAdd"
                          v-model="filesAdd"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="pa-0">
                        <v-select
                          dense
                          outlined
                          label="คำนำหน้า*"
                          :items="itemsTitle"
                          v-model="formAdd.empTitle_NameTH"
                          :rules="nameRules"
                          :counter="50"
                          maxlength="50"
                          required
                          attach
                          :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <v-text-field
                          dense
                          outlined
                          label="ชื่อ*"
                          v-model="formAdd.empFirst_NameTH"
                          :rules="nameRules"
                          :counter="50"
                          maxlength="50"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <v-text-field
                          dense
                          outlined
                          label="นามสกุล*"
                          v-model="formAdd.empLast_NameTH"
                          :rules="nameRules"
                          :counter="50"
                          maxlength="50"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <v-text-field
                          dense
                          outlined
                          label="เบอร์โทร*"
                          v-model="formAdd.phoneNumber"
                          v-mask="'###-###-####'"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pa-0" v-if="statusGoogleCalendar === 'True' && statusGoogleCalendarEmp === 'True'">
                        <v-text-field
                          dense
                          outlined
                          label="E-mail*"
                          v-model="formAdd.empEmail"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pa-0" v-else>
                        <v-text-field
                          dense
                          outlined
                          label="E-mail*"
                          v-model="formAdd.empEmail"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="pa-0">
                        <v-select
                          dense
                          outlined
                          v-model="formAdd.privacyPage"
                          :items="privacyPageSelect"
                          menu-props="auto"
                          :rules="nameRules"
                          label="เลือกหน้าที่จะแสดง"
                          @change="validate('ADD')"
                          prepend-icon="mdi-map"
                          attach
                        ></v-select>
                      </v-col>
                      <v-col
                        cols="12"
                        class="pa-0"
                      >
                        <v-select
                          dense
                          outlined
                          v-model="formAdd.masBranchID"
                          :item-text="branch.text"
                          :items="branch"
                          clearable
                          label="สาขา"
                          attach
                          :menu-props="{ bottom: true, offsetY: true }"
                          @change="selectBranchAdd()"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pa-0" v-if="(formAdd.masBranchID !== '' && formAdd.masBranchID !== null) && (formAdd.privacyPage === 'bookingform' || formAdd.privacyPage === 'bookingStoreFront')">
                        <v-autocomplete
                          v-model="formAdd.flowId"
                          :items="flow"
                          :rules="nameRules"
                          required
                          clearable
                          label="ประเภทบริการ"
                          dense
                          outlined
                          multiple
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" class="pa-0" v-if="(formAdd.masBranchID !== '' && formAdd.masBranchID !== null) && (formAdd.privacyPage === 'bookingform' || formAdd.privacyPage === 'bookingStoreFront') && shopId === 'Ub7cbc419244731cdd682354dd0e57cef'">
                        <v-select
                          v-model="formAdd.credit_package"
                          :items="credit_package_item"
                          :rules="nameRules"
                          required
                          label="จำนวนตั๋ว / คาบ"
                          dense
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <v-textarea
                          v-model="formAdd.additionalInformation"
                          auto-grow
                          rows="2"
                          label="ข้อมูลเพิ่มเติม"
                          dense
                          outlined
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="2"
                  block
                  dark
                  large
                  color="#173053"
                  @click="addData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึก
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end add -->

          <!-- edit -->
          <v-dialog v-model="dialogEdit" persistent max-width="600px">
            <v-card class="pa-1" >
              <v-card-text class="pa-0 px-2">
                <v-container>
                  <v-form
                    ref="form_update"
                    v-model="valid_update"
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
                            @click=";(dialogEdit = false), (dataReady = true)"
                          >
                            X
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-col cols="12" class="text-center">
                        <v-img
                          aspect-ratio="6"
                          contain
                          :src="formUpdate.pictureUrlPreview"
                        ></v-img>
                        <!-- <v-avatar size="100px"><img alt="Avatar" :src="formAdd.pictureUrl"></v-avatar> -->
                        <br />
                        <v-file-input
                          required
                          counter
                          show-size
                          accept="image/png, image/jpeg, image/bmp"
                          prepend-icon="mdi-camera"
                          label="รูปพนักงาน (ถ้ามี)"
                          @change="selectImgUpdate"
                          v-model="filesUpdate"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="pa-0">
                        <v-select
                          dense
                          outlined
                          label="คำนำหน้า*"
                          :items="itemsTitle"
                          v-model="formUpdate.empTitle_NameTH"
                          :rules="nameRules"
                          :counter="50"
                          maxlength="50"
                          required
                          attach
                          :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <v-text-field
                          dense
                          outlined
                          label="ชื่อ*"
                          v-model="formUpdate.empFirst_NameTH"
                          :rules="nameRules"
                          :counter="50"
                          maxlength="50"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <v-text-field
                          dense
                          outlined
                          label="นามสกุล*"
                          v-model="formUpdate.empLast_NameTH"
                          :rules="nameRules"
                          :counter="50"
                          maxlength="50"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <v-text-field
                          dense
                          outlined
                          label="เบอร์โทร*"
                          v-model="formUpdate.phoneNumber"
                          v-mask="'###-###-####'"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pa-0" v-if="statusGoogleCalendar === 'True' && statusGoogleCalendarEmp === 'True'">
                        <v-text-field
                          dense
                          outlined
                          label="E-mail*"
                          v-model="formUpdate.empEmail"
                          :rules="nameRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pa-0" v-else>
                        <v-text-field
                          dense
                          outlined
                          label="E-mail*"
                          v-model="formUpdate.empEmail"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="pa-0">
                        <v-select
                          dense
                          outlined
                          v-model="formUpdate.privacyPage"
                          :items="privacyPageSelect"
                          menu-props="auto"
                          :rules="nameRules"
                          label="เลือกหน้าที่จะแสดง"
                          prepend-icon="mdi-map"
                          attach
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pa-0" >
                        <v-select
                          dense
                          outlined
                          v-model="formUpdate.masBranchID"
                          :item-text="branch.text"
                          :items="branch"
                          label="สาขา"
                          clearable
                          :menu-props="{ bottom: true, offsetY: true }"
                          @change="selectBranchEdit()"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pa-0" v-if="(formUpdate.masBranchID !== '' && formUpdate.masBranchID !== null) && (formUpdate.privacyPage === 'bookingform' || formUpdate.privacyPage === 'bookingStoreFront')">
                        <v-select
                          v-model="formUpdate.flowId"
                          :items="flow"
                          label="ประเภทบริการ"
                          clearable
                          dense
                          outlined
                          multiple
                          attach
                          :rules="nameRules"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pa-0" v-if="(formUpdate.masBranchID !== '' && formUpdate.masBranchID !== null) && (formUpdate.privacyPage === 'bookingform' || formUpdate.privacyPage === 'bookingStoreFront') && shopId === 'Ub7cbc419244731cdd682354dd0e57cef'">
                        <v-select
                          v-model="formUpdate.credit_package"
                          :items="credit_package_item"
                          :rules="nameRules"
                          required
                          label="จำนวนตั๋ว / คาบ"
                          dense
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <v-textarea
                          v-model="formUpdate.additionalInformation"
                          auto-grow
                          rows="2"
                          label="ข้อมูลเพิ่มเติม"
                          dense
                          outlined
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  elevation="2"
                  block
                  dark
                  large
                  color="#173053"
                  @click="editData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึก
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end edit -->

          <!-- delete -->
          <v-dialog v-model="dialogDelete" persistent max-width="400px">
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
                          @click=";(dialogDelete = false), (dataReady = true)"
                        >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        label="ชื่อพนักงาน"
                        :value="
                          formUpdate.empTitle_NameTH +
                            formUpdate.empFirst_NameTH +
                            ' ' +
                            formUpdate.empLast_NameTH
                        "
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  elevation="2"
                  block
                  dark
                  large
                  color="#173053"
                  @click="deleteData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  ลบ
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end delete -->
          <!-- dialog limitbookint -->
          <v-dialog v-model="dialoglimitbooking"  persistent min-width="400">
            <v-card
              min-height="500px" class="pa-1 "
              color="#F4F4F4"
            >
              <!-- <v-card-title>asdasdasdas</v-card-title> -->
              <v-container>
                <div
                  style="display: flex;justify-content: space-between;"
                  class="ml-5"
                >
                  <h2 class="font-weight-bold" style="color:#173053;">
                    ตั้งค่าวันหยุด / ตั้งจัดการเวลา
                  </h2>
                  <v-btn
                    fab
                    small
                    dark
                    color="#F3F3F3"
                    @click=";(dialoglimitbooking = false), clearLimit()"
                  >
                    <v-icon dark color="#FE4A01 ">
                      mdi-close
                    </v-icon>
                  </v-btn>
                </div>
              </v-container>
              <v-card-text>
                <v-container>
                  <v-form
                    ref="form_update"
                    v-model="valid_update"
                    lazy-validation
                  >
                  <v-row style="display: flex;justify-content: center;">
                  <v-col style="min-width: 270px;max-width: 400px;">
                        <v-row>
                          <v-col cols="12">
                            <v-card class="pa-3">
                              <!-- <strong class="font-weight-bold">วันหยุดทั่วไปของบริษัท</strong> -->
                              <h4 class="font-weight-bold">
                                วันหยุดทั่วไปของบริษัท
                              </h4>
                              <v-select
                                class="mt-3"
                                v-model="formUpdateLimitbooking.dateDayoffText"
                                :items="itemDateStop"
                                small-chips
                                dense
                                label="เลือกวันหยุด"
                                multiple
                                outlined
                                attach
                                :menu-props="{ bottom: true, offsetY: true }"
                                @change="changedateDayoff()"
                              ></v-select>
                            </v-card>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-card class="pa-6">
                              <!-- <strong class="font-weight-bold">วันหยุดประจำปีของบริษัท </strong> -->
                              <h4 class="font-weight-bold mt-n2 ml-n2">
                                วันหยุดประจำปีของบริษัท
                              </h4>
                              <v-select
                                class="ma-0 mt-5"
                                v-model="formUpdateLimitbooking.typeDayCustom"
                                :item-text="typeDayCustomitem.text"
                                :items="typeDayCustomitem"
                                label="ประเภทของวันหยุด"
                                dense
                                outlined
                                attach
        :menu-props="{ bottom: true, offsetY: true }"
                              ></v-select>
                              <v-date-picker
                                v-model="formUpdateLimitbooking.dateDayCustom"
                                :allowed-dates="allowedDates"
                                multiple
                                elevation="1"
                                full-width
                                class="mt-0"
                              ></v-date-picker>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-divider class="mx-4" vertical v-if="formUpdateLimitbooking.USER_ROLE !== 'onsite'"></v-divider>
                      <v-col style="min-width: 300px;" v-if="formUpdateLimitbooking.USER_ROLE !== 'onsite'">
                      <v-card class="pa-3 mb-5" min-height="675px">
                          <h4 class="font-weight-bold mt-2">
                            จัดการเวลานัดหมาย
                          </h4>
                          <v-row align="center" class="ma-0">
                            <v-checkbox
                              @click="chekshowTime()"
                              false-value="False"
                              true-value="True"
                              readonly
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              label="ต้องการใช้งานการจำกัดคิวนัดหมาย"
                              v-model="formUpdateLimitbooking.limitBookingCheck"
                              hide-details
                              class="shrink ml-6 mr-0 mt-0 mb-2"
                            ></v-checkbox>
                          </v-row>
                          <v-row align="center" class="ma-0">
                            <v-checkbox
                              false-value="False"
                              true-value="True"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              label="เวลาไม่เหมือนกันในแต่ละวัน"
                              v-model="formUpdateLimitbooking.setTimebyday"
                              hide-details
                              class="shrink ml-6 mr-0 mt-0 mb-2"
                            ></v-checkbox>
                          </v-row>
                          <v-row class="pl-8 mb-3" v-if="formUpdateLimitbooking.setTimebyday === 'True'" >
                              <v-btn-toggle
                              style="display: flex;flex-wrap: wrap;"
                                v-model="toggle_setTimebyday"
                                mandatory
                              >
                              <div v-for="(item, i) in setTimebyday" :key="i" >
                                <!-- {{toggle_setTimebyday + ' ' +i}} -->
                                <!-- v-if="JSON.parse(formUpdateLimitbooking.dateDayoffValue).filter((t) => t === item.value).length === 0" -->
                                <v-btn
                                class="ma-1"
                                elevation="2"
                                dark
                                :color="toggle_setTimebyday === i ? 'rgb(22 48 83)' : 'rgb(22 48 83)'">
                                  <v-icon v-if="toggle_setTimebyday === i " color="#FFFFFF">mdi-check-circle</v-icon>
                                  <h4 v-else class="font-weight-bold">{{item.text}}</h4>
                                </v-btn>
                              </div>
                              </v-btn-toggle>
                            </v-row>
                          <div class="text-center px-5 mb-5" v-if="formUpdateLimitbooking.setTimebyday === 'False'">
                            <v-sheet class="pa-0">
                              <v-row class="mt-3 mb-3" style="border-color: #cecece;border-style: solid;border-width: 1px;">
                                <v-col cols="12" style="display:flex;justify-content: flex-start;flex-wrap: wrap;align-items: center;">
                                  <v-btn small color="primary" @click="presetTimeExport()">
                                    <v-icon left>mdi-file-excel</v-icon>
                                    Template
                                  </v-btn>
                                </v-col>
                                <v-col cols="12" style="display:flex;justify-content: center;flex-wrap: wrap;align-items: center;">
                                  <v-file-input
                                    v-model="ExcelField"
                                    label="อัพโหลด"
                                    outlined
                                    dense
                                    small-chips
                                    accept=".xls,.xlsx"
                                    hide-details
                                  ></v-file-input>
                                  <v-btn class="ml-3 my-3" small fab v-if="ExcelField" color="primary" @click="presetTimeUpload()">
                                    <v-icon>mdi-arrow-down-bold</v-icon>
                                  </v-btn>
                                  <!-- <input type="file" id="fileInput" /> -->
                                </v-col>
                              </v-row>
                              <v-row class="mt-3">
                                <v-col cols="12" style="display:flex;justify-content: space-between;flex-wrap: wrap;"  class="pt-0" >
                                <v-btn
                                    small
                                    class="mb-2"
                                    color="green"
                                    dark
                                    @click="presetTime()"
                                  >
                                  <v-icon class="mr-2" small dark> mdi-clock-time-eight</v-icon>เพิ่มเวลาอัตโนมัติ
                                  </v-btn>
                                <v-btn
                                  small
                                  color="primary"
                                  dark
                                  @click="addNewNew">
                                  <v-icon class="mr-2" small dark>mdi-plus-box</v-icon>เพิ่มเวลานัดหมาย
                                </v-btn>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mb-0"
                                  style="text-align: center;"
                                >
                                  <v-data-table
                                    disable-pagination
                                    hide-default-footer
                                    :headers="columnsAddTime"
                                    :items="dataItemAddTime"
                                    :search="search"
                                    disable-sort
                                    class="elevation-1"
                                    min-height="300px"
                                  >
                                    <template v-slot:[`item.text`]="{ item }">
                                      <v-text-field
                                        class="pa-0 ma-0"
                                        filled
                                        v-model="editedItemNew.text"
                                        :counter="50"
                                        maxlength="50"
                                        :hide-details="true"
                                        dense
                                        single-line
                                        :autofocus="true"
                                        v-if="item.id === editedItemNew.id"
                                      ></v-text-field>
                                      <span v-else>{{ item.text }}</span>
                                    </template>
                                    <template v-slot:[`item.value`]="{ item }">
                                      <v-text-field
                                        class="pa-0 ma-0"
                                        placeholder="HH:mm"
                                        filled
                                        v-model="editedItemNew.value"
                                        v-mask="'##:##'"
                                        :hide-details="true"
                                        dense
                                        single-line
                                        v-if="item.id === editedItemNew.id"
                                      ></v-text-field>
                                      <span v-else>{{ item.value }}</span>
                                    </template>
                                    <template
                                      v-slot:[`item.limitBooking`]="{ item }"
                                    >
                                      <div v-if="item.id === editedItemNew.id">
                                        <!-- <v-text-field class="pa-0 ma-0" filled v-model="editedItemNew.limitBooking" :hide-details="true" dense single-line v-if="formUpdateLimitbooking.limitBookingCheck === 'True'" ></v-text-field>
              <v-text-field class="pa-0 ma-0" filled v-model="editedItemNew.limitBooking" :hide-details="true" disabled dense single-line v-else></v-text-field> -->
                                        <!-- <v-text-field
                                          class="pa-0 ma-0"
                                          filled
                                          v-model="editedItemNew.limitBooking"
                                          :hide-details="true"
                                          disabled
                                          dense
                                          single-line
                                        ></v-text-field> -->
                                        <v-row align="center">
                                        <v-switch
                                          false-value="0"
                                          true-value="1"
                                          color="success"
                                          v-model="editedItemNew.limitBooking"
                                          hide-details
                                          class="shrink ml-6 mr-0 mt-0 mb-2"
                                        ></v-switch>
                                        <v-chip
                                          v-if="(editedItemNew.limitBooking === '1' || editedItemNew.limitBooking === 1)"
                                          color="green"
                                          text-color="white"
                                        >รับนัดหมาย</v-chip>
                                        <v-chip
                                          v-else
                                          color="red"
                                          text-color="white"
                                        >ไม่รับนัดหมาย</v-chip>
                                      </v-row>
                                      </div>
                                      <div v-else>
                                        <v-chip
                                          v-if="(item.limitBooking === '1' || item.limitBooking === 1)"
                                          color="green"
                                          text-color="white"
                                        >รับนัดหมาย</v-chip>
                                        <v-chip
                                          v-else
                                          color="red"
                                          text-color="white"
                                        >ไม่รับนัดหมาย</v-chip>
                                      </div>
                                    </template>
                                    <template
                                      v-slot:[`item.actions2`]="{ item }"
                                    >
                                      <div
                                        class="pa-0 ma-0"
                                        v-if="item.id === editedItemNew.id"
                                      >
                                        <v-icon
                                          color="red"
                                          class="mr-3"
                                          @click="closeNew"
                                        >
                                          mdi-window-close
                                        </v-icon>
                                        <v-icon color="green" @click="saveNew">
                                          mdi-content-save
                                        </v-icon>
                                      </div>
                                      <div v-else>
                                        <v-icon
                                          color="green"
                                          class="mr-3"
                                          @click="editItemNew(item)"
                                        >
                                          mdi-pencil
                                        </v-icon>
                                        <v-icon
                                          color="red"
                                          @click="deleteItemNew(item)"
                                        >
                                          mdi-delete
                                        </v-icon>
                                      </div>
                                    </template>
                                  </v-data-table>
                                </v-col>
                              </v-row>
                            </v-sheet>
                          </div>
                          <div class="text-center px-5 mb-5" v-else>
                            <v-sheet class="pa-0">
                              <v-row class="mt-3 mb-3" style="border-color: #cecece;border-style: solid;border-width: 1px;">
                                <v-col cols="12" style="display:flex;justify-content: flex-start;flex-wrap: wrap;align-items: center;">
                                  <v-btn small color="primary" @click="presetTimebydayExport()">
                                    <v-icon left>mdi-file-excel</v-icon>
                                    Template (อา. - ส.)
                                  </v-btn>
                                </v-col>
                                <v-col cols="12" style="display:flex;justify-content: center;flex-wrap: wrap;align-items: center;">
                                  <v-file-input
                                    v-model="ExcelField"
                                    label="อัพโหลด"
                                    outlined
                                    dense
                                    small-chips
                                    accept=".xls,.xlsx"
                                    hide-details
                                  ></v-file-input>
                                  <v-btn class="ml-3 my-3" small fab v-if="ExcelField" color="primary" @click="presetTimebydayUpload()">
                                    <v-icon>mdi-arrow-down-bold</v-icon>
                                  </v-btn>
                                  <!-- <input type="file" id="fileInput" /> -->
                                </v-col>
                              </v-row>
                              <v-row class="mt-3">
                                <v-col cols="12" style="display:flex;justify-content: space-between;flex-wrap: wrap;"  class="pt-0" >
                                <v-btn
                                    small
                                    class="mb-2"
                                    color="teal"
                                    dark
                                    @click="presetTimebyday()"
                                  >
                                  <v-icon class="mr-2" small dark> mdi-clock-time-eight</v-icon>เพิ่มเวลาอัตโนมัติ
                                  </v-btn>
                                <v-btn
                                  small
                                  color="#173053"
                                  dark
                                  @click="addNewNewbyday">
                                  <v-icon class="mr-2" small dark>mdi-plus-box</v-icon>เพิ่มเวลานัดหมาย
                                </v-btn>
                                </v-col>
                                <v-col
                                  cols="12"
                                  class="mb-0"
                                  style="text-align: center;"
                                >
                                  <v-data-table
                                    disable-pagination
                                    hide-default-footer
                                    :headers="columnsAddTime"
                                    :items="dataItemAddTimebyday.filter((i) => i.value === toggle_setTimebyday)[0].setTime"
                                    :search="search"
                                    disable-sort
                                    class="elevation-1"
                                    min-height="300px"
                                  >
                                    <template v-slot:[`item.text`]="{ item }">
                                      <v-text-field
                                        class="pa-0 ma-0"
                                        filled
                                        v-model="editedItemNew.text"
                                        :counter="50"
                                        maxlength="50"
                                        :hide-details="true"
                                        dense
                                        single-line
                                        :autofocus="true"
                                        v-if="item.id === editedItemNew.id"
                                      ></v-text-field>
                                      <span v-else>{{ item.text }}</span>
                                    </template>
                                    <template v-slot:[`item.value`]="{ item }">
                                      <v-text-field
                                        class="pa-0 ma-0"
                                        placeholder="HH:mm"
                                        filled
                                        v-model="editedItemNew.value"
                                        v-mask="'##:##'"
                                        :hide-details="true"
                                        dense
                                        single-line
                                        v-if="item.id === editedItemNew.id"
                                      ></v-text-field>
                                      <span v-else>{{ item.value }}</span>
                                    </template>
                                    <template
                                      v-slot:[`item.limitBooking`]="{ item }"
                                    >
                                      <div v-if="item.id === editedItemNew.id">
                                        <!-- <v-text-field class="pa-0 ma-0" filled v-model="editedItemNew.limitBooking" :hide-details="true" dense single-line v-if="formUpdateLimitbooking.limitBookingCheck === 'True'" ></v-text-field>
              <v-text-field class="pa-0 ma-0" filled v-model="editedItemNew.limitBooking" :hide-details="true" disabled dense single-line v-else></v-text-field> -->
                                        <!-- <v-text-field
                                          class="pa-0 ma-0"
                                          filled
                                          v-model="editedItemNew.limitBooking"
                                          :hide-details="true"
                                          disabled
                                          dense
                                          single-line
                                        ></v-text-field> -->
                                        <v-row align="center">
                                        <v-switch
                                          false-value="0"
                                          true-value="1"
                                          color="success"
                                          v-model="editedItemNew.limitBooking"
                                          hide-details
                                          class="shrink ml-6 mr-0 mt-0 mb-2"
                                        ></v-switch>
                                        <v-chip
                                          v-if="(editedItemNew.limitBooking === '1' || editedItemNew.limitBooking === 1)"
                                          color="green"
                                          text-color="white"
                                        >รับนัดหมาย</v-chip>
                                        <v-chip
                                          v-else
                                          color="red"
                                          text-color="white"
                                        >ไม่รับนัดหมาย</v-chip>
                                      </v-row>
                                      </div>
                                      <div v-else>
                                        <v-chip
                                          v-if="(item.limitBooking === '1' || item.limitBooking === 1)"
                                          color="green"
                                          text-color="white"
                                        >รับนัดหมาย</v-chip>
                                        <v-chip
                                          v-else
                                          color="red"
                                          text-color="white"
                                        >ไม่รับนัดหมาย</v-chip>
                                      </div>
                                    </template>
                                    <template
                                      v-slot:[`item.actions2`]="{ item }"
                                    >
                                      <div
                                        class="pa-0 ma-0"
                                        v-if="item.id === editedItemNew.id"
                                      >
                                        <v-icon
                                          color="red"
                                          class="mr-3"
                                          @click="closeNewbyday"
                                        >
                                          mdi-window-close
                                        </v-icon>
                                        <v-icon color="green" @click="saveNewbyday">
                                          mdi-content-save
                                        </v-icon>
                                      </div>
                                      <div v-else>
                                        <v-icon
                                          color="green"
                                          class="mr-3"
                                          @click="editItemNewbyday(item)"
                                        >
                                          mdi-pencil
                                        </v-icon>
                                        <v-icon
                                          color="red"
                                          @click="deleteItemNewbyday(item)"
                                        >
                                          mdi-delete
                                        </v-icon>
                                      </div>
                                    </template>
                                  </v-data-table>
                                </v-col>
                              </v-row>
                            </v-sheet>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <div class="text-center">
                <v-btn
                  width="100%"
                  class="ma-0 mb-2"
                  elevation="2"
                  large
                  dark
                  color="#173053"
                  :disabled="!valid_update"
                  @click="EditlimitBooking()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึก
                </v-btn>
              </div>
            </v-card>
          </v-dialog>
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
                  disable-pagination
                  hide-default-footer
                >
                  <template v-slot:[`item.privacyPage`]="{ item }">
                    <p v-if="item.privacyPage === 'booking'">หน้านัดหมาย</p>
                    <p v-if="item.privacyPage === 'board'">
                      หน้ากระดานการทำงาน
                    </p>
                    <p v-if="item.privacyPage === 'bookingform'">
                      หน้านัดหมายของลูกค้า
                    </p>
                    <p v-if="item.privacyPage === 'bookingStoreFront'">
                      นัดหมายบัตรคิว
                    </p>
                    <p v-if="item.privacyPage === 'all'">ทั้งหมด</p>
                  </template>
                  <template v-slot:[`item.CREATE_DATE`]="{ item }">
                    {{ format_date(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                    {{ format_date(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      v-if="item.privacyPage === 'bookingform' || item.USER_ROLE === 'onsite'"
                      color="purple"
                      fab
                      small
                      @click="
                        ;(dialoglimitbooking = true), getlimitbooking(item)
                      "
                    >
                      <v-icon color="#FFFFFF"> mdi-calendar-clock </v-icon>
                    </v-btn>
                    <v-btn
                      color="blue"
                      fab
                      small
                      dark
                      @click.stop="
                        ;(dialogEdit = true),
                          getDataById(item)
                      "
                    >
                      <v-icon> mdi-tools </v-icon>
                    </v-btn>
                    <v-btn
                      color="red"
                      dark
                      fab
                      small
                      @click.stop=";(dialogDelete = true), getDataById(item)"
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
import moment from 'moment' // แปลง date
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
    waitingAlert,
    'left-menu-admin': adminLeftMenu,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  computed: {
    draggingInfo () {
      return this.dragging ? 'under drag' : ''
    }
  },
  data () {
    return {
      dialogSortEmp: false,
      PK: '',
      path: '/empSelect/', // Path Model
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'รายชื่อพนักงาน',
          disabled: true,
          href: '/Master/Employee'
        }
      ],
      // End Menu Config
      itemsTitle: ['นาย', 'นาง', 'นางสาว', 'คุณ', ' '],
      credit_package_item: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      dataReady: true,
      dateTime: '', // Generate DateTime
      date: this.momenDate_1(new Date()),
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      code: 'EMP_', // Generate Code
      valid_add: true,
      valid_update: true,
      // Dialog Config ADD EDIT DELETE IMPORT
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogImport: false,
      dialoglimitbooking: false,
      // END Dialog Config ADD EDIT DELETE
      panel: [0],
      panel1: [1],
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      // Search All
      searchAll2: '',
      formAdd: {
        empCode: '',
        empTitle_NameTH: '',
        empFirst_NameTH: '',
        empLast_NameTH: '',
        privacyPage: '',
        empImge: '',
        pictureUrlPreview: '',
        shopId: this.$session.getAll().data.shopId,
        setTime: [],
        masBranchID: '',
        flowId: '',
        additionalInformation: '',
        phoneNumber: '',
        empEmail: '',
        credit_package: 1
      },
      formUpdate: {
        empCode: '',
        empTitle_NameTH: '',
        empFirst_NameTH: '',
        empLast_NameTH: '',
        empImge: '',
        pictureUrlPreview: '',
        privacyPage: '',
        setTime: [],
        masBranchID: '',
        flowId: '',
        additionalInformation: '',
        phoneNumber: '',
        empEmail: '',
        credit_package: 1
      },
      formUpdateItem: {
        empCode: '',
        empTitle_NameTH: '',
        empFirst_NameTH: '',
        empLast_NameTH: '',
        privacyPage: '',
        empImge: '',
        setTime: [],
        masBranchID: '',
        flowId: '',
        additionalInformation: '',
        phoneNumber: '',
        empEmail: '',
        credit_package: 1
      },
      formUpdateLimitbooking: {
        empId: null,
        time: '',
        setTime: '',
        limitBooking: 1,
        limitBookingCheck: 'True',
        setTimebyday: 'False',
        shopId: this.$session.getAll().data.shopId,
        dateDayoffText: [],
        dateDayoffValue: [],
        dateDayCustom: [],
        typeDayCustom: ''
      },
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
      itemDateStop: [
        'วันอาทิตย์',
        'วันจันทร์',
        'วันอังคาร',
        'วันพุธ',
        'วันพฤหัสบดี',
        'วันศุกร์',
        'วันเสาร์'
      ],
      itemDateStopValue: [0, 1, 2, 3, 4, 5, 6],
      privacyPageSelect: [
        { text: 'รายชื่อลูกค้านัดหมาย', value: 'booking' },
        { text: 'หน้ากระดานการทำงาน', value: 'board' },
        { text: 'หน้านัดหมายของลูกค้า', value: 'bookingform' },
        { text: 'นัดหมายบัตรคิว', value: 'bookingStoreFront' },
        { text: 'ทั้งหมด', value: 'all' }
      ],
      nameRules: [v => !!v || 'กรุณากรอกข้อมูล '],
      // End Form Config ADD EDIT
      // Data Table Config
      columns: [
        // { text: 'id', value: 'empId', align: 'center' },
        { text: 'ชื่อ-นามสกุล', value: 'empFull_NameTH', align: 'center' },
        { text: 'แสดงชื่อ', value: 'privacyPage', align: 'center' },
        // { text: 'แผนก', value: 'positionName', align: 'center' },
        // { text: 'สาขา', value: 'masBranchName', align: 'center' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
        { text: 'Action', value: 'action', sortable: false, align: 'center' }
      ],
      dataItem: [],
      // End Data Table Config
      // Config Import
      columnsImport: [
        { text: 'empCode', value: 'empCode' },
        { text: 'empTitle_NameTH', value: 'empTitle_NameTH' },
        { text: 'empFirst_NameTH', value: 'empFirst_NameTH' },
        { text: 'empLast_NameTH', value: 'empLast_NameTH' },
        { text: 'privacyPage', value: 'privacyPage' }
      ],
      dataItemImportChecKHide: true,
      dataItemImport: [],
      // End Config Import
      json_meta: [
        [
          {
            key: 'charset',
            value: 'utf-8'
          }
        ]
      ],
      filesUpdate: null,
      filesAdd: null,
      dataItemAddTimebyday: [
        { text: 'อา.', value: 0, setTime: [] },
        { text: 'จ.', value: 1, setTime: [] },
        { text: 'อ.', value: 2, setTime: [] },
        { text: 'พ.', value: 3, setTime: [] },
        { text: 'พฤ.', value: 4, setTime: [] },
        { text: 'ศ.', value: 5, setTime: [] },
        { text: 'ส.', value: 6, setTime: [] }
      ],
      dataItemAddTime: [],
      columnsAddTime: [
        { text: 'ID', value: 'id' },
        { text: 'แสดงเวลา', value: 'text' },
        { text: 'เวลา', value: 'value' },
        {
          text: 'สถานะ',
          value: 'limitBooking',
          align: 'center',
          width: '200px'
        },
        // { text: 'เรียงตำแหน่ง', value: 'actions1', align: 'center' },
        {
          text: 'จัดการเวลา',
          value: 'actions2',
          align: 'center',
          width: '100px'
        }
      ],
      search: '',
      editedIndexNew: -1,
      editedItemNew: {
        id: 0,
        text: '',
        value: '',
        limitBooking: '1'
      },
      defaultItemNew: {
        id: 0,
        text: '',
        value: '',
        limitBooking: '1'
      },
      BookingFieldshowtime: null,
      branch: [],
      flow: [],
      value: '',
      flowIdAdd: [],
      toggle_setTimebyday: 0,
      setTimebyday: [
        { text: 'อา.', value: 0 },
        { text: 'จ.', value: 1 },
        { text: 'อ.', value: 2 },
        { text: 'พ.', value: 3 },
        { text: 'พฤ.', value: 4 },
        { text: 'ศ.', value: 5 },
        { text: 'ส.', value: 6 }
      ],
      statusGoogleCalendar: '',
      statusGoogleCalendarEmp: '',
      ExcelField: null,
      enabled: true,
      dragging: false,
      dessertsSort: []
      // End Export Config
    }
  },
  async mounted () {
    // await this.getDataFlow()
    await this.getDataBranch()
    await this.getBookingField()
    // this.getGetToken(this.DNS_IP)
    this.dataReady = false
    // Get Data
    await this.getDataGlobal(
      this.DNS_IP,
      this.path,
      this.$session.getAll().data.shopId
    )
    if (this.dataItem.length > 0) {
      this.dessertsSort = []
      for (let i = 0; i < this.dataItem.length; i++) {
        let d = this.dataItem[i]
        let s = {}
        s.empId = d.empId
        s.empFull_NameTH = d.empFull_NameTH
        this.dessertsSort.push(s)
      }
    }
    await this.getShop()
  },
  methods: {
    checkMove: function (e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    },
    saveSortEmp () {
      this.$swal({
        title: 'ต้องการ เปลี่ยนแปลงลำดับการแสดง ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async (result) => {
          this.dataReady = false
          let dt = {
            data: this.dessertsSort
          }
          await axios
            .post(this.DNS_IP + '/empSelect/updateSortEmp', dt)
            .then(async (response) => {
              this.$swal('เรียบร้อย', 'เปลี่ยนแปลงลำดับการแสดง เรียบร้อย', 'success')
              this.dialogSortEmp = false
              this.dataReady = true
              await this.getDataGlobal(this.DNS_IP, this.path, this.session.data.shopId)
              if (this.dataItem.length > 0) {
                this.dessertsSort = []
                for (let i = 0; i < this.dataItem.length; i++) {
                  let d = this.dataItem[i]
                  let s = {}
                  s.empId = d.empId
                  s.empFull_NameTH = d.empFull_NameTH
                  this.dessertsSort.push(s)
                }
              }
            })
            .catch(error => {
              console.log('error function addData : ', error)
              this.dataReady = true
            })
        })
      // console.log('dataList', JSON.stringify(dataList))
    },
    presetTimebydayExport () {
      let timeExport = [
        { แสดงเวลา: '08:00', เวลา: '08:00' },
        { แสดงเวลา: '08:30', เวลา: '08:30' },
        { แสดงเวลา: '09:00', เวลา: '09:00' },
        { แสดงเวลา: '09:30', เวลา: '09:30' },
        { แสดงเวลา: '10:00', เวลา: '10:00' },
        { แสดงเวลา: '10:30', เวลา: '10:30' },
        { แสดงเวลา: '11:00', เวลา: '11:00' },
        { แสดงเวลา: '11:30', เวลา: '11:30' },
        { แสดงเวลา: '12:00', เวลา: '12:00' },
        { แสดงเวลา: '12:30', เวลา: '12:30' },
        { แสดงเวลา: '13:00', เวลา: '13:00' },
        { แสดงเวลา: '13:30', เวลา: '13:30' },
        { แสดงเวลา: '14:00', เวลา: '14:00' },
        { แสดงเวลา: '14:30', เวลา: '14:30' },
        { แสดงเวลา: '15:00', เวลา: '15:00' },
        { แสดงเวลา: '15:30', เวลา: '15:30' },
        { แสดงเวลา: '16:00', เวลา: '16:00' },
        { แสดงเวลา: '16:30', เวลา: '16:30' },
        { แสดงเวลา: '17:00', เวลา: '17:00' }
      ]
      let sheetName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      // var info = XLSX.utils.json_to_sheet(timeExport)
      var wb = XLSX.utils.book_new() // make Workbook of Excel
      sheetName.forEach((item) => {
        let info = XLSX.utils.json_to_sheet(timeExport)
        XLSX.utils.book_append_sheet(wb, info, item)
      })
      console.log('wb', wb)
      // XLSX.utils.book_append_sheet(wb, info, 'worksheet1') // sheetAName is name of Worksheet
      XLSX.writeFile(wb, 'file.xls') // name of the file is 'book.xlsx'
    },
    presetTimeExport () {
      let timeExport = [
        { แสดงเวลา: '08:00', เวลา: '08:00' },
        { แสดงเวลา: '08:30', เวลา: '08:30' },
        { แสดงเวลา: '09:00', เวลา: '09:00' },
        { แสดงเวลา: '09:30', เวลา: '09:30' },
        { แสดงเวลา: '10:00', เวลา: '10:00' },
        { แสดงเวลา: '10:30', เวลา: '10:30' },
        { แสดงเวลา: '11:00', เวลา: '11:00' },
        { แสดงเวลา: '11:30', เวลา: '11:30' },
        { แสดงเวลา: '12:00', เวลา: '12:00' },
        { แสดงเวลา: '12:30', เวลา: '12:30' },
        { แสดงเวลา: '13:00', เวลา: '13:00' },
        { แสดงเวลา: '13:30', เวลา: '13:30' },
        { แสดงเวลา: '14:00', เวลา: '14:00' },
        { แสดงเวลา: '14:30', เวลา: '14:30' },
        { แสดงเวลา: '15:00', เวลา: '15:00' },
        { แสดงเวลา: '15:30', เวลา: '15:30' },
        { แสดงเวลา: '16:00', เวลา: '16:00' },
        { แสดงเวลา: '16:30', เวลา: '16:30' },
        { แสดงเวลา: '17:00', เวลา: '17:00' }
      ]
      var info = XLSX.utils.json_to_sheet(timeExport)
      var wb = XLSX.utils.book_new() // make Workbook of Excel
      XLSX.utils.book_append_sheet(wb, info, 'worksheet1') // sheetAName is name of Worksheet
      XLSX.writeFile(wb, 'file.xls') // name of the file is 'book.xlsx'
    },
    presetTimebydayUpload () {
      const file = this.ExcelField
      console.log('file', file)
      const reader = new FileReader()
      console.log('reader', reader)
      reader.onload = (e) => { // เปลี่ยนเป็น Arrow Function
        const dataBuffer = new Uint8Array(e.target.result)
        // const workbook = XLSX.read(dataBuffer, { type: 'array' })
        const workbook = XLSX.read(dataBuffer, { type: 'array', cellDates: true })
        console.log('workBook', workbook)
        console.log('this.dataItemAddTimebyday', this.dataItemAddTimebyday)
        try {
          workbook.SheetNames.forEach((item, keyDay) => {
            let data = [] // เปลี่ยนตัวแปร Data เป็น data ในระดับฟังก์ชัน presetTimeUpload
            let SheetNames = item
            // console.log('SheetName', SheetNames)
            const worksheet = workbook.Sheets[SheetNames]
            // console.log('worksheet', worksheet)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            console.log('jsonData' + item, jsonData[0][0] === 'แสดงเวลา', jsonData[0][1] === 'เวลา')
            if (jsonData[0][0] === 'แสดงเวลา' && jsonData[0][1] === 'เวลา') {
              try {
                jsonData.forEach((item, key) => {
                  if (key > 0 && item.length > 0) {
                    const pattern = /^([01]\d|2[0-3]):[0-5]\d$/
                    let s = {}
                    s.id = key
                    // this.convertDateToTime(item[0])
                    s.text = typeof item[0] === 'object' ? moment(item[0]).format('HH:mm') : item[0].toString()
                    // s.value = typeof item[1] === 'object' ? moment(item[1]).format('HH:mm') : item[1].toString()
                    s.value = typeof item[1] === 'object' ? moment(item[1]).format('HH:mm') : pattern.test(item[1]) ? item[1].toString() : null
                    s.limitBooking = '1'
                    data.push(s) // ใช้ตัวแปร data ในการเก็บข้อมูลแทนการใช้ Data
                  }
                })
                console.log(item + ' สำเร็จ')
              } catch (error) {
                console.log('error', error, item, keyDay)
              }
              this.ExcelField = null
            } else {
              console.log('ผิดพลาดที่', item, keyDay)
              this.ExcelField = null
            }
            // console.log('data', data) // ตรวจสอบข้อมูลที่ถูกเก็บในตัวแปร data
            if (data.length > 0) {
            // this.dataItemAddTime = data // เข้าถึง this.dataItemAddTime ผ่าน Arrow Function
              this.dataItemAddTimebyday.filter((item) => item.value === keyDay).map((item) => {
                item.setTime = data
              })
            }
          })
          this.$swal({
            title: 'successfully',
            text: 'สำเร็จ',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          this.ExcelField = null
        } catch (error) {
          console.log('error', error)
          this.ExcelField = null
          this.$swal('ผิดพลาด', 'โปรดลองใหม่อีกครั้ง', 'error')
        }
      }
      reader.readAsArrayBuffer(file)
    },
    presetTimeUpload () {
      const file = this.ExcelField
      console.log('file', file)
      let data = [] // เปลี่ยนตัวแปร Data เป็น data ในระดับฟังก์ชัน presetTimeUpload
      const reader = new FileReader()
      console.log('reader', reader)
      reader.onload = (e) => { // เปลี่ยนเป็น Arrow Function
        const dataBuffer = new Uint8Array(e.target.result)
        // const workbook = XLSX.read(dataBuffer, { type: 'array' })
        const workbook = XLSX.read(dataBuffer, { type: 'array', cellDates: true })
        // console.log('workBook', workbook)
        const SheetNames = workbook.SheetNames[0]
        // console.log('SheetNames', SheetNames)
        const worksheet = workbook.Sheets[SheetNames]
        // console.log('worksheet', worksheet)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        console.log('jsonData', jsonData[0][0] === 'แสดงเวลา', jsonData[0][1] === 'เวลา')
        if (jsonData[0][0] === 'แสดงเวลา' && jsonData[0][1] === 'เวลา') {
          try {
            jsonData.forEach((item, key) => {
              if (key > 0 && item.length > 0) {
                const pattern = /^([01]\d|2[0-3]):[0-5]\d$/
                let s = {}
                s.id = key
                // this.convertDateToTime(item[0])
                s.text = typeof item[0] === 'object' ? moment(item[0]).format('HH:mm') : item[0].toString()
                // s.value = typeof item[1] === 'object' ? moment(item[1]).format('HH:mm') : item[1].toString()
                s.value = typeof item[1] === 'object' ? moment(item[1]).format('HH:mm') : pattern.test(item[1]) ? item[1].toString() : null
                s.limitBooking = '1'
                data.push(s) // ใช้ตัวแปร data ในการเก็บข้อมูลแทนการใช้ Data
              }
            })
          } catch (error) {
            console.log('error', error)
            this.$swal('ผิดพลาด', 'โปรดลองใหม่อีกครั้ง', 'error')
          }
          this.ExcelField = null
        } else {
          this.$swal('ผิดพลาด', 'ข้อมูลไม่ถูกต้อง', 'error')
          this.ExcelField = null
        }
        console.log('data', data) // ตรวจสอบข้อมูลที่ถูกเก็บในตัวแปร data
        if (data.length > 0) {
          this.dataItemAddTime = data // เข้าถึง this.dataItemAddTime ผ่าน Arrow Function
          this.$swal({
            title: 'successfully',
            text: 'สำเร็จ',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        }
      }
      reader.readAsArrayBuffer(file)
    },
    convertFractionToTime (fraction) {
      let hours = Math.floor(fraction * 24)
      let minutes = Math.floor(hours * 60)
      let time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      return time
    },
    editItemNew (item) {
      console.log('item', item)
      console.log('this.dataItemAddTime', this.dataItemAddTime)
      this.editedIndexNew = this.dataItemAddTime.indexOf(item)
      this.editedItemNew = Object.assign({}, item)
    },

    deleteItemNew (item) {
      const index = this.dataItemAddTime.indexOf(item)
      this.dataItemAddTime.splice(index, 1)
      this.dataItemAddTime.forEach((item, key) => {
        item.id = key + 1
      })
    },

    closeNew () {
      setTimeout(() => {
        this.editedItemNew = Object.assign({}, this.defaultItemNew)
        this.editedIndexNew = -1
      }, 300)
    },
    addNewNew () {
      const addObj = Object.assign({}, this.defaultItemNew)
      addObj.id = this.dataItemAddTime.length + 1
      this.dataItemAddTime.unshift(addObj)
      this.editItemNew(addObj)
    },
    saveNew () {
      if (this.editedIndexNew > -1) {
        Object.assign(
          this.dataItemAddTime[this.editedIndexNew],
          this.editedItemNew
        )
      }
      this.dataItemAddTime.sort(function (a, b) {
        return a.value.localeCompare(b.value)
      })
      this.dataItemAddTime.forEach((item, key) => {
        item.id = key + 1
      })
      this.closeNew()
    },
    editItemNewbyday (item) {
      console.log('item', item)
      console.log('this.dataItemAddTimebyday', this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday)[0].setTime)
      this.editedIndexNew = this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday)[0].setTime.indexOf(item)
      this.editedItemNew = Object.assign({}, item)
    },

    deleteItemNewbyday (item) {
      const index = this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday)[0].setTime.indexOf(item)
      this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday)[0].setTime.splice(index, 1)
      this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday)[0].setTime.forEach((mitem, mKey) => {
        mitem.id = mKey + 1
      })
    },

    closeNewbyday () {
      setTimeout(() => {
        this.editedItemNew = Object.assign({}, this.defaultItemNew)
        this.editedIndexNew = -1
      }, 300)
    },
    addNewNewbyday () {
      const addObj = Object.assign({}, this.defaultItemNew)
      addObj.id = this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday)[0].setTime.length + 1
      this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday)[0].setTime.unshift(addObj)
      this.editItemNewbyday(addObj)
    },
    saveNewbyday () {
      if (this.editedIndexNew > -1) {
        Object.assign(
          this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday)[0].setTime[this.editedIndexNew],
          this.editedItemNew
        )
      }
      this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday)[0].setTime.sort(function (a, b) {
        return a.value.localeCompare(b.value)
      })
      this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday)[0].setTime.forEach((mitem, mKey) => {
        mitem.id = mKey + 1
      })
      this.closeNewbyday()
    },
    presetTimebyday () {
      this.dataItemAddTimebyday.filter((item) => item.value === this.toggle_setTimebyday).map((item) => {
        item.setTime = [
          { id: 1, value: '08:00', text: '08:00', limitBooking: '1' },
          { id: 2, value: '08:30', text: '08:30', limitBooking: '1' },
          { id: 3, value: '09:00', text: '09:00', limitBooking: '1' },
          { id: 4, value: '09:30', text: '09:30', limitBooking: '1' },
          { id: 5, value: '10:00', text: '10:00', limitBooking: '1' },
          { id: 6, value: '10:30', text: '10:30', limitBooking: '1' },
          { id: 7, value: '11:00', text: '11:00', limitBooking: '1' },
          { id: 8, value: '11:30', text: '11:30', limitBooking: '1' },
          { id: 9, value: '12:00', text: '12:00', limitBooking: '1' },
          { id: 10, value: '12:30', text: '12:30', limitBooking: '1' },
          { id: 11, value: '13:00', text: '13:00', limitBooking: '1' },
          { id: 12, value: '13:30', text: '13:30', limitBooking: '1' },
          { id: 13, value: '14:00', text: '14:00', limitBooking: '1' },
          { id: 14, value: '14:30', text: '14:30', limitBooking: '1' },
          { id: 15, value: '15:00', text: '15:00', limitBooking: '1' },
          { id: 16, value: '15:30', text: '15:30', limitBooking: '1' },
          { id: 17, value: '16:00', text: '16:00', limitBooking: '1' },
          { id: 18, value: '16:30', text: '16:30', limitBooking: '1' },
          { id: 19, value: '17:00', text: '17:00', limitBooking: '1' }
        ]
      })
    },
    presetTime () {
      this.dataItemAddTime = [
        { id: 1, value: '08:00', text: '08:00', limitBooking: '1' },
        { id: 2, value: '08:30', text: '08:30', limitBooking: '1' },
        { id: 3, value: '09:00', text: '09:00', limitBooking: '1' },
        { id: 4, value: '09:30', text: '09:30', limitBooking: '1' },
        { id: 5, value: '10:00', text: '10:00', limitBooking: '1' },
        { id: 6, value: '10:30', text: '10:30', limitBooking: '1' },
        { id: 7, value: '11:00', text: '11:00', limitBooking: '1' },
        { id: 8, value: '11:30', text: '11:30', limitBooking: '1' },
        { id: 9, value: '12:00', text: '12:00', limitBooking: '1' },
        { id: 10, value: '12:30', text: '12:30', limitBooking: '1' },
        { id: 11, value: '13:00', text: '13:00', limitBooking: '1' },
        { id: 12, value: '13:30', text: '13:30', limitBooking: '1' },
        { id: 13, value: '14:00', text: '14:00', limitBooking: '1' },
        { id: 14, value: '14:30', text: '14:30', limitBooking: '1' },
        { id: 15, value: '15:00', text: '15:00', limitBooking: '1' },
        { id: 16, value: '15:30', text: '15:30', limitBooking: '1' },
        { id: 17, value: '16:00', text: '16:00', limitBooking: '1' },
        { id: 18, value: '16:30', text: '16:30', limitBooking: '1' },
        { id: 19, value: '17:00', text: '17:00', limitBooking: '1' }
      ]
    },
    async getDataBranch () {
      this.branch = []
      this.branchData = []
      await axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.masBranchName
              s.value = d.masBranchID
              this.branch.push(s)
              // console.log('dtdtdtdt', this.branch)
            }
          }
        })
      // console.log('branchData', this.branchData)
    },
    changedateDayoff () {
      let dd = []
      this.itemDateStop.forEach((v, k) => {
        // console.log('test', this.formUpdate.dateDayoffText.filter(item => item === v))
        if (
          this.formUpdateLimitbooking.dateDayoffText.filter(item => item === v)
            .length > 0
        ) {
          dd.push(k)
        }
      })
      this.formUpdateLimitbooking.dateDayoffValue = JSON.stringify(dd)
      // console.log(this.formUpdateLimitbooking.dateDayoffValue, 'typeof', typeof this.formUpdateLimitbooking.dateDayoffValue)
    },
    allowedDates (val) {
      // this.getMonth(this.pickerDate)
      if (
        this.formUpdateLimitbooking.dateDayoffValue !== null &&
        this.formUpdateLimitbooking.dateDayoffValue.length > 0
      ) {
        if (
          JSON.parse(this.formUpdateLimitbooking.dateDayoffValue).filter(el => {
            return el === new Date(val).getDay()
          }).length === 0
        ) {
          return val
        }
      } else {
        return val
      }
    },
    async getlimitbooking (item) {
      this.toggle_setTimebyday = 0
      this.dataItemAddTimebyday = [
        { text: 'อา.', value: 0, setTime: [] },
        { text: 'จ.', value: 1, setTime: [] },
        { text: 'อ.', value: 2, setTime: [] },
        { text: 'พ.', value: 3, setTime: [] },
        { text: 'พฤ.', value: 4, setTime: [] },
        { text: 'ศ.', value: 5, setTime: [] },
        { text: 'ส.', value: 6, setTime: [] }
      ]
      this.formUpdateLimitbooking.empId = item.empId
      // console.log('this.formUpdateLimitbooking.empId', this.formUpdateLimitbooking.empId)
      let dt = []
      await axios
        .get(this.DNS_IP + '/empSelect/get?empId=' + item.empId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            dt = rs
            console.log('rs', rs)
            this.formUpdateLimitbooking.limitBookingCheck = rs[0].limitBookingCheck === 'False' ? 'True' : 'True' || 'True'
            if (rs[0].dateDayoffText === null || rs[0].dateDayoffText === '') {
              this.formUpdateLimitbooking.dateDayoffText = []
            } else {
              this.formUpdateLimitbooking.dateDayoffText = JSON.parse(
                rs[0].dateDayoffText
              )
            }
            if (rs[0].dateDayCustom === null || rs[0].dateDayCustom === '') {
              this.formUpdateLimitbooking.dateDayCustom = []
            } else {
              this.formUpdateLimitbooking.dateDayCustom = JSON.parse(
                rs[0].dateDayCustom
              )
            }
            this.formUpdateLimitbooking.USER_ROLE = rs[0].USER_ROLE
            this.formUpdateLimitbooking.typeDayCustom = rs[0].typeDayCustom
            this.formUpdateLimitbooking.dateDayoffValue = rs[0].dateDayoffValue
            this.formUpdateLimitbooking.setTimebyday = rs[0].setTimebyday
            console.log('this.formUpdateLimitbooking.setTime', rs[0].setTime)
            if (rs[0].setTimebyday === 'True') {
              if (rs[0].setTime === null || rs[0].setTime === '' || rs[0].setTime === '[]') {

              } else {
                let allTime = JSON.parse(rs[0].setTime)
                allTime.forEach((a, i) => {
                  a.setTime.forEach((a2, i2) => {
                    a2.id = i2 + 1
                    // console.log('a2' + i, a2.id)
                  })
                })
                console.log('allTime', allTime)
                console.log('dataItemAddTimebyday', this.dataItemAddTimebyday)
                this.dataItemAddTimebyday.forEach((item) => {
                  item.setTime = allTime.filter((ii) => ii.value === item.value)[0].setTime
                })
              }
            } else {
              if (rs[0].setTime === null || rs[0].setTime === '' || rs[0].setTime === '[]') {
                this.dataItemAddTime = []
                console.log('dataItemAddTime')
              } else {
                let setTime = JSON.parse(rs[0].setTime)
                setTime.map((v, k) => { v.id = k + 1 })
                if (setTime[0].limitBooking === undefined) {
                  console.log('dasdas')
                  for (let i = 0; i < setTime.length; i++) {
                    let d = setTime[i]
                    d.limitBooking = ''
                    this.dataItemAddTime.push(d)
                  }
                } else {
                  this.dataItemAddTime = setTime
                  console.log('test')
                }
              }
            }
            console.log('testgetgetlimitbooking', this.formUpdateLimitbooking)
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
      console.log('dt', dt)
      await this.chekshowTime('open', dt[0])
    },
    EditlimitBooking () {
      if (this.formUpdateLimitbooking.setTimebyday === 'True') {
        let checkTimevalue = true
        let checklimitBooking = true
        this.dataItemAddTimebyday.forEach((item) => {
          if (item.setTime.filter((el) => el.value === '').length === 0) {
          } else {
            checkTimevalue = false
          }
          if (item.setTime.filter((el) => el.limitBooking === '').length === 0) {
          } else {
            checklimitBooking = false
          }
        })
        if (checkTimevalue) {
          if (this.formUpdateLimitbooking.limitBookingCheck === 'True') {
            if (checklimitBooking) {
              this.EditlimitBookingSubmit()
            } else {
              this.$swal(
                'ผิดพลาด',
                'กรุณาเลือก ใส่จำนวน Limit Booking ให้ครบ เนื่องจาก เปิดใช้งาน Limit การจอง',
                'error'
              )
            }
          } else {
            this.EditlimitBookingSubmit()
          }
        } else {
          this.$swal('ผิดพลาด', 'กรุณาเลือก กรอกเวลาให้ครบ', 'error')
        }
      } else {
        if (this.dataItemAddTime.filter(el => { return el.value === '' }).length === 0) {
          if (this.formUpdateLimitbooking.limitBookingCheck === 'True') {
            if (this.dataItemAddTime.filter(el => { return el.limitBooking === '' }).length === 0) {
              this.EditlimitBookingSubmit()
            } else {
              this.$swal(
                'ผิดพลาด',
                'กรุณาเลือก ใส่จำนวน Limit Booking ให้ครบ เนื่องจาก เปิดใช้งาน Limit การจอง',
                'error'
              )
            }
          } else {
            this.EditlimitBookingSubmit()
          }
        } else {
          this.$swal('ผิดพลาด', 'กรุณาเลือก กรอกเวลาให้ครบ', 'error')
        }
      }
    },
    async EditlimitBookingSubmit () {
      console.log('Editdata', this.formUpdateLimitbooking)
      console.log('dataitem', this.dataItemAddTime)
      let dd = []
      this.itemDateStop.forEach((v, k) => {
        // console.log('test', this.formUpdate.dateDayoffText.filter(item => item === v))
        if (
          this.formUpdateLimitbooking.dateDayoffText.filter(item => item === v)
            .length > 0
        ) {
          dd.push(k)
        }
      })
      let setTime = []
      if (this.formUpdateLimitbooking.setTimebyday === 'True') {
        setTime = this.dataItemAddTimebyday
      } else {
        setTime = this.dataItemAddTime
      }
      let Dataitem = {
        limitBookingCheck: this.formUpdateLimitbooking.limitBookingCheck,
        setTime: JSON.stringify(setTime),
        dateDayoffText: JSON.stringify(
          this.formUpdateLimitbooking.dateDayoffText
        ),
        dateDayoffValue: JSON.stringify(dd),
        dateDayCustom: JSON.stringify(
          this.formUpdateLimitbooking.dateDayCustom
        ),
        typeDayCustom: this.formUpdateLimitbooking.typeDayCustom,
        setTimebyday: this.formUpdateLimitbooking.setTimebyday
      }
      console.log('Dataitem', Dataitem)
      this.$swal({
        title: 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async result => {
        await axios
          .post(
            this.DNS_IP +
              '/empSelect/edit/' +
              this.formUpdateLimitbooking.empId,
            Dataitem
          )
          .then(async response => {
            this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
            this.dialoglimitbooking = false
            await this.clearLimit()
          })
          .catch(error => {
            console.log('error function addData : ', error)
          })
      })
    },
    async getBookingField () {
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.BookingFieldshowtime = rs[0].showTime
            console.log('this.BookingFieldshowtime', this.BookingFieldshowtime)
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    chekshowTime (open, item) {
      if (open) {
        if (this.BookingFieldshowtime === 'แสดง') {
        } else {
          console.log(
            'this.formUpdate.limitBookingCheck',
            this.formUpdateLimitbooking.limitBookingCheck
          )
          if (item.limitBookingCheck === 'True') {
            this.$swal(
              'ปิด LimitBooking ',
              'กรุณาเปิดการแสดงเวลานัดหมายเพื่อเปิด LimitBooking',
              'error'
            ).then(() => {
              this.formUpdateLimitbooking.limitBookingCheck = 'False'
            })
          } else {
            console.log('else')
            this.formUpdateLimitbooking.limitBookingCheck = 'False'
          }
        }
      } else {
        if (this.BookingFieldshowtime === 'แสดง') {
        } else {
          this.$swal(
            'ร้านของคุณไม่สามารถเปิด LimitBooking ได้',
            'กรุณาเปิดการแสดงเวลานัดหมาย',
            'error'
          ).then(() => {
            this.formUpdateLimitbooking.limitBookingCheck = 'False'
          })
        }
      }
    },
    async clearLimit () {
      this.dataItemAddTimebyday = [
        { text: 'อา.', value: 0, setTime: [] },
        { text: 'จ.', value: 1, setTime: [] },
        { text: 'อ.', value: 2, setTime: [] },
        { text: 'พ.', value: 3, setTime: [] },
        { text: 'พฤ.', value: 4, setTime: [] },
        { text: 'ศ.', value: 5, setTime: [] },
        { text: 'ส.', value: 6, setTime: [] }
      ]
      this.toggle_setTimebyday = 0
      this.dataItemAddTime = []
      this.timeText = ''
      this.formUpdateLimitbooking.setTime = ''
      this.formUpdateLimitbooking.limitBookingCheck = ''
      this.formUpdateLimitbooking.limitBooking = ''
      this.formUpdateLimitbooking.flowId = []
      this.typeTimeAdd = 'add'
      this.indexTimeAdd = 0
    },
    selectImgAdd () {
      if (this.filesAdd) {
        this.formAdd.pictureUrlPreview = URL.createObjectURL(this.filesAdd)
      } else {
        this.formAdd.pictureUrlPreview = ''
      }
      // console.log(event)
    },
    selectImgUpdate () {
      if (this.filesUpdate) {
        this.formUpdate.pictureUrlPreview = URL.createObjectURL(
          this.filesUpdate
        )
      } else {
        this.formUpdate.pictureUrlPreview = ''
      }
      // console.log(event)
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
      // สำหรับ เรียกข้อมูล ใส่ form Update / Delete
      //
      //
      // Get ID /main.js
      this.dataReady = false
      this.PK = item.empId
      // this.getDataByIdGlobal(this.DNS_IP, this.path, 'empId', item.empId)
      Object.assign(this.formUpdate, item)
      if (item.empImge !== null) {
        this.formUpdate.pictureUrlPreview = item.empImge
      }
      if (item.setTime === null || []) {
        this.dataItemAddTime = []
      } else {
        this.dataItemAddTime = JSON.parse(item.setTime)
      }
      let flowId = item.flowId || ''
      if (flowId !== '') {
        this.formUpdate.flowId = JSON.parse(item.flowId)
      } else {
        this.formUpdate.flowId = ''
      }
      // delete this.formUpdate[FIELD_PK_NAME]
      delete this.formUpdate['LAST_DATE']
      delete this.formUpdate['CREATE_DATE']
      delete this.formUpdate['RECORD_STATUS']
      console.log('this.formUpdate', this.formUpdate)
      await this.selectBranchEdit()
    },
    async addData () {
      //
      //
      // สำหรับ เพิ่มข้อมูล
      // ต้องระบุ Create / Last User ว่าใครเป็นคนสร้าง
      //
      this.formAdd.CREATE_USER = this.$session.getAll().data.userName
      this.formAdd.LAST_USER = this.$session.getAll().data.userName
      this.formAdd.shopId = this.$session.getAll().data.shopId
      this.formAdd.masBranchID = this.formAdd.masBranchID || null
      console.log('ว่าง', this.formAdd.masBranchID)

      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      //
      // กำหนด Code ของรายการ * อย่าลืมเปลี่ยน field
      //
      this.formAdd.empCode = this.code + this.generateCodeGlobal()
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
      this.formAdd.setTime = JSON.stringify(this.formAdd.setTime)
      // this.formAdd.flowId = JSON.stringify(this.formAdd.flowId)

      console.log('form', JSON.stringify(this.formAdd))

      this.validate('ADD')
      setTimeout(() => this.submitAdd(this.DNS_IP, this.path, this.formAdd), 500)
    },
    async submitAdd (DNS_IP, PATH, ID, DT) {
      if (this.valid_add === true) {
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
          .then(async result => {
            if (this.filesAdd) {
              const _this = this
              let params = new FormData()
              params.append('file', this.filesAdd)
              await axios
                .post(this.DNS_IP + `/file/upload/employee`, params)
                .then(function (response) {
                  _this.formAdd.empImge = response.data
                  console.log('url Pic', response.data)
                })
            } else {
              this.formAdd.empImge = ''
            }
            if (this.formAdd.privacyPage === 'bookingform' || this.formAdd.privacyPage === 'bookingStoreFront') {
              this.formAdd.flowId = JSON.stringify(this.formAdd.flowId)
            } else {
              delete this.formAdd['flowId']
            }
            if (this.formAdd.additionalInformation) {
              this.formAdd.additionalInformation = (this.formAdd.additionalInformation || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            if (this.formAdd.empFirst_NameTH) {
              this.formAdd.empFirst_NameTH = (this.formAdd.empFirst_NameTH || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            if (this.formAdd.empLast_NameTH) {
              this.formAdd.empLast_NameTH = (this.formAdd.empLast_NameTH || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            delete this.formAdd['pictureUrlPreview']
            await axios
              .post(
              // eslint-disable-next-line quotes
                DNS_IP + PATH + 'add',
                this.formAdd,
                {
                  headers: {
                    'Application-Key': this.$session.getAll().ApplicationKey
                  }
                }
              )
              .then(async response => {
              // Debug response
                console.log('addDataGlobal DNS_IP + PATH + "add"', response)

                this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                // Close Dialog
                this.dialogAdd = false

                // Load Data
                await this.clearData()
                await this.getDataGlobal(
                  this.DNS_IP,
                  this.path,
                  this.$session.getAll().data.shopId
                )
                if (this.dataItem.length > 0) {
                  this.dessertsSort = []
                  for (let i = 0; i < this.dataItem.length; i++) {
                    let d = this.dataItem[i]
                    let s = {}
                    s.empId = d.empId
                    s.empFull_NameTH = d.empFull_NameTH
                    this.dessertsSort.push(s)
                  }
                }
              })
            // eslint-disable-next-line handle-callback-err
              .catch(error => {
                console.log('error function addDataGlobal : ', error)
                this.dataReady = true
              })
          })
          .catch(error => {
            console.log('error function addData : ', error)
            this.dataReady = true
          })
      }
    },
    async editData () {
      // Config User ทำรายการล่าสุด
      this.formUpdateItem.LAST_USER = this.$session.getAll().data.userName
      // End Config User ทำรายการล่าสุด
      this.formUpdate.masBranchID = this.formUpdate.masBranchID || null
      console.log('ว่าง', this.formUpdate.masBranchID)
      for (var key in this.formUpdateItem) {
        for (var key2 in this.formUpdate) {
          if (key === key2) {
            this.formUpdateItem[key] = this.formUpdate[key2]
          }
        }
      }
      this.validate('UPDATE')
      setTimeout(() => this.submitEdit(this.DNS_IP, this.path), 500)
    },
    async submitEdit (DNS_IP, PATH) {
      if (this.valid_update === true) {
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
          .then(async result => {
            if (this.filesUpdate) {
              const _this = this
              let params = new FormData()
              params.append('file', this.filesUpdate)
              await axios
                .post(this.DNS_IP + `/file/upload/employee`, params)
                .then(function (response) {
                  _this.formUpdateItem.empImge = response.data
                  console.log('url Pic', response.data)
                })
            } else {
              this.formUpdateItem.empImge = this.formUpdate.pictureUrlPreview
            }
            if (this.formUpdate.privacyPage === 'bookingform' || this.formUpdate.privacyPage === 'bookingStoreFront') {
              this.formUpdateItem.flowId = JSON.stringify(this.formUpdate.flowId)
            } else {
              delete this.formUpdateItem['flowId']
            }
            if (this.formUpdateItem.additionalInformation) {
              this.formUpdateItem.additionalInformation = (this.formUpdateItem.additionalInformation || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            if (this.formUpdateItem.empFirst_NameTH) {
              this.formUpdateItem.empFirst_NameTH = (this.formUpdateItem.empFirst_NameTH || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            if (this.formUpdateItem.empLast_NameTH) {
              this.formUpdateItem.empLast_NameTH = (this.formUpdateItem.empLast_NameTH || '').replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            await axios
              .post(
              // eslint-disable-next-line quotes
                DNS_IP + PATH + 'edit/' + this.PK,
                this.formUpdateItem
              )
              .then(async response => {
              // Debug response
                console.log('editDataGlobal DNS_IP + PATH + "edit"', response)

                this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
                // Close Dialog
                this.dialogEdit = false
                this.filesUpdate = null
                // Load Data
                await this.getDataGlobal(
                  DNS_IP,
                  PATH,
                  this.$session.getAll().data.shopId
                )
                if (this.dataItem.length > 0) {
                  this.dessertsSort = []
                  for (let i = 0; i < this.dataItem.length; i++) {
                    let d = this.dataItem[i]
                    let s = {}
                    s.empId = d.empId
                    s.empFull_NameTH = d.empFull_NameTH
                    this.dessertsSort.push(s)
                  }
                }
              })
            // eslint-disable-next-line handle-callback-err
              .catch(error => {
                this.dataReady = true
                console.log('error function editDataGlobal : ', error)
              })
          })
          .catch(error => {
            this.dataReady = true
            console.log('error function editDataGlobal : ', error)
          })
      }
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
      this.deleteDataGlobal(
        this.DNS_IP,
        this.path,
        this.PK,
        this.$session.getAll().data.shopId
      )
    },
    // * Option Import Excel
    // * ตั้งค่าจาก Data
    importData (event) {
      var input = event.target
      var reader = new FileReader()
      reader.onload = () => {
        var fileData = reader.result
        var wb = XLSX.read(fileData, { type: 'binary' })
        wb.SheetNames.forEach(sheetName => {
          var rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
          console.log(rowObj)
          this.dataItemImport = rowObj
        })
        if (this.dataItemImport.length === 0) {
          alert('โปรดใส่ไฟล์ให้ถูกต้อง')
        } else {
          this.dataItemImportChecKHide = false
        }
      }

      reader.readAsBinaryString(input.files[0])
    },
    importDataApprove (action) {
      console.log('Action', action)
      var titleMsg = ''
      if (action === 'add') {
        titleMsg = 'ท่านต้องการ นำเข้าข้อมูลจากไฟล์นี้ ใช่หรือไม่'
      } else if (action === 'delete') {
        titleMsg = 'ท่านต้องการ ลบข้อมูลจากไฟล์นี้ ใช่หรือไม่'
      } else {
        titleMsg = 'ท่านต้องการ ปรับปรุงข้อมูลจากไฟล์นี้ ใช่หรือไม่'
      }

      this.$swal({
        title: titleMsg,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          console.log('this.dataItemImport', this.dataItemImport)
          let dataItem = []
          for (var i = 0; i < this.dataItemImport.length; i++) {
            var d = this.dataItemImport[i]
            if (d.empCode !== '') {
              d.shopId = this.$session.getAll().data.shopId
              d.userName = this.$session.getAll().data.userName
              dataItem.push(d)
            }
          }
          if (dataItem.length > 0) {
            await axios
              .post(
                // eslint-disable-next-line quotes
                this.DNS_IP + this.path + 'addImport',
                dataItem
              )
              .then(async response => {
                this.dialogImport = false
                // Debug response
                this.$swal('เรียบร้อย', 'นำเข้าข้อมูล เรียบร้อย', 'success')
                await this.getDataGlobal(
                  this.DNS_IP,
                  this.path,
                  this.$session.getAll().data.shopId
                )
                if (this.dataItem.length > 0) {
                  this.dessertsSort = []
                  for (let i = 0; i < this.dataItem.length; i++) {
                    let d = this.dataItem[i]
                    let s = {}
                    s.empId = d.empId
                    s.empFull_NameTH = d.empFull_NameTH
                    this.dessertsSort.push(s)
                  }
                }
              })
              // eslint-disable-next-line handle-callback-err
              .catch(error => {
                alert('โปรดใส่ไฟล์ให้ถูกต้อง')
                console.log('error function importDataAdd addData : ', error)
                this.dataReady = true
              })
          } else {
            this.$swal('ผิดพลาด', 'กรุณาเซ็คข้อมูลให้ครบ', 'error')
          }
        })
        .catch(error => {
          console.log('error function importDataApprove : ', error)
          this.dataReady = true
        })
    },
    async importDataAdd (dt) {
      Object.assign(this.formAdd, dt)
      this.formAdd.CREATE_USER = this.$session.getAll().data.userName
      this.formAdd.LAST_USER = this.$session.getAll().data.userName

      delete this.formAdd['empId']
      delete this.formAdd['LAST_DATE']
      delete this.formAdd['CREATE_DATE']
      delete this.formAdd['RECORD_STATUS']
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + this.path + 'add',
          this.formAdd
        )
        .then(async response => {
          this.dialogImport = false
          // Debug response

          console.log('/empSelect/add/', response)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          alert('โปรดใส่ไฟล์ให้ถูกต้อง', dt)
          console.log('error function importDataAdd addData : ', error)
          this.dataReady = true
        })
    },
    async importDataUpdate (dt) {
      Object.assign(this.formUpdate, dt)
      delete this.formUpdate['empId']
      delete this.formUpdate['LAST_DATE']
      delete this.formUpdate['CREATE_DATE']
      delete this.formUpdate['RECORD_STATUS']
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName

      for (var key in this.formUpdateItem) {
        for (var key2 in this.formUpdate) {
          if (key === key2) {
            this.formUpdateItem[key] = this.formUpdate[key2]
          }
        }
      }

      // Debug
      console.log('EDIT PK : ', this.PK)
      console.log('formUpdateItem', JSON.stringify(this.formUpdateItem))

      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/empSelect/' + 'edit/' + dt.empId,
          this.formUpdateItem
        )
        .then(async response => {
          this.dialogImport = false
          // Debug response
          console.log('/empSelect/edit/', response)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          alert('โปรดใส่ไฟล์ให้ถูกต้อง', dt)
          console.log('error function importDataUpdate : ', error)
        })
    },
    async importDataDelete (dt) {
      this.formUpdate.LAST_USER = this.$session.getAll().data.userName
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/empSelect/' + 'delete/' + dt.empId,
          this.formUpdate,
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async response => {
          this.dialogImport = false
          // Debug response
          console.log('/empSelect/delete/', response)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          alert('โปรดใส่ไฟล์ให้ถูกต้อง', dt)
          console.log('error function importDataDelete : ', error)
        })
    },
    exportData () {
      this.dataItem = []
      axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/empSelect/' + 'get?shopId=' + this.shopId
        )
        .then(async response => {
          this.dataItem = response.data
          var tem = []
          response.data.forEach(element => {
            var s = {}
            console.log(element)
            s.empCode = element.empCode
            s.empTitle_NameTH = element.empTitle_NameTH
            s.empFirst_NameTH = element.empFirst_NameTH
            s.empLast_NameTH = element.empLast_NameTH
            s.privacyPage = element.privacyPage
            tem.push(s)
            // tem.push({'empCode': element.empCode,
            //   'คำนำหน้า': element.empTitle_NameTH,
            //   'ชื่อ': element.empFirst_NameTH,
            //   'นามสกุล': element.empLast_NameTH,
            //   'แสดงชื่อที่หน้าไหน': element.privacyPage
            // })
          })
          console.log('sdfsdfsdf', tem)
          var info = XLSX.utils.json_to_sheet(tem)
          var wb = XLSX.utils.book_new() // make Workbook of Excel
          XLSX.utils.book_append_sheet(wb, info, 'worksheet') // sheetAName is name of Worksheet
          XLSX.writeFile(wb, 'Employee.xls') // name of the file is 'book.xlsx'
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log(error)
        })
    },
    async selectBranchAdd () {
      console.log('this.formAdd.masBranchID', typeof this.formAdd.masBranchID)
      let masBranchID = this.formAdd.masBranchID
      await this.getDataFlow(masBranchID)
      if (this.formAdd.flowId !== '' && this.formAdd.flowId !== null) {
        let itemFLow = []
        this.flow.forEach((add) => {
          this.formAdd.flowId.forEach((select) => {
            // console.log(add.value, select)
            if (add.value === select) {
              itemFLow.push(select)
            }
          })
        })
        this.formAdd.flowId = itemFLow
      }
    },
    async selectBranchEdit () {
      if (this.formUpdate.masBranchID !== '' && this.formUpdate.masBranchID !== null) {
        console.log('this.formUp', typeof this.formUpdate.masBranchID)
        let masBranchID = this.formUpdate.masBranchID
        await this.getDataFlow(masBranchID)
        if (this.formUpdate.flowId !== '' && this.formUpdate.flowId !== null) {
          let itemFLow = []
          this.flow.forEach((add) => {
            this.formUpdate.flowId.forEach((select) => {
            // console.log(add.value, select)
              if (add.value === select) {
                itemFLow.push(select)
              }
            })
            console.log('itemFLow', itemFLow)
          })
          this.formUpdate.flowId = itemFLow
        }
      }
    },
    async getDataFlow (masBranchID) {
      // console.log('TEST', masBranchID.toString())
      this.flow = []
      await axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let checkBranchByFlow = d.masBranchID || 'All'
            if ((checkBranchByFlow === masBranchID.toString()) || checkBranchByFlow === 'All') {
              console.log('eeeeeee', d.flowName)
              let s = {}
              s.text = d.flowName
              s.value = d.flowId
              this.flow.push(s)
            }
          }
          console.log('result', this.flow)
        })
    },
    remove (item) {
      const index = this.formUpdate.flowId.indexOf(item.text)
      if (index >= 0) this.formUpdate.flowId.splice(index, 1)
    },
    async clearData () {
      this.formAdd.empCode = ''
      this.formAdd.empTitle_NameTH = ''
      this.formAdd.empFirst_NameTH = ''
      this.formAdd.empLast_NameTH = ''
      this.formAdd.privacyPage = ''
      this.formAdd.empImge = ''
      this.formAdd.pictureUrlPreview = ''
      this.formAdd.shopId = this.$session.getAll().data.shopId
      this.formAdd.masBranchID = ''
      this.formAdd.flowId = []
      this.flowIdAdd = ''
      this.formUpdate.empCode = ''
      this.formUpdate.empTitle_NameTH = ''
      this.formUpdate.empFirst_NameTH = ''
      this.formUpdate.empLast_NameTH = ''
      this.formUpdate.empImge = ''
      this.formUpdate.pictureUrlPreview = ''
      this.formUpdate.privacyPage = ''
      this.filesAdd = null
      this.filesUpdate = null
    },
    async getShop () {
      await axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId)
        .then(async (response) => {
          let rs = response.data
          console.log('rs_getCategory', rs)
          if (rs.length > 0) {
            this.statusGoogleCalendar = rs[0].statusGoogleCalendar
            this.statusGoogleCalendarEmp = rs[0].statusGoogleCalendarEmp
          }
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    }
  }
}
</script>
<style scope></style>
