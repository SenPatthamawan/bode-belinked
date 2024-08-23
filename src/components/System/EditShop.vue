<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs
          class="pl-0 pb-10"
          :items="breadcrumbs"
          divider=">"
        ></v-breadcrumbs>
        <v-row>
          <!-- edit -->
          <v-dialog ref="dialogEdit" v-model="dialogEdit" persistent max-width="600px">
            <v-card class="text-center">
              <v-form ref="form_update" v-model="validUpdate" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-row>
                    <v-col cols="10" class="text-left pt-10">
                    <h3><strong>แก้ไขข้อมูลร้านค้า</strong></h3>
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
                         @click="dialogEdit = false"
                        >
                        X
                        </v-btn>
                    </div>
                    </v-col>
                </v-row>
                    <v-row justify="center">
                          <v-col cols="6 " class="text-center">
                            <v-avatar
                              color="#FFFFFF"
                              size="150"
                            >
                             <v-img
                              aspect-ratio="6"
                              contain
                              :src="formUpdate.pictureUrlPreview"
                            ></v-img>
                            </v-avatar>
                            <!-- <v-avatar size="100px"><img alt="Avatar" :src="formAdd.pictureUrl"></v-avatar> -->
                            <br />
                            <v-file-input
                              required
                              counter
                              show-size
                              :rules="[rules.resizeImag]"
                              accept="image/png, image/jpeg, image/bmp"
                              prepend-icon="mdi-camera"
                              label="รูปโปรไฟล์"
                              @change="selectImgUpdate"
                              v-model="filesUpdate"
                            ></v-file-input>
                          </v-col>
                          <v-col cols="6 " class="text-center">
                            <v-avatar
                              tile
                              color="#FFFFFF"
                              size="150"
                            >
                             <v-img
                              aspect-ratio="6"
                              contain
                              :src="formUpdate.pictureCoverUrlPreview"
                            ></v-img>
                            </v-avatar>
                            <!-- <v-avatar size="100px"><img alt="Avatar" :src="formAdd.pictureUrl"></v-avatar> -->
                            <br />
                            <v-file-input
                              required
                              counter
                              show-size
                              :rules="[rules.resizeImag]"
                              accept="image/png, image/jpeg, image/bmp"
                              prepend-icon="mdi-camera"
                              label="รูป Cover"
                              @change="selectImgCoverUpdate"
                              v-model="filesUpdateImgCover"
                            ></v-file-input>
                          </v-col>
                        </v-row>
                    <v-row>
                      <v-col cols="6" class="pb-0">
                          <v-text-field
                            outlined
                            label="ชื่อร้าน"
                            placeholder="ชื่อร้าน*"
                            v-model="formUpdate.shopName"
                            :rules="[rules.required]"
                            required
                          ></v-text-field>
                      </v-col>
                      <v-col cols="6" class="pb-0">
                          <v-switch
                            v-model="formUpdate.showShopName"
                            inset
                          >
                            <template v-slot:label>
                              <div class="mt-0">แสดงชื่อร้านหน้า นัดหมาย</div>
                            </template>
                          </v-switch>
                      </v-col>
                      <v-col cols="6" class="pb-0">
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
                    </v-row>

                    <v-row>
                      <v-col cols="6" class="pb-0">
                          <v-text-field
                          outlined
                            label="E-mail"
                            v-model="formUpdate.contactEmail"
                            type="email"
                            :rules="[rules.email]"
                            required
                          ></v-text-field>
                      </v-col>
                      <v-col cols="6" class="pb-0">
                          <v-switch
                            v-model="formUpdate.darkMode"
                            inset
                          >
                            <template v-slot:label>
                              <div class="mt-0">Dark Mode</div>
                            </template>
                          </v-switch>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="pt-0 pb-0" style="display: flex;justify-content: left;height: 40px;">
                        <v-checkbox
                          label="เปิดให้จองเฉพาะช่วงเวลา เปิด/ปิด ร้าน"
                          false-value="False"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          color="#1B437C"
                          true-value="True"
                          v-model="formUpdate.statusBookingByTime"
                        ></v-checkbox>
                      </v-col>
                      <v-col v-if="formUpdate.statusBookingByTime === 'True'" cols="12" class="pt-0 pb-0 mt-3 mb-2" style="display: flex;justify-content: flex-start;">
                        <div class="mx-3" style="max-width: 130px;">
                          <v-text-field label="เวลาเปิด"
                          :rules="[rules.timeRules]"
                          required
                          placeholder="HH:mm"
                          outlined
                          v-model="formUpdate.startTime"
                          v-mask="'##:##'"
                          dense></v-text-field>
                        </div>
                        <div style="max-width: 130px;">
                          <p class="ma-0 pt-2"> - </p>
                        </div>
                        <div class="mx-3" style="max-width: 130px;">
                          <v-text-field
                          :rules="[rules.timeRules]"
                          required
                          label="เวลาปิด"
                          placeholder="HH:mm"
                          outlined
                          v-model="formUpdate.endTime"
                          v-mask="'##:##'"
                          dense></v-text-field>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" class="pt-0 pb-0" style="display: flex;justify-content: left;height: 40px;">
                        <v-checkbox
                          label="จำกัดเวลาตามช่าง"
                          false-value="False"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          color="#1B437C"
                          true-value="True"
                          v-model="formUpdate.timeSlotStatus"
                        ></v-checkbox>
                      </v-col>
                       <v-col cols="12" class="pt-0 pb-0" style="display: flex;justify-content: left;height: 40px;">
                        <v-checkbox
                          label="เปิดให้ลูกค้าสามารถ เลื่อนนัด / ยกเลิกนัด ได้"
                          false-value="False"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          color="#1B437C"
                          true-value="True"
                          v-model="formUpdate.statusCustomerEdit"
                        ></v-checkbox>
                      </v-col>
                      <!-- <v-col cols="12" class="pt-0 pb-0 ml-6" style="display: flex;justify-content: left;height: 40px;" v-if="formUpdate.statusCustomerEdit === 'True'">
                        <v-checkbox
                            label="เปิดใข้งานเลื่อนนัดก่อนวันที่นัดหมาย ( วัน + เวลานัดหมาย )"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formUpdate.statusCustomerEditNoTime"
                          ></v-checkbox>
                      </v-col> -->
                      <v-col cols="8" class="pt-0 pb-0 mt-4" style="display: flex;flex-wrap: wrap;" v-if="formUpdate.statusCustomerEdit === 'True'">
                        <v-autocomplete
                          class="mb-3"
                          v-model="formUpdate.countCustomerEdit"
                          label="เลื่อนนัดได้ไม่เกิน ( ครั้ง )"
                          dense
                          outlined
                          :rules="[rules.required]"
                          :items="countCustomerEditItem"
                          required
                          hide-details
                          auto-select-first
                        ></v-autocomplete>
                        <v-autocomplete
                          v-model="formUpdate.countDayCustomerEdit"
                          label="ต้องทำการ เลื่อน / ยกเลิกนัด ล่วงหน้าอย่างน้อยกี่วัน"
                          dense
                          outlined
                          :rules="[rules.requiredCountDay]"
                          :items="countDayCustomerEditItem"
                          required
                          hide-details
                          auto-select-first
                        ></v-autocomplete>
                        <v-checkbox
                            label="คำนวณวันที่สามารถเลื่อนได้ จากเวลาที่นัดหมาย"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formUpdate.statusCustomerEditNoTime"
                          ></v-checkbox>
                      </v-col>
                      <!-- <v-col cols="6" class="pt-0 pb-0 mt-3" style="display: flex;justify-content: left;height: 40px;" v-if="formUpdate.statusCustomerEdit === 'True'">
                        <v-autocomplete
                        v-model="formUpdate.countDayCustomerEdit"
                          label="เลื่อนนัดการก่อนวันที่นัดหมาย ( วัน )"
                          dense
                          solo
                          :rules="[rules.required]"
                          :items="countDayCustomerEditItem"
                          required
                        ></v-autocomplete>
                      </v-col> -->
                      <v-col cols="12" class="pt-0 pb-0" style="display: flex;justify-content: left;height: 40px;">
                        <v-checkbox
                          label="เชื่อมต่อกับ Google Calendar"
                          false-value="False"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          color="#1B437C"
                          true-value="True"
                          v-model="formUpdate.statusGoogleCalendar"
                          @change="connectGoogleCalendar(formUpdate.statusGoogleCalendar)"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" class="pt-0 pb-0 ml-4" style="display: flex;justify-content: left;height: 40px;" v-if="formUpdate.statusGoogleCalendar === 'True' && formUpdate.timeSlotStatus === 'True'">
                        <v-checkbox
                          label="เชื่อมต่อ Google Calendar กับพนักงาน"
                          false-value="False"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          color="#1B437C"
                          true-value="True"
                          v-model="formUpdate.statusGoogleCalendarEmp"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6" class="mt-6">
                        <v-select
                          v-model="formUpdate.category"
                          :items="category"
                          label="ประเภทธุรกิจ"
                          outlined
                          dense
                          required
                          :rules="[rules.required]"
                          attach
                          :menu-props="{ bottom: true, offsetY: true }"
                          @change="selectCategorySub()"
                        ></v-select>
                      </v-col>
                      <v-col>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" v-if="formUpdate.category !== '' && categorySub.length > 0">
                        <v-select
                          v-model="formUpdate.categorySub"
                          :items="categorySub"
                          label="ประเภทบริการ"
                          outlined
                          required
                          dense
                          multiple
                          attach
                          :menu-props="{ bottom: true, offsetY: true }"
                          :rules="[rules.requiredArray]"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="pt-0 pb-0" style="display: flex;justify-content: left;">
                        <v-checkbox
                          label="เปิดใช้ QR Payment (กรณี บัญชีนิติบุคคล)"
                          false-value="False"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          color="#1B437C"
                          true-value="True"
                          v-model="formUpdate.showQrPayments"
                        ></v-checkbox>
                        </v-col>
                      </v-row>
                     <v-row>
                      <v-col cols="12" class="pb-0">
                          <v-textarea
                            outlined
                            label="ข้อความตอบกลับการนัดหมาย (TH)"
                            v-model="formUpdate.bookingthankText"
                          ></v-textarea>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                          <v-textarea
                            outlined
                            label="ข้อความตอบกลับการนัดหมาย (EN)"
                            v-model="formUpdate.bookingthankTextEn"
                          ></v-textarea>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          outlined
                            label="ลิ้งค์วิดีโอ สำหรับแสดงผลคิวหน้าร้าน"
                            v-model="formUpdate.videoLinkMonition"
                          ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row justify="center">
                      <v-col cols="6" class="pb-2 pt-0 text-center">
                        <v-subheader>สีพื้นหลัง</v-subheader>
                        <v-color-picker
                          dot-size="25"
                          v-model="formUpdate.primaryColor"
                          mode="hexa"
                        ></v-color-picker>
                      </v-col>
                      <v-col cols="6" class="pb-2 pt-0 text-center">
                        <v-subheader>สีปุ่ม</v-subheader>
                        <v-color-picker
                          dot-size="25"
                          v-model="formUpdate.secondaryColor"
                          mode="hexa"
                        ></v-color-picker>
                        <!-- <v-color-picker
                          dot-size="25"
                          v-model="formUpdate.secondaryColor"
                          mode="hexa"
                          show-swatches
                          swatches-max-height="100"
                        ></v-color-picker> -->
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-col id="margin" class="mt-3">
                  <v-row justify="center">
                    <v-btn
                      elevation="2"
                      dark
                      block
                      large
                      color="#173053"
                      :disabled="!validUpdate"
                      @click="editData()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      บันทึก
                    </v-btn>
                  </v-row>
                </v-col>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end edit -->
          <!-- <div>
            <img id="image" src="picture.jpg">
          </div> -->
          <!-- data table -->
          <v-col cols="12">
            <v-card elevation="7" v-if="dataReady">
              <v-card-title> </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="columns"
                  :items="dataItem"
                  :items-per-page="10"
                >
                  <template v-slot:[`item.category`]="{ item }">
                    {{ category.filter((a) => a.value === parseInt(item.category))[0].text }}
                  </template>
                  <template v-slot:[`item.CREATE_DATE`]="{ item }">
                    {{ format_dateFUllTime(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                    {{ format_dateFUllTime(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.expireDate`]="{ item }">
                    {{ format_dateNotime(item.expireDate) }}
                  </template>
                  <template v-slot:[`item.shopImge`]="{ item }">
                    <v-avatar color="primary" size="40">
                      <img :src="item.shopImge" alt="img"
                    /></v-avatar>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      color="question"
                      fab
                      dark
                      small
                      @click.stop="
                        ;(dialogEdit = true),
                          getDataById(item),
                          validate('UPDATE')
                      "
                    >
                      <v-icon dark> mdi-tools </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
            <div v-if="!dataReady" class="text-center">
              <waitingAlert></waitingAlert>
            </div>
            <GoogleCalendarCmp ref="GoogleCalendarRef" />
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
import GoogleCalendarCmp from '../Core/GoogleCalendarCmp.vue'

export default {
  components: {
    waitingAlert,
    'left-menu-admin': adminLeftMenu,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile,
    GoogleCalendarCmp
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  data () {
    return {
      showComponents: false,
      PK: '',
      path: '/sys_shop/', // Path Model
      returnLink: '/system/EditShop',
      dataReady: true,
      dateTime: '', // Generate DateTime
      date: this.momenDate_1(new Date()),
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      code: 'SYS_GROUP_TYPE_', // Generate Code
      // Dialog Config ADD EDIT DELETE IMPORT
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogImport: false,
      // END Dialog Config ADD EDIT DELETE
      panel: [0],
      panel1: [1],
      session: this.$session.getAll(),
      ZIP_CD: '',
      optionSubDistrict: [],
      optionDistrict: [],
      optionProvince: [],
      formUpdate: {
        pictureUrlPreview: '',
        pictureCoverUrlPreview: '',
        contactTel: '',
        shopName: '',
        shopImge: '',
        expireDate: '',
        contactEmail: '',
        map: '',
        ZIP_CD: '',
        optionSubDistrictNew: '',
        optionDistrictNew: '',
        optionProvinceNew: '',
        shopImageCover: '',
        primaryColor: '',
        secondaryColor: '',
        darkMode: false,
        category: '',
        categorySub: [],
        timeSlotStatus: 'False',
        showQrPayments: 'False',
        bookingthankTextEn: '',
        bookingthankText: '',
        videoLinkMonition: '',
        statusGoogleCalendar: 'False',
        statusGoogleCalendarEmp: 'False',
        refreshTokenGoogleCalendar: '',
        statusCustomerEdit: 'False',
        statusCustomerEditNoTime: 'False',
        countCustomerEdit: '',
        countDayCustomerEdit: '',
        showShopName: '',
        statusBookingByTime: 'False',
        startTime: '',
        endTime: ''
      },
      countCustomerEditItem: [1, 2, 3, 4, 5, 6, 7],
      countDayCustomerEditItem: [
        { 'text': 'ไม่กำหนดวัน', 'value': 0 },
        { 'text': 1, 'value': 1 },
        { 'text': 2, 'value': 2 },
        { 'text': 3, 'value': 3 },
        { 'text': 4, 'value': 4 },
        { 'text': 5, 'value': 5 },
        { 'text': 6, 'value': 6 },
        { 'text': 7, 'value': 7 },
        { 'text': 8, 'value': 8 },
        { 'text': 9, 'value': 9 },
        { 'text': 10, 'value': 10 },
        { 'text': 11, 'value': 11 },
        { 'text': 12, 'value': 12 },
        { 'text': 13, 'value': 13 },
        { 'text': 14, 'value': 14 },
        { 'text': 15, 'value': 15 },
        { 'text': 16, 'value': 16 },
        { 'text': 17, 'value': 17 },
        { 'text': 18, 'value': 18 },
        { 'text': 19, 'value': 19 },
        { 'text': 20, 'value': 20 },
        { 'text': 21, 'value': 21 },
        { 'text': 22, 'value': 22 },
        { 'text': 23, 'value': 23 },
        { 'text': 24, 'value': 24 },
        { 'text': 25, 'value': 25 },
        { 'text': 26, 'value': 26 },
        { 'text': 27, 'value': 27 },
        { 'text': 28, 'value': 28 },
        { 'text': 29, 'value': 29 },
        { 'text': 30, 'value': 30 },
        { 'text': 31, 'value': 31 }
      ],
      timeSlotStatusOld: '',
      filesShop: null,
      // category: [
      //   { text: 'ธุรกิจรถยนต์', value: 'ธุรกิจรถยนต์' },
      //   { text: 'ธุรกิจอื่นๆ', value: 'ธุรกิจอื่นๆ' }
      // ],
      formUpdateItem: {
        userTypeGroupCode: '',
        userTypeGroupName: '',
        CAN_VIEW: '',
        CAN_ADD: '',
        CAN_UPDATE: '',
        CAN_DELETE: '',
        CAN_IMPORT: '',
        CAN_EXPORT: ''
      },
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        IDcardRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: value => !!value || 'กรุณากรอก.',
        requiredArray: value => value.length > 0 || 'กรุณาเลือกประเภทบริการ',
        requiredCountDay: (value) => value == null || value === '' ? 'กรุณากรอก.' : true,
        resizeImag: value =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
        counterIDcard: value => value.length <= 13 || 'Max 13 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        timeRules: value => {
          const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/
          return pattern.test(value) || 'กรุณากรอกเวลาในรูปแบบ 00:00 ถึง 23:59'
        }
      },
      // End Form Config ADD EDIT
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'จัดการ ร้านค้า',
          disabled: true,
          href: '/System/EditShop'
        }
      ],
      // End Menu Config
      // Data Table Config
      columns: [
        { text: 'โลโก้', value: 'shopImge' },
        // { text: 'ID', value: 'shopId' },
        { text: 'ชื่อร้าน', value: 'shopName' },
        { text: 'เบอร์ร้าน', value: 'contactTel' },
        { text: 'E-mail', value: 'contactEmail' },
        { text: 'ประเภทธุรกิจ', value: 'category' },
        // { text: 'วันที่หมดอายุ', value: 'expireDate' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
        { text: 'จัดการ', value: 'action', sortable: false, align: 'center' }
      ],
      dataItem: [],
      filesUpdate: null,
      filesUpdateImgCover: null,
      validUpdate: true,
      category: [],
      Allcategory: [],
      categorySub: [],
      AllcategorySub: []
      // End Data Table Config
    }
  },
  beforeCreate () {
    if (!this.$session.exists()) {
      this.$router.push('/Core/Login')
    }
  },
  async mounted () {
    // this.getGetToken(this.DNS_IP)
    // this.getDataTypeGroup()
    this.dataReady = false
    // Get Data
    await this.getCategory()
    await this.getCategorySub()
    await this.getDataGlobal(
      this.DNS_IP,
      this.path,
      this.session.data.shopId,
      this.returnLink
    )
    await this.selectCategorySub()
  },
  methods: {
    validateTime () {
      const time = this.formUpdate.startTime
      const [hours, minutes] = time.split(':').map(Number)
      if (
        isNaN(hours) || isNaN(minutes) ||
        hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59
      ) {
        this.formUpdate.startTime = '' // หรือคุณสามารถตั้งค่าเป็นค่าเริ่มต้นที่ถูกต้อง
        alert('Please enter a valid time between 00:00 and 23:59')
      }
    },
    connectGoogleCalendar (item) {
      console.log('test', item)
      if (item === 'True') {
        // this.$refs.GoogleCalendarRef.handleClickLogin()
        this.$refs.GoogleCalendarRef.UseGoogleCalendar()
      }
    },
    resetShop () {
      this.$emit('confirmed')
    },
    async getCategory () {
      await axios.get(this.DNS_IP + '/category/getsort')
        .then(async (response) => {
          let rs = response.data
          console.log('rs_getCategory', rs)
          if (rs.length > 0) {
            this.Allcategory = rs
            rs.forEach((d) => {
              let s = {}
              s.text = d.nameCategoryTH
              s.textEn = d.nameCategoryEN
              s.value = d.idCategory
              console.log('type', typeof d.idCategory)
              // s.value = d.nameCategoryTH
              this.category.push(s)
            })
          }
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    async getCategorySub () {
      await axios.get(this.DNS_IP + '/categorySub/getsort')
        .then(async (response) => {
          let rs = response.data
          console.log('rs_getCategorySub', rs)
          if (rs.length > 0) {
            this.AllcategorySub = rs
          }
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    async selectCategorySub () {
      this.formUpdate.categorySub = []
      this.categorySub = []
      console.log('tthis.AllcategorySub', this.AllcategorySub)
      // let Id = this.Allcategory.filter((i) => i.nameCategoryTH === this.formUpdate.category)[0].idCategory
      // console.log('ddfdfsdfsdf', this.Allcategory.filter((i) => i.nameCategorySubTH === this.formUpdate.category))
      this.AllcategorySub.forEach((d) => {
        let s = {}
        if (d.idCategory === this.formUpdate.category) {
          console.log('IF')
          s.text = d.nameCategorySubTH
          s.textEn = d.nameCategorySubEN
          s.value = d.idCategorySub
          this.categorySub.push(s)
        }
      })
      console.log('this.cat', this.categorySub)
    },
    editDataByBookingField (item) {
      // console.log('item1111111111111111111111111111', item)
      this.dialogEdit = true
      this.getDataById(item[0])
      this.validate('UPDATE')
      // this.getDataById()
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
    selectImgCoverUpdate () {
      if (this.filesUpdateImgCover) {
        this.formUpdate.pictureCoverUrlPreview = URL.createObjectURL(this.filesUpdateImgCover)
      } else {
        this.formUpdate.pictureCoverUrlPreview = ''
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
      console.log('getDataById', item)
      this.formUpdate.timeSlotStatus = item.timeSlotStatus || 'False'
      this.timeSlotStatusOld = item.timeSlotStatus || 'False'
      this.dataReady = false
      await this.getDataByIdGlobal(
        this.DNS_IP,
        this.path,
        'shopId',
        item.shopId,
        this.returnLink
      )
      // this.formUpdate.logoPreview = this.formUpdate.logo
      this.formUpdate.expireDate = moment(this.formUpdate.expireDate).format(
        'YYYY-MM-DD HH:mm'
      )
      this.formUpdate.pictureUrlPreview = this.formUpdate.shopImge
      this.formUpdate.pictureCoverUrlPreview = this.formUpdate.shopImageCover
      this.formUpdate.statusGoogleCalendar = item.statusGoogleCalendar || 'False'
      this.formUpdate.statusGoogleCalendarEmp = item.statusGoogleCalendarEmp || 'False'
      this.formUpdate.statusCustomerEdit = item.statusCustomerEdit || 'False'
      this.formUpdate.statusCustomerEditNoTime = item.statusCustomerEditNoTime || 'False'
      this.formUpdate.countCustomerEdit = item.countCustomerEdit || 3
      this.formUpdate.countDayCustomerEdit = item.countDayCustomerEdit === 0 ? item.countDayCustomerEdit : (item.countDayCustomerEdit || 7)
      this.formUpdate.statusBookingByTime = item.statusBookingByTime || 'False'
      this.formUpdate.startTime = item.startTime || ''
      this.formUpdate.endTime = item.endTime || ''
      if (this.formUpdate.darkMode === 'True') {
        this.formUpdate.darkMode = true
      } else {
        this.formUpdate.darkMode = false
      }
      if (this.formUpdate.showShopName === 'True') {
        this.formUpdate.showShopName = true
      } else {
        this.formUpdate.showShopName = false
      }
      if (this.formUpdate.bookingthankText === null) {
        this.formUpdate.bookingthankText = ''
      } else {
        console.log('bookingthankText', this.formUpdate.bookingthankText)
      }
      if (this.formUpdate.bookingthankTextEn === null) {
        this.formUpdate.bookingthankTextEn = ''
      } else {
        console.log('bookingthankTextEn', this.formUpdate.bookingthankTextEn)
      }
      if (this.formUpdate.showQrPayments === null || this.formUpdate.showQrPayments === '') {
        this.formUpdate.showQrPayments = 'False'
      }
      this.formUpdate.category = parseInt(item.category)
      await this.selectCategorySub()
      this.formUpdate.categorySub = JSON.parse(item.categorySub) || []
      // this.formUpdate.primaryColor = item.primaryColor
      // this.formUpdate.secondaryColor = item.secondaryColor
      // if (this.formUpdate.ZIP_CD.length >= 5) {
      //   this.getAddress()
      // }
      console.log('formUpdate', this.formUpdate)
    },
    async editData () {
      await this.$refs.form_update.validate()
      console.log('validUpdate', this.validUpdate)
      console.log(this.formUpdate)
      if (this.validUpdate === true) {
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
            // this.formUpdate.LAST_USER = this.session.data.userName
            var ID = this.formUpdate.shopId
            if (this.filesUpdate) {
              const _this = this
              let params = new FormData()
              params.append('file', this.filesUpdate)
              await axios
                .post(this.DNS_IP + `/file/upload/shop`, params)
                .then(function (response) {
                  _this.formUpdate.shopImge = response.data
                  console.log('url Pic', response.data)
                })
            } else {
              this.formUpdate.shopImge = this.formUpdate.pictureUrlPreview
            }
            if (this.filesUpdateImgCover) {
              const _this = this
              let params = new FormData()
              params.append('file', this.filesUpdateImgCover)
              await axios
                .post(this.DNS_IP + `/file/upload/shop`, params)
                .then(function (response) {
                  _this.formUpdate.shopImageCover = response.data
                  console.log('url Pic', response.data)
                })
            } else {
              this.formUpdate.shopImageCover = this.formUpdate.pictureCoverUrlPreview
            }
            var darkMode = ''
            if (this.formUpdate.darkMode === true) {
              darkMode = 'True'
            } else {
              darkMode = 'False'
            }
            var showShopName = ''
            if (this.formUpdate.showShopName === true) {
              showShopName = 'True'
            } else {
              showShopName = 'False'
            }
            let bookingthankText = ''
            if (this.formUpdate.bookingthankText === '') {
              bookingthankText = ''
            } else {
              bookingthankText = this.formUpdate.bookingthankText.replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            let bookingthankTextEn = ''
            if (this.formUpdate.bookingthankTextEn === '') {
              bookingthankTextEn = ''
            } else {
              bookingthankTextEn = this.formUpdate.bookingthankTextEn.replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            let videoLinkMonition = ''
            if (this.formUpdate.videoLinkMonition === '' || this.formUpdate.videoLinkMonition === null) {
              videoLinkMonition = ''
            } else {
              videoLinkMonition = this.formUpdate.videoLinkMonition.replace(/%/g, '%%').replace(/'/g, "\\'")
            }
            var dt = {
              shopName: this.formUpdate.shopName,
              shopImge: this.formUpdate.shopImge,
              shopImageCover: this.formUpdate.shopImageCover,
              contactTel: this.formUpdate.contactTel,
              LAST_USER: this.session.data.userName,
              contactEmail: this.formUpdate.contactEmail,
              primaryColor: this.formUpdate.primaryColor,
              secondaryColor: this.formUpdate.secondaryColor,
              category: this.formUpdate.category,
              categorySub: JSON.stringify(this.formUpdate.categorySub),
              timeSlotStatus: this.formUpdate.timeSlotStatus,
              showQrPayments: this.formUpdate.showQrPayments,
              videoLinkMonition: videoLinkMonition,
              darkMode: darkMode,
              bookingthankText: bookingthankText,
              bookingthankTextEn: bookingthankTextEn,
              statusGoogleCalendar: this.formUpdate.statusGoogleCalendar,
              statusGoogleCalendarEmp: this.formUpdate.statusGoogleCalendarEmp,
              statusCustomerEdit: this.formUpdate.statusCustomerEdit,
              statusCustomerEditNoTime: this.formUpdate.statusCustomerEditNoTime,
              countCustomerEdit: this.formUpdate.countCustomerEdit,
              countDayCustomerEdit: this.formUpdate.countDayCustomerEdit,
              showShopName: showShopName,
              statusBookingByTime: this.formUpdate.statusBookingByTime,
              startTime: this.formUpdate.startTime,
              endTime: this.formUpdate.endTime
            }
            await axios
              .post(
                // eslint-disable-next-line quotes
                this.DNS_IP + this.path + 'edit/' + ID,
                dt
                // {
                //   headers: {
                //     'Application-Key': this.$session.getAll().ApplicationKey
                //   }
                // }
              )
              .then(async response => {
                // Debug response
                var ds = {
                  shopName: this.formUpdate.shopName,
                  shopImge: this.formUpdate.shopImge,
                  shopImageCover: this.formUpdate.shopImageCover,
                  contactTel: this.formUpdate.contactTel,
                  LAST_USER: this.session.data.userName,
                  contactEmail: this.formUpdate.contactEmail,
                  primaryColor: this.formUpdate.primaryColor,
                  secondaryColor: this.formUpdate.secondaryColor,
                  darkMode: darkMode,
                  bookingthankText: bookingthankText,
                  sourceProgram: 'belinked',
                  bookingthankTextEn: bookingthankTextEn
                }
                this.updateBetaskDB(ds, this.$session.getAll().data.shopId)
                console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
                let checktimeSlotStatus = this.formUpdate.timeSlotStatus || 'False'
                console.log('-----------', this.timeSlotStatusOld, checktimeSlotStatus)
                if (this.timeSlotStatusOld === checktimeSlotStatus) {
                  this.$swal('เรียบร้อย', 'บันทึกสำเร็จ', 'success')
                } else {
                  let dt = {}
                  if (this.formUpdate.timeSlotStatus === 'True') {
                    dt = {
                      shopId: this.$session.getAll().data.shopId,
                      timeSlotStatus: this.formUpdate.timeSlotStatus,
                      storeFrontCheck: 'False',
                      checkOnsite: 'False',
                      LAST_USER: this.$session.getAll().data.userName
                    }
                  } else {
                    dt = {
                      shopId: this.$session.getAll().data.shopId,
                      timeSlotStatus: this.formUpdate.timeSlotStatus,
                      LAST_USER: this.$session.getAll().data.userName
                    }
                  }
                  axios
                    .post(
                      // eslint-disable-next-line quotes
                      this.DNS_IP + "/flow/editTimeSlotStatusByshopId",
                      dt
                    )
                    .then(async response => {})
                  this.$swal('เรียบร้อย', 'กรุณา เข้าสู่ระบบอีกครั้ง', 'success')
                    .then(async result => {
                      console.log('IF!!!!!!!_IF')
                      this.logout()
                    }).catch(error => {
                      console.log('IF!!!!!!!_ELSE')
                      this.logout()
                      console.log('error function editDataGlobal : ', error)
                    })
                }
                // Close Dialog
                this.dialogEdit = false

                // Load Data
                // await this.reloadData()
                this.resetShop()
                await this.clearDataUpdate()
                this.filesShop = null
                await this.getDataGlobal(
                  this.DNS_IP,
                  this.path,
                  this.session.data.shopId,
                  this.returnLink
                )
              })
              // eslint-disable-next-line handle-callback-err
              .catch(error => {
                this.dataReady = true
                console.log('error function editDataGlobal : ', error)
                this.$router.push(
                  '/system/Errorpage?returnLink=' + this.returnLink
                )
              })
          })
          .catch(error => {
            this.dataReady = true
            console.log('error function editDataGlobal : ', error)
          })
      }
    },
    logout () {
      this.$session.destroy()
      this.$session.clear()
      localStorage.clear()
      this.$router.push('/Core/Login')
    },
    updateBetaskDB (ds, shopId) {
      axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP_Betask + "/sys_shop/editData/" + shopId,
          ds
        )
        .then(async response => {
        })
    },
    async clearDataUpdate () {
      // eslint-disable-next-line no-redeclare
      for (var key in this.formUpdate) {
        if (this.formUpdate[key]) {
          this.formUpdate[key] = ''
        }
      }
    }
  }
}
</script>
<style scope>
/* ::-webkit-scrollbar {
  width: 2px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #173053;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #173053;
} */
</style>
