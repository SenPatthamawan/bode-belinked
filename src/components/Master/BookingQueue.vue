<template>
  <transition name="slide">
    <div class="slidein" v-if="drawer" :style="'max-width:' + width + ' !important'">
      <h4 class="ml-6" @click="toggle()">ตรวจสอบคิวจองรายวัน</h4>
      <v-row no-gutters>
        <v-col cols="12">
          <v-menu ref="menu" v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y
            max-width="290px" min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="timeTable" label="วันที่นัดลูกค้า" persistent-hint dense outlined readonly required
                :rules="[rules.required]" prepend-icon="mdi-calendar" v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="timeTable" no-title
              @input="(menu1 = false), getTimesChange('update')"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="$session.getAll().data.USER_ROLE !== 'booking'">
        <v-col class="pt-0" cols="auto" v-if="dataItemTimesChange.filter(el => {
      return el.statusBt === 'confirmJob' || el.statusBt === 'confirm';
    }).length > 0
      ">
          <v-btn color="primary" small @click="exportExcel()" dark>
            <v-icon right dark>mdi-microsoft-excel</v-icon>
            &nbsp;Export
          </v-btn>
        </v-col>
        <v-col class="pt-0" cols="auto" v-if="dataRemoveExport.length > 0">
          <v-btn color="error" small @click="exportExcelRemove()" dark>
            <v-icon right dark>mdi-microsoft-excel</v-icon>
            &nbsp;Export รายการยกเลิก
          </v-btn>
        </v-col>
        <v-col class="pt-0" cols="auto" v-if="dataItemTimesChange.filter(el => {
      return el.statusBt === 'confirmJob' || el.statusBt === 'confirm';
    }).length > 0
      && $session.getAll().data.category === 'ธุรกิจรถยนต์' && $session.getAll().data.shopId === 'U9084920b3005bd1dcb57af1ae6bdba32'
      ">
          <v-btn color="normal" small @click="exportExcelMazda()" dark>
            <v-icon right dark>mdi-microsoft-excel</v-icon>
            &nbsp;Mazda Export
          </v-btn>
        </v-col>
      </v-row>
      <button class="close-btn" @click="toggle()">X</button>
      <!-- <v-simple-table dense>
         <tbody> -->
      <v-row>
        <v-col cols="12" class="pt-0 pb-0">
          <strong>
            {{
      "รายการนัดหมายทั้งหมด " +
      dataItemTimesChange.filter(el => {
        return (
          el.statusBt === "confirmJob" || el.statusBt === "confirm"
        );
      }).length
    }}{{
        $session.getAll().data.category === "ธุรกิจรถยนต์"
          ? " คัน"
          : " รายการ"
      }}
            /
            {{
        branch.filter(row => {
          return row.allData.masBranchID === masBranchID;
        })[0].allData.countCus
      }}{{
        $session.getAll().data.category === "ธุรกิจรถยนต์"
          ? " คัน"
          : " รายการ"
      }}
          </strong>
        </v-col>
        <!-- {{dataItemTimesChange.filter(el => { return (el.statusBt==='confirmJob' || el.statusBt==='confirm') })}} -->
        <v-col cols="12" class="pt-0 pb-0">
          <v-chip-group column>
            <template v-for="(item, index) in dataCount">
              <v-chip :color="'grey lighten-5'" v-bind:key="'chip' + index" class="text-wrap">
                {{ item.name + " : " + item.count }}{{
      $session.getAll().data.category === "ธุรกิจรถยนต์"
        ? " คัน"
        : " รายการ"
    }}
              </v-chip>
            </template>
          </v-chip-group>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-expansion-panels>
          <v-expansion-panel v-for="(item, indexitem) in masterTime" :key="indexitem">
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="4">
                  {{ item }}
                </v-col>
                <v-col cols="8" class="text--secondary">
                  <v-fade-transition leave-absolute>
                    <span v-if="open &&
      dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          (el.statusBt === 'confirmJob' ||
            el.statusBt === 'confirm')
        );
      }).length > 0
      ">
                      {{
      "รายการนัดหมาย " +
      dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          (el.statusBt === "confirmJob" ||
            el.statusBt === "confirm")
        );
      }).length
    }}{{
        $session.getAll().data.category === "ธุรกิจรถยนต์"
          ? " คัน"
          : " รายการ"
      }}
                    </span>
                    <span v-if="open &&
      dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          (el.statusBt === 'confirmJob' ||
            el.statusBt === 'confirm')
        );
      }).length === 0
      ">
                      ไม่มีรายการนัดหมาย</span>
                    <v-row v-if="!open &&
      dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          (el.statusBt === 'confirmJob' ||
            el.statusBt === 'confirm')
        );
      }).length > 0
      " no-gutters style="width: 100%;justify-content: end;">
                      <v-col cols="10" style="display:contents" class="text-right">
                        <div class="mt-1 mr-1" style="display:flex;justify-content: right;" v-if="dataItemTimesChange.filter(el => {
      return (
        el.timeDueHtext === item &&
        el.fastTrack &&
        (el.statusBt === 'confirmJob' ||
          el.statusBt === 'confirm')
      );
    }).length > 0 &&
      $session.getAll().data.category !== 'ธุรกิจรถยนต์'
      ">
                          <div
                            style="background-color:#F57C00;padding-left: 4px;padding-right: 4px;border-top-left-radius: 9px;border-bottom-left-radius: 9px;">
                            <v-icon style="font-size: 20px;" color="white" class="iconify" data-icon="line-md:alert">
                            </v-icon>
                          </div>
                          <div
                            style="margin: auto 0;padding-left: 3px;border: 1px solid #F57C00;padding: 3px 7px;border-top-right-radius: 10px;border-bottom-right-radius: 10px;font-size: 14px;">
                            {{
      dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          el.fastTrack &&
          (el.statusBt === "confirmJob" ||
            el.statusBt === "confirm")
        );
      }).length + " รายการ"
    }}
                          </div>
                        </div>
                        <v-chip class="ma-2" color="orange darken-1" dark label small v-if="dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          el.fastTrack &&
          (el.statusBt === 'confirmJob' ||
            el.statusBt === 'confirm')
        );
      }).length > 0 &&
      $session.getAll().data.category === 'ธุรกิจรถยนต์'
      ">
                          <v-icon left>
                            mdi-flash
                          </v-icon>
                          {{
      dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          el.fastTrack &&
          (el.statusBt === "confirmJob" ||
            el.statusBt === "confirm")
        );
      }).length
    }}{{
        $session.getAll().data.category === "ธุรกิจรถยนต์"
          ? " คัน"
          : " รายการ"
      }}
                        </v-chip>
                        <div class="mt-1 mr-1" style="display:flex;justify-content: right;" v-if="dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          el.extraJob &&
          (el.statusBt === 'confirmJob' ||
            el.statusBt === 'confirm')
        );
      }).length > 0 &&
      $session.getAll().data.category !== 'ธุรกิจรถยนต์'
      ">
                          <div
                            style="background-color:#C62828;padding-left: 4px;padding-right: 4px;border-top-left-radius: 9px;border-bottom-left-radius: 9px;">
                            <v-icon style="font-size: 20px;" color="white" class="iconify" data-icon="line-md:alert">
                            </v-icon>
                          </div>
                          <div
                            style="margin: auto 0;padding-left: 3px;border: 1px solid #C62828;padding: 3px 7px;border-top-right-radius: 10px;border-bottom-right-radius: 10px;font-size: 14px;">
                            {{
      dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          el.extraJob &&
          (el.statusBt === "confirmJob" ||
            el.statusBt === "confirm")
        );
      }).length + " รายการ"
    }}
                          </div>
                        </div>
                        <v-chip class="ma-2" color="red darken-1" dark label small v-if="dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          el.extraJob &&
          (el.statusBt === 'confirmJob' ||
            el.statusBt === 'confirm')
        );
      }).length > 0 &&
      $session.getAll().data.category === 'ธุรกิจรถยนต์'
      ">
                          <v-icon left>
                            mdi-alarm-plus
                          </v-icon>
                          {{
      dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          el.extraJob &&
          (el.statusBt === "confirmJob" ||
            el.statusBt === "confirm")
        );
      }).length
    }}{{
        $session.getAll().data.category === "ธุรกิจรถยนต์"
          ? " คัน"
          : " รายการ"
      }}
                        </v-chip>
                        <div class="mt-1 mr-1" style="display:flex;justify-content: right;" v-if="dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          !el.fastTrack &&
          !el.extraJob &&
          (el.statusBt === 'confirmJob' ||
            el.statusBt === 'confirm')
        );
      }).length > 0 &&
      $session.getAll().data.category !== 'ธุรกิจรถยนต์'
      ">
                          <div
                            style="background-color:#3476CC;padding-left: 4px;padding-right: 4px;border-top-left-radius: 9px;border-bottom-left-radius: 9px;">
                            <v-icon style="font-size: 20px;" color="white" class="iconify" data-icon="line-md:alert">
                            </v-icon>
                          </div>
                          <div
                            style="margin: auto 0;padding-left: 3px;border: 1px solid #3476CC;padding: 3px 7px;border-top-right-radius: 10px;border-bottom-right-radius: 10px;font-size: 14px;">
                            {{
      dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          !el.fastTrack &&
          !el.extraJob &&
          (el.statusBt === "confirmJob" ||
            el.statusBt === "confirm")
        );
      }).length + " รายการ"
    }}
                          </div>
                        </div>
                        <v-chip class="ma-2" color="primary" label small v-if="dataItemTimesChange.filter(el => {
        return (
          el.timeDueHtext === item &&
          !el.fastTrack &&
          !el.extraJob &&
          (el.statusBt === 'confirmJob' ||
            el.statusBt === 'confirm')
        );
      }).length > 0 &&
      $session.getAll().data.category === 'ธุรกิจรถยนต์'
      ">
                          <v-icon left>
                            {{
      $session.getAll().data.category === "ธุรกิจรถยนต์"
        ? "mdi-car-multiple"
        : "mdi-account-box-multiple"
    }}
                          </v-icon>
                          {{
        dataItemTimesChange.filter(el => {
          return (
            el.timeDueHtext === item &&
            !el.fastTrack &&
            !el.extraJob &&
            (el.statusBt === "confirmJob" ||
                          el.statusBt === "confirm")
                          );
                          }).length
                          }}{{
                          $session.getAll().data.category === "ธุรกิจรถยนต์"
                          ? " คัน"
                          : " รายการ"
                          }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <!-- <v-expansion-panel-header>{{item + '(' + dataItemTimesChange.filter(el => { return el.timeDueHtext === item && (el.statusBt==='confirmJob' || el.statusBt==='confirm') }).length + ')'}}</v-expansion-panel-header> -->
            <v-expansion-panel-content v-for="(items, indexitems) in dataItemTimesChange.filter(el => {
      return (
        el.timeDueHtext === item &&
        (el.statusBt === 'confirmJob' || el.statusBt === 'confirm')
      );
    })" :key="'td' + indexitems">
              <v-card :color="items.fastTrack
        ? 'orange darken-1'
        : items.extraJob
          ? 'red darken-1'
          : '#1B437C'
      ">
                <v-container class="pt-0 pb-0">
                  <v-list-item class="pa-0" :style="items.fastTrack
        ? 'background-color:#FB8C00 !important'
        : items.extraJob
          ? 'background-color: #E53935 !important'
          : ''
      ">
                    <v-icon large dark left v-if="$session.getAll().data.category === 'ธุรกิจรถยนต์'">
                      mdi-car-wash
                    </v-icon>
                    <v-list-item-content>
                      <v-list-item-title class="pt-0 pb-0 text-wrap">{{
                        items.flowName
                        }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-card-text>
                    <v-row align="center" justify="end">
                      <v-icon dark class="mr-1" v-if="items.fastTrack">
                        mdi-flash
                      </v-icon>
                      <v-icon dark class="mr-1" v-else-if="items.extraJob">
                        mdi-alarm-plus
                      </v-icon>
                      <v-icon dark class="mr-1" v-else>
                        mdi-clock-outline
                      </v-icon>
                      <span class="white--text mr-2" style="z-index:1;">{{
                        items.timeDuetext
                        }}{{
                        items.dueDateEnd
                        }}</span>
                    </v-row>
                  </v-card-text>
                  <v-card-text>
                    <v-row class="white--text">
                      <v-col cols="10" v-if="items.memberDataTag"  class="pt-0 pb-0">
                          <div class="pa-0 ma-0" v-if="items.memberDataTag.length > 0">
                            <v-chip v-for="(tag, index) in items.tagDataShow" :key="index" class="mr-2 mb-2">
                              {{ tag.text }}
                            </v-chip>
                          </div>
                      </v-col>
                      <v-col v-if="items.cusName" cols="12" class="pt-0 pb-0">
                        คุณ {{ items.cusName }}
                      </v-col>
                      <v-col v-if="items.tel" cols="12" class="pt-0 pb-0">
                        โทร {{ items.tel }}
                      </v-col>
                      <v-col v-if="items.cusReg" cols="12" class="pt-0 pb-0">
                        ทะเบียน {{ items.cusReg }}
                      </v-col>
                      <v-col v-if="items.bookingEmpFlowName" cols="12" class="pt-0">
                        พนักงาน {{ items.bookingEmpFlowName }}
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-container>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
      <!-- <template v-for="(item, indexitem) in masterTime">
            <tr :key="'tr'+indexitem">
               <td valign="top"><b>{{item}}</b></td>
               <td>
               <v-simple-table dense class="table_detail_2">
                  <tbody>
                  <tr v-for="(items, indexitems) in dataItemTimesChange.filter(el => { return el.timeDueHtext === item && (el.statusBt==='confirmJob' || el.statusBt==='confirm') })" :key="'td'+indexitems">
                     <v-card
                     elevation="10"
                     color="#1B437C"
                     >
                     <v-container class="pt-0 pb-0">
                        <v-list-item class="pa-0">
                           <v-icon
                           large
                           dark
                           left
                           >
                           mdi-car-wash
                           </v-icon>
                           <v-list-item-content>
                           <v-list-item-title class="pt-0 pb-0">{{items.flowName}}</v-list-item-title>
                           </v-list-item-content>
                           <v-row
                           align="center"
                           justify="end"
                           >
                           <v-icon dark class="mr-1">
                              mdi-clock-outline
                           </v-icon>
                           <span class="white--text mr-2">{{items.timeDuetext}}</span>
                           </v-row>
                        </v-list-item>
                     <v-card-text>
                        <v-row class="white--text">
                           <v-col cols="12" class="pt-0 pb-0">
                           คุณ {{items.cusName}}
                           </v-col>
                           <v-col cols="12" class="pt-0 pb-0">
                           ทะเบียน {{items.cusReg}}
                           </v-col>
                        </v-row>
                     </v-card-text>
                     </v-container>
                     </v-card>
                     <br>
                  </tr>
                  </tbody>
               </v-simple-table>
               </td>
            </tr>
         </template> -->
      <!-- </tbody>
         </v-simple-table> -->
    </div>
  </transition>
</template>
<script>
export default {
  props: [
    'branchParent',
    'masBranchIDParent',
    'drawerParent',
    'menu1Parent',
    'timeTableParent',
    'rulesParent',
    'masterTimeParent',
    'dataItemTimesChangeParent',
    'getTimesChangeParent',
    'exportExcelParent',
    'exportExcelMazdaParent',
    'toggleParent',
    'updateTimeTable',
    'dataRemoveExportParent',
    'exportExcelRemoveParent'
  ],
  components: {},
  created () { },
  computed: {
    width () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '100%'
        case 'sm':
          return '80%'
        case 'md':
          return '40%'
        case 'lg':
          return '40%'
        case 'xl':
          return '40%'
      }
    }
  },
  data () {
    return {
      branch: this.branchParent,
      masBranchID: this.masBranchIDParent,
      drawer: this.drawerParent,
      menu1: this.menu1Parent,
      timeTable: this.timeTableParent,
      rules: this.rulesParent,
      masterTime: this.masterTimeParent,
      dataItemTimesChange: this.dataItemTimesChangeParent,
      dataRemoveExport: this.dataRemoveExportParent,
      dataCount: []
    }
  },
  async mounted () {
    console.log('dataItemTimesChangeParent--', this.dataItemTimesChangeParent)
  },
  methods: {
    getTimesChange () {
      this.$emit('updateTimeTable', this.timeTable)
      this.getTimesChangeParent()
    },
    exportExcel () {
      this.exportExcelParent()
    },
    exportExcelRemove () {
      this.exportExcelRemoveParent()
    },
    exportExcelMazda () {
      this.exportExcelMazdaParent()
    },
    toggle () {
      this.toggleParent()
    }
  },
  watch: {
    masBranchIDParent () {
      this.masBranchID = this.masBranchIDParent
    },
    branchParent () {
      this.branch = this.branchParent
    },
    drawerParent () {
      this.drawer = this.drawerParent
    },
    menu1Parent () {
      this.menu1 = this.menu1Parent
    },
    timeTableParent () {
      this.timeTable = this.timeTableParent
    },
    rulesParent () {
      this.rules = this.rulesParent
    },
    masterTimeParent () {
      this.masterTime = this.masterTimeParent
    },
    dataRemoveExportParent () {
      this.dataRemoveExport = this.dataRemoveExportParent
    },
    dataItemTimesChangeParent () {
      this.dataCount = []
      this.dataItemTimesChange = this.dataItemTimesChangeParent
      for (var issue of this.dataItemTimesChange) {
        var entryFound = false
        if (issue.statusBt === 'confirmJob' || issue.statusBt === 'confirm') {
          var tempObj = {
            name: issue.flowName,
            count: 1
          }
          for (var item of this.dataCount) {
            if (item.name === tempObj.name) {
              item.count++
              entryFound = true
              break
            }
          }
          if (!entryFound) {
            this.dataCount.push(tempObj)
          }
        }
      }
    }
  }
}
</script>
<style scoped>
.slide-enter,
.slide-leave-active {
  right: -100%;
}

.close-btn {
  border: none;
  font-weight: bold;
  font-size: 2em;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5em;
}
</style>
