<template>
  <v-main>
        <v-card
        :ripple="false"
        :img="ImgCover"
        height="240px"
        width="100%"
        >
        </v-card>
        <v-card class="pa-2 pb-10 mt-n10"
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

          <v-dialog v-model="dialogHistory" hide-overlay fullscreen>
          <!-- <v-dialog v-model="dialogAdd" persistent max-width="70%"> -->
            <v-card class="text-center">
              <v-card-title>{{languageSelect === 0 ? 'นำข้อมูลเดิมมาใช้งาน' : 'Used History'}}</v-card-title>
               <v-container>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="dueDate"
                      :items="dueDateItems"
                      :label="languageSelect === 0 ? 'ค้นหาจากวันที่นัดหมาย' : 'Search by Booking Date'"
                      dense
                      outlined
                      readonly
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text>
                <div v-for="(item , index) in historyData[0]" :key="index">
                  <v-card class="text-center" elevation="14">
                    <v-container>
                    <v-card-text v-for="(items , indexs) in item" :key="indexs">
                      <v-text-field
                        v-if="items.fieldValue !== ''"
                        v-model="items.fieldValue"
                        :label="languageSelect === 0 ? items.fieldName : items.fieldNameEn"
                        readonly
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        tile
                        color="success"
                      >
                        <v-icon left>
                          mdi-account-check
                        </v-icon>
                        {{languageSelect === 0 ? 'ใช้ข้อมูลนี้' : 'Select Data'}}
                      </v-btn>
                    </v-card-actions>
                    </v-container>
                  </v-card>
                  <br>
                </div>
              </v-card-text>
              <v-col class="text-center pa-0">
                <v-btn
                  tile
                  color="error"
                  @click="(dialogHistory = false)"
                >
                  <v-icon left>
                    mdi-close
                  </v-icon>
                  {{languageSelect === 0 ? 'ปิดหน้านี้' : 'Close'}}
                </v-btn>
              </v-col>
              </v-container>
            </v-card>
          </v-dialog>
          <h3 class="text-center" :style="'color:' + DarkModefont +';'">{{languageSelect === 0 ? 'นัดหมายเข้ารับบริการ' : 'Booking Services'}}</h3>
          <h5 class="text-center" :style="'color:' + DarkModefont +';'" v-if="shop.length > 0">{{shop[0].shopName}}</h5>
          <v-col cols="12" class="text-center  pa-0 mb-3" >
                <v-btn
                  class="mx-2"
                  dark
                  :color="DarkModeButton"
                  @click="dialogHistory = true"
                  readonly
                >
                ประวัติการเข้ารับบริการ
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
          <div class="pa-2" :style="'background-color:' + DarkMode + ';border-radius: 15px 15px 15px 15px;'">
            <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <br>
            <v-select
              :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-model="fromAdd.flowId"
              :items="DataFlowName"
              :label="languageSelect === 0 ? 'ประเภทบริการ *' : 'Sevice *'"
              outlined
              :background-color="DarkMode"
              required
              readonly
            >
            </v-select>
            <v-select
              :item-text="languageSelect === 0 ? 'text' : 'textEng'"
              item-value="value"
              v-if="branch.length > 1"
              v-model="fromAdd.masBranchID"
              :items="branch"
              :label="languageSelect === 0 ? 'สาขา *' : 'Branch *'"
              :background-color="DarkMode"
              color="#000000"
              outlined
              required
              readonly
            >
            </v-select>
            <div v-if="dataPackage.filter(el => { return el.balanceAmount > 0 }).length > 0">
            <v-card class="pl-1">
              <v-subheader>คุณมี {{dataPackage.filter(el => { return el.balanceAmount > 0 }).length}} แพ็คเกจ</v-subheader>
              <v-subheader v-show="StatusPackage.packageName">คุณได้ทำการเลือกแพ็คเกจ {{StatusPackage.packageName}}</v-subheader>
              <v-slide-group
            active-class="success"
            >
            <v-slide-item v-for="(item, index) in dataPackage.filter(el => { return el.balanceAmount > 0 })" :key="index">
                <v-card
                class="ma-2 p-1"
                width="340"
                height="90"
                color="#FFFFFF"
                elevation="6"
                :style="item.packageId === fromAdd.packageId && item.token === fromAdd.tokenPackage ? 'border: 1px solid green;' : 'border: 1px solid white;'"
                >
                <v-row>
                  <v-col cols="4" class="pr-1">
                    <v-img
                  contain
                  max-height="80"
                  max-width="200"
                  :src="item.packageImg"
                ></v-img>
                  </v-col>
                  <v-col cols="8" class="font14 headline1 pb-6" >
                    <v-row class="font16 bold headline1">
                        <v-col class="pl-1 pt-5 pb-0">{{item.packageName}}</v-col>
                        <v-btn class="mr-4 mt-3" v-if="item.packageId !== fromAdd.packageId && item.token !== fromAdd.tokenPackage" color="green" outlined rounded x-small @click="UpdatePackage(item.packageId,'ตกลง',item.packageName,item.token)">ตกลง</v-btn>
                        <v-btn class="mr-4 mt-3" v-if="item.packageId === fromAdd.packageId && item.token !== fromAdd.tokenPackage" color="green" outlined rounded x-small @click="UpdatePackage(item.packageId,'ตกลง',item.packageName,item.token)">ตกลง</v-btn>
                        <v-btn class="mr-4 mt-3" v-if="item.packageId === fromAdd.packageId && item.token === fromAdd.tokenPackage" color="red" outlined rounded x-small @click="UpdatePackage(item.packageId,'ยกเลิก',item.packageName,item.token)">ยกเลิก</v-btn>
                    </v-row>
                    <v-row class="font14 headline1">
                        <v-col class="pl-1 pt-0 pb-0">จำนวนการใช้  {{item.balanceAmount}} / {{item.amount}} </v-col>
                    </v-row>
                     <v-row class="font14 headline1">
                        <v-col class="pl-1 pt-0 pb-0">วันหมดอายุ  {{ arrayMove(new Date(item.expirePackage * 1000).toLocaleString().split(',')[0].split('/'),0, 1) }} </v-col>

                    </v-row>
                  </v-col>
                  <!-- <v-col cols="3" class="pl-4">
                      <v-btn v-if="item.packageId !== fromAdd.packageId" color="green" outlined rounded x-small @click="UpdatePackage(item.packageId,'ตกลง',item.packageName)">ตกลง</v-btn>
                      <v-btn v-if="item.packageId === fromAdd.packageId" color="red" outlined rounded x-small @click="UpdatePackage(item.packageId,'ยกเลิก',item.packageName)">ยกเลิก</v-btn>
                  </v-col> -->
                </v-row>

                <!-- <h4>{{fromAdd.packageId}}</h4>
                <v-img :src="item.packageImg" height="163px"></v-img>
                <v-row class="font16 bold headline1">
                    <v-col class="pl-6 pt-5 pb-0">{{item.packageName}}</v-col>
                </v-row>
                <v-row class="font14 headline1">
                    <v-col class="pl-6 pt-0 pb-0">จำนวนการใช้  {{item.balanceAmount}} / {{item.amount}} </v-col>
                </v-row>
                <v-row class="font14 headline1">
                    <v-col class="pl-6 pt-0 pb-0">จำนวนแต้ม {{item.packagePoint}}  </v-col>
                </v-row>
                <v-row class="font14 headline1">
                    <v-col class="pl-6 pt-0 pb-0">ราคา Package {{item.packagePrice}} บาท </v-col>
                </v-row>
                <v-row class="font14 icon2">
                    <v-col class="pt-1 text-end pr-6">
                      <v-checkbox
                        v-model="fromAdd.packageId"
                        label="คลิก"
                        color="success"
                        :value="item.packageId"
                        hide-details
                      ></v-checkbox>
                      <v-btn outlined rounded x-small class="headline1" @click="fromAdd.packageId === item.packageId">คลิก</v-btn>
                    </v-col>
                </v-row>
                <br> -->
                </v-card>
            </v-slide-item>
        </v-slide-group>
            </v-card>
            <br>
          </div>
            <!-- <v-select
              v-if="dataPackage.length > 0"
              v-model="fromAdd.packageId"
              :items="dataPackage"
              label="แพ็กเก็ต *"
              :background-color="DarkMode"
              outlined
            >
            </v-select> -->
            <div v-for="(item , index) in fieldNameItem" :key="index">
              <template v-if="item.conditionField === '' || item.conditionField === null ">
                <v-col class="InputData" cols="12" v-if="item.fieldType == 'text'">
                  <v-text-field
                    v-if="item.fieldName === 'เบอร์โทร'"
                    v-mask="'###-###-####'"
                    v-model="item.fieldValue"
                    :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                    :background-color="DarkMode"
                    outlined
                    required
                    readonly

                    >
                    <template
                    v-slot:label
                    v-if="item.requiredField === 'True'"
                    >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                    </template>
                  </v-text-field>
                  <v-text-field
                   readonly
                    v-else
                    v-model="item.fieldValue"
                    :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                    :background-color="DarkMode"
                    outlined
                    required

                    >
                    <template
                    v-slot:label
                    v-if="item.requiredField === 'True'"
                    >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                    </template>
                  </v-text-field>
                </v-col>
                <v-col class="InputData" cols="12" v-if="item.fieldType == 'number'">
                  <v-text-field
                    v-if="item.fieldName === 'เบอร์โทร'"
                     readonly
                    v-mask="'###-###-####'"
                    v-model="item.fieldValue"
                    :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                    :background-color="DarkMode"
                    outlined
                    required

                    ><template
                    v-slot:label
                    v-if="item.requiredField === 'True'"
                    >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                    </template>
                  </v-text-field>
                  <v-text-field
                    v-else
                     readonly
                    v-model="item.fieldValue"
                    :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                    :background-color="DarkMode"
                    outlined
                    required

                    ><template
                    v-slot:label
                    v-if="item.requiredField === 'True'"
                    >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                    </template>
                  </v-text-field>
                </v-col>
                <v-col class="InputData" cols="12" v-if="item.fieldType == 'Autocompletes'">
                  <v-autocomplete
                   readonly
                    :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                    item-value="value"
                    v-model="item.fieldValue"
                    :items="JSON.parse(item.optionField)"
                    outlined
                    clearable
                    :background-color="DarkMode"
                    :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                    required

                  >
                  <template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                  </template>
                  </v-autocomplete>
                </v-col>
                <v-col class="InputData" cols="12" v-if="item.fieldType == 'Selects'">
                  <v-select
                   readonly
                  class="mb-1"
                    :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                    item-value="value"
                    v-model="item.fieldValue"
                    :items="JSON.parse(item.optionField)"
                    menu-props="auto"
                    :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                    :background-color="DarkMode"
                    required
                    clearable

                    outlined
                  >
                  <template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                  </template>
                  </v-select>
                </v-col>
                <v-col class="InputData" cols="12" v-if="item.fieldType == 'Radio'" style="padding:0px;">
                  <v-container fluid style="padding:0px;">
                    <v-radio-group
                     readonly
                    column
                  v-model="item.fieldValue"
                  :background-color="DarkMode"

                  style="margin:0px;">
                    <template v-slot:label>
                    </template>
                    <div v-for="radios in JSON.parse(item.optionField)" :key="radios.toISOString">
                    <v-radio
                      :label="languageSelect === 0 ? radios.text : radios.textEng"
                      :value="radios.value"
                    >
                    <template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{radios.text}}
                  </template></v-radio>
                    </div>
                  </v-radio-group>
                  </v-container>
                </v-col>
              </template>
              <template v-if="item.conditionField !== '' && fieldNameItem.filter((row) => { return row.fieldId === parseInt(item.conditionField)}).length > 0">
                <template v-if="item.conditionValue === fieldNameItem.filter((row) => { return row.fieldId === parseInt(item.conditionField)})[0].fieldValue">
                  <v-col class="InputData" cols="12" v-if="item.fieldType == 'text'">
                    <v-text-field
                     readonly
                        v-if="item.fieldName === 'เบอร์โทร'"
                        v-mask="'###-###-####'"
                        v-model="item.fieldValue"
                        :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                        outlined
                        required
                        :background-color="DarkMode"

                        >
                        <template
                        v-slot:label
                        v-if="item.requiredField === 'True'"
                        >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                        </template>
                    </v-text-field>
                    <v-text-field
                     readonly
                      v-else
                      v-model="item.fieldValue"
                      :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                      outlined
                      required
                      :background-color="DarkMode"

                      >
                      <template
                      v-slot:label
                      v-if="item.requiredField === 'True'"
                      >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col class="InputData" cols="12" v-if="item.fieldType == 'number'">
                    <v-text-field
                     readonly
                      v-if="item.fieldName === 'เบอร์โทร'"
                      v-mask="'###-###-####'"
                      v-model="item.fieldValue"
                      :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                      outlined
                      required
                      :background-color="DarkMode"

                      >
                      <template
                    v-slot:label
                    v-if="item.requiredField === 'True'"
                    >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                    </template>
                  </v-text-field>
                    <v-text-field
                     readonly
                      v-else
                      v-model="item.fieldValue"
                      :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                      outlined
                      required
                      :background-color="DarkMode"

                      >
                      <template
                    v-slot:label
                    v-if="item.requiredField === 'True'"
                    >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                    </template>
                  </v-text-field>
                  </v-col>
                  <v-col class="InputData" cols="12" v-if="item.fieldType == 'Autocompletes'">
                    <v-autocomplete
                     readonly
                      :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                      item-value="value"
                      v-model="item.fieldValue"
                      :background-color="DarkMode"
                      :items="JSON.parse(item.optionField)"
                      outlined
                      :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                      required
                      clearable

                    >
                    <template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                  </template>
                  </v-autocomplete>
                  </v-col>
                  <v-col class="InputData" cols="12" v-if="item.fieldType == 'Selects'">
                    <v-select
                     readonly
                      :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                      item-value="value"
                      class="mb-6"
                      v-model="item.fieldValue"
                      :items="JSON.parse(item.optionField)"
                      menu-props="auto"
                      :background-color="DarkMode"
                      :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"
                      required
                      clearable

                      outlined
                    >
                    <template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                  </template>
                  </v-select>
                  </v-col>
                  <v-col class="InputData" cols="12" v-if="item.fieldType == 'Radio'" style="padding:0px;">
                    <v-container fluid style="padding:0px;">
                      <v-radio-group
                      row
                     readonly
                    v-model="item.fieldValue"
                    :background-color="DarkMode"

                    style="margin:0px;"
                    >
                      <template v-slot:label>
                      </template>
                      <div v-for="radios in JSON.parse(item.optionField)" :key="radios.toISOString">
                      <v-radio
                        :label="languageSelect === 0 ? radios.text : radios.textEng"
                        :value="radios.value"
                      ><template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{radios.text}}
                  </template></v-radio>
                      </div>
                    </v-radio-group>
                    </v-container>
                  </v-col>
                </template>
              </template>
              <template v-if="item.conditionField === 'flow' ">
                <template  v-if="parseInt(item.conditionValue) === parseInt(fromAdd.flowId) ">
                  <v-col class="InputData" cols="12"  v-if="item.fieldType == 'text'">
                    <v-text-field
                     readonly
                      v-if="item.fieldName === 'เบอร์โทร'"
                      v-mask="'###-###-####'"
                      v-model="item.fieldValue"
                      :background-color="DarkMode"
                      :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"

                      outlined
                    >
                    <template
                      v-slot:label
                      v-if="item.requiredField === 'True'"
                      >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                    </template>
                    </v-text-field>
                    <v-text-field
                     readonly
                      v-else
                      v-model="item.fieldValue"
                      :background-color="DarkMode"
                      :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"

                      outlined
                    >
                    <template
                      v-slot:label
                      v-if="item.requiredField === 'True'"
                      >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                    </template>
                    </v-text-field>
                  </v-col>
                  <v-col class="InputData" cols="12" v-if="item.fieldType == 'number'">
                    <v-text-field
                     readonly
                      v-if="item.fieldName === 'เบอร์โทร'"
                      v-mask="'###-###-####'"
                      v-model="item.fieldValue"
                      :background-color="DarkMode"
                      :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"

                      outlined
                    >
                    <template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                  </template></v-text-field>
                    <v-text-field
                     readonly
                      v-else
                      v-model="item.fieldValue"
                      :background-color="DarkMode"
                      :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"

                      outlined
                    >
                    <template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                  </template></v-text-field>
                  </v-col>
                  <v-col class="InputData" cols="12"
                    v-if="item.fieldType == 'Autocompletes'"
                  >
                    <v-autocomplete
                     readonly
                      :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                      item-value="value"
                      v-model="item.fieldValue"
                      :items="JSON.parse(item.optionField)"
                      :background-color="DarkMode"
                      filled
                      clearable
                      :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"

                    >
                    <template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                  </template></v-autocomplete>
                  </v-col>
                    <v-col class="InputData" cols="12" v-if="item.fieldType == 'Selects'">
                      <v-select
                       readonly
                        :item-text="languageSelect === 0 ? 'text' : 'textEng'"
                        item-value="value"
                        class="mb-6"
                        v-model="item.fieldValue"
                        :items="JSON.parse(item.optionField)"
                        :background-color="DarkMode"
                        menu-props="auto"
                        :label="languageSelect === 0 ? item.fieldName : item.fieldNameEn"

                        hide-details
                        outlined
                        clearable
                      >
                      <template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{languageSelect === 0 ? item.fieldName + '  *' : item.fieldNameEn + '  *'}}
                  </template></v-select>
                    </v-col>
                    <v-col class="InputData" cols="12" v-if="item.fieldType == 'Radio'" style="padding:0px;">
                      <v-container fluid style="padding:0px;">
                        <v-radio-group
                          row
                           readonly
                          :background-color="DarkMode"
                          v-model="item.fieldValue"
                          style="margin:0px;"

                        >
                          <template v-slot:label> </template>
                          <div
                            v-for="radios in JSON.parse(
                              item.optionField
                            )"
                            :key="radios.toISOString"
                            class="text-center"
                          >
                            <v-radio
                              :label="languageSelect === 0 ? radios.text : radios.textEng"
                              dense
                              :value="radios.value"
                            ><template
                  v-slot:label
                  v-if="item.requiredField === 'True'"
                  >{{radios.text}}
                  </template></v-radio>
                          </div>
                        </v-radio-group>
                      </v-container>
                    </v-col>
                </template>
              </template>
            </div>

            <v-row >
              <v-col class="pb-0">
                <div v-if="fromAdd.masBranchID">
                  <v-menu
                   readonly
                  ref="menu"
                  v-model="menuDate"
                  :close-on-content-click="false"
                  :return-value.sync="date"

                  transition="scale-transition"
                  offset-y
                  required
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      :label="languageSelect === 0 ? 'วันที่' : 'Date'"
                      readonly
                      :background-color="DarkMode"
                      outlined
                      v-bind="attrs"
                      v-on="on"
                      required
                      @click="pickerDate? getMonth(pickerDate): null"

                    >
                    <template
                  v-slot:label
                  >{{languageSelect === 0 ? 'วันที่ *' : 'Date *'}}
                  </template>
                    <template #prepend>
                       <v-icon v-if="DarkModeStatus === true" :color="DarkMode" right> mdi-calendar </v-icon>
                       <v-icon v-if="DarkModeStatus === false"  right> mdi-calendar </v-icon>
                       </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                   readonly
                    v-model="date"
                    no-title
                    scrollable
                    :allowed-dates="allowedDates"
                    :picker-date.sync="pickerDate"
                    @change="setLimitBooking()"
                    @input="menuDate = false, $refs.menu.save(date)"
                    :min="currentDate"
                  >
                  </v-date-picker>
                </v-menu>
                </div>
              </v-col>
              <v-col class="pb-0" v-if="showTime === 'แสดง'" >
                <v-select
                 readonly
                  v-model="time"
                  :items="timeavailable"
                  :label="languageSelect === 0 ? 'เวลา' : 'Time'"
                  :background-color="DarkMode"
                  item-text="text"
                  item-value="text"
                  persistent-hint
                  return-object
                  outlined
                  required
                  v-if="showTime === 'แสดง' && date !== ''"

                >
                <template
                  v-slot:label
                  >{{languageSelect === 0 ? 'เวลา *' : 'Time *'}}
                  </template></v-select>
              </v-col>
            </v-row>
             <v-container  v-if="showLimitBooking === 'True' &&  time !== ''">
            <v-row>
              <v-col class="pb-0" xs="12" sm="12" md="12" lg="6" xl="6">
                <!-- <h6 :style="'color:' + DarkModefont +';'">{{languageSelect === 0 ? 'ต้องการใช้ Limit การจองหรือไม่' : 'Want to use working hours?'}}</h6>
                <v-row align="center"> -->
                <v-checkbox
                 readonly
                  false-value="False"
                  true-value="True"
                  v-model="limitBookingSelect"
                  hide-details
                  class="mt-1"
                  :label="languageSelect === 0 ? 'ต้องการกำหนดชั่วโมงการทำงานหรือไม่' : 'Want to use working hours?'"
                  :background-color="DarkMode"
                  @click="checkLimitBookingGet()"
                ></v-checkbox>
                <!-- <v-text-field class="mt-3" :background-color="DarkMode" :label="languageSelect === 0 ? 'ชั่วโมงการทำงาน' : 'Want to use working hours'" dense outlined :value="limitBookingSelect === 'True' ? 'ต้องการ' : 'ไม่ต้องการ'" readonly></v-text-field> -->
                <!-- </v-row> -->
              </v-col>
              <v-col class="pb-0" xs="12" sm="12" md="12" lg="6" xl="6" v-if="limitBookingSelect === 'True'">
                <v-select
                 readonly
                  v-model="selectCountBookingLimit"
                  :items="[1,2,3,4,5,6,7,8]"
                  outlined
                  dense
                  :background-color="DarkMode"
                  :label="languageSelect === 0 ? 'จำนวนชั่วโมง การทำงาน' : 'Working hours'"
                  @change="setCountTime()"
                ></v-select>
              </v-col>
            </v-row>
            </v-container>
            <template v-if="showMap === 'แสดง' && center !== null">
                 <v-col class="InputData" cols="12">
                    <v-text-field
                     readonly
                    v-model="address"
                    :label="languageSelect === 0 ? 'ชื่อของที่อยู่' : 'Address'"
                    outlined
                    required
                    :background-color="DarkMode"

                    ></v-text-field>
              </v-col>
               <v-col class="InputData" cols="12">
                 <v-card class="p-3">
                   <GmapMap
                v-if="center !== null"
                :center="center"
                :zoom="15"
                style="width: 100%; height: 200px"
                :options="{ disableDefaultUI: true, fullscreenControl: true, zoomControl: true }"
              >
              <GmapMarker :position="center" :draggable="true" @drag="updateCoordinates" />
              </GmapMap>
                 </v-card>
               </v-col>
            </template>
          </v-form>
          </div>
          <div class="text-center mt-5" v-if="statusSave">
              <v-btn
              class="button"
              :color="DarkModeButton"
              dark
              large
              :disabled="!valid"
               readonly
            >{{languageSelect === 0 ? 'ยืนยัน' : 'Confirm'}}</v-btn>
            <v-btn
              class="button"
              large
              :color="DarkModeButton"
              dark
               readonly
            >{{languageSelect === 0 ? 'ยกเลิก' : 'Cancel'}}</v-btn>
            </div>
          </v-card>
           <v-dialog v-model="dialogShowLimitBooking" persistent max-width="400px">
            <v-card>
              <v-col class="text-center">
                <span class="headline">มีชั่วโมงงานที่ท่านเลือกเต็มแล้ว</span>
              </v-col>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <div v-for="(item , index) in dataLimitBookingDate" :key="index">
                            <v-card-text class="text-center"><strong>{{item.bookingTime}} : </strong>
                            <v-chip
                              class="ma-2 white--text"
                              :color="item.color"
                            >
                              <strong>{{item.countBookingLimit}}</strong>
                            </v-chip>
                          </v-card-text>
                      </div>
                    </v-col>
                  </v-row>
                  <div class="text-center">
                    <v-btn
                      elevation="10"
                      color="#173053"
                      outlined
                      style="background-color:#FFFFFF"
                      small
                      @click="dialogShowLimitBooking = false"
                      >เลือกเวลา หรือ จำนวนชั่วโมงงานใหม่</v-btn>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
  </v-main>
</template>

<script>
import axios from 'axios' // api
import moment from 'moment'

export default {
  components: {
    name: ''
  },
  watch: {
    // menuDate (val) {
    //   val && setTimeout(() => (this.$refs.dateRef.activePicker = 'month'))
    // },
    pickerDate (newval, oldval) {
      this.getMonth(newval)
      // this.allowedDates()
      // here you can check if month changed using newval and oldval
    }
  },
  data () {
    return {
      session: this.$session.getAll(),
      statusSave: true,
      dialogShowLimitBooking: false,
      dataLimitBookingDate: [],
      selectCountBookingLimit: 1,
      currentDate: moment().format('YYYY-MM-DD'),
      currentMonth: moment().format('YYYY-MM'),
      pickerDate: null,
      activePicker: null,
      languageSelect: 0,
      tab: null,
      center: null,
      address: '',
      profile: [],
      valid: true,
      time: '',
      branch: [],
      fieldNameItem: [],
      shop: [],
      shopId: this.$session.getAll().data.shopId,
      source: '',
      DataFlowName: [],
      DataFlowNameAll: [],
      DataflowId: '',
      date: '',
      showTime: '',
      showMap: '',
      showLimitBooking: 'False',
      limitBookingSelect: 'False',
      menuDate: false,
      modal2: false,
      dataCustomer: [],
      fromAdd: {
        bookingFieldId: null,
        fieldId: '',
        fieldValue: '',
        flowId: null,
        masBranchID: null,
        dueDate: '',
        shopId: '',
        userId: '',
        packageId: '',
        tokenPackage: ''
      },
      timeavailable: [],
      packageItem: [
        {
          'packageImg': 'https://storage.googleapis.com/betask-loyalty.appspot.com/static/upload/package/LINE_ALBUM___4.jpg',
          'packageName': 'testtttttttttttt'
        },
        {
          'packageImg': 'https://storage.googleapis.com/betask-loyalty.appspot.com/static/upload/package/LINE_ALBUM___4.jpg',
          'packageName': 'ssssssssssssssss'
        }
      ],
      // timeavailable: ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
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
      branchData: [],
      ColorByShop: [],
      DarkMode: '',
      DarkModeStatus: null,
      DarkModeButton: '',
      DarkModeBackground: '',
      DarkModefont: '',
      LoGo: [],
      ImgCover: '',
      dataPackage: [],
      StatusPackage: {
        status: 'ตกลง',
        color: 'green',
        packageName: ''

      },
      dueDate: '',
      dueDateItems: [],
      historyData: [],
      historyDataDefault: [],
      statusHistory: false,
      dialogHistory: false,
      dataReadyHistory: true,
      checkLimitBooking: {
        ID: '',
        countBooking: null,
        limitCheck: null
      },
      dateDayoff: [],
      dateDayCustom: [],
      dateDaylimit: null
    }
  },
  async mounted () {
    await this.getShop()
    await this.getDataBranch()
    await this.getDataFlow()
    await this.getBookingField()
  },
  methods: {
    async startUp () {

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
    async getDataFlow () {
      this.DataFlowName = []
      this.DataFlowNameAll = []
      // console.log('DataFlowName', this.DataFlowName)
      await axios.get(this.DNS_IP + '/flow/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.text = d.flowName
            s.textEng = d.flowNameEn
            s.value = d.flowId
            this.DataFlowName.push(s)
            this.DataFlowNameAll.push(d)
            // console.log('this.DataFlowName', this.DataFlowName)
          }
        } else {
          this.DataFlowName = []
          this.DataFlowNameAll = []
        }
      })
    },
    async getDataBranch () {
      this.branch = []
      this.branchData = []
      await axios.get(this.DNS_IP + '/master_branch/get?shopId=' + this.shopId).then(response => {
        let rs = response.data
        console.log('rs', rs)
        if (rs.length > 0) {
          for (var i = 0; i < rs.length; i++) {
            let d = rs[i]
            let s = {}
            s.text = d.masBranchName
            s.textEng = d.masBranchNameEn
            s.value = d.masBranchID
            this.branch.push(s)
            this.branchData.push(d)
            // console.log('dtdtdtdt', this.branch)
          }
          if (this.branch.length === 1) {
            this.fromAdd.masBranchID = this.branch[0].value
            this.checkTime()
          }
        } else {
          this.branch = []
        }
      })
      console.log('branch', this.branch)
    },
    async getBookingField () {
      this.bookingField = []
      let itemIncustomField = []
      await axios.get(this.DNS_IP + '/BookingField/get?shopId=' + this.shopId).then(async (response) => {
        let rs = response.data
        console.log('rstype', rs)
        if (rs.length > 0) {
          this.fromAdd.bookingFieldId = rs[0].bookingFieldId
          // console.log('rs', rs)
          let bookingData = []
          if (rs[0].showTime === null || rs[0].showTime === '') {
            this.showTime = 'แสดง'
          } else {
            this.showTime = rs[0].showTime
          }
          this.showLimitBooking = rs[0].showLimitBooking
          // if (rs[0].showMap === null || rs[0].showMap === '') {
          //   this.showMap = 'ไม่แสดง'
          // } else {
          //   this.showMap = rs[0].showMap
          // }
          // if (this.showMap === 'แสดง') {
          //   await this.geolocate()
          // }
          bookingData = JSON.parse(rs[0].flowfieldName)
          for (let i = 0; i < bookingData.length; i++) {
            let d = bookingData[i]
            itemIncustomField.push(d.fieldId)
          }
          await this.getCustomField(itemIncustomField)
        } else {
          this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
            this.$router.go()
          }).catch((error) => {
            console.log('error function addData : ', error)
            this.$router.go()
          })
        }
      })
        .catch((error) => {
          this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
            this.$router.go()
          }).catch((error) => {
            console.log('error function addData : ', error)
            this.$router.go()
          })
          console.log('error function addData : ', error)
        })
    },
    async getCustomField (item) {
      await axios.get(this.DNS_IP + '/customField/fieldId?fieldId=' + item)
        .then(async response => {
          let rs = response.data
          // let aa = []
          if (rs.length > 0) {
            let sortNo = rs.sort((a, b) => a.sortNoField - b.sortNoField)
            for (let i = 0; i < sortNo.length; i++) {
              let d = sortNo[i]
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
              s.requiredField = d.requiredField
              this.fieldNameItem.push(s)
            }
            var data1 = this.fieldNameItem.filter(el => parseInt(el.conditionField || 0) > 0)
            // var data2 = []
            for (var i = 0; i < data1.length; i++) {
              var d = data1[i]
              var indexC = this.fieldNameItem.findIndex(function (o) {
                return o.fieldId === d.fieldId
              })
              var indexF = this.fieldNameItem.findIndex(function (o) {
                return o.fieldId === parseInt(d.conditionField)
              })
              this.fieldNameItem.splice((indexF + 1), 0, this.fieldNameItem.splice(indexC, 1)[0])
            // data2.push({'indexC': indexC, 'indexF': indexF})
            }
            // console.log('data1', data1)
            // console.log('data2', data2)
            // for (var x = 0; x < data2.length; x++) {
            //   var s = data2[x]
            //   this.fieldNameItem.splice((s.indexF + 1), 0, this.fieldNameItem.splice(s.indexC, 1)[0])
            // }
            console.log(this.fieldNameItem)
          // setTimeout(() => this.validate(), 500)
          } else {
            this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
              this.$router.go()
            }).catch((error) => {
              console.log('error function addData : ', error)
              this.$router.go()
            })
          }
        })
        .catch((error) => {
          this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
            this.$router.go()
          }).catch((error) => {
            console.log('error function addData : ', error)
            this.$router.go()
          })
          console.log('error function addData : ', error)
        })
    }
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
.portrait.v-card {
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
}
.main{
  padding: 0px;
  background: #ffffff;
}
.content{
  border-radius: 10px;
}
.a{
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
}
.InputData{
  margin: 0px !important;
  padding: 0px !important;

}

</style>
