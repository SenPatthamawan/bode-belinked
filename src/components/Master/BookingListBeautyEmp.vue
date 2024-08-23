<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main transition="scroll-y-reverse-transition">
      <div class="new-background-color col-md-12 ml-sm-auto col-lg-12">
        <v-row class="no-gutters">
          <v-col cols="6" md="6" lg="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
          <v-col style="text-align: end;" v-if="resCol === 'xs'">
            <v-btn
              class="text-white mb-2"
              :color="showOnsite === 'ไม่แสดง' ? 'error' : 'teal'"
              style="border-radius: 20px !important;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
              @click="checkShowDataOnsite(showOnsite)"
            >
              <v-icon color="white" left>{{
                showOnsite === "ไม่แสดง" ? "mdi-eye-remove" : "mdi-eye-check"
              }}</v-icon>
              {{ showOnsite }} Onsite
              <!-- <template v-if="loadingRefresh">
                  <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                  </span>
                </template> -->
            </v-btn>
            <v-btn
              :disabled="loadingRefresh"
              color="warning"
              style="border-radius: 20px !important;margin-right: 0px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
              @click="
                getDataDefault(),
                  (searchOther = ''),
                  (showColorSearch = false),
                  (statusSearch = 'no')
              "
            >
              <v-icon color="white" left>mdi-refresh-circle</v-icon>
              รีเฟรชข้อมูล
              <template v-if="loadingRefresh">
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-col>
          <v-col
            cols="6"
            md="6"
            lg="6"
            class="v-margit_button text-right pr-0"
            style="background-color: #f2f7ff;"
            v-if="
              resCol === 'md' ||
                resCol === 'lg' ||
                resCol === 'xl' ||
                resCol === 'sm'
            "
          >
            <v-btn-toggle style="background-color: #f2f7ff;">
              <v-btn
                class="text-white"
                :loading="loadingRefresh"
                :disabled="loadingRefresh"
                :color="showOnsite === 'ไม่แสดง' ? 'error' : 'teal'"
                style="border-radius: 20px !important;margin-right: 10px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                @click="checkShowDataOnsite(showOnsite)"
              >
                <v-icon color="white" left>{{
                  showOnsite === "ไม่แสดง" ? "mdi-eye-remove" : "mdi-eye-check"
                }}</v-icon>
                {{ showOnsite }} Onsite
                <template v-if="loadingRefresh">
                  <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-btn
                :loading="loadingRefresh"
                :disabled="loadingRefresh"
                color="warning"
                style="border-radius: 20px !important;margin-right: 0px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                @click="
                  getDataDefault(),
                    (searchOther = ''),
                    (showColorSearch = false),
                    (statusSearch = 'no')
                "
              >
                <v-icon color="white" left>mdi-refresh-circle</v-icon>
                รีเฟรชข้อมูล
                <template v-if="loadingRefresh">
                  <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                  </span>
                </template>
              </v-btn>
              <!-- <v-btn
                color="teal"
                style="z-index:8;"
                id="v-step-0"
                dark
                depressed
                @click="(dialogExport = true), validate('EXPORT')"
              >
                <v-icon left>mdi-download</v-icon>
                Export Data
              </v-btn> -->
            </v-btn-toggle>
            <!-- </v-overlay> -->
          </v-col>
        </v-row>
        <v-row v-if="resCol === 'xs'" style="margin-bottom: 10px;">
          <v-col cols="12" class="text-left">
            <template v-if="changeBackgroundColor">
              <v-row class="test px-2">
                <v-row style="justify-content: space-around;">
                  <v-col
                    cols="6"
                    style="display: flex;justify-content: center;"
                  >
                    <v-card
                      style="padding: 10px; width: 230px;"
                      :color="getSelectText === 'wait' ? '#F9DBB2' : 'white'"
                      dense
                      elevation="0"
                      prominent
                      @click="
                        getSelect('wait', countWaiting, filterCloseJobValue)
                      "
                    >
                      <div>
                        <div class="text-center">
                          <v-avatar size="70" class="pa-3" color="#FEAE34">
                            <v-icon
                              dark
                              size="30"
                              class="iconify"
                              data-icon="ps:warning"
                            >
                              mdi-alarm
                            </v-icon>
                          </v-avatar>
                        </div>
                        <div style="margin: auto 0;text-align: center;">
                          <strong>{{ dataTypeProcess1 }}</strong>
                          <div>จำนวน : {{ countWaiting }}</div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col
                    cols="6"
                    style="display: flex;justify-content: center;"
                  >
                    <v-card
                      style="padding: 10px; width: 230px;"
                      :color="getSelectText === 'confirm' ? '#C9F2DC' : 'white'"
                      dense
                      icon="mdi-email-check"
                      prominent
                      elevation="0"
                      @click="
                        getSelect('confirm', countConfirm, filterCloseJobValue)
                      "
                    >
                      <div>
                        <div class="text-center">
                          <v-avatar
                            size="70"
                            color="#97DDBB"
                            style="padding:13px"
                          >
                            <v-icon
                              dark
                              size="40"
                              class="iconify"
                              data-icon="quill:mail-subbed"
                            >
                              mdi-alarm
                            </v-icon>
                          </v-avatar>
                        </div>
                        <div style="margin: auto 0;text-align: center;">
                          <strong>{{ dataTypeProcess2 }}</strong>
                          <div>จำนวน : {{ countConfirm }}</div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col
                    cols="6"
                    style="display: flex;justify-content: center;"
                  >
                    <v-card
                      style="padding: 10px; width: 230px;"
                      :color="
                        getSelectText === 'confirmJob' ? '#F9E8F5' : 'white'
                      "
                      dense
                      icon="mdi-account-check"
                      prominent
                      elevation="0"
                      @click="
                        getSelect('confirmJob', countJob, filterCloseJobValue)
                      "
                    >
                      <div>
                        <div class="text-center">
                          <v-avatar color="#E5B5D8" size="70" class="pa-3">
                            <v-icon
                              dark
                              size="40"
                              class="iconify"
                              data-icon="bi:people"
                            >
                              mdi-alarm
                            </v-icon>
                          </v-avatar>
                        </div>
                        <div style="margin: auto 0;text-align: center;">
                          <strong>{{ dataTypeProcess4 }}</strong>
                          <div style="text-align: center;">
                            จำนวน : {{ countJob }}
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col
                    cols="6"
                    style="display: flex;justify-content: center;"
                  >
                    <v-card
                      style="padding: 10px; width: 230px;"
                      :color="
                        getSelectText === 'confirmSum' ? '#D7E8F9' : 'white'
                      "
                      dense
                      elevation="0"
                      icon="mdi-expand-all"
                      @click="
                        getSelect('confirmSum', countConfirm + countJob),
                          filterCloseJobValue
                      "
                    >
                      <div
                        style="display: flex;justify-content: space-around;flex-wrap: wrap;"
                      >
                        <div class="text-center">
                          <v-avatar color="#76ABE5" size="70" class="pa-3">
                            <v-icon
                              dark
                              size="40"
                              class="iconify"
                              data-icon="bi:folder-plus"
                            >
                            </v-icon>
                          </v-avatar>
                        </div>
                        <div style="margin: auto 0;text-align: center;">
                          <strong>รวมผู้เข้ารับบริการ</strong>
                          <div style="text-align: center;">
                            รวม : {{ countConfirm + countJob }}
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col
                    cols="6"
                    style="display: flex;justify-content: center;"
                  >
                    <v-card
                      style="padding: 10px; width: 230px;"
                      :color="getSelectText === 'cancel' ? '#F9CACA' : 'white'"
                      dense
                      elevation="0"
                      icon="mdi-calendar-remove"
                      prominent
                      @click="
                        getSelect('cancel', countCancel, filterCloseJobValue)
                      "
                    >
                      <div>
                        <div class="text-center">
                          <v-avatar size="70" class="pa-3" color="#B72929">
                            <v-icon
                              dark
                              size="40"
                              class="iconify"
                              data-icon="carbon:rule-cancelled"
                            >
                              mdi-alarm
                            </v-icon>
                          </v-avatar>
                        </div>
                        <div style="margin: auto 0;text-align: center;">
                          <strong>{{ dataTypeProcess3 }}</strong>
                          <div>จำนวน : {{ countCancel }}</div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-row>
            </template>
          </v-col>
        </v-row>
        <v-row style="margin-bottom: 29px;" v-if="resCol !== 'xs'">
          <v-col cols="12" class="text-left">
            <template v-if="changeBackgroundColor">
              <v-row style="justify-content: space-around;">
                <v-col
                  :cols="resCol === 'md' ? '2' : 'auto'"
                  style="display: flex;justify-content: center;"
                >
                  <v-card
                    :style="
                      resCol === 'sm'
                        ? 'padding: 10px; width: 130px;'
                        : 'padding: 10px; width: 230px;'
                    "
                    :color="getSelectText === 'wait' ? '#F9DBB2' : 'white'"
                    dense
                    elevation="0"
                    prominent
                    @click="
                      getSelect('wait', countWaiting, filterCloseJobValue)
                    "
                  >
                    <div
                      :style="
                        resCol === 'lg'
                          ? 'display: flex;justify-content: space-around;flex-wrap: wrap;'
                          : resCol === 'md'
                          ? ''
                          : ''
                      "
                    >
                      <div class="text-center">
                        <v-avatar size="70" class="pa-3" color="#FEAE34">
                          <v-icon
                            dark
                            size="30"
                            class="iconify"
                            data-icon="ps:warning"
                          >
                            mdi-alarm
                          </v-icon>
                        </v-avatar>
                      </div>
                      <div
                        :style="
                          resCol === 'md'
                            ? 'text-align: center;'
                            : resCol === 'sm'
                            ? 'text-align: center;'
                            : 'margin: auto 0;'
                        "
                      >
                        <strong>{{ dataTypeProcess1 }}</strong>
                        <div>จำนวน : {{ countWaiting }}</div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col
                  :cols="resCol === 'md' ? '2' : 'auto'"
                  style="display: flex;justify-content: center;"
                >
                  <v-card
                    :style="
                      resCol === 'sm'
                        ? 'padding: 10px; width: 130px;'
                        : 'padding: 10px; width: 230px;'
                    "
                    :color="getSelectText === 'confirm' ? '#C9F2DC' : 'white'"
                    dense
                    icon="mdi-email-check"
                    prominent
                    elevation="0"
                    @click="
                      getSelect('confirm', countConfirm, filterCloseJobValue)
                    "
                  >
                    <div
                      :style="
                        resCol === 'lg'
                          ? 'display: flex;justify-content: space-around;flex-wrap: wrap;'
                          : resCol === 'md'
                          ? ''
                          : ''
                      "
                    >
                      <div class="text-center">
                        <v-avatar
                          size="70"
                          color="#97DDBB"
                          style="padding:13px"
                        >
                          <v-icon
                            dark
                            size="40"
                            class="iconify"
                            data-icon="quill:mail-subbed"
                          >
                            mdi-alarm
                          </v-icon>
                        </v-avatar>
                      </div>
                      <div
                        :style="
                          resCol === 'md'
                            ? 'text-align: center;'
                            : resCol === 'sm'
                            ? 'text-align: center;'
                            : 'margin: auto 0;'
                        "
                      >
                        <strong>{{ dataTypeProcess2 }}</strong>
                        <div>จำนวน : {{ countConfirm }}</div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col
                  :cols="resCol === 'md' ? '2' : 'auto'"
                  style="display: flex;justify-content: center;"
                >
                  <v-card
                    :style="
                      resCol === 'sm'
                        ? 'padding: 10px; width: 130px;'
                        : 'padding: 10px; width: 230px;'
                    "
                    :color="
                      getSelectText === 'confirmJob' ? '#F9E8F5' : 'white'
                    "
                    dense
                    icon="mdi-account-check"
                    prominent
                    elevation="0"
                    @click="
                      getSelect('confirmJob', countJob, filterCloseJobValue)
                    "
                  >
                    <div
                      :style="
                        resCol === 'lg'
                          ? 'display: flex;justify-content: space-around;flex-wrap: wrap;'
                          : resCol === 'md'
                          ? ''
                          : ''
                      "
                    >
                      <div class="text-center">
                        <v-avatar color="#E5B5D8" size="70" class="pa-3">
                          <v-icon
                            dark
                            size="40"
                            class="iconify"
                            data-icon="bi:people"
                          >
                            mdi-alarm
                          </v-icon>
                        </v-avatar>
                      </div>
                      <div
                        :style="
                          resCol === 'md'
                            ? 'text-align: center;'
                            : resCol === 'sm'
                            ? 'text-align: center;'
                            : 'margin: auto 0;'
                        "
                      >
                        <strong>{{ dataTypeProcess4 }}</strong>
                        <div
                          :style="
                            resCol === 'md'
                              ? 'text-align: center;'
                              : 'text-align: center;left'
                          "
                        >
                          จำนวน : {{ countJob }}
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col
                  :cols="resCol === 'md' ? '2' : 'auto'"
                  style="display: flex;justify-content: center;"
                >
                  <v-card
                    :style="
                      resCol === 'sm'
                        ? 'padding: 10px; width: 130px;'
                        : 'padding: 10px; width: 230px;'
                    "
                    :color="
                      getSelectText === 'confirmSum' ? '#D7E8F9' : 'white'
                    "
                    dense
                    elevation="0"
                    icon="mdi-expand-all"
                    @click="
                      getSelect(
                        'confirmSum',
                        countConfirm + countJob,
                        filterCloseJobValue
                      )
                    "
                  >
                    <div
                      :style="
                        resCol === 'lg'
                          ? 'display: flex;justify-content: space-around;flex-wrap: wrap;'
                          : resCol === 'md'
                          ? ''
                          : ''
                      "
                    >
                      <div class="text-center">
                        <v-avatar color="#76ABE5" size="70" class="pa-3">
                          <v-icon
                            dark
                            size="40"
                            class="iconify"
                            data-icon="bi:folder-plus"
                          >
                          </v-icon>
                        </v-avatar>
                      </div>
                      <div
                        :style="
                          resCol === 'md'
                            ? 'text-align: center;'
                            : resCol === 'sm'
                            ? 'text-align: center;'
                            : 'margin: auto 0;'
                        "
                      >
                        <strong>รวมผู้เข้ารับบริการ</strong>
                        <div
                          :style="
                            resCol === 'md'
                              ? 'text-align: center;'
                              : 'text-align: center;left'
                          "
                        >
                          รวม : {{ countConfirm + countJob }}
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col
                  :cols="resCol === 'md' ? '2' : 'auto'"
                  style="display: flex;justify-content: center;"
                >
                  <v-card
                    :style="
                      resCol === 'sm'
                        ? 'padding: 10px; width: 130px;'
                        : 'padding: 10px; width: 230px;'
                    "
                    :color="getSelectText === 'cancel' ? '#F9CACA' : 'white'"
                    dense
                    elevation="0"
                    icon="mdi-calendar-remove"
                    prominent
                    @click="
                      getSelect('cancel', countCancel, filterCloseJobValue)
                    "
                  >
                    <div
                      :style="
                        resCol === 'lg'
                          ? 'display: flex;justify-content: space-around;flex-wrap: wrap;'
                          : resCol === 'md'
                          ? ''
                          : ''
                      "
                    >
                      <div class="text-center">
                        <v-avatar size="70" class="pa-3" color="#B72929">
                          <v-icon
                            dark
                            size="40"
                            class="iconify"
                            data-icon="carbon:rule-cancelled"
                          >
                            mdi-alarm
                          </v-icon>
                        </v-avatar>
                      </div>
                      <div
                        :style="
                          resCol === 'md'
                            ? 'text-align: center;'
                            : resCol === 'sm'
                            ? 'text-align: center;'
                            : 'margin: auto 0;'
                        "
                      >
                        <strong>{{ dataTypeProcess3 }}</strong>
                        <div>จำนวน : {{ countCancel }}</div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-col>
        </v-row>
        <v-divider v-if="resCol === 'xs'"></v-divider>
        <div class="pa-2 mb-4" v-if="resCol === 'xs'">
          <div style="text-align: end;margin-bottom: 10px;">
            <v-btn
              class="bottomAdd"
              style="margin-right: 0px;border-radius: 15px;color: white;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
              @click="addDataSet()"
            >
              เพิ่มรายการนัดหมาย
              <v-icon color="white" class="ml-4">mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <div>
            <v-menu
              ref="menu"
              v-model="menuStart"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  hide-details
                  background-color="white"
                  v-model="dateStart"
                  style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                  label="เดือน/ปี"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                >
                  <template #prepend-inner>
                    <v-icon
                      color="#69D1FD"
                      style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                    >
                      mdi-calendar
                    </v-icon>
                  </template></v-text-field
                >
              </template>
              <v-date-picker
                @input="
                  (menuStart = false), (dataReady = false), getBookingList()
                "
                v-model="dateStart"
                type="month"
                no-title
                scrollable
              >
              </v-date-picker>
            </v-menu>
            <v-select
              v-model="masBranchID"
              background-color="white"
              style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
              hide-details
              :items="branch"
              label="สาขา"
              outlined
              dense
              required
              :disabled="statusBranchReadonly"
              @change="(dataReady = false), (flowSelect = ''), getBookingList()"
              ><template #prepend-inner>
                <v-icon
                  color="#69D1FD"
                  style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                >
                  mdi-map-marker-outline
                </v-icon>
              </template></v-select
            >
            <v-select
              style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
              v-model="flowSelect"
              hide-details
              background-color="white"
              :items="DataFlowName"
              label="ประเภทบริการ"
              outlined
              dense
              @change="(dataReady = false), getBookingList()"
            >
              <template #prepend-inner>
                <v-icon
                  color="#69D1FD"
                  style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                >
                  mdi-note-text-outline
                </v-icon>
              </template></v-select
            >
            <v-text-field
              class="textserch"
              background-color="white"
              style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
              label="ค้นหาชื่อ และ เบอร์โทรศัพท์ ในตาราง"
              v-model="searchAll2"
              outlined
              hide-details
              dense
              ><template #prepend-inner>
                <v-icon style="margin-top: 0px;">
                  mdi-magnify
                </v-icon>
              </template>
            </v-text-field>
            <v-text-field
              class="textserch"
              background-color="white"
              style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
              :label="
                $session.getAll().data.category === 'ธุรกิจรถยนต์' ||
                $session.getAll().data.category === '7'
                  ? 'ค้นหาชื่อทั้งหมด หรือ ทะเบียน'
                  : 'ค้นหาชื่อทั้งหมด'
              "
              v-model="searchOther"
              outlined
              hide-details
              dense
              append-icon="mdi-card-search-outline"
              @click:append="searchAny()"
            >
            </v-text-field>
          </div>
        </div>
        <v-divider v-if="resCol !== 'xs'"></v-divider>
        <div class="pl-5 pb-5 pr-5 pt-0 mb-4" v-if="resCol !== 'xs'">
          <v-row
            style="display: flex;justify-content: space-between;margin-bottom:15px;margin-top:2px;"
          >
            <v-col cols="auto" class="pl-0">
              <h3 style="margin-bottom: 15px;color: black;font-weight: bolder;">
                ตรวจสอบรายการนัดหมาย
              </h3>
            </v-col>
            <v-col cols="auto" style="text-align: end;" class="px-0 pb-0">
              <v-btn
                class="bottomAdd"
                style="margin-right: 0px;border-radius: 15px;color: white;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                width="250px"
                x-large
                @click="addDataSet()"
              >
                เพิ่มรายการนัดหมาย
                <v-icon color="white" class="ml-4">mdi-plus-circle</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="resCol === 'sm' ? '3' : '2'" class="pl-0">
              <v-menu
                ref="menu"
                v-model="menuStart"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    hide-details
                    background-color="white"
                    v-model="dateStart"
                    style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;"
                    label="เดือน/ปี"
                    readonly
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                  >
                    <template #prepend-inner>
                      <v-icon
                        color="#69D1FD"
                        style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                      >
                        mdi-calendar
                      </v-icon>
                    </template></v-text-field
                  >
                </template>
                <v-date-picker
                  @input="
                    (menuStart = false), (dataReady = false), getBookingList()
                  "
                  v-model="dateStart"
                  type="month"
                  no-title
                  scrollable
                >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col :cols="resCol === 'sm' ? '3' : '2'" class="pl-0">
              <v-select
                v-model="masBranchID"
                background-color="white"
                style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;"
                hide-details
                :items="branch"
                label="สาขา"
                outlined
                dense
                required
                :disabled="statusBranchReadonly"
                @change="
                  (dataReady = false), (flowSelect = ''), getBookingList()
                "
                ><template #prepend-inner>
                  <v-icon
                    color="#69D1FD"
                    style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                  >
                    mdi-map-marker-outline
                  </v-icon>
                </template></v-select
              >
            </v-col>
            <v-col :cols="resCol === 'sm' ? '3' : '2'" class="pl-0">
              <v-select
                style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;"
                v-model="flowSelect"
                hide-details
                background-color="white"
                :items="DataFlowName"
                label="ประเภทบริการ"
                outlined
                dense
                @change="(dataReady = false), getBookingList()"
              >
                <template #prepend-inner>
                  <v-icon
                    color="#69D1FD"
                    style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                  >
                    mdi-note-text-outline
                  </v-icon>
                </template></v-select
              >
            </v-col>
            <v-col v-if="resCol !== 'sm'" cols="2"></v-col>
            <v-col :cols="resCol === 'sm' ? '3' : '4'" class="pr-0 pl-0 pt-3">
              <v-text-field
                class="textserch"
                background-color="white"
                style="border-radius: 40px !important;"
                label="ค้นหาชื่อ และ เบอร์โทรศัพท์ ในตาราง"
                v-model="searchAll2"
                outlined
                hide-details
                dense
                ><template #prepend-inner>
                  <v-icon style="margin-top: 0px;">
                    mdi-magnify
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <!-- {{tagItemSelect}}
            <v-col cols="auto" class="pr-0 pl-1 pt-3">
          <v-chip-group v-model="tagItemSelect" column multiple>
    <v-chip v-for="(tag, index) in tagItem" :key="index" :value="tag.text"
      :items="items"
      label="Select Item"
      multiple>
      {{ tag.text }}
    </v-chip>
  </v-chip-group>
</v-col> -->
          <v-row justify="end">
            <v-col :cols="resCol === 'sm' ? '3' : '4'" class="pr-0 pl-0 pt-3">
              <v-text-field
                class="textserch"
                background-color="white"
                style="border-radius: 40px !important;"
                :label="
                  $session.getAll().data.category === 'ธุรกิจรถยนต์' ||
                  $session.getAll().data.category === '7'
                    ? 'ค้นหาชื่อทั้งหมด หรือ ทะเบียน'
                    : 'ค้นหาชื่อทั้งหมด'
                "
                v-model="searchOther"
                outlined
                hide-details
                dense
                prepend-inner-icon="mdi-magnify"
              >
              </v-text-field>
            </v-col>
            <v-col cols="auto" class="pr-0 pl-1 pt-3">
              <v-btn rounded color="primary" dark @click="searchAny()">
                ค้นหา
              </v-btn>
            </v-col>
            <v-col
              cols="auto"
              class="pr-0 pl-1 pt-3"
              v-if="searchOther.length > 1"
            >
              <v-btn
                rounded
                color="error"
                dark
                @click="
                  getDataDefault(),
                    (searchOther = ''),
                    (showColorSearch = false),
                    (statusSearch = 'no')
                "
              >
                clear
              </v-btn>
            </v-col>
          </v-row>
          <v-row> </v-row>
        </div>
        <v-row>
          <!-- EXPORT -->
          <v-dialog v-model="dialogExport" persistent max-width="70%">
            <v-card class="text-center">
              <v-form ref="form_export" v-model="validExport" lazy-validation>
                <v-card-text>
                  <v-container>
                    <v-col class="text-right pa-0">
                      <v-btn
                        small
                        color="#E0E0E0"
                        @click="dialogExport = false"
                      >
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                    <v-row justify="center">
                      <v-col
                        cols="5"
                        class="text-center"
                        style="margin: auto 0;"
                      >
                        <v-col class="text-center">
                          <v-img
                            class="v-margit_img_reward"
                            :src="require('@/assets/ExportExcel.svg')"
                            max-width="470.37"
                            max-height="247"
                          ></v-img>
                        </v-col>
                      </v-col>

                      <v-col cols="6" class="v-margit_text_add mt-0 pa-0">
                        <v-col class="text-center pa-3 ml-2">
                          <v-img
                            class="v_text_add"
                            :src="require('@/assets/Grouptitle.svg')"
                          ></v-img>
                        </v-col>
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="6">
                              <p>เลือกสาขา</p>
                              <v-select
                                v-model="masBranchIDExport"
                                :items="branch"
                                label=""
                                outlined
                                :rules="[rules.required]"
                              ></v-select>
                            </v-col>
                            <v-col cols="6">
                              <p>เลือกวันที่</p>
                              <date-range-picker
                                opens="left"
                                :append-to-body="appendBody"
                                ref="picker"
                                :locale-data="localeData"
                                v-model="dateRange"
                                :rules="[rules.required]"
                                @update="updateValuesExport()"
                              >
                                <template #ranges="ranges">
                                  <div class="ranges">
                                    <ul>
                                      <li
                                        v-for="(range, name) in ranges.ranges"
                                        :key="name"
                                        @click="ranges.clickRange(range)"
                                      >
                                        <b v-if="name === 'Today'">วันนี้</b>
                                        <b v-if="name === 'Yesterday'"
                                          >เมื่อวาน</b
                                        >
                                        <b v-if="name === 'This month'"
                                          >เดือนนี้</b
                                        >
                                        <b v-if="name === 'This year'"
                                          >ปีนี้ทั้งปี</b
                                        >
                                        <b v-if="name === 'Last month'"
                                          >เดือนที่แล้ว</b
                                        >
                                      </li>
                                    </ul>
                                  </div>
                                </template>
                              </date-range-picker>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-col>
                    </v-row>
                    <div class="text-center" v-if="export_data.length > 0">
                      <v-btn color="yellow-light" @click="dialogExport = false">
                        <v-icon left>mdi-download</v-icon>
                        <download-excel
                          class="btn btn-default"
                          :data="export_data"
                          :fields="export_fields"
                          :type="exportType"
                          :worksheet="exportWorksheet"
                          :name="exportFileName"
                        >
                          Export Data
                        </download-excel>
                      </v-btn>
                    </div>
                  </v-container>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- end add -->
          <!-- ADD -->
          <v-dialog v-model="dialogAdd" max-width="100%" persistent>
            <!-- <v-dialog v-model="dialogAdd" persistent max-width="70%"> -->
            <v-card class="text-center">
              <v-form ref="form_add" v-model="validAdd" lazy-validation>
                <v-card-text>
                  <!-- <v-col class="text-right pa-0">
                      <v-btn
                        small
                        color="#E0E0E0"
                        @click="(dialogAdd = false), clearDataAdd()"
                      >
                        <v-icon color="#173053">mdi-close</v-icon>
                      </v-btn>
                    </v-col> -->
                  <v-row justify="center">
                    <v-col
                      v-if="ColsDialogAdd === 'True'"
                      :cols="ColsDialogAdd === 'True' ? 8 : 8"
                    >
                      <v-col class="text-center">
                        <CalendarBooking
                          ref="CalendarBooking"
                        ></CalendarBooking>
                      </v-col>
                    </v-col>

                    <v-col :cols="ColsDialogAdd === 'True' ? 4 : 10">
                      <!-- <v-col cols="12" sm="6" md="6" lg="6" class="v-margit_text_add mt-0 pa-0"> -->
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
                      <!-- <v-col class="text-center pa-3 ml-2">
                          <v-img
                            class="v_text_add"
                            :src="require('@/assets/Grouptitle.svg')"
                          ></v-img>
                        </v-col> -->
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
                          @click="date = ''"
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
                              getDataCalendaBookingAdd(),
                              setFlowByBranchAdd()
                          "
                        ></v-select>
                        <v-select
                          v-if="
                            formAdd.masBranchID !== '' &&
                              formAdd.masBranchID !== null
                          "
                          v-model="formAdd.flowId"
                          :items="dataFlowSelectAdd"
                          label="ประเภทบริการ"
                          outlined
                          dense
                          required
                          @change="
                            (priceMenuAdd = 0),
                              (drawerAdd = false),
                              getDataCalendaBookingAdd(),
                              setFlowAdd(),
                              checkTime(),
                              setEmpAdd(),
                              (date = '')
                          "
                          :rules="[rules.required]"
                        ></v-select>
                        <v-select
                          v-if="
                            formAdd.flowId !== '' && formAdd.flowId !== null
                          "
                          v-model="formAdd.bookingEmpFlow"
                          :items="dataEmpAdd"
                          label="พนักงานช่าง"
                          outlined
                          dense
                          required
                          :rules="[rules.required]"
                          @change="
                            SetallowedDates(),
                              (fromAddTimeCus = ''),
                              checkCustomerTimeSlot()
                          "
                        ></v-select>
                        <v-select
                          v-if="
                            customerTimeSlot === 'True' &&
                              formAdd.bookingEmpFlow !== '' &&
                              timeSlotbyCustomer.length > 1
                          "
                          v-model="fromAddTimeCus"
                          :items="timeSlotbyCustomer"
                          label="จำนวนชั่วโมง"
                          outlined
                          dense
                          required
                          :rules="[rules.required]"
                          @change="(date = ''), AddallowedDatesBysetTimebyday()"
                        ></v-select>
                        <template v-if="fieldNameItem">
                          <div
                            v-for="(item, index) in fieldNameItem"
                            :key="index"
                          >
                            <template
                              v-if="
                                item.conditionField === '' ||
                                  item.conditionField === null
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
                              </v-col>
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
                                      v-for="radios in JSON.parse(
                                        item.optionField
                                      )"
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
                                      row.fieldId ===
                                      parseInt(item.conditionField)
                                    );
                                  }).length > 0
                              "
                            >
                              <template
                                v-if="
                                  item.conditionValue ===
                                    fieldNameItem.filter(row => {
                                      return (
                                        row.fieldId ===
                                        parseInt(item.conditionField)
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
                                        v-for="radios in JSON.parse(
                                          item.optionField
                                        )"
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
                                        v-for="radios in JSON.parse(
                                          item.optionField
                                        )"
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
                          <v-col
                            class="pb-0 pt-0"
                            v-if="
                              customerTimeSlot === 'False'
                                ? formAdd.bookingEmpFlow
                                : fromAddTimeCus
                            "
                          >
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
                                @change="setLimitBooking(date)"
                                @input="
                                  (menuDate = false), $refs.menu.save(date)
                                "
                                :min="currentDate"
                              >
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col
                            class="pb-0 pt-0"
                            v-if="
                              customerTimeSlot === 'False'
                                ? timeavailable.length > 0 && date !== ''
                                : fromAddTimeCus !== '' && date !== ''
                            "
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
                            <v-expansion-panels
                              multiple
                              v-model="expansionMenuAdd"
                            >
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
                                              {{
                                                formatNumber(item.price)
                                              }}</v-col
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
                                            >{{
                                              formatNumber(priceMenuAdd)
                                            }}</v-col
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
                        <v-row>
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
                            ></v-select>
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
          <!-- end add -->

          <!-- delete -->
          <v-dialog v-model="dialogDelete" persistent max-width="400px">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6" class="text-left pt-10">
                      <h3><strong>ลบข้อมูลนี้</strong></h3>
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
                          @click="dialogDelete = false"
                        >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="รหัส Booking No"
                        v-model="formUpdate.bookNo"
                        readonly
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pt-0">
                      <v-btn
                        elevation="2"
                        large
                        block
                        dark
                        color="#173053"
                        @click="deleteData()"
                      >
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        ลบ
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- end delete -->

          <!-- edit -->
          <v-dialog v-model="dialogEdit" persistent :max-width="dialogwidth">
            <v-card class="text-center">
              <v-card-text>
                <v-row>
                  <v-col cols="6" class="text-left pt-10">
                    <h3><strong>นำเข้ากระดานการทำงาน</strong></h3>
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
                        @click="
                          (dialogEdit = false),
                            getDataDefault(),
                            (searchOther = ''),
                            (showColorSearch = false),
                            (statusSearch = 'no')
                        "
                      >
                        X
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text v-if="dataEditJobReady && statusConfirmJob">
                <v-container>
                  <v-col
                    class="pb-0 pt-0"
                    cols="12"
                    v-if="
                      dataPackage.filter(el => {
                        return el.balanceAmount > 0;
                      }).length > 0 && dataPackageDefault === false
                    "
                  >
                    <v-card class="pl-1">
                      <v-subheader
                        >ลูกค้ามี
                        {{
                          dataPackage.filter(el => {
                            return el.balanceAmount > 0;
                          }).length
                        }}
                        แพ็คเกจ</v-subheader
                      >
                      <v-subheader v-show="StatusPackage.packageName"
                        >ลูกค้าได้ทำการเลือกแพ็คเกจ
                        {{ StatusPackage.packageName }}</v-subheader
                      >
                      <v-slide-group
                        v-model="modelPackageIndexConfirmJob"
                        center-active
                        show-arrows
                      >
                        <v-slide-item
                          v-for="(item, index) in dataPackage.filter(el => {
                            return el.balanceAmount > 0;
                          })"
                          :key="index"
                        >
                          <v-card
                            class="ma-2 p-1"
                            width="340"
                            height="100"
                            color="#FFFFFF"
                            elevation="6"
                            :style="
                              item.packageId === packageId &&
                              item.token === tokenPackage
                                ? 'border: 1px solid green;'
                                : 'border: 1px solid white;'
                            "
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
                              <v-col cols="8" class="pb-6">
                                <v-row class="font16 headline1">
                                  <v-col class="pl-0 pt-2 pb-0">{{
                                    item.packageName
                                  }}</v-col>
                                  <v-btn
                                    class="mr-4 mt-3"
                                    v-if="
                                      item.packageId !== packageId &&
                                        item.token !== tokenPackage
                                    "
                                    color="green"
                                    outlined
                                    rounded
                                    x-small
                                    @click="
                                      UpdatePackage(
                                        item.packageId,
                                        'ตกลง',
                                        item.packageName,
                                        item,
                                        item.token
                                      ),
                                        (jobCheckPackage = true)
                                    "
                                    >ตกลง</v-btn
                                  >
                                  <v-btn
                                    class="mr-4 mt-3"
                                    v-if="
                                      item.packageId === packageId &&
                                        item.token !== tokenPackage
                                    "
                                    color="green"
                                    outlined
                                    rounded
                                    x-small
                                    @click="
                                      UpdatePackage(
                                        item.packageId,
                                        'ตกลง',
                                        item.packageName,
                                        item,
                                        item.token
                                      ),
                                        (jobCheckPackage = true)
                                    "
                                    >ตกลง</v-btn
                                  >
                                  <v-btn
                                    class="mr-4 mt-3"
                                    v-if="
                                      item.packageId === packageId &&
                                        item.token === tokenPackage
                                    "
                                    color="red"
                                    outlined
                                    rounded
                                    x-small
                                    @click="
                                      UpdatePackage(
                                        item.packageId,
                                        'ยกเลิก',
                                        item.packageName,
                                        item,
                                        item.token
                                      ),
                                        (jobCheckPackage = false)
                                    "
                                    >ยกเลิก</v-btn
                                  >
                                </v-row>
                                <v-row class="font14 headline1">
                                  <v-col class="pl-0 pt-0 pb-0"
                                    >จำนวนการใช้ {{ item.balanceAmount }} /
                                    {{ item.amount }}
                                  </v-col>
                                </v-row>
                                <v-row class="font14 headline1">
                                  <v-col class="pl-0 pt-0 pb-0">
                                    <VueCustomTooltip
                                      label="สามารถใช้ได้"
                                      position="is-top"
                                      v-if="dateTimestamp <= item.expirePackage"
                                    >
                                      <v-icon large color="teal darken-2">
                                        mdi-clock-check
                                      </v-icon>
                                    </VueCustomTooltip>
                                    <VueCustomTooltip
                                      label="หมดอายุแล้ว"
                                      position="is-top"
                                      v-if="dateTimestamp > item.expirePackage"
                                    >
                                      <v-icon large color="red darken-2">
                                        mdi-clock-alert
                                      </v-icon>
                                    </VueCustomTooltip>
                                    >> วันหมดอายุ
                                    {{
                                      new Date(item.expirePackage * 1000)
                                        .toLocaleString()
                                        .substr(0, 9)
                                    }}
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-slide-item>
                      </v-slide-group>
                    </v-card>
                    <br />
                  </v-col>
                  <v-col
                    class="pb-0 pt-0"
                    cols="12"
                    v-if="
                      dataPackage.filter(el => {
                        return el.balanceAmount > 0;
                      }).length > 0 && dataPackageDefault === true
                    "
                  >
                    <v-card class="pl-1">
                      <v-subheader
                        >ลูกค้ามี
                        {{
                          dataPackage.filter(el => {
                            return el.balanceAmount > 0;
                          }).length
                        }}
                        แพ็คเกจ</v-subheader
                      >
                      <v-subheader v-show="StatusPackage.packageName"
                        >ลูกค้าได้ทำการเลือกแพ็คเกจ
                        {{ StatusPackage.packageName }}</v-subheader
                      >
                      <v-slide-group
                        v-model="modelPackageIndexConfirmJob"
                        center-active
                        show-arrows
                      >
                        <v-slide-item
                          v-for="(item, index) in dataPackage.filter(el => {
                            return el.balanceAmount > 0;
                          })"
                          :key="index"
                        >
                          <v-card
                            class="ma-2 p-1"
                            width="340"
                            height="100"
                            color="#FFFFFF"
                            elevation="6"
                            :style="
                              item.packageId === packageId &&
                              item.token === tokenPackage
                                ? 'border: 1px solid green;'
                                : 'border: 1px solid white;'
                            "
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
                              <v-col cols="8" class="pb-6">
                                <v-row class="font16 headline1">
                                  <v-col class="pl-0 pt-2 pb-0">{{
                                    item.packageName
                                  }}</v-col>
                                  <!-- <v-btn class="mr-4 mt-3" v-if="item.packageId !== packageId" color="green" outlined rounded x-small @click="UpdatePackage(item.packageId,'ตกลง',item.packageName, item)">ตกลง</v-btn>
                                    <v-btn class="mr-4 mt-3" v-if="item.packageId === packageId" color="red" outlined rounded x-small @click="UpdatePackage(item.packageId,'ยกเลิก',item.packageName, item)">ยกเลิก</v-btn> -->
                                </v-row>
                                <v-row class="font14 headline1">
                                  <v-col class="pl-0 pt-0 pb-0"
                                    >จำนวนการใช้ {{ item.balanceAmount }} /
                                    {{ item.amount }}
                                  </v-col>
                                </v-row>
                                <v-row class="font14 headline1">
                                  <v-col class="pl-0 pt-0 pb-0">
                                    <VueCustomTooltip
                                      label="สามารถใช้ได้"
                                      position="is-top"
                                      v-if="dateTimestamp <= item.expirePackage"
                                    >
                                      <v-icon large color="teal darken-2">
                                        mdi-clock-check
                                      </v-icon>
                                    </VueCustomTooltip>
                                    <VueCustomTooltip
                                      label="หมดอายุแล้ว"
                                      position="is-top"
                                      v-if="dateTimestamp > item.expirePackage"
                                    >
                                      <v-icon large color="red darken-2">
                                        mdi-clock-alert
                                      </v-icon>
                                    </VueCustomTooltip>
                                    >> วันหมดอายุ
                                    {{
                                      new Date(item.expirePackage * 1000)
                                        .toLocaleString()
                                        .substr(0, 9)
                                    }}
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-slide-item>
                      </v-slide-group>
                    </v-card>
                    <br />
                  </v-col>
                  <v-col
                    v-for="(item, indexitem) in BookingDataItem"
                    :key="indexitem"
                    cols="12"
                    class="pa-0"
                  >
                    <v-text-field
                      :label="item.fieldName"
                      :value="item.fieldValue"
                      class="pa-0"
                      outlined
                      dense
                      readonly
                    ></v-text-field>
                    <!-- {{item.fieldName}} : {{item.fieldValue}} -->
                  </v-col>
                  <v-form
                    ref="form_update"
                    v-model="validUpdate"
                    lazy-validation
                  >
                    <div v-for="(p, index) in flowfieldNameitem" :key="index">
                      <div class="pa-0" v-if="p.conditionField === ''">
                        <div>
                          <div v-if="p.fieldType == 'text'">
                            <br />
                            <v-text-field
                              v-if="p.fieldName === 'เบอร์โทร'"
                              v-mask="'###-###-####'"
                              v-model="p.fieldValue"
                              :label="p.fieldName"
                              dense
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                            <v-text-field
                              v-else
                              v-model="p.fieldValue"
                              :label="p.fieldName"
                              dense
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                          </div>
                          <div v-if="p.fieldType == 'number'">
                            <br />
                            <!-- <p>{{p.fieldName}}</p> -->
                            <v-text-field
                              v-if="p.fieldName === 'เบอร์โทร'"
                              v-mask="'###-###-####'"
                              v-model="p.fieldValue"
                              :label="p.fieldName"
                              dense
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                            <v-text-field
                              v-else
                              v-model="p.fieldValue"
                              :label="p.fieldName"
                              dense
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                          </div>
                          <v-row>
                            <v-col
                              cols="12"
                              v-if="p.fieldType == 'Autocompletes'"
                              style="padding-top: 0px;padding-bottom: 0px;"
                            >
                              <br />
                              <v-autocomplete
                                v-model="p.fieldValue"
                                :items="JSON.parse(p.optionField)"
                                dense
                                filled
                                :label="p.fieldName"
                                :rules="
                                  p.requiredField === 'True'
                                    ? [rules.required]
                                    : [true]
                                "
                              ></v-autocomplete>
                            </v-col>
                            <v-col
                              cols="12"
                              v-if="p.fieldType == 'Selects'"
                              style="padding-top: 0px;padding-bottom: 0px;"
                            >
                              <br />
                              <div>
                                <v-select
                                  v-model="p.fieldValue"
                                  :items="JSON.parse(p.optionField)"
                                  menu-props="auto"
                                  :label="p.fieldName"
                                  hide-details
                                  outlined
                                  dense
                                  :rules="
                                    p.requiredField === 'True'
                                      ? [rules.required]
                                      : [true]
                                  "
                                ></v-select>
                              </div>
                            </v-col>
                          </v-row>
                          <div
                            v-if="p.fieldType == 'Radio'"
                            style="padding:0px;"
                          >
                            <br />
                            <v-container fluid style="padding:0px;">
                              <v-radio-group
                                row
                                v-model="p.fieldValue"
                                style="margin:0px;"
                                :rules="
                                  p.requiredField === 'True'
                                    ? [rules.required]
                                    : [true]
                                "
                              >
                                <template v-slot:label> </template>
                                <div
                                  v-for="radios in JSON.parse(p.optionField)"
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
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="
                          p.conditionField !== '' &&
                            flowfieldNameitem.filter(row => {
                              return row.fieldId === parseInt(p.conditionField);
                            }).length > 0
                        "
                      >
                        <div
                          v-if="
                            p.conditionValue ===
                              flowfieldNameitem.filter(row => {
                                return (
                                  row.fieldId === parseInt(p.conditionField)
                                );
                              })[0].fieldValue
                          "
                        >
                          <div cols="12" v-if="p.fieldType == 'Autocompletes'">
                            <v-autocomplete
                              v-model="p.fieldValue"
                              :items="JSON.parse(p.optionField)"
                              dense
                              filled
                              :label="p.fieldName"
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            ></v-autocomplete>
                          </div>
                          <div v-if="p.fieldType == 'Selects'">
                            <v-select
                              v-model="p.fieldValue"
                              :items="JSON.parse(p.optionField)"
                              menu-props="auto"
                              :label="p.fieldName"
                              dense
                              hide-details
                              outlined
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            ></v-select>
                          </div>
                          <div
                            v-if="p.fieldType === 'Radio'"
                            style="padding:0px;"
                          >
                            <br />
                            <v-container fluid style="padding:0px;">
                              <v-radio-group
                                row
                                v-model="p.fieldValue"
                                style="margin:0px;"
                                :rules="
                                  p.requiredField === 'True'
                                    ? [rules.required]
                                    : [true]
                                "
                              >
                                <template v-slot:label> </template>
                                <div
                                  v-for="radios in JSON.parse(p.optionField)"
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
                          </div>
                        </div>
                      </div>
                      <div v-if="p.conditionField === 'flow'">
                        <div
                          v-if="
                            parseInt(p.conditionValue) ===
                              parseInt(formAdd.flowId)
                          "
                        >
                          <div v-if="p.fieldType == 'text'">
                            <br />
                            <v-text-field
                              v-if="p.fieldName === 'เบอร์โทร'"
                              v-mask="'###-###-####'"
                              v-model="p.fieldValue"
                              :label="p.fieldName"
                              dense
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                            <v-text-field
                              v-else
                              v-model="p.fieldValue"
                              :label="p.fieldName"
                              dense
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                          </div>
                          <div v-if="p.fieldType == 'number'">
                            <br />
                            <v-text-field
                              v-if="p.fieldName === 'เบอร์โทร'"
                              v-mask="'###-###-####'"
                              v-model="p.fieldValue"
                              :label="p.fieldName"
                              dense
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                            <v-text-field
                              v-else
                              v-model="p.fieldValue"
                              :label="p.fieldName"
                              dense
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              outlined
                            ></v-text-field>
                          </div>
                          <div cols="12" v-if="p.fieldType == 'Autocompletes'">
                            <v-autocomplete
                              v-model="p.fieldValue"
                              :items="JSON.parse(p.optionField)"
                              dense
                              filled
                              :label="p.fieldName"
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            ></v-autocomplete>
                          </div>
                          <div v-if="p.fieldType == 'Selects'">
                            <v-select
                              v-model="p.fieldValue"
                              :items="JSON.parse(p.optionField)"
                              menu-props="auto"
                              :label="p.fieldName"
                              dense
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                              hide-details
                              outlined
                            ></v-select>
                          </div>
                          <div
                            v-if="p.fieldType === 'Radio'"
                            style="padding:0px;"
                          >
                            <br />
                            <v-container fluid style="padding:0px;">
                              <v-radio-group
                                row
                                v-model="p.fieldValue"
                                style="margin:0px;"
                                :rules="
                                  p.requiredField === 'True'
                                    ? [rules.required]
                                    : [true]
                                "
                              >
                                <template v-slot:label> </template>
                                <div
                                  v-for="radios in JSON.parse(p.optionField)"
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
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                        lg="6"
                        class="pb-0"
                        v-if="statusShowDateConfiremjob"
                      >
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
                              v-model="endDate"
                              label="วันที่คาดว่าจะเสร็จ"
                              persistent-hint
                              dense
                              outlined
                              required
                              :rules="[rules.required]"
                              prepend-icon="mdi-calendar"
                              v-bind="attrs"
                              v-on="on"
                              readonly
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="endDate"
                            no-title
                            @input="menu = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                        lg="6"
                        class="pb-0"
                        v-if="statusShowDateConfiremjob"
                      >
                        <!-- <v-select
                          v-model="endTime"
                          :items="timeavailable"
                          label="เวลา"
                          menu-props="auto"
                          outlined
                          dense
                          required
                          :rules ="[rules.required]"
                        ></v-select> -->
                        <v-select
                          v-model="endTime"
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
                      <v-col cols="12" sm="12" md="12" lg="12">
                        <v-select
                          v-if="
                            masBranchIDAddJob !== null &&
                              masBranchIDAddJob !== ''
                          "
                          v-model="empSelectJob"
                          :items="
                            empSelectStepAdd.filter(
                              i =>
                                i.masBranchID === masBranchIDAddJob ||
                                i.masBranchID === ''
                            )
                          "
                          label="พนักงานที่นำเข้ากระดานทำงาน"
                          menu-props="auto"
                          outlined
                          required
                          :rules="[rules.required]"
                          dense
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                  <div class="text-center">
                    <v-btn
                      elevation="2"
                      large
                      block
                      dark
                      color="#173053"
                      @click="addDataJob()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      นำเข้าตารางงาน
                    </v-btn>
                  </div>
                </v-container>
              </v-card-text>
              <v-card-text v-if="dataEditJobReady && !statusConfirmJob">
                <strong
                  ><h2>
                    เนื่องจากวันที่นัดหมาย {{ dueDate }} ไม่ตรงกับวันที่ปัจจุบัน
                  </h2></strong
                >
                <strong style="color: red;"
                  ><h3>
                    กรุณาตรวจสอบข้อมูล หรือ เปลี่ยนเวลานัดหมายใหม่
                  </h3></strong
                >
              </v-card-text>
              <v-card-text v-if="!dataEditJobReady">
                <v-container>
                  <div class="text-center">
                    <waitingAlert></waitingAlert>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- end -->

          <v-dialog v-model="dialogJob" persistent :max-width="dialogwidth">
            <v-card
              style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);"
            >
              <v-container>
                <v-row>
                  <v-col cols="12" v-if="checkShowSelectUser">
                    <div class=" text-center">
                      <v-tabs
                        v-model="tabSelectUser"
                        background-color="#1B437C"
                        centered
                        dark
                        icons-and-text
                      >
                        <v-tabs-slider></v-tabs-slider>
                        <v-tab>
                          ลูกค้าที่นัดหมาย
                          <v-icon>mdi-card-account-phone</v-icon>
                        </v-tab>

                        <v-tab>
                          แสกน QR / Skip
                          <v-icon>mdi-qrcode-edit</v-icon>
                        </v-tab>

                        <v-tab-item
                          style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);"
                        >
                          <br />
                          <v-row justify="center" class="spacer" no-gutters>
                            <v-col cols="4" sm="2" md="1">
                              <v-avatar size="60px">
                                <img
                                  alt="Avatar"
                                  :src="dataSelectUser.picture"
                                />
                              </v-avatar>
                            </v-col>
                            <v-col cols="6" sm="4" md="2"
                              >คุณ {{ dataSelectUser.name }}</v-col
                            >
                          </v-row>
                          <v-row justify="center" class="spacer" no-gutters>
                            <v-col col="12"
                              ><strong>ลูกค้าที่นัดหมาย</strong></v-col
                            >
                          </v-row>
                        </v-tab-item>
                        <v-tab-item
                          style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);"
                        >
                          <br />
                          <div
                            v-if="jobitem.length > 0 && userId === ''"
                            class="avatar text-center"
                          >
                            <qrcode-vue
                              :value="value"
                              :size="size"
                              level="H"
                              :foreground="foreground"
                            />
                          </div>
                        </v-tab-item>
                      </v-tabs>
                    </div>
                  </v-col>
                  <v-col cols="12" v-if="!checkShowSelectUser">
                    <div class=" text-center">
                      <br />
                      <br />
                      <h2 style="font-weight: 900; color:#FFA000">
                        ติดตามสถานะ!
                      </h2>
                      <qrcode-vue
                        v-if="userId === ''"
                        :value="value"
                        :size="size"
                        level="H"
                        :foreground="foreground"
                      />
                      <template v-if="jobitem.length > 0">
                        <div v-if="userId !== ''" class="avatar text-center">
                          <v-avatar
                            v-if="memberPicture !== ''"
                            size="120"
                            style="border:5px solid #FFFFFF;"
                          >
                            <img :src="memberPicture" />
                          </v-avatar>
                          <v-avatar
                            v-if="
                              memberPicture === '' &&
                                userId === 'user-skip' &&
                                jobitem[0].recordStatus === 'D'
                            "
                            size="120"
                            style="border:5px solid #FFFFFF;"
                          >
                            <v-img
                              class="v_text_add"
                              :src="require('@/assets/OtherP.svg')"
                            ></v-img>
                          </v-avatar>
                          <!-- <p class="text-center">{{profile.displayName}}</p> -->
                        </div>
                      </template>
                      <div v-if="jobitem.length > 0" class="avatar text-center">
                        <qrcode-vue
                          v-if="
                            userId === 'user-skip' &&
                              jobitem[0].recordStatus === 'N'
                          "
                          :value="value"
                          :size="size"
                          level="H"
                          :foreground="foreground"
                        />
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
              <v-row>
                <v-col cols="12">
                  <v-container class="text-center">
                    <v-container>
                      <div v-for="(p, index) in jobitem" :key="index">
                        <h4>{{ p.name }} : {{ p.value }}</h4>
                        <!-- <h4 v-if="p.showCard === 'True' ">{{p.name}} : {{p.value}}</h4> -->
                      </div>
                      <div v-if="jobitem.length > 0">
                        <v-btn
                          small
                          class="ma-2"
                          color="teal"
                          v-if="jobitem[0].recordStatus === 'D'"
                          @click="setBookingingAgain()"
                          dark
                        >
                          นัดหมายอีกครั้ง
                          <v-icon dark right>
                            mdi-notebook-check
                          </v-icon>
                        </v-btn>
                        <strong
                          style="color: red;"
                          v-if="jobitem[0].recordStatus === 'D'"
                          ><h2>รายการนี้ปิดไปแล้ว</h2></strong
                        >
                      </div>
                      <div>
                        <v-btn
                          small
                          class="ma-2"
                          color="success"
                          v-if="userId !== '' && recordStatusJob === 'N'"
                          @click="(dialogCloseJob = true), setCloseJob(jobitem)"
                          dark
                        >
                          ปิดงานนี้
                          <v-icon dark right>
                            mdi-cash-usd-outline
                          </v-icon>
                        </v-btn>
                      </div>
                    </v-container>
                    <template v-if="!checkShowSelectUser">
                      <v-btn
                        small
                        class="ma-2"
                        color="success"
                        v-if="userId === ''"
                        @click="pushMsgSelectUser"
                        dark
                      >
                        ส่ง QR Code
                        <v-icon dark right>
                          mdi-checkbox-marked-circle
                        </v-icon>
                      </v-btn>
                      <v-btn
                        small
                        class="ma-2"
                        color="primary"
                        v-if="userId === ''"
                        @click="jobConfirm"
                        dark
                      >
                        SKIP
                        <v-icon dark right>
                          mdi-checkbox-marked-circle
                        </v-icon>
                      </v-btn>
                      <v-btn
                        small
                        class="ma-2"
                        color="error"
                        @click="dialogJob = false"
                        dark
                      >
                        Close
                        <v-icon dark right>
                          mdi-minus-circle
                        </v-icon>
                      </v-btn>
                    </template>
                    <template v-if="checkShowSelectUser">
                      <v-btn
                        small
                        class="ma-2"
                        color="success"
                        v-if="userId === '' && tabSelectUser === 1"
                        @click="pushMsgSelectUser"
                        dark
                      >
                        ส่ง QR Code
                        <v-icon dark right>
                          mdi-checkbox-marked-circle
                        </v-icon>
                      </v-btn>
                      <v-btn
                        small
                        class="ma-2"
                        color="primary"
                        v-if="userId === '' && tabSelectUser === 1"
                        @click="jobConfirm"
                        dark
                      >
                        SKIP
                        <v-icon dark right>
                          mdi-checkbox-marked-circle
                        </v-icon>
                      </v-btn>
                      <v-btn
                        small
                        class="ma-2"
                        color="primary"
                        v-if="tabSelectUser === 0 || tabSelectUser === null"
                        @click="jobConfirmUser"
                        dark
                      >
                        ลูกค้าท่านเดียวกับที่นัดหมาย
                        <v-icon dark right>
                          mdi-checkbox-marked-circle
                        </v-icon>
                      </v-btn>
                      <v-btn
                        small
                        class="ma-2"
                        color="error"
                        @click="dialogJob = false"
                        dark
                      >
                        Close
                        <v-icon dark right>
                          mdi-minus-circle
                        </v-icon>
                      </v-btn>
                    </template>
                  </v-container>
                </v-col>
              </v-row>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogChange" persistent :max-width="dialogwidth">
            <v-card class="text-center">
              <v-form ref="form_change" v-model="validChange" lazy-validation>
                <v-card-text v-if="dataChangeReady">
                  <v-container>
                    <v-row>
                      <v-col cols="6" class="text-left pt-10">
                        <h3><strong>เปลี่ยนเวลานัดหมาย</strong></h3>
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
                            @click="
                              (dialogChange = false), (fromAddTimeCus = '')
                            "
                          >
                            X
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="remark"
                          outlined
                          v-if="checkSelectText === 'confirm'"
                          label="หมายเหตุเพิ่มเติม"
                          auto-grow
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6" lg="6">
                        <v-select
                          v-if="
                            customerTimeSlot === 'True' &&
                              bookingEmpFlow !== '' &&
                              timeSlotbyCustomer.length > 1
                          "
                          v-model="fromAddTimeCus"
                          :items="timeSlotbyCustomer"
                          label="จำนวนชั่วโมง"
                          outlined
                          dense
                          required
                          :rules="[rules.required]"
                          @change="
                            (formChange.date = ''),
                              AddallowedDatesBysetTimebydayChange()
                          "
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        cols="12"
                        md="6"
                        lg="6"
                        v-if="
                          customerTimeSlot === 'False'
                            ? formChange.date
                            : fromAddTimeCus
                        "
                      >
                        <v-menu
                          v-model="menuDateChange"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="formChange.date"
                              label="วันที่นัดหมาย"
                              prepend-icon="mdi-calendar"
                              readonly
                              outlined
                              dense
                              v-bind="attrs"
                              v-on="on"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="formChange.date"
                            :allowed-dates="allowedDatesChange"
                            @input="
                              (menuDateChange = false),
                                checkTimeFlow(formChange.date, dataChange)
                            "
                            :min="
                              new Date(
                                Date.now() -
                                  new Date().getTimezoneOffset() * 60000
                              )
                                .toISOString()
                                .substr(0, 10)
                            "
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                        lg="6"
                        v-if="
                          formChange.date !== '' && timeavailable.length > 0
                        "
                      >
                        <v-select
                          v-model="formChange.time"
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
                    <v-row>
                      <v-col v-if="checkSelectText !== 'cancel'">
                        <v-btn
                          elevation="2"
                          color="green darken-1"
                          dark
                          large
                          block
                          :disabled="!validChange"
                          @click="changeChk(dataChange, 'confirm')"
                          >เปลี่ยนวันเวลานัดหมาย (ยืนยัน)</v-btn
                        >
                      </v-col>
                      <v-col v-if="checkSelectText !== 'confirm'">
                        <v-btn
                          elevation="2"
                          color="#173053"
                          dark
                          large
                          block
                          :disabled="!validChange"
                          @click="changeChk(dataChange, 'change')"
                          >เปลี่ยนวันเวลานัดหมาย</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <div class="text-center" v-if="!dataChangeReady">
                  <waitingAlert></waitingAlert>
                </div>
                <br />
              </v-form>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogInfo" :max-width="dialogwidth">
            <v-card class="text-center">
              <v-card-title><b>รายละเอียดนัดหมาย</b></v-card-title>
              <v-card-text v-if="dataInfo">
                <v-row>
                  <v-col class="text-right">ประเภทบริการ</v-col>
                  <v-col class="text-left">{{ dataInfo.flowName }}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-right">วันที่ต้องการเข้ารับบริการ</v-col>
                  <v-col class="text-left">{{ dataInfo.dueDate }}</v-col>
                </v-row>
                <v-row
                  v-for="(row, index) in BookingDataItem"
                  v-bind:key="index"
                >
                  <v-col class="text-right">{{ row.fieldName }}</v-col>
                  <v-col class="text-left">{{ row.fieldValue }}</v-col> </v-row
                ><br />
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogRemove" :max-width="dialogwidth">
            <v-card class="text-center">
              <v-form ref="form_remove" v-model="validRemove" lazy-validation>
                <v-container>
                  <v-card-text v-if="dataCancelReady">
                    <v-row>
                      <v-col cols="6" class="text-left pt-10">
                        <h3><strong>ยกเลิกรายการนี้</strong></h3>
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
                            @click="
                              (dialogRemove = false), (sendRemarkRemove = false)
                            "
                          >
                            X
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-checkbox
                          v-model="sendRemarkRemove"
                          label="แจ้งเตือนหมายเหตุในการยกเลิก"
                        ></v-checkbox>
                        <v-textarea
                          v-model="remarkRemove"
                          outlined
                          label="หมายเหตุในการยกเลิก"
                          auto-grow
                          required
                          dense
                          :rules="[rules.required]"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" class="pt-0">
                        <v-select
                          v-model="empSelect"
                          :items="empSelectStep"
                          label="พนักงานที่รับนัดหมาย"
                          menu-props="auto"
                          outlined
                          dense
                        ></v-select>
                      </v-col>
                    </v-row>
                    <div class="text-center">
                      <v-btn
                        elevation="2"
                        color="#173053"
                        dark
                        large
                        block
                        @click="cancelChk()"
                        >ยกเลิกรายการนี้</v-btn
                      >
                    </div>
                  </v-card-text>
                  <div class="text-center" v-if="!dataCancelReady">
                    <waitingAlert></waitingAlert>
                  </div>
                </v-container>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogRemarkReturn" :max-width="dialogwidth">
            <v-card class="text-center">
              <v-card-title>
                หมายเหตุเรียกกลับ
              </v-card-title>
              <!-- <v-form ref="form_remove" v-model="validRemove" lazy-validation> -->
              <v-container>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-menu
                        ref="menuReturn"
                        v-model="menuReturn"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dateReturn"
                            label="วันที่เรียกลูกค้ากลับมา"
                            persistent-hint
                            dense
                            outlined
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                            readonly
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dateReturn"
                          no-title
                          @input="menuReturn = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="remarkReturn"
                        outlined
                        label="หมายเหตุเรียกกลับ"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <div class="text-center">
                    <v-btn
                      elevation="10"
                      color="#173053"
                      dark
                      small
                      @click="onSaveRemarkReturn()"
                      >อัพเดทหมายเหตุ</v-btn
                    >
                    <v-btn
                      elevation="10"
                      color="#173053"
                      outlined
                      style="background-color:#FFFFFF"
                      small
                      @click="dialogRemarkReturn = false"
                      >ยกเลิก</v-btn
                    >
                  </div>
                </v-card-text>
              </v-container>
              <!-- </v-form> -->
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogRemark" :max-width="dialogwidth">
            <v-card class="text-center">
              <v-container>
                <v-card-text>
                  <v-row>
                    <v-col cols="6" class="text-left pt-10">
                      <h3><strong>หมายเหตุเพิ่มเติม</strong></h3>
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
                          @click="dialogRemark = false"
                        >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="remark"
                        outlined
                        label="หมายเหตุเพิ่มเติม"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <div class="text-center">
                    <v-btn
                      elevation="10"
                      color="#173053"
                      dark
                      large
                      block
                      @click="onSaveRemark()"
                      >หมายเหตุเพิ่มเติม</v-btn
                    >
                  </div>
                </v-card-text>
              </v-container>
              <!-- </v-form> -->
            </v-card>
          </v-dialog>
          <!-- data table -->
          <v-col cols="12">
            <BookingQueue
              :branchParent="branch"
              :masBranchIDParent="masBranchID"
              :drawerParent="drawer"
              :menu1Parent="menu1"
              :timeTableParent="timeTable"
              :rulesParent="rules"
              :masterTimeParent="masterTime"
              :dataItemTimesChangeParent="dataItemTimesChange"
              :getTimesChangeParent="getTimesChange"
              :exportExcelParent="exportExcel"
              :exportExcelMazdaParent="exportExcelMazda"
              :dataRemoveExportParent="dataRemoveExport"
              :exportExcelRemoveParent="exportExcelRemove"
              :toggleParent="toggle"
              @updateTimeTable="updateTimeTablefromChild"
            ></BookingQueue>
            <v-card elevation="0" v-if="dataReady">
              <v-card-text>
                <v-row>
                  <v-col col="auto">
                    <v-expansion-panels
                      dense
                      accordion
                      v-if="resCol === 'xs'"
                      style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                    >
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          >รายการตรวจสอบ</v-expansion-panel-header
                        >
                        <v-expansion-panel-content>
                          <v-btn
                            v-if="dataItem.length > 0"
                            color="blue-grey"
                            class="ma-2 white--text"
                            @click="toggle"
                            small
                          >
                            ตรวจสอบคิวจองรายวัน
                            <v-icon right dark>
                              mdi-table-eye
                            </v-icon>
                          </v-btn>
                          <v-btn
                            color="blue-grey"
                            class="ma-2 white--text"
                            small
                            @click="addDataSet()"
                          >
                            ตรวจสอบคิวจองรายเดือน
                          </v-btn>
                          <v-btn
                            color="blue-grey"
                            class="ma-2 white--text"
                            @click="
                              (dialogShowEmpReport = true),
                                (dataShowEmpReport = []),
                                (dateStartShowEmpReport = '')
                            "
                            small
                          >
                            ตรวจสอบคิวช่างรายวัน
                            <v-icon right dark>
                              mdi-book-account-outline
                            </v-icon>
                          </v-btn>
                          <v-btn
                            v-if="DataFlowNameMenu.length > 0"
                            color="blue-grey"
                            class="ma-2 white--text"
                            small
                            @click="
                              (dialogShowMenuReport = true),
                                (dataShowMenuReport = []),
                                (dateStartShowMenuReport = '')
                            "
                          >
                            ตรวจสอบรายการเมนูรายวัน
                          </v-btn>
                          <v-btn
                            v-if="
                              getSelectText === 'wait' &&
                                filteredSelect.length > 0 &&
                                $session.getAll().data.shopId !==
                                  'Uc520945108b983b6e739ed0a8cd8dae4'
                            "
                            color="primary"
                            class="ma-2 white--text"
                            small
                            @click="exportExcelWait()"
                          >
                            <v-icon right dark>mdi-microsoft-excel</v-icon>
                            &nbsp;Export Excel
                          </v-btn>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <template v-else>
                      <v-btn
                        v-if="dataItem.length > 0"
                        color="blue-grey"
                        class="ma-2 white--text"
                        @click="toggle"
                        small
                      >
                        ตรวจสอบคิวจองรายวัน
                        <v-icon right dark>
                          mdi-table-eye
                        </v-icon>
                      </v-btn>
                      <v-btn
                        color="blue-grey"
                        class="ma-2 white--text"
                        small
                        @click="addDataSet()"
                      >
                        ตรวจสอบคิวจองรายเดือน
                      </v-btn>
                      <v-btn
                        color="blue-grey"
                        class="ma-2 white--text"
                        @click="
                          (dialogShowEmpReport = true),
                            (dataShowEmpReport = []),
                            (dateStartShowEmpReport = '')
                        "
                        small
                      >
                        ตรวจสอบคิวช่างรายวัน
                        <v-icon right dark>
                          mdi-book-account-outline
                        </v-icon>
                      </v-btn>
                      <v-btn
                        v-if="DataFlowNameMenu.length > 0"
                        color="blue-grey"
                        class="ma-2 white--text"
                        small
                        @click="
                          (dialogShowMenuReport = true),
                            (dataShowMenuReport = []),
                            (dateStartShowMenuReport = '')
                        "
                      >
                        ตรวจสอบรายการเมนูรายวัน
                      </v-btn>
                      <v-btn
                        v-if="
                          getSelectText === 'wait' &&
                            filteredSelect.length > 0 &&
                            $session.getAll().data.shopId !==
                              'Uc520945108b983b6e739ed0a8cd8dae4'
                        "
                        color="primary"
                        class="ma-2 white--text"
                        small
                        @click="exportExcelWait()"
                      >
                        <v-icon right dark>mdi-microsoft-excel</v-icon>
                        &nbsp;Export Excel
                      </v-btn>
                    </template>
                  </v-col>
                  <v-col :cols="resCol === 'xs' ? '12' : '3'">
                    <v-select
                      style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 5px;"
                      v-model="sortSelect"
                      hide-details
                      background-color="white"
                      :items="
                        getSelectText === 'wait' ? itemsSortWaiting : itemsSort
                      "
                      label="จัดเรียงข้อมูล"
                      outlined
                      dense
                      @change="checkTypeSort(sortSelect)"
                    ></v-select>
                    <v-radio-group v-model="sort" row @change="checkTypeSort()">
                      <v-radio
                        label="มากไปน้อย"
                        value="มากไปน้อย"
                        hide-details
                      ></v-radio>
                      <v-radio
                        label="น้อยไปมาก"
                        value="น้อยไปมาก"
                        hide-details
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col class="text-right" cols="auto">
                    <template v-if="getSelectText === 'confirmJob'">
                      <v-select
                        v-model="filterCloseJobValue"
                        background-color="white"
                        style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                        hide-details
                        :items="listFilterCloseJob"
                        label="สถานะบริการ"
                        outlined
                        dense
                        required
                        @change="
                          getSelect('confirmJob', countJob, filterCloseJobValue)
                        "
                      >
                        <template #prepend-inner>
                          <v-icon
                            class="mr-2 iconify"
                            data-icon="eos-icons:cronjob"
                            color="#69D1FD"
                            style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                          >
                          </v-icon>
                        </template>
                      </v-select>
                    </template>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-title> </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="columns"
                  :items="dataItem"
                  v-if="!selectedStatus"
                  :search="searchAll2"
                  :items-per-page="10"
                >
                  <template v-slot:[`item.cusName`]="{ item }">
                    <a @click.stop="openInfo(item)" style="cursor:hand"
                      ><u>{{ item.cusName }}</u></a
                    >
                  </template>
                  <template v-slot:[`item.CREATE_DATE`]="{ item }">
                    {{ format_dateNotime(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                    {{ format_dateNotime(item.LAST_DATE) }}
                  </template>
                  <template v-slot:[`item.dueDate`]="{ item }">
                    {{ format_date(item.dueDate) }}
                  </template>
                  <template v-slot:[`item.action2`]="{ item }">
                    <v-row>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          v-if="
                            item.statusBt === 'confirm' ||
                              item.statusBt === 'confirmJob'
                          "
                          :color="
                            item.remarkConfirm1
                              ? 'green darken-2'
                              : 'grey darken-1'
                          "
                          v-model="item.remarkConfirm1"
                          @click.stop="
                            item.remarkConfirm1 = !item.remarkConfirm1;
                            confirmRemark(item, 'inAdvance');
                          "
                        >
                          1 วัน
                        </v-chip>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.action3`]="{ item }">
                    <v-row>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          :color="
                            item.fastTrack ? 'green darken-2' : 'grey darken-1'
                          "
                          v-model="item.fastTrack"
                          @click.stop="
                            item.fastTrack = !item.fastTrack;
                            confirmRemark(item, 'fastTrack');
                          "
                        >
                          {{ dataTypeJob3 }}
                        </v-chip>
                      </v-col>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          :color="
                            item.extraJob ? 'green darken-2' : 'grey darken-1'
                          "
                          v-model="item.extraJob"
                          @click.stop="
                            item.extraJob = !item.extraJob;
                            confirmRemark(item, 'extraJob');
                          "
                        >
                          {{ dataTypeJob2 }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <!-- confirm -->
                    <v-btn
                      color="success"
                      fab
                      id="v-step-2"
                      v-if="item.statusBt !== 'confirmJob'"
                      :disabled="item.chkConfirm"
                      small
                      @click.stop="confirmChk(item)"
                    >
                      <v-icon dark> mdi-phone-check </v-icon>
                    </v-btn>
                    <v-btn
                      color="error"
                      fab
                      id="v-step-2"
                      v-if="item.statusBt !== 'confirmJob'"
                      small
                      :disabled="item.chkCancel"
                      @click.stop="setDataRemove(item)"
                      title="ยกเลิกนัด"
                    >
                      <v-icon dark> mdi-phone-cancel </v-icon>
                    </v-btn>
                    <v-tooltip bottom v-if="item.statusBt !== 'confirmJob'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-badge
                          avatar
                          bordered
                          overlap
                          :content="item.countChangeTime"
                          color="warning"
                          class="mr-1"
                          style="cursor: pointer"
                        >
                          <v-btn
                            color="warning"
                            fab
                            small
                            @click.stop="setDataChang(item)"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon> mdi-calendar-clock </v-icon>
                          </v-btn>
                        </v-badge>
                      </template>
                      <span>เปลี่ยนเวลานัดหมาย</span>
                    </v-tooltip>

                    <v-btn
                      color="primary"
                      fab
                      v-if="item.statusBt === 'confirm'"
                      small
                      @click.stop="
                        (dialogEdit = true),
                          getBookingData(item),
                          checkTimeFlow(item)
                      "
                    >
                      <v-icon dark> mdi-account-plus </v-icon>
                    </v-btn>
                    <v-btn
                      color="red"
                      dark
                      v-if="
                        item.statusBt === 'confirmJob' ||
                          item.statusBt === 'cancel'
                      "
                      fab
                      small
                      @click.stop="(dialogDelete = true), getDataById(item)"
                    >
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
                    <v-btn
                      color="info"
                      dark
                      v-if="item.statusBt === 'confirmJob'"
                      fab
                      small
                      @click.stop="(dialogJob = true), getjob(item)"
                    >
                      <v-icon> mdi-qrcode-scan </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
                <v-data-table
                  :headers="columnsSelected"
                  :items="filteredSelect"
                  v-if="selectedStatus"
                  :search="searchAll2"
                  min-height="400px"
                  :items-per-page="30"
                  :item-class="getRowClass"
                >
                  <!-- <template v-slot:[`item.CREATE_DATE`]="{ item }">
                    {{ format_dateNotime(item.CREATE_DATE) }}
                  </template>
                  <template v-slot:[`item.LAST_DATE`]="{ item }">
                    {{ format_dateNotime(item.LAST_DATE) }}
                  </template> -->
                  <template v-slot:[`item.dueDate`]="{ item }">
                    <div>
                      <div>
                        {{
                          item.dueDate.split(" ")[0].split("-")[2] +
                            "/" +
                            item.dueDate.split(" ")[0].split("-")[1] +
                            "/" +
                            item.dueDate.split(" ")[0].split("-")[0]
                        }}
                      </div>
                      <div>
                        {{
                          item.dueDate.split(" ")[1] + " น." + item.dueDateEnd
                        }}
                      </div>
                    </div>
                  </template>
                  <template v-slot:[`item.cusName`]="{ item }">
                    <v-row>
                      <v-col cols="12">
                        <v-row>
                          <v-col
                            col="auto"
                            class="text-ceter"
                            v-if="
                              item.userId === 'user-skip' ||
                                item.userId === '' ||
                                item.userId === null
                            "
                          >
                            {{ item.cusName }}
                          </v-col>
                          <template v-else>
                            <v-col col="auto" class="text-ceter">
                              <a
                                @click.stop="openHistory(item)"
                                style="cursor:hand"
                                ><u>{{ item.cusName }}</u></a
                              >
                            </v-col>
                          </template>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.remarkReturn`]="{ item }">
                    <a
                      v-if="item.remarkReturn !== ''"
                      @click.stop="openRemarkReturn(item)"
                      style="cursor:hand"
                      ><u>{{ item.remarkReturn }}</u></a
                    >
                    <v-btn
                      color="purple"
                      small
                      v-if="item.remarkReturn === ''"
                      dark
                      @click.stop="openRemarkReturn(item)"
                    >
                      <v-icon left dark> mdi-playlist-edit </v-icon>
                      เพิ่มหมายเหตุเรียกกลับ
                    </v-btn>
                  </template>
                  <template v-slot:[`item.remark`]="{ item }">
                    <a
                      v-if="item.remark !== ''"
                      @click.stop="openRemark(item)"
                      style="cursor:hand"
                    >
                      <u style="margin-right: 10px">{{
                        item.remark.slice(0, 48)
                      }}</u>
                    </a>
                    <div v-if="item.remark.length >= 50">
                      <v-menu
                        nudge-left="80"
                        rounded="xl"
                        top
                        open-on-hover
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            rounded
                            outlined
                            x-small
                            v-bind="attrs"
                            v-on="on"
                            style="color: #1363DF;font-weight: bold;"
                          >
                            อ่านเพิ่มเติม<v-icon
                              color="#1363DF"
                              style="font-size: 20px;margin-left: 5px;text-decoration: none;"
                              >mdi-arrow-right</v-icon
                            >
                          </v-btn>
                        </template>
                        <v-card max-width="300">
                          <v-list>
                            <v-list-item width="200px">
                              <v-list-item-content width="200px">
                                {{ item.remark }}</v-list-item-content
                              >
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-menu>
                    </div>
                    <v-btn
                      color="teal"
                      small
                      v-if="item.remark === ''"
                      dark
                      @click.stop="openRemark(item)"
                    >
                      <v-icon left dark> mdi-playlist-edit </v-icon>
                      เพิ่มหมายเหตุ
                    </v-btn>
                  </template>
                  <template v-slot:[`item.action40`]="{ item }">
                    <template v-if="item.depositCheckStatus === 'True'">
                      <v-chip
                        filter
                        dark
                        v-if="item.depositStatus === 'False'"
                        color="grey darken-1"
                        @click="(dialogDeposit = true), (bookNo = item.bookNo)"
                      >
                        <v-icon class="iconify mr-1" color="#FFAB2D"
                          >mdi-script-text-outline</v-icon
                        >
                        <!-- <v-icon class="iconify mr-1" size="70px" color="#FFAB2D" data-icon="flat-color-icons:money-transfer"></v-icon> -->
                        มัดจำ
                      </v-chip>
                      <v-row v-if="item.depositStatus === 'True'">
                        <v-col col="auto">
                          <v-chip
                            filter
                            dark
                            color="green darken-1"
                            @click="
                              (dialogDeposit = true),
                                (bookNo = item.bookNo),
                                (statusDeposit = true),
                                (pictureUrlPreviewDeposit =
                                  item.depositImge || '')
                            "
                          >
                            <!-- <v-icon class="iconify mr-1" size="70px" color="#FFAB2D" data-icon="flat-color-icons:money-transfer"></v-icon> -->
                            <v-icon class="iconify mr-1" color="#FFAB2D"
                              >mdi-script-text-outline</v-icon
                            >
                            มัดจำ
                          </v-chip>
                        </v-col>
                      </v-row>
                    </template>
                  </template>
                  <template v-slot:[`item.memberDataTagName`]="{ item }">
                    <div>
                      <v-row
                        v-if="item.memberDataTag.length === 0"
                        style="justify-content: flex-end;"
                      >
                        <div v-if="item.memberId !== ''" style="color:grey;">
                          ไม่มีมีป้ายกำกับ
                        </div>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="ml-1"
                              fab
                              v-bind="attrs"
                              v-on="on"
                              dark
                              icon
                              v-if="item.memberId !== ''"
                              x-small
                              color="teal"
                              @click="
                                getTagData(),
                                  (dialogTag = true),
                                  (tagData = item.memberDataTag),
                                  (bookNo = item.bookNo),
                                  (memberId = item.memberId)
                              "
                            >
                              <v-icon dark>
                                mdi-tag-plus
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>เพิ่มป้ายกำกับ1</span>
                        </v-tooltip>
                        <div
                          v-if="item.memberId == ''"
                          style="margin: auto;color: grey;"
                        >
                          ไม่มีป้ายกำกับ
                        </div>
                      </v-row>
                      <v-row
                        style="display: flex;justify-content: center;padding-top: 0px;"
                        align="center"
                        v-if="item.memberDataTag.length > 0"
                      >
                        <div
                          v-if="item.tagDataShow.length === 1"
                          style="font-weight: 600;font-size: 16px;color: #2BC155;"
                        >
                          {{ item.tagDataShow[0].text }}
                        </div>
                        <div
                          v-if="item.tagDataShow.length === 2"
                          style="font-weight: 600;font-size: 16px;color: #2BC155;display: flex;justify-content: center;"
                        >
                          <div class="mr-2">{{ item.tagDataShow[0].text }}</div>
                          <div>{{ item.tagDataShow[1].text }}</div>
                        </div>
                        <div
                          v-if="item.tagDataShow.length > 2"
                          style="font-weight: 600;font-size: 16px;color: #2BC155;display: flex;justify-content: center;margin-bottom: 5px;"
                        >
                          <div class="mr-3">{{ item.tagDataShow[0].text }}</div>
                          <div class="mr-2">{{ item.tagDataShow[1].text }}</div>
                        </div>
                        <div
                          v-if="
                            item.tagDataShow.length === 1 ||
                              item.tagDataShow.length === 2
                          "
                        >
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                class="ml-1"
                                fab
                                v-bind="attrs"
                                v-on="on"
                                dark
                                icon
                                v-if="item.memberId !== ''"
                                x-small
                                color="teal"
                                @click="
                                  getTagData(),
                                    (dialogTag = true),
                                    (tagData = item.memberDataTag),
                                    (bookNo = item.bookNo),
                                    (memberId = item.memberId)
                                "
                              >
                                <v-icon dark>
                                  mdi-tag-plus
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>เพิ่มป้ายกำกับ2</span>
                          </v-tooltip>
                        </div>
                        <div
                          v-if="item.tagDataShow.length > 2"
                          class="ma-0"
                          style="margin-top: 2 !important;color: grey;font-size: 13px;display:flex"
                        >
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                class="ml-1"
                                fab
                                v-bind="attrs"
                                v-on="on"
                                dark
                                icon
                                v-if="item.memberId !== ''"
                                x-small
                                color="teal"
                                @click="
                                  getTagData(),
                                    (dialogTag = true),
                                    (tagData = item.memberDataTag),
                                    (bookNo = item.bookNo),
                                    (memberId = item.memberId)
                                "
                              >
                                <v-icon dark>
                                  mdi-tag-plus
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>เพิ่มป้ายกำกับ3</span>
                          </v-tooltip>
                          <v-menu
                            rounded="xl"
                            offset-x
                            open-on-hover
                            :close-on-content-click="false"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <div
                                style="margin: auto;text-decoration: underline;text-decoration-thickness: 2px;"
                                v-bind="attrs"
                                v-on="on"
                              >
                                See more + {{ item.tagDataShow.length - 2 }}
                              </div>
                            </template>
                            <v-list>
                              <v-list-item
                                v-for="(item2, index) in item.tagDataShow"
                                :key="index"
                              >
                                <v-list-item-title>
                                  <v-icon color="teal"> mdi-tag-plus </v-icon
                                  >{{ item2.text }}</v-list-item-title
                                >
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                      </v-row>
                    </div>
                  </template>
                  <!-- <template v-slot:[`item.memberDataTagName`]="{ item }">
                    <div>
                      <v-row v-if="item.memberDataTag.length === 0 " style="justify-content: flex-end;">
                        <div v-if="item.memberId !== ''" style="color:grey;">ไม่มีมีป้ายกำกับ</div>
                        <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                  class="ml-1"
                                  fab
                                  v-bind="attrs"
                                  v-on="on"
                                  dark
                                  icon
                                  v-if="item.memberId !== ''"
                                  x-small
                                  color="teal"
                                  @click="getTagData(), dialogTag = true, tagData = item.memberDataTag, bookNo = item.bookNo, memberId = item.memberId"
                                >
                                  <v-icon dark>
                                    mdi-tag-plus
                                  </v-icon>
                              </v-btn>
                            </template>
                            <span>เพิ่มป้ายกำกับ1</span>
                          </v-tooltip>
                          <div  v-if="item.memberId == ''" style="margin: auto;color: grey;">
                            ไม่มีป้ายกำกับ
                          </div>
                      </v-row>
                      <v-row  style="display: flex;justify-content: center;padding-top: 0px;" align="center" v-if="item.memberDataTag.length > 0 ">
                          <div v-if="item.tagDataShow.length === 1" style="font-weight: 600;font-size: 16px;color: #2BC155;">
                            {{item.tagDataShow[0].text}}
                          </div>
                          <div v-if="item.tagDataShow.length === 2" style="font-weight: 600;font-size: 16px;color: #2BC155;display: flex;justify-content: center;">
                            <div class="mr-2">{{item.tagDataShow[0].text}}</div>
                            <div>{{item.tagDataShow[1].text}}</div>
                          </div>
                          <div v-if="item.tagDataShow.length > 2" style="font-weight: 600;font-size: 16px;color: #2BC155;display: flex;justify-content: center;margin-bottom: 5px;">
                            <div class="mr-3">{{item.tagDataShow[0].text}}</div>
                            <div class="mr-2">{{item.tagDataShow[1].text}}</div>
                          </div>
                          <div v-if="item.tagDataShow.length === 1 || item.tagDataShow.length === 2">
                            <v-tooltip bottom >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                  class="ml-1"
                                  fab
                                  v-bind="attrs"
                                  v-on="on"
                                  dark
                                  icon
                                  v-if="item.memberId !== ''"
                                  x-small
                                  color="teal"
                                  @click="getTagData(), dialogTag = true, tagData = item.memberDataTag, bookNo = item.bookNo, memberId = item.memberId"
                                >
                                  <v-icon dark>
                                    mdi-tag-plus
                                  </v-icon>
                              </v-btn>
                            </template>
                            <span>เพิ่มป้ายกำกับ2</span>
                          </v-tooltip>
                          </div>
                          <div v-if="item.tagDataShow.length > 2" class="ma-0" style="margin-top: 2 !important;color: grey;font-size: 13px;display:flex">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                  class="ml-1"
                                  fab
                                  v-bind="attrs"
                                  v-on="on"
                                  dark
                                  icon
                                  v-if="item.memberId !== ''"
                                  x-small
                                  color="teal"
                                  @click="getTagData(), dialogTag = true, tagData = item.memberDataTag, bookNo = item.bookNo, memberId = item.memberId"
                                >
                                  <v-icon dark>
                                    mdi-tag-plus
                                  </v-icon>
                              </v-btn>
                            </template>
                            <span>เพิ่มป้ายกำกับ3</span>
                          </v-tooltip>
                            <v-menu rounded="xl" offset-x open-on-hover :close-on-content-click="false">
                              <template v-slot:activator="{ on, attrs }">
                                <div style="margin: auto;text-decoration: underline;text-decoration-thickness: 2px;" v-bind="attrs" v-on="on">
                                  See more + {{item.tagDataShow.length - 2}}
                                </div>
                              </template>
                              <v-list>
                                <v-list-item
                                  v-for="(item2, index) in item.tagDataShow"
                                  :key="index"
                                >
                                  <v-list-item-title>
                                    <v-icon color="teal">
                                      mdi-tag-plus
                                    </v-icon>{{ item2.text }}</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                        </div>
                      </v-row>
                    </div>
                  </template> -->
                  <template v-slot:[`item.action2`]="{ item }">
                    <v-row>
                      <v-col>
                        <v-chip
                          filter
                          dark
                          v-if="
                            item.statusBt === 'confirm' ||
                              item.statusBt === 'confirmJob'
                          "
                          :color="
                            item.remarkConfirm1
                              ? 'green darken-2'
                              : 'grey darken-1'
                          "
                          v-model="item.remarkConfirm1"
                          @click.stop="
                            item.remarkConfirm1 = !item.remarkConfirm1;
                            confirmRemark(item, 'inAdvance');
                          "
                        >
                          1 วัน
                        </v-chip>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.action3`]="{ item }">
                    <v-row>
                      <v-col>
                        <v-chip
                          dark
                          :color="
                            item.fastTrack ? 'green darken-2' : 'grey darken-1'
                          "
                          v-model="item.fastTrack"
                          @click.stop="
                            item.fastTrack = !item.fastTrack;
                            confirmRemark(item, 'fastTrack');
                          "
                        >
                          {{ dataTypeJob3 }}
                        </v-chip>
                      </v-col>
                      <v-col>
                        <v-chip
                          dark
                          :color="
                            item.extraJob ? 'green darken-2' : 'grey darken-1'
                          "
                          v-model="item.extraJob"
                          @click.stop="
                            item.extraJob = !item.extraJob;
                            confirmRemark(item, 'extraJob');
                          "
                        >
                          {{ dataTypeJob2 }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <!-- confirm -->
                    <v-menu
                      rounded="xl"
                      offset-y
                      transition="slide-y-transition"
                    >
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          style="background-color: #E0F4FF;border-radius: 10px;font-weight: bold;"
                          class="black--text pa-5"
                          elevation="0"
                          v-bind="attrs"
                          v-on="on"
                        >
                          เมนูจัดการ
                          <v-icon color="#73777B" class="ml-2">
                            mdi-chevron-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list class="menu">
                        <v-hover v-slot:default="{ hover }">
                          <v-list-item
                            @click.stop="
                              (dialogEdit = true),
                                getBookingDataJob(item, 'qrcode')
                            "
                            v-if="
                              item.statusBt === 'confirm' &&
                                showOnsite === 'แสดง'
                            "
                          >
                            <template
                              ><v-expand-transition>
                                <v-overlay
                                  color="green"
                                  absolute
                                  :opacity="0.2"
                                  :value="hover"
                                >
                                </v-overlay>
                              </v-expand-transition>
                              <v-list-item-title
                                ><v-icon
                                  color="#73777B"
                                  class="mr-2 iconify"
                                  data-icon="bi:people"
                                ></v-icon>
                                รับเข้าบริการ
                              </v-list-item-title>
                            </template>
                          </v-list-item>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <v-list-item
                            style="background-color: lightgreen"
                            @click.stop="confirmChk(item)"
                            v-if="
                              item.statusBt !== 'confirmJob' &&
                                item.statusBt !== 'confirm' &&
                                item.statusBt !== 'cancel'
                            "
                          >
                            <template
                              ><v-expand-transition>
                                <v-overlay
                                  color="green"
                                  absolute
                                  :opacity="0.2"
                                  :value="hover"
                                >
                                </v-overlay>
                              </v-expand-transition>
                              <v-list-item-title
                                ><v-icon
                                  color="#73777B"
                                  class="mr-2 iconify"
                                  data-icon="quill:mail-subbed"
                                ></v-icon>
                                ยืนยันนัดหมาย
                              </v-list-item-title>
                            </template>
                          </v-list-item>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <v-list-item
                            style="background-color: lightgreen"
                            @click.stop="confirmChkCancel(item)"
                            v-if="item.statusBt === 'cancel'"
                          >
                            <template
                              ><v-expand-transition>
                                <v-overlay
                                  color="green"
                                  absolute
                                  :opacity="0.2"
                                  :value="hover"
                                >
                                </v-overlay>
                              </v-expand-transition>
                              <v-list-item-title
                                ><v-icon
                                  color="#73777B"
                                  class="mr-2 iconify"
                                  data-icon="quill:mail-subbed"
                                ></v-icon>
                                ยืนยันนัดหมาย
                              </v-list-item-title>
                            </template>
                          </v-list-item>
                        </v-hover>
                        <v-list-item
                          @click.stop="getDataMenu(item)"
                          v-if="
                            (item.statusBt === 'confirm' ||
                              item.statusBt === 'wait') &&
                              item.menuShowStatus === 'True'
                          "
                        >
                          <v-list-item-title
                            ><v-icon color="#73777B" class="mr-2">
                              mdi-microsoft-xbox-controller-menu
                            </v-icon>
                            รายการเมนู
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click.stop="setDataChang(item)"
                          v-if="
                            item.statusBt !== 'confirmJob' &&
                              item.statusBt !== 'cancel'
                          "
                        >
                          <v-list-item-title
                            ><v-icon color="#73777B" class="mr-2">
                              mdi-calendar-clock
                            </v-icon>
                            เปลี่ยนเวลานัดหมาย
                            {{ item.countChangeTime }} ครั้ง</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item
                          @click.stop="setDataReture(item)"
                          v-if="
                            item.statusBt !== 'confirmJob' &&
                              item.depositStatus === 'True' &&
                              item.depositImge != ''
                          "
                        >
                          <v-list-item-title
                            ><v-icon
                              color="#73777B"
                              class="mr-2 iconify"
                              data-icon="uil:money-withdrawal"
                            ></v-icon>
                            คืนเงินมัดจำ
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click.stop="setShowMap(item)"
                          v-if="item.addressLatLong !== null"
                        >
                          <v-list-item-title
                            ><v-icon color="#73777B" class="mr-2">
                              mdi-map-marker-radius-outline
                            </v-icon>
                            ดูแผนที่
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click.stop="setDataEdit(item)">
                          <v-list-item-title
                            ><v-icon color="#73777B" class="mr-2">
                              mdi-tools
                            </v-icon>
                            แก้ไขข้อมูล
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click.stop="setDataCallLog(item)">
                          <v-list-item-title
                            ><v-icon
                              color="#73777B"
                              class="mr-2 iconify"
                              data-icon="eva:phone-call-fill"
                            >
                            </v-icon>
                            ประวัติการโทร
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click.stop="setDataServiceList(item)">
                          <v-list-item-title
                            ><v-icon
                              color="#73777B"
                              class="mr-2 iconify"
                              data-icon="cil:list-rich"
                            >
                            </v-icon>
                            สรุปรายการ
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click.stop="updateStatusBookingTransaction(item)"
                          v-if="item.statusBt === 'confirm'"
                        >
                          <v-list-item-title
                            ><v-icon color="#73777B" class="mr-2">
                              mdi-skip-backward
                            </v-icon>
                            กลับไปสถานะก่อนหน้า
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click.stop="
                            getBookingDataJob(item, 'qrcode'),
                              getEmpSelectAddJob(),
                              (dialogOnsite = true)
                          "
                          v-if="
                            item.statusBt === 'confirm' &&
                              showOnsite === 'ไม่แสดง'
                          "
                        >
                          <v-list-item-title
                            ><v-icon color="#73777B" class="mr-2">
                              mdi-account-plus
                            </v-icon>
                            มอบหมายงาน
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click.stop="setDataCopyLink(item)"
                          v-if="
                            item.statusBt === 'wait' &&
                              item.depositCheckStatus === 'True'
                          "
                        >
                          <v-list-item-title
                            ><v-icon
                              color="#73777B"
                              class="mr-2 iconify"
                              data-icon="bx:link"
                            ></v-icon>
                            เรียกเก็บค่าบริการเพื่อจอง
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-clipboard:success="onCopySuccess"
                          v-clipboard:copy="
                            'https://liff.line.me/' +
                              dataLineConfig.liffMainID +
                              '/ConfirmUser?bookNo=' +
                              item.bookNo +
                              '&shopId=' +
                              item.shopId
                          "
                          v-if="
                            item.statusBt === 'confirm' &&
                              (item.lineUserId === '' ||
                                item.lineUserId === null)
                          "
                        >
                          <!-- <v-list-item v-clipboard:success="onCopySuccess" v-clipboard:copy="'https://liff.line.me/1656581804-7KRQyqo5/ConfirmUser?bookNo=' + item.bookNo + '&shopId=' + item.shopId" v-if="item.statusBt === 'confirm' && (item.userId === 'user-skip' || item.userId === '' || item.userId === null)"> -->
                          <v-list-item-title
                            ><v-icon color="#73777B" class="mr-2">
                              mdi-content-copy
                            </v-icon>
                            คัดลอกลิงค์ (ผูกลูกค้า)
                          </v-list-item-title>
                        </v-list-item>
                        <v-hover v-slot:default="{ hover }">
                          <v-list-item
                            v-if="
                              item.statusBt !== 'cancel' &&
                                item.statusBt !== 'confirmJob'
                            "
                            :disabled="item.chkCancel"
                            @click.stop="setDataRemove(item)"
                          >
                            <template
                              ><v-expand-transition>
                                <v-overlay
                                  color="red"
                                  absolute
                                  :opacity="0.2"
                                  :value="hover"
                                >
                                </v-overlay>
                              </v-expand-transition>
                              <v-list-item-title
                                ><v-icon
                                  color="#73777B"
                                  class="mr-2 iconify"
                                  data-icon="carbon:rule-cancelled"
                                ></v-icon>
                                ยกเลิกนัดหมาย
                              </v-list-item-title>
                            </template>
                          </v-list-item>
                        </v-hover>
                        <v-list-item
                          v-if="item.statusBt === 'confirmJob'"
                          @click.stop="(dialogJob = true), getjob(item)"
                        >
                          <v-list-item-title
                            ><v-icon color="#73777B" class="mr-2">
                              mdi-qrcode-scan
                            </v-icon>
                            QR Code สำหรับให้ลูกค้า
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="item.statusBt === 'confirmJob'"
                          @click.stop="(dialogJob = true), getjob(item)"
                        >
                          <v-list-item-title
                            ><v-icon
                              color="#73777B"
                              class="mr-2 iconify"
                              data-icon="uil:bill"
                            ></v-icon>
                            ปิดงานนี้
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="
                            item.statusBt === 'confirmJob' &&
                              showOnsite === 'ไม่แสดง'
                          "
                        >
                          <v-list-item-title
                            ><v-icon color="#73777B" class="mr-2">
                              mdi-account-reactivate
                            </v-icon>
                            เปลี่ยนพนักงาน On site
                          </v-list-item-title>
                        </v-list-item>
                        <v-hover v-slot:default="{ hover }">
                          <v-list-item
                            v-if="item.statusBt === 'cancel'"
                            @click.stop="
                              (dialogDelete = true), getDataById(item)
                            "
                          >
                            <template
                              ><v-expand-transition>
                                <v-overlay
                                  color="red"
                                  absolute
                                  :opacity="0.2"
                                  :value="hover"
                                >
                                </v-overlay>
                              </v-expand-transition>
                              <v-list-item-title
                                ><v-icon color="#73777B" class="mr-2">
                                  mdi-delete
                                </v-icon>
                                ลบรายการนี้
                              </v-list-item-title>
                            </template>
                          </v-list-item>
                        </v-hover>
                      </v-list>
                    </v-menu>
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
        <v-dialog v-model="dialogMap" :max-width="dialogwidth">
          <v-card class="text-center">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6" class="text-left pt-10">
                    <h3><strong>แสดงแผนที่</strong></h3>
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
                        @click="dialogMap = false"
                      >
                        X
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <v-text-field
                      v-model="address"
                      outlined
                      label="ชื่อของที่อยู่"
                      auto-grow
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <v-card class="text-center">
                      <v-container>
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
                      </v-container>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogConfirm" :max-width="dialogwidth">
          <v-card class="text-center">
            <v-card-text v-if="dataConfirmReady">
              <v-container>
                <v-row>
                  <v-col cols="6" class="text-left pt-10">
                    <h3><strong>ยืนยันรายการนี้</strong></h3>
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
                        @click="dialogConfirm = false"
                      >
                        X
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    class="pb-0 pt-0"
                    cols="12"
                    v-if="
                      dataPackage.filter(el => {
                        return el.balanceAmount > 0;
                      }).length > 0
                    "
                  >
                    <v-card class="pl-1">
                      <v-subheader
                        >ลูกค้ามี
                        {{
                          dataPackage.filter(el => {
                            return el.balanceAmount > 0;
                          }).length
                        }}
                        แพ็คเกจ</v-subheader
                      >
                      <v-subheader v-show="StatusPackage.packageName"
                        >ลูกค้าได้ทำการเลือกแพ็คเกจ
                        {{ StatusPackage.packageName }}</v-subheader
                      >
                      <v-slide-group
                        v-model="modelPackageIndexConfirm"
                        show-arrows
                        center-active
                      >
                        <v-slide-item
                          v-for="(item, index) in dataPackage.filter(el => {
                            return el.balanceAmount > 0;
                          })"
                          :key="index"
                        >
                          <v-card
                            class="ma-2 p-2"
                            width="340"
                            min-height="120"
                            color="#FFFFFF"
                            elevation="6"
                            :style="
                              item.packageId === packageId &&
                              item.token === tokenPackage
                                ? 'border: 1px solid green;'
                                : 'border: 1px solid white;'
                            "
                          >
                            <!-- <v-card
                            class="ma-2 p-1"
                            width="340"
                            height="100"
                            color="#FFFFFF"
                            elevation="6"
                            :style="item.packageId === packageId && item.token === tokenPackage ? 'border: 1px solid green;' : 'border: 1px solid white;'"
                            > -->
                            <v-row>
                              <v-col cols="4" class="pr-1">
                                <v-img
                                  contain
                                  max-height="80"
                                  max-width="200"
                                  :src="item.packageImg"
                                ></v-img>
                              </v-col>
                              <v-col cols="8" class="pb-6">
                                <v-row class="font16 headline1">
                                  <v-col
                                    style="display: flex;"
                                    class="pl-0 pt-2 pb-0"
                                    >{{ item.packageName }}</v-col
                                  >
                                  <v-btn
                                    class="mr-4 mt-3"
                                    v-if="
                                      item.packageId !== packageId &&
                                        item.token !== tokenPackage
                                    "
                                    color="green"
                                    outlined
                                    rounded
                                    x-small
                                    @click="
                                      UpdatePackage(
                                        item.packageId,
                                        'ตกลง',
                                        item.packageName,
                                        item,
                                        item.token
                                      )
                                    "
                                    >ตกลง</v-btn
                                  >
                                  <v-btn
                                    class="mr-4 mt-3"
                                    v-if="
                                      item.packageId === packageId &&
                                        item.token !== tokenPackage
                                    "
                                    color="green"
                                    outlined
                                    rounded
                                    x-small
                                    @click="
                                      UpdatePackage(
                                        item.packageId,
                                        'ตกลง',
                                        item.packageName,
                                        item,
                                        item.token
                                      )
                                    "
                                    >ตกลง</v-btn
                                  >
                                  <v-btn
                                    class="mr-4 mt-3"
                                    v-if="
                                      item.packageId === packageId &&
                                        item.token === tokenPackage
                                    "
                                    color="red"
                                    outlined
                                    rounded
                                    x-small
                                    @click="
                                      UpdatePackage(
                                        item.packageId,
                                        'ยกเลิก',
                                        item.packageName,
                                        item,
                                        item.token
                                      )
                                    "
                                    >ยกเลิก</v-btn
                                  >
                                </v-row>
                                <v-row class="font14 headline1">
                                  <v-col
                                    style="display: flex;"
                                    class="pl-0 pt-0 pb-0"
                                    >จำนวนคงเหลือ
                                    {{ item.balanceAmount }} ครั้ง</v-col
                                  >
                                </v-row>
                                <v-row
                                  class="font14 headline1"
                                  v-if="
                                    $session.getAll().data.shopId ===
                                      'Ub7cbc419244731cdd682354dd0e57cef' &&
                                      item.packageId === packageId &&
                                      item.token === tokenPackage
                                  "
                                >
                                  <v-col
                                    class="pl-0 pt-0 pb-0"
                                    style="display: flex;"
                                  >
                                    <p
                                      class="mb-0"
                                      style="color: red;"
                                      v-if="
                                        item.balanceAmount - credit_package >= 0
                                      "
                                    >
                                      {{
                                        "ใช้ " +
                                          credit_package +
                                          " ตั๋ว ( คงเหลือ " +
                                          (item.balanceAmount -
                                            credit_package) +
                                          " )"
                                      }}
                                    </p>
                                    <p class="mb-0" style="color: red;" v-else>
                                      {{ "แพ็คเกจคงเหลือไม่พอ" }}
                                    </p>
                                  </v-col>
                                </v-row>
                                <v-row
                                  class="font14 headline1"
                                  v-if="
                                    $session.getAll().data.shopId !==
                                      'Ub7cbc419244731cdd682354dd0e57cef'
                                  "
                                >
                                  <v-col
                                    style="display: flex;"
                                    class="pl-0 pt-0 pb-0"
                                    >ทั้งหมด {{ item.amount }} ครั้ง</v-col
                                  >
                                </v-row>
                                <v-row class="font14 headline1">
                                  <v-col
                                    class="pl-0 pt-0 pb-0"
                                    style="display: flex;"
                                  >
                                    <VueCustomTooltip
                                      label="สามารถใช้ได้"
                                      position="is-top"
                                      v-if="dateTimestamp <= item.expirePackage"
                                    >
                                      <v-icon large color="teal darken-2">
                                        mdi-clock-check
                                      </v-icon>
                                    </VueCustomTooltip>
                                    <VueCustomTooltip
                                      label="หมดอายุแล้ว"
                                      position="is-top"
                                      v-if="dateTimestamp > item.expirePackage"
                                    >
                                      <v-icon large color="red darken-2">
                                        mdi-clock-alert
                                      </v-icon>
                                    </VueCustomTooltip>
                                    วันหมดอายุ
                                    {{
                                      arrayMove(
                                        new Date(item.expirePackage * 1000)
                                          .toLocaleString()
                                          .split(",")[0]
                                          .split("/"),
                                        0,
                                        1
                                      )
                                    }}
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-slide-item>
                      </v-slide-group>
                    </v-card>
                    <br />
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <v-select
                      v-model="empSelect"
                      :items="empSelectStep"
                      label="พนักงานที่รับนัดหมาย"
                      menu-props="auto"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <v-textarea
                      v-model="remark"
                      outlined
                      label="หมายเหตุเพิ่มเติม"
                      auto-grow
                    ></v-textarea>
                  </v-col>
                </v-row>
                <div class="text-center">
                  <v-btn
                    elevation="2"
                    color="#173053"
                    dark
                    block
                    large
                    @click="onConfirm(dataConfirm)"
                    >ยืนยันรายการนี้</v-btn
                  >
                </div>
              </v-container>
            </v-card-text>
            <div class="text-center" v-if="!dataConfirmReady">
              <waitingAlert></waitingAlert>
            </div>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEditData" :max-width="dialogwidth">
          <!-- <v-dialog v-model="dialogAdd" persistent max-width="70%"> -->
          <v-card class="text-center">
            <v-card-text>
              <v-row>
                <v-col cols="6" class="text-left pt-10">
                  <h3><strong>แก้ไขข้อมูล</strong></h3>
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
                      @click="
                        (dialogEditData = false),
                          (this.dataEditReady = true),
                          (fromAddTimeCus = ''),
                          (customerTimeSlot = 'False')
                      "
                    >
                      X
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12">
                  <v-col
                    class="pb-0 pt-0"
                    cols="12"
                    v-if="
                      dataPackage.filter(el => {
                        return (
                          el.balanceAmount > 0 &&
                          el.packageId === packageId &&
                          el.token === tokenPackage
                        );
                      }).length > 0 && dataPackageDefault === true
                    "
                  >
                    <v-card class="pl-1">
                      <!-- <v-subheader>ลูกค้ามี {{dataPackage.filter(el => { return el.balanceAmount > 0 && el.packageId === packageId && el.token === tokenPackage }).length}} แพ็คเกจ</v-subheader> -->
                      <v-subheader v-show="StatusPackage.packageName"
                        >ลูกค้าได้ทำการเลือกแพ็คเกจ
                        {{ StatusPackage.packageName }}</v-subheader
                      >
                      <v-slide-group
                        v-model="modelPackageIndexConfirm"
                        center-active
                        show-arrows
                      >
                        <v-slide-item
                          v-for="(item, index) in dataPackage.filter(el => {
                            return (
                              el.balanceAmount > 0 &&
                              el.packageId === packageId &&
                              el.token === tokenPackage
                            );
                          })"
                          :key="index"
                        >
                          <v-card
                            class="ma-2 p-1"
                            width="340"
                            height="100"
                            color="#FFFFFF"
                            elevation="6"
                            :style="
                              item.packageId === packageId &&
                              item.token === tokenPackage
                                ? 'border: 1px solid green;'
                                : 'border: 1px solid white;'
                            "
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
                              <v-col cols="8" class="pb-6">
                                <v-row class="font16 headline1">
                                  <v-col class="pl-0 pt-2 pb-0">{{
                                    item.packageName
                                  }}</v-col>
                                  <!-- <v-btn class="mr-4 mt-3" v-if="item.packageId !== packageId" color="green" outlined rounded x-small @click="UpdatePackage(item.packageId,'ตกลง',item.packageName, item)">ตกลง</v-btn>
                                        <v-btn class="mr-4 mt-3" v-if="item.packageId === packageId" color="red" outlined rounded x-small @click="UpdatePackage(item.packageId,'ยกเลิก',item.packageName, item)">ยกเลิก</v-btn> -->
                                </v-row>
                                <v-row class="font14 headline1">
                                  <v-col class="pl-0 pt-0 pb-0"
                                    >จำนวนการใช้ {{ item.balanceAmount }} /
                                    {{ item.amount }}
                                  </v-col>
                                </v-row>
                                <v-row class="font14 headline1">
                                  <v-col class="pl-0 pt-0 pb-0">
                                    <VueCustomTooltip
                                      label="สามารถใช้ได้"
                                      position="is-top"
                                      v-if="dateTimestamp <= item.expirePackage"
                                    >
                                      <v-icon large color="teal darken-2">
                                        mdi-clock-check
                                      </v-icon>
                                    </VueCustomTooltip>
                                    <VueCustomTooltip
                                      label="หมดอายุแล้ว"
                                      position="is-top"
                                      v-if="dateTimestamp > item.expirePackage"
                                    >
                                      <v-icon large color="red darken-2">
                                        mdi-clock-alert
                                      </v-icon>
                                    </VueCustomTooltip>
                                    >> วันหมดอายุ
                                    {{
                                      new Date(item.expirePackage * 1000)
                                        .toLocaleString()
                                        .substr(0, 9)
                                    }}
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-slide-item>
                      </v-slide-group>
                    </v-card>
                    <br />
                  </v-col>
                  <v-form ref="form_edit" v-model="validEdit" lazy-validation>
                    <v-col cols="12" v-if="dataEditReady">
                      <v-row justify="start">
                        <v-col cols="10" class="pb-0">
                          <v-select
                            v-model="formEdit.masBranchID"
                            :items="branch"
                            label="สาขา"
                            outlined
                            dense
                            required
                            :rules="[rules.required]"
                            @change="setFlowByBranchEdit()"
                          ></v-select>
                        </v-col>
                        <v-col
                          cols="2"
                          class="pb-0"
                          v-if="
                            getSelectText !== 'cancel' &&
                              checkSelectText !== 'confirmJob'
                          "
                        >
                          <v-btn
                            color="warning"
                            dark
                            class="ma-0"
                            @click="
                              (formEdit.bookingEmpFlow = ''),
                                (fromAddTimeCus = ''),
                                (dateEdit = ''),
                                (flowIdOldEdit = ''),
                                setEmpEdit()
                            "
                          >
                            <v-icon color="white" left
                              >mdi-account-clock</v-icon
                            >
                            เปลี่ยน
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" v-if="dataEditReady">
                      <v-select
                        v-model="formEdit.flowId"
                        :items="dataFlowSelectEdit"
                        label="ประเภทบริการ"
                        outlined
                        dense
                        required
                        @change="
                          (formEdit.bookingEmpFlow = ''),
                            (fromAddTimeCus = ''),
                            (dateEdit = ''),
                            setEmpEdit()
                        "
                        :rules="[rules.required]"
                      ></v-select>
                      <v-select
                        v-if="
                          formEdit.flowId !== '' &&
                            formEdit.flowId !== null &&
                            flowIdOldEdit !== formEdit.flowId &&
                            masBranchIDOldEdit !== formEdit.masBranchID &&
                            getSelectText !== 'cancel' &&
                            checkSelectText !== 'confirmJob'
                        "
                        v-model="formEdit.bookingEmpFlow"
                        :items="dataEmpChange"
                        label="พนักงานช่าง"
                        outlined
                        dense
                        required
                        :rules="[rules.required]"
                        @change="(dateEdit = ''), setEmpEdit()"
                      ></v-select>
                      <v-select
                        v-if="
                          formEdit.masBranchID !== null &&
                            formEdit.flowId !== null &&
                            flowIdOldEdit !== formEdit.flowId &&
                            masBranchIDOldEdit === formEdit.masBranchID &&
                            getSelectText !== 'cancel' &&
                            checkSelectText !== 'confirmJob'
                        "
                        v-model="formEdit.bookingEmpFlow"
                        :items="dataEmpChange"
                        label="พนักงานช่าง"
                        outlined
                        dense
                        required
                        :rules="[rules.required]"
                        @change="(dateEdit = ''), setEmpEdit()"
                      ></v-select>
                      <v-select
                        v-if="
                          formEdit.masBranchID !== null &&
                            formEdit.flowId !== null &&
                            flowIdOldEdit === formEdit.flowId &&
                            masBranchIDOldEdit !== formEdit.masBranchID &&
                            getSelectText !== 'cancel' &&
                            checkSelectText !== 'confirmJob'
                        "
                        v-model="formEdit.bookingEmpFlow"
                        :items="dataEmpChange"
                        label="พนักงานช่าง"
                        outlined
                        dense
                        required
                        :rules="[rules.required]"
                        @change="(dateEdit = ''), setEmpEdit()"
                      ></v-select>
                      <v-select
                        v-if="
                          customerTimeSlot === 'True' &&
                            formEdit.bookingEmpFlow !== '' &&
                            timeSlotbyCustomer.length > 1
                        "
                        v-model="fromAddTimeCus"
                        :items="timeSlotbyCustomer"
                        label="จำนวนชั่วโมง"
                        outlined
                        dense
                        required
                        :rules="[rules.required]"
                        @change="
                          (dateEdit = ''), AddallowedDatesBysetTimebydayEdit()
                        "
                      ></v-select>
                      <template v-if="BookingDataItemEdit">
                        <div
                          v-for="(item, index) in BookingDataItemEdit"
                          :key="index"
                        >
                          <template
                            v-if="
                              item.conditionField === '' ||
                                item.conditionField === null
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
                            </v-col>
                            <v-col
                              cols="12"
                              class="InputData"
                              v-if="item.fieldType == 'dateTime'"
                            >
                              <v-menu
                                v-model="menuEdit1"
                                :close-on-content-click="false"
                                :return-value.sync="date"
                                :rules="[rules.required]"
                                transition="scale-transition"
                                offset-y
                                required
                                min-width="auto"
                                ref="menuEdit1"
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
                                    (menuEdit1 = false),
                                      $refs.menuEdit1.save(item.fieldValue)
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
                                :rules="
                                  item.requiredField === 'True'
                                    ? [rules.required]
                                    : [true]
                                "
                                dense
                                clearable
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
                                    v-for="radios in JSON.parse(
                                      item.optionField
                                    )"
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
                                BookingDataItemEdit.filter(row => {
                                  return (
                                    row.fieldId ===
                                    parseInt(item.conditionField)
                                  );
                                }).length > 0
                            "
                          >
                            <template
                              v-if="
                                item.conditionValue ===
                                  BookingDataItemEdit.filter(row => {
                                    return (
                                      row.fieldId ===
                                      parseInt(item.conditionField)
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
                                  v-model="item.fieldValue"
                                  :label="item.fieldName"
                                  v-mask="'###-###-####'"
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
                                  v-model="menuEdit2"
                                  :close-on-content-click="false"
                                  :return-value.sync="date"
                                  :rules="[rules.required]"
                                  transition="scale-transition"
                                  offset-y
                                  required
                                  min-width="auto"
                                  ref="menuEdit2"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="item.fieldValue"
                                      readonly
                                      :label="item.fieldName"
                                      outlined
                                      dense
                                      prepend-inner-icon="mdi-calendar"
                                      v-bind="attrs"
                                      v-on="on"
                                      required
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
                                      (menuEdit2 = false),
                                        $refs.menuEdit2.save(item.fieldValue)
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
                                      v-for="radios in JSON.parse(
                                        item.optionField
                                      )"
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
                                  parseInt(formEdit.flowId)
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
                                  v-model="menuEdit3"
                                  :close-on-content-click="false"
                                  :return-value.sync="date"
                                  :rules="[rules.required]"
                                  transition="scale-transition"
                                  offset-y
                                  required
                                  min-width="auto"
                                  ref="menuEdit3"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="item.fieldValue"
                                      readonly
                                      :label="item.fieldName"
                                      outlined
                                      dense
                                      prepend-inner-icon="mdi-calendar"
                                      v-bind="attrs"
                                      v-on="on"
                                      required
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
                                      (menuEdit3 = false),
                                        $refs.menuEdit3.save(item.fieldValue)
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
                                  dense
                                  clearable
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
                                      v-for="radios in JSON.parse(
                                        item.optionField
                                      )"
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
                      <v-row
                        v-if="
                          flowIdOldEdit !== formEdit.flowId &&
                            masBranchIDOldEdit === formEdit.masBranchID &&
                            getSelectText !== 'cancel' &&
                            checkSelectText !== 'confirmJob'
                        "
                      >
                        <v-col
                          class="pb-0"
                          v-if="
                            customerTimeSlot === 'False'
                              ? formEdit.bookingEmpFlow
                              : fromAddTimeCus
                          "
                        >
                          <v-menu
                            v-model="menuDateEdit"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="dateEdit"
                                label="วันที่นัดหมาย"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                dense
                                outlined
                                v-on="on"
                                required
                                :rules="[rules.required]"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="dateEdit"
                              :allowed-dates="allowedDatesEdit"
                              @input="
                                (menuDateEdit = false),
                                  checkTimeEdit(dateEdit, {
                                    flowId: formEdit.flowId,
                                    bookingEmpFlow: formEdit.bookingEmpFlow
                                  })
                              "
                              :min="
                                new Date(
                                  Date.now() -
                                    new Date().getTimezoneOffset() * 60000
                                )
                                  .toISOString()
                                  .substr(0, 10)
                              "
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col
                          class="pb-0"
                          v-if="
                            customerTimeSlot === 'False'
                              ? timeavailable.length > 0 && dateEdit !== ''
                              : fromAddTimeCus !== '' && dateEdit !== ''
                          "
                        >
                          <v-select
                            v-model="timeEdit"
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
                      <v-row
                        v-if="
                          flowIdOldEdit !== formEdit.flowId &&
                            masBranchIDOldEdit !== formEdit.masBranchID &&
                            getSelectText !== 'cancel' &&
                            checkSelectText !== 'confirmJob'
                        "
                      >
                        <v-col
                          class="pb-0"
                          v-if="
                            customerTimeSlot === 'False'
                              ? formEdit.bookingEmpFlow
                              : fromAddTimeCus
                          "
                        >
                          <v-menu
                            v-model="menuDateEdit"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="dateEdit"
                                label="วันที่นัดหมาย"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                dense
                                outlined
                                v-on="on"
                                required
                                :rules="[rules.required]"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="dateEdit"
                              :allowed-dates="allowedDatesEdit"
                              @input="
                                (menuDateEdit = false),
                                  checkTimeEdit(dateEdit, {
                                    flowId: formEdit.flowId,
                                    bookingEmpFlow: formEdit.bookingEmpFlow
                                  })
                              "
                              :min="
                                new Date(
                                  Date.now() -
                                    new Date().getTimezoneOffset() * 60000
                                )
                                  .toISOString()
                                  .substr(0, 10)
                              "
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col
                          class="pb-0"
                          v-if="
                            customerTimeSlot === 'False'
                              ? timeavailable.length > 0 && dateEdit !== ''
                              : fromAddTimeCus !== '' && dateEdit !== ''
                          "
                        >
                          <v-select
                            v-model="timeEdit"
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
                      <v-row
                        v-if="
                          flowIdOldEdit === formEdit.flowId &&
                            masBranchIDOldEdit !== formEdit.masBranchID &&
                            getSelectText !== 'cancel' &&
                            checkSelectText !== 'confirmJob'
                        "
                      >
                        <v-col
                          class="pb-0"
                          v-if="
                            customerTimeSlot === 'False'
                              ? formEdit.bookingEmpFlow
                              : fromAddTimeCus
                          "
                        >
                          <v-menu
                            v-model="menuDateEdit"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="dateEdit"
                                label="วันที่นัดหมาย"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                dense
                                outlined
                                v-on="on"
                                required
                                :rules="[rules.required]"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="dateEdit"
                              :allowed-dates="allowedDatesEdit"
                              @input="
                                (menuDateEdit = false),
                                  checkTimeEdit(dateEdit, {
                                    flowId: formEdit.flowId,
                                    bookingEmpFlow: formEdit.bookingEmpFlow
                                  })
                              "
                              :min="
                                new Date(
                                  Date.now() -
                                    new Date().getTimezoneOffset() * 60000
                                )
                                  .toISOString()
                                  .substr(0, 10)
                              "
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col
                          class="pb-0"
                          v-if="
                            customerTimeSlot === 'False'
                              ? timeavailable.length > 0 && dateEdit !== ''
                              : fromAddTimeCus !== '' && dateEdit !== ''
                          "
                        >
                          <v-select
                            v-model="timeEdit"
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
                      <v-row>
                        <v-col class="pt-0 pb-0">
                          <v-radio-group
                            v-model="formEdit.radiosRemark"
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
                      <v-row v-if="checkSelectText !== 'confirmJob'">
                        <v-col class="pt-0">
                          <v-select
                            v-if="
                              formEdit.masBranchID !== null &&
                                formEdit.masBranchID !== ''
                            "
                            v-model="empSelectEdit"
                            :items="
                              empSelectStepAdd.filter(
                                i =>
                                  i.masBranchID === formEdit.masBranchID ||
                                  i.masBranchID === ''
                              )
                            "
                            label="พนักงานที่รับนัดหมาย"
                            menu-props="auto"
                            outlined
                            dense
                          ></v-select>
                        </v-col>
                      </v-row>
                      <div class="text-center">
                        <v-btn
                          elevation="2"
                          large
                          color="#173053"
                          block
                          class="text-white"
                          :loading="loadingEdit"
                          :disabled="loadingEdit"
                          @click="editDataSelect()"
                        >
                          <template v-slot:loader>
                            <span class="custom-loader">
                              <v-icon light>mdi-cached</v-icon>
                            </span>
                          </template>
                          <v-icon left>mdi-checkbox-marked-circle</v-icon>
                          แก้ไขข้อมูล
                        </v-btn>
                      </div>
                    </v-col>
                  </v-form>
                  <div class="text-center" v-if="!dataEditReady">
                    <waitingAlert></waitingAlert>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
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
        <v-dialog v-model="dialogError" persistent max-width="500px">
          <v-card>
            <v-card-title class="text-h5">
              ผิดพลาด
            </v-card-title>
            <v-card-text>{{ textError }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn dark color="red darken-1" @click="dialogError = false">
                ตรวจสอบอีกครั้ง
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogTag" persistent max-width="40%">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6" class="text-left pt-10">
                    <h3><strong>อัพเดท Tag</strong></h3>
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
                        @click="dialogTag = false"
                      >
                        X
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="tagData"
                      :items="tagItem"
                      outlined
                      dense
                      chips
                      small-chips
                      label="รายการ Tag"
                      multiple
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-btn
                      elevation="2"
                      large
                      block
                      color="wait"
                      text
                      @click="editTagData()"
                      :loading="loadingTag"
                      :disabled="loadingTag"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      อัพเดท
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      elevation="2"
                      large
                      block
                      color="success"
                      text
                      @click="dialogAddTag = true"
                      :loading="loadingTag"
                      :disabled="loadingTag"
                    >
                      <v-icon left>mdi-tag-plus</v-icon>
                      เพิ่ม Tag
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDeposit" persistent max-width="80%">
          <v-card>
            <v-container>
              <v-row style="padding-left: 2%;padding-top: 2%;">
                <v-col cols="6" class="text-left">
                  <h3><strong>อัพเดทหลักฐานเงินมัดจำ</strong></h3>
                </v-col>
                <v-col cols="6">
                  <div style="text-align: end;">
                    <v-btn
                      class="mx-2"
                      fab
                      small
                      dark
                      color="white"
                      :style="styleCloseBt"
                      @click="
                        (dialogDeposit = false),
                          (pictureUrlPreviewDeposit = null)
                      "
                    >
                      X
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <v-row>
              <v-col cols="12">
                <v-card-text v-if="pictureUrlPreviewDeposit === ''">
                  <v-alert dense border="left" type="warning">
                    <strong>ไม่มี รูปหลักฐานการมัดจำ</strong>
                  </v-alert>
                  <v-file-input
                    required
                    :rules="[rules.resizeImag]"
                    counter
                    show-size
                    accept="image/png, image/jpeg, image/bmp"
                    prepend-icon="mdi-camera"
                    label="รูปหลักฐานการมัดจำ"
                    @change="selectImgDeposit"
                    v-model="filesDeposit"
                  ></v-file-input>
                </v-card-text>
                <v-card-text v-else>
                  <v-container>
                    <v-form
                      ref="form_deposit"
                      v-model="valid_deposit"
                      lazy-validation
                    >
                      <v-row justify="center">
                        <v-col cols="12" class="text-center">
                          <v-img
                            aspect-ratio="6"
                            height="500"
                            contain
                            @click="gotoPicture(pictureUrlPreviewDeposit)"
                            :src="pictureUrlPreviewDeposit"
                          ></v-img>
                          <br />
                          <v-file-input
                            required
                            :rules="[rules.resizeImag]"
                            counter
                            show-size
                            accept="image/png, image/jpeg, image/bmp"
                            prepend-icon="mdi-camera"
                            label="รูปหลักฐานการมัดจำ"
                            @change="selectImgDeposit"
                            v-model="filesDeposit"
                          ></v-file-input>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn
                  elevation="2"
                  x-large
                  color="red darken-1"
                  text
                  @click="dialogDeposit = false, pictureUrlPreviewDeposit = null"
                  :loading="loadingDeposit"
                  :disabled="loadingDeposit"
                >
                  <v-icon left> mdi-cancel</v-icon>
                  ปิด
                </v-btn> -->
              <v-btn
                elevation="2"
                x-large
                color="success"
                text
                @click="editStatusDeposit()"
                :loading="loadingDeposit"
                :disabled="loadingDeposit"
              >
                <v-icon left>mdi-checkbox-marked-circle</v-icon>
                อัพเดท
              </v-btn>
              <v-btn
                v-if="statusDeposit === true"
                elevation="2"
                x-large
                color="error"
                text
                @click="cancelStatusDeposit()"
                :loading="loadingDeposit"
                :disabled="loadingDeposit"
              >
                <v-icon left>mdi-checkbox-marked-circle</v-icon>
                ยกเลิกสถานะเงินมัดจำ
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogAddTag" persistent max-width="40%">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6" class="text-left pt-10">
                    <h3><strong>เพิ่ม Tag</strong></h3>
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
                        @click="(dialogAddTag = false), (tagName = '')"
                      >
                        X
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="tagName"
                      label="กรอกข้อมูล Tag"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <div class="text-center">
                  <v-btn large block color="#173053" dark @click="AddDataTag()">
                    บันทึก
                  </v-btn>
                </div>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogHistory"
          scrollable
          persistent
          max-width="600px"
        >
          <v-card class="pa-3">
            <v-card-title>
              <span class="headline"></span>
            </v-card-title>
            <v-card-text class="pa-0" style="overflow-x: hidden;">
              <v-row>
                <v-col cols="6" class="text-left pt-10">
                  <h3><strong>ประวัติเข้ารับบริการ</strong></h3>
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
                      @click="dialogHistory = false"
                    >
                      X
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="main" col="12" md="12" sm="12">
                  <v-card class="pa-0 " min-height="70vh" rounded>
                    <div class="avatar text-center pt-3">
                      <div
                        style="display:flex;align-items: center;justify-content: center;"
                      >
                        <h4 v-if="memberName">
                          {{ memberName }}
                        </h4>
                        <v-btn
                          class="ml-3"
                          dark
                          fab
                          x-small
                          color="blue"
                          @click="coppyLink(memberName)"
                        >
                          <v-icon dark>
                            mdi-content-copy
                          </v-icon>
                        </v-btn>
                      </div>
                      <v-avatar size="120" style="border:5px solid #FFFFFF;">
                        <v-img
                          v-if="pictureUrHistory"
                          :src="pictureUrHistory"
                        ></v-img>
                        <v-icon size="100" color="orange" v-else>
                          mdi-tooltip-account
                        </v-icon>
                      </v-avatar>
                    </div>
                    <div v-if="memberName" class="text-center my-3">
                      <v-btn dark small color="#2BC155" @click="gotoLineOa()">
                        LINE OA
                      </v-btn>
                    </div>
                    <br />
                    <v-select
                      v-model="phonenum"
                      :items="phonenumItem"
                      label="ค้นหาเบอร์โทร"
                      dense
                      solo
                      @change="SelectDataHistory"
                    ></v-select>
                    <v-timeline align-top dense v-if="phonenum.length > 0">
                      <v-timeline-item
                        v-for="(item, index) in HistoryData[0]"
                        :key="index"
                      >
                        <template v-slot:icon>
                          <v-icon small dark> event</v-icon>
                        </template>
                        <div v-for="(item2, index2) in item" :key="index2">
                          <v-card-text class="text-start"
                            ><h6 class="font-weight-bold">
                              {{ format_dateThai(item2[0].dueDate) }}
                            </h6></v-card-text
                          >
                          <v-card-text class="text-start"
                            ><h6 class="font-weight-bold">
                              {{ item2[0].flowName }}
                            </h6></v-card-text
                          >
                          <v-card-text class="text-start"
                            ><h6 class="font-weight-bold">
                              {{ item2[0].masBranchName }}
                            </h6></v-card-text
                          >
                          <div v-for="(item3, index3) in item2" :key="index3">
                            <v-card-text
                              class="text-start"
                              v-if="item3.fieldValue !== ''"
                              ><strong>{{ item3.fieldName }} : </strong>
                              {{ item3.fieldValue }}</v-card-text
                            >
                          </div>
                          <br />
                          <v-card-text
                            v-if="
                              item2[0].depositStatus === 'True' &&
                                (item2[0].depositImge !== '' ||
                                  item2[0].depositImge !== null)
                            "
                          >
                            <v-img
                              aspect-ratio="6"
                              height="500"
                              contain
                              @click="gotoPicture(item2[0].depositImge)"
                              :src="item2[0].depositImge"
                            ></v-img>
                          </v-card-text>
                          <v-card-text
                            v-if="
                              item2[0].statusUpload1 === 'True' ||
                                item2[0].statusUpload2 === 'True'
                            "
                          >
                            <v-row>
                              <v-col
                                cols="auto"
                                v-if="item2[0].statusUpload1 === 'True'"
                              >
                                <v-btn
                                  tile
                                  color="#173053"
                                  dark
                                  small
                                  @click="showFileUpload(item2[0], '1')"
                                >
                                  <v-icon left>
                                    mdi-file-find
                                  </v-icon>
                                  Show File 1
                                </v-btn>
                              </v-col>
                              <v-col
                                cols="auto"
                                v-if="item2[0].statusUpload2 === 'True'"
                              >
                                <v-btn
                                  tile
                                  color="#173053"
                                  dark
                                  small
                                  @click="showFileUpload(item2[0], '2')"
                                >
                                  <v-icon left>
                                    mdi-file-find
                                  </v-icon>
                                  Show File 2
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- DIALOG ค่าใช้จ่าย -->
        <v-dialog v-model="dialogCloseJob" persistent max-width="400px">
          <v-card v-if="checkPayment === 'True'">
            <center>
              <v-col>
                <v-img
                  :aspect-ratio="1"
                  width="300"
                  height="100%"
                  :src="require('@/assets/paymentCloseJob.png')"
                ></v-img>
              </v-col>
            </center>
            <v-col class="text-center">
              <span class="headline">ค่าใช้จ่าย</span>
            </v-col>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col class="pb-0" cols="12" v-if="dataCoin.length > 0">
                    <v-subheader>แจกคะแนน Loyalty</v-subheader>
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
                  <v-col cols="12" class="pb-0">
                    <VuetifyMoney
                      v-model="formCloseJob.totalPrice"
                      placeholder="ค่าใช้จ่ายทั้งหมด"
                      dense
                      label="ค่าใช้จ่ายทั้งหมด"
                      required
                      outlined
                      :rules="[rules.required]"
                      v-bind:options="options2"
                    />
                  </v-col>
                  <v-col class="pb-0" cols="12">
                    <v-checkbox
                      v-model="statusPushEndStep"
                      label="ส่งข้อความ ขึ้นตอนสุดท้าย ไปยังลูกค้า"
                      true-value="True"
                      false-value="False"
                    ></v-checkbox>
                  </v-col>
                  <v-col class="text-center" cols="12">
                    <v-btn
                      class="white--text"
                      elevation="2"
                      depressed
                      color="#1B437C"
                      :loading="loadingCloseJob"
                      :disabled="loadingCloseJob"
                      @click="closeJob()"
                    >
                      <v-icon dark left>mdi-checkbox-marked-circle</v-icon>
                      ชำระเงิน
                    </v-btn>
                    <v-btn
                      color="primary"
                      :loading="loadingCloseJob"
                      :disabled="loadingCloseJob"
                      depressed
                      @click="dialogCloseJob = false"
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
            <center>
              <v-col>
                <v-img
                  :aspect-ratio="1"
                  width="300"
                  height="100%"
                  :src="require('@/assets/closeJob.png')"
                ></v-img>
              </v-col>
            </center>
            <v-col class="text-center">
              <span class="headline">ปิดงานนนี้</span>
            </v-col>
            <v-col class="pb-0" cols="12">
              <v-checkbox
                v-model="statusPushEndStep"
                label="ส่งข้อความ ขึ้นตอนสุดท้าย ไปยังลูกค้า"
                true-value="True"
                false-value="False"
              ></v-checkbox>
            </v-col>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col class="text-center" cols="12">
                    <v-btn
                      dark
                      elevation="2"
                      depressed
                      color="#1B437C"
                      @click="closeJob()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      ปิดงานนนี้
                    </v-btn>
                    <v-btn
                      color="primary"
                      depressed
                      @click="dialogCloseJob = false"
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
        <v-dialog
          v-model="dialogBookingAgain"
          persistent
          :max-width="dialogwidth"
        >
          <v-card class="text-center">
            <v-form
              ref="form_bookingAgain"
              v-model="validBookingAgain"
              lazy-validation
            >
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6" class="text-left pt-10">
                      <h3><strong>นัดหมายอีกครั้ง</strong></h3>
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
                          @click="dialogBookingAgain = false"
                        >
                          X
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      class="pa-0"
                      cols="12"
                      v-for="(item, index) in bookingData"
                      :key="index"
                    >
                      <h6 class="text-center" v-if="item.fieldValue !== ''">
                        <strong>{{ item.fieldName }} : </strong>
                        {{ item.fieldValue }}
                      </h6>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6" lg="6">
                      <v-menu
                        v-model="menuDataBokkAgain"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            label="วันที่นัดหมาย"
                            prepend-icon="mdi-calendar"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          @input="menuDataBokkAgain = false"
                          :min="
                            new Date(
                              Date.now() -
                                new Date().getTimezoneOffset() * 60000
                            )
                              .toISOString()
                              .substr(0, 10)
                          "
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="6" lg="6">
                      <v-select
                        required
                        :rules="[rules.required]"
                        v-model="time"
                        :items="timeavailable"
                        label="เวลา"
                        item-text="text"
                        item-value="text"
                        persistent-hint
                        return-object
                        outlined
                        dense
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        required
                        :rules="[rules.required]"
                        v-model="remark"
                        outlined
                        label="หมายเหตุเพิ่มเติม"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <div class="text-center">
                    <v-btn
                      elevation="10"
                      color="green darken-1"
                      dark
                      large
                      block
                      :loading="loadingBookingAgain"
                      :disabled="loadingBookingAgain"
                      @click="addBookingAgain()"
                      >ยืนยันนัดหมาย</v-btn
                    >
                  </div>
                </v-container>
              </v-card-text>
            </v-form>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogShowFileUpload" persistent max-width="80%">
          <v-card>
            <v-card-title>
              File Upload
            </v-card-title>
            <v-card-text v-if="typeof srcUpload === 'string'">
              <v-row>
                <v-col cols="12">
                  รายการที่ : 1
                </v-col>
                <v-col
                  cols="12"
                  v-if="
                    srcUpload.endsWith('.pdf') ||
                      srcUpload.endsWith('.xlsx') ||
                      srcUpload.endsWith('.xls')
                  "
                >
                  <v-btn
                    color="blue-grey"
                    class="ma-2 white--text"
                    @click="gotoPicture(srcUpload)"
                  >
                    แสดงรายการ
                    <v-icon right dark>
                      mdi-eye
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" v-else>
                  <v-img
                    height="300"
                    contain
                    :src="srcUpload"
                    @click="gotoPicture(srcUpload)"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text v-else>
              <v-row v-for="(item, index) in srcUpload" :key="index">
                <v-col cols="12"> รายการที่ : {{ index + 1 }} </v-col>
                <v-col
                  cols="12"
                  v-if="
                    item.endsWith('.pdf') ||
                      item.endsWith('.xlsx') ||
                      item.endsWith('.xls')
                  "
                >
                  <v-btn
                    color="blue-grey"
                    class="ma-2 white--text"
                    @click="gotoPicture(item)"
                  >
                    แสดงรายการ
                    <v-icon right dark>
                      mdi-eye
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" v-else>
                  <v-img
                    height="300"
                    contain
                    :src="item"
                    @click="gotoPicture(item)"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                elevation="2"
                color="red darken-1"
                text
                @click="dialogShowFileUpload = false"
              >
                <v-icon left> mdi-cancel</v-icon>
                ปิด
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogOnsite" persistent max-width="70%">
          <v-card class="text-center">
            <v-row>
              <v-col
                class="pb-0 pt-0"
                cols="12"
                v-if="
                  dataPackage.filter(el => {
                    return el.balanceAmount > 0;
                  }).length > 0 && dataPackageDefault === false
                "
              >
                <v-card class="pl-1">
                  <v-subheader
                    >ลูกค้ามี
                    {{
                      dataPackage.filter(el => {
                        return el.balanceAmount > 0;
                      }).length
                    }}
                    แพ็คเกจ</v-subheader
                  >
                  <v-subheader v-show="StatusPackage.packageName"
                    >ลูกค้าได้ทำการเลือกแพ็คเกจ
                    {{ StatusPackage.packageName }}</v-subheader
                  >
                  <v-slide-group
                    v-model="modelPackageIndexConfirmJob"
                    center-active
                    show-arrows
                  >
                    <v-slide-item
                      v-for="(item, index) in dataPackage.filter(el => {
                        return el.balanceAmount > 0;
                      })"
                      :key="index"
                    >
                      <v-card
                        class="ma-2 p-1"
                        width="340"
                        height="100"
                        color="#FFFFFF"
                        elevation="6"
                        :style="
                          item.packageId === packageId &&
                          item.token === tokenPackage
                            ? 'border: 1px solid green;'
                            : 'border: 1px solid white;'
                        "
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
                          <v-col cols="8" class="pb-6">
                            <v-row class="font16 headline1">
                              <v-col class="pl-0 pt-2 pb-0">{{
                                item.packageName
                              }}</v-col>
                              <v-btn
                                class="mr-4 mt-3"
                                v-if="
                                  item.packageId !== packageId &&
                                    item.token !== tokenPackage
                                "
                                color="green"
                                outlined
                                rounded
                                x-small
                                @click="
                                  UpdatePackage(
                                    item.packageId,
                                    'ตกลง',
                                    item.packageName,
                                    item,
                                    item.token
                                  ),
                                    (jobCheckPackage = true)
                                "
                                >ตกลง</v-btn
                              >
                              <v-btn
                                class="mr-4 mt-3"
                                v-if="
                                  item.packageId === packageId &&
                                    item.token !== tokenPackage
                                "
                                color="green"
                                outlined
                                rounded
                                x-small
                                @click="
                                  UpdatePackage(
                                    item.packageId,
                                    'ตกลง',
                                    item.packageName,
                                    item,
                                    item.token
                                  ),
                                    (jobCheckPackage = true)
                                "
                                >ตกลง</v-btn
                              >
                              <v-btn
                                class="mr-4 mt-3"
                                v-if="
                                  item.packageId === packageId &&
                                    item.token === tokenPackage
                                "
                                color="red"
                                outlined
                                rounded
                                x-small
                                @click="
                                  UpdatePackage(
                                    item.packageId,
                                    'ยกเลิก',
                                    item.packageName,
                                    item,
                                    item.token
                                  ),
                                    (jobCheckPackage = false)
                                "
                                >ยกเลิก</v-btn
                              >
                            </v-row>
                            <v-row class="font14 headline1">
                              <v-col class="pl-0 pt-0 pb-0"
                                >จำนวนการใช้ {{ item.balanceAmount }} /
                                {{ item.amount }}
                              </v-col>
                            </v-row>
                            <v-row class="font14 headline1">
                              <v-col class="pl-0 pt-0 pb-0">
                                <VueCustomTooltip
                                  label="สามารถใช้ได้"
                                  position="is-top"
                                  v-if="dateTimestamp <= item.expirePackage"
                                >
                                  <v-icon large color="teal darken-2">
                                    mdi-clock-check
                                  </v-icon>
                                </VueCustomTooltip>
                                <VueCustomTooltip
                                  label="หมดอายุแล้ว"
                                  position="is-top"
                                  v-if="dateTimestamp > item.expirePackage"
                                >
                                  <v-icon large color="red darken-2">
                                    mdi-clock-alert
                                  </v-icon>
                                </VueCustomTooltip>
                                >> วันหมดอายุ
                                {{
                                  new Date(item.expirePackage * 1000)
                                    .toLocaleString()
                                    .substr(0, 9)
                                }}
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-slide-item>
                  </v-slide-group>
                </v-card>
                <br />
              </v-col>
              <v-col
                class="pb-0 pt-0"
                cols="12"
                v-if="
                  dataPackage.filter(el => {
                    return el.balanceAmount > 0;
                  }).length > 0 && dataPackageDefault === true
                "
              >
                <v-card class="pl-1">
                  <v-subheader
                    >ลูกค้ามี
                    {{
                      dataPackage.filter(el => {
                        return el.balanceAmount > 0;
                      }).length
                    }}
                    แพ็คเกจ</v-subheader
                  >
                  <v-subheader v-show="StatusPackage.packageName"
                    >ลูกค้าได้ทำการเลือกแพ็คเกจ
                    {{ StatusPackage.packageName }}</v-subheader
                  >
                  <v-slide-group
                    v-model="modelPackageIndexConfirmJob"
                    center-active
                    show-arrows
                  >
                    <v-slide-item
                      v-for="(item, index) in dataPackage.filter(el => {
                        return el.balanceAmount > 0;
                      })"
                      :key="index"
                    >
                      <v-card
                        class="ma-2 p-1"
                        width="340"
                        height="100"
                        color="#FFFFFF"
                        elevation="6"
                        :style="
                          item.packageId === packageId &&
                          item.token === tokenPackage
                            ? 'border: 1px solid green;'
                            : 'border: 1px solid white;'
                        "
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
                          <v-col cols="8" class="pb-6">
                            <v-row class="font16 headline1">
                              <v-col class="pl-0 pt-2 pb-0">{{
                                item.packageName
                              }}</v-col>
                              <!-- <v-btn class="mr-4 mt-3" v-if="item.packageId !== packageId" color="green" outlined rounded x-small @click="UpdatePackage(item.packageId,'ตกลง',item.packageName, item)">ตกลง</v-btn>
                                  <v-btn class="mr-4 mt-3" v-if="item.packageId === packageId" color="red" outlined rounded x-small @click="UpdatePackage(item.packageId,'ยกเลิก',item.packageName, item)">ยกเลิก</v-btn> -->
                            </v-row>
                            <v-row class="font14 headline1">
                              <v-col class="pl-0 pt-0 pb-0"
                                >จำนวนการใช้ {{ item.balanceAmount }} /
                                {{ item.amount }}
                              </v-col>
                            </v-row>
                            <v-row class="font14 headline1">
                              <v-col class="pl-0 pt-0 pb-0">
                                <VueCustomTooltip
                                  label="สามารถใช้ได้"
                                  position="is-top"
                                  v-if="dateTimestamp <= item.expirePackage"
                                >
                                  <v-icon large color="teal darken-2">
                                    mdi-clock-check
                                  </v-icon>
                                </VueCustomTooltip>
                                <VueCustomTooltip
                                  label="หมดอายุแล้ว"
                                  position="is-top"
                                  v-if="dateTimestamp > item.expirePackage"
                                >
                                  <v-icon large color="red darken-2">
                                    mdi-clock-alert
                                  </v-icon>
                                </VueCustomTooltip>
                                >> วันหมดอายุ
                                {{
                                  new Date(item.expirePackage * 1000)
                                    .toLocaleString()
                                    .substr(0, 9)
                                }}
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-slide-item>
                  </v-slide-group>
                </v-card>
                <br />
              </v-col>
            </v-row>
            <v-card-title>มอบหมายงานให้พนักงาน Onsite</v-card-title>
            <v-card-text v-if="dataEditJobReady">
              <!-- {{BookingDataItem}} -->
              <v-container>
                <v-col
                  v-for="(item, indexitem) in BookingDataItem"
                  :key="indexitem"
                  cols="12"
                  class="pa-0"
                >
                  <v-text-field
                    :label="item.fieldName"
                    :value="item.fieldValue"
                    class="pa-0"
                    outlined
                    dense
                    readonly
                  ></v-text-field>
                  <!-- {{item.fieldName}} : {{item.fieldValue}} -->
                </v-col>
                <v-form ref="form_update" v-model="validUpdate" lazy-validation>
                  <div v-for="(p, index) in flowfieldNameitem" :key="index">
                    <div class="pa-0" v-if="p.conditionField === ''">
                      <div>
                        <div v-if="p.fieldType == 'text'">
                          <br />
                          <v-text-field
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="
                              p.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                            outlined
                          ></v-text-field>
                        </div>
                        <div v-if="p.fieldType == 'number'">
                          <br />
                          <!-- <p>{{p.fieldName}}</p> -->
                          <v-text-field
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="
                              p.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                            outlined
                          ></v-text-field>
                        </div>
                        <v-row>
                          <v-col
                            cols="12"
                            v-if="p.fieldType == 'Autocompletes'"
                            style="padding-top: 0px;padding-bottom: 0px;"
                          >
                            <br />
                            <v-autocomplete
                              v-model="p.fieldValue"
                              :items="JSON.parse(p.optionField)"
                              dense
                              filled
                              :label="p.fieldName"
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            ></v-autocomplete>
                          </v-col>
                          <v-col
                            cols="12"
                            v-if="p.fieldType == 'Selects'"
                            style="padding-top: 0px;padding-bottom: 0px;"
                          >
                            <br />
                            <div>
                              <v-select
                                v-model="p.fieldValue"
                                :items="JSON.parse(p.optionField)"
                                menu-props="auto"
                                :label="p.fieldName"
                                hide-details
                                outlined
                                dense
                                :rules="
                                  p.requiredField === 'True'
                                    ? [rules.required]
                                    : [true]
                                "
                              ></v-select>
                            </div>
                          </v-col>
                        </v-row>
                        <div v-if="p.fieldType == 'Radio'" style="padding:0px;">
                          <br />
                          <v-container fluid style="padding:0px;">
                            <v-radio-group
                              row
                              v-model="p.fieldValue"
                              style="margin:0px;"
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            >
                              <template v-slot:label> </template>
                              <div
                                v-for="radios in JSON.parse(p.optionField)"
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
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="
                        p.conditionField !== '' &&
                          flowfieldNameitem.filter(row => {
                            return row.fieldId === parseInt(p.conditionField);
                          }).length > 0
                      "
                    >
                      <div
                        v-if="
                          p.conditionValue ===
                            flowfieldNameitem.filter(row => {
                              return row.fieldId === parseInt(p.conditionField);
                            })[0].fieldValue
                        "
                      >
                        <div cols="12" v-if="p.fieldType == 'Autocompletes'">
                          <v-autocomplete
                            v-model="p.fieldValue"
                            :items="JSON.parse(p.optionField)"
                            dense
                            filled
                            :label="p.fieldName"
                            :rules="
                              p.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                          ></v-autocomplete>
                        </div>
                        <div v-if="p.fieldType == 'Selects'">
                          <v-select
                            v-model="p.fieldValue"
                            :items="JSON.parse(p.optionField)"
                            menu-props="auto"
                            :label="p.fieldName"
                            dense
                            hide-details
                            outlined
                            :rules="
                              p.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                          ></v-select>
                        </div>
                        <div
                          v-if="p.fieldType === 'Radio'"
                          style="padding:0px;"
                        >
                          <br />
                          <v-container fluid style="padding:0px;">
                            <v-radio-group
                              row
                              v-model="p.fieldValue"
                              style="margin:0px;"
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            >
                              <template v-slot:label> </template>
                              <div
                                v-for="radios in JSON.parse(p.optionField)"
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
                        </div>
                      </div>
                    </div>
                    <div v-if="p.conditionField === 'flow'">
                      <div
                        v-if="
                          parseInt(p.conditionValue) ===
                            parseInt(formAdd.flowId)
                        "
                      >
                        <div v-if="p.fieldType == 'text'">
                          <br />
                          <v-text-field
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="
                              p.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                            outlined
                          ></v-text-field>
                        </div>
                        <div v-if="p.fieldType == 'number'">
                          <br />
                          <v-text-field
                            v-model="p.fieldValue"
                            :label="p.fieldName"
                            dense
                            :rules="
                              p.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                            outlined
                          ></v-text-field>
                        </div>
                        <div cols="12" v-if="p.fieldType == 'Autocompletes'">
                          <v-autocomplete
                            v-model="p.fieldValue"
                            :items="JSON.parse(p.optionField)"
                            dense
                            filled
                            :label="p.fieldName"
                            :rules="
                              p.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                          ></v-autocomplete>
                        </div>
                        <div v-if="p.fieldType == 'Selects'">
                          <v-select
                            v-model="p.fieldValue"
                            :items="JSON.parse(p.optionField)"
                            menu-props="auto"
                            :label="p.fieldName"
                            dense
                            :rules="
                              p.requiredField === 'True'
                                ? [rules.required]
                                : [true]
                            "
                            hide-details
                            outlined
                          ></v-select>
                        </div>
                        <div
                          v-if="p.fieldType === 'Radio'"
                          style="padding:0px;"
                        >
                          <br />
                          <v-container fluid style="padding:0px;">
                            <v-radio-group
                              row
                              v-model="p.fieldValue"
                              style="margin:0px;"
                              :rules="
                                p.requiredField === 'True'
                                  ? [rules.required]
                                  : [true]
                              "
                            >
                              <template v-slot:label> </template>
                              <div
                                v-for="radios in JSON.parse(p.optionField)"
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
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <v-row>
                    <v-col cols="12" sm="6" md="6" lg="6" class="pb-0">
                      <v-text-field
                        readonly
                        v-model="dueDateText"
                        outlined
                        dense
                        label="วันที่นัดหมายลูกค้า"
                        prepend-inner-icon="mdi-calendar-multiple-check"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6">
                      <v-select
                        v-model="empSelectJob"
                        :items="empSelectStepAdd"
                        label="พนักงาน Onsite"
                        menu-props="auto"
                        outlined
                        required
                        :rules="[rules.required]"
                        dense
                        @change="checkEmpJob()"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row v-if="empSelectJob !== ''">
                    <v-col cols="12" class="pb-0 pt-0">
                      <v-sheet height="64">
                        <v-toolbar dense>
                          <v-btn
                            fab
                            text
                            small
                            color="grey darken-2"
                            @click="prev()"
                          >
                            <v-icon small>
                              mdi-chevron-left
                            </v-icon>
                          </v-btn>
                          <v-btn
                            fab
                            text
                            small
                            color="grey darken-2"
                            @click="next()"
                          >
                            <v-icon small>
                              mdi-chevron-right
                            </v-icon>
                          </v-btn>
                          <!-- <v-toolbar-title v-if="$refs.calendaronsite">{{
                          $refs.calendaronsite.title
                        }}</v-toolbar-title> -->
                          <v-toolbar-title>{{
                            monthNamesThai[parseInt(today.split("-")[1])] +
                              " " +
                              today.split("-")[0]
                          }}</v-toolbar-title>
                        </v-toolbar>
                      </v-sheet>
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="empSelectJob !== '' && checkEventInfo.length > 0"
                  >
                    <v-col cols="12" class="pb-0 pt-0">
                      <v-sheet>
                        <v-calendar
                          ref="calendaronsite"
                          :now="today"
                          v-model="today"
                          locale="th-TH"
                          color="primary"
                          type="month"
                        >
                          <!-- <template v-slot:day-label="{ day }">
                          <span style="font-size:26px !important;">{{day}}</span>
                        </template> -->
                          <template v-slot:day="{ date }">
                            <div v-if="eventInfo[date]">
                              <v-row>
                                <v-col class="text-center mb-1 mt-0">
                                  <v-badge
                                    avatar
                                    bordered
                                    overlap
                                    color="orange darken-1"
                                    v-if="eventInfo[date].sortNo1 > 0"
                                    class="mr-1"
                                    style="cursor: pointer"
                                    @click.native="
                                      openCalendaList(date, 'sortNo1')
                                    "
                                  >
                                    <template v-slot:badge>
                                      <v-avatar
                                        class="mb-1"
                                        color="orange darken-1"
                                      >
                                        {{ eventInfo[date].sortNo1 }}
                                      </v-avatar>
                                    </template>

                                    <v-avatar size="40" color="orange darken-3">
                                      <v-icon dark>
                                        mdi-water-plus
                                      </v-icon>
                                    </v-avatar>
                                  </v-badge>
                                  <v-badge
                                    avatar
                                    bordered
                                    overlap
                                    color="blue darken-1"
                                    v-if="eventInfo[date].sortNo2 > 0"
                                    class="mr-1"
                                    style="cursor: pointer"
                                    @click.native="
                                      openCalendaList(date, 'sortNo2')
                                    "
                                  >
                                    <template v-slot:badge>
                                      <v-avatar
                                        class="mb-1"
                                        color="blue darken-1"
                                      >
                                        {{ eventInfo[date].sortNo2 }}
                                      </v-avatar>
                                    </template>

                                    <v-avatar size="40" color="blue darken-3">
                                      <v-icon dark>
                                        mdi-water-check
                                      </v-icon>
                                    </v-avatar>
                                  </v-badge>
                                </v-col>
                              </v-row>
                            </div>
                          </template>
                        </v-calendar>
                      </v-sheet>
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="empSelectJob !== '' && checkEventInfo.length === 0"
                  >
                    <v-col cols="12" class="pb-0 pt-0">
                      <v-sheet>
                        <v-calendar
                          ref="calendaronsite"
                          :now="today"
                          v-model="today"
                          locale="th-TH"
                          color="primary"
                          type="month"
                        ></v-calendar>
                      </v-sheet>
                    </v-col>
                    <v-col cols="12">
                      <v-alert text type="success">
                        เดือน
                        <strong>{{
                          monthNamesThai[parseInt(today.split("-")[1])]
                        }}</strong>
                        พนักงานท่านนี้ <strong>ว่างงาน</strong>
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-form>
                <br />
                <template v-if="BookingDataItem.length > 0">
                  <div
                    class="text-center"
                    v-if="BookingDataItem[0].addressLatLong === null"
                  >
                    <v-alert dense outlined type="error">
                      <v-row align="center">
                        <v-col class="grow">
                          เนื่องจาก นัดหมายนี้ยังไม่มี แผนที่ กรุณานำ QR code
                          หรือ ส่งลิงค์ ให้ลูกค้ากรอกด้วย !!
                        </v-col>
                        <v-col class="shrink">
                          <v-btn
                            tile
                            color="success"
                            @click="getQrCOde(BookingDataItem[0])"
                          >
                            <v-icon left>
                              mdi-qrcode-scan
                            </v-icon>
                            เปิด QR Code
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-alert>
                  </div>
                  <div class="text-center">
                    <v-btn
                      elevation="2"
                      v-if="BookingDataItem[0].addressLatLong !== null"
                      small
                      dark
                      color="#173053"
                      @click="addEmpJob()"
                    >
                      <v-icon left>mdi-checkbox-marked-circle</v-icon>
                      มอบหมายงาน
                    </v-btn>
                    <v-btn
                      small
                      color="red"
                      dark
                      @click="
                        (dialogOnsite = false),
                          getDataDefault(),
                          (searchOther = ''),
                          (showColorSearch = false),
                          (statusSearch = 'no'),
                          (empSelectJob = '')
                      "
                    >
                      <v-icon color="#173053">mdi-close</v-icon> ยกเลิก
                    </v-btn>
                  </div>
                </template>
              </v-container>
            </v-card-text>
            <v-card-text v-if="!dataEditJobReady">
              <v-container>
                <div class="text-center">
                  <waitingAlert></waitingAlert>
                </div>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogQrCode" persistent :max-width="dialogwidth">
          <v-card
            style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);"
          >
            <v-container>
              <v-row>
                <v-col cols="12">
                  <div class=" text-center">
                    <br />
                    <br />
                    <h2 style="font-weight: 900; color:#FFA000">
                      QR Code และ Link สำหรับ รับที่อยู่ลูกค้า !
                    </h2>
                    <qrcode-vue
                      :value="value"
                      :size="size"
                      level="H"
                      :foreground="foreground"
                    />
                    <v-row align-content="center">
                      <v-col cols="12" class="pb-0">
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
                      <v-col cols="6" class="text-center">
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
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <v-row>
              <v-col cols="12">
                <v-container class="text-center">
                  <v-btn
                    small
                    class="ma-2"
                    color="error"
                    @click="dialogQrCode = false"
                    dark
                  >
                    ปิดหน้านี้
                    <v-icon dark right>
                      mdi-minus-circle
                    </v-icon>
                  </v-btn>
                </v-container>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogChangeOnsite"
          persistent
          :max-width="dialogwidth"
        >
          <v-card
            style="background: linear-gradient(180deg, #FFFFFF 0%, #E1F3FF 100%);"
          >
            <v-container>
              <v-row>
                <v-col cols="12" v-if="sortNo === 1">
                  <div class=" text-center">
                    <br />
                    <br />
                    <h2 style="font-weight: 900; color:#FFA000">
                      เปลี่ยนพนักงาน Onsite!
                    </h2>
                    <v-row>
                      <v-col cols="12">
                        <v-select
                          v-model="empSelectJob"
                          :items="empSelectStepAdd"
                          label="พนักงาน Onsite"
                          menu-props="auto"
                          outlined
                          required
                          :rules="[rules.required]"
                          dense
                          @change="checkEmpJob()"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row v-if="empSelectJob !== ''">
                      <v-col cols="12" class="pb-0 pt-0">
                        <v-sheet height="64">
                          <v-toolbar dense>
                            <v-btn
                              fab
                              text
                              small
                              color="grey darken-2"
                              @click="prev()"
                            >
                              <v-icon small>
                                mdi-chevron-left
                              </v-icon>
                            </v-btn>
                            <v-btn
                              fab
                              text
                              small
                              color="grey darken-2"
                              @click="next()"
                            >
                              <v-icon small>
                                mdi-chevron-right
                              </v-icon>
                            </v-btn>
                            <!-- <v-toolbar-title v-if="$refs.calendaronsite">{{
                                $refs.calendaronsite.title
                              }}</v-toolbar-title> -->
                            <v-toolbar-title>{{
                              monthNamesThai[parseInt(today.split("-")[1])] +
                                " " +
                                today.split("-")[0]
                            }}</v-toolbar-title>
                          </v-toolbar>
                        </v-sheet>
                      </v-col>
                    </v-row>
                    <v-row
                      v-if="empSelectJob !== '' && checkEventInfo.length > 0"
                    >
                      <v-col cols="12" class="pb-0 pt-0">
                        <v-sheet>
                          <v-calendar
                            ref="calendaronsite"
                            :now="today"
                            v-model="today"
                            locale="th-TH"
                            color="primary"
                            type="month"
                          >
                            <!-- <template v-slot:day-label="{ day }">
                                <span style="font-size:26px !important;">{{day}}</span>
                              </template> -->
                            <template v-slot:day="{ date }">
                              <div v-if="eventInfo[date]">
                                <v-row>
                                  <v-col class="text-center mb-1 mt-0">
                                    <v-badge
                                      avatar
                                      bordered
                                      overlap
                                      color="orange darken-1"
                                      v-if="eventInfo[date].sortNo1 > 0"
                                      class="mr-1"
                                      style="cursor: pointer"
                                      @click.native="
                                        openCalendaList(date, 'sortNo1')
                                      "
                                    >
                                      <template v-slot:badge>
                                        <v-avatar
                                          class="mb-1"
                                          color="orange darken-1"
                                        >
                                          {{ eventInfo[date].sortNo1 }}
                                        </v-avatar>
                                      </template>

                                      <v-avatar
                                        size="40"
                                        color="orange darken-3"
                                      >
                                        <v-icon dark>
                                          mdi-water-plus
                                        </v-icon>
                                      </v-avatar>
                                    </v-badge>
                                    <v-badge
                                      avatar
                                      bordered
                                      overlap
                                      color="blue darken-1"
                                      v-if="eventInfo[date].sortNo2 > 0"
                                      class="mr-1"
                                      style="cursor: pointer"
                                      @click.native="
                                        openCalendaList(date, 'sortNo2')
                                      "
                                    >
                                      <template v-slot:badge>
                                        <v-avatar
                                          class="mb-1"
                                          color="blue darken-1"
                                        >
                                          {{ eventInfo[date].sortNo2 }}
                                        </v-avatar>
                                      </template>

                                      <v-avatar size="40" color="blue darken-3">
                                        <v-icon dark>
                                          mdi-water-check
                                        </v-icon>
                                      </v-avatar>
                                    </v-badge>
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-calendar>
                        </v-sheet>
                      </v-col>
                    </v-row>
                    <v-row
                      v-if="empSelectJob !== '' && checkEventInfo.length === 0"
                    >
                      <v-col cols="12" class="pb-0 pt-0">
                        <v-sheet>
                          <v-calendar
                            ref="calendaronsite"
                            :now="today"
                            v-model="today"
                            locale="th-TH"
                            color="primary"
                            type="month"
                          ></v-calendar>
                        </v-sheet>
                      </v-col>
                      <v-col cols="12">
                        <v-alert text type="success">
                          เดือน
                          <strong>{{
                            monthNamesThai[parseInt(today.split("-")[1])]
                          }}</strong>
                          พนักงานท่านนี้ <strong>ว่างงาน</strong>
                        </v-alert>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="12" v-if="sortNo !== 1">
                  <div class=" text-center">
                    <v-alert outlined type="error">
                      รายการนี้ได้เริ่มงานไปแล้ว !!
                    </v-alert>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <v-row>
              <v-col cols="12" class="text-center">
                <v-btn
                  small
                  class="ma-2"
                  v-if="sortNo === 1"
                  color="primary"
                  @click="jobChangeOnsite()"
                  dark
                >
                  เปลี่ยนพนักงาน
                  <v-icon dark right>
                    mdi-checkbox-marked-circle
                  </v-icon>
                </v-btn>
                <v-btn
                  small
                  class="ma-2"
                  color="error"
                  @click="
                    (dialogChangeOnsite = false),
                      getDataDefault(),
                      (searchOther = ''),
                      (showColorSearch = false),
                      (statusSearch = 'no'),
                      (empSelectJob = '')
                  "
                  dark
                >
                  ปิด
                  <v-icon dark right>
                    mdi-minus-circle
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogCalenda" width="600">
          <v-card>
            <v-card-title class="text-h6 grey lighten-2">
              รายชื่อลูกค้านัดหมาย
            </v-card-title>
            <br />
            <template v-for="(sumItems, index1) in dataSummary">
              <!-- {{sumItems}} -->
              <v-row v-bind:key="'sum' + index1" no-gutters>
                <template v-for="(items, index2) in sumItems">
                  <v-col cols="auto" v-bind:key="'sum' + index1 + index2">
                    <v-chip
                      class="ma-2"
                      :color="index1 + ' darken-2'"
                      text-color="white"
                    >
                      <v-avatar left :class="index1 + ' darken-4'">
                        {{ items.length }}
                      </v-avatar>
                      {{ index2 }}
                    </v-chip>
                  </v-col>
                </template>
              </v-row>
            </template>
            <v-card-text v-for="(items, index) in dataCalendar" :key="index">
              <v-card elevation="2">
                <v-list-item
                  :style="
                    items.bgcolor
                      ? 'background-color:' + items.bgcolor + ' !important'
                      : ''
                  "
                >
                  <v-list-item-content>
                    <v-row style="color:#fff;">
                      <v-col cols="3">
                        <!-- <h3>{{items.timeDue}}</h3><br> -->
                        <h3>{{ items.timeDue }}</h3>
                        <br />
                        <v-icon dark class="mr-1" v-if="items.sortNo === 1">
                          mdi-water-plus
                        </v-icon>
                        <v-icon
                          dark
                          class="mr-1"
                          v-else-if="items.sortNo === 2"
                        >
                          mdi-water-check
                        </v-icon>
                        <v-icon dark class="mr-1" v-else>
                          mdi-clock-outline
                        </v-icon>
                      </v-col>
                      <v-col cols="9">
                        <v-row>
                          <v-col cols="8"
                            ><h4>คุณ {{ items.name }}</h4></v-col
                          >
                          <v-col
                            cols="10"
                            v-if="items.memberDataTag.length > 0"
                            class="pt-0 pb-0"
                          >
                            <v-chip
                              v-for="(tag, index) in items.tagDataShow"
                              :key="index"
                              class="mr-2 mb-2"
                            >
                              {{ tag.text }}
                            </v-chip>
                          </v-col>
                          <v-col cols="4" class="text-right">{{
                            items.licenseNo
                          }}</v-col>
                        </v-row>
                        โทร {{ items.tel }}
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialogCalenda = false">
                ยืนยัน
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogShowDeposit"
          persistent
          :max-width="dialogwidth"
        >
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="6" class="text-left pt-10">
                  <h3><strong>เรียกเก็บค่าบริการเพื่อจอง</strong></h3>
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
                      @click="dialogShowDeposit = false"
                    >
                      X
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row align-content="center">
                <v-col cols="12" class="pb-0">
                  <v-textarea
                    v-model="datailLinkDeposit"
                    outlined
                    label="ข้อความ"
                    rows="4"
                    row-height="6"
                    dense
                  ></v-textarea>
                  <v-text-field
                    v-show="dialogShowDeposit === false"
                    v-model="depositLink"
                    label="ลิงค์ มัดจำ"
                    solo
                    disabled
                    id="myInputDeposit"
                    dense
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0" v-if="statusdepositPrice">
                  <VuetifyMoney
                    v-model="depositPrice"
                    placeholder="ค่าใช้จ่าย"
                    dense
                    label="ค่าใช้จ่าย"
                    outlined
                    v-bind:options="options2"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-btn
                    :color="copyTextStatus === false ? '#1B437C' : 'teal'"
                    large
                    block
                    dark
                    v-clipboard:copy="copyTextBt"
                    @click="
                      copyTextStatus === false
                        ? FunCopyDeposit()
                        : copyFallback()
                    "
                  >
                    <v-icon left dark>
                      {{
                        copyTextStatus === false
                          ? "mdi-update"
                          : "mdi-content-copy"
                      }}
                    </v-icon>
                    {{ copyTextStatus === false ? "บันทึก" : "คัดลอกข้อความ" }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogShowEmpReport" persistent max-width="80%">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="6" class="text-left pt-10">
                  <h3><strong>รายการนัดหมายตามช่าง</strong></h3>
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
                      @click="dialogShowEmpReport = false"
                    >
                      X
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-menu
                    ref="menu"
                    v-model="menuShowEmpReport"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        hide-details
                        background-color="white"
                        v-model="dateStartShowEmpReport"
                        style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                        label="วัน/เดือน/ปี นัดหมาย"
                        readonly
                        outlined
                        dense
                        v-bind="attrs"
                        v-on="on"
                      >
                        <template #prepend-inner>
                          <v-icon
                            color="#69D1FD"
                            style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                          >
                            mdi-calendar
                          </v-icon>
                        </template></v-text-field
                      >
                    </template>
                    <v-date-picker
                      @input="
                        (menuShowEmpReport = false), getBookingShowEmpList()
                      "
                      v-model="dateStartShowEmpReport"
                      no-title
                      scrollable
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6" v-if="dataShowEmpReport.length > 0">
                  <v-btn
                    color="teal"
                    dark
                    style="border-radius: 20px !important;margin-right: 0px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                    @click="exportShowEmpReport()"
                  >
                    <v-icon color="white" left>mdi-microsoft-excel</v-icon>
                    ส่งออกเป็น Excel
                  </v-btn>
                </v-col>
                <!-- <v-col cols="6" v-if="dataEmpShowEmpReport.length > 0">
                      <v-select
                        v-model="searchEmpShowEmpReport"
                        background-color="white"
                        style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                        hide-details
                        :items="dataEmpShowEmpReport"
                        label="พนักงาน"
                        outlined
                        dense
                        required
                        ><template #prepend-inner>
                          <v-icon color="#69D1FD" style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                            mdi-map-marker-outline
                          </v-icon>
                        </template></v-select>
                    </v-col> -->
                <v-col cols="12">
                  <v-data-table
                    :search="searchEmpShowEmpReport"
                    :headers="headersShowEmpReport"
                    :items="dataShowEmpReport"
                    item-key="bookNo"
                    sort-by="dueDate"
                    group-by="bookingEmpFlowName"
                    class="elevation-1"
                    show-group-by
                    hide-default-footer
                    disable-pagination
                  >
                    <!-- <template v-slot:[`item.statusBt`]="{ item }">
                          <v-chip
                            filter
                            dark
                            v-if="item.statusBt === 'confirm'"
                            color="#97DDBB"
                          >
                            {{dataTypeProcess2}}
                          </v-chip>
                          <v-chip
                            filter
                            dark
                            v-if="item.statusBt === 'confirmJob'"
                            color="#E5B5D8"
                          >
                            {{dataTypeProcess4}}
                          </v-chip>
                          <v-chip
                            filter
                            dark
                            v-if="item.statusBt === 'wait'"
                            color="#97DDBB"
                          >
                            {{dataTypeProcess1}}
                          </v-chip>
                        </template> -->
                    <template v-slot:group="{ items }">
                      <tr
                        @click="toggleShowEmpList(items[0].bookingEmpFlowName)"
                        style="background-color:#CFD8DC;"
                      >
                        <td class="text-xs-right">
                          <strong>{{ items[0].bookingEmpFlowName }}</strong>
                        </td>
                        <td class="text-xs-right"></td>
                        <td class="text-xs-right"></td>
                        <td class="text-xs-right"></td>
                        <td class="text-xs-right"></td>
                        <td class="text-xs-right"></td>
                      </tr>
                      <tr
                        v-for="item in items"
                        :key="item.bookNo"
                        v-show="!item.hide"
                      >
                        <td
                          v-for="(header, index) in headersShowEmpReport"
                          :key="index"
                        >
                          <p v-if="header.value !== 'statusBt'">
                            {{ item[header.value] }}
                          </p>
                          <template v-else>
                            <v-chip
                              filter
                              dark
                              v-if="item['statusBt'] === 'confirm'"
                              color="#97DDBB"
                            >
                              {{ dataTypeProcess2 }}
                            </v-chip>
                            <v-chip
                              filter
                              dark
                              v-if="item['statusBt'] === 'confirmJob'"
                              color="#E5B5D8"
                            >
                              {{ dataTypeProcess4 }}
                            </v-chip>
                            <v-chip
                              filter
                              dark
                              v-if="item['statusBt'] === 'wait'"
                              color="#FEAE34"
                            >
                              {{ dataTypeProcess1 }}
                            </v-chip>
                          </template>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogConfirmCancel" max-width="90%">
          <v-card class="text-center">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="10" class="text-left pt-10">
                    <h3><strong>ยืนยันรายการนี้</strong></h3>
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
                        @click="dialogConfirmCancel = false"
                      >
                        X
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pt-0 pb-0">
                    <v-select
                      v-model="flowSelectCancel"
                      :items="dataFlowCancel"
                      label="เลือกประเภทบริการ"
                      menu-props="auto"
                      outlined
                      dense
                      @change="
                        getEmpCancel(masBranchID),
                          (flowIDLimit = flowSelectCancel),
                          (bookingEmpFlowCancel = ''),
                          (fromAddTimeCus = ''),
                          (formChangeDateCancel = '')
                      "
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="pt-0 pb-0">
                    <v-select
                      v-model="bookingEmpFlowCancel"
                      :items="dataEmpCancel"
                      label="พนักงานช่าง"
                      menu-props="auto"
                      outlined
                      required
                      :rules="[rules.required]"
                      dense
                      @change="
                        checkTimeCancel(),
                          SetallowedDatesChangeCancel(bookingEmpFlowCancel),
                          (formChangeDateCancel = ''),
                          (fromAddTimeCus = ''),
                          checkCustomerTimeSlotCancel(),
                          (flowIDLimit = flowSelectCancel)
                      "
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="pt-0 pb-0">
                    <v-select
                      v-if="
                        customerTimeSlot === 'True' &&
                          bookingEmpFlowCancel !== '' &&
                          timeSlotbyCustomer.length > 1
                      "
                      v-model="fromAddTimeCus"
                      :items="timeSlotbyCustomer"
                      label="จำนวนชั่วโมง"
                      outlined
                      dense
                      required
                      :rules="[rules.required]"
                      @change="
                        (formChangeDateCancel = ''),
                          AddallowedDatesBysetTimebydayCancel()
                      "
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="pt-0 pb-0">
                    <v-menu
                      v-model="menuDateChangeCancel"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="formChangeDateCancel"
                          label="วันที่"
                          prepend-icon="mdi-calendar"
                          readonly
                          outlined
                          dense
                          v-bind="attrs"
                          v-on="on"
                          required
                          :rules="[rules.required]"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="formChangeDateCancel"
                        :allowed-dates="allowedDatesChangeCancel"
                        @change="setLimitBookingCancel(formChangeDateCancel)"
                        @input="menuDateChangeCancel = false"
                        :min="
                          new Date(
                            Date.now() - new Date().getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .substr(0, 10)
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    class="pt-0 pb-0"
                    v-if="formChangeDateCancel != ''"
                  >
                    <v-select
                      v-model="formChangeTimeCancel"
                      :items="timeavailableCancel"
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
                <v-row>
                  <v-col cols="12" class="pt-0 pb-0">
                    <v-select
                      v-model="empSelectCancel"
                      :items="empSelectStep"
                      label="พนักงานที่รับนัดหมาย"
                      menu-props="auto"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
                <div class="text-center">
                  <v-btn
                    elevation="2"
                    color="#173053"
                    dark
                    large
                    block
                    @click="onConfirmCancel(dataConfirmCancel)"
                    >ยืนยันรายการนี้</v-btn
                  >
                </div>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogShowMenuReport" persistent max-width="80%">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="6" class="text-left pt-10">
                  <h3><strong>รายการนัดหมาย</strong></h3>
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
                      @click="dialogShowMenuReport = false"
                    >
                      X
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-menu
                    ref="menu"
                    v-model="menuShowMenuReport"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        hide-details
                        background-color="white"
                        v-model="dateStartShowMenuReport"
                        style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                        label="วัน/เดือน/ปี นัดหมาย"
                        readonly
                        outlined
                        dense
                        v-bind="attrs"
                        v-on="on"
                      >
                        <template #prepend-inner>
                          <v-icon
                            color="#69D1FD"
                            style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                          >
                            mdi-calendar
                          </v-icon>
                        </template></v-text-field
                      >
                    </template>
                    <v-date-picker
                      @input="
                        (menuShowMenuReport = false), getBookingShowMenuList()
                      "
                      v-model="dateStartShowMenuReport"
                      no-title
                      scrollable
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6">
                  <v-select
                    style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                    v-model="flowSelectMenu"
                    hide-details
                    background-color="white"
                    :items="DataFlowNameMenu"
                    label="ประเภทบริการ"
                    outlined
                    dense
                    @change="getBookingShowMenuList()"
                  >
                    <template #prepend-inner>
                      <v-icon
                        color="#69D1FD"
                        style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;"
                      >
                        mdi-note-text-outline
                      </v-icon>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="6" v-if="dataShowMenuReport.length > 0">
                  <v-btn
                    color="teal"
                    dark
                    style="border-radius: 20px !important;margin-right: 0px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                    @click="exportShowMenuReport()"
                  >
                    <v-icon color="white" left>mdi-microsoft-excel</v-icon>
                    ส่งออกเป็น Excel
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-data-table
                    :search="searchShowMenuReport"
                    :headers="headersShowMenuReport"
                    :items="dataShowMenuReport"
                    item-key="bookNo"
                    sort-by="dueDate"
                    group-by="cusNameTel"
                    class="elevation-1"
                    show-group-by
                    hide-default-footer
                  >
                    <template v-slot:group="{ items }">
                      <tr
                        @click="toggleShowMenuList(items[0].cusNameTel)"
                        style="background-color:#CFD8DC;"
                      >
                        <td class="text-xs-right">
                          <strong>{{ items[0].cusNameTel }}</strong>
                        </td>
                        <td class="text-xs-right"></td>
                        <td class="text-xs-right"></td>
                        <td class="text-xs-right"></td>
                      </tr>
                      <tr
                        v-for="item in items"
                        :key="item.bookNo"
                        v-show="!item.hide"
                      >
                        <td
                          v-for="(header, index) in headersShowMenuReport"
                          :key="index"
                        >
                          <p v-if="header.value !== 'statusBt'">
                            {{
                              header.value === "menuPrice"
                                ? formatNumber(item[header.value])
                                : item[header.value]
                            }}
                          </p>
                          <template v-else>
                            <v-chip
                              filter
                              dark
                              v-if="item['statusBt'] === 'confirm'"
                              color="#97DDBB"
                            >
                              {{ dataTypeProcess2 }}
                            </v-chip>
                            <v-chip
                              filter
                              dark
                              v-if="item['statusBt'] === 'confirmJob'"
                              color="#E5B5D8"
                            >
                              {{ dataTypeProcess4 }}
                            </v-chip>
                            <v-chip
                              filter
                              dark
                              v-if="item['statusBt'] === 'wait'"
                              color="#FEAE34"
                            >
                              {{ dataTypeProcess1 }}
                            </v-chip>
                          </template>
                        </td>
                      </tr>
                      <tr
                        v-for="item in items"
                        :key="item.bookingId"
                        v-show="!item.hide"
                      >
                        <td class="text-xs-right" colspan="4">
                          <div style="align-items: center;width:100%;">
                            <v-row>
                              <v-col
                                cols="4"
                                v-for="(itemss, id) in item.menuItem.filter(
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
                                    :src="itemss.picture"
                                  ></v-img>
                                  <v-row>
                                    <v-col
                                      cols="12"
                                      class="textTitelMenu pb-0 pt-0"
                                      >{{ itemss.name }}</v-col
                                    >
                                    <v-col
                                      cols="12"
                                      style="display: flex;justify-content: flex-end;"
                                      class="textTitelMenu pb-0 pt-0"
                                      >{{ itemss.qty }} x
                                      {{ formatNumber(itemss.price) }}</v-col
                                    >
                                    <v-col
                                      cols="12"
                                      class="textTitelMenu pb-0 pt-0"
                                      >{{ itemss.remark }}</v-col
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
                                    >{{ formatNumber(item.menuPrice) }}</v-col
                                  >
                                </v-row>
                              </v-col>
                            </v-row>
                          </div>
                        </td>
                      </tr>
                    </template>
                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length">
                        <div style="align-items: center;width:100%;">
                          <v-row>
                            <v-col
                              cols="12"
                              v-for="(items, id) in item.menuItem.filter(el => {
                                return parseInt(el.qty) > 0;
                              })"
                              :key="id"
                              style="display: flex;"
                            >
                              <v-card class="cardMenu">
                                <v-img
                                  class="pictureMenu"
                                  :src="items.picture"
                                ></v-img>
                                <v-row>
                                  <v-col
                                    cols="12"
                                    class="textTitelMenu pb-0 pt-0"
                                    >{{ items.name }}</v-col
                                  >
                                  <v-col
                                    cols="12"
                                    style="display: flex;justify-content: flex-end;"
                                    class="textTitelMenu pb-0 pt-0"
                                    >{{ items.qty }} x
                                    {{ formatNumber(items.price) }}</v-col
                                  >
                                  <v-col
                                    cols="12"
                                    class="textTitelMenu pb-0 pt-0"
                                    >{{ items.remark }}</v-col
                                  >
                                </v-row>
                              </v-card>
                            </v-col>
                            <v-col cols="12">
                              <v-row>
                                <v-col cols="6"
                                  ><p class="ma-0 textTitelPriceMenu">
                                    "รวมราคา"
                                  </p></v-col
                                >
                                <v-col
                                  cols="6"
                                  style="display: flex;justify-content: flex-end;"
                                  class="textTitelPriceMenu"
                                  >{{ formatNumber(item.menuPrice) }}</v-col
                                >
                              </v-row>
                            </v-col>
                          </v-row>
                        </div>
                      </td>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogMenu" persistent :max-width="dialogwidth">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="6" class="text-left pt-10">
                  <h3><strong>รายการเมนู</strong></h3>
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
                      @click="dialogMenu = false"
                    >
                      X
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="12" v-if="dataMenu.length > 0">
                  <div
                    style="'width:100% !important';background: linear-gradient(90deg, #FCFCFC 0%, #F7F7F7 10.04%, #F7F7F7 51.56%, #F7F7F7 89.58%, #FCFCFC 100%);box-shadow: 0px 4px 20px rgba(114, 114, 114, 0.1);"
                  >
                    <div
                      style="align-items: center;width:100%;height:600px;overflow-y: scroll;"
                    >
                      <v-row>
                        <v-col
                          cols="12"
                          v-for="(item, id) in dataMenu"
                          :key="id"
                          style="display: flex;"
                        >
                          <v-card class="cardMenuEdit">
                            <v-img
                              class="pictureMenuEdit"
                              :src="item.picture"
                            ></v-img>
                            <div class="cardTextMenu">
                              <div>
                                <p class="ma-0 textTitelMenu">
                                  {{ item.name }}
                                </p>
                                <!-- <p class="ma-0 textSubTitelMenu">{{ item.nameSub.length < 20 ? item.nameSub : (item.nameSub.substring(0,20) + '..') }}</p> -->
                                <p
                                  class="ma-0 textSubTitelMenu"
                                  v-if="item.nameSub.length < 20"
                                >
                                  {{ item.nameSub }}
                                </p>
                                <p class="ma-0 textSubTitelMenu" v-else>
                                  {{ item.nameSub.substring(0, 20) + ".." }}
                                </p>
                                <br />
                                <p class="ma-0 textPriceMenu">
                                  {{ formatNumber(item.price) + " บาท" }}
                                </p>
                                <!-- <p>{{item.nameSub}}</p> -->
                                <v-text-field
                                  v-if="parseInt(item.qty) > 0"
                                  v-model="item.remark"
                                  label="หมายเหตุ"
                                  single-line
                                  hide-details
                                  dense
                                  class="pl-0"
                                ></v-text-field>
                              </div>
                            </div>
                            <div class="buttomMenu">
                              <v-btn
                                icon
                                x-small
                                color="#FF7B2C"
                                class="buttomMenuplusmins"
                                @click="changeCounter('-1', item)"
                              >
                                <v-icon dark>
                                  mdi-minus
                                </v-icon>
                              </v-btn>
                              {{ item.qty }}
                              <v-btn
                                icon
                                x-small
                                color="#FF7B2C"
                                class="buttomMenuplusmins "
                                @click="changeCounter('1', item)"
                              >
                                <v-icon dark>
                                  mdi-plus
                                </v-icon>
                              </v-btn>
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </div>
                    <div class="sendOrder">
                      <v-card
                        width="100%"
                        height="58px"
                        class="display: flex;align-items: center;"
                        style="border-radius: 16px;"
                      >
                        <v-container>
                          <v-row>
                            <v-col cols="6">รวมราคา</v-col>
                            <v-col cols="6" class="text-right">{{
                              formatNumber(priceMenu)
                            }}</v-col>
                          </v-row>
                        </v-container>
                      </v-card>
                    </div>
                    <hr />
                    <v-row>
                      <v-col cols="12">
                        <v-btn
                          color="#1B437C"
                          large
                          block
                          dark
                          @click="updateMenu()"
                        >
                          อัพเดทรายการเมนู
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        <button class="copyTextCopy" :data-clipboard-text="copyTextCopy">
          {{ copyTextCopy }}
        </button>
        <RetureDeposit ref="RetureDeposit"></RetureDeposit>
        <CallLog ref="CallLog"></CallLog>
        <NotificationService ref="NotificationService"></NotificationService>
        <GoogleCalendarCmp ref="GoogleCalendarRef" />
      </div>
    </v-main>
  </div>
</template>
<script>
import axios from 'axios' // api
import draggable from 'vuedraggable'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import VuetifyMoney from '../VuetifyMoney.vue'
import JsonExcel from 'vue-json-excel' // https://www.npmjs.com/package/vue-json-excel
import XLSX from 'xlsx' // import xlsx
import readXlsxFile from 'read-excel-file'
import DateRangePicker from 'vue2-daterange-picker'
// you need to import the CSS manually
import QrcodeVue from 'qrcode.vue'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
// import { PivotTable } from '@click2buy/vue-pivot-table'
import moment from 'moment-timezone'
import BookingQueue from './BookingQueue.vue'
import CalendarBooking from './CalendarBookingList.vue'
import waitingAlert from '../waitingAlert.vue'
import RetureDeposit from '../BookingListComponents/RetureDeposit.vue'
import CallLog from '../BookingListComponents/CallLog.vue'
import NotificationService from '../BookingListComponents/NotificationService.vue'
import sideMenu from '../Menu/sideMenu.vue'
import GoogleCalendarCmp from '../Core/GoogleCalendarCmp.vue'
// import copy from 'copy-to-clipboard'

export default {
  name: 'BookingListBeauty',
  components: {
    draggable,
    'left-menu-admin': adminLeftMenu,
    DateRangePicker,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile,
    VuetifyMoney,
    QrcodeVue,
    // PivotTable,
    BookingQueue,
    CalendarBooking,
    waitingAlert,
    RetureDeposit,
    CallLog,
    NotificationService,
    sideMenu,
    GoogleCalendarCmp
  },
  computed: {
    filteredSelect () {
      return this.dataItemSelect.filter(d => {
        return (
          this.filters.length < 1 ||
          d['dueDate']
            .toString()
            .toLowerCase()
            .includes(this.filters.toLowerCase())
        )
        // return Object.keys(this.filters).every(f => {
        // f is search column
        // this.filters[f] is the current search string entered by user
        // d[f] is the entry being tested against the search string
        //   return this.filters[f].length < 1 || d[f].toString().toLowerCase().includes(this.filters[f].toLowerCase())
        // })
      })
    },
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
    },
    dialogwidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '70%'
        case 'sm':
          return '60%'
        case 'md':
          return '50%'
        case 'lg':
          return '50%'
        case 'xl':
          return '50%'
      }
    },
    resCol () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'xs'
        case 'sm':
          return 'sm'
        case 'md':
          return 'md'
        case 'lg':
          return 'lg'
        case 'xl':
          return 'xl'
      }
      console.log(
        'this.$vuetify.breakpoint.name',
        this.$vuetify.breakpoint.name
      )
    }
  },
  data () {
    let startDate = null
    let endDate = null
    return {
      copyTextCopy: '',
      // menu
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
      expandedMenu: [],
      headersShowMenuReport: [
        {
          text: 'สถานะ',
          groupable: false,
          value: 'statusBt'
        },
        // { text: 'ชื่อลูกค้า', value: 'cusName', sortable: false, groupable: false }
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
        // { text: 'เบอร์โทร', value: 'tel', sortable: false, groupable: false }
      ],

      listFilterCloseJob: ['ทั้งหมด', 'ยังไม่ปิดงาน', 'ปิดงาน'],
      filterCloseJobValue: 'ทั้งหมด',
      // confirm (Cancel)
      flowSelectCancel: '',
      dataFlowCancel: [],
      bookingEmpFlowCancel: '',
      dataEmpCancel: [],
      menuDateChangeCancel: false,
      formChangeDateCancel: '',
      formChangeTimeCancel: '',
      timeavailableCancel: [],
      empSelectCancel: '',
      dataConfirmCancel: [],
      EmpItemLimitCancel: [],
      //
      dialogConfirmCancel: false,
      searchEmpShowEmpReport: null,
      dataShowEmpReport: [],
      dataEmpShowEmpReport: [],
      BookingDataListShowEmpReport: [],
      headersShowEmpReport: [
        {
          text: 'สถานะ',
          groupable: false,
          value: 'statusBt'
        },
        // {
        //   text: 'ชื่อพนักงาน',
        //   // align: 'start',
        //   value: 'bookingEmpFlowName'
        // },
        {
          text: 'ชื่อลูกค้า',
          value: 'cusName',
          sortable: false,
          groupable: false
        },
        {
          text: 'วันที่/เวลา',
          value: 'dueDateFix',
          sortable: false,
          groupable: false
        },
        {
          text: 'บริการ',
          value: 'flowName',
          sortable: false,
          groupable: false
        },
        { text: 'เบอร์โทร', value: 'tel', sortable: false, groupable: false },
        { text: 'หมายเหตุ', value: 'remark', sortable: false, groupable: false }
      ],
      dialogShowEmpReport: false,
      menuShowEmpReport: false,
      dateStartShowEmpReport: '',
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
      sortSelect: null,
      itemsSort: [
        'เรียงตามวันที่นัดหมาย',
        'เรียงตามวันที่เปลี่ยนสถานะ',
        'เรียงตามวันที่สร้าง'
      ],
      itemsSortWaiting: ['เรียงตามวันที่นัดหมาย', 'เรียงตามวันที่สร้าง'],
      sort: null,
      events: [],
      dialogCalenda: false,

      srcUpload: '',
      dialogShowFileUpload: false,
      pickerDate: null,
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
        precision: 0
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
      memberName: '',
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
        // 'วันที่ แจ้งเปลี่ยน': 'changDateBt',
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
        // direction: 'ltr',
        format: 'yyyy-mm-dd',
        // separator: ' - ',
        applyLabel: 'ยืนยัน',
        cancelLabel: 'ยกเลิก',
        // weekLabel: 'W',
        // customRangeLabel: 'Custom Range',
        // daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
        // monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
      DataflowId: '',
      tagItemSelect: [],
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
      // Data Table Config
      searchAll2: '',
      columns: [
        { text: 'จัดการ', value: 'action', sortable: false, align: 'center' },
        // { text: 'Booking Id', value: 'bookNo' },
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
        // { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
      ],
      columnsSelected: [],
      dataItem: [],
      dataItemCheck: [],
      dataexport: [],
      dataItemSelect: [],
      editedItemSeleteField: [],
      jobitem: [],
      // End Data Table Config
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
        depositPrice: 0,
        bookingEmpFlow: ''
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
        radiosRemark: '',
        bookingEmpFlow: ''
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
      // Dialog Config ADD EDIT DELETE IMPORT
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
      // window_open: true,
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
      empIdOld: '',
      masBranchIDLimit: '',
      flowIDLimit: '',
      dateDayoff: [],
      dateDayCustom: [],
      dateDaylimit: [],
      flowItemLimit: [],
      checkLimitBooking: {
        ID: '',
        countBooking: null,
        limitCheck: null,
        limitBooking: 0,
        timeSelect: [],
        timeBooking: [],
        slotByflow: ''
      },
      dataEdit: '',
      statusShowDateConfiremjob: true,
      memberId: '',
      masBranchIDOldEdit: '',
      flowIdOldEdit: '',
      Redirect: '',
      dialogShowDeposit: false,
      depositLink: '',
      datailLinkDeposit: '',
      depositPrice: 0,
      statusdepositPrice: false,
      statusBranchReadonly: false,
      dataEmpAdd: [],
      dataEmpAllAdd: [],
      EmpItemLimitAdd: [],
      dataEmpChange: [],
      dataEmpAllChange: [],
      EmpItemLimitChange: [],
      bookingEmpFlow: '',
      timeSlotbyCustomer: [],
      customerTimeSlot: 'False',
      fromAddTimeCus: '',
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
      dataCoin: [],
      memberTel: '',
      productExchangeRateId: '',
      statusGoogleCalendar: '',
      statusGoogleCalendarEmp: '',
      copyTextBt: '',
      copyTextStatus: false,
      sendRemarkRemove: false,
      credit_package: 1
    }
  },
  beforeCreate () {
    if (!this.$session.exists()) {
      if (this.$route.query.bookNo) {
        this.$router.push(
          '/Core/Login?bookNo=' +
            this.$route.query.bookNo +
            '&shopId=' +
            this.$route.query.shopId +
            '&type=' +
            this.$route.query.type
        )
      } else {
        this.$router.push('/Core/Login')
      }
    }
  },
  async mounted () {
    await this.getShop()
    console.log(
      'statusGoogleCalendar',
      this.statusGoogleCalendar,
      this.statusGoogleCalendarEmp
    )
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
    }
    this.checkShowDataOnsite('ไม่แสดง')
    this.$root.$on('dataReturn', item => {
      this.dataReturn(item)
    })
    this.$root.$on('closeSetTimeGetCalenda', () => {
      // your code goes here
      this.closeSetTimeGetCalenda()
    })
    // await this.beforeCreate()
  },
  beforeDestroy () {
    this.$root.$off('dataReturn')
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
          this.checkShowDataOnsite('ไม่แสดง')
        }
      }
    }
  },
  methods: {
    async pushMsgLineNotifyGroup (bookNo) {
      await axios
        .post(this.DNS_IP + '/Booking/pushMsgLineNotifyGroup/' + bookNo)
        .then(response => {
          this.clearData()
        })
        .catch(error => {
          console.log('error function pushMsgQueue : ', error)
        })
    },
    getRowClass (item) {
      if (this.$route.query.bookNoNoti) {
        return item.bookNo === this.$route.query.bookNoNoti
          ? 'orange lighten-5'
          : ''
      } else {
        return ''
      }
    },
    async getShop () {
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.session.data.shopId)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.shop = rs
            this.statusGoogleCalendar = rs[0].statusGoogleCalendar
            this.statusGoogleCalendarEmp = rs[0].statusGoogleCalendarEmp
          }
        })
    },
    async setCloseJob (item) {
      await this.setCloseJobItem(item[0].jobNo)
      console.log('this.ItemendStepStanby', this.ItemendStepStanby)
      await this.getStepFlowCloseJob(
        this.ItemendStepStanby.flowId,
        this.ItemendStepStanby.shopId
      )
    },
    async setCloseJobItem (jobNo) {
      await axios
        .get(this.DNS_IP + '/job/getJobNo?jobNo=' + jobNo)
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            this.ItemendStepStanby = rs[0]
          }
        })
    },
    async getStepFlowCloseJob (flowId, shopId) {
      await axios
        .get(
          this.DNS_IP + '/flowStep/get?flowId=' + flowId + '&shopId=' + shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.endStepItem = rs.filter(
              endItem => endItem.sortNo === rs.length
            )
            console.log('this.endStepItem', this.endStepItem)
          }
        })
    },
    async updateStepEnd () {
      console.log('endStepItem', this.endStepItem)
      console.log('ItemendStepStanby', this.ItemendStepStanby)
      if (this.statusPushEndStep === 'True') {
        let itemUpdate = {}
        itemUpdate.stepId = this.endStepItem[0].stepId
        itemUpdate.flowId = this.ItemendStepStanby.flowId
        itemUpdate.shopId = this.ItemendStepStanby.shopId
        itemUpdate.LAST_USER = this.session.data.userName
        itemUpdate.jobId = this.ItemendStepStanby.jobId
        await axios
          .post(
            // eslint-disable-next-line quotes
            this.DNS_IP + "/job/edit/" + itemUpdate.jobId,
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
    async pushmessage (jobId) {
      let updateStatusSend = { updateStatusSend: 'false' }
      await axios
        .post(this.DNS_IP + '/job/pushMsg/' + jobId, updateStatusSend)
        .then(console.log(jobId))
    },
    toggleAdd () {
      this.drawerAdd = !this.drawerAdd
    },
    updatePriceMenuAdd (price, dataMenu) {
      console.log('updatePriceMenu', price)
      this.priceMenuAdd = price
      this.dataMenuAdd = dataMenu
    },
    checkTypeSort () {
      if (this.sortSelect && this.sort) {
        if (this.sortSelect === 'เรียงตามวันที่นัดหมาย') {
          console.log('เรียงตามวันที่นัดหมาย')
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
          console.log('เรียงตามวันที่เปลี่ยนสถานะ')
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
      console.log('this.dataItemSelect', this.dataItemSelect)
    },
    async updateMenu () {
      let dt = {
        menuItem: JSON.stringify(
          this.dataMenu.filter(i => parseInt(i.qty) > 0)
        ),
        menuPrice: this.priceMenu || '',
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + this.bookNo,
          dt
        )
        .then(async response => {
          this.$swal('สำเร็จ', 'แก้ไขรายการเมนูเรียบร้อย', 'success')
          if (this.statusSearch === 'no') {
            this.getBookingList()
          } else {
            this.searchAny()
          }
          if (this.getSelectText) {
            this.getSelect(
              this.getSelectText,
              this.getSelectCount,
              this.filterCloseJobValue
            )
          }
          this.getDataCalendaBooking()
          this.dialogMenu = false
        })
    },
    getDataMenu (item) {
      this.dataMenu = []
      this.priceMenu = null
      this.bookNo = item.bookNo
      var dataCheckmenu = this.DataFlowNameMenu.filter(el => {
        return el.value === item.flowId
      })
      console.log('dataCheckmenu', dataCheckmenu)
      if (dataCheckmenu.length > 0) {
        let setMenu = JSON.parse(dataCheckmenu[0].allData.menuItem) || []
        console.log('setMenu', setMenu)
        if (
          item.menuItem !== null ||
          item.menuItem !== '' ||
          item.menuItem.length > 1
        ) {
          let dataMenu = JSON.parse(item.menuItem)
          for (let i = 0; i < dataMenu.length; i++) {
            let d = dataMenu[i]
            if (
              setMenu.filter(el => {
                return el.name === d.name
              }).length > 0
            ) {
              let index = setMenu.findIndex(it => {
                return it.name === d.name
              })
              console.log(index)
              setMenu[index].price = d.price
              setMenu[index].qty = d.qty
              setMenu[index].remark = d.remark
            }
          }
          if (setMenu.length > 0) {
            this.dataMenu = setMenu
          } else {
            if (
              item.menuItem !== null ||
              item.menuItem !== '' ||
              item.menuItem.length > 1
            ) {
              this.dataMenu = JSON.parse(item.menuItem)
            }
          }
          this.priceMenu = parseInt(item.menuPrice)
        }
      } else {
        if (
          item.menuItem !== null ||
          item.menuItem !== '' ||
          item.menuItem.length > 1
        ) {
          this.dataMenu = JSON.parse(item.menuItem)
          this.priceMenu = parseInt(item.menuPrice)
        }
      }
      this.dialogMenu = true
    },
    changeCounter (num, item) {
      item.qty += +num
      if (num === '1') {
        this.priceMenu = this.priceMenu + parseInt(item.price)
      } else {
        if (item.qty >= 0) {
          this.priceMenu = this.priceMenu - parseInt(item.price)
        }
      }
      // eslint-disable-next-line no-unused-expressions
      !isNaN(item.qty) && item.qty > 0 ? item.qty : (item.qty = 0)
      if (item.qty === 0) {
        item.remark = ''
      }
    },
    exportShowMenuReport () {
      let dataexport = []
      for (let i = 0; i < this.dataShowMenuReport.length; i++) {
        let a = this.dataShowMenuReport[i]
        if (a.statusBt === 'wait') {
          a.statusBtShow = this.dataTypeProcess1
        } else if (a.statusBt === 'confirm') {
          a.statusBtShow = this.dataTypeProcess2
        } else if (a.statusBt === 'confirmJob') {
          a.statusBtShow = this.dataTypeProcess4
        }
        let data1 = {}
        if (a.shopId === 'Uec804350aa290d70772883350c7c60c4') {
          data1 = {
            สถานะ: a.statusBtShow,
            บริการ: a.flowName,
            ชื่อลูกค้า: a.cusName,
            เบอร์โทร: a.tel,
            วันที่: a.dueDate,
            การจัดส่ง: a.deliveryOptions,
            ที่อยู่: a.address
          }
        } else {
          data1 = {
            สถานะ: a.statusBtShow,
            บริการ: a.flowName,
            ชื่อลูกค้า: a.cusName,
            เบอร์โทร: a.tel,
            วันที่: a.dueDate
          }
        }
        let checkFlow = this.DataFlowNameMenu.filter(el => {
          return el.value === this.flowSelectMenu
        })
        let menuItem = JSON.parse(checkFlow[0].allData.menuItem) || []
        console.log(menuItem)
        if (menuItem.length > 0) {
          for (let y = 0; y < menuItem.length; y++) {
            let x = menuItem[y]
            // console.log(menuItem)
            let checkmenu = a.menuItem.filter(el => {
              return el.name === x.name
            })
            if (checkmenu.length > 0) {
              data1[x.name] = checkmenu[0].qty
              data1['หมายเหตุ' + x.name] = checkmenu[0].remark || ''
            } else {
              data1[x.name] = '0'
              data1['หมายเหตุ' + x.name] = ''
            }
          }
        }
        dataexport.push(data1)
      }

      // const wb = XLSX.utils.book_new()
      let datause2 = dataexport.sort((a, b) => {
        if (a.วันที่ < b.วันที่) return -1
        return a.วันที่ > b.วันที่ ? 1 : 0
      })
      const dataWS = XLSX.utils.json_to_sheet(datause2)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, dataWS)
      XLSX.writeFile(
        wb,
        'export_' +
          this.format_dateNotime(this.dateStartShowMenuReport) +
          '.xlsx'
      )
      // console.log(datause2)
      // console.log(this.dataShowMenuReport)
      // for (let i = 0; i < this.dataMenuShowMenuReport.length; i++) {
      //   let d = this.dataMenuShowMenuReport[i]
      //   if (datause2.filter(el => { return el.ชื่อพนักงาน === d.value }).length > 0) {
      //     console.log(datause2.filter(el => { return el.ชื่อพนักงาน === d.value }))
      //     let sheetNm = ''
      //     if (d.value.length > 30) {
      //       sheetNm = d.value.substring(0, 29)
      //     } else {
      //       sheetNm = d.value
      //     }
      //     XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(datause2.filter(el => { return el.ชื่อพนักงาน === d.value })), sheetNm)
      //   }
      // }
      // console.log('dataexport', dataexport)
      // XLSX.writeFile(wb, 'export_' + this.format_dateNotime(this.dateStartShowMenuReport) + '.xlsx')
    },
    toggleShowMenuList (cusNameTel) {
      this.dataShowMenuReport.forEach(dessert => {
        if (dessert.cusNameTel === cusNameTel) {
          dessert.hide = !dessert.hide
        }
      })
    },
    async getBookingShowMenuList () {
      this.dataShowMenuReport = []
      this.dataMenuShowMenuReport = []
      this.BookingDataListShowMenuReport = []
      if (this.dateStartShowMenuReport && this.flowSelectMenu) {
        await this.getBookingDataListShowMenuReport(
          this.dateStartShowMenuReport
        )
        let urlApi = ''
        urlApi =
          this.DNS_IP +
          '/booking_view/get?shopId=' +
          this.session.data.shopId +
          '&dueDate=' +
          this.dateStartShowMenuReport +
          '&flowId=' +
          this.flowSelectMenu
        await axios.get(urlApi).then(async response => {
          console.log('getData', response.data)
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let d = response.data[i]
              d.statusBt = d.statusBt || 'wait'
              if (d.statusBt !== 'cancel') {
                // if (this.dataMenuShowMenuReport.filter(el => { return el.value === d.bookingEmpFlowName }).length === 0) {
                //   let s = {}
                //   s.text = d.bookingEmpFlowName
                //   s.value = d.bookingEmpFlowName
                //   this.dataMenuShowMenuReport.push(s)
                // }
                d.hide = false
                if (d.menuItem === null || d.menuItem === '') {
                  d.menuItem = []
                } else {
                  d.menuItem = JSON.parse(d.menuItem || [])
                }
                d.cusName = this.getDataFromFieldName(
                  this.BookingDataListShowMenuReport[d.bookNo],
                  'ชื่อ'
                )
                d.cusReg = this.getDataFromFieldName(
                  this.BookingDataListShowMenuReport[d.bookNo],
                  'เลขทะเบียน'
                )
                d.tel = this.getDataFromFieldName(
                  this.BookingDataListShowMenuReport[d.bookNo],
                  'เบอร์โทร'
                )
                // ร้านข้าวมันไก่ (Uec804350aa290d70772883350c7c60c4)
                if (d.shopId === 'Uec804350aa290d70772883350c7c60c4') {
                  d.deliveryOptions = this.getDataFromFieldName(
                    this.BookingDataListShowMenuReport[d.bookNo],
                    'การจัดส่ง'
                  )
                  d.address = this.getDataFromFieldName(
                    this.BookingDataListShowMenuReport[d.bookNo],
                    'ที่อยู่'
                  )
                  d.deliveryOptions =
                    d.deliveryOptions.length > 0
                      ? d.deliveryOptions[0].fieldValue
                      : ''
                  d.address =
                    d.address.length > 0 ? d.address[0].fieldValue : ''
                }
                //
                d.cusName = d.cusName.length > 0 ? d.cusName[0].fieldValue : ''
                d.cusReg = d.cusReg.length > 0 ? d.cusReg[0].fieldValue : ''
                d.tel = d.tel.length > 0 ? d.tel[0].fieldValue : ''
                d.cusNameTel = d.cusName + ' : ' + d.tel
                this.dataShowMenuReport.push(d)
              }
            }
          } else {
            this.dataShowMenuReport = []
            this.dataMenuShowMenuReport = []
          }
        })
      }
    },
    async getBookingDataListShowMenuReport (dateStart) {
      console.log('dateStart', dateStart)
      this.BookingDataListShowMenuReport = []
      let url = ''
      url = `${this.DNS_IP}/BookingData/getView?shopId=${this.session.data.shopId}&dueDate=${dateStart}`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach(row => {
              if (
                typeof this.BookingDataListShowMenuReport[row.bookNo] ===
                'undefined'
              ) {
                this.BookingDataListShowMenuReport[row.bookNo] = []
              }
              this.BookingDataListShowMenuReport[row.bookNo].push(row)
            })
          }
        })
        .catch(error => {
          // this.dataEditReady = true
          setTimeout(
            () => this.getBookingDataListShowMenuReport(dateStart),
            3000
          )
          console.log('catch getBookingDataListShowMenuReport : ', error)
        })
      console.log(
        'this.BookingDataListShowMenuReport',
        this.BookingDataListShowMenuReport
      )
    },
    gotoLineOa () {
      window.open('https://chat.line.biz/', '_blank')
    },
    async coppyLink (item) {
      console.log('item', item)
      // this.$swal.fire('Any fool can use a computer')
      // this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
      this.$swal({
        title: 'Copy successfully',
        text: 'คัดลอกลายชื่อเรียบร้อย',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      await navigator.clipboard.writeText(item)
    },
    async getDataFlowAllCancel () {
      this.dataFlowCancel = await this.getDataFromAPI(
        '/flow/get',
        'flowId',
        'flowName',
        ''
      )
    },
    async confirmChkCancel (item) {
      this.fromAddTimeCus = ''
      this.dataConfirmCancel = item
      this.bookingEmpFlowCancel = item.bookingEmpFlow
      this.flowSelectCancel = item.flowId
      this.flowIDLimit = item.flowId
      this.masBranchID = item.masBranchID
      this.empSelectCancel = ''
      this.formChangeDateCancel = item.dueDateDay

      await this.getDataFlowAllCancel()
      await this.getEmpCancel(item.masBranchID)

      this.checkCustomerTimeSlotCancel()

      await this.SetallowedDatesChangeCancel(item.bookingEmpFlow)
      await this.setLimitBookingCancel(item.dueDateDay)
      await this.getEmpSelect(item)

      if (
        this.timeavailableCancel.filter(el => {
          return el.value === item.timeDuetext
        }).length > 0
      ) {
        this.formChangeTimeCancel = item.timeDuetext
      } else {
        this.formChangeTimeCancel = ''
      }
      this.dialogConfirmCancel = true
    },
    checkTimeCancel () {
      this.timeavailableCancel =
        JSON.parse(
          this.EmpItemLimitCancel.filter(item => {
            return item.empId === this.bookingEmpFlowCancel
          })[0].setTime
        ) || []
      console.log('timevailable', this.timeavailableCancel)
    },
    SetallowedDatesChangeCancel (bookingEmpFlow) {
      console.log('this.dataEmpCancel', this.dataEmpCancel)
      this.dataEmpCancel.forEach((v, k) => {
        if (v.empId === bookingEmpFlow) {
          v.dateDayCustom = v.dateDayCustom || ''
          v.dateDayoffValue = v.dateDayoffValue || ''
          if (v.dateDayoffValue !== '') {
            // console.log('if')
            this.dateDayoff = JSON.parse(v.dateDayoffValue)
          } else {
            // console.log('else')
            this.dateDayoff = []
          }
          if (v.dateDayCustom !== '') {
            this.dateDayCustom = JSON.parse(v.dateDayCustom)
          } else {
            this.dateDayCustom = []
          }
        }
      })
    },
    allowedDatesChangeCancel (val) {
      // if (this.dateDaylimit) {
      if (
        this.dataFlowCancel.filter(el => el.value === this.flowIDLimit).length >
        0
      ) {
        if (
          this.dataFlowCancel.filter(el => el.value === this.flowIDLimit)[0]
            .allData.typeDayCustom === 'on'
        ) {
          return val === this.dateDayCustom.filter(el => el === val)[0]
        } else {
          if (
            this.dateDayoff.filter(el => {
              return el === new Date(val).getDay()
            }).length === 0 &&
            this.dateDayCustom.filter(el => {
              return el === val
            }).length === 0
          ) {
            return val
          }
        }
      } else {
        return val
      }
      // }
    },
    async getLimitBookingCancel (dateitem) {
      let LimitBooking = axios
        .get(
          this.DNS_IP +
            '/LimitBookingDateEmp/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&empId=' +
            this.bookingEmpFlowCancel +
            '&bookingDate=' +
            dateitem
        )
        .then(async response => {
          let rs = response.data
          return rs
        })
      return LimitBooking
    },
    async setLimitBookingCancel (dateitem) {
      console.log('setLimitBookingCancel', dateitem)
      this.time = ''
      this.timeavailableCancel = []
      let setTime = []
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      console.log(
        this.EmpItemLimitCancel.filter(item => {
          return item.empId === this.bookingEmpFlowCancel
        })
      )
      if (
        this.EmpItemLimitCancel.filter(item => {
          return item.empId === this.bookingEmpFlowCancel
        })[0].setTimebyday === 'True'
      ) {
        let timeJson = JSON.parse(
          this.EmpItemLimitCancel.filter(item => {
            return item.empId === this.bookingEmpFlowCancel
          })[0].setTime
        ).filter(items => items.value === new Date(dateitem).getDay())
        setTime = timeJson[0].setTime || []
        console.log('IF')
      } else {
        console.log('ELSE')
        setTime =
          JSON.parse(
            this.EmpItemLimitCancel.filter(item => {
              return item.empId === this.bookingEmpFlowCancel
            })[0].setTime
          ) || []
      }
      console.log('this.EmpItemLimit.filter', this.EmpItemLimitCancel)
      console.log('setTime', setTime)
      // this.showTable = []
      this.limitBookingCheck =
        this.EmpItemLimitCancel.filter(item => {
          return item.empId === this.bookingEmpFlowCancel
        })[0].limitBookingCheck || 'False'
      if (
        this.EmpItemLimitCancel.filter(item => {
          return item.empId === this.bookingEmpFlowCancel
        })[0].limitBookingCheck ||
        'False'
      ) {
        this.timeavailableCancel = setTime
        console.log(
          'DataFlowName',
          this.dataFlowCancel.filter(v => v.value === this.flowSelectCancel)[0]
            .allData
        )
        // let slotByflow = this.dataFlow.filter((v) => v.value === this.flowSelect)[0].allData.timeSlot
        let slotByflow = []
        console.log('dataEmp', this.dataItem)
        if (this.customerTimeSlot === 'False') {
          slotByflow = this.dataFlowCancel.filter(
            v => v.value === this.flowSelectCancel
          )[0].allData.timeSlot
        } else {
          slotByflow = this.fromAddTimeCus
        }
        let overTime = this.dataFlowCancel.filter(
          v => v.value === this.flowSelectCancel
        )[0].allData.overTime
        if (this.timeavailableCancel.length >= slotByflow) {
          let LimitBooking = await this.getLimitBooking(dateitem)
          console.log('LimitBooking', LimitBooking)
          // เซ็ต Status ให้แต่ละช่วงเวลา
          this.timeavailableCancel.forEach((v, k) => {
            if (typeof v.status === 'undefined') {
              v.status = true
              if (v.limitBooking === '0') {
                v.status = false
              }
            }
          })
          if (LimitBooking.status !== false) {
            if (LimitBooking.length > 0) {
              this.timeavailableCancel.forEach((v, k) => {
                let bookingTarget = LimitBooking.filter(
                  a => a.bookingTime === v.value
                )
                if (bookingTarget.length > 0) {
                  v.status = false
                  let bookingTargetSlot =
                    bookingTarget[0].timeSlotCustomer ||
                    bookingTarget[0].timeSlot
                  for (let bT = 0; bT < bookingTargetSlot; bT++) {
                    if (this.timeavailableCancel[k + bT] !== undefined) {
                      this.timeavailableCancel[k + bT].status = false
                    }
                  }
                }
              })
            }
          }
          console.log('timeavailable', this.timeavailableCancel)
          // For ค่าใส่ ตัวแปร array
          let Newtimeavailable = []
          let slotCheck = slotByflow
          for (let i = 0; i < this.timeavailableCancel.length; i++) {
            let num = i + (slotCheck - 1)
            let checkitem = this.timeavailableCancel.filter(
              (item, key) => key >= i && key <= num
            )
            console.log('checkitem', checkitem, slotCheck)
            Newtimeavailable.push(checkitem)
          }
          console.log('Newtimeavailable', Newtimeavailable)
          this.timeavailableCancel = []
          Newtimeavailable.forEach((v, k) => {
            // console.log('v.length >= slotCheck', v.length, slotCheck)
            if (v.length > 0) {
              if (overTime === 'True') {
                if (v.filter(v => v.status === false).length <= 0) {
                  this.timeavailableCancel.push(v[0])
                }
              } else {
                // ปิดเวลาสุดท้ายในกรณีที่ ไม่ต้องการให้จองเลยเวลา
                if (
                  v.filter(v => v.status === false).length <= 0 &&
                  v.length >= slotCheck
                ) {
                  // console.log('else', v)
                  this.timeavailableCancel.push(v[0])
                }
              }
            }
          })

          // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก
          // if (dateC === moment().format('YYYY-MM-DD')) {
          //   this.timeavailable = this.timeavailable.filter(item => moment().format(item.value) > moment().format('HH:mm'))
          // } else {
          // }
          // console.log('this.timeavailable 4', this.timeavailable)
          // console.log('Newitem', Newtimeavailable)
          if (this.timeavailableCancel.length === 0) {
            this.$swal('คิวเต็มแล้ว', 'กรุณาเลือกวันที่ใหม่อีกครั้ง', 'error')
            this.formChangeDateCancel = ''
          }
        } else {
          this.timeavailableCancel = []
          this.$swal('คิวเต็ม', 'ช่างคนนี้คิวเต็มแล้ว', 'error')
            .then(() => {
              this.formChangeDateCancel = ''
            })
            .catch(() => {
              this.formChangeDateCancel = ''
            })
        }
      } else {
        console.log('this.timeavailable ELSEEEEE', this.timeavailableCancel)
        // LimitBookingBy Flow
        this.timeavailableCancel = setTime
      }
      // await this.chekSlotTime()
    },
    // async setLimitBookingCancel (dateitem) {
    //   // this.time = ''
    //   this.timeavailableCancel = []
    //   // this.showTable = []
    //   let setTime = []
    //   // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
    //   if (this.EmpItemLimitCancel.filter(item => { return item.empId === this.bookingEmpFlowCancel })[0].setTimebyday === 'True') {
    //     let timeJson = JSON.parse(this.EmpItemLimitCancel.filter(item => { return item.empId === this.bookingEmpFlowCancel })[0].setTime).filter((items) => items.value === new Date(dateitem).getDay())
    //     setTime = timeJson[0].setTime || []
    //     console.log('IF')
    //   } else {
    //     console.log('ELSE')
    //     setTime = JSON.parse(this.EmpItemLimitCancel.filter(item => { return item.empId === this.bookingEmpFlowCancel })[0].setTime) || []
    //   }

    //   this.limitBookingCheck = this.EmpItemLimitCancel.filter(item => { return item.empId === this.bookingEmpFlowCancel })[0].limitBookingCheck || 'False'
    //   if (this.EmpItemLimitCancel.filter(item => { return item.empId === this.bookingEmpFlowCancel })[0].limitBookingCheck || 'False') {
    //     this.timeavailableCancel = setTime
    //     // let slotByflow = this.dataFlowCancel.filter((v) => v.value === this.dataConfirmCancel.flowId)[0].allData.timeSlot
    //     let slotByflow = []
    //     console.log('dataEmp', this.dataItem)
    //     if (this.customerTimeSlot === 'False') {
    //       slotByflow = this.dataFlow.filter((v) => v.value === this.dataItem[0].flowId)[0].allData.timeSlot
    //     } else {
    //       slotByflow = this.fromAddTimeCus
    //     }
    //     let overTime = this.dataFlow.filter((v) => v.value === this.dataItem[0].flowId)[0].allData.overTime
    //     if (this.timeavailableCancel.length >= slotByflow) {
    //       let LimitBooking = await this.getLimitBookingCancel(dateitem)
    //       console.log('LimitBooking', LimitBooking)
    //       // เซ็ต Status ให้แต่ละช่วงเวลา
    //       if (LimitBooking.status !== false) {
    //         if (LimitBooking.length > 0) {
    //           this.timeavailableCancel.forEach((v, k) => {
    //             if (typeof v.status === 'undefined') {
    //               v.status = true
    //             }
    //             let bookingTarget = LimitBooking.filter((a) => a.bookingTime === v.value)
    //             if (bookingTarget.length > 0) {
    //               v.status = false
    //               for (let bT = 0; bT < bookingTarget[0].timeSlot; bT++) {
    //                 if (this.timeavailableCancel[k + bT] !== undefined) {
    //                   this.timeavailableCancel[k + bT].status = false
    //                 }
    //               }
    //             }
    //           // this.showTable.push(v)
    //           })
    //           console.log('this.timeavailableCancel 1', this.timeavailableCancel)
    //           // For ค่าใส่ ตัวแปร array
    //           let Newtimeavailable = []
    //           let slotCheck = slotByflow
    //           for (let i = 0; i < this.timeavailableCancel.length; i++) {
    //             let num = i + (slotCheck - 1)
    //             let checkitem = this.timeavailableCancel.filter((item, key) => (key >= i && key <= num))
    //             console.log('checkitem', checkitem, slotCheck)
    //             Newtimeavailable.push(checkitem)
    //           }
    //           console.log('Newtimeavailable', Newtimeavailable)
    //           this.timeavailableCancel = []
    //           Newtimeavailable.forEach((v, k) => {
    //             // console.log('v.length >= slotCheck', v.length, slotCheck)
    //             if (slotByflow === 'True') {
    //               if (v.filter((v) => v.status === false).length <= 0) {
    //                 this.timeavailableCancel.push(v[0])
    //               }
    //             } else {
    //               // ปิดเวลาสุดท้ายในกรณีที่ ไม่ต้องการให้จองเลยเวลา
    //               if (v.filter((v) => v.status === false).length <= 0 && v.length >= slotCheck) {
    //                 console.log('else', v[0])
    //                 this.timeavailableCancel.push(v[0])
    //               }
    //             }
    //           })
    //           // Newtimeavailable.forEach((v, k) => {
    //           //   if (v.filter((v) => v.status === false).length <= 0) {
    //           //     this.timeavailableCancel.push(v[0])
    //           //   }
    //           // })
    //           // console.log('this.timeavailableCancel 3', this.timeavailableCancel)

    //           // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก
    //           // if (moment(dateitem).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
    //           //   this.timeavailableCancel = this.timeavailableCancel.filter(item => moment().format(item.value) > moment().format('HH:mm'))
    //           // } else {
    //           // }
    //           if (this.timeavailableCancel.length === 0) {
    //             this.$swal(
    //               'วันนี้ไม่มีคิวว่างแล้ว',
    //               'กรุณาเลือกวันที่ใหม่อีกครั้ง',
    //               'error'
    //             )
    //             this.date = ''
    //           }
    //         }
    //       } else {
    //         this.timeavailableCancel = JSON.parse(this.EmpItemLimitCancel.filter(item => { return item.empId === this.bookingEmpFlowCancel })[0].setTime) || []
    //         if (moment(dateitem).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
    //           this.timeavailableCancel = this.timeavailableCancel.filter(item => moment().format(item.value) > moment().format('HH:mm'))
    //         } else {
    //         }
    //         console.log('this.timeavailableCancel ELSE', this.timeavailableCancel)
    //       }
    //     } else {
    //       this.timeavailableCancel = []
    //       this.$swal(
    //         'คิวเต็ม',
    //         'ช่างคนนี้คิวเต็มแล้ว',
    //         'error'
    //       ).then(() => { this.date = '' }).catch(() => { this.date = '' })
    //     }
    //   } else {
    //     console.log('this.timeavailable ELSEEEEE', this.timeavailableCancel)
    //     // LimitBookingBy Flow
    //     this.timeavailableCancel = JSON.parse(this.EmpItemLimitCancel.filter(item => { return item.empId === this.bookingEmpFlowCancel })[0].setTime) || []
    //   }
    //   // await this.chekSlotTime()
    // },
    async getEmpCancel (masBranchID) {
      this.dataEmpCancel = []
      this.EmpItemLimitCancel = []
      await axios
        .get(
          this.DNS_IP +
            '/empSelect/get?privacyPage=bookingform&masBranchID=' +
            masBranchID
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (d.flowId !== null && d.flowId !== '') {
                let checkFlowId = JSON.parse(d.flowId)
                if (
                  checkFlowId.filter(a => parseInt(a) === this.flowSelectCancel)
                    .length > 0
                ) {
                  // let s = {}
                  // s.text = d.empFull_NameTH
                  // s.textEng = d.empFull_NameTH
                  // s.value = d.empId
                  // s.limitBookingCheck = d.limitBookingCheck
                  d.limitBookingCheck = d.limitBookingCheck || 'False'
                  d.text = d.empFull_NameTH
                  d.textEng = d.empFull_NameTH
                  d.value = d.empId
                  this.dataEmpCancel.push(d)
                  let limit = {}
                  limit.empId = d.empId
                  limit.limitBookingCheck = d.limitBookingCheck || 'False'
                  limit.setTime = d.setTime || '[]'
                  limit.setTimebyday = d.setTimebyday
                  this.EmpItemLimitCancel.push(limit)
                }
              }
            }
            if (this.dataEmpCancel.length === 0) {
              this.$swal(
                'ไม่มีช่างสำหรับประเภทบริการนี้',
                'กรุณาเลือกประเภทบริการอื่นๆ',
                'info'
              )
            }
            console.log('EmpItemLimitCancel', this.EmpItemLimitCancel)
          } else {
            this.dataEmpCancel = []
          }
        })
      console.log('dataEmpCancel', this.dataEmpCancel)
    },
    async onConfirmCancel (item) {
      let chkStatLimit = this.dataEmpCancel.filter(el => {
        return el.value === this.bookingEmpFlowCancel
      })
      console.log('chkStatLimit', chkStatLimit)
      let timeChange = ''
      let timeChangeText = ''
      if (typeof this.formChangeTimeCancel === 'string') {
        timeChange = this.formChangeTimeCancel
        timeChangeText = this.formChangeTimeCancel
      } else {
        timeChange = this.formChangeTimeCancel.value
        timeChangeText = this.formChangeTimeCancel.text
      }
      if (chkStatLimit.length > 0) {
        if (chkStatLimit[0].limitBookingCheck === 'True') {
          this.insertLimitBooking(
            item,
            this.formChangeDateCancel,
            timeChange,
            this.bookingEmpFlowCancel
          )
        }
      }
      var dtChange = {
        bookingEmpFlow: this.bookingEmpFlowCancel,
        // countChangeTime: countTime,
        changeDueDate: 'change',
        dueDate: this.formChangeDateCancel + ' ' + timeChange,
        timeText: timeChangeText,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/BookingData/edit/" + item.bookNo,
          dtChange
        )
        .then(async response => {
          let dt = {
            // pageStatus: 'cancel',
            // limitBookingCount: dtint,
            bookNo: item.bookNo,
            contactDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            status: 'confirm',
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.$session.getAll().data.userName,
            LAST_USER: this.$session.getAll().data.userName
          }
          axios
            .post(this.DNS_IP + '/booking_transaction/add', dt)
            .then(async response => {
              this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
              let DTitem = item.userId
              console.log('DTITEM', DTitem)
              this.dialogConfirmCancel = false
              if (this.statusGoogleCalendar === 'True') {
                this.connectGoogleCalendar('Add', dt.bookNo)
              }
              if (DTitem !== 'user-skip') {
                if (this.statusSearch === 'no') {
                  await this.getBookingList()
                } else {
                  await this.searchAny()
                }
                // this.getTimesChange('update')
                if (this.getSelectText) {
                  this.getSelect(
                    this.getSelectText,
                    this.getSelectCount,
                    this.filterCloseJobValue
                  )
                }
                this.pushMsgConfirm(item.bookNo)
              } else {
                if (this.statusSearch === 'no') {
                  await this.getBookingList()
                } else {
                  await this.searchAny()
                }
                // this.getTimesChange('update')
                if (this.getSelectText) {
                  this.getSelect(
                    this.getSelectText,
                    this.getSelectCount,
                    this.filterCloseJobValue
                  )
                }
              }
              this.dialogConfirmCancel = false
            })
            .catch(error => {
              console.log('error function addData : ', error)
            })
        })
    },
    async insertLimitBooking (item, dueDateNew, dueDateTimeNew, bookingEmpFlow) {
      let result = []
      let timeSlotCustomer = ''
      if (this.customerTimeSlot === 'True') {
        timeSlotCustomer = this.fromAddTimeCus
      } else {
        console.log(
          'TESTSTTETETSETSET',
          this.dataFlowCancel.filter(v => v.value === this.flowSelectCancel)[0]
            .allData
        )
        timeSlotCustomer = this.dataFlowCancel.filter(
          v => v.value === this.flowSelectCancel
        )[0].allData.timeSlot
      }
      let dt = {
        dueDateNew: dueDateNew,
        dueDateTimeNew: dueDateTimeNew,
        flowId: item.flowId,
        masBranchID: item.masBranchID,
        shopId: item.shopId,
        userId: item.userId,
        bookingEmpFlow: bookingEmpFlow,
        timeSlotCustomer: timeSlotCustomer,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/Booking/insertLimitBooking', dt)
        .then(async response => {
          result = response.data
        })
      return result
    },
    arrayMove (arr, oldindex, newindex) {
      arr.splice(newindex, 0, arr.splice(oldindex, 1)[0])
      // console.log('arr', arr)
      return arr[1] + '/' + arr[0] + '/' + arr[2]
    },
    exportShowEmpReport () {
      let dataexport = []
      console.log('dataShowEmpReport', this.dataShowEmpReport)
      for (let i = 0; i < this.dataShowEmpReport.length; i++) {
        let a = this.dataShowEmpReport[i]
        if (a.statusBt === 'wait') {
          a.statusBtShow = this.dataTypeProcess1
        } else if (a.statusBt === 'confirm') {
          a.statusBtShow = this.dataTypeProcess2
        } else if (a.statusBt === 'confirmJob') {
          a.statusBtShow = this.dataTypeProcess4
        }
        let data1 = {
          สถานะ: a.statusBtShow,
          บริการ: a.flowName,
          ชื่อลูกค้า: a.cusName,
          เบอร์โทร: a.tel,
          วันที่: a.dueDateFix,
          ชื่อพนักงาน: a.bookingEmpFlowName,
          หมายเหตุ: a.remark || ''
        }
        dataexport.push(data1)
      }

      const wb = XLSX.utils.book_new()
      let datause2 = dataexport.sort((a, b) => {
        if (a.วันที่ < b.วันที่) return -1
        return a.วันที่ > b.วันที่ ? 1 : 0
      })
      console.log(datause2)
      console.log(this.dataEmpShowEmpReport)
      for (let i = 0; i < this.dataEmpShowEmpReport.length; i++) {
        let d = this.dataEmpShowEmpReport[i]
        if (
          datause2.filter(el => {
            return el.ชื่อพนักงาน === d.value
          }).length > 0
        ) {
          console.log(
            datause2.filter(el => {
              return el.ชื่อพนักงาน === d.value
            })
          )
          let sheetNm = ''
          if (d.value.length > 30) {
            sheetNm = d.value.substring(0, 29)
          } else {
            sheetNm = d.value
          }
          XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(
              datause2.filter(el => {
                return el.ชื่อพนักงาน === d.value
              })
            ),
            sheetNm
          )
        }
      }
      console.log('dataexport', dataexport)
      XLSX.writeFile(
        wb,
        'export_' +
          this.format_dateNotime(this.dateStartShowEmpReport) +
          '.xlsx'
      )
    },
    toggleShowEmpList (bookingEmpFlowName) {
      this.dataShowEmpReport.forEach(dessert => {
        if (dessert.bookingEmpFlowName === bookingEmpFlowName) {
          dessert.hide = !dessert.hide
        }
      })
    },
    async getBookingShowEmpList () {
      this.dataShowEmpReport = []
      this.dataEmpShowEmpReport = []
      this.BookingDataListShowEmpReport = []
      if (this.dateStartShowEmpReport) {
        await this.getBookingDataListShowEmpReport(this.dateStartShowEmpReport)
        let urlApi = ''
        // if (this.flowSelect === 'AllFlow') {
        urlApi =
          this.DNS_IP +
          '/booking_view/get?shopId=' +
          this.session.data.shopId +
          // '&masBranchID=' +
          // this.masBranchID +
          '&dueDate=' +
          this.dateStartShowEmpReport
        // } else {
        //   urlApi = this.DNS_IP +
        //       '/booking_view/get?shopId=' +
        //       this.session.data.shopId +
        //       '&masBranchID=' +
        //       this.masBranchID +
        //       '&dueDate=' + this.dateStartShowEmpReport
        //       // '&flowId=' + this.flowSelect + this.selectOnsite
        // }
        await axios.get(urlApi).then(async response => {
          console.log('getData', response.data)
          console.log('this.dataEmpShowEmpReport', this.dataEmpShowEmpReport)
          response.data.forEach(item => {
            console.log('BookflowName', item.bookingEmpFlowName || 'None')
          })
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let d = response.data[i]
              d.statusBt = d.statusBt || 'wait'
              if (d.statusBt !== 'cancel') {
                if (
                  this.dataEmpShowEmpReport.filter(el => {
                    return el.value === d.bookingEmpFlowName
                  }).length === 0
                ) {
                  let s = {}
                  s.text = d.bookingEmpFlowName
                  s.value = d.bookingEmpFlowName
                  this.dataEmpShowEmpReport.push(s)
                }
                d.hide = false
                d.cusName = this.getDataFromFieldName(
                  this.BookingDataListShowEmpReport[d.bookNo],
                  'ชื่อ'
                )
                d.cusReg = this.getDataFromFieldName(
                  this.BookingDataListShowEmpReport[d.bookNo],
                  'เลขทะเบียน'
                )
                d.tel = this.getDataFromFieldName(
                  this.BookingDataListShowEmpReport[d.bookNo],
                  'เบอร์โทร'
                )
                d.cusName = d.cusName.length > 0 ? d.cusName[0].fieldValue : ''
                d.cusReg = d.cusReg.length > 0 ? d.cusReg[0].fieldValue : ''
                d.tel = d.tel.length > 0 ? d.tel[0].fieldValue : ''
                let endTime = await this.countTime(
                  d.timeText,
                  JSON.parse(d.bookingEmpSetTime) || [],
                  d.timeSlotCustomer
                )
                d.dueDateEnd = endTime || ''
                d.dueDateFix = d.dueDate + endTime
                this.dataShowEmpReport.push(d)
              }
            }
            console.log('this.Datatat', this.dataShowEmpReport)
          } else {
            this.dataShowEmpReport = []
            this.dataEmpShowEmpReport = []
          }
        })
      }
    },
    setEmpAdd () {
      console.log('SetEmpAdd')
      if (this.formAdd.masBranchID !== null && this.formAdd.flowId !== null) {
        this.formAdd.bookingEmpFlow = ''
        this.fromAddTimeCus = ''
        this.getEmpAdd(this.formAdd.masBranchID)
      }
    },
    async setEmpEdit () {
      this.fromAddTimeCus = ''
      if (
        this.flowIdOldEdit !== this.formEdit.flowId &&
        this.getSelectText !== 'cancel' &&
        this.checkSelectText !== 'confirmJob'
      ) {
        if (
          this.formEdit.masBranchID !== null &&
          this.formEdit.flowId !== null
        ) {
          await this.getEmpEdit(this.formEdit.masBranchID)
          console.log('this.dataEdit', this.dataEdit)
          if (this.formEdit.bookingEmpFlow) {
            this.SetallowedDatesChange(this.formEdit.bookingEmpFlow)
            await this.checkCustomerTimeSlotEdit(this.dataEdit)
            // this.checkTimeEdit(this.dataEdit, {flowId: this.formEdit.flowId, bookingEmpFlow: this.formEdit.bookingEmpFlow})
          }
        }
      } else if (
        this.formEdit.masBranchID !== this.masBranchIDOldEdit &&
        this.getSelectText !== 'cancel' &&
        this.checkSelectText !== 'confirmJob'
      ) {
        if (
          this.formEdit.masBranchID !== null &&
          this.formEdit.flowId !== null
        ) {
          await this.getEmpEdit(this.formEdit.masBranchID)
          console.log('this.dataEdit', this.dataEdit)
          if (this.formEdit.bookingEmpFlow) {
            this.SetallowedDatesChange(this.formEdit.bookingEmpFlow)
            await this.checkCustomerTimeSlotEdit(this.dataEdit)
            // this.checkTimeEdit(this.dataEdit, {flowId: this.formEdit.flowId, bookingEmpFlow: this.formEdit.bookingEmpFlow})
          }
        }
      } else if (
        this.flowIdOldEdit !== this.formEdit.flowId &&
        this.formEdit.masBranchID !== this.masBranchIDOldEdit &&
        this.getSelectText !== 'cancel' &&
        this.checkSelectText !== 'confirmJob'
      ) {
        if (
          this.formEdit.masBranchID !== null &&
          this.formEdit.flowId !== null
        ) {
          await this.getEmpEdit(this.formEdit.masBranchID)
          console.log('this.dataEdit', this.dataEdit)
          if (this.formEdit.bookingEmpFlow) {
            this.SetallowedDatesChange(this.formEdit.bookingEmpFlow)
            await this.checkCustomerTimeSlotEdit(this.dataEdit)
            // this.checkTimeEdit(this.dataEdit, {flowId: this.formEdit.flowId, bookingEmpFlow: this.formEdit.bookingEmpFlow})
          }
        }
      }
    },
    calculateTime (start, end) {
      let countTime = null
      // if (end > start) {
      //   let time = moment.utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm'))).format('HH:mm')
      //   let h = parseInt(time.split(':')[0])
      //   let m = parseInt(time.split(':')[1])
      //   countTime = (h * 60) + m
      // } else {
      //   countTime = 0
      // }
      if (end > start) {
        let genTime = moment
          .utc(moment(end, 'HH:mm').diff(moment(start, 'HH:mm')))
          .format('HH:mm')
        let h = parseInt(genTime.split(':')[0])
        let m = parseInt(genTime.split(':')[1])
        if (h === 0 && m !== 0) {
          countTime = m + ' นาที'
        } else if (h !== 0 && m === 0) {
          countTime = h + ' ชม.'
        } else {
          countTime = h + ' ชม. ' + m + ' นาที'
        }
      } else {
        countTime = 'No Data'
      }
      return countTime
    },
    async AddallowedDatesBysetTimebydayCancel () {
      await this.SetallowedDatesCancel(this.bookingEmpFlowCancel)
      if (
        this.EmpItemLimitCancel.filter(item => {
          return item.empId === this.bookingEmpFlowCancel
        })[0].setTimebyday === 'True'
      ) {
        let timeJson = JSON.parse(
          this.EmpItemLimitCancel.filter(item => {
            return item.empId === this.bookingEmpFlowCancel
          })[0].setTime
        )
        timeJson.forEach(item => {
          if (item.setTime.length < this.fromAddTimeCus) {
            if (this.dateDayoff.filter(i => i === item.value).length === 0) {
              this.dateDayoff.push(item.value)
            }
          }
        })
      }
      console.log('this.dateDayoff', this.dateDayoff)
    },
    async AddallowedDatesBysetTimebyday () {
      await this.SetallowedDates()
      if (
        this.EmpItemLimitAdd.filter(item => {
          return item.empId === this.formAdd.bookingEmpFlow
        })[0].setTimebyday === 'True'
      ) {
        let timeJson = JSON.parse(
          this.EmpItemLimitAdd.filter(item => {
            return item.empId === this.formAdd.bookingEmpFlow
          })[0].setTime
        )
        timeJson.forEach(item => {
          if (item.setTime.length < this.fromAddTimeCus) {
            if (this.dateDayoff.filter(i => i === item.value).length === 0) {
              this.dateDayoff.push(item.value)
            }
          }
        })
      }
      console.log('this.dateDayoff', this.dateDayoff)
    },
    async AddallowedDatesBysetTimebydayEdit () {
      console.log('formChang', this.bookingEmpFlow)
      this.dateDayoff = []
      console.log('this.dateDayoff', this.dateDayoff)
      await this.SetallowedDatesChange(this.formEdit.bookingEmpFlow)
      if (
        this.dataEmpAllChange.filter(item => {
          return item.empId === this.formEdit.bookingEmpFlow
        })[0].setTimebyday === 'True'
      ) {
        let timeJson = JSON.parse(
          this.dataEmpAllChange.filter(item => {
            return item.empId === this.formEdit.bookingEmpFlow
          })[0].setTime
        )
        console.log('timeJson', timeJson)
        timeJson.forEach(item => {
          if (item.setTime.length < this.fromAddTimeCus) {
            if (this.dateDayoff.filter(i => i === item.value).length === 0) {
              this.dateDayoff.push(item.value)
            }
          }
        })
      }
      console.log('this.dateDayoff', this.dateDayoff)
    },
    async AddallowedDatesBysetTimebydayChange () {
      console.log('formChang', this.bookingEmpFlow)
      this.dateDayoff = []
      console.log('this.dateDayoff', this.dateDayoff)
      await this.SetallowedDatesChange(this.bookingEmpFlow)
      if (
        this.dataEmpAllChange.filter(item => {
          return item.empId === this.bookingEmpFlow
        })[0].setTimebyday === 'True'
      ) {
        let timeJson = JSON.parse(
          this.dataEmpAllChange.filter(item => {
            return item.empId === this.bookingEmpFlow
          })[0].setTime
        )
        console.log('timeJson', timeJson)
        timeJson.forEach(item => {
          if (item.setTime.length < this.fromAddTimeCus) {
            if (this.dateDayoff.filter(i => i === item.value).length === 0) {
              this.dateDayoff.push(item.value)
            }
          }
        })
      }
      console.log('this.dateDayoff', this.dateDayoff)
    },
    checkCustomerTimeSlot () {
      this.timeSlotbyCustomer = []
      this.customerTimeSlot = this.DataFlowNameDefault.filter(
        v => v.value === this.formAdd.flowId
      )[0].allData.customerTimeSlot
      let allTime = []
      if (this.customerTimeSlot === 'True') {
        if (
          this.EmpItemLimitAdd.filter(item => {
            return item.empId === this.formAdd.bookingEmpFlow
          })[0].setTimebyday === 'True'
        ) {
          // let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime).filter((items) => items.value === new Date().getDay())
          // setTime = timeJson[0].setTime || []
          let timeJson = JSON.parse(
            this.EmpItemLimitAdd.filter(item => {
              return item.empId === this.formAdd.bookingEmpFlow
            })[0].setTime
          )
          let dataTime = []
          timeJson.forEach((itemTime, index) => {
            // console.log('item', itemTime)
            allTime = itemTime.setTime
            allTime.forEach((item, key) => {
              let ss = {}
              if (allTime.length === 1) {
                ss.text = 'ไม่ระบุ (มีเวลาเดียว)'
                ss.value = key + 1
                dataTime.push(ss)
              } else {
                if (key > 0) {
                  let start = allTime.filter((i, k) => k === 0)[0].value
                  let end = item.value
                  ss.text = this.calculateTime(start, end)
                  ss.value = key
                  // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                  dataTime.push(ss)
                  // this.timeSlotbyCustomer.push(ss)
                }
              }
            })
          })
          dataTime.forEach((i, n) => {
            if (
              this.timeSlotbyCustomer.filter(
                item => item.text === i.text && item.value === i.value
              ).length === 0
            ) {
              console.log('n', n)
              this.timeSlotbyCustomer.push(i)
            }
          })
          console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
        } else {
          allTime = JSON.parse(
            this.EmpItemLimitAdd.filter(item => {
              return item.empId === this.formAdd.bookingEmpFlow
            })[0].setTime
          )
          // allTime = this.limitBookingCheck = this.EmpItemLimitAdd.filter(item => { return item.empId === this.formAdd.bookingEmpFlow })[0].limitBookingCheck || 'False'
          console.log('allTime', allTime)
          allTime.forEach((item, key) => {
            let ss = {}
            if (allTime.length === 1) {
              // ss.text = item.value
              // ss.value = key + 1
              // this.timeSlotbyCustomer.push(ss)
              this.fromAddTimeCus = key + 1
            } else {
              if (key > 0) {
                let start = allTime.filter((i, k) => k === 0)[0].value
                let end = item.value
                ss.text = this.calculateTime(start, end)
                ss.value = key
                console.log(
                  'TIMEEEE',
                  start,
                  end,
                  'ใช้เวลา',
                  ss.text,
                  'slot',
                  ss.value
                )
                this.timeSlotbyCustomer.push(ss)
              }
            }
          })
        }
      }
      if (this.date !== '') {
        this.setLimitBooking(this.date)
        this.time = ''
      }
      // console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
    },
    checkCustomerTimeSlotCancel () {
      this.timeSlotbyCustomer = []
      this.customerTimeSlot = this.DataFlowNameDefault.filter(
        v => v.value === this.flowSelectCancel
      )[0].allData.customerTimeSlot
      console.log('this.customerTimeSlot', this.customerTimeSlot)
      let allTime = []
      if (this.customerTimeSlot === 'True') {
        if (
          this.EmpItemLimitCancel.filter(item => {
            return item.empId === this.bookingEmpFlowCancel
          })[0].setTimebyday === 'True'
        ) {
          // let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime).filter((items) => items.value === new Date().getDay())
          // setTime = timeJson[0].setTime || []
          let timeJson = JSON.parse(
            this.EmpItemLimitCancel.filter(item => {
              return item.empId === this.bookingEmpFlowCancel
            })[0].setTime
          )
          let dataTime = []
          console.log('timeJson', timeJson)
          timeJson.forEach((itemTime, index) => {
            // console.log('item', itemTime)
            allTime = itemTime.setTime
            allTime.forEach((item, key) => {
              let ss = {}
              if (allTime.length === 1) {
                ss.text = 'ไม่ระบุ (มีเวลาเดียว)'
                ss.value = key + 1
                dataTime.push(ss)
              } else {
                if (key > 0) {
                  let start = allTime.filter((i, k) => k === 0)[0].value
                  let end = item.value
                  ss.text = this.calculateTime(start, end)
                  ss.value = key
                  // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                  dataTime.push(ss)
                  // this.timeSlotbyCustomer.push(ss)
                }
              }
            })
          })
          dataTime.forEach((i, n) => {
            if (
              this.timeSlotbyCustomer.filter(
                item => item.text === i.text && item.value === i.value
              ).length === 0
            ) {
              console.log('n', n)
              this.timeSlotbyCustomer.push(i)
            }
          })
          console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
        } else {
          allTime = JSON.parse(
            this.EmpItemLimitCancel.filter(item => {
              return item.empId === this.bookingEmpFlowCancel
            })[0].setTime
          )
          // allTime = this.limitBookingCheck = this.EmpItemLimitAdd.filter(item => { return item.empId === this.formAdd.bookingEmpFlow })[0].limitBookingCheck || 'False'
          console.log('allTime', allTime)
          allTime.forEach((item, key) => {
            let ss = {}
            if (allTime.length === 1) {
              // ss.text = item.value
              // ss.value = key + 1
              // this.timeSlotbyCustomer.push(ss)
              this.fromAddTimeCus = key + 1
            } else {
              if (key > 0) {
                let start = allTime.filter((i, k) => k === 0)[0].value
                let end = item.value
                ss.text = this.calculateTime(start, end)
                ss.value = key
                console.log(
                  'TIMEEEE',
                  start,
                  end,
                  'ใช้เวลา',
                  ss.text,
                  'slot',
                  ss.value
                )
                this.timeSlotbyCustomer.push(ss)
              }
            }
          })
        }
      }
      if (this.formChangeDateCancel !== '') {
        this.setLimitBookingCancel(this.formChangeDateCancel)
        this.formChangeTimeCancel = ''
      }
      // console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
    },
    checkCustomerTimeSlotEdit () {
      this.timeSlotbyCustomer = []
      this.customerTimeSlot = this.DataFlowNameDefault.filter(
        v => v.value === this.formEdit.flowId
      )[0].allData.customerTimeSlot
      let allTime = []
      if (this.customerTimeSlot === 'True') {
        // allTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime)
        console.log('!@!@!@!@!@!@', this.dataEmpAllChange)
        if (
          this.dataEmpAllChange.filter(item => {
            return item.empId === this.formEdit.bookingEmpFlow
          })[0].setTimebyday === 'True'
        ) {
          // let timeJson = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime).filter((items) => items.value === new Date().getDay())
          // setTime = timeJson[0].setTime || []
          let timeJson = JSON.parse(
            this.dataEmpAllChange.filter(item => {
              return item.empId === this.formEdit.bookingEmpFlow
            })[0].setTime
          )
          console.log('IF', timeJson)
          let dataTime = []
          timeJson.forEach((itemTime, index) => {
            // console.log('item', itemTime)
            allTime = itemTime.setTime
            allTime.forEach((item, key) => {
              let ss = {}
              if (allTime.length === 1) {
                ss.text = 'ไม่ระบุ (มีเวลาเดียว)'
                ss.value = key + 1
                dataTime.push(ss)
              } else {
                if (key > 0) {
                  let start = allTime.filter((i, k) => k === 0)[0].value
                  let end = item.value
                  ss.text = this.calculateTime(start, end)
                  ss.value = key
                  // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                  dataTime.push(ss)
                  // this.timeSlotbyCustomer.push(ss)
                }
              }
            })
          })
          dataTime.forEach((i, n) => {
            if (
              this.timeSlotbyCustomer.filter(
                item => item.text === i.text && item.value === i.value
              ).length === 0
            ) {
              console.log('n', n)
              this.timeSlotbyCustomer.push(i)
            }
          })
          console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
        } else {
          console.log('ELSE', this.dataEmpAllChange)
          allTime = JSON.parse(
            this.dataEmpAllChange.filter(item => {
              return item.empId === this.formEdit.bookingEmpFlow
            })[0].setTime
          )
          // allTime = this.limitBookingCheck = this.EmpItemLimitAdd.filter(item => { return item.empId === this.formAdd.bookingEmpFlow })[0].limitBookingCheck || 'False'
          allTime.forEach((item, key) => {
            let ss = {}
            if (allTime.length === 1) {
              // ss.text = item.value
              // ss.value = key + 1
              // this.timeSlotbyCustomer.push(ss)
              this.fromAddTimeCus = key + 1
            } else {
              if (key > 0) {
                let start = allTime.filter((i, k) => k === 0)[0].value
                let end = item.value
                ss.text = this.calculateTime(start, end)
                ss.value = key
                console.log(
                  'TIMEEEE',
                  start,
                  end,
                  'ใช้เวลา',
                  ss.text,
                  'slot',
                  ss.value
                )
                this.timeSlotbyCustomer.push(ss)
              }
            }
          })
        }
      }
      console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
    },
    checkCustomerTimeSlotChang (itemChang) {
      this.timeSlotbyCustomer = []
      this.customerTimeSlot = this.DataFlowNameDefault.filter(
        v => v.value === itemChang.flowId
      )[0].allData.customerTimeSlot
      let allTime = []
      if (this.customerTimeSlot === 'True') {
        // allTime = JSON.parse(this.EmpItemLimit.filter(item => { return item.empId === this.fromAdd.empId })[0].setTime)
        if (
          this.dataEmpAllChange.filter(item => {
            return item.empId === itemChang.bookingEmpFlow
          })[0].setTimebyday === 'True'
        ) {
          console.log('IF!!!!!!!!!!!')
          let timeJson = JSON.parse(
            this.dataEmpAllChange.filter(item => {
              return item.empId === itemChang.bookingEmpFlow
            })[0].setTime
          )
          let dataTime = []
          timeJson.forEach((itemTime, index) => {
            // console.log('item', itemTime)
            allTime = itemTime.setTime
            allTime.forEach((item, key) => {
              let ss = {}
              if (allTime.length === 1) {
                ss.text = 'ไม่ระบุ (มีเวลาเดียว)'
                ss.value = key + 1
                dataTime.push(ss)
              } else {
                if (key > 0) {
                  let start = allTime.filter((i, k) => k === 0)[0].value
                  let end = item.value
                  ss.text = this.calculateTime(start, end)
                  ss.value = key
                  // console.log('TIMEEEE', start, end, 'ใช้เวลา', ss.text, 'slot', ss.value)
                  dataTime.push(ss)
                  // this.timeSlotbyCustomer.push(ss)
                }
              }
            })
          })
          dataTime.forEach((i, n) => {
            if (
              this.timeSlotbyCustomer.filter(
                item => item.text === i.text && item.value === i.value
              ).length === 0
            ) {
              console.log('n', n)
              this.timeSlotbyCustomer.push(i)
            }
          })
          console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
        } else {
          console.log('ELSE!!!!!!!!!')
          console.log('itemTest', this.dataEmpAllChange)
          allTime = JSON.parse(
            this.dataEmpAllChange.filter(item => {
              return item.empId === itemChang.bookingEmpFlow
            })[0].setTime
          )
          // allTime = this.limitBookingCheck = this.EmpItemLimitAdd.filter(item => { return item.empId === this.formAdd.bookingEmpFlow })[0].limitBookingCheck || 'False'
          allTime.forEach((item, key) => {
            let ss = {}
            if (allTime.length === 1) {
              // ss.text = item.value
              // ss.value = key + 1
              // this.timeSlotbyCustomer.push(ss)
              this.fromAddTimeCus = key + 1
            } else {
              if (key > 0) {
                let start = allTime.filter((i, k) => k === 0)[0].value
                let end = item.value
                ss.text = this.calculateTime(start, end)
                ss.value = key
                console.log(
                  'TIMEEEE',
                  start,
                  end,
                  'ใช้เวลา',
                  ss.text,
                  'slot',
                  ss.value
                )
                this.timeSlotbyCustomer.push(ss)
              }
            }
          })
        }
      }
      console.log('this.timeSlotbyCustomer', this.timeSlotbyCustomer)
    },
    async getEmpAdd (masBranchID) {
      this.dataEmpAdd = []
      this.dataEmpAllAdd = []
      await axios
        .get(
          this.DNS_IP +
            '/empSelect/get?privacyPage=bookingform&masBranchID=' +
            masBranchID
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (d.flowId !== null && d.flowId !== '') {
                let checkFlowId = JSON.parse(d.flowId)
                if (
                  checkFlowId.filter(a => parseInt(a) === this.formAdd.flowId)
                    .length > 0
                ) {
                  if (
                    d.setTime !== null &&
                    d.setTime !== '[]' &&
                    d.setTime !== ''
                  ) {
                    let s = {}
                    s.text = d.empFull_NameTH
                    s.textEng = d.empFull_NameTH
                    s.value = d.empId
                    d.text = d.empFull_NameTH
                    d.textEng = d.empFull_NameTH
                    d.value = d.empId
                    this.dataEmpAdd.push(s)
                    this.dataEmpAllAdd.push(d)
                    let limit = {}
                    limit.empId = d.empId
                    limit.limitBookingCheck = d.limitBookingCheck || 'False'
                    limit.setTime = d.setTime || '[]'
                    limit.setTimebyday = d.setTimebyday
                    this.EmpItemLimitAdd.push(limit)
                  }
                }
              }
            }
            if (this.dataEmpAdd.length === 0) {
              this.$swal(
                'ไม่มีช่างสำหรับประเภทบริการนี้',
                'กรุณาเลือกประเภทบริการอื่นๆ',
                'info'
              )
            }
            console.log('EmpItemLimitAdd', this.EmpItemLimitAdd)
          } else {
            this.dataEmpAdd = []
            this.dataEmpAllAdd = []
            this.EmpItemLimitAdd = []
          }
        })
      console.log('dataEmp', this.dataEmpAllAdd)
    },
    async getEmpEdit (masBranchID) {
      this.dataEmpAdd = []
      this.dataEmpAllAdd = []
      this.dataEmpChange = []
      this.EmpItemLimitAdd = []
      this.EmpItemLimitChange = []
      this.dataEmpAllChange = []
      await axios
        .get(
          this.DNS_IP +
            '/empSelect/get?privacyPage=bookingform&masBranchID=' +
            masBranchID
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (d.flowId !== null && d.flowId !== '') {
                let checkFlowId = JSON.parse(d.flowId)
                if (
                  checkFlowId.filter(a => parseInt(a) === this.formEdit.flowId)
                    .length > 0
                ) {
                  console.log('rs!!!!!!!!!!!!getEmpEdit', rs)
                  let s = {}
                  s.text = d.empFull_NameTH
                  s.textEng = d.empFull_NameTH
                  s.value = d.empId
                  d.text = d.empFull_NameTH
                  d.textEng = d.empFull_NameTH
                  d.value = d.empId
                  this.dataEmpAdd.push(s)
                  this.dataEmpChange.push(s)
                  this.dataEmpAllAdd.push(d)
                  this.dataEmpAllChange.push(d)
                  let limit = {}
                  limit.empId = d.empId
                  limit.limitBookingCheck = d.limitBookingCheck || 'False'
                  limit.setTime = d.setTime || '[]'
                  limit.setTimebyday = d.setTimebyday
                  this.EmpItemLimitAdd.push(limit)
                  this.EmpItemLimitChange.push(limit)
                }
              }
            }
            if (this.dataEmpAdd.length === 0) {
              this.$swal(
                'ไม่มีช่างสำหรับประเภทบริการนี้',
                'กรุณาเลือกประเภทบริการอื่นๆ',
                'info'
              )
            }
            console.log('EmpItemLimitAdd', this.EmpItemLimitAdd)
          } else {
            this.dataEmpAdd = []
            this.dataEmpAllAdd = []
            this.EmpItemLimitAdd = []
          }
        })
      console.log('dataEmp', this.dataEmpAllAdd)
    },
    async getEmpChange (dt) {
      this.dataEmpChange = []
      this.dataEmpAllChange = []
      this.EmpItemLimitChange = []
      await axios
        .get(
          this.DNS_IP +
            '/empSelect/get?privacyPage=bookingform&masBranchID=' +
            dt.masBranchID
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.flowId = d.flowId || ''
              if (d.flowId !== '') {
                let checkFlowId = JSON.parse(d.flowId)
                if (
                  checkFlowId.filter(a => parseInt(a) === dt.flowId).length > 0
                ) {
                  let s = {}
                  s.text = d.empFull_NameTH
                  s.textEng = d.empFull_NameTH
                  s.value = d.empId
                  d.text = d.empFull_NameTH
                  d.textEng = d.empFull_NameTH
                  d.value = d.empId
                  this.dataEmpChange.push(s)
                  this.dataEmpAllChange.push(d)
                  let limit = {}
                  limit.empId = d.empId
                  limit.limitBookingCheck = d.limitBookingCheck || 'False'
                  limit.setTime = d.setTime || '[]'
                  limit.setTimebyday = d.setTimebyday
                  this.EmpItemLimitChange.push(limit)
                }
              }
            }
            if (this.dataEmpChange.length === 0) {
              this.$swal(
                'ไม่มีช่างสำหรับประเภทบริการนี้',
                'กรุณาเลือกประเภทบริการอื่นๆ',
                'info'
              )
            }
            console.log('EmpItemLimitAdd', this.EmpItemLimitChange)
          } else {
            this.dataEmpChange = []
            this.dataEmpAllChange = []
            this.EmpItemLimitChange = []
          }
        })
      console.log('dataEmp', this.dataEmpAllChange)
    },
    async setDataServiceList (item) {
      this.$refs.NotificationService.setData(item)
    },
    async setDataCallLog (item) {
      this.$refs.CallLog.setData(item)
    },
    async setDataReture (item) {
      this.$refs.RetureDeposit.setData(item)
    },
    setDataCopyLink (item) {
      this.statusdepositPrice = true
      this.depositTextTH = item.depositTextTH || 'ชำระเงินมัดจำ'
      this.depositPrice = item.depositPrice || 0
      this.bookNo = item.bookNo
      this.datailLinkDeposit = item.remarkDepositLinked
      this.depositLink =
        'https://betask-linked.web.app/Thank?shopId=' +
        item.shopId +
        '&redirectBy=BookingAdmin&flowId=' +
        item.flowId +
        '&bookNo=' +
        item.bookNo
      this.dialogShowDeposit = true
    },
    async dataReturn (item) {
      console.log('dataReturn', item)
      if (this.statusSearch === 'no') {
        await this.getBookingList()
      } else {
        await this.searchAny()
      }
      // this.getTimesChange('update')
      if (this.getSelectText) {
        this.getSelect(
          this.getSelectText,
          this.getSelectCount,
          this.filterCloseJobValue
        )
      }
    },
    async FunCopyDeposit () {
      let textBookNo = ''
      let depositPrice = ''
      let textLink = ''
      let textDepositPrice = ''
      this.copyTextBt = ''
      let dt = {}
      if (this.statusdepositPrice === true) {
        dt = {
          remarkDepositLinked: this.datailLinkDeposit
            .replace(/%/g, '%%')
            .replace(/'/g, "\\'")
            .replace(/`/g, '\\`'),
          depositPrice: this.depositPrice || '',
          LAST_USER: this.$session.getAll().data.userName
        }
      } else {
        dt = {
          remarkDepositLinked: this.datailLinkDeposit
            .replace(/%/g, '%%')
            .replace(/'/g, "\\'")
            .replace(/`/g, '\\`'),
          LAST_USER: this.$session.getAll().data.userName
        }
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + this.bookNo,
          dt
        )
        .then(async response => {})
      await axios
        // .post(this.DNS_IP + '/Booking/setDetailsCopyLinkAddData/' + 'BK025446181660716002544')
        .post(this.DNS_IP + '/Booking/setDetailsCopyLinkAddData/' + this.bookNo)
        .then(async response => {
          if (response.data.status) {
            textBookNo = response.data.message
            depositPrice = response.data.depositPrice || 0
            if (depositPrice === '0') {
              textLink = 'กรุณากดเพื่อผูกบัญชี : ' + this.depositLink
            } else {
              textLink =
                'กรุณากดเพื่อโอน' +
                this.depositTextTH +
                ' : ' +
                this.depositLink
              textDepositPrice =
                `\nจำนวนเงินมัดจำ : ` +
                depositPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            // console.log('textBookNo', textBookNo + `\n` + this.datailLinkDeposit + textDepositPrice + `\n------------------------\n` + textLink)
            let copyText =
              textBookNo +
              `\n` +
              this.datailLinkDeposit +
              textDepositPrice +
              `\n------------------------\n` +
              textLink

            console.log('copyText', copyText)
            this.copyTextBt = copyText
            this.copyTextStatus = true
            this.updateBookingListByDeposit()
          } else {
            this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
          }
        })
    },
    copyFallback () {
      this.dialogShowDeposit = false
      this.$swal('สำเร็จ', 'คัดลอกลิงก์สำเร็จ', 'success')
      this.copyTextStatus = false
    },
    async updateBookingListByDeposit () {
      let urlApi =
        this.DNS_IP +
        '/booking_view/get?shopId=' +
        this.session.data.shopId +
        '&bookNo=' +
        this.bookNo
      await axios.get(urlApi).then(async response => {
        console.log('updateBookingListByDeposit', response.data)
        console.log('this.dataItem', this.dataItem)
        if (response.data.length > 0) {
          let objIndex = this.dataItem.findIndex(
            obj => obj.bookNo === this.bookNo
          )
          this.dataItem[objIndex].remarkDepositLinked =
            response.data[0].remarkDepositLinked || ''
          this.dataItem[objIndex].depositPrice =
            response.data[0].depositPrice || 0
        }
      })
    },
    clearOnsiteChange () {
      this.getDataDefault()
      this.searchOther = ''
      this.showColorSearch = false
      this.statusSearch = 'no'
      this.empSelectJob = ''
    },
    async openCalendaList (date, text) {
      this.dataSummary = []
      this.dataCalendar = []
      let dataJobData = []
      if (text === 'sortNo1') {
        // let jobNo = this.checkEventInfo.filter(el => { return el.start === date && el.sortNo === 2 })[0].jobNo
        await axios
          .get(
            // eslint-disable-next-line quotes
            this.DNS_IP +
              '/job/get?shopId=' +
              this.session.data.shopId +
              '&empStepId=' +
              this.empSelectJob +
              '&dueDate=' +
              date +
              '&sortNo=1' +
              '&checkOnsite=True'
          )
          .then(async response => {
            if (response.data.status === false) {
              dataJobData = []
            } else {
              // dataJobData = response.data
              response.data.forEach(row => {
                if (typeof dataJobData[row.jobNo] === 'undefined') {
                  dataJobData[row.jobNo] = []
                }
                dataJobData[row.jobNo].push(row)
              })
              console.log('dataJobData', dataJobData)
              console.log(
                'checkEventInfo',
                this.checkEventInfo.filter(el => {
                  return el.start === date && el.sortNo === 1
                })
              )
              for (
                let i = 0;
                i <
                this.checkEventInfo.filter(el => {
                  return el.start === date && el.sortNo === 1
                }).length;
                i++
              ) {
                var d = this.checkEventInfo.filter(el => {
                  return el.start === date && el.sortNo === 1
                })[i]
                d.name = dataJobData[d.jobNo].filter(row => {
                  return row.fieldName === 'ชื่อ'
                })
                d.licenseNo = dataJobData[d.jobNo].filter(row => {
                  return row.fieldName === 'เลขทะเบียน'
                })
                d.tel = dataJobData[d.jobNo].filter(row => {
                  return row.fieldName === 'เบอร์โทร'
                })
                d.carModel = dataJobData[d.jobNo].filter(row => {
                  return row.fieldName === 'รุ่นรถ'
                })
                d.name = d.name.length > 0 ? d.name[0].fieldValue : ''
                d.licenseNo =
                  d.licenseNo.length > 0 ? d.licenseNo[0].fieldValue : ''
                d.tel = d.tel.length > 0 ? d.tel[0].fieldValue : ''
                d.carModel =
                  d.carModel.length > 0 ? d.carModel[0].fieldValue : ''
                d.timeDue = dataJobData[d.jobNo][0].timeDue
                d.dueDate = dataJobData[d.jobNo][0].dueDate
                d.bgcolor = 'orange'
                this.dataCalendar.push(d)
              }

              this.dataCalendar.sort((a, b) => {
                let keyA = new Date(a.dueDate)
                let keyB = new Date(b.dueDate)
                if (keyA < keyB) return -1
                if (keyA > keyB) return 1
                return 0
              })
              console.log('this.dataCalendar', this.dataCalendar)
              this.dataSummary = this.dataCalendar.reduce((r, a) => {
                r[a.bgcolor] = r[a.bgcolor] || {}
                r[a.bgcolor][a.timeDue] = r[a.bgcolor][a.timeDue] || []
                r[a.bgcolor][a.timeDue].push(a)
                return r
              }, Object.create(null))
              console.log('this.dataSummary', this.dataSummary)
            }
          })
        this.dialogCalenda = true
      } else {
        await axios
          .get(
            // eslint-disable-next-line quotes
            this.DNS_IP +
              '/job/get?shopId=' +
              this.session.data.shopId +
              '&empStepId=' +
              this.empSelectJob +
              '&dueDate=' +
              date +
              '&sortNo=2' +
              '&checkOnsite=True'
          )
          .then(async response => {
            if (response.data.status === false) {
              dataJobData = []
            } else {
              // dataJobData = response.data
              response.data.forEach(row => {
                if (typeof dataJobData[row.jobNo] === 'undefined') {
                  dataJobData[row.jobNo] = []
                }
                dataJobData[row.jobNo].push(row)
              })
              console.log('dataJobData', dataJobData)
              console.log(
                'checkEventInfo',
                this.checkEventInfo.filter(el => {
                  return el.start === date && el.sortNo === 2
                })
              )
              for (
                let i = 0;
                i <
                this.checkEventInfo.filter(el => {
                  return el.start === date && el.sortNo === 2
                }).length;
                i++
              ) {
                var d = this.checkEventInfo.filter(el => {
                  return el.start === date && el.sortNo === 2
                })[i]
                d.name = dataJobData[d.jobNo].filter(row => {
                  return row.fieldName === 'ชื่อ'
                })[0].fieldValue
                d.licenseNo = dataJobData[d.jobNo].filter(row => {
                  return row.fieldName === 'เลขทะเบียน'
                })[0].fieldValue
                d.tel = dataJobData[d.jobNo].filter(row => {
                  return row.fieldName === 'เบอร์โทร'
                })[0].fieldValue
                d.timeDue = dataJobData[d.jobNo][0].timeDue
                d.dueDate = dataJobData[d.jobNo][0].dueDate
                d.bgcolor = 'blue'
                this.dataCalendar.push(d)
              }

              this.dataCalendar.sort((a, b) => {
                let keyA = new Date(a.dueDate)
                let keyB = new Date(b.dueDate)
                if (keyA < keyB) return -1
                if (keyA > keyB) return 1
                return 0
              })
              console.log('this.dataCalendar', this.dataCalendar)
              this.dataSummary = this.dataCalendar.reduce((r, a) => {
                r[a.bgcolor] = r[a.bgcolor] || {}
                r[a.bgcolor][a.timeDue] = r[a.bgcolor][a.timeDue] || []
                r[a.bgcolor][a.timeDue].push(a)
                return r
              }, Object.create(null))
              console.log('this.dataSummary', this.dataSummary)
            }
          })
        this.dialogCalenda = true
      }
    },
    FunCopy (text) {
      var copyText = document.getElementById('myInput')
      copyText.select()
      copyText.setSelectionRange(0, 99999)
      navigator.clipboard.writeText(copyText.value + '&bookNo=' + this.bookNo)
    },
    getQrCOde (item) {
      this.bookNo = item.bookNo
      this.value = this.Redirect + '&bookNo=' + this.bookNo
      this.dialogQrCode = true
    },
    async prev () {
      this.$refs.calendaronsite.prev()
      // this.getBookingList()
      await this.checkEmpJobCalenda()
    },
    async next () {
      this.$refs.calendaronsite.next()
      // this.getBookingList()
      await this.checkEmpJobCalenda()
    },
    async checkEmpJob () {
      this.today = this.dateStart + '-15'
      const dateSplit = this.today.split('-')
      const year = String(dateSplit[0])
      const month = String(dateSplit[1])
      var flowId = ''
      if (this.flowId !== '') {
        flowId = this.flowId
      } else {
        flowId = this.BookingDataItem[0].flowId
      }
      this.eventInfo = []
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/getCountNotimeJob?shopId=' +
            this.session.data.shopId +
            '&empStep=' +
            this.empSelectJob +
            '&flowId=' +
            flowId +
            '&dueDate=' +
            year +
            '-' +
            month +
            '&checkOnsite=True'
        )
        .then(async responses => {
          if (responses.data.status === false) {
            this.eventInfo = []
            this.checkEventInfo = []
          } else {
            for (var x = 0; x < responses.data.length; x++) {
              var d = responses.data[x]
              // var s = {}
              let dueDate = d.start
              // s.start = d.start
              // s.name = d.name.toString()
              // s.color = 'blue'
              // this.events.push(s)
              if (typeof this.eventInfo[dueDate] === 'undefined') {
                this.eventInfo[dueDate] = {
                  sortNo1: 0,
                  sortNo2: 0,
                  sortNo3: 0
                }
              }
              if (d.sortNo === 1) {
                this.eventInfo[dueDate].sortNo1++
              } else if (d.sortNo === 2) {
                this.eventInfo[dueDate].sortNo2++
              } else if (d.sortNo === 3) {
                this.eventInfo[dueDate].sortNo3++
              }
            }
            this.checkEventInfo = responses.data
            console.log('this.eventInfo', this.eventInfo)
            console.log('this.checkEventInfo', this.checkEventInfo)
          }
        })
      // this.$refs.calendaronsite.checkChange()
      //   }
      // })
    },
    async checkEmpJobCalenda () {
      console.log('this.today', this.today)
      // this.dataEmpOnsite = []
      // this.today = moment(moment(new Date()), 'YYYY-MM-DD').format('YYYY-MM-DD')
      const dateSplit = this.today.split('-')
      const year = String(dateSplit[0])
      const month = String(dateSplit[1])
      var flowId = ''
      if (this.flowId !== '') {
        flowId = this.flowId
      } else {
        flowId = this.BookingDataItem[0].flowId
      }
      this.eventInfo = []
      await axios
        .get(
          this.DNS_IP +
            '/booking_view/getCountNotimeJob?shopId=' +
            this.session.data.shopId +
            '&empStep=' +
            this.empSelectJob +
            '&flowId=' +
            flowId +
            '&dueDate=' +
            year +
            '-' +
            month +
            '&checkOnsite=True'
        )
        .then(async responses => {
          if (responses.data.status === false) {
            this.eventInfo = []
            this.checkEventInfo = []
          } else {
            for (var x = 0; x < responses.data.length; x++) {
              var d = responses.data[x]
              // var s = {}
              let dueDate = d.start
              // s.start = d.start
              // s.name = d.name.toString()
              // s.color = 'blue'
              // this.events.push(s)
              if (typeof this.eventInfo[dueDate] === 'undefined') {
                this.eventInfo[dueDate] = {
                  sortNo1: 0,
                  sortNo2: 0,
                  sortNo3: 0
                }
              }
              if (d.sortNo === 1) {
                this.eventInfo[dueDate].sortNo1++
              } else if (d.sortNo === 2) {
                this.eventInfo[dueDate].sortNo2++
              } else if (d.sortNo === 3) {
                this.eventInfo[dueDate].sortNo3++
              }
            }
            this.checkEventInfo = responses.data
            console.log('this.eventInfo', this.eventInfo)
            console.log('this.checkEventInfo', this.checkEventInfo)
          }
        })
      // this.$refs.calendaronsite.checkChange()
    },
    addEmpJob () {
      this.validate('UPDATE')
      setTimeout(() => this.addEmpJobSubmit(), 500)
    },
    async addEmpJobSubmit () {
      console.log('this.BookingDataItem[0]', this.BookingDataItem[0])
      if (this.$session.id() !== undefined) {
        if (this.validUpdate === true) {
          this.dataEditJobReady = false
          let checkJobno = ''
          await axios
            .get(
              this.DNS_IP +
                '/booking_view/get?bookNo=' +
                this.BookingDataItem[0].bookNo
            )
            .then(async response => {
              let rs = response.data
              console.log('checkJobNoInBooking', rs)
              if (rs.status === false) {
                checkJobno = 'ไม่มีข้อมูล'
              } else {
                checkJobno = rs[0].jobNo || ''
              }
            })
          if (checkJobno === '') {
            let Add = []
            let fielditem = this.flowfieldNameitem
            console.log('fielditem', fielditem)
            for (var i = 0; i < this.BookingDataItem.length; i++) {
              var d = this.BookingDataItem[i]
              let update = {}
              let addData = false
              var dataField = this.editedItemSeleteField.filter(el => {
                return parseInt(el.fieldId) === parseInt(d.fieldId)
              })
              if (
                dataField[0].conditionField === '' ||
                dataField[0].conditionField === null
              ) {
                addData = true
              } else {
                if (
                  fielditem.filter(row => {
                    return row.fieldId === parseInt(d.conditionField)
                  }).length > 0
                ) {
                  console.log('this', fielditem)
                  if (
                    d.conditionValue ===
                    fielditem.filter(row => {
                      return row.fieldId === parseInt(d.conditionField)
                    })[0].fieldValue
                  ) {
                    addData = true
                  } else if (d.conditionField === 'flow') {
                    addData = true
                  }
                } else if (d.conditionField === 'flow') {
                  addData = true
                }
              }
              if (addData) {
                if (d.fieldValue !== '') {
                  update.masBranchID =
                    this.BookingDataItem[0].masBranchID || ''
                  update.CREATE_USER = d.userName
                  update.LAST_USER = d.userName
                  update.packageId = d.packageId
                  update.checkCar = ''
                  // update.userId = d.userId
                  update.endDate = this.endDate
                  update.endTime = this.endTime.value
                  update.fieldId = d.fieldId
                  update.fieldName = d.fieldName
                  update.fieldType = dataField[0].fieldType || ''
                  update.fieldValue = d.fieldValue
                  update.flowId = d.flowId
                  update.empSelect = this.empSelectJob
                  update.empStep = this.empSelectJob
                  update.conditionField = dataField[0].conditionField || ''
                  update.conditionValue = dataField[0].conditionValue || ''
                  update.optionField = dataField[0].optionField || ''
                  update.shopId = dataField[0].shopId || ''
                  update.showCard = dataField[0].showCard || ''
                  update.bookNo = this.BookingDataItem[0].bookNo || ''
                  update.tokenPackage = this.tokenPackage || ''
                  Add.push(update)
                }
              }
            }
            for (var x = 0; x < fielditem.length; x++) {
              var t = fielditem[x]
              if (
                Add.filter(row => {
                  return row.fieldId === t.fieldId
                }).length === 0
              ) {
                let update = {}
                let dataField = this.editedItemSeleteField.filter(el => {
                  return parseInt(el.fieldId) === parseInt(t.fieldId)
                })
                update.masBranchID = this.BookingDataItem[0].masBranchID || ''
                update.CREATE_USER = Add[0].CREATE_USER
                update.LAST_USER = Add[0].CREATE_USER
                update.packageId = Add[0].packageId
                update.checkCar = ''
                // update.userId = Add[0].userId
                update.endDate = this.endDate
                update.endTime = this.endTime.value
                update.fieldId = t.fieldId
                update.fieldName = t.fieldName
                update.fieldType = dataField[0].fieldType || ''
                update.fieldValue = t.fieldValue
                update.flowId = d.flowId
                update.empSelect = this.empSelectJob
                update.empStep = this.empSelectJob
                update.conditionField = dataField[0].conditionField || ''
                update.conditionValue = dataField[0].conditionValue || ''
                update.optionField = dataField[0].optionField || ''
                update.shopId = dataField[0].shopId || ''
                update.showCard = dataField[0].showCard || ''
                update.bookNo = this.BookingDataItem[0].bookNo || ''
                update.tokenPackage = this.tokenPackage || ''
                Add.push(update)
              }
            }
            this.swalConfig.title = 'ต้องการนำรายการนี้ เข้าตารางใช่หรือไม่?'
            this.$swal(this.swalConfig)
              .then(async result => {
                this.dataEditJobReady = false
                await axios
                  .post(this.DNS_IP + '/job/addOneStep', Add)
                  .then(async response => {
                    this.endDate = ''
                    this.endTime = ''
                    this.empSelectJob = ''
                    this.statusShowDateConfiremjob = true
                    if (response.data.status) {
                      this.lineNotifyGroupOnsite(
                        this.BookingDataItem[0].bookNo
                      )
                      if (this.jobCheckPackage) {
                        await this.usePackage(this.BookingDataItem[0].bookNo)
                      }
                      this.$swal('เรียบร้อย', 'นำเข้าสำเร็จ', 'success')
                      if (this.statusSearch === 'no') {
                        await this.getBookingList()
                      } else {
                        await this.searchAny()
                      }
                      this.dialogOnsite = false
                      this.dataEditJobReady = true
                      var dataJob = this.dataItem.filter(el => {
                        return el.bookNo === this.dataQrcode.bookNo
                      })
                      this.getjob(dataJob[0])
                      this.dialogJob = true
                      // var dt = {
                      //   bookNo: this.BookingDataItem[0].bookNo,
                      //   statusJob: 'job',
                      //   jobNo: response.data.jobNo
                      // }
                      // await axios
                      //   .post(this.DNS_IP + '/Booking/editStatus/' + this.BookingDataItem[0].bookNo, dt)
                      //   .then(async response1 => {
                      //     var dtt = {
                      //       bookNo: this.BookingDataItem[0].bookNo,
                      //       contactDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                      //       status: 'confirmJob',
                      //       statusUse: 'use',
                      //       shopId: this.$session.getAll().data.shopId,
                      //       CREATE_USER: this.session.data.userName,
                      //       LAST_USER: this.session.data.userName,
                      //       packageId: this.packageId,
                      //       tokenPackage: this.tokenPackage
                      //     }
                      //     axios
                      //       .post(this.DNS_IP + '/booking_transaction/add', dtt)
                      //       .then(async response => {
                      //         this.lineNotifyGroupOnsite(this.BookingDataItem[0].bookNo)
                      //         if (this.jobCheckPackage) {
                      //           console.log('usePackage')
                      //           await this.usePackage()
                      //         }
                      //         this.$swal('เรียบร้อย', 'นำเข้าสำเร็จ', 'success')
                      //         if (this.statusSearch === 'no') {
                      //           await this.getBookingList()
                      //         } else {
                      //           await this.searchAny()
                      //         }
                      //         this.dialogOnsite = false
                      //         this.dataEditJobReady = true
                      //         var dataJob = this.dataItem.filter(el => { return el.bookNo === this.dataQrcode.bookNo })
                      //         this.getjob(dataJob[0])
                      //         this.dialogJob = true
                      //       })
                      //   })
                    } else {
                      this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
                      this.dialogOnsite = false
                      this.clearOnsiteChange()
                      if (this.statusSearch === 'no') {
                        await this.getBookingList()
                      } else {
                        await this.searchAny()
                      }
                      // this.getTimesChange('update')
                      if (this.getSelectText) {
                        this.getSelect(
                          this.getSelectText,
                          this.getSelectCount,
                          this.filterCloseJobValue
                        )
                      }
                    }
                  })
              })
              .catch(error => {
                setTimeout(() => this.addEmpJobSubmit(), 3000)
                console.log('error function updateJobNo : ', error)
              })
          } else {
            this.$swal(
              'ผิดพลาด',
              'รายการนี้ได้นำเข้ากระดานการทำงานแล้ว',
              'error'
            )
              .then(async response => {
                this.dialogOnsite = false
                this.clearOnsiteChange()
                if (this.statusSearch === 'no') {
                  await this.getBookingList()
                } else {
                  await this.searchAny()
                }
                if (this.getSelectText) {
                  this.getSelect(
                    this.getSelectText,
                    this.getSelectCount,
                    this.filterCloseJobValue
                  )
                }
              })
              .catch(error => {
                console.log('error function addData : ', error)
                this.dialogOnsite = false
                this.clearOnsiteChange()
                if (this.statusSearch === 'no') {
                  this.getBookingList()
                } else {
                  this.searchAny()
                }
                if (this.getSelectText) {
                  this.getSelect(
                    this.getSelectText,
                    this.getSelectCount,
                    this.filterCloseJobValue
                  )
                }
              })
          }
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async lineNotifyGroupOnsite (bookNo) {
      await axios
        .post(this.DNS_IP + '/Booking/LineNotifyGroupOnsite/' + bookNo)
        .then(async response => {
          if (this.lineUserId !== '') {
            var dt = {
              updateStatusSend: 'false'
            }
            await axios
              .post(
                this.DNS_IP + '/BookingOnsite/pushEmpCustomer/' + bookNo,
                dt
              )
              .then(async response1 => {})
          }
        })
    },
    async jobChangeOnsite () {
      console.log('this.jobitem', this.jobitem)
      this.swalConfig.title = 'ต้องการ เปลี่ยนพนักงาน ใช่หรือไม่?'
      this.$swal(this.swalConfig).then(async () => {
        if (this.$session.id() !== undefined) {
          var updateJob = {
            empStep: this.empSelectJob,
            LAST_USER: this.$session.getAll().data.userName
          }
          await axios
            .post(
              this.DNS_IP + '/job/updateJobNo/' + this.jobitem[0].jobNo,
              updateJob
            )
            .then(async response => {
              this.$swal('เรียบร้อย', 'เปลี่ยนพนักงาน เรียบร้อย', 'success')
              if (parseInt(this.jobitem[0].empStepId) !== this.empSelectJob) {
                if (this.jobitem[0].lineUserId !== '') {
                  var dt = {
                    updateStatusSend: 'false',
                    oldEmpName: this.jobitem[0].empStep
                  }
                  await axios
                    .post(
                      this.DNS_IP +
                        '/BookingOnsite/pushEmpCustomer/' +
                        this.jobitem[0].bookNo,
                      dt
                    )
                    .then(async response1 => {})
                }
                var dtNoti = {
                  oldEmpName: this.jobitem[0].empStep
                }
                await axios
                  .post(
                    this.DNS_IP +
                      '/Booking/LineNotifyGroupOnsite/' +
                      this.jobitem[0].bookNo,
                    dtNoti
                  )
                  .then(async response1 => {})
              }
              if (this.statusSearch === 'no') {
                await this.getBookingList()
              } else {
                await this.searchAny()
              }
              this.dialogChangeOnsite = false
              // this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(
                  this.getSelectText,
                  this.getSelectCount,
                  this.filterCloseJobValue
                )
              }
            })
        } else {
          this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
          clearInterval(this.setTimerCalendar)
          this.setTimerCalendar = null
          this.$router.push('/Core/Login')
        }
      })
    },
    async checkShowDataOnsite (text) {
      this.dataReady = false
      if (text === 'ไม่แสดง') {
        this.showOnsite = 'แสดง'
        this.selectOnsite = '&checkOnsite=is null'
      } else {
        this.showOnsite = 'ไม่แสดง'
        this.selectOnsite = '&checkOnsite=True'
      }
      if (this.$route.query.bookNo) {
        // this.beforeCreateScan()
        await this.getDataBranch()
        await this.getEmpSelectAdd()
        await this.getBookingFieldText()
        this.getCustomFieldStart()
        await this.getDataFlow()
        await this.scanQrcode()
        // this.getBookingList()
      } else {
        await this.getDataBranch()
        await this.getEmpSelectAdd()
        await this.getBookingFieldText()
        this.getCustomFieldStart()
        await this.getDataFlow()
        this.getBookingList()
      }
    },
    pushMsgConfirm (bookNo) {
      axios
        .post(this.DNS_IP + '/Booking/pushMsgConfirm/' + bookNo)
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    pushMsgConfirmChangeTime (bookNo) {
      let dt = {
        dueDateOld: this.dueDateOld + ' ' + this.dueDateTimeOld
      }
      axios
        .post(this.DNS_IP + '/Booking/pushMsgConfirmChamgeTime/' + bookNo, dt)
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    pushMsgConfirmEditDataTime (bookNo) {
      let dt = {
        dueDateOld: this.dueDateOld + ' ' + this.dueDateTimeOld,
        flowId: this.flowIdOldEdit
      }
      axios
        .post(this.DNS_IP + '/Booking/pushMsgConfirmChamgeTime/' + bookNo, dt)
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    gotoPicture (Linkitem) {
      window.open(Linkitem, '_blank')
    },
    SetallowedDatesChange (bookingEmpFlow) {
      this.dataEmpAllChange.forEach((v, k) => {
        if (v.empId === bookingEmpFlow) {
          v.dateDayCustom = v.dateDayCustom || ''
          v.dateDayoffValue = v.dateDayoffValue || ''
          if (v.dateDayoffValue !== '') {
            // console.log('if')
            this.dateDayoff = JSON.parse(v.dateDayoffValue)
          } else {
            // console.log('else')
            this.dateDayoff = []
          }
          if (v.dateDayCustom !== '') {
            this.dateDayCustom = JSON.parse(v.dateDayCustom)
          } else {
            this.dateDayCustom = []
          }
        }
      })
      console.log('datoff', this.dateDayoff)
      console.log('Daycustom', this.dateDayCustom)
    },
    SetallowedDatesCancel (bookingEmpFlow) {
      this.dataEmpCancel.forEach((v, k) => {
        if (v.empId === bookingEmpFlow) {
          v.dateDayCustom = v.dateDayCustom || ''
          v.dateDayoffValue = v.dateDayoffValue || ''
          if (v.dateDayoffValue !== '') {
            // console.log('if')
            this.dateDayoff = JSON.parse(v.dateDayoffValue)
          } else {
            // console.log('else')
            this.dateDayoff = []
          }
          if (v.dateDayCustom !== '') {
            this.dateDayCustom = JSON.parse(v.dateDayCustom)
          } else {
            this.dateDayCustom = []
          }
        }
      })
      console.log('datoff', this.dateDayoff)
      console.log('Daycustom', this.dateDayCustom)
    },
    allowedDatesChange (val) {
      if (this.dateDaylimit) {
        if (
          this.dataEmpAllChange.filter(el => el.empId === this.bookingEmpFlow)
            .length > 0
        ) {
          if (
            this.dataEmpAllChange.filter(
              el => el.empId === this.bookingEmpFlow
            )[0].typeDayCustom === 'on'
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
      }
    },
    allowedDatesEdit (val) {
      if (this.dateDaylimit) {
        if (
          this.dataEmpAllChange.filter(
            el => el.empId === this.formEdit.bookingEmpFlow
          ).length > 0
        ) {
          if (
            this.dataEmpAllChange.filter(
              el => el.empId === this.formEdit.bookingEmpFlow
            )[0].typeDayCustom === 'on'
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
      }
    },
    showFileUpload (item, text) {
      if (text === '1') {
        if (item.fileUpload1.includes('[')) {
          this.srcUpload = JSON.parse(item.fileUpload1)
        } else {
          this.srcUpload = item.fileUpload1
        }
      } else {
        if (item.fileUpload2.includes('[')) {
          this.srcUpload = JSON.parse(item.fileUpload2)
        } else {
          this.srcUpload = item.fileUpload2
        }
      }
      this.dialogShowFileUpload = true
    },
    async checkLimit () {
      this.checkLimitBooking.ID = 'NO'
      this.checkLimitBooking.countBooking = 1
      let LimitBooking = await this.getLimitBooking()
      if (LimitBooking.status === false) {
        this.checkLimitBooking.ID = 'NO'
        this.checkLimitBooking.countBooking = 1
        console.log('1257')
      } else {
        let allBookingTime = []
        let setTime = []
        console.log(
          'setLimitBooking',
          this.EmpItemLimitAdd.filter(item => {
            return item.empId === this.formAdd.bookingEmpFlow
          })[0]
        )
        if (
          this.EmpItemLimitAdd.filter(item => {
            return item.empId === this.formAdd.bookingEmpFlow
          })[0].setTimebyday === 'True'
        ) {
          let timeJson = JSON.parse(
            this.EmpItemLimitAdd.filter(item => {
              return item.empId === this.formAdd.bookingEmpFlow
            })[0].setTime
          ).filter(items => items.value === new Date(this.date).getDay())
          setTime = timeJson[0].setTime || []
          console.log('IF++++++++')
        } else {
          console.log('ELSE++++++')
          setTime =
            JSON.parse(
              this.EmpItemLimitAdd.filter(item => {
                return item.empId === this.formAdd.bookingEmpFlow
              })[0].setTime
            ) || []
        }
        let dt = setTime
        LimitBooking.forEach((item, key) => {
          if (dt.filter((i, k) => i.value === item.bookingTime).length > 0) {
            let index = dt.findIndex((i, k) => i.value === item.bookingTime)
            let slot = item.timeSlotCustomer || item.timeSlot
            let num = index + (slot - 1)
            // console.log('value', value, 'index', index, 'slot', slot, num)
            allBookingTime.push(dt.filter((i, k) => k >= index && k <= num))
          }
        })
        let checkTimeSlot = []
        let index = dt.findIndex((i, k) => i.value === this.time.value)
        let slot = ''
        if (this.customerTimeSlot === 'False') {
          slot = this.DataFlowNameDefault.filter(item => {
            return item.value === this.formAdd.flowId
          })[0].allData.timeSlot
        } else {
          slot = this.fromAddTimeCus
        }
        let num = index + (slot - 1)
        checkTimeSlot = dt.filter((i, k) => k >= index && k <= num)
        // console.log('allBookingTime', allBookingTime)
        // console.log('chedkTimeSlot', checkTimeSlot)
        this.checkLimitBooking.limitCheck = 'true'
        this.checkLimitBooking.limitBooking = 1
        this.checkLimitBooking.timeSelect = checkTimeSlot
        this.checkLimitBooking.timeBooking = dt
        this.checkLimitBooking.slotByflow = slot
        if (this.statusVIP === 'False') {
          checkTimeSlot.forEach((item, key) => {
            allBookingTime.forEach((item2, key2) => {
              // console.log('filter', item2.filter((i, n) => i.value === item.value))
              if (item2.filter((i, n) => i.value === item.value).length > 0) {
                this.checkLimitBooking.limitCheck = 'false'
                console.log('เวลาซ้ำกัน')
              } else {
                console.log('เวลาไม่ซ้ำกัน')
              }
            })
          })
        }
      }
      console.log('this.checkLimitBooking', this.checkLimitBooking)
    },
    allowedDates (val) {
      if (this.dateDaylimit) {
        if (
          this.dataEmpAllAdd.filter(
            el => el.empId === this.formAdd.bookingEmpFlow
          ).length > 0
        ) {
          if (
            this.dataEmpAllAdd.filter(
              el => el.empId === this.formAdd.bookingEmpFlow
            )[0].typeDayCustom === 'on'
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
      }
    },
    async setLimitBooking (dateitem) {
      this.time = ''
      this.timeavailable = []
      // this.showTable = []
      let setTime = []
      console.log(
        'setLimitBooking',
        this.EmpItemLimitAdd.filter(item => {
          return item.empId === this.formAdd.bookingEmpFlow
        })[0]
      )
      if (
        this.EmpItemLimitAdd.filter(item => {
          return item.empId === this.formAdd.bookingEmpFlow
        })[0].setTimebyday === 'True'
      ) {
        let timeJson = JSON.parse(
          this.EmpItemLimitAdd.filter(item => {
            return item.empId === this.formAdd.bookingEmpFlow
          })[0].setTime
        ).filter(items => items.value === new Date(dateitem).getDay())
        setTime = timeJson[0].setTime || []
        console.log('IF++++++++')
      } else {
        console.log('ELSE++++++')
        setTime =
          JSON.parse(
            this.EmpItemLimitAdd.filter(item => {
              return item.empId === this.formAdd.bookingEmpFlow
            })[0].setTime
          ) || []
      }
      this.limitBookingCheck =
        this.EmpItemLimitAdd.filter(item => {
          return item.empId === this.formAdd.bookingEmpFlow
        })[0].limitBookingCheck || 'False'
      if (this.limitBookingCheck === 'True') {
        this.timeavailable = setTime
        // let slotByflow = this.DataFlowName.filter((v) => v.value === this.formAdd.flowId)[0].allData.timeSlot
        let slotByflow = []
        if (this.customerTimeSlot === 'False') {
          slotByflow = this.DataFlowNameDefault.filter(
            v => v.value === this.formAdd.flowId
          )[0].allData.timeSlot
        } else {
          slotByflow = this.fromAddTimeCus
        }
        let overTime = this.DataFlowNameDefault.filter(
          v => v.value === this.formAdd.flowId
        )[0].allData.overTime
        if (this.timeavailable.length >= slotByflow) {
          let LimitBooking = await this.getLimitBooking()
          console.log('LimitBooking', LimitBooking)
          // เซ็ต Status ให้แต่ละช่วงเวลา
          this.timeavailable.forEach((v, k) => {
            if (typeof v.status === 'undefined') {
              v.status = true
              if (v.limitBooking === '0') {
                v.status = false
              }
            }
          })
          if (this.statusVIP === 'False') {
            if (LimitBooking.status !== false) {
              if (LimitBooking.length > 0) {
                this.timeavailable.forEach((v, k) => {
                  let bookingTarget = LimitBooking.filter(
                    a => a.bookingTime === v.value
                  )
                  if (bookingTarget.length > 0) {
                    v.status = false
                    let bookingTargetSlot =
                      bookingTarget[0].timeSlotCustomer ||
                      bookingTarget[0].timeSlot
                    for (let bT = 0; bT < bookingTargetSlot; bT++) {
                      if (this.timeavailable[k + bT] !== undefined) {
                        this.timeavailable[k + bT].status = false
                      }
                    }
                  }
                })
              }
            }
            // For ค่าใส่ ตัวแปร array
            let Newtimeavailable = []
            let slotCheck = slotByflow
            for (let i = 0; i < this.timeavailable.length; i++) {
              let num = i + (slotCheck - 1)
              let checkitem = this.timeavailable.filter(
                (item, key) => key >= i && key <= num
              )
              // console.log('checkitem', checkitem, slotCheck)
              Newtimeavailable.push(checkitem)
            }
            // console.log('Newtimeavailable', Newtimeavailable)
            this.timeavailable = []
            Newtimeavailable.forEach((v, k) => {
              // console.log('v.length >= slotCheck', v.length, slotCheck)
              if (overTime === 'True') {
                if (v.filter(v => v.status === false).length <= 0) {
                  this.timeavailable.push(v[0])
                }
              } else {
                console.log('else')
                // ปิดเวลาสุดท้ายในกรณีที่ ไม่ต้องการให้จองเลยเวลา
                if (
                  v.filter(v => v.status === false).length <= 0 &&
                  v.length >= slotCheck
                ) {
                  this.timeavailable.push(v[0])
                }
              }
            })

            // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก
            if (
              moment(dateitem).format('YYYY-MM-DD') ===
              moment().format('YYYY-MM-DD')
            ) {
              this.timeavailable = this.timeavailable.filter(
                item => moment().format(item.value) > moment().format('HH:mm')
              )
            } else {
            }
            console.log('this.timeavailable 4', this.timeavailable)
            // console.log('Newitem', Newtimeavailable)
            if (this.timeavailable.length === 0) {
              this.$swal(
                'คิวเต็มแล้ว',
                'กรุณาเลือกวันที่ใหม่อีกครั้ง',
                'error'
              )
              this.date = ''
            }
          }
        } else {
          this.timeavailable = []
          this.$swal('คิวเต็ม', 'ช่างคนนี้คิวเต็มแล้ว', 'error')
            .then(() => {
              this.date = ''
            })
            .catch(() => {
              this.date = ''
            })
        }
      } else {
        console.log('this.timeavailable ELSEEEEE', this.timeavailable)
        // LimitBookingBy Flow
        this.timeavailable = []
      }
    },
    async getLimitBooking () {
      // console.log('date', this.date)
      // let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDate/get?shopId=' + this.$session.getAll().data.shopId + '&masBranchID=' + this.formAdd.masBranchID + '&bookingDate=' + this.date).then(async (response) => {
      //   let rs = response.data
      //   return rs
      // })
      // return LimitBooking
      let LimitBooking = axios
        .get(
          this.DNS_IP +
            '/LimitBookingDateEmp/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&empId=' +
            this.formAdd.bookingEmpFlow +
            '&bookingDate=' +
            this.date
        )
        .then(async response => {
          let rs = response.data
          return rs
        })
      return LimitBooking
    },
    SetallowedDates () {
      this.dataEmpAllAdd.forEach((v, k) => {
        if (v.empId === this.formAdd.bookingEmpFlow) {
          console.log('dateDayoffValue', v.dateDayoffValue)
          console.log('dateDayCustom', v.dateDayCustom)
          v.dateDayCustom = v.dateDayCustom || ''
          v.dateDayoffValue = v.dateDayoffValue || ''
          if (v.dateDayoffValue !== '') {
            // console.log('if')
            this.dateDayoff = JSON.parse(v.dateDayoffValue)
          } else {
            // console.log('else')
            this.dateDayoff = []
          }
          if (v.dateDayCustom !== '') {
            this.dateDayCustom = JSON.parse(v.dateDayCustom)
          } else {
            this.dateDayCustom = []
          }
        }
      })
    },
    onCopySuccess () {
      this.$swal('เรียบร้อย', 'คัดลอกสำเร็จ', 'success')
    },
    async closeJob () {
      this.loadingCloseJob = true
      if (this.checkPayment === 'True') {
        if (this.formCloseJob.totalPrice !== '') {
          // await this.updateStepEnd()
          this.closeJobSubmit(this.formCloseJob.totalPrice)
        } else {
          this.loadingCloseJob = false
          this.$swal('ผิดพลาด', 'กรุณาใส่จำนวนเงิน', 'error')
        }
      } else {
        // await this.updateStepEnd()
        this.closeJobSubmit('0')
      }
    },
    closeJobSubmit (totalPrice) {
      console.log('form:', this.formCloseJob)
      this.$swal({
        title: 'ให้บริการ เสร็จเรียบร้อยแล้ว ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#fa0202',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      })
        .then(async response => {
          var ID = this.formCloseJob.jobId
          let ds = {
            jobNo: this.formCloseJob.jobNo,
            shopId: this.$session.getAll().data.shopId,
            totalPrice: totalPrice,
            LAST_USER: this.session.data.userName,
            statusDelete: 'true'
          }
          await this.updateStepEnd()
          console.log('ds', ds)
          let checkJob = ''
          await axios
            .get(this.DNS_IP + '/job/getJobNo?jobNo=' + this.formCloseJob.jobNo)
            .then(response => {
              let rs = response.data
              console.log('getJobNo', rs)
              if (rs.length > 0) {
                checkJob = rs[0].RECORD_STATUS
              }
            })
          if (checkJob === 'N') {
            await axios
              .post(this.DNS_IP + '/job/editPrice/' + ID, ds)
              .then(async response => {
                if (
                  this.productExchangeRateId !== '' &&
                  parseInt(totalPrice) > 0 &&
                  this.lineUserId !== ''
                ) {
                  await this.useCoin(totalPrice)
                }
                await this.pushmessagePrice(this.formCloseJob.jobNo)
                this.$swal(
                  'เรียบร้อย',
                  'ให้บริการ เสร็จเรียบร้อยแล้ว',
                  'success'
                )
                if (this.statusSearch === 'no') {
                  await this.getBookingList()
                } else {
                  await this.searchAny()
                }
                // this.getTimesChange('update')
                if (this.getSelectText) {
                  this.getSelect(
                    this.getSelectText,
                    this.getSelectCount,
                    this.filterCloseJobValue
                  )
                }
                this.dialogCloseJob = false
                this.dialogJob = false
                this.loadingCloseJob = false
                this.formCloseJob.totalPrice = 0
              })
          } else {
            this.$swal('ผิดพลาด', 'รายการนี้ปิดงานไปแล้ว', 'error')
            this.dialogCloseJob = false
            this.dialogJob = false
            this.loadingCloseJob = false
            this.formCloseJob.totalPrice = 0
          }
        })
        .catch(error => {
          this.loadingCloseJob = false
          console.log('Close Job Error', error)
        })
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
        .then(async response => {})
    },
    async pushmessagePrice (jobNo) {
      let updateStatusSend = {
        updateStatusSend: 'false',
        checkPayment: this.checkPayment
      }
      await axios
        .post(this.DNS_IP + '/job/pushClosejob/' + jobNo, updateStatusSend)
        .then(console.log(jobNo))
    },
    async getPackage (dt) {
      this.dataPackage = []
      await axios
        .get(
          this.DNS_IP_Loyalty +
            '/PackageLog/get?shopId=' +
            dt.shopId +
            '&userId=' +
            dt.userId +
            '&flowId=' +
            dt.flowId +
            '&checkExpired=T&status=use'
        )
        .then(response => {
          console.log('PackageLog', response.data)
          let rs = response.data
          if (rs.status !== false) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              d.text = d.packageName
              d.value = d.packageId
              this.dataPackage.push(d)
            }
          } else {
            this.dataPackage = []
          }
        })
        .catch(error => {
          this.dataPackage = []
          console.log(error)
        })
    },
    async UpdatePackage (
      packageId,
      StatusPackage,
      packageName,
      data,
      tokenPackage
    ) {
      if (StatusPackage === 'ตกลง') {
        this.packageId = packageId
        this.tokenPackage = tokenPackage
        // this.StatusPackage.status = 'ยกเลิก'
        // this.StatusPackage.color = 'red'
        this.StatusPackage.packageName = packageName
        this.StatusPackage.token = data.token
        // console.log(this.dataPackage.findIndex(x => x.token === tokenPackage && x.packageId === packageId))
        this.modelPackageIndexConfirm =
          this.dataPackage.findIndex(
            x => x.token === tokenPackage && x.packageId === packageId
          ) - 1
        this.modelPackageIndexConfirmJob =
          this.dataPackage.findIndex(
            x => x.token === tokenPackage && x.packageId === packageId
          ) - 1
      } else {
        this.packageId = ''
        this.tokenPackage = ''
        // this.StatusPackage.status = 'ตกลง'
        // this.StatusPackage.color = 'green'
        this.StatusPackage.packageName = ''
        this.StatusPackage.token = ''
        this.modelPackageIndexConfirm = null
        this.modelPackageIndexConfirmJob = null
      }
    },
    updateStatusBookingTransaction (item) {
      this.$swal({
        title: 'ต้องการ ย้ายนัดหมายนี้กลับไปสถานะก่อนหน้า ใช่หรือไม่?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then(async () => {
        var dt = {
          bookNo: item.bookNo,
          contactDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          status: 'wait',
          statusUse: 'use',
          shopId: this.$session.getAll().data.shopId,
          CREATE_USER: this.session.data.userName,
          LAST_USER: this.session.data.userName
        }
        await axios
          .post(this.DNS_IP + '/booking_transaction/add', dt)
          .then(async response => {
            // this.getDataCalendaBooking()
            await this.onUpdateRemark(
              'เนื่องจากลูกค้าไม่สะดวก รอโทรยืนยันอีกครั้ง',
              item.bookNo
            )
            this.$swal(
              'เรียบร้อย',
              'ย้ายนัดหมายนี้กลับไปสถานะก่อนหน้า เรียบร้อย',
              'success'
            )
            // await this.getBookingList()
            // this.getTimesChange('update')
          })
          .catch(error => {
            console.log('error function addData : ', error)
            setTimeout(() => this.confirmChkAdd(), 3000)
          })
      })
    },
    async onUpdateRemark (text, bookNo) {
      var dt = {
        LAST_USER: this.session.data.userName,
        remark: text
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + bookNo,
          dt
        )
        .then(async response => {
          if (this.statusSearch === 'no') {
            await this.getBookingList()
          } else {
            await this.searchAny()
          }
          // this.getTimesChange('update')
          if (this.getSelectText) {
            this.getSelect(
              this.getSelectText,
              this.getSelectCount,
              this.filterCloseJobValue
            )
          }
          clearInterval(this.setTimerCalendar)
          this.setTimerCalendar = null
        })
    },
    async SelectDataHistory () {
      this.HistoryData = []
      this.HistoryData.push(this.defaultData[this.phonenum])
      console.log('this.HistoryData', this.HistoryData)
    },
    async openHistory (item) {
      console.log('item', item)
      this.pictureUrHistory = item.memberPicture
      this.memberName = item.memberName
      const BookingData = await axios
        .get(
          this.DNS_IP +
            '/BookingData/get_history?shopId=' +
            this.$session.getAll().data.shopId +
            '&userId=' +
            item.userId
        )
        .then(async response => {
          return response.data
        })
        .catch(error => {
          console.log('error function addData : ', error)
          return null
        })
      await this.ConvertHistoryData(BookingData)
    },
    async ConvertHistoryData (BookingData) {
      this.HistoryData = []
      this.phonenumItem = []
      // console.log('BookingData', BookingData)
      if (BookingData !== null) {
        if (BookingData.length > 0) {
          this.defaultData = BookingData.reduce((r, a) => {
            let bookNo = a.bookNo
            let filter = a.fieldName === 'เบอร์โทร' ? a.fieldValue : null
            if (filter !== null) {
              r[filter] = r[filter] || {}
              r[filter][bookNo] = r[filter][bookNo] || []
              r[filter][bookNo].push(
                BookingData.filter(item => item.bookNo === a.bookNo)
              )
              if (
                this.phonenumItem.filter(el => {
                  return el === filter
                }).length === 0
              ) {
                this.phonenumItem.push(filter)
              }
            }
            return r
          }, Object.create(null))
          console.log(this.phonenumItem)
          if (this.phonenumItem.length === 1) {
            this.phonenum = this.phonenumItem[0]
            this.SelectDataHistory()
            this.dialogHistory = true
          } else {
            this.phonenum = ''
            this.dialogHistory = true
          }
        } else if (BookingData.status === false) {
          this.$swal(
            'ไม่พบประวัติการเข้ารับบริการ',
            'กรูณาตรวจสอบข้อมูล',
            'info'
          )
          this.dialogHistory = false
        }
      } else {
        this.$swal(
          'พบความผิดพลาดระหว่างดำเนินการ',
          'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่',
          'info'
        )
          .then(result => {
            this.dialogHistory = false
          })
          .catch(error => {
            console.log('error function addData : ', error)
            this.dialogHistory = false
          })
      }

      // console.log('this.HistoryData', this.HistoryData)
    },
    async AddDataTag () {
      await axios
        .get(
          this.DNS_IP +
            '/Mas_Tag/get?shopId=' +
            this.session.data.shopId +
            '&tagName=' +
            this.tagName
        )
        .then(response => {
          let rs = response.data
          console.log('rs', rs)
          if (rs.status === false) {
            this.$swal({
              title: 'ต้องการ เพิ่มข้อมูล ใช่หรือไม่?',
              type: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#b3b1ab',
              confirmButtonText: 'ใช่',
              cancelButtonText: 'ไม่'
            }).then(async () => {
              let dt = {
                tagName: this.tagName,
                CREATE_USER: this.$session.getAll().data.USER_ROLE,
                LAST_USER: this.$session.getAll().data.USER_ROLE,
                shopId: this.$session.getAll().data.shopId
              }
              await axios
                .post(this.DNS_IP + '/Mas_Tag/add', dt)
                .then(async response => {
                  this.$swal('บันทึกข้อมูลเรียบร้อย', ' ', 'success')
                  this.dialogAddTag = false
                  this.getTagData()
                })
                // eslint-disable-next-line handle-callback-err
                .catch(error => {
                  console.log('error function addData : ', error)
                })
            })
          } else {
            this.$swal('มีข้อมูลอยู่แล้ว', ' ', 'error')
          }
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    async getTagData () {
      this.tagItem = await this.getDataFromAPI(
        '/Mas_Tag/get',
        'tagId',
        'tagName',
        ''
      )
    },
    async editTagData () {
      console.log('tagData', this.tagData)
      let dt = {
        tagData: JSON.stringify(this.tagData),
        LAST_USER: this.session.data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/member/edit/" + this.memberId,
          dt
        )
        .then(async response => {
          this.$swal('เรียบร้อย', 'อัพเดท Tag เรียบร้อย', 'success')
          this.dialogTag = false
          if (this.statusSearch === 'no') {
            await this.getBookingList()
          } else {
            await this.searchAny()
          }
          // this.getTimesChange('update')
          if (this.getSelectText) {
            this.getSelect(
              this.getSelectText,
              this.getSelectCount,
              this.filterCloseJobValue
            )
          }
        })
    },
    async editStatusDeposit () {
      this.loadingDeposit = true
      console.log('bookNo', this.bookNo)
      if (this.filesDeposit) {
        const _this = this
        let configDepositUpload = {
          headers: {
            bookNo: this.bookNo
          }
        }
        let params = new FormData()
        params.append('file', this.filesDeposit)
        await axios
          .post(
            this.DNS_IP + `/file/upload/deposit`,
            params,
            configDepositUpload
          )
          .then(function (response) {
            _this.pictureUrlDeposit = response.data
            console.log('url Pic', response.data)
          })
      } else {
        this.pictureUrlDeposit = this.pictureUrlPreviewDeposit
      }
      let dt = {
        depositStatus: 'True',
        depositImge: this.pictureUrlDeposit,
        LAST_USER: this.session.data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + this.bookNo,
          dt
        )
        .then(async response => {
          this.$swal('เรียบร้อย', 'อัพเดทหลักฐานเงินมัดจำเรียบร้อย', 'success')
          this.dialogDeposit = false
          this.pictureUrlDeposit = null
          this.filesDeposit = null
          this.loadingDeposit = false
          this.pictureUrlPreviewDeposit = null
          if (this.statusSearch === 'no') {
            await this.getBookingList()
          } else {
            await this.searchAny()
          }
          // this.getTimesChange('update')
          if (this.getSelectText) {
            this.getSelect(
              this.getSelectText,
              this.getSelectCount,
              this.filterCloseJobValue
            )
          }
        })
    },
    async cancelStatusDeposit () {
      this.loadingDeposit = true
      console.log('bookNo', this.bookNo)
      let dt = {
        depositStatus: 'False',
        LAST_USER: this.session.data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + this.bookNo,
          dt
        )
        .then(async response => {
          this.$swal('เรียบร้อย', 'อัพเดทหลักฐานเงินมัดจำเรียบร้อย', 'success')
          this.pictureUrlDeposit = null
          this.filesDeposit = null
          this.loadingDeposit = false
          this.dialogDeposit = false
          this.statusDeposit = false
          this.pictureUrlPreviewDeposit = null
          if (this.statusSearch === 'no') {
            await this.getBookingList()
          } else {
            await this.searchAny()
          }
          // this.getTimesChange('update')
          if (this.getSelectText) {
            this.getSelect(
              this.getSelectText,
              this.getSelectCount,
              this.filterCloseJobValue
            )
          }
        })
    },
    selectImgDeposit () {
      if (this.filesDeposit) {
        this.pictureUrlPreviewDeposit = URL.createObjectURL(this.filesDeposit)
      } else {
        this.pictureUrlPreviewDeposit = ''
      }
      // console.log(event)
    },
    selectImgAdd () {
      if (this.filesDepositAdd) {
        this.formAdd.pictureUrlPreviewDeposit = URL.createObjectURL(
          this.filesDepositAdd
        )
      } else {
        this.formAdd.pictureUrlPreviewDeposit = ''
      }
      // console.log(event)
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
      } else {
        this.checkDepositAdd = 'False'
      }
      console.log('this.checkDepositAdd', this.checkDepositAdd)
    },
    async getBookingFieldText () {
      if (JSON.parse(localStorage.getItem('typeData')) === null) {
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
    closeSetTimeGetCalenda () {
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
    },
    gotoMap () {
      window.open(
        'https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' +
          this.center.lat +
          ',' +
          this.center.lng,
        '_blank'
      )
      // window.location.href = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=' + this.center.lat + ',' + this.center.lng
    },
    setShowMap (dt) {
      this.center = null
      if (dt.addressLatLong === null && dt.addressLatLong === '') {
        this.center = null
      } else {
        this.center = JSON.parse(dt.addressLatLong)
        this.address = dt.address
        this.dialogMap = true
      }
    },
    async searchAny () {
      if (this.searchOther.trim().length > 1) {
        // this.dataReady = false
        this.selectedStatus = true
        // this.getSelectText = ''
        this.dataItem = []
        this.countWaiting = 0
        this.countConfirm = 0
        this.countCancel = 0
        this.countJob = 0
        this.countAll = 0
        // Clear ช่องค้นหา
        this.searchAll2 = ''
        // this.dataItemSelect = []
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
        await this.getBookingDataList('no', this.searchOther)
        await axios
          .get(
            // eslint-disable-next-line quotes
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
            // console.log('getData', response.data)
            if (response.data.length > 0) {
              for (let i = 0; i < response.data.length; i++) {
                let d = response.data[i]
                let s = {}
                if (
                  dataItems.filter(el => {
                    return el.bookNo === d.bookNo
                  }).length === 0
                ) {
                  // console.log('d.bookNo', d.bookNo)
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
                  let countEndTime = await this.countTime(
                    d.timeText,
                    JSON.parse(d.bookingEmpSetTime) || [],
                    d.timeSlotCustomer
                  )
                  s.dueDate = d.dueDate || ''
                  s.dueDateEnd = countEndTime || ''
                  if (d.timeText === null || d.timeText === '') {
                    d.timeText = d.timeDue
                  }
                  if (s.dueDate === '') {
                    s.dueDateText = 'ไม่มีเวลานัดหมาย'
                  } else {
                    s.dueDateText = d.dueDateTextDay + ' ' + d.timeText
                  }
                  s.shopId = d.shopId
                  s.RECORD_STATUS_Job = d.RECORD_STATUS_Job || ''
                  s.bookingEmpFlow = d.bookingEmpFlow
                  s.bookingEmpFlowName = d.bookingEmpFlowName
                  s.credit_package = d.credit_package
                  s.checkDateConfirmJob = d.checkDateConfirmJob
                  s.dueDateDay = d.dueDateDay
                  s.statusVIP = d.statusVIP
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
                  s.googleCalendarEventId = d.googleCalendarEventId || ''
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
                  s.timeDueHtext = d.timeDueH + ':00'
                  s.timeDuetext = d.timeDue
                  s.address = d.address
                  s.addressLatLong = d.addressLatLong
                  s.countChangeTime = d.countChangeTime || 0
                  s.remarkReturn = d.remarkReturn || ''
                  s.dateReturn = d.dateReturn || ''
                  s.packageId = d.packageId || ''
                  s.tokenPackage = d.tokenPackage || ''
                  s.memberDataTagName = []
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
                    s.memberDataTagName = s.memberDataTagName.join(', ')
                  } catch (error) {
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
                    default:
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
                  // console.log('this.BookingDataListSearch', this.BookingDataList[d.bookNo])
                  // s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
                  // s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
                  // s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
                  // s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                  // s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                  // s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
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
              // await this.getTimesChange('update')
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
              // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
            } else {
              console.log(
                '_!@#_!@#_!@#_!@#_!@_#!@_#',
                dataItems,
                this.dataItem
              )
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
                // console.log('chkTimes', chkTimes)
                if (chkTimes.length === 0) {
                  this.dataItemTime.push(h)
                }
              }
              // await this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(this.getSelectText, 0, this.filterCloseJobValue)
              } else {
                this.getSelect(
                  'wait',
                  this.countWaiting,
                  this.filterCloseJobValue
                )
              }
              // this.dataItemTime = dataItemTimes.sort((a, b) => {
              //   if (a.timeDueHtext < b.timeDueHtext) return -1
              //   return a.timeDueHtext > b.timeDueHtext ? 1 : 0
              // })
              console.log('this.BookingDataList', this.BookingDataList)
              this.dataReady = true
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(error => {
            console.log(error)
            this.dataReady = true
            setTimeout(() => this.searchAny(), 3000)
            //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาใส่คำค้นหาให้มากว่า 1 ตัวอักษร', 'error')
      }
    },
    openRemark (item) {
      this.bookNoRemark = item.bookNo
      this.remark = item.remark
      this.dialogRemark = true
    },
    async openRemarkReturn (item) {
      console.log('openRemarkReturn', item)
      await axios
        .get(this.DNS_IP + '/job/getJobNo?jobNo=' + item.jobNo)
        .then(response => {
          let rs = response.data
          console.log('getJobNo', rs)
          if (rs.length > 0) {
            this.lineUserId = rs[0].lineUserId || ''
          } else {
            this.lineUserId = ''
          }
        })
      this.dateReturn = item.dateReturn
      this.bookNoRemark = item.bookNo
      // this.lineUserId = item.lineUserId
      this.remarkReturn = item.remarkReturn
      this.dialogRemarkReturn = true
    },
    async onSaveRemark () {
      var dt = {
        LAST_USER: this.session.data.userName,
        remark: (this.remark || '').replace(/%/g, '%%')
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + this.bookNoRemark,
          dt
        )
        .then(async response => {
          this.$swal(
            'เรียบร้อย',
            'เปลี่ยนแปลงหมายเหตุเพิ่มเติมเรียบร้อย',
            'success'
          )
          this.dialogRemark = false
          if (this.statusSearch === 'no') {
            await this.getBookingList()
          } else {
            await this.searchAny()
          }
          // this.getTimesChange('update')
          if (this.getSelectText) {
            this.getSelect(
              this.getSelectText,
              this.getSelectCount,
              this.filterCloseJobValue
            )
          }
        })
    },
    async onSaveRemarkReturn () {
      if (this.remarkReturn !== '' && this.dateReturn !== '') {
        var dt = {
          bookNo: this.bookNoRemark,
          remarkReturn: (this.remarkReturn || '').replace(/%/g, '%%'),
          dateReturn: this.dateReturn,
          lineUserId: this.lineUserId,
          shopId: this.session.data.shopId,
          CREATE_USER: this.session.data.userName,
          LAST_USER: this.session.data.userName
        }
        await axios
          .post(
            // eslint-disable-next-line quotes
            this.DNS_IP + "/bookingRemarkReturnLog/addRecordD",
            dt
          )
          .then(async response => {
            this.$swal('เรียบร้อย', 'เปลี่ยนแปลงหมายเหตุเรียบร้อย', 'success')
            this.dialogRemarkReturn = false
            if (this.lineUserId !== '') {
              let pushText = {
                to: this.lineUserId,
                messages: [
                  {
                    type: 'text',
                    text: ` 📣 คุณลูกค้ามีนัด\n 🛎 ${this.remarkReturn}
                          \nวันที่กลับมาใช้บริการ ${this.format_dateNotime(
    this.dateReturn
  )}`
                  }
                ]
              }
              axios
                .post(
                  this.DNS_IP +
                    '/line/pushmessage?shopId=' +
                    this.$session.getAll().data.shopId,
                  pushText
                )
                .catch(error => {
                  console.log('error function addData : ', error)
                })
            }
            if (this.statusSearch === 'no') {
              await this.getBookingList()
            } else {
              await this.searchAny()
            }
            // this.getTimesChange('update')
            if (this.getSelectText) {
              this.getSelect(
                this.getSelectText,
                this.getSelectCount,
                this.filterCloseJobValue
              )
            }
          })
      } else {
        this.$swal(
          'ผิดพลาด',
          'กรุณากรอก หมายเหตุ และวันที่เรียกลูกค้ากลับ',
          'error'
        )
      }
    },
    async setDataEdit (dt) {
      this.customerTimeSlot = 'False'
      this.checkSelectText = dt.statusBt
      // this.dialogEditData = true
      await this.getBookingField()
      // if (dt.statusBt !== 'cancel' && dt.statusBt !== 'confirmJob') {
      //   await this.getEmpEdit(dt.masBranchID)
      // }
      // await this.getBookingData(dt, 'edit')
      console.log('setDataEdit', dt)
      this.dataEdit = dt
      this.userId = dt.userId
      this.BookingDataItemEdit = []
      this.formEdit.masBranchID = dt.masBranchID
      this.setFlowByBranchEdit()
      this.masBranchIDOldEdit = dt.masBranchID
      this.formEdit.bookingEmpFlow = dt.bookingEmpFlow
      this.formEdit.flowId = dt.flowId
      this.flowIdOldEdit = dt.flowId
      this.empSelectEdit = parseInt(dt.empSelect)
      this.statusVIPEdit = dt.statusVIP
      // console.log('statusVIPEdit', this.statusVIPEdit)
      this.dueDateOld = dt.dueDateDay
      this.dueDateTimeOld = dt.timeDuetext
      this.empIdOld = dt.bookingEmpFlow
      // checkTimeEdit
      // this.SetallowedDatesEdit()
      this.dateEdit = dt.dueDateDay
      console.log('dataFlowSelectEdit', this.dataFlowSelectEdit)
      if (dt.statusBt !== 'cancel' && dt.statusBt !== 'confirmJob') {
        this.setEmpEdit()
      }
      // await this.checkCustomerTimeSlotEdit(this.dataEdit)
      // this.checkTimeEdit(this.dataEdit, {flowId: this.formEdit.flowId, bookingEmpFlow: this.formEdit.bookingEmpFlow})
      // this.timeavailable = []
      // // let dtTime = await this.branch.filter(item => { return item.value === this.formEdit.masBranchID })
      // let dtTime = this.dataFlowSelectEdit.filter(item => { return item.value === this.formEdit.flowId }) || []
      // console.log('dtTime', dtTime)
      // if (dtTime.length > 0) {
      //   // console.log('test', JSON.parse(dtTime.map(item => item.allData.setTime)))
      //   console.log('timeavailable', dtTime.map(item => item.allData.setTime))
      //   if (dtTime.map(item => item.allData.setTime)[0] === null || dtTime.map(item => item.allData.setTime)[0] === '') {
      //     this.timeavailable = []
      //     this.timeEdit = ''
      //   } else {
      //     this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
      //     if (this.timeavailable.filter(el => { return el.text === dt.timeText }).length > 0) {
      //       if (dt.timeText) {
      //         this.timeEdit = { text: dt.timeText, value: dt.dueDate.slice(-5) }
      //       } else {
      //         this.timeEdit = { text: dt.dueDate.slice(-5), value: dt.dueDate.slice(-5) }
      //       }
      //     } else {
      //       this.timeEdit = { text: dt.dueDate.slice(-5), value: dt.dueDate.slice(-5) }
      //     }
      //   }
      // }
      console.log('setDataEdit', dt)
      await this.getPackage(dt)
      if (this.dataPackage.length > 0) {
        console.log(
          'dataPackage',
          this.dataPackage.filter(el => {
            return el.packageId === dt.packageId
          })
        )
        if (
          this.dataPackage.filter(el => {
            return el.packageId === dt.packageId
          }).length > 0
        ) {
          var dataPack = this.dataPackage.filter(el => {
            return el.packageId === dt.packageId
          })
          this.dataPackageDefault = true
          // this.packageId = dataPack[0].value
          this.UpdatePackage(
            dataPack[0].value,
            'ตกลง',
            dataPack[0].text,
            dataPack[0],
            dt.tokenPackage
          )
        } else {
          this.UpdatePackage('', 'ยกเลิก', '', '', '')
          this.dataPackageDefault = false
        }
      }
      console.log('setDataEdit', dt)
      var extraJob = ''
      var fastTrack = ''
      if (dt.extraJob === null) {
        extraJob = false
      } else {
        extraJob = dt.extraJob
      }
      if (dt.fastTrack === null) {
        fastTrack = false
      } else {
        fastTrack = dt.fastTrack
      }

      if (!extraJob && !fastTrack) {
        this.formEdit.radiosRemark = 'ซ่อมปกติ'
      } else if (extraJob && !fastTrack) {
        this.formEdit.radiosRemark = 'ExtraJob'
      } else if (!extraJob && fastTrack) {
        this.formEdit.radiosRemark = 'FastTrack'
      }

      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
        )
        .then(async response1 => {
          let rs2 = response1.data
          console.log('BookingField', rs2)
          if (rs2.length > 0) {
            let bookingData = []
            bookingData = JSON.parse(rs2[0].flowfieldName)
            for (let i = 0; i < bookingData.length; i++) {
              let d = bookingData[i]
              itemIncustomField.push(d.fieldId)
            }
            await axios
              .get(
                this.DNS_IP +
                  '/customField/fieldId?fieldId=' +
                  itemIncustomField
              )
              .then(async responses => {
                let rs1 = responses.data
                console.log('customField', rs1)
                await axios
                  .get(
                    this.DNS_IP + '/BookingDataSelect/get?bookNo=' + dt.bookNo
                  )
                  .then(async response => {
                    let rs = response.data
                    console.log('BookingDataSelect', rs)
                    if (rs.length > 0) {
                      let sortrs = rs1.sort(
                        (a, b) => a.sortNoField - b.sortNoField
                      )
                      for (var i = 0; i < sortrs.length; i++) {
                        var d = sortrs[i]
                        var s = {}
                        var dataBD = rs.filter(el => {
                          return parseInt(el.fieldId) === parseInt(d.fieldId)
                        })
                        // console.log('dataBD', dataBD)
                        if (dataBD.length > 0) {
                          s.bookNo = dataBD[0].bookNo
                          s.bookingFieldId = rs2[0].bookingFieldId
                          s.bookingDataId = dataBD[0].bookingDataId
                          s.conditionField = d.conditionField
                          s.fieldId = d.fieldId
                          s.fieldType = d.fieldType
                          s.fieldValue = dataBD[0].fieldValue
                          s.fieldName = d.fieldName
                          s.conditionField = d.conditionField
                          s.conditionValue = d.conditionValue
                          s.requiredField = d.requiredField
                          s.optionField = d.optionField
                          this.BookingDataItemEdit.push(s)
                        } else {
                          s.bookNo = rs[0].bookNo
                          s.bookingFieldId = rs2[0].bookingFieldId
                          s.bookingDataId = 'newDataBooking'
                          s.conditionField = d.conditionField
                          s.fieldId = d.fieldId
                          s.fieldType = d.fieldType
                          s.fieldValue = ''
                          s.fieldName = d.fieldName
                          s.conditionField = d.conditionField
                          s.conditionValue = d.conditionValue
                          s.requiredField = d.requiredField
                          s.optionField = d.optionField
                          this.BookingDataItemEdit.push(s)
                        }
                      }
                    } else {
                      // this.$swal('พบความผิดพลาดระหว่างดำเนินการ', 'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่', 'info').then(result => {
                      //   this.dialogEditData = false
                      // }).catch((error) => {
                      //   console.log('error function setDataEdit : ', error)
                      //   this.dialogEditData = false
                      // })
                      let sortrs = rs1.sort(
                        (a, b) => a.sortNoField - b.sortNoField
                      )
                      for (let i = 0; i < sortrs.length; i++) {
                        let d = sortrs[i]
                        let s = {}
                        // let dataBD = rs.filter(el => { return parseInt(el.fieldId) === parseInt(d.fieldId) })
                        // console.log('dataBD', dataBD)
                        // if (dataBD.length > 0) {
                        s.bookNo = dt.bookNo
                        s.bookingFieldId = rs2[0].bookingFieldId
                        s.bookingDataId = 'newDataBooking'
                        s.conditionField = d.conditionField
                        s.fieldId = d.fieldId
                        s.fieldType = d.fieldType
                        s.fieldValue = ''
                        s.fieldName = d.fieldName
                        s.conditionField = d.conditionField
                        s.conditionValue = d.conditionValue
                        s.requiredField = d.requiredField
                        s.optionField = d.optionField
                        this.BookingDataItemEdit.push(s)
                        // }
                      }
                    }
                  })
                  .catch(error => {
                    this.$swal(
                      'พบความผิดพลาดระหว่างดำเนินการ',
                      'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่',
                      'info'
                    )
                      .then(result => {
                        this.dialogEditData = false
                      })
                      .catch(error => {
                        console.log('error function setDataEdit : ', error)
                        this.dialogEditData = false
                      })
                    console.log('error function setDataEdit : ', error)
                  })
              })
          } else {
            this.$swal(
              'พบความผิดพลาดระหว่างดำเนินการ',
              'กรุณากดปุ่มเพื่อดึงข้อมูลใหม่',
              'info'
            )
              .then(result => {
                this.dialogEditData = false
              })
              .catch(error => {
                console.log('error function setDataEdit : ', error)
                this.dialogEditData = false
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
              this.dialogEditData = false
            })
            .catch(error => {
              console.log('error function setDataEdit : ', error)
              this.dialogEditData = false
            })
          console.log('error function setDataEdit : ', error)
        })
      console.log('this.BookingDataItemEdit', this.BookingDataItemEdit)
      this.dialogEditData = true
    },
    editDataSelect () {
      console.log('flowIdOldEdit', this.flowIdOldEdit, this.formEdit.flowId)
      console.log('formEdit', this.formEdit)
      console.log('dataEdit', this.dataEdit)
      this.validate('EDIT')
      setTimeout(() => this.checkDuplicate(), 500)
      // setTimeout(() => this.editDataSelectSubmit(), 500)
    },
    async checkLimitempEdit () {
      let chkStatLimit = this.dataEmpAllChange.filter(el => {
        return el.empId === this.formEdit.bookingEmpFlow
      })
      if (chkStatLimit.length > 0) {
        if (chkStatLimit[0].limitBookingCheck === 'True') {
          if (this.statusVIP === 'False') {
            let chkStatus = await this.updateLimitBookingChange(
              this.dataEdit,
              this.dueDateOld,
              this.dueDateTimeOld,
              this.dateEdit,
              this.timeEdit.value || this.timeEdit.time,
              this.formEdit.flowId,
              'Edit',
              this.formEdit.masBranchID
            )
            console.log('chkStatus', chkStatus)
            if (chkStatus.status) {
              this.editDataSelectSubmit()
            } else {
              this.$swal('ผิดพลาด', 'เวลาที่ท่านเลือกคิวเต็มแล้ว', 'error')
              this.loadingEdit = false
            }
          } else {
            this.editDataSelectSubmit()
          }
        } else {
          this.editDataSelectSubmit()
        }
      } else {
        this.editDataSelectSubmit()
      }
    },
    async checkDuplicate () {
      if (this.validEdit !== false) {
        this.loadingEdit = true
        this.swalConfig.title = 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?'
        this.$swal(this.swalConfig)
          .then(async result => {
            if (this.getSelectText === 'cancel') {
              this.editDataSelectSubmit()
            } else {
              // this.masBranchIDOldEdit !== this.formEdit.masBranchID
              if (this.formEdit.radiosRemark === 'FastTrack') {
                let getcount = await this.getCountFastTrack(
                  this.dateEdit,
                  this.formEdit.flowId,
                  this.formEdit.masBranchID
                )
                let setCountFast = this.branch.filter(el => {
                  return el.value === this.formEdit.masBranchID
                })[0].allData.countFastTrack
                if (getcount < setCountFast) {
                  if (
                    this.flowIdOldEdit !== this.formEdit.flowId &&
                    this.getSelectText !== 'cancel' &&
                    this.checkSelectText !== 'confirmJob'
                  ) {
                    this.checkLimitempEdit()
                  } else if (
                    this.masBranchIDOldEdit !== this.formEdit.masBranchID &&
                    this.getSelectText !== 'cancel' &&
                    this.checkSelectText !== 'confirmJob'
                  ) {
                    this.checkLimitempEdit()
                  } else if (
                    this.flowIdOldEdit !== this.formEdit.flowId &&
                    this.masBranchIDOldEdit !== this.formEdit.masBranchID &&
                    this.getSelectText !== 'cancel' &&
                    this.checkSelectText !== 'confirmJob'
                  ) {
                    this.checkLimitempEdit()
                  } else {
                    this.editDataSelectSubmit()
                  }
                } else {
                  this.textError = 'จำนวนงานด่วนต่อวัน เกินกว่าที่ตั้งไว้'
                  this.dialogError = true
                  this.loadingEdit = false
                }
              } else {
                if (
                  this.flowIdOldEdit !== this.formEdit.flowId &&
                  this.getSelectText !== 'cancel' &&
                  this.checkSelectText !== 'confirmJob'
                ) {
                  this.checkLimitempEdit()
                } else if (
                  this.masBranchIDOldEdit !== this.formEdit.masBranchID &&
                  this.getSelectText !== 'cancel' &&
                  this.checkSelectText !== 'confirmJob'
                ) {
                  this.checkLimitempEdit()
                } else if (
                  this.flowIdOldEdit !== this.formEdit.flowId &&
                  this.masBranchIDOldEdit !== this.formEdit.masBranchID &&
                  this.getSelectText !== 'cancel' &&
                  this.checkSelectText !== 'confirmJob'
                ) {
                  this.checkLimitempEdit()
                } else {
                  this.editDataSelectSubmit()
                }
                // if (this.flowIdOldEdit !== this.formEdit.flowId && this.getSelectText !== 'cancel' && (this.checkSelectText !== 'confirmJob')) {
                //   let chkStatLimit = this.dataEmpAllChange.filter(el => { return el.empId === this.formEdit.bookingEmpFlow })
                //   if (chkStatLimit.length > 0) {
                //     if (chkStatLimit[0].limitBookingCheck === 'True') {
                //       let chkStatus = await this.updateLimitBookingChange(this.dataEdit, this.dueDateOld, this.dueDateTimeOld, this.dateEdit, this.timeEdit.value || this.timeEdit.time, this.formEdit.flowId, 'Edit', this.formEdit.masBranchID)
                //       console.log('chkStatus', chkStatus)
                //       if (chkStatus.status) {
                //         this.editDataSelectSubmit()
                //       } else {
                //         this.$swal('ผิดพลาด', 'เวลาที่ท่านเลือกคิวเต็มแล้ว', 'error')
                //         this.loadingEdit = false
                //       }
                //     } else {
                //       this.editDataSelectSubmit()
                //     }
                //   } else {
                //     this.editDataSelectSubmit()
                //   }
                // } else {
                //   this.editDataSelectSubmit()
                // }
              }
            }
          })
          .catch(error => {
            this.loadingEdit = false
            console.log('editDataSelectSubmit error', error)
          })
      } else {
        this.loadingEdit = false
      }
    },
    // async checkDuplicate () {
    //   if (this.validEdit !== false) {
    //     this.loadingEdit = true
    //     this.swalConfig.title = 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?'
    //     this.$swal(this.swalConfig)
    //       .then(async result => {
    //         if (this.getSelectText === 'cancel') {
    //           this.editDataSelectSubmit()
    //         } else {
    //           let dtTime = this.dataFlowSelectEdit.filter(item => { return item.value === this.formEdit.flowId }) || []
    //           console.log('dtTime', dtTime)
    //           if (dtTime.length > 0) {
    //             console.log('timeavailable', dtTime.map(item => item.allData.setTime))
    //             if (dtTime.map(item => item.allData.setTime)[0] === null || dtTime.map(item => item.allData.setTime)[0] === '') {
    //               this.timeavailable = []
    //             } else {
    //               this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
    //             }
    //           }
    //           if (this.formEdit.radiosRemark === 'FastTrack') {
    //             let getcount = await this.getCountFastTrack(this.dateEdit, this.formEdit.flowId, this.formEdit.masBranchID)
    //             let setCountFast = this.branch.filter(el => { return el.value === this.formEdit.masBranchID })[0].allData.countFastTrack
    //             if (getcount < setCountFast) {
    //               let chkStatLimit = this.dataFlowSelectEdit.filter(el => { return el.value === this.formEdit.flowId })
    //               console.log('this.getSelectText', this.getSelectText)
    //               if (chkStatLimit.length > 0) {
    //                 if (chkStatLimit[0].allData.limitBookingCheck === 'True') {
    //                   let dueOld = this.dueDateOld + this.dueDateTimeOld
    //                   let dueNew = this.dateEdit + this.timeEdit.value
    //                   let limitBookingCount = this.timeavailable.filter(el => { return el.value === this.timeEdit.value })
    //                   console.log('limitBookingCount', limitBookingCount)
    //                   let limitBookingCounts = 0
    //                   if (limitBookingCount.length > 0) {
    //                     limitBookingCounts = parseInt(limitBookingCount[0].limitBooking)
    //                   } else {
    //                     limitBookingCounts = 0
    //                   }
    //                   if (dueOld !== dueNew) {
    //                     let chkStatus = await this.updateLimitBookingEdit(this.formEdit, this.dueDateOld, this.dueDateTimeOld, this.dateEdit, this.timeEdit.value, limitBookingCounts)
    //                     console.log('chkStatus', chkStatus)
    //                     if (chkStatus.status) {
    //                       this.editDataSelectSubmit()
    //                     } else {
    //                       this.$swal('ผิดพลาด', 'เวลาที่ท่านเลือกคิวเต็มแล้ว', 'error')
    //                       this.loadingEdit = false
    //                     }
    //                   } else if (dueOld === dueNew && this.flowIdOldEdit !== this.formEdit.flowId) {
    //                     let chkStatus = await this.updateLimitBookingEdit(this.formEdit, this.dueDateOld, this.dueDateTimeOld, this.dateEdit, this.timeEdit.value, limitBookingCounts)
    //                     console.log('chkStatus', chkStatus)
    //                     if (chkStatus.status) {
    //                       this.editDataSelectSubmit()
    //                     } else {
    //                       this.$swal('ผิดพลาด', 'เวลาที่ท่านเลือกคิวเต็มแล้ว', 'error')
    //                       this.loadingEdit = false
    //                     }
    //                   } else {
    //                     this.editDataSelectSubmit()
    //                   }
    //                 } else {
    //                   this.editDataSelectSubmit()
    //                 }
    //               } else {
    //                 this.editDataSelectSubmit()
    //               }
    //             } else {
    //               this.textError = 'จำนวนงานด่วนต่อวัน เกินกว่าที่ตั้งไว้'
    //               this.dialogError = true
    //               this.loadingEdit = false
    //             }
    //           } else {
    //             let chkStatLimit = this.dataFlowSelectEdit.filter(el => { return el.value === this.formEdit.flowId })
    //             console.log('this.getSelectText', this.getSelectText)
    //             if (chkStatLimit.length > 0) {
    //               if (chkStatLimit[0].allData.limitBookingCheck === 'True') {
    //                 let dueOld = this.dueDateOld + this.dueDateTimeOld
    //                 let dueNew = this.dateEdit + this.timeEdit.value
    //                 let limitBookingCount = this.timeavailable.filter(el => { return el.value === this.timeEdit.value })
    //                 console.log('limitBookingCount', limitBookingCount)
    //                 let limitBookingCounts = 0
    //                 if (limitBookingCount.length > 0) {
    //                   limitBookingCounts = parseInt(limitBookingCount[0].limitBooking)
    //                 } else {
    //                   limitBookingCounts = 0
    //                 }
    //                 if (dueOld !== dueNew) {
    //                   let chkStatus = await this.updateLimitBookingEdit(this.formEdit, this.dueDateOld, this.dueDateTimeOld, this.dateEdit, this.timeEdit.value, limitBookingCounts)
    //                   console.log('chkStatus', chkStatus)
    //                   if (chkStatus.status) {
    //                     this.editDataSelectSubmit()
    //                   } else {
    //                     this.$swal('ผิดพลาด', 'เวลาที่ท่านเลือกคิวเต็มแล้ว', 'error')
    //                     this.loadingEdit = false
    //                   }
    //                 } else if (dueOld === dueNew && this.flowIdOldEdit !== this.formEdit.flowId) {
    //                   let chkStatus = await this.updateLimitBookingEdit(this.formEdit, this.dueDateOld, this.dueDateTimeOld, this.dateEdit, this.timeEdit.value, limitBookingCounts)
    //                   console.log('chkStatus', chkStatus)
    //                   if (chkStatus.status) {
    //                     this.editDataSelectSubmit()
    //                   } else {
    //                     this.$swal('ผิดพลาด', 'เวลาที่ท่านเลือกคิวเต็มแล้ว', 'error')
    //                     this.loadingEdit = false
    //                   }
    //                 } else {
    //                   this.editDataSelectSubmit()
    //                 }
    //               } else {
    //                 this.editDataSelectSubmit()
    //               }
    //             } else {
    //               this.editDataSelectSubmit()
    //             }
    //           }
    //         }
    //       }).catch(error => {
    //         this.loadingEdit = false
    //         console.log('editDataSelectSubmit error', error)
    //       })
    //   } else {
    //     this.loadingEdit = false
    //   }
    // },
    async editDataSelectSubmit () {
      console.log(
        'dfdfdf',
        this.dataEdit,
        this.dueDateOld,
        this.dueDateTimeOld,
        this.dateEdit,
        this.timeEdit.value || this.timeEdit.time,
        this.formEdit.flowId,
        'Edit',
        this.formEdit.masBranchID
      )
      // if (this.validEdit !== false) {
      if (this.$session.id() !== undefined) {
        let bookNoEditData = ''
        this.dataEditReady = false
        console.log(
          'this.BookingDataItemEdit!!!!!!!',
          this.BookingDataItemEdit
        )
        let rs = this.BookingDataItemEdit
        let Add = []
        let fielditem = this.BookingDataItemEdit
        console.log('this.BookingDataItemEdit', this.BookingDataItemEdit)
        var fastTrack = 'False'
        var extraJob = 'False'
        switch (this.formEdit.radiosRemark) {
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
        for (let i = 0; i < rs.length; i++) {
          let d = rs[i]
          let update = {}
          bookNoEditData = d.bookNo
          if (d.conditionField === '' || d.conditionField === null) {
            update.fieldId = d.fieldId
            update.bookingDataId = d.bookingDataId
            update.bookingFieldId = d.bookingFieldId
            update.bookNo = d.bookNo
            update.fieldValue = (d.fieldValue || '')
              .replace(/%/g, '%%')
              .replace(/'/g, "\\'")
            if (
              this.flowIdOldEdit !== this.formEdit.flowId &&
              this.getSelectText !== 'cancel' &&
              this.checkSelectText !== 'confirmJob'
            ) {
              update.dueDate = this.dateEdit + ' ' + this.timeEdit.value
              update.timeText = this.timeEdit.text
            }
            update.flowId = this.formEdit.flowId
            update.masBranchID = this.formEdit.masBranchID
            update.fastTrack = fastTrack
            update.extraJob = extraJob
            let timeSlotCustomer = null
            if (this.customerTimeSlot === 'True') {
              timeSlotCustomer = this.fromAddTimeCus
            } else {
              timeSlotCustomer = this.DataFlowNameDefault.filter(
                v => v.value === this.formEdit.flowId
              )[0].allData.timeSlot
            }
            update.timeSlotCustomer = timeSlotCustomer
            update.bookingEmpFlow = this.formEdit.bookingEmpFlow
            update.LAST_USER = this.$session.getAll().data.userName
            update.empSelect = this.empSelectEdit
            update.shopId = this.session.data.shopId
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
                update.fieldId = d.fieldId
                update.bookingDataId = d.bookingDataId
                update.bookingFieldId = d.bookingFieldId
                update.bookNo = d.bookNo
                update.fieldValue = (d.fieldValue || '')
                  .replace(/%/g, '%%')
                  .replace(/'/g, "\\'")
                if (
                  this.flowIdOldEdit !== this.formEdit.flowId &&
                  this.getSelectText !== 'cancel' &&
                  this.checkSelectText !== 'confirmJob'
                ) {
                  update.dueDate = this.dateEdit + ' ' + this.timeEdit.value
                  update.timeText = this.timeEdit.text
                }
                update.flowId = this.formEdit.flowId
                update.masBranchID = this.formEdit.masBranchID
                update.fastTrack = fastTrack
                update.extraJob = extraJob
                let timeSlotCustomer = null
                if (this.customerTimeSlot === 'True') {
                  timeSlotCustomer = this.fromAddTimeCus
                } else {
                  timeSlotCustomer = this.DataFlowNameDefault.filter(
                    v => v.value === this.formEdit.flowId
                  )[0].allData.timeSlot
                }
                update.timeSlotCustomer = timeSlotCustomer
                update.bookingEmpFlow = this.formEdit.bookingEmpFlow
                update.LAST_USER = this.$session.getAll().data.userName
                update.empSelect = this.empSelectEdit
                update.shopId = this.session.data.shopId
                Add.push(update)
              }
            } else if (d.conditionField === 'flow') {
              if (
                parseInt(d.conditionValue) === parseInt(this.formEdit.flowId)
              ) {
                update.fieldId = d.fieldId
                update.bookingDataId = d.bookingDataId
                update.bookingFieldId = d.bookingFieldId
                update.bookNo = d.bookNo
                update.fieldValue = (d.fieldValue || '')
                  .replace(/%/g, '%%')
                  .replace(/'/g, "\\'")
                if (
                  this.flowIdOldEdit !== this.formEdit.flowId &&
                  this.getSelectText !== 'cancel' &&
                  this.checkSelectText !== 'confirmJob'
                ) {
                  update.dueDate = this.dateEdit + ' ' + this.timeEdit.value
                  update.timeText = this.timeEdit.text
                }
                update.flowId = this.formEdit.flowId
                update.masBranchID = this.formEdit.masBranchID
                update.fastTrack = fastTrack
                update.extraJob = extraJob
                let timeSlotCustomer = null
                if (this.customerTimeSlot === 'True') {
                  timeSlotCustomer = this.fromAddTimeCus
                } else {
                  timeSlotCustomer = this.DataFlowNameDefault.filter(
                    v => v.value === this.formEdit.flowId
                  )[0].allData.timeSlot
                }
                update.timeSlotCustomer = timeSlotCustomer
                update.bookingEmpFlow = this.formEdit.bookingEmpFlow
                update.LAST_USER = this.$session.getAll().data.userName
                update.empSelect = this.empSelectEdit
                update.shopId = this.session.data.shopId
                Add.push(update)
              }
            }
          }
        }
        console.log('Add', Add)
        // this.swalConfig.title = 'ต้องการ แก้ไขข้อมูล ใช่หรือไม่?'
        // this.$swal(this.swalConfig)
        //   .then(async result => {
        await axios
          .post(
            // eslint-disable-next-line quotes
            this.DNS_IP + "/BookingData/editAdmin",
            Add
          )
          .then(async response => {
            if (this.statusSearch === 'no') {
              await this.getBookingList()
            } else {
              await this.searchAny()
            }
            console.log('statusGoogleCalendar', this.statusGoogleCalendar)
            if (this.statusGoogleCalendar === 'True') {
              this.connectGoogleCalendar('Edit', Add[0].bookNo)
            }
            // this.getTimesChange('update')
            this.formEdit.radiosRemark = ''
            if (this.getSelectText) {
              this.getSelect(
                this.getSelectText,
                this.getSelectCount,
                this.filterCloseJobValue
              )
            }
            // this.getDataCalendaBooking()
            this.dialogEditData = false
            if (this.getSelectText === 'confirm') {
              this.pushMsgConfirmEditDataTime(bookNoEditData)
            }
            this.$swal('เรียบร้อย', 'แก้ไขข้อมูล เรียบร้อย', 'success')
            this.dataEditReady = true
            this.loadingEdit = false
            this.fromAddTimeCus = ''
            this.customerTimeSlot = 'False'
          })
          .catch(error => {
            // this.dataEditReady = true
            setTimeout(() => this.editDataSelectSubmit(), 3000)
            console.log('close alert : ', error)
          })
        // }).catch(error => {
        //   // this.dataEditReady = true
        //   setTimeout(() => this.editDataSelectSubmit(), 3000)
        //   console.log('close alert : ', error)
        // })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
      // }
    },
    async getDataCalendaBooking () {
      console.log('this.$session.id()', this.$session.id())
      try {
        await this.getTagData()
      } catch (e) {
        console.log(e)
      }

      if (this.$session.id() !== undefined) {
        console.log('getDataCalendaBooking')
        try {
          await this.$refs.CalendarBooking.getDataReturn(
            this.selectOnsite,
            this.dateStart,
            this.masBranchID,
            this.flowSelect
          )
        } catch (e) {
          console.log(e)
        }
        // this.$refs.CalendarBooking.getDataFlow()
        // this.$refs.CalendarBooking.getDataBranch()
        // this.$refs.CalendarBooking.getBookingList()
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async getDataCalendaBookingAdd () {
      console.log('this.$session.id()', this.$session.id())
      if (this.$session.id() !== undefined) {
        console.log('getDataCalendaBooking')
        let masBranchID = this.formAdd.masBranchID || this.masBranchID
        let flowSelect = this.formAdd.flowId || this.flowSelect
        console.log('masBranchID', masBranchID)
        console.log('flowSelect', flowSelect)
        try {
          await this.$refs.CalendarBooking.getDataReturn(
            this.selectOnsite,
            this.dateStart,
            masBranchID,
            flowSelect
          )
        } catch (e) {
          console.log(e)
        }
        // this.$refs.CalendarBooking.getDataFlow()
        // this.$refs.CalendarBooking.getDataBranch()
        // this.$refs.CalendarBooking.getBookingList()
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async addDataSet () {
      this.statusdepositPrice = false
      this.datailLinkDeposit = ''
      this.remark = ''
      let _this = this
      this.setTimerCalendar = setInterval(function () {
        _this.getDataCalendaBooking()
      }, 20000)
      // var _this = this
      // this.setTimerCalendar = setInterval(function () { _this.getDataCalendaBooking() }, 30000)
      this.dialogAdd = true
      setTimeout(() => this.getDataCalendaBooking(), 1000)
      if (this.branch.length === 0) {
        this.getDataBranch()
      }
      this.getBookingField()
      this.checkTime()
      this.setFlowAdd()
      this.$refs.CalendarBooking.setdataReturnReady()
    },
    async getDataDefault () {
      this.loadingRefresh = true
      this.$route.query.bookNoNoti = 'None'
      this.searchAll2 = ''
      await this.getDataBranch()
      await this.getEmpSelectAdd()
      this.getCustomFieldStart()
      await this.getDataFlow()
      await this.getBookingList()
      // await this.getTimesChange('update')
      this.getSelect(
        this.getSelectText,
        this.getSelectCount,
        this.filterCloseJobValue
      )
      // this.getDataCalendaBooking()
      this.loadingRefresh = false
    },
    async getDataSetTime () {
      if (this.statusSearch === 'no') {
        await this.getBookingList()
      } else {
        await this.searchAny()
      }
      // await this.getTimesChange('update')
      if (this.getSelectText) {
        this.getSelect(
          this.getSelectText,
          this.getSelectCount,
          this.filterCloseJobValue
        )
      }
    },
    checkTime () {
      // this.timeavailable = []
      console.log('dataFlowSelectAdd', this.dataFlowSelectAdd)
      let dtTime = this.dataFlowSelectAdd.filter(item => {
        return item.value === this.formAdd.flowId
      })
      if (dtTime.length > 0) {
        if (dtTime[0].menuShowStatus === 'True') {
          console.log('IF')
          this.showMenu = 'True'
          this.dataMenuAdd = JSON.parse(dtTime[0].allData.menuItem) || []
        } else {
          console.log('ELSE show menu')
          this.showMenu = 'False'
          this.dataMenuAdd = []
        }
        // let dtTime = this.branch.filter(item => { return item.value === this.formAdd.masBranchID })
        // console.log('test', dtTime)
        // this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
        // console.log('timevailable', this.timeavailable)
        // if (dtTime.map(item => item.allData.setTime) === null) {
        //   this.timeavailable = []
        //   console.log('IF2')
        // } else {
        //   console.log('ELSE2')
        //   this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
        // }
      }
    },
    async checkTimeEditSubmit (dateC, dt) {
      this.timeEdit = ''
      this.timeavailable = []
      console.log('checkTimeEditSubmit', dateC, dt)
      console.log(
        'formEdit',
        this.dueDateOld,
        this.dueDateTimeOld,
        this.empIdOld
      )
      // this.showTable = []
      let setTime = []
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      console.log(
        '!!!!!!!!!!!!!!!!!!!!',
        this.EmpItemLimitChange.filter(item => {
          return item.empId === dt.bookingEmpFlow
        })[0]
      )
      if (
        this.EmpItemLimitChange.filter(item => {
          return item.empId === dt.bookingEmpFlow
        })[0].setTimebyday === 'True'
      ) {
        let timeJson = JSON.parse(
          this.EmpItemLimitChange.filter(item => {
            return item.empId === dt.bookingEmpFlow
          })[0].setTime
        ).filter(items => items.value === new Date(dateC).getDay())
        setTime = timeJson[0].setTime || []
        console.log('IF')
      } else {
        console.log('ELSE')
        setTime =
          JSON.parse(
            this.EmpItemLimitChange.filter(item => {
              return item.empId === dt.bookingEmpFlow
            })[0].setTime
          ) || []
      }
      let dtEmpItemLimitChange = this.EmpItemLimitChange.filter(item => {
        return item.empId === dt.bookingEmpFlow
      })
      console.log('dtEmpItemLimitChange', dtEmpItemLimitChange)
      this.limitBookingCheck =
        dtEmpItemLimitChange.length > 0
          ? dtEmpItemLimitChange[0].limitBookingCheck || 'False'
          : 'False'
      if (this.limitBookingCheck === 'True') {
        this.timeavailable = setTime
        // let slotByflow = this.dataFlowSelectEdit.filter((v) => v.value === dt.flowId)[0].allData.timeSlot
        let slotByflow = []
        if (this.customerTimeSlot === 'False') {
          slotByflow = this.dataFlowSelectEdit.filter(
            v => v.value === dt.flowId
          )[0].allData.timeSlot
        } else {
          slotByflow = this.fromAddTimeCus
        }
        let overTime = this.dataFlowSelectEdit.filter(
          v => v.value === dt.flowId
        )[0].allData.overTime
        if (this.timeavailable.length >= slotByflow) {
          let LimitBooking = await this.getLimitBookingChange(dateC, dt)
          console.log('LimitBooking', LimitBooking)
          // เซ็ต Status ให้แต่ละช่วงเวลา
          this.timeavailable.forEach((v, k) => {
            if (typeof v.status === 'undefined') {
              v.status = true
              if (v.limitBooking === '0') {
                v.status = false
              }
            }
          })
          console.log('timeavailable', this.timeavailable)
          if (this.statusVIPEdit === 'False') {
            if (LimitBooking.status !== false) {
              if (LimitBooking.length > 0) {
                this.timeavailable.forEach((v, k) => {
                  // console.log('dt.timeText', dt.timeText)
                  // console.log('formEdit', this.dueDateOld, this.dueDateTimeOld)
                  let bookingTarget = []
                  if (
                    this.dueDateOld === dateC &&
                    this.empIdOld === dt.bookingEmpFlow
                  ) {
                    console.log('checkTRUE')
                    bookingTarget = LimitBooking.filter(
                      a =>
                        a.bookingTime === v.value &&
                        this.dueDateTimeOld !== a.bookingTime
                    )
                  } else {
                    console.log('checkFALSE')
                    bookingTarget = LimitBooking.filter(
                      a => a.bookingTime === v.value
                    )
                  }
                  if (bookingTarget.length > 0) {
                    v.status = false
                    let bookingTargetSlot =
                      bookingTarget[0].timeSlotCustomer ||
                      bookingTarget[0].timeSlot
                    for (let bT = 0; bT < bookingTargetSlot; bT++) {
                      if (this.timeavailable[k + bT] !== undefined) {
                        this.timeavailable[k + bT].status = false
                      }
                    }
                  }
                })
              }
            }
            // For ค่าใส่ ตัวแปร array
            let Newtimeavailable = []
            let slotCheck = slotByflow
            for (let i = 0; i < this.timeavailable.length; i++) {
              let num = i + (slotCheck - 1)
              let checkitem = this.timeavailable.filter(
                (item, key) => key >= i && key <= num
              )
              console.log('checkitem', checkitem, slotCheck)
              Newtimeavailable.push(checkitem)
            }
            console.log('Newtimeavailable', Newtimeavailable)
            this.timeavailable = []
            Newtimeavailable.forEach((v, k) => {
              // console.log('v.length >= slotCheck', v.length, slotCheck)
              if (overTime === 'True') {
                if (v.filter(v => v.status === false).length <= 0) {
                  this.timeavailable.push(v[0])
                }
              } else {
                // ปิดเวลาสุดท้ายในกรณีที่ ไม่ต้องการให้จองเลยเวลา
                if (
                  v.filter(v => v.status === false).length <= 0 &&
                  v.length >= slotCheck
                ) {
                  console.log('else', v[0])
                  this.timeavailable.push(v[0])
                }
              }
            })

            // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก
            // if (dateC === moment().format('YYYY-MM-DD')) {
            //   this.timeavailable = this.timeavailable.filter(item => moment().format(item.value) > moment().format('HH:mm'))
            // } else {
            // }
            // console.log('this.timeavailable 4', this.timeavailable)
            // console.log('Newitem', Newtimeavailable)
            if (this.timeavailable.length === 0) {
              this.$swal(
                'คิวเต็มแล้ว',
                'กรุณาเลือกวันที่ใหม่อีกครั้ง',
                'error'
              )
              this.date = ''
            }
          }
        } else {
          this.timeavailable = []
          this.$swal('คิวเต็ม', 'ช่างคนนี้คิวเต็มแล้ว', 'error')
            .then(() => {
              this.date = ''
            })
            .catch(() => {
              this.date = ''
            })
        }
      } else {
        console.log('this.timeavailable ELSEEEEE', this.timeavailable)
        // LimitBookingBy Flow
        if (
          this.EmpItemLimitChange.filter(item => {
            return item.empId === dt.bookingEmpFlow
          }).length > 0
        ) {
          this.timeavailable = setTime
        } else {
          this.timeavailable = []
        }
      }
    },
    async checkTimeEdit (dateC, dt) {
      if (
        this.flowIdOldEdit !== this.formEdit.flowId &&
        this.getSelectText !== 'cancel' &&
        this.checkSelectText !== 'confirmJob'
      ) {
        this.checkTimeEditSubmit(dateC, dt)
      } else if (
        this.masBranchIDOldEdit !== this.formEdit.masBranchID &&
        this.getSelectText !== 'cancel' &&
        this.checkSelectText !== 'confirmJob'
      ) {
        this.checkTimeEditSubmit(dateC, dt)
      } else if (
        this.masBranchIDOldEdit !== this.formEdit.masBranchID &&
        this.flowIdOldEdit !== this.formEdit.flowId &&
        this.getSelectText !== 'cancel' &&
        this.checkSelectText !== 'confirmJob'
      ) {
        this.checkTimeEditSubmit(dateC, dt)
      }
    },
    async getLimitBookingChange (dateC, dt) {
      // console.log('date', this.date)
      // let LimitBooking = axios.get(this.DNS_IP + '/LimitBookingDate/get?shopId=' + this.$session.getAll().data.shopId + '&masBranchID=' + this.formAdd.masBranchID + '&bookingDate=' + this.date).then(async (response) => {
      //   let rs = response.data
      //   return rs
      // })
      // return LimitBooking
      let LimitBooking = axios
        .get(
          this.DNS_IP +
            '/LimitBookingDateEmp/get?shopId=' +
            this.$session.getAll().data.shopId +
            '&empId=' +
            dt.bookingEmpFlow +
            '&bookingDate=' +
            dateC
        )
        .then(async response => {
          let rs = response.data
          return rs
        })
      return LimitBooking
    },
    async checkTimeFlow (dateC, dt) {
      this.time = ''
      this.timeavailable = []
      console.log('checkTimeFlow', dateC, '=====', dt)
      // this.showTable = []
      let setTime = []
      // เช็คว่า เวลาในแต่ละวันเหมือนกันรึป่าว
      console.log(
        'EmpItemLimitChange',
        this.EmpItemLimitChange.filter(item => {
          return item.empId === dt.bookingEmpFlow
        })[0]
      )
      if (
        this.EmpItemLimitChange.filter(item => {
          return item.empId === dt.bookingEmpFlow
        })[0].setTimebyday === 'True'
      ) {
        let timeJson = JSON.parse(
          this.EmpItemLimitChange.filter(item => {
            return item.empId === dt.bookingEmpFlow
          })[0].setTime
        ).filter(items => items.value === new Date(dateC).getDay())
        setTime = timeJson[0].setTime || []
        console.log('IF', setTime)
      } else {
        console.log('ELSE', setTime)
        setTime =
          JSON.parse(
            this.EmpItemLimitChange.filter(item => {
              return item.empId === dt.bookingEmpFlow
            })[0].setTime
          ) || []
      }
      this.limitBookingCheck =
        this.EmpItemLimitChange.filter(item => {
          return item.empId === dt.bookingEmpFlow
        })[0].limitBookingCheck || 'False'
      if (this.limitBookingCheck === 'True') {
        this.timeavailable = setTime
        let slotByflow = []
        if (this.customerTimeSlot === 'False') {
          slotByflow = this.DataFlowNameDefault.filter(
            v => v.value === dt.flowId
          )[0].allData.timeSlot
        } else {
          slotByflow = this.fromAddTimeCus
        }
        let overTime = this.DataFlowNameDefault.filter(
          v => v.value === dt.flowId
        )[0].allData.overTime
        if (this.timeavailable.length >= slotByflow) {
          let LimitBooking = await this.getLimitBookingChange(dateC, dt)
          console.log('LimitBooking', LimitBooking)
          // เซ็ต Status ให้แต่ละช่วงเวลา
          this.timeavailable.forEach((v, k) => {
            if (typeof v.status === 'undefined') {
              v.status = true
              if (v.limitBooking === '0') {
                v.status = false
              }
            }
          })
          // console.log('timeavailable', this.timeavailable)
          if (this.statusVIPChang === 'False') {
            if (LimitBooking.status !== false) {
              if (LimitBooking.length > 0) {
                this.timeavailable.forEach((v, k) => {
                  let bookingTarget = []
                  if (this.dueDateOld === dateC) {
                    console.log('checkTRUE')
                    bookingTarget = LimitBooking.filter(
                      a =>
                        a.bookingTime === v.value &&
                        this.dueDateTimeOld !== a.bookingTime
                    )
                  } else {
                    console.log('checkFALSE')
                    bookingTarget = LimitBooking.filter(
                      a => a.bookingTime === v.value
                    )
                  }
                  console.log('bookingTargetSlot', bookingTarget)
                  if (bookingTarget.length > 0) {
                    v.status = false
                    let bookingTargetSlot =
                      bookingTarget[0].timeSlotCustomer ||
                      bookingTarget[0].timeSlot
                    for (let bT = 0; bT < bookingTargetSlot; bT++) {
                      if (this.timeavailable[k + bT] !== undefined) {
                        this.timeavailable[k + bT].status = false
                      }
                    }
                  }
                })
              }
            }
            // For ค่าใส่ ตัวแปร array
            let Newtimeavailable = []
            let slotCheck = slotByflow
            for (let i = 0; i < this.timeavailable.length; i++) {
              let num = i + (slotCheck - 1)
              let checkitem = this.timeavailable.filter(
                (item, key) => key >= i && key <= num
              )
              // console.log('checkitem', checkitem, slotCheck)
              Newtimeavailable.push(checkitem)
            }
            // console.log('Newtimeavailable', Newtimeavailable)
            this.timeavailable = []
            Newtimeavailable.forEach((v, k) => {
              // console.log('v.length >= slotCheck', v.length, slotCheck)
              if (overTime === 'True') {
                if (v.filter(v => v.status === false).length <= 0) {
                  this.timeavailable.push(v[0])
                }
              } else {
                // ปิดเวลาสุดท้ายในกรณีที่ ไม่ต้องการให้จองเลยเวลา
                if (
                  v.filter(v => v.status === false).length <= 0 &&
                  v.length >= slotCheck
                ) {
                  console.log('else', v[0])
                  this.timeavailable.push(v[0])
                }
              }
            })

            // ตัดเวลาในกรณีที่เป็นวันปัจจุบัน เพื่อตัดเวลาที่ผ่านมาแล้วออก
            // if (dateC === moment().format('YYYY-MM-DD')) {
            //   this.timeavailable = this.timeavailable.filter(item => moment().format(item.value) > moment().format('HH:mm'))
            // } else {
            // }
            // console.log('this.timeavailable 4', this.timeavailable)
            // console.log('Newitem', Newtimeavailable)
            if (this.timeavailable.length === 0) {
              this.$swal(
                'คิวเต็มแล้ว',
                'กรุณาเลือกวันที่ใหม่อีกครั้ง',
                'error'
              )
              this.date = ''
            }
          }
        } else {
          this.timeavailable = []
          this.$swal('คิวเต็ม', 'ช่างคนนี้คิวเต็มแล้ว', 'error')
            .then(() => {
              this.date = ''
            })
            .catch(() => {
              this.date = ''
            })
        }
      } else {
        console.log('this.timeavailable ELSEEEEE', this.timeavailable)
        // LimitBookingBy Flow
        this.timeavailable = setTime
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
    async confirmRemark (item, text) {
      console.log('item', item)
      let dt = null
      let errorMessage = ''
      if (text === 'inAdvance') {
        dt = {
          remarkConfirm1: item.remarkConfirm1,
          LAST_USER: this.session.data.userName
        }
      } else if (text === 'inDay') {
        dt = {
          remarkConfirm2: item.remarkConfirm2,
          LAST_USER: this.session.data.userName
        }
      } else if (text === 'extraJob') {
        dt = {
          fastTrack: item.extraJob ? false : item.fastTrack,
          extraJob: item.extraJob,
          LAST_USER: this.session.data.userName
        }
      } else if (text === 'fastTrack') {
        if (item.fastTrack === true) {
          let getcount = await this.getCountFastTrack(
            item.dueDate,
            this.flowSelect,
            this.masBranchID
          )
          let setCountFast = this.branch.filter(el => {
            return el.value === this.masBranchID
          })[0].allData.countFastTrack
          console.log('getcount', getcount)
          console.log('setCountFast', setCountFast)
          if (getcount < setCountFast) {
            dt = {
              extraJob: item.fastTrack ? false : item.extraJob,
              fastTrack: item.fastTrack,
              LAST_USER: this.session.data.userName
            }
          } else {
            dt = null
            item.fastTrack = false
            errorMessage = 'จำนวนงานด่วนต่อวัน เกินกว่าที่ตั้งไว้'
          }
        } else {
          dt = {
            extraJob: item.fastTrack ? false : item.extraJob,
            fastTrack: item.fastTrack,
            LAST_USER: this.session.data.userName
          }
        }
      }
      if (dt) {
        await axios
          .post(this.DNS_IP + '/Booking/edit/' + item.bookNo, dt)
          .then(async response => {
            if (this.statusSearch === 'no') {
              await this.getBookingList()
            } else {
              await this.searchAny()
            }
            // this.getTimesChange('update')
            if (this.getSelectText) {
              this.getSelect(
                this.getSelectText,
                this.getSelectCount,
                this.filterCloseJobValue
              )
            }
            console.log(
              'getSelectText',
              this.getSelectText,
              this.getSelectCount
            )
          })
          .catch(error => {
            console.log('error function addData : ', error)
          })
      } else {
        this.$swal('ผิดพลาด', errorMessage, 'error')
      }
    },
    exportExcelMazda () {
      const url = `${window.location.origin}/mazda/report?shopId=${this.session.data.shopId}&masBranchID=${this.masBranchID}&timeTable=${this.timeTable}${this.selectOnsite}`
      window.open(url, '_blank').focus()
    },
    exportExcel () {
      let dataExport = []
      this.dataexport = []
      let runNo = 0
      // console.log('bookingData', this.BookingDataListTimechange)
      // console.log('this.editedItemSeleteField', this.editedItemSeleteField)
      console.log('this.dataItemTimesChange', this.dataItemTimesChange)
      // console.log('this.dataItemTime', this.dataItemTime)
      var datause = this.dataItemTime.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      for (let i = 0; i < datause.length; i++) {
        // var d = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === item.timeDueHtext })[i]
        let d = datause[i]
        let dataSelect = this.dataItemTimesChange.filter(el => {
          return (
            el.timeDueHtext === d.timeDueHtext &&
            el.fastTrack &&
            (el.statusBtText === 'ยืนยันแล้ว' ||
              el.statusBtText === 'รับรถแล้ว')
          )
        })
        console.log('s.dataSelect', dataSelect)
        if (dataSelect.length > 0) {
          var datauseSelect = dataSelect.sort((a, b) => {
            if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
            return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
          })

          for (let x = 0; x < datauseSelect.length; x++) {
            runNo++
            let t = datauseSelect[x]
            let s = {}
            // console.log('fastTrack')
            // console.log('s.t', t)
            if (
              dataExport.filter(el => {
                return (
                  el.timeDueHtext ===
                  this.format_dateNotime(this.timeTable) +
                    ' ' +
                    d.timeDueHtext +
                    ' ( ' +
                    dataSelect.length.toString() +
                    ' )'
                )
              }).length === 0
            ) {
              s.timeDueHtext =
                this.format_dateNotime(this.timeTable) +
                ' ' +
                d.timeDueHtext +
                ' ( ' +
                dataSelect.length.toString() +
                ' )'
            } else {
              s.timeDueHtext = ''
            }
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter(row => {
              return (
                row.conditionField === 'flow' &&
                String(row.conditionValue) === String(t.flowId)
              )
            })
            fieldflow.forEach(row => {
              let tempField = this.BookingDataListTimechange[t.bookNo].filter(
                row2 => {
                  return String(row2.fieldId) === String(row.fieldId)
                }
              )
              // serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
              let convertTextField = ''
              if (tempField.length > 0) {
                // console.log('fieldType', row.fieldType)
                if (
                  row.fieldType === 'Selects' ||
                  row.fieldType === 'Autocompletes' ||
                  row.fieldType === 'Radio'
                ) {
                  // console.log('optionField', row.optionField)
                  // console.log('fieldValue', tempField[0].fieldValue)
                  if (tempField[0].fieldValue) {
                    convertTextField = JSON.parse(row.optionField).filter(
                      el => {
                        return el.value === tempField[0].fieldValue
                      }
                    )[0].text
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              // console.log('convertTextField', convertTextField)
              serviceDetail +=
                tempField.length > 0 ? convertTextField + ' ' : ''
            })
            serviceDetail = serviceDetail.trim() || t.flowName
            console.log('serviceDetail', serviceDetail)

            s.type = this.dataTypeJob3
            s.runNo = runNo
            s.dateBooking = this.format_dateNotime(this.timeTable)
            s.licenseNo = t.cusReg
            s.title = t.timeDuetext + t.dueDateEnd
            s.status = t.statusBtText
            s.remark = t.remark
            s.cusName = t.cusName
            s.bookingEmpFlowName = t.bookingEmpFlowName
            s.cusReg = t.cusReg
            // s.flowName = serviceDetail
            s.flowName = t.flowName
            s.empFull_NameTH = t.empFull_NameTH
            s.extraJob = t.extraJob ? this.dataTypeJob2 : ''
            s.carModel = this.getDataFromFieldName(
              this.BookingDataListTimechange[t.bookNo],
              'รุ่นรถ'
            )
            s.carModel = s.carModel.length > 0 ? s.carModel[0].fieldValue : ''
            s.tel = t.tel
            s.dataFiled = this.BookingDataListTimechange[t.bookNo] || []
            s.packageName = t.packageName || ''
            s.packageDetails = t.packageDetails || ''
            s.packageImage = t.packageImage || ''
            s.packagePrice = t.packagePrice || ''
            s.packageBalanceAmount = t.packageBalanceAmount || ''
            s.packageAmount = t.packageAmount || ''
            s.packagePoint = t.packagePoint || ''
            s.packageExpire = t.packageExpire || ''
            s.empFull_NameTH = t.empFull_NameTH || ''
            s.statusUpload1 = t.statusUpload1 || 'False'
            s.statusUpload2 = t.statusUpload2 || 'False'
            s.fileUpload1 = t.fileUpload1 || '[]'
            s.fileUpload2 = t.fileUpload2 || '[]'
            dataExport.push(s)
          }
        }
      }
      let s = {}
      s.type = ''
      s.runNo = ''
      s.licenseNo = ''
      s.title = ''
      s.status = ''
      s.cusName = ''
      s.cusReg = ''
      s.flowName = ''
      s.remark = ''
      s.tel = ''
      s.empFull_NameTH = ''
      s.carModel = ''
      s.dataFiled = []
      s.packageName = ''
      s.packageDetails = ''
      s.packageImage = ''
      s.packagePrice = ''
      s.packageBalanceAmount = ''
      s.packageAmount = ''
      s.packagePoint = ''
      s.packageExpire = ''
      s.empFull_NameTH = ''
      s.statusUpload1 = 'False'
      s.statusUpload2 = 'False'
      s.fileUpload1 = '[]'
      s.fileUpload2 = '[]'
      s.bookingEmpFlowName = ''
      dataExport.push(s)
      runNo = 0
      var datause2 = this.dataItemTime.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      for (let i = 0; i < datause2.length; i++) {
        let d = datause2[i]
        let dataSelect = this.dataItemTimesChange.filter(el => {
          return (
            el.timeDueHtext === d.timeDueHtext &&
            !el.fastTrack &&
            (el.statusBtText === 'ยืนยันแล้ว' ||
              el.statusBtText === 'รับรถแล้ว')
          )
        })
        // console.log('s.dataSelect', dataSelect)
        // console.log('this.BookingDataList', this.BookingDataListTimechange)
        if (dataSelect.length > 0) {
          var datauseSelect2 = dataSelect.sort((a, b) => {
            if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
            return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
          })

          for (let x = 0; x < datauseSelect2.length; x++) {
            runNo++
            let t = datauseSelect2[x]
            let s = {}
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter(row => {
              return (
                row.conditionField === 'flow' &&
                String(row.conditionValue) === String(t.flowId)
              )
            })
            fieldflow.forEach(row => {
              let tempField = this.BookingDataListTimechange[t.bookNo].filter(
                row2 => {
                  return String(row2.fieldId) === String(row.fieldId)
                }
              )
              // serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
              let convertTextField = ''
              if (tempField.length > 0) {
                // console.log('fieldType', row.fieldType)
                if (
                  row.fieldType === 'Selects' ||
                  row.fieldType === 'Autocompletes' ||
                  row.fieldType === 'Radio'
                ) {
                  // console.log('optionField', row.optionField)
                  // console.log('fieldValue', tempField[0].fieldValue)
                  if (tempField[0].fieldValue) {
                    convertTextField = JSON.parse(row.optionField).filter(
                      el => {
                        return el.value === tempField[0].fieldValue
                      }
                    )[0].text
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              // console.log('convertTextField', convertTextField)
              serviceDetail +=
                tempField.length > 0 ? convertTextField + ' ' : ''
            })
            if (
              dataExport.filter(el => {
                return (
                  el.timeDueHtext ===
                  this.format_dateNotime(this.timeTable) +
                    ' ' +
                    d.timeDueHtext +
                    ' ( ' +
                    dataSelect.length.toString() +
                    ' )'
                )
              }).length === 0
            ) {
              s.timeDueHtext =
                this.format_dateNotime(this.timeTable) +
                ' ' +
                d.timeDueHtext +
                ' ( ' +
                dataSelect.length.toString() +
                ' )'
            } else {
              s.timeDueHtext = ''
            }
            serviceDetail = serviceDetail.trim() || t.flowName
            s.type = 'ปกติ'
            s.runNo = runNo
            s.dateBooking = this.format_dateNotime(this.timeTable)
            s.licenseNo = t.cusReg
            s.title = t.timeDuetext + t.dueDateEnd
            s.status = t.statusBtText
            s.cusName = t.cusName
            s.bookingEmpFlowName = t.bookingEmpFlowName
            s.remark = t.remark
            s.cusReg = t.cusReg
            // s.flowName = serviceDetail
            s.flowName = t.flowName
            s.tel = t.tel
            s.empFull_NameTH = t.empFull_NameTH
            s.extraJob = t.extraJob ? 'Extra Job' : ''
            s.carModel = this.getDataFromFieldName(
              this.BookingDataListTimechange[t.bookNo],
              'รุ่นรถ'
            )
            s.carModel = s.carModel.length > 0 ? s.carModel[0].fieldValue : ''
            s.dataFiled = this.BookingDataListTimechange[t.bookNo] || []
            s.packageName = t.packageName || ''
            s.packageDetails = t.packageDetails || ''
            s.packageImage = t.packageImage || ''
            s.packagePrice = t.packagePrice || ''
            s.packageBalanceAmount = t.packageBalanceAmount || ''
            s.packageAmount = t.packageAmount || ''
            s.packagePoint = t.packagePoint || ''
            s.packageExpire = t.packageExpire || ''
            s.empFull_NameTH = t.empFull_NameTH || ''
            s.statusUpload1 = t.statusUpload1 || 'False'
            s.statusUpload2 = t.statusUpload2 || 'False'
            s.fileUpload1 = t.fileUpload1 || '[]'
            s.fileUpload2 = t.fileUpload2 || '[]'
            dataExport.push(s)
          }
        }
      }
      this.dataexport = dataExport
      this.onExport()
      // console.log('dataEport', JSON.stringify(dataExport))
    },
    onExport () {
      var dataexport = []
      let checkPackageShow = this.dataexport.filter(el => {
        return el.packageName !== ''
      }).length
      console.log('checkPackageShow', checkPackageShow)
      for (var i = 0; i < this.dataexport.length; i++) {
        var a = this.dataexport[i]
        let data2 = {}
        for (let g = 0; g < a.dataFiled.length; g++) {
          let t = a.dataFiled[g]
          let fieldNames = ''
          let fieldValues = ''
          fieldNames = t.fieldName
          fieldValues = t.fieldValue
          data2[fieldNames] = fieldValues
          // dataOb.push({fieldNames: fieldValues})
        }
        let data1 = {
          ประเภท: a.type,
          ลำดับ: a.runNo,
          วันที่: a.dateBooking,
          เวลา: a.title,
          // 'ชื่อลูกค้า': a.cusName,
          รายการบริการ: a.flowName,
          // 'หมายเหตุ': a.extraJob,
          // 'หมายเหตุยกเลิก': a.remarkRemove,
          // 'เวลาติดตาม': '',
          // 'เหตุผล': '',
          // 'ตรง': '',
          // 'ไม่ตรง': '',
          // 'เปิดJob': '',
          พนักงาน: a.bookingEmpFlowName,
          พนักงานรับนัดหมาย: a.empFull_NameTH

          // 'หมายเหตุเพิ่มเติม': a.remark
        }
        let data4 = {}
        let fileUpload = []
        if (a.statusUpload1 === 'True') {
          let jsDT1 = JSON.parse(a.fileUpload1)
          // console.log('jsDT1', jsDT1, jsDT1.length)
          if (jsDT1.length > 0) {
            for (let element = 0; element < jsDT1.length; element++) {
              let dt = jsDT1[element]
              // console.log('dt1', dt)
              fileUpload.push(dt)
              // data1[`fileUpdate${element + 1}`] = dt
            }
          }
        }
        if (a.statusUpload2 === 'True') {
          let jsDT2 = JSON.parse(a.fileUpload2)
          console.log('jsDT2', jsDT2)
          if (jsDT2.length > 0) {
            for (let element = 0; element < jsDT2.length; element++) {
              let dt = jsDT2[element]
              // console.log('dt2', dt)
              // data1[`fileUpdate${element + 1}`] = dt
              fileUpload.push(dt)
            }
          }
        }
        if (fileUpload.length > 0) {
          for (let element = 0; element < fileUpload.length; element++) {
            let dt = fileUpload[element]
            data4[`fileUpload${element + 1}`] = dt
          }
        }
        if (checkPackageShow > 0) {
          let data3 = {
            แพ็คเกจที่ใช้: a.packageName,
            จำนวนการใช้ที่เหลือ: a.packageBalanceAmount,
            จำนวนการใช้ทั้งหมด: a.packageAmount,
            พนักงานที่รับนัดหมาย: a.empFull_NameTH
          }
          let dataSum = null
          if (fileUpload.length > 0) {
            dataSum = Object.assign({}, data1, data2, data4, data3)
          } else {
            dataSum = Object.assign({}, data1, data2, data3)
          }
          dataexport.push(dataSum)
        } else {
          let dataSum = null
          if (fileUpload.length > 0) {
            dataSum = Object.assign({}, data1, data2, data4)
          } else {
            dataSum = Object.assign({}, data1, data2)
          }
          dataexport.push(dataSum)
        }
      }
      // console.log('dataexport', dataexport)
      const dataWS = XLSX.utils.json_to_sheet(dataexport)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, dataWS)
      XLSX.writeFile(
        wb,
        'export_' + this.format_dateNotime(this.timeTable) + '.xlsx'
      )
    },
    exportExcelRemove () {
      let dataExport = []
      this.dataexportRemove = []
      let runNo = 0
      var datause = this.dataItemTime.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      console.log('!@#!@#!@#!@#!@#!@#', this.dataItemTimesChange)
      // t.timeDuetext + t.dueDateEnd
      for (let i = 0; i < datause.length; i++) {
        // var d = this.dataItemTimesChange.filter(el => { return el.timeDueHtext === item.timeDueHtext })[i]
        let d = datause[i]
        let dataSelect = this.dataItemTimesChange.filter(el => {
          return (
            el.timeDueHtext === d.timeDueHtext &&
            el.fastTrack &&
            el.statusBtText === 'ยกเลิก'
          )
        })
        // console.log('s.dataSelect', dataSelect)
        if (dataSelect.length > 0) {
          var datauseSelect = dataSelect.sort((a, b) => {
            if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
            return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
          })
          for (let x = 0; x < datauseSelect.length; x++) {
            runNo++
            let t = datauseSelect[x]
            let s = {}
            console.log('fastTrack')
            console.log('s.t', t)
            if (
              dataExport.filter(el => {
                return (
                  el.timeDueHtext ===
                  this.format_dateNotime(this.timeTable) +
                    ' ' +
                    d.timeDueHtext +
                    ' ( ' +
                    dataSelect.length.toString() +
                    ' )'
                )
              }).length === 0
            ) {
              s.timeDueHtext =
                this.format_dateNotime(this.timeTable) +
                ' ' +
                d.timeDueHtext +
                ' ( ' +
                dataSelect.length.toString() +
                ' )'
            } else {
              s.timeDueHtext = ''
            }
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter(row => {
              return (
                row.conditionField === 'flow' &&
                String(row.conditionValue) === String(t.flowId)
              )
            })
            fieldflow.forEach(row => {
              let tempField = this.BookingDataListTimechange[t.bookNo].filter(
                row2 => {
                  return String(row2.fieldId) === String(row.fieldId)
                }
              )
              // serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
              let convertTextField = ''
              if (tempField.length > 0) {
                console.log('fieldType', row.fieldType)
                if (
                  row.fieldType === 'Selects' ||
                  row.fieldType === 'Autocompletes' ||
                  row.fieldType === 'Radio'
                ) {
                  console.log('optionField', row.optionField)
                  console.log('fieldValue', tempField[0].fieldValue)
                  if (tempField[0].fieldValue) {
                    convertTextField = JSON.parse(row.optionField).filter(
                      el => {
                        return el.value === tempField[0].fieldValue
                      }
                    )[0].text
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              console.log('convertTextField', convertTextField)
              serviceDetail +=
                tempField.length > 0 ? convertTextField + ' ' : ''
            })
            serviceDetail = serviceDetail.trim() || t.flowName
            s.type = this.dataTypeJob3
            s.runNo = runNo
            s.dateBooking = this.format_dateNotime(this.timeTable)
            s.licenseNo = t.cusReg
            s.remarkRemove = t.remarkRemove
            s.title = t.timeDuetext + t.dueDateEnd
            s.status = t.statusBtText
            s.remark = t.remark
            s.cusName = t.cusName
            s.cusReg = t.cusReg
            // s.flowName = serviceDetail
            s.flowName = t.flowName
            s.empFull_NameTH = t.empFull_NameTH
            s.extraJob = t.extraJob ? this.dataTypeJob2 : ''
            s.tel = t.tel
            s.carModel = this.getDataFromFieldName(
              this.BookingDataListTimechange[t.bookNo],
              'รุ่นรถ'
            )
            s.carModel = s.carModel.length > 0 ? s.carModel[0].fieldValue : ''
            s.dataFiled = this.BookingDataListTimechange[t.bookNo] || []
            dataExport.push(s)
          }
        }
      }
      let s = {}
      s.type = ''
      s.runNo = ''
      s.licenseNo = ''
      s.title = ''
      s.status = ''
      s.cusName = ''
      s.cusReg = ''
      s.remarkRemove = ''
      s.tel = ''
      s.remark = ''
      s.empFull_NameTH = ''
      s.carModel = ''
      s.dataFiled = []
      dataExport.push(s)
      runNo = 0
      var datause2 = this.dataItemTime.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      for (let i = 0; i < datause2.length; i++) {
        let d = datause2[i]
        let dataSelect = this.dataItemTimesChange.filter(el => {
          return (
            el.timeDueHtext === d.timeDueHtext &&
            !el.fastTrack &&
            el.statusBtText === 'ยกเลิก'
          )
        })
        // console.log('s.dataSelect', dataSelect)
        if (dataSelect.length > 0) {
          var datauseSelect2 = dataSelect.sort((a, b) => {
            if (a.dueDateTimeStamp < b.dueDateTimeStamp) return -1
            return a.dueDateTimeStamp > b.dueDateTimeStamp ? 1 : 0
          })
          for (let x = 0; x < datauseSelect2.length; x++) {
            runNo++
            let t = datauseSelect2[x]
            let s = {}
            console.log('normal')
            console.log('s.t', t)
            if (
              dataExport.filter(el => {
                return (
                  el.timeDueHtext ===
                  this.format_dateNotime(this.timeTable) +
                    ' ' +
                    d.timeDueHtext +
                    ' ( ' +
                    dataSelect.length.toString() +
                    ' )'
                )
              }).length === 0
            ) {
              s.timeDueHtext =
                this.format_dateNotime(this.timeTable) +
                ' ' +
                d.timeDueHtext +
                ' ( ' +
                dataSelect.length.toString() +
                ' )'
            } else {
              s.timeDueHtext = ''
            }
            let serviceDetail = ''
            let fieldflow = this.editedItemSeleteField.filter(row => {
              return (
                row.conditionField === 'flow' &&
                String(row.conditionValue) === String(t.flowId)
              )
            })
            fieldflow.forEach(row => {
              let tempField = this.BookingDataListTimechange[t.bookNo].filter(
                row2 => {
                  return String(row2.fieldId) === String(row.fieldId)
                }
              )
              // serviceDetail += (tempField.length > 0 ? tempField[0].fieldValue + ' ' : '')
              let convertTextField = ''
              if (tempField.length > 0) {
                console.log('fieldType', row.fieldType)
                if (
                  row.fieldType === 'Selects' ||
                  row.fieldType === 'Autocompletes' ||
                  row.fieldType === 'Radio'
                ) {
                  console.log('optionField', row.optionField)
                  console.log('fieldValue', tempField[0].fieldValue)
                  if (tempField[0].fieldValue) {
                    convertTextField = JSON.parse(row.optionField).filter(
                      el => {
                        return el.value === tempField[0].fieldValue
                      }
                    )[0].text
                  } else {
                    convertTextField = tempField[0].fieldValue
                  }
                } else {
                  convertTextField = tempField[0].fieldValue
                }
              }
              console.log('convertTextField', convertTextField)
              serviceDetail +=
                tempField.length > 0 ? convertTextField + ' ' : ''
            })
            serviceDetail = serviceDetail.trim() || t.flowName
            s.type = 'ปกติ'
            s.runNo = runNo
            s.dateBooking = this.format_dateNotime(this.timeTable)
            s.licenseNo = t.cusReg
            s.remarkRemove = t.remarkRemove
            s.title = t.timeDuetext + t.dueDateEnd
            s.status = t.statusBtText
            s.remark = t.remark
            s.cusName = t.cusName
            s.cusReg = t.cusReg
            // s.flowName = serviceDetail
            s.flowName = t.flowName
            s.tel = t.tel
            s.empFull_NameTH = t.empFull_NameTH
            s.extraJob = t.extraJob ? 'Extra Job' : ''
            s.carModel = this.getDataFromFieldName(
              this.BookingDataListTimechange[t.bookNo],
              'รุ่นรถ'
            )
            s.carModel = s.carModel.length > 0 ? s.carModel[0].fieldValue : ''
            s.dataFiled = this.BookingDataListTimechange[t.bookNo] || []
            dataExport.push(s)
          }
        }
      }
      this.dataexportRemove = dataExport
      this.onExportRemove()
      console.log('dataEportCancel', JSON.stringify(dataExport))
    },
    onExportRemove () {
      var dataexport = []
      for (var i = 0; i < this.dataexportRemove.length; i++) {
        var a = this.dataexportRemove[i]
        // dataexport.push({
        //   'ประเภท': a.type,
        //   'ลำดับ': a.runNo,
        //   'วันที่': a.dateBooking,
        //   'เวลา': a.title,
        //   'ชื่อลูกค้า': a.cusName,
        //   // 'รุ่นรถ': a.carModel,
        //   // 'ทะเบียน': a.cusReg,
        //   'รายการบริการ': a.flowName,
        //   'เบอร์โทร': a.tel,
        //   'หมายเหตุ': a.extraJob,
        //   'หมายเหตุยกเลิก': a.remarkRemove,
        //   'เวลาติดตาม': '',
        //   'เหตุผล': '',
        //   'ตรง': '',
        //   'ไม่ตรง': '',
        //   'เปิดJob': '',
        //   'พนักงานรับนัดหมาย': a.empFull_NameTH,
        //   'หมายเหตุเพิ่มเติม': a.remark
        // })
        let data2 = {}
        for (let g = 0; g < a.dataFiled.length; g++) {
          let t = a.dataFiled[g]
          let fieldNames = ''
          let fieldValues = ''
          fieldNames = t.fieldName
          fieldValues = t.fieldValue
          data2[fieldNames] = fieldValues
          // dataOb.push({fieldNames: fieldValues})
        }
        let data1 = {
          ประเภท: a.type,
          ลำดับ: a.runNo,
          วันที่: a.dateBooking,
          เวลา: a.title,
          // 'ชื่อลูกค้า': a.cusName,
          รายการบริการ: a.flowName
          // 'หมายเหตุ': a.extraJob,
          // 'หมายเหตุยกเลิก': a.remarkRemove,
          // 'เวลาติดตาม': '',
          // 'เหตุผล': '',
          // 'ตรง': '',
          // 'ไม่ตรง': '',
          // 'เปิดJob': '',
          // 'พนักงานรับนัดหมาย': a.empFull_NameTH,
          // 'หมายเหตุเพิ่มเติม': a.remark
        }
        let dataSum = Object.assign({}, data1, data2)
        dataexport.push(dataSum)
      }
      const dataWS = XLSX.utils.json_to_sheet(dataexport)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, dataWS)
      XLSX.writeFile(
        wb,
        'export_cancel_' + this.format_dateNotime(this.timeTable) + '.xlsx'
      )
    },
    async exportExcelWait () {
      let dataExport = []
      let bookingDataView = []
      this.dataexport = []
      let runNo = 0
      // console.log('bookingData', this.BookingDataListTimechange)
      // console.log('this.editedItemSeleteField', this.editedItemSeleteField)
      // console.log('this.dataItemTimesChange', this.dataItemTimesChange)
      // console.log('this.dataItemTime', this.dataItemTime)
      var datause = this.filteredSelect.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.session.data.shopId}&masBranchID=${this.masBranchID}&statusBt=is null`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach(row => {
              if (typeof bookingDataView[row.bookNo] === 'undefined') {
                bookingDataView[row.bookNo] = []
              }
              bookingDataView[row.bookNo].push(row)
            })
          }
        })
        .catch(error => {
          bookingDataView = []
          console.log(error)
        })
      console.log('datause', datause)
      for (let i = 0; i < datause.length; i++) {
        runNo++
        let t = datause[i]
        let s = {}
        if (t.fastTrack) {
          s.type = this.dataTypeJob3
          s.runNo = runNo
          s.dateBooking = t.dueDateDay
          s.licenseNo = t.cusReg
          s.title = t.timeDuetext + t.dueDateEnd
          s.status = t.statusBtText
          s.remark = t.remark
          s.cusName = t.cusName
          s.cusReg = t.cusReg
          s.flowName = t.displayFlowName
            ? t.flowName + ' : ' + t.displayFlowName
            : t.flowName
          // s.flowName = t.flowName
          s.empFull_NameTH = t.empFull_NameTH
          s.extraJob = t.extraJob ? this.dataTypeJob2 : ''
          // s.carModel = this.getDataFromFieldName(this.BookingDataListTimechange[t.bookNo], 'รุ่นรถ')
          // s.carModel = (s.carModel.length > 0) ? s.carModel[0].fieldValue : ''
          s.carModel = t.bookingDataCustomerCarModel || ''
          s.tel = t.tel
          s.dataFiled = bookingDataView[t.bookNo] || []
          s.packageName = t.packageName || ''
          s.packageDetails = t.packageDetails || ''
          s.packageImage = t.packageImage || ''
          s.packagePrice = t.packagePrice || ''
          s.packageBalanceAmount = t.packageBalanceAmount || ''
          s.packageAmount = t.packageAmount || ''
          s.packagePoint = t.packagePoint || ''
          s.packageExpire = t.packageExpire || ''
          s.memberName = t.memberName || ''
          s.statusUpload1 = t.statusUpload1 || 'False'
          s.statusUpload2 = t.statusUpload2 || 'False'
          s.fileUpload1 = t.fileUpload1 || '[]'
          s.fileUpload2 = t.fileUpload2 || '[]'
          dataExport.push(s)
        }
      }
      console.log('dataExport', dataExport)
      let s = {}
      s.memberName = ''
      s.type = ''
      s.runNo = ''
      s.licenseNo = ''
      s.title = ''
      s.status = ''
      s.cusName = ''
      s.bookingEmpFlowName = ''
      s.cusReg = ''
      s.flowName = ''
      s.remark = ''
      s.tel = ''
      s.empFull_NameTH = ''
      s.carModel = ''
      s.dataFiled = []
      s.packageName = ''
      s.packageDetails = ''
      s.packageImage = ''
      s.packagePrice = ''
      s.packageBalanceAmount = ''
      s.packageAmount = ''
      s.packagePoint = ''
      s.packageExpire = ''
      s.empFull_NameTH = ''
      s.statusUpload1 = 'False'
      s.statusUpload2 = 'False'
      s.fileUpload1 = '[]'
      s.fileUpload2 = '[]'
      dataExport.push(s)
      runNo = 0
      var datause2 = this.filteredSelect.sort((a, b) => {
        if (a.timeDuetext < b.timeDuetext) return -1
        return a.timeDuetext > b.timeDuetext ? 1 : 0
      })
      for (let i = 0; i < datause2.length; i++) {
        runNo++
        let t = datause2[i]
        let s = {}
        if (!t.fastTrack) {
          s.type = 'ปกติ'
          s.runNo = runNo
          s.dateBooking = t.dueDateDay
          s.licenseNo = t.cusReg
          s.title = t.timeDuetext + t.dueDateEnd
          s.status = t.statusBtText
          s.cusName = t.cusName
          s.bookingEmpFlowName = t.bookingEmpFlowName
          s.remark = t.remark
          s.cusReg = t.cusReg
          s.flowName = t.displayFlowName
            ? t.flowName + ' : ' + t.displayFlowName
            : t.flowName
          // s.flowName = t.flowName
          s.tel = t.tel
          s.empFull_NameTH = t.empFull_NameTH
          s.extraJob = t.extraJob ? 'Extra Job' : ''
          s.carModel = t.bookingDataCustomerCarModel || ''
          s.dataFiled = bookingDataView[t.bookNo] || []
          s.packageName = t.packageName || ''
          s.packageDetails = t.packageDetails || ''
          s.packageImage = t.packageImage || ''
          s.packagePrice = t.packagePrice || ''
          s.packageBalanceAmount = t.packageBalanceAmount || ''
          s.packageAmount = t.packageAmount || ''
          s.packagePoint = t.packagePoint || ''
          s.packageExpire = t.packageExpire || ''
          s.memberName = t.memberName || ''
          s.statusUpload1 = t.statusUpload1 || 'False'
          s.statusUpload2 = t.statusUpload2 || 'False'
          s.fileUpload1 = t.fileUpload1 || '[]'
          s.fileUpload2 = t.fileUpload2 || '[]'
          dataExport.push(s)
        }
      }
      this.dataexport = dataExport
      this.onExportWait()
      // console.log('dataEport', JSON.stringify(dataExport))
    },
    onExportWait () {
      var dataexport = []
      let checkPackageShow = this.dataexport.filter(el => {
        return el.packageName !== ''
      }).length
      console.log('checkPackageShow', checkPackageShow)
      for (var i = 0; i < this.dataexport.length; i++) {
        var a = this.dataexport[i]
        let data2 = {}
        for (let g = 0; g < a.dataFiled.length; g++) {
          let t = a.dataFiled[g]
          let fieldNames = ''
          let fieldValues = ''
          fieldNames = t.fieldName
          fieldValues = t.fieldValue
          data2[fieldNames] = fieldValues
          // dataOb.push({fieldNames: fieldValues})
        }
        let data1 = {
          ประเภท: a.type,
          ลำดับ: a.runNo,
          วันที่: a.dateBooking,
          เวลา: a.title,
          // 'ชื่อลูกค้า': a.cusName,
          รายการบริการ: a.flowName,
          // 'หมายเหตุ': a.extraJob,
          // 'หมายเหตุยกเลิก': a.remarkRemove,
          // 'เวลาติดตาม': '',
          // 'เหตุผล': '',
          // 'ตรง': '',
          // 'ไม่ตรง': '',
          // 'เปิดJob': '',
          พนักงานช่าง: a.bookingEmpFlowName,
          พนักงานรับนัดหมาย: a.empFull_NameTH,
          'ชื่อ LINE': a.memberName
          // 'หมายเหตุเพิ่มเติม': a.remark
        }
        let data4 = {}
        let fileUpload = []
        if (a.statusUpload1 === 'True') {
          let jsDT1 = JSON.parse(a.fileUpload1)
          // console.log('jsDT1', jsDT1, jsDT1.length)
          if (jsDT1.length > 0) {
            for (let element = 0; element < jsDT1.length; element++) {
              let dt = jsDT1[element]
              // console.log('dt1', dt)
              fileUpload.push(dt)
              // data1[`fileUpdate${element + 1}`] = dt
            }
          }
        }
        if (a.statusUpload2 === 'True') {
          let jsDT2 = JSON.parse(a.fileUpload2)
          console.log('jsDT2', jsDT2)
          if (jsDT2.length > 0) {
            for (let element = 0; element < jsDT2.length; element++) {
              let dt = jsDT2[element]
              // console.log('dt2', dt)
              // data1[`fileUpdate${element + 1}`] = dt
              fileUpload.push(dt)
            }
          }
        }
        if (fileUpload.length > 0) {
          for (let element = 0; element < fileUpload.length; element++) {
            let dt = fileUpload[element]
            data4[`fileUpload${element + 1}`] = dt
          }
        }
        if (checkPackageShow > 0) {
          let data3 = {
            แพ็คเกจที่ใช้: a.packageName,
            จำนวนการใช้ที่เหลือ: a.packageBalanceAmount,
            จำนวนการใช้ทั้งหมด: a.packageAmount,
            พนักงานที่รับนัดหมาย: a.empFull_NameTH
          }
          let dataSum = null
          if (fileUpload.length > 0) {
            dataSum = Object.assign({}, data1, data2, data4, data3)
          } else {
            dataSum = Object.assign({}, data1, data2, data3)
          }
          dataexport.push(dataSum)
        } else {
          let dataSum = null
          if (fileUpload.length > 0) {
            dataSum = Object.assign({}, data1, data2, data4)
          } else {
            dataSum = Object.assign({}, data1, data2)
          }
          dataexport.push(dataSum)
        }
      }
      // console.log('dataexport', dataexport)
      const dataWS = XLSX.utils.json_to_sheet(dataexport)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, dataWS)
      XLSX.writeFile(wb, 'export_wait_status.xlsx')
    },
    toggle () {
      this.timeTable = moment(moment(new Date(), 'YYYY-MM-DD').toDate()).format(
        'YYYY-MM-DD'
      )
      this.getTimesChange('update')
      this.drawer = !this.drawer
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
    async getBookingListJob (item) {
      await this.getEmpChange(item)
      let dateCurrent = moment().format('YYYY-MM-DD')
      let dueDate = item.dueDateDay
      if (dateCurrent >= dueDate) {
        this.statusConfirmJob = true
      } else {
        this.dueDate = item.dueDate
        this.statusConfirmJob = false
      }
      if (this.statusConfirmJob) {
        this.endDate = moment().format('YYYY-MM-DD')
        this.endTime = moment().format('HH:mm')
        this.statusShowDateConfiremjob = false
        this.dataQrcode = item
        this.dataReady = false
        this.selectedStatus = true
        // this.getSelectText = ''
        this.dataItem = []
        this.countWaiting = 0
        this.countConfirm = 0
        this.countCancel = 0
        this.countJob = 0
        this.countAll = 0
        // Clear ช่องค้นหา
        this.searchAll2 = ''
        // this.dataItemSelect = []
        var dataItemTimes = []
        var dataItems = []
        this.BookingDataList = []
        if (this.branch.length === 0) {
          await this.getDataBranch()
        }
        await axios
          .get(
            // eslint-disable-next-line quotes
            this.DNS_IP +
              '/booking_view/getJob?shopId=' +
              this.session.data.shopId +
              '&bookNo=' +
              item.bookNo
          )
          .then(async response => {
            // console.log('getData', response.data)
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
                  s.flowName = d.flowName
                  s.dueDate = d.dueDate
                  s.shopId = d.shopId
                  s.packageName = d.packageName
                  s.packageDetails = d.packageDetails
                  s.packageImage = d.packageImage
                  s.packagePrice = d.packagePrice
                  s.packageBalanceAmount = d.packageBalanceAmount
                  s.packageAmount = d.packageAmount
                  s.packagePoint = d.packagePoint
                  s.packageExpire = d.packageExpire
                  s.remark = d.remark || ''
                  s.masBranchID = d.masBranchID
                  s.googleCalendarEventId = d.googleCalendarEventId || ''
                  s.empSelect = d.empSelect
                  s.empFull_NameTH = d.empFull_NameTH || ''
                  s.empFull_NameTH = s.empFull_NameTH.replace('นางสาว', '')
                  s.empFull_NameTH = s.empFull_NameTH.replace('นาย', '')
                  s.empFull_NameTH = s.empFull_NameTH.replace('นาง', '')
                  s.userId = d.userId
                  s.chkConfirm = false
                  s.chkCancel = false
                  s.jobNo = d.jobNo
                  s.remarkRemove = d.remarkRemove || ''
                  s.remarkConfirm1 =
                    d.remarkConfirm1 === 'true' || d.remarkConfirm1 === 'True'
                  s.remarkConfirm2 =
                    d.remarkConfirm2 === 'true' || d.remarkConfirm2 === 'True'
                  s.extraJob = d.extraJob === 'true' || d.extraJob === 'True'
                  s.fastTrack =
                    d.fastTrack === 'true' || d.fastTrack === 'True'
                  s.lineUserId = d.lineUserId
                  s.memberPicture = d.memberPicture
                  s.timeDueHtext = d.timeDueH + ':00'
                  s.timeDuetext = d.timeDue

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
                    default:
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
                  let dataBookingData = []
                  await axios
                    .get(
                      // eslint-disable-next-line quotes
                      this.DNS_IP + "/BookingData/getView?bookNo=" + d.bookNo
                    )
                    .then(async responses => {
                      console.log('getDataData', responses.data)
                      dataBookingData = responses.data
                      if (responses.data.status !== false) {
                        responses.data.forEach(row => {
                          if (
                            typeof this.BookingDataList[row.bookNo] ===
                            'undefined'
                          ) {
                            this.BookingDataList[row.bookNo] = []
                          }
                          this.BookingDataList[row.bookNo].push(row)
                        })
                      }
                      // this.BookingDataList[dataBookingData[0].bookNo].push(dataBookingData[0])
                    })
                  s.cusName = dataBookingData.filter(function (el) {
                    return el.fieldName === 'ชื่อ'
                  })
                  s.cusReg = dataBookingData.filter(function (el) {
                    return el.fieldName === 'เลขทะเบียน'
                  })
                  s.tel = dataBookingData.filter(function (el) {
                    return el.fieldName === 'เบอร์โทร'
                  })
                  s.cusName =
                    s.cusName.length > 0 ? s.cusName[0].fieldValue : ''
                  s.cusReg = s.cusReg.length > 0 ? s.cusReg[0].fieldValue : ''
                  s.tel = s.tel.length > 0 ? s.tel[0].fieldValue : ''
                  // s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
                  // s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
                  // s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
                  // s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
                  // s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
                  // s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
                  dataItems.push(s)
                }
              }
            }
            if (dataItems.length === 0 || dataItems.status === false) {
              this.dataItem = []
              this.dataItemTime = []
              this.dataReady = true
              // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
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
                // console.log('chkTimes', chkTimes)
                if (chkTimes.length === 0) {
                  // console.log('datause(H)', h)
                  this.dataItemTime.push(h)
                }
              }
              this.masBranchID = this.dataItem[0].masBranchID
              console.log('dtTime', this.dataItem[0].masBranchID)
              await this.getBookingData(this.dataItem[0])
              if (
                this.EmpItemLimitChange.filter(items => {
                  return items.empId === item.bookingEmpFlow
                }).length > 0
              ) {
                this.timeavailable = JSON.parse(
                  this.EmpItemLimitChange.filter(items => {
                    return items.empId === item.bookingEmpFlow
                  })[0].setTime
                )
              } else {
                this.timeavailable = []
              }
              // this.checkTimeFlow(item.dueDateDay, item)
              // this.timeavailable = []
              // console.log('dtTime', this.dataItem[0].masBranchID)
              // let dtTime = this.branch.filter(item => { return item.value === this.dataItem[0].masBranchID })
              // console.log('dtTime', this.dataItem[0].masBranchID)
              // this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
              this.dialogEdit = true
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(error => {
            console.log(error)
            this.dataReady = true
            //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
          })
      }
    },
    async getDataFromAPI (url, fieldId, fieldName, param) {
      let result = []
      await axios
        .get(this.DNS_IP + `${url}?shopId=${this.session.data.shopId}${param}`)
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
          } else {
            result = []
          }
        })
      return result
    },
    async getDataFlow () {
      let result = []
      let resultOption = []
      await axios
        .get(
          this.DNS_IP +
            `/flow/get?shopId=${this.session.data.shopId}${this.selectOnsite}`
        )
        .then(response => {
          let rs = response.data
          if (rs.length > 0) {
            result.push({ text: 'ทั้งหมด', value: 'AllFlow' })
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              let s = {}
              s.text = d.flowName
              s.value = d.flowId
              s.allData = d
              s.menuShowStatus = d.menuShowStatus
              s.masBranchID = d.masBranchID
              result.push(s)
              resultOption.push(s)
            }
          } else {
            result = []
            resultOption = []
          }
        })
      this.DataFlowNameDefault = result
      // this.DataFlowName = result
      this.DataFlowNameMenu = result.filter(el => {
        return el.menuShowStatus === 'True'
      })
      this.dataFlowSelectAdd = resultOption
      this.dataFlowSelectEdit = resultOption
    },
    setFlowByBranchEdit (item) {
      this.formEdit.flowId = ''
      this.dateEdit = ''
      this.timeEdit = ''
      this.customerTimeSlot = 'False'
      this.formAdd.bookingEmpFlow = ''
      let DD = this.DataFlowNameDefault
      let dataFilter = []
      DD.forEach(item => {
        if (item.text !== 'ทั้งหมด') {
          let checkBranchByFlow = item.allData.masBranchID || 'All'
          if (
            checkBranchByFlow === this.formEdit.masBranchID.toString() ||
            checkBranchByFlow === 'All'
          ) {
            console.log('eeeeeee', item.allData.flowName)
            dataFilter.push(item)
          }
        }
      })
      this.dataFlowSelectEdit = dataFilter
    },
    setFlowByBranchAdd () {
      this.formAdd.flowId = ''
      this.customerTimeSlot = 'False'
      this.formAdd.bookingEmpFlow = ''
      let DD = this.DataFlowNameDefault
      let dataFilter = []
      DD.forEach(item => {
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
      this.dataFlowSelectAdd = dataFilter
    },
    async getDataBranch () {
      // if (localStorage.getItem('BRANCH') === null) {
      //   let temp = await this.getDataFromAPI('/master_branch/get', 'masBranchID', 'masBranchName')
      //   console.log(typeof temp)
      //   localStorage.setItem('BRANCH', JSON.stringify(temp))
      // }
      // this.branch = JSON.parse(localStorage.getItem('BRANCH'))
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
    },
    getDataFromFieldName (data, key) {
      if (data !== undefined) {
        return data.filter(function (el) {
          return el.fieldName === key
        })
      } else {
        return []
      }
    },
    async updateValuesExport () {
      this.export_data = []
      console.log(
        'dateRange',
        new Date(this.dateRange.endDate).toISOString().substr(0, 10)
      )
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP +
            '/booking_view/get?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            this.masBranchIDExport +
            '&dateRange=' +
            new Date(this.dateRange.startDate).toISOString().substr(0, 10) +
            '/' +
            new Date(this.dateRange.endDate).toISOString().substr(0, 10) +
            this.selectOnsite
        )
        .then(async response => {
          console.log('getData', response.data)
          this.dataReady = true
          var exportdatas = []
          for (let i = 0; i < response.data.length; i++) {
            let d = response.data[i]
            let s = {}
            s.bookNo = d.bookNo
            s.masBranchName = d.masBranchName
            s.statusUseBt = d.statusUseBt || 'booking'
            s.CREATE_DATE = d.CREATE_DATE
            s.LAST_DATE = d.LAST_DATE
            s.flowName = d.flowName
            s.dueDate = d.dueDate
            s.chkConfirm = false
            s.chkCancel = false
            if (d.statusUseBt === 'use' && d.statusBt === 'confirm') {
              s.chkConfirm = true
              s.chkCancel = false
            } else if (d.statusUseBt === 'use' && d.statusBt === 'cancel') {
              s.chkConfirm = false
              s.chkCancel = true
            }
            s.statusBt = d.statusBt || 'wait'
            switch (d.statusBt) {
              case 'confirm':
                s.statusBtText = 'ยืนยันแล้ว'
                break
              case 'cancel':
                s.statusBtText = 'ยกเลิก'
                break
              case 'confirmJob':
                s.statusBtText = 'รับรถแล้ว'
                break
              default:
                s.statusBtText = 'รอโทรยืนยัน'
                break
            }
            let dataBookingData = []
            await axios
              .get(this.DNS_IP + `/BookingData/getView?bookNo=${d.bookNo}`)
              .then(async responses => {
                dataBookingData = responses.data
              })
            s.cusName = this.getDataFromFieldName(dataBookingData, 'ชื่อ')
            s.cusReg = this.getDataFromFieldName(dataBookingData, 'เลขทะเบียน')
            s.cusName = s.cusName.length > 0 ? s.cusName[0].fieldValue : ''
            s.cusReg = s.cusReg.length > 0 ? s.cusReg[0].fieldValue : ''
            exportdatas.push(s)
          }
          this.export_data = exportdatas
          // if (exportdatas.length === 0 || exportdatas.status === false) {
          //   this.export_data = []
          //   // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
          // } else {
          //   // this.dataReady = true
          //   this.export_data = exportdatas
          // }
        })
        .catch(error => {
          console.log(error)
          this.dataReady = true
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
        })
    },
    getSelect (text, count, filterCloseJobValue) {
      this.selectedStatus = true
      this.getSelectText = text
      this.getSelectCount = count || 0
      this.dataItemSelect = []
      // this.dataItemTimesChange = []
      this.columnsSelected = []
      console.log('text', text)
      // if (count > 0) {
      if (text === 'all') {
        // this.dataItemSelect = this.dataItem
        if (this.dataItem.length > 0) {
          this.checkSelectText = this.dataItem[0].statusBt
          for (let x = 0; x < this.dataItem.length; x++) {
            let t = this.dataItem[x]
            // let serviceDetail = ''
            // let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(t.flowId) })
            // fieldflow.forEach((row) => {
            //   let tempField = this.BookingDataList[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
            //   let convertTextField = ''
            //   if (tempField.length > 0) {
            //     if (row.fieldType === 'Selects' || row.fieldType === 'Autocompletes' || row.fieldType === 'Radio') {
            //       if (tempField[0].fieldValue) {
            //         if (JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue }).length === 0) {
            //           convertTextField = tempField[0].fieldValue || ''
            //         } else {
            //           convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
            //         }
            //         // convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
            //       } else {
            //         convertTextField = tempField[0].fieldValue
            //       }
            //     } else {
            //       convertTextField = tempField[0].fieldValue
            //     }
            //   }
            //   serviceDetail += (tempField.length > 0 ? convertTextField + ' ' : '')
            // })
            // serviceDetail = serviceDetail.trim() ? t.flowName + ' : ' + serviceDetail.trim() : t.flowName
            // t.flowNameShow = t.flowName + ' : ' + t.displayFlowName || ''
            t.flowNameShow = t.displayFlowName
              ? t.flowName + ' : ' + t.displayFlowName
              : t.flowName
            this.dataItemSelect.push(t)
          }
        } else {
          this.dataItemSelect = []
        }
        this.columnsSelected = [
          // { text: 'Booking Id', value: 'bookNo' },
          { text: 'ชื่อลูกค้า', value: 'cusName', sortable: false },
          { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
          // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
          { text: 'บริการ', value: 'flowNameShow', sortable: false },
          {
            text: 'พนักงานช่าง',
            value: 'bookingEmpFlowName',
            sortable: false,
            width: '120'
          },
          { text: 'เบอร์โทร', value: 'tel', sortable: false, width: '120' },
          {
            text: 'เงินมัดจำ',
            value: 'action40',
            sortable: false,
            align: 'center'
          },
          // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
          // { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' },
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
          // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
          // { text: 'หมายเหตุเรียกกลับ', value: 'remarkReturn', align: 'center' },
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
          // dataSelect = this.dataItem.filter(el => { return el.statusBt === text })
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
            // this.filterCloseJobValue = filterCloseJobValue
            dataSelect = this.dataItem.filter(el => {
              return el.statusBt === text
            })
          }
        }
        // console.log('fieldflow', dataSelect)
        if (dataSelect.length > 0) {
          this.checkSelectText = dataSelect[0].statusBt
          for (let x = 0; x < dataSelect.length; x++) {
            let t = dataSelect[x]
            // let serviceDetail = ''
            // let fieldflow = this.editedItemSeleteField.filter((row) => { return row.conditionField === 'flow' && String(row.conditionValue) === String(t.flowId) })
            // if (fieldflow.length > 0) {
            //   fieldflow.forEach((row) => {
            //     let tempField = []
            //     if (this.BookingDataList[t.bookNo] !== undefined) {
            //       tempField = this.BookingDataList[t.bookNo].filter((row2) => { return String(row2.fieldId) === String(row.fieldId) })
            //     } else {
            //       tempField = []
            //     }
            //     let convertTextField = ''
            //     if (tempField.length > 0) {
            //       if (row.fieldType === 'Selects' || row.fieldType === 'Autocompletes' || row.fieldType === 'Radio') {
            //         if (tempField[0].fieldValue) {
            //           // console.log('7088', JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue }))
            //           if (JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue }).length === 0) {
            //             convertTextField = tempField[0].fieldValue || ''
            //           } else {
            //             convertTextField = JSON.parse(row.optionField).filter(el => { return el.value === tempField[0].fieldValue })[0].text
            //           }
            //         } else {
            //           convertTextField = tempField[0].fieldValue || ''
            //         }
            //       } else {
            //         convertTextField = tempField[0].fieldValue || ''
            //       }
            //     }
            //     serviceDetail += (tempField.length > 0 ? convertTextField + ' ' : '')
            //   })
            // }
            // serviceDetail = serviceDetail.trim() ? t.flowName + ' : ' + serviceDetail.trim() : t.flowName
            // t.flowNameShow = t.flowName + ' : ' + t.displayFlowName || ''
            t.flowNameShow = t.displayFlowName
              ? t.flowName + ' : ' + t.displayFlowName
              : t.flowName
            this.dataItemSelect.push(t)
          }
        } else {
          this.dataItemSelect = []
        }
        // console.log('dataSelect', this.dataItemSelect)
        if (text === 'cancel') {
          if (
            this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
            this.$session.getAll().data.category === '7'
          ) {
            this.columnsSelected = [
              // { text: 'Booking Id', value: 'bookNo' },
              { text: 'ชื่อลูกค้า', value: 'cusName', width: '150' },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
              { text: 'บริการ', value: 'flowNameShow', width: '150' },
              {
                text: 'พนักงานช่าง',
                value: 'bookingEmpFlowName',
                sortable: false,
                width: '120'
              },
              { text: 'เลขทะเบียน', value: 'cusReg', width: '120' },
              { text: 'เบอร์โทร', value: 'tel', width: '120' },
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
              // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center'
              }
              // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
              // { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' }
              // { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
            ]
          } else {
            this.columnsSelected = [
              // { text: 'Booking Id', value: 'bookNo' },
              { text: 'ชื่อลูกค้า', value: 'cusName', width: '150' },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
              { text: 'บริการ', value: 'flowNameShow', width: '150' },
              {
                text: 'พนักงานช่าง',
                value: 'bookingEmpFlowName',
                sortable: false,
                width: '120'
              },
              { text: 'เบอร์โทร', value: 'tel', width: '120' },
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
              // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center'
              }
              // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
              // { text: 'Confirm นัดล่วงหน้า', value: 'action2', sortable: false, align: 'center' }
              // { text: 'วันที่อัพเดท', value: 'LAST_DATE' },
            ]
          }
        } else if (text === 'confirm') {
          if (
            this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
            this.$session.getAll().data.category === '7'
          ) {
            this.columnsSelected = [
              // { text: 'Booking Id', value: 'bookNo' },
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '120',
                sortable: false
              },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                sortable: false,
                width: '150'
              },
              {
                text: 'พนักงานช่าง',
                value: 'bookingEmpFlowName',
                sortable: false,
                width: '120'
              },
              { text: 'เลขทะเบียน', value: 'cusReg', width: '120' },
              { text: 'เบอร์โทร', value: 'tel', sortable: false, width: '120' },
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
              // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
              {
                text: 'Confirm นัดล่วงหน้า',
                value: 'action2',
                sortable: false,
                align: 'center'
              },
              // { text: 'หมายเหตุที่ยกเลิก', value: 'remarkRemove', sortable: false, align: 'center' },
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
              // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
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
              // { text: 'Booking Id', value: 'bookNo' },
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '120',
                sortable: false
              },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                sortable: false,
                width: '150'
              },
              {
                text: 'พนักงานช่าง',
                value: 'bookingEmpFlowName',
                sortable: false,
                width: '120'
              },
              { text: 'เบอร์โทร', value: 'tel', sortable: false, width: '120' },
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
              // { text: 'คุณสมบัติเพิ่มเติม', value: 'action3', sortable: false, align: 'center' },
              {
                text: 'Confirm นัดล่วงหน้า',
                value: 'action2',
                sortable: false,
                align: 'center'
              },
              // { text: 'หมายเหตุที่ยกเลิก', value: 'remarkRemove', sortable: false, align: 'center' },
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
              // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
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
              // { text: 'Booking Id', value: 'bookNo' },
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
              // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                width: '150',
                sortable: false
              },
              {
                text: 'พนักงานช่าง',
                value: 'bookingEmpFlowName',
                sortable: false,
                width: '120'
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
              // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
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
              // { text: 'Booking Id', value: 'bookNo' },
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
              // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                width: '150',
                sortable: false
              },
              {
                text: 'พนักงานช่าง',
                value: 'bookingEmpFlowName',
                sortable: false,
                width: '120'
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
                width: '160'
              },
              {
                text: 'หมายเหตุ',
                value: 'remark',
                align: 'center',
                sortable: false,
                width: '150'
              },
              // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
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
            this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
            this.$session.getAll().data.category === '7'
          ) {
            this.columnsSelected = [
              // { text: 'Booking Id', value: 'bookNo' },
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '150',
                sortable: false
              },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                sortable: false,
                width: '150'
              },
              {
                text: 'พนักงานช่าง',
                value: 'bookingEmpFlowName',
                sortable: false,
                width: '120'
              },
              { text: 'เลขทะเบียน', value: 'cusReg', width: '120' },
              { text: 'เบอร์โทร', value: 'tel', sortable: false, width: '120' },
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
              // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
              // { text: 'หมายเหตุเรียกกลับ', value: 'remarkReturn', align: 'center', sortable: false },
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
              // { text: 'Booking Id', value: 'bookNo' },
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '150',
                sortable: false
              },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                sortable: false,
                width: '150'
              },
              {
                text: 'พนักงานช่าง',
                value: 'bookingEmpFlowName',
                sortable: false,
                width: '120'
              },
              { text: 'เบอร์โทร', value: 'tel', sortable: false, width: '120' },
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
              // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
              // { text: 'หมายเหตุเรียกกลับ', value: 'remarkReturn', align: 'center', sortable: false },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center',
                width: '100'
              }
            ]
          }
        } else {
          if (
            this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
            this.$session.getAll().data.category === '7'
          ) {
            this.columnsSelected = [
              // { text: 'Booking Id', value: 'bookNo' },
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '150',
                sortable: false
              },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                sortable: false,
                width: '150'
              },
              {
                text: 'พนักงานช่าง',
                value: 'bookingEmpFlowName',
                sortable: false,
                width: '120'
              },
              { text: 'เลขทะเบียน', value: 'cusReg', width: '120' },
              { text: 'เบอร์โทร', value: 'tel', sortable: false, width: '120' },
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
              // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center'
              }
            ]
          } else {
            this.columnsSelected = [
              // { text: 'Booking Id', value: 'bookNo' },
              {
                text: 'ชื่อลูกค้า',
                value: 'cusName',
                width: '150',
                sortable: false
              },
              { text: 'วันที่/เวลา', value: 'dueDate', sortable: false },
              // { text: 'วันและเวลานัดหมาย', value: 'dueDate' },
              {
                text: 'บริการ',
                value: 'flowNameShow',
                sortable: false,
                width: '150'
              },
              {
                text: 'พนักงานช่าง',
                value: 'bookingEmpFlowName',
                sortable: false,
                width: '120'
              },
              { text: 'เบอร์โทร', value: 'tel', sortable: false, width: '120' },
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
              // { text: 'memberDataTagName', value: 'memberDataTagName', align: 'center', sortable: false },
              {
                text: 'จัดการ',
                value: 'action',
                sortable: false,
                align: 'center'
              }
            ]
          }
        }
        // console.log('cccc', this.dataItemSelect)
      }
      console.log('this.dataItemSelect--------------', this.dataItemSelect)
      console.log('this.dataItemSelect--------------', this.dataItem)
      this.checkTypeSort()
      // }
    },
    updateTimeTablefromChild (timeTable) {
      this.timeTable = timeTable
    },

    async getTimesChange (text) {
      try {
        this.dataItemTimesChange = []
        this.dataRemoveExport = []
        if (text === 'all') {
          this.dataItemTimesChange = this.dataItem
          this.dataRemoveExport = this.dataItemTimesChange.filter(el => {
            return el.statusBt === 'cancel'
          })
          this.BookingDataListTimechange = this.BookingDataList
        } else {
          if (this.masBranchID) {
            this.masBranchID = this.masBranchID
          } else {
            if (this.branch.length > 0) {
              this.masBranchID = this.branch[0].value
            } else {
              this.masBranchID = ''
            }
          }
          this.dataItemCheck = []
          var dataItems = []
          if (this.timeTable !== '') {
            var dateStart = moment(
              moment(this.timeTable, 'YYYY-MM-DD').toDate()
            ).format('YYYY-MM-DD')
            console.log('dateStartxx', dateStart)
            console.log('timeTable', this.timeTable)
            await this.getBookingDataListTimechange(dateStart)

            // var dataItemTimes = []
            let urlApi = ''
            if (this.flowSelect === 'AllFlow') {
              urlApi =
                this.DNS_IP +
                '/booking_view/get?shopId=' +
                this.session.data.shopId +
                '&masBranchID=' +
                this.masBranchID +
                '&dueDate=' +
                this.timeTable +
                this.selectOnsite
            } else {
              urlApi =
                this.DNS_IP +
                '/booking_view/get?shopId=' +
                this.session.data.shopId +
                '&masBranchID=' +
                this.masBranchID +
                '&dueDate=' +
                this.timeTable +
                '&flowId=' +
                this.flowSelect +
                this.selectOnsite
            }
            await axios.get(urlApi).then(async response => {
              if (response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                  let d = response.data[i]
                  let s = {}
                  s.bookNo = d.bookNo
                  s.flowId = d.flowId
                  s.flowName = d.flowName
                  s.bookingEmpFlowName = d.bookingEmpFlowName
                  s.checkDateConfirmJob = d.checkDateConfirmJob
                  let countEndTime = await this.countTime(
                    d.timeText,
                    JSON.parse(d.bookingEmpSetTime) || [],
                    d.timeSlotCustomer
                  )
                  s.dueDate = d.dueDate || ''
                  s.dueDateEnd = countEndTime || ''
                  s.dueDateTimeStamp = d.dueDateTimeStamp
                  s.remarkRemove = d.remarkRemove
                  s.remark = d.remark
                  s.userId = d.userId
                  s.chkConfirm = false
                  s.chkCancel = false
                  s.jobNo = d.jobNo
                  s.empFull_NameTH = d.empFull_NameTH
                  s.extraJob = d.extraJob === 'true' || d.extraJob === 'True'
                  s.fastTrack =
                    d.fastTrack === 'true' || d.fastTrack === 'True'
                  s.remarkRemove = d.remarkRemove || ''
                  s.timeDueHtext = d.timeDueH + ':00'
                  s.timeDuetext = d.timeDue
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
                      break
                    case 'cancel':
                      s.statusBtText = 'ยกเลิก'
                      break
                    case 'confirmJob':
                      s.statusBtText = 'รับรถแล้ว'
                      break
                    default:
                      s.statusBtText = 'รายการนัดหมายใหม่'
                      break
                  }
                  s.cusName = this.getDataFromFieldName(
                    this.BookingDataListTimechange[d.bookNo],
                    'ชื่อ'
                  )
                  s.cusReg = this.getDataFromFieldName(
                    this.BookingDataListTimechange[d.bookNo],
                    'เลขทะเบียน'
                  )
                  s.tel = this.getDataFromFieldName(
                    this.BookingDataListTimechange[d.bookNo],
                    'เบอร์โทร'
                  )
                  s.cusName =
                    s.cusName.length > 0 ? s.cusName[0].fieldValue : ''
                  s.cusReg = s.cusReg.length > 0 ? s.cusReg[0].fieldValue : ''
                  s.tel = s.tel.length > 0 ? s.tel[0].fieldValue : ''
                  s.statusUpload1 = d.statusUpload1 || 'False'
                  s.statusUpload2 = d.statusUpload2 || 'False'
                  s.fileUpload1 = d.fileUpload1 || '[]'
                  s.fileUpload2 = d.fileUpload2 || '[]'

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
                  dataItems.push(s)
                }
              }
              console.log('dataItemsTimesChange', dataItems)
              if (dataItems.length === 0 || dataItems.status === false) {
                this.dataItemCheck = []
                // this.dataItemTime = []
                // this.dataReady = true
                // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
              } else {
                // console.log('month new if')
                console.log('month new if', dataItems)
                this.dataItemCheck = dataItems
                this.dataItemTimesChange = this.dataItemCheck.sort((a, b) => {
                  if (a.timeDuetext < b.timeDuetext) return -1
                  return a.timeDuetext > b.timeDuetext ? 1 : 0
                })
                // this.dataItemTimesChange = this.dataItemCheck.filter(el => {
                //   let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
                //   return dueDate === this.timeTable
                //   // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
                // }).sort((a, b) => {
                //   if (a.timeDuetext < b.timeDuetext) return -1
                //   return a.timeDuetext > b.timeDuetext ? 1 : 0
                // })
                this.dataRemoveExport = this.dataItemTimesChange.filter(el => {
                  return el.statusBt === 'cancel'
                })
                // console.log('this.dataRemoveExport', this.dataRemoveExport)
              }
            })
          }
          // } else {
          //   console.log('month new else')
          //   this.dataItemTimesChange = this.dataItemCheck.filter(el => {
          //     let dueDate = moment(moment(el.dueDate, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD')
          //     return dueDate === this.timeTable
          //     // return new Date(el.dueDate).toISOString().substr(0, 10) === this.timeTable
          //   }).sort((a, b) => {
          //     if (a.timeDuetext < b.timeDuetext) return -1
          //     return a.timeDuetext > b.timeDuetext ? 1 : 0
          //   })
          // }
        }
        // this.dataRemoveExport = this.dataItemTimesChange.filter(el => { return el.statusBt === 'cancel' })
        // console.log('this.dataRemoveExport', this.dataRemoveExport)
      } catch (err) {
        console.log(err)
      }
    },
    async getBookingDataListTimechange (dateStart) {
      this.BookingDataListTimechange = []
      if (this.masBranchID) {
        this.masBranchID = this.masBranchID
      } else {
        if (this.branch.length > 0) {
          this.masBranchID = this.branch[0].value
        } else {
          this.masBranchID = ''
        }
      }
      let url = `${this.DNS_IP}/BookingData/getView?shopId=${this.session.data.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
      await axios.get(url).then(async response => {
        if (response.data.status !== false) {
          response.data.forEach(row => {
            if (
              typeof this.BookingDataListTimechange[row.bookNo] === 'undefined'
            ) {
              this.BookingDataListTimechange[row.bookNo] = []
            }
            this.BookingDataListTimechange[row.bookNo].push(row)
          })
        }
      })
      console.log(this.BookingDataListTimechange)
    },
    async getBookingDataListShowEmpReport (dateStart) {
      console.log('dateStart', dateStart)
      this.BookingDataListShowEmpReport = []
      let url = ''
      url = `${this.DNS_IP}/BookingData/getView?shopId=${this.session.data.shopId}&dueDate=${dateStart}`
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach(row => {
              if (
                typeof this.BookingDataListShowEmpReport[row.bookNo] ===
                'undefined'
              ) {
                this.BookingDataListShowEmpReport[row.bookNo] = []
              }
              this.BookingDataListShowEmpReport[row.bookNo].push(row)
            })
          }
        })
        .catch(error => {
          // this.dataEditReady = true
          setTimeout(
            () => this.getBookingDataListShowEmpReport(dateStart),
            3000
          )
          console.log('catch getBookingDataListShowEmpReport : ', error)
        })
      console.log(
        'this.BookingDataListShowEmpReport',
        this.BookingDataListShowEmpReport
      )
    },
    async getBookingDataList (dateStart, searchOther, flowSelect) {
      console.log('dateStart', dateStart)
      this.BookingDataList = []
      if (this.masBranchID) {
        this.masBranchID = this.masBranchID
      } else {
        if (this.branch.length > 0) {
          this.masBranchID = this.branch[0].value
        } else {
          this.masBranchID = ''
        }
      }
      let categoryUser = ''
      if (
        this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
        this.$session.getAll().data.category === '7'
      ) {
        categoryUser = 'ธุรกิจรถยนต์'
      } else {
        categoryUser = this.$session.getAll().data.category
      }
      let url = ''
      if (dateStart === 'no') {
        url = `${this.DNS_IP}/BookingData/getsearchName?shopId=${this.session.data.shopId}&fieldValue=${searchOther}&category=${categoryUser}&masBranchID=${this.masBranchID}`
      } else {
        if (flowSelect === 'AllFlow') {
          url = `${this.DNS_IP}/BookingData/getView?shopId=${this.session.data.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}`
        } else {
          url = `${this.DNS_IP}/BookingData/getView?shopId=${this.session.data.shopId}&masBranchID=${this.masBranchID}&dueDate=${dateStart}}&flowId=${flowSelect}`
        }
      }
      await axios
        .get(url)
        .then(async response => {
          if (response.data.status !== false) {
            response.data.forEach(row => {
              if (typeof this.BookingDataList[row.bookNo] === 'undefined') {
                this.BookingDataList[row.bookNo] = []
              }
              this.BookingDataList[row.bookNo].push(row)
            })
          }
        })
        .catch(error => {
          // this.dataEditReady = true
          setTimeout(
            () => this.getBookingDataList(dateStart, searchOther, flowSelect),
            3000
          )
          console.log('catch getBookingDataList : ', error)
        })
      console.log('this.BookingDataList1', this.BookingDataList)
    },
    async countTime (time, setTime, timeSlotCustomer) {
      try {
        if (
          !setTime ||
          timeSlotCustomer <= 0 ||
          timeSlotCustomer > setTime.length
        ) {
          return '' // กรณีไม่มีข้อมูลหรือ timeSlotCustomer ไม่ถูกต้อง
        }
        // console.log('setTimeLength', setTime.length)
        // ค้นหาเวลาเริ่มต้นใน setTime
        const startTimeInfo = setTime.find(
          slot => slot.text === time || slot.value === time
        )
        const findIndex = setTime.findIndex(
          slot => slot.text === time || slot.value === time
        )
        // console.log('startTime', findIndex, startTimeInfo)
        if (startTimeInfo) {
          // หาเวลาสิ้นสุดโดยใช้ timeSlotCustomer
          let endTimeInfo = ''
          if (findIndex + timeSlotCustomer >= setTime.length) {
            endTimeInfo = ' เป็นต้นไป'
          } else {
            endTimeInfo =
              ' - ' +
              setTime[startTimeInfo.id + timeSlotCustomer - 1].value +
              ' น.'
          }
          // console.log('endTimeInfo', endTimeInfo)
          return endTimeInfo || ''
        } else {
          return ''
        }
      } catch (error) {
        return ''
      }
    },
    async getBookingList () {
      try {
        await this.getTagData()
      } catch (e) {
        console.log(e)
      }
      clearInterval(this.setTimerCalendar)
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
            // this.getBookingList()
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
          // this.getBookingList()
        }
      }
      if (this.flowSelect !== '') {
        this.flowSelect = this.flowSelect
      } else {
        this.DataFlowName = this.DataFlowNameDefault.filter(el => {
          return (
            parseInt(el.masBranchID) === this.masBranchID ||
            el.value === 'AllFlow'
          )
        })
        if (this.DataFlowName.length > 0) {
          this.flowSelect = this.DataFlowName[0].value
        } else {
          this.flowSelect = ''
          await this.getDataFlow()
          this.flowSelect = this.DataFlowName[0].value
          // this.getBookingList()
        }
      }
      this.selectedStatus = true
      // this.getSelectText = ''
      this.dataItem = []
      this.countWaiting = 0
      this.countConfirm = 0
      this.countCancel = 0
      this.countJob = 0
      this.countAll = 0
      // Clear ช่องค้นหา
      // this.searchAll2 = ''
      var dataItemTimes = []
      var dataItems = []
      // await this.getShowMap()
      let urlApi = ''
      if (this.flowSelect === 'AllFlow') {
        // await this.getBookingDataList(this.dateStart, '', 'AllFlow')
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
        // await this.getBookingDataList(this.dateStart, '', this.flowSelect)
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
          console.log('getData', response.data)
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              let d = response.data[i]
              let s = {}
              // if (this.BookingDataList[d.bookNo] !== undefined) {
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
              let countEndTime = await this.countTime(
                d.timeText,
                JSON.parse(d.bookingEmpSetTime) || [],
                d.timeSlotCustomer
              )
              s.dueDate = d.dueDate || ''
              s.dueDateEnd = countEndTime || ''
              // console.log('s.dueDate', s.dueDate)
              if (d.timeText === null || d.timeText === '') {
                d.timeText = d.timeDue
              }
              if (s.dueDate === '') {
                s.dueDateText = 'ไม่มีเวลานัดหมาย'
              } else {
                // let endTime = await this.countTime(d.timeText, (JSON.parse(d.bookingEmpSetTime) || []), d.timeSlotCustomer)
                // console.log('endTime', endTime)
                s.dueDateText = d.dueDateTextDay + ' ' + d.timeText
                // console.log('s.dueDateText', s.dueDateText)
              }
              s.shopId = d.shopId
              s.RECORD_STATUS_Job = d.RECORD_STATUS_Job || ''
              s.bookingEmpFlow = d.bookingEmpFlow
              s.credit_package = d.credit_package
              s.bookingEmpFlowName = d.bookingEmpFlowName
              s.bookingEmpSetTime = d.bookingEmpSetTime || []
              s.checkDateConfirmJob = d.checkDateConfirmJob
              s.dueDateDay = d.dueDateDay
              s.statusVIP = d.statusVIP
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
              s.googleCalendarEventId = d.googleCalendarEventId || ''
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
                // default:
                //   s.statusBtText = 'รายการนัดหมายใหม่'
                //   this.countWaiting = this.countWaiting + 1
                //   break
              }
              var chkTime = this.dataItemTime.filter(el => {
                return el.timeDueHtext === s.timeDueHtext
              })
              if (chkTime.length === 0) {
                dataItemTimes.push(s)
              }
              // s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
              // s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
              // s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
              // s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
              // s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
              // s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
              s.cusName = d.bookingDataCustomerName || ''
              s.cusReg = d.bookingDataCustomerRegisNumber || ''
              s.tel = d.bookingDataCustomerTel || ''
              s.displayFlowName = d.displayFlowName || ''
              if (s.statusBt !== 'wait') {
                dataItems.push(s)
              }
              // } else {
              //   console.log('BookingNo no bookingData', d.bookNo)
              // }
            }
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          console.log(error)
          this.dataReady = true
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
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
          // console.log('length', responses.data.length)
          for (let i = 0; i < responses.data.length; i++) {
            let d = responses.data[i]
            let s = {}
            // if (this.BookingDataList[d.bookNo] !== undefined) {
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
            let countEndTime = await this.countTime(
              d.timeText,
              JSON.parse(d.bookingEmpSetTime) || [],
              d.timeSlotCustomer
            )
            s.dueDate = d.dueDate || ''
            s.dueDateEnd = countEndTime || ''
            if (d.timeText === null || d.timeText === '') {
              d.timeText = d.timeDue
            }
            if (s.dueDate === '') {
              s.dueDateText = 'ไม่มีเวลานัดหมาย'
            } else {
              s.dueDateText = d.dueDateTextDay + ' ' + d.timeText
            }
            s.shopId = d.shopId
            s.RECORD_STATUS_Job = d.RECORD_STATUS_Job || ''
            s.bookingEmpFlow = d.bookingEmpFlow
            s.credit_package = d.credit_package
            s.bookingEmpFlowName = d.bookingEmpFlowName
            s.checkDateConfirmJob = d.checkDateConfirmJob
            s.dueDateDay = d.dueDateDay
            s.statusVIP = d.statusVIP
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
            s.googleCalendarEventId = d.googleCalendarEventId || ''
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
            // s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
            // s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
            // s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
            // s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
            // s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
            // s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
            s.cusName = d.bookingDataCustomerName || ''
            s.cusReg = d.bookingDataCustomerRegisNumber || ''
            s.tel = d.bookingDataCustomerTel || ''
            s.displayFlowName = d.displayFlowName || ''
            dataItems.push(s)
            // console.log('this.countWaiting', this.countWaiting)
            // } else {
            //   console.log('BookingNo no bookingData', d.bookNo)
            // }
          }
        }
      })
      if (dataItems.length === 0 || dataItems.status === false) {
        this.dataItem = []
        this.dataItemTime = []
        // await this.getTimesChange('update')
        if (this.getSelectText) {
          this.getSelect(this.getSelectText, 0, this.filterCloseJobValue)
        } else {
          this.getSelect('wait', this.countWaiting, this.filterCloseJobValue)
        }
        this.dataReady = true
        // this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
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
          // console.log('chkTimes', chkTimes)
          if (chkTimes.length === 0) {
            // console.log('datause(H)', h)
            this.dataItemTime.push(h)
          }
        }
        // await this.getTimesChange('update')
        console.log('bookNoNoti', this.$route.query.bookNoNoti)
        if (this.$route.query.bookNoNoti) {
          let checkBook = dataItems.filter(el => {
            return el.bookNo === this.$route.query.bookNoNoti
          })
          if (checkBook.length > 0) {
            this.getSelectText = checkBook[0].statusBt
            this.searchAll2 = checkBook[0].cusName
            // this.searchAll2 = checkBook[0].tagName
          }
        }
        if (this.getSelectText) {
          this.getSelect(this.getSelectText, 0, this.filterCloseJobValue)
        } else {
          this.getSelect('wait', this.countWaiting, this.filterCloseJobValue)
        }
        this.dataReady = true
      }
      // console.log('tagItem', this.tagItem)
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
    async getflowfield (item) {
      this.flowfieldNameitem = []
      let itemIncustomField = []
      await axios
        .get(
          this.DNS_IP +
            '/flowField/get?flowId=' +
            item.flowId +
            '&shopId=' +
            this.session.data.shopId
        )
        .then(response => {
          let tt = response.data
          console.log('tt', tt)
          if (tt.length > 0) {
            let flowId = tt[0].flowId
            let flowfieldName = []
            flowfieldName = JSON.parse(tt[0].flowfieldName)
            if (flowfieldName.length > 0) {
              for (let a = 0; a < flowfieldName.length; a++) {
                let d = flowfieldName[a]
                itemIncustomField.push(d.fieldId)
              }
              this.getCustomfieldFlow(itemIncustomField, flowId)
            }
          }
          // console.log('itemIncustomField', itemIncustomField)
        })
    },
    async getCustomfieldFlow (item, flowId) {
      let flowfieldNameitems = []
      this.flowfieldNameitem = []
      await axios
        .get(this.DNS_IP + '/customField/fieldId?fieldId=' + item)
        .then(async response => {
          let rs = response.data
          console.log('rs', rs)
          let sortrs = rs.sort((a, b) => a.sortNoField - b.sortNoField)
          for (var i = 0; i < sortrs.length; i++) {
            let d = sortrs[i]
            let s = {}
            s.fieldId = d.fieldId
            s.flowId = flowId
            s.fieldName = d.fieldName
            s.optionField = d.optionField
            s.conditionField = d.conditionField || ''
            s.fieldType = d.fieldType
            s.fieldValue = ''
            s.CREATE_USER = ''
            s.LAST_USER = ''
            s.showCard = d.showCard
            s.shopId = this.$session.getAll().data.shopId
            s.endDate = ''
            s.endTime = ''
            s.checkCar = 'False'
            s.conditionValue = d.conditionValue
            s.requiredField = d.requiredField
            flowfieldNameitems.push(s)
          }
          var data1 = flowfieldNameitems.filter(
            el => parseInt(el.conditionField || 0) > 0
          )
          // var data2 = []
          for (let i = 0; i < data1.length; i++) {
            let d = data1[i]
            let indexC = flowfieldNameitems.findIndex(function (o) {
              return o.fieldId === d.fieldId
            })
            let indexF = flowfieldNameitems.findIndex(function (o) {
              return o.fieldId === parseInt(d.conditionField)
            })
            flowfieldNameitems.splice(
              indexF + 1,
              0,
              flowfieldNameitems.splice(indexC, 1)[0]
            )
            // data2.push({'indexC': indexC, 'indexF': indexF})
          }
          // console.log('data1', data1)
          // console.log('data2', data2)
          for (var x = 0; x < flowfieldNameitems.length; x++) {
            var s = flowfieldNameitems[x]
            var chk = this.BookingDataItem.filter(el => {
              return parseInt(el.fieldId) === s.fieldId
            })
            console.log('cccxxx', s)
            console.log('chk', chk)
            if (chk.length === 0) {
              this.flowfieldNameitem.push(s)
            }
          }
          // console.log('flowfieldNameitems', this.flowfieldNameitem)
          // console.log('flowfieldNameitems', flowfieldNameitems)
          // console.log('BookingDataItem', this.BookingDataItem)
          // setTimeout(() => this.validate('ADD'), 500)
        })
        .catch(error => {
          console.log('error function addData : ', error)
        })
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
          setTimeout(() => this.addDataSubmit(), 500)
        }
      } else {
        this.validate('ADD')
        setTimeout(() => this.addDataSubmit(), 500)
      }
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
              let params = new FormData()
              let configDepositUpload = {
                headers: {
                  bookNo: 'BK' + moment().unix()
                }
              }
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
            update.dueDate = this.date + ' ' + this.time.value
            update.dateSelect = this.date
            update.timeSelect = this.time.value
            update.timeText = this.time.text
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
            update.timeBooking = this.checkLimitBooking.timeBooking
            update.timeAll = this.checkLimitBooking.timeSelect
            update.slotByflow = this.checkLimitBooking.slotByflow
            update.timeSlotCustomer = this.fromAddTimeCus
            update.customerTimeSlot = this.customerTimeSlot
            update.depositPrice = this.formAdd.depositPrice
            update.empId = this.formAdd.bookingEmpFlow
            if (this.statusVIP === 'True') {
              update.statusVIP = 'True'
            } else {
              update.statusVIP = 'False'
            }
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
                update.dueDate = this.date + ' ' + this.time.value
                update.dateSelect = this.date
                update.timeSelect = this.time.value
                update.timeText = this.time.text
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
                update.timeBooking = this.checkLimitBooking.timeBooking
                update.timeAll = this.checkLimitBooking.timeSelect
                update.slotByflow = this.checkLimitBooking.slotByflow
                update.timeSlotCustomer = this.fromAddTimeCus
                update.customerTimeSlot = this.customerTimeSlot
                update.depositPrice = this.formAdd.depositPrice
                update.empId = this.formAdd.bookingEmpFlow
                if (this.statusVIP === 'True') {
                  update.statusVIP = 'True'
                } else {
                  update.statusVIP = 'False'
                }
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
                update.dueDate = this.date + ' ' + this.time.value
                update.dateSelect = this.date
                update.timeSelect = this.time.value
                update.timeText = this.time.text
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
                update.timeBooking = this.checkLimitBooking.timeBooking
                update.timeAll = this.checkLimitBooking.timeSelect
                update.slotByflow = this.checkLimitBooking.slotByflow
                update.timeSlotCustomer = this.fromAddTimeCus
                update.customerTimeSlot = this.customerTimeSlot
                update.depositPrice = this.formAdd.depositPrice
                update.empId = this.formAdd.bookingEmpFlow
                if (this.statusVIP === 'True') {
                  update.statusVIP = 'True'
                } else {
                  update.statusVIP = 'False'
                }
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
        await axios
          .post(this.DNS_IP + '/Booking/addTimeEpm', Add)
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
              console.log('resspons111111', this.statusGoogleCalendar)
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
                  this.clearDataAdd()
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
            // Ue388ea246b5b4b4419a714516b5ae54a //
            if (
              this.$session.getAll().data.shopId ===
              'U93c42b54e45cfe584473c03e35746955' ||
              this.$session.getAll().data.shopId ===
              'Ue388ea246b5b4b4419a714516b5ae54a'
            ) {
              await this.pushMsgLineNotifyGroup(response.data.bookNo)
            }
            // console.log('addDataGlobal DNS_IP + /job/add', response)
          })
          .catch(error => {
            console.log('error function addData : ', error)
            setTimeout(() => this.addDataInsert(), 3000)
          })
        // })
        // .catch(error => {
        //   console.log('Cencel : ', error)
        //   this.closeSetTimeGetCalenda()
        // })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async connectGoogleCalendar (status, bookNo) {
      console.log('status !!!', status)
      this.$refs.GoogleCalendarRef.checkTypeEvenEmp(status, bookNo)
    },
    async addDataSubmit () {
      if (this.validAdd === true) {
        if (this.$session.id() !== undefined) {
          if (this.formAdd.radiosRemark === 'FastTrack') {
            let getcount = await this.getCountFastTrack(
              this.date,
              this.formAdd.flowId,
              this.formAdd.masBranchID
            )
            let setCountFast = this.branch.filter(el => {
              return el.value === this.formAdd.masBranchID
            })[0].allData.countFastTrack
            if (getcount < setCountFast) {
              if (
                this.EmpItemLimitAdd.filter(item => {
                  return item.empId === this.formAdd.bookingEmpFlow
                })[0].limitBookingCheck === 'True'
              ) {
                await this.checkLimit()
                // console.log('test', this.branchData.filter(item => { return item.masBranchID === this.formAdd.masBranchID })[0].setTime)
                if (this.checkLimitBooking.limitCheck === 'true') {
                  this.dialogAddCon = true
                } else if (this.checkLimitBooking.limitCheck === 'false') {
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
              this.textError = 'จำนวนงานด่วนต่อวัน เกินกว่าที่ตั้งไว้'
              this.dialogError = true
              this.loadingAdd = false
            }
          } else {
            if (
              this.EmpItemLimitAdd.filter(item => {
                return item.empId === this.formAdd.bookingEmpFlow
              })[0].limitBookingCheck === 'True'
            ) {
              await this.checkLimit()
              // console.log('test', this.branchData.filter(item => { return item.masBranchID === this.formAdd.masBranchID })[0].setTime)
              if (this.checkLimitBooking.limitCheck === 'true') {
                this.dialogAddCon = true
              } else if (this.checkLimitBooking.limitCheck === 'false') {
                console.log('else1402')
                this.$swal(
                  'คิวเต็มแล้ว',
                  'กรุณาเลือกวันที่ใหม่อีกครั้ง',
                  'error'
                )
                this.date = ''
                this.time = ''
              } else {
                this.dialogAddCon = true
                this.checkLimitBooking.limitCheck = 'true'
                console.log('else1407')
              }
            } else {
              this.dialogAddCon = true
              this.checkLimitBooking.limitCheck = 'false'
            }
          }
        } else {
          this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
          clearInterval(this.setTimerCalendar)
          this.setTimerCalendar = null
          this.$router.push('/Core/Login')
        }
      } else {
        this.loadingAdd = false
      }
    },
    async pushMsglineGroup (bookNo) {
      await axios
        .post(this.DNS_IP + '/Booking/pushMsgLineGroup/' + bookNo)
        .then(response => {
          this.clearData()
        })
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
          if (this.statusGoogleCalendar === 'True') {
            this.connectGoogleCalendar('Add', dt.bookNo)
          }
          this.clearDataAdd()
          this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
          // await this.getBookingList()
          // this.getTimesChange('update')
        })
        .catch(error => {
          console.log('error function addData : ', error)
          setTimeout(() => this.confirmChkAdd(), 3000)
        })
    },
    async clearDataAdd () {
      this.statusVIP = 'False'
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
      this.dataReadyAdd = true
      clearInterval(this.setTimerCalendar)
      this.setTimerCalendar = null
      if (this.statusSearch === 'no') {
        this.getBookingList()
      } else {
        this.searchAny()
      }
      if (this.getSelectText) {
        this.getSelect(
          this.getSelectText,
          this.getSelectCount,
          this.filterCloseJobValue
        )
      }
      this.getDataCalendaBooking()
    },
    async getDataById (dt) {
      console.log('dt', dt)
      await axios
        .get(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/getID?bookNo=" + dt.bookNo
        )
        .then(async response => {
          this.dataReady = true
          if (response.data) {
            Object.assign(this.formUpdate, response.data)
            delete this.formUpdate['RECORD_STATUS']
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.dataReady = true
          console.log('error function getDataById : ', error)
          //   this.$router.push('/system/Errorpage?returnLink=' + returnLink)
        })
    },
    async deleteData () {
      this.swalConfig.title = 'ต้องการ ลบข้อมูล ใช่หรือไม่?'
      this.$swal(this.swalConfig)
        .then(async result => {
          this.formUpdate.LAST_USER = this.$session.getAll().data.userName
          await axios
            .post(
              // eslint-disable-next-line quotes
              this.DNS_IP + "/Booking/delete/" + this.formUpdate.bookNo,
              this.formUpdate
            )
            .then(async response => {
              // Debug response
              console.log('DNS_IP + PATH + "delete/"', response)

              this.$swal('เรียบร้อย', 'ลบข้อมูลเรียบร้อย', 'success')
              // Close Dialog

              // Load Data
              if (this.statusSearch === 'no') {
                await this.getBookingList()
              } else {
                await this.searchAny()
              }
              // this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(
                  this.getSelectText,
                  this.getSelectCount,
                  this.filterCloseJobValue
                )
              }
              this.getDataCalendaBooking()
              this.dialogDelete = false
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
    },
    async getBookingDataJob (dt, text) {
      console.log('checkDateConfirmJob!!!!!!', dt.checkDateConfirmJob)
      this.masBranchIDAddJob = dt.masBranchID
      this.dueDateText = dt.dueDateText
      let dateCurrent = moment().format('YYYY-MM-DD')
      let dueDate = dt.dueDateDay
      console.log(dateCurrent, dueDate, dt)
      await this.getEmpChange(dt)
      if (dt.checkDateConfirmJob === 'True') {
        this.statusConfirmJob = true
      } else {
        if (dateCurrent >= dueDate) {
          this.statusConfirmJob = true
        } else {
          this.statusConfirmJob = false
        }
      }
      this.endDate = moment().format('YYYY-MM-DD')
      this.endTime = moment().format('HH:mm')
      this.dueDate = dt.dueDateTextDay
      this.statusShowDateConfiremjob = false
      if (this.statusConfirmJob && this.showOnsite === 'แสดง') {
        this.jobCheckPackage = false
        console.log('dt', dt)
        this.dateTimestamp = moment().unix()
        this.remark = dt.remark
        this.userId = dt.userId
        this.lineUserId = dt.lineUserId
        console.log(this.userId, this.lineUserId)
        if (dt.packageId !== '') {
          this.dataPackageDefault = true
        } else {
          this.dataPackageDefault = false
        }
        await this.getPackage(dt)
        if (this.dataPackage.length > 0) {
          console.log(
            'dataPackage',
            this.dataPackage.filter(el => {
              return el.packageId === dt.packageId
            })
          )
          if (
            this.dataPackage.filter(el => {
              return el.packageId === dt.packageId
            }).length > 0
          ) {
            let dataPack = this.dataPackage.filter(el => {
              return el.packageId === dt.packageId
            })
            this.dataPackageDefault = true
            // this.packageId = dataPack[0].value
            this.UpdatePackage(
              dataPack[0].value,
              'ตกลง',
              dataPack[0].text,
              dataPack[0],
              dt.tokenPackage
            )
          } else {
            this.UpdatePackage('', 'ยกเลิก', '', '', '')
            this.dataPackageDefault = false
          }
        }
        if (
          this.EmpItemLimitChange.filter(item => {
            return item.empId === dt.bookingEmpFlow
          }).length > 0
        ) {
          this.timeavailable = JSON.parse(
            this.EmpItemLimitChange.filter(item => {
              return item.empId === dt.bookingEmpFlow
            })[0].setTime
          )
        } else {
          this.timeavailable = []
        }
        this.BookingDataItem = []
        let itemIncustomField = []
        // this.statusConfirmJob = false

        await axios
          .get(
            this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
          )
          .then(async response1 => {
            let rs2 = response1.data
            console.log('BookingField', rs2)
            if (rs2.length > 0) {
              let bookingData = []
              bookingData = JSON.parse(rs2[0].flowfieldName)
              for (let i = 0; i < bookingData.length; i++) {
                let d = bookingData[i]
                itemIncustomField.push(d.fieldId)
              }
              await axios
                .get(
                  this.DNS_IP +
                    '/customField/fieldId?fieldId=' +
                    itemIncustomField
                )
                .then(async responses => {
                  let rs1 = responses.data
                  await axios
                    .get(
                      this.DNS_IP + '/BookingDataSelect/get?bookNo=' + dt.bookNo
                    )
                    .then(async response => {
                      let rs = response.data
                      if (rs.status !== false) {
                        console.log('BookingDataSelect', rs)
                        console.log('customField', rs1)
                        let sortrs = rs1.sort(
                          (a, b) => a.sortNoField - b.sortNoField
                        )
                        for (let i = 0; i < sortrs.length; i++) {
                          let d = sortrs[i]
                          // var s = {}
                          var dataBD = rs.filter(el => {
                            return parseInt(el.fieldId) === parseInt(d.fieldId)
                          })
                          if (dataBD.length > 0) {
                            if (dt.flowId === dataBD[0].flowId) {
                              d.bookNo = dataBD[0].bookNo
                              d.bookingFieldId = rs2[0].bookingFieldId
                              d.bookingDataId = dataBD[0].bookingDataId
                              d.flowId = dataBD[0].flowId
                              d.masBranchID = dataBD[0].masBranchID
                              // d.dueDate = dt.dueDate
                              // d.conditionField = d.conditionField
                              // d.fieldId = d.fieldId
                              // d.fieldType = d.fieldType
                              d.fieldValue = dataBD[0].fieldValue
                              d.packageId = dataBD[0].packageId
                              // d.fieldName = d.fieldName
                              // d.conditionField = d.conditionField
                              // d.conditionValue = d.conditionValue
                              // d.requiredField = d.requiredField
                              // d.optionField = d.optionField
                              // d.userId = d.userId
                              if (rs[0].userId === 'user-skip') {
                                d.userId = ''
                              } else {
                                d.userId = rs[0].userId
                              }
                              d.shopId = this.session.data.shopId
                              d.userName = this.$session.getAll().data.userName
                              this.BookingDataItem.push(d)
                            }
                          }
                        }
                        if (text === 'qrcode') {
                          this.dataQrcode = dt
                        }
                        // await this.getBookingField()
                        await this.getflowfield(dt)
                      } else {
                        this.$swal('ผิดพลาด', 'กรุณาลองใหม่อีกครั้ง', 'error')
                        this.dialogEdit = false
                      }
                    })
                    .catch(error => {
                      console.log('BookingDataSelect : ', error)
                    })
                })
                .catch(error => {
                  console.log('customFiled : ', error)
                })
            }
          })
          .catch(error => {
            console.log('bookingfiled : ', error)
          })
      }
      if (this.showOnsite === 'ไม่แสดง') {
        this.jobCheckPackage = false
        console.log('dt', dt)
        this.dateTimestamp = moment().unix()
        this.remark = dt.remark
        this.userId = dt.userId
        this.lineUserId = dt.lineUserId
        console.log(this.userId, this.lineUserId)
        if (dt.packageId !== '') {
          this.dataPackageDefault = true
        } else {
          this.dataPackageDefault = false
        }
        await this.getPackage(dt)
        if (this.dataPackage.length > 0) {
          console.log(
            'dataPackage',
            this.dataPackage.filter(el => {
              return el.packageId === dt.packageId
            })
          )
          if (
            this.dataPackage.filter(el => {
              return el.packageId === dt.packageId
            }).length > 0
          ) {
            let dataPack = this.dataPackage.filter(el => {
              return el.packageId === dt.packageId
            })
            this.dataPackageDefault = true
            // this.packageId = dataPack[0].value
            this.UpdatePackage(
              dataPack[0].value,
              'ตกลง',
              dataPack[0].text,
              dataPack[0],
              dt.tokenPackage
            )
          } else {
            this.UpdatePackage('', 'ยกเลิก', '', '', '')
            this.dataPackageDefault = false
          }
        }
        if (
          this.EmpItemLimitChange.filter(item => {
            return item.empId === dt.bookingEmpFlow
          }).length > 0
        ) {
          this.timeavailable = JSON.parse(
            this.EmpItemLimitChange.filter(item => {
              return item.empId === dt.bookingEmpFlow
            })[0].setTime
          )
        } else {
          this.timeavailable = []
        }
        this.BookingDataItem = []
        let itemIncustomField = []
        // this.statusConfirmJob = false

        await axios
          .get(
            this.DNS_IP + '/BookingField/get?shopId=' + this.session.data.shopId
          )
          .then(async response1 => {
            let rs2 = response1.data
            console.log('BookingField', rs2)
            if (rs2.length > 0) {
              let bookingData = []
              bookingData = JSON.parse(rs2[0].flowfieldName)
              for (let i = 0; i < bookingData.length; i++) {
                let d = bookingData[i]
                itemIncustomField.push(d.fieldId)
              }
              await axios
                .get(
                  this.DNS_IP +
                    '/customField/fieldId?fieldId=' +
                    itemIncustomField
                )
                .then(async responses => {
                  let rs1 = responses.data
                  await axios
                    .get(
                      this.DNS_IP + '/BookingDataSelect/get?bookNo=' + dt.bookNo
                    )
                    .then(async response => {
                      let rs = response.data
                      if (rs.status !== false) {
                        console.log('BookingDataSelect', rs)
                        console.log('customField', rs1)
                        let sortrs = rs1.sort(
                          (a, b) => a.sortNoField - b.sortNoField
                        )
                        for (let i = 0; i < sortrs.length; i++) {
                          let d = sortrs[i]
                          // var s = {}
                          let dataBD = rs.filter(el => {
                            return parseInt(el.fieldId) === parseInt(d.fieldId)
                          })
                          if (dataBD.length > 0) {
                            if (dt.flowId === dataBD[0].flowId) {
                              d.bookNo = dataBD[0].bookNo
                              d.bookingFieldId = rs2[0].bookingFieldId
                              d.bookingDataId = dataBD[0].bookingDataId
                              d.flowId = dataBD[0].flowId
                              d.masBranchID = dataBD[0].masBranchID
                              // d.dueDate = dt.dueDate
                              // d.conditionField = d.conditionField
                              // d.fieldId = d.fieldId
                              // d.fieldType = d.fieldType
                              d.fieldValue = dataBD[0].fieldValue
                              d.packageId = dataBD[0].packageId
                              // d.fieldName = d.fieldName
                              // d.conditionField = d.conditionField
                              // d.conditionValue = d.conditionValue
                              // d.requiredField = d.requiredField
                              // d.optionField = d.optionField
                              // d.userId = d.userId
                              if (rs[0].userId === 'user-skip') {
                                d.userId = ''
                              } else {
                                d.userId = rs[0].userId
                              }
                              d.shopId = this.session.data.shopId
                              d.userName = this.$session.getAll().data.userName
                              this.BookingDataItem.push(d)
                            }
                          }
                        }
                        if (text === 'qrcode') {
                          this.dataQrcode = dt
                        }
                        // await this.getBookingField()
                        await this.getflowfield(dt)
                      } else {
                        this.$swal('ผิดพลาด', 'กรุณาลองใหม่อีกครั้ง', 'error')
                        this.dialogEdit = false
                      }
                    })
                })
            }
          })
      }
    },
    async getBookingData (dt, text) {
      this.BookingDataItem = []
      await axios
        .get(this.DNS_IP + '/BookingDataSelect/get?bookNo=' + dt.bookNo)
        .then(async response => {
          let rs = response.data
          console.log('BookingDataSelect', rs)
          if (response.data) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              if (d.userId === 'user-skip') {
                d.userId = ''
              }
              d.shopId = this.session.data.shopId
              d.userName = this.$session.getAll().data.userName
              this.BookingDataItem.push(d)
            }
            if (text === 'qrcode') {
              this.dataQrcode = dt
            }
            await this.getflowfield(dt)
          }
        })
    },
    addDataJob () {
      this.validate('UPDATE')
      setTimeout(() => this.addDataJobSubmit(), 500)
    },
    async addDataJobSubmit () {
      if (this.$session.id() !== undefined) {
        if (
          this.dataItem.filter(
            row => row.bookNo === this.BookingDataItem[0].bookNo
          ).length > 0
        ) {
          if (this.validUpdate === true) {
            let checkJobno = ''
            let dataCheck = []
            await axios
              .get(
                this.DNS_IP +
                  '/booking_view/get?bookNo=' +
                  this.BookingDataItem[0].bookNo
              )
              .then(async response => {
                let rs = response.data
                console.log('checkJobNoInBooking', rs)
                if (rs.status === false) {
                  checkJobno = 'ไม่มีข้อมูล'
                  dataCheck = []
                } else {
                  checkJobno = rs[0].jobNo || ''
                  dataCheck = rs
                }
              })
            if (checkJobno === '') {
              console.log('this.BookingDataItem', this.BookingDataItem)
              let Add = []
              let fielditem = this.flowfieldNameitem
              console.log('fielditem', fielditem)
              for (var i = 0; i < this.BookingDataItem.length; i++) {
                var d = this.BookingDataItem[i]
                let update = {}
                let addData = false
                var dataField = this.editedItemSeleteField.filter(el => {
                  return parseInt(el.fieldId) === parseInt(d.fieldId)
                })
                if (
                  dataField[0].conditionField === '' ||
                  dataField[0].conditionField === null
                ) {
                  addData = true
                } else {
                  if (
                    fielditem.filter(row => {
                      return row.fieldId === parseInt(d.conditionField)
                    }).length > 0
                  ) {
                    console.log('this', fielditem)
                    if (
                      d.conditionValue ===
                      fielditem.filter(row => {
                        return row.fieldId === parseInt(d.conditionField)
                      })[0].fieldValue
                    ) {
                      addData = true
                    } else if (d.conditionField === 'flow') {
                      addData = true
                    }
                  } else if (d.conditionField === 'flow') {
                    addData = true
                  }
                }
                if (addData) {
                  if (d.fieldValue !== '') {
                    update.masBranchID =
                      this.BookingDataItem[0].masBranchID || ''
                    update.CREATE_USER = d.userName
                    update.LAST_USER = d.userName
                    update.packageId = d.packageId
                    update.checkCar = ''
                    // update.userId = d.userId
                    update.endDate = this.endDate
                    update.endTime = this.endTime.value
                    update.fieldId = d.fieldId
                    update.fieldName = d.fieldName
                    update.fieldType = dataField[0].fieldType || ''
                    update.fieldValue = d.fieldValue
                    update.flowId = d.flowId
                    update.empSelect = this.empSelectJob
                    update.conditionField = dataField[0].conditionField || ''
                    update.conditionValue = dataField[0].conditionValue || ''
                    update.optionField = dataField[0].optionField || ''
                    update.shopId = dataField[0].shopId || ''
                    update.showCard = dataField[0].showCard || ''
                    update.bookNo = this.BookingDataItem[0].bookNo || ''
                    update.tokenPackage = this.tokenPackage || ''
                    Add.push(update)
                  }
                }
              }
              for (var x = 0; x < fielditem.length; x++) {
                var t = fielditem[x]
                if (
                  Add.filter(row => {
                    return row.fieldId === t.fieldId
                  }).length === 0
                ) {
                  let update = {}
                  let dataField = this.editedItemSeleteField.filter(el => {
                    return parseInt(el.fieldId) === parseInt(t.fieldId)
                  })
                  update.masBranchID =
                    this.BookingDataItem[0].masBranchID || ''
                  update.CREATE_USER = Add[0].CREATE_USER
                  update.LAST_USER = Add[0].CREATE_USER
                  update.packageId = Add[0].packageId
                  update.checkCar = ''
                  // update.userId = Add[0].userId
                  update.endDate = this.endDate
                  update.endTime = this.endTime.value
                  update.fieldId = t.fieldId
                  update.fieldName = t.fieldName
                  update.fieldType = dataField[0].fieldType || ''
                  update.fieldValue = t.fieldValue
                  update.flowId = d.flowId
                  update.empSelect = this.empSelectJob
                  update.conditionField = dataField[0].conditionField || ''
                  update.conditionValue = dataField[0].conditionValue || ''
                  update.optionField = dataField[0].optionField || ''
                  update.shopId = dataField[0].shopId || ''
                  update.showCard = dataField[0].showCard || ''
                  update.bookNo = this.BookingDataItem[0].bookNo || ''
                  update.tokenPackage = this.tokenPackage || ''
                  Add.push(update)
                }
              }
              console.log('this.Add', Add)
              console.log(this.packageId, this.tokenPackage)
              this.swalConfig.title = 'ต้องการนำรายการนี้ เข้าตารางใช่หรือไม่?'
              this.$swal(this.swalConfig).then(async result => {
                this.dataEditJobReady = false
                await axios
                  .post(this.DNS_IP + '/job/addOneStep', Add)
                  .then(async response => {
                    this.endDate = ''
                    this.endTime = ''
                    this.empSelectJob = ''
                    this.statusShowDateConfiremjob = true
                    if (response.data.status) {
                      if (this.jobCheckPackage) {
                        await this.usePackage(
                          this.dataQrcode.bookNo,
                          this.BookingDataItem[0].masBranchID
                        )
                      }
                      this.$swal('เรียบร้อย', 'นำเข้าสำเร็จ', 'success')
                      if (this.statusSearch === 'no') {
                        await this.getBookingList()
                      } else {
                        await this.searchAny()
                      }
                      this.dialogEdit = false
                      this.dataEditJobReady = true
                      var dataJob = this.dataItem.filter(el => {
                        return el.bookNo === this.dataQrcode.bookNo
                      })
                      this.getjob(dataJob[0])
                      this.dialogJob = true
                    } else {
                      this.$swal('ผิดพลาด', 'กรุณาทำรายการใหม่', 'error')
                      this.dialogEdit = false
                      if (this.statusSearch === 'no') {
                        await this.getBookingList()
                      } else {
                        await this.searchAny()
                      }
                      // this.getTimesChange('update')
                      if (this.getSelectText) {
                        this.getSelect(
                          this.getSelectText,
                          this.getSelectCount,
                          this.filterCloseJobValue
                        )
                      }
                    }
                  })
                  .catch(error => {
                    setTimeout(() => this.addDataJobSubmit(), 3000)
                    console.log('error function addData : ', error)
                  })
              })
            } else {
              if (dataCheck[0].statusBt === 'confirm') {
                let dt = {
                  // pageStatus: 'cancel',
                  // limitBookingCount: dtint,
                  bookNo: dataCheck[0].bookNo,
                  contactDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                  status: 'confirmJob',
                  statusUse: 'use',
                  shopId: this.$session.getAll().data.shopId,
                  CREATE_USER: this.$session.getAll().data.userName,
                  LAST_USER: this.$session.getAll().data.userName
                }
                axios
                  .post(this.DNS_IP + '/booking_transaction/add', dt)
                  .then(async response => {
                    this.endDate = ''
                    this.endTime = ''
                    this.empSelectJob = ''
                    this.statusShowDateConfiremjob = true
                    if (this.jobCheckPackage) {
                      await this.usePackage(
                        this.dataQrcode.bookNo,
                        this.BookingDataItem[0].masBranchID
                      )
                    }
                    this.$swal('เรียบร้อย', 'นำเข้าสำเร็จ', 'success')
                    if (this.statusSearch === 'no') {
                      await this.getBookingList()
                    } else {
                      await this.searchAny()
                    }
                    this.dialogEdit = false
                    this.dataEditJobReady = true
                    var dataJob = this.dataItem.filter(el => {
                      return el.bookNo === this.dataQrcode.bookNo
                    })
                    this.getjob(dataJob[0])
                    this.dialogJob = true
                  })
                  .catch(error => {
                    console.log('error function addData : ', error)
                  })
              } else {
                this.$swal(
                  'ผิดพลาด',
                  'รายการนี้ได้นำเข้ากระดานการทำงานแล้ว',
                  'error'
                )
                  .then(async response => {
                    this.dialogEdit = false
                    if (this.statusSearch === 'no') {
                      await this.getBookingList()
                    } else {
                      await this.searchAny()
                    }
                    // this.getTimesChange('update')
                    if (this.getSelectText) {
                      this.getSelect(
                        this.getSelectText,
                        this.getSelectCount,
                        this.filterCloseJobValue
                      )
                    }
                  })
                  .catch(error => {
                    console.log('error function addData : ', error)
                    this.dialogEdit = false
                    if (this.statusSearch === 'no') {
                      this.getBookingList()
                    } else {
                      this.searchAny()
                    }
                    // this.getTimesChange('update')
                    if (this.getSelectText) {
                      this.getSelect(
                        this.getSelectText,
                        this.getSelectCount,
                        this.filterCloseJobValue
                      )
                    }
                  })
              }
            }
          }
        } else {
          this.$swal('ผิดพลาด', 'ไม่มีนัดหมายเข้ารับบริการนี้', 'error')
            .then(async response => {
              this.dialogEdit = false
              if (this.statusSearch === 'no') {
                await this.getBookingList()
              } else {
                await this.searchAny()
              }
              // this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(
                  this.getSelectText,
                  this.getSelectCount,
                  this.filterCloseJobValue
                )
              }
            })
            .catch(error => {
              console.log('error function addData : ', error)
              this.dialogEdit = false
              if (this.statusSearch === 'no') {
                this.getBookingList()
              } else {
                this.searchAny()
              }
              // this.getTimesChange('update')
              if (this.getSelectText) {
                this.getSelect(
                  this.getSelectText,
                  this.getSelectCount,
                  this.filterCloseJobValue
                )
              }
            })
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async pushMsg (jobNo) {
      const result = await axios
        .get(
          this.DNS_IP +
            '/member/get?shopId=' +
            this.session.data.shopId +
            '&liffUserId=' +
            this.BookingDataItem[0].userId
        )
        .catch(error => {
          console.log('error function addData : ', error)
        })
      console.log('result', result.data.status)
      if (result.data.status === false) {
        let statusSend = {
          statusSend: 'false'
        }
        await axios.post(this.DNS_IP + '/job/updateJobNo/' + jobNo, statusSend)
        console.log('statusSend', 'false')
      }
      let updateStatusSend = {
        updateStatusSend: 'false'
      }
      await axios
        .post(this.DNS_IP + '/job/NotifyQrcode/' + jobNo, updateStatusSend)
        .then(
          this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
          // this.clearData()
          // this.$router.push('/Master/FlowStep')
        )
        .catch(error => {
          console.log('error function addDataGlobal : ', error)
        })
      // this.clearData()
    },
    async getEmpSelect (item) {
      this.empSelectStep = []
      await axios
        .get(
          this.DNS_IP +
            '/empSelect/getUse?privacyPage=booking&shopId=' +
            item.shopId
        )
        .then(async response => {
          let rs = response.data
          console.log('rs-EMP------------', rs)
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              if (d.masBranchID === item.masBranchID) {
                let s = {}
                s.text = d.empFirst_NameTH
                s.value = d.empId
                this.empSelectStep.push(s)
              } else if (d.masBranchID === null || d.masBranchID === '') {
                let s = {}
                s.text = d.empFirst_NameTH
                s.value = d.empId
                this.empSelectStep.push(s)
              }
            }
            this.empSelect = this.empSelectStep[0].value
          }
        })
    },
    async getEmpSelectAddJob () {
      this.empSelectStepAdd = []
      await axios
        .get(
          this.DNS_IP +
            '/empSelect/getUse?empIdUser=isNotNull&shopId=' +
            this.$session.getAll().data.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              var s = {}
              s.text = d.empFull_NameTH
              s.value = d.empId
              this.empSelectStepAdd.push(s)
            }
          }
        })
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
                console.log('D', d)
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
            if (
              this.$session.getAll().data.empId !== '' &&
              this.$session.getAll().data.empId !== null
            ) {
              this.empSelectAdd = this.empSelectStepAdd.filter(
                item =>
                  item.value === parseInt(this.$session.getAll().data.empId)
              )[0].value
            }
            console.log('this.empSelectStepAdd', this.empSelectStepAdd)
          }
        })
    },
    async confirmChk (item) {
      this.dateTimestamp = moment().unix()
      this.dataConfirm = item
      console.log('item', item)
      this.remark = item.remark
      this.userId = item.userId
      this.credit_package = item.credit_package || 1
      this.lineUserId = item.lineUserId
      console.log(this.userId, this.lineUserId)
      await this.getEmpSelect(item)
      await this.getPackage(item)
      if (this.dataPackage.length > 0) {
        if (
          this.dataPackage.filter(el => {
            return el.packageId === item.packageId
          }).length > 0
        ) {
          var dataPack = this.dataPackage.filter(el => {
            return el.packageId === item.packageId
          })
          // this.packageId = dataPack[0].value
          this.UpdatePackage(
            dataPack[0].value,
            'ตกลง',
            dataPack[0].text,
            dataPack[0],
            item.tokenPackage
          )
        } else {
          this.UpdatePackage('', 'ยกเลิก', '', '', '')
        }
      }
      this.dialogConfirm = true
    },
    async onConfirm (item) {
      if (this.$session.id() !== undefined) {
        let statusCheckUsePackage = true
        if (this.packageId !== '') {
          statusCheckUsePackage = await this.usePackageConfirmBooking(
            item.bookNo,
            item.masBranchID
          )
        }
        if (statusCheckUsePackage === true) {
          var dt = {
            bookNo: item.bookNo,
            contactDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            status: 'confirm',
            statusUse: 'use',
            // pageStatus: this.getSelectText,
            // limitBookingCount: dtint,
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.session.data.userName,
            LAST_USER: this.session.data.userName,
            packageId: this.packageId,
            tokenPackage: this.tokenPackage
          }
          axios
            .post(this.DNS_IP + '/booking_transaction/add', dt)
            .then(async response => {
              if (response.data.status === true) {
                this.$swal('เรียบร้อย', 'เพิ่มข้อมูล เรียบร้อย', 'success')
                if (this.statusGoogleCalendar === 'True') {
                  this.connectGoogleCalendar('Add', dt.bookNo)
                }
                await this.updateRemarkAndEmpSelect(item)
                // this.getDataCalendaBooking()
                let DTitem = item.userId
                console.log('DTITEM', DTitem)
                if (DTitem !== 'user-skip') {
                  if (this.statusSearch === 'no') {
                    await this.getBookingList()
                  } else {
                    await this.searchAny()
                  }
                  // this.getTimesChange('update')
                  if (this.getSelectText) {
                    this.getSelect(
                      this.getSelectText,
                      this.getSelectCount,
                      this.filterCloseJobValue
                    )
                  }
                  this.pushMsgConfirm(item.bookNo)
                } else {
                  if (this.statusSearch === 'no') {
                    await this.getBookingList()
                  } else {
                    await this.searchAny()
                  }
                  // this.getTimesChange('update')
                  if (this.getSelectText) {
                    this.getSelect(
                      this.getSelectText,
                      this.getSelectCount,
                      this.filterCloseJobValue
                    )
                  }
                }
                this.dataConfirmReady = true
                this.dialogConfirm = false
              } else {
                this.dataConfirmReady = true
                this.$swal('ผิดพลาด', response.data.message, 'error')
              }
            })
            .catch(error => {
              console.log('error function addData : ', error)
            })
        } else {
          this.$swal('ผิดพลาด', 'ไม่สามารถใช้งานแพคเกจได้', 'error')
        }
      } else {
        this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
        clearInterval(this.setTimerCalendar)
        this.setTimerCalendar = null
        this.$router.push('/Core/Login')
      }
    },
    async getamountOf (bookNo) {
      let booking = await axios.get(
        this.DNS_IP + '/booking_view/get?bookNo=' + bookNo
      )
      console.log('booking', booking)
      return booking.data[0].credit_package || 1
    },
    async usePackage (bookNo, masBranchID) {
      let amountOf = 1
      if (
        this.$session.getAll().data.shopId ===
        'Ub7cbc419244731cdd682354dd0e57cef'
      ) {
        amountOf = await this.getamountOf(bookNo)
      }
      // let params = {
      //   shopId: this.$session.getAll().data.shopId,
      //   token: this.StatusPackage.token,
      //   branchBeLinked: masBranchID,
      //   amountOf: amountOf
      // }
      let params = {
        amountOf: amountOf
      }
      // await axios({
      //   method: 'post',
      //   headers: {
      //     shopId: this.$session.getAll().data.shopId
      //   },
      //   url: this.DNS_IP_Loyalty + '/use_package/edit?shopId=' + this.$session.getAll().data.shopId + '&token=' + this.StatusPackage.token,
      //   // url: this.DNS_IP_Loyalty + '/use_package/edit?shopId=' + this.$session.getAll().data.shopId + '&token=' + this.StatusPackage.token + '&branchBeLinked=' + masBranchID,
      //   data: params
      // }).then((response) => {
      //   console.log('response', response)
      // })
      await axios
        .post(
          this.DNS_IP_Loyalty +
            '/use_package/edit?shopId=' +
            this.$session.getAll().data.shopId +
            '&token=' +
            this.StatusPackage.token,
          params,
          {
            headers: {
              shopId: this.$session.getAll().data.shopId
            }
          }
        )
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.error(error)
        })
      await this.updatePackageInBooking(
        this.$session.getAll().data.shopId,
        this.StatusPackage.token,
        this.packageId,
        bookNo
      )
    },
    async usePackageConfirmBooking (bookNo, masBranchID) {
      let status = true
      try {
        let amountOf = 1
        if (
          this.$session.getAll().data.shopId ===
          'Ub7cbc419244731cdd682354dd0e57cef'
        ) {
          amountOf = await this.getamountOf(bookNo)
        }
        // let params = {
        //   shopId: this.$session.getAll().data.shopId,
        //   token: this.StatusPackage.token,
        //   branchBeLinked: masBranchID,
        //   amountOf: amountOf
        // }
        let params = {
          amountOf: amountOf
        }
        // await axios({
        //   method: 'post',
        //   headers: {
        //     shopId: this.$session.getAll().data.shopId
        //   },
        //   url: this.DNS_IP_Loyalty + '/use_package/edit?shopId=' + this.$session.getAll().data.shopId + '&token=' + this.StatusPackage.token,
        //   // url: this.DNS_IP_Loyalty + '/use_package/edit?shopId=' + this.$session.getAll().data.shopId + '&token=' + this.StatusPackage.token + '&branchBeLinked=' + masBranchID,
        //   data: params
        // }).then((response) => {
        //   console.log('response', response)
        // })
        await axios
          .post(
            this.DNS_IP_Loyalty +
              '/use_package/edit?shopId=' +
              this.$session.getAll().data.shopId +
              '&token=' +
              this.StatusPackage.token,
            params,
            {
              headers: {
                shopId: this.$session.getAll().data.shopId
              }
            }
          )
          .then(response => {
            console.log(response.data)
            status = response.data.status
          })
          .catch(error => {
            status = false
            console.error(error)
          })
        await this.updatePackageInBooking(
          this.$session.getAll().data.shopId,
          this.StatusPackage.token,
          this.packageId,
          bookNo
        )
      } catch (error) {
        status = false
      }
      return status
    },
    async updatePackageInBooking (shopId, token, packageId, bookNo) {
      console.log(shopId, token, packageId, bookNo)
      await axios
        .get(
          this.DNS_IP_Loyalty +
            '/PackageLog/get?shopId=' +
            shopId +
            '&token=' +
            token +
            '&packageId=' +
            packageId
        )
        .then(async response => {
          console.log('updatePackageInBooking', response.data)
          let rs = response.data
          if (rs.status !== false) {
            var dt = {
              packageName: rs[0].packageName,
              packageDetails: rs[0].packageDetail,
              packageImage: rs[0].packageImg,
              packagePrice: rs[0].packagePrice,
              packageBalanceAmount: rs[0].balanceAmount,
              packageAmount: rs[0].amount,
              packagePoint: rs[0].packagePoint,
              packageExpire: rs[0].packageExpire
            }
            await axios
              .post(
                // eslint-disable-next-line quotes
                this.DNS_IP + "/Booking/edit/" + bookNo,
                dt
              )
              .then(async response => {})
              .catch(error => {
                console.log(error)
              })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    async updateRemarkAndEmpSelect (item) {
      var dt = {
        LAST_USER: this.session.data.userName,
        empSelect: this.empSelect,
        remark: (this.remark || '').replace(/%/g, '%%')
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + item.bookNo,
          dt
        )
        .then(async response => {})
    },
    async updateRemark (item) {
      var dt = {
        LAST_USER: this.session.data.userName,
        empSelect: this.empSelect
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + item.bookNo,
          dt
        )
        .then(async response => {})
    },
    async setDataRemove (item) {
      this.statusVIPRemove = item.statusVIP
      this.bookNoRemove = item
      this.dueDateOld = item.dueDateDay
      this.dueDateTimeOld = item.timeDuetext
      await this.getEmpSelect(item)
      this.getEmpChange(item)
      this.dialogRemove = true
    },
    cancelChk () {
      this.validate('REMOVE')
      console.log('this.bookNoRemove', this.bookNoRemove)
      setTimeout(() => this.onCancelChk(this.bookNoRemove), 500)
    },
    async updateLimitBookingCancel (item, dueDateOld, dueDateTimeOld) {
      let result = []
      let dt = {
        flowId: item.flowId,
        dateSelect: dueDateOld,
        timeSelect: dueDateTimeOld,
        shopId: item.shopId,
        userId: item.userId,
        bookingEmpFlow: item.bookingEmpFlow,
        masBranchID: item.masBranchID,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/Booking/updateLimitBookingCancelEmp', dt)
        .then(async response => {
          result = response.data
        })
      return result
    },
    async onCancelChk (dt) {
      if (this.validRemove === true) {
        if (this.$session.id() !== undefined) {
          let chkStatLimit = this.dataEmpAllChange.filter(el => {
            return el.empId === dt.bookingEmpFlow
          })
          if (chkStatLimit.length > 0) {
            if (chkStatLimit[0].limitBookingCheck === 'True') {
              if (this.statusVIPRemove === 'False') {
                let chkStatus = await this.updateLimitBookingCancel(
                  this.bookNoRemove,
                  this.dueDateOld,
                  this.dueDateTimeOld
                )
                console.log('chkStatus', chkStatus)
                if (chkStatus.status) {
                  this.onCancelChkSubmit()
                } else {
                  this.onCancelChkSubmit()
                }
              } else {
                this.onCancelChkSubmit()
              }
            } else {
              this.onCancelChkSubmit()
            }
          } else {
            this.onCancelChkSubmit()
          }
        } else {
          this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
          clearInterval(this.setTimerCalendar)
          this.setTimerCalendar = null
          this.$router.push('/Core/Login')
        }
      }
    },
    onCancelChkSubmit () {
      this.dataCancelReady = false
      var dt = {
        bookNo: this.bookNoRemove.bookNo,
        contactDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: 'cancel',
        statusUse: 'use',
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.session.data.userName,
        LAST_USER: this.session.data.userName,
        remarkRemove: (this.remarkRemove || '').replace(/%/g, '%%')
      }
      axios
        .post(this.DNS_IP + '/booking_transaction/add', dt)
        .then(async response => {
          if (this.statusGoogleCalendar === 'True') {
            this.connectGoogleCalendar('Delete', dt.bookNo)
          }
          await this.updateRemark(this.bookNoRemove)
          this.pushMsglineCancel(this.bookNoRemove)
          this.$swal('เรียบร้อย', 'ยกเลิกเรียบร้อย', 'success')
          console.log('addDataGlobal', response)
          if (this.statusSearch === 'no') {
            await this.getBookingList()
          } else {
            await this.searchAny()
          }
          // this.getTimesChange('update')
          if (this.getSelectText) {
            this.getSelect(
              this.getSelectText,
              this.getSelectCount,
              this.filterCloseJobValue
            )
          }
          // this.getDataCalendaBooking()
          this.dataCancelReady = true
          this.dialogRemove = false
          this.sendRemarkRemove = false
          this.remarkRemove = ''
          this.bookNo = ''
        })
        .catch(error => {
          console.log('error function addData : ', error)
          this.dataCancelReady = true
        })
    },
    pushMsglineCancel (item) {
      let lineUserId = item.lineUserId || ''
      if (lineUserId !== '') {
        var dt = {
          bookNo: item.bookNo,
          lineUserId: lineUserId,
          dueDate: item.dueDateText,
          flowName: item.flowName,
          shopId: this.$session.getAll().data.shopId,
          tell: this.$session.getAll().data.contactTel,
          sendRemarkRemove: this.sendRemarkRemove
        }
        axios
          .post(this.DNS_IP + '/Booking/pushMsgCancelBook', dt)
          .then(async response => {})
      }
    },
    async changeChk (item, changeStatus) {
      this.dataChangeReady = false
      if (this.formChange.time !== '') {
        if (item.statusBt === 'confirm') {
          if (this.remark !== '') {
            var dt = {
              LAST_USER: this.session.data.userName,
              remark: (this.remark || '').replace(/%/g, '%%')
            }
            await axios
              .post(
                // eslint-disable-next-line quotes
                this.DNS_IP + "/Booking/edit/" + item.bookNo,
                dt
              )
              .then(async response => {
                this.onChangeChk(item, changeStatus)
              })
          } else {
            this.$swal('ผิดพลาด', 'กรุณาใส่ หมายเหตุเพิ่มเติม', 'error')
            this.dataChangeReady = true
          }
        } else {
          this.onChangeChk(item, changeStatus)
        }
      } else {
        this.dataChangeReady = true
        this.$swal('ผิดพลาด', 'กรุณาเลือกเวลา', 'error')
      }
    },
    onChangeChk (item, changeStatus) {
      console.log('item', item)
      console.log('formChange', this.formChange)
      this.swalConfig.title = 'ต้องการ เปลี่ยนเวลานัดหมาย ใช่หรือไม่?'
      this.$swal(this.swalConfig)
        .then(async result => {
          if (this.$session.id() !== undefined) {
            let checkCountTime = await axios.get(
              this.DNS_IP + '/booking_view/get?bookNo=' + item.bookNo
            )
            if (checkCountTime.data.status === false) {
              this.onChangeChk(item, changeStatus)
            } else {
              if (this.getSelectText === 'cancel') {
                this.onChangeChkSubmit(item, changeStatus, checkCountTime)
              } else {
                let chkStatLimit = this.dataEmpAllChange.filter(el => {
                  return el.empId === item.bookingEmpFlow
                })
                console.log('chkStatLimit', chkStatLimit)
                if (chkStatLimit.length > 0) {
                  console.log(
                    'chkStatLimit',
                    chkStatLimit[0].limitBookingCheck
                  )
                  if (chkStatLimit[0].limitBookingCheck === 'True') {
                    let chkStatus = await this.updateLimitBookingChange(
                      item,
                      this.dueDateOld,
                      this.dueDateTimeOld,
                      this.formChange.date,
                      this.formChange.time.value || this.formChange.time,
                      item.flowId,
                      'chang',
                      item.masBranchID
                    )
                    console.log('chkStatus', chkStatus)
                    if (chkStatus.status) {
                      this.onChangeChkSubmit(
                        item,
                        changeStatus,
                        checkCountTime
                      )
                    } else {
                      this.$swal(
                        'ผิดพลาด',
                        'เวลาที่ท่านเลือกคิวเต็มแล้ว',
                        'error'
                      )
                      this.dataChangeReady = true
                    }
                  } else {
                    this.onChangeChkSubmit(item, changeStatus, checkCountTime)
                  }
                } else {
                  this.onChangeChkSubmit(item, changeStatus, checkCountTime)
                }
              }
            }
          } else {
            this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
            clearInterval(this.setTimerCalendar)
            this.setTimerCalendar = null
            this.$router.push('/Core/Login')
          }
        })
        .catch(error => {
          this.dataChangeReady = true
          console.log('catch alear : ', error)
        })
    },
    async onChangeChkSubmit (item, changeStatus, checkCountTime) {
      let countTime = 0
      if (checkCountTime) {
        countTime = checkCountTime.data[0].countChangeTime || 0
      }
      let dueOld = this.dueDateOld + this.dueDateTimeOld
      let dueNew =
        this.formChange.date + this.formChange.time.value ||
        this.formChange.time
      console.log('dueNew', dueNew)
      console.log('dueOld', dueOld)
      if (dueOld === dueNew) {
        countTime = countTime + 0
      } else {
        countTime = countTime + 1
      }
      var dtChange = {
        countChangeTime: countTime,
        changeDueDate: 'change',
        dueDate:
          this.formChange.date + ' ' + this.formChange.time.value ||
          this.formChange.time,
        timeText: this.formChange.time.text,
        LAST_USER: this.session.data.userName,
        countHourLimit: this.selectCountBookingLimit
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/BookingData/edit/" + item.bookNo,
          dtChange
        )
        .then(async response => {
          var dt = {
            bookNo: item.bookNo,
            contactDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            status: changeStatus,
            statusUse: 'use',
            shopId: this.$session.getAll().data.shopId,
            CREATE_USER: this.session.data.userName,
            LAST_USER: this.session.data.userName,
            changDate:
              this.formChange.date + ' ' + this.formChange.time.value ||
              this.formChange.time
          }
          await axios
            .post(this.DNS_IP + '/booking_transaction/add', dt)
            .then(async response => {
              console.log('addDataGlobal', response)
              console.log('*****', item.statusBt, changeStatus)
              if (
                (item.statusBt === 'confirm' ||
                  item.statusBt === 'confirmJob') &&
                (changeStatus === 'change' || changeStatus === 'confirm')
              ) {
                console.log('*****Edit')
                // edit
                if (this.statusGoogleCalendar === 'True') {
                  this.connectGoogleCalendar('Edit', dt.bookNo)
                }
              }
              if (item.statusBt === 'wait' && changeStatus === 'confirm') {
                console.log('*****Add')
                // create
                if (this.statusGoogleCalendar === 'True') {
                  this.connectGoogleCalendar('Add', dt.bookNo)
                }
              }
              if (
                item.statusBt === 'confirm' ||
                item.statusBt === 'confirmJob'
              ) {
                if (item.userId !== 'user-skip') {
                  if (this.statusSearch === 'no') {
                    await this.getBookingList()
                  } else {
                    await this.searchAny()
                  }
                  // this.getTimesChange('update')
                  if (this.getSelectText) {
                    this.getSelect(
                      this.getSelectText,
                      this.getSelectCount,
                      this.filterCloseJobValue
                    )
                  }
                  this.pushMsgConfirmChangeTime(item.bookNo)
                } else {
                  if (this.statusSearch === 'no') {
                    await this.getBookingList()
                  } else {
                    await this.searchAny()
                  }
                  // this.getTimesChange('update')
                  if (this.getSelectText) {
                    this.getSelect(
                      this.getSelectText,
                      this.getSelectCount,
                      this.filterCloseJobValue
                    )
                  }
                }
              } else {
                if (this.statusSearch === 'no') {
                  await this.getBookingList()
                } else {
                  await this.searchAny()
                }
                // this.getTimesChange('update')
                if (this.getSelectText) {
                  this.getSelect(
                    this.getSelectText,
                    this.getSelectCount,
                    this.filterCloseJobValue
                  )
                }
              }
              this.$swal(
                'เรียบร้อย',
                'เปลี่ยนเวลานัดหมาย เรียบร้อย',
                'success'
              )
              this.dataChangeReady = true
              this.dialogChange = false
              this.fromAddTimeCus = ''
            })
            .catch(error => {
              console.log('error function addData : ', error)
            })
        })
    },
    async updateLimitBookingChange (
      item,
      dueDateOld,
      dueDateTimeOld,
      dueDateNew,
      dueDateTimeNew,
      flowIdNew,
      Textcheck,
      masBranchIDNew
    ) {
      let result = []
      let timeSlotCustomer = ''
      if (this.customerTimeSlot === 'True') {
        timeSlotCustomer = this.fromAddTimeCus
      } else {
        timeSlotCustomer = this.DataFlowNameDefault.filter(
          v => v.value === flowIdNew
        )[0].allData.timeSlot
      }
      let bookingEmpFlow = ''
      if (Textcheck === 'Edit') {
        bookingEmpFlow = this.formEdit.bookingEmpFlow
      } else {
        bookingEmpFlow = item.bookingEmpFlow
      }
      let dt = {
        dueDateOld: dueDateOld,
        dueDateTimeOld: dueDateTimeOld,
        dueDateNew: dueDateNew,
        dueDateTimeNew: dueDateTimeNew,
        flowId: item.flowId,
        flowIdNew: flowIdNew,
        masBranchID: item.masBranchID,
        masBranchIDNew: masBranchIDNew,
        dateSelect: dueDateNew,
        timeSelect: dueDateTimeNew,
        shopId: item.shopId,
        timeSlotCustomer: timeSlotCustomer,
        userId: item.userId,
        bookingEmpFlow: bookingEmpFlow,
        bookingEmpFlowOld: item.bookingEmpFlow,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(this.DNS_IP + '/Booking/updateLimitBookingChangeTimeEmp', dt)
        .then(async response => {
          result = response.data
        })
      return result
    },
    async updateLimitBookingEdit (
      item,
      dueDateOld,
      dueDateTimeOld,
      dueDateNew,
      dueDateTimeNew,
      limitBookingCount
    ) {
      let result = []
      let dt = {
        dueDateOld: dueDateOld,
        dueDateTimeOld: dueDateTimeOld,
        dueDateNew: dueDateNew,
        dueDateTimeNew: dueDateTimeNew,
        flowId: item.flowId,
        flowIdOld: this.flowIdOldEdit,
        masBranchID: item.masBranchID,
        dateSelect: dueDateNew,
        timeSelect: dueDateTimeNew,
        shopId: item.shopId,
        userId: this.$session.getAll().data.userName || 'Admin',
        limitBookingCount: limitBookingCount
      }
      await axios
        .post(this.DNS_IP + '/Booking/updateLimitBookingEdit', dt)
        .then(async response => {
          result = response.data
        })
      return result
    },
    async manageLimitBooking () {
      var dt = {
        dataLimit: this.limitCountBranch,
        dataLimitOld: this.limitCountBranchOld,
        dueDateNew: this.formChange.date,
        dueDateOld: this.dueDateOld,
        masBranchIDLimit: this.masBranchIDLimit,
        flowId: this.flowIDLimit,
        shopId: this.$session.getAll().data.shopId,
        CREATE_USER: this.session.data.userName,
        LAST_USER: this.session.data.userName
      }
      console.log('manageLimitBooking', dt)
      await axios
        .post(this.DNS_IP + '/LimitBookingDate/manage', dt)
        .then(async response => {})
    },
    async getChangeOnsite (item) {
      await this.getEmpSelectAddJob()
      this.jobitem = []
      console.log(item)
      console.log(this.empSelectStepAdd)
      if (item.jobNo !== '') {
        await axios
          .get(this.DNS_IP + '/job/getJobNo?jobNo=' + item.jobNo)
          .then(response => {
            let rs = response.data
            console.log('getJobNo', rs)
            if (rs.status === false) {
            } else {
              this.jobitem = rs
              this.sortNo = rs[0].sortNo
              this.empSelectJob = parseInt(rs[0].empStepId)
              this.flowId = rs[0].flowId
              console.log('this.flowId', this.flowId)
              if (this.sortNo === 1) {
                this.checkEmpJob()
              }
            }
          })
      }
    },
    async getjob (item) {
      console.log(item)
      this.bookNo = item.bookNo
      this.jobitem = []
      if (item.jobNo !== '') {
        this.getCoin(item)
        await axios
          .get(this.DNS_IP + '/job/getJobNo?jobNo=' + item.jobNo)
          .then(async response => {
            let rs = response.data
            let Id = ''
            let IdJob = ''
            let memberPicture = ''
            console.log('getJobNo', rs)
            if (rs.length > 0) {
              for (var i = 0; i < rs.length; i++) {
                let d = rs[i]
                let s = {
                  Id: d.jobId,
                  value: d.fieldValue,
                  name: d.fieldName,
                  showCard: d.showCard,
                  jobNo: d.jobNo,
                  checkPayment: d.checkPayment,
                  recordStatus: d.RECORD_STATUS
                }
                d.userId = d.userId || ''
                d.memberPicture = d.memberPicture || ''
                if (d.userId !== '') {
                  IdJob = d.userId
                }
                if (d.memberPicture !== '') {
                  memberPicture = d.memberPicture || ''
                }
                this.jobitem.push(s)
              }
              Id = item.userId
              let checkBookingMember = ''
              if (Id !== '') {
                const result = await axios
                  .get(
                    this.DNS_IP +
                      '/member/get?shopId=' +
                      this.session.data.shopId +
                      '&liffUserId=' +
                      Id
                  )
                  .catch(error => {
                    console.log('error function addData : ', error)
                  })
                console.log('result', result.data)
                if (result.data.status === false) {
                  checkBookingMember = ''
                } else {
                  checkBookingMember = result.data[0]
                }
              }
              this.userId = IdJob
              this.memberPicture = memberPicture
              if (checkBookingMember !== '' && this.memberPicture === '') {
                this.checkShowSelectUser = true
                this.dataSelectUser = checkBookingMember
              } else {
                this.checkShowSelectUser = false
                this.dataSelectUser = ''
              }
              this.value =
                this.pathToweb +
                this.jobitem[0].Id +
                '&shopId=' +
                this.$session.getAll().data.shopId
              this.recordStatusJob = this.jobitem[0].recordStatus
              this.checkPayment = this.jobitem[0].checkPayment
              this.formCloseJob.jobNo = this.jobitem[0].jobNo
              this.formCloseJob.jobId = this.jobitem[0].Id
              console.log('this.value', this.value)
              // this.getUserId()
            }
          })
      }
    },
    async getCoin (dt) {
      if (dt.lineUserId !== '') {
        let checkLine = await this.getDataLineConfig(dt.shopId)
        let urlLoyalty = ''
        if (checkLine.checkLineConfig === false) {
          urlLoyalty =
            this.DNS_IP_Loyalty +
            '/member/get?shopId=' +
            dt.shopId +
            '&lineUserId=' +
            dt.lineUserId
        } else {
          urlLoyalty =
            this.DNS_IP_Loyalty +
            '/member/get?shopId=' +
            dt.shopId +
            '&liffUserId=' +
            dt.lineUserId
        }
        await axios.get(urlLoyalty).then(response => {
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
        })
        if (this.lineUserId !== '') {
          this.dataCoin = []
          await axios
            .get(
              this.DNS_IP_Loyalty +
                '/productExchangeRate/get?shopId=' +
                dt.shopId +
                '&flowId=' +
                dt.flowId
            )
            .then(response => {
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
            })
        }
      }
    },
    async jobConfirm () {
      this.swalConfig.title = 'ต้องการ ยืนยันข้อมูล ใช่หรือไม่?'
      this.$swal(this.swalConfig).then(async () => {
        if (this.$session.id() !== undefined) {
          await axios
            .post(this.DNS_IP + '/job/update/' + this.jobitem[0].Id, this.skip)
            .then(async response => {
              console.log(response)
              if (response.data.status) {
                this.getDataCalendaBooking()
                this.$swal('เรียบร้อย', 'ปรับปรุงเรียบร้อย', 'success')
                this.dialogJob = false
              } else {
                this.$swal(
                  'ผิดพลาด',
                  'เนื่องจากรายการนี้มีคนนำเข้าแล้ว',
                  'error'
                )
                this.dialogJob = false
              }
            })
        } else {
          this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
          clearInterval(this.setTimerCalendar)
          this.setTimerCalendar = null
          this.$router.push('/Core/Login')
        }
      })
    },
    async jobConfirmUser () {
      console.log('this.jobitem', this.jobitem)
      console.log('this.BookingDataItem', this.BookingDataItem)
      this.swalConfig.title = 'ต้องการ ยืนยันข้อมูล ใช่หรือไม่?'
      this.$swal(this.swalConfig).then(async () => {
        if (this.$session.id() !== undefined) {
          let dt = {
            userId: this.dataSelectUser.liffUserId
          }
          await axios
            .post(this.DNS_IP + '/job/update/' + this.jobitem[0].Id, dt)
            .then(async response => {
              console.log(response)
              if (response.data.status) {
                let statusSend = {
                  statusSend: 'true'
                }
                await axios
                  .post(
                    this.DNS_IP + '/job/updateJobNo/' + this.jobitem[0].jobNo,
                    statusSend
                  )
                  .then(async response => {
                    // let lineUserId = result.data[0].lineUserId
                    console.log('statusSend', 'true')
                    let updateStatusSend = {
                      updateStatusSend: 'false'
                    }
                    await axios
                      .post(
                        this.DNS_IP + '/job/pushMsg/' + response.data.jobId,
                        updateStatusSend
                      )
                      .catch(error => {
                        console.log('error function addData : ', error)
                      })
                  })
                this.getDataCalendaBooking()
                this.$swal('เรียบร้อย', 'ปรับปรุงเรียบร้อย', 'success')
                this.dialogJob = false
              } else {
                this.$swal(
                  'ผิดพลาด',
                  'เนื่องจากรายการนี้มีคนนำเข้าแล้ว',
                  'error'
                )
                this.dialogJob = false
              }
            })
        } else {
          this.$swal('ผิดพลาด', 'กรุณาลองอีกครั่ง', 'error')
          clearInterval(this.setTimerCalendar)
          this.setTimerCalendar = null
          this.$router.push('/Core/Login')
        }
      })
    },
    async pushMsgSelectUser () {
      let statusSend = {
        statusSend: 'false'
      }
      await axios.post(
        this.DNS_IP + '/job/updateJobNo/' + this.jobitem[0].jobNo,
        statusSend
      )
      console.log('statusSend', 'false')
      let updateStatusSend = {
        updateStatusSend: 'false'
      }
      await axios
        .post(
          this.DNS_IP + '/job/NotifyQrcode/' + this.jobitem[0].jobNo,
          updateStatusSend
        )
        .then(async response => {
          this.$swal(
            'เรียบร้อย',
            'ส่ง QR Code กลุ่มของท่านเรียบร้อย',
            'success'
          )
          this.dialogJob = false
          // this.clearData()
          // this.$router.push('/Master/FlowStep')
        })
        .catch(error => {
          console.log('error function addDataGlobal : ', error)
        })
    },
    async setBookingingAgain () {
      // await this.getBookingField()
      console.log(this.userId)
      console.log(this.bookNo)
      let booking = await axios.get(
        this.DNS_IP +
          '/booking_view/get?shopId=' +
          this.session.data.shopId +
          '&bookNo=' +
          this.bookNo +
          this.selectOnsite
      )
      let bookingData = await axios.get(
        this.DNS_IP +
          '/BookingData/get?shopId=' +
          this.session.data.shopId +
          '&bookNo=' +
          booking.data[0].bookNo
      )
      // console.log('this.fieldNameItem', this.fieldNameItem)
      this.booking = booking.data
      this.bookingData = bookingData.data
      console.log('booking', booking)
      console.log('bookingData', bookingData)
      this.remark = booking.data[0].remark
      this.timeavailable = []
      let dtTime = this.dataFlowSelectAdd.filter(item => {
        return item.value === booking.data[0].flowId
      })
      if (dtTime.length > 0) {
        if (dtTime.map(item => item.allData.setTime) === null) {
          this.timeavailable = []
        } else {
          this.timeavailable = JSON.parse(
            dtTime.map(item => item.allData.setTime)
          )
        }
      }
      // let dtTime = this.branch.filter(item => { return item.value === booking.data[0].masBranchID })
      // console.log('test', dtTime)
      // this.timeavailable = JSON.parse(dtTime.map(item => item.allData.setTime))
      this.dialogBookingAgain = true
    },
    addBookingAgain () {
      this.loadingBookingAgain = true
      this.validate('BOOKAGAIN')
      setTimeout(() => this.addBookingAgainSubmit(), 500)
    },
    addBookingAgainSubmit () {
      if (this.validBookingAgain === true) {
        let rs = this.bookingData
        let Add = []
        for (let i = 0; i < rs.length; i++) {
          let d = rs[i]
          let update = {}
          d.fieldValue = d.fieldValue || ''
          if (d.fieldValue !== '') {
            update.masBranchID = this.booking[0].masBranchID
            update.bookingFieldId = d.bookingFieldId
            update.remark = this.remark
            update.flowId = this.booking[0].flowId
            update.fieldId = d.fieldId
            update.fieldValue = d.fieldValue
            update.shopId = d.shopId
            update.dueDate = this.date + ' ' + this.time.value
            update.timeText = this.time.text
            update.userId = this.userId
            update.pageName = 'BookingList'
            update.sourceLink = 'direct'
            update.fastTrack = this.booking[0].fastTrack || ''
            update.extraJob = this.booking[0].extraJob || ''
            update.depositStatus = this.booking[0].depositStatus || ''
            update.depositImge = this.booking[0].depositImge || ''
            update.empSelect = this.booking[0].empSelect
            update.adminLogin = this.session.data.userName
            Add.push(update)
          }
        }
        console.log('Add', Add)
        this.swalConfig.title = 'ต้องการนำรายการนี้ เข้าตารางใช่หรือไม่?'
        this.$swal(this.swalConfig)
          .then(async result => {
            axios
              .post(this.DNS_IP + '/Booking/add', Add)
              .then(async response => {
                await this.confirmChkAdd(response.data)
                let booking = await axios.get(
                  this.DNS_IP +
                    '/booking_view/get?shopId=' +
                    this.session.data.shopId +
                    '&bookNo=' +
                    response.data.bookNo +
                    this.selectOnsite
                )
                // let bookingData = await axios.get(this.DNS_IP + '/BookingData/get?shopId=' + this.session.data.shopId + '&bookNo=' + response.data.bookNo)
                // let cusName = this.getDataFromFieldName(bookingData.data, 'ชื่อ')
                if (booking.data[0].lineUserId) {
                  this.pushMsgConfirm(response.data.bookNo)
                }
                this.date = ''
                this.time = ''
                this.booking = []
                this.bookingData = []
                if (this.statusSearch === 'no') {
                  await this.getBookingList()
                } else {
                  await this.searchAny()
                }
                // this.getTimesChange('update')
                if (this.getSelectText) {
                  this.getSelect(
                    this.getSelectText,
                    this.getSelectCount,
                    this.filterCloseJobValue
                  )
                }
                this.loadingBookingAgain = false
                this.dialogBookingAgain = false
                this.dialogJob = false
              })
          })
          .catch(error => {
            this.loadingBookingAgain = false
            console.log('Booking add again : ', error)
          })
      } else {
        this.loadingBookingAgain = false
      }
    },
    async setDataChang (item) {
      // clear Limit
      console.log('setDataChang', item)
      this.statusVIPChang = item.statusVIP
      this.limitCountBranch = []
      this.limitCountBranchOld = []
      this.masBranchIDLimit = ''
      this.flowIDLimit = ''
      this.countBookingLimit = 0
      this.selectCountBookingLimit = 1
      this.limitBookingCheck = 'False'
      this.limitBookingSelect = 'False'
      await this.getEmpChange(item)
      this.bookingEmpFlow = item.bookingEmpFlow
      this.checkCustomerTimeSlotChang(item)
      this.SetallowedDatesChange(item.bookingEmpFlow)
      /// /////////////////////
      this.userId = item.userId || ''
      this.limitBookingCheck = item.limitBookingCheck || 'False'
      item.countHourLimit = item.countHourLimit || 0
      this.countBookingLimit = 0
      this.dueDateOld = item.dueDateDay
      this.dueDateTimeOld = item.timeDuetext
      this.masBranchIDLimit = item.masBranchID
      this.flowIDLimit = item.flowId
      this.checkSelectText = item.statusBt
      this.timeavailable = []
      if (this.customerTimeSlot === 'True') {
      } else {
        await this.checkTimeFlow(item.dueDateDay, item)
      }

      this.dataChange = item
      this.remark = item.remark
      this.formChange.date = item.dueDateDay
      console.log('this.timeavailable', this.timeavailable)
      if (this.timeavailable.length > 0) {
        if (
          this.timeavailable.filter(el => {
            return el.text === item.timeText
          }).length > 0
        ) {
          if (item.timeText) {
            this.formChange.time = {
              text: item.timeText,
              value: item.timeDuetext
            }
          } else {
            this.formChange.time = {
              text: item.timeDuetext,
              value: item.timeDuetext
            }
          }
        } else {
          this.formChange.time = ''
        }
      } else {
        this.formChange.time = ''
      }

      this.dialogChange = true
      console.log(this.formChange)
    },
    async openInfo (item) {
      this.detailInfo = await this.getBookingData(item)
      this.dataInfo = item
      this.dialogInfo = true
    }
  }
}
</script>

<style scoped>
.pictureMenuEdit {
  width: 100px;
  height: 100px;

  filter: drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.7));

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
}
.cardMenuEdit {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 20px 10px 20px 10px;
  width: 327px;
  min-height: auto;

  background: #ffffff;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.03),
    0px 4px 20px -2px rgba(50, 50, 71, 0.04);
  border-radius: 16px;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 1;
}
.cardTextMenu {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 15px;

  width: 147px;
  height: 104px;
  /* Inside auto layout */

  flex: none;
  order: 1;
  flex-grow: 1;
}
.textOneBox {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 4px;

  width: 147px;
  height: 64px;
  /* Inside auto layout */

  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}
.sendOrder {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;

  width: 100%;
  height: 112px;

  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
  justify-content: flex-end;
}
.buttomMenuplusminus {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;

  width: 32px;
  height: 32px;
  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
}
.buttomMenu {
  /* display: flex;
  flex-direction: row;
  align-items: flex-end; */
  padding: 0px;
  gap: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 32px;
  height: 100px;
  /* Inside auto layout */

  flex: none;
  order: 2;
  flex-grow: 0;
}
.videoWrapper {
  position: relative;
  padding-bottom: 56.25%;
  /* 16:9 */
  padding-top: 25px;
  height: 0;
}

.videoWrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.border-active {
  border-style: solid;
  border-color: red;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.slidein {
  max-width: 40%;
  padding: 2em 1em;
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  background: #fff;
  height: 100%;
  overflow: scroll;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease-in-out;
}
button {
  padding: 0.5em 1em;
  /* border-radius: 3em; */
  font-size: 1.1em;
}
/* before the element is shown, start off the screen to the right */

/* General styles unrelated to slide in */
body {
  font-family: "Mulish", sans-serif;
}

.toggle {
  margin: 1em;
}
.InputData {
  margin: 0px !important;
  padding: 0px !important;
}
.v-card--link:focus::before {
  opacity: 0;
}
.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  background-color: white !important;
}
.v-list-item__title {
  color: #73777b !important;
  /* font-family: KittithadaBold;
  font-size: 22px !important; */
  font-family: "Kanit", sans-serif;
  font-weight: 400;
}
.bottomAdd {
  background: linear-gradient(3.82deg, #1093ff 0.25%, #66baff 99.75%);
}
.v-data-table__wrapper {
  min-height: 400px !important;
}
.textPriceMenu {
  /* Price/Small */
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;

  color: #ff7b2c;
}
.textTitelPriceMenu {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
}
.textTitelMenu {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
}
.textSubTitelMenu {
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 22px;
}
.pictureMenu {
  width: 40px;
  height: 40px;

  filter: drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.7));

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
}
.cardMenu {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 12px;
  gap: 12px;

  width: 327px;
  height: 70px;

  background: #ffffff;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.03),
    0px 4px 20px -2px rgba(50, 50, 71, 0.04);
  border-radius: 16px;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 1;
}
</style>
