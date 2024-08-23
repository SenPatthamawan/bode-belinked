<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
          <v-col cols="6" class="v-margit_button text-right">
            <v-btn
              color="#1B437C"
              style="z-index:8;"
              id="v-step-0"
              depressed
              dark
              @click="(dialogAdd = true), validate('ADD'), formAdd.masBranchID = branch[0].value, formAdd.flowId = DataFlowName[0].value"
            >
              <v-icon left>mdi-text-box-plus</v-icon>
              เพิ่ม
            </v-btn>
            <v-btn
              color="#1B437C"
              style="z-index:8;"
              id="v-step-0"
              depressed
              dark
              @click="setPreset()"
            >
              <v-icon left>mdi-expand-all-outline</v-icon>
              เพิ่มแบบ Preset
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- Add data -->
          <v-dialog v-model="dialogAdd" persistent max-width="70%">
            <v-card class="text-center">
              <v-form ref="form_add" v-model="validAdd" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-col class="text-right">
                      <v-btn
                        small
                        color="#E0E0E0"
                        @click=";(dialogAdd = false), clearAdd()"
                      >
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                    <v-row class="mb-6" justify="center" no-gutters>
                      <v-col md="auto">
                        <h2 style="font-size:10vw;" class="underline-06">จัดกลุ่มเป้าหมาย</h2>
                        <!-- <h1 style="color:black;"><strong>Forget Password?</strong></h1> -->
                      </v-col>
                    </v-row>
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
                        <div class="text-center">
                          <v-btn
                            dark
                            color="blue-grey"
                            class="ma-2 white--text"
                            @click="getDataAdd()"
                          >
                            Update
                            <v-icon right dark>
                              mdi-cloud-upload
                            </v-icon>
                          </v-btn>
                        </div>
                      </v-col>
                      <v-col cols="8" class="text-center pt-0">
                        <v-col cols="12" class="pb-0">
                            <v-text-field
                              label="ชื่อกลุ่มเป้าหมาย"
                              v-model="formAdd.audiencesName"
                              :rules="[rules.required]"
                              :counter="50"
                              maxlength="50"
                              outlined
                              dense
                              required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-select
                            label="เลือกกลุ่มเป้าหมาย"
                            :items="optionAudiences"
                            v-model="formAdd.audiencesSelect"
                            dense
                            @change="chkAudiencesSelect()"
                            outlined
                            :rules="[rules.required]"
                          ></v-select>
                        </v-col>
                        <template class="pb-0" v-if="formAdd.audiencesSelect === 'typeJob'">
                            <v-col cols="12" class="pb-0">
                              <v-select
                                label="เลือกสาขา"
                                v-model="formAdd.masBranchID"
                                :items="branch"
                                outlined
                                dense
                              ></v-select>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-select
                                  v-model="formAdd.flowId"
                                  :items="DataFlowName"
                                  label="ประเภทบริการ"
                                  outlined
                                  dense
                                ></v-select>
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
                                    @change="chkboxDisable('open')"
                                    v-model="formAdd.dateJobOpen"
                                  ></v-checkbox>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-menu
                                    v-model="menu1"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formAdd.startDate"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        :disabled="disableOpen"
                                        outlined
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="formAdd.startDate"
                                      :disabled="disableOpen"
                                      :max="formAdd.endDate"
                                      @input="menu1 = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-menu
                                    v-model="menu2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formAdd.endDate"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        :disabled="disableOpen"
                                        outlined
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      :min="formAdd.startDate"
                                      :disabled="disableOpen"
                                      v-model="formAdd.endDate"
                                      @input="menu2 = false"
                                    ></v-date-picker>
                                  </v-menu>
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
                                    true-value="True"
                                    @change="chkboxDisable('close')"
                                    v-model="formAdd.dateJobClose"
                                  ></v-checkbox>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-menu
                                    v-model="menu3"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formAdd.startDateClose"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        outlined
                                        :disabled="disableClose"
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="formAdd.startDateClose"
                                      :disabled="disableClose"
                                      :max="formAdd.endDateClose"
                                      @input="menu3 = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-menu
                                    v-model="menu4"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formAdd.endDateClose"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        outlined
                                        :disabled="disableClose"
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      :min="formAdd.startDateClose"
                                      v-model="formAdd.endDateClose"
                                      :disabled="disableClose"
                                      @input="menu4 = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                              </v-row>
                            </v-col>
                        </template>
                        <template class="pb-0" v-if="formAdd.audiencesSelect === 'bookingDate'">
                          <v-col cols="12" class="pb-0">
                            <v-select
                              label="เลือกสาขา"
                              v-model="formAdd.masBranchID"
                              :items="branch"
                              outlined
                              dense
                            ></v-select>
                          </v-col>
                          <v-col cols="12" class="pb-0">
                            <v-select
                                v-model="formAdd.flowId"
                                :items="DataFlowName"
                                label="ประเภทบริการ"
                                outlined
                                dense
                              ></v-select>
                          </v-col>
                          <v-col cols="12" class="pb-0">
                            <v-row>
                              <v-subheader id="subtext"
                              >เลือกวันที่ที่ต้องการ</v-subheader
                              >
                            </v-row>
                            <v-row>
                              <v-col cols="6" class="pa-0">
                                <v-menu
                                  v-model="menu1"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="formAdd.startDate"
                                      prepend-icon="mdi-calendar"
                                      label=""
                                      v-bind="attrs"
                                      outlined
                                      readonly
                                      dense
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="formAdd.startDate"
                                    :max="formAdd.endDate"
                                    @input="menu1 = false"
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                              <v-col cols="6" class="pa-0">
                                <v-menu
                                  v-model="menu2"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="formAdd.endDate"
                                      prepend-icon="mdi-calendar"
                                      label=""
                                      v-bind="attrs"
                                      readonly
                                      outlined
                                      dense
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    :min="formAdd.startDate"
                                    v-model="formAdd.endDate"
                                    @input="menu2 = false"
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                            </v-row>
                          </v-col>
                        </template>
                        <template class="pb-0" v-if="formAdd.audiencesSelect === 'rating'">
                          <v-col cols="12" class="pb-0">
                            <v-row>
                              <v-subheader id="subtext"
                              >เลือกคะแนนที่ต้องการ</v-subheader
                              >
                            </v-row>
                            <v-row>
                              <v-col cols="6" class="pt-0 pb-0">
                                <VuetifyMoney
                                  v-model="formAdd.startRating"
                                  dense
                                  required
                                  outlined
                                  v-bind:options="options2"
                                />
                              </v-col>
                              <v-col cols="6" class="pt-0 pb-0">
                                <VuetifyMoney
                                  v-model="formAdd.endRating"
                                  dense
                                  required
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
                                <v-menu
                                  v-model="menu1"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="formAdd.startDate"
                                      prepend-icon="mdi-calendar"
                                      label=""
                                      v-bind="attrs"
                                      readonly
                                      outlined
                                      dense
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="formAdd.startDate"
                                    :max="formAdd.endDate"
                                    @input="menu1 = false"
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                              <v-col cols="6" class="pa-0">
                                <v-menu
                                  v-model="menu2"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="formAdd.endDate"
                                      prepend-icon="mdi-calendar"
                                      label=""
                                      v-bind="attrs"
                                      outlined
                                      readonly
                                      dense
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    :min="formAdd.startDate"
                                    v-model="formAdd.endDate"
                                    @input="menu2 = false"
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                            </v-row>
                          </v-col>
                        </template>
                        <template class="pb-0" v-if="formAdd.audiencesSelect === 'typeCustomField' && dataCustom.length > 0">
                          <v-col cols="12" class="pb-0">
                            <v-row>
                              <v-col cols="6">
                                <v-row>
                                  <v-subheader id="subtext"
                                  >เลือกช่องกรอกข้อมูล</v-subheader
                                  >
                                </v-row>
                                <v-row>
                                  <v-select
                                    v-model="formAdd.fieldId"
                                    :items="dataCustom"
                                    @change="getDataOptionField()"
                                    solo
                                    dense
                                  ></v-select>
                                </v-row>
                              </v-col>
                              <v-col cols="6">
                                <v-row>
                                  <v-subheader id="subtext"
                                  >เลือกข้อมูลของช่องกรอกข้อมูล</v-subheader
                                  >
                                </v-row>
                                <v-row>
                                  <v-select
                                    v-model="formAdd.optionFieldValue"
                                    :items="dataOptionField"
                                    solo
                                    dense
                                  ></v-select>
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
                                  <v-select
                                    v-model="formAdd.selectData"
                                    :items="dataSelectData"
                                    solo
                                    dense
                                  ></v-select>
                                </v-row>
                              </v-col>
                              <v-col cols="6" class="pb-0">
                                <v-row>
                                  <v-subheader id="subtext"
                                  >เลือกสาขา</v-subheader
                                  >
                                </v-row>
                                <v-row>
                                  <v-select
                                    v-model="formAdd.masBranchID"
                                    :items="branch"
                                    solo
                                    dense
                                  ></v-select>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-col>
                        </template>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-form>
              <v-card-actions id="v-step-1">
                <v-col id="margin">
                  <v-row justify="center">
                    <v-btn
                      dark
                      elevation="2"
                      x-large
                      color="#173053"
                      :disabled="!validAdd"
                      @click="addData()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      เพิ่ม
                    </v-btn>
                  </v-row>
                </v-col>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Preset data -->
          <v-dialog v-model="dialogPreset" persistent max-width="70%">
            <v-card>
                <v-card-text>
                    <v-col class="text-right">
                      <v-btn
                        small
                        color="#E0E0E0"
                        @click=";(dialogPreset = false)"
                      >
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                    <v-row class="mb-6" justify="center" no-gutters>
                      <v-col md="auto">
                        <h2 style="font-size:10vw;" class="underline-06">จัดกลุ่มเป้าหมาย Preset</h2>
                        <!-- <h1 style="color:black;"><strong>Forget Password?</strong></h1> -->
                      </v-col>
                    </v-row>
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
                        {{showPreset}}
                      </v-col>
                      <v-col cols="8" class="pt-0">
                         <v-row>
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
                                  placeholder="ชื่อกลุ่มเป้าหมาย"
                                  v-model="formAdd.audiencesName"
                                  :rules="[rules.required]"
                                  :counter="50"
                                  maxlength="50"
                                  solo
                                  dense
                                  required
                                ></v-text-field>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-chip-group
                            active-class="primary--text"
                            column
                            mandatory
                          >
                            <v-chip
                              @click="countPreset(item)"
                              v-for="(item, index) in dataPreset" :key="index"
                            >
                              {{ item.namePreset }}
                            </v-chip>
                          </v-chip-group>
                        </v-col>
                        <!-- <v-col cols="6" class="pb-0" v-for="(item, index) in dataPreset" :key="index">
                          <v-btn
                              small
                              color="#173053"
                              @click="countPreset(item)"
                            >
                              {{item.namePreset}}
                            </v-btn>
                        </v-col> -->
                         </v-row>
                      </v-col>
                    </v-row>
                </v-card-text>
              <v-card-actions id="v-step-1">
                <v-col id="margin">
                  <v-row justify="center">
                    <v-btn
                      dark
                      elevation="2"
                      x-large
                      color="#173053"
                      @click="addDataPreset()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      เพิ่ม
                    </v-btn>
                  </v-row>
                </v-col>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Update data -->
          <v-dialog v-model="dialogEdit" persistent max-width="70%">
            <v-card class="text-center">
              <v-form ref="form_update" v-model="validUpdate" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-col class="text-right">
                      <v-btn
                        small
                        color="#E0E0E0"
                        @click="(dialogEdit = false), clearEdit()"
                      >
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                    <v-row class="mb-6" justify="center" no-gutters>
                      <v-col md="auto">
                        <h2 style="font-size:10vw;" class="underline-06">แก้ไขกลุ่มเป้าหมาย</h2>
                        <!-- <h1 style="color:black;"><strong>Forget Password?</strong></h1> -->
                      </v-col>
                    </v-row>
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
                        <div class="text-center">
                          <v-btn
                            dark
                            color="blue-grey"
                            class="ma-2 white--text"
                            @click="getDataUpdate()"
                          >
                            Update
                            <v-icon right dark>
                              mdi-cloud-upload
                            </v-icon>
                          </v-btn>
                        </div>
                      </v-col>
                      <v-col cols="8" class="text-center pt-0">
                        <v-col cols="12" class="pb-0">
                          <v-text-field
                            label="ชื่อกลุ่มเป้าหมาย"
                            v-model="formUpdate.audiencesName"
                            :rules="[rules.required]"
                            :counter="50"
                            maxlength="50"
                            outlined
                            dense
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-select
                            label="เลือกกลุ่มเป้าหมาย"
                            :items="optionAudiences"
                            v-model="formUpdate.audiencesSelect"
                            dense
                            @change="chkAudiencesSelectUpdate()"
                            outlined
                            :rules="[rules.required]"
                          ></v-select>
                        </v-col>
                        <template class="pb-0" v-if="formUpdate.audiencesSelect === 'typeJob'">
                            <v-col cols="12" class="pb-0">
                              <v-select
                                label="เลือกสาขา"
                                v-model="formUpdate.masBranchID"
                                :items="branch"
                                outlined
                                dense
                              ></v-select>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-select
                                  v-model="formUpdate.flowId"
                                  :items="DataFlowName"
                                  label="ประเภทบริการ"
                                  outlined
                                  dense
                                ></v-select>
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
                                    @change="chkboxDisableUpdate('open')"
                                    v-model="formUpdate.dateJobOpen"
                                  ></v-checkbox>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-menu
                                    v-model="menu5"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formUpdate.startDate"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        :disabled="disableOpen"
                                        readonly
                                        outlined
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="formUpdate.startDate"
                                      :disabled="disableOpen"
                                      :max="formUpdate.endDate"
                                      @input="menu5 = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-menu
                                    v-model="menu6"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formUpdate.endDate"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        :disabled="disableOpen"
                                        readonly
                                        outlined
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      :min="formUpdate.startDate"
                                      :disabled="disableOpen"
                                      v-model="formUpdate.endDate"
                                      @input="menu6 = false"
                                    ></v-date-picker>
                                  </v-menu>
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
                                    true-value="True"
                                    @change="chkboxDisableUpdate('close')"
                                    v-model="formUpdate.dateJobClose"
                                  ></v-checkbox>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-menu
                                    v-model="menu7"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formUpdate.startDateClose"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        outlined
                                        readonly
                                        :disabled="disableClose"
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="formUpdate.startDateClose"
                                      :disabled="disableClose"
                                      :max="formUpdate.endDateClose"
                                      @input="menu7 = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="5" class="pa-0">
                                  <v-menu
                                    v-model="menu8"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formUpdate.endDateClose"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        outlined
                                        readonly
                                        :disabled="disableClose"
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      :min="formUpdate.startDateClose"
                                      v-model="formUpdate.endDateClose"
                                      :disabled="disableClose"
                                      @input="menu8 = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                              </v-row>
                            </v-col>
                        </template>
                        <template class="pb-0" v-if="formUpdate.audiencesSelect === 'bookingDate'">
                            <v-col cols="12" class="pb-0">
                              <v-select
                                v-model="formUpdate.masBranchID"
                                :items="branch"
                                label="เลือกสาขา"
                                outlined
                                dense
                              ></v-select>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-select
                                  v-model="formUpdate.flowId"
                                  :items="DataFlowName"
                                  label="ประเภทบริการ"
                                  outlined
                                  dense
                                ></v-select>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-row>
                                <v-subheader id="subtext"
                                >เลือกวันที่ที่ต้องการ</v-subheader
                                >
                              </v-row>
                              <v-row>
                                <v-col cols="6" class="pa-0">
                                  <v-menu
                                    v-model="menu5"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formUpdate.startDate"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        readonly
                                        outlined
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="formUpdate.startDate"
                                      :max="formUpdate.endDate"
                                      @input="menu5 = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="6" class="pa-0">
                                  <v-menu
                                    v-model="menu6"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formUpdate.endDate"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        readonly
                                        outlined
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      :min="formUpdate.startDate"
                                      v-model="formUpdate.endDate"
                                      @input="menu6 = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                              </v-row>
                            </v-col>
                        </template>
                          <template class="pb-0" v-if="formUpdate.audiencesSelect === 'rating'">
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
                                    outlined
                                    v-bind:options="options2"
                                  />
                                </v-col>
                                <v-col cols="6" class="pt-0 pb-0">
                                  <VuetifyMoney
                                    v-model="formUpdate.endRating"
                                    dense
                                    required
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
                                  <v-menu
                                    v-model="menu5"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formUpdate.startDate"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        readonly
                                        outlined
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="formUpdate.startDate"
                                      :max="formUpdate.endDate"
                                      @input="menu5 = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="6" class="pa-0">
                                  <v-menu
                                    v-model="menu6"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="formUpdate.endDate"
                                        prepend-icon="mdi-calendar"
                                        label=""
                                        v-bind="attrs"
                                        readonly
                                        outlined
                                        dense
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      :min="formUpdate.startDate"
                                      v-model="formUpdate.endDate"
                                      @input="menu6 = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </template>
                        <template class="pb-0" v-if="formUpdate.audiencesSelect === 'typeCustomField' && dataCustom.length > 0">
                            <v-col cols="6" class="pb-0">
                              <v-select
                                v-model="formUpdate.fieldId"
                                :items="dataCustom"
                                outlined
                                @change="getDataOptionFieldUpdate()"
                                label="เลือกช่องกรอกข้อมูล"
                                dense
                              ></v-select>
                            </v-col>
                            <v-col cols="6">
                              <v-select
                                v-model="formUpdate.optionFieldValue"
                                :items="dataOptionField"
                                label="เลือกข้อมูลของช่องกรอกข้อมูล"
                                outlined
                                dense
                              ></v-select>
                            </v-col>
                            <v-col cols="6" class="pb-0">
                              <v-select
                                v-model="formUpdate.selectData"
                                :items="dataSelectData"
                                outlined
                                dense
                                label="เลือกแหล่งที่มาของข้อมูล"
                              ></v-select>
                            </v-col>
                            <v-col cols="6" class="pb-0">
                              <v-select
                                label="เลือกสาขา"
                                v-model="formUpdate.masBranchID"
                                :items="branch"
                                outlined
                                dense
                              ></v-select>
                            </v-col>
                            </template>
                        </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-form>
              <v-card-actions id="v-step-1">
                <v-col id="margin">
                  <v-row justify="center">
                    <v-btn
                      dark
                      elevation="2"
                      x-large
                      color="#173053"
                      :disabled="!validUpdate"
                      @click="editData()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      แก้ไข
                    </v-btn>
                  </v-row>
                </v-col>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- delete -->
          <v-dialog v-model="dialogDelete" persistent max-width="50%">
            <v-card>
              <v-card-title>
                <span class="headline">ลบข้อมูลนี้</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Audiences Id"
                        v-model="formUpdate.id"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="ชื่อกลุ่มเป้าหมาย"
                        v-model="formUpdate.audiencesName"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  elevation="2"
                  x-large
                  class="btn-color"
                  @click="dialogDelete = false"
                >
                  <v-icon left> mdi-cancel</v-icon>
                  ปิด
                </v-btn>
                <v-btn elevation="2" x-large color="red" @click="deleteData()">
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  ลบ
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- data tabel -->
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
                    {{ format_dateFUllTime(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                    {{ format_dateFUllTime(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <!-- <v-btn
                      class="btn-color"
                      fab
                      small
                      @click.stop=";(dialogData = true), getDataBordcast(item)"
                    >
                      <v-icon dark> mdi-bullhorn </v-icon>
                    </v-btn> -->
                    <v-btn
                      class="btn-color"
                      fab
                      dark
                      v-if="item.audiencesSelect !== 'Preset'"
                      id="v-step-2"
                      small
                      @click.stop="
                        (dialogEdit = true),
                          getDataById(item, 'update'),
                          validate('UPDATE')
                      "
                    >
                      <v-icon dark> mdi-tools </v-icon>
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
        </v-row>
      </div>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import axios from 'axios' // api
import DateRangePicker from 'vue2-daterange-picker'
// you need to import the CSS manually
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
export default {
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    DateRangePicker,
    waitingAlert
  },
  data () {
    return {
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      menu6: false,
      menu7: false,
      menu8: false,
      path: '/audiences/', // Path Model
      returnLink: '/tool/Audience',
      session: this.$session.getAll(),
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'กลุ่มเป้าหมาย',
          disabled: false,
          href: '/tool/Audience'
        }
      ],
      code: 'AD_', // Generate Code
      valueAdd: 0,
      dataAdd: 0,
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 1,
        precision: 0
      },
      dialogData: false,
      rules: {
        required: value => !!value || 'กรุณากรอก.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      formAdd: {
        audiencesName: '',
        selectData: 'booking', //
        flowId: '', //
        fieldId: '', //
        optionFieldValue: '', //
        startDate: this.momenDate_1(new Date()), //
        endDate: this.momenDate_1(new Date()), //
        startDateClose: this.momenDate_1(new Date()), //
        endDateClose: this.momenDate_1(new Date()), //
        audiencesSelect: 'bookingDate', //
        startRating: 0, //
        endRating: 0, //
        shopId: this.$session.getAll().data.shopId, //
        masBranchID: '', //
        dateJobOpen: 'False', //
        dateJobClose: 'False', //
        CREATE_USER: '',
        LAST_USER: ''
      },
      formUpdate2: null,
      formUpdate: {
        id: '',
        audiencesName: '',
        selectData: 'booking', //
        flowId: '', //
        fieldId: '', //
        optionFieldValue: '', //
        startDate: this.momenDate_1(), //
        endDate: this.momenDate_1(), //
        startDateClose: this.momenDate_1(), //
        endDateClose: this.momenDate_1(), //
        audiencesSelect: 'bookingDate', //
        startRating: 0, //
        endRating: 0, //
        shopId: this.$session.getAll().data.shopId, //
        masBranchID: '', //
        dateJobOpen: 'False', //
        dateJobClose: 'False', //
        CREATE_USER: '',
        LAST_USER: ''
      },
      columns: [
        { text: 'กลุ่มเป้าหมาย', value: 'audiencesName' },
        { text: 'ประเภทกลุ่มเป้าหมาย', value: 'audiencesSelectText' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
        { text: 'จัดการ', value: 'action', sortable: false, align: 'center' }
      ],
      columns1: [
        { text: 'บอร์ดแคช', value: 'message' },
        { text: 'ประเภท', value: 'module' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        { text: 'วันที่อัพเดท', value: 'LAST_DATE' }
      ],
      optionAudiences: [
        { text: 'วันที่นัดหมาย', value: 'bookingDate' },
        { text: 'ประเภทบริการ', value: 'typeJob' },
        // { text: 'วันที่รับงาน', value: 'openJobDate' },
        // { text: 'วันที่ปิดงาน', value: 'closeJobDate' },
        { text: 'คะแนนความพึงพอใจ', value: 'rating' },
        { text: 'ประเภทการกรอก', value: 'typeCustomField' }
      ],
      dataSelectData: [
        { text: 'จากข้อมูล นัดหมาย', value: 'booking' },
        { text: 'จากข้อมูล งาน', value: 'job' }
      ],
      // End Menu Config
      dataReady: true,
      menu: false,
      searchAll2: '',
      searchAll3: '',
      dialogAdd: false,
      dialogEdit: false,
      dialogPreset: false,
      disableOpen: true,
      disableClose: true,
      dialogDelete: false,
      validUpdate: true,
      validAdd: true,
      dataItem: [],
      branch: [],
      DataFlowName: [],
      dataCustom: [],
      dataOptionField: [],
      dataPreset: [],
      itemPreset: {},
      showPreset: ''
    }
  },
  beforeCreate () {
    if (!this.$session.exists()) {
      this.$router.push('/Core/Login')
    }
  },
  async mounted () {
    this.getData()
    this.getDataBranch()
    this.getDataFlow()
  },
  methods: {
    async countPreset (item) {
      this.itemPreset = item
      console.log(item)
      this.valueAdd = 0
      this.dataAdd = 0
      var num = 0
      this.showPreset = item.namePreset
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/member/get?shopId=' + this.session.data.shopId
        )
        .then(async response => {
          console.log('member', response.data)
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
              // eslint-disable-next-line quotes
              this.DNS_IP + '/job/getAudiencePreset?shopId=' +
            this.session.data.shopId +
            '&flowId=' + item.refId +
            '&statusPreset=' + item.statusPreset +
            '&datePreset=' + item.datePreset
            )
            .then(async res => {
              console.log('getAudiencePreset', res.data)
              if (res.data.status === false) {
                this.valueAdd = parseInt((0 / num) * 100)
                this.dataAdd = 0
              } else {
                this.valueAdd = parseInt((res.data.length / num) * 100)
                this.dataAdd = res.data.length
              }
            })
        })
    },
    setPreset () {
      this.dataPreset = []
      var dataFlow = this.DataFlowName.filter(el => {
        return el.value !== 'allFlow'
      })
      if (dataFlow.length > 0) {
        this.dialogPreset = true
        let datePreset = [{date: 7}, {date: 30}]
        for (var i = 0; i < dataFlow.length; i++) {
          var d = dataFlow[i]
          for (var x = 0; x < datePreset.length; x++) {
            var b = datePreset[x]
            var s = {}
            s.statusPreset = 'Preset'
            s.typePreSet = 'flow'
            s.refId = d.flowId
            switch (b.date) {
              case 7:
                s.namePreset = d.flowName + ' ( เข้ามาล่าสุดอาทิตย์ที่แล้ว )'
                s.datePreset = 7
                this.dataPreset.push(s)
                break
              case 30:
                s.namePreset = d.flowName + ' ( เข้ามาล่าสุดเดือนที่แล้ว )'
                s.datePreset = 30
                this.dataPreset.push(s)
                break
            }
          }
          // s.refId = d.
        }
      } else {
        this.$swal('ผิดพลาด', 'ไม่มีข้อมูล Preset', 'error')
        this.dialogPreset = false
      }
    },
    async getData () {
      this.dataItem = []
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
              if (d.audiencesSelect !== 'Preset') {
                d.audiencesSelectText = this.optionAudiences.filter(el => el.value === d.audiencesSelect)[0].text
              } else {
                d.audiencesSelectText = 'Preset : ' + d.namePreset
              }
              this.dataItem.push(d)
              // console.log('dtdtdtdt', this.branch)
            }
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
    getDataOptionField () {
      this.dataOptionField = []
      axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.session.data.shopId + '&fieldId=' + this.formAdd.fieldId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.dataOptionField = JSON.parse(rs[0].optionField)
            this.formAdd.optionFieldValue = this.dataOptionField[0].value
            // for (var i = 0; i < rs.length; i++) {
            //   var d = rs[i]
            //   d.text = d.fieldName
            //   d.value = d.fieldId
            //   this.dataOptionField.push(d)
            // }
          } else {
            this.dataOptionField = ''
          }
        })
    },
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
            this.formAdd.fieldId = this.dataCustom[0].value
            this.getDataOptionField()
          } else {
            this.dataCustom = []
            this.$swal('ผิดพลาด', 'คุณไม่มี ประเภทการกรอก ที่ไม่ตรงเงื่อน', 'error')
          }
        })
    },
    chkboxDisable (item) {
      if (item === 'open') {
        if (this.formAdd.dateJobOpen === 'True') {
          this.disableOpen = false
        } else {
          this.disableOpen = true
        }
      } else if (item === 'close') {
        if (this.formAdd.dateJobClose === 'True') {
          this.disableClose = false
        } else {
          this.disableClose = true
        }
      }
    },
    chkAudiencesSelect () {
      if (this.formAdd.audiencesSelect === 'typeCustomField') {
        this.getDataCustomField()
      }
    },
    async getDataAdd () {
      this.valueAdd = 0
      this.dataAdd = 0
      var num = 0
      var url = ''
      var branchId = ''
      var flowId = ''
      if (this.formAdd.masBranchID === 'allBr') {
        branchId = ''
      } else {
        branchId = this.formAdd.masBranchID
      }
      if (this.formAdd.flowId === 'allFlow') {
        flowId = ''
      } else {
        flowId = this.formAdd.flowId
      }
      if (this.formAdd.audiencesSelect === 'bookingDate') {
        url = this.DNS_IP + '/booking_view/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRange=' + this.formAdd.startDate + '/' + this.formAdd.endDate
      } else if (this.formAdd.audiencesSelect === 'typeJob') {
        console.log(this.formAdd.dateJobOpen, this.formAdd.dateJobClose)
        if (this.formAdd.dateJobOpen === 'True' && this.formAdd.dateJobClose === 'True') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRange=' + this.formAdd.startDate + '/' + this.formAdd.endDate +
            '&dateRangeClose=' + this.formAdd.startDateClose + '/' + this.formAdd.endDateClose
        } else if (this.formAdd.dateJobOpen === 'True' && this.formAdd.dateJobClose === 'False') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRange=' + this.formAdd.startDate + '/' + this.formAdd.endDate
        } else if (this.formAdd.dateJobOpen === 'False' && this.formAdd.dateJobClose === 'True') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRangeClose=' + this.formAdd.startDateClose + '/' + this.formAdd.endDateClose
        } else if (this.formAdd.dateJobOpen === 'False' && this.formAdd.dateJobClose === 'False') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId
        }
      } else if (this.formAdd.audiencesSelect === 'rating') {
        url = this.DNS_IP + '/rating/getAudience?shopId=' +
            this.session.data.shopId +
            // '&masBranchID=' +
            // branchId +
            '&ratingRange=' + this.formAdd.startRating + '/' + this.formAdd.endRating +
            '&dateRange=' + this.formAdd.startDate + '/' + this.formAdd.endDate
      } else if (this.formAdd.audiencesSelect === 'typeCustomField') {
        if (this.formAdd.selectData === 'booking') {
          url = this.DNS_IP + '/BookingData/getAudience?shopId=' + this.session.data.shopId + '&fieldValue=' + this.formAdd.optionFieldValue +
          '&masBranchID=' + branchId
        } else if (this.formAdd.selectData === 'job') {
          url = this.DNS_IP + '/jobData/getAudience?shopId=' + this.session.data.shopId + '&fieldValue=' + this.formAdd.optionFieldValue +
          '&masBranchID=' + branchId
        }
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
              let dataUserLine = []
              if (res.data.status === false) {
                this.valueAdd = parseInt((0 / num) * 100)
                this.dataAdd = 0
                dataUserLine = []
              } else {
                for (var i = 0; i < res.data.length; i++) {
                  var d = res.data[i]
                  var s = {}
                  if (d.lineUserId === '' || d.lineUserId === null) {

                  } else {
                    s.lineUserId = d.lineUserId
                    s.picture = d.memberPicture
                    s.name = d.memberName
                    dataUserLine.push(s)
                  }
                }
                console.log('dataUserLine', dataUserLine)
                if (dataUserLine.length > 0) {
                  this.valueAdd = parseInt((dataUserLine.length / num) * 100)
                  this.dataAdd = dataUserLine.length
                } else {
                  this.valueAdd = parseInt((0 / num) * 100)
                  this.dataAdd = 0
                }
              }
            })
        })
    },
    addDataPreset () {
      if (this.formAdd.audiencesName !== '' && this.showPreset !== '') {
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
            var dt = {
              audiencesSelect: this.itemPreset.statusPreset,
              audiencesName: this.formAdd.audiencesName,
              flowId: this.itemPreset.flowId,
              datePreset: this.itemPreset.datePreset,
              namePreset: this.itemPreset.namePreset,
              refId: this.itemPreset.refId,
              typePreSet: this.itemPreset.typePreSet,
              shopId: this.$session.getAll().data.shopId, //
              CREATE_USER: this.$session.getAll().data.userName,
              LAST_USER: this.$session.getAll().data.userName
            }
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + '/audience/add',
                dt,
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
                this.dialogPreset = false

                // Load Data
                await this.clearAdd()
                await this.getData()
                this.itemPreset = {}
              })
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาใส่ชื่อ และเลือก Preset ให้เรียบร้อย', 'error')
      }
    },
    addData () {
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
          this.formAdd.CREATE_USER = this.$session.getAll().data.userName
          this.formAdd.LAST_USER = this.$session.getAll().data.userName
          var dt = {}
          if (this.formAdd.audiencesSelect === 'bookingDate') {
            dt = {
              audiencesName: this.formAdd.audiencesName,
              flowId: this.formAdd.flowId,
              startDate: this.formAdd.startDate,
              endDate: this.formAdd.endDate,
              audiencesSelect: this.formAdd.audiencesSelect,
              shopId: this.$session.getAll().data.shopId, //
              masBranchID: this.formAdd.masBranchID,
              CREATE_USER: this.formAdd.CREATE_USER,
              LAST_USER: this.formAdd.LAST_USER
            }
          } else if (this.formAdd.audiencesSelect === 'typeJob') {
            console.log(this.formAdd.dateJobOpen, this.formAdd.dateJobClose)
            if (this.formAdd.dateJobOpen === 'True' && this.formAdd.dateJobClose === 'True') {
              dt = {
                audiencesName: this.formAdd.audiencesName,
                flowId: this.formAdd.flowId,
                startDate: this.formAdd.startDate,
                endDate: this.formAdd.endDate,
                startDateClose: this.formAdd.startDateClose, //
                endDateClose: this.formAdd.endDateClose, //
                audiencesSelect: this.formAdd.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                dateJobOpen: 'True', //
                dateJobClose: 'True', //
                masBranchID: this.formAdd.masBranchID,
                CREATE_USER: this.formAdd.CREATE_USER,
                LAST_USER: this.formAdd.LAST_USER
              }
            } else if (this.formAdd.dateJobOpen === 'True' && this.formAdd.dateJobClose === 'False') {
              dt = {
                audiencesName: this.formAdd.audiencesName,
                flowId: this.formAdd.flowId,
                startDate: this.formAdd.startDate,
                endDate: this.formAdd.endDate,
                audiencesSelect: this.formAdd.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                dateJobOpen: 'True', //
                dateJobClose: 'False', //
                masBranchID: this.formAdd.masBranchID,
                CREATE_USER: this.formAdd.CREATE_USER,
                LAST_USER: this.formAdd.LAST_USER
              }
            } else if (this.formAdd.dateJobOpen === 'False' && this.formAdd.dateJobClose === 'True') {
              dt = {
                audiencesName: this.formAdd.audiencesName,
                flowId: this.formAdd.flowId,
                startDateClose: this.formAdd.startDateClose, //
                endDateClose: this.formAdd.endDateClose, //
                audiencesSelect: this.formAdd.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                dateJobOpen: 'False', //
                dateJobClose: 'True', //
                masBranchID: this.formAdd.masBranchID,
                CREATE_USER: this.formAdd.CREATE_USER,
                LAST_USER: this.formAdd.LAST_USER
              }
            } else if (this.formAdd.dateJobOpen === 'False' && this.formAdd.dateJobClose === 'False') {
              dt = {
                audiencesName: this.formAdd.audiencesName,
                flowId: this.formAdd.flowId,
                // endDateClose: this.formAdd.endDateClose, //
                audiencesSelect: this.formAdd.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                dateJobOpen: 'False', //
                dateJobClose: 'False', //
                masBranchID: this.formAdd.masBranchID,
                CREATE_USER: this.formAdd.CREATE_USER,
                LAST_USER: this.formAdd.LAST_USER
              }
            }
          } else if (this.formAdd.audiencesSelect === 'rating') {
            dt = {
              audiencesName: this.formAdd.audiencesName,
              startDate: this.formAdd.startDate,
              endDate: this.formAdd.endDate,
              audiencesSelect: this.formAdd.audiencesSelect,
              shopId: this.$session.getAll().data.shopId,
              startRating: this.formAdd.startRating,
              endRating: this.formAdd.endRating,
              CREATE_USER: this.formAdd.CREATE_USER,
              LAST_USER: this.formAdd.LAST_USER
            }
          } else if (this.formAdd.audiencesSelect === 'typeCustomField') {
            if (this.formAdd.selectData === 'booking') {
              dt = {
                audiencesName: this.formAdd.audiencesName,
                audiencesSelect: this.formAdd.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                fieldId: this.formAdd.fieldId,
                optionFieldValue: this.formAdd.optionFieldValue,
                selectData: this.formAdd.selectData,
                masBranchID: this.formAdd.masBranchID,
                CREATE_USER: this.formAdd.CREATE_USER,
                LAST_USER: this.formAdd.LAST_USER
              }
            } else if (this.formAdd.selectData === 'job') {
              dt = {
                audiencesName: this.formAdd.audiencesName,
                audiencesSelect: this.formAdd.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                fieldId: this.formAdd.fieldId,
                optionFieldValue: this.formAdd.optionFieldValue,
                selectData: this.formAdd.selectData,
                masBranchID: this.formAdd.masBranchID,
                CREATE_USER: this.formAdd.CREATE_USER,
                LAST_USER: this.formAdd.LAST_USER
              }
            }
          }
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + '/audience/add',
              dt,
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
              await this.clearAdd()
              await this.getData()
            })
        })
    },
    clearAdd () {
      this.formAdd.selectData = 'booking'
      this.formAdd.flowId = ''
      this.formAdd.audiencesName = ''
      this.formAdd.fieldId = ''
      this.formAdd.optionFieldValue = ''
      this.formAdd.startDate = this.momenDate_1(this.formAdd.startDate)
      this.formAdd.endDate = this.momenDate_1(this.formAdd.endDate)
      this.formAdd.startDateClose = this.momenDate_1(this.formAdd.startDateClose)
      this.formAdd.endDateClose = this.momenDate_1(this.formAdd.endDateClose)
      this.formAdd.audiencesSelect = 'bookingDate'
      this.formAdd.startRating = 0
      this.formAdd.endRating = 0
      this.formAdd.shopId = this.$session.getAll().data.shopId
      this.formAdd.masBranchID = ''
      this.formAdd.dateJobOpen = 'False'
      this.formAdd.dateJobClose = 'False'
      this.formAdd.CREATE_USER = ''
      this.formAdd.LAST_USER = ''
    },
    async getDataById (item, text) {
      if (text === 'update') {
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
          this.formUpdate.flowId = flowIds
          this.formUpdate.startDate = this.momenDate_1(item.startDate)
          this.formUpdate.endDate = this.momenDate_1(item.endDate)
          this.formUpdate.audiencesSelect = item.audiencesSelect
          this.formUpdate.shopId = this.$session.getAll().data.shopId //
          this.formUpdate.masBranchID = masBranchIDs
          this.formUpdate.CREATE_USER = item.CREATE_USER
          this.formUpdate.LAST_USER = item.LAST_USER
        } else if (item.audiencesSelect === 'typeJob') {
          console.log(item.dateJobOpen, item.dateJobClose)
          if (item.dateJobOpen === 'True' && item.dateJobClose === 'True') {
            this.formUpdate.audiencesName = item.audiencesName
            this.formUpdate.flowId = flowIds
            this.formUpdate.startDate = this.momenDate_1(item.startDate)
            this.formUpdate.endDate = this.momenDate_1(item.endDate)
            this.formUpdate.startDateClose = this.momenDate_1(item.startDateClose)
            this.formUpdate.endDateClose = this.momenDate_1(item.endDateClose)
            this.formUpdate.audiencesSelect = item.audiencesSelect
            this.formUpdate.shopId = this.$session.getAll().data.shopId
            this.formUpdate.dateJobOpen = 'True' //
            this.formUpdate.dateJobClose = 'True' //
            this.formUpdate.masBranchID = masBranchIDs
            this.formUpdate.CREATE_USER = item.CREATE_USER
            this.formUpdate.LAST_USER = item.LAST_USER
            this.chkboxDisableUpdate('open')
            this.chkboxDisableUpdate('close')
          } else if (item.dateJobOpen === 'True' && item.dateJobClose === 'False') {
            this.formUpdate.audiencesName = item.audiencesName
            this.formUpdate.flowId = flowIds
            this.formUpdate.startDate = this.momenDate_1(item.startDate)
            this.formUpdate.endDate = this.momenDate_1(item.endDate)
            this.formUpdate.audiencesSelect = item.audiencesSelect
            this.formUpdate.shopId = this.$session.getAll().data.shopId
            this.formUpdate.dateJobOpen = 'True' //
            this.formUpdate.dateJobClose = 'False' //
            this.formUpdate.masBranchID = masBranchIDs
            this.formUpdate.CREATE_USER = item.CREATE_USER
            this.formUpdate.LAST_USER = item.LAST_USER
            this.chkboxDisableUpdate('open')
            this.chkboxDisableUpdate('close')
          } else if (item.dateJobOpen === 'False' && item.dateJobClose === 'True') {
            this.formUpdate.audiencesName = item.audiencesName
            this.formUpdate.flowId = flowIds
            this.formUpdate.startDateClose = this.momenDate_1(item.startDateClose)
            this.formUpdate.endDateClose = this.momenDate_1(item.endDateClose)
            this.formUpdate.audiencesSelect = item.audiencesSelect
            this.formUpdate.shopId = this.$session.getAll().data.shopId
            this.formUpdate.dateJobOpen = 'False' //
            this.formUpdate.dateJobClose = 'True' //
            this.formUpdate.masBranchID = masBranchIDs
            this.formUpdate.CREATE_USER = item.CREATE_USER
            this.formUpdate.LAST_USER = item.LAST_USER
            this.chkboxDisableUpdate('open')
            this.chkboxDisableUpdate('close')
          } else if (item.dateJobOpen === 'False' && item.dateJobClose === 'False') {
            this.formUpdate.audiencesName = item.audiencesName
            this.formUpdate.flowId = flowIds
            // this.formUpdate.endDateClose = item.endDateClose //
            this.formUpdate.audiencesSelect = item.audiencesSelect
            this.formUpdate.shopId = this.$session.getAll().data.shopId
            this.formUpdate.dateJobOpen = 'False' //
            this.formUpdate.dateJobClose = 'False' //
            this.formUpdate.masBranchID = masBranchIDs
            this.formUpdate.CREATE_USER = item.CREATE_USER
            this.formUpdate.LAST_USER = item.LAST_USER
            this.chkboxDisableUpdate('open')
            this.chkboxDisableUpdate('close')
          }
        } else if (item.audiencesSelect === 'rating') {
          this.formUpdate.audiencesName = item.audiencesName
          this.formUpdate.startDate = this.momenDate_1(item.startDate)
          this.formUpdate.endDate = this.momenDate_1(item.endDate)
          this.formUpdate.audiencesSelect = item.audiencesSelect
          this.formUpdate.shopId = this.$session.getAll().data.shopId
          this.formUpdate.startRating = parseInt(item.startRating)
          this.formUpdate.endRating = parseInt(item.endRating)
          this.formUpdate.CREATE_USER = item.CREATE_USER
          this.formUpdate.LAST_USER = item.LAST_USER
        } else if (item.audiencesSelect === 'typeCustomField') {
          this.formUpdate.selectData = item.selectData
          if (item.selectData === 'booking') {
            this.formUpdate.audiencesName = item.audiencesName
            this.formUpdate.audiencesSelect = item.audiencesSelect
            this.formUpdate.shopId = this.$session.getAll().data.shopId
            this.formUpdate.fieldId = fieldIds
            this.formUpdate.optionFieldValue = optionFieldValues
            await this.getDataCustomFieldUpdate()
            this.formUpdate.selectData = item.selectData
            this.formUpdate.masBranchID = masBranchIDs
            this.formUpdate.CREATE_USER = item.CREATE_USER
            this.formUpdate.LAST_USER = item.LAST_USER
          } else if (item.selectData === 'job') {
            this.formUpdate.audiencesName = item.audiencesName
            this.formUpdate.audiencesSelect = item.audiencesSelect
            this.formUpdate.shopId = this.$session.getAll().data.shopId
            this.formUpdate.fieldId = fieldIds
            this.formUpdate.optionFieldValue = optionFieldValues
            await this.getDataCustomFieldUpdate()
            this.formUpdate.selectData = item.selectData
            this.formUpdate.masBranchID = masBranchIDs
            this.formUpdate.CREATE_USER = item.CREATE_USER
            this.formUpdate.LAST_USER = item.LAST_USER
          }
        }
        this.getDataUpdate()
        this.dialogEdit = true
      } else {
        this.formUpdate.id = item.id
        this.formUpdate.audiencesName = item.audiencesName
      }
    },
    getDataOptionFieldUpdate () {
      this.dataOptionField = []
      axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.session.data.shopId + '&fieldId=' + this.formUpdate.fieldId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.dataOptionField = JSON.parse(rs[0].optionField)
            // this.formUpdate.optionFieldValue = this.dataOptionField[0].value
            // for (var i = 0; i < rs.length; i++) {
            //   var d = rs[i]
            //   d.text = d.fieldName
            //   d.value = d.fieldId
            //   this.dataOptionField.push(d)
            // }
          } else {
            this.dataOptionField = ''
          }
        })
    },
    async getDataCustomFieldUpdate () {
      this.dataCustom = []
      await axios
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
            // this.formUpdate.fieldId = this.dataCustom[0].value
            this.getDataOptionFieldUpdate()
          } else {
            this.dataCustom = []
            this.$swal('ผิดพลาด', 'คุณไม่มี ประเภทการกรอก ที่ไม่ตรงเงื่อน', 'error')
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
    chkAudiencesSelectUpdate () {
      if (this.formUpdate.audiencesSelect === 'typeCustomField') {
        this.getDataCustomFieldUpdate()
      }
    },
    async getDataUpdate () {
      this.valueAdd = 0
      this.dataAdd = 0
      var num = 0
      var url = ''
      var branchId = ''
      var flowId = ''
      if (this.formUpdate.masBranchID === 'allBr') {
        branchId = ''
      } else {
        branchId = this.formUpdate.masBranchID
      }
      if (this.formUpdate.flowId === 'allFlow') {
        flowId = ''
      } else {
        flowId = this.formUpdate.flowId
      }
      if (this.formUpdate.audiencesSelect === 'bookingDate') {
        url = this.DNS_IP + '/booking_view/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRange=' + this.formUpdate.startDate + '/' + this.formUpdate.endDate
      } else if (this.formUpdate.audiencesSelect === 'typeJob') {
        console.log(this.formUpdate.dateJobOpen, this.formUpdate.dateJobClose)
        if (this.formUpdate.dateJobOpen === 'True' && this.formUpdate.dateJobClose === 'True') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRange=' + this.formUpdate.startDate + '/' + this.formUpdate.endDate +
            '&dateRangeClose=' + this.formUpdate.startDateClose + '/' + this.formUpdate.endDateClose
        } else if (this.formUpdate.dateJobOpen === 'True' && this.formUpdate.dateJobClose === 'False') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRange=' + this.formUpdate.startDate + '/' + this.formUpdate.endDate
        } else if (this.formUpdate.dateJobOpen === 'False' && this.formUpdate.dateJobClose === 'True') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId +
            '&dateRangeClose=' + this.formUpdate.startDateClose + '/' + this.formUpdate.endDateClose
        } else if (this.formUpdate.dateJobOpen === 'False' && this.formUpdate.dateJobClose === 'False') {
          url = this.DNS_IP + '/job/getAudience?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branchId +
            '&flowId=' +
            flowId
        }
      } else if (this.formUpdate.audiencesSelect === 'rating') {
        url = this.DNS_IP + '/rating/getAudience?shopId=' +
            this.session.data.shopId +
            // '&masBranchID=' +
            // branchId +
            '&ratingRange=' + this.formUpdate.startRating + '/' + this.formUpdate.endRating +
            '&dateRange=' + this.formUpdate.startDate + '/' + this.formUpdate.endDate
      } else if (this.formUpdate.audiencesSelect === 'typeCustomField') {
        if (this.formUpdate.selectData === 'booking') {
          url = this.DNS_IP + '/BookingData/getAudience?shopId=' + this.session.data.shopId + '&fieldValue=' + this.formUpdate.optionFieldValue +
          '&masBranchID=' + branchId
        } else if (this.formUpdate.selectData === 'job') {
          url = this.DNS_IP + '/jobData/getAudience?shopId=' + this.session.data.shopId + '&fieldValue=' + this.formUpdate.optionFieldValue +
          '&masBranchID=' + branchId
        }
      }
      console.log(url)
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/member/get?shopId=' + this.session.data.shopId
        )
        .then(async response => {
          console.log('response', response.data)
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
              console.log('response', response.data)
              if (res.data.status === false) {
                this.valueAdd = parseInt((0 / num) * 100)
                this.dataAdd = 0
              } else {
                this.valueAdd = parseInt((res.data.length / num) * 100)
                this.dataAdd = res.data.length
              }
            })
        })
    },
    editData () {
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
          this.formUpdate.CREATE_USER = this.$session.getAll().data.userName
          this.formUpdate.LAST_USER = this.$session.getAll().data.userName
          var dt = {}
          if (this.formUpdate.audiencesSelect === 'bookingDate') {
            dt = {
              audiencesName: this.formUpdate.audiencesName,
              flowId: this.formUpdate.flowId,
              startDate: this.formUpdate.startDate,
              endDate: this.formUpdate.endDate,
              audiencesSelect: this.formUpdate.audiencesSelect,
              shopId: this.$session.getAll().data.shopId, //
              masBranchID: this.formUpdate.masBranchID,
              CREATE_USER: this.formUpdate.CREATE_USER,
              LAST_USER: this.formUpdate.LAST_USER
            }
          } else if (this.formUpdate.audiencesSelect === 'typeJob') {
            console.log(this.formUpdate.dateJobOpen, this.formUpdate.dateJobClose)
            if (this.formUpdate.dateJobOpen === 'True' && this.formUpdate.dateJobClose === 'True') {
              dt = {
                audiencesName: this.formUpdate.audiencesName,
                flowId: this.formUpdate.flowId,
                startDate: this.formUpdate.startDate,
                endDate: this.formUpdate.endDate,
                startDateClose: this.formUpdate.startDateClose, //
                endDateClose: this.formUpdate.endDateClose, //
                audiencesSelect: this.formUpdate.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                dateJobOpen: 'True', //
                dateJobClose: 'True', //
                masBranchID: this.formUpdate.masBranchID,
                CREATE_USER: this.formUpdate.CREATE_USER,
                LAST_USER: this.formUpdate.LAST_USER
              }
            } else if (this.formUpdate.dateJobOpen === 'True' && this.formUpdate.dateJobClose === 'False') {
              dt = {
                audiencesName: this.formUpdate.audiencesName,
                flowId: this.formUpdate.flowId,
                startDate: this.formUpdate.startDate,
                endDate: this.formUpdate.endDate,
                audiencesSelect: this.formUpdate.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                dateJobOpen: 'True', //
                dateJobClose: 'False', //
                masBranchID: this.formUpdate.masBranchID,
                CREATE_USER: this.formUpdate.CREATE_USER,
                LAST_USER: this.formUpdate.LAST_USER
              }
            } else if (this.formUpdate.dateJobOpen === 'False' && this.formUpdate.dateJobClose === 'True') {
              dt = {
                audiencesName: this.formUpdate.audiencesName,
                flowId: this.formUpdate.flowId,
                startDateClose: this.formUpdate.startDateClose, //
                endDateClose: this.formUpdate.endDateClose, //
                audiencesSelect: this.formUpdate.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                dateJobOpen: 'False', //
                dateJobClose: 'True', //
                masBranchID: this.formUpdate.masBranchID,
                CREATE_USER: this.formUpdate.CREATE_USER,
                LAST_USER: this.formUpdate.LAST_USER
              }
            } else if (this.formUpdate.dateJobOpen === 'False' && this.formUpdate.dateJobClose === 'False') {
              dt = {
                audiencesName: this.formUpdate.audiencesName,
                flowId: this.formUpdate.flowId,
                // endDateClose: this.formUpdate.endDateClose, //
                audiencesSelect: this.formUpdate.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                dateJobOpen: 'False', //
                dateJobClose: 'False', //
                masBranchID: this.formUpdate.masBranchID,
                CREATE_USER: this.formUpdate.CREATE_USER,
                LAST_USER: this.formUpdate.LAST_USER
              }
            }
          } else if (this.formUpdate.audiencesSelect === 'rating') {
            dt = {
              audiencesName: this.formUpdate.audiencesName,
              startDate: this.formUpdate.startDate,
              endDate: this.formUpdate.endDate,
              audiencesSelect: this.formUpdate.audiencesSelect,
              shopId: this.$session.getAll().data.shopId,
              startRating: this.formUpdate.startRating,
              endRating: this.formUpdate.endRating,
              CREATE_USER: this.formUpdate.CREATE_USER,
              LAST_USER: this.formUpdate.LAST_USER
            }
          } else if (this.formUpdate.audiencesSelect === 'typeCustomField') {
            if (this.formUpdate.selectData === 'booking') {
              dt = {
                audiencesName: this.formUpdate.audiencesName,
                audiencesSelect: this.formUpdate.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                fieldId: this.formUpdate.fieldId,
                optionFieldValue: this.formUpdate.optionFieldValue,
                selectData: this.formUpdate.selectData,
                masBranchID: this.formUpdate.masBranchID,
                CREATE_USER: this.formUpdate.CREATE_USER,
                LAST_USER: this.formUpdate.LAST_USER
              }
            } else if (this.formUpdate.selectData === 'job') {
              dt = {
                audiencesName: this.formUpdate.audiencesName,
                audiencesSelect: this.formUpdate.audiencesSelect,
                shopId: this.$session.getAll().data.shopId,
                fieldId: this.formUpdate.fieldId,
                optionFieldValue: this.formUpdate.optionFieldValue,
                selectData: this.formUpdate.selectData,
                masBranchID: this.formUpdate.masBranchID,
                CREATE_USER: this.formUpdate.CREATE_USER,
                LAST_USER: this.formUpdate.LAST_USER
              }
            }
          }
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + '/audience/edit/' + this.formUpdate.id,
              dt,
              {
                headers: {
                  'Application-Key': this.$session.getAll().ApplicationKey
                }
              }
            )
            .then(async (response) => {
              // Debug response
              console.log('addDataGlobal DNS_IP + PATH + "add"', response)

              this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
              // Close Dialog
              this.dialogEdit = false

              // Load Data
              await this.clearEdit()
              await this.getData()
            })
        })
    },
    clearEdit () {
      this.formUpdate.id = ''
      this.formUpdate.selectData = 'booking'
      this.formUpdate.flowId = ''
      this.formUpdate.audiencesName = ''
      this.formUpdate.fieldId = ''
      this.formUpdate.optionFieldValue = ''
      this.formUpdate.startDate = this.momenDate_1()
      this.formUpdate.endDate = this.momenDate_1()
      this.formUpdate.startDateClose = this.momenDate_1()
      this.formUpdate.endDateClose = this.momenDate_1()
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
    async deleteData () {
      this.$swal({
        title: 'ต้องการ ลบข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#fa0202',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          this.formUpdate.LAST_USER = this.$session.getAll().data.userName
          var dt = {
            LAST_USER: this.formUpdate.LAST_USER
          }
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/audience/delete/" + this.formUpdate.id,
              dt
            )
            .then(async response => {
              // Debug response
              console.log('DNS_IP + PATH + "delete/"', response)

              this.$swal('เรียบร้อย', 'ลบข้อมูลเรียบร้อย', 'success')
              // Close Dialog
              this.dialogDelete = false
              await this.getData()
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
    }
  }
}
</script>
