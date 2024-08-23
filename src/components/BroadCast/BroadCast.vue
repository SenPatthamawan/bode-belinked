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
            <v-btn
              color="#1B437C"
              depressed
              dark
              @click="dialogSelect = true"
            >
              <v-icon left>mdi-text-box-plus</v-icon>
              เลือก กลุ่มเป้าหมาย
            </v-btn>
          </v-col>
        </v-row>
        <v-dialog v-model="dialogSelect" persistent max-width="60%">
          <v-card>
            <v-card-title class="text-h6">
              เลือก กลุ่มเป้าหมาย
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-row >
                    <v-subheader id="subtext"
                      >กลุ่มเป้าหมาย</v-subheader
                    >
                  </v-row>
                  <v-row>
                    <v-select
                      :items="selectItemAudience"
                      v-model="selectDataAudience"
                      dense
                      @change="getDataById()"
                    ></v-select>
                  </v-row>
                </v-col>
                <v-col cols="12" v-if="showTabel">
                  <v-card elevation="7">
                     <v-container>
                    <v-row justify="center">
                      <v-col cols="4" class="text-center pt-0">
                        <v-card elevation="2" class="mx-auto">
                          <v-container>
                            <v-card-title>เป้าหมายโดยประมาณ</v-card-title>
                            <v-card-text>
                              <v-progress-circular
                                :rotate="360"
                                :size="100"
                                :width="15"
                                :value="valueAdd"
                                color="teal"
                              >
                                {{ valueAdd }} %
                              </v-progress-circular>
                            </v-card-text>
                            <v-card-text>ประมาณ {{ dataAdd }} คน</v-card-text>
                          </v-container>
                        </v-card>
                        <!-- <div class="text-center">
                          <v-btn
                            color="blue-grey"
                            class="ma-2 white--text"
                            @click="getDataUpdate()"
                          >
                            Update
                            <v-icon right dark>
                              mdi-cloud-upload
                            </v-icon>
                          </v-btn>
                        </div> -->
                      </v-col>
                      <v-col cols="8" class="text-center pt-0">
                        <v-col cols="12" class="pb-0">
                          <v-row>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                  >ชื่อกลุ่มเป้าหมาย</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-text-field
                                  v-model="formUpdate.audiencesName"
                                  :counter="50"
                                  maxlength="50"
                                  solo
                                  dense
                                  readonly
                                ></v-text-field>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-row>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                >เลือกกลุ่มเป้าหมาย</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-text-field
                                  v-model="formUpdate.audiencesSelect"
                                  solo
                                  dense
                                  readonly
                                ></v-text-field>
                              </v-row>
                            </v-col>
                            <!-- <v-col cols="2" class="pb-0"></v-col> -->
                          </v-row>
                        </v-col>
                        <v-col cols="12" class="pb-0" v-if="audiencesSelect === 'Preset'">
                          <v-row>
                            <v-col cols="12" class="pb-0">
                               <v-row>
                                <v-subheader id="subtext"
                                >Preset ที่เลือก</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="12" class="pa-0">
                                  <v-text-field
                                      v-model="formUpdate.namePreset"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" class="pb-0">
                               <v-row>
                                <v-subheader id="subtext"
                                >บริการที่เลือก</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="12" class="pa-0">
                                  <v-text-field
                                      v-model="formUpdate.flowId"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                >วันที่ที่ระบบคำนาณตาม Preset</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="6" class="pa-0">
                                  <v-text-field
                                    v-model="formUpdate.startDate"
                                    solo
                                    dense
                                    readonly
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="6" class="pa-0">
                                  <v-text-field
                                    v-model="formUpdate.endDate"
                                    solo
                                    dense
                                    readonly
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" class="pb-0" v-if="audiencesSelect === 'typeJob'">
                          <v-row>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-col cols="12" class="pb-0">
                                  <v-row>
                                    <v-subheader id="subtext"
                                    >เลือกสาขา</v-subheader
                                    >
                                  </v-row>
                                  <v-row>
                                    <v-text-field
                                      v-model="formUpdate.masBranchID"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                  </v-row>
                                </v-col>
                                <!-- <v-col cols="2" class="pb-0"></v-col> -->
                              </v-row>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                               <v-row>
                                <v-subheader id="subtext"
                                >เลือกบริการต้องการ</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="12" class="pa-0">
                                  <v-text-field
                                      v-model="formUpdate.flowId"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                >เลือกวันที่ที่ต้องการ</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="2" class="pa-0 mt-n5">
                                  <v-checkbox
                                    label="วันที่รับงาน"
                                    false-value="False"
                                    true-value="True"
                                    readonly
                                    v-model="formUpdate.dateJobOpen"
                                  ></v-checkbox>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-text-field
                                      v-model="formUpdate.startDate"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-text-field
                                      v-model="formUpdate.endDate"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                >เลือกวันที่ที่ต้องการ</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="2" class="pa-0 mt-n5">
                                  <v-checkbox
                                    label="วันที่ปิดงาน"
                                    false-value="False"
                                    readonly
                                    true-value="True"
                                    v-model="formUpdate.dateJobClose"
                                  ></v-checkbox>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-text-field
                                      v-model="formUpdate.startDateClose"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-text-field
                                    v-model="formUpdate.endDateClose"
                                    solo
                                    dense
                                    readonly
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" class="pb-0" v-if="audiencesSelect === 'bookingDate'">
                          <v-row>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-col cols="12" class="pb-0">
                                  <v-row>
                                    <v-subheader id="subtext"
                                    >เลือกสาขา</v-subheader
                                    >
                                  </v-row>
                                  <v-row>
                                    <v-text-field
                                      v-model="formUpdate.masBranchID"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                  </v-row>
                                </v-col>
                                <!-- <v-col cols="2" class="pb-0"></v-col> -->
                              </v-row>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                               <v-row>
                                <v-subheader id="subtext"
                                >เลือกบริการต้องการ</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="12" class="pa-0">
                                  <v-text-field
                                      v-model="formUpdate.flowId"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                >เลือกวันที่ที่ต้องการ</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="6" class="pa-0">
                                  <v-text-field
                                    v-model="formUpdate.startDate"
                                    solo
                                    dense
                                    readonly
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="6" class="pa-0">
                                  <v-text-field
                                    v-model="formUpdate.endDate"
                                    solo
                                    dense
                                    readonly
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                          <v-col cols="12" class="pb-0" v-if="audiencesSelect === 'rating'">
                          <v-row>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                >เลือกคะแนนที่ต้องการ</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="6" class="pt-0 pb-0">
                                  <VuetifyMoney
                                    v-model="formUpdate.startRating"
                                    dense
                                    required
                                    readonly
                                    outlined
                                    v-bind:options="options2"
                                  />
                                </v-col>
                                <v-col cols="6" class="pt-0 pb-0">
                                  <VuetifyMoney
                                    v-model="formUpdate.endRating"
                                    dense
                                    required
                                    readonly
                                    outlined
                                    v-bind:options="options2"
                                  />
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                >เลือกวันที่ที่ต้องการ</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="6" class="pa-0">
                                  <v-text-field
                                    v-model="formUpdate.startDate"
                                    solo
                                    dense
                                    readonly
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="6" class="pa-0">
                                  <v-text-field
                                    v-model="formUpdate.endDate"
                                    solo
                                    dense
                                    readonly
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" class="pb-0" v-if="audiencesSelect === 'typeCustomField' && dataCustom.length > 0">
                          <v-row>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-col cols="6">
                                  <v-row>
                                    <v-subheader id="subtext"
                                    >เลือกช่องกรอกข้อมูล</v-subheader
                                    >
                                  </v-row>
                                  <v-row>
                                    <v-text-field
                                      v-model="formUpdate.fieldId"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                  </v-row>
                                </v-col>
                                <v-col cols="6">
                                  <v-row>
                                    <v-subheader id="subtext"
                                    >เลือกข้อมูลของช่องกรอกข้อมูล</v-subheader
                                    >
                                  </v-row>
                                  <v-row>
                                    <v-text-field
                                      v-model="formUpdate.optionFieldValue"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                  </v-row>
                                </v-col>
                                <!-- <v-col cols="2" class="pb-0"></v-col> -->
                              </v-row>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-col cols="6">
                                  <v-row>
                                    <v-subheader id="subtext"
                                    >เลือกแหล่งที่มาของข้อมูล</v-subheader
                                    >
                                  </v-row>
                                  <v-row>
                                    <v-text-field
                                      v-model="formUpdate.selectData"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                  </v-row>
                                </v-col>
                                <v-col cols="6" class="pb-0">
                                  <v-row>
                                    <v-subheader id="subtext"
                                    >เลือกสาขา</v-subheader
                                    >
                                  </v-row>
                                  <v-row>
                                    <v-text-field
                                      v-model="formUpdate.masBranchID"
                                      solo
                                      dense
                                      readonly
                                    ></v-text-field>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-col>
                    </v-row>
                     </v-container>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-alert type="error" v-if="showTabel === true && dataAdd === 0">เนื่องจากไม่มีลูกค้าในกลุ่มเป้าหมายนี้</v-alert>
              <v-spacer></v-spacer>
              <v-btn dark color='#1B437C' v-if="showTabel === true && dataAdd > 0" @click="dataSelect = true, dialogSelect = false, validate('UPDATE')">
                ตรวจสอบและเลือกกลุ่มเป้าหมายนี้
              </v-btn>
              <v-btn color='red' dark @click="dialogSelect = false, clearEdit()">
                ปิด
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-row v-if="dataSelect">
          <v-col cols="12">
            <v-container>
              <v-card class="mx-auto" elevation="2" outlined shaped>
                <v-container>
                  <v-card-title>
                    <span class="text-h6">บรอดแคสต์ กลุ่ม {{formUpdate.audiencesName}}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-form
                      ref="form_update"
                      v-model="validUpdate"
                      lazy-validation
                    >
                      <v-row>
                        <v-col cols="4" class="text-center">
                          <v-card elevation="2" class="mx-auto">
                            <v-container>
                              <v-card-title>เป้าหมายโดยประมาณ</v-card-title>
                              <v-card-text>
                                <v-progress-circular
                                  :rotate="360"
                                  :size="100"
                                  :width="15"
                                  :value="valueAdd"
                                  color="teal"
                                >
                                  {{ valueAdd }} %
                                </v-progress-circular>
                              </v-card-text>
                              <v-card-text>ประมาณ {{ dataAdd }} คน</v-card-text>
                            </v-container>
                          </v-card>
                          <br />
                          <v-card elevation="2" class="mx-auto">
                            <v-container>
                              <v-card-title>รายชื่อลูกค้า</v-card-title>
                              <v-card-text>
                                <v-list
                                  subheader
                                  dense
                                  style="max-height: 300px"
                                  class="overflow-y-auto"
                                >
                                  <v-list-item
                                    v-for="(item, index) in dataUserLine"
                                    :key="index"
                                  >
                                    <v-list-item-avatar>
                                      <v-img
                                        :alt="`${index} avatar`"
                                        :src="item.picture"
                                      ></v-img>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                      <v-list-item-title
                                        class="item__title"
                                        v-text="item.name"
                                      ></v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                  <v-divider inset></v-divider>
                                </v-list>
                              </v-card-text>
                            </v-container>
                          </v-card>
                        </v-col>
                        <v-col cols="8" class="text-center">
                          <v-row>
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
                                  :rules="[rules.resizeImag, rules.required]"
                                  accept="image/png, image/jpeg, image/bmp"
                                  prepend-icon="mdi-camera"
                                  label="Image"
                                  @change="selectImgUpdate"
                                  v-model="filesUpdate"
                                ></v-file-input>
                              </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                  >ชื่อประกาศ</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-text-field
                                  v-model="formUpdate.broadcastName"
                                  :counter="100"
                                  maxlength="100"
                                  dense
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-row>
                            </v-col>
                            <v-col cols="12">
                              <v-row style="height: 25px">
                                <v-subheader id="subtext"
                                  >ข้อความที่จะส่ง</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-textarea
                                  auto-grow
                                  rows="2"
                                  name="input-7-4"
                                  counter
                                  dense
                                  required
                                  :rules="[rules.required]"
                                  v-model="formUpdate.title"
                                ></v-textarea>
                              </v-row>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                  >Link Web</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-text-field
                                  v-model="formUpdate.linkWeb"
                                  dense
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      elevation="2"
                      x-large
                      color="success"
                      :disabled="!validUpdate"
                      @click="sendPush()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      ส่ง
                    </v-btn>
                  </v-card-actions>
                </v-container>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
        <v-col cols="12" v-if="!dataSelect">
            <v-card elevation="7">
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
                    {{ format_dateFUllTime(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.pictureUrl`]="{ item }">
                    <v-avatar color="primary" size="40">
                      <img :src="item.pictureUrl" alt="img"
                    /></v-avatar>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
          </v-row>
          <!-- end data table -->
      </div>
    </v-main>
  </div>
</template>
<style scoped>
.item__title {
  color: black !important;
  font-family: KittithadaBold !important;
  font-size: 20px !important;
}
.v-list-item__title{
  /* color: var(--nav-text) !important; */
  font-family: KittithadaBold;
  font-size: 22px !important;
}
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  background-color: white !important;
}
</style>
<script>
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import axios from 'axios' // api
import moment from 'moment-timezone'
export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
  },
  data () {
    return {
      e1: 1,
      valueAdd: 0,
      dataAdd: 0,
      searchAll2: '',
      dataReady: true,
      dataSelect: false,
      returnLink: '/BroadCast/BroadCast',
      session: this.$session.getAll(),
      dialogSelect: false,
      showTabel: false,
      validUpdate: true,
      selectItemAudience: [],
      itemAudience: [],
      selectDataAudience: '',
      selectAudience: '',
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 1,
        precision: 0
      },
      rules: {
        required: value => !!value || 'กรุณากรอก.',
        resizeImag: value =>
          !value ||
          value.size < 1000000 ||
          'รูปภาพต้องมีขนาดไม่เกิน 1 MB!'
        // resizeImag: value =>
        //   !value ||
        //   value.size < 2000000 ||
        //   'Avatar size should be less than 2 MB!'
      },
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'บรอดแคสต์',
          disabled: false,
          href: '/BroadCast/BroadCast'
        }
      ],
      optionAudiences: [
        { text: 'วันที่นัดหมาย', value: 'bookingDate' },
        { text: 'ประเภทบริการ', value: 'typeJob' },
        // { text: 'วันที่รับงาน', value: 'openJobDate' },
        // { text: 'วันที่ปิดงาน', value: 'closeJobDate' },
        { text: 'คะแนนความพึงพอใจ', value: 'rating' },
        { text: 'ประเภทการกรอก', value: 'typeCustomField' }
      ],
      columns: [
        { text: 'รูป', value: 'pictureUrl' },
        { text: 'ชื่อประกาศ', value: 'broadcastName' },
        { text: 'กลุ่มเป้าหมาย', value: 'audiencesName' },
        { text: 'จำนวนการส่ง', value: 'countSend', align: 'center' },
        { text: 'จำนวนการคลิก', value: 'click', align: 'center' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' }
      ],
      dataSelectData: [
        { text: 'จากข้อมูล นัดหมาย', value: 'booking' },
        { text: 'จากข้อมูล งาน', value: 'job' }
      ],
      dataItem: [],
      dataAudience: [],
      dataUserLine: [],
      optionFieldValue: [],
      branch: [],
      DataFlowName: [],
      dataCustom: [],
      dataOptionField: [],
      itemEdit: [],
      idData: '',
      referId: '',
      path: '',
      audiencesSelect: '',
      filesUpdate: null,
      formUpdate: {
        broadcastName: '',
        linkWeb: '',
        pictureUrl: '',
        pictureUrlPreview: '',
        title: '',
        id: '',
        audiencesName: '',
        selectData: 'booking', //
        flowId: '', //
        fieldId: '', //
        optionFieldValue: '', //
        startDate: '', //
        endDate: '', //
        startDateClose: '', //
        endDateClose: '', //
        audiencesSelect: 'bookingDate', //
        startRating: 0, //
        endRating: 0, //
        shopId: this.$session.getAll().data.shopId, //
        masBranchID: '', //
        dateJobOpen: 'False', //
        dateJobClose: 'False', //
        CREATE_USER: '',
        LAST_USER: '',
        CREATE_DATE: '',
        namePreset: ''
      }
    }
  },
  // beforeCreate () {
  //   if (!this.$session.exists()) {
  //     this.$router.push('/Core/Login')
  //   }
  // },
  async mounted () {
    // this.getGetToken(this.DNS_IP)
    this.dataReady = false
    // Get Data
    // this.getDataList()
    this.getDataList()
    this.getDataAudience()
    this.getDataBranch()
    this.getDataFlow()
    this.getDataCustomField()
  },
  methods: {
    selectImgUpdate (event) {
      if (this.filesUpdate) {
        this.formUpdate.pictureUrlPreview = URL.createObjectURL(
          this.filesUpdate
        )
      } else {
        this.formUpdate.pictureUrlPreview = ''
      }
      // console.log(event)
    },
    async getDataList () {
      this.dataItem = []
      // console.log('branch', this.branch)
      axios
        .get(
          this.DNS_IP + '/broadcast/get?shopId=' + this.session.data.shopId
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              // console.log('dataList', d)
              if (d.insightEvent !== null) {
                // console.log('JSON.parse(d.insightEvent)', d.insightEvent.includes('Not Found'))
                if (!d.insightEvent.includes('Not Found')) {
                  d.countSend = JSON.parse(d.insightEvent).overview.delivered
                  if (JSON.parse(d.insightEvent).clicks.length === 0) {
                    d.click = 0
                  } else {
                    d.click = JSON.parse(d.insightEvent).clicks[0].click
                  }
                } else {
                  d.click = 0
                }
              } else {
                d.click = 0
              }
              this.dataItem.push(d)
            }
            // this.dataItem = rs
          } else {
            this.dataItem = []
          }
        })
    },
    async getDataBranch () {
      this.branch = []
      // console.log('branch', this.branch)
      axios
        .get(
          this.DNS_IP + '/master_branch/get?shopId=' + this.session.data.shopId
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.branch.push({text: 'ทั้งหมด', value: 'allBr'})
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.masBranchName
              s.value = d.masBranchID
              this.branch.push(s)
              // console.log('dtdtdtdt', this.branch)
            }
          } else {
            this.branch.push({text: 'ทั้งหมด', value: 'allBr'})
            // this.branch = []
          }
        })
    },
    getDataFlow () {
      this.DataFlowName = []
      axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.session.data.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.DataFlowName.push({text: 'ทั้งหมด', value: 'allFlow'})
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.flowName
              d.value = d.flowId
              this.DataFlowName.push(d)
            }
          } else {
            this.DataFlowName.push({text: 'ทั้งหมด', value: 'allFlow'})
          }
        })
    },
    // getDataOptionField (fieldId, optionFieldValues) {
    //   this.dataOptionField = []
    //   axios
    //     .get(this.DNS_IP + '/customField/get?shopId=' + this.session.data.shopId + '&fieldId=' + fieldId)
    //     .then(response => {
    //       let rs = response.data
    //       console.log('dataOptionField', rs[0].optionField)
    //       if (rs.length > 0) {
    //         this.dataOptionField = JSON.parse(rs[0].optionField, optionFieldValues)
    //         this.formUpdate.optionFieldValue = this.dataOptionField.filter(el => el.value === optionFieldValues)
    //         console.log(this.dataOptionField.filter(el => el.value === optionFieldValues))
    //         // for (var i = 0; i < rs.length; i++) {
    //         //   var d = rs[i]
    //         //   d.text = d.fieldName
    //         //   d.value = d.fieldId
    //         //   this.dataOptionField.push(d)
    //         // }
    //       } else {
    //         this.dataOptionField = ''
    //       }
    //     })
    // },
    getDataCustomField () {
      this.dataCustom = []
      axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.session.data.shopId + "&fieldType='Selects','Radio'")
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            // this.dataCustom.push({text: 'ทั้งหมด', value: 'allField'})
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.fieldName
              d.value = d.fieldId
              this.dataCustom.push(d)
            }
            // this.formAdd.fieldId = this.dataCustom[0].value
            // this.getDataOptionField()
          } else {
            this.dataCustom = []
            // this.$swal('ผิดพลาด', 'คุณไม่มี ประเภทการกรอก ที่ไม่ตรงเงื่อน', 'error')
          }
        })
    },
    chkboxDisableUpdate (item) {
      if (item === 'open') {
        if (this.formUpdate.dateJobOpen === 'True') {
          this.disableOpen = false
        } else {
          this.disableOpen = true
        }
      } else if (item === 'close') {
        if (this.formUpdate.dateJobClose === 'True') {
          this.disableClose = false
        } else {
          this.disableClose = true
        }
      }
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
    async getDataAudience () {
      this.selectItemAudience = []
      this.itemAudience = []
      // console.log('branch', this.branch)
      axios
        .get(
          this.DNS_IP + '/audience/get?shopId=' + this.session.data.shopId
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.audiencesName
              s.value = d.id
              this.selectItemAudience.push(s)
              this.itemAudience.push(d)
              // console.log('dtdtdtdt', this.branch)
            }
          } else {
            this.selectItemAudience = []
            this.itemAudience = []
          }
        })
    },
    async getDataById () {
      this.showTabel = false
      var item = this.itemAudience.filter(el => el.id === this.selectDataAudience)[0]
      this.itemEdit = this.itemAudience.filter(el => el.id === this.selectDataAudience)[0]
      this.audiencesSelect = item.audiencesSelect
      console.log('item', item)
      this.formUpdate.id = item.id
      var flowIds = ''
      var masBranchIDs = ''
      var fieldIds = ''
      var optionFieldValues = ''
      if (item.flowId) {
        if (item.flowId === 'allFlow') {
          flowIds = 'allFlow'
        } else {
          flowIds = parseInt(item.flowId)
        }
      } else {
        flowIds = ''
      }
      if (item.masBranchID) {
        if (item.masBranchID === 'allBr') {
          masBranchIDs = 'allBr'
        } else {
          masBranchIDs = parseInt(item.masBranchID)
        }
      } else {
        masBranchIDs = ''
      }
      if (item.fieldId) {
        fieldIds = parseInt(item.fieldId)
      } else {
        fieldIds = ''
      }
      if (item.optionFieldValue) {
        optionFieldValues = item.optionFieldValue
      } else {
        optionFieldValues = ''
      }
      if (item.audiencesSelect === 'bookingDate') {
        this.formUpdate.audiencesName = item.audiencesName
        this.formUpdate.flowId = this.DataFlowName.filter(el => el.value === flowIds)[0].text
        this.formUpdate.startDate = this.momenDate_1(item.startDate)
        this.formUpdate.endDate = this.momenDate_1(item.endDate)
        this.formUpdate.audiencesSelect = this.optionAudiences.filter(el => el.value === item.audiencesSelect)[0].text
        this.formUpdate.shopId = this.$session.getAll().data.shopId //
        this.formUpdate.masBranchID = this.branch.filter(el => el.value === masBranchIDs)[0].text
        this.formUpdate.CREATE_USER = item.CREATE_USER
        this.formUpdate.LAST_USER = item.LAST_USER
      } else if (item.audiencesSelect === 'typeJob') {
        console.log(item.dateJobOpen, item.dateJobClose)
        if (item.dateJobOpen === 'True' && item.dateJobClose === 'True') {
          this.formUpdate.audiencesName = item.audiencesName
          this.formUpdate.flowId = this.DataFlowName.filter(el => el.value === flowIds)[0].text
          this.formUpdate.startDate = this.momenDate_1(item.startDate)
          this.formUpdate.endDate = this.momenDate_1(item.endDate)
          this.formUpdate.startDateClose = this.momenDate_1(item.startDateClose)
          this.formUpdate.endDateClose = this.momenDate_1(item.endDateClose)
          this.formUpdate.audiencesSelect = this.optionAudiences.filter(el => el.value === item.audiencesSelect)[0].text
          this.formUpdate.shopId = this.$session.getAll().data.shopId
          this.formUpdate.dateJobOpen = 'True' //
          this.formUpdate.dateJobClose = 'True' //
          this.formUpdate.masBranchID = this.branch.filter(el => el.value === masBranchIDs)[0].text
          this.formUpdate.CREATE_USER = item.CREATE_USER
          this.formUpdate.LAST_USER = item.LAST_USER
          this.chkboxDisableUpdate('open')
          this.chkboxDisableUpdate('close')
        } else if (item.dateJobOpen === 'True' && item.dateJobClose === 'False') {
          this.formUpdate.audiencesName = item.audiencesName
          this.formUpdate.flowId = this.DataFlowName.filter(el => el.value === flowIds)[0].text
          this.formUpdate.startDate = this.momenDate_1(item.startDate)
          this.formUpdate.endDate = this.momenDate_1(item.endDate)
          this.formUpdate.audiencesSelect = this.optionAudiences.filter(el => el.value === item.audiencesSelect)[0].text
          this.formUpdate.shopId = this.$session.getAll().data.shopId
          this.formUpdate.dateJobOpen = 'True' //
          this.formUpdate.dateJobClose = 'False' //
          this.formUpdate.masBranchID = this.branch.filter(el => el.value === masBranchIDs)[0].text
          this.formUpdate.CREATE_USER = item.CREATE_USER
          this.formUpdate.LAST_USER = item.LAST_USER
          this.chkboxDisableUpdate('open')
          this.chkboxDisableUpdate('close')
        } else if (item.dateJobOpen === 'False' && item.dateJobClose === 'True') {
          this.formUpdate.audiencesName = item.audiencesName
          this.formUpdate.flowId = this.DataFlowName.filter(el => el.value === flowIds)[0].text
          this.formUpdate.startDateClose = this.momenDate_1(item.startDateClose)
          this.formUpdate.endDateClose = this.momenDate_1(item.endDateClose)
          this.formUpdate.audiencesSelect = this.optionAudiences.filter(el => el.value === item.audiencesSelect)[0].text
          this.formUpdate.shopId = this.$session.getAll().data.shopId
          this.formUpdate.dateJobOpen = 'False' //
          this.formUpdate.dateJobClose = 'True' //
          this.formUpdate.masBranchID = this.branch.filter(el => el.value === masBranchIDs)[0].text
          this.formUpdate.CREATE_USER = item.CREATE_USER
          this.formUpdate.LAST_USER = item.LAST_USER
          this.chkboxDisableUpdate('open')
          this.chkboxDisableUpdate('close')
        } else if (item.dateJobOpen === 'False' && item.dateJobClose === 'False') {
          this.formUpdate.audiencesName = item.audiencesName
          this.formUpdate.flowId = this.DataFlowName.filter(el => el.value === flowIds)[0].text
          // this.formUpdate.endDateClose = item.endDateClose //
          this.formUpdate.audiencesSelect = this.optionAudiences.filter(el => el.value === item.audiencesSelect)[0].text
          this.formUpdate.shopId = this.$session.getAll().data.shopId
          this.formUpdate.dateJobOpen = 'False' //
          this.formUpdate.dateJobClose = 'False' //
          this.formUpdate.masBranchID = this.branch.filter(el => el.value === masBranchIDs)[0].text
          this.formUpdate.CREATE_USER = item.CREATE_USER
          this.formUpdate.LAST_USER = item.LAST_USER
          this.chkboxDisableUpdate('open')
          this.chkboxDisableUpdate('close')
        }
      } else if (item.audiencesSelect === 'rating') {
        this.formUpdate.audiencesName = item.audiencesName
        this.formUpdate.startDate = this.momenDate_1(item.startDate)
        this.formUpdate.endDate = this.momenDate_1(item.endDate)
        this.formUpdate.audiencesSelect = this.optionAudiences.filter(el => el.value === item.audiencesSelect)[0].text
        this.formUpdate.shopId = this.$session.getAll().data.shopId
        this.formUpdate.startRating = parseInt(item.startRating)
        this.formUpdate.endRating = parseInt(item.endRating)
        this.formUpdate.CREATE_USER = item.CREATE_USER
        this.formUpdate.LAST_USER = item.LAST_USER
      } else if (item.audiencesSelect === 'typeCustomField') {
        this.formUpdate.selectData = this.dataSelectData.filter(el => el.value === item.selectData)[0].text
        if (item.selectData === 'booking') {
          this.formUpdate.audiencesName = item.audiencesName
          this.formUpdate.audiencesSelect = this.optionAudiences.filter(el => el.value === item.audiencesSelect)[0].text
          this.formUpdate.shopId = this.$session.getAll().data.shopId
          this.formUpdate.fieldId = this.dataCustom.filter(el => el.value === fieldIds)[0].text
          this.formUpdate.optionFieldValue = optionFieldValues
          // await this.getDataOptionField(fieldIds, optionFieldValues)
          // this.formUpdate.selectData = item.selectData
          this.formUpdate.masBranchID = this.branch.filter(el => el.value === masBranchIDs)[0].text
          this.formUpdate.CREATE_USER = item.CREATE_USER
          this.formUpdate.LAST_USER = item.LAST_USER
        } else if (item.selectData === 'job') {
          this.formUpdate.audiencesName = item.audiencesName
          this.formUpdate.audiencesSelect = this.optionAudiences.filter(el => el.value === item.audiencesSelect)[0].text
          this.formUpdate.shopId = this.$session.getAll().data.shopId
          this.formUpdate.fieldId = this.dataCustom.filter(el => el.value === fieldIds)[0].text
          this.formUpdate.optionFieldValue = optionFieldValues
          // await this.getDataOptionField(fieldIds, optionFieldValues)
          // this.formUpdate.selectData = item.selectData
          this.formUpdate.masBranchID = this.branch.filter(el => el.value === masBranchIDs)[0].text
          this.formUpdate.CREATE_USER = item.CREATE_USER
          this.formUpdate.LAST_USER = item.LAST_USER
        }
      } else if (item.audiencesSelect === 'Preset') {
        console.log('Preset', item)
        var dateStart = this.momenDate_1(new Date())
        var dateEnd = this.momenDate_1(moment().add(parseInt(item.datePreset), 'days'))
        this.formUpdate.audiencesName = item.audiencesName
        this.formUpdate.startDate = dateStart
        this.formUpdate.endDate = dateEnd
        this.formUpdate.audiencesSelect = item.audiencesSelect
        this.formUpdate.namePreset = item.namePreset
        this.formUpdate.flowId = this.DataFlowName.filter(el => el.value === item.refId)[0].text
        this.formUpdate.shopId = this.$session.getAll().data.shopId
        this.formUpdate.CREATE_USER = item.CREATE_USER
        this.formUpdate.LAST_USER = item.LAST_USER
        console.log('formUpdate', this.formUpdate)
      }
      this.showTabel = true
      this.getDataUpdate(item)
      // this.dialogEdit = true
    },
    async getDataUpdate (item) {
      console.log('getDataUpdate', item)
      this.dataUserLine = []
      this.valueAdd = 0
      this.dataAdd = 0
      var num = 0
      var url = ''
      var branchId = ''
      var flowId = ''
      if (item.masBranchID === 'allBr') {
        branchId = ''
      } else {
        branchId = item.masBranchID
      }
      if (item.flowId === 'allFlow') {
        flowId = ''
      } else {
        flowId = item.flowId
      }
      if (item.audiencesSelect === 'bookingDate') {
        url = this.DNS_IP + '/booking_view/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRange=' + this.formUpdate.startDate + '/' + this.formUpdate.endDate
      } else if (item.audiencesSelect === 'typeJob') {
        console.log(item.dateJobOpen, item.dateJobClose)
        if (item.dateJobOpen === 'True' && item.dateJobClose === 'True') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRange=' + this.formUpdate.startDate + '/' + this.formUpdate.endDate +
            '&dateRangeClose=' + this.formUpdate.startDateClose + '/' + this.formUpdate.endDateClose
        } else if (item.dateJobOpen === 'True' && item.dateJobClose === 'False') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRange=' + this.formUpdate.startDate + '/' + this.formUpdate.endDate
        } else if (item.dateJobOpen === 'False' && item.dateJobClose === 'True') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRangeClose=' + this.formUpdate.startDateClose + '/' + this.formUpdate.endDateClose
        } else if (item.dateJobOpen === 'False' && item.dateJobClose === 'False') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId
        }
      } else if (item.audiencesSelect === 'rating') {
        url = this.DNS_IP + '/rating/getAudience?shopId=' +
            this.session.data.shopId +
            // '&masBranchID=' +
            // branchId +
            '&ratingRange=' + item.startRating + '/' + item.endRating +
            '&dateRange=' + this.formUpdate.startDate + '/' + this.formUpdate.endDate
      } else if (item.audiencesSelect === 'typeCustomField') {
        if (item.selectData === 'booking') {
          url = this.DNS_IP + '/BookingData/getAudience?shopId=' + this.session.data.shopId + '&fieldValue=' + item.optionFieldValue +
          '&masBranchID=' + branchId
        } else if (item.selectData === 'job') {
          url = this.DNS_IP + '/jobData/getAudience?shopId=' + this.session.data.shopId + '&fieldValue=' + item.optionFieldValue +
          '&masBranchID=' + branchId
        }
      } else if (item.audiencesSelect === 'Preset') {
        url = this.DNS_IP + '/job/getAudiencePreset?shopId=' +
            this.session.data.shopId +
            '&flowId=' + item.refId +
            '&statusPreset=' + item.statusPreset +
            '&datePreset=' + item.datePreset
      }
      console.log(url)
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/member/get?shopId=' + this.session.data.shopId
        )
        .then(async response => {
          if (response.data.status === false) {
            this.valueAdd = 0
            this.dataAdd = 0
          } else {
            num = response.data.length
            this.valueAdd = 100
            this.dataAdd = num
          }
          await axios
            .get(
              url
            )
            .then(async res => {
              console.log('response', res.data)
              if (res.data.status === false) {
                this.valueAdd = parseInt((0 / num) * 100)
                this.dataAdd = 0
                this.dataUserLine = []
              } else {
                for (var i = 0; i < res.data.length; i++) {
                  var d = res.data[i]
                  var s = {}
                  if (d.lineUserId === '' || d.lineUserId === null) {

                  } else {
                    s.lineUserId = d.lineUserId
                    s.picture = d.memberPicture
                    s.name = d.memberName
                    this.dataUserLine.push(s)
                  }
                }
                if (this.dataUserLine.length > 0) {
                  this.valueAdd = parseInt((this.dataUserLine.length / num) * 100)
                  this.dataAdd = this.dataUserLine.length
                } else {
                  this.valueAdd = parseInt((0 / num) * 100)
                  this.dataAdd = 0
                }
              }
            })
        })
    },
    clearEdit () {
      this.showTabel = false
      this.filesUpdate = null
      this.dataUserLine = []
      this.formUpdate.pictureUrl = ''
      this.formUpdate.linkWeb = ''
      this.formUpdate.broadcastName = ''
      this.formUpdate.pictureUrlPreview = ''
      this.formUpdate.title = ''
      this.selectDataAudience = ''
      this.formUpdate.pictureUrl = ''
      this.formUpdate.title = ''
      this.formUpdate.id = ''
      this.formUpdate.selectData = 'booking'
      this.formUpdate.flowId = ''
      this.formUpdate.audiencesName = ''
      this.formUpdate.fieldId = ''
      this.formUpdate.optionFieldValue = ''
      this.formUpdate.startDate = ''
      this.formUpdate.endDate = ''
      this.formUpdate.startDateClose = ''
      this.formUpdate.endDateClose = ''
      this.formUpdate.audiencesSelect = 'bookingDate'
      this.formUpdate.startRating = 0
      this.formUpdate.endRating = 0
      this.formUpdate.shopId = this.$session.getAll().data.shopId
      this.formUpdate.masBranchID = ''
      this.formUpdate.dateJobOpen = 'False'
      this.formUpdate.dateJobClose = 'False'
      this.formUpdate.CREATE_USER = ''
      this.formUpdate.LAST_USER = ''
    },
    async sendPush () {
      this.$swal({
        title: 'ต้องการ แจ้งเตือน ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async result => {
        if (this.filesUpdate) {
          const _this = this
          let params = new FormData()
          params.append('file', this.filesUpdate)

          await axios
            .post(this.DNS_IP + `/file/upload/broadcast`, params)
            .then(function (response) {
              _this.formUpdate.pictureUrl = response.data
              console.log('url Pic', response.data)
            })
        }
        var item = this.itemEdit
        this.formUpdate.CREATE_USER = this.$session.getAll().data.userName
        this.formUpdate.LAST_USER = this.$session.getAll().data.userName
        var dt = {}
        if (item.audiencesSelect === 'bookingDate') {
          dt = {
            countSend: this.dataUserLine.length,
            pictureUrl: this.formUpdate.pictureUrl,
            linkWeb: this.formUpdate.linkWeb,
            message: this.formUpdate.title,
            broadcastName: this.formUpdate.broadcastName,
            lineUserId: this.dataUserLine,
            audiencesName: item.audiencesName,
            flowId: item.flowId,
            startDate: this.momenDate_1(item.startDate),
            endDate: this.momenDate_1(item.endDate),
            audiencesSelect: item.audiencesSelect,
            shopId: this.$session.getAll().data.shopId, //
            masBranchID: item.masBranchID,
            CREATE_DATE: this.format_date(new Date()),
            CREATE_USER: this.formUpdate.CREATE_USER,
            LAST_USER: this.formUpdate.LAST_USER
          }
        } else if (item.audiencesSelect === 'Preset') {
          dt = {
            countSend: this.dataUserLine.length,
            pictureUrl: this.formUpdate.pictureUrl,
            linkWeb: this.formUpdate.linkWeb,
            message: this.formUpdate.title,
            broadcastName: this.formUpdate.broadcastName,
            lineUserId: this.dataUserLine,
            audiencesName: item.audiencesName,
            flowId: item.flowId,
            startDate: this.formUpdate.startDate,
            endDate: this.formUpdate.endDate,
            audiencesSelect: item.audiencesSelect,
            shopId: this.$session.getAll().data.shopId, //
            CREATE_DATE: this.format_date(new Date()),
            CREATE_USER: this.formUpdate.CREATE_USER,
            LAST_USER: this.formUpdate.LAST_USER
          }
        } else if (item.audiencesSelect === 'typeJob') {
          console.log(item.dateJobOpen, item.dateJobClose)
          if (item.dateJobOpen === 'True' && item.dateJobClose === 'True') {
            dt = {
              countSend: this.dataUserLine.length,
              linkWeb: this.formUpdate.linkWeb,
              lineUserId: this.dataUserLine,
              pictureUrl: this.formUpdate.pictureUrl,
              message: this.formUpdate.title,
              broadcastName: this.formUpdate.broadcastName,
              audiencesName: item.audiencesName,
              flowId: item.flowId,
              startDate: this.momenDate_1(item.startDate),
              endDate: this.momenDate_1(item.endDate),
              startDateClose: this.momenDate_1(item.startDateClose),
              endDateClose: this.momenDate_1(item.endDateClose),
              audiencesSelect: item.audiencesSelect,
              shopId: this.$session.getAll().data.shopId,
              dateJobOpen: 'True', //
              dateJobClose: 'True', //
              masBranchID: item.masBranchID,
              CREATE_DATE: this.format_date(new Date()),
              CREATE_USER: this.formUpdate.CREATE_USER,
              LAST_USER: this.formUpdate.LAST_USER
            }
          } else if (item.dateJobOpen === 'True' && item.dateJobClose === 'False') {
            dt = {
              countSend: this.dataUserLine.length,
              linkWeb: this.formUpdate.linkWeb,
              lineUserId: this.dataUserLine,
              pictureUrl: this.formUpdate.pictureUrl,
              message: this.formUpdate.title,
              broadcastName: this.formUpdate.broadcastName,
              audiencesName: item.audiencesName,
              flowId: item.flowId,
              startDate: this.momenDate_1(item.startDate),
              endDate: this.momenDate_1(item.endDate),
              audiencesSelect: item.audiencesSelect,
              shopId: this.$session.getAll().data.shopId,
              dateJobOpen: 'True', //
              dateJobClose: 'False', //
              masBranchID: item.masBranchID,
              CREATE_DATE: this.format_date(new Date()),
              CREATE_USER: this.formUpdate.CREATE_USER,
              LAST_USER: this.formUpdate.LAST_USER
            }
          } else if (item.dateJobOpen === 'False' && item.dateJobClose === 'True') {
            dt = {
              countSend: this.dataUserLine.length,
              linkWeb: this.formUpdate.linkWeb,
              lineUserId: this.dataUserLine,
              pictureUrl: this.formUpdate.pictureUrl,
              message: this.formUpdate.title,
              broadcastName: this.formUpdate.broadcastName,
              audiencesName: item.audiencesName,
              flowId: item.flowId,
              startDateClose: this.momenDate_1(item.startDateClose),
              endDateClose: this.momenDate_1(item.endDateClose),
              audiencesSelect: item.audiencesSelect,
              shopId: this.$session.getAll().data.shopId,
              dateJobOpen: 'False', //
              dateJobClose: 'True', //
              masBranchID: item.masBranchID,
              CREATE_DATE: this.format_date(new Date()),
              CREATE_USER: this.formUpdate.CREATE_USER,
              LAST_USER: this.formUpdate.LAST_USER
            }
          } else if (item.dateJobOpen === 'False' && item.dateJobClose === 'False') {
            dt = {
              countSend: this.dataUserLine.length,
              linkWeb: this.formUpdate.linkWeb,
              lineUserId: this.dataUserLine,
              pictureUrl: this.formUpdate.pictureUrl,
              message: this.formUpdate.title,
              broadcastName: this.formUpdate.broadcastName,
              audiencesName: item.audiencesName,
              flowId: item.flowId,
              // endDateClose: new Date(item.endDateClose).toISOString().substr(0, 10),
              audiencesSelect: item.audiencesSelect,
              shopId: this.$session.getAll().data.shopId,
              dateJobOpen: 'False', //
              dateJobClose: 'False', //
              masBranchID: item.masBranchID,
              CREATE_DATE: this.format_date(new Date()),
              CREATE_USER: this.formUpdate.CREATE_USER,
              LAST_USER: this.formUpdate.LAST_USER
            }
          }
        } else if (item.audiencesSelect === 'rating') {
          dt = {
            countSend: this.dataUserLine.length,
            linkWeb: this.formUpdate.linkWeb,
            lineUserId: this.dataUserLine,
            pictureUrl: this.formUpdate.pictureUrl,
            message: this.formUpdate.title,
            broadcastName: this.formUpdate.broadcastName,
            audiencesName: item.audiencesName,
            startDate: this.momenDate_1(item.startDate),
            endDate: this.momenDate_1(item.endDate),
            audiencesSelect: item.audiencesSelect,
            shopId: this.$session.getAll().data.shopId,
            startRating: item.startRating,
            endRating: item.endRating,
            CREATE_DATE: this.format_date(new Date()),
            CREATE_USER: this.formUpdate.CREATE_USER,
            LAST_USER: this.formUpdate.LAST_USER
          }
        } else if (item.audiencesSelect === 'typeCustomField') {
          if (item.selectData === 'booking') {
            dt = {
              countSend: this.dataUserLine.length,
              linkWeb: this.formUpdate.linkWeb,
              lineUserId: this.dataUserLine,
              pictureUrl: this.formUpdate.pictureUrl,
              message: this.formUpdate.title,
              broadcastName: this.formUpdate.broadcastName,
              audiencesName: item.audiencesName,
              audiencesSelect: item.audiencesSelect,
              shopId: this.$session.getAll().data.shopId,
              fieldId: item.fieldId,
              optionFieldValue: item.optionFieldValue,
              selectData: item.selectData,
              masBranchID: item.masBranchID,
              CREATE_DATE: this.format_date(new Date()),
              CREATE_USER: this.formUpdate.CREATE_USER,
              LAST_USER: this.formUpdate.LAST_USER
            }
          } else if (item.selectData === 'job') {
            dt = {
              countSend: this.dataUserLine.length,
              linkWeb: this.formUpdate.linkWeb,
              lineUserId: this.dataUserLine,
              pictureUrl: this.formUpdate.pictureUrl,
              message: this.formUpdate.title,
              broadcastName: this.formUpdate.broadcastName,
              audiencesName: item.audiencesName,
              audiencesSelect: item.audiencesSelect,
              shopId: this.$session.getAll().data.shopId,
              fieldId: item.fieldId,
              optionFieldValue: item.optionFieldValue,
              selectData: item.selectData,
              masBranchID: item.masBranchID,
              CREATE_DATE: this.format_date(new Date()),
              CREATE_USER: this.formUpdate.CREATE_USER,
              LAST_USER: this.formUpdate.LAST_USER
            }
          }
        }
        await axios
          .post(
            // eslint-disable-next-line quotes
            this.DNS_IP + '/broadcast/add',
            dt
          )
          .then(async response => {
            console.log('addDataGlobal DNS_IP + PATH + "add"', response)
            this.dataSelect = false
            this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
            this.clearEdit()
            this.getDataList()
          })
          // eslint-disable-next-line handle-callback-err
          .catch(error => {
            console.log(error)
            // this.$router.push('/system/Errorpage?returnLink=' + this.returnLink)
            this.dataReady = true
          })
      })
    }
  }
}
</script>
<style scoped>
</style>
