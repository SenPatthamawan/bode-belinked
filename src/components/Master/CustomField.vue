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
            <v-btn color="primary" depressed @click="dialogAdd = true, validate('ADD'), validate('ADDOPTION') ,checkbox ='false'">
              <v-icon left>mdi-text-box-plus</v-icon>
              เพิ่มข้อมูล
            </v-btn>
          </v-col>
        </v-row>
        <v-row>

        <v-dialog v-model="dialogDeleteAccess" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">คุณแน่ใจที่จะลบรายการนี้ใช่หรือไม่</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn
                color="blue darken-1"
                text
                @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
          <!-- ADD -->
          <v-dialog v-model="dialogAdd" persistent max-width="600px" >
            <v-card class="pa-3">
              <v-form ref="form_add" v-model="validAdd" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-row justify="center">
                    <!-- ซ้าย -->
                    <!-- <v-col cols="6" class="text-center">
                      <center>
                      <v-col class="mt-16">
                      <v-img id="img_add" :src="require('@/assets/customImgAdd.png')"></v-img>
                      </v-col>
                      <v-col>
                      <v-img :src="require('@/assets/customtextAdd.svg')"></v-img>
                      </v-col>
                      </center>
                      <v-card-text v-if="formAdd.fieldType === 'optionField'">
                          <v-data-table
                            class="elevation-1 custom_table_class"
                            dense
                            :headers="columnsOption"
                            :items="dataItemOption"
                            hide-default-footer
                      >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                        color="#E91E63"
                          small
                          class="mr-2"
                          @click="editItemAdd(item)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                        color="#E91E63"
                          small
                          @click="deleteItemAdd(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                      </v-data-table>
                    </v-card-text>
                    </v-col> -->
                    <!-- ขวา -->
                      <v-col cols="12" class=" mt-1">
                        <v-col class="text-right">
                    <v-icon color="#173053" @click="(dialogAdd = false), clearData(), checkbox ='false'">mdi-close</v-icon>
                  </v-col>
                    <v-col class="text-center">
                      <!-- <v-img class="v_text_add" :src="require('@/assets/Grouptitle.svg')"></v-img> -->
                      <h3 class="font-weight-black">เพิ่มข้อมูล</h3>
                      </v-col>
                    <v-col cols="12" class="mb-3">
                      <!-- <v-row style="height: 35px">
                      <v-subheader >ชื่อช่องกรอกข้อมูล</v-subheader>
                      </v-row> -->
                      <v-row style="height: 50px">
                      <v-text-field
                        v-model="formAdd.fieldName"
                        label="ชื่อช่องกรอกข้อมูล"
                        dense
                        outlined
                        required
                        :rules="[
                          rules.required
                        ]"
                      ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col cols="12" class="mb-3">
                      <!-- <v-row style="height: 35px">
                      <v-subheader >ชื่อช่องกรอกข้อมูล ภาษาอังกฤษ</v-subheader>
                      </v-row> -->
                      <v-row style="height: 50px">
                      <v-text-field
                        v-model="formAdd.fieldNameEn"
                        label="ชื่อช่องกรอกข้อมูล ภาษาอังกฤษ"
                        outlined
                        dense
                        required
                        :rules="[
                          rules.required
                        ]"
                      ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col cols="12" class="mb-3">
                      <!-- <v-row style="height: 35px">
                      <v-subheader >ประเภทช่องกรอกข้อมูล</v-subheader>
                      </v-row> -->

                      <v-row style="height: 50px">
                        <v-select
                        v-model="formAdd.fieldType"
                        @change="chkAddoptionFieldType()"
                        :items="selectTypeField"
                        dense
                        outlined
                        label="ประเภทช่องกรอกข้อมูล"
                        value = 'text'
                        :rules="[rules.required]"
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-row>

                      <!-- <v-row style="height: 35px" v-if="formAdd.fieldType === 'optionField' && formAdd.fieldType !== ''">
                      <v-subheader >ประเภทของตัวเลือกข้อมูล</v-subheader>
                      </v-row> -->
                      <v-row style="height: 50px" v-if="formAdd.fieldType === 'optionField' && formAdd.fieldType !== ''">
                        <v-select
                        class="mt-3"
                        outlined
                        label="ประเภทของตัวเลือกข้อมูล"
                        v-model="formAdd.optionFieldType"
                        :items="selectOptionField"
                        small-chips
                        dense
                        :rules="[rules.required]"
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-form ref="form_addOption" v-model="validAddOption" lazy-validation>
                    <v-row class="mt-3 px-3">
                    <v-col class="ma-1">
                      <!-- <v-row style="height: 35px" v-if="formAdd.fieldType === 'optionField' && formAdd.fieldType !== ''">
                      <v-subheader  >ไทย:</v-subheader >
                      </v-row> -->
                      <v-row  v-if="formAdd.fieldType === 'optionField' && formAdd.fieldType !== ''">
                      <v-text-field
                        v-model="formAddOption.optionText"
                        label="ไทย"
                        dense
                        outlined
                        required
                        :rules="[
                          rules.required
                        ]"
                      ></v-text-field>
                      </v-row>
                    </v-col>
                     <v-col class="ma-1">
                      <!-- <v-row style="height: 35px" v-if="formAdd.fieldType === 'optionField' && formAdd.fieldType !== ''">
                      <v-subheader  >อังกฤษ:</v-subheader >
                      </v-row> -->
                      <v-row  v-if="formAdd.fieldType === 'optionField' && formAdd.fieldType !== ''">
                      <v-text-field
                        v-model="formAddOption.optionTextEng"
                        label="อังกฤษ"
                        outlined
                        dense
                        required
                        :rules="[
                          rules.required
                        ]"
                      ></v-text-field>
                      </v-row>
                    </v-col>
                     <v-col class="ma-1">
                      <!-- <v-row style="height: 35px" v-if="formAdd.fieldType === 'optionField' && formAdd.fieldType !== ''">
                      <v-subheader >Value:</v-subheader>
                      </v-row> -->
                      <v-row  v-if="formAdd.fieldType === 'optionField' && formAdd.fieldType !== ''">
                      <v-text-field
                        v-model="formAddOption.optionValue"
                        label="value"
                        dense
                        outlined
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                      </v-row>
                    </v-col>
                    </v-row>
                     </v-form>
                    <br>
                      <v-row class="mb-3" justify="center" v-if="formAddOption.optionText && formAddOption.optionValue && formAddOption.optionTextEng">
                        <v-btn v-if="checkDataEdit"
                        elevation="2"
                        dark
                        color="#173053"
                        :disabled="!validAddOption"
                        @click="addDataOption(formAddOption)"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        เพิ่ม
                      </v-btn>
                      <v-btn v-if="!checkDataEdit"
                        elevation="2"
                        dark
                        color="#173053"
                        :disabled="!validAddOption"
                        @click="saveAdd()"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        แก้ไข
                      </v-btn>
                      </v-row>
                      <v-card-text class="mt-3" v-if="formAdd.fieldType === 'optionField'">
                          <v-data-table
                            class="elevation-1 custom_table_class"
                            dense
                            :headers="columnsOption"
                            :items="dataItemOption"
                            hide-default-footer
                      >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                        color="#E91E63"
                          small
                          class="mr-2"
                          @click="editItemAdd(item)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                        color="#E91E63"
                          small
                          @click="deleteItemAdd(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                      </v-data-table>
                    </v-card-text>
                      <!-- checkbox -->
                     <div style="display: flex;justify-content: flex-start;flex-wrap: wrap;">
                      <v-checkbox
                          class="mr-3"
                          v-if="formAdd.fieldType !== 'Arguments'"
                          v-model="formAdd.requiredField"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          false-value="False"
                          true-value="True"
                          label="บังคับกรอก"
                        ></v-checkbox>
                      <v-checkbox
                          v-else
                          class="mr-3"
                          v-model="formAdd.requiredField"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          false-value="False"
                          true-value="True"
                          value="True"
                          readonly
                          label="บังคับกรอก"
                        ></v-checkbox>
                      <v-checkbox
                      class="mr-3"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          label="เงื่อนไข ช่องกรอกข้อมูล"
                          false-value="false"
                          true-value="true"
                          v-model="checkbox"
                        ></v-checkbox>
                      </div>
                      <!-- checkbox -->

                      <!-- <v-row style="height: 35px" v-if="checkbox === 'true'">
                      <v-subheader >ช่องกรอกข้อมูล</v-subheader>
                      </v-row> -->
                      <v-row style="height: 50px" v-if="checkbox === 'true'">
                        <v-select
                        class="mt-3 px-3"
                        v-model="formAdd.conditionField"
                        :items="selectConditionField"
                        dense
                        return-object
                        @change="formAdd.conditionValue = ''"
                        :rules="[rules.required]"
                        attach
                        outlined
                        label="ช่องกรอกข้อมูล"
                        :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-row>
                      <v-row style="height: 50px" v-if="formAdd.conditionField.fieldType === 'flow'" class="px-3 mt-6">
                        <v-select
                        v-model="branchByflowAdd"
                        :items="branch"
                        dense
                        outlined
                        label="สาขา"
                        :rules="[rules.required]"
                        attach
                        @change="logTest()"
                        ></v-select>
                      </v-row>
                      <!-- END -->
                      <!-- <v-row style="height: 35px" v-if="checkbox === 'true' && formAdd.conditionField">
                      <v-subheader >Value:</v-subheader>
                      </v-row> -->
                      <div  class="px-3 mt-3" v-if="formAdd.conditionField.fieldType === 'flow'">
                        <v-row  v-if="checkbox === 'true' && formAdd.conditionField &&
                      (formAdd.conditionField.fieldType === 'Selects' || formAdd.conditionField.fieldType === 'Radio' || formAdd.conditionField.fieldType === 'Autocompletes' || formAdd.conditionField.fieldType === 'flow')">
                      <v-select
                      v-if="branchByflowAdd !== ''"
                        v-model="formAdd.conditionValue"
                        outlined
                        label="value"
                        :items="JSON.parse(formAdd.conditionField.optionField).filter((ii) => branchByflowAdd === 'All' ? true : ii.masBranchID === branchByflowAdd )"
                        dense
                        required
                        :rules="[rules.required]"
                        attach
                        ></v-select>
                      </v-row>
                      </div>
                      <div v-else>
                        <v-row style="height: 50px" v-if="checkbox === 'true' && formAdd.conditionField &&
                      (formAdd.conditionField.fieldType === 'Selects' || formAdd.conditionField.fieldType === 'Radio' || formAdd.conditionField.fieldType === 'Autocompletes' || formAdd.conditionField.fieldType === 'flow')">
                      <v-select
                      class="mt-3 px-3"
                      label="value"
                        v-model="formAdd.conditionValue"
                        :items="JSON.parse(formAdd.conditionField.optionField)"
                        dense
                        required
                        outlined
                        :rules="[rules.required]"
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-row>
                      <v-row style="height: 50px" v-if="checkbox === 'true' && formAdd.conditionField &&
                      (formAdd.conditionField.fieldType === 'number' || formAdd.conditionField.fieldType === 'text' || formAdd.conditionField.fieldType === 'dateTime')">
                        <v-text-field
                        class="mt-3 px-3"
                          v-model="formAdd.conditionValue"
                          label="value"
                          dense
                          outlined
                          required
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-row>
                      </div>
                      <!-- END -->
                    </v-col>
                      <!-- END Radio buttun -->
                      <v-col cols="12">
                      <div class="text-center">
                      <v-btn
                        elevation="2"
                        dark
                        color="#173053"
                        :disabled="!validAdd"
                        @click="addData()"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        บันทึกข้อมูล
                      </v-btn>
                      </div>
                      </v-col>
                      <br>
                  </v-row>
                </v-container>
              </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- end add -->

          <!-- edit -->
          <v-dialog v-model="dialogEdit" persistent max-width="600px"  max-height="100%">
            <v-card class="pa-3">
              <v-form ref="form_update" v-model="validUpdate" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-col class="text-right">
                    <v-icon color="#173053" @click="(dialogEdit = false),checkbox ='false', clearDataFormUpDate()">mdi-close</v-icon>
                  </v-col>
                  <v-row justify="center">
                    <!-- <v-col cols="6" class="text-center">
                      <center>
                      <v-col class="mt-16">
                      <v-img :src="require('@/assets/imgEditCustom.svg')"></v-img>
                      </v-col>
                      <v-col>
                      <v-img :src="require('@/assets/customtextAdd.svg')"></v-img>
                      </v-col>
                      </center>
                      <v-card-text v-if="formUpdate.fieldType === 'optionField'">
                      <v-data-table
                        :headers="columnsOption"
                        :items="dataItemOption"
                      >
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-icon
                          color="#E91E63"
                            small
                            class="mr-2"
                            @click="editItem(item)"
                          >
                            mdi-pencil
                          </v-icon>
                          <v-icon
                          color="#E91E63"
                            small
                            @click="deleteItem(item)"
                          >
                            mdi-delete
                          </v-icon>
                        </template>
                      </v-data-table>
                    </v-card-text>
                    </v-col> -->

                    <v-col cols="12" class="v-margit_text_add mt-1">
                      <v-col class="text-center">
                      <!-- <v-img id="v_textEdit" :src="require('@/assets/GroupEditTitle.svg')"></v-img> -->
                      <h3 class="font-weight-black">แก้ไขข้อมูล</h3>
                      </v-col>
                    <v-col cols="12" class="mb-3">
                      <!-- <v-row style="height: 35px">
                      <v-subheader >ชื่อช่องกรอกข้อมูล</v-subheader>
                      </v-row> -->
                      <v-row style="height: 50px">
                      <v-text-field
                        v-model="formUpdate.fieldName"
                        label="ชื่อช่องกรอกข้อมูล"
                        dense
                        outlined
                        required
                        :rules="[
                          rules.required
                        ]"
                      ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col cols="12" class="mb-3">
                      <!-- <v-row style="height: 35px">
                      <v-subheader >ชื่อช่องกรอกข้อมูล ภาษาอังกฤษ</v-subheader>
                      </v-row> -->
                      <v-row style="height: 50px">
                      <v-text-field
                        v-model="formUpdate.fieldNameEn"
                        label="ชื่อช่องกรอกข้อมูล ภาษาอังกฤษ"
                        outlined
                        dense
                        required
                        :rules="[
                          rules.required
                        ]"
                      ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col cols="12" class="mb-3">
                      <!-- <v-row style="height: 35px">
                      <v-subheader >ประเภทช่องกรอกข้อมูล</v-subheader>
                      </v-row> -->

                      <v-row style="height: 50px" class="mb-2">
                        <v-select
                        outlined
                        label="ประเภทช่องกรอกข้อมูล"
                        v-model="formUpdate.fieldType"
                        :items="selectTypeField"
                        @change="chkUpdateoptionFieldType()"
                        dense
                        :rules="[rules.required]"
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-row>

                      <!-- <v-row style="height: 35px" v-if="formUpdate.fieldType === 'optionField'">
                      <v-subheader >ประเภทของตัวเลือกข้อมูล</v-subheader>
                      </v-row> -->
                      <v-row style="height: 50px" v-if="formUpdate.fieldType === 'optionField'" class="mb-2">
                        <v-select
                        outlined
                        label="ประเภทของตัวเลือกข้อมูล"
                        v-model="formUpdate.optionFieldType"
                        :items="selectOptionField"
                        @change="chkfieldType()"
                        small-chips
                        dense
                        :rules="[rules.required]"
                        attach
            :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-form ref="form_addOption" v-model="validAddOption" lazy-validation>
                    <v-row class="mt-3 px-3">
                    <v-col class="ma-1" >
                      <!-- <v-row style="height: 35px" v-if="formUpdate.fieldType === 'optionField'">
                      <v-subheader  >ไทย:</v-subheader >
                      </v-row> -->
                      <v-row style="height: 50px" v-if="formUpdate.fieldType === 'optionField'">
                      <v-text-field
                        outlined
                        v-model="formUpdateOption.optionText"
                        label="ไทย"
                        dense
                        required
                        :rules="[
                          rules.required
                        ]"
                      ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col class="ma-1">
                      <!-- <v-row style="height: 35px" v-if="formUpdate.fieldType === 'optionField'">
                      <v-subheader  >อังกฤษ:</v-subheader >
                      </v-row> -->
                      <v-row style="height: 50px" v-if="formUpdate.fieldType === 'optionField'">
                      <v-text-field
                        v-model="formUpdateOption.optionTextEng"
                        outlined
                        label="อังกฤษ"
                        dense
                        required
                        :rules="[
                          rules.required
                        ]"
                      ></v-text-field>
                      </v-row>
                    </v-col>
                     <v-col class="ma-1">
                      <!-- <v-row style="height: 35px" v-if="formUpdate.fieldType === 'optionField'">
                      <v-subheader >Value:</v-subheader>
                      </v-row> -->
                      <v-row style="height: 50px" v-if="formUpdate.fieldType === 'optionField'">
                      <v-text-field
                        v-model="formUpdateOption.optionValue"
                        outlined
                        label="value"
                        dense
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                      </v-row>
                    </v-col>
                    </v-row>
                     </v-form>
                    <br>

                    <v-row justify="center" v-if="formUpdate.fieldType === 'optionField'">
                      <v-btn v-if="checkDataEdit"
                        elevation="2"
                        dark
                        color="#173053"
                        :disabled="!validAddOption"
                        @click="addDataOption(formUpdateOption)"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        เพิ่ม
                      </v-btn>
                      <v-btn v-if="!checkDataEdit"
                        elevation="2"
                        dark
                        color="#173053"
                        :disabled="!validAddOption"
                        @click="save()"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        แก้ไข
                      </v-btn>
                      </v-row>
                      <v-card-text class="mt-5" v-if="formUpdate.fieldType === 'optionField'">
                      <v-data-table
                        :headers="columnsOption"
                        :items="dataItemOption"
                        class="elevation-1 custom_table_class"
                      >
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-icon
                          color="#E91E63"
                            small
                            class="mr-2"
                            @click="editItem(item)"
                          >
                            mdi-pencil
                          </v-icon>
                          <v-icon
                          color="#E91E63"
                            small
                            @click="deleteItem(item)"
                          >
                            mdi-delete
                          </v-icon>
                        </template>
                      </v-data-table>
                    </v-card-text>
                      <!-- checkbox -->
                     <div style="display: flex;justify-content: flex-start;flex-wrap: wrap;"
                      >
                      <v-checkbox
                          class="mr-3"
                          v-if="formUpdate.fieldType !== 'Arguments'"
                          label="บังคับกรอก"
                          false-value="False"
                          true-value="True"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          v-model="formUpdate.requiredField"
                        ></v-checkbox>
                        <v-checkbox
                          v-else
                          class="mr-3"
                          label="บังคับกรอก"
                          false-value="False"
                          true-value="True"
                          value="True"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          readonly
                          v-model="formUpdate.requiredField"
                        ></v-checkbox>
                       <v-checkbox
                       class="mr-3"
                          label="เงื่อนไข ช่องกรอกข้อมูล"
                          false-value="false"
                          true-value="true"
                          :on-icon="'mdi-check-circle'"
                          :off-icon="'mdi-checkbox-blank-circle-outline'"
                          v-model="checkbox"
                          @change="chkUpdateCondition()"
                        ></v-checkbox>
                      </div>
                      <!-- checkbox -->
                      <!-- <v-row style="height: 35px" v-if="checkbox === 'true'">
                      <v-subheader >ช่องกรอกข้อมูล</v-subheader>
                      </v-row> -->
                      <v-row style="height: 50px" v-if="checkbox === 'true'" class="px-3 mt-3">
                        <v-select
                        v-model="formUpdate.conditionField"
                        :items="selectConditionField"
                        dense
                        outlined
                        label="ช่องกรอกข้อมูล"
                        item-text="text"
                        item-value="value"
                        return-object
                        @change="formUpdate.conditionValue = '', formUpdateConditionField = formUpdate.conditionField"
                        :rules="[rules.required]"
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-row>
                      <v-row style="height: 50px" v-if="formUpdateConditionField.fieldType === 'flow'" class="px-3 mt-3">
                        <v-select
                        v-model="branchByflow"
                        :items="branch"
                        dense
                        outlined
                        label="สาขา"
                        item-text="text"
                        item-value="value"
                        :rules="[rules.required]"
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-row>
                      <!-- END -->
                      <!-- <v-row style="height: 35px" v-if="checkbox === 'true' && formUpdate.conditionField && formUpdateConditionField.fieldType !== 'Selects' ">
                      <v-subheader >Value:</v-subheader>
                      </v-row> -->
                      <div  class="px-3 mt-3" v-if="formUpdateConditionField.fieldType === 'flow'">
                        <v-row style="height: 50px" v-if="checkbox === 'true' && formUpdate.conditionField &&
                      (formUpdateConditionField.fieldType === 'Selects' || formUpdateConditionField.fieldType === 'Radio' || formUpdateConditionField.fieldType === 'Autocompletes' || formUpdateConditionField.fieldType === 'flow')">
                      <v-select
                        v-if="branchByflow !== ''"
                        v-model="formUpdate.conditionValue"
                        outlined
                        label="value"
                        :items="JSON.parse(formUpdateConditionField.optionField).filter((ii) => branchByflow === 'All' ? true : ii.masBranchID === branchByflow )"
                        dense
                        required
                        :rules="[rules.required]"
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-row>
                      </div>
                      <div class="px-3 mt-3" v-else>
                        <v-row style="height: 50px" v-if="checkbox === 'true' && formUpdate.conditionField &&
                      (formUpdateConditionField.fieldType === 'Selects' || formUpdateConditionField.fieldType === 'Radio' || formUpdateConditionField.fieldType === 'Autocompletes' || formUpdateConditionField.fieldType === 'flow')">
                      <v-select
                        v-model="formUpdate.conditionValue"
                        outlined
                        label="value"
                        :items="JSON.parse(formUpdateConditionField.optionField)"
                        dense
                        required
                        :rules="[rules.required]"
                        attach
                        :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                      </v-row>
                      <v-row class="px-3" style="height: 50px" v-if="checkbox === 'true' && formUpdateConditionField &&
                      (formUpdateConditionField.fieldType === 'number' || formUpdateConditionField.fieldType === 'text' || formUpdateConditionField.fieldType === 'dateTime')">
                        <v-text-field
                          v-model="formUpdate.conditionValue"
                          label="value"
                          outlined
                          dense
                          required
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-row>
                      </div>
                      <!-- <v-row style="height: 35px" v-if="checkbox == 'true'">
                      <v-subheader >Field</v-subheader>
                      </v-row>
                      <v-row style="height: 50px" v-if="checkbox == 'true'">
                        <v-select
                          v-model="formUpdate.conditionField"
                          :items="selectConditionField"
                          >
                          </v-select>
                      </v-row>
                        <v-row style="height: 35px" v-if="checkbox == 'true'">
                      <v-subheader >Value:</v-subheader>
                      </v-row>
                      <v-row style="height: 50px" v-if="checkbox == 'true'">
                      <v-text-field
                        v-model="formUpdate.conditionValue"
                        placeholder="Value"
                        dense
                      ></v-text-field>
                      </v-row> -->
                      <!-- END -->
                    </v-col>
                      <!-- END Radio buttun -->
                      <v-col>
                      <v-row justify="center" class="mt-3">
                      <v-btn
                         dark
                        elevation="2"
                        color="#173053"
                        :disabled="!validUpdate"
                         @click="editData()"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        บันทึก
                      </v-btn>
                      </v-row>
                      </v-col>
                  </v-row>
                </v-container>
                  <br>
              </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- end add -->

          <!-- delete -->
          <v-dialog v-model="dialogDelete" max-width="355px">
            <v-card>
              <br>
             <v-row class="mb-6" justify="center">
                <v-col md="auto">
                  <v-img :src="require('@/assets/GroupDelete.png')" class="a" style="width:55.05px;height:63px"></v-img>
                </v-col>
              </v-row>
              <v-col class="text-center">
                <span class="headline">ลบข้อมูลนี้</span>
              </v-col>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-row style="height: 35px">
                        <v-subheader >รหัส Filed</v-subheader>
                      </v-row>
                      <v-row style="height: 70px">
                        <v-text-field
                          v-model="formUpdate.fieldName"
                          readonly
                        ></v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-col class="text-center">
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  elevation="2"
                  x-large
                  color="#FD8087"
                  @click="deleteData()"
                >
                  <v-icon left>mdi-checkbox-marked-circle</v-icon>
                  ลบ
                </v-btn>
                <v-btn
                  dark
                  elevation="2"
                  x-large
                  color="#1B437C"
                  @click="dialogDelete = false"
                >
                  <v-icon left> mdi-cancel</v-icon>
                  ยกเลิก
                </v-btn>
              </v-col>
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
                  label="ค้นหาข้อมูล"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="columns"
                  :items="dataItem"
                  :search="searchAll2"
                  :items-per-page="50"
                >
                <template v-slot:[`item.shett`]="{ item }">
                    <v-select
                        v-model="item.optionField"
                        :items="item.optionField"
                        dense
                        attach
            :menu-props="{ bottom: true, offsetY: true }"
                        ></v-select>
                  </template>
                   <template v-slot:[`item.CREATE_DATE`]="{ item }">
                      {{ format_dateNotime(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                      {{ format_dateNotime(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.actions2`]="{ item, index }">
                      <v-btn
                        v-show="index !== 0"
                        color="173053"
                        fab
                        small
                        outlined
                        @click="actionUp(item.fieldId)"
                      >
                        <v-icon color="#173053">
                          mdi-chevron-up
                        </v-icon>
                      </v-btn>
                      <v-btn
                        v-show="index !== dataItem.length-1"
                        color="173053"
                        fab
                        small
                        outlined
                        @click="actionDown(item.fieldId)"
                      >
                        <v-icon color="#173053">
                          mdi-chevron-down
                        </v-icon>
                      </v-btn>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      color="#1B437C"
                      fab
                      dark
                      small
                      v-if="item.fieldName !== 'ชื่อ' && item.fieldName !== 'เลขทะเบียน' && item.fieldName !== 'เบอร์โทร'"
                      @click.stop="getDataById(item), validate('UPDATE'), validate('ADDOPTION'), (dialogEdit = true)"
                    >
                      <v-icon> mdi-tools </v-icon>
                    </v-btn>
                    <v-btn
                      color="red"
                      dark
                      fab
                      small
                      v-if="item.fieldName !== 'ชื่อ' && item.fieldName !== 'เลขทะเบียน' && item.fieldName !== 'เบอร์โทร'"
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
        <v-dialog v-model="dialogwarn" max-width="370px" persistent >
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
              รายการที่จำเป็นเมื่อเพิ่มช่องกรอกข้อมูล</h4>
          </div>
          <div class="text-left ma-0 ml-3" v-for="(item , index) in warnText" :key="index">
            <h6 class="font-weight-medium">{{(index + 1) + '. ' + item.text}}
              <v-btn
                class="mx-2"
                dark
                small
                color="primary"
                @click="getDialogEdit()"
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
      <BookingField v-show="showEdit" ref="dialogBookingField"></BookingField>
        </div>
    </v-main>
  </div>
</template>
<script>
import waitingAlert from '../waitingAlert.vue'
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import BookingField from '../Master/BookingField.vue'
// import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
// import XLSX from 'xlsx' // import xlsx
// import readXlsxFile from 'read-excel-file'
// import moment from 'moment' // แปลง date

export default {
  components: {
    waitingAlert,
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    BookingField
    // downloadExcel: JsonExcel,
    // XLSX,
    // readXlsxFile
  },
  created () {
    // setInterval(this.getNowGlobal, 1000)
  },
  data () {
    return {
      showEdit: false,
      dialogwarn: false,
      checkboxwarn: false,
      warnText: [],
      PK: '',
      path: '/customField/', // Path Model
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'ข้อมูลลงทะเบียนลูกค้า',
          disabled: false,
          href: '/Master/CustomField'
        }
      ],
      fieldTypeSelect: ' ',
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 0
      },
      selectTypeField: [
        { text: 'Text', value: 'text' },
        { text: 'Number', value: 'number' },
        { text: 'Arguments', value: 'Arguments' },
        { text: 'Datetime', value: 'dateTime' },
        { text: 'optionField', value: 'optionField' }
      ],
      selectOptionField: [
        { text: 'Autocompletes', value: 'Autocompletes' },
        { text: 'Selects', value: 'Selects' },
        { text: 'Radio buttons', value: 'Radio' }
      ],
      selectEditOptionField: [
        { text: 'Text', value: 'text' },
        { text: 'Number', value: 'number' },
        { text: 'Datetime', value: 'dateTime' },
        { text: 'Autocompletes', value: 'Autocompletes' },
        { text: 'Selects', value: 'Selects' },
        { text: 'Radio buttons', value: 'Radio' }
      ],
      headers: [
        { text: 'Text', value: 'optionText' },
        { text: 'Value', value: 'optionValue' }
      ],
      dialogDeleteF: false,
      editedItemSelete: [],
      // End Menu Config
      dataReady: true,
      canvas: true,
      dateTime: '', // Generate DateTime
      date: this.momenDate_1(new Date()),
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      // Dialog Config ADD EDIT DELETE IMPORT
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogImport: false,
      dialogAddField: false,
      dialogDeleteAccess: false,
      // END Dialog Config ADD EDIT DELETE
      panel: [0],
      panel1: [1],
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      column: null,
      radios: null,
      checkbox: 'false',
      // Search All
      searchAll: '',
      searchAll2: '',
      formAdd: {
        fieldName: '',
        fieldNameEn: '',
        fieldType: '',
        optionFieldType: '',
        CREATE_USER: '',
        LAST_USER: '',
        optionField: [],
        optionText: '',
        optionValue: '',
        conditionField: '',
        conditionValue: '',
        showCard: 'False',
        requiredField: 'False',
        sortNoField: '',
        shopId: this.$session.getAll().data.shopId
      },
      formUpdate: {
        fieldId: '',
        fieldName: '',
        fieldNameEn: '',
        fieldType: '',
        optionFieldType: '',
        LAST_USER: '',
        optionField: [],
        optionText: '',
        optionValue: '',
        conditionField: '',
        conditionValue: '',
        shopId: '',
        requiredField: '',
        sortNoField: ''
      },
      formUpdateConditionField: '',
      formAddOption: {
        optionText: '',
        optionTextEng: '',
        optionValue: '',
        shopId: ''
      },
      formUpdateOption: {
        optionText: '',
        optionTextEng: '',
        optionValue: '',
        shopId: ''
      },
      desserts: [],
      editedItemOption: [],
      items: [
        { text: 'required field', value: 'true' },
        { text: 'No required field', value: 'false' }
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
        counterIDcard: value => value.length <= 13 || 'Max 13 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      // End Form Config ADD EDIT
      // Data Table Config
      columns: [
        // { text: 'ID', value: 'fieldId' },
        { text: 'ชื่อช่องกรอกข้อมูล', value: 'fieldName', align: 'center' },
        { text: 'ชื่อช่องกรอกข้อมูล ภาษาอังกฤษ', value: 'fieldNameEn', align: 'center' },
        { text: 'ประเภท Field', value: 'fieldType', align: 'center' },
        { text: ' ', value: 'actions2', sortable: false, align: 'center' },
        { text: 'Action', value: 'action', sortable: false, align: 'center' }
      ],
      dataItem: [],
      editedItem: {
        text: '',
        value: ''
      },
      defaultItem: {
        text: '',
        value: ''
      },
      editedIndex: -1,
      columnsOption: [
        { text: 'ไทย', value: 'text' },
        { text: 'อังกฤษ', value: 'textEng' },
        { text: 'Value', value: 'value' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      DataFlowName: [],
      dataItemOption: [],
      optionFieldItem: [],
      selectConditionField: [],
      validAdd: true,
      validAddOption: true,
      validUpdate: true,
      filesAdd: null,
      filesUpdate: null,
      dialogNewAccess: false,
      checkDataEdit: true,
      checkConditionField: true,
      branch: [],
      branchByflow: '',
      branchByflowAdd: ''
      // End Data Table Config
    }
  },
  watch: {
    dialogNewAccess (val) {
      val || this.close()
    },
    dialogDeleteAccess (val) {
      val || this.closeDelete()
    }
  },
  async mounted () {
    // this.getGetToken(this.DNS_IP)
    this.dataReady = false
    // Get Data
    // this.getOption()
    await this.getDataFlow()
    await this.getDataBranch()
    await this.getCondition()
    this.getDataGlobal(this.DNS_IP, this.path, this.$session.getAll().data.shopId)
  },
  methods: {
    logTest () {
      console.log('logTest', this.branchByflowAdd)
    },
    getDialogEdit () {
      this.$refs.dialogBookingField.editDataByBookingField('test')
    },
    async updateWarn () {
      let dataitem = {
        'warningCustomfield': this.checkboxwarn
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
      this.$router.push(item)
      console.log(item)
    },
    async warningFlow () {
      let checkData = null
      await axios
        .get(this.DNS_IP + '/system_user/getID?userId=' + this.session.data.userId)
        .then(async (response) => {
          checkData = response
          console.log('response : ', checkData.data.warningCustomfield)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
      if (checkData.data.warningCustomfield === 'True') {

      } else {
        this.dialogwarn = true
        let text = [
          {
            'text': 'เลือกข้อมูลที่ต้องการแสดงในหน้านัดหมาย',
            'buttonLink': '/Master/BookingField'
          }
        ]
        this.warnText = text
      }
    },
    async getDataFlow () {
      this.DataFlowName = []
      console.log('DataFlowName', this.DataFlowName)
      await axios
        .get(this.DNS_IP + '/flow/get?shopId=' + this.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.text = d.flowName
              d.value = d.flowId
              this.DataFlowName.push(d)
            }
          } else {
            this.DataFlowName = []
          }
        })
    },
    async actionUp (fieldId) {
      console.log('fieldId', fieldId)
      console.log('dataItem', this.dataItem)
      let sortItem = this.dataItem
      this.dataItem = []
      let index = sortItem.findIndex(e => e.fieldId === fieldId)
      console.log('index', index)
      if (index !== -1 && index < sortItem.length + 1) {
        let el = sortItem[index]
        console.log('*****', el)
        this.dataItem[index] = sortItem[index - 1]
        this.dataItem[index - 1] = el
        this.dataItem[index].sortNoField = sortItem[index - 1].sortNoField + 1
        this.dataItem[index - 1].sortNoField = el.sortNoField - 1
        console.log('sortNoField', this.dataItem[index - 1].sortNoField)
        console.log('el', el)
        console.log('movedown', this.dataItem)
      }
      await this.updateAction(this.dataItem, sortItem[0])
      console.log('dataItme', this.dataItem)
    },
    async actionDown (fieldId) {
      console.log('fieldId', fieldId)
      console.log('dataItem', this.dataItem)
      let sortItem = this.dataItem
      this.dataItem = []
      let index = sortItem.findIndex(e => e.fieldId === fieldId)
      console.log('index', index)
      if (index !== -1 && index < sortItem.length - 1) {
        let el = sortItem[index]
        console.log('*****', el)
        this.dataItem[index] = sortItem[index + 1]
        this.dataItem[index + 1] = el
        this.dataItem[index].sortNoField = sortItem[index + 1].sortNoField - 1
        this.dataItem[index + 1].sortNoField = el.sortNoField + 1
        console.log('sortNoField', this.dataItem[index + 1].sortNoField)
        console.log('el', el)
        console.log('movedown', this.dataItem)
      }
      await this.updateAction(this.dataItem, sortItem[0])
      console.log('dataItme', this.dataItem)
    },
    async updateAction (dt) {
      console.log('dt', dt)

      var newArray = dt.filter(val => val)
      console.log('newArray', newArray)
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/customField/" + "updateAction",
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
          await this.getDataGlobal(this.DNS_IP, this.path, this.$session.getAll().data.shopId)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log('error function addDataGlobal : ', error)
          this.dataReady = true
        })
    },
    chkOptionFieldItem (itemOp) {
      console.log('item', itemOp)
      console.log('fieldType', this.checkConditionField)
      if (this.formAdd.fieldType === 'text' || this.formAdd.fieldType === 'number' || this.formAdd.fieldType === 'dateTime') {
        this.checkConditionField = false
      }
      console.log('getOptionField', this.dataItemOption)
      // this.dataItemOption = JSON.parse(itemOp.optionField)
      this.formAdd.conditionValue = this.dataItemOption
      if (itemOp.fieldType === 'Selects') {
        this.formAdd.conditionValue.push(itemOp.optionValue)
      }
      // this.formUpdate.conditionField = this.selectConditionField.filter((row) => {
      //   return row.value === parseInt(itemOp.conditionField)
      // })[0].value
    },
    chkAddoptionFieldType () {
      if (this.formAdd.fieldType === 'text' || this.formAdd.fieldType === 'number' || this.formAdd.fieldType === 'dateTime') {
        this.formAdd.optionFieldType = ''
      } else {
        this.formAdd.optionFieldType = this.formAdd.optionFieldType
      }
    },
    chkUpdateoptionFieldType () {
      if (this.formUpdate.fieldType === 'text' || this.formUpdate.fieldType === 'number' || this.formUpdate.fieldType === 'dateTime' || this.formUpdate.fieldType === 'Arguments') {
        this.formUpdate.optionFieldType = ''
      } else {
        this.formUpdate.optionFieldType = this.formUpdate.optionFieldType
      }
    },
    chkUpdateCondition () {
      if (this.checkbox === 'false') {
        this.formUpdate.conditionField = ''
        this.formUpdate.conditionValue = ''
      }
    },
    chkfieldType () {
      console.log('fieldType', this.formUpdate.fieldType)
      if (this.formUpdate.optionFieldType === 'text' || this.formUpdate.optionFieldType === 'number' || this.formUpdate.optionFieldType === 'dateTime') {
        this.formUpdate.fieldType = this.formUpdate.optionFieldType
      } else {
        this.formUpdate.fieldType = 'optionField'
      }
    },
    deleteItem (item) {
      this.editedIndex = this.dataItemOption.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDeleteAccess = true
    },
    deleteItemConfirm () {
      this.dataItemOption.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    close () {
      console.log(this.checkDataEdit)
      this.$nextTick(() => {
        this.formUpdateOption.optionText = ''
        this.formUpdateOption.optionTextEng = ''
        this.formUpdateOption.optionValue = ''
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDeleteAccess = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.$refs.form_addOption.validate()) {
        console.log('IF')
        console.log(this.formUpdateOption.optionText)
        console.log(this.formUpdateOption.optionTextEng)
        console.log(this.formUpdateOption.optionValue)
        if (this.editedIndex > -1) {
          Object.assign(this.dataItemOption[this.editedIndex], {text: this.formUpdateOption.optionText, textEng: this.formUpdateOption.optionTextEng, value: this.formUpdateOption.optionValue})
        } else {
          this.dataItemOption.push({text: this.formUpdateOption.optionText, textEng: this.formUpdateOption.optionTextEng, value: this.formUpdateOption.optionValue})
        }
        this.checkDataEdit = true
        this.close()
      }
    },
    editItem (item) {
      this.checkDataEdit = false
      this.formUpdateOption.optionText = item.text
      this.formUpdateOption.optionTextEng = item.textEng
      this.formUpdateOption.optionValue = item.value
      this.editedIndex = this.dataItemOption.indexOf(item)
      // this.editedItem = Object.assign({}, item)
      // this.dialogNewAccess = true
    },
    editItemAdd (item) {
      this.checkDataEdit = false
      this.formAddOption.optionText = item.text
      this.formAddOption.optionTextEng = item.textEng
      this.formAddOption.optionValue = item.value
      this.editedIndex = this.dataItemOption.indexOf(item)
      // this.editedItem = Object.assign({}, item)
      // this.dialogNewAccess = true
    },
    deleteItemAdd (item) {
      this.editedIndex = this.dataItemOption.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDeleteAccess = true
    },
    deleteItemConfirmAdd () {
      this.dataItemOption.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    closeAdd () {
      console.log(this.checkDataEdit)
      this.$nextTick(() => {
        this.formAddOption.optionText = ''
        this.formAddOption.optionValue = ''
        this.formAddOption.optionTextEng = ''
        this.editedIndex = -1
      })
    },
    closeDeleteAdd () {
      this.dialogDeleteAccess = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    saveAdd () {
      console.log('form_addOption', this.$refs.form_addOption.validate())
      if (this.$refs.form_addOption.validate()) {
        console.log(this.formAddOption.optionText)
        console.log(this.formAddOption.optionTextEng)
        console.log(this.formAddOption.optionValue)
        if (this.editedIndex > -1) {
          Object.assign(this.dataItemOption[this.editedIndex], {text: this.formAddOption.optionText, textEng: this.formAddOption.optionTextEng, value: this.formAddOption.optionValue})
        } else {
          this.dataItemOption.push({text: this.formAddOption.optionText, textEng: this.formAddOption.optionTextEng, value: this.formAddOption.optionValue})
        }
        this.checkDataEdit = true
        this.close()
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
        case 'ADDOPTION':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_addOption.validate()
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
    async autobranch (item) {
      if (item !== '') {
        let checkBranchByFlow = null
        if (this.DataFlowName.filter((ii) => ii.flowId.toString() === item).length > 0) {
          checkBranchByFlow = this.DataFlowName.filter((ii) => ii.flowId.toString() === item)[0].masBranchID
        }
        console.log('checkBranchByFlow', checkBranchByFlow)
        if (checkBranchByFlow !== null && checkBranchByFlow !== 'All') {
          this.branchByflow = this.DataFlowName.filter((ii) => ii.flowId.toString() === item)[0].masBranchID
          console.log('IF', this.DataFlowName.filter((ii) => ii.flowId.toString() === item)[0].masBranchID)
        } else {
          console.log('Else')
          this.branchByflow = 'All'
        }
      }
    },
    async getDataById (item) {
      console.log('conditionField', item.conditionField)
      console.log('item', item)
      this.dataItemOption = JSON.parse(item.optionField)
      this.formUpdate.fieldId = item.fieldId
      if (item.conditionField === '' || item.conditionField === null) {
        this.checkbox = 'false'
        this.formUpdate.conditionField = ''
        this.formUpdate.conditionValue = ''
      } else {
        this.checkbox = 'true'
        if (item.conditionField === 'flow') {
          var value1 = this.selectConditionField.filter((row) => {
            return row.value === 'flow'
          })[0]
          // console.log('vauler', this.DataFlowName.filter((ii) => ii.flowId.toString() === item.conditionValue)[0].masBranchID)
          await this.autobranch(item.conditionValue)
          console.log('1')
          this.formUpdateConditionField = value1
          this.formUpdate.conditionField = value1.value
          this.formUpdate.conditionValue = item.conditionValue
          console.log('2')
        } else {
          var value2 = this.selectConditionField.filter((row) => {
            return row.value === parseInt(item.conditionField)
          })[0]
          this.formUpdateConditionField = value2
          this.formUpdate.conditionField = value2.value
          this.formUpdate.conditionValue = item.conditionValue
          // if (this.selectConditionField.filter((row) => { return row.value === parseInt(item.conditionField) })[0].fieldType === 'Selects' ||
          // this.selectConditionField.filter((row) => { return row.value === parseInt(item.conditionField) })[0].fieldType === 'Radio' ||
          // this.selectConditionField.filter((row) => { return row.value === parseInt(item.conditionField) })[0].fieldType === 'Autocompletes') {
          //   this.formUpdate.conditionValue =
          // } else {
          //   this.formUpdate.conditionValue = item.conditionValue
          // }
        }
      }
      console.log('conditionField', this.formUpdate.conditionField)
      this.formUpdate.optionField = []
      await this.dbGetDataById(item)
    },
    async dbGetDataById (item) {
      console.log('item', item)
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + this.path + "getID?fieldId" + "=" + item.fieldId + '&shopId=' + this.shopId
        )
        .then(async (response) => {
          console.log('getOptionField 777888: ', this.dataItemOption)
          if (response.data) {
            // Object.assign(this.formUpdate, response.data)
            this.formUpdate = response.data
            this.formUpdate.optionField = this.dataItemOption
            if (item.fieldType === 'Selects' || item.fieldType === 'Radio' || item.fieldType === 'Autocompletes') {
              this.formUpdate.fieldType = 'optionField'
            }
            if (this.formUpdate.conditionField !== '') {
              if (item.conditionField === 'flow') {
                this.formUpdate.conditionValue = parseInt(this.formUpdate.conditionValue)
              } else {
                this.formUpdate.conditionField = parseInt(this.formUpdate.conditionField)
                this.formUpdate.conditionValue = item.conditionValue
              }
            }
            console.log('this.formUpdate.conditionValue', this.formUpdate.conditionValue)
            this.formUpdate.optionFieldType = item.fieldType
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          this.dataReady = true
          console.log(error)
        })
    },
    async addDataOption (item) {
      if (this.$refs.form_addOption.validate()) {
        console.log(item)
        this.dataItemOption.push({'text': item.optionText, 'textEng': item.optionTextEng, 'value': item.optionValue})
        this.clearDataOption()
      }
    },
    async selectBranch () {

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
    getCondition () {
      this.selectConditionField = []
      axios.get(this.DNS_IP + '/customField/get?shopId=' + this.shopId).then((response) => {
        let rs = response.data
        if (rs.length > 0) {
          console.log('getCondition', rs)
          console.log('this.DataFlowName', this.DataFlowName)

          this.selectConditionField.push({text: 'ประเภทบริการ', value: 'flow', fieldType: 'flow', optionField: JSON.stringify(this.DataFlowName)})
          for (var i = 0; i < rs.length; i++) {
            var d = rs[i]
            if (d.fieldType !== 'Arguments') {
              d.text = d.fieldName
              d.value = d.fieldId
              this.selectConditionField.push(d)
            }
          }
        }
      })
    },
    async addData () {
      this.dataReady = false

      this.formAdd.CREATE_USER = this.session.data.userName
      this.formAdd.LAST_USER = this.session.data.userName
      if (this.formAdd.fieldType === 'optionField') {
        this.formAdd.optionField = JSON.stringify(this.dataItemOption)
      }
      this.formAdd.sortNoField = this.dataItem.length + 1
      if (this.formAdd.optionFieldType === 'Autocompletes' || this.formAdd.optionFieldType === 'Selects' || this.formAdd.optionFieldType === 'Radio') {
        this.formAdd.fieldType = this.formAdd.optionFieldType
      } else {
        this.formAdd.optionField = '[]'
      }
      console.log('formAdd', this.formAdd)
      this.add()
    },
    async add () {
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
          this.formAdd.shopId = this.$session.getAll().data.shopId
          if (this.checkbox === 'true') {
            this.formAdd.conditionField = this.formAdd.conditionField.value
          } else {
            this.formAdd.conditionField = ''
            this.formAdd.conditionValue = ''
          }
          console.log('formAdd', this.formAdd)
          delete this.formAdd['optionFieldType']
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
              console.log('addDataGlobal DNS_IP + PATH + "add"', response)
              // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              this.dialogAdd = false

              // Load Data
              await this.clearData()
              await this.getDataGlobal(this.DNS_IP, this.path, this.$session.getAll().data.shopId)
              await this.warningFlow()
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
      // this.editDataGlobal(this.DNS_IP, this.path, this.PK, this.formUpdateItem)
      console.log('dataItemOption', JSON.stringify(this.dataItemOption))
      console.log('formUpdate', this.formUpdate)
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
          this.formUpdate.LAST_USER = this.session.data.userName
          if (this.formUpdate.fieldType === 'optionField') {
            this.formUpdate.optionField = JSON.stringify(this.dataItemOption)
          }
          if (this.formUpdate.optionFieldType === 'Autocompletes' || this.formUpdate.optionFieldType === 'Selects' || this.formUpdate.optionFieldType === 'Radio') {
            this.formUpdate.fieldType = this.formUpdate.optionFieldType
          } else {
            this.formUpdate.optionField = '[]'
          }
          if (this.checkbox === 'true') {
            this.formUpdate.conditionField = this.formUpdateConditionField.value
          } else {
            this.formUpdate.conditionField = ''
            this.formUpdate.conditionValue = ''
          }
          var ID = this.formUpdate.fieldId
          delete this.formUpdate['fieldId']
          delete this.formUpdate['LAST_DATE']
          delete this.formUpdate['CREATE_DATE']
          delete this.formUpdate['optionFieldType']
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + this.path + "edit/" + ID,
              this.formUpdate
            )
            .then(async (response) => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)

              // this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
              // Close Dialog
              this.dialogEdit = false

              // Load Data
              // await this.reloadData()
              await this.getDataGlobal(this.DNS_IP, this.path, this.session.data.shopId)
              this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
            })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              this.dataReady = true
              console.log('error function editDataGlobal-1 : ', error)
            })
        })
        .catch((error) => {
          this.dataReady = true
          console.log('error function editDataGlobal-2 : ', error)
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
        .then(async (result) => {
          this.formUpdate.LAST_USER = this.session.data.userName
          var ID = this.formUpdate.fieldId
          delete this.formUpdate['fieldId']
          delete this.formUpdate['LAST_DATE']
          delete this.formUpdate['CREATE_DATE']
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + this.path + "delete/" + ID,
              this.formUpdate
            )
            .then(async (response) => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
              this.dialogDelete = false
              await this.getDataGlobal(this.DNS_IP, this.path, this.session.data.shopId)
              this.$swal('เรียบร้อย', 'ลบข้อมูล เรียบร้อย', 'success')
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
    async clearData () {
      // eslint-disable-next-line no-redeclare
      this.dataItemOption = []
      this.checkbox = 'false'
      for (var key in this.formAdd) {
        if (this.formAdd[key]) {
          this.formAdd[key] = ''
        }
      }
    },
    async clearDataOption () {
      for (var key in this.formAddOption) {
        if (this.formAddOption[key]) {
          this.formAddOption[key] = ''
        }
      }
    },
    async clearDataFormUpdateOption () {
      for (var key in this.formUpdateOption) {
        if (this.formUpdateOption[key]) {
          this.formUpdateOption[key] = ''
          this.dataItemOption = ''
        }
      }
    },
    async clearDataFormUpDate () {
      this.formUpdateConditionField = ''
      this.dataItemOption = ''
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
#margin {
  margin-top: 150px;
  margin-bottom: 40px;
}
#img_add {
  height: 343px;
  width: 398.8671875px;
  border-radius: 0px;

}
#v_textEdit {
  height: 43px;
  width: 198px;
}
.v_text_edit {
  Width: 255px;
  Height: 52px;
}
.subtextSize {
  font-size: 20;
}
</style>
