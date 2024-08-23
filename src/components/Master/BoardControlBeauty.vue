<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <!-- <v-col class="ma-2" id="text-Board">กระดานทำงาน</v-col> -->
        <v-row>
        <v-col cols="6" style="font-size: 20px; line-height: 28px; color: #1b437c;">กระดานทำงาน</v-col>
        <v-col cols="6" class="text-right">
            <v-btn-toggle borderless>
            <!-- <v-btn
              color="#1B437C"
              text
              @click="newCars()"
            >
              <v-icon left>mdi-car-2-plus</v-icon>
              <span class="hidden-sm-and-down">รับรถใหม่</span>
            </v-btn> -->
            <v-btn
            v-if="flowId !== '' && masBranchID !== ''"
              color="#1B437C"
              text
              @click="editLayout()"
            >
              <v-icon left>mdi-application-cog</v-icon>
              <span class="hidden-sm-and-down">แก้ไข Layout</span>
            </v-btn>
            <v-btn
              color="#1B437C"
              text
              @click="editStep()"
            >
              <v-icon left>mdi-database-edit</v-icon>
              <span class="hidden-sm-and-down">แก้ไข ขั้นตอน</span>
            </v-btn>
            </v-btn-toggle>
          </v-col>
          <!-- สาขา -->
          <v-col :cols="colsWidth">
            <v-select
              :items="DataBranchName"
              v-model="masBranchID"
              @change="clearDataFlow(),flowId = '',getDataFlow(),checkTime()"
              dense
              outlined
              hide-details
              filled
              label="สาขา"
              prepend-inner-icon="mdi-map-marker"
              class="ma-2"
            ></v-select>
          </v-col>
          <v-col :cols="colsWidth">
            <v-select
              v-if="masBranchID !== '' && masBranchID !== null"
              :items="DataFlowName"
              v-model="flowId"
              dense
              outlined
              filled
              @change="chkFlowName()"
              hide-details
              label="ประเภทบริการ"
              prepend-inner-icon="mdi-format-list-bulleted"
              class="ma-2"
            >
            </v-select>
          </v-col>
          <v-col :cols="colsWidth" v-if="allJob.length > 0">
            <v-text-field
            class="ma-2"
              dense
              v-model="searchOther"
              :append-outer-icon="searchOther ? 'mdi-refresh-circle' : ''"
              append-icon="mdi-text-box-search"
              label="ค้นหาทั้งหมด"
              hide-details
              @click:append-outer="refreshData()"
              @click:append="searchAny()"
              outlined
            >
              <v-tooltip slot="append-icon" bottom>
                <v-icon slot="activator" color="primary" dark>home</v-icon>
                <span>Tooltip</span>
              </v-tooltip>
            </v-text-field>
          </v-col>
          </v-row>
        <!-- <v-row class="pa-0 ma-0">
          <v-col cols="4">
            <v-menu
              v-model="menuDatefilter"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFilter"
                  label="Picker without buttons"
                  prepend-icon="mdi-calendar"
                  readonly
                  clearable
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateFilter"
                @input="menuDatefilter = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row> -->
        <v-row>
          <v-col :cols="colsWidthTitle" style="display: flex;justify-content: flex-start;align-items: stretch;">
            <h6>นัดส่ง</h6>
            <v-chip small class="ml-2" color="#DE6467" text-color="white">
              ภายใน 2 วัน
            </v-chip>

            <v-chip small class="ml-2" color="#FED966" text-color="white">
              ภายใน 4 วัน
            </v-chip>

            <v-chip small class="ml-2" color="#4F93D0" text-color="white">
              มากกว่า 4 วัน
            </v-chip>
          </v-col>
          <v-col  class="text-right" color="#ABB1C7" v-if="allJob.length > 0">
            <v-btn-toggle>
            <v-btn
              text
              small
              color="#ABB1C7"
            >
              {{ allJob.length }} records
            </v-btn>
            <v-btn
              v-if="layout === 'grid'"
              text
              small
              color="#ABB1C7"
              @click="layout = 'list'"
            >
              <v-icon class="mr-1 text-right" color="#1B437C">
                mdi-view-dashboard
              </v-icon>
              Mobile
            </v-btn>
            <v-btn
              v-if="layout === 'list'"
              text
              small
              color="#ABB1C7"
              @click="layout = 'grid'"
            >
              <v-icon
                class="mr-1 text-right"
                color="#1B437C"
              >
                mdi-format-list-text
              </v-icon>
              Desktop
            </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-col cols="12" class="pa-0 ma-0 mt-6 mb-n6" v-if="flowId !== '' && masBranchID !== ''">
          <v-menu
              v-model="menuDatefilter"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  style="max-width: 400px;"
                  v-model="dateFilter"
                  label="เลือกวันที่นัดหมาย"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  clearable
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateFilter"
                @input="menuDatefilter = false"
                @change="getJobData()"
              ></v-date-picker>
            </v-menu>
        </v-col>
        <v-divider></v-divider>

        <!-- เปลี่ยนสถานะ step-->
        <v-row justify="center">
          <v-dialog v-model="dialog" max-width="500px">
            <v-overlay :value="overlayUpdateStep">
              <v-progress-circular
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>
            <v-card>
              <v-col class="text-right">
                <v-icon color="#173053" @click=";(dialog = false), clearData(), setTimeJob()"
                  >mdi-close</v-icon
                >
              </v-col>
              <center>
                <v-col class="mt-16">
                  <v-img id="img_edit_step" :src="require('@/assets/imgEditStap.svg')"></v-img>
                </v-col>
                <v-col >
                  <v-img id="text_edit_step" :src="require('@/assets/textEditStep.svg')"></v-img>
                </v-col>
              </center>
              <!-- <v-col class="text-center">
                <span class="headline">เปลี่ยนสถานะ</span>
              </v-col> -->
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                        <v-select
                          dense
                          outlined
                          label="ขั้นตอนต่อไป"
                          v-model="formUpdate.stepTitle"
                          :items="stepItemSeleteInBoard"
                          item-text="text"
                          item-value="stepId"
                          return-object
                          :rules="[rules.required]"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                        <v-autocomplete
                          outlined
                          dense
                          label="ชื่อพนักงานที่รับผิดชอบ"
                          v-model="formUpdate.empStep"
                          :items="empSeleteStep.filter((i) => i.masBranchID === masBranchID || i.masBranchID === '')"
                          :rules="[rules.required]"
                        ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-col class="text-center pt-0">
                <v-btn color="#1B437C" depressed dark @click="onUpdate()">
                  <v-icon left>
                    mdi-swap-horizontal
                  </v-icon>
                  เปลี่ยนสถานะ
                </v-btn>
              </v-col>
              <br />
            </v-card>
          </v-dialog>
        </v-row>
        <!-- end เปลี่ยนสถานะ step -->

        <!-- DIALOG แก้ไขข้อมูล ใน card -->

        <v-dialog v-model="dialogEdit" persistent max-width="80%">
          <v-overlay :value="overlayEdit">
            <v-progress-circular
              indeterminate
              size="64"
            ></v-progress-circular>
          </v-overlay>
          <v-card>
            <v-form ref="form_edit" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-col class="text-right">
                    <v-btn
                      small
                      color="#E0E0E0"
                      @click=";(dialogEdit = false), clearData(), setTimeJob()"
                    >
                      <v-icon color="#173053">mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                  <v-row justify="center">
                    <!-- <v-col cols="5" class="text-center">
                      <v-col class="text-center">
                        <v-img
                          class="v-margit_img_reward"
                          :src="require('@/assets/EditCard.png')"
                          max-width="330"
                        ></v-img>
                      </v-col>
                    </v-col> -->

                    <v-col cols="12" class="v-margit_text_add mt-1">
                      <v-col class="text-center">
                        <v-img
                          class="v_text_edit"
                          :src="require('@/assets/GroupEditTitle.svg')"
                        ></v-img>
                      </v-col>
                      <v-col cols="12 px-0">
                        <div
                          class="column is-3"
                          v-for="(itemsEdit, index) in JobDataItem.filter(
                            row => {
                              return row.jobId == formUpdate.jobId
                            }
                          )"
                          :key="index"
                        >
                          <!-- <strong>{{ itemsEdit.fieldName + '2' }}: </strong> -->
                          <v-col cols="12" class="pt-0 pb-0">
                            <v-text-field
                              :label="itemsEdit.fieldName"
                              v-model="itemsEdit.fieldValue"
                              required
                              outlined
                              dense
                            />
                          </v-col>
                        </div>
                      </v-col>
                      <v-col class="pt-0 pb-0" cols="12">
                        <v-row justify="center">
                          <v-col class="pt-0 pb-0" cols="12">
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
                                  v-model="formUpdate.endDate"
                                  label="วันที่นัดส่งรถลูกค้า"
                                  persistent-hint
                                  outlined
                                  dense
                                  readonly
                                  prepend-icon="mdi-calendar"
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="formUpdate.endDate"
                                no-title
                                @input="menu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col class="pt-0 pb-0" cols="12">
                            <v-select
                              v-model="formUpdate.endTime"
                              :items="timeavailable"
                              label="เวลา"
                              menu-props="auto"
                              required
                              dense
                              outlined
                              :rules ="[rules.required]"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-col  class="text-center pt-0 pb-0">
                <v-btn
                  dark
                  elevation="2"
                  depressed
                  color="#1B437C"
                  @click="editData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  แก้ไข
                </v-btn>
              </v-col>
              <br>
            </v-form>
          </v-card>
        </v-dialog>
        <!-- END DIALOG แก้ไขข้อมูล ใน card -->

        <!-- DIALOG ค่าใช้จ่าย -->
        <v-dialog v-model="dialogDelete" persistent max-width="400px">
          <v-card v-if="checkPayment === 'True'">
            <center>
              <v-col>
                <v-img
                  id="v-img-car"
                  :src="require('@/assets/sendcar.png')"
                ></v-img>
              </v-col>
            </center>
            <v-col class="text-center">
              <span class="headline">ค่าใช้จ่าย</span>
            </v-col>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <VuetifyMoney
                      v-model="formDelete.totalPrice"
                      placeholder="ค่าใช้จ่ายทั้งหมด"
                      dense
                      label="ค่าใช้จ่ายทั้งหมด"
                      required
                      outlined
                      :rules="[rules.required]"
                      v-bind:options="optionsMoney"
                    />
                  </v-col>
                  <v-col class="pb-0"  cols="12" v-if="dataPackage.length > 0">
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
                  </v-col>
                  <v-col class="pb-0"  cols="12"  v-if="dataCoin.length > 0">
                    <v-select
                      v-model="productExchangeRateId"
                      :items="dataCoin"
                      dense
                      outlined
                      label="เลือกอัตราแลกเปลี่ยน *"
                      clearable
                      item-text="text"
                      item-value="value"
                      return-object
                    >
                    </v-select>
                  </v-col>
                  <v-col class="pb-0"  cols="12">
                    <v-checkbox
                      v-model="statusPushEndStep"
                      label="ส่งข้อความ ขึ้นตอนสุดท้าย ไปยังลูกค้า"
                      true-value="True"
                      false-value="False"
                    ></v-checkbox>
                  </v-col>
                  <v-col class="text-center"  cols="12">
                    <v-btn
                      dark
                      elevation="2"
                      depressed
                      color="#1B437C"
                      @click="closeJob()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      ชำระเงิน
                    </v-btn>
                    <v-btn
                      color="primary"
                      depressed
                      @click=";(dialogDelete = false), clearData(), setTimeJob()"
                    >
                      <v-icon left> mdi-cancel</v-icon>
                      ยกเลิก
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
          <v-card v-if="checkPayment === 'False'">
            <v-col class="text-center">
              <span class="headline">จบกระบวนการซ่อม</span>
            </v-col>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col class="text-center"  cols="12">
                    <v-select
                      v-if="dataPackage.length > 0"
                      v-model="packageId"
                      :items="dataPackage"
                      dense
                      label="แพ็กเก็ต *"
                      required
                      clearable
                      item-text="packageName"
                      item-value="packageId"
                      return-object
                      :rules="[rules.required]"
                    >
                    </v-select>
                  </v-col>
                  <v-col class="text-center"  cols="12">
                    <v-btn
                      dark
                      elevation="2"
                      depressed
                      color="#1B437C"
                      @click="closeJob()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      จบกระบวนการซ่อม
                    </v-btn>
                    <v-btn
                      color="primary"
                      depressed
                      @click=";(dialogDelete = false), clearData(), setTimeJob()"
                    >
                      <v-icon left> mdi-cancel</v-icon>
                      ยกเลิก
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- end add -->

        <div
          v-if="flowId === ''"
          :class="classWork"
        >
          <v-row>
            <v-col class="colum" v-for="(element, work) in Layout" :key="work">
              <div
                v-for="(item, indexitem) in Layout[work].workData"
                :key="indexitem"
                class="pb-0 pt-0"
              >
                <v-card class="mb-2">
                  <v-card id="cardTitle" elevation="12">
                    <v-card-title class="ma-3">
                      <v-row>
                        <v-col cols="8" class="pa-1">
                          <strong>{{ item.stepTitle }}</strong>
                        </v-col>
                        <v-col cols="4" class="text-right pb-1 pt-0">
                          <strong>{{
                            allJob.filter(row => {
                              return row.stepId == item.stepId
                            }).length
                          }}</strong>
                        </v-col>
                      </v-row>
                    </v-card-title>
                  </v-card>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </div>
        <!-- NewDesign -->
        <div
          v-if="layout === 'grid'"
          :class="classWork"
          v-show="masBranchID"
        >
        <v-row>
          <v-col class="Layout pa-1"  cols="2" v-for="(element, work) in Layout" :key="work" >
            <div
                v-for="(item, indexitem) in Layout[work].workData"
                :key="indexitem"
                class="subLayout"
            >
              <div class="mb-2" style="display: flex;justify-content: space-between;align-items:flex-start;">
                <div style="display:flex;align-items: flex-start;" class="ml-2">
                  <v-icon class="ma-0 ml-n2 mr-1" :color="codeColor[work]">mdi-collage</v-icon>
                  <p class="ma-0" style="max-width: 150px;">
                    {{ item.stepTitle}}
                  </p>
                </div>
                <div class="pa-1 totalJob" :style="'background-color:' + codeColor[work] + ';'">
                  <p class="font-weight-black ma-0">{{allJob.filter(row => {return row.stepId == item.stepId }).length}}</p>
                </div>
              </div>
              <div
               v-for="(itemsJob, indexJob) in allJob.filter(row => { return row.stepId == item.stepId })" :key="indexJob"
              >
                <v-card class="cardItemNew">
                  <!-- {{ itemsJob.totalDateDiff }} -->
                  <div style="position: relative;top: 7px;">
                    <div style="display: flex;justify-content: flex-start;align-items: baseline;" v-for="(items, index) in JobDataItem.filter(row => { return row.jobId == itemsJob.jobId })" :key="index">
                      <v-icon color="#525252" class="mr-1" small style="font-size: 8px;" v-if="items.showCard === 'True' && items.fieldValue !== ''">
                        mdi-checkbox-multiple-blank-circle
                        </v-icon>
                      <p class="ma-0 mb-1" v-if="items.showCard === 'True' && items.fieldValue !== ''">
                        {{  items.fieldValue}}</p>
                    </div>
                    <!-- แจ้งเตือนเวลาที่ต้องส่งมอบงาน -->
                    <div style="position: absolute;top: -18px;right: -6px;">
                    <v-tooltip top
                                v-if="parseInt(itemsJob.totalDateDiff) <= 2"
                                color="#DE6467"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      v-bind="attrs"
                                      v-on="on"
                                      color="#DE6467"
                                    >
                                      mdi-alarm-light
                                    </v-icon>
                                  </template>
                                  <span style="background-color:#DE6467;">{{ itemsJob.totalDateDiff }}</span>
                             </v-tooltip>
                             <v-tooltip top
                                v-else-if="parseInt(itemsJob.totalDateDiff) <= 4 &&parseInt(itemsJob.totalDateDiff) >= 2"
                                color="#FED966"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      v-bind="attrs"
                                      v-on="on"
                                      color="#FED966"
                                    >
                                      mdi-alarm-light
                                    </v-icon>
                                  </template>
                                  <span style="background-color:#FED966;">{{ itemsJob.totalDateDiff }}</span>
                             </v-tooltip>
                             <v-tooltip top
                                v-else-if="parseInt(itemsJob.totalDateDiff) >= 4"
                                color="#4F93D0"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      v-bind="attrs"
                                      v-on="on"
                                      color="#4F93D0"
                                    >
                                      mdi-alarm-light
                                    </v-icon>
                                  </template>
                                  <span style="background-color:#4F93D0;">{{ itemsJob.totalDateDiff }}</span>
                             </v-tooltip>
                  </div>
                  </div>
                  <div style="display: flex;justify-content: flex-start;align-items: flex-start;">
                    <v-icon color="#525252" class="mr-2" v-if="JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep !== '' && JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep !== null">mdi-clipboard-account</v-icon>
                    <p class="ma-0 mb-2" v-if="JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep !== '' && JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep !== null">{{ JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep }}</p>
                  </div>
                  <div style="display: flex;justify-content: space-between;align-items: center;flex-direction: row;flex-wrap: wrap;">
                    <v-btn
                      color="primary"
                      class="buttonGroup"
                      elevation="2"
                      icon
                      small
                    >
                      <v-tooltip top
                        color="#DE6467">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="#DE6467"
                              v-bind="attrs"
                              v-on="on"
                              dark
                              @click=";(dialogEdit = true), setUpdate(itemsJob)"
                              >
                                mdi-square-edit-outline
                              </v-icon>
                          </template>
                          <span>แก้ไขข้อมูล</span>
                      </v-tooltip>
                    </v-btn>
                    <v-btn
                      color="primary"
                      class="buttonGroup"
                      elevation="2"
                      icon
                      small
                    >
                      <v-tooltip
                          v-if="allJob.filter(row => {return row.jobId == itemsJob.jobId})[0].checkCar !== 'False'"
                          top
                          color="#FF8C00"
                      >
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                color="#FF8C00"
                                @click=";(dialog = true),
                                    setUpdate(itemsJob, 'editFlow', item)
                                "
                                v-bind="attrs"
                                v-on="on"
                              >
                                mdi-shuffle-variant
                              </v-icon>
                            </template>
                            <span>เปลี่ยนขั้นตอนการทำงาน</span>
                          </v-tooltip>
                          <v-tooltip top
                          color="#FF8C00"
                          >
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                          v-if="
                              allJob.filter(row => {
                                return row.jobId == itemsJob.jobId
                              })[0].checkCar == 'False'
                            "
                            v-bind="attrs"
                            v-on="on"
                            color="#9E9E9E"
                          >
                            mdi-shuffle-variant
                          </v-icon>
                        </template>
                        <span>เปลี่ยนขั้นตอนการทำงาน</span>
                      </v-tooltip>
                    </v-btn>
                    <v-btn
                      color="primary"
                      class="buttonGroup"
                      elevation="2"
                      icon
                      small
                    >
                      <v-tooltip top
                      color="#84C650"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                            color="#84C650"
                            @click="
                              ;(dialogDelete = true), setUpdate(itemsJob, 'closeJob')
                            "
                          >
                            mdi-cash-usd-outline
                          </v-icon>
                        </template>
                        <span>จบงาน</span>
                      </v-tooltip>
                    </v-btn>
                    <v-btn
                      color="primary"
                      class="buttonGroup"
                      elevation="2"
                      icon
                      small
                    >
                      <v-tooltip top color="#A12BFD">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            color="#A12BFD"
                            @click="
                              ;(dialogProgress = true), getJobitem(itemsJob)
                            "
                              v-bind="attrs"
                              v-on="on"
                          >
                            mdi-chart-timeline-variant
                          </v-icon>
                        </template>
                        <span>ประวัติการทำงาน</span>
                      </v-tooltip>
                    </v-btn>
                    <v-btn
                    v-if="itemsJob.userId !== '' && itemsJob.userId !== 'user-skip'"
                      color="primary"
                      class="buttonGroup"
                      elevation="2"
                      icon
                      small
                    >
                      <v-tooltip top color="rgb(43 147 253)">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            color="rgb(43 147 253)"
                            @click="ChatHistory(itemsJob)"
                            small
                          >
                          mdi-message-processing
                          </v-icon>
                        </template>
                        <span>แชท</span>
                      </v-tooltip>
                    </v-btn>
                    <!-- update satatus car -->
                    <v-btn
                      color="primary"
                      class="buttonGroup"
                      elevation="2"
                      icon
                      small
                    >
                    <v-tooltip top
                            color="#4F93D0"
                            >
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              v-if="
                                allJob.filter(row => {
                                  return row.jobId == itemsJob.jobId
                                })[0].checkCar == 'False'"
                              color="#9E9E9E"
                              depressed
                              @click="updateStatusCars(itemsJob.jobId, 'False')"
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-car
                            </v-icon>

                            <v-icon
                              v-else
                              color="#4F93D0"
                              depressed
                              @click="updateStatusCars(itemsJob.jobId, 'True')"
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-car
                            </v-icon>
                            </template>
                            <span>สถานะ รถอยู่ / รถไม่อยู่</span>
                            </v-tooltip>
                    </v-btn>
                          <!-- end update satatus car -->
                  </div>

                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
        </div>
        <!-- GridView -->
        <div
          v-if="layout === 'grid' && false"
          :class="classWork"
          v-show="masBranchID"
        >
          <v-row >
            <v-col class="colum pa-1"  v-for="(element, work) in Layout" :key="work" >
              <div
                v-for="(item, indexitem) in Layout[work].workData"
                :key="indexitem"
                class="pb-0 pt-0"
              >
                <v-card class="pa-0" style="background-color: #f0eeee;" >
                  <v-card id="cardTitle" class="mb-1" :style="'background-color:' + codeColor[work] + ';'">
                    <v-card-title class="ma-3" >
                      <v-row class="pa-0" style="color: white;display: flex;">
                        <v-col cols="10" class="pa-1">
                          <v-tooltip
                            :color="codeColor[work]"
                            v-if="item.stepTitle.length > 17"
                            top
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <h2
                                  class="ml-2 mt-3 textLayout"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                {{ item.stepTitle.substring(0, 17)}}...
                                </h2>
                              </template>
                              <span>{{item.stepTitle}}</span>
                            </v-tooltip>
                          <h2 class="ml-2 mt-3 textLayout" v-if="item.stepTitle.length <= 17">{{ item.stepTitle }}</h2>
                        </v-col>
                        <v-col cols="2" class="text-right pb-1 pt-1 pl-0 ">
                          <h2 class="pa-0 mt-3 textLayout">{{
                            allJob.filter(row => {
                              return row.stepId == item.stepId
                            }).length
                          }}</h2>
                          <!-- <v-icon color="#ABB1C7">
                            mdi-dots-vertical
                          </v-icon> -->
                        </v-col>
                      </v-row>
                    </v-card-title>
                  </v-card>

                  <div
                    class="mt-n1"
                    v-for="(itemsJob, indexJob) in allJob.filter(row => {
                      return row.stepId == item.stepId
                    })"
                    :key="indexJob"
                    :style="'display:flex;border-left-style: solid;border-top-style: solid;border-width: 5px;border-color:' + codeColor[work] +';'"
                  >
                    <v-list-item class="pa-1 pb-2">
                      <v-alert
                        class="pa-2 pt-0 mb-n1 cardItem"
                        width="100%"
                        min-height="120px"
                      >
                        <div
                          v-for="(items, index) in JobDataItem.filter(row => {
                            return row.jobId == itemsJob.jobId
                          })"
                          :key="index"
                        >
                        <div style="height:20px;" v-if="items.showCard === 'True' && items.fieldValue !== ''">
                          <v-tooltip
                            :color="codeColor[work]"
                            v-if="items.fieldValue.length > 14"
                            top
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <p
                                  class="ma-0"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                {{ items.fieldValue.substring(0, 14)}}...
                                </p>
                              </template>
                              <span>{{items.fieldValue}}</span>
                            </v-tooltip>
                          <p class="ma-0" v-if="items.fieldValue.length <= 14">{{ items.fieldValue }}</p>
                        </div>
                        </div>
                        <div style="display: flex;">
                          <p class="font-weight-medium mb-0 pb-1">
                            <v-tooltip top color="#1B437C" v-if="itemsJob.statusTime === 'timeStart' || itemsJob.statusTime === null">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon class="pb-1 mr-1 ml-1" v-bind="attrs" v-on="on" color="#1B437C">mdi-account-arrow-right</v-icon>
                              </template>
                              <span>พนักงานที่รับผิดชอบ</span>
                            </v-tooltip>
                            {{ JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep }}
                          </p>
                        </div>
                        <!-- <v-row style="height:50px;" class="ps-3 pt-5 pb-1 mb-1">
                          <v-col cols="12" class="mt-1 pa-0">
                            <p class="font-weight-medium mb-0 pb-1">
                              <v-tooltip top
                              color="#1B437C"
                                v-if="itemsJob.statusTime === 'timeStart' || itemsJob.statusTime === null">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                    class="pb-1 mr-1 ml-1"
                                      v-bind="attrs"
                                      v-on="on"
                                      color="#1B437C"
                                    >
                                      mdi-account-arrow-right
                                    </v-icon>
                                  </template>
                                  <span>พนักงานที่รับผิดชอบ</span>
                                </v-tooltip>
                                {{JobDataItem.filter(row => {return row.jobId == itemsJob.jobId})[0].empStep}}
                            </p>
                          </v-col>
                        </v-row> -->

                        <!-- <v-avatar
                color="brown"
              >
                <span class="white--text text-h5">{{
                          JobDataItem.filter(row => {
                            return row.jobId == itemsJob.jobId
                          })[0].empStep
                        }}</span>
              </v-avatar> -->
                        <!-- diffDate -->
                        <v-container
                          class="grey lighten-4"
                          style="position:absolute; width:30px; right:0px; top:0px;"
                        >
                          <!-- end update satatus car -->
                          <v-row class="pt-0 pl-1">
                            <v-tooltip top
                            color="#DE6467">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                  color="#DE6467"
                                  v-bind="attrs"
                                  v-on="on"
                                  dark
                                  @click=";(dialogEdit = true), setUpdate(itemsJob)"
                            >
                              mdi-square-edit-outline
                            </v-icon>
                              </template>
                              <span>แก้ไขข้อมูล</span>
                            </v-tooltip>
                          </v-row>
                          <v-row class="pt-0 pl-1">
                        <v-tooltip
                         v-if="allJob.filter(row => {
                                  return row.jobId == itemsJob.jobId
                                })[0].checkCar !== 'False'
                              "
                        top
                        color="#FF8C00">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="#FF8C00"
                              @click=";(dialog = true),
                                  setUpdate(itemsJob, 'editFlow', item)
                              "
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-shuffle-variant
                            </v-icon>
                          </template>
                          <span>เปลี่ยนขั้นตอนการทำงาน</span>
                        </v-tooltip>
                        <v-tooltip top
                        color="#FF8C00"
                        >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                        v-if="
                            allJob.filter(row => {
                              return row.jobId == itemsJob.jobId
                            })[0].checkCar == 'False'
                          "
                          v-bind="attrs"
                          v-on="on"
                          color="#9E9E9E"
                        >
                          mdi-shuffle-variant
                        </v-icon>
                      </template>
                      <span>เปลี่ยนขั้นตอนการทำงาน</span>
                    </v-tooltip>
                    </v-row>
                      <v-row class="pt-0 pl-1">
                        <v-tooltip top
                        color="#84C650"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              v-bind="attrs"
                              v-on="on"
                              color="#84C650"
                              @click="
                                ;(dialogDelete = true), setUpdate(itemsJob, 'closeJob')
                              "
                            >
                              mdi-cash-usd-outline
                            </v-icon>
                          </template>
                          <span>จบงาน</span>
                        </v-tooltip>
                          </v-row>
                          <v-row class="pt-0 pl-1">
                            <v-tooltip top color="#A12BFD">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                  color="#A12BFD"
                                  @click="
                                    ;(dialogProgress = true), getJobitem(itemsJob)
                                  "
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                  mdi-chart-timeline-variant
                                </v-icon>
                              </template>
                              <span>ประวัติการทำงาน</span>
                            </v-tooltip>
                          </v-row>
                          <v-row class="pt-0 pl-1" v-if="itemsJob.userId !== '' && itemsJob.userId !== 'user-skip'">
                            <v-tooltip top color="rgb(43 147 253)">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                  color="rgb(43 147 253)"
                                  @click="ChatHistory(itemsJob)"
                                >
                                mdi-message-text-outline
                                </v-icon>
                              </template>
                              <span>แชท</span>
                            </v-tooltip>
                          </v-row>
                        </v-container>
                      </v-alert>
                    </v-list-item>
                  </div>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </div>

        <div v-if="layout === 'list'">
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(item, indexitem) in stepItemSelete" :key="indexitem"
            >
              <v-expansion-panel-header>
                <!-- <v-alert
                  class="allFrame pb-3"
                  border="left"
                  elevation="2"
                > -->
                  <v-row class=" allFrame pb-3">
                    <v-col>
                      <strong>{{ item.stepTitle }}</strong>
                    </v-col>
                    <v-col class="text-right">
                      <strong>{{
                        allJob.filter(row => {
                          return row.stepId == item.stepId
                        }).length
                      }}</strong>
                      <!-- <v-icon class="text-right" color="#ABB1C7">
                        mdi-dots-vertical
                      </v-icon> -->
                    </v-col>
                  </v-row>
                <!-- </v-alert> -->
                </v-expansion-panel-header>
                <v-expansion-panel-content
                  v-for="(itemsJob, indexJob) in allJob.filter(row => {
                    return row.stepId == item.stepId
                  })"
                  :key="indexJob"
                >
                    <v-alert
                      class="allFrame pb-3"
                      :color="codeColor[indexJob]"
                      border="left"
                      elevation="2"
                      colored-border
                    >
                      <v-row class=" allFrame pb-3">
                        <!-- วันส่งรถลูกค้า -->
                        <!-- <v-col cols="2">
                          <v-chip
                            v-if="parseInt(itemsJob.totalDateDiff) <= 2"
                            class="ma-2"
                            color="#DE6467"
                            text-color="white"
                            x-small
                            draggable
                            justify="center"
                            align="center"
                          >
                            {{ itemsJob.totalDateDiff }} วัน
                          </v-chip>
                          <v-chip
                            v-else-if="
                              parseInt(itemsJob.totalDateDiff) <= 4 &&
                                parseInt(itemsJob.totalDateDiff) >= 2
                            "
                            class="ma-2"
                            color="#FED966"
                            text-color="white"
                            draggable
                            x-small
                            justify="center"
                            align="center"
                          >
                            {{ itemsJob.totalDateDiff }} วัน
                          </v-chip>
                          <v-chip
                            v-else-if="parseInt(itemsJob.totalDateDiff) >= 4"
                            class="ma-2"
                            color="#4F93D0"
                            text-color="white"
                            draggable
                            x-small
                            justify="center"
                            align="center"
                          >
                            {{ itemsJob.totalDateDiff }} วัน
                          </v-chip>
                        </v-col> -->
                        <!-- end diffDate -->
                        <v-col cols="12" class="text-left pa-0 pl-4 pt-3">
                          <!-- <div style="display: flex;justify-content: flex-start;align-items: baseline;" v-for="(items, index) in JobDataItem.filter(row => { return row.jobId == itemsJob.jobId })" :key="index">
                              <v-icon color="#525252" class="mr-1" small style="font-size: 8px;" v-if="items.showCard === 'True' && items.fieldValue !== ''">
                                mdi-checkbox-multiple-blank-circle
                                </v-icon>
                              <p class="ma-0 mb-1" v-if="items.showCard === 'True' && items.fieldValue !== ''">
                                {{  items.fieldValue}}</p>
                          </div> -->
                          <div style="position: relative;top: 7px;">
                    <div style="display: flex;justify-content: flex-start;align-items: baseline;" v-for="(items, index) in JobDataItem.filter(row => { return row.jobId == itemsJob.jobId })" :key="index">
                      <v-icon color="#525252" class="mr-1" small style="font-size: 8px;" v-if="items.showCard === 'True' && items.fieldValue !== ''">
                        mdi-checkbox-multiple-blank-circle
                        </v-icon>
                      <p class="ma-0 mb-1" v-if="items.showCard === 'True' && items.fieldValue !== ''">
                        {{ items.fieldValue }}</p>
                    </div>
                    <!-- แจ้งเตือนเวลาที่ต้องส่งมอบงาน -->
                    <div style="position: absolute;top: -18px;right: -6px;">
                    <v-tooltip top
                                v-if="parseInt(itemsJob.totalDateDiff) <= 2"
                                color="#DE6467"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      v-bind="attrs"
                                      v-on="on"
                                      color="#DE6467"
                                    >
                                      mdi-alarm-light
                                    </v-icon>
                                  </template>
                                  <span style="background-color:#DE6467;">{{ itemsJob.totalDateDiff }}</span>
                             </v-tooltip>
                             <v-tooltip top
                                v-else-if="parseInt(itemsJob.totalDateDiff) <= 4 &&parseInt(itemsJob.totalDateDiff) >= 2"
                                color="#FED966"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      v-bind="attrs"
                                      v-on="on"
                                      color="#FED966"
                                    >
                                      mdi-alarm-light
                                    </v-icon>
                                  </template>
                                  <span style="background-color:#FED966;">{{ itemsJob.totalDateDiff }}</span>
                             </v-tooltip>
                             <v-tooltip top
                                v-else-if="parseInt(itemsJob.totalDateDiff) >= 4"
                                color="#4F93D0"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      v-bind="attrs"
                                      v-on="on"
                                      color="#4F93D0"
                                    >
                                      mdi-alarm-light
                                    </v-icon>
                                  </template>
                                  <span style="background-color:#4F93D0;">{{ itemsJob.totalDateDiff }}</span>
                             </v-tooltip>
                  </div>
                  </div>
                        </v-col>
                        <v-col cols="12" class="text-left pa-0 pl-4 pt-3">
                          <div style="display: flex;justify-content: flex-start;align-items: flex-start;">
                            <v-icon color="#525252" class="mr-2" v-if="JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep !== '' && JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep !== null">mdi-clipboard-account</v-icon>
                            <p class="ma-0 mb-2" v-if="JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep !== '' && JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep !== null">{{ JobDataItem.find(row => row.jobId === itemsJob.jobId).empStep }}</p>
                          </div>
                        </v-col>
                        <v-col cols="12" class="text-right">
                          <!-- end update satatus car -->
                          <div style="display: flex;flex-flow: row wrap;justify-content: flex-end;align-items: center;">
                            <v-btn
                              color="primary"
                              class="buttonGroup"
                              elevation="2"
                              icon
                              small
                            >
                              <v-tooltip top
                                color="#DE6467">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      color="#DE6467"
                                      v-bind="attrs"
                                      v-on="on"
                                      dark
                                      @click=";(dialogEdit = true), setUpdate(itemsJob)"
                                      >
                                        mdi-square-edit-outline
                                      </v-icon>
                                  </template>
                                  <span>แก้ไขข้อมูล</span>
                              </v-tooltip>
                            </v-btn>
                            <v-btn
                              color="primary"
                              class="buttonGroup"
                              elevation="2"
                              icon
                              small
                            >
                              <v-tooltip
                                  v-if="allJob.filter(row => {return row.jobId == itemsJob.jobId})[0].checkCar !== 'False'"
                                  top
                                  color="#FF8C00"
                              >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-icon
                                        color="#FF8C00"
                                        @click=";(dialog = true),
                                            setUpdate(itemsJob, 'editFlow', item)
                                        "
                                        v-bind="attrs"
                                        v-on="on"
                                      >
                                        mdi-shuffle-variant
                                      </v-icon>
                                    </template>
                                    <span>เปลี่ยนขั้นตอนการทำงาน</span>
                                  </v-tooltip>
                                  <v-tooltip top
                                  color="#FF8C00"
                                  >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon
                                  v-if="
                                      allJob.filter(row => {
                                        return row.jobId == itemsJob.jobId
                                      })[0].checkCar == 'False'
                                    "
                                    v-bind="attrs"
                                    v-on="on"
                                    color="#9E9E9E"
                                  >
                                    mdi-shuffle-variant
                                  </v-icon>
                                </template>
                                <span>เปลี่ยนขั้นตอนการทำงาน</span>
                              </v-tooltip>
                            </v-btn>
                            <v-btn
                              color="primary"
                              class="buttonGroup"
                              elevation="2"
                              icon
                              small
                            >
                              <v-tooltip top
                              color="#84C650"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon
                                    v-bind="attrs"
                                    v-on="on"
                                    color="#84C650"
                                    @click="
                                      ;(dialogDelete = true), setUpdate(itemsJob, 'closeJob')
                                    "
                                  >
                                    mdi-cash-usd-outline
                                  </v-icon>
                                </template>
                                <span>จบงาน</span>
                              </v-tooltip>
                            </v-btn>
                            <!-- <v-btn
                              color="primary"
                              class="buttonGroup"
                              elevation="2"
                              icon
                              small
                            >
                              <v-tooltip top color="#A12BFD">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon
                                    color="#A12BFD"
                                    @click="
                                      ;(dialogProgress = true), getJobitem(itemsJob)
                                    "
                                      v-bind="attrs"
                                      v-on="on"
                                  >
                                    mdi-chart-timeline-variant
                                  </v-icon>
                                </template>
                                <span>ประวัติการทำงาน</span>
                              </v-tooltip>
                            </v-btn> -->
                            <v-btn
                            v-if="itemsJob.userId !== '' && itemsJob.userId !== 'user-skip'"
                              color="primary"
                              class="buttonGroup"
                              elevation="2"
                              icon
                              small
                            >
                              <v-tooltip top color="rgb(43 147 253)">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon
                                    color="rgb(43 147 253)"
                                    @click="ChatHistory(itemsJob)"
                                    small
                                  >
                                  mdi-message-processing
                                  </v-icon>
                                </template>
                                <span>แชท</span>
                              </v-tooltip>
                            </v-btn>
                            <!-- update satatus car -->
                            <v-btn
                              color="primary"
                              class="buttonGroup"
                              elevation="2"
                              icon
                              small
                            >
                            <v-tooltip top
                                    color="#4F93D0"
                                    >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      v-if="
                                        allJob.filter(row => {
                                          return row.jobId == itemsJob.jobId
                                        })[0].checkCar == 'False'"
                                      color="#9E9E9E"
                                      depressed
                                      @click="updateStatusCars(itemsJob.jobId, 'False')"
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      mdi-car
                                    </v-icon>

                                    <v-icon
                                      v-else
                                      color="#4F93D0"
                                      depressed
                                      @click="updateStatusCars(itemsJob.jobId, 'True')"
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      mdi-car
                                    </v-icon>
                                    </template>
                                    <span>สถานะ รถอยู่ / รถไม่อยู่</span>
                                    </v-tooltip>
                            </v-btn>
                          <!-- end update satatus car -->
                          </div>
                          <!-- <v-tooltip top
                            color="#DE6467">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                  color="#DE6467"
                                  v-bind="attrs"
                                  v-on="on"
                                  dark
                                  @click=";(dialogEdit = true), setUpdate(itemsJob)"
                            >
                              mdi-square-edit-outline
                            </v-icon>
                              </template>
                              <span>แก้ไขข้อมูล</span>
                            </v-tooltip>

                          <v-tooltip
                         v-if="allJob.filter(row => {
                                  return row.jobId == itemsJob.jobId
                                })[0].checkCar !== 'False'
                              "
                        top
                        color="#FF8C00">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="#FF8C00"
                              @click=";(dialog = true),
                                  setUpdate(itemsJob, 'editFlow', item)
                              "
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-shuffle-variant
                            </v-icon>
                          </template>
                          <span>เปลี่ยนขั้นตอนการทำงาน</span>
                        </v-tooltip>
                        <v-tooltip top
                        color="#FF8C00"
                        >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                        v-if="
                            allJob.filter(row => {
                              return row.jobId == itemsJob.jobId
                            })[0].checkCar == 'False'
                          "
                          v-bind="attrs"
                          v-on="on"
                          color="#9E9E9E"
                        >
                          mdi-shuffle-variant
                        </v-icon>
                      </template>
                      <span>เปลี่ยนขั้นตอนการทำงาน</span>
                    </v-tooltip>
                    <v-tooltip top
                        color="#84C650"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              v-bind="attrs"
                              v-on="on"
                              color="#84C650"
                              @click="
                                ;(dialogDelete = true), setUpdate(itemsJob, 'closeJob')
                              "
                            >
                              mdi-cash-usd-outline
                            </v-icon>
                          </template>
                          <span>จบงาน</span>
                        </v-tooltip>
                        <v-tooltip top color="rgb(43 147 253)">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                v-if="itemsJob.userId !== '' && itemsJob.userId !== 'user-skip'"
                                  color="rgb(43 147 253)"
                                  @click="ChatHistory(itemsJob)"
                                >
                                mdi-message-text-outline
                                </v-icon>
                              </template>
                              <span>แชท</span>
                            </v-tooltip> -->
                          <!-- <v-icon
                              large
                              color="#A12BFD"
                              @click="
                                ;(dialogProgress = true), getJobitem(itemsJob)
                              "
                            >
                              mdi-monitor-eye
                            </v-icon> -->
                        </v-col>
                      </v-row>
                    </v-alert>
                </v-expansion-panel-content>
                    </v-expansion-panel>
              </v-expansion-panels>
            <br />
        </div>
        <v-dialog
          v-model="dialogProgress"
          max-width="600"
        >
          <v-card class="p-3">
            <v-timeline>
              <v-timeline-item
                v-for="(item , index) in timelineitem" :key="index"
                :color="codeColor[index]"
                small
              >
                <template v-slot:opposite>
                  <span>{{format_dateNotime(item.DTLAST_DATE)}}</span>
                </template>
                <v-card class="elevation-2 p-2" color="#F5F5F5">
                  <v-card-title class="text-h6">
                  </v-card-title>
                  <v-card-text dark>
                    <p style="margin-bottom: 0px;color:#000000;">ขั้นตอน {{item.stepTitle}}</p>
                    <!-- <p style="margin-bottom: 0px; color:#173053;">ขั้นตอน {{item.stepTitle}}</p> -->
                    <p style="margin-bottom: 0px;"> เวลาที่รับงาน {{momenTime(item.DTLAST_DATE)}}</p>
                    <p style="margin-bottom: 0px;"> ผู้รับผิดชอบ {{item.empStep}}</p>
                    <p style="margin-bottom: 0px;">เวลาการทำงาน {{item.Counttime}} นาที</p>
                    <!-- <p style="margin-bottom: 0px;">วันที่เปลี่ยน {{format_dateNotime(item.DTLAST_DATE)}}</p> -->
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
            <br>
            <div class="text-center">
              <v-btn
                small class="ma-2" color="#173053" dark
                @click="dialogProgress = false"
              >
                Close
              </v-btn>
            </div>
          </v-card>
        </v-dialog>
      </div>
      <!-- <v-dialog v-model="dialogWorkShop" max-width="70%">
        <v-card min-width="200px" class="pa-2 pl-5 ma-0 pb-3 mt-n14" style="overflow-y: auto;"> -->
          <WorkShopComponent @confirmed="getLayout" ref="EditWorkShop"></WorkShopComponent>
          <ChatHistory ref="ChatHistory"></ChatHistory>
        <!-- </v-card>
      </v-dialog> -->
      <!-- <WorkShop></WorkShop> -->
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import draggable from 'vuedraggable'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import Menu from '../System/Menu.vue'
import WorkShopComponent from './WorkShopComponent.vue'
import ChatHistory from './ChatHistory.vue'
import moment from 'moment' // แปลง date

export default {
  name: 'hello',
  components: {
    draggable,
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    Menu,
    WorkShopComponent,
    ChatHistory
  },
  computed: {
    colsWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '12'
        case 'sm': return '12'
        case 'md': return '12'
        case 'lg': return '4'
        case 'xl': return '4'
      }
    },
    colsWidthTitle () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '12'
        case 'sm': return '12'
        case 'md': return '8'
        case 'lg': return '8'
        case 'xl': return '8'
      }
    },
    classWork () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return ''
        case 'sm': return ''
        case 'md': return ''
        case 'lg': return 'workRow'
        case 'xl': return 'workRow'
      }
    }
  },
  watch: {
    // whenever question changes, this function will run
    dateFilter (newQuestion, oldQuestion) {
      console.log('dateFilter', newQuestion, oldQuestion)
      if (newQuestion === null) {
        this.getJobData()
      }
    }
  },
  data () {
    return {
      dateFilter: '',
      menuDatefilter: false,
      dialogWorkShop: false,
      overlay: false,
      overlayUpdateStep: false,
      overlayEdit: false,
      timelineitem: [],
      Layout: [],
      layout: 'grid',
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'Flow',
          disabled: false,
          href: '/Master/Flow'
        }
      ],
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        required: value => !!value || 'กรุณากรอก.'
      },
      columnsStep: [
        { text: 'Title', value: 'stepTitle' },
        { text: ' ', value: 'actions2', sortable: false, align: 'center' }
      ],
      DataflowId: '',
      dialog: false,
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogProgress: false,
      date: this.momenDate_1(),
      // DIALOG ADD
      drawer: false,
      drawer1: false,
      endDate: '',
      endTime: '',
      editedItemSelete: [],
      flowfieldNameitem: [],
      item_newcars: [],
      flowCode: '',
      form1: {},
      menu: false,
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      stepItemSelete: [],
      stepItemSeleteInBoard: [],
      empSeleteStep: [],
      DataFlowName: [],
      validAdd: false,
      TotalDate: [],
      DataBranchName: [],
      ItemSelete: [],
      userId: '',
      totalDateDiff: '',
      masBranchID: '',
      branchData: [],
      timeavailable: [],
      formUpdate: {
        stepId: '',
        flowId: '',
        flowName: '',
        stepTitle: '',
        sortNo: '',
        CREATE_USER: '',
        LAST_USER: '',
        endDate: '',
        endTime: '',
        jobId: '',
        empStep: '',
        departmentStep: '',
        branchStep: '',
        checkCar: ''
      },
      optionsMoney: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 2
      },
      updateEndDateOld: '',
      updateEndTimeOld: '',
      lineUserId: '',
      JobDataItem: [],
      allJob: [],
      form: {
        jobId: '',
        flowId: '',
        stepId: '',
        fieldId: '',
        fieldValue: '',
        fieldName: ''
      },
      codeColor: [
        '#4D67AB',
        // '#FED966',
        '#E67F33',
        '#57A2AC',
        '#824D99',
        '#84C650',
        '#EB56F6',
        '#CE2220',
        '#E67F33',
        '#4E79C4',
        '#4D67AB',
        '#4E79C4',
        '#57A2AC',
        '#824D99',
        '#84C650',
        '#C65050',
        '#CE2220',
        '#E67F33',
        '#C65050',
        '#FED966'
      ],
      pastelColor: [
        '#FFA5B5',
        '#FFCBA4',
        '#FFD700',
        '#90EE90',
        '#7CFC00',
        '#87CEEB',
        '#6495ED',
        '#4682B4',
        '#9370DB',
        '#D8BFD8',
        '#FF69B4',
        '#FFA500',
        '#F4A460',
        '#9ACD32',
        '#BA55D3',
        '#32CD32',
        '#5DADE2',
        '#A2D9CE',
        '#D2B48C',
        '#FFD480'
      ],
      formDelete: {
        jobNo: '',
        shopId: this.$session.getAll().data.shopId,
        totalPrice: '0'
      },
      formUpdateCar: {
        jobNo: '',
        shopId: this.$session.getAll().data.shopId,
        checkCar: ''
      },
      formEditData: {
        jobNo: '',
        shopId: this.$session.getAll().data.shopId,
        fieldValue: '',
        endDate: '',
        endTime: ''
      },
      formUpdateStep: {
        stepId: '',
        flowId: '',
        stepTitle: '',
        sortNo: '',
        LAST_USER: '',
        shopId: '',
        sendCard: ''
      },
      checkPayment: 'True',
      setTimerJob: '',
      packageId: '',
      dataPackage: [],
      flowId: '',
      dataCoin: '',
      productExchangeRateId: '',
      searchOther: '',
      allJobSupport: [],
      jobDataItemSupport: [],
      statusPushEndStep: 'False',
      endStepItem: [],
      ItemendStepStanby: [],
      dataLineConfig: {},
      memberTel: ''
    }
  },
  async mounted () {
    this.dataReady = false
    this.dataLineConfig = await this.getDataLineConfig(this.$session.getAll().data.shopId)
    // Get Data
    this.$root.$on('closeSetTime', () => {
      // your code goes here
      this.closeSetTime()
    })
    // await this.getDataFlow()
    await this.getDataBranch()
    await this.getEmpSelect()
    // await this.getLayoutDefault()
  },
  methods: {
    CheckstatusPushEndStep (item) {

    },
    ChatHistory (item) {
      console.log('item!!!!!!!', item)
      this.$refs.ChatHistory.getChatHistory(item)
    },
    filterJob () {
      let filterJob = this.allJob.filter((item) => item.dueDate === this.dateFilter)
      this.allJob = filterJob
    },
    refreshData () {
      this.searchOther = ''
      this.allJob = this.allJobSupport
      this.JobDataItem = this.jobDataItemSupport
      this.setTimeJob()
    },
    async searchAny () {
      // await this.getStepFlow()
      this.closeSetTime()
      if (this.searchOther.length > 0) {
        if (this.allJobSupport.length > 0) {
          this.allJob = this.allJobSupport
        }
        if (this.jobDataItemSupport.length > 0) {
          this.JobDataItem = this.jobDataItemSupport
        }
        this.allJobSupport = this.allJob
        this.jobDataItemSupport = this.JobDataItem
        // let dataSearch = this.jobDataItemSupport.filter(el => { return el.fieldValue.includes(this.searchOther) })
        let jobIds = this.jobDataItemSupport.filter(el => { return el.fieldValue.replace(/ |-/g, '').includes(this.searchOther.toLowerCase().replace(/ |-/g, '')) })
        console.log('jobIds', jobIds)
        let dataSearch = []
        for (let i = 0; i < jobIds.length; i++) {
          let d = jobIds[i]
          if (this.jobDataItemSupport.filter(el => { return el.jobId === d.jobId }).length > 0) {
            for (let i = 0; i < this.jobDataItemSupport.filter(el => { return el.jobId === d.jobId }).length; i++) {
              let s = this.jobDataItemSupport.filter(el => { return el.jobId === d.jobId })[i]
              dataSearch.push(s)
            }
          }
          //  (this.jobDataItemSupport.filter(el => { return el.jobId === d.jobId }))
        }
        if (dataSearch.length > 0) {
          let allJob = []
          for (let i = 0; i < jobIds.length; i++) {
            let d = jobIds[i]
            allJob.push(this.allJobSupport.filter(el => { return el.jobId === d.jobId })[0])
          }
          console.log('dataSearch', dataSearch)
          console.log('allJob', allJob)

          this.JobDataItem = dataSearch
          this.allJob = allJob
          this.closeSetTime()
        } else {
          this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณากรอกข้อความที่จะค้นหา', 'error')
      }
    },
    setTimeJob () {
      let _this = this
      this.setTimerJob = setInterval(function () { _this.getJobData() }, 60000)
    },
    closeSetTime () {
      clearInterval(this.setTimerJob)
      this.setTimerJob = null
    },
    async chkFlowName () {
      if (this.flowId !== '') {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': this.layout = 'list'
            break
          case 'sm': this.layout = 'list'
            break
          case 'md': this.layout = 'grid'
            break
          case 'lg': this.layout = 'grid'
            break
          case 'xl': this.layout = 'grid'
            break
        }
        this.closeSetTime()
        await this.getStepFlow()
        await this.getLayout()
        await this.getJobData()
        this.setTimeJob()
      } else {
        this.$swal('ผิดพลาด', 'กรุณาเลือก ประเภทบริการ', 'error')
      }
    },
    async chkBranchName () {
      if (this.masBranchID !== '') {
        this.closeSetTime()
        await this.getStepFlow()
        await this.getLayout()
        await this.getJobData()
        this.setTimeJob()
      }
    },
    async getDataFlow () {
      this.DataFlowName = []
      console.log('DataFlowName', this.DataFlowName)
      await axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId
        // + '&checkOnsite=is null'
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              if (d.masBranchID === this.masBranchID.toString() || (d.masBranchID === 'All' || d.masBranchID === null)) {
                console.log('d', d.flowName, d.masBranchID, this.masBranchID)
                d.text = d.flowName
                d.value = d.flowId
                this.DataFlowName.push(d)
              }
            }
          } else {
            this.DataFlowName = []
          }
        })
      if (this.DataFlowName.length === 1) {
        console.log('#########')
        this.flowId = this.DataFlowName[0].value
        await this.chkFlowName()
      }
    },
    checkTime () {
      console.log('this.branchData', this.branchData)
      console.log('masBranchID', this.masBranchID)
      this.timeavailable = JSON.parse(this.branchData.filter(item => { return item.masBranchID === this.masBranchID })[0].setTime)
      console.log('timevailable', this.timeavailable)
    },
    getDataBranch () {
      let DataBranchName = []
      let branchData = []
      this.DataBranchName = []
      this.branchData = []
      console.log('DataBranchName', this.DataBranchName)
      axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.masBranchName
              d.value = d.masBranchID
              DataBranchName.push(d)
              branchData.push(d)
            }
            if (this.session.data.masBranchID === '' || this.session.data.masBranchID === null) {
              this.DataBranchName = DataBranchName
              this.branchData = branchData
            } else {
              let checkData = branchData.filter(el => { return el.value === this.session.data.masBranchID })
              if (checkData.length > 0) {
                this.DataBranchName = checkData
                this.branchData = checkData
              } else {
                await this.getDataBranch()
                if (checkData.length > 0) {
                  this.DataBranchName = checkData
                  this.branchData = checkData
                } else {
                  this.DataBranchName = []
                  this.branchData = []
                  this.$swal('ผิดพลาด', 'กรุณาตรวจสอบสาขาของท่าน เนื่องจากระบบตรวจหาสาขาไม่พบ', 'error')
                }
              }
            }
          } else {
            this.DataBranchName = []
            this.branchData = []
          }
          if (this.branchData.length === 1) {
            this.masBranchID = this.DataBranchName[1].value
            await this.getDataFlow()
          }
        })
    },
    clearDataFlow () {
      this.Layout = []
      this.JobDataItem = []
      this.allJob = []
    },
    async getLayout () {
      this.Layout = []
      // console.log('Branch' + this.masBranchID)
      // console.log('this.stepItemSelete', this.stepItemSelete)
      await axios
        .get(
          this.DNS_IP +
            '/WorkShopLayout/get?flowId=' +
            this.flowId +
            '&masBranchID=' + this.masBranchID +
            '&shopId=' +
            this.shopId
        )
        .then(response => {
          let rs = response.data
          for (let i = 0; i < rs.length; i++) {
            let d = rs[i]
            var workData = []
            var workDataUse = []
            workData = JSON.parse(d.workData)
            console.log('workData', workData)
            if (workData.length > 0) {
              for (let x = 0; x < workData.length; x++) {
                let t = workData[x]
                let s = {}
                s.sortNo = t.sortNo
                s.stepId = t.stepId
                var chkStepTitle = this.stepItemSelete.filter(el => { return el.stepId === t.stepId })
                if (chkStepTitle.length > 0) {
                  s.stepTitle = this.stepItemSelete.filter(el => { return el.stepId === t.stepId })[0].stepTitle
                  workDataUse.push(s)
                }
              }
            } else {
              workDataUse = []
            }
            this.Layout.push({
              workShopId: d.workShopId,
              workColum: d.workColum,
              workData: workDataUse
            })
          }
          // console.log('this.Layout', this.Layout)
        })
        .catch(error => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async getStepFlow () {
      this.stepItemSelete = []
      await axios
        .get(
          this.DNS_IP +
            '/flowStep/get?flowId=' +
            this.flowId +
            '&shopId=' +
            this.shopId
        )
        .then(async response => {
          let rs = response.data
          // console.log('rs', rs)
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              console.log('DDDDDDDD', d)
              d.text = d.stepTitle
              d.value = d.stepId
              this.stepItemSelete.push(d)
            }
            this.endStepItem = rs.filter((endItem) => endItem.sortNo === rs.length)
            console.log('this.endStepItem', this.endStepItem)
            // console.log('stepItemSelete', this.stepItemSelete)
          }
        })
    },
    async getEmpSelect () {
      this.empSeleteStep = []
      await axios
        .get(this.DNS_IP + '/empSelect/getUse?privacyPage=board&shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.masBranchID = d.masBranchID || ''
              if (this.$session.getAll().data.masBranchID === '' || this.$session.getAll().data.masBranchID === null) {
                let s = {}
                s.text = d.empFirst_NameTH + ' ' + d.empLast_NameTH
                s.value = d.empId
                s.masBranchID = d.masBranchID
                this.empSeleteStep.push(s)
              } else {
                if (this.$session.getAll().data.masBranchID === d.masBranchID || d.masBranchID === '') {
                  let s = {}
                  s.text = d.empFirst_NameTH + ' ' + d.empLast_NameTH
                  s.value = d.empId
                  s.masBranchID = d.masBranchID
                  this.empSeleteStep.push(s)
                }
              }
            }
            // console.log('empSeleteStep', this.empSeleteStep)
          }
        })
    },
    async getJobData () {
      // this.JobDataItem = []
      // this.allJob = []
      var JobDataItem = []
      var allJob = []
      axios
        .get(
          this.DNS_IP +
            '/job/get?checkUser=check&flowId=' +
            this.flowId +
            '&masBranchID=' + this.masBranchID +
            '&shopId=' +
            this.shopId
            //  + '&checkOnsite=is null'
          // '&stepId=is null'
        )
        .then(async response => {
          this.dataReady = true
          var jobs = []
          // console.log('res', response.data.length)
          console.log('res', response.data)
          // console.log('userId', this.formUpdate.userId === 'NULL')
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              var d = response.data[i]
              d.userId = d.userId || ''
              if (jobs.indexOf(d.jobId) === -1) {
                jobs.push(d.jobId)
                if (d.userId !== '') {
                  if (this.dateFilter === '' || this.dateFilter === null) {
                    let rss = response.data.filter(el => { return el.jobId === d.jobId })
                    for (let x = 0; x < response.data.filter(el => { return el.jobId === d.jobId }).length; x++) {
                      let s = rss[x]
                      // jobs.push(element.jobId)
                      JobDataItem.push(s)
                    }
                    allJob.push({
                      jobId: d.jobId,
                      jobNo: d.jobNo,
                      stepId: d.stepId,
                      checkCar: d.checkCar,
                      dueDate: moment(d.dueDate).format('YYYY-MM-DD'),
                      totalDateDiff: d.totalDateDiff,
                      endDate: d.endDate,
                      endTime: d.endTime,
                      checkPayment: d.checkPayment,
                      empStepId: d.empStepId,
                      empId: d.empId,
                      lineUserId: d.lineUserId,
                      userId: d.userId,
                      packageId: d.packageId,
                      statusTime: d.statusTime
                    })
                  } else {
                    if (moment(d.dueDate).format('YYYY-MM-DD') === this.dateFilter) {
                      let rss = response.data.filter(el => { return el.jobId === d.jobId })
                      for (let x = 0; x < response.data.filter(el => { return el.jobId === d.jobId }).length; x++) {
                        let s = rss[x]
                        // jobs.push(element.jobId)
                        JobDataItem.push(s)
                      }
                      allJob.push({
                        jobId: d.jobId,
                        jobNo: d.jobNo,
                        stepId: d.stepId,
                        checkCar: d.checkCar,
                        dueDate: moment(d.dueDate).format('YYYY-MM-DD'),
                        totalDateDiff: d.totalDateDiff,
                        endDate: d.endDate,
                        endTime: d.endTime,
                        checkPayment: d.checkPayment,
                        empStepId: d.empStepId,
                        empId: d.empId,
                        lineUserId: d.lineUserId,
                        userId: d.userId,
                        packageId: d.packageId,
                        statusTime: d.statusTime
                      })
                    }
                  }
                }
              }
            }
            if (JobDataItem.length > 0) {
              this.JobDataItem = JobDataItem
            } else {
              this.JobDataItem = []
            }
            if (allJob.length > 0) {
              this.allJob = allJob
            } else {
              this.allJob = []
            }
            console.log('allJob', this.allJob)
          } else {
            this.JobDataItem = []
            this.allJob = []
            this.$swal('ไม่มีข้อมูล', 'กรุณาเลือกบริการใหม่', 'warning')
            clearInterval(this.setTimerJob)
            this.setTimerJob = null
          }
        })
    },
    async pushmessage (jobId) {
      let updateStatusSend = { updateStatusSend: 'false' }
      await axios
        .post(this.DNS_IP + '/job/pushMsg/' + jobId, updateStatusSend)
        .then(console.log(jobId))
    },
    async NotifyEmpTime (jobNo) {
      await axios
        .post(this.DNS_IP + '/job/NotifyEmpTime/' + jobNo)
        .then(console.log(jobNo))
    },
    async editStep () {
      this.$router.push('/Master/Flow')
    },
    async newCars () {
      this.$router.push('/Master/RegisterAdd')
    },
    async editLayout () {
      console.log('testt', this.flowId, this.masBranchID)
      // if (this.flowId !== '' && this.masBranchID !== '') {
      // this.dialogWorkShop = true
      this.$refs.EditWorkShop.showDialog(this.flowId, this.masBranchID)
      // }
      //
      // console.log('testt', this.flowId, this.masBranchID)
      // this.$router.push('/Master/WorkShop')
    },
    itemCars (item) {
      this.item_newcars = item
    },
    async setUpdate (item, text, stepItem) {
      this.ItemendStepStanby = item
      console.log('ItemendStepStanby', this.ItemendStepStanby)
      this.dataPackage = []
      this.dataCoin = []
      // console.log(this.formUpdate)
      // console.log(this.stepItemSelete)
      console.log('item1', item)
      console.log('JobDataItem', this.JobDataItem.filter(row => {
        return row.jobId === item.jobId
      }))
      // console.log('stepItem', stepItem)
      clearInterval(this.setTimerJob)
      this.setTimerJob = null
      this.checkPayment = item.checkPayment
      var dataStepItemSelete = this.stepItemSelete
      // var index = dataStepItemSelete.findIndex(key => key.text === stepTitle)
      this.formUpdate.jobId = item.jobId
      this.formUpdate.jobNo = item.jobNo
      this.updateEndDateOld = this.momenDate_1(item.endDate)
      this.updateEndTimeOld = item.endTime
      this.formUpdate.endDate = this.momenDate_1(item.endDate)
      this.formUpdate.endTime = item.endTime
      this.formDelete.jobNo = item.jobNo
      this.formUpdate.empStep = parseInt(item.empStepId)
      var lineUserId = ''
      var userId = ''
      if (item.lineUserId === null || item.lineUserId === '' || item.lineUserId === 'user-skip' || item.lineUserId === undefined) {
        lineUserId = ''
      } else {
        lineUserId = item.lineUserId
      }
      if (item.userId === null || item.userId === '' || item.userId === 'user-skip' || item.userId === undefined) {
        userId = ''
      } else {
        userId = item.userId
      }
      this.lineUserId = lineUserId
      this.userId = userId
      // this.formUpdate.empStep = this.JobDataItem.filter(row => {
      //   return row.jobId === item.jobId
      // })[0].empStep
      if (text === 'editFlow') {
        this.stepItemSeleteInBoard = dataStepItemSelete.filter(el => el.text !== stepItem.stepTitle)
      }
      if (text === 'closeJob') {
        this.getCoin(item)
        if (item.packageId === '' || item.packageId === null) {

        } else {
          await this.getPackage(item)
          if (this.dataPackage.length > 0) {
            var dataPack = this.dataPackage.filter(el => { return el.packageId === item.packageId })
            this.packageId = {text: dataPack[0].text, value: item.packageId}
          }
        }
      }
    },
    async getPackage (dt) {
      // this.fieldNameItem.forEach((field, index) => {
      //   if (field.fieldId === 101) {
      //     this.fieldNameItem[index].fieldValue = String(this.fromAdd.flowId)
      //   }
      // })
      this.dataPackage = []
      await axios.get(this.DNS_IP_Loyalty + '/PackageLog/get?shopId=' + this.shopId + '&lineUserId=' + dt.lineUserId +
      '&flowId=' + this.flowId).then(response => {
        console.log('PackageLog', response.data)
        let rs = response.data
        if (rs.status !== false) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            d.text = d.packageName
            d.value = d.packageId
            this.dataPackage.push(d)
            // console.log('this.DataFlowName', this.DataFlowName)
          }
        } else {
          this.dataPackage = []
        }
      })
    },
    async getCoin (dt) {
      // this.fieldNameItem.forEach((field, index) => {
      //   if (field.fieldId === 101) {
      //     this.fieldNameItem[index].fieldValue = String(this.fromAdd.flowId)
      //   }
      // })
      let checkLine = await this.getDataLineConfig(this.shopId)
      let urlLoyalty = ''
      if (checkLine.checkLineConfig === false) {
        urlLoyalty = this.DNS_IP_Loyalty + '/member/get?shopId=' + this.shopId + '&lineUserId=' + dt.lineUserId
      } else {
        urlLoyalty = this.DNS_IP_Loyalty + '/member/get?shopId=' + this.shopId + '&liffUserId=' + dt.lineUserId
      }
      await axios.get(urlLoyalty)
        .then(response => {
          let rs = response.data
          if (rs.status !== false) {
            if (checkLine.checkLineConfig === false) {
              this.lineUserId = rs[0].lineUserId || ''
            } else {
              this.lineUserId = rs[0].liffUserId || ''
            }
            this.memberTel = rs[0].tel || ''
          } else {
            this.lineUserId = ''
            this.memberTel = ''
          }
        }).catch(error => {
          this.lineUserId = ''
          this.memberTel = ''
          console.log('error function addDataGlobal : ', error)
        })
      console.log('this.lineUserId', this.lineUserId)
      console.log('this.memberTel', this.memberTel)
      if (this.lineUserId !== '') {
        this.dataCoin = []
        await axios.get(this.DNS_IP_Loyalty + '/productExchangeRate/get?shopId=' + this.shopId +
      '&flowId=' + this.flowId).then(response => {
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
        }).catch(error => {
          this.dataCoin = []
          console.log('error function addDataGlobal : ', error)
        })
      }
    },
    async updateStepEnd () {
      console.log('endStepItem', this.endStepItem)
      console.log('ItemendStepStanby', this.ItemendStepStanby)
      if (this.statusPushEndStep === 'True') {
        let itemUpdate = {}
        itemUpdate.stepId = this.endStepItem[0].stepId
        itemUpdate.flowId = this.flowId
        itemUpdate.shopId = this.shopId
        itemUpdate.LAST_USER = this.session.data.userName
        itemUpdate.jobId = this.ItemendStepStanby.jobId
        await axios
          .post(
          // eslint-disable-next-line quotes
            this.DNS_IP + '/job/edit/' + itemUpdate.jobId,
            itemUpdate
          )
          .then(async response => {
          // Debug response
            console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
            await this.pushmessage(itemUpdate.jobId)
          })
        // eslint-disable-next-line handle-callback-err
          .catch(error => {
            console.log('error function editDataGlobal : ', error)
          })
      }
    },
    async onUpdate () {
      this.formUpdate.stepId = this.formUpdate.stepTitle.stepId
      this.formUpdate.flowId = this.flowId
      this.formUpdate.shopId = this.shopId
      console.log('formUpdate', this.formUpdate)
      // console.log('allJob', this.allJob)
      // console.log('empSeleteStep', this.empSeleteStep)
      // console.log('empStep', this.formUpdate.empStep)
      if (this.formUpdate.empStep !== '' && this.formUpdate.stepTitle !== '') {
        this.dataReady = false
        this.$swal({
          title: 'ต้องการ แก้ไขสถานะ ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        })
          .then(async result => {
            this.overlayUpdateStep = true
            this.formUpdate.LAST_USER = this.session.data.userName
            var ID = this.formUpdate.jobId
            var flowId = this.flowId
            delete this.formUpdate['flowName']
            delete this.formUpdate['sortNo']
            delete this.formUpdate['CREATE_USER']
            // delete this.formUpdate['stepTitle']
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + '/job/edit/' + ID,
                this.formUpdate
              )
              .then(async response => {
              // Debug response
                console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
                // this.dialog = false
                // this.$swal('เรียบร้อย', 'แก้ไขสถานะ เรียบร้อย', 'success')
                // this.getStepFlow()
                // this.getLayout()
                // this.allJob.map((row, index) => {
                //   if (row.jobId === ID) {
                //     this.allJob[index].stepId = this.formUpdate.stepId
                //   }
                // })
                await this.updateTimeEmp(this.allJob.filter((item) => item.jobId === this.formUpdate.jobId)[0], 'closeStep', this.formUpdate.empStep)
                this.flowId = flowId
                await this.pushmessage(this.formUpdate.jobId)
                await this.NotifyEmpTime(this.formUpdate.jobNo)
                this.dialog = false
                this.overlayUpdateStep = false
                this.$swal('เรียบร้อย', 'แก้ไขสถานะ เรียบร้อย', 'success')
                this.getStepFlow()
                // this.getLayout()
                await this.getJobData()
                this.setTimeJob()
              // console.log('allJob', this.allJob)
              // console.log(this.formUpdate.jobId)
              // console.log(this.formUpdate.stepId)
              })
            // eslint-disable-next-line handle-callback-err
              .catch(error => {
                this.dataReady = true
                this.overlayUpdateStep = false
                console.log('error function editDataGlobal : ', error)
              })
          })
          .catch(error => {
            this.dataReady = true
            console.log('error function editDataGlobal : ', error)
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ', 'error')
      }
    },
    async clearData () {
      // this.formUpdate.stepTitle = ''
      // eslint-disable-next-line no-redeclare
      for (var key in this.formEdit) {
        console.log('Key', key)
        console.log('Value', this.formEdit)

        if (this.formEdit[key]) {
          this.formEdit[key] = ''
        }
      }
    },
    async updateStatusCars (item, status) {
      console.log('1', this.formUpdate.jobId)
      console.log('2', item)
      this.$swal({
        title: 'อัพเดท สถานะรถ ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ยกเลิก'
      }).then(async response => {
        var ID = item
        var statusUse = ''
        if (status === 'True') {
          statusUse = 'False'
        } else {
          statusUse = 'True'
        }
        let ds = {
          jobNo: this.formUpdateCar.jobNo,
          shopId: this.formUpdateCar.shopId,
          checkCar: statusUse,
          LAST_USER: this.session.data.userName,
          statusUpdateCar: 'True'
        }
        console.log('ds', ds)
        await axios
          .post(this.DNS_IP + '/job/editStatus/' + ID, ds)
          .then(async response => {
            this.$swal('เรียบร้อย', 'อัพเดท สถานะรถ เรียบร้อย', 'success')
            this.getStepFlow()
            // this.getLayout()
            await this.getJobData()
            console.log('shopId:', this.shopId)
            console.log('form:', this.formUpdateCar)
          })
      })
    },
    async pushmessagePrice (jobNo) {
      let updateStatusSend = { updateStatusSend: 'false', checkPayment: this.checkPayment }
      await axios
        .post(this.DNS_IP + '/job/pushClosejob/' + jobNo, updateStatusSend)
        .then(console.log(jobNo))
        .catch((error) => console.log('error', error))
    },
    async closeJob () {
      console.log('this.productExchangeRateId', this.productExchangeRateId)
      console.log('this.packageId', this.packageId)
      if (this.checkPayment === 'True') {
        if (this.formDelete.totalPrice !== '') {
          await this.updateStepEnd()
          this.closeJobSubmit(this.formDelete.totalPrice)
        } else {
          this.$swal('ผิดพลาก', 'กรุณาใส่จำนวนเงิน', 'error')
        }
      } else {
        await this.updateStepEnd()
        this.closeJobSubmit('0')
      }
    },
    closeJobSubmit (totalPrice) {
      this.jobNo = ''
      console.log('shopId:', this.shopId)
      console.log('form:', this.formDelete)
      this.$swal({
        title: 'ให้บริการ เสร็จเรียบร้อยแล้ว ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#fa0202',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async response => {
        if (this.packageId !== '' && this.productExchangeRateId === '') {
          await this.usePackage()
        } else if (this.packageId === '' && this.productExchangeRateId !== '') {
          if (this.lineUserId !== '') {
            await this.useCoin(totalPrice)
          }
        } else if (this.packageId !== '' && this.productExchangeRateId !== '') {
          if (this.lineUserId !== '') {
            await this.useCoin(totalPrice)
            await this.usePackage()
          } else {
            await this.usePackage()
          }
        }
        var ID = this.formUpdate.jobId
        let ds = {
          jobNo: this.formDelete.jobNo,
          shopId: this.shopId,
          totalPrice: totalPrice,
          LAST_USER: this.session.data.userName,
          statusDelete: 'true'
        }
        console.log('ds', ds)
        await axios
          .post(this.DNS_IP + '/job/editPrice/' + ID, ds)
          .then(async response => {
            await this.pushmessagePrice(this.formDelete.jobNo)
            this.$swal('เรียบร้อย', 'ลบข้อมูล เรียบร้อย', 'success')
            await this.getStepFlow()
            // await this.getLayout()
            await this.getJobData()
            this.setTimeJob()
            this.dialogDelete = false
            this.formDelete.totalPrice = 0
            console.log('shopId:', this.shopId)
            console.log('form:', this.formDelete)
          })
      })
    },
    async usePackage () {
      var params = {
        shopId: this.shopId,
        token: this.packageId.token,
        branchBeLinked: this.masBranchID
      }
      await axios({
        method: 'post',
        headers: {
          shopId: this.shopId,
          lineUserId: this.lineUserId,
          lineId: this.userId
        },
        url: this.DNS_IP_Loyalty + '/use_package/edit',
        data: params
      }).then((response) => {})
    },
    async useCoin (totalPrice) {
      let ds = {
        exchangRateId: this.productExchangeRateId.value,
        Amount: parseInt(totalPrice),
        shopId: this.$session.getAll().data.shopId,
        tel: this.memberTel,
        liffUserId: this.lineUserId,
        refId: ''
      }
      console.log('ds', ds)
      await axios
        .post(this.DNS_IP_Loyalty + '/POSapi', ds)
        .then(async response => {
        })
    },
    // async useCoin (totalPrice) {
    //   // productExchangeRateId
    //   const today = new Date()
    //   // console.log(today)
    //   const date =
    //         today.getFullYear() +
    //         '' +
    //         (today.getMonth() + 1) +
    //         '' +
    //         today.getDate()
    //   const time =
    //         today.getHours() + '' + today.getMinutes() + '' + today.getSeconds()
    //   const token = date + '' + time
    //   var point = ''
    //   if (this.productExchangeRateId.exchangeRate === 0) {
    //     point = 0
    //   } else {
    //     point = parseInt(totalPrice) / this.productExchangeRateId.exchangeRate
    //   }
    //   var md5 = require('md5')
    //   var tokenKey = md5(token)
    //   let ds = {
    //     productExchangeRateId: this.productExchangeRateId.value,
    //     amount: parseInt(totalPrice),
    //     refId: '',
    //     point: parseInt(point),
    //     token: tokenKey,
    //     status: 'waiting',
    //     statusMemberCard: 'collect',
    //     CREATE_USER: this.session.data.userName,
    //     LAST_USER: this.session.data.userName,
    //     shopId: this.shopId,
    //     qrCodeURL: `https://liff.line.me/${this.dataLineConfig.liffMainIDLoyalty}/collect?shopId=${this.shopId}&token=${tokenKey}`
    //     // masBranchID: '',
    //     // branchName: ''
    //   }
    //   console.log('ds', ds)
    //   await axios
    //     .post(this.DNS_IP_Loyalty + '/qrcode/add', ds)
    //     .then(async response => {
    //       var params = {
    //         shopId: this.shopId,
    //         token: tokenKey
    //       }
    //       await axios({
    //         method: 'post',
    //         headers: {
    //           shopId: this.shopId,
    //           lineUserId: this.lineUserId,
    //           lineId: this.userId
    //         },
    //         url: this.DNS_IP_Loyalty + '/memberCard/edit',
    //         data: params
    //       }).then((response) => {})
    //     })
    // },
    async editData () {
      console.log(
        this.JobDataItem.filter(row => {
          return row.jobId === this.formUpdate.jobId
        })
      )
      this.jobNo = ''
      console.log('shopId', this.shopId)
      console.log('formEditData', this.formEditData)
      this.$swal({
        title: 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async result => {
        this.overlayEdit = true
        // var ID = this.formUpdate.jobId
        let rs = this.JobDataItem.filter(row => {
          return row.jobId === this.formUpdate.jobId
        })
        console.log('rs JobDataItem', rs)
        let dt = []
        var cusName = ''
        var cusReg = ''
        var jobDate = this.formUpdate.endDate + ' ' + this.formUpdate.endTime
        for (var i = 0; i < rs.length; i++) {
          var d = rs[i]
          var s = {}
          s.jobNo = d.jobNo
          s.jobId = d.jobId
          s.fieldId = d.fieldId
          if (d.fieldName === 'ชื่อ') {
            cusName = d.fieldValue
          }
          if (d.fieldName === 'เลขทะเบียน') {
            cusReg = d.fieldValue
          }
          s.fieldValue = d.fieldValue
          s.endDate = this.formUpdate.endDate
          s.endTime = this.formUpdate.endTime
          s.LAST_USER = d.LAST_USER
          dt.push(s)
        }
        console.log('dt', dt)
        await axios
          .post(
            // eslint-disable-next-line quotes
            this.DNS_IP + '/jobData/editData',
            dt
          )
          .then(async response => {
            this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
            var dateNew = this.formUpdate.endDate + this.formUpdate.endTime
            var dateOld = this.updateEndDateOld + this.updateEndTimeOld
            var jodDateOld = this.updateEndDateOld + ' ' + this.updateEndTimeOld
            console.log(dateNew, dateOld)
            console.log(this.lineUserId)
            if (dateNew !== dateOld && this.lineUserId !== '') {
              // แจ้งเตือนลูกค้า this.lineUserId
              let pushText = {
                'to': this.lineUserId,
                'messages': [
                  {
                    'type': 'text',
                    'text': ` ✍️ มีการเปลี่ยนแปลงเวลาวันรับรถ\n ✅ ชื่อ : ${cusName}\n ✅ เลขทะเบียน : ${cusReg}
                          \nจาก วันที่ ${this.format_dateFUllTime(jodDateOld)}
                          \nเป็น วันที่ ${this.format_dateFUllTime(jobDate)}`
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
            }
            this.getStepFlow()
            // this.getLayout()
            await this.getJobData()
            this.setTimeJob()
            this.dialogEdit = false
            this.overlayEdit = false
            console.log('shopId:', this.shopId)
            console.log('form:', this.formEditData)
          })
      })
    },
    async getJobitem (item) {
      console.log('*******************', item)
      this.timelineitem = []
      await axios
        .get(this.DNS_IP + '/job_logCloseJob/' + item.jobNo).then((response) => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.empStep = d.empStep
              s.endDate = d.endDate
              s.totalPrice = s.totalPrice
              s.DTCREATE_DATE = d.CREATE_DATE
              s.DTLAST_DATE = d.LAST_DATE
              s.stepTitle = d.stepTitle
              s.timediff = d.timediff
              s.Counttime = this.jsTimeDiff(d.CREATE_DATE, d.LAST_DATE)
              this.timelineitem.push(s)
            }
          }
        }).catch((error) => {
          console.log('error function addData : ', error)
        })
    },
    jsTimeDiff (Time1, Time2) {
      var oneday = 1000 * 60
      var defDate = (new Date(Time2).getTime() - new Date(Time1).getTime()) / oneday
      // console.log('def', Time1, Time2)
      return defDate
    },
    async updateTimeEmp (itemsJob, status, empIdstep) {
      let dt = this.format_date(new Date())
      console.log('dtttttttttttt', dt)
      console.log('ddddddddddddddddd', itemsJob)
      itemsJob.Time = dt
      itemsJob.statusTime = status
      console.log('itemsJobitemsJob', itemsJob)
      if (status === 'closeStep') {
        itemsJob.empId = empIdstep
        if (itemsJob.empId !== '' && itemsJob.empId !== null) {
          await axios.post(this.DNS_IP + '/TimeEmp_Log_Update/get', itemsJob).then(async (response) => {

          }).catch((error) => {
            console.log('error function addData : ', error)
          })
        } else {
          console.log('ผิดพลาด', 'กรุณาเลือกพนักงานที่รับผิดชอบ', 'error')
        }
      } else {
        this.$swal({
          title: 'อัพเดท เวลา ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
          if (itemsJob.empId !== '' && itemsJob.empId !== null) {
            await axios.post(this.DNS_IP + '/TimeEmp_Log_Update/get', itemsJob).then(async (response) => {
              await this.$swal('เรียบร้อย', 'อัพเดทเวลาสำเร็จ', 'success')
              await this.getStepFlow()
              // await this.getLayout()
              await this.getJobData()
            }).catch((error) => {
              console.log('error function addData : ', error)
            })
          } else {
            this.$swal('ผิดพลาด', 'กรุณาเลือกพนักงานที่รับผิดชอบ', 'error')
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.cardItem {
  display: flex;
}
.EditWorkShop {
  width: auto;
  background-color: #FFFFFF;
}
.textLayout {
  font-size: 16px !important;
}
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  background-color: #f0eeee !important;
}
.v-card__subtitle, .v-card__text, .v-card__title {
  padding: 0px !important;
}
.workRow {
  display: inline-block;
  width: max-content;
  height: max-content;
}
.Layout {
  margin-top: 2rem;
  min-width: 185px;
  max-width: 220px;
  background-color: #ffffff;
  /* margin-left: 1px; */
  max-width: auto;
}
.colum {
  margin-top: 2rem;
  width: 200px;
  background-color: #f0eeee;
  margin-left: 1.5px;
}
.allFrame {
  padding-top: 10px;
  padding-left: 10px;
  width: 100%;
  min-height: max-content;
}
#subtextTitle {
  color: #173053;
  font-size: 20px !important;
  font-weight: bold;
}
#textTitleB {
  color: #173053;
  font-size: 40px !important;
  font-weight: bold;
  font-family: Roboto;
  font-style: normal;
}
#cardleft {
  height: 1024px;
  width: 502px;
  left: 1210px;
  top: 0px;
  border-radius: 0px;
}
#v-img-car {
  height: 60px;
  width: 64px;
}
#img_edit_step {
  width: 135px;
  height: 100px;
}
#text_edit_step {
  Width: 250px;
  Height: 50px;
}
#textButton {
  height: 50px;
  width: 117px;
  font-family: Kittithada Bold 75;
  font-style: normal;
  font-weight: bold;
  align-items: center;
}
#text-Board {
  position: absolute;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  display: flex;
  align-items: center;
  color: #1b437c;
}
#cardTitle {
  width: auto !important;
  height: 32px !important;
  border-radius: 2px !important;
}
#v-text-editLayout {
  height: 50px;
  width: 238px;
}
body {
  overflow: auto;
  white-space: normal;
}
.totalJob {
  background-color: rgb(107, 107, 107);
    border-radius: 3px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
}
.cardItemNew {
  display: flex;
  flex-direction: column;
  padding: 10px;
  /* margin: 5px; */
  margin-bottom: 4px;
  min-height:120px;
  max-width: 100%;
}
.cardItemNone {
  padding: 10px;
  margin: 5px;
}
.subLayout {
  background-color: #eeeeee;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 6px;
  border-width: 1px;
  border-style: dashed;
  border-color: #525252;
}
.buttonGroup {
  margin-right: 3px;
  margin-top: 5px;
  padding: 2px;
}

</style>
