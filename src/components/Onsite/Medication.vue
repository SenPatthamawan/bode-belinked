<template>
   <div>
     <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
     <v-main>
       <v-dialog
       v-model="dialogMain"
       scrollable
       fullscreen
     >
       <v-card style="border-radius: 0px;">
         <v-card-title style="display: flex;justify-content: space-between;" class="pt-10">
           <v-btn
               v-show="step === 2"
               class="mx-2"
               icon
               color="primary"
               @click="step === 2 ? step = 1 : step = 2"
             >
               <v-icon dark large>
                 mdi-arrow-left-bold-circle
               </v-icon>
             </v-btn>
            <h2 class="text-center">บันทึกข้อมูลยา</h2>
            <v-btn
               class="mx-2"
               icon
               color="black"
               @click="dialogMain = false"
             >
               <v-icon dark large>
                 mdi-close-circle
               </v-icon>
             </v-btn>
         </v-card-title>
         <v-simple-table v-if="jobDrug && step == 0">
           <template v-slot:default>
             <thead>
               <tr>
                 <th class="text-left">
                   ชื่อยา
                 </th>
                 <th class="text-left">
                   ประเภท
                 </th>
                 <th class="text-left">
                   วิธีใช้
                 </th>
               </tr>
             </thead>
             <tbody>
               <tr
                 v-for="item in jobDrug"
                 :key="item.id"
               >
                 <td>{{ item.drug_name }}</td>
                 <td>{{ (item.usage_type === 'external' ? 'ยาภายนอก' : 'ยากิน') }}</td>
                 <td>{{ item.usage_detail }}</td>
                 <td>
                   <v-btn
                     small
                     class="btnCL"
                     color="red"
                     dark
                     @click="delJoyRideJobDrug(item)"
                     >ลบ
                   </v-btn>
                 </td>
               </tr>
             </tbody>
           </template>
         </v-simple-table>
         <h3 v-else-if="step == 0" class="pt-10 mx-auto">ยังไม่ได้บันทึกข้อมูลยา</h3>
         <v-btn
           v-if="step === 0"
           x-large
           rounded
           class="btnCL mx-auto mt-8"
           color="primary"
           @click="step = 1"
           >เพิ่มข้อมูลยา
         </v-btn>
         <!-- <v-divider></v-divider> -->
         <v-card-text v-if="step === 1" class="mt-10">
           <h3 class="text-center mx-auto pb-4">เลือกยา</h3>
           <!-- <p class="font-weight-black">ชื่อยา</p> -->
           <!-- <v-text-field
             v-model="searchMedication"
             label="ค้นหา"
           ></v-text-field> -->
           <v-autocomplete
             :search-input.sync="searchMedication"
             v-model="MedicationSelect"
             :items="itemMedication"
             outlined
             hide-no-data
             clearable
             label="ชื่อยา"
             prepend-icon="mdi-database-search"
             :menu-props="{ bottom: true, offsetY: true }"
             @change="(event) => selectMedicine(event)"
           >
           <template slot="item" slot-scope="data">
               <p class="text-wrap" style="color: #fcfdfd;">
                 {{ data.item.name}}
               </p>
             </template>
           </v-autocomplete>
           <!-- <v-select
           class="mb-5"
           v-model="MedicationSelect"
           :items="itemMedication"
           outlined
           attach
           :menu-props="{ bottom: true, offsetY: true }"
           label="ชื่อยา"
           ></v-select> -->
           <v-sheet
             v-if="loadSelectMed"
             color="grey lighten-4"
             class="pa-3"
           >
             <v-skeleton-loader
               v-if="subMedication.length <= 0"
               class="mx-auto"
               max-width="300"
               type="card"
             ></v-skeleton-loader>
           </v-sheet>
           <v-card
               v-if="medSelect"
               class="mx-auto"
               max-width="344"
               outlined
               dark
               color="#888888"
             >
               <v-list-item three-line>
                 <v-list-item-content>
                   <div class="text-overline mb-4">
                     ยาที่เลือก
                   </div>
                   <div class="text-h6 mb-1">
                     {{ medSelect.name }}
                   </div>
                   <v-list-item-subtitle>{{subMedication.activeIngredient}}</v-list-item-subtitle>
                 </v-list-item-content>
               </v-list-item>
               <v-card-text class="px-2 py-2 mb-6">
                 <span v-if="subMedication.usage"><b>วิธีใช้</b>: {{ subMedication.usage }}<br><br></span>
                 <span v-if="subMedication.sideEffect"><b>ผลข้างเคียง</b>: {{ subMedication.sideEffect }}</span>
               </v-card-text>
             </v-card>
         </v-card-text>
         <v-card-text v-else-if="step === 2" class="mt-10">
             <h3 class="text-center mx-auto pb-4">กำหนดวิธีการใช้ยา</h3>
             <h4 class="textTitle mx-auto">ชื่อยา : {{medSelect.name}}</h4>
             <!-- <h6 class="textTitle"> ข้อควรระวัง : {{subMedication.warning}}</h6> -->
             <!-- <div v-if="item.type === 'กิน'">
               {{ 'test' }}
             </div> -->
             <v-container
               class="pa-3"
               fluid
             >
             <v-form
               ref="form"
               v-model="valid"
               lazy-validation
             >
             <v-radio-group
               v-model="usage.type"
               row
               required
             >
               <v-radio
                 label="ยาใช้ภายนอก"
                 value="external"
               ></v-radio>
               <v-radio
                 label="ยากิน"
                 value="internal"
               ></v-radio>
             </v-radio-group>
               <v-radio-group
               v-if="usage.type === 'internal'"
               v-model="formAdd.typeMedication"
               required
               >
                 <div class="mb-2" style="display: flex;justify-content: flex-start;align-items: center;">
                     <h5 class="ma-0">รับประทานครั้งละ </h5>
                     <div class="px-2" style="width: 80px;">
                       <v-text-field
                       type="number"
                       v-model="usage.qty_per_time"
                       outlined
                       dense
                       hide-details
                       required
                     ></v-text-field>
                     </div>
                     <h5 class="ma-0"> เม็ด</h5>
                 </div>
                 <v-radio
                   class="mb-3"
                   label="ก่อนอาหาร"
                   value="before"
                   @click="usage.eat_when = 'before'"
                 ></v-radio>
                   <div v-if="usage.eat_when === 'before'" style="display: flex;justify-content: space-around;">
                     <v-checkbox
                       class="mt-0"
                       v-model="usage.eat_morning"
                       label="เช้า"
                       value="Y"
                     ></v-checkbox>
                     <v-checkbox
                     class="mt-0"
                       v-model="usage.eat_noon"
                       label="กลางวัน"
                       value="Y"
                     ></v-checkbox>
                     <v-checkbox
                     class="mt-0"
                       v-model="usage.eat_dinner"
                       label="เย็น"
                       value="Y"
                     ></v-checkbox>
                   </div>
                 <v-radio
                   class="mb-3"
                   label="หลังอาหาร"
                   value="after"
                   @click="usage.eat_when = 'after'"
                 ></v-radio>
                 <div v-if="usage.eat_when === 'after'" style="display: flex;justify-content: space-around;">
                     <v-checkbox
                       class="mt-0"
                       v-model="usage.eat_morning"
                       label="เช้า"
                       value="Y"
                     ></v-checkbox>
                     <v-checkbox
                       class="mt-0"
                       v-model="usage.eat_noon"
                       label="กลางวัน"
                       value="Y"
                     ></v-checkbox>
                     <v-checkbox
                       class="mt-0"
                       v-model="usage.eat_dinner"
                       label="เย็น"
                       value="Y"
                     ></v-checkbox>
                   </div>
                 <v-radio
                   class="mb-3"
                   label="ก่อนนอน"
                   value="sleep"
                   @click="usage.eat_when = 'sleep'"
                 ></v-radio>
                 <v-radio
                   class="mb-3"
                   label="ระบุเวลา"
                   value="specify"
                   @click="usage.eat_when = 'specify'"
                 ></v-radio>
                 <div class="ml-6 mb-2" v-if="usage.eat_when === 'specify'" style="display: flex;justify-content: flex-start;align-items: center;">
                     <p class="ma-0">ทุก </p>
                     <div class="px-2" style="width: 80px;">
                       <v-text-field
                       type="number"
                       outlined
                       dense
                       hide-details
                       v-model="usage.specify_time_hour"
                     ></v-text-field>
                     </div>
                     <p class="ma-0"> ชั่วโมง</p>
                   </div>
                 <v-radio
                   class="mb-3"
                   label="เมื่อมีอาการ"
                   value="effect"
                   @click="usage.eat_when = 'effect'"
                 ></v-radio>
               </v-radio-group>
               <v-textarea
                 v-if="usage.type === 'external'"
                 v-model="usage.description"
                 outlined
                 name="input-7-4"
                 label="โปรดระบุการใช้ยา"
               ></v-textarea>
             </v-form>
             </v-container>
         </v-card-text>
         <!-- <v-divider></v-divider> -->
         <v-card-actions class="btnCenter pa-6">
             <v-btn
               v-if="step === 1"
               x-large
               :disabled="(MedicationSelect === '' || MedicationSelect === null) ? true : false"
               rounded
               class="btnCL"
               color="primary"
               @click="submitStepOne()"
               >ถัดไป
             </v-btn>
             <v-btn
               v-else-if="step === 2"
               x-large rounded class="btnCL"
               color="primary"
               @click="submitStepTwo()"
               >บันทึก
             </v-btn>
             <v-btn v-else-if="step === 3"  x-large rounded class="btnCL" color="primary" @click="stepThree()">เพิ่มรายการยา</v-btn>
         </v-card-actions>
       </v-card>
     </v-dialog>
     </v-main>
   </div>
 </template>
<script>
import axios from 'axios' // api

export default {
  name: 'Medication',
  components: {
  },
  watch: {
    // whenever question changes, this function will run
    async searchMedication (newQuestion, oldQuestion) {
      // console.log(newQuestion, oldQuestion)
      if (newQuestion === null) {
        this.itemMedication = []
        this.clearFormAdd()
      }
      if (newQuestion.length > 3) {
        await this.getMedicine(newQuestion)
      } else {
        this.itemMedication = []
        this.clearFormAdd()
      }
      // console.log('itemMedication', this.itemMedication)
    }
  },
  data () {
    return {
      jobData: null,
      jobDrug: null,
      medAPI: {
        url: 'https://med-instruct.sati.co.th/api/',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im9oazJmcWpzdnp0eW5hcTR4MWd0ayIsImlhdCI6MTY5NDc1MDYyOX0.iex6X0_pvvud0STGEUgwrYwAE5TQ7P6B9R1wO_yB3VQ'
      },
      valid: true,
      dialogMain: false,
      step: 0,
      searchMedication: '',
      MedicationSelect: '',
      itemMedication: [],
      allMedication: [],
      subMedication: [],
      selected: [],
      typeMain: '',
      formAdd: {
        id: '',
        name: '',
        tmtId: '',
        typeMedication: '',
        subMedication: []
      },
      loadSelectMed: false,
      medSelect: null,
      usage: {
        type: '',
        description: '',
        qty_per_time: '0',
        eat_when: '',
        eat_morning: null,
        eat_noon: null,
        eat_dinner: null,
        specify_time_hour: ''
      },
      joyRideDrug: null
    }
  },
  async mounted () {
    console.log('jobNo Medicine', this.jobNo)
  },
  methods: {
    async openDialog (item) {
      this.step = 0
      this.clearFormAdd()
      this.jobData = item
      await this.getJoyRideJobDrug()
      this.dialogMain = true
    },
    async selectMedicine (event) {
      try {
        this.loadSelectMed = true
        let medSelect = this.itemMedication.filter((row) => { return row.id === event })
        if (medSelect.length > 0) {
          this.medSelect = medSelect[0]
          await this.getMedicineInstruction(medSelect[0]['vtmId'])
        }
        console.log('selectMedicine', event, medSelect)
        this.loadSelectMed = false
      } catch (err) {
        console.log('selectMedicine', err)
      }
    },
    async clearFormAdd () {
      this.medSelect = null
      this.subMedication = []
      this.MedicationSelect = ''
      this.usage = {
        type: '',
        description: '',
        qty_per_time: '0',
        eat_when: '',
        eat_morning: null,
        eat_noon: null,
        eat_dinner: null,
        specify_time_hour: ''
      }
    },
    async submitStepOne () {
      try {
        this.step = 2
      } catch (err) {
        console.log('submitStepOne', err)
      }
    },
    async submitStepTwo () {
      await this.getJoyRideDrug()
      if (!this.joyRideDrug) {
        await this.addJoyRideDrug()
      }
      await this.addJoyRideJobDrug()
      await this.getJoyRideJobDrug()
      this.clearFormAdd()
      this.step = 0
    },
    async addJoyRideJobDrug () {
      try {
        const params = {
          jobNo: this.jobData['jobNo'],
          userId: this.jobData['userId'],
          drugId: this.medSelect['id'],
          usage_type: this.usage.type,
          usage_description: this.usage.description,
          usage_qty_per_time: this.usage.qty_per_time,
          usage_eat_when: this.usage.eat_when,
          usage_eat_morning: this.usage.eat_morning,
          usage_eat_noon: this.usage.eat_noon,
          usage_eat_dinner: this.usage.eat_dinner,
          usage_specify_time_hour: this.usage.specify_time_hour
        }
        let config = {
          method: 'post',
          url: `${this.DNS_IP}/joyride_job_drug/add`,
          data: params
        }
        await axios.request(config)
      } catch (err) {
        console.log('addJoyRideJobDrug', err)
      }
    },
    async delJoyRideJobDrug (item) {
      try {
        let params = {
          LAST_USER: this.$session.getAll().data.userName
        }
        let config = {
          method: 'post',
          url: `${this.DNS_IP}/joyride_job_drug/delete/${item.id}`,
          data: params
        }
        await axios.request(config)
          .then(async () => {
            await this.getJoyRideJobDrug()
          })
      } catch (err) {
        console.log('delJoyRideJobDrug', err)
      }
    },
    async addJoyRideDrug () {
      try {
        const params = {
          drugId: this.medSelect['id'],
          drug_tmtId: this.medSelect['tmtId'],
          drug_vmtId: this.medSelect['vtmId'],
          drug_type: this.medSelect['type'],
          drug_name: this.medSelect['name'],
          drug_Interaction: this.subMedication['drugInteraction'],
          drug_sideEffect: this.subMedication['sideEffect'],
          drug_usage: this.subMedication['usage'],
          drug_warning: this.subMedication['warning']
        }
        let config = {
          method: 'post',
          url: `${this.DNS_IP}/joyride_drug/add`,
          data: params
        }
        await axios.request(config)
      } catch (err) {
        console.log('getJoyRideDrug', err)
      }
    },
    async getJoyRideJobDrug () {
      try {
        let config = {
          method: 'get',
          url: `${this.DNS_IP}/joyride_job_drug/get?jobNo=${this.jobData['jobNo']}`
        }
        await axios.request(config)
          .then((response) => {
            let rs = response.data
            if (rs.status === false) {
              this.jobDrug = null
            } else {
              rs = rs.map((row) => {
                if (row.usage_type === 'external') {
                  row['usage_detail'] = row.usage_description
                } else {
                  let detail = `${row.usage_qty_per_time} เม็ด `
                  if (row.usage_eat_when === 'before') {
                    detail += 'ก่อนอาหาร ('
                    detail += (row.usage_eat_morning) ? ' เช้า' : ''
                    detail += (row.usage_eat_noon) ? ' กลางวัน' : ''
                    detail += (row.usage_eat_dinner) ? ' เย็น' : ''
                    detail += ')'
                  } else if (row.usage_eat_when === 'after') {
                    detail += 'หลังอาหาร ('
                    detail += (row.usage_eat_morning) ? ' เช้า' : ''
                    detail += (row.usage_eat_noon) ? ' กลางวัน' : ''
                    detail += (row.usage_eat_dinner) ? ' เย็น' : ''
                    detail += ')'
                  } else if (row.usage_eat_when === 'sleep') {
                    detail += 'ก่อนนอน'
                  } else if (row.usage_eat_when === 'specify') {
                    detail += `ทุก ${row.usage_specify_time_hour} ชม.`
                  } else if (row.usage_eat_when === 'effect') {
                    detail += `เมื่อมีอาการ`
                  }
                  row['usage_detail'] = detail
                }
                return row
              })
              this.jobDrug = rs
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } catch (err) {
        console.log('getJoyRideDrug', err)
      }
    },
    async getJoyRideDrug () {
      try {
        let config = {
          method: 'get',
          url: `${this.DNS_IP}/joyride_drug/get?drugId=${this.medSelect['id']}`
        }
        await axios.request(config)
          .then((response) => {
            let rs = response.data
            if (rs.status === false) {
              this.joyRideDrug = null
            } else {
              this.joyRideDrug = rs
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } catch (err) {
        console.log('getJoyRideDrug', err)
      }
    },
    async getMedicineInstruction (id) {
      try {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${this.medAPI.url}medicine-instruction/${id}`,
          headers: {
            'Authorization': `Bearer ${this.medAPI.token}`
          }
        }

        await axios.request(config)
          .then((response) => {
            let rs = response.data
            if (rs.status === false) {
              this.subMedication = {}
            } else {
              this.subMedication = rs
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } catch (err) {
        console.log('getMedicineInstruction', err)
      }
    },
    async getMedicine (term) {
      try {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${this.medAPI.url}search-transform?term=${term}`,
          headers: {
            'Authorization': `Bearer ${this.medAPI.token}`
          }
        }

        await axios.request(config)
          .then((response) => {
            this.itemMedication = []
            let rs = response.data
            if (rs.length > 0) {
              this.allMedication = rs
              for (let i = 0; i < rs.length; i++) {
                let obj = rs[i]
                obj.text = obj.name
                obj.value = obj.id
                this.itemMedication.push(obj)
              }
            } else {
              this.itemMedication = []
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } catch (err) {
        console.log('getMedicine', err)
      }
    }
  }
}
</script>
 <style scoped>
 .v-select__slot {
   white-space: normal;
   word-break: break-all;
 }
 .btnCenter{
   display: flex;
   justify-content: center;
 }
 .btnCL{
   width: 50%;
 }
 .textTitle {
   color:black;
 }
 </style>
