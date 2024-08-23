<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <v-row>
        <v-col cols="6" class="text-left">
          <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
        </v-col>
      </v-row>
      <v-container>
        <v-row>
          <EditShop v-show="showEdit" @confirmed="getShop" ref="dialogEdit"></EditShop>
          <v-col cols="12" md="5" sm="5" class="main" style="background-color:#FFFFFF;">
            <div class="Bar">
                <v-row>
                  <v-col class="pa-0" cols="8">
                    <v-btn
                class="ma-5 mr-1"
                  :color="DarkModeButton"
                  dark
                  @click="getDialogEdit()"
                >
                <v-icon dark>
                  mdi-cog-sync
                </v-icon>
                ปรับแต่งหน้านัดหมาย
                </v-btn>
                  </v-col>
                  <v-col class="pa-0" cols="4">
                    <v-btn
                class="ma-5 ml-0"
                  color="green"
                  dark
                  @click="getShop()"
                >
                Preview
                </v-btn>
                  </v-col>
                </v-row>
              <v-card
              :ripple="false"
              :img="ImgCover"
              height="240px"
              width="100%"
              >
              </v-card>
              <v-card
                class="pa-2 pb-10 mt-n10"
                :color="DarkModeBackground"
                :style="'background-color:'+ DarkModeBackground +';min-height: 100vh;border-radius: 45px 45px 0px 0px;'"
              >
              <v-row>
                <v-col class="text-center">
                  <v-avatar class="mt-n16 pa-1" style="" :color="DarkModeBackground" size="150">
                  <img
                    :src="LoGo"
                  >
                </v-avatar>
                </v-col>
              </v-row>
              <div style="display:flex;justify-content: center;" class="ma-3">
                <v-chip
                  class="mr-1 font-weight-black"
                  :style="'background-color:' + (languageSelect === 0 ? DarkModeButton : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
                  dark
                  @click="languageSelect = 0"
                  >
                  <v-avatar left>
                    <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-TH.png?alt=media&token=e4bd7ffa-aed9-47e3-9240-4dcb9d8d284e"></v-img>
                  </v-avatar>
                    TH
                </v-chip>
                <v-chip
                  class="ml-1 font-weight-black"
                  :style="'background-color:' + (languageSelect === 1 ? DarkModeButton : 'rgb(103 103 103 / 18%)') + ';font-size:20px'"
                  dark
                  @click="languageSelect = 1">
                  <v-avatar left>
                    <v-img src="https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2Fflag-USA1.png?alt=media&token=a83dd820-f576-457a-8d08-1009cea9d70b"></v-img>
                  </v-avatar>
                    EN
                </v-chip>
              </div>
              <h3 class="text-center" :style="'color:' + DarkModefont +';'">{{ languageSelect === 0 ? bookingFormHeader : bookingFormHeaderEn}}</h3>
              <h5 class="text-center" :style="'color:' + DarkModefont +';'" v-if="shop.length > 0">{{shop[0].shopName}}</h5>
              <v-col cols="12" class="text-center  pa-0 mb-3" >
                <v-btn
                  class="mx-2"
                  dark
                  :color="DarkModeButton"
                  @click="dialogHistory = true"
                  readonly
                >
                {{ languageSelect === 0 ? bookingFormHistoryBT : bookingFormHistoryBTEn}}
                <v-icon
                  right
                  dark
                >
                  mdi-history
                </v-icon>
                  <!-- <v-icon dark>
                    mdi-history
                  </v-icon> -->
                </v-btn>
            <!-- <v-btn
              tile
              small
              dark
              :color="DarkModeButton"
              @click="dialogHistory = true"
            >
              <v-icon left>
                mdi-history
              </v-icon>
              {{languageSelect === 0 ? 'เรียกข้อมูลเดิม' : 'Used History'}}
            </v-btn> -->
          </v-col>
                <div class="pa-2 pt-8" :style="'background-color:' + DarkMode + ';border-radius: 15px 15px 15px 15px;'">
                  <div
                  v-for="(itemFix, indexFix) in fixtureField"
                  :key="indexFix"
                >
                  <v-text-field
                    :label="languageSelect === 0 ? itemFix.fieldName:itemFix.fieldNameEn"
                    outlined

                  ></v-text-field>
                </div>
                      <form class="Review">
                      <div v-for="(item, index) in Fielditem" :key="index">
                        <div v-if="item.showitem == true">
                  <div v-if="item.conditionField === '' || item.conditionField === null ">
                    <div v-if="item.fieldType == 'text'">
                    <v-text-field
                    v-model="item.fieldValue"
                    :label="languageSelect === 0 ? item.fieldName:item.fieldNameEn"
                    outlined
                    required

                    ></v-text-field>
                  </div>
                  <div v-if="item.fieldType == 'number'">
                    <v-text-field
                    v-model="item.fieldValue"
                    :label="languageSelect === 0 ? item.fieldName:item.fieldNameEn"
                    outlined
                    required

                    ></v-text-field>
                  </div>
                  <div v-if="item.fieldType== 'Autocompletes'">
                    <v-autocomplete
                      v-model="item.fieldValue"
                      :items="JSON.parse(item.optionField)"
                      outlined
                      :label="languageSelect === 0 ? item.fieldName:item.fieldNameEn"
                      required

                    ></v-autocomplete>
                  </div>
                  <div v-if="item.fieldType== 'Selects'">
                    <v-select
                      v-model="item.fieldValue"
                      :items="JSON.parse(item.optionField)"
                      menu-props="auto"
                      :label="languageSelect === 0 ? item.fieldName:item.fieldNameEn"
                      required

                      outlined
                    ></v-select>
                  </div>
                  <div v-if="item.fieldType== 'Radio'" style="padding:0px;">
                    <v-container fluid style="padding:0px;">
                      <v-radio-group
                      column
                    v-model="item.fieldValue"
                    style="margin:0px;">
                      <template v-slot:label>
                      </template>
                      <div v-for="radios in JSON.parse(item.optionField)" :key="radios.toISOString">
                      <v-radio
                        :label="radios.text"
                        :value="radios.value"
                      ></v-radio>
                      </div>
                    </v-radio-group>
                    </v-container>
                  </div>
                  </div>
                <div v-if="item.conditionField !== '' && Fielditem.filter((row) => { return row.fieldId === parseInt(item.conditionField)}).length > 0">
                  <div v-if="item.conditionValue === Fielditem.filter((row) => { return row.fieldId === parseInt(item.conditionField)})[0].fieldValue">
                    <div v-if="item.fieldType == 'text'">
                    <v-text-field
                    v-model="item.fieldValue"
                    :label="languageSelect === 0 ? item.fieldName:item.fieldNameEn"
                    outlined
                    required

                    ></v-text-field>
                    </div>
                    <div v-if="item.fieldType == 'number'">
                      <v-text-field
                      v-model="item.fieldValue"
                      :label="languageSelect === 0 ? item.fieldName:item.fieldNameEn"
                      outlined
                      required

                      ></v-text-field>
                    </div>
                    <div v-if="item.fieldType== 'Autocompletes'">
                      <v-autocomplete
                        v-model="item.fieldValue"
                        :items="JSON.parse(item.optionField)"
                        outlined
                        :label="languageSelect === 0 ? item.fieldName:item.fieldNameEn"
                        required

                      ></v-autocomplete>
                    </div>
                    <div v-if="item.fieldType== 'Selects'">
                      <v-select
                        v-model="item.fieldValue"
                        :items="JSON.parse(item.optionField)"
                        menu-props="auto"
                        :label="languageSelect === 0 ? item.fieldName:item.fieldNameEn"
                        required

                        outlined
                      ></v-select>
                    </div>
                    <div v-if="item.fieldType== 'Radio'" style="padding:0px;">
                      <v-container fluid style="padding:0px;">
                        <v-radio-group row
                      v-model="item.fieldValue"
                      style="margin:0px;">
                        <template v-slot:label>
                        </template>
                        <div v-for="radios in JSON.parse(item.optionField)" :key="radios.toISOString">
                        <v-radio
                          :label="radios.text"
                          :value="radios.value"
                        ></v-radio>
                        </div>
                      </v-radio-group>
                      </v-container>
                    </div>
                    </div>
                  </div>
                        </div>
                      </div>
                    </form>
                    <v-row>
                  <v-col cols="6">
                    <v-menu
                      ref="menu"
                      v-model="menuDate"
                      :close-on-content-click="false"
                      :return-value.sync="date"
                      transition="scale-transition"
                      offset-y
                      readonly
                      required
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          :label="languageSelect === 0 ? 'วันที่' : 'Date'"
                          prepend-inner-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          required
                          outlined
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date"
                        no-title
                        scrollable
                        :min="
                          new Date(
                            Date.now() - new Date().getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .substr(0, 10)
                        "
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menuDate = false">
                          Cancel
                        </v-btn>
                        <v-btn text color="primary">
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                    outlined
                      v-model="time"
                      :label="languageSelect === 0 ? 'เวลา' : 'Time'"
                      type="time"
                      suffix=""
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
                </div>

               <div class="text-center mt-5" >
              <v-btn
              class="button"
              :color="DarkModeButton"
              dark
              large
               readonly
            >{{ languageSelect === 0 ? bookingFormConfirmBT : bookingFormConfirmBTEn }}</v-btn>
            <!-- <v-btn
              class="button"
              large
              :color="DarkModeButton"
              dark
               readonly
            >{{'ยกเลิก'}}</v-btn> -->
            </div>
              </v-card>
            </div>
          </v-col>
          <v-col cols="12" md="7" sm="7" class="main" style="background-color:#FFFFFF;">
            <v-row>
              <v-col cols="12" md="12" sm="12">
                <div v-if="Redirect !== ''">
                  <v-card class="p-3" style="background-color:#050C42;">
                    <v-img
                      :src="require('@/assets/linkicon.png')"
                      class="a"
                      style="width:29px;height:29px"
                    ></v-img>
                    <h3 class="text-center" style="color:#FFFFFF;">
                      ลิ้งค์สำหรับลูกค้า
                    </h3>
                    <h6 class="text-center" style="color:#FFFFFF;">
                      สามารถกดปุ่มตามประเภท social media เพื่อคัดลอกลิ้งค์นัดหมาย
                    </h6>
                    <v-card-text>
                      <v-row align-content="center" v-show="!hindRedirect">
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
                        <v-col cols="auto" class="text-lelf mx-1">
                          <v-btn
                            color="#1B437C"
                            small
                            fab
                            dark
                            @click="FunCopy('facebook')"
                          >
                            <v-icon>mdi-facebook</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="auto" class="text-lelf mx-1">
                          <v-btn
                            color="#1B437C"
                            small
                            fab
                            dark
                            @click="FunCopy('twitter')"
                          >
                            <v-icon>mdi-twitter</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="auto" class="text-lelf">
                          <button v-on:click="FunCopy('line')"><v-img :src="require('@/assets/lineIcon.png')" style="width:40px;height:40px;margin-bottom:13px;" /></button>
                        </v-col>
                        <v-col cols="auto" class="text-lelf mx-1">
                          <v-btn
                            color="#1B437C"
                            small
                            fab
                            dark
                            @click="FunCopy('instagram')"
                          >
                            <v-icon>mdi-instagram</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="auto" class="text-lelf mx-1">
                          <v-btn
                            color="#1B437C"
                            small
                            fab
                            dark
                            @click="dialogOther = true, validate('other')"
                          >
                            <v-icon>mdi-tag-plus</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <!-- <v-row align-content="center">
                        <v-col cols="10">
                          <v-text-field
                            v-model="Redirect"
                            style="background-color:#050C42;"
                            solo
                            id="myInput"
                            dense
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" class="text-lelf">
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
                      </v-row> -->
                    </v-card-text>
                  </v-card>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" sm="12">
                <v-card min-height="50%">
                  <v-col cols="12" class="text-center">
                    <h4 class="text-center">ตั้งค่า หน้ารายชื่อนัดหมาย</h4>
                    <v-row align="center">
                      <v-expansion-panels
                          multiple
                        >
                        <v-expansion-panel>
                          <v-expansion-panel-header>จัดการชื่อกระบวนการทำงาน</v-expansion-panel-header>
                          <v-form ref="form_process" v-model="validProcess" lazy-validation>
                          <v-expansion-panel-content>
                            <v-row>
                              <v-col cols="6" class="pb-0 pt-1">
                                <v-text-field
                                  v-model="dataTypeProcess1"
                                  dense
                                  label="กระบวนการ 1"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" class="pb-0 pt-1">
                                <v-text-field
                                  v-model="dataTypeProcess2"
                                  dense
                                  label="กระบวนการ 2"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" class="pb-0 pt-0">
                                <v-text-field
                                  v-model="dataTypeProcess3"
                                  dense
                                  label="กระบวนการ 3"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" class="pb-0 pt-0">
                                <v-text-field
                                  v-model="dataTypeProcess4"
                                  dense
                                  label="กระบวนการ 4"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-subheader>ตัวอย่าง</v-subheader>
                            <v-row>
                                <v-col cols="6" class="text-center pb-0">
                                  <v-alert
                                    color="orange"
                                    dark
                                    dense
                                    icon="mdi-bell-alert-outline"
                                    prominent
                                  >
                                    <div>
                                      <strong>{{dataTypeProcess1}}</strong>
                                    </div>
                                    <div>จำนวน : 99</div>
                                  </v-alert>
                                </v-col>
                                <v-col cols="6" class="text-center pb-0">
                                  <v-alert
                                    color="green"
                                    dark
                                    dense
                                    icon="mdi-email-check"
                                    prominent
                                  >
                                    <div>
                                      <strong>{{dataTypeProcess2}}</strong>
                                    </div>
                                    <div>จำนวน : 99</div>
                                  </v-alert>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="6" class="text-center pb-0">
                                  <v-alert
                                    color="red"
                                    dark
                                    dense
                                    icon="mdi-calendar-remove"
                                    prominent
                                  >
                                    <div>
                                      <strong>{{dataTypeProcess3}}</strong>
                                    </div>
                                    <div>จำนวน : 99</div>
                                  </v-alert>
                                </v-col>
                                <v-col cols="6" class="text-center pb-0">
                                  <v-alert
                                    color="blue"
                                    dark
                                    dense
                                    icon="mdi-account-check"
                                    prominent
                                  >
                                    <div>
                                      <strong>{{dataTypeProcess4}}</strong>
                                    </div>
                                    <div>จำนวน : 99</div>
                                  </v-alert>
                                </v-col>
                              </v-row>
                              <div class="text-center">
                              <v-btn
                                elevation="2"
                                small
                                dark
                                @click="updateTypeProcess()"
                                color="info"
                              >
                                <v-icon left>mdi-content-save-edit</v-icon>
                                เปลี่ยนแปลง
                              </v-btn>
                            </div>
                          </v-expansion-panel-content>
                           </v-form>
                        </v-expansion-panel>
                        <v-expansion-panel>
                          <v-expansion-panel-header>จัดการชื่อประเภทงาน</v-expansion-panel-header>
                          <v-form ref="form_job" v-model="validJob" lazy-validation>
                          <v-expansion-panel-content>
                            <v-row>
                              <v-col col="4" class="pb-0 pt-2">
                                <v-text-field
                                  v-model="dataTypeJob1"
                                  dense
                                  label="ประเภทงานที่ 1"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col col="4" class="pb-0 pt-2">
                                <v-text-field
                                  v-model="dataTypeJob2"
                                  dense
                                  label="ประเภทงานที่ 2"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col col="4" class="pb-0 pt-2">
                                <v-text-field
                                  v-model="dataTypeJob3"
                                  dense
                                  label="ประเภทงานที่ 3"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-subheader>ตัวอย่าง</v-subheader>
                            <v-row>
                              <v-col cols="12"  class="pb-0 pt-0">
                                <v-radio-group row>
                                  <v-radio :value="dataTypeJob1">
                                    <template v-slot:label>
                                      <div class="mt-3"><strong class="primary--text">{{dataTypeJob1}}</strong></div>
                                    </template>
                                  </v-radio>
                                  <v-radio :value="dataTypeJob2">
                                    <template v-slot:label>
                                      <div class="mt-3"><strong class="error--text">{{dataTypeJob2}}</strong></div>
                                    </template>
                                  </v-radio>
                                  <v-radio :value="dataTypeJob3">
                                    <template v-slot:label>
                                      <div class="mt-3"><strong class="orange--text">{{dataTypeJob3}}</strong></div>
                                    </template>
                                  </v-radio>
                                </v-radio-group>
                              </v-col>
                            </v-row>
                            <div class="text-center">
                              <v-btn
                                elevation="2"
                                small
                                dark
                                @click="updateTypeJob()"
                                color="info"
                              >
                                <v-icon left>mdi-content-save-edit</v-icon>
                                เปลี่ยนแปลง
                              </v-btn>
                            </div>
                          </v-expansion-panel-content>
                          </v-form>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-row>
                  </v-col>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" sm="12">
                <v-card min-height="50%">
                  <v-col cols="12" class="text-center">
                    <h4 class="text-center">ตั้งค่า Upload File</h4>
                    <v-row align="center">
                      <v-expansion-panels
                          multiple
                        >
                        <v-expansion-panel>
                          <v-expansion-panel-header>จัดการ Upload File</v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <h4 class="text-center">โปรดเลือกข้อมูลที่ต้องการแสดง</h4>
                            <v-row>
                              <v-col cols="6">
                                <v-row align="center">
                                  <v-checkbox
                                    false-value="False"
                                    true-value="True"
                                    v-model="showUpload1"
                                    hide-details
                                    class="shrink ml-6 mr-0 mt-0 mb-6"
                                  ></v-checkbox>
                                  <v-text-field :value="showUpload1 === 'True' ? 'แสดง' : 'ไม่แสดง'" readonly label="แสดง Upload File ตัวที่ 1"></v-text-field>
                                </v-row>
                              </v-col>
                               <v-col cols="6" class="pt-0">
                                <v-text-field v-model="textUpload1" :readonly="showUpload1 === 'True' ? false : true" label="หัวข้อที่ต้องการแสดง"></v-text-field>
                               </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="6">
                                <v-row align="center">
                                  <v-checkbox
                                    false-value="False"
                                    true-value="True"
                                    v-model="showUpload2"
                                    hide-details
                                    class="shrink ml-6 mr-0 mt-0 mb-6"
                                  ></v-checkbox>
                                  <v-text-field :value="showUpload2 === 'True' ? 'แสดง' : 'ไม่แสดง'" readonly label="แสดง Upload File ตัวที่ 2"></v-text-field>
                                </v-row>
                              </v-col>
                               <v-col cols="6" class="pt-0">
                                <v-text-field v-model="textUpload2" :readonly="showUpload2 === 'True' ? false : true" label="หัวข้อที่ต้องการแสดง"></v-text-field>
                               </v-col>
                            </v-row>
                            <div class="text-center">
                              <v-btn
                                elevation="2"
                                small
                                dark
                                @click="updateUploadFile()"
                                color="info"
                              >
                                <v-icon left>mdi-content-save-edit</v-icon>
                                เปลี่ยนแปลง
                              </v-btn>
                            </div>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-row>
                  </v-col>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" sm="12">
                <v-card min-height="50%">
                  <v-col cols="12" class="text-center">
                    <h4 class="text-center">ตั้งค่า หน้านัดหมายของลูกค้า</h4>
                    <v-row align="center">
                      <v-expansion-panels
                          multiple
                        >
                        <v-expansion-panel>
                          <v-expansion-panel-header>จัดการ หัวข้อที่ต้องการแสดง</v-expansion-panel-header>
                          <v-form ref="form_bookingText" v-model="validBookingText" lazy-validation>
                          <v-expansion-panel-content>
                            <v-row>
                              <v-col cols="6" class="pb-0 pt-3">
                                <v-text-field
                                  v-model="bookingFormHeader"
                                  dense
                                  label="หัวข้อ (TH)"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" class="pb-0 pt-3">
                                <v-text-field
                                  v-model="bookingFormHeaderEn"
                                  dense
                                  label="หัวข้อ (EN)"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" class="pb-0 pt-3">
                                <v-text-field
                                  v-model="CalendarHeader"
                                  dense
                                  label="ชื่อหัวข้อหน้าตรวจสอบคิวว่าง (TH)"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" class="pb-0 pt-3">
                                <v-text-field
                                  v-model="CalendarHeaderEn"
                                  dense
                                  label="ชื่อหัวข้อหน้าตรวจสอบคิวว่าง (EN)"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" class="pb-0 pt-1">
                                <v-text-field
                                  v-model="bookingFormHistoryBT"
                                  dense
                                  label="ชื่อปุ่ม ประวัติการเข้าใช้บริการ (TH)"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" class="pb-0 pt-1">
                                <v-text-field
                                  v-model="bookingFormHistoryBTEn"
                                  dense
                                  label="ชื่อปุ่ม ประวัติการเข้าใช้บริการ (EN)"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" class="pb-0 pt-1">
                                <v-text-field
                                  v-model="bookingFormConfirmBT"
                                  dense
                                  label="ชื่อปุ่ม ยืนยันนัดหมาย (TH)"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6" class="pb-0 pt-1">
                                <v-text-field
                                  v-model="bookingFormConfirmBTEn"
                                  dense
                                  label="ชื่อปุ่ม ยืนยันนัดหมาย (EN)"
                                  required
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <div class="text-center">
                              <v-btn
                                elevation="2"
                                small
                                dark
                                @click="updateTextBooking()"
                                color="info"
                              >
                                <v-icon left>mdi-content-save-edit</v-icon>
                                เปลี่ยนแปลง
                              </v-btn>
                            </div>
                          </v-expansion-panel-content>
                          </v-form>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-row>
                  </v-col>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" sm="12">
                <v-card min-height="50%">
                  <v-col cols="12" class="text-center">
                    <h4 class="text-center">โปรดเลือกข้อมูลที่ต้องการแสดง</h4>
                    <v-row align="center">
                      <v-checkbox
                        false-value="ไม่แสดง"
                        true-value="แสดง"
                        v-model="showTime"
                        hide-details
                        class="shrink ml-6 mr-0 mt-0 mb-6"
                      ></v-checkbox>
                      <v-text-field v-model="showTime" readonly label="แสดงเวลาการจองหรือไม่"></v-text-field>
                    </v-row>
                    <v-row align="center">
                      <v-checkbox
                        false-value="False"
                        true-value="True"
                        v-model="statusEngPayment"
                        hide-details
                        class="shrink ml-6 mr-0 mt-0 mb-6"
                      ></v-checkbox>
                      <v-text-field :value="statusEngPayment === 'True' ? 'ใช้งาน' : 'ไม่ใช้งาน'" readonly label="ภาษาอังกฤษรับเงินมัดจำหรือไม่"></v-text-field>
                    </v-row>
                    <v-row align="center">
                      <v-checkbox
                        false-value="False"
                        true-value="True"
                        v-model="liffSendMessageAfterBookingStatus"
                        hide-details
                        class="shrink ml-6 mr-0 mt-0 mb-6"
                      ></v-checkbox>
                      <v-text-field :value="liffSendMessageAfterBookingStatus === 'True' ? 'ใช้งาน' : 'ไม่ใช้งาน'" readonly label="ส่งข้อความเข้า LINE OA เมื่อลูกค้านัดหมาย"></v-text-field>
                    </v-row>
                    <!-- <v-row align="center">
                      <v-checkbox
                        false-value="False"
                        true-value="True"
                        v-model="checkLocationStatus"
                        hide-details
                        class="shrink ml-6 mr-0 mt-0 mb-6"
                        @change="checkLocationStatus === 'True' ? geolocate() : ''"
                      ></v-checkbox>
                      <v-text-field :value="checkLocationStatus === 'True' ? 'ใช้งาน' : 'ไม่ใช้งาน'" readonly label="เปิดระบบจองในพื้นที่ที่กำหนด"></v-text-field>
                    </v-row> -->
                    <!-- <template v-if="checkLocationStatus === 'True'">
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
                      <v-col class="pb-0 pt-0" cols="12">
                        <gmap-autocomplete
                          class="introInput"
                          placeholder="ค้นหาสถานที่"
                          @place_changed="updatePlace" style="width: 100%; height: 45px; border: 1px solid;padding-left: 8px; border-radius: 4px;">
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
                    </template> -->
                    <br>
                    <v-data-table
                      v-model="itemdetell"
                      :headers="FieldSelect"
                      :items="Fielditem"
                      rounded="xl"
                    >
                      <template v-slot:[`item.showitem`]="{ item }">
                        <v-simple-checkbox
                          v-model="item.showitem"
                        ></v-simple-checkbox>
                      </template>
                      <template v-slot:[`item.showitemCustomer`]="{ item }">
                        <v-simple-checkbox
                          v-model="item.showitemCustomer"
                        ></v-simple-checkbox>
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn
                      elevation="5"
                      color="#1B437C"
                      dark
                      block
                      @click="addBooking()"
                      >บันทึกข้อมูล</v-btn
                    >
                  </v-col>
                </v-card>
              </v-col>
            </v-row>
            <v-dialog v-model="dialogOther" max-width="70%">
                        <v-card class="text-center">
                          <v-card-title>
                            ยืนยันรายการนี้
                          </v-card-title>
                          <v-card-text>
                            <v-form ref="form_other" v-model="validOther" lazy-validation>
                            <v-container>
                            <v-row>
                              <v-text-field
                                v-model="textOther"
                                label="ใส่แหล่งที่มาที่ต้องการ"
                                outlined
                                dense
                                required
                                :rules ="[rules.required]"
                              ></v-text-field>
                            </v-row>
                            <div class="text-center">
                              <v-btn
                                elevation="10"
                                color="#173053"
                                :disabled="!validOther"
                                small
                                class="text-white"
                                @click="FunCopy(textOther), dialogOther = false"
                                >คัดลอก</v-btn>
                              <v-btn
                                elevation="10"
                                color="#173053"
                                outlined
                                style="background-color:#FFFFFF"
                                small
                                @click="dialogOther = false"
                                >ยกเลิก</v-btn
                              >
                            </div>
                            </v-container>
                            </v-form>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
          </v-col>
        </v-row>
        <v-overlay :value="dataReady">
          <v-progress-circular
            indeterminate
            size="64"
          ></v-progress-circular>
        </v-overlay>
      </v-container>
      <v-dialog v-model="dialogchekField" max-width="35%">
        <v-card min-height="50%" class="pa-3">
                  <v-col cols="12" class="text-center">
                    <h4 class="text-center">โปรดเลือกข้อมูลที่ต้องการแสดงในหน้านัดหมาย</h4>
                    <v-data-table
                      v-model="itemdetell"
                      :headers="FieldSelect"
                      :items="Fielditem"
                      rounded="xl"
                    >
                      <template v-slot:[`item.showitem`]="{ item }">
                        <v-simple-checkbox
                          v-model="item.showitem"
                        ></v-simple-checkbox>
                      </template>
                      <template v-slot:[`item.showitemCustomer`]="{ item }">
                        <v-simple-checkbox
                          v-model="item.showitemCustomer"
                        ></v-simple-checkbox>
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn
                      elevation="5"
                      color="#1B437C"
                      dark
                      block
                      @click="addBooking()"
                      >บันทึกข้อมูล</v-btn
                    >
                  </v-col>
                </v-card>
      </v-dialog>
    </v-main>
  </div>
</template>

<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import EditShop from '../System/EditShop.vue'

export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    EditShop
  },
  beforeCreate () {
    // if (localStorage.userName) {
    //   console.log(localStorage.userName)
    // } else {
    //   console.log('not user')
    // }
    if (!this.$session.exists()) {
      this.$router.push('/Core/Login')
    }
  },
  data () {
    return {
      itemDistance: [
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
      languageSelect: 0,
      statusEngPayment: 'False',
      editBycustomField: 'False',
      dialogchekField: false,
      hindRedirect: true,
      showUpload1: 'False',
      showUpload2: 'False',
      textUpload1: '',
      textUpload2: '',
      showEdit: false,
      shop: [],
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      LoGo: [],
      ImgCover: '',
      dataReady: false,
      panelTypeJob: [0],
      dataTypeJob1: '',
      dataTypeJob2: '',
      dataTypeJob3: '',
      dataTypeProcess1: '',
      dataTypeProcess2: '',
      dataTypeProcess3: '',
      dataTypeProcess4: '',
      itemdetell: [],
      Redirect: '',
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      IdUpdate: '',
      bookingField: [],
      menuDate: false,
      dialogOther: false,
      validOther: false,
      validJob: false,
      validProcess: false,
      validBookingText: false,
      textOther: '',
      date: '',
      time: '',
      showTime: 'แสดง',
      showMap: 'ไม่แสดง',
      showLimitBooking: 'False',
      multiDueDate: 'False',
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },
      Fielditem: [],
      showitem: false,
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'จัดการข้อมูลนัดหมาย',
          disabled: false,
          href: '/Master/BookingField'
        }
      ],
      fixtureField: [
        {
          fieldName: 'ประเภทบริการ',
          fieldNameEn: 'Services'
        },
        {
          fieldName: 'สาขา',
          fieldNameEn: 'Branch'
        }
      ],
      FieldSelect: [
        {
          text: 'Field Id',
          value: 'fieldId'
        },
        {
          text: 'Field Name',
          value: 'fieldName'
        },
        { text: 'สำหรับ Admin', value: 'showitem' },
        { text: 'สำหรับ ลูกค้า', value: 'showitemCustomer' }
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
      dataLineConfig: [],
      bookingFormHeader: '',
      bookingFormHistoryBT: '',
      CalendarHeader: '',
      CalendarHeaderEn: '',
      bookingFormConfirmBT: '',
      bookingFormHeaderEn: '',
      bookingFormHistoryBTEn: '',
      bookingFormConfirmBTEn: '',
      liffSendMessageAfterBookingStatus: ''
    }
  },
  async mounted () {
    this.dataLineConfig = await this.getDataLineConfig(this.$session.getAll().data.shopId)
    this.Redirect = 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/Booking?shopId=' + this.$session.getAll().data.shopId + '&timeSlotStatus=' + this.$session.getAll().data.timeSlotStatus
    await this.getShop()
    await this.getBookingField()
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
      this.shopLat = location.latLng.lat()
      this.shopLong = location.latLng.lng()
      this.center = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      }
    },
    updateTextBooking () {
      this.validate('updateBookingText')
      setTimeout(() => this.updateTextBookingSubmit(), 500)
    },
    updateTextBookingSubmit () {
      if (this.validBookingText !== false) {
        this.dataReady = true
        let url = '/BookingField/edit/' + this.IdUpdate
        let dt = {
          bookingFormHeader: this.bookingFormHeader,
          bookingFormHeaderEn: this.bookingFormHeaderEn,
          CalendarHeader: this.CalendarHeader,
          CalendarHeaderEn: this.CalendarHeaderEn,
          bookingFormHistoryBT: this.bookingFormHistoryBT,
          bookingFormHistoryBTEn: this.bookingFormHistoryBTEn,
          bookingFormConfirmBT: this.bookingFormConfirmBT,
          bookingFormConfirmBTEn: this.bookingFormConfirmBTEn,
          LAST_USER: this.session.data.userName
        }
        axios
          .post(this.DNS_IP + url, dt)
          .then(async response => {
            this.$swal('สำเร็จ', 'เปลี่ยนแปลงเรียบร้อย', 'success')
            await this.getBookingField()
            this.dataReady = false
          })
      }
    },
    async editDataByBookingField (item) {
      console.log('item1111111111111111111111111111', item)
      this.editBycustomField = 'True'
      await this.getBookingField()
      this.dialogchekField = true
      // this.getDataById()
    },
    getDialogEdit () {
      this.$refs.dialogEdit.editDataByBookingField(this.shop)
    },
    async getShop () {
      if (this.shopId) {
        await axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId).then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.shop = rs
            rs.forEach(v => {
              if (v.primaryColor) {
                this.ColorByShop.push(v.primaryColor, v.secondaryColor)
                this.DarkModeBackground = v.primaryColor
                this.DarkModeButton = v.secondaryColor
              } else {
                this.ColorByShop.push('#E1F3FF', '#FFFFFF')
                this.DarkModeBackground = '#FFFFFF'
                this.DarkModeButton = '#E1F3FF'
              }
              if (v.shopImge) {
                this.LoGo = v.shopImge
              } else {
                this.LoGo = require('@/assets/LogoDefault.jpg')
              }
              if (v.shopImageCover) {
                this.ImgCover = v.shopImageCover
              } else {
                if (v.category === 'ธุรกิจรถยนต์') {
                  this.ImgCover = require('@/assets/Cover2.jpg')
                } else {
                  this.ImgCover = require('@/assets/Cover2.jpg')
                }
              }
              if (v.darkMode === 'True') {
                this.DarkMode = '#FFFFFF'
                this.DarkModefont = '#FFFFFF'
                this.DarkModeStatus = true
              } else {
                this.DarkMode = '#ffffff00'
                this.DarkModefont = '#000000'
                this.DarkModeStatus = false
              }
            })
          } else {
            this.shop = null
          }
          console.log('this.shop ', this.shop)
        })
      } else {
        this.ColorByShop.push('#E1F3FF', '#FFFFFF')
        this.DarkMode = '#ffffff00'
        this.DarkModefont = '#173053'
      }
    },
    validate (Action) {
      switch (Action) {
        case 'other':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_other.validate()
          })
          break
        case 'updateTypeJob':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_job.validate()
          })
          break
        case 'updateTypeProcess':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_process.validate()
          })
          break
        case 'updateBookingText':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_bookingText.validate()
          })
          break
        default:
          break
      }
    },
    FunCopy (text) {
      this.$session.getAll().data.timeSlotStatus = this.$session.getAll().data.timeSlotStatus || 'False'
      if (text === 'line') {
        let copyText = ''
        if (this.$session.getAll().data.timeSlotStatus === 'True') {
          copyText = 'https://liff.line.me/' + this.dataLineConfig.liffBookingFormEmpID + '?shopId=' + this.$session.getAll().data.shopId
        } else {
          copyText = 'https://liff.line.me/' + this.dataLineConfig.liffBookingFormID + '?shopId=' + this.$session.getAll().data.shopId
        }
        navigator.clipboard.writeText(copyText + '&source=' + text)
      } else {
        let copyText = document.getElementById('myInput')
        copyText.select()
        copyText.setSelectionRange(0, 99999)
        navigator.clipboard.writeText(copyText.value + '&source=' + text)
      }
      this.$swal({
        title: 'Copy successfully',
        text: 'คัดลอกลิ้งสำเร็จ',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    },
    async getBookingField () {
      let dataGet = {
        'itemIncustomField': [],
        'itemIncustomFieldCustomer': []
      }
      // let itemIncustomField = []
      // let itemIncustomFieldCustomer = []
      this.IdUpdate = 'noData'
      await axios
        .get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          if (typeof (rs.status) === 'undefined') {
            this.IdUpdate = rs[0].bookingFieldId
            console.log('this.IdUpdate', this.IdUpdate)
            console.log('rs', rs)
            if (rs.length > 0) {
              this.dataTypeJob1 = rs[0].typeJob1 || ''
              this.dataTypeJob2 = rs[0].typeJob2 || ''
              this.dataTypeJob3 = rs[0].typeJob3 || ''
              this.dataTypeProcess1 = rs[0].typeProcess1 || ''
              this.dataTypeProcess2 = rs[0].typeProcess2 || ''
              this.dataTypeProcess3 = rs[0].typeProcess3 || ''
              this.dataTypeProcess4 = rs[0].typeProcess4 || ''
              this.textUpload1 = rs[0].textUpload1 || 'Upload File 1'
              this.textUpload2 = rs[0].textUpload2 || 'Upload File 2'
              this.bookingFormHeader = rs[0].bookingFormHeader || 'ลงทะเบียนนัดหมาย'
              this.bookingFormHistoryBT = rs[0].bookingFormHistoryBT || 'ประวัติการเข้ารับบริการ'
              this.bookingFormConfirmBT = rs[0].bookingFormConfirmBT || 'ยืนยันนัดหมาย'
              this.bookingFormHeaderEn = rs[0].bookingFormHeaderEn || 'Booking Services'
              this.CalendarHeader = rs[0].CalendarHeader || 'ตรวจสอบคิวนัดหมาย'
              this.CalendarHeaderEn = rs[0].CalendarHeaderEn || 'Check queue'
              this.bookingFormHistoryBTEn = rs[0].bookingFormHistoryBTEn || 'History'
              this.bookingFormConfirmBTEn = rs[0].bookingFormConfirmBTEn || 'Confirm'
              this.shopLat = rs[0].shopLat || ''
              this.shopLong = rs[0].shopLong || ''
              this.distanceSet = rs[0].distanceSet || ''
              this.checkLocationStatus = rs[0].checkLocationStatus || 'False'
              this.liffSendMessageAfterBookingStatus = rs[0].liffSendMessageAfterBookingStatus || 'False'
              if (this.checkLocationStatus === 'True') {
                this.center = {
                  lat: parseFloat(this.shopLat),
                  lng: parseFloat(this.shopLong)
                }
              }
              let flowfieldName = []
              let flowfieldNameCustomer = []
              if (rs[0].multiDueDate === null || rs[0].multiDueDate === '') {
                this.multiDueDate = 'False'
              } else {
                this.multiDueDate = rs[0].multiDueDate
              }
              if (rs[0].showTime === null || rs[0].showTime === '') {
                this.showTime = 'แสดง'
              } else {
                this.showTime = rs[0].showTime
              }
              if (rs[0].showMap === null || rs[0].showMap === '') {
                this.showMap = 'ไม่แสดง'
              } else {
                this.showMap = rs[0].showMap
              }
              if (rs[0].showUpload1 === null || rs[0].showUpload1 === '') {
                this.showUpload1 = 'False'
              } else {
                this.showUpload1 = rs[0].showUpload1
              }
              if (rs[0].showUpload2 === null || rs[0].showUpload2 === '') {
                this.showUpload2 = 'False'
              } else {
                this.showUpload2 = rs[0].showUpload2
              }
              if (rs[0].statusEngPayment === null || rs[0].statusEngPayment === '') {
                this.statusEngPayment = 'False'
              } else {
                this.statusEngPayment = rs[0].statusEngPayment
              }
              this.showLimitBooking = rs[0].showLimitBooking || 'False'
              flowfieldName = JSON.parse(rs[0].flowfieldName) || []
              flowfieldNameCustomer = JSON.parse(rs[0].flowfieldNameCustomer) || []
              for (let i = 0; i < flowfieldName.length; i++) {
                let d = flowfieldName[i]
                dataGet.itemIncustomField.push(d.fieldId)
              }
              for (let i = 0; i < flowfieldNameCustomer.length; i++) {
                let d = flowfieldNameCustomer[i]
                dataGet.itemIncustomFieldCustomer.push(d.fieldId)
              }
              console.log('dataGet', dataGet)
              // this.getCustomField(dataGet)
              this.getCustomField(dataGet)
            }
          } else {
            this.getCustomField(dataGet)
            // this.getCustomField(dataGet)
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async getCustomField (dataGet) {
      this.Fielditem = []
      await axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.shopId)
        .then(response => {
          let dt = response.data
          for (let i = 0; i < dt.length; i++) {
            let d = dt[i]
            let s = {}
            s.fieldId = d.fieldId
            s.fieldName = d.fieldName
            s.fieldNameEn = d.fieldNameEn
            s.fieldType = d.fieldType
            s.optionField = d.optionField
            s.conditionField = d.conditionField
            s.conditionValue = d.conditionValue
            s.shopId = d.shopId
            s.fieldValue = ''
            if (dataGet.itemIncustomField.filter((ID) => ID === d.fieldId).length > 0) {
              // console.log('itemIncustomField', d.fieldId)
              s.showitem = true
            } else {
              s.showitem = false
            }
            if (dataGet.itemIncustomFieldCustomer.filter((ID) => ID === d.fieldId).length > 0) {
              // console.log('itemIncustomFieldCustomer', d.fieldId)
              s.showitemCustomer = true
            } else {
              s.showitemCustomer = false
            }
            this.Fielditem.push(s)
          }
          let data1 = this.Fielditem.filter(el => parseInt(el.conditionField || 0) > 0)
          // let data2 = []
          for (let i = 0; i < data1.length; i++) {
            let d = data1[i]
            let indexC = this.Fielditem.findIndex(function (o) {
              return o.fieldId === d.fieldId
            })
            let indexF = this.Fielditem.findIndex(function (o) {
              return o.fieldId === parseInt(d.conditionField)
            })
            this.Fielditem.splice((indexF + 1), 0, this.Fielditem.splice(indexC, 1)[0])
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    // async getCustomField (item) {
    //   let checkdata = []
    //   this.Fielditem = []
    //   await axios
    //     .get(this.DNS_IP + '/customField/get?shopId=' + this.shopId)
    //     .then(response => {
    //       let dt = response.data
    //       for (let i = 0; i < dt.length; i++) {
    //         let d = dt[i]
    //         checkdata.push(d.fieldId)
    //       }
    //     })
    //     .catch(error => {
    //       console.log('error function addData : ', error)
    //     })
    //   let fieldAll = checkdata.filter(function (x) {
    //     return !item.includes(x)
    //   })
    //   if (item.length > 0) {
    //     console.log('IF!1')
    //     await this.getCustomFieldData(item, true)
    //   }
    //   if (fieldAll.length > 0) {
    //     console.log('IF!2')
    //     await this.getCustomFieldData(fieldAll, false)
    //   }
    // },
    // async getCustomFieldData (fieldSet, showItem) {
    //   console.log('@#$@#$@#$@#$@#$#', fieldSet, showItem)
    //   await axios
    //     .get(this.DNS_IP + '/customField/fieldId?fieldId=' + fieldSet)
    //     .then(async response => {
    //       let rs = response.data
    //       // let aa = []
    //       for (let i = 0; i < rs.length; i++) {
    //         let d = rs[i]
    //         let s = {}
    //         s.fieldId = d.fieldId
    //         s.fieldName = d.fieldName
    //         s.fieldNameEn = d.fieldNameEn
    //         s.fieldType = d.fieldType
    //         s.optionField = d.optionField
    //         s.conditionField = d.conditionField
    //         s.conditionValue = d.conditionValue
    //         s.shopId = d.shopId
    //         s.fieldValue = ''
    //         s.showitem = showItem
    //         this.Fielditem.push(s)
    //       }
    //       console.log('!#!@#', this.Fielditem)
    //       console.log('!#!@#', this.Fielditem.filter(el => parseInt(el.conditionField || 0) > 0))
    //       let data1 = this.Fielditem.filter(el => parseInt(el.conditionField || 0) > 0)
    //       // let data2 = []
    //       for (let i = 0; i < data1.length; i++) {
    //         let d = data1[i]
    //         let indexC = this.Fielditem.findIndex(function (o) {
    //           return o.fieldId === d.fieldId
    //         })
    //         let indexF = this.Fielditem.findIndex(function (o) {
    //           return o.fieldId === parseInt(d.conditionField)
    //         })
    //         this.Fielditem.splice((indexF + 1), 0, this.Fielditem.splice(indexC, 1)[0])
    //       }
    //     })
    //     .catch(error => {
    //       console.log('error function addData : ', error)
    //     })
    // },
    async addBooking () {
      this.dataReady = true
      let booking = {}
      let UpdateField = []
      let UpdateFieldCustomer = []
      // this.Redirect = this.DNS_IP + '/booking?shopId=' + this.$route.query.shopId
      for (let i = 0; i < this.Fielditem.length; i++) {
        let d = this.Fielditem[i]
        if (d.showitem === true) {
          UpdateField.push({
            fieldId: d.fieldId
          })
        }
        if (d.showitemCustomer === true) {
          UpdateFieldCustomer.push({
            fieldId: d.fieldId
          })
        }
      }
      console.log('update', this.Fielditem)
      booking.flowfieldName = JSON.stringify(UpdateField)
      booking.flowfieldNameCustomer = JSON.stringify(UpdateFieldCustomer)
      booking.shopId = this.shopId
      booking.showTime = this.showTime
      booking.showMap = this.showMap
      booking.multiDueDate = this.multiDueDate
      booking.showLimitBooking = this.showLimitBooking
      booking.statusEngPayment = this.statusEngPayment
      booking.LAST_USER = this.session.data.userName
      booking.checkLocationStatus = this.checkLocationStatus
      booking.liffSendMessageAfterBookingStatus = this.liffSendMessageAfterBookingStatus
      if (this.checkLocationStatus === 'True') {
        if (this.shopLat !== '' && this.shopLong !== '' && this.distanceSet !== '') {
          booking.shopLat = this.shopLat
          booking.shopLong = this.shopLong
          booking.distanceSet = this.distanceSet
          booking.checkLocationStatus = this.checkLocationStatus
          console.log('dtbooking', booking)
          this.$swal({
            title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#b3b1ab',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
          })
            .then(async result => {
              await this.saveBooking(booking)
            })
            .catch(error => {
              this.dataReady = false
              console.log('Cencel : ', error)
            })
        } else {
          this.dataReady = false
          this.$swal('ผิดพลาด', 'กรุณาใส่ข้อมูล ระบบจองในพื้นืี่ ในครบ', 'info')
        }
      } else {
        console.log('dtbooking', booking)
        this.$swal({
          title: 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        })
          .then(async result => {
            await this.saveBooking(booking)
          })
          .catch(error => {
            this.dataReady = false
            console.log('Cencel : ', error)
          })
      }
    },
    async saveBooking (booking) {
      if (this.IdUpdate === 'noData') {
        this.$swal('กรุณาลองใหม่อีกครั้ง', ' ', 'error')
        await this.getBookingField()
        if (this.editBycustomField === 'True') {
          this.dialogchekField = false
        }
        this.dataReady = false
      } else {
        booking.CREATE_USER = this.session.data.userName
        await axios
          .post(this.DNS_IP + '/BookingField/edit/' + this.IdUpdate, booking)
          .then(async response => {
            for (let i = 0; i < this.Fielditem.length; i++) {
              let d = this.Fielditem[i]
              let showcarditem = {
                showCard: d.showcard
              }
              await axios
                .post(
                  this.DNS_IP + '/customField/edit/' + d.fieldId,
                  showcarditem
                )
                .then(response => {})
                .catch(error => {
                  console.log('error function addData : ', error)
                })
            }

            this.$swal('บันทึกข้อมูลเรียบร้อย', ' ', 'success')
            await this.getBookingField()
            if (this.editBycustomField === 'True') {
              this.dialogchekField = false
            }
            this.dataReady = false
            console.log(`addDataGlobal DNS_IP`, response)
          })
          .catch(error => {
            console.log('error function addData : ', error)
            this.dataReady = false
          })
      }
    },
    updateTypeJob () {
      this.validate('updateTypeJob')
      setTimeout(() => this.updateTypeJobSubmit(), 500)
    },
    updateTypeJobSubmit () {
      if (this.validJob !== false) {
        this.dataReady = true
        let url = '/BookingField/edit/' + this.IdUpdate
        let dt = {
          typeJob1: this.dataTypeJob1,
          typeJob2: this.dataTypeJob2,
          typeJob3: this.dataTypeJob3,
          LAST_USER: this.session.data.userName
        }
        axios
          .post(this.DNS_IP + url, dt)
          .then(async response => {
            this.$swal('สำเร็จ', 'เปลี่ยนแปลงเรียบร้อย', 'success')
            await this.getBookingField()
            this.dataReady = false
          })
      }
    },
    updateTypeProcess () {
      this.validate('updateTypeProcess')
      setTimeout(() => this.updateTypeProcessSubmit(), 500)
    },
    updateTypeProcessSubmit () {
      if (this.validJob !== false) {
        this.dataReady = true
        let url = '/BookingField/edit/' + this.IdUpdate
        let dt = {
          typeProcess1: this.dataTypeProcess1,
          typeProcess2: this.dataTypeProcess2,
          typeProcess3: this.dataTypeProcess3,
          typeProcess4: this.dataTypeProcess4,
          LAST_USER: this.session.data.userName
        }
        axios
          .post(this.DNS_IP + url, dt)
          .then(async response => {
            this.$swal('สำเร็จ', 'เปลี่ยนแปลงเรียบร้อย', 'success')
            await this.getBookingField()
            this.dataReady = false
          })
      }
    },
    updateUploadFile () {
      this.dataReady = true
      let url = '/BookingField/edit/' + this.IdUpdate
      let dt = {
        showUpload1: this.showUpload1,
        showUpload2: this.showUpload2,
        textUpload1: this.textUpload1 || 'Upload File 1',
        textUpload2: this.textUpload2 || 'Upload File 2',
        LAST_USER: this.session.data.userName
      }
      axios
        .post(this.DNS_IP + url, dt)
        .then(async response => {
          this.$swal('สำเร็จ', 'เปลี่ยนแปลงเรียบร้อย', 'success')
          await this.getBookingField()
          this.dataReady = false
        })
    }
    // FunCopy () {
    //   var copyText = document.getElementById('myInput')
    //   copyText.select()
    //   copyText.setSelectionRange(0, 99999)
    //   navigator.clipboard.writeText(copyText.value)
    // }
  }
}
</script>

<style scoped>
.button {
  width: 45%;
  color: #fff;
  font-weight: 200;
  letter-spacing: 1px;
  margin: 6px 3px;
  padding: 10px 28px;
  border-radius: 25px !important;
  background-color: #0047A5;
}
.v-simple-checkbox .v-icon {
    cursor: pointer !important;
    color: #1b437c !important;
}
span.v-btn__content {
  color: #1b437c !important;
}
.main {
  margin-top: 1rem;
  min-height: 700px;
}
.Bar {
  padding: 10px;
  background-color: #ffffff;
  height: 100%;
  width: 400px;
}
.Review {
  padding: 20px, 20px, 20px, 20px;
}
.content {
  overflow: auto;
  white-space: normal;
}
.a {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
}
.continer {
  padding: 20px, 20px, 20px, 20px;
}
</style>
