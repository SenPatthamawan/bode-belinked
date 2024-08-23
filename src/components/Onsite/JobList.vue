<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="px-lg-4 mb-16" style="overflow-x: hidden;min-height:400px;">
        <v-row class="no-gutters" v-if="sortNo === 1">
          <v-col cols="12" md="6" lg="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
          <v-col cols="12" md="6" lg="6" class="text-right"> </v-col>
        </v-row>
        <v-row class="no-gutters" v-if="sortNo === 1">
          <v-col cols="12" md="6" lg="6" class="px-3 text-right">
            <!-- <v-select
              v-model="selectFlow"
              :items="itemFlow"
              menu-props="auto"
              label="ประเภทบริการ"
              hide-details
              prepend-icon="mdi-format-list-bulleted-type"
              single-line
              outline
              @change="getDataJob()"
            >
            </v-select> -->
            <v-select
              v-model="selectFlow"
              :items="itemFlow"
              label="ประเภทบริการ"
              dense
              outlined
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              @change="getByflow()"
            >
          <template v-slot:prepend-inner>
            <v-icon color="#24C74D">mdi-menu-swap</v-icon>
          </template>
          </v-select>
          </v-col>
        </v-row>
        <v-row class="no-gutters" v-if="sortNo === 3 && selectFlow !== ''">
          <v-col cols="12" md="6" lg="6" class="px-3 mt-5 text-right">
            <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="เลือกเดือน"
            dense
            prepend-icon="mdi-calendar"
            readonly
            outlined
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          type="month"
          no-title
          scrollable
          @input="(menu = false), $refs.menu.save(date)"
          @change="getCloseJob(date)"
        >
        </v-date-picker>
      </v-menu>
          </v-col>
        </v-row>
        <p v-if="model === 0" class="font-weight-bold mb-1 ml-6" style="font-size:20px">รายการนัดหมาย</p>
        <p v-if="model === 1" class="font-weight-bold mb-1 ml-6 mt-2" style="font-size:20px">เริ่มงาน</p>
        <p v-if="model === 2" class="font-weight-bold mb-1 ml-6 mt-2" style="font-size:20px">สรุปรายการนัดหมาย</p>
        <div v-for="(item , index) in itemJob" :key="index">
          <v-card v-if="sortNo === 1 && item.sortNo === 1" class="mx-6 pa-3 ma-2" style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;">
            <v-row class="pa-5">
              <v-col cols="3" md="3" sm="12"  class="pa-0 ma-0" style="display: flex;align-items: flex-start;justify-content: flex-end;padding-left: 11px !important;">
                <v-avatar size="65" v-if="item.memberPicture">
                <img
                  :src="item.memberPicture"
                >
              </v-avatar>
              <v-avatar size="65" color="#173053" v-else>
                <v-icon dark x-large>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              </v-col>
              <v-col cols="9" md="9" sm="12" class="pa-0 ma-0 pl-2">
                <p class="font-weight-bold mb-1 ml-2" style="font-size:16px" v-if="dataJob.filter((dt) => dt.jobNo === item.jobNo && dt.fieldName === 'ชื่อ').length > 0">
                  {{dataJob.filter((dt) => dt.jobNo === item.jobNo && dt.fieldName === 'ชื่อ')[0].fieldValue}}
                </p>
                <div style="display: flex;align-items: flex-start;">
                  <v-icon color="#F48686" class="mx-1">mdi-square-medium</v-icon>
                <p class="font-weight-medium mb-1" style="font-size:14px" v-if="item.flowName !== null">
                  <!-- <v-icon color="#F48686" class="mx-1">mdi-square-medium</v-icon> -->
                  {{item.flowName}}
                </p>
                </div>
                <div style="display: flex;align-items: flex-start;word-break: break-word;">
                  <v-icon color="#F48686" class="mx-1 mr-2">mdi-map-marker-radius</v-icon>
                  <p class="font-weight-medium mb-1" style="font-size:14px" v-if="item.address !== null">
                  <!-- <v-icon color="#F48686" class="mx-1 mr-2">mdi-map-marker-radius</v-icon> -->
                  {{item.address}}
                </p>
                </div>
                <div style="display: flex;align-items: flex-start;">
                  <v-icon  color="#24C74D" class="mx-2 mr-2 mt-1 iconify" small data-icon="el:phone-alt"></v-icon>
                  <p class="font-weight-bold mb-1" style="font-size:14px" v-if="dataJob.filter((dt) => dt.jobNo === item.jobNo && dt.fieldName === 'เบอร์โทร').length > 0">
                  <!-- <v-icon  color="#24C74D" class="mx-2 mr-2 mt-1 iconify" small data-icon="el:phone-alt"></v-icon> -->
                {{dataJob.filter((dt) => dt.jobNo === item.jobNo && dt.fieldName === 'เบอร์โทร')[0].fieldValue}}
                </p>
                </div>
              </v-col>
            </v-row>
            <div style="display: flex;align-items: center;justify-content: center;">
              <v-icon  color="#F48686" class="iconify" data-icon="ic:twotone-access-time"></v-icon>
              <p class="font-weight-bold text-center ma-0 ml-2" v-if="item.dueDate" style="font-size:16px">
                <!-- <v-icon x-large color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon> -->
                {{momentThaiText(item.dueDate)}}</p>
            </div>
           <v-row class="mt-2 mb-1 px-3">
            <v-col cols="4" class="text-center pa-1">
              <v-btn
                color="#1DBF73"
                rounded
                dark
                block
                @click="callCustomer(dataJob.filter(el => {return el.jobNo === item.jobNo;}))"
              >โทร</v-btn>
            </v-col>
            <v-col cols="4" class="text-center pa-1">
              <v-btn
                color="#F38383"
                rounded
                dark
                block
                @click="setShowMap(item)"
              >
              แผนที่</v-btn>
            </v-col>
            <v-col cols="4" class="text-center pa-1">
              <v-btn
                color="#173053"
                rounded
                dark
                block
                @click="updateJobStart(item.sortNo, item.jobId, item)"
              >เริ่มงาน</v-btn>
            </v-col>
           </v-row>
        </v-card>
        <div class="pa-0 ma-0" v-if="sortNo === 2 && item.sortNo >= 2">
            <v-card  class="mx-6 pa-3 ma-2" style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;">
            <p class="font-weight-bold">เปลี่ยนสถานะขั้นตอน</p>
            <!-- <div style="display: flex;justify-content: space-between;align-items: flex-start;">
              <div style="word-break: break-word;">
                <p class="font-weight-bold ml-4" style="font-size:19px">{{item.flowName}}</p>
              </div>
              <v-icon color="rgb(23, 48, 83)" large @click="ChatHistory(item)">mdi-history</v-icon>
            </div> -->
            <p class="font-weight-bold ml-4" style="font-size:19px">{{item.flowName}}</p>
            <v-select
                class="ma-3"
                v-model="selectStep"
                :items="itemStep.filter((v) => parseInt(v.flowId) === item.flowId)"
                :item-text="itemStep.text"
                :item-value="itemStep.value"
                dense
                outlined
                background-color="rgba(29, 191, 115, 0.1)"
                bord
                attach
                :menu-props="{ bottom: true, offsetY: true }"
                @change="onUpdate(item)"
              >
              <template v-slot:label>
              <p class="text-center" style="color:#24C74D;">เลือกขั้นตอน</p>
            </template>
            <template v-slot:prepend-inner>
              <v-icon color="#24C74D">mdi-menu-swap</v-icon>
            </template>
            </v-select>
            <v-row v-for="(itemStep , indexStep) in dataFlowStep.filter((v) => parseInt(v.flowId) === item.flowId)" :key="indexStep">
              <v-col cols="4" class="text-right py-0 pr-0" style="display: flex;justify-content: flex-end;align-items: center;">
                <p
                class="font-weight-bold mb-1" style="font-size:14px"
                v-if="dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === item.jobNo && Ilog.stepId === itemStep.stepId).length > 0"
                >{{dataJobLog.filter((Ilog,inLog) => Ilog.jobNo === item.jobNo && Ilog.stepId === itemStep.stepId)[0].CREATE_DATE_TIME + ' น.'}}
              </p>
              </v-col>
              <v-col cols="2" class="text-center py-0 px-0" style="display: flex;justify-content: center;align-items: center;">
                <v-icon v-if="itemStep.stepId === item.stepId" color="#173053" class="mx-2 mr-2 mt-1 iconify"  data-icon="teenyicons:git-commit-solid"></v-icon>
                <v-icon v-else class="mx-2 mr-2 mt-1 iconify" color="#8A8D9F"  data-icon="teenyicons:git-commit-outline"></v-icon>
              </v-col>
              <v-col cols="6" class="py-0 pl-0">
                <p
                v-if="itemStep.stepTitle !== null"
                class="font-weight-bold mb-1" style="font-size:14px;color: #8A8D9F;"
                >{{itemStep.stepTitle}}</p>
              </v-col>
            </v-row>
            <v-row class="mt-5 mb-1 px-3" v-if="item.lineUserId === '' || item.lineUserId === null">
            <v-col cols="6" class="text-center pa-1">
              <v-btn
                color="#1DBF73"
                rounded
                dark
                block
                @click="callCustomer(dataJob.filter(el => {return el.jobNo === item.jobNo;}))"
              >โทร</v-btn>
            </v-col>
            <v-col cols="6" class="text-center pa-1">
              <v-btn
                color="#F38383"
                rounded
                dark
                block
                @click="setShowMap(item)"
              >
              แผนที่</v-btn>
            </v-col>
           </v-row>
            <v-row class="mt-5 mb-1 px-3" v-else>
            <v-col cols="4" class="text-center pa-1">
              <v-btn
                color="#1DBF73"
                rounded
                dark
                block
                @click="callCustomer(dataJob.filter(el => {return el.jobNo === item.jobNo;}))"
              >โทร</v-btn>
            </v-col>
            <!-- <v-col cols="4" class="text-center pa-1">
              <v-btn
                color="#F38383"
                rounded
                dark
                block
                outlined
                @click="dialogMessage = true, setMessage(item)"
              >
              ข้อความ</v-btn>
            </v-col> -->
            <v-col cols="4" class="text-center pa-1">
              <v-btn
                color="#F38383"
                rounded
                dark
                block
                @click="setShowMap(item)"
              >
              แผนที่</v-btn>
            </v-col>
            <v-col cols="4" class="text-center pa-1">
              <v-btn
                color="#8A94A3"
                rounded
                dark
                block
                @click="ChatHistory(item)"
              >
              ข้อความ</v-btn>
            </v-col>
           </v-row>
           <v-row class="mt-2 mb-1 px-3">
            <v-col cols="12" class="text-center pa-1">
              <v-btn
                color="#173053"
                rounded
                dark
                block
                @click="detailsJob(item)"
              >รายละเอียดนัดหมาย</v-btn>
            </v-col>
           </v-row>
           <v-row class="mt-2 mb-1 px-3" v-if="shopId == 'U9f316c85400fd716ea8c80d7cd5b61f8'">
            <v-col cols="12" class="text-center pa-1">
              <v-btn
                color="rgb(33 150 243)"
                rounded
                dark
                block
                @click="getMedication(item)"
              >บันทึกข้อมูลยา</v-btn>
            </v-col>
           </v-row>
           <v-row class="mt-2 mb-1 px-3" v-if="shopId == 'U9f316c85400fd716ea8c80d7cd5b61f8'">
            <v-col cols="12" class="text-center pa-1">
              <v-btn
                color="rgb(33 150 243)"
                rounded
                dark
                block
                @click="getDisease(item)"
              >บันทึกข้อมูลการรักษา</v-btn>
            </v-col>
           </v-row>
             </v-card>
            <div class="mx-6 pa-3 ma-2">
              <div v-if="shopId !== 'U9f316c85400fd716ea8c80d7cd5b61f8'">
                <v-row>
                  <v-col cols="6" class="pb-0 text-center"><p class="font-weight-bold mb-0">Before</p></v-col>
                  <v-col cols="6" class="pb-0 text-center"><p class="font-weight-bold mb-0">After</p></v-col>
                </v-row>
                <v-row v-for="(itemBeforeAfter, indexBeforeAfter) in item.dataBeforeAfter" :key="indexBeforeAfter">
                  <v-col cols="6" class="pb-0">
                    <div v-if="itemBeforeAfter.beforeImage" class="pa-3" style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;display: flex;justify-content: center;align-items: center;">
                      <v-img
                      @click="refUploadBefore(indexBeforeAfter)"
                        aspect-ratio="2"
                        contain
                        min-height="150"
                        :src="itemBeforeAfter.beforeImage"
                      ></v-img>
                    </div>
                    <v-card v-else @click="refUploadBefore(indexBeforeAfter)" height="177" style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;display: flex;justify-content: center;align-items: center;">
                      <v-icon  class="mx-2 mr-2  iconify" style="font-size:80px;" color="#8A8D9F"  data-icon="fluent:scan-camera-48-regular"></v-icon>
                    </v-card>
                      <v-row >
                        <v-col cols="12" class="text-center" style="display: none;">
                          <v-file-input
                          :id="'uploadBefore' + indexBeforeAfter"
                          hide-input
                          class="pt-0 ml-6"
                          color="info"
                          accept="image/*"
                          @change="selectImgUpdate(itemBeforeAfter,'before')"
                          v-model="itemBeforeAfter.filesBefore"
                          prepend-icon="mdi-camera"
                        >
                      </v-file-input>
                        </v-col>
                        <v-col cols="12" class="text-center" >
                          <v-btn
                          v-if="itemBeforeAfter.beforeImage"
                          class="mt-1"
                          icon
                          dark
                          small
                          color="#F38383"
                          @click="deleteBeforeAfter(itemBeforeAfter,'before')"
                        >
                          <v-icon dark>
                            mdi-delete-circle
                          </v-icon>
                        </v-btn>
                        </v-col>
                      </v-row>
                  </v-col>
                  <v-col cols="6" class="pb-0">
                    <div v-if="itemBeforeAfter.afterImage" class="pa-3" style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;display: flex;justify-content: center;align-items: center;">
                      <v-img
                      @click="refUploadAfter(indexBeforeAfter)"
                        aspect-ratio="2"
                        contain
                        min-height="150"
                        :src="itemBeforeAfter.afterImage"
                    ></v-img>
                    </div>
                    <v-card v-else height="177" @click="refUploadAfter(indexBeforeAfter)" style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;display: flex;justify-content: center;align-items: center;">
                      <v-icon  class="mx-2 mr-2  iconify" style="font-size:80px;" color="#8A8D9F"  data-icon="fluent:scan-camera-48-regular"></v-icon>
                    </v-card>
                    <v-row >
                        <v-col cols="12" class="text-center" style="display: none;">
                          <v-file-input
                          :id="'uploadAfter' + indexBeforeAfter"
                          hide-input
                          class="pt-0 ml-6"
                          color="info"
                          accept="image/*"
                          @change="selectImgUpdate(itemBeforeAfter,'after')"
                          v-model="itemBeforeAfter.filesAfter"
                          prepend-icon="mdi-camera"
                        ></v-file-input>
                        </v-col>
                        <v-col cols="12" class="text-center" >
                          <v-btn
                          v-if="itemBeforeAfter.afterImage"
                          class="mt-1"
                          icon
                          dark
                          small
                          color="#F38383"
                          @click="deleteBeforeAfter(itemBeforeAfter,'after')"
                        >
                          <v-icon dark>
                            mdi-delete-circle
                          </v-icon>
                        </v-btn>
                        </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" class="pb-0 pt-0 text-center mt-2" v-if="item.dataBeforeAfter.length > 1" >
                    <v-btn
                      rounded
                      dark
                      color="#F38383"
                      @click="deleteBeforeAfterAll(itemBeforeAfter)"
                    >
                      <v-icon left>
                        mdi-delete-circle
                      </v-icon>
                      ลบรูปทั้งหมดในแถว
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="pt-0 text-center mt-2" v-if="indexBeforeAfter === (item.dataBeforeAfter.length - 1)">
                      <v-icon color="#173053 " class=""  dark x-large @click="addBeforeAfter(item.dataBeforeAfter, item)">mdi-table-plus</v-icon>
                  </v-col>
                </v-row>
              </div>
              <v-btn
                class="mt-4"
                elevation="2"
                rounded
                block
                color="#173053"
                dark
                @click="closeJobStart(item)"
              >ปิดจบงาน</v-btn>

            </div>
        </div>
        </div>

        <!-- step 3 แสดงงานที่ปิดงานแล้ว -->
        <div v-for="(CloseJob , keyCloseJob) in dataCloseJob" :key="'a' + keyCloseJob">
          <v-card v-if="sortNo === 3" class="mx-6 pa-3 ma-2" style="background: #FFFFFF;box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.08);border-radius: 24px;">
            <v-row class="pa-5">
              <v-col cols="3" md="3" sm="12"  class="pa-0 ma-0" style="display: flex;align-items: flex-start;justify-content: flex-end;padding-left: 11px !important;">
                <v-avatar size="65" v-if="CloseJob.memberPicture">
                  <img
                    :src="CloseJob.memberPicture"
                    onerror="this.onerror=null;this.src='https://firebasestorage.googleapis.com/v0/b/betask-linked/o/picture-web%2FLINE_ALBUM_220214_0.jpg?alt=media&token=6389daf9-9473-4b5d-8b19-2afb67d015e4';"
                  >
                </v-avatar>
                <v-avatar size="65" color="#173053" v-else>
                  <v-icon dark x-large>
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
              </v-col>
              <v-col cols="9" md="9" sm="12" class="pa-0 ma-0 pl-2">
                <p class="font-weight-bold mb-1 ml-2" v-if="dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo && dt.fieldName === 'ชื่อ').length > 0"
                      style="font-size:16px;">
                      {{dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo && dt.fieldName === 'ชื่อ')[0].fieldValue}}
                    </p>
                <!-- <div style="display: flex;justify-content: space-between;align-items: flex-start;">
                  <div style="word-break: break-word;">
                    <p class="font-weight-bold mb-1 ml-2" v-if="dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo && dt.fieldName === 'ชื่อ').length > 0"
                      style="font-size:20px;">
                      {{dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo && dt.fieldName === 'ชื่อ')[0].fieldValue}}
                    </p>
                  </div>
                <v-icon color="rgb(23, 48, 83)" large @click="ChatHistory(CloseJob)">mdi-history</v-icon>
                </div> -->
                <div style="display: flex;align-items: flex-start;">
                  <v-icon color="#F48686" class="mx-1">mdi-square-medium</v-icon>
                  <p class="font-weight-medium mb-1" v-if="CloseJob.flowName !== null" style="font-size:14px">
                  <!-- <v-icon color="#F48686" class="mx-1">mdi-square-medium</v-icon> -->
                  {{CloseJob.flowName}}
                </p>
                </div>
                <div style="display: flex;align-items: flex-start;word-break: break-word;">
                  <v-icon color="#F48686" class="mx-1 mr-2">mdi-map-marker-radius</v-icon>
                  <p class="font-weight-medium mb-1" style="font-size:14px" v-if="CloseJob.address !== null">
                    <!-- <v-icon color="#F48686" class="mx-1 mr-2">mdi-map-marker-radius</v-icon> -->
                  {{CloseJob.address}}
                </p>
                </div>
                <div style="display: flex;align-items: flex-start;">
                  <v-icon  color="#24C74D" class="mx-2 mr-2 mt-1 iconify" small data-icon="el:phone-alt"></v-icon>
                  <p class="font-weight-bold mb-1" v-if="dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo && dt.fieldName === 'เบอร์โทร').length > 0"
                style="font-size:14px">
                <!-- <v-icon  color="#24C74D" class="mx-2 mr-2 mt-1 iconify" small data-icon="el:phone-alt"></v-icon> -->
                {{dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo && dt.fieldName === 'เบอร์โทร')[0].fieldValue}}
                </p>
                </div>
              </v-col>
            </v-row>
            <div style="display: flex;align-items: center;justify-content: center;" class="mb-2">
              <v-icon color="#F48686" class="mx-1 mr-2 iconify" data-icon="ic:twotone-access-time"></v-icon>
              <p class="font-weight-bold mb-1 text-center" v-if="CloseJob.dueDate !== null & CloseJob.dueDate !== ''"
              style="font-size:15px">
              {{'วันที่นัดหมาย ' + momentThaiTextClose(CloseJob.dueDate)}}
              </p>
            </div>
            <v-row>
              <v-col cols="6" style="display: flex;
                  align-items: flex-start;
                  padding-left: 25px;
                  flex-direction: column;">
                <p class="font-weight-bold mb-1 text-center" v-if="dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo).length > 0" style="font-size:13px">{{'วันที่เริ่มงาน ' + dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo)[0].CREATE_DATE_DAY}}</p>
                <p class="font-weight-bold mb-1 text-center" v-if="dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo).length > 0" style="font-size:13px">{{'เวลาเริ่มงาน ' + dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo)[0].CREATE_DATE_TIME + ' น.'}}</p>
              </v-col>
              <v-divider
                class="pt-3 mt-3"
                style="height: 40px;"
                vertical
              ></v-divider>
              <v-col cols="6" style="display: flex;
                  align-items: flex-start;
                  padding-left: 25px;
                  flex-direction: column;">
                <p class="font-weight-bold mb-1 text-center" v-if="dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo).length > 0" style="font-size:13px">{{'วันที่จบงาน ' + dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo)[0].LAST_DATE_DAY}}</p>
                <p class="font-weight-bold mb-1 text-center" v-if="dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo).length > 0" style="font-size:13px">{{'เวลาจบงาน ' + dataCloseJobData.filter((dt) => dt.jobNo === CloseJob.jobNo)[0].LAST_DATE_TIME + ' น.'}}</p>
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-col cols="12" class="text-center pa-1 mb-3">
              <v-btn
                color="#F38383"
                rounded
                dark
                @click="dialogMessage = true, setMessage(CloseJob)"
              >
              ข้อความ</v-btn>
            </v-col> -->
            <v-col cols="12" class="text-center pa-1 mb-3">
              <v-btn
                color="#8A94A3"
                rounded
                dark
                @click="ChatHistory(CloseJob)"
              >
              ข้อความ</v-btn>
              <v-btn
                color="#F48686"
                rounded
                dark
                @click="ShowImg(CloseJob)"
              >
              รูปภาพ</v-btn>
            </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="12" class="text-center pa-1 mb-3">
              <v-btn
                color="#F38383"
                rounded
                dark
                @click="ChatHistory(CloseJob)"
              >
              ประวัติข้อความ</v-btn>
            </v-col>
            </v-row> -->
          </v-card>
        </div>
        <v-dialog v-model="dialogShowImg" :max-width="dialogwidth">
          <v-card class="pa-3">
            <h5 class="font-weight-bold m-6 mb-5 text-center">ตรวจสอบรูป</h5>
            <h6 class="font-weight-bold ml-6">Before</h6>
              <v-slide-group
                  v-if="showImgItem"
                    class="pa-4 pt-0 mt-n1"
                    color="primary"
                  >
                    <v-slide-item
                      v-for="(itemImg2, i2) in showImgItem"
                      :key="i2"
                    >
                      <v-card width="150px" class="ma-2 pa-1">
                        <v-img
                                :src="itemImg2.beforeImage"
                                max-height="130"
                                aspect-ratio="1.7"
                                contain
                                @click="SelectImg(itemImg2.beforeImage)"
                              ></v-img>
                      </v-card>
                    </v-slide-item>
                  </v-slide-group>
              <h6 class="font-weight-bold ml-6">After</h6>
              <v-slide-group
              v-if="showImgItem"
                    class="pa-4 pt-0 mt-n1"
                    color="primary"
                  >
                    <v-slide-item
                      v-for="(itemImg, i) in showImgItem"
                      :key="i"
                    >
                      <v-card width="150px" class="ma-2 pa-1">
                        <v-img
                                :src="itemImg.afterImage"
                                max-height="130"
                                aspect-ratio="1.7"
                                contain
                                @click="SelectImg(itemImg.afterImage)"
                              ></v-img>
                      </v-card>
                    </v-slide-item>
                  </v-slide-group>
          </v-card>
        </v-dialog>
        <v-dialog
      v-model="dialogImg"
      max-width="80%"
    >
      <v-card>
        <v-img
          :lazy-src="showImg"
          :src="showImg"
        ></v-img>
      </v-card>
    </v-dialog>
        <v-dialog v-model="dialogMap" :max-width="dialogwidth">
            <v-card class="text-center">
              <v-card-title>
                แสดงแผนที่
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <!-- <v-text-field
                        v-model="address"
                        outlined
                        label="ชื่อของที่อยู่"
                        auto-grow
                        readonly
                        append-outer-icon="mdi-open-in-new"
                        @click:append-outer="NewTap(address)"
                      >
                      <template v-slot:label>
                        <a>{{address}}</a>
                      </template>
                    </v-text-field> -->
                    <!-- <a @click="NewTap(address)">{{address}}</a> -->
                    <div v-html="setLinks(address)" style="font-size:20px"></div>
                    <!-- <a>{{address}}<v-icon>mdi-open-in-new</v-icon></a> -->
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-card class="text-center">
                          <GmapMap
                            v-if="center !== null"
                            :center="center"
                            :zoom="15"
                            style="width: 100%; height: 200px"
                            :options="{ disableDefaultUI: true }"
                          >
                            <GmapMarker @click="gotoMap()" :position="center" />
                            <gmap-info-window
                              :opened="true"
                              :position="center"
                              :options="{
                                pixelOffset: {
                                  width: 0,
                                  height: -35
                                }
                              }"
                          >
                              กดที่หมุดเพื่อ นำทาง
                          </gmap-info-window>
                          </GmapMap>
                      </v-card>
                    </v-col>
                  </v-row>
                  <hr />
                  <div class="text-center">
                    <v-btn
                      elevation="10"
                      color="#173053"
                      rounded
                      dark
                      @click="dialogMap = false"
                      >ปิด</v-btn
                    >
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        <v-dialog v-model="dialogDetail" persistent :max-width="dialogwidth">
            <v-card class="text-center pa-2 px-4">
              <v-row class="pa-5">
              <v-col cols="3" md="3" sm="12"  class="pa-0 ma-0" style="display: flex;align-items: flex-start;justify-content: flex-end;padding-left: 11px !important;">
                <v-avatar size="90" v-if="dataInfo.memberPicture">
                <img
                  :src="dataInfo.memberPicture"
                >
              </v-avatar>
              <v-avatar size="90" color="#173053" v-else>
                <v-icon dark x-large>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              </v-col>
              <v-col cols="9" md="9" sm="12" class="pa-0 ma-0 pl-6">
                <p class="font-weight-bold mb-1 ml-2" style="font-size:20px" v-if="dataJob.filter((dt) => dt.jobNo === dataInfo.jobNo && dt.fieldName === 'ชื่อ').length > 0">
                  {{dataJob.filter((dt) => dt.jobNo === dataInfo.jobNo && dt.fieldName === 'ชื่อ')[0].fieldValue}}
                </p>
                <div style="display: flex;align-items: flex-start;">
                  <v-icon color="#F48686" class="mx-1">mdi-square-medium</v-icon>
                <p class="font-weight-medium mb-1" style="font-size:14px" v-if="dataInfo.flowName !== null">
                  <!-- <v-icon color="#F48686" class="mx-1">mdi-square-medium</v-icon> -->
                  {{dataInfo.flowName}}
                </p>
                </div>
                <div style="display: flex;align-items: flex-start;word-break: break-word;">
                  <v-icon color="#F48686" class="mx-1 mr-2">mdi-map-marker-radius</v-icon>
                  <p class="font-weight-medium mb-1" style="font-size:14px" v-if="dataInfo.address !== null">
                  <!-- <v-icon color="#F48686" class="mx-1 mr-2">mdi-map-marker-radius</v-icon> -->
                  {{dataInfo.address}}
                </p>
                </div>
                <div style="display: flex;align-items: flex-start;">
                  <v-icon  color="#24C74D" class="mx-2 mr-2 mt-1 iconify" small data-icon="el:phone-alt"></v-icon>
                  <p class="font-weight-bold mb-1" style="font-size:14px" v-if="dataJob.filter((dt) => dt.jobNo === dataInfo.jobNo && dt.fieldName === 'เบอร์โทร').length > 0">
                  <!-- <v-icon  color="#24C74D" class="mx-2 mr-2 mt-1 iconify" small data-icon="el:phone-alt"></v-icon> -->
                {{dataJob.filter((dt) => dt.jobNo === dataInfo.jobNo && dt.fieldName === 'เบอร์โทร')[0].fieldValue}}
                </p>
                </div>
              </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                  <v-btn
                    depressed
                    color="error"
                    rounded
                    @click="dialogDetail = false"
                  >
                  ปิดหน้านี้
                  </v-btn>
                </v-col>
              </v-row>
              <!-- <v-card-title><b>รายละเอียดนัดหมาย</b></v-card-title>
              <v-card-text>
                <v-row>
                  <v-col class="text-right">ประเภทบริการ</v-col>
                  <v-col class="text-left">{{dataInfo.flowName}}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-right">วันที่ต้องการนัดหมาย</v-col>
                  <v-col class="text-left">{{dataInfo.dueDateFomatTH}}</v-col>
                </v-row>
                <v-row  v-for="(row, indexitemJob) in dataJob.filter(el => {return el.jobNo === dataInfo.jobNo;})" :key="indexitemJob">
                  <v-col class="text-right">{{row.fieldName}}</v-col>
                  <v-col class="text-left">{{row.fieldValue}}</v-col>
                </v-row>
                <template v-if="dataInfoPackage.length > 0">
                  <v-subheader>ข้อมูลแพ็คเกจ</v-subheader>
                  <v-card
                    class="mb-0 mt-0"
                    height="auto"
                    style="box-shadow: 0px 4px 4px 0px #00000040;padding:15px;border-radius: 20px;"
                  >
                    <v-row v-for="(item, indexInfoPackage) in dataInfoPackage" :key="indexInfoPackage">
                      <v-col cols="4" style="padding-top:10px;" align="center">
                        <img :src="item.packageImg" style="width: 85px; height: 85px;border-radius: 25px;border-style: solid;border-color: #eeee;" class="link"/>
                      </v-col>
                      <v-col cols="8" class="pl-3 pr-0 text-left">
                        <div class="font16 bold mt-1">
                          <v-col class="pa-0">{{ item.packageName }}</v-col>
                          <v-col class="pl-0 pt-0 pb-1 font12">ใช้ก่อนวันที่ {{ format_dateFUllTime(new Date(item.expirePackage * 1000)) }}</v-col>
                          <v-col class="pl-0 pt-0 pb-1 font12">จำนวนการใช้ {{ item.balanceAmount }} / {{ item.amount }}</v-col>
                          <v-col v-if="item.packageDetail" class="pl-0 pt-0 pb-1 font12">รายละเอียด {{item.packageDetail}}</v-col>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </template>
              </v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-btn
                    depressed
                    color="error"
                    block
                    @click="dialogDetail = false"
                  >
                  ปิดหน้านี้
                  </v-btn>
                </v-col>
              </v-row> -->
            </v-card>
          </v-dialog>
                  <!-- DIALOG ค่าใช้จ่าย -->
        <v-dialog v-model="dialogDelete" persistent max-width="400px">
          <v-card v-if="checkPayment === 'True'">
            <v-col class="text-center">
              <span class="headline">ค่าใช้จ่าย</span>
            </v-col>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <VuetifyMoney
                      v-model="totalPrice"
                      placeholder="ค่าใช้จ่ายทั้งหมด"
                      dense
                      label="ค่าใช้จ่ายทั้งหมด"
                      required
                      outlined
                      :rules="[rules.required]"
                      v-bind:options="options2"
                    />
                  </v-col>
                  <!-- <v-col class="pb-0"  cols="12" v-if="dataPackage.length > 0">
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
                  </v-col> -->
                  <v-col class="text-center"  cols="12">
                    <v-btn
                      dark
                      elevation="2"
                      depressed
                      color="#1B437C"
                      :disabled="totalPrice === ''? true : false"
                      @click="closeJobSubmit(totalPrice)"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      ชำระเงิน
                    </v-btn>
                    <v-btn
                      color="primary"
                      depressed
                      @click=";(dialogDelete = false)"
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
                  <!-- <v-col class="text-center"  cols="12">
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
                  </v-col> -->
                  <v-col class="text-center"  cols="12">
                    <v-btn
                      dark
                      elevation="2"
                      depressed
                      color="#1B437C"
                      @click="closeJobSubmit()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      จบกระบวนการซ่อม
                    </v-btn>
                    <v-btn
                      color="primary"
                      depressed
                      @click=";(dialogDelete = false)"
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
        <v-dialog v-model="dialogMessage" persistent max-width="80%">
          <v-card class="pa-1 px-3">
            <div style="text-align: end;">
                <v-btn
                class="mx-2 mr-n1 mt-1"
                fab
                small
                dark
                color="white"
                :style="styleCloseBt"
                @click="(dialogMessage = false) , clearMessage()"
                >
                X
                </v-btn>
            </div>
            <div class="mt-2">
              <h3 class="text-center mb-6"><v-icon large color="#1DBF73" class="mr-2">mdi-android-messages</v-icon>ส่งข้อความ</h3>
              <v-textarea
              v-model="formMessage.Message"
              outlined
              name="input-7-4"
              label="ข้อความ"
              value=""
            ></v-textarea>
              <v-img
                v-if="formMessage.Img !== ''"
                class="pa-3 text-center"
                contain
                max-height="60%"
                max-width="100%"
                :src="formMessage.Img"
              ></v-img>
            <v-file-input
               class="mt-6 mb-6"
              required
              counter
              show-size
              outlined
              accept="image/png, image/jpeg, image/bmp"
              prepend-icon="mdi-camera"
              label="อัพโหลดรูปภาพ"
              @change="selectImgCoverUpdate"
              v-model="filesUpdateImgCover"
            ></v-file-input>
            </div>
            <div class="text-center">
              <v-btn
                class="ma-2 mb-5"
                elevation="2"
                rounded
                color="#F38383"
                dark
                @click="sendMessage()"
              >ส่งข้อความ</v-btn>
            </div>

          </v-card>
        </v-dialog>
        <!-- END -->
          <v-footer padless fixed color="#FFFFFF" style="border-top-color: #bdbdbd;
    border-top-style: double;
    padding-top: 10px;">
          <v-sheet
              width="100%"
              height="80px"
              class="pa-0 ma-0"
            >
              <v-list flat class="pa-0">
                <v-list-item-group
                v-model="model"
                  color="success"
                  class="flex-container"
                >
                  <v-list-item>
                    <v-list-item-content class="pa-0 pt-1">
                      <v-icon class="mb-2" large >mdi-home-variant-outline</v-icon>
                      <p class="text-center mt-n1">{{'รอ'}}</p>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content class="pa-0 pt-1">
                      <v-icon class="mb-2" large >mdi-car-outline</v-icon>
                      <p class="text-center mt-n1">{{'เริ่มงาน'}}</p>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content class="pa-0 pt-1">
                      <v-icon class="mb-2" large >mdi-text-box-check-outline</v-icon>
                      <p class="text-center mt-n1">{{'สรุปรายการ'}}</p>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-sheet>
        </v-footer>
        <ChatHistory ref="ChatHistory"></ChatHistory>
        <Medication ref="Medication"></Medication>
        <Disease ref="Disease"></Disease>
      </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import adminLeftMenu from '../Sidebar.vue' // เมนู
import moment from 'moment-timezone' // แปลง date
import VuetifyMoney from '../VuetifyMoney.vue'
import ChatHistory from '../Master/ChatHistory.vue'
import Medication from './Medication.vue'
import Disease from './Disease.vue'

export default {
  name: 'JobList',
  components: {
    'left-menu-admin': adminLeftMenu,
    VuetifyMoney,
    ChatHistory,
    Medication,
    Disease
  },
  watch: {
    // whenever question changes, this function will run
    model (newQuestion, oldQuestion) {
      if (newQuestion === undefined) {
        newQuestion = oldQuestion
        this.model = newQuestion
        this.sortNo = oldQuestion + 1
        console.log('test', newQuestion, oldQuestion)
      } else {
        this.sortNo = newQuestion + 1
      }
    }
  },
  computed: {
    dialogwidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '90%'
        case 'sm': return '80%'
        case 'md': return '70%'
        case 'lg': return '70%'
        case 'xl': return '70%'
      }
    }
  },
  data () {
    return {
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
      formMessage: {
        jobNo: '',
        Message: '',
        Img: '',
        empId: '',
        CREATE_USER: '',
        LAST_USER: '',
        shopId: ''
      },
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      modal: false,
      footer: [
        {
          icon: 'mdi-home-variant-outline',
          text: 'รอ'
        },
        {
          icon: 'mdi-car-outline',
          text: 'เริ่มงาน'
        },
        {
          icon: 'mdi-text-box-check-outline',
          text: 'สรุปรายการ'
        }
      ],
      model: 0,
      monthNamesThai: ['', 'ม.ค', 'ก.พ', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค'],
      swalConfig: {
        title: null,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      },
      session: this.$session.getAll(),
      shopId: this.$session.getAll().data.shopId,
      breadcrumbs: [
        {
          text: 'รายการงานทั้งหมด',
          disabled: false,
          href: '/Onsite/JobList'
        }
      ],
      dialogMessage: false,
      dialogDetail: false,
      dialogDelete: false,
      checkPayment: null,
      totalPrice: '',
      itemFlow: [],
      selectFlow: '',
      tab: null,
      itemFlowStep: [],
      itemJob: [],
      dataJob: [],
      center: null,
      address: '',
      dialogMap: false,
      sortNo: 1,
      jobNo: '',
      dataInfo: {},
      dataInfoPackage: [],
      dataFlowStep: [],
      dataJobLog: [],
      selectStep: '',
      itemStep: [],
      dataCloseJob: [],
      dataCloseJobData: [],
      filesUpdateImgCover: null,
      formDelete: {
        jobId: '',
        jobNo: '',
        shopId: '',
        totalPrice: '',
        LAST_USER: '',
        statusDelete: 'true'
      },
      jobLog_jobNo: '',
      dialogShowImg: false,
      showImgItem: [],
      dialogImg: false,
      showImg: '',
      joyRidePatient: null
    }
  },
  async mounted () {
    await this.beforeCreate()
    await this.setDefault()
  },
  methods: {
    async getDisease (item) {
      const data = this.dataJob.filter(el => { return el.jobNo === item.jobNo })
      this.$refs.Disease.openDialog(item, data)
    },
    async getMedication (item) {
      this.$refs.Medication.openDialog(item)
    },
    SelectImg (Imgitem) {
      this.showImg = Imgitem
      this.dialogImg = true
    },
    async ShowImg (item) {
      this.showImgItem = []
      await axios.get(this.DNS_IP + '/jobBeforeAfter/get?jobId=' + item.jobId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            // this.showImgItem = rs
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (d.afterImage !== null || d.beforeImage !== null) {
                this.showImgItem.push(d)
              }
            }
            if (this.showImgItem.length > 0) {
              this.dialogShowImg = true
            } else {
              this.$swal('ไม่มีรูปภาพ', '', 'info')
            }
          }
          console.log('rs', rs)
        })
    },
    ChatHistory (item) {
      this.$refs.ChatHistory.getChatHistory(item)
    },
    async setDefault () {
      this.selectFlow = 'All'
      await this.getByflow()
    },
    refUploadBefore (index) {
      let fileUpload = document.getElementById(`uploadBefore${[index]}`)
      if (fileUpload != null) {
        fileUpload.click()
      }
    },
    refUploadAfter (index) {
      let fileUpload = document.getElementById(`uploadAfter${[index]}`)
      if (fileUpload != null) {
        fileUpload.click()
      }
    },
    momentThaiText (item) {
      let dt = moment(item).locale('th').format('LLLL')
      return dt
    },
    momentThaiTextClose (item) {
      let dt = 'วัน' + moment(item).locale('th').format('dddd') + 'ที่ ' + moment(item).locale('th').format('LL')
      return dt
    },
    async getByflow () {
      if (this.selectFlow === 'All') {
        await this.getDataJob()
        await this.getJobLog()
        await this.getFlowStep()
        await this.getCloseJob(this.date)
      } else {
        await this.getDataJob()
        await this.getJobLog()
        await this.getFlowStep()
        await this.getCloseJob(this.date)
      }
    },
    setLinks (text) {
      // eslint-disable-next-line no-useless-escape
      const Rexp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig
      return text.replace(Rexp, "<a href='$1' target='_blank'>$1</a>")
    },
    NewTap (address) {
      window.open(address, '_blank')
    },
    setMessage (item) {
      console.log('item', item)
      this.formMessage.jobNo = item.jobNo
      this.formMessage.empId = parseInt(this.session.data.empId)
      this.formMessage.LAST_USER = this.session.data.userName
      this.formMessage.CREATE_USER = this.session.data.userName
      this.formMessage.shopId = this.shopId
      console.log('his.formMessage', this.formMessage)
    },
    clearMessage () {
      this.formMessage.jobNo = ''
      this.formMessage.empId = ''
      this.formMessage.Img = ''
      this.formMessage.Message = ''
      this.formMessage.LAST_USER = ''
      this.formMessage.CREATE_USER = ''
      this.filesUpdateImgCover = null
    },
    async sendMessage () {
      console.log('formMessage', this.formMessage)
      let replaceMessage = this.formMessage.Message || ''
      this.formMessage.Message = replaceMessage.replace(/%/g, '%%').replace(/'/g, "\\'")
      if (this.formMessage.Message !== '' || this.formMessage.Img !== '') {
        this.$swal({
          title: 'คุณต้องการ ส่งข้อความ ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#F38383',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async response => {
          if (this.filesUpdateImgCover) {
            const _this = this
            let params = new FormData()
            let configDepositUpload = {
              headers: {
                'jobNo': this.formMessage.jobNo
              }
            }
            params.append('file', this.filesUpdateImgCover)
            await axios
              .post(this.DNS_IP + `/file/upload/MessageImg`, params, configDepositUpload)
              .then(function (response) {
                _this.formMessage.Img = response.data
                console.log('url Pic', response.data)
              })
          } else {
            this.formMessage.Img = this.filesUpdateImgCover
          }
          await axios.post(this.DNS_IP + '/PushMessage_LOG/add', this.formMessage)
            .then(async (response) => {
              console.log('response', response)
              this.formMessage.Message = replaceMessage
              await this.pushMessage()
              await this.clearMessage()
              this.dialogMessage = false
            }).catch(error => {
              console.log('error function addData : ', error)
            })
        })
      } else {
        this.$swal('ผิดพลาด', 'โปรดระบุ ข้อความ หรือ รูปภาพ', 'error')
      }
    },
    async pushMessage () {
      await axios.post(this.DNS_IP + '/job/MessageRider/' + this.formMessage.jobNo, this.formMessage)
        .then(response => {
          console.log('response', response)
        }).catch(error => {
          console.log('error function addData : ', error)
        })
    },
    selectImgCoverUpdate () {
      console.log('filesUpdateImgCover', this.filesUpdateImgCover)
      if (this.filesUpdateImgCover) {
        this.formMessage.Img = URL.createObjectURL(
          this.filesUpdateImgCover
        )
      } else {
        this.formMessage.Img = ''
      }
      console.log('testttttttttt', this.formMessage.Img)
    },
    async beforeCreate () {
      if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
        if (JSON.parse(localStorage.getItem('sessionData')).shopId === this.$route.query.shopId && this.$route.query.type === 'jobList' && JSON.parse(localStorage.getItem('sessionData')).empId === this.$route.query.empId) {
          if (this.$session.id() !== undefined) {
            await this.getDataFlow()
            await this.checkJobList()
          } else {
            this.$session.start()
            this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
            location.reload()
            // await this.getDataFlow()
            // await this.checkJobList()
          }
        } else {
          if (this.$route.query.type === 'jobList') {
            this.$swal('ผิดพลาด', 'รายการนี้ไม่ได้มอบหมายให้คุณ', 'error')
            this.$router.push('/Onsite/JobList')
            // this.$router.push('/Core/Login?jobNo=' + this.$route.query.jobNo + '&shopId=' + this.$route.query.shopId + '&type=jobList&empId=' + this.$route.query.empId)
          } else {
            if (this.$session.id() === undefined) {
              this.$session.start()
              this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
              // await this.getDataFlow()
              location.reload()
            } else {
              await this.getDataFlow()
            }
          }
        }
      } else {
        if (!this.$session.exists()) {
          if (this.$route.query.type === 'jobList') {
            this.$router.push('/Core/Login?jobNo=' + this.$route.query.jobNo + '&shopId=' + this.$route.query.shopId + '&type=jobList&empId=' + this.$route.query.empId)
          } else {
            this.$router.push('/Core/Login')
          }
        } else {
          if (this.$session.getAll().data.shopId === this.$route.query.shopId && this.$route.query.type === 'jobList' && this.$session.getAll().data.empId === this.$route.query.empId) {
            localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
            await this.getDataFlow()
            await this.checkJobList()
          } else if (this.$session.id() !== undefined && this.$route.query.type === undefined) {
            localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
            await this.getDataFlow()
          } else {
            if (this.$route.query.type === 'jobList') {
              this.$swal('ผิดพลาด', 'รายการนี้ไม่ได้มอบหมายให้คุณ', 'error')
              this.$router.push('/Onsite/JobList')
              // this.$router.push('/Core/Login?jobNo=' + this.$route.query.jobNo + '&shopId=' + this.$route.query.shopId + '&type=jobList&empId=' + this.$route.query.empId)
            } else {
              this.$router.push('/Core/Login')
            }
          }
        }
      }
      // console.log(JSON.stringify(this.$session.getAll().data))
    },
    async checkJobList () {
      await axios
        .get(
          this.DNS_IP +
            '/job/getList?shopId=' +
            this.$session.getAll().data.shopId +
            '&empStep=' +
            this.$session.getAll().data.empId +
            '&jobNo=' + this.$route.query.jobNo
        )
        .then(async response => {
          console.log('beforeCreate', response.data)
          if (response.data.status === false) {

          } else {
            this.selectFlow = parseInt(response.data[0].flowId)
            // await this.getDataFlowStep()
            await this.checkEmpJob()
            await this.getJobData()
            if (response.data[0].sortNo >= 2) {
              this.tab = 1
              this.sortNo = 2
              console.log('this.model', this.model)
            } else {
              this.tab = 0
              this.sortNo = 1
            }
            this.jobNo = this.$route.query.jobNo
          }
        })
    },
    async detailsJob (data, packageId) {
      this.dataInfo = {}
      this.dataInfoPackage = []
      this.dataInfo = data
      this.dialogDetail = true
      console.log('detailsJob', data)
      if (packageId) {
        let packageIds = packageId[0].packageId || ''
        if (packageIds !== '') {
          await axios.get(this.DNS_IP_Loyalty + '/PackageLog/get?shopId=' + data.shopId + '&lineUserId=' + data.lineUserId + '&packageId=' + packageIds).then(response => {
            console.log('PackageLog', response.data)
            let rs = response.data
            if (rs.status === false) {
              this.dataInfoPackage = []
            } else {
              this.dataInfoPackage = rs
            }
          })
        }
      }
      console.log('this.dataInfoPackage', this.dataInfoPackage)
      this.dialogDetail = true
    },
    async getJobLog () {
      console.log('shopId', this.shopId)
      console.log('this.selectFlow', this.selectFlow)
      console.log('jobLog_jobNo!!!!!!!', this.jobLog_jobNo)
      this.dataJobLog = []
      if (this.jobLog_jobNo !== '') {
        let params = null
        // if (this.selectFlow === 'All') {
        // // if ()
        //   params = this.DNS_IP + '/job_log/get?shopId=' + this.shopId + '&checkOnsite=True&empStepId=' + this.session.data.empId + '&jobNo=' + this.jobLog_jobNo
        // } else {
        //   params = this.DNS_IP + '/job_log/get?shopId=' + this.shopId + '&flowId=' + this.selectFlow + '&empStepId=' + this.session.data.empId + '&jobNo=' + this.jobLog_jobNo
        // }
        if (this.selectFlow === 'All') {
        // if ()
          params = this.DNS_IP + '/job_log/get?shopId=' + this.shopId + '&checkOnsite=True&jobNo=' + this.jobLog_jobNo
        } else {
          params = this.DNS_IP + '/job_log/get?shopId=' + this.shopId + '&flowId=' + this.selectFlow + '&jobNo=' + this.jobLog_jobNo
        }
        await axios.get(params)
          .then(response => {
            let rs = response.data
            if (rs.length > 0) {
              this.dataJobLog = rs
            }
            console.log('!!!!!!JOB_LOG', rs)
          }).catch(error => {
            console.log('error function addData : ', error)
          })
      } else {
        this.dataJobLog = []
      }
    },
    async getFlowStep () {
      console.log('shopId', this.shopId)
      console.log('this.selectFlow', this.selectFlow)
      this.itemStep = []
      let params = null
      if (this.selectFlow === 'All') {
        params = this.DNS_IP + '/flowStep/get?shopId=' + this.shopId + '&checkOnsite=True'
      } else {
        params = this.DNS_IP + '/flowStep/get?shopId=' + this.shopId + '&flowId=' + this.selectFlow
      }
      await axios.get(params)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.dataFlowStep = rs
            rs.forEach((item) => {
              let s = {}
              s.text = item.stepTitle
              s.value = item.stepId
              s.flowId = item.flowId
              this.itemStep.push(s)
            })
          }
          console.log('rs2', rs)
        }).catch(error => {
          console.log('error function addData : ', error)
        })
    },
    callCustomer (data) {
      console.log('dataJob', data)
      if (data.filter(el => { return el.fieldName === 'เบอร์โทร' }).length > 0) {
        window.location = 'tel:' + data.filter(el => { return el.fieldName === 'เบอร์โทร' })[0].fieldValue
      } else {
        this.$swal(
          'ผิดพลาด',
          'ไม่มีเบอร์โทร',
          'error'
        )
      }
    },
    handleFileImportBefore () {
      window.addEventListener('focus', () => {
      }, { once: true })

      // Trigger click on the FileInput
      this.$refs.uploaderBefore.click()
    },
    async addBeforeAfter (item, dt) {
      console.log('addBeforeAfter', item)
      if (item[item.length - 1].afterImage === null && item[item.length - 1].beforeImage === null) {
        this.$swal(
          'ผิดพลาด',
          'กรุณาเพิ่มรูปภาพด้านบนก่อน',
          'error'
        )
      } else {
        item = []
        let dajobBeforeAfter = {
          jobId: dt.jobId,
          CREATE_USER: this.$session.getAll().data.userName,
          LAST_USER: this.$session.getAll().data.userName
        }
        await axios
          .post(this.DNS_IP + '/jobBeforeAfter/add', dajobBeforeAfter)
          .then(async response => {
            await this.checkEmpJob()
            // await axios
            //   .get(
            //     this.DNS_IP + '/jobBeforeAfter/get?jobId=' + dt.jobId
            //   )
            //   .then(async responses => {
            //     item = responses.data
            //   })
          })
      }
    },
    async selectImgUpdate (item, text) {
      console.log(item, text)
      if (text === 'after') {
        if (item.filesAfter) {
          let urlPic = ''
          let params = new FormData()
          params.append('file', item.filesAfter)
          await axios
            .post(this.DNS_IP + `/file/upload/beforeAfter`, params)
            .then(async function (response) {
              console.log('url Pic', response.data)
              urlPic = response.data
            })
          let dajobBeforeAfter = {
            afterImage: urlPic,
            LAST_USER: this.$session.getAll().data.userName
          }
          await axios
            .post(this.DNS_IP + '/jobBeforeAfter/edit/' + item.id, dajobBeforeAfter)
            .then(async responses => {
              item.afterImage = urlPic
            })
        }
      } else {
        if (item.filesBefore) {
          let urlPic = ''
          let params = new FormData()
          params.append('file', item.filesBefore)
          await axios
            .post(this.DNS_IP + `/file/upload/beforeAfter`, params)
            .then(async function (response) {
              console.log('url Pic', response.data)
              urlPic = response.data
            })
          let dajobBeforeAfter = {
            beforeImage: urlPic,
            LAST_USER: this.$session.getAll().data.userName
          }
          await axios
            .post(this.DNS_IP + '/jobBeforeAfter/edit/' + item.id, dajobBeforeAfter)
            .then(async responses => {
              item.beforeImage = urlPic
            })
        }
      }
    },
    async deleteBeforeAfter (item, text) {
      console.log(item, text)
      this.swalConfig.title = 'ต้องการ ลบรูปนี้ ใช่หรือไม่?'
      this.$swal(this.swalConfig).then(async () => {
        if (text === 'after') {
          let dajobBeforeAfter = {
            afterImage: 'is null',
            LAST_USER: this.$session.getAll().data.userName
          }
          await axios
            .post(this.DNS_IP + '/jobBeforeAfter/edit/' + item.id, dajobBeforeAfter)
            .then(async responses => {
              await this.checkEmpJob()
            })
        } else {
          let dajobBeforeAfter = {
            beforeImage: 'is null',
            LAST_USER: this.$session.getAll().data.userName
          }
          await axios
            .post(this.DNS_IP + '/jobBeforeAfter/edit/' + item.id, dajobBeforeAfter)
            .then(async responses => {
              await this.checkEmpJob()
            })
        }
      })
    },
    async deleteBeforeAfterAll (item) {
      console.log('item', item)
      let checkArray = this.itemJob.filter((dt) => dt.jobId === parseInt(item.jobId))[0].dataBeforeAfter
      if (checkArray.length > 1) {
        this.swalConfig.title = 'ต้องการ ลบรูปทั้งหมดในแถว ใช่หรือไม่?'
        this.$swal(this.swalConfig).then(async () => {
          let dajobBeforeAfter = {
            LAST_USER: this.$session.getAll().data.userName
          }
          await axios
            .post(this.DNS_IP + '/jobBeforeAfter/delete/' + item.id, dajobBeforeAfter)
            .then(async responses => {
              await this.checkEmpJob()
            })
        })
      }
    },
    async checkSort () {
      this.sortNo = this.model + 1
    },
    gotoMap () {
      window.open('https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + this.center.lat + ',' + this.center.lng, '_blank')
    //   window.location.href =
    //     'https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' +
    //     this.center.lat +
    //     ',' +
    //     this.center.lng
    },
    setShowMap (dt) {
      console.log('dt', dt)
      this.center = null
      if (dt.addressLatLong === null && dt.addressLatLong === '') {
        this.center = null
        console.log('if')
      } else {
        this.center = JSON.parse(dt.addressLatLong)
        this.address = dt.address
        this.dialogMap = true
        console.log('else')
      }
    },
    async getDataFlow () {
      this.itemFlow = await this.getDataFromAPI(
        '/flow/get',
        'flowId',
        'flowName',
        '&checkOnsite=True'
      )
    },
    // async getDataFlowStep () {
    //   this.itemFlowStep = await this.getDataFromAPI(
    //     '/flowStep/get',
    //     'stepId',
    //     'stepTitle',
    //     '&flowId=' + this.selectFlow
    //   )
    //   console.log('!!!!!!!!', await this.getDataFromAPI(
    //     '/flowStep/get',
    //     'stepId',
    //     'stepTitle',
    //     'shopId',
    //     '&flowId=' + this.selectFlow
    //   ))
    // },
    async getDataFromAPI (url, fieldId, fieldName, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.$session.getAll().data.shopId}${param}`)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d[fieldName]
              s.value = d[fieldId]
              s.allData = d
              result.push(s)
            }
            let all = {}
            all.text = 'ทั้งหมด'
            all.value = 'All'
            result.push(all)
          } else {
            result = []
          }
        })
      return result
    },
    async getDataJob () {
      // await this.getDataFlowStep()
      await this.checkEmpJob()
      await this.getJobData()
      if (this.itemJob.filter(el => { return el.sortNo >= 2 }).length > 0) {
        this.sortNo = 2
        this.model = 1
        console.log('IF')
      } else {
        this.sortNo = 1
        this.model = 0
        console.log('ELSE')
      }
    },
    async checkEmpJob () {
      this.itemJob = []
      let params = null
      if (this.selectFlow === 'All') {
        params = this.DNS_IP + '/job/getList?shopId=' + this.$session.getAll().data.shopId + '&empStep=' + this.$session.getAll().data.empId + '&checkOnsite=True'
      } else {
        params = this.DNS_IP + '/job/getList?shopId=' + this.$session.getAll().data.shopId + '&empStep=' + this.$session.getAll().data.empId + '&flowId=' + this.selectFlow
      }
      await axios
        .get(params)
        .then(async response => {
          let rs = response.data
          console.log('rs!!!!!!!!!', rs)
          if (rs.status === false) {
            this.itemJob = []
          } else {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (d.userId !== null) {
                if (d.sortNo >= 2) {
                  await axios
                    .get(
                      this.DNS_IP + '/jobBeforeAfter/get?jobId=' + d.jobId
                    )
                    .then(async responses => {
                      if (responses.data.status === false) {
                        d.dataBeforeAfter = [{'beforeImage': null, 'afterImage': null, 'filesBefore': null, 'filesAfter': null}]
                        let dajobBeforeAfter = {
                          jobId: d.jobId,
                          CREATE_USER: this.$session.getAll().data.userName,
                          LAST_USER: this.$session.getAll().data.userName
                        }
                        await axios
                          .post(this.DNS_IP + '/jobBeforeAfter/add', dajobBeforeAfter)
                          .then(async responses => {
                          })
                      } else {
                        d.dataBeforeAfter = responses.data
                      }
                    })
                }
                d.dataShow = d.dueDateD + ' ' + this.monthNamesThai[parseInt(d.dueDateM)]
                this.itemJob.push(d)
              }
            }
            console.log('this.itemJob', this.itemJob)
            if (this.itemJob.filter((item) => item.sortNo >= 2).length === 1) {
              // console.log('???')
              this.jobLog_jobNo = this.itemJob.filter((item) => item.sortNo >= 2)[0].jobNo
            }
            console.log('checkIF!!!!!!!!!!!!Sort2', this.jobLog_jobNo)
          }
        })
    },
    async getCloseJob (dateMonth) {
      this.dataCloseJob = []
      let paramsCloseJob = null
      if (this.selectFlow === 'All') {
        paramsCloseJob = this.DNS_IP + '/job/getCloseJob?shopId=' + this.$session.getAll().data.shopId + '&empId=' + this.$session.getAll().data.empId + '&month=' + dateMonth + '&checkOnsite=True'
      } else {
        paramsCloseJob = this.DNS_IP + '/job/getCloseJob?shopId=' + this.$session.getAll().data.shopId + '&empId=' + this.$session.getAll().data.empId + '&flowId=' + this.selectFlow + '&month=' + dateMonth
      }
      await axios
        .get(paramsCloseJob)
        .then(async response => {
          let rs = response.data
          console.log('this.dataCloseJob', rs)
          if (rs.status === false) {
            this.dataCloseJob = []
          } else {
            this.dataCloseJob = rs
          }
        })
      this.dataCloseJobData = []
      let paramsCloseJobData = null
      if (this.selectFlow === 'All') {
        paramsCloseJobData = this.DNS_IP + '/job/getCloseJobData?shopId=' + this.$session.getAll().data.shopId + '&empStepId=' + this.$session.getAll().data.empId + '&checkOnsite=True&month=' + dateMonth
      } else {
        paramsCloseJobData = this.DNS_IP + '/job/getCloseJobData?shopId=' + this.$session.getAll().data.shopId + '&empStepId=' + this.$session.getAll().data.empId + '&flowId=' + this.selectFlow + '&month=' + dateMonth
      }
      await axios
        .get(paramsCloseJobData)
        .then(async response => {
          let rs = response.data
          console.log('this.dataCloseJobData', rs)
          if (rs.status === false) {
            this.dataCloseJobData = []
          } else {
            this.dataCloseJobData = rs
            // console.log('this.dataCloseJobData', this.dataCloseJobData)
          }
        })
    },
    async getJobData () {
      this.dataJob = []
      let params = null
      if (this.selectFlow === 'All') {
        params = this.DNS_IP + '/job/get?shopId=' + this.$session.getAll().data.shopId + '&empStepId=' + this.$session.getAll().data.empId + '&checkOnsite=True'
      } else {
        params = this.DNS_IP + '/job/get?shopId=' + this.$session.getAll().data.shopId + '&empStepId=' + this.$session.getAll().data.empId + '&flowId=' + this.selectFlow
      }

      await axios
        .get(params)
        .then(async response => {
          let rs = response.data
          if (rs.status === false) {
            this.dataJob = []
          } else {
            this.dataJob = rs
            console.log('this.dataJob', this.dataJob)
          }
        })
    },
    updateJobStart (sortNo, jobId, data) {
      if (this.itemJob.filter(el => { return el.sortNo === 2 }).length === 0) {
        console.log('itemStep', this.itemStep)
        // console.log('dataflowStep', this.dataFlowStep.filter((item) => item.sortNo === sortNo + 1)[0].stepId)
        // formUpdate.stepId = this.selectStep
        // formUpdate.flowId = this.selectFlow
        // formUpdate.shopId = this.shopId
        // formUpdate.jobId = item.jobId
        // formUpdate.LAST_USER = this.session.data.userName
        console.log('data', data)
        this.swalConfig.title = 'ต้องการ เริ่มงานนี้ ใช่หรือไม่?'
        this.$swal(this.swalConfig).then(async () => {
          if (this.$session.id() !== undefined) {
            let formStart = {}
            formStart.jobId = data.jobId
            formStart.flowId = data.flowId
            formStart.shopId = this.shopId
            formStart.LAST_USER = this.session.data.userName
            formStart.stepId = this.dataFlowStep.filter((item) => parseInt(item.flowId) === data.flowId && (item.sortNo === sortNo + 1))[0].stepId
            // let dt = {}
            // let stepIdSelect = this.dataFlowStep.filter((item) => item.sortNo === sortNo + 1)[0].stepId
            // if (sortNo === 1) {
            //   dt = {
            //     stepId: stepIdSelect,
            //     onsiteStartDate: moment(
            //       moment(new Date()),
            //       'YYYY-MM-DD HH:mm:ss'
            //     ).format('YYYY-MM-DD HH:mm:ss'),
            //     LAST_USER: this.$session.getAll().data.userName
            //   }
            // }
            // console.log('updateJob', dt)
            // console.log(sortNo, jobId)
            await axios
              .post(this.DNS_IP + '/job/edit/' + formStart.jobId, formStart)
              .then(async response => {
                console.log(response)
                if (response.data.status) {
                  let dajobBeforeAfter = {
                    jobId: jobId,
                    CREATE_USER: this.$session.getAll().data.userName,
                    LAST_USER: this.$session.getAll().data.userName
                  }
                  await axios
                    .post(this.DNS_IP + '/jobBeforeAfter/add', dajobBeforeAfter)
                    .then(async responses => {
                      if (data.lineUserId) {
                        this.pushMessageCus(data.jobId)
                      }
                      await this.getDataJob()
                      await this.getJobLog()
                      await this.getFlowStep()
                      await this.getCloseJob(this.date)
                      await this.$swal('เรียบร้อย', 'รับงานนี้เรียบร้อย', 'success')
                    })
                } else {
                  this.$swal(
                    'ผิดพลาด',
                    'เนื่องจากรายการนี้มีคนนำเข้าแล้ว',
                    'error'
                  )
                }
              })
          } else {
            this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
            this.$router.push('/Core/Login')
          }
        })
      } else {
        this.$swal(
          'ผิดพลาด',
          'เนื่องจากมีรายการที่เริ่มงานแล้ว กรุณาปิดงาน',
          'error'
        )
      }
    },
    async closeJobStart (data, text = 'Alert') {
      console.log(this.itemFlow)
      console.log(data.flowId)
      this.checkPayment = this.itemFlow.filter((item) => item.value === data.flowId)[0].allData.checkPayment
      // console.log('data', data)
      console.log('itemFlow', this.itemFlow)
      console.log('checkpayment', this.checkPayment)
      // formDelete: {
      //   jobNo: '',
      //   shopId: '',
      //   totalPrice: '',
      //   LAST_USER: '',
      //   statusDelete: 'true'
      // }
      this.formDelete.jobId = data.jobId
      this.formDelete.jobNo = data.jobNo
      this.formDelete.shopId = this.shopId
      this.formDelete.LAST_USER = this.session.data.userName
      if (this.checkPayment === 'True') {
        this.dialogDelete = true
        console.log('testIF')
      } else {
        if (text === 'notAlert') {
          this.closeJobSubmit('0', text)
        } else {
          this.closeJobSubmit('0')
        }
        if (this.shopId === 'U9f316c85400fd716ea8c80d7cd5b61f8') {
          await this.pushmessageDrug(data)
        }
      }
      console.log('this.formDelete', this.formDelete)
    },
    async closeJobSubmit (totalPrice, text = 'Alert') {
      if (text === 'notAlert') {
        if (this.totalPrice === '') {
          this.formDelete.totalPrice = totalPrice
        } else {
          this.formDelete.totalPrice = this.totalPrice
        }
        // this.CloseOnsiteCalendarGridTime(this.formDelete.jobNo)
        await axios
          .post(this.DNS_IP + '/job/editPrice/' + this.formDelete.jobId, this.formDelete)
          .then(async response => {
            await this.pushmessagePrice(this.formDelete.jobNo)
            this.$swal('เรียบร้อย', 'ปิดงานเรียบร้อย', 'success')
            await this.getDataJob()
            await this.getCloseJob(this.date)
            this.dialogDelete = false
            this.totalPrice = ''
          })
      } else {
        this.$swal({
          title: 'ให้บริการ เสร็จเรียบร้อยแล้ว ใช่หรือไม่?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#F38383',
          cancelButtonColor: '#b3b1ab',
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ไม่'
        }).then(async response => {
          if (this.totalPrice === '') {
            this.formDelete.totalPrice = totalPrice
          } else {
            this.formDelete.totalPrice = this.totalPrice
          }
          // this.CloseOnsiteCalendarGridTime(this.formDelete.jobNo)
          await axios
            .post(this.DNS_IP + '/job/editPrice/' + this.formDelete.jobId, this.formDelete)
            .then(async response => {
              await this.pushmessagePrice(this.formDelete.jobNo)
              this.$swal('เรียบร้อย', 'ปิดงานเรียบร้อย', 'success')
              await this.getDataJob()
              await this.getCloseJob(this.date)
              this.dialogDelete = false
              this.totalPrice = ''
            })
        })
      }
    },
    async CloseOnsiteCalendarGridTime (jobNo) {
      let obj = {
        'userId': this.session.data.userName,
        'jobNo': jobNo
      }
      await axios
        .post(this.DNS_IP + '/CalendarGridTime/CloseEmp', obj)
        .then(async response => {
          console.log(response)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async pushmessagePrice (jobNo) {
      let updateStatusSend = { updateStatusSend: 'false', checkPayment: this.checkPayment }
      await axios
        .post(this.DNS_IP + '/job/pushClosejob/' + jobNo, updateStatusSend)
        .then(console.log(jobNo))
        .catch((error) => console.log('error', error))
    },
    async getJoyRideJobDisease (jobNo) {
      try {
        let config = {
          method: 'get',
          url: `${this.DNS_IP}/joyride_disease/get?jobNo=${jobNo}`
        }
        return axios.request(config)
          .then((response) => {
            let rs = response.data
            if (rs.status === false) {
              return []
            } else {
              return rs
            }
          })
          .catch((error) => {
            console.log(error)
            return []
          })
      } catch (err) {
        console.log('getJoyRideDrug', err)
        return []
      }
    },
    async getJoyRideJobDrug (jobNo) {
      try {
        let config = {
          method: 'get',
          url: `${this.DNS_IP}/joyride_job_drug/get?jobNo=${jobNo}`
        }
        return axios.request(config)
          .then((response) => {
            let rs = response.data
            if (rs.status === false) {
              return []
            } else {
              return rs
            }
          })
          .catch((error) => {
            console.log(error)
            return []
          })
      } catch (err) {
        console.log('getJoyRideDrug', err)
        return []
      }
    },
    async createBubbleDrug (drug) {
      let bubbleMsg = drug.map((row) => {
        let temp
        if (row.usage_type === 'external') {
          temp = {
            'type': 'box',
            'layout': 'vertical',
            'contents': [
              {
                'type': 'text',
                'text': `${row.drug_name} `,
                'weight': 'bold'
              },
              {
                'type': 'box',
                'layout': 'horizontal',
                'contents': [
                  {
                    'type': 'text',
                    'text': `${row.usage_description} `,
                    'flex': 1,
                    'size': 'sm'
                  }
                ],
                'margin': 'sm'
              },
              {
                'type': 'separator',
                'margin': 'lg'
              }
            ],
            'margin': 'lg'
          }
        } else {
          let eatWhen = ''
          let eatTime = ''
          if (row.usage_eat_when === 'before') {
            eatWhen = 'ก่อนอาหาร'
            eatTime += (row.usage_eat_morning) ? 'เช้า' : ''
            eatTime += (row.usage_eat_noon) ? ' กลางวัน' : ''
            eatTime += (row.usage_eat_dinner) ? ' เย็น' : ''
          } else if (row.usage_eat_when === 'after') {
            eatWhen = 'หลังอาหาร'
            eatTime += (row.usage_eat_morning) ? 'เช้า' : ''
            eatTime += (row.usage_eat_noon) ? ' กลางวัน' : ''
            eatTime += (row.usage_eat_dinner) ? ' เย็น' : ''
          } else if (row.usage_eat_when === 'sleep') {
            eatWhen = 'ก่อนนอน'
          } else if (row.usage_eat_when === 'specify') {
            eatWhen = `ทุก ${row.usage_specify_time_hour} ชม.`
          } else if (row.usage_eat_when === 'effect') {
            eatWhen = `เมื่อมีอาการ`
          }
          temp = {
            'type': 'box',
            'layout': 'vertical',
            'contents': [
              {
                'type': 'text',
                'text': `${row.drug_name}`,
                'weight': 'bold'
              },
              {
                'type': 'box',
                'layout': 'horizontal',
                'contents': [
                  {
                    'type': 'text',
                    'text': `${row.usage_qty_per_time} เม็ด `,
                    'flex': 1,
                    'size': 'sm'
                  },
                  {
                    'type': 'text',
                    'text': `${eatWhen} `,
                    'flex': 2,
                    'size': 'sm',
                    'align': 'center'
                  },
                  {
                    'type': 'text',
                    'text': `${eatTime} `,
                    'flex': 3,
                    'size': 'sm',
                    'align': 'end'
                  }
                ],
                'margin': 'sm'
              },
              {
                'type': 'separator',
                'margin': 'lg'
              }
            ],
            'margin': 'lg'
          }
        }
        return temp
      })
      return bubbleMsg
    },
    createBubbleDrAsa (uid) {
      return {
        'type': 'flex',
        'altText': 'สมุดสุขภาพ',
        'contents': {
          'type': 'bubble',
          'hero': {
            'type': 'image',
            'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/static%2FFrame%207%20(3).png?alt=media&token=fdb2f093-b69a-4259-bac5-b2dfa832aef6',
            'size': 'full',
            'aspectRatio': '5:6',
            'aspectMode': 'cover'
          },
          'footer': {
            'type': 'box',
            'layout': 'vertical',
            'spacing': 'sm',
            'contents': [
              {
                'type': 'button',
                'style': 'link',
                'height': 'sm',
                'action': {
                  'type': 'uri',
                  'label': 'เข้าดูสมุดสุขภาพของคุณ',
                  'uri': `https://uat.doctorasa.co/?juId=${uid}`
                },
                'color': '#ffffff'
              },
              {
                'type': 'box',
                'layout': 'vertical',
                'contents': [],
                'margin': 'sm'
              }
            ],
            'flex': 0,
            'backgroundColor': '#42BCC5'
          }
        }
      }
    },
    async getJoyRidePatient (job) {
      try {
        let config = {
          method: 'get',
          url: `${this.DNS_IP}/joyride_patient/get?jobNo=${job.jobNo}`
        }
        await axios.request(config).then((response) => {
          this.joyRidePatient = response.data
        }).catch((error) => {
          console.log(error)
        })
      } catch (err) {
        console.log('getJoyRidePatient', err)
      }
    },
    async pushmessageDrug (job) {
      const drug = await this.getJoyRideJobDrug(job.jobNo)
      await this.getJoyRidePatient(job)
      let messages = []
      if (drug.length > 0) {
        const bubbleMsg = await this.createBubbleDrug(drug)
        let bubbleDrug = {
          'type': 'flex',
          'altText': 'ข้อมูลยา',
          'contents': {
            'type': 'bubble',
            'hero': {
              'type': 'image',
              'url': 'https://firebasestorage.googleapis.com/v0/b/betask-linked/o/static%2FJoy%20Ride%20Content%20(1).jpg?alt=media&token=0f1b009d-2246-40c5-8276-60a2d738eaa6',
              'size': 'full',
              'aspectRatio': '1:1',
              'aspectMode': 'cover'
            },
            'body': {
              'type': 'box',
              'layout': 'vertical',
              'contents': [
                {
                  'type': 'text',
                  'text': 'ข้อมูลยา',
                  'weight': 'bold',
                  'size': 'xl'
                },
                {
                  'type': 'text',
                  'text': 'รายการยาที่คุณหมอสั่ง',
                  'size': 'sm'
                },
                {
                  'type': 'box',
                  'layout': 'vertical',
                  'contents': bubbleMsg,
                  'margin': 'lg',
                  'paddingBottom': '20px'
                }
              ]
            },
            'styles': {
              'hero': {
                'backgroundColor': '#eeeeee'
              }
            }
          }
        }
        messages.push(bubbleDrug)
      }
      if (!(this.joyRidePatient.status === false)) {
        let bubbleDrAsa = this.createBubbleDrAsa(this.joyRidePatient[0].patientUserId)
        messages.push(bubbleDrAsa)
      }
      if (messages.length > 0) {
        let pushText = {
          'to': job.lineUserId,
          'messages': messages
        }
        await axios.post(this.DNS_IP + '/line/pushmessage?shopId=' + this.shopId, pushText)
          .then(console.log(job))
          .catch((error) => console.log('error', error))
      }
    },
    pushMessageCloseJob (jobId) {
      let updateStatusSend = {
        updateStatusSend: 'false'
      }
      axios
        .post(this.DNS_IP + '/job/pushMsgCloseJobOnsite/' + jobId, updateStatusSend)
        .then(async responses => {})
    },
    pushMessageCus (jobId) {
      let updateStatusSend = {
        updateStatusSend: 'false'
      }
      axios
        .post(this.DNS_IP + '/job/pushMsg/' + jobId, updateStatusSend)
        .then(async responses => {})
    },
    async onUpdate (item) {
      let formUpdate = {}
      // this.formUpdate.stepId = this.formUpdate.stepTitle.stepId
      // this.formUpdate.flowId = this.flowId
      // this.formUpdate.shopId = this.shopId
      let checkLastStep = this.checkLastStep(this.selectStep, item)
      formUpdate.stepId = this.selectStep
      formUpdate.flowId = this.selectFlow
      formUpdate.shopId = this.shopId
      formUpdate.jobId = item.jobId
      console.log('formUpdate', formUpdate)
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
          formUpdate.LAST_USER = this.session.data.userName
          var ID = formUpdate.jobId
          // var flowId = formUpdate.flowId
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + '/job/edit/' + ID,
              formUpdate
            )
            .then(async response => {
              // Debug response
              console.log('editDataGlobal DNS_IP + PATH + "edit"', response)
              await this.pushMessageCus(formUpdate.jobId)
              // this.getLayout()
              await this.getJobData()
              await this.getDataJob()
              await this.getJobLog()
              await this.getFlowStep()
              if (checkLastStep) {
                console.log('True')
                this.$swal({
                  title: 'คุณต้องการ ปิดจบงาน เลยหรือไม่?',
                  type: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#b3b1ab',
                  confirmButtonText: 'ปิดจบงาน',
                  cancelButtonText: 'ยังไม่ปิดงาน'
                })
                  .then(async result => {
                    this.closeJobStart(item, 'notAlert')
                  })
                  .catch(error => {
                    console.log('error function editDataGlobal : ', error)
                  })
              } else {
                console.log('False')
                this.$swal('เรียบร้อย', 'แก้ไขสถานะ เรียบร้อย', 'success')
              }
            })
            // eslint-disable-next-line handle-callback-err
            .catch(error => {
              console.log('error function editDataGlobal : ', error)
            })
        })
        .catch(error => {
          this.selectStep = ''
          console.log('error function editDataGlobal : ', error)
        })
    },
    checkLastStep (stepId, items) {
      let step = this.itemStep.filter((item) =>
        parseInt(item.flowId) === items.flowId)
      let Index = step.findIndex((item) => parseInt(item.value) === stepId)
      if ((Index + 1) === step.length) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style scoped>
.fixed_scroll {
  margin-top: 0px;
  margin-bottom: 0px;
}
.a {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
}
.font12 {
  font-size: 12px;
}
.font13 {
  font-size: 13px;
}
.font14 {
  font-size: 14px;
}
.font16 {
  font-size: 16px;
}
.headline1 {
  color: var(--color_headline1) !important;
  font-weight: bold;
}
.flex-container{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.v-list-item--active {
  background-color: #FFFFFF !important;
}
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  background-color: #FFFFFF !important;
}
.theme--light.v-list-item--active:before, .theme--light.v-list-item--active:hover:before, .theme--light.v-list-item:focus:before {
opacity: 0 !important;
}
.v-list-item--link:focus::before {
opacity: 0;
}
.v-application .mb-16 {
    margin-bottom: 100px!important;
}
</style>
