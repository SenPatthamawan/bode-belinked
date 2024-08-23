<template>
  <span id="ModelBookingList">
    <v-btn
      class="bottomAdd"
      style="margin-right: 0px;border-radius: 15px;color: white;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
      @click="addDataSet()"
      x-large
    >
      เพิ่มรายการนัดหมาย
      <v-icon color="white" class="ml-4">mdi-plus-circle</v-icon>
    </v-btn>

    <v-dialog v-model="dialogAdd" class="pa-2" max-width="600" persistent>
      <v-card class="text-center">
        <v-form ref="form_add" v-model="validAdd" lazy-validation>
          <v-card-text>
            <v-row justify="center">
              <v-col cols="12" class="p-5">
                <v-row>
                  <v-col cols="8" class="text-left pt-10">
                    <h3><strong>เพิ่มรายการนัดหมาย</strong></h3>
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
                        @click="(dialogAdd = false), clearDataAdd()"
                      >
                        X
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-col cols="12">
                  <v-checkbox
                    v-if="
                      $session.getAll().data.shopId !==
                        'U52928fc4d2ed0bb777f7c1d1c95d6173'
                    "
                    v-model="statusVIP"
                    label="เปิดจองคิวซ้ำได้"
                    false-value="False"
                    true-value="True"
                    :on-icon="'mdi-check-circle'"
                    :off-icon="'mdi-checkbox-blank-circle-outline'"
                  ></v-checkbox>
                  <v-select
                    v-model="formAdd.masBranchID"
                    :items="branch"
                    label="สาขา"
                    outlined
                    dense
                    required
                    :rules="[rules.required]"
                    @change="
                      (priceMenuAdd = 0),
                        (drawerAdd = false),
                        (showMenu = 'False'),
                        setFlowByBranchAdd(),
                        getEmpSelectAdd(),
                        checkEmp()
                    "
                  ></v-select>
                  <v-select
                    v-if="
                      formAdd.masBranchID !== null && formAdd.masBranchID !== ''
                    "
                    v-model="formAdd.flowId"
                    :items="dataFlowSelectAdd"
                    label="ประเภทบริการ"
                    outlined
                    dense
                    required
                    @change="fnChangeDate(), setLimitBooking(date)"
                    :rules="[rules.required]"
                  ></v-select>
                  <template v-if="fieldNameItem">
                    <div v-for="(item, index) in fieldNameItem" :key="index">
                      <template
                        v-if="
                          item.conditionField === '' ||
                            item.conditionField === null
                        "
                      >
                        <div
                          cols="12"
                          class="InputData"
                          v-if="item.fieldType == 'text'"
                        >
                          <v-text-field
                            v-if="item.fieldName === 'เบอร์โทร'"
                            v-mask="'###-###-####'"
                            v-model="item.fieldValue"
                            :label="item.fieldName"
                            outlined
                            dense
                            required
                            :rules="
                              item.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                          ></v-text-field>
                          <v-text-field
                            v-else
                            v-model="item.fieldValue"
                            :label="item.fieldName"
                            outlined
                            dense
                            required
                            :rules="
                              item.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                          ></v-text-field>
                        </div>
                        <div
                          cols="12"
                          class="InputData"
                          v-if="item.fieldType == 'number'"
                        >
                          <v-text-field
                            v-if="item.fieldName === 'เบอร์โทร'"
                            v-mask="'###-###-####'"
                            v-model="item.fieldValue"
                            :label="item.fieldName"
                            outlined
                            dense
                            required
                            :rules="
                              item.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                          ></v-text-field>
                          <v-text-field
                            v-else
                            v-model="item.fieldValue"
                            :label="item.fieldName"
                            outlined
                            dense
                            required
                            :rules="
                              item.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                          ></v-text-field>
                        </div>
                        <v-col
                          cols="12"
                          class="InputData"
                          v-if="item.fieldType == 'dateTime'"
                        >
                          <v-menu
                            v-model="menuAdd1"
                            :close-on-content-click="false"
                            :return-value.sync="date"
                            :rules="[rules.required]"
                            transition="scale-transition"
                            offset-y
                            required
                            min-width="auto"
                            ref="menuAdd1"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="item.fieldValue"
                                readonly
                                :label="item.fieldName"
                                outlined
                                dense
                                v-bind="attrs"
                                v-on="on"
                                required
                                prepend-inner-icon="mdi-calendar"
                                :rules="
                                  item.requiredField === 'True'
                                    ? [rules.required]
                                    : [true]
                                "
                              >
                              </v-text-field>
                            </template>
                            <v-date-picker
                              v-model="item.fieldValue"
                              no-title
                              scrollable
                              @input="
                                (menuAdd1 = false),
                                  $refs.menuAdd1.save(item.fieldValue)
                              "
                            >
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col
                          cols="12"
                          class="InputData"
                          v-if="item.fieldType == 'Autocompletes'"
                        >
                          <v-autocomplete
                            v-model="item.fieldValue"
                            :items="JSON.parse(item.optionField)"
                            outlined
                            :label="item.fieldName"
                            required
                            dense
                            :rules="
                              item.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          class="InputData"
                          v-if="item.fieldType == 'Selects'"
                        >
                          <v-select
                            class="mb-6"
                            v-model="item.fieldValue"
                            :items="JSON.parse(item.optionField)"
                            menu-props="auto"
                            :label="item.fieldName"
                            clearable
                            required
                            :rules="
                              item.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                            dense
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col
                          cols="12"
                          class="InputData"
                          v-if="item.fieldType == 'Radio'"
                          style="padding:0px;"
                        >
                          <v-container fluid style="padding:0px;">
                            <v-radio-group
                              column
                              dense
                              v-model="item.fieldValue"
                              style="margin:0px;"
                            >
                              <template v-slot:label> </template>
                              <div
                                v-for="radios in JSON.parse(item.optionField)"
                                :key="radios.toISOString"
                              >
                                <v-radio
                                  :label="radios.text"
                                  dense
                                  :value="radios.value"
                                ></v-radio>
                              </div>
                            </v-radio-group>
                          </v-container>
                        </v-col>
                      </template>
                      <template
                        v-if="
                          item.conditionField !== '' &&
                            fieldNameItem.filter(row => {
                              return (
                                row.fieldId === parseInt(item.conditionField)
                              );
                            }).length > 0
                        "
                      >
                        <template
                          v-if="
                            item.conditionValue ===
                              fieldNameItem.filter(row => {
                                return (
                                  row.fieldId === parseInt(item.conditionField)
                                );
                              })[0].fieldValue
                          "
                        >
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'text'"
                          >
                            <v-text-field
                              v-if="item.fieldName === 'เบอร์โทร'"
                              v-mask="'###-###-####'"
                              v-model="item.fieldValue"
                              :label="item.fieldName"
                              outlined
                              required
                              dense
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            ></v-text-field>
                            <v-text-field
                              v-else
                              v-model="item.fieldValue"
                              :label="item.fieldName"
                              outlined
                              required
                              dense
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'number'"
                          >
                            <v-text-field
                              v-if="item.fieldName === 'เบอร์โทร'"
                              v-mask="'###-###-####'"
                              v-model="item.fieldValue"
                              :label="item.fieldName"
                              outlined
                              required
                              dense
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            ></v-text-field>
                            <v-text-field
                              v-else
                              v-model="item.fieldValue"
                              :label="item.fieldName"
                              outlined
                              required
                              dense
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'dateTime'"
                          >
                            <v-menu
                              v-model="menuAdd2"
                              :close-on-content-click="false"
                              :return-value.sync="date"
                              :rules="[rules.required]"
                              transition="scale-transition"
                              offset-y
                              required
                              min-width="auto"
                              ref="menuAdd2"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="item.fieldValue"
                                  readonly
                                  :label="item.fieldName"
                                  outlined
                                  dense
                                  v-bind="attrs"
                                  v-on="on"
                                  required
                                  prepend-inner-icon="mdi-calendar"
                                  :rules="
                                    item.requiredField === 'True'
                                      ? [rules.required]
                                      : [true]
                                  "
                                >
                                </v-text-field>
                              </template>
                              <v-date-picker
                                v-model="item.fieldValue"
                                no-title
                                scrollable
                                @input="
                                  (menuAdd2 = false),
                                    $refs.menuAdd2.save(item.fieldValue)
                                "
                              >
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'Autocompletes'"
                          >
                            <v-autocomplete
                              v-model="item.fieldValue"
                              :items="JSON.parse(item.optionField)"
                              outlined
                              :label="item.fieldName"
                              required
                              dense
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            ></v-autocomplete>
                          </v-col>
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'Selects'"
                          >
                            <v-select
                              class="mb-6"
                              v-model="item.fieldValue"
                              :items="JSON.parse(item.optionField)"
                              menu-props="auto"
                              :label="item.fieldName"
                              required
                              dense
                              clearable
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-select>
                          </v-col>
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'Radio'"
                            style="padding:0px;"
                          >
                            <v-container fluid style="padding:0px;">
                              <v-radio-group
                                row
                                dense
                                v-model="item.fieldValue"
                                :rules="
                                  item.requiredField === 'True'
                                    ? [rules.required]
                                    : [true]
                                "
                                style="margin:0px;"
                              >
                                <template v-slot:label> </template>
                                <div
                                  v-for="radios in JSON.parse(item.optionField)"
                                  :key="radios.toISOString"
                                >
                                  <v-radio
                                    :label="radios.text"
                                    :value="radios.value"
                                    dense
                                  ></v-radio>
                                </div>
                              </v-radio-group>
                            </v-container>
                          </v-col>
                        </template>
                      </template>
                      <template v-if="item.conditionField === 'flow'">
                        <template
                          v-if="
                            parseInt(item.conditionValue) ===
                              parseInt(formAdd.flowId)
                          "
                        >
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'text'"
                          >
                            <v-text-field
                              v-if="item.fieldName === 'เบอร์โทร'"
                              v-mask="'###-###-####'"
                              v-model="item.fieldValue"
                              :label="item.fieldName"
                              dense
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                            <v-text-field
                              v-else
                              v-model="item.fieldValue"
                              :label="item.fieldName"
                              dense
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'number'"
                          >
                            <v-text-field
                              v-if="item.fieldName === 'เบอร์โทร'"
                              v-mask="'###-###-####'"
                              v-model="item.fieldValue"
                              :label="item.fieldName"
                              dense
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                            <v-text-field
                              v-else
                              v-model="item.fieldValue"
                              :label="item.fieldName"
                              dense
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'dateTime'"
                          >
                            <v-menu
                              v-model="menuAdd3"
                              :close-on-content-click="false"
                              :return-value.sync="date"
                              :rules="[rules.required]"
                              transition="scale-transition"
                              offset-y
                              required
                              min-width="auto"
                              ref="menuAdd3"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="item.fieldValue"
                                  readonly
                                  :label="item.fieldName"
                                  outlined
                                  dense
                                  v-bind="attrs"
                                  v-on="on"
                                  required
                                  prepend-inner-icon="mdi-calendar"
                                  :rules="
                                    item.requiredField === 'True'
                                      ? [rules.required]
                                      : [true]
                                  "
                                >
                                </v-text-field>
                              </template>
                              <v-date-picker
                                v-model="item.fieldValue"
                                no-title
                                scrollable
                                @input="
                                  (menuAdd3 = false),
                                    $refs.menuAdd3.save(item.fieldValue)
                                "
                              >
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'Autocompletes'"
                          >
                            <v-autocomplete
                              v-model="item.fieldValue"
                              :items="JSON.parse(item.optionField)"
                              dense
                              filled
                              :label="item.fieldName"
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            ></v-autocomplete>
                          </v-col>
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType == 'Selects'"
                          >
                            <v-select
                              class="mb-6"
                              v-model="item.fieldValue"
                              :items="JSON.parse(item.optionField)"
                              menu-props="auto"
                              :label="item.fieldName"
                              clearable
                              dense
                              :rules="
                                item.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              hide-details
                              outlined
                            ></v-select>
                          </v-col>
                          <v-col
                            cols="12"
                            class="InputData"
                            v-if="item.fieldType === 'Radio'"
                            style="padding:0px;"
                          >
                            <v-container fluid style="padding:0px;">
                              <v-radio-group
                                row
                                v-model="item.fieldValue"
                                style="margin:0px;"
                                :rules="
                                  item.requiredField === 'True'
                                    ? [rules.required]
                                    : [true]
                                "
                              >
                                <template v-slot:label> </template>
                                <div
                                  v-for="radios in JSON.parse(item.optionField)"
                                  :key="radios.toISOString"
                                  class="text-center"
                                >
                                  <v-radio
                                    :label="radios.text"
                                    dense
                                    :value="radios.value"
                                  ></v-radio>
                                </div>
                              </v-radio-group>
                            </v-container>
                          </v-col>
                        </template>
                      </template>
                    </div>
                  </template>
                  <v-row>
                    <v-col class="pb-0 pt-0" v-if="formAdd.flowId">
                      <v-menu
                        ref="menu"
                        v-model="menuDate"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        :rules="[rules.required]"
                        transition="scale-transition"
                        offset-y
                        required
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            readonly
                            label="วันที่นัดหมาย"
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                            required
                            @click="pickerDate ? getMonth(pickerDate) : null"
                            :rules="[rules.required]"
                          >
                            <template #prepend>
                              <v-icon right>
                                mdi-calendar
                              </v-icon>
                            </template>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          no-title
                          scrollable
                          :allowed-dates="allowedDates"
                          :picker-date.sync="pickerDate"
                          @change="setLimitBooking(date)"
                          @input="(menuDate = false), $refs.menu.save(date)"
                          :min="currentDate"
                        >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col
                      class="pb-0 pt-0"
                      v-if="timeavailable.length > 0 && date !== ''"
                    >
                      <v-select
                        v-model="time"
                        :items="timeavailable"
                        label="เวลา"
                        item-text="text"
                        item-value="text"
                        persistent-hint
                        return-object
                        outlined
                        dense
                        required
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row v-if="showMenu === 'True'">
                    <sideMenu
                      :drawerParent="drawerAdd"
                      :toggleParent="toggleAdd"
                      :languageSelectParent="languageSelect"
                      :dataMenuParent="dataMenuAdd"
                      :priceMenuParent="priceMenuAdd"
                      @updatePriceMenuParent="updatePriceMenuAdd"
                    ></sideMenu>
                    <v-col cols="12" class="pt-0 pb-4">
                      <v-btn block dark @click="toggleAdd">เมนู</v-btn>
                    </v-col>
                    <v-col cols="12" class="pt-0 pb-6">
                      <v-expansion-panels multiple v-model="expansionMenuAdd">
                        <v-expansion-panel>
                          <v-expansion-panel-header
                            >รายการและราคา</v-expansion-panel-header
                          >
                          <v-expansion-panel-content>
                            <div style="align-items: center;width:100%;">
                              <v-row>
                                <v-col
                                  cols="12"
                                  v-for="(item, id) in dataMenuAdd.filter(
                                    el => {
                                      return parseInt(el.qty) > 0;
                                    }
                                  )"
                                  :key="id"
                                  style="display: flex;"
                                >
                                  <v-card class="cardMenu">
                                    <v-img
                                      class="pictureMenu"
                                      :src="item.picture"
                                    ></v-img>
                                    <v-row>
                                      <v-col
                                        cols="8"
                                        class="pt-0 pb-0 textTitelMenu"
                                        >{{ item.name }}</v-col
                                      >
                                      <v-col
                                        cols="8"
                                        style="display: flex;justify-content: flex-start;"
                                        class="pt-0 pb-0 textTitelMenuSub"
                                        >{{ item.qty }} x
                                        {{ formatNumber(item.price) }}</v-col
                                      >
                                      <v-col
                                        cols="6"
                                        class="pt-0 pb-0 textTitelMenuRemark"
                                        >{{ item.remark }}</v-col
                                      >
                                    </v-row>
                                  </v-card>
                                </v-col>
                                <v-col cols="12">
                                  <v-row>
                                    <v-col cols="6"
                                      ><p class="ma-0 textTitelPriceMenu">
                                        รวมราคา
                                      </p></v-col
                                    >
                                    <v-col
                                      cols="6"
                                      style="display: flex;justify-content: flex-end;"
                                      class="textTitelPriceMenu"
                                      >{{ formatNumber(priceMenuAdd) }}</v-col
                                    >
                                  </v-row>
                                </v-col>
                              </v-row>
                            </div>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="
                      $session.getAll().data.shopId !==
                        'U9f316c85400fd716ea8c80d7cd5b61f8'
                    "
                  >
                    <v-col class="pt-0 pb-0">
                      <v-radio-group
                        v-model="formAdd.radiosRemark"
                        row
                        required
                        :rules="[rules.required]"
                      >
                        <v-radio value="ซ่อมปกติ">
                          <template v-slot:label>
                            <div class="mt-3">
                              <strong class="primary--text">{{
                                dataTypeJob1
                              }}</strong>
                            </div>
                          </template>
                        </v-radio>
                        <v-radio value="ExtraJob">
                          <template v-slot:label>
                            <div class="mt-3">
                              <strong class="error--text">{{
                                dataTypeJob2
                              }}</strong>
                            </div>
                          </template>
                        </v-radio>
                        <v-radio value="FastTrack">
                          <template v-slot:label>
                            <div class="mt-3">
                              <strong class="orange--text">{{
                                dataTypeJob3
                              }}</strong>
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-row v-if="checkDepositAdd === 'True'">
                    <v-col cols="12" class="pt-0">
                      <v-checkbox
                        :label="
                          `มีหลักฐานมัดจำหรือไม่ : ${dataDepositAdd.toString()}`
                        "
                        false-value="ไม่มี"
                        true-value="มี"
                        v-model="dataDepositAdd"
                        hide-details
                        @change="
                          dataDepositAdd === 'มี'
                            ? (panelDeposit = [0])
                            : (panelDeposit = [])
                        "
                      ></v-checkbox>
                    </v-col>
                    <v-col
                      cols="12"
                      class="pt-0"
                      v-if="dataDepositAdd === 'มี'"
                    >
                      <v-expansion-panels v-model="panelDeposit" multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-header
                            >อัพเดทหลักฐานเงินมัดจำ</v-expansion-panel-header
                          >
                          <v-expansion-panel-content>
                            <v-row justify="center">
                              <v-col cols="12" class="text-center">
                                <v-img
                                  aspect-ratio="3"
                                  contain
                                  :src="formAdd.pictureUrlPreviewDeposit"
                                ></v-img>
                                <br />
                                <v-file-input
                                  counter
                                  show-size
                                  accept="image/png, image/jpeg, image/bmp"
                                  prepend-icon="mdi-camera"
                                  label="รูปหลักฐานการมัดจำ"
                                  @change="selectImgAdd"
                                  v-model="filesDepositAdd"
                                ></v-file-input>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>
                    <v-col cols="12" class="pt-0 pb-0">
                      <VuetifyMoney
                        v-model="formAdd.depositPrice"
                        placeholder="จำนวนเงินมัดจำ"
                        dense
                        label="จำนวนเงินมัดจำ"
                        outlined
                        v-bind:options="options2"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="pt-0 pb-0">
                      <v-select
                        v-if="
                          formAdd.masBranchID !== null &&
                            formAdd.masBranchID !== ''
                        "
                        v-model="empSelectAdd"
                        :items="empSelectStepAdd"
                        label="พนักงานที่รับนัดหมาย"
                        menu-props="auto"
                        outlined
                        required
                        :rules="[rules.required]"
                        dense
                      ></v-select>
                      <!-- <v-select
                        v-if="
                          formAdd.masBranchID !== null &&
                            formAdd.masBranchID !== ''
                        "
                        v-model="empSelectAdd"
                        :items="
                          empSelectStepAdd.filter(
                            i =>
                              i.masBranchID === formAdd.masBranchID ||
                              i.masBranchID === ''
                          )
                        "
                        label="พนักงานที่รับนัดหมาย"
                        menu-props="auto"
                        outlined
                        required
                        :rules="[rules.required]"
                        dense
                      ></v-select> -->
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="pt-0">
                      <v-textarea
                        v-model="remark"
                        outlined
                        label="หมายเหตุเพิ่มเติม"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row v-if="statusShowMap === 'True'">
                    <v-col class="pb-0 pt-0" cols="12">
                      <v-text-field
                        v-model="address"
                        label="ชื่อของที่อยู่"
                        outlined
                        required
                        dense
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-card>
                        <v-card-text>
                          <v-row>
                            <v-col class="pb-0" cols="12">
                              <h6>ค้นหาที่อยู่ลูกค้า :</h6>
                            </v-col>
                            <v-col class="mr-16" cols="12">
                              <GmapAutocomplete
                                id="autocompleteMap"
                                @place_changed="updatePlace"
                              />
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <hr />
                        <v-card-text>
                          <GmapMap
                            v-if="center !== null"
                            :center="center"
                            @click="updateCoordinates"
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
                        </v-card-text>
                      </v-card>
                      <br />
                    </v-col>
                  </v-row>
                  <div class="text-center">
                    <v-btn
                      elevation="2"
                      large
                      color="#173053"
                      :loading="loadingAdd"
                      :disabled="loadingAdd"
                      class="white--text"
                      @click="addData()"
                    >
                      <template v-slot:loader>
                        <span class="custom-loader">
                          <v-icon light>mdi-cached</v-icon>
                        </span>
                      </template>
                      <v-icon color="white" dark left
                        >mdi-checkbox-marked-circle</v-icon
                      >
                      เพิ่ม
                    </v-btn>
                  </div>
                </v-col>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAddCon" persistent max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          บันทึกข้อมูล
        </v-card-title>
        <v-card-text>ต้องการ บันทึกข้อมูล ใช่หรือไม่?</v-card-text>
        <v-card-actions v-if="dataReadyAdd">
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="red darken-1"
            @click="(dialogAddCon = false), (loadingAdd = false)"
          >
            ตรวจสอบอีกครั้ง
          </v-btn>
          <v-btn dark color="green darken-1" @click="addDataInsert()">
            บันทึกข้อมูล
          </v-btn>
        </v-card-actions>
        <div class="text-center" v-if="!dataReadyAdd">
          <waitingAlert></waitingAlert>
        </div>
      </v-card>
    </v-dialog>
  </span>
</template>
<script>
import axios from 'axios' // api
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import moment from 'moment-timezone'
import waitingAlert from '../waitingAlert.vue'
export default {
  name: 'ModelBookingListBeauty',
  components: {
    waitingAlert
  },
  data () {
    let startDate = null
    let endDate = null
    return {
      unsubscribe: null,
      dNows: moment(new Date()).format('YYYY-MM-DD'),
      // menu
      bookNoNoti: '',
      showMenu: 'False',
      dataMenuAdd: [],
      expansionMenuAdd: [0],
      drawerAdd: false,
      priceMenuAdd: 0,
      languageSelect: 0,
      // ******
      dialogShowMenuReport: false,
      menuShowMenuReport: false,
      dataShowMenuReport: [],
      dateStartShowMenuReport: '',
      searchShowMenuReport: null,
      dataMenuShowMenuReport: [],
      BookingDataListShowMenuReport: [],
      DataFlowNameMenu: [],
      flowSelectMenu: '',
      sortSelect: null,
      expandedMenu: [],
      headersShowMenuReport: [
        {
          text: 'สถานะ',
          groupable: false,
          value: 'statusBt'
        },
        {
          text: 'วันที่/เวลา',
          value: 'dueDate',
          sortable: false,
          groupable: false
        },
        {
          text: 'บริการ',
          value: 'flowName',
          sortable: false,
          groupable: false
        },
        { text: 'ราคา', value: 'menuPrice', sortable: false, groupable: false }
      ],

      customerNameJob: '',
      dialogHistoryJob: false,
      timelineitem: [],
      codeColor: [
        'rgb(142, 202, 230)',
        'rgb(33, 158, 188)',
        'rgb(2, 48, 71)',
        'rgb(241, 91, 76)',
        'rgb(255, 183, 3)',
        'rgb(251, 133, 0)',
        'rgb(61,90,128)',
        'rgb(152,193,217)',
        'rgb(224,251,252)',
        'rgb(255,212,91)',
        'rgb(238,108,77)',
        'rgb(41,50,65)'
      ],
      showOnsite: 'ไม่แสดง',
      selectOnsite: '',
      menuAdd1: false,
      menuAdd2: false,
      menuAdd3: false,
      menuEdit1: false,
      menuEdit2: false,
      menuEdit3: false,

      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' }
      ],

      monthNamesThai: [
        '',
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม'
      ],
      dialogOnsite: false,
      dialogChangeOnsite: false,
      eventInfo: [],
      checkEventInfo: [],
      dialogQrCode: false,
      dueDateText: '',
      sortNo: '',
      dataCalendar: [],
      dataSummary: [],
      today: '',
      events: [],
      dialogCalenda: false,

      srcUpload: '',
      dialogShowFileUpload: false,
      pickerDate: null,
      pickerDateChang: null,
      currentDate: moment().format('YYYY-MM-DD'),
      currentMonth: moment().format('YYYY-MM'),
      headersLimitBookingDate: [
        {
          text: 'เวลา',
          align: 'center',
          sortable: true,
          value: 'bookingTime'
        },
        {
          text: 'จำนวน Limit ปัจจุบัน / จำนวน Limit ที่ตั้งไว้',
          value: 'countBookingLimit',
          align: 'center'
        }
      ],
      dataLimitBookingDate: [],
      options2: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 9,
        precision: 2
      },
      options1: {
        locale: 'en-US',
        prefix: '',
        suffix: '',
        length: 1,
        precision: 0
      },
      recordStatusJob: '',
      checkPayment: 'True',
      formCloseJob: {
        jobId: '',
        jobNo: '',
        totalPrice: 0
      },
      dialogCloseJob: false,
      loadingCloseJob: false,
      modelPackageIndexConfirm: null,
      modelPackageIndexConfirmJob: null,
      dataPackageDefault: false,
      jobCheckPackage: false,
      dateTimestamp: '',
      packageId: '',
      tokenPackage: '',
      dataPackage: [],
      StatusPackage: {
        status: 'ตกลง',
        color: 'green',
        packageName: '',
        token: ''
      },
      dataFlowSelectAdd: [],
      dataFlowSelectEdit: [],
      checkSelectText: '',
      pictureUrHistory: '',
      tagName: '',
      dialogHistory: false,
      dialogAddTag: false,
      tagItem: [],
      tagData: [],
      panelDeposit: [],
      dataDepositAdd: 'ไม่มี',
      pictureUrlPreviewDeposit: null,
      pictureUrlDeposit: null,
      filesDeposit: null,
      filesDepositAdd: null,
      valid_deposit: true,
      statusDeposit: false,
      flowSelect: '',
      dueDate: '',
      statusConfirmJob: false,
      filters: '',
      loadingTag: false,
      loadingDeposit: false,
      loadingEdit: false,
      loadingAdd: false,
      loadingRefresh: false,
      menuDateSearch: false,
      timeTable: '',
      drawer: false,
      value: '',
      size: 200,
      foreground: '#173053',
      userId: '',
      skip: {
        userId: 'user-skip'
      },
      pathToweb: '',
      changeBackgroundColor: true,
      countWaiting: 0,
      countConfirm: 0,
      countCancel: 0,
      countJob: 0,
      countAll: 0,
      export_fields: {
        'Booking Id': 'bookNo',
        สาขา: 'masBranchName',
        ชื่อลูกค้า: 'cusName',
        ทะเบียนรถ: 'cusReg',
        วันและเวลานัดหมาย: 'dueDate',
        ชื่อบริการ: 'flowName',
        'สถานะ ติดต่อ': 'statusBt',
        'วันที่ ติดต่อ': 'contactDateBt',
        สถานะนำเข้ากระดาน: 'statusUseBt',
        'วันที่ สร้าง': 'CREATE_DATE',
        'วันที่ แก้ไขล่าสุด': 'LAST_DATE'
      },
      exportType: 'xls',
      exportFileName:
        'BookingList' +
        new Date()
          .toISOString()
          .substr(0, 10)
          .replace('/-/g', '') +
        '.xls',
      exportWorksheet: 'WorkSheet',
      export_data: [],
      dateRange: { startDate, endDate },
      localeData: {
        format: 'yyyy-mm-dd',
        applyLabel: 'ยืนยัน',
        cancelLabel: 'ยกเลิก',
        daysOfWeek: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
        monthNames: [
          'ม.ค',
          'ก.พ',
          'มี.ค',
          'เม.ย',
          'พ.ค',
          'มิ.ย',
          'ก.ค',
          'ส.ค',
          'ก.ย',
          'ต.ค',
          'พ.ย',
          'ธ.ค'
        ],
        firstDay: 1
      },
      masterTime: [
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00'
      ],
      masBranchID: '',
      masBranchIDExport: '',
      bookNo: '',
      BookingDataItem: [],
      Layout: [],
      dataItemTime: [],
      dataItemTimesChange: [],
      appendBody: true,
      dataEditReady: true,
      dataConfirmReady: true,
      dataCancelReady: true,
      dialogTag: false,
      dialogExport: false,
      dialogRemove: false,
      dialogError: false,
      dialogDeposit: false,
      dataReady: false,
      menuDate: false,
      menuDateEdit: false,
      menuDateChange: false,
      menuDataBokkAgain: false,
      date: '',
      time: '',
      empSelectAdd: '',
      dateEdit: '',
      timeEdit: '',
      empSelectEdit: '',
      session: this.$session.getAll(),
      fieldNameItem: [],
      flowfieldNameitem: [],
      sort: null,
      DataflowId: '',
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'รายชื่อลูกค้านัดหมาย',
          disabled: false,
          href: '/Master/BookingListBeauty'
        }
      ],
      branch: [],
      DataFlowName: [],
      searchAll2: '',
      columns: [
        { text: 'จัดการ', value: 'action', sortable: false, align: 'center' },
        { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
        { text: 'ชื่อบริการ', value: 'flowName' },
        { text: 'ชื่อลูกค้า', value: 'cusName' },
        { text: 'เบอร์โทร', value: 'tel' },
        { text: 'ทะเบียนรถ', value: 'cusReg' },
        { text: 'สถานะนัดหมาย', value: 'statusBtText' },
        {
          text: 'คุณสมบัติเพิ่มเติม',
          value: 'action3',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Confirm นัดล่วงหน้า',
          value: 'action2',
          sortable: false,
          align: 'center'
        }
      ],
      columnsSelected: [],
      dataItem: [],
      dataItemCheck: [],
      dataexport: [],
      dataItemSelect: [],
      editedItemSeleteField: [],
      jobitem: [],
      itemsSort: [
        'เรียงตามวันที่นัดหมาย',
        'เรียงตามวันที่เปลี่ยนสถานะ',
        'เรียงตามวันที่สร้าง'
      ],
      itemsSortWaiting: ['เรียงตามวันที่นัดหมาย', 'เรียงตามวันที่สร้าง'],
      formAdd: {
        bookingId: null,
        fieldId: '',
        fieldValue: '',
        flowId: null,
        masBranchID: null,
        dueDate: '',
        shopId: this.$session.getAll().data.shopId,
        bookingFieldId: '',
        radiosRemark: '',
        depositStatus: '',
        depositImge: '',
        pictureUrlPreviewDeposit: '',
        depositPrice: 0
      },
      formEdit: {
        bookingId: null,
        fieldId: '',
        fieldValue: '',
        flowId: null,
        masBranchID: null,
        dueDate: '',
        shopId: this.$session.getAll().data.shopId,
        bookingFieldId: '',
        radiosRemark: ''
      },
      formUpdate: {
        masBranchCode: '',
        masBranchName: '',
        tel: '',
        map: '',
        shopId: '',
        bookNo: ''
      },
      formChange: {
        date: '',
        time: ''
      },
      dataChange: {},
      validUpdate: true,
      validAdd: true,
      validEdit: true,
      validRemove: true,
      validChange: true,
      validExport: true,
      validBookingAgain: true,
      dialogAdd: false,
      dialogEdit: false,
      dialogEditData: false,
      dialogDelete: false,
      dialogChange: false,
      dialogRemark: false,
      dialogRemarkReturn: false,
      dialogJob: false,
      dialogAddCon: false,
      menuReturn: false,
      menu: false,
      menu1: false,
      menuStart: false,
      dateStart: new Date().toISOString().substr(0, 7),
      endDate: '',
      endTime: '',
      memberPicture: '',
      memberName: '',
      dataInfo: null,
      dialogInfo: false,
      detailInfo: null,
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
      getSelectText: '',
      getSelectCount: 0,
      selectedStatus: false,
      swalConfig: {
        title: null,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      },
      BookingDataList: [],
      BookingDataListTimechange: [],
      remarkRemove: '',
      bookNoRemove: '',
      timeavailable: [],
      dialogConfirm: false,
      dialogMap: false,
      empSelectStep: [],
      empSelectStepAdd: [],
      dataConfirm: [],
      empSelect: '',
      dataRemoveExport: [],
      dataexportRemove: [],
      BookingDataItemEdit: [],
      dataQrcode: [],
      bookNoRemark: '',
      remark: '',
      remarkReturn: '',
      dateReturn: '',
      showMap: '',
      setTimer: null,
      setTimerCalendar: null,
      searchOther: '',
      showColorSearch: false,
      dataEditJobReady: true,
      dataChangeReady: true,
      statusSearch: 'no',
      center: null,
      address: '',
      empSelectJob: '',
      textError: '',
      dataReadyAdd: true,
      checkShowSelectUser: false,
      tabSelectUser: null,
      dataSelectUser: {},
      dataTypeJob1: '',
      dataTypeJob2: '',
      dataTypeJob3: '',
      dataTypeProcess1: '',
      dataTypeProcess2: '',
      dataTypeProcess3: '',
      dataTypeProcess4: '',
      checkDepositAdd: '',
      defaultData: [],
      phonenumItem: [],
      HistoryData: [],
      phonenum: [],
      lineUserId: '',
      booking: [],
      bookingData: [],
      dialogBookingAgain: false,
      loadingBookingAgain: false,
      limitBookingCheck: 'False',
      limitBookingSelect: 'False',
      limitCountBranch: 0,
      limitCountBranchOld: 0,
      countBookingLimit: 0,
      selectCountBookingLimit: 1,
      dueDateOld: '',
      dueDateTimeOld: '',
      masBranchIDLimit: '',
      flowIDLimit: '',
      dateDayoff: [],
      dateDayCustom: [],
      dateDaylimit: null,
      flowItemLimit: [],
      checkLimitBooking: {
        ID: '',
        countBooking: null,
        limitCheck: null,
        limitBooking: 0
      },
      dataEdit: '',
      statusShowDateConfiremjob: true,
      memberId: '',
      flowIdOldEdit: '',
      masBranchIDOldEdit: '',
      Redirect: '',
      dialogShowDeposit: false,
      depositLink: '',
      datailLinkDeposit: '',
      depositPrice: 0,
      statusdepositPrice: false,
      statusBranchReadonly: false,
      dataEmpOnsite: [],
      statusShowMap: '',
      listFilterCloseJob: ['ทั้งหมด', 'ยังไม่ปิดงาน', 'ปิดงาน'],
      filterCloseJobValue: 'ทั้งหมด',
      dataGetJob: [],
      dataCoin: [],
      productExchangeRateId: '',
      memberTel: '',
      dataLineConfig: {},
      priceMenu: null,
      dataMenu: [],
      expansionMenu: [0],
      dialogMenu: false,
      depositTextTH: '',
      statusVIP: 'False',
      statusVIPEdit: 'False',
      statusVIPChang: 'False',
      statusVIPRemove: 'False',
      masBranchIDAddJob: '',
      statusPushEndStep: 'False',
      endStepItem: [],
      ItemendStepStanby: [],
      DataFlowNameDefault: [],
      statusGoogleCalendar: '',
      statusGoogleCalendarEmp: '',
      copyTextBtTH: '',
      copyTextBtEN: '',
      copyTextStatus: false,
      dialogShowImg: false,
      showImgItem: [],
      dialogImg: false,
      showImg: '',
      dataCloseJob: [],
      dataCloseJobData: [],
      sendRemarkRemove: false
    }
  },
  computed: {
    ColsDialogAdd () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'False'
        case 'sm':
          return 'False'
        case 'md':
          return 'False'
        case 'lg':
          return 'True'
        case 'xl':
          return 'True'
      }
    }
  },
  methods: {
    updatePlace (place) {
      // console.log(place)
      this.center = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    },
    async fnChangeDate () {
      console.log('check : ', this.formAdd.flowId)
      this.priceMenuAdd = 0
      this.drawerAdd = false
      await this.checkTime()
      await this.SetallowedDates()
      await this.setFlowAdd()
      this.date = this.dNows
    },
    async addDataInsert () {
      // this.swalConfig.title = 'ต้องการ บันทึกข้อมูล ใช่หรือไม่?'
      // this.$swal(this.swalConfig)
      //   .then(async result => {
      if (this.$session.id() !== undefined) {
        this.dataReadyAdd = false
        var fastTrack = 'False'
        var extraJob = 'False'
        switch (this.formAdd.radiosRemark) {
          case 'ซ่อมปกติ':
            fastTrack = 'False'
            extraJob = 'False'
            break
          case 'ExtraJob':
            fastTrack = 'False'
            extraJob = 'True'
            break
          case 'FastTrack':
            fastTrack = 'True'
            extraJob = 'False'
            break
        }
        let flowIdData = this.formAdd.flowId
        let rs = this.fieldNameItem
        let Add = []
        let fielditem = this.fieldNameItem
        if (this.checkDepositAdd === 'False') {
          this.formAdd.depositStatus = ''
          this.formAdd.depositImge = ''
          this.formAdd.depositPrice = ''
        } else {
          if (this.dataDepositAdd === 'มี') {
            if (this.formAdd.depositPrice === null) {
              this.formAdd.depositPrice = ''
            }
            this.formAdd.depositStatus = 'True'
            if (this.filesDepositAdd) {
              const _this = this
              let configDepositUpload = {
                headers: {
                  bookNo: 'BK' + moment().unix()
                }
              }
              let params = new FormData()
              params.append('file', this.filesDepositAdd)
              await axios
                .post(
                  this.DNS_IP + `/file/upload/deposit`,
                  params,
                  configDepositUpload
                )
                .then(function (response) {
                  _this.formAdd.depositImge = response.data
                  console.log('url Pic', response.data)
                })
            } else {
              this.formAdd.depositImge = this.pictureUrlPreviewDeposit
            }
          } else {
            if (this.formAdd.depositPrice === null) {
              this.formAdd.depositPrice = ''
            }
            this.formAdd.depositStatus = 'True'
            this.formAdd.depositImge = ''
          }
        }
        console.log('this.fieldNameItem', this.fieldNameItem)
        let limitBookingCheck = ''
        if (this.checkLimitBooking.limitCheck === 'true' || null) {
          limitBookingCheck = 'True'
        } else {
          limitBookingCheck = 'False'
        }
        console.log('this.DataFlowNameDefault >>> ', this.DataFlowNameDefault)
        let storeFront = this.DataFlowNameDefault.filter(item => {
          return item.value === this.formAdd.flowId
        })
        let storeFrontCheck = ''
        if (storeFront.length > 0) {
          storeFrontCheck = storeFront[0].allData.storeFrontCheck || 'False'
        } else {
          storeFrontCheck = 'False'
        }
        let timeValue = ''
        let timeTime = ''
        if (this.time.value) {
          timeValue = this.time.value
          timeTime = this.time.text
        } else {
          timeValue = ''
          timeTime = ''
        }
        for (let i = 0; i < rs.length; i++) {
          let d = rs[i]
          let update = {}
          if (d.conditionField === '' || d.conditionField === null) {
            update.masBranchID = this.formAdd.masBranchID
            update.bookingFieldId = d.bookingFieldId
            update.remark = this.remark
            update.flowId = this.formAdd.flowId
            update.fieldId = d.fieldId
            update.fieldValue = d.fieldValue
            update.shopId = d.shopId
            update.dueDate = this.date + ' ' + timeValue
            update.dateSelect = this.date
            update.timeSelect = timeValue
            update.timeText = timeTime
            update.userId = 'user-skip'
            update.pageName = 'BookingList'
            update.sourceLink = 'direct'
            update.fastTrack = fastTrack
            update.extraJob = extraJob
            update.depositStatus = this.formAdd.depositStatus
            update.depositImge = this.formAdd.depositImge
            update.empSelect = this.empSelectAdd
            update.adminLogin = this.session.data.userName
            update.limitBookingCheck = limitBookingCheck
            update.limitBookingId = this.checkLimitBooking.ID
            update.limitBookingCount = this.checkLimitBooking.countBooking
            update.getLimitBooking = this.checkLimitBooking.limitBooking
            update.depositPrice = this.formAdd.depositPrice
            update.storeFrontCheck = storeFrontCheck
            if (this.statusVIP === 'True') {
              update.statusVIP = 'True'
            } else {
              update.statusVIP = 'False'
            }
            update.statusBookingForm = 'BookingForm'
            update.address = (this.address || '')
              .replace(/%/g, '%%')
              .replace(/'/g, "\\'")
            update.addressLatLong = JSON.stringify(this.center)
            if (this.dataMenuAdd.filter(i => parseInt(i.qty) > 0).length > 0) {
              update.menuItem = JSON.stringify(
                this.dataMenuAdd.filter(i => parseInt(i.qty) > 0)
              )
              update.menuPrice = this.priceMenuAdd
            }
            Add.push(update)
          } else {
            if (
              fielditem.filter(row => {
                return row.fieldId === parseInt(d.conditionField)
              }).length > 0
            ) {
              if (
                d.conditionValue ===
                fielditem.filter(row => {
                  return row.fieldId === parseInt(d.conditionField)
                })[0].fieldValue
              ) {
                update.masBranchID = this.formAdd.masBranchID
                update.bookingFieldId = d.bookingFieldId
                update.remark = this.remark
                update.flowId = this.formAdd.flowId
                update.fieldId = d.fieldId
                update.fieldValue = d.fieldValue
                update.shopId = d.shopId
                update.dueDate = this.date + ' ' + timeValue
                update.dateSelect = this.date
                update.timeSelect = timeValue
                update.timeText = timeTime
                update.sourceLink = 'direct'
                update.userId = 'user-skip'
                update.pageName = 'BookingList'
                update.fastTrack = fastTrack
                update.extraJob = extraJob
                update.depositStatus = this.formAdd.depositStatus
                update.depositImge = this.formAdd.depositImge
                update.empSelect = this.empSelectAdd
                update.adminLogin = this.session.data.userName
                update.limitBookingCheck = limitBookingCheck
                update.limitBookingId = this.checkLimitBooking.ID
                update.limitBookingCount = this.checkLimitBooking.countBooking
                update.getLimitBooking = this.checkLimitBooking.limitBooking
                update.depositPrice = this.formAdd.depositPrice
                update.storeFrontCheck = storeFrontCheck
                if (this.statusVIP === 'True') {
                  update.statusVIP = 'True'
                } else {
                  update.statusVIP = 'False'
                }
                update.statusBookingForm = 'BookingForm'
                update.address = (this.address || '')
                  .replace(/%/g, '%%')
                  .replace(/'/g, "\\'")
                update.addressLatLong = JSON.stringify(this.center)
                if (
                  this.dataMenuAdd.filter(i => parseInt(i.qty) > 0).length > 0
                ) {
                  update.menuItem = JSON.stringify(
                    this.dataMenuAdd.filter(i => parseInt(i.qty) > 0)
                  )
                  update.menuPrice = this.priceMenuAdd
                }
                Add.push(update)
              }
            } else if (d.conditionField === 'flow') {
              if (
                parseInt(d.conditionValue) === parseInt(this.formAdd.flowId)
              ) {
                update.masBranchID = this.formAdd.masBranchID
                update.bookingFieldId = d.bookingFieldId
                update.remark = this.remark
                update.flowId = this.formAdd.flowId
                update.fieldId = d.fieldId
                update.fieldValue = d.fieldValue
                update.shopId = d.shopId
                update.dueDate = this.date + ' ' + timeValue
                update.dateSelect = this.date
                update.timeSelect = timeValue
                update.timeText = timeTime
                update.sourceLink = 'direct'
                update.userId = 'user-skip'
                update.pageName = 'BookingList'
                update.fastTrack = fastTrack
                update.extraJob = extraJob
                update.depositStatus = this.formAdd.depositStatus
                update.depositImge = this.formAdd.depositImge
                update.empSelect = this.empSelectAdd
                update.adminLogin = this.session.data.userName
                update.limitBookingCheck = limitBookingCheck
                update.limitBookingId = this.checkLimitBooking.ID
                update.limitBookingCount = this.checkLimitBooking.countBooking
                update.getLimitBooking = this.checkLimitBooking.limitBooking
                update.depositPrice = this.formAdd.depositPrice
                update.storeFrontCheck = storeFrontCheck
                if (this.statusVIP === 'True') {
                  update.statusVIP = 'True'
                } else {
                  update.statusVIP = 'False'
                }
                update.statusBookingForm = 'BookingForm'
                update.address = (this.address || '')
                  .replace(/%/g, '%%')
                  .replace(/'/g, "\\'")
                update.addressLatLong = JSON.stringify(this.center)
                if (
                  this.dataMenuAdd.filter(i => parseInt(i.qty) > 0).length > 0
                ) {
                  update.menuItem = JSON.stringify(
                    this.dataMenuAdd.filter(i => parseInt(i.qty) > 0)
                  )
                  update.menuPrice = this.priceMenuAdd
                }
                Add.push(update)
              }
            }
          }
        }
        console.log('Add', Add)
        axios
          .post(this.DNS_IP + '/Booking/add', Add)
          .then(async response => {
            // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
            if (response.data.message === 'LimitBooking_Full') {
              this.$swal(
                'คิวเต็มแล้ว',
                'กรุณาเลือกวันที่และเวลาใหม่อีกครั้ง',
                'error'
              )
              this.date = ''
              this.time = ''
            } else {
              let checkDeposit = this.DataFlowNameDefault.filter(el => {
                return el.value === parseInt(this.formAdd.flowId)
              })
              let depositCheckStatus = ''
              if (checkDeposit.length > 0) {
                depositCheckStatus =
                  checkDeposit[0].allData.checkDeposit || 'False'
              } else {
                depositCheckStatus = 'False'
              }
              if (depositCheckStatus === 'True') {
                if (this.dataDepositAdd === 'มี') {
                  await this.confirmChkAdd(response.data)
                } else {
                  await this.confirmChkAdd(response.data)
                  this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                }
                this.dialogShowDeposit = true
                this.bookNo = response.data.bookNo
                this.depositPrice = this.formAdd.depositPrice
                this.depositLink =
                  'https://betask-linked.web.app/Thank?shopId=' +
                  this.$session.getAll().data.shopId +
                  '&redirectBy=BookingAdmin&flowId=' +
                  flowIdData +
                  '&bookNo=' +
                  response.data.bookNo
              } else {
                await this.confirmChkAdd(response.data)
              }
            }
            // console.log('addDataGlobal DNS_IP + /job/add', response)
          })
          .catch(error => {
            console.log('error function addData : ', error)
            this.addDataInsert()
            // setTimeout(() => this.addDataInsert(), 3000)
          })
        console.log('this.bookNo chk', this.bookNo)
        if (this.$session.getAll().data.shopId === this.shopNameData.airmate) {
          let body = {
            shopId: this.$session.getAll().data.shopId,
            bookNo: this.bookNo,
            jobNo: '',
            beforeAir: '',
            afterAir: '',
            remark: '',
            CREATE_USER: this.$session.getAll().data.userName,
            LAST_USER: this.$session.getAll().data.userName,
            processNow: ''
          }
          console.log('body shopId', body)
          await axios.post(this.DNS_IP + '/formpdf/insert', body)
          // await axios.post('http://localhost:5002/formpdf/insert', body)
        }
        // })
        // .catch(error => {
        //   console.log('Cencel : ', error)
        //   this.closeSetTimeGetCalenda()
        // })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async updateProcessShopNew () { // update active = 1
      try {
        let body = {
          // userName: this.$session.getAll().data.userName,
          shopId: this.$session.getAll().data.shopId
        }
        await axios.post('https://asia-southeast1-be-linked-a7cdc.cloudfunctions.net/QueueOnline-ProcessNew', body)
      } catch (error) {
        console.log('updateProcessShopNew error-> ', error)
      }
    },
    async confirmChkAdd (item) {
      var dt = {
        bookNo: item.bookNo,
        contactDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: 'confirm',
        statusUse: 'use',
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.session.data.userName,
        LAST_USER: this.session.data.userName
      }
      await axios
        .post(this.DNS_IP + '/booking_transaction/add', dt)
        .then(async response => {
          // this.getDataCalendaBooking()
          //   if (this.statusGoogleCalendar === 'True') {
          //     this.connectGoogleCalendar('Add', dt.bookNo)
          //   }
          await this.updateProcessShopNew()
          this.clearDataAdd()
          const dataNo = await axios
            .get(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/Booking/getID?bookNo=" + item.bookNo
            )
          console.log('dataNo', dataNo)
          if (dataNo.status === 200) {
            this.$swal({
              title: `<span style="font-size: 60px;">${dataNo.data.storeFrontQueue !== null ? ' ' + dataNo.data.storeFrontQueue + ' ' : ''}</span>`,
              text: 'เพิ่มข้อมูลเรียบร้อย',
              type: 'success'
            })
          } else {
            this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
          }
          // await this.getBookingList()
          // this.getTimesChange('update')
        })
        .catch(error => {
          console.log('error function addData : ', error)
          this.confirmChkAdd()
        })
    },
    async addDataSet () {
      this.statusdepositPrice = false
      this.datailLinkDeposit = ''
      this.remark = ''
      this.dialogAdd = true
      if (this.branch.length === 0) {
        this.getDataBranch()
      } else if (this.branch.length === 1) {
        console.log(' COUNT : ', this.branch)
        this.selectBranch()
      }
      await this.getDataFlow()
      this.getBookingField()
      this.checkTime()
      this.setFlowAdd()
      //   ซ่อมปกติ
      this.formAdd.radiosRemark = 'ซ่อมปกติ'
    },
    async clearDataAdd () {
      this.showMenu = 'False'
      this.dataMenuAdd = []
      this.dataReady = true
      this.date = ''
      this.time = ''
      this.empSelectAdd = ''
      this.remark = ''
      this.formAdd.radiosRemark = ''
      this.formAdd.depositStatus = ''
      this.formAdd.depositImge = ''
      this.formAdd.pictureUrlPreviewDeposit = ''
      this.filesDepositAdd = null
      this.dataDepositAdd = 'ไม่มี'
      this.DataflowId = ''
      this.formAdd.bookingId = null
      this.formAdd.fieldId = ''
      this.formAdd.fieldValue = ''
      this.formAdd.flowId = null
      this.formAdd.masBranchID = null
      this.formAdd.dueDate = ''
      this.formAdd.shopId = this.$session.getAll().data.shopId
      this.dialogAdd = false
      this.dialogAddCon = false
      this.loadingAdd = false
      this.address = ''
      this.center = null
      this.dataReadyAdd = true
      this.setTimerCalendar = null
      // if (this.statusSearch === 'no') {
      //   this.getBookingList()
      // } else {
      //   this.searchAny()
      // }
      // if (this.getSelectText) {
      //   this.getSelect(
      //     this.getSelectText,
      //     this.getSelectCount,
      //     this.filterCloseJobValue
      //   )
      // }
      // this.getDataCalendaBooking()
    },
    setFlowByBranchAdd () {
      console.log(
        '<><><><> this.formAdd.flowId <  > <> <> ',
        this.$session.getAll().data.flowId
      )
      console.log(
        '<><><><> this.DataFlowNameDefault <  > <> <> ',
        this.DataFlowNameDefault
      )
      this.formAdd.flowId = ''
      let DD = this.DataFlowNameDefault
      let dataFilter = []
      DD.forEach(item => {
        // console.log('<item.text> : ', item.text)
        if (item.text !== 'ทั้งหมด') {
          let checkBranchByFlow = item.allData.masBranchID || 'All'
          if (
            checkBranchByFlow === this.formAdd.masBranchID.toString() ||
            checkBranchByFlow === 'All'
          ) {
            console.log('eeeeeee', item.allData.flowName)
            dataFilter.push(item)
          }
        }
      })

      let newDataFillter = []
      console.log('this.$session.getAll().data.flowId', this.$session.getAll().data.flowId)
      try {
        dataFilter.filter(key => {
          for (const fId of JSON.parse(this.$session.getAll().data.flowId)) {
            if (key.value === parseInt(fId)) {
              newDataFillter.push(key)
            }
          }
        })
      } catch (err) {
        newDataFillter = dataFilter
      }

      if (newDataFillter.length === 1) {
        const dateNow = new Date()
        this.priceMenuAdd = 0
        this.drawerAdd = false
        this.checkTime()
        this.SetallowedDates()
        this.setFlowAdd()
        this.date = moment(dateNow).format('YYYY-MM-DD')
        this.dataFlowSelectAdd = newDataFillter
        this.formAdd.flowId = newDataFillter[0].value
      } else {
        console.log('()()()()()()()()()()()', newDataFillter)
        this.dataFlowSelectAdd = newDataFillter
      }
      console.log(new Date(), this.dataFlowSelectAdd)
    },
    checkTime () {
      this.timeavailable = []
      let dtTime = this.dataFlowSelectAdd.filter(item => {
        return item.value === this.formAdd.flowId
      })
      if (dtTime.length > 0) {
        if (dtTime[0].menuShowStatus === 'True') {
          this.showMenu = 'True'
          this.dataMenuAdd = JSON.parse(dtTime[0].allData.menuItem) || []
        } else {
          this.showMenu = 'False'
          this.dataMenuAdd = []
        }
        if (dtTime.map(item => item.allData.setTime) === null) {
          this.timeavailable = []
        } else {
          this.timeavailable = JSON.parse(
            dtTime.map(item => item.allData.setTime)
          )
        }
      }
    },
    SetallowedDates () {
      try {
        let dataFlow = this.dataFlowSelectAdd.filter(el => {
          console.log('el >>>', el)
          return el.value === this.formAdd.flowId
        })
        if (dataFlow.length > 0) {
          dataFlow.forEach((v, k) => {
            console.log('v', v)
            if (v.allData.flowId === this.formAdd.flowId) {
              v.allData.dateDayCustom = v.allData.dateDayCustom || ''
              v.allData.dateDayoffValue = v.allData.dateDayoffValue || ''
              if (v.allData.dateDayoffValue !== '') {
                this.dateDayoff = JSON.parse(v.allData.dateDayoffValue)
              } else {
                this.dateDayoff = []
              }
              if (v.dateDayCustom !== '') {
                console.log(
                  'v.allData.dateDayCustom : ',
                  v.allData.dateDayCustom
                )
                if (v.allData.dateDayCustom !== '') {
                  this.dateDayCustom = JSON.parse(v.allData.dateDayCustom)
                } else {
                  this.dateDayCustom = []
                }
              } else {
                this.dateDayCustom = []
              }
            }
          })
        } else {
          this.dateDayoff = []
          this.dateDayCustom = []
        }
      } catch (err) {
        console.log('ERRRRRR : ', err)
      }
    },
    allowedDates (val) {
      if (this.dateDaylimit) {
        if (
          this.dataFlowSelectAdd.filter(el => el.value === this.formAdd.flowId)
            .length > 0
        ) {
          if (
            this.dataFlowSelectAdd.filter(
              el => el.value === this.formAdd.flowId
            )[0].allData.typeDayCustom === 'on'
          ) {
            return val === this.dateDayCustom.filter(el => el === val)[0]
          } else {
            if (
              this.dateDayoff.filter(el => {
                return el === new Date(val).getDay()
              }).length === 0 &&
              this.dateDayCustom.filter(el => {
                return el === val
              }).length === 0 &&
              this.dateDaylimit.filter(el => {
                return el === val
              }).length === 0
            ) {
              return val
            }
          }
        } else {
          return val
        }
      } else {
        return val
      }
    },
    setFlowAdd () {
      if (
        this.dataFlowSelectAdd.filter(el => {
          return el.value === this.formAdd.flowId
        }).length > 0
      ) {
        this.checkDepositAdd =
          this.dataFlowSelectAdd.filter(el => {
            return el.value === this.formAdd.flowId
          })[0].allData.checkDeposit || 'False'
        this.statusShowMap =
          this.dataFlowSelectAdd.filter(el => {
            return el.value === this.formAdd.flowId
          })[0].allData.checkOnsite || 'False'
      } else {
        this.checkDepositAdd = 'False'
        this.statusShowMap = 'False'
      }
    },
    addData () {
      this.loadingAdd = true
      let dtTime = this.dataFlowSelectAdd.filter(item => {
        return item.value === this.formAdd.flowId
      })
      if (dtTime.length > 0) {
        if (
          dtTime[0].menuShowStatus === 'True' &&
          this.dataMenuAdd.filter(el => {
            return parseInt(el.qty) > 0
          }).length === 0
        ) {
          this.loadingAdd = false
          this.$swal('แจ้งเตือน', 'กรุณาเลือกเมนู', 'info')
        } else {
          this.validate('ADD')
          this.addDataSubmit()
        }
      } else {
        this.validate('ADD')
        this.addDataSubmit()
      }
    },
    async getCountFastTrack (dateS, flowId, branch) {
      let result = []
      let dateSelect = ''
      if (dateS) {
        dateSelect = this.momenDate_1(dateS)
      } else {
        dateSelect = moment().format('YYYY-MM-DD')
      }
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP +
            '/booking_view/getCountFastTrack?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            branch +
            '&dueDate=' +
            dateSelect +
            '&flowId=' +
            flowId +
            '&fastTrack=True' +
            this.selectOnsite
        )
        .then(async response => {
          console.log(
            'response.data[0].countFastTrack',
            response.data[0].countFastTrack
          )
          if (response.data.status === false) {
            result = 'ไม่มีข้อมูล'
          } else {
            result = response.data[0].countFastTrack
          }
        })
      return result
    },
    async addDataSubmit () {
      try {
        if (this.validAdd === true) {
          console.log('1')

          if (this.$session.id() !== undefined) {
            console.log('2 ')

            if (this.formAdd.radiosRemark === 'FastTrack') {
              console.log('3')

              let getcount = await this.getCountFastTrack(
                this.date,
                this.formAdd.flowId,
                this.formAdd.masBranchID
              )
              let setCountFast = this.branch.filter(el => {
                return el.value === this.formAdd.masBranchID
              })[0].allData.countFastTrack
              if (getcount < setCountFast) {
                console.log('4')
                if (
                  this.DataFlowNameDefault.filter(item => {
                    return item.value === this.formAdd.flowId
                  })[0].allData.limitBookingCheck === 'True'
                ) {
                  console.log('5')
                  await this.checkLimit()
                  // console.log('test', this.branchData.filter(item => { return item.masBranchID === this.formAdd.masBranchID })[0].setTime)
                  if (this.checkLimitBooking.limitCheck === 'true') {
                    this.dialogAddCon = true
                  } else if (this.checkLimitBooking.limitCheck === 'false') {
                    console.log('6')
                    console.log('else1402')
                    this.$swal(
                      'คิวเต็มแล้ว',
                      'กรุณาเลือกวันที่ใหม่อีกครั้ง',
                      'error'
                    )
                    this.date = ''
                    this.time = ''
                  } else {
                    this.checkLimitBooking.limitCheck = 'true'
                    this.dialogAddCon = true
                    console.log('else1407')
                  }
                } else {
                  this.checkLimitBooking.limitCheck = 'false'
                  this.dialogAddCon = true
                  console.log('else1407')
                }
              } else {
                console.log('7')
                this.textError = 'จำนวนงานด่วนต่อวัน เกินกว่าที่ตั้งไว้'
                this.dialogError = true
                this.loadingAdd = false
              }
            } else {
              console.log('8', this.DataFlowNameDefault)
              console.log('8111', this.formAdd.flowId)

              if (
                this.DataFlowNameDefault.filter(item => {
                  return item.value === this.formAdd.flowId
                })[0].allData.limitBookingCheck === 'True'
              ) {
                console.log('9')
                await this.checkLimit()
                if (this.checkLimitBooking.limitCheck === 'true') {
                  console.log('10')
                  this.dialogAddCon = true
                } else if (this.checkLimitBooking.limitCheck === 'false') {
                  console.log('11')
                  console.log('else1402')
                  this.$swal(
                    'คิวเต็มแล้ว',
                    'กรุณาเลือกวันที่ใหม่อีกครั้ง',
                    'error'
                  )
                  this.date = ''
                  this.time = ''
                } else {
                  console.log('12')
                  this.dialogAddCon = true
                  this.checkLimitBooking.limitCheck = 'true'
                  console.log('else1407')
                }
              } else {
                console.log('13')
                this.dialogAddCon = true
                this.checkLimitBooking.limitCheck = 'false'
              }
            }
          } else {
            console.log('14')
            this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
            this.setTimerCalendar = null
            this.$router.push('/Core/Login')
          }
        } else {
          console.log('<><><><><><>')
          this.loadingAdd = false
        }
      } catch (err) {
        console.log('err ', err)
      }
    },
    async checkLimit () {
      this.checkLimitBooking.ID = 'NO'
      this.checkLimitBooking.countBooking = 1
      let LimitBooking = await this.getLimitBooking()
      if (this.statusVIP === 'False') {
        if (LimitBooking.status === false) {
          this.checkLimitBooking.ID = 'NO'
          this.checkLimitBooking.countBooking = 1
          console.log('1257')
        } else {
          console.log('1259', LimitBooking)
          LimitBooking.forEach(item => {
            let setTime = []
            // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
            if (
              this.DataFlowNameDefault.filter(item => {
                return item.value === this.formAdd.flowId
              })[0].allData.setTimebyday === 'True'
            ) {
              let timeJson = JSON.parse(
                this.DataFlowNameDefault.filter(item => {
                  return item.value === this.formAdd.flowId
                })[0].allData.setTime
              ).filter(items => items.value === new Date(this.date).getDay())
              setTime = timeJson[0].setTime || []
              console.log('IF')
            } else {
              console.log('ELSE')
              setTime =
                JSON.parse(
                  this.DataFlowNameDefault.filter(item => {
                    return item.value === this.formAdd.flowId
                  })[0].allData.setTime
                ) || []
            }
            let dt = setTime
            // let dt = JSON.parse(this.branchData.filter(item => { return item.masBranchID === this.formAdd.masBranchID })[0].setTime) || []
            let dtint = '0'
            if (dt.filter(item => item.value === this.time.value).length > 0) {
              dtint = parseInt(
                dt.filter(item => item.value === this.time.value)[0]
                  .limitBooking || '0'
              )
            } else {
              dtint = '0'
            }
            console.log('test', dtint)
            if (
              item.flowId === this.formAdd.flowId &&
              item.bookingDate === this.date &&
              item.bookingTime === this.time.value
            ) {
              this.checkLimitBooking.ID = item.id
              console.log('1266')
              this.checkLimitBooking.countBooking =
                parseInt(item.countBooking) + 1
              this.checkLimitBooking.limitCheck =
                parseInt(item.countBooking) >= dtint ? 'false' : 'true'
              this.checkLimitBooking.limitBooking = dtint
              // console.log('item.masBranchID', item)
            }
          })
        }
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
        case 'EDIT':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_edit.validate()
          })
          break
        case 'REMOVE':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_remove.validate()
          })
          break
        case 'CHANGE':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_change.validate()
          })
          break
        case 'EXPORT':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_export.validate()
          })
          break
        case 'DEPOSIT':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_deposit.validate()
          })
          break
        case 'BOOKAGAIN':
          this.$nextTick(() => {
            let self = this
            self.$refs.form_bookingAgain.validate()
          })
          break

        default:
          break
      }
    },
    async getBookingList () {
      await this.getTagData()
      this.setTimerCalendar = null

      if (
        this.session.data.masBranchID === '' ||
        this.session.data.masBranchID === null
      ) {
        this.statusBranchReadonly = false
        if (this.masBranchID) {
          this.masBranchID = this.masBranchID
        } else {
          if (this.branch.length > 0) {
            this.masBranchID = this.branch[0].value
          } else {
            await this.getDataBranch()
            if (this.branch.length > 0) {
              this.masBranchID = this.branch[0].value
            } else {
              this.masBranchID = ''
              this.$swal(
                'ผิดพลาด',
                'กรุณาตรวจสอบสาขาของท่าน เนื่องจากระบบตรวจหาสาขาไม่พบ',
                'error'
              )
            }
          }
        }
      } else {
        this.statusBranchReadonly = true
        if (
          this.branch.filter(el => {
            return el.value === this.session.data.masBranchID
          }).length > 0
        ) {
          this.masBranchID = this.session.data.masBranchID
        } else {
          await this.getDataBranch()
          if (
            this.branch.filter(el => {
              return el.value === this.session.data.masBranchID
            }).length > 0
          ) {
            this.masBranchID = this.session.data.masBranchID
          } else {
            this.masBranchID = ''
            this.$swal(
              'ผิดพลาด',
              'กรุณาตรวจสอบสาขาของท่าน เนื่องจากระบบตรวจหาสาขาไม่พบ',
              'error'
            )
          }
        }
      }
      if (this.flowSelect !== '') {
        this.flowSelect = this.flowSelect
      } else {
        this.DataFlowName = this.DataFlowNameDefault.filter(el => {
          return (
            parseInt(el.masBranchID) === this.masBranchID ||
            el.value === 'AllFlow' ||
            el.value === 'All'
          )
        })
        if (this.DataFlowName.length > 0) {
          console.log('masBranchID', this.DataFlowName)
          this.flowSelect = this.DataFlowName[0].value
        } else {
          this.flowSelect = ''
          await this.getDataFlow()
          console.log('masBranchID', this.DataFlowName)
          this.flowSelect = this.DataFlowName[0].value
        }
      }
      this.selectedStatus = true
      this.dataItem = []
      this.countWaiting = 0
      this.countConfirm = 0
      this.countCancel = 0
      this.countJob = 0
      this.countAll = 0
      var dataItemTimes = []
      var dataItems = []
      let urlApi = ''
      if (this.flowSelect === 'AllFlow') {
        urlApi =
          this.DNS_IP +
          '/booking_view/get?shopId=' +
          this.session.data.shopId +
          '&masBranchID=' +
          this.masBranchID +
          '&dueDate=' +
          this.dateStart +
          this.selectOnsite
      } else {
        urlApi =
          this.DNS_IP +
          '/booking_view/get?shopId=' +
          this.session.data.shopId +
          '&masBranchID=' +
          this.masBranchID +
          '&dueDate=' +
          this.dateStart +
          '&flowId=' +
          this.flowSelect +
          this.selectOnsite
      }
      await axios
        .get(urlApi)
        .then(async response => {
          console.log('getData', response.data.length)
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let d = response.data[i]
              let s = {}
              s.bookNo = d.bookNo
              s.flowId = d.flowId
              let checkDeposit = this.DataFlowNameDefault.filter(el => {
                return el.value === parseInt(d.flowId)
              })
              if (checkDeposit.length > 0) {
                s.depositCheckStatus =
                  checkDeposit[0].allData.checkDeposit || 'False'
              } else {
                s.depositCheckStatus = 'False'
              }
              s.flowName = d.flowName
              s.dueDate = d.dueDate || ''
              if (d.timeText === null || d.timeText === '') {
                d.timeText = d.timeDue
              }
              if (s.dueDate === '') {
                s.dueDateText = 'ไม่มีเวลานัดหมาย'
              } else {
                s.dueDateText = d.dueDateTextDay + ' ' + d.timeText
              }
              s.cusName = d.bookingDataCustomerName || ''
              s.cusReg = d.bookingDataCustomerRegisNumber || ''
              s.tel = d.bookingDataCustomerTel || ''
              s.displayFlowName = d.displayFlowName || ''
              s.shopId = d.shopId
              s.dueDateDay = d.dueDateDay
              s.statusVIP = d.statusVIP
              s.checkDateConfirmJob = d.checkDateConfirmJob
              s.packageName = d.packageName
              s.packageDetails = d.packageDetails
              s.packageImage = d.packageImage
              s.packagePrice = d.packagePrice
              s.packageBalanceAmount = d.packageBalanceAmount
              s.packageAmount = d.packageAmount
              s.packagePoint = d.packagePoint
              s.packageExpire = d.packageExpire
              s.depositTextTH = d.depositTextTH
              s.CREATE_DATE_Status = d.CREATE_DATE_Status
              s.CREATE_DATE = d.CREATE_DATE
              s.menuShowStatus = d.menuShowStatus
              s.dueDateTextDay = d.dueDateTextDay
              s.remark = d.remark || ''
              s.masBranchID = d.masBranchID
              s.limitBookingCheck = d.limitBookingCheck
              s.memberId = d.memberId || ''
              s.countHourLimit = d.countHourLimit
              s.empSelect = d.empSelect
              s.empFull_NameTH = d.empFull_NameTH || ''
              s.empFull_NameTH = s.empFull_NameTH.replace('นางสาว', '')
              s.empFull_NameTH = s.empFull_NameTH.replace('นาย', '')
              s.empFull_NameTH = s.empFull_NameTH.replace('นาง', '')
              s.userId = d.userId
              s.chkConfirm = false
              s.chkCancel = false
              s.address = d.address
              s.addressLatLong = d.addressLatLong
              s.jobNo = d.jobNo
              s.timeText = d.timeText
              s.remarkRemove = d.remarkRemove || ''
              s.remarkConfirm1 =
                d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True'
              s.remarkConfirm2 =
                d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True'
              s.extraJob = d.extraJob === 'true' || d.extraJob === 'True'
              s.fastTrack = d.fastTrack === 'true' || d.fastTrack === 'True'
              s.depositStatus = d.depositStatus || 'False'
              s.depositImge = d.depositImge || ''
              s.depositReturnImge = d.depositReturnImge || ''
              s.depositPrice = d.depositPrice || ''
              s.remarkDepositLinked = d.remarkDepositLinked || ''
              s.lineUserId = d.lineUserId
              s.memberPicture = d.memberPicture
              s.memberName = d.memberName
              s.timeDueHtext = d.timeDueH + ':00'
              s.timeDuetext = d.timeDue
              s.countChangeTime = d.countChangeTime || 0
              s.remarkReturn = d.remarkReturn || ''
              s.dateReturn = d.dateReturn || ''
              s.packageId = d.packageId || ''
              s.tokenPackage = d.tokenPackage || ''
              s.RECORD_STATUS_Job = d.RECORD_STATUS_Job || ''
              s.menuItem = d.menuItem || []
              s.menuPrice = d.menuPrice || ''
              s.memberDataTagName = []
              try {
                s.memberDataTag = JSON.parse(d.memberDataTag) || []
                if (s.memberDataTag.length > 0) {
                  s.tagDataShow = []
                  let memberDataTag = s.memberDataTag
                  for (let i = 0; i < memberDataTag.length; i++) {
                    let d = memberDataTag[i]
                    let x = {}
                    let checkTagItem = this.tagItem.filter(el => {
                      return el.value === d
                    })
                    if (checkTagItem.length > 0) {
                      x.text = checkTagItem[0].text
                      x.value = checkTagItem[0].value
                      s.tagDataShow.push(x)
                      s.memberDataTagName.push(x.text)
                    }
                  }
                }
                s.memberDataTagName = s.memberDataTagName.join(', ')
              } catch (error) {
                s.tagDataShow = []
                console.log(error)
              }
              this.countAll = this.countAll + 1
              if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
                s.chkConfirm = true
                s.chkCancel = false
              }
              if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
                s.chkConfirm = false
                s.chkCancel = true
              }
              s.statusBt = d.statusBt || 'wait'
              switch (d.statusBt) {
                case 'confirm':
                  s.statusBtText = 'ยืนยันแล้ว'
                  this.countConfirm = this.countConfirm + 1
                  break
                case 'cancel':
                  s.statusBtText = 'ยกเลิก'
                  this.countCancel = this.countCancel + 1
                  break
                case 'confirmJob':
                  s.statusBtText = 'รับรถแล้ว'
                  this.countJob = this.countJob + 1
                  break
              }
              var chkTime = this.dataItemTime.filter(el => {
                return el.timeDueHtext === s.timeDueHtext
              })
              if (chkTime.length === 0) {
                dataItemTimes.push(s)
              }
              if (s.statusBt !== 'wait') {
                dataItems.push(s)
              }
            }
            console.log('dataItemsnn', dataItems)
          }
        })
        .catch(error => {
          console.log(error)
          this.dataReady = true
        })
      let urlApiwait = ''
      if (this.flowSelect === 'AllFlow') {
        urlApiwait =
          this.DNS_IP +
          '/booking_view/get?shopId=' +
          this.session.data.shopId +
          '&masBranchID=' +
          this.masBranchID +
          '&statusBt=null' +
          this.selectOnsite
      } else {
        urlApiwait =
          this.DNS_IP +
          '/booking_view/get?shopId=' +
          this.session.data.shopId +
          '&masBranchID=' +
          this.masBranchID +
          '&statusBt=null&flowId=' +
          this.flowSelect +
          this.selectOnsite
      }
      await axios.get(urlApiwait).then(async responses => {
        if (responses.data.length > 0) {
          for (let i = 0; i < responses.data.length; i++) {
            let d = responses.data[i]
            let s = {}
            s.bookNo = d.bookNo
            s.flowId = d.flowId
            let checkDeposit = this.DataFlowNameDefault.filter(el => {
              return el.value === parseInt(d.flowId)
            })
            if (checkDeposit.length > 0) {
              s.depositCheckStatus =
                checkDeposit[0].allData.checkDeposit || 'False'
            } else {
              s.depositCheckStatus = 'False'
            }
            s.flowName = d.flowName
            s.dueDate = d.dueDate || ''
            if (d.timeText === null || d.timeText === '') {
              d.timeText = d.timeDue
            }
            if (s.dueDate === '') {
              s.dueDateText = 'ไม่มีเวลานัดหมาย'
            } else {
              s.dueDateText = d.dueDateTextDay + ' ' + d.timeText
            }
            s.statusUpload1 = d.statusUpload1 || 'False'
            s.statusUpload2 = d.statusUpload2 || 'False'
            s.fileUpload1 = d.fileUpload1 || '[]'
            s.fileUpload2 = d.fileUpload2 || '[]'
            s.shopId = d.shopId
            s.dueDateDay = d.dueDateDay
            s.statusVIP = d.statusVIP
            s.checkDateConfirmJob = d.checkDateConfirmJob
            s.packageName = d.packageName
            s.packageDetails = d.packageDetails
            s.packageImage = d.packageImage
            s.packagePrice = d.packagePrice
            s.packageBalanceAmount = d.packageBalanceAmount
            s.packageAmount = d.packageAmount
            s.packagePoint = d.packagePoint
            s.packageExpire = d.packageExpire
            s.depositTextTH = d.depositTextTH
            s.CREATE_DATE_Status = d.CREATE_DATE_Status
            s.CREATE_DATE = d.CREATE_DATE
            s.menuShowStatus = d.menuShowStatus
            s.dueDateTextDay = d.dueDateTextDay
            s.remark = d.remark || ''
            s.masBranchID = d.masBranchID
            s.limitBookingCheck = d.limitBookingCheck
            s.memberId = d.memberId || ''
            s.countHourLimit = d.countHourLimit
            s.empSelect = d.empSelect
            s.empFull_NameTH = d.empFull_NameTH || ''
            s.empFull_NameTH = s.empFull_NameTH.replace('นางสาว', '')
            s.empFull_NameTH = s.empFull_NameTH.replace('นาย', '')
            s.empFull_NameTH = s.empFull_NameTH.replace('นาง', '')
            s.userId = d.userId
            s.chkConfirm = false
            s.chkCancel = false
            s.address = d.address
            s.addressLatLong = d.addressLatLong
            s.jobNo = d.jobNo
            s.timeText = d.timeText
            s.remarkRemove = d.remarkRemove || ''
            s.remarkConfirm1 =
              d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True'
            s.remarkConfirm2 =
              d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True'
            s.extraJob = d.extraJob === 'true' || d.extraJob === 'True'
            s.fastTrack = d.fastTrack === 'true' || d.fastTrack === 'True'
            s.depositStatus = d.depositStatus || 'False'
            s.depositImge = d.depositImge || ''
            s.depositReturnImge = d.depositReturnImge || ''
            s.depositPrice = d.depositPrice || ''
            s.remarkDepositLinked = d.remarkDepositLinked || ''
            s.lineUserId = d.lineUserId
            s.memberPicture = d.memberPicture
            s.memberName = d.memberName
            s.timeDueHtext = d.timeDueH + ':00'
            s.timeDuetext = d.timeDue
            s.countChangeTime = d.countChangeTime || 0
            s.remarkReturn = d.remarkReturn || ''
            s.dateReturn = d.dateReturn || ''
            s.packageId = d.packageId || ''
            s.tokenPackage = d.tokenPackage || ''
            s.RECORD_STATUS_Job = d.RECORD_STATUS_Job || ''
            s.menuItem = d.menuItem || []
            s.menuPrice = d.menuPrice || ''
            this.countAll = this.countAll + 1
            if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
              s.chkConfirm = true
              s.chkCancel = false
            }
            if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
              s.chkConfirm = false
              s.chkCancel = true
            }
            s.statusBt = d.statusBt || 'wait'
            switch (s.statusBt) {
              case 'wait':
                s.statusBtText = 'รายการนัดหมายใหม่'
                this.countWaiting = this.countWaiting + 1
                break
            }
            var chkTime = this.dataItemTime.filter(el => {
              return el.timeDueHtext === s.timeDueHtext
            })
            if (chkTime.length === 0) {
              dataItemTimes.push(s)
            }
            s.cusName = d.bookingDataCustomerName || ''
            s.cusReg = d.bookingDataCustomerRegisNumber || ''
            s.tel = d.bookingDataCustomerTel || ''
            s.displayFlowName = d.displayFlowName || ''
            s.memberDataTagName = []
            s.memberDataTag = JSON.parse(d.memberDataTag) || []
            if (s.memberDataTag.length > 0) {
              s.tagDataShow = []
              let memberDataTag = s.memberDataTag
              for (let i = 0; i < memberDataTag.length; i++) {
                let d = memberDataTag[i]
                let x = {}
                let checkTagItem = this.tagItem.filter(el => {
                  return el.value === d
                })
                if (checkTagItem.length > 0) {
                  x.text = checkTagItem[0].text
                  x.value = checkTagItem[0].value
                  s.tagDataShow.push(x)
                  s.memberDataTagName.push(x.text)
                }
              }
            }
            s.memberDataTagName = s.memberDataTagName.join(', ')
            dataItems.push(s)
          }
        }
      })
      if (dataItems.length === 0 || dataItems.status === false) {
        this.dataItem = []
        this.dataItemTime = []
        if (this.getSelectText) {
          this.getSelect(this.getSelectText, 0, this.filterCloseJobValue)
        } else {
          this.getSelect('wait', this.countWaiting, this.filterCloseJobValue)
        }
        this.dataReady = true
      } else {
        this.dataItem = dataItems
        var datause = dataItemTimes.sort((a, b) => {
          if (a.timeDueHtext < b.timeDueHtext) return -1
          return a.timeDueHtext > b.timeDueHtext ? 1 : 0
        })
        for (var k = 0; k < datause.length; k++) {
          var t = datause[k]
          var h = {}
          h.timeDueHtext = t.timeDueHtext
          let chkTimes = this.dataItemTime.filter(el => {
            return el.timeDueHtext === t.timeDueHtext
          })
          if (chkTimes.length === 0) {
            this.dataItemTime.push(h)
          }
        }
        if (this.$route.query.bookNoNoti) {
          let checkBook = dataItems.filter(el => {
            return el.bookNo === this.$route.query.bookNoNoti
          })
          if (checkBook.length > 0) {
            this.getSelectText = checkBook[0].statusBt
            this.searchAll2 = checkBook[0].cusName
          }
        }
        if (this.getSelectText) {
          this.getSelect(this.getSelectText, 0, this.filterCloseJobValue)
        } else {
          this.getSelect('wait', this.countWaiting, this.filterCloseJobValue)
        }
        this.dataReady = true
      }
    },
    async searchAny () {
      if (this.searchOther.trim().length > 1) {
        this.selectedStatus = true
        this.dataItem = []
        this.countWaiting = 0
        this.countConfirm = 0
        this.countCancel = 0
        this.countJob = 0
        this.countAll = 0
        this.searchAll2 = ''
        var dataItemTimes = []
        var dataItems = []
        let categoryUser = ''
        if (
          this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
          this.$session.getAll().data.category === '7'
        ) {
          categoryUser = 'ธุรกิจรถยนต์'
        } else {
          categoryUser = this.$session.getAll().data.category
        }
        await axios
          .get(
            this.DNS_IP +
              '/booking_view/getSearchName?shopId=' +
              this.session.data.shopId +
              '&category=' +
              categoryUser +
              '&masBranchID=' +
              this.masBranchID +
              '&fieldValue=' +
              this.searchOther +
              this.selectOnsite
          )
          .then(async response => {
            if (response.data.length > 0) {
              for (let i = 0; i < response.data.length; i++) {
                let d = response.data[i]
                let s = {}
                if (
                  dataItems.filter(el => {
                    return el.bookNo === d.bookNo
                  }).length === 0
                ) {
                  s.bookNo = d.bookNo
                  s.flowId = d.flowId
                  let checkDeposit = this.DataFlowNameDefault.filter(el => {
                    return el.value === parseInt(d.flowId)
                  })
                  if (checkDeposit.length > 0) {
                    s.depositCheckStatus =
                      checkDeposit[0].allData.checkDeposit || 'False'
                  } else {
                    s.depositCheckStatus = 'False'
                  }
                  s.flowName = d.flowName
                  s.dueDate = d.dueDate || ''
                  if (d.timeText === null || d.timeText === '') {
                    d.timeText = d.timeDue
                  }
                  if (s.dueDate === '') {
                    s.dueDateText = 'ไม่มีเวลานัดหมาย'
                  } else {
                    s.dueDateText = d.dueDateTextDay + ' ' + d.timeText
                  }
                  s.shopId = d.shopId
                  s.dueDateDay = d.dueDateDay
                  s.statusVIP = d.statusVIP
                  s.checkDateConfirmJob = d.checkDateConfirmJob
                  s.packageName = d.packageName
                  s.packageDetails = d.packageDetails
                  s.packageImage = d.packageImage
                  s.packagePrice = d.packagePrice
                  s.packageBalanceAmount = d.packageBalanceAmount
                  s.packageAmount = d.packageAmount
                  s.packagePoint = d.packagePoint
                  s.packageExpire = d.packageExpire
                  s.depositTextTH = d.depositTextTH
                  s.CREATE_DATE_Status = d.CREATE_DATE_Status
                  s.CREATE_DATE = d.CREATE_DATE
                  s.menuShowStatus = d.menuShowStatus
                  s.dueDateTextDay = d.dueDateTextDay
                  s.remark = d.remark || ''
                  s.masBranchID = d.masBranchID
                  s.limitBookingCheck = d.limitBookingCheck
                  s.memberId = d.memberId || ''
                  s.countHourLimit = d.countHourLimit
                  s.empSelect = d.empSelect
                  s.empFull_NameTH = d.empFull_NameTH || ''
                  s.empFull_NameTH = s.empFull_NameTH.replace('นางสาว', '')
                  s.empFull_NameTH = s.empFull_NameTH.replace('นาย', '')
                  s.empFull_NameTH = s.empFull_NameTH.replace('นาง', '')
                  s.userId = d.userId
                  s.chkConfirm = false
                  s.chkCancel = false
                  s.address = d.address
                  s.addressLatLong = d.addressLatLong
                  s.jobNo = d.jobNo
                  s.timeText = d.timeText
                  s.remarkRemove = d.remarkRemove || ''
                  s.remarkConfirm1 =
                    d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True'
                  s.remarkConfirm2 =
                    d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True'
                  s.extraJob = d.extraJob === 'true' || d.extraJob === 'True'
                  s.fastTrack =
                    d.fastTrack === 'true' || d.fastTrack === 'True'
                  s.depositStatus = d.depositStatus || 'False'
                  s.depositImge = d.depositImge || ''
                  s.depositReturnImge = d.depositReturnImge || ''
                  s.depositPrice = d.depositPrice || ''
                  s.remarkDepositLinked = d.remarkDepositLinked || ''
                  s.lineUserId = d.lineUserId
                  s.memberPicture = d.memberPicture
                  s.memberName = d.memberName
                  s.timeDueHtext = d.timeDueH + ':00'
                  s.timeDuetext = d.timeDue
                  s.countChangeTime = d.countChangeTime || 0
                  s.remarkReturn = d.remarkReturn || ''
                  s.dateReturn = d.dateReturn || ''
                  s.packageId = d.packageId || ''
                  s.tokenPackage = d.tokenPackage || ''
                  s.RECORD_STATUS_Job = d.RECORD_STATUS_Job || ''
                  s.menuItem = d.menuItem || []
                  s.menuPrice = d.menuPrice || ''
                  this.countAll = this.countAll + 1
                  if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
                    s.chkConfirm = true
                    s.chkCancel = false
                  }
                  if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
                    s.chkConfirm = false
                    s.chkCancel = true
                  }
                  s.statusBt = d.statusBt || 'wait'
                  switch (d.statusBt) {
                    case 'confirm':
                      s.statusBtText = 'ยืนยันแล้ว'
                      this.countConfirm = this.countConfirm + 1
                      break
                    case 'cancel':
                      s.statusBtText = 'ยกเลิก'
                      this.countCancel = this.countCancel + 1
                      break
                    case 'confirmJob':
                      s.statusBtText = 'รับรถแล้ว'
                      this.countJob = this.countJob + 1
                      break
                  }
                  var chkTime = this.dataItemTime.filter(el => {
                    return el.timeDueHtext === s.timeDueHtext
                  })
                  if (chkTime.length === 0) {
                    dataItemTimes.push(s)
                  }
                  try {
                    s.memberDataTagName = []
                    s.memberDataTag = JSON.parse(d.memberDataTag) || []
                    if (s.memberDataTag.length > 0) {
                      s.tagDataShow = []
                      let memberDataTag = s.memberDataTag
                      for (let i = 0; i < memberDataTag.length; i++) {
                        let d = memberDataTag[i]
                        let x = {}
                        let checkTagItem = this.tagItem.filter(el => {
                          return el.value === d
                        })
                        if (checkTagItem.length > 0) {
                          x.text = checkTagItem[0].text
                          x.value = checkTagItem[0].value
                          s.tagDataShow.push(x)
                        }
                      }
                    }
                  } catch (error) {
                    console.log(error)
                  }
                  s.cusName = d.bookingDataCustomerName || ''
                  s.cusReg = d.bookingDataCustomerRegisNumber || ''
                  s.tel = d.bookingDataCustomerTel || ''
                  s.displayFlowName = d.displayFlowName || ''
                  dataItems.push(s)
                }
              }
            }
            if (dataItems.length === 0 || dataItems.status === false) {
              this.dataItem = []
              this.dataItemTime = []
              if (this.getSelectText) {
                this.getSelect(this.getSelectText, 0, this.filterCloseJobValue)
              } else {
                this.getSelect(
                  'wait',
                  this.countWaiting,
                  this.filterCloseJobValue
                )
              }
              this.dataReady = true
            } else {
              this.dataItem = dataItems
              var datause = dataItemTimes.sort((a, b) => {
                if (a.timeDueHtext < b.timeDueHtext) return -1
                return a.timeDueHtext > b.timeDueHtext ? 1 : 0
              })
              console.log('datause', datause)
              for (var k = 0; k < datause.length; k++) {
                var t = datause[k]
                var h = {}
                h.timeDueHtext = t.timeDueHtext
                let chkTimes = this.dataItemTime.filter(el => {
                  return el.timeDueHtext === t.timeDueHtext
                })
                if (chkTimes.length === 0) {
                  this.dataItemTime.push(h)
                }
              }
              if (this.getSelectText) {
                this.getSelect(this.getSelectText, 0, this.filterCloseJobValue)
              } else {
                this.getSelect(
                  'wait',
                  this.countWaiting,
                  this.filterCloseJobValue
                )
              }
              console.log('this.BookingDataList', this.BookingDataList)
              this.dataReady = true
            }
          })
          .catch(error => {
            console.log(error)
            this.dataReady = true
            this.searchAny()
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาใส่คำค้นหาให้มากว่า 1 ตัวอักษร', 'error')
      }
    },
    getSelect (text, count, filterCloseJobValue) {
      this.selectedStatus = true
      this.getSelectText = text
      this.getSelectCount = count || 0
      this.dataItemSelect = []
      this.columnsSelected = []
      if (text === 'all') {
        if (this.dataItem.length > 0) {
          this.checkSelectText = this.dataItem[0].statusBt
          for (let x = 0; x < this.dataItem.length; x++) {
            let t = this.dataItem[x]
            t.flowNameShow = t.displayFlowName
              ? t.flowName + ' : ' + t.displayFlowName
              : t.flowName
            this.dataItemSelect.push(t)
          }
        } else {
          this.dataItemSelect = []
        }
        this.columnsSelected = [
          { text: 'ชื่อลูกค้า', value: 'cusName', sortable: false },
          { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
          { text: 'บริการ', value: 'flowNameShow', sortable: false },
          { text: 'เบอร์โทร', value: 'tel', sortable: false },
          {
            text: 'เงินมัดจำ',
            value: 'action40',
            sortable: false,
            align: 'center'
          },
          {
            text: 'หมายเหตุที่ยกเลิก',
            value: 'remarkRemove',
            sortable: false,
            align: 'center'
          },
          {
            text: 'ชื่อพนักงาน',
            value: 'empFull_NameTH',
            align: 'center',
            sortable: false
          },
          {
            text: 'หมายเหตุ',
            value: 'remark',
            align: 'center',
            sortable: false
          },
          { text: 'จัดการ', value: 'action', sortable: false, align: 'center' }
        ]
      } else {
        var dataSelect = []
        if (text === 'confirmSum') {
          dataSelect = this.dataItem.filter(el => {
            return el.statusBt === 'confirm' || el.statusBt === 'confirmJob'
          })
          this.countJob = this.dataItem.filter(el => {
            return el.statusBt === 'confirmJob'
          }).length
          this.filterCloseJobValue = 'ทั้งหมด'
        } else {
          if (text === 'confirmJob') {
            if (filterCloseJobValue) {
              if (filterCloseJobValue === 'ยังไม่ปิดงาน') {
                dataSelect = this.dataItem.filter(el => {
                  return el.statusBt === text && el.RECORD_STATUS_Job === 'N'
                })
                this.countJob = dataSelect.length
              } else if (filterCloseJobValue === 'ปิดงาน') {
                dataSelect = this.dataItem.filter(el => {
                  return el.statusBt === text && el.RECORD_STATUS_Job === 'D'
                })
                this.countJob = dataSelect.length
              } else {
                dataSelect = this.dataItem.filter(el => {
                  return el.statusBt === text
                })
                this.countJob = dataSelect.length
              }
            } else {
              dataSelect = this.dataItem.filter(el => {
                return el.statusBt === text
              })
              this.countJob = dataSelect.length
            }
          } else {
            dataSelect = this.dataItem.filter(el => {
              return el.statusBt === text
            })
          }
        }
        if (dataSelect.length > 0) {
          this.checkSelectText = dataSelect[0].statusBt
          for (let x = 0; x < dataSelect.length; x++) {
            let t = dataSelect[x]
            t.flowNameShow = t.displayFlowName
              ? t.flowName + ' : ' + t.displayFlowName
              : t.flowName
            this.dataItemSelect.push(t)
          }
        } else {
          this.dataItemSelect = []
        }
        if (text === 'cancel') {
          if (
            this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
            this.$session.getAll().data.category === '7'
          ) {
            this.columnsSelected = [
              { text: 'ชื่อลูกค้า', value: 'cusName', width: '150' },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              { text: 'บริการ', value: 'flowNameShow', width: '200' },
              { text: 'เลขทะเบียน', value: 'cusReg', width: '120' },
              { text: 'เบอร์โทร', value: 'tel' },
              {
                text: 'หมายเหตุที่ยกเลิก',
                value: 'remarkRemove',
                sortable: false,
                align: 'center'
              },
              { text: 'ชื่อพนักงาน', value: 'empFull_NameTH', align: 'center' },
              {
                text: 'หมายเหตุ',
                value: 'remark',
                align: 'center',
                width: '120'
              },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center'
              }
            ]
          } else {
            this.columnsSelected = [
              { text: 'ชื่อลูกค้า', value: 'cusName', width: '150' },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              { text: 'บริการ', value: 'flowNameShow' },
              { text: 'เบอร์โทร', value: 'tel' },
              {
                text: 'หมายเหตุที่ยกเลิก',
                value: 'remarkRemove',
                sortable: false,
                align: 'center'
              },
              { text: 'ชื่อพนักงาน', value: 'empFull_NameTH', align: 'center' },
              {
                text: 'หมายเหตุ',
                value: 'remark',
                align: 'center',
                width: '120'
              },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center'
              }
            ]
          }
        } else if (text === 'confirm') {
          if (
            this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
            this.$session.getAll().data.category === '7'
          ) {
            this.columnsSelected = [
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '120',
                sortable: false
              },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                sortable: false,
                width: '200'
              },
              { text: 'เลขทะเบียน', value: 'cusReg', width: '120' },
              { text: 'เบอร์โทร', value: 'tel', sortable: false },
              {
                text: 'เงินมัดจำ',
                value: 'action40',
                sortable: false,
                align: 'center'
              },
              {
                text: 'ป้ายชื่อกำกับ',
                value: 'memberDataTagName',
                sortable: false,
                align: 'center',
                width: '150'
              },
              {
                text: 'Confirm นัดล่วงหน้า',
                value: 'action2',
                sortable: false,
                align: 'center'
              },
              {
                text: 'ชื่อพนักงาน',
                value: 'empFull_NameTH',
                align: 'center',
                sortable: false
              },
              {
                text: 'หมายเหตุ',
                value: 'remark',
                align: 'center',
                sortable: false,
                width: '160'
              },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center',
                width: '120'
              }
            ]
          } else {
            this.columnsSelected = [
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '120',
                sortable: false
              },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                sortable: false,
                width: '150'
              },
              { text: 'เบอร์โทร', value: 'tel', sortable: false },
              {
                text: 'เงินมัดจำ',
                value: 'action40',
                sortable: false,
                align: 'center'
              },
              {
                text: 'ป้ายชื่อกำกับ',
                value: 'memberDataTagName',
                sortable: false,
                align: 'center',
                width: '150'
              },
              {
                text: 'Confirm นัดล่วงหน้า',
                value: 'action2',
                sortable: false,
                align: 'center'
              },
              {
                text: 'ชื่อพนักงาน',
                value: 'empFull_NameTH',
                align: 'center',
                sortable: false
              },
              {
                text: 'หมายเหตุ',
                value: 'remark',
                align: 'center',
                sortable: false,
                width: '160'
              },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center',
                width: '120'
              }
            ]
          }
        } else if (text === 'wait') {
          if (
            this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
            this.$session.getAll().data.category === '7'
          ) {
            this.columnsSelected = [
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '150',
                sortable: false
              },
              {
                text: 'วันที่/เวลา',
                value: 'dueDate',
                width: '150',
                sortable: false
              },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                width: '150',
                sortable: false
              },
              { text: 'เลขทะเบียน', value: 'cusReg', width: '120' },
              { text: 'เบอร์โทร', value: 'tel', sortable: false, width: '120' },
              {
                text: 'เงินมัดจำ',
                value: 'action40',
                align: 'center',
                width: '120',
                sortable: false
              },
              {
                text: 'ป้ายชื่อกำกับ',
                value: 'memberDataTagName',
                sortable: false,
                align: 'center',
                width: '160'
              },
              {
                text: 'หมายเหตุ',
                value: 'remark',
                align: 'center',
                sortable: false,
                width: '150'
              },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center',
                width: '100'
              }
            ]
          } else {
            this.columnsSelected = [
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '150',
                sortable: false
              },
              {
                text: 'วันที่/เวลา',
                value: 'dueDate',
                width: '150',
                sortable: false
              },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                width: '150',
                sortable: false
              },
              { text: 'เบอร์โทร', value: 'tel', sortable: false, width: '120' },
              {
                text: 'เงินมัดจำ',
                value: 'action40',
                align: 'center',
                width: '120',
                sortable: false
              },
              {
                text: 'ป้ายชื่อกำกับ',
                value: 'memberDataTagName',
                sortable: false,
                align: 'center',
                width: '150'
              },
              {
                text: 'หมายเหตุ',
                value: 'remark',
                align: 'center',
                sortable: false,
                width: '150'
              },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center',
                width: '100'
              }
            ]
          }
        } else if (text === 'confirmJob') {
          if (
            this.$session.getAll().data.shopId ===
            'U9f316c85400fd716ea8c80d7cd5b61f8'
          ) {
            this.columnsSelected = [
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '150',
                sortable: false
              },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                sortable: false,
                width: '150'
              },
              { text: 'เบอร์โทร', value: 'tel', sortable: false },
              {
                text: 'Confirm นัดล่วงหน้า',
                value: 'action2',
                sortable: false,
                align: 'center'
              },
              {
                text: 'หมายเหตุ',
                value: 'remark',
                align: 'center',
                sortable: false,
                width: '120'
              },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center',
                width: '100'
              }
            ]
          } else {
            if (
              this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
              this.$session.getAll().data.category === '7'
            ) {
              this.columnsSelected = [
                {
                  text: 'ชื่อลูกค้า',
                  value: 'cusName',
                  width: '150',
                  sortable: false
                },
                { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
                {
                  text: 'บริการ',
                  value: 'flowNameShow',
                  sortable: false,
                  width: '150'
                },
                { text: 'เลขทะเบียน', value: 'cusReg', width: '120' },
                { text: 'เบอร์โทร', value: 'tel', sortable: false },
                {
                  text: 'ป้ายชื่อกำกับ',
                  value: 'memberDataTagName',
                  sortable: false,
                  align: 'center',
                  width: '150'
                },
                {
                  text: 'คุณสมบัติเพิ่มเติม',
                  value: 'action3',
                  sortable: false,
                  align: 'center'
                },
                {
                  text: 'Confirm นัดล่วงหน้า',
                  value: 'action2',
                  sortable: false,
                  align: 'center'
                },
                {
                  text: 'หมายเหตุ',
                  value: 'remark',
                  align: 'center',
                  sortable: false,
                  width: '120'
                },
                {
                  text: 'จัดการ',
                  value: 'action',
                  sortable: false,
                  align: 'center',
                  width: '100'
                }
              ]
            } else {
              this.columnsSelected = [
                {
                  text: 'ชื่อลูกค้า',
                  value: 'cusName',
                  width: '150',
                  sortable: false
                },
                { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
                {
                  text: 'บริการ',
                  value: 'flowNameShow',
                  sortable: false,
                  width: '150'
                },
                { text: 'เบอร์โทร', value: 'tel', sortable: false },
                {
                  text: 'ป้ายชื่อกำกับ',
                  value: 'memberDataTagName',
                  sortable: false,
                  align: 'center',
                  width: '150'
                },
                {
                  text: 'คุณสมบัติเพิ่มเติม',
                  value: 'action3',
                  sortable: false,
                  align: 'center'
                },
                {
                  text: 'Confirm นัดล่วงหน้า',
                  value: 'action2',
                  sortable: false,
                  align: 'center'
                },
                {
                  text: 'หมายเหตุ',
                  value: 'remark',
                  align: 'center',
                  sortable: false,
                  width: '120'
                },
                {
                  text: 'จัดการ',
                  value: 'action',
                  sortable: false,
                  align: 'center',
                  width: '100'
                }
              ]
            }
          }
        } else {
          if (
            this.$session.getAll().data.shopId ===
            'U9f316c85400fd716ea8c80d7cd5b61f8'
          ) {
            this.columnsSelected = [
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '150',
                sortable: false
              },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                sortable: false,
                width: '150'
              },
              { text: 'เบอร์โทร', value: 'tel', sortable: false },
              {
                text: 'Confirm นัดล่วงหน้า',
                value: 'action2',
                sortable: false,
                align: 'center'
              },
              {
                text: 'หมายเหตุ',
                value: 'remark',
                align: 'center',
                width: '170'
              },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center'
              }
            ]
          } else {
            if (
              this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
              this.$session.getAll().data.category === '7'
            ) {
              this.columnsSelected = [
                {
                  text: 'ชื่อลูกค้า',
                  value: 'cusName',
                  width: '150',
                  sortable: false
                },
                { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
                {
                  text: 'บริการ',
                  value: 'flowNameShow',
                  sortable: false,
                  width: '150'
                },
                { text: 'เลขทะเบียน', value: 'cusReg', width: '120' },
                { text: 'เบอร์โทร', value: 'tel', sortable: false },
                {
                  text: 'คุณสมบัติเพิ่มเติม',
                  value: 'action3',
                  sortable: false,
                  align: 'center',
                  width: '120'
                },
                {
                  text: 'Confirm นัดล่วงหน้า',
                  value: 'action2',
                  sortable: false,
                  align: 'center'
                },
                {
                  text: 'หมายเหตุ',
                  value: 'remark',
                  align: 'center',
                  width: '170'
                },
                {
                  text: 'จัดการ',
                  value: 'action',
                  sortable: false,
                  align: 'center'
                }
              ]
            } else {
              this.columnsSelected = [
                {
                  text: 'ชื่อลูกค้า',
                  value: 'cusName',
                  width: '150',
                  sortable: false
                },
                { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
                {
                  text: 'บริการ',
                  value: 'flowNameShow',
                  sortable: false,
                  width: '150'
                },
                { text: 'เบอร์โทร', value: 'tel', sortable: false },
                {
                  text: 'คุณสมบัติเพิ่มเติม',
                  value: 'action3',
                  sortable: false,
                  align: 'center',
                  width: '120'
                },
                {
                  text: 'Confirm นัดล่วงหน้า',
                  value: 'action2',
                  sortable: false,
                  align: 'center'
                },
                {
                  text: 'หมายเหตุ',
                  value: 'remark',
                  align: 'center',
                  width: '170'
                },
                {
                  text: 'จัดการ',
                  value: 'action',
                  sortable: false,
                  align: 'center'
                }
              ]
            }
          }
        }
      }
      this.checkTypeSort()
    },
    async getDataCalendaBooking () {
      console.log('this.$session.id()', this.$session.id())
      if (this.$session.id() !== undefined) {
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async getTagData () {
      this.tagItem = await this.getDataFromAPI(
        '/Mas_Tag/get',
        'tagId',
        'tagName',
        ''
      )
    },
    async getDataBranch () {
      let branchData = await this.getDataFromAPI(
        '/master_branch/get',
        'masBranchID',
        'masBranchName',
        ''
      )
      if (
        this.session.data.masBranchID === '' ||
        this.session.data.masBranchID === null
      ) {
        this.branch = branchData
      } else {
        let checkData = branchData.filter(el => {
          return el.value === this.session.data.masBranchID
        })
        if (checkData.length > 0) {
          this.branch = checkData
        } else {
          await this.getDataBranch()
          if (checkData.length > 0) {
            this.branch = checkData
          } else {
            this.branch = []
            this.$swal(
              'ผิดพลาด',
              'กรุณาตรวจสอบสาขาของท่าน เนื่องจากระบบตรวจหาสาขาไม่พบ',
              'error'
            )
          }
        }
      }
      console.log('NNNNNNNNNNN : ', this.branch.length)
      if (this.branch.length === 1) {
        this.selectBranch()
      }
    },
    selectBranch () {
      console.log('asdadsadasdasdasdasdas ')
      this.formAdd.masBranchID = this.branch[0].value
      this.priceMenuAdd = 0
      this.drawerAdd = false
      this.showMenu = 'False'
      this.setFlowByBranchAdd()
      this.getEmpSelectAdd()
      this.checkEmp()
    },
    async getDataFlow () {
      let result = []
      let resultOption = []
      console.log(
        '>>>>>',
        this.DNS_IP +
          `/flow/get?shopId=${this.session.data.shopId}${this.selectOnsite}`
      )
      await axios
        .get(
          this.DNS_IP +
            `/flow/get?shopId=${this.session.data.shopId}${this.selectOnsite}`
        )
        .then(response => {
          let rs = response.data
          console.log('rs >>>> ', rs)
          if (rs.length > 0) {
            result.push({ text: 'ทั้งหมด', value: 'AllFlow' })
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.flowName
              s.value = d.flowId
              s.menuShowStatus = d.menuShowStatus
              s.masBranchID = d.masBranchID
              s.allData = d
              result.push(s)
              resultOption.push(s)
            }
          } else {
            result = []
            resultOption = []
          }
        })
      console.log('><><><><><><><><><>', result)
      this.DataFlowNameDefault = result
      this.DataFlowNameMenu = result.filter(el => {
        return el.menuShowStatus === 'True'
      })
      console.log('resultOption : ', resultOption)
      // this.dataFlowSelectAdd = resultOption
      this.dataFlowSelectEdit = resultOption
    },
    checkTypeSort () {
      if (this.sortSelect && this.sort) {
        if (this.sortSelect === 'เรียงตามวันที่นัดหมาย') {
          if (this.sort === 'มากไปน้อย') {
            this.dataItemSelect.sort(function (a, b) {
              return new Date(b.dueDate) - new Date(a.dueDate)
            })
          } else {
            this.dataItemSelect.sort(function (a, b) {
              return new Date(a.dueDate) - new Date(b.dueDate)
            })
          }
        } else if (this.sortSelect === 'เรียงตามวันที่เปลี่ยนสถานะ') {
          if (this.sort === 'มากไปน้อย') {
            this.dataItemSelect.sort(function (a, b) {
              return (
                new Date(b.CREATE_DATE_Status) - new Date(a.CREATE_DATE_Status)
              )
            })
          } else {
            this.dataItemSelect.sort(function (a, b) {
              return (
                new Date(a.CREATE_DATE_Status) - new Date(b.CREATE_DATE_Status)
              )
            })
          }
        } else if (this.sortSelect === 'เรียงตามวันที่สร้าง') {
          if (this.sort === 'มากไปน้อย') {
            this.dataItemSelect.sort(function (a, b) {
              return new Date(b.CREATE_DATE) - new Date(a.CREATE_DATE)
            })
          } else {
            this.dataItemSelect.sort(function (a, b) {
              return new Date(a.CREATE_DATE) - new Date(b.CREATE_DATE)
            })
          }
        }
      }
    },
    async getBookingField () {
      // this.bookingField = []
      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.formAdd.bookingId = rs[0].bookingId
            let bookingData = []
            bookingData = JSON.parse(rs[0].flowfieldName)
            for (let i = 0; i < bookingData.length; i++) {
              let d = bookingData[i]
              itemIncustomField.push(d.fieldId)
            }
            await this.getCustomField(itemIncustomField)
          } else {
            this.$swal(
              'พบความผิดพลาดระหว่างดำเนินการ',
              'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่',
              'info'
            )
              .then(result => {
                this.dialogAdd = false
                this.clearDataAdd()
              })
              .catch(error => {
                console.log('error function addData : ', error)
                this.dialogAdd = false
                this.clearDataAdd()
              })
          }
        })
        .catch(error => {
          this.$swal(
            'พบความผิดพลาดระหว่างดำเนินการ',
            'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่',
            'info'
          )
            .then(result => {
              this.dialogAdd = false
              this.clearDataAdd()
            })
            .catch(error => {
              console.log('error function addData : ', error)
              this.dialogAdd = false
              this.clearDataAdd()
            })
          console.log('error function addData : ', error)
        })
    },
    async getCustomField (item) {
      this.fieldNameItem = []
      await axios
        .get(this.DNS_IP + '/customField/fieldId?fieldId=' + item)
        .then(async response => {
          let rs = response.data
          // let aa = []
          if (rs.length > 0) {
            let sortrs = rs.sort((a, b) => a.sortNoField - b.sortNoField)
            for (let i = 0; i < sortrs.length; i++) {
              let d = sortrs[i]
              let s = {}
              s.fieldId = d.fieldId
              s.fieldName = d.fieldName
              s.fieldType = d.fieldType
              s.optionField = d.optionField
              s.conditionField = d.conditionField
              s.conditionValue = d.conditionValue
              s.shopId = d.shopId
              s.fieldValue = ''
              s.requiredField = d.requiredField
              this.fieldNameItem.push(s)
            }
            var data1 = this.fieldNameItem.filter(
              el => parseInt(el.conditionField || 0) > 0
            )
            // var data2 = []
            for (var i = 0; i < data1.length; i++) {
              var d = data1[i]
              var indexC = this.fieldNameItem.findIndex(function (o) {
                return o.fieldId === d.fieldId
              })
              var indexF = this.fieldNameItem.findIndex(function (o) {
                return o.fieldId === parseInt(d.conditionField)
              })
              this.fieldNameItem.splice(
                indexF + 1,
                0,
                this.fieldNameItem.splice(indexC, 1)[0]
              )
              // data2.push({'indexC': indexC, 'indexF': indexF})
            }
            // setTimeout(() => this.validate('ADD'), 500)
          } else {
            this.$swal(
              'พบความผิดพลาดระหว่างดำเนินการ',
              'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่',
              'info'
            )
              .then(result => {
                this.dialogAdd = false
                this.clearDataAdd()
              })
              .catch(error => {
                console.log('error function addData : ', error)
                this.dialogAdd = false
                this.clearDataAdd()
              })
          }
        })
        .catch(error => {
          this.$swal(
            'พบความผิดพลาดระหว่างดำเนินการ',
            'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่',
            'info'
          )
            .then(result => {
              this.dialogAdd = false
              this.clearDataAdd()
            })
            .catch(error => {
              console.log('error function addData : ', error)
              this.dialogAdd = false
              this.clearDataAdd()
            })
          console.log('error function addData : ', error)
        })
    },
    async setLimitBooking (dateitem) {
      this.time = ''
      this.timeavailable = []
      this.limitBookingCheck = 'False'
      let setTime = []
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      if (
        this.DataFlowNameDefault.filter(el => {
          console.log('this.DataFlowNameDefault >>>>>>>', el.value)
          console.log('this.formAdd.flowId >>>>>>>', this.formAdd.flowId)
          return el.value === parseInt(this.formAdd.flowId)
        })[0].allData.setTimebyday === 'True'
      ) {
        try {
          let timeJson = JSON.parse(
            this.DataFlowNameDefault.filter(el => {
              return el.value === parseInt(this.formAdd.flowId)
            })[0].allData.setTime
          ).filter(items => items.value === new Date(dateitem).getDay())
          console.log('()()()()()()(()()()()()()()()()()(())())')

          setTime = timeJson[0].setTime || []
          console.log('timeJson[0].setTime :', timeJson[0].setTime)

          console.log('>>>>>>>>>>IF')
        } catch (err) {
          setTime = []
        }
      } else {
        console.log('>>>>>>>>>ELSE')
        setTime =
          JSON.parse(
            this.DataFlowNameDefault.filter(el => {
              return el.value === parseInt(this.formAdd.flowId)
            })[0].allData.setTime
          ) || []
      }
      if (
        this.DataFlowNameDefault.filter(el => {
          return el.value === parseInt(this.formAdd.flowId)
        }).length > 0
      ) {
        this.limitBookingCheck =
          this.DataFlowNameDefault.filter(el => {
            return el.value === parseInt(this.formAdd.flowId)
          })[0].allData.limitBookingCheck || 'False'
      } else {
        this.limitBookingCheck = 'False'
      }
      if (this.limitBookingCheck === 'True') {
        let TimeData = []
        let currentDate = setTime
        TimeData = currentDate
        if (this.statusVIP === 'False') {
          this.timeavailable = TimeData.filter(
            item => parseInt(item.limitBooking) > 0
          )
          console.log('TimeData', TimeData)
          if (this.timeavailable.length > 0) {
            let LimitBooking = await this.getLimitBooking()
            console.log('LimitBooking', LimitBooking)
            if (LimitBooking.status !== false) {
              if (LimitBooking.length > 0) {
                LimitBooking.forEach((i, n) => {
                  this.timeavailable.forEach((v, k) => {
                    if (i.bookingTime === v.value) {
                      if (i.countBooking >= parseInt(v.limitBooking)) {
                        this.timeavailable.splice(k, 1)
                      }
                    }
                  })
                })
                if (this.timeavailable.length === 0) {
                  this.$swal(
                    'คิวเต็มแล้ว',
                    'กรุณาเลือกวันที่ใหม่อีกครั้ง',
                    'error'
                  )
                  this.date = ''
                }
              }
              console.log('this.timeavailable IF', this.timeavailable)
            } else {
              this.timeavailable = TimeData.filter(
                item => parseInt(item.limitBooking) > 0
              )
              console.log('this.timeavailable ELSE', this.timeavailable)
            }
          } else {
            this.$swal('คิวเต็มแล้ว', 'กรุณาเลือกวันที่ใหม่อีกครั้ง', 'error')
            this.date = ''
          }
        } else {
          this.timeavailable = TimeData
        }
      } else {
        console.log('this.timeavailable ELSEEEEE', this.timeavailable)
        // LimitBookingBy Flow
        // this.timeavailable = JSON.parse(this.flowItemLimit.filter(item => { return item.flowId === this.formAdd.flowId })[0].setTime) || []

        // LimitBookingBy masBranch
        if (
          this.DataFlowNameDefault.filter(el => {
            return el.value === parseInt(this.formAdd.flowId)
          }).length > 0
        ) {
          this.timeavailable = setTime
        } else {
          this.timeavailable = []
        }
      }
    },
    async getLimitBooking () {
      let LimitBooking = axios
        .get(
          this.DNS_IP +
            '/LimitBookingDate/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&flowId=' +
            this.formAdd.flowId +
            '&bookingDate=' +
            this.date
        )
        .then(async response => {
          let rs = response.data
          return rs
        })
      return LimitBooking
    },
    async getMonth (month) {
      console.log('month', month)
      // console.log('!!!!!!!!!', this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.setTimebyday)
      // const result = await axios.get(this.DNS_IP + '/LimitBookingDate/get_LimitDate?shopId=' + this.$session.getAll().data.shopId + '&masBranchID=' + this.formAdd.masBranchID + '&bookingDate=' + month)
      const result = await axios.get(
        this.DNS_IP +
          '/LimitBookingDate/get_LimitDate?shopId=' +
          this.$session.getAll().data.shopId +
          '&flowId=' +
          this.formAdd.flowId +
          '&bookingDate=' +
          month
      )
      if (result.data.length > 0) {
        let setTimebyday = this.DataFlowNameDefault.filter(el => {
          return el.value === parseInt(this.formAdd.flowId)
        })[0].allData.setTimebyday
        console.log('getMonth IF', result.data)
        this.dateDaylimit = []
        // let dt = result.data
        const objectDT = result.data.reduce((acc, curr) => {
          const bookingDate = curr.bookingDate
          if (!acc[bookingDate]) {
            acc[bookingDate] = []
          }
          acc[bookingDate].push(curr)
          return acc
        }, {})

        console.log(objectDT)
        for (const dt in objectDT) {
          let statusOffDate1 = false
          if (objectDT[dt][0].limitBookingCheck === 'True') {
            objectDT[dt].forEach((v, k) => {
              if (JSON.parse(v.setTime)) {
                if (setTimebyday === 'True') {
                  JSON.parse(v.setTime)
                    .filter(
                      items => items.value === new Date(v.bookingDate).getDay()
                    )[0]
                    .setTime.forEach((v2, k2) => {
                      if (
                        parseInt(v2.limitBooking) > 0 &&
                        v.bookingTime === v2.value
                      ) {
                        console.log(
                          v.bookingDate,
                          '----',
                          'v',
                          v.bookingTime,
                          ' ',
                          v.countBooking,
                          '    ',
                          'v2',
                          v2.value,
                          ' ',
                          v2.limitBooking
                        )
                        if (v.bookingTime === v2.value) {
                          if (v.countBooking < parseInt(v2.limitBooking)) {
                            statusOffDate1 = true
                          }
                        }
                      } else if (parseInt(v2.limitBooking) > 0) {
                        if (
                          objectDT[dt].filter(aa => aa.bookingTime === v2.value)
                            .length === 0
                        ) {
                          console.log(v.bookingDate, '+++++', v2.value)
                          statusOffDate1 = true
                        }
                      }
                    })
                } else {
                  JSON.parse(v.setTime).forEach((v2, k2) => {
                    if (
                      parseInt(v2.limitBooking) > 0 &&
                      v.bookingTime === v2.value
                    ) {
                      console.log(
                        v.bookingDate,
                        '----',
                        'v',
                        v.bookingTime,
                        ' ',
                        v.countBooking,
                        '    ',
                        'v2',
                        v2.value,
                        ' ',
                        v2.limitBooking
                      )
                      if (v.bookingTime === v2.value) {
                        if (v.countBooking < parseInt(v2.limitBooking)) {
                          statusOffDate1 = true
                        }
                      }
                    } else if (parseInt(v2.limitBooking) > 0) {
                      if (
                        objectDT[dt].filter(aa => aa.bookingTime === v2.value)
                          .length === 0
                      ) {
                        console.log(v.bookingDate, '+++++', v2.value)
                        statusOffDate1 = true
                      }
                    }
                  })
                }
              }
            })
            if (statusOffDate1 === false) {
              this.dateDaylimit.push(
                moment(objectDT[dt][0].bookingDate).format('YYYY-MM-DD')
              )
            }
          } else {
            this.dateDaylimit = []
          }
        }
      } else {
        console.log('getMonth ELSE')
        this.dateDaylimit = []
      }
    },
    closeSetTimeGetCalenda () {
      this.setTimerCalendar = null
    },
    async checkShowDataOnsite () {
      this.dataReady = false
      let text = await this.getShowOnsite()
      if (text === 'ไม่แสดง') {
        this.showOnsite = 'แสดง'
        this.selectOnsite = '&checkOnsite=is null'
        // this.updateShowOnsite('ไม่แสดง')
      } else {
        this.showOnsite = 'ไม่แสดง'
        this.selectOnsite = '&checkOnsite=True'
        // this.updateShowOnsite('แสดง')
      }
      if (this.$route.query.bookNo) {
        // this.beforeCreateScan()
        await this.getDataFlow()
        await this.getDataBranch()
        await this.getEmpSelectAdd()
        await this.getBookingFieldText()
        this.getCustomFieldStart()
        // await this.scanQrcode()
        // this.getBookingList()
      } else {
        await this.getDataFlow()
        await this.getDataBranch()
        await this.getEmpSelectAdd()
        await this.getBookingFieldText()
        this.getCustomFieldStart()
        // this.getBookingList()
      }
    },
    async getEmpSelectAdd () {
      this.empSelectStepAdd = []
      await axios
        .get(
          this.DNS_IP +
            '/empSelect/getUse?privacyPage=booking&shopId=' +
            this.$session.getAll().data.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              d.masBranchID = d.masBranchID || ''
              console.log(
                'this.$session.getAll().data.masBranchID',
                this.$session.getAll().data.masBranchID
              )
              if (
                this.$session.getAll().data.masBranchID === '' ||
                this.$session.getAll().data.masBranchID === null
              ) {
                // console.log('D', d)
                let s = {}
                s.text = d.empFirst_NameTH
                s.value = d.empId
                s.masBranchID = d.masBranchID
                this.empSelectStepAdd.push(s)
              } else {
                if (
                  this.$session.getAll().data.masBranchID === d.masBranchID ||
                  d.masBranchID === ''
                ) {
                  let s = {}
                  s.text = d.empFirst_NameTH
                  s.value = d.empId
                  s.masBranchID = d.masBranchID
                  this.empSelectStepAdd.push(s)
                }
              }
            }
            console.log('this.empSelectStepAdd :', this.empSelectStepAdd)
            console.log(
              'this.$session.getAll().data.empId :',
              this.$session.getAll().data.empId
            )
            // console.log('parseInt(this.$session.getAll().data.empId))[0] :', parseInt(this.$session.getAll().data.empId))[0])
            if (
              this.$session.getAll().data.empId !== '' &&
              this.$session.getAll().data.empId !== null
            ) {
              try {
                this.empSelectAdd = this.empSelectStepAdd.filter(
                  item =>
                    item.value === parseInt(this.$session.getAll().data.empId)
                )[0].value
              } catch (err) {}
            }
            console.log('this.empSelectStepAdd', this.empSelectStepAdd)
          }
        })
      await this.checkEmp()
    },
    checkEmp () {
      this.empSelectStepAdd = this.empSelectStepAdd.filter(
        i => i.masBranchID === this.formAdd.masBranchID || i.masBranchID === ''
      )
      console.log('>>>this.empSelectStepAdd<<< ', this.empSelectStepAdd)
      if (this.empSelectStepAdd.length === 1) {
        console.log('this.empSelectStepAdd[0]: : :', this.empSelectStepAdd[0])
        console.log(
          'this.empSelectStepAdd[0].value : : :',
          this.empSelectStepAdd[0].value
        )
        this.empSelectAdd = this.empSelectStepAdd[0].value
        // console.log('this.empSelectAdd : : :', this.empSelectAdd)
      }
    },
    async getBookingFieldText () {
      if (JSON.parse(localStorage.getItem('typeData')) === null) {
        console.log(
          '>><<< : ',
          this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
        )
        await axios
          .get(
            this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
          )
          .then(async response => {
            let rs = response.data
            console.log('rs', rs)
            if (rs.status === false) {
              this.$swal(
                'ผิดพลาด',
                'เนื่องจากไม่สามารถเรียกชื่อกระบวนการ และประเภทงานได้',
                'success'
              )
            } else {
              localStorage.setItem('typeData', JSON.stringify(rs[0]))
              this.dataTypeJob1 =
                JSON.parse(localStorage.getItem('typeData')).typeJob1 || ''
              this.dataTypeJob2 =
                JSON.parse(localStorage.getItem('typeData')).typeJob2 || ''
              this.dataTypeJob3 =
                JSON.parse(localStorage.getItem('typeData')).typeJob3 || ''
              this.dataTypeProcess1 =
                JSON.parse(localStorage.getItem('typeData')).typeProcess1 || ''
              this.dataTypeProcess2 =
                JSON.parse(localStorage.getItem('typeData')).typeProcess2 || ''
              this.dataTypeProcess3 =
                JSON.parse(localStorage.getItem('typeData')).typeProcess3 || ''
              this.dataTypeProcess4 =
                JSON.parse(localStorage.getItem('typeData')).typeProcess4 || ''
            }
          })
      } else {
        this.dataTypeJob1 =
          JSON.parse(localStorage.getItem('typeData')).typeJob1 || ''
        this.dataTypeJob2 =
          JSON.parse(localStorage.getItem('typeData')).typeJob2 || ''
        this.dataTypeJob3 =
          JSON.parse(localStorage.getItem('typeData')).typeJob3 || ''
        this.dataTypeProcess1 =
          JSON.parse(localStorage.getItem('typeData')).typeProcess1 || ''
        this.dataTypeProcess2 =
          JSON.parse(localStorage.getItem('typeData')).typeProcess2 || ''
        this.dataTypeProcess3 =
          JSON.parse(localStorage.getItem('typeData')).typeProcess3 || ''
        this.dataTypeProcess4 =
          JSON.parse(localStorage.getItem('typeData')).typeProcess4 || ''
      }
    },
    async getCustomFieldStart () {
      this.editedItemSeleteField = []
      axios
        .get(
          this.DNS_IP +
            '/customField/get?shopId=' +
            this.$session.getAll().data.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            let sortrs = rs.sort((a, b) => a.sortNoField - b.sortNoField)
            for (let i = 0; i < sortrs.length; i++) {
              let d = sortrs[i]
              let s = {}
              s.fieldId = d.fieldId
              s.fieldName = d.fieldName
              s.fieldType = d.fieldType
              s.optionField = d.optionField
              s.conditionField = d.conditionField
              s.conditionValue = d.conditionValue
              s.shopId = d.shopId
              s.showCard = d.showCard
              s.fieldValue = ''
              this.editedItemSeleteField.push(s)
            }
            // console.log('this.editedItemSeleteField', this.editedItemSeleteField)
          }
        })
    },
    async scanQrcode () {
      if (this.$route.query.shopId === this.session.data.shopId) {
        let dt = {
          bookNo: this.$route.query.bookNo
        }
        await axios
          .get(this.DNS_IP + '/booking_view/getJob?bookNo=' + dt.bookNo)
          .then(async response => {
            let rs = response.data
            console.log('rsJob', rs)
            if (rs.length > 0) {
              await this.getBookingListJob(rs[0])
              this.dialogEdit = true
            } else {
              this.$swal(
                'ผิดพลาด',
                'นัดหมายนี้ไม่ได้อยู่ในร้านของคุณ หรือ อยู่ในกระดานการทำงานแล้ว',
                'error'
              )
              this.$router.push('/Master/BookingListBeauty')
            }
          })
      } else {
        this.$swal('ผิดพลาด', 'นัดหมายนี้ไม่ได้อยู่ในร้านของคุณ', 'error')
        this.$router.push('/Core/Login')
      }
    },
    async getShop () {
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.session.data.shopId)
        .then(response => {
          let rs = response.data
          console.log('rssssssssssss', rs)
          if (rs.length > 0) {
            this.shop = rs
            this.statusGoogleCalendar = rs[0].statusGoogleCalendar
            this.statusGoogleCalendarEmp = rs[0].statusGoogleCalendarEmp
          }
        })
    },
    async getShowOnsite () {
      // let LimitBooking = this.$session.getAll().data.showOnsite
      let LimitBooking = axios
        .get(
          this.DNS_IP +
            '/system_user/auth?userName=' +
            this.$session.getAll().data.userName +
            '&userPassword=' +
            this.$session.getAll().data.userPassword
        )
        .then(async response => {
          let rs = response.data[0].showOnsite
          return rs
        })
        .catch(error => {
          console.log('error function addData : ', error)
          return 'ไม่แสดง'
        })
      return LimitBooking || 'ไม่แสดง'
      // return this.$session.getAll().data.showOnsite || 'ไม่แสดง'
    }
  },
  async mounted () {
    await this.getShop()
    this.dataLineConfig = await this.getDataLineConfig(
      this.$session.getAll().data.shopId
    )
    this.Redirect =
      'https://liff.line.me/' +
      this.dataLineConfig.liffMainID +
      '/BookingAddress?shopId=' +
      this.$session.getAll().data.shopId
    this.pathToweb =
      'https://liff.line.me/' +
      this.dataLineConfig.liffMainID +
      '/JobConfirm?jobId='
    if (
      this.$route.query.customerName &&
      this.$route.query.dueDate &&
      this.$route.query.masBranchID
    ) {
      this.searchAll2 = this.$route.query.customerName
      this.dateStart = this.$route.query.dueDate
      this.masBranchID = parseInt(this.$route.query.masBranchID)
      this.checkShowDataOnsite()
    } else {
      this.checkShowDataOnsite('ไม่แสดง')
    }
    this.$root.$on('dataReturn', item => {
      this.dataReturn(item)
    })
    this.$root.$on('closeSetTimeGetCalenda', () => {
      this.closeSetTimeGetCalenda()
    })
  },
  created () {
    // this.getFirestore()
  },
  beforeDestroy () {
    this.$root.$off('dataReturn')
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  watch: {
    '$route.query.bookNoNoti' (newVal, oldVal) {
      if (newVal !== '') {
        if (
          this.$route.query.customerName &&
          this.$route.query.dueDate &&
          this.$route.query.masBranchID
        ) {
          this.searchAll2 = this.$route.query.customerName
          this.dateStart = this.$route.query.dueDate
          this.masBranchID = parseInt(this.$route.query.masBranchID)
          this.checkShowDataOnsite()
        }
      }
    },
    pickerDate (newval, oldval) {
      this.getMonth(newval)
      // this.allowedDates()
      // here you can check if month changed using newval and oldval
    },
    pickerDateChang (newval, oldval) {
      // console.log('newval', newval)
      this.getMonthChang(newval)
      // this.allowedDates()
      // here you can check if month changed using newval and oldval
    }
  }
}
</script>
<style scoped>
.bottomAdd {
  background: linear-gradient(3.82deg, #1093ff 0.25%, #66baff 99.75%);
}
</style>
