<template>
  <div>
    <v-main transition="scroll-y-reverse-transition">
      <div class="new-background-color col-md-12 ml-sm-auto col-lg-12">
        <v-row class="no-gutters">
          <v-col cols="6" md="6" lg="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
          <v-col style="text-align: end;" v-if="resCol === 'xs'">
            <v-btn :disabled="loadingRefresh" color="warning"
              style="border-radius: 20px !important;margin-right: 0px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
              @click="
                getDataDefault(),
                (searchOther = ''),
                (showColorSearch = false),
                (statusSearch = 'no')
                ">
              <v-icon color="white" left>mdi-refresh-circle</v-icon>
              รีเฟรชข้อมูล
              <template v-if="loadingRefresh">
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-col>
          <v-col cols="6" md="6" lg="6" class="v-margit_button text-right pr-0" style="background-color: #f2f7ff;" v-if="
            resCol === 'md' ||
            resCol === 'lg' ||
            resCol === 'xl' ||
            resCol === 'sm'
          ">
            <v-btn-toggle style="background-color: #f2f7ff;">
              <v-btn :loading="loadingRefresh" :disabled="loadingRefresh" color="warning"
                style="border-radius: 20px !important;margin-right: 0px;box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.4), 0px 5px 15px rgba(162, 171, 198, 0.6);"
                @click="
                  getDataDefault(),
                  (searchOther = ''),
                  (showColorSearch = false),
                  (statusSearch = 'no')
                  ">
                <v-icon color="white" left>mdi-refresh-circle</v-icon>
                รีเฟรชข้อมูล
                <template v-if="loadingRefresh">
                  <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                  </span>
                </template>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row v-if="resCol === 'xs'" style="margin-bottom: 10px;">
          <v-col cols="12" class="text-left">
            <template v-if="changeBackgroundColor">
              <v-row class="test px-2">
                <v-row style="justify-content: space-around;">
                  <v-col cols="6" style="display: flex;justify-content: center;">
                    <v-card style="padding: 10px; width: 230px;" :color="getSelectText === 'wait' ? '#F9DBB2' : 'white'"
                      dense elevation="0" prominent @click="
                        getSelect('wait', countWaiting, filterCloseJobValue)
                        ">
                      <div>
                        <div class="text-center">
                          <v-avatar size="70" class="pa-3" color="#FEAE34">
                            <v-icon dark size="30" class="iconify" data-icon="ps:warning">
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
                  <v-col cols="12" style="display: flex;justify-content: center;">
                    <v-card style="padding: 10px; width: 230px;"
                      :color="getSelectText === 'confirm' ? '#C9F2DC' : 'white'" dense icon="mdi-email-check" prominent
                      elevation="0" @click="
                        getSelect('confirm', countConfirm, filterCloseJobValue)
                        ">
                      <div>
                        <div class="text-center">
                          <v-avatar size="70" color="#97DDBB" style="padding:13px">
                            <v-icon dark size="40" class="iconify" data-icon="quill:mail-subbed">
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
                  <v-col cols="6" style="display: flex;justify-content: center;">
                    <v-card style="padding: 10px; width: 230px;" :color="getSelectText === 'confirmJob' ? '#F9E8F5' : 'white'
                      " dense icon="mdi-account-check" prominent elevation="0" @click="
                        getSelect('confirmJob', countJob, filterCloseJobValue)
                        ">
                      <div>
                        <div class="text-center">
                          <v-avatar color="#E5B5D8" size="70" class="pa-3">
                            <v-icon dark size="40" class="iconify" data-icon="bi:people">
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
                  <v-col cols="6" style="display: flex;justify-content: center;">
                    <v-card style="padding: 10px; width: 230px;" :color="getSelectText === 'confirmSum' ? '#D7E8F9' : 'white'
                      " dense elevation="0" icon="mdi-expand-all" @click="
                        getSelect(
                          'confirmSum',
                          (countConfirm + countJob, filterCloseJobValue)
                        )
                        ">
                      <div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
                        <div class="text-center">
                          <v-avatar color="#76ABE5" size="70" class="pa-3">
                            <v-icon dark size="40" class="iconify" data-icon="bi:folder-plus">
                            </v-icon>
                          </v-avatar>
                        </div>
                        <div style="margin: auto 0;text-align: center;">
                          <strong>รวมผู้เข้ารับบริการ</strong>
                          <div style="text-align: center;">
                            รวม : {{ countConfirm + countJob + countCancel }}
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="6" style="display: flex;justify-content: center;">
                    <v-card style="padding: 10px; width: 230px;"
                      :color="getSelectText === 'cancel' ? '#F9CACA' : 'white'" dense elevation="0"
                      icon="mdi-calendar-remove" prominent @click="
                        getSelect('cancel', countCancel, filterCloseJobValue)
                        ">
                      <div>
                        <div class="text-center">
                          <v-avatar size="70" class="pa-3" color="#B72929">
                            <v-icon dark size="40" class="iconify" data-icon="carbon:rule-cancelled">
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
              <v-row class="test">
                <v-row style="justify-content: space-around;">
                  <v-col :cols="resCol === 'md' ? '2' : 'auto'" style="display: flex;justify-content: center;">
                    <v-card :style="resCol === 'sm'
                        ? 'padding: 10px; width: 130px;'
                        : 'padding: 10px; width: 230px;'
                      " :color="getSelectText === 'confirm' ? '#C9F2DC' : 'white'" dense icon="mdi-email-check"
                      prominent elevation="0" @click="
                        getSelect('confirm', countConfirm, filterCloseJobValue)
                        ">
                      <div :style="resCol === 'lg'
                          ? 'display: flex;justify-content: space-around;flex-wrap: wrap;'
                          : resCol === 'md'
                            ? ''
                            : ''
                        ">
                        <div class="text-center">
                          <v-avatar size="70" color="#97DDBB" style="padding:13px">
                            <v-icon dark size="40" class="iconify" data-icon="quill:mail-subbed">
                              mdi-alarm
                            </v-icon>
                          </v-avatar>
                        </div>
                        <div :style="resCol === 'md'
                            ? 'text-align: center;'
                            : resCol === 'sm'
                              ? 'text-align: center;'
                              : 'margin: auto 0;'
                          ">
                          <strong>{{ dataTypeProcess2 }}</strong>
                          <div>จำนวน : {{ countConfirm }}</div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col :cols="resCol === 'md' ? '2' : 'auto'" style="display: flex;justify-content: center;">
                    <v-card :style="resCol === 'sm'
                        ? 'padding: 10px; width: 130px;'
                        : 'padding: 10px; width: 230px;'
                      " :color="getSelectText === 'confirmJob' ? '#F9E8F5' : 'white'
                        " dense icon="mdi-account-check" prominent elevation="0" @click="
                        getSelect('confirmJob', countJob, filterCloseJobValue)
                        ">
                      <div :style="resCol === 'lg'
                          ? 'display: flex;justify-content: space-around;flex-wrap: wrap;'
                          : resCol === 'md'
                            ? ''
                            : ''
                        ">
                        <div class="text-center">
                          <v-avatar color="#E5B5D8" size="70" class="pa-3">
                            <v-icon dark size="40" class="iconify" data-icon="bi:people">
                              mdi-alarm
                            </v-icon>
                          </v-avatar>
                        </div>
                        <div :style="resCol === 'md'
                            ? 'text-align: center;'
                            : resCol === 'sm'
                              ? 'text-align: center;'
                              : 'margin: auto 0;'
                          ">
                          <strong>{{ dataTypeProcess4 }}</strong>
                          <div :style="resCol === 'md'
                              ? 'text-align: center;'
                              : 'text-align: center;left'
                            ">
                            จำนวน : {{ countJob }}
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col :cols="resCol === 'md' ? '2' : 'auto'" style="display: flex;justify-content: center;">
                    <v-card :style="resCol === 'sm'
                        ? 'padding: 10px; width: 130px;'
                        : 'padding: 10px; width: 230px;'
                      " :color="getSelectText === 'confirmSum' ? '#D7E8F9' : 'white'
                        " dense elevation="0" icon="mdi-expand-all" @click="
                        getSelect(
                          'confirmSum',
                          countConfirm + countJob,
                          filterCloseJobValue
                        )
                        ">
                      <div :style="resCol === 'lg'
                          ? 'display: flex;justify-content: space-around;flex-wrap: wrap;'
                          : resCol === 'md'
                            ? ''
                            : ''
                        ">
                        <div class="text-center">
                          <v-avatar color="#76ABE5" size="70" class="pa-3">
                            <v-icon dark size="40" class="iconify" data-icon="bi:folder-plus">
                            </v-icon>
                          </v-avatar>
                        </div>
                        <div :style="resCol === 'md'
                            ? 'text-align: center;'
                            : resCol === 'sm'
                              ? 'text-align: center;'
                              : 'margin: auto 0;'
                          ">
                          <strong>รวมผู้เข้ารับบริการ</strong>
                          <div :style="resCol === 'md'
                              ? 'text-align: center;'
                              : 'text-align: center;left'
                            ">
                            รวม : {{ countConfirm + countJob + countCancel }}
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col :cols="resCol === 'md' ? '2' : 'auto'" style="display: flex;justify-content: center;">
                    <v-card :style="resCol === 'sm'
                        ? 'padding: 10px; width: 130px;'
                        : 'padding: 10px; width: 230px;'
                      " :color="getSelectText === 'cancel' ? '#F9CACA' : 'white'" dense elevation="0"
                      icon="mdi-calendar-remove" prominent @click="
                        getSelect('cancel', countCancel, filterCloseJobValue)
                        ">
                      <div :style="resCol === 'lg'
                          ? 'display: flex;justify-content: space-around;flex-wrap: wrap;'
                          : resCol === 'md'
                            ? ''
                            : ''
                        ">
                        <div class="text-center">
                          <v-avatar size="70" class="pa-3" color="#B72929">
                            <v-icon dark size="40" class="iconify" data-icon="carbon:rule-cancelled">
                              mdi-alarm
                            </v-icon>
                          </v-avatar>
                        </div>
                        <div :style="resCol === 'md'
                            ? 'text-align: center;'
                            : resCol === 'sm'
                              ? 'text-align: center;'
                              : 'margin: auto 0;'
                          ">
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
        <v-divider v-if="resCol === 'xs'"></v-divider>
        <div class="pa-2 mb-4" v-if="resCol === 'xs'">
          <div>
            <v-menu ref="menu" v-model="menuStart" transition="scale-transition" offset-y max-width="290px"
              min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field hide-details background-color="white" v-model="dateStart"
                  style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
                  label="เดือน/ปี" readonly outlined dense v-bind="attrs" v-on="on">
                  <template #prepend-inner>
                    <v-icon color="#69D1FD"
                      style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                      mdi-calendar
                    </v-icon>
                  </template></v-text-field>
              </template>
              <v-date-picker @input="
                (menuStart = false), (dataReady = false), getBookingList()
                " v-model="dateStart" type="month" no-title scrollable>
              </v-date-picker>
            </v-menu>
            <v-select v-model="masBranchID" background-color="white"
              style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
              hide-details :items="branch" label="สาขา" outlined dense required :disabled="statusBranchReadonly"
              @change="(dataReady = false), (flowSelect = ''), getBookingList()"><template #prepend-inner>
                <v-icon color="#69D1FD"
                  style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                  mdi-map-marker-outline
                </v-icon>
              </template></v-select>
            <v-select
              style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
              v-model="flowSelect" hide-details background-color="white" :items="DataFlowName" label="ประเภทบริการ"
              outlined dense @change="(dataReady = false), getBookingList()">
              <template #prepend-inner>
                <v-icon color="#69D1FD"
                  style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                  mdi-note-text-outline
                </v-icon>
              </template></v-select>
            <v-text-field class="textserch" background-color="white"
              style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
              label="ค้นหาชื่อ และ เบอร์โทรศัพท์ ในตาราง" v-model="searchAll2" outlined hide-details dense><template
                #prepend-inner>
                <v-icon style="margin-top: 0px;">
                  mdi-magnify
                </v-icon>
              </template>
            </v-text-field>
            <v-text-field class="textserch" background-color="white"
              style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;margin-bottom: 10px;"
              :label="$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
                  $session.getAll().data.category === '7'
                  ? 'ค้นหาชื่อทั้งหมด หรือ ทะเบียน'
                  : 'ค้นหาชื่อทั้งหมด'
                " v-model="searchOther" outlined hide-details dense append-icon="mdi-card-search-outline"
              @click:append="searchAny()">
            </v-text-field>
          </div>
        </div>
        <!-- panel -->
        <v-divider v-if="resCol !== 'xs'"></v-divider>
        <div class="pl-5 pb-5 pr-5 pt-0 mb-4" v-if="resCol !== 'xs'">
          <v-row style="display: flex;justify-content: space-between;margin-bottom:15px;margin-top:2px;">
            <v-col cols="auto" class="pl-0">
              <h3 style="margin-bottom: 15px;color: black;font-weight: bolder;">
                ตรวจสอบรายการนัดหมาย
              </h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="resCol === 'sm' ? '3' : '2'" class="pl-0">
              <v-menu ref="menu" v-model="menuStart" transition="scale-transition" offset-y max-width="290px"
                min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field hide-details background-color="white" v-model="dateStart"
                    style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;"
                    label="เดือน/ปี" readonly outlined dense v-bind="attrs" v-on="on">
                    <template #prepend-inner>
                      <v-icon color="#69D1FD"
                        style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                        mdi-calendar
                      </v-icon>
                    </template></v-text-field>
                </template>
                <v-date-picker @input="
                  (menuStart = false), (dataReady = false), getBookingList()
                  " v-model="dateStart" type="month" no-title scrollable>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col :cols="resCol === 'sm' ? '3' : '2'" class="pl-0">
              <v-select v-model="masBranchID" background-color="white"
                style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;" hide-details
                :items="branch" label="สาขา" outlined dense required :disabled="statusBranchReadonly" @change="
                  (dataReady = false), (flowSelect = ''), getBookingList()
                  "><template #prepend-inner>
                  <v-icon color="#69D1FD"
                    style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                    mdi-map-marker-outline
                  </v-icon>
                </template></v-select>
            </v-col>
            <v-col :cols="resCol === 'sm' ? '3' : '2'" class="pl-0">
              <v-select style="box-shadow: 0px 38px 72px 30px rgb(10 4 60 / 6%);border-radius: 40px !important;"
                v-model="flowSelect" hide-details background-color="white" :items="DataFlowName" label="ประเภทบริการ"
                outlined dense @change="(dataReady = false), getBookingList()">
                <template #prepend-inner>
                  <v-icon color="#69D1FD"
                    style="background-color: #E0F4FF;padding: 4px;border-radius: 50px;margin-top: -1px;margin-right: 3px;margin-bottom: 3px;">
                    mdi-note-text-outline
                  </v-icon>
                </template></v-select>
            </v-col>
            <v-col v-if="resCol !== 'sm'" cols="2"></v-col>
            <v-col :cols="resCol === 'sm' ? '3' : '4'" class="pr-0 pl-0 pt-3">
              <v-text-field class="textserch" background-color="white" style="border-radius: 40px !important;"
                label="ค้นหาชื่อ และ เบอร์โทรศัพท์ ในตาราง" v-model="searchAll2" outlined hide-details dense><template
                  #prepend-inner>
                  <v-icon style="margin-top: 0px;">
                    mdi-magnify
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-col :cols="resCol === 'sm' ? '3' : '4'" class="pr-0 pl-0 pt-3">
              <v-text-field class="textserch" background-color="white" style="border-radius: 40px !important;" :label="$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
                  $session.getAll().data.category === '7'
                  ? 'ค้นหาชื่อทั้งหมด หรือ ทะเบียน'
                  : 'ค้นหาชื่อทั้งหมด'
                " v-model="searchOther" outlined hide-details dense prepend-inner-icon="mdi-magnify">
              </v-text-field>
            </v-col>
            <v-col cols="auto" class="pr-0 pl-1 pt-3">
              <v-btn rounded color="primary" dark @click="searchAny()">
                ค้นหา
              </v-btn>
            </v-col>
            <v-col cols="auto" class="pr-0 pl-1 pt-3" v-if="searchOther.length > 1">
              <v-btn rounded color="error" dark @click="
                getDataDefault(),
                (searchOther = ''),
                (showColorSearch = false),
                (statusSearch = 'no')
                ">
                clear
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <!-- panel -->
        <v-row>
          <v-col cols="12">
            <v-card elevation="0" v-if="dataReady">
              <v-card-text>
              </v-card-text>
              <v-card-title>
              </v-card-title>
              <v-card-text>
                <v-data-table :headers="columns" :items="dataItem" v-if="!selectedStatus" :search="searchAll2"
                  :items-per-page="10">
                  <template v-slot:[`item.cusName`]="{ item }">
                    <a @click.stop="openInfo(item)" style="cursor:hand"><u>{{ item.cusName }}</u></a>
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
                        <v-chip filter dark v-if="
                          item.statusBt === 'confirm' ||
                          item.statusBt === 'confirmJob'
                        " :color="item.remarkConfirm1
                              ? 'green darken-2'
                              : 'grey darken-1'
                            " v-model="item.remarkConfirm1" @click.stop="
                            item.remarkConfirm1 = !item.remarkConfirm1;
                          confirmRemark(item, 'inAdvance');
                          ">
                          1 วัน
                        </v-chip>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.action3`]="{ item }">
                    <v-row>
                      <v-col>
                        <v-chip filter dark :color="item.fastTrack ? 'green darken-2' : 'grey darken-1'
                          " v-model="item.fastTrack" @click.stop="
                            item.fastTrack = !item.fastTrack;
                          confirmRemark(item, 'fastTrack');
                          ">
                          {{ dataTypeJob3 }}
                        </v-chip>
                      </v-col>
                      <v-col>
                        <v-chip filter dark :color="item.extraJob ? 'green darken-2' : 'grey darken-1'
                          " v-model="item.extraJob" @click.stop="
                            item.extraJob = !item.extraJob;
                          confirmRemark(item, 'extraJob');
                          ">
                          {{ dataTypeJob2 }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <!-- confirm -->
                    <v-btn color="success" fab id="v-step-2" v-if="item.statusBt !== 'confirmJob'"
                      :disabled="item.chkConfirm" small @click.stop="confirmChk(item)">
                      <v-icon dark> mdi-phone-check </v-icon>
                    </v-btn>
                    <v-btn color="error" fab id="v-step-2" v-if="item.statusBt !== 'confirmJob'" small
                      :disabled="item.chkCancel" @click.stop="setDataRemove(item)" title="ยกเลิกนัด">
                      <v-icon dark> mdi-phone-cancel </v-icon>
                    </v-btn>
                    <v-tooltip bottom v-if="item.statusBt !== 'confirmJob'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-badge avatar bordered overlap :content="item.countChangeTime" color="warning" class="mr-1"
                          style="cursor: pointer">
                          <v-btn color="warning" fab small @click.stop="setDataChang(item)" v-bind="attrs" v-on="on">
                            <v-icon> mdi-calendar-clock </v-icon>
                          </v-btn>
                        </v-badge>
                      </template>
                      <span>เปลี่ยนเวลานัดหมาย</span>
                    </v-tooltip>

                  </template>
                </v-data-table>
                <v-data-table :headers="columnsSelected" :items="filteredSelect" v-if="selectedStatus"
                  :search="searchAll2" min-height="400px" :items-per-page="30" :item-class="getRowClass">
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
                      <div>{{ item.dueDate.split(" ")[1] }} น.</div>
                    </div>
                  </template>
                  <template v-slot:[`item.cusName`]="{ item }">
                    <v-row>
                      <v-col cols="12">
                        <v-row>
                          <v-col col="auto" class="text-ceter" v-if="
                            item.userId === 'user-skip' ||
                            item.userId === '' ||
                            item.userId === null
                          ">
                            {{ item.cusName }}
                          </v-col>
                          <template v-else>
                            <v-col col="auto" class="text-ceter">
                              <a @click.stop="openHistory(item)" style="cursor:hand"><u>{{ item.cusName }}</u></a>
                            </v-col>
                          </template>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.remark`]="{ item }">
                    <a v-if="item.remark !== ''" style="cursor:hand">
                      <u style="margin-right: 10px">{{
                        item.remark.slice(0, 48)
                        }}</u>
                    </a>
                    <div v-if="item.remark.length >= 50">
                      <v-menu nudge-left="80" rounded="xl" top open-on-hover :close-on-content-click="false">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn rounded outlined x-small v-bind="attrs" v-on="on"
                            style="color: #1363DF;font-weight: bold;">
                            อ่านเพิ่มเติม<v-icon color="#1363DF"
                              style="font-size: 20px;margin-left: 5px;text-decoration: none;">mdi-arrow-right</v-icon>
                          </v-btn>
                        </template>
                        <v-card max-width="300">
                          <v-list>
                            <v-list-item width="200px">
                              <v-list-item-content width="200px">
                                {{ item.remark }}</v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-menu>
                    </div>
                  </template>
                  <template v-slot:[`item.checkStatus`]="{ item }">
                    <div class="text-center">
                      <div class="status-cloumn" style="background-color:#4CAF50;" v-if="item.checkStatus === 'จบงาน'">
                        <span>{{ item.checkStatus }}</span>
                      </div>
                      <div class="status-cloumn" style="background-color:#3F51B5;"
                        v-else-if="item.checkStatus === 'รอมอบหมายงาน'">
                        {{ item.checkStatus }}
                      </div>
                      <div class="status-cloumn" style="background-color:#FF9800;"
                        v-else-if="item.checkStatus === 'รอเริ่มงาน'">
                        {{ item.checkStatus }}
                      </div>
                      <div class="status-cloumn" style="background-color:#0097A7;"
                        v-else-if="item.checkStatus === 'กำลังดำเนินงาน'">
                        {{ item.checkStatus }}
                      </div>
                      <div class="status-cloumn" style="background-color:#F44336;"
                        v-else-if="item.checkStatus === 'ยกเลิกงาน'">
                        {{ item.checkStatus }}
                      </div>
                    </div>
                  </template>
                  <template v-slot:[`item.actionPrint`]="{ item }">
                    <!-- <p v-if ="item.actionPrint === 'จบงาน'">{{item.jobId}} - {{ item.signatureURL }}</p> -->
                    <div class="text-center">
                      <!-- v-if ="item.actionPrint === 'จบงาน'" --><!-- :JobId="item.jobId" -->
                      <PdfAirMate v-if="item.actionPrint === 'จบงาน'" :Item="item"></PdfAirMate>
                    </div>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
// import { PivotTable } from '@click2buy/vue-pivot-table'
import moment from 'moment-timezone'
import 'moment/locale/th'
import BookingQueue from './BookingQueue.vue'
// import CalendarBooking from './CalendarBookingList.vue'
import CalendarBooking from './CalendarBookingList.vue' // test
import waitingAlert from '../waitingAlert.vue'
import CallLog from '../BookingListComponents/CallLog.vue'
import NotificationService from '../BookingListComponents/NotificationService.vue'
import PrintQrCodeConfirmJobLINE from '../BookingListComponents/PrintQrCodeConfirmJobLINE.vue'
import sideMenu from '../Menu/sideMenu.vue'
import GoogleCalendarCmp from '../Core/GoogleCalendarCmp.vue'
import PdfAirMate from '../PdfForm/PdfAirMate.vue'

// import copy from 'copy-to-clipboard'

export default {
  name: 'BookingListBeauty',
  components: {
    sideMenu,
    draggable,
    'left-menu-admin': adminLeftMenu,
    DateRangePicker,
    downloadExcel: JsonExcel,
    XLSX,
    readXlsxFile,
    VuetifyMoney,
    // PivotTable,
    BookingQueue,
    CalendarBooking,
    waitingAlert,
    CallLog,
    NotificationService,
    PrintQrCodeConfirmJobLINE,
    GoogleCalendarCmp,
    PdfAirMate
  },
  computed: {
    filteredSelect () {
      // console.log('tset')
      return this.dataItemSelect.filter(d => {
        return (
          this.filters.length < 1 ||
          d['dueDate']
            .toString()
            .toLowerCase()
            .includes(this.filters.toLowerCase())
        )
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
  },
  data () {
    let startDate = null
    let endDate = null
    return {
      unsubscribe: null,
      // menu
      bookNoNoti: '',
      showMenu: 'False',
      dataMenuAdd: [],
      expansionMenuAdd: [0],
      drawerAdd: false,
      priceMenuAdd: 0,
      languageSelect: 0,
      // ******
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
      formResults: [],
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

      customerNameJob: '',
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
      eventInfo: [],
      checkEventInfo: [],
      dueDateText: '',
      sortNo: '',
      dataCalendar: [],
      dataSummary: [],
      today: '',
      events: [],

      srcUpload: '',
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
      // Data Table Config
      searchAll2: '',
      columns: [
        { text: 'หมายเลข', value: 'receiptNo' },
        { text: 'ลูกค้า', value: 'cusName' },
        { text: 'บริการ', value: 'flowName' },
        { text: 'รายการ', value: 'flowList' },
        { text: 'วันที่จองงาน', value: 'dateApp' },
        { text: 'ที่อยู่', value: 'address' },
        { text: 'ผู้ให้บริการ', value: 'empName' },
        {
          text: 'สถานะ',
          value: 'actionStatus',
          sortable: true,
          align: 'center'
        },
        { text: 'สังกัด', value: 'member' },
        { text: 'วันที่สร้าง', value: 'CREATE_DATE' }
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
      // Dialog Config ADD EDIT DELETE IMPORT
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
      showImgItem: [],
      showImg: '',
      dataCloseJob: [],
      dataCloseJobData: [],
      sendRemarkRemove: false
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
      // your code goes here
      this.closeSetTimeGetCalenda()
    })
    // await this.beforeCreate()
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
  methods: {
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
          console.log('rssssssssssss', rs)
          if (rs.length > 0) {
            this.shop = rs
            this.statusGoogleCalendar = rs[0].statusGoogleCalendar
            this.statusGoogleCalendarEmp = rs[0].statusGoogleCalendarEmp
          }
        })
    },
    checkTypeSort () {
      console.log('this.sortSelect => ' + this.sortSelect)
      console.log('this.sort => ' + this.sort)
      console.log('this.dataItemSelect', this.dataItemSelect)
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
      // console.log('this.dataItemSelect', this.dataItemSelect)
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
    },
    async updateShowOnsite (text) {
      await axios
        .post(
          this.DNS_IP +
          '/system_user/edit/' +
          this.$session.getAll().data.userId,
          { showOnsite: text }
        )
        .then(async response => { })
    },
    async checkShowDataOnsiteSet (text) {
      if (text === 'ไม่แสดง') {
        // this.showOnsite = 'แสดง'
        // this.selectOnsite = '&checkOnsite=is null'
        await this.updateShowOnsite('ไม่แสดง')
        this.checkShowDataOnsite()
      } else {
        // this.showOnsite = 'ไม่แสดง'
        // this.selectOnsite = '&checkOnsite=True'
        await this.updateShowOnsite('แสดง')
        this.checkShowDataOnsite()
      }
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
          // console.log(dt, objectDT[dt])
          if (objectDT[dt][0].limitBookingCheck === 'True') {
            // console.log('limitBookingCheck === True')
            objectDT[dt].forEach((v, k) => {
              // let statusOffDate2 = false
              // let statusOffDate3 = false
              if (JSON.parse(v.setTime)) {
                if (setTimebyday === 'True') {
                  // console.log('sdfsdfsdfds', JSON.parse(v.setTime).filter((items) => items.value === new Date(v.bookingDate).getDay())[0].setTime)
                  JSON.parse(v.setTime)
                    .filter(
                      items => items.value === new Date(v.bookingDate).getDay()
                    )[0]
                    .setTime.forEach((v2, k2) => {
                      // console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
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
                            // console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
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
                          // console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
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
            console.log('---------!!!!1--------', dt, '----', statusOffDate1)
            if (statusOffDate1 === false) {
              console.log('---------OFF--------', objectDT[dt])
              this.dateDaylimit.push(
                moment(objectDT[dt][0].bookingDate).format('YYYY-MM-DD')
              )
            }
          } else {
            // console.log('limitBookingCheck === False')
            this.dateDaylimit = []
          }
          // if (statusOffDate1 === false) {
          //   this.dateDaylimit.push(
          //     moment(objectDT[dt][0].bookingDate).format('YYYY-MM-DD')
          //   )
          // }
          console.log('this.dateDaylimit', this.dateDaylimit)
          // this.dateDaylimit = result.data.map((item) => { return this.momenDate_1(item.bookingDate) })
        }
      } else {
        console.log('getMonth ELSE')
        this.dateDaylimit = []
      }
    },
    async getMonthChang (month) {
      console.log('month', month)
      console.log('flowId', this.flowIDLimit)
      console.log('this.DataFlowNameDefault', this.DataFlowNameDefault)
      // console.log('!!!!!!!!!', this.DataFlowNameDefault.filter(el => { return el.value === parseInt(this.formAdd.flowId) })[0].allData.setTimebyday)
      // const result = await axios.get(this.DNS_IP + '/LimitBookingDate/get_LimitDate?shopId=' + this.$session.getAll().data.shopId + '&masBranchID=' + this.formAdd.masBranchID + '&bookingDate=' + month)
      const result = await axios.get(
        this.DNS_IP +
        '/LimitBookingDate/get_LimitDate?shopId=' +
        this.$session.getAll().data.shopId +
        '&flowId=' +
        this.flowIDLimit +
        '&bookingDate=' +
        month
      )
      if (result.data.length > 0) {
        let setTimebyday = this.DataFlowNameDefault.filter(el => {
          return el.value === parseInt(this.flowIDLimit)
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
          // console.log(dt, objectDT[dt])
          if (objectDT[dt][0].limitBookingCheck === 'True') {
            // console.log('limitBookingCheck === True')
            objectDT[dt].forEach((v, k) => {
              // let statusOffDate2 = false
              // let statusOffDate3 = false
              if (JSON.parse(v.setTime)) {
                if (setTimebyday === 'True') {
                  // console.log('sdfsdfsdfds', JSON.parse(v.setTime).filter((items) => items.value === new Date(v.bookingDate).getDay())[0].setTime)
                  JSON.parse(v.setTime)
                    .filter(
                      items => items.value === new Date(v.bookingDate).getDay()
                    )[0]
                    .setTime.forEach((v2, k2) => {
                      // console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
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
                            // console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
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
                          // console.log(v.bookingDate, '----', 'v', v.bookingTime, ' ', v.countBooking, '    ', 'v2', v2.value, ' ', v2.limitBooking)
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
            console.log('---------!!!!1--------', dt, '----', statusOffDate1)
            if (statusOffDate1 === false) {
              console.log('---------OFF--------', objectDT[dt])
              this.dateDaylimit.push(
                moment(objectDT[dt][0].bookingDate).format('YYYY-MM-DD')
              )
            }
          } else {
            // console.log('limitBookingCheck === False')
            this.dateDaylimit = []
          }
          // if (statusOffDate1 === false) {
          //   this.dateDaylimit.push(
          //     moment(objectDT[dt][0].bookingDate).format('YYYY-MM-DD')
          //   )
          // }
          console.log('this.dateDaylimit', this.dateDaylimit)
          // this.dateDaylimit = result.data.map((item) => { return this.momenDate_1(item.bookingDate) })
        }
      } else {
        console.log('getMonth ELSE')
        this.dateDaylimit = []
      }
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
    async getTagData () {
      this.tagItem = await this.getDataFromAPI(
        '/Mas_Tag/get',
        'tagId',
        'tagName',
        ''
      )
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
        // let categoryUser = ''
        // if (
        //   this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
        //   this.$session.getAll().data.category === '7'
        // ) {
        //   categoryUser = 'ธุรกิจรถยนต์'
        // } else {
        //   categoryUser = this.$session.getAll().data.category
        // }
        // await this.getBookingDataList('no', this.searchOther)
        console.log('this.searchOther =>', this.searchOther)
        await axios
          .get(
            // eslint-disable-next-line quotes
            this.DNS_IP +
            '/formpdf/getview?shopId=' +
            this.session.data.shopId +
            '&masBranchID=' +
            this.masBranchID +
            '&bookingDataCustomerName=' +
            this.searchOther
          )
          .then(async response => {
            console.log('getData', response.data.data.length)
            // console.log('dataItems', dataItems)
            if (response.data.data.length > 0) {
              for (let i = 0; i < response.data.data.length; i++) {
                let d = response.data.data[i]
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
                  if (d.CustomField === '') {
                    s.CustomFieldName = ''
                    s.CustomFieldTel = ''
                  } else {
                    s.allNameandTel = {}
                    d.CustomField.split(',').forEach(item => {
                      const [key, value] = item.split(':')
                      s.allNameandTel[key.trim()] = value.trim()
                    })
                    s.CustomFieldName = s.allNameandTel['ชื่อ']
                    s.CustomFieldTel = s.allNameandTel['เบอร์โทร']
                  }
                  s.empFirstNameTH_admin = d.empFirstNameTH_admin || ''
                  s.empFirstNameTH_mechanic = d.empFirstNameTH_mechanic || ''
                  s.receiptNo = d.receiptNo
                  s.LAST_DATE = this.convertDate(d.dueDate)
                  s.checkStatus = this.checkStatus(d.stepTitle, d.status, d.jobNo)
                  s.actionPrint = s.checkStatus
                  console.log('checkStatus', s.checkStatus)
                  s.afterAir = d.afterAir
                  s.beforeAir = d.beforeAir
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
                  s.CREATE_DATE = this.convertDate(d.CREATE_DATE)
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
                  if (d.status === 'use' && d.status === 'confirm') {
                    s.chkConfirm = true
                    s.chkCancel = false
                  }
                  if (d.status === 'use' && d.status === 'cancel') {
                    s.chkConfirm = false
                    s.chkCancel = true
                  }
                  s.statusBt = d.status || 'wait'
                  switch (d.status) {
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
                    // s.memberDataTagName = s.memberDataTagName.join(', ')
                  } catch (error) {
                    console.log(error)
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
    checkTimeFlow (dt) {
      this.timeavailable = []
      // let dtTime = this.branch.filter(item => { return item.value === this.masBranchID })
      let dtTime = this.DataFlowNameDefault.filter(item => {
        return item.value === dt.flowId
      })
      // console.log('dtTime', dtTime)
      if (dtTime.length > 0) {
        console.log(
          'dtTime',
          dtTime.filter(item => item.allData.setTime)
        )
        if (dtTime.filter(item => item.allData.setTime).length > 0) {
          if (dtTime.filter(item => item.allData.setTime)[0] === null) {
            this.timeavailable = []
            // this.$swal('แจ้งเตือน', 'เนื่องจากยังไม่ได้ตั้งค่าเวลา', 'info')
          } else {
            this.timeavailable = JSON.parse(
              dtTime.map(item => item.allData.setTime)
            )
          }
        } else {
          this.timeavailable = []
        }
      } else {
        this.timeavailable = []
      }
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
              // console.log('this.DataFlowName', this.DataFlowName)
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
              s.menuShowStatus = d.menuShowStatus
              s.masBranchID = d.masBranchID
              s.allData = d
              result.push(s)
              resultOption.push(s)
              // console.log('this.DataFlowName', this.DataFlowName)
            }
          } else {
            result = []
            resultOption = []
          }
        })
      this.DataFlowNameDefault = result
      // this.DataFlowName = result
      console.log('getDataFlow', result)
      // console.log('masBranchID', this.masBranchID)
      // if (this.masBranchID !== '') {
      //   this.DataFlowName = result.filter(el => { return el.masBranchID === this.masBranchID })
      // } else {
      //   this.DataFlowName = result
      // }
      this.DataFlowNameMenu = result.filter(el => {
        return el.menuShowStatus === 'True'
      })
      this.dataFlowSelectAdd = resultOption
      this.dataFlowSelectEdit = resultOption
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
      // console.log('TEST', this.branch)
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
    getSelect (text, count, filterCloseJobValue) {
      this.selectedStatus = true
      this.getSelectText = text
      this.getSelectCount = count || 0
      this.dataItemSelect = []
      this.columnsSelected = []
      console.log('text', text)
      console.log('filterCloseJobValue', filterCloseJobValue)
      if (text === 'all') {
        if (this.dataItem.length > 0) {
          this.checkSelectText = this.dataItem[0].statusBt
          console.log('this.checkSelectText => ', this.checkSelectText)
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
        console.log('dataItemSelect', this.dataItemSelect)
        this.columnsSelected = [
          { text: 'หมายเลข', value: 'receiptNo' },
          { text: 'บริการ', value: 'flowName' },
          { text: 'ชื่อ', value: 'cusName' },
          { text: 'เบอร์โทร', value: 'cusName' },
          { text: 'วันที่จองงาน', value: 'dateApp' },
          { text: 'วันที่จองงาน', value: 'dateApp' },
          { text: 'ที่อยู่', value: 'address' },
          { text: 'รายการ', value: 'flowList' },
          { text: 'ผู้ให้บริการ', value: 'empName' },
          {
            text: 'สถานะ',
            value: 'actionStatus',
            sortable: true,
            align: 'center'
          },
          { text: 'สังกัด', value: 'member' },
          { text: 'วันที่สร้าง', value: 'CREATE_DATE' }
        ]
      } else {
        var dataSelect = []
        // console.log('dataSelect => ', dataSelect)
        if (text === 'confirmSum') {
          dataSelect = this.dataItem.filter(el => {
            // console.log('el1 = ', el)
            return el.statusBt === 'confirm' || el.statusBt === 'confirmJob' || el.statusBt === 'cancel'
          })
          console.log(dataSelect)
          this.countJob = this.dataItem.filter(el => {
            // console.log('el2 = ', el)
            return el.statusBt === 'confirmJob'
          }).length
          this.filterCloseJobValue = 'ทั้งหมด'
        } else {
          if (text === 'confirmJob') {
            if (filterCloseJobValue) {
              if (filterCloseJobValue === 'ยังไม่ปิดงาน') {
                dataSelect = this.dataItem.filter(el => {
                  // console.log('el3 = ', el)
                  return el.statusBt === text && el.RECORD_STATUS_Job === 'N'
                })
                this.countJob = dataSelect.length
              } else if (filterCloseJobValue === 'ปิดงาน') {
                dataSelect = this.dataItem.filter(el => {
                  // console.log('el4 = ', el)
                  return el.statusBt === text && el.RECORD_STATUS_Job === 'D'
                })
                this.countJob = dataSelect.length
              } else {
                dataSelect = this.dataItem.filter(el => {
                  // console.log('el5 = ', el)
                  return el.statusBt === text
                })
                this.countJob = dataSelect.length
              }
            } else {
              dataSelect = this.dataItem.filter(el => {
                // console.log('el6 = ', el)
                return el.statusBt === text
              })
              this.countJob = dataSelect.length
            }
          } else {
            dataSelect = this.dataItem.filter(el => {
              // console.log('el7 = ', el)
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
          // ยกเลิก Airmate
          this.columnsSelected = [
            { text: 'หมายเลข', value: 'receiptNo' },
            { text: 'บริการ', value: 'flowName' },
            { text: 'ชื่อ', value: 'CustomFieldName' },
            { text: 'เบอร์', value: 'CustomFieldTel' },
            { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
            { text: 'วันที่จอง', value: 'LAST_DATE' },
            { text: 'ที่อยู่', value: 'address' },
            { text: 'อุณหภูมิก่อนล้าง', value: 'afterAir' },
            { text: 'อุณหภูมิหลังล้าง', value: 'beforeAir' },
            { text: 'ช่าง', value: 'empFirstNameTH_mechanic' },
            { text: 'แอดมิน', value: 'empFirstNameTH_admin' },
            { text: 'หมายเหตุ', value: 'remark' },
            {
              text: 'สถานะ',
              value: 'checkStatus',
              sortable: true,
              align: 'center'
            },
            // { text: 'สังกัด', value: 'memberName' },
            // { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
            {
              text: 'ปริ้น PDF',
              value: 'actionPrint',
              sortable: false,
              align: 'center'
            }
          ]
        } else if (text === 'confirm') {
          // ยืนยันแล้ว Airmate
          this.columnsSelected = [
            { text: 'หมายเลข', value: 'receiptNo' },
            { text: 'บริการ', value: 'flowName' },
            { text: 'ชื่อ', value: 'CustomFieldName' },
            { text: 'เบอร์', value: 'CustomFieldTel' },
            { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
            { text: 'วันที่จอง', value: 'LAST_DATE' },
            { text: 'ที่อยู่', value: 'address' },
            { text: 'อุณหภูมิก่อนล้าง', value: 'afterAir' },
            { text: 'อุณหภูมิหลังล้าง', value: 'beforeAir' },
            { text: 'ช่าง', value: 'empFirstNameTH_mechanic' },
            { text: 'แอดมิน', value: 'empFirstNameTH_admin' },
            { text: 'หมายเหตุ', value: 'remark' },
            {
              text: 'สถานะ',
              value: 'checkStatus',
              sortable: true,
              align: 'center'
            },
            // { text: 'สังกัด', value: 'memberName' },
            // { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
            {
              text: 'ปริ้น PDF',
              value: 'actionPrint',
              sortable: false,
              align: 'center'
            }
          ]
        } else if (text === 'wait') {
          if (
            this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
            this.$session.getAll().data.category === '7'
          ) {
            this.columnsSelected = [
              { text: 'หมายเลข', value: this.formResults[0].receiptNo },
              { text: 'ลูกค้า', value: 'cusName' },
              { text: 'บริการ', value: 'flowName' },
              { text: 'รายการ', value: 'flowList' },
              { text: 'วันที่จองงาน', value: 'dateApp' },
              { text: 'ที่อยู่', value: 'address' },
              { text: 'ผู้ให้บริการ', value: 'empName' },
              {
                text: 'สถานะ',
                value: 'actionStatus',
                sortable: true,
                align: 'center'
              },
              { text: 'สังกัด', value: 'member' },
              { text: 'วันที่สร้าง', value: 'CREATE_DATE' }
            ]
          } else {
            // รอยืนยัน Airmate
            this.columnsSelected = [
              { text: 'หมายเลข', value: 'receiptNo' },
              { text: 'บริการ', value: 'flowName' },
              { text: 'ชื่อ', value: 'CustomFieldName' },
              { text: 'เบอร์', value: 'CustomFieldTel' },
              { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
              { text: 'วันที่จอง', value: 'LAST_DATE' },
              { text: 'ที่อยู่', value: 'address' },
              { text: 'อุณหภูมิก่อนล้าง', value: 'afterAir' },
              { text: 'อุณหภูมิหลังล้าง', value: 'beforeAir' },
              { text: 'ช่าง', value: 'empFirstNameTH_mechanic' },
              { text: 'แอดมิน', value: 'empFirstNameTH_admin' },
              { text: 'หมายเหตุ', value: 'remark' },
              {
                text: 'สถานะ',
                value: 'checkStatus',
                sortable: true,
                align: 'center'
              },
              // { text: 'สังกัด', value: 'memberName' },
              // { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
              {
                text: 'ปริ้น PDF',
                value: 'actionPrint',
                sortable: false,
                align: 'center'
              }
            ]
          }
          console.log('||||||||', this.dataItemSelect)
        } else if (text === 'confirmJob') {
          if (
            this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
            this.$session.getAll().data.category === '7'
          ) {
            this.columnsSelected = [
              { text: 'หมายเลข', value: this.formResults[0].receiptNo },
              { text: 'ลูกค้า', value: 'cusName' },
              { text: 'บริการ', value: 'flowName' },
              { text: 'รายการ', value: 'flowList' },
              { text: 'วันที่จองงาน', value: 'dateApp' },
              { text: 'ที่อยู่', value: 'address' },
              { text: 'ผู้ให้บริการ', value: 'empName' },
              {
                text: 'สถานะ',
                value: 'actionStatus',
                sortable: true,
                align: 'center'
              },
              { text: 'สังกัด', value: 'member' },
              { text: 'วันที่สร้าง', value: 'CREATE_DATE' }
            ]
          } else {
            // เข้าใช้บริการแล้ว Airmate
            this.columnsSelected = [
              { text: 'หมายเลข', value: 'receiptNo' },
              { text: 'บริการ', value: 'flowName' },
              { text: 'ชื่อ', value: 'CustomFieldName' },
              { text: 'เบอร์', value: 'CustomFieldTel' },
              { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
              { text: 'วันที่จอง', value: 'LAST_DATE' },
              { text: 'ที่อยู่', value: 'address' },
              { text: 'อุณหภูมิก่อนล้าง', value: 'afterAir' },
              { text: 'อุณหภูมิหลังล้าง', value: 'beforeAir' },
              { text: 'ช่าง', value: 'empFirstNameTH_mechanic' },
              { text: 'แอดมิน', value: 'empFirstNameTH_admin' },
              { text: 'หมายเหตุ', value: 'remark' },
              {
                text: 'สถานะ',
                value: 'checkStatus',
                sortable: true,
                align: 'center'
              },
              // { text: 'สังกัด', value: 'memberName' },
              // { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
              {
                text: 'ปริ้น PDF',
                value: 'actionPrint',
                sortable: false,
                align: 'center'
              }
            ]
          }
          console.log('asdsadasdasd')
        } else {
          if (
            this.$session.getAll().data.category === 'ธุรกิจรถยนต์' ||
            this.$session.getAll().data.category === '7'
          ) {
            this.columnsSelected = [
              { text: 'หมายเลข', value: this.formResults[0].receiptNo },
              { text: 'ลูกค้า', value: 'cusName' },
              { text: 'บริการ', value: 'flowName' },
              { text: 'รายการ', value: 'flowList' },
              { text: 'วันที่จองงาน', value: 'dateApp' },
              { text: 'ที่อยู่', value: 'address' },
              { text: 'ผู้ให้บริการ', value: 'empName' },
              {
                text: 'สถานะ',
                value: 'actionStatus',
                sortable: true,
                align: 'center'
              },
              { text: 'สังกัด', value: 'member' },
              { text: 'วันที่สร้าง', value: 'CREATE_DATE' }
            ]
          } else {
            // รวมผู้เข้ารับบริการ Airmate
            this.columnsSelected = [
              { text: 'หมายเลข', value: 'receiptNo' },
              { text: 'บริการ', value: 'flowName' },
              { text: 'ชื่อ', value: 'CustomFieldName' },
              { text: 'เบอร์', value: 'CustomFieldTel' },
              { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
              { text: 'วันที่จอง', value: 'LAST_DATE' },
              { text: 'ที่อยู่', value: 'address' },
              { text: 'อุณหภูมิก่อนล้าง', value: 'afterAir' },
              { text: 'อุณหภูมิหลังล้าง', value: 'beforeAir' },
              { text: 'ช่าง', value: 'empFirstNameTH_mechanic' },
              { text: 'แอดมิน', value: 'empFirstNameTH_admin' },
              { text: 'หมายเหตุ', value: 'remark' },
              {
                text: 'สถานะ',
                value: 'checkStatus',
                sortable: true,
                align: 'center'
              },
              // { text: 'สังกัด', value: 'memberName' },
              // { text: 'วันที่สร้าง', value: 'CREATE_DATE' },
              {
                text: 'ปริ้น PDF',
                value: 'actionPrint',
                sortable: false,
                align: 'center'
              }
            ]
          }
        }
      }
      this.checkTypeSort()
    },
    convertDate (dateStr) {
      try {
        moment.locale('th') // Set locale to Thai

        const dateObj = moment.tz(dateStr, 'UTC')

        if (!dateObj.isValid()) {
          throw new Error('Invalid date format')
        }

        const yearTh = dateObj.year() + 543
        const formattedDate = dateObj.format(`[${dateObj.format('dddd')}ที่] D MMMM ${yearTh} [เวลา] HH:mm [น.]`)

        return formattedDate
      } catch (error) {
        console.log('error =>', error)
        return ''
      }
    },
    checkStatus (stepTitle, status, jobNo) {
      try {
        let dataReturn = ''
        if (jobNo !== null && jobNo !== '') {
          if (status === 'cancel') {
            dataReturn = 'ยกเลิกงาน'
          } else {
            dataReturn = 'จบงาน'
          }
        } else {
          if (status === 'cancel') {
            dataReturn = 'ยกเลิกงาน'
          } else {
            if (stepTitle === null) {
              dataReturn = 'รอมอบหมายงาน'
            } else if (stepTitle === 'รอ') {
              dataReturn = 'รอเริ่มงาน'
            } else {
              dataReturn = 'กำลังดำเนินงาน'
            }
          }
        }
        console.log(' dataReturn ', dataReturn, ' stepTitle : ', stepTitle, ' status : ', status, ' jobNo : ', jobNo)
        return dataReturn
      } catch (error) {
        console.error('An error occurred:', error)
        return 'ข้อผิดพลาดในการตรวจสอบสถานะ'
      }
    },
    async getBookingList () {
      await this.getTagData()
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
      console.log('masBranchID', this.masBranchID)
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
          '/formpdf/getview?shopId=' +
          this.session.data.shopId +
          '&masBranchID=' +
          this.masBranchID +
          '&dueDate=' +
          this.dateStart
      } else {
        urlApi =
          this.DNS_IP +
          '/formpdf/getview?shopId=' +
          this.session.data.shopId +
          '&masBranchID=' +
          this.masBranchID +
          '&flowId=' +
          this.flowSelect
      }
      await axios
        .get(urlApi)
        .then(async response => {
          console.log('getData', response.data.data.length)
          console.log('getData => ', response.data.data)
          if (response.data.data.length > 0) {
            let a = 0
            for (let i = 0; i < response.data.data.length; i++) {
              let d = response.data.data[i]
              if (a !== d.bookNo) {
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
                s.dueDate = this.convertDate(d.dueDate)
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
                if (d.CustomField === '') {
                  s.CustomFieldName = ''
                  s.CustomFieldTel = ''
                } else {
                  s.allNameandTel = {}
                  d.CustomField.split(',').forEach(item => {
                    const [key, value] = item.split(':')
                    s.allNameandTel[key.trim()] = value.trim()
                  })
                  s.CustomFieldName = s.allNameandTel['ชื่อ']
                  s.CustomFieldTel = s.allNameandTel['เบอร์โทร']
                }
                s.empFirstNameTH_admin = d.empFirstNameTH_admin || ''
                s.empFirstNameTH_mechanic = d.empFirstNameTH_mechanic || ''
                s.shopId = d.shopId
                s.receiptNo = d.receiptNo
                s.LAST_DATE = this.convertDate(d.dueDate)
                s.DATE_LAST = this.convertDate(d.LAST_DATE)
                s.afterAir = d.afterAir
                s.beforeAir = d.beforeAir
                s.stepTitle = d.stepTitle
                s.dueDateDay = d.dueDateDay
                s.jobRemark = d.jobRemark
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
                s.CREATE_DATE = this.convertDate(d.CREATE_DATE)
                s.menuShowStatus = d.menuShowStatus
                s.dueDateTextDay = d.dueDateTextDay
                s.remark = d.remark || ''
                s.masBranchID = d.masBranchID
                s.jobId = d.jobId
                s.signatureURL = d.signatureURL
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
                s.checkStatus = this.checkStatus(d.stepTitle, d.status, d.jobNo)
                s.actionPrint = s.checkStatus
                console.log('checkStatus', s.checkStatus)
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
                this.countAll = this.countAll + 1
                if (d.status === 'use' && d.status === 'confirm') {
                  s.chkConfirm = true
                  s.chkCancel = false
                }
                if (d.status === 'use' && d.status === 'cancel') {
                  s.chkConfirm = false
                  s.chkCancel = true
                }
                s.statusBt = d.status || 'wait'
                switch (d.status) {
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
                if (s.statusBt !== 'wait') {
                  dataItems.push(s)
                }
              // console.log('sssssss', s)
              // } else {
              //   console.log('BookingNo no bookingData', d.bookNo)
              // }
              }
              a = d.bookNo
            }
            console.log('dataItemsnn', dataItems)
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
          '/formpdf/getview?shopId=' +
          this.session.data.shopId +
          '&masBranchID=' +
          this.masBranchID +
          '&statusBt=null' +
          this.selectOnsite
      } else {
        urlApiwait =
          this.DNS_IP +
          '/formpdf/getview?shopId=' +
          this.session.data.shopId +
          '&masBranchID=' +
          this.masBranchID +
          '&statusBt=null&flowId=' +
          this.flowSelect +
          this.selectOnsite
      }
      // console.log('abcccccccc')
      // console.log('urlApiwait', urlApiwait)
      await axios.get(urlApiwait).then(async responses => {
        if (responses.data.length > 0) {
          // console.log('length', responses.data.length)
          for (let i = 0; i < responses.data.length; i++) {
            let d = responses.data[i]
            console.log('d:abcccc =>', d)
            let s = {}
            // if (this.BookingDataList[d.bookNo] !== undefined) {
            // console.log('branch no flow', d.masBranchID, d.flowId)
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
            // s.cusName = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'ชื่อ')
            // s.cusReg = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เลขทะเบียน')
            // s.tel = this.getDataFromFieldName(this.BookingDataList[d.bookNo], 'เบอร์โทร')
            // s.cusName = (s.cusName.length > 0) ? s.cusName[0].fieldValue : ''
            // s.cusReg = (s.cusReg.length > 0) ? s.cusReg[0].fieldValue : ''
            // s.tel = (s.tel.length > 0) ? s.tel[0].fieldValue : ''
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
        console.log('dataItemTime2', this.dataItemTime)
        // await this.getTimesChange('update')
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
    async getEmpSelect (item) {
      console.log('item!!!!!!', item)
      this.empSelectStep = []
      await axios
        .get(
          this.DNS_IP +
          '/empSelect/getUse?privacyPage=booking&shopId=' +
          item.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              // console.log('d', d)
              if (d.masBranchID === item.masBranchID) {
                var s = {}
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
          '/empSelect/getUse?USER_ROLE=onsite&shopId=' +
          this.$session.getAll().data.shopId
        )
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
              var d = rs[i]
              console.log('DDDDDSFDSDFSDF', d)
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
            console.log(
              '>>>>>>this.$session.getAll().data.empId',
              this.$session.getAll().data.empId
            )
            if (
              this.$session.getAll().data.empId !== '' &&
              this.$session.getAll().data.empId !== null
            ) {
              try {
                this.empSelectAdd = this.empSelectStepAdd.filter(
                  item =>
                    item.value === parseInt(this.$session.getAll().data.empId)
                )[0].value
              } catch (err) { }
            }
            console.log('this.empSelectStepAdd', this.empSelectStepAdd)
          }
        })
    }
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  height: 100%;
}

iframe {
  flex: 1;
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

#autocompleteMap {
  border: 1px solid rgba(0, 60, 255, 0.329);
  background: #fff;
  font-size: 18px;
  height: 35px;
  /* left: 40%; */
  padding: 0 10px;
  /* position: absolute; */
  top: 0;
  width: 90%;
  z-index: 1;
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

.pictureMenuEdit {
  width: 100px;
  height: 100px;

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

.v-input--selection-controls {
  margin-top: 0px !important;
}

.status-cloumn {
  width: 150px;
  border-radius: 20px;
  /* มุมโค้ง */
  padding: 10px 20px;
  /* ระยะห่างภายใน */
  color: white;
  /* สีข้อความ */
  font-size: 16px;
  /* ขนาดตัวอักษร */
  text-align: center;
  /* จัดข้อความให้อยู่กลาง */
  text-decoration: none;
  /* ลบเส้นขีดล่างของลิงค์ */
  display: inline-block;
  /* แสดงผลเป็นบล็อกแบบอินไลน์ */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* เงา */
  margin: 10px;
  /* ระยะห่างภายนอก */
}
</style>
