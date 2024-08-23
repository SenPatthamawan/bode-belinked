<template>
  <div>
     <v-app-bar fixed app>
      <!-- <v-app-bar-nav-icon dark @click.stop="drawer = !drawer" /> -->
        <!-- <v-toolbar-title v-text="title" /> -->
      <v-spacer></v-spacer>
      <v-avatar class="mr-3">
        <v-img :src="session.data.shopImge"></v-img>
      </v-avatar>
      <v-toolbar-title>{{ session.data.shopName }}</v-toolbar-title>
        <!-- <v-list-item-avatar>
          <v-img :src="session.data.shopImge"></v-img>
        </v-list-item-avatar>
        <v-list-item-content><strong style="color: white;">{{ session.data.shopName }}</strong></v-list-item-content> -->
    </v-app-bar>
    <v-main>
      <div>
        <div>
          <p
            style="font-size: 2rem; font-weight: bold; color: #072469"
            class="mb-5 pl-4"
          >
            ราคาเเพ็กเกจ
          </p>
          <p
            style="font-size: 1.5rem; font-weight: bold; color: #072469"
            class="mb-5 pl-4"
          >
            ช่องทางการชำระเงินมี 2 ช่องทางดังนี้
          </p>
          <p style="font-size: 1.2rem; color: #607eaa" class="pl-4 mb-0">
            1. ชำระเงินด้วย QR Code Prompt Pay
          </p>
          <p style="font-size: 1.2rem; color: #607eaa" class="pl-4">
            2. ชำระด้วยการโอนผ่านธนาคาร
          </p>
        </div>
        <v-row>
          <v-col cols="12">
            <div>
              <v-card-text v-if="dataReadyGet">
                <v-row v-if="paymentStatus === '' || paymentStatus === 'inactive'">
                  <v-col
                    :cols="resCol"
                    v-for="(item, index) in dataPackage"
                    :key="index"
                  >
                    <v-container>
                      <v-card>
                        <v-card-title
                          class="mb-3"
                          style="
                            justify-content: center;
                            background-color: #1b437c;
                            color: white;
                            padding: 15px;
                            font-weight: bold;
                          "
                        >
                          {{ item.name }}
                        </v-card-title>
                        <div
                          style="
                            text-align: center;
                            padding: 20px;
                            font-size: 1.7rem;
                            font-weight: bold;
                            color: #001e6c;
                          "
                        >
                          {{ formatNumber(item.pricePackage) }} ฿/เดือน
                        </div>
                        <v-row>
                          <v-col col="12" class="pa-7">
                            <div>
                              <v-card-text
                                v-for="(items, index) in item.description"
                                :key="index"
                              >
                                <!-- <div v-if="index === 2">
                                <div style="display:flex">
                                    <v-icon color="#1B437C" class="mr-2">{{ items.icon }}</v-icon><div>{{items.title}}{{ items.subtitle }}</div>
                                  </div>
                              </div> -->
                                <div v-if="index !== 2 && index !== 1">
                                  <!-- <v-icon dark color="#1B437C">
                                    {{ items.icon }}
                                  </v-icon> -->
                                  <div style="display: flex">
                                    <v-icon color="#1B437C" class="mr-2">{{
                                      items.icon
                                    }}</v-icon>
                                    <div class="mr-1">{{ items.title }}</div>
                                    <div
                                      style="color: #1b437c; font-weight: bold"
                                    >
                                      {{ items.subtitle }}
                                    </div>
                                  </div>
                                </div>
                                <div v-if="index !== 2 && index !== 0">
                                  <!-- <v-icon dark color="#1B437C">
                                    {{ items.icon }}
                                  </v-icon> -->
                                  <div style="display: flex">
                                    <v-icon color="#1B437C" class="mr-2">{{
                                      items.icon
                                    }}</v-icon>
                                    <div>
                                      {{ items.title }} {{ items.subtitle }}
                                    </div>
                                  </div>
                                </div>
                              </v-card-text>
                            </div>
                          </v-col>
                        </v-row>
                        <div
                          v-if="dataBilling !== item.id && (statusBilling === 'confirm' || statusBilling === '')"
                          class="text-center plan_button"
                        >
                          <v-btn
                            rounded
                            color="#1B437C"
                            dark
                            @click="showQrCode(item)"
                          >
                            เลือกแพ็คเกจ
                          </v-btn>
                        </div>
                        <div
                          v-if="dataBilling === item.id && countDateEnd <= 0 && (statusBilling === 'confirm' || statusBilling === '')"
                          class="text-center plan_button"
                        >
                          <v-btn
                            rounded
                            color="#1B437C"
                            dark
                            @click="showQrCode(item)"
                          >
                            ต่ออายุแพ็คเกจ
                          </v-btn>
                        </div>
                        <div
                          v-if="dataBilling === item.id && countDateEnd > 0"
                          class="text-center plan_button"
                        >
                          <v-btn disabled rounded> แพ็คเกจปัจจุบัน </v-btn>
                          <!-- <v-btn rounded outlined color="teal" dark>
                            แพลนปัจจุบัน
                          </v-btn> -->
                        </div>
                        <template v-if="dataBilling === item.id">
                          <template v-if="statusBilling === 'confirm'">
                            <v-row>
                              <v-col col="12" class="pl-7 pt-4 pb-0">
                                <div style="display: flex">
                                  <v-icon color="#1B437C" class="mr-2">mdi-calendar-check</v-icon>
                                  <div style="color: #1b437c; font-weight: bold" class="mr-1">วันที่เริ่ม : </div>
                                  <div>{{dataPayment.startDateShow}}</div>
                                </div>
                              </v-col>
                              <v-col col="12" class="pl-7 pt-1 pb-0">
                                <div style="display: flex">
                                  <v-icon color="#E53935" class="mr-2">mdi-calendar-remove</v-icon>
                                  <div style="color: #E53935; font-weight: bold" class="mr-1">วันที่หมดอายุ : </div>
                                  <div>{{dataPayment.endDateShow}}</div>
                                </div>
                              </v-col>
                            </v-row>
                            <v-row v-if="countDateEnd <= 0">
                              <v-col col="12" class="pl-7 pt-1 pb-0 text-center">
                                <div style="color: #EF6C00; font-weight: bold">กรุณาต่ออายุแพ็คเกจ</div>
                                <div style="color: #EF6C00; font-weight: bold">เพื่อความต่อเนื่องในการใช้โปรแกรม</div>
                              </v-col>
                            </v-row>
                            </template>
                            <template v-if="statusBilling === 'wait'">
                              <v-alert
                                class="mt-1"
                                dense
                                border="left"
                                type="warning"
                              >
                                กำลังดำเนินการ
                              </v-alert>
                            </template>
                            <template v-if="statusBilling === 'error'">
                              <v-alert
                                class="mt-1"
                                border="left"
                                dense
                                type="error"
                              >
                                <v-row align="center">
                                  <v-col class="grow">
                                    {{remarkReturn}}
                                  </v-col>
                                  <v-col class="shrink">
                                    <v-btn color="teal" x-small @click="setData(dataPayment)"><strong>ตรวจสอบอีกครั้ง</strong></v-btn>
                                  </v-col>
                                </v-row>
                              </v-alert>
                            </template>
                        </template>
                      </v-card>
                    </v-container>
                  </v-col>
                </v-row>
                <v-row v-if="paymentStatus === 'wait'">
                    <v-col cols="12" class="text-center">
                      <h1>รายการชำระค่าบริการของท่าน</h1>
                      <h2>ทางบริษัทได้ตรวจสอบสลิปของท่านไม่ถูกต้อง</h2>
                      <h2>กรุณาอัพเดทสลิปอีกครั้ง</h2>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn color="teal" dark large @click="setData(sysShopData)"><strong>ตรวจสอบอีกครั้ง</strong></v-btn>
                    </v-col>
                </v-row>
                <v-row v-if="paymentStatus === 'confirm' || paymentStatus === 'finish'">
                    <v-col cols="12" class="text-center">
                        <h1>รายการชำระค่าบริการของท่าน</h1>
                        <h2>ชำระเงินแล้ว กรุณาทำรายการให้</h2>
                        <h2>ทุกวันที่ 1-7 ของแต่ละเดือน</h2>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn color="teal" dark large @click="gotoLogin()"><strong>Login</strong></v-btn>
                    </v-col>
                </v-row>
                <!-- <div class="text-right plan_button">
                  <v-btn rounded color="error" dark @click="dialogCash = false">
                    ปิด
                  </v-btn>
                </div> -->
              </v-card-text>
              <!-- <v-card-text>
                <div class="text-right plan_button">
                  <v-btn
                    rounded
                    color="error"
                    dark
                    @click="dialogCancel = true"
                  >
                    ยกเลิกแผนการชำระเงิน
                  </v-btn>
                </div>
              </v-card-text> -->
            </div>
            <v-dialog v-model="dialogCancel" persistent max-width="500px">
              <v-card>
                <v-card-title> ยกเลิกแผนการชำระเงิน </v-card-title>
                <v-card-text
                  >ต้องการ ยกเลิกแผนการชำระเงิน ใช่หรือไม่?</v-card-text
                >
                <!-- <v-card-text class="text-red">* บริษัทจะไม่มีการคืนเงินในกรณีใดๆทั้งสิ้น *</v-card-text> -->
                <v-alert outlined type="warning"
                  >* บริษัทจะไม่มีการคืนเงินในทุกกรณี *</v-alert
                >
                <v-card-actions v-if="dataReadyCancel">
                  <v-spacer></v-spacer>
                  <v-btn
                    dark
                    color="red darken-1"
                    @click="dialogCancel = false"
                  >
                    ตรวจสอบอีกครั้ง
                  </v-btn>
                  <v-btn dark color="green darken-1" @click="cancelPlan()">
                    ยกเลิกแผนการชำระเงิน
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogQrcode" persistent max-width="600px" style="overflow-y: hidden;">
              <v-card elevation="7">
                <v-card-text v-if="uploadSlipShow">
                  <br />
                  <h4 class="text-center font-weight-black mb-10">
                    แนบหลักฐานการโอนเงิน
                  </h4>
                  <v-row>
                    <v-col cols="12" class="text-center pa-2 mt-6">
                      <v-img
                        v-if="paymentImge !== null"
                        class="pa-3"
                        contain
                        max-height="100%"
                        max-width="100%"
                        :src="paymentImge"
                      ></v-img>
                      <v-avatar v-else tile color="#FFFFFF" size="180">
                        <v-img
                          aspect-ratio="6"
                          contain
                          src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FUploadicon.png?alt=media&token=39383860-d16e-49ca-81cb-a3ad888df095"
                        ></v-img>
                      </v-avatar>
                      <v-file-input
                        class="mt-6 mb-6"
                        required
                        counter
                        show-size
                        :rules="[rules.resizeImag]"
                        accept="image/png, image/jpeg, image/bmp"
                        prepend-icon="mdi-paperclip"
                        label="Upload"
                        @change="selectImg"
                        v-model="filesImg"
                      ></v-file-input>
                    </v-col>
                     <v-col cols="12" class="pt-1 pb-0">
                      <v-text-field
                        prepend-icon="mdi-account"
                        v-model="billingCusName"
                        label="ชื่อ-สกุล"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0">
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
                    <v-col cols="12" class="pt-1 pb-0">
                      <v-text-field
                        prepend-icon="mdi-hail"
                        v-model="billingTax"
                        label="เลขประจำตัวผู้เสียภาษี"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0">
                      <v-textarea
                        prepend-icon="mdi-map-marker"
                        v-model="billingAddress"
                        auto-grow
                        rows="2"
                        label="ที่อยู่"
                        dense
                        outlined
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <div class="text-center mt-5">
                    <v-btn
                      class="button pa-2"
                      color="error"
                      dark
                      large
                      @click="uploadSlipShow = false"
                      >กลับ</v-btn
                    >
                    <v-btn
                      class="button pa-2"
                      dark
                      large
                      @click="billingPlan(dataPlan)"
                      >อัพโหลดสลิป</v-btn
                    >
                  </div>
                </v-card-text>
                <v-card-text v-if="!uploadSlipShow">
                  <br />
                  <div class="text-end" style="position: absolute;right: 29px;">
                  <v-btn
                    class="mx-2"
                    fab
                    small
                    dark
                    color="white"
                    style="color:red;font-size:20px;"
                    @click="dialogQrcode = false"
                  >
                   X
                  </v-btn>
                  </div>
                  <h3 class="text-center" style="color:#1B437C;font-weight: bold;">ชำระเงินด้วย</h3>
                  <!-- <h3 class="text-center" style="color:#1B437C;font-weight: bold;">วิธีการโอน</h3> -->
                  <h3 class="text-center" style="color:#1B437C;font-weight: bold;">QR PromptPay</h3>
                  <v-card class="mt-6 mb-6 pb-6" elevation="0">
                    <!-- <v-img
                      height="170"
                      src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FQR-prompt.jpg?alt=media&token=42637b63-af5b-45d9-8900-b866b789819e"
                    ></v-img> -->
                    <div class="text-center mt-4" v-if="value">
                      <qrcode-vue
                        :value="value"
                        :size="size"
                        level="H"
                        :foreground="foreground"
                      />
                    </div>
                    <!-- <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-3">
                      บริษัท บีแทสก์ คอนซัลติ้ง จำกัด
                    </h6> -->
                    <br>
                    <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0">
                      บัญชี : บริษัท บีแทสก์ คอนซัลติ้ง จำกัด
                    </h6>
                    <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0" v-if="trialsPrice > 0">
                      จำนวนเงินหลังใช้ฟรี 7 วัน : {{ formatNumber(trialsPrice) }} บาท
                    </h6>
                    <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0" v-if="trialsPrice > 0">
                      (วันที่ {{ billingTrialsPriceDateFomatShow }} )
                    </h6>
                    <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0" v-if="currentPrice > 0">
                      จำนวนเงินค่าบริการที่เหลือ : {{ formatNumber(currentPrice) }} บาท
                    </h6>
                    <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0" v-if="currentPrice > 0">
                      (วันที่ {{ billingCurrentPriceDateFomatShow }} )
                    </h6>
                    <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0">
                      จำนวนเงินรวม : {{ formatNumber(paymentAmount) }} บาท
                    </h6>
                    <div class="pl-4 pr-4"><v-divider></v-divider></div>
                    <div class="text-center" style="display:flex;" v-if="dialogwidth === '50%'"><v-img
                          style="position: relative;left: -33px;"
                          aspect-ratio="6"
                          contain
                          max-width="200"
                          src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2Fktb.png?alt=media&token=f197ab8f-f502-4136-91a0-8c92f2968ecf"
                        ></v-img><h6 style="position: relative;left: -85px;margin-bottom: 0;">ธนาคารกรุงไทย สาขาประชาอุทิศ  เลขบัญชี 094-0-34082-8</h6></div>
                    <div class="text-center" style="display:flex;padding:20px" v-if="dialogwidth === '50%'"><v-img
                          aspect-ratio="6"
                          contain
                          max-width="200"
                          src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2Fkbank.png?alt=media&token=f492fd39-0b56-4aa4-82d7-730b53167029"
                        ></v-img><h6>ธนาคารกสิกรไทย สาขาศรีวรา ทาวน์อินทาวน์ เลขบัญชี 107-3-15084-8</h6></div>
                        <!-- mobile -->
                    <div class="text-center" style="display:flex;" v-if="dialogwidth !== '50%'"><h6>ธนาคารกรุงไทย สาขาประชาอุทิศ  เลขบัญชี 094-0-34082-8</h6>
                    </div>
                    <div class="text-center" style="display:flex;padding:20px" v-if="dialogwidth !== '50%'"><h6>ธนาคารกสิกรไทย สาขาศรีวรา ทาวน์อินทาวน์ เลขบัญชี 107-3-15084-8</h6>
                    </div>
                    <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-3">
                      ( แนบสลิปการโอนเงินโดยกดที่ปุ่ม อัพโหลดสลิป )
                    </h6>
                    <div class="text-center">
                    <!-- <v-btn
                      class="button pa-2"
                      color="error"
                      dark
                      large
                      @click="dialogQrcode = false"
                      >ปิด</v-btn
                    > -->
                    <v-btn
                      class="button pa-5 mt-3"
                      color="#1B437C"
                      style="font-size:20px"
                      width="250"
                      dark
                      large
                      @click="uploadSlipShow = true"
                      >อัพโหลดสลิป</v-btn
                    >
                  </div>
                  </v-card>
                  <!-- <h6 class="text-center mt-5">กลังจากชำระแล้วกรุณาส่งหลักฐานสลิปโอนเงิน โดยคลิกปุ่มด้านล่าง</h6> -->
                  <div class="text-center">
                    <!-- <v-btn
                      class="button pa-2"
                      color="error"
                      dark
                      large
                      @click="dialogQrcode = false"
                      >ปิด</v-btn
                    > -->
                    <!-- <v-btn
                      class="button pa-5"
                      color="#1B437C"
                      dark
                      large
                      @click="uploadSlipShow = true"
                      >อัพโหลดสลิป</v-btn
                    > -->
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogReConfirm" persistent max-width="600px">
              <v-card>
                <v-card-text>
                  <div class="text-end">
                  <v-btn
                    class="mx-2"
                    fab
                    small
                    dark
                    color="white"
                    style="color:red;font-size:20px;"
                    @click="dialogReConfirm = false, paymentImge = null"
                  >
                   X
                  </v-btn>
                  </div>
                  <h3 class="text-center" style="color:#1B437C;font-weight: bold;">แนบหลักฐานการโอนเงิน</h3>
                  <br>
                  <!-- <h4 class="text-center font-weight-black mb-10" >แนบหลักฐานการโอนเงิน</h4> -->
                  <v-row>
                    <v-col cols="12" class="text-center pa-2 mt-6">
                      <v-img
                        v-if="paymentImge !== null"
                        class="pa-3"
                        contain
                        max-height="100%"
                        max-width="100%"
                        :src="paymentImge"
                      ></v-img>
                      <v-avatar
                        v-else
                        tile
                        color="#FFFFFF"
                        size="180"
                      >
                        <v-img
                        aspect-ratio="6"
                        contain
                        src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FUploadicon.png?alt=media&token=39383860-d16e-49ca-81cb-a3ad888df095"
                        ></v-img>
                      </v-avatar>
                      <v-file-input
                      class="mt-6 mb-6"
                        required
                        counter
                        show-size
                        :rules="[rules.resizeImag]"
                        accept="image/png, image/jpeg, image/bmp"
                        prepend-icon="mdi-paperclip"
                        label="Upload"
                        @change="selectImg"
                        v-model="filesImg"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12" class="text-center pa-2">
                      <v-expansion-panels
                        v-model="panel"
                        multiple
                      >
                        <v-expansion-panel>
                          <v-expansion-panel-header>ช่องทางการชำระเงิน</v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-img
                              height="170"
                              src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FQR-prompt.jpg?alt=media&token=42637b63-af5b-45d9-8900-b866b789819e"
                            ></v-img>
                            <div class="text-center mt-4" v-if="value">
                              <qrcode-vue
                                :value="value"
                                :size="size"
                                level="H"
                                :foreground="foreground"
                              />
                            </div>
                            <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0">
                              บัญชี : บริษัท บีแทสก์ คอนซัลติ้ง จำกัด
                            </h6>
                            <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0" v-if="trialsPrice > 0">
                              จำนวนเงินหลังใช้ฟรี 7 วัน : {{ formatNumber(trialsPrice) }} บาท
                            </h6>
                            <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0" v-if="trialsPrice > 0">
                              (วันที่ {{ billingTrialsPriceDateFomatShow }} )
                            </h6>
                            <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0" v-if="currentPrice > 0">
                              จำนวนเงินค่าบริการที่เหลือ : {{ formatNumber(currentPrice) }} บาท
                            </h6>
                            <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0" v-if="currentPrice > 0">
                              (วันที่ {{ billingCurrentPriceDateFomatShow }} )
                            </h6>
                            <h6 style="color:#1B437C;font-weight: bold;" class="text-center mt-0">
                              จำนวนเงินรวม : {{ formatNumber(paymentAmount) }} บาท
                            </h6>
                            <div class="pl-4 pr-4"><v-divider></v-divider></div>
                            <div class="text-center" style="display:flex;"><v-img
                                  style="position: relative;left: -33px;"
                                  aspect-ratio="6"
                                  contain
                                  max-width="200"
                                  src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2Fktb.png?alt=media&token=f197ab8f-f502-4136-91a0-8c92f2968ecf"
                                ></v-img><h6 style="position: relative;left: -85px;margin-bottom: 0;">ธนาคารกรุงไทย สาขาประชาอุทิศ  เลขบัญชี 094-0-34082-8</h6></div>
                            <div class="text-center" style="display:flex;padding:20px"><v-img
                                  aspect-ratio="6"
                                  contain
                                  max-width="200"
                                  src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-app%2Fkbank.png?alt=media&token=f492fd39-0b56-4aa4-82d7-730b53167029"
                                ></v-img><h6>ธนาคารกสิกรไทย สาขาศรีวรา ทาวน์อินทาวน์ เลขบัญชี 107-3-15084-8</h6></div>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0">
                      <v-text-field
                        prepend-icon="mdi-account"
                        v-model="billingCusName"
                        label="ชื่อ-สกุล"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0">
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
                    <v-col cols="12" class="pt-1 pb-0">
                      <v-text-field
                        prepend-icon="mdi-hail"
                        v-model="billingTax"
                        label="เลขประจำตัวผู้เสียภาษี"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-1 pb-0">
                      <v-textarea
                        prepend-icon="mdi-map-marker"
                        v-model="billingAddress"
                        auto-grow
                        rows="2"
                        label="ที่อยู่"
                        dense
                        outlined
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <div class="text-center mt-5">
                  <v-btn
                    class="button pa-2"
                    color="error"
                    dark
                    large
                    @click="dialogReConfirm = false">ปิด</v-btn>
                    <v-btn
                    class="button pa-2"
                    dark
                    large
                    @click="updateReturn()"
                    >อัพโหลดสลิป</v-btn>
                </div>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row class="no-gutters" v-if="!dataReadyGet">
          <v-col cols="12" class="text-left">
            <waitingAlert></waitingAlert>
          </v-col>
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import moment from 'moment-timezone'
import QrcodeVue from 'qrcode.vue'
import waitingAlert from '../waitingAlert.vue' // เมนู
export default {
  components: {
    'waitingAlert': waitingAlert,
    QrcodeVue
  },
  computed: {
    dialogwidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '70%'
        case 'sm': return '60%'
        case 'md': return '50%'
        case 'lg': return '50%'
        case 'xl': return '50%'
      }
    },
    colsWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '55'
        case 'sm': return '55'
        case 'md': return '55'
        case 'lg': return '60'
        case 'xl': return '80'
      }
    },
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '12'
        case 'sm':
          return '12'
        case 'md':
          return '6'
        case 'lg':
          return '3'
        case 'xl':
          return '6'
      }
      console.log(
        'this.$vuetify.breakpoint.name',
        this.$vuetify.breakpoint.name
      )
    }
  },
  data () {
    return {
      panel: [],
      billingCusName: '',
      billingAddress: '',
      billingTax: '',
      billingPhone: '',
      paymentAmount: '',
      paymentDateMonthYear: '',
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'Billing Plan',
          disabled: false,
          href: '/Core/BillingPlan'
        }
      ],
      rules: {
        numberRules: (value) =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: (value) => value.length <= 10 || 'Max 10 characters',
        IDcardRules: (value) =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: (value) => !!value || 'กรุณากรอก.',
        resizeImag: (value) =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
        counterIDcard: (value) => value.length <= 13 || 'Max 13 characters',
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      value: '',
      size: 200,
      foreground: '#000000',
      dataReadyGet: false,
      dialogCancel: false,
      dialogQrcode: false,
      dialogReConfirm: false,
      dataReadyCancel: true,
      checkCondition: '',
      dataBilling: '',
      billingCustomerId: '',
      dataPackage: [],
      session: this.$session.getAll(),
      pricePackage: 0,
      uploadSlipShow: false,
      paymentImge: null,
      idPayment: '',
      filesImg: null,
      dataPlan: [],
      remarkReturn: '',
      statusBilling: '',
      dataPayment: [],
      countBooking: 0,
      closeFree: false,
      countDateEnd: 0,
      paymentStatus: '',
      sysShopData: [],
      trialsPrice: 0,
      currentPrice: 0,
      billingTrialsPriceDateFomat: '',
      billingCurrentPriceDateFomat: '',
      billingTrialsPriceDateFomatShow: '',
      billingCurrentPriceDateFomatShow: ''
    }
  },
  mounted () {
    if (this.$route.query.shopId) {
      this.$router.push('/Core/Login?type=billing')
    } else {
      this.chkPlan()
    }
  },
  methods: {
    gotoLogin () {
      this.$router.push('/Core/Login')
    },
    async getCheckCountBook () {
      // await axios.get(this.DNS_IP + '/booking_view/getCheckPack?statusBt=wait and confirm&shopId=' + this.$session.getAll().data.shopId + '&dueDate=' + this.format_dateNoDay(new Date())).then(response => {
      await axios.get(this.DNS_IP + '/booking_view/getCheckPack?shopId=' + this.$session.getAll().data.shopId + '&dueDateLastMonth=T').then(response => {
      // await axios.get(this.DNS_IP + '/booking_view/getCheckPack?shopId=' + this.$session.getAll().data.shopId + '&CREATE_DATELastMonth=T').then(response => {
        let rs = response.data
        if (rs.status !== false) {
          this.countBooking = response.data.countJob
        } else {
          this.countBooking = 0
        }
      })
    },
    async chkPlan () {
      this.sysShopData = []
      this.dataBilling = ''
      this.billingCustomerId = ''
      this.dataReadyGet = false
      await axios
        .get(
          this.DNS_IP +
              '/system_shop_Payment/get?shopId=' +
              this.$session.getAll().data.shopId +
              '&paymentDate=' + moment().format('YYYY-MM')
        )
        .then(async (response) => {
          let rs = response.data
          if (rs.status === false) {
            this.paymentStatus = ''
          } else {
            if (rs[0].paymentDate < moment().format('YYYY-MM-DD HH:mm')) {
              this.paymentStatus = ''
            } else {
              this.paymentStatus = rs[0].paymentStatus
              this.sysShopData = rs[0]
            }
          }
        })
      this.dataPackage = []
      await axios
        .get(this.DNS_IP + '/system_shop_package/get?source=BeLinked&typeShop=' + this.$session.getAll().data.typeShop)
        .then(async (responses) => {
          let rsPacket = responses.data
          for (let i = 0; i < rsPacket.length; i++) {
            var d = rsPacket[i]
            var s = {}
            s.id = d.id
            if (d.sortNo === null || d.sortNo === '') {
              s.sortNo = i + 1
            } else {
              s.sortNo = d.sortNo
            }
            s.name = d.name
            s.description = JSON.parse(d.description)
            s.warning = d.warning
            s.close = d.close
            s.source = d.source
            s.pricePackage = d.pricePackage || '0'
            s.rangeRePackage = d.rangeRePackage
            // console.log(s.pricePackage)
            if (s.pricePackage !== '0') {
              if (this.$session.getAll().data.show499 === 'True') {
                this.dataPackage.push(s)
              } else {
                if (s.pricePackage !== '499') {
                  this.dataPackage.push(s)
                }
              }
            }
          }
        //   if (this.dataBilling === 'free') {
        //     this.dataBilling = this.dataPackage.filter((el) => {
        //       return el.pricePackage === '' || el.pricePackage === '0'
        //     })[0].id
        //   }
        })
      //   await axios
      //     .get(this.DNS_IP + '/payment/get?shopId=' + this.$session.getAll().data.shopId)
      //     .then(async responses => {
      //       let rs = responses.data
      //       if (rs.status !== false) {
      //         this.dataPayment = responses.data[0]
      //         this.statusBilling = rs[0].statusPayment || ''
      //         this.remarkReturn = rs[0].remarkReturn || ''
      //         this.idPayment = rs[0].id
      //         const date1 = new Date(this.dataPayment.endDate)
      //         const date2 = new Date()
      //         const diffTime = date1 - date2
      //         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      //         this.countDateEnd = diffDays
      //       } else {
      //         this.dataPayment = []
      //         this.statusBilling = ''
      //         this.remarkReturn = ''
      //         this.idPayment = ''
      //       }
      //       console.log('payment', responses.data)
      //       console.log('this.countDateEnd', this.countDateEnd)
      //     })
      this.dataReadyGet = true
    },
    async showQrCode (item) {
      console.log('endOf', moment().endOf('month').format('DD'))
      console.log('showQrCode', item)
      console.log('trialsVersionDate', this.$session.getAll().data.trialsVersionDate)
      let trialCheck = this.$session.getAll().data.trialsVersionDate || ''
      this.trialsPrice = 0
      this.currentPrice = 0
      this.billingTrialsPriceDateFomat = ''
      this.billingCurrentPriceDateFomat = ''
      this.billingTrialsPriceDateFomatShow = ''
      this.billingCurrentPriceDateFomatShow = ''
      await this.getCheckCountBook()
      let closeJob = parseInt(item.close) * 30
      console.log(closeJob, this.countBooking)
      if (this.countBooking > closeJob) {
        this.$swal('ผิดพลาด', 'เนื่องจากรายการนัดหมายของท่านเกินจำนวนของแพ็คเกจที่ท่านเลือก', 'error')
      } else {
        let lastDayOfMonth = moment().endOf('month').format('DD')
        this.dataPlan = item
        let dateTrials = ''
        let dateTrialsYear = ''
        let dateTrialsMonth = ''
        let dateTrialsDay = ''
        let dateTrialsYearMonth = ''
        if (trialCheck !== '') {
          dateTrials = this.$session.getAll().data.trialsVersionDate.split('-')
          dateTrialsYear = dateTrials[0]
          dateTrialsMonth = dateTrials[1]
          dateTrialsDay = dateTrials[2]
          dateTrialsYearMonth = dateTrialsYear + '-' + dateTrialsMonth
        }
        console.log(dateTrialsYear, dateTrialsMonth, dateTrialsDay)
        await axios
          .get(
            this.DNS_IP +
              '/system_shop_Payment/get?shopId=' +
              this.$session.getAll().data.shopId
          )
          .then(async (response) => {
            let rs = response.data
            if (rs.status === false || rs[0].id === null) {
              if (trialCheck === '') {
                console.log('1')
                if (parseInt(moment().format('DD')) >= 1 && parseInt(moment().format('DD')) <= 7) {
                  this.pricePackage = item.pricePackage || 0
                  this.paymentAmount = item.pricePackage
                } else {
                  console.log('2')
                  this.pricePackage = item.pricePackage || 0
                  this.paymentAmount = item.pricePackage
                  // let dateCalDay = parseInt(lastDayOfMonth) - parseInt(moment().format('DD'))
                  // this.pricePackage = item.pricePackage
                  // this.paymentAmount = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                  // this.trialsPrice = 0
                  // this.currentPrice = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                  // this.billingTrialsPriceDateFomat = ''
                  // this.billingCurrentPriceDateFomat = moment().format('YYYY-MM-DD')
                  // this.billingTrialsPriceDateFomatShow = ''
                  // this.billingCurrentPriceDateFomatShow = moment().format('DD/MM/YYYY')
                }
              } else {
                if (moment().format('YYYY-MM') === dateTrialsYearMonth) {
                  if (parseInt(dateTrialsDay) === 1) {
                    if (parseInt(dateTrialsDay) === parseInt(moment().format('DD'))) {
                      this.pricePackage = item.pricePackage || 0
                      this.paymentAmount = item.pricePackage
                    } else {
                      let dateCalDay = parseInt(lastDayOfMonth) - parseInt(dateTrialsDay)
                      this.pricePackage = item.pricePackage
                      this.paymentAmount = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                      this.trialsPrice = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                      this.currentPrice = 0
                      this.billingTrialsPriceDateFomat = moment().format('YYYY-MM-DD')
                      this.billingCurrentPriceDateFomat = ''
                      this.billingTrialsPriceDateFomatShow = moment().format('DD/MM/YYYY')
                      this.billingCurrentPriceDateFomatShow = ''
                    }
                  } else {
                    console.log('2')
                    let dateCalDay = parseInt(lastDayOfMonth) - parseInt(dateTrialsDay)
                    this.pricePackage = item.pricePackage
                    this.paymentAmount = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                    this.trialsPrice = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                    this.currentPrice = 0
                    this.billingTrialsPriceDateFomat = moment().format('YYYY-MM-DD')
                    this.billingCurrentPriceDateFomat = ''
                    this.billingTrialsPriceDateFomatShow = moment().format('DD/MM/YYYY')
                    this.billingCurrentPriceDateFomatShow = ''
                  }
                } else {
                  console.log('3')
                  let dateCalDay = parseInt(lastDayOfMonth) - parseInt(dateTrialsDay)
                  let dateCalDayCurrent = parseInt(lastDayOfMonth)
                  this.pricePackage = item.pricePackage
                  this.paymentAmount = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth)) + Math.ceil((dateCalDayCurrent * item.pricePackage) / parseInt(lastDayOfMonth))
                  this.trialsPrice = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                  this.currentPrice = Math.ceil((dateCalDayCurrent * item.pricePackage) / parseInt(lastDayOfMonth))
                  this.billingTrialsPriceDateFomat = dateTrialsYear + '-' + dateTrialsMonth + '-' + dateTrialsDay
                  this.billingCurrentPriceDateFomat = moment().format('YYYY-MM-DD')
                  this.billingTrialsPriceDateFomatShow = dateTrialsDay + '/' + dateTrialsMonth + '/' + dateTrialsYear
                  this.billingCurrentPriceDateFomatShow = moment().format('DD/MM/YYYY')
                }
              }
            } else {
              if (rs[0].paymentDateMMYY === moment().format('YYYY-MM')) {
                if (parseInt(moment().format('DD')) >= 1 && parseInt(moment().format('DD')) <= 7) {
                  this.pricePackage = item.pricePackage || 0
                  this.paymentAmount = item.pricePackage
                } else {
                  console.log('2')
                  this.pricePackage = item.pricePackage || 0
                  this.paymentAmount = item.pricePackage
                  // let dateCalDay = parseInt(lastDayOfMonth) - parseInt(moment().format('DD'))
                  // this.pricePackage = item.pricePackage
                  // this.paymentAmount = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                  // this.trialsPrice = 0
                  // this.currentPrice = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                  // this.billingTrialsPriceDateFomat = ''
                  // this.billingCurrentPriceDateFomat = moment().format('YYYY-MM-DD')
                  // this.billingTrialsPriceDateFomatShow = ''
                  // this.billingCurrentPriceDateFomatShow = moment().format('DD/MM/YYYY')
                }
              } else {
                this.pricePackage = item.pricePackage || 0
                this.paymentAmount = item.pricePackage
                // if (parseInt(moment().format('DD')) >= 1 && parseInt(moment().format('DD')) <= 7) {
                //   this.pricePackage = item.pricePackage || 0
                //   this.paymentAmount = item.pricePackage
                // } else {
                //   console.log('2')
                //   let dateCalDay = parseInt(lastDayOfMonth) - parseInt(moment().format('DD'))
                //   this.pricePackage = item.pricePackage
                //   this.paymentAmount = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                //   this.trialsPrice = 0
                //   this.currentPrice = Math.ceil((dateCalDay * item.pricePackage) / parseInt(lastDayOfMonth))
                //   this.billingTrialsPriceDateFomat = ''
                //   this.billingCurrentPriceDateFomat = moment().format('YYYY-MM-DD')
                //   this.billingTrialsPriceDateFomatShow = ''
                //   this.billingCurrentPriceDateFomatShow = moment().format('DD/MM/YYYY')
                // }
              }
            }
          })
        await axios
          .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$session.getAll().data.shopId)
          .then(async (response) => {
            let rs = response.data
            if (rs.status !== false) {
              this.billingCusName = rs[0].billingCusName || ''
              this.billingAddress = rs[0].billingAddress || ''
              this.billingTax = rs[0].billingTax || ''
              this.billingPhone = rs[0].billingPhone || rs[0].contactTel
            } else {
              this.billingCusName = ''
              this.billingAddress = ''
              this.billingTax = ''
              this.billingPhone = ''
            }
          })
        const generatePayload = require('promptpay-qr')
        // const promptpayID = '1529900508673'
        const promptpayID = '0125563009946'
        // const IDCardNumber = '0-0000-00000-00-0'
        const amount = parseFloat(this.paymentAmount)
        this.value = generatePayload(promptpayID, { amount })
        this.dialogQrcode = true
        // }
        // }
      }
    },
    selectImg () {
      if (this.filesImg) {
        this.paymentImge = URL.createObjectURL(this.filesImg)
      } else {
        this.paymentImge = ''
      }
      // console.log(event)
    },
    formatNumber (value) {
      if (value && value !== 0) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return 0
      }
    },
    billingPlan (item) {
      if (this.paymentImge === null || this.paymentImge === '') {
        this.$swal('ผิดพลาด', 'กรุณาอัพโหลดหลักฐานการโอนเงิน', 'error')
      } else {
        if (this.billingCusName !== '' && this.billingAddress !== '' && this.billingTax !== '' && this.billingPhone !== '') {
          this.$swal({
            title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#b3b1ab',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          })
            .then(async (result) => {
              if (this.filesImg) {
                const _this = this
                let params = new FormData()
                params.append('file', this.filesImg)
                await axios
                  .post(this.DNS_IP + `/file/upload/shopPayment`, params)
                  .then(function (response) {
                    _this.paymentImge = response.data
                    console.log('url Pic', response.data)
                  })
              } else {
                this.paymentImge = null
              }
              if (this.paymentImge) {
                let url = this.DNS_IP + '/system_shop_Payment/add'
                let dt = {
                  packetId: item.id,
                  paymentImage: this.paymentImge,
                  paymentStatus: 'confirm',
                  paymentAmount: this.paymentAmount,
                  shopId: this.$session.getAll().data.shopId,
                  CREATE_USER: this.$session.getAll().data.userName,
                  LAST_USER: this.$session.getAll().data.userName
                }
                // }
                await axios.post(url, dt).then(async (response) => {
                  if (response.status) {
                    this.updateShopActive('active', item.id)
                    this.$swal('สำเร็จ', 'อัพโหลดสลิปสำเร็จ', 'success')
                    let dtMgs = {
                      shopId: this.$session.getAll().data.shopId,
                      NotifyImg: this.paymentImge,
                      shopName: this.$session.getAll().data.shopName,
                      contactTel: this.$session.getAll().data.contactTel,
                      contactEmail: this.$session.getAll().data.contactEmail,
                      btNumber: this.$session.getAll().data.btNumber,
                      billingCusName: this.billingCusName,
                      billingAddress: this.billingAddress,
                      billingTax: this.billingTax,
                      billingPhone: this.billingPhone,
                      paymentAmount: this.paymentAmount,
                      pricePackage: this.pricePackage,
                      trialsPrice: this.trialsPrice,
                      currentPrice: this.currentPrice,
                      billingTrialsPriceDateFomat: this.billingTrialsPriceDateFomat,
                      billingCurrentPriceDateFomat: this.billingCurrentPriceDateFomat,
                      paymentDateMonthYear: moment().format('MM/YYYY'),
                      statusNoti: 'New'
                    }
                    await axios
                      .post(this.DNS_IP + '/line/notiAccount', dtMgs)
                      .then(response => {
                      })
                  } else {
                    this.$swal('ผิดพลาด', 'กรุณาทำรายการอีกครั้ง', 'error')
                  }
                  setTimeout(() => this.chkPlan(), 500)
                  this.dialogQrcode = false
                })
              } else {
                this.$swal('ผิดพลาด', 'กรุณาอัพเดทรูปภาพ', 'error')
              }
            })
            .catch((error) => {
              console.log('Cencel : ', error)
            })
        } else {
          this.$swal('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ', 'error')
        }
      }
    },
    async setData (item) {
      console.log('setData', item)
      this.paymentImge = item.paymentImage || null
      this.dialogReConfirm = true
      this.idPayment = item.id
      this.paymentAmount = item.billingTrialsPrice + item.billingCurrentPrice
      this.paymentDateMonthYear = item.paymentDateMonthYear
      this.trialsPrice = item.billingTrialsPrice
      this.currentPrice = item.billingCurrentPrice
      this.billingTrialsPriceDateFomat = item.billingTrialsPriceDateFomat
      this.billingCurrentPriceDateFomat = item.billingCurrentPriceDateFomat
      const generatePayload = require('promptpay-qr')
      // const promptpayID = '1529900508673'
      const promptpayID = '0125563009946'
      // const IDCardNumber = '0-0000-00000-00-0'
      const amount = parseFloat(item.paymentAmount)
      this.value = generatePayload(promptpayID, { amount })
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$session.getAll().data.shopId)
        .then(async (response) => {
          let rs = response.data
          if (rs.status !== false) {
            this.billingCusName = rs[0].billingCusName || ''
            this.billingAddress = rs[0].billingAddress || ''
            this.billingTax = rs[0].billingTax || ''
            this.billingPhone = rs[0].billingPhone || rs[0].contactTel
          } else {
            this.billingCusName = ''
            this.billingAddress = ''
            this.billingTax = ''
            this.billingPhone = ''
          }
        })
    },
    async updateReturn () {
      if (this.billingCusName !== '' && this.billingAddress !== '' && this.billingTax !== '' && this.billingPhone !== '') {
        if (this.filesImg) {
          const _this = this
          let params = new FormData()
          params.append('file', this.filesImg)
          await axios
            .post(this.DNS_IP + `/file/upload/shopPayment`, params)
            .then(function (response) {
              _this.paymentImge = response.data
              console.log('url Pic', response.data)
            })
        }
        if (this.paymentImge) {
          var dt = {
            LAST_USER: this.$session.getAll().data.userName,
            paymentImage: this.paymentImge,
            paymentStatus: 'confirm'
          }
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/system_shop_Payment/edit/" + this.idPayment,
              dt
            )
            .then(async response => {
              this.updateShopActive('active')
              let dtMgs = {
                shopId: this.$session.getAll().data.shopId,
                NotifyImg: this.paymentImge,
                shopName: this.$session.getAll().data.shopName,
                contactTel: this.$session.getAll().data.contactTel,
                contactEmail: this.$session.getAll().data.contactEmail,
                billingCusName: this.billingCusName,
                billingAddress: this.billingAddress,
                billingTax: this.billingTax,
                billingPhone: this.billingPhone,
                paymentAmount: this.paymentAmount,
                pricePackage: this.pricePackage,
                trialsPrice: this.trialsPrice,
                currentPrice: this.currentPrice,
                billingTrialsPriceDateFomat: this.billingTrialsPriceDateFomat,
                billingCurrentPriceDateFomat: this.billingCurrentPriceDateFomat,
                paymentDateMonthYear: this.paymentDateMonthYear,
                statusNoti: 'Update'
              }
              await axios
                .post(this.DNS_IP + '/line/notiAccount', dtMgs)
                .then(response => {
                })
              this.$swal('เรียบร้อย', 'อัพสถานะเรียบร้อย', 'success')
              this.dialogReConfirm = false
              setTimeout(() => this.chkPlan(), 500)
            })
        } else {
          this.$swal('ผิดพลาด', 'กรุณาอัพเดทรูปภาพ', 'error')
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ', 'error')
      }
    },
    async updateShopActive (text, packetId) {
      var ds = {}
      if (packetId) {
        let billingTrialsPriceDateFomat = this.billingTrialsPriceDateFomat === '' ? null : this.billingTrialsPriceDateFomat
        let billingCurrentPriceDateFomat = this.billingCurrentPriceDateFomat === '' ? null : this.billingCurrentPriceDateFomat
        ds = {
          shopActive: text,
          billingCusName: this.billingCusName,
          billingAddress: this.billingAddress,
          billingTax: this.billingTax,
          billingPhone: this.billingPhone,
          billingPlan: packetId,
          billingTrialsPrice: this.trialsPrice,
          billingCurrentPrice: this.currentPrice,
          billingTrialsPriceDate: billingTrialsPriceDateFomat,
          billingCurrentPriceDate: billingCurrentPriceDateFomat,
          LAST_USER: this.$session.getAll().data.userName
        }
      } else {
        ds = {
          shopActive: text,
          billingCusName: this.billingCusName,
          billingAddress: this.billingAddress,
          billingTax: this.billingTax,
          billingPhone: this.billingPhone,
          LAST_USER: this.$session.getAll().data.userName
        }
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/sys_shop/edit/" + this.$session.getAll().data.shopId,
          ds
        )
        .then(async (response) => {
        })
    },
    // async updateReturn () {
    //   if (this.filesImg) {
    //     const _this = this
    //     let params = new FormData()
    //     params.append('file', this.filesImg)
    //     await axios
    //       .post(this.DNS_IP + `/file/upload/billing`, params)
    //       .then(function (response) {
    //         _this.paymentImge = response.data
    //         console.log('url Pic', response.data)
    //       })
    //   } else {
    //     this.paymentImge = this.filesImg
    //   }
    //   var dt = {
    //     LAST_USER: this.$session.getAll().data.userName,
    //     img: this.paymentImge,
    //     statusPayment: 'wait'
    //   }
    //   await axios
    //     .post(
    //       // eslint-disable-next-line quotes
    //       this.DNS_IP + "/payment/edit/" + this.idPayment,
    //       dt
    //     )
    //     .then(async response => {
    //       let dtMgs = {
    //         paymentImge: this.paymentImge,
    //         paymentCode: this.dataPayment.paymentCode,
    //         packetId: this.dataBilling,
    //         shopName: this.$session.getAll().data.shopName,
    //         contactTel: this.$session.getAll().data.contactTel,
    //         type: 'Update'
    //       }
    //       await axios
    //         .post(this.DNS_IP + '/SendMessage/pushMsgLineNotifyGroup', dtMgs)
    //         .then(response => {
    //         })
    //       this.$swal('เรียบร้อย', 'อัพสถานะเรียบร้อย', 'success')
    //       this.dialogReConfirm = false
    //       setTimeout(() => this.chkPlan(), 500)
    //     })
    // },
    async updatePlan (billingPlan) {
      this.dataReadyCancel = false
      var ds = {
        billingPlan: billingPlan,
        LAST_USER: this.$session.getAll().data.userName,
        billingCustomerId: '',
        billingCustomerCardId: '',
        billingScheduleId: '',
        billingCustomerData: ''
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/sys_shop/edit/" + this.$session.getAll().data.shopId,
          ds
        )
        .then(async (response) => {
        })
    },
    async cancelPlan () {
      this.dataReadyCancel = false
      var ds = {
        billingPlan: 'free',
        LAST_USER: this.$session.getAll().data.userName,
        billingCustomerId: '',
        billingCustomerCardId: '',
        billingScheduleId: '',
        billingCustomerData: ''
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/sys_shop/edit/" + this.$session.getAll().data.shopId,
          ds
        )
        .then(async (response) => {
          await this.updateBetaskDB(ds, this.$session.getAll().data.shopId)
          setTimeout(() => this.chkPlan(), 500)
          this.$swal(
            'เรียบร้อย',
            'คุณได้อัพเดทเป็นสมาชิกสายฟรีแล้ว',
            'success'
          )
          this.checkCondition = 'ไม่ยอมรับ'
          this.dialogCancel = false
          this.dataReadyCancel = true
        })
    }
  }
}
</script>
<style lang="css" scoped>
.plan_button {
  padding-bottom: 10px;
}
.feature_detail {
  color: #ddd !important;
}
.listChin {
  background-color: white !important;
}
#img_bt {
  width: 50px;
  height: 50px;
}
</style>
