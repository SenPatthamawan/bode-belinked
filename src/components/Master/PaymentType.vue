<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left pb-0">
            <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
          </v-col>
          <v-col cols="6" class="v-margit_button text-right pb-0">
            <v-btn color="primary" depressed @click="dialogAdd = true, validate('ADD')">
              <v-icon left>mdi-text-box-plus</v-icon>
              เพิ่มช่องทางการชำระเงิน
            </v-btn>
          </v-col>
          <v-col cols="12" style="display:flex;justify-content: end;" v-if="checkAddStripe">
            <!-- <v-btn color="primary" outlined depressed @click="dialogAddStripe = true, validate('ADDStripe')">
              <v-icon dark size="30" class="iconify" data-icon="logos:stripe"></v-icon>
            </v-btn> -->
            <v-card @click="dialogAddStripe = true, validate('ADDStripe')" style="border-radius: 5px;border: solid #1d00ff4a;;margin-right: 5px;">
              <v-img contain width="100px" :src="require('@/assets/stripe.png')" alt="Image" />
            </v-card>
            <v-card @click="dialogAddOmise = true, valuePayment = [], validate('ADDStripe')" style="border-radius: 5px;border: solid #1d00ff4a;;display: flex;">
              <v-img width="100px" :src="require('@/assets/omise-logo.jpg')" alt="Image" />
            </v-card>
          </v-col>
          <!-- <v-col cols="6" class="v-margit_button text-right pt-0" v-if="checkAddStripe">
            <v-btn color="primary" outlined depressed @click="dialogAddStripe = true, validate('ADDStripe')">
              <v-icon dark size="30" class="iconify" data-icon="logos:stripe"></v-icon>
            </v-btn>
          </v-col> -->
        </v-row>
        <v-row>
          <!-- ADD STRIPE -->
          <v-dialog v-model="dialogAddOmise" persistent max-width="550px">
            <v-card>
              <v-form ref="form_addStripe" v-model="validAddStripe" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="8" class="text-left pt-10">
                    <h3><strong>เพิ่มช่องทางการชำระเงิน</strong></h3>
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
                        @click="(dialogAddOmise = false), clearDataStripe()"
                        >
                        X
                        </v-btn>
                    </div>
                    </v-col>
                </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-select
                        class="pa-0"
                        v-model="formAddStripe.masBranchID"
                        :items="branchItem"
                        label="สาขา"
                        outlined
                        required
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                    <!-- <v-col cols="12" class="pb-0 pt-0" v-if="formAddStripe.masBranchID !== ''">
                      <v-btn
                        elevation="2"
                        block
                        dark
                        color="teal"
                        @click.stop="FunCopyQrcode({masBranchID: formAddStripe.masBranchID, shopId: $session.getAll().data.shopId})"
                      >
                        <v-icon left>mdi-content-copy</v-icon>
                        คัดลอกลิงค์ Webhook
                      </v-btn>
                    </v-col> -->
                    <v-col cols="12" class="pb-0 pt-0">
                      <v-btn
                        elevation="2"
                        block
                        dark
                        color="teal"
                        @click.stop="FunCopyWebhookOmise()"
                      >
                        <v-icon left>mdi-content-copy</v-icon>
                        คัดลอกลิงค์ Webhook
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formAddStripe.apiKey"
                        label="Public key"
                        outlined
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formAddStripe.endpointSecret"
                        label="Secret key"
                        outlined
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="12"
                      md="12"
                    >
                    <h3><strong>ตั้งค่ารูปแบบการจ่ายเงิน</strong></h3>
                          <v-checkbox
                              v-model="valuePayment"
                              color="primary"
                              value="credit_card"
                              hide-details
                              style="border-bottom: solid rgb(195, 195, 195);"
                          >
                            <template v-slot:label>
                              <v-avatar tile>
                                <v-img
                                contain
                                width="50px"
                                :src="require('@/assets/depositphotos_475718890-stock-illustration-credit-card-icon-monochrome-simple.jpg')"
                                />
                            </v-avatar>
                            <div class="optionpayment" >
                              <div class="ml-2">
                                บัตรเครดิต, บัตรเดบิต และผ่อนชำระ
                              </div>
                            </div>
                          </template>
                        </v-checkbox>
                        <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="mobile_banking_bay"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              height="32px"
                              :src="require('@/assets/iaor_logo.gif')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Mobile banking BAY
                            </div>
                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="mobile_banking_ktb"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              height="32px"
                              :src="require('@/assets/Krung_Thai_Bank_logo.svg.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Mobile banking KTB
                            </div>
                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="mobile_banking_bbl"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              height="32px"
                              :src="require('@/assets/download (1).png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Mobile banking BBL
                            </div>
                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="mobile_banking_kbank"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              height="32px"
                              :src="require('@/assets/unnamed (1).png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Mobile banking KBANK
                            </div>
                          </div>
                        </template>
                      </v-checkbox>
                        <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="truemoney"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              :src="require('@/assets/logo-truemoneywallet-300x300-1.jpg')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              TrueMoney Wallet
                            </div>
                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="alipay"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              width="50px"
                              :src="require('@/assets/download.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div class="ml-2">
                              Alipay
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="googlepay"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              :src="require('@/assets/GooglePay_Lockup.max-1000x1000.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Google Pay
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="red"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              :src="require('@/assets/C0A0EA0-A4AC4F1-E0FBF72.jpg')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div class="ml-2">
                              Pay with Points
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="points_citi"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              :src="require('@/assets/wechat-pay-for-overseas-b.jpg')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              WeChat Pay
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="internet_banking"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              :src="require('@/assets/internet-banking-vector-icon.jpg')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Internet banking (BBL, BAY)
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="bill_payment_tesco_lotus"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              :src="require('@/assets/logo Lotus.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Bill payment
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="rabbit_linepay"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              :src="require('@/assets/linepay-logo-th.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Rabbit LINE Pay
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-container fluid>
                      <v-text-field
                        label="omise vat"
                        v-model="formAddStripe.payVatExclude"
                        required
                        :rules="depositPercentrules"
                        outlined
                        suffix="%"
                        dense
                        v-bind:options="optionsPercent" />
                    </v-container>
                  </v-row>
                  <v-row>
                    <v-container fluid>
                      <v-textarea
                        outlined
                        label="ประเภทการชำระเงิน"
                         rows="3" row-height="25"
                         :rules="[rules.required]"
                        v-model="formAddStripe.payTypeName"
                      ></v-textarea>
                    </v-container>
                  </v-row>
                </v-container>
              </v-card-text>
              </v-form>

                <center>
                  <v-col class="text-center pt-0">
                <v-btn
                  elevation="2"
                  block
                  dark
                  large
                  :disabled="!validAddStripe"
                  color="#1B437C"
                  @click="addDataStripe('omise')"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึก
                </v-btn>
                  </v-col>
                </center>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogAddStripe" persistent max-width="550px">
            <v-card>
              <v-form ref="form_addStripe" v-model="validAddStripe" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="8" class="text-left pt-10">
                    <h3><strong>เพิ่มช่องทางการชำระเงิน</strong></h3>
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
                        @click="(dialogAddStripe = false), clearDataStripe()"
                        >
                        X
                        </v-btn>
                    </div>
                    </v-col>
                </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-select
                        class="pa-0"
                        v-model="formAddStripe.masBranchID"
                        :items="branchItem"
                        label="สาขา"
                        outlined
                        required
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" class="pb-0 pt-0" v-if="formAddStripe.masBranchID !== ''">
                      <v-btn
                        elevation="2"
                        block
                        dark
                        color="teal"
                        @click.stop="FunCopyQrcode({masBranchID: formAddStripe.masBranchID, shopId: $session.getAll().data.shopId})"
                      >
                        <v-icon left>mdi-content-copy</v-icon>
                        คัดลอกลิงค์ Webhook
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formAddStripe.apiKey"
                        label="Api Key"
                        outlined
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formAddStripe.endpointSecret"
                        label="Endpoint Secret"
                        outlined
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-container fluid>
                      <v-text-field
                        label="stripe vat"
                        v-model="formAddStripe.payVatExclude"
                        required
                        :rules="depositPercentrules"
                        outlined
                        suffix="%"
                        dense
                        v-bind:options="optionsPercent" />
                    </v-container>
                  </v-row>
                  <v-row>
                    <v-container fluid>
                      <v-textarea
                        outlined
                        label="ประเภทการชำระเงิน"
                         rows="3" row-height="25"
                         :rules="[rules.required]"
                        v-model="formAddStripe.payTypeName"
                      ></v-textarea>
                    </v-container>
                  </v-row>
                </v-container>
              </v-card-text>
              </v-form>

                <center>
                  <v-col class="text-center pt-0">
                <v-btn
                  elevation="2"
                  block
                  dark
                  large
                  :disabled="!validAddStripe"
                  color="#1B437C"
                  @click="addDataStripe()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึก
                </v-btn>
                  </v-col>
                </center>
            </v-card>
          </v-dialog>
          <!-- end add -->

          <!-- Edit STRIPE -->
          <v-dialog v-model="dialogEditOmise" persistent max-width="550px">
            <v-card>
              <v-form ref="form_addStripe" v-model="validAddStripe" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="8" class="text-left pt-10">
                    <h3><strong>แก้ไขช่องทางการชำระเงิน</strong></h3>
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
                        @click="(dialogEditOmise = false), clearDataStripe()"
                        >
                        X
                        </v-btn>
                    </div>
                    </v-col>
                </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-select
                        class="pa-0"
                        v-model="formAddStripe.masBranchID"
                        :items="branchItem"
                        label="สาขา"
                        outlined
                        required
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formAddStripe.apiKey"
                        label="Public key"
                        outlined
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formAddStripe.endpointSecret"
                        label="Secret key"
                        outlined
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="12"
                      md="12"
                    >
                    <h3><strong>แก้ไขรูปแบบการจ่ายเงิน</strong></h3>
                          <v-checkbox
                              v-model="valuePayment"
                              color="primary"
                              value="credit_card"
                              hide-details
                              style="border-bottom: solid rgb(195, 195, 195);"
                          >
                            <template v-slot:label>
                              <v-avatar tile>
                                <v-img
                                contain
                                width="50px"
                                :src="require('@/assets/depositphotos_475718890-stock-illustration-credit-card-icon-monochrome-simple.jpg')"
                                />
                            </v-avatar>
                            <div class="optionpayment" >
                              <div class="ml-2">
                                บัตรเครดิต, บัตรเดบิต และผ่อนชำระ
                              </div>
                            </div>
                          </template>
                        </v-checkbox>
                        <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="mobile_banking_bay"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              height="32px"
                              :src="require('@/assets/iaor_logo.gif')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Mobile banking BAY
                            </div>
                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="mobile_banking_ktb"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              height="32px"
                              :src="require('@/assets/Krung_Thai_Bank_logo.svg.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Mobile banking KTB
                            </div>
                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="mobile_banking_bbl"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              height="32px"
                              :src="require('@/assets/download (1).png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Mobile banking BBL
                            </div>
                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="mobile_banking_kbank"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              height="32px"
                              :src="require('@/assets/unnamed (1).png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Mobile banking KBANK
                            </div>
                          </div>
                        </template>
                      </v-checkbox>
                        <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="truemoney"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              :src="require('@/assets/logo-truemoneywallet-300x300-1.jpg')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              TrueMoney Wallet
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="alipay"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              width="50px"
                              :src="require('@/assets/download.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div class="ml-2">
                              Alipay
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="googlepay"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              :src="require('@/assets/GooglePay_Lockup.max-1000x1000.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Google Pay
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="red"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              :src="require('@/assets/C0A0EA0-A4AC4F1-E0FBF72.jpg')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div class="ml-2">
                              Pay with Points
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="points_citi"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              :src="require('@/assets/wechat-pay-for-overseas-b.jpg')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              WeChat Pay
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="internet_banking"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              :src="require('@/assets/internet-banking-vector-icon.jpg')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Internet banking (BBL, BAY)
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="bill_payment_tesco_lotus"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              :src="require('@/assets/logo Lotus.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Bill payment
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          value="rabbit_linepay"
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              :src="require('@/assets/linepay-logo-th.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Rabbit LINE Pay
                            </div>

                          </div>
                        </template>
                      </v-checkbox>
                      <!-- <v-checkbox
                          v-model="valuePayment"
                          color="primary"
                          :value=mobileBanking
                          hide-details
                          style="border-bottom: solid rgb(195, 195, 195);"
                        >
                          <template v-slot:label>
                            <v-avatar tile>
                              <v-img
                              contain
                              :src="require('@/assets/linepay-logo-th.png')"
                              />
                          </v-avatar>
                          <div class="optionpayment" >
                            <div>
                              Mobile banking
                            </div>
                          </div>
                        </template>
                      </v-checkbox> -->
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-container fluid>
                      <v-text-field
                        label="omise vat"
                        v-model="formAddStripe.payVatExclude"
                        required
                        :rules="depositPercentrules"
                        outlined
                        suffix="%"
                        dense
                        v-bind:options="optionsPercent" />
                    </v-container>
                  </v-row>
                  <v-row>
                    <v-container fluid>
                      <v-textarea
                        outlined
                        label="ประเภทการชำระเงิน"
                         rows="3" row-height="25"
                         :rules="[rules.required]"
                        v-model="formAddStripe.payTypeName"
                      ></v-textarea>
                    </v-container>
                  </v-row>
                </v-container>
              </v-card-text>
              </v-form>

                <center>
                  <v-col class="text-center pt-0">
                <v-btn
                  elevation="2"
                  block
                  dark
                  large
                  :disabled="!validAddStripe"
                  color="#1B437C"
                  @click="editDataStripe('omise')"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึก
                </v-btn>
                  </v-col>
                </center>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogEditStripe" persistent max-width="550px">
            <v-card>
              <v-form ref="form_addStripe" v-model="validAddStripe" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="8" class="text-left pt-10">
                    <h3><strong>เพิ่มช่องทางการชำระเงิน</strong></h3>
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
                        @click="(dialogEditStripe = false), clearDataStripe()"
                        >
                        X
                        </v-btn>
                    </div>
                    </v-col>
                </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-select
                        class="pa-0"
                        v-model="formAddStripe.masBranchID"
                        :items="branchItem"
                        label="สาขา"
                        outlined
                        required
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formAddStripe.apiKey"
                        label="Api Key"
                        outlined
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formAddStripe.endpointSecret"
                        label="Endpoint Secret"
                        outlined
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-container fluid>
                      <v-text-field
                        label="stripe vat"
                        v-model="formAddStripe.payVatExclude"
                        required
                        :rules="depositPercentrules"
                        outlined
                        suffix="%"
                        dense
                        v-bind:options="optionsPercent" />
                    </v-container>
                  </v-row>
                  <v-row>
                    <v-container fluid>
                      <v-textarea
                        outlined
                        label="ประเภทการชำระเงิน"
                         rows="3" row-height="25"
                         :rules="[rules.required]"
                        v-model="formAddStripe.payTypeName"
                      ></v-textarea>
                    </v-container>
                  </v-row>
                </v-container>
              </v-card-text>
              </v-form>

                <center>
                  <v-col class="text-center pt-0">
                <v-btn
                  elevation="2"
                  block
                  dark
                  large
                  :disabled="!validAddStripe"
                  color="#1B437C"
                  @click="editDataStripe()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  แก้ไขข้อมูล
                </v-btn>
                  </v-col>
                </center>
            </v-card>
          </v-dialog>
          <!-- end add -->

          <!-- ADD -->
          <v-dialog v-model="dialogAdd" persistent max-width="550px">
            <v-card>
              <v-form ref="form_add" v-model="validAdd" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="8" class="text-left pt-10">
                    <h3><strong>เพิ่มช่องทางการชำระเงิน</strong></h3>
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
                        :rules="[rules.resizeImag]"
                        accept="image/png, image/jpeg, image/bmp"
                        prepend-icon="mdi-camera"
                        label="อัพโหลดรูป"
                        @change="selectImgAdd"
                        v-model="filesAdd"
                      ></v-file-input>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-select
                        class="pa-0"
                        v-model="formAdd.masBranchID"
                        :items="branchItem"
                        label="สาขา"
                        outlined
                        required
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        class="pa-0"
                        v-model="formAdd.payAccountNo"
                        label="เลขบัญชี"
                        outlined
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-container fluid>
                      <v-textarea
                        outlined
                        label="ประเภทการชำระเงิน"
                         rows="3" row-height="25"
                         :rules="[rules.required]"
                        v-model="formAdd.payTypeName"
                      ></v-textarea>
                    </v-container>
                  </v-row>
                </v-container>
              </v-card-text>
              </v-form>

                <center>
                  <v-col class="text-center pt-0">
                <v-btn
                  elevation="2"
                  block
                  dark
                  large
                  :disabled="!validAdd"
                  color="#1B437C"
                  @click="addData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึก
                </v-btn>
                  </v-col>
                </center>
            </v-card>
          </v-dialog>
          <!-- end add -->

          <!-- edit -->
          <v-dialog v-model="dialogEdit" persistent max-width="550px">
            <v-card>
              <v-form ref="form_add" v-model="validAdd" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="10" class="text-left pt-10">
                    <h3><strong>แก้ไขช่องทางการชำระเงิน</strong></h3>
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
                        @click="(dialogEdit = false), clearData()"
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
                      <!-- <v-avatar size="100px"><img alt="Avatar" :src="formUpdate.pictureUrl"></v-avatar> -->
                      <br />
                      <v-file-input
                         required
                        counter
                        show-size
                        :rules="[rules.resizeImag]"
                        accept="image/png, image/jpeg, image/bmp"
                        prepend-icon="mdi-camera"
                        label="Image"
                        @change="selectImgUpdate"
                        v-model="filesUpdate"
                      ></v-file-input>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-select
                        class="pa-0"
                        v-model="formUpdate.masBranchID"
                        :items="branchItem"
                        label="สาขา"
                        outlined
                        required
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        class="pa-0"
                        v-model="formUpdate.payAccountNo"
                        label="เลขบัญชี"
                        outlined
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-container fluid>
                      <v-textarea
                        outlined
                        label="ประเภทการชำระเงิน"
                         rows="3" row-height="25"
                         :rules="[rules.required]"
                        v-model="formUpdate.payTypeName"
                      ></v-textarea>
                    </v-container>
                  </v-row>
                </v-container>
              </v-card-text>
              </v-form>

                <center>
                  <v-col class="text-center pt-0">
                <v-btn
                  elevation="2"
                  block
                  large
                  dark
                  :disabled="!validAdd"
                  color="#1B437C"
                  @click="editData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึก
                </v-btn>
                  </v-col>
                </center>
            </v-card>
          </v-dialog>
          <!-- end edit -->

          <!-- delete -->
          <v-dialog v-model="dialogDelete" max-width="450px">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="10" class="text-left pt-10">
                    <h3><strong>ลบข้อมูลนี้</strong></h3>
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
                        @click="dialogDelete = false"
                        >
                        X
                        </v-btn>
                    </div>
                    </v-col>
                </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-row style="height: 35px">
                        <v-subheader>ประเภทการชำระเงิน</v-subheader>
                      </v-row>
                      <v-row style="height: 70px">
                        <v-container fluid>
                      <v-textarea
                         rows="3" row-height="25"
                        v-model="formUpdate.payTypeName"
                      ></v-textarea>
                    </v-container>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <br>
              <br>
              <br>
              <v-col class="text-center">
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  elevation="2"
                  large
                  block
                  color="#1B437C"
                  @click="deleteData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  ลบ
                </v-btn>
              </v-col>
            </v-card>
          </v-dialog>
          <!-- end delete -->

          <!-- data table -->
          <v-col cols="6">
            <v-select
              :items="branch"
              v-model="masBranchID"
              dense
              outlined
              hide-details
              filled
              label="สาขา"
              prepend-inner-icon="mdi-map-marker"
              class="ma-2"
              @change="selectBranch()"
            ></v-select>
          </v-col>
         <v-col cols="12">
            <v-card elevation="7" v-if="dataReady && statusFilterBranch">
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
                  <template v-slot:[`item.payTypeImage`]="{ item }">
                    <v-avatar color="primary" size="40" v-if="item.payType === 'payment'">
                      <img :src="item.payTypeImage" alt="img"
                    /></v-avatar>
                    <v-avatar color="white" size="70" v-else-if="item.payType === 'omise'">
                      <v-img height="80" contain :src="require('@/assets/omise-logo.jpg')" alt="img"
                    /></v-avatar>
                    <!-- <v-img :src="require('@/assets/omise-logo.jpg')">
                    </v-img> -->
                    <v-icon
                      v-else
                      small
                      color="green darken-2"
                      class="iconify" data-icon="logos:stripe"
                    >
                    </v-icon>
                  </template>
                   <template v-slot:[`item.CREATE_DATE`]="{ item }">
                      {{ format_date(item.CREATE_DATE) }}
                  </template>
                   <template v-slot:[`item.LAST_DATE`]="{ item }">
                      {{ format_date(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      v-if="item.payType === 'stripe'"
                      color="teal"
                      fab
                      small
                      dark
                      @click.stop="FunCopyQrcode(item)"
                    >
                      <v-icon> mdi-content-copy </v-icon>
                    </v-btn>
                    <v-btn
                      v-if="item.payType === 'omise'"
                      color="teal"
                      fab
                      small
                      dark
                      @click.stop="FunCopyWebhookOmise()"
                    >
                      <v-icon> mdi-content-copy </v-icon>
                    </v-btn>
                    <v-btn
                      v-if="item.payType === 'payment'"
                      color="question"
                      fab
                      small
                      dark
                      @click.stop="(dialogEdit = true), getDataById(item)"
                    >
                      <v-icon> mdi-tools </v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      color="question"
                      fab
                      small
                      dark
                      @click.stop="(item.payType === 'omise' ? dialogEditOmise = true : dialogEditStripe = true), getDataByIdStripe(item)"
                    >
                      <v-icon> mdi-tools </v-icon>
                    </v-btn>
                    <v-btn
                      color="primary"
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
// import moment from 'moment' // แปลง date

export default {
  components: {
    waitingAlert,
    'left-menu-admin': adminLeftMenu,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  data () {
    return {
      valuePayment: [],
      formAddStripe: {
        payTypeId: '',
        apiKey: '',
        endpointSecret: '',
        masBranchID: 'All',
        CREATE_USER: '',
        LAST_USER: '',
        payType: '',
        payTypeCode: '',
        payTypeName: '',
        payMentSelect: '',
        payVatExclude: 0,
        shopId: this.$session.getAll().data.shopId
      },
      checkAddStripe: true,
      dialogAddStripe: false,
      dialogAddOmise: false,
      dialogEditStripe: false,
      dialogEditOmise: false,
      PK: '',
      path: '/master_payment/', // Path Model
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'ช่องทางการชำระเงิน',
          disabled: false,
          href: '/Master/PaymentType'
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
      code: 'PAY_', // Generate Code
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
      branchItem: [],
      formAdd: {
        payTypeCode: '',
        payTypeName: '',
        shopId: this.$session.getAll().data.shopId,
        pictureUrlPreview: '',
        payTypeImage: '',
        masBranchID: 'All',
        payAccountNo: null
      },
      formUpdate: {
        payTypeCode: '',
        payTypeName: '',
        pictureUrlPreview: '',
        payTypeImage: '',
        masBranchID: 'All',
        payAccountNo: null
      },
      formUpdateItem: {
        payTypeCode: '',
        payTypeName: '',
        payTypeImage: '',
        masBranchID: 'All',
        payAccountNo: null
      },
      optionsPercent: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 2
      },
      depositPercentrules: [
        (value) => !!value.toString().trim() || 'กรุณากรอกข้อมูล',
        (value) => (value >= 0 && value <= 100) || 'กรุณากรอกค่าระหว่าง 0 ถึง 100'
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
      // End Form Config ADD EDIT
      // Data Table Config
      columns: [
        { text: 'รูปภาพ', value: 'payTypeImage' },
        { text: 'ประเภท', value: 'payType' },
        { text: 'สาขา', value: 'masBranchName' },
        { text: 'ประเภทการชำระเงิน', value: 'payTypeName' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        { text: 'ผู้สร้าง', value: 'CREATE_USER' },
        { text: 'Action', value: 'action', sortable: false, align: 'center' }
      ],
      dataItem: [],
      // End Data Table Config
      json_meta: [
        [
          {
            key: 'charset',
            value: 'utf-8'
          }
        ]
      ],
      filesAdd: null,
      filesUpdate: null,
      validAddStripe: true,
      validAdd: true,
      validUpdate: true,
      branch: [],
      DataBranchAll: [],
      masBranchID: '',
      statusFilterBranch: false
    }
  },
  async mounted () {
    // this.getGetToken(this.DNS_IP)
    await this.fiterBranch()
  },
  methods: {
    FunCopyWebhookOmise () {
      // var copyText = document.getElementById('myInput')
      // copyText.select()
      // copyText.setSelectionRange(0, 99999)
      let linked = 'https://api-belinked.betaskthai.com/omise/webhook'
      navigator.clipboard.writeText(linked)
      this.$swal({
        title: 'Copy successfully',
        text: 'คัดลอกลิงก์สำเร็จ',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    },
    FunCopyQrcode (item) {
      console.log('FunCopyQrcode', item)
      // var copyText = document.getElementById('myInput')
      // copyText.select()
      // copyText.setSelectionRange(0, 99999)
      let linked = 'https://api-belinked.betaskthai.com/stripe/webhook?shopId=' + item.shopId + '&masBranchID=' + item.masBranchID
      navigator.clipboard.writeText(linked)
      this.$swal({
        title: 'Copy successfully',
        text: 'คัดลอกลิงก์สำเร็จ',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    },
    addDataStripe (item) {
      if (item === 'omise') {
        this.formAddStripe.payType = 'omise'
        this.formAddStripe.payMentSelect = JSON.stringify(this.valuePayment)
      } else {
        this.formAddStripe.payType = 'stripe'
      }
      this.formAddStripe.CREATE_USER = this.$session.getAll().data.userName
      this.formAddStripe.LAST_USER = this.$session.getAll().data.userName
      this.formAddStripe.shopId = this.$session.getAll().data.shopId

      console.log('form', JSON.stringify(this.formAdd))

      this.formAddStripe.payTypeCode = this.code + this.generateCodeGlobal()

      this.dataReady = false
      this.submitAddDataStripe(this.DNS_IP, this.path, this.formAddStripe)
      this.dialogAddOmise = false
    },
    async submitAddDataStripe (DNS_IP, PATH, ID, DT) {
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
          delete this.formAddStripe['payTypeId']
          await axios
            .post(
              // eslint-disable-next-line quotes
              DNS_IP + PATH + "add",
              this.formAddStripe
            )
            .then(async (response) => {
              // Debug response
              console.log('addDataGlobal DNS_IP + PATH + "add"', response)

              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              // Close Dialog
              this.dialogAddStripe = false
              this.dialogEditOmise = false
              // Load Data
              await this.clearDataStripe()
              await this.selectBranch()
              // await this.getDataGlobal(this.DNS_IP, this.path, this.$session.getAll().data.shopId)
              // if (this.dataItem.length > 0) {
              //   this.dataItem.forEach(el => {
              //     if (el.masBranchID === 'All') {
              //       el.masBranchName = 'ทั้งหมด'
              //     }
              //   })
              // }
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
    async selectBranch () {
      this.statusFilterBranch = false
      this.dataReady = false
      await this.getDataGlobal(this.DNS_IP, this.path, this.$session.getAll().data.shopId)
      await this.getDataBranch()
      if (this.dataItem.length > 0) {
        this.dataItem.forEach(el => {
          if (el.masBranchID === 'All') {
            el.masBranchName = 'ทั้งหมด'
          }
        })
      }
      console.log('masBranchID', this.masBranchID)
      console.log('dataItem', this.dataItem)
      this.dataItem = await this.dataItem.filter((ii) => ii.masBranchID === this.masBranchID.toString() || (ii.masBranchID === 'All' || ii.masBranchID === null))
      this.statusFilterBranch = true
    },
    fiterBranch () {
      this.DataBranchAll = []
      this.branch = []
      console.log('DataBranchAll', this.DataBranchAll)
      axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              if (this.session.data.masBranchID === '' || this.session.data.masBranchID === null) {
                console.log('TEST1', d.masBranchID, this.session.data.masBranchID)
                let s = {}
                s.text = d.masBranchName
                s.value = d.masBranchID
                this.DataBranchAll.push(d)
                this.branch.push(s)
              } else {
                console.log('TEST', d.masBranchID, this.session.data.masBranchID)
                if (d.masBranchID === this.session.data.masBranchID) {
                  let s = {}
                  s.text = d.masBranchName
                  s.value = d.masBranchID
                  this.DataBranchAll.push(d)
                  this.branch.push(s)
                }
              }
            }
          } else {
            this.DataBranchName = []
            this.branch = []
          }
          if (this.branch.length === 1) {
            this.masBranchID = this.branch[0].value
            await this.selectBranch()
          } else if (this.branch.length > 1) {
            this.masBranchID = this.branch[0].value
            await this.selectBranch()
          }
        })
    },
    async getDataBranch () {
      this.branchItem = []
      await axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.$session.getAll().data.shopId)
        .then(response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.status !== false) {
            if (this.session.data.masBranchID === '' || this.session.data.masBranchID === null) {
              let all = {}
              all.text = 'ทั้งหมด'
              all.value = 'All'
              this.branchItem.push(all)
            }
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (this.session.data.masBranchID === '' || this.session.data.masBranchID === null) {
                let s = {}
                s.text = d.masBranchName
                s.value = d.masBranchID.toString()
                this.branchItem.push(s)
              } else {
                if (d.masBranchID === this.masBranchID) {
                  let s = {}
                  s.text = d.masBranchName
                  s.value = d.masBranchID.toString()
                  this.branchItem.push(s)
                }
              }
              // console.log('dtdtdtdt', this.branch)
            }
          } else {
            if (this.session.data.masBranchID === '' || this.session.data.masBranchID === null) {
              let all = {}
              all.text = 'ทั้งหมด'
              all.value = 'All'
              this.branchItem.push(all)
            }
          }
        })
      console.log('branch', this.branch)
    },
    validate (Action) {
      switch (Action) {
        case 'ADD':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_add.validate()
          })
          break
        case 'ADDStripe':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_addStripe.validate()
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
    selectImgAdd () {
      if (this.filesAdd) {
        this.formAdd.pictureUrlPreview = URL.createObjectURL(
          this.filesAdd
        )
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
    async getDataByIdStripe (item) {
      //
      //
      // สำหรับ เรียกข้อมูล ใส่ form Update / Delete
      //
      //
      // Get ID /main.js
      console.log('item', item)
      this.dataReady = false
      this.formAddStripe.payTypeId = item.payTypeId
      this.formAddStripe.apiKey = item.apiKey
      this.formAddStripe.endpointSecret = item.endpointSecret
      this.formAddStripe.masBranchID = item.masBranchID
      this.formAddStripe.payTypeCode = item.payTypeCode
      this.formAddStripe.payTypeName = item.payTypeName
      this.formAddStripe.payVatExclude = item.payVatExclude || 0
      this.formAddStripe.shopId = this.$session.getAll().data.shopId
      if (item.payType === 'omise') {
        this.valuePayment = JSON.parse(item.payMentSelect)
      }
      this.formAddStripe.payMentSelect = item.payMentSelect
      this.dataReady = true
    },
    async getDataById (item) {
      //
      //
      // สำหรับ เรียกข้อมูล ใส่ form Update / Delete
      //
      //
      // Get ID /main.js
      this.dataReady = false
      await this.getDataByIdGlobal(this.DNS_IP, this.path, 'payTypeId', item.payTypeId)
      this.formUpdate.pictureUrlPreview = item.payTypeImage
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

      console.log('form', JSON.stringify(this.formAdd))

      this.formAdd.payTypeCode = this.code + this.generateCodeGlobal()

      this.dataReady = false
      this.submitAdd(this.DNS_IP, this.path, this.formAdd)
    },
    async submitAdd (DNS_IP, PATH, ID, DT) {
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
          if (this.filesAdd) {
            const _this = this
            let params = new FormData()
            params.append('file', this.filesAdd)
            await axios
              .post(this.DNS_IP + `/file/upload/payment`, params)
              .then(function (response) {
                _this.formAdd.payTypeImage = response.data
                console.log('url Pic', response.data)
              })
          } else {
            this.formAdd.payTypeImage = this.formAdd.pictureUrlPreview
          }
          delete this.formAdd['pictureUrlPreview']
          await axios
            .post(
              // eslint-disable-next-line quotes
              DNS_IP + PATH + "add",
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
              await this.selectBranch()
              // await this.getDataGlobal(this.DNS_IP, this.path, this.$session.getAll().data.shopId)
              // if (this.dataItem.length > 0) {
              //   this.dataItem.forEach(el => {
              //     if (el.masBranchID === 'All') {
              //       el.masBranchName = 'ทั้งหมด'
              //     }
              //   })
              // }
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
      // Config User ทำรายการล่าสุด
      this.formUpdateItem.LAST_USER = this.$session.getAll().data.userName
      // End Config User ทำรายการล่าสุด

      for (var key in this.formUpdateItem) {
        for (var key2 in this.formUpdate) {
          if (key === key2) {
            this.formUpdateItem[key] = this.formUpdate[key2]
          }
        }
      }
      if (this.filesUpdate) {
        const _this = this
        let params = new FormData()
        params.append('file', this.filesUpdate)
        await axios
          .post(this.DNS_IP + `/file/upload/payment`, params)
          .then(function (response) {
            _this.formUpdateItem.payTypeImage = response.data
            console.log('url Pic', response.data)
          })
      } else {
        this.formUpdateItem.payTypeImage = this.formUpdate.pictureUrlPreview
      }
      // delete this.formAdd['pictureUrlPreview']
      console.log('this.formUpdateItem', this.formUpdateItem)

      // Debug
      console.log('EDIT PK : ', this.PK)
      console.log('formUpdateItem', JSON.stringify(this.formUpdateItem))
      // End Debug
      // สำหรับ แก้ไขข้อมูล
      // ต้องระบุ  Last User ว่าใครเป็นคนแก้ไขล่าสุด
      //
      this.dataReady = false
      // await this.editDataGlobal(
      //   this.DNS_IP,
      //   this.path,
      //   this.PK,
      //   this.formUpdateItem
      // )
      this.dataReady = false
      this.submitEdit(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
    },
    async submitEdit (DNS_IP, PATH, ID, DT) {
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

              // Load Data
              await this.selectBranch()
              // await this.getDataGlobal(DNS_IP, PATH, this.$session.getAll().data.shopId)
              // if (this.dataItem.length > 0) {
              //   this.dataItem.forEach(el => {
              //     if (el.masBranchID === 'All') {
              //       el.masBranchName = 'ทั้งหมด'
              //     }
              //   })
              // }
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
    async editDataStripe (item) {
      // this.editDataGlobal(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
      this.dataReady = false
      this.formAddStripe.LAST_USER = this.$session.getAll().data.userName
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
          console.log('this.formAddStripe', this.formAddStripe)
          let dt = {
            masBranchID: this.formAddStripe.masBranchID,
            apiKey: this.formAddStripe.apiKey,
            endpointSecret: this.formAddStripe.endpointSecret,
            payVatExclude: this.formAddStripe.payVatExclude,
            payTypeName: this.formAddStripe.payTypeName.replace(/%/g, '%%').replace(/'/g, "\\'"),
            LAST_USER: this.formAddStripe.LAST_USER
          }
          let dtOmise = {
            masBranchID: this.formAddStripe.masBranchID,
            apiKey: this.formAddStripe.apiKey,
            endpointSecret: this.formAddStripe.endpointSecret,
            payTypeName: this.formAddStripe.payTypeName.replace(/%/g, '%%').replace(/'/g, "\\'"),
            payVatExclude: this.formAddStripe.payVatExclude,
            LAST_USER: this.formAddStripe.LAST_USER,
            payMentSelect: JSON.stringify(this.valuePayment)
          }
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + this.path + "edit/" + this.formAddStripe.payTypeId,
              item === 'omise' ? dtOmise : dt
            )
            .then(async (response) => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)

              this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
              // Close Dialog
              this.dialogEditStripe = false
              this.dialogEditOmise = false
              // Load Data
              await this.selectBranch()
              // await this.getDataGlobal(DNS_IP, PATH, this.$session.getAll().data.shopId)
              // if (this.dataItem.length > 0) {
              //   this.dataItem.forEach(el => {
              //     if (el.masBranchID === 'All') {
              //       el.masBranchName = 'ทั้งหมด'
              //     }
              //   })
              // }
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
      // eslint-disable-next-line no-redeclare
      for (var key in this.formAdd) {
        if (this.formAdd[key]) {
          this.formAdd[key] = ''
        }
      }
    },
    async clearDataStripe () {
      // eslint-disable-next-line no-redeclare
      for (var key in this.formAddStripe) {
        if (this.formAddStripe[key]) {
          this.formAddStripe[key] = ''
        }
      }
    }
  }
}
</script>
<style scope>
#v_img_addpay {
  height: 99px;
  width: 112px;
}
#subtext {
  color: #173053;
  font-size: 30px !important;
  font-weight: bold;
}
#v_text_edits {
  height: 43px;
  width: 198px;
}
#v-img-cash {
  height: 60px;
  width: 60px;
}
/* width */
::-webkit-scrollbar {
  width: 2px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #173053;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #173053;
}
.optionpayment {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>
