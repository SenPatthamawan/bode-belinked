<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="pl-12 pr-12 col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row>
          <v-col cols="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
          </v-col>
          <v-col cols="6" class="v-margit_button text-right">
            <!-- <v-btn
              color="primary"
              depressed
              @click="dialogwarn = true"
            >
              <v-icon color="orange darken-2" large left>mdi-alert-box-outline</v-icon>
            </v-btn> -->
            <v-btn
              color="purple"
              depressed
              dark
              @click="(dialogSortFlow = true)"
            >
              <v-icon left>mdi-vector-selection</v-icon>
              จัดลำดับการแสดง
            </v-btn>
            <v-btn
              color="primary"
              depressed
              @click="(dialogAdd = true), validate('ADD'), (desserts = []), getCustomField(), formAdd.storeFrontCheck = 'False'"
            >
              <v-icon left>mdi-text-box-plus</v-icon>
              เพิ่มประเภทบริการ
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-dialog v-model="dialogSortFlow" persistent max-width="70%">
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
                          @click="(dialogSortFlow = false)"
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
                          :key="element.flowId"
                        >
                          <v-icon>mdi-drag-variant</v-icon>
                          <!-- {{ element.flowId }} -->
                          {{ element.flowName }}
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
                      @click="saveSortFlow()"
                    >
                      จัดลำดับการแสดง
                    </v-btn>
                    <v-btn
                      color="error"
                      class="button"
                      dark
                      large
                      @click="dialogSortFlow = false"
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
          <!-- step -->
          <v-dialog v-model="dialogStep" persistent max-width="70%">
          <!-- <v-dialog v-model="dialogStep" persistent :max-width="checkOnsite === 'True' ? '50%' : '70%'"> -->
            <v-card>
              <v-form ref="form_update" v-model="validUpdate" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="10" class="text-left pt-10">
                      <h3><strong>{{ formUpdate.flowName }}</strong></h3>
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
                          @click="(dialogStep = false), clearData()"
                          >
                          X
                          </v-btn>
                      </div>
                      </v-col>
                  </v-row>
                    <v-row justify="center">
                      <!-- ADD steptitle-->
                      <v-dialog
                        v-model="dialogAddStepTitle"
                        persistent
                        max-width="600px"
                      >
                        <v-card>
                          <v-card-text>
                            <v-container>
                              <div style="text-align: end;">
                                  <v-btn
                                    fab
                                    small
                                    dark
                                    color="#F3F3F3"
                                    @click="dialogAddStepTitle = false"
                                  >
                                    <v-icon dark
                                    color="#FE4A01 ">
                                      mdi-close
                                    </v-icon>
                                  </v-btn>
                              </div>
                              <v-row justify="center">
                                <v-col cols="12" class="v-margit_text_add mt-1">
                                  <center>
                                    <v-col>
                                      <v-img
                                        id="v_img_add"
                                        :src="
                                          require('@/assets/AddTitleStep.svg')
                                        "
                                      ></v-img>
                                    </v-col>
                                  </center>
                                  <!-- <center>
                                    <v-col>
                                      <v-img
                                        class="v_text_add"
                                        :src="
                                          require('@/assets/Grouptitle.svg')
                                        "
                                      ></v-img>
                                    </v-col>
                                  </center> -->
                                  <v-col cols="12">
                                    <v-row>
                                      <v-col cols="12">
                                      <v-row >
                                        <h3 class="font-weight-bold" style="color:#173053;">ขั้นตอนบริการ</h3>
                                      </v-row>
                                      <v-row >
                                        <v-col cols="12" class="pb-0">
                                        <v-text-field
                                          v-model="formAddStep.stepTitle"
                                          dense
                                          outlined
                                          required
                                          label="ชื่อขั้นตอน(TH)"
                                        ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="pb-0 pt-0">
                                        <v-text-field
                                          v-model="formAddStep.stepTitleEN"
                                          dense
                                          outlined
                                          required
                                          label="ชื่อขั้นตอน(EN)"
                                        ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="pt-0 pb-0">
                                        <v-text-field
                                          v-model="formAddStep.finishTime"
                                          dense
                                          v-mask="'##:##'"
                                          placeholder="HH:mm"
                                          outlined
                                          required
                                          label="เวลาที่คาดว่าจะเสร็จ"
                                        ></v-text-field>
                                        </v-col>
                                        <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                                          <v-checkbox
                                          label="ท่านต้องการให้ส่งข้อความหลังเปลี่ยนขั้นตอนหรือไม่"
                                          :on-icon="'mdi-check-circle'"
                                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                                          false-value="False"
                                          color="#1B437C"
                                          true-value="True"
                                          v-model="formAddStep.pushMessageStatus"
                                        ></v-checkbox>
                                        </v-col>
                                        <v-col class="pt-0 pb-0" cols="12" v-if="formAddStep.pushMessageStatus === 'True'">
                                          <v-textarea
                                            outlined
                                            v-model="formAddStep.pushMessageTextTH"
                                            label="ข้อความหลังเปลี่ยนขั้นตอน (TH)"
                                          ></v-textarea>
                                        </v-col>
                                        <v-col class="pt-0 pb-0" cols="12" v-if="formAddStep.pushMessageStatus === 'True'">
                                          <v-textarea
                                            outlined
                                            v-model="formAddStep.pushMessageTextEN"
                                            label="ข้อความหลังเปลี่ยนขั้นตอน (EN)"
                                          ></v-textarea>
                                        </v-col>
                                        <v-btn
                                          dark
                                          elevation="2"
                                          x-large
                                          block
                                          color="#173053"
                                          @click="addDataStep()"
                                        >
                                          <v-icon left
                                            >mdi-checkbox-marked-circle</v-icon
                                          >
                                          เพิ่ม
                                        </v-btn>
                                      </v-row>
                                    </v-col>
                                    </v-row>
                                  </v-col>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                      <!-- end ADD step -->

                      <!--edit step -->
                      <v-dialog
                        v-model="dialogEditStep"
                        persistent
                        max-width="600px"
                       > <v-card>
                          <v-form
                            ref="form_update"
                            v-model="validUpdate"
                            lazy-validation
                          >
                            <v-card-text>
                              <v-container>
                                <div style="text-align: end;">
                                    <v-btn
                                      fab
                                      small
                                      dark
                                      color="#F3F3F3"
                                      @click="dialogEditStep = false"
                                    >
                                      <v-icon dark
                                      color="#FE4A01 ">
                                        mdi-close
                                      </v-icon>
                                    </v-btn>
                                </div>
                                <v-row justify="center">
                                  <v-col
                                    cols="12"
                                    class="v-margit_text_add mt-1"
                                  >
                                    <center>
                                      <v-col>
                                        <v-img
                                          id="v_img_edit"
                                          :src="
                                            require('@/assets/EditTitleNew.png')
                                          "
                                        ></v-img>
                                      </v-col>
                                    </center>
                                    <v-col cols="12">
                                      <v-row >
                                        <h3 class="font-weight-bold" style="color:#173053;">ขั้นตอนบริการ</h3>
                                      </v-row>
                                      <v-row >
                                        <v-col cols="12" class="pb-0">
                                        <v-text-field
                                          v-model="formUpdateStep.stepTitle"
                                          dense
                                          outlined
                                          required
                                          label="ชื่อขั้นตอน(TH)"
                                        ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="pb-0 pt-0">
                                        <v-text-field
                                          v-model="formUpdateStep.stepTitleEN"
                                          dense
                                          outlined
                                          required
                                          label="ชื่อขั้นตอน(EN)"
                                        ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="pt-0 pb-0">
                                        <v-text-field
                                          v-model="formUpdateStep.finishTime"
                                          dense
                                          v-mask="'##:##'"
                                          placeholder="HH:mm"
                                          outlined
                                          required
                                          label="เวลาที่คาดว่าจะเสร็จ"
                                        ></v-text-field>
                                        </v-col>
                                        <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                                          <v-checkbox
                                          label="ท่านต้องการให้ส่งข้อความหลังเปลี่ยนขั้นตอนหรือไม่"
                                          :on-icon="'mdi-check-circle'"
                                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                                          false-value="False"
                                          color="#1B437C"
                                          true-value="True"
                                          v-model="formUpdateStep.pushMessageStatus"
                                        ></v-checkbox>
                                        </v-col>
                                        <v-col class="pt-0 pb-0" cols="12" v-if="formUpdateStep.pushMessageStatus === 'True'">
                                          <v-textarea
                                            outlined
                                            v-model="formUpdateStep.pushMessageTextTH"
                                            label="ข้อความหลังเปลี่ยนขั้นตอน (TH)"
                                          ></v-textarea>
                                        </v-col>
                                        <v-col class="pt-0 pb-0" cols="12" v-if="formUpdateStep.pushMessageStatus === 'True'">
                                          <v-textarea
                                            outlined
                                            v-model="formUpdateStep.pushMessageTextEN"
                                            label="ข้อความหลังเปลี่ยนขั้นตอน (EN)"
                                          ></v-textarea>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                    <v-col >
                                      <v-row justify="center">
                                        <v-btn
                                          dark
                                          elevation="2"
                                          x-large
                                          block
                                          color="#173053"
                                          @click="editStepTitle()"
                                        >
                                          <v-icon left
                                            >mdi-checkbox-marked-circle</v-icon
                                          >
                                          แก้ไข
                                        </v-btn>
                                      </v-row>
                                    </v-col>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-card-text>
                          </v-form>
                        </v-card>
                      </v-dialog>
                      <!-- end EDIT step -->

                      <!-- datatable step -->
                      <v-col cols="12">
                        <v-row justify="center">
                          <v-data-table
                            class="elevation-1 custom_table_class"
                            dense
                            :headers="columnsStep"
                            :items="stepItemSelete"
                            disable-pagination
                            hide-default-footer
                          >
                          <!-- <v-data-table
                            class="elevation-1 custom_table_class"
                            dense
                            :headers="checkOnsite === 'True' ? columnsStepOnsite : columnsStep"
                            :items="stepItemSelete"
                            disable-pagination
                            hide-default-footer
                          > -->
                            <template v-slot:[`item.actions2`]="{ item, index }">
                            <!-- <template v-slot:[`item.actions2`]="{ item, index }" v-if="checkOnsite !== 'True'"> -->
                              <v-btn
                                v-show="index !== 0"
                                color="173053"
                                fab
                                x-small
                                outlined
                                @click="actionUp(item.stepId)"
                              >
                                <v-icon color="#173053">
                                  mdi-chevron-up
                                </v-icon>
                              </v-btn>
                              <v-btn
                                color="173053"
                                fab
                                x-small
                                outlined
                                @click="actionDown(item.stepId)"
                              >
                                <v-icon color="#173053">
                                  mdi-chevron-down
                                </v-icon>
                              </v-btn>
                            </template>
                            <template v-slot:[`item.finishTime`]="{ item }" >
                              <div v-if="item.finishTime !== null && item.finishTime !== ''"> {{item.finishTime + '  ชม.'}}</div>
                            </template>
                            <template v-slot:[`item.sendCard`]="{ item }" class="text-center">
                              <v-checkbox
                                false-value="False"
                                true-value="True"
                                :on-icon="'mdi-check-circle'"
                                :off-icon="'mdi-checkbox-blank-circle-outline'"
                                v-model="item.sendCard"
                              ></v-checkbox>
                              <!-- <v-checkbox
                                false-value="False"
                                true-value="True"
                                v-model="item.sendCard"
                                :readonly="checkOnsite === 'True' ? true : false"
                              ></v-checkbox> -->
                            </template>
                            <template v-slot:[`item.action`]="{ item, index }">
                            <!-- <template v-slot:[`item.action`]="{ item, index }" v-if="checkOnsite !== 'True'"> -->
                              <v-btn
                              color="info"
                              fab
                              dark
                              x-small
                              @click="FunCopy(item, index+1)"
                            >
                              <v-icon> mdi-qrcode-scan </v-icon>
                            </v-btn>
                              <v-btn
                                color="question"
                                fab
                                dark
                                x-small
                                @click.stop="
                                  (dialogEditStep = true),
                                    getUpdate(item),
                                    validate('UPDATE')
                                "
                              >
                                <v-icon color="#FFFFFF"> mdi-tools </v-icon>
                              </v-btn>
                              <v-btn
                                color="red"
                                dark
                                fab
                                x-small
                                @click.stop="
                                  (dialogDeleteStepTitle = true),
                                    getUpdate(item)
                                "
                              >
                                <v-icon> mdi-delete </v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                          <!-- delete step -->
                          <v-dialog
                            v-model="dialogDeleteStepTitle"
                            max-width="500px"
                          >
                            <v-card>
                              <v-col class="text-center">
                                <!-- <v-img :src="require('@/assets/EditTitleStep.svg')"></v-img> -->
                                <v-icon color="#FD8087" class="mdi-48px">
                                  mdi-minus-circle-outline
                                </v-icon>
                              </v-col>
                              <v-col class="text-center">
                                <h3 class="text-h6">คุณต้องการลบใช่หรือไม่</h3>
                              </v-col>
                              <v-col class="text-center">
                                <v-btn
                                  dark
                                  color="#FD8087"
                                  @click="deleteStepTitle()"
                                  >ลบ</v-btn
                                >
                                <v-btn
                                  dark
                                  color="#1B437C"
                                  @click="dialogDeleteStepTitle = false"
                                  >ยกเลิก</v-btn
                                >
                              </v-col>
                            </v-card>
                          </v-dialog>
                          <!-- END delete step -->
                          <v-col cols="12" class="v-margit_button text-center">
                          <!-- <v-col cols="12" v-if="checkOnsite !== 'True'" class="v-margit_button text-center"> -->
                            <v-btn
                              color="#1B437C"
                              depressed
                              outlined
                              @click="dialogAddStepTitle = true"
                            >
                              <v-icon left>mdi-text-box-plus</v-icon>
                              เพิ่มขั้นตอน
                            </v-btn>
                            <v-btn
                              color="#1B437C"
                              depressed
                              dark
                              @click="editDataStepTitle()"
                            >
                              <v-icon left>mdi-text-box-plus</v-icon>
                              บันทึกข้อมูล
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <br />
                    <p></p>
                  </v-container>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- end  -->

          <!-- add  -->
          <v-dialog v-model="dialogAdd" persistent max-width="50%">
            <v-card>
              <v-form ref="form_add" v-model="validAdd" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="10" class="text-left pt-10">
                      <h3><strong>เพิ่มข้อมูลบริการ</strong></h3>
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
                          @click="(dialogAdd = false), clearData()"
                          >
                          X
                          </v-btn>
                      </div>
                      </v-col>
                  </v-row>
                    <v-row >
                      <v-col cols="12" class="v-margit_text_add mt-1">
                        <v-col cols="12" class="pb-0">
                          <v-select
                            class="pa-0"
                            v-model="formAdd.masBranchID"
                            :items="branch"
                            label="สาขา"
                            outlined
                            required
                            attach
                            :menu-props="{ bottom: true, offsetY: true }"
                            :rules="[rules.required]"
                          ></v-select>
                          <v-text-field
                            v-model="formAdd.flowName"
                            label="ชื่อบริการ (ภาษาไทย)"
                            outlined
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                          <v-text-field
                            v-model="formAdd.flowNameEn"
                            label="ชื่อบริการ (ภาษาอังกฤษ)"
                            outlined
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                          <v-select
                            v-if="categorySub.length > 0"
                            class="pa-0"
                            v-model="formAdd.categorySub"
                            :items="categorySub"
                            label="ประเภทบริการ"
                            outlined
                            required
                            multiple
                            return-object
                            attach
                            chips
                            :menu-props="{ bottom: true, offsetY: true }"
                            :rules="[rules.requiredArray]"
                          ></v-select>
                        </v-col>
                          <v-col cols="12" class="pt-0 pb-0">
                          <v-row v-if="formAdd.timeSlotStatus === 'True'">
                            <v-col class="pb-0">
                              <v-select
                                v-model="formAdd.timeSlot"
                                :items="[{text: '1', value: 1},{text: '2', value: 2},{text: '3', value: 3},{text: '4', value: 4},{text: '5', value: 5},{text: '6', value: 6},{text: '7', value: 7},{text: '8', value: 8},{text: '9', value: 9},{text: '10', value: 10},{text: '11', value: 11},{text: '12', value: 12},{text: '13', value: 13},{text: '14', value: 14},{text: '15', value: 15},{text: '16', value: 16},{text: '17', value: 17},{text: '18', value: 18},{text: '19', value: 19},{text: '20', value: 20}]"
                                label="จำนวน Slot งาน"
                                outlined
                                attach
                                :menu-props="{ bottom: true, offsetY: true }"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row v-if="formAdd.timeSlotStatus === 'True'">
                            <v-col class="pt-0 pb-0" clos='auto'>
                              <v-text-field
                                v-model="formAdd.empTitleTh"
                                label="ชื่อผู้ทำงาน (ภาษาไทย)"
                                outlined
                                required
                                dense
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col class="pt-0 pb-0" clos='auto'>
                              <v-text-field
                                  v-model="formAdd.empTitleEng"
                                  label="ชื่อผู้ทำงาน (ภาษาอังกฤษ)"
                                  outlined
                                  required
                                  dense
                                  :rules="[rules.required]"
                                ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-if="$session.getAll().data.timeSlotStatus !== 'True'">
                            <v-col cols="8" class="pa-0 mt-1" style="display: flex;justify-content: flex-start;align-items: center;">
                              <v-text-field
                                class="px-4"
                                v-model="formAdd.OnsiteEndTime"
                                label="ระบุเวลาการทำงาน (ถ้ามีโปรดระบุ)"
                                outlined
                                type="number"
                                dense
                              ></v-text-field>
                              <p> นาที</p>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col style="display: flex;justify-content: flex-start;">
                            <v-checkbox
                            label="รับเข้าบริการเช็ควันที่ปัจจุบัน"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formAdd.checkDateConfirmJob"
                          ></v-checkbox>
                           </v-col>
                          </v-row>
                          <v-row v-if="$session.getAll().data.timeSlotStatus === 'True'">
                            <v-col style="display: flex;justify-content: flex-start;">
                            <v-checkbox
                            label="ประเภทบริการสำหรับลูกค้าใหม่"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formAdd.newCustomerStatus"
                          ></v-checkbox>
                           </v-col>
                          </v-row>
                          <v-row>
                          <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.storeFrontCheck === 'False'"  >
                            <v-checkbox
                            label="ชำระเงิน"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formAdd.checkDeposit"
                            @change="formAdd.amountDeposit = 0, formAdd.updateStatusConfirm = 'False'"
                          ></v-checkbox>
                          </v-col>
                          <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                            <v-checkbox
                            label="แจ้งยอดค่าชำระ"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            false-value="False"
                            color="#1B437C"
                            true-value="True"
                            v-model="formAdd.checkPayment"
                          ></v-checkbox>
                          </v-col>
                          <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                            <v-checkbox
                            label="ป้องกันการจองซ้ำ / วัน"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formAdd.repeatBooking"
                          ></v-checkbox>
                          </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                              <v-checkbox
                                label="เมื่อนัดหมายเสร็จ สถานะเป็นยืนยัน"
                                false-value="False"
                                :on-icon="'mdi-check-circle'"
                                :off-icon="'mdi-checkbox-blank-circle-outline'"
                                color="#1B437C"
                                true-value="True"
                                v-model="formAdd.updateStatusConfirm"
                              ></v-checkbox>
                            </v-col>
                            <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="$session.getAll().data.timeSlotStatus === 'True'">
                              <v-checkbox
                              label="เปิดรับจองนอกเวลา"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formAdd.overTime"
                              @change="checkStoreFrontAdd()"
                            ></v-checkbox>
                            </v-col>
                            <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="$session.getAll().data.timeSlotStatus === 'True'">
                              <v-checkbox
                              label="จองหลายช่วงเวลา"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formAdd.customerTimeSlot"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="4" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="$session.getAll().data.timeSlotStatus !== 'True'">
                              <v-checkbox
                              label="เปิดรับคิวหน้าร้าน"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formAdd.storeFrontCheck"
                              @change="checkStoreFrontAdd(),formAdd.servicePointTh = '', formAdd.servicePointEn = '',formAdd.servicePointCount = '',servicePointCount = '', formAdd.storeFrontText = '',formAdd.servicePointStatus = 'False',formAdd.storeFrontNotifySet = '0',formAdd.storeFrontNotifyStatus = 'False',formAdd.storeFrontMessageFinish = ''"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="4" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;"  v-if="formAdd.storeFrontCheck === 'True'">
                            <v-text-field
                                v-if="formAdd.storeFrontCheck === 'True'"
                                v-model="formAdd.storeFrontText"
                                label="อักษรหน้าเลขคิว"
                                outlined
                                required
                                dense
                                maxlength="1"
                              ></v-text-field>
                            </v-col >
                            <v-col cols="12" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;"  v-if="formAdd.storeFrontCheck === 'True'">
                              <v-textarea
                                outlined
                                rows="2"
                                v-model="formAdd.storeFrontMessageFinish"
                                label="ข้อความ"
                              ></v-textarea>
                            </v-col >
                            <v-col cols="4" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.storeFrontCheck === 'True'">
                              <v-checkbox
                              label="เปิดจำกัดคิวหน้าร้าน"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formAdd.statusLimitBookingByDate"
                              @change="formAdd.countLimitBookingByDate = 0"
                            ></v-checkbox>
                            </v-col>
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.storeFrontCheck === 'True' && formAdd.statusLimitBookingByDate  === 'True'"  >
                              <v-text-field
                                v-model="formAdd.countLimitBookingByDate"
                                label="จำนวนคิว"
                                outlined
                                required
                                dense
                                v-mask="'####'"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <!-- <v-col cols="4" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.storeFrontCheck === 'True'"></v-col> -->
                            <v-col cols="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.storeFrontCheck === 'True'">
                              <v-checkbox
                              label="เปิดการตั้งค่าจุดบริการ"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formAdd.servicePointStatus"
                              @change="formAdd.servicePointTh = '', formAdd.servicePointEn = '',formAdd.servicePointCount = '',formAdd.servicePointRecursive = ''"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.servicePointStatus === 'True'">
                              <v-checkbox
                              label="เรียกจุดบริการซ้ำ"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formAdd.servicePointRecursive"
                            ></v-checkbox>
                            </v-col>
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.servicePointStatus === 'True'"  >
                              <v-text-field
                                v-model="formAdd.servicePointTh"
                                label="ชื่อจุดบริการ (TH)"
                                outlined
                                required
                                dense
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.servicePointStatus === 'True'"  >
                              <v-text-field
                                v-model="formAdd.servicePointEn"
                                label="ชื่อจุดบริการ (EN)"
                                outlined
                                required
                                dense
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.servicePointStatus === 'True'"  >
                              <v-text-field
                                v-model="formAdd.servicePointCountStart"
                                label="จำนวนจุดบริการเริ่ม"
                                outlined
                                required
                                dense
                                v-mask="'###'"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.servicePointStatus === 'True'"  >
                              <v-text-field
                                v-model="formAdd.servicePointCountEnd"
                                label="จำนวนจุดบริการสิ้นสุด"
                                outlined
                                required
                                dense
                                v-mask="'###'"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-if="formAdd.storeFrontCheck === 'True'">
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                              <v-checkbox
                                label="เปิดรับการแจ้งเตือนล่วงหน้า"
                                false-value="False"
                                :on-icon="'mdi-check-circle'"
                                :off-icon="'mdi-checkbox-blank-circle-outline'"
                                color="#1B437C"
                                true-value="True"
                                v-model="formAdd.storeFrontNotifyStatus"
                                @change="formAdd.storeFrontNotifySet = '0'"
                              ></v-checkbox>
                            </v-col>
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formAdd.storeFrontNotifyStatus === 'True'"  >
                              <v-text-field
                                v-model="formAdd.storeFrontNotifySet"
                                label="แจ้งเตือนจำนวนคิวก่อนหน้า"
                                outlined
                                required
                                dense
                                v-mask="'##'"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-if="$session.getAll().data.timeSlotStatus !== 'True'">
                            <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                              <v-checkbox
                                label="Onsite (เมื่อเปิดรายการนี้ หน้านัดหมายจะมีการเก็บที่อยู่ลูกค้า)"
                                false-value="False"
                                :on-icon="'mdi-check-circle'"
                                :off-icon="'mdi-checkbox-blank-circle-outline'"
                                color="#1B437C"
                                true-value="True"
                                v-model="formAdd.checkOnsite"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="$session.getAll().data.timeSlotStatus === 'True'">
                              <v-checkbox
                              label="เปิดใช้งานแผนที่"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formAdd.checkOnsiteEmp"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="12" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                              <v-checkbox
                              label="นัดหมายล่วงหน้า"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formAdd.bookingNowCheck"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="8" class="pt-0 pb-0 ml-3" style="display: flex;justify-content: flex-start;" v-if="formAdd.bookingNowCheck === 'True'">
                          <v-select
                              dense
                              class="ma-3"
                              :items="bookingNowCheckCount"
                              v-model="formAdd.bookingNowCheckCount"
                              label="จำนวนวัน"
                              outlined
                              :rules="[rules.required]"
                              attach
                              :menu-props="{ bottom: true, offsetY: true }"
                            ></v-select>
                            <v-checkbox
                            label="อ้างอิง จากเวลาที่ลูกค้านัดหมาย"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formAdd.bookingNowCheckTimeStatus"
                          ></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col
                          cols="12" class="pb-0"
                        >
                          <v-textarea
                          v-if="formAdd.checkDeposit === 'True'"
                            outlined
                            rows="1"
                            v-model="formAdd.depositTextTH"
                            label="ข้อความสำหรับหัวข้อการโอนเงิน (TH)"
                          ></v-textarea>
                        </v-col>
                        <v-col
                          cols="12"  class="pb-0"
                        >
                          <v-textarea
                          v-if="formAdd.checkDeposit === 'True'"
                            outlined
                            rows="1"
                            v-model="formAdd.depositTextEN"
                            label="ข้อความสำหรับหัวข้อการโอนเงิน (EN)"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" class="pb-0 pt-0">
                          <v-select
                            v-if="formAdd.checkDeposit === 'True'"
                            v-model="formAdd.depositTime"
                            :items="depositTimeItem"
                            label="ชำระเงินภายในกี่นาที"
                            outlined
                            dense
                            attach
                            :menu-props="{ bottom: true, offsetY: true }"
                          ></v-select>
                          <v-col style="display: flex;justify-content: flex-start;" v-if="formAdd.checkDeposit === 'True'">
                            <v-checkbox
                            label="บัตรเครดิต/อื่นๆ"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formAdd.checkCreditCard"
                          ></v-checkbox>
                          <v-checkbox
                          class="ml-2"
                            label="คูปอง"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formAdd.checkCoupon"
                          ></v-checkbox>
                          </v-col>
                          <v-text-field
                          v-if="formAdd.checkDeposit === 'True'"
                            v-model="formAdd.promptPayName"
                            label="ชื่อบัญชีพร้อมเพย์"
                            outlined
                            dense
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                          <v-text-field
                          v-if="formAdd.checkDeposit === 'True'"
                            v-model="formAdd.promptPayID"
                            label="หมายเลขพร้อมเพย์"
                            outlined
                            dense
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                          <VuetifyMoney
                            v-if="formAdd.checkDeposit === 'True'"
                            label="จำนวนเงิน"
                            v-model="formAdd.amountDeposit"
                            required
                            :rules="[rules.required]"
                            outlined
                            dense
                            v-bind:options="optionsDeposit" />
                            <v-text-field
                            v-if="formAdd.checkDeposit === 'True'"
                            label="เงินมัดจำคิดเป็นกี่เปอร์เซ็น (กรณีที่ต้องการแจ้งยอดชำระคงเหลือ)"
                            v-model="formAdd.depositPercent"
                            required
                            :rules="depositPercentrules"
                            outlined
                            suffix="%"
                            dense
                            v-bind:options="optionsPercent" />
                        </v-col>
                        <v-col
                          cols="12"
                        >
                          <v-textarea
                            outlined
                            v-model="formAdd.remarkConfirm"
                            label="หมายเหตุการยืนยันนัดหมาย (TH)"
                          ></v-textarea>
                        </v-col>
                        <v-col
                          cols="12"
                        >
                          <v-textarea
                            outlined
                            v-model="formAdd.remarkConfirmEn"
                            label="หมายเหตุการยืนยันนัดหมาย (EN)"
                          ></v-textarea>
                        </v-col>
                        <br />
                        <div class="text-center">
                          <v-btn
                            dark
                            elevation="2"
                            large
                            block
                            color="#173053"
                            :disabled="!validAdd"
                            @click="addData()"
                          >
                            <v-icon left>mdi-checkbox-marked-circle</v-icon>
                            บันทึกข้อมูล
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- end add -->

          <!-- edit -->
          <v-dialog v-model="dialogEdit" persistent max-width="50%">
            <v-card>
              <v-form ref="form_update" v-model="validUpdate" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="10" class="text-left pt-10">
                      <h3><strong>แก้ไขข้อมูล</strong></h3>
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
                    <v-row>
                      <v-col cols="12" class="v-margit_text_add mt-1">
                        <v-col cols="12" class="pb-0">
                          <v-select
                            class="pa-0"
                            v-model="formUpdate.masBranchID"
                            :items="branch"
                            label="สาขา"
                            outlined
                            required
                            attach
                            :menu-props="{ bottom: true, offsetY: true }"
                            :rules="[rules.required]"
                          ></v-select>
                          <v-text-field
                            class="pa-0"
                            v-model="formUpdate.flowName"
                            label="ชื่อขั้นตอน (ภาษาไทย)"
                            outlined
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                          <v-text-field
                            class="pa-0"
                            v-model="formUpdate.flowNameEn"
                            label="ชื่อขั้นตอน (ภาษาอังกฤษ)"
                            outlined
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                          <v-select
                            v-if="categorySub.length > 0"
                            class="pa-0"
                            v-model="formUpdate.categorySub"
                            :items="categorySub"
                            label="ประเภทบริการ"
                            outlined
                            required
                            multiple
                            return-object
                            attach
                            chips
                            :menu-props="{ bottom: true, offsetY: true }"
                            :rules="[rules.requiredArray]"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" class="pt-0 pb-0" >
                          <v-row v-if="formUpdate.timeSlotStatus === 'True' ">
                            <v-col class="pb-0">
                              <v-select
                                v-model="formUpdate.timeSlot"
                                :items="[{text: '1', value: 1},{text: '2', value: 2},{text: '3', value: 3},{text: '4', value: 4},{text: '5', value: 5},{text: '6', value: 6},{text: '7', value: 7},{text: '8', value: 8},{text: '9', value: 9},{text: '10', value: 10},{text: '11', value: 11},{text: '12', value: 12},{text: '13', value: 13},{text: '14', value: 14},{text: '15', value: 15},{text: '16', value: 16},{text: '17', value: 17},{text: '18', value: 18},{text: '19', value: 19},{text: '20', value: 20}]"
                                label="จำนวน Slot งาน"
                                outlined
                                attach
                                :menu-props="{ bottom: true, offsetY: true }"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row v-if="formUpdate.timeSlotStatus === 'True'">
                            <v-col class="pt-0 pb-0" clos='auto'>
                              <v-text-field
                                v-model="formUpdate.empTitleTh"
                                label="ชื่อผู้ทำงาน (ภาษาไทย)"
                                outlined
                                required
                                dense
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col class="pt-0 pb-0" clos='auto'>
                              <v-text-field
                                  v-model="formUpdate.empTitleEng"
                                  label="ชื่อผู้ทำงาน (ภาษาอังกฤษ)"
                                  outlined
                                  required
                                  dense
                                  :rules="[rules.required]"
                                ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-if="$session.getAll().data.timeSlotStatus !== 'True'">
                            <v-col cols="8" class="pa-0 mt-1" style="display: flex;justify-content: flex-start;align-items: center;">
                              <v-text-field
                                class="px-4"
                                v-model="formUpdate.OnsiteEndTime"
                                label="ระบุเวลาการทำงาน (ถ้ามีโปรดระบุ)"
                                outlined
                                type="number"
                                dense
                              ></v-text-field>
                              <p> นาที</p>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col style="display: flex;justify-content: flex-start;">
                            <v-checkbox
                            label="รับเข้าบริการเช็ควันที่ปัจจุบัน"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formUpdate.checkDateConfirmJob"
                          ></v-checkbox>
                           </v-col>
                          </v-row>
                          <v-row v-if="$session.getAll().data.timeSlotStatus === 'True'">
                            <v-col style="display: flex;justify-content: flex-start;">
                            <v-checkbox
                            label="ประเภทบริการสำหรับลูกค้าใหม่"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formUpdate.newCustomerStatus"
                          ></v-checkbox>
                           </v-col>
                          </v-row>
                          <v-row>
                          <v-col style="display: flex;justify-content: flex-start;" v-if="formUpdate.storeFrontCheck === 'False'">
                            <v-checkbox
                            label="ชำระเงิน"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formUpdate.checkDeposit"
                            @change="formUpdate.amountDeposit = 0, formUpdate.updateStatusConfirm = 'False',formUpdate.checkCreditCard = 'False'"
                          ></v-checkbox>
                          </v-col>
                           <v-col style="display: flex;justify-content: flex-start;">
                            <v-checkbox
                            label="แจ้งยอดค่าชำระ"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            false-value="False"
                            color="#1B437C"
                            true-value="True"
                            v-model="formUpdate.checkPayment"
                          ></v-checkbox>
                          </v-col>
                          <v-col style="display: flex;justify-content: flex-start;">
                            <v-checkbox
                            label="ป้องกันการจองซ้ำ / วัน"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formUpdate.repeatBooking"
                          ></v-checkbox>
                          </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;"  >
                              <v-checkbox
                                label="เมื่อนัดหมายเสร็จ สถานะเป็นยืนยัน"
                                false-value="False"
                                :on-icon="'mdi-check-circle'"
                                :off-icon="'mdi-checkbox-blank-circle-outline'"
                                color="#1B437C"
                                true-value="True"
                                v-model="formUpdate.updateStatusConfirm"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="$session.getAll().data.timeSlotStatus === 'True'">
                              <v-checkbox
                              label="เปิดรับจองนอกเวลา"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formUpdate.overTime"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="$session.getAll().data.timeSlotStatus === 'True'">
                              <v-checkbox
                              label="จองหลายช่วงเวลา"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formUpdate.customerTimeSlot"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="4" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;"  v-if="$session.getAll().data.timeSlotStatus !== 'True'">
                              <v-checkbox
                              label="เปิดรับคิวหน้าร้าน"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formUpdate.storeFrontCheck"
                              @change="checkStoreFrontUpdate(),formUpdate.servicePointTh = '', formUpdate.servicePointEn = '',servicePointCount = '',formUpdate.servicePointCount = '', formUpdate.storeFrontText = '',formUpdate.servicePointStatus = 'False',formUpdate.storeFrontNotifyStatus === 'False',formUpdate.storeFrontNotifySet === '0',formUpdate.storeFrontMessageFinish = ''"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="4" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;"  v-if="formUpdate.storeFrontCheck === 'True'">
                            <v-text-field
                                v-model="formUpdate.storeFrontText"
                                label="อักษรหน้าเลขคิว"
                                outlined
                                required
                                dense
                                maxlength="1"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;"  v-if="formUpdate.storeFrontCheck === 'True'">
                              <v-textarea
                                outlined
                                rows="2"
                                v-model="formUpdate.storeFrontMessageFinish"
                                label="ข้อความ"
                              ></v-textarea>
                            </v-col >
                            <v-col cols="4" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.storeFrontCheck === 'True'">
                              <v-checkbox
                              label="เปิดจำกัดคิวหน้าร้าน"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formUpdate.statusLimitBookingByDate"
                              @change="formUpdate.countLimitBookingByDate = 0"
                            ></v-checkbox>
                            </v-col>
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.storeFrontCheck === 'True' && formUpdate.statusLimitBookingByDate  === 'True'"  >
                              <v-text-field
                                v-model="formUpdate.countLimitBookingByDate"
                                label="จำนวนคิว"
                                outlined
                                required
                                dense
                                v-mask="'####'"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="4" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.storeFrontCheck === 'True'"></v-col>
                            <v-col cols="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.storeFrontCheck === 'True'">
                              <v-checkbox
                              label="เปิดการตั้งค่าจุดบริการ"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formUpdate.servicePointStatus"
                              @change="formUpdate.servicePointTh = '', formUpdate.servicePointEn = '',formUpdate.servicePointCount = '',formUpdate.servicePointRecursive = ''"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.servicePointStatus === 'True'">
                              <v-checkbox
                              label="เรียกจุดบริการซ้ำ"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formUpdate.servicePointRecursive"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols='4' class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.servicePointStatus === 'True'"  >
                              <v-text-field
                                v-model="formUpdate.servicePointTh"
                                label="ชื่อจุดบริการ (TH)"
                                outlined
                                required
                                dense
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col cols='4' class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.servicePointStatus === 'True'"  >
                              <v-text-field
                                v-model="formUpdate.servicePointEn"
                                label="ชื่อจุดบริการ (EN)"
                                outlined
                                required
                                dense
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.servicePointStatus === 'True'"  >
                              <v-text-field
                                v-model="formUpdate.servicePointCountStart"
                                label="จำนวนจุดบริการเริ่ม"
                                outlined
                                required
                                dense
                                v-mask="'###'"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.servicePointStatus === 'True'"  >
                              <v-text-field
                                v-model="formUpdate.servicePointCountEnd"
                                label="จำนวนจุดบริการสิ้นสุด"
                                outlined
                                required
                                dense
                                v-mask="'###'"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                            <!-- <v-col cols='4' class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.servicePointStatus === 'True'"  >
                              <v-text-field
                                v-model="servicePointCount"
                                label="จำนวนจุดบริการ"
                                outlined
                                required
                                dense
                                v-mask="'###'"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col> -->
                          </v-row>
                          <v-row v-if="formUpdate.storeFrontCheck === 'True'">
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                              <v-checkbox
                                label="เปิดรับการแจ้งเตือนล่วงหน้า"
                                false-value="False"
                                :on-icon="'mdi-check-circle'"
                                :off-icon="'mdi-checkbox-blank-circle-outline'"
                                color="#1B437C"
                                true-value="True"
                                v-model="formUpdate.storeFrontNotifyStatus"
                                @change="formUpdate.storeFrontNotifySet = '0'"
                              ></v-checkbox>
                            </v-col>
                            <v-col clos="6" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="formUpdate.storeFrontNotifyStatus === 'True'"  >
                              <v-text-field
                                v-model="formUpdate.storeFrontNotifySet"
                                label="แจ้งเตือนจำนวนคิวก่อนหน้า"
                                outlined
                                required
                                dense
                                v-mask="'##'"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-if="$session.getAll().data.timeSlotStatus !== 'True'">
                            <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                              <v-checkbox
                                label="Onsite (เมื่อเปิดรายการนี้ หน้านัดหมายจะมีการเก็บที่อยู่ลูกค้า)"
                                false-value="False"
                                :on-icon="'mdi-check-circle'"
                                :off-icon="'mdi-checkbox-blank-circle-outline'"
                                color="#1B437C"
                                true-value="True"
                                v-model="formUpdate.checkOnsite"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="pt-0 pb-0" style="display: flex;justify-content: flex-start;" v-if="$session.getAll().data.timeSlotStatus === 'True'">
                              <v-checkbox
                              label="เปิดใช้งานแผนที่"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formUpdate.checkOnsiteEmp"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="12" class="pt-0 pb-0" style="display: flex;justify-content: flex-start;">
                              <v-checkbox
                              label="นัดหมายล่วงหน้า"
                              false-value="False"
                              :on-icon="'mdi-check-circle'"
                              :off-icon="'mdi-checkbox-blank-circle-outline'"
                              color="#1B437C"
                              true-value="True"
                              v-model="formUpdate.bookingNowCheck"
                            ></v-checkbox>
                            </v-col>
                            <v-col cols="8" class="pt-0 pb-0 ml-3" style="display: flex;justify-content: flex-start;" v-if="formUpdate.bookingNowCheck === 'True'">
                          <v-select
                              dense
                              class="ma-3"
                              :items="bookingNowCheckCount"
                              v-model="formUpdate.bookingNowCheckCount"
                              label="จำนวนวัน"
                              outlined
                              :rules="[rules.required]"
                              attach
                              :menu-props="{ bottom: true, offsetY: true }"
                            ></v-select>
                            <v-checkbox
                            label="อ้างอิง จากเวลาที่ลูกค้านัดหมาย"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formUpdate.bookingNowCheckTimeStatus"
                          ></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col
                          cols="12" class="pb-0"
                        >
                          <v-textarea
                          v-if="formUpdate.checkDeposit === 'True'"
                            outlined
                            rows="1"
                            v-model="formUpdate.depositTextTH"
                            label="ข้อความสำหรับหัวข้อการโอนเงิน (TH)"
                          ></v-textarea>
                        </v-col>
                        <v-col
                          cols="12" class="pb-0"
                        >
                          <v-textarea
                          v-if="formUpdate.checkDeposit === 'True'"
                            outlined
                            rows="1"
                            v-model="formUpdate.depositTextEN"
                            label="ข้อความสำหรับหัวข้อการโอนเงิน (EN)"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" class="pb-0 pt-0">
                          <v-select
                            v-if="formUpdate.checkDeposit === 'True'"
                            v-model="formUpdate.depositTime"
                            :items="depositTimeItem"
                            label="ชำระเงินภายในกี่นาที"
                            outlined
                            dense
                            attach
                            :menu-props="{ bottom: true, offsetY: true }"
                          ></v-select>
                          <v-col style="display: flex;justify-content: flex-start;" v-if="formUpdate.checkDeposit === 'True'">
                            <v-checkbox
                            label="บัตรเครดิต/อื่นๆ"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formUpdate.checkCreditCard"
                          ></v-checkbox>
                          <v-checkbox
                            class="ml-2"
                            label="คูปอง"
                            false-value="False"
                            :on-icon="'mdi-check-circle'"
                            :off-icon="'mdi-checkbox-blank-circle-outline'"
                            color="#1B437C"
                            true-value="True"
                            v-model="formUpdate.checkCoupon"
                          ></v-checkbox>
                          </v-col>
                          <v-text-field
                          v-if="formUpdate.checkDeposit === 'True'"
                            v-model="formUpdate.promptPayName"
                            label="ชื่อบัญชีพร้อมเพย์"
                            outlined
                            dense
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                          <v-text-field
                          v-if="formUpdate.checkDeposit === 'True'"
                            v-model="formUpdate.promptPayID"
                            label="หมายเลขพร้อมเพย์"
                            outlined
                            dense
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                          <VuetifyMoney
                            v-if="formUpdate.checkDeposit === 'True'"
                            label="จำนวนเงิน"
                            v-model="formUpdate.amountDeposit"
                            required
                            :rules="[rules.required]"
                            outlined
                            dense
                            v-bind:options="optionsDeposit" />
                            <v-text-field
                            v-if="formUpdate.checkDeposit === 'True'"
                            label="เงินมัดจำคิดเป็นกี่ % (กรณีที่ต้องการแจ้งยอดชำระคงเหลือ)"
                            v-model="formUpdate.depositPercent"
                            required
                            v-mask="'###'"
                            :rules="depositPercentrules"
                            suffix="%"
                            outlined
                            dense
                            v-bind:options="optionsPercent" />
                            <p v-if="formUpdate.menuShowStatus === 'True' && formUpdate.depositPercent > 0" style="color:red;" class="mt-n4">{{ `* หมายเหตุ ราคา Menu จะถูกคิดเป็น ${formUpdate.depositPercent} % ของราคาเต็ม`  }}</p>
                        </v-col>
                        <v-col
                          cols="12"
                        >
                          <v-textarea
                            outlined
                            v-model="formUpdate.remarkConfirm"
                            label="หมายเหตุการยืนยันนัดหมาย (TH)"
                          ></v-textarea>
                        </v-col>
                        <v-col
                          cols="12"
                        >
                          <v-textarea
                            outlined
                            v-model="formUpdate.remarkConfirmEn"
                            label="หมายเหตุการยืนยันนัดหมาย (EN)"
                          ></v-textarea>
                        </v-col>
                        <!-- สำหรับ ธุรกิจรถยนต์ -->
                        <v-expansion-panels>
                          <v-expansion-panel>
                            <v-expansion-panel-header>
                              เพิ่มช่องกรอกข้อมูล
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <v-col cols="12">
                              <v-row style="height: 50px">
                                <v-btn
                                  color="primary"
                                  dark
                                  x-small
                                  @click="
                                    (dialogEditField = true),
                                      (editedItem2.fieldName = ''),
                                      (editedItem2.fieldId = '')
                                  "
                                  class="mb-2"
                                >
                                  เพิ่ม ช่องกรอกข้อมูล
                                </v-btn>
                              </v-row>
                              <v-row>
                                <v-data-table
                                  dense
                                  :headers="headers"
                                  :items="desserts"
                                  hide-default-footer
                                  class="elevation-1 custom_table_class"
                                >
                                  <template v-slot:[`item.actions`]="{ item }">
                                    <v-icon
                                      small
                                      color="#7F87A7"
                                      @click="deleteItem(item)"
                                    >
                                      mdi-delete
                                    </v-icon>
                                  </template>
                                  <template v-slot:[`item.showCard`]="{ item }">
                                    <v-checkbox
                                      false-value="False"
                                      true-value="True"
                                      v-model="item.showCard"
                                    ></v-checkbox>
                                  </template>
                                </v-data-table>
                                <v-dialog
                                  v-model="dialogEditField"
                                  max-width="500px"
                                >
                                  <v-card>
                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12">
                                            <center>
                                              <v-col>
                                                <v-img
                                                  id="v-img-fieldName"
                                                  :src="
                                                    require('@/assets/maintenance.png')
                                                  "
                                                ></v-img>
                                              </v-col>
                                            </center>
                                            <v-row style="height: 35px">
                                              <v-subheader id="subtext"
                                                >ช่องกรอกข้อมูล</v-subheader
                                              >
                                            </v-row>
                                            <v-row style="height: 50px">
                                              <v-select
                                                v-model="editedItem2.fieldName"
                                                :items="editedItemSelete"
                                                item-text="text"
                                                dense
                                                return-object
                                                attach
            :menu-props="{ bottom: true, offsetY: true }"
                                              ></v-select>
                                            </v-row>
                                          </v-col>
                                        </v-row>
                                      </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        color="#173053"
                                        dark
                                        @click="dialogEditField = false"
                                      >
                                        ยกเลิก
                                      </v-btn>
                                      <v-btn
                                        color="#173053"
                                        dark
                                        @click="save(editedItem2)"
                                      >
                                        บันทึกข้อมูล
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-row>
                            </v-col>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                        <v-col id="margin">
                          <v-row>
                            <v-btn
                              dark
                              elevation="2"
                              large
                              block
                              color="#173053"
                              :disabled="!validUpdate"
                              @click="editData()"
                            >
                              <v-icon left>mdi-checkbox-marked-circle</v-icon>
                              บันทึกข้อมูล
                            </v-btn>
                          </v-row>
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- end  -->

          <!-- delete -->
          <v-dialog v-model="dialogDelete" max-width="45%">
            <v-card>
              <v-card-text class="pa-0 px-4">
                <v-container>
                  <v-row>
                      <v-col cols="10" class="text-left pt-10">
                      <h3><strong>ลบรายการนี้</strong></h3>
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
                      <v-row >
                        <v-text-field
                          dense
                          outlined
                          label="ชื่อประเภทบริการ"
                          v-model="formUpdate.flowName"
                          readonly
                        ></v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-col class="text-center">
                <v-btn
                  dark
                  elevation="2"
                  block
                  large
                  color="#173053"
                  @click="deleteData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  ลบ
                </v-btn>
              </v-col>
            </v-card>
          </v-dialog>
          <!-- end delete -->

          <!-- set condition -->
          <v-dialog v-model="dialogCondition" max-width="60%" persistent>
            <v-card>
              <v-card-text v-if="dataConditionReady">
                <v-container>
                  <v-row>
                      <v-col cols="10" class="text-left pt-10">
                      <h3><strong>เงื่อนไขการให้บริการ</strong></h3>
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
                          @click="dialogCondition = false, clearCondition()"
                          >
                          X
                          </v-btn>
                      </div>
                      </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" class="pb-0">
                      <v-row>
                      <v-select
                        v-model="dataCountCondition"
                        :items="itemCountCondition"
                        label="เลือกจำนวนเงื่อนไข"
                        outlined
                        dense
                        @change="fixCountCondition()"
                        attach
            :menu-props="{ bottom: true, offsetY: true }"
                      ></v-select>
                      </v-row>
                    </v-col>
                    <v-col cols="6" class="pb-0">
                      <v-row>
                      <v-checkbox
                        false-value="ไม่แสดง"
                        true-value="แสดง"
                        v-model="showCondition"
                        hide-details
                        class="shrink ml-6 mr-0 mt-0 mb-6"
                      ></v-checkbox>
                      <v-text-field v-model="showCondition" dense outlined readonly label="แสดงเงื่อนไข หรือไม่"></v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-form ref="form_condition" v-model="validCondition" lazy-validation>
                  <v-row>
                    <v-col cols="12" class="pb-0" v-if="dataCondition.length > 0">
                      <div v-for="(item, index) in dataCondition" :key="index">
                       <v-card>
                          <v-container>
                            <v-card-text>
                              <v-row>
                                <v-col cols="12" class="pb-0">
                                  <v-img
                                    v-if="item.image !== ''"
                                    aspect-ratio="6"
                                    contain
                                    :src="item.image"
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
                                    label="รูปภาพ"
                                    v-model="item.files"
                                    @change="selectImg(item)"
                                  ></v-file-input>
                                </v-col>
                                <v-col cols="12" class="pb-0">
                                  <v-textarea
                                    v-model="item.text"
                                    auto-grow
                                    row="1"
                                    label="รายละเอียด"
                                    outlined
                                    dense
                                    :rules="[rules.required]"
                                  ></v-textarea>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-container>
                       </v-card>
                       <br>
                       </div>
                    </v-col>
                  </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-col class="text-center" v-if="dataConditionReady">
                <v-spacer></v-spacer>
                <v-btn
                  class="text-white"
                  elevation="2"
                  block
                  large
                  :disabled="!validCondition"
                  color="#1B437C"
                  @click="addDataCondition()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  บันทึกข้อมูล
                </v-btn>
              </v-col>
              <v-card-text v-if="!dataConditionReady">
                <div class="text-center">
                  <waitingAlert></waitingAlert>
                  </div>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- end condition -->

        <!-- dialog limitbookint -->
        <v-dialog v-model="dialoglimitbooking" persistent >
          <v-card  min-height="500px" class="pa-1 " color="#F4F4F4">
              <v-card-text class="pa-2">
                <v-container>
                  <v-row>
                      <v-col cols="10" class="text-left pt-10">
                      <h3><strong>ตั้งค่าวันหยุด / ตั้งจัดการเวลา</strong></h3>
                      </v-col>
                      <v-col cols="2" class="pt-10 pa-0">
                      <div style="text-align: end;">
                          <v-btn
                          class="mx-2"
                          fab
                          small
                          dark
                          color="white"
                          :style="styleCloseBt"
                          @click="dialoglimitbooking = false, clearLimit()"
                          >
                          X
                          </v-btn>
                      </div>
                      </v-col>
                  </v-row>
                  <v-form
                     ref="form_update"
                    v-model="valid_update"
                    lazy-validation
                  >
                  <v-row style="justify-content: space-between;">
                  <v-col style="min-width: 270px;max-width: 400px;">
                    <v-row>
                      <v-col cols="12">
                        <v-card class="pa-3">
                          <!-- <strong class="font-weight-bold">วันหยุดทั่วไปของบริษัท</strong> -->
                          <h4 class="font-weight-bold">วันหยุดทั่วไปของบริษัท</h4>
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
                              <h4 class="font-weight-bold mt-n2 ml-n2">วันหยุดประจำปีของบริษัท</h4>
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
                    <!-- <v-divider
                    class="mx-4"
                      vertical
                    ></v-divider> -->
                    <v-col style="min-width: 300px;">
                      <v-card class="pa-3 mb-5" min-height="675px">
                        <h4 class="font-weight-bold mt-2">จัดการเวลานัดหมาย</h4>
                          <v-row align="center" class="ma-0">
                              <v-checkbox
                                @click="chekshowTime()"
                                false-value="False"
                                true-value="True"
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
                                @click="chekshowTime()"
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
                            <v-row class="pl-8 mb-3" v-if="formUpdateLimitbooking.setTimebyday === 'True'">
                                <v-btn-toggle
                                  v-model="toggle_setTimebyday"
                                  mandatory
                                  style="display: flex;flex-wrap: wrap;"
                                >
                                <div v-for="(item, i) in setTimebyday" :key="i">
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
                          <v-row class="mt-3" >
                            <v-col cols="12" style="display:flex;justify-content: space-between;flex-wrap: wrap;"  class="pt-0" >
                                <v-btn
                                    small
                                    class="mb-2"
                                    color="teal"
                                    dark
                                    @click="presetTime()"
                                  >
                                  <v-icon class="mr-2" small dark> mdi-clock-time-eight</v-icon>เพิ่มเวลาอัตโนมัติ
                                  </v-btn>
                                <v-btn
                                  small
                                  color="#173053"
                                  dark
                                  @click="addNewNew">
                                  <v-icon class="mr-2" small dark>mdi-plus-box</v-icon>เพิ่มเวลานัดหมาย
                                </v-btn>
                          </v-col>
                          <v-col cols="12" class="mb-0"  style="text-align: center;">
                          <v-data-table
                          disable-pagination
                          hide-default-footer
                          :headers="columnsAddTime"
                          :items="dataItemAddTime"
                          :search="search"
                          disable-sort
                          class="elevation-1"
                          min-height="300px">
                          <!-- <template v-slot:top>
                            <v-toolbar color="white"> -->
                              <!-- <div class="text-left">
                              <v-btn
                                  color="teal"
                                  elevation="2"
                                  rounded
                                  small
                                  dark
                                  @click="presetTime()"
                                >
                                  แบบร่าง เวลา
                                </v-btn>
                              </div>
                              <div class="text-right">

                                <v-btn
                                  small
                                  color="primary"
                                  class="ml-2 white--text"
                                  @click="addNewNew">
                                  <v-icon dark>mdi-plus</v-icon>เพิ่มเวลานัดหมาย
                                </v-btn>
                              </div> -->
                            <!-- </v-toolbar>
                          </template> -->
                          <template v-slot:[`item.text`]="{ item }">
                            <v-text-field class="pa-0 ma-0" filled v-model="editedItemNew.text" :counter="50" maxlength="50" :hide-details="true" dense single-line :autofocus="true" v-if="item.id === editedItemNew.id"></v-text-field>
                            <span v-else>{{item.text}}</span>
                          </template>
                          <template v-slot:[`item.value`]="{ item }">
                            <v-text-field class="pa-0 ma-0" placeholder="HH:mm" filled v-model="editedItemNew.value" v-mask="'##:##'" :hide-details="true" dense single-line v-if="item.id === editedItemNew.id" ></v-text-field>
                            <span v-else>{{item.value}}</span>
                          </template>
                          <template v-slot:[`item.limitBooking`]="{ item }">
                            <div v-if="item.id === editedItemNew.id" >
                              <v-text-field class="pa-0 ma-0" filled v-model="editedItemNew.limitBooking" :hide-details="true" dense single-line v-if="formUpdateLimitbooking.limitBookingCheck === 'True'" ></v-text-field>
                              <!-- <v-text-field class="pa-0 ma-0" filled v-model="editedItemNew.limitBooking" :hide-details="true" disabled dense single-line v-else></v-text-field> -->
                            </div>
                            <div v-else>
                              <span v-if="formUpdateLimitbooking.limitBookingCheck === 'True'">{{item.limitBooking}}</span>
                              <span v-else>{{''}}</span>
                            </div>
                          </template>
                          <template v-slot:[`item.actions2`]="{ item }">
                            <div class="pa-0 ma-0" v-if="item.id === editedItemNew.id">
                              <v-icon color="red" class="mr-3" @click="closeNew">
                                mdi-window-close
                              </v-icon>
                              <v-icon color="green"  @click="saveNew">
                                mdi-content-save
                              </v-icon>
                            </div>
                            <div v-else>
                              <v-icon color="green" class="mr-3" @click="editItemNew(item)">
                                mdi-pencil
                              </v-icon>
                              <v-icon color="red" @click="deleteItemNew(item)">
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
                                    Template ( อา. - ส.)
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
                            <v-col cols="6"  class="pt-0" style="text-align: start;">
                            <v-btn
                            small
                            class="mb-n3"
                                color="teal"
                                dark
                                @click="presetTimebyday()"
                              >
                                <v-icon class="mr-2" small dark> mdi-clock-time-eight</v-icon>เพิ่มเวลาอัตโนมัติ
                              </v-btn>
                          </v-col>
                          <v-col cols="6" class="pt-0" style="text-align: end;">
                            <v-btn
                            small
                            class="mb-n3"
                              style="text-align: end;"
                                color="#173053"
                                dark
                                @click="addNewNewbyday">
                                <v-icon class="mr-2" small dark>mdi-plus-box</v-icon>เพิ่มเวลานัดหมาย
                              </v-btn>
                          </v-col>
                          <v-col cols="12" class="mb-0"  style="text-align: center;">
                          <v-data-table
                          disable-pagination
                          hide-default-footer
                          :headers="columnsAddTime"
                          :items="dataItemAddTimebyday.filter((i) => i.value === toggle_setTimebyday)[0].setTime"
                          :search="search"
                          disable-sort
                          class="elevation-1"
                          min-height="300px">
                          <template v-slot:[`item.text`]="{ item }">
                            <v-text-field class="pa-0 ma-0" filled v-model="editedItemNew.text" :counter="50" maxlength="50" :hide-details="true" dense single-line :autofocus="true" v-if="item.id === editedItemNew.id"></v-text-field>
                            <span v-else>{{item.text}}</span>
                          </template>
                          <template v-slot:[`item.value`]="{ item }">
                            <v-text-field class="pa-0 ma-0" placeholder="HH:mm" filled v-model="editedItemNew.value" v-mask="'##:##'" :hide-details="true" dense single-line v-if="item.id === editedItemNew.id" ></v-text-field>
                            <span v-else>{{item.value}}</span>
                          </template>
                          <template v-slot:[`item.limitBooking`]="{ item }">
                            <div v-if="item.id === editedItemNew.id" >
                              <v-text-field class="pa-0 ma-0" filled v-model="editedItemNew.limitBooking" :hide-details="true" dense single-line v-if="formUpdateLimitbooking.limitBookingCheck === 'True'" ></v-text-field>
                              <v-text-field class="pa-0 ma-0" filled v-model="editedItemNew.limitBooking" :hide-details="true" disabled dense single-line v-else></v-text-field>
                            </div>
                            <span v-else>{{item.limitBooking}}</span>
                          </template>
                          <template v-slot:[`item.actions2`]="{ item }">
                            <div class="pa-0 ma-0" v-if="item.id === editedItemNew.id">
                              <v-icon color="red" class="mr-3" @click="closeNewbyday">
                                mdi-window-close
                              </v-icon>
                              <v-icon color="green"  @click="saveNewbyday">
                                mdi-content-save
                              </v-icon>
                            </div>
                            <div v-else>
                              <v-icon color="green" class="mr-3" @click="editItemNewbyday(item)">
                                mdi-pencil
                              </v-icon>
                              <v-icon color="red" @click="deleteItemNewbyday(item)">
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
            <v-row style="display: flex;justify-content: flex-start;">
              <v-col cols="12" style="max-width: 500px;">
                <v-select
                v-model="selectBranch"
                :items="branch"
                label="เลือกสาขา"
                outlined
                elevation="3"
                @change="filterBranch()"
                ></v-select>
              </v-col>
            </v-row>

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
                  :items="dataItemsearch"
                  :search="searchAll2"
                  disable-pagination
                  hide-default-footer
                >
                <template v-slot:[`item.masBranchID`]="{ item }">
                    {{ branch.filter((i) => i.value === item.masBranchID).length > 0 ? branch.filter((i) => i.value === item.masBranchID)[0].text : 'ทั้งหมด' }}
                  </template>
                  <template v-slot:[`item.CREATE_DATE`]="{ item }">
                    {{ format_dateFUllTime(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                    {{ format_dateFUllTime(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                     <v-btn
                        v-if="item.checkDeposit === 'True'"
                        color="#880E4F"
                        fab
                        small
                        @click="setDataMenu(item)">
                        <v-icon color="#FFFFFF" class="iconify" data-icon="ic:outline-menu-book"></v-icon>
                      </v-btn>
                    <template v-if="$session.getAll().data.timeSlotStatus === 'True'">
                      <v-btn
                      v-if="showStepCheck"
                      color="#4CAF50"
                      fab
                      small
                      @click="
                        (dialogStep = true),
                          getDataById(item),
                          getStepFlow(item)
                      "
                    >
                      <v-icon color="#FFFFFF"> mdi-debug-step-over </v-icon>
                    </v-btn>
                      <v-btn
                      color="question"
                      fab
                      dark
                      small
                      @click.stop="
                        (dialogEdit = true),
                          getDataById(item),
                          validate('UPDATE'),checkStoreFrontUpdate()
                      "
                    >
                      <v-icon> mdi-tools </v-icon>
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
                    <template v-else>
                    <v-btn
                      color="purple"
                      fab
                      small
                      @click="
                          (dialoglimitbooking = true),getlimitbooking(item)
                      "
                    >
                      <v-icon color="#FFFFFF"> mdi-calendar-clock </v-icon>
                    </v-btn>
                    <v-btn
                      color="info"
                      fab
                      small
                      @click="
                          getCondition(item)
                      "
                    >
                      <v-icon color="#FFFFFF"> mdi-clipboard-text-search </v-icon>
                    </v-btn>
                    <v-btn
                      v-if="showStepCheck"
                      color="#4CAF50"
                      fab
                      small
                      @click="
                        (dialogStep = true),
                          getDataById(item),
                          getStepFlow(item)
                      "
                    >
                      <v-icon color="#FFFFFF"> mdi-debug-step-over </v-icon>
                    </v-btn>
                    <v-btn
                      color="question"
                      fab
                      dark
                      small
                      @click.stop="
                        (dialogEdit = true),
                          getDataById(item),
                          validate('UPDATE')
                      "
                    >
                      <v-icon> mdi-tools </v-icon>
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
      <v-dialog v-model="dialogwarn" max-width="30%" persistent >
        <v-card class="pa-3" style="overflow-x: hidden">
          <div style="text-align: end;">
              <v-btn
                fab
                x-small
                dark
                color="#F3F3F3"
                @click="dialogwarn = false"
              >
                <v-icon dark
                color="#FE4A01 ">
                  mdi-close
                </v-icon>
              </v-btn>
          </div>
          <div class="text-center mb-6">
            <h4 class="font-weight-medium">
              <v-icon x-large color="orange darken-2" >mdi-alert-box-outline</v-icon>
              รายการที่จำเป็นเมื่อเพิ่มประเภทบริการ</h4>
          </div>
          <div class="text-left ma-0 ml-3" v-for="(item , index) in warnText" :key="index">
            <h6 class="font-weight-medium">{{(index + 1) + '. ' + item.text}}
              <v-btn
              v-if="item.buttonLink !== 'False'"
                class="mx-2"
                dark
                small
                color="primary"
                @click="gotosetting(item.buttonLink)"
              >
              ตั่งค่า
                <v-icon dark class="ml-1">
                  mdi-cog-transfer
                </v-icon>
              </v-btn>
            </h6>
          </div>
          <div  style="text-align: end;">
              <v-checkbox
                class="ml-6"
                v-model="checkboxwarn"
                label="ไม่ต้องแสดงอีก"
                true-value="True"
                false-value="False"
                @click="updateWarn()"
              ></v-checkbox>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogMenu" max-width="550px" persistent>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="6" class="text-left pt-10">
                <h3><strong>จัดการรายการเมนู</strong></h3>
              </v-col>
              <v-col cols="6" class="pt-10">
                <div style="text-align: end;">
                  <v-btn
                    class="mx-2"
                    fab
                    small
                    dark
                    color="white"
                    :style="styleCloseBt"
                    @click="getFlow()"
                    >
                    X
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col cols="8">
                    <v-checkbox
                      class="mt-2"
                      label="เปิดใช้งานเมนู"
                      false-value="False"
                      :on-icon="'mdi-check-circle'"
                      :off-icon="'mdi-checkbox-blank-circle-outline'"
                      color="#1B437C"
                      true-value="True"
                      v-model="formMenu.menuShowStatus"
                      @change="changeFormMenuStatus()"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="4">
                    <v-btn
                      color="blue-grey"
                      class="white--text"
                      depressed
                      dark
                      block
                      @click="dialogAddMenu = true, clearFormAddMenu(), titleMenuDialog='เพิ่มรายการเมนู'"
                    >
                      <v-icon left>mdi-text-box-plus</v-icon>
                      เพิ่มเมนู
                    </v-btn>
                  </v-col>
                </v-row>
                <draggable
                  :list="formMenu.menuItem"
                  :disabled="!enabledMenu"
                  class="list-group"
                  ghost-class="ghost"
                  :move="checkMove"
                  @start="draggingMenu = true"
                  @end="draggingMenu = false"
                >
                  <div
                    class="list-group-item"
                    v-for="(element,id) in formMenu.menuItem"
                    :key="id"
                  >
                  <v-row>
                    <v-col cols="10">
                    <div style="display: flex">
                      <div style="height: 70px; width: 70px">
                        <!-- <v-avatar color="white" size="60">
                          <img :src="element.picture" alt="img"
                        /></v-avatar> -->
                        <v-img
                          :src="element.picture"
                          height="70"
                          width="70"
                          class="link mt-4"
                          style="opacity: 1;border-top-right-radius: 0;border-bottom-right-radius: 0px;border-top-left-radius: 20px;border-bottom-left-radius: 0;"
                        >
                        </v-img>
                      </div>
                      <div style="display: flex">
                        <div style="padding: 8px; position: relative;">
                          <div height="100">
                            <div class="colorBetaskText" style="font-weight: bold;font-size: 17px;">{{ element.name.substring(0, 79) }}</div>
                          </div>
                          <!-- <div height="100" v-if="element.name.length >= 49">
                            <div style="font-size: 15px;">{{ element.nameSub.substring(0, 41) }}...</div>
                          </div>
                          <div height="100" v-else>
                            <div style="font-size: 15px;">{{ element.nameSub.substring(0, 41) }}</div>
                          </div> -->
                          <div class="ml-5" style="font-size: 15px;">{{ element.nameSub }}</div>
                          <div height="100">
                            <div style="font-weight: bold;font-size: 17px;color:#1B5E20;">฿ {{ formatNumber(element.price) }}</div>
                          </div>
                        </div>
                        </div>
                    </div>
                    </v-col>
                    <v-col cols="2">
                      <v-btn
                        fab
                        small
                        dark
                        color="warning"
                        @click="titleMenuDialog='แก้ไขรายการเมนู', setFormAddMenu(element, id)"
                        >
                        <v-icon>mdi-cog</v-icon>
                      </v-btn>
                    </v-col>
                    </v-row>
                  </div>
                </draggable>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogAddMenu" max-width="550px" persistent>
        <div v-if="!dataReadyAddMenu" class="text-center">
          <waitingAlert></waitingAlert>
        </div>
        <v-card class="text-center" v-else>
          <v-card-text>
            <v-row>
              <v-col cols="6" class="text-left pt-10">
                <h3><strong>{{titleMenuDialog}}</strong></h3>
              </v-col>
              <v-col cols="6" class="pt-10">
                <div style="text-align: end;">
                  <v-btn
                    class="mx-2"
                    fab
                    small
                    dark
                    color="white"
                    :style="styleCloseBt"
                    @click="(dialogAddMenu = false), clearFormAddMenu()"
                    >
                    X
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <v-form ref="form_addMenu" v-model="valid_addMenu" lazy-validation>
              <v-row>
                <v-col cols="12" class="text-center">
                  <v-img
                    aspect-ratio="6"
                    contain
                    :src="titleMenuDialog === 'เพิ่มรายการเมนู' ? formAddMenu.pictureUrlPreview:formAddMenu.picture"
                  ></v-img>
                  <!-- <v-avatar size="100px"><img alt="Avatar" :src="formAdd.pictureUrl"></v-avatar> -->
                  <br />
                  <v-file-input
                    required
                    counter
                    show-size
                    accept="image/png, image/jpeg, image/bmp"
                    prepend-icon="mdi-camera"
                    label="รูปรายการ"
                    @change="selectImgMenu"
                    v-model="formAddMenu.filesMenu"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-text-field
                    dense
                    outlined
                    label="ชื่อรายการ"
                    v-model="formAddMenu.name"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-text-field
                    dense
                    outlined
                    label="ชื่อรองรายการ"
                    v-model="formAddMenu.nameSub"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <VuetifyMoney
                    label="ราคา"
                    v-model="formAddMenu.price"
                    required
                    :rules="[rules.required]"
                    outlined
                    dense
                    v-bind:options="options2" />
                </v-col>
                <v-col cols="12">
                  <v-btn
                    color="blue-grey"
                    class="ma-2 white--text"
                    block
                    @click="titleMenuDialog === 'เพิ่มรายการเมนู' ? addMenu() : editMenuSubmit()"
                  >
                    บันทึก
                  </v-btn>
                  <v-btn
                    v-if="titleMenuDialog !== 'เพิ่มรายการเมนู'"
                    color="error"
                    class="ma-2 white--text"
                    block
                    @click="deleteMenuSubmit()"
                  >
                    ลบข้อมูล
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import XLSX from 'xlsx' // import xlsx
import draggable from 'vuedraggable'
import moment from 'moment' // แปลง date

export default {
  components: {
    draggable,
    waitingAlert,
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney
  },
  computed: {
    colswidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '12'
        case 'sm': return '12'
        case 'md': return '6'
        case 'lg': return '6'
        case 'xl': return '6'
      }
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    draggingInfo () {
      return this.dragging ? 'under drag' : ''
    }
  },
  data () {
    return {
      showStepCheck: true,
      formMenuStatus: 'False',
      // allowDrag: true,
      // selected: [],
      // filesMenu: null,
      titleMenuDialog: '',
      counter: 0,
      enabledMenu: true,
      draggingMenu: false,
      dialogAddMenu: false,
      valid_addMenu: true,
      dataReadyAddMenu: true,
      indexMenu: '',
      formAddMenu: {
        name: '',
        nameSub: '',
        price: 0,
        picture: '',
        pictureUrlPreview: '',
        filesMenu: null
      },
      enabled: true,
      dragging: false,
      dessertsSort: [],
      headersSort: [
        // { text: 'Lock', value: 'lock', width: '50px', sortable: false },
        {
          text: 'รหัสบริการ',
          align: 'start',
          value: 'flowId'
        },
        { text: 'ชื่อบริการ', value: 'flowName' }
      ],
      reRender: 0,
      dragNdrop: [],
      servicePointCount: '',
      dialogSortFlow: false,
      dialogwarn: false,
      checkboxwarn: false,
      warnText: [],
      valid_update: true,
      BookingFieldshowtime: null,
      formUpdateLimitbooking: {
        flowId: null,
        time: '',
        setTime: '',
        setTimebyday: 'False',
        limitBooking: 0,
        limitBookingCheck: 'False',
        shopId: this.$session.getAll().data.shopId,
        dateDayoffText: [],
        dateDayoffValue: [],
        dateDayCustom: [],
        typeDayCustom: ''
      },
      bookingNowCheckCount: [
        {
          text: '1 วัน',
          value: 1
        },
        {
          text: '2 วัน',
          value: 2
        },
        {
          text: '3 วัน',
          value: 3
        },
        {
          text: '4 วัน',
          value: 4
        },
        {
          text: '5 วัน',
          value: 5
        },
        {
          text: '6 วัน',
          value: 6
        },
        {
          text: '7 วัน',
          value: 7
        }

      ],
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
      itemDateStop: ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'],
      itemDateStopValue: [0, 1, 2, 3, 4, 5, 6],
      typeTimeAdd: 'add',
      timeText: '',
      indexTimeAdd: 0,
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
        { text: 'จำนวนนัดหมาย', value: 'limitBooking', align: 'center', width: '200px' },
        // { text: 'เรียงตำแหน่ง', value: 'actions1', align: 'center' },
        { text: 'จัดการเวลา', value: 'actions2', align: 'center', width: '100px' }
      ],
      flowId: '',
      dataCondition: [],
      oldDataCondition: [],
      showCondition: 'ไม่แสดง',
      dataCountCondition: '',
      oldDataCountCondition: '',
      itemCountCondition: [
        {text: '1', value: 1},
        {text: '2', value: 2},
        {text: '3', value: 3},
        {text: '4', value: 4},
        {text: '5', value: 5}
      ],
      PK: '',
      path: '/flow/', // Path Model
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'เพิ่ม/ลบ สถานะการบริการ',
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
      optionsDeposit: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 2
      },
      optionsPercent: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 100,
        precision: 0
      },
      selectTypeField: [
        { text: 'Text', value: 'text' },
        { text: 'Number', value: 'number' },
        { text: 'Datetime', value: 'dateTime' }
      ],
      // End Menu Config
      dataReady: true,
      dataConditionReady: true,
      canvas: true,
      dateTime: '', // Generate DateTime
      date: this.momenDate_1(new Date()),
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      // Dialog Config ADD EDIT DELETE IMPORT
      dialoglimitbooking: false,
      dialogAddField: false,
      dialogEditField: false,
      dialogAdd: false,
      dialogEdit: false,
      dialogDeleteF: false,
      dialogDelete: false,
      dialogImport: false,
      dialogStep: false,
      dialogAddStepTitle: false,
      dialogEditStep: false,
      dialogDeleteStepTitle: false,
      dialogCondition: false,
      // END Dialog Config ADD EDIT DELETE
      panel: [0],
      panel1: [1],
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      // Search All
      searchAll: '',
      searchAll2: '',
      depositTimeItem: [
        { text: 'ไม่จำกัดเวลามัดจำ', value: 'NO' },
        { text: '10 นาที', value: '10' },
        { text: 'ครึ่งชั่วโมง', value: '30' },
        { text: '1 ชั่วโมง', value: '60' },
        { text: '3 ชั่วโมง', value: '180' },
        { text: '6 ชั่วโมง', value: '360' },
        { text: '1 วัน', value: '1440' }
      ],
      formAdd: {
        flowCode: '',
        flowId: '',
        flowName: '',
        flowNameEn: '',
        flowfieldName: [],
        CREATE_USER: '',
        LAST_USER: '',
        checkPayment: 'True',
        checkOnsite: 'False',
        checkOnsiteEmp: 'False',
        checkDeposit: 'False',
        repeatBooking: 'False',
        storeFrontCheck: 'False',
        depositTime: 'NO',
        promptPayID: null,
        promptPayName: null,
        amountDeposit: 0,
        depositPercent: 0,
        shopId: this.$session.getAll().data.shopId,
        remarkConfirm: '',
        remarkConfirmEn: '',
        timeSlotStatus: this.$session.getAll().data.timeSlotStatus || 'False',
        timeSlot: 1,
        bookingNowCheck: 'False',
        bookingNowCheckCount: 0,
        bookingNowCheckTimeStatus: 'False',
        overTime: 'True',
        customerTimeSlot: 'False',
        empTitleTh: 'พนักงานช่าง',
        empTitleEng: 'Employee',
        storeFrontText: '',
        storeFrontMessageFinish: '',
        servicePointTh: '',
        servicePointEn: '',
        servicePointCount: '',
        servicePointStatus: 'False',
        servicePointCountStart: 0,
        servicePointCountEnd: 0,
        servicePointRecursive: 'False',
        depositTextTH: 'ชำระเงินมัดจำ',
        depositTextEN: 'pay deposit',
        updateStatusConfirm: 'False',
        categorySub: [],
        checkCreditCard: 'False',
        checkCoupon: 'False',
        masBranchID: '',
        storeFrontNotifyStatus: 'False',
        storeFrontNotifySet: '0',
        newCustomerStatus: 'False',
        checkDateConfirmJob: 'False',
        OnsiteEndTime: null,
        statusLimitBookingByDate: 'False',
        countLimitBookingByDate: 0
      },
      formAddStep: {
        stepId: '',
        flowId: '',
        stepTitle: '',
        stepTitleEN: '',
        sortNo: '',
        finishTime: '',
        CREATE_USER: '',
        LAST_USER: '',
        shopId: '',
        sendCard: 'True',
        pushMessageStatus: 'False',
        pushMessageTextTH: '',
        pushMessageTextEN: ''
      },
      formUpdateStep: {
        stepId: '',
        flowId: '',
        stepTitle: '',
        stepTitleEN: '',
        sortNo: '',
        finishTime: '',
        LAST_USER: '',
        shopId: '',
        sendCard: '',
        pushMessageStatus: 'False',
        pushMessageText: '',
        pushMessageTextTH: '',
        pushMessageTextEN: ''
      },
      formUpdate: {
        flowCode: '',
        fieldId: '',
        fieldName: '',
        flowfieldName: [],
        flowfieldId: '',
        fieldType: '',
        flowId: '',
        flowName: '',
        flowNameEn: '',
        LAST_USER: '',
        checkPayment: 'True',
        checkOnsite: 'False',
        checkDeposit: 'False',
        checkOnsiteEmp: 'False',
        repeatBooking: 'False',
        storeFrontCheck: 'False',
        depositTime: '',
        amountDeposit: 0,
        depositPercent: 0,
        promptPayID: null,
        promptPayName: null,
        shopId: '',
        remarkConfirm: '',
        remarkConfirmEn: '',
        timeSlotStatus: this.$session.getAll().data.timeSlotStatus || 'False',
        timeSlot: 1,
        bookingNowCheck: 'False',
        bookingNowCheckCount: 0,
        bookingNowCheckTimeStatus: 'False',
        overTime: 'True',
        customerTimeSlot: 'False',
        empTitleTh: 'พนักงานช่าง',
        empTitleEng: 'Employee',
        storeFrontText: '',
        storeFrontMessageFinish: '',
        servicePointTh: '',
        servicePointEn: '',
        servicePointCount: '',
        servicePointStatus: 'False',
        servicePointCountStart: 0,
        servicePointCountEnd: 0,
        servicePointRecursive: 'False',
        depositTextTH: '',
        depositTextEN: '',
        categorySub: [],
        checkCreditCard: 'False',
        checkCoupon: 'False',
        masBranchID: '',
        storeFrontNotifyStatus: 'False',
        storeFrontNotifySet: '0',
        newCustomerStatus: 'False',
        checkDateConfirmJob: 'False',
        OnsiteEndTime: null,
        statusLimitBookingByDate: 'False',
        countLimitBookingByDate: 0
      },
      formUpdateItemFlow: {
        fieldId: '',
        fieldName: '',
        flowfieldName: [],
        flowfieldId: '',
        fieldType: '',
        flowId: '',
        flowName: '',
        LAST_USER: '',
        sortNo: '',
        shopId: ''
      },
      formUpdateItem: {
        flowCode: '',
        fieldId: '',
        fieldName: '',
        flowfieldName: [],
        fieldType: '',
        flowId: '',
        flowName: '',
        flowNameEn: '',
        checkPayment: 'True',
        checkOnsite: 'False',
        LAST_USER: '',
        remarkConfirm: '',
        remarkConfirmEn: ''
      },
      columnsStep: [
        { text: 'แจ้งเตือน', value: 'sendCard', align: 'center' },
        // { text: 'ID', value: 'stepId' },
        { text: 'Title', value: 'stepTitle', align: 'center' },
        { text: 'เวลาที่คาดว่าจะเสร็จ', value: 'finishTime', align: 'center' },
        { text: ' ', value: 'actions2', sortable: false, align: 'center' },
        { text: 'Action', value: 'action', sortable: false, align: 'center' }
      ],
      columnsStepOnsite: [
        { text: 'AC', value: 'sendCard' },
        { text: 'ID', value: 'stepId' },
        { text: 'Title', value: 'stepTitle', align: 'center' }
      ],
      sendCard: false,
      headers: [
        { text: 'แสดงข้อมูลในการ์ด', value: 'showCard', sortable: false, align: 'center' },
        { text: 'ข้อมูล', value: 'fieldName' },
        { text: 'ลบข้อมูล', value: 'actions', sortable: false }
      ],
      sortBy: false,
      desserts: [],
      editedItemSelete: [],
      editedItem: {
        fieldId: '',
        fieldName: ''
      },
      editedItem2: {
        fieldId: '',
        fieldName: ''
      },
      stepItemSelete: [],
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
      depositPercentrules: [
        (value) => !!value.toString().trim() || 'กรุณากรอกข้อมูล',
        (value) => (value >= 0 && value <= 100) || 'กรุณากรอกค่าระหว่าง 0 ถึง 100'
      ],
      // End Form Config ADD EDIT
      // Data Table Config
      columns: [
        // { text: 'ID', value: 'flowId' },
        { text: 'ชื่อบริการ', value: 'flowName' },
        { text: 'สาขา', value: 'masBranchID' },
        // { text: 'Field', value: 'flowfieldName' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
        { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
        { text: 'จัดการประเภทบริการ', value: 'action', sortable: false, align: 'center' }
      ],
      dataItem: [],
      validAdd: true,
      validUpdate: true,
      validCondition: true,
      editedIndex: -1,
      checkOnsite: '',
      search: '',
      headersNew: [
        {
          text: 'Dessert (100g serving)',
          value: 'name',
          sortable: false
        },
        {
          text: 'Calories',
          value: 'calories',
          sortable: false
        },
        { text: 'Action', value: 'actions', sortable: false, align: 'center' }
      ],
      dessertsNew: [{
        id: 1,
        name: 'Frozen Yogurt',
        calories: 120
      },
      {
        id: 2,
        name: 'Ice cream sandwich',
        calories: 200
      }
      ],
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
      dataLineConfig: {},
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
      formMenu: {
        menuItem: [],
        menuShowStatus: 'False'
      },
      dialogMenu: false,
      categorySubByShop: [],
      categorySub: [],
      branch: [],
      dataItemsearch: [],
      selectBranch: 'All',
      ExcelField: null
      // End Data Table Config
    }
  },
  async mounted () {
    if (this.$session.getAll().data.billingPlan === '1' || this.$session.getAll().data.billingPlan === '2') {
      if (this.$session.getAll().data.shopId === 'U1b8d05a22f9ca1b2744f352cc64f14e4' || this.$session.getAll().data.shopId === 'SD_1659673973416') {
        this.showStepCheck = true
      } else {
        this.showStepCheck = false
      }
    }
    this.dataLineConfig = await this.getDataLineConfig(this.$session.getAll().data.shopId)
    this.dataReady = false
    // Get Data
    await this.getCustomField()
    await this.getDataGlobal(this.DNS_IP, this.path, this.session.data.shopId)
    if (this.dataItem.length > 0) {
      for (let i = 0; i < this.dataItem.length; i++) {
        let d = this.dataItem[i]
        if (d.masBranchID === null) {
          d.masBranchID = 'All'
        }
        let s = {}
        s.flowId = d.flowId
        s.flowName = d.flowName
        this.dessertsSort.push(s)
      }
      // this.initSortable()
    }
    await this.getBookingField()
    console.log('TEST')
    await this.getShop()
    await this.getDataBranch()
    await this.getCategorySub()
    await this.filterBranch()
  },
  methods: {
    async getFlow () {
      this.dialogMenu = false
      await this.getDataGlobal(this.DNS_IP, this.path, this.session.data.shopId)
      if (this.dataItem.length > 0) {
        for (let i = 0; i < this.dataItem.length; i++) {
          let d = this.dataItem[i]
          if (d.masBranchID === null) {
            d.masBranchID = 'All'
          }
          let s = {}
          s.flowId = d.flowId
          s.flowName = d.flowName
          this.dessertsSort.push(s)
        }
      // this.initSortable()
      }
      await this.filterBranch()
    },
    presetTimebydayExport () {
      let timeExport = [
        { แสดงเวลา: '08:00', เวลา: '08:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '08:30', เวลา: '08:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '09:00', เวลา: '09:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '09:30', เวลา: '09:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '10:00', เวลา: '10:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '10:30', เวลา: '10:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '11:00', เวลา: '11:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '11:30', เวลา: '11:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '12:00', เวลา: '12:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '12:30', เวลา: '12:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '13:00', เวลา: '13:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '13:30', เวลา: '13:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '14:00', เวลา: '14:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '14:30', เวลา: '14:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '15:00', เวลา: '15:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '15:30', เวลา: '15:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '16:00', เวลา: '16:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '16:30', เวลา: '16:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '17:00', เวลา: '17:00', จำนวนนัดหมาย: '1' }
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
        { แสดงเวลา: '08:00', เวลา: '08:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '08:30', เวลา: '08:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '09:00', เวลา: '09:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '09:30', เวลา: '09:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '10:00', เวลา: '10:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '10:30', เวลา: '10:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '11:00', เวลา: '11:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '11:30', เวลา: '11:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '12:00', เวลา: '12:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '12:30', เวลา: '12:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '13:00', เวลา: '13:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '13:30', เวลา: '13:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '14:00', เวลา: '14:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '14:30', เวลา: '14:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '15:00', เวลา: '15:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '15:30', เวลา: '15:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '16:00', เวลา: '16:00', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '16:30', เวลา: '16:30', จำนวนนัดหมาย: '1' },
        { แสดงเวลา: '17:00', เวลา: '17:00', จำนวนนัดหมาย: '1' }
      ]
      var info = XLSX.utils.json_to_sheet(timeExport)
      var wb = XLSX.utils.book_new() // make Workbook of Excel
      XLSX.utils.book_append_sheet(wb, info, 'worksheet1') // sheetAName is name of Worksheet
      XLSX.writeFile(wb, 'file.xls') // name of the file is 'book.xlsx'
    },
    presetTimebydayUpload () {
      let makeData = [
        { text: 'อา.', value: 0, setTime: [] },
        { text: 'จ.', value: 1, setTime: [] },
        { text: 'อ.', value: 2, setTime: [] },
        { text: 'พ.', value: 3, setTime: [] },
        { text: 'พฤ.', value: 4, setTime: [] },
        { text: 'ศ.', value: 5, setTime: [] },
        { text: 'ส.', value: 6, setTime: [] }
      ]
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
        if (workbook.SheetNames.length === 7) {
          try {
            let listError = false
            workbook.SheetNames.forEach((item, keyDay) => {
              let data = [] // เปลี่ยนตัวแปร Data เป็น data ในระดับฟังก์ชัน presetTimeUpload
              let SheetNames = item
              // console.log('SheetName', SheetNames)
              const worksheet = workbook.Sheets[SheetNames]
              // console.log('worksheet', worksheet)
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
              console.log('jsonData ' + item, jsonData[0][0] === 'แสดงเวลา' && jsonData[0][1] === 'เวลา' && jsonData[0][2] === 'จำนวนนัดหมาย')
              if (jsonData[0][0] === 'แสดงเวลา' && jsonData[0][1] === 'เวลา' && jsonData[0][2] === 'จำนวนนัดหมาย') {
                try {
                  jsonData.forEach((item, key) => {
                    if (key > 0 && item.length > 0) {
                      const pattern = /^([01]\d|2[0-3]):[0-5]\d$/
                      let s = {}
                      s.id = key
                      // this.convertDateToTime(item[0])
                      console.log('pattern.test(item[1])', pattern.test(item[1]))
                      s.text = typeof item[0] === 'object' ? moment(item[0]).format('HH:mm') : item[0].toString()
                      s.value = typeof item[1] === 'object' ? moment(item[1]).format('HH:mm') : pattern.test(item[1]) ? item[1].toString() : null
                      s.limitBooking = item[2].toString() || 0
                      data.push(s) // ใช้ตัวแปร data ในการเก็บข้อมูลแทนการใช้ Data
                    }
                  })
                  console.log(item + ' สำเร็จ')
                } catch (error) {
                  console.log('error', error, item[2], keyDay)
                }
                this.ExcelField = null
              } else {
                console.log('ผิดพลาดที่', item, keyDay)
                listError = true
                this.ExcelField = null
              }
              // console.log('data', data) // ตรวจสอบข้อมูลที่ถูกเก็บในตัวแปร data
              if (data.length > 0) {
                // this.dataItemAddTime = data // เข้าถึง this.dataItemAddTime ผ่าน Arrow Function
                makeData.filter((item) => item.value === keyDay).map((item) => {
                  item.setTime = data
                })
              }
            })
            if (listError === false) {
              this.dataItemAddTimebyday = makeData
              this.$swal({
                title: 'successfully',
                text: 'สำเร็จ',
                type: 'success',
                timer: 2000,
                showConfirmButton: false
              })
            } else {
              this.$swal('ผิดพลาด', 'กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง', 'error')
            }
            console.log('makeData', makeData)
            console.log('this.dataItemAddTimebyday', this.dataItemAddTimebyday)
            this.ExcelField = null
          } catch (error) {
            console.log('error', error)
            this.ExcelField = null
            this.$swal('ผิดพลาด', 'กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง', 'error')
          }
        } else {
          this.ExcelField = null
          this.$swal('ผิดพลาด', 'กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง', 'error')
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
        console.log('jsonData ', jsonData[0][0] === 'แสดงเวลา' && jsonData[0][1] === 'เวลา' && jsonData[0][2] === 'จำนวนนัดหมาย')
        if (jsonData[0][0] === 'แสดงเวลา' && jsonData[0][1] === 'เวลา' && jsonData[0][2] === 'จำนวนนัดหมาย') {
          try {
            jsonData.forEach((item, key) => {
              if (key > 0 && item.length > 0) {
                const pattern = /^([01]\d|2[0-3]):[0-5]\d$/
                let s = {}
                s.id = key
                // this.convertDateToTime(item[0])
                console.log('pattern.test(item[1])', pattern.test(item[1]))
                s.text = typeof item[0] === 'object' ? moment(item[0]).format('HH:mm') : item[0].toString()
                s.value = typeof item[1] === 'object' ? moment(item[1]).format('HH:mm') : pattern.test(item[1]) ? item[1].toString() : null
                s.limitBooking = item[2].toString() || 0
                data.push(s) // ใช้ตัวแปร data ในการเก็บข้อมูลแทนการใช้ Data
              }
            })
          } catch (error) {
            console.log('error', error)
            this.$swal('ผิดพลาด', 'ข้อมูลไม่ถูกต้อง', 'error')
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
    filterBranch () {
      if (this.selectBranch === 'All') {
        this.dataItemsearch = this.dataItem
      } else {
        this.dataItemsearch = this.dataItem.filter((item) => item.masBranchID === this.selectBranch || item.masBranchID === 'All')
      }
    },
    async getDataBranch () {
      this.branch = []
      await axios
        .get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.length > 0) {
            let All = {}
            All.text = 'ทั้งหมด'
            All.value = 'All'
            this.branch.push(All)
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.masBranchName
              s.value = d.masBranchID.toString()
              this.branch.push(s)
              // console.log('dtdtdtdt', this.branch)
            }
          }
        })
      console.log('branch', this.branch)
    },
    async getShop () {
      await axios.get(this.DNS_IP + '/sys_shop/get?shopId=' + this.shopId)
        .then(async (response) => {
          let rs = response.data
          console.log('rs_getCategory', rs)
          if (rs.length > 0) {
            this.categorySubByShop = rs
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
            let categorySubByShopID = JSON.parse(this.categorySubByShop[0].categorySub)
            // console.log('ccc', categorySubByShopID)
            rs.forEach((d) => {
              categorySubByShopID.forEach((i) => {
                if (d.idCategorySub === i) {
                  let s = {}
                  s.text = d.nameCategorySubTH
                  s.textEn = d.nameCategorySubEN
                  s.value = d.idCategorySub
                  this.categorySub.push(s)
                }
              })
            })
            console.log('idCategorySub', this.categorySub)
          }
        }).catch(function (error) {
          console.log('Error getting profile: ' + error)
        })
    },
    async changeFormMenuStatus () {
      let changeStatus = {
        menuShowStatus: this.formMenu.menuShowStatus,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          this.DNS_IP + this.path + 'editData/' + this.flowId,
          changeStatus
        )
        .then(async response => {
          this.clearFormAddMenu()
        })
    },
    formatNumber (value) {
      if (value && value !== 0) {
        // console.log('valuevalue', value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return 0
      }
    },
    setDataMenu (item) {
      this.flowId = item.flowId
      this.formMenu.menuItem = JSON.parse(item.menuItem) || []
      // this.formMenu.menuItem = item.menuItem || []
      this.formMenu.menuShowStatus = item.menuShowStatus || 'False'
      this.dialogMenu = true
      console.log('setDataMenu', this.formMenu)
      console.log('setDataMenu', item)
    },
    selectImgMenu () {
      // console.log('this.filesMenu', this.formAddMenu.filesMenu)
      if (this.formAddMenu.filesMenu) {
        this.formAddMenu.pictureUrlPreview = URL.createObjectURL(this.formAddMenu.filesMenu)
        if (this.titleMenuDialog !== 'เพิ่มรายการเมนู') {
          this.formAddMenu.picture = this.formAddMenu.pictureUrlPreview
        }
      } else {
        this.formAddMenu.pictureUrlPreview = ''
      }
    },
    clearFormAddMenu () {
      this.formAddMenu.name = ''
      this.formAddMenu.nameSub = ''
      this.formAddMenu.price = 0
      this.formAddMenu.picture = ''
      this.formAddMenu.pictureUrlPreview = ''
      this.formAddMenu.filesMenu = null
    },
    setFormAddMenu (item, id) {
      console.log('setFormAddMenu', item)
      this.indexMenu = id
      this.formAddMenu.name = item.name
      this.formAddMenu.nameSub = item.nameSub
      this.formAddMenu.price = item.price === '' ? 0 : item.price
      this.formAddMenu.picture = item.picture
      this.dialogAddMenu = true
    },
    async addMenu () {
      // console.log('this.formAddMenu', this.formAddMenu)
      this.validate('ADDMENU')
      setTimeout(() => this.addMenuSubmit(), 500)
    },
    async addMenuSubmit () {
      if (this.valid_addMenu === true) {
        this.dataReadyAddMenu = false
        if (this.formAddMenu.filesMenu) {
          const _this = this
          let params = new FormData()
          params.append('file', this.formAddMenu.filesMenu)
          await axios
            .post(this.DNS_IP + `/file/upload/menu`, params)
            .then(function (response) {
              _this.formAddMenu.picture = response.data
            })

          let dataMenu = {
            name: this.formAddMenu.name,
            nameSub: this.formAddMenu.nameSub,
            price: this.formAddMenu.price,
            picture: this.formAddMenu.picture,
            qty: 0,
            remark: ''
          }
          this.formMenu.menuItem.push(dataMenu)
          await this.UpdateMenuInFlow(this.formMenu.menuItem)
          this.dialogAddMenu = false
          this.dataReadyAddMenu = true
          this.$swal('เรียบร้อย', 'บันทึกข้อมูล เรียบร้อย', 'success')
        } else {
          this.dataReadyAddMenu = true
          this.$swal('ผิดพลาด', 'กรุณาใส่รูปเมนู', 'error')
        }
      }
    },
    async editMenuSubmit () {
      if (this.valid_addMenu === true) {
        // this.formAddMenu.picture = this.formAddMenu.pictureUrlPreview
        this.dataReadyAddMenu = false
        this.formMenu.menuItem[this.indexMenu].name = this.formAddMenu.name
        this.formMenu.menuItem[this.indexMenu].nameSub = this.formAddMenu.nameSub
        this.formMenu.menuItem[this.indexMenu].price = this.formAddMenu.price === '' ? 0 : this.formAddMenu.price
        if (this.formAddMenu.filesMenu) {
          const _this = this
          let params = new FormData()
          params.append('file', this.formAddMenu.filesMenu)
          await axios
            .post(this.DNS_IP + `/file/upload/menu`, params)
            .then(function (response) {
              _this.formAddMenu.picture = response.data
            })
        }
        console.log('this.formAddMenu', this.formAddMenu)
        console.log('this.formMenu', this.formMenu)
        this.formMenu.menuItem[this.indexMenu].picture = this.formAddMenu.picture
        await this.UpdateMenuInFlow(this.formMenu.menuItem)
        this.dialogAddMenu = false
        this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
        this.dataReadyAddMenu = true
        this.dialogAddMenu = false
      }
    },
    async deleteMenuSubmit () {
      this.dataReadyAddMenu = false
      this.formMenu.menuItem.splice(this.indexMenu, 1)
      await this.UpdateMenuInFlow(this.formMenu.menuItem)
      this.$swal('เรียบร้อย', 'ลบข้อมูล เรียบร้อย', 'success')
      this.dialogAddMenu = false
      this.dataReadyAddMenu = true
    },
    async UpdateMenuInFlow (dateUpdate) {
      console.log('menuItem: JSON.stringify(dateUpdate)', JSON.stringify(dateUpdate))
      let addMenu = {
        menuItem: JSON.stringify(dateUpdate),
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          this.DNS_IP + this.path + 'editData/' + this.flowId,
          addMenu
        )
        .then(async response => {
          await this.getDataGlobal(
            this.DNS_IP,
            this.path,
            this.session.data.shopId
          )
          // await this.filterBranch()
          // await this.warningFlow()
          this.clearFormAddMenu()
        })
    },
    saveSortFlow () {
      // console.log('saveSortFlow', JSON.stringify(this.dessertsSort))
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
            .post(this.DNS_IP + '/flow/updateSortFlow', dt)
            .then(async (response) => {
              this.$swal('เรียบร้อย', 'เปลี่ยนแปลงลำดับการแสดง เรียบร้อย', 'success')
              this.dialogSortFlow = false
              this.dataReady = true
              await this.getDataGlobal(this.DNS_IP, this.path, this.session.data.shopId)
              if (this.dataItem.length > 0) {
                this.dessertsSort = []
                for (let i = 0; i < this.dataItem.length; i++) {
                  let d = this.dataItem[i]
                  let s = {}
                  s.flowId = d.flowId
                  s.flowName = d.flowName
                  this.dessertsSort.push(s)
                }
                // this.initSortable()
              }
              await this.filterBranch()
            })
            .catch(error => {
              console.log('error function addData : ', error)
              this.dataReady = true
            })
        })
      // console.log('dataList', JSON.stringify(dataList))
    },
    checkMove: function (e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    },
    checkStoreFrontAdd () {
      if (this.formAdd.storeFrontCheck === 'True') {
        this.formAdd.checkDeposit = 'False'
      }
    },
    checkStoreFrontUpdate () {
      if (this.$session.getAll().data.timeSlotStatus === 'True') {
        this.formUpdate.storeFrontCheck = 'False'
      } else {
        if (this.formUpdate.storeFrontCheck === 'True') {
          this.formUpdate.checkDeposit = 'False'
        }
      }
    },
    async updateWarn () {
      let dataitem = {
        'warningFlow': this.checkboxwarn
      }
      await axios
        .post(this.DNS_IP + '/system_user/edit/' + this.session.data.userId, dataitem)
        .then(async (response) => {
          console.log('response : ', response)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    gotosetting (item) {
      if (item !== 'False') {
        this.$router.push(item)
      }
      console.log(item)
    },
    async warningFlow () {
      let checkData = null
      await axios
        .get(this.DNS_IP + '/system_user/getID?userId=' + this.session.data.userId)
        .then(async (response) => {
          checkData = response
          console.log('response : ', checkData.data.warningFlow)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
      if (checkData.data.warningFlow === 'True') {

      } else {
        this.dialogwarn = true
        if (this.session.data.timeSlotStatus === 'True') {
          let text = [
            {
              'text': 'เลือกพนักงานที่รับผิดชอบประเภทบริการนี้',
              'buttonLink': '/Master/Employee'
            },
            {
              'text': 'ตั้งค่าการแจ้งเตือน Line Notify',
              'buttonLink': '/Master/SettingLineNotify'
            }
          ]
          this.warnText = text
        } else {
          let text = [
            {
              'text': 'ตั้งค่าวันหยุดบริษัท',
              'buttonLink': 'False'
            },
            {
              'text': 'ตั้งค่า เวลาการนัดหมายเข้ารับบริการ',
              'buttonLink': 'False'
            },
            {
              'text': 'ตั้งค่าการแจ้งเตือน Line Notify',
              'buttonLink': '/Master/SettingLineNotify'
            }
          ]
          this.warnText = text
        }
      }
    },
    async FunCopy (item, no) {
      let copyText = 'https://liff.line.me/' + this.dataLineConfig.liffMainID + '/stampStep?shopId=' + item.shopId + '&stepNo=' + no
      // let copyText = document.getElementById('myInputDeposit')
      // copyText.select()
      // copyText.setSelectionRange(0, 99999)
      navigator.clipboard.writeText(copyText)
      this.$swal('เรียบร้อย', 'คัดลอกเพิ่อสร้าง QR Code สำเร็จ', 'success')
      this.dialogShowDeposit = false
    },
    editItemNew (item) {
      console.log('item', item)
      console.log('this.dataItemAddTime', this.dataItemAddTime)
      this.editedIndexNew = this.dataItemAddTime.indexOf(item)
      this.editedItemNew = Object.assign({}, item)
    },

    deleteItemNew  (item) {
      const index = this.dataItemAddTime.indexOf(item)
      this.dataItemAddTime.splice(index, 1)
      this.dataItemAddTime.forEach((item, key) => {
        item.id = key + 1
      })
    },

    closeNew  () {
      setTimeout(() => {
        this.editedItemNew = Object.assign({}, this.defaultItemNew)
        this.editedIndexNew = -1
      }, 300)
    },
    addNewNew  () {
      const addObj = Object.assign({}, this.defaultItemNew)
      addObj.id = this.dataItemAddTime.length + 1
      this.dataItemAddTime.unshift(addObj)
      this.editItemNew(addObj)
    },
    saveNew  () {
      if (this.editedIndexNew > -1) {
        Object.assign(this.dataItemAddTime[this.editedIndexNew], this.editedItemNew)
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
      console.log('index', index)
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
      this.dataItemAddTime = [{'id': 1, 'value': '08:00', 'text': '08:00', 'limitBooking': '1'},
        {'id': 2, 'value': '08:30', 'text': '08:30', 'limitBooking': '1'},
        {'id': 3, 'value': '09:00', 'text': '09:00', 'limitBooking': '1'},
        {'id': 4, 'value': '09:30', 'text': '09:30', 'limitBooking': '1'},
        {'id': 5, 'value': '10:00', 'text': '10:00', 'limitBooking': '1'},
        {'id': 6, 'value': '10:30', 'text': '10:30', 'limitBooking': '1'},
        {'id': 7, 'value': '11:00', 'text': '11:00', 'limitBooking': '1'},
        {'id': 8, 'value': '11:30', 'text': '11:30', 'limitBooking': '1'},
        {'id': 9, 'value': '12:00', 'text': '12:00', 'limitBooking': '1'},
        {'id': 10, 'value': '12:30', 'text': '12:30', 'limitBooking': '1'},
        {'id': 11, 'value': '13:00', 'text': '13:00', 'limitBooking': '1'},
        {'id': 12, 'value': '13:30', 'text': '13:30', 'limitBooking': '1'},
        {'id': 13, 'value': '14:00', 'text': '14:00', 'limitBooking': '1'},
        {'id': 14, 'value': '14:30', 'text': '14:30', 'limitBooking': '1'},
        {'id': 15, 'value': '15:00', 'text': '15:00', 'limitBooking': '1'},
        {'id': 16, 'value': '15:30', 'text': '15:30', 'limitBooking': '1'},
        {'id': 17, 'value': '16:00', 'text': '16:00', 'limitBooking': '1'},
        {'id': 18, 'value': '16:30', 'text': '16:30', 'limitBooking': '1'},
        {'id': 19, 'value': '17:00', 'text': '17:00', 'limitBooking': '1'}]
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
        if (this.formUpdateLimitbooking.dateDayoffText.filter(item => item === v).length > 0) {
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
        'limitBookingCheck': this.formUpdateLimitbooking.limitBookingCheck,
        'setTime': JSON.stringify(setTime),
        'dateDayoffText': JSON.stringify(this.formUpdateLimitbooking.dateDayoffText),
        'dateDayoffValue': JSON.stringify(dd),
        'dateDayCustom': JSON.stringify(this.formUpdateLimitbooking.dateDayCustom),
        'typeDayCustom': this.formUpdateLimitbooking.typeDayCustom,
        'setTimebyday': this.formUpdateLimitbooking.setTimebyday
      }
      console.log(dd)
      console.log('Dataitem', Dataitem)
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
            .post(this.DNS_IP + '/flow/editData/' + this.formUpdateLimitbooking.flowId, Dataitem)
            .then(async (response) => {
              this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
              this.dialoglimitbooking = false
              await this.clearLimit()
            })
            .catch(error => {
              console.log('error function addData : ', error)
            })
        })
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
      this.formUpdateLimitbooking.flowId = item.flowId
      // console.log('this.formUpdateLimitbooking.flowId', this.formUpdateLimitbooking.flowId)
      let dt = []
      await axios
        .get(this.DNS_IP + '/flow/get?flowId=' + item.flowId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            dt = rs
            console.log('rsๅๅๅ', rs)
            this.formUpdateLimitbooking.limitBookingCheck = rs[0].limitBookingCheck || 'False'
            if (rs[0].dateDayoffText === null || rs[0].dateDayoffText === '') {
              this.formUpdateLimitbooking.dateDayoffText = []
            } else {
              this.formUpdateLimitbooking.dateDayoffText = JSON.parse(rs[0].dateDayoffText)
            }
            if (rs[0].dateDayCustom === null || rs[0].dateDayCustom === '') {
              this.formUpdateLimitbooking.dateDayCustom = []
            } else {
              this.formUpdateLimitbooking.dateDayCustom = JSON.parse(rs[0].dateDayCustom)
            }
            this.formUpdateLimitbooking.typeDayCustom = rs[0].typeDayCustom
            this.formUpdateLimitbooking.dateDayoffValue = rs[0].dateDayoffValue
            this.formUpdateLimitbooking.setTimebyday = rs[0].setTimebyday
            // console.log('this.formUpdateLimitbooking.setTime', rs[0].setTime)
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
            // if (rs[0].setTime === null || rs[0].setTime === '' || rs[0].setTime === '[]') {
            //   this.dataItemAddTime = []
            // } else {
            //   let setTime = JSON.parse(rs[0].setTime)
            //   setTime.map((v, k) => { v.id = k + 1 })
            //   console.log('settime222222222', setTime)
            //   if (setTime[0].limitBooking === undefined) {
            //     // console.log('dasdas')
            //     for (let i = 0; i < setTime.length; i++) {
            //       let d = setTime[i]
            //       d.limitBooking = ''
            //       this.dataItemAddTime.push(d)
            //     }
            //   } else {
            //     this.dataItemAddTime = setTime
            //   }
            // }
            console.log('testgetgetlimitbooking', this.formUpdateLimitbooking)
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
      console.log('dt', dt)
      await this.chekshowTime('open', dt[0])
    },
    chekshowTime (open, item) {
      if (open) {
        if (this.BookingFieldshowtime === 'แสดง') {
        } else {
          console.log('this.formUpdate.limitBookingCheck', this.formUpdateLimitbooking.limitBookingCheck)
          if (item.limitBookingCheck === 'True') {
            this.$swal('ปิด LimitBooking ', 'กรุณาเปิดการแสดงเวลานัดหมายเพื่อเปิด LimitBooking', 'error').then(() => {
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
          this.$swal('ร้านของคุณไม่สามารถเปิด LimitBooking ได้', 'กรุณาเปิดการแสดงเวลานัดหมาย', 'error').then(() => {
            this.formUpdateLimitbooking.limitBookingCheck = 'False'
          })
        }
      }
    },
    getUpdateAdd (item, text, index) {
      if (text === 'update') {
        this.formUpdateLimitbooking.time = item.value
        this.formUpdateLimitbooking.limitBooking = item.limitBooking
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
    changedateDayoff () {
      let dd = []
      this.itemDateStop.forEach((v, k) => {
        // console.log('test', this.formUpdate.dateDayoffText.filter(item => item === v))
        if (this.formUpdateLimitbooking.dateDayoffText.filter(item => item === v).length > 0) {
          dd.push(k)
        }
      })
      this.formUpdateLimitbooking.dateDayoffValue = JSON.stringify(dd)
    },
    allowedDates (val) {
      // this.getMonth(this.pickerDate)
      if (this.formUpdateLimitbooking.dateDayoffValue !== null && this.formUpdateLimitbooking.dateDayoffValue.length > 0) {
        if (JSON.parse(this.formUpdateLimitbooking.dateDayoffValue).filter(el => { return el === new Date(val).getDay() }).length === 0) {
          return val
        }
      } else {
        return val
      }
    },
    UpdateDataTimeAdd () {
      if (this.formUpdateLimitbooking.time !== '' && this.timeText !== '') {
        var dataTime = this.formUpdateLimitbooking.time.split(':')
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
          this.dataItemAddTime[this.indexTimeAdd].limitBooking = this.formUpdateLimitbooking.limitBooking
          this.typeTimeAdd = 'add'
          this.formUpdateLimitbooking.time = ''
          this.timeText = ''
          this.formUpdateLimitbooking.limitBooking = 0
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
    addDataTimeAdd () {
      if (this.formUpdateLimitbooking.time !== '' && this.timeText !== '') {
        var dataTime = this.formUpdateLimitbooking.time.split(':')
        var hh = dataTime[0]
        var mm = dataTime[1]
        console.log(dataTime)
        if (parseInt(hh) <= 24 && parseInt(mm) <= 59) {
          if (this.dataItemAddTime.length === 0) {
            // this.dataItemAddTime.push({value: this.formUpdateLimitbooking.time, text: this.formUpdateLimitbooking.time, sortNo: 1})
            let numhh = 100 + parseInt(hh)
            let nummm = 100 + parseInt(mm)
            let strhh = numhh.toString().substring(1, 3)
            let strmm = nummm.toString().substring(1, 3)
            this.dataItemAddTime.push({value: strhh + ':' + strmm, text: this.timeText, limitBooking: this.formUpdateLimitbooking.limitBooking})
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
            this.dataItemAddTime.push({value: strhh + ':' + strmm, text: this.timeText, limitBooking: this.formUpdateLimitbooking.limitBooking})
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
    getCondition (item) {
      this.dataCondition = []
      // console.log(item.dataCondition.replace(/\n/g, '\\\\n').replace(/\r/g, '\\\\r').replace(/\t/g, '\\\\t'))
      // console.log('this.dataCondition', item.dataCondition)
      if (item.dataCondition === null) {
        this.dataCondition = []
      } else {
        this.dataCondition = JSON.parse(item.dataCondition.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t'))
      }
      this.dataCountCondition = item.countCondition || ''
      this.showCondition = item.showCondition || 'ไม่แสดง'
      // this.validate('CONDITION')
      this.oldDataCountCondition = item.countCondition || ''
      this.flowId = item.flowId
      this.dialogCondition = true
    },
    fixCountCondition () {
      if (this.dataCondition.length > 0) {
        if (this.dataCondition[0].image === '') {
          this.dataCondition = []
          for (let i = 0; i < this.dataCountCondition; i++) {
            this.dataCondition.push({id: i + 1, text: '', image: '', files: null})
          }
          this.validate('CONDITION')
        } else {
          console.log('oldDataCountCondition', this.oldDataCountCondition)
          console.log('dataCountCondition', this.dataCountCondition)
          if (this.oldDataCountCondition < this.dataCountCondition) {
            var sumCount = this.dataCountCondition - this.dataCondition.length
            console.log('sumCount', sumCount)
            for (let i = 0; i < sumCount; i++) {
              this.dataCondition.push({id: this.dataCondition.length + 1, text: '', image: '', files: null})
            }
            this.oldDataCountCondition = this.dataCondition.length
          } else {
            this.$swal({
              title: 'คุณต้องการจะลดจำนวน ใช่หรือไม่?',
              text: 'การลดจำนวนจะทำให้ข้อมูลที่ท่านกรอกหายไป',
              type: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#b3b1ab',
              confirmButtonText: 'ใช่',
              cancelButtonText: 'ไม่'
            })
              .then(async result => {
                this.oldDataCondition = this.dataCondition
                this.dataCondition = []
                for (let i = 0; i < this.dataCountCondition; i++) {
                  var d = this.oldDataCondition[i]
                  this.dataCondition.push(d)
                }
                this.oldDataCountCondition = this.dataCondition.length
              })
              .catch(error => {
                console.log('error function addData : ', error)
              })
          }
          this.validate('CONDITION')
        }
      } else {
        this.dataCondition = []
        for (let i = 0; i < this.dataCountCondition; i++) {
          this.dataCondition.push({id: i + 1, text: '', image: '', files: null})
        }
        this.validate('CONDITION')
      }
    },
    selectImg (item) {
      if (item.files) {
        item.image = URL.createObjectURL(
          item.files
        )
      } else {
        item.image = ''
      }
      // console.log(event)
    },
    async addDataCondition () {
      console.log('dataCondition', this.dataCondition)
      console.log('dataCountCondition', this.dataCountCondition)
      if (this.dataCountCondition !== '') {
        if (this.dataCondition.filter(el => { return el.image === '' }).length === 0) {
          this.dataConditionReady = false
          let dataUse = []
          if (this.dataCondition.length > 0) {
            for (let i = 0; i < this.dataCondition.length; i++) {
              let d = this.dataCondition[i]
              let s = {}
              s.id = d.id
              s.text = d.text
              if (d.files !== undefined) {
                console.log('image')
                let params = new FormData()
                params.append('file', d.files)
                await axios
                  .post(this.DNS_IP + `/file/upload/flowCondition`, params)
                  .then(function (response) {
                    s.image = response.data
                  // console.log('url Pic', response.data)
                  })
                dataUse.push(s)
              } else {
                s.image = d.image
                dataUse.push(s)
              }
            }
            let dt = {
              countCondition: this.dataCountCondition,
              showCondition: this.showCondition,
              dataCondition: JSON.stringify(dataUse)
            }
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + this.path + "editData/" + this.flowId,
                dt
              )
              .then(async response => {
                await this.getDataGlobal(
                  this.DNS_IP,
                  this.path,
                  this.session.data.shopId
                )
                await this.filterBranch()
                this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
                this.clearCondition()
              })
          }
        } else {
          this.$swal('ผิดพลาด', 'กรุณาใส่รูปภาพให้ครบ', 'error')
          this.dataConditionReady = true
        }
      } else {
        this.$swal('ผิดพลาด', 'เลือกจำนวนเงื่อนไข', 'error')
      }
    },
    clearCondition () {
      this.flowId = ''
      this.dataCondition = []
      this.oldDataCondition = []
      this.showCondition = 'ไม่แสดง'
      this.dataCountCondition = ''
      this.oldDataCountCondition = ''
      this.dataConditionReady = true
      this.dialogCondition = false
    },
    async actionUp (stepId) {
      console.log('stepId', stepId)
      console.log('this.stepItemSelete', this.stepItemSelete)
      let stepItem = this.stepItemSelete
      this.stepItemSelete = []
      let index = stepItem.findIndex(e => e.stepId === stepId)
      console.log('index', index)
      if (index !== -1 && index < stepItem.length + 1) {
        let el = stepItem[index]
        console.log('????', el)
        this.stepItemSelete[index] = stepItem[index - 1]
        this.stepItemSelete[index - 1] = el
        this.stepItemSelete[index].sortNo = stepItem[index - 1].sortNo + 1
        this.stepItemSelete[index - 1].sortNo = el.sortNo - 1
        console.log('sortNo', this.stepItemSelete[index - 1].sortNo)
        console.log('el:', el)
        // this.updateActionDown(this.stepItemSelete)
        console.log('movedown', this.stepItemSelete)
      }
      await this.updateActionDown(this.stepItemSelete, stepItem[0])
      console.log(this.stepItemSelete)
    },
    async actionDown (stepId) {
      console.log('stepId', stepId)
      console.log('this.stepItemSelete', this.stepItemSelete)
      let stepItem = this.stepItemSelete
      this.stepItemSelete = []
      let index = stepItem.findIndex(e => e.stepId === stepId)
      console.log('index', index)
      if (index !== -1 && index < stepItem.length - 1) {
        let el = stepItem[index]
        console.log('????', el)
        this.stepItemSelete[index] = stepItem[index + 1]
        this.stepItemSelete[index + 1] = el
        this.stepItemSelete[index].sortNo = stepItem[index + 1].sortNo - 1
        this.stepItemSelete[index + 1].sortNo = el.sortNo + 1
        console.log('sortNo', this.stepItemSelete[index + 1].sortNo)
        console.log('el:', el)
        // this.updateActionDown(this.stepItemSelete)
        console.log('movedown', this.stepItemSelete)
        // console.log(stepItem)
      }
      await this.updateActionDown(this.stepItemSelete, stepItem[0])
      console.log(this.stepItemSelete)
    },
    async updateActionDown (dt, flowId) {
      console.log('dt', dt)

      var newArray = dt.filter(val => val)
      console.log(newArray)
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/flowStep/" + "updateAction",
          newArray,
          {
            headers: {
              'Application-Key': this.$session.getAll().ApplicationKey
            }
          }
        )
        .then(async response => {
          // Debug response
          console.log('addDataGlobal DNS_IP + PATH + "add"', response)
          this.getStepFlow(flowId)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log('error function addDataGlobal : ', error)
          this.dataReady = true
        })
    },
    async updateSendCard () {
      console.log('updateSendCard')
      console.log('SendCard', this.sendCard)
    },
    async getCustomField (chkForm, data) {
      this.editedItemSelete = []
      axios
        .get(this.DNS_IP + '/customField/get?shopId=' + this.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.fieldName
              d.value = d.fieldId
              d.showCard = d.showCard
              if (chkForm === 'edit') {
                var chkDup = await data.filter(function (el) {
                  return el.fieldName === d.fieldName
                })
                if (chkDup.length === 0) {
                  this.editedItemSelete.push(d)
                }
              } else {
                this.editedItemSelete.push(d)
              }
            }
            console.log('this.formUpdate', data)
            console.log('this.editedItemSelete', this.editedItemSelete)
          }
        })
    },
    deleteItem (item) {
      console.log('item', item)
      var itemUseValue = ''
      var itemUseText = ''
      var itemUse = {}
      if (item.fieldId) {
        itemUseValue = item.fieldId
        itemUseText = item.fieldName
        itemUse = item
      } else {
        itemUseValue = item.fieldName.fieldId
        itemUseText = item.fieldName.fieldName
        itemUse = item.fieldName
      }
      this.$swal({
        title: 'ต้องการ ลบข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          this.editedItemSelete.push({
            text: itemUseText,
            value: itemUseValue
          })
          var x = this.desserts.indexOf(itemUse)
          this.$delete(this.desserts, x)
          // var dessert = this.desserts.filter(value => value.fieldId !== itemUseValue)
          // this.desserts = dessert
          console.log('itemUseValue', itemUseValue)
          console.log('itemUseText', itemUseText)
          console.log('desserts', this.desserts)
        })
    },
    save (item) {
      if (this.editedItemSelete.length > 0) {
        console.log('item', item)
        var itemUseValue = ''
        var itemUseText = ''
        var itemUse = {}
        if (item.value) {
          itemUseValue = item.value
          itemUseText = item.text
          itemUse = item
        } else {
          itemUseValue = item.fieldName.value
          itemUseText = item.fieldName.text
          itemUse = item.fieldName
        }
        this.desserts.push({
          fieldId: itemUseValue,
          fieldName: itemUseText,
          showCard: 'False'
        })
        var x = this.editedItemSelete.indexOf(itemUse)
        this.$delete(this.editedItemSelete, x)
        this.dialogAddField = false
        this.dialogEditField = false
      } else {
        this.$swal('ผิดพลาด', 'เนื่องจากไม่มี ช่องกรอกข้อมูล ที่จะให้เพิ่มแล้ว กรุณาตรวจสอบคว่มถูกต้อง', 'error')
        this.dialogAddField = false
        this.dialogEditField = false
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
        case 'CONDITION':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_condition.validate()
          })
          break
        case 'ADDMENU':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_addMenu.validate()
          })
          break

        default:
          break
      }
    },
    getStepFlow (dt) {
      this.stepItemSelete = []
      this.formAddStep.flowId = dt.flowId
      axios
        .get(
          this.DNS_IP +
            '/flowStep/get?flowId=' +
            dt.flowId +
            '&shopId=' +
            this.shopId
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.stepTitle
              d.value = d.stepTitle
              d.sendCard = d.sendCard || 'False'
              this.stepItemSelete.push(d)
              this.formUpdateStep.stepTitle = response.data.stepTitle
            }
            console.log('this.stepItemSelete', JSON.stringify(this.stepItemSelete))
          }
        })
    },
    getField (dt) {
      console.log(dt)
      this.desserts = []
      axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/flow/getCustomfield",
          dt
        )
        .then(response => {
          let rs = response.data
          console.log(rs)
          if (rs.length > 0) {
            this.desserts = response.data
          }
        })
    },
    async getUpdate (item) {
      console.log('อันแรก', this.formUpdateStep)
      console.log('อันสอง', item)
      this.formUpdateStep.stepId = item.stepId
      this.formUpdateStep.flowId = item.flowId
      this.formUpdateStep.stepTitle = item.stepTitle
      this.formUpdateStep.stepTitleEN = item.stepTitleEN
      this.formUpdateStep.finishTime = item.finishTime
      this.formUpdateStep.pushMessageStatus = item.pushMessageStatus || 'False'
      this.formUpdateStep.pushMessageTextTH = item.pushMessageTextTH
      this.formUpdateStep.pushMessageTextEN = item.pushMessageTextEN
    },
    async getDataById (item) {
      this.editedItemSelete = []
      this.desserts = []
      this.dataReady = false
      this.PK = item.flowCode
      this.formUpdate.statusLimitBookingByDate = item.statusLimitBookingByDate || 'False'
      this.formUpdate.countLimitBookingByDate = item.countLimitBookingByDate || 0
      this.formUpdate.servicePointTh = item.servicePointTh || ''
      this.formUpdate.servicePointEn = item.servicePointEn || ''
      this.formUpdate.storeFrontText = item.storeFrontText || ''
      this.formUpdate.storeFrontMessageFinish = item.storeFrontMessageFinish || ''
      this.formUpdate.servicePointStatus = item.servicePointStatus || 'False'
      this.formUpdate.updateStatusConfirm = item.updateStatusConfirm || 'False'
      this.formUpdate.servicePointRecursive = item.servicePointRecursive || 'False'
      this.formUpdate.servicePointCountStart = item.servicePointCountStart || '0'
      this.formUpdate.storeFrontNotifyStatus = item.storeFrontNotifyStatus || 'False'
      this.formUpdate.storeFrontNotifySet = item.storeFrontNotifySet || '0'
      this.formUpdate.servicePointCountEnd = item.servicePointCountEnd || '0'
      if (this.formUpdate.servicePointStatus === 'True') {
        this.formUpdate.servicePointCount = item.servicePointCount || ''
        if (this.formUpdate.servicePointCount !== '') {
          this.formUpdate.servicePointCount = JSON.parse(this.formUpdate.servicePointCount)
          this.servicePointCount = this.formUpdate.servicePointCount.length
        }
      } else {
        this.formUpdate.servicePointCount = ''
      }
      this.formUpdate.checkOnsite = item.checkOnsite || 'False'
      this.formUpdate.checkOnsiteEmp = item.checkOnsiteEmp || 'False'
      this.formUpdate.repeatBooking = item.repeatBooking || 'False'
      console.log('item: ', item)
      this.checkOnsite = item.checkOnsite || 'False'
      this.formUpdate.flowName = item.flowName
      this.formUpdate.flowNameEn = item.flowNameEn
      this.formUpdate.flowId = item.flowId
      this.formUpdate.flowCode = item.flowCode
      this.formUpdate.amountDeposit = item.amountDeposit || 0
      this.formUpdate.depositPercent = item.depositPercent || 0
      console.log('item.OnsiteEndTime', item.OnsiteEndTime)
      this.formUpdate.OnsiteEndTime = item.OnsiteEndTime || null
      this.formUpdate.checkPayment = item.checkPayment || 'True'
      this.formUpdate.checkDeposit = item.checkDeposit || 'False'
      this.formUpdate.storeFrontCheck = item.storeFrontCheck || 'False'
      this.formUpdate.bookingNowCheck = item.bookingNowCheck || 'False'
      this.formUpdate.overTime = item.overTime || 'True'
      this.formUpdate.bookingNowCheckCount = item.bookingNowCheckCount || 0
      this.formUpdate.bookingNowCheckTimeStatus = item.bookingNowCheckTimeStatus || 'False'
      this.formUpdate.timeSlot = item.timeSlot || 1
      this.formUpdate.timeSlotStatus = this.$session.getAll().data.timeSlotStatus || 'False'
      this.formUpdate.empTitleTh = item.empTitleTh || 'พนักงานช่าง'
      this.formUpdate.empTitleEng = item.empTitleEng || 'Employee'
      this.formUpdate.customerTimeSlot = item.customerTimeSlot || 'False'
      this.formUpdate.promptPayID = item.promptPayID || ''
      this.formUpdate.promptPayName = item.promptPayName || ''
      this.formUpdate.remarkConfirm = item.remarkConfirm || ''
      this.formUpdate.remarkConfirmEn = item.remarkConfirmEn || ''
      this.formUpdate.depositTime = item.depositTime || 'NO'
      this.formUpdate.depositTextTH = item.depositTextTH || 'ชำระเงินมัดจำ'
      this.formUpdate.depositTextEN = item.depositTextEN || 'pay deposit'
      this.formUpdate.categorySub = item.categorySub ? JSON.parse(item.categorySub) : []
      this.formUpdate.checkCreditCard = item.checkCreditCard || 'False'
      this.formUpdate.checkCoupon = item.checkCoupon || 'False'
      this.formUpdate.masBranchID = item.masBranchID || 'All'
      this.formUpdate.newCustomerStatus = item.newCustomerStatus || 'False'
      this.formUpdate.menuShowStatus = item.menuShowStatus || 'False'
      this.formUpdate.checkDateConfirmJob = item.checkDateConfirmJob || 'False'
      this.shopId = this.$session.getAll().data.shopId
      this.fieldType = this.formUpdate.fieldType
      // this.desserts = JSON.parse(response.data[0].flowfieldName)
      await this.getField(JSON.parse(item.flowfieldName))
      // this.getDataCompany()
      this.getCustomField('edit', JSON.parse(item.flowfieldName))
      // this.getStepTitle(this.formUpdateStep.stepTitle)
      this.dataReady = true
      console.log(this.formUpdate)
    },
    async addData () {
      this.validate('ADD')
      if (this.formAdd.servicePointStatus === 'True') {
        if (parseInt(this.formAdd.servicePointCountStart) >= parseInt(this.formAdd.servicePointCountEnd)) {
          this.$swal('ผิดพลาด', 'จำนวนเริ่มต้นมากกว่าหรือเท่ากับจำนวนสิ้นสุด', 'error')
        } else {
          setTimeout(() => this.addDataSubmit(), 500)
        }
      } else {
        setTimeout(() => this.addDataSubmit(), 500)
      }
    },
    async addDataSubmit () {
      if (this.validAdd !== false) {
        this.dataReady = false
        // this.formAdd.flowCode = this.generateCodeGlobal()
        this.formAdd.CREATE_USER = this.session.data.userName
        this.formAdd.LAST_USER = this.session.data.userName
        this.formAdd.flowCode = this.generateCodeGlobal()
        this.formAdd.flowfieldName = JSON.stringify(this.desserts)
        this.formAdd.shopId = this.$session.getAll().data.shopId
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
            this.formAdd.setTime = JSON.stringify([])
            this.formAdd.CREATE_USER = this.session.data.userName
            this.formAdd.LAST_USER = this.session.data.userName
            this.formAdd.flowCode = this.generateCodeGlobal()
            this.formAdd.flowfieldName = JSON.stringify(this.desserts)
            this.formAdd.amountDeposit = this.formAdd.amountDeposit || 0
            this.formAdd.depositPercent = this.formAdd.depositPercent || 0
            this.formAdd.OnsiteEndTime = this.formAdd.OnsiteEndTime || 0
            this.formAdd.depositTextEN = this.formAdd.depositTextEN
            this.formAdd.depositTextTH = this.formAdd.depositTextTH
            this.formAdd.flowName = this.formAdd.flowName
            this.formAdd.flowNameEn = this.formAdd.flowNameEn
            if (this.formAdd.remarkConfirm !== '') {
              this.formAdd.remarkConfirm = this.formAdd.remarkConfirm
            }
            if (this.formAdd.remarkConfirmEn !== '') {
              this.formAdd.remarkConfirmEn = this.formAdd.remarkConfirmEn
            }
            if (this.formAdd.empTitleTh !== '') {
              this.formAdd.empTitleTh = this.formAdd.empTitleTh
            }
            if (this.formAdd.empTitleEng !== '') {
              this.formAdd.empTitleEng = this.formAdd.empTitleEng
            }
            this.formAdd.categorySub = JSON.stringify(this.formAdd.categorySub)
            this.formAdd.servicePointCount = []
            if (this.formAdd.servicePointStatus === 'True') {
              let countService = parseInt(this.formAdd.servicePointCountEnd) - parseInt(this.formAdd.servicePointCountStart)
              let startCount = {
                'textTh': this.formAdd.servicePointTh + ' ' + (this.formAdd.servicePointCountStart).toString(),
                'textEn': this.formAdd.servicePointEn + ' ' + (this.formAdd.servicePointCountStart).toString()
              }
              this.formAdd.servicePointCount.push(startCount)
              for (let i = 0; i < countService; i++) {
                let s = {}
                let no = parseInt(this.formAdd.servicePointCountStart) + i
                s.textTh = this.formAdd.servicePointTh + ' ' + (no + 1).toString()
                s.textEn = this.formAdd.servicePointEn + ' ' + (no + 1).toString()
                this.formAdd.servicePointCount.push(s)
              }
              // for (let i = 0; i < parseInt(this.servicePointCount); i++) {
              //   let s = {}
              //   let no = i
              //   s.textTh = this.formAdd.servicePointTh + ' ' + (no + 1).toString()
              //   s.textEn = this.formAdd.servicePointEn + ' ' + (no + 1).toString()
              //   this.formAdd.servicePointCount.push(s)
              // }
              this.formAdd.servicePointCount = JSON.stringify(this.formAdd.servicePointCount)
            } else {
              this.formAdd.servicePointCount = ''
            }
            console.log('forAdd', this.formAdd)
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + this.path + "add",
                this.formAdd
              )
              .then(async response => {
              // Debug response
                console.log('addDataGlobal DNS_IP + PATH + "add"', response)
                // Close Dialog
                this.dialogAdd = false

                // Load Data
                await this.getDataGlobal(
                  this.DNS_IP,
                  this.path,
                  this.session.data.shopId
                )
                await this.filterBranch()
                // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                await this.clearData()
                await this.warningFlow()
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
    async addDataStep () {
      this.dataReady = false
      console.log('forAdd', this.formAddStep)
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
          this.formAddStep.CREATE_USER = this.session.data.userName
          this.formAddStep.LAST_USER = this.session.data.userName
          delete this.formAddStep['stepId']
          this.formAddStep.sortNo = this.stepItemSelete.length + 1
          this.formAddStep.shopId = this.shopId
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/flowStep/" + "add",
              this.formAddStep
            )
            .then(async response => {
              // Debug response
              console.log('addDataGlobal DNS_IP + PATH + "add"', response)
              // Close Dialog
              this.dialogAddStepTitle = false
              this.dataReady = true
              this.getStepFlow(this.formAddStep)
              this.formAddStep.stepTitle = ''
              this.formAddStep.stepTitleEN = ''
              this.formAddStep.finishTime = ''
              this.formAddStep.pushMessageStatus = 'False'
              this.formAddStep.pushMessageTextTH = ''
              this.formAddStep.pushMessageTextEN = ''

              // Load Data
              await this.getDataGlobal(
                this.DNS_IP,
                this.path,
                this.session.data.shopId
              )
              await this.filterBranch()
              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
            })
            // eslint-disable-next-line handle-callback-err
            .catch(error => {
              console.log('error function addDataGlobal : ', error)
              this.dataReady = true
            })
        })
        .catch(error => {
          console.log('error function addDataStep : ', error)
          this.dataReady = true
        })
    },
    async editData () {
      this.validate('UPDATE')
      if (this.formUpdate.servicePointStatus === 'True') {
        if (parseInt(this.formUpdate.servicePointCountStart) >= parseInt(this.formUpdate.servicePointCountEnd)) {
          this.$swal('ผิดพลาด', 'จำนวนเริ่มต้นมากกว่าหรือเท่ากับจำนวนสิ้นสุด', 'error')
        } else {
          setTimeout(() => this.editDataSubmit(), 500)
        }
      } else {
        setTimeout(() => this.editDataSubmit(), 500)
      }
    },
    async editDataSubmit () {
      if (this.validUpdate !== false) {
        console.log('this.formUpdate111', this.formUpdate)
        let fieldId = []
        for (let i = 0; i < this.desserts.length; i++) {
          let d = this.desserts[i]
          let s = {}
          s.fieldId = d.fieldId
          fieldId.push(s)
        }
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
            this.formUpdate.LAST_USER = this.session.data.userName
            this.formUpdate.amountDeposit = this.formUpdate.amountDeposit || 0
            this.formUpdate.depositPercent = this.formUpdate.depositPercent || 0
            this.formUpdate.OnsiteEndTime = this.formUpdate.OnsiteEndTime || 0
            this.formUpdate.flowfieldName = JSON.stringify(fieldId)
            this.formUpdate.depositTextEN = this.formUpdate.depositTextEN
            this.formUpdate.depositTextTH = this.formUpdate.depositTextTH
            this.formUpdate.flowName = this.formUpdate.flowName
            this.formUpdate.flowNameEn = this.formUpdate.flowNameEn
            if (this.formUpdate.remarkConfirm !== '') {
              this.formUpdate.remarkConfirm = this.formUpdate.remarkConfirm
            }
            if (this.formUpdate.remarkConfirmEn !== '') {
              this.formUpdate.remarkConfirmEn = this.formUpdate.remarkConfirmEn
            }

            if (this.formUpdate.empTitleTh !== '') {
              this.formUpdate.empTitleTh = this.formUpdate.empTitleTh
            }
            if (this.formUpdate.empTitleEng !== '') {
              this.formUpdate.empTitleEng = this.formUpdate.empTitleEng
            }
            if (this.formUpdate.checkDeposit === 'False') {
              this.formUpdate.menuShowStatus = 'False'
            }
            var ID = this.formUpdate.flowId
            delete this.formUpdate['flowId']
            delete this.formUpdate['fieldId']
            delete this.formUpdate['fieldName']
            delete this.formUpdate['fieldType']
            delete this.formUpdate['flowfieldId']

            this.formUpdate.servicePointCount = []
            this.formUpdate.categorySub = JSON.stringify(this.formUpdate.categorySub)
            if (this.formUpdate.servicePointStatus === 'True') {
              let countService = parseInt(this.formUpdate.servicePointCountEnd) - parseInt(this.formUpdate.servicePointCountStart)
              let startCount = {
                'textTh': this.formUpdate.servicePointTh + ' ' + (this.formUpdate.servicePointCountStart).toString(),
                'textEn': this.formUpdate.servicePointEn + ' ' + (this.formUpdate.servicePointCountStart).toString()
              }
              this.formUpdate.servicePointCount.push(startCount)
              for (let i = 0; i < countService; i++) {
                let s = {}
                let no = parseInt(this.formUpdate.servicePointCountStart) + i
                s.textTh = this.formUpdate.servicePointTh + ' ' + (no + 1).toString()
                s.textEn = this.formUpdate.servicePointEn + ' ' + (no + 1).toString()
                this.formUpdate.servicePointCount.push(s)
              }
              // for (let i = 0; i < parseInt(this.servicePointCount); i++) {
              //   let s = {}
              //   let no = i
              //   s.textTh = this.formUpdate.servicePointTh + ' ' + (no + 1).toString()
              //   s.textEn = this.formUpdate.servicePointEn + ' ' + (no + 1).toString()
              //   this.formUpdate.servicePointCount.push(s)
              // }
              this.formUpdate.servicePointCount = JSON.stringify(this.formUpdate.servicePointCount)
            } else {
              this.formUpdate.servicePointCount = ''
            }
            await axios
              .post(
              // eslint-disable-next-line quotes
                this.DNS_IP + this.path + "edit/" + ID,
                this.formUpdate
              )
              .then(async response => {
              // Debug response
                console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
                // Close Dialog
                this.dialogEdit = false
                for (let i = 0; i < this.desserts.length; i++) {
                  let d = this.desserts[i]
                  let showcarditem = {}
                  if (
                    d.showCard === undefined ||
                  d.showCard === '' ||
                  d.showCard === null ||
                  d.showCard === 'False'
                  ) {
                    showcarditem.showCard = 'False'
                    console.log('1')
                  } else {
                    showcarditem.showCard = d.showCard
                    console.log('2')
                  }
                  axios
                    .post(
                      this.DNS_IP + '/customField/edit/' + d.fieldId,
                      showcarditem
                    )
                    .then(response => {})
                    .catch(error => {
                      console.log('error function addData : ', error)
                    })
                }
                // Load Data
                await this.getDataGlobal(
                  this.DNS_IP,
                  this.path,
                  this.session.data.shopId
                )
                await this.filterBranch()
                console.log('getNow')
                this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
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
    async editDataStepTitle () {
      console.log('stepItemSelete', this.stepItemSelete)
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
          console.log('formUpdateStep', this.formUpdateStep)
          console.log('shopId', this.shopId)
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/flowStep/" + "editStep",
              this.stepItemSelete,
              {
                headers: {
                  'Application-Key': this.$session.getAll().ApplicationKey
                }
              }
            )
            .then(async response => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
              this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
              this.dialogStep = false
              await this.getDataGlobal(
                this.DNS_IP,
                this.path,
                this.session.data.shopId
              )
              await this.filterBranch()
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
    },
    async deleteData (DNS_IP, PATH, ID) {
      this.dataReady = false
      this.$swal({
        title: 'ต้องการ ลบข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          this.formUpdate.LAST_USER = this.session.data.userName
          var ID = this.formUpdate.flowId
          delete this.formUpdate['fieldId']
          delete this.formUpdate['LAST_DATE']
          delete this.formUpdate['CREATE_DATE']
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + this.path + "delete/" + ID,
              this.formUpdate
            )
            .then(async response => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
              this.dialogDelete = false
              await this.getDataGlobal(
                this.DNS_IP,
                this.path,
                this.session.data.shopId
              )
              await this.filterBranch()
              this.$swal('เรียบร้อย', 'ลบข้อมูล เรียบร้อย', 'success')
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
    },
    async UpdateworkShoplayout (ID) {
      console.log('UpdateworkShoplayout', ID)
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + '/WorkShopLayout/DeleteStep/' + ID
        )
        .then(async response => {
          // Debug response
          console.log('WorkShopLayoutSucces')
        })
      // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log('error function editDataGlobal : ', error)
        })
    },
    async deleteStepTitle () {
      console.log('stepId', this.formUpdateStep.stepId)
      let workShopId = this.formUpdateStep.stepId
      this.dataReady = false
      this.$swal({
        title: 'ต้องการ ลบข้อมูล ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async result => {
          this.formUpdateStep.LAST_USER = this.session.data.userName
          var ID = this.formUpdateStep.stepId
          await this.UpdateworkShoplayout(workShopId)
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/flowStep/" + "delete/" + ID,
              this.formUpdateStep,
              {
                headers: {
                  'Application-Key': this.$session.getAll().ApplicationKey
                }
              }
            )
            .then(async response => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
              console.log('flowid', this.formUpdateStep.flowId)
              this.$swal('เรียบร้อย', 'ลบข้อมูล เรียบร้อย', 'success')
              // await this.UpdateworkShoplayout(workShopId)
              this.dialogDeleteStepTitle = false
              await this.getStepFlow({ flowId: this.formUpdateStep.flowId })
              await this.getDataGlobal(
                this.DNS_IP,
                this.path,
                this.session.data.shopId
              )
              await this.filterBranch()
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
    },
    async editStepTitle () {
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
          this.formUpdateStep.LAST_USER = this.session.data.userName
          let ID = this.formUpdateStep.stepId
          let dt = {
            stepTitle: this.formUpdateStep.stepTitle,
            stepTitleEN: this.formUpdateStep.stepTitleEN,
            finishTime: this.formUpdateStep.finishTime,
            pushMessageStatus: this.formUpdateStep.pushMessageStatus,
            pushMessageTextTH: this.formUpdateStep.pushMessageTextTH,
            pushMessageTextEN: this.formUpdateStep.pushMessageTextEN,
            LAST_USER: this.formUpdateStep.LAST_USER
          }
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/flowStep/" + "edit/" + ID,
              dt
            )
            .then(async response => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
              // Close Dialog
              // Load Data
              this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
              this.dialogEditStep = false
              await this.getStepFlow({ flowId: this.formUpdateStep.flowId })
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
    },
    async clearData () {
      // eslint-disable-next-line no-redeclare
      for (var key in this.formAdd) {
        if (this.formAdd[key]) {
          if (key === 'depositTime') {
            this.formAdd[key] = 'NO'
          } else if (key === 'flowfieldName') {
            this.formAdd[key] = []
          } else if (key === 'overTime') {
            this.formAdd[key] = 'True'
          } else if (key === 'checkPayment') {
            this.formAdd[key] = 'True'
          } else if (key === 'checkOnsite') {
            this.formAdd[key] = 'False'
          } else if (key === 'servicePointStatus') {
            this.formAdd[key] = 'False'
          } else if (key === 'checkDeposit') {
            this.formAdd[key] = 'False'
          } else if (key === 'bookingNowCheck') {
            this.formAdd[key] = 'False'
          } else if (key === 'repeatBooking') {
            this.formAdd[key] = 'False'
          } else if (key === 'customerTimeSlot') {
            this.formAdd[key] = 'False'
          } else if (key === 'servicePointRecursive') {
            this.formAdd[key] = 'False'
          } else if (key === 'updateStatusConfirm') {
            this.formAdd[key] = 'False'
          } else if (key === 'checkDateConfirmJob') {
            this.formAdd[key] = 'False'
          } else if (key === 'amountDeposit') {
            this.formAdd[key] = 0
          } else if (key === 'servicePointCountStart') {
            this.formAdd[key] = 0
          } else if (key === 'servicePointCountEnd') {
            this.formAdd[key] = 0
          } else if (key === 'promptPayID') {
            this.formAdd[key] = null
          } else if (key === 'promptPayName') {
            this.formAdd[key] = null
          } else if (key === 'timeSlotStatus') {
            this.formAdd[key] = this.$session.getAll().data.timeSlotStatus || 'False'
          } else if (key === 'timeSlot') {
            this.formAdd[key] = 1
          } else if (key === 'shopId') {
            this.formAdd[key] = this.$session.getAll().data.shopId
          } else if (key === 'depositTextTH') {
            this.formAdd[key] = this.formAdd.depositTextTH
          } else if (key === 'depositTextEN') {
            this.formAdd[key] = this.formAdd.depositTextEN
          } else {
            if (key === 'empTitleTh' || key === 'empTitleEng') {

            } else {
              this.formAdd[key] = ''
            }
          }
        }
      }

      // eslint-disable-next-line no-redeclare
      for (var key in this.formUpdate) {
        if (this.formUpdate[key]) {
          if (key === 'depositTime') {
            this.formUpdate[key] = 'NO'
          } else if (key === 'flowfieldName') {
            this.formUpdate[key] = []
          } else if (key === 'overTime') {
            this.formUpdate[key] = 'True'
          } else if (key === 'checkPayment') {
            this.formUpdate[key] = 'True'
          } else if (key === 'checkOnsite') {
            this.formUpdate[key] = 'False'
          } else if (key === 'servicePointStatus') {
            this.formUpdate[key] = 'False'
          } else if (key === 'checkDeposit') {
            this.formUpdate[key] = 'False'
          } else if (key === 'bookingNowCheck') {
            this.formUpdate[key] = 'False'
          } else if (key === 'repeatBooking') {
            this.formUpdate[key] = 'False'
          } else if (key === 'updateStatusConfirm') {
            this.formUpdate[key] = 'False'
          } else if (key === 'customerTimeSlot') {
            this.formUpdate[key] = 'False'
          } else if (key === 'servicePointRecursive') {
            this.formUpdate[key] = 'False'
          } else if (key === 'checkDateConfirmJob') {
            this.formUpdate[key] = 'False'
          } else if (key === 'amountDeposit') {
            this.formUpdate[key] = 0
          } else if (key === 'servicePointCountStart') {
            this.formUpdate[key] = 0
          } else if (key === 'servicePointCountEnd') {
            this.formUpdate[key] = 0
          } else if (key === 'promptPayID') {
            this.formUpdate[key] = null
          } else if (key === 'promptPayName') {
            this.formUpdate[key] = null
          } else if (key === 'timeSlotStatus') {
            this.formUpdate[key] = this.$session.getAll().data.timeSlotStatus || 'False'
          } else if (key === 'timeSlot') {
            this.formUpdate[key] = 1
          } else if (key === 'shopId') {
            this.formUpdate[key] = this.$session.getAll().data.shopId
          } else {
            this.formUpdate[key] = ''
          }
        }
      }
    }
  }
}
</script>
<style scope>
.centered-input input {
  text-align: center
}
.colorBetaskText {
  color: #173053 !important;
}
.link {
  cursor:pointer;
}
.handle {
  cursor: move;
}
tbody tr:nth-of-type(even) {
  background-color: rgba(0, 0, 0, 0.01);
}
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
#margin {
  margin-top: 50px;
  margin-bottom: 40px;
}
.v_text_edit {
  width: 298px;
  height: 52px;
  font-size: 10px !important;
}
#v_img_edit {
  height: 135px;
  width: 114px;
}
#v_img_add {
  height: 139px;
  width: 140px;
}
#v_text_edits {
  height: 43px;
  width: 198px;
}
#subtext {
  color: #173053;
  font-size: 30px !important;
  font-weight: bold;
}
#v-img-fieldName {
  height: 90px;
  width: 90px;
}
#v-img-cars {
  height: 280.2578125px;
  width: 401.6603088378906px;
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
/* .v-label{
  margin-bottom: 0;
  color:#1B437C !important;
  font-weight: bold;
} */
</style>
